const themes = {
  blue: {
    label: "Blue",
    primary: { 400: "96 165 250", 500: "59 130 246", 600: "37 99 235", 700: "29 78 216" },
  },
  indigo: {
    label: "Indigo",
    primary: { 400: "129 140 248", 500: "99 102 241", 600: "79 70 229", 700: "67 56 202" },
  },
  violet: {
    label: "Violet",
    primary: { 400: "167 139 250", 500: "139 92 246", 600: "124 58 237", 700: "109 40 217" },
  },
  rose: {
    label: "Rose",
    primary: { 400: "251 113 133", 500: "244 63 94", 600: "225 29 72", 700: "190 18 60" },
  },
  emerald: {
    label: "Emerald",
    primary: { 400: "52 211 153", 500: "16 185 129", 600: "5 150 105", 700: "4 120 87" },
  },
  amber: {
    label: "Amber",
    primary: { 400: "251 191 36", 500: "245 158 11", 600: "217 119 6", 700: "180 83 9" },
  },
  cyan: {
    label: "Cyan",
    primary: { 400: "34 211 238", 500: "6 182 212", 600: "8 145 178", 700: "14 116 144" },
  },
  slate: {
    label: "Slate",
    primary: { 400: "148 163 184", 500: "100 116 139", 600: "71 85 105", 700: "51 65 85" },
  },
};

function getTheme(themeKey) {
  return themes[themeKey] || themes.blue;
}

function getThemeCSS(themeKey) {
  const theme = getTheme(themeKey);
  return Object.entries(theme.primary)
    .map(([shade, rgb]) => `--color-primary-${shade}: ${rgb};`)
    .join(" ");
}

function getAllThemes() {
  return Object.entries(themes).map(([key, value]) => ({
    key,
    label: value.label,
    primary: value.primary,
  }));
}

module.exports = { themes, getTheme, getThemeCSS, getAllThemes };
