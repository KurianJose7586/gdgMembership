# Chaos Architect Mission Generator - Design Guidelines

## Design Approach
**Cyberpunk/Hacker Aesthetic** - Drawing inspiration from hacker terminals, sci-fi interfaces, and neon-soaked cyberpunk visuals. Think Blade Runner meets terminal UI with modern polish.

## Color System
- **Background**: Pure black (#000000) or very dark gray (#0a0a0a)
- **Accents**: Neon green (#00ff41) or neon purple (#a855f7) for interactive elements
- **Borders**: Glowing neon effects using the accent colors
- **Text**: Bright white (#ffffff) for primary content, dim gray (#737373) for secondary

## Typography
- **Font Family**: Use a monospace font from Google Fonts (JetBrains Mono or Space Mono) for the cyberpunk terminal feel
- **Hierarchy**:
  - Mission Title: text-3xl font-bold
  - Section Headers (Lore, Antagonist, Task): text-xl font-semibold
  - Body Text: text-base
  - Input Labels: text-sm uppercase tracking-wider

## Layout System
- **Spacing Scale**: Use Tailwind units of 4, 6, 8, 12, and 16 (p-4, gap-6, mb-8, etc.)
- **Container**: max-w-2xl centered with mx-auto
- **Vertical Rhythm**: Consistent py-8 between major sections, gap-6 within sections

## Component Library

### Main Card Container
- Centered viewport layout with full-height display (min-h-screen flex items-center)
- Card with thick neon border (border-2 or border-4)
- Rounded corners (rounded-lg)
- Inner padding: p-8 or p-10
- Glowing box-shadow effect using neon accent color

### Input Field
- Full-width with thick bottom border only (border-b-2)
- Transparent background with neon accent border
- Large text size (text-lg)
- Padding: py-3
- Placeholder text in dim gray

### Initialize Mission Button
- Full-width button with neon background
- Bold uppercase text (uppercase font-bold)
- Substantial padding: px-8 py-4
- Subtle glow effect (shadow-lg with neon color)
- Add slight hover state brightness increase

### Loading State
- Replace card content with centered loading animation
- "Hacking into mainframe..." text with animated ellipsis or pulsing effect
- Matrix-style falling code effect or scanning line animation
- Use neon accent for animation elements

### Mission Display Card
- Structured sections with clear visual separation
- Each section (Title, Lore, Antagonist, Task) in its own container with mb-6
- Section headers with neon underline or border accent
- **Technical Task Section**: Most prominent - larger padding (p-6), distinctive border treatment, or background tint to make it stand out as the primary actionable item

### Icons (Lucide React)
- Use Terminal, Zap, AlertTriangle, Code icons to reinforce hacker theme
- Size: w-6 h-6 or w-8 h-8
- Neon accent color to match theme
- Place icons next to section headers

## Page Structure
Single-page application with state transitions:
1. **Initial State**: Input card with Student ID field and button
2. **Loading State**: Full-screen loading animation
3. **Mission Display**: Expanded card showing all mission details

## Animation Guidelines
- Minimal, purposeful animations only
- Loading state: Pulsing or scanning effects
- Button interactions: Subtle glow intensity changes
- Card transitions: Quick fade-in (200ms) when mission loads
- Avoid distracting continuous animations

## Accessibility
- High contrast maintained (white text on black background)
- Focus states with visible neon outline
- Large, readable text sizes throughout
- Clear visual hierarchy for screen readers

## Visual Effects
- **Glow Effects**: Apply to borders and buttons using box-shadow with neon colors
- **Scanlines**: Optional subtle scanline overlay on card background for retro terminal effect
- **Border Treatment**: Angular/geometric borders or glitch-style corners to enhance cyberpunk aesthetic

## Images
No hero images needed for this terminal-style interface. The aesthetic is purely UI-focused with text, borders, and neon effects creating the visual impact.