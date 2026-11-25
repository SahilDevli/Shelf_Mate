import { ConnectionAuthorizationFailedError } from "./eve5.mjs";
import { SteeredByKey, contextScopeValue, contextStorage, withContextScopeValue } from "./eve7.mjs";
// node_modules/eve/dist/src/runtime/connections/identity-hold.js
const MODEL_CALL = Symbol.for(`eve.modelCall`);
function withModelCall(e) {
	return withContextScopeValue(MODEL_CALL, !0, e);
}
function steeredModelCall(e = contextStorage.getStore()) {
	return contextScopeValue(MODEL_CALL) === !0 && (e?.get(SteeredByKey) ?? []).length > 0;
}
function turnSteeredMessage(e) {
	return `Another person's message joined this turn after its caller last spoke, so ${e} can't use the caller's identity. Ask the caller to confirm in this conversation, then try again.`;
}
function holdCallerIdentity(e, t, n = `connection "${e}"`) {
	if (steeredModelCall(t)) throw new ConnectionAuthorizationFailedError(e, {
		message: turnSteeredMessage(n),
		reason: `turn_steered`,
		retryable: !1
	});
}
// node_modules/eve/dist/src/shared/principal-scope.js
const DISABLED_PRINCIPAL_TYPES = /* @__PURE__ */ new Set([`anonymous`, `runtime`]);
const PRINCIPAL_SCOPE_TRACKER = Symbol.for(`eve.principalScopeTracker`);
async function trackPrincipalScope(e) {
	let t = { used: !1 };
	return {
		value: await withContextScopeValue(PRINCIPAL_SCOPE_TRACKER, t, e),
		used: t.used
	};
}
function principalScope(e) {
	let t = e.current;
	if (t === null || DISABLED_PRINCIPAL_TYPES.has(t.principalType)) return null;
	let n = contextScopeValue(PRINCIPAL_SCOPE_TRACKER);
	return n !== void 0 && (n.used = !0), t.principalType === `local-dev` ? `local-dev` : JSON.stringify([
		t.principalType,
		t.authenticator,
		t.issuer ?? null,
		t.principalId
	]);
}
export { holdCallerIdentity, principalScope, steeredModelCall, trackPrincipalScope, turnSteeredMessage, withModelCall };

//# sourceMappingURL=eve41.mjs.map