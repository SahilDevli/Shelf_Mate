import { SessionIdKey, contextStorage } from "./eve7.mjs";
import { createLogger, logError } from "./eve4.mjs";
import { markAgentTraceContext, sessionAgent } from "./eve52.mjs";
import { formatTraceparent } from "./eve53.mjs";
import { ContextAgentTraceStateStore, eveOutputMapping, getInstrumentationRuntime, resolveTracePolicy } from "./eve8.mjs";
import { readInstrumentationSessionContext, withChannelAudience } from "./eve12.mjs";
import { ROOT_CONTEXT, context, trace } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/api/index.js";
import { otelTelemetry } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/index.js";
import { activeTraceOperation, truncateTelemetryText, withErrorContent } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/otel.js";
// node_modules/eve/dist/src/tracing/eve/connection-events.js
const log = createLogger(`connection.events`);
function connectionEventTraceContext(e) {
	if (typeof e != `object` || !e) return;
	let { traceId: t, spanId: n, traceFlags: r } = e;
	if (typeof t != `string` || typeof n != `string` || r !== 0 && r !== 1) return;
	let i = {
		traceId: t,
		spanId: n,
		traceFlags: r
	};
	return formatTraceparent(i) === void 0 ? void 0 : i;
}
function connectionEventAttributes(e) {
	let t = {};
	for (let [n, r] of Object.entries({
		"agent.connection.name": e.connectionName,
		"agent.run.id": e.sessionId,
		"connect.subscription.id": e.subscriptionId,
		"connect.delivery.id": e.deliveryId,
		"eve.connection.event.binding.id": e.bindingId
	})) r !== void 0 && (t[n] = truncateTelemetryText(r, 256));
	return t;
}
function connectionEventError(e) {
	let t = Error(`Connection event operation failed`);
	if (e instanceof Error && [
		`Error`,
		`TypeError`,
		`RangeError`,
		`SyntaxError`,
		`AbortError`,
		`TimeoutError`,
		`MCPClientError`
	].includes(e.name) && (t.name = e.name), typeof e != `object` || !e) return t;
	let n = e;
	let r = n.code;
	let i = n.statusCode ?? n.status;
	let a = typeof r == `number` && Number.isFinite(r) || typeof r == `string` && [
		`invalid_delivery`,
		`verification_unavailable`,
		`configuration_error`,
		`ETIMEDOUT`,
		`ECONNRESET`,
		`ECONNREFUSED`,
		`ENOTFOUND`,
		`EAI_AGAIN`
	].includes(r) ? r : void 0;
	return a !== void 0 && Object.assign(t, { code: a }), typeof i == `number` && Number.isInteger(i) && i >= 100 && i <= 599 && Object.assign(t, { statusCode: i }), t;
}
async function withConnectionEventSpan(e, t) {
	return contextStorage.run(e.ctx, async () => {
		let n = otelTelemetry({
			tracerName: `eve.connection.events`,
			mapping: eveOutputMapping()
		});
		let r = connectionEventAttributes({
			...e,
			sessionId: e.ctx.require(SessionIdKey)
		});
		let run = async (n) => {
			try {
				return await t(n);
			} catch (t) {
				throw logError(log, `connection event operation failed`, connectionEventError(t), {
					...r,
					operation: e.operation
				}), t;
			}
		};
		let i = sideSpanHost(e.ctx, connectionEventTraceContext(e.requestTraceContext));
		if (i === void 0) return n.suppressed(() => run());
		let a = `agent.connection.event.${e.operation}`;
		let o = n.startSpan({
			type: `step`,
			operationId: a,
			name: a,
			kind: e.operation.startsWith(`on`) ? `CONSUMER` : `INTERNAL`,
			attributes: {
				...r,
				"operation.name": a,
				"resource.name": a
			}
		}, { context: i });
		try {
			let t = await n.run({
				type: `step`,
				reference: o.reference,
				capture: {
					emit: !0,
					recordInputs: !1,
					recordOutputs: !1
				}
			}, () => run(connectionEventTraceContext(o.reference)), i);
			if ([
				`subscribe`,
				`get`,
				`unsubscribe`
			].includes(e.operation) && typeof t == `object` && t) {
				let e = t;
				typeof e.id == `string` && o.setAttribute(`connect.subscription.id`, truncateTelemetryText(e.id, 256)), typeof e.status == `string` && [
					`pending`,
					`active`,
					`needs_auth`,
					`stopped`,
					`expired`,
					`failed`
				].includes(e.status) && o.setAttribute(`connect.subscription.status`, e.status);
			}
			return o.setAttribute(`eve.connection.event.outcome`, `completed`), o.setStatus(`OK`), t;
		} catch (e) {
			throw o.setAttribute(`eve.connection.event.outcome`, `failed`), o.fail(void 0, `connection_event_error`), e;
		} finally {
			o.end(), await getInstrumentationRuntime().forceFlush().catch(() => log.warn(`flushing connection event traces failed`));
		}
	});
}
function sideSpanHost(e, t) {
	let n = getInstrumentationRuntime()?.otelSettings;
	if (n === void 0) return;
	let r = e.require(SessionIdKey);
	let i = new ContextAgentTraceStateStore().get(`session`, r);
	let a = readInstrumentationSessionContext(e);
	let o = a.traceSeed?.decision ?? i?.decision ?? resolveTracePolicy(n.tracePolicy, {
		...a.conversation,
		agentName: sessionAgent(e).name ?? `eve`
	});
	let s = activeTraceOperation();
	let c = t ?? s?.reference ?? i?.context;
	if (o.action === `drop` || s?.capture.emit === !1 || a.traceSeed !== void 0 && !(a.traceSeed.traceFlags & 1) || i !== void 0 && !(i.context.traceFlags & 1) || c !== void 0 && !(c.traceFlags & 1)) return;
	let l = c === void 0 ? context.active() : trace.setSpan(ROOT_CONTEXT, trace.wrapSpanContext(c));
	return markAgentTraceContext(withErrorContent(withChannelAudience(l, a.audience), !1));
}
export { connectionEventAttributes, connectionEventError, connectionEventTraceContext, sideSpanHost, withConnectionEventSpan };

//# sourceMappingURL=eve54.mjs.map