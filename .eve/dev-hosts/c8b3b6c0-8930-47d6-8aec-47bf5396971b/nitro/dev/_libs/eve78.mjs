import { isEveDevEnvironment } from "./eve11.mjs";
import { MODEL_HELPERS, developmentModelBrokerAvailable, readDevelopmentModelCredential, resolveGatewayModelCredential } from "./eve38.mjs";
import { isErrnoCode, isObject } from "./eve3.mjs";
import { resolveInstalledPackageInfo } from "./eve2.mjs";
import { compiledOf } from "./eve14.mjs";
import { loadCompiledManifest } from "./eve13.mjs";
import { resolveNitroCompiledArtifactsSource, resolveSchedules } from "./eve79.mjs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, rm, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { setTimeout } from "node:timers/promises";
import { secrets } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/just-secrets/index.js";
import { spawn } from "node:child_process";
import { getVercelOidcToken } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/oidc/index.js";
import { decodeJwt } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/jose/index.js";
import { createInterface } from "node:readline";
MODEL_HELPERS.chatgpt.defaultModel;
function isChatGptModelRouting(e) {
	return e?.kind === `external` && e.provider === `codex`;
}
// node_modules/eve/dist/src/internal/resolve-model-endpoint-status.js
function hasEnvValue(e) {
	return e !== void 0 && e.trim().length > 0;
}
function resolveGatewayCredential(e) {
	let t = e.apiKeyFile === void 0 ? e.apiKeyInEnv === !0 ? { kind: `shell` } : void 0 : {
		kind: `env-file`,
		path: e.apiKeyFile
	};
	let n = e.oidcFile !== void 0 || e.oidcAvailable === !0;
	if (t !== void 0) return {
		credential: `api-key`,
		source: t
	};
	if (n) return e.oidcFile === void 0 ? { credential: `oidc` } : {
		credential: `oidc`,
		file: e.oidcFile
	};
}
function resolveModelEndpointStatus(e, t, n) {
	if (e.kind === `external`) return isChatGptModelRouting(e) && n !== void 0 ? {
		kind: `chatgpt`,
		...n
	} : {
		kind: `external`,
		provider: e.provider
	};
	if (t.account) return {
		kind: `gateway`,
		connected: !0,
		credential: `oauth`,
		team: t.team
	};
	let r = resolveGatewayCredential({
		apiKeyInEnv: t.apiKey,
		oidcAvailable: t.oidc
	});
	return r === void 0 ? {
		kind: `gateway`,
		connected: !1
	} : {
		kind: `gateway`,
		connected: !0,
		credential: r.credential
	};
}
// node_modules/eve/dist/src/public/models/openai/chatgpt/auth.js
function readCodexJwtExpirationMs(e) {
	let t = parseCodexJwtClaims(e);
	if (t !== void 0 && typeof t.exp == `number`) return t.exp * 1e3;
}
function extractCodexAccountIdFromToken(e) {
	let t = parseCodexJwtClaims(e);
	if (t === void 0) return;
	let n = t[`https://api.openai.com/auth`];
	let r = t.organizations;
	return readNonEmptyString(t.chatgpt_account_id) ?? readNonEmptyString(isObject(n) ? n.chatgpt_account_id : void 0) ?? readNonEmptyString(Array.isArray(r) && isObject(r[0]) ? r[0].id : void 0);
}
function extractCodexAccountLabelFromToken(e) {
	let t = parseCodexJwtClaims(e);
	if (t === void 0) return;
	let n = t[`https://api.openai.com/auth`];
	let r = readEmail(t.email) ?? readEmail(isObject(n) ? n.email : void 0);
	if (r !== void 0) return r;
	let i = readNonEmptyString(t.sub);
	return i === void 0 ? void 0 : readEmail(i.split(`|`).at(-1));
}
function readEmail(e) {
	let t = readNonEmptyString(e);
	return t !== void 0 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/u.test(t) ? t : void 0;
}
function readNonEmptyString(e) {
	return typeof e == `string` && e.trim() !== `` ? e : void 0;
}
function parseCodexJwtClaims(e) {
	if (e !== void 0) try {
		return decodeJwt(e);
	} catch {
		return;
	}
}
var ChatGptSignInRequiredError = class extends Error {
	constructor() {
		super(`ChatGPT subscription login expired or was revoked. Open \`/model\` in \`eve dev\` and select ChatGPT subscription to sign in.`);
	}
};
async function requestChatGptTokens(e, t = {}) {
	let n = AbortSignal.any([AbortSignal.timeout(3e4), ...t.signal ? [t.signal] : []]);
	let r;
	try {
		r = await (t.fetch ?? fetch)(`https://auth.openai.com/oauth/token`, {
			method: `POST`,
			headers: { "content-type": `application/x-www-form-urlencoded` },
			body: new URLSearchParams({
				client_id: "app_EMoamEEZ73f0CkXaXp7hrann",
				...e
			}),
			signal: n,
			redirect: `error`
		});
	} catch {
		throw t.signal?.throwIfAborted(), Error(`Could not reach ChatGPT authentication. Check your connection and retry.`);
	}
	if (!r.ok) throw t.previous && [
		400,
		401,
		403
	].includes(r.status) ? new ChatGptSignInRequiredError() : Error(`ChatGPT authentication failed (HTTP ${r.status}). Retry sign-in from /login.`);
	let i = await readChatGptAuthResponse(r);
	let a = isObject(i) && typeof i.access_token == `string` ? i.access_token : void 0;
	let o = isObject(i) && typeof i.refresh_token == `string` ? i.refresh_token : t.previous?.refreshToken;
	if (!a || !o || !isObject(i)) throw Error(`ChatGPT authentication did not return a usable session. Retry sign-in from /login.`);
	let s = typeof i.id_token == `string` ? i.id_token : void 0;
	let c = extractCodexAccountIdFromToken(s) ?? extractCodexAccountIdFromToken(a) ?? t.previous?.accountId;
	let l = extractCodexAccountLabelFromToken(s) ?? extractCodexAccountLabelFromToken(a) ?? t.previous?.accountLabel;
	let u = (t.now ?? Date.now)();
	let d = typeof i.expires_in == `number` && Number.isFinite(i.expires_in) && i.expires_in > 0 ? u + i.expires_in * 1e3 : readCodexJwtExpirationMs(a) ?? u + 36e5;
	if (!Number.isFinite(d) || d <= u) throw Error(`ChatGPT authentication returned an expired session. Retry sign-in from /login.`);
	return {
		accessToken: a,
		refreshToken: o,
		expiresAt: d,
		...c && { accountId: c },
		...l && { accountLabel: l }
	};
}
async function readChatGptAuthResponse(e) {
	let t = e.body?.getReader();
	if (!t) throw Error(`ChatGPT authentication returned an empty response. Retry from /login.`);
	try {
		let e = [];
		let n = 0;
		for (;;) {
			let { value: r, done: i } = await t.read();
			if (i) break;
			if (n += r.byteLength, n > 65536) throw Error(`Response too large.`);
			e.push(r);
		}
		return JSON.parse(Buffer.concat(e).toString(`utf8`));
	} catch {
		throw await t.cancel().catch(() => {}), Error(`ChatGPT authentication returned an invalid response. Retry from /login.`);
	} finally {
		t.releaseLock();
	}
}
// node_modules/eve/dist/src/public/models/openai/chatgpt/token.js
var ChatGptSignedOutError = class extends Error {};
function isChatGptTokenFresh(e, t) {
	return e !== void 0 && (e.expiresAt === void 0 || e.expiresAt - 3e5 > t);
}
// node_modules/eve/dist/src/public/models/openai/chatgpt/credential-store.js
const SECRET_ID = {
	service: `eve`,
	name: `chatgpt`
};
const MAX_SECRET_BYTES = 2560;
var ChatGptInvalidStoredSessionError = class extends Error {
	constructor() {
		super(`The ChatGPT session in the OS secret store is invalid. Sign in again from /login to replace it.`);
	}
};
function createChatGptCredentialStore(e = join(homedir(), `.eve`, `auth`, `chatgpt.json`), t = secrets) {
	let n;
	async function removeLegacyFile() {
		try {
			await rm(e, { force: !0 });
		} catch {
			throw Error(`ChatGPT credentials are stored securely, but the old plaintext session could not be removed. Stop older eve processes, remove ~/.eve/auth/chatgpt.json, and retry.`);
		}
	}
	async function load() {
		let e;
		try {
			e = await t.get(SECRET_ID);
		} catch {
			throw secretStoreError();
		}
		if (e === null) {
			n = void 0;
			return;
		}
		let r;
		try {
			if (Buffer.byteLength(e) > MAX_SECRET_BYTES) throw Error();
			r = JSON.parse(e);
		} catch {
			throw new ChatGptInvalidStoredSessionError();
		}
		if (!isObject(r) || typeof r.sessionId != `string` || !r.sessionId || typeof r.refreshToken != `string` || !r.refreshToken) throw new ChatGptInvalidStoredSessionError();
		let i = {
			refreshToken: r.refreshToken,
			...typeof r.accountId == `string` && { accountId: r.accountId },
			...typeof r.accountLabel == `string` && { accountLabel: r.accountLabel }
		};
		let a = n?.sessionId === r.sessionId ? {
			...i,
			accessToken: n.credentials.accessToken,
			expiresAt: n.credentials.expiresAt
		} : i;
		return await removeLegacyFile(), {
			sessionId: r.sessionId,
			credentials: a
		};
	}
	let r = {
		async read() {
			return (await load())?.credentials;
		},
		async resolveToken(e) {
			let t = await r.read();
			if (!t) throw e.forceRefresh ? new ChatGptSignInRequiredError() : new ChatGptSignedOutError(`ChatGPT subscription is not signed in. Open \`/model\` in \`eve dev\` and select ChatGPT subscription to sign in.`);
			let n = tokenFromCredentials(t)?.token;
			(e.forceRefresh || !isChatGptTokenFresh(tokenFromCredentials(t), e.now())) && (t = await r.update(async (t) => {
				if (!t) throw new ChatGptSignInRequiredError();
				return `accessToken` in t && isChatGptTokenFresh(tokenFromCredentials(t), e.now()) && (!e.forceRefresh || t.accessToken !== n) ? t : requestChatGptTokens({
					grant_type: `refresh_token`,
					refresh_token: t.refreshToken
				}, {
					fetch: e.fetch,
					previous: t,
					now: e.now
				});
			}));
			let i = tokenFromCredentials(t);
			if (!i) throw Error(`ChatGPT access token is unavailable. Open \`/model\` in \`eve dev\` and select ChatGPT subscription to sign in.`);
			return i;
		},
		async update(r, i) {
			await mkdir(dirname(e), {
				recursive: !0,
				mode: 448
			});
			let a = `${e}.lock`;
			let o = Date.now() + 35e3;
			for (;;) try {
				await mkdir(a, { mode: 448 });
				break;
			} catch (e) {
				if (!isErrnoCode(e, `EEXIST`)) throw e;
				let t = await stat(a).catch((e) => {
					if (!isErrnoCode(e, `ENOENT`)) throw e;
				});
				if (t && Date.now() - t.mtimeMs > 6e5) {
					await rm(a, {
						recursive: !0,
						force: !0
					});
					continue;
				}
				if (Date.now() >= o) throw Error(`Another eve process is updating the ChatGPT session. Retry shortly.`);
				await setTimeout(100);
			}
			try {
				let e = i?.replace ? void 0 : await load();
				let a = await r(e?.credentials);
				let o = e?.sessionId ?? randomUUID();
				let s = JSON.stringify({
					sessionId: o,
					refreshToken: a.refreshToken,
					...a.accountId && { accountId: a.accountId },
					...a.accountLabel && { accountLabel: a.accountLabel }
				});
				if (Buffer.byteLength(s) > MAX_SECRET_BYTES) throw Error(`The ChatGPT refresh session exceeds the OS secret store's 2,560-byte limit. Use an API-key model instead.`);
				try {
					await t.set({
						...SECRET_ID,
						value: s
					});
				} catch {
					throw secretStoreError();
				}
				return n = {
					sessionId: o,
					credentials: a
				}, await removeLegacyFile(), a;
			} finally {
				await rm(a, {
					recursive: !0,
					force: !0
				});
			}
		}
	};
	return r;
}
let defaultStore;
function getDefaultChatGptCredentialStore() {
	return defaultStore ??= createChatGptCredentialStore();
}
function tokenFromCredentials(e) {
	if (`accessToken` in e) return {
		token: e.accessToken,
		expiresAt: e.expiresAt,
		...e.accountId && { accountId: e.accountId },
		...e.accountLabel && { accountLabel: e.accountLabel }
	};
}
function secretStoreError() {
	let e = process.platform === `linux` ? `Install libsecret-tools and start or unlock a Secret Service keyring with a session D-Bus. Headless sessions may need an API-key model.` : process.platform === `win32` ? `Allow Windows PowerShell and Credential Manager access in your user session.` : `Unlock your login keychain and allow credential access.`;
	return Error(`Could not access ChatGPT credentials in the OS secret store. ${e} Retry from /login.`);
}
// node_modules/eve/dist/src/public/models/openai/chatgpt/codex-app-server.js
var CodexBinaryNotFoundError = class extends Error {
	constructor(e) {
		super("The `codex` CLI was not found.", { cause: e }), this.name = `CodexBinaryNotFoundError`;
	}
};
var CodexAppServerClient = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e = {}) {
		this.#e = e.command ?? `codex`, this.#t = e.env, this.#n = e.spawnProcess ?? spawnCodexAppServer;
	}
	async resolveToken(e) {
		let t = await this.#i(e.forceRefresh);
		if (t.authMethod !== `chatgpt` || t.authToken === void 0) throw e.forceRefresh ? new ChatGptSignInRequiredError() : new ChatGptSignedOutError("ChatGPT subscription is not signed in to Codex. Run `codex login` or sign in from /login.");
		let n = tokenFromCodex(t.authToken);
		if (!e.forceRefresh && !isChatGptTokenFresh(n, e.now())) {
			if (t = await this.#i(!0), t.authMethod !== `chatgpt` || t.authToken === void 0) throw new ChatGptSignInRequiredError();
			n = tokenFromCodex(t.authToken);
		}
		return n;
	}
	async #i(e) {
		let t = await this.#a();
		try {
			return await t.getAuthStatus({ refreshToken: e });
		} catch (e) {
			throw t.exited && (this.#r = void 0), e;
		}
	}
	restart() {
		let e = this.#r;
		this.#r = void 0, e?.then((e) => e.close()).catch(() => void 0);
	}
	#a() {
		return this.#r === void 0 && (this.#r = CodexAppServerConnection.start({
			command: this.#e,
			env: this.#t,
			spawnProcess: this.#n
		}).catch((e) => {
			throw this.#r = void 0, e;
		})), this.#r;
	}
};
var CodexAppServerConnection = class CodexAppServerConnection {
	#e;
	#t;
	#n = /* @__PURE__ */ new Map();
	#r = 1;
	#i = !1;
	#a;
	constructor(e) {
		this.#e = e, e.unref(), unrefStream(e.stdin), unrefStream(e.stdout), unrefStream(e.stderr), e.stderr.resume(), this.#t = createInterface({ input: e.stdout }), this.#t.on(`line`, (e) => this.#l(e)), e.once(`error`, (e) => this.#u(e)), e.once(`exit`, (e, t) => {
			let n = t === null ? `code ${e ?? `unknown`}` : `signal ${t}`;
			this.#u(Error(`Codex app-server exited with ${n}.`));
		});
	}
	get exited() {
		return this.#i;
	}
	close() {
		this.#e.kill(), this.#u(Error(`Codex app-server connection was restarted.`));
	}
	static async start(e) {
		let t;
		try {
			t = e.spawnProcess(e.command, [`app-server`, `--stdio`], {
				env: e.env,
				stdio: [
					`pipe`,
					`pipe`,
					`pipe`
				]
			});
		} catch (e) {
			throw appServerError(e);
		}
		let n = new CodexAppServerConnection(t);
		try {
			return await n.#o(`initialize`, {
				capabilities: null,
				clientInfo: {
					name: `eve`,
					title: `eve`,
					version: resolveInstalledPackageInfo().version
				}
			}), n.#s(`initialized`, {}), n;
		} catch (e) {
			throw t.kill(), e;
		}
	}
	async getAuthStatus(e) {
		let t = await this.#o(`getAuthStatus`, {
			includeToken: !0,
			refreshToken: e.refreshToken
		});
		if (!isObject(t)) throw Error(`Codex app-server returned an invalid authentication response.`);
		return {
			...typeof t.authMethod == `string` && { authMethod: t.authMethod },
			...typeof t.authToken == `string` && { authToken: t.authToken },
			...typeof t.requiresOpenaiAuth == `boolean` && { requiresOpenaiAuth: t.requiresOpenaiAuth }
		};
	}
	#o(e, t) {
		if (this.#i) return Promise.reject(this.#a ?? Error(`Codex app-server is not running.`));
		let n = this.#r++;
		let r = new Promise((e, t) => {
			this.#n.set(n, {
				reject: t,
				resolve: e
			});
		});
		return this.#c({
			id: n,
			method: e,
			params: t
		}), r;
	}
	#s(e, t) {
		this.#c({
			method: e,
			params: t
		});
	}
	#c(e) {
		this.#e.stdin.write(`${JSON.stringify(e)}\n`);
	}
	#l(e) {
		let t;
		try {
			t = JSON.parse(e);
		} catch {
			return;
		}
		if (typeof t.id != `number`) return;
		let n = this.#n.get(t.id);
		n !== void 0 && (this.#n.delete(t.id), t.error === void 0 ? n.resolve(t.result) : n.reject(Error(t.error.message ?? `Codex app-server request failed (${t.error.code}).`)));
	}
	#u(e) {
		if (!this.#i) {
			this.#i = !0, this.#a = appServerError(e), this.#t.close();
			for (let e of this.#n.values()) e.reject(this.#a);
			this.#n.clear();
		}
	}
};
function spawnCodexAppServer(e, t, n) {
	return spawn(e, [...t], n);
}
function unrefStream(e) {
	`unref` in e && typeof e.unref == `function` && e.unref();
}
function tokenFromCodex(e) {
	let t = extractCodexAccountIdFromToken(e);
	let n = extractCodexAccountLabelFromToken(e);
	let r = readCodexJwtExpirationMs(e);
	return {
		token: e,
		...t !== void 0 && { accountId: t },
		...n !== void 0 && { accountLabel: n },
		...r !== void 0 && { expiresAt: r }
	};
}
function appServerError(e) {
	if (isErrnoCode(e, `ENOENT`)) return new CodexBinaryNotFoundError(e);
	let t = e instanceof Error ? e.message : String(e);
	return Error(`Codex app-server is unavailable: ${t}`, { cause: e });
}
// node_modules/eve/dist/src/public/models/openai/chatgpt/token-broker.js
function createCodexTokenBroker(e = {}) {
	let t = e.appServer ?? new CodexAppServerClient(e);
	let n = e.store ?? getDefaultChatGptCredentialStore();
	let r = e.now ?? Date.now;
	let i;
	let a = { kind: `checking` };
	let o;
	let s;
	let c;
	return {
		credentialOwner() {
			return i;
		},
		getToken(e) {
			return getToken(e.reason);
		},
		refreshState() {
			if (c !== void 0) return c;
			let e = refreshAuthState();
			return c = e, e.finally(() => {
				c === e && (c = void 0);
			}), e;
		},
		state() {
			return a;
		}
	};
	async function refreshAuthState() {
		s !== void 0 && await s.promise.catch(() => void 0), i === `codex` && (a.kind === `signed-out` || a.kind === `reauth-required`) ? t.restart?.() : i === `eve` && (i = void 0), o = void 0;
		try {
			await getToken(`request`);
		} catch {}
		return a;
	}
	function getToken(e) {
		let t = e === `rejected`;
		if (!t && o !== void 0 && isChatGptTokenFresh(o, r())) return Promise.resolve(o);
		if (s !== void 0 && (!t || s.forced)) return s.promise;
		let n = s?.promise;
		let i = (n === void 0 ? resolveToken(t) : n.catch(() => void 0).then(() => resolveToken(t))).finally(() => {
			s?.promise === i && (s = void 0);
		});
		return s = {
			forced: t,
			promise: i
		}, i;
	}
	async function resolveToken(s) {
		try {
			let c;
			if (i === `eve`) c = await n.resolveToken({
				forceRefresh: s,
				fetch: e.fetch,
				now: r
			});
			else try {
				c = await t.resolveToken({
					forceRefresh: s,
					now: r
				}), i = `codex`;
			} catch (t) {
				if (!(t instanceof CodexBinaryNotFoundError)) throw i ??= `codex`, t;
				i = `eve`, c = await n.resolveToken({
					forceRefresh: s,
					fetch: e.fetch,
					now: r
				});
			}
			return o = c, a = readyState(c), c;
		} catch (e) {
			throw o = void 0, a = e instanceof ChatGptSignInRequiredError ? { kind: `reauth-required` } : e instanceof ChatGptSignedOutError ? { kind: `signed-out` } : {
				kind: `unavailable`,
				reason: e instanceof Error ? e.message : String(e)
			}, e;
		}
	}
}
let defaultBroker;
function getDefaultCodexTokenBroker() {
	return defaultBroker ??= createCodexTokenBroker(), defaultBroker;
}
function readyState(e) {
	return {
		kind: `ready`,
		...e.accountLabel !== void 0 && { accountLabel: e.accountLabel }
	};
}
// node_modules/eve/dist/src/internal/nitro/routes/agent-info/build-agent-info-response.js
function toChatGptEndpoint(e) {
	if (e === void 0) return;
	let t = { state: e.kind };
	return e.kind === `ready` && e.accountLabel !== void 0 ? {
		...t,
		accountLabel: e.accountLabel
	} : t;
}
function buildAgentInfoResponse(e, t) {
	let { manifest: n } = e;
	let r = toModuleSource(n, n.config.source);
	if (r.binding === void 0) throw Error(`Compiled config source "${n.config.source.sourceId}" has no binding.`);
	let i = collectCompositionDiagnostics(n);
	let a = collectRemoteAgents(n);
	return {
		agent: {
			agentRoot: n.agentRoot,
			appRoot: n.appRoot,
			config: {
				...r,
				binding: r.binding
			},
			description: n.config.description,
			model: n.config.dynamicModel === void 0 ? {
				contextWindowTokens: n.config.model.contextWindowTokens,
				endpoint: resolveModelEndpointStatus(n.config.model.routing, t.gatewayCredentials, toChatGptEndpoint(t.chatgptAuth)),
				id: n.config.model.id,
				providerOptions: projectProviderOptionsForInfo(n.config.model.providerOptions),
				reasoning: n.config.reasoning,
				routing: n.config.model.routing,
				source: n.config.model.source === void 0 ? void 0 : toModuleSource(n, n.config.model.source)
			} : {
				reasoning: n.config.reasoning,
				routing: {
					kind: `dynamic`,
					resolver: renderDynamicResolver(n, {
						...n.config.dynamicModel,
						slug: `model`
					})
				}
			},
			name: n.config.name,
			nodeId: "__root__"
		},
		capabilities: { devRoutes: t.mode === `development` },
		channels: {
			routes: n.channelRoutes.effective.map((e) => ({
				...toModuleSource(n, e),
				adapterKind: e.adapterKind,
				method: e.method,
				name: e.name,
				urlPath: e.urlPath
			})),
			shadowed: [...n.channelRoutes.shadowed]
		},
		composition: i,
		connections: n.connections.map((e) => ({
			...toModuleSource(n, e),
			connectionName: e.connectionName,
			description: e.description,
			hasApproval: !1,
			hasAuthorization: e.vercelConnect !== void 0,
			hasHeaders: !1,
			protocol: e.protocol,
			url: e.url
		})),
		diagnostics: {
			discoveryErrors: n.diagnosticsSummary.errors,
			discoveryWarnings: n.diagnosticsSummary.warnings
		},
		hooks: compiledOf(n, `hook`).map((e) => ({
			...toModuleSource(n, e),
			eventNames: [...e.eventNames ?? []],
			slug: e.slug
		})),
		instructions: {
			dynamic: compiledOf(n, `instructions`).map((e) => renderDynamicResolver(n, e)),
			static: n.instructions.map((e) => ({
				...toOwnedSource(n, e),
				content: e.content,
				name: e.name,
				role: e.role
			}))
		},
		kernelEffects: projectPreparedKernelEffects(n),
		kind: `eve-agent-info`,
		memories: compiledOf(n, `memory`).map((e) => ({
			...toModuleSource(n, e),
			description: e.description,
			slot: e.slug
		})),
		mode: t.mode,
		remoteAgents: {
			entries: a,
			total: a.length
		},
		sandbox: {
			...toModuleSource(n, n.sandbox),
			provider: n.sandbox.providerName,
			environmentExportName: n.sandbox.environmentExportName,
			revisionHash: n.sandbox.revisionHash
		},
		schedules: n.schedules.map((e) => ({
			...toOwnedSource(n, e),
			cron: e.cron,
			...e.timezone !== void 0 && { timezone: e.timezone },
			hasRun: e.hasRun,
			markdown: e.markdown,
			name: e.name
		})),
		skills: {
			dynamic: compiledOf(n, `skill`).map((e) => renderDynamicResolver(n, e)),
			static: n.skills.map((e) => ({
				...toOwnedSource(n, e),
				description: e.description,
				license: e.license,
				markdown: e.content,
				metadata: e.metadata,
				name: e.name
			}))
		},
		subagents: {
			local: n.subagents.map((e) => {
				let t = {
					...toOwnedSource(n, e),
					description: e.description,
					entryPath: e.entryPath,
					name: e.name,
					nodeId: e.nodeId,
					parentNodeId: e.parentNodeId,
					rootPath: e.rootPath,
					summary: summarizeNode(e.agent)
				};
				return e.configResolver === void 0 ? t : {
					...t,
					configResolver: renderDynamicResolver(e.agent, {
						...e.configResolver,
						slug: `config`
					})
				};
			}),
			total: n.subagents.length
		},
		tools: {
			dynamic: compiledOf(n, `tool`).map((e) => renderDynamicResolver(n, e)),
			static: n.tools.map((e) => ({
				...toModuleSource(n, e),
				description: e.description,
				hasAuth: !1,
				hasExecute: e.hasExecute,
				hasModelOutputProjection: e.hasModelOutputProjection,
				hasOutputSchema: e.outputSchema !== void 0,
				inputSchema: e.inputSchema,
				name: e.name,
				outputSchema: e.outputSchema,
				requiresApproval: e.requiresApproval
			}))
		},
		version: 5,
		workspace: {
			resourceRoot: n.workspaceResourceRoot,
			rootEntries: [...n.workspaceResourceRoot.rootEntries]
		}
	};
}
function projectProviderOptionsForInfo(e) {
	if (e?.gateway?.serviceTier === `priority`) return { gateway: { serviceTier: `priority` } };
}
function toModuleSource(e, t) {
	let n = e.bindings[t.sourceId];
	if (n === void 0) throw Error(`Compiled source "${t.sourceId}" has no binding.`);
	return sourceProjection(t, n.owner, n);
}
function toOwnedSource(e, t) {
	let n = e.bindings[t.sourceId];
	let r = n?.owner ?? t.owner;
	if (r === void 0) throw Error(`Compiled source "${t.sourceId}" has no owner.`);
	return sourceProjection(t, r, n);
}
function sourceProjection(e, t, n) {
	let r = {
		logicalPath: e.logicalPath,
		owner: t,
		sourceId: e.sourceId,
		sourceKind: toAgentInfoSourceKind(e.sourceKind)
	};
	let i = n === void 0 ? void 0 : {
		backing: n.backing,
		logicalPath: n.logicalPath,
		owner: n.owner
	};
	return n !== void 0 && e.exportName !== void 0 ? {
		...r,
		binding: i,
		exportName: e.exportName
	} : n === void 0 ? e.exportName === void 0 ? r : {
		...r,
		exportName: e.exportName
	} : {
		...r,
		binding: i
	};
}
function toAgentInfoSourceKind(e) {
	switch (e) {
		case `markdown`:
		case `module`:
		case `skill-package`: return e;
		default: throw Error(`Unsupported compiled source kind "${e}".`);
	}
}
function renderDynamicResolver(e, t) {
	return {
		...toModuleSource(e, t),
		slug: t.slug
	};
}
function summarizeNode(e) {
	return {
		channels: e.channelRoutes.effective.length,
		connections: e.connections.length,
		hooks: compiledOf(e, `hook`).length,
		instructions: e.instructions.length,
		memories: compiledOf(e, `memory`).length,
		schedules: e.schedules.length,
		skills: e.skills.length,
		tools: e.tools.length
	};
}
function collectRemoteAgents(e) {
	return [e, ...e.subagents.map((e) => e.agent)].flatMap((e) => e.remoteAgents.map((e) => ({
		...sourceProjection(e, e.owner, e.binding),
		description: e.description,
		name: e.name,
		nodeId: e.nodeId,
		parentNodeId: e.parentNodeId,
		url: e.url
	})));
}
function collectCompositionDiagnostics(e) {
	let t = [e, ...e.subagents.map((e) => e.agent)].flatMap((e) => e.sourceComposition.entries).map((e) => {
		let t = {
			kind: e.kind,
			logicalPath: e.source.logicalPath,
			owner: e.source.owner,
			sourceId: e.source.sourceId
		};
		return e.kind === `shadowed` ? {
			...t,
			winnerSourceId: e.winnerSourceId
		} : t;
	});
	return {
		disabled: t.filter((e) => e.kind === `disabled`),
		shadowed: t.filter((e) => e.kind === `shadowed`)
	};
}
function projectPreparedKernelEffects(e) {
	let t = [];
	for (let n of e.tools) {
		let e = n.behavior;
		let r = e?.handling;
		if (e !== void 0 && r !== void 0) switch (r.kind) {
			case `dispatch`:
				t.push({
					action: r.action === `self-agent` ? `subagent-call` : r.action,
					audience: [...e.availability],
					kind: `dispatch`,
					sourceId: n.sourceId
				});
				break;
			case `provider-tool`:
				t.push({
					audience: [...e.availability],
					kind: `provider-tool`,
					sourceId: n.sourceId
				});
				break;
			case `workflow-tool`:
				t.push({
					action: `workflow-tool-call`,
					audience: [...e.availability],
					kind: `dispatch`,
					sourceId: n.sourceId
				});
				break;
			default: throw Error(`Unsupported compiled tool handling: ${String(r)}`);
		}
	}
	return t;
}
// node_modules/eve/dist/src/internal/nitro/routes/agent-info/load-agent-info-data.js
async function loadAgentInfoManifestData(e) {
	let t = await loadCompiledManifest({ compiledArtifactsSource: e.compiledArtifactsSource });
	return {
		manifest: t,
		schedules: await resolveSchedules({ manifest: t })
	};
}
function resolveAgentInfoCompiledArtifactsSource(e) {
	return resolveNitroCompiledArtifactsSource(e);
}
// node_modules/eve/dist/src/internal/nitro/routes/info.js
async function createAgentInfoPayload(e) {
	let t = await loadAgentInfoManifestData({ compiledArtifactsSource: resolveAgentInfoCompiledArtifactsSource(e) });
	let n = t.manifest.config.dynamicModel === void 0 ? t.manifest.config.model.routing : void 0;
	return buildAgentInfoResponse(t, {
		mode: e.kind,
		gatewayCredentials: n === void 0 ? {
			apiKey: !1,
			oidc: !1
		} : await resolveGatewayCredentialPresence(n),
		...isChatGptModelRouting(n) ? { chatgptAuth: await resolveChatGptAuthState() } : {}
	});
}
async function resolveChatGptAuthState() {
	if (!developmentModelBrokerAvailable()) return getDefaultCodexTokenBroker().refreshState();
	try {
		return {
			kind: `ready`,
			accountLabel: (await readDevelopmentModelCredential(`chatgpt`))?.accountLabel
		};
	} catch {
		return { kind: `signed-out` };
	}
}
async function resolveGatewayCredentialPresence(e) {
	if (e.kind === `gateway` && isEveDevEnvironment()) try {
		let e = await readDevelopmentModelCredential(`gateway`) ?? await resolveGatewayModelCredential();
		return {
			apiKey: e.kind === `api-key`,
			oidc: e.kind === `oidc`,
			account: e.kind === `oauth`,
			team: e.teamName
		};
	} catch {
		return {
			apiKey: !1,
			oidc: !1
		};
	}
	let t = hasEnvValue(process.env.AI_GATEWAY_API_KEY);
	if (e.kind === `external` || t) return {
		apiKey: t,
		oidc: !1
	};
	try {
		return await getVercelOidcToken(), {
			apiKey: !1,
			oidc: !0
		};
	} catch {
		return {
			apiKey: !1,
			oidc: !1
		};
	}
}
async function handleAgentInfoRequest(e) {
	return new Response(JSON.stringify(await createAgentInfoPayload(e)), { headers: {
		"cache-control": `no-store`,
		"content-type": `application/json; charset=utf-8`
	} });
}
export { handleAgentInfoRequest };

//# sourceMappingURL=eve78.mjs.map