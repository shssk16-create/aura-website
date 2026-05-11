import { getCampaign, updateCampaign } from "@/lib/store";
import { runAgent } from "@/lib/orchestrator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Streams the campaign through its agent pipeline as server-sent events.
 * The browser consumes this and renders each agent's output live.
 *
 * Event format (one JSON object per `data:` line):
 *   { type: "agent_start", agentId }
 *   { type: "agent_delta", agentId, delta }
 *   { type: "agent_artefact", agentId, artefact }
 *   { type: "agent_done", agentId }
 *   { type: "pipeline_done" }
 *   { type: "error", message }
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const campaign = await getCampaign(id);
  if (!campaign) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "campaign not found" })}\n\n`,
      {
        status: 404,
        headers: { "Content-Type": "text/event-stream" },
      },
    );
  }

  await updateCampaign(id, (c) => ({ ...c, status: "running" }));

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        const input = {
          brand: campaign.brand,
          goal: campaign.goal,
          audience: campaign.audience,
          channel: campaign.channel,
          tone: campaign.tone,
        };

        for (const run of campaign.pipeline) {
          send({ type: "agent_start", agentId: run.agentId });
          await updateCampaign(id, (c) => ({
            ...c,
            pipeline: c.pipeline.map((r) =>
              r.agentId === run.agentId
                ? {
                    ...r,
                    status: "running",
                    startedAt: new Date().toISOString(),
                  }
                : r,
            ),
          }));

          let buffer = "";
          for await (const chunk of runAgent(run.agentId, input)) {
            if (chunk.delta) {
              buffer += chunk.delta;
              send({
                type: "agent_delta",
                agentId: chunk.agentId,
                delta: chunk.delta,
              });
            }
            const artefact = chunk.artefact;
            if (artefact) {
              send({
                type: "agent_artefact",
                agentId: chunk.agentId,
                artefact,
              });
              if (artefact.kind === "creative") {
                const { headlineAr, copyAr, cta } = artefact;
                await updateCampaign(id, (c) => ({
                  ...c,
                  creative: {
                    headlineAr,
                    copyAr,
                    cta,
                    imageUrl: c.creative?.imageUrl ?? null,
                  },
                }));
              } else if (artefact.kind === "image") {
                const imageUrl = artefact.url;
                await updateCampaign(id, (c) => ({
                  ...c,
                  creative: {
                    headlineAr: c.creative?.headlineAr ?? "",
                    copyAr: c.creative?.copyAr ?? "",
                    cta: c.creative?.cta ?? "",
                    imageUrl,
                  },
                }));
              }
            }
          }

          await updateCampaign(id, (c) => ({
            ...c,
            pipeline: c.pipeline.map((r) =>
              r.agentId === run.agentId
                ? {
                    ...r,
                    status: "completed",
                    completedAt: new Date().toISOString(),
                    output: buffer,
                  }
                : r,
            ),
          }));
          send({ type: "agent_done", agentId: run.agentId });
        }

        await updateCampaign(id, (c) => ({ ...c, status: "completed" }));
        send({ type: "pipeline_done" });
      } catch (err) {
        await updateCampaign(id, (c) => ({ ...c, status: "failed" }));
        send({
          type: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
