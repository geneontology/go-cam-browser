# AGENTS.md

## Commands

**Development server:**

```bash
npm run dev
```

Starts Vite dev server at http://localhost:5173

**Build:**

```bash
npm run build
```

Compiles TypeScript and builds production bundle

**Linting:**

```bash
npm run lint
```

Runs ESLint with TypeScript support

**Formatting:**

```bash
npm run format
```

Formats code with Prettier

**Format check:**

```bash
npm run format:check
```

Checks code formatting without making changes

## Architecture

**Framework Stack:**

- React 19 with TypeScript
- Vite for build tooling and dev server
- Mantine UI component library
- TanStack Query for data fetching
- FlexSearch for client-side search functionality

**Core Architecture:**
This is a static single-page application that displays GO-CAM (Gene Ontology Causal Activity Models) data loaded from a JSON file. The app implements a faceted search interface with real-time filtering.

**Key Patterns:**

1. **Configuration-driven UI:** As much as possible, the interface is generated from field configurations in `src/config.tsx`. Each field defines its display behavior, searchability, faceting type, and rendering function.

2. **Type-safe field configuration:** Uses TypeScript generics in `src/types.ts` to ensure field configurations match the data model (`IndexedGoCam` type).

3. **Faceted filtering system:** `src/hooks/useFacets.ts` implements the faceting and filtering system supporting:
   - Text facets (single selection)
   - Array facets (multi-selection with AND logic)
   - Numeric facets (range filtering)

4. **Search integration:** `src/hooks/useSearch.ts` uses FlexSearch for full-text search across configurable fields, integrated with the faceting system.

**Data Flow:**

1. JSON data loaded via TanStack Query (`src/hooks/useQueryData.ts`)
2. Search indexing creates searchable subset
3. Facets calculated from search results
4. Filters applied to generate final result set
5. Results displayed in configurable table format

**Key Files:**

- `src/config.tsx` - Central configuration defining all field behavior
- `src/types.ts` - TypeScript types and configuration helpers
- `src/hooks/useFacets.ts` - Complex faceting and filtering logic
- `src/App.tsx` - Main application shell with Mantine AppShell layout

**Styling:**
Uses Mantine's CSS-in-JS system with CSS modules for custom styles. PostCSS configured for Mantine preset and CSS variables.

**Deployment:**
Configured for GitHub Pages deployment with base path `/go-cam-browser/` in vite.config.ts.
