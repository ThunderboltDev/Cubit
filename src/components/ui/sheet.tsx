import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  variant = "outline",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      render={<Button variant={variant} {...props} />}
    />
  );
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-250 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  responsive = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
  responsive?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed z-50 flex flex-col gap-4 bg-clip-padding text-sm shadow-lg transition duration-250 ease-in-out border-border p-2",
          responsive
            ? [
                "inset-x-0 bottom-0 h-auto border-t",
                "md:inset-y-0 md:bottom-auto md:h-full! md:w-3/4 md:border-t-0",
                side === "right"
                  ? "md:right-0 md:left-auto md:border-l md:data-closed:slide-out-to-right-10 md:data-open:slide-in-from-right-10"
                  : "",
                side === "left"
                  ? "md:left-0 md:right-auto md:border-r md:data-closed:slide-out-to-left-10 md:data-open:slide-in-from-left-10"
                  : "",
                "md:sm:max-w-sm",
                "data-closed:slide-out-to-bottom-10 data-open:slide-in-from-bottom-10",
                "md:data-closed:slide-out-to-bottom-0 md:data-open:slide-in-from-bottom-0",
              ]
            : [
                side === "right" &&
                  "inset-y-0 right-0 h-dvh w-3/4 border-l data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-open:slide-in-from-right-10 sm:max-w-sm",
                side === "left" &&
                  "inset-y-0 left-0 h-dvh w-3/4 border-r data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-open:slide-in-from-left-10 sm:max-w-sm",
                side === "top" &&
                  "inset-x-0 top-0 h-auto border-b data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-open:slide-in-from-top-10",
                side === "bottom" &&
                  "inset-x-0 bottom-0 h-auto border-t data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-open:slide-in-from-bottom-10",
              ],

          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3 size-8"
                size="icon"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("gap-0.5 p-4 flex flex-col", className)}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("gap-2 px-4 flex flex-col", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("gap-2 p-4 mt-auto flex flex-row justify-end", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground text-lg font-bold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function SheetAction({
  className,
  size = "responsive",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="sheet-action"
      className={cn(className)}
      size={size}
      {...props}
    />
  );
}

function SheetCancel({
  className,
  variant = "secondary",
  size = "responsive",
  children,
  ...props
}: SheetPrimitive.Close.Props &
  Pick<ComponentProps<typeof Button>, "variant" | "size">) {
  if (!children)
    children = (
      <>
        <HugeiconsIcon icon={Cancel01Icon} />
        Cancel
      </>
    );

  return (
    <SheetPrimitive.Close
      data-slot="sheet-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    >
      {children}
    </SheetPrimitive.Close>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetAction,
  SheetCancel,
};
