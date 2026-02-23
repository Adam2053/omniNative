"use client";

import { useCallback, useState } from "react";
import {
    Lightbulb, PenLine, ImageIcon,
    Wand2, MessageSquarePlus, Rocket,
    FileText, Instagram,
    Layers, ChevronLeft, Linkedin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaletteItemDef {
    type: string;
    label: string;
    desc: string;
    icon: React.ReactNode;
    gradient: string;
}

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const FbIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const RdIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <circle cx="12" cy="12" r="10" />
        <path fill="white" d="M16.67 12a1.3 1.3 0 0 0-1.3 1.3c0 .17.03.34.09.5A5.6 5.6 0 0 1 12 14.7a5.6 5.6 0 0 1-3.46-.9.97.97 0 0 0 .09-.5A1.3 1.3 0 0 0 7.33 12a1.3 1.3 0 0 0 0 2.6c.28 0 .54-.09.75-.24A6.6 6.6 0 0 0 12 15.7a6.6 6.6 0 0 0 3.92-1.34c.21.15.47.24.75.24a1.3 1.3 0 0 0 0-2.6zM20 12a2 2 0 0 0-2-2 2 2 0 0 0-1.38.55A8.07 8.07 0 0 0 12.5 9.1l.76-2.4 2.1.47a1.2 1.2 0 1 0 .13-.62l-2.4-.53a.3.3 0 0 0-.35.2l-.87 2.74A8.09 8.09 0 0 0 7.4 10.55 2 2 0 0 0 4 12a2 2 0 0 0 1.04 1.74 3.4 3.4 0 0 0-.04.46c0 2.33 2.69 4.2 6 4.2s6-1.87 6-4.2a3.4 3.4 0 0 0-.04-.46A2 2 0 0 0 20 12zm-8.5 2a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm2 1.5c-.4.4-1 .6-1.5.6s-1.1-.2-1.5-.6a.2.2 0 0 1 .28-.28c.33.33.77.48 1.22.48s.89-.15 1.22-.48a.2.2 0 0 1 .28.28zm.5-1.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
    </svg>
);

const SECTIONS = [
    {
        title: "Creative", accent: "#8b5cf6",
        items: [
            { type: "rawIdea", label: "Raw Idea", desc: "Rough idea → content seed", icon: <Lightbulb className="w-3.5 h-3.5" />, gradient: "from-violet-500 to-indigo-600" },
            { type: "postMaker", label: "Post Maker", desc: "Compose a post manually", icon: <PenLine className="w-3.5 h-3.5" />, gradient: "from-emerald-500 to-teal-600" },
            { type: "mediaAttachment", label: "Media", desc: "Image / video descriptor", icon: <ImageIcon className="w-3.5 h-3.5" />, gradient: "from-rose-500 to-pink-600" },
        ] as PaletteItemDef[],
    },
    {
        title: "AI Helper", accent: "#f59e0b",
        items: [
            { type: "ideaPolisher", label: "Idea Polisher", desc: "Generate concept angles", icon: <Wand2 className="w-3.5 h-3.5" />, gradient: "from-amber-500 to-orange-600" },
            { type: "captionGenerator", label: "Caption Gen", desc: "AI caption + hashtags", icon: <MessageSquarePlus className="w-3.5 h-3.5" />, gradient: "from-sky-500 to-cyan-600" },
            { type: "aiRepurposer", label: "AI Repurposer", desc: "Multi-platform content", icon: <Rocket className="w-3.5 h-3.5" />, gradient: "from-[var(--omni)] to-purple-600" },
        ] as PaletteItemDef[],
    },
    {
        title: "Finalize", accent: "#e879f9",
        items: [
            { type: "generatePost-instagram", label: "Instagram Post", desc: "2,200 chars · 30 hashtags", icon: <Instagram className="w-3.5 h-3.5" />, gradient: "from-fuchsia-500 via-rose-500 to-amber-500" },
            { type: "generatePost-x", label: "X / Twitter Post", desc: "280 chars · thread", icon: <XIcon />, gradient: "from-zinc-700 to-zinc-900" },
            { type: "generatePost-linkedin", label: "LinkedIn Post", desc: "3,000 chars · professional", icon: <Linkedin className="w-3.5 h-3.5" />, gradient: "from-blue-600 to-blue-700" },
            { type: "generatePost-facebook", label: "Facebook Post", desc: "Community post format", icon: <FbIcon />, gradient: "from-blue-500 to-indigo-600" },
            { type: "generatePost-reddit", label: "Reddit Post", desc: "Markdown · 40k chars", icon: <RdIcon />, gradient: "from-orange-500 to-red-600" },
            { type: "generatePost-general", label: "General Post", desc: "No platform constraints", icon: <FileText className="w-3.5 h-3.5" />, gradient: "from-slate-500 to-zinc-700" },
        ] as PaletteItemDef[],
    },
    {
        title: "Output", accent: "#64748b",
        items: [
            { type: "platform-instagram", label: "Instagram", desc: "Instagram output", icon: <Instagram className="w-3.5 h-3.5" />, gradient: "from-fuchsia-500 via-rose-500 to-amber-500" },
            { type: "platform-x", label: "X / Twitter", desc: "Twitter output", icon: <XIcon />, gradient: "from-zinc-700 to-zinc-900" },
            { type: "platform-linkedin", label: "LinkedIn", desc: "LinkedIn output", icon: <Linkedin className="w-3.5 h-3.5" />, gradient: "from-blue-600 to-blue-700" },
            { type: "platform-facebook", label: "Facebook", desc: "Facebook output", icon: <FbIcon />, gradient: "from-blue-500 to-indigo-600" },
            { type: "platform-reddit", label: "Reddit", desc: "Reddit output", icon: <RdIcon />, gradient: "from-orange-500 to-red-600" },
        ] as PaletteItemDef[],
    },
];

