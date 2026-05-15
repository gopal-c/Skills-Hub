import type { Config } from "tailwindcss";

/** rgb(var(--x) / <alpha-value>) wrapper — lets shadcn /80, /20 etc. work. */
const rgbVar = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ──────────── Fonts ────────────
      fontFamily: {
        sans:    ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono:    ["var(--font-mono)"],
      },

      // ──────────── Colors ────────────
      colors: {
        // shadcn semantic tokens (RGB triples, alpha-modifier capable)
        background: rgbVar("background"),
        foreground: rgbVar("foreground"),
        card: {
          DEFAULT: rgbVar("card"),
          foreground: rgbVar("card-foreground"),
        },
        popover: {
          DEFAULT: rgbVar("popover"),
          foreground: rgbVar("popover-foreground"),
        },
        primary: {
          DEFAULT: rgbVar("primary"),
          foreground: rgbVar("primary-foreground"),
        },
        secondary: {
          DEFAULT: rgbVar("secondary"),
          foreground: rgbVar("secondary-foreground"),
        },
        muted: {
          DEFAULT: rgbVar("muted"),
          foreground: rgbVar("muted-foreground"),
        },
        accent: {
          DEFAULT: rgbVar("accent"),
          foreground: rgbVar("accent-foreground"),
        },
        destructive: {
          DEFAULT: rgbVar("destructive"),
          foreground: rgbVar("destructive-foreground"),
        },
        border: rgbVar("border"),
        input: rgbVar("input"),
        ring: rgbVar("ring"),

        // SkillsHub brand palette (full hex, no alpha needed in most usage)
        indigo: {
          DEFAULT: "var(--brand-indigo)",
          deep:    "var(--brand-indigo-deep)",
          press:   "var(--brand-indigo-press)",
          soft:    "var(--brand-indigo-soft)",
        },
        coral: {
          DEFAULT: "var(--brand-coral)",
          deep:    "var(--brand-coral-deep)",
          press:   "var(--brand-coral-press)",
          soft:    "var(--brand-coral-soft)",
        },
        teal: {
          DEFAULT: "var(--brand-teal)",
          deep:    "var(--brand-teal-deep)",
          soft:    "var(--brand-teal-soft)",
        },
        amber: {
          DEFAULT: "var(--brand-amber)",
          deep:    "var(--brand-amber-deep)",
          soft:    "var(--brand-amber-soft)",
        },

        // Cool-tinted ink scale
        ink: {
          0:   "var(--ink-0)",
          50:  "var(--ink-50)",
          100: "var(--ink-100)",
          200: "var(--ink-200)",
          300: "var(--ink-300)",
          400: "var(--ink-400)",
          500: "var(--ink-500)",
          600: "var(--ink-600)",
          700: "var(--ink-700)",
          800: "var(--ink-800)",
          900: "var(--ink-900)",
        },

        // Semantic fg/bg/border aliases (no alpha needed)
        "fg-1":             "var(--fg-1)",
        "fg-2":             "var(--fg-2)",
        "fg-3":             "var(--fg-3)",
        "fg-on-dark":       "var(--fg-on-dark)",
        "fg-on-dark-2":     "var(--fg-on-dark-2)",
        "fg-link":          "var(--fg-link)",
        "bg-page":          "var(--bg-page)",
        "bg-surface":       "var(--bg-surface)",
        "bg-raised":        "var(--bg-raised)",
        "bg-sunken":        "var(--bg-sunken)",
        "bg-dark":          "var(--bg-dark)",
        "border-hairline":  "var(--border-hairline)",
        "border-strong":    "var(--border-strong)",
        "border-focus":     "var(--border-focus)",
      },

      // ──────────── Radii ────────────
      borderRadius: {
        xs:   "var(--r-xs)",
        sm:   "var(--r-sm)",
        md:   "var(--r-md)",
        lg:   "var(--r-lg)",
        xl:   "var(--r-xl)",
        pill: "var(--r-pill)",
      },

      // ──────────── Spacing (4px base scale, accessible as p-s-6 etc.) ────────────
      spacing: {
        "s-1":  "var(--s-1)",
        "s-2":  "var(--s-2)",
        "s-3":  "var(--s-3)",
        "s-4":  "var(--s-4)",
        "s-5":  "var(--s-5)",
        "s-6":  "var(--s-6)",
        "s-8":  "var(--s-8)",
        "s-10": "var(--s-10)",
        "s-12": "var(--s-12)",
        "s-16": "var(--s-16)",
        "s-20": "var(--s-20)",
      },

      // ──────────── Shadows ────────────
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
        4: "var(--shadow-4)",
        focus:       "var(--shadow-focus)",
        "focus-coral": "var(--shadow-focus-coral)",
      },

      // ──────────── Letter spacing ────────────
      letterSpacing: {
        eyebrow: "var(--tracking-eyebrow)",
        tight:   "var(--tracking-tight)",
        display: "var(--tracking-display)",
      },

      // ──────────── Easing & duration ────────────
      transitionTimingFunction: {
        out:    "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        spring: "var(--ease-spring)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
    },
  },
  plugins: [],
};
export default config;
