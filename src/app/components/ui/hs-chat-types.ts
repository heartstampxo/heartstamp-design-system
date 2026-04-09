// ── Chat Script Types ──────────────────────────────────────────────────────
// Defines the conversation step types used by the StampyChatbot component.

export interface OverflowPage {
  question: string;
  options: { num: string; label: string }[];
}

export interface ChecklistPage {
  question: string;
  items: { id: string; label: string }[];
}

export interface TemplateCard {
  num: string;
  title: string;
  front: string;
  insideHeading?: string;
  insideBody: string;
  giftMessage: string;
}

export interface ActionMenuConfig {
  title: string;
  subtitle: string;
  generateButtonLabel: string;
  adjustOptions: string[];
}

export interface BannerConfig {
  loadingTitle: string;
  loadingMessage: string;
  doneTitle: string;
  doneMessage: string;
  /** Duration in ms before switching to "done" state */
  loadingDuration: number;
}

export type ConversationStep =
  | {
      type: "stampy";
      message: string;
      delay?: number;
      buttons?: string[];
    }
  | {
      type: "overflow";
      pages: OverflowPage[];
      inputPlaceholder?: string;
      delay?: number;
    }
  | {
      type: "checklist";
      pages: ChecklistPage[];
      inputPlaceholder?: string;
      delay?: number;
      skipMessage?: string;
    }
  | {
      type: "style-carousel";
      delay?: number;
    }
  | {
      type: "template";
      header: string;
      cards: TemplateCard[];
      inputPlaceholder?: string;
      delay?: number;
    }
  | {
      type: "final-card";
      message: string;
      button: string;
      delay?: number;
    }
  | {
      type: "action";
      config: ActionMenuConfig;
      inputPlaceholder?: string;
      delay?: number;
    }
  | {
      type: "banner";
      config: BannerConfig;
    };

export interface ChatScript {
  examplePrompts: string[];
  steps: ConversationStep[];
}

/** A single message in the conversation */
export interface ChatMessage {
  role: "user" | "stampy";
  text: string;
  buttons?: string[];
  showCarousel?: boolean;
}
