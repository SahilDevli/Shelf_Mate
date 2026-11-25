import { resolveInstalledPackageInfo } from "./eve2.mjs";
import { connectionAuthorizationAttributes } from "./eve27.mjs";
import { resolveInstrumentationEnvironment } from "./eve11.mjs";
import { createLogger, formatError } from "./eve4.mjs";
import { ContextAgentTraceStateStore, ConversationContextKey, actionIdempotencyKey, applyAudienceCeiling, applyLiveDeliveryAudienceCeiling, applyPrincipalTraceDecision, attemptIdempotencyKey, createInstrumentationHooks, eveOutputMapping, getInstrumentationRuntime, isSampledTrace, normalizeChannelAudience, normalizeInstrumentationChannelKind, readInstrumentationDecision, registerInstrumentationRuntime, resolveForwardedTraceSeed, resolveTracePolicy, resolveTracePolicyDecision, traceStepIndex, withInstrumentationDecision, withoutInstrumentationContent } from "./eve8.mjs";
import { channelAudienceFromContext, withChannelAudience } from "./eve12.mjs";
import { renameWithTransientBusyRetry } from "./eve32.mjs";
import { ConversationIdKey, SessionTraceSeedKey, contextStorage } from "./eve7.mjs";
import { conversationIdFromContext, isUserMessageKind, readConversationId, traceSessionIdFromContext, traceSessionIdOf, withOperationTraceContext } from "./eve9.mjs";
import { isObject } from "./eve3.mjs";
import { checkpointContent, createEveTracing, eveTurnIdentity, gatewayCostAttributes, gatewayRoutingAttributes, readGatewayCostData } from "./eve5.mjs";
import { createAgentMemoryInstrumentation } from "./eve33.mjs";
import { enteredView } from "./eve29.mjs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { ROOT_CONTEXT, SpanKind, TraceFlags, context, createContextKey, metrics, propagation, trace } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/api/index.js";
import { AgentSpanIdGenerator, otelTelemetry } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/index.js";
import { contentAttribute, invocationName, withoutDeclinedContent } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/otel.js";
import { createHash } from "node:crypto";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { JsonTraceSerializer } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/otlp-transformer/index.js";
import { registerOTel } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/otel/index.js";
// node_modules/eve/dist/src/internal/workflow/development-world-protocol.js
const DEVELOPMENT_WORLD_OPERATIONS = [
	`events.create`,
	`events.get`,
	`events.list`,
	`events.listByCorrelationId`,
	`hooks.get`,
	`hooks.getByToken`,
	`hooks.list`,
	`getDeploymentId`,
	`queue`,
	`resolveLatestDeploymentId`,
	`runs.experimentalSetAttributes`,
	`runs.get`,
	`runs.list`,
	`steps.get`,
	`steps.list`,
	`streams.close`,
	`streams.getChunks`,
	`streams.getInfo`,
	`streams.list`,
	`streams.write`,
	`streams.writeMulti`
];
// node_modules/eve/dist/src/instrumentation/provider.js
const PROVIDER = Symbol.for(`eve.instrumentation.provider`);
// node_modules/eve/dist/src/tracing/eve/batch-span-processor.js
const SUPPRESS_TRACING_KEY = createContextKey(`OpenTelemetry SDK Context Key SUPPRESS_TRACING`);
const DEFAULTS = {
	exportTimeoutMillis: 3e4,
	maxExportBatchSize: 512,
	maxQueueSize: 2048,
	scheduledDelayMillis: 5e3
};
function batchSpanProcessor(e, t = {}) {
	let report = (e, n) => {
		try {
			t.diagnostic?.(e, n);
		} catch {}
	};
	let n = t.exportTimeoutMillis ?? DEFAULTS.exportTimeoutMillis;
	let r = t.maxExportBatchSize ?? DEFAULTS.maxExportBatchSize;
	let i = t.maxQueueSize ?? DEFAULTS.maxQueueSize;
	let a = t.scheduledDelayMillis ?? DEFAULTS.scheduledDelayMillis;
	let o = [];
	let s;
	let c = Promise.resolve();
	let l = !1;
	function cancelTimer() {
		s !== void 0 && (clearTimeout(s), s = void 0);
	}
	function scheduleDrain() {
		s === void 0 && (s = setTimeout(() => {
			s = void 0, drain();
		}, a), s.unref?.());
	}
	function drain() {
		return waitForExporter(pendingDrain(), `span export`).then(() => void 0);
	}
	async function exportBatch(t) {
		try {
			await new Promise((n, r) => {
				try {
					context.with(context.active().setValue(SUPPRESS_TRACING_KEY, !0), () => {
						e.export(t, (e) => {
							e.code === 0 ? n() : r(e.error ?? Error(`Span export failed.`));
						});
					});
				} catch (e) {
					r(e instanceof Error ? e : Error(String(e)));
				}
			});
		} catch (e) {
			report(`span export failed`, { error: e });
		}
	}
	return {
		async forceFlush() {
			!l && await waitForExporter(pendingDrain(), `span export`) && e.forceFlush !== void 0 && await waitForExporter(settleExporter(`exporter flush`, e.forceFlush), `exporter flush`);
		},
		onEnd(e) {
			l || isSampled$1(e) && (o.length >= i || (o.push(e), o.length >= r ? drain() : scheduleDrain()));
		},
		onStart() {},
		async shutdown() {
			l = !0;
			let t = pendingDrain();
			await waitForExporter(t, `span export`) ? await waitForExporter(settleExporter(`exporter shutdown`, e.shutdown), `exporter shutdown`) : t.then(() => settleExporter(`exporter shutdown`, e.shutdown));
		}
	};
	function pendingDrain() {
		return cancelTimer(), c = c.then(async () => {
			for (; o.length > 0;) await exportBatch(o.splice(0, r));
		}), c;
	}
	async function waitForExporter(e, t) {
		let r;
		let i = new Promise((e) => {
			r = setTimeout(() => {
				report(`${t} timed out; preserving exporter serialization`, { timeoutMillis: n }), e(!1);
			}, n), r.unref?.();
		});
		let a = e.then(() => !0);
		try {
			return await Promise.race([a, i]);
		} finally {
			clearTimeout(r);
		}
	}
	async function settleExporter(t, n) {
		try {
			await n.call(e);
		} catch (e) {
			report(`${t} failed`, { error: e });
		}
	}
}
function isSampled$1(e) {
	if (typeof e != `object` || !e || !(`spanContext` in e)) return !1;
	let t = e.spanContext;
	if (typeof t != `function`) return !1;
	let n = Reflect.apply(t, e, []);
	return typeof n.traceFlags == `number` && (n.traceFlags & TraceFlags.SAMPLED) === TraceFlags.SAMPLED;
}
// node_modules/eve/dist/src/tracing/eve/span-export-policy.js
function normalizeSpanExportPolicies(e) {
	return e === void 0 ? [] : Array.isArray(e) ? e : [e];
}
// node_modules/eve/dist/src/shared/atomic-write-file.js
async function atomicWriteFile(e, t) {
	let n = `${e}.tmp-${process.pid}-${Date.now().toString(36)}`;
	await writeFile(n, t);
	try {
		await renameWithTransientBusyRetry(n, e);
	} catch (e) {
		throw await rm(n, { force: !0 }).catch(() => void 0), e;
	}
}
// node_modules/eve/dist/src/tracing/local/trace-discovery-index.js
const INDEX_DIRECTORY = `index/v1`;
const CONVERSATIONS_DIRECTORY = `${INDEX_DIRECTORY}/conversations`;
const INDEXED_MARKER = `${INDEX_DIRECTORY}/indexed`;
function localTraceConversationIndexKey(e) {
	return createHash(`sha256`).update(e).digest(`hex`);
}
function localTraceConversationMarker(e) {
	return `${CONVERSATIONS_DIRECTORY}/${localTraceConversationIndexKey(e)}`;
}
async function indexLocalTraceConversation(e) {
	let t = join(e.traceDirectory, localTraceConversationMarker(e.conversationId));
	await mkdir(join(e.traceDirectory, CONVERSATIONS_DIRECTORY), { recursive: !0 }), await createMarker(t), await createMarker(join(e.traceDirectory, INDEXED_MARKER));
}
async function createMarker(e) {
	try {
		await writeFile(e, ``, { flag: `wx` });
	} catch (e) {
		if (!isAlreadyPresent(e)) throw e;
	}
}
function isAlreadyPresent(e) {
	return e instanceof Error && `code` in e && e.code === `EEXIST`;
}
// node_modules/eve/dist/src/tracing/local/trace-span-processor.js
const log$4 = createLogger(`harness.local-trace-span-processor`);
function resolveLocalTraceStoreDirectory(e) {
	return join(e, `.eve`, `traces`);
}
function resolveLocalTraceSchemaDirectory(e) {
	return join(resolveLocalTraceStoreDirectory(e), `v1`);
}
function resolveLocalTraceDirectory(e, t) {
	return join(resolveLocalTraceSchemaDirectory(e), t);
}
function resolveLocalTraceSegmentsDirectory(e, t) {
	return join(resolveLocalTraceDirectory(e, t), `segments`);
}
var LocalTraceSpanProcessor = class {
	#e;
	#t = Promise.resolve();
	#n = !1;
	constructor(e) {
		this.#e = e;
	}
	forceFlush() {
		return this.#t;
	}
	onStart() {}
	onEnd(e) {
		if (!isReadableSpan(e)) return;
		let { spanId: t, traceId: n } = e.spanContext();
		if (!isHexId(n, 32) || !isHexId(t, 16)) return;
		let r = JsonTraceSerializer.serializeRequest([e]);
		if (r === void 0) return;
		let i = e.attributes[`gen_ai.conversation.id`];
		let a = typeof i == `string` && i.length > 0 ? i : void 0;
		this.#t = this.#t.then(async () => {
			let e = resolveLocalTraceDirectory(this.#e, n);
			let i = resolveLocalTraceSegmentsDirectory(this.#e, n);
			await mkdir(i, { recursive: !0 }), await atomicWriteFile(join(i, `${t}.otlp.json`), r), a !== void 0 && await indexLocalTraceConversation({
				conversationId: a,
				traceDirectory: e
			});
		}).catch((e) => {
			this.#n || (this.#n = !0, log$4.warn(`local trace persistence failed`, { error: formatError(e) }));
		});
	}
	shutdown() {
		return this.forceFlush();
	}
};
function isReadableSpan(e) {
	return typeof e == `object` && !!e && `attributes` in e && `spanContext` in e && typeof e.spanContext == `function`;
}
function isHexId(e, t) {
	return e.length === t && /^[0-9a-f]+$/u.test(e);
}
function isDirectToolCallSpan(e) {
	return e.attributes["eve.tool.invocation"] === "direct";
}
function isAgentActivationSpan(e) {
	return e.name === `agent.turn` || e.attributes[`gen_ai.operation.name`] === `invoke_agent` && e.attributes[`agent.invocation.role`] !== `caller` && typeof e.attributes[`agent.turn.id`] == `string`;
}
// node_modules/eve/dist/src/tracing/local/agent-trace-span-processor.js
var AgentTraceSpanProcessor = class {
	#e;
	#t = /* @__PURE__ */ new Set();
	#n = /* @__PURE__ */ new Set();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Map();
	#a = /* @__PURE__ */ new Map();
	constructor(e) {
		this.#e = e;
	}
	async forceFlush() {
		await Promise.all(this.#e.map((e) => e.forceFlush()));
	}
	onStart(e, t) {
		if (!isSpanLike(e)) return;
		isDirectToolCallSpan(e) && this.#o(e);
		let n = e.attributes[`gen_ai.conversation.id`];
		let r = e.attributes[`agent.run.id`];
		if (typeof n == `string`) {
			let t = e.spanContext().traceId;
			this.#t.has(t) || this.#r.has(t) ? this.#a.get(t)?.ownerRunId === void 0 && typeof r == `string` && this.#a.set(t, {
				conversationId: n,
				ownerRunId: r
			}) : (this.#t.add(t), this.#a.set(t, {
				conversationId: n,
				ownerRunId: typeof r == `string` ? r : void 0
			}));
		}
		if (this.#c(e)) for (let n of this.#e) n.onStart(e, t);
	}
	onEnd(e) {
		if (!isSpanLike(e) || !this.#c(e)) return;
		for (let t of this.#e) t.onEnd(e);
		let t = e.spanContext().traceId;
		let n = this.#a.get(t);
		isAgentActivationSpan({
			name: e.name ?? ``,
			attributes: e.attributes
		}) && n?.ownerRunId === e.attributes[`agent.run.id`] && n?.conversationId === e.attributes[`gen_ai.conversation.id`] && this.#n.add(t), isDirectToolCallSpan(e) && this.#s(e);
	}
	activeTraceIds() {
		return this.#t;
	}
	releaseCompletedTraces() {
		if (this.#n.size === 0) return !1;
		for (let e of this.#n) this.#t.delete(e), this.#a.delete(e), this.#r.add(e);
		for (this.#n.clear(); this.#r.size > 2048;) {
			let e = this.#r.values().next().value;
			this.#r.delete(e);
		}
		return !0;
	}
	releaseConversation(e) {
		let t = !1;
		for (let [n, r] of this.#a) r.conversationId === e && (t = !0, this.#t.delete(n), this.#n.delete(n), this.#a.delete(n), this.#i.delete(n));
		return t;
	}
	async shutdown() {
		await Promise.all(this.#e.map((e) => e.shutdown()));
	}
	#o(e) {
		let { spanId: t, traceId: n } = e.spanContext();
		if (t === void 0) return;
		let r = this.#i.get(n);
		if (r !== void 0) {
			r.add(t), this.#n.delete(n);
			return;
		}
		if (this.#t.has(n) && !this.#n.has(n)) return;
		let i = e.attributes[`gen_ai.conversation.id`];
		let a = e.attributes[`agent.run.id`];
		typeof i == `string` && (this.#n.delete(n), this.#r.delete(n), this.#t.add(n), this.#a.set(n, {
			conversationId: i,
			ownerRunId: typeof a == `string` ? a : void 0
		}), this.#i.set(n, /* @__PURE__ */ new Set([t])));
	}
	#s(e) {
		let { spanId: t, traceId: n } = e.spanContext();
		let r = this.#i.get(n);
		t !== void 0 && r !== void 0 && r.delete(t) && (r.size > 0 || (this.#i.delete(n), this.#n.add(n)));
	}
	#c(e) {
		return e.instrumentationScope?.name !== `workflow` && (this.#t.has(e.spanContext().traceId) || this.#r.has(e.spanContext().traceId));
	}
};
function isSpanLike(e) {
	return typeof e == `object` && !!e && `attributes` in e && `spanContext` in e && typeof e.spanContext == `function`;
}
// node_modules/eve/dist/src/tracing/local/trace-retention.js
const log$3 = createLogger(`harness.local-trace-retention`);
const LOCAL_TRACE_QUIESCENCE_MS = 3e5;
const LOCAL_TRACE_MAX_AGE_MS = 6048e5;
const LOCAL_TRACE_MAX_TOTAL_BYTES = 536870912;
function resolveLocalTraceRetentionSettings(e = process.env) {
	return {
		enabled: !isDisabled(e.EVE_TRACES),
		maxAgeMs: readBound(e, `EVE_TRACES_MAX_AGE_MS`, LOCAL_TRACE_MAX_AGE_MS),
		maxTotalBytes: readBound(e, `EVE_TRACES_MAX_TOTAL_BYTES`, LOCAL_TRACE_MAX_TOTAL_BYTES),
		retainCount: readBound(e, `EVE_TRACES_RETAIN_COUNT`, 20)
	};
}
async function pruneLocalTraceStore(e) {
	let t = e.now ?? Date.now();
	let n = clampBound(e.maxAgeMs ?? LOCAL_TRACE_MAX_AGE_MS);
	let r = clampBound(e.maxTotalBytes ?? LOCAL_TRACE_MAX_TOTAL_BYTES);
	let i = clampCount(e.retainCount ?? 20);
	let a = await readStoredTraces(e.appRoot, t);
	let o = [...a].sort((e, t) => t.modifiedAtMs - e.modifiedAtMs);
	let s = new Set(o.slice(0, i === !1 ? 0 : i));
	let c = /* @__PURE__ */ new Set();
	let l = a.reduce((e, t) => e + t.byteSize, 0);
	let u = 0;
	let d = 0;
	let f = 0;
	for (let i of o.toReversed()) {
		let a = t - i.modifiedAtMs;
		let o = e.activeTraceIds.has(i.traceId) || s.has(i) || a <= LOCAL_TRACE_QUIESCENCE_MS ? void 0 : n !== !1 && a > n ? `maxAgeMs` : r !== !1 && l > r ? `maxTotalBytes` : void 0;
		o === void 0 ? f += 1 : (await rm(i.path, {
			force: !0,
			recursive: !0
		}), l -= i.byteSize, u += i.byteSize, d += 1, c.add(o));
	}
	return {
		reasons: [...c],
		reclaimedBytes: u,
		removedTraces: d,
		retainedTraces: f
	};
}
const pruneRequest = {
	input: {
		activeTraceIds: /* @__PURE__ */ new Set(),
		appRoot: ``
	},
	requested: !1,
	running: void 0
};
function requestLocalTraceStorePrune(e) {
	pruneRequest.input = e, pruneRequest.requested = !0, pruneRequest.running === void 0 && startPruning();
}
function startPruning() {
	pruneRequest.running = (async () => {
		for (; pruneRequest.requested;) pruneRequest.requested = !1, report(await pruneLocalTraceStore(pruneRequest.input));
	})().catch((e) => {
		log$3.warn(`local trace retention failed`, { error: formatError(e) });
	}).finally(() => {
		pruneRequest.running = void 0, pruneRequest.requested && startPruning();
	});
}
function report(e) {
	e.removedTraces !== 0 && log$3.info(`pruned local traces`, {
		reasons: e.reasons.join(`,`),
		reclaimedBytes: e.reclaimedBytes,
		removedTraces: e.removedTraces,
		retainedTraces: e.retainedTraces
	});
}
async function readStoredTraces(e, t) {
	let n = resolveLocalTraceSchemaDirectory(e);
	let r = await readDirectoryEntries(n);
	return r === void 0 ? [] : (await Promise.all(r.filter((e) => e.isDirectory()).map(async (r) => {
		let i = join(n, r.name);
		let a = resolveLocalTraceSegmentsDirectory(e, r.name);
		await reapAbandonedTemporaryFiles(a, t);
		let o = await directoryMtime(a) ?? await directoryMtime(i);
		if (o !== void 0) return {
			byteSize: await directorySize(i),
			modifiedAtMs: o,
			path: i,
			traceId: r.name
		};
	}))).filter((e) => e !== void 0);
}
async function reapAbandonedTemporaryFiles(e, t) {
	let n = await readDirectoryEntries(e);
	if (n !== void 0) for (let r of n) {
		if (!r.isFile() || !r.name.includes(`.tmp-`)) continue;
		let n = join(e, r.name);
		try {
			if (t - (await stat(n)).mtimeMs <= LOCAL_TRACE_QUIESCENCE_MS) continue;
			await rm(n, { force: !0 });
		} catch {}
	}
}
async function directoryMtime(e) {
	try {
		return (await stat(e)).mtimeMs;
	} catch {
		return;
	}
}
async function directorySize(e) {
	let t = await readDirectoryEntries(e);
	if (t === void 0) return 0;
	let n = 0;
	for (let r of t) {
		let t = join(e, r.name);
		if (r.isDirectory()) n += await directorySize(t);
		else try {
			n += (await stat(t)).size;
		} catch {}
	}
	return n;
}
async function readDirectoryEntries(e) {
	try {
		return await readdir(e, { withFileTypes: !0 });
	} catch (e) {
		if (e instanceof Error && `code` in e && (e.code === `ENOENT` || e.code === `ENOTDIR`)) return;
		throw e;
	}
}
function isDisabled(e) {
	if (e === void 0) return !1;
	let t = e.trim().toLowerCase();
	return t === `off` || t === `false` || t === `0`;
}
function readBound(e, t, n) {
	let r = e[t];
	if (r === void 0) return n;
	let i = r.trim().toLowerCase();
	if (i === `off` || i === `false`) return !1;
	let a = Number(i);
	return !Number.isFinite(a) || a < 0 ? (log$3.warn(`ignoring invalid local trace retention value`, {
		fallback: n,
		name: t,
		value: r
	}), n) : a;
}
function clampBound(e) {
	return e !== !1 && Math.max(0, e);
}
function clampCount(e) {
	return e !== !1 && Math.max(0, Math.trunc(e));
}
// node_modules/eve/dist/src/tracing/local/traces.js
function hasConversationRelease(e) {
	return typeof e.releaseConversation == `function`;
}
function createLocalTracesProcessor(e = {}) {
	let t = e.appRoot ?? process.env.EVE_DEV_WORKER_APP_ROOT;
	if (t === void 0) return inertLocalTracesProcessor();
	let n = resolveLocalTraceRetentionSettings();
	let r = new AgentTraceSpanProcessor(n.enabled ? [new LocalTraceSpanProcessor(t)] : []);
	let requestPrune = () => {
		n.enabled && requestLocalTraceStorePrune({
			activeTraceIds: r.activeTraceIds(),
			appRoot: t,
			maxAgeMs: n.maxAgeMs,
			maxTotalBytes: n.maxTotalBytes,
			retainCount: n.retainCount
		});
	};
	requestPrune();
	let forceFlush = async () => {
		await r.forceFlush(), r.releaseCompletedTraces() && requestPrune();
	};
	return {
		forceFlush,
		onEnd: (e) => r.onEnd(e),
		onStart: (e, t) => r.onStart(e, t),
		async releaseConversation(e) {
			return await forceFlush(), r.releaseConversation(e) ? (requestPrune(), !0) : !1;
		},
		shutdown: () => r.shutdown()
	};
}
function resolveLocalTracesExportPolicy(e) {
	return process.env.EVE_TRACES_CONTENT === `off` ? [{ span: () => ({
		redact: !0,
		inputs: !0,
		outputs: !0
	}) }, ...normalizeSpanExportPolicies(e)] : e;
}
function inertLocalTracesProcessor() {
	return {
		forceFlush: async () => void 0,
		onEnd: () => void 0,
		onStart: () => void 0,
		releaseConversation: async () => !1,
		shutdown: async () => void 0
	};
}
// node_modules/eve/dist/src/tracing/eve/content-span-processor.js
function contentFilteringProcessor(e, t) {
	let n = normalizeSpanExportPolicies(t);
	if (n.length === 0) return e;
	let r = e;
	for (let e of n.toReversed()) r = policyFilteringProcessor(r, e);
	return r;
}
function policyFilteringProcessor(e, t) {
	let n = /* @__PURE__ */ new WeakMap();
	let r = /* @__PURE__ */ new WeakSet();
	let i = {
		forceFlush: () => e.forceFlush(),
		onEnd: (i) => {
			if (typeof i != `object` || !i) return;
			let a = facadeFor(i, t, n);
			if (r.has(i) || !a.exported) r.delete(i), n.delete(i);
			else {
				a.refresh();
				try {
					e.onEnd(a.value);
				} finally {
					n.delete(i);
				}
			}
		},
		onStart: (i, a) => {
			if (typeof i != `object` || !i) return;
			let o = facadeFor(i, t, n, channelAudienceFromContext(a));
			o.exported ? e.onStart(o.value, a) : r.add(i);
		},
		shutdown: () => e.shutdown()
	};
	return hasConversationRelease(e) ? {
		...i,
		releaseConversation: (t) => e.releaseConversation(t)
	} : i;
}
function facadeFor(e, t, n, r) {
	let i = n.get(e);
	if (i !== void 0) return i;
	let a = spanExportContext(e, r);
	let o = spanExportDecision(a, t);
	let s = {
		recordInputs: !o.redactInputs,
		recordOutputs: !o.redactOutputs
	};
	let c = {};
	let l = [];
	let u = {};
	let d = Object.create(Reflect.getPrototypeOf(e));
	let f = /* @__PURE__ */ new Map();
	let refresh = () => {
		refreshAttributes(c, e, s, a, t), refreshEvents(l, e, s), refreshStatus(u, e, s);
	};
	let p;
	let readOriginal = (t) => {
		let n = Reflect.get(e, t, e);
		if (typeof n != `function` || t === `constructor`) return n;
		let r = f.get(t);
		if (r !== void 0) return r;
		let created = (...t) => {
			let r = Reflect.apply(n, e, t);
			return refresh(), r === e ? p : r;
		};
		return f.set(t, created), created;
	};
	Object.defineProperty(d, "attributes", {
		configurable: !0,
		enumerable: !0,
		value: c
	}), Object.defineProperty(d, "events", {
		configurable: !0,
		enumerable: !0,
		value: l
	}), Object.defineProperty(d, "status", {
		configurable: !0,
		enumerable: !0,
		value: u
	});
	for (let t of Reflect.ownKeys(e)) {
		if (t === `attributes` || t === `events` || t === `status`) continue;
		let n = Reflect.getOwnPropertyDescriptor(e, t);
		Object.defineProperty(d, t, {
			configurable: !0,
			enumerable: n?.enumerable ?? !1,
			get: () => readOriginal(t)
		});
	}
	p = new Proxy(d, { get: (e, t, n) => Object.hasOwn(e, t) ? Reflect.get(e, t, n) : readOriginal(t) });
	let m = {
		context: a,
		exported: o.exported,
		refresh,
		value: p
	};
	return m.refresh(), n.set(e, m), m;
}
function refreshAttributes(e, t, n, r, i) {
	for (let t of Object.keys(e)) delete e[t];
	let a = t.attributes;
	if (typeof a != `object` || !a) return;
	let o = withoutDeclinedContent(a, n) ?? a;
	for (let [t, n] of Object.entries(o)) {
		let a = attributeDecision(i, {
			key: t,
			span: r,
			value: n
		});
		typeof a == `object` && a && (`emit` in a && `replace` in a || (`replace` in a && a.replace === !0 ? a.value !== void 0 && (e[t] = a.value) : `emit` in a && a.emit === !0 && (e[t] = n)));
	}
}
function spanExportContext(e, t = `unknown`) {
	let n = e.attributes;
	let r = typeof n == `object` && n ? n : {};
	let i = [r[`agent.channel.audience`], r[`ai.settings.context.eve.channel.audience`]].filter((e) => e !== void 0).map(normalizeChannelAudience);
	let a = i.length > 0 && i.every((e) => e === i[0]) ? i[0] : i.length > 0 ? `unknown` : t;
	let o = e.spanContext?.();
	let s = typeof o == `object` && o ? o : {};
	let c = e.name;
	return {
		attributes: r,
		audience: a,
		name: typeof c == `string` ? c : ``,
		spanId: typeof s.spanId == `string` ? s.spanId : ``,
		traceId: typeof s.traceId == `string` ? s.traceId : ``
	};
}
function spanExportDecision(e, t) {
	let n;
	try {
		n = t.span?.(e) ?? { emit: !0 };
	} catch {
		return {
			exported: !1,
			redactInputs: !1,
			redactOutputs: !1
		};
	}
	if (typeof n != `object` || !n) return {
		exported: !1,
		redactInputs: !1,
		redactOutputs: !1
	};
	if (`emit` in n) return `redact` in n ? {
		exported: !1,
		redactInputs: !1,
		redactOutputs: !1
	} : {
		exported: typeof n.emit == `boolean` && n.emit,
		redactInputs: !1,
		redactOutputs: !1
	};
	if (n.redact !== !0) return {
		exported: !1,
		redactInputs: !1,
		redactOutputs: !1
	};
	let r = n.inputs === !0;
	let i = n.outputs === !0;
	return !r && !i ? {
		exported: !1,
		redactInputs: !1,
		redactOutputs: !1
	} : {
		exported: !0,
		redactInputs: r,
		redactOutputs: i
	};
}
function attributeDecision(e, t) {
	if (e?.attribute === void 0) return { emit: !0 };
	try {
		return e.attribute(t);
	} catch {
		return { emit: !1 };
	}
}
function refreshEvents(e, t, n) {
	e.length = 0;
	let r = t.events;
	if (Array.isArray(r)) {
		if (n.recordOutputs) e.push(...r);
		else for (let t of r) {
			if (typeof t != `object` || !t) continue;
			let n = t;
			n.name !== `exception` && e.push({
				...n,
				attributes: void 0
			});
		}
	}
}
function refreshStatus(e, t, n) {
	for (let t of Object.keys(e)) delete e[t];
	let r = t.status;
	if (typeof r != `object` || !r) return;
	let i = r;
	i.code !== void 0 && (e.code = i.code), n.recordOutputs && i.message !== void 0 && (e.message = i.message);
}
// node_modules/eve/dist/src/tracing/eve/vercel-runtime-span-exporter.js
const VERCEL_REQUEST_CONTEXT = Symbol.for(`@vercel/request-context`);
const log$2 = createLogger(`tracing.vercel-runtime-span-exporter`);
function vercelRuntimeSpanExporter() {
	return {
		export(e, t) {
			let n = globalThis[VERCEL_REQUEST_CONTEXT]?.get()?.telemetry;
			if (n === void 0) t({ code: 0 });
			else try {
				let r = JsonTraceSerializer.serializeRequest([...e]);
				if (r === void 0) throw Error(`Failed to serialize spans.`);
				n.reportSpans(JSON.parse(new TextDecoder().decode(r))), t({ code: 0 });
			} catch (e) {
				t({
					code: 1,
					error: e instanceof Error ? e : Error(String(e))
				});
			}
		},
		forceFlush: async () => void 0,
		shutdown: async () => void 0
	};
}
function vercelRuntimeSpanProcessor() {
	let e = vercelRuntimeSpanExporter();
	let t = !1;
	return {
		forceFlush: () => e.forceFlush?.() ?? Promise.resolve(),
		onEnd(n) {
			!t && isSampled(n) && e.export([n], (e) => {
				e.code !== 0 && log$2.warn(`Agent Runs export failed`, { error: formatError(e.error ?? Error(`Span export failed.`)) });
			});
		},
		onStart() {},
		async shutdown() {
			t = !0, await e.shutdown();
		}
	};
}
function isSampled(e) {
	if (typeof e != `object` || !e || !(`spanContext` in e)) return !1;
	let t = e.spanContext;
	if (typeof t != `function`) return !1;
	let n = Reflect.apply(t, e, []);
	return typeof n.traceFlags == `number` && (n.traceFlags & TraceFlags.SAMPLED) === TraceFlags.SAMPLED;
}
// node_modules/eve/dist/src/tracing/eve/otel-declaration.js
const log$1 = createLogger(`tracing.export`);
const OTEL_DECLARATION = Symbol.for(`eve.instrumentation.otel`);
const OTEL_INTEGRATION = Symbol.for(`eve.instrumentation.otel-integration`);
function managedOtelIntegration(e = {}) {
	return createOtelIntegration(e);
}
function createOtelIntegration(e) {
	assertNoRemovedContentOptions(e);
	let t = e.spanProcessors ?? [];
	let n = e.traceExporter === void 0 ? t : [...t, batchSpanProcessor(e.traceExporter, { diagnostic: (e, t) => log$1.warn(e, {
		...t,
		error: t.error === void 0 ? void 0 : formatError(t.error)
	}) })];
	return {
		[OTEL_INTEGRATION]: !0,
		[PROVIDER]: !0,
		metricReaders: e.metricReaders ?? [],
		runtimeContext: e.runtimeContext,
		spanProcessors: n.map((t) => contentFilteringProcessor(t, e.exportPolicy))
	};
}
function agentRunsIntegration(e = {}) {
	return assertNoRemovedContentOptions(e), {
		[OTEL_INTEGRATION]: !0,
		[PROVIDER]: !0,
		metricReaders: [],
		spanProcessors: [contentFilteringProcessor(vercelRuntimeSpanProcessor(), e.exportPolicy)]
	};
}
function assertNoRemovedContentOptions(e) {
	if (Object.hasOwn(e, `recordInputs`) || Object.hasOwn(e, `recordOutputs`)) throw Error("OpenTelemetry destination options no longer support `recordInputs` or `recordOutputs`. Use an `exportPolicy` span decision with `{ redact: true, inputs: true }`, `{ redact: true, outputs: true }`, or both.");
}
function isOtelDeclaration(e) {
	return typeof e == `object` && !!e && e[OTEL_DECLARATION] === !0;
}
function isOtelIntegration(e) {
	return typeof e == `object` && !!e && e[OTEL_INTEGRATION] === !0;
}
function collectOtelPipeline(e) {
	let t = [];
	let n = [];
	let r = [];
	let i;
	let a = !1;
	for (let o of e) if (isOtelIntegration(o)) a = !0, t.push(...o.spanProcessors), n.push(...o.metricReaders), o.runtimeContext !== void 0 && r.push(o.runtimeContext);
	else if (isOtelDeclaration(o)) {
		if (i !== void 0) throw Error("Instrumentation declares `otel()` more than once. One process has one OpenTelemetry tracer provider, so it has one resource, one sampler, and one propagator set — declare them in a single `otel()`.");
		a = !0, i = o;
	}
	let o = i?.options ?? {};
	let s = {
		functionId: o.functionId,
		traceChannelRequests: o.traceChannelRequests === !0
	};
	return o.tracePolicy !== void 0 && Object.assign(s, { tracePolicy: o.tracePolicy }), {
		declared: a,
		configuration: {
			instrumentations: o.instrumentations,
			metricReaders: n.length > 0 ? n : void 0,
			propagators: o.propagators,
			resource: o.resource,
			sampler: o.sampler,
			spanProcessors: t
		},
		runtimeContextResolvers: r,
		settings: s
	};
}
// node_modules/eve/dist/src/public/instrumentation/otel.js
function agentRuns(e = {}) {
	return agentRunsIntegration(e);
}
function localTraces(e = {}) {
	return managedOtelIntegration({
		...e,
		exportPolicy: resolveLocalTracesExportPolicy(e.exportPolicy),
		spanProcessors: [createLocalTracesProcessor()]
	});
}
// node_modules/eve/dist/src/tracing/eve/agent-tool-instrumentation.js
async function resumeTool(e, t) {
	return (await e.resume({
		identity: eveTurnIdentity(t),
		context: withChannelAudience(ROOT_CONTEXT, t.channelAudience)
	}))?.findTool(t.callId);
}
function createAgentToolInstrumentation(e) {
	let t = /* @__PURE__ */ new Map();
	let callKey = (e, t) => actionIdempotencyKey(e.sessionId, e.turnId, t);
	async function stateFor(t, n, r) {
		let i = await e.stateStore.get(`action`, actionIdempotencyKey(t, n, r));
		return i === void 0 ? (await e.stateStore.entries(`action`)).find(([, e]) => e.sessionId === t && e.callId === r)?.[1] : i;
	}
	async function reenter(t, n) {
		let r = await e.tracing.resume({
			identity: eveTurnIdentity(t),
			context: withChannelAudience(ROOT_CONTEXT, t.channelAudience)
		});
		if (r?.findTool(t.callId) === void 0) return;
		let i = r.findAttempt({
			stepIndex: t.stepIndex,
			attempt: t.attemptIndex
		});
		return i === void 0 ? r.findTool(t.callId) : i.tool(n);
	}
	async function settleExecution(n, r) {
		let i = n.terminal;
		i !== void 0 && (t.delete(n.idempotencyKey), i.failed ? n.tool.recordError(i.error) : i.durationMs !== void 0 && n.tool.attributes({ "gen_ai.execute_tool.duration": i.durationMs / 1e3 }), await e.stateStore.set(`action`, n.idempotencyKey, {
			...r,
			toolEndTimeMs: i.completedAtMs
		}));
	}
	async function onDispatchStarted(n) {
		let r = traceStepIndex(n.scope);
		if (n.scope.turnId === void 0 || r === void 0) return;
		let i = await e.stateStore.get(`action`, n.idempotencyKey);
		if (i === void 0) {
			let a = await e.attemptFor(n.scope);
			if (a === void 0) return;
			let o = await a.tool({
				callId: n.callId,
				name: n.toolName,
				kind: n.capability.kind === `agent` ? n.capability.remote ? `remote-agent-call` : `subagent-call` : n.capability.kind === `skill` ? `load-skill` : `tool-call`,
				arguments: e.recordInputs ? n.input : void 0,
				startTimeMs: n.startedAtMs
			});
			o.attributes({ "agent.tool.is_framework": n.frameworkTool === !0 }), i = {
				attemptId: attemptIdempotencyKey(n.scope),
				attemptIndex: n.scope.attempt,
				callId: n.callId,
				channelAudience: normalizeChannelAudience(n.scope.channelAudience),
				context: {
					...o.reference,
					isRemote: !1
				},
				rootSessionId: n.scope.rootSessionId,
				sessionId: n.scope.sessionId,
				stepIndex: r,
				turnId: n.scope.turnId
			}, await e.stateStore.set(`action`, n.idempotencyKey, i);
			let s = t.get(n.idempotencyKey);
			s !== void 0 && await settleExecution(s, i);
		}
		n.capability.kind === `agent` && await e.stateStore.set(`anchor`, n.idempotencyKey, i);
	}
	async function onDispatchTerminal(t) {
		let n = await e.stateStore.get(`action`, t.idempotencyKey);
		if (n !== void 0) try {
			let r = await resumeTool(e.tracing, n);
			let i = t.outcome !== `completed`;
			t.taskId !== void 0 && r?.attributes({ "agent.task.id": t.taskId }), await r?.complete({
				outcome: t.outcome === `interrupted` ? `cancelled` : t.outcome,
				failed: i,
				errorType: i ? t.errorCode : void 0,
				error: i ? t.error : void 0,
				output: e.recordOutputs && !i ? t.output : void 0,
				usage: t.usage,
				endTimeMs: t.acceptedAtMs ?? n.toolEndTimeMs
			});
		} finally {
			await e.stateStore.delete(`action`, t.idempotencyKey);
		}
	}
	async function executionFor(n, r) {
		if (n.scope.turnId === void 0) return;
		let i = callKey({
			sessionId: n.scope.sessionId,
			turnId: n.scope.turnId
		}, n.callId);
		let a = t.get(i);
		if (a !== void 0) return a;
		let o = await stateFor(n.scope.sessionId, n.scope.turnId, n.callId);
		let s = {
			callId: n.callId,
			name: n.toolName,
			arguments: e.recordInputs && r.recordInputs ? n.input : void 0,
			startTimeMs: n.startedAtMs
		};
		let c = o === void 0 ? await e.stepFor(n.scope)?.tool(s) : await reenter(o, s);
		if (c === void 0 || t.size >= 1e4) return;
		let l = {
			attemptId: attemptIdempotencyKey(n.scope),
			idempotencyKey: i,
			tool: c
		};
		return t.set(i, l), l;
	}
	async function finishExecution(t, n) {
		t.terminal = n;
		let r = t.idempotencyKey;
		let i = await e.stateStore.get(`action`, r);
		i !== void 0 && await settleExecution(t, i);
	}
	return {
		stateFor,
		async contextFor(e, t, n) {
			let r = await stateFor(e, t, n);
			return r === void 0 ? void 0 : toolContext(r);
		},
		async deleteForSession(t) {
			for (let n of [`action`, `anchor`]) for (let [r, i] of await e.stateStore.entries(n)) i.sessionId === t && await e.stateStore.delete(n, r);
		},
		async forgetAttempt(t) {
			for (let [n, r] of await e.stateStore.entries(`action`)) r.attemptId === attemptIdempotencyKey(t) && await e.stateStore.delete(`action`, n);
		},
		async drain(n, r) {
			for (let [i, a] of t) {
				if (a.attemptId !== n || (t.delete(i), await e.stateStore.get(`action`, i) !== void 0)) continue;
				let o = a.terminal;
				r === void 0 ? (o?.durationMs !== void 0 && !o.failed && a.tool.attributes({ "gen_ai.execute_tool.duration": o.durationMs / 1e3 }), await a.tool.complete({
					failed: o?.failed,
					error: o?.error,
					output: o?.output,
					endTimeMs: o?.completedAtMs
				})) : await a.tool.fail(r.error);
			}
		},
		async runInContext(t, n, r, i) {
			if (t.callId === void 0 || t.toolName === void 0) return i();
			let a = await executionFor({
				...t,
				callId: t.callId,
				toolName: t.toolName
			}, r);
			if (a === void 0 || a.tool.finished) return i();
			a.tool.attributes({ "agent.tool.is_framework": t.frameworkTool === !0 });
			let o = t.startedAtMs ?? Date.now();
			try {
				let i = await a.tool.run(n, r);
				let s = t.completedAtMs ?? Date.now();
				return await finishExecution(a, {
					completedAtMs: s,
					durationMs: s - o,
					failed: t.failed === !0,
					output: e.recordOutputs && r.recordOutputs ? i : void 0
				}), i;
			} catch (e) {
				let t = connectionAuthorizationAttributes(e);
				throw t !== void 0 && a.tool.attributes(t), await finishExecution(a, {
					completedAtMs: Date.now(),
					failed: !0,
					error: r.recordOutputs ? e : void 0
				}), e;
			}
		},
		events: {
			"call.requested": onDispatchStarted,
			"call.settled": onDispatchTerminal
		}
	};
}
function toolContext(e) {
	return {
		context: withChannelAudience(trace.setSpan(ROOT_CONTEXT, trace.wrapSpanContext(e.context)), e.channelAudience),
		spanContext: e.context
	};
}
// node_modules/eve/dist/src/tracing/eve/agent-approval-instrumentation.js
function createAgentApprovalInstrumentation(e) {
	async function toolFor(t, n, r) {
		let i = await e.actionStateFor(t, n, r);
		return i === void 0 ? void 0 : resumeTool(e.tracing, i);
	}
	async function onOpened(t, n) {
		let { call: r, scope: i } = t;
		if (i.turnId === void 0 || n.state.get() !== void 0) return;
		let a = {
			connectionName: t.signIn?.name,
			kind: APPROVAL_KINDS[t.kind] ?? t.kind,
			request: t.request,
			requestId: t.interactionId
		};
		let o = r === void 0 ? void 0 : await toolFor(i.sessionId, i.turnId, r.callId);
		if (await (o ?? await e.turnFor(i.sessionId, i.turnId))?.approval(a) === void 0) return;
		let s = {
			sessionId: i.sessionId,
			turnId: i.turnId
		};
		n.state.set(o === void 0 || r === void 0 ? s : {
			...s,
			callId: r.callId
		});
	}
	async function onSettled(t, n) {
		let r = n.state.get();
		if (typeof r != `object` || !r || Array.isArray(r)) return;
		let { callId: i, sessionId: a, turnId: o } = r;
		if (typeof a != `string` || typeof o != `string`) return;
		let s = typeof i == `string` ? await toolFor(a, o, i) : void 0;
		let c = typeof i == `string` ? s?.findApproval(t.interactionId) : (await e.turnFor(a, o))?.findApproval(t.interactionId);
		c !== void 0 && (t.responder !== void 0 && (c.attributes({
			"agent.approval.responder.type": t.responder.type,
			"agent.approval.responder.id": t.responder.id
		}), t.kind === `approval` && t.outcome === `accepted` && s?.attributes({
			"agent.tool.approver.type": t.responder.type,
			"agent.tool.approver.id": t.responder.id
		})), t.kind === `sign-in` && t.outcome === `failed` && t.reason !== void 0 && c.attributes({ "agent.connection.authorization.reason": t.reason }), t.outcome === `failed` ? await c.fail(t.error) : await c.complete({
			outcome: APPROVAL_OUTCOMES[t.outcome] ?? `invalid`,
			response: t.answer
		}));
	}
	return {
		"interaction.opened": onOpened,
		"interaction.settled": onSettled
	};
}
const APPROVAL_KINDS = { approval: `tool-approval` };
const APPROVAL_OUTCOMES = {
	abandoned: `cancelled`,
	accepted: `approved`,
	declined: `denied`,
	expired: `cancelled`,
	interrupted: `cancelled`,
	withdrawn: `ignored`
};
// node_modules/eve/dist/src/tracing/eve/agent-channel-delivery-instrumentation.js
function createAgentChannelDeliveryInstrumentation(e) {
	return { async "delivery.consumed"(t) {
		if (t.turnId === void 0) return;
		let n = contextStorage.getStore();
		(n === void 0 || enteredView(n)?.deliveries[t.deliveryId]?.parts?.length !== 0) && await e.stateStore.update(`turn`, JSON.stringify([t.sessionId, t.turnId]), (n) => !isSampledTrace(n.context) || n.consumedDeliveryId === null ? n : n.consumedDeliveryId !== void 0 && n.consumedDeliveryId !== t.deliveryId ? {
			...n,
			channelDelivery: void 0,
			consumedDeliveryId: null
		} : {
			...n,
			consumedDeliveryId: t.deliveryId,
			channelDelivery: t.delivery === void 0 ? void 0 : {
				...t.delivery,
				inputAttribute: e.recordInputs ? contentAttribute(t.input) : void 0
			}
		});
	} };
}
// node_modules/eve/dist/src/tracing/eve/metadata.js
function eveActivationMetadata(e) {
	let { session: t, turn: n, sessionId: r } = e;
	let i = n.parentLineage ?? t?.parentLineage;
	let a = i === void 0 || n.traceSessionId === r;
	let o = n.channelDelivery;
	let s = o?.channelKind ?? (a ? t?.channelKind ?? (t?.channelType === void 0 ? void 0 : normalizeInstrumentationChannelKind(t.channelType)) : void 0);
	return {
		sequence: n.sequence,
		lineage: i === void 0 ? void 0 : {
			agentName: n.subagentName,
			parentCallId: i.callId,
			parentRunId: i.sessionId
		},
		channel: {
			kind: s,
			origin: !a || s === void 0 ? void 0 : t?.scheduleId === void 0 ? `channel` : `schedule`
		},
		attributes: {
			"agent.channel.audience": t?.channelAudience,
			"agent.session.title": a && t?.decision?.action === `record` && t.decision.recordInputs ? t.title : void 0,
			"agent.schedule.id": i === void 0 ? t?.scheduleId : void 0,
			"agent.principal.current.type": n.currentPrincipal?.type,
			"agent.principal.current.id": n.currentPrincipal && `id` in n.currentPrincipal ? n.currentPrincipal.id : void 0,
			"agent.principal.initiator.type": n.initiatorPrincipal?.type,
			"agent.principal.initiator.id": n.initiatorPrincipal && `id` in n.initiatorPrincipal ? n.initiatorPrincipal.id : void 0,
			"agent.channel.name": o?.channelName,
			"agent.channel.delivery.id": o?.deliveryId,
			"agent.channel.request.id": o?.requestId,
			"agent.channel.delivery.input": o?.inputAttribute === void 0 ? void 0 : JSON.stringify(checkpointContent(o.inputAttribute))
		}
	};
}
// node_modules/eve/dist/src/tracing/eve/session.js
function createEveSessionTracing(e) {
	let ensureSessionContext = async (t) => {
		let n = await e.stateStore.get(`session`, t.sessionId);
		if (n === void 0) {
			let r = normalizeChannelAudience(t.channelAudience);
			let i = resolveSessionTraceDecision(t, r, e.environment, e.tracePolicy);
			n = {
				agentName: t.agentName,
				channelAudience: r,
				channelKind: t.channelKind,
				channelType: t.channelType,
				decision: i,
				context: initialSessionContext(e, t, i),
				parentLineage: t.parentLineage,
				rootSessionId: t.rootSessionId,
				traceSessionId: traceSessionIdOf(t),
				scheduleId: t.scheduleId,
				title: t.title
			}, await e.stateStore.set(`session`, t.sessionId, n);
		}
		return n;
	};
	let prepareSessionTrace = async (e) => {
		let t = await ensureSessionContext(e);
		return portableSpanContext(t.context, t.decision);
	};
	let turnKey = (e, t) => JSON.stringify([e, t]);
	async function readTurnTraceContext(t, n) {
		return (await e.stateStore.get(`turn`, turnKey(t, n)))?.context;
	}
	async function turnFor(t, n, r) {
		let i = await e.stateStore.get(`turn`, turnKey(t, n));
		if (i === void 0 || !isSampledTrace(i.context)) return;
		let a = await e.stateStore.get(`session`, t);
		return e.tracing.resume({
			identity: eveTurnIdentity({
				sessionId: t,
				rootSessionId: i.rootSessionId,
				turnId: n
			}),
			context: withOperationTraceContext(r ?? withChannelAudience(ROOT_CONTEXT, a?.channelAudience), {
				sessionId: t,
				...i
			})
		});
	}
	async function dropped(e, t) {
		let n = await readTurnTraceContext(e, t);
		return n !== void 0 && !isSampledTrace(n);
	}
	let prepareTurnTrace = async (t) => {
		let n = await e.stateStore.get(`turn`, turnKey(t.sessionId, t.turnId));
		if (n !== void 0) {
			let r = await e.stateStore.get(`session`, t.sessionId);
			return portableSpanContext(n.context, r?.decision);
		}
		let r = await ensureSessionContext(t);
		let i = t.sequence === 0;
		let a = i ? t.parentTraceContext : void 0;
		let o = r.decision?.action === `record`;
		let s = a !== void 0 && !(`isRemote` in a && a.isRemote === !0);
		let c = i ? {
			...r.context,
			traceId: s ? a.traceId : r.context.traceId,
			isRemote: !1
		} : {
			traceId: e.idGenerator.deriveTraceId(`turn:${t.idempotencyKey}`),
			spanId: e.idGenerator.deriveSpanId(`turn:${t.idempotencyKey}`),
			traceFlags: +!!o,
			isRemote: !1
		};
		let l = r.agentName ?? (t.parentLineage ?? r.parentLineage)?.subagentName;
		let u = {
			agentName: l,
			caller: a === void 0 ? void 0 : adoptedSpanContext(a),
			context: c,
			currentPrincipal: applyPrincipalTraceDecision(t.currentPrincipal, r.decision),
			initiatorPrincipal: applyPrincipalTraceDecision(t.initiatorPrincipal, r.decision),
			parentLineage: t.parentLineage ?? r.parentLineage,
			rootSessionId: t.rootSessionId,
			traceSessionId: traceSessionIdOf(t),
			sequence: t.sequence,
			startTimeMs: Date.now(),
			subagentName: (t.parentLineage ?? r.parentLineage)?.subagentName
		};
		if (isSampledTrace(c)) {
			let n = await e.tracing.turn({
				...eveActivationMetadata({
					session: r,
					turn: u,
					sessionId: t.sessionId
				}),
				agentName: l,
				identity: eveTurnIdentity({
					...t,
					sessionId: t.sessionId
				}),
				framework: {
					name: `eve`,
					version: e.frameworkVersion
				},
				capture: {
					emit: !0,
					...await e.capturePolicy.forOperation(t)
				},
				reference: c,
				parent: s ? adoptedSpanContext(a) : void 0,
				links: activationLinks(u),
				startTimeMs: u.startTimeMs,
				context: hostContext(r.channelAudience, t)
			});
			u = {
				...u,
				context: {
					...c,
					traceFlags: n.reference.traceFlags
				}
			};
		}
		return await e.stateStore.set(`turn`, turnKey(t.sessionId, t.turnId), u), portableSpanContext(u.context, r.decision);
	};
	async function endTurn(t, n, r) {
		let i = await e.stateStore.get(`turn`, turnKey(t, n));
		if (i === void 0) return;
		let a = await e.stateStore.get(`session`, t);
		let o = await turnFor(t, n);
		if (o !== void 0) {
			let e = eveActivationMetadata({
				session: a,
				turn: i,
				sessionId: t
			});
			if (o.attributes(e.attributes ?? {}), o.links(activationLinks(i) ?? []), r === void 0) await o.complete({ outcomeUnknown: !0 });
			else if (r.outcome === `failed`) {
				let e = r.error;
				await o.complete({
					outcome: `failed`,
					failed: !0,
					error: e,
					errorType: e instanceof Error ? e.name : void 0
				});
			} else await o.complete({ outcome: r.outcome });
		}
		await e.stateStore.delete(`turn`, turnKey(t, n));
	}
	return {
		ensureSessionContext,
		prepareSessionTrace,
		prepareTurnTrace,
		readTurnTraceContext,
		turnFor,
		dropped,
		async turnSettled(e) {
			let t = contextStorage.getStore();
			let n = t === void 0 ? void 0 : enteredView(t);
			(n?.session.status !== `ended` || n.session.outcome !== `failed` || n.session.closedAt !== n.turns[e.turnId]?.closedAt) && await endTurn(e.sessionId, e.turnId, {
				outcome: e.outcome,
				error: e.error
			});
		},
		async sessionEnded(e) {
			e.turnId !== void 0 && await endTurn(e.sessionId, e.turnId, e.outcome === `failed` ? {
				outcome: `failed`,
				error: e.error
			} : void 0);
		}
	};
}
function hostContext(e, t) {
	return withOperationTraceContext(withChannelAudience(ROOT_CONTEXT, e), t);
}
function activationLinks(e) {
	let t = [];
	return e.caller?.isRemote === !0 && t.push({
		context: e.caller,
		relationship: `agent.dispatch`
	}), e.channelDelivery?.requestTraceContext !== void 0 && t.push({
		context: e.channelDelivery.requestTraceContext,
		relationship: `channel.request`
	}), t.length === 0 ? void 0 : t;
}
function portableSpanContext(e, t) {
	return {
		decision: t,
		spanId: e.spanId,
		traceFlags: e.traceFlags,
		traceId: e.traceId
	};
}
function adoptedSpanContext(e) {
	return {
		isRemote: `isRemote` in e && e.isRemote === !0,
		spanId: e.spanId,
		traceFlags: e.traceFlags,
		traceId: e.traceId
	};
}
function initialSessionContext(e, t, n) {
	let r = t.traceSeed;
	if (r !== void 0) return {
		...adoptedSpanContext(r),
		traceFlags: n.action === `drop` ? 0 : r.traceFlags
	};
	let i = `session:${t.sessionId}`;
	let a = t.parentTraceContext;
	return {
		traceId: a !== void 0 && !(`isRemote` in a && a.isRemote === !0) ? a.traceId : e.idGenerator.deriveTraceId(i),
		spanId: e.idGenerator.deriveSpanId(i),
		traceFlags: +(n.action === `record`)
	};
}
function resolveSessionTraceDecision(e, t, n, r) {
	let i = {
		audience: t,
		environment: n
	};
	return e.parentTraceContext !== void 0 && !isSampledTrace(e.parentTraceContext) ? { action: `drop` } : e.traceSeed?.decision === void 0 ? e.traceSeed === void 0 ? e.parentTraceContext === void 0 ? e.agentName === void 0 ? r === void 0 ? resolveTracePolicyDecision(!0, i) : { action: `drop` } : resolveTracePolicy(r, {
		agentName: e.agentName,
		audience: t,
		channel: { kind: normalizeInstrumentationChannelKind(e.channelKind ?? e.channelType) },
		environment: n,
		principalType: `unknown`
	}) : resolveTracePolicyDecision(isSampledTrace(e.parentTraceContext), i) : resolveTracePolicyDecision(isSampledTrace(e.traceSeed), i) : readInstrumentationDecision(e.traceSeed.decision) ?? { action: `drop` };
}
// node_modules/eve/dist/src/instrumentation/content-policy.js
function instrumentationEventForTraceDecision(e, t, n, r = {}) {
	let i = r.applyAudienceCeiling === !1 ? t : applyAudienceCeiling(t, n);
	return i.action === `drop` ? withoutInstrumentationContent(e) : withInstrumentationDecision(e, i);
}
// node_modules/eve/dist/src/tracing/eve/policy.js
function createEveCapturePolicy(e) {
	return {
		async projectEvent(t) {
			let n = await e.stateStore.get(`session`, `scope` in t ? t.scope.sessionId : t.sessionId);
			let r = audienceForEvent(t, n?.channelAudience);
			let i = `traceSeed` in t ? t.traceSeed : void 0;
			let a = contextStorage.getStore()?.get(SessionTraceSeedKey);
			let o = resolveForwardedTraceSeed(a);
			let s = resolveForwardedTraceSeed(i, o?.forwardedTracePolicy);
			let decisionForTrace = (t) => t === void 0 ? void 0 : resolveTracePolicyDecision(isSampledTrace(t), {
				audience: r,
				environment: e.environment
			});
			let c = s?.decision ?? o?.decision ?? readInstrumentationDecision(n?.decision) ?? decisionForTrace(i) ?? decisionForTrace(a) ?? decisionForTrace(n?.context);
			if (c === void 0) return withoutInstrumentationContent(t);
			return instrumentationEventForTraceDecision(s === void 0 || !(`traceSeed` in t) || t.traceSeed === void 0 ? t : {
				...t,
				traceSeed: {
					...t.traceSeed,
					decision: s.decision,
					traceFlags: s.traceFlags
				}
			}, applyLiveDeliveryAudienceCeiling(c.action === `drop` ? c : {
				...c,
				recordInputs: e.recordInputs && c.recordInputs,
				recordOutputs: e.recordOutputs && c.recordOutputs
			}, r, s?.forwardedTracePolicy ?? o?.forwardedTracePolicy, e.environment), {
				audience: r,
				environment: e.environment
			}, { applyAudienceCeiling: !1 });
		},
		async forOperation(t) {
			let n = await e.stateStore.get(`session`, t.sessionId);
			let r = contextStorage.getStore();
			let i = resolveForwardedTraceSeed(r?.get(SessionTraceSeedKey));
			let a = i?.decision ?? n?.decision;
			let o = a === void 0 ? void 0 : applyLiveDeliveryAudienceCeiling(a, normalizeChannelAudience(t.channelAudience ?? r?.get(ConversationContextKey)?.audience ?? n?.channelAudience), i?.forwardedTracePolicy, e.environment);
			return {
				recordInputs: e.recordInputs && o?.action === `record` && o.recordInputs,
				recordOutputs: e.recordOutputs && o?.action === `record` && o.recordOutputs
			};
		}
	};
}
function audienceForEvent(e, t) {
	return `delivery` in e ? normalizeChannelAudience(e.delivery?.channelAudience) : `scope` in e && e.scope.channelAudience !== void 0 ? normalizeChannelAudience(e.scope.channelAudience) : e.type === `session.started` ? normalizeChannelAudience(e.channelAudience) : normalizeChannelAudience(t);
}
// node_modules/eve/dist/src/tracing/eve/agent-otel-provider.js
function createAgentOtelInstrumentation(e) {
	let t = e.environment ?? resolveInstrumentationEnvironment();
	let n = e.recordInputs ?? !1;
	let r = e.recordOutputs ?? !1;
	let i = createEveTracing(e);
	let a = createEveCapturePolicy({
		stateStore: e.stateStore,
		environment: t,
		recordInputs: n,
		recordOutputs: r
	});
	let o = /* @__PURE__ */ new Map();
	let s = /* @__PURE__ */ new Map();
	let c = createEveSessionTracing({
		...e,
		environment: t,
		tracing: i,
		capturePolicy: a
	});
	let { prepareSessionTrace: l, prepareTurnTrace: u } = c;
	async function attemptFor(e) {
		let t = o.get(attemptIdempotencyKey(e));
		if (t !== void 0) return t;
		let n = traceStepIndex(e);
		if (e.turnId === void 0 || n === void 0) return;
		let r = await c.turnFor(e.sessionId, e.turnId, withChannelAudience(ROOT_CONTEXT, e.channelAudience));
		let i = {
			stepIndex: n,
			attempt: e.attempt
		};
		return r?.findAttempt(i) ?? (r?.finished === !1 ? r.attempt(i) : void 0);
	}
	let d = createAgentToolInstrumentation({
		tracing: i,
		attemptFor,
		stepFor: (e) => o.get(attemptIdempotencyKey(e)),
		recordInputs: n,
		recordOutputs: r,
		stateStore: e.stateStore
	});
	let f = createAgentApprovalInstrumentation({
		tracing: i,
		actionStateFor: d.stateFor,
		turnFor: (e, t) => c.turnFor(e, t)
	});
	let p = createAgentMemoryInstrumentation({
		...e,
		environment: t,
		tracing: i
	});
	function turnState(t) {
		return e.stateStore.get(`turn`, JSON.stringify([t.sessionId, t.turnId]));
	}
	let onSessionStarted = async (e) => {
		await l(e);
	};
	let onTurnStarted = async (e) => {
		await u(e);
	};
	let onStepStarted = async (t) => {
		let n = traceStepIndex(t.scope);
		if (t.scope.turnId === void 0 || n === void 0) return;
		let r = await turnState({
			sessionId: t.scope.sessionId,
			turnId: t.scope.turnId
		});
		if (r === void 0 || !isSampledTrace(r.context)) return;
		let i = await e.stateStore.get(`session`, t.scope.sessionId);
		let a = await c.turnFor(t.scope.sessionId, t.scope.turnId, withChannelAudience(ROOT_CONTEXT, t.scope.channelAudience));
		if (a === void 0 || a.finished) return;
		let s = trace.getSpan(context.active())?.spanContext();
		let l = await a.attempt({
			stepIndex: n,
			attempt: t.scope.attempt,
			runtimeContext: t.runtimeContext,
			channel: eveActivationMetadata({
				session: i,
				turn: r,
				sessionId: t.scope.sessionId
			}).channel,
			links: s === void 0 || s.traceId === r.context.traceId ? void 0 : [{
				relationship: `execution.delivery`,
				context: s
			}]
		});
		o.set(attemptIdempotencyKey(t.scope), l);
	};
	let onStepTerminal = async (e) => {
		let t = attemptFailed(e) ? { error: e.error } : void 0;
		await drainOpenSpans(e), await d.drain(attemptIdempotencyKey(e.scope), t);
		let n = o.get(attemptIdempotencyKey(e.scope)) ?? await attemptFor(e.scope);
		o.delete(attemptIdempotencyKey(e.scope)), t === void 0 ? await n?.complete() : (await n?.fail(t.error), await d.forgetAttempt(e.scope));
	};
	let onSessionEnded = async (t) => {
		await c.sessionEnded(t), await d.deleteForSession(t.sessionId), await e.stateStore.delete(`session`, t.sessionId);
	};
	async function openTurnOf(e) {
		if (e.turnId === void 0 || traceStepIndex(e) !== void 0) return;
		let t = await turnState({
			sessionId: e.sessionId,
			turnId: e.turnId
		});
		if (t === void 0 || !isSampledTrace(t.context)) return;
		let n = await c.turnFor(e.sessionId, e.turnId, withChannelAudience(ROOT_CONTEXT, e.channelAudience));
		return n?.finished === !1 ? n : void 0;
	}
	let onModelCallStarted = async (e) => {
		let t = o.get(attemptIdempotencyKey(e.scope)) ?? await openTurnOf(e.scope);
		if (t === void 0) return;
		let r = await t.modelCall({
			provider: e.model.provider,
			modelId: e.model.modelId,
			messages: n ? e.input?.messages.map((e) => isObject(e) && e.role === `user` ? {
				...e,
				kind: isUserMessageKind(e.kind) ? e.kind : void 0
			} : e) : void 0,
			instructions: n ? e.input?.instructions : void 0,
			tools: n ? e.input?.tools : void 0,
			runtimeContext: e.runtimeContext
		}, e.idempotencyKey);
		let i = s.get(attemptIdempotencyKey(e.scope));
		i === void 0 && s.set(attemptIdempotencyKey(e.scope), i = /* @__PURE__ */ new Map()), i.set(e.idempotencyKey, r);
	};
	let onModelCallTerminal = async (e) => {
		let t = s.get(attemptIdempotencyKey(e.scope));
		let n = t?.get(e.idempotencyKey);
		t?.delete(e.idempotencyKey);
		let i = o.get(attemptIdempotencyKey(e.scope)) ?? n;
		if (e.outcome === `completed` && i !== void 0) {
			let t = readGatewayCostData(e.providerMetadata);
			t !== void 0 && i.attributes(gatewayCostAttributes(t));
			let n = gatewayRoutingAttributes(e.providerMetadata);
			n !== void 0 && i.attributes(n);
		}
		n !== void 0 && (e.outcome === `failed` ? await n.fail(e.error) : await n.complete({
			outcome: `completed`,
			result: {
				...e,
				content: r ? e.content : void 0
			}
		}));
	};
	return {
		hook: {
			events: {
				...createAgentChannelDeliveryInstrumentation({
					recordInputs: n,
					stateStore: e.stateStore
				}),
				...f,
				"model.settled": onStepTerminal,
				"model.retried": onStepTerminal,
				"model.started": onStepStarted,
				"model.call.settled": onModelCallTerminal,
				"model.call.started": onModelCallStarted,
				"session.ended": onSessionEnded,
				"session.started": onSessionStarted,
				...d.events,
				"turn.settled": c.turnSettled,
				"turn.started": onTurnStarted
			},
			name: `eve.otel`,
			projectEvent: a.projectEvent,
			receivesTurnScopes: !0,
			tracePolicy: () => ({
				emit: !0,
				recordInputs: n,
				recordOutputs: r
			})
		},
		prepareSessionTrace: l,
		prepareTurnTrace: u,
		readTurnTraceContext: c.readTurnTraceContext,
		decision: i.decision,
		async runInContext(t, n) {
			if (t.type === `memory.operation`) return p.runInContext(t, n);
			let r = {
				emit: !0,
				...await a.forOperation(t.scope)
			};
			let inTurn = async () => {
				if (t.scope.turnId === void 0) return n();
				let i = await c.turnFor(t.scope.sessionId, t.scope.turnId, withChannelAudience(ROOT_CONTEXT, t.scope.channelAudience));
				if (i !== void 0 && !i.finished) return i.run(n, r);
				let { sessionId: a, turnId: o } = t.scope;
				return e.telemetry.suppressed !== void 0 && await c.dropped(a, o) ? e.telemetry.suppressed(n) : n();
			};
			if (t.type === `tool.call`) return d.runInContext(t, n, r, inTurn);
			let i = s.get(attemptIdempotencyKey(t.scope))?.get(t.idempotencyKey);
			return i !== void 0 && !i.finished ? i.run(n, r) : inTurn();
		}
	};
	async function drainOpenSpans(e) {
		for (let t of s.get(attemptIdempotencyKey(e.scope))?.values() ?? []) attemptFailed(e) ? await t.fail(e.error) : await t.complete({
			outcome: `completed`,
			result: {
				finishReason: `unknown`,
				usage: {}
			}
		});
		s.delete(attemptIdempotencyKey(e.scope));
	}
}
function attemptFailed(e) {
	return e.type === `model.retried` || e.outcome !== `completed` && e.outcome !== `cancelled`;
}
// node_modules/eve/dist/src/tracing/eve/otel-registration.js
const REGISTRATION_SPAN_NAME = `eve.otel.registration`;
const REPLAY_DEDUPLICATION_LIMIT = 1e5;
const REPLAY_DEDUPLICATION_KEY = Symbol.for(`eve.otel.replay-deduplication`);
const require = createRequire(import.meta.url);
const replayDeduplicationGlobal = globalThis;
var RegistrationMarkerPropagator = class {
	#e = !1;
	extract(e) {
		return e;
	}
	fields() {
		return [];
	}
	inject() {
		this.#e = !0;
	}
	isInstalled() {
		return this.#e = !1, propagation.inject(context.active(), {}, { set: () => {} }), this.#e;
	}
};
var PrivateSpanFilteringProcessor = class {
	endedSpans;
	forwardedSpans = /* @__PURE__ */ new Set();
	pendingByParent = /* @__PURE__ */ new Map();
	pendingSpanCount = 0;
	processors;
	startedSpans = /* @__PURE__ */ new Set();
	constructor(e, t) {
		this.processors = e, this.endedSpans = t;
	}
	async forceFlush() {
		this.drainPendingSpans(), await Promise.all(this.processors.map((e) => e.forceFlush()));
	}
	onEnd(e) {
		if (isRegistrationSpan(e)) return;
		let t = spanIdentity(e);
		if (t !== void 0) {
			if (this.endedSpans.has(t)) return;
			if (this.endedSpans.size >= REPLAY_DEDUPLICATION_LIMIT) {
				let e = this.endedSpans.values().next().value;
				e !== void 0 && this.endedSpans.delete(e);
			}
			this.endedSpans.add(t);
		}
		let n = parentIdentity(e);
		if (n !== void 0 && this.startedSpans.has(n) && !this.forwardedSpans.has(n)) {
			let t = this.pendingByParent.get(n) ?? [];
			t.push(e), this.pendingByParent.set(n, t), this.pendingSpanCount += 1, this.pendingSpanCount > 1e4 && this.releaseOldestPendingParent();
		} else this.forward(e, t);
	}
	onStart(e, t) {
		if (isRegistrationSpan(e)) return;
		let n = e;
		let r = conversationIdFromContext(t);
		r !== void 0 && n.attributes?.[`gen_ai.conversation.id`] === void 0 && n.setAttribute(`gen_ai.conversation.id`, r);
		let i = traceSessionIdFromContext(t);
		process.env.VERCEL_ENV !== void 0 && i !== void 0 && n.attributes?.[`vercel.session_id`] === void 0 && n.setAttribute(`vercel.session_id`, i);
		let a = spanIdentity(e);
		a !== void 0 && addBounded(this.startedSpans, a);
		for (let n of this.processors) n.onStart(e, t);
	}
	async shutdown() {
		this.drainPendingSpans(), await Promise.all(this.processors.map((e) => e.shutdown()));
	}
	drainPendingSpans() {
		for (; this.pendingByParent.size > 0;) this.releaseOldestPendingParent();
	}
	releaseOldestPendingParent() {
		let e = this.pendingByParent.keys().next().value;
		e !== void 0 && this.releaseChildren(e);
	}
	releaseChildren(e) {
		let t = this.pendingByParent.get(e);
		if (t !== void 0) {
			this.pendingByParent.delete(e), this.pendingSpanCount -= t.length;
			for (let e of t) this.forward(e, spanIdentity(e));
		}
	}
	forward(e, t) {
		for (let t of this.processors) t.onEnd(e);
		t !== void 0 && (addBounded(this.forwardedSpans, t), this.releaseChildren(t));
	}
};
function registerOtelPipeline(e) {
	let t = e.otel;
	let n = captureOptionalPeerTracerProxy();
	let r = new AgentSpanIdGenerator();
	let i = new RegistrationMarkerPropagator();
	let a = privateSpanProcessors(t.spanProcessors);
	let o = {
		attributes: t.resource,
		autoDetectResources: !1,
		idGenerator: r,
		instrumentations: t.instrumentations ?? [],
		metricReaders: t.metricReaders,
		propagators: [...t.propagators ?? [`auto`], i],
		serviceName: e.serviceName,
		spanProcessors: a
	};
	registerOTel(t.sampler === void 0 ? o : {
		...o,
		traceSampler: t.sampler
	});
	let s = globalTracerUses(r);
	let c = i.isInstalled();
	if (s && c || rollbackRegistration({
		ownsPropagator: c,
		ownsTracer: s
	}), !s) throw Error("eve could not register OpenTelemetry because another runtime already owns the global tracer provider. Remove the other `registerOTel` call, or move its exporters into eve's `otelIntegration({ spanProcessors: [...] })`.");
	if (!c) throw Error("eve could not register OpenTelemetry because another runtime already owns the global propagator. Remove the other global propagator registration and declare propagators through eve's `otel()` instead.");
	let l = runtimeTracerProvider();
	if (typeof l.forceFlush != `function` || typeof l.shutdown != `function`) throw rollbackRegistration({
		ownsPropagator: c,
		ownsTracer: s
	}), Error(`The registered OpenTelemetry tracer provider has no lifecycle methods.`);
	n?.setDelegate(l);
	let u = runtimeMeterProvider();
	return {
		provider: trace.getTracerProvider(),
		forceFlush: async () => {
			await Promise.all([l.forceFlush(), u.forceFlush?.()]);
		},
		idGenerator: r,
		samplesTrace: (e, t) => samplerAdmitsTrace(r, e, t),
		shutdown: async () => {
			disableInstrumentations(t.instrumentations), await Promise.all([l.shutdown(), u.shutdown?.()]);
		}
	};
}
function privateSpanProcessors(e) {
	let t = e.filter(isSpanProcessor$1);
	if (t.length === 0) return [...e];
	let n = new PrivateSpanFilteringProcessor(t, replayDeduplicationRegistry());
	let r = [];
	let i = !1;
	for (let t of e) isSpanProcessor$1(t) ? i || (i = !0, r.push(n)) : r.push(t);
	return r;
}
function replayDeduplicationRegistry() {
	let e = replayDeduplicationGlobal[REPLAY_DEDUPLICATION_KEY];
	if (e !== void 0) return e;
	let t = /* @__PURE__ */ new Set();
	return replayDeduplicationGlobal[REPLAY_DEDUPLICATION_KEY] = t, t;
}
const registerOtel = registerOtelPipeline;
function samplerAdmitsTrace(e, t, n = { name: invocationName(void 0) }) {
	return (e.withTraceId(t, () => trace.getTracer(`eve.registration`).startSpan(n.name, {
		attributes: n.attributes,
		kind: SpanKind.INTERNAL,
		root: !0
	})).spanContext().traceFlags & 1) == 1;
}
function rollbackRegistration(e) {
	if (e.ownsPropagator && propagation.disable(), !e.ownsTracer) return;
	let t = runtimeTracerProvider();
	if (typeof t.shutdown == `function`) try {
		t.shutdown().catch(() => {});
	} catch {}
	trace.disable();
}
function runtimeTracerProvider() {
	let e = trace.getTracerProvider();
	return e.getDelegate?.() ?? e;
}
function runtimeMeterProvider() {
	let e = metrics.getMeterProvider();
	return {
		forceFlush: typeof e?.forceFlush == `function` ? () => e.forceFlush() : void 0,
		shutdown: typeof e?.shutdown == `function` ? () => e.shutdown() : void 0
	};
}
function disableInstrumentations(e) {
	for (let t of e ?? []) {
		let e = t?.disable;
		if (typeof e == `function`) try {
			e.call(t);
		} catch {}
	}
}
function globalTracerUses(e) {
	let t = e.allocateSpanId();
	return e.withSpanId(t, () => trace.getTracer(`eve.registration`).startSpan(REGISTRATION_SPAN_NAME)).spanContext().spanId === t;
}
function isRegistrationSpan(e) {
	return typeof e == `object` && !!e && (`name` in e && e.name === REGISTRATION_SPAN_NAME || `instrumentationScope` in e && e.instrumentationScope?.name === `eve.registration`);
}
function spanIdentity(e) {
	if (typeof e != `object` || !e || !(`spanContext` in e) || typeof e.spanContext != `function`) return;
	let t = e.spanContext();
	return typeof t.traceId == `string` && typeof t.spanId == `string` ? `${t.traceId}:${t.spanId}` : void 0;
}
function parentIdentity(e) {
	if (typeof e != `object` || !e || !(`parentSpanContext` in e)) return;
	let t = e.parentSpanContext;
	return typeof t?.traceId == `string` && typeof t.spanId == `string` ? `${t.traceId}:${t.spanId}` : void 0;
}
function addBounded(e, t) {
	if (e.size >= REPLAY_DEDUPLICATION_LIMIT) {
		let t = e.values().next().value;
		t !== void 0 && e.delete(t);
	}
	e.add(t);
}
function isSpanProcessor$1(e) {
	return e !== `auto`;
}
function captureOptionalPeerTracerProxy() {
	try {
		let e = require("@opentelemetry/api");
		let t = e.trace.getTracerProvider();
		return t instanceof e.ProxyTracerProvider ? t : void 0;
	} catch {
		return;
	}
}
// node_modules/eve/dist/src/tracing/eve/install-instrumentation-runtime.js
const log = createLogger(`tracing.install-instrumentation-runtime`);
function installInstrumentationRuntime(e) {
	let t = [];
	let n = [];
	let r;
	let i;
	let a;
	let o;
	let s;
	let runInContext = (e, t) => t();
	let c;
	if (e.collected.declared) {
		r = registerOtel({
			serviceName: e.serviceName,
			otel: e.collected.configuration
		}), c = r.idGenerator;
		let l = createAgentOtelInstrumentation({
			environment: resolveInstrumentationEnvironment(),
			frameworkVersion: e.frameworkVersion,
			telemetry: otelTelemetry({
				provider: r.provider,
				tracerName: `eve.agent`,
				tracerVersion: e.frameworkVersion,
				idGenerator: c,
				samplesTrace: r.samplesTrace,
				mapping: eveOutputMapping()
			}),
			idGenerator: c,
			recordInputs: !0,
			recordOutputs: !0,
			stateStore: new ContextAgentTraceStateStore(),
			tracePolicy: e.collected.settings.tracePolicy
		});
		t.push({
			...l.hook,
			stateNamespace: `internal:otel`
		}), i = l.prepareSessionTrace, a = l.prepareTurnTrace, o = l.readTurnTraceContext, s = l.decision, runInContext = l.runInContext;
		let u = e.collected.configuration.spanProcessors.filter(isSpanProcessor).filter(hasConversationRelease);
		u.length > 0 && n.push(sessionReleaseProvider(u));
	} else c = new AgentSpanIdGenerator();
	let l = [
		...t,
		...e.providers,
		...n
	];
	let u;
	return registerInstrumentationRuntime({
		forceFlush: async () => {
			await settleAll(l.map((e) => () => e.flush?.())), await settleAll(r === void 0 ? [] : [r.forceFlush]);
		},
		hooks: createInstrumentationHooks({
			parallel: e.providers,
			serialAfter: n,
			serialBefore: t
		}),
		idGenerator: c,
		memoryOperations: r !== void 0 || e.providers.some(hasMemoryOperationHandler),
		otelSettings: e.collected.declared ? e.collected.settings : void 0,
		ownsAgentSpans: r !== void 0,
		prepareSessionTrace: i,
		prepareTurnTrace: a,
		readTurnTraceContext: o,
		decision: s,
		runtimeContextResolvers: e.runtimeContextResolvers,
		runInContext,
		samplesTrace: r?.samplesTrace,
		shutdown: () => (u ??= (async () => {
			await settleAll(l.map((e) => () => e.shutdown?.())), await settleAll(r === void 0 ? [] : [r.shutdown]);
		})(), u)
	});
}
function hasMemoryOperationHandler(e) {
	return e.events?.[`memory.operation.started`] !== void 0 || e.events?.[`memory.operation.settled`] !== void 0;
}
function isSpanProcessor(e) {
	return e !== `auto`;
}
function sessionReleaseProvider(e) {
	return {
		events: { "session.ended": async (t) => {
			let n = readConversationId(contextStorage.getStore()?.get(ConversationIdKey)) ?? t.sessionId;
			n === t.sessionId && await Promise.all(e.map((e) => e.releaseConversation(n)));
		} },
		name: `eve.conversation-release`,
		stateNamespace: `internal:conversation-release`
	};
}
async function settleAll(e) {
	let t = await Promise.allSettled(e.map(async (e) => e()));
	for (let e of t) e.status === `rejected` && log.warn(`instrumentation drain failed`, { error: formatError(e.reason) });
}
// node_modules/eve/dist/src/instrumentation/providers.js
const INSTRUMENTATION_PROVIDERS_GLOBAL_KEY = Symbol.for(`eve.harness-instrumentation-providers`);
const globalContainer = globalThis;
function providerRegistry() {
	let e = globalContainer[INSTRUMENTATION_PROVIDERS_GLOBAL_KEY];
	if (e !== void 0) return e;
	let t = /* @__PURE__ */ new Map();
	return globalContainer[INSTRUMENTATION_PROVIDERS_GLOBAL_KEY] = t, t;
}
function seedInstrumentationProviders() {
	let e = providerRegistry();
	(process.env.VERCEL_ENV === `preview` || process.env.VERCEL_ENV === `production`) && e.set(`agent-runs`, agentRuns()), process.env["EVE_DEV_WORKER_APP_ROOT"] !== void 0 && e.set(`local`, localTraces());
}
function getInstrumentationProviders() {
	return [...providerRegistry()].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		provider: t,
		slot: e
	}));
}
function finalizeInstrumentationProviders(e) {
	let t = getInstrumentationProviders();
	let n = t.filter((e) => !isOtelDeclaration(e.provider) && !isOtelIntegration(e.provider)).map(toProviderDefinition);
	let r = collectOtelPipeline(t.map((e) => e.provider));
	return installInstrumentationRuntime({
		collected: r,
		frameworkVersion: resolveInstalledPackageInfo().version,
		providers: n,
		runtimeContextResolvers: r.runtimeContextResolvers,
		serviceName: e.serviceName
	});
}
async function shutdownInstrumentationProviders() {
	await getInstrumentationRuntime()?.shutdown();
}
function toProviderDefinition(e) {
	return {
		events: e.provider.events,
		flush: e.provider.flush,
		name: e.slot,
		shutdown: e.provider.shutdown,
		stateNamespace: `authored:${e.slot}`,
		tracePolicy: e.provider.tracePolicy
	};
}
export { DEVELOPMENT_WORLD_OPERATIONS, atomicWriteFile, finalizeInstrumentationProviders, seedInstrumentationProviders, shutdownInstrumentationProviders };

//# sourceMappingURL=eve31.mjs.map