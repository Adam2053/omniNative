"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    BackgroundVariant,
    NodeToolbar,
    type Connection,
    type Edge,
    type Node,
    type NodeProps,
    Panel,
    Position,
    useReactFlow,
    ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Trash2, GitMerge } from "lucide-react";

// Node components
import { RawIdeaNode } from "@/components/nodes/RawIdeaNode";
import { PostMakerNode } from "@/components/nodes/PostMakerNode";
import { MediaAttachmentNode } from "@/components/nodes/MediaAttachmentNode";
import { IdeaPolisherNode } from "@/components/nodes/IdeaPolisherNode";
import { CaptionGeneratorNode } from "@/components/nodes/CaptionGeneratorNode";
import { AIRepurposerNode } from "@/components/nodes/AIRepurposerNode";
import { PlatformNode } from "@/components/nodes/PlatformNode";
import { GeneratePostNode } from "@/components/nodes/GeneratePostNode";
import { NodePalette } from "@/components/canvas/NodePalette";
import { DeletableEdge } from "@/components/canvas/DeletableEdge";

import { initialNodes, initialEdges } from "@/lib/initialData";

import type {
    RawIdeaNodeData, PostMakerNodeData, MediaAttachmentNodeData,
    IdeaPolisherNodeData, CaptionGeneratorNodeData, AIRepurposerNodeData,
    PlatformNodeData, GeneratePostNodeData,
} from "@/types/workflow";

/* ── Node delete toolbar HOC ──────────────────────────────────── */
function withDeleteButton<T extends NodeProps>(Component: React.ComponentType<T>) {
    function WrappedNode(props: T) {
        const { setNodes, setEdges } = useReactFlow();
        const deleteNode = useCallback(() => {
            setEdges((eds) => eds.filter((e) => e.source !== props.id && e.target !== props.id));
            setNodes((nds) => nds.filter((n) => n.id !== props.id));
        }, [props.id, setNodes, setEdges]);
        return (
            <>
                <NodeToolbar isVisible={props.selected} position={Position.Top} offset={8}>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={deleteNode}
                        className="
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
              bg-rose-500 hover:bg-rose-400 text-white text-[11px] font-bold
              border border-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]
              transition-all duration-150 cursor-pointer
            "
                        title="Delete node (Del)"
                    >
                        <Trash2 className="w-3 h-3" />
                        Delete
                    </motion.button>
                </NodeToolbar>
                <Component {...props} />
            </>
        );
    }
    WrappedNode.displayName = `WithDelete(${Component.displayName ?? Component.name})`;
    return WrappedNode;
}

