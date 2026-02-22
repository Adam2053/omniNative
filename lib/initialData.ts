import type { Node, Edge } from "@xyflow/react";
import type {
    RawIdeaNodeData,
    PostMakerNodeData,
    MediaAttachmentNodeData,
    IdeaPolisherNodeData,
    CaptionGeneratorNodeData,
    AIRepurposerNodeData,
    PlatformNodeData,
} from "@/types/workflow";

export const initialNodes: Node[] = [
    // ── Creative: Raw Idea ────────────────────────────────────
    {
        id: "raw-idea-1",
        type: "rawIdea",
        position: { x: 40, y: 140 },
        data: {
            label: "Raw Idea",
            ideaText: "How to build a 6-figure SaaS in 2025 as a solo founder using AI tools and no-code platforms",
            topic: "SaaS Growth",
            intent: "educate",
        } as RawIdeaNodeData,
    },

    // ── Creative: Media Attachment ────────────────────────────
    {
        id: "media-1",
        type: "mediaAttachment",
        position: { x: 40, y: 440 },
        data: {
            label: "Media Attachment",
            fileName: "",
            mediaType: "none",
            altText: "Dashboard screenshot showing MRR growth chart from $0 to $10k/mo in 6 months",
            mood: "professional",
        } as MediaAttachmentNodeData,
    },

    // ── AI: Idea Polisher ─────────────────────────────────────
    {
        id: "polisher-1",
        type: "ideaPolisher",
        position: { x: 380, y: 60 },
        data: {
            label: "Idea Polisher",
            polishMode: "storytelling",
            selectedAngleId: null,
            angles: [],
            isRunning: false,
        } as IdeaPolisherNodeData,
    },

    // ── AI: AI Repurposer ─────────────────────────────────────
    {
        id: "repurposer-1",
        type: "aiRepurposer",
        position: { x: 380, y: 360 },
        data: {
            label: "AI Repurposer",
            isRunning: false,
            platforms: {
                x: { enabled: true, strategy: "Thread format", generatedPost: "" },
                linkedin: { enabled: true, strategy: "Professional narrative", generatedPost: "" },
                instagram: { enabled: true, strategy: "Viral caption", generatedPost: "" },
                facebook: { enabled: false, strategy: "Community engagement", generatedPost: "" },
            },
        } as AIRepurposerNodeData,
    },

    // ── Platform Outputs ──────────────────────────────────────
    {
        id: "platform-x",
        type: "platform",
        position: { x: 760, y: 60 },
        data: {
            label: "X / Twitter",
            platform: "x",
            status: "idle",
            generatedContent: "",
        } as PlatformNodeData,
    },
    {
        id: "platform-linkedin",
        type: "platform",
        position: { x: 760, y: 250 },
        data: {
            label: "LinkedIn",
            platform: "linkedin",
            status: "idle",
            generatedContent: "",
        } as PlatformNodeData,
    },
    {
        id: "platform-instagram",
        type: "platform",
        position: { x: 760, y: 440 },
        data: {
            label: "Instagram",
            platform: "instagram",
            status: "idle",
            generatedContent: "",
        } as PlatformNodeData,
    },
];

export const initialEdges: Edge[] = [
    // Raw Idea → Idea Polisher
    {
        id: "e-rawIdea-polisher",
        source: "raw-idea-1",
        target: "polisher-1",
        animated: false,
        style: { strokeWidth: 2 },
    },
    // Raw Idea → AI Repurposer
    {
        id: "e-rawIdea-repurposer",
        source: "raw-idea-1",
        target: "repurposer-1",
        animated: false,
        style: { strokeWidth: 2 },
    },
    // Media → AI Repurposer
    {
        id: "e-media-repurposer",
        source: "media-1",
        target: "repurposer-1",
        animated: false,
        style: { strokeWidth: 2 },
    },
    // Idea Polisher → X
    {
        id: "e-polisher-x",
        source: "polisher-1",
        target: "platform-x",
        animated: false,
        style: { strokeWidth: 2 },
    },
    // AI Repurposer → LinkedIn
    {
        id: "e-repurposer-linkedin",
        source: "repurposer-1",
        target: "platform-linkedin",
        animated: false,
        style: { strokeWidth: 2 },
    },
    // AI Repurposer → Instagram
    {
        id: "e-repurposer-instagram",
        source: "repurposer-1",
        target: "platform-instagram",
        animated: false,
        style: { strokeWidth: 2 },
    },
];
