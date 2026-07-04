import { useColorModeValue } from "../ui/color-mode";

export const PARTY_COLORS = {
  D: "#2b6cb0",
  R: "#c53030",
  I: "#b7791f",
};

export const PARTY_COLORS_DARK = {
  D: "#63b3ed",
  R: "#f56565",
  I: "#ecc94b",
};

export function useChartTheme() {
  const partyColors = useColorModeValue(PARTY_COLORS, PARTY_COLORS_DARK);
  const grid = useColorModeValue("#e2e8e5", "#232d28");
  const tick = useColorModeValue("#5c6862", "#9aa8a1");
  const tooltipBg = useColorModeValue("#ffffff", "#141a17");
  const tooltipBorder = useColorModeValue("#e2e8e5", "#232d28");
  return { partyColors, grid, tick, tooltipBg, tooltipBorder };
}
