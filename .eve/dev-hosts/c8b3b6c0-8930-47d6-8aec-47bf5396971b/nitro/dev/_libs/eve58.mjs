// node_modules/eve/dist/src/tools/behavior.js
const TOOL_BEHAVIOR = Symbol.for(`eve.tool-behavior`);
function attachToolBehavior(e, t) {
	return Object.defineProperty(e, TOOL_BEHAVIOR, {
		configurable: !1,
		enumerable: !1,
		value: t,
		writable: !1
	}), e;
}
export { attachToolBehavior };

//# sourceMappingURL=eve58.mjs.map