import React, { useState } from "react";

interface AvtProps {
  src?: string;
  fallback?: string;
  size?: number;
}

/* HeartStamp — Avatar primitive */
export function Avt({ src, fallback = "AB", size = 40 }: AvtProps) {
  const [err, setErr] = useState(false);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-full)",
        overflow: "hidden",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        color: "var(--fg)",
        border: "1.5px solid var(--border)",
        flexShrink: 0,
      }}
    >
      {src && !err ? (
        <img
          src={src}
          onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt={fallback}
        />
      ) : (
        fallback
      )}
    </div>
  );
}
