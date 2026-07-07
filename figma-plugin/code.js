// Mattias Foundations
// Two entry points (menu commands):
//   1. "seed"     — seeds the four Variables collections (primitives + semantic)
//   2. "overview" — generates two visual reference frames bound to those vars
//
// Collections:
//   1. Mattias / Primitives / Color       (mode: default) — raw color atoms
//   2. Mattias / Primitives / Typography  (mode: default) — raw type atoms
//   3. Mattias / Semantic / Color         (mode: default) — semantic color aliases
//   4. Mattias / Semantic / Typography    (mode: default) — semantic type aliases
//
// Dark mode is omitted in v1. When the workspace upgrades to a paid plan
// that allows multi-mode collections, a "dark" mode can be added to
// Semantic / Color without renaming any token. Overview swatches are bound
// to semantic variables, so they will update automatically.

const COLLECTIONS = {
  primitivesColor: "Mattias / Primitives / Color",
  primitivesTypography: "Mattias / Primitives / Typography",
  semanticColor: "Mattias / Semantic / Color",
  semanticTypography: "Mattias / Semantic / Typography",
};

// ─── Color primitives (5 hues × 9 steps + specials) ─────────────────────

const colorPrimitives = {
  "gray/50":  "#FAFAFA",
  "gray/100": "#F4F4F5",
  "gray/200": "#E4E4E7",
  "gray/300": "#D4D4D8",
  "gray/400": "#A1A1AA",
  "gray/500": "#71717A",
  "gray/600": "#52525B",
  "gray/700": "#3F3F46",
  "gray/900": "#18181B",

  "blue/50":  "#EFF6FF",
  "blue/100": "#DBEAFE",
  "blue/200": "#BFDBFE",
  "blue/300": "#93C5FD",
  "blue/400": "#60A5FA",
  "blue/500": "#3B82F6",
  "blue/600": "#2563EB",
  "blue/700": "#1D4ED8",
  "blue/900": "#1E3A8A",

  "green/50":  "#F0FDF4",
  "green/100": "#DCFCE7",
  "green/200": "#BBF7D0",
  "green/300": "#86EFAC",
  "green/400": "#4ADE80",
  "green/500": "#22C55E",
  "green/600": "#16A34A",
  "green/700": "#15803D",
  "green/900": "#14532D",

  "amber/50":  "#FFFBEB",
  "amber/100": "#FEF3C7",
  "amber/200": "#FDE68A",
  "amber/300": "#FCD34D",
  "amber/400": "#FBBF24",
  "amber/500": "#F59E0B",
  "amber/600": "#D97706",
  "amber/700": "#B45309",
  "amber/900": "#78350F",

  "red/50":  "#FEF2F2",
  "red/100": "#FEE2E2",
  "red/200": "#FECACA",
  "red/300": "#FCA5A5",
  "red/400": "#F87171",
  "red/500": "#EF4444",
  "red/600": "#DC2626",
  "red/700": "#B91C1C",
  "red/900": "#7F1D1D",

  "white":       "#FFFFFF",
  "black":       "#000000",
  "transparent": "transparent",
};

const HUE_ORDER = ["gray", "blue", "green", "amber", "red"];
const STEP_ORDER = [50, 100, 200, 300, 400, 500, 600, 700, 900];
const SPECIALS_ORDER = ["white", "black", "transparent"];

// ─── Typography primitives ──────────────────────────────────────────────

const fontFamilyPrimitives = {
  "sans": "Inter",
  "mono": "JetBrains Mono",
};

const fontSizePrimitives = {
  "xs":  12,
  "sm":  14,
  "md":  16,
  "lg":  18,
  "xl":  20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
};
const FONT_SIZE_ORDER = ["xs","sm","md","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl"];

const fontWeightPrimitives = {
  "regular":  400,
  "medium":   500,
  "semibold": 600,
  "bold":     700,
};
const FONT_WEIGHT_ORDER = ["regular","medium","semibold","bold"];

const lineHeightPrimitives = {
  "tight":   1.15,
  "snug":    1.3,
  "normal":  1.5,
  "relaxed": 1.625,
};
const LINE_HEIGHT_ORDER = ["tight","snug","normal","relaxed"];

// ─── Semantic color tokens (property-first) ─────────────────────────────

const semanticColorAliases = {
  background: {
    "default":  "white",
    "elevated": "white",
    "sunken":   "gray/50",
    "overlay":  "white",
  },
  fill: {
    "neutral":          "gray/100",
    "neutralHover":     "gray/200",
    "neutralPressed":   "gray/300",
    "primary":          "blue/600",
    "primaryHover":     "blue/700",
    "primaryPressed":   "blue/900",
    "secondary":        "gray/200",
    "secondaryHover":   "gray/300",
    "secondaryPressed": "gray/400",
    "selected":         "blue/100",
    "selectedHover":    "blue/200",
    "selectedPressed":  "blue/300",
    "disabled":         "gray/100",
    "warning":          "amber/600",
    "warningSubtle":    "amber/50",
    "negative":         "red/600",
    "negativeSubtle":   "red/50",
    "positive":         "green/600",
    "positiveSubtle":   "green/50",
    "info":             "blue/600",
    "infoSubtle":       "blue/50",
  },
  text: {
    "default":     "gray/900",
    "subtle":      "gray/700",
    "subtler":     "gray/500",
    "inverse":     "white",
    "disabled":    "gray/400",
    "link":        "blue/600",
    "warning":     "amber/700",
    "negative":    "red/700",
    "positive":    "green/700",
    "info":        "blue/700",
    "onPrimary":   "white",
    "onSecondary": "gray/900",
    "onSelected":  "blue/900",
    "onWarning":   "white",
    "onNegative":  "white",
    "onPositive":  "white",
    "onInfo":      "white",
    "onInverse":   "gray/900",
  },
  icon: {
    "default":     "gray/900",
    "subtle":      "gray/700",
    "subtler":     "gray/500",
    "inverse":     "white",
    "disabled":    "gray/400",
    "link":        "blue/600",
    "warning":     "amber/700",
    "negative":    "red/700",
    "positive":    "green/700",
    "info":        "blue/700",
    "onPrimary":   "white",
    "onSecondary": "gray/900",
    "onSelected":  "blue/900",
    "onWarning":   "white",
    "onNegative":  "white",
    "onPositive":  "white",
    "onInfo":      "white",
    "onInverse":   "gray/900",
  },
  border: {
    "default":  "gray/300",
    "subtle":   "gray/200",
    "strong":   "gray/500",
    "inverse":  "gray/100",
    "disabled": "gray/200",
    "focus":    "blue/500",
    "selected": "blue/500",
    "warning":  "amber/500",
    "negative": "red/500",
    "positive": "green/500",
    "info":     "blue/500",
  },
};

