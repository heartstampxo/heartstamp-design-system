import React from "react";
import { Package } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Notification, NotificationRow, NOTIFICATION_DEMO_ITEMS } from "../components/ui/hs-notifications";
import type { NotificationItem } from "../components/ui/hs-notifications";
import { HSLogo } from "../components/ui/hs-logo";

/* Docs-only device frame: inside it the sheet anchors to the frame,
   not the viewport (mirrors the standalone's design-review chrome). */
const PHONE_FRAME_CSS = `
.notif-phone {
  position: relative;
  width: 390px;
  height: 720px;
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: 28px;
  overflow: hidden;
  background: var(--color-bg-main);
}
.notif-phone .hs-notif[data-mobile] { position: static; }
.notif-phone .hs-notif[data-mobile] .hs-notif__panel {
  position: absolute;
  left: 0;
  right: auto;
  top: var(--notif-m-top, 56px);
  bottom: 0;
  width: 390px;
  max-width: 390px;
  height: auto;
}
.notif-phone__bar {
  /* Matches --nav-m-h, the real compact nav bar height the sheet sits under. */
  height: 56px;
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
`;

/* Bordered shell so a standalone row reads as a card on the canvas. */
function RowCard({ item, unread = false }: { item: NotificationItem; unread?: boolean }) {
  return (
    <div style={{ width: "100%", maxWidth: 420, border: "1px solid var(--border)", borderRadius: "var(--radius-2xl)", overflow: "hidden", background: "var(--color-bg-main)" }}>
      <NotificationRow item={item} unread={unread} />
    </div>
  );
}

const ROW_IMPORT = `import { NotificationRow } from "@heartstampxo/design-system";`;

const DELIVERY_STAGES = [
  { done: 1, label: "Ordered · 1/4" },
  { done: 2, label: "Printing · 2/4" },
  { done: 3, label: "Shipped · 3/4" },
  { done: 4, label: "Delivered · 4/4" },
];

