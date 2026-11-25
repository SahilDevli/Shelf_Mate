import "./eve16.mjs";
// node_modules/eve/dist/src/shared/eve-route-path.js
const EVE_NAMED_AGENT_MOUNT_PATTERN = /^\/eve\/[a-z0-9][a-z0-9_-]*$/;
const EVE_NAMED_AGENT_PROTOCOL_PATTERN = /^\/eve\/[a-z0-9][a-z0-9_-]*\/v1$/;
function joinEveRoutePath(e, t) {
	let n = trimTrailingSlash(e);
	let r = t.startsWith(`/`) ? t : `/${t}`;
	if (r === "/eve/v1" || r.startsWith(`/eve/v1/`)) {
		if (EVE_NAMED_AGENT_MOUNT_PATTERN.test(n)) return `${n}${r.slice(4)}`;
		if (EVE_NAMED_AGENT_PROTOCOL_PATTERN.test(n)) return `${n}${r.slice(7)}`;
	}
	return `${n}${r}`;
}
function normalizePublicEveRoutePath(e) {
	return e.replace(/^\/eve\/[a-z0-9][a-z0-9_-]*\/v1(?=\/|$)/, "/eve/v1");
}
function trimTrailingSlash(e) {
	return e === `/` ? `` : e.endsWith(`/`) ? e.slice(0, -1) : e;
}
// node_modules/eve/dist/src/runtime/types.js
function declared(e, t) {
	return e.definitions.filter((e) => e.kind === t);
}
export { declared, joinEveRoutePath, normalizePublicEveRoutePath };

//# sourceMappingURL=eve48.mjs.map