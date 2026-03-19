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
      { title: "Accordion",       id: "accordion"    },
      { title: "Alert",           id: "alert"        },
      { title: "Alert Dialog",    id: "alert-dialog" },
      { title: "Aspect Ratio",    id: "aspect-ratio" },
      { title: "Avatar",          id: "avatar"       },
      { title: "Badge",           id: "badge",         label: "new"  },
      { title: "Breadcrumb",      id: "breadcrumb"   },
      { title: "Button",          id: "button"       },
      { title: "Calendar",        id: "calendar",      label: "new"  },
      { title: "Card",            id: "card"         },
      { title: "Checkbox",        id: "checkbox"     },
      { title: "Collapsible",     id: "collapsible"  },
      { title: "Command",         id: "command",       label: "new"  },
      { title: "Context Menu",    id: "context-menu" },
      { title: "Dialog",          id: "dialog"       },
      { title: "Dropdown Menu",   id: "dropdown"     },
      { title: "Footer",          id: "footer",        label: "new"  },
      { title: "Hover Card",      id: "hover-card"   },
      { title: "Input",           id: "input"        },
      { title: "Label",           id: "label"        },
      { title: "Navigation Menu", id: "nav-menu"     },
      { title: "Pagination",      id: "pagination"   },
      { title: "Popover",         id: "popover"       },
      { title: "Profile Nav",     id: "profile-nav",   label: "new"  },
      { title: "Progress",        id: "progress"      },
      { title: "Radio Group",     id: "radio-group"  },
      { title: "Scroll Area",     id: "scroll-area"  },
      { title: "Select",          id: "select"       },
      { title: "Separator",       id: "separator"    },
      { title: "Sheet",           id: "sheet"        },
      { title: "Skeleton",        id: "skeleton"     },
      { title: "Slider",          id: "slider"       },
      { title: "Stepper",         id: "stepper",       label: "new"  },
      { title: "Switch",          id: "switch"       },
      { title: "Table",           id: "table"        },
      { title: "Tabs",            id: "tabs"         },
      { title: "Textarea",        id: "textarea"     },
      { title: "Toast",           id: "toast",         label: "beta" },
      { title: "Toggle",          id: "toggle"       },
      { title: "Toggle Group",    id: "toggle-group" },
      { title: "Tooltip",         id: "tooltip"      },
      { title: "Top Nav",         id: "top-nav",       label: "new"  },
    ]
  },
];

export const ALL_ITEMS = NAV.flatMap(g => g.items);
