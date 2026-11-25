import { cause, conforming, envelopeOf, id, jsonValue, known } from "./eve26.mjs";
import { z } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/zod/index.js";
// node_modules/eve/dist/src/protocol/session-events/families/interaction.js
const subject = conforming()(z.union([
	z.object({ callId: id }),
	z.object({ turnId: id }),
	z.object({ taskId: id }),
	z.object({ responseId: id })
]));
const interactionRequestSchema = conforming()(z.object({
	allowFreeform: z.boolean().optional(),
	display: known().optional(),
	initialOptionId: z.string().optional(),
	kind: known(),
	link: z.object({
		label: z.string().optional(),
		url: z.string()
	}).optional(),
	options: z.array(z.object({
		description: z.string().optional(),
		id: z.string(),
		label: z.string(),
		style: known().optional()
	})).optional(),
	prompt: z.string(),
	signIn: z.object({
		callbackUrl: z.string().optional(),
		displayName: z.string().optional(),
		expiresAt: z.string().optional(),
		grant: z.string().optional(),
		instructions: z.string().optional(),
		name: z.string(),
		principal: z.object({
			id: z.string().optional(),
			issuer: z.string().optional(),
			type: z.string()
		}).optional(),
		url: z.string().optional(),
		userCode: z.string().optional(),
		waitsOn: z.string().optional()
	}).optional(),
	title: z.string().optional()
}));
const interactionSchemas = {
	"interaction.opened": envelopeOf(`interaction.opened`, conforming()(z.object({
		audience: z.object({ principalIds: z.array(z.string()) }).optional(),
		interactionId: id,
		origin: z.object({
			call: z.object({
				callId: id,
				input: jsonValue.optional(),
				name: z.string()
			}).optional(),
			interactionId: id,
			sessionId: id
		}).optional(),
		request: interactionRequestSchema,
		subject
	}))),
	"interaction.settled": envelopeOf(`interaction.settled`, conforming()(z.object({
		cause: cause.optional(),
		interactionId: id,
		outcome: known(),
		reason: z.string().optional(),
		response: z.record(z.string(), jsonValue).optional()
	})))
};
export { interactionSchemas };

//# sourceMappingURL=eve73.mjs.map