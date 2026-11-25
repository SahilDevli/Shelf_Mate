import "./eve2.mjs";
import "./eve11.mjs";
import { createBundledRuntimeCompiledArtifactsSource, createDiskRuntimeCompiledArtifactsSource, loadCompiledManifest, readBundledCompiledArtifacts } from "./eve13.mjs";
import "./eve14.mjs";
import "./eve32.mjs";
import { constants, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/jsonc-parser/index.js";
// node_modules/eve/dist/src/internal/materialized-authored-modules.js
const MATERIALIZED_MODULES_INDEX = `authored-modules.json`;
async function readMaterializedAuthoredModuleIndex(e) {
	let t = join(e, `.eve`, `compile`, MATERIALIZED_MODULES_INDEX);
	if (!existsSync(t)) return;
	let n = JSON.parse(await readFile(t, `utf8`));
	if (n.version !== 3 || typeof n.fingerprint != `string` || n.fingerprint.length === 0 || typeof n.moduleMap != `string` || n.moduleMap.length === 0 || !isMaterializedInstrumentation(n.instrumentation)) throw Error(`Invalid materialized authored module index at "${t}".`);
	return n;
}
function isMaterializedInstrumentation(e) {
	if (e === void 0) return !0;
	if (typeof e != `object` || !e) return !1;
	let t = e;
	if (t.kind === `directory`) {
		let e = t.modulePathsBySlot;
		return typeof e == `object` && !!e && Object.values(e).every((e) => typeof e == `string`);
	}
	return !1;
}
constants.COPYFILE_FICLONE;
// node_modules/eve/dist/src/internal/nitro/dev-runtime-artifacts.js
function readDevelopmentRuntimeArtifactsSnapshotRoot(e) {
	return readDevelopmentRuntimeArtifactsPointer(e)?.runtimeAppRoot;
}
function readDevelopmentRuntimeArtifactsPointer(e) {
	if (e !== void 0 && existsSync(e)) try {
		let t = JSON.parse(readFileSync(e, `utf8`));
		return t.kind === `eve-dev-runtime-artifacts-pointer` && t.version === 2 && typeof t.appRoot == `string` && typeof t.runtimeAppRoot == `string` && t.runtimeAppRoot.length > 0 && typeof t.snapshotRoot == `string` && t.snapshotRoot.length > 0 ? {
			appRoot: t.appRoot,
			kind: `eve-dev-runtime-artifacts-pointer`,
			runtimeAppRoot: t.runtimeAppRoot,
			snapshotRoot: t.snapshotRoot,
			version: 2
		} : void 0;
	} catch {
		return;
	}
}
// node_modules/eve/dist/src/internal/nitro/routes/runtime-artifacts.js
function resolveNitroCompiledArtifactsSource(e) {
	if (e.kind === `development`) {
		let t = readDevelopmentRuntimeArtifactsSnapshotRoot(e.devRuntimeArtifactsPointerPath) ?? e.appRoot;
		return createDiskRuntimeCompiledArtifactsSource(t, {
			durableReference: e.durableArtifactsReference,
			moduleMapLoaderPath: e.moduleMapLoaderPath,
			sandboxAppRoot: e.appRoot
		});
	}
	if (readBundledCompiledArtifacts() !== null) return createBundledRuntimeCompiledArtifactsSource(e.sandboxScope);
	throw Error(`eve Nitro production requires bundled artifacts.`);
}
// node_modules/eve/dist/src/runtime/schedules/register.js
var ScheduleRegistrationError = class extends Error {
	scheduleId;
	sourceId;
	taskName;
	constructor(e, t = {}) {
		super(e), this.name = `ScheduleRegistrationError`, t.scheduleId !== void 0 && (this.scheduleId = t.scheduleId), t.sourceId !== void 0 && (this.sourceId = t.sourceId), t.taskName !== void 0 && (this.taskName = t.taskName);
	}
};
function createScheduleRegistrations(e) {
	let t = e.map((e) => ({
		cron: e.cron,
		...e.timezone !== void 0 && { timezone: e.timezone },
		description: `Run eve schedule "${e.name}" from "${e.logicalPath}".`,
		logicalPath: e.logicalPath,
		scheduleId: e.name,
		sourceId: e.sourceId,
		taskName: createScheduleTaskName(e.sourceId)
	})).sort((e, t) => e.sourceId.localeCompare(t.sourceId));
	return assertUniqueScheduleIds(t), t;
}
function assertUniqueScheduleIds(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.scheduleId);
		if (e === void 0) t.set(n.scheduleId, n);
		else throw new ScheduleRegistrationError(`Duplicate authored schedule id "${n.scheduleId}" found in "${e.logicalPath}" and "${n.logicalPath}".`, {
			scheduleId: n.scheduleId,
			sourceId: n.sourceId,
			taskName: n.taskName
		});
	}
}
function createScheduleTaskName(e) {
	return `eve.schedule.${Buffer.from(e, `utf8`).toString(`base64url`)}`;
}
// node_modules/eve/dist/src/runtime/schedules/resolve-schedule.js
var ResolveScheduleError = class extends Error {
	taskName;
	constructor(e, t = {}) {
		super(e), this.name = `ResolveScheduleError`, t.taskName !== void 0 && (this.taskName = t.taskName);
	}
};
async function resolveSchedules(e) {
	return [...e.manifest.schedules].map((e) => {
		let t = {
			cron: e.cron,
			...e.timezone !== void 0 && { timezone: e.timezone },
			hasRun: e.hasRun,
			logicalPath: e.logicalPath,
			name: e.name,
			sourceId: e.sourceId,
			sourceKind: e.sourceKind
		};
		return e.markdown === void 0 ? t : {
			...t,
			markdown: e.markdown
		};
	});
}
async function loadResolvedCompiledSchedules(e) {
	return await resolveSchedules({ manifest: await loadCompiledManifest({ compiledArtifactsSource: e.compiledArtifactsSource }) });
}
async function loadResolvedCompiledScheduleByTaskName(e, t) {
	let n = await loadResolvedCompiledSchedules(t);
	let r = new Map(n.map((e) => [e.sourceId, e]));
	for (let t of createScheduleRegistrations(n)) if (t.taskName === e) {
		let e = r.get(t.sourceId);
		if (e !== void 0) return e;
	}
	throw new ResolveScheduleError(`No compiled authored schedule is registered for Nitro task "${e}".`, { taskName: e });
}
export { createScheduleRegistrations, loadResolvedCompiledScheduleByTaskName, loadResolvedCompiledSchedules, readMaterializedAuthoredModuleIndex, resolveNitroCompiledArtifactsSource, resolveSchedules };

//# sourceMappingURL=eve79.mjs.map