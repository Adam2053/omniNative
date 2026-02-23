"use client";

import { memo, useCallback, useState } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { PenLine, Hash } from "lucide-react";
import { motion } from "framer-motion";
import type { PostMakerNodeData, PostType, TargetPlatform } from "@/types/workflow";
import { TargetPlatformPicker } from "./TargetPlatformPicker";

const POST_TYPES: { value: PostType; label: string }[] = [
    { value: "text", label: "Text" },
    { value: "text+media", label: "Text + Media" },
    { value: "carousel", label: "Carousel" },
];

const MAX_CHARS = 2200;

function PostMakerNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as PostMakerNodeData;
    const { setNodes } = useReactFlow();
    const [charCount, setCharCount] = useState(nodeData.postText?.length ?? 0);

    const update = useCallback(
        (patch: Partial<PostMakerNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    const isOverLimit = charCount > MAX_CHARS;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-68 rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border shadow-lg dark:shadow-black/40 transition-all duration-200 ${selected ? "border-emerald-500" : "border-zinc-200 dark:border-white/10"
                }`}
            style={
                selected
                    ? { boxShadow: "0 0 0 1.5px #10b981, 0 0 20px rgba(16,185,129,0.25)" }
                    : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-b border-zinc-200 dark:border-white/8">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shrink-0">
                    <PenLine className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500 leading-none">Creative</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">Post Maker</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] shrink-0" />
            </div>

            {/* Body */}
            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>
                {/* Post type selector */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">Post Format</label>
                    <div className="flex gap-1">
                        {POST_TYPES.map((pt) => (
                            <button
                                key={pt.value}
                                onClick={() => update({ postType: pt.value })}
                                className={`flex-1 text-[10px] font-semibold py-1 rounded-md border transition-all duration-150 cursor-pointer ${nodeData.postType === pt.value
                                    ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                    : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400 hover:border-emerald-500/50"
                                    }`}
                            >
                                {pt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Post content */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">Post Content</label>
                        <span className={`text-[10px] font-mono font-bold tabular-nums ${isOverLimit ? "text-rose-500" : "text-zinc-400 dark:text-zinc-600"}`}>
                            {charCount} / {MAX_CHARS}
                        </span>
                    </div>
                    <textarea
                        defaultValue={nodeData.postText}
                        onChange={(e) => {
                            setCharCount(e.target.value.length);
                            update({ postText: e.target.value });
                        }}
                        placeholder="Write or paste your post content here…"
                        rows={4}
                        className={`w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border ${isOverLimit ? "border-rose-500/60" : "border-zinc-200 dark:border-white/8"
                            } text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none leading-relaxed`}
                    />
                </div>

                {/* Hashtags & CTA row */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mb-1">
                            <Hash className="w-3 h-3" /> Hashtags
                        </label>
                        <input
                            type="text"
                            defaultValue={nodeData.hashtags}
                            onChange={(e) => update({ hashtags: e.target.value })}
                            placeholder="#saas, #ai"
                            className="w-full text-[10px] px-2 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">CTA</label>
                        <input
                            type="text"
                            defaultValue={nodeData.cta}
                            onChange={(e) => update({ cta: e.target.value })}
                            placeholder="Link in bio…"
                            className="w-full text-[10px] px-2 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Target platform */}
                <TargetPlatformPicker
                    value={nodeData.targetPlatform ?? "both"}
                    onChange={(v: TargetPlatform) => update({ targetPlatform: v })}
                    accentColor="emerald"
                />
            </div>

            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const PostMakerNode = memo(PostMakerNodeComponent);
