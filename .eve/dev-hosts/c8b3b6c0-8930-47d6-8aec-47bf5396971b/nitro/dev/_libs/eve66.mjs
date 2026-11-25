import { createLogger, logError } from "./eve4.mjs";
import { isSessionCommandHookToken, logicalSessionInboxToken } from "./eve6.mjs";
import { stubResponseNamespace } from "./eve7.mjs";
import { SessionNotActiveError, SessionStrandedError, intersectInstrumentationDecisions } from "./eve8.mjs";
import { readConversationBaggage, resolveConversationId } from "./eve9.mjs";
import { isLocalDevelopmentServer } from "./eve11.mjs";
import { createEveCallbackRoutePath } from "./eve16.mjs";
import { relayEvent } from "./eve22.mjs";
import { jsonObjectSchema } from "./eve36.mjs";
import { isBlockedDestinationHost, isLoopbackHostname } from "./eve39.mjs";
import "./eve40.mjs";
import { normalizePublicEveRoutePath } from "./eve48.mjs";
import { resumeSessionInbox, runtime_exports, v26InteractionOutcome, v26InteractionRequest, v26SignInOutcome, v26SignInRequest } from "./eve65.mjs";
import { workflowEntryReference } from "./eve72.mjs";
import { z } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/zod/index.js";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { networkInterfaces } from "node:os";
import { Validator } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@cfworker/json-schema/index.js";
import { registerStepFunction } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@workflow/core/private.js";
import { getWritable } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@workflow/core/index.js";
import { createAgentDelegationTransport } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/delegation.js";
function readTrustedDevelopmentClientAddress(e, t) {
	let n = e.get("x-eve-dev-client-address");
	let r = e.get("x-eve-dev-client-address-signature");
	return n !== null && r !== null && isTrustedDevelopmentClientAddress(n, r, t) ? n : void 0;
}
function readTrustedDevelopmentPeer(e) {
	let t = readTrustedDevelopmentClientAddress(e, process.env["EVE_DEV_WORKFLOW_TRANSPORT_SECRET"]);
	if (t !== void 0) return isLocalMachineAddress(t) ? `local` : `remote`;
}
function isLocalMachineAddress(e) {
	if (isLoopbackHostname(e)) return !0;
	let t = e.toLowerCase().replace(/^\[(.*)\]$/u, `$1`).replace(/^::ffff:/u, ``);
	return Object.values(networkInterfaces()).some((e) => e?.some((e) => e.address.toLowerCase() === t));
}
function isTrustedDevelopmentClientAddress(e, t, n) {
	return e.length > 0 && t.length > 0 && n !== void 0 && n.length > 0 && timingSafeEqualStrings(t, signClientAddress(e, n));
}
function timingSafeEqualStrings(e, t) {
	let n = createHash(`sha256`).update(e).digest();
	let r = createHash(`sha256`).update(t).digest();
	return timingSafeEqual(n, r);
}
function signClientAddress(e, t) {
	return createHmac(`sha256`, t).update(e).digest(`base64url`);
}
// node_modules/eve/dist/src/channel/auth/vercel-oidc-project.js
const VERCEL_OIDC_PROJECT_RESOLVERS = Symbol.for(`eve.vercel-oidc-project-resolvers`);
const globalResolverRegistry = globalThis;
globalResolverRegistry[VERCEL_OIDC_PROJECT_RESOLVERS] === void 0 && (globalResolverRegistry[VERCEL_OIDC_PROJECT_RESOLVERS] = /* @__PURE__ */ new WeakMap());
const projectResolvers = globalResolverRegistry[VERCEL_OIDC_PROJECT_RESOLVERS];
async function withVercelOidcProjectResolver(e, t) {
	let n = projectResolvers.get(e.request);
	projectResolvers.set(e.request, e.resolveCurrentProject);
	try {
		return await t();
	} finally {
		n === void 0 ? projectResolvers.delete(e.request) : projectResolvers.set(e.request, n);
	}
}
async function resolveVercelOidcCurrentProject(e) {
	let t = projectResolvers.get(e);
	return t === void 0 ? void 0 : await t();
}
// node_modules/eve/dist/src/eve-channel/types.js
function defaultEveAuth(e) {
	return e.eve.caller;
}
// node_modules/eve/dist/src/eve-channel/support.js
const log = createLogger(`eve.channel`);
function healthResponse() {
	return Response.json({
		ok: !0,
		status: `ready`,
		workflowId: workflowEntryReference.workflowId
	});
}
function sessionCommandErrorResponse(e) {
	if (SessionNotActiveError.is(e)) return Response.json({
		ok: !1,
		code: e.code,
		error: e.retryable ? `The session is not ready to accept messages yet.` : `The session is no longer active.`
	}, {
		headers: { "cache-control": `no-store` },
		status: 409
	});
	if (!SessionStrandedError.is(e)) return;
	let t = {
		code: `session_stranded`,
		error: `This session is no longer available.`,
		ok: !1
	};
	return e.owner.eveVersion !== void 0 && (t.eveVersion = e.owner.eveVersion), Response.json(t, {
		headers: { "cache-control": `no-store` },
		status: 409
	});
}
function deliveryResponse(e) {
	return Response.json({
		ok: !0,
		sessionId: e.sessionId,
		deliveryId: e.deliveryId,
		inbox: e.inbox
	}, {
		headers: {
			"cache-control": `no-store`,
			["x-eve-session-id"]: e.sessionId
		},
		status: 202
	});
}
async function findRemoteAgentBinding(e) {
	let t = await e.parent.getChildBinding?.(e.childSessionId);
	if (t === void 0 || t.callId !== e.callId || t.streamPath !== e.childStreamPath) return;
	let n = {
		name: t.name,
		url: t.url
	};
	return t.resolverId !== void 0 && (n.resolverId = t.resolverId), t.dynamicBinding !== void 0 && (n.dynamicBinding = t.dynamicBinding), t.earlierProtocol !== void 0 && (n.earlierProtocol = t.earlierProtocol), n;
}
async function resolveOnMessage(e) {
	let t = e.config.onMessage ?? defaultOnMessage;
	let n;
	try {
		let r = {
			caller: e.auth,
			clientContext: e.clientContext,
			request: e.request,
			...e.turnPolicy !== void 0 && { turnPolicy: e.turnPolicy }
		};
		if (n = await t({ eve: e.sessionId === void 0 ? e.invocation === void 0 ? r : {
			...r,
			invocation: e.invocation
		} : {
			...r,
			sessionId: e.sessionId
		} }, e.message), n == null) throw TypeError(`eveChannel onMessage must return an auth result.`);
	} catch (t) {
		let n = logError(log, `onMessage handler failed`, t, { sessionId: e.sessionId });
		return Response.json({
			error: `onMessage handler failed.`,
			errorId: n,
			ok: !1
		}, { status: 500 });
	}
	return {
		auth: n.auth,
		clientContext: resolveTurnClientContext(n.clientContext, e.clientContext),
		context: n.context,
		history: n.history,
		title: n.title,
		turnPolicy: n.turnPolicy
	};
}
function resolveTurnClientContext(e, t) {
	let n = e === void 0 ? toContextEntries(t).map((e) => `Client context:
${e}`) : toContextEntries(e);
	return n.length === 0 ? void 0 : n;
}
function toContextEntries(e) {
	return e === void 0 || e === `` ? [] : typeof e == `string` ? [e] : Array.isArray(e) ? e : [JSON.stringify(e)];
}
function defaultOnMessage(e) {
	return { auth: defaultEveAuth(e) };
}
// node_modules/eve/dist/src/protocol/remote-agent-protocol.js
const CALLBACK_PROTOCOL_QUERY = `eveRemoteProtocol`;
function callbackUrlForProtocol(e, t) {
	let n = new URL(e);
	return n.searchParams.set(CALLBACK_PROTOCOL_QUERY, String(t)), n.toString();
}
function readCallbackProtocol(e) {
	let t = URL.parse(e)?.searchParams.get(CALLBACK_PROTOCOL_QUERY);
	if (t != null && /^[1-9]\d*$/.test(t)) return Number(t);
}
function servesRemoteAgentCaller(e) {
	return Number.isSafeInteger(e) && e >= 2 && e <= 3;
}
function formatEarlierRemoteChildStreamError(e) {
	return `Remote agent "${e.name}" speaks eve remote agent protocol ${String(e.childVersion)}, so this deployment can't follow its stream. Its result still arrives. Upgrade both deployments to the same eve release to follow it.`;
}
function readRemoteAgentProtocolVersion(e) {
	return typeof e == `number` ? e : 1;
}
function formatRemoteAgentProtocolMismatch(e) {
	return `Remote agent "${e.name}" speaks eve remote agent protocol ${String(e.receiverVersion)}, but this deployment speaks protocol 3. Upgrade both deployments to the same eve release.`;
}
// node_modules/eve/dist/src/tool-stubs/schema.js
const schema = { $ref: `#` };
const schemaList = {
	type: `array`,
	minItems: 1,
	items: schema
};
const propertyName = {
	type: `string`,
	not: { enum: Object.getOwnPropertyNames(Object.prototype) }
};
const schemaMap = {
	type: `object`,
	propertyNames: propertyName,
	additionalProperties: schema
};
const strings = {
	type: `array`,
	uniqueItems: !0,
	items: propertyName
};
const nonnegativeInteger = {
	type: `integer`,
	minimum: 0
};
const jsonType = { enum: [
	`array`,
	`boolean`,
	`integer`,
	`null`,
	`number`,
	`object`,
	`string`
] };
const constraintSchema = new Validator({ anyOf: [{ type: `boolean` }, {
	type: `object`,
	additionalProperties: !1,
	properties: {
		type: { anyOf: [jsonType, {
			type: `array`,
			minItems: 1,
			uniqueItems: !0,
			items: jsonType
		}] },
		const: { type: [
			`string`,
			`number`,
			`boolean`,
			`null`
		] },
		enum: {
			type: `array`,
			minItems: 1,
			uniqueItems: !0,
			items: { type: [
				`string`,
				`number`,
				`boolean`,
				`null`
			] }
		},
		title: { type: `string` },
		description: { type: `string` },
		default: !0,
		minimum: { type: `number` },
		maximum: { type: `number` },
		exclusiveMinimum: { type: `number` },
		exclusiveMaximum: { type: `number` },
		minLength: nonnegativeInteger,
		maxLength: nonnegativeInteger,
		pattern: {
			type: `string`,
			format: `regex`
		},
		minItems: nonnegativeInteger,
		maxItems: nonnegativeInteger,
		items: schema,
		prefixItems: schemaList,
		contains: schema,
		minProperties: nonnegativeInteger,
		maxProperties: nonnegativeInteger,
		properties: schemaMap,
		propertyNames: schema,
		required: strings,
		additionalProperties: schema,
		allOf: schemaList,
		anyOf: schemaList,
		oneOf: schemaList,
		not: schema,
		if: schema,
		then: schema,
		else: schema
	}
}] }, `2020-12`);
function validateStubConstraint(e, t, n) {
	let r = constraintSchema.validate(e);
	if (!r.valid) {
		let e = r.errors.at(-1);
		let i = e.keyword === `false` ? `Unsupported JSON Schema keyword.` : e.error;
		throw Error(`Invalid matcher "${n}" in tool stub "${t}" at ${e.instanceLocation}: ${i}`);
	}
}
function createStubValidator(e) {
	return new Validator(structuredClone(e), `2020-12`);
}
// node_modules/eve/dist/src/channel/session-callback.js
const sessionCallbackSchema = z.object({
	callId: z.string().min(1),
	subagentName: z.string().min(1),
	token: z.string().min(1),
	url: z.string().min(1)
}).strict().superRefine((e, t) => {
	let n;
	try {
		n = new URL(e.url);
	} catch {
		t.addIssue({
			code: `custom`,
			message: `Callback url must be absolute.`,
			path: [`url`]
		});
		return;
	}
	readCallbackUrlToken(n) !== e.token && t.addIssue({
		code: `custom`,
		message: `Callback url token must match callback token.`,
		path: [`url`]
	}), n.protocol !== `http:` && n.protocol !== `https:` && t.addIssue({
		code: `custom`,
		message: `Callback url must use http or https.`,
		path: [`url`]
	}), isBlockedDestinationHost(n.hostname, { allowLoopback: isLocalDevelopmentServer() }) && t.addIssue({
		code: `custom`,
		message: `Callback url host must not be a loopback, private, link-local, or reserved address. Loopback is allowed only on local development servers.`,
		path: [`url`]
	});
});
function parseSessionCallback(e) {
	let t = sessionCallbackSchema.safeParse(e);
	return t.success ? {
		callback: t.data,
		ok: !0
	} : {
		cause: t.error,
		message: formatSessionCallbackParseError(t.error),
		ok: !1
	};
}
function readCallbackUrlToken(e) {
	let t = createEveCallbackRoutePath(``);
	let n = normalizePublicEveRoutePath(e.pathname);
	let r = n.lastIndexOf(t);
	if (r === -1) return null;
	let i = n.slice(r + t.length);
	if (i.length === 0 || i.includes(`/`)) return null;
	try {
		return decodeURIComponent(i);
	} catch {
		return null;
	}
}
function formatSessionCallbackParseError(e) {
	return `Invalid callback metadata: ${e.issues.map((e) => `${e.path.length === 0 ? `callback` : `callback.${e.path.join(`.`)}`}: ${e.message}`).join(`; `)}`;
}
// node_modules/eve/dist/src/execution/tool-stubs/steps.js
async function publishStubResultStep(e) {
	if (e.matchedRuleId !== void 0) {
		let t = getWritable({ namespace: "eve.tool-stubs.matches" }).getWriter();
		try {
			await t.write(e.matchedRuleId);
		} finally {
			t.releaseLock();
		}
	}
	let t = getWritable({ namespace: stubResponseNamespace(e.callId) }).getWriter();
	try {
		await t.write(e.result);
	} finally {
		t.releaseLock();
	}
}
async function publishStubFailureStep(e) {
	let t = getWritable({ namespace: "eve.tool-stubs.failure" }).getWriter();
	try {
		await t.write(e);
	} finally {
		t.releaseLock();
	}
}
async function callToolStubStep(e, t) {
	return await requestStub(e, {
		kind: `call`,
		call: t
	});
}
async function reportStubFailureStep(e, t, n) {
	try {
		await requestStub(e, {
			kind: `failure`,
			callId: t,
			error: n
		});
	} catch (t) {
		if (e.rootSessionId === void 0) throw t;
		await (0, runtime_exports.getRun)(e.rootSessionId).cancel({ cancelReason: `Could not record a tool stub output-processing failure.` });
	}
}
async function requestStub(e, t) {
	let n = e.rootSessionId;
	if (n === void 0) throw Error(`Tool stub session is missing its durable playback owner.`);
	let r = t.kind === `call` ? t.call.callId : `${t.callId}:failure`;
	await (0, runtime_exports.resumeHook)(e.token, t);
	let i = (0, runtime_exports.getRun)(n).getReadable({ namespace: stubResponseNamespace(r) }).getReader();
	try {
		let { done: e, value: t } = await i.read();
		if (e) throw Error(`Tool stub session ended without a response.`);
		return t;
	} finally {
		await i.cancel(), i.releaseLock();
	}
}
async function readStubFailure(e) {
	let t = (0, runtime_exports.getRun)(e);
	let n = t.getReadable({ namespace: "eve.tool-stubs.failure" });
	if (await n.getTailIndex() < 0) {
		await n.cancel();
		let e = await t.status;
		return e === `failed` || e === `cancelled` ? `Tool stub session failed before verification.` : void 0;
	}
	let r = n.getReader();
	try {
		return (await r.read()).value;
	} finally {
		await r.cancel(), r.releaseLock();
	}
}
async function failStubSessionStep(e) {
	await resumeSessionInbox({ sessionId: e }, {
		kind: `session-failure`,
		error: `Tool stub playback failed.`
	});
}
async function readMatchedStubRules(e) {
	let t = (0, runtime_exports.getRun)(e).getReadable({ namespace: "eve.tool-stubs.matches" });
	let n = await t.getTailIndex();
	let r = t.getReader();
	let i = /* @__PURE__ */ new Set();
	try {
		for (let e = 0; e <= n; e++) {
			let { done: e, value: t } = await r.read();
			if (e) throw Error(`Tool stub match records ended unexpectedly.`);
			i.add(t);
		}
		return [...i];
	} finally {
		await r.cancel(), r.releaseLock();
	}
}
registerStepFunction("step//eve@1.4.0//publishStubResultStep", publishStubResultStep);
registerStepFunction("step//eve@1.4.0//publishStubFailureStep", publishStubFailureStep);
registerStepFunction("step//eve@1.4.0//callToolStubStep", callToolStubStep);
registerStepFunction("step//eve@1.4.0//reportStubFailureStep", reportStubFailureStep);
registerStepFunction("step//eve@1.4.0//failStubSessionStep", failStubSessionStep);
// node_modules/eve/dist/src/execution/callback-hook-tokens.js
const REMOTE_REPLY_PREFIX = `eve:reply:v1:`;
const SIGN_IN_PREFIX = `eve:sign-in:v1:`;
function remoteReplyHookToken(e) {
	return `${REMOTE_REPLY_PREFIX}${e}`;
}
function isRemoteReplyHookToken(e) {
	return e.startsWith(REMOTE_REPLY_PREFIX);
}
function isSignInCallbackToken(e) {
	let t = logicalSessionInboxToken(e);
	return t === void 0 ? e.startsWith(SIGN_IN_PREFIX) : isSessionCommandHookToken(t);
}
// node_modules/eve/dist/src/subagents/protocol-two-callback.js
const PROTOCOL_TWO_INPUT_CALLBACK_KINDS = /* @__PURE__ */ new Set([`subagent-input-request`, `subagent-authorization-event`]);
const position = {
	sequence: z.number(),
	stepIndex: z.number(),
	turnId: z.string()
};
const v26RequestSchema = z.object({
	action: z.object({
		callId: z.string().min(1),
		input: jsonObjectSchema,
		kind: z.literal(`tool-call`),
		toolName: z.string().min(1)
	}),
	allowFreeform: z.boolean().optional(),
	display: z.string().optional(),
	kind: z.enum([
		`question`,
		`session-limit`,
		`tool-approval`
	]),
	options: z.array(z.object({
		description: z.string().optional(),
		id: z.string(),
		label: z.string(),
		style: z.string().optional()
	})).optional(),
	prompt: z.string(),
	requestId: z.string().min(1)
});
const v26ResponseSchema = z.object({
	optionId: z.string().optional(),
	requestId: z.string(),
	text: z.string().optional()
});
const inputRequestCallbackSchema = z.object({
	callId: z.string().min(1),
	childContinuationToken: z.string().min(1),
	childSessionId: z.string().min(1),
	childSessionInbox: z.object({ sessionId: z.string().min(1) }).strict().optional(),
	inputSource: z.string().min(1).optional(),
	remote: z.object({
		forwardPrincipal: z.boolean().optional(),
		name: z.string().min(1),
		resolverId: z.string().min(1).optional(),
		sessionId: z.string().min(1),
		url: z.string().url()
	}).strict().optional(),
	kind: z.literal(`subagent-input-request`),
	subagentName: z.string().min(1),
	event: z.object({
		...position,
		requests: z.array(v26RequestSchema).min(1),
		taskId: z.string().optional()
	})
});
const signInFields = {
	...position,
	attemptId: z.string().min(1).optional(),
	name: z.string(),
	principalId: z.string().optional(),
	taskId: z.string().optional()
};
const authorizationCallbackSchema = z.object({
	callId: z.string().min(1),
	childSessionId: z.string().min(1),
	kind: z.literal(`subagent-authorization-event`),
	subagentName: z.string().min(1),
	event: z.discriminatedUnion(`type`, [
		z.object({
			type: z.literal(`approval.candidate`),
			data: z.object({
				...position,
				candidateId: z.string(),
				outcome: z.enum([
					`pending`,
					`rejected`,
					`failed`,
					`timed-out`,
					`stale`
				]),
				reason: z.string().optional(),
				requestId: z.string().min(1),
				responderPrincipalId: z.string()
			}).passthrough()
		}),
		z.object({
			type: z.literal(`approval.settled`),
			data: z.object({
				...position,
				outcome: z.enum([`approved`, `cancelled`]),
				requestId: z.string().min(1),
				responderPrincipalId: z.string()
			}).passthrough()
		}),
		z.object({
			type: z.literal(`input.resolved`),
			data: z.object({
				...position,
				resolutions: z.array(z.object({
					kind: z.enum([
						`question`,
						`session-limit`,
						`tool-approval`
					]),
					outcome: z.enum([
						`answered`,
						`approved`,
						`cancelled`,
						`denied`,
						`ignored`,
						`invalid`
					]),
					requestId: z.string().min(1),
					response: v26ResponseSchema.optional()
				}).passthrough())
			}).passthrough()
		}),
		z.object({
			type: z.literal(`authorization.required`),
			data: z.object({
				...signInFields,
				description: z.string(),
				webhookUrl: z.string().optional()
			}).passthrough()
		}),
		z.object({
			type: z.literal(`authorization.completed`),
			data: z.object({
				...signInFields,
				outcome: z.enum([
					`authorized`,
					`declined`,
					`failed`,
					`timed-out`
				])
			}).passthrough()
		})
	])
});
function protocolTwoAnswersSettledOnForward(e) {
	return e.answers.filter(({ interactionId: t }) => t !== e.decidedHere && e.kindOf(t) !== `approval`);
}
function parseProtocolTwoInputCallback(e) {
	let t = inputRequestCallbackSchema.safeParse(e);
	if (t.success) return t.data;
	let n = authorizationCallbackSchema.safeParse(e);
	return n.success ? n.data : void 0;
}
function readProtocolTwoInputCallback(e) {
	let t = inputRequestCallbackSchema.safeParse(e);
	if (t.success) {
		let { data: e } = t;
		return {
			callId: e.callId,
			childSessionId: e.childSessionId,
			events: e.event.requests.map((t) => {
				let n = {
					interactionId: t.requestId,
					sessionId: e.childSessionId
				};
				return relayEvent(`interaction.opened`, {
					interactionId: t.requestId,
					origin: t.kind === `session-limit` ? n : {
						...n,
						call: {
							callId: t.action.callId,
							input: t.action.input,
							name: t.action.toolName
						}
					},
					request: v26InteractionRequest(t),
					subject: { turnId: e.event.turnId }
				});
			}),
			kind: `subagent-interaction`,
			route: {
				childContinuationToken: e.childContinuationToken,
				...e.childSessionInbox !== void 0 && { childSessionInbox: e.childSessionInbox },
				...e.inputSource !== void 0 && { inputSource: e.inputSource }
			},
			subagentName: e.subagentName
		};
	}
	let n = authorizationCallbackSchema.safeParse(e);
	if (!n.success) return;
	let { data: r } = n;
	return {
		callId: r.callId,
		childSessionId: r.childSessionId,
		events: authorizationEvents(r.childSessionId, r.event),
		kind: `subagent-interaction`,
		subagentName: r.subagentName
	};
}
function authorizationEvents(e, t) {
	switch (t.type) {
		case `approval.candidate`: {
			let { outcome: e, reason: n, requestId: r } = t.data;
			return e === `pending` ? [relayEvent(`response.admitted`, { interactionId: r })] : [relayEvent(`response.settled`, {
				interactionId: r,
				outcome: CANDIDATE_OUTCOMES[e],
				...n !== void 0 && { reason: n }
			})];
		}
		case `approval.settled`: return [];
		case `input.resolved`: return t.data.resolutions.map((e) => {
			let t = {};
			return e.response?.optionId !== void 0 && (t.optionId = e.response.optionId), e.response?.text !== void 0 && (t.text = e.response.text), relayEvent(`interaction.settled`, {
				interactionId: e.requestId,
				outcome: v26InteractionOutcome(e.outcome),
				...Object.keys(t).length > 0 && { response: t }
			});
		});
		case `authorization.required`: {
			let n = t.data.principalId;
			let r = signInId(e, t.data);
			return [relayEvent(`interaction.opened`, {
				...n !== void 0 && { audience: { principalIds: [n] } },
				interactionId: r,
				origin: {
					interactionId: r,
					sessionId: e
				},
				request: v26SignInRequest(t.data),
				subject: { turnId: t.data.turnId }
			})];
		}
		case `authorization.completed`: return [relayEvent(`interaction.settled`, {
			interactionId: signInId(e, t.data),
			outcome: v26SignInOutcome(t.data.outcome)
		})];
	}
}
const CANDIDATE_OUTCOMES = {
	failed: `failed`,
	rejected: `refused`,
	stale: `withdrawn`,
	"timed-out": `expired`
};
function signInId(e, t) {
	return t.attemptId ?? `signin_${e}_${encodeURIComponent(t.name)}_${t.principalId ?? ``}`;
}
// node_modules/eve/dist/src/tracing/eve/delegation.js
const transport = createAgentDelegationTransport();
const agentDelegation = {
	fetch: transport.fetch,
	resume(e, t) {
		let { context: n } = e;
		let r = n.trace.parentTraceContext;
		if (r === void 0) return t();
		let i = r.decision;
		return transport.resume({
			caller: r,
			conversationId: n.trace.conversationId ?? resolveConversationId(n.parent.rootSessionId),
			parentRunId: n.parent.sessionId,
			parentCallId: n.parent.callId,
			agentName: e.agentName,
			capture: {
				emit: r.traceFlags === 1 && i?.action !== `drop`,
				recordInputs: i?.action === `record` && i.recordInputs,
				recordOutputs: i?.action === `record` && i.recordOutputs
			}
		}, t);
	},
	receive(e, t) {
		return transport.receive(e.headers, (t) => e.delegated && e.trusted && e.parent !== void 0 && t.parentRunId === e.parent.sessionId && t.parentCallId === e.parent.callId && e.callerTrace?.traceId === t.caller.traceId && e.callerTrace.spanId === t.caller.spanId, (n) => {
			let r = e.parentTraceContext;
			let i = n?.capture.emit ? {
				action: `record`,
				recordInputs: n.capture.recordInputs,
				recordOutputs: n.capture.recordOutputs
			} : { action: `drop` };
			let a = n === void 0 || r === void 0 ? r : {
				...r,
				decision: r.decision === void 0 ? i : intersectInstrumentationDecisions(r.decision, i),
				traceFlags: n.capture.emit ? r.traceFlags : 0
			};
			return t({
				conversationId: e.delegated ? n?.conversationId ?? readConversationBaggage(e.headers.get(`baggage`)) : void 0,
				parentTraceContext: a
			});
		});
	}
};
export { PROTOCOL_TWO_INPUT_CALLBACK_KINDS, agentDelegation, callToolStubStep, callbackUrlForProtocol, createStubValidator, deliveryResponse, failStubSessionStep, findRemoteAgentBinding, formatEarlierRemoteChildStreamError, formatRemoteAgentProtocolMismatch, healthResponse, isLocalMachineAddress, isRemoteReplyHookToken, isSignInCallbackToken, parseProtocolTwoInputCallback, parseSessionCallback, protocolTwoAnswersSettledOnForward, publishStubFailureStep, publishStubResultStep, readCallbackProtocol, readMatchedStubRules, readProtocolTwoInputCallback, readRemoteAgentProtocolVersion, readStubFailure, readTrustedDevelopmentClientAddress, readTrustedDevelopmentPeer, remoteReplyHookToken, reportStubFailureStep, resolveOnMessage, resolveTurnClientContext, resolveVercelOidcCurrentProject, servesRemoteAgentCaller, sessionCommandErrorResponse, timingSafeEqualStrings, validateStubConstraint, withVercelOidcProjectResolver };

//# sourceMappingURL=eve66.mjs.map