# FileTree Explorer

Paste or upload a JSON directory tree, browse it, inspect nodes and search by name.

```bash
npm install && npm run dev
```

Requires Node 22.12+. Tests: `npm test`. An `example.json` is included for manual testing.

## Stack

React 19, TypeScript (strict), React Router 6, Zustand, Tailwind 4, Vite 8, Vitest + Testing Library.

## Architecture decisions

- **Logic lives outside React.** `src/lib/tree.ts` holds parsing, validation, lookup, sizing and search as plain functions. They are unit-tested without rendering anything, and the components stay thin.
- **Validation up front.** The input is checked once on load, and errors point at the broken node (`root/src/x: invalid size`). After that the rest of the app trusts the types. Names containing `/` and duplicate sibling names are rejected because they would make paths ambiguous.
- **Path as identity.** Nodes are addressed by their path from the root (`src/components/Button.tsx`). The same string is used for URLs, lookups and the expanded-folder state, so no IDs are generated.
- **URL is the source of truth for navigation.** The node path is a splat route (`/tree/*`) with each segment encoded separately, which keeps URLs readable (`/tree/src/components/Button.tsx` instead of `%2F`). The search query lives in `?q=`, so results survive refresh and can be shared as links.
- **Persistence via Zustand `persist`.** The loaded tree and the expanded folders are kept in localStorage, so refresh and deep links keep working without a backend. Routes under `/tree` redirect to `/` when no tree is loaded.
- **Brief deviations.** The brief asks for Node 18+ and `/tree/:nodePath`. Current Vite and Vitest need Node 22.12+ (Node 18 is end-of-life), and the splat route gives the same URLs as the brief's example without `%2F` encoding.

## With more time

- Virtualize the tree for very large inputs and debounce search.
- Parse large files in a Web Worker so the UI doesn't freeze.
- Store trees in IndexedDB (or a small backend with SQLite) to lift the localStorage size limit and keep several trees.
- Keyboard navigation and full ARIA tree semantics (`role="tree"`, arrow keys).
- Highlight the matched part of names in search results, and offer sorting and filtering by type.
- E2E tests with Playwright.

## Known limitations

- localStorage holds roughly 5 MB, so a very large tree may fail to persist after loading.
- The whole tree renders at once when expanded, and search runs on every keystroke. Both are fine for thousands of nodes but not for hundreds of thousands.
- Search is a case-insensitive substring match on names only, without globs or regex.
- Only one tree is kept at a time, and loading a new one replaces it.
