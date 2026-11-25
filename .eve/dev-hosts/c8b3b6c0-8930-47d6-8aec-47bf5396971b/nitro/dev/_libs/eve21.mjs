import { isDynamicSentinel } from "./eve20.mjs";
// node_modules/eve/dist/src/shared/agent-definition.js
const ANTHROPIC_PROMPT_CACHE_TTLS = [`5m`, `1h`];
function isDynamicModelDefinition(e) {
	return isDynamicSentinel(e);
}
const AGENT_WORKFLOW_RETENTION_VALUES = [0, `default`];
export { AGENT_WORKFLOW_RETENTION_VALUES, ANTHROPIC_PROMPT_CACHE_TTLS, isDynamicModelDefinition };

//# sourceMappingURL=eve21.mjs.map