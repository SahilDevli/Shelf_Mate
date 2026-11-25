import { aiSdkCapture, createGatewayTraceContextHeaders, ensureAiSdkWarningLogger, ensureOtelIntegration, getRegisteredTelemetryIntegrations, isConnectionAuthorizationFailedError, resolveInstrumentationTraceDecision, resolveTraceRootSessionId } from "./eve5.mjs";
import { AuthKey, ChannelDeliveryKey, ChannelInstrumentationKey, ContextKey, ConversationIdKey, InitiatorAuthKey, OtelTraceEnabledKey, ParentSessionKey, ParentTraceContextKey, SessionTraceSeedKey, contextStorage } from "./eve7.mjs";
import { createLogger, formatError, recordErrorOnSpan } from "./eve4.mjs";
import { ConversationContextKey, actionIdempotencyKey, applyLiveDeliveryAudienceCeiling, askedCall, attemptIdempotencyKey, callRun, channelDeliveryIdempotencyKey, copyView, decidingAnswer, defaultContentCapture, foldReceivedEvent, formatTraceContentCeiling, getInstrumentationRuntime, inputIdempotencyKey, instrumentationPrincipal, instrumentationScope, intersectInstrumentationDecisions, isSampledTrace, isTerminalType, modelCallIdempotencyKey, normalizeChannelAudience, normalizeInstrumentationChannelKind, readForwardedTraceAssertion, readInstrumentationDecision, readSessionTraceDecision, resolveConversationContext, resolveTracePolicy, resolveTracePolicyDecision, responderOf, runTurn, sessionIdempotencyKey, shouldCaptureInstrumentationContent, structuralProviderMetadata, toolCallIdempotencyKey, traceContentCeilingToDecision, turnIdempotencyKey, turnScope } from "./eve8.mjs";
import { readConversationId } from "./eve9.mjs";
import { readInstrumentationSessionContext } from "./eve12.mjs";
import { isPlainRecord, isThenable } from "./eve3.mjs";
import { parseJsonObject, parseJsonValue } from "./eve10.mjs";
import { cascade, currentView, enteredView, eventsOf } from "./eve29.mjs";
import { createMemoryInstrumentation, isTurnCancellation } from "./eve30.mjs";
import { resolveInstrumentationEnvironment } from "./eve11.mjs";
import { context, trace } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/api/index.js";
import { AgentSpanIdGenerator } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/index.js";
import { truncateTelemetryText, withCapture } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/otel.js";
import { modelContent, modelUsage } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/ai-sdk.js";
// node_modules/eve/dist/src/internal/instrumentation.js
function resolveInstrumentationProjection(e) {
	let { invoke: t, log: n, source: r } = e;
	let i;
	try {
		i = t();
	} catch (e) {
		n.warn(`ignoring instrumentation projection after projector failure`, {
			error: formatError(e),
			source: r
		});
		return;
	}
	if (isThenable(i)) n.warn(`ignoring instrumentation projection because it returned a Promise`, { source: r }), Promise.resolve(i).catch((e) => {
		n.warn(`ignored instrumentation projection Promise rejected`, {
			error: formatError(e),
			source: r
		});
	});
	else if (i !== void 0) {
		if (!isPlainRecord(i)) n.warn(`ignoring instrumentation projection because it is not a record`, { source: r });
		else try {
			return parseJsonObject(i);
		} catch (e) {
			n.warn(`ignoring instrumentation projection because it is outside the JSON contract`, {
				error: formatError(e),
				source: r
			});
			return;
		}
	}
}
// node_modules/eve/dist/src/instrumentation/runtime-context.js
const log$2 = createLogger(`harness.instrumentation-runtime-context`);
function snapshotInstrumentationRuntimeContext(e) {
	let t = e?.get(AuthKey) ?? null;
	return {
		channel: snapshotForInstrumentation(e?.get(ChannelInstrumentationKey), `channel.instrumentation`),
		currentAuth: snapshotForInstrumentation(t, `session.auth.current`) ?? null,
		initiatorAuth: snapshotForInstrumentation(e?.get(InitiatorAuthKey) ?? t, `session.auth.initiator`) ?? null,
		parent: snapshotForInstrumentation(e?.get(ParentSessionKey), `session.parent`)
	};
}
function buildTelemetryRuntimeContext(e) {
	if (e.providerResolvers !== void 0 && e.providerResolvers.length > 0) {
		if (e.emissionState.runId === void 0) log$2.warn(`cannot resolve instrumentation context without a model run`);
		else return {
			...resolveProviderRuntimeContext(e),
			"eve.environment": e.environment
		};
	}
}
function buildInstrumentationModelStartedInput(e) {
	let t = e.context ?? snapshotInstrumentationRuntimeContext(contextStorage.getStore());
	let n = t.channel;
	return {
		channel: {
			kind: normalizeInstrumentationChannelKind(n?.kind),
			metadata: snapshotForInstrumentation(n?.metadata, `channel.metadata`) ?? {}
		},
		modelInput: e.capturesContent ? snapshotForInstrumentation(e.modelInput, `modelInput`) ?? {
			instructions: void 0,
			messages: []
		} : {
			instructions: void 0,
			messages: []
		},
		session: {
			auth: projectSessionAuth(t),
			id: e.session.sessionId,
			parent: t.parent
		},
		run: {
			id: e.emissionState.runId,
			attempt: e.attempt
		},
		turn: e.emissionState.turnId === void 0 ? void 0 : {
			id: e.emissionState.turnId,
			sequence: e.emissionState.sequence
		}
	};
}
function filterAuthoredRuntimeContext(e, t) {
	let n = {};
	for (let [r, i] of Object.entries(e)) r.startsWith(`eve.`) ? log$2.warn(`ignoring reserved instrumentation runtime context key`, {
		key: r,
		source: t
	}) : n[r] = i;
	return Object.keys(n).length > 0 ? n : void 0;
}
function resolveProviderRuntimeContext(e) {
	let t = e.providerResolvers;
	if (t === void 0 || t.length === 0) return;
	let n = {};
	let r = !1;
	for (let i of t) {
		let t = `provider.runtimeContext`;
		let a = resolveInstrumentationProjection({
			invoke: () => {
				let t = buildInstrumentationModelStartedInput(e);
				return i(t);
			},
			log: log$2,
			source: t
		});
		if (a === void 0) continue;
		let o = filterAuthoredRuntimeContext(a, t);
		o !== void 0 && (Object.assign(n, o), r = !0);
	}
	return r ? n : void 0;
}
function projectSessionAuth(e) {
	return {
		current: e.currentAuth,
		initiator: e.initiatorAuth
	};
}
function snapshotForInstrumentation(e, t) {
	if (e !== void 0) try {
		return parseJsonValue(e);
	} catch (e) {
		log$2.warn(`dropping non-serializable instrumentation snapshot`, {
			error: formatError(e),
			source: t
		});
		return;
	}
}
// node_modules/eve/dist/src/instrumentation/ai-sdk-hook-bridge.js
function createAiSdkHookBridge(e, t, n = directRunInContext, r, i) {
	let a = {
		capturesInputs: t.capturesInputs ?? t.capturesContent,
		capturesOutputs: t.capturesOutputs ?? t.capturesContent,
		modelCallIndexes: /* @__PURE__ */ new Map(),
		modelCallStartEvents: /* @__PURE__ */ new Map(),
		modelKeys: /* @__PURE__ */ new Map(),
		runtimeContext: r !== void 0 && Object.keys(r).length > 0 ? Object.freeze({ ...r }) : void 0,
		scope: e,
		toolKeys: /* @__PURE__ */ new Map(),
		toolCalls: /* @__PURE__ */ new Map(),
		isFrameworkTool: i
	};
	let nextModelCallKey = (e) => {
		let t = a.modelCallIndexes.get(e) ?? 0;
		return a.modelCallIndexes.set(e, t + 1), modelCallIdempotencyKey(a.scope, e, t);
	};
	return {
		onStart(e) {
			a.operation = Object.freeze({
				modelId: e.modelId,
				operationId: e.operationId,
				provider: e.provider
			});
		},
		async onStepStart(e) {
			a.stepNumber = e.stepNumber;
			let n = a.started ? void 0 : toModelStarted(a);
			n !== void 0 && (a.started = !0, await t.publish(n));
		},
		async onLanguageModelCallStart(e) {
			let n = a.stepNumber ?? 0;
			let r = nextModelCallKey(n);
			a.modelKeys.set(e.callId, r);
			let i = toModelCallStarted(a, r, e);
			a.modelCallStartEvents.set(e.callId, {
				event: i,
				stepNumber: n
			}), await t.publish(i);
		},
		async executeLanguageModelCall({ callId: r, execute: i }) {
			let o = a.modelKeys.get(r);
			if (o === void 0) {
				let e = a.modelCallStartEvents.get(r);
				if (e === void 0) return i();
				o = nextModelCallKey(e.stepNumber), a.modelKeys.set(r, o), await t.publish(Object.freeze({
					...e.event,
					idempotencyKey: o
				}));
			}
			try {
				return await n({
					idempotencyKey: o,
					scope: e,
					type: `model.call`
				}, i);
			} catch (n) {
				throw a.modelKeys.get(r) === o && a.modelKeys.delete(r), await t.publish(Object.freeze({
					outcome: `failed`,
					error: n,
					idempotencyKey: o,
					scope: e,
					type: `model.call.settled`
				})), n;
			}
		},
		async onLanguageModelCallEnd(e) {
			let n = a.modelKeys.get(e.callId);
			if (n === void 0) return;
			a.modelKeys.delete(e.callId), a.modelCallStartEvents.delete(e.callId);
			let r = toModelCallCompleted(a, n, e);
			await t.publish(r);
		},
		onToolExecutionStart(e) {
			let t = toolCallIdempotencyKey(a.scope, e.toolCall.toolCallId, a.stepNumber ?? 0);
			a.toolKeys.set(e.toolCall.toolCallId, t);
			let n = toToolCallStarted(a, t, e);
			a.toolCalls.set(e.toolCall.toolCallId, n);
		},
		executeTool({ toolCallId: e, execute: t }) {
			let r = a.toolCalls.get(e);
			return r === void 0 ? t() : n({
				...r,
				type: `tool.call`
			}, t);
		},
		onToolExecutionEnd(e) {
			let t = e.toolCall.toolCallId;
			a.toolKeys.get(t) !== void 0 && (a.toolKeys.delete(t), a.toolCalls.delete(t));
		},
		async onAbort(e) {
			await failOpenOperations(e.reason);
		},
		async onError(e) {
			await failOpenOperations(e.error);
		}
	};
	async function failOpenOperations(n) {
		let r = [];
		for (let i of a.modelKeys.values()) r.push(t.publish(Object.freeze({
			outcome: `failed`,
			error: n,
			idempotencyKey: i,
			scope: e,
			type: `model.call.settled`
		})));
		a.modelKeys.clear(), a.modelCallStartEvents.clear(), a.toolKeys.clear(), a.toolCalls.clear(), await Promise.all(r);
	}
}
const directRunInContext = (e, t) => t();
function toModelStarted(e) {
	if (e.operation !== void 0 && e.stepNumber !== void 0) return Object.freeze({
		idempotencyKey: attemptIdempotencyKey(e.scope),
		operation: e.operation,
		runtimeContext: e.runtimeContext,
		scope: e.scope,
		type: `model.started`
	});
}
function toModelCallStarted(e, t, n) {
	return Object.freeze({
		idempotencyKey: t,
		input: e.capturesInputs ? Object.freeze({
			instructions: n.instructions,
			messages: Object.freeze([...n.messages]),
			tools: n.tools === void 0 ? void 0 : Object.freeze([...n.tools])
		}) : void 0,
		model: Object.freeze({
			modelId: n.modelId,
			provider: n.provider
		}),
		runtimeContext: e.runtimeContext,
		scope: e.scope,
		type: `model.call.started`
	});
}
function toModelCallCompleted(e, t, n) {
	return Object.freeze({
		outcome: `completed`,
		content: e.capturesOutputs ? Object.freeze(modelContent(n.content).map((e) => Object.freeze(e))) : void 0,
		providerMetadata: n.providerMetadata === void 0 ? void 0 : e.capturesOutputs ? n.providerMetadata : structuralProviderMetadata(n.providerMetadata),
		finishReason: n.finishReason,
		idempotencyKey: t,
		responseModelId: n.modelId,
		responseId: n.responseId,
		scope: e.scope,
		type: `model.call.settled`,
		usage: Object.freeze(modelUsage(n.usage))
	});
}
function toToolCallStarted(e, t, n) {
	return Object.freeze({
		capability: {
			kind: `tool`,
			name: n.toolCall.toolName
		},
		callId: n.toolCall.toolCallId,
		frameworkTool: e.isFrameworkTool?.(n.toolCall.toolName) === !0,
		idempotencyKey: t,
		input: e.capturesInputs ? n.toolCall.input : void 0,
		scope: e.scope,
		toolName: n.toolCall.toolName,
		startedAtMs: Date.now(),
		type: `call.requested`
	});
}
// node_modules/eve/dist/src/harness/runtime-action-settlement-state.js
const RuntimeActionSettlementTimesKey = new ContextKey(`eve.harness.runtimeActionSettlementTimes`);
// node_modules/eve/dist/src/instrumentation/channel-delivery.js
function deliveryEvent(e, t, n) {
	if (e.type !== `delivery.consumed` && e.type !== `delivery.settled`) return;
	let { deliveryId: r, turnId: i } = e.data;
	let a = channelDeliveryIdempotencyKey(n.sessionId, r);
	if (e.type === `delivery.settled`) return {
		...e.data,
		idempotencyKey: a,
		sessionId: n.sessionId,
		type: e.type
	};
	let o = n.deliveryInput;
	let s = o?.deliveryMetadata?.find((e) => e.deliveryId === r);
	let c = t?.get(ChannelDeliveryKey);
	let l = s ?? (c?.deliveryId === r ? c : void 0);
	let u = s === void 0 ? void 0 : o?.payloads[s.payloadIndex];
	return {
		agentName: n.agentName,
		deliveryId: r,
		delivery: l === void 0 ? void 0 : {
			channelAudience: n.channelAudience,
			channelKind: l.channelKind,
			channelName: l.channelName,
			deliveryId: r,
			requestId: l.requestId,
			requestTraceContext: l.requestTraceContext
		},
		idempotencyKey: a,
		input: n.hooks?.capturesInputs || n.hooks?.capturesContent ? u === void 0 ? { message: e.data.parts } : projectDeliveryInput(u) : void 0,
		rootSessionId: n.rootSessionId ?? n.sessionId,
		sessionId: n.sessionId,
		traceSeed: t?.get(SessionTraceSeedKey),
		traceSessionId: n.traceSessionId,
		turnId: i,
		type: `delivery.consumed`
	};
}
function projectDeliveryInput(e) {
	return {
		context: e.context,
		message: e.message,
		outputSchema: e.outputSchema,
		answers: e.answers?.map(({ optionId: e, text: t }) => ({
			optionId: e,
			text: t
		}))
	};
}
// node_modules/eve/dist/src/tracing/eve/connection-authorization.js
function authorizationReasonCode(e) {
	return e !== void 0 && /^[A-Za-z][\w.-]{0,63}$/.test(e) ? e : void 0;
}
function connectionAuthorizationAttributes(e) {
	if (!isConnectionAuthorizationFailedError(e)) return;
	let { connectionName: t, reason: n } = e;
	return {
		"agent.connection.name": typeof t == `string` ? truncateTelemetryText(t, 256) : void 0,
		"agent.connection.authorization.reason": authorizationReasonCode(typeof n == `string` ? n : void 0)
	};
}
// node_modules/eve/dist/src/instrumentation/native-events.js
function attemptScopeOf(e, { runId: t, attempt: n, stepIndex: r, turnId: i }) {
	return instrumentationScope({
		runId: t,
		attempt: n,
		channelAudience: e.channelAudience,
		functionId: e.functionId,
		rootSessionId: e.rootSessionId,
		sessionId: e.sessionId,
		traceSessionId: e.traceSessionId,
		turnId: i
	}, r);
}
function createInstrumentationHandleEvent(e) {
	if (e.hooks === void 0) return e.handleEvent;
	if (e.handleEvent === void 0) return;
	let { handleEvent: t, hooks: n } = e;
	return async (r, i) => {
		let a = Date.now();
		let o = contextStorage.getStore();
		let s = o === void 0 ? void 0 : enteredView(o);
		let c;
		try {
			await t(r, i);
		} catch (e) {
			if (!isTurnCancellation(e) || s === void 0 || o === void 0 || currentView(o).position <= s.position) throw e;
			c = { error: e };
		}
		let l = eventsOf(r);
		let u = s !== void 0 && l.some((e) => isTerminalType(e.type)) ? cascade(s, l) : l;
		let d = s === void 0 ? void 0 : copyView(s);
		if (d !== void 0) for (let e of u) foldReceivedEvent(d, {
			...e,
			meta: { endOfLine: !1 }
		});
		let f = n.capturesInputs ?? n.capturesContent ?? !1;
		let p = n.capturesOutputs ?? n.capturesContent ?? !1;
		let m = {
			attemptScope: (t) => attemptScopeOf(e, t),
			turnScope: (t) => turnScope({
				channelAudience: e.channelAudience,
				functionId: e.functionId,
				rootSessionId: e.rootSessionId,
				sessionId: e.sessionId,
				traceSessionId: e.traceSessionId,
				turnId: t
			}),
			capturesInputs: f,
			capturesOutputs: p,
			capturesPrincipalIds: f && p && shouldCaptureInstrumentationContent({
				audience: normalizeChannelAudience(e.channelAudience),
				environment: e.environment ?? `production`
			}),
			settledAtMs: o?.get(RuntimeActionSettlementTimesKey),
			startedAtMs: a,
			view: d ?? (o === void 0 ? void 0 : currentView(o))
		};
		for (let t of u) {
			if (e.relayed === !0 && !t.type.startsWith(`interaction.`)) continue;
			let r = deliveryEvent(t, o, e);
			r !== void 0 && await n.publish(Object.freeze(r));
			for (let r of instrumentationEventsOf(t, m, e)) await n.publish(Object.freeze(r));
		}
		if (c !== void 0) throw c.error;
	};
}
function instrumentationEventsOf(e, t, n) {
	let { sessionId: r } = n;
	let i = sessionIdempotencyKey(r);
	switch (e.type) {
		case `session.started`: return [{
			agentName: n.agentName,
			channelAudience: n.channelAudience,
			channelKind: n.channelKind,
			idempotencyKey: i,
			parentLineage: n.parentLineage,
			parentTraceContext: n.parentTraceContext,
			rootSessionId: n.rootSessionId ?? r,
			traceSessionId: n.traceSessionId,
			scheduleId: n.scheduleId,
			sessionId: r,
			title: n.title,
			type: `session.started`
		}];
		case `session.ended`: {
			let { cause: n } = e.data;
			let a = n !== void 0 && `turnId` in n ? n.turnId : latestTurnId(t.view);
			let { outcome: o } = e.data;
			return [{
				error: o === `failed` ? Error(e.data.error?.message ?? `The session failed.`) : void 0,
				idempotencyKey: i,
				outcome: o,
				sessionId: r,
				turnId: a,
				type: `session.ended`
			}];
		}
		case `turn.started`: return [{
			idempotencyKey: turnIdempotencyKey(r, e.data.turnId),
			parentLineage: n.parentLineage,
			parentTraceContext: n.parentTraceContext,
			rootSessionId: n.rootSessionId ?? r,
			traceSessionId: n.traceSessionId,
			sequence: turnSequence(e.data.turnId),
			sessionId: r,
			turnId: e.data.turnId,
			type: `turn.started`
		}];
		case `turn.settled`: {
			let { outcome: t, turnId: n } = e.data;
			return [{
				error: t === `failed` ? Error(e.data.error?.message ?? `The turn failed.`) : void 0,
				idempotencyKey: turnIdempotencyKey(r, n),
				outcome: t,
				sessionId: r,
				turnId: n,
				type: `turn.settled`
			}];
		}
		case `model.retried`: {
			let n = runAttempt(t, e.data.runId);
			return n === void 0 ? [] : [{
				error: Error(e.data.error.message),
				idempotencyKey: attemptIdempotencyKey(n),
				scope: n,
				type: `model.retried`
			}];
		}
		case `model.settled`: {
			let n = runAttempt(t, e.data.runId);
			if (n === void 0) return [];
			let { error: r, outcome: i } = e.data;
			let a = attemptIdempotencyKey(n);
			let o = i === `interrupted` && n.turnId !== void 0 && t.view?.turns[n.turnId]?.outcome === `cancelled`;
			return [{
				error: r === void 0 ? void 0 : Error(r.message),
				idempotencyKey: a,
				scope: n,
				outcome: o ? `cancelled` : i,
				type: `model.settled`
			}];
		}
		case `call.requested`: {
			let i = t.view?.calls[e.data.callId];
			let a = i === void 0 ? void 0 : runAttempt(t, callRun(t.view, i));
			if (a === void 0) return [];
			let { callId: o, capability: s } = e.data;
			let c = s.name;
			return [{
				callId: o,
				frameworkTool: s.kind === `skill` || n.isFrameworkTool?.(c) === !0,
				idempotencyKey: actionIdempotencyKey(r, a.turnId, o),
				input: t.capturesInputs ? e.data.input : void 0,
				capability: s,
				scope: a,
				startedAtMs: t.startedAtMs,
				toolName: c,
				type: `call.requested`
			}];
		}
		case `call.settled`: {
			let { callId: n, outcome: i } = e.data;
			let a = t.view?.calls[n];
			let o = a === void 0 ? void 0 : runAttempt(t, callRun(t.view, a));
			if (o === void 0) return [];
			let s = actionIdempotencyKey(r, o.turnId, n);
			let c = i === `completed` ? e.data.output : void 0;
			let l = i === `completed` ? void 0 : e.data.error === void 0 ? e.data.output : Object.assign(Error(e.data.error.message), {
				code: e.data.error.code,
				name: e.data.error.name ?? `Error`
			});
			return [{
				acceptedAtMs: t.settledAtMs?.[n],
				cause: e.data.cause,
				error: t.capturesOutputs ? l : void 0,
				errorCode: e.data.error?.code,
				idempotencyKey: s,
				outcome: i,
				reason: e.data.reason,
				output: t.capturesOutputs ? c : void 0,
				scope: o,
				type: `call.settled`,
				taskId: a?.taskId,
				usage: a?.usage
			}];
		}
		case `interaction.opened`: {
			let n = t.view?.interactions[e.data.interactionId];
			let i = n === void 0 ? void 0 : interactionAttempt(t, n);
			if (n === void 0 || i === void 0 || askedByChildSession(t.view, n)) return [];
			let { request: a } = n;
			let o = askedCall(t.view, n);
			return [{
				call: o === void 0 ? void 0 : {
					callId: o.callId,
					name: o.name
				},
				idempotencyKey: inputIdempotencyKey(r, i.turnId, n.interactionId),
				interactionId: n.interactionId,
				kind: a.kind,
				request: t.capturesOutputs ? {
					allowFreeform: a.allowFreeform,
					display: a.display,
					options: a.options,
					prompt: a.prompt,
					title: a.title
				} : void 0,
				scope: i,
				signIn: a.signIn === void 0 ? void 0 : { name: a.signIn.name },
				type: `interaction.opened`
			}];
		}
		case `interaction.settled`: {
			let n = t.view?.interactions[e.data.interactionId];
			let i = n === void 0 ? void 0 : interactionAttempt(t, n);
			if (n === void 0 || i === void 0 || askedByChildSession(t.view, n)) return [];
			let a = decidingAnswer(n);
			return [{
				answer: !t.capturesInputs || a === void 0 ? void 0 : {
					optionId: a.optionId,
					text: a.text
				},
				idempotencyKey: inputIdempotencyKey(r, i.turnId, n.interactionId),
				interactionId: n.interactionId,
				kind: n.request.kind,
				outcome: e.data.outcome,
				reason: authorizationReasonCode(e.data.reason),
				responder: responderSummary(t.view, e.data.cause, t.capturesPrincipalIds),
				scope: i,
				type: `interaction.settled`
			}];
		}
		default: return [];
	}
}
function responderSummary(e, t, n) {
	if (t === void 0 || !(`responseId` in t)) return;
	let r = responderOf(e, t.responseId);
	return r === void 0 ? void 0 : instrumentationPrincipal(r.type, n ? r.id : void 0);
}
function runAttempt(e, t) {
	let n = t === void 0 ? void 0 : e.view?.runs[t];
	if (n?.attempt === void 0) return;
	let r = runTurn(e.view, n.runId);
	return e.attemptScope({
		runId: n.runId,
		attempt: n.attempt,
		stepIndex: n.step,
		turnId: r
	});
}
function askedByChildSession(e, t) {
	let { origin: n, subject: r } = t;
	return n === void 0 ? !1 : (`callId` in r ? e.calls[r.callId] : void 0)?.capability.kind === `agent` || n.sessionId in e.children;
}
function interactionAttempt(e, t) {
	let n = e.view;
	let { subject: r } = t;
	if (`callId` in r) {
		let t = n.calls[r.callId];
		return t === void 0 ? void 0 : runAttempt(e, callRun(n, t));
	}
	if (`taskId` in r) {
		let t = n.tasks[r.taskId];
		let i = t === void 0 ? void 0 : n.calls[t.startedBy.callId];
		return i === void 0 ? void 0 : runAttempt(e, callRun(n, i));
	}
	if (!(`turnId` in r)) return;
	let i = Object.values(n.runs).filter((e) => e.attempt !== void 0 && runTurn(n, e.runId) === r.turnId);
	return i.length === 0 ? e.turnScope(r.turnId) : runAttempt(e, i.at(-1)?.runId);
}
function latestTurnId(e) {
	return (e === void 0 ? [] : Object.keys(e.turns)).at(-1);
}
function turnSequence(e) {
	let t = /^turn_(\d+)$/.exec(e);
	return t === null ? 0 : Number(t[1]);
}
// node_modules/eve/dist/src/instrumentation/prepare-trace-context.js
const log$1 = createLogger(`harness.prepare-trace-context`);
async function prepareTurnTraceContext(e) {
	let t;
	let { channelAudience: n, channelKind: r, channelType: i, traceSeed: a, ...o } = e.session;
	if (!e.sessionStarted && e.instrumentation?.prepareSessionTrace !== void 0) try {
		t = await e.instrumentation.prepareSessionTrace({
			...o,
			channelAudience: n,
			channelKind: r,
			channelType: i,
			idempotencyKey: sessionIdempotencyKey(o.sessionId),
			traceSeed: a,
			type: `session.started`
		});
	} catch (e) {
		warn(`session.started`, e);
	}
	if (e.turnId !== void 0 && e.instrumentation?.prepareTurnTrace !== void 0) try {
		t = await e.instrumentation.prepareTurnTrace({
			...o,
			...e.principals,
			idempotencyKey: turnIdempotencyKey(o.sessionId, e.turnId),
			sequence: e.sequence,
			turnId: e.turnId,
			type: `turn.started`
		});
	} catch (e) {
		warn(`turn.started`, e);
	}
	return a === void 0 && t?.decision !== void 0 && contextStorage.getStore()?.set(SessionTraceSeedKey, t), e.traceContext ?? t;
}
function warn(e, t) {
	log$1.warn(`instrumentation trace preparation failed`, {
		boundary: e,
		error: formatError(t)
	});
}
// node_modules/eve/dist/src/instrumentation/session-init.js
const log = createLogger(`instrumentation.session-init`);
function initializeSessionInstrumentation(e) {
	let t = getInstrumentationRuntime();
	let n = e.ctx.get(ParentTraceContextKey);
	let r = readForwardedTraceAssertion(n?.forwardedTracePolicy);
	let i = e.ctx.get(ConversationContextKey);
	let a = resolveConversationContext(i, {
		channelKind: e.ctx.get(ChannelInstrumentationKey)?.kind,
		environment: resolveInstrumentationEnvironment(),
		forwardedTracePolicy: r,
		principalType: e.ctx.get(AuthKey)?.principalType
	}, { forwardedOverridesStored: !0 });
	let o = allocateSessionTraceSeed({
		agentName: e.agentName,
		conversation: a,
		channelType: e.ctx.get(ChannelInstrumentationKey)?.channelType,
		forwardedTracePolicy: r,
		parentTraceContext: n,
		runtime: t
	});
	if (o !== void 0 && (e.ctx.set(SessionTraceSeedKey, o), r !== void 0 && log.info(`resolved forwarded trace policy`, {
		ceilingEffective: o.decision?.action === `record` ? formatTraceContentCeiling(o.decision) : `drop`,
		ceilingIn: formatTraceContentCeiling(r.ceiling),
		originAudience: r.originAudience
	}), r !== void 0 && n !== void 0)) {
		let t = {
			...n,
			decision: o.decision,
			traceFlags: o.traceFlags
		};
		delete t.forwardedTracePolicy, e.ctx.set(ParentTraceContextKey, t);
	}
	return e.ctx.set(OtelTraceEnabledKey, t?.prepareSessionTrace !== void 0), o?.decision ?? resolveTracePolicy(t?.otelSettings?.tracePolicy, {
		agentName: e.agentName,
		...a
	});
}
function allocateSessionTraceSeed(e) {
	let localDecision = () => resolveTracePolicy(e.runtime?.otelSettings?.tracePolicy, {
		agentName: e.agentName,
		...e.conversation
	});
	if (e.parentTraceContext !== void 0) {
		let t = e.forwardedTracePolicy ? traceContentCeilingToDecision(e.forwardedTracePolicy.ceiling) : void 0;
		let n = readInstrumentationDecision(e.parentTraceContext.decision);
		let r = isSampledTrace(e.parentTraceContext) ? t ? n === void 0 ? t : intersectInstrumentationDecisions(t, n) : n ?? resolveTracePolicyDecision(isSampledTrace(e.parentTraceContext), e.conversation) : { action: `drop` };
		let i = `isRemote` in e.parentTraceContext && e.parentTraceContext.isRemote === !0;
		let a = e.forwardedTracePolicy || i ? intersectInstrumentationDecisions(r, localDecision()) : r;
		let o = e.runtime?.idGenerator ?? new AgentSpanIdGenerator();
		return {
			decision: a,
			...e.forwardedTracePolicy === void 0 ? void 0 : { forwardedTracePolicy: e.forwardedTracePolicy },
			spanId: o.allocateSpanId(),
			traceFlags: a.action === `drop` ? 0 : e.parentTraceContext.traceFlags,
			traceId: i ? o.generateTraceId() : e.parentTraceContext.traceId
		};
	}
	if (e.runtime?.prepareSessionTrace === void 0 || e.runtime.idGenerator === void 0) return;
	let t = localDecision();
	let n = e.runtime.idGenerator.generateTraceId();
	let r = t.action === `record`;
	return {
		decision: t,
		spanId: e.runtime.idGenerator.allocateSpanId(),
		traceFlags: +!!r,
		traceId: n
	};
}
// node_modules/eve/dist/src/instrumentation/runtime.js
const TURN_TRACE_STATE_KEY = `eve.harness.turnTrace`;
function bindInstrumentationRuntime(e, t, n) {
	let r = {
		...n,
		traceSessionId: resolveTraceRootSessionId(t, n.sessionId)
	};
	if (readConversationId(t.get(ConversationIdKey)) === void 0 && t.set(ConversationIdKey, t.get(ParentSessionKey)?.rootSessionId ?? r.rootSessionId), e === void 0) return;
	let i;
	let a = e.hooks;
	let o = r.traceSessionId;
	let readSessionContext = () => {
		let e = readInstrumentationSessionContext(contextStorage.getStore() ?? t);
		return {
			...e,
			rootSessionId: e.parent?.rootSessionId ?? r.rootSessionId,
			traceSessionId: o
		};
	};
	let bindHooks = (e) => a.forTrace?.({
		agentName: r.agentName,
		...e.conversation
	}, { ceiling: e.forwardedTracePolicy?.ceiling }) ?? a;
	let captureExecutionRuntime = () => {
		let t = e.otelSettings;
		let n = e.ownsAgentSpans === !0;
		return t !== void 0 && !n && ensureOtelIntegration(), {
			ownsAgentSpans: n,
			otelSettings: t,
			runtimeContextResolvers: e.runtimeContextResolvers,
			tracer: t === void 0 ? void 0 : trace.getTracer(`eve`)
		};
	};
	let preparePreamble = (t, n) => prepareTurnTraceContext({
		...t,
		instrumentation: e,
		principals: n.principals,
		session: {
			agentName: r.agentName,
			channelAudience: n.conversation.audience,
			channelKind: n.conversation.channel.kind,
			channelType: n.instrumentation?.channelType,
			parentLineage: n.parentLineage,
			parentTraceContext: n.parentTraceContext,
			rootSessionId: n.rootSessionId,
			traceSessionId: n.traceSessionId,
			scheduleId: n.scheduleId,
			sessionId: r.sessionId,
			title: n.title,
			traceSeed: n.traceSeed
		}
	});
	let s = e.memoryOperations === !0 ? createMemoryInstrumentation({
		resolveContext: () => {
			let e = readSessionContext();
			return {
				hooks: bindHooks(e),
				rootSessionId: e.rootSessionId,
				traceSessionId: e.traceSessionId
			};
		},
		runInContext: e.runInContext,
		sessionId: r.sessionId
	}) : void 0;
	return {
		prepareDelivery: (e) => {
			i = e;
		},
		createHandleEvent: (e) => {
			let t = readSessionContext();
			return createInstrumentationHandleEvent({
				agentName: r.agentName,
				channelAudience: t.conversation.audience,
				channelKind: t.conversation.channel.kind,
				environment: t.conversation.environment,
				functionId: captureExecutionRuntime().otelSettings?.functionId ?? r.agentName,
				handleEvent: e.handleEvent,
				deliveryInput: i,
				hooks: bindHooks(t),
				relayed: e.relayed,
				rootSessionId: t.rootSessionId,
				traceSessionId: t.traceSessionId,
				parentLineage: t.parentLineage,
				parentTraceContext: t.parentTraceContext,
				scheduleId: t.scheduleId,
				sessionId: r.sessionId,
				title: t.title
			});
		},
		flush: e.forceFlush,
		memory: s,
		prepareExecution: () => {
			let t = captureExecutionRuntime();
			return {
				installAiSdkWarningLogger: ensureAiSdkWarningLogger,
				runStep: async (n, a) => {
					let o = readSessionContext();
					let s = bindHooks(o);
					let c = t.otelSettings;
					let l = resolveInstrumentationTraceDecision(c, r.agentName, o.conversation, o.traceSeed, readSessionTraceDecision(o.context, r.sessionId));
					let u = t.tracer;
					let d = {
						"eve.environment": n.environment,
						"eve.session.id": n.session.sessionId,
						"eve.version": n.eveVersion
					};
					let f = c?.functionId ?? r.agentName;
					f && (d[`ai.telemetry.functionId`] = f);
					let p = u !== void 0 && !t.ownsAgentSpans && l?.action !== `drop` && n.hasInput ? u.startSpan(`ai.eve.turn`, { attributes: d }) : void 0;
					let m = p?.spanContext();
					let h = m === void 0 ? n.session : {
						...n.session,
						state: {
							...n.session.state,
							[TURN_TRACE_STATE_KEY]: {
								spanId: m.spanId,
								traceFlags: m.traceFlags,
								traceId: m.traceId
							}
						}
					};
					let g = p === void 0 ? void 0 : trace.setSpan(context.active(), p);
					if (g === void 0 && u !== void 0) {
						let e = n.session.state?.[TURN_TRACE_STATE_KEY];
						e !== void 0 && (g = trace.setSpan(context.active(), trace.wrapSpanContext({
							...e,
							isRemote: !0
						})));
					}
					let _ = readSessionContext();
					let v = snapshotInstrumentationRuntimeContext(_.context);
					let y = _.conversation;
					let b = y.audience;
					let x = defaultContentCapture(y, _.forwardedTracePolicy?.ceiling);
					let S = l === void 0 ? l : applyLiveDeliveryAudienceCeiling(l, b, _.forwardedTracePolicy, y.environment);
					let C = S === void 0 ? x.recordInputs : S.action === `record` && S.recordInputs;
					let w = l?.action === `drop`;
					let T = {
						recordInputs: !w && (S?.action === `record` ? S.recordInputs : x.recordInputs),
						recordOutputs: !w && (S?.action === `record` ? S.recordOutputs : x.recordOutputs)
					};
					let E = c !== void 0 && !t.ownsAgentSpans ? T : aiSdkCapture(T, s);
					let telemetry = (e) => {
						if (c === void 0 && e.bridgeIntegration === void 0) return;
						let n = {};
						for (let t of Object.keys(e.runtimeContext ?? {})) n[t] = !0;
						let i = c !== void 0 && !(T.recordInputs && T.recordOutputs);
						let integrations = () => getRegisteredTelemetryIntegrations({
							...t.ownsAgentSpans ? { excludeEveOtelIntegration: !0 } : void 0,
							sanitizeEveOtelErrors: i
						});
						return {
							functionId: c?.functionId ?? r.agentName,
							includeRuntimeContext: n,
							integrations: e.bridgeIntegration === void 0 ? i ? [...integrations()] : void 0 : [e.bridgeIntegration, ...integrations()],
							isEnabled: !0,
							recordInputs: E.recordInputs,
							recordOutputs: E.recordOutputs
						};
					};
					let D = {
						channelAudience: b,
						functionId: c?.functionId ?? r.agentName,
						rootSessionId: _.rootSessionId,
						sessionId: r.sessionId,
						traceSessionId: _.traceSessionId
					};
					let run = () => a({
						gatewayTraceContextHeaders: createGatewayTraceContextHeaders,
						createHandleEvent: (e) => createInstrumentationHandleEvent({
							...e,
							...D,
							deliveryInput: i,
							agentName: r.agentName,
							channelKind: y.channel.kind,
							environment: y.environment,
							hooks: s,
							parentLineage: _.parentLineage,
							parentTraceContext: _.parentTraceContext,
							scheduleId: _.scheduleId,
							title: _.title
						}),
						prepareAttempt: (t) => {
							let n = attemptScopeOf(D, t);
							let r = createAiSdkHookBridge(n, s, e.runInContext, t.runtimeContext, t.isFrameworkTool);
							return {
								scope: n,
								telemetry: telemetry({
									bridgeIntegration: r,
									runtimeContext: t.runtimeContext
								})
							};
						},
						preparePreamble: (e) => preparePreamble(e, _),
						recordError: (e) => {
							p !== void 0 && recordErrorOnSpan(p, e);
						},
						resolveRuntimeContext: (e) => buildTelemetryRuntimeContext({
							...e,
							capturesContent: C,
							context: v,
							providerResolvers: t.runtimeContextResolvers
						}),
						session: h,
						setTurnId: (e) => p?.setAttribute(`eve.turn.id`, e),
						telemetry: () => telemetry({}),
						traceContext: m === void 0 || !isValidSpanContext(m) ? void 0 : {
							spanId: m.spanId,
							traceFlags: m.traceFlags,
							traceId: m.traceId
						}
					});
					try {
						return await context.with(withCapture(g ?? context.active(), {
							emit: !0,
							recordInputs: T.recordInputs,
							recordOutputs: T.recordOutputs
						}), run);
					} finally {
						p?.end(), p = void 0;
					}
				}
			};
		},
		preparePreamble: (e) => preparePreamble(e, readSessionContext())
	};
}
function bindSessionInstrumentation(e) {
	let t = {
		agentName: e.agentName,
		rootSessionId: e.rootSessionId,
		traceSessionId: resolveTraceRootSessionId(e.ctx, e.sessionId),
		sessionId: e.sessionId
	};
	return bindInstrumentationRuntime(getInstrumentationRuntime(), e.ctx, t);
}
function isValidSpanContext(e) {
	return /^[0-9a-f]{32}$/u.test(e.traceId) && e.traceId !== `00000000000000000000000000000000` && /^[0-9a-f]{16}$/u.test(e.spanId) && e.spanId !== `0000000000000000`;
}
export { RuntimeActionSettlementTimesKey, bindSessionInstrumentation, connectionAuthorizationAttributes, initializeSessionInstrumentation, resolveInstrumentationProjection };

//# sourceMappingURL=eve27.mjs.map