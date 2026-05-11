import { ssr, ssrHydrationKey } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/dist/server.js';

const TOOLS_REGISTRY = {
  "json-formatter": {
    id: "json-formatter",
    name: "JSON Editor",
    description: "Professional JSON editor with tree view, format, diff, and bidirectional transforms.",
    shortDescription: "Edit & diff JSON locally.",
    icon: "format",
    category: "editor"
  },
  "json-validator": {
    id: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON instantly. All processing happens in your browser.",
    shortDescription: "Validate JSON locally.",
    icon: "lock",
    category: "editor"
  },
  "json-to-code": {
    id: "json-to-code",
    name: "JSON \u2192 Code",
    description: "Generate TypeScript interfaces, Zod schemas, Go structs, or Rust structs from any JSON.",
    shortDescription: "TypeScript \xB7 Zod \xB7 Go \xB7 Rust",
    icon: "code",
    category: "codegen"
  },
  "json-to-data": {
    id: "json-to-data",
    name: "JSON \u2192 Data",
    description: "Export JSON to SQL (with optional INSERT statements), CSV, or Excel spreadsheets.",
    shortDescription: "SQL \xB7 CSV \xB7 Excel",
    icon: "database",
    category: "dataops"
  },
  "json-to-spec": {
    id: "json-to-spec",
    name: "JSON \u2192 Specs",
    description: "Generate JSON Schema (draft 2020-12) or OpenAPI 3.0 YAML specification from a JSON sample.",
    shortDescription: "JSON Schema \xB7 OpenAPI",
    icon: "file",
    category: "specs"
  }
};
const TOOLS_LIST = Object.values(TOOLS_REGISTRY);
var _tmpl$ = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'], _tmpl$2 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>'], _tmpl$3 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'], _tmpl$4 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'], _tmpl$5 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'], _tmpl$10 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>'], _tmpl$12 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>'], _tmpl$13 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'], _tmpl$14 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>'], _tmpl$16 = ["<svg", ' width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>'], _tmpl$22 = ["<svg", ' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="4"></line><polyline points="14 8 18 4 22 8"></polyline><line x1="6" y1="4" x2="6" y2="20"></line><polyline points="10 16 6 20 2 16"></polyline></svg>'];
const LockIcon = () => ssr(_tmpl$, ssrHydrationKey());
const FormatIcon = () => ssr(_tmpl$2, ssrHydrationKey());
const CheckIcon = () => ssr(_tmpl$3, ssrHydrationKey());
const XIcon = () => ssr(_tmpl$4, ssrHydrationKey());
const CopyIcon = () => ssr(_tmpl$5, ssrHydrationKey());
const FullScreenIcon = () => ssr(_tmpl$10, ssrHydrationKey());
const FileIcon = () => ssr(_tmpl$12, ssrHydrationKey());
const FolderOpenIcon = () => ssr(_tmpl$13, ssrHydrationKey());
const SaveIcon = () => ssr(_tmpl$14, ssrHydrationKey());
const ChevronRightIcon = () => ssr(_tmpl$16, ssrHydrationKey());
const CompareIcon = () => ssr(_tmpl$22, ssrHydrationKey());

export { CompareIcon as C, FormatIcon as F, LockIcon as L, SaveIcon as S, TOOLS_LIST as T, XIcon as X, TOOLS_REGISTRY as a, FolderOpenIcon as b, FileIcon as c, CheckIcon as d, CopyIcon as e, FullScreenIcon as f, ChevronRightIcon as g };
//# sourceMappingURL=SvgIcons-BVQzuSjf.mjs.map
