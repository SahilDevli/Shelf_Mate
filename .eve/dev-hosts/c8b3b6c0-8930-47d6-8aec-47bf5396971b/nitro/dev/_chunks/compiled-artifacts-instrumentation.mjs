import { finalizeInstrumentationProviders, seedInstrumentationProviders, shutdownInstrumentationProviders } from "../_libs/eve31.mjs";
// .eve/dev-hosts/c8b3b6c0-8930-47d6-8aec-47bf5396971b/artifacts/compiled-artifacts-instrumentation.mjs
seedInstrumentationProviders();
finalizeInstrumentationProviders({ serviceName: "shelfmate-bot" });
function installInstrumentationPlugin(nitroApp) {
	nitroApp?.hooks?.hook("close", async () => {
		await shutdownInstrumentationProviders();
	});
}
export { installInstrumentationPlugin };

//# sourceMappingURL=compiled-artifacts-instrumentation.mjs.map