import { isObject } from "./eve3.mjs";
import { createLogger } from "./eve4.mjs";
import { ParentSessionKey, TraceRootKey } from "./eve7.mjs";
import { isSampledTrace, readGatewayRouting, readInstrumentationDecision, resolveTracePolicy, resolveTracePolicyDecision } from "./eve8.mjs";
import { resolveConversationId, stripEveTraceBaggage } from "./eve9.mjs";
import { context, createContextKey, propagation, trace } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/api/index.js";
import { createAgentRun } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/index.js";
import { registerTelemetry } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/ai/dist/index.js";
import { OpenTelemetry } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@ai-sdk/otel/index.js";
// node_modules/eve/dist/src/instrumentation/ai-sdk-warnings.js
const log$1 = createLogger(`harness.ai-sdk-warnings`);
function ensureAiSdkWarningLogger() {
	globalThis.AI_SDK_LOG_WARNINGS === void 0 && (globalThis.AI_SDK_LOG_WARNINGS = process.env.AI_SDK_LOG_WARNINGS !== `false` && logAiSdkWarnings);
}
const logAiSdkWarnings = ({ warnings: e, provider: t, model: n }) => {
	for (let r of e) {
		let e = {
			model: n,
			provider: t,
			warning: r
		};
		let i = `message` in r ? r.message : r.details ?? r.feature;
		r.type === `compatibility` ? log$1.info(i, e) : log$1.warn(i, e);
	}
};
// node_modules/eve/dist/src/shared/trace-root.js
function resolveTraceRootSessionId(e, t) {
	let n = e.get(TraceRootKey);
	return n?.kind === `own` ? t : n?.kind === `inherited` ? n.sessionId : e.get(ParentSessionKey)?.rootSessionId ?? t;
}
// node_modules/eve/dist/src/instrumentation/ai-sdk-telemetry.js
function aiSdkCapture(e, t) {
	return {
		recordInputs: e.recordInputs || t.authoredCapturesInputs === !0,
		recordOutputs: e.recordOutputs || t.authoredCapturesOutputs === !0
	};
}
const log = createLogger(`harness.ai-sdk-telemetry`);
let registered = !1;
let eveOtelIntegration;
let errorSafeEveOtelIntegration;
let warnedMissingEveOtelIntegration = !1;
function ensureOtelIntegration() {
	registered || (registered = !0, eveOtelIntegration = new OpenTelemetry({ runtimeContext: !0 }), errorSafeEveOtelIntegration = telemetryWithoutErrorContent(eveOtelIntegration), registerTelemetry(eveOtelIntegration));
}
function getRegisteredTelemetryIntegrations(e) {
	let t = globalThis.AI_SDK_TELEMETRY_INTEGRATIONS ?? [];
	let n = e?.excludeEveOtelIntegration === !0 ? t.filter((e) => e !== eveOtelIntegration) : t;
	if (e?.sanitizeEveOtelErrors !== !0) return n;
	let r = !1;
	let i = n.map((e) => e !== eveOtelIntegration || errorSafeEveOtelIntegration === void 0 ? e : (r = !0, errorSafeEveOtelIntegration));
	return !r && e.excludeEveOtelIntegration !== !0 && !warnedMissingEveOtelIntegration && (warnedMissingEveOtelIntegration = !0, log.warn(`could not sanitize eve's AI SDK OpenTelemetry integration`, { reason: eveOtelIntegration === void 0 ? `eve OpenTelemetry integration was not registered` : `registered integration identity did not match` })), i;
}
function telemetryWithoutErrorContent(e) {
	let genericError = () => Error(`AI SDK operation failed`);
	return new Proxy(e, { get(e, t) {
		if (t === `onError` && e.onError !== void 0) return (t) => e.onError(typeof t == `object` && t ? {
			...t,
			error: genericError()
		} : genericError());
		if (t === `onToolExecutionEnd` && e.onToolExecutionEnd !== void 0) return (t) => e.onToolExecutionEnd(t.toolOutput.type === `tool-error` ? {
			...t,
			toolOutput: {
				...t.toolOutput,
				error: genericError()
			}
		} : t);
		let n = Reflect.get(e, t);
		return typeof n == `function` ? n.bind(e) : n;
	} });
}
// node_modules/eve/dist/src/instrumentation/trace-decision.js
function resolveInstrumentationTraceDecision(e, t, n, r, i) {
	if (e !== void 0) return r?.decision === void 0 ? i === void 0 ? r === void 0 ? resolveTracePolicy(e.tracePolicy, {
		agentName: t,
		...n
	}) : resolveTracePolicyDecision(isSampledTrace(r), n) : i : readInstrumentationDecision(r.decision);
}
// node_modules/eve/dist/src/tracing/eve/gateway.js
const SUPPRESS_TRACING_KEY = createContextKey(`OpenTelemetry SDK Context Key SUPPRESS_TRACING`);
const traceContextSetter = { set(e, t, n) {
	e[t] = n;
} };
function createGatewayTraceContextHeaders() {
	let e = context.active();
	if (e.getValue(SUPPRESS_TRACING_KEY) === !0 || trace.getSpan(e) === void 0) return;
	let t = {};
	return propagation.inject(e, t, traceContextSetter), stripEveTraceBaggage(t), Object.keys(t).length === 0 ? void 0 : t;
}
function gatewayCostAttributes(e) {
	return {
		"gen_ai.usage.cost": e.cost,
		"gen_ai.usage.gateway_cost": e.gatewayCost,
		"gen_ai.usage.input_cost": e.inputCost,
		"gen_ai.usage.output_cost": e.outputCost,
		"gen_ai.generation.id": e.generationId
	};
}
function readGatewayCostData(e) {
	if (e === void 0) return;
	let t = e.gateway;
	if (typeof t != `object` || !t || Array.isArray(t)) return;
	let n = t;
	return {
		cost: readUsd(n.cost),
		gatewayCost: readUsd(n.gatewayCost),
		inputCost: readUsd(n.inputInferenceCost),
		outputCost: readUsd(n.outputInferenceCost),
		generationId: typeof n.generationId == `string` && n.generationId.length > 0 ? n.generationId : void 0
	};
}
function gatewayRoutingAttributes(e) {
	let t = e?.gateway;
	let n = readGatewayRouting(isObject(t) ? t.routing : void 0);
	if (n !== void 0) return {
		"vercel.ai_gateway.client_session_id": n.clientSessionId,
		"vercel.ai_gateway.client_session_id_source": n.clientSessionIdSource,
		"vercel.ai_gateway.affinity.outcome": n.affinity?.outcome,
		"vercel.ai_gateway.affinity.pinned_provider": n.affinity?.pinnedProvider,
		"vercel.ai_gateway.affinity.displaced_provider": n.affinity?.displacedProvider
	};
}
function readUsd(e) {
	if (typeof e != `string` || e.trim() === ``) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
// node_modules/eve/dist/src/connections/errors.js
var ConnectionAuthorizationRequiredError = class extends Error {
	connectionName;
	constructor(e, t) {
		super(t?.message ?? `Connection "${e}" requires authorization.`), this.name = `ConnectionAuthorizationRequiredError`, this.connectionName = e;
	}
};
var ConnectionAuthorizationFailedError = class extends Error {
	connectionName;
	reason;
	retryable;
	constructor(e, t) {
		super(t?.message ?? `Connection "${e}" authorization failed.`), this.name = `ConnectionAuthorizationFailedError`, this.connectionName = e, this.reason = t?.reason, this.retryable = t?.retryable ?? !0;
	}
};
function isConnectionAuthorizationRequiredError(e) {
	return e instanceof Error && e.name === `ConnectionAuthorizationRequiredError`;
}
function isConnectionAuthorizationFailedError(e) {
	return e instanceof Error && e.name === `ConnectionAuthorizationFailedError`;
}
// node_modules/eve/dist/src/tracing/eve/operation-input.js
function checkpointContent(e) {
	if (e !== void 0) try {
		return JSON.parse(e);
	} catch {
		return;
	}
}
function eveTurnIdentity(e) {
	return {
		conversationId: resolveConversationId(e.rootSessionId ?? e.sessionId),
		runId: e.sessionId,
		turnId: e.turnId
	};
}
function createEveTracing(e) {
	return createAgentRun({
		telemetry: e.telemetry,
		checkpointer: {
			get: (t) => e.stateStore.get(`checkpoint`, t),
			set: (t, n) => e.stateStore.set(`checkpoint`, t, n),
			delete: (t) => e.stateStore.delete(`checkpoint`, t)
		}
	});
}
export { ConnectionAuthorizationFailedError, ConnectionAuthorizationRequiredError, aiSdkCapture, checkpointContent, createEveTracing, createGatewayTraceContextHeaders, ensureAiSdkWarningLogger, ensureOtelIntegration, eveTurnIdentity, gatewayCostAttributes, gatewayRoutingAttributes, getRegisteredTelemetryIntegrations, isConnectionAuthorizationFailedError, isConnectionAuthorizationRequiredError, readGatewayCostData, resolveInstrumentationTraceDecision, resolveTraceRootSessionId };

//# sourceMappingURL=eve5.mjs.map