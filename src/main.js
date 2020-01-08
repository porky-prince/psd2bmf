import path from "path";
import PSD from "psd";
import Group from "./model/Group";
import Layout from "layout";
import Option from "./option/Option";
import { createPng, readPng, writePng } from "./utils";
import { Font } from "./model/Font";
import { SPACE, TAB } from "./const";
import BmfFntParser from "./BmfFntParser";

function recognition(srcPng, group) {
    const srcPngData = srcPng.data;
    if (srcPngData[3] > 0) throw new Error('Are you sure the image background is transparent?');
    const layers = group.layers;
    const splitSpace = group.groupOpt.recognition.splitSpace;
    const fonts = [];
    for (let i = 0, length = layers.length; i < length; i++) {
        let layer = layers[i];
        if (layer.x < 0 || layer.y < 0 || layer.width > srcPng.width || layer.height > srcPng.height) {
            throw new Error('Layer is out of bounds!');
        }

        group.groupOpt.exports.setDefault(layer.height, layer.height);

        let start = NaN;
        let end = 0;
        let spaceCount = 0;
        let fontCount = 0;
        const xLen = Math.min(layer.x + layer.width + splitSpace * 1.5, srcPng.width);
        const yLen = layer.y + layer.height;
        for (let x = layer.x; x < xLen; x++) {
            for (let y = layer.y; y < yLen; y++) {
                const idx = (srcPng.width * y + x) << 2;
                const alpha = srcPngData[idx + 3];
                if (alpha > 0) {
                    if (isNaN(start)) start = end = x;// 开始识别
                    end++;
                    spaceCount = 0;
                    break;
                } else if (!isNaN(start) && y === yLen - 1) {// start不为NaN说明已经开始了一个字的识别
                    spaceCount++;// 一列都是透明
                    if (spaceCount > splitSpace) {// 当连续超过splitSpace列透明时则这个字识别结束
                        const font = new Font(layer.getFontText(fontCount));
                        font.setBound(start, layer.y, end - splitSpace - start, layer.height);
                        fonts.push(font);
                        fontCount++;
                        start = NaN;// 从新开始识别下一个字
                    } else {
                        end++;
                    }
                }
            }
        }
        layer.hasSpace() && fonts.push(new Font(SPACE));
        layer.hasTab() && fonts.push(new Font(TAB));
    }
    return fonts;
}

function dealFonts(fonts) {
    const length = fonts.length;
    if (length > 0) {
        const layout = Layout('binary-tree');
        const unique = [];
        const specialItems = [];
        for (let i = 0; i < length; i++) {
            const font = fonts[i];
            if (unique.indexOf(font.id) === -1) {
                unique.push(font.id);
                if (!font.isSpace() && !font.isTab()) {
                    layout.addItem(font);
                } else {
                    specialItems.push(font);
                }
            }
        }
        const layoutInfo = layout.export();
        layoutInfo.specialItems = specialItems;
        return layoutInfo;
    }
    return null;
}

async function exportAll(srcPng, group) {
    const layoutInfo = dealFonts(recognition(srcPng, group));
    if (layoutInfo !== null) {
        await Promise.all([
            exportPng(srcPng, group, layoutInfo),
            exportFnt(group, layoutInfo)
        ]);
    }
}

async function exportPng(srcPng, group, layoutInfo) {
    const distPng = createPng(layoutInfo.width, layoutInfo.height);
    for (let i = 0, length = layoutInfo.items.length; i < length; i++) {
        const font = layoutInfo.items[i];
        srcPng.bitblt(distPng, font.posX, font.posY, font.width, font.height, font.x, font.y);
    }
    await writePng(path.join(__dirname, `../test/output/out${0}.png`), distPng);
}

async function exportFnt(group, layoutInfo) {
    const fonts = layoutInfo.items.concat(layoutInfo.specialItems);
    const parser = new BmfFntParser();
    await parser.parse();
    parser.replace('scaleW', layoutInfo.width);
    parser.replace('scaleH', layoutInfo.height);
    parser.replace('count', fonts.length);
    for (let i = 0, length = fonts.length; i < length; i++) {
        parser.addChar(fonts[i]);
    }
    await parser.save2BmfFnt(path.join(__dirname, `../test/output/out${0}.fnt`));
}

async function run(option) {
    const psd = PSD.fromFile(option.input);
    psd.parse();
    let srcPng = await readPng(option.inputPng);
    if (srcPng === null) {
        console.warn("Png image exported with PhotoShop are of higher quality!");
        srcPng = createPng(psd.image.width(), psd.image.height());
        srcPng.data = Buffer.from(psd.image.pixelData);
    }

    const tree = psd.tree();
    const children = tree.children();
    const taskAll = [];
    let exportCount = 0;
    for (let i = 0, length = children.length; i < length; i++) {
        let child = children[i];
        if (Group.canExport(child)) {
            let group = new Group(option);
            group.init(exportCount++, child);
            taskAll.push(exportAll(srcPng, group));
        }
    }
    await Promise.all(taskAll);
}

export default class Psd2bmf {
    static async exec(psdPath, output, filename, inputPng) {
        let opt = new Option();
        opt.input = psdPath;
        opt.output = output;
        opt.filename = filename;
        opt.inputPng = inputPng;
        await run(opt);
    }

    static async run(option) {
        await run(new Option(option));
    }
}

const psdPath = require.resolve(path.join(__dirname, "../test/assets/test1.psd"));

Psd2bmf.exec(psdPath);
