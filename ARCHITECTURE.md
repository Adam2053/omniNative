# OmniNative — Architectural Plan

## Overview
OmniNative is a premium AI content repurposing engine. The core UI is an n8n-style visual, node-based workflow builder powered by React Flow. Users connect Trigger nodes → AI Processing nodes → Platform (output) nodes.

---

## File Structure

```
omninative-ai/
├── app/
│   ├── layout.tsx                    # Root layout with ThemeProvider
│   ├── page.tsx                      # Main canvas page (full-screen workflow builder)
│   └── globals.css                   # Tailwind v4 + CSS custom properties
│
├── components/
│   ├── ui/                           # Shadcn UI primitives (Button, Input, Select, Card)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── card.tsx
│   │
│   ├── nodes/                        # Custom React Flow node types
│   │   ├── TriggerNode.tsx           # Input node — icon + text input
│   │   ├── AIProcessingNode.tsx      # AI engine node — tone selector dropdown
│   │   └── PlatformNode.tsx          # Output node — platform logo + status badge
│   │
│   ├── canvas/
│   │   ├── WorkflowCanvas.tsx        # Main React Flow canvas wrapper
│   │   ├── CustomEdge.tsx            # Animated edge with glowing style
│   │   └── NodeToolbar.tsx           # Left-side panel to drag-add new nodes
│   │
│   ├── navbar/
│   │   └── TopBar.tsx                # Top nav — workflow name input, run button, theme toggle
│   │
│   └── providers/
│       └── ThemeProvider.tsx         # next-themes wrapper
│
├── lib/
│   ├── initialNodes.ts               # Default demo nodes for the canvas
│   ├── initialEdges.ts               # Default demo edges connecting demo nodes
│   └── nodeTypes.ts                  # React Flow nodeTypes registry
│
├── hooks/
│   └── useWorkflowRunner.ts          # Custom hook: run workflow simulation logic
│
└── types/
    └── workflow.ts                   # TypeScript types (NodeData, EdgeData, etc.)
```

---

## State Management Approach

### React Flow State
- Use `useNodesState` and `useEdgesState` from `@xyflow/react` in `WorkflowCanvas.tsx`.
- Node data (e.g., `inputValue`, `tone`, `status`) is stored directly in each node's `data` field.
- Node updates use `setNodes(nodes => nodes.map(...))` pattern, passing new data via `onNodesChange`.

### Workflow Execution State
- `useWorkflowRunner` hook owns `isRunning: boolean` state.
- On run:
  1. Set all edges to `animated: true`
  2. Set all Platform nodes to `status: 'generating'`
  3. After 2.5s delay, set Platform nodes to `status: 'ready'`
  4. After another 1s, reset `isRunning` to `false`

### Theme
- `next-themes` `ThemeProvider` at root level.
- `class` strategy (`dark` class on `<html>`).
- Toggle button in `TopBar.tsx`.

---

## Custom Node Architecture

### TriggerNode
- Data: `{ label: string, inputValue: string, icon: LucideIcon }`
- Has a `<Input>` for the raw idea/URL
- Source handle only (right side)
- Glow on isSelected

### AIProcessingNode
- Data: `{ label: string, model: string, tone: 'professional' | 'casual' | 'viral' }`
- Has a `<Select>` for tone
- Target handle (left) + Source handle (right)
- Animated gradient border when workflow is running

### PlatformNode
- Data: `{ platform: 'x' | 'instagram' | 'facebook' | 'linkedin', status: 'idle' | 'generating' | 'ready' }`
- Shows platform SVG logo
- Status badge changes: gray → spinner → green checkmark
- Target handle only (left side)

---

## Key Design Decisions

1. **Glassmorphism Nodes**: Nodes use `backdrop-blur-xl`, `bg-white/5`, `border border-white/10` with a subtle box shadow.
2. **Animated Edges**: Default edges use a custom `CustomEdge` with a glowing stroke that animates when `animated: true`.
3. **CSS Variables for Theming**: Accent color (`--color-accent`) defined in `globals.css` so it works in both themes.
4. **Client Components**: All React Flow components are `'use client'` — wrapped inside a `Suspense` boundary in the server page.
5. **Performance**: React Flow `fitView` on mount, `nodesDraggable`, `nodesConnectable` enabled for full interactivity.