const semanticColorRaw = {
  "scrim/default": { r: 0, g: 0, b: 0, a: 0.5 },
};

const SEMANTIC_COLOR_GROUP_ORDER = ["background", "fill", "text", "icon", "border", "scrim"];

// Background pairing for on* text/icon tokens — what fill color to render under them.
const ON_PAIR_FILL = {
  onPrimary:   "primary",
  onSecondary: "secondary",
  onSelected:  "selected",
  onWarning:   "warning",
  onNegative:  "negative",
  onPositive:  "positive",
  onInfo:      "info",
};

// ─── Semantic typography tokens ─────────────────────────────────────────

const semanticTypography = {
  "display/2xl": { family: "sans", size: "7xl", weight: "bold",     lineHeight: "tight"  },
  "display/xl":  { family: "sans", size: "6xl", weight: "bold",     lineHeight: "tight"  },
  "display/lg":  { family: "sans", size: "5xl", weight: "bold",     lineHeight: "tight"  },

  "heading/xl":  { family: "sans", size: "4xl", weight: "bold",     lineHeight: "tight"  },
  "heading/lg":  { family: "sans", size: "3xl", weight: "semibold", lineHeight: "snug"   },
  "heading/md":  { family: "sans", size: "2xl", weight: "semibold", lineHeight: "snug"   },
  "heading/sm":  { family: "sans", size: "xl",  weight: "semibold", lineHeight: "snug"   },
  "heading/xs":  { family: "sans", size: "lg",  weight: "semibold", lineHeight: "snug"   },

  "body/lg":     { family: "sans", size: "lg",  weight: "regular",  lineHeight: "relaxed"},
  "body/md":     { family: "sans", size: "md",  weight: "regular",  lineHeight: "normal" },
  "body/sm":     { family: "sans", size: "sm",  weight: "regular",  lineHeight: "normal" },

  "label/lg":    { family: "sans", size: "md",  weight: "medium",   lineHeight: "tight"  },
  "label/md":    { family: "sans", size: "sm",  weight: "medium",   lineHeight: "tight"  },
  "label/sm":    { family: "sans", size: "xs",  weight: "medium",   lineHeight: "tight"  },

  "caption":     { family: "sans", size: "xs",  weight: "regular",  lineHeight: "normal" },

  "code/md":     { family: "mono", size: "sm",  weight: "regular",  lineHeight: "normal" },
  "code/sm":     { family: "mono", size: "xs",  weight: "regular",  lineHeight: "normal" },
};

const SEMANTIC_TYPOGRAPHY_ORDER = [
  "display/2xl","display/xl","display/lg",
  "heading/xl","heading/lg","heading/md","heading/sm","heading/xs",
  "body/lg","body/md","body/sm",
  "label/lg","label/md","label/sm",
  "caption",
  "code/md","code/sm",
];

// ─── Color helpers ──────────────────────────────────────────────────────

