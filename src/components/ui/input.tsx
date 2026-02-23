import { Input as InputPrimitive } from "@base-ui/react/input";
import type { ChangeEvent, ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  inputMode,
  pattern,
  onChange,
  ...props
}: ComponentProps<"input">) {
  const isNumeric = type === "number";

  const handleNumericChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNumeric) {
      onChange?.(e);
      return;
    }

    e.target.value = e.target.value.replace(/[^0-9]/g, "");

    onChange?.(e);
  };

  return (
    <InputPrimitive
      data-slot="input"
      type={isNumeric ? "text" : type}
      inputMode={isNumeric ? "numeric" : inputMode}
      onChange={isNumeric ? handleNumericChange : onChange}
      className={cn(
        "input",
        type === "file" && "cursor-pointer",
        "file:inline-flex file:h-7 file:gap-2 file:border-0 file:bg-transparent file:cursor-pointer",
        "file:font-medium file:text-secondary-foreground file:text-sm file:mr-3",
        className,
      )}
      pattern={isNumeric ? "[0-9]*" : pattern}
      {...props}
    />
  );
}

export { Input };
