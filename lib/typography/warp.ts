/**
 * Perspective-warp the shaped Arabic text layer onto the product's label
 * surface and composite it over the background image.
 *
 * @scaffold — the production path shells out to the Python sidecar
 * (`scripts/typography_pipeline.py`) which uses OpenCV
 * (`cv2.getPerspectiveTransform` + `cv2.warpPerspective`). The sidecar
 * is shipped in this repo; install its dependencies with:
 *
 *     pip install -r scripts/requirements.txt
 *
 * In environments where Python is unavailable, the fallback returns the
 * background unchanged. Callers should treat the function as best-effort
 * and check `result.imageDataUri !== req.backgroundDataUri` to detect
 * whether the warp actually applied.
 */

import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import type { WarpRequest, WarpResult } from "./types";

const PYTHON_BIN = process.env.AURA_PYTHON_BIN ?? "python3";
const SCRIPT_PATH = path.join(
  process.cwd(),
  "scripts",
  "typography_pipeline.py",
);

export async function warpAndComposite(req: WarpRequest): Promise<WarpResult> {
  try {
    const result = await runPythonSidecar(req);
    return result;
  } catch {
    // Sidecar unavailable — return the background unchanged so the caller
    // can decide how to surface the failure.
    return { imageDataUri: req.backgroundDataUri };
  }
}

async function runPythonSidecar(req: WarpRequest): Promise<WarpResult> {
  // Stage the inputs on disk so the Python script does not have to parse
  // megabyte-scale data URIs from argv.
  const stamp = crypto.randomBytes(6).toString("hex");
  const workDir = path.join(tmpdir(), `aura-typography-${stamp}`);
  await fs.mkdir(workDir, { recursive: true });

  const bgPath = path.join(workDir, "background.png");
  const textPath = path.join(workDir, "text.png");
  const outPath = path.join(workDir, "out.png");

  await fs.writeFile(bgPath, decodeDataUri(req.backgroundDataUri));
  await fs.writeFile(textPath, decodeDataUri(req.textDataUri));

  const denormalised = req.destination
    .map(
      ([nx, ny]) =>
        `${Math.round(nx * req.imageWidth)},${Math.round(
          ny * req.imageHeight,
        )}`,
    )
    .join(";");

  await new Promise<void>((resolve, reject) => {
    const child = spawn(PYTHON_BIN, [
      SCRIPT_PATH,
      "--background",
      bgPath,
      "--text",
      textPath,
      "--corners",
      denormalised,
      "--output",
      outPath,
    ]);
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`python sidecar exit=${code}: ${stderr.slice(0, 500)}`));
    });
    child.on("error", reject);
  });

  const out = await fs.readFile(outPath);
  await fs.rm(workDir, { recursive: true, force: true });
  return { imageDataUri: `data:image/png;base64,${out.toString("base64")}` };
}

function decodeDataUri(uri: string): Buffer {
  const m = uri.match(/^data:[^;]+;base64,(.*)$/);
  if (!m) {
    // Treat unknown shapes as already-base64 strings; failing here is
    // user-facing so be loud rather than silent.
    throw new Error("typography/warp: expected base64 data URI");
  }
  return Buffer.from(m[1], "base64");
}
