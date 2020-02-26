import { parseRecognizeArgs, readBmfTemp, readFile, readPng } from '../src/utils';
import { ENCODING } from '../src/const';
import path from 'path';

test('Test readFile', async () => {
	let content = await readFile('aaa', ENCODING);
	expect(content).toBe(null);

	content = await readBmfTemp();
	expect(Boolean(content)).toBe(true);
});

test('Test parseRecognizeArgs', () => {
	const obj = parseRecognizeArgs('offset=0,0,3,0&splitSpace=4');
	expect(obj).toEqual({
		offset: '0,0,3,0',
		splitSpace: 4,
	});
});

test('Test readPng', async () => {
	let png = await readPng('aaa');
	expect(png).toBe(null);

	png = await readPng(path.join(__dirname, './assets/export.png'));
	expect(Boolean(png)).toBe(true);

	png = await readPng(path.join(__dirname, './assets/test_jpg.jpg'));
	expect(png).toBe(null);
});
