import {
	Add01Icon,
	ArrowDown01Icon,
	Chart01Icon,
	GitForkIcon,
	LeftToRightListDashIcon,
	RotateClockwiseIcon,
	Settings02Icon,
	SlidersHorizontalIcon,
	Tick02Icon,
	Timer02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
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
import { LinkButton } from "@/components/ui/link-button";
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
	const isHome = !!matchRoute({ to: "/", fuzzy: false });

	const { generateNewScramble } = useScramble();

	return (
		<>
			<AnimatePresence>
				{isHome && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
						className="fixed left-6 top-6 z-50"
					>
						<PuzzleSelector />
					</motion.div>
				)}
			</AnimatePresence>
			<nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="relative"
				>
					<motion.div
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
						className="z-1 absolute translate-x-1/2 left-0 top-0 w-1/2 h-px bg-linear-to-r from-transparent via-muted-foreground/50 to-transparent"
					/>
					<motion.div
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
						className="z-1 absolute translate-x-1/2 left-0 bottom-0 w-1/2 h-px bg-linear-to-r from-transparent via-muted-foreground/50 to-transparent"
					/>
					<div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary p-1.5 shadow-lg">
						{NAV_ITEMS.map((item, index) => {
							const isActive = !!matchRoute({ to: item.href, fuzzy: false });
							return (
								<motion.div
									key={item.href}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
								>
									<NavItem
										to={item.href}
										isActive={isActive}
										icon={item.icon}
									/>
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			</nav>
			<AnimatePresence>
				{isHome && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.2 }}
						className="fixed right-6 top-6 z-50 flex flex-row-reverse gap-2"
					>
						<LinkButton
							size="icon-lg"
							to="/settings"
							className={cn(
								"group/button rounded-full",
								"text-muted-foreground hover:text-foreground hover:bg-muted/50"
							)}
						>
							<HugeiconsIcon
								icon={Settings02Icon}
								className="size-5 group-hover/button:-rotate-180 group-active/button:scale-0.9 duration-200 ease-spring"
							/>
						</LinkButton>
						<Button
							size="icon-lg"
							onClick={() => generateNewScramble()}
							className={cn(
								"group/button rounded-full",
								"text-muted-foreground hover:text-foreground hover:bg-muted/50"
							)}
						>
							<HugeiconsIcon
								icon={RotateClockwiseIcon}
								className="size-5 group-hover/button:-rotate-180 duration-200 ease-spring"
							/>
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
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
			className="group/nav-item hover:bg-muted hover:text-secondary-foreground relative flex items-center justify-center rounded-full p-3"
		>
			<AnimatePresence>
				{isActive && (
					<motion.div
						layoutId="activeNav"
						className="absolute inset-0 rounded-full bg-accent/10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
					/>
				)}
			</AnimatePresence>
			<HugeiconsIcon
				icon={icon}
				className={cn(
					"size-5 duration-200 ease-spring",
					"group-hover/nav-item:scale-110 group-active/nav-item:scale-95",
					isActive ? "text-accent" : "text-muted-foreground"
				)}
			/>
		</Link>
	);
}

function PuzzleSelector() {
	const { currentPuzzle, puzzleList, switchPuzzle } = usePuzzles();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				size="lg"
				className="rounded-full text-secondary-foreground hover:text-foreground"
			>
				<PuzzleIcon puzzleType={currentPuzzle.type} size={20} />
				<span className="font-semibold">{currentPuzzle.name}</span>
				<HugeiconsIcon
					icon={ArrowDown01Icon}
					className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-56">
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
								icon={Tick02Icon}
								className="size-4.5 text-accent"
							/>
						)}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem render={<Link to="/puzzles/new" />}>
					<HugeiconsIcon icon={Add01Icon} />
					Create New Puzzle
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
