import { ChevronDown, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SelectContextType<T> = readonly [T, (value: T) => void];

const SelectContext = createContext<SelectContextType<string> | null>(null);

type SelectProviderProps<T> = {
  value: T;
  onValueChange?: (value: T) => void;
  children: ReactNode;
};

export function SelectProvider({
  value,
  onValueChange,
  children,
}: SelectProviderProps<string>) {
  const [state, setState] = useState<string>(value);

  const setSelectedValue = (value: string) => {
    setState(value);
    onValueChange?.(value);
  };

  return (
    <SelectContext.Provider value={[state, setSelectedValue]}>
      {children}
    </SelectContext.Provider>
  );
}

export function useSelect() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("useSelect must be used within an SelectProvider");
  }

  return context;
}

type SelectProps = {
  value: string;
  onValueChange?: (value: string) => void;
} & ComponentProps<typeof DropdownMenu>;

export function Select({ value, onValueChange, ...props }: SelectProps) {
  return (
    <SelectProvider value={value} onValueChange={onValueChange}>
      <DropdownMenu {...props} />
    </SelectProvider>
  );
}

export function SelectTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      {...props}
      render={
        <Button
          variant="outline"
          theme="default"
          className={cn(
            "text-secondary-foreground text-responsive! inline-flex gap-2 justify-between items-center px-6 w-full min-w-0 whitespace-normal",
            className,
          )}
        />
      }
    >
      <span className="inline-flex items-center gap-2">{children}</span>
      <HugeiconsIcon className="text-muted-foreground" icon={ChevronDown} />
    </DropdownMenuTrigger>
  );
}

export function SelectValue() {
  const [selectedValue] = useSelect();

  return selectedValue;
}

export function SelectContent({
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  return <DropdownMenuContent {...props} />;
}

type SelectItemProps = {
  value: string;
} & ComponentProps<typeof DropdownMenuItem>;

export function SelectItem({
  value,
  children,
  className,
  ...props
}: SelectItemProps) {
  const [selectedValue, setSelectedValue] = useSelect();

  return (
    <DropdownMenuItem
      {...props}
      className={cn("flex justify-between", className)}
      onClick={() => setSelectedValue(value)}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
      {selectedValue === value && (
        <HugeiconsIcon icon={Tick02Icon} className="size-5 text-accent" />
      )}
    </DropdownMenuItem>
  );
}
