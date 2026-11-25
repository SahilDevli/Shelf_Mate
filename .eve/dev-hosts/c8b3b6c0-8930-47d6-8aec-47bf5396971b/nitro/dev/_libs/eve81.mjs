import { createLogger, logError } from "./eve4.mjs";
import { ConversationContextKey, SessionNotActiveError, SessionStrandedError, describeStrandedSession, deserializeUrlFilePart, emptySessionView, foldReceivedEvent, getAdapterKind, hasInternalRefScheme, isInstrumentationChannelKind, isSerializedUrlFilePart, normalizeChannelAudience, normalizeConversationSpace, normalizeInstrumentationChannelKind, readForwardedTraceAssertion, resolveConversationContext } from "./eve8.mjs";
import { logicalSessionInboxToken, logicalSessionToken, sessionCommandHookToken, sessionInboxHookToken } from "./eve6.mjs";
import { resolveInstalledPackageInfo } from "./eve2.mjs";
import { walkCauseChain } from "./eve17.mjs";
import { agentLimits, connectionEventHookToken, resolveWorkflowCallbackBaseUrl, runtimeNodeId } from "./eve49.mjs";
import { AcceptedSessionIdentityError, StrandedSessionOwnerError, assertRunnableSessionInbox, assertRunnableSessionOwner, buildSessionAttributes, buildSubagentRootAttributes, createV26HistoryReader, deriveSessionTitle, encodeLineBytes, findSessionHookHolder, isStoredLine, isV26Line, principalIdentity, readParentLineage, requireSessionId, resolveSessionInbox, resumeSessionInbox, resumeSignInCallback, runtime_exports, validateToolStubTargets } from "./eve65.mjs";
import { connectionEventDeliveryWorkflowReference, connectionEventWorkflowReference, workflowEntryReference } from "./eve72.mjs";
import { cascade, createEventReader, createStreamChecker, eventsOf, linesOf } from "./eve29.mjs";
import { durableRunEnded, installDurableHost, isRunInactive, sessionLineStore } from "./eve43.mjs";
import { controlAdmitted, controlSettled, createChannelDeliveryMetadata, defined, deliveryApplied, fact, sessionEndedFacts, validateDeliveryIdempotencyKey } from "./eve22.mjs";
import { decodeSandboxRef, isSandboxRefUrl } from "./eve25.mjs";
import { getKnownByteLength } from "./eve69.mjs";
import { commitOf } from "./eve37.mjs";
import { checksSessionEvents } from "./eve28.mjs";
import { isObject, isThenable } from "./eve3.mjs";
import { AgentSessionRuntimeOverridesKey, AuthKey, CapabilitiesKey, ChannelDeliveryKey, ChannelInstrumentationKey, ChannelRequestIdKey, ContextContainer, ContinuationHookTokensKey, ContinuationTokenKey, ConversationIdKey, DynamicSubagentAgentConfigKey, EarlierRemoteCallerKey, InitiatorAuthKey, OccurrenceIdKey, ParentSessionKey, ParentTraceContextKey, ScheduleIdKey, ScheduleInstanceKey, SessionCallbackKey, SessionIdKey, SessionPredecessorKey, SessionTitleKey, SessionTraceSeedKey, SteeredByKey, ToolStubsKey, TraceRootKey, contextStorage, resolveKey } from "./eve7.mjs";
import { ChannelKey, SessionAgentKey, compiledSessionAgent, formatCapabilityError, loadCompiledSessionAgent } from "./eve12.mjs";
import { loadCompiledManifest } from "./eve13.mjs";
import { resolveInstrumentationEnvironment } from "./eve11.mjs";
import { readConversationId } from "./eve9.mjs";
import { initializeSessionInstrumentation, resolveInstrumentationProjection } from "./eve27.mjs";
import { isAgentTraceContext } from "./eve52.mjs";
import { context, trace } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/api/index.js";
import { createHash } from "node:crypto";
import { getStepMetadata, getWorkflowMetadata } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@workflow/core/index.js";
import { EntityConflictError, HookConflictError, HookNotFoundError, RunExpiredError, WorkflowRunNotFoundError } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@workflow/errors/index.js";
// node_modules/eve/dist/src/execution/ndjson-stream.js
function parseNdjsonStream(e, t = (e) => e) {
	let n = new TextDecoder();
	let r = ``;
	let i;
	let a = !1;
	return new ReadableStream({
		start() {
			i = e().getReader();
		},
		async pull(e) {
			try {
				for (;;) {
					let { value: o, done: s } = await i.read();
					if (a) return;
					if (s) {
						r += n.decode();
						let i = r.trim();
						i.length > 0 && e.enqueue(t(JSON.parse(i))), e.close();
						return;
					}
					r += n.decode(o, { stream: !0 });
					let c = !1;
					for (let n = r.indexOf(`
`); n !== -1; n = r.indexOf(`
`)) {
						let i = r.slice(0, n).trim();
						r = r.slice(n + 1), i.length > 0 && (e.enqueue(t(JSON.parse(i))), c = !0);
					}
					if (c) return;
				}
			} catch (t) {
				if (a) return;
				e.error(t), await i.cancel(t).catch(() => {});
			}
		},
		async cancel(e) {
			a = !0, await i?.cancel(e);
		}
	});
}
// node_modules/eve/dist/src/execution/session-event-stream.js
function readSessionRecords(e, t) {
	return parseNdjsonStream(() => sessionLineStore(e).readable(e, t));
}
function readSessionEventStream(e, t, n) {
	let r = new AbortController();
	let i = streamSessionLines(e, {
		startIndex: t,
		signal: n === void 0 ? r.signal : AbortSignal.any([n, r.signal])
	});
	let a = createEventReader();
	return new ReadableStream({
		async pull(e) {
			for (;;) {
				let t = await i.next();
				if (t.done === !0) {
					e.close();
					return;
				}
				let { line: n, position: r } = t.value;
				if (n === void 0) continue;
				let o = a.read(n, r);
				if (o.length !== 0) {
					for (let t of o) e.enqueue(t);
					return;
				}
			}
		},
		async cancel() {
			r.abort(), await i.return(void 0);
		}
	});
}
function readSessionEventHistory(e, t, n) {
	let r = streamSessionEvents(e, {
		follow: !1,
		startIndex: t,
		signal: n
	});
	return new ReadableStream({
		async pull(e) {
			let t = await r.next();
			t.done ? e.close() : e.enqueue(t.value);
		},
		async cancel() {
			await r.return(void 0);
		}
	});
}
function readSessionRecordHistory(e, t) {
	let n;
	let r = 0;
	let i = -1;
	return new ReadableStream({
		async start() {
			i = await readSessionStreamTailIndex(e);
			let a = t ?? 0;
			r = a < 0 ? Math.max(0, i + 1 + a) : a, r <= i && (n = readSessionRecords(e, r).getReader());
		},
		async pull(e) {
			if (n === void 0 || r > i) {
				e.close(), await n?.cancel().catch(() => {});
				return;
			}
			let { done: t, value: a } = await n.read();
			t ? e.close() : (e.enqueue(a), r += 1);
		},
		async cancel() {
			await n?.cancel().catch(() => {});
		}
	});
}
async function readSessionStreamTailIndex(e) {
	return await sessionLineStore(e).tail(e);
}
async function assertSessionHistoryReadable(e) {
	await sessionLineStore(e).assertReadable(e);
}
async function* streamSessionLines(e, t = {}) {
	let { follow: n = !0, signal: r } = t;
	let i = t.startIndex ?? 0;
	if (r?.aborted) return;
	let a;
	let o = i;
	if ((!n || i < 0) && (a = await readSessionStreamTailIndex(e), i < 0 && (o = Math.max(0, a + 1 + i))), !n && a !== void 0 && o > a) return;
	let s = readSessionRecords(e, o).getReader();
	let cancel = () => void s.cancel(r?.reason).catch(() => {});
	r?.addEventListener(`abort`, cancel, { once: !0 });
	try {
		let e = o;
		for (; !r?.aborted;) {
			let { done: t, value: r } = await s.read();
			if (t || (yield {
				line: isStoredLine(r) ? r : void 0,
				position: e,
				record: r
			}, !n && a !== void 0 && e >= a)) return;
			e += 1;
		}
	} finally {
		r?.removeEventListener(`abort`, cancel), await s.cancel().catch(() => {}), s.releaseLock();
	}
}
async function* streamSessionEvents(e, t = {}) {
	let n = createEventReader();
	let r;
	for await (let { line: i, position: a, record: o } of streamSessionLines(e, t)) {
		r === void 0 && isV26Line(o) && (r = createV26HistoryReader(), a > 0 && await readV26Prefix(r, e, a, t.signal));
		let s = r === void 0 ? i : r.read(o, a);
		s !== void 0 && (yield* n.read(s, a));
	}
}
async function readV26Prefix(e, t, n, r) {
	for await (let { position: i, record: a } of streamSessionLines(t, {
		follow: !1,
		signal: r,
		startIndex: 0
	})) {
		if (i >= n) return;
		e.read(a, i);
	}
}
// node_modules/eve/dist/src/harness/user-parts.js
function userPartsOf(e) {
	if (typeof e == `string`) return [{
		kind: `text`,
		text: e
	}];
	let t = [];
	for (let n of e) t.push(n.type === `text` ? {
		kind: `text`,
		text: n.text
	} : filePart(n.data, n.mediaType, n.filename));
	return t;
}
function filePart(e, t, n) {
	if (isSandboxRefUrl(e)) {
		let t = decodeSandboxRef(e);
		return file({
			filename: basenameOf(n ?? t.path),
			mediaType: t.mediaType,
			size: t.size
		});
	}
	if (isTaggedFileData(e)) switch (e.type) {
		case `data`: return file({
			filename: n,
			mediaType: t,
			size: byteLengthOf(e.data)
		});
		case `reference`:
		case `text`: return file({
			filename: n,
			mediaType: t
		});
		case `url`: return file({
			filename: n,
			mediaType: t,
			url: clientUrl(e.url)
		});
	}
	let r = byteLengthOf(e);
	return file(r === void 0 ? {
		filename: n,
		mediaType: t,
		url: clientUrl(e)
	} : {
		filename: n,
		mediaType: t,
		size: r
	});
}
function file(e) {
	let t = {
		kind: `file`,
		mediaType: e.mediaType
	};
	return e.filename !== void 0 && (t.filename = e.filename), e.size !== void 0 && (t.size = e.size), e.url === void 0 ? t.unavailable = !0 : t.url = e.url, t;
}
function isTaggedFileData(e) {
	if (typeof e != `object` || !e) return !1;
	let t = e.type;
	return t === `data` || t === `reference` || t === `text` || t === `url`;
}
function byteLengthOf(e) {
	return getKnownByteLength(e) ?? void 0;
}
function clientUrl(e) {
	if (isSerializedUrlFilePart(e)) try {
		return httpUrl(deserializeUrlFilePart(e));
	} catch {
		return;
	}
	if (e instanceof URL) return httpUrl(e);
	if (!(typeof e != `string` || hasInternalRefScheme(e) || e.startsWith(`data:`))) try {
		return httpUrl(new URL(e));
	} catch {
		return;
	}
}
function httpUrl(e) {
	return e.protocol === `http:` || e.protocol === `https:` ? e.href : void 0;
}
function basenameOf(e) {
	let t = e.replaceAll(`\\`, `/`);
	let n = t.slice(t.lastIndexOf(`/`) + 1);
	return n.length > 0 ? n : e;
}
// node_modules/eve/dist/src/execution/session/delivery-facts.js
function planAdmission(e) {
	let { delivery: t } = e;
	let n = [];
	let r = [];
	let i = principalOf(t.auth);
	for (let { input: a, payload: o } of e.payloads) {
		let s = t.payloads.indexOf(o);
		let c = t.deliveryMetadata?.find((e) => e.payloadIndex === s);
		if (c === void 0) throw Error(`Session delivery has no identity. Assign delivery metadata at dispatch before admission.`);
		let l = c.deliveryId;
		let u = defined({
			channel: c.channelKind ?? e.channelKind,
			hook: c.hook,
			scheduleId: t.schedule?.definition
		});
		let d = e.status?.(l);
		if (a === void 0) {
			d !== `settled` && n.push({
				deliveryId: l,
				ignored: {},
				principal: i,
				recorded: d !== void 0,
				source: u
			});
			continue;
		}
		d === void 0 && n.push({
			deliveryId: l,
			principal: i,
			source: u
		});
		let f = defined({
			deliveryId: l,
			history: (a.history?.length ?? 0) > 0 ? a.history : void 0,
			parts: a.message === void 0 ? [] : userPartsOf(a.message)
		});
		let { answers: p, ...m } = a;
		r.push(p === void 0 || p.length === 0 ? {
			...m,
			deliveries: [f]
		} : {
			...m,
			answers: p.map((e, t) => defined({
				interactionId: e.interactionId,
				optionId: e.optionId,
				text: e.text,
				deliveryId: l,
				responseId: `response_${l}_${String(t)}`
			})),
			deliveries: [f]
		});
	}
	return {
		deliveries: n,
		inputs: r
	};
}
function principalOf(e) {
	if (e != null) return defined({
		id: e.principalId,
		issuer: e.issuer,
		type: e.principalType
	});
}
// node_modules/eve/dist/src/harness/session-machine/deliveries.js
function admitDeliveries(e, t = {}) {
	let { start: n } = t;
	return commitOf([...n === void 0 ? [] : [fact(`session.started`, n)], ...e.flatMap(({ ignored: e, recorded: t, ...n }) => [...t === !0 ? [] : [fact(`delivery.admitted`, n)], ...e === void 0 ? [] : [fact(`delivery.settled`, {
		deliveryId: n.deliveryId,
		outcome: `ignored`,
		reason: e.reason
	})]])]);
}
function admitControl(e, t, n = {}) {
	return commitOf([controlAdmitted(e, t), ...n.applied === !0 ? [deliveryApplied(e.deliveryId)] : []]);
}
function settleControl(e) {
	return commitOf(controlSettled(e));
}
function failInterruptedControl(e, t, n) {
	return commitOf([...n.recorded ? [] : [controlAdmitted(e, t)], fact(`delivery.settled`, {
		deliveryId: e.deliveryId,
		outcome: `failed`,
		reason: `${t}-interrupted`
	})]);
}
function settleDelivery(e, t, n) {
	return commitOf([fact(`delivery.settled`, {
		deliveryId: e,
		outcome: t,
		reason: n
	})]);
}
function endSession(e, t) {
	return commitOf(sessionEndedFacts(e, t));
}
// node_modules/eve/dist/src/harness/session-machine/lines.js
async function createLineCommitter() {
	let e = checksSessionEvents() ? (await import("./_14.mjs")).schemaViolation : void 0;
	let t;
	return {
		commit(n, r, i, a = (/* @__PURE__ */ new Date()).toISOString()) {
			e !== void 0 && (t ??= createStreamChecker({
				seed: n,
				validate: e
			}));
			let o = linesOf(cascade(n, eventsOf(r)), a).map((e, t) => ({
				bytes: encodeLineBytes(e),
				line: e,
				position: i + t
			}));
			for (let { line: e, position: n } of o) {
				let r = t?.check(e, n) ?? [];
				if (r.length !== 0) throw t = void 0, Error(`Session event contract: ${r.map((e) => `${e.rule} at ${e.position}:${e.index ?? `progress`}: ${e.message}`).join(`; `)}`);
			}
			return o;
		},
		reset() {
			t = void 0;
		}
	};
}
async function waitForSessionHooksRelease(e, t) {
	await Promise.all([...new Set(e)].map((e) => waitForHookRelease(sessionInboxHookToken(e), t)));
}
async function waitForHookRelease(e, t) {
	let n = Date.now() + 3e4;
	for (;;) {
		if (!await servesSession(e, t)) return;
		if (Date.now() >= n) throw Error(`Timed out waiting for session "${t.sessionId}" to release inbox "${e}".`);
		await new Promise((e) => setTimeout(e, 20));
	}
}
async function servesSession(e, t) {
	let n = await findSessionHookHolder(e);
	if (n === void 0) return !1;
	try {
		if (n.hook !== void 0) return requireSessionId(await n.hook.metadata) === t.sessionId;
	} catch {}
	return n.runId === t.ownerRunId;
}
// node_modules/eve/dist/src/execution/session-inbox/end-stranded-session.js
const log$3 = createLogger(`execution.session-inbox`);
function strandedEndPolicy(e) {
	return `stranded-${e}`;
}
async function endStrandedSession(e, t, n, r) {
	if (n === `reset` && r === void 0) throw Error(`A stranded reset requires its control delivery identity.`);
	let i = typeof t == `string` ? await resolveStrandedSessionId(e) : t.sessionId;
	let { ownerRunId: a } = e;
	let o = await (0, runtime_exports.getWorld)();
	await assertStillServesSession(i, a);
	let s = await listOwnedSessionTokens(o, a);
	return await publishTerminalEvent(i, n, r), await cancelRuns(o, [a, i], `Session ended: its deployment was retired`), await waitForSessionHooksRelease([
		sessionCommandHookToken(i),
		logicalSessionToken(t),
		...s
	], {
		ownerRunId: a,
		sessionId: i
	}), log$3.warn(`Reset stranded session`, {
		currentEveVersion: resolveInstalledPackageInfo().version,
		previousEveVersion: e.eveVersion ?? `unknown`,
		previousSessionId: i,
		trigger: n
	}), i;
}
async function assertStillServesSession(e, t) {
	let n = await findSessionHookHolder(sessionInboxHookToken(sessionCommandHookToken(e)));
	if (n !== void 0 && n.runId !== t) throw Error(`Session "${e}" changed owners while it was being reset. Nothing was ended; retry the request.`);
}
async function publishTerminalEvent(e, t, n) {
	let r = await readRecordedView(e);
	if (r === void 0) return;
	let i = (0, runtime_exports.getRun)(e).getWritable().getWriter();
	let a = (async () => {
		let e = endSession({ view: r }, {
			cause: n === void 0 ? { policy: strandedEndPolicy(t) } : void 0,
			control: n === void 0 ? void 0 : {
				deliveryId: n.deliveryId,
				principal: principalOf(n.auth)
			},
			error: {
				code: `session_stranded`,
				message: `This session is no longer available.`
			},
			outcome: `failed`
		});
		let a = (await createLineCommitter()).commit(r, e, r.position);
		for (let { bytes: e } of a) await i.write(e);
		return await i.close(), !0;
	})();
	a.catch(() => {});
	let o;
	let s = new Promise((e) => {
		o = setTimeout(() => e(!1), 5e3);
	});
	try {
		await Promise.race([a, s]) || log$3.warn(`Timed out finishing the stranded session stream`, { sessionId: e });
	} catch (t) {
		log$3.warn(`Could not finish the stranded session stream`, {
			error: t,
			sessionId: e
		});
	} finally {
		clearTimeout(o), i.releaseLock();
	}
}
async function readRecordedView(e) {
	let t = emptySessionView();
	let n = new AbortController();
	let r = (async () => {
		for await (let r of streamSessionEvents(e, {
			follow: !1,
			signal: n.signal
		})) foldReceivedEvent(t, r);
	})();
	r.catch(() => {});
	let i;
	let a = new Promise((e) => {
		i = setTimeout(() => e(!1), 3e4);
	});
	let o;
	try {
		o = !await Promise.race([r.then(() => !0), a]);
	} catch (t) {
		log$3.warn(`Could not read the stranded session history`, {
			error: t,
			sessionId: e
		});
		return;
	} finally {
		clearTimeout(i);
	}
	if (o) throw n.abort(), Error(`Timed out reading the history of stranded session "${e}". Nothing was ended; retry the request.`);
	return t;
}
async function cancelRuns(e, t, n) {
	for (let r of new Set(t)) try {
		await (0, runtime_exports.cancelRun)(e, r, { cancelReason: n });
	} catch (e) {
		if (!isRunInactive(e)) throw e;
	}
}
async function resolveStrandedSessionId(e) {
	let { attributes: t, runId: n } = e.ownerRun;
	let r = t["$eve.session"];
	if (r !== void 0) return r;
	if (e.hook !== void 0) try {
		return requireSessionId(await e.hook.metadata);
	} catch {}
	if (t["$eve.type"] !== void 0) return n;
	throw Error(`Cannot reset stranded session owner run "${n}": it does not record which session it serves. Cancel the run directly.`);
}
async function listOwnedSessionTokens(e, t) {
	let n = [];
	let r;
	for (let i = 0; i < 10; i++) {
		let i = await e.hooks.list({
			pagination: {
				cursor: r,
				limit: 100
			},
			resolveData: `none`,
			runId: t
		});
		for (let e of i.data) {
			let t = logicalSessionInboxToken(e.token);
			t !== void 0 && n.push(t);
		}
		if (!i.hasMore || i.cursor === null) break;
		r = i.cursor;
	}
	return n;
}
// node_modules/eve/dist/src/execution/child-binding.js
function namespaceOf(e) {
	return `eve.child.${e}`;
}
async function recordRemoteChildBinding(e, t) {
	let n = (0, runtime_exports.getRun)(e).getWritable({ namespace: namespaceOf(t.childSessionId) }).getWriter();
	try {
		await n.write(t);
	} finally {
		n.releaseLock();
	}
}
async function readRemoteChildBinding(e, t) {
	let n = (0, runtime_exports.getRun)(e).getReadable({ namespace: namespaceOf(t) });
	try {
		if (await n.getTailIndex() < 0) return;
		let e = n.getReader();
		let r = await e.read();
		return e.releaseLock(), r.done ? void 0 : parseBinding(r.value, t);
	} finally {
		await n.cancel().catch(() => {});
	}
}
function parseBinding(e, t) {
	if (!isObject(e)) return;
	let { callId: n, dynamicBinding: r, earlierProtocol: i, name: a, resolverId: o, streamPath: s, url: c } = e;
	if (typeof n != `string` || typeof a != `string` || typeof s != `string` || typeof c != `string`) return;
	let l = {
		callId: n,
		childSessionId: t,
		name: a,
		streamPath: s,
		url: c
	};
	return typeof o == `string` && (l.resolverId = o), r !== void 0 && (l.dynamicBinding = r), typeof i == `number` && (l.earlierProtocol = i), l;
}
// node_modules/eve/dist/src/public/definitions/state.js
function mountedStateKeyName(e, t) {
	return `eve:mount.v1:${encodeURIComponent(e)}:${encodeURIComponent(t)}`;
}
// node_modules/eve/dist/src/context/serialize.js
const log$2 = createLogger(`context.serialize`);
const STATE_LAYOUT_KEY = `eve.stateLayout`;
function serializeContext(e) {
	let t = {};
	for (let [n, r] of e.entries()) try {
		t[n.name] = n.codec ? n.codec.serialize(r) : r;
	} catch (e) {
		throw logError(log$2, `failed to serialize context key`, e, { key: n.name }), e;
	}
	return (t[SessionAgentKey.name] !== void 0 || Object.keys(t).some((e) => e.startsWith(`eve:mount.`))) && (t[STATE_LAYOUT_KEY] = 1), t;
}
async function deserializeContext(e) {
	let t = e;
	let n = new ContextContainer();
	let r = t[SessionAgentKey.name];
	if (t[STATE_LAYOUT_KEY] !== void 0 && t[STATE_LAYOUT_KEY] !== 1 || t[STATE_LAYOUT_KEY] === void 0 && Object.keys(t).some((e) => t[e] !== void 0 && e.startsWith(`eve:mount.`))) throw new IncompatibleStateLayoutError();
	if (r !== void 0) {
		let e = SessionAgentKey.codec;
		if (e === void 0) throw Error(`Context key "${SessionAgentKey.name}" is missing a codec.`);
		let i = await e.deserialize(r, n);
		i.compiled !== void 0 && t[STATE_LAYOUT_KEY] === void 0 && (t = await adoptLegacyStateLayout(t, i.compiled)), n.set(SessionAgentKey, i);
	}
	for (let [e, r] of Object.entries(t)) {
		if (r === void 0 || e === SessionAgentKey.name || e === STATE_LAYOUT_KEY) continue;
		let t = resolveKey(e);
		if (t === void 0) log$2.warn(`dropping unknown context key during deserialization`, { key: e });
		else try {
			n.set(t, t.codec ? await t.codec.deserialize(r, n) : r);
		} catch (t) {
			throw logError(log$2, `failed to deserialize context key`, t, { key: e }), t;
		}
	}
	return n;
}
async function adoptLegacyStateLayout(e, t) {
	let n = await loadCompiledManifest({ compiledArtifactsSource: t.compiledArtifactsSource });
	let r = [n, ...n.subagents.map((e) => e.agent)].flatMap((e) => e.extensionMounts);
	let i = {};
	for (let [t, n] of Object.entries(e)) {
		if (n === void 0) continue;
		if (t === SessionAgentKey.name || resolveKey(t) !== void 0) {
			i[t] = n;
			continue;
		}
		let e = r.flatMap((e) => {
			let n = `${legacyPackageStateNamespace(e.packageName)}.`;
			if (!t.startsWith(n)) return [];
			let r = mountedStateKeyName(e.mountId, t.slice(n.length));
			return resolveKey(r) === void 0 ? [] : [r];
		});
		if (e.length > 1 || e.length === 0 && t.startsWith(`eve.`)) throw new IncompatibleStateLayoutError(t);
		i[e[0] ?? t] = n;
	}
	return i;
}
function legacyPackageStateNamespace(e) {
	return e.replace(/^@/, ``).replace(/[^a-zA-Z0-9._-]+/g, `-`).replace(/^-+|-+$/g, ``) || `extension`;
}
var IncompatibleStateLayoutError = class extends Error {
	constructor(e) {
		super(`Incompatible context state layout${e === void 0 ? `` : ` for key "${e}"`}. This deployment cannot read the saved state. Continue this session on its original deployment or start a new session.`), this.name = `IncompatibleStateLayoutError`;
	}
};
// node_modules/eve/dist/src/runtime/connections/events/owner.js
async function bindingContext(e, t) {
	let n = new ContextContainer({ localDevRequest: void 0 });
	return n.set(SessionAgentKey, await compiledSessionAgent(t)), n.set(AuthKey, e.auth), e.traceSeed !== void 0 && n.set(SessionTraceSeedKey, e.traceSeed), n.set(SessionIdKey, e.sessionId), serializeContext(n);
}
async function startConnectionEventOwner(e, t, n) {
	let r = await readSubscribeOutcome((await startWorkflowOnCurrentDeployment(connectionEventWorkflowReference, [{
		binding: e,
		serializedContext: await bindingContext(e, t)
	}])).runId, n);
	return r && subscriptionFromOutcome(r);
}
async function startConnectionEventDeliveryRun(e) {
	await startWorkflowOnCurrentDeployment(connectionEventDeliveryWorkflowReference, [e]);
}
function subscriptionFromOutcome(e) {
	if (`error` in e) throw Object.assign(Error(e.error), { status: e.status });
	return e.subscription;
}
async function findConnectionEventOwner(e) {
	let t;
	try {
		t = await (0, runtime_exports.getHookByToken)(connectionEventHookToken(e));
	} catch (e) {
		if (HookNotFoundError.is(e)) return;
		throw e;
	}
	let n = await readPublishedOutcomeNow(t.runId);
	if (n === void 0 || `subscription` in n) return {
		owner: await t.metadata,
		subscription: n?.subscription
	};
}
async function retireConnectionEventOwner(e) {
	return resumeWatch(e, { kind: `retire` });
}
async function resumeWatch(e, t) {
	try {
		return await (0, runtime_exports.resumeHook)(connectionEventHookToken(e), t), !0;
	} catch (e) {
		if (HookNotFoundError.is(e)) return !1;
		throw e;
	}
}
async function readSubscribeOutcome(e, t) {
	let n = await readPublishedOutcome(e, t);
	if (n === void 0 || !(`ownerRunId` in n)) return n;
	let r = await readPublishedOutcome(n.ownerRunId, t);
	if (r !== void 0 && `ownerRunId` in r) throw Error(`Event handler ownership did not resolve.`);
	return r;
}
async function readPublishedOutcomeNow(e) {
	let t = (0, runtime_exports.getRun)(e).getReadable({ namespace: "eve.connection-event.subscription" });
	let n = await t.getTailIndex();
	return await t.cancel().catch(() => {}), n < 0 ? void 0 : readPublishedOutcome(e);
}
async function readPublishedOutcome(e, t) {
	let n = (0, runtime_exports.getRun)(e).getReadable({ namespace: "eve.connection-event.subscription" }).getReader();
	let r = AbortSignal.any([AbortSignal.timeout(9e4), ...t === void 0 ? [] : [t]]);
	let i = new Promise((e) => {
		let abort = () => e({
			value: void 0,
			abandoned: !0
		});
		r.aborted ? abort() : r.addEventListener(`abort`, abort, { once: !0 });
	});
	try {
		let e = await Promise.race([n.read(), i]);
		if (`abandoned` in e) return;
		if (e.value === void 0) throw Error(`Event handler ended before subscribing.`);
		return e.value;
	} finally {
		await n.cancel().catch(() => {});
	}
}
// node_modules/eve/dist/src/execution/workflow-host/host.js
const workflowLineStore = {
	readable: (e, t) => (0, runtime_exports.getRun)(e).getReadable({ startIndex: t }),
	async tail(e) {
		let t = (0, runtime_exports.getRun)(e).getReadable();
		try {
			let [, n] = await Promise.all([workflowLineStore.assertReadable(e), t.getTailIndex()]);
			return n;
		} finally {
			await t.cancel().catch(() => {});
		}
	},
	async assertReadable(e) {
		let t = await (await (0, runtime_exports.getWorld)()).runs.get(e, { resolveData: `none` });
		if (t.expiredAt !== void 0 && t.expiredAt.getTime() <= Date.now()) throw new RunExpiredError(`Session history is no longer available.`, e, t.status, t.expiredAt);
	}
};
const workflowHost = {
	name: `workflow`,
	deliver: async (e, t) => {
		`hook` in e ? await (0, runtime_exports.resumeHook)(e.hook, t) : `session` in e ? await resumeSessionInbox(e.session, t) : await resumeSignInCallback(e.signIn, t);
	},
	runStatus: async (e) => await (0, runtime_exports.getRun)(e).status,
	cancelRun: async (e, t) => {
		await (0, runtime_exports.cancelRun)(await (0, runtime_exports.getWorld)(), e, { cancelReason: t });
	},
	lineStore: workflowLineStore,
	createRuntime: (e) => createWorkflowRuntime(e),
	connectionEvents: {
		start: (e, t, n) => startConnectionEventOwner(e, t, n),
		find: (e) => findConnectionEventOwner(e),
		retire: (e) => retireConnectionEventOwner(e)
	},
	callbackBaseUrl() {
		try {
			let { url: e } = getWorkflowMetadata();
			return typeof e == `string` ? resolveWorkflowCallbackBaseUrl(e) : void 0;
		} catch (e) {
			if (e instanceof Error && e.name === `NotInWorkflowOrStepContextError`) return;
			throw e;
		}
	},
	stepAttempt() {
		try {
			return getStepMetadata().attempt;
		} catch (e) {
			if (e instanceof Error && e.name === `NotInStepContextError`) return;
			throw e;
		}
	}
};
function installWorkflowHost() {
	installDurableHost(workflowHost);
}
// node_modules/eve/dist/src/execution/session-prewarm.js
async function prewarmWorkflowSession(e, t) {
	if (t === void 0 || t.length === 0 || t === `latest`) return { status: `unsupported` };
	let n = await (0, runtime_exports.getWorld)();
	if (n.capabilities?.deploymentAffinity !== !0) return { status: `unsupported` };
	let r;
	try {
		r = await (0, runtime_exports.getHookByToken)(sessionInboxHookToken(sessionCommandHookToken(e)));
	} catch (e) {
		if (HookNotFoundError.is(e)) return { status: `no_active_session` };
		throw e;
	}
	let i = await n.runs.get(r.runId, { resolveData: `none` });
	return i.status !== `running` && i.status !== `pending` ? { status: `no_active_session` } : i.deploymentId === t ? { status: `ready` } : i.attributes["$eve.prewarm"] === `1` ? (await resumeSessionInbox({ sessionId: e }, {
		kind: `session-prewarm`,
		expectedOwnerRunId: r.runId,
		targetDeploymentId: t
	}), { status: `accepted` }) : { status: `unsupported` };
}
// node_modules/eve/dist/src/internal/workflow/start-claim.js
function assertStartClaims(e) {
	if (e.capabilities?.atomicStartHook?.active !== !0) throw Error(`The configured Workflow world does not support atomic start hooks, which eve needs to start a session. Use the local world, Vercel Workflow, or @workflow/world-postgres 5.1.1 or later.`);
}
function pinRunId(e, t) {
	let n = e.createRunId?.(t) ?? monotonicUlid();
	let r = new Proxy(e, { get(e, t) {
		if (t === `createRunId`) return () => n;
		let r = Reflect.get(e, t, e);
		return typeof r == `function` ? r.bind(e) : r;
	} });
	return {
		runId: `wrun_${n}`,
		world: r
	};
}
const ULID_ALPHABET = `0123456789ABCDEFGHJKMNPQRSTVWXYZ`;
let lastTime = -1;
let lastRandom = [];
function monotonicUlid() {
	let e = Date.now();
	if (e > lastTime) lastTime = e, lastRandom = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e & 31);
	else for (let e = 15; e >= 0; e--) {
		if (lastRandom[e] < 31) {
			lastRandom[e] += 1;
			break;
		}
		lastRandom[e] = 0;
	}
	let t = ``;
	for (let e = lastTime, n = 0; n < 10; n++, e = Math.floor(e / 32)) t = ULID_ALPHABET[e % 32] + t;
	return t + lastRandom.map((e) => ULID_ALPHABET[e]).join(``);
}
// node_modules/eve/dist/src/runtime/attributes/normalize.js
function truncateForTag(e, t = 256) {
	if (t <= 0) return ``;
	let n = new TextEncoder();
	if (n.encode(e).length <= t) return e;
	let r = e.length;
	for (; r > 0;) {
		let i = e.charCodeAt(r - 1);
		if (i >= 55296 && i <= 56319) {
			--r;
			continue;
		}
		let a = e.slice(0, r);
		if (n.encode(a).length <= t) return a;
		--r;
	}
	return ``;
}
function normalizeEveAttributes(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = truncateForTag(typeof r == `string` ? r : String(r)));
	return t;
}
// node_modules/eve/dist/src/channel/instrumentation.js
const log$1 = createLogger(`channel.instrumentation`);
function buildChannelInstrumentationProjection(e) {
	let { adapter: t, channelName: n, existingKind: r } = e;
	return {
		channelType: getAdapterKind(t),
		kind: resolveKind({
			adapter: t,
			channelName: n,
			existingKind: r
		}),
		metadata: resolveMetadata(t)
	};
}
function resolveKind(e) {
	let { adapter: t, channelName: n, existingKind: r } = e;
	if (r !== void 0) return r;
	if (n !== void 0 && n.length > 0) return `channel:${n}`;
	let i = getAdapterKind(t);
	return isInstrumentationChannelKind(i) ? i : `channel:${i}`;
}
function resolveMetadata(e) {
	let t = e.instrumentation?.metadata;
	if (t === void 0) return {};
	let { audience: n, ...r } = resolveInstrumentationProjection({
		invoke: () => t(e.state),
		log: log$1,
		source: getAdapterKind(e)
	}) ?? {};
	return r;
}
// node_modules/eve/dist/src/execution/channel-context.js
function setChannelContext(e, t, n = {}) {
	let r = e.get(ChannelInstrumentationKey);
	let i = buildChannelInstrumentationProjection({
		adapter: t,
		channelName: n.channelName,
		existingKind: r?.kind
	});
	e.set(ChannelKey, t), e.set(ChannelInstrumentationKey, {
		...i,
		metadata: t.instrumentation?.metadata === void 0 && r !== void 0 ? r.metadata : i.metadata
	});
}
// node_modules/eve/dist/src/channel/audience.js
function resolveAudience(e, t) {
	return normalize(e, t);
}
function normalize(e, t) {
	let n = e.instrumentation?.audience;
	if (n === void 0) return `unknown`;
	try {
		let e = n(t);
		return isThenable(e) ? (console.warn(`ignoring channel audience classifier because it returned a Promise`), Promise.resolve(e).catch(() => void 0), `unknown`) : normalizeChannelAudience(e);
	} catch {
		return console.warn(`ignoring channel audience classifier after failure`), `unknown`;
	}
}
// node_modules/eve/dist/src/channel/space.js
function resolveSpace(e) {
	let t = e.instrumentation?.space;
	if (t !== void 0) try {
		let n = t({ state: e.state });
		if (isThenable(n)) {
			console.warn(`ignoring channel space projection because it returned a Promise`), Promise.resolve(n).catch(() => void 0);
			return;
		}
		return normalizeConversationSpace(n);
	} catch {
		console.warn(`ignoring channel space projection after failure`);
		return;
	}
}
// node_modules/eve/dist/src/channel/conversation-context.js
function buildConversationContext(e, t) {
	let n = Object.hasOwn(e, `audienceAuth`) ? e.audienceAuth ?? null : e.auth;
	let r = buildChannelInstrumentationProjection({
		adapter: e.adapter,
		channelName: e.channelName
	});
	let i = {
		kind: normalizeInstrumentationChannelKind(r.kind),
		name: e.channelName
	};
	let a = e.inheritedConversation;
	let o = readForwardedTraceAssertion(e.parentTraceContext?.forwardedTracePolicy);
	let s = o?.originAudience ?? a?.audience ?? resolveAudience(e.adapter, {
		state: e.adapter.state,
		caller: toAudienceCaller(n),
		channel: i,
		environment: t
	});
	let c = a === void 0 ? resolveSpace(e.adapter) : a.space;
	return {
		...resolveConversationContext(void 0, {
			channelKind: r.kind,
			environment: t,
			forwardedTracePolicy: o,
			principalType: n?.principalType
		}),
		audience: s,
		channel: i,
		...c !== void 0 && { space: c }
	};
}
function toAudienceCaller(e) {
	return e == null || e.principalType === `anonymous` ? { type: `anonymous` } : {
		type: `principal`,
		principal: {
			attributes: e.attributes,
			authenticator: e.authenticator,
			kind: e.principalType
		}
	};
}
// node_modules/eve/dist/src/execution/runtime-context.js
function buildRunContext(e) {
	let { agent: t, run: n } = e;
	let r = new ContextContainer();
	let i = n.auth;
	let a = readConversationId(n.conversationId);
	if (a !== void 0 && r.set(ConversationIdKey, a), r.set(SessionAgentKey, t), setChannelContext(r, n.adapter, { channelName: n.channelName }), r.set(ConversationContextKey, buildConversationContext(n, resolveInstrumentationEnvironment())), n.parent === void 0 || n.traceRoot?.kind === `own`) {
		let e = deriveSessionTitle(n.title ?? n.input.message);
		e !== void 0 && r.set(SessionTitleKey, e);
	}
	if (n.channelMetadata !== void 0) {
		let e = r.get(ChannelInstrumentationKey);
		r.set(ChannelInstrumentationKey, {
			channelType: e?.channelType ?? n.channelMetadata.channelType,
			kind: e?.kind ?? n.channelMetadata.kind,
			metadata: n.channelMetadata.metadata
		});
	}
	n.continuationToken !== void 0 && (r.set(ContinuationTokenKey, n.continuationToken), r.set(ContinuationHookTokensKey, [n.continuationToken]));
	let o = n.schedule?.occurrenceId ?? contextStorage.getStore()?.get(OccurrenceIdKey);
	o !== void 0 && r.set(OccurrenceIdKey, o), r.set(AuthKey, i), n.steeredBy !== void 0 && n.steeredBy.length > 0 && r.set(SteeredByKey, n.steeredBy), n.toolStubs !== void 0 && r.set(ToolStubsKey, n.toolStubs), (n.initiatorAuth !== void 0 || n.input.message !== void 0) && r.set(InitiatorAuthKey, n.initiatorAuth ?? i), e.dynamicSubagentAgentConfig !== void 0 && r.set(DynamicSubagentAgentConfigKey, e.dynamicSubagentAgentConfig), e.agentSessionRuntimeOverrides !== void 0 && r.set(AgentSessionRuntimeOverridesKey, e.agentSessionRuntimeOverrides), n.capabilities !== void 0 && r.set(CapabilitiesKey, n.capabilities), n.requestId !== void 0 && r.set(ChannelRequestIdKey, n.requestId);
	let s = n.schedule?.instance ?? contextStorage.getStore()?.get(ScheduleInstanceKey);
	s !== void 0 && r.set(ScheduleInstanceKey, s);
	let c = n.schedule?.definition ?? contextStorage.getStore()?.get(ScheduleIdKey);
	return c !== void 0 && r.set(ScheduleIdKey, c), n.delivery !== void 0 && r.set(ChannelDeliveryKey, n.delivery), n.callback !== void 0 && r.set(SessionCallbackKey, n.callback), n.callback !== void 0 && n.earlierCallerProtocol !== void 0 && r.set(EarlierRemoteCallerKey, n.earlierCallerProtocol), n.parent !== void 0 && r.set(ParentSessionKey, n.parent), n.traceRoot !== void 0 && r.set(TraceRootKey, n.traceRoot), n.parentTraceContext !== void 0 && r.set(ParentTraceContextKey, n.parentTraceContext), r;
}
// node_modules/eve/dist/src/execution/initial-entry.js
async function prepareInitialEntry(e, t, n) {
	validateDeliveryIdempotencyKey(t.idempotencyKey), t.input.message !== void 0 && t.delivery === void 0 && (t = {
		...t,
		delivery: createChannelDeliveryMetadata({
			channelKind: t.adapter.kind,
			channelName: t.channelName ?? t.adapter.kind,
			requestId: t.requestId
		})
	});
	let r = t.continuationConflictCommand;
	r !== void 0 && r.delivery === void 0 && (t = {
		...t,
		continuationConflictCommand: {
			...r,
			delivery: t.delivery
		}
	});
	let i = await loadCompiledSessionAgent({
		compiledArtifactsSource: e.compiledArtifactsSource,
		nodeId: e.nodeId
	});
	let a = i.compiled?.graph;
	a !== void 0 && t.toolStubs !== void 0 && t.toolStubs.rootSessionId === void 0 && validateToolStubTargets(t.toolStubs.rules, a);
	let o = buildRunContext({
		agent: i,
		agentSessionRuntimeOverrides: e.agentSessionRuntimeOverrides,
		dynamicSubagentAgentConfig: e.dynamicSubagentAgentConfig,
		run: t
	});
	n !== void 0 && o.set(SessionPredecessorKey, n);
	let s = initializeSessionInstrumentation({
		agentName: i.id,
		ctx: o
	});
	let c = agentLimits(i, o)?.sessionTimeoutMs;
	let l = i.settings.retention ?? (s.action === `record` && s.recordInputs && s.recordOutputs ? void 0 : 0);
	let u = serializeContext(o);
	let d = {
		idempotencyKey: t.idempotencyKey,
		kind: `initial`,
		input: t.input,
		serializedContext: u
	};
	return t.continuationConflictCommand !== void 0 && (d.continuationConflictCommand = t.continuationConflictCommand), c !== void 0 && (d.sessionTimeoutMs = c), l !== void 0 && (d.retention = l), {
		agent: i,
		entry: d,
		input: t,
		serializedContext: u
	};
}
// node_modules/eve/dist/src/execution/session-commands.js
function identifyCommand(e) {
	if (e.kind !== `send` || e.delivery !== void 0) return e;
	let t = e.caller === void 0 ? e.schedule === void 0 ? `http` : `schedule` : `subagent`;
	return {
		...e,
		delivery: createChannelDeliveryMetadata({
			channelKind: t,
			channelName: t,
			requestId: e.requestId
		})
	};
}
function activeCommandResult(e, t) {
	return e.kind === `reset` ? {
		previousSessionId: t,
		status: `reset`
	} : e.kind === `send` && e.delivery !== void 0 ? {
		sessionId: t,
		status: `accepted`,
		deliveryId: e.delivery.deliveryId
	} : {
		sessionId: t,
		status: `accepted`
	};
}
function inactiveCommandResult(e) {
	return e.kind === `send` ? { status: `session_not_active` } : e.kind === `cancel` ? { status: `no_active_turn` } : { status: `no_active_session` };
}
// node_modules/eve/dist/src/internal/invocation/metadata.js
function invocationOwnerKey(e) {
	let t = e === null ? [`anonymous`] : principalIdentity(e);
	return createHash(`sha256`).update(JSON.stringify(t), `utf8`).digest(`hex`);
}
function buildInvocationAttributes(e) {
	return {
		["$eve.invocation_owner"]: e.ownerKey,
		["$eve.invocation_token"]: e.continuationToken
	};
}
// node_modules/eve/dist/src/execution/workflow-runtime.js
const EVE_PACKAGE_INFO = resolveInstalledPackageInfo();
const log = createLogger(`execution.workflow-runtime`);
function sessionHandle(e, t, n) {
	let r;
	return {
		get events() {
			return r ??= readSessionEventStream(e), r;
		},
		sessionId: e,
		...t !== void 0 && { deliveryId: t },
		...n !== void 0 && { claimedContinuation: n }
	};
}
function createWorkflowRuntime(e) {
	installWorkflowHost();
	let startSession = async (t, n, r = 0) => {
		let i = await prepareInitialEntry(e, t, n);
		t = i.input;
		let { agent: a, serializedContext: o } = i;
		let s = i.entry.retention;
		let c = readParentLineage(o);
		let l = {
			...i.entry,
			ownerDeploymentId: await resolveCurrentWorkflowDeploymentId()
		};
		let u = {
			...c.sessionId === void 0 ? buildSessionAttributes({ serializedContext: o }) : buildSubagentRootAttributes({
				identity: { nodeId: runtimeNodeId(a) },
				parentCallId: c.callId,
				parentSessionId: c.sessionId,
				parentTurnId: c.turnId,
				rootSessionId: c.rootSessionId ?? c.sessionId,
				serializedContext: o
			}),
			["$eve.prewarm"]: `1`,
			...t.externalInvocation === void 0 ? {} : buildInvocationAttributes(t.externalInvocation)
		};
		let { continuationToken: d } = t;
		assertStartClaims(await (0, runtime_exports.getWorld)());
		let f = d !== void 0 && d !== ``;
		let p = {
			...l,
			startClaim: f ? `continuation` : `inbox`
		};
		let m;
		try {
			let e = {
				allowReservedAttributes: !0,
				attributes: normalizeEveAttributes(u)
			};
			s !== void 0 && (e.experimental_retention = s), m = await startWorkflowOnDeployment(workflowEntryReference, [p], p.ownerDeploymentId, e, (e) => ({
				token: sessionInboxHookToken(f ? d : sessionCommandHookToken(e)),
				metadata: { ["sessionId"]: e }
			}));
		} catch (e) {
			if (f && HookConflictError.is(e)) return await joinContinuationOwner(t, n, r);
			throw log.error(`failed to start workflow run`, { error: formatCapabilityError(e, [t.continuationToken]) }), e;
		}
		return sessionHandle(m.runId, t.delivery?.deliveryId, f ? !0 : void 0);
	};
	let joinContinuationOwner = async (e, t, n) => {
		let r = e.continuationToken;
		let i = e.continuationConflictCommand;
		let a;
		if (i === void 0) a = (await resolveContinuation(r))?.sessionId;
		else {
			let t = await dispatchContinuation({
				command: i,
				continuationToken: r,
				successor: e
			});
			t.status === `accepted` && (a = t.sessionId);
		}
		if (a !== void 0) return sessionHandle(a, e.delivery?.deliveryId, !1);
		if (n + 1 >= 3) throw new SessionNotActiveError({ retryable: !0 });
		return await startSession(e, t, n + 1);
	};
	let dispatchContinuation = async (e) => {
		let { continuationToken: t, successor: n } = e;
		let r = identifyCommand(e.command);
		try {
			return await dispatchWorkflowCommand(t, r);
		} catch (e) {
			if (!(e instanceof StrandedSessionOwnerError)) throw e;
			if (r.kind !== `send` || n === void 0) return await settleStrandedCommand(t, r, e);
			if ((r.payload.answers?.length ?? 0) > 0) throw sessionStrandedError(e, `Its pending requests can no longer be answered; send a new message to start a fresh session.`);
			let i = await endStrandedSession(e, t, `message`);
			return {
				sessionId: (await startSession({
					...n,
					delivery: r.delivery
				}, { sessionId: i })).sessionId,
				deliveryId: r.delivery?.deliveryId,
				status: `accepted`
			};
		}
	};
	return {
		async createSession(e) {
			return await startSession(e);
		},
		dispatchContinuation,
		async dispatchSession(e) {
			return await dispatchWorkflowSessionCommand(e);
		},
		async getEventStream(e, t) {
			return t?.follow === !1 ? readSessionEventHistory(e, t.startIndex, t.signal) : (await assertFollowableSession(e), readSessionEventStream(e, t?.startIndex, t?.signal));
		},
		async getLineStream(e, t) {
			if (t?.follow === !1) return readSessionRecordHistory(e, t.startIndex);
			let n = readSessionRecords(e, t?.startIndex);
			try {
				await assertFollowableSession(e);
			} catch (e) {
				throw await n.cancel().catch(() => {}), e;
			}
			return n;
		},
		async getStreamTailIndex(e) {
			return await readSessionStreamTailIndex(e);
		},
		async readChildBinding(e, t) {
			return await readRemoteChildBinding(e, t);
		},
		async hasRunnableOwner(e) {
			let t = sessionInboxHookToken(sessionCommandHookToken(e));
			let n = await findSessionHookHolder(t);
			if (n === void 0) return !1;
			try {
				return await assertRunnableSessionOwner(n), !0;
			} catch (e) {
				if (e instanceof StrandedSessionOwnerError) return !1;
				throw e;
			}
		},
		resolveContinuation
	};
}
async function dispatchWorkflowCommand(e, t) {
	if (t.kind === `prewarm`) return typeof e == `string` ? { status: `unsupported` } : await prewarmWorkflowSession(e.sessionId, t.targetDeploymentId);
	let n;
	let r;
	let i;
	try {
		let a = await resumeSessionInbox(e, t);
		r = a.inbox, i = a.startAddress, n = {
			runId: a.ownerRunId,
			sessionId: await a.sessionId
		};
	} catch (n) {
		if (n instanceof StrandedSessionOwnerError) throw n;
		if (isInactiveCommandTarget(n)) return inactiveCommandResult(t);
		let r = logicalSessionToken(e);
		throw log.error(`failed to dispatch session command`, {
			command: t.kind,
			error: formatCapabilityError(n, [r, sessionInboxHookToken(r)])
		}), n;
	}
	t.kind === `reset` && await waitForSessionHooksRelease([
		sessionCommandHookToken(n.sessionId),
		logicalSessionToken(e),
		...i === void 0 ? [] : [i]
	], {
		ownerRunId: n.runId,
		sessionId: n.sessionId
	});
	let a = activeCommandResult(t, n.sessionId);
	return a.status === `accepted` ? {
		...a,
		inbox: r
	} : a;
}
async function settleStrandedCommand(e, t, n) {
	switch (t.kind) {
		case `reset`: return {
			previousSessionId: await endStrandedSession(n, e, `reset`, t),
			status: `reset`
		};
		case `send`:
		case `clear`: throw sessionStrandedError(n);
		default: return inactiveCommandResult(t);
	}
}
async function assertFollowableSession(e) {
	try {
		await Promise.all([assertRunnableSessionInbox(sessionInboxHookToken(sessionCommandHookToken(e))), assertSessionHistoryReadable(e)]);
	} catch (e) {
		throw e instanceof StrandedSessionOwnerError ? sessionStrandedError(e) : e;
	}
}
function sessionStrandedError(e, t) {
	let n = e.eveVersion === void 0 ? {} : { eveVersion: e.eveVersion };
	return new SessionStrandedError(n, describeStrandedSession(n, t));
}
async function dispatchWorkflowSessionCommand(e) {
	let t = {
		sessionId: e.sessionId,
		inbox: e.inbox
	};
	let n = identifyCommand(e.command);
	try {
		return await dispatchWorkflowCommand(t, n);
	} catch (e) {
		if (!(e instanceof StrandedSessionOwnerError)) throw e;
		return await settleStrandedCommand(t, n, e);
	}
}
function isInactiveCommandTarget(e) {
	if (e instanceof AcceptedSessionIdentityError) return !1;
	if (HookNotFoundError.is(e)) return !0;
	for (let t of walkCauseChain(e)) if (WorkflowRunNotFoundError.is(t) || RunExpiredError.is(t) || EntityConflictError.is(t)) return !0;
	return !1;
}
async function resolveContinuation(e, t) {
	let n;
	try {
		n = await resolveSessionInbox(e);
	} catch (n) {
		if (HookNotFoundError.is(n)) return;
		let r = n;
		if (n instanceof StrandedSessionOwnerError) {
			if (t?.runnable === !0) throw sessionStrandedError(n);
			try {
				return { sessionId: await resolveStrandedSessionId(n) };
			} catch (e) {
				r = e;
			}
		}
		throw log.error(`failed to resolve session by continuation token`, { error: formatCapabilityError(r, [e]) }), r;
	}
	if (t?.runnable !== !0) return n;
	try {
		await assertRunnableSessionInbox(sessionInboxHookToken(sessionCommandHookToken(n.sessionId)));
	} catch (e) {
		throw e instanceof StrandedSessionOwnerError ? sessionStrandedError(e) : e;
	}
	return n;
}
async function hasRunEnded(e) {
	return await durableRunEnded(workflowHost, e);
}
async function startWorkflowOnCurrentDeployment(e, t, n) {
	return await startWorkflowOnDeployment(e, t, await resolveCurrentWorkflowDeploymentId(), n);
}
async function startWorkflowOnDeployment(e, t, n, r, i) {
	return await withWorkflowStartContext(async () => {
		if (n.length === 0 || n === `latest`) throw Error(`Workflow starts require an exact deployment id.`);
		let a = {
			...r,
			allowReservedAttributes: !0,
			attributes: {
				...r?.attributes,
				["$eve.version"]: EVE_PACKAGE_INFO.version
			},
			deploymentId: n
		};
		if (i === void 0) return await (0, runtime_exports.start)(e, t, a);
		let o = pinRunId(await (0, runtime_exports.getWorld)(), a);
		let s = await (0, runtime_exports.start)(e, t, {
			...a,
			experimental_hook: i(o.runId),
			world: o.world
		});
		if (s.runId !== o.runId) throw await s.cancel().catch(() => {}), Error(`Workflow started run "${s.runId}" instead of the pinned "${o.runId}", so its claimed hook names the wrong run.`);
		return s;
	});
}
async function resolveCurrentWorkflowDeploymentId() {
	let e = process.env.VERCEL_DEPLOYMENT_ID?.trim() || await (await (0, runtime_exports.getWorld)()).getDeploymentId();
	if (e.length === 0 || e === `latest`) throw Error(`Workflow runtime could not resolve an exact deployment id.`);
	return e;
}
async function withWorkflowStartContext(e) {
	let t = context.active();
	let n = isAgentTraceContext(t) ? trace.deleteSpan(t) : t;
	return await context.with(n, e);
}
export { IncompatibleStateLayoutError, admitControl, admitDeliveries, buildConversationContext, createLineCommitter, createWorkflowRuntime, deserializeContext, dispatchWorkflowSessionCommand, endSession, endStrandedSession, failInterruptedControl, hasRunEnded, installWorkflowHost, invocationOwnerKey, normalizeEveAttributes, planAdmission, principalOf, readSessionStreamTailIndex, recordRemoteChildBinding, resolveContinuation, retireConnectionEventOwner, serializeContext, setChannelContext, settleControl, settleDelivery, startConnectionEventDeliveryRun, startWorkflowOnCurrentDeployment, startWorkflowOnDeployment, streamSessionLines, userPartsOf, workflowHost };

//# sourceMappingURL=eve81.mjs.map