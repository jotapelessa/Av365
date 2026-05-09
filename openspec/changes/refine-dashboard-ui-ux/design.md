# Design: Luxury Modular Dashboard

## Architecture: Grid & Spacing System
We will implement a **Strict 8px Grid** system.
- **Micro-spacing**: 8px / 16px (gaps within components).
- **Macro-spacing**: 32px / 48px / 64px (gaps between sections and page margins).
- **Inner Padding**: Standardized at 40px for "Luxury" cards to provide visual "breath".

## Visual Layering (Glassmorphism)
To achieve the "Luxury Admin" look:
- **Surface**: `bg-white/40` with `backdrop-blur-2xl`.
- **Border**: `border-white/20` with a subtle `ring-1 ring-black/5` for definition.
- **Shadows**: Multi-layered soft shadows (`0 8px 30px rgba(0,0,0,0.04)`).

## Component Hierarchy
1. **Headline (Level 1)**: Greeting + Real-time status indicator.
2. **KPI Grid (Level 2)**: 4-column layout for vital production metrics.
3. **Analytics Core (Level 3)**: 70/30 split (Main Chart / Quick Action Hub).
4. **Operational Feed (Level 4)**: List view for tasks and alerts.

## Implementation Pattern
We will use a `DashboardGrid` component that acts as a CSS Grid wrapper, ensuring responsiveness and consistent column sizing across all cards.
