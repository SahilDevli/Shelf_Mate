import { isErrnoCode } from "./eve3.mjs";
import { rename } from "node:fs/promises";
// node_modules/eve/dist/src/shared/rename-with-retry.js
const TRANSIENT_RENAME_RETRY_DELAYS_MS = [
	10,
	20,
	40,
	80,
	160,
	320,
	640
];
async function renameWithTransientBusyRetry(e, t) {
	for (let n of TRANSIENT_RENAME_RETRY_DELAYS_MS) try {
		await rename(e, t);
		return;
	} catch (e) {
		if (!isTransientRenameError(e)) throw e;
		await new Promise((e) => setTimeout(e, n));
	}
	await rename(e, t);
}
function isTransientRenameError(e) {
	return isErrnoCode(e, `EPERM`) || isErrnoCode(e, `EACCES`) || isErrnoCode(e, `EBUSY`);
}
export { renameWithTransientBusyRetry };

//# sourceMappingURL=eve32.mjs.map