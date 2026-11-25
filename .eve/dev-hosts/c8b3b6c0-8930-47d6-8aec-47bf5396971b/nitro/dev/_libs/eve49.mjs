import { DynamicSubagentAgentConfigKey, SteeredByKey, contextStorage } from "./eve7.mjs";
import "./eve12.mjs";
import "./eve16.mjs";
import { isSteeredApprovalPolicy, markSteeredApprovalPolicy, normalizeApprovalStatus, requesterOnlyResponse, resolveApprovalPolicy } from "./eve37.mjs";
import { joinEveRoutePath } from "./eve48.mjs";
import { sessionAgent } from "./eve52.mjs";
// node_modules/eve/dist/src/shared/public-route-prefix.js
function normalizePublicRoutePrefix(e) {
	let t = e?.trim();
	if (t === void 0 || t.length === 0) return;
	let n = (t.startsWith(`/`) ? t : `/${t}`).replace(/\/+$/, ``);
	return n.length === 0 ? void 0 : n;
}
// node_modules/eve/dist/src/execution/workflow-callback-url.js
function resolveVercelProductionCallbackBaseUrl() {
	return process.env.VERCEL_ENV === `production` && process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null;
}
function resolveWorkflowCallbackBaseUrl(e) {
	let t = process.env.WORKFLOW_LOCAL_BASE_URL?.trim() || void 0;
	let n = (resolveVercelProductionCallbackBaseUrl() ?? t ?? e).replace(/\/$/, ``);
	let r = normalizePublicRoutePrefix(process.env["EVE_PUBLIC_ROUTE_PREFIX"]);
	return r === void 0 ? n : `${n}${r}`;
}
function createBrowserCallbackUrl(e, t) {
	let n = new URL(t, `http://eve.local`);
	let r = new URL(e);
	return r.pathname = joinEveRoutePath(r.pathname, n.pathname), r.search = n.search, r.toString();
}
function createWorkflowCallbackUrl(e, t) {
	return createBrowserCallbackUrl(e, t);
}
// node_modules/eve/dist/src/runtime/connections/events/path.js
function connectionEventRoute(e) {
	return `/eve/v1/hooks/${encodeURIComponent(e)}`;
}
function connectionEventDestination(e) {
	return joinEveRoutePath(normalizePublicRoutePrefix(process.env["EVE_PUBLIC_ROUTE_PREFIX"]) ?? ``, connectionEventRoute(e));
}
function connectionEventHookToken(e) {
	return `eve:connection-event:${e}`;
}
// node_modules/eve/dist/src/runtime/connections/events/state.js
function sameEventOwner(e, t) {
	return e.connectionName === t.connectionName && e.instanceId === t.instanceId && e.connector === t.connector && e.principalKey === t.principalKey && e.executionPrincipal === t.executionPrincipal;
}
// node_modules/eve/dist/src/approval/agent.js
function rank(e) {
	let t = normalizeApprovalStatus(e);
	let n = typeof t == `object` ? t.type : t;
	return n === `denied` ? 3 : n === `user-approval` ? 2 : +(n === `approved`);
}
function strictestApproval(e) {
	let combined = async (t) => {
		let n;
		for (let r of e) {
			let e = await r(t);
			if (rank(e) >= rank(n) && (n = e), rank(n) === 3) break;
		}
		return n;
	};
	return e.some(isSteeredApprovalPolicy) ? markSteeredApprovalPolicy(combined) : combined;
}
function withSteeredResponseGuard(e) {
	return (t) => {
		if ((contextStorage.getStore()?.get(SteeredByKey) ?? []).length > 0) {
			let e = requesterOnlyResponse(t);
			if (e.status === `rejected`) return e;
		}
		return e(t);
	};
}
function withAgentApproval(e, t) {
	if (e === void 0) return t;
	if (t === void 0) return e;
	let n = resolveApprovalPolicy(t);
	let r = strictestApproval([e, n]);
	if (typeof t == `function`) return r;
	let i = isSteeredApprovalPolicy(e) || isSteeredApprovalPolicy(n);
	return t.response === void 0 || !i ? {
		...t,
		request: r
	} : {
		...t,
		request: r,
		response: withSteeredResponseGuard(t.response)
	};
}
function withAgentApprovalOnEntries(e, t) {
	return t === void 0 ? new Map(e) : new Map([...e].map(([e, n]) => [e, n.frameworkAction !== void 0 || n.interactionOnly === !0 ? n : {
		...n,
		approval: withAgentApproval(t, n.approval)
	}]));
}
// node_modules/eve/dist/src/execution/effective-agent-config.js
function agentSettings(e) {
	let t = e.ctx.get(DynamicSubagentAgentConfigKey);
	if (t !== void 0) return {
		compactionModel: t.compaction?.model,
		reasoning: t.reasoning,
		thresholdPercent: t.compaction?.thresholdPercent
	};
	let { settings: n } = sessionAgent(e.ctx);
	return {
		compactionModel: n.compaction?.model,
		reasoning: n.reasoning,
		thresholdPercent: n.compaction?.thresholdPercent
	};
}
function agentLimits(e, t) {
	let n = t.get(DynamicSubagentAgentConfigKey);
	return n === void 0 ? e.settings.limits : n.limits;
}
function resolveSessionUsageLimit(e) {
	let t = e.resolvedAgent.config?.limits?.sessionUsage ?? e.graph.nodesByNodeId.get("__root__")?.agent.config?.limits?.sessionUsage;
	return t === !1 ? () => !1 : t;
}
function resolveAgentApproval(e) {
	let t = e.graph.nodesByNodeId.get("__root__")?.agent.config?.approval;
	if (e.nodeId === void 0 || e.nodeId === "__root__") return t;
	let n = e.resolvedAgent.config?.approval;
	return n === void 0 ? t : t === void 0 ? n : strictestApproval([t, n]);
}
// node_modules/eve/dist/src/runtime/sessions/session-agent.js
function runtimeNodeId(e) {
	return e.nodeId ?? "__root__";
}
export { agentLimits, agentSettings, connectionEventDestination, connectionEventHookToken, createBrowserCallbackUrl, createWorkflowCallbackUrl, normalizePublicRoutePrefix, resolveAgentApproval, resolveSessionUsageLimit, resolveWorkflowCallbackBaseUrl, runtimeNodeId, sameEventOwner, withAgentApproval, withAgentApprovalOnEntries };

//# sourceMappingURL=eve49.mjs.map