"use client";

/**
 * TargetPlatformPicker — compact 3-pill selector used across content nodes.
 * Shows: [ Both ] [ Instagram ] [ X / Twitter ]
 */

import type { TargetPlatform } from "@/types/workflow";

const OPTIONS: { value: TargetPlatform; label: string; emoji: string }[] = [
    { value: "both", label: "Both", emoji: "🌐" },
    { value: "instagram", label: "Instagram", emoji: "📸" },
    { value: "x", label: "X / Twitter", emoji: "𝕏" },
];

interface Props {
    value: TargetPlatform;
    onChange: (v: TargetPlatform) => void;
    accentColor?: string; // tailwind color class prefix, default violet
}

export function TargetPlatformPicker({ value, onChange, accentColor = "violet" }: Props) {
    return (
        <div>
            <label className="text-[9px] uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-600 block mb-1">
                🎯 Target
            </label>
            <div className="flex gap-1">
                {OPTIONS.map((opt) => {
                    const active = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className={`
                flex-1 text-[9px] font-bold py-1 px-1.5 rounded-md border transition-all duration-150 cursor-pointer
                ${active
                                    ? `bg-${accentColor}-500 border-${accentColor}-500 text-white shadow-sm`
                                    : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                                }
              `}
                        >
                            {opt.emoji} {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
