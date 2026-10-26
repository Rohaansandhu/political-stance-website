// Display labels for model ids returned by /api/bill-analyses/filters.
// Falls back to the raw id for any model not listed here.
const MODEL_LABELS: Record<string, string> = {
  "gpt-6-luna": "GPT-6 Luna",
  "gpt-5-mini": "GPT-5 Mini",
  "gpt-oss-120b": "GPT-OSS 120B",
  "openai/gpt-oss-120b:free": "GPT-OSS 120B (Free)",
  "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
  "gemini-3-flash-preview": "Gemini 3 Flash (Preview)",
  "llama3.3-70b": "Llama 3.3 70B",
  "qwen-3-32b": "Qwen 3 32B",
};

export const DEFAULT_MODEL = "gpt-6-luna";

export function modelLabel(model: string): string {
  return MODEL_LABELS[model] ?? model;
}

// Mirrors backend/config/models.js — must stay in sync with what's actually
// in legislator_profiles.spec_hash for each model. Used to build spec_hash
// client-side for the congress-data histogram/scatter/rankings endpoints.
const MODEL_SCHEMA_CONFIG: Record<string, { schema_version: number; axis_schema_version?: number }> = {
  "gpt-6-luna": { schema_version: 5, axis_schema_version: 1 },
  "gpt-5-mini": { schema_version: 4 },
  "gpt-oss-120b": { schema_version: 3 },
  "gemini-2.5-flash-lite": { schema_version: 3 },
  "llama3.3-70b": { schema_version: 3 },
  "qwen-3-32b": { schema_version: 3 },
};

export function buildSpecHash(model: string, chamber: string): string | null {
  const config = MODEL_SCHEMA_CONFIG[model];
  if (!config) return null;
  const axisSegment = config.axis_schema_version ? `_ax${config.axis_schema_version}` : "";
  return `${model}_${config.schema_version}${axisSegment}_all_${chamber}_all`;
}
