import "./eve20.mjs";
// node_modules/eve/dist/src/public/definitions/agent.js
const DEFINED_AGENT = Symbol.for(`eve.defined-agent`);
function defineAgent(e) {
	return Object.defineProperty(e, DEFINED_AGENT, {
		configurable: !0,
		value: !0
	}), e;
}
function isDefinedAgent(e) {
	return typeof e == `object` && !!e && Reflect.get(e, DEFINED_AGENT) === !0;
}
export { defineAgent, isDefinedAgent };

//# sourceMappingURL=eve62.mjs.map