"use client";

import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    type EdgeProps,
    useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

export function DeletableEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    animated,
    style,
    markerEnd,
}: EdgeProps) {
    const { setEdges } = useReactFlow();

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: animated ? "var(--omni)" : undefined,
                }}
            />

            {/* Delete button — shown when edge is selected or hovered */}
            <EdgeLabelRenderer>
                <div
                    className="nodrag nopan"
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: "all",
                    }}
                >
                    {selected && (
                        <button
                            onClick={() => setEdges((eds) => eds.filter((e) => e.id !== id))}
                            className="
                flex items-center justify-center
                w-5 h-5 rounded-full
                bg-rose-500 hover:bg-rose-400
                text-white
                shadow-[0_0_8px_rgba(239,68,68,0.5)]
                border border-rose-400
                transition-all duration-150
                cursor-pointer
              "
                            title="Delete connection"
                        >
                            <X className="w-2.5 h-2.5" strokeWidth={3} />
                        </button>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
