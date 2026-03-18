import React from "react";
import { motion } from "motion/react";
import {
  Palette, Settings, Bell, Lock, AtSign, Calendar, CalendarCheck,
  History, Home, Wallet, Sun, Moon, Monitor, X, Search, LogOut,
} from "lucide-react";
import { Avt } from "./hs-avt";
import { HSLockup, useIsDark } from "./hs-logo";
import { DARK_THEME, LIGHT_THEME } from "../../theme";
import lockupDark from "../../../assets/type=Lockup, color=brand, Theme=Dark.svg?url";

/* ── Shared styles ─────────────────────────────────────────────────────── */
const pnItemStyle: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center", gap: 6,
  padding: "var(--space-2) var(--space-4)", background: "none", border: "none", cursor: "pointer",
  color: "var(--color-text-primary)", fontSize: "var(--font-size-body-15)", textAlign: "left", fontFamily: "inherit",
};
const pnCardStyle: React.CSSProperties = {
  background: "var(--bg-menus)", borderRadius: "var(--radius-3xl)", overflow: "hidden",
  boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
  border: "1px solid var(--color-element-subtle)",
  position: "relative",
};

/* ── BrightnessIcon ────────────────────────────────────────────────────── */
function BrightnessIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 14C7.21207 14 6.43185 13.8448 5.7039 13.5433C4.97595 13.2418 4.31451 12.7998 3.75736 12.2426C3.20021 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 7.21207 2.15519 6.43185 2.45672 5.7039C2.75825 4.97595 3.20021 4.31451 3.75736 3.75736C4.31451 3.20021 4.97595 2.75825 5.7039 2.45672C6.43185 2.15519 7.21207 2 8 2M8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2418 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2418 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2418 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2M8 14V2M8 6L11.1 2.9M8 9.53333L12.9133 4.62M8 13.0667L13.9 7.16667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Row components ────────────────────────────────────────────────────── */
export function PnNavRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button style={pnItemStyle} whileHover={{ background: "var(--color-state-hover)" }} transition={{ duration: 0.12 }}>
      <span style={{ color: "var(--color-text-secondary)", display: "flex", flexShrink: 0, width: 16, height: 16, alignItems: "center", justifyContent: "center" }}>{icon}</span>
      {label}
    </motion.button>
  );
}

export function PnSignOutRow() {
  return (
    <motion.button
      style={{ ...pnItemStyle }}
      whileHover={{ background: "var(--color-state-hover)" }}
      transition={{ duration: 0.12 }}
      onPointerEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--color-brand-primary)";
        const s = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(".hs-signout-icon");
        if (s) s.style.color = "var(--color-brand-primary)";
      }}
      onPointerLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
        const s = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(".hs-signout-icon");
        if (s) s.style.color = "var(--color-text-secondary)";
      }}
    >
      <span className="hs-signout-icon" style={{ color: "var(--color-text-secondary)", display: "flex", flexShrink: 0, width: 16, height: 16, alignItems: "center", justifyContent: "center", transition: "color 0.12s" }}>
        <LogOut size={16} />
      </span>
      Sign out
    </motion.button>
  );
}

export function PnThemeRow({ theme, setTheme }: { theme: "light"|"dark"|"system"; setTheme: (t: "light"|"dark"|"system") => void }) {
  return (
    <div style={{ ...pnItemStyle, cursor: "default" }}>
      <span style={{ color: "var(--color-text-secondary)", display: "flex", flexShrink: 0, width: 16, height: 16, alignItems: "center", justifyContent: "center" }}><BrightnessIcon size={16} /></span>
      <span style={{ flex: 1 }}>Theme</span>
      <div style={{ display: "flex", background: "var(--color-brand-secondary-dim)", borderRadius: "var(--radius-full)", padding: "var(--space-1)", gap: "var(--space-2)" }}>
        {([["light", <Sun size={14} />], ["dark", <Moon size={14} />], ["system", <Monitor size={14} />]] as [string, React.ReactNode][]).map(([val, icon]) => (
          <motion.button
            key={val}
            onClick={() => setTheme(val as any)}
            style={{
              height: 28, width: 36, border: "none", cursor: "pointer", borderRadius: "var(--radius-full)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: theme === val ? "var(--bg-menus)" : "transparent",
              color: "var(--fg)",
              boxShadow: theme === val ? "0 0 4px rgba(0,0,0,0.08)" : "none",
              fontFamily: "inherit",
            }}
            whileHover={theme !== val ? { background: "var(--color-state-hover)" } : {}}
            transition={{ duration: 0.12 }}
          >{icon}</motion.button>
        ))}
      </div>
    </div>
  );
}

