import { readBmfTemp, readFile, writeFile } from './utils';
import { ENCODING } from './const';

const Placeholder = '<!-- CharTemp -->';

function getRegByKey(key) {
	return new RegExp(`${key}\\s*=\\s*""`);
}

function replace(content, key, value) {
	const reg = getRegByKey(key);
	const res = reg.exec(content);
	if (res !== null) {
		let temp = res[0].replace('""', `"${value}"`);
		content = content.replace(reg, temp);
	}

	return content;
}

export default class BmfFntParser {
	constructor() {
		this._path = '';
		this._content = '';
		this._charTemp = '';
		this._chars = {};
	}

	get path() {
		return this._path;
	}

	set path(value) {
		if (this._path !== value) {
			this._path = value;
			this._content = '';
		}
	}

	async parse(path) {
		this.path = path;
		let content = this._content;
		if (content === '') {
			content = await readFile(this._path, ENCODING);
			if (content === null) content = await readBmfTemp();
			this._content = content;
			this.extractCharTemp(content);
		}

		return content;
	}

	async reparse() {
		this._content = '';
		await this.parse();
	}

	extractCharTemp() {
		const content = this._content;
		const reg = /<char\s+[\w\s="]+\/>/;
		const res = reg.exec(content);
		if (res === null) throw new Error("The char temp '<char id ...' dose not find!");

		this._charTemp = res[0];
		this._content = content.replace(reg, Placeholder);
	}

	replace(key, value) {
		this._content = replace(this._content, key, value);
	}

	addChar(font) {
		let id = font.id;
		if (!this.hasChar(id)) {
			let temp = this._charTemp;
			temp = replace(temp, 'id', id);
			temp = replace(temp, 'x', font.x);
			temp = replace(temp, 'y', font.y);
			temp = replace(temp, 'width', font.width);
			temp = replace(temp, 'height', font.height);
			temp = replace(temp, 'xadvance', font.xadvance);
			this._chars[id] = temp;
			return true;
		}

		return false;
	}

	hasChar(id) {
		return id in this._chars;
	}

	removeChar(id) {
		delete this._chars[id];
	}

	clearChars() {
		this._chars = {};
	}

	toBmfFnt() {
		let chars = '';
		let ids = Object.keys(this._chars);
		for (let i = 0, length = ids.length; i < length; i++) {
			chars += this._chars[ids[i]];
			if (i !== length - 1) chars += '\n\t\t';
		}

		return this._content.replace(Placeholder, chars);
	}

	async save2BmfFnt(output) {
		await writeFile(output, this.toBmfFnt(), ENCODING);
	}
}
