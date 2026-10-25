export interface AxisPole {
  label: string;
  description: string;
}

export interface AxisAnchorExample {
  description: string;
  position: number;
}

export interface AxisDefinition {
  id: string;
  name: string;
  tier: "keep" | "core" | "secondary" | "optional";
  source: "derived" | "llm" | "computed";
  computed: boolean;
  negative_pole: AxisPole;
  positive_pole: AxisPole;
  scoring_rule: string;
  boundary_rules: string[];
  typical_categories: { most: string[]; some: string[] };
  anchor_examples: AxisAnchorExample[];
}
