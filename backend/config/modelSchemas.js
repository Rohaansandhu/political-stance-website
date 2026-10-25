// Single source of truth for each model's latest schema version (and, where
// applicable, axis schema version). Mirrors frontend/src/utils/specHash.ts —
// keep both in sync when a new model/schema version ships.
export const MODEL_SCHEMAS = {
  "gpt-6-luna": { schemaVersion: 5, axisSchemaVersion: 1 },
  "gpt-5-mini": { schemaVersion: 4 },
  "gpt-oss-120b": { schemaVersion: 4 },
  "gemini-2.5-flash-lite": { schemaVersion: 4 },
  "llama3.3-70b": { schemaVersion: 3 },
  "qwen-3-32b": { schemaVersion: 3 },
};

export function buildSpecHash(model, chamber) {
  const spec = MODEL_SCHEMAS[model];
  if (!spec) return null;
  const axisSeg = spec.axisSchemaVersion ? `_ax${spec.axisSchemaVersion}` : "";
  return `${model}_${spec.schemaVersion}${axisSeg}_all_${chamber}_all`;
}
