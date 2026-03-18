"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";

/* ── Open state context ─────────────────────────────────────
   Shares the resolved open boolean with SheetContent so
   AnimatePresence can drive enter / exit animations.        */
const SheetStateContext = React.createContext<boolean>(false);

function Sheet({
  open: openProp,
  onOpenChange,
  defaultOpen,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const controlled = openProp !== undefined;
  const [isOpen, setIsOpen] = React.useState(openProp ?? defaultOpen ?? false);
  const open = controlled ? openProp! : isOpen;

  const handleOpenChange = (val: boolean) => {
    if (!controlled) setIsOpen(val);
    onOpenChange?.(val);
  };

  return (
    <SheetStateContext.Provider value={open}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </SheetStateContext.Provider>
  );
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/* ── Motion variants per side ───────────────────────────── */
const slideVariants = {
  right:  { hidden: { x: "100%", opacity: 0 },  visible: { x: 0, opacity: 1 } },
  left:   { hidden: { x: "-100%", opacity: 0 }, visible: { x: 0, opacity: 1 } },
  top:    { hidden: { y: "-100%", opacity: 0 }, visible: { y: 0, opacity: 1 } },
  bottom: { hidden: { y: "100%", opacity: 0 },  visible: { y: 0, opacity: 1 } },
} as const;

const sideStyles: Record<string, React.CSSProperties> = {
  right:  { inset: "0 0 0 auto", height: "100%", width: "75%", maxWidth: 384, borderLeft:   "1px solid var(--border)" },
  left:   { inset: "0 auto 0 0", height: "100%", width: "75%", maxWidth: 384, borderRight:  "1px solid var(--border)" },
  top:    { inset: "0 0 auto 0", width: "100%",                               borderBottom: "1px solid var(--border)" },
  bottom: { inset: "auto 0 0 0", width: "100%",                               borderTop:    "1px solid var(--border)" },
};

// Slide + fade in: slow spring with a tiny bounce, slight delay
const enterTransition = { type: "spring", stiffness: 220, damping: 24, mass: 1.0, delay: 0.04 } as const;
const exitTransition  = { duration: 0.22, ease: [0.4, 0.0, 1, 1] } as const;

/* ── SheetContent ───────────────────────────────────────── */
function SheetContent({
  children,
  side = "right",
  style,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  const open = React.useContext(SheetStateContext);

  return (
    <SheetPortal forceMount>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <SheetPrimitive.Overlay forceMount asChild>
              <motion.div
                data-slot="sheet-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.18, ease: "easeIn" } }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.45)" }}
              />
            </SheetPrimitive.Overlay>

            {/* Panel */}
            <SheetPrimitive.Content forceMount asChild {...props}>
              <motion.div
                data-slot="sheet-content"
                initial={slideVariants[side].hidden}
                animate={{ ...slideVariants[side].visible, transition: enterTransition }}
                exit={{ ...slideVariants[side].hidden, opacity: 0, transition: exitTransition }}
                style={{
                  position: "fixed",
                  zIndex: 50,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  background: "var(--bg)",
                  boxShadow: "var(--shadow-2xl)",
                  outline: "none",
                  ...sideStyles[side],
                  ...style,
                }}
              >
                {children}
                <SheetPrimitive.Close
                  style={{
                    position: "absolute", top: 16, right: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 24, height: 24, borderRadius: 4,
                    background: "none", border: "none",
                    color: "var(--muted-fg)", cursor: "pointer",
                    opacity: 0.7, transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
                >
                  <XIcon size={16} />
                  <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Close</span>
                </SheetPrimitive.Close>
              </motion.div>
            </SheetPrimitive.Content>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
