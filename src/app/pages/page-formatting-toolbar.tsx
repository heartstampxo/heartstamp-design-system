import React, { useRef, useState } from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { FmtToolbar, type FmtItem } from "../components/ui/hs-fmt-toolbar";
import { EmojiPicker } from "../components/ui/hs-emoji-picker";
import { EMOJI_CATEGORIES } from "../components/ui/hs-emoji-data";
import { LinkEditor } from "../components/ui/hs-link-editor";
import { SocialHandles, type SocialHandle } from "../components/ui/hs-social-handles";
import { LinkBtnEditor } from "../components/ui/hs-link-btn-editor";
import { FontPicker, findFontOption } from "../components/ui/hs-font-picker";
import { ColorPicker } from "../components/ui/hs-color-picker";

/* Toggles that hold an on/off state; the rest are one-shot actions */
const TOGGLES = ["bold", "italic", "underline", "strikethrough"];
const ALIGNMENTS = ["align-left", "align-center", "align-right"];

const MINIMAL: FmtItem[][] = [
  [
    { kind: "glyph", id: "bold",      glyph: "B", label: "Bold" },
    { kind: "glyph", id: "italic",    glyph: "I", label: "Italic" },
    { kind: "glyph", id: "underline", glyph: "U", label: "Underline", decoration: "underline" },
  ],
  [{ kind: "swatch", id: "text-color", color: "var(--color-brand-primary)", label: "Text colour" }],
];

const EMOJI_W = 288;
const LINK_W = 264;
const HANDLES_W = 382;
const ANCHOR_MARGIN = 8;   // keep the panel inside the demo frame
const ANCHOR_GAP = 14;     // toolbar ↔ panel, leaves room for the notch

/** Which toolbar controls open a popover, and how wide that panel is */
const FONT_W = 232;

const POPOVER_WIDTH: Record<string, number> = {
  emoji: EMOJI_W,
  link: LINK_W,
  handles: HANDLES_W,
  "link-btn": HANDLES_W,
  "font-family": FONT_W,
};

const SAMPLE_HANDLES: SocialHandle[] = [{ platformId: "instagram", value: "@easiblu" }];

interface Popover {
  id: string;
  left: number;
  arrow: number;
}

