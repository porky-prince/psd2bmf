import path from 'path';
import fs from 'fs-extra';
import crypto from 'crypto';
import { exec } from 'child_process';
import { PSD_EXT, ROOT } from '../src/const';
import { readFile } from '../src/utils';

const ASSETS = path.join(__dirname, 'assets');
const OUTPUT = path.join(__dirname, 'output');
export const HASH_JSON = path.join(ASSETS, 'hash.json');

process.argv[2] && generateHash();

function input(filename) {
	return path.join(ASSETS, filename + PSD_EXT);
}

function output(filename, extName) {
	return path.join(OUTPUT, filename + extName);
}

function md5(data) {
	const md5 = crypto.createHash('md5');
	return md5.update(data).digest('hex');
}

export async function getOutputFileMd5(filename, extName) {
	let hash = null;
	const outputFile = output(filename, extName);
	if (fs.existsSync(outputFile)) {
		hash = md5(await readFile(outputFile));
	}

	return hash;
}

export async function execCmd(filename) {
	return new Promise((resolve) => {
		exec(
			`node bin/psd2bmf.js -i ${input(filename)} -o ${OUTPUT}`,
			{
				cwd: ROOT,
			},
			resolve
		);
	});
}

async function generateHash() {
	let arr = [];
	fs.readdirSync(ASSETS).forEach((filename) => {
		if (filename.indexOf(PSD_EXT) !== -1) {
			arr.push(execCmd(filename.replace(PSD_EXT, '')));
		}
	});
	await Promise.all(arr);
	const hash = {};
	arr = fs.readdirSync(OUTPUT).map(async (filename) => {
		hash[filename] = await getOutputFileMd5(filename, '');
	});
	await Promise.all(arr);
	await fs.writeJson(HASH_JSON, hash, { spaces: 4 });
}
