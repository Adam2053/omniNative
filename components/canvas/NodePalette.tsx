"use client";

import { Lightbulb, PenLine, ImagePlay, Wand2, MessageSquarePlus, Rocket } from "lucide-react";

/* ── Platform SVG logos (inline) ────────────────────────────── */
const XLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
const IgLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);
const LiLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);
const FbLogo = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

interface PaletteItem {
    type: string;
    label: string;
    desc: string;
    icon: React.ReactNode;
    gradient: string;
    accent: string;
}

const GROUPS: { title: string; items: PaletteItem[] }[] = [
    {
        title: "Creative",
        items: [
            {
                type: "rawIdea",
                label: "Raw Idea",
                desc: "Rough idea → content prompt",
                icon: <Lightbulb className="w-3.5 h-3.5" />,
                gradient: "from-violet-500 to-indigo-600",
                accent: "border-violet-500/35 hover:border-violet-500/65",
            },
            {
                type: "postMaker",
                label: "Post Maker",
                desc: "Compose a post manually",
                icon: <PenLine className="w-3.5 h-3.5" />,
                gradient: "from-emerald-500 to-teal-600",
                accent: "border-emerald-500/35 hover:border-emerald-500/65",
            },
            {
                type: "mediaAttachment",
                label: "Media",
                desc: "Attach image / video / GIF",
                icon: <ImagePlay className="w-3.5 h-3.5" />,
                gradient: "from-rose-500 to-pink-600",
                accent: "border-rose-500/35 hover:border-rose-500/65",
            },
        ],
    },
    {
        title: "AI Helper",
        items: [
            {
                type: "ideaPolisher",
                label: "Idea Polisher",
                desc: "3 polished content angles",
                icon: <Wand2 className="w-3.5 h-3.5" />,
                gradient: "from-amber-500 to-orange-600",
                accent: "border-amber-500/35 hover:border-amber-500/65",
            },
            {
                type: "captionGenerator",
                label: "Caption Gen",
                desc: "Perfect caption + hashtags",
                icon: <MessageSquarePlus className="w-3.5 h-3.5" />,
                gradient: "from-sky-500 to-cyan-600",
                accent: "border-sky-500/35 hover:border-sky-500/65",
            },
            {
                type: "aiRepurposer",
                label: "AI Repurposer",
                desc: "Multi-platform content engine",
                icon: <Rocket className="w-3.5 h-3.5" />,
                gradient: "from-[var(--omni)] to-purple-600",
                accent: "border-[var(--omni)]/35 hover:border-[var(--omni)]/65",
            },
        ],
    },
    {
        title: "Platforms",
        items: [
            {
                type: "platform-x",
                label: "X / Twitter",
                desc: "Thread-style posts",
                icon: <XLogo />,
                gradient: "from-zinc-700 to-zinc-900",
                accent: "border-zinc-400/35 hover:border-zinc-400/65",
            },
            {
                type: "platform-instagram",
                label: "Instagram",
                desc: "Emoji-rich captions",
                icon: <IgLogo />,
                gradient: "from-fuchsia-500 via-rose-500 to-amber-500",
                accent: "border-fuchsia-400/35 hover:border-fuchsia-400/65",
            },
            {
                type: "platform-linkedin",
                label: "LinkedIn",
                desc: "Professional narrative",
                icon: <LiLogo />,
                gradient: "from-blue-600 to-blue-700",
                accent: "border-blue-500/35 hover:border-blue-500/65",
            },
            {
                type: "platform-facebook",
                label: "Facebook",
                desc: "Community engagement",
                icon: <FbLogo />,
                gradient: "from-blue-500 to-indigo-600",
                accent: "border-indigo-400/35 hover:border-indigo-400/65",
            },
        ],
    },
];

export function NodePalette() {
    const handleDragStart = (e: React.DragEvent, nodeType: string) => {
        e.dataTransfer.setData("application/reactflow-nodetype", nodeType);
        e.dataTransfer.effectAllowed = "move";
    };

    return (
        <div
            className="
        flex flex-col gap-1.5
        p-2.5 rounded-xl
        bg-white/85 dark:bg-zinc-900/85
        backdrop-blur-xl
        border border-zinc-200 dark:border-white/10
        shadow-lg dark:shadow-black/40
        w-44
        max-h-[calc(100vh-120px)]
        overflow-y-auto
      "
            style={{ scrollbarWidth: "none" }}
        >
            {GROUPS.map((group, gi) => (
                <div key={group.title}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 px-1 mb-1 mt-1">
                        {group.title}
                    </p>
                    <div className="space-y-1">
                        {group.items.map((item) => (
                            <div
                                key={item.type}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item.type)}
                                title={item.desc}
                                className={`
                  flex items-center gap-2 px-2 py-1.5 rounded-lg
                  bg-zinc-50/80 dark:bg-zinc-800/40
                  border ${item.accent}
                  border
                  text-zinc-700 dark:text-zinc-300
                  transition-all duration-150
                  cursor-grab active:cursor-grabbing active:scale-95
                  select-none group
                `}
                            >
                                <span
                                    className={`
                    flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0
                    bg-gradient-to-br ${item.gradient} text-white
                    shadow-sm group-hover:shadow-md transition-shadow
                  `}
                                >
                                    {item.icon}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200 leading-none truncate">
                                        {item.label}
                                    </p>
                                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5 truncate">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider between groups */}
                    {gi < GROUPS.length - 1 && (
                        <div className="mt-2 border-t border-zinc-200 dark:border-white/6" />
                    )}
                </div>
            ))}
        </div>
    );
}
