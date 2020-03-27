import path from 'path';
import fs from 'fs-extra';
import { PNG } from 'pngjs';
import { BMF_FNT_TEMP, ENCODING } from './const';

export function isString(any) {
	return typeof any === 'string';
}

export function isObject(any) {
	return typeof any === 'object';
}

export function isArray(any) {
	return Array.isArray(any);
}

export function merge(src, opt) {
	if (opt && (isObject(opt) || isArray(opt))) {
		Object.keys(opt).forEach((attr) => {
			if (attr in src) {
				src[attr] = opt[attr];
			}
		});
	}

	return src;
}

export async function readFile(filePath, option) {
	return new Promise((resolve) => {
		fs.exists(filePath, (exists) => {
			if (exists) {
				fs.readFile(filePath, option, (err, data) => {
					resolve(err ? null : data);
				});
			} else {
				resolve(null);
			}
		});
	});
}

export async function writeFile(filePath, data, option) {
	return new Promise((resolve, reject) => {
		fs.outputFile(filePath, data, option, (err) => {
			err ? reject() : resolve();
		});
	});
}

let bmfTemp = null;

export async function readBmfTemp() {
	if (bmfTemp === null) {
		bmfTemp = await readFile(BMF_FNT_TEMP, ENCODING);
	}

	return bmfTemp;
}

export async function readPng(pngPath) {
	return new Promise((resolve) => {
		fs.exists(pngPath, (exists) => {
			if (exists) {
				fs.createReadStream(pngPath)
					.pipe(createPng(undefined, undefined))
					.on('parsed', function () {
						resolve(this);
					})
					.on('error', function () {
						resolve(null);
					});
			} else {
				resolve(null);
			}
		});
	});
}

export async function writePng(pngPath, pngData) {
	return new Promise((resolve, reject) => {
		const dir = path.parse(pngPath).dir;
		fs.ensureDir(dir, (err) => {
			if (err) {
				reject();
			} else {
				pngData.pack().pipe(fs.createWriteStream(pngPath)).on('end', resolve);
			}
		});
	});
}

export function createPng(width, height) {
	return new PNG({
		width: width,
		height: height,
		// DeflateLevel: 0,
		// filterType: 4
	});
}

export function parseRecognizeArgs(argsStr) {
	let obj = {};
	if (argsStr && isString(argsStr)) {
		if (/\w+=.+&?/.test(argsStr)) {
			let args = argsStr.split('&');
			for (let i = args.length - 1; i >= 0; i--) {
				let strArr = args[i].split('=');
				let value = strArr[1];
				obj[strArr[0]] = isNaN(Number(value)) ? value : parseInt(value, 10);
			}
		} else {
			console.warn('The recognize args incorrect.');
		}
	}

	return obj;
}

export function mergeRecognizeArgs(src, argsStr) {
	return merge(src, parseRecognizeArgs(argsStr));
}

export function isExist(filePath, extName) {
	const info = path.parse(filePath);
	if (info.ext === extName) return fs.existsSync(filePath);
	return false;
}

export function mustExist(filePath, extName) {
	const info = path.parse(filePath);
	if (info.ext === extName) {
		if (fs.existsSync(filePath)) return filePath;
		throw new Error('The file does not exist:' + filePath);
	} else {
		throw new Error(`This is not a ${extName} file!`);
	}
}