/* ── Default node data ────────────────────────────────────────── */
const DEFAULT_NODE_DATA: Record<string, unknown> = {
    rawIdea: {
        label: "Raw Idea", ideaText: "", topic: "", intent: "educate", targetPlatform: "both",
    } as RawIdeaNodeData,

    postMaker: {
        label: "Post Maker", postText: "", hashtags: "", cta: "", postType: "text", targetPlatform: "both",
    } as PostMakerNodeData,

    mediaAttachment: {
        label: "Media Attachment", fileName: "", mediaType: "none", altText: "", mood: "vibrant",
    } as MediaAttachmentNodeData,

    ideaPolisher: {
        label: "Idea Polisher", polishMode: "storytelling", selectedAngleId: null,
        angles: [], isRunning: false, targetPlatform: "both",
    } as IdeaPolisherNodeData,

    captionGenerator: {
        label: "Caption Generator", captionStyle: "hook", emojiUsage: "minimal",
        hashtagCount: 5, generatedCaption: "", isRunning: false, targetPlatform: "both",
    } as CaptionGeneratorNodeData,

    aiRepurposer: {
        label: "AI Repurposer", isRunning: false, activePreviewTab: null,
        platforms: {
            x: { enabled: true, strategy: "Thread format", generatedPost: "", editedPost: "", status: "idle" },
            instagram: { enabled: true, strategy: "Viral caption", generatedPost: "", editedPost: "", status: "idle" },
            linkedin: { enabled: false, strategy: "Professional narrative", generatedPost: "", editedPost: "", status: "idle" },
            facebook: { enabled: false, strategy: "Community engagement", generatedPost: "", editedPost: "", status: "idle" },
            reddit: { enabled: false, strategy: "Community post", generatedPost: "", editedPost: "", status: "idle" },
        },
    } as AIRepurposerNodeData,

    // Generate Post defaults — starts with null platform (shows picker)
    generatePost: {
        label: "Generate Post", platform: null, pendingPlatform: true,
        igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: true,
        xTweetText: "", xUseThread: false, xThreadParts: [],
        generalText: "", status: "idle", generatedPost: "", charCount: 0,
    } as GeneratePostNodeData,

    // Pre-configured generate post variants (from palette)
    "generatePost-instagram": {
        label: "Instagram Post", platform: "instagram", pendingPlatform: false,
        igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: true,
        xTweetText: "", xUseThread: false, xThreadParts: [],
        generalText: "", status: "idle", generatedPost: "", charCount: 0,
    } as GeneratePostNodeData,

    "generatePost-x": {
        label: "X / Twitter Post", platform: "x", pendingPlatform: false,
        igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: false,
        xTweetText: "", xUseThread: false, xThreadParts: [],
        generalText: "", status: "idle", generatedPost: "", charCount: 0,
    } as GeneratePostNodeData,

    "generatePost-general": {
        label: "General Post", platform: "general", pendingPlatform: false,
        igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: false,
        xTweetText: "", xUseThread: false, xThreadParts: [],
        generalText: "", status: "idle", generatedPost: "", charCount: 0,
    } as GeneratePostNodeData,

    "generatePost-linkedin": {
        label: "LinkedIn Post", platform: "linkedin", pendingPlatform: false,
        igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: false,
        xTweetText: "", xUseThread: false, xThreadParts: [],
        generalText: "", status: "idle", generatedPost: "", charCount: 0,
    } as GeneratePostNodeData,

    "generatePost-facebook": {
        label: "Facebook Post", platform: "facebook", pendingPlatform: false,
        igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: false,
        xTweetText: "", xUseThread: false, xThreadParts: [],
        generalText: "", status: "idle", generatedPost: "", charCount: 0,
    } as GeneratePostNodeData,

    "generatePost-reddit": {
        label: "Reddit Post", platform: "reddit", pendingPlatform: false,
        igCaption: "", igHashtags: "", igPostType: "feed", igAspectRatio: "1:1", igImageRequired: false,
        xTweetText: "", xUseThread: false, xThreadParts: [],
        generalText: "", status: "idle", generatedPost: "", charCount: 0,
    } as GeneratePostNodeData,

    // Platform output nodes
    platform: { label: "X / Twitter", platform: "x", status: "idle", generatedContent: "" } as PlatformNodeData,
    "platform-x": { label: "X / Twitter", platform: "x", status: "idle", generatedContent: "" } as PlatformNodeData,
    "platform-instagram": { label: "Instagram", platform: "instagram", status: "idle", generatedContent: "" } as PlatformNodeData,
    "platform-linkedin": { label: "LinkedIn", platform: "linkedin", status: "idle", generatedContent: "" } as PlatformNodeData,
    "platform-facebook": { label: "Facebook", platform: "facebook", status: "idle", generatedContent: "" } as PlatformNodeData,
    "platform-reddit": { label: "Reddit", platform: "reddit", status: "idle", generatedContent: "" } as PlatformNodeData,
};

/* ── Node type registry ───────────────────────────────────────── */
const nodeTypes = {
    rawIdea: withDeleteButton(RawIdeaNode as React.ComponentType<NodeProps>),
    postMaker: withDeleteButton(PostMakerNode as React.ComponentType<NodeProps>),
    mediaAttachment: withDeleteButton(MediaAttachmentNode as React.ComponentType<NodeProps>),
    ideaPolisher: withDeleteButton(IdeaPolisherNode as React.ComponentType<NodeProps>),
    captionGenerator: withDeleteButton(CaptionGeneratorNode as React.ComponentType<NodeProps>),
    aiRepurposer: withDeleteButton(AIRepurposerNode as React.ComponentType<NodeProps>),
    platform: withDeleteButton(PlatformNode as React.ComponentType<NodeProps>),
    generatePost: withDeleteButton(GeneratePostNode as React.ComponentType<NodeProps>),
};

