import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const baseClassName = [
  "inline-flex items-center justify-center gap-1.5 shrink-0",
  "transition-all duration-300 ease-out",
  "disabled:active:brightness-100 active:brightness-80",
  "text-sm font-medium whitespace-nowrap",
  "rounded-md no-underline cursor-pointer",
  "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "outline-none focus-visible:ring-[3px]",
  "aria-invalid:ring-danger/40 aria-invalid:border-danger",
  "aria-busy:opacity-75 aria-busy:saturate-100 aria-busy:cursor-progress",
  "disabled:opacity-75 disabled:saturate-0 disabled:cursor-not-allowed",
];

const defaultThemes = {
  default:
    "bg-muted text-foreground hover:bg-secondary hover:text-secondary-foreground",
  accent:
    "bg-accent text-white hover:text-[color-mix(in_oklch,var(--color-white)_90%,black_8%)] hover:bg-[color-mix(in_oklch,var(--color-accent)_90%,black_8%)]",
  info: "bg-info text-white hover:text-[color-mix(in_oklch,var(--color-white)_90%,black_8%)] hover:bg-[color-mix(in_oklch,var(--color-info)_90%,black_8%)]",
  success:
    "bg-success text-white hover:text-[color-mix(in_oklch,var(--color-white)_90%,black_8%)] hover:bg-[color-mix(in_oklch,var(--color-success)_90%,black_8%)]",
  danger:
    "bg-danger text-white hover:text-[color-mix(in_oklch,var(--color-white)_90%,black_8%)] hover:bg-[color-mix(in_oklch,var(--color-danger)_90%,black_8%)]",
  warning:
    "bg-warning text-white hover:text-[color-mix(in_oklch,var(--color-white)_90%,black_8%)] hover:bg-[color-mix(in_oklch,var(--color-warning)_90%,black_8%)]",
};

const themeClassName = {
  default: "focus-visible:ring-secondary-foreground/25",
  accent: "focus-visible:ring-accent/25",
  info: "focus-visible:ring-info/25",
  success: "focus-visible:ring-success/25",
  danger: "focus-visible:ring-danger/25",
  warning: "focus-visible:ring-warning/25",
};

const ghostThemes = {
  default: "hover:bg-muted",
  accent: "hover:bg-accent hover:text-white",
  info: "hover:bg-info hover:text-white",
  success: "hover:bg-success hover:text-white",
  danger: "hover:bg-danger hover:text-white",
  warning: "hover:bg-warning hover:text-white",
};

const transparentThemes = {
  default: "text-foreground hover:bg-muted/50",
  accent: "text-accent hover:bg-accent/10",
  info: "text-info hover:bg-info/10",
  success: "text-success hover:bg-success/10",
  danger: "text-danger hover:bg-danger/10",
  warning: "text-warning hover:bg-warning/10",
};

const outlineThemes = {
  default:
    "text-foreground bg-input/30 border-border hover:text-secondary-foreground hover:bg-muted/50",
  accent: "text-accent border-accent hover:bg-accent hover:text-white",
  info: "text-info border-info hover:bg-info hover:text-white",
  success: "text-success border-success hover:bg-success hover:text-white",
  danger: "text-danger border-danger hover:bg-danger hover:text-white",
  warning: "text-warning border-warning hover:bg-warning hover:text-white",
};

const sizeThemes = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 !gap-1 px-3 has-[>svg]:px-3",
  lg: "!text-base !gap-2 h-9.5 px-4 [&_svg:not([class*='size-'])]:!size-5",
  icon: "size-9",
  responsive:
    "h-9 px-4 py-2 has-[>svg]:px-3 md:h-8 md:gap-1.5 md:rounded-md md:px-3 md:has-[>svg]:px-2.5",
};

type ButtonProps = ComponentProps<typeof ButtonPrimitive> & {
  theme?: "default" | "accent" | "info" | "success" | "danger" | "warning";
  size?: "default" | "sm" | "lg" | "icon" | "responsive";
  variant?: "default" | "ghost" | "outline" | "transparent";
};

function Button({
  className,
  children,
  variant = "default",
  theme = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const sizeClassName = sizeThemes[size];

  const variantClassName = {
    default: defaultThemes[theme],
    ghost: `bg-transparent ${ghostThemes[theme]}`,
    transparent: `bg-transparent ${transparentThemes[theme]}`,
    outline: `bg-transparent border border-border ${outlineThemes[theme]}`,
  };

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        themeClassName[theme],
        variantClassName[variant],
        baseClassName,
        sizeClassName,
        className,
      )}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { Button };
