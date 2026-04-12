/* ═══════════════════════════════════════════════════════════
   NAV CONFIG — single source of truth for sidebar navigation
═══════════════════════════════════════════════════════════ */

/** Badge colours for nav item labels (new / beta / deprecated) */
export const LABEL_COLORS: Record<string, { bg: string; color: string }> = {
  new:        { bg: "rgba(16,185,129,.13)", color: "#10b981" },
  beta:       { bg: "rgba(245,158,11,.13)",  color: "#f59e0b" },
  deprecated: { bg: "rgba(239,68,68,.13)",   color: "#ef4444" },
};
export const NAV = [
  {
    title: "Getting Started", items: [
      { title: "Introduction",  id: "intro"   },
      { title: "Installation",  id: "install" },
      { title: "Theming",       id: "theming" },
    ]
  },
  {
    title: "Assets", items: [
      { title: "Icons",    id: "icons" },
      { title: "Branding", id: "logos", label: "new" },
    ]
  },
  {
    title: "Tokens", items: [
      { title: "Color",      id: "tokens-color"      },
      { title: "Typography", id: "tokens-typography" },
      { title: "Spacing",    id: "tokens-spacing"    },
      { title: "Radius",     id: "tokens-radius"     },
      { title: "Shadow",     id: "tokens-shadow"     },
    ]
  },
  {
    title: "Components", items: [
      /* ── Layout & Structure ─────────────────────────────── */
      { title: "Accordion",       id: "accordion",    group: "Layout & Structure" },
      { title: "Aspect Ratio",    id: "aspect-ratio", group: "Layout & Structure" },
      { title: "Card",            id: "card",         group: "Layout & Structure" },
      { title: "Collapsible",     id: "collapsible",  group: "Layout & Structure" },
      { title: "Scroll Area",     id: "scroll-area",  group: "Layout & Structure" },
      { title: "Separator",       id: "separator",    group: "Layout & Structure" },
      { title: "Table",           id: "table",        group: "Layout & Structure" },
      /* ── Navigation ─────────────────────────────────────── */
      { title: "Breadcrumb",      id: "breadcrumb",   group: "Navigation" },
      { title: "Navigation Menu", id: "nav-menu",     group: "Navigation" },
      { title: "Pagination",      id: "pagination",   group: "Navigation" },
      { title: "Profile Nav",     id: "profile-nav",  group: "Navigation",        label: "new"  },
      { title: "Top Nav",         id: "top-nav",      group: "Navigation",        label: "new"  },
      /* ── Inputs & Forms ─────────────────────────────────── */
      { title: "Checkbox",        id: "checkbox",     group: "Inputs & Forms" },
      { title: "Input",           id: "input",        group: "Inputs & Forms" },
      { title: "Kbd",             id: "kbd",          group: "Inputs & Forms",    label: "new"  },
      { title: "Label",           id: "label",        group: "Inputs & Forms" },
      { title: "Radio Group",     id: "radio-group",  group: "Inputs & Forms" },
      { title: "Select",          id: "select",       group: "Inputs & Forms" },
      { title: "Slider",          id: "slider",       group: "Inputs & Forms" },
      { title: "Stepper",         id: "stepper",      group: "Inputs & Forms",    label: "new"  },
      { title: "Switch",          id: "switch",       group: "Inputs & Forms" },
      { title: "Tabs",            id: "tabs",         group: "Inputs & Forms" },
      { title: "Textarea",        id: "textarea",     group: "Inputs & Forms" },
      { title: "Toggle",          id: "toggle",       group: "Inputs & Forms" },
      { title: "Toggle Group",    id: "toggle-group", group: "Inputs & Forms" },
      /* ── Overlays & Popups ──────────────────────────────── */
      { title: "Alert Dialog",    id: "alert-dialog", group: "Overlays & Popups" },
      { title: "Command",         id: "command",      group: "Overlays & Popups", label: "new"  },
      { title: "Context Menu",    id: "context-menu", group: "Overlays & Popups" },
      { title: "Dialog",          id: "dialog",       group: "Overlays & Popups" },
      { title: "Dropdown Menu",   id: "dropdown",     group: "Overlays & Popups" },
      { title: "Hover Card",      id: "hover-card",   group: "Overlays & Popups" },
      { title: "Popover",         id: "popover",      group: "Overlays & Popups" },
      { title: "Sheet",           id: "sheet",        group: "Overlays & Popups" },
      { title: "Tooltip",         id: "tooltip",      group: "Overlays & Popups" },
      /* ── Feedback & Status ──────────────────────────────── */
      { title: "Alert",           id: "alert",        group: "Feedback & Status" },
      { title: "Progress",        id: "progress",     group: "Feedback & Status" },
      { title: "Skeleton",        id: "skeleton",     group: "Feedback & Status" },
      { title: "Toast",           id: "toast",        group: "Feedback & Status", label: "beta" },
      /* ── Actions ────────────────────────────────────────── */
      { title: "Button",          id: "button",       group: "Actions" },
      /* ── Display ────────────────────────────────────────── */
      { title: "Avatar",          id: "avatar",       group: "Display" },
      { title: "Badge",           id: "badge",        group: "Display",           label: "new"  },
      { title: "Calendar",        id: "calendar",     group: "Display",           label: "new"  },
      { title: "Footer",          id: "footer",       group: "Display",           label: "new"  },
      /* ── Chatbot ─────────────────────────────────────── */
      { title: "Stampy Chatbot",  id: "stampy-chatbot",         group: "Chatbot", label: "new" },
      { title: "Overflow Menus",  id: "chatbot-overflow-menus", group: "Chatbot", label: "new" },
      { title: "Chat Header",     id: "chatbot-header",         group: "Chatbot", label: "new" },
      { title: "Home Screen",     id: "chatbot-home-screen",    group: "Chatbot", label: "new" },
      { title: "Chat Input",      id: "chatbot-input",          group: "Chatbot", label: "new" },
      { title: "Chat Bubbles",    id: "chatbot-bubbles",        group: "Chatbot", label: "new" },
    ]
  },
];

export const ALL_ITEMS = NAV.flatMap(g => g.items);
