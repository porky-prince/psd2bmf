import path from 'path';
import fs from 'fs-extra';
import { FNT_EXT, PNG_EXT, PSD_EXT, ROOT } from '../src/const';
import { exec } from 'child_process';

const ASSETS = path.join(__dirname, 'assets');
const OUTPUT = path.join(__dirname, 'output');

function input(filename) {
	return path.join(ASSETS, filename + PSD_EXT);
}

function output(filename, extName) {
	return path.join(OUTPUT, filename + extName);
}

async function execCmd(filename) {
	return new Promise(resolve => {
		exec(
			`node bin/psd2bmf.js -i ${input(filename)} -o ${OUTPUT}`,
			{
				cwd: ROOT,
			},
			resolve
		);
	});
}

async function isExist(filename, extName) {
	return new Promise(resolve => {
		fs.exists(output(filename, extName), resolve);
	});
}

async function judgeExist(filename, extName, flag) {
	expect(await isExist(filename, extName)).toBe(flag);
}

async function judgeExists(filename, flag) {
	return Promise.all([judgeExist(filename, FNT_EXT, flag), judgeExist(filename, PNG_EXT, flag)]);
}

function testOne(filename) {
	describe(`Test ${filename + PSD_EXT}`, () => {
		test(`A ${filename + FNT_EXT} and a ${filename + PNG_EXT} will be output`, async () => {
			await execCmd(filename);
			await judgeExists(filename, true);
		});
	});
}

function testMultiple(filename, num) {
	describe(`Test ${filename + PSD_EXT}`, () => {
		test(`${num} fnt files and ${num} png files will be output`, async () => {
			await execCmd(filename);
			for (let i = 0; i < num; i++) {
				/* eslint no-await-in-loop: "off" */
				await judgeExists(filename + '_' + i, true);
			}
		});
	});
}

function testOneErr(filename) {
	describe(`Test ${filename + PSD_EXT}`, () => {
		test('There is no output', async () => {
			await execCmd(filename);
			await judgeExists(filename, false);
		});
	});
}

function testMultipleErr(filename, num) {
	describe(`Test ${filename + PSD_EXT}`, () => {
		test('There is no output', async () => {
			await execCmd(filename);
			for (let i = 0; i < num; i++) {
				await judgeExists(filename + '_' + i, false);
			}
		});
	});
}

describe('Export', () => {
	testOne('export');

	testOne('do_not_export');

	testMultiple('export_multiple', 3);

	testOne('number');

	testMultiple('numbers', 3);

	testMultiple('recognize_param', 2);

	testOne('mix');

	testOneErr('numberErr');

	testMultipleErr('numbersErr', 3);
});
