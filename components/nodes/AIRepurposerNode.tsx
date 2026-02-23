"use client";

import { memo, useCallback, useState } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { Rocket, Zap, CheckCircle2, Edit3, RefreshCw, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type {
    AIRepurposerNodeData,
    PlatformType,
    RepurposerPlatformConfig,
} from "@/types/workflow";
import { PLATFORM_LIMITS } from "@/types/workflow";

/* ── Platform config ─────────────────────────── */
const PLATFORM_META: Record<
    PlatformType,
    {
        label: string;
        strategyShort: string;
        gradient: string;
        charLimit: number;
        logo: React.ReactNode;
    }
> = {
    x: {
        label: "X / Twitter",
        strategyShort: "Thread format",
        gradient: "from-zinc-800 to-zinc-900",
        charLimit: PLATFORM_LIMITS.x.caption,
        logo: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    instagram: {
        label: "Instagram",
        strategyShort: "Viral caption",
        gradient: "from-fuchsia-500 via-rose-500 to-amber-500",
        charLimit: PLATFORM_LIMITS.instagram.caption,
        logo: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    linkedin: {
        label: "LinkedIn",
        strategyShort: "Professional narrative",
        gradient: "from-blue-600 to-blue-700",
        charLimit: PLATFORM_LIMITS.linkedin.caption,
        logo: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    facebook: {
        label: "Facebook",
        strategyShort: "Community engagement",
        gradient: "from-blue-500 to-indigo-600",
        charLimit: PLATFORM_LIMITS.facebook.caption,
        logo: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    reddit: {
        label: "Reddit",
        strategyShort: "Community post",
        gradient: "from-orange-500 to-red-600",
        charLimit: PLATFORM_LIMITS.reddit.caption,
        logo: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <circle cx="12" cy="12" r="10" />
                <path fill="white" d="M16.67 12a1.3 1.3 0 0 0-1.3 1.3c0 .17.03.34.09.5A5.6 5.6 0 0 1 12 14.7a5.6 5.6 0 0 1-3.46-.9.97.97 0 0 0 .09-.5A1.3 1.3 0 0 0 7.33 12a1.3 1.3 0 0 0 0 2.6c.28 0 .54-.09.75-.24A6.6 6.6 0 0 0 12 15.7a6.6 6.6 0 0 0 3.92-1.34c.21.15.47.24.75.24a1.3 1.3 0 0 0 0-2.6zM20 12a2 2 0 0 0-2-2 2 2 0 0 0-1.38.55A8.07 8.07 0 0 0 12.5 9.1l.76-2.4 2.1.47a1.2 1.2 0 1 0 .13-.62l-2.4-.53a.3.3 0 0 0-.35.2l-.87 2.74A8.09 8.09 0 0 0 7.4 10.55 2 2 0 0 0 4 12a2 2 0 0 0 1.04 1.74 3.4 3.4 0 0 0-.04.46c0 2.33 2.69 4.2 6 4.2s6-1.87 6-4.2a3.4 3.4 0 0 0-.04-.46A2 2 0 0 0 20 12zm-8.5 2a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm2 1.5c-.4.4-1 .6-1.5.6s-1.1-.2-1.5-.6a.2.2 0 0 1 .28-.28c.33.33.77.48 1.22.48s.89-.15 1.22-.48a.2.2 0 0 1 .28.28zm.5-1.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
            </svg>
        ),
    },
};

const PLATFORM_ORDER: PlatformType[] = ["x", "instagram", "linkedin", "facebook", "reddit"];

/* Simulated generated posts */
const SIMULATED_POSTS: Record<PlatformType, string> = {
    x: `🧵 The one framework that changed everything about my content strategy\n\n1/ Stop trying to "hack" the algorithm. Here's the real game no one talks about...\n\n2/ The creators winning right now all speak to ONE person, not everyone.\n\n3/ When I shifted from "reach" to "resonance" — everything changed. Here's how ↓`,
    linkedin: `I spent 12 months posting into the void.\n\nNo engagement. No growth. Just effort with no return.\n\nThen I changed one thing, and everything flipped.\n\nHere are the 3 shifts that took me from 0 to consistent traction:\n\n1️⃣ Specificity beats volume\n2️⃣ Resonance over reach\n3️⃣ The 48-hour reply window\n\nThe algorithm isn't your enemy. Vague content is.\n\nWhat was the one change that flipped your content game? 👇`,
    instagram: `The day I almost quit is the day everything changed ✨\n\n12 months of posting. Zero traction. I was this close to deleting everything.\n\nBut then I asked myself: "Am I talking TO people or AT them?"\n\nThat shift changed EVERYTHING 🔥\n\n→ Stop chasing trends. Start setting them.\n→ Your story is your strategy.\n→ Consistency > perfection every time.\n\n#contentcreator #growthmindset #socialmediatips #creatoreconomy`,
    facebook: `I want to share something I don't usually talk about publicly...\n\nFor almost a year, I was creating content that felt like shouting into a room where nobody was listening.\n\nThe turning point wasn't a new strategy. It was realizing I was creating content I thought people wanted, instead of content I had something real to say about.\n\nHave you ever almost gave up on something that later became your biggest win? Share below 👇`,
    reddit: `**The uncomfortable truth about content that nobody tells you**\n\nI've been creating content for 2 years. Here's what I wish someone had told me on day one:\n\n**1. Consistency beats quality early on** — Your first 100 posts will be bad. Ship anyway.\n\n**2. Niching down feels wrong, but it's right** — "Content for everyone" means content for no one.\n\n**3. Distribution \u003e creation** — A mediocre post promoted well beats a great post nobody sees.\n\nWhat would you add? Drop it below — would love to hear from this community.`,
};

/* ── Post Preview Tab ─────────────────────────── */
function PostPreviewTab({
    platform,
    config,
    onConfirm,
    onEdit,
    onRegenerate,
}: {
    platform: PlatformType;
    config: RepurposerPlatformConfig;
    onConfirm: () => void;
    onEdit: (text: string) => void;
    onRegenerate: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(config.editedPost || config.generatedPost);
    const meta = PLATFORM_META[platform];
    const displayText = config.editedPost || config.generatedPost;
    const charCount = displayText.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-2"
        >
            {/* Post text */}
            {isEditing ? (
                <div className="space-y-1.5">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={5}
                        className="w-full text-[10px] px-2.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-[var(--omni)]/40 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[var(--omni)]/50 resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold ${charCount > meta.charLimit ? "text-rose-500" : "text-zinc-400"}`}>
                            {charCount}/{meta.charLimit}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => { setIsEditing(false); }}
                                className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { onEdit(editText); setIsEditing(false); }}
                                className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[var(--omni)] text-white hover:bg-[var(--omni)]/90 cursor-pointer transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-200 dark:border-white/8">
                    <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line max-h-28 overflow-y-auto">
                        {displayText}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className={`text-[8px] font-bold tabular-nums ${charCount > meta.charLimit ? "text-rose-500" : "text-zinc-400"}`}>
                            {charCount}/{meta.charLimit} chars
                        </span>
                        {config.editedPost && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/25">
                                edited
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            {!isEditing && (
                <div className="flex gap-1.5">
                    {config.status !== "confirmed" ? (
                        <button
                            onClick={onConfirm}
                            className="
                flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg
                bg-emerald-500 hover:bg-emerald-400 text-white
                text-[9px] font-bold transition-colors cursor-pointer
                shadow-[0_0_8px_rgba(52,211,153,0.3)]
              "
                        >
                            <CheckCircle2 className="w-3 h-3" /> Confirm
                        </button>
                    ) : (
                        <div className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </div>
                    )}
                    <button
                        onClick={() => { setEditText(displayText); setIsEditing(true); }}
                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/8 text-zinc-500 text-[9px] font-bold hover:border-[var(--omni)]/40 transition-all cursor-pointer"
                        title="Edit post"
                    >
                        <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={onRegenerate}
                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-white/8 text-zinc-500 text-[9px] font-bold hover:border-amber-500/40 hover:text-amber-600 transition-all cursor-pointer"
                        title="Regenerate this post"
                    >
                        <RefreshCw className="w-3 h-3" />
                    </button>
                </div>
            )}
        </motion.div>
    );
}

/* ── Main AIRepurposerNode ───────────────────── */
function AIRepurposerNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as AIRepurposerNodeData;
    const { setNodes } = useReactFlow();

    const defaultPlatforms: Record<PlatformType, RepurposerPlatformConfig> = {
        x: { enabled: true, strategy: "Thread format", generatedPost: "", editedPost: "", status: "idle" },
        instagram: { enabled: true, strategy: "Viral caption", generatedPost: "", editedPost: "", status: "idle" },
        linkedin: { enabled: false, strategy: "Professional narrative", generatedPost: "", editedPost: "", status: "idle" },
        facebook: { enabled: false, strategy: "Community engagement", generatedPost: "", editedPost: "", status: "idle" },
        reddit: { enabled: false, strategy: "Community post", generatedPost: "", editedPost: "", status: "idle" },
    };

    const platforms = (nodeData.platforms ?? defaultPlatforms) as Record<PlatformType, RepurposerPlatformConfig>;
    const isRunning = nodeData.isRunning ?? false;
    const activePreviewTab = nodeData.activePreviewTab ?? null;

    const enabledList = PLATFORM_ORDER.filter((p) => platforms[p]?.enabled);
    const enabledCount = enabledList.length;
    const hasAnyOutput = PLATFORM_ORDER.some((p) => platforms[p]?.generatedPost);
    const allConfirmed = enabledList.every((p) => platforms[p]?.status === "confirmed") && hasAnyOutput;

    const update = useCallback(
        (patch: Partial<AIRepurposerNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    const togglePlatform = useCallback(
        (p: PlatformType) => {
            update({
                platforms: {
                    ...platforms,
                    [p]: { ...platforms[p], enabled: !platforms[p]?.enabled },
                },
            });
        },
        [platforms, update]
    );

    const setPlatformField = useCallback(
        (p: PlatformType, field: Partial<RepurposerPlatformConfig>) => {
            setNodes((nds) =>
                nds.map((n) => {
                    if (n.id !== id) return n;
                    const cur = n.data.platforms as Record<PlatformType, RepurposerPlatformConfig>;
                    return { ...n, data: { ...n.data, platforms: { ...cur, [p]: { ...cur[p], ...field } } } };
                })
            );
        },
        [id, setNodes]
    );

    /* Staggered generation */
    const handleRepurpose = useCallback(() => {
        if (enabledCount === 0 || isRunning) return;
        update({ isRunning: true });
        enabledList.forEach((platform, i) => {
            setTimeout(() => {
                setNodes((nds) =>
                    nds.map((n) => {
                        if (n.id !== id) return n;
                        const cur = n.data.platforms as Record<PlatformType, RepurposerPlatformConfig>;
                        const isLast = i === enabledList.length - 1;
                        return {
                            ...n,
                            data: {
                                ...n.data,
                                isRunning: !isLast,
                                activePreviewTab: platform,      // auto-open tab for freshly generated post
                                platforms: {
                                    ...cur,
                                    [platform]: { ...cur[platform], generatedPost: SIMULATED_POSTS[platform], editedPost: "", status: "draft" },
                                },
                            },
                        };
                    })
                );
            }, (i + 1) * 900);
        });
    }, [enabledCount, isRunning, enabledList, id, setNodes, update]);

    const hasPostForTab = activePreviewTab && platforms[activePreviewTab]?.generatedPost;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
        relative w-80 rounded-xl overflow-visible
        bg-white/90 dark:bg-zinc-900/90
        backdrop-blur-xl border shadow-lg dark:shadow-black/40
        transition-all duration-200
        ${selected
                    ? "border-[var(--omni)] shadow-[0_0_0_1.5px_var(--omni),0_0_24px_var(--omni-glow)]"
                    : allConfirmed
                        ? "border-emerald-500/50"
                        : isRunning
                            ? "border-[var(--omni)]/50"
                            : "border-zinc-200 dark:border-white/10"
                }
      `}
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-[var(--omni)]/15 to-purple-500/15 border-b border-zinc-200 dark:border-white/8">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[var(--omni)] to-purple-600 text-white shadow-[0_0_8px_var(--omni-glow)] shrink-0">
                    <Rocket className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--omni)] leading-none">AI Helper</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">AI Repurposer</p>
                </div>
                <div className="flex items-center gap-2">
                    {enabledCount > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--omni)]/15 text-[var(--omni)] border border-[var(--omni)]/25">
                            {enabledCount} platform{enabledCount !== 1 ? "s" : ""}
                        </span>
                    )}
                    {allConfirmed && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-emerald-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                        </motion.div>
                    )}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isRunning ? "bg-[var(--omni)] animate-pulse" :
                        allConfirmed ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" :
                            hasAnyOutput ? "bg-amber-400" :
                                "bg-zinc-400 dark:bg-zinc-600"
                        }`} />
                </div>
            </div>

            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>

                {/* ── Platform selector ─── */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">
                        Target Platforms
                    </label>
                    <div className="space-y-1.5">
                        {PLATFORM_ORDER.map((platform) => {
                            const meta = PLATFORM_META[platform];
                            const isEnabled = platforms[platform]?.enabled ?? false;
                            const pStatus = platforms[platform]?.status ?? "idle";
                            const hasDraft = !!platforms[platform]?.generatedPost;

                            return (
                                <div
                                    key={platform}
                                    className={`
                    flex items-center gap-2 p-2 rounded-lg border transition-all duration-150
                    ${isEnabled
                                            ? "bg-[var(--omni)]/6 border-[var(--omni)]/35"
                                            : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-white/8"
                                        }
                  `}
                                >
                                    {/* Toggle button */}
                                    <button
                                        onClick={() => togglePlatform(platform)}
                                        className="flex items-center gap-2 flex-1 cursor-pointer text-left"
                                    >
                                        <div className={`flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br ${meta.gradient} text-white shrink-0`}>
                                            {meta.logo}
                                        </div>
                                        <div className="flex flex-col items-start min-w-0 flex-1">
                                            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200">{meta.label}</span>
                                            {isEnabled && <span className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate w-full">{meta.strategyShort}</span>}
                                        </div>
                                        <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-all ${isEnabled ? "bg-[var(--omni)] border-[var(--omni)]" : "border-zinc-300 dark:border-zinc-600"
                                            }`}>
                                            {isEnabled && <span className="text-white text-[9px] font-bold">✓</span>}
                                        </div>
                                    </button>

                                    {/* View post button (when has draft) */}
                                    {isEnabled && hasDraft && (
                                        <button
                                            onClick={() => update({ activePreviewTab: activePreviewTab === platform ? null : platform })}
                                            className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-1 rounded-md border transition-all cursor-pointer shrink-0 ${activePreviewTab === platform
                                                ? "bg-[var(--omni)]/15 border-[var(--omni)]/40 text-[var(--omni)]"
                                                : "bg-zinc-100 dark:bg-zinc-700/40 border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-[var(--omni)]/40"
                                                }`}
                                        >
                                            {pStatus === "confirmed" ? (
                                                <><CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /></>
                                            ) : (
                                                <><Eye className="w-2.5 h-2.5" /> View</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Post Preview Panel ─── */}
                <AnimatePresence>
                    {activePreviewTab && hasPostForTab && (
                        <motion.div
                            key={`preview-${activePreviewTab}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            {/* Platform tab header */}
                            <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-t-lg bg-gradient-to-r ${PLATFORM_META[activePreviewTab].gradient} text-white`}>
                                {PLATFORM_META[activePreviewTab].logo}
                                <span className="text-[9px] font-bold">{PLATFORM_META[activePreviewTab].label}</span>
                                <span className="ml-auto text-[8px] opacity-75">
                                    {platforms[activePreviewTab].status === "confirmed" ? "✓ Confirmed" :
                                        platforms[activePreviewTab].editedPost ? "✏ Edited" : "Draft"}
                                </span>
                            </div>

                            <div className="border border-t-0 border-zinc-200 dark:border-white/8 rounded-b-lg overflow-hidden">
                                <div className="p-2 bg-zinc-50 dark:bg-zinc-800/40">
                                    <PostPreviewTab
                                        platform={activePreviewTab}
                                        config={platforms[activePreviewTab]}
                                        onConfirm={() => setPlatformField(activePreviewTab, { status: "confirmed" })}
                                        onEdit={(text) => setPlatformField(activePreviewTab, { editedPost: text, status: "draft" })}
                                        onRegenerate={() => {
                                            update({ isRunning: true });
                                            setTimeout(() => {
                                                setPlatformField(activePreviewTab, {
                                                    generatedPost: SIMULATED_POSTS[activePreviewTab],
                                                    editedPost: "",
                                                    status: "draft",
                                                });
                                                update({ isRunning: false });
                                            }, 1200);
                                        }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Generate button ─── */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRepurpose}
                    disabled={isRunning || enabledCount === 0}
                    className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
            text-xs font-bold border transition-all duration-200 cursor-pointer
            ${enabledCount === 0
                            ? "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-400 cursor-not-allowed"
                            : isRunning
                                ? "bg-[var(--omni)]/10 border-[var(--omni)]/30 text-[var(--omni)] cursor-not-allowed"
                                : hasAnyOutput
                                    ? "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-[var(--omni)]/40"
                                    : "bg-[var(--omni)] border-[var(--omni)] text-white hover:bg-[var(--omni)]/90 shadow-[0_0_16px_var(--omni-glow)]"
                        }
          `}
                >
                    {isRunning ? (
                        <>
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                <Zap className="w-3.5 h-3.5" />
                            </motion.span>
                            Generating posts…
                        </>
                    ) : hasAnyOutput ? (
                        <><RefreshCw className="w-3.5 h-3.5" /> Regenerate All</>
                    ) : (
                        <><Rocket className="w-3.5 h-3.5" /> {enabledCount === 0 ? "Select a platform first" : `Generate ${enabledCount} Post${enabledCount !== 1 ? "s" : ""}`}</>
                    )}
                </motion.button>
            </div>

            <Handle type="target" position={Position.Left} id="input" className="!top-1/2 !-translate-y-1/2" />
            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const AIRepurposerNode = memo(AIRepurposerNodeComponent);
