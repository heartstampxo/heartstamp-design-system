import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   HeartStamp Tabs — built on @radix-ui/react-tabs

   Token mapping (from Figma + color-tokens.json):
   ·  List bg     : --color-brand-secondary-dim  (rgba(36,36,35,0.06))
   ·  List radius : --radius-xl  (10px)
   ·  Active bg   : --color-bg-main  (white / #141414 dark)
   ·  Active text : --color-text-primary  (#242423 / #f5f5f4 dark)
   ·  Active bdr  : 1px solid --color-brand-secondary-dim
   ·  Active shad : 0px 1px 3px 0px rgba(0,0,0,0.10)
   ·  Trigger r   : --radius-lg  (8px)
   ·  Trigger h   : 29px
   ·  Trigger px  : --space-4  (16px)
   ·  Font        : 15px / weight 500 / DM Sans
   ·  Inactive fg : #6e6d6a  (per Figma)

   ⚠ APPROACH: CSS lives in a <style> tag rendered as part of the
     React tree inside <Tabs>. This is always HMR-safe — React
     re-renders it just like any other node, no DOM manipulation,
     no stale cache, no useEffect timing issues.
     background/border/color are NOT in inline styles so that
     [data-state] selectors in this sheet can override them freely.
───────────────────────────────────────────────────────────── */

const HS_TABS_CSS = `
  /* ── default / inactive trigger ─────────────────────────── */
  [data-hs-tabs] [data-slot="tabs-trigger"] {
    background: transparent;
    border: 1px solid transparent;
    color: var(--color-text-secondary);
  }

  /* ── active trigger ──────────────────────────────────────── */
  [data-hs-tabs] [data-slot="tabs-trigger"][data-state="active"] {
    background: var(--color-bg-main);
    border: 1px solid var(--color-brand-secondary-dim);
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.10);
    color: var(--color-text-primary);
  }

  /* ── hover (inactive only) ───────────────────────────────── */
  [data-hs-tabs] [data-slot="tabs-trigger"][data-state="inactive"]:not(:disabled):hover {
    background: transparent;
    color: var(--color-text-primary);
  }

  /* ── focus visible ───────────────────────────────────────── */
  [data-hs-tabs] [data-slot="tabs-trigger"]:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  /* ── disabled ────────────────────────────────────────────── */
  [data-hs-tabs] [data-slot="tabs-trigger"]:disabled {
    opacity: 0.45;
    pointer-events: none;
  }
`;

/* ── Root ────────────────────────────────────────────────────── */
function Tabs({
  style,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-hs-tabs=""
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        ...style,
      }}
      {...props}
    >
      {/* Rendered as a React node — always stays in sync with HMR,
          no DOM manipulation, no stale cache possible. */}
      <style dangerouslySetInnerHTML={{ __html: HS_TABS_CSS }} />
      {children}
    </TabsPrimitive.Root>
  );
}

/* ── List ────────────────────────────────────────────────────── */
function TabsList({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--color-brand-secondary-dim)",
        borderRadius: "var(--radius-xl)",   /* 10px */
        padding: 3,
        gap: 0,
        width: "fit-content",
        flexShrink: 0,
        ...style,
      }}
      {...props}
    />
  );
}

/* ── Trigger ─────────────────────────────────────────────────── */
/*  Note: background, border, color are NOT set here — they live
    in HS_TABS_CSS so [data-state] selectors can override them.  */
const MotionTrigger = motion.create(TabsPrimitive.Trigger);

function TabsTrigger({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <MotionTrigger
      data-slot="tabs-trigger"
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-1)",
        height: 29,
        padding: "4px var(--space-4)",      /* 4px 16px */
        borderRadius: "var(--radius-lg)",   /* 8px */
        fontSize: 15,
        fontWeight: 500,
        fontFamily: "var(--font-family-body)",
        whiteSpace: "nowrap" as const,
        cursor: "pointer",
        transition: "color .15s, background .15s, box-shadow .15s, border-color .15s",
        outline: "none",
        flexShrink: 0,
        lineHeight: "20px",
        ...style,
      }}
      {...props}
    />
  );
}

/* ── Content ─────────────────────────────────────────────────── */
function TabsContent({
  style,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      style={{ outline: "none", ...style }}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };