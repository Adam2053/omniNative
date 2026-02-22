"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Loader2, Workflow, Zap, Grid3X3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TopBarProps {
    workflowName: string;
    onWorkflowNameChange: (name: string) => void;
    onRun: () => void;
    isRunning: boolean;
    snapToGrid: boolean;
    onSnapToggle: () => void;
}

export function TopBar({
    workflowName,
    onWorkflowNameChange,
    onRun,
    isRunning,
    snapToGrid,
    onSnapToggle,
}: TopBarProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header
            className="
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-4 h-14
        bg-white/80 dark:bg-zinc-950/80
        backdrop-blur-xl
        border-b border-zinc-200 dark:border-white/8
        shadow-sm
      "
        >
            {/* Left — Brand + Workflow Name */}
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--omni)] to-purple-600 shadow-[0_0_12px_var(--omni-glow)]">
                    <Workflow className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm tracking-tight hidden sm:block">
                    <span className="text-zinc-800 dark:text-zinc-100">Omni</span>
                    <span className="text-[var(--omni)]">Native</span>
                </span>

                <div className="w-px h-5 bg-zinc-200 dark:bg-white/10 mx-1 hidden sm:block" />

                <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => onWorkflowNameChange(e.target.value)}
                    id="workflow-name-input"
                    className="
            text-sm font-medium
            bg-transparent
            text-zinc-700 dark:text-zinc-200
            border-none outline-none
            placeholder:text-zinc-400
            min-w-0 w-44
            focus:ring-0
          "
                    placeholder="Untitled Workflow"
                />
            </div>

            {/* Center — Running pill */}
            <AnimatePresence>
                {isRunning && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--omni)]/10 border border-[var(--omni)]/30 text-[var(--omni)] text-xs font-semibold"
                    >
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-[var(--omni)]"
                        />
                        Workflow Running…
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Right — Controls */}
            <div className="flex items-center gap-2">

                {/* Snap to Grid Toggle */}
                {mounted && (
                    <button
                        onClick={onSnapToggle}
                        id="snap-grid-btn"
                        aria-label="Toggle snap to grid"
                        title={snapToGrid ? "Snap to grid: ON" : "Snap to grid: OFF"}
                        className={`
              flex items-center justify-center w-8 h-8 rounded-lg
              border transition-all duration-150 cursor-pointer
              ${snapToGrid
                                ? "bg-[var(--omni)]/15 border-[var(--omni)]/50 text-[var(--omni)] shadow-[0_0_8px_var(--omni-glow)]"
                                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300"
                            }
            `}
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                )}

                {/* Theme Toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        id="theme-toggle-btn"
                        aria-label="Toggle theme"
                        className="
              flex items-center justify-center w-8 h-8 rounded-lg
              bg-zinc-100 dark:bg-zinc-800
              border border-zinc-200 dark:border-white/10
              text-zinc-500 dark:text-zinc-400
              hover:bg-zinc-200 dark:hover:bg-zinc-700
              hover:text-zinc-700 dark:hover:text-zinc-200
              transition-all duration-150
              cursor-pointer
            "
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {theme === "dark" ? (
                                <motion.span key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                                    <Sun className="w-4 h-4" />
                                </motion.span>
                            ) : (
                                <motion.span key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                                    <Moon className="w-4 h-4" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                )}

                {/* Run Workflow Button */}
                <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}>
                    <Button
                        id="run-workflow-btn"
                        onClick={onRun}
                        disabled={isRunning}
                        className={`
              relative flex items-center gap-2
              px-4 h-9 rounded-lg text-sm font-semibold
              bg-[var(--omni)] hover:bg-[var(--omni)]/90
              text-white border-none
              shadow-[0_0_16px_var(--omni-glow)]
              hover:shadow-[0_0_24px_var(--omni-glow)]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-200
              ${!isRunning ? "omni-pulse" : ""}
            `}
                    >
                        {isRunning ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Running…</span></>
                        ) : (
                            <><Zap className="w-3.5 h-3.5" /><span>Run Workflow</span></>
                        )}
                    </Button>
                </motion.div>
            </div>
        </header>
    );
}
