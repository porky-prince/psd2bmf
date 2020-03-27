import path from 'path';

test('Path parse', () => {
	const info = path.parse('aaa.psd');
	expect(info.ext).toBe('.psd');
});

test('Path join', () => {
	const sep = path.sep;
	let output = path.join('aaa.abc', 'bbb');
	expect(output).toBe(`aaa.abc${sep}bbb`);

	output = path.join('aaa', 'bbb.abc');
	expect(output).toBe(`aaa${sep}bbb.abc`);

	output = path.join('aaa', 'bbb.abc' + sep);
	expect(output).toBe(`aaa${sep}bbb.abc${sep}`);

	output = path.join('aaa/', 'bbb.abc');
	expect(output).toBe(`aaa${sep}bbb.abc`);
});

test('Test delay', () => {
	const obj = {
		num: 1,
	};

	async function delay(flag) {
		if (flag) {
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 1000);
			});
		}

		expect(obj.num).toBe(1);
	}

	delay(false);
	obj.num = 2;
});
