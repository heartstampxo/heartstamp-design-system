// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Constants, style tokens, and animation configs
// ═══════════════════════════════════════════════════════════════════════════

// ── Constants ──────────────────────────────────────────────────────────────

export const OCCASIONS = [
  "Birthday", "Retirement", "Thank you", "Anniversary", "Wedding",
  "Graduation", "Baby shower", "Get well soon", "Congratulations",
  "New job", "Sympathy", "Housewarming", "Valentine's Day", "Mother's Day",
  "Father's Day", "Christmas", "Halloween", "New Year", "Promotion",
  "Just because", "Thinking of you", "Good luck", "Welcome back",
  "Farewell", "Engagement",
];

export function getRandomSuggestions(count = 3): string[] {
  const shuffled = [...OCCASIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── Shared text styles ─────────────────────────────────────────────────────

export const dmSans400 = { fontFamily: "var(--font-family-body)", fontWeight: 400 } as const;
export const dmSans500 = { fontFamily: "var(--font-family-body)", fontWeight: 500 } as const;
// Bubble background maps to the brand-secondary-dim token
export const bubbleBg = "var(--color-brand-secondary-dim)";

// ── Spring configs ─────────────────────────────────────────────────────────

export const springConfig = { type: "spring" as const, stiffness: 400, damping: 10 };
export const entranceSpring = { type: "spring" as const, stiffness: 280, damping: 22 };
export const bubbleSpring = { type: "spring" as const, stiffness: 320, damping: 34 };

// ── Style carousel options ─────────────────────────────────────────────────

export const STYLE_OPTIONS = [
  { label: "Cartoon", image: "https://images.unsplash.com/photo-1767557125491-b3483567d843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Realistic", image: "https://images.unsplash.com/photo-1767978614407-de68168e7471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Watercolor", image: "https://images.unsplash.com/photo-1762117499084-2305f510c84c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Sketch", image: "https://images.unsplash.com/photo-1720248090619-95d555f01bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Oil Painting", image: "https://images.unsplash.com/photo-1681238339131-7ce2e66df342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Pixel Art", image: "https://images.unsplash.com/photo-1646061550931-74b78e83863c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Vintage", image: "https://images.unsplash.com/photo-1638009185192-4b03191ab0c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Minimalist", image: "https://images.unsplash.com/photo-1770009971150-f50bc7d373a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Pop Art", image: "https://images.unsplash.com/photo-1759352641912-d4ce0f948fdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
];

// ── TadaBanner scoped tokens ───────────────────────────────────────────────

export const TADA_SCOPED_TOKENS = `
  --tb-font-family:          var(--font-family-body);
  --tb-font-size-13:         var(--font-size-label-15);
  --tb-font-size-12:         var(--font-size-body-13);
  --tb-font-weight-medium:   400;
  --tb-font-weight-bold:     var(--font-weight-label-sb-15);
  --tb-line-height-13:       1.4;
  --tb-line-height-12:       1.4;
  --tb-space-2:              var(--space-2);
  --tb-space-3:              var(--space-3);
  --tb-space-4:              var(--space-4);
  --tb-space-10:             var(--space-10);
  --tb-radius-2xl:           var(--radius-2xl);
  --tb-icon-size:            16px;
  --tb-color-bg:             var(--color-bg-main);
  --tb-color-fg:             var(--color-text-primary);
  --tb-color-muted:          var(--color-bg-editor);
  --tb-color-destructive:    var(--color-brand-primary);
  --tb-color-destructive-fg: var(--color-text-on-primary);
  --tb-color-brand-dim:      var(--color-brand-primary-dim);
`;
