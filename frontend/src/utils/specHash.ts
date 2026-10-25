// Single source of truth for each model's latest schema version (and, where
// applicable, axis schema version) and display label. Mirrors
// backend/config/modelSchemas.js — keep both in sync when a new model or
// schema version ships.
export interface ModelSchemaInfo {
  schemaVersion: number;
  axisSchemaVersion?: number;
  label: string;
}

export const MODEL_SCHEMAS: Record<string, ModelSchemaInfo> = {
  "gpt-6-luna": { schemaVersion: 5, axisSchemaVersion: 1, label: "GPT-6 Luna" },
  "gpt-5-mini": { schemaVersion: 4, label: "GPT-5 Mini" },
  "gpt-oss-120b": { schemaVersion: 4, label: "GPT-OSS 120B" },
  "gemini-2.5-flash-lite": { schemaVersion: 4, label: "Gemini 2.5 Flash Lite" },
  "llama3.3-70b": { schemaVersion: 3, label: "Llama 3.3 70B" },
  "qwen-3-32b": { schemaVersion: 3, label: "Qwen 3 32B" },
};

export const DEFAULT_MODEL = "gpt-6-luna";

export function buildSpecHash(model: string, chamber: "house" | "senate"): string {
  const spec = MODEL_SCHEMAS[model];
  const axisSeg = spec?.axisSchemaVersion ? `_ax${spec.axisSchemaVersion}` : "";
  return `${model}_${spec?.schemaVersion}${axisSeg}_all_${chamber}_all`;
}

export function modelSupportsAxes(model: string): boolean {
  return Boolean(MODEL_SCHEMAS[model]?.axisSchemaVersion);
}
