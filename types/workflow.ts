// ─────────────────────────────────────────────
// OmniNative Workflow — TypeScript Types (v2)
// ─────────────────────────────────────────────

// ── Shared base ──────────────────────────────
export type NodeStatus = "idle" | "generating" | "ready";
export type PlatformType = "x" | "instagram" | "facebook" | "linkedin";

// ── Creative Nodes ────────────────────────────

export type IntentType = "inspire" | "educate" | "entertain" | "sell";
export interface RawIdeaNodeData {
    label: string;
    ideaText: string;
    topic: string;
    intent: IntentType;
    [key: string]: unknown;
}

export type PostType = "text" | "text+media" | "carousel";
export interface PostMakerNodeData {
    label: string;
    postText: string;
    hashtags: string;
    cta: string;
    postType: PostType;
    [key: string]: unknown;
}

export type MediaMood = "minimal" | "vibrant" | "professional" | "raw";
export interface MediaAttachmentNodeData {
    label: string;
    fileName: string;
    mediaType: "image" | "video" | "gif" | "none";
    altText: string;
    mood: MediaMood;
    [key: string]: unknown;
}

// ── AI Helper Nodes ───────────────────────────

export type PolishMode = "trendjacking" | "storytelling" | "data-backed" | "controversial";
export type PolishedAngle = { id: string; title: string; body: string };
export interface IdeaPolisherNodeData {
    label: string;
    polishMode: PolishMode;
    selectedAngleId: string | null;
    angles: PolishedAngle[];
    isRunning: boolean;
    [key: string]: unknown;
}

export type CaptionStyle = "hook" | "question" | "bold" | "storytelling";
export type EmojiUsage = "none" | "minimal" | "heavy";
export interface CaptionGeneratorNodeData {
    label: string;
    captionStyle: CaptionStyle;
    emojiUsage: EmojiUsage;
    hashtagCount: number;
    generatedCaption: string;
    isRunning: boolean;
    [key: string]: unknown;
}

export type RepurposerPlatformConfig = {
    enabled: boolean;
    strategy: string;
    generatedPost: string;
};
export interface AIRepurposerNodeData {
    label: string;
    platforms: Record<PlatformType, RepurposerPlatformConfig>;
    isRunning: boolean;
    [key: string]: unknown;
}

// ── Platform Output Nodes ─────────────────────
export interface PlatformNodeData {
    label: string;
    platform: PlatformType;
    status: NodeStatus;
    generatedContent: string;
    pendingPlatform?: boolean;
    [key: string]: unknown;
}

// ── Union type for all node data ──────────────
export type WorkflowNodeData =
    | RawIdeaNodeData
    | PostMakerNodeData
    | MediaAttachmentNodeData
    | IdeaPolisherNodeData
    | CaptionGeneratorNodeData
    | AIRepurposerNodeData
    | PlatformNodeData;

// ── Palette item definition ───────────────────
export interface PaletteItem {
    type: string;
    label: string;
    group: "creative" | "ai" | "platform";
    description: string;
    gradient: string;
    iconName: string;
}
