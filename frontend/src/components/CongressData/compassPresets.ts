import { subjectPoles } from "./subjectDisplayName";

export interface CompassQuadrants {
  tl: string;
  tr: string;
  bl: string;
  br: string;
}

export interface CompassPreset {
  id: string;
  label: string;
  x: string;
  y: string;
  quadrants: CompassQuadrants;
}

export const COMPASS_PRESETS: CompassPreset[] = [
  {
    id: "political_compass",
    label: "Political compass",
    x: "economic",
    y: "state_power",
    quadrants: {
      tl: "Authoritarian left",
      tr: "Authoritarian right",
      bl: "Libertarian left",
      br: "Libertarian right",
    },
  },
  {
    id: "party_loyalty",
    label: "Party loyalty",
    x: "left_right",
    y: "institutional",
    quadrants: {
      tl: "Insurgent left",
      tr: "Insurgent right",
      bl: "Establishment left",
      br: "Establishment right",
    },
  },
  {
    id: "hawks_budget",
    label: "Hawks & budget hawks",
    x: "fiscal",
    y: "security",
    quadrants: {
      tl: "Big-spending hawks",
      tr: "Budget hawks",
      bl: "Big-spending doves",
      br: "Frugal doves",
    },
  },
  {
    id: "america_first",
    label: "America First",
    x: "trade",
    y: "global",
    quadrants: {
      tl: "Free-trade sovereigntists",
      tr: "Nationalists",
      bl: "Globalists",
      br: "Protectionist multilateralists",
    },
  },
  {
    id: "economic_social",
    label: "Economic vs. social",
    x: "economic",
    y: "social",
    quadrants: {
      tl: "Collective traditionalists",
      tr: "Conservatives",
      bl: "Progressives",
      br: "Market progressives",
    },
  },
];

// Matches the exact (x, y) order a preset defines -- a swapped pair falls
// through to the synthesized "Pole · Pole" labels below rather than
// reusing a preset's labels in the wrong orientation.
export function findMatchingPreset(x: string, y: string): CompassPreset | null {
  return COMPASS_PRESETS.find((p) => p.x === x && p.y === y) ?? null;
}

export function quadrantLabels(
  x: string,
  y: string,
  preset: CompassPreset | null,
): CompassQuadrants {
  if (preset) return preset.quadrants;

  const xPoles = subjectPoles("axes", x);
  const yPoles = subjectPoles("axes", y);

  return {
    tl: `${xPoles.negative} · ${yPoles.positive}`,
    tr: `${xPoles.positive} · ${yPoles.positive}`,
    bl: `${xPoles.negative} · ${yPoles.negative}`,
    br: `${xPoles.positive} · ${yPoles.negative}`,
  };
}