export function PageFormattingToolbar() {
  const [active, setActive] = useState<string[]>(["bold", "align-left"]);
  const [inserted, setInserted] = useState<string[]>([]);
  const [appliedLink, setAppliedLink] = useState<string | null>(null);
  const [fontId, setFontId] = useState("kalam");
  const [textColor, setTextColor] = useState("#242423");
  /* ColorPicker positions itself from a DOMRect, so the trigger's rect is enough */
  const [colorAnchor, setColorAnchor] = useState<DOMRect | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  /* Which panel is open, where it sits, and where its notch lands */
  const [popover, setPopover] = useState<Popover | null>(null);

  /* Places a panel under `trigger`, clamped to the frame. The notch keeps
     pointing at the trigger even when the panel is pushed back inside. */
  const anchorTo = (id: string, trigger: HTMLButtonElement) => {
    const frame = anchorRef.current;
    if (!frame) return;
    const panelW = POPOVER_WIDTH[id];
    const f = frame.getBoundingClientRect();
    const t = trigger.getBoundingClientRect();
    const centre = t.left + t.width / 2 - f.left;
    const left = Math.max(ANCHOR_MARGIN, Math.min(centre - panelW / 2, f.width - panelW - ANCHOR_MARGIN));
    setPopover({ id, left, arrow: centre - left });
  };

  /* Toggles flip; alignment is single-select; emoji and link open popovers */
  const handleAction = (id: string, trigger: HTMLButtonElement) => {
    if (TOGGLES.includes(id)) {
      setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
    } else if (ALIGNMENTS.includes(id)) {
      setActive((a) => [...a.filter((x) => !ALIGNMENTS.includes(x)), id]);
    } else if (id === "text-color") {
      setColorAnchor((r) => (r ? null : trigger.getBoundingClientRect()));
    } else if (POPOVER_WIDTH[id]) {
      if (popover?.id === id) setPopover(null);
      else anchorTo(id, trigger);
    }
  };

  const totalEmoji = EMOJI_CATEGORIES.reduce((n, c) => n + c.emoji.length, 0);

  return (
    <DocPage
      title="Formatting Toolbar"
      subtitle="Text formatting controls for rich-text surfaces — the row of actions that styles the message a user is writing. Data-driven: pass groups of items and dividers are rendered between them."
    >
      <DocSection
        title="Default"
        desc="The full toolbar. Rendered from FMT_TOOLBAR_GROUPS when no groups prop is given. Press the emoji control to open the picker."
      >
        <Preview
          title="FmtToolbar — emoji, link, and Handles open their popovers"
          height={620}
          code={`import { FmtToolbar, EmojiPicker } from '@heartstampxo/design-system';

// onAction hands back the button it fired from, so popovers anchor to it
const anchorTo = (trigger) => {
  const f = frameRef.current.getBoundingClientRect();
  const t = trigger.getBoundingClientRect();
  const centre = t.left + t.width / 2 - f.left;
  const left = clamp(centre - 288 / 2, 8, f.width - 288 - 8);
  setPopover({ left, arrow: centre - left });
};

<div ref={frameRef} style={{ position: 'relative' }}>
  <FmtToolbar
    active={active}
    onAction={(id, trigger) => (id === 'emoji' ? anchorTo(trigger) : toggle(id))}
  />

  {popover && (
    <div style={{ position: 'absolute', top: '100%', left: popover.left, marginTop: "var(--space-3-5)" }}>
      <EmojiPicker
        arrowOffset={popover.arrow}
        onSelect={(char) => insertAtCursor(char)}
        onClose={() => setPopover(null)}
      />
    </div>
  )}
</div>`}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4, 16px)", width: "100%" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "var(--space-2, 8px)", minHeight: 24,
              fontSize: "var(--font-size-label-12)", color: "var(--color-text-secondary)",
              fontFamily: "var(--font-family-body)",
            }}>
              {inserted.length > 0 || appliedLink ? (
                <>
                  {inserted.length > 0 && (
                    <>
                      <span>inserted</span>
                      <span style={{ fontSize: "var(--font-size-h5)" }}>{inserted.join(" ")}</span>
                    </>
                  )}
                  {appliedLink && <span>{appliedLink}</span>}
                  <button
                    onClick={() => { setInserted([]); setAppliedLink(null); }}
                    style={{
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      color: "var(--color-text-link)", fontSize: "var(--font-size-label-12)",
                      fontFamily: "var(--font-family-body)",
                    }}
                  >
                    Clear
                  </button>
                </>
              ) : (
                <span>press the font, emoji, link, or Handles control to open its popover</span>
              )}
            </div>

            {/* Anchor frame — each panel is positioned against the pressed control */}
            <div ref={anchorRef} style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
              <FmtToolbar
                active={popover ? [...active, popover.id] : active}
                onAction={handleAction}
                fontValue={findFontOption(fontId)?.name}
                swatchColor={textColor}
              />

              {colorAnchor && (
                <ColorPicker
                  color={textColor}
                  anchorRect={colorAnchor}
                  onChange={setTextColor}
                  onClose={() => setColorAnchor(null)}
                />
              )}

              {popover && (
                <div style={{ position: "absolute", top: "100%", left: popover.left, marginTop: ANCHOR_GAP, zIndex: 2 }}>
                  {popover.id === "emoji" && (
                    <EmojiPicker
                      width={EMOJI_W}
                      arrowOffset={popover.arrow}
                      autoFocusSearch
                      onSelect={(char) => setInserted((list) => [...list, char].slice(-12))}
                      onClose={() => setPopover(null)}
                    />
                  )}
                  {popover.id === "link" && (
                    <LinkEditor
                      width={LINK_W}
                      arrowOffset={popover.arrow}
                      autoFocus
                      onApply={({ text, url }) => {
                        setAppliedLink(`linked “${text || url}” → ${url}`);
                        setPopover(null);
                      }}
                      onClose={() => setPopover(null)}
                    />
                  )}
                  {popover.id === "font-family" && (
                    <FontPicker
                      width={FONT_W}
                      value={fontId}
                      onSelect={(id) => { setFontId(id); setPopover(null); }}
                      onClose={() => setPopover(null)}
                    />
                  )}
                  {popover.id === "link-btn" && (
                    <LinkBtnEditor
                      width={HANDLES_W}
                      arrowOffset={popover.arrow}
                      autoFocus
                      onApply={({ text, url, icon }) => {
                        const mark = icon.kind === "emoji" ? icon.char : "🔗";
                        setAppliedLink(`${mark} link button “${text || url}” → ${url}`);
                        setPopover(null);
                      }}
                      onClose={() => setPopover(null)}
                    />
                  )}
                  {popover.id === "handles" && (
                    <SocialHandles
                      width={HANDLES_W}
                      arrowOffset={popover.arrow}
                      defaultHandles={SAMPLE_HANDLES}
                      onApply={(list) => {
                        setAppliedLink(
                          list.length
                            ? `${list.length} handle${list.length > 1 ? "s" : ""} on cover: ${list.map((h) => h.value).join(", ")}`
                            : "no handles added",
                        );
                        setPopover(null);
                      }}
                      onClose={() => setPopover(null)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Preview>

        <Callout variant="info">
          Bold/italic/underline/strikethrough toggle independently; the three alignment
          controls are single-select. That policy lives in the host app — the toolbar
          only reports which id was pressed.
        </Callout>

        <PropsTable props={[
          { name: "groups",    type: "FmtItem[][]",       def: "FMT_TOOLBAR_GROUPS", desc: "Item groups, left to right, with a divider between each group." },
          { name: "active",    type: "string[]",          def: "—", desc: "Ids whose formatting is currently applied." },
          { name: "onAction",  type: "(id, trigger) => void", def: "—", desc: "Fired with the id of the pressed item and the button it fired from — anchor popovers to that element." },
          { name: "fontValue", type: "string",            def: "—", desc: "Overrides the value of every font item, for a font name that changes at runtime." },
          { name: "ariaLabel", type: "string",            def: '"Text formatting"', desc: "Accessible name for the toolbar." },
        ]} />
      </DocSection>

      <DocSection
        title="Active states"
        desc="An applied format fills its control with --color-element-subtle; hover and keyboard focus use the lighter --color-state-hover."
      >
        <Preview
          title="Bold and centre applied"
          height={200}
          code={`<FmtToolbar active={['bold', 'italic', 'align-center']} />`}
        >
          <FmtToolbar active={["bold", "italic", "align-center"]} onAction={() => {}} />
        </Preview>
      </DocSection>

      <DocSection
        title="Custom groups"
        desc="Pass your own groups to trim the toolbar down to the formats a surface actually supports."
      >
        <Preview
          title="Three toggles and a colour"
          height={180}
          code={`const MINIMAL = [
  [
    { kind: 'glyph', id: 'bold',      glyph: 'B', label: 'Bold' },
    { kind: 'glyph', id: 'italic',    glyph: 'I', label: 'Italic' },
    { kind: 'glyph', id: 'underline', glyph: 'U', label: 'Underline', decoration: 'underline' },
  ],
  [{ kind: 'swatch', id: 'text-color', color: 'var(--color-brand-primary)', label: 'Text colour' }],
];

<FmtToolbar groups={MINIMAL} active={['italic']} />`}
        >
          <FmtToolbar groups={MINIMAL} active={["italic"]} onAction={() => {}} />
        </Preview>
      </DocSection>

      <DocSection
        title="Emoji Picker"
        desc={`The popover the emoji control opens. Search, sticky category headers, and a category nav that jumps the scroller. ${EMOJI_CATEGORIES.length} categories, ${totalEmoji} emoji, rendered with the platform emoji font — no sprite sheets and no emoji package.`}
      >
        <Preview
          title="EmojiPicker — standalone"
          height={480}
          code={`import { EmojiPicker } from '@heartstampxo/design-system';

<EmojiPicker
  onSelect={(char, entry) => console.log(char, entry.name)}
  onClose={() => setOpen(false)}
/>`}
        >
          <EmojiPicker onSelect={(char) => setInserted((list) => [...list, char].slice(-12))} />
        </Preview>

        <Callout variant="info">
          The picker does not position itself — the host app anchors it, the same way it
          anchors any popover. The notch is centred by default; pass{" "}
          <code>arrowOffset</code> to slide it under the control that opened the picker,
          or <code>arrow={"{false}"}</code> to drop it.
        </Callout>

        <PropsTable props={[
          { name: "categories",        type: "EmojiCategory[]", def: "EMOJI_CATEGORIES", desc: "Categories to show, in order. The nav row is built from these." },
          { name: "onSelect",          type: "(char, entry) => void", def: "—", desc: "Fired with the chosen character and its dataset entry." },
          { name: "onClose",           type: "() => void",      def: "—",   desc: "Fired on Escape." },
          { name: "columns",           type: "number",          def: "5",   desc: "Grid columns. 5 matches the Figma layout." },
          { name: "width",             type: "number | string", def: "288", desc: "Overall popover width." },
          { name: "maxHeight",         type: "number",          def: "300", desc: "Max height of the scrolling body, excluding search row and nav." },
          { name: "searchPlaceholder", type: "string",          def: '"Search"', desc: "Placeholder for the search field." },
          { name: "autoFocusSearch",   type: "boolean",         def: "false", desc: "Focus the search field on mount." },
          { name: "arrow",             type: "boolean",         def: "true", desc: "Show the notch on the top edge." },
          { name: "arrowOffset",       type: "number",          def: "centred", desc: "Distance in px from the left edge to the notch centre." },
          { name: "ariaLabel",         type: "string",          def: '"Emoji picker"', desc: "Accessible name for the popover." },
        ]} />
      </DocSection>

      <DocSection
        title="Link Editor"
        desc="The popover the link control opens. Two fields — the text the reader sees and the destination — plus an apply action. Submits on Enter, closes on Escape."
      >
        <Preview
          title="LinkEditor — standalone"
          height={280}
          code={`import { LinkEditor } from '@heartstampxo/design-system';

<LinkEditor
  onApply={({ text, url }) => applyLink(text, url)}
  onClose={() => setOpen(false)}
/>

// Editing an existing link — prefill both fields
<LinkEditor
  defaultText={selection}
  defaultUrl={existingHref}
  applyLabel="Update link"
  onApply={({ text, url }) => applyLink(text, url)}
/>`}
        >
          <LinkEditor onApply={({ text, url }) => setAppliedLink(`linked “${text || url}” → ${url}`)} />
        </Preview>

        <Callout variant="info">
          Apply stays disabled until a URL is entered — the text is optional, since a
          host can fall back to showing the URL itself. Values arrive at{" "}
          <code>onApply</code> trimmed.
        </Callout>

        <PropsTable props={[
          { name: "defaultText",      type: "string",              def: '""', desc: "Prefill the visible text — the current selection, or an existing link's label." },
          { name: "defaultUrl",       type: "string",              def: '""', desc: "Prefill the destination — the existing href when editing a link." },
          { name: "onApply",          type: "({ text, url }) => void", def: "—", desc: "Fired on submit (button or Enter) with trimmed values." },
          { name: "onChange",         type: "({ text, url }) => void", def: "—", desc: "Fired on every keystroke in either field." },
          { name: "onClose",          type: "() => void",          def: "—",  desc: "Fired on Escape." },
          { name: "textLabel",        type: "string",              def: '"Link text"', desc: "Label above the text field." },
          { name: "urlLabel",         type: "string",              def: '"Link URL"',  desc: "Label above the URL field." },
          { name: "textPlaceholder",  type: "string",              def: '"Text to show"', desc: "Placeholder for the text field." },
          { name: "urlPlaceholder",   type: "string",              def: '"https://…"',    desc: "Placeholder for the URL field." },
          { name: "applyLabel",       type: "string",              def: '"Apply link"',  desc: "Label on the submit button." },
          { name: "width",            type: "number | string",     def: "264", desc: "Overall popover width." },
          { name: "autoFocus",        type: "boolean",             def: "false", desc: "Focus the text field on mount." },
          { name: "arrow",            type: "boolean",             def: "true",  desc: "Show the notch on the top edge." },
          { name: "arrowOffset",      type: "number",              def: "centred", desc: "Distance in px from the left edge to the notch centre." },
        ]} />
      </DocSection>

      <DocSection
        title="Font Picker"
        desc="The dropdown the font control opens. Each row previews the face in the face itself — an “Ag” swatch, the family name set in that family, and a plain-language character note."
      >
        <Preview
          title="FontPicker"
          height={420}
          code={`import { FontPicker } from '@heartstampxo/design-system';

const [fontId, setFontId] = useState('kalam');

<FontPicker
  value={fontId}
  onSelect={(id, font) => applyFont(font.stack)}
  onClose={() => setOpen(false)}
/>`}
        >
          <FontPicker width={FONT_W} value={fontId} onSelect={(id) => setFontId(id)} />
        </Preview>

        <Callout variant="info">
          Every family in <code>FONT_OPTIONS</code> is loaded in{" "}
          <code>styles/fonts.css</code>. Adding an option without adding the{" "}
          <code>@import</code> would make its row preview in a fallback face — a test
          guards the pairing.
        </Callout>

        <PropsTable props={[
          { name: "fonts",     type: "FontOption[]", def: "FONT_OPTIONS", desc: "Fonts offered, in order." },
          { name: "value",     type: "string",       def: "—", desc: "Id of the selected font." },
          { name: "onSelect",  type: "(id, font) => void", def: "—", desc: "Fired with the chosen id and its option, whose `stack` is the CSS font-family to apply." },
          { name: "onClose",   type: "() => void",   def: "—", desc: "Fired on Escape." },
          { name: "maxHeight", type: "number",       def: "—", desc: "Caps the list height and scrolls beyond it." },
          { name: "width",     type: "number | string", def: "—", desc: "Overall dropdown width. Sizes to content when omitted." },
          { name: "sample",    type: "string",       def: '"Ag"', desc: "Sample text shown in the swatch." },
        ]} />
      </DocSection>

      <DocSection
        title="FontOption"
        desc="One entry in the catalogue. `stack` is what you apply to the card; `id` is what you store."
      >
        <PropsTable props={[
          { name: "id",          type: "string", def: "(required)", required: true, desc: "Stable id, e.g. \"kalam\"." },
          { name: "name",        type: "string", def: "(required)", required: true, desc: "Display name, rendered in the face itself." },
          { name: "description", type: "string", def: "(required)", required: true, desc: "Character note, e.g. \"Casual marker\"." },
          { name: "stack",       type: "string", def: "(required)", required: true, desc: "Full CSS font-family stack." },
        ]} />
      </DocSection>

      <DocSection
        title="Link Button Editor"
        desc="The popover the “Link Btn” control opens. Builds a link that floats on the card — label, destination, and an icon that is either the default glyph or an emoji. Distinct from Link Editor, which turns selected text into a hyperlink."
      >
        <Preview
          title="LinkBtnEditor — standalone"
          height={560}
          code={`import { LinkBtnEditor } from '@heartstampxo/design-system';

<LinkBtnEditor
  onApply={({ text, url, icon }) => addCardLink(text, url, icon)}
  onClose={() => setOpen(false)}
/>

// icon is { kind: 'link' } or { kind: 'emoji', char: '🎁' }`}
        >
          <LinkBtnEditor
            onApply={({ text, url, icon }) =>
              setAppliedLink(`${icon.kind === "emoji" ? icon.char : "🔗"} “${text || url}” → ${url}`)
            }
          />
        </Preview>

        <Callout variant="info">
          “Choose emoji” opens the emoji picker as a layer over the panel, so the fields
          above never reflow. Escape closes the picker first, then the panel. “Link icon”
          returns to the default glyph.
        </Callout>

        <PropsTable props={[
          { name: "defaultText",      type: "string",       def: '""', desc: "Prefill the label." },
          { name: "defaultUrl",       type: "string",       def: '""', desc: "Prefill the destination." },
          { name: "defaultIcon",      type: "LinkBtnIcon",  def: "{ kind: 'link' }", desc: "Prefill the icon. Pass an emoji to open in emoji mode." },
          { name: "onApply",          type: "({ text, url, icon }) => void", def: "—", desc: "Fired on submit with trimmed values and the chosen icon." },
          { name: "onChange",         type: "({ text, url, icon }) => void", def: "—", desc: "Fired on every field or icon change." },
          { name: "onClose",          type: "() => void",   def: "—",  desc: "Fired by the close button and on Escape. Omit to hide the close button." },
          { name: "textLabel",        type: "string",       def: '"Link text"',   desc: "Label above the text field." },
          { name: "urlLabel",         type: "string",       def: '"Link URL"',    desc: "Label above the URL field." },
          { name: "iconLabel",        type: "string",       def: '"Icon"',        desc: "Label above the icon row." },
          { name: "textPlaceholder",  type: "string",       def: '"e.g. Our website"', desc: "Placeholder for the text field." },
          { name: "urlPlaceholder",   type: "string",       def: '"https://…"',   desc: "Placeholder for the URL field." },
          { name: "chooseEmojiLabel", type: "string",       def: '"Choose emoji"', desc: "Label on the emoji picker trigger." },
          { name: "linkIconLabel",    type: "string",       def: '"Link icon"',   desc: "Label on the reset-to-default-glyph action." },
          { name: "applyLabel",       type: "string",       def: '"Add link"',    desc: "Label on the primary action." },
          { name: "width",            type: "number | string", def: "382", desc: "Overall popover width." },
          { name: "autoFocus",        type: "boolean",      def: "false", desc: "Focus the text field on mount." },
          { name: "arrow",            type: "boolean",      def: "true",  desc: "Show the notch on the top edge." },
          { name: "arrowOffset",      type: "number",       def: "centred", desc: "Distance in px from the left edge to the notch centre." },
        ]} />
      </DocSection>

      <DocSection
        title="Social Handles"
        desc="The popover the Handles control opens. Lists the handles already on the card, each removable, then a row to add another: pick a platform, type a handle or paste a link, press Add."
      >
        <Preview
          title="SocialHandles — standalone"
          height={420}
          code={`import { SocialHandles } from '@heartstampxo/design-system';

<SocialHandles
  defaultHandles={[{ platformId: 'instagram', value: '@easiblu' }]}
  onApply={(handles) => addToCover(handles)}
  onClose={() => setOpen(false)}
/>`}
        >
          <SocialHandles
            defaultHandles={SAMPLE_HANDLES}
            onApply={(list) => setAppliedLink(`${list.length} handle(s) on cover`)}
          />
        </Preview>

        <Callout variant="info">
          A pasted link identifies its own platform, so the picker is only needed for
          bare handles — paste <code>instagram.com/easiblu</code> and the badge resolves
          on its own. Platform detection and the brand marks live in{" "}
          <code>hs-social-icons</code>, shared with the website footer.
        </Callout>

        <PropsTable props={[
          { name: "handles",          type: "SocialHandle[]", def: "—",  desc: "Handles on the card. Controlled when onChange is supplied." },
          { name: "defaultHandles",   type: "SocialHandle[]", def: "[]", desc: "Initial handles when uncontrolled." },
          { name: "onChange",         type: "(handles) => void", def: "—", desc: "Fired whenever a handle is added or removed." },
          { name: "onApply",          type: "(handles) => void", def: "—", desc: "Fired by the primary action with the current list." },
          { name: "onClose",          type: "() => void",     def: "—",  desc: "Fired by the header close button and on Escape. Omit to hide the close button." },
          { name: "platforms",        type: "SocialPlatform[]", def: "SOCIAL_PLATFORMS", desc: "Platforms offered in the picker." },
          { name: "title",            type: "string",         def: '"Your social handles"', desc: "Panel heading." },
          { name: "description",      type: "string",         def: "see design", desc: "Explanatory copy under the heading." },
          { name: "inputPlaceholder", type: "string",         def: '"@handle or full link"', desc: "Placeholder for the add field." },
          { name: "addLabel",         type: "string",         def: '"Add"', desc: "Label on the add button." },
          { name: "applyLabel",       type: "string",         def: '"Add to cover"', desc: "Label on the primary action." },
          { name: "width",            type: "number | string", def: "382", desc: "Overall popover width." },
          { name: "arrow",            type: "boolean",        def: "true", desc: "Show the notch on the top edge." },
          { name: "arrowOffset",      type: "number",         def: "centred", desc: "Distance in px from the left edge to the notch centre." },
        ]} />
      </DocSection>

      <DocSection
        title="SocialHandle / SocialPlatform"
        desc="A handle is what the user typed plus the platform it belongs to. socialHandleUrl() resolves one to a canonical link."
      >
        <PropsTable props={[
          { name: "platformId", type: "string",  def: "—", desc: "SocialHandle — id from SOCIAL_PLATFORMS, or undefined for a plain link." },
          { name: "value",      type: "string",  def: "(required)", required: true, desc: "SocialHandle — what the user typed: a bare handle or a full link." },
          { name: "id",         type: "string",  def: "(required)", required: true, desc: "SocialPlatform — stable id, e.g. \"instagram\"." },
          { name: "name",       type: "string",  def: "(required)", required: true, desc: "SocialPlatform — display name." },
          { name: "Icon",       type: "Component", def: "(required)", required: true, desc: "SocialPlatform — 24×24 brand mark taking a size prop." },
          { name: "hosts",      type: "string[]", def: "(required)", required: true, desc: "SocialPlatform — hosts that identify the platform in a pasted link." },
          { name: "toUrl",      type: "(handle) => string", def: "(required)", required: true, desc: "SocialPlatform — builds a profile URL from a bare handle." },
        ]} />
      </DocSection>

      <DocSection
        title="EmojiCategory / EmojiEntry"
        desc="The dataset shape. Swap in your own categories to change what the picker offers."
      >
        <PropsTable props={[
          { name: "id",       type: "string",       def: "(required)", required: true, desc: "Category id. Used by the nav row and scroll-spy." },
          { name: "label",    type: "string",       def: "(required)", required: true, desc: "Section heading, rendered uppercase." },
          { name: "icon",     type: "string",       def: "(required)", required: true, desc: "Representative emoji shown in the category nav." },
          { name: "emoji",    type: "EmojiEntry[]", def: "(required)", required: true, desc: "Emoji in the category." },
          { name: "char",     type: "string",       def: "(required)", required: true, desc: "EmojiEntry — the unicode character." },
          { name: "name",     type: "string",       def: "(required)", required: true, desc: "EmojiEntry — accessible label and primary search term." },
          { name: "keywords", type: "string[]",     def: "—",          desc: "EmojiEntry — search synonyms." },
        ]} />
      </DocSection>

      <DocSection
        title="FmtItem"
        desc="Five item kinds. Every kind needs a unique id — that id is what onAction reports and what active matches against."
      >
        <PropsTable props={[
          { name: "font",   type: '{ id, value, label? }', def: "—", desc: "Font family trigger — label plus a dimmed chevron. Opens the host app's picker." },
          { name: "icon",   type: "{ id, icon, label }",   def: "—", desc: "Icon-only toggle. 38×38, 10px radius." },
          { name: "glyph",  type: "{ id, glyph, label, decoration? }", def: "—", desc: "Letterform toggle (B/I/U/S), set in Georgia. decoration is \"underline\" or \"line-through\"." },
          { name: "swatch", type: "{ id, color, label }",  def: "—", desc: "Current text colour as a 17px filled dot with a hairline ring." },
          { name: "pill",   type: "{ id, label, icon?, toggle? }", def: "—", desc: "Labelled action, 25px radius. Set toggle if it holds an on/off state." },
        ]} />
      </DocSection>
    </DocPage>
  );
}
