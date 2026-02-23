"use client";

import { memo, useCallback, useState } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { FileText, RefreshCw, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type {
    GeneratePostNodeData,
    GeneratePostPlatform,
    IGPostType,
    IGAspectRatio,
} from "@/types/workflow";
import { PLATFORM_LIMITS } from "@/types/workflow";

/* ── Platform SVG Logos ──────────────────────── */
const XLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const IgLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);
const GeneralLogo = () => <FileText className="w-4 h-4" />;
const LiLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);
const FbLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const RdLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <path fill="white" d="M16.67 12a1.3 1.3 0 0 0-1.3 1.3c0 .17.03.34.09.5A5.6 5.6 0 0 1 12 14.7a5.6 5.6 0 0 1-3.46-.9.97.97 0 0 0 .09-.5A1.3 1.3 0 0 0 7.33 12a1.3 1.3 0 0 0 0 2.6c.28 0 .54-.09.75-.24A6.6 6.6 0 0 0 12 15.7a6.6 6.6 0 0 0 3.92-1.34c.21.15.47.24.75.24a1.3 1.3 0 0 0 0-2.6zM20 12a2 2 0 0 0-2-2 2 2 0 0 0-1.38.55A8.07 8.07 0 0 0 12.5 9.1l.76-2.4 2.1.47a1.2 1.2 0 1 0 .13-.62l-2.4-.53a.3.3 0 0 0-.35.2l-.87 2.74A8.09 8.09 0 0 0 7.4 10.55 2 2 0 0 0 4 12a2 2 0 0 0 1.04 1.74 3.4 3.4 0 0 0-.04.46c0 2.33 2.69 4.2 6 4.2s6-1.87 6-4.2a3.4 3.4 0 0 0-.04-.46A2 2 0 0 0 20 12zm-8.5 2a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm2 1.5c-.4.4-1 .6-1.5.6s-1.1-.2-1.5-.6a.2.2 0 0 1 .28-.28c.33.33.77.48 1.22.48s.89-.15 1.22-.48a.2.2 0 0 1 .28.28zm.5-1.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
    </svg>
);

/* ── Platform config ─────────────────────────── */
const PLATFORM_CFG: Record<
    GeneratePostPlatform,
    { label: string; gradient: string; logo: React.ReactNode; charLimit: number }
> = {
    instagram: {
        label: "Instagram Post",
        gradient: "from-fuchsia-500 via-rose-500 to-amber-500",
        logo: <IgLogo />,
        charLimit: PLATFORM_LIMITS.instagram.caption,
    },
    x: {
        label: "X / Twitter Post",
        gradient: "from-zinc-800 to-zinc-900",
        logo: <XLogo />,
        charLimit: PLATFORM_LIMITS.x.caption,
    },
    general: {
        label: "General Post",
        gradient: "from-slate-500 to-zinc-700",
        logo: <GeneralLogo />,
        charLimit: 5000,
    },
    linkedin: {
        label: "LinkedIn Post",
        gradient: "from-blue-600 to-blue-700",
        logo: <LiLogo />,
        charLimit: PLATFORM_LIMITS.linkedin.caption,
    },
    facebook: {
        label: "Facebook Post",
        gradient: "from-blue-500 to-indigo-600",
        logo: <FbLogo />,
        charLimit: PLATFORM_LIMITS.facebook.caption,
    },
    reddit: {
        label: "Reddit Post",
        gradient: "from-orange-500 to-red-600",
        logo: <RdLogo />,
        charLimit: PLATFORM_LIMITS.reddit.caption,
    },
};

const IG_POST_TYPES: { value: IGPostType; label: string; emoji: string }[] = [
    { value: "feed", label: "Feed", emoji: "🖼" },
    { value: "reel", label: "Reel", emoji: "🎬" },
    { value: "story", label: "Story", emoji: "⭕" },
    { value: "carousel", label: "Carousel", emoji: "🔄" },
];

const IG_RATIOS: { value: IGAspectRatio; label: string }[] = [
    { value: "1:1", label: "1:1 Square" },
    { value: "4:5", label: "4:5 Portrait" },
    { value: "9:16", label: "9:16 Vertical" },
    { value: "1.91:1", label: "1.91:1 Landscape" },
];

