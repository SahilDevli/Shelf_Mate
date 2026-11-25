import { validateCompiledAgentManifest } from "./eve14.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { fromError } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/zod-validation-error/index.js";
// node_modules/eve/dist/src/runtime/compiled-artifacts-source.js
function createBundledRuntimeCompiledArtifactsSource(e) {
	return e === void 0 ? { kind: `bundled` } : {
		kind: `bundled`,
		sandboxScope: e
	};
}
function createDiskRuntimeCompiledArtifactsSource(e, t = {}) {
	return t.moduleMapLoaderPath !== void 0 || t.sandboxAppRoot !== void 0 || t.sandboxScope !== void 0 || t.durableReference !== void 0 ? {
		appRoot: e,
		durableReference: t.durableReference,
		kind: `disk`,
		moduleMapLoaderPath: t.moduleMapLoaderPath,
		sandboxAppRoot: t.sandboxAppRoot,
		sandboxScope: t.sandboxScope
	} : {
		appRoot: e,
		kind: `disk`
	};
}
function getRuntimeCompiledArtifactsSandboxAppRoot(e) {
	return e.kind === `disk` ? e.sandboxAppRoot ?? e.appRoot : void 0;
}
function getRuntimeCompiledArtifactsCacheKey(e) {
	return e.kind === `disk` ? e.moduleMapLoaderPath === void 0 ? `disk:${e.appRoot}` : `disk:${e.appRoot}:authored-source:${e.moduleMapLoaderPath}` : `bundled`;
}
// node_modules/eve/dist/src/runtime/loaders/artifact-paths.js
function resolveRuntimeCompilerArtifactPaths(e) {
	let t = normalizeFilesystemPath(e);
	let n = `${t}/.eve/discovery`;
	let r = `${t}/.eve/compile`;
	return {
		appRoot: t,
		compiledManifestPath: `${r}/compiled-agent-manifest.json`,
		compileDirectoryPath: r,
		compileMetadataPath: `${r}/compile-metadata.json`,
		diagnosticsPath: `${n}/diagnostics.json`,
		discoveryDirectoryPath: n,
		discoveryManifestPath: `${n}/agent-discovery-manifest.json`,
		modelMetadataPath: `${r}/model-metadata.json`,
		moduleMapPath: `${r}/module-map.mjs`,
		sandboxPreparedArtifactsPath: `${r}/sandbox-prepared-artifacts.json`
	};
}
function normalizeFilesystemPath(e) {
	let t = e.replaceAll(`\\`, `/`);
	return t === `/` ? t : t.replace(/\/+$/, ``);
}
// node_modules/eve/dist/src/runtime/sessions/runtime-session.js
function createRuntimeSession(e = `test-session`) {
	return {
		bundleCache: /* @__PURE__ */ new Map(),
		bundleCacheKeyBySourceKey: /* @__PURE__ */ new Map(),
		compiledArtifacts: null,
		describedAgents: /* @__PURE__ */ new Map(),
		id: e,
		skillFiles: null
	};
}
const RUNTIME_SESSION_STORAGE_GLOBAL_KEY = Symbol.for(`eve.runtime-session-storage`);
const RUNTIME_SESSION_DEFAULT_GLOBAL_KEY = Symbol.for(`eve.runtime-session-default`);
const globalContainer = globalThis;
globalContainer[RUNTIME_SESSION_STORAGE_GLOBAL_KEY] === void 0 && (globalContainer[RUNTIME_SESSION_STORAGE_GLOBAL_KEY] = new AsyncLocalStorage());
const runtimeSessionStorage = globalContainer[RUNTIME_SESSION_STORAGE_GLOBAL_KEY];
function resolveProcessDefaultSession() {
	return globalContainer[RUNTIME_SESSION_DEFAULT_GLOBAL_KEY] === void 0 && (globalContainer[RUNTIME_SESSION_DEFAULT_GLOBAL_KEY] = createRuntimeSession(`process-default`)), globalContainer[RUNTIME_SESSION_DEFAULT_GLOBAL_KEY];
}
function getActiveRuntimeSession() {
	return runtimeSessionStorage.getStore() ?? resolveProcessDefaultSession();
}
// node_modules/eve/dist/src/runtime/loaders/bundled-artifacts.js
function readBundledCompiledArtifacts() {
	return getActiveRuntimeSession().compiledArtifacts;
}
// node_modules/eve/dist/src/runtime/validation.js
function formatValidationError(e) {
	return fromError(e, { prefix: void 0 }).message;
}
// node_modules/eve/dist/src/runtime/loaders/manifest.js
const BUNDLED_MANIFEST_SOURCE = `bundled compiled manifest`;
var LoadCompiledManifestError = class extends Error {
	manifestPath;
	constructor(e, t) {
		super(e), this.name = `LoadCompiledManifestError`, t !== void 0 && (this.manifestPath = t);
	}
};
async function loadCompiledManifest(e) {
	let t = e.compiledArtifactsSource.kind === `disk` ? resolveRuntimeCompilerArtifactPaths(e.compiledArtifactsSource.appRoot).compiledManifestPath : void 0;
	if (t !== void 0) {
		let { readFile: e } = await import(`node:fs/promises`);
		let n;
		try {
			n = JSON.parse(await e(t, `utf8`));
		} catch (e) {
			throw new LoadCompiledManifestError(formatLoadErrorMessage(e), t);
		}
		return checkCompiledManifest(await parseCompiledManifest(n, t), t);
	}
	let n = readBundledCompiledArtifacts();
	if (n !== null) return checkCompiledManifest(n.manifest, BUNDLED_MANIFEST_SOURCE);
	throw new LoadCompiledManifestError(`Compiled manifest is unavailable without an app root or bundled compiled artifacts.`, BUNDLED_MANIFEST_SOURCE);
}
async function parseCompiledManifest(e, t) {
	let { compiledAgentManifestSchema: n } = await import("./_2.mjs");
	let r = n.safeParse(e);
	if (!r.success) throw new LoadCompiledManifestError(`Expected "${t}" to contain a valid compiled eve agent manifest. ${formatValidationError(r.error)}`, t);
	return r.data;
}
function checkCompiledManifest(e, t) {
	try {
		validateCompiledAgentManifest(e);
	} catch (e) {
		throw new LoadCompiledManifestError(`Expected "${t}" to contain a semantically valid compiled eve agent manifest. ${formatLoadErrorMessage(e)}`, t);
	}
	return e;
}
function formatLoadErrorMessage(e) {
	return e instanceof Error ? e.message : `Unknown manifest load failure.`;
}
export { createBundledRuntimeCompiledArtifactsSource, createDiskRuntimeCompiledArtifactsSource, formatValidationError, getActiveRuntimeSession, getRuntimeCompiledArtifactsCacheKey, getRuntimeCompiledArtifactsSandboxAppRoot, loadCompiledManifest, readBundledCompiledArtifacts, resolveRuntimeCompilerArtifactPaths };

//# sourceMappingURL=eve13.mjs.map