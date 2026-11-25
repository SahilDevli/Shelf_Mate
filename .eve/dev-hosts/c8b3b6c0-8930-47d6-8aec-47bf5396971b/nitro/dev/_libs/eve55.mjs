// node_modules/eve/dist/src/tools/tool-label.js
function toolLabel(e, t) {
	if (typeof t != `string` && typeof t != `number`) return e;
	let n = String(t).trim();
	return n === `` ? e : `${e} ${n}`;
}
export { toolLabel };

//# sourceMappingURL=eve55.mjs.map