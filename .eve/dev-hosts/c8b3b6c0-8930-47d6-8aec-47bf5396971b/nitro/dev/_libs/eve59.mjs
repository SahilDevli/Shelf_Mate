// node_modules/eve/dist/src/tools/model-output.js
const WARN_ONCE = Symbol.for(`eve.toolModelOutput.warnOnce`);
function defaultToolModelOutput(e) {
	return typeof e == `string` ? {
		type: `text`,
		value: e
	} : {
		type: `json`,
		value: e ?? null
	};
}
const toolOutput = {
	text(e) {
		return {
			type: `text`,
			value: e
		};
	},
	errorText(e) {
		return {
			type: `error-text`,
			value: e
		};
	},
	json(e) {
		return {
			type: `json`,
			value: e
		};
	},
	content(e) {
		return {
			type: `content`,
			value: e
		};
	}
};
const toolOutputPart = {
	text(e) {
		return {
			type: `text`,
			text: e
		};
	},
	file(e, t) {
		return filePart({
			type: `data`,
			data: e
		}, t);
	},
	fileUrl(e, t) {
		return filePart({
			type: `url`,
			url: e
		}, t);
	}
};
function filePart(e, t) {
	return t.filename === void 0 ? {
		type: `file`,
		data: e,
		mediaType: t.mediaType
	} : {
		type: `file`,
		data: e,
		mediaType: t.mediaType,
		filename: t.filename
	};
}
export { WARN_ONCE, defaultToolModelOutput, toolOutput, toolOutputPart };

//# sourceMappingURL=eve59.mjs.map