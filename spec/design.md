# HERMES MISSION CONTROL: INTERFACE SPECIFICATION
## Design System: "Cognitive Transparency"
## Philosophy: The UI should feel like looking into the brain of a super-intelligent entity

### 1.0 Design Tokens (The Atomic Elements)

#### Color Architecture (Semantic)
```css
/* Background Layers (Depth) */
--bg-void: #000000;        /* Deepest layer - the unknown */
--bg-abyss: #020617;       /* Slate 950 - Main canvas */
--bg-depth: #0f172a;       /* Slate 900 - Card backgrounds */
--bg-surface: #1e293b;     /* Slate 800 - Elevated surfaces */

/* Agent Identity Colors (Cognitive Functions) */
--cortex-orchestrator: #10b981;  /* Emerald 500 - Triage/Flow */
--cortex-diagnostician: #8b5cf6; /* Violet 500 - Analysis/Deep thought */
--cortex-healer: #f59e0b;        /* Amber 500 - Action/Intervention */
--cortex-learned: #06b6d4;      /* Cyan 500 - Knowledge/Memory */

/* Signal Colors (State) */
--signal-critical: #ef4444;    /* Red 500 - checkout down */
--signal-warning: #f59e0b;     /* Amber 500 - attention needed */
--signal-healthy: #10b981;     /* Emerald 500 - resolved */
--signal-info: #3b82f6;        /* Blue 500 - processing */

/* Text Hierarchy */
--text-primary: #f8fafc;       /* Slate 50 - Human readable */
--text-secondary: #94a3b8;     /* Slate 400 - Metadata */
--text-tertiary: #64748b;      /* Slate 500 - Timestamps */
--text-accent: #e2e8f0;        /* Slate 200 - Highlights */
```
Typography (Cognitive Load Management)
```css
/* Font Stack */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Scale (Major Third - 1.25) */
--text-xs: 0.75rem;    /* 12px - Timestamps */
--text-sm: 0.875rem;   /* 14px - Metadata */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Emphasis */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Section headers */
--text-3xl: 1.875rem;  /* 30px - Major headings */
```
Spacing & Layout (Grid System)
Base Unit: 4px
Container Max: 1440px (optimal for 13" MacBook + margin)
Grid: 12-column with 24px gutters
Density: Compact (information-rich interface like Bloomberg Terminal)
Elevation (Z-Index Strategy)
```css
--z-base: 0;
--z-elevated: 10;        /* Cards */
--z-sticky: 100;         /* Headers */
--z-dropdown: 200;       /* Menus */
--z-modal: 300;          /* Dialogs */
--z-popover: 400;        /* Tooltips */
--z-toast: 500;          /* Notifications */
```

2.0 Screen Specifications
Screen 1: The War Room (Dashboard)
Layout Type: Three-column Adaptive Grid (33% / 50% / 17%)
Left Column: The Signal Stream (Ticket Ingestion)
Function: Real-time awareness of system distress
Component: Live Feed
Virtualized list (react-window) handling 1000+ items
Each item: Pulsing dot (urgency), Merchant avatar, Issue classification chip, Relative timestamp
Animation: New items slide in from top with "swoosh" easing (cubic-bezier(0.4, 0, 0.2, 1))
Interaction: Click expands to full ticket view (slide-over panel)
Filter bar: Segmented control [All | Critical | In Progress | Resolved]
Center Column: The Cognitive Space (Agent Reasoning)
Function: Make the thinking visible
Component: Reasoning Tree
Visual: Vertical tree diagram (react-flow) showing agent decision path
Nodes:
Circular agent icons (color-coded by agent type)
Diamond shapes for decision points
Rectangles for actions taken
Edges: Animated data particles flowing from observation → analysis → action
Real-time: SSE updates push new nodes as agents think
Detail Panel: Click any node to see raw evidence (log snippets, doc references)
Right Column: System Health (Vitals)
Function: At-a-glance system status
Component: Health Gauges
Circular progress indicators (SVG) showing:
Agent System Load (0-100%)
Error Rate Deviation (z-score visualization)
Queue Depth (tickets waiting)
Mini sparklines (24h trend)
Alerts: Red pulsing border if anomaly detected
Screen 2: The Autopsy (Ticket Detail View)
Layout Type: Split-screen (40% context / 60% analysis)
Left Panel: Context & Communication
Merchant Profile Card: Tier badge, migration stage, health history
Conversation Thread: Email/chat history (simulated for hackathon)
System Events Timeline: Webhook failures, config changes (vertical timeline)
Right Panel: Agent Investigation
Differential Diagnosis: Three hypotheses as cards with confidence bars
Card 1: "Webhook SSL Error" - 85% confidence
Card 2: "Rate Limit Exceeded" - 10% confidence
Card 3: "Platform Regression" - 5% confidence
Evidence Locker: Collapsible sections for:
Log Analysis (grep results)
Documentation Matches (RAG results with similarity scores)
Pattern Matches (historical similar issues)
Proposed Intervention: Action card with risk assessment and approval buttons
Screen 3: The Oracle (Pattern Analytics)
Layout Type: Dashboard Grid (2x2)
Widget 1: Migration Health Heatmap
X-axis: Time (last 7 days)
Y-axis: Merchant tier
Color intensity: Ticket volume
Insight: "Enterprise merchants hit harder on weekends"
Widget 2: Agent Autonomy Funnel
Sankey diagram showing ticket flow:
Auto-resolved (green) → 45%
Human-approved (amber) → 30%
Escalated (red) → 25%
Widget 3: Knowledge Gap Analysis
Word cloud of "unsolved" or "confused" intents
Identifies documentation gaps
Widget 4: Economic Impact
Real-time counter: "$47,230 saved today" (calculated from resolved tickets × $45 cost)
3.0 Component Specifications (For Google Stitch)
Component 1: Agent Activity Node
markdown
PROMPT FOR STITCH:
"Generate a React component for an Agent Activity Node. Dark theme (slate-900 bg). 
Circular avatar with pulsing ring animation when active. Color-coded by agent type 
(Emerald for Orchestrator, Violet for Diagnostician, Amber for Healer). 
Show agent name, current status text ('Analyzing logs...'), and confidence percentage. 
Include micro-animation for status changes. Export as TypeScript with Tailwind classes."
Component 2: Risk Assessment Card
markdown
PROMPT FOR STITCH:
"Generate a high-risk action approval card. Dark theme. Red border (2px) indicating 
financial impact. Header: 'Proposed Intervention: Webhook Reconfiguration'. 
Risk level badge (Critical/High/Med/Low). Bullet points: 'Impact: Checkout restart required', 
'Rollback: Available for 60 minutes', 'Confidence: 94%'. Two buttons: 
'Execute Autonomous Fix' (emerald, prominent) and 'Escalate to Human' (slate). 
Include warning icon and legal disclaimer text."
Component 3: Cognitive Stream
markdown
PROMPT FOR STITCH:
"Generate a 'thought stream' component resembling a terminal output but beautiful. 
Monospace font, dark background, color-coded prefixes: 
[ORCHESTRATOR] in emerald, [DIAGNOSTICIAN] in violet, [HEALER] in amber. 
Scrolling auto-scroll to bottom. Timestamps on left. 
Collapsible tree structure for nested reasoning."
4.0 Animation & Micro-interaction Specification
The Pulse of Life
Agent Thinking: Subtle 2s ease-in-out pulse on agent avatars (box-shadow ripple)
Data Flow: SVG path animations showing electrons traveling from observation to action
Success State: Checkmark morphs from circle with elastic ease (cubic-bezier(0.68, -0.55, 0.265, 1.55))
The Texture of Intelligence
Glassmorphism: Backdrop-blur on overlay panels (modern AI aesthetic)
Gradient Accents: Subtle linear gradients on active elements (brand colors at 10% opacity)
Noise Texture: 2% opacity grain on dark backgrounds (reduces banding, adds premium feel)
5.0 Responsive Constraints (Explicit Non-Goals)
Minimum Width: 1280px (laptop minimum)
Mobile: Explicitly NOT supported (internal tool assumption)
Tablet: Degraded experience acceptable (responsive only to 1024px minimum)
6.0 Accessibility (WCAG 2.1 AA Compliance)
Contrast Ratios: All text meets 4.5:1 minimum (checked via APCA)
Focus Rings: Visible 2px white outline on all interactive elements
Screen Reader: Semantic HTML regions (role="complementary" for sidebars)
Reduced Motion: Media query respects prefers-reduced-motion (disables pulsing)
Keyboard Nav: Tab order logical, Escape closes modals