export function PnDivider() { return <div style={{ height: 1, background: "var(--color-element-subtle)" }} />; }

export function PnUserHeader() {
  return (
    <div style={{ padding: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
      <Avt size={40} src="https://i.pravatar.cc/80?img=68" fallback="JW" />
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: "24px" }}>Jason Williams</div>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: "20px" }}>jasonwilliams@gmail.com</div>
      </div>
    </div>
  );
}

/* ── Desktop & Mobile ──────────────────────────────────────────────────── */
export function ProfileNavDesktop({ theme, setTheme }: { theme: "light"|"dark"|"system"; setTheme: (t: "light"|"dark"|"system") => void }) {
  const sysIsDark = useIsDark();
  const themeVars: React.CSSProperties = theme === "dark" ? DARK_THEME : theme === "light" ? LIGHT_THEME : (sysIsDark ? DARK_THEME : LIGHT_THEME);
  return (
    <div style={themeVars}>
    <motion.div
      style={{ ...pnCardStyle, width: 384 }}
      initial={{ opacity: 0, scale: 0.97, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
    >
      <PnUserHeader />
      <div style={{ borderTop: "1px solid var(--color-element-subtle)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "var(--space-3) 0" }}>
          <PnNavRow icon={<Palette size={16} />}        label="My cards" />
          <PnDivider />
          <PnNavRow icon={<Settings size={16} />}       label="Settings" />
          <PnThemeRow theme={theme} setTheme={setTheme} />
          <PnNavRow icon={<AtSign size={16} />}         label="Addresses" />
          <PnNavRow icon={<CalendarCheck size={16} />}  label="Reminders" />
          <PnNavRow icon={<History size={16} />}        label="Order history" />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--color-element-subtle)", padding: "var(--space-3) 0" }}>
        <PnSignOutRow />
      </div>
    </motion.div>
    </div>
  );
}

export function ProfileNavMobile({ theme, setTheme }: { theme: "light"|"dark"|"system"; setTheme: (t: "light"|"dark"|"system") => void }) {
  const sysIsDark = useIsDark();
  const themeVars: React.CSSProperties = theme === "dark" ? DARK_THEME : theme === "light" ? LIGHT_THEME : (sysIsDark ? DARK_THEME : LIGHT_THEME);
  const isDarkMode = theme === "dark" || (theme === "system" && sysIsDark);
  return (
    <div style={themeVars}>
    <motion.div
      style={{ ...pnCardStyle, width: 393, borderRadius: "var(--radius-none)", boxShadow: "none" }}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
    >
      <div style={{ padding: "0 var(--space-4)", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-element-subtle)" }}>
        <button style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", borderRadius: "var(--radius-sm)", flexShrink: 0 }}>
          <X size={18} />
        </button>
        {isDarkMode
          ? <img src={lockupDark} height={26} width={104} alt="HeartStamp" style={{ display: "block" }} />
          : <HSLockup color="brand" height={26} />
        }
        <button style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", borderRadius: "var(--radius-sm)", flexShrink: 0 }}>
          <Search size={18} />
        </button>
      </div>
      <PnUserHeader />
      <div style={{ borderTop: "1px solid var(--color-element-subtle)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "var(--space-3) 0" }}>
          <PnNavRow icon={<Home size={16} />}          label="Home" />
          <PnNavRow icon={<Palette size={16} />}       label="My cards" />
          <PnDivider />
          <PnNavRow icon={<Settings size={16} />}      label="Settings" />
          <PnNavRow icon={<Bell size={16} />}          label="Notifications" />
          <PnNavRow icon={<Lock size={16} />}          label="Security" />
          <PnThemeRow theme={theme} setTheme={setTheme} />
          <PnDivider />
          <PnNavRow icon={<AtSign size={16} />}        label="Addresses" />
          <PnNavRow icon={<Calendar size={16} />}      label="Reminders" />
          <PnNavRow icon={<History size={16} />}       label="Order history" />
          <PnDivider />
          <PnSignOutRow />
        </div>
      </div>
    </motion.div>
    </div>
  );
}
