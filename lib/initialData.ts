import type { Node, Edge } from "@xyflow/react";
import type {
    RawIdeaNodeData,
    PostMakerNodeData,
    MediaAttachmentNodeData,
    IdeaPolisherNodeData,
    CaptionGeneratorNodeData,
    AIRepurposerNodeData,
    GeneratePostNodeData,
    PlatformNodeData,
} from "@/types/workflow";

// ─────────────────────────────────────────────────────────────────────────────
//  FLOW A — Quick Post (Existing Content → AI Repurposer → Platforms)
//           X position: 80–900, Y: 60–200
//  Demonstrates: Post Maker + Caption Gen → AI Repurposer → Instagram + Twitter
// ─────────────────────────────────────────────────────────────────────────────

const FLOW_A_NODES: Node[] = [
    {
        id: "a-post",
        type: "postMaker",
        position: { x: 80, y: 80 },
        data: {
            label: "Post Maker",
            postText: "I spent 12 months building in public with zero audience. Here's the uncomfortable truth about what actually gets you followers — it's not what the gurus say.",
            hashtags: "#buildinpublic, #founders, #solopreneur",
            cta: "Follow for weekly SaaS insights",
            postType: "text",
            targetPlatform: "both",
        } as PostMakerNodeData,
    },
    {
        id: "a-caption",
        type: "captionGenerator",
        position: { x: 430, y: 60 },
        data: {
            label: "Caption Generator",
            captionStyle: "hook",
            emojiUsage: "minimal",
            hashtagCount: 5,
            generatedCaption: "",
            isRunning: false,
            targetPlatform: "both",
        } as CaptionGeneratorNodeData,
    },
    {
        id: "a-repurposer",
        type: "aiRepurposer",
        position: { x: 780, y: 60 },
        data: {
            label: "AI Repurposer",
            isRunning: false,
            activePreviewTab: null,
            platforms: {
                x: { enabled: true, strategy: "Thread format", generatedPost: "", editedPost: "", status: "idle" },
                instagram: { enabled: true, strategy: "Viral caption", generatedPost: "", editedPost: "", status: "idle" },
                linkedin: { enabled: false, strategy: "Professional narrative", generatedPost: "", editedPost: "", status: "idle" },
                facebook: { enabled: false, strategy: "Community engagement", generatedPost: "", editedPost: "", status: "idle" },
            },
        } as AIRepurposerNodeData,
    },
    {
        id: "a-out-x",
        type: "platform",
        position: { x: 1160, y: 60 },
        data: { label: "X / Twitter", platform: "x", status: "idle", generatedContent: "" } as PlatformNodeData,
    },
    {
        id: "a-out-ig",
        type: "platform",
        position: { x: 1160, y: 200 },
        data: { label: "Instagram", platform: "instagram", status: "idle", generatedContent: "" } as PlatformNodeData,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
//  FLOW B — AI Assisted (Raw Idea → Polisher → Post Maker → Caption → Repurposer)
//           Y: 420–700
//  Demonstrates full raw idea → multi-platform pipeline
// ─────────────────────────────────────────────────────────────────────────────

const FLOW_B_NODES: Node[] = [
    {
        id: "b-idea",
        type: "rawIdea",
        position: { x: 80, y: 440 },
        data: {
            label: "Raw Idea",
            ideaText: "How to build a 6-figure SaaS in 2025 as a solo founder using AI tools and no-code platforms",
            topic: "SaaS Growth",
            intent: "educate",
            targetPlatform: "both",
        } as RawIdeaNodeData,
    },
    {
        id: "b-media",
        type: "mediaAttachment",
        position: { x: 80, y: 760 },
        data: {
            label: "Media Attachment",
            fileName: "",
            mediaType: "image",
            altText: "Dashboard screenshot showing MRR growth from $0 to $10k/mo in 6 months",
            mood: "professional",
        } as MediaAttachmentNodeData,
    },
    {
        id: "b-polisher",
        type: "ideaPolisher",
        position: { x: 430, y: 420 },
        data: {
            label: "Idea Polisher",
            polishMode: "storytelling",
            selectedAngleId: null,
            angles: [],
            isRunning: false,
            targetPlatform: "both",
        } as IdeaPolisherNodeData,
    },
    {
        id: "b-post",
        type: "postMaker",
        position: { x: 430, y: 740 },
        data: {
            label: "Post Maker",
            postText: "",
            hashtags: "#saas, #solopreneur, #aitools",
            cta: "DM me 'SaaS' for the full breakdown",
            postType: "text+media",
            targetPlatform: "both",
        } as PostMakerNodeData,
    },
    {
        id: "b-caption",
        type: "captionGenerator",
        position: { x: 780, y: 560 },
        data: {
            label: "Caption Generator",
            captionStyle: "storytelling",
            emojiUsage: "heavy",
            hashtagCount: 10,
            generatedCaption: "",
            isRunning: false,
            targetPlatform: "both",
        } as CaptionGeneratorNodeData,
    },
    {
        id: "b-repurposer",
        type: "aiRepurposer",
        position: { x: 1160, y: 540 },
        data: {
            label: "AI Repurposer",
            isRunning: false,
            activePreviewTab: null,
            platforms: {
                x: { enabled: true, strategy: "Thread format", generatedPost: "", editedPost: "", status: "idle" },
                instagram: { enabled: true, strategy: "Viral caption", generatedPost: "", editedPost: "", status: "idle" },
                linkedin: { enabled: false, strategy: "Professional narrative", generatedPost: "", editedPost: "", status: "idle" },
                facebook: { enabled: false, strategy: "Community engagement", generatedPost: "", editedPost: "", status: "idle" },
            },
        } as AIRepurposerNodeData,
    },
    {
        id: "b-out-x",
        type: "platform",
        position: { x: 1520, y: 500 },
        data: { label: "X / Twitter", platform: "x", status: "idle", generatedContent: "" } as PlatformNodeData,
    },
    {
        id: "b-out-ig",
        type: "platform",
        position: { x: 1520, y: 640 },
        data: { label: "Instagram", platform: "instagram", status: "idle", generatedContent: "" } as PlatformNodeData,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
//  FLOW C — Direct Generate Post (No AI Repurposer)
//           Y: 1020–1140
//  Demonstrates: Post Maker → Generate Post (Instagram/Twitter) → Platform Output
// ─────────────────────────────────────────────────────────────────────────────

const FLOW_C_NODES: Node[] = [
    {
        id: "c-post",
        type: "postMaker",
        position: { x: 80, y: 1040 },
        data: {
            label: "Post Maker",
            postText: "The #1 mistake solo founders make is building for everyone. Niche down until it feels uncomfortable. Then go further.",
            hashtags: "#founder, #startup",
            cta: "Comment your niche below",
            postType: "text",
            targetPlatform: "both",
        } as PostMakerNodeData,
    },
    {
        id: "c-gen-ig",
        type: "generatePost",
        position: { x: 430, y: 1020 },
        data: {
            label: "Instagram Post",
            platform: "instagram",
            pendingPlatform: false,
            igCaption: "The #1 mistake solo founders make is building for everyone.\n\nNiche down until it feels uncomfortable.\n\nThen go further. 🎯\n\nThe creators winning right now aren't the most talented — they're the most specific.",
            igHashtags: "#founder, #startup, #solopreneur, #buildinpublic, #entrepreneurship",
            igPostType: "feed",
            igAspectRatio: "1:1",
            igImageRequired: true,
            xTweetText: "", xUseThread: false, xThreadParts: [],
            generalText: "", status: "idle", generatedPost: "", charCount: 0,
        } as GeneratePostNodeData,
    },
    {
        id: "c-gen-x",
        type: "generatePost",
        position: { x: 430, y: 1140 },
        data: {
            label: "X / Twitter Post",
            platform: "x",
            pendingPlatform: false,
            igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: false,
            xTweetText: "The #1 mistake solo founders make: building for everyone.\n\nNiche down until it feels uncomfortable.\n\nThen go further. 🎯",
            xUseThread: false, xThreadParts: [],
            generalText: "", status: "idle", generatedPost: "", charCount: 0,
        } as GeneratePostNodeData,
    },
    {
        id: "c-out-ig",
        type: "platform",
        position: { x: 800, y: 1020 },
        data: { label: "Instagram", platform: "instagram", status: "idle", generatedContent: "" } as PlatformNodeData,
    },
    {
        id: "c-out-x",
        type: "platform",
        position: { x: 800, y: 1140 },
        data: { label: "X / Twitter", platform: "x", status: "idle", generatedContent: "" } as PlatformNodeData,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
//  All nodes & edges combined
// ─────────────────────────────────────────────────────────────────────────────

export const initialNodes: Node[] = [
    ...FLOW_A_NODES,
    ...FLOW_B_NODES,
    ...FLOW_C_NODES,
];

export const initialEdges: Edge[] = [
    // ── Flow A ──────────────────────────────
    { id: "ea-post-caption", source: "a-post", target: "a-caption", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "ea-caption-repurposer", source: "a-caption", target: "a-repurposer", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "ea-repurposer-x", source: "a-repurposer", target: "a-out-x", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "ea-repurposer-ig", source: "a-repurposer", target: "a-out-ig", type: "deletable", animated: false, style: { strokeWidth: 2 } },

    // ── Flow B ──────────────────────────────
    { id: "eb-idea-polisher", source: "b-idea", target: "b-polisher", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "eb-polisher-post", source: "b-polisher", target: "b-post", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "eb-media-post", source: "b-media", target: "b-post", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "eb-post-caption", source: "b-post", target: "b-caption", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "eb-caption-repurposer", source: "b-caption", target: "b-repurposer", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "eb-repurposer-x", source: "b-repurposer", target: "b-out-x", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "eb-repurposer-ig", source: "b-repurposer", target: "b-out-ig", type: "deletable", animated: false, style: { strokeWidth: 2 } },

    // ── Flow C ──────────────────────────────
    { id: "ec-post-gen-ig", source: "c-post", target: "c-gen-ig", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "ec-post-gen-x", source: "c-post", target: "c-gen-x", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "ec-gen-ig-out", source: "c-gen-ig", target: "c-out-ig", type: "deletable", animated: false, style: { strokeWidth: 2 } },
    { id: "ec-gen-x-out", source: "c-gen-x", target: "c-out-x", type: "deletable", animated: false, style: { strokeWidth: 2 } },
];