const edgeTypes = { deletable: DeletableEdge };

let nodeIdCounter = 100;
const genId = () => `node-${++nodeIdCounter}`;

/* ─────────────────────────────────────────────────────────────────
   SNAP-BETWEEN CONFIG
   ─────────────────────────────────────────────────────────────────*/
const INSERTABLE_TYPES = new Set(["ideaPolisher", "captionGenerator", "aiRepurposer", "generatePost"]);
const SNAP_RADIUS = 100;

const NODE_DIMS: Record<string, [number, number]> = {
    rawIdea: [256, 310], postMaker: [272, 340], mediaAttachment: [256, 310],
    ideaPolisher: [288, 300], captionGenerator: [272, 420], aiRepurposer: [320, 360],
    platform: [208, 100], generatePost: [288, 380],
};

function nodeDims(type: string | undefined): [number, number] {
    return NODE_DIMS[type ?? ""] ?? [260, 280];
}
function nodeCenter(n: Node): [number, number] {
    const [w, h] = nodeDims(n.type);
    return [n.position.x + w / 2, n.position.y + h / 2];
}
function edgeMidpoint(src: Node, tgt: Node): [number, number] {
    const [sw, sh] = nodeDims(src.type);
    const [, th] = nodeDims(tgt.type);
    return [
        (src.position.x + sw + tgt.position.x) / 2,
        (src.position.y + sh / 2 + tgt.position.y + th / 2) / 2,
    ];
}

/* ── Drop type resolver ──────────────────────── */
function resolveDropType(rawType: string): { nodeType: string; dataKey: string } {
    if (rawType.startsWith("platform-")) return { nodeType: "platform", dataKey: rawType };
    if (rawType.startsWith("generatePost-")) return { nodeType: "generatePost", dataKey: rawType };
    return { nodeType: rawType, dataKey: rawType };
}

/* ── CanvasInner ──────────────────────────────────────────────── */
interface CanvasInnerProps {
    runTrigger: number;
    onRunComplete: () => void;
    snapToGrid: boolean;
}

