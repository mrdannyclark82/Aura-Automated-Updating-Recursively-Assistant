# Aura: NLU Intent Badges, Cognitive Performance Analytics, Local Gemma Model & PWA Integration

A comprehensive architectural blueprint to upgrade Aura with multi-category NLU intent classification badges, a visual Cognitive Performance scatter chart (Recharts) tracking latency against task complexity, local WebGPU Gemma model integration with an offline toggle, and full Progressive Web App (PWA) installability.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during the Phase 1 clarification interview:
> - **Local Gemma Model Engine**: WebGPU in-browser Gemma (using `@google/mediapipe` or WebLLM / `@huggingface/transformers` runtime patterns) with an instant offline/local fallback switcher.
> - **Cognitive Performance Chart**: Interactive Scatter plot visualization pairing execution processing time (ms) against syntactic/semantic task complexity score (0–100) across recent interactions with a trendline and quartile tooltips.
> - **PWA Installation Experience**: Ambient install prompt banner with service worker precaching, Web App Manifest, maskable icons, and full offline caching support.

---

## 1. Overview & Core Concept

- **NLU Intent Badging**: Every user query is automatically classified into distinct communicative intents (e.g., `research`, `drafting`, `debug`, `planning`, `inquiry`, `task_execution`). These appear as refined, non-intrusive metadata badges immediately above the user's message in the chat history, providing instant visibility into how Aura understood the query.
- **Cognitive Performance Analytics (Recharts)**: A dedicated performance visualization in the Personalization/Learning Dashboard mapping the last 20 interactions. Users and developers can observe how processing duration scales with linguistic and task complexity (clause count, idiom count, tool execution overhead), providing concrete performance transparency.
- **Local Gemma Model Integration**: An on-device AI runtime option allowing users to toggle between Cloud Gemini 3.8 Flash (for heavy tool execution and deep research) and Local Gemma (running client-side via WebGPU), enabling private and offline responses when network connectivity drops.
- **Progressive Web App (PWA)**: Complete compliance with modern PWA standards (`vite-plugin-pwa`, `manifest.webmanifest`, service worker precaching, offline banner, iOS Safari touch icons, and an ambient in-app install prompt).

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Query Intent Recognition**: User enters a query (e.g., *"Debug this Jest token expiration test for Marcus"* or *"Draft an executive memo on Q4 compute savings"*). Aura's NLU pipeline classifies the intent (`debug` or `drafting`). A crisp badge renders above the user bubble with category-specific color accents (cyan for research, purple for drafting, amber for debug).
2. **Cognitive Performance Inspection**: User opens the Learning Hub and navigates to the new "Cognitive Performance" section. A scatter plot rendered with Recharts displays data points representing the last 20 interactions: X-axis is Task Complexity (0–100), Y-axis is Processing Latency (ms). Hovering reveals the exact user query, intent, tool invocations, and complexity breakdown.
3. **Local Gemma Model Switcher**: User toggles the "Model Engine" control in the top bar or settings from "Cloud Gemini 3.8" to "Local Gemma (WebGPU / Offline)". An indicator highlights local device execution, and queries run directly in-browser.
4. **PWA Installation**: When launched on desktop or mobile, an ambient "Install Aura Desktop/Mobile" banner appears if not yet installed. Users can install with one click or view guided iOS instructions, and retain full cached offline functionality when disconnected.

### Visual Styling & Theme
- **Color Discipline**: Deep navy neutral canvas (`#070a1e`, `#090e29`), hairline borders (`border-white/10`), vibrant semantic accents (cyan `#38bdf8` for research, emerald `#34d399` for nominal performance, amber `#f59e0b` for debug/tasks, violet `#a855f7` for drafting).
- **Typography**: Clean contemporary sans (`Plus Jakarta Sans` / system sans) paired with tabular monospace numerals (`font-mono tabular-nums`) for all latency and complexity coordinates.

---

## 3. Key Product Decisions & Trade-Offs

- **Recharts for Scatter Visualization**: Recharts provides responsive, accessible SVG rendering and built-in tooltips without heavy canvas setup.
- **Intent Badging Location**: Positioned above the user message bubble as quiet unboxed metadata text (`intent: drafting · 94% conf`) with subtle category accents, ensuring no visual clutter.
- **WebGPU Gemma Hybrid Integration**: Provides client-side execution with an automatic offline fallback when connectivity is severed, seamlessly switching back to Gemini 3.8 Flash for multi-tool operations.
- **Vite PWA Plugin (`vite-plugin-pwa`)**: Configured with `autoUpdate`, standalone display, 192px/512px icons, and Workbox runtime caching for Google fonts and app assets.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Aura Application Shell                          │
│                                                                        │
│   ┌─────────────────────┐   ┌──────────────────────────────────────┐   │
│   │   PWA Service Worker│   │  Model Engine Controller             │   │
│   │  (Workbox Precache) │   │  [Cloud Gemini 3.8 | Local Gemma]    │   │
│   └──────────┬──────────┘   └──────────────────┬───────────────────┘   │
│              │                                 │                       │
│   ┌──────────▼─────────────────────────────────▼───────────────────┐   │
│   │                        Chat Stream                             │   │
│   │  ┌──────────────────────────────────────────────────────────┐  │   │
│   │  │ User Bubble: [Intent Badge: drafting]                    │  │   │
│   │  │ "Draft executive compute budget memo for Elena"          │  │   │
│   │  └──────────────────────────────────────────────────────────┘  │   │
│   │  ┌──────────────────────────────────────────────────────────┐  │   │
│   │  │ Assistant Bubble: Tool Sources + Deliverable + Feedback  │  │   │
│   │  └──────────────────────────────────────────────────────────┘  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               Learning Hub & Analytics                         │   │
│   │  ┌──────────────────────────────────────────────────────────┐  │   │
│   │  │ Recharts Scatter Plot: Latency (ms) vs Complexity (0-100)│  │   │
│   │  │ Interactive Tooltips • Regression Trend • Quartiles      │  │   │
│   │  └──────────────────────────────────────────────────────────┘  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Additions

1. **Extended Message with Primary Intent Category**:
   ```typescript
   export type IntentCategory = 'research' | 'drafting' | 'debug' | 'planning' | 'inquiry' | 'task_execution';

   export interface Message {
     // ... existing fields
     primaryIntent?: IntentCategory;
     executionLatencyMs?: number;
     complexityScore?: number;
   }
   ```

2. **Cognitive Performance Record**:
   ```typescript
   export interface CognitiveMetricPoint {
     interactionId: string;
     querySnippet: string;
     intent: IntentCategory;
     complexityScore: number; // 0 - 100
     latencyMs: number;
     modelUsed: 'gemini-3.8-flash' | 'gemma-local';
     timestamp: string;
   }
   ```

3. **Local Gemma Engine Controller**:
   A modular client service supporting WebGPU-based inference with fallback to cloud Gemini when offline or upon user toggle.
