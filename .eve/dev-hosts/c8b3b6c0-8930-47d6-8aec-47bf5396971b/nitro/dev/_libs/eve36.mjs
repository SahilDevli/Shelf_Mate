import { parseJsonObject, parseJsonValue } from "./eve10.mjs";
import { z } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/zod/index.js";
// node_modules/eve/dist/src/shared/json-schemas.js
const jsonValueSchema = z.unknown().transform((e, t) => {
	try {
		return parseJsonValue(e);
	} catch (e) {
		return t.addIssue({
			code: `custom`,
			message: formatJsonParseError(e, `Expected a JSON-serializable value.`)
		}), z.NEVER;
	}
});
const jsonObjectSchema = z.unknown().transform((e, t) => {
	try {
		return parseJsonObject(e);
	} catch (e) {
		return t.addIssue({
			code: `custom`,
			message: formatJsonParseError(e, `Expected a JSON-serializable object.`)
		}), z.NEVER;
	}
});
function formatJsonParseError(e, t) {
	return e instanceof Error ? e.message : t;
}
export { jsonObjectSchema, jsonValueSchema };

//# sourceMappingURL=eve36.mjs.map