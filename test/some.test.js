const path = require('path');

test('path parse', () => {
    let info = path.parse('aaa.psd');
    expect(info.ext).toBe('.psd');
});

test('path join', () => {
    const sep = path.sep;
    let output = path.join('aaa', 'bbb');
    expect(output).toBe(`aaa${sep}bbb`);

    output = path.join('aaa.abc', 'bbb');
    expect(output).toBe(`aaa.abc${sep}bbb`);

    output = path.join('aaa', 'bbb.abc');
    expect(output).toBe(`aaa${sep}bbb.abc`);

    output = path.join('aaa', 'bbb.abc' + sep);
    expect(output).toBe(`aaa${sep}bbb.abc${sep}`);

    output = path.join('aaa/', 'bbb.abc');
    expect(output).toBe(`aaa${sep}bbb.abc`);
});

function testDelay() {
    let obj = {
        num: 1
    };
    async function delay(flag) {
        if (flag) {
            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
        }
        console.log(obj.num);
    }
    delay(false);
    obj.num = 2;
}

testDelay();
