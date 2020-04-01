import path from 'path';
import fs from 'fs-extra';
import md5 from 'md5';
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

export async function getOutputFileMd5(filename, extName) {
	const outputFile = await readFile(output(filename, extName));
	if (outputFile !== null) {
		return md5(outputFile);
	}

	return null;
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
