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
import { Info, Grid3X3, Trash2 } from "lucide-react";

// Node components
import { RawIdeaNode } from "@/components/nodes/RawIdeaNode";
import { PostMakerNode } from "@/components/nodes/PostMakerNode";
import { MediaAttachmentNode } from "@/components/nodes/MediaAttachmentNode";
import { IdeaPolisherNode } from "@/components/nodes/IdeaPolisherNode";
import { CaptionGeneratorNode } from "@/components/nodes/CaptionGeneratorNode";
import { AIRepurposerNode } from "@/components/nodes/AIRepurposerNode";
import { PlatformNode } from "@/components/nodes/PlatformNode";
import { NodePalette } from "@/components/canvas/NodePalette";
import { DeletableEdge } from "@/components/canvas/DeletableEdge";

import { initialNodes, initialEdges } from "@/lib/initialData";

import type {
    RawIdeaNodeData, PostMakerNodeData, MediaAttachmentNodeData,
    IdeaPolisherNodeData, CaptionGeneratorNodeData, AIRepurposerNodeData, PlatformNodeData,
} from "@/types/workflow";

/* ── Node delete toolbar HOC ─────────────────────────────────── */
function withDeleteButton<T extends NodeProps>(Component: React.ComponentType<T>) {
    function WrappedNode(props: T) {
        const { setNodes, setEdges } = useReactFlow();

        const deleteNode = useCallback(() => {
            setEdges((eds) => eds.filter((e) => e.source !== props.id && e.target !== props.id));
            setNodes((nds) => nds.filter((n) => n.id !== props.id));
        }, [props.id, setNodes, setEdges]);

        return (
            <>
                <NodeToolbar
                    isVisible={props.selected}
                    position={Position.Top}
                    offset={8}
                >
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        onClick={deleteNode}
                        className="
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
              bg-rose-500 hover:bg-rose-400
              text-white text-[11px] font-bold
              border border-rose-400
              shadow-[0_0_12px_rgba(239,68,68,0.4)]
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

/* ── Default node data factories ─────────────────────────────── */
const DEFAULT_NODE_DATA: Record<string, unknown> = {
    rawIdea: { label: "Raw Idea", ideaText: "", topic: "", intent: "educate" } as RawIdeaNodeData,
    postMaker: { label: "Post Maker", postText: "", hashtags: "", cta: "", postType: "text" } as PostMakerNodeData,
    mediaAttachment: { label: "Media Attachment", fileName: "", mediaType: "none", altText: "", mood: "vibrant" } as MediaAttachmentNodeData,
    ideaPolisher: { label: "Idea Polisher", polishMode: "storytelling", selectedAngleId: null, angles: [], isRunning: false } as IdeaPolisherNodeData,
    captionGenerator: { label: "Caption Generator", captionStyle: "hook", emojiUsage: "minimal", hashtagCount: 5, generatedCaption: "", isRunning: false } as CaptionGeneratorNodeData,
    aiRepurposer: {
        label: "AI Repurposer", isRunning: false,
        platforms: {
            x: { enabled: true, strategy: "Thread format", generatedPost: "" },
            linkedin: { enabled: true, strategy: "Professional narrative", generatedPost: "" },
            instagram: { enabled: false, strategy: "Viral caption", generatedPost: "" },
            facebook: { enabled: false, strategy: "Community engagement", generatedPost: "" },
        },
    } as AIRepurposerNodeData,
    platform: {
        label: "X / Twitter", platform: "x", status: "idle", generatedContent: "",
    } as PlatformNodeData,
    "platform-x": {
        label: "X / Twitter", platform: "x", status: "idle", generatedContent: "",
    } as PlatformNodeData,
    "platform-instagram": {
        label: "Instagram", platform: "instagram", status: "idle", generatedContent: "",
    } as PlatformNodeData,
    "platform-linkedin": {
        label: "LinkedIn", platform: "linkedin", status: "idle", generatedContent: "",
    } as PlatformNodeData,
    "platform-facebook": {
        label: "Facebook", platform: "facebook", status: "idle", generatedContent: "",
    } as PlatformNodeData,
};

/* ── Node type registry (with delete HOC) ────────────────────── */
const nodeTypes = {
    rawIdea: withDeleteButton(RawIdeaNode as React.ComponentType<NodeProps>),
    postMaker: withDeleteButton(PostMakerNode as React.ComponentType<NodeProps>),
    mediaAttachment: withDeleteButton(MediaAttachmentNode as React.ComponentType<NodeProps>),
    ideaPolisher: withDeleteButton(IdeaPolisherNode as React.ComponentType<NodeProps>),
    captionGenerator: withDeleteButton(CaptionGeneratorNode as React.ComponentType<NodeProps>),
    aiRepurposer: withDeleteButton(AIRepurposerNode as React.ComponentType<NodeProps>),
    platform: withDeleteButton(PlatformNode as React.ComponentType<NodeProps>),
};

/* ── Edge type registry ──────────────────────────────────────── */
const edgeTypes = {
    deletable: DeletableEdge,
};

let nodeIdCounter = 100;
const genId = () => `node-${++nodeIdCounter}`;

/* ── Node width estimates for snap-between calc ──────────────── */
const NODE_WIDTH_EST: Record<string, number> = {
    rawIdea: 256, postMaker: 272, mediaAttachment: 256,
    ideaPolisher: 288, captionGenerator: 272, aiRepurposer: 320,
    platform: 192,
};
const NODE_HEIGHT_EST: Record<string, number> = {
    rawIdea: 240, postMaker: 260, mediaAttachment: 280,
    ideaPolisher: 220, captionGenerator: 320, aiRepurposer: 280,
    platform: 100,
};

interface CanvasInnerProps {
    runTrigger: number;
    onRunComplete: () => void;
    snapToGrid: boolean;
}

function CanvasInner({ runTrigger, onRunComplete, snapToGrid }: CanvasInnerProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [showTip, setShowTip] = useState(true);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();

    /* ── Connect handler ──────────────────────────────────────── */
    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) =>
                addEdge({
                    ...params,
                    type: "deletable",
                    animated: false,
                    style: { strokeWidth: 2 },
                }, eds)
            ),
        [setEdges]
    );

    /* ── Drag-over ────────────────────────────────────────────── */
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    /* ── Drop → spawn node ────────────────────────────────────── */
    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const rawType = e.dataTransfer.getData("application/reactflow-nodetype");
            if (!rawType) return;

            // platform-x / platform-instagram etc. → all use the "platform" node type
            const isPlatformVariant = rawType.startsWith("platform-");
            const nodeType = isPlatformVariant ? "platform" : rawType;

            const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

            const newNode: Node = {
                id: genId(),
                type: nodeType,
                position,
                data: { ...(DEFAULT_NODE_DATA[rawType] ?? DEFAULT_NODE_DATA[nodeType] ?? { label: nodeType }) },
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition, setNodes]
    );

    /* ── Snap-between-nodes: insert dragged node into an edge ─── */
    const onNodeDragStop = useCallback(
        (_event: React.MouseEvent, draggedNode: Node) => {
            // Only nodes with both source + target handles can be inserted
            const insertableTypes = new Set([
                "ideaPolisher", "captionGenerator", "aiRepurposer",
            ]);
            if (!insertableTypes.has(draggedNode.type ?? "")) return;

            const SNAP_RADIUS = 80;
            const dw = NODE_WIDTH_EST[draggedNode.type ?? ""] ?? 260;
            const dh = NODE_HEIGHT_EST[draggedNode.type ?? ""] ?? 240;
            const dragCX = draggedNode.position.x + dw / 2;
            const dragCY = draggedNode.position.y + dh / 2;

            // Get current snapshot of nodes+edges
            let edgeToSplit: Edge | null = null;
            let splitSource: Node | null = null;
            let splitTarget: Node | null = null;
            let minDist = Infinity;

            setNodes((currentNodes) => {
                const nodeMap = new Map(currentNodes.map((n) => [n.id, n]));

                setEdges((currentEdges) => {
                    for (const edge of currentEdges) {
                        if (edge.source === draggedNode.id || edge.target === draggedNode.id) continue;
                        const src = nodeMap.get(edge.source);
                        const tgt = nodeMap.get(edge.target);
                        if (!src || !tgt) continue;

                        const sw = NODE_WIDTH_EST[src.type ?? ""] ?? 260;
                        const sh = NODE_HEIGHT_EST[src.type ?? ""] ?? 240;
                        const tw = NODE_WIDTH_EST[tgt.type ?? ""] ?? 260;
                        const th = NODE_HEIGHT_EST[tgt.type ?? ""] ?? 240;

                        const srcCX = src.position.x + sw;   // right edge = source handle
                        const srcCY = src.position.y + sh / 2;
                        const tgtCX = tgt.position.x;         // left edge = target handle
                        const tgtCY = tgt.position.y + th / 2;

                        const midX = (srcCX + tgtCX) / 2;
                        const midY = (srcCY + tgtCY) / 2;

                        const dist = Math.hypot(dragCX - midX, dragCY - midY);
                        if (dist < SNAP_RADIUS && dist < minDist) {
                            minDist = dist;
                            edgeToSplit = edge;
                            splitSource = src;
                            splitTarget = tgt;
                        }
                    }

                    if (!edgeToSplit || !splitSource || !splitTarget) return currentEdges;

                    // Split: remove original, add two new edges
                    const e1: Edge = {
                        id: `e-split-${splitSource.id}-${draggedNode.id}`,
                        source: splitSource.id,
                        target: draggedNode.id,
                        type: "deletable",
                        animated: false,
                        style: { strokeWidth: 2 },
                    };
                    const e2: Edge = {
                        id: `e-split-${draggedNode.id}-${splitTarget.id}`,
                        source: draggedNode.id,
                        target: splitTarget.id,
                        type: "deletable",
                        animated: false,
                        style: { strokeWidth: 2 },
                    };

                    return [
                        ...currentEdges.filter((e) => e.id !== (edgeToSplit as Edge).id),
                        e1,
                        e2,
                    ];
                });

                return currentNodes;
            });
        },
        [setNodes, setEdges]
    );

    /* ── Run workflow simulation ──────────────────────────────── */
    const runWorkflow = useCallback(() => {
        setEdges((eds) => eds.map((e: Edge) => ({ ...e, animated: true })));
        setNodes((nds: Node[]) =>
            nds.map((n: Node) => {
                if (n.type === "ideaPolisher" || n.type === "captionGenerator" || n.type === "aiRepurposer")
                    return { ...n, data: { ...n.data, isRunning: true } };
                return n;
            })
        );

        const t1 = setTimeout(() => {
            setNodes((nds: Node[]) =>
                nds.map((n: Node) =>
                    n.type === "platform" ? { ...n, data: { ...n.data, status: "generating" } } : n
                )
            );
        }, 500);

        const t2 = setTimeout(() => {
            setNodes((nds: Node[]) =>
                nds.map((n: Node) => {
                    if (n.type === "ideaPolisher") return { ...n, data: { ...n.data, isRunning: false } };
                    if (n.type === "captionGenerator")
                        return { ...n, data: { ...n.data, isRunning: false, generatedCaption: "The greatest strategy isn't going viral — it's staying consistent when nobody is watching. 🎯 Here's the framework that changed everything for me…" } };
                    return n;
                })
            );
        }, 1800);

        const t3 = setTimeout(() => {
            setNodes((nds: Node[]) =>
                nds.map((n: Node) => {
                    if (n.type === "platform") return { ...n, data: { ...n.data, status: "ready" } };
                    if (n.type === "aiRepurposer") return { ...n, data: { ...n.data, isRunning: false } };
                    return n;
                })
            );
        }, 3000);

        const t4 = setTimeout(() => {
            setEdges((eds) => eds.map((e: Edge) => ({ ...e, animated: false })));
            onRunComplete();
        }, 4000);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [setEdges, setNodes, onRunComplete]);

    useEffect(() => {
        if (runTrigger === 0) return;
        const cleanup = runWorkflow();
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runTrigger]);

    return (
        <div className="w-full h-full" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{ type: "deletable", style: { strokeWidth: 2 } }}
                fitView
                fitViewOptions={{ padding: 0.15 }}
                minZoom={0.2}
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
                        return "oklch(0.5 0 0)";
                    }}
                    maskColor="oklch(0 0 0 / 0.35)"
                    style={{ width: 140, height: 90 }}
                />

                {/* Node Palette */}
                <Panel position="top-left" className="!top-20 !left-4">
                    <NodePalette />
                </Panel>

                {/* Tip Banner */}
                <Panel position="bottom-center" className="!bottom-20">
                    <AnimatePresence>
                        {showTip && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-md text-xs text-zinc-500 dark:text-zinc-400"
                            >
                                <Info className="w-3.5 h-3.5 flex-shrink-0 text-[var(--omni)]" />
                                <span>Drag from left panel • Select + <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-mono text-[10px]">Del</kbd> to delete • Click edge to remove it</span>
                                <button onClick={() => setShowTip(false)} className="ml-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer">✕</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Panel>
            </ReactFlow>
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
