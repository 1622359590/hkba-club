# Design

## System
HKBA uses a dark institutional interface with luminous blue-violet accents, crisp cards, restrained gradients, and white content surfaces only where they help logos or uploaded assets read correctly.

## Color
- Canvas: `#09090b`
- Elevated surface: `rgba(255,255,255,0.035)`
- Strong surface: `rgba(15,23,42,0.78)`
- Text primary: `#fafafa`
- Text secondary: `#a1a1aa`
- Muted text: `#71717a`
- Accent: `#6366f1`
- Accent bright: `#818cf8`
- Success: `#22c55e`
- Warning: `#f59e0b`

## Typography
Use the system UI stack with PingFang SC support. Public pages use compact editorial headings; admin pages use smaller operational headings and stable labels. Letter spacing stays neutral except for short uppercase section labels.

## Components
- Buttons are inline-flex controls with visible hover, focus, and active states.
- Public cards use low-contrast glass surfaces, subtle border lift, and clear content grouping.
- Team cards are structured like professional profile cards: avatar, role badge, name, title, bio.
- Partner logos sit on brighter logo tiles and remain in color.
- Admin navigation uses active indicators, icon containers, and clear top-level actions.

## Layout
Public pages use generous full-width sections with constrained inner content. Admin pages use a sidebar plus wide content canvas, with responsive grids for metrics and work queues.

## Motion
Transitions should be 150-300ms and limited to opacity, transform, border, and background changes. Avoid decorative animation that distracts from reading or content management.
