import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentProps<typeof Link> &
  ComponentProps<typeof Button> & {
    buttonClassName?: string;
  };

export function LinkButton({
  buttonClassName,
  className,
  children,
  onClick,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      nativeButton={false}
      className={buttonClassName}
      render={<Link className={cn("no-underline", className)} {...props} />}
      onClick={onClick}
      {...props}
    />
  );
}
