import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const baseClassName = [
  "inline-flex items-center justify-center gap-1.5 shrink-0",
  "transition-all duration-250 ease-out focus-ring",
  "text-sm font-medium whitespace-nowrap active:opacity-50",
  "rounded-md no-underline cursor-pointer",
  "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "aria-invalid:ring-danger/50 aria-invalid:border-danger",
  "aria-busy:opacity-50 aria-busy:saturate-100 aria-busy:cursor-progress",
  "disabled:opacity-50 disabled:saturate-0 disabled:cursor-not-allowed",
];

const defaultThemes = {
  default:
    "bg-muted/50 border border-border text-foreground hover:bg-secondary/50 hover:text-secondary-foreground",
  accent:
    "bg-accent text-white hover:text-[color-mix(in_oklch,var(--color-white)_90%,black_8%)] hover:bg-[color-mix(in_oklch,var(--color-accent)_90%,black_8%)]",
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
  success: "focus-visible:ring-success/25",
  danger: "focus-visible:ring-danger/25",
  warning: "focus-visible:ring-warning/25",
};

const ghostThemes = {
  default: "hover:bg-muted",
  accent: "hover:bg-accent hover:text-white",
  success: "hover:bg-success hover:text-white",
  danger: "hover:bg-danger hover:text-white",
  warning: "hover:bg-warning hover:text-white",
};

const transparentThemes = {
  default: "text-foreground hover:bg-muted/50",
  accent: "text-accent hover:bg-accent/10",
  success: "text-success hover:bg-success/10",
  danger: "text-danger hover:bg-danger/10",
  warning: "text-warning hover:bg-warning/10",
};

const sizeThemes = {
  "default": "h-9 px-4 py-2 has-[>svg]:px-3",
  "sm": "h-8 !gap-1 px-3 has-[>svg]:px-3",
  "lg": "!text-base !gap-2 h-9.5 px-4 [&_svg:not([class*='size-'])]:!size-5",
  "icon": "size-9",
  "icon-lg": "size-11",
  "responsive":
    "h-9 px-4 py-2 has-[>svg]:px-3 md:h-8 md:gap-1.5 md:rounded-md md:px-3 md:has-[>svg]:px-2.5",
};

type ButtonProps = ComponentProps<typeof ButtonPrimitive> & {
  theme?: "default" | "accent" | "success" | "danger" | "warning";
  size?: "default" | "sm" | "lg" | "icon" | "icon-lg" | "responsive";
  variant?: "default" | "ghost" | "transparent";
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
  };

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        variant === "default" && "shadow-sm",
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
