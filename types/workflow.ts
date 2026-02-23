// ─────────────────────────────────────────────
// OmniNative Workflow — TypeScript Types (v3)
// ─────────────────────────────────────────────

// ── Shared ────────────────────────────────────
export type NodeStatus = "idle" | "generating" | "ready";
export type PlatformType = "x" | "instagram" | "facebook" | "linkedin" | "reddit";
export type TargetPlatform = "both" | "instagram" | "x";   // content-node targeting

// ── Platform character limits ─────────────────
export const PLATFORM_LIMITS = {
    x: {
        caption: 280,
        hashtags: 0,     // no hashtag limit but convention is 1-2
        images: 4,
        label: "X / Twitter",
    },
    instagram: {
        caption: 2200,
        hashtags: 30,
        images: 10,
        label: "Instagram",
    },
    facebook: {
        caption: 63206,
        hashtags: 30,
        images: 10,
        label: "Facebook",
    },
    linkedin: {
        caption: 3000,
        hashtags: 30,
        images: 9,
        label: "LinkedIn",
    },
    reddit: {
        caption: 40000,
        hashtags: 0,
        images: 20,
        label: "Reddit",
    },
} as const;

// ── Creative Nodes ────────────────────────────
export type IntentType = "inspire" | "educate" | "entertain" | "sell";
export interface RawIdeaNodeData {
    label: string;
    ideaText: string;
    topic: string;
    intent: IntentType;
    targetPlatform: TargetPlatform;
    [key: string]: unknown;
}

export type PostType = "text" | "text+media" | "carousel" | "reel" | "story";
export interface PostMakerNodeData {
    label: string;
    postText: string;
    hashtags: string;
    cta: string;
    postType: PostType;
    targetPlatform: TargetPlatform;
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
    targetPlatform: TargetPlatform;
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
    targetPlatform: TargetPlatform;
    [key: string]: unknown;
}

// Per-platform post state in AI Repurposer
export type RepurposerPostStatus = "idle" | "draft" | "confirmed";
export type RepurposerPlatformConfig = {
    enabled: boolean;
    strategy: string;
    generatedPost: string;
    editedPost: string;     // user edits on top of generated
    status: RepurposerPostStatus;
};
export interface AIRepurposerNodeData {
    label: string;
    platforms: Record<PlatformType, RepurposerPlatformConfig>;
    isRunning: boolean;
    activePreviewTab: PlatformType | null;  // which platform tab is open
    [key: string]: unknown;
}

// ── Generate Post Node ────────────────────────
export type GeneratePostPlatform = "instagram" | "x" | "general" | "linkedin" | "facebook" | "reddit";
export type GeneratePostStatus = "idle" | "ready" | "confirmed";

// Instagram-specific fields
export type IGPostType = "feed" | "reel" | "story" | "carousel";
export type IGAspectRatio = "1:1" | "4:5" | "9:16" | "1.91:1";

// Twitter-specific fields
export interface GeneratePostNodeData {
    label: string;
    platform: GeneratePostPlatform | null;  // null = picker shown
    pendingPlatform: boolean;

    // ── Instagram fields ──
    igCaption: string;        // max 2200 chars
    igHashtags: string;       // comma-separated, max 30
    igPostType: IGPostType;
    igAspectRatio: IGAspectRatio;
    igImageRequired: boolean;

    // ── Twitter fields ──
    xTweetText: string;       // max 280 chars
    xUseThread: boolean;
    xThreadParts: string[];   // generated when > 280

    // ── General fields ──
    generalText: string;      // platform-agnostic content

    // ── State ──
    status: GeneratePostStatus;
    generatedPost: string;    // final formatted post
    charCount: number;        // current relevant char count
    [key: string]: unknown;
}

// ── Platform Output Nodes ─────────────────────
export interface PlatformNodeData {
    label: string;
    platform: PlatformType;
    status: NodeStatus;
    generatedContent: string;
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
    | GeneratePostNodeData
    | PlatformNodeData;

// ── Palette item definition ───────────────────
export interface PaletteItem {
    type: string;
    label: string;
    group: "creative" | "ai" | "finalize" | "output";
    description: string;
    gradient: string;
    iconName: string;
}