/* ── Platform Picker Popup ───────────────────── */
function PlatformPickerPopup({
    onSelect,
    onClose,
}: {
    onSelect: (p: GeneratePostPlatform) => void;
    onClose: () => void;
}) {
    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="
          absolute top-full left-0 mt-2 z-50 w-full
          bg-white dark:bg-zinc-900
          rounded-xl border border-zinc-200 dark:border-white/12
          shadow-2xl dark:shadow-black/60
          overflow-hidden
        "
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="p-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 px-2 py-1">
                        Choose post type
                    </p>
                    {(["instagram", "x", "linkedin", "facebook", "reddit", "general"] as GeneratePostPlatform[]).map((p) => {
                        const cfg = PLATFORM_CFG[p];
                        const desc =
                            p === "instagram" ? "2,200 chars · 30 hashtags" :
                                p === "x" ? "280 chars · thread support" :
                                    p === "linkedin" ? "3,000 chars · professional" :
                                        p === "facebook" ? "Community post format" :
                                            p === "reddit" ? "Markdown · 40k chars" :
                                                "No platform constraints";
                        return (
                            <button
                                key={p}
                                onClick={() => { onSelect(p); onClose(); }}
                                className="
                  w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg
                  hover:bg-zinc-50 dark:hover:bg-zinc-800/70
                  transition-all duration-100 cursor-pointer text-left group
                "
                            >
                                <span className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} text-white shrink-0 shadow-sm`}>
                                    {cfg.logo}
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{cfg.label}</p>
                                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500">{desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </>
    );
}

/* ── Char counter pill ───────────────────────── */
function CharCounter({ current, max }: { current: number; max: number }) {
    const pct = current / max;
    const color =
        pct > 0.95 ? "text-rose-500 bg-rose-500/10 border-rose-500/30" :
            pct > 0.8 ? "text-amber-500 bg-amber-500/10 border-amber-500/30" :
                "text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8";

    return (
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${color} tabular-nums`}>
            {current}/{max}
        </span>
    );
}

/* ── GeneratePostNode ────────────────────────── */
function GeneratePostNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as GeneratePostNodeData;
    const { setNodes } = useReactFlow();
    const [pickerOpen, setPickerOpen] = useState(nodeData.pendingPlatform ?? false);

    const platform = nodeData.platform;
    const cfg = platform ? PLATFORM_CFG[platform] : null;

    const update = useCallback(
        (patch: Partial<GeneratePostNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    const selectPlatform = useCallback(
        (p: GeneratePostPlatform) => {
            update({
                platform: p,
                pendingPlatform: false,
                label: PLATFORM_CFG[p].label,
            });
        },
        [update]
    );

    /* ── Simulate post generation ─── */
    const handleGenerate = useCallback(() => {
        if (!platform) return;
        update({ status: "ready", generatedPost: "✅ Post formatted and ready — connect to your platform output." });
    }, [platform, update]);

    /* ── Instagram body ──────────────────────────────────── */
    const InstagramBody = () => {
        const charCount = (nodeData.igCaption ?? "").length;
        const hashCount = (nodeData.igHashtags ?? "").split(",").filter(Boolean).length;

        return (
            <div className="space-y-2.5">
                {/* Caption */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">Caption</label>
                        <CharCounter current={charCount} max={PLATFORM_LIMITS.instagram.caption} />
                    </div>
                    <textarea
                        value={nodeData.igCaption ?? ""}
                        onChange={(e) => {
                            if (e.target.value.length <= PLATFORM_LIMITS.instagram.caption)
                                update({ igCaption: e.target.value });
                        }}
                        placeholder="Write your Instagram caption here… Hook first, story after."
                        rows={4}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all resize-none leading-relaxed"
                    />
                </div>

                {/* Hashtags */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">Hashtags</label>
                        <span className={`text-[9px] font-bold ${hashCount > 30 ? "text-rose-500" : "text-zinc-400"}`}>
                            {hashCount}/30
                        </span>
                    </div>
                    <input
                        type="text"
                        value={nodeData.igHashtags ?? ""}
                        onChange={(e) => update({ igHashtags: e.target.value })}
                        placeholder="#contentcreator, #growth, #socialmedia…"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
                    />
                    {hashCount > 30 && (
                        <p className="text-[9px] text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> Instagram allows max 30 hashtags
                        </p>
                    )}
                </div>

                {/* Post type pills */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">Post Type</label>
                    <div className="grid grid-cols-4 gap-1">
                        {IG_POST_TYPES.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => update({ igPostType: t.value })}
                                className={`text-[9px] font-bold py-1 rounded-md border transition-all cursor-pointer ${nodeData.igPostType === t.value
                                    ? "bg-fuchsia-500 border-fuchsia-500 text-white"
                                    : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 hover:border-fuchsia-500/40"
                                    }`}
                            >
                                {t.emoji} {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Aspect ratio */}
                {(nodeData.igPostType === "feed" || nodeData.igPostType === "carousel") && (
                    <div>
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1">Aspect Ratio</label>
                        <div className="grid grid-cols-2 gap-1">
                            {IG_RATIOS.map((r) => (
                                <button
                                    key={r.value}
                                    onClick={() => update({ igAspectRatio: r.value })}
                                    className={`text-[9px] font-semibold py-1 rounded-md border transition-all cursor-pointer ${nodeData.igAspectRatio === r.value
                                        ? "bg-fuchsia-500/15 border-fuchsia-500/60 text-fuchsia-600 dark:text-fuchsia-400"
                                        : "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 hover:border-fuchsia-500/30"
                                        }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    /* ── Twitter body ────────────────────────────────────── */
    const TwitterBody = () => {
        const text = nodeData.xTweetText ?? "";
        const charCount = text.length;
        const isOver = charCount > 280;

        return (
            <div className="space-y-2.5">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">Tweet</label>
                        <CharCounter current={charCount} max={280} />
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => update({ xTweetText: e.target.value })}
                        placeholder="Your tweet… keeps it punchy. Under 280 characters lands best."
                        rows={4}
                        className={`w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition-all resize-none leading-relaxed ${isOver
                            ? "border-rose-400 focus:ring-rose-500/50"
                            : "border-zinc-200 dark:border-white/8 focus:ring-zinc-500/50"
                            }`}
                    />
                    {isOver && (
                        <p className="text-[9px] text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> Over limit — enable Thread to split across tweets
                        </p>
                    )}
                </div>

                {/* Thread option */}
                <button
                    onClick={() => update({ xUseThread: !nodeData.xUseThread })}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${nodeData.xUseThread
                        ? "bg-zinc-800/15 border-zinc-700/40 dark:border-white/20"
                        : "bg-zinc-100 dark:bg-zinc-800/40 border-zinc-200 dark:border-white/8 hover:border-zinc-300 dark:hover:border-white/15"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xs">🧵</span>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200">Thread Mode</p>
                            <p className="text-[9px] text-zinc-400 dark:text-zinc-500">Split into multiple linked tweets</p>
                        </div>
                    </div>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${nodeData.xUseThread
                        ? "bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white"
                        : "border-zinc-300 dark:border-zinc-600"
                        }`}>
                        {nodeData.xUseThread && <span className="text-white dark:text-zinc-900 text-[9px] font-bold">✓</span>}
                    </div>
                </button>

                {nodeData.xUseThread && isOver && (
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-lg p-2 border border-zinc-200 dark:border-white/8">
                        <p className="text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Thread preview</p>
                        {text.match(/.{1,280}/g)?.map((part, i) => (
                            <p key={i} className="text-[9px] text-zinc-600 dark:text-zinc-400 mb-1">
                                <span className="font-bold text-zinc-400">{i + 1}/</span> {part.trim()}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    /* ── General body ────────────────────────────────────── */
    const GeneralBody = () => {
        const charCount = (nodeData.generalText ?? "").length;
        return (
            <div className="space-y-2.5">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">Content</label>
                        <span className="text-[9px] text-zinc-400">{charCount} chars</span>
                    </div>
                    <textarea
                        value={nodeData.generalText ?? ""}
                        onChange={(e) => update({ generalText: e.target.value })}
                        placeholder="General post content — no platform restrictions. Perfect to feed into AI Repurposer."
                        rows={5}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/8 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all resize-none leading-relaxed"
                    />
                </div>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-relaxed">
                    💡 Connect to <strong>AI Repurposer</strong> to automatically adapt for all platforms, or directly to a Platform Output node.
                </p>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
        relative rounded-xl overflow-visible
        bg-white/90 dark:bg-zinc-900/90
        backdrop-blur-xl border
        shadow-lg dark:shadow-black/40
        transition-all duration-200
        ${platform ? "w-72" : "w-56"}
        ${selected
                    ? "border-[var(--omni)] shadow-[0_0_0_1.5px_var(--omni),0_0_24px_var(--omni-glow)]"
                    : nodeData.status === "confirmed"
                        ? "border-emerald-500/50"
                        : "border-zinc-200 dark:border-white/10"
                }
      `}
        >
            {/* Header */}
            <div className={`
        relative flex items-center gap-2.5 px-3 py-2.5
        ${cfg ? `bg-gradient-to-r ${cfg.gradient} text-white` : "bg-gradient-to-r from-slate-500/15 to-zinc-500/15"}
        border-b border-zinc-200 dark:border-white/8 rounded-t-xl
        cursor-pointer group select-none
      `}
                onClick={() => setPickerOpen((o) => !o)}
                onMouseDown={(e) => e.stopPropagation()}
                title={platform ? "Click to change post type" : "Click to choose post type"}
            >
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${cfg ? "bg-white/15 backdrop-blur-sm" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                    {cfg ? cfg.logo : <FileText className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
                </span>
                <div className="min-w-0 flex-1">
                    <p className={`text-[10px] font-semibold uppercase tracking-widest leading-none ${cfg ? "text-white/70" : "text-zinc-400"}`}>Finalize</p>
                    <p className={`text-xs font-bold leading-tight mt-0.5 truncate ${cfg ? "text-white" : "text-zinc-600 dark:text-zinc-300"}`}>
                        {cfg ? cfg.label : "Generate Post"}
                    </p>
                </div>
                <motion.div
                    animate={{ rotate: pickerOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`shrink-0 opacity-60 group-hover:opacity-100 transition-opacity ${cfg ? "text-white" : "text-zinc-400"}`}
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </motion.div>

                {/* Platform picker dropdown */}
                <AnimatePresence>
                    {pickerOpen && (
                        <div
                            className="absolute left-0 right-0 z-50"
                            style={{ top: "48px" }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <PlatformPickerPopup
                                onSelect={selectPlatform}
                                onClose={() => setPickerOpen(false)}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Body — only show when platform selected */}
            {platform ? (
                <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>
                    {platform === "instagram" && <InstagramBody />}
                    {platform === "x" && <TwitterBody />}
                    {(platform === "linkedin" || platform === "facebook" || platform === "reddit" || platform === "general") && <GeneralBody />}

                    {/* Status + Generate button */}
                    <div className="space-y-2">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleGenerate}
                            className={`
                w-full flex items-center justify-center gap-2 py-2 rounded-lg
                text-xs font-bold border transition-all duration-200 cursor-pointer
                ${nodeData.status === "confirmed"
                                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                                    : nodeData.status === "ready"
                                        ? "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-500 hover:border-zinc-300"
                                        : "bg-[var(--omni)] border-[var(--omni)] text-white hover:bg-[var(--omni)]/90 shadow-[0_0_12px_var(--omni-glow)]"
                                }
              `}
                        >
                            {nodeData.status === "confirmed" ? (
                                <><CheckCircle2 className="w-3.5 h-3.5" /> Post Confirmed</>
                            ) : nodeData.status === "ready" ? (
                                <><Zap className="w-3.5 h-3.5" /> Re-generate Post</>
                            ) : (
                                <><Zap className="w-3.5 h-3.5" /> Generate Post</>
                            )}
                        </motion.button>

                        {/* Generated preview */}
                        <AnimatePresence>
                            {nodeData.status === "ready" && !pickerOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-lg p-2 border border-zinc-200 dark:border-white/8 space-y-2">
                                        <p className="text-[9px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                                            {nodeData.generatedPost}
                                        </p>
                                        <button
                                            onClick={() => update({ status: "confirmed" })}
                                            className="w-full text-[9px] font-bold py-1 px-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-400 transition-colors cursor-pointer"
                                        >
                                            ✓ Confirm Post
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                /* No platform chosen yet — prompt card */
                <div className="px-4 py-5 text-center" onMouseDown={(e) => e.stopPropagation()}>
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-0.5">Choose a post type</p>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500">Click the header to select Instagram, Twitter, or General format</p>
                </div>
            )}

            <Handle type="target" position={Position.Left} id="input" className="!top-1/2 !-translate-y-1/2" />
            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const GeneratePostNode = memo(GeneratePostNodeComponent);
