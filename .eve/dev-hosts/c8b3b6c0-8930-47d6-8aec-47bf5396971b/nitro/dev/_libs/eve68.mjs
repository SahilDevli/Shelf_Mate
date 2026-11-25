import { createLogger } from "./eve4.mjs";
import { getKnownByteLength } from "./eve69.mjs";
// node_modules/eve/dist/src/internal/nitro/routes/channel-route-context.js
const agentInfoRouteResponseKey = `__eveAgentInfoRouteResponse`;
const homeRouteMetadataKey = `__eveHomeRouteMetadata`;
const routeChannelNameKey = `__eveRouteChannelName`;
const remoteAgentStreamHeadersResolverKey = `__eveRemoteAgentStreamHeadersResolver`;
const routeSessionCreatorKey = `__eveRouteSessionCreator`;
const skillFileSourceKey = `__eveSkillFileSource`;
function attachRouteChannelName(e, t) {
	let n = e;
	return n[routeChannelNameKey] = t, e;
}
function attachAgentInfoRouteResponse(e, t) {
	let n = e;
	return n[agentInfoRouteResponseKey] = t, e;
}
function readAgentInfoRouteResponse(e) {
	return e[agentInfoRouteResponseKey];
}
function attachHomeRouteMetadata(e, t) {
	let n = e;
	return n[homeRouteMetadataKey] = t, e;
}
function readHomeRouteMetadata(e) {
	return e[homeRouteMetadataKey];
}
function attachRouteSessionCreator(e, t) {
	let n = e;
	return n[routeSessionCreatorKey] = t, e;
}
function readRouteSessionCreator(e) {
	return e[routeSessionCreatorKey];
}
function attachRemoteAgentStreamHeadersResolver(e, t) {
	let n = e;
	return n[remoteAgentStreamHeadersResolverKey] = t, e;
}
function readRemoteAgentStreamHeadersResolver(e) {
	return e[remoteAgentStreamHeadersResolverKey];
}
function attachSkillFileSource(e, t) {
	let n = e;
	return n[skillFileSourceKey] = t, e;
}
// node_modules/eve/dist/src/public/channels/upload-policy.js
const DEFAULT_UPLOAD_POLICY = Object.freeze({
	allowedMediaTypes: `*`,
	maxBytes: 26214400
});
function mergeUploadPolicy(e, t = DEFAULT_UPLOAD_POLICY) {
	if (e === `disabled`) return `disabled`;
	if (e === void 0) return t;
	let n = e.maxBytes ?? t.maxBytes;
	let r = e.allowedMediaTypes ?? t.allowedMediaTypes;
	if (n < 0 || !Number.isFinite(n)) throw RangeError(`UploadPolicy.maxBytes must be a non-negative finite number. Received: ${String(n)}.`);
	return {
		allowedMediaTypes: r,
		maxBytes: n
	};
}
function isMediaTypeAllowed(e, t) {
	if (t === `disabled`) return !1;
	if (t.allowedMediaTypes === `*`) return !0;
	let n = e.toLowerCase();
	for (let e of t.allowedMediaTypes) {
		let t = e.toLowerCase();
		if (t === n) return !0;
		if (t.endsWith(`/*`)) {
			let e = t.slice(0, -1);
			if (n.startsWith(e)) return !0;
		}
	}
	return !1;
}
function evaluateFilePart(e, t) {
	if (t === `disabled` || !isMediaTypeAllowed(e.mediaType, t)) {
		let n = {
			allowedMediaTypes: t === `disabled` || t.allowedMediaTypes === `*` ? [] : [...t.allowedMediaTypes],
			kind: `disallowed-media-type`,
			mediaType: e.mediaType
		};
		return e.filename === void 0 ? n : {
			...n,
			filename: e.filename
		};
	}
	let n = getKnownByteLength(e.data);
	if (n !== null && n > t.maxBytes) {
		let r = {
			byteLength: n,
			kind: `too-large`,
			limit: t.maxBytes,
			mediaType: e.mediaType
		};
		return e.filename === void 0 ? r : {
			...r,
			filename: e.filename
		};
	}
	return null;
}
function collectUploadPolicyViolations(e, t) {
	if (typeof e == `string`) return [];
	let n = [];
	for (let r of e) {
		if (r.type !== `file`) continue;
		let e = evaluateFilePart(r, t);
		e !== null && n.push(e);
	}
	return n;
}
function formatUploadPolicyViolation(e) {
	let t = e.filename ?? e.mediaType;
	if (e.kind === `too-large`) return `${t} (${e.byteLength} bytes) exceeds the ${e.limit}-byte upload limit.`;
	let n = e.allowedMediaTypes.length > 0 ? ` Allowed: ${e.allowedMediaTypes.join(`, `)}.` : ``;
	return `${t} has media type "${e.mediaType}" which is not allowed by this route.${n}`;
}
// node_modules/eve/dist/src/channel/background-work.js
const log = createLogger(`channel.background-work`);
function createBackgroundWork(e = {}) {
	let t = [];
	let n = !1;
	return {
		waitUntilFor: (r) => (i) => {
			let a = {
				eventType: r,
				settled: !1
			};
			let o = Promise.resolve(i).then(() => {
				a.settled = !0;
			}, (t) => {
				a.settled = !0, log.error(`a channel event handler's waitUntil work failed`, {
					...e,
					eventType: r,
					error: t
				});
			});
			n ? log.warn(`a channel event handler called waitUntil after its step ended; eve won't wait for it`, {
				...e,
				eventType: r
			}) : t.push({
				work: a,
				done: o
			});
		},
		async settle(n = 3e4) {
			if (t.length === 0) return !1;
			let r;
			let i = new Promise((e) => {
				r = setTimeout(() => e(`expired`), n);
			});
			try {
				for (; t.length > 0;) {
					let r = t;
					if (t = [], await Promise.race([Promise.all(r.map(({ done: e }) => e)), i]) !== `expired`) continue;
					let a = [...r, ...t].filter(({ work: e }) => !e.settled);
					t = [], log.warn(`channel event handlers' waitUntil work didn't settle in time; the step goes on without it`, {
						...e,
						eventTypes: [...new Set(a.map(({ work: e }) => e.eventType))],
						timeoutMs: n
					});
					break;
				}
			} finally {
				clearTimeout(r);
			}
			return !0;
		},
		close() {
			n = !0;
		}
	};
}
export { DEFAULT_UPLOAD_POLICY, attachAgentInfoRouteResponse, attachHomeRouteMetadata, attachRemoteAgentStreamHeadersResolver, attachRouteChannelName, attachRouteSessionCreator, attachSkillFileSource, collectUploadPolicyViolations, createBackgroundWork, formatUploadPolicyViolation, isMediaTypeAllowed, mergeUploadPolicy, readAgentInfoRouteResponse, readHomeRouteMetadata, readRemoteAgentStreamHeadersResolver, readRouteSessionCreator };

//# sourceMappingURL=eve68.mjs.map