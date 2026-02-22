"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { MessageSquarePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CaptionGeneratorNodeData, CaptionStyle, EmojiUsage } from "@/types/workflow";

const STYLES: { value: CaptionStyle; label: string; emoji: string }[] = [
    { value: "hook", label: "Hook", emoji: "🎣" },
    { value: "question", label: "Question", emoji: "❓" },
    { value: "bold", label: "Bold Statement", emoji: "💥" },
    { value: "storytelling", label: "Story", emoji: "📖" },
];

const EMOJI_LEVELS: { value: EmojiUsage; label: string }[] = [
    { value: "none", label: "None" },
    { value: "minimal", label: "Minimal" },
    { value: "heavy", label: "Heavy 🤩" },
];

const HASHTAG_PRESETS = [0, 5, 10, 20, 30];

// Simulated caption outputs
const SIMULATED_CAPTIONS: Record<CaptionStyle, string> = {
    hook: "Stop scrolling. This is the one strategy that 10x'd my content reach overnight — and it's embarrassingly simple. Here's exactly what I did 👇",
    question: "What if I told you that the algorithm isn't the problem? What if YOU are? The real reason your content isn't growing (and how to fix it today).",
    bold: "Cold takes are killing your brand. Be specific. Be bold. Be memorable. The creators winning right now all have one thing in common: they stand for something.",
    storytelling: "12 months ago, I posted to complete silence. No likes. No comments. Just me, talking into the void. Fast forward to today… here's what finally changed.",
};

function CaptionGeneratorNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as CaptionGeneratorNodeData;
    const { setNodes } = useReactFlow();

    const update = useCallback(
        (patch: Partial<CaptionGeneratorNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    const currentStyle = nodeData.captionStyle ?? "hook";
    const emojiUsage = nodeData.emojiUsage ?? "minimal";
    const hashtagCount = nodeData.hashtagCount ?? 5;
    const isRunning = nodeData.isRunning ?? false;
    const generatedCaption = nodeData.generatedCaption ?? "";

    const handleGenerate = useCallback(() => {
        update({ isRunning: true, generatedCaption: "" });
        setTimeout(() => {
            update({
                isRunning: false,
                generatedCaption: SIMULATED_CAPTIONS[currentStyle],
            });
        }, 1600);
    }, [currentStyle, update]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-68 rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border shadow-lg dark:shadow-black/40 transition-all duration-200 ${selected ? "border-sky-400" : "border-zinc-200 dark:border-white/10"
                }`}
            style={
                selected
                    ? { boxShadow: "0 0 0 1.5px #38bdf8, 0 0 20px rgba(56,189,248,0.25)" }
                    : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-sky-500/15 to-cyan-500/15 border-b border-zinc-200 dark:border-white/8">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-sm shrink-0">
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-sky-400 leading-none">AI Helper</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">Caption Generator</p>
                </div>
                <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${isRunning ? "bg-sky-400 animate-pulse" : generatedCaption ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-400 dark:bg-zinc-600"}`} />
            </div>

            {/* Body */}
            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>
                {/* Caption style */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">Caption Style</label>
                    <div className="grid grid-cols-2 gap-1">
                        {STYLES.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => update({ captionStyle: s.value })}
                                className={`flex items-center gap-1 text-[10px] font-semibold py-1.5 px-2 rounded-md border transition-all duration-150 cursor-pointer ${currentStyle === s.value
                                        ? "bg-sky-500 border-sky-500 text-white shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                                        : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400 hover:border-sky-400/50"
                                    }`}
                            >
                                <span>{s.emoji}</span> {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Emoji + Hashtag controls */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">Emojis</label>
                        <div className="flex flex-col gap-1">
                            {EMOJI_LEVELS.map((el) => (
                                <button
                                    key={el.value}
                                    onClick={() => update({ emojiUsage: el.value })}
                                    className={`text-[10px] font-semibold py-1 rounded-md border transition-all cursor-pointer ${emojiUsage === el.value
                                            ? "bg-sky-500 border-sky-500 text-white"
                                            : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400"
                                        }`}
                                >
                                    {el.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">
                            Hashtags <span className="font-bold text-sky-400 dark:text-sky-400">{hashtagCount}</span>
                        </label>
                        <div className="flex flex-col gap-1">
                            {HASHTAG_PRESETS.map((n) => (
                                <button
                                    key={n}
                                    onClick={() => update({ hashtagCount: n })}
                                    className={`text-[10px] font-semibold py-1 rounded-md border transition-all cursor-pointer ${hashtagCount === n
                                            ? "bg-sky-500 border-sky-500 text-white"
                                            : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400"
                                        }`}
                                >
                                    #{n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Generate button */}
                <button
                    onClick={handleGenerate}
                    disabled={isRunning}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${isRunning
                            ? "bg-sky-500/10 border-sky-500/30 text-sky-400 cursor-not-allowed"
                            : "bg-sky-500 border-sky-500 text-white hover:bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                        }`}
                >
                    {isRunning ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><MessageSquarePlus className="w-3.5 h-3.5" /></motion.span> Generating caption…</>
                    ) : (
                        <><MessageSquarePlus className="w-3.5 h-3.5" /> Generate Caption</>
                    )}
                </button>

                {/* Generated caption preview */}
                <AnimatePresence>
                    {generatedCaption && !isRunning && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">Generated Caption</label>
                            <div className="p-2 rounded-lg bg-sky-500/5 border border-sky-500/20">
                                <p className="text-[10px] text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-4">{generatedCaption}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Handle type="target" position={Position.Left} id="input" className="!top-1/2 !-translate-y-1/2" />
            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const CaptionGeneratorNode = memo(CaptionGeneratorNodeComponent);
