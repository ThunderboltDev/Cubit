import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

const sizeClasses = {
  root: {
    sm: "h-[18px] w-[30px]",
    default: "h-[24px] w-[41px]",
  },
  thumb: {
    sm: "size-3.5 data-checked:translate-x-[14px] data-unchecked:translate-x-0.5",
    default:
      "size-5 data-checked:translate-x-[19px] data-unchecked:translate-x-0.5",
  },
};

interface SwitchProps extends SwitchPrimitive.Root.Props {
  size?: "sm" | "default";
}

function Switch({ className, size = "default", ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer group/switch relative inline-flex items-center shrink-0 transition-fast",
        "data-checked:bg-accent data-unchecked:bg-input",
        "rounded-full border-none outline-none",
        "inset-shadow-sm cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-accent/50",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        sizeClasses.root[size],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white rounded-full pointer-events-none block ring-0 transition-fast absolute left-0",
          sizeClasses.thumb[size],
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
