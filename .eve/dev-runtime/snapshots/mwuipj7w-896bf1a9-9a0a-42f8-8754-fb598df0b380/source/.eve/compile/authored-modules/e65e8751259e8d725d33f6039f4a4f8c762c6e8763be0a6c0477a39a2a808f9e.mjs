import { fileURLToPath as __eveFileURLToPath, fileURLToPath, pathToFileURL } from "node:url";
import { dirname as __eveDirname, dirname, isAbsolute, relative, resolve } from "node:path";
import { createRequire as __eveCreateRequire, createRequire, findPackageJSON } from "node:module";
const __filename = __eveFileURLToPath(import.meta.url);
__eveDirname(__filename);
__eveCreateRequire(import.meta.url);
import { interopAuthoredModuleNamespace, loadFrameworkProgrammaticModule, memoizeModuleNamespaceFactories } from "file:///C:/Users/sahildevli/OneDrive%20-%20Nagarro/Desktop/ShelfMate-Bot/node_modules/eve/dist/src/internal/development-programmatic-source-loader.js";
import { eveChannel } from "eve/channels/eve";
import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";
import { defineTool } from "eve/tools";
import { createHash, randomUUID } from "node:crypto";
import { always } from "eve/tools/approval";
import { defineExtension } from "eve/extension";
import { AsyncLocalStorage } from "node:async_hooks";
import { defineAgent, defineDynamic as defineDynamic$1 } from "eve";
import { getLocalDevCapability } from "eve/local-dev";
import { defineDynamic as defineDynamic$2, defineInstructions } from "eve/instructions";
import { defineSelfModificationSandbox, defineSelfModificationSandbox as defineSelfModificationSandbox$1 } from "eve/internal/self-modification/sandbox";
import { defineSkill } from "eve/skills";
import { readFile } from "node:fs/promises";
import "node:util";
import { spawn, spawnSync } from "node:child_process";
import "node:fs";
var __defProp = Object.defineProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __exportAll = (all, flags) => {
	let target = Object.setPrototypeOf({}, null);
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!(flags & 1)) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return flags & 2 ? target : Object.preventExtensions(target);
};
var eve_exports = __exportAll({ default: () => eve_default });
var eve_default = eveChannel({ auth: [
	vercelOidc(),
	localDev(),
	placeholderAuth()
] });
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
	return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
var Cached = class {
	constructor(getter) {
		this._getter = getter;
		this._value = void 0;
	}
	get value() {
		const getter = this._getter;
		if (getter !== void 0) {
			this._value = getter();
			this._getter = void 0;
		}
		return this._value;
	}
};
function cached(getter) {
	return new Cached(getter);
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function rawShape(def) {
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
	return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
	Object.defineProperty(target, key, {
		get() {
			const value = getter();
			assignProp(this, key, value);
			return value;
		},
		enumerable: true,
		configurable: true
	});
}
function putProp(target, key, value) {
	if (key in target) assignProp(target, key, value);
	else target[key] = value;
}
function mirrorShape(target, source, keys, wrap) {
	const raw = sourceShape(source);
	for (const key of keys) {
		const desc = Object.getOwnPropertyDescriptor(raw, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => {
			const value = source._zod.def.shape[key];
			return wrap ? wrap(value, key) : value;
		});
		else putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
	}
}
function mirrorProps(target, source) {
	for (const key of Reflect.ownKeys(source)) {
		const desc = Object.getOwnPropertyDescriptor(source, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => source[key]);
		else putProp(target, key, desc.value);
	}
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject$1(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject$1(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject$1(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
const propertyKeyTypes = new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function stringifyPrimitive(value) {
	if (typeof value === "bigint") return value.toString() + "n";
	if (typeof value === "string") return `"${value}"`;
	return `${value}`;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = (() => ({
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
const BIGINT_FORMAT_RANGES = {
	int64: [BigInt("-9223372036854775808"), BigInt("9223372036854775807")],
	uint64: [BigInt(0), BigInt("18446744073709551615")]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	const newShape = {};
	mirrorShape(newShape, schema, maskedKeys(schema, mask));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function maskedKeys(schema, mask) {
	const raw = sourceShape(schema);
	const keys = [];
	for (const key of Reflect.ownKeys(mask)) {
		if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) throw new Error(`Unrecognized key: "${String(key)}"`);
		if (mask[key]) keys.push(key);
	}
	return keys;
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	const omitted = new Set(maskedKeys(schema, mask));
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = sourceShape(schema);
		for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
	mirrorProps(newShape, shape);
	return newShape;
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
	if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	const newShape = {};
	mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
	mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
	return clone(a, mergeDefs(a._zod.def, {
		shape: newShape,
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask, name = "partial") {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({
		type: "optional",
		innerType: value
	})));
	return clone(schema, mergeDefs(schema._zod.def, {
		shape: newShape,
		checks: []
	}));
}
function required(Class, schema, mask) {
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({
		type: "nonoptional",
		innerType: value
	}));
	return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function sizeCaps(defChecks) {
	const caps = [];
	for (const ch of defChecks ?? []) {
		const d = ch._zod.def;
		if (!/_(length|size)$|_equals$/.test(d.check)) break;
		const max = d.maximum ?? d.length ?? d.size;
		if (max >= 0) caps.push([max, ch]);
	}
	return caps;
}
function attachSchema(issues, start, inst) {
	var _a;
	for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue(iss, ctx, config) {
	var _a;
	const traits = iss.inst?._zod?.traits;
	if (traits?.has("$ZodType")) {
		if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
		else iss.schema = iss.inst;
	}
	const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const full = {};
	for (const k of Object.keys(iss)) {
		if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
		full[k] = iss[k];
	}
	full.path ?? (full.path = []);
	full.message = message;
	if (ctx?.reportInput) full.input = iss.input;
	return full;
}
const highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
	const units = str.length;
	if (!highSurrogate.test(str)) return units;
	let count = units;
	for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
		count--;
		i++;
	}
	return count;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function parsedType(data) {
	const t = typeof data;
	switch (t) {
		case "number": return Number.isNaN(data) ? "nan" : "number";
		case "object": {
			if (data === null) return "null";
			if (Array.isArray(data)) return "array";
			const obj = data;
			if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
		}
	}
	return t;
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
function members(proto, table) {
	for (const key in table) {
		const desc = Object.getOwnPropertyDescriptor(table, key);
		if (desc.get) Object.defineProperty(proto, key, {
			...desc,
			enumerable: false
		});
		else defineBound(proto, key, desc.value);
	}
}
function own(inst, key, value, enumerable = true) {
	Object.defineProperty(inst, key, {
		configurable: true,
		writable: true,
		enumerable,
		value
	});
	return value;
}
function hide(inst, key, value) {
	return own(inst, key, value, false);
}
function derived(computes, table) {
	for (const key in computes) {
		const compute = computes[key];
		Object.defineProperty(table, key, {
			configurable: true,
			enumerable: true,
			get() {
				return own(this, key, compute(this));
			},
			set(value) {
				own(this, key, value);
			}
		});
	}
	return table;
}
function defineBound(proto, key, fn) {
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return this == null ? fn : own(this, key, fn.bind(this));
		},
		set(value) {
			own(this, key, value);
		}
	});
}
function claim(inst, sentinel) {
	const proto = Object.getPrototypeOf(inst);
	return sentinel in proto ? void 0 : proto;
}
let installing;
let broke = false;
const breaker = {
	configurable: true,
	get() {
		broke = true;
	}
};
function defineLazyInternal(inst, key, compute) {
	const proto = Object.getPrototypeOf(inst._zod);
	if (key in proto && installing !== inst._zod) {
		installing = void 0;
		return;
	}
	installing = inst._zod;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			Object.defineProperty(this, key, breaker);
			const outer = broke;
			broke = false;
			try {
				const value = compute(this);
				if (broke) delete this[key];
				else Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
				broke = broke || outer;
				return value;
			} catch (err) {
				delete this[key];
				broke = broke || outer;
				throw err;
			}
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				value
			});
		}
	});
}
function installLazyProp(inst, key, make, enumerable) {
	const proto = claim(inst, key);
	if (!proto) return;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			const desc = {
				configurable: true,
				writable: true,
				enumerable,
				value: void 0
			};
			Object.defineProperty(this, key, desc);
			desc.value = make(this);
			Object.defineProperty(this, key, desc);
			return desc.value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
		}
	});
}
const CONSTANT_CATCH = "~constantCatch";
function constantCatch(value) {
	const fn = () => value;
	fn[CONSTANT_CATCH] = true;
	return fn;
}
var _a$3;
const _zodDesc = {
	value: void 0,
	enumerable: false
};
let _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
	const E = _E;
	if (E) {
		const saved = E.stackTraceLimit;
		if (typeof saved === "number") {
			try {
				E.stackTraceLimit = 0;
			} catch {
				_E = null;
				return new Definition();
			}
			try {
				return new Definition();
			} finally {
				E.stackTraceLimit = saved;
			}
		}
	}
	return new Definition();
}
function $constructor(name, initializer, proto, params) {
	const zodProto = {};
	function Internals(def) {
		this.def = def;
		this.constr = _;
		this.traits = new Set();
	}
	Internals.prototype = zodProto;
	const protoMembers = proto;
	const initialized = protoMembers && new WeakSet();
	function init(inst, def) {
		if (!inst._zod) {
			_zodDesc.value = new Internals(def);
			try {
				Object.defineProperty(inst, "_zod", _zodDesc);
			} finally {
				_zodDesc.value = void 0;
			}
		} else if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		if (initialized) {
			const own = Object.getPrototypeOf(inst);
			const ctorProto = inst._zod.constr.prototype;
			let up = own;
			while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
			const target = up ?? own;
			if (!initialized.has(target)) {
				initialized.add(target);
				members(target, protoMembers);
			}
		}
		const proto = _.prototype;
		for (const k in proto) {
			if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		const inst = params?.Parent ? newError(Definition) : this;
		init(inst, def);
		const deferred = inst._zod.deferred;
		if (deferred) {
			for (const fn of deferred) fn();
			inst._zod.deferred = void 0;
		}
		const pp = globalThis.__zod_globalConfig?.postProcessor;
		if (pp) pp(inst);
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$3 = globalThis).__zod_globalConfig ?? (_a$3.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
function _getMessage() {
	const internals = this._zod;
	internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
	return internals.message;
}
function _setMessage(value) {
	this._zod.message = value;
}
const _messageDesc = {
	get: _getMessage,
	set: _setMessage,
	enumerable: true,
	configurable: true
};
const _issuesDesc = {
	value: void 0,
	enumerable: false
};
const _installedToString = new WeakSet([Object.prototype, Error.prototype]);
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	_issuesDesc.value = def;
	Object.defineProperty(inst, "issues", _issuesDesc);
	_issuesDesc.value = void 0;
	Object.defineProperty(inst, "message", _messageDesc);
	const proto = Object.getPrototypeOf(inst);
	if (!_installedToString.has(proto)) {
		_installedToString.add(proto);
		Object.defineProperty(proto, "toString", {
			configurable: true,
			enumerable: false,
			get() {
				const value = () => this.message;
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			set(value) {
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
			}
		});
	}
};
const $ZodError = $constructor("$ZodError", initializer$1);
function node(obj, key, make) {
	if (!Object.prototype.hasOwnProperty.call(obj, key)) {
		if (key === "__proto__") Object.defineProperty(obj, key, {
			value: make(),
			writable: true,
			enumerable: true,
			configurable: true
		});
		else obj[key] = make();
	}
	return obj[key];
}
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
	else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError$1(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					const terminal = i === fullpath.length - 1;
					if (el === "_errors") {
						if (terminal) curr._errors.push(mapper(issue));
						i++;
						continue;
					}
					if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
						value: { _errors: [] },
						enumerable: true,
						writable: true,
						configurable: true
					});
					const node = curr[el];
					if (terminal) node._errors.push(mapper(issue));
					curr = node;
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
function finalizeParams(callee, params) {
	return {
		callee: params?.callee ?? callee,
		Err: params?.Err
	};
}
const _parse = (_Err) => {
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _parseAsync = (_Err) => {
	const fn = async (schema, value, _ctx, params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		if (result.issues.length) {
			const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
function failure(Err, issues, ctx) {
	let error;
	return {
		success: false,
		get error() {
			if (!error) {
				error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
				issues = void 0;
				ctx = void 0;
			}
			return error;
		},
		set error(e) {
			error = e;
			issues = void 0;
			ctx = void 0;
		}
	};
}
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
const COMPILE_INVALID = Symbol.for("zod.compile.invalid");
const COMPILE_FALLBACK = Symbol.for("zod.compile.fallback");
const validate = ((schema, value, _ctx) => {
	const validator = schema._zod.bag.validator;
	if (validator !== void 0) {
		if (validator(value) !== COMPILE_INVALID) return true;
		if (validator.definite === true && _ctx === void 0) return false;
	}
	return validateFallback(schema, value, _ctx);
});
function validateFallback(schema, value, _ctx) {
	const ctx = _ctx ? {
		..._ctx,
		async: false,
		abortEarly: true
	} : {
		async: false,
		abortEarly: true
	};
	const fallbackRun = schema._zod.bag.fallbackRun;
	let result;
	if (fallbackRun) {
		ctx[COMPILE_FALLBACK] = true;
		result = fallbackRun({
			value,
			issues: []
		}, ctx);
	} else result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length === 0;
}
const validateAsync$1 = async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true,
		abortEarly: true
	} : {
		async: true,
		abortEarly: true
	};
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length === 0;
};
const _encode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return parse(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		return parse(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _encodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
	return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
const uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
const email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
const httpProtocol = /^https?$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
function anchor(source) {
	return new RegExp(`^${source}$`);
}
const date = anchor(dateSource);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
	const opts = ["Z"];
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const qualified = `${timeSource({
		precision: args.precision,
		seconds: true
	})}(?:${opts.join("|")})`;
	const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const anyString = /^[\s\S]{0,}$/;
const integer = /^-?\d+$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
const boolean$1 = /^(?:true|false)$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
const $ZodCheck = $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
const _whenHasLength = (payload) => {
	const val = payload.value;
	return !nullish(val) && val.length !== void 0;
};
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	def.pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
var Doc = class {
	constructor(args = [], closed = {}) {
		this.content = [];
		this.indent = 0;
		this.args = args;
		this.closed = closed;
	}
	indented(fn) {
		this.indent += 1;
		try {
			fn(this);
		} finally {
			this.indent -= 1;
		}
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const content = this?.content ?? [``];
		return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
	}
};
const version = {
	major: 4,
	minor: 6,
	patch: 7
};
const $ZodType = $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const defChecks = inst._zod.def.checks;
	const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			if (payload.memo) return payload;
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
}, {
	get "~standard"() {
		return hide(this, "~standard", standardProps(this));
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	}
});
const toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync(inst, value) {
	const ctx = { async: true };
	return toStandardResult(await inst._zod.run({
		value,
		issues: []
	}, ctx), ctx);
}
function standardProps(inst) {
	return {
		validate: (value) => {
			const ctx = { async: false };
			try {
				const r = inst._zod.run({
					value,
					issues: []
				}, ctx);
				if (!(r instanceof Promise)) return toStandardResult(r, ctx);
			} catch (_) {}
			return validateAsync(inst, value);
		},
		vendor: "zod",
		version: 1
	};
}
const $ZodString = $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = def.pattern ?? anyString;
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
function canParseURL(input) {
	try {
		if (typeof URL !== "undefined" && typeof URL.canParse === "function") return URL.canParse(input);
		new URL(input);
		return true;
	} catch {
		return false;
	}
}
function validateURL(trimmed, def) {
	if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) return canParseURL(trimmed) || 2;
	return parseURLObject(trimmed, def);
}
function parseURLObject(trimmed, def) {
	if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
	try {
		if (typeof URL !== "undefined") {
			const URLStatic = URL;
			if (typeof URLStatic.parse === "function") return URLStatic.parse(trimmed) ?? 2;
		}
		return new URL(trimmed);
	} catch {
		return 2;
	}
}
const asciiTabOrNewline = /[\t\n\r]/g;
function stripTabAndNewline(value) {
	return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
	hostname.lastIndex = 0;
	return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
	protocol.lastIndex = 0;
	return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
const $ZodURL = $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = validateURL(trimmed, def);
			if (url === 1) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === 2) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === true) {
				payload.value = stripTabAndNewline(trimmed);
				return;
			}
			if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: def.hostname.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: def.protocol.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = $constructor("$ZodNanoID", (inst, def) => {
	if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
	def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID = $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODate = $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
});
const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
	if (!ipv6Alphabet.test(value)) return false;
	return canParseURL(`http://[${value}]`);
}
const $ZodIPv6 = $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidIPv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCIDRv4 = $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
	const parts = value.split("/");
	if (parts.length !== 2) return false;
	const [address, prefix] = parts;
	if (!prefix) return false;
	const prefixNum = Number(prefix);
	if (`${prefixNum}` !== prefix) return false;
	if (prefixNum < 0 || prefixNum > 128) return false;
	return isValidIPv6(address);
}
const $ZodCIDRv6 = $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidCIDRv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
const $ZodBase64 = $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64Charset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
	if (!base64urlCharset.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
const $ZodBase64URL = $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64urlCharset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodBoolean = $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUnknown = $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function capSize(inst, size) {
	const caps = sizeCaps(inst._zod.def.checks);
	if (!caps.length) return;
	const cap = Math.min(...caps.map((c) => c[0]));
	const parse = inst._zod.parse;
	inst._zod.parse = (payload, ctx) => {
		const n = size(payload.value);
		if (n > cap && !ctx?.skipChecks && ctx?.direction !== "backward") {
			for (const [max, ch] of sizeCaps(inst._zod.def.checks)) if (n > max && ch._zod.def.when(payload)) {
				const start = payload.issues.length;
				ch._zod.check(payload);
				payload.issues[start].continue = false;
				attachSchema(payload.issues, start, inst);
				return payload;
			}
		}
		return parse(payload, ctx);
	};
}
const arraySize = (input) => Array.isArray(input) ? input.length : -1;
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
		const proms = [];
		const abortEarly = ctx?.abortEarly;
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else {
				handleArrayResult(result, payload, i);
				if (abortEarly && result.issues.length !== 0 && aborted(result)) break;
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
	capSize(inst, arraySize);
});
function handlePropertyResult(result, final, key, input, optin, optout) {
	const isPresent = key in input;
	const isOptionalOut = optout === "optional";
	if (!isPresent && isOptionalOut && optin === "optional") return;
	if (result.issues.length) {
		if (optin !== void 0 && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && optin === void 0) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
const NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	const ownSymbols = Object.getOwnPropertySymbols(def.shape);
	const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		allKeys,
		symbolKeys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const optin = _catchall.optin;
	const optout = _catchall.optout;
	let seen = 0;
	for (const key in input) {
		if (abortEarly && payload.issues.length !== seen) {
			if (aborted(payload, seen)) break;
			seen = payload.issues.length;
		}
		if (keySet.has(key)) continue;
		if (key === "__proto__") {
			if (t === "never") unrecognized.push(key);
			continue;
		}
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
		else handlePropertyResult(r, payload, key, input, optin, optout);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst,
		continue: true
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const $ZodObject = $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	const sh = desc?.get ? desc.get.raw : def.shape ?? {};
	if (sh) {
		const get = () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			get.raw = newSh;
			return newSh;
		};
		get.raw = sh;
		Object.defineProperty(def, "shape", { get });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazyInternal(inst, "propValues", (zod) => {
		const shape = zod.def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, new Set());
				for (const v of field.values) propValues[key].add(v);
				if (field.optin !== void 0) propValues[key].add(void 0);
			}
		}
		return propValues;
	});
	const isObject = isObject$1;
	const catchall = def.catchall;
	let value;
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
		const proms = [];
		const shape = value.shape;
		const abortEarly = ctx?.abortEarly;
		let seen = payload.issues.length;
		for (const key of value.allKeys) {
			if (abortEarly && payload.issues.length !== seen) {
				if (aborted(payload, seen)) break;
				seen = payload.issues.length;
			}
			if (key === "__proto__") continue;
			const el = shape[key];
			const optin = el._zod.optin;
			const optout = el._zod.optout;
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
	};
});
const $ZodObjectJIT = $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const memo = globalConfig.memoizer;
	const generateFastpass = (shape) => {
		const normalized = _normalized.value;
		const syms = normalized.symbolKeys;
		const doc = new Doc(["payload", "ctx"], {
			shape,
			inst,
			memo,
			syms
		});
		const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
		doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
		for (const key of normalized.allKeys) {
			if (key === "__proto__") continue;
			const id = ids[key];
			const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
			const isPresent = `${k} in input`;
			const schema = shape[key];
			const optin = schema?._zod?.optin;
			const isOptionalIn = optin !== void 0;
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(k)};`);
			if (isOptionalIn && isOptionalOut) {
				const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
				doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
			else {
				doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
				if (optin === "defaulted") doc.write(`newResult[${k}] = ${id}.value;`);
				else doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
			}
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		return doc.compile();
	};
	let fastpass;
	const isObject = isObject$1;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
const $ZodUnion = $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
	defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazyInternal(inst, "values", (zod) => {
		if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		if (zod.def.options.every((o) => o._zod.pattern)) {
			const patterns = zod.def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
const $ZodIntersection = $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
		for (const key of sharedKeys) {
			if (key === "__proto__") continue;
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = new Map();
	let unrecIssue;
	const keyIssues = new Map();
	const collect = (iss, side) => {
		let keys;
		if (iss.code === "unrecognized_keys" && !iss.path?.length) {
			unrecIssue ?? (unrecIssue = iss);
			keys = iss.keys;
		} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
			const k = String(iss.path[0]);
			if (!keyIssues.has(k)) keyIssues.set(k, iss);
			keys = [k];
		} else return false;
		for (const k of keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k)[side] = true;
		}
		return true;
	};
	for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
	for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length) {
		const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
		if (aggregated.length) result.issues.push({
			...unrecIssue,
			keys: aggregated
		});
		for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
	}
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) {
		if (aborted(result)) return result;
		throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	}
	result.value = merged.data;
	return result;
}
const $ZodRecord = $constructor("$ZodRecord", (inst, def) => {
	$ZodType.init(inst, def);
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isPlainObject(input)) {
			payload.issues.push({
				expected: "record",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		const proms = [];
		const values = def.keyType._zod.values;
		if (values && !def.partial) {
			payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
			const recordKeys = new Set();
			for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
				recordKeys.add(typeof key === "number" ? key.toString() : key);
				if (key === "__proto__") continue;
				const keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (keyResult.issues.length) {
					payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const outKey = keyResult.value;
				if (outKey === "__proto__") continue;
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}
			}
			let unrecognized;
			for (const key in input) if (!recordKeys.has(key)) {
				if (def.mode === "loose") {
					if (key === "__proto__") continue;
					payload.value[key] = input[key];
				} else {
					unrecognized = unrecognized ?? [];
					unrecognized.push(key);
				}
			}
			if (unrecognized && unrecognized.length > 0) payload.issues.push({
				code: "unrecognized_keys",
				input,
				inst,
				keys: unrecognized,
				continue: true
			});
		} else {
			payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
			let unrecognized;
			for (const key of Reflect.ownKeys(input)) {
				if (key === "__proto__") continue;
				if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
				let keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (typeof key === "string" && number$1.test(key) && keyResult.issues.length) {
					const retryResult = def.keyType._zod.run({
						value: Number(key),
						issues: []
					}, ctx);
					if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (retryResult.issues.length === 0) keyResult = retryResult;
				}
				if (keyResult.issues.length) {
					if (def.mode === "loose") payload.value[key] = input[key];
					else if (values) {
						unrecognized = unrecognized ?? [];
						unrecognized.push(key);
					} else payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const outKey = keyResult.value;
				if (outKey === "__proto__") continue;
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}
			}
			if (unrecognized && unrecognized.length > 0) payload.issues.push({
				code: "unrecognized_keys",
				input,
				inst,
				keys: unrecognized,
				continue: true
			});
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
const $ZodEnum = $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	defineLazyInternal(inst, "pattern", (zod) => {
		const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
		return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
	});
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	globalConfig.memoizer?.guard(inst);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		return payload;
	};
});
function handleOptionalResult(payload, result) {
	payload.value = result.issues.length ? void 0 : result.value;
	return payload;
}
const $ZodOptional = $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	inst._zod.optout = "optional";
	defineLazyInternal(inst, "values", (zod) => {
		const values = zod.def.innerType._zod.values;
		return values ? new Set([...values, void 0]) : void 0;
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === void 0) {
			if (def.innerType._zod.optin !== "defaulted") return payload;
			const result = def.innerType._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
			return handleOptionalResult(payload, result);
		}
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodExactOptional = $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNullable = $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazyInternal(inst, "values", (zod) => {
		return zod.def.innerType._zod.values ? new Set([...zod.def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodDefault = $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNonOptional = $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => {
		const v = zod.def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
function handleCatchResult(payload, result, def, ctx) {
	if (!result.issues.length) {
		payload.value = result.value;
		if (result.memo) payload.memo = true;
		return payload;
	}
	payload.value = def.catchValue({
		...result,
		value: payload.value,
		error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
		input: payload.value
	});
	return payload;
}
const $ZodCatch = $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run({
			value: payload.value,
			issues: []
		}, ctx);
		if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
		return handleCatchResult(payload, result, def, ctx);
	};
});
const $ZodPipe = $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
const $ZodReadonly = $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	if (!payload.memo) payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodCustom = $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
var $ZodCyclicError = class extends Error {
	constructor() {
		super(`Cannot parse a reference cycle that closes through a transform`);
		this.name = "ZodCyclicError";
	}
};
const STATE = "~memo";
const NO_ISSUES = [];
function isRef(value) {
	return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
	return issues.map((iss) => iss.path ? {
		...iss,
		path: iss.path.slice()
	} : { ...iss });
}
const recursive = new WeakMap();
const NONE = 0;
const ASSUMED = 1;
const PROVEN = 2;
function isRecursive(inst, stack, resolve) {
	const cached = recursive.get(inst);
	if (cached !== void 0) return cached ? PROVEN : NONE;
	if (stack.has(inst)) return PROVEN;
	stack.add(inst);
	let result = NONE;
	const check = (child) => {
		if (result !== PROVEN && child?._zod) {
			const answer = isRecursive(child, stack, resolve);
			if (answer > result) result = answer;
		}
	};
	const shape = (sh, spread) => {
		let answer = NONE;
		for (const key of Reflect.ownKeys(sh)) {
			const desc = Object.getOwnPropertyDescriptor(sh, key);
			if (spread && !desc.enumerable) continue;
			const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
			if (child > answer) answer = child;
		}
		return answer;
	};
	const merge = (answer) => {
		if (answer > result) result = answer;
	};
	const def = inst._zod.def;
	switch (def.type) {
		case "object": {
			const raw = rawShape(def);
			merge(raw ? shape(raw, true) : ASSUMED);
			check(def.catchall);
			break;
		}
		case "array":
			check(def.element);
			break;
		case "tuple":
			for (const el of def.items) check(el);
			check(def.rest);
			break;
		case "record":
		case "map":
			check(def.keyType);
			check(def.valueType);
			break;
		case "set":
			check(def.valueType);
			break;
		case "union":
			for (const el of def.options) check(el);
			break;
		case "intersection":
			check(def.left);
			check(def.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			check(def.innerType);
			break;
		case "pipe":
			check(def.in);
			check(def.out);
			break;
		case "function":
			check(def.input);
			check(def.output);
			break;
		case "lazy": {
			const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
			merge(inner ? isRecursive(inner, stack, false) : ASSUMED);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (const key in def) {
			const desc = Object.getOwnPropertyDescriptor(def, key);
			if (!desc || desc.get) continue;
			const value = desc.value;
			if (!value || typeof value !== "object") continue;
			if (value._zod) check(value);
			else if (Array.isArray(value)) for (const el of value) check(el);
		}
	}
	stack.delete(inst);
	return settle(inst, result);
}
function settle(inst, answer) {
	if (answer !== ASSUMED) recursive.set(inst, answer === PROVEN);
	return answer;
}
function bucketFor(state, inst) {
	let bucket = state.buckets.get(inst);
	if (!bucket) {
		bucket = new WeakMap();
		state.buckets.set(inst, bucket);
	}
	return bucket;
}
let handoff;
const open = [];
const memo = {
	alloc(_inst, payload, empty) {
		const bucket = handoff;
		if (!bucket) return empty;
		handoff = void 0;
		const entry = {
			value: empty,
			issues: null
		};
		bucket.set(payload.value, entry);
		open.push(entry);
		return empty;
	},
	guard(inst) {
		var _a;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
				return base(payload, ctx);
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	},
	attach(inst) {
		var _a;
		let isRecursiveInst;
		let rechecked = false;
		let lastCtx;
		let lastBucket;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (isRecursiveInst === void 0) {
					const walked = isRecursive(inst, new Set(), false);
					if (walked === NONE) {
						inst._zod.parse = base;
						if (inst._zod.run === wrapped) inst._zod.run = base;
						return base(payload, ctx);
					}
					if (walked === PROVEN || rechecked) isRecursiveInst = true;
					else rechecked = true;
				}
				const input = payload.value;
				if (!isRef(input)) return base(payload, ctx);
				let state = ctx[STATE];
				if (!state) {
					state = {
						buckets: new WeakMap(),
						backEdges: void 0
					};
					ctx[STATE] = state;
				}
				let bucket;
				if (lastCtx === ctx) bucket = lastBucket;
				else {
					bucket = bucketFor(state, inst);
					lastCtx = ctx;
					lastBucket = bucket;
				}
				const hit = bucket.get(input);
				if (hit) {
					payload.value = hit.value;
					if (hit.issues) {
						if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
					} else {
						payload.memo = true;
						state.backEdges ?? (state.backEdges = new WeakSet());
						state.backEdges.add(hit.value);
					}
					return payload;
				}
				handoff = bucket;
				const depth = open.length;
				const result = base(payload, ctx);
				handoff = void 0;
				const entry = open.length > depth ? open.pop() : void 0;
				if (result instanceof Promise) return result.then((r) => {
					if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
					return r;
				});
				if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
				return result;
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	}
};
function memoizer() {
	return memo;
}
function isBackEdge(ctx, value) {
	const backEdges = ctx[STATE]?.backEdges;
	return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}
const error = () => {
	const Sizable = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = { nan: "NaN" };
	function getTypeName(type, input) {
		if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
		return TypeDictionary[type] ?? type;
	}
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
			case "invalid_value":
				if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
				return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
				return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
				if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
				return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				if (issue.inclusive === false) return "Invalid input: more than one option matched";
				return "Invalid input";
			case "invalid_element": return `Invalid value in ${issue.origin}`;
			default: return `Invalid input`;
		}
	};
};
function en_default() {
	return { localeError: error() };
}
var _a$2;
var $ZodRegistry = class {
	constructor() {
		this._map = new WeakMap();
		this._idmap = new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = new WeakMap();
		this._idmap = new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a$2 = globalThis).__zod_globalRegistry ?? (_a$2.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;
function snapshotChecks(def) {
	if (def.checks) def.checks = [...def.checks];
	return def;
}
function _string(Class, params) {
	return new Class(snapshotChecks({
		type: "string",
		...normalizeParams(params)
	}));
}
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
function _number(Class, params) {
	return new Class(snapshotChecks({
		type: "number",
		checks: [],
		...normalizeParams(params)
	}));
}
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
function _normalize(form) {
	return _overwrite((input) => input.normalize(form));
}
function _trim() {
	return _overwrite((input) => input.trim());
}
function _toLowerCase() {
	return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
	return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
	return _overwrite((input) => slugify(input));
}
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
function _superRefine(fn, params) {
	const ch = _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
function assignProps(target, ...sources) {
	for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
	return target;
}
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: params?.external ?? void 0
	};
}
function handleUnrepresentable(schema, ctx, json, params, message) {
	const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
		zodSchema: schema,
		path: params.path,
		message
	}) : ctx.unrepresentable;
	if (result === "any") return false;
	if (result === void 0 || result === "throw") throw new Error(message);
	Object.assign(json, result);
	return true;
}
function processSchema(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	ctx.sharedDefsExtractedFor = void 0;
	ctx.sharedEmitDoneFor = void 0;
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			processSchema(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) assignProps(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
	return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
	const idToSchema = new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
			};
		}
		const uriPrefix = `#`;
		const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
		if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + encodeJSONPointerSegment(defId)
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") extractToDef(entry);
		}
	}
	if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion(schema) {
	const options = schema.anyOf;
	if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
	const types = [];
	for (const option of options) {
		if (!option || typeof option !== "object") return;
		compactTypeUnion(option);
		const keys = Object.keys(option);
		if (keys.length !== 1 || keys[0] !== "type") return;
		const type = option.type;
		for (const member of Array.isArray(type) ? type : [type]) {
			if (typeof member !== "string") return;
			if (!types.includes(member)) types.push(member);
		}
	}
	delete schema.anyOf;
	schema.type = types.length === 1 ? types[0] : types;
}
const FOLDABLE_KEYS = new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]);
const UNION_KEYS = ["oneOf", "anyOf"];
function undeclaredConstraint(member) {
	const extra = member.additionalProperties;
	if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
	return Object.keys(extra).length ? extra : null;
}
function foldObjects(members) {
	const objects = [];
	for (const member of members) {
		if (typeof member !== "object" || member.type !== "object") return null;
		for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
		objects.push(member);
	}
	const properties = {};
	const required = new Set();
	for (const object of objects) {
		for (const key in object.properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
			const parts = [];
			for (const other of objects) {
				const part = other.properties?.[key] ?? undeclaredConstraint(other);
				if (part === null || part === void 0) continue;
				if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
			}
			assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
		}
		for (const key of object.required ?? []) required.add(key);
	}
	const folded = {
		type: "object",
		properties
	};
	if (required.size) folded.required = [...required];
	if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
	else {
		const constraints = [];
		for (const object of objects) {
			const constraint = undeclaredConstraint(object);
			if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
		}
		if (constraints.length === 1) folded.additionalProperties = constraints[0];
		else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
	}
	return folded;
}
function foldIntersection(json) {
	const allOf = json.allOf;
	if (!Array.isArray(allOf) || allOf.length < 2) return;
	for (const key of FOLDABLE_KEYS) if (key in json) return;
	const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
	let folded = null;
	if (!unions.length) folded = foldObjects(allOf);
	else {
		const union = unions[0];
		const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
		if (Object.keys(union).length !== 1) return;
		const rest = allOf.filter((m) => m !== union);
		const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
		if (branches.some((b) => !b)) return;
		folded = { [keyword]: branches };
	}
	if (!folded) return;
	delete json.allOf;
	assignProps(json, folded);
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else assignProps(schema, refSchema);
			assignProps(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
		for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
		if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
		for (const rewrite of ctx.deferred) rewrite();
		if (ctx.intersections.length) {
			const carriers = new Map();
			for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
				const allOf = json?.allOf;
				if (!Array.isArray(allOf)) continue;
				const existing = carriers.get(allOf);
				if (existing) existing.push(json);
				else carriers.set(allOf, [json]);
			}
			for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
		}
	}
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			assignProp(defs, seen.defId, seen.def);
		}
	}
	if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
	if (ctx.external) {} else if (Object.keys(defs).length > 0) {
		if (ctx.target === "draft-2020-12") result.$defs = defs;
		else result.definitions = defs;
	}
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const narrowMin = (agg, key, value) => {
	if (agg[key] === void 0 || value > agg[key]) agg[key] = value;
};
const narrowMax = (agg, key, value) => {
	if (agg[key] === void 0 || value < agg[key]) agg[key] = value;
};
const narrowBoth = (agg, value) => {
	narrowMin(agg, "minimum", value);
	narrowMax(agg, "maximum", value);
};
const addDivisor = (agg, value) => {
	agg.multipleOf ?? (agg.multipleOf = []);
	if (!agg.multipleOf.includes(value)) agg.multipleOf.push(value);
};
const addPattern = (agg, pattern) => {
	agg.patterns ?? (agg.patterns = new Set());
	agg.patterns.add(pattern);
};
const intersectMime = (agg, mime) => {
	agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
const setFormat = (agg, format) => {
	agg.format = format;
	if (format.includes("int")) agg.isInt = true;
};
const minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
const maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
const formatContributor = (ranges) => (agg, def) => {
	setFormat(agg, def.format);
	const [minimum, maximum] = ranges[def.format];
	narrowMin(agg, "minimum", minimum);
	narrowMax(agg, "maximum", maximum);
};
const contributors = {
	greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
	less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
	multiple_of: (agg, def) => addDivisor(agg, def.value),
	number_format: formatContributor(NUMBER_FORMAT_RANGES),
	bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
	min_length: minContributor,
	max_length: maxContributor,
	length_equals: (agg, def) => narrowBoth(agg, def.length),
	min_size: minContributor,
	max_size: maxContributor,
	size_equals: (agg, def) => narrowBoth(agg, def.size),
	string_format: (agg, def) => {
		setFormat(agg, def.format);
		if (def.pattern) addPattern(agg, def.pattern);
		if (def.format === "base64" || def.format === "base64url") agg.contentEncoding = def.format;
		if (def.local || def.precision === -1) agg.laxFormat = true;
	},
	mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
	const agg = {};
	const def = schema._zod.def;
	const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
	for (const ch of list) contributors[ch._zod.def.check]?.(agg, ch._zod.def);
	const bag = schema._zod.bag;
	if (bag.minimum !== void 0) narrowMin(agg, "minimum", bag.minimum);
	if (bag.exclusiveMinimum !== void 0) narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
	if (bag.maximum !== void 0) narrowMax(agg, "maximum", bag.maximum);
	if (bag.exclusiveMaximum !== void 0) narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
	if (bag.multipleOf !== void 0) addDivisor(agg, bag.multipleOf);
	if (bag.format !== void 0) {
		agg.format ?? (agg.format = bag.format);
		if (bag.format.includes("int")) agg.isInt = true;
	}
	if (bag.mime) intersectMime(agg, bag.mime);
	for (const pattern of bag.patterns ?? []) addPattern(agg, pattern);
	return agg;
}
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const exactPatterns = new Map([[base64Charset, base64], [base64urlCharset, base64url]]);
const exactPattern = (p) => exactPatterns.get(p) ?? p;
const stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time" || laxFormat) delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const patternList = [...patterns].map(exactPattern);
		if (patternList.length === 1) json.pattern = patternList[0].source;
		else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
	json.type = isInt ? "integer" : "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) {
		if (legacy) {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
	} else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) {
		if (legacy) {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
	} else if (typeof maximum === "number") json.maximum = maximum;
	if (multipleOf) {
		const divisors = new Set();
		for (const divisor of multipleOf) if (Number.isFinite(divisor) && divisor !== 0) divisors.add(Math.abs(divisor));
		else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
		const [first, ...rest] = divisors;
		if (first !== void 0) json.multipleOf = first;
		if (rest.length) json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
	}
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.length === 0) {
		json.not = {};
		return;
	}
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const customProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = processSchema(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
function inputOptin(schema) {
	const def = schema._zod.def;
	if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
	if (def.type === "catch") return inputOptin(def.innerType);
	return schema._zod.optin;
}
const objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const shape = def.shape;
	if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
	json.type = "object";
	json.properties = {};
	for (const key in shape) assignProp(json.properties, key, processSchema(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	}));
	const requiredKeys = [];
	for (const key of Object.keys(shape)) {
		const field = def.shape[key];
		if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) requiredKeys.push(key);
	}
	if (requiredKeys.length > 0) json.required = requiredKeys;
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = processSchema(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => processSchema(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = processSchema(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = processSchema(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	json.allOf = allOf;
	ctx.intersections.push(allOf);
};
function stringifyKeyNames(bySchema, json, visited) {
	if (json.$ref) {
		if (visited.has(json)) return json;
		visited.add(json);
		const def = bySchema.get(json)?.def;
		if (!def) return json;
		const inlined = stringifyKeyNames(bySchema, def, visited);
		return inlined === def ? json : inlined;
	}
	for (const keyword of ["anyOf", "oneOf"]) {
		const branches = json[keyword];
		if (!Array.isArray(branches)) continue;
		const mapped = branches.map((branch) => stringifyKeyNames(bySchema, branch, visited));
		if (mapped.some((branch, i) => branch !== branches[i])) json = {
			...json,
			[keyword]: mapped
		};
	}
	const types = Array.isArray(json.type) ? json.type : [json.type];
	const numericType = !types.includes("string") && types.some((t) => t === "number" || t === "integer");
	const values = json.enum ?? (json.const !== void 0 ? [json.const] : void 0);
	if (!numericType && !values?.some((v) => typeof v === "number")) return json;
	const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json;
	if (rest.enum) rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
	else if (typeof rest.const === "number") rest.const = String(rest.const);
	if (!numericType) return rest;
	rest.type = "string";
	if (!values) rest.pattern = (types.includes("number") ? number$1 : integer).source;
	return rest;
}
const pendingRecords = new WeakMap();
function rewriteKeyNames(ctx) {
	const bySchema = new Map();
	for (const entry of ctx.seen.values()) if (entry.def && !bySchema.has(entry.schema)) bySchema.set(entry.schema, entry);
	const rewrites = new Map();
	for (const record of pendingRecords.get(ctx) ?? []) {
		const seen = ctx.seen.get(record);
		const names = (seen?.def ?? seen?.schema)?.propertyNames;
		if (!names || names === true || rewrites.has(names)) continue;
		const rewritten = stringifyKeyNames(bySchema, names, new Set());
		if (rewritten !== names) rewrites.set(names, rewritten);
	}
	if (!rewrites.size) return;
	for (const entry of ctx.seen.values()) for (const carrier of [entry.schema, entry.def]) {
		const rewritten = carrier && rewrites.get(carrier.propertyNames);
		if (rewritten) carrier.propertyNames = rewritten;
	}
}
const recordProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	const keyType = def.keyType;
	const patterns = aggregateChecks(keyType).patterns;
	if (def.mode === "loose" && patterns && patterns.size > 0) {
		const valueSchema = processSchema(def.valueType, ctx, {
			...params,
			path: [
				...params.path,
				"patternProperties",
				"*"
			]
		});
		json.patternProperties = {};
		for (const pattern of patterns) assignProp(json.patternProperties, exactPattern(pattern).source, valueSchema);
	} else {
		if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
			json.propertyNames = processSchema(def.keyType, ctx, {
				...params,
				path: [...params.path, "propertyNames"]
			});
			let pending = pendingRecords.get(ctx);
			if (!pending) {
				pending = [];
				pendingRecords.set(ctx, pending);
				ctx.deferred.push(() => rewriteKeyNames(ctx));
			}
			pending.push(schema);
		}
		json.additionalProperties = processSchema(def.valueType, ctx, {
			...params,
			path: [...params.path, "additionalProperties"]
		});
	}
	const keyValues = keyType._zod.values;
	const omittableOnInput = ctx.io === "input" && inputOptin(def.valueType) !== void 0;
	if (keyValues && !def.partial && !omittableOnInput) {
		const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
		if (validKeyValues.length > 0) json.required = validKeyValues.map(String);
	}
};
const nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
const UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
	let unrepresentable = false;
	const serialized = JSON.stringify(value, (_, val) => {
		if (typeof val !== "bigint") return val;
		unrepresentable = true;
		return null;
	});
	if (!unrepresentable) return JSON.parse(serialized);
	handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
	return UNREPRESENTABLE_DEFAULT;
}
const defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
};
const prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io !== "input") return;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
};
const catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	processSchema(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
const _installedErrorProtos = new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
	Object.defineProperty(proto, key, {
		configurable: true,
		enumerable: false,
		get() {
			const value = make(this);
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
			return value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
		}
	});
}
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	const proto = Object.getPrototypeOf(inst);
	if (_installedErrorProtos.has(proto)) return;
	_installedErrorProtos.add(proto);
	_lazyMethod(proto, "format", (self) => (mapper) => formatError$1(self, mapper));
	_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
	_lazyMethod(proto, "addIssue", (self) => (issue) => {
		self.issues.push(issue);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	_lazyMethod(proto, "addIssues", (self) => (issues) => {
		self.issues.push(...issues);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	Object.defineProperty(proto, "isEmpty", {
		configurable: true,
		enumerable: false,
		get() {
			return this.issues.length === 0;
		}
	});
};
const ZodRealError = $constructor("ZodError", initializer, void 0, { Parent: Error });
const parse = _parse(ZodRealError);
const parseAsync = _parseAsync(ZodRealError);
const safeParse = _safeParse(ZodRealError);
const safeParseAsync = _safeParseAsync(ZodRealError);
const encode = _encode(ZodRealError);
const decode = _decode(ZodRealError);
const encodeAsync = _encodeAsync(ZodRealError);
const decodeAsync = _decodeAsync(ZodRealError);
const safeEncode = _safeEncode(ZodRealError);
const safeDecode = _safeDecode(ZodRealError);
const safeEncodeAsync = _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = _safeDecodeAsync(ZodRealError);
function _ensureDefaultLocale() {
	if (!globalConfig.localeError) config(en_default());
}
function _ensureDefaultMemoizer() {
	if (!globalConfig.memoizer) config({ memoizer: memoizer() });
}
const ZodType = $constructor("ZodType", (inst, def) => {
	_ensureDefaultLocale();
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
	return inst;
}, {
	check(...chks) {
		const def = this.def;
		return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
			check: ch,
			def: { check: "custom" },
			onattach: []
		} } : ch)] }), { parent: true });
	},
	with(...chks) {
		return this.check(...chks);
	},
	clone(def, params) {
		return clone(this, def, params);
	},
	brand() {
		return this;
	},
	register(reg, meta) {
		reg.add(this, meta);
		return this;
	},
	refine(check, params) {
		return this.check(refine(check, params));
	},
	superRefine(refinement, params) {
		return this.check(superRefine(refinement, params));
	},
	overwrite(fn) {
		return this.check(_overwrite(fn));
	},
	optional() {
		return optional(this);
	},
	exactOptional() {
		return exactOptional(this);
	},
	nullable() {
		return nullable(this);
	},
	nullish() {
		return optional(nullable(this));
	},
	nonoptional(params) {
		return nonoptional(this, params);
	},
	array() {
		return array(this);
	},
	or(arg) {
		return union([this, arg]);
	},
	and(arg) {
		return intersection(this, arg);
	},
	transform(tx) {
		return pipe(this, transform(tx));
	},
	default(d) {
		return _default(this, d);
	},
	prefault(d) {
		return prefault(this, d);
	},
	catch(params) {
		return _catch(this, params);
	},
	pipe(target) {
		return pipe(this, target);
	},
	readonly() {
		return readonly(this);
	},
	describe(description) {
		const cl = this.clone();
		globalRegistry.add(cl, { description });
		return cl;
	},
	meta(...args) {
		if (args.length === 0) return globalRegistry.get(this);
		const cl = this.clone();
		globalRegistry.add(cl, args[0]);
		return cl;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(fn, ...args) {
		return args.length === 0 ? fn(this) : fn(this, ...args);
	},
	get "~standard"() {
		return hide(this, "~standard", {
			...standardProps(this),
			jsonSchema: {
				input: createStandardJSONSchemaMethod(this, "input"),
				output: createStandardJSONSchemaMethod(this, "output")
			}
		});
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	},
	parse: function _parse(data, params) {
		return parse(this, data, params, { callee: _parse });
	},
	parseAsync: async function _parseAsync(data, params) {
		return await parseAsync(this, data, params, { callee: _parseAsync });
	},
	safeParse(data, params) {
		return safeParse(this, data, params);
	},
	async safeParseAsync(data, params) {
		return safeParseAsync(this, data, params);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(value) {
		own(this, "spa", value);
	},
	validate(data, params) {
		return validate(this, data, params);
	},
	validateAsync(data, params) {
		return validateAsync$1(this, data, params);
	},
	encode: function _encode(data, params) {
		return encode(this, data, params, { callee: _encode });
	},
	decode: function _decode(data, params) {
		return decode(this, data, params, { callee: _decode });
	},
	encodeAsync: async function _encodeAsync(data, params) {
		return await encodeAsync(this, data, params, { callee: _encodeAsync });
	},
	decodeAsync: async function _decodeAsync(data, params) {
		return await decodeAsync(this, data, params, { callee: _decodeAsync });
	},
	safeEncode(data, params) {
		return safeEncode(this, data, params);
	},
	safeDecode(data, params) {
		return safeDecode(this, data, params);
	},
	async safeEncodeAsync(data, params) {
		return safeEncodeAsync(this, data, params);
	},
	async safeDecodeAsync(data, params) {
		return safeDecodeAsync(this, data, params);
	},
	toJSONSchema(params) {
		return createToJSONSchemaMethod(this, {})(params);
	},
	get description() {
		return globalRegistry.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
});
const _ZodString = $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
}, derived({
	format: (inst) => aggregateChecks(inst).format ?? null,
	minLength: (inst) => aggregateChecks(inst).minimum ?? null,
	maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
	regex(...args) {
		return this.check(_regex(...args));
	},
	includes(...args) {
		return this.check(_includes(...args));
	},
	startsWith(...args) {
		return this.check(_startsWith(...args));
	},
	endsWith(...args) {
		return this.check(_endsWith(...args));
	},
	min(...args) {
		return this.check(_minLength(...args));
	},
	max(...args) {
		return this.check(_maxLength(...args));
	},
	length(...args) {
		return this.check(_length(...args));
	},
	nonempty(...args) {
		return this.check(_minLength(1, ...args));
	},
	lowercase(params) {
		return this.check(_lowercase(params));
	},
	uppercase(params) {
		return this.check(_uppercase(params));
	},
	trim() {
		return this.check(_trim());
	},
	normalize(...args) {
		return this.check(_normalize(...args));
	},
	toLowerCase() {
		return this.check(_toLowerCase());
	},
	toUpperCase() {
		return this.check(_toUpperCase());
	},
	slugify() {
		return this.check(_slugify());
	}
}));
const ZodString = $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
}, {
	email(params) {
		return this.check(_email(ZodEmail, params));
	},
	url(params) {
		return this.check(_url(ZodURL, params));
	},
	jwt(params) {
		return this.check(_jwt(ZodJWT, params));
	},
	emoji(params) {
		return this.check(_emoji(ZodEmoji, params));
	},
	guid(params) {
		return this.check(_guid(ZodGUID, params));
	},
	uuid(params) {
		return this.check(_uuid(ZodUUID, params));
	},
	uuidv4(params) {
		return this.check(_uuidv4(ZodUUID, params));
	},
	uuidv6(params) {
		return this.check(_uuidv6(ZodUUID, params));
	},
	uuidv7(params) {
		return this.check(_uuidv7(ZodUUID, params));
	},
	nanoid(params) {
		return this.check(_nanoid(ZodNanoID, params));
	},
	cuid(params) {
		return this.check(_cuid(ZodCUID, params));
	},
	cuid2(params) {
		return this.check(_cuid2(ZodCUID2, params));
	},
	ulid(params) {
		return this.check(_ulid(ZodULID, params));
	},
	base64(params) {
		return this.check(_base64(ZodBase64, params));
	},
	base64url(params) {
		return this.check(_base64url(ZodBase64URL, params));
	},
	xid(params) {
		return this.check(_xid(ZodXID, params));
	},
	ksuid(params) {
		return this.check(_ksuid(ZodKSUID, params));
	},
	ipv4(params) {
		return this.check(_ipv4(ZodIPv4, params));
	},
	ipv6(params) {
		return this.check(_ipv6(ZodIPv6, params));
	},
	cidrv4(params) {
		return this.check(_cidrv4(ZodCIDRv4, params));
	},
	cidrv6(params) {
		return this.check(_cidrv6(ZodCIDRv6, params));
	},
	e164(params) {
		return this.check(_e164(ZodE164, params));
	},
	datetime(params) {
		return this.check(_isoDateTime(ZodISODateTime, params));
	},
	date(params) {
		return this.check(_isoDate(ZodISODate, params));
	},
	time(params) {
		return this.check(_isoTime(ZodISOTime, params));
	},
	duration(params) {
		return this.check(_isoDuration(ZodISODuration, params));
	}
});
function string(params) {
	return _string(ZodString, params);
}
const ZodStringFormat = $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodISODateTime = $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODate = $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISOTime = $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODuration = $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmail = $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmoji = $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID = $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	inst.isFinite = true;
}, derived({
	minValue: (inst) => {
		const { minimum, exclusiveMinimum } = aggregateChecks(inst);
		return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
	},
	maxValue: (inst) => {
		const { maximum, exclusiveMaximum } = aggregateChecks(inst);
		return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
	},
	isInt: (inst) => {
		const { isInt, multipleOf } = aggregateChecks(inst);
		return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
	},
	format: (inst) => aggregateChecks(inst).format ?? null
}, {
	gt(value, params) {
		return this.check(_gt(value, params));
	},
	gte(value, params) {
		return this.check(_gte(value, params));
	},
	min(value, params) {
		return this.check(_gte(value, params));
	},
	lt(value, params) {
		return this.check(_lt(value, params));
	},
	lte(value, params) {
		return this.check(_lte(value, params));
	},
	max(value, params) {
		return this.check(_lte(value, params));
	},
	int(params) {
		return this.check(int(params));
	},
	safe(params) {
		return this.check(int(params));
	},
	positive(params) {
		return this.check(_gt(0, params));
	},
	nonnegative(params) {
		return this.check(_gte(0, params));
	},
	negative(params) {
		return this.check(_lt(0, params));
	},
	nonpositive(params) {
		return this.check(_lte(0, params));
	},
	multipleOf(value, params) {
		return this.check(_multipleOf(value, params));
	},
	step(value, params) {
		return this.check(_multipleOf(value, params));
	},
	finite() {
		return this;
	}
}));
function number(params) {
	return _number(ZodNumber, params);
}
const ZodNumberFormat = $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return _int(ZodNumberFormat, params);
}
const ZodBoolean = $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean(params) {
	return _boolean(ZodBoolean, params);
}
const ZodUnknown = $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return _unknown(ZodUnknown);
}
const ZodNever = $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return _never(ZodNever, params);
}
const ZodArray = $constructor("ZodArray", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
}, {
	min(n, params) {
		return this.check(_minLength(n, params));
	},
	nonempty(params) {
		return this.check(_minLength(1, params));
	},
	max(n, params) {
		return this.check(_maxLength(n, params));
	},
	length(n, params) {
		return this.check(_length(n, params));
	},
	unwrap() {
		return this.element;
	}
});
function array(element, params) {
	return _array(ZodArray, element, params);
}
const ZodObject = $constructor("ZodObject", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
	keyof() {
		return _enum(Object.keys(this._zod.def.shape));
	},
	catchall(catchall) {
		return this.clone(mergeDefs(this._zod.def, { catchall }));
	},
	passthrough() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	loose() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	strict() {
		return this.clone(mergeDefs(this._zod.def, { catchall: never() }));
	},
	strip() {
		return this.clone(mergeDefs(this._zod.def, { catchall: void 0 }));
	},
	extend(incoming) {
		return extend(this, incoming);
	},
	safeExtend(incoming) {
		return safeExtend(this, incoming);
	},
	merge(other) {
		return merge(this, other);
	},
	pick(mask) {
		return pick(this, mask);
	},
	omit(mask) {
		return omit(this, mask);
	},
	partial(...args) {
		return partial(ZodOptional, this, args[0]);
	},
	exactPartial(...args) {
		return partial(ZodExactOptional, this, args[0], "exactPartial");
	},
	required(...args) {
		return required(ZodNonOptional, this, args[0]);
	}
});
function object(shape, params) {
	const def = {
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	};
	return new ZodObject(def);
}
const ZodUnion = $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodIntersection = $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodRecord = $constructor("ZodRecord", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodRecord.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
	inst.keyType = def.keyType;
	inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
	if (!valueType || !valueType._zod) return new ZodRecord({
		type: "record",
		keyType: string(),
		valueType: keyType,
		...normalizeParams(valueType)
	});
	return new ZodRecord({
		type: "record",
		keyType,
		valueType,
		...normalizeParams(params)
	});
}
const ZodEnum = $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = [...inst._zod.values];
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	return new ZodEnum({
		type: "enum",
		entries,
		...normalizeParams(params)
	});
}
const ZodTransform = $constructor("ZodTransform", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			return payload;
		});
		payload.value = output;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
	});
}
const ZodPipe = $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodCustom = $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return _superRefine(fn, params);
}
const STORE_KEYS = ["urbanthread", "glowlab"];
const STORES = Object.freeze({
	urbanthread: Object.freeze({
		key: "urbanthread",
		name: "UrbanThread",
		domain: "urbanthreads-9991.myshopify.com"
	}),
	glowlab: Object.freeze({
		key: "glowlab",
		name: "GlowLab",
		domain: "shelf-mate.myshopify.com"
	})
});
const UCP_MCP_PATH = "/api/ucp/mcp";
var InvalidStoreError = class extends Error {
	constructor() {
		super(`Invalid store. Allowed values: ${STORE_KEYS.join(", ")}.`);
		this.code = "invalid_store";
		this.name = "InvalidStoreError";
	}
};
function isStoreKey(value) {
	return typeof value === "string" && Object.prototype.hasOwnProperty.call(STORES, value);
}
function resolveStore(value) {
	if (!isStoreKey(value)) throw new InvalidStoreError();
	return STORES[value];
}
function getMcpUrl(store) {
	return `https://${store.domain}${UCP_MCP_PATH}`;
}
const storeSchema = _enum(STORE_KEYS).describe("Which store to use: \"urbanthread\" (apparel) or \"glowlab\" (beauty/skincare). Never mix stores.");
const productIdSchema = string().regex(/^gid:\/\/shopify\/Product\/\d+$/, "Must be a product GID: gid://shopify/Product/<digits>").describe("Product ID returned by the catalog, e.g. gid://shopify/Product/123");
const variantIdSchema = string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/, "Must be a variant GID: gid://shopify/ProductVariant/<digits>").describe("Product variant ID returned by the catalog, e.g. gid://shopify/ProductVariant/123");
const productOrVariantIdSchema = string().regex(/^gid:\/\/shopify\/(Product|ProductVariant)\/\d+$/, "Must be a product or variant GID returned by the catalog");
const cartIdSchema = string().regex(/^gid:\/\/shopify\/Cart\/[A-Za-z0-9_-]+(\?key=[A-Za-z0-9_-]+)?$/, "Must be a cart GID: gid://shopify/Cart/<id>[?key=<key>]").describe("Cart ID exactly as returned by createCart/getCart (including any ?key=...)");
const quantitySchema = number().int("Quantity must be an integer").positive("Quantity must be positive").max(100, "Quantity must be at most 100");
const countrySchema = string().regex(/^[A-Z]{2}$/, "Use a 2-letter ISO 3166-1 country code, e.g. IN").default("IN").describe("Buyer country (ISO 3166-1 alpha-2). Defaults to IN.");
const lineItemInputSchema = object({
	variantId: variantIdSchema,
	quantity: quantitySchema
});
function uniqueVariants(items) {
	return new Set(items.map((i) => i.variantId)).size === items.length;
}
const searchProductsInput = object({
	store: storeSchema,
	query: string().trim().min(1).max(200).optional().describe("Natural-language search text"),
	categories: array(string().min(1).max(100)).max(10).optional(),
	minPrice: number().int().nonnegative().optional().describe("Minimum price in minor currency units"),
	maxPrice: number().int().nonnegative().optional().describe("Maximum price in minor currency units"),
	availableOnly: boolean().optional().describe("Only sale-ready items (Shopify default true)"),
	limit: number().int().min(1).max(20).default(5),
	cursor: string().min(1).max(2e3).optional().describe("pagination.cursor from a previous search"),
	country: countrySchema
}).refine((v) => v.query !== void 0 || (v.categories?.length ?? 0) > 0 || v.minPrice !== void 0 || v.maxPrice !== void 0, { message: "Provide at least a query or a filter" }).refine((v) => v.minPrice === void 0 || v.maxPrice === void 0 || v.minPrice <= v.maxPrice, { message: "minPrice must be <= maxPrice" });
const lookupProductsInput = object({
	store: storeSchema,
	ids: array(productOrVariantIdSchema).min(1).max(10),
	country: countrySchema
});
const getProductDetailsInput = object({
	store: storeSchema,
	productId: productIdSchema,
	country: countrySchema
});
const createCartInput = object({
	store: storeSchema,
	lineItems: array(lineItemInputSchema).min(1).max(20).refine(uniqueVariants, "Each variant may appear only once; combine quantities"),
	country: countrySchema
});
const getCartInput = object({
	store: storeSchema,
	cartId: cartIdSchema
});
const updateCartInput = object({
	store: storeSchema,
	cartId: cartIdSchema,
	setItems: array(lineItemInputSchema).max(20).default([]).describe("Variants to add, or whose quantity to set to the given value"),
	removeVariantIds: array(variantIdSchema).max(20).default([]).describe("Variants to remove"),
	country: countrySchema
}).refine((v) => v.setItems.length + v.removeVariantIds.length > 0, { message: "Provide setItems and/or removeVariantIds" }).refine((v) => uniqueVariants(v.setItems), "Each variant may appear only once in setItems").refine((v) => !v.setItems.some((i) => v.removeVariantIds.includes(i.variantId)), "A variant cannot be both set and removed");
const cancelCartInput = object({
	store: storeSchema,
	cartId: cartIdSchema
});
const APPROVED_UCP_TOOLS = [
	"search_catalog",
	"lookup_catalog",
	"get_product",
	"create_cart",
	"get_cart",
	"update_cart",
	"cancel_cart"
];
var UcpError = class extends Error {
	constructor(code, message, status) {
		super(message);
		this.name = "UcpError";
		this.code = code;
		this.status = status;
	}
};
const moneySchema = object({
	amount: number(),
	currency: string()
}).passthrough();
const variantSchema = object({
	id: string(),
	title: string().optional(),
	sku: string().optional(),
	price: moneySchema.optional(),
	availability: object({ available: boolean().optional() }).passthrough().optional(),
	options: array(object({
		name: string(),
		label: string()
	}).passthrough()).optional()
}).passthrough();
const productSchema = object({
	id: string(),
	title: string(),
	url: string().optional(),
	description: object({ html: string().optional() }).passthrough().optional(),
	price_range: object({
		min: moneySchema,
		max: moneySchema
	}).passthrough().optional(),
	variants: array(variantSchema).default([]),
	tags: array(string()).optional()
}).passthrough();
const totalSchema = object({
	type: string(),
	amount: number(),
	display_text: string().optional()
}).passthrough();
const cartSchema = object({
	id: string(),
	currency: string().optional(),
	line_items: array(object({
		id: string().optional(),
		quantity: number(),
		item: object({
			id: string(),
			title: string().optional(),
			price: number().optional()
		}).passthrough(),
		totals: array(totalSchema).optional()
	}).passthrough()).default([]),
	totals: array(totalSchema).optional(),
	expires_at: string().optional(),
	messages: array(record(string(), unknown())).optional()
}).passthrough();
function parseOrThrow(schema, value, what) {
	const parsed = schema.safeParse(value);
	if (!parsed.success) throw new UcpError("invalid_response", `Shopify returned an invalid ${what} response.`);
	return parsed.data;
}
function formatMoney(amount, currency) {
	try {
		const fmt = new Intl.NumberFormat("en", {
			style: "currency",
			currency
		});
		const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
		return fmt.format(amount / 10 ** digits);
	} catch {
		return `${amount} ${currency} (minor units)`;
	}
}
function money(m) {
	return {
		amount: m.amount,
		currency: m.currency,
		formatted: formatMoney(m.amount, m.currency)
	};
}
function stripHtml(html, max = 300) {
	if (!html) return void 0;
	const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
	return text.length > max ? `${text.slice(0, max)}…` : text;
}
function summarizeProduct(raw) {
	const p = parseOrThrow(productSchema, raw, "product");
	return {
		id: p.id,
		title: p.title,
		url: p.url,
		description: stripHtml(p.description?.html),
		priceRange: p.price_range ? {
			min: money(p.price_range.min),
			max: money(p.price_range.max)
		} : void 0,
		variants: p.variants.map((v) => ({
			id: v.id,
			title: v.title ?? "",
			sku: v.sku,
			price: v.price ? money(v.price) : void 0,
			available: v.availability?.available,
			options: (v.options ?? []).map((o) => ({
				name: o.name,
				label: o.label
			}))
		})),
		tags: p.tags
	};
}
function summarizeCart(raw, fallbackCurrency = "INR") {
	const c = parseOrThrow(cartSchema, raw, "cart");
	const currency = c.currency ?? fallbackCurrency;
	const fmtTotals = (t) => (t ?? []).map((x) => ({
		type: x.type,
		amount: x.amount,
		formatted: formatMoney(x.amount, currency)
	}));
	return {
		id: c.id,
		currency: c.currency,
		lineItems: c.line_items.map((l) => ({
			lineId: l.id,
			variantId: l.item.id,
			title: l.item.title,
			quantity: l.quantity,
			unitPriceMinor: l.item.price,
			totals: fmtTotals(l.totals)
		})),
		totals: fmtTotals(c.totals),
		expiresAt: c.expires_at,
		messages: (c.messages ?? []).map((m) => ({
			type: typeof m.type === "string" ? m.type : void 0,
			text: typeof (m.content ?? m.text) === "string" ? String(m.content ?? m.text) : void 0
		}))
	};
}
function context(country) {
	return { address_country: country };
}
async function searchProducts(client, input, signal) {
	const store = resolveStore(input.store);
	const filters = {};
	if (input.categories?.length) filters.categories = input.categories;
	if (input.minPrice !== void 0 || input.maxPrice !== void 0) filters.price = {
		...input.minPrice !== void 0 ? { min: input.minPrice } : {},
		...input.maxPrice !== void 0 ? { max: input.maxPrice } : {}
	};
	if (input.availableOnly !== void 0) filters.available = input.availableOnly;
	const catalog = {
		...input.query ? { query: input.query } : {},
		context: context(input.country),
		...Object.keys(filters).length ? { filters } : {},
		pagination: {
			limit: input.limit,
			...input.cursor ? { cursor: input.cursor } : {}
		}
	};
	const res = await client.callTool(store.key, "search_catalog", { catalog }, { signal });
	if (!Array.isArray(res.products)) throw new UcpError("invalid_response", "search_catalog response had no products array.");
	const pagination = res.pagination ?? {};
	return {
		store: store.key,
		products: res.products.map(summarizeProduct),
		pagination: {
			hasNextPage: pagination.has_next_page === true,
			cursor: pagination.cursor
		}
	};
}
async function lookupProducts(client, input, signal) {
	const store = resolveStore(input.store);
	const res = await client.callTool(store.key, "lookup_catalog", { catalog: {
		ids: input.ids,
		context: context(input.country)
	} }, { signal });
	if (!Array.isArray(res.products)) throw new UcpError("invalid_response", "lookup_catalog response had no products array.");
	return {
		store: store.key,
		products: res.products.map(summarizeProduct)
	};
}
async function getProductDetails(client, input, signal) {
	const store = resolveStore(input.store);
	const res = await client.callTool(store.key, "get_product", { catalog: {
		id: input.productId,
		context: context(input.country)
	} }, { signal });
	if (!res.product) throw new UcpError("invalid_response", "get_product response had no product.");
	return {
		store: store.key,
		product: summarizeProduct(res.product)
	};
}
async function verifyVariantsInStore(client, storeKey, variantIds, country, signal) {
	if (variantIds.length === 0) return;
	const found = new Map();
	for (let i = 0; i < variantIds.length; i += 10) {
		const chunk = variantIds.slice(i, i + 10);
		const res = await client.callTool(storeKey, "lookup_catalog", { catalog: {
			ids: chunk,
			context: context(country)
		} }, { signal });
		if (!Array.isArray(res.products)) throw new UcpError("invalid_response", "lookup_catalog response had no products array.");
		for (const product of res.products) {
			const p = parseOrThrow(productSchema, product, "product");
			for (const v of p.variants) found.set(v.id, v.availability?.available);
		}
	}
	const missing = variantIds.filter((id) => !found.has(id));
	if (missing.length > 0) throw new UcpError("validation", `Variant(s) not found in store "${storeKey}": ${missing.join(", ")}. Use IDs from this store's catalog.`);
	const unavailable = variantIds.filter((id) => found.get(id) === false);
	if (unavailable.length > 0) throw new UcpError("validation", `Variant(s) not available: ${unavailable.join(", ")}.`);
}
function toLineItems(items) {
	return items.map((i) => ({
		quantity: i.quantity,
		item: { id: i.variantId }
	}));
}
async function createCart(client, input, signal) {
	const store = resolveStore(input.store);
	await verifyVariantsInStore(client, store.key, input.lineItems.map((i) => i.variantId), input.country, signal);
	const res = await client.callTool(store.key, "create_cart", { cart: {
		line_items: toLineItems(input.lineItems),
		context: context(input.country)
	} }, { signal });
	return {
		store: store.key,
		cart: summarizeCart(res)
	};
}
async function getCart(client, input, signal) {
	const store = resolveStore(input.store);
	const res = await client.callTool(store.key, "get_cart", { id: input.cartId }, { signal });
	return {
		store: store.key,
		cart: summarizeCart(res)
	};
}
function mergeLineItems(existing, setItems, removeVariantIds) {
	const merged = new Map();
	for (const l of existing) merged.set(l.variantId, (merged.get(l.variantId) ?? 0) + l.quantity);
	for (const s of setItems) merged.set(s.variantId, s.quantity);
	for (const id of removeVariantIds) merged.delete(id);
	return [...merged.entries()].map(([variantId, quantity]) => ({
		variantId,
		quantity
	}));
}
async function updateCart(client, input, signal) {
	const store = resolveStore(input.store);
	const current = summarizeCart(await client.callTool(store.key, "get_cart", { id: input.cartId }, { signal }));
	const existingIds = new Set(current.lineItems.map((l) => l.variantId));
	const unknownRemovals = input.removeVariantIds.filter((id) => !existingIds.has(id));
	if (unknownRemovals.length > 0) throw new UcpError("validation", `Cannot remove variants not in the cart: ${unknownRemovals.join(", ")}.`);
	const desired = mergeLineItems(current.lineItems, input.setItems, input.removeVariantIds);
	if (desired.length === 0) throw new UcpError("validation", "Update would empty the cart. Use cancelCart instead.");
	await verifyVariantsInStore(client, store.key, input.setItems.map((i) => i.variantId).filter((id) => !existingIds.has(id)), input.country, signal);
	const cart = summarizeCart(await client.callTool(store.key, "update_cart", {
		id: input.cartId,
		cart: {
			line_items: toLineItems(desired),
			context: context(input.country)
		}
	}, { signal }));
	const actual = new Map();
	for (const l of cart.lineItems) actual.set(l.variantId, (actual.get(l.variantId) ?? 0) + l.quantity);
	if (!(actual.size === desired.length && desired.every((d) => actual.get(d.variantId) === d.quantity))) throw new UcpError("invalid_response", "Shopify's updated cart does not match the intended line items. Re-read the cart with getCart.");
	return {
		store: store.key,
		previous: current.lineItems,
		cart
	};
}
async function cancelCart(client, input, signal) {
	const store = resolveStore(input.store);
	const res = await client.callTool(store.key, "cancel_cart", { id: input.cartId }, {
		signal,
		meta: { "idempotency-key": randomUUID() }
	});
	const parsed = cartSchema.safeParse(res);
	return {
		store: store.key,
		cartId: input.cartId,
		cancelled: true,
		status: typeof res.status === "string" ? res.status : void 0,
		cart: parsed.success ? summarizeCart(parsed.data) : void 0
	};
}
const createCartApproval = {
	request: always(),
	prompt: ({ input }) => `Create a new ${input.store} cart with ${input.lineItems.map((i) => `${i.quantity} x ${i.variantId}`).join(", ")}?`
};
const updateCartApproval = {
	request: always(),
	prompt: ({ input }) => {
		const sets = input.setItems.map((i) => `set ${i.variantId} to ${i.quantity}`);
		const removes = input.removeVariantIds.map((id) => `remove ${id}`);
		return `Update ${input.store} cart: ${[...sets, ...removes].join("; ")} (other lines are kept)?`;
	}
};
const cancelCartApproval = {
	request: always(),
	prompt: ({ input }) => `Cancel the ${input.store} cart ${input.cartId.split("?")[0]}?`
};
function isRecord$3(v) {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}
function parseBody(text, contentType) {
	let payload = text;
	if (contentType.includes("text/event-stream")) payload = text.split(/\r?\n/).filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).at(-1) ?? "";
	try {
		return JSON.parse(payload);
	} catch {
		throw new UcpError("invalid_json", "Shopify returned a non-JSON response.");
	}
}
function describeMessages(messages) {
	if (!Array.isArray(messages)) return void 0;
	return messages.filter(isRecord$3).map((m) => [m.code, m.content ?? m.text ?? m.message].filter(Boolean).join(": ")).filter(Boolean).join("; ") || void 0;
}
function createUcpClient(options = {}) {
	const doFetch = options.fetch ?? fetch;
	const timeoutMs = options.timeoutMs ?? 2e4;
	const agentProfile = options.agentProfile ?? process.env.UCP_AGENT_PROFILE ?? "https://shopify.dev/ucp/agent-profiles/examples/2026-08-25/valid-with-capabilities.json";
	return { async callTool(storeInput, tool, args, callOptions = {}) {
		const store = resolveStore(storeInput);
		if (!APPROVED_UCP_TOOLS.includes(tool)) throw new UcpError("invalid_tool", `Tool "${tool}" is not approved.`);
		const controller = new AbortController();
		let timedOut = false;
		const timer = setTimeout(() => {
			timedOut = true;
			controller.abort();
		}, timeoutMs);
		const onExternalAbort = () => controller.abort();
		callOptions.signal?.addEventListener("abort", onExternalAbort, { once: true });
		if (callOptions.signal?.aborted) controller.abort();
		const body = {
			jsonrpc: "2.0",
			method: "tools/call",
			id: randomUUID(),
			params: {
				name: tool,
				arguments: {
					...args,
					meta: {
						...callOptions.meta ?? {},
						"ucp-agent": { profile: agentProfile }
					}
				}
			}
		};
		let response;
		let text;
		try {
			response = await doFetch(getMcpUrl(store), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json, text/event-stream"
				},
				body: JSON.stringify(body),
				signal: controller.signal
			});
			text = await response.text();
		} catch (error) {
			if (timedOut) throw new UcpError("timeout", `Shopify request timed out after ${timeoutMs}ms.`);
			if (controller.signal.aborted) throw new UcpError("aborted", "Shopify request was cancelled.");
			throw new UcpError("network", `Could not reach Shopify: ${error instanceof Error ? error.message : "unknown error"}`);
		} finally {
			clearTimeout(timer);
			callOptions.signal?.removeEventListener("abort", onExternalAbort);
		}
		if (!response.ok) throw new UcpError("http", `Shopify returned HTTP ${response.status}.`, response.status);
		const data = parseBody(text, response.headers?.get?.("content-type") ?? "");
		if (!isRecord$3(data)) throw new UcpError("invalid_response", "Unexpected JSON-RPC envelope.");
		if (data.error !== void 0) {
			const err = isRecord$3(data.error) ? data.error : {};
			throw new UcpError("rpc_error", `Shopify JSON-RPC error${err.code !== void 0 ? ` ${String(err.code)}` : ""}: ${String(err.message ?? "unknown")}`);
		}
		const result = data.result;
		if (!isRecord$3(result)) throw new UcpError("invalid_response", "Missing JSON-RPC result.");
		let structured = result.structuredContent;
		if (!isRecord$3(structured) && Array.isArray(result.content)) {
			const first = result.content.find((c) => isRecord$3(c) && typeof c.text === "string");
			if (first) try {
				structured = JSON.parse(first.text);
			} catch {}
		}
		if (result.isError === true) throw new UcpError("tool_error", describeMessages(isRecord$3(structured) ? structured.messages : void 0) ?? "Shopify reported a tool error.");
		if (!isRecord$3(structured)) throw new UcpError("invalid_response", "Shopify response had no structured content.");
		const blocking = (Array.isArray(structured.messages) ? structured.messages : []).filter((m) => isRecord$3(m) && (m.type === "error" || m.severity === "unrecoverable"));
		if (blocking.length > 0) throw new UcpError("tool_error", describeMessages(blocking) ?? "Shopify reported an error.");
		return structured;
	} };
}
let defaultClient;
function getDefaultUcpClient() {
	return defaultClient ??= createUcpClient();
}
var cancelCart_exports = __exportAll({ default: () => cancelCart_default });
var cancelCart_default = defineTool({
	description: "Cancel a cart (Shopify cancel_cart) in the store it was created in. Requires the shopper's approval. Explain which cart will be cancelled before calling.",
	inputSchema: cancelCartInput,
	approval: cancelCartApproval,
	label: { start: ({ store }) => `Cancel ${store} cart` },
	async execute(input, ctx) {
		return cancelCart(getDefaultUcpClient(), input, ctx.abortSignal);
	}
});
var createCart_exports = __exportAll({ default: () => createCart_default });
var createCart_default = defineTool({
	description: "Create a NEW cart in one store (Shopify create_cart) from explicit variant IDs and quantities. Requires the shopper's approval. Explain the cart contents before calling. Does not start checkout or payment.",
	inputSchema: createCartInput,
	approval: createCartApproval,
	label: { start: ({ store }) => `Create ${store} cart` },
	async execute(input, ctx) {
		return createCart(getDefaultUcpClient(), input, ctx.abortSignal);
	}
});
var getCart_exports = __exportAll({ default: () => getCart_default });
var getCart_default = defineTool({
	description: "Read a cart (Shopify get_cart) by its ID in the store it was created in. Read-only. Cart ownership is not verified; only use cart IDs created in this conversation or supplied by the shopper.",
	inputSchema: getCartInput,
	label: { start: ({ store }) => `Get ${store} cart` },
	async execute(input, ctx) {
		return getCart(getDefaultUcpClient(), input, ctx.abortSignal);
	}
});
var getProductDetails_exports = __exportAll({ default: () => getProductDetails_default });
var getProductDetails_default = defineTool({
	description: "Get full details for one product (Shopify get_product): variants, options, prices and availability. productId must be a gid://shopify/Product/... ID from the same store's catalog results.",
	inputSchema: getProductDetailsInput,
	label: { start: ({ store }) => `Get product details from ${store}` },
	async execute(input, ctx) {
		return getProductDetails(getDefaultUcpClient(), input, ctx.abortSignal);
	}
});
var lookupProducts_exports = __exportAll({ default: () => lookupProducts_default });
var lookupProducts_default = defineTool({
	description: "Look up up to 10 known products or variants by ID (Shopify lookup_catalog) in ONE store. IDs must come from that same store's earlier catalog results.",
	inputSchema: lookupProductsInput,
	label: { start: ({ store, ids }) => `Look up ${ids.length} item(s) in ${store}` },
	async execute(input, ctx) {
		return lookupProducts(getDefaultUcpClient(), input, ctx.abortSignal);
	}
});
var searchProducts_exports = __exportAll({ default: () => searchProducts_default });
var searchProducts_default = defineTool({
	description: "Search one store's product catalog (Shopify search_catalog). Choose the store first: \"urbanthread\" for apparel, \"glowlab\" for beauty/skincare. Returns products with variant IDs, prices (minor units + formatted) and availability. Use pagination.cursor to fetch more results. Never use IDs from one store in another.",
	inputSchema: searchProductsInput,
	label: { start: ({ store, query }) => `Search ${store}${query ? ` for "${query}"` : ""}` },
	async execute(input, ctx) {
		return searchProducts(getDefaultUcpClient(), input, ctx.abortSignal);
	}
});
var updateCart_exports = __exportAll({ default: () => updateCart_default });
var updateCart_default = defineTool({
	description: "Change an existing cart (Shopify update_cart). Requires the shopper's approval. Shopify replaces the whole line-item list, so this tool first reads the current cart, applies your changes (setItems adds a variant or sets its quantity; removeVariantIds removes variants) and submits the COMPLETE resulting list, preserving all other lines. Explain the resulting cart before calling. To empty a cart use cancelCart.",
	inputSchema: updateCartInput,
	approval: updateCartApproval,
	label: { start: ({ store }) => `Update ${store} cart` },
	async execute(input, ctx) {
		return updateCart(getDefaultUcpClient(), input, ctx.abortSignal);
	}
});
function resolveSelfModificationConfig(e = {}) {
	if (!isRecord$2(e)) throw Error(`Self-modification configuration must be an object.`);
	if (`deployed` in e) throw Error(DEPLOYED_OPTION_MOVED_MESSAGE);
	let t = e.local;
	if (t !== void 0 && !isRecord$2(t)) throw Error(`Self-modification local must be an object.`);
	let n = t?.enabled ?? !0;
	if (typeof n != `boolean`) throw Error(`Self-modification local.enabled must be a boolean.`);
	return { localEnabled: n };
}
function isRecord$2(e) {
	return typeof e == `object` && !!e && !Array.isArray(e);
}
var DEPLOYED_OPTION_MOVED_MESSAGE;
var init_config = __esmMin((() => {
	DEPLOYED_OPTION_MOVED_MESSAGE = "The `deployed` option moved to the separate `eve/extensions/self-modification/remote` mount. Remove it from this local self-modification mount and mount `eve/extensions/self-modification/remote` instead.";
}));
var e$2, t$2;
var init_rolldown_runtime_CwAJHxZ7 = __esmMin((() => {
	e$2 = Object.defineProperty;
	t$2 = (t, n) => {
		let r = Object.setPrototypeOf({}, null);
		for (var i in t) e$2(r, i, {
			get: t[i],
			enumerable: !0
		});
		return n & 1 || e$2(r, Symbol.toStringTag, { value: `Module` }), n & 2 ? r : Object.preventExtensions(r);
	};
}));
function n$3(e) {
	return e;
}
function r$2(e) {
	return e;
}
function i$1() {
	return (e) => e;
}
function a$1(e) {}
function o$1(e) {
	throw Error(`Unexpected value in exhaustive check`);
}
function s$2(e) {}
function c$1(e) {
	let t = Object.values(e).filter((e) => typeof e == `number`);
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function l$3(e, t = `|`) {
	return e.map((e) => j$3(e)).join(t);
}
function u$2(e, t) {
	return typeof t == `bigint` ? t.toString() : t;
}
function f$1(e) {
	return new d$2(e);
}
function ee$1(e) {
	return e == null;
}
function te$1(e) {
	let t = +!!e.startsWith(`^`);
	let n = e.endsWith(`$`) ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function p$3(e, t) {
	let n = e / t;
	let r = Math.round(n);
	let i = 4 * 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
function h$1(e, t, n) {
	let r;
	Object.defineProperty(e, t, {
		get() {
			if (r !== m$1) return r === void 0 && (r = m$1, r = n()), r;
		},
		set(n) {
			Object.defineProperty(e, t, { value: n });
		},
		configurable: !0
	});
}
function ne$1(e) {
	return Object.create(Object.getPrototypeOf(e), Object.getOwnPropertyDescriptors(e));
}
function g$1(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function _$1(e) {
	let t = Object.getOwnPropertyDescriptor(e, `shape`);
	return t?.get ? t.get.raw : t?.value;
}
function v$1(e) {
	return _$1(e._zod.def) ?? e._zod.def.shape;
}
function re$1(e, t, n) {
	Object.defineProperty(e, t, {
		get() {
			let e = n();
			return g$1(this, t, e), e;
		},
		enumerable: !0,
		configurable: !0
	});
}
function ie$1(e, t, n) {
	t in e ? g$1(e, t, n) : e[t] = n;
}
function y$1(e, t, n, r) {
	let i = v$1(t);
	for (let a of n) {
		let n = Object.getOwnPropertyDescriptor(i, a);
		n.enumerable && (n.get ? re$1(e, a, () => {
			let e = t._zod.def.shape[a];
			return r ? r(e, a) : e;
		}) : ie$1(e, a, r ? r(n.value, a) : n.value));
	}
}
function ae$1(e, t) {
	for (let n of Reflect.ownKeys(t)) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.enumerable && (r.get ? re$1(e, n, () => t[n]) : ie$1(e, n, r.value));
	}
}
function b$2(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function oe$1(e) {
	return b$2(e._zod.def);
}
function se$1(e, t) {
	return t ? t.reduce((e, t) => e?.[t], e) : e;
}
function ce$1(e) {
	let t = Object.keys(e);
	let n = t.map((t) => e[t]);
	return Promise.all(n).then((e) => {
		let n = {};
		for (let r = 0; r < t.length; r++) n[t[r]] = e[r];
		return n;
	});
}
function le$1(e = 10) {
	let t = ``;
	for (let n = 0; n < e; n++) t += `abcdefghijklmnopqrstuvwxyz`[Math.floor(Math.random() * 26)];
	return t;
}
function ue$1(e) {
	return JSON.stringify(e);
}
function de$1(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, ``).replace(/[\s_-]+/g, `-`).replace(/^-+|-+$/g, ``);
}
function S$2(e) {
	return typeof e == `object` && !!e && !Array.isArray(e);
}
function w$2(e) {
	if (S$2(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != `function`) return !0;
	let n = t.prototype;
	return S$2(n) !== !1 && Object.prototype.hasOwnProperty.call(n, `isPrototypeOf`) !== !1;
}
function T$2(e) {
	return w$2(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
function fe$1(e) {
	let t = 0;
	for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
	return t;
}
function O$3(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
function k$2(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function A$3(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == `string`) return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == `string` ? {
		...t,
		error: () => t.error
	} : t;
}
function me$1(e) {
	let t;
	return new Proxy({}, {
		get(n, r, i) {
			return t ??= e(), Reflect.get(t, r, i);
		},
		set(n, r, i, a) {
			return t ??= e(), Reflect.set(t, r, i, a);
		},
		has(n, r) {
			return t ??= e(), Reflect.has(t, r);
		},
		deleteProperty(n, r) {
			return t ??= e(), Reflect.deleteProperty(t, r);
		},
		ownKeys(n) {
			return t ??= e(), Reflect.ownKeys(t);
		},
		getOwnPropertyDescriptor(n, r) {
			return t ??= e(), Reflect.getOwnPropertyDescriptor(t, r);
		},
		defineProperty(n, r, i) {
			return t ??= e(), Reflect.defineProperty(t, r, i);
		}
	});
}
function j$3(e) {
	return typeof e == `bigint` ? e.toString() + `n` : typeof e == `string` ? `"${e}"` : `${e}`;
}
function M$3(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === `optional`);
}
function F$3(e, t) {
	let n = e._zod.def;
	let r = n.checks;
	if (r && r.length > 0) throw Error(`.pick() cannot be used on object schemas containing refinements`);
	let i = {};
	return y$1(i, e, I$3(e, t)), k$2(e, b$2(n, {
		shape: i,
		checks: []
	}));
}
function I$3(e, t) {
	let n = v$1(e);
	let r = [];
	for (let e of Reflect.ownKeys(t)) {
		if (!Object.getOwnPropertyDescriptor(n, e)?.enumerable) throw Error(`Unrecognized key: "${String(e)}"`);
		t[e] && r.push(e);
	}
	return r;
}
function L$3(e, t) {
	let n = e._zod.def;
	let r = n.checks;
	if (r && r.length > 0) throw Error(`.omit() cannot be used on object schemas containing refinements`);
	let i = new Set(I$3(e, t));
	let a = {};
	return y$1(a, e, Reflect.ownKeys(v$1(e)).filter((e) => !i.has(e))), k$2(e, b$2(n, {
		shape: a,
		checks: []
	}));
}
function R$4(e, t) {
	if (!w$2(t)) throw Error(`Invalid input to extend: expected a plain object`);
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = v$1(e);
		for (let e of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return k$2(e, b$2(e._zod.def, { shape: z$4(e, t) }));
}
function z$4(e, t) {
	let n = {};
	return y$1(n, e, Reflect.ownKeys(v$1(e))), ae$1(n, t), n;
}
function B$3(e, t) {
	if (!w$2(t)) throw Error(`Invalid input to safeExtend: expected a plain object`);
	return k$2(e, b$2(e._zod.def, { shape: z$4(e, t) }));
}
function V$4(e, t) {
	if (!t?._zod?.def) throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (e._zod.def.checks?.length) throw Error(`.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.`);
	let n = {};
	return y$1(n, e, Reflect.ownKeys(v$1(e))), y$1(n, t, Reflect.ownKeys(v$1(t))), k$2(e, b$2(e._zod.def, {
		shape: n,
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function H$4(e, t, n, r = `partial`) {
	let i = t._zod.def.checks;
	if (i && i.length > 0) throw Error(`.${r}() cannot be used on object schemas containing refinements`);
	let a = n ? new Set(I$3(t, n)) : void 0;
	let o = {};
	return y$1(o, t, Reflect.ownKeys(v$1(t)), e && ((t, n) => a && !a.has(n) ? t : new e({
		type: `optional`,
		innerType: t
	}))), k$2(t, b$2(t._zod.def, {
		shape: o,
		checks: []
	}));
}
function U$3(e, t, n) {
	let r = n ? new Set(I$3(t, n)) : void 0;
	let i = {};
	return y$1(i, t, Reflect.ownKeys(v$1(t)), (t, n) => r && !r.has(n) ? t : new e({
		type: `nonoptional`,
		innerType: t
	})), k$2(t, b$2(t._zod.def, { shape: i }));
}
function he$1(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function W$3(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function G$3(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function K$3(e) {
	return typeof e == `string` ? e : e?.message;
}
function ge$1(e) {
	let t = [];
	for (let n of e ?? []) {
		let e = n._zod.def;
		if (!/_(length|size)$|_equals$/.test(e.check)) break;
		let r = e.maximum ?? e.length ?? e.size;
		r >= 0 && t.push([r, n]);
	}
	return t;
}
function _e$1(e, t, n) {
	var r;
	for (let i = t; i < e.length; i++) (r = e[i]).schema ?? (r.schema = n);
}
function ve$1(e, t, n) {
	var r;
	let i = e.inst?._zod?.traits;
	i?.has(`$ZodType`) && (i.has(`$ZodCheck`) ? (r = e).schema ?? (r.schema = e.inst) : e.schema = e.inst);
	let a = e.schema === e.inst ? void 0 : e.schema?._zod.def?.error;
	let o = e.message ? e.message : K$3(e.inst?._zod.def?.error?.(e)) ?? K$3(a?.(e)) ?? K$3(t?.error?.(e)) ?? K$3(n.customError?.(e)) ?? K$3(n.localeError?.(e)) ?? `Invalid input`;
	let s = {};
	for (let t of Object.keys(e)) t !== `inst` && t !== `schema` && t !== `continue` && t !== `input` && t !== `__proto__` && (s[t] = e[t]);
	return s.path ??= [], s.message = o, t?.reportInput && (s.input = e.input), s;
}
function ye$1(e) {
	return e instanceof Set ? `set` : e instanceof Map ? `map` : e instanceof File ? `file` : `unknown`;
}
function xe$1(e) {
	let t = e.length;
	if (!be$1.test(e)) return t;
	let n = t;
	for (let r = 0; r < t - 1; r++) (e.charCodeAt(r) & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 && (n--, r++);
	return n;
}
function Se$2(e) {
	return Array.isArray(e) ? `array` : typeof e == `string` ? `string` : `unknown`;
}
function q$3(e) {
	let t = typeof e;
	switch (t) {
		case `number`: return Number.isNaN(e) ? `nan` : `number`;
		case `object`: {
			if (e === null) return `null`;
			if (Array.isArray(e)) return `array`;
			let t = e;
			if (t && Object.getPrototypeOf(t) !== Object.prototype && `constructor` in t && t.constructor) return t.constructor.name;
		}
	}
	return t;
}
function Ce$2(...e) {
	let [t, n, r] = e;
	return typeof t == `string` ? {
		message: t,
		code: `custom`,
		input: n,
		inst: r
	} : { ...t };
}
function we$2(e) {
	return Object.entries(e).filter(([e, t]) => Number.isNaN(Number.parseInt(e, 10))).map((e) => e[1]);
}
function Te$2(e) {
	let t = atob(e);
	let n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
function Ee$2(e) {
	let t = ``;
	for (let n = 0; n < e.length; n++) t += String.fromCharCode(e[n]);
	return btoa(t);
}
function De$2(e) {
	let t = e.replace(/-/g, `+`).replace(/_/g, `/`);
	return Te$2(t + `=`.repeat((4 - t.length % 4) % 4));
}
function Oe$2(e) {
	return Ee$2(e).replace(/\+/g, `-`).replace(/\//g, `_`).replace(/=/g, ``);
}
function ke$2(e) {
	let t = e.replace(/^0x/, ``);
	if (t.length % 2 != 0) throw Error(`Invalid hex string length`);
	let n = new Uint8Array(t.length / 2);
	for (let e = 0; e < t.length; e += 2) n[e / 2] = Number.parseInt(t.slice(e, e + 2), 16);
	return n;
}
function Ae$2(e) {
	return Array.from(e).map((e) => e.toString(16).padStart(2, `0`)).join(``);
}
function Me$2(e, t) {
	for (let n in t) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.get ? Object.defineProperty(e, n, {
			...r,
			enumerable: !1
		}) : Fe$2(e, n, r.value);
	}
}
function J$3(e, t, n, r = !0) {
	return Object.defineProperty(e, t, {
		configurable: !0,
		writable: !0,
		enumerable: r,
		value: n
	}), n;
}
function Ne$2(e, t, n) {
	return J$3(e, t, n, !1);
}
function Pe$2(e, t) {
	for (let n in e) {
		let r = e[n];
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !0,
			get() {
				return J$3(this, n, r(this));
			},
			set(e) {
				J$3(this, n, e);
			}
		});
	}
	return t;
}
function Fe$2(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		get() {
			return this == null ? n : J$3(this, t, n.bind(this));
		},
		set(e) {
			J$3(this, t, e);
		}
	});
}
function Ie$2(e, t) {
	let n = Object.getPrototypeOf(e);
	return t in n ? void 0 : n;
}
function Re$2(e, t, n) {
	let r = Object.getPrototypeOf(e._zod);
	t in r && Y$3 !== e._zod ? Y$3 = void 0 : (Y$3 = e._zod, Object.defineProperty(r, t, {
		configurable: !0,
		get() {
			Object.defineProperty(this, t, Le$2);
			let e = X$4;
			X$4 = !1;
			try {
				let r = n(this);
				return X$4 ? delete this[t] : Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: r
				}), X$4 ||= e, r;
			} catch (n) {
				throw delete this[t], X$4 ||= e, n;
			}
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				value: e
			});
		}
	}));
}
function ze$2(e, t, n, r) {
	let i = Ie$2(e, t);
	i && Object.defineProperty(i, t, {
		configurable: !0,
		get() {
			let e = {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: void 0
			};
			return Object.defineProperty(this, t, e), e.value = n(this), Object.defineProperty(this, t, e), e.value;
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: e
			});
		}
	});
}
function Be$2(e) {
	let t = () => e;
	return t[Z$3] = !0, t;
}
function We$2(e) {
	let t = Ue$2;
	if (t) {
		let n = t.stackTraceLimit;
		if (typeof n == `number`) {
			try {
				t.stackTraceLimit = 0;
			} catch {
				return Ue$2 = null, new e();
			}
			try {
				return new e();
			} finally {
				t.stackTraceLimit = n;
			}
		}
	}
	return new e();
}
function Ge$2(e, t, n, r) {
	let i = {};
	function a(e) {
		this.def = e, this.constr = d, this.traits = new Set();
	}
	a.prototype = i;
	let o = n;
	let s = o && new WeakSet();
	function c(n, r) {
		if (!n._zod) {
			Q$3.value = new a(r);
			try {
				Object.defineProperty(n, "_zod", Q$3);
			} finally {
				Q$3.value = void 0;
			}
		} else if (n._zod.traits.has(e)) return;
		if (n._zod.traits.add(e), t(n, r), s) {
			let e = Object.getPrototypeOf(n);
			let t = n._zod.constr.prototype;
			let r = e;
			for (; r && r !== t;) r = Object.getPrototypeOf(r);
			let i = r ?? e;
			s.has(i) || (s.add(i), Me$2(i, o));
		}
		let i = d.prototype;
		for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && (e in n || (n[e] = i[e].bind(n)));
	}
	let l = r?.Parent ?? Object;
	class u extends l {}
	Object.defineProperty(u, "name", { value: e });
	function d(e) {
		let t = r?.Parent ? We$2(u) : this;
		c(t, e);
		let n = t._zod.deferred;
		if (n) {
			for (let e of n) e();
			t._zod.deferred = void 0;
		}
		let i = globalThis.__zod_globalConfig?.postProcessor;
		return i && i(t), t;
	}
	return Object.defineProperty(d, "init", { value: c }), Object.defineProperty(d, Symbol.hasInstance, { value: (t) => r?.Parent && t instanceof r.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
function Ye$2(e) {
	return e && Object.assign($$3, e), $$3;
}
function Ze$2() {
	return { localeError: Xe$2() };
}
var t$1, d$2, m$1, x$1, C$2, pe$1, E$2, D$2, N$3, P$3, be$1, je$2, Y$3, X$4, Le$2, Z$3, Ve$2, He$2, Q$3, Ue$2, Ke$2, qe$2, Je$2, $$3, Xe$2;
var init_en_CuIUlj_w = __esmMin((() => {
	init_rolldown_runtime_CwAJHxZ7();
	t$1 = t$2({
		BIGINT_FORMAT_RANGES: () => P$3,
		CONSTANT_CATCH: () => Z$3,
		Class: () => je$2,
		NUMBER_FORMAT_RANGES: () => N$3,
		aborted: () => he$1,
		allowsEval: () => C$2,
		assert: () => s$2,
		assertEqual: () => n$3,
		assertIs: () => a$1,
		assertNever: () => o$1,
		assertNotEqual: () => r$2,
		assignProp: () => g$1,
		attachSchema: () => _e$1,
		base64ToUint8Array: () => Te$2,
		base64urlToUint8Array: () => De$2,
		cached: () => f$1,
		captureStackTrace: () => x$1,
		cleanEnum: () => we$2,
		cleanRegex: () => te$1,
		clone: () => k$2,
		cloneDef: () => oe$1,
		codePointLength: () => xe$1,
		constantCatch: () => Be$2,
		createTransparentProxy: () => me$1,
		defineLazy: () => h$1,
		defineLazyInternal: () => Re$2,
		derived: () => Pe$2,
		esc: () => ue$1,
		escapeRegex: () => O$3,
		explicitlyAborted: () => W$3,
		extend: () => R$4,
		finalizeIssue: () => ve$1,
		floatSafeRemainder: () => p$3,
		getElementAtPath: () => se$1,
		getEnumValues: () => c$1,
		getLengthableOrigin: () => Se$2,
		getParsedType: () => pe$1,
		getSizableOrigin: () => ye$1,
		hexToUint8Array: () => ke$2,
		hide: () => Ne$2,
		installLazyProp: () => ze$2,
		isObject: () => S$2,
		isPlainObject: () => w$2,
		issue: () => Ce$2,
		joinValues: () => l$3,
		jsonStringifyReplacer: () => u$2,
		members: () => Me$2,
		merge: () => V$4,
		mergeDefs: () => b$2,
		normalizeParams: () => A$3,
		nullish: () => ee$1,
		numKeys: () => fe$1,
		objectClone: () => ne$1,
		omit: () => L$3,
		optionalKeys: () => M$3,
		own: () => J$3,
		parsedType: () => q$3,
		partial: () => H$4,
		pick: () => F$3,
		prefixIssues: () => G$3,
		primitiveTypes: () => D$2,
		promiseAllObject: () => ce$1,
		propertyKeyTypes: () => E$2,
		randomString: () => le$1,
		rawShape: () => _$1,
		required: () => U$3,
		safeExtend: () => B$3,
		shallowClone: () => T$2,
		sizeCaps: () => ge$1,
		slugify: () => de$1,
		stringifyPrimitive: () => j$3,
		toZod: () => i$1,
		uint8ArrayToBase64: () => Ee$2,
		uint8ArrayToBase64url: () => Oe$2,
		uint8ArrayToHex: () => Ae$2,
		unwrapMessage: () => K$3
	});
	d$2 = class {
		constructor(e) {
			this._getter = e, this._value = void 0;
		}
		get value() {
			let e = this._getter;
			return e !== void 0 && (this._value = e(), this._getter = void 0), this._value;
		}
	};
	m$1 = Symbol(`evaluating`);
	x$1 = `captureStackTrace` in Error ? Error.captureStackTrace : (...e) => {};
	C$2 = f$1(() => ($$3.jitless || typeof navigator < `u` && navigator?.userAgent?.includes(`Cloudflare`), !1));
	pe$1 = (e) => {
		let t = typeof e;
		switch (t) {
			case `undefined`: return `undefined`;
			case `string`: return `string`;
			case `number`: return Number.isNaN(e) ? `nan` : `number`;
			case `boolean`: return `boolean`;
			case `function`: return `function`;
			case `bigint`: return `bigint`;
			case `symbol`: return `symbol`;
			case `object`: return Array.isArray(e) ? `array` : e === null ? `null` : e.then && typeof e.then == `function` && e.catch && typeof e.catch == `function` ? `promise` : typeof Map < `u` && e instanceof Map ? `map` : typeof Set < `u` && e instanceof Set ? `set` : typeof Date < `u` && e instanceof Date ? `date` : typeof File < `u` && e instanceof File ? `file` : `object`;
			default: throw Error(`Unknown data type: ${t}`);
		}
	};
	E$2 = new Set([
		`string`,
		`number`,
		`symbol`
	]);
	D$2 = new Set([
		`string`,
		`number`,
		`bigint`,
		`boolean`,
		`symbol`,
		`undefined`
	]);
	N$3 = {
		safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
		int32: [-2147483648, 2147483647],
		uint32: [0, 4294967295],
		float32: [-34028234663852886e22, 34028234663852886e22],
		float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
	};
	P$3 = {
		int64: [BigInt(`-9223372036854775808`), BigInt(`9223372036854775807`)],
		uint64: [BigInt(0), BigInt(`18446744073709551615`)]
	};
	be$1 = /[\uD800-\uDBFF]/;
	je$2 = class {
		constructor(...e) {}
	};
	X$4 = !1;
	Le$2 = {
		configurable: !0,
		get() {
			X$4 = !0;
		}
	};
	Z$3 = `~constantCatch`;
	He$2 = Object.freeze({ status: `aborted` });
	Q$3 = {
		value: void 0,
		enumerable: !1
	};
	Ue$2 = `captureStackTrace` in Error ? Error : null;
	Ke$2 = Symbol(`zod_brand`);
	qe$2 = class extends Error {
		constructor() {
			super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
		}
	};
	Je$2 = class extends Error {
		constructor(e) {
			super(`Encountered unidirectional transform during encode: ${e}`), this.name = `ZodEncodeError`;
		}
	};
	(Ve$2 = globalThis).__zod_globalConfig ?? (Ve$2.__zod_globalConfig = {});
	$$3 = globalThis.__zod_globalConfig;
	Xe$2 = () => {
		let e = {
			string: {
				unit: `characters`,
				verb: `to have`
			},
			file: {
				unit: `bytes`,
				verb: `to have`
			},
			array: {
				unit: `items`,
				verb: `to have`
			},
			set: {
				unit: `items`,
				verb: `to have`
			},
			map: {
				unit: `entries`,
				verb: `to have`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `email address`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO datetime`,
			date: `ISO date`,
			time: `ISO time`,
			duration: `ISO duration`,
			ipv4: `IPv4 address`,
			ipv6: `IPv6 address`,
			mac: `MAC address`,
			cidrv4: `IPv4 range`,
			cidrv6: `IPv6 range`,
			base64: `base64-encoded string`,
			base64url: `base64url-encoded string`,
			json_string: `JSON string`,
			e164: `E.164 number`,
			currency_code: `currency code`,
			credit_card: `credit card number`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = { nan: `NaN` };
		function i(e, t) {
			return e === `number` && typeof t == `number` && !Number.isFinite(t) ? String(t) : r[e] ?? e;
		}
		return (e) => {
			switch (e.code) {
				case `invalid_type`: return `Invalid input: expected ${i(e.expected)}, received ${i(q$3(e.input), e.input)}`;
				case `invalid_value`: return e.values.length === 1 ? `Invalid input: expected ${j$3(e.values[0])}` : `Invalid option: expected one of ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.exact ? `exactly ` : e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Too big: expected ${e.origin ?? `value`} to have ${n}${e.maximum.toString()} ${r.unit ?? `elements`}` : `Too big: expected ${e.origin ?? `value`} to be ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.exact ? `exactly ` : e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}` : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Invalid string: must start with "${t.prefix}"` : t.format === `ends_with` ? `Invalid string: must end with "${t.suffix}"` : t.format === `includes` ? `Invalid string: must include "${t.includes}"` : t.format === `regex` ? `Invalid string: must match pattern ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Invalid number: must be a multiple of ${e.divisor}`;
				case `unrecognized_keys`: return `Unrecognized key${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Invalid key in ${e.origin}`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(` | `)}` : e.inclusive === !1 ? `Invalid input: more than one option matched` : `Invalid input`;
				case `invalid_element`: return `Invalid value in ${e.origin}`;
				default: return `Invalid input`;
			}
		};
	};
}));
function Se$1() {
	let e = this._zod;
	return e.message ??= JSON.stringify(e.def, u$2, 2), e.message;
}
function Ce$1(e) {
	this._zod.message = e;
}
function ke$1(e, t, n) {
	return Object.prototype.hasOwnProperty.call(e, t) || (t === `__proto__` ? Object.defineProperty(e, t, {
		value: n(),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : e[t] = n()), e[t];
}
function Ae$1(e, t = (e) => e.message) {
	let n = {};
	let r = [];
	for (let i of e.issues) i.path.length > 0 ? ke$1(n, i.path[0], () => []).push(t(i)) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function je$1(e, t = (e) => e.message) {
	let n = { _errors: [] };
	let r = (e, i = []) => {
		for (let a of e.issues) if (a.code === `invalid_union` && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === `invalid_key`) r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === `invalid_element`) r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n;
				let i = 0;
				for (; i < e.length;) {
					let n = e[i];
					let o = i === e.length - 1;
					if (n === `_errors`) {
						o && r._errors.push(t(a)), i++;
						continue;
					}
					Object.prototype.hasOwnProperty.call(r, n) || Object.defineProperty(r, n, {
						value: { _errors: [] },
						enumerable: !0,
						writable: !0,
						configurable: !0
					});
					let s = r[n];
					o && s._errors.push(t(a)), r = s, i++;
				}
			}
		}
	};
	return r(e), n;
}
function Me$1(e, t = (e) => e.message) {
	let n = { errors: [] };
	let r = (e, i = []) => {
		var a;
		for (let o of e.issues) if (o.code === `invalid_union` && o.errors.length) o.errors.map((e) => r({ issues: e }, [...i, ...o.path]));
		else if (o.code === `invalid_key`) r({ issues: o.issues }, [...i, ...o.path]);
		else if (o.code === `invalid_element`) r({ issues: o.issues }, [...i, ...o.path]);
		else {
			let e = [...i, ...o.path];
			if (e.length === 0) {
				n.errors.push(t(o));
				continue;
			}
			let r = n;
			let s = 0;
			for (; s < e.length;) {
				let n = e[s];
				let i = s === e.length - 1;
				typeof n == `string` ? (r.properties ?? (r.properties = {}), Object.prototype.hasOwnProperty.call(r.properties, n) || Object.defineProperty(r.properties, n, {
					value: { errors: [] },
					enumerable: !0,
					writable: !0,
					configurable: !0
				}), r = r.properties[n]) : (r.items ?? (r.items = []), (a = r.items)[n] ?? (a[n] = { errors: [] }), r = r.items[n]), i && r.errors.push(t(o)), s++;
			}
		}
	};
	return r(e), n;
}
function Ne$1(e) {
	let t = [];
	let n = e.map((e) => typeof e == `object` ? e.key : e);
	for (let e of n) typeof e == `number` ? t.push(`[${e}]`) : typeof e == `symbol` ? t.push(`[${JSON.stringify(String(e))}]`) : /[^\w$]/.test(e) ? t.push(`[${JSON.stringify(e)}]`) : (t.length && t.push(`.`), t.push(e));
	return t.join(``);
}
function Pe$1(e) {
	let t = [];
	let n = [...e.issues].sort((e, t) => (e.path ?? []).length - (t.path ?? []).length);
	for (let e of n) t.push(`✖ ${e.message}`), e.path?.length && t.push(`  → at ${Ne$1(e.path)}`);
	return t.join(`
`);
}
function Fe$1(e, t) {
	return {
		callee: t?.callee ?? e,
		Err: t?.Err
	};
}
function He$1(e, t, n) {
	let r;
	return {
		success: !1,
		get error() {
			return r || (r = new e(t.map((e) => ve$1(e, n, Ye$2()))), t = void 0, n = void 0), r;
		},
		set error(e) {
			r = e, t = void 0, n = void 0;
		}
	};
}
function Je$1(e, t, n) {
	let r = n ? {
		...n,
		async: !1,
		abortEarly: !0
	} : {
		async: !1,
		abortEarly: !0
	};
	let i = e._zod.bag.fallbackRun;
	let a;
	if (i ? (r[Ke$1] = !0, a = i({
		value: t,
		issues: []
	}, r)) : a = e._zod.run({
		value: t,
		issues: []
	}, r), a instanceof Promise) throw new qe$2();
	return a.issues.length === 0;
}
function yt$1(e) {
	return RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
function Nt$1() {
	return RegExp(`^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`, `u`);
}
function Yt$1(e) {
	return RegExp(`^${e}$`);
}
function Zt$1(e) {
	let t = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof e.precision == `number` ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Qt$1(e) {
	return RegExp(`^${Zt$1(e)}$`);
}
function $t$1(e) {
	let t = [`Z`];
	e.offset && t.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	let n = `${Zt$1({
		precision: e.precision,
		seconds: !0
	})}(?:${t.join(`|`)})`;
	let r = e.local ? `${n}|${Zt$1({ precision: e.precision })}` : n;
	return RegExp(`^${Jt$1}T(?:${r})$`);
}
function fn(e, t) {
	return RegExp(`^[A-Za-z0-9+/]{${e}}${t}$`);
}
function pn(e) {
	return RegExp(`^[A-Za-z0-9_-]{${e}}$`);
}
function Xn(e, t, n) {
	e.issues.length && t.issues.push(...G$3(n, e.issues));
}
async function ir(e, t) {
	let n = { async: !0 };
	return rr(await e._zod.run({
		value: t,
		issues: []
	}, n), n);
}
function ar(e) {
	return {
		validate: (t) => {
			let n = { async: !1 };
			try {
				let r = e._zod.run({
					value: t,
					issues: []
				}, n);
				if (!(r instanceof Promise)) return rr(r, n);
			} catch {}
			return ir(e, t);
		},
		vendor: `zod`,
		version: 1
	};
}
function fr(e) {
	try {
		return typeof URL < `u` && typeof URL.canParse == `function` ? URL.canParse(e) : (new URL(e), !0);
	} catch {
		return !1;
	}
}
function pr(e, t) {
	return !(`normalize` in t) && !(`hostname` in t) && !(`protocol` in t) ? fr(e) || 2 : mr(e, t);
}
function mr(e, t) {
	if (!t.normalize && t.protocol?.source === Ut$1.source && !/^https?:\/\//i.test(e)) return 1;
	try {
		if (typeof URL < `u`) {
			let t = URL;
			if (typeof t.parse == `function`) return t.parse(e) ?? 2;
		}
		return new URL(e);
	} catch {
		return 2;
	}
}
function gr(e) {
	return e.replace(hr, ``);
}
function _r(e, t) {
	return t.lastIndex = 0, t.test(e.hostname);
}
function vr(e, t) {
	return t.lastIndex = 0, t.test(e.protocol.endsWith(`:`) ? e.protocol.slice(0, -1) : e.protocol);
}
function Nr(e) {
	return Mr.test(e) ? fr(`http://[${e}]`) : !1;
}
function Lr(e) {
	let t = e.split(`/`);
	if (t.length !== 2) return !1;
	let [n, r] = t;
	if (!r) return !1;
	let i = Number(r);
	return `${i}` !== r || i < 0 || i > 128 ? !1 : Nr(n);
}
function zr(e) {
	if (e === ``) return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
function Ur(e) {
	if (!Hr.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === `-` ? `+` : `/`);
	return zr(t.padEnd(Math.ceil(t.length / 4) * 4, `=`));
}
function qr(e) {
	let t = e.length;
	let n = 1;
	let r = 0;
	for (; t;) {
		let i = e.charCodeAt(--t) - 48;
		n ^= 1, r += n ? [
			0,
			2,
			4,
			6,
			8,
			1,
			3,
			5,
			7,
			9
		][i] : i;
	}
	return r % 10 == 0;
}
function Jr(e) {
	return Gt$1.test(e) ? qr(e.replace(Kr, ``)) : !1;
}
function Xr(e) {
	let t = 0;
	let n = e.length;
	for (let r = 4; r < n; r++) {
		let n = e.charCodeAt(r);
		t = (n >= 65 ? t * 100 + (n - 55) : t * 10 + (n - 48)) % 97;
	}
	for (let n = 0; n < 4; n++) {
		let r = e.charCodeAt(n);
		t = (r >= 65 ? t * 100 + (r - 55) : t * 10 + (r - 48)) % 97;
	}
	return t === 1;
}
function Zr(e) {
	return qt$1.test(e) ? Xr(e) : !1;
}
function $r(e, t = null) {
	try {
		let n = e.split(`.`);
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !(`typ` in i && i?.typ !== `JWT` || !i.alg || t && (!(`alg` in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
function hi(e, t) {
	let n = ge$1(e._zod.def.checks);
	if (!n.length) return;
	let r = Math.min(...n.map((e) => e[0]));
	let i = e._zod.parse;
	e._zod.parse = (n, a) => {
		let o = t(n.value);
		if (o > r && !a?.skipChecks && a?.direction !== `backward`) {
			for (let [t, r] of ge$1(e._zod.def.checks)) if (o > t && r._zod.def.when(n)) {
				let t = n.issues.length;
				return r._zod.check(n), n.issues[t].continue = !1, _e$1(n.issues, t, e), n;
			}
		}
		return i(n, a);
	};
}
function yi(e, t, n) {
	e.issues.length && t.issues.push(...G$3(n, e.issues)), t.value[n] = e.value;
}
function xi(e, t, n, r, i, a) {
	let o = n in r;
	let s = a === `optional`;
	if (o || !s || i !== `optional`) {
		if (e.issues.length) {
			if (i !== void 0 && s && !o) return;
			t.issues.push(...G$3(n, e.issues));
		}
		!o && i === void 0 ? e.issues.length || t.issues.push({
			code: `invalid_type`,
			expected: `nonoptional`,
			input: void 0,
			path: [n]
		}) : e.value === void 0 ? (o || i === `defaulted` && !s) && (t.value[n] = void 0) : t.value[n] = e.value;
	}
}
function Ci(e) {
	let t = Object.keys(e.shape);
	let n = Object.getOwnPropertySymbols(e.shape);
	let r = n.length ? n : Si;
	let i = r.length ? [...t, ...r] : t;
	for (let t of i) if (!e.shape?.[t]?._zod?.traits?.has(`$ZodType`)) throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);
	let a = M$3(e.shape);
	return {
		...e,
		allKeys: i,
		symbolKeys: r,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(a)
	};
}
function wi(e, t, n, r, i, a, o) {
	let s = [];
	let c = i.keySet;
	let l = i.catchall._zod;
	let u = l.def.type;
	let d = l.optin;
	let f = l.optout;
	let p = 0;
	for (let i in t) {
		if (o && n.issues.length !== p) {
			if (he$1(n, p)) break;
			p = n.issues.length;
		}
		if (c.has(i)) continue;
		if (i === `__proto__`) {
			u === `never` && s.push(i);
			continue;
		}
		if (u === `never`) {
			s.push(i);
			continue;
		}
		let a = l.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => xi(e, n, i, t, d, f))) : xi(a, n, i, t, d, f);
	}
	return s.length && n.issues.push({
		code: `unrecognized_keys`,
		keys: s,
		input: t,
		inst: a,
		continue: !0
	}), e.length ? Promise.all(e).then(() => n) : n;
}
function Di(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !he$1(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: `invalid_union`,
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => ve$1(e, r, Ye$2())))
	}), t);
}
function ki(e, t, n, r) {
	let i = [];
	for (let t = 0; t < e.length; t++) e[t].issues.length === 0 && i.push(t);
	return i.length === 1 ? (t.value = e[i[0]].value, t) : (i.length === 0 ? t.issues.push({
		code: `invalid_union`,
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => ve$1(e, r, Ye$2())))
	}) : t.issues.push({
		code: `invalid_union`,
		input: t.value,
		inst: n,
		errors: [],
		inclusive: !1,
		matches: i
	}), t);
}
function ji(e, t) {
	let n = e._zod;
	let r = n.bag.optionsMap;
	r || (r = Mi(n.def), n.bag.optionsMap = r);
	let i = r.get(t);
	if (i === null) throw Error(`Ambiguous discriminator value "${String(t)}"`);
	return i;
}
function Mi(e) {
	let t = new Map();
	for (let n of e.options) {
		let r = n._zod.propValues?.[e.discriminator];
		if (!r || r.size === 0) throw Error(`Invalid discriminated union option at index "${e.options.indexOf(n)}"`);
		for (let e of r) if (t.has(e)) {
			if (e !== void 0) throw Error(`Duplicate discriminator value "${String(e)}"`);
			t.set(e, null);
		} else t.set(e, n);
	}
	return t;
}
function Fi(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (w$2(e) && w$2(t)) {
		let n = Object.keys(t);
		let r = Object.keys(e).filter((e) => n.indexOf(e) !== -1);
		let i = {
			...e,
			...t
		};
		Object.prototype.hasOwnProperty.call(i, `__proto__`) && delete i.__proto__;
		for (let n of r) {
			if (n === `__proto__`) continue;
			let r = Fi(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			let a = t[r];
			let o = Fi(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function Ii(e, t, n) {
	let r = new Map();
	let i;
	let a = new Map();
	let o = (e, t) => {
		let n;
		if (e.code === `unrecognized_keys` && !e.path?.length) i ??= e, n = e.keys;
		else if (e.code === `invalid_key` && e.origin === `record` && e.path?.length === 1) {
			let t = String(e.path[0]);
			a.has(t) || a.set(t, e), n = [t];
		} else return !1;
		for (let e of n) r.has(e) || r.set(e, {}), r.get(e)[t] = !0;
		return !0;
	};
	for (let n of t.issues) o(n, `l`) || e.issues.push(n);
	for (let t of n.issues) o(t, `r`) || e.issues.push(t);
	let s = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (s.length) {
		let t = i ? s.filter((e) => i.keys.includes(e)) : [];
		t.length && e.issues.push({
			...i,
			keys: t
		});
		for (let n of s) !t.includes(n) && a.has(n) && e.issues.push(a.get(n));
	}
	let c = Fi(t.value, n.value);
	if (!c.valid) {
		if (he$1(e)) return e;
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`);
	}
	return e.value = c.data, e;
}
function Ri(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (!(t === `optin` ? e[n]._zod.optin !== void 0 : e[n]._zod.optout === `optional`)) return n + 1;
	return 0;
}
function zi(e, t, n) {
	e.issues.length && t.issues.push(...G$3(n, e.issues)), t.value[n] = e.value;
}
function Bi(e, t, n, r, i) {
	for (let a = 0; a < n.length; a++) {
		let o = e[a];
		let s = a < r.length;
		if (!s && a >= i && n[a]._zod.optin === `optional`) {
			t.value.length = a;
			break;
		}
		if (o.issues.length) {
			if (!s && a >= i) {
				t.value.length = a;
				break;
			}
			t.issues.push(...G$3(a, o.issues));
		}
		t.value[a] = o.value;
	}
	for (let e = t.value.length - 1; e >= r.length && n[e]._zod.optout === `optional` && t.value[e] === void 0; e--) t.value.length = e;
	return t;
}
function Ui(e, n, r, i, a, o, s) {
	e.issues.length && (E$2.has(typeof i) ? r.issues.push(...G$3(i, e.issues)) : r.issues.push({
		code: `invalid_key`,
		origin: `map`,
		input: a,
		inst: o,
		issues: e.issues.map((e) => ve$1(e, s, Ye$2()))
	})), n.issues.length && (E$2.has(typeof i) ? r.issues.push(...G$3(i, n.issues)) : r.issues.push({
		origin: `map`,
		code: `invalid_element`,
		input: a,
		inst: o,
		key: i,
		issues: n.issues.map((e) => ve$1(e, s, Ye$2()))
	})), r.value.set(e.value, n.value);
}
function Gi$1(e, t) {
	e.issues.length && t.issues.push(...e.issues), t.value.add(e.value);
}
function Xi$1(e, t) {
	return e.value = t.issues.length ? void 0 : t.value, e;
}
function ta$1(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
function ia$1(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: `invalid_type`,
		expected: `nonoptional`,
		input: e.value,
		inst: t
	}), e;
}
function oa$1(e, t, n, r) {
	return t.issues.length ? (e.value = n.catchValue({
		...t,
		value: e.value,
		error: { issues: t.issues.map((e) => ve$1(e, r, Ye$2())) },
		input: e.value
	}), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
function ua$1(e, t, n) {
	return e.issues.some((e) => e.code !== `unrecognized_keys`) ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
function fa$1(e, t, n) {
	if (e.issues.length) return e.aborted = !0, e;
	if ((n.direction || `forward`) === `forward`) {
		let r = t.transform(e.value, e);
		return r instanceof Promise ? r.then((r) => pa$1(e, r, t.out, n)) : pa$1(e, r, t.out, n);
	}
	{
		let r = t.reverseTransform(e.value, e);
		return r instanceof Promise ? r.then((r) => pa$1(e, r, t.in, n)) : pa$1(e, r, t.in, n);
	}
}
function pa$1(e, t, n, r) {
	return e.issues.length ? (e.aborted = !0, e) : n._zod.run({
		value: t,
		issues: e.issues
	}, r);
}
function ga$1(e) {
	return e.memo || (e.value = Object.freeze(e.value)), e;
}
function _a$1(e) {
	let t = e._zod.def;
	let n = t.pattern;
	let r = !!t.format?.includes(`int`);
	let i;
	let a;
	for (let e of t.checks ?? []) {
		let t = e._zod.def;
		t.pattern && (n = t.pattern), r ||= !!t.format?.includes(`int`);
		let o = t.minimum ?? t.length;
		let s = t.maximum ?? t.length;
		o !== void 0 && (i === void 0 || o > i) && (i = o), s !== void 0 && (a === void 0 || s < a) && (a = s);
	}
	if (n) return n.source;
	if (i !== void 0 && a !== void 0 && i > a) return `(?!)`;
	if (i !== void 0 || a !== void 0) return tn({
		minimum: i,
		maximum: a
	}).source;
	let o = e._zod.pattern;
	return (r && o === an ? rn : o)?.source;
}
function va$1(e) {
	let t = e._zod.def;
	let n = e._zod.pattern?.source;
	let r = t.innerType ?? e._zod.innerType;
	if (r) {
		let e = r._zod.pattern?.source;
		let t = va$1(r);
		return n && e && t && t !== e ? n.replace(te$1(e), () => te$1(t)) : n;
	}
	if (t.options) {
		let e = t.options.map(va$1);
		if (e.every(Boolean)) return `^(${e.map((e) => te$1(e)).join(`|`)})$`;
	}
	return _a$1(e);
}
function wa$1(e, t, n, r) {
	if (!e) {
		let e = {
			code: `custom`,
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(Ce$2(e));
	}
}
function Oa$1(e) {
	return typeof e == `object` && !!e;
}
function ka$1(e) {
	return e.map((e) => e.path ? {
		...e,
		path: e.path.slice()
	} : { ...e });
}
function ja$1(e, t, n) {
	let r = Aa$1.get(e);
	if (r !== void 0) return r ? 2 : 0;
	if (t.has(e)) return 2;
	t.add(e);
	let i = 0;
	let a = (e) => {
		if (i !== 2 && e?._zod) {
			let r = ja$1(e, t, n);
			r > i && (i = r);
		}
	};
	let o = (e, r) => {
		let i = 0;
		for (let a of Reflect.ownKeys(e)) {
			let o = Object.getOwnPropertyDescriptor(e, a);
			if (r && !o.enumerable) continue;
			let s = o.get ? 1 : o.value?._zod ? ja$1(o.value, t, n) : 0;
			s > i && (i = s);
		}
		return i;
	};
	let s = (e) => {
		e > i && (i = e);
	};
	let c = e._zod.def;
	switch (c.type) {
		case `object`: {
			let e = _$1(c);
			s(e ? o(e, !0) : 1), a(c.catchall);
			break;
		}
		case `array`:
			a(c.element);
			break;
		case `tuple`:
			for (let e of c.items) a(e);
			a(c.rest);
			break;
		case `record`:
		case `map`:
			a(c.keyType), a(c.valueType);
			break;
		case `set`:
			a(c.valueType);
			break;
		case `union`:
			for (let e of c.options) a(e);
			break;
		case `intersection`:
			a(c.left), a(c.right);
			break;
		case `optional`:
		case `nullable`:
		case `default`:
		case `prefault`:
		case `catch`:
		case `readonly`:
		case `nonoptional`:
		case `promise`:
		case `success`:
			a(c.innerType);
			break;
		case `pipe`:
			a(c.in), a(c.out);
			break;
		case `function`:
			a(c.input), a(c.output);
			break;
		case `lazy`: {
			let r = c._cachedInner ?? (n ? e._zod.innerType : void 0);
			s(r ? ja$1(r, t, !1) : 1);
			break;
		}
		case `template_literal`:
		case `string`:
		case `number`:
		case `int`:
		case `boolean`:
		case `bigint`:
		case `symbol`:
		case `undefined`:
		case `null`:
		case `void`:
		case `never`:
		case `any`:
		case `unknown`:
		case `date`:
		case `nan`:
		case `enum`:
		case `literal`:
		case `file`:
		case `transform`:
		case `custom`: break;
		default: for (let e in c) {
			let t = Object.getOwnPropertyDescriptor(c, e);
			if (!t || t.get) continue;
			let n = t.value;
			if (n && typeof n == `object`) {
				if (n._zod) a(n);
				else if (Array.isArray(n)) for (let e of n) a(e);
			}
		}
	}
	return t.delete(e), Ma$1(e, i);
}
function Ma$1(e, t) {
	return t !== 1 && Aa$1.set(e, t === 2), t;
}
function Na$1(e) {
	return ja$1(e, new Set(), !0) !== 0;
}
function Pa$1(e, t) {
	let n = e.buckets.get(t);
	return n || (n = new WeakMap(), e.buckets.set(t, n)), n;
}
function Ra$1() {
	return La$1;
}
function za$1(e, t) {
	let n = e[Ea$1]?.backEdges;
	return n !== void 0 && Oa$1(t) && n.has(t);
}
function Va$1() {
	return { localeError: Ba$1() };
}
function Ua$1() {
	return { localeError: Ha$1() };
}
function Wa$1(e, t, n, r) {
	let i = Math.abs(e);
	let a = i % 10;
	let o = i % 100;
	return o >= 11 && o <= 19 ? r : a === 1 ? t : a >= 2 && a <= 4 ? n : r;
}
function Ka$1() {
	return { localeError: Ga$1() };
}
function Ja$1() {
	return { localeError: qa$1() };
}
function Xa$1() {
	return { localeError: Ya$1() };
}
function Qa$1() {
	return { localeError: Za$1() };
}
function eo$1() {
	return { localeError: $a$1() };
}
function no$1() {
	return { localeError: to$1() };
}
function io$1() {
	return { localeError: ro$1() };
}
function oo$1() {
	return { localeError: ao$1() };
}
function co$1() {
	return { localeError: so$1() };
}
function uo$1() {
	return { localeError: lo$1() };
}
function po$1() {
	return { localeError: fo$1() };
}
function ho$1() {
	return { localeError: mo$1() };
}
function _o$1() {
	return { localeError: go$1() };
}
function yo$1() {
	return { localeError: vo$1() };
}
function xo$1() {
	return { localeError: bo$1() };
}
function Co$1() {
	return { localeError: So$1() };
}
function To$1() {
	return { localeError: wo$1() };
}
function Do$1() {
	return { localeError: Eo$1() };
}
function ko$1() {
	return { localeError: Oo$1() };
}
function jo$1() {
	return { localeError: Ao$1() };
}
function Mo$1(e, t, n) {
	return Math.abs(e) === 1 ? t : n;
}
function No$1(e) {
	if (!e) return ``;
	let t = [
		`ա`,
		`ե`,
		`ը`,
		`ի`,
		`ո`,
		`ու`,
		`օ`
	];
	let n = e[e.length - 1];
	return e + (t.includes(n) ? `ն` : `ը`);
}
function Fo$1() {
	return { localeError: Po$1() };
}
function Lo$1() {
	return { localeError: Io$1() };
}
function zo$1() {
	return { localeError: Ro$1() };
}
function Vo$1() {
	return { localeError: Bo$1() };
}
function Uo$1() {
	return { localeError: Ho$1() };
}
function Go$1() {
	return { localeError: Wo$1() };
}
function qo$1() {
	return { localeError: Ko$1() };
}
function Jo$1() {
	return qo$1();
}
function Xo$1() {
	return { localeError: Yo$1() };
}
function Qo$1() {
	return { localeError: Zo$1() };
}
function es$1(e) {
	let t = Math.abs(e);
	let n = t % 10;
	let r = t % 100;
	return r >= 11 && r <= 19 || n === 0 ? `many` : n === 1 ? `one` : `few`;
}
function ns$1() {
	return { localeError: ts$1() };
}
function is$1() {
	return { localeError: rs$1() };
}
function os$1() {
	return { localeError: as$1() };
}
function cs$1() {
	return { localeError: ss$1() };
}
function us$1() {
	return { localeError: ls$1() };
}
function fs$1() {
	return { localeError: ds$1() };
}
function ms$1() {
	return { localeError: ps$1() };
}
function gs$1() {
	return { localeError: hs$1() };
}
function vs$1() {
	return { localeError: _s$1() };
}
function bs$1() {
	return { localeError: ys$1() };
}
function Ss$1() {
	return { localeError: xs$1() };
}
function ws$1() {
	return { localeError: Cs$1() };
}
function Es$1() {
	return { localeError: Ts$1() };
}
function Ds$1(e, t, n, r) {
	let i = Math.abs(e);
	let a = i % 10;
	let o = i % 100;
	return o >= 11 && o <= 19 ? r : a === 1 ? t : a >= 2 && a <= 4 ? n : r;
}
function ks$1() {
	return { localeError: Os$1() };
}
function js$1() {
	return { localeError: As$1() };
}
function Ns$1() {
	return { localeError: Ms$1() };
}
function Fs$1() {
	return { localeError: Ps$1() };
}
function Ls$1() {
	return { localeError: Is$1() };
}
function zs$1() {
	return { localeError: Rs$1() };
}
function Vs$1() {
	return { localeError: Bs$1() };
}
function Us$1() {
	return { localeError: Hs$1() };
}
function Gs$1() {
	return { localeError: Ws$1() };
}
function qs$1() {
	return { localeError: Ks$1() };
}
function Js$1() {
	return qs$1();
}
function Xs$1() {
	return { localeError: Ys$1() };
}
function Qs$1() {
	return { localeError: Zs$1() };
}
function ec$1() {
	return { localeError: $s$1() };
}
function nc$1() {
	return { localeError: tc$1() };
}
function ic$1() {
	return { localeError: rc$1() };
}
function oc$1() {
	return { localeError: ac$1() };
}
function fc$1() {
	return new dc$1();
}
function mc$1(e, t) {
	try {
		return vc$1(e, { assertOnly: !0 });
	} catch {
		return t;
	}
}
function hc$1(e, t) {
	try {
		let t = vc$1(e);
		let n = gc$1(e, t);
		return n._zod.bag.validator = mc$1(e, t), n;
	} catch (n) {
		if (t?.strict) throw n;
		return e;
	}
}
function gc$1(e, t) {
	if (Na$1(e)) throw new L$2(`a schema whose subtree contains a reference cycle`);
	let n = k$2(e);
	let r = e._zod.run;
	let i = r.__originalRun ?? r;
	let a = (e, n) => {
		if (n?.async || n?.direction === `backward` || n?.skipChecks || n?.[pc$1] || n && za$1(n, e.value)) return i(e, n);
		let r = t(e.value);
		return r === F$2 ? (n && (n[pc$1] = !0), i(e, n)) : (e.value = r, e);
	};
	return a.__originalRun = i, n._zod.bag.fallbackRun = i, n._zod.bag.validator = t, n._zod.run = a, r.__originalRun || _c$1(n, e, t), n;
}
function _c$1(e, t, n) {
	let r = e;
	let i = t;
	if (typeof i.safeParse == `function`) {
		let e = i.safeParse;
		r.safeParse = (t, r) => {
			let i = n(t);
			return i === F$2 ? e(t, r) : {
				success: !0,
				data: i
			};
		};
	}
	if (typeof i.parse == `function`) {
		let e = i.parse;
		r.parse = (t, r) => {
			let i = n(t);
			return i === F$2 ? e(t, r) : i;
		};
	}
}
function vc$1(e, t) {
	let n = !0;
	try {
		n = Na$1(e);
	} catch {}
	if (n) throw new L$2(`a schema whose subtree contains a reference cycle`);
	let r = {
		constants: new Map(),
		constantCounter: 0,
		varCounter: 0,
		definite: !0
	};
	let i = new tr([`input`]);
	let a = U$2(i, r, e, `input`, !t?.assertOnly);
	i.write(a === null ? `return true;` : `return ${a};`);
	let o = [`INVALID`, ...r.constants.keys()];
	let s = [F$2, ...r.constants.values()];
	let c = i.content.join(`
`);
	let l = t?.debug ? o.length > 0 ? `// Constants: ${o.join(`, `)}\n${c}` : c : ``;
	let u = Function;
	let d = `return (input) => {\n${c}\n}`;
	let f;
	try {
		f = new u(...o, d)(...s);
	} catch (e) {
		throw new L$2(`this schema (generated code failed to evaluate: ${e.message})`);
	}
	return t?.debug && (f.code = l), f.definite = r.definite, f;
}
function R$3(e, t) {
	for (let [n, r] of e.constants) if (r === t) return n;
	let n = `c${e.constantCounter++}`;
	return e.constants.set(n, t), n;
}
function z$3(e, t) {
	return e.definite = !1, R$3(e, t);
}
function B$2(e) {
	return `v${e.varCounter++}`;
}
function yc$1(e, t) {
	let n = e._zod.run({
		value: t,
		issues: []
	}, {});
	if (n && typeof n.then == `function`) return F$2;
	let r = n;
	return r.issues.length === 0 ? r.value : F$2;
}
function V$3(e, t, n, r, i = !0) {
	let a = e.content.length;
	let o = t.constants.size;
	let s = t.constantCounter;
	let c = t.varCounter;
	try {
		return U$2(e, t, n, r, i);
	} catch (i) {
		if (!(i instanceof L$2) || !i.islandable) throw i;
		if (e.content.length = a, t.constants.size > o) {
			let e = Array.from(t.constants.keys()).slice(o);
			for (let n of e) t.constants.delete(n);
		}
		return t.constantCounter = s, t.varCounter = c, bc$1(e, t, n, r);
	}
}
function bc$1(e, t, n, r) {
	t.definite = !1;
	let i = R$3(t, n);
	let a = R$3(t, yc$1);
	let o = B$2(t);
	return e.write(`const ${o} = ${a}(${i}, ${r});`), e.write(`if (${o} === INVALID) return INVALID;`), o;
}
function Sc$1(e, t, n, r) {
	let i = n._zod.def.checks;
	if (!i || i.length === 0) return r;
	let a = r;
	for (let n of i) {
		let r = n._zod.def;
		if (r.when && !xc$1.has(r.check)) throw new L$2(`check with a custom "when" condition`);
		switch (r.check) {
			case `greater_than`:
				Tc$1(e, t, r, a);
				break;
			case `less_than`:
				Ec$1(e, t, r, a);
				break;
			case `multiple_of`:
				Dc$1(e, t, r, a);
				break;
			case `number_format`:
				Oc$1(e, r, a);
				break;
			case `min_length`: {
				let n = H$3(r.minimum, `min_length`);
				let i = Cc$1(e, t, a, `${a}.length >= ${n} && ${a}.length < ${r.minimum * 2}`);
				e.write(`if (${i} < ${n}) return INVALID;`);
				break;
			}
			case `max_length`: {
				let n = H$3(r.maximum, `max_length`);
				let i = Cc$1(e, t, a, `${a}.length > ${n}`);
				e.write(`if (${i} > ${n}) return INVALID;`);
				break;
			}
			case `length_equals`: {
				let n = H$3(r.length, `length_equals`);
				let i = Cc$1(e, t, a, `${a}.length >= ${n} && ${a}.length <= ${r.length * 2}`);
				e.write(`if (${i} !== ${n}) return INVALID;`);
				break;
			}
			case `min_size`:
				e.write(`if (${a}.size < ${H$3(r.minimum, `min_size`)}) return INVALID;`);
				break;
			case `max_size`:
				e.write(`if (${a}.size > ${H$3(r.maximum, `max_size`)}) return INVALID;`);
				break;
			case `size_equals`:
				e.write(`if (${a}.size !== ${H$3(r.size, `size_equals`)}) return INVALID;`);
				break;
			case `string_format`:
				a = Rc(e, t, r, a);
				break;
			case `custom`:
				a = Ic(e, t, n, a);
				break;
			case `bigint_format`:
				kc$1(e, r, a);
				break;
			case `mime_type`:
				Ac$1(e, t, r, a);
				break;
			case `property`:
				Mc$1(e, t, r, a);
				break;
			case `properties`:
				jc$1(e, t, r, a);
				break;
			case `overwrite`: {
				let r = B$2(t);
				Nc$1(e, t, n, a, r), a = r;
				break;
			}
			default: throw new L$2(`check type ${r.check}`);
		}
	}
	return a;
}
function Cc$1(e, t, n, r) {
	let i = R$3(t, xe$1);
	let a = B$2(t);
	return e.write(`const ${a} = typeof ${n} === "string" && ${r} ? ${i}(${n}) : ${n}.length;`), a;
}
function H$3(e, t) {
	if (typeof e != `number` || !Number.isFinite(e)) throw new L$2(`${t} bound of type ${typeof e}`);
	return `${e}`;
}
function wc$1(e, t) {
	if (typeof t == `bigint`) return `${t}n`;
	if (typeof t == `number`) {
		if (Number.isNaN(t)) throw new L$2(`comparison check with NaN bound`);
		return `${t}`;
	}
	if (t instanceof Date) {
		if (Number.isNaN(t.getTime())) throw new L$2(`comparison check with Invalid Date bound`);
		return R$3(e, t);
	}
	throw new L$2(`comparison check bound of type ${typeof t}`);
}
function Tc$1(e, t, n, r) {
	let i = n.inclusive ? `<` : `<=`;
	e.write(`if (${r} ${i} ${wc$1(t, n.value)}) return INVALID;`);
}
function Ec$1(e, t, n, r) {
	let i = n.inclusive ? `>` : `>=`;
	e.write(`if (${r} ${i} ${wc$1(t, n.value)}) return INVALID;`);
}
function Dc$1(e, t, r, i) {
	if (typeof r.value == `bigint`) {
		if (r.value === BigInt(0)) throw new L$2(`multiple_of check with a zero divisor`);
		e.write(`if (${i} % ${r.value}n !== 0n) return INVALID;`);
	} else {
		let a = R$3(t, p$3);
		e.write(`if (${a}(${i}, ${H$3(r.value, `multiple_of`)}) !== 0) return INVALID;`);
	}
}
function Oc$1(e, t, n) {
	let r = t.format;
	switch (r) {
		case `safeint`:
			e.write(`if (!Number.isSafeInteger(${n})) return INVALID;`);
			break;
		case `int32`:
			e.write(`if (!Number.isInteger(${n}) || ${n} < -2147483648 || ${n} > 2147483647) return INVALID;`);
			break;
		case `uint32`:
			e.write(`if (!Number.isInteger(${n}) || ${n} < 0 || ${n} > 4294967295) return INVALID;`);
			break;
		case `float32`:
			e.write(`if (!Number.isFinite(${n}) || ${n} < -3.4028234663852886e38 || ${n} > 3.4028234663852886e38) return INVALID;`);
			break;
		case `float64`:
			e.write(`if (!Number.isFinite(${n})) return INVALID;`);
			break;
		default: throw new L$2(`number format ${r}`);
	}
}
function kc$1(e, t, n) {
	let r = t.format;
	if (r) switch (r) {
		case `int64`:
			e.write(`if (${n} < -9223372036854775808n || ${n} > 9223372036854775807n) return INVALID;`);
			break;
		case `uint64`:
			e.write(`if (${n} < 0n || ${n} > 18446744073709551615n) return INVALID;`);
			break;
		default: throw new L$2(`bigint format ${r}`);
	}
}
function Ac$1(e, t, n, r) {
	let i = n.mime;
	if (i && i.length > 0) {
		let n = R$3(t, new Set(i));
		e.write(`if (!${n}.has(${r}.type)) return INVALID;`);
	}
}
function jc$1(e, t, n, r) {
	if (n.when) throw new L$2(`check with a custom "when" condition`);
	e.write(`if (${r} == null) return INVALID;`);
	let i = n.shape;
	for (let n of Reflect.ownKeys(i)) {
		let a = typeof n == `symbol` ? R$3(t, n) : ue$1(n);
		let o = B$2(t);
		e.write(`const ${o} = ${r}[${a}];`), V$3(e, t, i[n], o, !1);
	}
}
function Mc$1(e, t, n, r) {
	let i = `${r}[${JSON.stringify(n.property)}]`;
	U$2(e, t, n.schema, i);
}
function Nc$1(e, t, n, r, i) {
	let a = n._zod.def.tx;
	if (!a) throw new L$2(`overwrite check without a transform function`);
	if (G$2(a)) throw new I$2(`z.compile: async overwrite transforms are not supported`);
	let o = R$3(t, a);
	e.write(`const ${i} = ${o}(${r});`);
}
function Pc$1() {
	throw new qe$2();
}
function Fc$1(e) {
	this.issues.push(e);
}
function Ic(e, t, n, r) {
	let i = n._zod.def;
	if (i.fn) {
		if (G$2(i.fn)) throw new I$2(`z.compile: async .refine() predicates are not supported`);
		let n = z$3(t, i.fn);
		let a = R$3(t, Pc$1);
		let o = B$2(t);
		return e.write(`const ${o} = ${n}(${r});`), e.write(`if (${o} instanceof Promise) ${a}();`), e.write(`if (!${o}) return INVALID;`), r;
	}
	if (n._zod.check) {
		if (G$2(n._zod.check)) throw new I$2(`z.compile: async .superRefine() / check functions are not supported`);
		let i = n._zod.check;
		let a = z$3(t, (e) => {
			let t = {
				value: e,
				issues: [],
				addIssue: Fc$1
			};
			return i(t) instanceof Promise && Pc$1(), t.issues.length === 0 ? t.value : F$2;
		});
		let o = B$2(t);
		return e.write(`const ${o} = ${a}(${r});`), e.write(`if (${o} === INVALID) return INVALID;`), o;
	}
	throw new L$2(`custom check without a predicate or check function`);
}
function Rc(e, t, n, r, i = !0) {
	let a = n.format;
	if (a === `base64`) {
		let n = R$3(t, zr);
		return e.write(`if (!${n}(${r})) return INVALID;`), r;
	}
	if (a === `base64url`) {
		let n = R$3(t, Ur);
		return e.write(`if (!${n}(${r})) return INVALID;`), r;
	}
	if (a === `jwt`) {
		let i = R$3(t, $r);
		let a = R$3(t, n.alg ?? null);
		return e.write(`if (!${i}(${r}, ${a})) return INVALID;`), r;
	}
	if (a === `ipv6`) {
		let n = R$3(t, Nr);
		return e.write(`if (!${n}(${r})) return INVALID;`), r;
	}
	if (a === `cidrv6`) {
		let n = R$3(t, Lr);
		return e.write(`if (!${n}(${r})) return INVALID;`), r;
	}
	if (a === `credit_card`) {
		let n = R$3(t, Jr);
		return e.write(`if (!${n}(${r})) return INVALID;`), r;
	}
	if (a === `iban`) {
		let n = R$3(t, Zr);
		return e.write(`if (!${n}(${r})) return INVALID;`), r;
	}
	let o = n;
	if (a === `url` || a === `httpurl` || o.normalize || o.hostname !== void 0 || o.protocol !== void 0) {
		let a = R$3(t, pr);
		let s = R$3(t, n);
		let c = B$2(t);
		let l = B$2(t);
		if (e.write(`const ${c} = ${r}.trim();`), e.write(`const ${l} = ${a}(${c}, ${s});`), e.write(`if (typeof ${l} === "number") return INVALID;`), o.hostname !== void 0) {
			let n = R$3(t, _r);
			e.write(`if (!${n}(${l}, ${s}.hostname)) return INVALID;`);
		}
		if (o.protocol !== void 0) {
			let n = R$3(t, vr);
			e.write(`if (!${n}(${l}, ${s}.protocol)) return INVALID;`);
		}
		if (!i) return null;
		let u = B$2(t);
		let d = o.normalize ? `${l}.href` : `${R$3(t, gr)}(${c})`;
		return e.write(`const ${u} = ${d};`), u;
	}
	let s = n.fn;
	if (s) {
		if (G$2(s)) throw new L$2(`async string format ${a}`);
		let n = R$3(t, s);
		return e.write(`if (!${n}(${r})) return INVALID;`), r;
	}
	if (Lc.has(a) && n.pattern) {
		let i = R$3(t, n.pattern);
		return e.write(`${i}.lastIndex = 0;`), e.write(`if (!${i}.test(${r})) return INVALID;`), r;
	}
	let c = n.format;
	switch (c) {
		case `regex`: throw new L$2(`regex format without a pattern`);
		case `lowercase`:
			e.write(`if (${r} !== ${r}.toLowerCase()) return INVALID;`);
			break;
		case `uppercase`:
			e.write(`if (${r} !== ${r}.toUpperCase()) return INVALID;`);
			break;
		case `includes`:
			e.write(`if (!${r}.includes(${ue$1(n.includes)})) return INVALID;`);
			break;
		case `starts_with`: {
			let t = n.prefix;
			e.write(`if (${r}.slice(0, ${t.length}) !== ${ue$1(t)}) return INVALID;`);
			break;
		}
		case `ends_with`: {
			let t = n.suffix;
			e.write(`if (${r}.slice(-${t.length}) !== ${ue$1(t)}) return INVALID;`);
			break;
		}
		default: throw new L$2(`string format ${c}`);
	}
	return r;
}
function U$2(e, t, n, r, i = !0) {
	let a = n._zod.def;
	let o = a.type;
	if (a.coerce) throw new L$2(`coercion (z.coerce.${o}())`);
	let s = i || !!a.checks?.length;
	let c;
	switch (o) {
		case `string`:
			c = zc(e, t, n, r, s);
			break;
		case `number`:
			c = Bc(e, n, r);
			break;
		case `boolean`:
			c = Vc(e, r);
			break;
		case `bigint`:
			c = Hc(e, n, r);
			break;
		case `symbol`:
			c = Uc(e, r);
			break;
		case `undefined`:
			c = Wc(e, r);
			break;
		case `null`:
			c = Gc(e, r);
			break;
		case `any`:
		case `unknown`:
			c = r;
			break;
		case `never`:
			e.write(`return INVALID;`), c = r;
			break;
		case `void`:
			c = Kc(e, r);
			break;
		case `nan`:
			c = qc(e, r);
			break;
		case `date`:
			c = Jc(e, r);
			break;
		case `object`:
			c = Yc(e, t, n, r, s);
			break;
		case `optional`:
			c = Xc(e, t, n, r, s);
			break;
		case `nullable`:
			c = nl(e, t, n, r, s);
			break;
		case `array`:
			c = il(e, t, n, r, s);
			break;
		case `literal`:
			c = al(e, t, n, r);
			break;
		case `enum`:
			c = ol(e, t, n, r);
			break;
		case `readonly`: {
			let i = sl(e, t, n, r);
			let a = B$2(t);
			e.write(`const ${a} = Object.freeze(${i});`), c = a;
			break;
		}
		case `success`:
			sl(e, t, n, r), c = `true`;
			break;
		case `default`:
		case `prefault`:
			c = cl(e, t, n, r);
			break;
		case `nonoptional`:
			c = ll(e, t, n, r);
			break;
		case `tuple`:
			c = ul(e, t, n, r);
			break;
		case `union`:
			c = fl(e, t, n, r);
			break;
		case `intersection`:
			c = hl(e, t, n, r);
			break;
		case `record`:
			c = gl(e, t, n, r);
			break;
		case `map`:
			c = yl(e, t, n, r);
			break;
		case `set`:
			c = bl(e, t, n, r);
			break;
		case `file`:
			c = xl(e, r);
			break;
		case `template_literal`:
			c = Sl(e, t, n, r);
			break;
		case `lazy`:
			c = Cl(e, t, n, r);
			break;
		case `pipe`:
			c = wl(e, t, n, r);
			break;
		case `custom`:
			c = Tl(e, t, n, r);
			break;
		case `transform`:
			c = Ol(e, t, n, r);
			break;
		case `catch`:
			c = Dl(e, t, n, r);
			break;
		default: throw new L$2(`schema type ${o}`);
	}
	return c === null ? null : Sc$1(e, t, n, c);
}
function zc(e, t, n, r, i = !0) {
	e.write(`if (typeof ${r} !== "string") return INVALID;`);
	let a = n._zod.def;
	return a.format === void 0 ? r : Rc(e, t, a, r, i);
}
function Bc(e, t, n) {
	e.write(`if (typeof ${n} !== "number" || !Number.isFinite(${n})) return INVALID;`);
	let r = t._zod.def;
	return r.check === `number_format` && r.format && Oc$1(e, { format: r.format }, n), n;
}
function Vc(e, t) {
	return e.write(`if (typeof ${t} !== "boolean") return INVALID;`), t;
}
function Hc(e, t, n) {
	e.write(`if (typeof ${n} !== "bigint") return INVALID;`);
	let r = t._zod.def;
	if (r.format) switch (r.format) {
		case `int64`:
			e.write(`if (${n} < -9223372036854775808n || ${n} > 9223372036854775807n) return INVALID;`);
			break;
		case `uint64`: e.write(`if (${n} < 0n || ${n} > 18446744073709551615n) return INVALID;`);
	}
	return n;
}
function Uc(e, t) {
	return e.write(`if (typeof ${t} !== "symbol") return INVALID;`), t;
}
function Wc(e, t) {
	return e.write(`if (${t} !== undefined) return INVALID;`), t;
}
function Gc(e, t) {
	return e.write(`if (${t} !== null) return INVALID;`), t;
}
function Kc(e, t) {
	return e.write(`if (${t} !== undefined) return INVALID;`), t;
}
function qc(e, t) {
	return e.write(`if (typeof ${t} !== "number" || !Number.isNaN(${t})) return INVALID;`), t;
}
function Jc(e, t) {
	return e.write(`if (!(${t} instanceof Date) || Number.isNaN(${t}.getTime())) return INVALID;`), t;
}
function Yc(e, t, n, r, i = !0) {
	let a = n._zod.def;
	e.write(`if (typeof ${r} !== "object" || ${r} === null || Array.isArray(${r})) return INVALID;`);
	let o = a.shape;
	let s = Object.keys(o);
	let c = Object.getOwnPropertySymbols(o);
	let l = c.length ? [...s, ...c] : s;
	let u = (e) => typeof e == `symbol` ? R$3(t, e) : ue$1(e);
	let d = (e) => typeof e == `symbol` ? `[${u(e)}]` : ue$1(e);
	let f = o;
	if (s.includes(`__proto__`)) throw new L$2(`object shape key "__proto__"`);
	let p = new Map();
	for (let n of l) {
		let a = f[n];
		let o = u(n);
		let s = B$2(t);
		if (e.write(`const ${s} = ${r}[${o}];`), a._zod.optin !== void 0) {
			let i = B$2(t);
			e.write(`let ${i} = (() => {`), e.indented((e) => {
				let n = V$3(e, t, a, s);
				e.write(`return ${n};`);
			}), e.write(`})();`), a._zod.optout === `optional` ? (e.write(`if (${i} === INVALID) {`), e.indented((e) => {
				e.write(`if (${o} in ${r}) return INVALID;`), e.write(`${i} = undefined;`);
			}), e.write(`}`)) : e.write(`if (${i} === INVALID) return INVALID;`), p.set(n, i);
		} else {
			Qc(a) && e.write(`if (!(${o} in ${r})) return INVALID;`);
			let c = V$3(e, t, a, s, i);
			c !== null && p.set(n, c);
		}
	}
	let m = a.catchall;
	let h = `none`;
	if (m) {
		let t = m._zod.def.type;
		if (t === `never`) {
			let t = s.map((e) => `k !== ${ue$1(e)}`).join(` && `) || `true`;
			e.write(`for (const k in ${r}) {`), e.indented((e) => {
				e.write(`if (${t}) return INVALID;`);
			}), e.write(`}`);
		} else h = (t === `unknown` || t === `any`) && !m._zod.def.checks?.length ? `passthrough` : `schema`;
	}
	let g = B$2(t);
	let v = l.some((e) => el(f[e]) || $c(f[e]));
	if (!i) {
		if (h === `schema`) {
			let n = s.length > 0 ? R$3(t, new Set(s)) : null;
			e.write(`for (const k in ${r}) {`), e.indented((e) => {
				e.write(`if (k === "__proto__") continue;`), n && e.write(`if (${n}.has(k)) continue;`);
				let i = B$2(t);
				e.write(`const ${i} = ${r}[k];`), V$3(e, t, m, i, !1);
			}), e.write(`}`);
		}
		return null;
	}
	if (v) {
		e.write(`const ${g} = {};`);
		for (let t of l) {
			let n = u(t);
			let i = p.get(t);
			$c(f[t]) ? e.write(`if (${n} in ${r}) ${g}[${n}] = ${i};`) : el(f[t]) ? e.write(`if (${i} !== undefined || ${n} in ${r}) ${g}[${n}] = ${i};`) : e.write(`${g}[${n}] = ${i};`);
		}
	} else {
		let t = l.map((e) => `${d(e)}: ${p.get(e)}`).join(`, `);
		e.write(`const ${g} = { ${t} };`);
	}
	if (h !== `none`) {
		let n = s.length > 0 ? R$3(t, new Set(s)) : null;
		e.write(`for (const k in ${r}) {`), e.indented((e) => {
			if (e.write(`if (k === "__proto__") continue;`), n && e.write(`if (${n}.has(k)) continue;`), h === `passthrough`) e.write(`${g}[k] = ${r}[k];`);
			else {
				let n = B$2(t);
				e.write(`const ${n} = ${r}[k];`);
				let i = V$3(e, t, m, n);
				e.write(`${g}[k] = ${i};`);
			}
		}), e.write(`}`);
	}
	return g;
}
function Xc(e, t, n, r, i = !0) {
	let a = n._zod.def;
	if (Zc(n)) return U$2(e, t, a.innerType, r, i);
	if (a.innerType._zod.optin === `defaulted`) {
		let n = B$2(t);
		let i = B$2(t);
		return e.write(`let ${n};`), e.write(`if (${r} === undefined) {`), e.indented((e) => {
			e.write(`const ${i} = (() => {`), e.indented((e) => {
				let n = U$2(e, t, a.innerType, r);
				e.write(`return ${n};`);
			}), e.write(`})();`), e.write(`if (${i} !== INVALID) ${n} = ${i};`);
		}), e.write(`} else {`), e.indented((e) => {
			let i = U$2(e, t, a.innerType, r);
			e.write(`${n} = ${i};`);
		}), e.write(`}`), n;
	}
	let o = i ? B$2(t) : null;
	return o && e.write(`let ${o};`), e.write(`if (${r} !== undefined) {`), e.indented((e) => {
		let n = U$2(e, t, a.innerType, r, i);
		o && n !== null && e.write(`${o} = ${n};`);
	}), e.write(`}`), o;
}
function Zc(e) {
	return e._zod.traits?.has(`$ZodExactOptional`) === !0;
}
function Qc(e) {
	return e._zod.optin === void 0 && W$2(e);
}
function W$2(e) {
	if (e._zod.def.coerce) return !0;
	let t = e._zod.def;
	switch (t.type) {
		case `any`:
		case `unknown`:
		case `undefined`:
		case `void`:
		case `default`:
		case `prefault`:
		case `transform`:
		case `custom`:
		case `lazy`: return !0;
		case `string`:
		case `number`:
		case `boolean`:
		case `bigint`:
		case `symbol`:
		case `null`:
		case `never`:
		case `nan`:
		case `date`:
		case `object`:
		case `array`:
		case `tuple`:
		case `record`:
		case `map`:
		case `set`:
		case `file`:
		case `template_literal`: return !1;
		case `nonoptional`: return t.innerType ? W$2(t.innerType) : !1;
		case `literal`: return !!t.values?.includes(void 0);
		case `enum`: return !!e._zod.values?.has(void 0);
		case `optional`:
		case `nullable`:
		case `readonly`:
		case `success`: return !t.innerType || W$2(t.innerType);
		case `catch`: return !0;
		case `union`: return !t.options || t.options.some(W$2);
		case `intersection`: return !t.left || !t.right || W$2(t.left) && W$2(t.right);
		case `pipe`: return !t.in || W$2(t.in);
		default: return !0;
	}
}
function $c(e) {
	return e._zod.optin === `optional` && e._zod.optout === `optional`;
}
function el(e) {
	return (e._zod.optin !== `defaulted` || e._zod.optout === `optional`) && tl(e);
}
function tl(e) {
	let t = e._zod.def;
	switch (t.type) {
		case `string`:
		case `number`:
		case `boolean`:
		case `bigint`:
		case `symbol`:
		case `null`:
		case `nan`:
		case `date`:
		case `object`:
		case `array`:
		case `tuple`:
		case `record`:
		case `map`:
		case `set`:
		case `file`:
		case `template_literal`:
		case `never`:
		case `success`: return !1;
		case `literal`: return !!t.values?.includes(void 0);
		case `enum`: return !!e._zod.values?.has(void 0);
		case `optional`: return !0;
		case `nullable`:
		case `readonly`:
		case `nonoptional`: return !t.innerType || tl(t.innerType);
		case `union`: return !t.options || t.options.some(tl);
		case `intersection`: return !t.left || !t.right || tl(t.left) || tl(t.right);
		case `pipe`: return !t.out || tl(t.out);
		default: return !0;
	}
}
function nl(e, t, n, r, i = !0) {
	let a = n._zod.def;
	let o = i ? B$2(t) : null;
	return o && e.write(`let ${o} = null;`), e.write(`if (${r} !== null) {`), e.indented((e) => {
		let n = U$2(e, t, a.innerType, r, i);
		o && n !== null && e.write(`${o} = ${n};`);
	}), e.write(`}`), o;
}
function rl(e, t, n) {
	for (let [r, i] of ge$1(t._zod.def.checks)) e.write(`if (${n} > ${H$3(r, i._zod.def.check)}) return INVALID;`);
}
function il(e, t, n, r, i = !0) {
	let a = n._zod.def;
	e.write(`if (!Array.isArray(${r})) return INVALID;`), rl(e, n, `${r}.length`);
	let o = i ? B$2(t) : null;
	let s = B$2(t);
	let c = B$2(t);
	return o && e.write(`const ${o} = new Array(${r}.length);`), e.write(`for (let ${s} = 0; ${s} < ${r}.length; ${s}++) {`), e.indented((e) => {
		e.write(`const ${c} = ${r}[${s}];`);
		let n = V$3(e, t, a.element, c, i);
		o && n !== null && e.write(`${o}[${s}] = ${n};`);
	}), e.write(`}`), o;
}
function al(e, t, n, r) {
	let i = n._zod.def.values;
	if (i.length !== 1) {
		let n = R$3(t, new Set(i));
		return e.write(`if (!${n}.has(${r})) return INVALID;`), r;
	}
	let a = i[0];
	if (typeof a == `number` && Number.isNaN(a)) {
		let n = R$3(t, new Set(i));
		return e.write(`if (!${n}.has(${r})) return INVALID;`), r;
	}
	if (typeof a == `string`) e.write(`if (${r} !== ${ue$1(a)}) return INVALID;`);
	else if (typeof a == `number` || typeof a == `boolean`) e.write(`if (${r} !== ${a}) return INVALID;`);
	else if (a === null) e.write(`if (${r} !== null) return INVALID;`);
	else if (a === void 0) e.write(`if (${r} !== undefined) return INVALID;`);
	else if (typeof a == `bigint`) e.write(`if (${r} !== ${a}n) return INVALID;`);
	else throw new L$2(`literal type ${typeof a}`);
	return r;
}
function ol(e, t, n, r) {
	let i = n._zod.values;
	if (!i) throw new L$2(`enum schema without enumerated values`);
	let a = R$3(t, i);
	return e.write(`if (!${a}.has(${r})) return INVALID;`), r;
}
function sl(e, t, n, r) {
	let i = n._zod.def;
	return U$2(e, t, i.innerType, r);
}
function cl(e, t, n, r) {
	let i = n._zod.def;
	let a = Object.getOwnPropertyDescriptor(n._zod.def, `defaultValue`) ? () => n._zod.def.defaultValue : void 0;
	if (n._zod.def.type === `prefault`) {
		if (!a) return U$2(e, t, i.innerType, r);
		let n = R$3(t, a);
		let o = B$2(t);
		return e.write(`let ${o} = ${r};`), e.write(`if (${r} === undefined) ${o} = ${n}();`), U$2(e, t, i.innerType, o);
	}
	let o = B$2(t);
	if (a) {
		let n = R$3(t, a);
		let s = R$3(t, T$2);
		e.write(`let ${o};`), e.write(`if (${r} === undefined) {`), e.indented((e) => {
			e.write(`${o} = ${s}(${n}());`);
		}), e.write(`} else {`), e.indented((e) => {
			let a = U$2(e, t, i.innerType, r);
			e.write(`${o} = ${a} === undefined ? ${s}(${n}()) : ${a};`);
		}), e.write(`}`);
	} else e.write(`let ${o};`), e.write(`if (${r} !== undefined) {`), e.indented((e) => {
		let n = U$2(e, t, i.innerType, r);
		e.write(`${o} = ${n};`);
	}), e.write(`}`);
	return o;
}
function ll(e, t, n, r) {
	let i = n._zod.def;
	let a = U$2(e, t, i.innerType, r);
	let o = B$2(t);
	return e.write(`const ${o} = ${a};`), e.write(`if (${o} === undefined) return INVALID;`), o;
}
function ul(e, t, n, r) {
	let i = n._zod.def;
	let a = i.items;
	let o = i.rest;
	e.write(`if (!Array.isArray(${r})) return INVALID;`);
	let s = dl(a, `optin`);
	let c = dl(a, `optout`);
	o ? e.write(`if (${r}.length < ${s}) return INVALID;`) : e.write(`if (${r}.length < ${s} || ${r}.length > ${a.length}) return INVALID;`);
	let l = B$2(t);
	e.write(`const ${l} = [];`);
	for (let n = 0; n < a.length; n++) {
		let i = a[n];
		if (n >= c) e.write(`if (${l}.length === ${n}) {`), e.indented((e) => {
			e.write(`if (${n} < ${r}.length) {`), e.indented((e) => {
				let a = B$2(t);
				e.write(`const ${a} = ${r}[${n}];`);
				let o = V$3(e, t, i, a);
				e.write(`${l}[${n}] = ${o};`);
			}), e.write(`} else {`), e.indented((e) => {
				if ($c(i)) {
					e.write(`${l}.length = ${n};`);
					return;
				}
				let r = B$2(t);
				let a = B$2(t);
				e.write(`const ${r} = undefined;`), e.write(`const ${a} = (() => {`), e.indented((e) => {
					let n = V$3(e, t, i, r);
					e.write(`return ${n};`);
				}), e.write(`})();`), e.write(`if (${a} === INVALID || ${a} === undefined) ${l}.length = ${n};`), e.write(`else ${l}[${n}] = ${a};`);
			}), e.write(`}`);
		}), e.write(`}`);
		else {
			let a = B$2(t);
			e.write(`const ${a} = ${r}[${n}];`);
			let o = V$3(e, t, i, a);
			e.write(`${l}[${n}] = ${o};`);
		}
	}
	if (o) {
		let n = B$2(t);
		let i = B$2(t);
		e.write(`for (let ${n} = ${a.length}; ${n} < ${r}.length; ${n}++) {`), e.indented((e) => {
			e.write(`const ${i} = ${r}[${n}];`);
			let a = V$3(e, t, o, i);
			e.write(`${l}[${n}] = ${a};`);
		}), e.write(`}`);
	}
	return l;
}
function dl(e, t) {
	for (let n = e.length - 1; n >= 0; n--) if (!(t === `optin` ? e[n]._zod.optin !== void 0 : e[n]._zod.optout === `optional`)) return n + 1;
	return 0;
}
function fl(e, t, n, r) {
	let i = n._zod.def;
	let a = i.options;
	if (i.discriminator) return pl(e, t, i, r);
	if (i.inclusive === !1) throw new L$2(`exclusive unions (z.xor)`);
	if (a.length === 0) return e.write(`return INVALID;`), r;
	if (a.length === 1) return U$2(e, t, a[0], r);
	if (a.every((e) => e._zod.def.type === `literal` && !e._zod.def.checks?.length)) {
		let n = R$3(t, new Set(a.flatMap((e) => e._zod.def.values)));
		return e.write(`if (!${n}.has(${r})) return INVALID;`), r;
	}
	let o = B$2(t);
	e.write(`let ${o};`);
	for (let n = 0; n < a.length; n++) {
		let i = a[n];
		n === 0 ? e.write(`${o} = (() => {`) : e.write(`if (${o} === INVALID) ${o} = (() => {`), e.indented((e) => {
			let n = U$2(e, t, i, r);
			e.write(`return ${n};`);
		}), e.write(`})();`);
	}
	return e.write(`if (${o} === INVALID) return INVALID;`), o;
}
function pl(e, t, n, r) {
	if (n.unionFallback) throw new L$2(`discriminated union with unionFallback`);
	if (n.options.length === 0) return e.write(`return INVALID;`), r;
	let i = B$2(t);
	let a = B$2(t);
	e.write(`const ${i} = ${r}?.[${ue$1(n.discriminator)}];`), e.write(`let ${a};`);
	let o = !0;
	let s = new Set();
	for (let c of n.options) {
		let l = c._zod.propValues?.[n.discriminator];
		if (!l || l.size === 0) throw new L$2(`discriminated union option without static discriminator values`);
		for (let e of l) {
			if (s.has(e)) throw new L$2(`duplicate discriminator value ${String(e)}`);
			s.add(e);
		}
		let u = Array.from(l, (e) => ml(t, i, e));
		let d = o ? `if` : `else if`;
		e.write(`${d} (${u.join(` || `)}) {`), e.indented((e) => {
			let n = U$2(e, t, c, r);
			e.write(`${a} = ${n};`);
		}), e.write(`}`), o = !1;
	}
	return e.write(`else { return INVALID; }`), a;
}
function ml(e, t, n) {
	if (typeof n == `string`) return `${t} === ${ue$1(n)}`;
	if (typeof n == `number`) return Number.isNaN(n) ? `Number.isNaN(${t})` : `${t} === ${n}`;
	if (typeof n == `boolean`) return `${t} === ${n}`;
	if (n === null) return `${t} === null`;
	if (n === void 0) return `${t} === undefined`;
	if (typeof n == `bigint`) return `${t} === ${n}n`;
	if (typeof n == `symbol`) return `${t} === ${R$3(e, n)}`;
	throw new L$2(`literal discriminator value ${String(n)}`);
}
function hl(e, t, n, r) {
	let i = n._zod.def;
	t.definite = !1;
	let a = V$3(e, t, i.left, r);
	let o = V$3(e, t, i.right, r);
	let s = R$3(t, Fi);
	let c = B$2(t);
	return e.write(`const ${c} = ${s}(${a}, ${o});`), e.write(`if (!${c}.valid) return INVALID;`), `${c}.data`;
}
function gl(e, t, n, r) {
	let i = n._zod.def;
	let a = R$3(t, w$2);
	e.write(`if (!${a}(${r})) return INVALID;`);
	let o = B$2(t);
	let s = B$2(t);
	let c = B$2(t);
	e.write(`const ${o} = {};`);
	let l = i;
	let d = l.partial ? void 0 : i.keyType._zod.values;
	if (d) {
		let n = [];
		for (let a of d) {
			if (typeof a != `string` && typeof a != `number` && typeof a != `symbol`) throw new L$2(`record key value ${String(a)}`);
			let s = typeof a == `number` ? a.toString() : a;
			if (s === `__proto__`) throw new L$2(`record key "__proto__"`);
			n.push(s);
			let c = R$3(t, a);
			let l = U$2(e, t, i.keyType, c);
			let u = B$2(t);
			e.write(`const ${u} = ${r}[${vl(t, s)}];`);
			let d = V$3(e, t, i.valueType, u);
			e.write(`${o}[${l}] = ${d};`);
		}
		let a = R$3(t, new Set(n));
		return e.write(`for (const ${s} in ${r}) {`), e.indented((e) => {
			e.write(`if (${a}.has(${s})) continue;`), l.mode === `loose` ? e.write(`if (${s} !== "__proto__") ${o}[${s}] = ${r}[${s}];`) : e.write(`return INVALID;`);
		}), e.write(`}`), o;
	}
	let f = i.keyType._zod.def;
	if (f.type !== `string` || f.format !== void 0 || f.coerce || (f.checks?.length ?? 0) !== 0) {
		let n = i.mode === `loose`;
		let a = vc$1(i.keyType);
		a.definite === !1 && (t.definite = !1);
		let c = R$3(t, a);
		let l = R$3(t, an);
		let u = B$2(t);
		return _l(e, t, r, s, (e) => {
			e.write(`let ${u} = ${c}(${s});`), e.write(`if (${u} === INVALID && typeof ${s} === "string" && ${l}.test(${s})) ${u} = ${c}(Number(${s}));`), n ? e.write(`if (${u} === INVALID) { ${o}[${s}] = ${r}[${s}]; continue; }`) : e.write(`if (${u} === INVALID) return INVALID;`), e.write(`if (${u} === "__proto__") continue;`);
			let a = B$2(t);
			e.write(`const ${a} = ${r}[${s}];`);
			let d = V$3(e, t, i.valueType, a);
			e.write(`${o}[${u}] = ${d};`);
		}), o;
	}
	return _l(e, t, r, s, (e) => {
		e.write(`const ${c} = ${r}[${s}];`);
		let n = V$3(e, t, i.valueType, c);
		e.write(`${o}[${s}] = ${n};`);
	}, `return INVALID;`), o;
}
function _l(e, t, n, r, i, a) {
	let o = R$3(t, Object.prototype.propertyIsEnumerable);
	let s = B$2(t);
	let c = B$2(t);
	let l = B$2(t);
	e.write(`const ${s} = Object.getOwnPropertySymbols(${n});`), e.write(`const ${c} = Object.getOwnPropertyNames(${n});`), e.write(`for (let ${l} = 0; ${l} < ${c}.length; ${l}++) {`), e.indented((e) => {
		e.write(`const ${r} = ${c}[${l}];`), e.write(`if (${r} === "__proto__" || !${o}.call(${n}, ${r})) continue;`), i(e);
	}), e.write(`}`), e.write(`for (let ${l} = 0; ${l} < ${s}.length; ${l}++) {`), e.indented((e) => {
		e.write(`const ${r} = ${s}[${l}];`), e.write(`if (!${o}.call(${n}, ${r})) continue;`), a ? e.write(a) : i(e);
	}), e.write(`}`);
}
function vl(e, t) {
	return typeof t == `string` ? ue$1(t) : R$3(e, t);
}
function yl(e, t, n, r) {
	let i = n._zod.def;
	e.write(`if (!(${r} instanceof Map)) return INVALID;`), rl(e, n, `${r}.size`);
	let a = B$2(t);
	let o = B$2(t);
	let s = B$2(t);
	return e.write(`const ${a} = new Map();`), e.write(`for (const [${o}, ${s}] of ${r}) {`), e.indented((e) => {
		let n = U$2(e, t, i.keyType, o);
		let r = U$2(e, t, i.valueType, s);
		e.write(`${a}.set(${n}, ${r});`);
	}), e.write(`}`), a;
}
function bl(e, t, n, r) {
	let i = n._zod.def;
	e.write(`if (!(${r} instanceof Set)) return INVALID;`), rl(e, n, `${r}.size`);
	let a = B$2(t);
	let o = B$2(t);
	return e.write(`const ${a} = new Set();`), e.write(`for (const ${o} of ${r}) {`), e.indented((e) => {
		let n = U$2(e, t, i.valueType, o);
		e.write(`${a}.add(${n});`);
	}), e.write(`}`), a;
}
function xl(e, t) {
	return e.write(`if (!(${t} instanceof File)) return INVALID;`), t;
}
function Sl(e, t, n, r) {
	e.write(`if (typeof ${r} !== "string") return INVALID;`);
	let i = n._zod.pattern;
	if (i) {
		let n = R$3(t, i);
		e.write(`${n}.lastIndex = 0;`), e.write(`if (!${n}.test(${r})) return INVALID;`);
	}
	return r;
}
function Cl(e, t, n, r) {
	let i = n._zod.def;
	let a = z$3(t, i.getter);
	let o = R$3(t, { parser: null });
	e.write(`if (!${o}.parser) {`), e.indented((e) => {
		e.write(`const inner = ${a}();`), e.write(`${o}.parser = function(input) {`), e.indented((e) => {
			e.write(`const result = inner._zod.run({ value: input, issues: [] }, {});`), e.write(`return result.issues.length === 0 ? result.value : INVALID;`);
		}), e.write(`};`);
	}), e.write(`}`);
	let s = B$2(t);
	return e.write(`const ${s} = ${o}.parser(${r});`), e.write(`if (${s} === INVALID) return INVALID;`), s;
}
function wl(e, t, n, r) {
	let i = n._zod.def;
	let a = U$2(e, t, i.in, r);
	if (i.transform) {
		if (G$2(i.transform)) throw new I$2(`z.compile: async transforms in pipes are not supported`);
		let n = i.transform;
		let r = z$3(t, (e) => {
			let t = {
				value: e,
				issues: [],
				addIssue: Fc$1
			};
			let r = n(e, t);
			return r instanceof Promise ? F$2 : t.issues.length === 0 ? r : F$2;
		});
		let o = B$2(t);
		return e.write(`const ${o} = ${r}(${a});`), e.write(`if (${o} === INVALID) return INVALID;`), U$2(e, t, i.out, o);
	}
	return U$2(e, t, i.out, a);
}
function G$2(e) {
	return typeof e == `function` && (e.constructor.name === `AsyncFunction` || e[Symbol.toStringTag] === `AsyncFunction`);
}
function Tl(e, t, n, r) {
	let i = n._zod.def;
	if (i.fn) {
		if (G$2(i.fn)) throw new I$2(`z.compile: async custom predicates are not supported`);
		let n = z$3(t, i.fn);
		let a = R$3(t, Pc$1);
		let o = B$2(t);
		e.write(`const ${o} = ${n}(${r});`), e.write(`if (${o} instanceof Promise) ${a}();`), e.write(`if (!${o}) return INVALID;`);
	} else throw new L$2(`custom schema without a predicate function`);
	return r;
}
function El(e, t, n) {
	let r = e._zod.run({
		value: n,
		issues: []
	}, {});
	if (r && typeof r.then == `function`) return F$2;
	let i = r;
	return i.issues.length === 0 ? i.value : t();
}
function Dl(e, t, n, r) {
	let i = n._zod.def;
	if (!i.catchValue[`~constantCatch`]) throw new L$2(`catch with a callback (only a constant catch value compiles)`, !1);
	let a = B$2(t);
	e.write(`let ${a} = (() => {`), e.indented((e) => {
		let n = V$3(e, t, i.innerType, r);
		e.write(`return ${n};`);
	}), e.write(`})();`);
	let o = R$3(t, i.innerType);
	let s = z$3(t, i.catchValue);
	let c = R$3(t, El);
	return e.write(`if (${a} === INVALID) {`), e.indented((e) => {
		e.write(`${a} = ${c}(${o}, ${s}, ${r});`), e.write(`if (${a} === INVALID) return INVALID;`);
	}), e.write(`}`), a;
}
function Ol(e, t, n, r) {
	let i = n._zod.def;
	if (i.transform) {
		if (G$2(i.transform)) throw new I$2(`z.compile: async transforms are not supported`);
		let n = i.transform;
		let a = z$3(t, (e) => {
			let t = {
				value: e,
				issues: [],
				addIssue: Fc$1
			};
			let r = n(e, t);
			return r instanceof Promise ? F$2 : t.issues.length === 0 ? r : F$2;
		});
		let o = B$2(t);
		return e.write(`const ${o} = ${a}(${r});`), e.write(`if (${o} === INVALID) return INVALID;`), o;
	}
	return r;
}
function kl(e) {
	return e.checks &&= [...e.checks], e;
}
function Al(e, t) {
	return new e(kl({
		type: `string`,
		...A$3(t)
	}));
}
function jl(e, t) {
	return new e(kl({
		type: `string`,
		coerce: !0,
		...A$3(t)
	}));
}
function Ml(e, t) {
	return new e({
		type: `string`,
		format: `email`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Nl(e, t) {
	return new e({
		type: `string`,
		format: `guid`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Pl(e, t) {
	return new e({
		type: `string`,
		format: `uuid`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Fl(e, t) {
	return new e({
		type: `string`,
		format: `uuid`,
		check: `string_format`,
		abort: !1,
		version: `v4`,
		...A$3(t)
	});
}
function Il(e, t) {
	return new e({
		type: `string`,
		format: `uuid`,
		check: `string_format`,
		abort: !1,
		version: `v6`,
		...A$3(t)
	});
}
function Ll(e, t) {
	return new e({
		type: `string`,
		format: `uuid`,
		check: `string_format`,
		abort: !1,
		version: `v7`,
		...A$3(t)
	});
}
function Rl(e, t) {
	return new e({
		type: `string`,
		format: `url`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function zl(e, t) {
	return new e({
		type: `string`,
		format: `emoji`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Bl(e, t) {
	return new e({
		type: `string`,
		format: `nanoid`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Vl(e, t) {
	return new e({
		type: `string`,
		format: `cuid`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Hl(e, t) {
	return new e({
		type: `string`,
		format: `cuid2`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Ul(e, t) {
	return new e({
		type: `string`,
		format: `ulid`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Wl(e, t) {
	return new e({
		type: `string`,
		format: `xid`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Gl(e, t) {
	return new e({
		type: `string`,
		format: `ksuid`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Kl(e, t) {
	return new e({
		type: `string`,
		format: `ipv4`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function ql(e, t) {
	return new e({
		type: `string`,
		format: `ipv6`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Jl(e, t) {
	return new e({
		type: `string`,
		format: `mac`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Yl(e, t) {
	return new e({
		type: `string`,
		format: `cidrv4`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Xl(e, t) {
	return new e({
		type: `string`,
		format: `cidrv6`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Zl(e, t) {
	return new e({
		type: `string`,
		format: `base64`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function Ql(e, t) {
	return new e({
		type: `string`,
		format: `base64url`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function $l(e, t) {
	return new e({
		type: `string`,
		format: `e164`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function eu(e, t) {
	return new e({
		type: `string`,
		format: `credit_card`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function tu(e, t) {
	return new e({
		type: `string`,
		format: `iban`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function nu(e, t) {
	return new e({
		type: `string`,
		format: `jwt`,
		check: `string_format`,
		abort: !1,
		...A$3(t)
	});
}
function iu(e, t) {
	return new e({
		type: `string`,
		format: `datetime`,
		check: `string_format`,
		offset: !1,
		local: !1,
		precision: null,
		...A$3(t)
	});
}
function au(e, t) {
	return new e({
		type: `string`,
		format: `date`,
		check: `string_format`,
		...A$3(t)
	});
}
function ou(e, t) {
	return new e({
		type: `string`,
		format: `time`,
		check: `string_format`,
		precision: null,
		...A$3(t)
	});
}
function su(e, t) {
	return new e({
		type: `string`,
		format: `duration`,
		check: `string_format`,
		...A$3(t)
	});
}
function cu(e, t) {
	return new e(kl({
		type: `number`,
		checks: [],
		...A$3(t)
	}));
}
function lu(e, t) {
	return new e(kl({
		type: `number`,
		coerce: !0,
		checks: [],
		...A$3(t)
	}));
}
function uu(e, t) {
	return new e({
		type: `number`,
		check: `number_format`,
		abort: !1,
		format: `safeint`,
		...A$3(t)
	});
}
function du(e, t) {
	return new e({
		type: `number`,
		check: `number_format`,
		abort: !1,
		format: `float32`,
		...A$3(t)
	});
}
function fu(e, t) {
	return new e({
		type: `number`,
		check: `number_format`,
		abort: !1,
		format: `float64`,
		...A$3(t)
	});
}
function pu(e, t) {
	return new e({
		type: `number`,
		check: `number_format`,
		abort: !1,
		format: `int32`,
		...A$3(t)
	});
}
function mu(e, t) {
	return new e({
		type: `number`,
		check: `number_format`,
		abort: !1,
		format: `uint32`,
		...A$3(t)
	});
}
function hu(e, t) {
	return new e({
		type: `boolean`,
		...A$3(t)
	});
}
function gu(e, t) {
	return new e({
		type: `boolean`,
		coerce: !0,
		...A$3(t)
	});
}
function _u(e, t) {
	return new e({
		type: `bigint`,
		...A$3(t)
	});
}
function vu(e, t) {
	return new e({
		type: `bigint`,
		coerce: !0,
		...A$3(t)
	});
}
function yu(e, t) {
	return new e({
		type: `bigint`,
		check: `bigint_format`,
		abort: !1,
		format: `int64`,
		...A$3(t)
	});
}
function bu(e, t) {
	return new e({
		type: `bigint`,
		check: `bigint_format`,
		abort: !1,
		format: `uint64`,
		...A$3(t)
	});
}
function xu(e, t) {
	return new e({
		type: `symbol`,
		...A$3(t)
	});
}
function Su(e, t) {
	return new e({
		type: `undefined`,
		...A$3(t)
	});
}
function Cu(e, t) {
	return new e({
		type: `null`,
		...A$3(t)
	});
}
function wu(e) {
	return new e({ type: `any` });
}
function Tu(e) {
	return new e({ type: `unknown` });
}
function Eu(e, t) {
	return new e({
		type: `never`,
		...A$3(t)
	});
}
function Du(e, t) {
	return new e({
		type: `void`,
		...A$3(t)
	});
}
function Ou(e, t) {
	return new e({
		type: `date`,
		...A$3(t)
	});
}
function ku(e, t) {
	return new e({
		type: `date`,
		coerce: !0,
		...A$3(t)
	});
}
function Au(e, t) {
	return new e({
		type: `nan`,
		...A$3(t)
	});
}
function ju(e, t) {
	return new Mn({
		check: `less_than`,
		...A$3(t),
		value: e,
		inclusive: !1
	});
}
function Mu(e, t) {
	return new Mn({
		check: `less_than`,
		...A$3(t),
		value: e,
		inclusive: !0
	});
}
function Nu(e, t) {
	return new Nn({
		check: `greater_than`,
		...A$3(t),
		value: e,
		inclusive: !1
	});
}
function Pu(e, t) {
	return new Nn({
		check: `greater_than`,
		...A$3(t),
		value: e,
		inclusive: !0
	});
}
function Fu(e) {
	return Nu(0, e);
}
function Iu(e) {
	return ju(0, e);
}
function Lu(e) {
	return Mu(0, e);
}
function Ru(e) {
	return Pu(0, e);
}
function zu(e, t) {
	return new Pn({
		check: `multiple_of`,
		...A$3(t),
		value: e
	});
}
function Bu(e, t) {
	return new Ln({
		check: `max_size`,
		...A$3(t),
		maximum: e
	});
}
function Vu(e, t) {
	return new Rn({
		check: `min_size`,
		...A$3(t),
		minimum: e
	});
}
function Hu(e, t) {
	return new zn({
		check: `size_equals`,
		...A$3(t),
		size: e
	});
}
function Uu(e, t) {
	return new Bn({
		check: `max_length`,
		...A$3(t),
		maximum: e
	});
}
function Wu(e, t) {
	return new Vn({
		check: `min_length`,
		...A$3(t),
		minimum: e
	});
}
function Gu(e, t) {
	return new Hn({
		check: `length_equals`,
		...A$3(t),
		length: e
	});
}
function Ku(e, t) {
	return new Wn({
		check: `string_format`,
		format: `regex`,
		...A$3(t),
		pattern: e
	});
}
function qu(e) {
	return new Gn({
		check: `string_format`,
		format: `lowercase`,
		...A$3(e)
	});
}
function Ju(e) {
	return new Kn({
		check: `string_format`,
		format: `uppercase`,
		...A$3(e)
	});
}
function Yu(e, t) {
	return new qn({
		check: `string_format`,
		format: `includes`,
		...A$3(t),
		includes: e
	});
}
function Xu(e, t) {
	return new Jn({
		check: `string_format`,
		format: `starts_with`,
		...A$3(t),
		prefix: e
	});
}
function Zu(e, t) {
	return new Yn({
		check: `string_format`,
		format: `ends_with`,
		...A$3(t),
		suffix: e
	});
}
function Qu(e, t, n) {
	return new Zn({
		check: `property`,
		property: e,
		schema: t,
		...A$3(n)
	});
}
function $u(e, t) {
	return new Qn({
		check: `properties`,
		shape: e,
		...A$3(t)
	});
}
function ed(e, t) {
	return new $n({
		check: `mime_type`,
		mime: e,
		...A$3(t)
	});
}
function K$2(e) {
	return new er({
		check: `overwrite`,
		tx: e
	});
}
function td(e) {
	return K$2((t) => t.normalize(e));
}
function nd() {
	return K$2((e) => e.trim());
}
function rd() {
	return K$2((e) => e.toLowerCase());
}
function id() {
	return K$2((e) => e.toUpperCase());
}
function ad() {
	return K$2((e) => de$1(e));
}
function od(e, t, n) {
	return new e({
		type: `array`,
		element: t,
		...A$3(n)
	});
}
function sd(e, t, n) {
	return new e({
		type: `union`,
		options: t,
		...A$3(n)
	});
}
function cd(e, t, n) {
	return new e({
		type: `union`,
		options: t,
		inclusive: !1,
		...A$3(n)
	});
}
function ld(e, t, n, r) {
	return new e({
		type: `union`,
		options: n,
		discriminator: t,
		...A$3(r)
	});
}
function ud(e, t, n) {
	return new e({
		type: `intersection`,
		left: t,
		right: n
	});
}
function dd(e, t, n, r) {
	let i = n instanceof M$2;
	return new e({
		type: `tuple`,
		items: t,
		rest: i ? n : null,
		...A$3(i ? r : n)
	});
}
function fd(e, t, n, r) {
	return new e({
		type: `record`,
		keyType: t,
		valueType: n,
		...A$3(r)
	});
}
function pd(e, t, n, r) {
	return new e({
		type: `map`,
		keyType: t,
		valueType: n,
		...A$3(r)
	});
}
function md(e, t, n) {
	return new e({
		type: `set`,
		valueType: t,
		...A$3(n)
	});
}
function hd(e, t, n) {
	return new e({
		type: `enum`,
		entries: Array.isArray(t) ? Object.fromEntries(t.map((e) => [e, e])) : t,
		...A$3(n)
	});
}
function gd(e, t, n) {
	return new e({
		type: `enum`,
		entries: t,
		...A$3(n)
	});
}
function _d(e, t, n) {
	return new e({
		type: `literal`,
		values: Array.isArray(t) ? t : [t],
		...A$3(n)
	});
}
function vd(e, t) {
	return new e({
		type: `file`,
		...A$3(t)
	});
}
function yd(e, t) {
	return new e({
		type: `transform`,
		transform: t
	});
}
function bd(e, t) {
	return new e({
		type: `optional`,
		innerType: t
	});
}
function xd(e, t) {
	return new e({
		type: `nullable`,
		innerType: t
	});
}
function Sd(e, t, n) {
	return new e({
		type: `default`,
		innerType: t,
		get defaultValue() {
			return typeof n == `function` ? n() : T$2(n);
		}
	});
}
function Cd(e, t, n) {
	return new e({
		type: `nonoptional`,
		innerType: t,
		...A$3(n)
	});
}
function wd(e, t) {
	return new e({
		type: `success`,
		innerType: t
	});
}
function Td(e, t, n) {
	return new e({
		type: `catch`,
		innerType: t,
		catchValue: typeof n == `function` ? n : Be$2(n)
	});
}
function Ed(e, t, n) {
	return new e({
		type: `pipe`,
		in: t,
		out: n
	});
}
function Dd(e, t) {
	return new e({
		type: `readonly`,
		innerType: t
	});
}
function Od(e, t, n) {
	return new e({
		type: `template_literal`,
		parts: t,
		...A$3(n)
	});
}
function kd(e, t) {
	return new e({
		type: `lazy`,
		getter: t
	});
}
function Ad(e, t) {
	return new e({
		type: `promise`,
		innerType: t
	});
}
function jd(e, t, n) {
	let r = A$3(n);
	return r.abort ??= !0, new e({
		type: `custom`,
		check: `custom`,
		fn: t,
		...r
	});
}
function Md(e, t, n) {
	return new e({
		type: `custom`,
		check: `custom`,
		fn: t,
		...A$3(n)
	});
}
function Nd(e, t) {
	let n = Pd((t) => (t.addIssue = (e) => {
		if (typeof e == `string`) t.issues.push(Ce$2(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= `custom`, `input` in r || (r.input = t.value), r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(Ce$2(r));
		}
	}, e(t.value, t)), t);
	return n;
}
function Pd(e, t) {
	let n = new j$2({
		check: `custom`,
		...A$3(t)
	});
	return n._zod.check = e, n;
}
function Fd(e) {
	let t = new j$2({ check: `describe` });
	return t._zod.onattach = [(t) => {
		let n = P$2.get(t) ?? {};
		P$2.add(t, {
			...n,
			description: e
		});
	}], t._zod.check = () => {}, t;
}
function Id(e) {
	let t = new j$2({ check: `meta` });
	return t._zod.onattach = [(t) => {
		let n = P$2.get(t) ?? {};
		P$2.add(t, {
			...n,
			...e
		});
	}], t._zod.check = () => {}, t;
}
function Ld(e, t) {
	let n = A$3(t);
	let r = n.truthy ?? [
		`true`,
		`1`,
		`yes`,
		`on`,
		`y`,
		`enabled`
	];
	let i = n.falsy ?? [
		`false`,
		`0`,
		`no`,
		`off`,
		`n`,
		`disabled`
	];
	n.case !== `sensitive` && (r = r.map((e) => typeof e == `string` ? e.toLowerCase() : e), i = i.map((e) => typeof e == `string` ? e.toLowerCase() : e));
	let a = new Set(r);
	let o = new Set(i);
	let s = e.Codec ?? da$1;
	let c = e.Boolean ?? ii;
	let l = new s({
		type: `pipe`,
		in: new (e.String ?? or)({
			type: `string`,
			error: n.error
		}),
		out: new c({
			type: `boolean`,
			error: n.error
		}),
		transform: ((e, t) => {
			let r = e;
			return n.case !== `sensitive` && (r = r.toLowerCase()), a.has(r) ? !0 : !o.has(r) && (t.issues.push({
				code: `invalid_value`,
				expected: `stringbool`,
				values: [...a, ...o],
				input: t.value,
				inst: l,
				continue: !1
			}), {});
		}),
		reverseTransform: ((e, t) => e === !0 ? r[0] || `true` : i[0] || `false`),
		error: n.error
	});
	return l._zod.bag.truthy = r, l._zod.bag.falsy = i, l._zod.bag.case = n.case ?? `insensitive`, l;
}
function Rd(e, t, n, r = {}) {
	let i = A$3(r);
	let a = {
		check: `string_format`,
		type: `string`,
		format: t,
		fn: typeof n == `function` ? n : (e) => n.test(e),
		...i
	};
	return n instanceof RegExp && (a.pattern = n), new e(a);
}
function zd(e, ...t) {
	for (let n of t) for (let t of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, t) && g$1(e, t, n[t]);
	return e;
}
function q$2(e) {
	let t = e?.target ?? `draft-2020-12`;
	return t === `draft-4` && (t = `draft-04`), t === `draft-7` && (t = `draft-07`), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? P$2,
		target: t,
		unrepresentable: e?.unrepresentable ?? `throw`,
		override: e?.override ?? (() => {}),
		io: e?.io ?? `output`,
		counter: 0,
		seen: new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: e?.cycles ?? `ref`,
		reused: e?.reused ?? `inline`,
		intersections: [],
		deferred: [],
		external: e?.external ?? void 0
	};
}
function J$2(e, t, n, r, i) {
	let a = typeof t.unrepresentable == `function` ? t.unrepresentable({
		zodSchema: e,
		path: r.path,
		message: i
	}) : t.unrepresentable;
	if (a === `any`) return !1;
	if (a === void 0 || a === `throw`) throw Error(i);
	return Object.assign(n, a), !0;
}
function Y$2(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def;
	let a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema;
			let a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, Y$2(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && zd(o.schema, c), t.io === `input` && Q$2(e) && (delete o.schema.examples, delete o.schema.default), t.io === `input` && `_prefault` in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Bd(e) {
	return e.replace(/~/g, `~0`).replace(/\//g, `~1`);
}
function X$3(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error(`Unprocessed schema. This is a bug in Zod.`);
	if (e.external && e.sharedDefsExtractedFor === e.external) return;
	let r = new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === `draft-2020-12` ? `$defs` : `definitions`;
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id;
			let i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i(`__shared`)}#/${r}/${Bd(a)}`
			};
		}
		let i = `#/${r}/`;
		if (t[1] === n && !t[1].schema.id) return { ref: `#` };
		let a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + Bd(a)
		};
	};
	let a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1];
		let { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === `throw`) for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) a(n);
		else {
			if (e.external) {
				let r = e.external.registry.get(n[0])?.id;
				if (t !== n[0] && r) {
					a(n);
					continue;
				}
			}
			(e.metadataRegistry.get(n[0])?.id || r.cycle || r.count > 1 && e.reused === `ref`) && a(n);
		}
	}
	e.external && (e.sharedDefsExtractedFor = e.external);
}
function Vd(e) {
	let t = e.anyOf;
	if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
	let n = [];
	for (let e of t) {
		if (!e || typeof e != `object`) return;
		Vd(e);
		let t = Object.keys(e);
		if (t.length !== 1 || t[0] !== `type`) return;
		let r = e.type;
		for (let e of Array.isArray(r) ? r : [r]) {
			if (typeof e != `string`) return;
			n.includes(e) || n.push(e);
		}
	}
	delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
function Wd(e) {
	let t = e.additionalProperties;
	return t === void 0 || t === !1 || typeof t != `object` || !t ? null : Object.keys(t).length ? t : null;
}
function Gd(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != `object` || n.type !== `object`) return null;
		for (let e in n) if (!Hd.has(e)) return null;
		t.push(n);
	}
	let n = {};
	let r = new Set();
	for (let e of t) {
		for (let r in e.properties) {
			if (Object.prototype.hasOwnProperty.call(n, r)) continue;
			let e = [];
			for (let n of t) {
				let t = n.properties?.[r] ?? Wd(n);
				t != null && (e.some((e) => JSON.stringify(e) === JSON.stringify(t)) || e.push(t));
			}
			g$1(n, r, e.length === 1 ? e[0] : Gd(e) ?? { allOf: e });
		}
		for (let t of e.required ?? []) r.add(t);
	}
	let i = {
		type: `object`,
		properties: n
	};
	if (r.size && (i.required = [...r]), t.every((e) => e.additionalProperties === !1)) i.additionalProperties = !1;
	else {
		let e = [];
		for (let n of t) {
			let t = Wd(n);
			t && !e.some((e) => JSON.stringify(e) === JSON.stringify(t)) && e.push(t);
		}
		e.length === 1 ? i.additionalProperties = e[0] : e.length > 1 && (i.additionalProperties = { allOf: e });
	}
	return i;
}
function Kd(e) {
	let t = e.allOf;
	if (!Array.isArray(t) || t.length < 2) return;
	for (let t of Hd) if (t in e) return;
	let n = t.filter((e) => Ud.some((t) => Array.isArray(e[t])));
	let r = null;
	if (!n.length) r = Gd(t);
	else {
		let e = n[0];
		let i = Ud.find((t) => Array.isArray(e[t]));
		if (Object.keys(e).length !== 1) return;
		let a = t.filter((t) => t !== e);
		let o = e[i].map((e) => Gd([...a, e]));
		if (o.some((e) => !e)) return;
		r = { [i]: o };
	}
	r && (delete e.allOf, zd(e, r));
}
function Z$2(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error(`Unprocessed schema. This is a bug in Zod.`);
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema;
		let a = { ...i };
		let o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o);
			let s = n.schema;
			if (s.$ref && (e.target === `draft-07` || e.target === `draft-04` || e.target === `openapi-3.0`) ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : zd(i, s), zd(i, a), t._zod.parent === o) for (let e in i) e !== `$ref` && e !== `allOf` && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== `$ref` && e !== `allOf` && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== `$ref` && e !== `allOf` && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	if (!e.external || e.sharedEmitDoneFor !== e.external) {
		for (let t of [...e.seen.entries()].reverse()) r(t[0]);
		if (e.target !== `openapi-3.0`) for (let t of e.seen.entries()) Vd(t[1].def ?? t[1].schema);
		for (let t of e.deferred) t();
		if (e.intersections.length) {
			let t = new Map();
			for (let n of e.seen.values()) for (let e of [n.schema, n.def]) {
				let n = e?.allOf;
				if (!Array.isArray(n)) continue;
				let r = t.get(n);
				r ? r.push(e) : t.set(n, [e]);
			}
			for (let n of e.intersections) for (let e of t.get(n) ?? []) Kd(e);
		}
	}
	let i = {};
	if (e.target === `draft-2020-12` ? i.$schema = `https://json-schema.org/draft/2020-12/schema` : e.target === `draft-07` ? i.$schema = `http://json-schema.org/draft-07/schema#` : e.target === `draft-04` ? i.$schema = `http://json-schema.org/draft-04/schema#` : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	zd(i, n.defId ? n.schema : n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	if (!e.external || e.sharedEmitDoneFor !== e.external) for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, g$1(o, e.defId, e.def));
	}
	e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(o).length > 0 && (e.target === `draft-2020-12` ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t[`~standard`],
				jsonSchema: {
					input: Jd(t, `input`, e.processors),
					output: Jd(t, `output`, e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error(`Error converting schema to JSON.`);
	}
}
function Q$2(e, t) {
	let n = t ?? { seen: new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === `transform`) return !0;
	if (r.type === `array`) return Q$2(r.element, n);
	if (r.type === `set`) return Q$2(r.valueType, n);
	if (r.type === `lazy`) return Q$2(r.getter(), n);
	if (r.type === `promise` || r.type === `optional` || r.type === `nonoptional` || r.type === `nullable` || r.type === `readonly` || r.type === "default" || r.type === `prefault` || r.type === `catch`) return Q$2(r.innerType, n);
	if (r.type === `intersection`) return Q$2(r.left, n) || Q$2(r.right, n);
	if (r.type === `record` || r.type === `map`) return Q$2(r.keyType, n) || Q$2(r.valueType, n);
	if (r.type === `pipe`) return e._zod.traits.has(`$ZodCodec`) ? !0 : Q$2(r.in, n) || Q$2(r.out, n);
	if (r.type === `object`) {
		for (let e in r.shape) if (Q$2(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === `union`) {
		for (let e of r.options) if (Q$2(e, n)) return !0;
		return !1;
	}
	if (r.type === `tuple`) {
		for (let e of r.items) if (Q$2(e, n)) return !0;
		return !!(r.rest && Q$2(r.rest, n));
	}
	return !1;
}
function $$2(e) {
	let t = {};
	let n = e._zod.def;
	let r = e._zod.traits.has(`$ZodCheck`) ? [e, ...n.checks ?? []] : n.checks ?? [];
	for (let e of r) of[e._zod.def.check]?.(t, e._zod.def);
	let i = e._zod.bag;
	i.minimum !== void 0 && Yd(t, `minimum`, i.minimum), i.exclusiveMinimum !== void 0 && Yd(t, `exclusiveMinimum`, i.exclusiveMinimum), i.maximum !== void 0 && Xd(t, `maximum`, i.maximum), i.exclusiveMaximum !== void 0 && Xd(t, `exclusiveMaximum`, i.exclusiveMaximum), i.multipleOf !== void 0 && Qd(t, i.multipleOf), i.format !== void 0 && (t.format ??= i.format, i.format.includes(`int`) && (t.isInt = !0)), i.mime && ef(t, i.mime);
	for (let e of i.patterns ?? []) $d(t, e);
	return t;
}
function Pf(e) {
	let t = e._zod.def;
	return t.type === `pipe` && t.in._zod.traits.has(`$ZodTransform`) ? Pf(t.out) : t.type === `catch` ? Pf(t.innerType) : e._zod.optin;
}
function zf(e, t, n) {
	if (t.$ref) {
		if (n.has(t)) return t;
		n.add(t);
		let r = e.get(t)?.def;
		if (!r) return t;
		let i = zf(e, r, n);
		return i === r ? t : i;
	}
	for (let r of [`anyOf`, `oneOf`]) {
		let i = t[r];
		if (!Array.isArray(i)) continue;
		let a = i.map((t) => zf(e, t, n));
		a.some((e, t) => e !== i[t]) && (t = {
			...t,
			[r]: a
		});
	}
	let r = Array.isArray(t.type) ? t.type : [t.type];
	let i = !r.includes(`string`) && r.some((e) => e === `number` || e === `integer`);
	let a = t.enum ?? (t.const === void 0 ? void 0 : [t.const]);
	if (!i && !a?.some((e) => typeof e == `number`)) return t;
	let { minimum: o, maximum: s, exclusiveMinimum: c, exclusiveMaximum: l, multipleOf: u, format: d, id: f, ...p } = t;
	return p.enum ? p.enum = p.enum.map((e) => typeof e == `number` ? String(e) : e) : typeof p.const == `number` && (p.const = String(p.const)), i && (p.type = `string`, a || (p.pattern = (r.includes(`number`) ? an : rn).source)), p;
}
function Vf(e) {
	let t = new Map();
	for (let n of e.seen.values()) n.def && !t.has(n.schema) && t.set(n.schema, n);
	let n = new Map();
	for (let r of Bf.get(e) ?? []) {
		let i = e.seen.get(r);
		let a = (i?.def ?? i?.schema)?.propertyNames;
		if (!a || a === !0 || n.has(a)) continue;
		let o = zf(t, a, new Set());
		o !== a && n.set(a, o);
	}
	if (n.size) for (let t of e.seen.values()) for (let e of [t.schema, t.def]) {
		let t = e && n.get(e.propertyNames);
		t && (e.propertyNames = t);
	}
}
function Kf(e, t, n, r, i) {
	let a = !1;
	let o = JSON.stringify(e, (e, t) => typeof t == `bigint` ? (a = !0, null) : t);
	return a ? (J$2(t, n, r, i, `BigInt defaults cannot be represented in JSON Schema`), Gf) : JSON.parse(o);
}
function np(e, t) {
	if (`_idmap` in e) {
		let n = e;
		let r = q$2({
			...t,
			processors: tp
		});
		let i = {};
		for (let e of n._idmap.entries()) {
			let [t, n] = e;
			Y$2(n, r);
		}
		let a = {};
		r.external = {
			registry: n,
			uri: t?.uri,
			defs: i
		};
		for (let e of n._idmap.entries()) {
			let [t, n] = e;
			X$3(r, n), g$1(a, t, Z$2(r, n));
		}
		return Object.keys(i).length > 0 && (a.__shared = { [r.target === `draft-2020-12` ? `$defs` : `definitions`]: i }), { schemas: a };
	}
	let n = q$2({
		...t,
		processors: tp
	});
	return Y$2(e, n), X$3(n, e), Z$2(n, e);
}
var we$1, Te$1, Ee$1, De$1, Oe$1, A$2, Ie$1, Le$1, Re$1, ze$1, Be$1, Ve$1, Ue$1, We$1, Ge$1, Ke$1, qe$1, Ye$1, Xe$1, Ze$1, Qe$1, $e$1, et$1, tt$1, nt$1, rt$1, it$1, at$1, ot$1, st$1, ct$1, lt$1, ut$1, dt$1, ft$1, pt$1, mt$1, ht$1, gt$1, _t$1, vt$1, bt$1, xt$1, St$1, Ct$1, wt$1, Tt$1, Et$1, Dt$1, Ot$1, kt$1, At$1, jt$1, Mt$1, Pt$1, Ft$1, It$1, Lt$1, Rt$1, zt$1, Bt$1, Vt$1, Ht$1, Ut$1, Wt$1, Gt$1, Kt$1, qt$1, Jt$1, Xt$1, en, tn, nn, rn, an, on, sn, cn, ln, un, dn, mn, hn, gn, _n, vn, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn, On, j$2, kn, An, jn, Mn, Nn, Pn, Fn, In, Ln, Rn, zn, Bn, Vn, Hn, Un, Wn, Gn, Kn, qn, Jn, Yn, Zn, Qn, $n, er, tr, nr, M$2, rr, or, N$2, sr, cr, lr, hr, yr, br, xr, Sr, Cr, wr, Tr, Er, Dr, Or, kr, Ar, jr, Mr, Pr, Fr, Ir, Rr, Br, Vr, Hr, Wr, Gr, Kr, Yr, Qr, ei, ti, ni, ri, ii, ai, oi, si, ci, li, ui, di, fi, pi, mi, gi, _i, vi, bi, Si, Ti, Ei, Oi, Ai, Ni, Pi, Li, Vi, Hi, Wi, Ki$1, qi$1, Ji$1, Yi$1, Zi$1, Qi$1, $i$1, ea$1, na$1, ra$1, aa$1, sa$1, ca$1, la$1, da$1, ma$1, ha$1, ya$1, ba$1, xa$1, Sa$1, Ca$1, Ta$1, Ea$1, Da$1, Aa$1, Fa$1, Ia$1, La$1, Ba$1, Ha$1, Ga$1, qa$1, Ya$1, Za$1, $a$1, to$1, ro$1, ao$1, so$1, lo$1, fo$1, mo$1, go$1, vo$1, bo$1, So$1, wo$1, Eo$1, Oo$1, Ao$1, Po$1, Io$1, Ro$1, Bo$1, Ho$1, Wo$1, Ko$1, Yo$1, Zo$1, $o$1, ts$1, rs$1, as$1, ss$1, ls$1, ds$1, ps$1, hs$1, _s$1, ys$1, xs$1, Cs$1, Ts$1, Os$1, As$1, Ms$1, Ps$1, Is$1, Rs$1, Bs$1, Hs$1, Ws$1, Ks$1, Ys$1, Zs$1, $s$1, tc$1, rc$1, ac$1, sc$1, cc$1, lc$1, uc$1, dc$1, P$2, F$2, pc$1, I$2, L$2, xc$1, Lc, ru, Hd, Ud, qd, Jd, Yd, Xd, Zd, Qd, $d, ef, tf, nf, rf, af, of, sf, cf, lf, uf, df, ff, pf, mf, hf, gf, _f, vf, yf, bf, xf, Sf, Cf, wf, Tf, Ef, Df, Of, kf, Af, jf, Mf, Nf, Ff, If, Lf, Rf, Bf, Hf, Uf, Wf, Gf, qf, Jf, Yf, Xf, Zf, Qf, $f, ep, tp, rp, ip, ap;
var init_core_BJ5ituCR = __esmMin((() => {
	init_rolldown_runtime_CwAJHxZ7();
	init_en_CuIUlj_w();
	we$1 = {
		get: Se$1,
		set: Ce$1,
		enumerable: !0,
		configurable: !0
	};
	Te$1 = {
		value: void 0,
		enumerable: !1
	};
	Ee$1 = new WeakSet([Object.prototype, Error.prototype]);
	De$1 = (e, t) => {
		e.name = `$ZodError`, Te$1.value = t, Object.defineProperty(e, "issues", Te$1), Te$1.value = void 0, Object.defineProperty(e, "message", we$1);
		let n = Object.getPrototypeOf(e);
		Ee$1.has(n) || (Ee$1.add(n), Object.defineProperty(n, "toString", {
			configurable: !0,
			enumerable: !1,
			get() {
				let e = () => this.message;
				return Object.defineProperty(this, "toString", {
					value: e,
					configurable: !0,
					writable: !0
				}), e;
			},
			set(e) {
				Object.defineProperty(this, "toString", {
					value: e,
					configurable: !0,
					writable: !0
				});
			}
		}));
	};
	Oe$1 = Ge$2(`$ZodError`, De$1);
	A$2 = Ge$2(`$ZodError`, De$1, void 0, { Parent: Error });
	Ie$1 = (e) => {
		let t = (n, r, i, a) => {
			let o = i ? {
				...i,
				async: !1
			} : { async: !1 };
			let s = n._zod.run({
				value: r,
				issues: []
			}, o);
			if (s instanceof Promise) throw new qe$2();
			if (s.issues.length) {
				let n = new ((a?.Err) ?? e)(s.issues.map((e) => ve$1(e, o, Ye$2())));
				throw x$1(n, a?.callee ?? t), n;
			}
			return s.value;
		};
		return t;
	};
	Le$1 = Ie$1(A$2);
	Re$1 = (e) => {
		let t = async (n, r, i, a) => {
			let o = i ? {
				...i,
				async: !0
			} : { async: !0 };
			let s = n._zod.run({
				value: r,
				issues: []
			}, o);
			if (s instanceof Promise && (s = await s), s.issues.length) {
				let n = new ((a?.Err) ?? e)(s.issues.map((e) => ve$1(e, o, Ye$2())));
				throw x$1(n, a?.callee ?? t), n;
			}
			return s.value;
		};
		return t;
	};
	ze$1 = Re$1(A$2);
	Be$1 = (e) => (t, n, r) => {
		let i = r ? {
			...r,
			async: !1
		} : { async: !1 };
		let a = t._zod.run({
			value: n,
			issues: []
		}, i);
		if (a instanceof Promise) throw new qe$2();
		return a.issues.length ? He$1(e, a.issues, i) : {
			success: !0,
			data: a.value
		};
	};
	Ve$1 = Be$1(A$2);
	Ue$1 = (e) => async (t, n, r) => {
		let i = r ? {
			...r,
			async: !0
		} : { async: !0 };
		let a = t._zod.run({
			value: n,
			issues: []
		}, i);
		return a instanceof Promise && (a = await a), a.issues.length ? He$1(e, a.issues, i) : {
			success: !0,
			data: a.value
		};
	};
	We$1 = Ue$1(A$2);
	Ge$1 = Symbol.for(`zod.compile.invalid`);
	Ke$1 = Symbol.for(`zod.compile.fallback`);
	qe$1 = ((e, t, n) => {
		let r = e._zod.bag.validator;
		if (r !== void 0) {
			if (r(t) !== Ge$1) return !0;
			if (r.definite === !0 && n === void 0) return !1;
		}
		return Je$1(e, t, n);
	});
	Ye$1 = async (e, t, n) => {
		let r = n ? {
			...n,
			async: !0,
			abortEarly: !0
		} : {
			async: !0,
			abortEarly: !0
		};
		let i = e._zod.run({
			value: t,
			issues: []
		}, r);
		return i instanceof Promise && (i = await i), i.issues.length === 0;
	};
	Xe$1 = (e) => {
		let t = Ie$1(e);
		let n = (e, r, i, a) => {
			let o = i ? {
				...i,
				direction: `backward`
			} : { direction: `backward` };
			return t(e, r, o, Fe$1(n, a));
		};
		return n;
	};
	Ze$1 = Xe$1(A$2);
	Qe$1 = (e) => {
		let t = Ie$1(e);
		let n = (e, r, i, a) => t(e, r, i, Fe$1(n, a));
		return n;
	};
	$e$1 = Qe$1(A$2);
	et$1 = (e) => {
		let t = Re$1(e);
		let n = async (e, r, i, a) => {
			let o = i ? {
				...i,
				direction: `backward`
			} : { direction: `backward` };
			return await t(e, r, o, Fe$1(n, a));
		};
		return n;
	};
	tt$1 = et$1(A$2);
	nt$1 = (e) => {
		let t = Re$1(e);
		let n = async (e, r, i, a) => await t(e, r, i, Fe$1(n, a));
		return n;
	};
	rt$1 = nt$1(A$2);
	it$1 = (e) => (t, n, r) => {
		let i = r ? {
			...r,
			direction: `backward`
		} : { direction: `backward` };
		return Be$1(e)(t, n, i);
	};
	at$1 = it$1(A$2);
	ot$1 = (e) => (t, n, r) => Be$1(e)(t, n, r);
	st$1 = ot$1(A$2);
	ct$1 = (e) => async (t, n, r) => {
		let i = r ? {
			...r,
			direction: `backward`
		} : { direction: `backward` };
		return Ue$1(e)(t, n, i);
	};
	lt$1 = ct$1(A$2);
	ut$1 = (e) => async (t, n, r) => Ue$1(e)(t, n, r);
	dt$1 = ut$1(A$2);
	ft$1 = t$2({
		anyString: () => en,
		base64: () => zt$1,
		base64url: () => Bt$1,
		bigint: () => nn,
		boolean: () => on,
		browserEmail: () => Mt$1,
		cidrv4: () => Lt$1,
		cidrv6: () => Rt$1,
		creditCard: () => Gt$1,
		cuid: () => pt$1,
		cuid2: () => mt$1,
		currencyCode: () => Kt$1,
		date: () => Xt$1,
		datetime: () => $t$1,
		domain: () => Ht$1,
		duration: () => bt$1,
		e164: () => Wt$1,
		email: () => Dt$1,
		emoji: () => Nt$1,
		extendedDuration: () => xt$1,
		guid: () => St$1,
		hex: () => dn,
		hostname: () => Vt$1,
		html5Email: () => Ot$1,
		httpProtocol: () => Ut$1,
		iban: () => qt$1,
		idnEmail: () => jt$1,
		integer: () => rn,
		ipv4: () => Pt$1,
		ipv6: () => Ft$1,
		ksuid: () => _t$1,
		lowercase: () => ln,
		mac: () => It$1,
		md5_base64: () => hn,
		md5_base64url: () => gn,
		md5_hex: () => mn,
		nanoid: () => vt$1,
		nanoidOfLength: () => yt$1,
		null: () => sn,
		number: () => an,
		rfc5322Email: () => kt$1,
		sha1_base64: () => vn,
		sha1_base64url: () => yn,
		sha1_hex: () => _n,
		sha256_base64: () => xn,
		sha256_base64url: () => Sn,
		sha256_hex: () => bn,
		sha384_base64: () => wn,
		sha384_base64url: () => Tn,
		sha384_hex: () => Cn,
		sha512_base64: () => Dn,
		sha512_base64url: () => On,
		sha512_hex: () => En,
		string: () => tn,
		time: () => Qt$1,
		ulid: () => ht$1,
		undefined: () => cn,
		unicodeEmail: () => At$1,
		uppercase: () => un,
		uuid: () => Ct$1,
		uuid4: () => wt$1,
		uuid6: () => Tt$1,
		uuid7: () => Et$1,
		xid: () => gt$1
	});
	pt$1 = /^[cC][0-9a-z]{6,}$/;
	mt$1 = /^[0-9a-z]+$/;
	ht$1 = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
	gt$1 = /^[0-9a-vA-V]{20}$/;
	_t$1 = /^[A-Za-z0-9]{27}$/;
	vt$1 = /^[a-zA-Z0-9_-]{21}$/;
	bt$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
	xt$1 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
	St$1 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
	Ct$1 = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	wt$1 = Ct$1(4);
	Tt$1 = Ct$1(6);
	Et$1 = Ct$1(7);
	Dt$1 = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
	Ot$1 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	kt$1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	At$1 = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
	jt$1 = At$1;
	Mt$1 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	Pt$1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
	Ft$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
	It$1 = (e) => {
		let t = O$3(e ?? `:`);
		return RegExp(`^(?:[0-9A-F]{2}${t}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${t}){5}[0-9a-f]{2}$`);
	};
	Lt$1 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
	Rt$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
	zt$1 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
	Bt$1 = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
	Vt$1 = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
	Ht$1 = /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
	Ut$1 = /^https?$/;
	Wt$1 = /^\+[1-9]\d{6,14}$/;
	Gt$1 = /^\d(?:[ -]?\d){11,18}$/;
	Kt$1 = /^(?:AED|AFN|ALL|AMD|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BHD|BIF|BMD|BND|BOB|BOV|BRL|BSD|BTN|BWP|BYN|BZD|CAD|CDF|CHE|CHF|CHW|CLF|CLP|CNY|COP|COU|CRC|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HTG|HUF|IDR|ILS|INR|IQD|IRR|ISK|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRU|MUR|MVR|MWK|MXN|MXV|MYR|MZN|NAD|NGN|NIO|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SBD|SCR|SDG|SEK|SGD|SHP|SLE|SOS|SRD|SSP|STN|SVC|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|USN|UYI|UYU|UYW|UZS|VED|VES|VND|VUV|WST|XAD|XAF|XAG|XAU|XBA|XBB|XBC|XBD|XCD|XCG|XDR|XOF|XPD|XPF|XPT|XSU|XTS|XUA|XXX|YER|ZAR|ZMW|ZWG)$/;
	qt$1 = /^[A-Z]{2}(?!00|01|99)\d{2}[A-Z0-9]{11,30}$/;
	Jt$1 = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
	Xt$1 = Yt$1(Jt$1);
	en = /^[\s\S]{0,}$/;
	tn = (e) => {
		let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ``}}` : `[\\s\\S]*`;
		return RegExp(`^${t}$`);
	};
	nn = /^-?\d+n?$/;
	rn = /^-?\d+$/;
	an = /^-?\d+(?:\.\d+)?$/;
	on = /^(?:true|false)$/i;
	sn = /^null$/i;
	cn = /^undefined$/i;
	ln = /^[^A-Z]*$/;
	un = /^[^a-z]*$/;
	dn = /^[0-9a-fA-F]*$/;
	mn = /^[0-9a-fA-F]{32}$/;
	hn = fn(22, `==`);
	gn = pn(22);
	_n = /^[0-9a-fA-F]{40}$/;
	vn = fn(27, `=`);
	yn = pn(27);
	bn = /^[0-9a-fA-F]{64}$/;
	xn = fn(43, `=`);
	Sn = pn(43);
	Cn = /^[0-9a-fA-F]{96}$/;
	wn = fn(64, ``);
	Tn = pn(64);
	En = /^[0-9a-fA-F]{128}$/;
	Dn = fn(86, `==`);
	On = pn(86);
	j$2 = Ge$2(`$ZodCheck`, (e, t) => {
		var n;
		e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
	});
	kn = (e) => {
		let t = e.value;
		return !ee$1(t) && t.size !== void 0;
	};
	An = (e) => {
		let t = e.value;
		return !ee$1(t) && t.length !== void 0;
	};
	jn = {
		number: `number`,
		bigint: `bigint`,
		object: `date`
	};
	Mn = Ge$2(`$ZodCheckLessThan`, (e, t) => {
		j$2.init(e, t);
		let n = jn[typeof t.value];
		e._zod.check = (r) => {
			(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
				origin: jn[typeof r.value] ?? n,
				code: `too_big`,
				maximum: typeof t.value == `object` ? t.value.getTime() : t.value,
				input: r.value,
				inclusive: t.inclusive,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Nn = Ge$2(`$ZodCheckGreaterThan`, (e, t) => {
		j$2.init(e, t);
		let n = jn[typeof t.value];
		e._zod.check = (r) => {
			(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
				origin: jn[typeof r.value] ?? n,
				code: `too_small`,
				minimum: typeof t.value == `object` ? t.value.getTime() : t.value,
				input: r.value,
				inclusive: t.inclusive,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Pn = Ge$2(`$ZodCheckMultipleOf`, (e, t) => {
		j$2.init(e, t), e._zod.check = (r) => {
			if (typeof r.value != typeof t.value) throw Error(`Cannot mix number and bigint in multiple_of check.`);
			(typeof r.value == `bigint` ? t.value !== BigInt(0) && r.value % t.value === BigInt(0) : p$3(r.value, t.value) === 0) || r.issues.push({
				origin: typeof r.value,
				code: `not_multiple_of`,
				divisor: t.value,
				input: r.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Fn = Ge$2(`$ZodCheckNumberFormat`, (e, t) => {
		j$2.init(e, t), t.format = t.format || `float64`;
		let n = t.format?.includes(`int`);
		let r = n ? `int` : `number`;
		let [i, a] = N$3[t.format];
		e._zod.check = (o) => {
			let s = o.value;
			if (n) {
				if (!Number.isInteger(s)) {
					o.issues.push({
						expected: r,
						format: t.format,
						code: `invalid_type`,
						continue: !1,
						input: s,
						inst: e
					});
					return;
				}
				if (!Number.isSafeInteger(s)) {
					s > 0 ? o.issues.push({
						input: s,
						code: `too_big`,
						maximum: 2 ** 53 - 1,
						note: `Integers must be within the safe integer range.`,
						inst: e,
						origin: r,
						inclusive: !0,
						continue: !t.abort
					}) : o.issues.push({
						input: s,
						code: `too_small`,
						minimum: -(2 ** 53 - 1),
						note: `Integers must be within the safe integer range.`,
						inst: e,
						origin: r,
						inclusive: !0,
						continue: !t.abort
					});
					return;
				}
			}
			s < i && o.issues.push({
				origin: `number`,
				input: s,
				code: `too_small`,
				minimum: i,
				inclusive: !0,
				inst: e,
				continue: !t.abort
			}), s > a && o.issues.push({
				origin: `number`,
				input: s,
				code: `too_big`,
				maximum: a,
				inclusive: !0,
				inst: e,
				continue: !t.abort
			});
		};
	});
	In = Ge$2(`$ZodCheckBigIntFormat`, (e, t) => {
		j$2.init(e, t);
		let [n, r] = P$3[t.format];
		e._zod.check = (i) => {
			let a = i.value;
			a < n && i.issues.push({
				origin: `bigint`,
				input: a,
				code: `too_small`,
				minimum: n,
				inclusive: !0,
				inst: e,
				continue: !t.abort
			}), a > r && i.issues.push({
				origin: `bigint`,
				input: a,
				code: `too_big`,
				maximum: r,
				inclusive: !0,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Ln = Ge$2(`$ZodCheckMaxSize`, (e, t) => {
		var n;
		j$2.init(e, t), (n = e._zod.def).when ?? (n.when = kn), e._zod.check = (n) => {
			let r = n.value;
			r.size <= t.maximum || n.issues.push({
				origin: ye$1(r),
				code: `too_big`,
				maximum: t.maximum,
				inclusive: !0,
				input: r,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Rn = Ge$2(`$ZodCheckMinSize`, (e, t) => {
		var n;
		j$2.init(e, t), (n = e._zod.def).when ?? (n.when = kn), e._zod.check = (n) => {
			let r = n.value;
			r.size >= t.minimum || n.issues.push({
				origin: ye$1(r),
				code: `too_small`,
				minimum: t.minimum,
				inclusive: !0,
				input: r,
				inst: e,
				continue: !t.abort
			});
		};
	});
	zn = Ge$2(`$ZodCheckSizeEquals`, (e, t) => {
		var n;
		j$2.init(e, t), (n = e._zod.def).when ?? (n.when = kn), e._zod.check = (n) => {
			let r = n.value;
			let i = r.size;
			if (i === t.size) return;
			let a = i > t.size;
			n.issues.push({
				origin: ye$1(r),
				...a ? {
					code: `too_big`,
					maximum: t.size
				} : {
					code: `too_small`,
					minimum: t.size
				},
				inclusive: !0,
				exact: !0,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Bn = Ge$2(`$ZodCheckMaxLength`, (e, t) => {
		var n;
		j$2.init(e, t), (n = e._zod.def).when ?? (n.when = An), e._zod.check = (n) => {
			let r = n.value;
			let i = r.length;
			if ((typeof r == `string` && i > t.maximum ? xe$1(r) : i) <= t.maximum) return;
			let a = Se$2(r);
			n.issues.push({
				origin: a,
				code: `too_big`,
				maximum: t.maximum,
				inclusive: !0,
				input: r,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Vn = Ge$2(`$ZodCheckMinLength`, (e, t) => {
		var n;
		j$2.init(e, t), (n = e._zod.def).when ?? (n.when = An), e._zod.check = (n) => {
			let r = n.value;
			let i = r.length;
			if ((typeof r == `string` && i >= t.minimum && i < t.minimum * 2 ? xe$1(r) : i) >= t.minimum) return;
			let a = Se$2(r);
			n.issues.push({
				origin: a,
				code: `too_small`,
				minimum: t.minimum,
				inclusive: !0,
				input: r,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Hn = Ge$2(`$ZodCheckLengthEquals`, (e, t) => {
		var n;
		j$2.init(e, t), (n = e._zod.def).when ?? (n.when = An), e._zod.check = (n) => {
			let r = n.value;
			let i = r.length;
			let a = typeof r == `string` && i >= t.length && i <= t.length * 2 ? xe$1(r) : i;
			if (a === t.length) return;
			let o = Se$2(r);
			let s = a > t.length;
			n.issues.push({
				origin: o,
				...s ? {
					code: `too_big`,
					maximum: t.length
				} : {
					code: `too_small`,
					minimum: t.length
				},
				inclusive: !0,
				exact: !0,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Un = Ge$2(`$ZodCheckStringFormat`, (e, t) => {
		var n, r;
		j$2.init(e, t), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
			t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
				origin: `string`,
				code: `invalid_format`,
				format: t.format,
				input: n.value,
				...t.pattern ? { pattern: t.pattern.toString() } : {},
				inst: e,
				continue: !t.abort
			});
		}) : (r = e._zod).check ?? (r.check = () => {});
	});
	Wn = Ge$2(`$ZodCheckRegex`, (e, t) => {
		Un.init(e, t), e._zod.check = (n) => {
			t.pattern.lastIndex = 0, t.pattern.test(n.value) || n.issues.push({
				origin: `string`,
				code: `invalid_format`,
				format: `regex`,
				input: n.value,
				pattern: t.pattern.toString(),
				inst: e,
				continue: !t.abort
			});
		};
	});
	Gn = Ge$2(`$ZodCheckLowerCase`, (e, t) => {
		t.pattern ??= ln, Un.init(e, t);
	});
	Kn = Ge$2(`$ZodCheckUpperCase`, (e, t) => {
		t.pattern ??= un, Un.init(e, t);
	});
	qn = Ge$2(`$ZodCheckIncludes`, (e, t) => {
		j$2.init(e, t);
		let n = O$3(t.includes);
		t.pattern = new RegExp(typeof t.position == `number` ? `^.{${t.position},}${n}` : n), e._zod.check = (n) => {
			n.value.includes(t.includes, t.position) || n.issues.push({
				origin: `string`,
				code: `invalid_format`,
				format: `includes`,
				includes: t.includes,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Jn = Ge$2(`$ZodCheckStartsWith`, (e, t) => {
		j$2.init(e, t);
		let n = RegExp(`^${O$3(t.prefix)}.*`);
		t.pattern ??= n, e._zod.check = (n) => {
			n.value.startsWith(t.prefix) || n.issues.push({
				origin: `string`,
				code: `invalid_format`,
				format: `starts_with`,
				prefix: t.prefix,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Yn = Ge$2(`$ZodCheckEndsWith`, (e, t) => {
		j$2.init(e, t);
		let n = RegExp(`.*${O$3(t.suffix)}$`);
		t.pattern ??= n, e._zod.check = (n) => {
			n.value.endsWith(t.suffix) || n.issues.push({
				origin: `string`,
				code: `invalid_format`,
				format: `ends_with`,
				suffix: t.suffix,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Zn = Ge$2(`$ZodCheckProperty`, (e, t) => {
		j$2.init(e, t), e._zod.check = (e) => {
			let n = t.schema._zod.run({
				value: e.value[t.property],
				issues: []
			}, {});
			if (n instanceof Promise) return n.then((n) => Xn(n, e, t.property));
			Xn(n, e, t.property);
		};
	});
	Qn = Ge$2(`$ZodCheckProperties`, (e, t) => {
		j$2.init(e, t), Ne$2(e, Symbol.iterator, function* () {
			yield e;
		});
		let n;
		e._zod.check = (r) => {
			if (r.value == null) {
				r.issues.push({
					expected: `object`,
					code: `invalid_type`,
					input: r.value,
					inst: e
				});
				return;
			}
			n ??= Reflect.ownKeys(t.shape).map((e) => [e, t.shape[e]]);
			let i = r.value;
			let a;
			for (let [e, t] of n) {
				let n = t._zod.run({
					value: i[e],
					issues: []
				}, {});
				n instanceof Promise ? (a ??= [], a.push(n.then((t) => Xn(t, r, e)))) : Xn(n, r, e);
			}
			if (a) return Promise.all(a).then(() => void 0);
		};
	});
	$n = Ge$2(`$ZodCheckMimeType`, (e, t) => {
		j$2.init(e, t);
		let n = new Set(t.mime);
		e._zod.check = (r) => {
			n.has(r.value.type) || r.issues.push({
				code: `invalid_value`,
				values: t.mime,
				input: r.value.type,
				inst: e,
				continue: !t.abort
			});
		};
	});
	er = Ge$2(`$ZodCheckOverwrite`, (e, t) => {
		j$2.init(e, t), e._zod.check = (e) => {
			e.value = t.tx(e.value);
		};
	});
	tr = class {
		constructor(e = [], t = {}) {
			this.content = [], this.indent = 0, this.args = e, this.closed = t;
		}
		indented(e) {
			this.indent += 1;
			try {
				e(this);
			} finally {
				--this.indent;
			}
		}
		write(e) {
			if (typeof e == `function`) {
				e(this, { execution: `sync` }), e(this, { execution: `async` });
				return;
			}
			let t = e.split(`
`).filter((e) => e);
			let n = Math.min(...t.map((e) => e.length - e.trimStart().length));
			let r = t.map((e) => e.slice(n)).map((e) => ` `.repeat(this.indent * 2) + e);
			for (let e of r) this.content.push(e);
		}
		compile() {
			let e = Function;
			let t = this?.content ?? [``];
			return new e(...Object.keys(this.closed), `return function (${this.args.join(`, `)}) {\n${t.join(`
`)}\n};`)(...Object.values(this.closed));
		}
	};
	nr = {
		major: 4,
		minor: 6,
		patch: 7
	};
	M$2 = Ge$2(`$ZodType`, (e, t) => {
		var n;
		e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = nr;
		let r = e._zod.def.checks;
		let i = e._zod.traits.has(`$ZodCheck`) ? [e, ...r ?? []] : r?.length ? [...r] : [];
		for (let t of i) for (let n of t._zod.onattach) n(e);
		if (i.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
			e._zod.run = e._zod.parse;
		});
		else {
			let t = (t, n, r) => {
				if (t.memo) return t;
				let i = he$1(t);
				let o;
				for (let s of n) {
					if (s._zod.def.when) {
						if (W$3(t) || !s._zod.def.when(t)) continue;
					} else if (i) continue;
					let n = t.issues.length;
					let c = s._zod.check(t);
					if (c instanceof Promise && r?.async === !1) throw new qe$2();
					if (o || c instanceof Promise) o = (o ?? Promise.resolve()).then(async () => {
						await c, t.issues.length !== n && (_e$1(t.issues, n, e), i ||= he$1(t, n));
					});
					else {
						if (t.issues.length === n) continue;
						_e$1(t.issues, n, e), i ||= he$1(t, n);
					}
				}
				return o ? o.then(() => t) : t;
			};
			let n = (n, r, a) => {
				if (he$1(n)) return n.aborted = !0, n;
				let o = t(r, i, a);
				if (o instanceof Promise) {
					if (a.async === !1) throw new qe$2();
					return o.then((t) => e._zod.parse(t, a));
				}
				return e._zod.parse(o, a);
			};
			e._zod.run = (r, a) => {
				if (a.skipChecks) return e._zod.parse(r, a);
				if (a.direction === `backward`) {
					let t = e._zod.parse({
						value: r.value,
						issues: []
					}, {
						...a,
						skipChecks: !0
					});
					return t instanceof Promise ? t.then((e) => n(e, r, a)) : n(t, r, a);
				}
				let o = e._zod.parse(r, a);
				if (o instanceof Promise) {
					if (a.async === !1) throw new qe$2();
					return o.then((e) => t(e, i, a));
				}
				return t(o, i, a);
			};
		}
	}, {
		get "~standard"() {
			return Ne$2(this, `~standard`, ar(this));
		},
		set "~standard"(e) {
			J$3(this, `~standard`, e);
		}
	});
	rr = (e, t) => e.issues.length ? { issues: e.issues.map((e) => ve$1(e, t, Ye$2())) } : { value: e.value };
	or = Ge$2(`$ZodString`, (e, t) => {
		M$2.init(e, t), e._zod.pattern = t.pattern ?? en, e._zod.parse = (n, r) => {
			if (t.coerce) try {
				n.value = String(n.value);
			} catch {}
			return typeof n.value == `string` || n.issues.push({
				expected: `string`,
				code: `invalid_type`,
				input: n.value,
				inst: e
			}), n;
		};
	});
	N$2 = Ge$2(`$ZodStringFormat`, (e, t) => {
		Un.init(e, t), or.init(e, t);
	});
	sr = Ge$2(`$ZodGUID`, (e, t) => {
		t.pattern ??= St$1, N$2.init(e, t);
	});
	cr = Ge$2(`$ZodUUID`, (e, t) => {
		if (t.version) {
			let e = {
				v1: 1,
				v2: 2,
				v3: 3,
				v4: 4,
				v5: 5,
				v6: 6,
				v7: 7,
				v8: 8
			}[t.version];
			if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
			t.pattern ??= Ct$1(e);
		} else t.pattern ??= Ct$1();
		N$2.init(e, t);
	});
	lr = Ge$2(`$ZodEmail`, (e, t) => {
		t.pattern ??= Dt$1, N$2.init(e, t);
	});
	hr = /[\t\n\r]/g;
	yr = Ge$2(`$ZodURL`, (e, t) => {
		N$2.init(e, t), e._zod.check = (n) => {
			try {
				let r = n.value.trim();
				let i = pr(r, t);
				if (i === 1) {
					n.issues.push({
						code: `invalid_format`,
						format: `url`,
						note: `Invalid URL format`,
						input: n.value,
						inst: e,
						continue: !t.abort
					});
					return;
				}
				if (i === 2) {
					n.issues.push({
						code: `invalid_format`,
						format: `url`,
						input: n.value,
						inst: e,
						continue: !t.abort
					});
					return;
				}
				if (i === !0) {
					n.value = gr(r);
					return;
				}
				t.hostname && !_r(i, t.hostname) && n.issues.push({
					code: `invalid_format`,
					format: `url`,
					note: `Invalid hostname`,
					pattern: t.hostname.source,
					input: n.value,
					inst: e,
					continue: !t.abort
				}), t.protocol && !vr(i, t.protocol) && n.issues.push({
					code: `invalid_format`,
					format: `url`,
					note: `Invalid protocol`,
					pattern: t.protocol.source,
					input: n.value,
					inst: e,
					continue: !t.abort
				}), n.value = t.normalize ? i.href : gr(r);
				return;
			} catch {
				n.issues.push({
					code: `invalid_format`,
					format: `url`,
					input: n.value,
					inst: e,
					continue: !t.abort
				});
			}
		};
	});
	br = Ge$2(`$ZodEmoji`, (e, t) => {
		t.pattern ??= Nt$1(), N$2.init(e, t);
	});
	xr = Ge$2(`$ZodNanoID`, (e, t) => {
		if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw Error(`Invalid nanoid length: ${t.length}`);
		t.pattern ??= t.length === void 0 ? vt$1 : yt$1(t.length), N$2.init(e, t);
	});
	Sr = Ge$2(`$ZodCUID`, (e, t) => {
		t.pattern ??= pt$1, N$2.init(e, t);
	});
	Cr = Ge$2(`$ZodCUID2`, (e, t) => {
		t.pattern ??= mt$1, N$2.init(e, t);
	});
	wr = Ge$2(`$ZodULID`, (e, t) => {
		t.pattern ??= ht$1, N$2.init(e, t);
	});
	Tr = Ge$2(`$ZodXID`, (e, t) => {
		t.pattern ??= gt$1, N$2.init(e, t);
	});
	Er = Ge$2(`$ZodKSUID`, (e, t) => {
		t.pattern ??= _t$1, N$2.init(e, t);
	});
	Dr = Ge$2(`$ZodISODateTime`, (e, t) => {
		t.pattern ??= $t$1(t), N$2.init(e, t);
	});
	Or = Ge$2(`$ZodISODate`, (e, t) => {
		t.pattern ??= Xt$1, N$2.init(e, t);
	});
	kr = Ge$2(`$ZodISOTime`, (e, t) => {
		t.pattern ??= Qt$1(t), N$2.init(e, t);
	});
	Ar = Ge$2(`$ZodISODuration`, (e, t) => {
		t.pattern ??= bt$1, N$2.init(e, t);
	});
	jr = Ge$2(`$ZodIPv4`, (e, t) => {
		t.pattern ??= Pt$1, N$2.init(e, t);
	});
	Mr = /^[0-9a-fA-F:.]+$/;
	Pr = Ge$2(`$ZodIPv6`, (e, t) => {
		t.pattern ??= Ft$1, N$2.init(e, t), e._zod.check = (n) => {
			Nr(n.value) || n.issues.push({
				code: `invalid_format`,
				format: `ipv6`,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Fr = Ge$2(`$ZodMAC`, (e, t) => {
		t.pattern ??= It$1(t.delimiter), N$2.init(e, t);
	});
	Ir = Ge$2(`$ZodCIDRv4`, (e, t) => {
		t.pattern ??= Lt$1, N$2.init(e, t);
	});
	Rr = Ge$2(`$ZodCIDRv6`, (e, t) => {
		t.pattern ??= Rt$1, N$2.init(e, t), e._zod.check = (n) => {
			Lr(n.value) || n.issues.push({
				code: `invalid_format`,
				format: `cidrv6`,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Br = /^[0-9a-zA-Z+/]*={0,2}$/;
	Vr = Ge$2(`$ZodBase64`, (e, t) => {
		t.pattern ??= Br, N$2.init(e, t), e._zod.check = (n) => {
			zr(n.value) || n.issues.push({
				code: `invalid_format`,
				format: `base64`,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Hr = /^[A-Za-z0-9_-]*$/;
	Wr = Ge$2(`$ZodBase64URL`, (e, t) => {
		t.pattern ??= Hr, N$2.init(e, t), e._zod.check = (n) => {
			Ur(n.value) || n.issues.push({
				code: `invalid_format`,
				format: `base64url`,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Gr = Ge$2(`$ZodE164`, (e, t) => {
		t.pattern ??= Wt$1, N$2.init(e, t);
	});
	Kr = /[- ]/g;
	Yr = Ge$2(`$ZodCreditCard`, (e, t) => {
		t.pattern ??= Gt$1, N$2.init(e, t), e._zod.check = (n) => {
			Jr(n.value) || n.issues.push({
				code: `invalid_format`,
				format: `credit_card`,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	Qr = Ge$2(`$ZodIBAN`, (e, t) => {
		t.pattern ??= qt$1, N$2.init(e, t), e._zod.check = (n) => {
			Zr(n.value) || n.issues.push({
				code: `invalid_format`,
				format: `iban`,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	ei = Ge$2(`$ZodJWT`, (e, t) => {
		N$2.init(e, t), e._zod.check = (n) => {
			$r(n.value, t.alg) || n.issues.push({
				code: `invalid_format`,
				format: `jwt`,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	ti = Ge$2(`$ZodCustomStringFormat`, (e, t) => {
		N$2.init(e, t), e._zod.check = (n) => {
			t.fn(n.value) || n.issues.push({
				code: `invalid_format`,
				format: t.format,
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		};
	});
	ni = Ge$2(`$ZodNumber`, (e, t) => {
		M$2.init(e, t), e._zod.pattern = an, e._zod.parse = (n, r) => {
			if (t.coerce) try {
				n.value = Number(n.value);
			} catch {}
			let i = n.value;
			if (typeof i == `number` && !Number.isNaN(i) && Number.isFinite(i)) return n;
			let a = typeof i == `number` ? Number.isNaN(i) ? `NaN` : Number.isFinite(i) ? void 0 : String(i) : void 0;
			return n.issues.push({
				expected: `number`,
				code: `invalid_type`,
				input: i,
				inst: e,
				...a ? { received: a } : {}
			}), n;
		};
	});
	ri = Ge$2(`$ZodNumberFormat`, (e, t) => {
		Fn.init(e, t), ni.init(e, t);
	});
	ii = Ge$2(`$ZodBoolean`, (e, t) => {
		M$2.init(e, t), e._zod.pattern = on, e._zod.parse = (n, r) => {
			if (t.coerce) try {
				n.value = !!n.value;
			} catch {}
			let i = n.value;
			return typeof i == `boolean` || n.issues.push({
				expected: `boolean`,
				code: `invalid_type`,
				input: i,
				inst: e
			}), n;
		};
	});
	ai = Ge$2(`$ZodBigInt`, (e, t) => {
		M$2.init(e, t), e._zod.pattern = nn, e._zod.parse = (n, r) => {
			if (t.coerce) try {
				n.value = BigInt(n.value);
			} catch {}
			return typeof n.value == `bigint` || n.issues.push({
				expected: `bigint`,
				code: `invalid_type`,
				input: n.value,
				inst: e
			}), n;
		};
	});
	oi = Ge$2(`$ZodBigIntFormat`, (e, t) => {
		In.init(e, t), ai.init(e, t);
	});
	si = Ge$2(`$ZodSymbol`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (t, n) => {
			let r = t.value;
			return typeof r == `symbol` || t.issues.push({
				expected: `symbol`,
				code: `invalid_type`,
				input: r,
				inst: e
			}), t;
		};
	});
	ci = Ge$2(`$ZodUndefined`, (e, t) => {
		M$2.init(e, t), e._zod.pattern = cn, e._zod.values = new Set([void 0]), e._zod.parse = (t, n) => {
			let r = t.value;
			return r === void 0 || t.issues.push({
				expected: `undefined`,
				code: `invalid_type`,
				input: r,
				inst: e
			}), t;
		};
	});
	li = Ge$2(`$ZodNull`, (e, t) => {
		M$2.init(e, t), e._zod.pattern = sn, e._zod.values = new Set([null]), e._zod.parse = (t, n) => {
			let r = t.value;
			return r === null || t.issues.push({
				expected: `null`,
				code: `invalid_type`,
				input: r,
				inst: e
			}), t;
		};
	});
	ui = Ge$2(`$ZodAny`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (e) => e;
	});
	di = Ge$2(`$ZodUnknown`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (e) => e;
	});
	fi = Ge$2(`$ZodNever`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
			expected: `never`,
			code: `invalid_type`,
			input: t.value,
			inst: e
		}), t);
	});
	pi = Ge$2(`$ZodVoid`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (t, n) => {
			let r = t.value;
			return r === void 0 || t.issues.push({
				expected: `void`,
				code: `invalid_type`,
				input: r,
				inst: e
			}), t;
		};
	});
	mi = Ge$2(`$ZodDate`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (n, r) => {
			if (t.coerce) try {
				n.value = new Date(n.value);
			} catch {}
			let i = n.value;
			let a = i instanceof Date;
			return a && !Number.isNaN(i.getTime()) || n.issues.push({
				expected: `date`,
				code: `invalid_type`,
				input: i,
				...a ? { received: `Invalid Date` } : {},
				inst: e
			}), n;
		};
	});
	gi = (e) => Array.isArray(e) ? e.length : -1;
	_i = (e) => e instanceof Map ? e.size : -1;
	vi = (e) => e instanceof Set ? e.size : -1;
	bi = Ge$2(`$ZodArray`, (e, t) => {
		M$2.init(e, t);
		let n = $$3.memoizer;
		n?.attach(e), e._zod.parse = (r, i) => {
			let a = r.value;
			if (!Array.isArray(a)) return r.issues.push({
				expected: `array`,
				code: `invalid_type`,
				input: a,
				inst: e
			}), r;
			r.value = n ? n.alloc(e, r, Array(a.length), i) : Array(a.length);
			let o = [];
			let s = i?.abortEarly;
			for (let e = 0; e < a.length; e++) {
				let n = a[e];
				let c = t.element._zod.run({
					value: n,
					issues: []
				}, i);
				if (c instanceof Promise) o.push(c.then((t) => yi(t, r, e)));
				else if (yi(c, r, e), s && c.issues.length !== 0 && he$1(c)) break;
			}
			return o.length ? Promise.all(o).then(() => r) : r;
		}, hi(e, gi);
	});
	Si = [];
	Ti = Ge$2(`$ZodObject`, (e, t) => {
		M$2.init(e, t);
		let n = Object.getOwnPropertyDescriptor(t, `shape`);
		let r = n?.get ? n.get.raw : t.shape ?? {};
		if (r) {
			let e = () => {
				let n = { ...r };
				return Object.defineProperty(t, "shape", { value: n }), e.raw = n, n;
			};
			e.raw = r, Object.defineProperty(t, "shape", { get: e });
		}
		let a = f$1(() => Ci(t));
		Re$2(e, `propValues`, (e) => {
			let t = e.def.shape;
			let n = {};
			for (let e in t) {
				let r = t[e]._zod;
				if (r.values) {
					Object.prototype.hasOwnProperty.call(n, e) || g$1(n, e, new Set());
					for (let t of r.values) n[e].add(t);
					r.optin !== void 0 && n[e].add(void 0);
				}
			}
			return n;
		});
		let o = S$2;
		let c = t.catchall;
		let l;
		let u = $$3.memoizer;
		u?.attach(e), e._zod.parse = (t, n) => {
			l ??= a.value;
			let r = t.value;
			if (!o(r)) return t.issues.push({
				expected: `object`,
				code: `invalid_type`,
				input: r,
				inst: e
			}), t;
			t.value = u ? u.alloc(e, t, {}, n) : {};
			let i = [];
			let s = l.shape;
			let d = n?.abortEarly;
			let f = t.issues.length;
			for (let e of l.allKeys) {
				if (d && t.issues.length !== f) {
					if (he$1(t, f)) break;
					f = t.issues.length;
				}
				if (e === `__proto__`) continue;
				let a = s[e];
				let o = a._zod.optin;
				let c = a._zod.optout;
				let l = a._zod.run({
					value: r[e],
					issues: []
				}, n);
				l instanceof Promise ? i.push(l.then((n) => xi(n, t, e, r, o, c))) : xi(l, t, e, r, o, c);
			}
			return c ? wi(i, r, t, n, a.value, e, d === !0) : i.length ? Promise.all(i).then(() => t) : t;
		};
	});
	Ei = Ge$2(`$ZodObjectJIT`, (e, t) => {
		Ti.init(e, t);
		let n = e._zod.parse;
		let r = f$1(() => Ci(t));
		let i = $$3.memoizer;
		let a = (t) => {
			let n = r.value;
			let a = n.symbolKeys;
			let o = new tr([`payload`, `ctx`], {
				shape: t,
				inst: e,
				memo: i,
				syms: a
			});
			let s = (e) => `shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`;
			let c = (e, t) => `
          let ${e}_ab = false;
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${e}_ab = true;
          }
          if (${e}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
			o.write(`const input = payload.value;`);
			let l = Object.create(null);
			let u = 0;
			for (let e of n.allKeys) l[e] = `key_${u++}`;
			o.write(i ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
			for (let e of n.allKeys) {
				if (e === `__proto__`) continue;
				let n = l[e];
				let r = typeof e == `symbol` ? `syms[${a.indexOf(e)}]` : ue$1(e);
				let i = `${r} in input`;
				let u = t[e];
				let d = u?._zod?.optin;
				let f = d !== void 0;
				let p = u?._zod?.optout === `optional`;
				if (o.write(`const ${n} = ${s(r)};`), f && p) {
					let e = d === `optional` ? `${n}_present` : `${n}.value !== undefined || ${n}_present`;
					o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n, r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `);
				} else f ? (o.write(`
        if (${n}.issues.length) {${c(n, r)}
        }
      `), d === `defaulted` ? o.write(`newResult[${r}] = ${n}.value;`) : o.write(`
        if (${n}.value !== undefined || ${i}) {
          newResult[${r}] = ${n}.value;
        }
      `)) : o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n, r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `);
			}
			return o.write(`payload.value = newResult;`), o.write(`return payload;`), o.compile();
		};
		let o;
		let c = S$2;
		let l = !$$3.jitless;
		let u = l && C$2.value;
		let d = t.catchall;
		let f;
		e._zod.parse = (i, s) => {
			f ??= r.value;
			let p = i.value;
			return c(p) ? l && u && s?.async === !1 && s.jitless !== !0 ? (o ||= a(t.shape), i = o(i, s), d ? wi([], p, i, s, f, e, s?.abortEarly === !0) : i) : n(i, s) : (i.issues.push({
				expected: `object`,
				code: `invalid_type`,
				input: p,
				inst: e
			}), i);
		};
	});
	Oi = Ge$2(`$ZodUnion`, (e, t) => {
		M$2.init(e, t), Re$2(e, `optin`, (e) => e.def.options.some((e) => e._zod.optin === `defaulted`) ? `defaulted` : e.def.options.some((e) => e._zod.optin !== void 0) ? `optional` : void 0), Re$2(e, `optout`, (e) => e.def.options.some((e) => e._zod.optout === `optional`) ? `optional` : void 0), Re$2(e, `values`, (e) => {
			if (e.def.options.every((e) => e._zod.values)) return new Set(e.def.options.flatMap((e) => Array.from(e._zod.values)));
		}), Re$2(e, `pattern`, (e) => {
			if (e.def.options.every((e) => e._zod.pattern)) {
				let t = e.def.options.map((e) => e._zod.pattern);
				return RegExp(`^(${t.map((e) => te$1(e.source)).join(`|`)})$`);
			}
		});
		let n = t.options.length === 1 ? t.options[0]._zod.run : null;
		e._zod.parse = (r, i) => {
			if (n) return n(r, i);
			let a = !1;
			let o = [];
			for (let e of t.options) {
				let t = e._zod.run({
					value: r.value,
					issues: []
				}, i);
				if (t instanceof Promise) o.push(t), a = !0;
				else {
					if (t.issues.length === 0) return t;
					o.push(t);
				}
			}
			return a ? Promise.all(o).then((t) => Di(t, r, e, i)) : Di(o, r, e, i);
		};
	});
	Ai = Ge$2(`$ZodXor`, (e, t) => {
		Oi.init(e, t), t.inclusive = !1;
		let n = t.options.length === 1 ? t.options[0]._zod.run : null;
		e._zod.parse = (r, i) => {
			if (n) return n(r, i);
			let a = !1;
			let o = [];
			for (let e of t.options) {
				let t = e._zod.run({
					value: r.value,
					issues: []
				}, i);
				t instanceof Promise ? (o.push(t), a = !0) : o.push(t);
			}
			return a ? Promise.all(o).then((t) => ki(t, r, e, i)) : ki(o, r, e, i);
		};
	});
	Ni = Ge$2(`$ZodDiscriminatedUnion`, (e, t) => {
		t.inclusive = !1, Oi.init(e, t);
		let n = e._zod.parse;
		Re$2(e, `propValues`, (e) => {
			let t = {};
			let n = 0;
			for (let r of e.def.options) {
				let i = r._zod.propValues;
				if (!i || Object.keys(i).length === 0) throw Error(`Invalid discriminated union option at index "${e.def.options.indexOf(r)}"`);
				i[e.def.discriminator]?.has(void 0) && n++;
				for (let [e, n] of Object.entries(i)) {
					Object.prototype.hasOwnProperty.call(t, e) || g$1(t, e, new Set());
					for (let r of n) t[e].add(r);
				}
			}
			return !e.def.unionFallback && n > 1 && t[e.def.discriminator]?.delete(void 0), t;
		}), t.options.forEach((e, n) => {
			let r = _$1(e._zod.def);
			if (r && !Object.prototype.hasOwnProperty.call(r, t.discriminator)) throw Error(`Invalid discriminated union option at index "${n}"`);
		});
		let r = f$1(() => Mi(t));
		e._zod.parse = (i, a) => {
			let o = i.value;
			if (!S$2(o)) return i.issues.push({
				code: `invalid_type`,
				expected: `object`,
				input: o,
				inst: e
			}), i;
			let c = o?.[t.discriminator];
			let l = r.value.get(c);
			return l && (c !== void 0 || a.direction !== `backward`) ? l._zod.run(i, a) : t.unionFallback || a.direction === `backward` ? n(i, a) : (i.issues.push({
				code: `invalid_union`,
				errors: [],
				note: `No matching discriminator`,
				discriminator: t.discriminator,
				options: Array.from(r.value.keys()).filter((e) => r.value.get(e) !== null),
				input: o,
				path: [t.discriminator],
				inst: e
			}), i);
		};
	});
	Pi = Ge$2(`$ZodIntersection`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (e, n) => {
			let r = e.value;
			let i = t.left._zod.run({
				value: r,
				issues: []
			}, n);
			let a = t.right._zod.run({
				value: r,
				issues: []
			}, n);
			return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => Ii(e, t, n)) : Ii(e, i, a);
		};
	});
	Li = Ge$2(`$ZodTuple`, (e, t) => {
		M$2.init(e, t);
		let n = t.items;
		let r = $$3.memoizer;
		r?.attach(e), e._zod.parse = (i, a) => {
			let o = i.value;
			if (!Array.isArray(o)) return i.issues.push({
				input: o,
				inst: e,
				expected: `tuple`,
				code: `invalid_type`
			}), i;
			i.value = r ? r.alloc(e, i, [], a) : [];
			let s = [];
			let c = Ri(n, `optin`);
			let l = Ri(n, `optout`);
			if (!t.rest) {
				if (o.length < c) return i.issues.push({
					code: `too_small`,
					minimum: c,
					inclusive: !0,
					input: o,
					inst: e,
					origin: `array`
				}), i;
				o.length > n.length && i.issues.push({
					code: `too_big`,
					maximum: n.length,
					inclusive: !0,
					input: o,
					inst: e,
					origin: `array`
				});
			}
			let u = Array(n.length);
			let d = t.rest ? a?.abortEarly : void 0;
			let f = !1;
			for (let e = 0; e < n.length; e++) {
				let t = n[e]._zod.run({
					value: o[e],
					issues: []
				}, a);
				t instanceof Promise ? s.push(t.then((t) => {
					u[e] = t;
				})) : (u[e] = t, d && !f && t.issues.length && (f = he$1(t)));
			}
			if (t.rest && !f) {
				let e = n.length - 1;
				let r = o.slice(n.length);
				let c = i.issues.length;
				for (let n of r) {
					if (d && i.issues.length !== c) {
						if (he$1(i, c)) break;
						c = i.issues.length;
					}
					e++;
					let r = t.rest._zod.run({
						value: n,
						issues: []
					}, a);
					r instanceof Promise ? s.push(r.then((t) => zi(t, i, e))) : zi(r, i, e);
				}
			}
			return s.length ? Promise.all(s).then(() => Bi(u, i, n, o, l)) : Bi(u, i, n, o, l);
		};
	});
	Vi = Ge$2(`$ZodRecord`, (e, t) => {
		M$2.init(e, t);
		let n = $$3.memoizer;
		n?.attach(e), e._zod.parse = (r, i) => {
			let a = r.value;
			if (!w$2(a)) return r.issues.push({
				expected: `record`,
				code: `invalid_type`,
				input: a,
				inst: e
			}), r;
			let o = [];
			let s = t.keyType._zod.values;
			if (s && !t.partial) {
				r.value = n ? n.alloc(e, r, {}, i) : {};
				let c = new Set();
				for (let n of s) if (typeof n == `string` || typeof n == `number` || typeof n == `symbol`) {
					if (c.add(typeof n == `number` ? n.toString() : n), n === `__proto__`) continue;
					let s = t.keyType._zod.run({
						value: n,
						issues: []
					}, i);
					if (s instanceof Promise) throw Error(`Async schemas not supported in object keys currently`);
					if (s.issues.length) {
						r.issues.push({
							code: `invalid_key`,
							origin: `record`,
							issues: s.issues.map((e) => ve$1(e, i, Ye$2())),
							input: n,
							path: [n],
							inst: e
						});
						continue;
					}
					let l = s.value;
					if (l === `__proto__`) continue;
					let u = t.valueType._zod.run({
						value: a[n],
						issues: []
					}, i);
					u instanceof Promise ? o.push(u.then((e) => {
						e.issues.length && r.issues.push(...G$3(n, e.issues)), r.value[l] = e.value;
					})) : (u.issues.length && r.issues.push(...G$3(n, u.issues)), r.value[l] = u.value);
				}
				let l;
				for (let e in a) if (!c.has(e)) {
					if (t.mode === `loose`) {
						if (e === `__proto__`) continue;
						r.value[e] = a[e];
					} else l ??= [], l.push(e);
				}
				l && l.length > 0 && r.issues.push({
					code: `unrecognized_keys`,
					input: a,
					inst: e,
					keys: l,
					continue: !0
				});
			} else {
				r.value = n ? n.alloc(e, r, {}, i) : {};
				let c;
				for (let n of Reflect.ownKeys(a)) {
					if (n === `__proto__` || !Object.prototype.propertyIsEnumerable.call(a, n)) continue;
					let l = t.keyType._zod.run({
						value: n,
						issues: []
					}, i);
					if (l instanceof Promise) throw Error(`Async schemas not supported in object keys currently`);
					if (typeof n == `string` && an.test(n) && l.issues.length) {
						let e = t.keyType._zod.run({
							value: Number(n),
							issues: []
						}, i);
						if (e instanceof Promise) throw Error(`Async schemas not supported in object keys currently`);
						e.issues.length === 0 && (l = e);
					}
					if (l.issues.length) {
						t.mode === `loose` ? r.value[n] = a[n] : s ? (c ??= [], c.push(n)) : r.issues.push({
							code: `invalid_key`,
							origin: `record`,
							issues: l.issues.map((e) => ve$1(e, i, Ye$2())),
							input: n,
							path: [n],
							inst: e
						});
						continue;
					}
					let u = l.value;
					if (u === `__proto__`) continue;
					let d = t.valueType._zod.run({
						value: a[n],
						issues: []
					}, i);
					d instanceof Promise ? o.push(d.then((e) => {
						e.issues.length && r.issues.push(...G$3(n, e.issues)), r.value[u] = e.value;
					})) : (d.issues.length && r.issues.push(...G$3(n, d.issues)), r.value[u] = d.value);
				}
				c && c.length > 0 && r.issues.push({
					code: `unrecognized_keys`,
					input: a,
					inst: e,
					keys: c,
					continue: !0
				});
			}
			return o.length ? Promise.all(o).then(() => r) : r;
		};
	});
	Hi = Ge$2(`$ZodMap`, (e, t) => {
		M$2.init(e, t);
		let n = $$3.memoizer;
		n?.attach(e), e._zod.parse = (r, i) => {
			let a = r.value;
			if (!(a instanceof Map)) return r.issues.push({
				expected: `map`,
				code: `invalid_type`,
				input: a,
				inst: e
			}), r;
			let o = [];
			r.value = n ? n.alloc(e, r, new Map(), i) : new Map();
			let s = i?.abortEarly;
			let c = r.issues.length;
			for (let [n, l] of a) {
				if (s && r.issues.length !== c) {
					if (he$1(r, c)) break;
					c = r.issues.length;
				}
				let u = t.keyType._zod.run({
					value: n,
					issues: []
				}, i);
				let d = t.valueType._zod.run({
					value: l,
					issues: []
				}, i);
				u instanceof Promise || d instanceof Promise ? o.push(Promise.all([u, d]).then(([t, o]) => {
					Ui(t, o, r, n, a, e, i);
				})) : Ui(u, d, r, n, a, e, i);
			}
			return o.length ? Promise.all(o).then(() => r) : r;
		}, hi(e, _i);
	});
	Wi = Ge$2(`$ZodSet`, (e, t) => {
		M$2.init(e, t);
		let n = $$3.memoizer;
		n?.attach(e), e._zod.parse = (r, i) => {
			let a = r.value;
			if (!(a instanceof Set)) return r.issues.push({
				input: a,
				inst: e,
				expected: `set`,
				code: `invalid_type`
			}), r;
			let o = [];
			r.value = n ? n.alloc(e, r, new Set(), i) : new Set();
			let s = i?.abortEarly;
			let c = r.issues.length;
			for (let e of a) {
				if (s && r.issues.length !== c) {
					if (he$1(r, c)) break;
					c = r.issues.length;
				}
				let n = t.valueType._zod.run({
					value: e,
					issues: []
				}, i);
				n instanceof Promise ? o.push(n.then((e) => Gi$1(e, r))) : Gi$1(n, r);
			}
			return o.length ? Promise.all(o).then(() => r) : r;
		}, hi(e, vi);
	});
	Ki$1 = Ge$2(`$ZodEnum`, (e, n) => {
		M$2.init(e, n);
		let r = c$1(n.entries);
		let a = new Set(r);
		e._zod.values = a, Re$2(e, `pattern`, (e) => {
			let n = c$1(e.def.entries).filter((e) => E$2.has(typeof e));
			return RegExp(n.length ? `^(${n.map((e) => O$3(e.toString())).join(`|`)})$` : `^[^\\s\\S]$`);
		}), e._zod.parse = (t, n) => {
			let i = t.value;
			return a.has(i) || t.issues.push({
				code: `invalid_value`,
				values: r,
				input: i,
				inst: e
			}), t;
		};
	});
	qi$1 = Ge$2(`$ZodLiteral`, (e, t) => {
		M$2.init(e, t);
		let n = new Set(t.values);
		e._zod.values = n, Re$2(e, `pattern`, (e) => {
			let t = e.def.values;
			return RegExp(t.length ? `^(${t.map((e) => typeof e == `string` ? O$3(e) : e ? O$3(e.toString()) : String(e)).join(`|`)})$` : `^[^\\s\\S]$`);
		}), e._zod.parse = (r, i) => {
			let a = r.value;
			return n.has(a) || r.issues.push({
				code: `invalid_value`,
				values: t.values,
				input: a,
				inst: e
			}), r;
		};
	});
	Ji$1 = Ge$2(`$ZodFile`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (t, n) => {
			let r = t.value;
			return r instanceof File || t.issues.push({
				expected: `file`,
				code: `invalid_type`,
				input: r,
				inst: e
			}), t;
		};
	});
	Yi$1 = Ge$2(`$ZodTransform`, (e, t) => {
		M$2.init(e, t), e._zod.optin = `optional`, $$3.memoizer?.guard(e), e._zod.parse = (n, r) => {
			if (r.direction === `backward`) throw new Je$2(e.constructor.name);
			let i = t.transform(n.value, n);
			if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
			if (i instanceof Promise) throw new qe$2();
			return n.value = i, n;
		};
	});
	Zi$1 = Ge$2(`$ZodOptional`, (e, t) => {
		M$2.init(e, t), Re$2(e, `optin`, (e) => e.def.innerType._zod.optin === `defaulted` ? `defaulted` : `optional`), e._zod.optout = `optional`, Re$2(e, `values`, (e) => {
			let t = e.def.innerType._zod.values;
			return t ? new Set([...t, void 0]) : void 0;
		}), Re$2(e, `pattern`, (e) => {
			let t = e.def.innerType._zod.pattern;
			return t ? RegExp(`^(${te$1(t.source)})?$`) : void 0;
		}), e._zod.parse = (e, n) => {
			if (e.value === void 0) {
				if (t.innerType._zod.optin !== `defaulted`) return e;
				let r = t.innerType._zod.run({
					value: e.value,
					issues: []
				}, n);
				return r instanceof Promise ? r.then((t) => Xi$1(e, t)) : Xi$1(e, r);
			}
			return t.innerType._zod.run(e, n);
		};
	});
	Qi$1 = Ge$2(`$ZodExactOptional`, (e, t) => {
		Zi$1.init(e, t), Re$2(e, `values`, (e) => e.def.innerType._zod.values), Re$2(e, `pattern`, (e) => e.def.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
	});
	$i$1 = Ge$2(`$ZodNullable`, (e, t) => {
		M$2.init(e, t), Re$2(e, `optin`, (e) => e.def.innerType._zod.optin), Re$2(e, `optout`, (e) => e.def.innerType._zod.optout), Re$2(e, `pattern`, (e) => {
			let t = e.def.innerType._zod.pattern;
			return t ? RegExp(`^(${te$1(t.source)}|null)$`) : void 0;
		}), Re$2(e, `values`, (e) => e.def.innerType._zod.values ? new Set([...e.def.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
	});
	ea$1 = Ge$2(`$ZodDefault`, (e, t) => {
		M$2.init(e, t), e._zod.optin = `defaulted`, Re$2(e, `values`, (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
			if (n.direction === `backward`) return t.innerType._zod.run(e, n);
			if (e.value === void 0) return e.value = t.defaultValue, e;
			let r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => ta$1(e, t)) : ta$1(r, t);
		};
	});
	na$1 = Ge$2(`$ZodPrefault`, (e, t) => {
		M$2.init(e, t), e._zod.optin = `defaulted`, Re$2(e, `values`, (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === `backward` || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
	});
	ra$1 = Ge$2(`$ZodNonOptional`, (e, t) => {
		M$2.init(e, t), Re$2(e, `values`, (e) => {
			let t = e.def.innerType._zod.values;
			return t ? new Set([...t].filter((e) => e !== void 0)) : void 0;
		}), e._zod.parse = (n, r) => {
			let i = t.innerType._zod.run(n, r);
			return i instanceof Promise ? i.then((t) => ia$1(t, e)) : ia$1(i, e);
		};
	});
	aa$1 = Ge$2(`$ZodSuccess`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (e, n) => {
			if (n.direction === `backward`) throw new Je$2(`ZodSuccess`);
			let r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then((t) => (e.value = t.issues.length === 0, e)) : (e.value = r.issues.length === 0, e);
		};
	});
	sa$1 = Ge$2(`$ZodCatch`, (e, t) => {
		M$2.init(e, t), Re$2(e, `optin`, (e) => e.def.innerType._zod.optin === `defaulted` ? `defaulted` : `optional`), Re$2(e, `optout`, (e) => e.def.innerType._zod.optout), Re$2(e, `values`, (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
			if (n.direction === `backward`) return t.innerType._zod.run(e, n);
			let r = t.innerType._zod.run({
				value: e.value,
				issues: []
			}, n);
			return r instanceof Promise ? r.then((r) => oa$1(e, r, t, n)) : oa$1(e, r, t, n);
		};
	});
	ca$1 = Ge$2(`$ZodNaN`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (t, n) => (typeof t.value == `number` && Number.isNaN(t.value) || t.issues.push({
			input: t.value,
			inst: e,
			expected: `nan`,
			code: `invalid_type`
		}), t);
	});
	la$1 = Ge$2(`$ZodPipe`, (e, t) => {
		M$2.init(e, t), Re$2(e, `values`, (e) => e.def.in._zod.values), Re$2(e, `optin`, (e) => e.def.in._zod.optin), Re$2(e, `optout`, (e) => e.def.out._zod.optout), Re$2(e, `propValues`, (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
			if (n.direction === `backward`) {
				let r = t.out._zod.run(e, n);
				return r instanceof Promise ? r.then((e) => ua$1(e, t.in, n)) : ua$1(r, t.in, n);
			}
			let r = t.in._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => ua$1(e, t.out, n)) : ua$1(r, t.out, n);
		};
	});
	da$1 = Ge$2(`$ZodCodec`, (e, t) => {
		M$2.init(e, t), Re$2(e, `values`, (e) => e.def.in._zod.values), Re$2(e, `optin`, (e) => e.def.in._zod.optin), Re$2(e, `optout`, (e) => e.def.out._zod.optout), Re$2(e, `propValues`, (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
			if ((n.direction || `forward`) === `forward`) {
				let r = t.in._zod.run(e, n);
				return r instanceof Promise ? r.then((e) => fa$1(e, t, n)) : fa$1(r, t, n);
			}
			{
				let r = t.out._zod.run(e, n);
				return r instanceof Promise ? r.then((e) => fa$1(e, t, n)) : fa$1(r, t, n);
			}
		};
	});
	ma$1 = Ge$2(`$ZodPreprocess`, (e, t) => {
		la$1.init(e, t);
	});
	ha$1 = Ge$2(`$ZodReadonly`, (e, t) => {
		M$2.init(e, t), Re$2(e, `propValues`, (e) => e.def.innerType._zod.propValues), Re$2(e, `values`, (e) => e.def.innerType._zod.values), Re$2(e, `optin`, (e) => e.def.innerType?._zod?.optin), Re$2(e, `optout`, (e) => e.def.innerType?._zod?.optout), e._zod.parse = (e, n) => {
			if (n.direction === `backward`) return t.innerType._zod.run(e, n);
			let r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then(ga$1) : ga$1(r);
		};
	});
	ya$1 = Ge$2(`$ZodTemplateLiteral`, (e, t) => {
		M$2.init(e, t);
		let n = [];
		for (let e of t.parts) if (typeof e == `object` && e) {
			let t = va$1(e);
			if (!t) throw Error(`Invalid template literal part, no pattern found: ${[...e._zod.traits].shift()}`);
			n.push(te$1(t));
		} else if (e === null || D$2.has(typeof e)) n.push(O$3(`${e}`));
		else throw Error(`Invalid template literal part: ${e}`);
		e._zod.pattern = RegExp(`^${n.join(``)}$`), e._zod.parse = (n, r) => typeof n.value == `string` ? (e._zod.pattern.lastIndex = 0, e._zod.pattern.test(n.value) || n.issues.push({
			input: n.value,
			inst: e,
			code: `invalid_format`,
			format: t.format ?? `template_literal`,
			pattern: e._zod.pattern.source
		}), n) : (n.issues.push({
			input: n.value,
			inst: e,
			expected: `string`,
			code: `invalid_type`
		}), n);
	});
	ba$1 = Ge$2(`$ZodFunction`, (e, t) => (M$2.init(e, t), Object.defineProperty(e, "_def", { value: t }), e._zod.def = t, e.implement = (t) => {
		if (typeof t != `function`) throw Error(`implement() must be called with a function`);
		return Object.defineProperty(function(...n) {
			let r = e._def.input ? Le$1(e._def.input, n) : n;
			let i = Reflect.apply(t, this, r);
			return e._def.output ? Le$1(e._def.output, i) : i;
		}, "_zod", {
			value: e._zod,
			enumerable: !1
		});
	}, e.implementAsync = (t) => {
		if (typeof t != `function`) throw Error(`implementAsync() must be called with a function`);
		return Object.defineProperty(async function(...n) {
			let r = e._def.input ? await ze$1(e._def.input, n) : n;
			let i = await Reflect.apply(t, this, r);
			return e._def.output ? await ze$1(e._def.output, i) : i;
		}, "_zod", {
			value: e._zod,
			enumerable: !1
		});
	}, e._zod.parse = (t, n) => typeof t.value == `function` ? (t.value = e._def.output && e._def.output._zod.def.type === `promise` ? e.implementAsync(t.value) : e.implement(t.value), t) : (t.issues.push({
		code: `invalid_type`,
		expected: `function`,
		input: t.value,
		inst: e
	}), t), e.input = (...t) => {
		let n = e.constructor;
		return Array.isArray(t[0]) ? new n({
			type: `function`,
			input: new Li({
				type: `tuple`,
				items: t[0],
				rest: t[1]
			}),
			output: e._def.output
		}) : new n({
			type: `function`,
			input: t[0],
			output: e._def.output
		});
	}, e.output = (t) => {
		let n = e.constructor;
		return new n({
			type: `function`,
			input: e._def.input,
			output: t
		});
	}, e));
	xa$1 = Ge$2(`$ZodPromise`, (e, t) => {
		M$2.init(e, t), e._zod.parse = (e, n) => Promise.resolve(e.value).then((e) => t.innerType._zod.run({
			value: e,
			issues: []
		}, n));
	});
	Sa$1 = Ge$2(`$ZodLazy`, (e, t) => {
		M$2.init(e, t), h$1(e._zod, `innerType`, () => {
			let e = t;
			return e._cachedInner ||= t.getter(), e._cachedInner;
		}), Re$2(e, `pattern`, (e) => e.innerType?._zod?.pattern), Re$2(e, `propValues`, (e) => e.innerType?._zod?.propValues), Re$2(e, `optin`, (e) => e.innerType?._zod?.optin ?? void 0), Re$2(e, `optout`, (e) => e.innerType?._zod?.optout ?? void 0), e._zod.parse = (t, n) => e._zod.innerType._zod.run(t, n);
	});
	Ca$1 = Ge$2(`$ZodCustom`, (e, t) => {
		j$2.init(e, t), M$2.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
			let r = n.value;
			let i = t.fn(r);
			if (i instanceof Promise) return i.then((t) => wa$1(t, n, r, e));
			wa$1(i, n, r, e);
		};
	});
	Ta$1 = class extends Error {
		constructor() {
			super(`Cannot parse a reference cycle that closes through a transform`), this.name = `ZodCyclicError`;
		}
	};
	Ea$1 = `~memo`;
	Da$1 = [];
	Aa$1 = new WeakMap();
	Ia$1 = [];
	La$1 = {
		alloc(e, t, n) {
			let r = Fa$1;
			if (!r) return n;
			Fa$1 = void 0;
			let i = {
				value: n,
				issues: null
			};
			return r.set(t.value, i), Ia$1.push(i), n;
		},
		guard(e) {
			var t;
			(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
				let t = e._zod.parse;
				let n = (e, n) => {
					if (n.direction !== `backward` && za$1(n, e.value)) throw new Ta$1();
					return t(e, n);
				};
				e._zod.parse = n, e._zod.run === t && (e._zod.run = n);
			});
		},
		attach(e) {
			var t;
			let n;
			let r = !1;
			let i;
			let a;
			(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
				let t = e._zod.parse;
				let o = (s, c) => {
					if (n === void 0) {
						let i = ja$1(e, new Set(), !1);
						if (i === 0) return e._zod.parse = t, e._zod.run === o && (e._zod.run = t), t(s, c);
						i === 2 || r ? n = !0 : r = !0;
					}
					let l = s.value;
					if (!Oa$1(l)) return t(s, c);
					let u = c[Ea$1];
					u || (u = {
						buckets: new WeakMap(),
						backEdges: void 0
					}, c[Ea$1] = u);
					let d;
					i === c ? d = a : (d = Pa$1(u, e), i = c, a = d);
					let f = d.get(l);
					if (f) return s.value = f.value, f.issues ? f.issues.length && s.issues.push(...ka$1(f.issues)) : (s.memo = !0, u.backEdges ?? (u.backEdges = new WeakSet()), u.backEdges.add(f.value)), s;
					Fa$1 = d;
					let p = Ia$1.length;
					let m = t(s, c);
					Fa$1 = void 0;
					let h = Ia$1.length > p ? Ia$1.pop() : void 0;
					return m instanceof Promise ? m.then((e) => (h && (h.issues = e.issues.length ? ka$1(e.issues) : Da$1), e)) : (h && (h.issues = m.issues.length ? ka$1(m.issues) : Da$1), m);
				};
				e._zod.parse = o, e._zod.run === t && (e._zod.run = o);
			});
		}
	};
	Ba$1 = () => {
		let e = {
			string: {
				unit: `حرف`,
				verb: `أن يحوي`
			},
			file: {
				unit: `بايت`,
				verb: `أن يحوي`
			},
			array: {
				unit: `عنصر`,
				verb: `أن يحوي`
			},
			set: {
				unit: `عنصر`,
				verb: `أن يحوي`
			},
			map: {
				unit: `عنصر`,
				verb: `أن يحوي`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `مدخل`,
			email: `بريد إلكتروني`,
			url: `رابط`,
			emoji: `إيموجي`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `تاريخ ووقت بمعيار ISO`,
			date: `تاريخ بمعيار ISO`,
			time: `وقت بمعيار ISO`,
			duration: `مدة بمعيار ISO`,
			ipv4: `عنوان IPv4`,
			ipv6: `عنوان IPv6`,
			mac: `عنوان MAC`,
			cidrv4: `مدى عناوين بصيغة IPv4`,
			cidrv6: `مدى عناوين بصيغة IPv6`,
			base64: `نَص بترميز base64-encoded`,
			base64url: `نَص بترميز base64url-encoded`,
			json_string: `نَص على هيئة JSON`,
			e164: `رقم هاتف بمعيار E.164`,
			credit_card: `رقم بطاقة الائتمان`,
			currency_code: `رمز العملة`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `مدخل`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `مدخلات غير مقبولة: يفترض إدخال instanceof ${e.expected}، ولكن تم إدخال ${i}` : `مدخلات غير مقبولة: يفترض إدخال ${t}، ولكن تم إدخال ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `مدخلات غير مقبولة: يفترض إدخال ${j$3(e.values[0])}` : `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? ` أكبر من اللازم: يفترض أن تكون ${e.origin ?? `القيمة`} ${n} ${e.maximum.toString()} ${r.unit ?? `عنصر`}` : `أكبر من اللازم: يفترض أن تكون ${e.origin ?? `القيمة`} ${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `أصغر من اللازم: يفترض لـ ${e.origin} أن يكون ${n} ${e.minimum.toString()} ${r.unit}` : `أصغر من اللازم: يفترض لـ ${e.origin} أن يكون ${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `نَص غير مقبول: يجب أن يبدأ بـ "${e.prefix}"` : t.format === `ends_with` ? `نَص غير مقبول: يجب أن ينتهي بـ "${t.suffix}"` : t.format === `includes` ? `نَص غير مقبول: يجب أن يتضمَّن "${t.includes}"` : t.format === `regex` ? `نَص غير مقبول: يجب أن يطابق النمط ${t.pattern}` : `${n[t.format] ?? e.format} غير مقبول`;
				}
				case `not_multiple_of`: return `رقم غير مقبول: يجب أن يكون من مضاعفات ${e.divisor}`;
				case `unrecognized_keys`: return `معرف${e.keys.length > 1 ? `ات` : ``} غريب${e.keys.length > 1 ? `ة` : ``}: ${l$3(e.keys, `، `)}`;
				case `invalid_key`: return `معرف غير مقبول في ${e.origin}`;
				case `invalid_union`: return `مدخل غير مقبول`;
				case `invalid_element`: return `مدخل غير مقبول في ${e.origin}`;
				default: return `مدخل غير مقبول`;
			}
		};
	};
	Ha$1 = () => {
		let e = {
			string: {
				unit: `simvol`,
				verb: `olmalıdır`
			},
			file: {
				unit: `bayt`,
				verb: `olmalıdır`
			},
			array: {
				unit: `element`,
				verb: `olmalıdır`
			},
			set: {
				unit: `element`,
				verb: `olmalıdır`
			},
			map: {
				unit: `element`,
				verb: `olmalıdır`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `email address`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO datetime`,
			date: `ISO date`,
			time: `ISO time`,
			duration: `ISO duration`,
			ipv4: `IPv4 address`,
			ipv6: `IPv6 address`,
			mac: `MAC address`,
			cidrv4: `IPv4 range`,
			cidrv6: `IPv6 range`,
			base64: `base64-encoded string`,
			base64url: `base64url-encoded string`,
			json_string: `JSON string`,
			e164: `E.164 number`,
			credit_card: `kredit kartı nömrəsi`,
			currency_code: `valyuta kodu`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Yanlış dəyər: gözlənilən instanceof ${e.expected}, daxil olan ${i}` : `Yanlış dəyər: gözlənilən ${t}, daxil olan ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Yanlış dəyər: gözlənilən ${j$3(e.values[0])}` : `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Çox böyük: gözlənilən ${e.origin ?? `dəyər`} ${n}${e.maximum.toString()} ${r.unit ?? `element`}` : `Çox böyük: gözlənilən ${e.origin ?? `dəyər`} ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Çox kiçik: gözlənilən ${e.origin} ${n}${e.minimum.toString()} ${r.unit}` : `Çox kiçik: gözlənilən ${e.origin} ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Yanlış mətn: "${t.prefix}" ilə başlamalıdır` : t.format === `ends_with` ? `Yanlış mətn: "${t.suffix}" ilə bitməlidir` : t.format === `includes` ? `Yanlış mətn: "${t.includes}" daxil olmalıdır` : t.format === `regex` ? `Yanlış mətn: ${t.pattern} şablonuna uyğun olmalıdır` : `Yanlış ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Yanlış ədəd: ${e.divisor} ilə bölünə bilən olmalıdır`;
				case `unrecognized_keys`: return `Tanınmayan açar${e.keys.length > 1 ? `lar` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} daxilində yanlış açar`;
				case `invalid_union`: return `Yanlış dəyər`;
				case `invalid_element`: return `${e.origin} daxilində yanlış dəyər`;
				default: return `Yanlış dəyər`;
			}
		};
	};
	Ga$1 = () => {
		let e = {
			string: {
				unit: {
					one: `сімвал`,
					few: `сімвалы`,
					many: `сімвалаў`
				},
				verb: `мець`
			},
			array: {
				unit: {
					one: `элемент`,
					few: `элементы`,
					many: `элементаў`
				},
				verb: `мець`
			},
			set: {
				unit: {
					one: `элемент`,
					few: `элементы`,
					many: `элементаў`
				},
				verb: `мець`
			},
			map: {
				unit: {
					one: `элемент`,
					few: `элементы`,
					many: `элементаў`
				},
				verb: `мець`
			},
			file: {
				unit: {
					one: `байт`,
					few: `байты`,
					many: `байтаў`
				},
				verb: `мець`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `увод`,
			email: `email адрас`,
			url: `URL`,
			emoji: `эмодзі`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO дата і час`,
			date: `ISO дата`,
			time: `ISO час`,
			duration: `ISO працягласць`,
			ipv4: `IPv4 адрас`,
			ipv6: `IPv6 адрас`,
			mac: `MAC адрас`,
			cidrv4: `IPv4 дыяпазон`,
			cidrv6: `IPv6 дыяпазон`,
			base64: `радок у фармаце base64`,
			base64url: `радок у фармаце base64url`,
			json_string: `JSON радок`,
			e164: `нумар E.164`,
			credit_card: `нумар крэдытнай карты`,
			currency_code: `код валюты`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `увод`
		};
		let r = {
			nan: `NaN`,
			number: `лік`,
			array: `масіў`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Няправільны ўвод: чакаўся instanceof ${e.expected}, атрымана ${i}` : `Няправільны ўвод: чакаўся ${t}, атрымана ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Няправільны ўвод: чакалася ${j$3(e.values[0])}` : `Няправільны варыянт: чакаўся адзін з ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					if (r) {
						let t = Wa$1(Number(e.maximum), r.unit.one, r.unit.few, r.unit.many);
						return `Занадта вялікі: чакалася, што ${e.origin ?? `значэнне`} павінна ${r.verb} ${n}${e.maximum.toString()} ${t}`;
					}
					return `Занадта вялікі: чакалася, што ${e.origin ?? `значэнне`} павінна быць ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					if (r) {
						let t = Wa$1(Number(e.minimum), r.unit.one, r.unit.few, r.unit.many);
						return `Занадта малы: чакалася, што ${e.origin} павінна ${r.verb} ${n}${e.minimum.toString()} ${t}`;
					}
					return `Занадта малы: чакалася, што ${e.origin} павінна быць ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Няправільны радок: павінен пачынацца з "${t.prefix}"` : t.format === `ends_with` ? `Няправільны радок: павінен заканчвацца на "${t.suffix}"` : t.format === `includes` ? `Няправільны радок: павінен змяшчаць "${t.includes}"` : t.format === `regex` ? `Няправільны радок: павінен адпавядаць шаблону ${t.pattern}` : `Няправільны ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Няправільны лік: павінен быць кратным ${e.divisor}`;
				case `unrecognized_keys`: return `Нераспазнаны ${e.keys.length > 1 ? `ключы` : `ключ`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Няправільны ключ у ${e.origin}`;
				case `invalid_union`: return `Няправільны ўвод`;
				case `invalid_element`: return `Няправільнае значэнне ў ${e.origin}`;
				default: return `Няправільны ўвод`;
			}
		};
	};
	qa$1 = () => {
		let e = {
			string: {
				unit: `символа`,
				verb: `да съдържа`
			},
			file: {
				unit: `байта`,
				verb: `да съдържа`
			},
			array: {
				unit: `елемента`,
				verb: `да съдържа`
			},
			set: {
				unit: `елемента`,
				verb: `да съдържа`
			},
			map: {
				unit: `елемента`,
				verb: `да съдържа`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `вход`,
			email: `имейл адрес`,
			url: `URL`,
			emoji: `емоджи`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO време`,
			date: `ISO дата`,
			time: `ISO време`,
			duration: `ISO продължителност`,
			ipv4: `IPv4 адрес`,
			ipv6: `IPv6 адрес`,
			mac: `MAC адрес`,
			cidrv4: `IPv4 диапазон`,
			cidrv6: `IPv6 диапазон`,
			base64: `base64-кодиран низ`,
			base64url: `base64url-кодиран низ`,
			json_string: `JSON низ`,
			e164: `E.164 номер`,
			credit_card: `номер на кредитна карта`,
			currency_code: `код на валута`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `вход`
		};
		let r = {
			nan: `NaN`,
			number: `число`,
			array: `масив`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Невалиден вход: очакван instanceof ${e.expected}, получен ${i}` : `Невалиден вход: очакван ${t}, получен ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Невалиден вход: очакван ${j$3(e.values[0])}` : `Невалидна опция: очаквано едно от ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Твърде голямо: очаква се ${e.origin ?? `стойност`} да съдържа ${n}${e.maximum.toString()} ${r.unit ?? `елемента`}` : `Твърде голямо: очаква се ${e.origin ?? `стойност`} да бъде ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Твърде малко: очаква се ${e.origin} да съдържа ${n}${e.minimum.toString()} ${r.unit}` : `Твърде малко: очаква се ${e.origin} да бъде ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					if (t.format === `starts_with`) return `Невалиден низ: трябва да започва с "${t.prefix}"`;
					if (t.format === `ends_with`) return `Невалиден низ: трябва да завършва с "${t.suffix}"`;
					if (t.format === `includes`) return `Невалиден низ: трябва да включва "${t.includes}"`;
					if (t.format === `regex`) return `Невалиден низ: трябва да съвпада с ${t.pattern}`;
					let r = `Невалиден`;
					return t.format === `emoji` && (r = `Невалидно`), t.format === `datetime` && (r = `Невалидно`), t.format === `date` && (r = `Невалидна`), t.format === `time` && (r = `Невалидно`), t.format === `duration` && (r = `Невалидна`), `${r} ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Невалидно число: трябва да бъде кратно на ${e.divisor}`;
				case `unrecognized_keys`: return `Неразпознат${e.keys.length > 1 ? `и` : ``} ключ${e.keys.length > 1 ? `ове` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Невалиден ключ в ${e.origin}`;
				case `invalid_union`: return `Невалиден вход`;
				case `invalid_element`: return `Невалидна стойност в ${e.origin}`;
				default: return `Невалиден вход`;
			}
		};
	};
	Ya$1 = () => {
		let e = {
			string: {
				unit: `অক্ষর`,
				verb: `থাকতে হবে`
			},
			file: {
				unit: `বাইট`,
				verb: `থাকতে হবে`
			},
			array: {
				unit: `আইটেম`,
				verb: `থাকতে হবে`
			},
			set: {
				unit: `আইটেম`,
				verb: `থাকতে হবে`
			},
			map: {
				unit: `এন্ট্রি`,
				verb: `থাকতে হবে`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ইনপুট`,
			email: `ইমেইল ঠিকানা`,
			url: `URL`,
			emoji: `ইমোজি`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO তারিখ ও সময়`,
			date: `ISO তারিখ`,
			time: `ISO সময়`,
			duration: `ISO সময়কাল`,
			ipv4: `IPv4 ঠিকানা`,
			ipv6: `IPv6 ঠিকানা`,
			mac: `MAC ঠিকানা`,
			cidrv4: `IPv4 রেঞ্জ`,
			cidrv6: `IPv6 রেঞ্জ`,
			base64: `base64-এনকোডেড স্ট্রিং`,
			base64url: `base64url-এনকোডেড স্ট্রিং`,
			json_string: `JSON স্ট্রিং`,
			e164: `E.164 নম্বর`,
			credit_card: `ক্রেডিট কার্ড নম্বর`,
			currency_code: `মুদ্রা কোড`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ইনপুট`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `অবৈধ ইনপুট: প্রত্যাশিত ${t}, প্রাপ্ত ${r[n] ?? n}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `অবৈধ ইনপুট: প্রত্যাশিত ${j$3(e.values[0])}` : `অবৈধ অপশন: ${l$3(e.values, ` | `)} এর মধ্যে একটি প্রত্যাশিত`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `অনেক বড়: ${e.origin ?? `মান`} ${n}${e.maximum.toString()} ${r.unit ?? `এলিমেন্ট`} হতে হবে` : `অনেক বড়: ${e.origin ?? `মান`} ${n}${e.maximum.toString()} হতে হবে`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `অনেক ছোট: ${e.origin} ${n}${e.minimum.toString()} ${r.unit} হতে হবে` : `অনেক ছোট: ${e.origin} ${n}${e.minimum.toString()} হতে হবে`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `অবৈধ স্ট্রিং: "${t.prefix}" দিয়ে শুরু হতে হবে` : t.format === `ends_with` ? `অবৈধ স্ট্রিং: "${t.suffix}" দিয়ে শেষ হতে হবে` : t.format === `includes` ? `অবৈধ স্ট্রিং: "${t.includes}" অন্তর্ভুক্ত থাকতে হবে` : t.format === `regex` ? `অবৈধ স্ট্রিং: ${t.pattern} প্যাটার্ন মিলতে হবে` : `অবৈধ ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `অবৈধ নম্বর: ${e.divisor} এর গুণিতক হতে হবে`;
				case `unrecognized_keys`: return `অচেনা কী${e.keys.length > 1 ? `গুলো` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} এ অবৈধ কী`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `অবৈধ ডিসক্রিমিনেটর মান। প্রত্যাশিত ${e.options.map((e) => `'${e}'`).join(` | `)}` : `অবৈধ ইনপুট`;
				case `invalid_element`: return `${e.origin} এ অবৈধ মান`;
				default: return `অবৈধ ইনপুট`;
			}
		};
	};
	Za$1 = () => {
		let e = {
			string: {
				unit: `caràcters`,
				verb: `contenir`
			},
			file: {
				unit: `bytes`,
				verb: `contenir`
			},
			array: {
				unit: `elements`,
				verb: `contenir`
			},
			set: {
				unit: `elements`,
				verb: `contenir`
			},
			map: {
				unit: `elements`,
				verb: `contenir`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `entrada`,
			email: `adreça electrònica`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `data i hora ISO`,
			date: `data ISO`,
			time: `hora ISO`,
			duration: `durada ISO`,
			ipv4: `adreça IPv4`,
			ipv6: `adreça IPv6`,
			mac: `adreça MAC`,
			cidrv4: `rang IPv4`,
			cidrv6: `rang IPv6`,
			base64: `cadena codificada en base64`,
			base64url: `cadena codificada en base64url`,
			json_string: `cadena JSON`,
			e164: `número E.164`,
			credit_card: `número de targeta de crèdit`,
			currency_code: `codi de moneda`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `entrada`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Tipus invàlid: s'esperava instanceof ${e.expected}, s'ha rebut ${i}` : `Tipus invàlid: s'esperava ${t}, s'ha rebut ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Valor invàlid: s'esperava ${j$3(e.values[0])}` : `Opció invàlida: s'esperava una de ${l$3(e.values, ` o `)}`;
				case `too_big`: {
					let n = e.inclusive ? `com a màxim` : `menys de`;
					let r = t(e.origin);
					return r ? `Massa gran: s'esperava que ${e.origin ?? `el valor`} contingués ${n} ${e.maximum.toString()} ${r.unit ?? `elements`}` : `Massa gran: s'esperava que ${e.origin ?? `el valor`} fos ${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `com a mínim` : `més de`;
					let r = t(e.origin);
					return r ? `Massa petit: s'esperava que ${e.origin} contingués ${n} ${e.minimum.toString()} ${r.unit}` : `Massa petit: s'esperava que ${e.origin} fos ${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Format invàlid: ha de començar amb "${t.prefix}"` : t.format === `ends_with` ? `Format invàlid: ha d'acabar amb "${t.suffix}"` : t.format === `includes` ? `Format invàlid: ha d'incloure "${t.includes}"` : t.format === `regex` ? `Format invàlid: ha de coincidir amb el patró ${t.pattern}` : `Format invàlid per a ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Número invàlid: ha de ser múltiple de ${e.divisor}`;
				case `unrecognized_keys`: return `Clau${e.keys.length > 1 ? `s` : ``} no reconeguda${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Clau invàlida a ${e.origin}`;
				case `invalid_union`: return `Entrada invàlida`;
				case `invalid_element`: return `Element invàlid a ${e.origin}`;
				default: return `Entrada invàlida`;
			}
		};
	};
	$a$1 = () => {
		let e = {
			string: {
				unit: `پیت`,
				verb: `بێت`
			},
			file: {
				unit: `بایت`,
				verb: `بێت`
			},
			array: {
				unit: `دانە`,
				verb: `بێت`
			},
			set: {
				unit: `دانە`,
				verb: `بێت`
			},
			map: {
				unit: `دانە`,
				verb: `بێت`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `regex`,
			email: `ئیمەیڵ`,
			url: `بەستەر (URL)`,
			emoji: `ئیمۆجی`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ڕێکەوت و کات`,
			date: `ڕێکەوت`,
			time: `کات`,
			duration: `ماوە`,
			ipv4: `ناونیشانی IPv4`,
			ipv6: `ناونیشانی IPv6`,
			mac: `ناونیشانی MAC`,
			cidrv4: `مەودای IPv4`,
			cidrv6: `مەودای IPv6`,
			base64: `دەقی base64`,
			base64url: `دەقی base64url`,
			json_string: `دەقی JSON`,
			e164: `ژمارەی E.164`,
			credit_card: `ژمارەی کارتی کرێدیت`,
			currency_code: `کۆدی دراو`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `تێکردە`
		};
		let r = {
			nan: `NaN`,
			string: `نووسین`,
			number: `ژمارە`,
			boolean: `boolean`,
			array: `array`,
			object: `object`,
			date: `ڕێکەوت`,
			integer: `ژمارە`,
			float: `ژمارە`,
			null: `null`,
			undefined: `undefined`,
			function: `function`,
			symbol: `symbol`,
			unknown: `unknown`,
			promise: `promise`,
			void: `void`,
			never: `never`,
			map: `map`,
			set: `set`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					let a = [
						`ا`,
						`و`,
						`ۆ`,
						`وو`,
						`ە`,
						`ی`,
						`ێ`
					].some((e) => i.endsWith(e)) ? `یە` : `ە`;
					let o = /^[a-zA-Z]+$/.test(i);
					return n === `null` || n === `undefined` ? `داواکراوە` : `چاوەڕوانکراوە ${t} بێت، بەڵام ${i}${o ? `` : a}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `بەهاکە نادرووستە: چاوەڕوانکراوە ${j$3(e.values[0])} بێت` : `هەڵبژاردەی نادروست: چاوەڕوانکراوە یەکێک بێت لە ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = t(e.origin);
					return n ? `پێویستە بە لایەنی زۆرەوە ${e.maximum.toString()} ${n.unit} ${n.verb}` : `پێویستە بە لایەنی زۆرەوە ${e.maximum.toString()} بێت`;
				}
				case `too_small`: {
					let n = t(e.origin);
					return n ? `پێویستە بە لایەنی کەمەوە ${e.minimum.toString()} ${n.unit} ${n.verb}` : `پێویستە بە لایەنی کەمەوە ${e.minimum.toString()} بێت`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `دەقی نادروست: پێویستە دەستپێبکات بە "${t.prefix}"` : t.format === `ends_with` ? `دەقی نادروست: پێویستە کۆتاییبێت بە "${t.suffix}"` : t.format === `includes` ? `دەقی نادروست: پێویستە "${t.includes}" لەخۆبگرێت` : t.format === `regex` ? `دەقی نادروست: پێویستە لەگەڵ پاتێرنی ${t.pattern} بگونجێت` : `بەهای ${n[t.format] ?? e.format} نادروستە`;
				}
				case `not_multiple_of`: return `ژمارەی نادروست: دەبێت چەند هێندە بێت بۆ ${e.divisor}`;
				case `unrecognized_keys`: return `کلیلی نەناسراو: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `کلیلی نادروست لە ${e.origin}`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `بەهای نەناسراو هەیە. بەهای چاوەڕوانکراو: ${e.options.map((e) => `'${e}'`).join(` | `)}` : `یەکگرتنی نادروست`;
				case `invalid_element`: return `${e.origin} بەهاکە نادروستە`;
				default: return `تێکردەی نادروست`;
			}
		};
	};
	to$1 = () => {
		let e = {
			string: {
				unit: `znaků`,
				verb: `mít`
			},
			file: {
				unit: `bajtů`,
				verb: `mít`
			},
			array: {
				unit: `prvků`,
				verb: `mít`
			},
			set: {
				unit: `prvků`,
				verb: `mít`
			},
			map: {
				unit: `prvků`,
				verb: `mít`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `regulární výraz`,
			email: `e-mailová adresa`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `datum a čas ve formátu ISO`,
			date: `datum ve formátu ISO`,
			time: `čas ve formátu ISO`,
			duration: `doba trvání ISO`,
			ipv4: `IPv4 adresa`,
			ipv6: `IPv6 adresa`,
			mac: `MAC adresa`,
			cidrv4: `rozsah IPv4`,
			cidrv6: `rozsah IPv6`,
			base64: `řetězec zakódovaný ve formátu base64`,
			base64url: `řetězec zakódovaný ve formátu base64url`,
			json_string: `řetězec ve formátu JSON`,
			e164: `číslo E.164`,
			credit_card: `číslo kreditní karty`,
			currency_code: `kód měny`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `vstup`
		};
		let r = {
			nan: `NaN`,
			number: `číslo`,
			string: `řetězec`,
			function: `funkce`,
			array: `pole`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Neplatný vstup: očekáváno instanceof ${e.expected}, obdrženo ${i}` : `Neplatný vstup: očekáváno ${t}, obdrženo ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Neplatný vstup: očekáváno ${j$3(e.values[0])}` : `Neplatná možnost: očekávána jedna z hodnot ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Hodnota je příliš velká: ${e.origin ?? `hodnota`} musí mít ${n}${e.maximum.toString()} ${r.unit ?? `prvků`}` : `Hodnota je příliš velká: ${e.origin ?? `hodnota`} musí být ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Hodnota je příliš malá: ${e.origin ?? `hodnota`} musí mít ${n}${e.minimum.toString()} ${r.unit ?? `prvků`}` : `Hodnota je příliš malá: ${e.origin ?? `hodnota`} musí být ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Neplatný řetězec: musí začínat na "${t.prefix}"` : t.format === `ends_with` ? `Neplatný řetězec: musí končit na "${t.suffix}"` : t.format === `includes` ? `Neplatný řetězec: musí obsahovat "${t.includes}"` : t.format === `regex` ? `Neplatný řetězec: musí odpovídat vzoru ${t.pattern}` : `Neplatný formát ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Neplatné číslo: musí být násobkem ${e.divisor}`;
				case `unrecognized_keys`: return `Neznámé klíče: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Neplatný klíč v ${e.origin}`;
				case `invalid_union`: return `Neplatný vstup`;
				case `invalid_element`: return `Neplatná hodnota v ${e.origin}`;
				default: return `Neplatný vstup`;
			}
		};
	};
	ro$1 = () => {
		let e = {
			string: {
				unit: `tegn`,
				verb: `havde`
			},
			file: {
				unit: `bytes`,
				verb: `havde`
			},
			array: {
				unit: `elementer`,
				verb: `indeholdt`
			},
			set: {
				unit: `elementer`,
				verb: `indeholdt`
			},
			map: {
				unit: `elementer`,
				verb: `indeholdt`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `e-mailadresse`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO dato- og klokkeslæt`,
			date: `ISO-dato`,
			time: `ISO-klokkeslæt`,
			duration: `ISO-varighed`,
			ipv4: `IPv4-adresse`,
			ipv6: `IPv6-adresse`,
			mac: `MAC-adresse`,
			cidrv4: `IPv4-spektrum`,
			cidrv6: `IPv6-spektrum`,
			base64: `base64-kodet streng`,
			base64url: `base64url-kodet streng`,
			json_string: `JSON-streng`,
			e164: `E.164-nummer`,
			credit_card: `kreditkortnummer`,
			currency_code: `valutakode`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = {
			nan: `NaN`,
			string: `streng`,
			number: `tal`,
			boolean: `boolean`,
			array: `liste`,
			object: `objekt`,
			set: `sæt`,
			file: `fil`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Ugyldigt input: forventede instanceof ${e.expected}, fik ${i}` : `Ugyldigt input: forventede ${t}, fik ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Ugyldig værdi: forventede ${j$3(e.values[0])}` : `Ugyldigt valg: forventede en af følgende ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let i = t(e.origin);
					let a = r[e.origin] ?? e.origin;
					return i ? `For stor: forventede ${a ?? `value`} ${i.verb} ${n} ${e.maximum.toString()} ${i.unit ?? `elementer`}` : `For stor: forventede ${a ?? `value`} havde ${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let i = t(e.origin);
					let a = r[e.origin] ?? e.origin;
					return i ? `For lille: forventede ${a} ${i.verb} ${n} ${e.minimum.toString()} ${i.unit}` : `For lille: forventede ${a} havde ${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ugyldig streng: skal starte med "${t.prefix}"` : t.format === `ends_with` ? `Ugyldig streng: skal ende med "${t.suffix}"` : t.format === `includes` ? `Ugyldig streng: skal indeholde "${t.includes}"` : t.format === `regex` ? `Ugyldig streng: skal matche mønsteret ${t.pattern}` : `Ugyldig ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Ugyldigt tal: skal være deleligt med ${e.divisor}`;
				case `unrecognized_keys`: return `${e.keys.length > 1 ? `Ukendte nøgler` : `Ukendt nøgle`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Ugyldig nøgle i ${e.origin}`;
				case `invalid_union`: return `Ugyldigt input: matcher ingen af de tilladte typer`;
				case `invalid_element`: return `Ugyldig værdi i ${e.origin}`;
				default: return `Ugyldigt input`;
			}
		};
	};
	ao$1 = () => {
		let e = {
			string: {
				unit: `Zeichen`,
				verb: `zu haben`
			},
			file: {
				unit: `Bytes`,
				verb: `zu haben`
			},
			array: {
				unit: `Elemente`,
				verb: `zu haben`
			},
			set: {
				unit: `Elemente`,
				verb: `zu haben`
			},
			map: {
				unit: `Elemente`,
				verb: `zu haben`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `Eingabe`,
			email: `E-Mail-Adresse`,
			url: `URL`,
			emoji: `Emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO-Datum und -Uhrzeit`,
			date: `ISO-Datum`,
			time: `ISO-Uhrzeit`,
			duration: `ISO-Dauer`,
			ipv4: `IPv4-Adresse`,
			ipv6: `IPv6-Adresse`,
			mac: `MAC-Adresse`,
			cidrv4: `IPv4-Bereich`,
			cidrv6: `IPv6-Bereich`,
			base64: `Base64-codierter String`,
			base64url: `Base64-URL-codierter String`,
			json_string: `JSON-String`,
			e164: `E.164-Nummer`,
			credit_card: `Kreditkartennummer`,
			currency_code: `Währungscode`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `Eingabe`
		};
		let r = {
			nan: `NaN`,
			number: `Zahl`,
			array: `Array`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Ungültige Eingabe: erwartet instanceof ${e.expected}, erhalten ${i}` : `Ungültige Eingabe: erwartet ${t}, erhalten ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Ungültige Eingabe: erwartet ${j$3(e.values[0])}` : `Ungültige Option: erwartet eine von ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Zu groß: erwartet, dass ${e.origin ?? `Wert`} ${n}${e.maximum.toString()} ${r.unit ?? `Elemente`} hat` : `Zu groß: erwartet, dass ${e.origin ?? `Wert`} ${n}${e.maximum.toString()} ist`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Zu klein: erwartet, dass ${e.origin} ${n}${e.minimum.toString()} ${r.unit} hat` : `Zu klein: erwartet, dass ${e.origin} ${n}${e.minimum.toString()} ist`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ungültiger String: muss mit "${t.prefix}" beginnen` : t.format === `ends_with` ? `Ungültiger String: muss mit "${t.suffix}" enden` : t.format === `includes` ? `Ungültiger String: muss "${t.includes}" enthalten` : t.format === `regex` ? `Ungültiger String: muss dem Muster ${t.pattern} entsprechen` : `Ungültig: ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Ungültige Zahl: muss ein Vielfaches von ${e.divisor} sein`;
				case `unrecognized_keys`: return `${e.keys.length > 1 ? `Unbekannte Schlüssel` : `Unbekannter Schlüssel`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Ungültiger Schlüssel in ${e.origin}`;
				case `invalid_union`: return `Ungültige Eingabe`;
				case `invalid_element`: return `Ungültiger Wert in ${e.origin}`;
				default: return `Ungültige Eingabe`;
			}
		};
	};
	so$1 = () => {
		let e = {
			string: {
				unit: `χαρακτήρες`,
				verb: `να έχει`
			},
			file: {
				unit: `bytes`,
				verb: `να έχει`
			},
			array: {
				unit: `στοιχεία`,
				verb: `να έχει`
			},
			set: {
				unit: `στοιχεία`,
				verb: `να έχει`
			},
			map: {
				unit: `καταχωρήσεις`,
				verb: `να έχει`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `είσοδος`,
			email: `διεύθυνση email`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO ημερομηνία και ώρα`,
			date: `ISO ημερομηνία`,
			time: `ISO ώρα`,
			duration: `ISO διάρκεια`,
			ipv4: `διεύθυνση IPv4`,
			ipv6: `διεύθυνση IPv6`,
			mac: `διεύθυνση MAC`,
			cidrv4: `εύρος IPv4`,
			cidrv6: `εύρος IPv6`,
			base64: `συμβολοσειρά κωδικοποιημένη σε base64`,
			base64url: `συμβολοσειρά κωδικοποιημένη σε base64url`,
			json_string: `συμβολοσειρά JSON`,
			e164: `αριθμός E.164`,
			credit_card: `αριθμός πιστωτικής κάρτας`,
			currency_code: `κωδικός νομίσματος`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `είσοδος`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return typeof e.expected == `string` && /^[A-Z]/.test(e.expected) ? `Μη έγκυρη είσοδος: αναμενόταν instanceof ${e.expected}, λήφθηκε ${i}` : `Μη έγκυρη είσοδος: αναμενόταν ${t}, λήφθηκε ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Μη έγκυρη είσοδος: αναμενόταν ${j$3(e.values[0])}` : `Μη έγκυρη επιλογή: αναμενόταν ένα από ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Πολύ μεγάλο: αναμενόταν ${e.origin ?? `τιμή`} να έχει ${n}${e.maximum.toString()} ${r.unit ?? `στοιχεία`}` : `Πολύ μεγάλο: αναμενόταν ${e.origin ?? `τιμή`} να είναι ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Πολύ μικρό: αναμενόταν ${e.origin} να έχει ${n}${e.minimum.toString()} ${r.unit}` : `Πολύ μικρό: αναμενόταν ${e.origin} να είναι ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Μη έγκυρη συμβολοσειρά: πρέπει να ξεκινά με "${t.prefix}"` : t.format === `ends_with` ? `Μη έγκυρη συμβολοσειρά: πρέπει να τελειώνει με "${t.suffix}"` : t.format === `includes` ? `Μη έγκυρη συμβολοσειρά: πρέπει να περιέχει "${t.includes}"` : t.format === `regex` ? `Μη έγκυρη συμβολοσειρά: πρέπει να ταιριάζει με το μοτίβο ${t.pattern}` : `Μη έγκυρο: ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Μη έγκυρος αριθμός: πρέπει να είναι πολλαπλάσιο του ${e.divisor}`;
				case `unrecognized_keys`: return `Άγνωστ${e.keys.length > 1 ? `α` : `ο`} κλειδ${e.keys.length > 1 ? `ιά` : `ί`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Μη έγκυρο κλειδί στο ${e.origin}`;
				case `invalid_union`: return `Μη έγκυρη είσοδος`;
				case `invalid_element`: return `Μη έγκυρη τιμή στο ${e.origin}`;
				default: return `Μη έγκυρη είσοδος`;
			}
		};
	};
	lo$1 = () => {
		let e = {
			string: {
				unit: `karaktrojn`,
				verb: `havi`
			},
			file: {
				unit: `bajtojn`,
				verb: `havi`
			},
			array: {
				unit: `elementojn`,
				verb: `havi`
			},
			set: {
				unit: `elementojn`,
				verb: `havi`
			},
			map: {
				unit: `elementojn`,
				verb: `havi`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `enigo`,
			email: `retadreso`,
			url: `URL`,
			emoji: `emoĝio`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO-datotempo`,
			date: `ISO-dato`,
			time: `ISO-tempo`,
			duration: `ISO-daŭro`,
			ipv4: `IPv4-adreso`,
			ipv6: `IPv6-adreso`,
			mac: `MAC-adreso`,
			cidrv4: `IPv4-rango`,
			cidrv6: `IPv6-rango`,
			base64: `64-ume kodita karaktraro`,
			base64url: `URL-64-ume kodita karaktraro`,
			json_string: `JSON-karaktraro`,
			e164: `E.164-nombro`,
			credit_card: `kreditkarta numero`,
			currency_code: `valuta kodo`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `enigo`
		};
		let r = {
			nan: `NaN`,
			number: `nombro`,
			array: `tabelo`,
			null: `senvalora`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Nevalida enigo: atendiĝis instanceof ${e.expected}, riceviĝis ${i}` : `Nevalida enigo: atendiĝis ${t}, riceviĝis ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Nevalida enigo: atendiĝis ${j$3(e.values[0])}` : `Nevalida opcio: atendiĝis unu el ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Tro granda: atendiĝis ke ${e.origin ?? `valoro`} havu ${n}${e.maximum.toString()} ${r.unit ?? `elementojn`}` : `Tro granda: atendiĝis ke ${e.origin ?? `valoro`} havu ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Tro malgranda: atendiĝis ke ${e.origin} havu ${n}${e.minimum.toString()} ${r.unit}` : `Tro malgranda: atendiĝis ke ${e.origin} estu ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Nevalida karaktraro: devas komenciĝi per "${t.prefix}"` : t.format === `ends_with` ? `Nevalida karaktraro: devas finiĝi per "${t.suffix}"` : t.format === `includes` ? `Nevalida karaktraro: devas inkluzivi "${t.includes}"` : t.format === `regex` ? `Nevalida karaktraro: devas kongrui kun la modelo ${t.pattern}` : `Nevalida ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Nevalida nombro: devas esti oblo de ${e.divisor}`;
				case `unrecognized_keys`: return `Nekonata${e.keys.length > 1 ? `j` : ``} ŝlosilo${e.keys.length > 1 ? `j` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Nevalida ŝlosilo en ${e.origin}`;
				case `invalid_union`: return `Nevalida enigo`;
				case `invalid_element`: return `Nevalida valoro en ${e.origin}`;
				default: return `Nevalida enigo`;
			}
		};
	};
	fo$1 = () => {
		let e = {
			string: {
				unit: `caracteres`,
				verb: `tener`
			},
			file: {
				unit: `bytes`,
				verb: `tener`
			},
			array: {
				unit: `elementos`,
				verb: `tener`
			},
			set: {
				unit: `elementos`,
				verb: `tener`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `entrada`,
			email: `dirección de correo electrónico`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `fecha y hora ISO`,
			date: `fecha ISO`,
			time: `hora ISO`,
			duration: `duración ISO`,
			ipv4: `dirección IPv4`,
			ipv6: `dirección IPv6`,
			mac: `dirección MAC`,
			cidrv4: `rango IPv4`,
			cidrv6: `rango IPv6`,
			base64: `cadena codificada en base64`,
			base64url: `URL codificada en base64`,
			json_string: `cadena JSON`,
			e164: `número E.164`,
			credit_card: `número de tarjeta de crédito`,
			currency_code: `código de moneda`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `entrada`
		};
		let r = {
			nan: `NaN`,
			string: `texto`,
			number: `número`,
			boolean: `booleano`,
			array: `arreglo`,
			object: `objeto`,
			set: `conjunto`,
			file: `archivo`,
			date: `fecha`,
			bigint: `número grande`,
			symbol: `símbolo`,
			undefined: `indefinido`,
			null: `nulo`,
			function: `función`,
			map: `mapa`,
			record: `registro`,
			tuple: `tupla`,
			enum: `enumeración`,
			union: `unión`,
			literal: `literal`,
			promise: `promesa`,
			void: `vacío`,
			never: `nunca`,
			unknown: `desconocido`,
			any: `cualquiera`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Entrada inválida: se esperaba instanceof ${e.expected}, recibido ${i}` : `Entrada inválida: se esperaba ${t}, recibido ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Entrada inválida: se esperaba ${j$3(e.values[0])}` : `Opción inválida: se esperaba una de ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let i = t(e.origin);
					let a = r[e.origin] ?? e.origin;
					return i ? `Demasiado grande: se esperaba que ${a ?? `valor`} tuviera ${n}${e.maximum.toString()} ${i.unit ?? `elementos`}` : `Demasiado grande: se esperaba que ${a ?? `valor`} fuera ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let i = t(e.origin);
					let a = r[e.origin] ?? e.origin;
					return i ? `Demasiado pequeño: se esperaba que ${a} tuviera ${n}${e.minimum.toString()} ${i.unit}` : `Demasiado pequeño: se esperaba que ${a} fuera ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Cadena inválida: debe comenzar con "${t.prefix}"` : t.format === `ends_with` ? `Cadena inválida: debe terminar en "${t.suffix}"` : t.format === `includes` ? `Cadena inválida: debe incluir "${t.includes}"` : t.format === `regex` ? `Cadena inválida: debe coincidir con el patrón ${t.pattern}` : `Inválido ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Número inválido: debe ser múltiplo de ${e.divisor}`;
				case `unrecognized_keys`: return `Llave${e.keys.length > 1 ? `s` : ``} desconocida${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Llave inválida en ${r[e.origin] ?? e.origin}`;
				case `invalid_union`: return `Entrada inválida`;
				case `invalid_element`: return `Valor inválido en ${r[e.origin] ?? e.origin}`;
				default: return `Entrada inválida`;
			}
		};
	};
	mo$1 = () => {
		let e = {
			string: {
				unit: `کاراکتر`,
				verb: `داشته باشد`
			},
			file: {
				unit: `بایت`,
				verb: `داشته باشد`
			},
			array: {
				unit: `آیتم`,
				verb: `داشته باشد`
			},
			set: {
				unit: `آیتم`,
				verb: `داشته باشد`
			},
			map: {
				unit: `آیتم`,
				verb: `داشته باشد`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ورودی`,
			email: `آدرس ایمیل`,
			url: `URL`,
			emoji: `ایموجی`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `تاریخ و زمان ایزو`,
			date: `تاریخ ایزو`,
			time: `زمان ایزو`,
			duration: `مدت زمان ایزو`,
			ipv4: `IPv4 آدرس`,
			ipv6: `IPv6 آدرس`,
			mac: `MAC آدرس`,
			cidrv4: `IPv4 دامنه`,
			cidrv6: `IPv6 دامنه`,
			base64: `base64-encoded رشته`,
			base64url: `base64url-encoded رشته`,
			json_string: `JSON رشته`,
			e164: `E.164 عدد`,
			credit_card: `شماره کارت اعتباری`,
			currency_code: `کد ارز`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ورودی`
		};
		let r = {
			nan: `NaN`,
			number: `عدد`,
			array: `آرایه`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `ورودی نامعتبر: می‌بایست instanceof ${e.expected} می‌بود، ${i} دریافت شد` : `ورودی نامعتبر: می‌بایست ${t} می‌بود، ${i} دریافت شد`;
				}
				case `invalid_value`: return e.values.length === 1 ? `ورودی نامعتبر: می‌بایست ${j$3(e.values[0])} می‌بود` : `گزینه نامعتبر: می‌بایست یکی از ${l$3(e.values, `|`)} می‌بود`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `خیلی بزرگ: ${e.origin ?? `مقدار`} باید ${n}${e.maximum.toString()} ${r.unit ?? `عنصر`} باشد` : `خیلی بزرگ: ${e.origin ?? `مقدار`} باید ${n}${e.maximum.toString()} باشد`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `خیلی کوچک: ${e.origin} باید ${n}${e.minimum.toString()} ${r.unit} باشد` : `خیلی کوچک: ${e.origin} باید ${n}${e.minimum.toString()} باشد`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `رشته نامعتبر: باید با "${t.prefix}" شروع شود` : t.format === `ends_with` ? `رشته نامعتبر: باید با "${t.suffix}" تمام شود` : t.format === `includes` ? `رشته نامعتبر: باید شامل "${t.includes}" باشد` : t.format === `regex` ? `رشته نامعتبر: باید با الگوی ${t.pattern} مطابقت داشته باشد` : `${n[t.format] ?? e.format} نامعتبر`;
				}
				case `not_multiple_of`: return `عدد نامعتبر: باید مضرب ${e.divisor} باشد`;
				case `unrecognized_keys`: return `کلید${e.keys.length > 1 ? `های` : ``} ناشناس: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `کلید ناشناس در ${e.origin}`;
				case `invalid_union`: return `ورودی نامعتبر`;
				case `invalid_element`: return `مقدار نامعتبر در ${e.origin}`;
				default: return `ورودی نامعتبر`;
			}
		};
	};
	go$1 = () => {
		let e = {
			string: {
				unit: `merkkiä`,
				subject: `merkkijonon`
			},
			file: {
				unit: `tavua`,
				subject: `tiedoston`
			},
			array: {
				unit: `alkiota`,
				subject: `listan`
			},
			set: {
				unit: `alkiota`,
				subject: `joukon`
			},
			map: {
				unit: `alkiota`,
				subject: `kuvauksen`
			},
			number: {
				unit: ``,
				subject: `luvun`
			},
			bigint: {
				unit: ``,
				subject: `suuren kokonaisluvun`
			},
			int: {
				unit: ``,
				subject: `kokonaisluvun`
			},
			date: {
				unit: ``,
				subject: `päivämäärän`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `säännöllinen lauseke`,
			email: `sähköpostiosoite`,
			url: `URL-osoite`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO-aikaleima`,
			date: `ISO-päivämäärä`,
			time: `ISO-aika`,
			duration: `ISO-kesto`,
			ipv4: `IPv4-osoite`,
			ipv6: `IPv6-osoite`,
			mac: `MAC-osoite`,
			cidrv4: `IPv4-alue`,
			cidrv6: `IPv6-alue`,
			base64: `base64-koodattu merkkijono`,
			base64url: `base64url-koodattu merkkijono`,
			json_string: `JSON-merkkijono`,
			e164: `E.164-luku`,
			credit_card: `luottokortin numero`,
			currency_code: `valuuttakoodi`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `templaattimerkkijono`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Virheellinen tyyppi: odotettiin instanceof ${e.expected}, oli ${i}` : `Virheellinen tyyppi: odotettiin ${t}, oli ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Virheellinen syöte: täytyy olla ${j$3(e.values[0])}` : `Virheellinen valinta: täytyy olla yksi seuraavista: ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Liian suuri: ${r.subject} täytyy olla ${n}${e.maximum.toString()} ${r.unit}`.trim() : `Liian suuri: arvon täytyy olla ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Liian pieni: ${r.subject} täytyy olla ${n}${e.minimum.toString()} ${r.unit}`.trim() : `Liian pieni: arvon täytyy olla ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Virheellinen syöte: täytyy alkaa "${t.prefix}"` : t.format === `ends_with` ? `Virheellinen syöte: täytyy loppua "${t.suffix}"` : t.format === `includes` ? `Virheellinen syöte: täytyy sisältää "${t.includes}"` : t.format === `regex` ? `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${t.pattern}` : `Virheellinen ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Virheellinen luku: täytyy olla luvun ${e.divisor} monikerta`;
				case `unrecognized_keys`: return `${e.keys.length > 1 ? `Tuntemattomat avaimet` : `Tuntematon avain`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Virheellinen avain tietueessa`;
				case `invalid_union`: return `Virheellinen unioni`;
				case `invalid_element`: return `Virheellinen arvo joukossa`;
				default: return `Virheellinen syöte`;
			}
		};
	};
	vo$1 = () => {
		let e = {
			string: {
				unit: `caractères`,
				verb: `avoir`
			},
			file: {
				unit: `octets`,
				verb: `avoir`
			},
			array: {
				unit: `éléments`,
				verb: `avoir`
			},
			set: {
				unit: `éléments`,
				verb: `avoir`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `expression régulière`,
			email: `adresse e-mail`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `date et heure ISO`,
			date: `date ISO`,
			time: `heure ISO`,
			duration: `durée ISO`,
			ipv4: `adresse IPv4`,
			ipv6: `adresse IPv6`,
			mac: `adresse MAC`,
			cidrv4: `plage IPv4`,
			cidrv6: `plage IPv6`,
			base64: `chaîne de caractères encodée en base64`,
			base64url: `chaîne de caractères encodée en base64url`,
			json_string: `chaîne de caractères JSON`,
			e164: `numéro au format E.164`,
			credit_card: `numéro de carte de crédit`,
			currency_code: `code de devise`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `entrée`
		};
		let r = {
			string: `chaîne de caractères`,
			number: `nombre`,
			int: `entier`,
			boolean: `booléen`,
			bigint: `grand entier`,
			symbol: `symbole`,
			undefined: `indéfini`,
			null: `null`,
			never: `jamais`,
			void: `vide`,
			date: `date`,
			array: `tableau`,
			object: `objet`,
			tuple: `tuple`,
			record: `record`,
			map: `map`,
			set: `ensemble`,
			file: `fichier`,
			nonoptional: `non optionnel`,
			nan: `NaN`,
			function: `fonction`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Entrée invalide : instance de ${e.expected} attendu, ${i} reçu` : `Entrée invalide : ${t} attendu, ${i} reçu`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Entrée invalide : ${j$3(e.values[0])} attendu` : `Option invalide : une valeur parmi ${l$3(e.values, `|`)} attendue`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let i = t(e.origin);
					return i ? `Trop grand : ${r[e.origin] ?? `valeur`} doit ${i.verb} ${n}${e.maximum.toString()} ${i.unit ?? `élément(s)`}` : `Trop grand : ${r[e.origin] ?? `valeur`} doit être ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let i = t(e.origin);
					return i ? `Trop petit : ${r[e.origin] ?? `valeur`} doit ${i.verb} ${n}${e.minimum.toString()} ${i.unit}` : `Trop petit : ${r[e.origin] ?? `valeur`} doit être ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Chaîne de caractères invalide : doit commencer par "${t.prefix}"` : t.format === `ends_with` ? `Chaîne de caractères invalide : doit se terminer par "${t.suffix}"` : t.format === `includes` ? `Chaîne de caractères invalide : doit inclure "${t.includes}"` : t.format === `regex` ? `Chaîne de caractères invalide : doit correspondre au motif ${t.pattern}` : `${n[t.format] ?? e.format} invalide`;
				}
				case `not_multiple_of`: return `Nombre invalide : doit être un multiple de ${e.divisor}`;
				case `unrecognized_keys`: return `Clé${e.keys.length > 1 ? `s` : ``} non reconnue${e.keys.length > 1 ? `s` : ``} : ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Clé invalide dans ${e.origin}`;
				case `invalid_union`: return `Entrée invalide`;
				case `invalid_element`: return `Valeur invalide dans ${e.origin}`;
				default: return `Entrée invalide`;
			}
		};
	};
	bo$1 = () => {
		let e = {
			string: {
				unit: `caractères`,
				verb: `avoir`
			},
			file: {
				unit: `octets`,
				verb: `avoir`
			},
			array: {
				unit: `éléments`,
				verb: `avoir`
			},
			set: {
				unit: `éléments`,
				verb: `avoir`
			},
			map: {
				unit: `éléments`,
				verb: `avoir`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `entrée`,
			email: `adresse courriel`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `date-heure ISO`,
			date: `date ISO`,
			time: `heure ISO`,
			duration: `durée ISO`,
			ipv4: `adresse IPv4`,
			ipv6: `adresse IPv6`,
			mac: `adresse MAC`,
			cidrv4: `plage IPv4`,
			cidrv6: `plage IPv6`,
			base64: `chaîne encodée en base64`,
			base64url: `chaîne encodée en base64url`,
			json_string: `chaîne JSON`,
			e164: `numéro E.164`,
			credit_card: `numéro de carte de crédit`,
			currency_code: `code de devise`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `entrée`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Entrée invalide : attendu instanceof ${e.expected}, reçu ${i}` : `Entrée invalide : attendu ${t}, reçu ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Entrée invalide : attendu ${j$3(e.values[0])}` : `Option invalide : attendu l'une des valeurs suivantes ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `≤` : `<`;
					let r = t(e.origin);
					return r ? `Trop grand : attendu que ${e.origin ?? `la valeur`} ait ${n}${e.maximum.toString()} ${r.unit}` : `Trop grand : attendu que ${e.origin ?? `la valeur`} soit ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `≥` : `>`;
					let r = t(e.origin);
					return r ? `Trop petit : attendu que ${e.origin} ait ${n}${e.minimum.toString()} ${r.unit}` : `Trop petit : attendu que ${e.origin} soit ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Chaîne invalide : doit commencer par "${t.prefix}"` : t.format === `ends_with` ? `Chaîne invalide : doit se terminer par "${t.suffix}"` : t.format === `includes` ? `Chaîne invalide : doit inclure "${t.includes}"` : t.format === `regex` ? `Chaîne invalide : doit correspondre au motif ${t.pattern}` : `${n[t.format] ?? e.format} invalide`;
				}
				case `not_multiple_of`: return `Nombre invalide : doit être un multiple de ${e.divisor}`;
				case `unrecognized_keys`: return `Clé${e.keys.length > 1 ? `s` : ``} non reconnue${e.keys.length > 1 ? `s` : ``} : ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Clé invalide dans ${e.origin}`;
				case `invalid_union`: return `Entrée invalide`;
				case `invalid_element`: return `Valeur invalide dans ${e.origin}`;
				default: return `Entrée invalide`;
			}
		};
	};
	So$1 = () => {
		let e = {
			string: {
				unit: `અક્ષર`,
				verb: `હોવા જોઈએ`
			},
			file: {
				unit: `બાયટ`,
				verb: `હોવા જોઈએ`
			},
			array: {
				unit: `આઇટમ`,
				verb: `હોવા જોઈએ`
			},
			set: {
				unit: `આઇટમ`,
				verb: `હોવા જોઈએ`
			},
			map: {
				unit: `એન્ટ્રી`,
				verb: `હોવા જોઈએ`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ઇનપુટ`,
			email: `ઈમેઇલ એડ્રેસ`,
			url: `URL`,
			emoji: `ઇમોજી`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO તારીખ અને સમય`,
			date: `ISO તારીખ`,
			time: `ISO સમય`,
			duration: `ISO અવધિ`,
			ipv4: `IPv4 એડ્રેસ`,
			ipv6: `IPv6 એડ્રેસ`,
			mac: `MAC એડ્રેસ`,
			cidrv4: `IPv4 શ્રેણી`,
			cidrv6: `IPv6 શ્રેણી`,
			base64: `base64-એન્કોડેડ સ્ટ્રિંગ`,
			base64url: `base64url-એન્કોડેડ સ્ટ્રિંગ`,
			json_string: `JSON સ્ટ્રિંગ`,
			e164: `E.164 નંબર`,
			credit_card: `ક્રેડિટ કાર્ડ નંબર`,
			currency_code: `ચલણ કોડ`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ઇનપુટ`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `અમાન્ય ઇનપુટ: અપેક્ષિત ${t}, પ્રાપ્ત ${r[n] ?? n}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `અમાન્ય ઇનપુટ: અપેક્ષિત ${j$3(e.values[0])}` : `અમાન્ય વિકલ્પ: ${l$3(e.values, ` | `)} માધ્યમથી એક અપેક્ષિત`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `ખૂબ મોટું: ${e.origin ?? `મૂલ્ય`} ${n}${e.maximum.toString()} ${r.unit ?? `એલિમેન્ટ`} હોવા જોઈએ` : `ખૂબ મોટું: ${e.origin ?? `મૂલ્ય`} ${n}${e.maximum.toString()} હોવું જોઈએ`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `ખૂબ નાનું: ${e.origin} ${n}${e.minimum.toString()} ${r.unit} હોવા જોઈએ` : `ખૂબ નાનું: ${e.origin} ${n}${e.minimum.toString()} હોવું જોઈએ`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `અમાન્ય સ્ટ્રિંગ: "${t.prefix}" થી શરૂ થવું જોઈએ` : t.format === `ends_with` ? `અમાન્ય સ્ટ્રિંગ: "${t.suffix}" પર સમાપ્ત થવું જોઈએ` : t.format === `includes` ? `અમાન્ય સ્ટ્રિંગ: "${t.includes}" શામેલ હોવું જોઈએ` : t.format === `regex` ? `અમાન્ય સ્ટ્રિંગ: પેટર્ન ${t.pattern} સાથે મેળ ખાવું જોઈએ` : `અમાન્ય ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `અમાન્ય નંબર: ${e.divisor} નો ગુણાંક હોવો જોઈએ`;
				case `unrecognized_keys`: return `ઓળખી શકાતા નહીં તે કી${e.keys.length > 1 ? `ઓ` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} માં અમાન્ય કી`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `અમાન્ય ડિસ્ક્રિમિનેટર મૂલ્ય. અપેક્ષિત ${e.options.map((e) => `'${e}'`).join(` | `)}` : `અમાન્ય ઇનપુટ`;
				case `invalid_element`: return `${e.origin} માં અમાન્ય મૂલ્ય`;
				default: return `અમાન્ય ઇનપુટ`;
			}
		};
	};
	wo$1 = () => {
		let e = {
			string: {
				label: `מחרוזת`,
				gender: `f`
			},
			number: {
				label: `מספר`,
				gender: `m`
			},
			boolean: {
				label: `ערך בוליאני`,
				gender: `m`
			},
			bigint: {
				label: `BigInt`,
				gender: `m`
			},
			date: {
				label: `תאריך`,
				gender: `m`
			},
			array: {
				label: `מערך`,
				gender: `m`
			},
			object: {
				label: `אובייקט`,
				gender: `m`
			},
			null: {
				label: `ערך ריק (null)`,
				gender: `m`
			},
			undefined: {
				label: `ערך לא מוגדר (undefined)`,
				gender: `m`
			},
			symbol: {
				label: `סימבול (Symbol)`,
				gender: `m`
			},
			function: {
				label: `פונקציה`,
				gender: `f`
			},
			map: {
				label: `מפה (Map)`,
				gender: `f`
			},
			set: {
				label: `קבוצה (Set)`,
				gender: `f`
			},
			file: {
				label: `קובץ`,
				gender: `m`
			},
			promise: {
				label: `Promise`,
				gender: `m`
			},
			NaN: {
				label: `NaN`,
				gender: `m`
			},
			unknown: {
				label: `ערך לא ידוע`,
				gender: `m`
			},
			value: {
				label: `ערך`,
				gender: `m`
			}
		};
		let t = {
			string: {
				unit: `תווים`,
				shortLabel: `קצר`,
				longLabel: `ארוך`
			},
			file: {
				unit: `בייטים`,
				shortLabel: `קטן`,
				longLabel: `גדול`
			},
			array: {
				unit: `פריטים`,
				shortLabel: `קטן`,
				longLabel: `גדול`
			},
			set: {
				unit: `פריטים`,
				shortLabel: `קטן`,
				longLabel: `גדול`
			},
			number: {
				unit: ``,
				shortLabel: `קטן`,
				longLabel: `גדול`
			}
		};
		let n = (t) => t ? e[t] : void 0;
		let r = (t) => {
			let r = n(t);
			return r ? r.label : t ?? e.unknown.label;
		};
		let i = (e) => `ה${r(e)}`;
		let a = (e) => (n(e)?.gender ?? `m`) === `f` ? `צריכה להיות` : `צריך להיות`;
		let o = (e) => e ? t[e] ?? null : null;
		let s = {
			regex: {
				label: `קלט`,
				gender: `m`
			},
			email: {
				label: `כתובת אימייל`,
				gender: `f`
			},
			url: {
				label: `כתובת רשת`,
				gender: `f`
			},
			emoji: {
				label: `אימוג'י`,
				gender: `m`
			},
			uuid: {
				label: `UUID`,
				gender: `m`
			},
			uuidv4: {
				label: `UUIDv4`,
				gender: `m`
			},
			uuidv6: {
				label: `UUIDv6`,
				gender: `m`
			},
			nanoid: {
				label: `nanoid`,
				gender: `m`
			},
			guid: {
				label: `GUID`,
				gender: `m`
			},
			cuid: {
				label: `cuid`,
				gender: `m`
			},
			cuid2: {
				label: `cuid2`,
				gender: `m`
			},
			ulid: {
				label: `ULID`,
				gender: `m`
			},
			xid: {
				label: `XID`,
				gender: `m`
			},
			ksuid: {
				label: `KSUID`,
				gender: `m`
			},
			datetime: {
				label: `תאריך וזמן ISO`,
				gender: `m`
			},
			date: {
				label: `תאריך ISO`,
				gender: `m`
			},
			time: {
				label: `זמן ISO`,
				gender: `m`
			},
			duration: {
				label: `משך זמן ISO`,
				gender: `m`
			},
			ipv4: {
				label: `כתובת IPv4`,
				gender: `f`
			},
			ipv6: {
				label: `כתובת IPv6`,
				gender: `f`
			},
			mac: {
				label: `כתובת MAC`,
				gender: `f`
			},
			cidrv4: {
				label: `טווח IPv4`,
				gender: `m`
			},
			cidrv6: {
				label: `טווח IPv6`,
				gender: `m`
			},
			base64: {
				label: `מחרוזת בבסיס 64`,
				gender: `f`
			},
			base64url: {
				label: `מחרוזת בבסיס 64 לכתובות רשת`,
				gender: `f`
			},
			json_string: {
				label: `מחרוזת JSON`,
				gender: `f`
			},
			e164: {
				label: `מספר E.164`,
				gender: `m`
			},
			credit_card: {
				label: `מספר כרטיס אשראי`,
				gender: `m`
			},
			currency_code: {
				label: `קוד מטבע`,
				gender: `m`
			},
			iban: {
				label: `IBAN`,
				gender: `m`
			},
			jwt: {
				label: `JWT`,
				gender: `m`
			},
			template_literal: {
				label: `קלט`,
				gender: `m`
			},
			ends_with: {
				label: `קלט`,
				gender: `m`
			},
			includes: {
				label: `קלט`,
				gender: `m`
			},
			lowercase: {
				label: `קלט`,
				gender: `m`
			},
			starts_with: {
				label: `קלט`,
				gender: `m`
			},
			uppercase: {
				label: `קלט`,
				gender: `m`
			}
		};
		let l = { nan: `NaN` };
		return (t) => {
			switch (t.code) {
				case `invalid_type`: {
					let n = t.expected;
					let i = l[n ?? ``] ?? r(n);
					let a = q$3(t.input);
					let o = l[a] ?? e[a]?.label ?? a;
					return /^[A-Z]/.test(t.expected) ? `קלט לא תקין: צריך להיות instanceof ${t.expected}, התקבל ${o}` : `קלט לא תקין: צריך להיות ${i}, התקבל ${o}`;
				}
				case `invalid_value`: {
					if (t.values.length === 1) return `ערך לא תקין: הערך חייב להיות ${j$3(t.values[0])}`;
					let e = t.values.map((e) => j$3(e));
					if (t.values.length === 2) return `ערך לא תקין: האפשרויות המתאימות הן ${e[0]} או ${e[1]}`;
					let n = e[e.length - 1];
					return `ערך לא תקין: האפשרויות המתאימות הן ${e.slice(0, -1).join(`, `)} או ${n}`;
				}
				case `too_big`: {
					let e = o(t.origin);
					let n = i(t.origin ?? `value`);
					if (t.origin === `string`) return `${e?.longLabel ?? `ארוך`} מדי: ${n} צריכה להכיל ${t.maximum.toString()} ${e?.unit ?? ``} ${t.inclusive ? `או פחות` : `לכל היותר`}`.trim();
					if (t.origin === `number`) return `גדול מדי: ${n} צריך להיות ${t.inclusive ? `קטן או שווה ל-${t.maximum}` : `קטן מ-${t.maximum}`}`;
					if (t.origin === `array` || t.origin === `set`) return `גדול מדי: ${n} ${t.origin === `set` ? `צריכה` : `צריך`} להכיל ${t.inclusive ? `${t.maximum} ${e?.unit ?? ``} או פחות` : `פחות מ-${t.maximum} ${e?.unit ?? ``}`}`.trim();
					let r = t.inclusive ? `<=` : `<`;
					let s = a(t.origin ?? `value`);
					return e?.unit ? `${e.longLabel} מדי: ${n} ${s} ${r}${t.maximum.toString()} ${e.unit}` : `${e?.longLabel ?? `גדול`} מדי: ${n} ${s} ${r}${t.maximum.toString()}`;
				}
				case `too_small`: {
					let e = o(t.origin);
					let n = i(t.origin ?? `value`);
					if (t.origin === `string`) return `${e?.shortLabel ?? `קצר`} מדי: ${n} צריכה להכיל ${t.minimum.toString()} ${e?.unit ?? ``} ${t.inclusive ? `או יותר` : `לפחות`}`.trim();
					if (t.origin === `number`) return `קטן מדי: ${n} צריך להיות ${t.inclusive ? `גדול או שווה ל-${t.minimum}` : `גדול מ-${t.minimum}`}`;
					if (t.origin === `array` || t.origin === `set`) {
						let r = t.origin === `set` ? `צריכה` : `צריך`;
						return t.minimum === 1 && t.inclusive ? `קטן מדי: ${n} ${r} להכיל ${t.origin, `לפחות פריט אחד`}` : `קטן מדי: ${n} ${r} להכיל ${t.inclusive ? `${t.minimum} ${e?.unit ?? ``} או יותר` : `יותר מ-${t.minimum} ${e?.unit ?? ``}`}`.trim();
					}
					let r = t.inclusive ? `>=` : `>`;
					let s = a(t.origin ?? `value`);
					return e?.unit ? `${e.shortLabel} מדי: ${n} ${s} ${r}${t.minimum.toString()} ${e.unit}` : `${e?.shortLabel ?? `קטן`} מדי: ${n} ${s} ${r}${t.minimum.toString()}`;
				}
				case `invalid_format`: {
					let e = t;
					if (e.format === `starts_with`) return `המחרוזת חייבת להתחיל ב "${e.prefix}"`;
					if (e.format === `ends_with`) return `המחרוזת חייבת להסתיים ב "${e.suffix}"`;
					if (e.format === `includes`) return `המחרוזת חייבת לכלול "${e.includes}"`;
					if (e.format === `regex`) return `המחרוזת חייבת להתאים לתבנית ${e.pattern}`;
					let n = s[e.format];
					return `${n?.label ?? e.format} לא ${(n?.gender ?? `m`) === `f` ? `תקינה` : `תקין`}`;
				}
				case `not_multiple_of`: return `מספר לא תקין: חייב להיות מכפלה של ${t.divisor}`;
				case `unrecognized_keys`: return `מפתח${t.keys.length > 1 ? `ות` : ``} לא מזוה${t.keys.length > 1 ? `ים` : `ה`}: ${l$3(t.keys, `, `)}`;
				case `invalid_key`: return `שדה לא תקין באובייקט`;
				case `invalid_union`: return `קלט לא תקין`;
				case `invalid_element`: return `ערך לא תקין ב${i(t.origin ?? `array`)}`;
				default: return `קלט לא תקין`;
			}
		};
	};
	Eo$1 = () => {
		let e = {
			string: {
				unit: `अक्षर`,
				verb: `रखने के लिए`
			},
			file: {
				unit: `बाइट्स`,
				verb: `रखने के लिए`
			},
			array: {
				unit: `तत्व`,
				verb: `रखने के लिए`
			},
			set: {
				unit: `तत्व`,
				verb: `रखने के लिए`
			},
			map: {
				unit: `प्रविष्टियाँ`,
				verb: `रखने के लिए`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `इनपुट`,
			email: `ईमेल पता`,
			url: `URL`,
			emoji: `इमोजी`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO तिथि और समय`,
			date: `ISO तिथि`,
			time: `ISO समय`,
			duration: `ISO अवधि`,
			ipv4: `IPv4 पता`,
			ipv6: `IPv6 पता`,
			mac: `MAC पता`,
			cidrv4: `IPv4 श्रेणी`,
			cidrv6: `IPv6 श्रेणी`,
			base64: `Base64-एन्कोडेड स्ट्रिंग`,
			base64url: `Base64URL-एन्कोडेड स्ट्रिंग`,
			json_string: `JSON स्ट्रिंग`,
			e164: `E.164 संख्या`,
			credit_card: `क्रेडिट कार्ड संख्या`,
			currency_code: `मुद्रा कोड`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `इनपुट`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `अमान्य इनपुट: अपेक्षित ${t}, प्राप्त ${r[n] ?? n}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `अमान्य इनपुट: अपेक्षित ${j$3(e.values[0])}` : `अमान्य विकल्प: अपेक्षित मानों में से एक ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `बहुत बड़ा: अपेक्षित था कि ${e.origin ?? `मान`} में ${n}${e.maximum} ${r.unit} हों` : `बहुत बड़ा: अपेक्षित था कि ${e.origin ?? `मान`} ${n}${e.maximum} हो`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `बहुत छोटा: अपेक्षित था कि ${e.origin} में ${n}${e.minimum} ${r.unit} हों` : `बहुत छोटा: अपेक्षित था कि ${e.origin} ${n}${e.minimum} हो`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `अमान्य स्ट्रिंग: "${t.prefix}" से शुरू होना चाहिए` : t.format === `ends_with` ? `अमान्य स्ट्रिंग: "${t.suffix}" पर समाप्त होना चाहिए` : t.format === `includes` ? `अमान्य स्ट्रिंग: इसमें "${t.includes}" शामिल होना चाहिए` : t.format === `regex` ? `अमान्य स्ट्रिंग: पैटर्न ${t.pattern} से मेल खाना चाहिए` : `अमान्य ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `अमान्य संख्या: यह ${e.divisor} का गुणज होना चाहिए`;
				case `unrecognized_keys`: return `अपरिचित कुंजी${e.keys.length > 1 ? `याँ` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `अमान्य कुंजी: ${e.origin} में`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `अमान्य डिस्क्रिमिनेटर मान: अपेक्षित ${e.options.map((e) => `'${e}'`).join(` | `)}` : `अमान्य इनपुट`;
				case `invalid_element`: return `अमान्य मान: ${e.origin} में`;
				default: return `अमान्य इनपुट`;
			}
		};
	};
	Oo$1 = () => {
		let e = {
			string: {
				unit: `znakova`,
				verb: `imati`
			},
			file: {
				unit: `bajtova`,
				verb: `imati`
			},
			array: {
				unit: `stavki`,
				verb: `imati`
			},
			set: {
				unit: `stavki`,
				verb: `imati`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `unos`,
			email: `email adresa`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO datum i vrijeme`,
			date: `ISO datum`,
			time: `ISO vrijeme`,
			duration: `ISO trajanje`,
			ipv4: `IPv4 adresa`,
			ipv6: `IPv6 adresa`,
			mac: `MAC adresa`,
			cidrv4: `IPv4 raspon`,
			cidrv6: `IPv6 raspon`,
			base64: `base64 kodirani tekst`,
			base64url: `base64url kodirani tekst`,
			json_string: `JSON tekst`,
			e164: `E.164 broj`,
			credit_card: `broj kreditne kartice`,
			currency_code: `kod valute`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `unos`
		};
		let r = {
			nan: `NaN`,
			string: `tekst`,
			number: `broj`,
			boolean: `boolean`,
			array: `niz`,
			object: `objekt`,
			set: `skup`,
			file: `datoteka`,
			date: `datum`,
			bigint: `bigint`,
			symbol: `simbol`,
			undefined: `undefined`,
			null: `null`,
			function: `funkcija`,
			map: `mapa`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Neispravan unos: očekuje se instanceof ${e.expected}, a primljeno je ${i}` : `Neispravan unos: očekuje se ${t}, a primljeno je ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Neispravna vrijednost: očekivano ${j$3(e.values[0])}` : `Neispravna opcija: očekivano jedno od ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let i = t(e.origin);
					let a = r[e.origin] ?? e.origin;
					return i ? `Preveliko: očekivano da ${a ?? `vrijednost`} ima ${n}${e.maximum.toString()} ${i.unit ?? `elemenata`}` : `Preveliko: očekivano da ${a ?? `vrijednost`} bude ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let i = t(e.origin);
					let a = r[e.origin] ?? e.origin;
					return i ? `Premalo: očekivano da ${a} ima ${n}${e.minimum.toString()} ${i.unit}` : `Premalo: očekivano da ${a} bude ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Neispravan tekst: mora započinjati s "${t.prefix}"` : t.format === `ends_with` ? `Neispravan tekst: mora završavati s "${t.suffix}"` : t.format === `includes` ? `Neispravan tekst: mora sadržavati "${t.includes}"` : t.format === `regex` ? `Neispravan tekst: mora odgovarati uzorku ${t.pattern}` : `Neispravna ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Neispravan broj: mora biti višekratnik od ${e.divisor}`;
				case `unrecognized_keys`: return `Neprepoznat${e.keys.length > 1 ? `i ključevi` : ` ključ`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Neispravan ključ u ${r[e.origin] ?? e.origin}`;
				case `invalid_union`: return `Neispravan unos`;
				case `invalid_element`: return `Neispravna vrijednost u ${r[e.origin] ?? e.origin}`;
				default: return `Neispravan unos`;
			}
		};
	};
	Ao$1 = () => {
		let e = {
			string: {
				unit: `karakter`,
				verb: `legyen`
			},
			file: {
				unit: `byte`,
				verb: `legyen`
			},
			array: {
				unit: `elem`,
				verb: `legyen`
			},
			set: {
				unit: `elem`,
				verb: `legyen`
			},
			map: {
				unit: `elem`,
				verb: `legyen`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `bemenet`,
			email: `email cím`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO időbélyeg`,
			date: `ISO dátum`,
			time: `ISO idő`,
			duration: `ISO időintervallum`,
			ipv4: `IPv4 cím`,
			ipv6: `IPv6 cím`,
			mac: `MAC cím`,
			cidrv4: `IPv4 tartomány`,
			cidrv6: `IPv6 tartomány`,
			base64: `base64-kódolt string`,
			base64url: `base64url-kódolt string`,
			json_string: `JSON string`,
			e164: `E.164 szám`,
			credit_card: `hitelkártyaszám`,
			currency_code: `pénznemkód`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `bemenet`
		};
		let r = {
			nan: `NaN`,
			number: `szám`,
			array: `tömb`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Érvénytelen bemenet: a várt érték instanceof ${e.expected}, a kapott érték ${i}` : `Érvénytelen bemenet: a várt érték ${t}, a kapott érték ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Érvénytelen bemenet: a várt érték ${j$3(e.values[0])}` : `Érvénytelen opció: valamelyik érték várt ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Túl nagy: ${e.origin ?? `érték`} mérete túl nagy ${n}${e.maximum.toString()} ${r.unit ?? `elem`}` : `Túl nagy: a bemeneti érték ${e.origin ?? `érték`} túl nagy: ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Túl kicsi: a bemeneti érték ${e.origin} mérete túl kicsi ${n}${e.minimum.toString()} ${r.unit}` : `Túl kicsi: a bemeneti érték ${e.origin} túl kicsi ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Érvénytelen string: "${t.prefix}" értékkel kell kezdődnie` : t.format === `ends_with` ? `Érvénytelen string: "${t.suffix}" értékkel kell végződnie` : t.format === `includes` ? `Érvénytelen string: "${t.includes}" értéket kell tartalmaznia` : t.format === `regex` ? `Érvénytelen string: ${t.pattern} mintának kell megfelelnie` : `Érvénytelen ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Érvénytelen szám: ${e.divisor} többszörösének kell lennie`;
				case `unrecognized_keys`: return `Ismeretlen kulcs${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Érvénytelen kulcs ${e.origin}`;
				case `invalid_union`: return `Érvénytelen bemenet`;
				case `invalid_element`: return `Érvénytelen érték: ${e.origin}`;
				default: return `Érvénytelen bemenet`;
			}
		};
	};
	Po$1 = () => {
		let e = {
			string: {
				unit: {
					one: `նշան`,
					many: `նշաններ`
				},
				verb: `ունենալ`
			},
			file: {
				unit: {
					one: `բայթ`,
					many: `բայթեր`
				},
				verb: `ունենալ`
			},
			array: {
				unit: {
					one: `տարր`,
					many: `տարրեր`
				},
				verb: `ունենալ`
			},
			set: {
				unit: {
					one: `տարր`,
					many: `տարրեր`
				},
				verb: `ունենալ`
			},
			map: {
				unit: {
					one: `տարր`,
					many: `տարրեր`
				},
				verb: `ունենալ`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `մուտք`,
			email: `էլ. հասցե`,
			url: `URL`,
			emoji: `էմոջի`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO ամսաթիվ և ժամ`,
			date: `ISO ամսաթիվ`,
			time: `ISO ժամ`,
			duration: `ISO տևողություն`,
			ipv4: `IPv4 հասցե`,
			ipv6: `IPv6 հասցե`,
			mac: `MAC հասցե`,
			cidrv4: `IPv4 միջակայք`,
			cidrv6: `IPv6 միջակայք`,
			base64: `base64 ձևաչափով տող`,
			base64url: `base64url ձևաչափով տող`,
			json_string: `JSON տող`,
			e164: `E.164 համար`,
			credit_card: `կրեդիտ քարտի համար`,
			currency_code: `արժույթի կոդ`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `մուտք`
		};
		let r = {
			nan: `NaN`,
			number: `թիվ`,
			array: `զանգված`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Սխալ մուտքագրում․ սպասվում էր instanceof ${e.expected}, ստացվել է ${i}` : `Սխալ մուտքագրում․ սպասվում էր ${t}, ստացվել է ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Սխալ մուտքագրում․ սպասվում էր ${j$3(e.values[1])}` : `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					if (r) {
						let t = Mo$1(Number(e.maximum), r.unit.one, r.unit.many);
						return `Չափազանց մեծ արժեք․ սպասվում է, որ ${No$1(e.origin ?? `արժեք`)} կունենա ${n}${e.maximum.toString()} ${t}`;
					}
					return `Չափազանց մեծ արժեք․ սպասվում է, որ ${No$1(e.origin ?? `արժեք`)} լինի ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					if (r) {
						let t = Mo$1(Number(e.minimum), r.unit.one, r.unit.many);
						return `Չափազանց փոքր արժեք․ սպասվում է, որ ${No$1(e.origin)} կունենա ${n}${e.minimum.toString()} ${t}`;
					}
					return `Չափազանց փոքր արժեք․ սպասվում է, որ ${No$1(e.origin)} լինի ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Սխալ տող․ պետք է սկսվի "${t.prefix}"-ով` : t.format === `ends_with` ? `Սխալ տող․ պետք է ավարտվի "${t.suffix}"-ով` : t.format === `includes` ? `Սխալ տող․ պետք է պարունակի "${t.includes}"` : t.format === `regex` ? `Սխալ տող․ պետք է համապատասխանի ${t.pattern} ձևաչափին` : `Սխալ ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${e.divisor}-ի`;
				case `unrecognized_keys`: return `Չճանաչված բանալի${e.keys.length > 1 ? `ներ` : ``}. ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Սխալ բանալի ${No$1(e.origin)}-ում`;
				case `invalid_union`: return `Սխալ մուտքագրում`;
				case `invalid_element`: return `Սխալ արժեք ${No$1(e.origin)}-ում`;
				default: return `Սխալ մուտքագրում`;
			}
		};
	};
	Io$1 = () => {
		let e = {
			string: {
				unit: `karakter`,
				verb: `memiliki`
			},
			file: {
				unit: `byte`,
				verb: `memiliki`
			},
			array: {
				unit: `item`,
				verb: `memiliki`
			},
			set: {
				unit: `item`,
				verb: `memiliki`
			},
			map: {
				unit: `item`,
				verb: `memiliki`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `alamat email`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `tanggal dan waktu format ISO`,
			date: `tanggal format ISO`,
			time: `jam format ISO`,
			duration: `durasi format ISO`,
			ipv4: `alamat IPv4`,
			ipv6: `alamat IPv6`,
			mac: `alamat MAC`,
			cidrv4: `rentang alamat IPv4`,
			cidrv6: `rentang alamat IPv6`,
			base64: `string dengan enkode base64`,
			base64url: `string dengan enkode base64url`,
			json_string: `string JSON`,
			e164: `angka E.164`,
			credit_card: `nomor kartu kredit`,
			currency_code: `kode mata uang`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Input tidak valid: diharapkan instanceof ${e.expected}, diterima ${i}` : `Input tidak valid: diharapkan ${t}, diterima ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Input tidak valid: diharapkan ${j$3(e.values[0])}` : `Pilihan tidak valid: diharapkan salah satu dari ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Terlalu besar: diharapkan ${e.origin ?? `value`} memiliki ${n}${e.maximum.toString()} ${r.unit ?? `elemen`}` : `Terlalu besar: diharapkan ${e.origin ?? `value`} menjadi ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Terlalu kecil: diharapkan ${e.origin} memiliki ${n}${e.minimum.toString()} ${r.unit}` : `Terlalu kecil: diharapkan ${e.origin} menjadi ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `String tidak valid: harus dimulai dengan "${t.prefix}"` : t.format === `ends_with` ? `String tidak valid: harus berakhir dengan "${t.suffix}"` : t.format === `includes` ? `String tidak valid: harus menyertakan "${t.includes}"` : t.format === `regex` ? `String tidak valid: harus sesuai pola ${t.pattern}` : `${n[t.format] ?? e.format} tidak valid`;
				}
				case `not_multiple_of`: return `Angka tidak valid: harus kelipatan dari ${e.divisor}`;
				case `unrecognized_keys`: return `Kunci tidak dikenali ${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Kunci tidak valid di ${e.origin}`;
				case `invalid_union`: return `Input tidak valid`;
				case `invalid_element`: return `Nilai tidak valid di ${e.origin}`;
				default: return `Input tidak valid`;
			}
		};
	};
	Ro$1 = () => {
		let e = {
			string: {
				unit: `stafi`,
				verb: `að hafa`
			},
			file: {
				unit: `bæti`,
				verb: `að hafa`
			},
			array: {
				unit: `hluti`,
				verb: `að hafa`
			},
			set: {
				unit: `hluti`,
				verb: `að hafa`
			},
			map: {
				unit: `hluti`,
				verb: `að hafa`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `gildi`,
			email: `netfang`,
			url: `vefslóð`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO dagsetning og tími`,
			date: `ISO dagsetning`,
			time: `ISO tími`,
			duration: `ISO tímalengd`,
			ipv4: `IPv4 address`,
			ipv6: `IPv6 address`,
			mac: `MAC address`,
			cidrv4: `IPv4 range`,
			cidrv6: `IPv6 range`,
			base64: `base64-encoded strengur`,
			base64url: `base64url-encoded strengur`,
			json_string: `JSON strengur`,
			e164: `E.164 tölugildi`,
			credit_card: `kreditkortanúmer`,
			currency_code: `gjaldmiðilskóði`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `gildi`
		};
		let r = {
			nan: `NaN`,
			number: `númer`,
			array: `fylki`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Rangt gildi: Þú slóst inn ${i} þar sem á að vera instanceof ${e.expected}` : `Rangt gildi: Þú slóst inn ${i} þar sem á að vera ${t}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Rangt gildi: gert ráð fyrir ${j$3(e.values[0])}` : `Ógilt val: má vera eitt af eftirfarandi ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Of stórt: gert er ráð fyrir að ${e.origin ?? `gildi`} hafi ${n}${e.maximum.toString()} ${r.unit ?? `hluti`}` : `Of stórt: gert er ráð fyrir að ${e.origin ?? `gildi`} sé ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Of lítið: gert er ráð fyrir að ${e.origin} hafi ${n}${e.minimum.toString()} ${r.unit}` : `Of lítið: gert er ráð fyrir að ${e.origin} sé ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ógildur strengur: verður að byrja á "${t.prefix}"` : t.format === `ends_with` ? `Ógildur strengur: verður að enda á "${t.suffix}"` : t.format === `includes` ? `Ógildur strengur: verður að innihalda "${t.includes}"` : t.format === `regex` ? `Ógildur strengur: verður að fylgja mynstri ${t.pattern}` : `Rangt ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Röng tala: verður að vera margfeldi af ${e.divisor}`;
				case `unrecognized_keys`: return `Óþekkt ${e.keys.length > 1 ? `ir lyklar` : `ur lykill`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Rangur lykill í ${e.origin}`;
				case `invalid_union`: return `Rangt gildi`;
				case `invalid_element`: return `Rangt gildi í ${e.origin}`;
				default: return `Rangt gildi`;
			}
		};
	};
	Bo$1 = () => {
		let e = {
			string: {
				unit: `caratteri`,
				verb: `avere`
			},
			file: {
				unit: `byte`,
				verb: `avere`
			},
			array: {
				unit: `elementi`,
				verb: `avere`
			},
			set: {
				unit: `elementi`,
				verb: `avere`
			},
			map: {
				unit: `elementi`,
				verb: `avere`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `indirizzo email`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `data e ora ISO`,
			date: `data ISO`,
			time: `ora ISO`,
			duration: `durata ISO`,
			ipv4: `indirizzo IPv4`,
			ipv6: `indirizzo IPv6`,
			mac: `indirizzo MAC`,
			cidrv4: `intervallo IPv4`,
			cidrv6: `intervallo IPv6`,
			base64: `stringa codificata in base64`,
			base64url: `URL codificata in base64`,
			json_string: `stringa JSON`,
			e164: `numero E.164`,
			credit_card: `numero di carta di credito`,
			currency_code: `codice valuta`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = {
			nan: `NaN`,
			number: `numero`,
			array: `vettore`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Input non valido: atteso instanceof ${e.expected}, ricevuto ${i}` : `Input non valido: atteso ${t}, ricevuto ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Input non valido: atteso ${j$3(e.values[0])}` : `Opzione non valida: atteso uno tra ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Troppo grande: ${e.origin ?? `valore`} deve avere ${n}${e.maximum.toString()} ${r.unit ?? `elementi`}` : `Troppo grande: ${e.origin ?? `valore`} deve essere ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Troppo piccolo: ${e.origin} deve avere ${n}${e.minimum.toString()} ${r.unit}` : `Troppo piccolo: ${e.origin} deve essere ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Stringa non valida: deve iniziare con "${t.prefix}"` : t.format === `ends_with` ? `Stringa non valida: deve terminare con "${t.suffix}"` : t.format === `includes` ? `Stringa non valida: deve includere "${t.includes}"` : t.format === `regex` ? `Stringa non valida: deve corrispondere al pattern ${t.pattern}` : `Input non valido: ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Numero non valido: deve essere un multiplo di ${e.divisor}`;
				case `unrecognized_keys`: return `Chiav${e.keys.length > 1 ? `i` : `e`} non riconosciut${e.keys.length > 1 ? `e` : `a`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Chiave non valida in ${e.origin}`;
				case `invalid_union`: return `Input non valido`;
				case `invalid_element`: return `Valore non valido in ${e.origin}`;
				default: return `Input non valido`;
			}
		};
	};
	Ho$1 = () => {
		let e = {
			string: {
				unit: `文字`,
				verb: `である`
			},
			file: {
				unit: `バイト`,
				verb: `である`
			},
			array: {
				unit: `要素`,
				verb: `である`
			},
			set: {
				unit: `要素`,
				verb: `である`
			},
			map: {
				unit: `要素`,
				verb: `である`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `入力値`,
			email: `メールアドレス`,
			url: `URL`,
			emoji: `絵文字`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO日時`,
			date: `ISO日付`,
			time: `ISO時刻`,
			duration: `ISO期間`,
			ipv4: `IPv4アドレス`,
			ipv6: `IPv6アドレス`,
			mac: `MACアドレス`,
			cidrv4: `IPv4範囲`,
			cidrv6: `IPv6範囲`,
			base64: `base64エンコード文字列`,
			base64url: `base64urlエンコード文字列`,
			json_string: `JSON文字列`,
			e164: `E.164番号`,
			credit_card: `クレジットカード番号`,
			currency_code: `通貨コード`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `入力値`
		};
		let r = {
			nan: `NaN`,
			number: `数値`,
			array: `配列`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `無効な入力: instanceof ${e.expected}が期待されましたが、${i}が入力されました` : `無効な入力: ${t}が期待されましたが、${i}が入力されました`;
				}
				case `invalid_value`: return e.values.length === 1 ? `無効な入力: ${j$3(e.values[0])}が期待されました` : `無効な選択: ${l$3(e.values, `、`)}のいずれかである必要があります`;
				case `too_big`: {
					let n = e.inclusive ? `以下である` : `より小さい`;
					let r = t(e.origin);
					return r ? `大きすぎる値: ${e.origin ?? `値`}は${e.maximum.toString()}${r.unit ?? `要素`}${n}必要があります` : `大きすぎる値: ${e.origin ?? `値`}は${e.maximum.toString()}${n}必要があります`;
				}
				case `too_small`: {
					let n = e.inclusive ? `以上である` : `より大きい`;
					let r = t(e.origin);
					return r ? `小さすぎる値: ${e.origin}は${e.minimum.toString()}${r.unit}${n}必要があります` : `小さすぎる値: ${e.origin}は${e.minimum.toString()}${n}必要があります`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `無効な文字列: "${t.prefix}"で始まる必要があります` : t.format === `ends_with` ? `無効な文字列: "${t.suffix}"で終わる必要があります` : t.format === `includes` ? `無効な文字列: "${t.includes}"を含む必要があります` : t.format === `regex` ? `無効な文字列: パターン${t.pattern}に一致する必要があります` : `無効な${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `無効な数値: ${e.divisor}の倍数である必要があります`;
				case `unrecognized_keys`: return `認識されていないキー${e.keys.length > 1 ? `群` : ``}: ${l$3(e.keys, `、`)}`;
				case `invalid_key`: return `${e.origin}内の無効なキー`;
				case `invalid_union`: return `無効な入力`;
				case `invalid_element`: return `${e.origin}内の無効な値`;
				default: return `無効な入力`;
			}
		};
	};
	Wo$1 = () => {
		let e = {
			string: {
				unit: `სიმბოლო`,
				verb: `უნდა შეიცავდეს`
			},
			file: {
				unit: `ბაიტი`,
				verb: `უნდა შეიცავდეს`
			},
			array: {
				unit: `ელემენტი`,
				verb: `უნდა შეიცავდეს`
			},
			set: {
				unit: `ელემენტი`,
				verb: `უნდა შეიცავდეს`
			},
			map: {
				unit: `ელემენტი`,
				verb: `უნდა შეიცავდეს`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `შეყვანა`,
			email: `ელ-ფოსტის მისამართი`,
			url: `URL`,
			emoji: `ემოჯი`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `თარიღი-დრო`,
			date: `თარიღი`,
			time: `დრო`,
			duration: `ხანგრძლივობა`,
			ipv4: `IPv4 მისამართი`,
			ipv6: `IPv6 მისამართი`,
			mac: `MAC მისამართი`,
			cidrv4: `IPv4 დიაპაზონი`,
			cidrv6: `IPv6 დიაპაზონი`,
			base64: `base64-კოდირებული ველი`,
			base64url: `base64url-კოდირებული ველი`,
			json_string: `JSON ველი`,
			e164: `E.164 ნომერი`,
			credit_card: `საკრედიტო ბარათის ნომერი`,
			currency_code: `ვალუტის კოდი`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `შეყვანა`
		};
		let r = {
			nan: `NaN`,
			number: `რიცხვი`,
			string: `ველი`,
			boolean: `ბულეანი`,
			function: `ფუნქცია`,
			array: `მასივი`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `არასწორი შეყვანა: მოსალოდნელი instanceof ${e.expected}, მიღებული ${i}` : `არასწორი შეყვანა: მოსალოდნელი ${t}, მიღებული ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `არასწორი შეყვანა: მოსალოდნელი ${j$3(e.values[0])}` : `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${l$3(e.values, `|`)}-დან`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `ზედმეტად დიდი: მოსალოდნელი ${e.origin ?? `მნიშვნელობა`} ${r.verb} ${n}${e.maximum.toString()} ${r.unit}` : `ზედმეტად დიდი: მოსალოდნელი ${e.origin ?? `მნიშვნელობა`} იყოს ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `ზედმეტად პატარა: მოსალოდნელი ${e.origin} ${r.verb} ${n}${e.minimum.toString()} ${r.unit}` : `ზედმეტად პატარა: მოსალოდნელი ${e.origin} იყოს ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `არასწორი ველი: უნდა იწყებოდეს "${t.prefix}"-ით` : t.format === `ends_with` ? `არასწორი ველი: უნდა მთავრდებოდეს "${t.suffix}"-ით` : t.format === `includes` ? `არასწორი ველი: უნდა შეიცავდეს "${t.includes}"-ს` : t.format === `regex` ? `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${t.pattern}` : `არასწორი ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `არასწორი რიცხვი: უნდა იყოს ${e.divisor}-ის ჯერადი`;
				case `unrecognized_keys`: return `უცნობი გასაღებ${e.keys.length > 1 ? `ები` : `ი`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `არასწორი გასაღები ${e.origin}-ში`;
				case `invalid_union`: return `არასწორი შეყვანა`;
				case `invalid_element`: return `არასწორი მნიშვნელობა ${e.origin}-ში`;
				default: return `არასწორი შეყვანა`;
			}
		};
	};
	Ko$1 = () => {
		let e = {
			string: {
				unit: `តួអក្សរ`,
				verb: `គួរមាន`
			},
			file: {
				unit: `បៃ`,
				verb: `គួរមាន`
			},
			array: {
				unit: `ធាតុ`,
				verb: `គួរមាន`
			},
			set: {
				unit: `ធាតុ`,
				verb: `គួរមាន`
			},
			map: {
				unit: `ធាតុ`,
				verb: `គួរមាន`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ទិន្នន័យបញ្ចូល`,
			email: `អាសយដ្ឋានអ៊ីមែល`,
			url: `URL`,
			emoji: `សញ្ញាអារម្មណ៍`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `កាលបរិច្ឆេទ និងម៉ោង ISO`,
			date: `កាលបរិច្ឆេទ ISO`,
			time: `ម៉ោង ISO`,
			duration: `រយៈពេល ISO`,
			ipv4: `អាសយដ្ឋាន IPv4`,
			ipv6: `អាសយដ្ឋាន IPv6`,
			mac: `អាសយដ្ឋាន MAC`,
			cidrv4: `ដែនអាសយដ្ឋាន IPv4`,
			cidrv6: `ដែនអាសយដ្ឋាន IPv6`,
			base64: `ខ្សែអក្សរអ៊ិកូដ base64`,
			base64url: `ខ្សែអក្សរអ៊ិកូដ base64url`,
			json_string: `ខ្សែអក្សរ JSON`,
			e164: `លេខ E.164`,
			credit_card: `លេខប័ណ្ណឥណទាន`,
			currency_code: `កូដរូបិយប័ណ្ណ`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ទិន្នន័យបញ្ចូល`
		};
		let r = {
			nan: `NaN`,
			number: `លេខ`,
			array: `អារេ (Array)`,
			null: `គ្មានតម្លៃ (null)`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${e.expected} ប៉ុន្តែទទួលបាន ${i}` : `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${t} ប៉ុន្តែទទួលបាន ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${j$3(e.values[0])}` : `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `ធំពេក៖ ត្រូវការ ${e.origin ?? `តម្លៃ`} ${n} ${e.maximum.toString()} ${r.unit ?? `ធាតុ`}` : `ធំពេក៖ ត្រូវការ ${e.origin ?? `តម្លៃ`} ${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `តូចពេក៖ ត្រូវការ ${e.origin} ${n} ${e.minimum.toString()} ${r.unit}` : `តូចពេក៖ ត្រូវការ ${e.origin} ${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${t.prefix}"` : t.format === `ends_with` ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${t.suffix}"` : t.format === `includes` ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${t.includes}"` : t.format === `regex` ? `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${t.pattern}` : `មិនត្រឹមត្រូវ៖ ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${e.divisor}`;
				case `unrecognized_keys`: return `រកឃើញសោមិនស្គាល់៖ ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `សោមិនត្រឹមត្រូវនៅក្នុង ${e.origin}`;
				case `invalid_union`: return `ទិន្នន័យមិនត្រឹមត្រូវ`;
				case `invalid_element`: return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${e.origin}`;
				default: return `ទិន្នន័យមិនត្រឹមត្រូវ`;
			}
		};
	};
	Yo$1 = () => {
		let e = {
			string: {
				unit: `ಅಕ್ಷರಗಳು`,
				verb: `ಹೊಂದಲು`
			},
			file: {
				unit: `ಬೈಟ್‌ಗಳು`,
				verb: `ಹೊಂದಲು`
			},
			array: {
				unit: `ವಸ್ತುಗಳು`,
				verb: `ಹೊಂದಲು`
			},
			set: {
				unit: `ವಸ್ತುಗಳು`,
				verb: `ಹೊಂದಲು`
			},
			map: {
				unit: `entries`,
				verb: `ಹೊಂದಲು`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ಇನ್ಪುಟ್`,
			email: `email ವಿಳಾಸ`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO ದಿನಾಂಕದ ಸಮಯ`,
			date: `ISO ದಿನಾಂಕ`,
			time: `ISO ಸಮಯ`,
			duration: `ISO ಅವಧಿ`,
			ipv4: `IPv4 ವಿಳಾಸ`,
			ipv6: `IPv6 ವಿಳಾಸ`,
			mac: `MAC ವಿಳಾಸ`,
			cidrv4: `IPv4 ವ್ಯಾಪ್ತಿಯ`,
			cidrv6: `IPv6 ವ್ಯಾಪ್ತಿಯ`,
			base64: `base64-encodedಸ್ಟ್ರಿಂಗ್`,
			base64url: `base64url-encodedಸ್ಟ್ರಿಂಗ್`,
			json_string: `JSONಸ್ಟ್ರಿಂಗ್`,
			e164: `E.164 ಸಂಖ್ಯೆ`,
			credit_card: `ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ`,
			currency_code: `ಕರೆನ್ಸಿ ಕೋಡ್`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ಇನ್ಪುಟ್`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${t}, ಸ್ವೀಕರಿಸಿದನು ${r[n] ?? n}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${j$3(e.values[0])}` : `ಅಮಾನ್ಯ ಆಯ್ಕೆ: ಇವುಗಳಲ್ಲಿ ಒಂದನ್ನು ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `ತುಂಬಾ ದೊಡ್ಡದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${e.origin ?? `value`} ಹೊಂದಲು ${n}${e.maximum.toString()} ${r.unit ?? `ಅಂಶಗಳು`}` : `ತುಂಬಾ ದೊಡ್ಡದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${e.origin ?? `value`} ಎಂದು ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `ತುಂಬಾ ಚಿಕ್ಕದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${e.origin} ಹೊಂದಲು ${n}${e.minimum.toString()} ${r.unit}` : `ತುಂಬಾ ಚಿಕ್ಕದು: ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${e.origin} ಎಂದು ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `ಅಮಾನ್ಯವಾದ ಸ್ಟ್ರಿಂಗ್: ಇದರೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಬೇಕು "${t.prefix}"` : t.format === `ends_with` ? `ಅಮಾನ್ಯವಾದ ಸ್ಟ್ರಿಂಗ್: ಇದರೊಂದಿಗೆ ಕೊನೆಗೊಳ್ಳಬೇಕು "${t.suffix}"` : t.format === `includes` ? `ಅಮಾನ್ಯ ಸ್ಟ್ರಿಂಗ್: ಒಳಗೊಂಡಿರಬೇಕು "${t.includes}"` : t.format === `regex` ? `ಅಮಾನ್ಯವಾದ ಸ್ಟ್ರಿಂಗ್: ಮಾದರಿಗೆ ಹೊಂದಿಕೆಯಾಗಬೇಕು ${t.pattern}` : `ಅಮಾನ್ಯ ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `ಅಮಾನ್ಯ ಸಂಖ್ಯೆ: ಬಹುಸಂಖ್ಯೆಯಾಗಿರಬೇಕು ${e.divisor}`;
				case `unrecognized_keys`: return `ಗುರುತಿಸಲಾಗದ ಕೀ ${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `ಅಮಾನ್ಯವಾದ ಕೀ ಇನ್ ${e.origin}`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `ಅಮಾನ್ಯ ತಾರತಮ್ಯ ಮೌಲ್ಯ. ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ ${e.options.map((e) => `'${e}'`).join(` | `)}` : `ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್`;
				case `invalid_element`: return `ರಲ್ಲಿ ಅಮಾನ್ಯ ಮೌಲ್ಯ ${e.origin}`;
				default: return `ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್`;
			}
		};
	};
	Zo$1 = () => {
		let e = {
			string: {
				unit: `문자`,
				verb: `to have`
			},
			file: {
				unit: `바이트`,
				verb: `to have`
			},
			array: {
				unit: `개`,
				verb: `to have`
			},
			set: {
				unit: `개`,
				verb: `to have`
			},
			map: {
				unit: `개`,
				verb: `to have`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `입력`,
			email: `이메일 주소`,
			url: `URL`,
			emoji: `이모지`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO 날짜시간`,
			date: `ISO 날짜`,
			time: `ISO 시간`,
			duration: `ISO 기간`,
			ipv4: `IPv4 주소`,
			ipv6: `IPv6 주소`,
			mac: `MAC 주소`,
			cidrv4: `IPv4 범위`,
			cidrv6: `IPv6 범위`,
			base64: `base64 인코딩 문자열`,
			base64url: `base64url 인코딩 문자열`,
			json_string: `JSON 문자열`,
			e164: `E.164 번호`,
			credit_card: `신용카드 번호`,
			currency_code: `통화 코드`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `입력`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `잘못된 입력: 예상 타입은 instanceof ${e.expected}, 받은 타입은 ${i}입니다` : `잘못된 입력: 예상 타입은 ${t}, 받은 타입은 ${i}입니다`;
				}
				case `invalid_value`: return e.values.length === 1 ? `잘못된 입력: 값은 ${j$3(e.values[0])} 이어야 합니다` : `잘못된 옵션: ${l$3(e.values, `또는 `)} 중 하나여야 합니다`;
				case `too_big`: {
					let n = e.inclusive ? `이하` : `미만`;
					let r = n === `미만` ? `이어야 합니다` : `여야 합니다`;
					let i = t(e.origin);
					let a = i?.unit ?? `요소`;
					return i ? `${e.origin ?? `값`}이 너무 큽니다: ${e.maximum.toString()}${a} ${n}${r}` : `${e.origin ?? `값`}이 너무 큽니다: ${e.maximum.toString()} ${n}${r}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `이상` : `초과`;
					let r = n === `이상` ? `이어야 합니다` : `여야 합니다`;
					let i = t(e.origin);
					let a = i?.unit ?? `요소`;
					return i ? `${e.origin ?? `값`}이 너무 작습니다: ${e.minimum.toString()}${a} ${n}${r}` : `${e.origin ?? `값`}이 너무 작습니다: ${e.minimum.toString()} ${n}${r}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `잘못된 문자열: "${t.prefix}"(으)로 시작해야 합니다` : t.format === `ends_with` ? `잘못된 문자열: "${t.suffix}"(으)로 끝나야 합니다` : t.format === `includes` ? `잘못된 문자열: "${t.includes}"을(를) 포함해야 합니다` : t.format === `regex` ? `잘못된 문자열: 정규식 ${t.pattern} 패턴과 일치해야 합니다` : `잘못된 ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `잘못된 숫자: ${e.divisor}의 배수여야 합니다`;
				case `unrecognized_keys`: return `인식할 수 없는 키: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `잘못된 키: ${e.origin}`;
				case `invalid_union`: return `잘못된 입력`;
				case `invalid_element`: return `잘못된 값: ${e.origin}`;
				default: return `잘못된 입력`;
			}
		};
	};
	$o$1 = (e) => e.charAt(0).toUpperCase() + e.slice(1);
	ts$1 = () => {
		let e = {
			string: {
				unit: {
					one: `simbolis`,
					few: `simboliai`,
					many: `simbolių`
				},
				verb: {
					smaller: {
						inclusive: `turi būti ne ilgesnė kaip`,
						notInclusive: `turi būti trumpesnė kaip`
					},
					bigger: {
						inclusive: `turi būti ne trumpesnė kaip`,
						notInclusive: `turi būti ilgesnė kaip`
					}
				}
			},
			file: {
				unit: {
					one: `baitas`,
					few: `baitai`,
					many: `baitų`
				},
				verb: {
					smaller: {
						inclusive: `turi būti ne didesnis kaip`,
						notInclusive: `turi būti mažesnis kaip`
					},
					bigger: {
						inclusive: `turi būti ne mažesnis kaip`,
						notInclusive: `turi būti didesnis kaip`
					}
				}
			},
			array: {
				unit: {
					one: `elementą`,
					few: `elementus`,
					many: `elementų`
				},
				verb: {
					smaller: {
						inclusive: `turi turėti ne daugiau kaip`,
						notInclusive: `turi turėti mažiau kaip`
					},
					bigger: {
						inclusive: `turi turėti ne mažiau kaip`,
						notInclusive: `turi turėti daugiau kaip`
					}
				}
			},
			set: {
				unit: {
					one: `elementą`,
					few: `elementus`,
					many: `elementų`
				},
				verb: {
					smaller: {
						inclusive: `turi turėti ne daugiau kaip`,
						notInclusive: `turi turėti mažiau kaip`
					},
					bigger: {
						inclusive: `turi turėti ne mažiau kaip`,
						notInclusive: `turi turėti daugiau kaip`
					}
				}
			}
		};
		function t(t, n, r, i) {
			let a = e[t] ?? null;
			return a === null ? a : {
				unit: a.unit[n],
				verb: a.verb[i][r ? `inclusive` : `notInclusive`]
			};
		}
		let n = {
			regex: `įvestis`,
			email: `el. pašto adresas`,
			url: `URL`,
			emoji: `jaustukas`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO data ir laikas`,
			date: `ISO data`,
			time: `ISO laikas`,
			duration: `ISO trukmė`,
			ipv4: `IPv4 adresas`,
			ipv6: `IPv6 adresas`,
			mac: `MAC adresas`,
			cidrv4: `IPv4 tinklo prefiksas (CIDR)`,
			cidrv6: `IPv6 tinklo prefiksas (CIDR)`,
			base64: `base64 užkoduota eilutė`,
			base64url: `base64url užkoduota eilutė`,
			json_string: `JSON eilutė`,
			e164: `E.164 numeris`,
			credit_card: `kredito kortelės numeris`,
			currency_code: `valiutos kodas`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `įvestis`
		};
		let r = {
			nan: `NaN`,
			number: `skaičius`,
			bigint: `sveikasis skaičius`,
			string: `eilutė`,
			boolean: `loginė reikšmė`,
			undefined: `neapibrėžta reikšmė`,
			function: `funkcija`,
			symbol: `simbolis`,
			array: `masyvas`,
			object: `objektas`,
			null: `nulinė reikšmė`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Gautas tipas ${i}, o tikėtasi - instanceof ${e.expected}` : `Gautas tipas ${i}, o tikėtasi - ${t}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Privalo būti ${j$3(e.values[0])}` : `Privalo būti vienas iš ${l$3(e.values, `|`)} pasirinkimų`;
				case `too_big`: {
					let n = r[e.origin] ?? e.origin;
					let i = t(e.origin, es$1(Number(e.maximum)), e.inclusive ?? !1, `smaller`);
					if (i?.verb) return `${$o$1(n ?? e.origin ?? `reikšmė`)} ${i.verb} ${e.maximum.toString()} ${i.unit ?? `elementų`}`;
					let a = e.inclusive ? `ne didesnis kaip` : `mažesnis kaip`;
					return `${$o$1(n ?? e.origin ?? `reikšmė`)} turi būti ${a} ${e.maximum.toString()} ${i?.unit}`;
				}
				case `too_small`: {
					let n = r[e.origin] ?? e.origin;
					let i = t(e.origin, es$1(Number(e.minimum)), e.inclusive ?? !1, `bigger`);
					if (i?.verb) return `${$o$1(n ?? e.origin ?? `reikšmė`)} ${i.verb} ${e.minimum.toString()} ${i.unit ?? `elementų`}`;
					let a = e.inclusive ? `ne mažesnis kaip` : `didesnis kaip`;
					return `${$o$1(n ?? e.origin ?? `reikšmė`)} turi būti ${a} ${e.minimum.toString()} ${i?.unit}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Eilutė privalo prasidėti "${t.prefix}"` : t.format === `ends_with` ? `Eilutė privalo pasibaigti "${t.suffix}"` : t.format === `includes` ? `Eilutė privalo įtraukti "${t.includes}"` : t.format === `regex` ? `Eilutė privalo atitikti ${t.pattern}` : `Neteisingas ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Skaičius privalo būti ${e.divisor} kartotinis.`;
				case `unrecognized_keys`: return `Neatpažint${e.keys.length > 1 ? `i` : `as`} rakt${e.keys.length > 1 ? `ai` : `as`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Rastas klaidingas raktas`;
				case `invalid_union`: return `Klaidinga įvestis`;
				case `invalid_element`: {
					let t = r[e.origin] ?? e.origin;
					return `${$o$1(t ?? e.origin ?? `reikšmė`)} turi klaidingą įvestį`;
				}
				default: return `Klaidinga įvestis`;
			}
		};
	};
	rs$1 = () => {
		let e = {
			string: {
				unit: `знаци`,
				verb: `да имаат`
			},
			file: {
				unit: `бајти`,
				verb: `да имаат`
			},
			array: {
				unit: `ставки`,
				verb: `да имаат`
			},
			set: {
				unit: `ставки`,
				verb: `да имаат`
			},
			map: {
				unit: `ставки`,
				verb: `да имаат`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `внес`,
			email: `адреса на е-пошта`,
			url: `URL`,
			emoji: `емоџи`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO датум и време`,
			date: `ISO датум`,
			time: `ISO време`,
			duration: `ISO времетраење`,
			ipv4: `IPv4 адреса`,
			ipv6: `IPv6 адреса`,
			mac: `MAC адреса`,
			cidrv4: `IPv4 опсег`,
			cidrv6: `IPv6 опсег`,
			base64: `base64-енкодирана низа`,
			base64url: `base64url-енкодирана низа`,
			json_string: `JSON низа`,
			e164: `E.164 број`,
			credit_card: `број на кредитна картичка`,
			currency_code: `код на валута`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `внес`
		};
		let r = {
			nan: `NaN`,
			number: `број`,
			array: `низа`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Грешен внес: се очекува instanceof ${e.expected}, примено ${i}` : `Грешен внес: се очекува ${t}, примено ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Invalid input: expected ${j$3(e.values[0])}` : `Грешана опција: се очекува една ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Премногу голем: се очекува ${e.origin ?? `вредноста`} да има ${n}${e.maximum.toString()} ${r.unit ?? `елементи`}` : `Премногу голем: се очекува ${e.origin ?? `вредноста`} да биде ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Премногу мал: се очекува ${e.origin} да има ${n}${e.minimum.toString()} ${r.unit}` : `Премногу мал: се очекува ${e.origin} да биде ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Неважечка низа: мора да започнува со "${t.prefix}"` : t.format === `ends_with` ? `Неважечка низа: мора да завршува со "${t.suffix}"` : t.format === `includes` ? `Неважечка низа: мора да вклучува "${t.includes}"` : t.format === `regex` ? `Неважечка низа: мора да одгоара на патернот ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Грешен број: мора да биде делив со ${e.divisor}`;
				case `unrecognized_keys`: return `${e.keys.length > 1 ? `Непрепознаени клучеви` : `Непрепознаен клуч`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Грешен клуч во ${e.origin}`;
				case `invalid_union`: return `Грешен внес`;
				case `invalid_element`: return `Грешна вредност во ${e.origin}`;
				default: return `Грешен внес`;
			}
		};
	};
	as$1 = () => {
		let e = {
			string: {
				unit: `aksara`,
				verb: `mempunyai`
			},
			file: {
				unit: `bait`,
				verb: `mempunyai`
			},
			array: {
				unit: `elemen`,
				verb: `mempunyai`
			},
			set: {
				unit: `elemen`,
				verb: `mempunyai`
			},
			map: {
				unit: `elemen`,
				verb: `mempunyai`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `alamat e-mel`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `tarikh masa ISO`,
			date: `tarikh ISO`,
			time: `masa ISO`,
			duration: `tempoh ISO`,
			ipv4: `alamat IPv4`,
			ipv6: `alamat IPv6`,
			mac: `alamat MAC`,
			cidrv4: `julat IPv4`,
			cidrv6: `julat IPv6`,
			base64: `string dikodkan base64`,
			base64url: `string dikodkan base64url`,
			json_string: `string JSON`,
			e164: `nombor E.164`,
			credit_card: `nombor kad kredit`,
			currency_code: `kod mata wang`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = {
			nan: `NaN`,
			number: `nombor`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Input tidak sah: dijangka instanceof ${e.expected}, diterima ${i}` : `Input tidak sah: dijangka ${t}, diterima ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Input tidak sah: dijangka ${j$3(e.values[0])}` : `Pilihan tidak sah: dijangka salah satu daripada ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Terlalu besar: dijangka ${e.origin ?? `nilai`} ${r.verb} ${n}${e.maximum.toString()} ${r.unit ?? `elemen`}` : `Terlalu besar: dijangka ${e.origin ?? `nilai`} adalah ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Terlalu kecil: dijangka ${e.origin} ${r.verb} ${n}${e.minimum.toString()} ${r.unit}` : `Terlalu kecil: dijangka ${e.origin} adalah ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `String tidak sah: mesti bermula dengan "${t.prefix}"` : t.format === `ends_with` ? `String tidak sah: mesti berakhir dengan "${t.suffix}"` : t.format === `includes` ? `String tidak sah: mesti mengandungi "${t.includes}"` : t.format === `regex` ? `String tidak sah: mesti sepadan dengan corak ${t.pattern}` : `${n[t.format] ?? e.format} tidak sah`;
				}
				case `not_multiple_of`: return `Nombor tidak sah: perlu gandaan ${e.divisor}`;
				case `unrecognized_keys`: return `Kunci tidak dikenali: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Kunci tidak sah dalam ${e.origin}`;
				case `invalid_union`: return `Input tidak sah`;
				case `invalid_element`: return `Nilai tidak sah dalam ${e.origin}`;
				default: return `Input tidak sah`;
			}
		};
	};
	ss$1 = () => {
		let e = {
			string: {
				unit: `अक्षर`,
				verb: `हुनुपर्छ`
			},
			file: {
				unit: `बाइट`,
				verb: `हुनुपर्छ`
			},
			array: {
				unit: `तत्व`,
				verb: `हुनुपर्छ`
			},
			set: {
				unit: `तत्व`,
				verb: `हुनुपर्छ`
			},
			map: {
				unit: `प्रविष्टि`,
				verb: `हुनुपर्छ`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `इनपुट`,
			email: `इमेल ठेगाना`,
			url: `URL`,
			emoji: `इमोजी`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO मिति र समय`,
			date: `ISO मिति`,
			time: `ISO समय`,
			duration: `ISO अवधि`,
			ipv4: `IPv4 ठेगाना`,
			ipv6: `IPv6 ठेगाना`,
			mac: `MAC ठेगाना`,
			cidrv4: `IPv4 दायरा`,
			cidrv6: `IPv6 दायरा`,
			base64: `base64-इन्कोड गरिएको स्ट्रिङ`,
			base64url: `base64url-इन्कोड गरिएको स्ट्रिङ`,
			json_string: `JSON स्ट्रिङ`,
			e164: `E.164 नम्बर`,
			credit_card: `क्रेडिट कार्ड नम्बर`,
			currency_code: `मुद्रा कोड`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `इनपुट`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `अमान्य इनपुट: अपेक्षित ${t}, प्राप्त ${r[n] ?? n}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `अमान्य इनपुट: अपेक्षित ${j$3(e.values[0])}` : `अमान्य विकल्प: अपेक्षित मानहरू मध्ये एक ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `धेरै ठूलो: ${e.origin ?? `मान`} मा ${n}${e.maximum.toString()} ${r.unit} ${r.verb}` : `धेरै ठूलो: ${e.origin ?? `मान`} ${n}${e.maximum.toString()} हुनुपर्छ`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `धेरै सानो: ${e.origin} मा ${n}${e.minimum.toString()} ${r.unit} ${r.verb}` : `धेरै सानो: ${e.origin} ${n}${e.minimum.toString()} हुनुपर्छ`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `अमान्य स्ट्रिङ: "${t.prefix}" बाट सुरु हुनुपर्छ` : t.format === `ends_with` ? `अमान्य स्ट्रिङ: "${t.suffix}" मा समाप्त हुनुपर्छ` : t.format === `includes` ? `अमान्य स्ट्रिङ: "${t.includes}" समावेश हुनुपर्छ` : t.format === `regex` ? `अमान्य स्ट्रिङ: ढाँचा ${t.pattern} सँग मेल खानुपर्छ` : `अमान्य ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `अमान्य संख्या: ${e.divisor} को गुणज हुनुपर्छ`;
				case `unrecognized_keys`: return `अपरिचित कुञ्जी${e.keys.length > 1 ? `हरू` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `अमान्य कुञ्जी: ${e.origin} मा`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `अमान्य डिस्क्रिमिनेटर मान: अपेक्षित ${e.options.map((e) => `'${e}'`).join(` | `)}` : `अमान्य इनपुट`;
				case `invalid_element`: return `अमान्य मान: ${e.origin} मा`;
				default: return `अमान्य इनपुट`;
			}
		};
	};
	ls$1 = () => {
		let e = {
			string: {
				unit: `tekens`,
				verb: `heeft`
			},
			file: {
				unit: `bytes`,
				verb: `heeft`
			},
			array: {
				unit: `elementen`,
				verb: `heeft`
			},
			set: {
				unit: `elementen`,
				verb: `heeft`
			},
			map: {
				unit: `elementen`,
				verb: `heeft`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `invoer`,
			email: `emailadres`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO datum en tijd`,
			date: `ISO datum`,
			time: `ISO tijd`,
			duration: `ISO duur`,
			ipv4: `IPv4-adres`,
			ipv6: `IPv6-adres`,
			mac: `MAC-adres`,
			cidrv4: `IPv4-bereik`,
			cidrv6: `IPv6-bereik`,
			base64: `base64-gecodeerde tekst`,
			base64url: `base64 URL-gecodeerde tekst`,
			json_string: `JSON string`,
			e164: `E.164-nummer`,
			credit_card: `creditcardnummer`,
			currency_code: `valutacode`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `invoer`
		};
		let r = {
			nan: `NaN`,
			number: `getal`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Ongeldige invoer: verwacht instanceof ${e.expected}, ontving ${i}` : `Ongeldige invoer: verwacht ${t}, ontving ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Ongeldige invoer: verwacht ${j$3(e.values[0])}` : `Ongeldige optie: verwacht één van ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					let i = e.origin === `date` ? `laat` : e.origin === `string` ? `lang` : `groot`;
					return r ? `Te ${i}: verwacht dat ${e.origin ?? `waarde`} ${n}${e.maximum.toString()} ${r.unit ?? `elementen`} ${r.verb}` : `Te ${i}: verwacht dat ${e.origin ?? `waarde`} ${n}${e.maximum.toString()} is`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					let i = e.origin === `date` ? `vroeg` : e.origin === `string` ? `kort` : `klein`;
					return r ? `Te ${i}: verwacht dat ${e.origin} ${n}${e.minimum.toString()} ${r.unit} ${r.verb}` : `Te ${i}: verwacht dat ${e.origin} ${n}${e.minimum.toString()} is`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ongeldige tekst: moet met "${t.prefix}" beginnen` : t.format === `ends_with` ? `Ongeldige tekst: moet op "${t.suffix}" eindigen` : t.format === `includes` ? `Ongeldige tekst: moet "${t.includes}" bevatten` : t.format === `regex` ? `Ongeldige tekst: moet overeenkomen met patroon ${t.pattern}` : `Ongeldig: ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Ongeldig getal: moet een veelvoud van ${e.divisor} zijn`;
				case `unrecognized_keys`: return `Onbekende key${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Ongeldige key in ${e.origin}`;
				case `invalid_union`: return `Ongeldige invoer`;
				case `invalid_element`: return `Ongeldige waarde in ${e.origin}`;
				default: return `Ongeldige invoer`;
			}
		};
	};
	ds$1 = () => {
		let e = {
			string: {
				unit: `teikn`,
				verb: `å ha`
			},
			file: {
				unit: `bytes`,
				verb: `å ha`
			},
			array: {
				unit: `element`,
				verb: `å innehalde`
			},
			set: {
				unit: `element`,
				verb: `å innehalde`
			},
			map: {
				unit: `element`,
				verb: `å innehalde`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `e-postadresse`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO dato- og klokkeslett`,
			date: `ISO-dato`,
			time: `ISO-klokkeslett`,
			duration: `ISO-varigheit`,
			ipv4: `IPv4-adresse`,
			ipv6: `IPv6-adresse`,
			mac: `MAC-adresse`,
			cidrv4: `IPv4-spekter`,
			cidrv6: `IPv6-spekter`,
			base64: `base64-enkoda streng`,
			base64url: `base64url-enkoda streng`,
			json_string: `JSON-streng`,
			e164: `E.164-nummer`,
			credit_card: `kredittkortnummer`,
			currency_code: `valutakode`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = {
			nan: `NaN`,
			number: `tal`,
			array: `liste`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Ugyldig input: forventa instanceof ${e.expected}, fekk ${i}` : `Ugyldig input: forventa ${t}, fekk ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Ugyldig verdi: forventa ${j$3(e.values[0])}` : `Ugyldig val: forventa eitt av ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `For stor(t): forventa ${e.origin ?? `value`} til å ha ${n}${e.maximum.toString()} ${r.unit ?? `element`}` : `For stor(t): forventa ${e.origin ?? `value`} til å ha ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `For lite(n): forventa ${e.origin} til å ha ${n}${e.minimum.toString()} ${r.unit}` : `For lite(n): forventa ${e.origin} til å ha ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ugyldig streng: må starte med "${t.prefix}"` : t.format === `ends_with` ? `Ugyldig streng: må slutte med "${t.suffix}"` : t.format === `includes` ? `Ugyldig streng: må innehalde "${t.includes}"` : t.format === `regex` ? `Ugyldig streng: må matche mønsteret ${t.pattern}` : `Ugyldig ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Ugyldig tal: må vere eit multiplum av ${e.divisor}`;
				case `unrecognized_keys`: return `${e.keys.length > 1 ? `Ukjende nøklar` : `Ukjend nøkkel`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Ugyldig nøkkel i ${e.origin}`;
				case `invalid_union`: return `Ugyldig input`;
				case `invalid_element`: return `Ugyldig verdi i ${e.origin}`;
				default: return `Ugyldig input`;
			}
		};
	};
	ps$1 = () => {
		let e = {
			string: {
				unit: `tegn`,
				verb: `å ha`
			},
			file: {
				unit: `bytes`,
				verb: `å ha`
			},
			array: {
				unit: `elementer`,
				verb: `å inneholde`
			},
			set: {
				unit: `elementer`,
				verb: `å inneholde`
			},
			map: {
				unit: `elementer`,
				verb: `å inneholde`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `input`,
			email: `e-postadresse`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO dato- og klokkeslett`,
			date: `ISO-dato`,
			time: `ISO-klokkeslett`,
			duration: `ISO-varighet`,
			ipv4: `IPv4-adresse`,
			ipv6: `IPv6-adresse`,
			mac: `MAC-adresse`,
			cidrv4: `IPv4-spekter`,
			cidrv6: `IPv6-spekter`,
			base64: `base64-enkodet streng`,
			base64url: `base64url-enkodet streng`,
			json_string: `JSON-streng`,
			e164: `E.164-nummer`,
			credit_card: `kredittkortnummer`,
			currency_code: `valutakode`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = {
			nan: `NaN`,
			number: `tall`,
			array: `liste`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Ugyldig input: forventet instanceof ${e.expected}, fikk ${i}` : `Ugyldig input: forventet ${t}, fikk ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Ugyldig verdi: forventet ${j$3(e.values[0])}` : `Ugyldig valg: forventet en av ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `For stor(t): forventet ${e.origin ?? `value`} til å ha ${n}${e.maximum.toString()} ${r.unit ?? `elementer`}` : `For stor(t): forventet ${e.origin ?? `value`} til å ha ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `For lite(n): forventet ${e.origin} til å ha ${n}${e.minimum.toString()} ${r.unit}` : `For lite(n): forventet ${e.origin} til å ha ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ugyldig streng: må starte med "${t.prefix}"` : t.format === `ends_with` ? `Ugyldig streng: må ende med "${t.suffix}"` : t.format === `includes` ? `Ugyldig streng: må inneholde "${t.includes}"` : t.format === `regex` ? `Ugyldig streng: må matche mønsteret ${t.pattern}` : `Ugyldig ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Ugyldig tall: må være et multiplum av ${e.divisor}`;
				case `unrecognized_keys`: return `${e.keys.length > 1 ? `Ukjente nøkler` : `Ukjent nøkkel`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Ugyldig nøkkel i ${e.origin}`;
				case `invalid_union`: return `Ugyldig input`;
				case `invalid_element`: return `Ugyldig verdi i ${e.origin}`;
				default: return `Ugyldig input`;
			}
		};
	};
	hs$1 = () => {
		let e = {
			string: {
				unit: `harf`,
				verb: `olmalıdır`
			},
			file: {
				unit: `bayt`,
				verb: `olmalıdır`
			},
			array: {
				unit: `unsur`,
				verb: `olmalıdır`
			},
			set: {
				unit: `unsur`,
				verb: `olmalıdır`
			},
			map: {
				unit: `unsur`,
				verb: `olmalıdır`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `giren`,
			email: `epostagâh`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO hengâmı`,
			date: `ISO tarihi`,
			time: `ISO zamanı`,
			duration: `ISO müddeti`,
			ipv4: `IPv4 nişânı`,
			ipv6: `IPv6 nişânı`,
			mac: `MAC nişânı`,
			cidrv4: `IPv4 menzili`,
			cidrv6: `IPv6 menzili`,
			base64: `base64-şifreli metin`,
			base64url: `base64url-şifreli metin`,
			json_string: `JSON metin`,
			e164: `E.164 sayısı`,
			credit_card: `i'tibâr kartı numarası`,
			currency_code: `para birimi kodu`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `giren`
		};
		let r = {
			nan: `NaN`,
			number: `numara`,
			array: `saf`,
			null: `gayb`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Fâsit giren: umulan instanceof ${e.expected}, alınan ${i}` : `Fâsit giren: umulan ${t}, alınan ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Fâsit giren: umulan ${j$3(e.values[0])}` : `Fâsit tercih: mûteberler ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Fazla büyük: ${e.origin ?? `value`}, ${n}${e.maximum.toString()} ${r.unit ?? `elements`} sahip olmalıydı.` : `Fazla büyük: ${e.origin ?? `value`}, ${n}${e.maximum.toString()} olmalıydı.`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Fazla küçük: ${e.origin}, ${n}${e.minimum.toString()} ${r.unit} sahip olmalıydı.` : `Fazla küçük: ${e.origin}, ${n}${e.minimum.toString()} olmalıydı.`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Fâsit metin: "${t.prefix}" ile başlamalı.` : t.format === `ends_with` ? `Fâsit metin: "${t.suffix}" ile bitmeli.` : t.format === `includes` ? `Fâsit metin: "${t.includes}" ihtivâ etmeli.` : t.format === `regex` ? `Fâsit metin: ${t.pattern} nakşına uymalı.` : `Fâsit ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Fâsit sayı: ${e.divisor} katı olmalıydı.`;
				case `unrecognized_keys`: return `Tanınmayan anahtar ${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} için tanınmayan anahtar var.`;
				case `invalid_union`: return `Giren tanınamadı.`;
				case `invalid_element`: return `${e.origin} için tanınmayan kıymet var.`;
				default: return `Kıymet tanınamadı.`;
			}
		};
	};
	_s$1 = () => {
		let e = {
			string: {
				unit: `توکي`,
				verb: `ولري`
			},
			file: {
				unit: `بایټس`,
				verb: `ولري`
			},
			array: {
				unit: `توکي`,
				verb: `ولري`
			},
			set: {
				unit: `توکي`,
				verb: `ولري`
			},
			map: {
				unit: `توکي`,
				verb: `ولري`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ورودي`,
			email: `بریښنالیک`,
			url: `یو آر ال`,
			emoji: `ایموجي`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `نیټه او وخت`,
			date: `نېټه`,
			time: `وخت`,
			duration: `موده`,
			ipv4: `د IPv4 پته`,
			ipv6: `د IPv6 پته`,
			mac: `د MAC پته`,
			cidrv4: `د IPv4 ساحه`,
			cidrv6: `د IPv6 ساحه`,
			base64: `base64-encoded متن`,
			base64url: `base64url-encoded متن`,
			json_string: `JSON متن`,
			e164: `د E.164 شمېره`,
			credit_card: `د کریډیټ کارت شمیره`,
			currency_code: `د اسعارو کوډ`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ورودي`
		};
		let r = {
			nan: `NaN`,
			number: `عدد`,
			array: `ارې`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `ناسم ورودي: باید instanceof ${e.expected} وای, مګر ${i} ترلاسه شو` : `ناسم ورودي: باید ${t} وای, مګر ${i} ترلاسه شو`;
				}
				case `invalid_value`: return e.values.length === 1 ? `ناسم ورودي: باید ${j$3(e.values[0])} وای` : `ناسم انتخاب: باید یو له ${l$3(e.values, `|`)} څخه وای`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `ډیر لوی: ${e.origin ?? `ارزښت`} باید ${n}${e.maximum.toString()} ${r.unit ?? `عنصرونه`} ولري` : `ډیر لوی: ${e.origin ?? `ارزښت`} باید ${n}${e.maximum.toString()} وي`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `ډیر کوچنی: ${e.origin} باید ${n}${e.minimum.toString()} ${r.unit} ولري` : `ډیر کوچنی: ${e.origin} باید ${n}${e.minimum.toString()} وي`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `ناسم متن: باید د "${t.prefix}" سره پیل شي` : t.format === `ends_with` ? `ناسم متن: باید د "${t.suffix}" سره پای ته ورسيږي` : t.format === `includes` ? `ناسم متن: باید "${t.includes}" ولري` : t.format === `regex` ? `ناسم متن: باید د ${t.pattern} سره مطابقت ولري` : `${n[t.format] ?? e.format} ناسم دی`;
				}
				case `not_multiple_of`: return `ناسم عدد: باید د ${e.divisor} مضرب وي`;
				case `unrecognized_keys`: return `ناسم ${e.keys.length > 1 ? `کلیډونه` : `کلیډ`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `ناسم کلیډ په ${e.origin} کې`;
				case `invalid_union`: return `ناسمه ورودي`;
				case `invalid_element`: return `ناسم عنصر په ${e.origin} کې`;
				default: return `ناسمه ورودي`;
			}
		};
	};
	ys$1 = () => {
		let e = {
			string: {
				unit: `znaków`,
				verb: `mieć`
			},
			file: {
				unit: `bajtów`,
				verb: `mieć`
			},
			array: {
				unit: `elementów`,
				verb: `mieć`
			},
			set: {
				unit: `elementów`,
				verb: `mieć`
			},
			map: {
				unit: `elementów`,
				verb: `mieć`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `wyrażenie`,
			email: `adres email`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `data i godzina w formacie ISO`,
			date: `data w formacie ISO`,
			time: `godzina w formacie ISO`,
			duration: `czas trwania ISO`,
			ipv4: `adres IPv4`,
			ipv6: `adres IPv6`,
			mac: `adres MAC`,
			cidrv4: `zakres IPv4`,
			cidrv6: `zakres IPv6`,
			base64: `ciąg znaków zakodowany w formacie base64`,
			base64url: `ciąg znaków zakodowany w formacie base64url`,
			json_string: `ciąg znaków w formacie JSON`,
			e164: `liczba E.164`,
			credit_card: `numer karty kredytowej`,
			currency_code: `kod waluty`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `wejście`
		};
		let r = {
			nan: `NaN`,
			number: `liczba`,
			array: `tablica`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${e.expected}, otrzymano ${i}` : `Nieprawidłowe dane wejściowe: oczekiwano ${t}, otrzymano ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Nieprawidłowe dane wejściowe: oczekiwano ${j$3(e.values[0])}` : `Nieprawidłowa opcja: oczekiwano jednej z wartości ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Za duża wartość: oczekiwano, że ${e.origin ?? `wartość`} będzie mieć ${n}${e.maximum.toString()} ${r.unit ?? `elementów`}` : `Zbyt duż(y/a/e): oczekiwano, że ${e.origin ?? `wartość`} będzie wynosić ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Za mała wartość: oczekiwano, że ${e.origin ?? `wartość`} będzie mieć ${n}${e.minimum.toString()} ${r.unit ?? `elementów`}` : `Zbyt mał(y/a/e): oczekiwano, że ${e.origin ?? `wartość`} będzie wynosić ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Nieprawidłowy ciąg znaków: musi zaczynać się od "${t.prefix}"` : t.format === `ends_with` ? `Nieprawidłowy ciąg znaków: musi kończyć się na "${t.suffix}"` : t.format === `includes` ? `Nieprawidłowy ciąg znaków: musi zawierać "${t.includes}"` : t.format === `regex` ? `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${t.pattern}` : `Nieprawidłow(y/a/e) ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Nieprawidłowa liczba: musi być wielokrotnością ${e.divisor}`;
				case `unrecognized_keys`: return `Nierozpoznane klucze${e.keys.length > 1 ? `s` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Nieprawidłowy klucz w ${e.origin}`;
				case `invalid_union`: return `Nieprawidłowe dane wejściowe`;
				case `invalid_element`: return `Nieprawidłowa wartość w ${e.origin}`;
				default: return `Nieprawidłowe dane wejściowe`;
			}
		};
	};
	xs$1 = () => {
		let e = {
			string: { unit: `caracteres` },
			file: { unit: `bytes` },
			array: { unit: `elementos` },
			set: { unit: `elementos` },
			map: { unit: `entradas` }
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `a entrada`,
			email: `o endereço de e-mail`,
			url: `o URL`,
			emoji: `o emoji`,
			uuid: `o UUID`,
			uuidv4: `o UUIDv4`,
			uuidv6: `o UUIDv6`,
			nanoid: `o nanoid`,
			guid: `o GUID`,
			cuid: `o cuid`,
			cuid2: `o cuid2`,
			ulid: `o ULID`,
			xid: `o XID`,
			ksuid: `o KSUID`,
			datetime: `a data e hora ISO`,
			date: `a data ISO`,
			time: `a hora ISO`,
			duration: `a duração ISO`,
			ipv4: `o endereço IPv4`,
			ipv6: `o endereço IPv6`,
			mac: `o endereço MAC`,
			cidrv4: `o intervalo de endereços IPv4`,
			cidrv6: `o intervalo de endereços IPv6`,
			base64: `o texto codificado em base64`,
			base64url: `o texto codificado em base64url`,
			json_string: `o texto JSON`,
			e164: `o número E.164`,
			credit_card: `o número de cartão de crédito`,
			currency_code: `o código de moeda`,
			iban: `o IBAN`,
			jwt: `o JWT`,
			template_literal: `a entrada`
		};
		let r = {
			masculine: {
				definite: `o`,
				indefinite: `um`
			},
			feminine: {
				definite: `a`,
				indefinite: `uma`
			}
		};
		let i = {
			string: {
				name: `texto`,
				articles: r.masculine
			},
			number: {
				name: `número`,
				articles: r.masculine
			},
			int: {
				name: `número inteiro`,
				articles: r.masculine
			},
			boolean: {
				name: `valor booleano`,
				articles: r.masculine
			},
			bigint: {
				name: `número bigint`,
				articles: r.masculine
			},
			symbol: {
				name: `símbolo`,
				articles: r.masculine
			},
			undefined: {
				name: `valor "undefined"`,
				articles: r.masculine
			},
			null: {
				name: `valor "nulo"`,
				articles: r.masculine
			},
			never: {
				name: `valor "never"`,
				articles: r.masculine
			},
			void: {
				name: `valor "void"`,
				articles: r.masculine
			},
			date: {
				name: `data`,
				articles: r.feminine
			},
			array: {
				name: `vetor`,
				articles: r.masculine
			},
			object: {
				name: `objeto`,
				articles: r.masculine
			},
			tuple: {
				name: `tuplo`,
				articles: r.masculine
			},
			record: {
				name: `registo`,
				articles: r.masculine
			},
			map: {
				name: `mapa`,
				articles: r.masculine
			},
			set: {
				name: `conjunto`,
				articles: r.masculine
			},
			file: {
				name: `ficheiro`,
				articles: r.masculine
			},
			nonoptional: {
				name: `valor não opcional`,
				articles: r.masculine
			},
			nan: {
				name: `valor "NaN"`,
				articles: r.masculine
			},
			function: {
				name: `função`,
				articles: r.feminine
			}
		};
		function a(e, t) {
			let n = i[e] ?? {
				name: `valor "${e}"`,
				articles: r.masculine
			};
			return `${n.articles[t]} ${n.name}`;
		}
		return (e) => {
			switch (e.code) {
				case `invalid_type`: return `Entrada inválida: esperava ${a(e.expected, `indefinite`)}, recebeu ${a(q$3(e.input), `indefinite`)}`;
				case `invalid_value`: return e.values.length === 1 ? `Entrada inválida: esperava ${j$3(e.values[0])}` : `Opção inválida: esperava uma das seguintes opções: ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Demasiado grande: esperava que ${a(e.origin, `definite`)} tivesse ${n} ${e.maximum.toString()} ${r.unit ?? `elementos`}` : `Demasiado grande: esperava que ${a(e.origin, `definite`)} fosse ${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Demasiado pequeno: esperava que ${a(e.origin, `definite`)} tivesse ${n} ${e.minimum.toString()} ${r.unit ?? `elementos`}` : `Demasiado pequeno: esperava que ${a(e.origin, `definite`)} fosse ${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Texto inválido: deve começar por "${t.prefix}"` : t.format === `ends_with` ? `Texto inválido: deve terminar em "${t.suffix}"` : t.format === `includes` ? `Texto inválido: deve incluir "${t.includes}"` : t.format === `regex` ? `Texto inválido: deve corresponder ao padrão ${t.pattern}` : `Formato d${n[t.format] ?? e.format} inválido`;
				}
				case `not_multiple_of`: return `Número inválido: deve ser múltiplo de ${e.divisor}`;
				case `unrecognized_keys`: {
					let t = e.keys.length > 1 ? `s` : ``;
					return `Chave${t} inválida${t}: ${l$3(e.keys, `, `)}`;
				}
				case `invalid_key`: return `Entrada inválida n${a(e.origin, `definite`)}`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Valor de discriminação inválido. Esperava ${e.options.map((e) => `'${e}'`).join(` | `)}` : `Entrada inválida`;
				case `invalid_element`: return `Entrada inválida n${a(e.origin, `definite`)}`;
				default: return `Entrada inválida`;
			}
		};
	};
	Cs$1 = () => {
		let e = {
			string: { unit: `caracteres` },
			file: { unit: `bytes` },
			array: { unit: `elementos` },
			set: { unit: `elementos` },
			map: { unit: `entradas` }
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `a entrada`,
			email: `o endereço de e-mail`,
			url: `o URL`,
			emoji: `o emoji`,
			uuid: `o UUID`,
			uuidv4: `o UUIDv4`,
			uuidv6: `o UUIDv6`,
			nanoid: `o nanoid`,
			guid: `o GUID`,
			cuid: `o cuid`,
			cuid2: `o cuid2`,
			ulid: `o ULID`,
			xid: `o XID`,
			ksuid: `o KSUID`,
			datetime: `a data e hora ISO`,
			date: `a data ISO`,
			time: `a hora ISO`,
			duration: `a duração ISO`,
			ipv4: `o endereço IPv4`,
			ipv6: `o endereço IPv6`,
			mac: `o endereço MAC`,
			cidrv4: `a faixa de endereços IPv4`,
			cidrv6: `a faixa de endereços IPv6`,
			base64: `o texto codificado em base64`,
			base64url: `o texto codificado em base64url`,
			json_string: `o texto JSON`,
			e164: `o número E.164`,
			credit_card: `o número de cartão de crédito`,
			currency_code: `o código de moeda`,
			iban: `o IBAN`,
			jwt: `o JWT`,
			template_literal: `a entrada`
		};
		let r = {
			masculine: {
				definite: `o`,
				indefinite: `um`
			},
			feminine: {
				definite: `a`,
				indefinite: `uma`
			}
		};
		let i = {
			string: {
				name: `texto`,
				articles: r.masculine
			},
			number: {
				name: `número`,
				articles: r.masculine
			},
			int: {
				name: `número inteiro`,
				articles: r.masculine
			},
			boolean: {
				name: `valor booleano`,
				articles: r.masculine
			},
			bigint: {
				name: `número bigint`,
				articles: r.masculine
			},
			symbol: {
				name: `símbolo`,
				articles: r.masculine
			},
			undefined: {
				name: `valor "undefined"`,
				articles: r.masculine
			},
			null: {
				name: `valor "nulo"`,
				articles: r.masculine
			},
			never: {
				name: `valor "never"`,
				articles: r.masculine
			},
			void: {
				name: `valor "void"`,
				articles: r.masculine
			},
			date: {
				name: `data`,
				articles: r.feminine
			},
			array: {
				name: `vetor`,
				articles: r.masculine
			},
			object: {
				name: `objeto`,
				articles: r.masculine
			},
			tuple: {
				name: `tupla`,
				articles: r.feminine
			},
			record: {
				name: `registro`,
				articles: r.masculine
			},
			map: {
				name: `mapa`,
				articles: r.masculine
			},
			set: {
				name: `conjunto`,
				articles: r.masculine
			},
			file: {
				name: `arquivo`,
				articles: r.masculine
			},
			nonoptional: {
				name: `valor não opcional`,
				articles: r.masculine
			},
			nan: {
				name: `valor "NaN"`,
				articles: r.masculine
			},
			function: {
				name: `função`,
				articles: r.feminine
			}
		};
		function a(e, t) {
			let n = i[e] ?? {
				name: `valor "${e}"`,
				articles: r.masculine
			};
			return `${n.articles[t]} ${n.name}`;
		}
		return (e) => {
			switch (e.code) {
				case `invalid_type`: return `Entrada inválida: esperava ${a(e.expected, `indefinite`)}, recebeu ${a(q$3(e.input), `indefinite`)}`;
				case `invalid_value`: return e.values.length === 1 ? `Entrada inválida: esperava ${j$3(e.values[0])}` : `Opção inválida: esperava uma das seguintes opções: ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Grande demais: esperava que ${a(e.origin, `definite`)} tivesse ${n} ${e.maximum.toString()} ${r.unit ?? `elementos`}` : `Grande demais: esperava que ${a(e.origin, `definite`)} fosse ${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Pequeno demais: esperava que ${a(e.origin, `definite`)} tivesse ${n} ${e.minimum.toString()} ${r.unit ?? `elementos`}` : `Pequeno demais: esperava que ${a(e.origin, `definite`)} fosse ${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Texto inválido: deve começar com "${t.prefix}"` : t.format === `ends_with` ? `Texto inválido: deve terminar com "${t.suffix}"` : t.format === `includes` ? `Texto inválido: deve incluir "${t.includes}"` : t.format === `regex` ? `Texto inválido: deve corresponder ao padrão ${t.pattern}` : `Formato d${n[t.format] ?? e.format} inválido`;
				}
				case `not_multiple_of`: return `Número inválido: deve ser múltiplo de ${e.divisor}`;
				case `unrecognized_keys`: {
					let t = e.keys.length > 1 ? `s` : ``;
					return `Chave${t} inválida${t}: ${l$3(e.keys, `, `)}`;
				}
				case `invalid_key`: return `Entrada inválida n${a(e.origin, `definite`)}`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Valor de discriminação inválido. Esperava ${e.options.map((e) => `'${e}'`).join(` | `)}` : `Entrada inválida`;
				case `invalid_element`: return `Entrada inválida n${a(e.origin, `definite`)}`;
				default: return `Entrada inválida`;
			}
		};
	};
	Ts$1 = () => {
		let e = {
			string: {
				unit: `caractere`,
				verb: `să aibă`
			},
			file: {
				unit: `octeți`,
				verb: `să aibă`
			},
			array: {
				unit: `elemente`,
				verb: `să aibă`
			},
			set: {
				unit: `elemente`,
				verb: `să aibă`
			},
			map: {
				unit: `intrări`,
				verb: `să aibă`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `intrare`,
			email: `adresă de email`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `dată și oră ISO`,
			date: `dată ISO`,
			time: `oră ISO`,
			duration: `durată ISO`,
			ipv4: `adresă IPv4`,
			ipv6: `adresă IPv6`,
			mac: `adresă MAC`,
			cidrv4: `interval IPv4`,
			cidrv6: `interval IPv6`,
			base64: `șir codat base64`,
			base64url: `șir codat base64url`,
			json_string: `șir JSON`,
			e164: `număr E.164`,
			credit_card: `număr de card de credit`,
			currency_code: `cod valutar`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `intrare`
		};
		let r = {
			nan: `NaN`,
			string: `șir`,
			number: `număr`,
			boolean: `boolean`,
			function: `funcție`,
			array: `matrice`,
			object: `obiect`,
			undefined: `nedefinit`,
			symbol: `simbol`,
			bigint: `număr mare`,
			void: `void`,
			never: `never`,
			map: `hartă`,
			set: `set`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `Intrare invalidă: așteptat ${t}, primit ${r[n] ?? n}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Intrare invalidă: așteptat ${j$3(e.values[0])}` : `Opțiune invalidă: așteptat una dintre ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Prea mare: așteptat ca ${e.origin ?? `valoarea`} ${r.verb} ${n}${e.maximum.toString()} ${r.unit ?? `elemente`}` : `Prea mare: așteptat ca ${e.origin ?? `valoarea`} să fie ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Prea mic: așteptat ca ${e.origin} ${r.verb} ${n}${e.minimum.toString()} ${r.unit}` : `Prea mic: așteptat ca ${e.origin} să fie ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Șir invalid: trebuie să înceapă cu "${t.prefix}"` : t.format === `ends_with` ? `Șir invalid: trebuie să se termine cu "${t.suffix}"` : t.format === `includes` ? `Șir invalid: trebuie să includă "${t.includes}"` : t.format === `regex` ? `Șir invalid: trebuie să se potrivească cu modelul ${t.pattern}` : `Format invalid: ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Număr invalid: trebuie să fie multiplu de ${e.divisor}`;
				case `unrecognized_keys`: return `Chei nerecunoscute: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Cheie invalidă în ${e.origin}`;
				case `invalid_union`: return `Intrare invalidă`;
				case `invalid_element`: return `Valoare invalidă în ${e.origin}`;
				default: return `Intrare invalidă`;
			}
		};
	};
	Os$1 = () => {
		let e = {
			string: {
				unit: {
					one: `символ`,
					few: `символа`,
					many: `символов`
				},
				verb: `иметь`
			},
			file: {
				unit: {
					one: `байт`,
					few: `байта`,
					many: `байт`
				},
				verb: `иметь`
			},
			array: {
				unit: {
					one: `элемент`,
					few: `элемента`,
					many: `элементов`
				},
				verb: `иметь`
			},
			set: {
				unit: {
					one: `элемент`,
					few: `элемента`,
					many: `элементов`
				},
				verb: `иметь`
			},
			map: {
				unit: {
					one: `элемент`,
					few: `элемента`,
					many: `элементов`
				},
				verb: `иметь`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ввод`,
			email: `email адрес`,
			url: `URL`,
			emoji: `эмодзи`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO дата и время`,
			date: `ISO дата`,
			time: `ISO время`,
			duration: `ISO длительность`,
			ipv4: `IPv4 адрес`,
			ipv6: `IPv6 адрес`,
			mac: `MAC адрес`,
			cidrv4: `IPv4 диапазон`,
			cidrv6: `IPv6 диапазон`,
			base64: `строка в формате base64`,
			base64url: `строка в формате base64url`,
			json_string: `JSON строка`,
			e164: `номер E.164`,
			credit_card: `номер кредитной карты`,
			currency_code: `код валюты`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ввод`
		};
		let r = {
			nan: `NaN`,
			number: `число`,
			array: `массив`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Неверный ввод: ожидалось instanceof ${e.expected}, получено ${i}` : `Неверный ввод: ожидалось ${t}, получено ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Неверный ввод: ожидалось ${j$3(e.values[0])}` : `Неверный вариант: ожидалось одно из ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					if (r) {
						let t = Ds$1(Number(e.maximum), r.unit.one, r.unit.few, r.unit.many);
						return `Слишком большое значение: ожидалось, что ${e.origin ?? `значение`} будет иметь ${n}${e.maximum.toString()} ${t}`;
					}
					return `Слишком большое значение: ожидалось, что ${e.origin ?? `значение`} будет ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					if (r) {
						let t = Ds$1(Number(e.minimum), r.unit.one, r.unit.few, r.unit.many);
						return `Слишком маленькое значение: ожидалось, что ${e.origin} будет иметь ${n}${e.minimum.toString()} ${t}`;
					}
					return `Слишком маленькое значение: ожидалось, что ${e.origin} будет ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Неверная строка: должна начинаться с "${t.prefix}"` : t.format === `ends_with` ? `Неверная строка: должна заканчиваться на "${t.suffix}"` : t.format === `includes` ? `Неверная строка: должна содержать "${t.includes}"` : t.format === `regex` ? `Неверная строка: должна соответствовать шаблону ${t.pattern}` : `Неверный ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Неверное число: должно быть кратным ${e.divisor}`;
				case `unrecognized_keys`: return `Нераспознанн${e.keys.length > 1 ? `ые` : `ый`} ключ${e.keys.length > 1 ? `и` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Неверный ключ в ${e.origin}`;
				case `invalid_union`: return `Неверные входные данные`;
				case `invalid_element`: return `Неверное значение в ${e.origin}`;
				default: return `Неверные входные данные`;
			}
		};
	};
	As$1 = () => {
		let e = {
			string: {
				unit: `znakov`,
				verb: `mať`
			},
			file: {
				unit: `bajtov`,
				verb: `mať`
			},
			array: {
				unit: `prvkov`,
				verb: `mať`
			},
			set: {
				unit: `prvkov`,
				verb: `mať`
			},
			map: {
				unit: `položiek`,
				verb: `mať`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `regulárny výraz`,
			email: `e-mailová adresa`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `dátum a čas vo formáte ISO`,
			date: `dátum vo formáte ISO`,
			time: `čas vo formáte ISO`,
			duration: `doba trvania ISO`,
			ipv4: `IPv4 adresa`,
			ipv6: `IPv6 adresa`,
			mac: `MAC adresa`,
			cidrv4: `rozsah IPv4`,
			cidrv6: `rozsah IPv6`,
			base64: `reťazec zakódovaný vo formáte base64`,
			base64url: `reťazec zakódovaný vo formáte base64url`,
			json_string: `reťazec vo formáte JSON`,
			e164: `číslo E.164`,
			credit_card: `číslo kreditnej karty`,
			currency_code: `kód meny`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `vstup`
		};
		let r = {
			nan: `NaN`,
			number: `číslo`,
			string: `reťazec`,
			function: `funkcia`,
			array: `pole`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Neplatný vstup: očakávané instanceof ${e.expected}, obdržané ${i}` : `Neplatný vstup: očakávané ${t}, obdržané ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Neplatný vstup: očakávané ${j$3(e.values[0])}` : `Neplatný vstup: očakávaná jedna z hodnôt ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Hodnota je príliš veľká: ${e.origin ?? `hodnota`} musí mať ${n}${e.maximum.toString()} ${r.unit ?? `prvkov`}` : `Hodnota je príliš veľká: ${e.origin ?? `hodnota`} musí byť ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Hodnota je príliš malá: ${e.origin ?? `hodnota`} musí mať ${n}${e.minimum.toString()} ${r.unit ?? `prvkov`}` : `Hodnota je príliš malá: ${e.origin ?? `hodnota`} musí byť ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Neplatný reťazec: musí začínať na "${t.prefix}"` : t.format === `ends_with` ? `Neplatný reťazec: musí končiť na "${t.suffix}"` : t.format === `includes` ? `Neplatný reťazec: musí obsahovať "${t.includes}"` : t.format === `regex` ? `Neplatný reťazec: musí zodpovedať vzoru ${t.pattern}` : `Neplatný formát ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Neplatné číslo: musí byť násobkom ${e.divisor}`;
				case `unrecognized_keys`: return `Neznáme klúče: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Neplatný klúč v ${e.origin}`;
				case `invalid_union`: return `Neplatný vstup`;
				case `invalid_element`: return `Neplatná hodnota v ${e.origin}`;
				default: return `Neplatný vstup`;
			}
		};
	};
	Ms$1 = () => {
		let e = {
			string: {
				unit: `znakov`,
				verb: `imeti`
			},
			file: {
				unit: `bajtov`,
				verb: `imeti`
			},
			array: {
				unit: `elementov`,
				verb: `imeti`
			},
			set: {
				unit: `elementov`,
				verb: `imeti`
			},
			map: {
				unit: `elementov`,
				verb: `imeti`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `vnos`,
			email: `e-poštni naslov`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO datum in čas`,
			date: `ISO datum`,
			time: `ISO čas`,
			duration: `ISO trajanje`,
			ipv4: `IPv4 naslov`,
			ipv6: `IPv6 naslov`,
			mac: `MAC naslov`,
			cidrv4: `obseg IPv4`,
			cidrv6: `obseg IPv6`,
			base64: `base64 kodiran niz`,
			base64url: `base64url kodiran niz`,
			json_string: `JSON niz`,
			e164: `E.164 številka`,
			credit_card: `številka kreditne kartice`,
			currency_code: `koda valute`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `vnos`
		};
		let r = {
			nan: `NaN`,
			number: `število`,
			array: `tabela`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Neveljaven vnos: pričakovano instanceof ${e.expected}, prejeto ${i}` : `Neveljaven vnos: pričakovano ${t}, prejeto ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Neveljaven vnos: pričakovano ${j$3(e.values[0])}` : `Neveljavna možnost: pričakovano eno izmed ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Preveliko: pričakovano, da bo ${e.origin ?? `vrednost`} imelo ${n}${e.maximum.toString()} ${r.unit ?? `elementov`}` : `Preveliko: pričakovano, da bo ${e.origin ?? `vrednost`} ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Premajhno: pričakovano, da bo ${e.origin} imelo ${n}${e.minimum.toString()} ${r.unit}` : `Premajhno: pričakovano, da bo ${e.origin} ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Neveljaven niz: mora se začeti z "${t.prefix}"` : t.format === `ends_with` ? `Neveljaven niz: mora se končati z "${t.suffix}"` : t.format === `includes` ? `Neveljaven niz: mora vsebovati "${t.includes}"` : t.format === `regex` ? `Neveljaven niz: mora ustrezati vzorcu ${t.pattern}` : `Neveljaven ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Neveljavno število: mora biti večkratnik ${e.divisor}`;
				case `unrecognized_keys`: return `Neprepoznan${e.keys.length > 1 ? `i ključi` : ` ključ`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Neveljaven ključ v ${e.origin}`;
				case `invalid_union`: return `Neveljaven vnos`;
				case `invalid_element`: return `Neveljavna vrednost v ${e.origin}`;
				default: return `Neveljaven vnos`;
			}
		};
	};
	Ps$1 = () => {
		let e = {
			string: {
				unit: `tecken`,
				verb: `att ha`
			},
			file: {
				unit: `bytes`,
				verb: `att ha`
			},
			array: {
				unit: `objekt`,
				verb: `att innehålla`
			},
			set: {
				unit: `objekt`,
				verb: `att innehålla`
			},
			map: {
				unit: `objekt`,
				verb: `att innehålla`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `reguljärt uttryck`,
			email: `e-postadress`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO-datum och tid`,
			date: `ISO-datum`,
			time: `ISO-tid`,
			duration: `ISO-varaktighet`,
			ipv4: `IPv4-adress`,
			ipv6: `IPv6-adress`,
			mac: `MAC-adress`,
			cidrv4: `IPv4-spektrum`,
			cidrv6: `IPv6-spektrum`,
			base64: `base64-kodad sträng`,
			base64url: `base64url-kodad sträng`,
			json_string: `JSON-sträng`,
			e164: `E.164-nummer`,
			credit_card: `kreditkortsnummer`,
			currency_code: `valutakod`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `mall-literal`
		};
		let r = {
			nan: `NaN`,
			number: `antal`,
			array: `lista`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Ogiltig inmatning: förväntat instanceof ${e.expected}, fick ${i}` : `Ogiltig inmatning: förväntat ${t}, fick ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Ogiltig inmatning: förväntat ${j$3(e.values[0])}` : `Ogiltigt val: förväntade en av ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `För stor(t): förväntade ${e.origin ?? `värdet`} att ha ${n}${e.maximum.toString()} ${r.unit ?? `element`}` : `För stor(t): förväntat ${e.origin ?? `värdet`} att ha ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `För lite(t): förväntade ${e.origin ?? `värdet`} att ha ${n}${e.minimum.toString()} ${r.unit}` : `För lite(t): förväntade ${e.origin ?? `värdet`} att ha ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ogiltig sträng: måste börja med "${t.prefix}"` : t.format === `ends_with` ? `Ogiltig sträng: måste sluta med "${t.suffix}"` : t.format === `includes` ? `Ogiltig sträng: måste innehålla "${t.includes}"` : t.format === `regex` ? `Ogiltig sträng: måste matcha mönstret "${t.pattern}"` : `Ogiltig(t) ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Ogiltigt tal: måste vara en multipel av ${e.divisor}`;
				case `unrecognized_keys`: return `${e.keys.length > 1 ? `Okända nycklar` : `Okänd nyckel`}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Ogiltig nyckel i ${e.origin ?? `värdet`}`;
				case `invalid_union`: return `Ogiltig input`;
				case `invalid_element`: return `Ogiltigt värde i ${e.origin ?? `värdet`}`;
				default: return `Ogiltig input`;
			}
		};
	};
	Is$1 = () => {
		let e = {
			string: {
				unit: `எழுத்துக்கள்`,
				verb: `கொண்டிருக்க வேண்டும்`
			},
			file: {
				unit: `பைட்டுகள்`,
				verb: `கொண்டிருக்க வேண்டும்`
			},
			array: {
				unit: `உறுப்புகள்`,
				verb: `கொண்டிருக்க வேண்டும்`
			},
			set: {
				unit: `உறுப்புகள்`,
				verb: `கொண்டிருக்க வேண்டும்`
			},
			map: {
				unit: `உறுப்புகள்`,
				verb: `கொண்டிருக்க வேண்டும்`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `உள்ளீடு`,
			email: `மின்னஞ்சல் முகவரி`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO தேதி நேரம்`,
			date: `ISO தேதி`,
			time: `ISO நேரம்`,
			duration: `ISO கால அளவு`,
			ipv4: `IPv4 முகவரி`,
			ipv6: `IPv6 முகவரி`,
			mac: `MAC முகவரி`,
			cidrv4: `IPv4 வரம்பு`,
			cidrv6: `IPv6 வரம்பு`,
			base64: `base64-encoded சரம்`,
			base64url: `base64url-encoded சரம்`,
			json_string: `JSON சரம்`,
			e164: `E.164 எண்`,
			credit_card: `கடன் அட்டை எண்`,
			currency_code: `நாணயக் குறியீடு`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `input`
		};
		let r = {
			nan: `NaN`,
			number: `எண்`,
			array: `அணி`,
			null: `வெறுமை`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${e.expected}, பெறப்பட்டது ${i}` : `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${t}, பெறப்பட்டது ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${j$3(e.values[0])}` : `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${l$3(e.values, `|`)} இல் ஒன்று`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${e.origin ?? `மதிப்பு`} ${n}${e.maximum.toString()} ${r.unit ?? `உறுப்புகள்`} ஆக இருக்க வேண்டும்` : `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${e.origin ?? `மதிப்பு`} ${n}${e.maximum.toString()} ஆக இருக்க வேண்டும்`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${e.origin} ${n}${e.minimum.toString()} ${r.unit} ஆக இருக்க வேண்டும்` : `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${e.origin} ${n}${e.minimum.toString()} ஆக இருக்க வேண்டும்`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `தவறான சரம்: "${t.prefix}" இல் தொடங்க வேண்டும்` : t.format === `ends_with` ? `தவறான சரம்: "${t.suffix}" இல் முடிவடைய வேண்டும்` : t.format === `includes` ? `தவறான சரம்: "${t.includes}" ஐ உள்ளடக்க வேண்டும்` : t.format === `regex` ? `தவறான சரம்: ${t.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்` : `தவறான ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `தவறான எண்: ${e.divisor} இன் பலமாக இருக்க வேண்டும்`;
				case `unrecognized_keys`: return `அடையாளம் தெரியாத விசை${e.keys.length > 1 ? `கள்` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} இல் தவறான விசை`;
				case `invalid_union`: return `தவறான உள்ளீடு`;
				case `invalid_element`: return `${e.origin} இல் தவறான மதிப்பு`;
				default: return `தவறான உள்ளீடு`;
			}
		};
	};
	Rs$1 = () => {
		let e = {
			string: {
				unit: `аломат`,
				verb: `дошта бошад`
			},
			file: {
				unit: `байт`,
				verb: `дошта бошад`
			},
			array: {
				unit: `унсур`,
				verb: `дошта бошад`
			},
			set: {
				unit: `унсур`,
				verb: `дошта бошад`
			},
			map: {
				unit: `сабт`,
				verb: `дошта бошад`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `вуруд`,
			email: `суроғаи email`,
			url: `URL`,
			emoji: `эмоҷи`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `санаву вақти ISO`,
			date: `санаи ISO`,
			time: `вақти ISO`,
			duration: `давомнокии ISO`,
			ipv4: `суроғаи IPv4`,
			ipv6: `суроғаи IPv6`,
			mac: `суроғаи MAC`,
			cidrv4: `маҳдудаи IPv4`,
			cidrv6: `маҳдудаи IPv6`,
			base64: `сатри дар формати base64`,
			base64url: `сатри дар формати base64url`,
			json_string: `сатри JSON`,
			e164: `рақами E.164`,
			credit_card: `рақами корти кредитӣ`,
			currency_code: `рамзи асъор`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `вуруд`
		};
		let r = {
			nan: `NaN`,
			number: `рақам`,
			string: `сатр`,
			array: `массив`,
			object: `объект`,
			date: `сана`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `Вуруди нодуруст: ${t} интизор мерафт, ${r[n] ?? n} гирифта шуд`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Вуруди нодуруст: ${j$3(e.values[0])} интизор мерафт` : `Интихоби нодуруст: яке аз ${l$3(e.values, `|`)} интизор мерафт`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Хеле калон: ${e.origin ?? `қимат`} бояд ${n}${e.maximum.toString()} ${r.unit} ${r.verb}` : `Хеле калон: ${e.origin ?? `қимат`} бояд ${n}${e.maximum.toString()} бошад`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Хеле хурд: ${e.origin} бояд ${n}${e.minimum.toString()} ${r.unit} ${r.verb}` : `Хеле хурд: ${e.origin} бояд ${n}${e.minimum.toString()} бошад`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Сатри нодуруст: бояд бо "${t.prefix}" оғоз шавад` : t.format === `ends_with` ? `Сатри нодуруст: бояд бо "${t.suffix}" анҷом ёбад` : t.format === `includes` ? `Сатри нодуруст: бояд "${t.includes}"-ро дар бар гирад` : t.format === `regex` ? `Сатри нодуруст: бояд ба намунаи ${t.pattern} мувофиқат кунад` : `${n[t.format] ?? e.format}-и нодуруст`;
				}
				case `not_multiple_of`: return `Рақами нодуруст: бояд ба ${e.divisor} бе бақия тақсим шавад`;
				case `unrecognized_keys`: return `Калид${e.keys.length > 1 ? `ҳои` : `и`} номаълум: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Калиди нодуруст дар ${e.origin}`;
				case `invalid_union`: return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Қимати нодурусти дискриминатор: ${e.options.map((e) => `'${e}'`).join(` | `)} интизор мерафт` : `Вуруди нодуруст`;
				case `invalid_element`: return `Қимати нодуруст дар ${e.origin}`;
				default: return `Вуруди нодуруст`;
			}
		};
	};
	Bs$1 = () => {
		let e = {
			string: {
				unit: `ตัวอักษร`,
				verb: `ควรมี`
			},
			file: {
				unit: `ไบต์`,
				verb: `ควรมี`
			},
			array: {
				unit: `รายการ`,
				verb: `ควรมี`
			},
			set: {
				unit: `รายการ`,
				verb: `ควรมี`
			},
			map: {
				unit: `รายการ`,
				verb: `ควรมี`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ข้อมูลที่ป้อน`,
			email: `ที่อยู่อีเมล`,
			url: `URL`,
			emoji: `อิโมจิ`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `วันที่เวลาแบบ ISO`,
			date: `วันที่แบบ ISO`,
			time: `เวลาแบบ ISO`,
			duration: `ช่วงเวลาแบบ ISO`,
			ipv4: `ที่อยู่ IPv4`,
			ipv6: `ที่อยู่ IPv6`,
			mac: `ที่อยู่ MAC`,
			cidrv4: `ช่วง IP แบบ IPv4`,
			cidrv6: `ช่วง IP แบบ IPv6`,
			base64: `ข้อความแบบ Base64`,
			base64url: `ข้อความแบบ Base64 สำหรับ URL`,
			json_string: `ข้อความแบบ JSON`,
			e164: `เบอร์โทรศัพท์ระหว่างประเทศ (E.164)`,
			credit_card: `หมายเลขบัตรเครดิต`,
			currency_code: `รหัสสกุลเงิน`,
			iban: `IBAN`,
			jwt: `โทเคน JWT`,
			template_literal: `ข้อมูลที่ป้อน`
		};
		let r = {
			nan: `NaN`,
			number: `ตัวเลข`,
			array: `อาร์เรย์ (Array)`,
			null: `ไม่มีค่า (null)`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${e.expected} แต่ได้รับ ${i}` : `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${t} แต่ได้รับ ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `ค่าไม่ถูกต้อง: ควรเป็น ${j$3(e.values[0])}` : `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `ไม่เกิน` : `น้อยกว่า`;
					let r = t(e.origin);
					return r ? `เกินกำหนด: ${e.origin ?? `ค่า`} ควรมี${n} ${e.maximum.toString()} ${r.unit ?? `รายการ`}` : `เกินกำหนด: ${e.origin ?? `ค่า`} ควรมี${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `อย่างน้อย` : `มากกว่า`;
					let r = t(e.origin);
					return r ? `น้อยกว่ากำหนด: ${e.origin} ควรมี${n} ${e.minimum.toString()} ${r.unit}` : `น้อยกว่ากำหนด: ${e.origin} ควรมี${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${t.prefix}"` : t.format === `ends_with` ? `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${t.suffix}"` : t.format === `includes` ? `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${t.includes}" อยู่ในข้อความ` : t.format === `regex` ? `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${t.pattern}` : `รูปแบบไม่ถูกต้อง: ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${e.divisor} ได้ลงตัว`;
				case `unrecognized_keys`: return `พบคีย์ที่ไม่รู้จัก: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `คีย์ไม่ถูกต้องใน ${e.origin}`;
				case `invalid_union`: return `ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้`;
				case `invalid_element`: return `ข้อมูลไม่ถูกต้องใน ${e.origin}`;
				default: return `ข้อมูลไม่ถูกต้อง`;
			}
		};
	};
	Hs$1 = () => {
		let e = {
			string: {
				unit: `simwol`,
				verb: `bolmaly`
			},
			file: {
				unit: `baýt`,
				verb: `bolmaly`
			},
			array: {
				unit: `elementler`,
				verb: `bolmaly`
			},
			set: {
				unit: `elementler`,
				verb: `bolmaly`
			},
			map: {
				unit: `elementler`,
				verb: `bolmaly`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `giriş`,
			email: `e-poçta salgysy`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO sene we wagt`,
			date: `ISO sene`,
			time: `ISO wagt`,
			duration: `ISO wagt aralygy`,
			ipv4: `IPv4 salgysy`,
			ipv6: `IPv6 salgysy`,
			mac: `MAC salgysy`,
			cidrv4: `IPv4 aralygy`,
			cidrv6: `IPv6 aralygy`,
			base64: `base64 bilen şifrlenen setir`,
			base64url: `base64url bilen şifrlenen setir`,
			json_string: `JSON setiri`,
			e164: `E.164 nomeri`,
			credit_card: `kredit kartynyň nomeri`,
			currency_code: `walýuta kody`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `şablon`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					return `Nädogry baha: garaşylan ${t} ýerine ${r[n] ?? n} alyndy`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Nädogry baha: ${j$3(e.values[0])} bolmaly` : `Nädogry saýlaw: aşakdakylardan biri bolmaly: ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Has uly: garaşylýan ${e.origin ?? `baha`} ${n} ${e.maximum.toString()} ${r.unit ?? `element`}` : `Has uly: garaşylýan ${e.origin ?? `baha`} ${n} ${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Has kiçi: garaşylýan ${e.origin} ${n} ${e.minimum.toString()} ${r.unit}` : `Has kiçi: garaşylýan ${e.origin} ${n} ${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Nädogry setir: "${t.prefix}" bilen başlamaly` : t.format === `ends_with` ? `Nädogry setir: "${t.suffix}" bilen gutarmaly` : t.format === `includes` ? `Nädogry setir: "${t.includes}" saklamaly` : t.format === `regex` ? `Nädogry setir: ${t.pattern} nusga laýyk bolmaly` : `Nädogry ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Nädogry san: ${e.divisor} bilen galyndysyz bölünmeli`;
				case `unrecognized_keys`: return `Tanalmaýan açar${e.keys.length > 1 ? `lar` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} içinde nädogry açar`;
				case `invalid_union`: return `Nädogry baha`;
				case `invalid_element`: return `${e.origin} içinde nädogry baha`;
				default: return `Nädogry baha`;
			}
		};
	};
	Ws$1 = () => {
		let e = {
			string: {
				unit: `karakter`,
				verb: `olmalı`
			},
			file: {
				unit: `bayt`,
				verb: `olmalı`
			},
			array: {
				unit: `öğe`,
				verb: `olmalı`
			},
			set: {
				unit: `öğe`,
				verb: `olmalı`
			},
			map: {
				unit: `öğe`,
				verb: `olmalı`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `girdi`,
			email: `e-posta adresi`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO tarih ve saat`,
			date: `ISO tarih`,
			time: `ISO saat`,
			duration: `ISO süre`,
			ipv4: `IPv4 adresi`,
			ipv6: `IPv6 adresi`,
			mac: `MAC adresi`,
			cidrv4: `IPv4 aralığı`,
			cidrv6: `IPv6 aralığı`,
			base64: `base64 ile şifrelenmiş metin`,
			base64url: `base64url ile şifrelenmiş metin`,
			json_string: `JSON dizesi`,
			e164: `E.164 sayısı`,
			credit_card: `kredi kartı numarası`,
			currency_code: `para birimi kodu`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `Şablon dizesi`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Geçersiz değer: beklenen instanceof ${e.expected}, alınan ${i}` : `Geçersiz değer: beklenen ${t}, alınan ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Geçersiz değer: beklenen ${j$3(e.values[0])}` : `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Çok büyük: beklenen ${e.origin ?? `değer`} ${n}${e.maximum.toString()} ${r.unit ?? `öğe`}` : `Çok büyük: beklenen ${e.origin ?? `değer`} ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Çok küçük: beklenen ${e.origin} ${n}${e.minimum.toString()} ${r.unit}` : `Çok küçük: beklenen ${e.origin} ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Geçersiz metin: "${t.prefix}" ile başlamalı` : t.format === `ends_with` ? `Geçersiz metin: "${t.suffix}" ile bitmeli` : t.format === `includes` ? `Geçersiz metin: "${t.includes}" içermeli` : t.format === `regex` ? `Geçersiz metin: ${t.pattern} desenine uymalı` : `Geçersiz ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Geçersiz sayı: ${e.divisor} ile tam bölünebilmeli`;
				case `unrecognized_keys`: return `Tanınmayan anahtar${e.keys.length > 1 ? `lar` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} içinde geçersiz anahtar`;
				case `invalid_union`: return `Geçersiz değer`;
				case `invalid_element`: return `${e.origin} içinde geçersiz değer`;
				default: return `Geçersiz değer`;
			}
		};
	};
	Ks$1 = () => {
		let e = {
			string: {
				unit: `символів`,
				verb: `матиме`
			},
			file: {
				unit: `байтів`,
				verb: `матиме`
			},
			array: {
				unit: `елементів`,
				verb: `матиме`
			},
			set: {
				unit: `елементів`,
				verb: `матиме`
			},
			map: {
				unit: `елементів`,
				verb: `матиме`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `вхідні дані`,
			email: `адреса електронної пошти`,
			url: `URL`,
			emoji: `емодзі`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `дата та час ISO`,
			date: `дата ISO`,
			time: `час ISO`,
			duration: `тривалість ISO`,
			ipv4: `адреса IPv4`,
			ipv6: `адреса IPv6`,
			mac: `адреса MAC`,
			cidrv4: `діапазон IPv4`,
			cidrv6: `діапазон IPv6`,
			base64: `рядок у кодуванні base64`,
			base64url: `рядок у кодуванні base64url`,
			json_string: `рядок JSON`,
			e164: `номер E.164`,
			credit_card: `номер кредитної картки`,
			currency_code: `код валюти`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `вхідні дані`
		};
		let r = {
			nan: `NaN`,
			number: `число`,
			array: `масив`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Неправильні вхідні дані: очікується instanceof ${e.expected}, отримано ${i}` : `Неправильні вхідні дані: очікується ${t}, отримано ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Неправильні вхідні дані: очікується ${j$3(e.values[0])}` : `Неправильна опція: очікується одне з ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Занадто велике: очікується, що ${e.origin ?? `значення`} ${r.verb} ${n}${e.maximum.toString()} ${r.unit ?? `елементів`}` : `Занадто велике: очікується, що ${e.origin ?? `значення`} буде ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Занадто мале: очікується, що ${e.origin} ${r.verb} ${n}${e.minimum.toString()} ${r.unit}` : `Занадто мале: очікується, що ${e.origin} буде ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Неправильний рядок: повинен починатися з "${t.prefix}"` : t.format === `ends_with` ? `Неправильний рядок: повинен закінчуватися на "${t.suffix}"` : t.format === `includes` ? `Неправильний рядок: повинен містити "${t.includes}"` : t.format === `regex` ? `Неправильний рядок: повинен відповідати шаблону ${t.pattern}` : `Неправильний ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Неправильне число: повинно бути кратним ${e.divisor}`;
				case `unrecognized_keys`: return `Нерозпізнаний ключ${e.keys.length > 1 ? `і` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Неправильний ключ у ${e.origin}`;
				case `invalid_union`: return `Неправильні вхідні дані`;
				case `invalid_element`: return `Неправильне значення у ${e.origin}`;
				default: return `Неправильні вхідні дані`;
			}
		};
	};
	Ys$1 = () => {
		let e = {
			string: {
				unit: `حروف`,
				verb: `ہونا`
			},
			file: {
				unit: `بائٹس`,
				verb: `ہونا`
			},
			array: {
				unit: `آئٹمز`,
				verb: `ہونا`
			},
			set: {
				unit: `آئٹمز`,
				verb: `ہونا`
			},
			map: {
				unit: `آئٹمز`,
				verb: `ہونا`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ان پٹ`,
			email: `ای میل ایڈریس`,
			url: `یو آر ایل`,
			emoji: `ایموجی`,
			uuid: `یو یو آئی ڈی`,
			uuidv4: `یو یو آئی ڈی وی 4`,
			uuidv6: `یو یو آئی ڈی وی 6`,
			nanoid: `نینو آئی ڈی`,
			guid: `جی یو آئی ڈی`,
			cuid: `سی یو آئی ڈی`,
			cuid2: `سی یو آئی ڈی 2`,
			ulid: `یو ایل آئی ڈی`,
			xid: `ایکس آئی ڈی`,
			ksuid: `کے ایس یو آئی ڈی`,
			datetime: `آئی ایس او ڈیٹ ٹائم`,
			date: `آئی ایس او تاریخ`,
			time: `آئی ایس او وقت`,
			duration: `آئی ایس او مدت`,
			ipv4: `آئی پی وی 4 ایڈریس`,
			ipv6: `آئی پی وی 6 ایڈریس`,
			mac: `ایم اے سی ایڈریس`,
			cidrv4: `آئی پی وی 4 رینج`,
			cidrv6: `آئی پی وی 6 رینج`,
			base64: `بیس 64 ان کوڈڈ سٹرنگ`,
			base64url: `بیس 64 یو آر ایل ان کوڈڈ سٹرنگ`,
			json_string: `جے ایس او این سٹرنگ`,
			e164: `ای 164 نمبر`,
			credit_card: `کریڈٹ کارڈ نمبر`,
			currency_code: `کرنسی کوڈ`,
			iban: `IBAN`,
			jwt: `جے ڈبلیو ٹی`,
			template_literal: `ان پٹ`
		};
		let r = {
			nan: `NaN`,
			number: `نمبر`,
			array: `آرے`,
			null: `نل`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `غلط ان پٹ: instanceof ${e.expected} متوقع تھا، ${i} موصول ہوا` : `غلط ان پٹ: ${t} متوقع تھا، ${i} موصول ہوا`;
				}
				case `invalid_value`: return e.values.length === 1 ? `غلط ان پٹ: ${j$3(e.values[0])} متوقع تھا` : `غلط آپشن: ${l$3(e.values, `|`)} میں سے ایک متوقع تھا`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `بہت بڑا: ${e.origin ?? `ویلیو`} کے ${n}${e.maximum.toString()} ${r.unit ?? `عناصر`} ہونے متوقع تھے` : `بہت بڑا: ${e.origin ?? `ویلیو`} کا ${n}${e.maximum.toString()} ہونا متوقع تھا`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `بہت چھوٹا: ${e.origin} کے ${n}${e.minimum.toString()} ${r.unit} ہونے متوقع تھے` : `بہت چھوٹا: ${e.origin} کا ${n}${e.minimum.toString()} ہونا متوقع تھا`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `غلط سٹرنگ: "${t.prefix}" سے شروع ہونا چاہیے` : t.format === `ends_with` ? `غلط سٹرنگ: "${t.suffix}" پر ختم ہونا چاہیے` : t.format === `includes` ? `غلط سٹرنگ: "${t.includes}" شامل ہونا چاہیے` : t.format === `regex` ? `غلط سٹرنگ: پیٹرن ${t.pattern} سے میچ ہونا چاہیے` : `غلط ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `غلط نمبر: ${e.divisor} کا مضاعف ہونا چاہیے`;
				case `unrecognized_keys`: return `غیر تسلیم شدہ کی${e.keys.length > 1 ? `ز` : ``}: ${l$3(e.keys, `، `)}`;
				case `invalid_key`: return `${e.origin} میں غلط کی`;
				case `invalid_union`: return `غلط ان پٹ`;
				case `invalid_element`: return `${e.origin} میں غلط ویلیو`;
				default: return `غلط ان پٹ`;
			}
		};
	};
	Zs$1 = () => {
		let e = {
			string: {
				unit: `belgi`,
				verb: `bo‘lishi kerak`
			},
			file: {
				unit: `bayt`,
				verb: `bo‘lishi kerak`
			},
			array: {
				unit: `element`,
				verb: `bo‘lishi kerak`
			},
			set: {
				unit: `element`,
				verb: `bo‘lishi kerak`
			},
			map: {
				unit: `yozuv`,
				verb: `bo‘lishi kerak`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `kirish`,
			email: `elektron pochta manzili`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO sana va vaqti`,
			date: `ISO sana`,
			time: `ISO vaqt`,
			duration: `ISO davomiylik`,
			ipv4: `IPv4 manzil`,
			ipv6: `IPv6 manzil`,
			mac: `MAC manzil`,
			cidrv4: `IPv4 diapazon`,
			cidrv6: `IPv6 diapazon`,
			base64: `base64 kodlangan satr`,
			base64url: `base64url kodlangan satr`,
			json_string: `JSON satr`,
			e164: `E.164 raqam`,
			credit_card: `kredit karta raqami`,
			currency_code: `valyuta kodi`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `kirish`
		};
		let r = {
			nan: `NaN`,
			number: `raqam`,
			array: `massiv`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Noto‘g‘ri kirish: kutilgan instanceof ${e.expected}, qabul qilingan ${i}` : `Noto‘g‘ri kirish: kutilgan ${t}, qabul qilingan ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Noto‘g‘ri kirish: kutilgan ${j$3(e.values[0])}` : `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Juda katta: kutilgan ${e.origin ?? `qiymat`} ${n}${e.maximum.toString()} ${r.unit} ${r.verb}` : `Juda katta: kutilgan ${e.origin ?? `qiymat`} ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Juda kichik: kutilgan ${e.origin} ${n}${e.minimum.toString()} ${r.unit} ${r.verb}` : `Juda kichik: kutilgan ${e.origin} ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Noto‘g‘ri satr: "${t.prefix}" bilan boshlanishi kerak` : t.format === `ends_with` ? `Noto‘g‘ri satr: "${t.suffix}" bilan tugashi kerak` : t.format === `includes` ? `Noto‘g‘ri satr: "${t.includes}" ni o‘z ichiga olishi kerak` : t.format === `regex` ? `Noto‘g‘ri satr: ${t.pattern} shabloniga mos kelishi kerak` : `Noto‘g‘ri ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Noto‘g‘ri raqam: ${e.divisor} ning karralisi bo‘lishi kerak`;
				case `unrecognized_keys`: return `Noma’lum kalit${e.keys.length > 1 ? `lar` : ``}: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} dagi kalit noto‘g‘ri`;
				case `invalid_union`: return `Noto‘g‘ri kirish`;
				case `invalid_element`: return `${e.origin} da noto‘g‘ri qiymat`;
				default: return `Noto‘g‘ri kirish`;
			}
		};
	};
	$s$1 = () => {
		let e = {
			string: {
				unit: `ký tự`,
				verb: `có`
			},
			file: {
				unit: `byte`,
				verb: `có`
			},
			array: {
				unit: `phần tử`,
				verb: `có`
			},
			set: {
				unit: `phần tử`,
				verb: `có`
			},
			map: {
				unit: `phần tử`,
				verb: `có`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `đầu vào`,
			email: `địa chỉ email`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ngày giờ ISO`,
			date: `ngày ISO`,
			time: `giờ ISO`,
			duration: `khoảng thời gian ISO`,
			ipv4: `địa chỉ IPv4`,
			ipv6: `địa chỉ IPv6`,
			mac: `địa chỉ MAC`,
			cidrv4: `dải IPv4`,
			cidrv6: `dải IPv6`,
			base64: `chuỗi mã hóa base64`,
			base64url: `chuỗi mã hóa base64url`,
			json_string: `chuỗi JSON`,
			e164: `số E.164`,
			credit_card: `số thẻ tín dụng`,
			currency_code: `mã tiền tệ`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `đầu vào`
		};
		let r = {
			nan: `NaN`,
			number: `số`,
			array: `mảng`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Đầu vào không hợp lệ: mong đợi instanceof ${e.expected}, nhận được ${i}` : `Đầu vào không hợp lệ: mong đợi ${t}, nhận được ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Đầu vào không hợp lệ: mong đợi ${j$3(e.values[0])}` : `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Quá lớn: mong đợi ${e.origin ?? `giá trị`} ${r.verb} ${n}${e.maximum.toString()} ${r.unit ?? `phần tử`}` : `Quá lớn: mong đợi ${e.origin ?? `giá trị`} ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Quá nhỏ: mong đợi ${e.origin} ${r.verb} ${n}${e.minimum.toString()} ${r.unit}` : `Quá nhỏ: mong đợi ${e.origin} ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Chuỗi không hợp lệ: phải bắt đầu bằng "${t.prefix}"` : t.format === `ends_with` ? `Chuỗi không hợp lệ: phải kết thúc bằng "${t.suffix}"` : t.format === `includes` ? `Chuỗi không hợp lệ: phải bao gồm "${t.includes}"` : t.format === `regex` ? `Chuỗi không hợp lệ: phải khớp với mẫu ${t.pattern}` : `${n[t.format] ?? e.format} không hợp lệ`;
				}
				case `not_multiple_of`: return `Số không hợp lệ: phải là bội số của ${e.divisor}`;
				case `unrecognized_keys`: return `Khóa không được nhận dạng: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Khóa không hợp lệ trong ${e.origin}`;
				case `invalid_union`: return `Đầu vào không hợp lệ`;
				case `invalid_element`: return `Giá trị không hợp lệ trong ${e.origin}`;
				default: return `Đầu vào không hợp lệ`;
			}
		};
	};
	tc$1 = () => {
		let e = {
			string: {
				unit: `字符`,
				verb: `包含`
			},
			file: {
				unit: `字节`,
				verb: `包含`
			},
			array: {
				unit: `项`,
				verb: `包含`
			},
			set: {
				unit: `项`,
				verb: `包含`
			},
			map: {
				unit: `项`,
				verb: `包含`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `输入`,
			email: `电子邮件`,
			url: `URL`,
			emoji: `表情符号`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO日期时间`,
			date: `ISO日期`,
			time: `ISO时间`,
			duration: `ISO时长`,
			ipv4: `IPv4地址`,
			ipv6: `IPv6地址`,
			mac: `MAC地址`,
			cidrv4: `IPv4网段`,
			cidrv6: `IPv6网段`,
			base64: `base64编码字符串`,
			base64url: `base64url编码字符串`,
			json_string: `JSON字符串`,
			e164: `E.164号码`,
			credit_card: `信用卡号`,
			currency_code: `货币代码`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `输入`
		};
		let r = {
			nan: `NaN`,
			number: `数字`,
			array: `数组`,
			null: `空值(null)`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `无效输入：期望 instanceof ${e.expected}，实际接收 ${i}` : `无效输入：期望 ${t}，实际接收 ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `无效输入：期望 ${j$3(e.values[0])}` : `无效选项：期望以下之一 ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `数值过大：期望 ${e.origin ?? `值`} ${n}${e.maximum.toString()} ${r.unit ?? `个元素`}` : `数值过大：期望 ${e.origin ?? `值`} ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `数值过小：期望 ${e.origin} ${n}${e.minimum.toString()} ${r.unit}` : `数值过小：期望 ${e.origin} ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `无效字符串：必须以 "${t.prefix}" 开头` : t.format === `ends_with` ? `无效字符串：必须以 "${t.suffix}" 结尾` : t.format === `includes` ? `无效字符串：必须包含 "${t.includes}"` : t.format === `regex` ? `无效字符串：必须满足正则表达式 ${t.pattern}` : `无效${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `无效数字：必须是 ${e.divisor} 的倍数`;
				case `unrecognized_keys`: return `出现未知的键(key): ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `${e.origin} 中的键(key)无效`;
				case `invalid_union`: return `无效输入`;
				case `invalid_element`: return `${e.origin} 中包含无效值(value)`;
				default: return `无效输入`;
			}
		};
	};
	rc$1 = () => {
		let e = {
			string: {
				unit: `字元`,
				verb: `擁有`
			},
			file: {
				unit: `位元組`,
				verb: `擁有`
			},
			array: {
				unit: `項目`,
				verb: `擁有`
			},
			set: {
				unit: `項目`,
				verb: `擁有`
			},
			map: {
				unit: `項目`,
				verb: `擁有`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `輸入`,
			email: `郵件地址`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `ISO 日期時間`,
			date: `ISO 日期`,
			time: `ISO 時間`,
			duration: `ISO 期間`,
			ipv4: `IPv4 位址`,
			ipv6: `IPv6 位址`,
			mac: `MAC 位址`,
			cidrv4: `IPv4 範圍`,
			cidrv6: `IPv6 範圍`,
			base64: `base64 編碼字串`,
			base64url: `base64url 編碼字串`,
			json_string: `JSON 字串`,
			e164: `E.164 數值`,
			credit_card: `信用卡號`,
			currency_code: `貨幣代碼`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `輸入`
		};
		let r = { nan: `NaN` };
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `無效的輸入值：預期為 instanceof ${e.expected}，但收到 ${i}` : `無效的輸入值：預期為 ${t}，但收到 ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `無效的輸入值：預期為 ${j$3(e.values[0])}` : `無效的選項：預期為以下其中之一 ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `數值過大：預期 ${e.origin ?? `值`} 應為 ${n}${e.maximum.toString()} ${r.unit ?? `個元素`}` : `數值過大：預期 ${e.origin ?? `值`} 應為 ${n}${e.maximum.toString()}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `數值過小：預期 ${e.origin} 應為 ${n}${e.minimum.toString()} ${r.unit}` : `數值過小：預期 ${e.origin} 應為 ${n}${e.minimum.toString()}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `無效的字串：必須以 "${t.prefix}" 開頭` : t.format === `ends_with` ? `無效的字串：必須以 "${t.suffix}" 結尾` : t.format === `includes` ? `無效的字串：必須包含 "${t.includes}"` : t.format === `regex` ? `無效的字串：必須符合格式 ${t.pattern}` : `無效的 ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `無效的數字：必須為 ${e.divisor} 的倍數`;
				case `unrecognized_keys`: return `無法識別的鍵值${e.keys.length > 1 ? `們` : ``}：${l$3(e.keys, `、`)}`;
				case `invalid_key`: return `${e.origin} 中有無效的鍵值`;
				case `invalid_union`: return `無效的輸入值`;
				case `invalid_element`: return `${e.origin} 中有無效的值`;
				default: return `無效的輸入值`;
			}
		};
	};
	ac$1 = () => {
		let e = {
			string: {
				unit: `àmi`,
				verb: `ní`
			},
			file: {
				unit: `bytes`,
				verb: `ní`
			},
			array: {
				unit: `nkan`,
				verb: `ní`
			},
			set: {
				unit: `nkan`,
				verb: `ní`
			},
			map: {
				unit: `nkan`,
				verb: `ní`
			}
		};
		function t(t) {
			return e[t] ?? null;
		}
		let n = {
			regex: `ẹ̀rọ ìbáwọlé`,
			email: `àdírẹ́sì ìmẹ́lì`,
			url: `URL`,
			emoji: `emoji`,
			uuid: `UUID`,
			uuidv4: `UUIDv4`,
			uuidv6: `UUIDv6`,
			nanoid: `nanoid`,
			guid: `GUID`,
			cuid: `cuid`,
			cuid2: `cuid2`,
			ulid: `ULID`,
			xid: `XID`,
			ksuid: `KSUID`,
			datetime: `àkókò ISO`,
			date: `ọjọ́ ISO`,
			time: `àkókò ISO`,
			duration: `àkókò tó pé ISO`,
			ipv4: `àdírẹ́sì IPv4`,
			ipv6: `àdírẹ́sì IPv6`,
			mac: `àdírẹ́sì MAC`,
			cidrv4: `àgbègbè IPv4`,
			cidrv6: `àgbègbè IPv6`,
			base64: `ọ̀rọ̀ tí a kọ́ ní base64`,
			base64url: `ọ̀rọ̀ base64url`,
			json_string: `ọ̀rọ̀ JSON`,
			e164: `nọ́mbà E.164`,
			credit_card: `nọmba kaadi gbese`,
			currency_code: `koodu owó`,
			iban: `IBAN`,
			jwt: `JWT`,
			template_literal: `ẹ̀rọ ìbáwọlé`
		};
		let r = {
			nan: `NaN`,
			number: `nọ́mbà`,
			array: `akopọ`
		};
		return (e) => {
			switch (e.code) {
				case `invalid_type`: {
					let t = r[e.expected] ?? e.expected;
					let n = q$3(e.input);
					let i = r[n] ?? n;
					return /^[A-Z]/.test(e.expected) ? `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${e.expected}, àmọ̀ a rí ${i}` : `Ìbáwọlé aṣìṣe: a ní láti fi ${t}, àmọ̀ a rí ${i}`;
				}
				case `invalid_value`: return e.values.length === 1 ? `Ìbáwọlé aṣìṣe: a ní láti fi ${j$3(e.values[0])}` : `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${l$3(e.values, `|`)}`;
				case `too_big`: {
					let n = e.inclusive ? `<=` : `<`;
					let r = t(e.origin);
					return r ? `Tó pọ̀ jù: a ní láti jẹ́ pé ${e.origin ?? `iye`} ${r.verb} ${n}${e.maximum} ${r.unit}` : `Tó pọ̀ jù: a ní láti jẹ́ ${n}${e.maximum}`;
				}
				case `too_small`: {
					let n = e.inclusive ? `>=` : `>`;
					let r = t(e.origin);
					return r ? `Kéré ju: a ní láti jẹ́ pé ${e.origin} ${r.verb} ${n}${e.minimum} ${r.unit}` : `Kéré ju: a ní láti jẹ́ ${n}${e.minimum}`;
				}
				case `invalid_format`: {
					let t = e;
					return t.format === `starts_with` ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${t.prefix}"` : t.format === `ends_with` ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${t.suffix}"` : t.format === `includes` ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${t.includes}"` : t.format === `regex` ? `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${t.pattern}` : `Aṣìṣe: ${n[t.format] ?? e.format}`;
				}
				case `not_multiple_of`: return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${e.divisor}`;
				case `unrecognized_keys`: return `Bọtìnì àìmọ̀: ${l$3(e.keys, `, `)}`;
				case `invalid_key`: return `Bọtìnì aṣìṣe nínú ${e.origin}`;
				case `invalid_union`: return `Ìbáwọlé aṣìṣe`;
				case `invalid_element`: return `Iye aṣìṣe nínú ${e.origin}`;
				default: return `Ìbáwọlé aṣìṣe`;
			}
		};
	};
	sc$1 = t$2({
		ar: () => Va$1,
		az: () => Ua$1,
		be: () => Ka$1,
		bg: () => Ja$1,
		bn: () => Xa$1,
		ca: () => Qa$1,
		ckb: () => eo$1,
		cs: () => no$1,
		da: () => io$1,
		de: () => oo$1,
		el: () => co$1,
		en: () => Ze$2,
		eo: () => uo$1,
		es: () => po$1,
		fa: () => ho$1,
		fi: () => _o$1,
		fr: () => yo$1,
		frCA: () => xo$1,
		gu: () => Co$1,
		he: () => To$1,
		hi: () => Do$1,
		hr: () => ko$1,
		hu: () => jo$1,
		hy: () => Fo$1,
		id: () => Lo$1,
		is: () => zo$1,
		it: () => Vo$1,
		ja: () => Uo$1,
		ka: () => Go$1,
		kh: () => Jo$1,
		km: () => qo$1,
		kn: () => Xo$1,
		ko: () => Qo$1,
		lt: () => ns$1,
		mk: () => is$1,
		ms: () => os$1,
		ne: () => cs$1,
		nl: () => us$1,
		nn: () => fs$1,
		no: () => ms$1,
		ota: () => gs$1,
		pl: () => bs$1,
		ps: () => vs$1,
		pt: () => Ss$1,
		ptBR: () => ws$1,
		ro: () => Es$1,
		ru: () => ks$1,
		sk: () => js$1,
		sl: () => Ns$1,
		sv: () => Fs$1,
		ta: () => Ls$1,
		tg: () => zs$1,
		th: () => Vs$1,
		tk: () => Us$1,
		tr: () => Gs$1,
		ua: () => Js$1,
		uk: () => qs$1,
		ur: () => Xs$1,
		uz: () => Qs$1,
		vi: () => ec$1,
		yo: () => oc$1,
		zhCN: () => nc$1,
		zhTW: () => ic$1
	});
	lc$1 = Symbol(`ZodOutput`);
	uc$1 = Symbol(`ZodInput`);
	dc$1 = class {
		constructor() {
			this._map = new WeakMap(), this._idmap = new Map();
		}
		add(e, ...t) {
			let n = t[0];
			return this._map.set(e, n), n && typeof n == `object` && `id` in n && this._idmap.set(n.id, e), this;
		}
		clear() {
			return this._map = new WeakMap(), this._idmap = new Map(), this;
		}
		remove(e) {
			let t = this._map.get(e);
			return t && typeof t == `object` && `id` in t && this._idmap.delete(t.id), this._map.delete(e), this;
		}
		get(e) {
			let t = e._zod.parent;
			if (t) {
				let n = { ...this.get(t) ?? {} };
				delete n.id;
				let r = {
					...n,
					...this._map.get(e)
				};
				return Object.keys(r).length ? r : void 0;
			}
			return this._map.get(e);
		}
		has(e) {
			return this._map.has(e);
		}
	};
	(cc$1 = globalThis).__zod_globalRegistry ?? (cc$1.__zod_globalRegistry = fc$1());
	P$2 = globalThis.__zod_globalRegistry;
	F$2 = Symbol.for(`zod.compile.invalid`);
	pc$1 = Symbol.for(`zod.compile.fallback`);
	I$2 = class extends Error {
		constructor(e = `z.compile does not support async refinements, transforms, or checks`) {
			super(e), this.name = `ZodCompileAsyncError`;
		}
	};
	L$2 = class extends Error {
		constructor(e, t = !0) {
			super(`z.compile does not support ${e}; this schema must use the runtime parser`), this.name = `ZodCompileUnsupportedError`, this.islandable = t;
		}
	};
	xc$1 = new Set([
		`max_size`,
		`min_size`,
		`size_equals`,
		`max_length`,
		`min_length`,
		`length_equals`
	]);
	Lc = new Set([
		`cidrv4`,
		`cuid`,
		`cuid2`,
		`date`,
		`datetime`,
		`duration`,
		`e164`,
		`email`,
		`emoji`,
		`ends_with`,
		`guid`,
		`includes`,
		`ipv4`,
		`ksuid`,
		`lowercase`,
		`mac`,
		`nanoid`,
		`regex`,
		`starts_with`,
		`time`,
		`ulid`,
		`uppercase`,
		`uuid`,
		`xid`
	]);
	ru = {
		Any: null,
		Minute: -1,
		Second: 0,
		Millisecond: 3,
		Microsecond: 6
	};
	Hd = new Set([
		`type`,
		`properties`,
		`required`,
		`additionalProperties`
	]);
	Ud = [`oneOf`, `anyOf`];
	qd = (e, t = {}) => (n) => {
		let r = q$2({
			...n,
			processors: t
		});
		return Y$2(e, r), X$3(r, e), Z$2(r, e);
	};
	Jd = (e, t, n = {}) => (r) => {
		let { libraryOptions: i, target: a } = r ?? {};
		let o = q$2({
			...i ?? {},
			target: a,
			io: t,
			processors: n
		});
		return Y$2(e, o), X$3(o, e), Z$2(o, e);
	};
	Yd = (e, t, n) => {
		(e[t] === void 0 || n > e[t]) && (e[t] = n);
	};
	Xd = (e, t, n) => {
		(e[t] === void 0 || n < e[t]) && (e[t] = n);
	};
	Zd = (e, t) => {
		Yd(e, `minimum`, t), Xd(e, `maximum`, t);
	};
	Qd = (e, t) => {
		e.multipleOf ??= [], e.multipleOf.includes(t) || e.multipleOf.push(t);
	};
	$d = (e, t) => {
		e.patterns ??= new Set(), e.patterns.add(t);
	};
	ef = (e, t) => {
		e.mime = e.mime ? e.mime.filter((e) => t.includes(e)) : [...t];
	};
	tf = (e, t) => {
		e.format = t, t.includes(`int`) && (e.isInt = !0);
	};
	nf = (e, t) => Yd(e, `minimum`, t.minimum);
	rf = (e, t) => Xd(e, `maximum`, t.maximum);
	af = (e) => (t, n) => {
		tf(t, n.format);
		let [r, i] = e[n.format];
		Yd(t, `minimum`, r), Xd(t, `maximum`, i);
	};
	of = {
		greater_than: (e, t) => Yd(e, t.inclusive ? `minimum` : `exclusiveMinimum`, t.value),
		less_than: (e, t) => Xd(e, t.inclusive ? `maximum` : `exclusiveMaximum`, t.value),
		multiple_of: (e, t) => Qd(e, t.value),
		number_format: af(N$3),
		bigint_format: af(P$3),
		min_length: nf,
		max_length: rf,
		length_equals: (e, t) => Zd(e, t.length),
		min_size: nf,
		max_size: rf,
		size_equals: (e, t) => Zd(e, t.size),
		string_format: (e, t) => {
			tf(e, t.format), t.pattern && $d(e, t.pattern), (t.format === `base64` || t.format === `base64url`) && (e.contentEncoding = t.format), (t.local || t.precision === -1) && (e.laxFormat = !0);
		},
		mime_type: (e, t) => ef(e, t.mime)
	};
	sf = {
		guid: `uuid`,
		url: `uri`,
		datetime: `date-time`,
		json_string: `json-string`,
		regex: ``
	};
	cf = new Map([[Br, zt$1], [Hr, Bt$1]]);
	lf = (e) => cf.get(e) ?? e;
	uf = (e, t, n, r) => {
		let i = n;
		i.type = `string`;
		let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l, laxFormat: u } = $$2(e);
		if (typeof a == `number` && (i.minLength = a), typeof o == `number` && (i.maxLength = o), s && (i.format = sf[s] ?? s, i.format === `` && delete i.format, (s === `time` || u) && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
			let e = [...c].map(lf);
			e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
				...t.target === `draft-07` || t.target === `draft-04` || t.target === `openapi-3.0` ? { type: `string` } : {},
				pattern: e.source
			}))]);
		}
	};
	df = (e, t, n, r) => {
		let i = n;
		let { minimum: a, maximum: o, multipleOf: s, exclusiveMaximum: c, exclusiveMinimum: l, isInt: u } = $$2(e);
		i.type = u ? `integer` : `number`;
		let d = typeof l == `number` && l >= (a ?? -1 / 0);
		let f = typeof c == `number` && c <= (o ?? 1 / 0);
		let p = t.target === `draft-04` || t.target === `openapi-3.0`;
		if (d ? p ? (i.minimum = l, i.exclusiveMinimum = !0) : i.exclusiveMinimum = l : typeof a == `number` && (i.minimum = a), f ? p ? (i.maximum = c, i.exclusiveMaximum = !0) : i.exclusiveMaximum = c : typeof o == `number` && (i.maximum = o), s) {
			let n = new Set();
			for (let a of s) Number.isFinite(a) && a !== 0 ? n.add(Math.abs(a)) : J$2(e, t, i, r, `A multipleOf divisor of ${a} cannot be represented in JSON Schema`);
			let [a, ...o] = n;
			a !== void 0 && (i.multipleOf = a), o.length && (i.allOf = [...i.allOf ?? [], ...o.map((e) => ({ multipleOf: e }))]);
		}
	};
	ff = (e, t, n, r) => {
		n.type = `boolean`;
	};
	pf = (e, t, n, r) => {
		J$2(e, t, n, r, `BigInt cannot be represented in JSON Schema`);
	};
	mf = (e, t, n, r) => {
		J$2(e, t, n, r, `Symbols cannot be represented in JSON Schema`);
	};
	hf = (e, t, n, r) => {
		t.target === `openapi-3.0` ? (n.type = `string`, n.nullable = !0, n.enum = [null]) : n.type = `null`;
	};
	gf = (e, t, n, r) => {
		J$2(e, t, n, r, `Undefined cannot be represented in JSON Schema`);
	};
	_f = (e, t, n, r) => {
		J$2(e, t, n, r, `Void cannot be represented in JSON Schema`);
	};
	vf = (e, t, n, r) => {
		n.not = {};
	};
	yf = (e, t, n, r) => {};
	bf = (e, t, n, r) => {};
	xf = (e, t, n, r) => {
		J$2(e, t, n, r, `Date cannot be represented in JSON Schema`);
	};
	Sf = (e, t, n, r) => {
		let i = e._zod.def;
		let a = c$1(i.entries);
		a.length === 0 ? n.not = {} : (a.every((e) => typeof e == `number`) && (n.type = `number`), a.every((e) => typeof e == `string`) && (n.type = `string`), n.enum = a);
	};
	Cf = (e, t, n, r) => {
		let i = e._zod.def;
		if (i.values.length === 0) {
			n.not = {};
			return;
		}
		let a = [];
		for (let o of i.values) if (o === void 0) {
			if (J$2(e, t, n, r, "Literal `undefined` cannot be represented in JSON Schema")) return;
		} else if (typeof o == `bigint`) {
			if (J$2(e, t, n, r, `BigInt literals cannot be represented in JSON Schema`)) return;
			a.push(Number(o));
		} else a.push(o);
		if (a.length !== 0) {
			if (a.length === 1) {
				let e = a[0];
				n.type = e === null ? `null` : typeof e, t.target === `draft-04` || t.target === `openapi-3.0` ? n.enum = [e] : n.const = e;
			} else a.every((e) => typeof e == `number`) && (n.type = `number`), a.every((e) => typeof e == `string`) && (n.type = `string`), a.every((e) => typeof e == `boolean`) && (n.type = `boolean`), a.every((e) => e === null) && (n.type = `null`), n.enum = a;
		}
	};
	wf = (e, t, n, r) => {
		J$2(e, t, n, r, `NaN cannot be represented in JSON Schema`);
	};
	Tf = (e, t, n, r) => {
		let i = n;
		let a = e._zod.pattern;
		if (!a) throw Error(`Pattern not found in template literal`);
		i.type = `string`, i.pattern = a.source;
	};
	Ef = (e, t, n, r) => {
		let i = n;
		i.type = `string`, i.format = `binary`, i.contentEncoding = `binary`;
		let { minimum: a, maximum: o, mime: s } = $$2(e);
		a !== void 0 && (i.minLength = a), o !== void 0 && (i.maxLength = o), s && (s.length === 0 ? i.not = {} : s.length === 1 ? i.contentMediaType = s[0] : i.anyOf = s.map((e) => ({ contentMediaType: e })));
	};
	Df = (e, t, n, r) => {
		n.type = `boolean`;
	};
	Of = (e, t, n, r) => {
		J$2(e, t, n, r, `Custom types cannot be represented in JSON Schema`);
	};
	kf = (e, t, n, r) => {
		J$2(e, t, n, r, `Function types cannot be represented in JSON Schema`);
	};
	Af = (e, t, n, r) => {
		J$2(e, t, n, r, `Transforms cannot be represented in JSON Schema`);
	};
	jf = (e, t, n, r) => {
		J$2(e, t, n, r, `Map cannot be represented in JSON Schema`);
	};
	Mf = (e, t, n, r) => {
		J$2(e, t, n, r, `Set cannot be represented in JSON Schema`);
	};
	Nf = (e, t, n, r) => {
		let i = n;
		let a = e._zod.def;
		let { minimum: o, maximum: s } = $$2(e);
		typeof o == `number` && (i.minItems = o), typeof s == `number` && (i.maxItems = s), i.type = `array`, i.items = Y$2(a.element, t, {
			...r,
			path: [...r.path, `items`]
		});
	};
	Ff = (e, t, n, r) => {
		let i = n;
		let a = e._zod.def;
		let o = a.shape;
		if (Object.getOwnPropertySymbols(o).length && J$2(e, t, i, r, `Symbol keys cannot be represented in JSON Schema`)) return;
		i.type = `object`, i.properties = {};
		for (let e in o) g$1(i.properties, e, Y$2(o[e], t, {
			...r,
			path: [
				...r.path,
				`properties`,
				e
			]
		}));
		let s = [];
		for (let e of Object.keys(o)) {
			let n = a.shape[e];
			(t.io === `input` ? Pf(n) === void 0 : n._zod.optout === void 0) && s.push(e);
		}
		s.length > 0 && (i.required = s), a.catchall?._zod.def.type === `never` ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = Y$2(a.catchall, t, {
			...r,
			path: [...r.path, `additionalProperties`]
		})) : t.io === `output` && (i.additionalProperties = !1);
	};
	If = (e, t, n, r) => {
		let i = e._zod.def;
		let a = i.inclusive === !1;
		let o = i.options.map((e, n) => Y$2(e, t, {
			...r,
			path: [
				...r.path,
				a ? `oneOf` : `anyOf`,
				n
			]
		}));
		a ? n.oneOf = o : n.anyOf = o;
	};
	Lf = (e, t, n, r) => {
		let i = e._zod.def;
		let a = Y$2(i.left, t, {
			...r,
			path: [
				...r.path,
				`allOf`,
				0
			]
		});
		let o = Y$2(i.right, t, {
			...r,
			path: [
				...r.path,
				`allOf`,
				1
			]
		});
		let s = (e) => `allOf` in e && Object.keys(e).length === 1;
		let c = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
		n.allOf = c, t.intersections.push(c);
	};
	Rf = (e, t, n, r) => {
		let i = n;
		let a = e._zod.def;
		i.type = `array`;
		let o = t.target === `draft-2020-12` ? `prefixItems` : `items`;
		let s = t.target === `draft-2020-12` || t.target === `openapi-3.0` ? `items` : `additionalItems`;
		let c = a.items.map((e, n) => Y$2(e, t, {
			...r,
			path: [
				...r.path,
				o,
				n
			]
		}));
		let l = a.rest ? Y$2(a.rest, t, {
			...r,
			path: [
				...r.path,
				s,
				...t.target === `openapi-3.0` ? [a.items.length] : []
			]
		}) : null;
		let u = a.items.length;
		for (; u > 0;) {
			let e = a.items[u - 1];
			if (!(t.io === `input` ? Pf(e) !== void 0 : e._zod.optout === `optional`)) break;
			u--;
		}
		let d = a.items.length;
		let f = !a.rest;
		t.target === `draft-2020-12` ? (i.prefixItems = c, f ? i.items = !1 : l && (i.items = l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : t.target === `openapi-3.0` ? (i.items = { anyOf: c }, l && i.items.anyOf.push(l), u > 0 && (i.minItems = u), f && (i.maxItems = d)) : (i.items = c, f ? i.additionalItems = !1 : l && (i.additionalItems = l), u > 0 && (i.minItems = u), f && (i.maxItems = d));
		let { minimum: p, maximum: m } = $$2(e);
		typeof p == `number` && (i.minItems = p), typeof m == `number` && (i.maxItems = m);
	};
	Bf = new WeakMap();
	Hf = (e, t, n, r) => {
		let i = n;
		let a = e._zod.def;
		i.type = `object`;
		let o = a.keyType;
		let s = $$2(o).patterns;
		if (a.mode === `loose` && s && s.size > 0) {
			let e = Y$2(a.valueType, t, {
				...r,
				path: [
					...r.path,
					`patternProperties`,
					`*`
				]
			});
			i.patternProperties = {};
			for (let t of s) g$1(i.patternProperties, lf(t).source, e);
		} else {
			if (t.target === `draft-07` || t.target === `draft-2020-12`) {
				i.propertyNames = Y$2(a.keyType, t, {
					...r,
					path: [...r.path, `propertyNames`]
				});
				let n = Bf.get(t);
				n || (n = [], Bf.set(t, n), t.deferred.push(() => Vf(t))), n.push(e);
			}
			i.additionalProperties = Y$2(a.valueType, t, {
				...r,
				path: [...r.path, `additionalProperties`]
			});
		}
		let c = o._zod.values;
		let l = t.io === `input` && Pf(a.valueType) !== void 0;
		if (c && !a.partial && !l) {
			let e = [...c].filter((e) => typeof e == `string` || typeof e == `number`);
			e.length > 0 && (i.required = e.map(String));
		}
	};
	Uf = (e, t, n, r) => {
		let i = e._zod.def;
		let a = Y$2(i.innerType, t, r);
		let o = t.seen.get(e);
		t.target === `openapi-3.0` ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: `null` }];
	};
	Wf = (e, t, n, r) => {
		let i = e._zod.def;
		Y$2(i.innerType, t, r);
		let a = t.seen.get(e);
		a.ref = i.innerType;
	};
	Gf = Symbol();
	qf = (e, t, n, r) => {
		let i = e._zod.def;
		Y$2(i.innerType, t, r);
		let a = t.seen.get(e);
		a.ref = i.innerType;
		let o = Kf(i.defaultValue, e, t, n, r);
		o !== Gf && (n.default = o);
	};
	Jf = (e, t, n, r) => {
		let i = e._zod.def;
		Y$2(i.innerType, t, r);
		let a = t.seen.get(e);
		if (a.ref = i.innerType, t.io !== `input`) return;
		let o = Kf(i.defaultValue, e, t, n, r);
		o !== Gf && (n._prefault = o);
	};
	Yf = (e, t, n, r) => {
		let i = e._zod.def;
		Y$2(i.innerType, t, r);
		let a = t.seen.get(e);
		a.ref = i.innerType;
		let o;
		try {
			o = i.catchValue(void 0);
		} catch {
			J$2(e, t, n, r, `Dynamic catch values are not supported in JSON Schema`);
			return;
		}
		n.default = o;
	};
	Xf = (e, t, n, r) => {
		let i = e._zod.def;
		let a = i.in._zod.traits.has(`$ZodTransform`);
		let o = t.io === `input` ? a ? i.out : i.in : i.out;
		Y$2(o, t, r);
		let s = t.seen.get(e);
		s.ref = o;
	};
	Zf = (e, t, n, r) => {
		let i = e._zod.def;
		Y$2(i.innerType, t, r);
		let a = t.seen.get(e);
		a.ref = i.innerType, n.readOnly = !0;
	};
	Qf = (e, t, n, r) => {
		let i = e._zod.def;
		Y$2(i.innerType, t, r);
		let a = t.seen.get(e);
		a.ref = i.innerType;
	};
	$f = (e, t, n, r) => {
		let i = e._zod.def;
		Y$2(i.innerType, t, r);
		let a = t.seen.get(e);
		a.ref = i.innerType;
	};
	ep = (e, t, n, r) => {
		let i = e._zod.innerType;
		Y$2(i, t, r);
		let a = t.seen.get(e);
		a.ref = i;
	};
	tp = {
		string: uf,
		number: df,
		boolean: ff,
		bigint: pf,
		symbol: mf,
		null: hf,
		undefined: gf,
		void: _f,
		never: vf,
		any: yf,
		unknown: bf,
		date: xf,
		enum: Sf,
		literal: Cf,
		nan: wf,
		template_literal: Tf,
		file: Ef,
		success: Df,
		custom: Of,
		function: kf,
		transform: Af,
		map: jf,
		set: Mf,
		array: Nf,
		object: Ff,
		union: If,
		intersection: Lf,
		tuple: Rf,
		record: Hf,
		nullable: Uf,
		nonoptional: Wf,
		default: qf,
		prefault: Jf,
		catch: Yf,
		pipe: Xf,
		readonly: Zf,
		promise: Qf,
		optional: $f,
		lazy: ep
	};
	rp = class {
		get metadataRegistry() {
			return this.ctx.metadataRegistry;
		}
		get target() {
			return this.ctx.target;
		}
		get unrepresentable() {
			return this.ctx.unrepresentable;
		}
		get override() {
			return this.ctx.override;
		}
		get io() {
			return this.ctx.io;
		}
		get counter() {
			return this.ctx.counter;
		}
		set counter(e) {
			this.ctx.counter = e;
		}
		get seen() {
			return this.ctx.seen;
		}
		constructor(e) {
			let t = e?.target ?? `draft-2020-12`;
			t === `draft-4` && (t = `draft-04`), t === `draft-7` && (t = `draft-07`), this.ctx = q$2({
				processors: tp,
				target: t,
				...e?.metadata && { metadata: e.metadata },
				...e?.unrepresentable && { unrepresentable: e.unrepresentable },
				...e?.override && { override: e.override },
				...e?.io && { io: e.io }
			});
		}
		process(e, t = {
			path: [],
			schemaPath: []
		}) {
			return Y$2(e, this.ctx, t);
		}
		emit(e, t) {
			t && (t.cycles && (this.ctx.cycles = t.cycles), t.reused && (this.ctx.reused = t.reused), t.external && (this.ctx.external = t.external)), this.ctx.sharedDefsExtractedFor = void 0, this.ctx.sharedEmitDoneFor = void 0, X$3(this.ctx, e);
			let { "~standard": n, ...r } = Z$2(this.ctx, e);
			return r;
		}
	};
	ip = t$2({});
	ap = t$2({
		$ZodAny: () => ui,
		$ZodArray: () => bi,
		$ZodAsyncError: () => qe$2,
		$ZodBase64: () => Vr,
		$ZodBase64URL: () => Wr,
		$ZodBigInt: () => ai,
		$ZodBigIntFormat: () => oi,
		$ZodBoolean: () => ii,
		$ZodCIDRv4: () => Ir,
		$ZodCIDRv6: () => Rr,
		$ZodCUID: () => Sr,
		$ZodCUID2: () => Cr,
		$ZodCatch: () => sa$1,
		$ZodCheck: () => j$2,
		$ZodCheckBigIntFormat: () => In,
		$ZodCheckEndsWith: () => Yn,
		$ZodCheckGreaterThan: () => Nn,
		$ZodCheckIncludes: () => qn,
		$ZodCheckLengthEquals: () => Hn,
		$ZodCheckLessThan: () => Mn,
		$ZodCheckLowerCase: () => Gn,
		$ZodCheckMaxLength: () => Bn,
		$ZodCheckMaxSize: () => Ln,
		$ZodCheckMimeType: () => $n,
		$ZodCheckMinLength: () => Vn,
		$ZodCheckMinSize: () => Rn,
		$ZodCheckMultipleOf: () => Pn,
		$ZodCheckNumberFormat: () => Fn,
		$ZodCheckOverwrite: () => er,
		$ZodCheckProperties: () => Qn,
		$ZodCheckProperty: () => Zn,
		$ZodCheckRegex: () => Wn,
		$ZodCheckSizeEquals: () => zn,
		$ZodCheckStartsWith: () => Jn,
		$ZodCheckStringFormat: () => Un,
		$ZodCheckUpperCase: () => Kn,
		$ZodCodec: () => da$1,
		$ZodCreditCard: () => Yr,
		$ZodCustom: () => Ca$1,
		$ZodCustomStringFormat: () => ti,
		$ZodCyclicError: () => Ta$1,
		$ZodDate: () => mi,
		$ZodDefault: () => ea$1,
		$ZodDiscriminatedUnion: () => Ni,
		$ZodE164: () => Gr,
		$ZodEmail: () => lr,
		$ZodEmoji: () => br,
		$ZodEncodeError: () => Je$2,
		$ZodEnum: () => Ki$1,
		$ZodError: () => Oe$1,
		$ZodExactOptional: () => Qi$1,
		$ZodFile: () => Ji$1,
		$ZodFunction: () => ba$1,
		$ZodGUID: () => sr,
		$ZodIBAN: () => Qr,
		$ZodIPv4: () => jr,
		$ZodIPv6: () => Pr,
		$ZodISODate: () => Or,
		$ZodISODateTime: () => Dr,
		$ZodISODuration: () => Ar,
		$ZodISOTime: () => kr,
		$ZodIntersection: () => Pi,
		$ZodJWT: () => ei,
		$ZodKSUID: () => Er,
		$ZodLazy: () => Sa$1,
		$ZodLiteral: () => qi$1,
		$ZodMAC: () => Fr,
		$ZodMap: () => Hi,
		$ZodNaN: () => ca$1,
		$ZodNanoID: () => xr,
		$ZodNever: () => fi,
		$ZodNonOptional: () => ra$1,
		$ZodNull: () => li,
		$ZodNullable: () => $i$1,
		$ZodNumber: () => ni,
		$ZodNumberFormat: () => ri,
		$ZodObject: () => Ti,
		$ZodObjectJIT: () => Ei,
		$ZodOptional: () => Zi$1,
		$ZodPipe: () => la$1,
		$ZodPrefault: () => na$1,
		$ZodPreprocess: () => ma$1,
		$ZodPromise: () => xa$1,
		$ZodReadonly: () => ha$1,
		$ZodRealError: () => A$2,
		$ZodRecord: () => Vi,
		$ZodRegistry: () => dc$1,
		$ZodSet: () => Wi,
		$ZodString: () => or,
		$ZodStringFormat: () => N$2,
		$ZodSuccess: () => aa$1,
		$ZodSymbol: () => si,
		$ZodTemplateLiteral: () => ya$1,
		$ZodTransform: () => Yi$1,
		$ZodTuple: () => Li,
		$ZodType: () => M$2,
		$ZodULID: () => wr,
		$ZodURL: () => yr,
		$ZodUUID: () => cr,
		$ZodUndefined: () => ci,
		$ZodUnion: () => Oi,
		$ZodUnknown: () => di,
		$ZodVoid: () => pi,
		$ZodXID: () => Tr,
		$ZodXor: () => Ai,
		$brand: () => Ke$2,
		$constructor: () => Ge$2,
		$input: () => uc$1,
		$output: () => lc$1,
		Doc: () => tr,
		INVALID: () => F$2,
		JSONSchema: () => ip,
		JSONSchemaGenerator: () => rp,
		NEVER: () => He$2,
		TimePrecision: () => ru,
		URL_BAD_FORMAT: () => 1,
		URL_UNPARSEABLE: () => 2,
		ZodCompileAsyncError: () => I$2,
		ZodCompileUnsupportedError: () => L$2,
		_any: () => wu,
		_array: () => od,
		_base64: () => Zl,
		_base64url: () => Ql,
		_bigint: () => _u,
		_boolean: () => hu,
		_catch: () => Td,
		_check: () => Pd,
		_cidrv4: () => Yl,
		_cidrv6: () => Xl,
		_coercedBigint: () => vu,
		_coercedBoolean: () => gu,
		_coercedDate: () => ku,
		_coercedNumber: () => lu,
		_coercedString: () => jl,
		_creditCard: () => eu,
		_cuid: () => Vl,
		_cuid2: () => Hl,
		_custom: () => jd,
		_date: () => Ou,
		_decode: () => Qe$1,
		_decodeAsync: () => nt$1,
		_default: () => Sd,
		_discriminatedUnion: () => ld,
		_e164: () => $l,
		_email: () => Ml,
		_emoji: () => zl,
		_encode: () => Xe$1,
		_encodeAsync: () => et$1,
		_endsWith: () => Zu,
		_enum: () => hd,
		_file: () => vd,
		_float32: () => du,
		_float64: () => fu,
		_gt: () => Nu,
		_gte: () => Pu,
		_guid: () => Nl,
		_iban: () => tu,
		_includes: () => Yu,
		_int: () => uu,
		_int32: () => pu,
		_int64: () => yu,
		_intersection: () => ud,
		_ipv4: () => Kl,
		_ipv6: () => ql,
		_isoDate: () => au,
		_isoDateTime: () => iu,
		_isoDuration: () => su,
		_isoTime: () => ou,
		_jwt: () => nu,
		_ksuid: () => Gl,
		_lazy: () => kd,
		_length: () => Gu,
		_literal: () => _d,
		_lowercase: () => qu,
		_lt: () => ju,
		_lte: () => Mu,
		_mac: () => Jl,
		_map: () => pd,
		_max: () => Mu,
		_maxLength: () => Uu,
		_maxSize: () => Bu,
		_mime: () => ed,
		_min: () => Pu,
		_minLength: () => Wu,
		_minSize: () => Vu,
		_multipleOf: () => zu,
		_nan: () => Au,
		_nanoid: () => Bl,
		_nativeEnum: () => gd,
		_negative: () => Iu,
		_never: () => Eu,
		_nonnegative: () => Ru,
		_nonoptional: () => Cd,
		_nonpositive: () => Lu,
		_normalize: () => td,
		_null: () => Cu,
		_nullable: () => xd,
		_number: () => cu,
		_optional: () => bd,
		_overwrite: () => K$2,
		_parse: () => Ie$1,
		_parseAsync: () => Re$1,
		_pipe: () => Ed,
		_positive: () => Fu,
		_promise: () => Ad,
		_properties: () => $u,
		_property: () => Qu,
		_readonly: () => Dd,
		_record: () => fd,
		_refine: () => Md,
		_regex: () => Ku,
		_safeDecode: () => ot$1,
		_safeDecodeAsync: () => ut$1,
		_safeEncode: () => it$1,
		_safeEncodeAsync: () => ct$1,
		_safeParse: () => Be$1,
		_safeParseAsync: () => Ue$1,
		_set: () => md,
		_size: () => Hu,
		_slugify: () => ad,
		_startsWith: () => Xu,
		_string: () => Al,
		_stringFormat: () => Rd,
		_stringbool: () => Ld,
		_success: () => wd,
		_superRefine: () => Nd,
		_symbol: () => xu,
		_templateLiteral: () => Od,
		_toLowerCase: () => rd,
		_toUpperCase: () => id,
		_transform: () => yd,
		_trim: () => nd,
		_tuple: () => dd,
		_uint32: () => mu,
		_uint64: () => bu,
		_ulid: () => Ul,
		_undefined: () => Su,
		_union: () => sd,
		_unknown: () => Tu,
		_uppercase: () => Ju,
		_url: () => Rl,
		_uuid: () => Pl,
		_uuidv4: () => Fl,
		_uuidv6: () => Il,
		_uuidv7: () => Ll,
		_void: () => Du,
		_xid: () => Wl,
		_xor: () => cd,
		base64Charset: () => Br,
		base64urlCharset: () => Hr,
		canParseURL: () => fr,
		clone: () => k$2,
		compile: () => hc$1,
		compileFn: () => vc$1,
		config: () => Ye$2,
		createStandardJSONSchemaMethod: () => Jd,
		createToJSONSchemaMethod: () => qd,
		decode: () => $e$1,
		decodeAsync: () => rt$1,
		describe: () => Fd,
		encode: () => Ze$1,
		encodeAsync: () => tt$1,
		extractDefs: () => X$3,
		finalize: () => Z$2,
		flattenError: () => Ae$1,
		formatError: () => je$1,
		getDiscriminatedOption: () => ji,
		globalConfig: () => $$3,
		globalRegistry: () => P$2,
		handleUnrepresentable: () => J$2,
		initializeContext: () => q$2,
		isBackEdge: () => za$1,
		isRecursiveSchema: () => Na$1,
		isValidBase64: () => zr,
		isValidBase64URL: () => Ur,
		isValidCIDRv6: () => Lr,
		isValidCreditCard: () => Jr,
		isValidIBAN: () => Zr,
		isValidIPv6: () => Nr,
		isValidJWT: () => $r,
		locales: () => sc$1,
		memoizer: () => Ra$1,
		mergeValues: () => Fi,
		meta: () => Id,
		parse: () => Le$1,
		parseAsync: () => ze$1,
		parseURLObject: () => mr,
		prettifyError: () => Pe$1,
		process: () => Y$2,
		processSchema: () => Y$2,
		regexes: () => ft$1,
		registry: () => fc$1,
		safeDecode: () => st$1,
		safeDecodeAsync: () => dt$1,
		safeEncode: () => at$1,
		safeEncodeAsync: () => lt$1,
		safeParse: () => Ve$1,
		safeParseAsync: () => We$1,
		standardProps: () => ar,
		stripTabAndNewline: () => gr,
		toDotPath: () => Ne$1,
		toJSONSchema: () => np,
		toZod: () => i$1,
		treeifyError: () => Me$1,
		urlHostnameOk: () => _r,
		urlProtocolOk: () => vr,
		util: () => t$1,
		validate: () => qe$1,
		validateAsync: () => Ye$1,
		validateURL: () => pr,
		version: () => nr,
		withParser: () => gc$1
	});
}));
function qi(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = n(this);
			return Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	});
}
function la() {
	$$3.localeError || Ye$2(Ze$2());
}
function C$1() {
	$$3.memoizer || Ye$2({ memoizer: Ra$1() });
}
function E$1(e) {
	return Al(T$1, e);
}
function fa(e) {
	return Ml(da, e);
}
function ma(e) {
	return Nl(pa, e);
}
function ha(e) {
	return Pl(M$1, e);
}
function ga(e) {
	return Fl(M$1, e);
}
function _a(e) {
	return Il(M$1, e);
}
function va(e) {
	return Ll(M$1, e);
}
function ba(e) {
	return Rl(ya, e);
}
function xa(e) {
	return Rl(ya, {
		protocol: Ut$1,
		hostname: Ht$1,
		...A$3(e)
	});
}
function Ca(e) {
	return zl(Sa, e);
}
function Ta(e) {
	return Bl(wa, e);
}
function Da(e) {
	return Vl(Ea, e);
}
function ka(e) {
	return Hl(Oa, e);
}
function ja(e) {
	return Ul(Aa, e);
}
function Na(e) {
	return Wl(Ma, e);
}
function Fa(e) {
	return Gl(Pa, e);
}
function La(e) {
	return Kl(Ia, e);
}
function za(e) {
	return Jl(Ra, e);
}
function Va(e) {
	return ql(Ba, e);
}
function Ua(e) {
	return Yl(Ha, e);
}
function Ga(e) {
	return Xl(Wa, e);
}
function qa(e) {
	return Zl(Ka, e);
}
function Ya(e) {
	return Ql(Ja, e);
}
function Za(e) {
	return $l(Xa, e);
}
function $a(e) {
	return eu(Qa, e);
}
function to(e) {
	return tu(eo, e);
}
function ro(e) {
	return nu(no, e);
}
function io(e, t, n = {}) {
	return Rd(N$1, e, t, n);
}
function ao(e) {
	return Rd(N$1, `hostname`, Vt$1, e);
}
function oo(e) {
	return Rd(N$1, `hex`, dn, e);
}
function so(e) {
	return Rd(N$1, `currency_code`, Kt$1, e);
}
function co(e, t) {
	let n = `${e}_${t?.enc ?? `hex`}`;
	let r = ft$1[n];
	if (!r) throw Error(`Unrecognized hash format: ${n}`);
	return Rd(N$1, n, r, t);
}
function lo(e) {
	return cu(P$1, e);
}
function uo(e) {
	return uu(F$1, e);
}
function fo(e) {
	return du(F$1, e);
}
function po(e) {
	return fu(F$1, e);
}
function mo(e) {
	return pu(F$1, e);
}
function ho(e) {
	return mu(F$1, e);
}
function go(e) {
	return hu(I$1, e);
}
function _o(e) {
	return _u(L$1, e);
}
function yo(e) {
	return yu(vo, e);
}
function bo(e) {
	return bu(vo, e);
}
function So(e) {
	return xu(xo, e);
}
function wo(e) {
	return Su(Co, e);
}
function Eo(e) {
	return Cu(To, e);
}
function Oo() {
	return wu(Do);
}
function R$2() {
	return Tu(ko);
}
function jo(e) {
	return Eu(Ao, e);
}
function No(e) {
	return Du(Mo, e);
}
function Fo(e) {
	return Ou(Po, e);
}
function z$2(e, t) {
	return od(Io, e, t);
}
function Lo(e) {
	let t = e._zod.def.shape;
	return ns(Object.keys(t));
}
function Ro(e, t) {
	let n = {
		type: `object`,
		shape: e ?? {},
		...A$3(t)
	};
	return new B$1(n);
}
function zo(e, t) {
	return new B$1({
		type: `object`,
		shape: e,
		catchall: jo(),
		...A$3(t)
	});
}
function Bo(e, t) {
	return new B$1({
		type: `object`,
		shape: e,
		catchall: R$2(),
		...A$3(t)
	});
}
function H$2(e, t) {
	return new V$2({
		type: `union`,
		options: e,
		...A$3(t)
	});
}
function Ho(e, t) {
	return new Vo({
		type: `union`,
		options: e,
		inclusive: !1,
		...A$3(t)
	});
}
function Wo(e, t, n) {
	return new Uo({
		type: `union`,
		options: t,
		discriminator: e,
		...A$3(n)
	});
}
function Ko(e, t) {
	return new Go({
		type: `intersection`,
		left: e,
		right: t
	});
}
function Jo(e, t, n) {
	let r = t instanceof M$2;
	return new qo({
		type: `tuple`,
		items: e,
		rest: r ? t : null,
		...A$3(r ? n : t)
	});
}
function Yo(e, t, n) {
	return !t || !t._zod ? new U$1({
		type: `record`,
		keyType: E$1(),
		valueType: e,
		...A$3(t)
	}) : new U$1({
		type: `record`,
		keyType: e,
		valueType: t,
		...A$3(n)
	});
}
function Xo(e, t, n) {
	return new U$1({
		type: `record`,
		keyType: e,
		valueType: t,
		...A$3(n),
		partial: !0
	});
}
function Zo(e, t, n) {
	return new U$1({
		type: `record`,
		keyType: e,
		valueType: t,
		mode: `loose`,
		...A$3(n)
	});
}
function $o(e, t, n) {
	return new Qo({
		type: `map`,
		keyType: e,
		valueType: t,
		...A$3(n)
	});
}
function ts(e, t) {
	return new es({
		type: `set`,
		valueType: e,
		...A$3(t)
	});
}
function ns(e, t) {
	let n = Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e;
	return new W$1({
		type: `enum`,
		entries: n,
		...A$3(t)
	});
}
function rs(e, t) {
	return new W$1({
		type: `enum`,
		entries: e,
		...A$3(t)
	});
}
function as(e, t) {
	return new is({
		type: `literal`,
		values: Array.isArray(e) ? e : [e],
		...A$3(t)
	});
}
function ss(e) {
	return vd(os, e);
}
function ls(e) {
	return new cs({
		type: `transform`,
		transform: e
	});
}
function K$1(e) {
	return new G$1({
		type: `optional`,
		innerType: e
	});
}
function ds(e) {
	return new us({
		type: `optional`,
		innerType: e
	});
}
function q$1(e) {
	return new fs({
		type: `nullable`,
		innerType: e
	});
}
function ps(e) {
	return K$1(q$1(e));
}
function hs(e, t) {
	return new ms({
		type: `default`,
		innerType: e,
		get defaultValue() {
			return typeof t == `function` ? t() : T$2(t);
		}
	});
}
function _s(e, t) {
	return new gs({
		type: `prefault`,
		innerType: e,
		get defaultValue() {
			return typeof t == `function` ? t() : T$2(t);
		}
	});
}
function ys(e, t) {
	return new vs({
		type: `nonoptional`,
		innerType: e,
		...A$3(t)
	});
}
function xs(e) {
	return new bs({
		type: `success`,
		innerType: e
	});
}
function Cs(e, t) {
	return new Ss({
		type: `catch`,
		innerType: e,
		catchValue: typeof t == `function` ? t : Be$2(t)
	});
}
function Ts(e) {
	return Au(ws, e);
}
function Es(e, t) {
	return new J$1({
		type: `pipe`,
		in: e,
		out: t
	});
}
function Ds(e, t, n) {
	return new Y$1({
		type: `pipe`,
		in: e,
		out: t,
		transform: n.decode,
		reverseTransform: n.encode
	});
}
function Os(e) {
	let t = e._zod.def;
	return new Y$1({
		type: `pipe`,
		in: t.out,
		out: t.in,
		transform: t.reverseTransform,
		reverseTransform: t.transform
	});
}
function js(e) {
	return new As({
		type: `readonly`,
		innerType: e
	});
}
function Ns(e, t) {
	return new Ms({
		type: `template_literal`,
		parts: e,
		...A$3(t)
	});
}
function Fs(e) {
	return new Ps({
		type: `lazy`,
		getter: e
	});
}
function Ls(e) {
	return new Is({
		type: `promise`,
		innerType: e
	});
}
function X$2(e) {
	return new Rs({
		type: `function`,
		input: Array.isArray(e?.input) ? Jo(e?.input) : e?.input ?? z$2(R$2()),
		output: e?.output ?? R$2()
	});
}
function zs(e) {
	let t = new j$2({ check: `custom` });
	return t._zod.check = e, t;
}
function Bs(e, t) {
	return jd(Z$1, e ?? (() => !0), t);
}
function Vs(e, t = {}) {
	return Md(Z$1, e, t);
}
function Hs(e, t) {
	return Nd(e, t);
}
function Ks(e, t = {}) {
	let n = new Gs({
		type: `custom`,
		check: `custom`,
		fn: (t) => t instanceof e,
		abort: !0,
		...A$3(t)
	});
	return n._zod.bag.Class = e, n._zod.check = (t) => {
		t.value instanceof e || t.issues.push({
			code: `invalid_type`,
			expected: e.name,
			input: t.value,
			inst: n,
			path: [...n._zod.def.path ?? []]
		});
	}, n;
}
function Js(e) {
	let t = Fs(() => H$2([
		E$1(e),
		lo(),
		go(),
		Eo(),
		z$2(t),
		Yo(E$1(), t)
	]));
	return t;
}
function Ys(e, t) {
	return new ks({
		type: `pipe`,
		in: ls(e),
		out: t
	});
}
function Zs(e) {
	Ye$2({ customError: e });
}
function Qs() {
	return Ye$2().customError;
}
function tc(e) {
	return iu(O$2, e);
}
function nc(e) {
	return au(k$1, e);
}
function rc(e) {
	return ou(A$1, e);
}
function ic(e) {
	return su(j$1, e);
}
function oc(e, t) {
	let n = e.$schema;
	return n === `https://json-schema.org/draft/2020-12/schema` ? `draft-2020-12` : n === `http://json-schema.org/draft-07/schema#` ? `draft-7` : n === `http://json-schema.org/draft-04/schema#` ? `draft-4` : t ?? `draft-2020-12`;
}
function sc(e, t) {
	return e.map((e, n) => n < t ? e : e.optional());
}
function cc(e) {
	return e.replace(/~1/g, `/`).replace(/~0/g, `~`);
}
function lc(e, t) {
	if (!e.startsWith(`#`)) throw Error(`External $ref is not supported, only local refs (#/...) are allowed`);
	let n = e.slice(1).split(`/`).filter(Boolean);
	if (n.length === 0) return t.rootSchema;
	let r = t.version === `draft-2020-12` ? `$defs` : `definitions`;
	if (n[0] === r) {
		let r = n[1] === void 0 ? void 0 : cc(n[1]);
		if (!r || !t.defs[r]) throw Error(`Reference not found: ${e}`);
		return t.defs[r];
	}
	throw Error(`Reference not found: ${e}`);
}
function uc(e, t) {
	return Q$1.transform((e) => e).check((n) => {
		let r = n.value;
		if (typeof r != `object` || !r || Array.isArray(r)) return;
		let i = Object.getOwnPropertyNames(r);
		if (t.minProperties !== void 0 && i.length < t.minProperties && n.issues.push({
			origin: `object`,
			code: `too_small`,
			minimum: t.minProperties,
			inclusive: !0,
			message: `Too small: expected object to have >=${t.minProperties} properties`,
			input: r,
			inst: e,
			continue: !0
		}), t.maxProperties !== void 0 && i.length > t.maxProperties && n.issues.push({
			origin: `object`,
			code: `too_big`,
			maximum: t.maxProperties,
			inclusive: !0,
			message: `Too big: expected object to have <=${t.maxProperties} properties`,
			input: r,
			inst: e,
			continue: !0
		}), t.keySchema) for (let e of i) {
			let r = t.keySchema.safeParse(e);
			r.success || n.issues.push({
				code: `invalid_key`,
				origin: `record`,
				issues: r.error.issues,
				input: e,
				path: [e],
				continue: !0
			});
		}
	}).pipe(e);
}
function dc(e, t) {
	if (e === null) return `z`;
	let n = typeof e;
	if (n !== `object`) {
		if (n === `number` && Number.isNaN(e)) return null;
		let t = String(e);
		return `${n[0]}${t.length}:${t}`;
	}
	if (t.has(e)) return null;
	t.add(e);
	try {
		if (Array.isArray(e)) {
			let n = [];
			for (let r of e) {
				let e = dc(r, t);
				if (e === null) return null;
				n.push(e);
			}
			return `a${n.length}:[${n.join(`,`)}]`;
		}
		let n = Object.keys(e).sort();
		let r = [];
		for (let i of n) {
			let n = dc(e[i], t);
			if (n === null) return null;
			r.push(`${i.length}:${i}=${n}`);
		}
		return `o${r.length}:{${r.join(`,`)}}`;
	} finally {
		t.delete(e);
	}
}
function mc(e) {
	return typeof e != `object` || !e ? !1 : Array.isArray(e) ? e.some(mc) : typeof e.$ref == `string` || Object.entries(e).some(([e, t]) => fc.has(e) ? mc(t) : !pc.has(e) || typeof t != `object` || !t ? !1 : Object.values(t).some(mc));
}
function hc(e) {
	return e === 1 ? `element` : `elements`;
}
function gc(e, t) {
	return Q$1.transform((e) => e).check((e) => {
		let n = e.value;
		if (Array.isArray(n)) {
			if (t.uniqueItems === !0) {
				let t = new Map();
				for (let r = 0; r < n.length; r++) {
					let i = dc(n[r], new Set());
					if (i === null) continue;
					let a = t.get(i);
					a === void 0 ? t.set(i, r) : e.issues.push({
						code: `custom`,
						message: `Array items must be unique: element at index ${r} duplicates the one at index ${a}`,
						input: n,
						path: [r],
						continue: !0
					});
				}
			}
			if (t.containsSchema) {
				let r = t.minContains ?? 1;
				let i = t.maxContains === void 0 ? 1 / 0 : t.maxContains + 1;
				let a = 0;
				for (let e of n) if (t.containsSchema.safeParse(e).success && ++a >= i) break;
				a < r && e.issues.push({
					code: `custom`,
					message: `Array must contain at least ${r} matching ${hc(r)}; found ${a}`,
					input: n,
					continue: !0
				}), t.maxContains !== void 0 && a > t.maxContains && e.issues.push({
					code: `custom`,
					message: `Array must contain at most ${t.maxContains} matching ${hc(t.maxContains)}`,
					input: n,
					continue: !0
				});
			}
		}
	}).pipe(e);
}
function _c(e, t) {
	if (e !== !1) return e === void 0 || e === !0 ? Q$1.any() : $$1(e, t);
}
function yc(e, t) {
	if (e.not !== void 0) {
		if (typeof e.not == `object` && Object.keys(e.not).length === 0) return Q$1.never();
		throw Error(`not is not supported in Zod (except { not: {} } for never)`);
	}
	if (e.unevaluatedItems !== void 0) throw Error(`unevaluatedItems is not supported`);
	if (e.unevaluatedProperties !== void 0) throw Error(`unevaluatedProperties is not supported`);
	if (e.if !== void 0 || e.then !== void 0 || e.else !== void 0) throw Error(`Conditional schemas (if/then/else) are not supported`);
	if (e.dependentSchemas !== void 0 || e.dependentRequired !== void 0) throw Error(`dependentSchemas and dependentRequired are not supported`);
	if (e.$ref) {
		let n = e.$ref;
		if (t.refs.has(n)) return t.refs.get(n);
		if (t.processing.has(n)) return Q$1.lazy(() => {
			if (!t.refs.has(n)) throw Error(`Circular reference not resolved: ${n}`);
			return t.refs.get(n);
		});
		t.processing.add(n);
		let r = $$1(lc(n, t), t);
		return t.refs.set(n, r), t.processing.delete(n), r;
	}
	if (e.enum !== void 0) {
		let n = e.enum;
		if (t.version === `openapi-3.0` && e.nullable === !0 && n.length === 1 && n[0] === null) return Q$1.null();
		if (n.length === 0) return Q$1.never();
		if (n.length === 1) return Q$1.literal(n[0]);
		if (n.every((e) => typeof e == `string`)) return Q$1.enum(n);
		let r = n.map((e) => Q$1.literal(e));
		return r.length < 2 ? r[0] : Q$1.union([
			r[0],
			r[1],
			...r.slice(2)
		]);
	}
	if (e.const !== void 0) return Q$1.literal(e.const);
	let n = e.type;
	if (Array.isArray(n)) {
		let r = n.map((n) => yc({
			...e,
			type: n
		}, t));
		return r.length === 0 ? Q$1.never() : r.length === 1 ? r[0] : Q$1.union(r);
	}
	if (!n) return Q$1.any();
	let r;
	switch (n) {
		case `string`: {
			let t = Q$1.string();
			if (e.format) {
				let n = e.format;
				n === `email` ? t = t.check(Q$1.email()) : n === `uri` || n === `uri-reference` ? t = t.check(Q$1.url()) : n === `uuid` || n === `guid` ? t = t.check(Q$1.uuid()) : n === `date-time` ? t = t.check(Q$1.iso.datetime({ offset: !0 })) : n === `date` ? t = t.check(Q$1.iso.date()) : n === `time` ? t = t.check(Q$1.regex(vc)) : n === `duration` ? t = t.check(Q$1.iso.duration()) : n === `hostname` ? t = t.check(Q$1.hostname()) : n === `ipv4` ? t = t.check(Q$1.ipv4()) : n === `ipv6` ? t = t.check(Q$1.ipv6()) : n === `mac` ? t = t.check(Q$1.mac()) : n === `cidr` ? t = t.check(Q$1.cidrv4()) : n === `cidr-v6` ? t = t.check(Q$1.cidrv6()) : n === `base64` ? t = t.check(Q$1.base64()) : n === `base64url` ? t = t.check(Q$1.base64url()) : n === `e164` ? t = t.check(Q$1.e164()) : n === `credit_card` ? t = t.check(Q$1.creditCard()) : n === `iban` ? t = t.check(Q$1.iban()) : n === `jwt` ? t = t.check(Q$1.jwt()) : n === `emoji` ? t = t.check(Q$1.emoji()) : n === `nanoid` ? t = t.check(Q$1.nanoid()) : n === `cuid` ? t = t.check(Q$1.cuid()) : n === `cuid2` ? t = t.check(Q$1.cuid2()) : n === `ulid` ? t = t.check(Q$1.ulid()) : n === `xid` ? t = t.check(Q$1.xid()) : n === `ksuid` && (t = t.check(Q$1.ksuid()));
			}
			typeof e.minLength == `number` && (t = t.min(e.minLength)), typeof e.maxLength == `number` && (t = t.max(e.maxLength)), e.pattern && (t = t.regex(new RegExp(e.pattern))), r = t;
			break;
		}
		case `number`:
		case `integer`: {
			let t = n === `integer` ? Q$1.number().int() : Q$1.number();
			typeof e.minimum == `number` && e.exclusiveMinimum !== !0 && (t = t.min(e.minimum)), typeof e.maximum == `number` && e.exclusiveMaximum !== !0 && (t = t.max(e.maximum)), typeof e.exclusiveMinimum == `number` ? t = t.gt(e.exclusiveMinimum) : e.exclusiveMinimum === !0 && typeof e.minimum == `number` && (t = t.gt(e.minimum)), typeof e.exclusiveMaximum == `number` ? t = t.lt(e.exclusiveMaximum) : e.exclusiveMaximum === !0 && typeof e.maximum == `number` && (t = t.lt(e.maximum)), typeof e.multipleOf == `number` && (t = t.multipleOf(e.multipleOf)), r = t;
			break;
		}
		case `boolean`:
			r = Q$1.boolean();
			break;
		case `null`:
			r = Q$1.null();
			break;
		case `object`: {
			let n = {};
			let i = e.properties || {};
			let a = new Set(e.required || []);
			let o = typeof e.additionalProperties == `object` ? $$1(e.additionalProperties, t) : void 0;
			for (let [e, r] of Object.entries(i)) {
				let i = $$1(r, t);
				g$1(n, e, a.has(e) ? i : i.optional());
			}
			if (e.patternProperties) {
				let i = e.patternProperties;
				let a = Object.keys(i);
				let o = [];
				for (let e of a) {
					let n = $$1(i[e], t);
					let r = Q$1.string().regex(new RegExp(e));
					o.push(Q$1.looseRecord(r, n));
				}
				let s = [];
				if (Object.keys(n).length > 0 && s.push(Q$1.object(n).passthrough()), s.push(...o), s.length === 0) r = Q$1.object({}).passthrough();
				else if (s.length === 1) r = s[0];
				else {
					let e = Q$1.intersection(s[0], s[1]);
					for (let t = 2; t < s.length; t++) e = Q$1.intersection(e, s[t]);
					r = e;
				}
				if (e.additionalProperties === !1) {
					let e = Object.keys(n);
					let t = a.map((e) => new RegExp(e));
					let i = r;
					r = r.check((n) => {
						if (!w$2(n.value)) return;
						let r = [];
						for (let i of Object.keys(n.value)) e.includes(i) || t.some((e) => e.test(i)) || r.push(i);
						r.length && n.issues.push({
							code: `unrecognized_keys`,
							keys: r,
							input: n.value,
							inst: i
						});
					});
				}
			} else {
				let t = Q$1.object(n);
				r = e.additionalProperties === !1 ? t.strict() : o ? t.catchall(o) : t.passthrough();
			}
			let s = e.propertyNames !== void 0 && e.propertyNames !== !0;
			let ee = typeof e.minProperties == `number` ? e.minProperties : void 0;
			let c = typeof e.maxProperties == `number` ? e.maxProperties : void 0;
			if (s || ee !== void 0 || c !== void 0) {
				let n;
				s && (n = $$1(typeof e.propertyNames == `object` && e.propertyNames.type === void 0 ? {
					type: `string`,
					...e.propertyNames
				} : e.propertyNames, t)), r = uc(r, {
					keySchema: n,
					minProperties: ee,
					maxProperties: c
				});
			}
			break;
		}
		case `array`: {
			let n = e.prefixItems;
			let i = e.items;
			if (n && Array.isArray(n)) {
				let a = typeof e.minItems == `number` ? e.minItems : 0;
				let o = sc(n.map((e) => $$1(e, t)), a);
				let s = Array.isArray(i) ? void 0 : _c(i, t);
				let ee = Q$1.tuple(o);
				r = s ? ee.rest(s) : ee, typeof e.minItems == `number` && (r = r.check(Q$1.minLength(e.minItems))), typeof e.maxItems == `number` && (r = r.check(Q$1.maxLength(e.maxItems)));
			} else if (Array.isArray(i)) {
				let n = typeof e.minItems == `number` ? e.minItems : 0;
				let a = sc(i.map((e) => $$1(e, t)), n);
				let o = _c(e.additionalItems, t);
				let s = Q$1.tuple(a);
				r = o ? s.rest(o) : s, typeof e.minItems == `number` && (r = r.check(Q$1.minLength(e.minItems))), typeof e.maxItems == `number` && (r = r.check(Q$1.maxLength(e.maxItems)));
			} else if (i !== void 0) {
				let n = $$1(i, t);
				let a = Q$1.array(n);
				typeof e.minItems == `number` && (a = a.min(e.minItems)), typeof e.maxItems == `number` && (a = a.max(e.maxItems)), r = a;
			} else r = Q$1.array(Q$1.any());
			(e.uniqueItems === !0 || e.contains !== void 0) && (r = gc(r, {
				uniqueItems: e.uniqueItems === !0,
				containsSchema: e.contains === void 0 ? void 0 : $$1(e.contains, t),
				minContains: typeof e.minContains == `number` ? e.minContains : void 0,
				maxContains: typeof e.maxContains == `number` ? e.maxContains : void 0
			}));
			break;
		}
		default: throw Error(`Unsupported type: ${n}`);
	}
	return r;
}
function $$1(e, t) {
	if (typeof e == `boolean`) return e ? Q$1.any() : Q$1.never();
	let n = yc(e, t);
	let r = e.type || e.enum !== void 0 || e.const !== void 0;
	if (e.anyOf && Array.isArray(e.anyOf)) {
		let i = e.anyOf.map((e) => $$1(e, t));
		let a = Q$1.union(i);
		n = r ? Q$1.intersection(n, a) : a;
	}
	if (e.oneOf && Array.isArray(e.oneOf)) {
		let i = e.oneOf.map((e) => $$1(e, t));
		let a = Q$1.xor(i);
		n = r ? Q$1.intersection(n, a) : a;
	}
	if (e.allOf && Array.isArray(e.allOf)) {
		if (e.allOf.length === 0) n = r ? n : Q$1.any();
		else {
			let i = r ? n : $$1(e.allOf[0], t);
			let a = +!r;
			for (let n = a; n < e.allOf.length; n++) i = Q$1.intersection(i, $$1(e.allOf[n], t));
			n = i;
		}
	}
	e.nullable === !0 && t.version === `openapi-3.0` && (n = Q$1.nullable(n)), e.readOnly === !0 && (n = Q$1.readonly(n)), e.default !== void 0 && (n = n.default(e.default));
	let i = {};
	for (let t of [
		`$id`,
		`id`,
		`$comment`,
		`$anchor`,
		`$vocabulary`,
		`$dynamicRef`,
		`$dynamicAnchor`
	]) t in e && (i[t] = e[t]);
	for (let t of [
		`contentEncoding`,
		`contentMediaType`,
		`contentSchema`
	]) t in e && (i[t] = e[t]);
	if (e.type === `object` && e.$ref === void 0) {
		e.propertyNames !== void 0 && !mc(e.propertyNames) && (i.propertyNames = e.propertyNames);
		for (let t of [`minProperties`, `maxProperties`]) e[t] !== void 0 && (i[t] = e[t]);
	}
	if (e.type === `array` && e.$ref === void 0) {
		e.contains !== void 0 && !mc(e.contains) && (i.contains = e.contains);
		for (let t of [
			`uniqueItems`,
			`minContains`,
			`maxContains`
		]) e[t] !== void 0 && (i[t] = e[t]);
	}
	for (let t of Object.keys(e)) ac.has(t) || g$1(i, t, e[t]);
	return Object.keys(i).length > 0 && t.registry.add(n, i), e.description && (n = n.describe(e.description)), n;
}
function bc(e, t) {
	if (typeof e == `boolean`) return e ? Q$1.any() : Q$1.never();
	let n;
	try {
		n = JSON.parse(JSON.stringify(e));
	} catch {
		throw Error(`fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas`);
	}
	let r = {
		version: oc(n, t?.defaultTarget),
		defs: n.$defs || n.definitions || {},
		refs: new Map(),
		processing: new Set(),
		rootSchema: n,
		registry: t?.registry ?? P$2
	};
	return $$1(n, r);
}
function Sc(e, t) {
	let n = typeof t == `function` ? t : (e, n) => {
		let r = t[e._zod.def.type];
		return r ? r(e, n) : e;
	};
	let r = new Map();
	function i(e) {
		let t = r.get(e);
		if (t === xc) return new Sa$1({
			type: `lazy`,
			getter: () => r.get(e)
		});
		if (t !== void 0) return t;
		r.set(e, xc);
		let i = a(e);
		let o = n(i, i !== e);
		return r.set(e, o), o;
	}
	function a(e) {
		let t = e._zod.def;
		switch (t.type) {
			case `object`: {
				let n = t.shape;
				let r = Object.keys(n);
				let a = !1;
				let o = {};
				for (let e of r) {
					let t = i(n[e]);
					t !== n[e] && (a = !0), o[e] = t;
				}
				let s = t.catchall;
				return t.catchall && (s = i(t.catchall), s !== t.catchall && (a = !0)), a ? k$2(e, {
					...t,
					shape: o,
					catchall: s
				}) : e;
			}
			case `array`: {
				let n = i(t.element);
				return n === t.element ? e : k$2(e, {
					...t,
					element: n
				});
			}
			case `tuple`: {
				let n = t.items;
				let r = !1;
				let a = [];
				for (let e of n) {
					let t = i(e);
					t !== e && (r = !0), a.push(t);
				}
				let o = t.rest;
				return t.rest && (o = i(t.rest), o !== t.rest && (r = !0)), r ? k$2(e, {
					...t,
					items: a,
					rest: o
				}) : e;
			}
			case `record`:
			case `map`: {
				let n = i(t.keyType);
				let r = i(t.valueType);
				return n === t.keyType && r === t.valueType ? e : k$2(e, {
					...t,
					keyType: n,
					valueType: r
				});
			}
			case `set`: {
				let n = i(t.valueType);
				return n === t.valueType ? e : k$2(e, {
					...t,
					valueType: n
				});
			}
			case `union`: {
				let n = t.options;
				let r = !1;
				let a = [];
				for (let e of n) {
					let t = i(e);
					t !== e && (r = !0), a.push(t);
				}
				return r ? k$2(e, {
					...t,
					options: a
				}) : e;
			}
			case `intersection`: {
				let n = i(t.left);
				let r = i(t.right);
				return n === t.left && r === t.right ? e : k$2(e, {
					...t,
					left: n,
					right: r
				});
			}
			case `optional`:
			case `nullable`:
			case `default`:
			case `prefault`:
			case `catch`:
			case `readonly`:
			case `nonoptional`:
			case `promise`:
			case `success`: {
				let n = i(t.innerType);
				return n === t.innerType ? e : k$2(e, {
					...t,
					innerType: n
				});
			}
			case `pipe`: {
				let n = i(t.in);
				let r = i(t.out);
				return n === t.in && r === t.out ? e : k$2(e, {
					...t,
					in: n,
					out: r
				});
			}
			case `function`: {
				let n = i(t.input);
				let r = i(t.output);
				return n === t.input && r === t.output ? e : k$2(e, {
					...t,
					input: n,
					output: r
				});
			}
			case `lazy`: {
				let n = t.getter;
				let { _cachedInner: r, ...a } = t;
				return k$2(e, {
					...a,
					getter: () => i(n())
				});
			}
			case `template_literal`:
			case `string`:
			case `number`:
			case `int`:
			case `boolean`:
			case `bigint`:
			case `symbol`:
			case `undefined`:
			case `null`:
			case `void`:
			case `never`:
			case `any`:
			case `unknown`:
			case `date`:
			case `nan`:
			case `enum`:
			case `literal`:
			case `file`:
			case `transform`:
			case `custom`: return e;
			default: return e;
		}
	}
	return i(e);
}
function Cc(e) {
	return Sc(e, {
		object: (e) => e.partial(),
		union: (e) => {
			let t = e._zod.def;
			return t.discriminator === void 0 ? e : H$2(t.options);
		}
	});
}
function wc(e, t) {
	if (!t?.length) return e;
	let n = e._zod.def;
	return k$2(e, b$2(n, { checks: [...n.checks ?? [], ...t] }), { parent: !0 });
}
function Tc(e) {
	return wc(e.out, e.checks);
}
function Ec(e) {
	return e.in._zod.traits.has(`$ZodTransform`) ? Tc(e) : e.in;
}
function Dc(e) {
	return Sc(e, {
		pipe: (e) => Ec(e._zod.def),
		default: (e, t) => t ? K$1(e._zod.def.innerType) : e,
		catch: (e, t) => t ? e._zod.def.innerType : e
	});
}
function Oc(e) {
	return Sc(e, {
		pipe: (e) => Tc(e._zod.def),
		prefault: (e, t) => t ? e._zod.def.innerType : e
	});
}
function Ac(e) {
	return jl(T$1, e);
}
function jc(e) {
	return lu(P$1, e);
}
function Mc(e) {
	return gu(I$1, e);
}
function Nc(e) {
	return vu(L$1, e);
}
function Pc(e) {
	return ku(Po, e);
}
var Gi, Ki, Ji, Yi, S$1, Xi, Zi, Qi, $i, ea, ta, na, ra, ia, aa, oa, sa, ca, w$1, ua, T$1, D$1, O$2, k$1, A$1, j$1, da, pa, M$1, ya, Sa, wa, Ea, Oa, Aa, Ma, Pa, Ia, Ra, Ba, Ha, Wa, Ka, Ja, Xa, Qa, eo, no, N$1, P$1, F$1, I$1, L$1, vo, xo, Co, To, Do, ko, Ao, Mo, Po, Io, B$1, V$2, Vo, Uo, Go, qo, U$1, Qo, es, W$1, is, os, cs, G$1, us, fs, ms, gs, vs, bs, Ss, ws, J$1, Y$1, ks, As, Ms, Ps, Is, Rs, Z$1, Us, Ws, Gs, qs, Xs, $s, ec, Q$1, ac, fc, pc, vc, xc, kc, Fc;
var init_zod = __esmMin((() => {
	init_rolldown_runtime_CwAJHxZ7();
	init_core_BJ5ituCR();
	init_en_CuIUlj_w();
	Gi = t$2({
		endsWith: () => Zu,
		gt: () => Nu,
		gte: () => Pu,
		includes: () => Yu,
		length: () => Gu,
		lowercase: () => qu,
		lt: () => ju,
		lte: () => Mu,
		maxLength: () => Uu,
		maxSize: () => Bu,
		mime: () => ed,
		minLength: () => Wu,
		minSize: () => Vu,
		multipleOf: () => zu,
		negative: () => Iu,
		nonnegative: () => Ru,
		nonpositive: () => Lu,
		normalize: () => td,
		overwrite: () => K$2,
		positive: () => Fu,
		properties: () => $u,
		property: () => Qu,
		regex: () => Ku,
		size: () => Hu,
		slugify: () => ad,
		startsWith: () => Xu,
		toLowerCase: () => rd,
		toUpperCase: () => id,
		trim: () => nd,
		uppercase: () => Ju
	});
	Ki = new WeakSet([Object.prototype, Error.prototype]);
	Ji = (e, t) => {
		Oe$1.init(e, t), e.name = `ZodError`;
		let n = Object.getPrototypeOf(e);
		Ki.has(n) || (Ki.add(n), qi(n, `format`, (e) => (t) => je$1(e, t)), qi(n, `flatten`, (e) => (t) => Ae$1(e, t)), qi(n, `addIssue`, (e) => (t) => {
			e.issues.push(t), e.message = JSON.stringify(e.issues, u$2, 2);
		}), qi(n, `addIssues`, (e) => (t) => {
			e.issues.push(...t), e.message = JSON.stringify(e.issues, u$2, 2);
		}), Object.defineProperty(n, "isEmpty", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this.issues.length === 0;
			}
		}));
	};
	Yi = Ge$2(`ZodError`, Ji);
	S$1 = Ge$2(`ZodError`, Ji, void 0, { Parent: Error });
	Xi = Ie$1(S$1);
	Zi = Re$1(S$1);
	Qi = Be$1(S$1);
	$i = Ue$1(S$1);
	ea = Xe$1(S$1);
	ta = Qe$1(S$1);
	na = et$1(S$1);
	ra = nt$1(S$1);
	ia = it$1(S$1);
	aa = ot$1(S$1);
	oa = ct$1(S$1);
	sa = ut$1(S$1);
	ca = t$2({
		ZodAny: () => Do,
		ZodArray: () => Io,
		ZodBase64: () => Ka,
		ZodBase64URL: () => Ja,
		ZodBigInt: () => L$1,
		ZodBigIntFormat: () => vo,
		ZodBoolean: () => I$1,
		ZodCIDRv4: () => Ha,
		ZodCIDRv6: () => Wa,
		ZodCUID: () => Ea,
		ZodCUID2: () => Oa,
		ZodCatch: () => Ss,
		ZodCodec: () => Y$1,
		ZodCreditCard: () => Qa,
		ZodCustom: () => Z$1,
		ZodCustomStringFormat: () => N$1,
		ZodDate: () => Po,
		ZodDefault: () => ms,
		ZodDiscriminatedUnion: () => Uo,
		ZodE164: () => Xa,
		ZodEmail: () => da,
		ZodEmoji: () => Sa,
		ZodEnum: () => W$1,
		ZodExactOptional: () => us,
		ZodFile: () => os,
		ZodFunction: () => Rs,
		ZodGUID: () => pa,
		ZodIBAN: () => eo,
		ZodIPv4: () => Ia,
		ZodIPv6: () => Ba,
		ZodISODate: () => k$1,
		ZodISODateTime: () => O$2,
		ZodISODuration: () => j$1,
		ZodISOTime: () => A$1,
		ZodInstanceOf: () => Gs,
		ZodIntersection: () => Go,
		ZodJWT: () => no,
		ZodKSUID: () => Pa,
		ZodLazy: () => Ps,
		ZodLiteral: () => is,
		ZodMAC: () => Ra,
		ZodMap: () => Qo,
		ZodNaN: () => ws,
		ZodNanoID: () => wa,
		ZodNever: () => Ao,
		ZodNonOptional: () => vs,
		ZodNull: () => To,
		ZodNullable: () => fs,
		ZodNumber: () => P$1,
		ZodNumberFormat: () => F$1,
		ZodObject: () => B$1,
		ZodOptional: () => G$1,
		ZodPipe: () => J$1,
		ZodPrefault: () => gs,
		ZodPreprocess: () => ks,
		ZodPromise: () => Is,
		ZodReadonly: () => As,
		ZodRecord: () => U$1,
		ZodSet: () => es,
		ZodString: () => T$1,
		ZodStringFormat: () => D$1,
		ZodSuccess: () => bs,
		ZodSymbol: () => xo,
		ZodTemplateLiteral: () => Ms,
		ZodTransform: () => cs,
		ZodTuple: () => qo,
		ZodType: () => w$1,
		ZodULID: () => Aa,
		ZodURL: () => ya,
		ZodUUID: () => M$1,
		ZodUndefined: () => Co,
		ZodUnion: () => V$2,
		ZodUnknown: () => ko,
		ZodVoid: () => Mo,
		ZodXID: () => Ma,
		ZodXor: () => Vo,
		_ZodString: () => ua,
		_default: () => hs,
		_function: () => X$2,
		any: () => Oo,
		array: () => z$2,
		base64: () => qa,
		base64url: () => Ya,
		bigint: () => _o,
		boolean: () => go,
		catch: () => Cs,
		check: () => zs,
		cidrv4: () => Ua,
		cidrv6: () => Ga,
		codec: () => Ds,
		creditCard: () => $a,
		cuid: () => Da,
		cuid2: () => ka,
		currencyCode: () => so,
		custom: () => Bs,
		date: () => Fo,
		describe: () => Us,
		discriminatedUnion: () => Wo,
		e164: () => Za,
		email: () => fa,
		emoji: () => Ca,
		enum: () => ns,
		exactOptional: () => ds,
		file: () => ss,
		float32: () => fo,
		float64: () => po,
		function: () => X$2,
		guid: () => ma,
		hash: () => co,
		hex: () => oo,
		hostname: () => ao,
		httpUrl: () => xa,
		iban: () => to,
		instanceof: () => Ks,
		int: () => uo,
		int32: () => mo,
		int64: () => yo,
		intersection: () => Ko,
		invertCodec: () => Os,
		ipv4: () => La,
		ipv6: () => Va,
		json: () => Js,
		jwt: () => ro,
		keyof: () => Lo,
		ksuid: () => Fa,
		lazy: () => Fs,
		literal: () => as,
		looseObject: () => Bo,
		looseRecord: () => Zo,
		mac: () => za,
		map: () => $o,
		meta: () => Ws,
		nan: () => Ts,
		nanoid: () => Ta,
		nativeEnum: () => rs,
		never: () => jo,
		nonoptional: () => ys,
		null: () => Eo,
		nullable: () => q$1,
		nullish: () => ps,
		number: () => lo,
		object: () => Ro,
		optional: () => K$1,
		partialRecord: () => Xo,
		pipe: () => Es,
		prefault: () => _s,
		preprocess: () => Ys,
		promise: () => Ls,
		readonly: () => js,
		record: () => Yo,
		refine: () => Vs,
		set: () => ts,
		strictObject: () => zo,
		string: () => E$1,
		stringFormat: () => io,
		stringbool: () => qs,
		success: () => xs,
		superRefine: () => Hs,
		symbol: () => So,
		templateLiteral: () => Ns,
		transform: () => ls,
		tuple: () => Jo,
		uint32: () => ho,
		uint64: () => bo,
		ulid: () => ja,
		undefined: () => wo,
		union: () => H$2,
		unknown: () => R$2,
		url: () => ba,
		uuid: () => ha,
		uuidv4: () => ga,
		uuidv6: () => _a,
		uuidv7: () => va,
		void: () => No,
		xid: () => Na,
		xor: () => Ho
	});
	w$1 = Ge$2(`ZodType`, (e, t) => (la(), M$2.init(e, t), e.def = t, e.type = t.type, e), {
		check(...e) {
			let t = this.def;
			return this.clone(b$2(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == `function` ? { _zod: {
				check: e,
				def: { check: `custom` },
				onattach: []
			} } : e)] }), { parent: !0 });
		},
		with(...e) {
			return this.check(...e);
		},
		clone(e, t) {
			return k$2(this, e, t);
		},
		brand() {
			return this;
		},
		register(e, t) {
			return e.add(this, t), this;
		},
		refine(e, t) {
			return this.check(Vs(e, t));
		},
		superRefine(e, t) {
			return this.check(Hs(e, t));
		},
		overwrite(e) {
			return this.check(K$2(e));
		},
		optional() {
			return K$1(this);
		},
		exactOptional() {
			return ds(this);
		},
		nullable() {
			return q$1(this);
		},
		nullish() {
			return K$1(q$1(this));
		},
		nonoptional(e) {
			return ys(this, e);
		},
		array() {
			return z$2(this);
		},
		or(e) {
			return H$2([this, e]);
		},
		and(e) {
			return Ko(this, e);
		},
		transform(e) {
			return Es(this, ls(e));
		},
		default(e) {
			return hs(this, e);
		},
		prefault(e) {
			return _s(this, e);
		},
		catch(e) {
			return Cs(this, e);
		},
		pipe(e) {
			return Es(this, e);
		},
		readonly() {
			return js(this);
		},
		describe(e) {
			let t = this.clone();
			return P$2.add(t, { description: e }), t;
		},
		meta(...e) {
			if (e.length === 0) return P$2.get(this);
			let t = this.clone();
			return P$2.add(t, e[0]), t;
		},
		isOptional() {
			return this.safeParse(void 0).success;
		},
		isNullable() {
			return this.safeParse(null).success;
		},
		apply(e, ...t) {
			return t.length === 0 ? e(this) : e(this, ...t);
		},
		get "~standard"() {
			return Ne$2(this, `~standard`, {
				...ar(this),
				jsonSchema: {
					input: Jd(this, `input`),
					output: Jd(this, `output`)
				}
			});
		},
		set "~standard"(e) {
			J$3(this, `~standard`, e);
		},
		parse: function e(t, n) {
			return Xi(this, t, n, { callee: e });
		},
		parseAsync: async function e(t, n) {
			return await Zi(this, t, n, { callee: e });
		},
		safeParse(e, t) {
			return Qi(this, e, t);
		},
		async safeParseAsync(e, t) {
			return $i(this, e, t);
		},
		get spa() {
			return this?.safeParseAsync;
		},
		set spa(e) {
			J$3(this, `spa`, e);
		},
		validate(e, t) {
			return qe$1(this, e, t);
		},
		validateAsync(e, t) {
			return Ye$1(this, e, t);
		},
		encode: function e(t, n) {
			return ea(this, t, n, { callee: e });
		},
		decode: function e(t, n) {
			return ta(this, t, n, { callee: e });
		},
		encodeAsync: async function e(t, n) {
			return await na(this, t, n, { callee: e });
		},
		decodeAsync: async function e(t, n) {
			return await ra(this, t, n, { callee: e });
		},
		safeEncode(e, t) {
			return ia(this, e, t);
		},
		safeDecode(e, t) {
			return aa(this, e, t);
		},
		async safeEncodeAsync(e, t) {
			return oa(this, e, t);
		},
		async safeDecodeAsync(e, t) {
			return sa(this, e, t);
		},
		toJSONSchema(e) {
			return qd(this, {})(e);
		},
		get description() {
			return P$2.get(this)?.description;
		},
		get _def() {
			return this._zod.def;
		}
	});
	ua = Ge$2(`_ZodString`, (e, t) => {
		or.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => uf(e, t, n, r);
	}, Pe$2({
		format: (e) => $$2(e).format ?? null,
		minLength: (e) => $$2(e).minimum ?? null,
		maxLength: (e) => $$2(e).maximum ?? null
	}, {
		regex(...e) {
			return this.check(Ku(...e));
		},
		includes(...e) {
			return this.check(Yu(...e));
		},
		startsWith(...e) {
			return this.check(Xu(...e));
		},
		endsWith(...e) {
			return this.check(Zu(...e));
		},
		min(...e) {
			return this.check(Wu(...e));
		},
		max(...e) {
			return this.check(Uu(...e));
		},
		length(...e) {
			return this.check(Gu(...e));
		},
		nonempty(...e) {
			return this.check(Wu(1, ...e));
		},
		lowercase(e) {
			return this.check(qu(e));
		},
		uppercase(e) {
			return this.check(Ju(e));
		},
		trim() {
			return this.check(nd());
		},
		normalize(...e) {
			return this.check(td(...e));
		},
		toLowerCase() {
			return this.check(rd());
		},
		toUpperCase() {
			return this.check(id());
		},
		slugify() {
			return this.check(ad());
		}
	}));
	T$1 = Ge$2(`ZodString`, (e, t) => {
		or.init(e, t), ua.init(e, t);
	}, {
		email(e) {
			return this.check(Ml(da, e));
		},
		url(e) {
			return this.check(Rl(ya, e));
		},
		jwt(e) {
			return this.check(nu(no, e));
		},
		emoji(e) {
			return this.check(zl(Sa, e));
		},
		guid(e) {
			return this.check(Nl(pa, e));
		},
		uuid(e) {
			return this.check(Pl(M$1, e));
		},
		uuidv4(e) {
			return this.check(Fl(M$1, e));
		},
		uuidv6(e) {
			return this.check(Il(M$1, e));
		},
		uuidv7(e) {
			return this.check(Ll(M$1, e));
		},
		nanoid(e) {
			return this.check(Bl(wa, e));
		},
		cuid(e) {
			return this.check(Vl(Ea, e));
		},
		cuid2(e) {
			return this.check(Hl(Oa, e));
		},
		ulid(e) {
			return this.check(Ul(Aa, e));
		},
		base64(e) {
			return this.check(Zl(Ka, e));
		},
		base64url(e) {
			return this.check(Ql(Ja, e));
		},
		xid(e) {
			return this.check(Wl(Ma, e));
		},
		ksuid(e) {
			return this.check(Gl(Pa, e));
		},
		ipv4(e) {
			return this.check(Kl(Ia, e));
		},
		ipv6(e) {
			return this.check(ql(Ba, e));
		},
		cidrv4(e) {
			return this.check(Yl(Ha, e));
		},
		cidrv6(e) {
			return this.check(Xl(Wa, e));
		},
		e164(e) {
			return this.check($l(Xa, e));
		},
		datetime(e) {
			return this.check(iu(O$2, e));
		},
		date(e) {
			return this.check(au(k$1, e));
		},
		time(e) {
			return this.check(ou(A$1, e));
		},
		duration(e) {
			return this.check(su(j$1, e));
		}
	});
	D$1 = Ge$2(`ZodStringFormat`, (e, t) => {
		N$2.init(e, t), ua.init(e, t);
	});
	O$2 = Ge$2(`ZodISODateTime`, (e, t) => {
		Dr.init(e, t), D$1.init(e, t);
	});
	k$1 = Ge$2(`ZodISODate`, (e, t) => {
		Or.init(e, t), D$1.init(e, t);
	});
	A$1 = Ge$2(`ZodISOTime`, (e, t) => {
		kr.init(e, t), D$1.init(e, t);
	});
	j$1 = Ge$2(`ZodISODuration`, (e, t) => {
		Ar.init(e, t), D$1.init(e, t);
	});
	da = Ge$2(`ZodEmail`, (e, t) => {
		lr.init(e, t), D$1.init(e, t);
	});
	pa = Ge$2(`ZodGUID`, (e, t) => {
		sr.init(e, t), D$1.init(e, t);
	});
	M$1 = Ge$2(`ZodUUID`, (e, t) => {
		cr.init(e, t), D$1.init(e, t);
	});
	ya = Ge$2(`ZodURL`, (e, t) => {
		yr.init(e, t), D$1.init(e, t);
	});
	Sa = Ge$2(`ZodEmoji`, (e, t) => {
		br.init(e, t), D$1.init(e, t);
	});
	wa = Ge$2(`ZodNanoID`, (e, t) => {
		xr.init(e, t), D$1.init(e, t);
	});
	Ea = Ge$2(`ZodCUID`, (e, t) => {
		Sr.init(e, t), D$1.init(e, t);
	});
	Oa = Ge$2(`ZodCUID2`, (e, t) => {
		Cr.init(e, t), D$1.init(e, t);
	});
	Aa = Ge$2(`ZodULID`, (e, t) => {
		wr.init(e, t), D$1.init(e, t);
	});
	Ma = Ge$2(`ZodXID`, (e, t) => {
		Tr.init(e, t), D$1.init(e, t);
	});
	Pa = Ge$2(`ZodKSUID`, (e, t) => {
		Er.init(e, t), D$1.init(e, t);
	});
	Ia = Ge$2(`ZodIPv4`, (e, t) => {
		jr.init(e, t), D$1.init(e, t);
	});
	Ra = Ge$2(`ZodMAC`, (e, t) => {
		Fr.init(e, t), D$1.init(e, t);
	});
	Ba = Ge$2(`ZodIPv6`, (e, t) => {
		Pr.init(e, t), D$1.init(e, t);
	});
	Ha = Ge$2(`ZodCIDRv4`, (e, t) => {
		Ir.init(e, t), D$1.init(e, t);
	});
	Wa = Ge$2(`ZodCIDRv6`, (e, t) => {
		Rr.init(e, t), D$1.init(e, t);
	});
	Ka = Ge$2(`ZodBase64`, (e, t) => {
		Vr.init(e, t), D$1.init(e, t);
	});
	Ja = Ge$2(`ZodBase64URL`, (e, t) => {
		Wr.init(e, t), D$1.init(e, t);
	});
	Xa = Ge$2(`ZodE164`, (e, t) => {
		Gr.init(e, t), D$1.init(e, t);
	});
	Qa = Ge$2(`ZodCreditCard`, (e, t) => {
		Yr.init(e, t), D$1.init(e, t);
	});
	eo = Ge$2(`ZodIBAN`, (e, t) => {
		Qr.init(e, t), D$1.init(e, t);
	});
	no = Ge$2(`ZodJWT`, (e, t) => {
		ei.init(e, t), D$1.init(e, t);
	});
	N$1 = Ge$2(`ZodCustomStringFormat`, (e, t) => {
		ti.init(e, t), D$1.init(e, t);
	});
	P$1 = Ge$2(`ZodNumber`, (e, t) => {
		ni.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => df(e, t, n, r), e.isFinite = !0;
	}, Pe$2({
		minValue: (e) => {
			let { minimum: t, exclusiveMinimum: n } = $$2(e);
			return Math.max(t ?? -1 / 0, n ?? -1 / 0);
		},
		maxValue: (e) => {
			let { maximum: t, exclusiveMaximum: n } = $$2(e);
			return Math.min(t ?? 1 / 0, n ?? 1 / 0);
		},
		isInt: (e) => {
			let { isInt: t, multipleOf: n } = $$2(e);
			return !!t || !!n?.some(Number.isSafeInteger);
		},
		format: (e) => $$2(e).format ?? null
	}, {
		gt(e, t) {
			return this.check(Nu(e, t));
		},
		gte(e, t) {
			return this.check(Pu(e, t));
		},
		min(e, t) {
			return this.check(Pu(e, t));
		},
		lt(e, t) {
			return this.check(ju(e, t));
		},
		lte(e, t) {
			return this.check(Mu(e, t));
		},
		max(e, t) {
			return this.check(Mu(e, t));
		},
		int(e) {
			return this.check(uo(e));
		},
		safe(e) {
			return this.check(uo(e));
		},
		positive(e) {
			return this.check(Nu(0, e));
		},
		nonnegative(e) {
			return this.check(Pu(0, e));
		},
		negative(e) {
			return this.check(ju(0, e));
		},
		nonpositive(e) {
			return this.check(Mu(0, e));
		},
		multipleOf(e, t) {
			return this.check(zu(e, t));
		},
		step(e, t) {
			return this.check(zu(e, t));
		},
		finite() {
			return this;
		}
	}));
	F$1 = Ge$2(`ZodNumberFormat`, (e, t) => {
		ri.init(e, t), P$1.init(e, t);
	});
	I$1 = Ge$2(`ZodBoolean`, (e, t) => {
		ii.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => ff(e, t, n, r);
	});
	L$1 = Ge$2(`ZodBigInt`, (e, t) => {
		ai.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => pf(e, t, n, r);
	}, Pe$2({
		minValue: (e) => $$2(e).minimum ?? null,
		maxValue: (e) => $$2(e).maximum ?? null,
		format: (e) => $$2(e).format ?? null
	}, {
		gte(e, t) {
			return this.check(Pu(e, t));
		},
		min(e, t) {
			return this.check(Pu(e, t));
		},
		gt(e, t) {
			return this.check(Nu(e, t));
		},
		lt(e, t) {
			return this.check(ju(e, t));
		},
		lte(e, t) {
			return this.check(Mu(e, t));
		},
		max(e, t) {
			return this.check(Mu(e, t));
		},
		positive(e) {
			return this.check(Nu(BigInt(0), e));
		},
		negative(e) {
			return this.check(ju(BigInt(0), e));
		},
		nonpositive(e) {
			return this.check(Mu(BigInt(0), e));
		},
		nonnegative(e) {
			return this.check(Pu(BigInt(0), e));
		},
		multipleOf(e, t) {
			return this.check(zu(e, t));
		}
	}));
	vo = Ge$2(`ZodBigIntFormat`, (e, t) => {
		oi.init(e, t), L$1.init(e, t);
	});
	xo = Ge$2(`ZodSymbol`, (e, t) => {
		si.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => mf(e, t, n, r);
	});
	Co = Ge$2(`ZodUndefined`, (e, t) => {
		ci.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => gf(e, t, n, r);
	});
	To = Ge$2(`ZodNull`, (e, t) => {
		li.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => hf(e, t, n, r);
	});
	Do = Ge$2(`ZodAny`, (e, t) => {
		ui.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => yf(e, t, n, r);
	});
	ko = Ge$2(`ZodUnknown`, (e, t) => {
		di.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => bf(e, t, n, r);
	});
	Ao = Ge$2(`ZodNever`, (e, t) => {
		fi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => vf(e, t, n, r);
	});
	Mo = Ge$2(`ZodVoid`, (e, t) => {
		pi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => _f(e, t, n, r);
	});
	Po = Ge$2(`ZodDate`, (e, t) => {
		mi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => xf(e, t, n, r), e.min = (t, n) => e.check(Pu(t, n)), e.max = (t, n) => e.check(Mu(t, n));
	}, Pe$2({
		minDate: (e) => {
			let { minimum: t } = $$2(e);
			return t ? new Date(t) : null;
		},
		maxDate: (e) => {
			let { maximum: t } = $$2(e);
			return t ? new Date(t) : null;
		}
	}, {}));
	Io = Ge$2(`ZodArray`, (e, t) => {
		C$1(), bi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Nf(e, t, n, r), e.element = t.element;
	}, {
		min(e, t) {
			return this.check(Wu(e, t));
		},
		nonempty(e) {
			return this.check(Wu(1, e));
		},
		max(e, t) {
			return this.check(Uu(e, t));
		},
		length(e, t) {
			return this.check(Gu(e, t));
		},
		unwrap() {
			return this.element;
		}
	});
	B$1 = Ge$2(`ZodObject`, (e, t) => {
		C$1(), Ei.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ff(e, t, n, r), ze$2(e, `shape`, (e) => e._zod.def.shape, !1);
	}, {
		keyof() {
			return ns(Object.keys(this._zod.def.shape));
		},
		catchall(e) {
			return this.clone(b$2(this._zod.def, { catchall: e }));
		},
		passthrough() {
			return this.clone(b$2(this._zod.def, { catchall: R$2() }));
		},
		loose() {
			return this.clone(b$2(this._zod.def, { catchall: R$2() }));
		},
		strict() {
			return this.clone(b$2(this._zod.def, { catchall: jo() }));
		},
		strip() {
			return this.clone(b$2(this._zod.def, { catchall: void 0 }));
		},
		extend(e) {
			return R$4(this, e);
		},
		safeExtend(e) {
			return B$3(this, e);
		},
		merge(e) {
			return V$4(this, e);
		},
		pick(e) {
			return F$3(this, e);
		},
		omit(e) {
			return L$3(this, e);
		},
		partial(...e) {
			return H$4(G$1, this, e[0]);
		},
		exactPartial(...e) {
			return H$4(us, this, e[0], `exactPartial`);
		},
		required(...e) {
			return U$3(vs, this, e[0]);
		}
	});
	V$2 = Ge$2(`ZodUnion`, (e, t) => {
		Oi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => If(e, t, n, r), e.options = t.options;
	});
	Vo = Ge$2(`ZodXor`, (e, t) => {
		V$2.init(e, t), Ai.init(e, t), e._zod.processJSONSchema = (t, n, r) => If(e, t, n, r), e.options = t.options;
	});
	Uo = Ge$2(`ZodDiscriminatedUnion`, (e, t) => {
		V$2.init(e, t), Ni.init(e, t);
	});
	Go = Ge$2(`ZodIntersection`, (e, t) => {
		Pi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Lf(e, t, n, r);
	});
	qo = Ge$2(`ZodTuple`, (e, t) => {
		C$1(), Li.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Rf(e, t, n, r);
	}, {
		rest(e) {
			return this.clone({
				...this._zod.def,
				rest: e
			});
		},
		partial() {
			let e = this._zod.def;
			if (e.checks?.length) throw Error(`.partial() cannot be used on tuple schemas containing refinements`);
			return this.clone({
				...e,
				items: e.items.map((e) => new G$1({
					type: `optional`,
					innerType: e
				}))
			});
		}
	});
	U$1 = Ge$2(`ZodRecord`, (e, t) => {
		C$1(), Vi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Hf(e, t, n, r), e.keyType = t.keyType, e.valueType = t.valueType;
	});
	Qo = Ge$2(`ZodMap`, (e, t) => {
		C$1(), Hi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => jf(e, t, n, r), e.keyType = t.keyType, e.valueType = t.valueType, e.min = (...t) => e.check(Vu(...t)), e.nonempty = (t) => e.check(Vu(1, t)), e.max = (...t) => e.check(Bu(...t)), e.size = (...t) => e.check(Hu(...t));
	});
	es = Ge$2(`ZodSet`, (e, t) => {
		C$1(), Wi.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Mf(e, t, n, r), e.min = (...t) => e.check(Vu(...t)), e.nonempty = (t) => e.check(Vu(1, t)), e.max = (...t) => e.check(Bu(...t)), e.size = (...t) => e.check(Hu(...t));
	});
	W$1 = Ge$2(`ZodEnum`, (e, t) => {
		Ki$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Sf(e, t, n, r), e.enum = t.entries, e.options = [...e._zod.values];
		let n = new Set(Object.keys(t.entries));
		e.extract = (e, r) => {
			let i = {};
			for (let r of e) if (n.has(r)) i[r] = t.entries[r];
			else throw Error(`Key ${r} not found in enum`);
			return new W$1({
				...t,
				checks: [],
				...A$3(r),
				entries: i
			});
		}, e.exclude = (e, r) => {
			let i = { ...t.entries };
			for (let t of e) if (n.has(t)) delete i[t];
			else throw Error(`Key ${t} not found in enum`);
			return new W$1({
				...t,
				checks: [],
				...A$3(r),
				entries: i
			});
		};
	});
	is = Ge$2(`ZodLiteral`, (e, t) => {
		qi$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Cf(e, t, n, r), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
			if (t.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
			return t.values[0];
		} });
	});
	os = Ge$2(`ZodFile`, (e, t) => {
		Ji$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ef(e, t, n, r), e.min = (t, n) => e.check(Vu(t, n)), e.max = (t, n) => e.check(Bu(t, n)), e.mime = (t, n) => e.check(ed(Array.isArray(t) ? t : [t], n));
	});
	cs = Ge$2(`ZodTransform`, (e, t) => {
		C$1(), Yi$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Af(e, t, n, r), e._zod.parse = (n, r) => {
			if (r.direction === `backward`) throw new Je$2(e.constructor.name);
			n.addIssue = (r) => {
				if (typeof r == `string`) n.issues.push(Ce$2(r, n.value, t));
				else {
					let t = r;
					t.fatal && (t.continue = !1), t.code ??= `custom`, `input` in t || (t.input = n.value), t.inst ??= e, n.issues.push(Ce$2(t));
				}
			};
			let i = t.transform(n.value, n);
			return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
		};
	});
	G$1 = Ge$2(`ZodOptional`, (e, t) => {
		Zi$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => $f(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	us = Ge$2(`ZodExactOptional`, (e, t) => {
		Qi$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => $f(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	fs = Ge$2(`ZodNullable`, (e, t) => {
		$i$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Uf(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	ms = Ge$2(`ZodDefault`, (e, t) => {
		ea$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => qf(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
	});
	gs = Ge$2(`ZodPrefault`, (e, t) => {
		na$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Jf(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	vs = Ge$2(`ZodNonOptional`, (e, t) => {
		ra$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Wf(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	bs = Ge$2(`ZodSuccess`, (e, t) => {
		aa$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Df(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	Ss = Ge$2(`ZodCatch`, (e, t) => {
		sa$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Yf(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
	});
	ws = Ge$2(`ZodNaN`, (e, t) => {
		ca$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => wf(e, t, n, r);
	});
	J$1 = Ge$2(`ZodPipe`, (e, t) => {
		la$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Xf(e, t, n, r), e.in = t.in, e.out = t.out;
	});
	Y$1 = Ge$2(`ZodCodec`, (e, t) => {
		J$1.init(e, t), da$1.init(e, t);
	});
	ks = Ge$2(`ZodPreprocess`, (e, t) => {
		J$1.init(e, t), ma$1.init(e, t);
	});
	As = Ge$2(`ZodReadonly`, (e, t) => {
		ha$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Zf(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	Ms = Ge$2(`ZodTemplateLiteral`, (e, t) => {
		ya$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Tf(e, t, n, r);
	});
	Ps = Ge$2(`ZodLazy`, (e, t) => {
		Sa$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => ep(e, t, n, r), e.unwrap = () => e._zod.def.getter();
	});
	Is = Ge$2(`ZodPromise`, (e, t) => {
		xa$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Qf(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
	});
	Rs = Ge$2(`ZodFunction`, (e, t) => {
		ba$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => kf(e, t, n, r);
	});
	Z$1 = Ge$2(`ZodCustom`, (e, t) => {
		Ca$1.init(e, t), w$1.init(e, t), e._zod.processJSONSchema = (t, n, r) => Of(e, t, n, r);
	});
	Us = Fd;
	Ws = Id;
	Gs = Ge$2(`ZodInstanceOf`, (e, t) => {
		Z$1.init(e, t);
	}, { properties(e, t) {
		return this.check($u(e, t));
	} });
	qs = (...e) => Ld({
		Codec: Y$1,
		Boolean: I$1,
		String: T$1
	}, ...e);
	Xs = {
		invalid_type: `invalid_type`,
		too_big: `too_big`,
		too_small: `too_small`,
		invalid_format: `invalid_format`,
		not_multiple_of: `not_multiple_of`,
		unrecognized_keys: `unrecognized_keys`,
		invalid_union: `invalid_union`,
		invalid_key: `invalid_key`,
		invalid_element: `invalid_element`,
		invalid_value: `invalid_value`,
		custom: `custom`
	};
	$s ||= {};
	ec = t$2({
		ZodISODate: () => k$1,
		ZodISODateTime: () => O$2,
		ZodISODuration: () => j$1,
		ZodISOTime: () => A$1,
		date: () => nc,
		datetime: () => tc,
		duration: () => ic,
		time: () => rc
	});
	Q$1 = {
		...ca,
		...Gi,
		iso: ec
	};
	ac = new Set(`$schema.$ref.$defs.definitions.$id.id.$comment.$anchor.$vocabulary.$dynamicRef.$dynamicAnchor.type.enum.const.anyOf.oneOf.allOf.not.properties.required.additionalProperties.patternProperties.propertyNames.minProperties.maxProperties.items.prefixItems.additionalItems.minItems.maxItems.uniqueItems.contains.minContains.maxContains.minLength.maxLength.pattern.format.minimum.maximum.exclusiveMinimum.exclusiveMaximum.multipleOf.description.default.contentEncoding.contentMediaType.contentSchema.unevaluatedItems.unevaluatedProperties.if.then.else.dependentSchemas.dependentRequired.nullable.readOnly`.split(`.`));
	fc = new Set([
		`items`,
		`prefixItems`,
		`additionalItems`,
		`additionalProperties`,
		`contains`,
		`propertyNames`,
		`not`,
		`if`,
		`then`,
		`else`,
		`allOf`,
		`anyOf`,
		`oneOf`,
		`unevaluatedItems`,
		`unevaluatedProperties`,
		`contentSchema`
	]);
	pc = new Set([
		`properties`,
		`patternProperties`,
		`dependentSchemas`,
		`dependencies`,
		`$defs`,
		`definitions`
	]);
	vc = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
	xc = Symbol(`z.visit/resolving`);
	kc = t$2({
		bigint: () => Nc,
		boolean: () => Mc,
		date: () => Pc,
		number: () => jc,
		string: () => Ac
	});
	Fc = t$2({
		$brand: () => Ke$2,
		$input: () => uc$1,
		$output: () => lc$1,
		INVALID: () => F$2,
		NEVER: () => He$2,
		TimePrecision: () => ru,
		ZodAny: () => Do,
		ZodArray: () => Io,
		ZodBase64: () => Ka,
		ZodBase64URL: () => Ja,
		ZodBigInt: () => L$1,
		ZodBigIntFormat: () => vo,
		ZodBoolean: () => I$1,
		ZodCIDRv4: () => Ha,
		ZodCIDRv6: () => Wa,
		ZodCUID: () => Ea,
		ZodCUID2: () => Oa,
		ZodCatch: () => Ss,
		ZodCodec: () => Y$1,
		ZodCompileAsyncError: () => I$2,
		ZodCompileUnsupportedError: () => L$2,
		ZodCreditCard: () => Qa,
		ZodCustom: () => Z$1,
		ZodCustomStringFormat: () => N$1,
		ZodDate: () => Po,
		ZodDefault: () => ms,
		ZodDiscriminatedUnion: () => Uo,
		ZodE164: () => Xa,
		ZodEmail: () => da,
		ZodEmoji: () => Sa,
		ZodEnum: () => W$1,
		ZodError: () => Yi,
		ZodExactOptional: () => us,
		ZodFile: () => os,
		ZodFirstPartyTypeKind: () => $s,
		ZodFunction: () => Rs,
		ZodGUID: () => pa,
		ZodIBAN: () => eo,
		ZodIPv4: () => Ia,
		ZodIPv6: () => Ba,
		ZodISODate: () => k$1,
		ZodISODateTime: () => O$2,
		ZodISODuration: () => j$1,
		ZodISOTime: () => A$1,
		ZodInstanceOf: () => Gs,
		ZodIntersection: () => Go,
		ZodIssueCode: () => Xs,
		ZodJWT: () => no,
		ZodKSUID: () => Pa,
		ZodLazy: () => Ps,
		ZodLiteral: () => is,
		ZodMAC: () => Ra,
		ZodMap: () => Qo,
		ZodNaN: () => ws,
		ZodNanoID: () => wa,
		ZodNever: () => Ao,
		ZodNonOptional: () => vs,
		ZodNull: () => To,
		ZodNullable: () => fs,
		ZodNumber: () => P$1,
		ZodNumberFormat: () => F$1,
		ZodObject: () => B$1,
		ZodOptional: () => G$1,
		ZodPipe: () => J$1,
		ZodPrefault: () => gs,
		ZodPreprocess: () => ks,
		ZodPromise: () => Is,
		ZodReadonly: () => As,
		ZodRealError: () => S$1,
		ZodRecord: () => U$1,
		ZodSet: () => es,
		ZodString: () => T$1,
		ZodStringFormat: () => D$1,
		ZodSuccess: () => bs,
		ZodSymbol: () => xo,
		ZodTemplateLiteral: () => Ms,
		ZodTransform: () => cs,
		ZodTuple: () => qo,
		ZodType: () => w$1,
		ZodULID: () => Aa,
		ZodURL: () => ya,
		ZodUUID: () => M$1,
		ZodUndefined: () => Co,
		ZodUnion: () => V$2,
		ZodUnknown: () => ko,
		ZodVoid: () => Mo,
		ZodXID: () => Ma,
		ZodXor: () => Vo,
		_ZodString: () => ua,
		_default: () => hs,
		_function: () => X$2,
		any: () => Oo,
		array: () => z$2,
		base64: () => qa,
		base64url: () => Ya,
		bigint: () => _o,
		boolean: () => go,
		catch: () => Cs,
		check: () => zs,
		cidrv4: () => Ua,
		cidrv6: () => Ga,
		clone: () => k$2,
		codec: () => Ds,
		coerce: () => kc,
		compile: () => hc$1,
		config: () => Ye$2,
		core: () => ap,
		creditCard: () => $a,
		cuid: () => Da,
		cuid2: () => ka,
		currencyCode: () => so,
		custom: () => Bs,
		date: () => Fo,
		decode: () => ta,
		decodeAsync: () => ra,
		deepPartial: () => Cc,
		describe: () => Us,
		discriminatedUnion: () => Wo,
		e164: () => Za,
		email: () => fa,
		emoji: () => Ca,
		encode: () => ea,
		encodeAsync: () => na,
		endsWith: () => Zu,
		enum: () => ns,
		exactOptional: () => ds,
		file: () => ss,
		flattenError: () => Ae$1,
		float32: () => fo,
		float64: () => po,
		formatError: () => je$1,
		fromJSONSchema: () => bc,
		function: () => X$2,
		getDiscriminatedOption: () => ji,
		getErrorMap: () => Qs,
		globalRegistry: () => P$2,
		gt: () => Nu,
		gte: () => Pu,
		guid: () => ma,
		hash: () => co,
		hex: () => oo,
		hostname: () => ao,
		httpUrl: () => xa,
		iban: () => to,
		includes: () => Yu,
		input: () => Dc,
		instanceof: () => Ks,
		int: () => uo,
		int32: () => mo,
		int64: () => yo,
		intersection: () => Ko,
		invertCodec: () => Os,
		ipv4: () => La,
		ipv6: () => Va,
		iso: () => ec,
		json: () => Js,
		jwt: () => ro,
		keyof: () => Lo,
		ksuid: () => Fa,
		lazy: () => Fs,
		length: () => Gu,
		literal: () => as,
		locales: () => sc$1,
		looseObject: () => Bo,
		looseRecord: () => Zo,
		lowercase: () => qu,
		lt: () => ju,
		lte: () => Mu,
		mac: () => za,
		map: () => $o,
		maxLength: () => Uu,
		maxSize: () => Bu,
		memoizer: () => Ra$1,
		meta: () => Ws,
		mime: () => ed,
		minLength: () => Wu,
		minSize: () => Vu,
		multipleOf: () => zu,
		nan: () => Ts,
		nanoid: () => Ta,
		nativeEnum: () => rs,
		negative: () => Iu,
		never: () => jo,
		nonnegative: () => Ru,
		nonoptional: () => ys,
		nonpositive: () => Lu,
		normalize: () => td,
		null: () => Eo,
		nullable: () => q$1,
		nullish: () => ps,
		number: () => lo,
		object: () => Ro,
		optional: () => K$1,
		output: () => Oc,
		overwrite: () => K$2,
		parse: () => Xi,
		parseAsync: () => Zi,
		partialRecord: () => Xo,
		pipe: () => Es,
		positive: () => Fu,
		prefault: () => _s,
		preprocess: () => Ys,
		prettifyError: () => Pe$1,
		promise: () => Ls,
		properties: () => $u,
		property: () => Qu,
		readonly: () => js,
		record: () => Yo,
		refine: () => Vs,
		regex: () => Ku,
		regexes: () => ft$1,
		registry: () => fc$1,
		safeDecode: () => aa,
		safeDecodeAsync: () => sa,
		safeEncode: () => ia,
		safeEncodeAsync: () => oa,
		safeParse: () => Qi,
		safeParseAsync: () => $i,
		set: () => ts,
		setErrorMap: () => Zs,
		size: () => Hu,
		slugify: () => ad,
		startsWith: () => Xu,
		strictObject: () => zo,
		string: () => E$1,
		stringFormat: () => io,
		stringbool: () => qs,
		success: () => xs,
		superRefine: () => Hs,
		symbol: () => So,
		templateLiteral: () => Ns,
		toJSONSchema: () => np,
		toLowerCase: () => rd,
		toUpperCase: () => id,
		toZod: () => i$1,
		transform: () => ls,
		treeifyError: () => Me$1,
		trim: () => nd,
		tuple: () => Jo,
		uint32: () => ho,
		uint64: () => bo,
		ulid: () => ja,
		undefined: () => wo,
		union: () => H$2,
		unknown: () => R$2,
		uppercase: () => Ju,
		url: () => ba,
		util: () => t$1,
		uuid: () => ha,
		uuidv4: () => ga,
		uuidv6: () => _a,
		uuidv7: () => va,
		validate: () => qe$1,
		validateAsync: () => Ye$1,
		void: () => No,
		withParser: () => gc$1,
		xid: () => Na,
		xor: () => Ho
	});
}));
function isRuntimeLanguageModel(e) {
	if (typeof e != `object` || !e) return !1;
	let t = e;
	return (t.specificationVersion === `v2` || t.specificationVersion === `v3` || t.specificationVersion === `v4`) && typeof t.provider == `string` && typeof t.modelId == `string` && typeof t.doGenerate == `function` && typeof t.doStream == `function`;
}
function isAgentReasoningDefinition(e) {
	return typeof e == `string` && [
		`provider-default`,
		`none`,
		`minimal`,
		`low`,
		`medium`,
		`high`,
		`xhigh`
	].includes(e);
}
var init_runtime_model = __esmMin((() => {}));
var selfModificationConfigSchema;
var init_config_schema = __esmMin((() => {
	init_config();
	init_zod();
	init_runtime_model();
	selfModificationConfigSchema = Fc.object({
		model: Fc.custom((e) => typeof e == `string` || isRuntimeLanguageModel(e)).optional(),
		reasoning: Fc.custom(isAgentReasoningDefinition).optional(),
		local: Fc.object({ enabled: Fc.boolean().optional() }).optional(),
		deployed: Fc.custom((e) => e === void 0, DEPLOYED_OPTION_MOVED_MESSAGE).optional()
	}).strict();
}));
var extension_exports = __exportAll({ default: () => extension_default });
var extension_default;
var init_extension = __esmMin((() => {
	init_config_schema();
	extension_default = defineExtension({ config: selfModificationConfigSchema });
}));
var SESSION_INBOX_CONTEXT_KEY;
var init_address = __esmMin((() => {
	SESSION_INBOX_CONTEXT_KEY = `eve.sessionInbox`;
}));
var KEY_REGISTRY_GLOBAL_KEY, globalKeyRegistryContainer, keyRegistry, ContextKey;
var init_key = __esmMin((() => {
	KEY_REGISTRY_GLOBAL_KEY = Symbol.for(`eve.context-key-registry`);
	globalKeyRegistryContainer = globalThis;
	globalKeyRegistryContainer[KEY_REGISTRY_GLOBAL_KEY] === void 0 && (globalKeyRegistryContainer[KEY_REGISTRY_GLOBAL_KEY] = new Map());
	keyRegistry = globalKeyRegistryContainer[KEY_REGISTRY_GLOBAL_KEY];
	ContextKey = class {
		name;
		codec;
		constructor(e, t = {}) {
			this.name = e, this.codec = t.codec;
			let n = keyRegistry.get(e);
			if (n !== void 0 && n.codec === void 0 != (this.codec === void 0)) throw Error(`ContextKey name collision: "${e}" is already registered ${n.codec ? `with` : `without`} a codec, but a key ${this.codec ? `with` : `without`} a codec is being registered under the same name. This silently breaks context serialization — use a distinct name.`);
			keyRegistry.set(e, this);
		}
	};
}));
var STUB_CONTEXT_KEY;
var init_types = __esmMin((() => {
	STUB_CONTEXT_KEY = `eve.toolStubs`;
}));
var SESSION_CALLBACK_CONTEXT_KEY_NAME, EARLIER_REMOTE_CALLER_CONTEXT_KEY_NAME;
var init_key_names = __esmMin((() => {
	SESSION_CALLBACK_CONTEXT_KEY_NAME = `eve.sessionCallback`;
	EARLIER_REMOTE_CALLER_CONTEXT_KEY_NAME = `eve.earlierRemoteCaller`;
})), ConversationIdKey;
var init_keys = __esmMin((() => {
	init_address();
	init_key();
	init_types();
	init_key_names();
	new ContextKey(`eve.auth`);
	new ContextKey(STUB_CONTEXT_KEY);
	new ContextKey(`eve.initiatorAuth`);
	new ContextKey(`eve.steeredBy`);
	new ContextKey(`eve.deferCallerSteeredClear`);
	new ContextKey(`eve.sessionId`);
	ConversationIdKey = new ContextKey(`eve.conversationId`);
	new ContextKey(SESSION_INBOX_CONTEXT_KEY);
	new ContextKey(`eve.continuationToken`);
	new ContextKey(`eve.continuationHookTokens`);
	new ContextKey(`eve.channelRequestId`);
	new ContextKey(`eve.internal.localDevRequest`);
	new ContextKey(`eve.scheduleOccurrenceId`);
	new ContextKey(`eve.scheduleId`);
	new ContextKey(`eve.scheduleInstance`);
	new ContextKey(`eve.sessionTitle`);
	new ContextKey(`eve.channelDelivery`);
	new ContextKey(`eve.turnDeliveryIds`);
	new ContextKey(`eve.historyState`);
	new ContextKey(`eve.channelInstrumentation`);
	new ContextKey(`eve.parentSession`);
	new ContextKey(`eve.sessionPredecessor`);
	new ContextKey(`eve.traceRoot`);
	new ContextKey(`eve.parentTraceContext`);
	new ContextKey(`eve.sessionTraceSeed`);
	new ContextKey(`eve.otelTraceEnabled`);
	new ContextKey(`eve.capabilities`);
	new ContextKey(SESSION_CALLBACK_CONTEXT_KEY_NAME);
	new ContextKey(EARLIER_REMOTE_CALLER_CONTEXT_KEY_NAME);
	new ContextKey(`eve.session`);
	new ContextKey(`eve.sandbox`);
	new ContextKey(`eve.internal.sandboxTerminalCleanup`);
	new ContextKey(`eve.internal.handleEvent`);
	new ContextKey(`eve.internal.toolChannel`);
	new ContextKey(`eve.dynamicSubagentAgentConfig`);
	new ContextKey(`eve.agentSessionRuntimeOverrides`);
	new ContextKey(`eve.dynamicSkillSandbox`);
}));
var EVE_CONTEXT_STORAGE_KEY, globalContextStorage, storage, contextStorage;
var init_container = __esmMin((() => {
	init_keys();
	init_key();
	EVE_CONTEXT_STORAGE_KEY = Symbol.for(`eve.context-storage`);
	globalContextStorage = globalThis;
	globalContextStorage[EVE_CONTEXT_STORAGE_KEY] === void 0 && (globalContextStorage[EVE_CONTEXT_STORAGE_KEY] = new AsyncLocalStorage());
	storage = globalContextStorage[EVE_CONTEXT_STORAGE_KEY];
	contextStorage = {
		getStore: () => storage.getStore()?.context,
		run: (e, t) => storage.run({ context: e }, t)
	};
}));
function isVercelOidcIssuer(e) {
	return e === VERCEL_OIDC_ISSUER || e?.startsWith(`${VERCEL_OIDC_ISSUER}/`) === !0;
}
var VERCEL_OIDC_ISSUER;
var init_vercel_project = __esmMin((() => {
	VERCEL_OIDC_ISSUER = `https://oidc.vercel.com`;
}));
var init_identity_hold = __esmMin((() => {
	init_container();
	init_keys();
}));
function isVercelDevelopmentUser(e) {
	return e.authenticator === `oidc` && isVercelOidcIssuer(e.issuer) && e.attributes.environment === `development` && e.subject === e.attributes.user_id;
}
var init_principal = __esmMin((() => {
	init_container();
	init_keys();
	init_vercel_project();
	init_identity_hold();
}));
function isLocalSelfModificationEnabled(e) {
	return process.env.EVE_DEV === `1` && e.localEnabled;
}
function isLocalDeveloper(e) {
	return e === null ? !1 : e.authenticator === `local-dev` || isVercelDevelopmentUser(e);
}
var init_mode = __esmMin((() => {
	init_principal();
}));
function renderDescription(e) {
	return e.filter((e) => e.length > 0).join(` `);
}
function renderInstructions(e) {
	return e.filter((e) => e.length > 0).join(`

`);
}
var sourceDelegation, persistenceDelegation, namedInstallationDelegation, followUpDelegation, repairDelegation, roleInstructions, sourceWorkspaceInstructions, sourceEditingInstructions, toolAuthoringInstructions, registryWorkflowInstructions, documentationInstructions, workingInstructions;
var init_subagent_guidance = __esmMin((() => {
	sourceDelegation = `If the requested change references a tool or skill, include the exact identifier. Do not infer source paths; let the child resolve the appropriate file under /source. Delegate the requested change and existing constraints without adding unrequested features, implementation steps, or reporting requirements.`;
	persistenceDelegation = `Treat requests for persistent changes to future behavior or capabilities as source-modification requests, even when the requester does not mention files or source code. Infer persistence from the request and conversation rather than waiting for phrases such as “modify your source.” For example, asking the agent to stop always doing something, add a capability, or change future responses calls for inspecting and editing the authored source instead of providing a one-turn workaround.`;
	namedInstallationDelegation = `Treat questions phrased as whether you can install, add, enable, or connect to a named product or service as requests to extend this eve agent and delegate immediately. Do not assume they refer to device software, ask what kind of installation they mean, or deny them because you lack access to the user's device. The subagent determines whether the request maps to an integration, channel, connection, or other capability, then checks registry availability and any required setup.`;
	followUpDelegation = `Resolve short follow-ups such as “yes” or “do it” against the preceding conversation. If whether the requested change should persist is genuinely ambiguous, ask one concise clarifying question.`;
	repairDelegation = `If a tool or capability created or changed by this subagent later fails or behaves incorrectly, explain the observed problem and offer to delegate a repair. Do not start the repair until the user confirms. Treat that confirmation as a source-modification request and delegate it immediately, including the exact identifier, failing behavior, expected behavior, and existing constraints.`;
	roleInstructions = `## Role

You are an expert coding assistant operating inside of an eve agent. You help users by reading files, editing code, and writing new files that shape the behavior of the agent itself.`;
	sourceWorkspaceInstructions = `## Source workspace

The source code of the eve agent is mounted read-write at /source. /source is the authored agent directory. Locate source files with bash. Read source contents with read_file, not shell commands. Before generating an overwrite, ensure read_file has succeeded for that path. Shell reads do not satisfy write_file's read-before-write requirement. edit_file instead validates exact matches against current contents. Never modify source files with bash, sed, awk, redirection, or scripting.

Resolve named tools by filename under /source/tools before searching contents. Tool identifiers derive from filenames and may not occur in the implementation.`;
	sourceEditingInstructions = `## Implement changes

Use edit_file for localized changes; include only the unique matching text. For a complete rewrite, use read_file then write_file; do not encode the whole old file as one replacement. If tool arguments fail argument parsing, retry the same tool with corrected encoding.

Once paths are known, batch independent file reads and edits to different files. Never edit the same file concurrently.`;
	toolAuthoringInstructions = `## Add model-callable actions

When the requester wants this agent to gain a reusable action or capability that it can invoke in future turns, implement it as an authored eve tool under /source/tools. This applies even when the request describes the action without using the word “tool.” Follow the path-derived naming and defineTool conventions in the mounted eve tools documentation and existing source.

Do not substitute a loose Python, shell, or JavaScript file for a model-callable tool. A support script is acceptable only when an authored eve tool invokes it as an implementation detail, or when the requester explicitly asks for a standalone script instead of an agent capability.`;
	registryWorkflowInstructions = `## Add integrations

Before adding a new eve-managed channel, connection, extension, instrumentation, or memory integration, call search_registry alongside source discovery. If an item fulfills the requirement, install it with registry_add using its exact address. If no matching item fulfills the requirement, or if the developer asks for a custom implementation, write the integration yourself.

Modifying the behavior of an existing skill or tool does not require a registry search. Registry search blocks implementation, not source inspection. Serialize registry installation and dependent edits. Run registry_add separately from file edits and other registry installations.

Registry installation is outside the source sandbox.`;
	documentationInstructions = `## Consult documentation

The eve framework documentation is mounted read-only at /eve-docs. Prefer source and existing local patterns. Before reading docs, identify the specific unresolved API question. Search the relevant file for its heading or term, then read only the bounded surrounding section. Do not concatenate wildcard files or read a full page when a section answers the question. Stop when the question is resolved.`;
	workingInstructions = `## Work efficiently

Skip task lists for simple work - only use them for complex actions. Never spend a turn only reporting status or updating the task list - batch them with other calls.

Treat a successful file-edit tool result as confirmation; do not reread a file solely to verify that the edit succeeded. Do not approximate unavailable build or test commands with broad source searches.`;
})), DEFAULT_AGENT_MODEL_ID;
var init_default_agent_model = __esmMin((() => {
	DEFAULT_AGENT_MODEL_ID = `openai/gpt-6-luna-fast`;
}));
var agent_exports = __exportAll({
	FALLBACK_SELF_MODIFICATION_MODEL: () => FALLBACK_SELF_MODIFICATION_MODEL,
	default: () => agent_default,
	defineSelfModificationAgent: () => defineSelfModificationAgent
});
function defineSelfModificationAgent(e = {}) {
	return defineDynamic$1((t) => {
		let n = extension_default.config;
		if (!isLocalSelfModificationEnabled(resolveSelfModificationConfig(e.config ?? n)) || getLocalDevCapability() === void 0 || !isLocalDeveloper(t.session.auth.current)) return null;
		let i = e.model ?? n.model ?? t.model.id ?? void 0;
		let a = e.reasoning ?? n.reasoning ?? (i === void 0 ? "high" : void 0);
		let o = i ?? FALLBACK_SELF_MODIFICATION_MODEL;
		let s = renderDescription([
			`Delegate here immediately when the user asks to change the self-modification subagent's model, reasoning, or configuration. Also delegate when the user asks to change this eve agent or its authored source.`,
			sourceDelegation,
			persistenceDelegation,
			namedInstallationDelegation,
			`Delegate questions about which integrations, channels, connections, or capabilities are available to add: the subagent searches the eve registry and reports exact item addresses instead of guessing them.`,
			`Delegate requests to investigate, diagnose, or optimize the agent's behavior from local traces to this subagent: it can inspect the invoking session's trace and make persistent source changes when warranted.`,
			followUpDelegation,
			repairDelegation,
			`Source edits do not affect the caller’s current turn. After this subagent reports changes, do not invoke edited tools or attempt runtime verification until a new user turn.`
		]);
		return defineAgent({
			description: s,
			model: o,
			reasoning: a
		});
	});
}
var FALLBACK_SELF_MODIFICATION_MODEL, agent_default;
var init_agent = __esmMin((() => {
	init_extension();
	init_config();
	init_mode();
	init_subagent_guidance();
	init_default_agent_model();
	FALLBACK_SELF_MODIFICATION_MODEL = DEFAULT_AGENT_MODEL_ID;
	agent_default = defineSelfModificationAgent();
}));
function renderLocalSelfModificationExtension() {
	return `import selfModification from "eve/extensions/self-modification/local";

export default selfModification({
  // model: "provider/model",
  // reasoning: "high",
});
`;
}
var instructions_exports = __exportAll({ default: () => instructions_default });
var selfModificationSubagentGuidance, instructions_default;
var init_instructions = __esmMin((() => {
	init_config();
	init_mode();
	init_subagent_guidance();
	init_extension();
	selfModificationSubagentGuidance = `## Changing the self-modification subagent

Only when the requester explicitly names the self-modification subagent, edit whichever of /source/extensions/self-modification.ts or /source/extensions/self-modification/extension.ts exists. If neither exists, create /source/extensions/self-modification/extension.ts with write_file using this content, then make the requested model or reasoning change:
\`\`\`ts
${renderLocalSelfModificationExtension()}\`\`\``;
	instructions_default = defineDynamic$2(() => isLocalSelfModificationEnabled(resolveSelfModificationConfig(extension_default.config)) ? defineInstructions({ content: renderInstructions([
		roleInstructions,
		sourceWorkspaceInstructions,
		sourceEditingInstructions,
		toolAuthoringInstructions,
		registryWorkflowInstructions,
		documentationInstructions,
		"## Local environment\n\nThe registry_add tool will complete installation for items that need no setup. In the local dev TUI, a `needs-terminal` result queues the existing setup panel, which opens after your reply and reports the setup outcome itself. Until then nothing is installed: say that setup continues in the panel and never describe the item as added, connected, or set up. In headless development, if a `needs-terminal` result includes `nextCommand`, present that exact value as the only shell command in your response. Never infer, construct, or rewrite a command: installing an item uses `eve add <item>`; `eve registry add` configures registry namespace mappings and does not install items.\n\nLocal eve dev logs are mounted read-only at /logs. Local trace segments are mounted read-only at /traces when available. For latency, failure, token, or behavior analysis, load and follow the `trace_analysis` skill. Trace searches are scoped to the invoking conversation and exclude the current investigation by default.\n\nThe application package.json is not mounted. Do not search outside /source for application files. You cannot run host binaries such as git, node, pnpm, or tsc. Use existing imports and registry_add for supported registry installations.",
		workingInstructions,
		selfModificationSubagentGuidance,
		`## Report results

For source-modification tasks, return a concise handoff to the caller. Use at most four short bullets covering changed paths and behavior, and any required setup or unresolved issues.

For investigation tasks, report the findings and supporting evidence requested by the caller.`
	]) }) : null);
}));
var sandbox_exports = __exportAll({
	default: () => sandbox_default,
	defineSelfModificationSandbox: () => defineSelfModificationSandbox
});
var sandbox_default;
var init_sandbox = __esmMin((() => {
	init_extension();
	sandbox_default = defineSelfModificationSandbox$1({ config: extension_default.config });
}));
function stampDefinitionKey(e, t) {
	Object.defineProperty(e, DEFINITION_KEY, {
		configurable: !0,
		value: t
	});
}
var DEFINITION_KEY, RESOLVED_REGISTRY_SYMBOL, FALLBACK_REGISTRY_SYMBOL, registryContainer;
var init_source_identity = __esmMin((() => {
	DEFINITION_KEY = Symbol.for(`eve.definition-source-key`);
	RESOLVED_REGISTRY_SYMBOL = Symbol.for(`eve.resolved-definition-sources`);
	FALLBACK_REGISTRY_SYMBOL = Symbol.for(`eve.fallback-definition-sources`);
	registryContainer = globalThis;
	registryContainer[RESOLVED_REGISTRY_SYMBOL] ??= new WeakMap(), registryContainer[FALLBACK_REGISTRY_SYMBOL] ??= new Map();
	registryContainer[RESOLVED_REGISTRY_SYMBOL];
	registryContainer[FALLBACK_REGISTRY_SYMBOL];
}));
function defineDynamic(e) {
	assertDynamicFunction(e, `defineDynamic()`);
	let t = { [DYNAMIC_SENTINEL]: e };
	return stampDefinitionKey(t, `dynamic`), t;
}
function assertDynamicFunction(e, t) {
	if (typeof e != `function`) throw typeof e == `object` && e && `events` in e ? Error(`${t} takes a function of the session, not an events map: defineDynamic(async (ctx) => value). Key work that should run once per session, turn, or tenant with ctx.memo(key, fn).`) : Error(`${t} takes a function: defineDynamic(async (ctx) => value).`);
}
var DYNAMIC_SENTINEL;
var init_definition = __esmMin((() => {
	init_source_identity();
	DYNAMIC_SENTINEL = Symbol.for(`eve.dynamic`);
}));
function resolveLocalOnly(e, t) {
	return isLocalSelfModificationEnabled(e) ? t : null;
}
function defineLocalOnlyDynamic(e) {
	return defineDynamic(() => resolveLocalOnly(resolveSelfModificationConfig(extension_default.config), e));
}
var init_local_only = __esmMin((() => {
	init_config();
	init_mode();
	init_extension();
	init_definition();
}));
var trace_analysis_exports = __exportAll({
	default: () => trace_analysis_default,
	resolveTraceAnalysisSkill: () => resolveTraceAnalysisSkill
});
function resolveTraceAnalysisSkill(e) {
	return resolveLocalOnly(e, traceAnalysisSkill);
}
var traceAnalysisSkill, trace_analysis_default;
var init_trace_analysis$1 = __esmMin((() => {
	init_local_only();
	traceAnalysisSkill = defineSkill({
		description: `Analyze local eve traces for latency, token usage, failures, repeated tool calls, and discovery inefficiency with a bounded, conversation-scoped investigation.`,
		content: `# Trace analysis

Use this workflow when the user asks to review, diagnose, or optimize behavior from local traces.

## Keep the investigation bounded

1. Call \`search_traces\` once with \`limit\` no greater than 5. It is already scoped to the invoking conversation, including its child-agent traces, and excludes the current investigation by default.
2. Rank findings across correctness, latency, token usage, and tool-call efficiency. Follow the user's stated priority; do not assume that "improve" means only fixing errors.
3. Call \`inspect_trace\` only for the one or two traces needed to explain a high-impact signal. Set \`limit\` to the smallest useful bound, normally 20–40. Its timeline includes bounded argument previews and \`availableFields\` for each span.
4. Use \`inspect_trace_spans\` only with span ids returned by a timeline. Include only the required payload fields and batch related spans in one call. An empty \`availableFields\` list means none are recorded, not that the call failed.
5. Use the read-only \`/logs\` mount only to corroborate a specific runtime error that the structural trace cannot explain. Search a literal diagnostic fragment with bounded output before reading a file. With no observed failure, skip broad log searches and speculative web searches for possible failures.
6. Inspect \`/source\` or \`/eve-docs\` only when evidence points to a persistent authored change or an unresolved API question.

Prefer three analysis rounds or fewer. Do not read raw trace segments, search the whole filesystem, or enumerate broad documentation when the bounded tools answer the question.

Search and inspection share the same summary. Its durationMs is elapsed time; inspection's modelWorkMs and toolWorkMs sum operation time and may exceed elapsed time when calls overlap. errorSpanCount counts error-bearing spans, not independent failures or final activation outcome; failures ranking uses this count. Token totals sum step usage without counting repeated model counters.

For latency, distinguish tool execution time from model round-trip time. Repeated tool counts are leads, not proof that calls are independent; inspect the compact timeline before recommending batching. Report the highest-impact opportunities first.
`
	});
	trace_analysis_default = defineLocalOnlyDynamic(traceAnalysisSkill);
}));
var edit_file_exports = __exportAll({
	applyExactEdits: () => applyExactEdits,
	default: () => edit_file_default
});
function applyExactEdits(e, t) {
	if (t.length === 0) throw Error(`edits must contain at least one replacement.`);
	let n = [...t.map((t, n) => {
		if (t.oldText.length === 0) throw Error(`edits[${n}].oldText must not be empty.`);
		let r = e.indexOf(t.oldText);
		if (r === -1) throw Error(`edits[${n}].oldText was not found in the current file. Read the file and try again.`);
		if (e.indexOf(t.oldText, r + 1) !== -1) throw Error(`edits[${n}].oldText occurs more than once. Include more surrounding text to make it unique.`);
		return {
			...t,
			end: r + t.oldText.length,
			index: n,
			start: r
		};
	})].sort((e, t) => e.start - t.start);
	for (let e = 1; e < n.length; e += 1) {
		let t = n[e - 1];
		let r = n[e];
		if (t !== void 0 && r !== void 0 && r.start < t.end) throw Error(`edits[${t.index}] and edits[${r.index}] overlap. Merge them into one edit.`);
	}
	return n.toReversed().reduce((e, t) => e.slice(0, t.start) + t.newText + e.slice(t.end), e);
}
var inputSchema$3, outputSchema$2, edit_file_default;
var init_edit_file = __esmMin((() => {
	inputSchema$3 = {
		type: `object`,
		additionalProperties: !1,
		properties: {
			path: {
				type: `string`,
				minLength: 1,
				description: `Absolute path below /source to edit.`
			},
			edits: {
				type: `array`,
				minItems: 1,
				items: {
					type: `object`,
					additionalProperties: !1,
					properties: {
						oldText: {
							type: `string`,
							minLength: 1,
							description: `Unique exact text from the current file. Encode control characters, quotes, and backslashes as JSON escapes.`
						},
						newText: {
							type: `string`,
							description: `Exact replacement text. Encode control characters, quotes, and backslashes as JSON escapes.`
						}
					},
					required: [`oldText`, `newText`]
				},
				description: `One or more targeted replacements. Each edit is matched against the original file, not incrementally. Do not include overlapping or nested edits. If two changes touch the same block or nearby lines, merge them into one edit instead.`
			}
		},
		required: [`path`, `edits`]
	};
	outputSchema$2 = {
		type: `object`,
		additionalProperties: !1,
		properties: {
			path: { type: `string` },
			replacements: {
				type: `integer`,
				minimum: 1
			}
		},
		required: [`path`, `replacements`]
	};
	edit_file_default = defineTool({
		description: `Edit a single file using exact text replacement. Every edits[].oldText must match a unique, non-overlapping region of the original file. If two changes affect the same block or nearby lines, merge them into one edit instead of emitting overlapping edits. Do not include large unchanged regions just to connect distant changes.`,
		inputSchema: inputSchema$3,
		outputSchema: outputSchema$2,
		async execute(e, t) {
			let { edits: n, path: r } = e;
			if (typeof r != `string` || !Array.isArray(n) || n.some((e) => typeof e != `object` || !e || typeof e.oldText != `string` || typeof e.newText != `string`)) throw Error(`path must be a string and edits must contain oldText and newText strings.`);
			let i = await t.getSandbox();
			let a = i.resolvePath(r);
			if (!a.startsWith(`/source/`) || a.split(`/`).some((e) => e === `..`)) throw Error(`Self-modification file edits must stay below /source.`);
			let o = await i.readTextFile({ path: a });
			if (o === null) throw Error(`File not found: ${r}.`);
			if (o.includes(`\0`)) throw Error(`File "${r}" contains NUL bytes and appears to be binary.`);
			return await i.writeTextFile({
				content: applyExactEdits(o, n),
				path: a
			}), {
				path: a,
				replacements: n.length
			};
		}
	});
}));
var n$2, s$1, l$2;
var init_rolldown_runtime_nUh0tHLY = __esmMin((() => {
	n$2 = Object.defineProperty;
	s$1 = (e, t, n) => () => {
		if (n) throw n[0];
		try {
			return e && (t = e(e = 0)), t;
		} catch (e) {
			throw n = [e], e;
		}
	};
	l$2 = (e, t) => {
		let r = Object.setPrototypeOf({}, null);
		for (var i in e) n$2(r, i, {
			get: e[i],
			enumerable: !0
		});
		return t & 1 || n$2(r, Symbol.toStringTag, { value: `Module` }), t & 2 ? r : Object.preventExtensions(r);
	};
	createRequire(import.meta.url);
}));
function i(e) {
	let t = new Set([e]), n = new Set(), r = e.match(a);
	if (!r) return () => !1;
	let i = {
		major: +r[1],
		minor: +r[2],
		patch: +r[3],
		prerelease: r[4]
	};
	if (i.prerelease != null) return function(t) {
		return t === e;
	};
	function o(e) {
		return n.add(e), !1;
	}
	function s(e) {
		return t.add(e), !0;
	}
	return function(e) {
		if (t.has(e)) return !0;
		if (n.has(e)) return !1;
		let r = e.match(a);
		if (!r) return o(e);
		let c = {
			major: +r[1],
			minor: +r[2],
			patch: +r[3],
			prerelease: r[4]
		};
		return c.prerelease != null || i.major !== c.major ? o(e) : i.major === 0 ? i.minor === c.minor && i.patch <= c.patch ? s(e) : o(e) : i.minor <= c.minor ? s(e) : o(e);
	};
}
function c(e, t, r, i = !1) {
	let a = f[d$1] = f[d$1] ?? { version: n$1 };
	if (!i && a[e]) {
		let t = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e}`);
		return r.error(t.stack || t.message), !1;
	}
	if (a.version !== `1.9.1`) {
		let t = Error(`@opentelemetry/api: Registration of version v${a.version} for ${e} does not match previously registered API v${n$1}`);
		return r.error(t.stack || t.message), !1;
	}
	return a[e] = t, r.debug(`@opentelemetry/api: Registered a global for ${e} v${n$1}.`), !0;
}
function l$1(e) {
	let t = f[d$1]?.version;
	if (t && o(t)) return f[d$1]?.[e];
}
function u$1(e, t) {
	t.debug(`@opentelemetry/api: Unregistering a global for ${e} v${n$1}.`);
	let r = f[d$1];
	r && delete r[e];
}
function m(e, t, n) {
	let r = l$1(`diag`);
	if (r) return r[e](t, ...n);
}
function re(e, t) {
	e < h.NONE ? e = h.NONE : e > h.ALL && (e = h.ALL), t ||= {};
	function n(n, r) {
		let i = t[n];
		return typeof i == `function` && e >= r ? i.bind(t) : function() {};
	}
	return {
		error: n(`error`, h.ERROR),
		warn: n(`warn`, h.WARN),
		info: n(`info`, h.INFO),
		debug: n(`debug`, h.DEBUG),
		verbose: n(`verbose`, h.VERBOSE)
	};
}
function ue(e = {}) {
	return new oe(new Map(Object.entries(e)));
}
function de(e) {
	return typeof e != `string` && (fe.error(`Cannot create baggage metadata from unknown type: ${typeof e}`), e = ``), {
		__TYPE__: ce,
		toString() {
			return e;
		}
	};
}
function y(e) {
	return Symbol.for(e);
}
function _e() {
	return Ee;
}
function Ue(e) {
	return e.getValue(L) || void 0;
}
function We() {
	return Ue(k.getInstance().active());
}
function Ge(e, t) {
	return e.setValue(L, t);
}
function Ke(e) {
	return e.deleteValue(L);
}
function qe(e, t) {
	return Ge(e, new I(t));
}
function Je(e) {
	return Ue(e)?.spanContext();
}
function Xe(e, t) {
	if (typeof e != `string` || e.length !== t) return !1;
	let n = 0;
	for (let t = 0; t < e.length; t += 4) n += (z$1[e.charCodeAt(t)] | 0) + (z$1[e.charCodeAt(t + 1)] | 0) + (z$1[e.charCodeAt(t + 2)] | 0) + (z$1[e.charCodeAt(t + 3)] | 0);
	return n === t;
}
function Ze(e) {
	return Xe(e, 32) && e !== `00000000000000000000000000000000`;
}
function Qe(e) {
	return Xe(e, 16) && e !== `0000000000000000`;
}
function R$1(e) {
	return Ze(e.traceId) && Qe(e.spanId);
}
function $e(e) {
	return new I(e);
}
function et(e) {
	return typeof e == `object` && !!e && `spanId` in e && typeof e.spanId == `string` && `traceId` in e && typeof e.traceId == `string` && `traceFlags` in e && typeof e.traceFlags == `number`;
}
function ht(e) {
	return _t.test(e);
}
function gt(e) {
	return vt.test(e) && !yt.test(e);
}
function Dt(e) {
	return new Tt(e);
}
function zt(e) {
	return e.getValue(Y) || void 0;
}
function Bt() {
	return zt(k.getInstance().active());
}
function Vt(e, t) {
	return e.setValue(Y, t);
}
function Ht(e) {
	return e.deleteValue(Y);
}
var n$1, r$1, a, o, s, ee, d$1, f, p$1, te, ne, h, g, ie, ae, _, v, oe, se, ce, le, fe, pe, me, b$1, x, S, C, he, ge, ve, w, ye, be, xe, Se, T, Ce, we, Te, Ee, De, Oe, ke, Ae, je, Me, Ne, Pe, Fe, Ie, E, D, Le, Re, ze, O$1, Be, k, A, j, Ve, M, N, P, F, I, He, L, Ye, z$1, B, V$1, tt, nt, rt, H$1, it, at, ot, st, U, ct, lt, ut, dt, ft, pt, mt, W, _t, vt, yt, bt, xt, St, Ct, wt, Tt, Et, Ot, G, kt, K, At, jt, Mt, Nt, q, Pt, Ft, J, It, Lt, Rt, Y, Ut, X$1, Wt, Gt, Kt, Z, qt, Q, Jt, Yt, $, Xt, Qt, $t;
var init_esm_BQbQSdEk = __esmMin((() => {
	init_rolldown_runtime_nUh0tHLY();
	r$1 = s$1((() => {
		n$1 = `1.9.1`;
	}));
	s = s$1((() => {
		r$1(), a = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, o = i(n$1);
	}));
	p$1 = s$1((() => {
		r$1(), s(), ee = n$1.split(`.`)[0], d$1 = Symbol.for(`opentelemetry.js.api.${ee}`), f = typeof globalThis == `object` ? globalThis : typeof self == `object` ? self : typeof window == `object` ? window : typeof global == `object` ? global : {};
	}));
	ne = s$1((() => {
		p$1(), te = class {
			constructor(e) {
				this._namespace = e.namespace || `DiagComponentLogger`;
			}
			debug(...e) {
				return m(`debug`, this._namespace, e);
			}
			error(...e) {
				return m(`error`, this._namespace, e);
			}
			info(...e) {
				return m(`info`, this._namespace, e);
			}
			warn(...e) {
				return m(`warn`, this._namespace, e);
			}
			verbose(...e) {
				return m(`verbose`, this._namespace, e);
			}
		};
	}));
	g = s$1((() => {
		(function(e) {
			e[e.NONE = 0] = `NONE`, e[e.ERROR = 30] = `ERROR`, e[e.WARN = 50] = `WARN`, e[e.INFO = 60] = `INFO`, e[e.DEBUG = 70] = `DEBUG`, e[e.VERBOSE = 80] = `VERBOSE`, e[e.ALL = 9999] = `ALL`;
		})(h ||= {});
	}));
	ie = s$1((() => {
		g();
	}));
	v = s$1((() => {
		ne(), ie(), g(), p$1(), ae = `diag`, _ = class e {
			static instance() {
				return this._instance ||= new e(), this._instance;
			}
			constructor() {
				function e(e) {
					return function(...t) {
						let n = l$1(`diag`);
						if (n) return n[e](...t);
					};
				}
				let t = this;
				t.setLogger = (e, n = { logLevel: h.INFO }) => {
					if (e === t) {
						let e = Error(`Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation`);
						return t.error(e.stack ?? e.message), !1;
					}
					typeof n == `number` && (n = { logLevel: n });
					let r = l$1(`diag`), i = re(n.logLevel ?? h.INFO, e);
					if (r && !n.suppressOverrideMessage) {
						let e = Error().stack ?? `<failed to generate stacktrace>`;
						r.warn(`Current logger will be overwritten from ${e}`), i.warn(`Current logger will overwrite one already registered from ${e}`);
					}
					return c(`diag`, i, t, !0);
				}, t.disable = () => {
					u$1(ae, t);
				}, t.createComponentLogger = (e) => new te(e), t.verbose = e(`verbose`), t.debug = e(`debug`), t.info = e(`info`), t.warn = e(`warn`), t.error = e(`error`);
			}
		};
	}));
	se = s$1((() => {
		oe = class e {
			constructor(e) {
				this._entries = e ? new Map(e) : new Map();
			}
			getEntry(e) {
				let t = this._entries.get(e);
				if (t) return Object.assign({}, t);
			}
			getAllEntries() {
				return Array.from(this._entries.entries());
			}
			setEntry(t, n) {
				let r = new e(this._entries);
				return r._entries.set(t, n), r;
			}
			removeEntry(t) {
				let n = new e(this._entries);
				return n._entries.delete(t), n;
			}
			removeEntries(...t) {
				let n = new e(this._entries);
				for (let e of t) n._entries.delete(e);
				return n;
			}
			clear() {
				return new e();
			}
		};
	}));
	le = s$1((() => {
		ce = Symbol(`BaggageEntryMetadata`);
	}));
	pe = s$1((() => {
		v(), se(), le(), fe = _.instance();
	}));
	x = s$1((() => {
		me = class e {
			constructor(t) {
				let n = this;
				n._currentContext = t ? new Map(t) : new Map(), n.getValue = (e) => n._currentContext.get(e), n.setValue = (t, r) => {
					let i = new e(n._currentContext);
					return i._currentContext.set(t, r), i;
				}, n.deleteValue = (t) => {
					let r = new e(n._currentContext);
					return r._currentContext.delete(t), r;
				};
			}
		}, b$1 = new me();
	}));
	ge = s$1((() => {
		if (S = [
			{
				n: `error`,
				c: `error`
			},
			{
				n: `warn`,
				c: `warn`
			},
			{
				n: `info`,
				c: `info`
			},
			{
				n: `debug`,
				c: `debug`
			},
			{
				n: `verbose`,
				c: `trace`
			}
		], C = {}, typeof console < `u`) for (let e of [
			`error`,
			`warn`,
			`info`,
			`debug`,
			`trace`,
			`log`
		]) typeof console[e] == `function` && (C[e] = console[e]);
		he = class {
			constructor() {
				function e(e) {
					return function(...t) {
						let n = C[e];
						if (typeof n != `function` && (n = C.log), typeof n != `function` && console && (n = console[e], typeof n != `function` && (n = console.log)), typeof n == `function`) return n.apply(console, t);
					};
				}
				for (let t = 0; t < S.length; t++) this[S[t].n] = e(S[t].c);
			}
		};
	}));
	Pe = s$1((() => {
		ve = class {
			constructor() {}
			createGauge(e, t) {
				return Oe;
			}
			createHistogram(e, t) {
				return ke;
			}
			createCounter(e, t) {
				return De;
			}
			createUpDownCounter(e, t) {
				return Ae;
			}
			createObservableGauge(e, t) {
				return Me;
			}
			createObservableCounter(e, t) {
				return je;
			}
			createObservableUpDownCounter(e, t) {
				return Ne;
			}
			addBatchObservableCallback(e, t) {}
			removeBatchObservableCallback(e) {}
		}, w = class {}, ye = class extends w {
			add(e, t) {}
		}, be = class extends w {
			add(e, t) {}
		}, xe = class extends w {
			record(e, t) {}
		}, Se = class extends w {
			record(e, t) {}
		}, T = class {
			addCallback(e) {}
			removeCallback(e) {}
		}, Ce = class extends T {}, we = class extends T {}, Te = class extends T {}, Ee = new ve(), De = new ye(), Oe = new xe(), ke = new Se(), Ae = new be(), je = new Ce(), Me = new we(), Ne = new Te();
	}));
	Ie = s$1((() => {
		(function(e) {
			e[e.INT = 0] = `INT`, e[e.DOUBLE = 1] = `DOUBLE`;
		})(Fe ||= {});
	}));
	Le = s$1((() => {
		E = {
			get(e, t) {
				if (e != null) return e[t];
			},
			keys(e) {
				return e == null ? [] : Object.keys(e);
			}
		}, D = { set(e, t, n) {
			e != null && (e[t] = n);
		} };
	}));
	ze = s$1((() => {
		x(), Re = class {
			active() {
				return b$1;
			}
			with(e, t, n, ...r) {
				return t.call(n, ...r);
			}
			bind(e, t) {
				return t;
			}
			enable() {
				return this;
			}
			disable() {
				return this;
			}
		};
	}));
	A = s$1((() => {
		ze(), p$1(), v(), O$1 = `context`, Be = new Re(), k = class e {
			constructor() {}
			static getInstance() {
				return this._instance ||= new e(), this._instance;
			}
			setGlobalContextManager(e) {
				return c(O$1, e, _.instance());
			}
			active() {
				return this._getContextManager().active();
			}
			with(e, t, n, ...r) {
				return this._getContextManager().with(e, t, n, ...r);
			}
			bind(e, t) {
				return this._getContextManager().bind(e, t);
			}
			_getContextManager() {
				return l$1(O$1) || Be;
			}
			disable() {
				this._getContextManager().disable(), u$1(O$1, _.instance());
			}
		};
	}));
	Ve = s$1((() => {
		(function(e) {
			e[e.NONE = 0] = `NONE`, e[e.SAMPLED = 1] = `SAMPLED`;
		})(j ||= {});
	}));
	F = s$1((() => {
		Ve(), M = `0000000000000000`, N = `00000000000000000000000000000000`, P = {
			traceId: N,
			spanId: M,
			traceFlags: j.NONE
		};
	}));
	He = s$1((() => {
		F(), I = class {
			constructor(e = P) {
				this._spanContext = e;
			}
			spanContext() {
				return this._spanContext;
			}
			setAttribute(e, t) {
				return this;
			}
			setAttributes(e) {
				return this;
			}
			addEvent(e, t) {
				return this;
			}
			addLink(e) {
				return this;
			}
			addLinks(e) {
				return this;
			}
			setStatus(e) {
				return this;
			}
			updateName(e) {
				return this;
			}
			end(e) {}
			isRecording() {
				return !1;
			}
			recordException(e, t) {}
		};
	}));
	Ye = s$1((() => {
		x(), He(), A(), L = y(`OpenTelemetry Context Key SPAN`);
	}));
	B = s$1((() => {
		F(), He(), z$1 = new Uint8Array([
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			1,
			1,
			1,
			1,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			1,
			1,
			1,
			1,
			1
		]);
	}));
	nt = s$1((() => {
		A(), Ye(), He(), B(), V$1 = k.getInstance(), tt = class {
			startSpan(e, t, n = V$1.active()) {
				if (t?.root) return new I();
				let r = n && Je(n);
				return et(r) && R$1(r) ? new I(r) : new I();
			}
			startActiveSpan(e, t, n, r) {
				let i, a, o;
				if (arguments.length < 2) return;
				arguments.length === 2 ? o = t : arguments.length === 3 ? (i = t, o = n) : (i = t, a = n, o = r);
				let s = a ?? V$1.active(), c = this.startSpan(e, i, s), l = Ge(s, c);
				return V$1.with(l, o, void 0, c);
			}
		};
	}));
	it = s$1((() => {
		nt(), rt = new tt(), H$1 = class {
			constructor(e, t, n, r) {
				this._provider = e, this.name = t, this.version = n, this.options = r;
			}
			startSpan(e, t, n) {
				return this._getTracer().startSpan(e, t, n);
			}
			startActiveSpan(e, t, n, r) {
				let i = this._getTracer();
				return Reflect.apply(i.startActiveSpan, i, arguments);
			}
			_getTracer() {
				if (this._delegate) return this._delegate;
				let e = this._provider.getDelegateTracer(this.name, this.version, this.options);
				return e ? (this._delegate = e, this._delegate) : rt;
			}
		};
	}));
	ot = s$1((() => {
		nt(), at = class {
			getTracer(e, t, n) {
				return new tt();
			}
		};
	}));
	ct = s$1((() => {
		it(), ot(), st = new at(), U = class {
			getTracer(e, t, n) {
				return this.getDelegateTracer(e, t, n) ?? new H$1(this, e, t, n);
			}
			getDelegate() {
				return this._delegate ?? st;
			}
			setDelegate(e) {
				this._delegate = e;
			}
			getDelegateTracer(e, t, n) {
				return this._delegate?.getTracer(e, t, n);
			}
		};
	}));
	ut = s$1((() => {
		(function(e) {
			e[e.NOT_RECORD = 0] = `NOT_RECORD`, e[e.RECORD = 1] = `RECORD`, e[e.RECORD_AND_SAMPLED = 2] = `RECORD_AND_SAMPLED`;
		})(lt ||= {});
	}));
	ft = s$1((() => {
		(function(e) {
			e[e.INTERNAL = 0] = `INTERNAL`, e[e.SERVER = 1] = `SERVER`, e[e.CLIENT = 2] = `CLIENT`, e[e.PRODUCER = 3] = `PRODUCER`, e[e.CONSUMER = 4] = `CONSUMER`;
		})(dt ||= {});
	}));
	mt = s$1((() => {
		(function(e) {
			e[e.UNSET = 0] = `UNSET`, e[e.OK = 1] = `OK`, e[e.ERROR = 2] = `ERROR`;
		})(pt ||= {});
	}));
	bt = s$1((() => {
		W = `[_0-9a-z-*/]`, _t = RegExp(`^(?:${`[a-z]${W}{0,255}`}|${`[a-z0-9]${W}{0,240}@[a-z]${W}{0,13}`})$`), vt = /^[ -~]{0,255}[!-~]$/, yt = /,|=/;
	}));
	Et = s$1((() => {
		bt(), xt = 32, St = 512, Ct = `,`, wt = `=`, Tt = class e {
			constructor(e) {
				this._internalState = new Map(), e && this._parse(e);
			}
			set(e, t) {
				let n = this._clone();
				return n._internalState.has(e) && n._internalState.delete(e), n._internalState.set(e, t), n;
			}
			unset(e) {
				let t = this._clone();
				return t._internalState.delete(e), t;
			}
			get(e) {
				return this._internalState.get(e);
			}
			serialize() {
				return Array.from(this._internalState.keys()).reduceRight((e, t) => (e.push(t + wt + this.get(t)), e), []).join(Ct);
			}
			_parse(e) {
				e.length > St || (this._internalState = e.split(Ct).reduceRight((e, t) => {
					let n = t.trim(), r = n.indexOf(wt);
					if (r !== -1) {
						let i = n.slice(0, r), a = n.slice(r + 1, t.length);
						ht(i) && gt(a) && e.set(i, a);
					}
					return e;
				}, new Map()), this._internalState.size > xt && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, xt))));
			}
			_keys() {
				return Array.from(this._internalState.keys()).reverse();
			}
			_clone() {
				let t = new e();
				return t._internalState = new Map(this._internalState), t;
			}
		};
	}));
	Ot = s$1((() => {
		Et();
	}));
	kt = s$1((() => {
		A(), G = k.getInstance();
	}));
	At = s$1((() => {
		v(), K = _.instance();
	}));
	Nt = s$1((() => {
		Pe(), jt = class {
			getMeter(e, t, n) {
				return Ee;
			}
		}, Mt = new jt();
	}));
	Ft = s$1((() => {
		Nt(), p$1(), v(), q = `metrics`, Pt = class e {
			constructor() {}
			static getInstance() {
				return this._instance ||= new e(), this._instance;
			}
			setGlobalMeterProvider(e) {
				return c(q, e, _.instance());
			}
			getMeterProvider() {
				return l$1(q) || Mt;
			}
			getMeter(e, t, n) {
				return this.getMeterProvider().getMeter(e, t, n);
			}
			disable() {
				u$1(q, _.instance());
			}
		};
	}));
	It = s$1((() => {
		Ft(), J = Pt.getInstance();
	}));
	Rt = s$1((() => {
		Lt = class {
			inject(e, t) {}
			extract(e, t) {
				return e;
			}
			fields() {
				return [];
			}
		};
	}));
	Ut = s$1((() => {
		A(), x(), Y = y(`OpenTelemetry Baggage Key`);
	}));
	Kt = s$1((() => {
		p$1(), Rt(), Le(), Ut(), pe(), v(), X$1 = `propagation`, Wt = new Lt(), Gt = class e {
			constructor() {
				this.createBaggage = ue, this.getBaggage = zt, this.getActiveBaggage = Bt, this.setBaggage = Vt, this.deleteBaggage = Ht;
			}
			static getInstance() {
				return this._instance ||= new e(), this._instance;
			}
			setGlobalPropagator(e) {
				return c(X$1, e, _.instance());
			}
			inject(e, t, n = D) {
				return this._getGlobalPropagator().inject(e, t, n);
			}
			extract(e, t, n = E) {
				return this._getGlobalPropagator().extract(e, t, n);
			}
			fields() {
				return this._getGlobalPropagator().fields();
			}
			disable() {
				u$1(X$1, _.instance());
			}
			_getGlobalPropagator() {
				return l$1(X$1) || Wt;
			}
		};
	}));
	qt = s$1((() => {
		Kt(), Z = Gt.getInstance();
	}));
	Yt = s$1((() => {
		p$1(), ct(), B(), Ye(), v(), Q = `trace`, Jt = class e {
			constructor() {
				this._proxyTracerProvider = new U(), this.wrapSpanContext = $e, this.isSpanContextValid = R$1, this.deleteSpan = Ke, this.getSpan = Ue, this.getActiveSpan = We, this.getSpanContext = Je, this.setSpan = Ge, this.setSpanContext = qe;
			}
			static getInstance() {
				return this._instance ||= new e(), this._instance;
			}
			setGlobalTracerProvider(e) {
				let t = c(Q, this._proxyTracerProvider, _.instance());
				return t && this._proxyTracerProvider.setDelegate(e), t;
			}
			getTracerProvider() {
				return l$1(Q) || this._proxyTracerProvider;
			}
			getTracer(e, t) {
				return this.getTracerProvider().getTracer(e, t);
			}
			disable() {
				u$1(Q, _.instance()), this._proxyTracerProvider = new U();
			}
		};
	}));
	Xt = s$1((() => {
		Yt(), $ = Jt.getInstance();
	}));
	l$2({
		DiagConsoleLogger: () => he,
		DiagLogLevel: () => h,
		INVALID_SPANID: () => M,
		INVALID_SPAN_CONTEXT: () => P,
		INVALID_TRACEID: () => N,
		ProxyTracer: () => H$1,
		ProxyTracerProvider: () => U,
		ROOT_CONTEXT: () => b$1,
		SamplingDecision: () => lt,
		SpanKind: () => dt,
		SpanStatusCode: () => pt,
		TraceFlags: () => j,
		ValueType: () => Fe,
		baggageEntryMetadataFromString: () => de,
		context: () => G,
		createContextKey: () => y,
		createNoopMeter: () => _e,
		createTraceState: () => Dt,
		default: () => Qt,
		defaultTextMapGetter: () => E,
		defaultTextMapSetter: () => D,
		diag: () => K,
		isSpanContextValid: () => R$1,
		isValidSpanId: () => Qe,
		isValidTraceId: () => Ze,
		metrics: () => J,
		propagation: () => Z,
		trace: () => $
	});
	$t = s$1((() => {
		pe(), x(), ge(), g(), Pe(), Ie(), Le(), it(), ct(), ut(), ft(), mt(), Ve(), Ot(), B(), F(), kt(), At(), It(), qt(), Xt(), Qt = {
			context: G,
			diag: K,
			metrics: J,
			propagation: Z,
			trace: $
		};
	}));
}));
var init_api = __esmMin((() => {
	init_esm_BQbQSdEk();
	g(), pe(), x(), ge(), Pe(), Ie(), Le(), Ve(), F(), B(), it(), ct(), ut(), ft(), mt(), Ot(), kt(), At(), It(), qt(), Xt(), $t();
}));
var init_dist_SjWKZevK = __esmMin((() => {}));
var init_provider = __esmMin((() => {
	init_dist_SjWKZevK();
}));
var init_run_telemetry_CKjxAGcL = __esmMin((() => {}));
var init_otel_C9RG2gHk = __esmMin((() => {
	init_esm_BQbQSdEk();
	$t();
	new TextEncoder();
	new TextDecoder();
	$t();
	$t();
}));
var l;
var init_mcp_Q3tFepWu = __esmMin((() => {
	l = {
		costUsd: `agent.usage.cost_usd`,
		inputTokens: `agent.usage.input_tokens`,
		outputTokens: `agent.usage.output_tokens`,
		cacheReadTokens: `agent.usage.cache_read_tokens`,
		cacheWriteTokens: `agent.usage.cache_write_tokens`
	};
}));
var init_delegation_nXIIGof2 = __esmMin((() => {
	init_esm_BQbQSdEk();
	$t();
}));
var init_agent_runs = __esmMin((() => {
	init_run_telemetry_CKjxAGcL();
	init_otel_C9RG2gHk();
	init_mcp_Q3tFepWu();
	init_delegation_nXIIGof2();
	new TextEncoder();
})), init_otel = __esmMin((() => {
	init_otel_C9RG2gHk();
	init_mcp_Q3tFepWu();
}));
var init_logging = __esmMin((() => {
	init_api();
	init_provider();
	init_agent_runs();
	init_otel();
}));
var init_rename_with_retry = __esmMin((() => {}));
var init_atomic_write_file = __esmMin((() => {
	init_rename_with_retry();
}));
function localTraceConversationIndexKey(e) {
	return createHash(`sha256`).update(e).digest(`hex`);
}
function localTraceConversationMarker(e) {
	return `${CONVERSATIONS_DIRECTORY}/${localTraceConversationIndexKey(e)}`;
}
function localTraceIndexedMarker() {
	return INDEXED_MARKER;
}
var INDEX_DIRECTORY, CONVERSATIONS_DIRECTORY, INDEXED_MARKER;
var init_trace_discovery_index = __esmMin((() => {
	INDEX_DIRECTORY = `index/v1`;
	CONVERSATIONS_DIRECTORY = `${INDEX_DIRECTORY}/conversations`;
	INDEXED_MARKER = `${INDEX_DIRECTORY}/indexed`;
}));
var e$1;
var init_LogRecord_CbGROCJy = __esmMin((() => {
	(function(e) {
		e[e.UNSPECIFIED = 0] = `UNSPECIFIED`, e[e.TRACE = 1] = `TRACE`, e[e.TRACE2 = 2] = `TRACE2`, e[e.TRACE3 = 3] = `TRACE3`, e[e.TRACE4 = 4] = `TRACE4`, e[e.DEBUG = 5] = `DEBUG`, e[e.DEBUG2 = 6] = `DEBUG2`, e[e.DEBUG3 = 7] = `DEBUG3`, e[e.DEBUG4 = 8] = `DEBUG4`, e[e.INFO = 9] = `INFO`, e[e.INFO2 = 10] = `INFO2`, e[e.INFO3 = 11] = `INFO3`, e[e.INFO4 = 12] = `INFO4`, e[e.WARN = 13] = `WARN`, e[e.WARN2 = 14] = `WARN2`, e[e.WARN3 = 15] = `WARN3`, e[e.WARN4 = 16] = `WARN4`, e[e.ERROR = 17] = `ERROR`, e[e.ERROR2 = 18] = `ERROR2`, e[e.ERROR3 = 19] = `ERROR3`, e[e.ERROR4 = 20] = `ERROR4`, e[e.FATAL = 21] = `FATAL`, e[e.FATAL2 = 22] = `FATAL2`, e[e.FATAL3 = 23] = `FATAL3`, e[e.FATAL4 = 24] = `FATAL4`;
	})(e$1 ||= {});
}));
var e, t, n;
var init_time_DlDfzITA = __esmMin((() => {
	(function(e) {
		e[e.DELTA = 0] = `DELTA`, e[e.CUMULATIVE = 1] = `CUMULATIVE`;
	})(e ||= {});
	(function(e) {
		e.COUNTER = `COUNTER`, e.GAUGE = `GAUGE`, e.HISTOGRAM = `HISTOGRAM`, e.UP_DOWN_COUNTER = `UP_DOWN_COUNTER`, e.OBSERVABLE_COUNTER = `OBSERVABLE_COUNTER`, e.OBSERVABLE_GAUGE = `OBSERVABLE_GAUGE`, e.OBSERVABLE_UP_DOWN_COUNTER = `OBSERVABLE_UP_DOWN_COUNTER`;
	})(t ||= {});
	(function(e) {
		e[e.HISTOGRAM = 0] = `HISTOGRAM`, e[e.EXPONENTIAL_HISTOGRAM = 1] = `EXPONENTIAL_HISTOGRAM`, e[e.GAUGE = 2] = `GAUGE`, e[e.SUM = 3] = `SUM`;
	})(n ||= {});
}));
var X;
var init_otlp_transformer = __esmMin((() => {
	init_esm_BQbQSdEk();
	init_LogRecord_CbGROCJy();
	init_time_DlDfzITA();
	$t();
	$t();
	$t();
	(function(e) {
		e[e.AGGREGATION_TEMPORALITY_UNSPECIFIED = 0] = `AGGREGATION_TEMPORALITY_UNSPECIFIED`, e[e.AGGREGATION_TEMPORALITY_DELTA = 1] = `AGGREGATION_TEMPORALITY_DELTA`, e[e.AGGREGATION_TEMPORALITY_CUMULATIVE = 2] = `AGGREGATION_TEMPORALITY_CUMULATIVE`;
	})(X ||= {}), $t();
	$t();
	$t();
}));
var init_trace_span_processor = __esmMin((() => {
	init_logging();
	init_atomic_write_file();
	init_trace_discovery_index();
	init_otlp_transformer();
}));
function parseLocalTraceSegment(e, t) {
	try {
		let n = JSON.parse(e);
		if (!isRecord$1(n) || !Array.isArray(n.resourceSpans)) return [];
		let r = [];
		for (let e of n.resourceSpans) if (isRecord$1(e) && Array.isArray(e.scopeSpans)) for (let n of e.scopeSpans) {
			if (!isRecord$1(n) || !Array.isArray(n.spans)) continue;
			let e = isRecord$1(n.scope) && typeof n.scope.name == `string` ? n.scope.name : void 0;
			for (let i of n.spans) {
				let n = parseLocalTraceSpan(i, t, e);
				n !== void 0 && r.push(n);
			}
		}
		return r;
	} catch {
		return [];
	}
}
function parseLocalTraceSpan(e, t, n) {
	if (!isRecord$1(e) || e.traceId !== t || typeof e.spanId != `string` || !/^[0-9a-f]{16}$/u.test(e.spanId) || typeof e.name != `string`) return;
	let r = parseNanos(e.startTimeUnixNano);
	let i = parseNanos(e.endTimeUnixNano);
	if (!(r === void 0 || i === void 0 || i < r)) return {
		attributes: parseAttributes(e.attributes),
		endTimeNs: i,
		events: parseEvents(e.events),
		kind: typeof e.kind == `number` ? e.kind : void 0,
		name: e.name,
		parentSpanId: typeof e.parentSpanId == `string` && /^[0-9a-f]{16}$/u.test(e.parentSpanId) ? e.parentSpanId : void 0,
		scope: n,
		spanId: e.spanId,
		startTimeNs: r,
		statusCode: parseStatusCode(e.status),
		statusMessage: parseStatusMessage(e.status),
		traceId: t
	};
}
function parseEvents(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let n of e) {
		if (!isRecord$1(n) || typeof n.name != `string`) continue;
		let e = parseNanos(n.timeUnixNano);
		e !== void 0 && t.push({
			attributes: parseAttributes(n.attributes),
			name: n.name,
			timeNs: e
		});
	}
	return t.sort((e, t) => e.timeNs === t.timeNs ? e.name.localeCompare(t.name) : e.timeNs < t.timeNs ? -1 : 1);
}
function parseAttributes(e) {
	if (!Array.isArray(e)) return {};
	let t = {};
	for (let n of e) {
		if (!isRecord$1(n) || typeof n.key != `string` || !isRecord$1(n.value)) continue;
		let e = parseAnyValue(n.value);
		e !== void 0 && (t[n.key] = e);
	}
	return t;
}
function parseAnyValue(e) {
	for (let t of [
		`stringValue`,
		`boolValue`,
		`intValue`,
		`doubleValue`
	]) if (t in e) return e[t];
	if (isRecord$1(e.arrayValue) && Array.isArray(e.arrayValue.values)) return e.arrayValue.values.filter(isRecord$1).map((e) => parseAnyValue(e));
}
function parseNanos(e) {
	if (typeof e == `string` || typeof e == `number`) try {
		let t = BigInt(e);
		return t >= 0n && t <= 18446744073709551615n ? t : void 0;
	} catch {
		return;
	}
}
function parseStatusCode(e) {
	return isRecord$1(e) ? typeof e.code == `number` ? e.code : e.code === `STATUS_CODE_ERROR` ? 2 : 0 : 0;
}
function parseStatusMessage(e) {
	if (isRecord$1(e) && typeof e.message == `string`) return e.message.length === 0 ? void 0 : e.message;
}
function isRecord$1(e) {
	return typeof e == `object` && !!e && !Array.isArray(e);
}
var init_trace_reader = __esmMin((() => {
	init_trace_span_processor();
}));
async function readTraceSources(e, t) {
	let n = await t.getSandbox();
	let r = `/traces/${e}/segments`;
	let i = await n.run({ command: `ls -1 ${r}` });
	if (i.exitCode !== 0) throw Error(`Could not list local trace segments: ${i.stderr}`);
	let a = i.stdout.split(/\r?\n/u).filter((e) => SEGMENT_FILE.test(e)).sort((e, t) => e.localeCompare(t));
	if (a.length > 500) throw Error(`Trace has ${a.length} segments (maximum 500).`);
	let o = [];
	for (let i of a) {
		if (t.abortSignal.aborted) throw Error(`Trace inspection was cancelled.`);
		let a = await n.readTextFile({ path: `${r}/${i}` });
		if (!(a === null || a.length > 8388608)) for (let t of parseLocalTraceSegment(a, e)) o.push({
			segmentFile: i,
			span: t
		});
	}
	return o;
}
function boundedText(e, t) {
	return e.length <= t ? e : `${e.slice(0, t - 1)}…`;
}
function detailFields(e) {
	return {
		arguments: e.span.attributes[`gen_ai.tool.call.arguments`],
		error: e.span.statusMessage,
		result: e.span.attributes[`gen_ai.tool.call.result`]
	};
}
var TRACE_ID, SPAN_ID, SEGMENT_FILE;
var init_trace_inspection = __esmMin((() => {
	init_trace_reader();
	TRACE_ID = /^[0-9a-f]{32}$/u;
	SPAN_ID = /^[0-9a-f]{16}$/u;
	SEGMENT_FILE = /^[0-9a-f]{16}\.otlp\.json$/u;
}));
var inspect_trace_spans_exports = __exportAll({
	default: () => inspect_trace_spans_default,
	resolveInspectTraceSpansTool: () => resolveInspectTraceSpansTool
});
function resolveInspectTraceSpansTool(e) {
	return resolveLocalOnly(e, inspectTraceSpansTool);
}
function parseInput$2(e) {
	if (typeof e != `object` || !e || Array.isArray(e)) throw Error(`Trace span inspection input must be an object.`);
	let t = e;
	if (typeof t.traceId != `string` || !TRACE_ID.test(t.traceId)) throw Error(`traceId must be a lowercase 32-character hex id.`);
	if (!Array.isArray(t.spanIds) || t.spanIds.length === 0 || t.spanIds.length > 10 || t.spanIds.some((e) => typeof e != `string` || !SPAN_ID.test(e))) throw Error(`spanIds must contain between 1 and 10 lowercase span ids.`);
	if (!Array.isArray(t.include) || t.include.length === 0 || t.include.length > FIELDS.length || t.include.some((e) => !FIELDS.includes(e))) throw Error(`include must contain arguments, result, or error.`);
	return {
		include: t.include,
		spanIds: [...new Set(t.spanIds)],
		traceId: t.traceId
	};
}
var FIELDS, inputSchema$2, inspectTraceSpansTool, inspect_trace_spans_default;
var init_inspect_trace_spans = __esmMin((() => {
	init_local_only();
	init_trace_inspection();
	FIELDS = [
		`arguments`,
		`result`,
		`error`
	];
	inputSchema$2 = {
		type: `object`,
		additionalProperties: !1,
		properties: {
			include: {
				type: `array`,
				minItems: 1,
				maxItems: FIELDS.length,
				items: {
					enum: FIELDS,
					type: `string`
				}
			},
			spanIds: {
				type: `array`,
				minItems: 1,
				maxItems: 10,
				items: {
					type: `string`,
					pattern: `^[0-9a-f]{16}$`
				}
			},
			traceId: {
				type: `string`,
				pattern: `^[0-9a-f]{32}$`
			}
		},
		required: [
			`traceId`,
			`spanIds`,
			`include`
		]
	};
	inspectTraceSpansTool = defineTool({
		description: `Return bounded arguments, results, or errors for selected spans in one trace. First use inspect_trace to choose spanIds and see availableFields.`,
		inputSchema: inputSchema$2,
		outputSchema: {
			type: `object`,
			additionalProperties: !0
		},
		async execute(e, t) {
			let { include: n, spanIds: r, traceId: i } = parseInput$2(e);
			let a = new Map((await readTraceSources(i, t)).map((e) => [e.span.spanId, e]));
			let o = 32768;
			let s = !1;
			return {
				traceId: i,
				spans: r.map((e) => {
					let t = a.get(e);
					if (t === void 0) return {
						spanId: e,
						found: !1
					};
					let r = detailFields(t);
					let c = FIELDS.filter((e) => typeof r[e] == `string`);
					let l = {};
					let u = !1;
					for (let e of n) {
						let t = r[e];
						if (typeof t != `string`) continue;
						let n = Math.min(16384, o);
						l[e] = t.slice(0, n), o -= l[e].length, t.length > n && (u = !0);
					}
					return s ||= u, {
						spanId: e,
						found: !0,
						availableFields: c,
						fields: l,
						rawPath: `/traces/${i}/segments/${t.segmentFile}`,
						truncated: u
					};
				}),
				truncated: s
			};
		}
	});
	inspect_trace_spans_default = defineLocalOnlyDynamic(inspectTraceSpansTool);
}));
function uniqueLocalTraceSpans(e) {
	let t = new Map();
	for (let n of e) t.has(n.spanId) || t.set(n.spanId, n);
	return [...t.values()];
}
function localTraceOperations(e) {
	let t = new Map(e.map((e) => [e.spanId, e]));
	let n = new Set();
	let r = [];
	for (let i of e) {
		let e = categoryFor(i);
		if (e === void 0) continue;
		let a = i.parentSpanId === void 0 ? void 0 : t.get(i.parentSpanId);
		i.attributes[`gen_ai.operation.name`] === `execute_tool` && a?.name === `agent.action` && traceToolName(a) === traceToolName(i) ? (n.add(a.spanId), r.push({
			category: e,
			span: {
				...i,
				attributes: {
					...a.attributes,
					...i.attributes
				},
				parentSpanId: a.parentSpanId,
				statusCode: a.statusCode === 2 ? a.statusCode : i.statusCode,
				statusMessage: a.statusCode === 2 ? a.statusMessage : i.statusMessage
			},
			...a.attributes[`agent.action.kind`] === `subagent-call` ? { actionDurationMs: Number(a.endTimeNs - a.startTimeNs) / 1e6 } : {}
		})) : r.push({
			category: e,
			span: i
		});
	}
	return r.filter(({ span: e }) => !n.has(e.spanId));
}
function categoryFor(e) {
	if (e.attributes[`gen_ai.operation.name`] === `chat`) return `model`;
	if (e.attributes[`gen_ai.operation.name`] === `execute_tool`) return `tool`;
	if (e.name === `agent.action`) return e.attributes[`agent.action.kind`] === `tool-call` ? `tool` : `other`;
}
function traceModelName(e) {
	return traceStringAttribute(e, `agent.model.id`) ?? traceStringAttribute(e, `gen_ai.request.model`);
}
function traceToolName(e) {
	return traceStringAttribute(e, `gen_ai.tool.name`) ?? traceStringAttribute(e, `agent.action.name`);
}
function traceSessionId(e) {
	return traceStringAttribute(e, `agent.run.id`) ?? traceStringAttribute(e, `agent.session.id`);
}
function traceStringAttribute(e, t) {
	let n = e.attributes[t];
	return typeof n == `string` && n.length > 0 ? n : void 0;
}
function summarizeLocalTrace(e, t) {
	let n = uniqueLocalTraceSpans(t);
	let r = new Set();
	let i = new Set();
	let a = new Set();
	let o = new Set();
	let s = n[0]?.startTimeNs ?? 0n;
	let c = s;
	let l$4 = 0;
	let u = 0;
	let d;
	let f = 0;
	let p = 0;
	let m = 0;
	for (let e of n) {
		if (e.startTimeNs < s && (s = e.startTimeNs), e.endTimeNs > c && (c = e.endTimeNs), add(r, traceModelName(e)), add(i, traceStringAttribute(e, `agent.name`)), add(a, traceStringAttribute(e, `gen_ai.conversation.id`)), add(o, traceSessionId(e)), e.statusCode === 2 && (f += 1), e.name !== `agent.step`) continue;
		p += numberAttribute(e, `agent.usage.input_tokens`) ?? 0, m += numberAttribute(e, `agent.usage.output_tokens`) ?? 0, l$4 += numberAttribute(e, l.cacheReadTokens) ?? numberAttribute(e, `gen_ai.usage.cache_read.input_tokens`) ?? 0, u += numberAttribute(e, l.cacheWriteTokens) ?? numberAttribute(e, `gen_ai.usage.cache_creation.input_tokens`) ?? 0;
		let t = localTraceSpanCostUsd(e);
		t !== void 0 && (d = (d ?? 0) + t);
	}
	let h = new Set();
	let g = 0;
	let _ = 0;
	for (let e of localTraceOperations(n)) e.category === `model` && (g += 1), e.category === `tool` && (_ += 1, add(h, traceToolName(e.span)));
	return {
		traceId: e,
		startedAt: new Date(Number(s / 1000000n)).toISOString(),
		durationMs: Number(c - s) / 1e6,
		spanCount: n.length,
		agentNames: [...i].sort(),
		conversationIds: [...a].sort(),
		sessionIds: [...o].sort(),
		models: [...r].sort(),
		toolNames: [...h].sort(),
		modelCalls: g,
		toolCalls: _,
		errorSpanCount: f,
		cacheReadTokens: l$4,
		cacheWriteTokens: u,
		costUsd: d,
		inputTokens: p,
		outputTokens: m
	};
}
function localTraceSpanCostUsd(e) {
	return numberAttribute(e, `gen_ai.usage.gateway_cost`) ?? numberAttribute(e, `gen_ai.usage.cost`);
}
function numberAttribute(e, t) {
	let n = e.attributes[t];
	if (typeof n == `number`) return Number.isFinite(n) && n >= 0 ? n : void 0;
	if (typeof n == `string` && n.trim() !== ``) {
		let e = Number(n);
		return Number.isFinite(e) && e >= 0 ? e : void 0;
	}
}
function add(e, t) {
	t !== void 0 && e.add(t);
}
var init_trace_summary = __esmMin((() => {
	init_otel();
}));
function analyzeLocalTrace(e, t, n = {}) {
	let r = uniqueLocalTraceSpans(t);
	let i = new Map(localTraceOperations(r).map(({ span: e }) => [e.spanId, e]));
	let a = r.filter((e) => matches(i.get(e.spanId) ?? e, n));
	let o = a.reduce((e, t) => t.startTimeNs < e ? t.startTimeNs : e, a[0]?.startTimeNs ?? 0n);
	let s = localTraceOperations(a).map((e) => recordFor(e, o)).sort((e, t) => e.startOffsetMs - t.startOffsetMs || e.endOffsetMs - t.endOffsetMs || e.spanId.localeCompare(t.spanId));
	return {
		summary: summarizeLocalTrace(e, a),
		groups: groups(s),
		modelWorkMs: sum(s, `model`),
		toolWorkMs: sum(s, `tool`),
		records: s
	};
}
function matches(e, t) {
	let n = traceSessionId(e);
	let r = traceStringAttribute(e, `agent.turn.id`);
	if (t.excludeSessionId !== void 0 && n === t.excludeSessionId || t.sessionId !== void 0 && n !== t.sessionId || t.turnId !== void 0 && r !== t.turnId) return !1;
	let i = Number(e.startTimeNs / 1000000n);
	return (t.fromMs === void 0 || i >= t.fromMs) && (t.toMs === void 0 || i <= t.toMs);
}
function recordFor(e, t) {
	let { span: n, category: r } = e;
	let i = {
		category: r,
		durationMs: Number(n.endTimeNs - n.startTimeNs) / 1e6,
		endOffsetMs: Number(n.endTimeNs - t) / 1e6,
		outcome: n.statusCode === 2 ? `failed` : `completed`,
		spanId: n.spanId,
		startOffsetMs: Number(n.startTimeNs - t) / 1e6
	};
	let a = traceStringAttribute(n, `gen_ai.tool.call.id`);
	let o = traceModelName(n);
	let s = traceSessionId(n);
	let c = traceToolName(n);
	let l = traceStringAttribute(n, `agent.turn.id`);
	if (a !== void 0 && (i.callId = a), n.statusMessage !== void 0 && (i.error = n.statusMessage), o !== void 0 && (i.model = o), n.parentSpanId !== void 0 && (i.parentSpanId = n.parentSpanId), s !== void 0 && (i.sessionId = s), c !== void 0 && r === `tool` && (i.toolName = c), c !== void 0 && r === `other` && (i.actionName = c), l !== void 0 && (i.turnId = l), e.actionDurationMs !== void 0 && (i.actionDurationMs = e.actionDurationMs), r === `model`) {
		let e = {};
		for (let [t, r] of Object.entries({
			inputTokens: `gen_ai.usage.input_tokens`,
			outputTokens: `gen_ai.usage.output_tokens`,
			cacheReadTokens: `gen_ai.usage.cache_read.input_tokens`,
			cacheWriteTokens: `gen_ai.usage.cache_write.input_tokens`
		})) {
			let i = n.attributes[r];
			typeof i == `number` && Number.isFinite(i) && i >= 0 && (e[t] = i);
		}
		Object.keys(e).length > 0 && (i.usage = e);
	}
	return i;
}
function groups(e) {
	let t = new Map();
	for (let n of e) {
		let e = JSON.stringify([n.sessionId, n.turnId]);
		let r = t.get(e);
		r === void 0 && (r = {
			modelCalls: 0,
			modelWorkMs: 0,
			toolCalls: 0,
			toolWorkMs: 0
		}, n.sessionId !== void 0 && (r.sessionId = n.sessionId), n.turnId !== void 0 && (r.turnId = n.turnId), t.set(e, r)), n.category === `model` && (r.modelCalls += 1, r.modelWorkMs += n.durationMs), n.category === `tool` && (r.toolCalls += 1, r.toolWorkMs += n.durationMs);
	}
	return [...t.values()];
}
function sum(e, t) {
	return e.reduce((e, n) => e + (n.category === t ? n.durationMs : 0), 0);
}
var init_trace_analysis = __esmMin((() => {
	init_trace_summary();
}));
var inspect_trace_exports = __exportAll({
	default: () => inspect_trace_default,
	resolveInspectTraceTool: () => resolveInspectTraceTool
});
function resolveInspectTraceTool(e) {
	return resolveLocalOnly(e, inspectTraceTool);
}
function parseInput$1(e) {
	if (typeof e != `object` || !e || Array.isArray(e)) throw Error(`Trace inspection input must be an object.`);
	let t = e;
	if (typeof t.traceId != `string` || !TRACE_ID.test(t.traceId)) throw Error(`traceId must be a lowercase 32-character hex id.`);
	if (t.limit !== void 0 && (typeof t.limit != `number` || !Number.isInteger(t.limit) || t.limit < 1 || t.limit > 200)) throw Error(`limit must be an integer between 1 and 200.`);
	if (t.offset !== void 0 && (typeof t.offset != `number` || !Number.isInteger(t.offset) || t.offset < 0 || t.offset > MAX_OFFSET)) throw Error(`offset must be an integer between 0 and ${MAX_OFFSET}.`);
	return {
		limit: t.limit ?? 40,
		offset: t.offset ?? 0,
		traceId: t.traceId
	};
}
function boundedRecord(e) {
	return e.error === void 0 ? e : {
		...e,
		error: boundedText(e.error, 500)
	};
}
var MAX_OFFSET, inspectTraceTool, inspect_trace_default;
var init_inspect_trace = __esmMin((() => {
	init_local_only();
	init_trace_inspection();
	init_trace_analysis();
	MAX_OFFSET = 1e5;
	inspectTraceTool = defineTool({
		description: `Inspect one trace as a bounded structural timeline. Use offset to page through larger traces. Tool records include a short argument preview and availableFields; use inspect_trace_spans only for selected raw tool payloads.`,
		inputSchema: {
			type: `object`,
			additionalProperties: !1,
			properties: {
				limit: {
					type: `integer`,
					minimum: 1,
					maximum: 200
				},
				offset: {
					type: `integer`,
					minimum: 0,
					maximum: MAX_OFFSET,
					description: `Zero-based record offset for paging through larger traces.`
				},
				traceId: {
					type: `string`,
					pattern: `^[0-9a-f]{32}$`
				}
			},
			required: [`traceId`]
		},
		outputSchema: {
			type: `object`,
			additionalProperties: !0
		},
		async execute(e, t) {
			let { limit: n, offset: r, traceId: i } = parseInput$1(e);
			let a = await readTraceSources(i, t);
			let o = analyzeLocalTrace(i, a.map(({ span: e }) => e));
			let s = new Map(a.map((e) => [e.span.spanId, e]));
			let c = o.records.slice(r, r + n).map((e) => {
				let t = s.get(e.spanId);
				let n = t === void 0 ? void 0 : detailFields(t);
				let r = n === void 0 ? [] : [
					`arguments`,
					`result`,
					`error`
				].filter((e) => typeof n[e] == `string`);
				let i = n?.arguments;
				return {
					...boundedRecord(e),
					availableFields: r,
					...e.category === `tool` && typeof i == `string` ? { argumentsPreview: boundedText(i, 200) } : {}
				};
			});
			return {
				traceId: i,
				offset: r,
				timeline: c,
				summary: o.summary,
				modelWorkMs: o.modelWorkMs,
				toolWorkMs: o.toolWorkMs,
				groups: o.groups,
				total: o.records.length,
				hasMore: r + c.length < o.records.length,
				truncated: r + c.length < o.records.length
			};
		}
	});
	inspect_trace_default = defineLocalOnlyDynamic(inspectTraceTool);
}));
async function withSelfModificationWorkspaceLock(e, t) {
	let n = workspaceTails.get(e) ?? Promise.resolve();
	let r;
	let i = new Promise((e) => {
		r = e;
	});
	let a = n.then(() => i);
	workspaceTails.set(e, a), await n;
	try {
		return await t();
	} finally {
		r(), workspaceTails.get(e) === a && workspaceTails.delete(e);
	}
}
var workspaceTails;
var init_workspace_lock = __esmMin((() => {
	workspaceTails = new Map();
}));
function classifyCatalogEntry(e) {
	return e.selfModificationMount === !0 ? {
		kind: `self-modification-mount`,
		reason: `Installing a registry item cannot replace the self-modification subagent's own mount. Edit its authored mount directly instead.`
	} : e.declaresSetup === !0 ? {
		kind: `needs-terminal`,
		reason: `${e.address} declares a setup flow, which can ask for credentials or open a browser authorization. Neither can be answered from a chat turn.`
	} : { kind: `installable` };
}
function terminateChildTree(e, t) {
	if (e.pid !== void 0) {
		if (process.platform === `win32`) {
			let n = process.env.SystemRoot ?? process.env.WINDIR;
			if (n !== void 0 && n !== `` && spawnSync(resolve(n, `System32`, `taskkill.exe`), [
				`/pid`,
				String(e.pid),
				`/t`,
				...t === `SIGKILL` ? [`/f`] : []
			], {
				stdio: `ignore`,
				windowsHide: !0
			}).status === 0) return;
		} else try {
			process.kill(-e.pid, t);
			return;
		} catch {}
	}
	e.kill(t);
}
function isChildTreeAlive(e) {
	if (process.platform === `win32` || e.pid === void 0) return !1;
	try {
		return process.kill(-e.pid, 0), !0;
	} catch {
		return !1;
	}
}
async function resolveEveExecutable(e) {
	let t = findPackageJSON(`eve`, pathToFileURL(resolve(e, `package.json`)));
	if (t === void 0) throw Error(`The "eve" package is not installed under ${e}, so registry items cannot be installed from here.`);
	let n = dirname(t);
	let r = JSON.parse(await readFile(t, `utf8`));
	let i = typeof r == `object` && r ? r.bin : void 0;
	let a = typeof i == `string` ? i : typeof i == `object` && i ? i.eve : void 0;
	if (typeof a != `string` || a.length === 0) throw Error(`The installed "eve" package does not declare an "eve" binary.`);
	let o = resolve(n, a);
	let s = relative(n, o);
	if (s.startsWith(`..`) || isAbsolute(s)) throw Error(`The installed "eve" package declares its binary outside the package.`);
	return o;
}
function readTerminalHeadlessEvent(e) {
	let t;
	for (let n of e.split(`
`)) {
		let e = n.trim();
		if (!e.startsWith(`{`)) continue;
		let r;
		try {
			r = JSON.parse(e);
		} catch {
			continue;
		}
		if (typeof r != `object` || !r) continue;
		let i = r;
		i.version === 1 && (i.type === `completed` || i.type === `blocked` || i.type === `failed` || i.type === `cancelled` || i.type === `external_action`) && (t = i);
	}
	return t;
}
async function runEveAdd(e) {
	let t = await resolveEveExecutable(e.appRoot);
	let n = e.spawn ?? spawn;
	return await new Promise((r) => {
		let i = n(process.execPath, [
			t,
			`add`,
			e.address,
			`--non-interactive`,
			`--skip-setup`
		], {
			cwd: e.appRoot,
			detached: process.platform !== `win32`,
			env: process.env,
			stdio: [
				`ignore`,
				`pipe`,
				`pipe`
			]
		});
		let a = ``;
		let collect = (e) => {
			a = `${a}${String(e)}`.slice(-64e3);
		};
		i.stdout?.on(`data`, collect), i.stderr?.on(`data`, collect);
		let o = !1;
		let s;
		let c;
		let l;
		let finish = (t) => {
			o || (o = !0, clearTimeout(u), c !== void 0 && clearTimeout(c), l !== void 0 && clearTimeout(l), e.signal?.removeEventListener(`abort`, abort), r(t));
		};
		let finishAfterTreeExits = (e) => {
			isChildTreeAlive(i) ? (l = setTimeout(() => finishAfterTreeExits(e), 25), l.unref?.()) : finish(s ?? e);
		};
		let stop = (e) => {
			s === void 0 && (s = e, terminateChildTree(i, `SIGTERM`), c = setTimeout(() => terminateChildTree(i, `SIGKILL`), 5e3), c.unref?.());
		};
		let abort = () => {
			stop({
				kind: `failed`,
				message: `Installing ${e.address} was cancelled.`
			});
		};
		let u = setTimeout(() => {
			stop({
				kind: `failed`,
				message: `Installing ${e.address} did not finish within ${INSTALL_TIMEOUT_MS / 6e4} minutes.`
			});
		}, INSTALL_TIMEOUT_MS);
		u.unref?.(), e.signal?.aborted === !0 ? abort() : e.signal?.addEventListener(`abort`, abort, { once: !0 }), i.on(`error`, () => {
			stop({
				kind: `failed`,
				message: `Could not run \`eve add ${e.address}\`. Run the command in a terminal for details.`
			});
		}), i.on(`close`, (t) => {
			let n;
			let r = readTerminalHeadlessEvent(a);
			if (t === 0 && r?.type === `completed` && r.item === e.address) n = { kind: `installed` };
			else if (r?.type === `blocked` && r.item === e.address) n = {
				kind: `blocked`,
				message: `Installing ${e.address} stopped for input that only a terminal can supply.`
			};
			else if (r?.type === `failed` && r.item === e.address && typeof r.message == `string`) {
				let e = r.failureCode === `pnpm_build_policy` ? "Dependency installation stopped because pnpm requires build-script decisions. Run `pnpm approve-builds`, then retry the eve add command." : `Dependency installation failed. Retry the eve add command in a terminal for details.`;
				let t = Array.isArray(r.changed) ? r.changed.filter((e) => typeof e == `string` && e.length <= 300 && !e.includes(`..`) && /^[\w@+./ -]+$/u.test(e)) : [];
				let i = r.rolledBack === !0 ? `${e} Project files were restored.` : t.length === 0 ? `${e} The install may have partially changed the project.` : `${e} The install partially changed: ${t.join(`, `)}. Restore those files, then retry.`;
				n = t.length === 0 ? {
					kind: `failed`,
					message: i
				} : {
					kind: `failed`,
					message: i,
					changed: t
				};
			} else n = {
				kind: `failed`,
				message: `\`eve add ${e.address}\` failed and may have partially changed the project. Run it in a terminal for details.`
			};
			finishAfterTreeExits(n);
		});
	});
}
var INSTALL_TIMEOUT_MS;
var init_eve_add = __esmMin((() => {
	INSTALL_TIMEOUT_MS = 6e5;
}));
var search_registry_exports = __exportAll({
	clearRegistryIndexCache: () => clearRegistryIndexCache,
	default: () => search_registry_default,
	loadRegistryIndex: () => loadRegistryIndex,
	officialRegistryIndexUrl: () => officialRegistryIndexUrl,
	parseRegistryIndex: () => parseRegistryIndex,
	resolveRegistryIndexUrl: () => resolveRegistryIndexUrl,
	selectIntegrationPage: () => selectIntegrationPage,
	selectIntegrations: () => selectIntegrations
});
function isRecord(e) {
	return typeof e == `object` && !!e && !Array.isArray(e);
}
function optionalString(e) {
	return typeof e == `string` && e.length > 0 ? e : void 0;
}
function isCategory(e) {
	return CATEGORIES.includes(e);
}
function categoryOf(e) {
	let t = e.split(`/`)[0];
	return t !== void 0 && e.includes(`/`) && isCategory(t) ? t : void 0;
}
function titleFromAddress(e) {
	return (e.split(`/`).at(-1) ?? e).split(`-`).map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(` `);
}
function eveMetadata(e) {
	let t = e.meta;
	if (!isRecord(t)) return {};
	let n = t.eve;
	return isRecord(n) ? n : {};
}
function targetsSelfModificationMount(e) {
	return e === `${SELF_MODIFICATION_MOUNT}.ts` || e.startsWith(`${SELF_MODIFICATION_MOUNT}/`);
}
function authoredTargetOf(e) {
	let t = e.files;
	if (Array.isArray(t)) for (let e of t) {
		if (!isRecord(e)) continue;
		let t = optionalString(e.target);
		if (t?.startsWith(`agent/`) === !0) return t;
	}
}
function targetsSelfModificationMountOf(e) {
	let t = e.files;
	return Array.isArray(t) && t.some((e) => isRecord(e) && targetsSelfModificationMount(optionalString(e.target) ?? ``));
}
function declaredEnvVars(e) {
	let t = e.envVars;
	return isRecord(t) ? Object.keys(t) : [];
}
function parseRegistryIndex(e) {
	if (!isRecord(e) || !Array.isArray(e.items)) return [];
	let t = [];
	for (let n of e.items) {
		if (!isRecord(n)) continue;
		let e = optionalString(n.name);
		if (e === void 0) continue;
		let r = eveMetadata(n);
		if (r.hidden === !0) continue;
		let i = authoredTargetOf(n);
		let a = {
			address: e,
			title: optionalString(n.title) ?? titleFromAddress(e)
		};
		let o = categoryOf(e);
		o !== void 0 && (a.category = o);
		let s = optionalString(n.description);
		s !== void 0 && (a.description = s);
		let c = optionalString(r.requires);
		c !== void 0 && (a.requires = c), i !== void 0 && (a.authoredTarget = i), r.setup !== void 0 && r.setup !== null && (a.declaresSetup = !0), targetsSelfModificationMountOf(n) && (a.selfModificationMount = !0);
		let l = declaredEnvVars(n);
		l.length > 0 && (a.envVars = l), t.push(a);
	}
	return t;
}
function selectIntegrations(e) {
	return selectIntegrationPage(e).items;
}
function selectIntegrationPage(e) {
	let t = Math.min(Math.max(e.limit ?? 10, 1), 25);
	let n = Math.max(e.offset ?? 0, 0);
	let r = (e.query ?? ``).toLowerCase().split(/\s+/u).filter((e) => e.length > 0);
	let i = e.entries.map((e, t) => {
		let n = `${e.address} ${e.title}`.toLowerCase();
		return {
			entry: e,
			haystack: [n, e.description ?? ``].join(` `).toLowerCase(),
			index: t,
			primaryTerms: n
		};
	});
	let a = new Map(r.map((e) => {
		let t = i.filter(({ haystack: t }) => t.includes(e)).length;
		return [e, Math.log((i.length + 1) / (t + 1)) + 1];
	}));
	let o = i.map(({ entry: t, haystack: n, index: i, primaryTerms: o }) => {
		if (e.category !== void 0 && !matchesCategory(t, e.category)) return;
		if (r.length === 0) return {
			entry: t,
			index: i,
			score: 0
		};
		let s = r.reduce((e, t) => {
			let r = a.get(t) ?? 0;
			return o.includes(t) ? e + 2 * r : n.includes(t) ? e + r : e;
		}, 0);
		return s > 0 ? {
			entry: t,
			index: i,
			score: s
		} : void 0;
	}).filter((e) => e !== void 0).sort((e, t) => t.score - e.score || e.index - t.index);
	let s = (o[0]?.score ?? 0) * .4;
	let c = o.filter(({ score: e }) => e >= s);
	let l = c.slice(n, n + t).map(({ entry: e }) => {
		let t = {
			address: e.address,
			title: e.title
		};
		return e.category !== void 0 && (t.category = e.category), e.description !== void 0 && (t.description = e.description), e.requires !== void 0 && (t.requires = e.requires), t;
	});
	let u = n + l.length;
	let d = {
		hasMore: u < c.length,
		items: l,
		total: c.length
	};
	return u < c.length && (d.nextOffset = u), d;
}
function matchesCategory(e, t) {
	return e.category === t;
}
function officialRegistryIndexUrl() {
	return `https://eve.dev/r${INDEX_PATH}`;
}
function resolveRegistryIndexUrl(e = process.env.EVE_DEV_OFFICIAL_REGISTRY_URL) {
	if (e === void 0) return officialRegistryIndexUrl();
	let t;
	try {
		t = new URL(e);
	} catch {
		throw Error(`EVE_DEV_OFFICIAL_REGISTRY_URL must be an HTTP(S) URL.`);
	}
	if (t.protocol !== `http:` && t.protocol !== `https:`) throw Error(`EVE_DEV_OFFICIAL_REGISTRY_URL must be an HTTP(S) URL.`);
	if (t.username !== `` || t.password !== ``) throw Error(`EVE_DEV_OFFICIAL_REGISTRY_URL must not include credentials.`);
	if (t.search !== `` || t.hash !== ``) throw Error(`EVE_DEV_OFFICIAL_REGISTRY_URL must not include a query or fragment.`);
	return t.pathname = `${t.pathname.replace(/\/+$/u, ``)}${INDEX_PATH}`, t.toString();
}
function clearRegistryIndexCache() {
	cache = void 0;
}
async function loadRegistryIndex(e) {
	if (cache !== void 0 && cache.url === e.url && e.nowMs - cache.fetchedAtMs < 3e5) return cache.entries;
	let t = await fetch(e.url, {
		headers: { accept: `application/json` },
		signal: AbortSignal.any(e.signal === void 0 ? [AbortSignal.timeout(FETCH_TIMEOUT_MS)] : [e.signal, AbortSignal.timeout(FETCH_TIMEOUT_MS)])
	});
	if (!t.ok) throw Error(`Could not read the eve registry (${t.status}).`);
	let n = parseRegistryIndex(await t.json());
	return cache = {
		entries: n,
		fetchedAtMs: e.nowMs,
		url: e.url
	}, n;
}
async function annotateInstalled(e) {
	let t = new Map(e.entries.flatMap((e) => e.authoredTarget === void 0 ? [] : [[e.address, e.authoredTarget]]));
	if (e.rows.every((e) => t.get(e.address) === void 0)) return e.rows;
	let n;
	try {
		n = await e.ctx.getSandbox();
	} catch {
		return e.rows;
	}
	return await Promise.all(e.rows.map(async (e) => {
		let r = t.get(e.address);
		if (r === void 0) return e;
		let i = `/source/${r.slice(6)}`;
		try {
			let t = await n.readTextFile({ path: i });
			return {
				...e,
				installed: t !== null
			};
		} catch {
			return e;
		}
	}));
}
function errorMessage(e) {
	return e instanceof Error ? e.message : String(e);
}
var CATEGORIES, INDEX_PATH, FETCH_TIMEOUT_MS, SELF_MODIFICATION_MOUNT, inputSchema$1, outputSchema$1, cache, search_registry_default;
var init_search_registry = __esmMin((() => {
	CATEGORIES = [
		`channel`,
		`connection`,
		`extension`,
		`instrumentation`,
		`memory`
	];
	INDEX_PATH = `/registry.json`;
	FETCH_TIMEOUT_MS = 1e4;
	SELF_MODIFICATION_MOUNT = `agent/extensions/self-modification`;
	inputSchema$1 = {
		type: `object`,
		additionalProperties: !1,
		properties: {
			query: {
				type: `string`,
				maxLength: 200,
				description: `Free-text match against integration names, titles, and descriptions.`
			},
			category: {
				type: `string`,
				enum: [...CATEGORIES],
				description: `Restrict results to one registry category.`
			},
			limit: {
				type: `integer`,
				minimum: 1,
				maximum: 25,
				description: `Maximum number of items to return (default 10, maximum 25).`
			},
			offset: {
				type: `integer`,
				minimum: 0,
				description: `Number of matching items to skip. Use nextOffset from a prior result to retrieve the next page.`
			}
		}
	};
	outputSchema$1 = {
		type: `object`,
		additionalProperties: !1,
		properties: {
			items: {
				type: `array`,
				items: {
					type: `object`,
					additionalProperties: !1,
					properties: {
						address: { type: `string` },
						title: { type: `string` },
						description: { type: `string` },
						category: { type: `string` },
						requires: { type: `string` },
						installed: { type: `boolean` }
					},
					required: [`address`, `title`]
				}
			},
			errors: {
				type: `array`,
				items: {
					type: `object`,
					additionalProperties: !1,
					properties: {
						registry: { type: `string` },
						message: { type: `string` }
					},
					required: [`registry`, `message`]
				}
			},
			total: { type: `integer` },
			hasMore: { type: `boolean` },
			nextOffset: { type: `integer` }
		},
		required: [
			`items`,
			`errors`,
			`total`,
			`hasMore`
		]
	};
	search_registry_default = defineTool({
		description: "Search the eve registry for integrations this project can add: channels, MCP connections, extensions, memory providers, and observability. Read-only — it installs nothing. Call it before writing an integration by hand, then pass an exact item address (for example `channel/slack`) to registry_add.",
		inputSchema: inputSchema$1,
		outputSchema: outputSchema$1,
		async execute(e, t) {
			let n = [];
			let r;
			try {
				r = resolveRegistryIndexUrl();
			} catch (e) {
				return {
					errors: [{
						message: errorMessage(e),
						registry: `eve`
					}],
					hasMore: !1,
					items: [],
					total: 0
				};
			}
			let i = [];
			try {
				i = await loadRegistryIndex({
					nowMs: Date.now(),
					signal: t.abortSignal,
					url: r
				});
			} catch (e) {
				n.push({
					message: errorMessage(e),
					registry: r
				});
			}
			let a = { entries: i.filter((e) => e.selfModificationMount !== !0) };
			let o = typeof e.category == `string` ? e.category : void 0;
			o !== void 0 && isCategory(o) && (a.category = o), typeof e.limit == `number` && (a.limit = e.limit), typeof e.offset == `number` && (a.offset = e.offset), typeof e.query == `string` && (a.query = e.query);
			let s = selectIntegrationPage(a);
			let c = {
				errors: n,
				hasMore: s.hasMore,
				items: await annotateInstalled({
					ctx: t,
					entries: i,
					rows: s.items
				}),
				total: s.total
			};
			return s.nextOffset !== void 0 && (c.nextOffset = s.nextOffset), c;
		}
	});
}));
var registry_add_exports = __exportAll({
	addLocalRegistryItem: () => addLocalRegistryItem,
	default: () => registry_add_default,
	handoffMessage: () => handoffMessage,
	resolveRegistryAddTool: () => resolveRegistryAddTool,
	unsetEnvVars: () => unsetEnvVars
});
function unsetEnvVars(e, t = process.env) {
	return (e.envVars ?? []).filter((e) => {
		let n = t[e];
		return n === void 0 || n === ``;
	});
}
function handoffMessage(e) {
	if (e.interactiveClient) return { message: `${e.title} has not been installed yet. ${e.reason} Its setup panel opens after this reply, asks for anything setup needs, and reports whether setup succeeded; tell the developer to complete it there, and do not describe ${e.title} as added, connected, or set up. Do not ask the developer to run another command.` };
	let t = `eve add ${e.address}`;
	return {
		message: `${e.title} was not installed. ${e.reason} Run \`${t}\` in a terminal to finish it.`,
		nextCommand: t
	};
}
async function addLocalRegistryItem(e, t = {}) {
	let n = (t.getCapability ?? getLocalDevCapability)();
	if (n === void 0) throw Error("Registry items can only be installed while `eve dev` is running. Report the item address to the developer instead of installing it.");
	let r = (await loadRegistryIndex({
		nowMs: Date.now(),
		signal: t.signal,
		url: resolveRegistryIndexUrl()
	})).find((t) => t.address === e);
	if (r === void 0) throw Error(`No item in the configured eve registry is published at "${e}". Check the address before trying again.`);
	let i = classifyCatalogEntry(r);
	if (i.kind === `self-modification-mount`) throw Error(i.reason);
	if (i.kind === `needs-terminal`) {
		let t = handoffMessage({
			address: e,
			interactiveClient: n.interactiveClient,
			reason: i.reason,
			title: r.title
		});
		return {
			address: e,
			reason: i.reason,
			status: `needs-terminal`,
			title: r.title,
			...t
		};
	}
	let a = await withSelfModificationWorkspaceLock(`local:${n.appRoot}`, async () => n.withSuspendedSource(() => runEveAdd({
		address: e,
		appRoot: n.appRoot,
		signal: t.signal,
		spawn: t.spawn
	})));
	if (a.kind === `blocked`) {
		let t = handoffMessage({
			address: e,
			interactiveClient: n.interactiveClient,
			reason: a.message,
			title: r.title
		});
		return {
			address: e,
			reason: a.message,
			status: `needs-terminal`,
			title: r.title,
			...t
		};
	}
	if (a.kind === `failed`) return a.changed === void 0 ? {
		address: e,
		status: `failed`,
		title: r.title,
		reason: a.message,
		message: a.message
	} : {
		address: e,
		status: `failed`,
		title: r.title,
		reason: a.message,
		message: a.message,
		changed: a.changed
	};
	let o = unsetEnvVars(r);
	return {
		address: e,
		envVars: [...o],
		message: o.length === 0 ? `Installed ${r.title}.` : `Installed ${r.title}. It will not work until ${o.join(`, `)} ${o.length === 1 ? `is` : `are`} set.`,
		status: `installed`,
		title: r.title
	};
}
function localRegistryAddTool() {
	return defineTool({
		description: `Install an item from the configured eve registry into this project. Items that need setup are handed to the local setup flow instead. Search first, then call this with the exact item address.`,
		inputSchema: localInputSchema,
		outputSchema: localOutputSchema,
		async execute(e, t) {
			let { address: n } = e;
			if (typeof n != `string` || n.length === 0) throw Error(`address must be an exact item address from the configured eve registry.`);
			return await addLocalRegistryItem(n, { signal: t.abortSignal });
		}
	});
}
function resolveRegistryAddTool(e) {
	return resolveLocalOnly(e, localRegistryAddTool());
}
var localInputSchema, localOutputSchema, registry_add_default;
var init_registry_add = __esmMin((() => {
	init_workspace_lock();
	init_eve_add();
	init_local_only();
	init_search_registry();
	localInputSchema = {
		type: `object`,
		additionalProperties: !1,
		properties: { address: {
			type: `string`,
			minLength: 1,
			maxLength: 200,
			description: "Exact address of an item in the configured eve registry, for example `channel/slack` or `extension/browserbase`."
		} },
		required: [`address`]
	};
	localOutputSchema = {
		type: `object`,
		additionalProperties: !1,
		properties: {
			status: {
				type: `string`,
				enum: [
					`installed`,
					`needs-terminal`,
					`failed`
				]
			},
			address: { type: `string` },
			title: { type: `string` },
			envVars: {
				type: `array`,
				items: { type: `string` },
				description: `Environment variables the item needs that are not set. The item is installed but will not work until the developer sets them. Never ask for or repeat their values.`
			},
			reason: {
				type: `string`,
				description: `Why the item was not installed here.`
			},
			changed: {
				type: `array`,
				items: { type: `string` },
				description: `Project-relative paths a failed install could not restore.`
			},
			nextCommand: {
				type: `string`,
				description: "The command that completes a `needs-terminal` item."
			},
			message: {
				type: `string`,
				description: `One-line summary to relay to the developer.`
			}
		},
		required: [
			`status`,
			`address`,
			`message`
		]
	};
	registry_add_default = defineLocalOnlyDynamic(localRegistryAddTool());
}));
var init_package_name = __esmMin((() => {}));
var init_stamped_package_version = __esmMin((() => {}));
function resolveCurrentModulePath() {
	return typeof __filename == `string` && isAbsolute(__filename) ? __filename : resolveCurrentModulePathFromStack();
}
function resolveCurrentModulePathFromStack() {
	let e = Error.prepareStackTrace;
	try {
		Error.prepareStackTrace = (e, t) => t;
		let e = Error().stack?.[0]?.getFileName();
		if (typeof e != `string` || e.length === 0) throw Error(`Failed to resolve the current module path from the stack trace.`);
		return e.startsWith(`file:`) ? fileURLToPath(e) : e;
	} finally {
		Error.prepareStackTrace = e;
	}
}
var WORKFLOW_SOURCE_MODULE_ALIASES, WORKFLOW_MODULE_ALIASES;
var init_package = __esmMin((() => {
	init_package_name();
	init_stamped_package_version();
	WORKFLOW_SOURCE_MODULE_ALIASES = {
		"eve/workflow": `src/internal/workflow/index.ts`,
		workflow: `src/internal/workflow/index.ts`,
		"eve/workflow/api": `src/public/workflow/api.ts`,
		"workflow/api": `src/internal/workflow/runtime.ts`,
		"workflow/runtime": `src/internal/workflow/runtime.ts`,
		"workflow/internal/builtins": `src/internal/workflow/builtins.ts`
	};
	WORKFLOW_MODULE_ALIASES = {
		"workflow/errors": `src/compiled/@workflow/errors/index.js`,
		"workflow/internal/private": `src/compiled/@workflow/core/private.js`
	};
	[...Object.keys(WORKFLOW_SOURCE_MODULE_ALIASES), ...Object.keys(WORKFLOW_MODULE_ALIASES)];
	createRequire(resolveCurrentModulePath());
}));
var init_user_agent = __esmMin((() => {
	init_package();
})), GATEWAY_BASE_URL, AI_GATEWAY_MODELS_URL;
var init_gateway = __esmMin((() => {
	init_user_agent();
	GATEWAY_BASE_URL = `https://ai-gateway.vercel.sh`;
	AI_GATEWAY_MODELS_URL = `${GATEWAY_BASE_URL}/v1/models`;
}));
function parseGatewayModelCatalog(e) {
	let t = gatewayCatalogSchema.safeParse(e);
	if (!t.success) throw Error(`AI Gateway returned an invalid model catalog.`);
	return t.data;
}
var gatewayReasoningEffortSchema, gatewayCatalogModelSchema, gatewayCatalogSchema;
var init_gateway_model_catalog = __esmMin((() => {
	init_zod();
	gatewayReasoningEffortSchema = Fc.object({
		type: Fc.literal(`effort`),
		values: Fc.array(Fc.string()).catch([])
	});
	gatewayCatalogModelSchema = Fc.object({
		id: Fc.string(),
		name: Fc.string(),
		type: Fc.string(),
		owned_by: Fc.string(),
		released: Fc.number().finite().optional().catch(void 0),
		tags: Fc.array(Fc.string()).optional().catch(void 0),
		reasoning_options: Fc.array(Fc.unknown()).optional().catch(void 0),
		pricing: Fc.object({ service_tiers: Fc.record(Fc.string(), Fc.unknown()).optional().catch(void 0) }).optional().catch(void 0)
	}).transform(({ reasoning_options: e, ...t }) => ({
		...t,
		reasoningEfforts: e?.flatMap((e) => {
			let t = gatewayReasoningEffortSchema.safeParse(e);
			return t.success ? t.data.values : [];
		}) ?? []
	}));
	gatewayCatalogSchema = Fc.object({ data: Fc.array(Fc.unknown()) }).transform(({ data: e }) => e.flatMap((e) => {
		let t = gatewayCatalogModelSchema.safeParse(e);
		return t.success ? [t.data] : [];
	}));
}));
var search_models_exports = __exportAll({
	default: () => search_models_default,
	searchGatewayModels: () => searchGatewayModels
});
function searchGatewayModels(e, t) {
	let n = t.trim().toLowerCase();
	return e.filter((e) => e.type === `language` && (e.id === "openai/gpt-6-luna-fast" || e.tags?.includes(`web-search`)) && (e.id.toLowerCase().includes(n) || e.name.toLowerCase().includes(n))).slice(0, 20).map((e) => ({
		id: e.id,
		name: e.name,
		provider: e.id.split(`/`)[0] ?? ``
	}));
}
var inputSchema, outputSchema, search_models_default;
var init_search_models = __esmMin((() => {
	init_default_agent_model();
	init_gateway();
	init_gateway_model_catalog();
	inputSchema = {
		type: `object`,
		additionalProperties: !1,
		properties: { query: {
			type: `string`,
			minLength: 1,
			maxLength: 100,
			description: `A full model ID, model name, or short name such as 'luna'.`
		} },
		required: [`query`]
	};
	outputSchema = {
		type: `object`,
		additionalProperties: !1,
		properties: { models: {
			type: `array`,
			items: {
				type: `object`,
				additionalProperties: !1,
				properties: {
					id: { type: `string` },
					name: { type: `string` },
					provider: { type: `string` }
				},
				required: [
					`id`,
					`name`,
					`provider`
				]
			}
		} },
		required: [`models`]
	};
	search_models_default = defineTool({
		description: `Search the Vercel AI Gateway model catalog. Call this to list available AI Gateway models or resolve a model to its exact ID.`,
		inputSchema,
		outputSchema,
		async execute(e, t) {
			if (typeof e.query != `string`) throw Error(`Expected a model search query.`);
			let n = new AbortController();
			let r = setTimeout(() => n.abort(), 5e3);
			try {
				let r = AbortSignal.any([t.abortSignal, n.signal]);
				let i = await fetch(AI_GATEWAY_MODELS_URL, { signal: r });
				if (!i.ok) throw Error(`AI Gateway model catalog request failed (${i.status}).`);
				return { models: searchGatewayModels(parseGatewayModelCatalog(await i.json()), e.query) };
			} finally {
				clearTimeout(r);
			}
		}
	});
}));
function readConversationId(e) {
	if (!(typeof e != `string` || e.length === 0 || e.length > MAX_ID_BYTES || /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(e) || encoder.encode(e).byteLength > MAX_ID_BYTES)) try {
		return encodeURIComponent(e), e;
	} catch {
		return;
	}
}
function resolveConversationId(e) {
	return readConversationId(contextStorage.getStore()?.get(ConversationIdKey)) ?? e;
}
var MAX_ID_BYTES, encoder;
var init_conversation_identity = __esmMin((() => {
	init_container();
	init_keys();
	MAX_ID_BYTES = 1024;
	encoder = new TextEncoder();
}));
function queryLocalTraceSummaries(e, t) {
	let n = e.filter((e) => matchesFilter(e, t));
	return n.sort((e, n) => compareSummaries(e, n, t.sortBy)), {
		matches: n.slice(0, t.limit),
		truncated: n.length > t.limit
	};
}
function matchesFilter(e, t) {
	return (t.agentName === void 0 || e.agentNames.includes(t.agentName)) && (t.sessionId === void 0 || e.sessionIds.includes(t.sessionId)) && (t.toolName === void 0 || e.toolNames.includes(t.toolName)) && (t.failedOnly !== !0 || e.errorSpanCount > 0);
}
function compareSummaries(e, t, n) {
	return (n === `duration` ? t.durationMs - e.durationMs : n === `failures` ? t.errorSpanCount - e.errorSpanCount : n === `inputTokens` ? t.inputTokens - e.inputTokens : Date.parse(t.startedAt) - Date.parse(e.startedAt)) || e.traceId.localeCompare(t.traceId);
}
var search_traces_exports = __exportAll({
	default: () => search_traces_default,
	resolveSearchTracesTool: () => resolveSearchTracesTool
});
function parseInput(e) {
	if (typeof e != `object` || !e || Array.isArray(e)) throw Error(`Trace search input must be an object.`);
	let t = e;
	let n = t.limit === void 0 ? 50 : t.limit;
	if (typeof n != `number` || !Number.isInteger(n) || n < 1 || n > 50) throw Error(`limit must be an integer between 1 and 50.`);
	if (t.sortBy !== void 0 && t.sortBy !== `latest` && t.sortBy !== `duration` && t.sortBy !== `failures` && t.sortBy !== `inputTokens`) throw Error(`sortBy must be latest, duration, failures, or inputTokens.`);
	return {
		limit: n,
		sortBy: t.sortBy ?? DEFAULT_SORT_BY
	};
}
function traceIds(e) {
	let t = new Set();
	for (let n of e.split(/\r?\n/u)) {
		let e = n.split(`/`).filter(Boolean).find((e) => TRACE_ID.test(e));
		e !== void 0 && t.add(e);
	}
	return t;
}
function isEmptyTraceListing(e) {
	return e.stdout.trim() === `` && e.stderr.includes(`/traces/*`) && /no such file or directory/iu.test(e.stderr);
}
function contains(e, t, n) {
	return e.some(({ span: e }) => e.attributes[t] === n);
}
function resolveSearchTracesTool(e) {
	return resolveLocalOnly(e, searchTracesTool);
}
var DEFAULT_SORT_BY, searchTracesTool, search_traces_default;
var init_search_traces = __esmMin((() => {
	init_local_only();
	init_trace_inspection();
	init_trace_summary();
	init_conversation_identity();
	init_api();
	init_trace_discovery_index();
	DEFAULT_SORT_BY = `latest`;
	searchTracesTool = defineTool({
		description: `Search summaries for traces in the invoking conversation.`,
		inputSchema: {
			type: `object`,
			additionalProperties: !1,
			properties: {
				limit: {
					type: `integer`,
					minimum: 1,
					maximum: 50,
					default: 50
				},
				sortBy: {
					enum: [
						`duration`,
						`failures`,
						`inputTokens`,
						`latest`
					],
					type: `string`,
					default: DEFAULT_SORT_BY,
					description: `Rank examined traces by elapsed time, error-span count, summed step input tokens, or start time. Defaults to latest.`
				}
			}
		},
		outputSchema: {
			type: `object`,
			additionalProperties: !0
		},
		async execute(e, t) {
			let n = parseInput(e);
			let r = $.getSpan(G.active())?.spanContext().traceId;
			let i = resolveConversationId(t.session.parent?.rootSessionId ?? t.session.id);
			let a = await t.getSandbox();
			let [o, s, c] = await Promise.all([
				a.run({ command: `ls -1dt /traces/*` }),
				a.run({ command: `ls -1 /traces/*/${localTraceIndexedMarker()}` }),
				a.run({ command: `ls -1 /traces/*/${localTraceConversationMarker(i)}` })
			]);
			if (o.exitCode !== 0 && !isEmptyTraceListing(o)) throw Error(`Could not list local traces: ${o.stderr}`);
			let l = [...traceIds(o.stdout)];
			let u = l.filter((e) => e !== r);
			let d = traceIds(s.stdout);
			let f = new Set(traceIds(c.stdout));
			let p = u.filter((e) => !d.has(e));
			let m = p.slice(0, 100);
			let h = new Map();
			let g = 0;
			let read = async (e) => {
				try {
					return await readTraceSources(e, t);
				} catch (e) {
					if (t.abortSignal.aborted) throw e;
					g += 1;
					return;
				}
			};
			for (let e of m) {
				if (t.abortSignal.aborted) throw Error(`Trace search was cancelled.`);
				let n = await read(e);
				n !== void 0 && contains(n, `gen_ai.conversation.id`, i) && (f.add(e), h.set(e, summarizeLocalTrace(e, n.map(({ span: e }) => e))));
			}
			let _ = u.filter((e) => f.has(e));
			let v = _.slice(0, 200);
			let y = [];
			for (let e of v) {
				if (t.abortSignal.aborted) throw Error(`Trace search was cancelled.`);
				let n = h.get(e);
				if (n !== void 0) {
					y.push(n);
					continue;
				}
				let r = await read(e);
				r !== void 0 && y.push(summarizeLocalTrace(e, r.map(({ span: e }) => e)));
			}
			let b = queryLocalTraceSummaries(y, n);
			let x = p.length - m.length + _.length - v.length;
			let S = {
				complete: x === 0 && g === 0,
				considered: v.length,
				matched: _.length,
				stored: l.length
			};
			let C = [];
			return x !== 0 && C.push(`Some older traces could not be included.`), g !== 0 && C.push(`Some traces could not be read.`), C.length > 0 && (S.warning = C.join(` `)), {
				conversationId: i,
				coverage: S,
				matches: b.matches,
				truncated: b.truncated
			};
		}
	});
	search_traces_default = defineLocalOnlyDynamic(searchTracesTool);
}));
const module_0 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(eve_exports));
const module_1 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "sandbox.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54",
	"semanticRevision": "eve:default-sandbox:v1"
});
const module_2 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/bash.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_3 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/edit_file.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_4 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/read_file.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_5 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/web_fetch.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_6 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/write_file.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_7 = memoizeModuleNamespaceFactories({ default: (await Promise.resolve().then(() => (init_extension(), extension_exports))).default({ "local": { "enabled": true } }) });
const module_8 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "channels/home.ts",
	"registryId": "eve:root-defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_9 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/agent.ts",
	"registryId": "eve:root-defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_10 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(cancelCart_exports));
const module_11 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(createCart_exports));
const module_12 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(getCart_exports));
const module_13 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(getProductDetails_exports));
const module_14 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(lookupProducts_exports));
const module_15 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(searchProducts_exports));
const module_16 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(updateCart_exports));
const module_17 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_agent(), agent_exports))));
const module_18 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/bash.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_19 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/read_file.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_20 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/web_fetch.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_21 = await loadFrameworkProgrammaticModule({
	"kind": "programmatic",
	"moduleId": "tools/write_file.ts",
	"registryId": "eve:defaults",
	"revision": "eve@1.4.0:compiled-manifest-v54"
});
const module_22 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_instructions(), instructions_exports))));
const module_23 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_sandbox(), sandbox_exports))));
const module_24 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_trace_analysis$1(), trace_analysis_exports))));
const module_25 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_edit_file(), edit_file_exports))));
const module_26 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_inspect_trace_spans(), inspect_trace_spans_exports))));
const module_27 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_inspect_trace(), inspect_trace_exports))));
const module_28 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_registry_add(), registry_add_exports))));
const module_29 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_search_models(), search_models_exports))));
const module_30 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_search_registry(), search_registry_exports))));
const module_31 = memoizeModuleNamespaceFactories(interopAuthoredModuleNamespace(await Promise.resolve().then(() => (init_search_traces(), search_traces_exports))));
const moduleMap = Object.freeze({ "nodes": Object.freeze({
	"__root__": Object.freeze({ "modules": Object.freeze({
		"channels/eve.ts": module_0,
		"eve:defaults:sandbox.ts": module_1,
		"eve:defaults:tools/bash.ts": module_2,
		"eve:defaults:tools/edit_file.ts": module_3,
		"eve:defaults:tools/read_file.ts": module_4,
		"eve:defaults:tools/web_fetch.ts": module_5,
		"eve:defaults:tools/write_file.ts": module_6,
		"eve:development-extension:self-modification:extensions/self-modification.ts": module_7,
		"eve:root-defaults:channels/home.ts": module_8,
		"eve:root-defaults:tools/agent.ts": module_9,
		"tools/cancelCart.ts": module_10,
		"tools/createCart.ts": module_11,
		"tools/getCart.ts": module_12,
		"tools/getProductDetails.ts": module_13,
		"tools/lookupProducts.ts": module_14,
		"tools/searchProducts.ts": module_15,
		"tools/updateCart.ts": module_16
	}) }),
	"ext:self-modification:subagents/agent": Object.freeze({ "modules": Object.freeze({
		"agent.js": module_17,
		"eve:defaults:tools/bash.ts": module_18,
		"eve:defaults:tools/read_file.ts": module_19,
		"eve:defaults:tools/web_fetch.ts": module_20,
		"eve:defaults:tools/write_file.ts": module_21,
		"instructions.js": module_22,
		"sandbox.js": module_23,
		"skills/trace_analysis.js": module_24,
		"tools/edit_file.js": module_25,
		"tools/inspect_trace_spans.js": module_26,
		"tools/inspect_trace.js": module_27,
		"tools/registry_add.js": module_28,
		"tools/search_models.js": module_29,
		"tools/search_registry.js": module_30,
		"tools/search_traces.js": module_31
	}) })
}) });
export { moduleMap as default, moduleMap };
