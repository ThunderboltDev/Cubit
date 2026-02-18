import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SpinnerProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">;

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 animate-spin cursor-progress fill-current",
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
