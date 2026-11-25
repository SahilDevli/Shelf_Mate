import { cause, conforming, envelopeOf, errorInfo, id, known } from "./eve26.mjs";
import { z } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/zod/index.js";
// node_modules/eve/dist/src/protocol/session-events/families/session.js
const traceContext = z.object({
	spanId: z.string(),
	traceFlags: z.number().int(),
	traceId: z.string()
});
const sessionStartedData = conforming()(z.object({
	parent: z.object({
		callId: id,
		sessionId: id
	}).optional(),
	predecessor: z.object({ sessionId: id }).optional(),
	runtime: z.object({
		agentId: z.string(),
		agentName: z.string().optional(),
		build: z.object({
			deployedAt: z.string().optional(),
			gitBranch: z.string().optional(),
			gitSha: z.string().optional()
		}).optional(),
		eveVersion: z.string()
	}).optional(),
	trace: traceContext.optional()
}));
const sessionEndedData = conforming()(z.object({
	cause: cause.optional(),
	error: errorInfo.optional(),
	outcome: known()
}));
const sessionSchemas = {
	"session.ended": envelopeOf(`session.ended`, sessionEndedData),
	"session.started": envelopeOf(`session.started`, sessionStartedData)
};
export { sessionSchemas, traceContext };

//# sourceMappingURL=eve71.mjs.map