"use client";

import { memo, useCallback, useState } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PlatformNodeData, PlatformType, NodeStatus } from "@/types/workflow";

/* ── SVG Logos ───────────────────────────────────────────────── */
const XLogo = ({ sz = "w-5 h-5" }: { sz?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={sz}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const IgLogo = ({ sz = "w-5 h-5" }: { sz?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={sz}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);
const LiLogo = ({ sz = "w-5 h-5" }: { sz?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={sz}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);
const FbLogo = ({ sz = "w-5 h-5" }: { sz?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={sz}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const RdLogo = ({ sz = "w-5 h-5" }: { sz?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={sz}>
        <circle cx="12" cy="12" r="10" />
        <path fill="white" d="M16.67 12a1.3 1.3 0 0 0-1.3 1.3c0 .17.03.34.09.5A5.6 5.6 0 0 1 12 14.7a5.6 5.6 0 0 1-3.46-.9.97.97 0 0 0 .09-.5A1.3 1.3 0 0 0 7.33 12a1.3 1.3 0 0 0 0 2.6c.28 0 .54-.09.75-.24A6.6 6.6 0 0 0 12 15.7a6.6 6.6 0 0 0 3.92-1.34c.21.15.47.24.75.24a1.3 1.3 0 0 0 0-2.6zM20 12a2 2 0 0 0-2-2 2 2 0 0 0-1.38.55A8.07 8.07 0 0 0 12.5 9.1l.76-2.4 2.1.47a1.2 1.2 0 1 0 .13-.62l-2.4-.53a.3.3 0 0 0-.35.2l-.87 2.74A8.09 8.09 0 0 0 7.4 10.55 2 2 0 0 0 4 12a2 2 0 0 0 1.04 1.74 3.4 3.4 0 0 0-.04.46c0 2.33 2.69 4.2 6 4.2s6-1.87 6-4.2a3.4 3.4 0 0 0-.04-.46A2 2 0 0 0 20 12zm-8.5 2a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm2 1.5c-.4.4-1 .6-1.5.6s-1.1-.2-1.5-.6a.2.2 0 0 1 .28-.28c.33.33.77.48 1.22.48s.89-.15 1.22-.48a.2.2 0 0 1 .28.28zm.5-1.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
    </svg>
);

/* ── Platform config ─────────────────────────────────────────── */
export const PLATFORM_CFG: Record<
    PlatformType,
    { label: string; gradient: string; logo: React.ReactNode; logoSm: React.ReactNode }
> = {
    x: {
        label: "X / Twitter",
        gradient: "from-zinc-800 to-zinc-900",
        logo: <XLogo />,
        logoSm: <XLogo sz="w-4 h-4" />,
    },
    instagram: {
        label: "Instagram",
        gradient: "from-fuchsia-500 via-rose-500 to-amber-500",
        logo: <IgLogo />,
        logoSm: <IgLogo sz="w-4 h-4" />,
    },
    linkedin: {
        label: "LinkedIn",
        gradient: "from-blue-600 to-blue-700",
        logo: <LiLogo />,
        logoSm: <LiLogo sz="w-4 h-4" />,
    },
    facebook: {
        label: "Facebook",
        gradient: "from-blue-500 to-indigo-600",
        logo: <FbLogo />,
        logoSm: <FbLogo sz="w-4 h-4" />,
    },
    reddit: {
        label: "Reddit",
        gradient: "from-orange-500 to-red-600",
        logo: <RdLogo />,
        logoSm: <RdLogo sz="w-4 h-4" />,
    },
};

const ALL_PLATFORMS: PlatformType[] = ["x", "instagram", "linkedin", "facebook", "reddit"];

const STATUS_CFG: Record<NodeStatus, { label: string; color: string; dotColor: string }> = {
    idle: { label: "Idle", color: "text-zinc-400 dark:text-zinc-500", dotColor: "bg-zinc-300 dark:bg-zinc-600" },
    generating: { label: "Generating…", color: "text-amber-500", dotColor: "bg-amber-400" },
    ready: { label: "Ready", color: "text-emerald-500", dotColor: "bg-emerald-400" },
};

/* ── Platform Switcher Dropdown ──────────────────────────────── */
function PlatformSwitcher({
    current,
    onSelect,
    onClose,
}: {
    current: PlatformType;
    onSelect: (p: PlatformType) => void;
    onClose: () => void;
}) {
    return (
        <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="
          w-full
          rounded-xl overflow-hidden
          bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-white/12
          shadow-xl dark:shadow-black/60
        "
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="p-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 px-2 py-1">
                        Switch Platform
                    </p>
                    {ALL_PLATFORMS.map((p) => {
                        const cfg = PLATFORM_CFG[p];
                        const isActive = p === current;
                        return (
                            <button
                                key={p}
                                onClick={() => { onSelect(p); onClose(); }}
                                className={`
                  w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                  transition-all duration-100 cursor-pointer text-left
                  ${isActive
                                        ? "bg-zinc-100 dark:bg-zinc-800"
                                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                                    }
                `}
                            >
                                {/* Mini platform logo tile */}
                                <span className={`flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br ${cfg.gradient} text-white shrink-0`}>
                                    {cfg.logoSm}
                                </span>
                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{cfg.label}</span>
                                {isActive && (
                                    <span className="ml-auto text-[9px] font-bold text-[var(--omni)] bg-[var(--omni)]/10 px-1.5 py-0.5 rounded-full">
                                        Active
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </>
    );
}

/* ── PlatformNode ────────────────────────────────────────────── */
function PlatformNodeComponent({ id, data, selected }: NodeProps) {
    const nodeData = data as PlatformNodeData;
    const { setNodes } = useReactFlow();
    const [switcherOpen, setSwitcherOpen] = useState(false);

    const platform = nodeData.platform ?? "x";
    const status = nodeData.status ?? "idle";
    const cfg = PLATFORM_CFG[platform];
    const statusCfg = STATUS_CFG[status];

    const switchPlatform = useCallback(
        (p: PlatformType) => {
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === id
                        ? { ...n, data: { ...n.data, platform: p, label: PLATFORM_CFG[p].label } }
                        : n
                )
            );
        },
        [id, setNodes]
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
        relative w-52 rounded-xl overflow-visible
        bg-white/90 dark:bg-zinc-900/90
        backdrop-blur-xl border
        ${selected
                    ? "border-[var(--omni)]"
                    : status === "ready"
                        ? "border-emerald-500/50"
                        : status === "generating"
                            ? "border-amber-500/40"
                            : "border-zinc-200 dark:border-white/10"
                }
        shadow-lg dark:shadow-black/40
        transition-all duration-300
      `}
            style={
                selected
                    ? { boxShadow: "0 0 0 1.5px var(--omni), 0 0 20px var(--omni-glow)" }
                    : status === "ready"
                        ? { boxShadow: "0 0 0 1px rgba(52,211,153,0.4), 0 0 16px rgba(52,211,153,0.15)" }
                        : undefined
            }
        >
            {/* Platform Header — click to switch platform */}
            <div
                className={`
          relative flex items-center gap-2.5 px-3 py-3
          bg-gradient-to-r ${cfg.gradient} text-white
          cursor-pointer select-none
          rounded-t-xl
          group
        `}
                onClick={() => setSwitcherOpen((o) => !o)}
                onMouseDown={(e) => e.stopPropagation()}
                title="Click to switch platform"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm shrink-0">
                    {cfg.logo}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70 leading-none">Output</p>
                    <p className="text-sm font-bold leading-tight mt-0.5 truncate">{cfg.label}</p>
                </div>
                {/* Switch icon — rotates when open */}
                <motion.div
                    animate={{ rotate: switcherOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </motion.div>
            </div>

            {/* Platform switcher dropdown — lives OUTSIDE header so overflow-hidden can't clip it */}
            <AnimatePresence>
                {switcherOpen && (
                    <div
                        className="absolute left-0 right-0 z-50"
                        style={{ top: "52px" }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <PlatformSwitcher
                            current={platform}
                            onSelect={switchPlatform}
                            onClose={() => setSwitcherOpen(false)}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Status row */}
            <div className="flex items-center justify-between px-3 py-2.5 border-t border-zinc-200 dark:border-white/8 rounded-b-xl overflow-hidden">
                <div className="flex items-center gap-1.5">
                    <AnimatePresence mode="wait">
                        {status === "generating" ? (
                            <motion.div key="spinner" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                            </motion.div>
                        ) : status === "ready" ? (
                            <motion.div key="check" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            </motion.div>
                        ) : (
                            <motion.div key="dot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`w-2 h-2 rounded-full ${statusCfg.dotColor}`} />
                        )}
                    </AnimatePresence>
                    <span className={`text-xs font-semibold ${statusCfg.color} transition-colors duration-300`}>{statusCfg.label}</span>
                </div>

                <AnimatePresence>
                    {status === "ready" && (
                        <motion.span
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25"
                        >
                            Published
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <Handle type="target" position={Position.Left} id="input" className="!top-1/2 !-translate-y-1/2" />
        </motion.div>
    );
}

export const PlatformNode = memo(PlatformNodeComponent);
