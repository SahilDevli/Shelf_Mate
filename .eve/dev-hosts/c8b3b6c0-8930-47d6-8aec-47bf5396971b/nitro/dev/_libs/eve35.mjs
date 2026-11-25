import { z } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/zod/index.js";
// node_modules/eve/dist/src/discover/diagnostics.js
const discoverDiagnosticSeveritySchema = z.union([z.literal(`error`), z.literal(`warning`)]);
z.object({
	code: z.string(),
	message: z.string(),
	severity: discoverDiagnosticSeveritySchema,
	sourcePath: z.string()
}).strict();
const discoverDiagnosticsSummarySchema = z.object({
	errors: z.number().finite(),
	warnings: z.number().finite()
}).strict();
// node_modules/eve/dist/src/shared/web-search.js
const WEB_SEARCH_FALLBACK_PROVIDERS = [
	`exa`,
	`parallel`,
	`browserbase`,
	`tako`
];
const WEB_SEARCH_PROVIDERS = [...WEB_SEARCH_FALLBACK_PROVIDERS, `native`];
export { WEB_SEARCH_FALLBACK_PROVIDERS, WEB_SEARCH_PROVIDERS, discoverDiagnosticsSummarySchema };

//# sourceMappingURL=eve35.mjs.map