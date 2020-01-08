import { parseRecognizeArgs, readFile } from "../src/utils";
import { ENCODING } from "../src/const";

test('Test readFile error', async () => {
    let content = await readFile('aaa', ENCODING);
    expect(content).toBe(null);
});

test('Test parseRecognizeArgs', () => {
    let obj = parseRecognizeArgs('offset=0,0,3,0&xAdvance=4');
    expect(obj).toEqual({
        offset: "0,0,3,0",
        xAdvance: 4
    });
});
