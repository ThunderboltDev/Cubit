import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "input",
        type === "file" && "cursor-pointer",
        "file:inline-flex file:h-7 file:gap-2 file:border-0 file:bg-transparent file:cursor-pointer",
        "file:font-medium file:text-secondary-foreground file:text-sm file:mr-3",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
