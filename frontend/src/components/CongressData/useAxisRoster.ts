import { useEffect, useState } from "react";
import type { RosterMember } from "./axisStats";

// Shared fetch for the lean per-axis roster (score/within_party_z/bill_count/
// current_percentile_rank only, no by_category or primary_categories) used
// by both the Congress Data compass chart and the legislator profile page's
// axis fingerprint -- one fetch, reused for every axis.
export function useAxisRoster(specHash: string | null): {
  roster: RosterMember[];
  loading: boolean;
  error: string | null;
} {
  const [roster, setRoster] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!specHash) {
      setRoster([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_API_URL}/api/legislators/profiles/${specHash}?lite=true`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch roster");
        return res.json();
      })
      .then((data: RosterMember[]) => {
        if (!cancelled) setRoster(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          console.error("Error fetching axis roster:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [specHash]);

  return { roster, loading, error };
}
