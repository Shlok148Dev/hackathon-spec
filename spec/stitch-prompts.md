# GOOGLE STITCH: HERMES UI COMPONENT LIBRARY

## Prompt Engineering Strategy
All prompts include:
1. **Context**: Dark theme, Mission Control aesthetic
2. **Constraints**: Specific tech stack (React, Tailwind, no external deps beyond lucide-react)
3. **Behavior**: Interactive states (loading, error, success)
4. **Accessibility**: ARIA labels, keyboard navigation

---

### COMPONENT 1: The War Room Shell (Dashboard Layout)

**STITCH PROMPT:**
Generate a production-grade React dashboard layout component named WarRoomShell.
CONTEXT: This is a Mission Control interface for an AI support system, similar to
NASA mission control meets Shopify admin. Dark theme (bg-slate-950).
STRUCTURE:
Fixed header (64px): Logo "HERMES" left, System Status indicator right, Time/User center
Left sidebar (280px): Navigation links (Dashboard, Tickets, Patterns, Analytics), collapsible
Main content: Three-column grid (responsive: 1fr 2fr 1fr)
Right panel: Floating action button for "Emergency Stop"
Background: Subtle grid pattern or gradient overlay
TECH SPECS:
React functional component with TypeScript
Tailwind CSS only, no inline styles
Use lucide-react for icons
Must include: Sidebar toggle state, mobile breakpoint handling (hidden below 1024px)
Dark mode only (hardcode dark classes)
INTERACTIONS:
Sidebar expands/collapses with smooth transition (300ms ease)
Header status indicator pulses when system alerts active
Grid columns should be resizable (optional, nice-to-have)
EXPORT: Single file, default export, ready for Next.js App Router.

---

### COMPONENT 2: Ticket Intelligence Card

**STITCH PROMPT:**
Generate a TicketCard component for the signal stream.
CONTEXT: Card displays incoming support ticket in a list. Needs to convey urgency
and AI classification at a glance. Dark theme (bg-slate-900).
DATA STRUCTURE (props interface):
interface TicketCardProps {
id: string;
merchantName: string;
merchantAvatar?: string;
title: string;
preview: string;
urgency: 'critical' | 'high' | 'medium' | 'low';
category: 'API_ERROR' | 'CONFIG_ERROR' | 'WEBHOOK_FAIL' | 'CHECKOUT_BREAK';
confidence: number; // 0-1
timestamp: Date;
isNew?: boolean; // Pulse animation if true
}
VISUAL DESIGN:
Left border: 4px colored by urgency (red=critical, orange=high, yellow=medium, blue=low)
Top row: Merchant name (bold), Category badge (colored chip), Timestamp (muted)
Middle: Title (truncate at 2 lines), Preview (truncate at 1 line, gray text)
Bottom: Confidence bar (thin progress bar, color by confidence level)
New indicator: Subtle pulse animation on left border
COLORS:
Urgent: border-red-500, bg-red-500/10
High: border-orange-500, bg-orange-500/10
Medium: border-yellow-500, bg-yellow-500/10
Low: border-blue-500, bg-blue-500/10
Category badges: Use slate-800 bg with colored text matching urgency
INTERACTIONS:
Hover: Slight lift (shadow-lg), background lightens slightly (hover:bg-slate-800)
Click: Entire card is clickable, navigates to detail view (onClick prop)
New pulse: CSS animation, 2s ease-in-out infinite
ACCESSIBILITY:
aria-label describing urgency and category
role="article"
Keyboard navigable (tabindex)
EXPORT: TypeScript React component with interface definition.

---

### COMPONENT 3: Cognitive Reasoning Tree

**STITCH PROMPT:**
Generate a ReasoningTree component for visualizing AI agent thought process.
CONTEXT: This shows how the AI thinks - like a mind map but vertical.
React Flow alternative but custom built for simplicity. Dark theme.
DATA STRUCTURE:
interface ReasoningNode {
id: string;
agent: 'orchestrator' | 'diagnostician' | 'healer';
action: 'observed' | 'analyzed' | 'decided' | 'acted';
description: string;
confidence?: number;
evidence?: string[];
timestamp: Date;
children?: ReasoningNode[];
}
VISUAL DESIGN:
Vertical layout, top to bottom timeline style
Each node:
Icon circle (32px) with agent color (Emerald/Violet/Amber)
Connector line (2px) to next node
Content card (bg-slate-800, rounded-lg, p-3)
Agent colors: Orchestrator=Emerald, Diagnostician=Violet, Healer=Amber
Action icons: Observed=Eye, Analyzed=Brain, Decided=GitBranch, Acted=Play
ANIMATIONS:
New nodes slide in from top with fade (stagger 200ms)
Connector lines draw from previous node (SVG path animation)
Confidence meter fills horizontally when node appears
INTERACTIONS:
Expand/collapse: Click node to toggle evidence visibility (if evidence exists)
Hover: Highlight entire branch path from this node to root
IMPLEMENTATION NOTES:
Use simple divs with CSS positioning (no heavy graph libraries)
Must handle up to 20 nodes without performance issues
Scrollable container with auto-scroll to bottom on new nodes
EXPORT: Component + TypeScript interfaces.

---

### COMPONENT 9: Real-time Activity Stream

**STITCH PROMPT:**
Generate an ActivityLog component - terminal-style but beautiful.
CONTEXT: Shows streaming logs from AI agents in real-time. Like a hacker
terminal but polished. Dark background, monospace font, color-coded by agent.
FEATURES:
Auto-scrolling (sticks to bottom)
Pause scroll on hover (user reading)
Color coding:
Orchestrator: Emerald text
Diagnostician: Violet text
Healer: Amber text
System: Slate text
Timestamps on left (HH:MM:SS)
Log levels: [INFO], [WARN], [ERROR] with appropriate colors
Copy button to copy entire log
DATA EXAMPLE:
[
{timestamp: "14:32:01", agent: "orchestrator", level: "info", message: "Ticket #1234 received from Merchant_A"},
{timestamp: "14:32:02", agent: "diagnostician", level: "info", message: "Analyzing webhook logs..."}
]
STYLING:
Font: JetBrains Mono or Fira Code (monospace)
Background: bg-black (darker than slate-950 for contrast)
Line height: relaxed for readability
Max height: 400px with overflow-y-auto
BEHAVIOR:
Props: logs array, maxLines (default 100, truncate old)
Scroll to bottom button appears when scrolled up
Search filter (optional nice-to-have)
EXPORT: Full component.