function PaletteItem({ item }: { item: PaletteItemDef }) {
    const onDragStart = useCallback((e: React.DragEvent) => {
        e.dataTransfer.setData("application/reactflow-nodetype", item.type);
        e.dataTransfer.effectAllowed = "move";
    }, [item.type]);

    return (
        <div
            draggable
            onDragStart={onDragStart}
            style={{ userSelect: "none" }}
            className="
                flex items-center gap-2.5 px-2.5 py-2 rounded-xl
                bg-white/60 dark:bg-zinc-800/60
                border border-zinc-200/80 dark:border-white/8
                hover:border-zinc-300 dark:hover:border-white/15
                hover:bg-white dark:hover:bg-zinc-800
                hover:shadow-sm
                transition-all duration-150 cursor-grab active:cursor-grabbing group
            "
        >
            <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 bg-gradient-to-br ${item.gradient} text-white shadow-sm group-hover:scale-110 transition-transform duration-150`}>
                {item.icon}
            </span>
            <div className="min-w-0">
                <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200 leading-tight">{item.label}</p>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5 truncate">{item.desc}</p>
            </div>
        </div>
    );
}

interface NodePaletteProps {
    open: boolean;
    onToggle: () => void;
}

export function NodePalette({ open, onToggle }: NodePaletteProps) {
    return (
        <div className="flex items-start gap-2">

            {/* Panel */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="pal"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                        style={{ width: 212 }}
                        className="
                            flex flex-col rounded-2xl overflow-hidden
                            bg-white/85 dark:bg-zinc-950/90
                            backdrop-blur-xl
                            border border-zinc-200 dark:border-white/8
                            shadow-2xl dark:shadow-black/60
                        "
                    >
                        {/* Sticky header */}
                        <div className="flex items-center gap-2 px-3 pt-3 pb-2.5 border-b border-zinc-200 dark:border-white/8 shrink-0">
                            <Layers className="w-3.5 h-3.5 text-[var(--omni)] shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                                Node Palette
                            </span>
                        </div>

                        {/* Scrollable area — lives outside ReactFlow so scroll works natively */}
                        <div
                            style={{
                                overflowY: "scroll",
                                overflowX: "hidden",
                                maxHeight: "calc(100vh - 148px)",
                                padding: "12px 12px 16px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            {SECTIONS.map(({ title, accent, items }) => (
                                <div key={title}>
                                    <p style={{ color: accent }} className="text-[9px] font-bold uppercase tracking-widest mb-1.5 px-0.5">
                                        {title}
                                    </p>
                                    <div className="space-y-1">
                                        {items.map((item) => <PaletteItem key={item.type} item={item} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle button */}
            <motion.button
                onClick={onToggle}
                whileTap={{ scale: 0.9 }}
                title={open ? "Hide palette" : "Show palette"}
                className="
                    mt-1 flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                    bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl
                    border border-zinc-200 dark:border-white/10
                    text-zinc-400 dark:text-zinc-500
                    hover:text-[var(--omni)] hover:border-[var(--omni)]/40
                    shadow-md dark:shadow-black/40
                    transition-all duration-150 cursor-pointer
                "
            >
                <motion.span animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.2 }}>
                    <ChevronLeft className="w-3.5 h-3.5" />
                </motion.span>
            </motion.button>
        </div>
    );
}
