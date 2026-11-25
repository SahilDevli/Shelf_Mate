import { SandboxKey, SessionKey, loadContext } from "./eve7.mjs";
import { ConversationContextKey, emptyPreviews, readSessionSchedule } from "./eve8.mjs";
// node_modules/eve/dist/src/context/build-callback-context.js
function buildCallbackContext() {
	let e = loadContext();
	let t = e.require(SessionKey);
	let n = e.get(ConversationContextKey);
	return {
		session: {
			id: t.sessionId,
			auth: t.auth,
			turn: t.turn,
			parent: t.parent,
			schedule: readSessionSchedule(e),
			predecessor: t.predecessor
		},
		...n !== void 0 && { conversation: n },
		getSandbox: sandboxOf(e)
	};
}
function sandboxOf(e) {
	return ((t) => {
		let n = e.get(SandboxKey);
		if (n === void 0) throw Error(`eve sandbox runtime access is unavailable in the current async context. Call ctx.getSandbox() only from authored runtime functions such as tools, hooks, dynamic values, and channel events.`);
		if (t !== void 0 && n.environment !== t) throw Error(`The requested sandbox environment is not active for the current session.`);
		return n.get().then((e) => {
			if (e === null) throw Error(`The sandbox is not available in the current authored runtime context.`);
			return withRuntimeSandboxLifecycle(e, async (e) => {
				if (n.delete === void 0) throw Error(`The active sandbox runtime does not support deletion.`);
				await n.delete(e);
			}, async () => await n.stop());
		});
	});
}
function withRuntimeSandboxLifecycle(e, t, n) {
	return new Proxy(Object.create(null), {
		get(r, i) {
			if (i === `delete`) return t;
			if (i === `stop`) return n;
			let a = Reflect.get(e, i, e);
			return typeof a == `function` ? a.bind(e) : a;
		},
		getOwnPropertyDescriptor(t, n) {
			if (n === `delete` || n === `stop`) return {
				configurable: !0,
				enumerable: !0,
				writable: !1
			};
			let r = Reflect.getOwnPropertyDescriptor(e, n);
			return r === void 0 ? void 0 : {
				...r,
				configurable: !0
			};
		},
		has(t, n) {
			return n === `delete` || n === `stop` || Reflect.has(e, n);
		},
		ownKeys() {
			return [.../* @__PURE__ */ new Set([
				...Reflect.ownKeys(e),
				`delete`,
				`stop`
			])];
		}
	});
}
// node_modules/eve/dist/src/protocol/session-projection/session-view.js
const KEY = Symbol.for(`eve.session-view-registry.v1`);
const snapshots = globalThis[KEY] ??= /* @__PURE__ */ new WeakMap();
const immutableRows = /* @__PURE__ */ new WeakMap();
function immutable(e) {
	if (typeof e != `object` || !e) return e;
	let t = immutableRows.get(e);
	if (t !== void 0) return t;
	let n = structuredClone(e);
	let r = [n];
	let i = /* @__PURE__ */ new Set();
	for (; r.length > 0;) {
		let e = r.pop();
		if (!i.has(e)) {
			i.add(e);
			for (let t of Object.values(e)) typeof t == `object` && t && r.push(t);
			Object.freeze(e);
		}
	}
	return immutableRows.set(e, n), immutableRows.set(n, n), n;
}
function table(e) {
	return Object.freeze(Object.fromEntries(Object.entries(e).map(([e, t]) => [e, immutable(t)])));
}
function snapshotOf(e, t = emptyPreviews(), n = []) {
	let r = Object.freeze({});
	return snapshots.set(r, {
		tables: Object.freeze({
			position: e.position,
			session: immutable(e.session),
			calls: table(e.calls),
			changes: table(e.changes),
			children: table(e.children),
			deliveries: table(e.deliveries),
			interactions: table(e.interactions),
			parts: table(e.parts),
			responses: table(e.responses),
			runs: table(e.runs),
			tasks: table(e.tasks),
			turns: table(e.turns),
			usage: immutable(e.usage),
			selection: immutable(e.selection)
		}),
		previews: Object.freeze({
			calls: table(t.calls),
			parts: table(t.parts)
		}),
		pending: immutable(n)
	}), r;
}
function snapshotState(e) {
	let t = snapshots.get(e);
	if (t === void 0) throw TypeError(`Invalid SessionView. Use emptySessionView() or a snapshot supplied by eve.`);
	return t;
}
function sessionTables(e) {
	return snapshotState(e).tables;
}
export { buildCallbackContext, sandboxOf, sessionTables, snapshotOf, withRuntimeSandboxLifecycle };

//# sourceMappingURL=eve50.mjs.map