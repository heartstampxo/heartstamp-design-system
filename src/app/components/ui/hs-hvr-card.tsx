import React, { useState } from "react";

interface HvrCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function HvrCard({ trigger, children }: HvrCardProps) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {trigger}
      {show && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + var(--space-2))",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "0 8px 32px rgba(0,0,0,.15)",
            padding: "var(--space-4)",
            minWidth: 260,
            zIndex: 100,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
