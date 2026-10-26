import { useEffect, useState } from "react";

export interface AxisStatsEntry {
  n: number;
  mean: number | null;
  sd: number | null;
  min: number;
  max: number;
  by_party: Record<"D" | "R" | "I", { n: number; mean: number | null; sd: number | null }>;
}

export interface AxisCorrelation {
  r: number | null;
  n: number;
}

export interface AxisStatsDoc {
  spec_hash: string;
  current: boolean;
  member_count: number;
  min_bills: number;
  axes: Record<string, AxisStatsEntry>;
  correlations: {
    raw: Record<string, Record<string, AxisCorrelation>>;
    party: Record<string, Record<string, AxisCorrelation>>;
  };
}

// Fetches the pipeline's precomputed per-axis chamber stats and axis-pair
// correlation matrix (written by create_axis_stats.py). Used so the
// compass's displayed r agrees with the pipeline's own numbers instead of
// drifting from a slightly different client-side calculation.
export function useAxisStatsDoc(
  specHash: string | null,
  current = true,
): { stats: AxisStatsDoc | null; loading: boolean } {
  const [stats, setStats] = useState<AxisStatsDoc | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!specHash) {
      setStats(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/congress-data/${specHash}/axis-stats/${current}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AxisStatsDoc | null) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setStats(null);
          console.error("Error fetching axis stats:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [specHash, current]);

  return { stats, loading };
}

export function lookupCorrelation(
  stats: AxisStatsDoc | null,
  scale: "raw" | "party",
  xAxis: string,
  yAxis: string,
): number | null {
  return stats?.correlations?.[scale]?.[xAxis]?.[yAxis]?.r ?? null;
}