function parseColor(value) {
  if (typeof value === "string") {
    if (value === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
    const c = value.replace("#", "");
    if (c.length !== 6) throw new Error(`Bad hex: ${value}`);
    return {
      r: parseInt(c.substring(0, 2), 16) / 255,
      g: parseInt(c.substring(2, 4), 16) / 255,
      b: parseInt(c.substring(4, 6), 16) / 255,
    };
  }
  if (typeof value === "object" && value !== null) return value;
  throw new Error(`Cannot parse color: ${value}`);
}

function solid(c) {
  const paint = { type: "SOLID", color: { r: c.r, g: c.g, b: c.b } };
  if (typeof c.a === "number") paint.opacity = c.a;
  return paint;
}

function boundFill(variable, fallbackColor) {
  const base = solid(fallbackColor || { r: 0, g: 0, b: 0 });
  return figma.variables.setBoundVariableForPaint(base, "color", variable);
}

// ─── Seed ───────────────────────────────────────────────────────────────

async function seed() {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  const existingNames = new Set(existing.map((c) => c.name));
  const wanted = Object.values(COLLECTIONS);
  const clash = wanted.filter((n) => existingNames.has(n));
  if (clash.length > 0) {
    figma.notify(
      `Aborting: collection(s) already exist — ${clash.join(", ")}. Delete them before re-seeding.`,
      { error: true, timeout: 15000 }
    );
    return;
  }

  const primColor = figma.variables.createVariableCollection(COLLECTIONS.primitivesColor);
  const primColorModeId = primColor.modes[0].modeId;
  primColor.renameMode(primColorModeId, "default");

  const colorPrimVars = {};
  for (const [name, raw] of Object.entries(colorPrimitives)) {
    const v = figma.variables.createVariable(name, primColor, "COLOR");
    v.setValueForMode(primColorModeId, parseColor(raw));
    colorPrimVars[name] = v;
  }

  const primTypo = figma.variables.createVariableCollection(COLLECTIONS.primitivesTypography);
  const primTypoModeId = primTypo.modes[0].modeId;
  primTypo.renameMode(primTypoModeId, "default");

  const fontFamilyVars = {};
  for (const [name, family] of Object.entries(fontFamilyPrimitives)) {
    const v = figma.variables.createVariable(`family/${name}`, primTypo, "STRING");
    v.setValueForMode(primTypoModeId, family);
    fontFamilyVars[name] = v;
  }

  const fontSizeVars = {};
  for (const [name, size] of Object.entries(fontSizePrimitives)) {
    const v = figma.variables.createVariable(`size/${name}`, primTypo, "FLOAT");
    v.setValueForMode(primTypoModeId, size);
    fontSizeVars[name] = v;
  }

  const fontWeightVars = {};
  for (const [name, weight] of Object.entries(fontWeightPrimitives)) {
    const v = figma.variables.createVariable(`weight/${name}`, primTypo, "FLOAT");
    v.setValueForMode(primTypoModeId, weight);
    fontWeightVars[name] = v;
  }

  const lineHeightVars = {};
  for (const [name, lh] of Object.entries(lineHeightPrimitives)) {
    const v = figma.variables.createVariable(`line-height/${name}`, primTypo, "FLOAT");
    v.setValueForMode(primTypoModeId, lh);
    lineHeightVars[name] = v;
  }

  const semColor = figma.variables.createVariableCollection(COLLECTIONS.semanticColor);
  const semColorModeId = semColor.modes[0].modeId;
  semColor.renameMode(semColorModeId, "default");

  const semColorErrors = [];
  let semColorCount = 0;

  for (const [group, tokens] of Object.entries(semanticColorAliases)) {
    for (const [name, primitiveName] of Object.entries(tokens)) {
      const fullName = `${group}/${name}`;
      try {
        const target = colorPrimVars[primitiveName];
        if (!target) throw new Error(`primitive missing: ${primitiveName}`);
        const v = figma.variables.createVariable(fullName, semColor, "COLOR");
        v.setValueForMode(semColorModeId, figma.variables.createVariableAlias(target));
        semColorCount++;
      } catch (err) {
        semColorErrors.push(`${fullName}: ${err && err.message ? err.message : err}`);
      }
    }
  }

  for (const [fullName, rawValue] of Object.entries(semanticColorRaw)) {
    try {
      const v = figma.variables.createVariable(fullName, semColor, "COLOR");
      v.setValueForMode(semColorModeId, rawValue);
      semColorCount++;
    } catch (err) {
      semColorErrors.push(`${fullName}: ${err && err.message ? err.message : err}`);
    }
  }

  const semTypo = figma.variables.createVariableCollection(COLLECTIONS.semanticTypography);
  const typoModeId = semTypo.modes[0].modeId;
  semTypo.renameMode(typoModeId, "default");

  const semTypoErrors = [];
  let semTypoCount = 0;

  for (const [name, t] of Object.entries(semanticTypography)) {
    try {
      const famTarget = fontFamilyVars[t.family];
      const sizeTarget = fontSizeVars[t.size];
      const weightTarget = fontWeightVars[t.weight];
      const lhTarget = lineHeightVars[t.lineHeight];
      if (!famTarget)    throw new Error(`family target missing: ${t.family}`);
      if (!sizeTarget)   throw new Error(`size target missing: ${t.size}`);
      if (!weightTarget) throw new Error(`weight target missing: ${t.weight}`);
      if (!lhTarget)     throw new Error(`line-height target missing: ${t.lineHeight}`);

      const fam = figma.variables.createVariable(`text/${name}/font-family`,  semTypo, "STRING");
      fam.setValueForMode(typoModeId, figma.variables.createVariableAlias(famTarget));

      const sz = figma.variables.createVariable(`text/${name}/font-size`,    semTypo, "FLOAT");
      sz.setValueForMode(typoModeId, figma.variables.createVariableAlias(sizeTarget));

      const wt = figma.variables.createVariable(`text/${name}/font-weight`,  semTypo, "FLOAT");
      wt.setValueForMode(typoModeId, figma.variables.createVariableAlias(weightTarget));

      const lh = figma.variables.createVariable(`text/${name}/line-height`,  semTypo, "FLOAT");
      lh.setValueForMode(typoModeId, figma.variables.createVariableAlias(lhTarget));

      semTypoCount += 4;
    } catch (err) {
      semTypoErrors.push(`${name}: ${err && err.message ? err.message : err}`);
    }
  }

  const errs = [...semColorErrors, ...semTypoErrors];
  const primColorCount = Object.keys(colorPrimitives).length;
  const primTypoCount =
    Object.keys(fontFamilyPrimitives).length +
    Object.keys(fontSizePrimitives).length +
    Object.keys(fontWeightPrimitives).length +
    Object.keys(lineHeightPrimitives).length;

  if (errs.length > 0) {
    console.error("Mattias Foundations seed errors:", errs);
    figma.notify(
      `Seeded with ${errs.length} error(s). First: ${errs[0]}. See console.`,
      { error: true, timeout: 15000 }
    );
    return;
  }

  figma.notify(
    `Seeded — Primitives/Color: ${primColorCount}, Primitives/Typography: ${primTypoCount}, Semantic/Color: ${semColorCount}, Semantic/Typography: ${semTypoCount}.`,
    { timeout: 8000 }
  );
  figma.closePlugin();
}

// ─── Overview: font loading ─────────────────────────────────────────────

const WEIGHT_TO_INTER_STYLE = {
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
};

const UI_FONT_REGULAR  = { family: "Inter", style: "Regular" };
const UI_FONT_MEDIUM   = { family: "Inter", style: "Medium"  };
const UI_FONT_SEMIBOLD = { family: "Inter", style: "Semi Bold" };
const UI_FONT_BOLD     = { family: "Inter", style: "Bold"    };

let UI_FONT_MONO = { family: "JetBrains Mono", style: "Regular" };

async function loadOverviewFonts() {
  await figma.loadFontAsync(UI_FONT_REGULAR);
  await figma.loadFontAsync(UI_FONT_MEDIUM);
  await figma.loadFontAsync(UI_FONT_SEMIBOLD);
  await figma.loadFontAsync(UI_FONT_BOLD);
  try {
    await figma.loadFontAsync(UI_FONT_MONO);
  } catch (e) {
    console.warn("JetBrains Mono unavailable, using Inter Regular as mono fallback");
    UI_FONT_MONO = UI_FONT_REGULAR;
  }
}

// ─── Overview: node helpers ─────────────────────────────────────────────

function makeFrame(opts) {
  const f = figma.createFrame();
  if (opts.name) f.name = opts.name;
  f.layoutMode = opts.direction || "VERTICAL";
  f.primaryAxisSizingMode  = opts.primaryAxisSizingMode  || "AUTO";
  f.counterAxisSizingMode  = opts.counterAxisSizingMode  || "AUTO";
  f.itemSpacing = opts.gap != null ? opts.gap : 16;
  f.paddingTop    = opts.padY != null ? opts.padY : (opts.padTop    != null ? opts.padTop    : 0);
  f.paddingBottom = opts.padY != null ? opts.padY : (opts.padBottom != null ? opts.padBottom : 0);
  f.paddingLeft   = opts.padX != null ? opts.padX : (opts.padLeft   != null ? opts.padLeft   : 0);
  f.paddingRight  = opts.padX != null ? opts.padX : (opts.padRight  != null ? opts.padRight  : 0);
  if (opts.fill) f.fills = [solid(opts.fill)];
  else f.fills = [];
  if (opts.cornerRadius != null) f.cornerRadius = opts.cornerRadius;
  if (opts.stroke) {
    f.strokes = [solid(opts.stroke)];
    f.strokeWeight = opts.strokeWeight != null ? opts.strokeWeight : 1;
  }
  if (opts.counterAxisAlign) f.counterAxisAlignItems = opts.counterAxisAlign;
  if (opts.primaryAxisAlign) f.primaryAxisAlignItems = opts.primaryAxisAlign;
  if (opts.clipsContent != null) f.clipsContent = opts.clipsContent;
  return f;
}

function makeText(text, opts) {
  const t = figma.createText();
  const font = opts.font || UI_FONT_REGULAR;
  t.fontName = font;
  t.characters = text;
  if (opts.size) t.fontSize = opts.size;
  if (opts.lineHeightPercent) {
    t.lineHeight = { value: opts.lineHeightPercent, unit: "PERCENT" };
  }
  if (opts.lineHeightPixels) {
    t.lineHeight = { value: opts.lineHeightPixels, unit: "PIXELS" };
  }
  if (opts.color) t.fills = [solid(opts.color)];
  if (opts.textAlignHorizontal) t.textAlignHorizontal = opts.textAlignHorizontal;
  if (opts.textAlignVertical) t.textAlignVertical = opts.textAlignVertical;
  if (opts.maxWidth) {
    t.textAutoResize = "HEIGHT";
    t.resize(opts.maxWidth, t.height);
  }
  return t;
}

function setFixedWidth(frame, width) {
  // Works on any auto-layout frame regardless of layoutMode (VERTICAL/HORIZONTAL).
  // Width becomes fixed; height continues to hug content.
  frame.layoutSizingHorizontal = "FIXED";
  frame.resize(width, Math.max(1, frame.height));
}

function makeRect(width, height, opts) {
  const r = figma.createRectangle();
  r.resize(width, height);
  if (opts && opts.fill) r.fills = [opts.fill];
  if (opts && opts.boundFillVar) r.fills = [boundFill(opts.boundFillVar)];
  if (opts && opts.cornerRadius != null) r.cornerRadius = opts.cornerRadius;
  if (opts && opts.boundStrokeVar) {
    r.strokes = [boundFill(opts.boundStrokeVar)];
    r.strokeWeight = opts.strokeWeight || 2;
  } else if (opts && opts.stroke) {
    r.strokes = [opts.stroke];
    r.strokeWeight = opts.strokeWeight || 1;
  }
  return r;
}

// ─── Overview: build COLOR frame ────────────────────────────────────────

const COLOR_FRAME_WIDTH = 1440;
const SECTION_GAP = 64;
const BLOCK_GAP = 32;
const ROW_GAP = 16;

const COLOR_INK_DEFAULT  = parseColor("#18181B");
const COLOR_INK_MUTED    = parseColor("#52525B");
const COLOR_INK_SUBTLER  = parseColor("#A1A1AA");
const COLOR_INK_HAIRLINE = { r: 0, g: 0, b: 0, a: 0.08 };
const COLOR_PAGE_BG      = parseColor("#FFFFFF");
const COLOR_CARD_BG      = parseColor("#FAFAFA");

function eyebrowText(text) {
  return makeText(text, {
    font: UI_FONT_MEDIUM,
    size: 12,
    color: COLOR_INK_SUBTLER,
  });
}

function titleText(text) {
  return makeText(text, {
    font: UI_FONT_BOLD,
    size: 48,
    lineHeightPercent: 110,
    color: COLOR_INK_DEFAULT,
  });
}

function sectionHeadingText(text) {
  return makeText(text, {
    font: UI_FONT_SEMIBOLD,
    size: 28,
    lineHeightPercent: 120,
    color: COLOR_INK_DEFAULT,
  });
}

function groupHeadingText(text) {
  return makeText(text, {
    font: UI_FONT_SEMIBOLD,
    size: 18,
    lineHeightPercent: 130,
    color: COLOR_INK_DEFAULT,
  });
}

function metaText(text) {
  return makeText(text, {
    font: UI_FONT_MEDIUM,
    size: 13,
    lineHeightPercent: 140,
    color: COLOR_INK_DEFAULT,
  });
}

function monoCaption(text) {
  return makeText(text, {
    font: UI_FONT_MONO,
    size: 11,
    lineHeightPercent: 140,
    color: COLOR_INK_MUTED,
  });
}

function buildTitleBlock(eyebrow, title) {
  const f = makeFrame({ name: "Title", direction: "VERTICAL", gap: 8 });
  f.appendChild(eyebrowText(eyebrow));
  f.appendChild(titleText(title));
  return f;
}

function buildPrimitiveSwatch(varRef, displayName, hex) {
  const swatch = makeFrame({
    name: `swatch/${displayName}`,
    direction: "VERTICAL",
    gap: 8,
    counterAxisAlign: "MIN",
  });

  const rect = makeRect(96, 96, {
    boundFillVar: varRef,
    cornerRadius: 8,
    stroke: solid(COLOR_INK_HAIRLINE),
    strokeWeight: 1,
  });
  swatch.appendChild(rect);

  swatch.appendChild(metaText(displayName));
  swatch.appendChild(monoCaption(hex.toUpperCase()));
  return swatch;
}

function buildHueRow(hue, primColorVars) {
  const row = makeFrame({
    name: `hue/${hue}`,
    direction: "HORIZONTAL",
    gap: 24,
    counterAxisAlign: "MIN",
  });

  const labelCol = makeFrame({ direction: "VERTICAL", gap: 4 });
  labelCol.appendChild(makeText(hue[0].toUpperCase() + hue.slice(1), {
    font: UI_FONT_SEMIBOLD,
    size: 16,
    color: COLOR_INK_DEFAULT,
  }));
  labelCol.appendChild(monoCaption(`${STEP_ORDER.length} steps`));
  setFixedWidth(labelCol, 100);
  row.appendChild(labelCol);

  const swatchRow = makeFrame({
    name: "swatches",
    direction: "HORIZONTAL",
    gap: 12,
    counterAxisAlign: "MIN",
  });
  for (const step of STEP_ORDER) {
    const tokenName = `${hue}/${step}`;
    const hex = colorPrimitives[tokenName];
    const v = primColorVars[tokenName];
    swatchRow.appendChild(buildPrimitiveSwatch(v, String(step), hex));
  }
  row.appendChild(swatchRow);
  return row;
}

function buildSpecialsRow(primColorVars) {
  const row = makeFrame({
    name: "specials",
    direction: "HORIZONTAL",
    gap: 24,
    counterAxisAlign: "MIN",
  });

  const labelCol = makeFrame({ direction: "VERTICAL", gap: 4 });
  labelCol.appendChild(makeText("Specials", {
    font: UI_FONT_SEMIBOLD,
    size: 16,
    color: COLOR_INK_DEFAULT,
  }));
  labelCol.appendChild(monoCaption(`${SPECIALS_ORDER.length} tokens`));
  setFixedWidth(labelCol, 100);
  row.appendChild(labelCol);

  const swatchRow = makeFrame({
    direction: "HORIZONTAL",
    gap: 12,
    counterAxisAlign: "MIN",
  });
  for (const name of SPECIALS_ORDER) {
    const hex = colorPrimitives[name];
    const v = primColorVars[name];
    swatchRow.appendChild(buildPrimitiveSwatch(v, name, hex));
  }
  row.appendChild(swatchRow);
  return row;
}

function buildColorPrimitivesSection(primColorVars) {
  const section = makeFrame({
    name: "primitives",
    direction: "VERTICAL",
    gap: BLOCK_GAP,
  });
  section.appendChild(sectionHeadingText("Primitives"));

  const hues = makeFrame({ direction: "VERTICAL", gap: 28 });
  for (const hue of HUE_ORDER) {
    hues.appendChild(buildHueRow(hue, primColorVars));
  }
  hues.appendChild(buildSpecialsRow(primColorVars));
  section.appendChild(hues);
  return section;
}

// ─── Overview: Semantic color cards ─────────────────────────────────────

function tokenCardFrame(name) {
  return makeFrame({
    name: `token/${name}`,
    direction: "VERTICAL",
    gap: 10,
    counterAxisAlign: "MIN",
  });
}

function aliasCaption(aliasTarget) {
  return monoCaption(`→ ${aliasTarget}`);
}

function buildBackgroundCard(name, aliasTarget, semVar) {
  const card = tokenCardFrame(`background/${name}`);
  const rect = makeRect(180, 96, {
    boundFillVar: semVar,
    cornerRadius: 8,
    stroke: solid(COLOR_INK_HAIRLINE),
    strokeWeight: 1,
  });
  card.appendChild(rect);
  card.appendChild(metaText(`background/${name}`));
  card.appendChild(aliasCaption(aliasTarget));
  return card;
}

function buildFillCard(name, aliasTarget, semVar) {
  const card = tokenCardFrame(`fill/${name}`);
  const rect = makeRect(180, 96, {
    boundFillVar: semVar,
    cornerRadius: 8,
  });
  card.appendChild(rect);
  card.appendChild(metaText(`fill/${name}`));
  card.appendChild(aliasCaption(aliasTarget));
  return card;
}

function buildTextCard(name, aliasTarget, semVar, pairBgVar) {
  const card = tokenCardFrame(`text/${name}`);

  const preview = makeFrame({
    direction: "HORIZONTAL",
    gap: 0,
    padX: 0, padY: 0,
    counterAxisAlign: "CENTER",
    primaryAxisAlign: "CENTER",
  });
  preview.primaryAxisSizingMode = "FIXED";
  preview.counterAxisSizingMode = "FIXED";
  preview.cornerRadius = 8;
  preview.clipsContent = true;
  preview.fills = pairBgVar
    ? [boundFill(pairBgVar)]
    : (name === "inverse"
        ? [solid(parseColor("#18181B"))]
        : [solid(COLOR_CARD_BG)]);
  if (!pairBgVar && name !== "inverse") {
    preview.strokes = [solid(COLOR_INK_HAIRLINE)];
    preview.strokeWeight = 1;
  }
  preview.resize(180, 96);

  const sample = makeText("Aa", {
    font: UI_FONT_BOLD,
    size: 40,
    lineHeightPercent: 100,
  });
  sample.fills = [boundFill(semVar)];
  preview.appendChild(sample);
  card.appendChild(preview);

  card.appendChild(metaText(`text/${name}`));
  card.appendChild(aliasCaption(aliasTarget));
  return card;
}

function buildIconCard(name, aliasTarget, semVar, pairBgVar) {
  const card = tokenCardFrame(`icon/${name}`);

  const preview = makeFrame({
    direction: "HORIZONTAL",
    gap: 0,
    counterAxisAlign: "CENTER",
    primaryAxisAlign: "CENTER",
  });
  preview.primaryAxisSizingMode = "FIXED";
  preview.counterAxisSizingMode = "FIXED";
  preview.cornerRadius = 8;
  preview.clipsContent = true;
  preview.fills = pairBgVar
    ? [boundFill(pairBgVar)]
    : (name === "inverse"
        ? [solid(parseColor("#18181B"))]
        : [solid(COLOR_CARD_BG)]);
  if (!pairBgVar && name !== "inverse") {
    preview.strokes = [solid(COLOR_INK_HAIRLINE)];
    preview.strokeWeight = 1;
  }
  preview.resize(180, 96);

  const icon = makeRect(32, 32, {
    boundFillVar: semVar,
    cornerRadius: 6,
  });
  preview.appendChild(icon);
  card.appendChild(preview);

  card.appendChild(metaText(`icon/${name}`));
  card.appendChild(aliasCaption(aliasTarget));
  return card;
}

function buildBorderCard(name, aliasTarget, semVar) {
  const card = tokenCardFrame(`border/${name}`);
  const preview = makeFrame({
    direction: "VERTICAL",
    gap: 0,
    counterAxisAlign: "CENTER",
    primaryAxisAlign: "CENTER",
  });
  preview.primaryAxisSizingMode = "FIXED";
  preview.counterAxisSizingMode = "FIXED";
  preview.cornerRadius = 8;
  preview.fills = [solid(COLOR_CARD_BG)];
  preview.resize(180, 96);

  const rect = makeRect(140, 56, {
    fill: { type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 1 },
    cornerRadius: 6,
    boundStrokeVar: semVar,
    strokeWeight: 2,
  });
  preview.appendChild(rect);
  card.appendChild(preview);

  card.appendChild(metaText(`border/${name}`));
  card.appendChild(aliasCaption(aliasTarget));
  return card;
}

function buildScrimCard(name, semVar) {
  const card = tokenCardFrame(`scrim/${name}`);

  // Non-auto-layout container so the scrim rect can overlay the base row.
  const preview = figma.createFrame();
  preview.name = "preview";
  preview.layoutMode = "NONE";
  preview.fills = [];
  preview.cornerRadius = 8;
  preview.clipsContent = true;
  preview.resize(180, 96);

  // Base — a row of color blocks to show that the scrim is semi-transparent.
  const base = makeFrame({ direction: "HORIZONTAL", gap: 0 });
  base.primaryAxisSizingMode = "FIXED";
  base.counterAxisSizingMode = "FIXED";
  base.resize(180, 96);
  const blockColors = ["#FAFAFA", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444"];
  for (const hex of blockColors) {
    const block = makeRect(36, 96, { fill: solid(parseColor(hex)) });
    base.appendChild(block);
  }
  preview.appendChild(base);
  base.x = 0;
  base.y = 0;

  // Scrim overlay sits on top.
  const overlay = makeRect(180, 96, { boundFillVar: semVar });
  preview.appendChild(overlay);
  overlay.x = 0;
  overlay.y = 0;

  card.appendChild(preview);
  card.appendChild(metaText(`scrim/${name}`));
  card.appendChild(monoCaption("rgba(0, 0, 0, 0.5)"));
  return card;
}

function buildSemanticGroup(group, semVars) {
  const block = makeFrame({
    name: `group/${group}`,
    direction: "VERTICAL",
    gap: 20,
  });

  let count = 0;
  if (group === "scrim") count = Object.keys(semanticColorRaw).length;
  else count = Object.keys(semanticColorAliases[group] || {}).length;

  const heading = makeFrame({ direction: "HORIZONTAL", gap: 8, counterAxisAlign: "CENTER" });
  heading.appendChild(groupHeadingText(group[0].toUpperCase() + group.slice(1)));
  heading.appendChild(monoCaption(`(${count} token${count === 1 ? "" : "s"})`));
  block.appendChild(heading);

  const grid = makeFrame({
    name: "grid",
    direction: "HORIZONTAL",
    gap: 16,
    counterAxisAlign: "MIN",
  });
  grid.layoutWrap = "WRAP";
  grid.counterAxisSpacing = 24;
  grid.primaryAxisSizingMode = "FIXED";
  grid.counterAxisSizingMode = "AUTO";
  grid.resize(COLOR_FRAME_WIDTH - 160, 100);

  if (group === "scrim") {
    for (const fullName of Object.keys(semanticColorRaw)) {
      const name = fullName.replace(/^scrim\//, "");
      const semVar = semVars[fullName];
      grid.appendChild(buildScrimCard(name, semVar));
    }
  } else if (group === "background") {
    for (const [name, target] of Object.entries(semanticColorAliases.background)) {
      const semVar = semVars[`background/${name}`];
      grid.appendChild(buildBackgroundCard(name, target, semVar));
    }
  } else if (group === "fill") {
    for (const [name, target] of Object.entries(semanticColorAliases.fill)) {
      const semVar = semVars[`fill/${name}`];
      grid.appendChild(buildFillCard(name, target, semVar));
    }
  } else if (group === "text") {
    for (const [name, target] of Object.entries(semanticColorAliases.text)) {
      const pairFillName = ON_PAIR_FILL[name];
      const pairVar = pairFillName ? semVars[`fill/${pairFillName}`] : null;
      const semVar = semVars[`text/${name}`];
      grid.appendChild(buildTextCard(name, target, semVar, pairVar));
    }
  } else if (group === "icon") {
    for (const [name, target] of Object.entries(semanticColorAliases.icon)) {
      const pairFillName = ON_PAIR_FILL[name];
      const pairVar = pairFillName ? semVars[`fill/${pairFillName}`] : null;
      const semVar = semVars[`icon/${name}`];
      grid.appendChild(buildIconCard(name, target, semVar, pairVar));
    }
  } else if (group === "border") {
    for (const [name, target] of Object.entries(semanticColorAliases.border)) {
      const semVar = semVars[`border/${name}`];
      grid.appendChild(buildBorderCard(name, target, semVar));
    }
  }

  block.appendChild(grid);
  return block;
}

function buildSemanticColorSection(semVars) {
  const section = makeFrame({
    name: "semantic",
    direction: "VERTICAL",
    gap: BLOCK_GAP,
  });
  section.appendChild(sectionHeadingText("Semantic"));

  const groups = makeFrame({ direction: "VERTICAL", gap: 40 });
  for (const group of SEMANTIC_COLOR_GROUP_ORDER) {
    groups.appendChild(buildSemanticGroup(group, semVars));
  }
  section.appendChild(groups);
  return section;
}

function buildColorOverview(primColorVars, semColorVars) {
  const frame = makeFrame({
    name: "Mattias / Color overview",
    direction: "VERTICAL",
    gap: SECTION_GAP,
    padX: 80,
    padY: 80,
    fill: COLOR_PAGE_BG,
    cornerRadius: 16,
  });
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(COLOR_FRAME_WIDTH, 100);

  frame.appendChild(buildTitleBlock("Mattias Foundations", "Color"));
  frame.appendChild(buildColorPrimitivesSection(primColorVars));
  frame.appendChild(buildSemanticColorSection(semColorVars));
  return frame;
}

// ─── Overview: build TYPOGRAPHY frame ───────────────────────────────────

const TYPO_FRAME_WIDTH = 1280;

function buildFamilyRow(name, family) {
  const row = makeFrame({
    direction: "HORIZONTAL",
    gap: 32,
    counterAxisAlign: "CENTER",
    padY: 12,
  });

  const tokenCol = makeFrame({ direction: "VERTICAL", gap: 4 });
  tokenCol.appendChild(makeText(`family/${name}`, {
    font: UI_FONT_MONO,
    size: 12,
    color: COLOR_INK_DEFAULT,
  }));
  tokenCol.appendChild(monoCaption(family));
  setFixedWidth(tokenCol, 120);
  row.appendChild(tokenCol);

  const sampleFont = name === "mono" ? UI_FONT_MONO : UI_FONT_REGULAR;
  const sample = makeText("The quick brown fox jumps over the lazy dog", {
    font: sampleFont,
    size: 20,
    color: COLOR_INK_DEFAULT,
  });
  row.appendChild(sample);
  return row;
}

function buildSizeRow(name, size) {
  const row = makeFrame({
    direction: "HORIZONTAL",
    gap: 32,
    counterAxisAlign: "MIN",
    padY: 8,
  });

  const tokenCol = makeFrame({ direction: "VERTICAL", gap: 0 });
  tokenCol.appendChild(makeText(`size/${name}`, {
    font: UI_FONT_MONO,
    size: 12,
    color: COLOR_INK_DEFAULT,
  }));
  setFixedWidth(tokenCol, 100);
  row.appendChild(tokenCol);

  const valueCol = makeFrame({ direction: "VERTICAL", gap: 0 });
  valueCol.appendChild(monoCaption(`${size}px`));
  setFixedWidth(valueCol, 70);
  row.appendChild(valueCol);

  const sample = makeText("The quick brown fox", {
    font: UI_FONT_REGULAR,
    size: size,
    color: COLOR_INK_DEFAULT,
  });
  row.appendChild(sample);
  return row;
}

function buildWeightRow(name, weight) {
  const row = makeFrame({
    direction: "HORIZONTAL",
    gap: 32,
    counterAxisAlign: "CENTER",
    padY: 6,
  });

  const tokenCol = makeFrame({ direction: "VERTICAL", gap: 0 });
  tokenCol.appendChild(makeText(`weight/${name}`, {
    font: UI_FONT_MONO,
    size: 12,
    color: COLOR_INK_DEFAULT,
  }));
  setFixedWidth(tokenCol, 140);
  row.appendChild(tokenCol);

  const valueCol = makeFrame({ direction: "VERTICAL", gap: 0 });
  valueCol.appendChild(monoCaption(String(weight)));
  setFixedWidth(valueCol, 60);
  row.appendChild(valueCol);

  const sample = makeText("The quick brown fox", {
    font: { family: "Inter", style: WEIGHT_TO_INTER_STYLE[weight] || "Regular" },
    size: 22,
    color: COLOR_INK_DEFAULT,
  });
  row.appendChild(sample);
  return row;
}

function buildLineHeightRow(name, lh) {
  const row = makeFrame({
    direction: "HORIZONTAL",
    gap: 32,
    counterAxisAlign: "MIN",
    padY: 8,
  });

  const tokenCol = makeFrame({ direction: "VERTICAL", gap: 0 });
  tokenCol.appendChild(makeText(`line-height/${name}`, {
    font: UI_FONT_MONO,
    size: 12,
    color: COLOR_INK_DEFAULT,
  }));
  setFixedWidth(tokenCol, 140);
  row.appendChild(tokenCol);

  const valueCol = makeFrame({ direction: "VERTICAL", gap: 0 });
  valueCol.appendChild(monoCaption(String(lh)));
  setFixedWidth(valueCol, 60);
  row.appendChild(valueCol);

  const sample = makeText(
    "Multi-line sample. The quick brown fox jumps over the lazy dog and admires the autumn leaves quietly.",
    {
      font: UI_FONT_REGULAR,
      size: 16,
      color: COLOR_INK_DEFAULT,
      lineHeightPercent: Math.round(lh * 100),
      maxWidth: 520,
    }
  );
  row.appendChild(sample);
  return row;
}

function buildTypoPrimitivesSection() {
  const section = makeFrame({
    name: "primitives",
    direction: "VERTICAL",
    gap: BLOCK_GAP,
  });
  section.appendChild(sectionHeadingText("Primitives"));

  const familyBlock = makeFrame({ direction: "VERTICAL", gap: 8 });
  familyBlock.appendChild(groupHeadingText("Font families"));
  for (const [name, family] of Object.entries(fontFamilyPrimitives)) {
    familyBlock.appendChild(buildFamilyRow(name, family));
  }
  section.appendChild(familyBlock);

  const sizeBlock = makeFrame({ direction: "VERTICAL", gap: 8 });
  sizeBlock.appendChild(groupHeadingText("Font sizes"));
  for (const name of FONT_SIZE_ORDER) {
    sizeBlock.appendChild(buildSizeRow(name, fontSizePrimitives[name]));
  }
  section.appendChild(sizeBlock);

  const weightBlock = makeFrame({ direction: "VERTICAL", gap: 8 });
  weightBlock.appendChild(groupHeadingText("Font weights"));
  for (const name of FONT_WEIGHT_ORDER) {
    weightBlock.appendChild(buildWeightRow(name, fontWeightPrimitives[name]));
  }
  section.appendChild(weightBlock);

  const lhBlock = makeFrame({ direction: "VERTICAL", gap: 8 });
  lhBlock.appendChild(groupHeadingText("Line heights"));
  for (const name of LINE_HEIGHT_ORDER) {
    lhBlock.appendChild(buildLineHeightRow(name, lineHeightPrimitives[name]));
  }
  section.appendChild(lhBlock);

  return section;
}

function buildSemanticTypoRow(styleName, spec) {
  const row = makeFrame({
    name: `style/${styleName}`,
    direction: "HORIZONTAL",
    gap: 40,
    counterAxisAlign: "MIN",
    padY: 16,
  });

  const meta = makeFrame({ direction: "VERTICAL", gap: 4 });
  meta.appendChild(makeText(styleName, {
    font: UI_FONT_SEMIBOLD,
    size: 14,
    color: COLOR_INK_DEFAULT,
  }));
  meta.appendChild(monoCaption(`${spec.family} · ${spec.size} · ${spec.weight} · ${spec.lineHeight}`));
  const sizePx = fontSizePrimitives[spec.size];
  const lhMul  = lineHeightPrimitives[spec.lineHeight];
  meta.appendChild(monoCaption(`${sizePx}px / ${Math.round(sizePx * lhMul)}px lh`));
  setFixedWidth(meta, 220);
  row.appendChild(meta);

  const familyName = spec.family === "mono"
    ? (UI_FONT_MONO.family === "JetBrains Mono" ? "JetBrains Mono" : "Inter")
    : "Inter";
  const styleStr = WEIGHT_TO_INTER_STYLE[fontWeightPrimitives[spec.weight]] || "Regular";
  // Mono only has Regular loaded; if a hypothetical mono weight is non-regular, fall back.
  const font = spec.family === "mono"
    ? UI_FONT_MONO
    : { family: familyName, style: styleStr };

  const sample = makeText(sampleTextForStyle(styleName), {
    font: font,
    size: sizePx,
    lineHeightPercent: Math.round(lhMul * 100),
    color: COLOR_INK_DEFAULT,
    maxWidth: 800,
  });
  row.appendChild(sample);
  return row;
}

function sampleTextForStyle(name) {
  if (name.startsWith("display")) return "Sharp design";
  if (name.startsWith("heading")) return "A well-tuned heading";
  if (name.startsWith("body"))    return "Body copy that breathes. The quick brown fox jumps over the lazy dog and notices the warm afternoon light.";
  if (name.startsWith("label"))   return "LABEL TEXT";
  if (name === "caption")         return "Caption — small supporting copy.";
  if (name.startsWith("code"))    return "const tokens = await load();";
  return "Sample text";
}

function buildSemanticTypoSection() {
  const section = makeFrame({
    name: "semantic",
    direction: "VERTICAL",
    gap: BLOCK_GAP,
  });
  section.appendChild(sectionHeadingText("Semantic styles"));

  const list = makeFrame({ direction: "VERTICAL", gap: 0 });
  for (const styleName of SEMANTIC_TYPOGRAPHY_ORDER) {
    list.appendChild(buildSemanticTypoRow(styleName, semanticTypography[styleName]));
  }
  section.appendChild(list);
  return section;
}

function buildTypographyOverview() {
  const frame = makeFrame({
    name: "Mattias / Typography overview",
    direction: "VERTICAL",
    gap: SECTION_GAP,
    padX: 80,
    padY: 80,
    fill: COLOR_PAGE_BG,
    cornerRadius: 16,
  });
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(TYPO_FRAME_WIDTH, 100);

  frame.appendChild(buildTitleBlock("Mattias Foundations", "Typography"));
  frame.appendChild(buildTypoPrimitivesSection());
  frame.appendChild(buildSemanticTypoSection());
  return frame;
}

// ─── Overview: orchestration ────────────────────────────────────────────

async function loadVariableLookup() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const wantedNames = Object.values(COLLECTIONS);
  const byName = new Map(collections.map((c) => [c.name, c]));
  const missing = wantedNames.filter((n) => !byName.has(n));
  if (missing.length > 0) {
    return { missing, lookup: null };
  }
  const allVars = await figma.variables.getLocalVariablesAsync();
  const lookup = {};
  for (const n of wantedNames) lookup[n] = {};
  for (const v of allVars) {
    const c = collections.find((x) => x.id === v.variableCollectionId);
    if (c && lookup[c.name]) lookup[c.name][v.name] = v;
  }
  return { missing: [], lookup };
}

async function overview() {
  await loadOverviewFonts();

  const { missing, lookup } = await loadVariableLookup();
  if (missing.length > 0) {
    figma.notify(
      `Missing collections: ${missing.join(", ")}. Run "Seed Variables" first.`,
      { error: true, timeout: 15000 }
    );
    return;
  }

  const primColorVars = lookup[COLLECTIONS.primitivesColor];
  const semColorVars  = lookup[COLLECTIONS.semanticColor];

  const colorFrame = buildColorOverview(primColorVars, semColorVars);
  const typoFrame = buildTypographyOverview();

  figma.currentPage.appendChild(colorFrame);
  figma.currentPage.appendChild(typoFrame);

  // Position side by side starting at viewport center.
  const center = figma.viewport.center;
  colorFrame.x = Math.round(center.x - (colorFrame.width + typoFrame.width + 80) / 2);
  colorFrame.y = Math.round(center.y - colorFrame.height / 2);
  typoFrame.x = colorFrame.x + colorFrame.width + 80;
  typoFrame.y = colorFrame.y;

  figma.viewport.scrollAndZoomIntoView([colorFrame, typoFrame]);
  figma.notify("Overview frames generated.", { timeout: 6000 });
  figma.closePlugin();
}

// ─── Entry point ────────────────────────────────────────────────────────

async function main() {
  if (figma.command === "overview") {
    await overview();
  } else {
    // default + "seed"
    await seed();
  }
}

main().catch((err) => {
  console.error("Mattias Foundations crashed:", err);
  figma.notify(
    `Plugin failed: ${err && err.message ? err.message : err}`,
    { error: true, timeout: 15000 }
  );
  // Intentionally do NOT closePlugin on crash, so the toast stays readable.
});
