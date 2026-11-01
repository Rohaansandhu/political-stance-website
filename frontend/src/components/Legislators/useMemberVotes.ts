import { useEffect, useState } from "react";
import type { AxisCategoryCell, MemberVotesResponse } from "./types";

// Stale responses are dropped so quick filter or tab changes can't overwrite
// newer results.
function useFetchJson<T>(url: string | null): {
  data: T | null;
  loading: boolean;
  error: boolean;
} {
  const [state, setState] = useState<{
    url: string | null;
    data: T | null;
    error: boolean;
  }>({ url: null, data: null, error: false });

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data: T) => {
        if (!cancelled) setState({ url, data, error: false });
      })
      .catch((err) => {
        console.error("Error fetching member data:", err);
        if (!cancelled) setState({ url, data: null, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const isCurrent = state.url === url;
  return {
    data: isCurrent ? state.data : null,
    loading: Boolean(url) && !isCurrent,
    error: isCurrent && state.error,
  };
}

export function useMemberVotes(
  memberId: string,
  model: string,
  params: Record<string, string | number | undefined>,
  enabled = true,
) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const url = enabled
    ? `${import.meta.env.VITE_API_URL}/api/legislators/${memberId}/${model}/votes?${query.toString()}`
    : null;
  return useFetchJson<MemberVotesResponse>(url);
}

export function useAxisCategories(
  memberId: string,
  model: string,
  params: { axis: string } | { category: string },
) {
  const query = new URLSearchParams(params).toString();
  return useFetchJson<{ cells: AxisCategoryCell[] }>(
    `${import.meta.env.VITE_API_URL}/api/legislators/${memberId}/${model}/axis-categories?${query}`,
  );
}
