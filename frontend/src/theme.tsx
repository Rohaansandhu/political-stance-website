import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const config = defineConfig({
  cssVarsRoot: ":where(:root, :host)",
  theme: {
    tokens: {
      colors: {
        text: {
          light: { value: "#060706" },
          dark: { value: "#f7f8f7" },
        },
        background: {
          light: { value: "#fbfdfc" },       // main light background
          dark: { value: "#020303" },        // main dark background
          lightShade: { value: "#f1f3f2" },  // slightly darker than main light
          lightTint: { value: "#ffffff" },   // slightly lighter than main light
          darkShade: { value: "#010101" },   // slightly darker than main dark
          darkTint: { value: "#121212" },    // slightly lighter than main dark
        },
        primary: {
          light: { value: "#67ab8f" },
          dark: { value: "#53977b" },
        },
        secondary: {
          light: { value: "#a3d7c2" },
          dark: { value: "#285c47" },
        },
        accent: {
          light: { value: "#6acea5" },
          dark: { value: "#31966c" },
        },
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
        primary: {
          value: {
            _light: "{colors.primary.light}",
            _dark: "{colors.primary.dark}",
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
    },
    a: {
      color: "{colors.accent}",
      textDecoration: "none",
      transition: "color 0.2s ease",
      _hover: {
        textDecoration: "underline",
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
