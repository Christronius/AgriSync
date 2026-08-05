export const colors = {
  bg: "#0B0D08",
  card: "#161A10",
  ink: "#FFFFFF",
  inkSoft: "#B4C4A8",
  line: "#2A3121",
  primary: "#6BE067",
  primaryDark: "#1C361E",
  primaryLight: "#8FF08C",
  primarySoft: "rgba(107,224,103,0.16)",
  gold: "#FFC247",
  goldDark: "#A67212",
  goldLight: "#FFD57A",
  goldSoft: "rgba(255,194,71,0.16)",
  euBlue: "#5C99F2",
  euBlueLight: "#84B5F5",
  euBlueSoft: "rgba(92,153,242,0.16)",
  good: "#6BE067",
  warn: "#FFC247",
  bad: "#FF6252",
  badDark: "#A12519",
  badSoft: "rgba(255,98,82,0.16)",
  cream: "#FDF5E6",
  ai: "#A794FF",
  aiDark: "#3C278C",
  aiSoft: "rgba(167,148,255,0.18)",
  teal: "#43CCA9",
  tealLight: "#6BE8C9",
} as const;

export type ThemeColors = typeof colors;

export const typography = {
  fonts: {
    primary: "SpaceGrotesk",
    secondary: "IBMPlexSans",
    mono: "IBMPlexMono",
  },
} as const;
