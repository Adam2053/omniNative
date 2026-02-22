"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { Wand2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IdeaPolisherNodeData, PolishMode, PolishedAngle } from "@/types/workflow";

const MODES: { value: PolishMode; label: string; emoji: string; desc: string }[] = [
    { value: "trendjacking", label: "Trend-jack", emoji: "📈", desc: "Tie idea to current trends" },
    { value: "storytelling", label: "Story", emoji: "📖", desc: "Narrative arc format" },
    { value: "data-backed", label: "Data-backed", emoji: "📊", desc: "Stats & research driven" },
    { value: "controversial", label: "Hot take", emoji: "🔥", desc: "Bold, debate-sparking angle" },
];

// Simulated angle outputs per mode
const SIMULATED_ANGLES: Record<PolishMode, PolishedAngle[]> = {
    trendjacking: [
        { id: "t1", title: "Riding the AI Wave", body: "Everyone's talking about AI replacing jobs — here's why that's backwards thinking…" },
        { id: "t2", title: "The Newsletter Gold Rush", body: "While everyone chases social, savvy creators are building moats with email lists…" },
        { id: "t3", title: "The Indie Hacker Era", body: "The era of the solo founder is here. No VC, no team, just leverage…" },
    ],
    storytelling: [
        { id: "s1", title: "From Zero to One", body: "18 months ago I had 0 followers. Here's the exact framework that changed everything…" },
        { id: "s2", title: "The Turning Point", body: "The day I almost quit is the day everything changed. Here's what happened…" },
        { id: "s3", title: "The Unexpected Lesson", body: "I thought success was about working harder. I was completely wrong…" },
    ],
    "data-backed": [
        { id: "d1", title: "The 10x Stat Nobody Talks About", body: "Creators who post 3x per week get 10x the reach of those posting daily. Thread 🧵" },
        { id: "d2", title: "The Research Says…", body: "New study: 73% of buyers research on LinkedIn before any purchase. Are you showing up?" },
        { id: "d3", title: "By the Numbers", body: "The average viral post has 3 things in common. Here's what the data shows…" },
    ],
    controversial: [
        { id: "c1", title: "Unpopular Opinion", body: "Your content strategy is wrong. Consistency is overrated. Here's what actually moves the needle…" },
        { id: "c2", title: "The Uncomfortable Truth", body: "Most 'growth gurus' haven't grown anything in years. Here's how to spot the fakes…" },
        { id: "c3", title: "Stop Doing This", body: "Threads are killing your brand. Long-form is dead. I said what I said…" },
    ],
};

function IdeaPolisherNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as IdeaPolisherNodeData;
    const { setNodes } = useReactFlow();

    const update = useCallback(
        (patch: Partial<IdeaPolisherNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    const currentMode = nodeData.polishMode ?? "storytelling";
    const isRunning = nodeData.isRunning ?? false;
    const angles = nodeData.angles?.length ? nodeData.angles : [];
    const hasAngles = angles.length > 0;

    const handlePolish = useCallback(() => {
        update({ isRunning: true, angles: [], selectedAngleId: null });
        setTimeout(() => {
            update({
                isRunning: false,
                angles: SIMULATED_ANGLES[currentMode],
            });
        }, 1800);
    }, [currentMode, update]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-72 rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border shadow-lg dark:shadow-black/40 transition-all duration-200 ${selected ? "border-amber-400" : "border-zinc-200 dark:border-white/10"
                }`}
            style={
                selected
                    ? { boxShadow: "0 0 0 1.5px #fbbf24, 0 0 20px rgba(251,191,36,0.25)" }
                    : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-b border-zinc-200 dark:border-white/8">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shrink-0">
                    <Wand2 className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 leading-none">AI Helper</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">Idea Polisher</p>
                </div>
                <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${isRunning ? "bg-amber-400 animate-pulse" : hasAngles ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-400 dark:bg-zinc-600"}`} />
            </div>

            {/* Body */}
            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>
                {/* Mode selector */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">Polish Mode</label>
                    <div className="grid grid-cols-2 gap-1">
                        {MODES.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => update({ polishMode: m.value })}
                                title={m.desc}
                                className={`flex items-center gap-1.5 text-[10px] font-semibold py-1.5 px-2 rounded-md border transition-all duration-150 cursor-pointer ${currentMode === m.value
                                        ? "bg-amber-500 border-amber-500 text-white shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                        : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400 hover:border-amber-400/50"
                                    }`}
                            >
                                <span>{m.emoji}</span>
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Polish button */}
                <button
                    onClick={handlePolish}
                    disabled={isRunning}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${isRunning
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500 cursor-not-allowed"
                            : "bg-amber-500 border-amber-500 text-white hover:bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                        }`}
                >
                    {isRunning ? (
                        <>
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                <Wand2 className="w-3.5 h-3.5" />
                            </motion.span>
                            Polishing your idea…
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-3.5 h-3.5" />
                            Polish Idea
                        </>
                    )}
                </button>

                {/* Output angles */}
                <AnimatePresence>
                    {hasAngles && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1.5 overflow-hidden"
                        >
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block">Choose Your Angle</label>
                            {angles.map((angle) => (
                                <motion.button
                                    key={angle.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => update({ selectedAngleId: angle.id })}
                                    className={`w-full text-left p-2 rounded-lg border transition-all duration-150 cursor-pointer group ${nodeData.selectedAngleId === angle.id
                                            ? "bg-amber-500/10 border-amber-500/50"
                                            : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-white/8 hover:border-amber-400/40"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200 truncate pr-1">{angle.title}</p>
                                        <ChevronRight className={`w-3 h-3 shrink-0 transition-colors ${nodeData.selectedAngleId === angle.id ? "text-amber-500" : "text-zinc-400"}`} />
                                    </div>
                                    <p className="text-[9px] text-zinc-500 dark:text-zinc-500 leading-relaxed line-clamp-2">{angle.body}</p>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Handle type="target" position={Position.Left} id="input" className="!top-1/2 !-translate-y-1/2" />
            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const IdeaPolisherNode = memo(IdeaPolisherNodeComponent);
