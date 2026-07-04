import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  cssVarsRoot: ":where(:root, :host)",
  theme: {
    tokens: {
      colors: {
        text: {
          light: { value: "#0f1512" },
          dark: { value: "#f4f6f5" },
        },
        textMuted: {
          light: { value: "#5c6862" },
          dark: { value: "#9aa8a1" },
        },
        background: {
          light: { value: "#fafcfb" }, // main light background
          dark: { value: "#0b0f0d" }, // main dark background
          lightShade: { value: "#f0f4f2" }, // slightly darker than main light
          lightTint: { value: "#ffffff" }, // slightly lighter than main light
          darkShade: { value: "#070a09" }, // slightly darker than main dark
          darkTint: { value: "#141a17" }, // slightly lighter than main dark
          greenSubtle: {
            light: { value: "#e9f4ee" },
            dark: { value: "#101b15" },
          },
        },
        borderCol: {
          light: { value: "#e2e8e5" },
          dark: { value: "#232d28" },
        },
        borderSubtleCol: {
          light: { value: "#ecf1ee" },
          dark: { value: "#1a2320" },
        },
        primary: {
          light: { value: "#178f5f" }, // refined emerald
          dark: { value: "#34c98d" },
        },
        primaryHover: {
          light: { value: "#0f7a50" },
          dark: { value: "#4ad69d" },
        },
        secondary: {
          light: { value: "#bfe3d2" },
          dark: { value: "#1f4a38" },
        },
        accent: {
          light: { value: "#12a06a" },
          dark: { value: "#2fbd85" },
        },
        // Party colors — reserved for data
        party: {
          rep: { light: { value: "#c53030" }, dark: { value: "#f56565" } },
          dem: { light: { value: "#2b6cb0" }, dark: { value: "#63b3ed" } },
          ind: { light: { value: "#6b46c1" }, dark: { value: "#b794f4" } },
        },
        // Vote colors
        vote: {
          yea: { light: { value: "#15803d" }, dark: { value: "#4ade80" } },
          nay: { light: { value: "#b91c1c" }, dark: { value: "#f87171" } },
          other: { light: { value: "#64748b" }, dark: { value: "#94a3b8" } },
        },
      },
      shadows: {
        card: { value: "0 1px 2px rgba(15, 21, 18, 0.05)" },
        cardHover: {
          value: "0 10px 30px -10px rgba(15, 21, 18, 0.18)",
        },
      },
      radii: {
        card: { value: "1rem" },
      },
    },
    semanticTokens: {
      colors: {
        text: {
          value: {
            _light: "{colors.text.light}",
            _dark: "{colors.text.dark}",
          },
        },
        textMuted: {
          value: {
            _light: "{colors.textMuted.light}",
            _dark: "{colors.textMuted.dark}",
          },
        },
        bg: {
          value: {
            _light: "{colors.background.light}",
            _dark: "{colors.background.dark}",
          },
        },
        bgLightShade: {
          value: {
            _light: "{colors.background.lightShade}",
            _dark: "{colors.background.darkShade}",
          },
        },
        bgLightTint: {
          value: {
            _light: "{colors.background.lightTint}",
            _dark: "{colors.background.darkTint}",
          },
        },
        bgDarkShade: {
          value: {
            _light: "{colors.background.lightShade}",
            _dark: "{colors.background.darkShade}",
          },
        },
        bgDarkTint: {
          value: {
            _light: "{colors.background.lightTint}",
            _dark: "{colors.background.darkTint}",
          },
        },
        // Elevated card surface
        surface: {
          value: {
            _light: "{colors.background.lightTint}",
            _dark: "{colors.background.darkTint}",
          },
        },
        border: {
          value: {
            _light: "{colors.borderCol.light}",
            _dark: "{colors.borderCol.dark}",
          },
        },
        borderSubtle: {
          value: {
            _light: "{colors.borderSubtleCol.light}",
            _dark: "{colors.borderSubtleCol.dark}",
          },
        },
        primary: {
          value: {
            _light: "{colors.primary.light}",
            _dark: "{colors.primary.dark}",
          },
        },
        primaryHover: {
          value: {
            _light: "{colors.primaryHover.light}",
            _dark: "{colors.primaryHover.dark}",
          },
        },
        secondary: {
          value: {
            _light: "{colors.secondary.light}",
            _dark: "{colors.secondary.dark}",
          },
        },
        accent: {
          value: {
            _light: "{colors.accent.light}",
            _dark: "{colors.accent.dark}",
          },
        },
        bgAltGray: {
          value: {
            _light: "{colors.background.lightShade}",
            _dark: "{colors.background.darkTint}",
          },
        },
        bgAltGreen: {
          value: {
            _light: "{colors.background.greenSubtle.light}",
            _dark: "{colors.background.greenSubtle.dark}",
          },
        },
        partyRep: {
          value: {
            _light: "{colors.party.rep.light}",
            _dark: "{colors.party.rep.dark}",
          },
        },
        partyDem: {
          value: {
            _light: "{colors.party.dem.light}",
            _dark: "{colors.party.dem.dark}",
          },
        },
        partyInd: {
          value: {
            _light: "{colors.party.ind.light}",
            _dark: "{colors.party.ind.dark}",
          },
        },
        voteYea: {
          value: {
            _light: "{colors.vote.yea.light}",
            _dark: "{colors.vote.yea.dark}",
          },
        },
        voteNay: {
          value: {
            _light: "{colors.vote.nay.light}",
            _dark: "{colors.vote.nay.dark}",
          },
        },
        voteOther: {
          value: {
            _light: "{colors.vote.other.light}",
            _dark: "{colors.vote.other.dark}",
          },
        },
      },
    },
  },
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      background: "{colors.bg}",
      color: "{colors.text}",
      transition: "background-color 0.2s ease, color 0.2s ease",
      fontFeatureSettings: '"cv02", "cv03", "cv04"',
    },
    a: {
      color: "{colors.accent}",
      textDecoration: "none",
      transition: "color 0.2s ease",
      _hover: {
        textDecoration: "underline",
      },
    },
    "::selection": {
      background: "{colors.secondary}",
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
