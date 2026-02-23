import {
  Delete02Icon,
  Flag02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Solve } from "@/types/puzzles";

interface SolveActionsProps {
  currentSolve: Solve | undefined;
  isVisible: boolean;
  onPlusTwo: () => void;
  onDNF: () => void;
  onDelete: () => void;
}

export function SolveActions({
  currentSolve,
  isVisible,
  onPlusTwo,
  onDNF,
  onDelete,
}: SolveActionsProps) {
  return (
    <div className="pointer-events-auto flex items-center justify-center gap-4 py-4">
      <AnimatePresence mode="popLayout">
        {isVisible && currentSolve && (
          <>
            <motion.div
              key="flag"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Button className="group/button rounded-full" onClick={onPlusTwo}>
                <HugeiconsIcon
                  className="group-hover/button:scale-95 group-hover/button:rotate-12"
                  icon={Flag02Icon}
                />
              </Button>
            </motion.div>

            <motion.div
              key="unavailable"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
                delay: 0.05,
              }}
            >
              <Button
                className="group/button rounded-full"
                variant={currentSolve.penalty === "DNF" ? "danger" : "default"}
                onClick={onDNF}
              >
                <HugeiconsIcon
                  className="group-hover/button:scale-95 group-hover/button:rotate-180"
                  icon={UnavailableIcon}
                />
              </Button>
            </motion.div>

            <motion.div
              key="delete"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
                delay: 0.1,
              }}
            >
              <Button
                variant="danger"
                className="group/button rounded-full"
                onClick={onDelete}
              >
                <HugeiconsIcon
                  className="group-hover/button:scale-95 group-hover/button:rotate-180"
                  icon={Delete02Icon}
                />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
