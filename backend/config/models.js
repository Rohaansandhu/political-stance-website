// Per-model schema configuration used to build legislator_profiles spec_hash
// values and to pick the canonical bill_analyses schema_version for each model.
//
// A model's schema_version/axis_schema_version here must match what's actually
// in MongoDB (legislator_profiles.spec_hash, bill_analyses.schema_version).
export const MODEL_SCHEMA_CONFIG = {
  "gpt-6-luna": { schema_version: 5, axis_schema_version: 1 },
  "gpt-5-mini": { schema_version: 4 },
  "gpt-oss-120b": { schema_version: 3 },
  "gemini-2.5-flash-lite": { schema_version: 3 },
  "llama3.3-70b": { schema_version: 3 },
  "qwen-3-32b": { schema_version: 3 },
};

export const DEFAULT_MODEL = "gpt-6-luna";

export function buildSpecHash(model, chamber) {
  const config = MODEL_SCHEMA_CONFIG[model];
  if (!config) return null;
  const axisSegment = config.axis_schema_version
    ? `_ax${config.axis_schema_version}`
    : "";
  return `${model}_${config.schema_version}${axisSegment}_all_${chamber}_all`;
}

// Matches each configured model against its own canonical schema_version, so
// a bill_analyses query returns at most one version per model.
export function buildModelSchemaOrClause() {
  return {
    $or: Object.entries(MODEL_SCHEMA_CONFIG).map(([model, config]) => ({
      model,
      schema_version: config.schema_version,
    })),
  };
}
