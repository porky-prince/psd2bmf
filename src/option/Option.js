import path from 'path';
import { isArray, isExist, isString, merge, mustExist } from '../utils';
import { PNG_EXT, PSD_EXT } from '../const';
import GroupOpt from './GroupOpt';

export default class Option {
	constructor(option) {
		this._input = '';
		this._inputInfo = null;
		this._inputPng = '';
		this._output = '';
		this._filename = '';
		this._groups = [];
		merge(this, option);
	}

	get input() {
		return mustExist(this._input, PSD_EXT);
	}

	set input(value) {
		if (value && isString(value)) {
			this._input = value;
			this._inputInfo = path.parse(value);
		}
	}

	get inputInfo() {
		return this._inputInfo;
	}

	get inputPng() {
		let inputPng = this._inputPng;
		if (!isExist(inputPng, PNG_EXT)) {
			inputPng = this._input.replace(PSD_EXT, PNG_EXT);
		}

		return inputPng;
	}

	set inputPng(value) {
		if (value) this._inputPng = value;
	}

	get output() {
		let output = this._output;
		if (!output) {
			output = this._inputInfo.dir;
		}

		return output;
	}

	set output(value) {
		if (value) this._output = value;
	}

	get filename() {
		let filename = this._filename;
		if (!filename) {
			filename = this._inputInfo.name;
		}

		return filename;
	}

	set filename(value) {
		if (value) this._filename = value;
	}

	get groups() {
		return this._groups;
	}

	set groups(groups) {
		this._groups.length = 0;
		if (isArray(groups)) {
			for (let i = 0, length = groups.length; i < length; i++) {
				this._groups[i] = merge(new GroupOpt(), groups[i]);
			}
		}
	}

	getGroup(i) {
		let group = this._groups[i];
		if (!group) {
			this._groups[i] = group = new GroupOpt();
		}

		return group;
	}
}
