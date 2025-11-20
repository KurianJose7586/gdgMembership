# Chaos Architect Mission Generator

## Overview

The Chaos Architect Mission Generator is a web application that generates absurd, fictional software missions for students. When a student enters their ID, the system either retrieves their previously assigned mission or generates a new one using AI. The application features a cyberpunk/hacker aesthetic with a dark theme, neon accents, and terminal-style UI elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- Single Page Application (SPA) with client-side routing via Wouter
- Component-based architecture following React best practices
- State management handled locally within components (no global state library)

**UI Design System**:
- Built on shadcn/ui components with Radix UI primitives
- Tailwind CSS for styling with custom cyberpunk theme
- Design follows "New York" style variant from shadcn
- Custom color system using CSS variables for theme consistency
- Monospace fonts (JetBrains Mono/Space Mono) for terminal aesthetic

**Key UI Components**:
- `MissionInput`: Form for student ID entry with cyberpunk styling
- `MissionDisplay`: Displays generated mission details (title, lore, antagonist, task, tech stack)
- `LoadingAnimation`: Animated loading state with "hacking mainframe" theme
- `CyberpunkBackground`: Grid pattern and animated effects for visual depth
- `MatrixRain`: Falling code animation for enhanced cyberpunk feel

**State Flow**:
- Application has three states: "input" → "loading" → "display"
- Form submission triggers API call to backend
- Loading state shows while AI generates or retrieves mission
- Display state shows mission details with reset capability

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js
- RESTful API design pattern
- Single POST endpoint: `/api/mission`
- Middleware for JSON parsing and request logging
- Development mode includes Vite integration for HMR

**API Design**:
- Request validation using Zod schemas
- Structured error handling with appropriate HTTP status codes
- JSON response format with mission data fields

**Business Logic Flow**:
1. Receive student ID from request
2. Check Google Sheets for existing mission record
3. If found: return existing mission
4. If not found: generate new mission via Gemini AI
5. Save newly generated mission to Google Sheets
6. Return mission data to client

### Data Storage

**Primary Database**: Google Sheets via Google Sheets API
- Acts as simple data store for mission records
- Each row contains: studentId, title, lore, antagonist, task, techStack, timestamp
- Connection managed through Replit Connectors with OAuth credentials
- Credentials cached to minimize API calls for token refresh

**Data Schema**:
```typescript
{
  studentId: string
  title: string
  lore: string
  antagonist: string
  task: string
  techStack: string
  timestamp: string (ISO format)
}
```

**Database Configuration** (Note: Drizzle ORM is configured but not actively used):
- `drizzle.config.ts` configured for PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Database URL expected via `DATABASE_URL` environment variable
- This suggests future migration capability to PostgreSQL

### External Dependencies

**AI Integration**: Google Gemini API (`@google/genai`)
- Model: `gemini-2.5-flash`
- Structured JSON output with schema validation
- System prompt defines "Chaos Architect" persona
- Generates absurd fictional software scenarios
- Response schema enforced for consistent mission format

**Google Services Integration**:
- Google Sheets API via `googleapis` package
- OAuth2 authentication through Replit Connectors
- Access tokens cached with expiration checking
- Automatic token refresh when expired
- Connection settings retrieved from Replit environment

**Environment Dependencies**:
- Replit-specific integrations for development (`@replit/vite-plugin-*`)
- Environment variables for authentication:
  - `GEMINI_API_KEY`: For AI generation
  - `REPLIT_CONNECTORS_HOSTNAME`: For connector API
  - `REPL_IDENTITY` or `WEB_REPL_RENEWAL`: For authentication tokens

**UI Libraries**:
- Radix UI primitives for accessible components
- Lucide React for icons
- TanStack React Query for data fetching (configured but not actively used)
- Tailwind CSS for utility-first styling
- Class Variance Authority for component variants

**Form Handling**:
- React Hook Form with Zod resolvers (available but not actively used)
- Basic HTML form handling in current implementation

**Development Tools**:
- TypeScript for type safety
- ESBuild for production builds
- PostCSS with Autoprefixer for CSS processing
- Vite dev server with HMR capabilities