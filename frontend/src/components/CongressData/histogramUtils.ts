export interface Legislator {
  member_id: string;
  official_full_name: string;
  party: "D" | "R" | "I";
  state: string;
  score: number;
  bill_count: number;
}

export interface ScatterData {
  spec_hash: string;
  field: string;
  subject: string;
  chart_type: string;
  legislators: Legislator[];
  metadata: {
    correlation: number;
    total_count: number;
    score_range: [number, number];
    bill_count_range: [number, number];
    party_counts: {
      D: number;
      R: number;
      I: number;
    };
  };
}

export interface BinData {
  range: string;
  midLabel: string;
  D: number;
  R: number;
  I: number;
}

export interface PartyStats {
  mean: number | null;
  median: number | null;
  count: number;
  min: number | null;
  max: number | null;
  std: number | null;
}

const PARTIES = ["D", "R", "I"] as const;

export function computeDomain(
  scores: number[],
  paddingRatio = 0.1,
): [number, number] {
  if (scores.length === 0) return [-1, 1];

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const spread = max - min;

  const padding = spread < 0.01 ? 0.05 : spread * paddingRatio;

  return [Math.max(-1, min - padding), Math.min(1, max + padding)];
}

function formatScore(value: number, decimals: number): string {
  return value.toFixed(decimals);
}

function pickDecimals(width: number): number {
  return width >= 0.1 ? 2 : width >= 0.01 ? 3 : 4;
}

export function computeBins(
  scores: number[],
  domain: [number, number],
): { edges: number[]; labels: string[] } {
  const [lo, hi] = domain;
  const spread = hi - lo;
  const n = scores.length;

  if (n === 0 || spread === 0) {
    return { edges: [lo, hi], labels: [`${lo.toFixed(2)} to ${hi.toFixed(2)}`] };
  }

  const sturges = Math.ceil(Math.log2(n) + 1);
  const binCount = Math.min(20, Math.max(5, sturges));
  const binWidth = spread / binCount;

  const decimals = pickDecimals(binWidth);

  const edges = Array.from({ length: binCount + 1 }, (_, i) => lo + i * binWidth);
  const labels = Array.from({ length: binCount }, (_, i) =>
    `${formatScore(edges[i], decimals)} to ${formatScore(edges[i + 1], decimals)}`,
  );

  return { edges, labels };
}

export function computeBinnedData(legislators: Legislator[]): BinData[] {
  const scores = legislators.map((l) => l.score);
  const domain = computeDomain(scores);
  const { edges, labels } = computeBins(scores, domain);
  const binCount = labels.length;
  const lo = edges[0];
  const binWidth = (edges[edges.length - 1] - lo) / binCount;
  const decimals = pickDecimals(binWidth);

  const bins: BinData[] = labels.map((range, i) => ({
    range,
    midLabel: formatScore((edges[i] + edges[i + 1]) / 2, decimals),
    D: 0,
    R: 0,
    I: 0,
  }));

  for (const legislator of legislators) {
    const idx = Math.min(
      binCount - 1,
      Math.max(0, Math.floor((legislator.score - lo) / binWidth)),
    );
    bins[idx][legislator.party] += 1;
  }

  return bins;
}

export function computePartyStats(
  legislators: Legislator[],
): { D: PartyStats; R: PartyStats; I: PartyStats } {
  const result = {} as { D: PartyStats; R: PartyStats; I: PartyStats };

  for (const party of PARTIES) {
    const scores = legislators
      .filter((l) => l.party === party)
      .map((l) => l.score);
    const count = scores.length;

    if (count === 0) {
      result[party] = {
        mean: null,
        median: null,
        count: 0,
        min: null,
        max: null,
        std: null,
      };
      continue;
    }

    const mean = scores.reduce((a, b) => a + b, 0) / count;
    const sorted = [...scores].sort((a, b) => a - b);
    const median =
      count % 2 === 1
        ? sorted[(count - 1) / 2]
        : (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
    const variance =
      scores.reduce((sum, x) => sum + (x - mean) ** 2, 0) / count;

    result[party] = {
      mean,
      median,
      count,
      min: Math.min(...scores),
      max: Math.max(...scores),
      std: Math.sqrt(variance),
    };
  }

  return result;
}
