import React from "react";
import { Btn } from "../ui/btn";
import { ALL_ITEMS } from "../../nav-config";

interface PlaceholderPageProps {
  id: string;
}

export function PlaceholderPage({ id }: PlaceholderPageProps) {
  const item = ALL_ITEMS.find(i => i.id === id);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: 300, gap: 12, color: "var(--muted-fg)",
    }}>
      <div style={{ fontSize: 36, opacity: .15 }}>📄</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{item?.title || id}</div>
      <div style={{ fontSize: 13 }}>Documentation coming soon.</div>
      <Btn variant="outline" style={{ marginTop: 8 }}>Request docs</Btn>
    </div>
  );
}
