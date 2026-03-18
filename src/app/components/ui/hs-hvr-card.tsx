import React, { useState } from "react";

/* HeartStamp — Hover Card primitive */
export function HvrCard({ trigger, children }: any) {
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
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,.15)",
            padding: 16,
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
