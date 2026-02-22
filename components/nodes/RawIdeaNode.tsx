"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import type { RawIdeaNodeData, IntentType } from "@/types/workflow";

const INTENTS: { value: IntentType; label: string; emoji: string }[] = [
    { value: "inspire", label: "Inspire", emoji: "✨" },
    { value: "educate", label: "Educate", emoji: "📚" },
    { value: "entertain", label: "Entertain", emoji: "🎭" },
    { value: "sell", label: "Sell", emoji: "💰" },
];

function RawIdeaNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as RawIdeaNodeData;
    const { setNodes } = useReactFlow();

    const update = useCallback(
        (patch: Partial<RawIdeaNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-64 rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border shadow-lg dark:shadow-black/40 transition-all duration-200 ${selected
                    ? "border-violet-500"
                    : "border-zinc-200 dark:border-white/10"
                }`}
            style={
                selected
                    ? { boxShadow: "0 0 0 1.5px #8b5cf6, 0 0 20px rgba(139,92,246,0.25)" }
                    : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-500/15 to-indigo-500/15 border-b border-zinc-200 dark:border-white/8">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm shrink-0">
                    <Lightbulb className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400 dark:text-violet-400 leading-none">Creative</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5 truncate">Raw Idea</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] shrink-0" />
            </div>

            {/* Body */}
            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>
                {/* Topic tag */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">Topic / Theme</label>
                    <input
                        type="text"
                        defaultValue={nodeData.topic}
                        onChange={(e) => update({ topic: e.target.value })}
                        placeholder="e.g. SaaS Growth, AI Trends…"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium"
                    />
                </div>

                {/* Idea textarea */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">Your Idea</label>
                    <textarea
                        defaultValue={nodeData.ideaText}
                        onChange={(e) => update({ ideaText: e.target.value })}
                        placeholder="Drop your raw idea here — messy is fine. Let the AI polish it…"
                        rows={4}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none leading-relaxed"
                    />
                </div>

                {/* Intent pills */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">Content Intent</label>
                    <div className="grid grid-cols-2 gap-1">
                        {INTENTS.map((intent) => (
                            <button
                                key={intent.value}
                                onClick={() => update({ intent: intent.value })}
                                className={`flex items-center gap-1 text-[10px] font-semibold py-1.5 px-2 rounded-md border transition-all duration-150 cursor-pointer ${nodeData.intent === intent.value
                                        ? "bg-violet-500 border-violet-500 text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                                        : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400 hover:border-violet-500/50"
                                    }`}
                            >
                                <span>{intent.emoji}</span>
                                {intent.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const RawIdeaNode = memo(RawIdeaNodeComponent);
