"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends SliderPrimitive.Root.Props {
  marks?: { value: number; label: string }[];
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  marks,
  ...props
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const _values = useMemo(
    () =>
      Array.isArray(value) ? value
      : Array.isArray(defaultValue) ? defaultValue
      : [min, max],
    [value, defaultValue, min, max],
  );

  const getMarkPosition = (markValue: number) => {
    const position = (markValue - min) / (max - min);
    const offset = position * 16;

    return `calc(${position * 100}% - ${offset}px)`;
  };

  return (
    <div className="w-full">
      <SliderPrimitive.Root
        className={cn(
          "data-horizontal:w-full data-vertical:h-full cursor-pointer",
          className,
        )}
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        thumbAlignment="edge"
        {...props}
      >
        <SliderPrimitive.Control className="data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col">
          <SliderPrimitive.Track
            ref={trackRef}
            data-slot="slider-track"
            className="bg-input rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 relative grow overflow-hidden select-none"
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="size-4 bg-accent select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            />
          </SliderPrimitive.Track>
          {Array.from({ length: _values.length }, () => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={crypto.randomUUID()}
              className="border-none relative size-3.5 rounded-full bg-accent transition-fast transition-[color,box-shadow] ring-accent/50 after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-none active:ring-3 block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
      {marks && (
        <div className="relative mt-3 h-6 w-full">
          {marks.map((mark) => {
            return (
              <span
                key={mark.value}
                className="absolute top-0 flex flex-col items-center gap-1 text-xs text-muted-foreground"
                style={{
                  left: getMarkPosition(mark.value),
                  transform: `translateX(calc(-50% + 8px))`,
                }}
              >
                <span className="block h-1 w-px bg-border" />
                {mark.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { Slider };
