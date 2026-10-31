// CSS variables for the theme's semantic party colors, for use in SVG marks.
export const PARTY_FILL = {
  D: "var(--chakra-colors-party-dem)",
  R: "var(--chakra-colors-party-rep)",
  I: "var(--chakra-colors-party-ind)",
};

export function signedScore(score: number, digits = 2): string {
  const value = Math.abs(score).toFixed(digits);
  return score < 0 ? `−${value}` : `+${value}`;
}

export function scoreColor(score: number): string {
  return score < 0 ? "partyDem" : "partyRep";
}
