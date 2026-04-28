import React, { useState } from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { StyleSidebar, StyleSidebarMobile } from "../components/ui/hs-style-sidebar";

export function PageStyleSidebar() {
  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState<string | undefined>(undefined);

  return (
    <DocPage
      title="Sidebar"
      subtitle="A toolbar + slide-in panel used in editor interfaces to browse and apply art styles. Combines a vertical icon toolbar with an animated Sheet-like panel."
    >
      <DocSection title="Default">
        <Preview
          title="Editor Sidebar"
          height={820}
          fullWidth
          code={`import { StyleSidebar } from "@heartstamp/design-system";\n\nfunction Example() {\n  const [open, setOpen] = useState(false);\n  const [selected, setSelected] = useState(null);\n\n  return (\n    <div style={{ height: 820 }}>\n      <StyleSidebar\n        open={open}\n        onOpenChange={setOpen}\n        selected={selected}\n        onSelect={setSelected}\n        onApply={(id) => setOpen(false)}\n      />\n    </div>\n  );\n}`}
        >
          <div style={{ width: "100%", height: 820, background: "var(--color-bg-editor)" }}>
            <StyleSidebar
              open={open}
              onOpenChange={setOpen}
              selected={selected}
              onSelect={setSelected}
              onApply={() => { setSelected(null); setOpen(false); }}
            />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable props={[
          { name: "open",           type: "boolean",                      desc: "Controlled open state of the style panel." },
          { name: "defaultOpen",    type: "boolean",        def: "false",  desc: "Uncontrolled: panel starts open." },
          { name: "onOpenChange",   type: "(open: boolean) => void",       desc: "Callback when panel open state changes." },
          { name: "recommended",    type: "StyleItem[]",                   desc: "Styles shown in the Recommended section. Defaults to built-in sample set." },
          { name: "styles",         type: "StyleItem[]",                   desc: "Styles shown in the tabbed browse section." },
          { name: "selected",       type: "string | null",                 desc: "Controlled selected style id." },
          { name: "onSelect",       type: "(id: string | null) => void",   desc: "Fired when a style card is clicked. Pass null to deselect." },
          { name: "onApply",        type: "(id: string) => void",          desc: "Fired when user clicks Apply Style." },
        ]} />
      </DocSection>

      <DocSection title="Mobile">
        <Preview
          title="Mobile Bottom Nav"
          height={900}
          defaultViewport="mobile"
          code={`import { StyleSidebarMobile } from "@heartstamp/design-system";\n\nfunction Example() {\n  const [activeNav, setActiveNav] = useState(undefined);\n\n  return (\n    <StyleSidebarMobile\n      activeNav={activeNav}\n      onNavChange={setActiveNav}\n    />\n  );\n}`}
        >
          {/* iPhone 14 Pro ratio — 393 × 852pt */}
          <div style={{ width: 393, height: 852, background: "var(--color-bg-editor)", overflow: "hidden" }}>
            <StyleSidebarMobile activeNav={mobileNav} onNavChange={setMobileNav} />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Mobile Props">
        <PropsTable props={[
          { name: "activeNav",    type: "string",                   desc: "Controlled active nav item id." },
          { name: "onNavChange",  type: "(id: string) => void",     desc: "Fired when a nav item is pressed." },
        ]} />
      </DocSection>
    </DocPage>
  );
}
