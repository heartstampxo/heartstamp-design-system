import React from "react";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Social brand marks

   Hand-drawn 24×24 glyphs on a 0 0 24 24 viewBox, filled with
   currentColor so they inherit whatever colour the caller sets.
   Shared by the website footer and the social handles editor.

   `size` scales the glyph; the paths are authored at 24.
═══════════════════════════════════════════════════════ */

export interface SocialIconProps {
  size?: number;
}

const svgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "currentColor" as const,
  "aria-hidden": true as const,
});

export function FacebookIcon({ size = 24 }: SocialIconProps = {}) {
  return (
    <svg {...svgProps(size)}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.414c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.098 24 12.073" />
    </svg>
  );
}

export function InstagramIcon({ size = 24 }: SocialIconProps = {}) {
  return (
    <svg {...svgProps(size)}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.08 4.08 0 0 1 1.523.99 4.08 4.08 0 0 1 .99 1.524c.163.46.35 1.26.403 2.428.058 1.267.07 1.647.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.08 4.08 0 0 1-.99 1.523 4.08 4.08 0 0 1-1.524.99c-.46.163-1.26.35-2.428.403-1.267.058-1.647.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.08 4.08 0 0 1-1.523-.99 4.08 4.08 0 0 1-.99-1.524c-.163-.46-.35-1.26-.403-2.428C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.08 4.08 0 0 1 .99-1.523A4.08 4.08 0 0 1 5.15 2.207c.46-.163 1.26-.35 2.428-.403C8.845 1.746 9.225 1.734 12 1.734L12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.903.333 4.14.63a5.876 5.876 0 0 0-2.126 1.384A5.876 5.876 0 0 0 .63 4.14C.333 4.903.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.059 1.277.261 2.15.558 2.912a5.876 5.876 0 0 0 1.384 2.126 5.876 5.876 0 0 0 2.126 1.384c.763.297 1.635.499 2.913.558C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.059 2.15-.261 2.912-.558a5.876 5.876 0 0 0 2.126-1.384 5.876 5.876 0 0 0 1.384-2.126c.297-.763.499-1.635.558-2.913C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.059-1.277-.261-2.15-.558-2.912a5.876 5.876 0 0 0-1.384-2.126A5.876 5.876 0 0 0 19.86.63C19.097.333 18.225.131 16.947.072 15.668.014 15.259 0 12 0zm0 5.838a6.163 6.163 0 1 0 0 12.325 6.163 6.163 0 0 0 0-12.325zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

export function XIcon({ size = 24 }: SocialIconProps = {}) {
  return (
    <svg {...svgProps(size)}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function YouTubeIcon({ size = 24 }: SocialIconProps = {}) {
  return (
    <svg {...svgProps(size)}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 24 }: SocialIconProps = {}) {
  return (
    <svg {...svgProps(size)}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Platform registry
   Order is the order they appear in pickers and icon rows.
═══════════════════════════════════════════════════════ */

export interface SocialPlatform {
  id: string;
  name: string;
  Icon: (props: SocialIconProps) => React.JSX.Element;
  /** Hosts that identify this platform in a pasted link. */
  hosts: string[];
  /** Builds a canonical profile URL from a bare handle. */
  toUrl: (handle: string) => string;
}

/* Order matches the website footer's icon row, which this list now drives. */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "facebook",
    name: "Facebook",
    Icon: FacebookIcon,
    hosts: ["facebook.com", "fb.com", "fb.me"],
    toUrl: (h) => `https://facebook.com/${h}`,
  },
  {
    id: "instagram",
    name: "Instagram",
    Icon: InstagramIcon,
    hosts: ["instagram.com", "instagr.am"],
    toUrl: (h) => `https://instagram.com/${h}`,
  },
  {
    id: "x",
    name: "X",
    Icon: XIcon,
    hosts: ["x.com", "twitter.com"],
    toUrl: (h) => `https://x.com/${h}`,
  },
  {
    id: "youtube",
    name: "YouTube",
    Icon: YouTubeIcon,
    hosts: ["youtube.com", "youtu.be"],
    toUrl: (h) => `https://youtube.com/@${h}`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    Icon: WhatsAppIcon,
    hosts: ["whatsapp.com", "wa.me"],
    toUrl: (h) => `https://wa.me/${h.replace(/[^\d]/g, "")}`,
  },
];

export const findSocialPlatform = (id: string | undefined) =>
  SOCIAL_PLATFORMS.find((p) => p.id === id);

/**
 * Reads a platform out of a pasted link. Returns undefined for a bare handle,
 * where the platform has to come from the picker instead.
 */
export function detectSocialPlatform(value: string): SocialPlatform | undefined {
  const v = value.trim().toLowerCase();
  if (!v.includes(".")) return undefined;
  const host = v.replace(/^[a-z]+:\/\//, "").replace(/^www\./, "").split("/")[0];
  return SOCIAL_PLATFORMS.find((p) => p.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
}

/** Strips a leading @ and any URL wrapper down to the bare handle. */
export function normaliseSocialHandle(value: string): string {
  const v = value.trim();
  if (!v) return "";
  if (v.includes(".") && !v.startsWith("@")) {
    const path = v.replace(/^[a-z]+:\/\//i, "").split("/").slice(1).join("/");
    return path.replace(/^@/, "").replace(/\/+$/, "") || v;
  }
  return v.replace(/^@/, "");
}
