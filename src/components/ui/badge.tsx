import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const baseClassName = [
  "inline-flex items-center justify-center gap-1 shrink-0",
  "text-xs font-medium whitespace-nowrap",
  "rounded-full no-underline cursor-pointer",
  "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
  "[&_svg:not([class*='size-'])]:size-3.5",
  "outline-none",
];

const defaultThemes = {
  default: "bg-muted text-foreground",
  accent: "bg-accent text-white",
  gold: "bg-gold text-white",
  info: "bg-info text-white",
  success: "bg-success text-white",
  danger: "bg-danger text-white",
  warning: "bg-warning text-white",
};

const softThemes = {
  default: "bg-muted/50 text-foreground",
  accent: "bg-accent/10 text-accent",
  gold: "bg-gold/10 text-gold",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
};

const outlineThemes = {
  default: "border border-border text-foreground",
  accent: "border border-accent text-accent",
  gold: "border border-gold text-gold",
  info: "border border-info text-info",
  success: "border border-success text-success",
  danger: "border border-danger text-danger",
  warning: "border border-warning text-warning",
};

const subtleThemes = {
  default: "bg-muted/30 text-foreground/80",
  accent: "bg-accent/15 text-accent",
  gold: "bg-gold/15 text-gold",
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
};

const sizeThemes = {
  sm: "h-5 px-2 py-0.5 text-[10px] [&_svg:not([class*='size-'])]:size-3",
  default: ".5 px-h-52.5 py-0.5 [&_svg:not([class*='size-'])]:size-3.5",
  lg: "h-6.5 px-3 py-1 text-sm [&_svg:not([class*='size-'])]:size-4",
  xl: "h-7 px-3.5 py-1.5 text-sm [&_svg:not([class*='size-'])]:size-4",
};

type BadgeProps = ComponentProps<"span"> & {
  theme?:
    | "default"
    | "accent"
    | "gold"
    | "info"
    | "success"
    | "danger"
    | "warning";
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "soft" | "outline" | "subtle";
};

function Badge({
  className,
  children,
  variant = "default",
  theme = "default",
  size = "default",
  ...props
}: BadgeProps) {
  const sizeClassName = sizeThemes[size];

  const variantClassName = {
    default: defaultThemes[theme],
    soft: softThemes[theme],
    outline: outlineThemes[theme],
    subtle: subtleThemes[theme],
  };

  return (
    <span
      data-slot="badge"
      className={cn(
        variantClassName[variant],
        baseClassName,
        sizeClassName,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
