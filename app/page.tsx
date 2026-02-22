"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { TopBar } from "@/components/navbar/TopBar";

const WorkflowCanvas = dynamic(
  () => import("@/components/canvas/WorkflowCanvas").then((mod) => mod.WorkflowCanvas),
  {
    ssr: false,
    loading: () => <CanvasLoader />,
  }
);

function CanvasLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-white/10 border-t-[var(--omni)]"
      />
      <p className="text-sm text-zinc-400 dark:text-zinc-500">Loading canvas…</p>
    </div>
  );
}

export default function HomePage() {
  const [workflowName, setWorkflowName] = useState("My First Workflow");
  const [isRunning, setIsRunning] = useState(false);
  const [runTrigger, setRunTrigger] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(false);

  const handleRun = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setRunTrigger((prev) => prev + 1);
  }, [isRunning]);

  const handleRunComplete = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleSnapToggle = useCallback(() => {
    setSnapToGrid((prev) => !prev);
  }, []);

  return (
    <main className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <TopBar
        workflowName={workflowName}
        onWorkflowNameChange={setWorkflowName}
        onRun={handleRun}
        isRunning={isRunning}
        snapToGrid={snapToGrid}
        onSnapToggle={handleSnapToggle}
      />

      <div className="flex-1 pt-14 relative">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, var(--omni-muted) 0%, transparent 70%)",
          }}
        />
        <WorkflowCanvas
          runTrigger={runTrigger}
          onRunComplete={handleRunComplete}
          snapToGrid={snapToGrid}
        />
      </div>
    </main>
  );
}
