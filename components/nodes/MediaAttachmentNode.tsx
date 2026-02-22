"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { ImagePlay, Upload } from "lucide-react";
import { motion } from "framer-motion";
import type { MediaAttachmentNodeData, MediaMood } from "@/types/workflow";

const MOODS: { value: MediaMood; label: string; color: string }[] = [
    { value: "minimal", label: "Minimal", color: "text-zinc-400" },
    { value: "vibrant", label: "Vibrant", color: "text-rose-400" },
    { value: "professional", label: "Pro", color: "text-blue-400" },
    { value: "raw", label: "Raw", color: "text-amber-400" },
];

const MEDIA_ICONS: Record<string, string> = {
    image: "🖼️",
    video: "🎬",
    gif: "🎞️",
    none: "📁",
};

function MediaAttachmentNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as MediaAttachmentNodeData;
    const { setNodes } = useReactFlow();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const update = useCallback(
        (patch: Partial<MediaAttachmentNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    const handleFilePick = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
            const mediaType = ["mp4", "mov", "webm"].includes(ext)
                ? "video"
                : ["gif"].includes(ext)
                    ? "gif"
                    : "image";
            update({ fileName: file.name, mediaType });
        },
        [update]
    );

    const hasFile = nodeData.fileName && nodeData.fileName !== "";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-64 rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border shadow-lg dark:shadow-black/40 transition-all duration-200 ${selected ? "border-rose-400" : "border-zinc-200 dark:border-white/10"
                }`}
            style={
                selected
                    ? { boxShadow: "0 0 0 1.5px #fb7185, 0 0 20px rgba(251,113,133,0.25)" }
                    : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-rose-500/15 to-pink-500/15 border-b border-zinc-200 dark:border-white/8">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm shrink-0">
                    <ImagePlay className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-rose-400 leading-none">Creative</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">Media Attachment</p>
                </div>
                <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${hasFile ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-400 dark:bg-zinc-600"}`} />
            </div>

            {/* Body */}
            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>
                {/* Upload zone */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">Media File</label>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full flex flex-col items-center justify-center gap-1.5 py-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer ${hasFile
                                ? "border-emerald-500/40 bg-emerald-500/5"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-rose-400/60 hover:bg-rose-500/5"
                            }`}
                    >
                        {hasFile ? (
                            <>
                                <span className="text-2xl">{MEDIA_ICONS[nodeData.mediaType ?? "none"]}</span>
                                <span className="text-[10px] font-medium text-emerald-500 max-w-[180px] truncate px-2">{nodeData.fileName}</span>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{nodeData.mediaType}</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Click to attach media</span>
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-600">PNG, JPG, MP4, GIF</span>
                            </>
                        )}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*,video/*,.gif" className="hidden" onChange={handleFilePick} />
                </div>

                {/* Alt text */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">
                        Visual Description <span className="normal-case text-zinc-400">(AI reads this)</span>
                    </label>
                    <textarea
                        defaultValue={nodeData.altText}
                        onChange={(e) => update({ altText: e.target.value })}
                        placeholder="Describe the visual — the AI uses this to generate relevant captions…"
                        rows={3}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-400/50 transition-all resize-none leading-relaxed"
                    />
                </div>

                {/* Mood selector */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">Visual Mood</label>
                    <div className="flex gap-1">
                        {MOODS.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => update({ mood: m.value })}
                                className={`flex-1 text-[10px] font-semibold py-1 rounded-md border transition-all duration-150 cursor-pointer ${nodeData.mood === m.value
                                        ? "bg-rose-500 border-rose-500 text-white shadow-[0_0_8px_rgba(251,113,133,0.4)]"
                                        : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 dark:text-zinc-400 hover:border-rose-400/50"
                                    }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const MediaAttachmentNode = memo(MediaAttachmentNodeComponent);
