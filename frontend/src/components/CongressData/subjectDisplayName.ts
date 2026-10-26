import politicalAxes from "../../../data/politicalAxes.json";

// Category subjects are already display names; axis subjects are ids
// (e.g. "left_right") and need to be resolved to their display name.
export function subjectDisplayName(field: string, subject: string): string {
  if (field !== "axes") return subject;
  return politicalAxes.political_axes.find((a) => a.id === subject)?.name ?? subject;
}

export function subjectPoles(field: string, subject: string): { negative: string; positive: string } {
  if (field !== "axes") return { negative: "Liberal", positive: "Conservative" };
  const axis = politicalAxes.political_axes.find((a) => a.id === subject);
  return {
    negative: axis?.negative_pole.label ?? "−1",
    positive: axis?.positive_pole.label ?? "+1",
  };
}
