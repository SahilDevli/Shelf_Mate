import { stampDefinitionKey } from "./eve20.mjs";
// node_modules/eve/dist/src/tools/dynamic.js
const TOOL_BRAND = Symbol.for(`eve:tool-brand`);
function isBrandedToolEntry(e) {
	return typeof e == `object` && !!e && e[TOOL_BRAND] === !0;
}
// node_modules/eve/dist/src/tools/definition.js
function defineTool(e) {
	return stampToolDefinition(e, `defineTool`);
}
function stampToolDefinition(e, t) {
	if (e.auth !== void 0) throw Error(`${t}: The "auth" field is no longer supported. Pass auth providers inline to ctx.getToken(provider) or ctx.requireAuth(provider).`);
	if (`approvalKey` in e) throw Error(`${t}: approvalKey is no longer supported. Use an approval policy for input-dependent decisions.`);
	return Object.assign(e, { [TOOL_BRAND]: !0 }), stampDefinitionKey(e, `tool:${e.description}`), e;
}
export { defineTool, isBrandedToolEntry, stampToolDefinition };

//# sourceMappingURL=eve44.mjs.map