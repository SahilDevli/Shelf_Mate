import { resolveWebsocketHooks, useNitroApp, useNitroHooks } from "./task.mjs";
import { FastResponse } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/srvx/dist/adapters/node.mjs";
// node_modules/nitro/dist/runtime/internal/polyfills/fast-response.mjs
if (globalThis.Response !== FastResponse) globalThis.Response = FastResponse;
// #nitro/virtual/server-entry
const serverEntryOptions = {};
// #nitro/virtual/tracing
const tracingSrvxPlugins = [];
// node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
// node_modules/nitro/dist/presets/_nitro/runtime/nitro-dev.mjs
const nitroApp = useNitroApp();
const nitroHooks = useNitroHooks();
trapUnhandledErrors();
var nitro_dev_default = {
	...serverEntryOptions,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins],
	websocket: { resolve: resolveWebsocketHooks },
	ipc: { onClose: () => nitroHooks.callHook("close") }
};
export { nitro_dev_default as default };

//# sourceMappingURL=nitro-dev.mjs.map