import fs from 'fs-extra';
import { FNT_EXT, PNG_EXT, PSD_EXT } from '../src/const';
import { execCmd, getOutputFileMd5, HASH_JSON } from './helper';

let hashJson = null;

async function judgeExist(filename, extName, flag) {
	const hash = await getOutputFileMd5(filename, extName);
	expect(hash !== null).toBe(flag);
	expect(hash ? hashJson[filename + extName] : hash).toBe(hash);
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
			await execCmd(filename).catch(() => {});
			await judgeExists(filename, false);
		});
	});
}

function testMultipleErr(filename, num) {
	describe(`Test ${filename + PSD_EXT}`, () => {
		test('There is no output', async () => {
			await execCmd(filename).catch(() => {});
			for (let i = 0; i < num; i++) {
				await judgeExists(filename + '_' + i, false);
			}
		});
	});
}

describe('Export', () => {
	beforeAll(async () => {
		console.log(
			'If you change the code in the src folder and make sure you output the correct results,',
			'please exec "yarn run hash" at first.'
		);
		hashJson = await fs.readJson(HASH_JSON);
	});

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