function CanvasInner({ runTrigger, onRunComplete, snapToGrid }: CanvasInnerProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [showTip, setShowTip] = useState(true);
    const [paletteOpen, setPaletteOpen] = useState(true);
    const [snapCandidateEdgeId, setSnapCandidateEdgeId] = useState<string | null>(null);
    const [snapToast, setSnapToast] = useState(false);
    const snapToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition, getNodes, getEdges } = useReactFlow();

    /* ── Connect ────────────────────────────────────────────────── */
    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) => addEdge({ ...params, type: "deletable", animated: false, style: { strokeWidth: 2 } }, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    /* ── Drop → spawn ───────────────────────────────────────────── */
    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const rawType = e.dataTransfer.getData("application/reactflow-nodetype");
            if (!rawType) return;
            const { nodeType, dataKey } = resolveDropType(rawType);
            const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
            const newNode: Node = {
                id: genId(),
                type: nodeType,
                position,
                data: { ...(DEFAULT_NODE_DATA[dataKey] ?? DEFAULT_NODE_DATA[nodeType] ?? { label: nodeType }) },
            };
            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition, setNodes]
    );

    /* ── Snap-between: live highlight ──────────────────────────── */
    const onNodeDrag = useCallback(
        (_: React.MouseEvent, draggedNode: Node) => {
            if (!INSERTABLE_TYPES.has(draggedNode.type ?? "")) {
                if (snapCandidateEdgeId) setSnapCandidateEdgeId(null);
                return;
            }
            const [dCX, dCY] = nodeCenter(draggedNode);
            const nodeMap = new Map(getNodes().map((n) => [n.id, n]));
            let bestId: string | null = null, bestDist = Infinity;
            for (const edge of getEdges()) {
                if (edge.source === draggedNode.id || edge.target === draggedNode.id) continue;
                const src = nodeMap.get(edge.source), tgt = nodeMap.get(edge.target);
                if (!src || !tgt) continue;
                const [mx, my] = edgeMidpoint(src, tgt);
                const dist = Math.hypot(dCX - mx, dCY - my);
                if (dist < SNAP_RADIUS && dist < bestDist) { bestDist = dist; bestId = edge.id; }
            }
            if (bestId !== snapCandidateEdgeId) setSnapCandidateEdgeId(bestId);
        },
        [snapCandidateEdgeId, getNodes, getEdges]
    );

    /* ── Snap-between: execute on drag stop ─────────────────────── */
    const onNodeDragStop = useCallback(
        (_: React.MouseEvent, draggedNode: Node) => {
            setSnapCandidateEdgeId(null);
            if (!INSERTABLE_TYPES.has(draggedNode.type ?? "")) return;

            const [dCX, dCY] = nodeCenter(draggedNode);
            const nodeMap = new Map(getNodes().map((n) => [n.id, n]));
            let edgeToSplit: Edge | null = null, srcNode: Node | null = null, tgtNode: Node | null = null, bestDist = Infinity;

            for (const edge of getEdges()) {
                if (edge.source === draggedNode.id || edge.target === draggedNode.id) continue;
                const src = nodeMap.get(edge.source), tgt = nodeMap.get(edge.target);
                if (!src || !tgt) continue;
                const [mx, my] = edgeMidpoint(src, tgt);
                const dist = Math.hypot(dCX - mx, dCY - my);
                if (dist < SNAP_RADIUS && dist < bestDist) { bestDist = dist; edgeToSplit = edge; srcNode = src; tgtNode = tgt; }
            }
            if (!edgeToSplit || !srcNode || !tgtNode) return;

            const [midX, midY] = edgeMidpoint(srcNode, tgtNode);
            const [dw, dh] = nodeDims(draggedNode.type);
            setNodes((nds) => nds.map((n) => n.id === draggedNode.id ? { ...n, position: { x: midX - dw / 2, y: midY - dh / 2 } } : n));

            const splitId = edgeToSplit.id;
            setEdges((eds) => [
                ...eds.filter((e) => e.id !== splitId),
                { id: `e-${srcNode!.id}→${draggedNode.id}`, source: srcNode!.id, target: draggedNode.id, type: "deletable", animated: false, style: { strokeWidth: 2 } },
                { id: `e-${draggedNode.id}→${tgtNode!.id}`, source: draggedNode.id, target: tgtNode!.id, type: "deletable", animated: false, style: { strokeWidth: 2 } },
            ]);

            setSnapToast(true);
            if (snapToastTimer.current) clearTimeout(snapToastTimer.current);
            snapToastTimer.current = setTimeout(() => setSnapToast(false), 2000);
        },
        [getNodes, getEdges, setNodes, setEdges]
    );

    /* ── Live edge highlight ─────────────────────────────────────── */
    const displayEdges = edges.map((e) =>
        e.id === snapCandidateEdgeId
            ? { ...e, style: { ...e.style, stroke: "var(--omni)", strokeWidth: 3, strokeDasharray: "6 3", filter: "drop-shadow(0 0 6px var(--omni))" }, animated: true }
            : e
    );

    /* ── Run workflow ────────────────────────────────────────────── */
    const runWorkflow = useCallback(() => {
        setEdges((eds) => eds.map((e: Edge) => ({ ...e, animated: true })));
        setNodes((nds: Node[]) => nds.map((n: Node) => {
            if (["ideaPolisher", "captionGenerator", "aiRepurposer"].includes(n.type ?? ""))
                return { ...n, data: { ...n.data, isRunning: true } };
            return n;
        }));
        const t1 = setTimeout(() => setNodes((nds: Node[]) => nds.map((n: Node) => n.type === "platform" ? { ...n, data: { ...n.data, status: "generating" } } : n)), 500);
        const t2 = setTimeout(() => setNodes((nds: Node[]) => nds.map((n: Node) => {
            if (n.type === "ideaPolisher") return { ...n, data: { ...n.data, isRunning: false } };
            if (n.type === "captionGenerator") return { ...n, data: { ...n.data, isRunning: false, generatedCaption: "The greatest strategy isn't going viral — it's staying consistent when nobody's watching. 🎯" } };
            return n;
        })), 1800);
        const t3 = setTimeout(() => setNodes((nds: Node[]) => nds.map((n: Node) => {
            if (n.type === "platform") return { ...n, data: { ...n.data, status: "ready" } };
            if (n.type === "aiRepurposer") return { ...n, data: { ...n.data, isRunning: false } };
            return n;
        })), 3000);
        const t4 = setTimeout(() => { setEdges((eds) => eds.map((e: Edge) => ({ ...e, animated: false }))); onRunComplete(); }, 4000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [setEdges, setNodes, onRunComplete]);

    useEffect(() => {
        if (runTrigger === 0) return;
        const cleanup = runWorkflow();
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runTrigger]);

    return (
        <div className="w-full h-full relative" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={displayEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{ type: "deletable", style: { strokeWidth: 2 } }}
                fitView
                fitViewOptions={{ padding: 0.12 }}
                minZoom={0.15}
                maxZoom={2.5}
                snapToGrid={snapToGrid}
                snapGrid={[20, 20]}
                deleteKeyCode={["Delete", "Backspace"]}
                proOptions={{ hideAttribution: true }}
                selectNodesOnDrag={false}
            >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} />
                <Controls className="!bottom-6 !left-6" showInteractive={false} />
                <MiniMap
                    className="!bottom-6 !right-6"
                    nodeColor={(n) => {
                        if (n.type === "rawIdea") return "oklch(0.6 0.25 275)";
                        if (n.type === "postMaker") return "oklch(0.6 0.2 160)";
                        if (n.type === "mediaAttachment") return "oklch(0.6 0.22 0)";
                        if (n.type === "ideaPolisher") return "oklch(0.65 0.22 70)";
                        if (n.type === "captionGenerator") return "oklch(0.65 0.2 210)";
                        if (n.type === "aiRepurposer") return "oklch(0.55 0.28 275)";
                        if (n.type === "platform") return "oklch(0.5 0.18 240)";
                        if (n.type === "generatePost") return "oklch(0.5 0.2 320)";
                        return "oklch(0.5 0 0)";
                    }}
                    maskColor="oklch(0 0 0 / 0.35)"
                    style={{ width: 140, height: 90 }}
                />

                {/* Snap indicator */}
                <Panel position="bottom-center" className="!bottom-6 !mb-16">
                    <AnimatePresence>
                        {snapCandidateEdgeId && (
                            <motion.div key="snap-hint" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--omni)] text-white text-xs font-bold shadow-[0_0_20px_var(--omni-glow)]">
                                <GitMerge className="w-3.5 h-3.5" />
                                Release to insert between nodes
                            </motion.div>
                        )}
                        {snapToast && !snapCandidateEdgeId && (
                            <motion.div key="snap-toast" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(52,211,153,0.5)]">
                                <GitMerge className="w-3.5 h-3.5" />
                                ✓ Node inserted between connections
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Panel>

                {/* Tip */}
                <Panel position="bottom-center" className="!bottom-20">
                    <AnimatePresence>
                        {showTip && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-md text-xs text-zinc-500 dark:text-zinc-400">
                                <Info className="w-3.5 h-3.5 flex-shrink-0 text-[var(--omni)]" />
                                <span>
                                    Drag from left panel to add nodes •{" "}
                                    <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-[10px]">Del</kbd>{" "}
                                    to delete • Drag a node onto an edge to insert between nodes
                                </span>
                                <button onClick={() => setShowTip(false)} className="ml-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer">✕</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Panel>
            </ReactFlow>

            {/* ─── Node Palette — rendered outside <ReactFlow> so scroll works natively ─── */}
            <div
                style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    pointerEvents: "all",
                }}
            >
                <NodePalette open={paletteOpen} onToggle={() => setPaletteOpen((o) => !o)} />
            </div>
        </div>
    );
}

interface WorkflowCanvasProps {
    runTrigger: number;
    onRunComplete: () => void;
    snapToGrid: boolean;
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
    return (
        <ReactFlowProvider>
            <CanvasInner {...props} />
        </ReactFlowProvider>
    );
}
