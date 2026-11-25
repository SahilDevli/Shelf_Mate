import { SessionAgentKey } from "./eve12.mjs";
import { createContextKey } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@opentelemetry/api/index.js";
import { activeTraceOperation } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/agent-runs/otel.js";
// node_modules/eve/dist/src/definitions/agent.js
async function sessionDefinitions(e) {
	return await sessionAgent(e).definitions();
}
function sessionAgent(e) {
	let t = e.get(SessionAgentKey);
	if (t === void 0) throw Error(`The session has no agent in its context.`);
	return t;
}
// node_modules/eve/dist/src/tracing/eve/agent-trace-context.js
const AGENT_TRACE_KEY = createContextKey(`eve.agent.trace`);
function isAgentTraceContext(e) {
	if (typeof e != `object` || !e) return !1;
	if (activeTraceOperation(e) !== void 0) return !0;
	let t = Reflect.get(e, `getValue`);
	return typeof t == `function` && Reflect.apply(t, e, [AGENT_TRACE_KEY]) === !0;
}
function markAgentTraceContext(e) {
	return e.setValue(AGENT_TRACE_KEY, !0);
}
export { isAgentTraceContext, markAgentTraceContext, sessionAgent, sessionDefinitions };

//# sourceMappingURL=eve52.mjs.map