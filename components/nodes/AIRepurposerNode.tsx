"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { Rocket, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AIRepurposerNodeData, PlatformType, RepurposerPlatformConfig } from "@/types/workflow";

// Platform-specific strategies shown as brief strategy pills
const PLATFORM_META: Record<
    PlatformType,
    { label: string; strategy: string; strategyShort: string; gradient: string; textColor: string }
> = {
    x: {
        label: "X / Twitter",
        strategy: "Hook → Thread (280 chars/tweet) → Punchy CTA",
        strategyShort: "Thread format",
        gradient: "from-zinc-800 to-zinc-900",
        textColor: "text-white",
    },
    linkedin: {
        label: "LinkedIn",
        strategy: "Pro narrative • 1,200 chars • 3 key takeaways • Question CTA",
        strategyShort: "Professional narrative",
        gradient: "from-blue-600 to-blue-700",
        textColor: "text-white",
    },
    instagram: {
        label: "Instagram",
        strategy: "Emotional hook • Emoji-rich • Storytelling • Strong CTA + 8 hashtags",
        strategyShort: "Viral caption",
        gradient: "from-fuchsia-500 via-rose-500 to-amber-500",
        textColor: "text-white",
    },
    facebook: {
        label: "Facebook",
        strategy: "Community-friendly • Conversational • Ends with question to drive comments",
        strategyShort: "Community engagement",
        gradient: "from-blue-500 to-indigo-600",
        textColor: "text-white",
    },
};

// Simulated outputs by platform
const SIMULATED_POSTS: Record<PlatformType, string> = {
    x: `🧵 Thread: The one framework that changed everything about my content strategy\n\n1/ Stop trying to "hack" the algorithm. Here's the real game no one talks about...\n\n2/ The creators winning right now all have one thing in common: they speak to ONE person, not everyone.\n\n3/ When I shifted from "I need reach" to "I need resonance" — everything changed. Here's how ↓`,
    linkedin: `I spent 12 months posting into the void.\n\nNo engagement. No growth. Just effort with no return.\n\nThen I changed one thing, and everything flipped.\n\nHere are the 3 shifts that took me from 0 to consistent traction:\n\n1️⃣ Specificity beats volume — Narrow your niche until it feels too small, then go narrower.\n2️⃣ Resonance over reach — One post that speaks directly to your ICP is worth 10 generic ones.\n3️⃣ The 48-hour window — LinkedIn rewards early engagement. Reply to every comment in the first 48 hours.\n\nThe algorithm isn't your enemy. Vague content is.\n\nWhat was the one change that flipped your content game? Drop it below 👇`,
    instagram: `The day I almost quit is the day everything changed ✨\n\n12 months of posting. Zero traction. I was this close to deleting everything.\n\nBut then I asked myself one question: "Am I talking TO people or AT them?"\n\nThat shift changed EVERYTHING 🔥\n\nHere's what I learned (save this!):\n→ Stop chasing trends. Start setting them.\n→ Your story is your strategy.\n→ Consistency > perfection every single time.\n\nThe creators who win aren't the most talented. They're the most relentless 💪\n\nDouble tap if this hit different 🤍\n\n#contentcreator #growthmindset #socialmediatips #creatoreconomy #contentmarketing`,
    facebook: `I want to share something I don't usually talk about publicly...\n\nFor almost a year, I was creating content that felt like shouting into a room where nobody was listening. It's a lonely place to be, and I know a lot of you have been there too.\n\nThe turning point wasn't a new strategy or a viral post. It was realizing that I was creating content I thought people wanted to see, instead of content I actually had something real to say about.\n\nThe moment I started speaking from genuine experience instead of manufactured expertise — things changed.\n\nHave you ever had a moment where you almost gave up on something that later became your biggest win? I'd love to hear your story in the comments 👇`,
};

const PLATFORM_ORDER: PlatformType[] = ["x", "linkedin", "instagram", "facebook"];

const PlatformLogo = ({ platform }: { platform: PlatformType }) => {
    if (platform === "x") return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
    if (platform === "linkedin") return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
        </svg>
    );
    if (platform === "instagram") return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
};

function AIRepurposerNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as AIRepurposerNodeData;
    const { setNodes } = useReactFlow();

    const update = useCallback(
        (patch: Partial<AIRepurposerNodeData>) => {
            setNodes((nds) =>
                nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
            );
        },
        [id, setNodes]
    );

    const platforms = nodeData.platforms ?? {
        x: { enabled: true, strategy: PLATFORM_META.x.strategyShort, generatedPost: "" },
        linkedin: { enabled: true, strategy: PLATFORM_META.linkedin.strategyShort, generatedPost: "" },
        instagram: { enabled: true, strategy: PLATFORM_META.instagram.strategyShort, generatedPost: "" },
        facebook: { enabled: false, strategy: PLATFORM_META.facebook.strategyShort, generatedPost: "" },
    };

    const isRunning = nodeData.isRunning ?? false;
    const enabledCount = PLATFORM_ORDER.filter((p) => platforms[p]?.enabled).length;
    const hasOutput = PLATFORM_ORDER.some((p) => platforms[p]?.generatedPost);

    const togglePlatform = useCallback(
        (p: PlatformType) => {
            const updated = {
                ...platforms,
                [p]: { ...platforms[p], enabled: !platforms[p]?.enabled },
            };
            update({ platforms: updated });
        },
        [platforms, update]
    );

    const handleRepurpose = useCallback(() => {
        if (enabledCount === 0 || isRunning) return;
        update({ isRunning: true });
        const enabledPlatforms = PLATFORM_ORDER.filter((p) => platforms[p]?.enabled);

        // Stagger generation per platform
        enabledPlatforms.forEach((platform, i) => {
            setTimeout(() => {
                setNodes((nds) =>
                    nds.map((n) => {
                        if (n.id !== id) return n;
                        const currentPlatforms = n.data.platforms as Record<PlatformType, RepurposerPlatformConfig>;
                        return {
                            ...n,
                            data: {
                                ...n.data,
                                isRunning: i < enabledPlatforms.length - 1,
                                platforms: {
                                    ...currentPlatforms,
                                    [platform]: {
                                        ...currentPlatforms[platform],
                                        generatedPost: SIMULATED_POSTS[platform],
                                    },
                                },
                            },
                        };
                    })
                );
            }, (i + 1) * 900);
        });
    }, [enabledCount, isRunning, platforms, id, setNodes, update]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`relative w-80 rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border shadow-lg dark:shadow-black/40 transition-all duration-200 ${selected ? "border-[var(--omni)]" : isRunning ? "border-[var(--omni)]/60" : "border-zinc-200 dark:border-white/10"
                }`}
            style={
                selected
                    ? { boxShadow: "0 0 0 1.5px var(--omni), 0 0 24px var(--omni-glow)" }
                    : undefined
            }
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-[var(--omni)]/15 to-purple-500/15 border-b border-zinc-200 dark:border-white/8">
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[var(--omni)] to-purple-600 text-white shadow-[0_0_8px_var(--omni-glow)] shrink-0">
                    <Rocket className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--omni)] leading-none">AI Helper</p>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-tight mt-0.5">AI Repurposer</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {enabledCount > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--omni)]/15 text-[var(--omni)] border border-[var(--omni)]/25">
                            {enabledCount} platform{enabledCount !== 1 ? "s" : ""}
                        </span>
                    )}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isRunning ? "bg-[var(--omni)] animate-pulse" : hasOutput ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-400 dark:bg-zinc-600"}`} />
                </div>
            </div>

            {/* Body */}
            <div className="px-3 py-3 space-y-3" onMouseDown={(e) => e.stopPropagation()}>
                {/* Platform selector */}
                <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block mb-1.5">
                        Target Platforms <span className="normal-case">(select all that apply)</span>
                    </label>
                    <div className="space-y-1.5">
                        {PLATFORM_ORDER.map((platform) => {
                            const meta = PLATFORM_META[platform];
                            const isEnabled = platforms[platform]?.enabled ?? false;
                            const hasPost = !!platforms[platform]?.generatedPost;

                            return (
                                <button
                                    key={platform}
                                    onClick={() => togglePlatform(platform)}
                                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-150 cursor-pointer group ${isEnabled
                                            ? "bg-[var(--omni)]/8 border-[var(--omni)]/40"
                                            : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-white/8 hover:border-[var(--omni)]/30"
                                        }`}
                                >
                                    {/* Platform logo chip */}
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br ${meta.gradient} ${meta.textColor} shrink-0`}>
                                        <PlatformLogo platform={platform} />
                                    </div>

                                    <div className="flex flex-col items-start min-w-0 flex-1">
                                        <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200">{meta.label}</span>
                                        {isEnabled && (
                                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate w-full">{meta.strategyShort}</span>
                                        )}
                                    </div>

                                    {/* Right side — checkbox + done indicator */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {hasPost && isEnabled && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25"
                                            >
                                                Done ✓
                                            </motion.span>
                                        )}
                                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${isEnabled
                                                ? "bg-[var(--omni)] border-[var(--omni)]"
                                                : "bg-transparent border-zinc-300 dark:border-zinc-600"
                                            }`}>
                                            {isEnabled && <span className="text-white text-[9px] font-bold">✓</span>}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Repurpose button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRepurpose}
                    disabled={isRunning || enabledCount === 0}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold border transition-all duration-200 cursor-pointer ${enabledCount === 0
                            ? "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-white/8 text-zinc-400 cursor-not-allowed"
                            : isRunning
                                ? "bg-[var(--omni)]/10 border-[var(--omni)]/30 text-[var(--omni)] cursor-not-allowed"
                                : "bg-[var(--omni)] border-[var(--omni)] text-white hover:bg-[var(--omni)]/90 shadow-[0_0_16px_var(--omni-glow)]"
                        }`}
                >
                    {isRunning ? (
                        <>
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                <Zap className="w-3.5 h-3.5" />
                            </motion.span>
                            Generating {enabledCount} post{enabledCount !== 1 ? "s" : ""}…
                        </>
                    ) : (
                        <>
                            <Rocket className="w-3.5 h-3.5" />
                            {enabledCount === 0 ? "Select a platform first" : `Repurpose for ${enabledCount} platform${enabledCount !== 1 ? "s" : ""}`}
                        </>
                    )}
                </motion.button>

                {/* Generated posts preview */}
                <AnimatePresence>
                    {hasOutput && !isRunning && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 overflow-hidden"
                        >
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 block">Generated Posts</label>
                            {PLATFORM_ORDER.filter((p) => platforms[p]?.enabled && platforms[p]?.generatedPost).map((platform) => {
                                const meta = PLATFORM_META[platform];
                                return (
                                    <motion.div
                                        key={platform}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-lg overflow-hidden border border-zinc-200 dark:border-white/8"
                                    >
                                        <div className={`flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r ${meta.gradient}`}>
                                            <PlatformLogo platform={platform} />
                                            <span className={`text-[9px] font-bold ${meta.textColor}`}>{meta.label}</span>
                                        </div>
                                        <div className="p-2 bg-zinc-50 dark:bg-zinc-800/40">
                                            <p className="text-[9px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                                                {platforms[platform].generatedPost}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Handle type="target" position={Position.Left} id="input" className="!top-1/2 !-translate-y-1/2" />
            <Handle type="source" position={Position.Right} id="output" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const AIRepurposerNode = memo(AIRepurposerNodeComponent);
