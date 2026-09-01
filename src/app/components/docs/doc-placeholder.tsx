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
      minHeight: 300, gap: "var(--space-3)", color: "var(--muted-fg)",
    }}>
      <div style={{ fontSize: "var(--font-size-h3)", opacity: .15 }}>📄</div>
      <div style={{ fontSize: "var(--font-size-h5)", fontWeight: "var(--font-weight-bold, 700)" as any, color: "var(--fg)" }}>{item?.title || id}</div>
      <div style={{ fontSize: "var(--font-size-body-13)" }}>Documentation coming soon.</div>
      <Btn variant="outline" style={{ marginTop: "var(--space-2)" }}>Request docs</Btn>
    </div>
  );
}
