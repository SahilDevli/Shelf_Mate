import { createLogger } from "./eve4.mjs";
import { ScheduleDispatcher, expectScheduleRun, getCompiledRuntimeAgentBundle, loadResolvedModuleExport } from "./eve12.mjs";
import { createWorkflowRuntime } from "./eve81.mjs";
import { loadResolvedCompiledScheduleByTaskName } from "./eve79.mjs";
createLogger(`schedule.dispatch`);
async function dispatchScheduleTaskFromArtifacts(e, t) {
	let n = await loadResolvedCompiledScheduleByTaskName(e, { compiledArtifactsSource: t });
	let r = await getCompiledRuntimeAgentBundle({ compiledArtifactsSource: t });
	let i = createWorkflowRuntime({ compiledArtifactsSource: t });
	let a = new ScheduleDispatcher({
		runtime: i,
		channels: r.graph.root.channels
	});
	let o = { scheduleId: n.name };
	n.hasRun && (o.run = await loadScheduleRun(n, r.moduleMap)), n.markdown !== void 0 && (o.markdown = n.markdown);
	let s = await a.trigger(o);
	return s.waitUntilTasks.length > 0 && await Promise.allSettled(s.waitUntilTasks), {
		scheduleId: n.name,
		sessionIds: s.sessions.map((e) => e.sessionId)
	};
}
async function loadScheduleRun(e, t) {
	if (e.sourceKind !== `module`) throw Error(`Schedule "${e.name}" claims hasRun but is not a module-backed schedule.`);
	let n = e;
	let r = await loadResolvedModuleExport({
		definition: {
			exportName: n.exportName,
			logicalPath: n.logicalPath,
			sourceId: n.sourceId
		},
		kindLabel: `schedule`,
		moduleMap: t,
		nodeId: void 0
	});
	return expectScheduleRun(r, n.logicalPath, n.exportName);
}
export { dispatchScheduleTaskFromArtifacts };

//# sourceMappingURL=eve80.mjs.map