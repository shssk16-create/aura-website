/**
 * Resolve an `AgentIcon` string to a Lucide React component. Used by every
 * surface that renders an agent (cards, pipeline, settings page) so adding
 * a new icon means touching this one map.
 */

import {
  Eye,
  Target,
  Lightbulb,
  PenLine,
  BarChart3,
  Palette,
  Share2,
  Search,
  Clapperboard,
  Sparkles,
  Megaphone,
  Bot,
  Brain,
  Wand2,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import type { AgentIcon as AgentIconName } from "@/lib/agents";

const ICONS: Record<AgentIconName, LucideIcon> = {
  Eye,
  Target,
  Lightbulb,
  PenLine,
  BarChart3,
  Palette,
  Share2,
  Search,
  Clapperboard,
  Sparkles,
  Megaphone,
  Bot,
  Brain,
  Wand2,
};

export function agentIcon(name: AgentIconName): LucideIcon {
  return ICONS[name] ?? Bot;
}

export { ArrowLeft };
