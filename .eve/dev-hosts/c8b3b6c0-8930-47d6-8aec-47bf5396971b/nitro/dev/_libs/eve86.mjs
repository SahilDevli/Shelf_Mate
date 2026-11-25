import { ContextKey } from "./eve7.mjs";
import { resolveSandboxModelPath } from "./eve61.mjs";
import { posix } from "node:path";
import { createHash } from "node:crypto";
// node_modules/eve/dist/src/execution/tools/file-state.js
const ReadFileStateKey = new ContextKey(`eve.readFile`);
function normalizeModelPath(e) {
	return posix.normalize(e);
}
function buildReadFileTargetKey(e) {
	return e;
}
function createReadFileStamp(e) {
	let t = createHash(`sha256`).update(e.content, `utf8`).digest(`hex`);
	return {
		byteLength: Buffer.byteLength(e.content, `utf8`),
		contentHash: t,
		filePath: e.filePath
	};
}
function setReadFileStamp(e, t, n) {
	let r = e.ensure(ReadFileStateKey, () => ({ byTarget: {} }));
	e.set(ReadFileStateKey, { byTarget: {
		...r.byTarget,
		[t]: n
	} });
}
// node_modules/eve/dist/src/execution/sandbox/require-sandbox.js
async function resolveAbsoluteFilePath(e, t) {
	let n = await resolveSandboxModelPath({
		path: t,
		sandbox: e
	});
	if (n === `$HOME` || n.startsWith(`$HOME/`)) throw Error(`Cannot resolve "${t}": the sandbox has no usable $HOME. Use an absolute path or a path relative to the workspace root.`);
	return e.resolvePath(n);
}
export { ReadFileStateKey, buildReadFileTargetKey, createReadFileStamp, normalizeModelPath, resolveAbsoluteFilePath, setReadFileStamp };

//# sourceMappingURL=eve86.mjs.map