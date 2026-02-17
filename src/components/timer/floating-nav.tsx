import {
  Add01Icon,
  ArrowDown01Icon,
  Chart01Icon,
  CheckmarkCircle02Icon,
  GitForkIcon,
  LeftToRightListDashIcon,
  RotateClockwiseIcon,
  Settings02Icon,
  SlidersHorizontalIcon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { PuzzleIcon } from "@/components/puzzle/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScramble } from "@/contexts/scramble";
import { usePuzzles } from "@/hooks/use-puzzles";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/solves", label: "Solves", icon: LeftToRightListDashIcon },
  { href: "/trainer", label: "Trainer", icon: GitForkIcon },
  { href: "/", label: "Timer", icon: Timer02Icon },
  { href: "/statistics", label: "Statistics", icon: Chart01Icon },
  {
    href: "/configuration",
    label: "Configuration",
    icon: SlidersHorizontalIcon,
  },
] as const;

export function FloatingNav() {
  const matchRoute = useMatchRoute();

  const { generateNewScramble } = useScramble();

  return (
    <>
      <div className="fixed left-6 top-6 z-50">
        <PuzzleSelector />
      </div>
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full border bg-secondary/50 p-1.5 shadow-lg backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = !!matchRoute({ to: item.href, fuzzy: false });
            return (
              <NavItem
                key={item.href}
                to={item.href}
                isActive={isActive}
                icon={item.icon}
              />
            );
          })}
        </div>
      </nav>
      <div className="fixed right-6 top-6 z-50 flex flex-row-reverse gap-2 ">
        <Link
          to="/settings"
          className={cn(
            "flex items-center justify-center gap-1 rounded-full border bg-secondary/50 p-3 shadow-lg backdrop-blur-md",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <HugeiconsIcon icon={Settings02Icon} className="size-5" />
        </Link>
        <button
          type="button"
          onClick={() => generateNewScramble()}
          className={cn(
            "cursor-pointer flex items-center justify-center gap-1 rounded-full border bg-secondary/50 p-3 shadow-lg backdrop-blur-md",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <HugeiconsIcon icon={RotateClockwiseIcon} className="size-5" />
        </button>
      </div>
    </>
  );
}

function NavItem({
  to,
  isActive,
  icon,
}: {
  to: string;
  isActive: boolean;
  icon: ComponentProps<typeof HugeiconsIcon>["icon"];
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center justify-center gap-1 rounded-full p-3",
        isActive ?
          "bg-accent/10 text-accent"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      <HugeiconsIcon icon={icon} className="size-5" />
    </Link>
  );
}

function PuzzleSelector() {
  const { currentPuzzle, puzzleList, switchPuzzle } = usePuzzles();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="lg"
            variant="transparent"
            className="rounded-full border bg-secondary/50 shadow-lg backdrop-blur-md text-secondary-foreground hover:bg-muted/50 hover:text-foreground"
          />
        }
      >
        <PuzzleIcon puzzleType={currentPuzzle.type} size={20} />
        <span className="font-semibold">{currentPuzzle.name}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="max-h-[300px] overflow-y-auto p-1">
          {puzzleList.map((puzzle) => (
            <DropdownMenuItem
              key={puzzle.id}
              onClick={() => switchPuzzle(puzzle.id)}
              className="justify-between"
            >
              <div className="flex items-center gap-2">
                <PuzzleIcon puzzleType={puzzle.type} size={16} />
                <span>{puzzle.name}</span>
              </div>
              {puzzle.id === currentPuzzle.id && (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="size-4 text-primary"
                />
              )}
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link to="/puzzles/new" />}>
          <HugeiconsIcon icon={Add01Icon} />
          Create New Puzzle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
