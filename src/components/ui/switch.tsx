import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sizeClasses = {
  root: {
    sm: "h-[18px] w-[30px]",
    default: "h-[24px] w-[41px]",
  },
  thumb: {
    sm: {
      unchecked: 2,
      checked: 14,
    },
    default: {
      unchecked: 2,
      checked: 19,
    },
  },
};

interface SwitchProps extends SwitchPrimitive.Root.Props {
  size?: "sm" | "default";
}

function Switch({
  className,
  size = "default",
  checked,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer group/switch relative inline-flex items-center shrink-0",
        "data-checked:bg-accent data-unchecked:bg-inset",
        "rounded-full border-none outline-none",
        "transition-all duration-200 ease-in-out",
        "focus-ring focus-visible:ring-foreground/50",
        "inset-shadow-sm cursor-pointer",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        sizeClasses.root[size],
        className,
      )}
      checked={checked}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb">
        <motion.span
          className={cn(
            "bg-white rounded-full pointer-events-none block ring-0 shadow-xs absolute left-0 top-1/2 -translate-y-1/2",
            size === "sm" ? "size-3.5" : "size-5",
          )}
          initial={false}
          animate={{
            x: checked
              ? sizeClasses.thumb[size].checked
              : sizeClasses.thumb[size].unchecked,
          }}
          transition={{
            type: "spring",
            stiffness: 600,
            damping: 30,
          }}
          layout
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
