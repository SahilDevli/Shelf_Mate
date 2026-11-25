import { isErrnoCode, isObject } from "./eve3.mjs";
import { isEveDevEnvironment } from "./eve11.mjs";
import { isLoopbackHostname } from "./eve39.mjs";
import "./eve40.mjs";
import { createRequire } from "node:module";
import { delimiter, join } from "node:path";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { mkdir, readFile, realpath, rm, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { setTimeout } from "node:timers/promises";
import { secrets } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/just-secrets/index.js";
import { execFile } from "node:child_process";
import { getVercelOidcToken } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/compiled/@vercel/oidc/index.js";
// node_modules/eve/dist/src/internal/model-auth/store.js
async function readModelSecret(e) {
	try {
		let t = await secrets.get({
			service: `eve`,
			name: e
		});
		if (t !== null && Buffer.byteLength(t) > 2560) throw Error();
		return t ?? void 0;
	} catch {
		throw Error(`Cannot read the OS secret store. Unlock it and retry /login.`);
	}
}
async function writeModelSecret(e, t) {
	try {
		if (Buffer.byteLength(t) > 2560) throw Error();
		await secrets.set({
			service: `eve`,
			name: e,
			value: t
		});
	} catch {
		throw Error(`Cannot save to the OS secret store. Unlock it and retry /login.`);
	}
}
let cachedVercelSession;
let cachedVercelSessionClientId;
async function writeVercelSession(e, t) {
	let { accessToken: n, expiresAt: r, ...i } = e;
	await writeModelSecret(`vercel`, JSON.stringify({
		clientId: t,
		...i
	})), cachedVercelSession = e, cachedVercelSessionClientId = t;
}
async function readVercelSession(e) {
	let t = await readModelSecret(`vercel`);
	if (t === void 0) return;
	let n;
	try {
		n = JSON.parse(t);
	} catch {
		throw Error(`Saved Vercel login is invalid. Run /login to sign in again.`);
	}
	if (isObject(n) && n.clientId === e) {
		if (typeof n.refreshToken != `string` || typeof n.teamId != `string` || typeof n.teamName != `string`) throw Error(`Saved Vercel login is invalid. Run /login to sign in again.`);
		return {
			accessToken: cachedVercelSessionClientId === e && cachedVercelSession?.refreshToken === n.refreshToken ? cachedVercelSession.accessToken : ``,
			refreshToken: n.refreshToken,
			expiresAt: cachedVercelSessionClientId === e && cachedVercelSession?.refreshToken === n.refreshToken ? cachedVercelSession.expiresAt : 0,
			teamId: n.teamId,
			teamName: n.teamName
		};
	}
}
function modelKeySecretName(e) {
	return e === `ai-gateway-key` ? e : `${e}-key`;
}
// node_modules/eve/dist/src/shared/model-helper.js
const MODEL_HELPERS = {
	chatgpt: {
		module: `eve/models/openai`,
		prefix: `chatgpt/`,
		defaultModel: `gpt-6-luna-fast`,
		provider: `codex`
	},
	openai: {
		module: `eve/models/openai`,
		prefix: `openai-api/`,
		defaultModel: `gpt-6-luna-fast`,
		provider: `openai`
	},
	anthropic: {
		module: `eve/models/anthropic`,
		prefix: `anthropic-api/`,
		defaultModel: `claude-sonnet-5`,
		provider: `anthropic`
	}
};
// node_modules/eve/dist/src/internal/model-auth/api-key.js
const KEY_ENV = {
	openai: `OPENAI_API_KEY`,
	anthropic: `ANTHROPIC_API_KEY`,
	"ai-gateway-key": `AI_GATEWAY_API_KEY`
};
async function resolveModelApiKey(e) {
	let t = process.env[KEY_ENV[e]];
	let n = isEveDevEnvironment() && process.env["EVE_MODEL_CONNECTION"] === e ? process.env.EVE_MODEL_KEY_SOURCE : void 0;
	if (t?.trim() && n !== `secret`) return t;
	if (isEveDevEnvironment() && n !== `environment`) {
		let t = await readModelSecret(modelKeySecretName(e));
		if (t) return t;
	}
	throw Error(n === `secret` ? `The selected saved API key is unavailable. Run /login to reconnect.` : `Set ${KEY_ENV[e]}${isEveDevEnvironment() ? ` or connect with /login` : ` in the server environment`}.`);
}
async function authJson(e, t = {}, n = 256e3, r = 15e3) {
	let i = AbortSignal.timeout(r);
	let a = await fetch(e, {
		...t,
		redirect: `error`,
		signal: t.signal ? AbortSignal.any([t.signal, i]) : i
	});
	let o = a.body?.getReader();
	let s = ``;
	let c = new TextDecoder();
	if (o) try {
		let e = 0;
		for (;;) {
			let t = await o.read();
			if (t.done) break;
			if (e += t.value.byteLength, e > n) throw Error(`Authentication response was too large. Retry /login.`);
			s += c.decode(t.value, { stream: !0 });
		}
		s += c.decode();
	} finally {
		await o.cancel();
	}
	let l;
	try {
		l = JSON.parse(s);
	} catch {
		throw Error(`The provider returned an invalid authentication response. Retry /login.`);
	}
	if (!isObject(l)) throw Error(`The provider returned an invalid authentication response. Retry /login.`);
	if (!a.ok && typeof l.error != `string`) throw Error(`Authentication failed (${a.status}). Retry /login.`);
	return l;
}
async function vercelOAuthEndpoints(e) {
	let t = await authJson(`https://vercel.com/.well-known/openid-configuration`, { signal: e });
	let endpoint = (e) => {
		let t = typeof e == `string` ? URL.parse(e) : null;
		if (!t || ![`https://vercel.com`, `https://api.vercel.com`].includes(t.origin) || t.username || t.password) throw Error(`Vercel returned an unexpected OAuth endpoint. Retry /login.`);
		return t.href;
	};
	return {
		device: endpoint(t.device_authorization_endpoint),
		token: endpoint(t.token_endpoint)
	};
}
function sessionFromToken(e, t) {
	if (typeof e.error == `string`) throw Error(`Vercel login expired. Retry /login.`);
	if (typeof e.access_token != `string` || typeof e.expires_in != `number` || !Number.isFinite(e.expires_in) || e.expires_in <= 0) throw Error(`Vercel did not return a usable token. Retry /login.`);
	let n = typeof e.refresh_token == `string` ? e.refresh_token : t?.refreshToken;
	if (!n) throw Error(`Vercel did not return a refresh token. Retry /login.`);
	return {
		accessToken: e.access_token,
		refreshToken: n,
		expiresAt: Date.now() + e.expires_in * 1e3,
		teamId: t?.teamId ?? ``,
		teamName: t?.teamName ?? ``
	};
}
async function resolveVercelSession(e) {
	let t = await readVercelSession("cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp");
	if (!t) throw Error(`Sign in to Vercel with /login.`);
	if (t.expiresAt > Date.now() + 6e4 && t.accessToken !== e) return t;
	let n = join(homedir(), `.eve`, `auth`);
	await mkdir(n, {
		recursive: !0,
		mode: 448
	});
	let r = join(n, `vercel-refresh.lock`);
	let i = Date.now() + 35e3;
	for (;;) try {
		await mkdir(r);
		break;
	} catch (e) {
		if (!isErrnoCode(e, `EEXIST`)) throw e;
		let t = await stat(r).catch(() => void 0);
		if (t && Date.now() - t.mtimeMs > 3e5) {
			await rm(r, {
				recursive: !0,
				force: !0
			});
			continue;
		}
		if (Date.now() > i) throw Error(`Vercel credentials are busy. Close other eve sessions and retry /login.`);
		await setTimeout(100);
	}
	try {
		if (t = await readVercelSession("cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp"), !t) throw Error(`Sign in to Vercel with /login.`);
		return t.expiresAt > Date.now() + 6e4 && t.accessToken !== e || (t = sessionFromToken(await authJson((await vercelOAuthEndpoints()).token, {
			method: `POST`,
			body: new URLSearchParams({
				client_id: "cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp",
				grant_type: `refresh_token`,
				refresh_token: t.refreshToken
			})
		}), t), await writeVercelSession(t, "cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp")), t;
	} finally {
		await rm(r, {
			recursive: !0,
			force: !0
		});
	}
}
// node_modules/eve/dist/src/internal/model-auth/development-broker-client.js
function developmentModelBrokerAvailable() {
	return isEveDevEnvironment() && !!(process.env.EVE_DEV_CONTROL_URL && process.env["EVE_DEV_WORKFLOW_TRANSPORT_SECRET"]);
}
async function readDevelopmentModelCredential(e, t, n) {
	if (!developmentModelBrokerAvailable()) return;
	let r = new URL("/eve/v1/dev/internal/model-credential", process.env.EVE_DEV_CONTROL_URL);
	if (!isLoopbackHostname(r.hostname) || r.protocol !== `http:` || r.username || r.password) throw Error(`The local model connection is unavailable. Restart eve dev.`);
	r.searchParams.set(`provider`, e);
	let i = { ["x-eve-dev-workflow-transport"]: process.env["EVE_DEV_WORKFLOW_TRANSPORT_SECRET"] };
	t && (i["x-eve-model-rejected-token-sha256"] = createHash(`sha256`).update(t).digest(`hex`));
	let a = await authJson(r.href, {
		headers: i,
		signal: n
	}, 256e3, 75e3);
	if (typeof a.token != `string` || !a.token || ![
		`api-key`,
		`oauth`,
		`oidc`
	].includes(String(a.kind))) throw Error(`The model connection is unavailable. Run /login to reconnect.`);
	return {
		kind: a.kind,
		token: a.token,
		...typeof a.teamId == `string` && { teamId: a.teamId },
		...typeof a.teamName == `string` && { teamName: a.teamName },
		...typeof a.accountId == `string` && { accountId: a.accountId },
		...typeof a.accountLabel == `string` && { accountLabel: a.accountLabel }
	};
}
// node_modules/eve/dist/src/internal/model-auth/vercel-cli.js
async function readObject(e) {
	try {
		let t = await readFile(e, `utf8`);
		if (Buffer.byteLength(t) > 65536) return;
		let n = JSON.parse(t);
		return isObject(n) ? n : void 0;
	} catch {
		return;
	}
}
async function readCliConfiguration() {
	let e = homedir();
	let t = process.platform === `darwin` ? join(e, `Library`, `Application Support`) : process.platform === `win32` ? process.env.APPDATA ?? join(e, `AppData`, `Roaming`) : process.env.XDG_DATA_HOME ?? join(e, `.local`, `share`);
	for (let n of [
		join(t, `com.vercel.cli`),
		join(e, `.now`),
		join(t, `now`)
	]) {
		let e = await readObject(join(n, `config.json`));
		if (e !== void 0) return {
			directory: n,
			config: e,
			teamId: typeof e.currentTeam == `string` ? e.currentTeam : void 0
		};
	}
}
async function readVercelCliConnection() {
	let e = await readCliConfiguration();
	if (!e?.teamId) return;
	let t = await readCliToken(e);
	return t === void 0 ? void 0 : {
		token: t,
		teamId: e.teamId
	};
}
async function readCliToken(e) {
	if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
	if (!e) return;
	let { directory: t, config: n } = e;
	let r = process.env.VERCEL_TOKEN_STORAGE ?? n.credStorage ?? `file`;
	let i = join(t, `auth.json`);
	let a;
	if (r === `file` && (a = await readObject(i)), !a && (r === `keyring` || r === `auto`)) {
		let e = `cli:${createHash(`sha256`).update(i).digest(`hex`).slice(0, 16)}`;
		try {
			let t = await readCliKeyring(e);
			let n = t && t.length <= 65536 ? JSON.parse(t) : void 0;
			isObject(n) && (a = n);
		} catch {
			if (r === `keyring`) return;
		}
		!a && r === `auto` && (a = await readObject(i));
	}
	if (typeof a?.token == `string` && a.token) return a.token;
}
async function refreshVercelCliConnection() {
	try {
		await promisify(execFile)(`vercel`, [`whoami`], {
			timeout: 15e3,
			maxBuffer: 65536,
			windowsHide: !0
		});
	} catch {
		throw Error(`Vercel CLI access expired. Run /login to reconnect.`);
	}
}
async function readCliKeyring(e) {
	for (let t of (process.env.PATH ?? ``).split(delimiter)) try {
		let n = await realpath(join(t, process.platform === `win32` ? `vercel.cmd` : `vercel`));
		let r = createRequire(n);
		process.platform === `win32` && (r = createRequire(r.resolve(`vercel/package.json`)));
		try {
			r = createRequire(r.resolve(`@vercel/cli-auth/package.json`));
		} catch {}
		return new (r("@napi-rs/keyring")).Entry(`com.vercel.vercel-cli`, e).getPassword() ?? void 0;
	} catch {}
}
// node_modules/eve/dist/src/internal/model-auth/gateway-credential.js
async function resolveGatewayModelCredential(e) {
	let t = process.env["EVE_MODEL_CONNECTION"];
	if (t === `vercel` || t === `vercel-cli`) {
		t === `vercel-cli` && e && await refreshVercelCliConnection();
		let n = t === `vercel` ? await resolveVercelSession(e) : await readVercelCliConnection();
		if (!n) throw Error(`Vercel CLI credentials are unavailable. Run /login.`);
		return {
			kind: `oauth`,
			token: `accessToken` in n ? n.accessToken : n.token,
			teamId: process.env.EVE_MODEL_TEAM ?? n.teamId,
			teamName: process.env.EVE_MODEL_TEAM_NAME ?? (`teamName` in n ? n.teamName : n.teamId)
		};
	}
	return t === `ai-gateway-key` ? {
		kind: `api-key`,
		token: await resolveModelApiKey(`ai-gateway-key`)
	} : t !== `ai-gateway-project` && process.env.AI_GATEWAY_API_KEY?.trim() ? {
		kind: `api-key`,
		token: process.env.AI_GATEWAY_API_KEY
	} : {
		kind: `oidc`,
		token: await getVercelOidcToken()
	};
}
export { MODEL_HELPERS, developmentModelBrokerAvailable, readDevelopmentModelCredential, resolveGatewayModelCredential };

//# sourceMappingURL=eve38.mjs.map