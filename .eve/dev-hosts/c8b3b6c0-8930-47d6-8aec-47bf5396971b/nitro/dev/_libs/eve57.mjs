import "./eve44.mjs";
import { WORKFLOW_TOOL_ENTRY_POINTS } from "./eve15.mjs";
// node_modules/eve/dist/src/tools/workflow-definition.js
const WORKFLOW_TOOL_BRAND = Symbol.for(`eve:workflow-tool-brand`);
function isWorkflowToolDefinition(e) {
	return typeof e == `object` && !!e && Reflect.get(e, WORKFLOW_TOOL_BRAND) === !0;
}
function readWorkflowToolEntryPoints(e) {
	return WORKFLOW_TOOL_ENTRY_POINTS.filter((t) => Reflect.get(e, t) !== void 0);
}
export { isWorkflowToolDefinition, readWorkflowToolEntryPoints };

//# sourceMappingURL=eve57.mjs.map