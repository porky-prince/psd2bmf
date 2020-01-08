const path = require('path');

test('path parse', () => {
    let info = path.parse('aaa.psd');
    console.log(info);
    expect(info.ext).toBe('.psd');
});
