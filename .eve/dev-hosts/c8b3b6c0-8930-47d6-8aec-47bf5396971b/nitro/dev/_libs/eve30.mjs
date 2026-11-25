// node_modules/eve/dist/src/harness/turn-cancellation.js
const TURN_CANCELLED_ERROR_NAME = `TurnCancelledError`;
var TurnCancelledError = class extends Error {
	constructor(e = `The turn was cancelled.`) {
		super(e), this.name = TURN_CANCELLED_ERROR_NAME;
	}
};
var SessionLimitDeclinedError = class extends TurnCancelledError {
	constructor() {
		super(`The user declined a fresh session token budget.`);
	}
};
function isTurnCancellation(e) {
	let t = e;
	let n = /* @__PURE__ */ new Set();
	for (; typeof t == `object` && t && !n.has(t);) {
		if (n.add(t), t.name === TURN_CANCELLED_ERROR_NAME) return !0;
		t = t.cause;
	}
	return !1;
}
function throwIfTurnAborted(e) {
	if (e?.aborted === !0) throw isTurnCancellation(e.reason) ? e.reason : new TurnCancelledError();
}
// node_modules/eve/dist/src/instrumentation/memory.js
function createMemoryInstrumentation(e) {
	return { async execute(t, n) {
		let { hooks: r, rootSessionId: i, traceSessionId: a } = e.resolveContext();
		let o = {
			...t,
			rootSessionId: i,
			traceSessionId: a,
			sessionId: e.sessionId
		};
		await r.publish({
			...o,
			type: `memory.operation.started`
		});
		try {
			let t = await e.runInContext({
				...o,
				type: `memory.operation`
			}, n);
			return await r.publish({
				outcome: `completed`,
				...o,
				outputRecords: t.outputRecords,
				recordCount: t.recordCount,
				type: `memory.operation.settled`
			}), t.value;
		} catch (e) {
			throw await r.publish({
				outcome: `failed`,
				...o,
				error: e,
				type: `memory.operation.settled`
			}), e;
		}
	} };
}
async function instrumentMemoryOperation(e, t, n) {
	return e === void 0 ? (await n()).value : await e.execute(typeof t == `function` ? t() : t, n);
}
export { SessionLimitDeclinedError, TurnCancelledError, createMemoryInstrumentation, instrumentMemoryOperation, isTurnCancellation, throwIfTurnAborted };

//# sourceMappingURL=eve30.mjs.map