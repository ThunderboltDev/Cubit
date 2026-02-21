import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type LinkButtonProps = ComponentProps<typeof Link> &
  ComponentProps<typeof Button>;

export function LinkButton({ className, onClick, ...props }: LinkButtonProps) {
  return (
    <Button
      nativeButton={false}
      className={className}
      render={<Link {...props} />}
      onClick={onClick}
      {...props}
    />
  );
}
