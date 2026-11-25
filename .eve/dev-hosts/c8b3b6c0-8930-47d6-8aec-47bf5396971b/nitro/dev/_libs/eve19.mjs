import { defineJsonSchema } from "./eve18.mjs";
// node_modules/eve/dist/src/tools/framework/agent-contract.js
const SUBAGENT_TOOL_INPUT_SCHEMA = defineJsonSchema({
	type: `object`,
	properties: { message: {
		type: `string`,
		description: `The message to send to the agent, with everything it needs to do the work.`
	} },
	required: [`message`],
	additionalProperties: !1
});
export { SUBAGENT_TOOL_INPUT_SCHEMA };

//# sourceMappingURL=eve19.mjs.map