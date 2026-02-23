"use client";

import { memo, useCallback } from "react";
import {
    Handle,
    Position,
    type NodeProps,
    type IsValidConnection,
    useReactFlow,
    useEdges,
} from "@xyflow/react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { RawIdeaNodeData, IntentType } from "@/types/workflow";

/* ── Intent options ──────────────────────────── */
const INTENTS: { value: IntentType; label: string; emoji: string }[] = [
    { value: "inspire", label: "Inspire", emoji: "✨" },
    { value: "educate", label: "Educate", emoji: "📚" },
    { value: "entertain", label: "Entertain", emoji: "🎭" },
    { value: "sell", label: "Sell", emoji: "💰" },
];

/* ── RawIdeaNodeComponent ───────────────────── */
function RawIdeaNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as RawIdeaNodeData;
    const { setNodes, getNodes } = useReactFlow();
    const edges = useEdges();

    const update = useCallback(
        (patch: Partial<RawIdeaNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    /* ── Connection rules ── only allowed to ideaPolisher */
    const isValidConnection: IsValidConnection = useCallback(
        (connection) => {
            const targetNode = getNodes().find((n) => n.id === connection.target);
            return targetNode?.type === "ideaPolisher";
        },
        [getNodes]
    );

    /* ── Status computation ────────────────────
       Connected = at least one outgoing edge whose target is an ideaPolisher node
       Filled    = topic, ideaText, and intent all non-empty
    ──────────────────────────────────────────── */
    const connectedToPolisher = edges.some((e) => {
        if (e.source !== id) return false;
        const target = getNodes().find((n) => n.id === e.target);
        return target?.type === "ideaPolisher";
    });

    const allFilled = !!(
        nodeData.topic?.trim() &&
        nodeData.ideaText?.trim() &&
        nodeData.intent
    );

    /* ── Status dot ── */
    const dot = (() => {
        if (connectedToPolisher && allFilled)
            return { bg: "bg-emerald-400", shadow: "shadow-[0_0_8px_#34d399,0_0_16px_rgba(52,211,153,0.3)]" };
        if (connectedToPolisher && !allFilled)
            return { bg: "bg-rose-400", shadow: "shadow-[0_0_8px_#f87171,0_0_14px_rgba(248,113,113,0.3)]" };
        return { bg: "bg-zinc-400 dark:bg-zinc-600", shadow: "" };
    })();

    /* ── Border & selection ── */
    const borderClass = selected
        ? "border-violet-400"
        : connectedToPolisher && allFilled
            ? "border-emerald-500/40"
            : connectedToPolisher && !allFilled
                ? "border-rose-500/30"
                : "border-zinc-200 dark:border-white/10";

    const boxShadow = selected
        ? "0 0 0 1.5px #a78bfa, 0 0 20px rgba(167,139,250,0.2)"
        : undefined;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-72 rounded-xl overflow-visible bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border shadow-lg dark:shadow-black/40 transition-all duration-300 ${borderClass}`}
            style={boxShadow ? { boxShadow } : undefined}
        >
            {/* ── Header ── */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-500/15 to-indigo-500/15 border-b border-zinc-200 dark:border-white/8 rounded-t-xl">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm shrink-0">
                    <Lightbulb className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-500 leading-none">Creative</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">Raw Idea</p>
                </div>
                {/* Status dot — top right */}
                <motion.div
                    animate={{
                        scale: connectedToPolisher ? [1, 1.15, 1] : 1,
                    }}
                    transition={{ duration: 1.4, repeat: connectedToPolisher ? Infinity : 0, ease: "easeInOut" }}
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-500 ${dot.bg} ${dot.shadow}`}
                />
            </div>

            {/* ── Body ── */}
            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>

                {/* 1. Topic / Theme */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">
                        Topic / Theme
                    </label>
                    <input
                        type="text"
                        defaultValue={nodeData.topic}
                        onChange={(e) => update({ topic: e.target.value })}
                        placeholder="e.g. SaaS growth, Personal branding…"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                    />
                </div>

                {/* 2. Your Idea */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">
                        Your Idea
                    </label>
                    <textarea
                        defaultValue={nodeData.ideaText}
                        onChange={(e) => update({ ideaText: e.target.value })}
                        placeholder="Write your raw idea here — what do you want to post about?"
                        rows={4}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none leading-relaxed"
                    />
                </div>

                {/* 3. Content Intent */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">
                        Content Intent
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                        {INTENTS.map((intent) => (
                            <button
                                key={intent.value}
                                onClick={() => update({ intent: intent.value })}
                                className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-all duration-150 cursor-pointer ${nodeData.intent === intent.value
                                    ? "bg-violet-500 border-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.45)]"
                                    : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400 hover:border-violet-400/60 hover:text-violet-500"
                                    }`}
                            >
                                <span className="text-base leading-none">{intent.emoji}</span>
                                {intent.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Bottom instruction / status hint ── */}
                <motion.div
                    animate={connectedToPolisher && allFilled ? { opacity: 1 } : { opacity: 0.85 }}
                    className={`flex items-start gap-2 px-2.5 py-2 rounded-lg border transition-all duration-300 ${connectedToPolisher && allFilled
                        ? "bg-emerald-500/8 border-emerald-500/25"
                        : connectedToPolisher && !allFilled
                            ? "bg-rose-500/8 border-rose-500/20"
                            : "bg-violet-500/6 border-violet-400/20"
                        }`}
                >
                    <ArrowRight className={`w-3 h-3 mt-0.5 shrink-0 ${connectedToPolisher && allFilled
                        ? "text-emerald-500"
                        : connectedToPolisher && !allFilled
                            ? "text-rose-400"
                            : "text-violet-400"
                        }`} />
                    <p className={`text-[10px] font-medium leading-snug ${connectedToPolisher && allFilled
                        ? "text-emerald-600 dark:text-emerald-400"
                        : connectedToPolisher && !allFilled
                            ? "text-rose-500 dark:text-rose-400"
                            : "text-violet-500 dark:text-violet-400"
                        }`}>
                        {connectedToPolisher && allFilled
                            ? "Connected to Idea Polisher — ready to polish ✓"
                            : connectedToPolisher && !allFilled
                                ? "Fill in all fields above to activate this node"
                                : "Connect to an Idea Polisher node to polish this idea"}
                    </p>
                </motion.div>
            </div>

            {/* ── Output handle only — NO input/left handle ── */}
            <Handle
                type="source"
                position={Position.Right}
                id="output"
                isValidConnection={isValidConnection}
                className="!top-1/2 !-translate-y-1/2"
            />
        </motion.div>
    );
}

export const RawIdeaNode = memo(RawIdeaNodeComponent);
