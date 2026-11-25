import { SessionTraceSeedKey, contextStorage } from "./eve7.mjs";
import { applyLiveDeliveryAudienceCeiling, normalizeChannelAudience, resolveForwardedTraceSeed } from "./eve8.mjs";
import { withChannelAudience } from "./eve12.mjs";
import { eveTurnIdentity } from "./eve5.mjs";
import { ROOT_CONTEXT, context, trace } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/api/index.js";
import "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/index.js";
import { activeTraceOperation } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/otel.js";
// node_modules/eve/dist/src/tracing/eve/agent-memory-instrumentation.js
function recordMemoryToolStore(e, t) {
	activeTraceOperation()?.memory?.store({
		storeId: e,
		slot: t
	});
}
function createAgentMemoryInstrumentation(e) {
	return { async runInContext(t, n) {
		let r = await e.stateStore.get(`session`, t.sessionId);
		let i = t.turnId === void 0 ? void 0 : await e.stateStore.get(`turn`, JSON.stringify([t.sessionId, t.turnId]));
		let a = activeTraceOperation();
		let o = a?.reference ?? i?.context ?? r?.context;
		if (o === void 0) return await n();
		let s = a === void 0 ? withChannelAudience(trace.setSpan(ROOT_CONTEXT, trace.wrapSpanContext(o)), r?.channelAudience) : context.active();
		let c = resolveForwardedTraceSeed(contextStorage.getStore()?.get(SessionTraceSeedKey));
		let l = c?.decision ?? r?.decision;
		let u = l === void 0 ? void 0 : applyLiveDeliveryAudienceCeiling(l, normalizeChannelAudience(r?.channelAudience), c?.forwardedTracePolicy, e.environment);
		let d = {
			emit: !!(o.traceFlags & 1),
			recordInputs: u?.action === `record` && u.recordInputs,
			recordOutputs: e.recordOutputs === !0 && u?.action === `record` && u.recordOutputs
		};
		let f = {
			identity: eveTurnIdentity({
				...t,
				turnId: t.turnId ?? ``
			}),
			parent: o,
			context: s,
			capture: d,
			phase: t.phase,
			slot: t.slot,
			storeId: t.storeId,
			describe(e) {
				let t = e;
				return {
					recordCount: t.recordCount,
					records: t.outputRecords
				};
			}
		};
		let p = e.tracing.memory;
		return t.operationName === `search_memory` ? await p.search(f, n) : await p.write(f, n);
	} };
}
export { createAgentMemoryInstrumentation, recordMemoryToolStore };

//# sourceMappingURL=eve33.mjs.map