export function PageNotification() {
  const orderItem = NOTIFICATION_DEMO_ITEMS.find(i => i.id === "order")!;
  const readItem = NOTIFICATION_DEMO_ITEMS.find(i => i.id === "security")!;
  const unreadItem = NOTIFICATION_DEMO_ITEMS.find(i => i.id === "credits")!;

  return (
    <DocPage
      title="Notification"
      subtitle="Bell trigger with an unread dot and a pop-in notification panel. Rows stagger in, each carries a kebab menu (mark as unread, archive), and on touch screens or narrow viewports a row swipes right to mark read and left to archive, revealing the action panes underneath."
      sourceSlug="hs-notifications"
    >
      <DocSection
        title="Trigger"
        desc="Click the bell to open the live panel: rows stagger in at 45ms intervals, kebabs open one at a time, Mark all as read clears the unread wash and the bell dot, and Escape or an outside click closes it."
      >
        <Preview
          title="Notification"
          code={`import { Notification } from "@heartstampxo/design-system";\n\n<Notification\n  items={notifications}\n  onItemClick={openNotification}\n  onArchive={archiveNotification}\n  onMarkAllRead={markAllRead}\n/>`}
          height={160}
          canvasBg="var(--color-bg-editor)"
        >
          {/* The opened panel intentionally overflows this compact canvas. */}
          <Notification />
        </Preview>
      </DocSection>

      <DocSection
        title="Mobile"
        desc="Under 768px the panel automatically becomes a full-height sheet, and the mobile prop forces that presentation at any width for design review. Rows are tighter (40px icon, centred), and dragging a row right marks it read, left archives it, the mobile prop also enables the swipe gestures with a mouse. The component ships only the bell and the sheet: the phone frame and top bar below are docs chrome. The sheet starts --notif-m-top from the top, which resolves to --nav-m-h (56px, the compact WebsiteNavV2Mobile bar height) when the bell sits inside the nav, and falls back to 56px standalone; set either variable to your app's header height."
      >
        <Preview
          title="Notification · mobile sheet"
          code={`import { Notification } from "@heartstampxo/design-system";\n\n// Applied automatically under 768px; \`mobile\` forces the sheet at any width.\n<Notification mobile items={notifications} />`}
          height={780}
          canvasBg="var(--color-bg-editor)"
        >
          <style>{PHONE_FRAME_CSS}</style>
          <div className="notif-phone">
            <div className="notif-phone__bar">
              <HSLogo type="lockup" color="brand" height={22} />
              <Notification mobile defaultOpen />
            </div>
          </div>
        </Preview>
      </DocSection>

      <DocSection
        title="Row · Read"
        desc="The default row via the exported NotificationRow: icon circle, headline with relative time, truncating preview, kebab, and the optional Show more link."
      >
        <Preview
          title="NotificationRow · read"
          code={`${ROW_IMPORT}\nimport { ShieldCheck } from "lucide-react";\n\n<NotificationRow\n  item={{\n    id: "security",\n    title: "Security update",\n    time: "1d",\n    preview: "Your password was changed successfully.",\n    icon: <ShieldCheck size={20} strokeWidth={1.7} />,\n    showMore: true,\n  }}\n/>`}
          height={200}
          canvasBg="var(--color-bg-editor)"
        >
          <RowCard item={readItem} />
        </Preview>
      </DocSection>

      <DocSection
        title="Row · Unread"
        desc="The unread treatment: warm background wash, the 3px brand rule on the leading edge, and the extra leading indent. Swiping right or the panel's Mark all as read returns it to the read state."
      >
        <Preview
          title="NotificationRow · unread"
          code={`${ROW_IMPORT}\nimport { Wallet } from "lucide-react";\n\n<NotificationRow\n  unread\n  item={{\n    id: "credits",\n    title: "Earn 15 heart credits for free",\n    time: "1d",\n    preview: "Add two contacts and earn free credits for…",\n    icon: <Wallet size={20} strokeWidth={1.7} />,\n    showMore: true,\n  }}\n/>`}
          height={200}
          canvasBg="var(--color-bg-editor)"
        >
          <RowCard item={unreadItem} unread />
        </Preview>
      </DocSection>

      <DocSection
        title="Row · Delivery progress"
        desc="The order row carries an optional progress strip: filled steps use the brand primary, remaining steps sit on the subtle track, and the label trails the bar. One preview per stage so each state copies out directly."
      >
        {DELIVERY_STAGES.map(stage => (
          <Preview
            key={stage.done}
            title={`NotificationRow · step ${stage.done} of 4`}
            code={`${ROW_IMPORT}\nimport { Package } from "lucide-react";\n\n<NotificationRow\n  item={{\n    id: "order",\n    title: "Order successfully delivered",\n    time: "1d",\n    preview: "Your order HS–1042 has been placed and…",\n    icon: <Package size={20} strokeWidth={1.7} />,\n    showMore: true,\n    progress: { total: 4, done: ${stage.done}, label: "${stage.label}" },\n  }}\n/>`}
            height={230}
            canvasBg="var(--color-bg-editor)"
          >
            <RowCard
              item={{
                ...orderItem,
                id: `order-${stage.done}`,
                icon: <Package size={20} strokeWidth={1.7} />,
                progress: { total: 4, done: stage.done, label: stage.label },
              }}
            />
          </Preview>
        ))}
      </DocSection>

      <DocSection title="Notification props">
        <PropsTable props={[
          { name: "items",         type: "NotificationItem[]",                 def: "demo set", desc: "Rows to render. Seeds the internal read/archive state; every action also fires its callback." },
          { name: "defaultOpen",   type: "boolean",                            def: "false",    desc: "Render the panel open on mount." },
          { name: "mobile",        type: "boolean",                            def: "false",    desc: "Force the full-height sheet presentation (and mouse swipe) at any viewport width. Applies automatically under 768px." },
          { name: "title",         type: "string",                             def: '"Notifications"', desc: "Panel heading and the trigger's accessible name." },
          { name: "markAllLabel",  type: "string",                             def: '"Mark all as read"', desc: "Header action label." },
          { name: "onItemClick",   type: "(item: NotificationItem) => void",   desc: "Fires when a row body is clicked." },
          { name: "onShowMore",    type: "(item: NotificationItem) => void",   desc: "Fires on the Show more link." },
          { name: "onArchive",     type: "(item: NotificationItem) => void",   desc: "Fires when a row is archived via swipe or the kebab menu." },
          { name: "onMarkAllRead", type: "() => void",                         desc: "Fires on Mark all as read." },
        ]} />
      </DocSection>

      <DocSection title="NotificationItem">
        <PropsTable props={[
          { name: "id",       type: "string",               required: true, desc: "Stable identity for read/archive tracking." },
          { name: "title",    type: "string",               required: true, desc: "Row headline." },
          { name: "time",     type: "string",               required: true, desc: "Short relative time, e.g. \"1m\", \"1d\"." },
          { name: "preview",  type: "string",               required: true, desc: "One-line preview, truncated with an ellipsis." },
          { name: "icon",     type: "ReactNode",            def: "Bell",    desc: "20px glyph inside the 44px circle. Use lucide icons at strokeWidth 1.7." },
          { name: "unread",   type: "boolean",              def: "false",   desc: "Starts the row in the unread state: warm wash plus the 3px brand rule." },
          { name: "showMore", type: "boolean",              def: "false",   desc: "Renders the underlined Show more link." },
          { name: "progress", type: "NotificationProgress", desc: "Optional delivery strip: { total, done, label }." },
        ]} />
      </DocSection>
    </DocPage>
  );
}
