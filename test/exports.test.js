const path = require('path');
const {exec, run} = require('../dist/main');

const assets = path.join(__dirname, './assets');
// const output = './output';
const output1 = 'E:\\project\\ro_new\\dev\\client\\trunk\\myLaya\\bin\\font';

const filename0 = 'test';
const filename1 = 'test1';
const filename2 = 'bmf_Button_blue';
const filename3 = 'bmf_Button_yellow';
const filename4 = 'bmf_titile';

function testExec(output, filename){
    const psdPath = path.join(assets, `${filename}.psd`);
    exec(psdPath, output, filename);
}

testExec(output1, filename2);
testExec(output1, filename3);
testExec(output1, filename4);
