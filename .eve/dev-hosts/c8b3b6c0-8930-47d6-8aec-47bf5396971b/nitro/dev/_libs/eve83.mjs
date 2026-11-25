import { stampToolDefinition } from "./eve44.mjs";
import { frameworkTool } from "./eve24.mjs";
import { SUBAGENT_TOOL_INPUT_SCHEMA } from "./eve19.mjs";
import { attachToolBehavior } from "./eve58.mjs";
// node_modules/eve/dist/src/tools/framework/agent.js
const agent = attachToolBehavior(frameworkTool(stampToolDefinition({
	description: "Delegate a focused subtask to a copy of yourself. Use it to isolate complex work or split a large task into independent pieces. Each call starts a task, so several agents can work at once: start every independent one before you wait. A new child has fresh history and state but reuses your tools and sandbox, so give parallel writers non-overlapping scopes. In message, state the goal, what to return, and whether it may change files.",
	inputSchema: SUBAGENT_TOOL_INPUT_SCHEMA,
	execute() {
		throw Error(`The framework "agent" tool was executed directly. It must be resolved through the runtime tool registry, which dispatches it to the shared subagent workflow.`);
	}
}, `defineTool`)), {
	availability: [`root-session`],
	handling: {
		action: `self-agent`,
		kind: `dispatch`
	}
});
export { agent };

//# sourceMappingURL=eve83.mjs.map