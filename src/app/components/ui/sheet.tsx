"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { XIcon } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";

function Sheet({
  direction = "right",
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      data-slot="sheet"
      direction={direction}
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-black/45", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DrawerPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "group/sheet-content fixed z-50 flex flex-col bg-[var(--color-text-on-secondary)] shadow-xl outline-none",
          // right
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:border-[var(--border)]",
          // left
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:border-[var(--border)]",
          // bottom
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-[12px] data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:border-[var(--border)]",
          // top
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-[12px] data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:border-[var(--border)]",
          className,
        )}
        {...props}
      >
        {/* Drag handle — shown only for bottom/top drawers */}
        <div className="mx-auto mt-3 hidden h-1.5 w-[40px] shrink-0 rounded-full bg-[var(--border)] group-data-[vaul-drawer-direction=bottom]/sheet-content:block group-data-[vaul-drawer-direction=top]/sheet-content:block" />
        {children}
        {/* Close button */}
        <DrawerPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 size-6 rounded-xs text-[var(--color-text-secondary)] opacity-70 hover:opacity-100 transition-opacity duration-150"
          >
            <XIcon size={16} />
            <span className="sr-only">Close</span>
          </Button>
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-3 pt-[var(--space-8)] px-[var(--space-8)] pb-[var(--space-4)]", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 py-[var(--space-4)] px-[var(--space-8)]", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
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
