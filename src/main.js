import path from "path";
import PSD from "psd";
import Group from "./model/Group";
import Layout from "layout";
import { createPng, readPng, writePng } from "./utils";
import { Font } from "./model/Font";
import { SPACE, TAB } from "./const";

async function recognition(bigPng, group) {
    let bigPngData = bigPng.data;
    if (bigPngData[3] > 0) throw new Error('Are you sure the image background is transparent?');
    let layers = group.layers;
    let splitSpace = group.option.splitSpace;
    let fonts = [];
    for (let i = 0, length = layers.length; i < length; i++) {
        let layer = layers[i];
        if (layer.x < 0 || layer.y < 0 || layer.width > bigPng.width || layer.height > bigPng.height) {
            throw new Error('Layer is out of bounds!');
        }

        let start = NaN;
        let end = 0;
        let spaceCount = 0;
        let fontCount = 0;
        let xLen = Math.min(layer.x + layer.width + splitSpace * 1.5, bigPng.width);
        let yLen = layer.y + layer.height;
        for (let x = layer.x; x < xLen; x++) {
            for (let y = layer.y; y < yLen; y++) {
                let idx = (bigPng.width * y + x) << 2;
                let alpha = bigPngData[idx + 3];
                if (alpha > 0) {
                    if (isNaN(start)) start = end = x;// 开始识别
                    end++;
                    spaceCount = 0;
                    break;
                } else if (!isNaN(start) && y === yLen - 1) {// start不为NaN说明已经开始了一个字的识别
                    spaceCount++;// 一列都是透明
                    if (spaceCount > splitSpace) {// 当连续超过splitSpace列透明时则这个字识别结束
                        let font = new Font(layer.getFontText(fontCount));
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

    dealFonts(bigPng, fonts);
}

async function dealFonts(bigPng, fonts) {
    let length = fonts.length;
    if (length > 0) {
        const layout = Layout('binary-tree');
        const unique = [];
        const specialFonts = [];
        for (let i = 0; i < length; i++) {
            let font = fonts[i];
            if (unique.indexOf(font.id) === -1) {
                unique.push(font.id);
                if (!font.isSpace() && !font.isTab()) {
                    layout.addItem(font);
                } else {
                    specialFonts.push(font);
                }
            }
        }
        const exportInfo = layout.export();
        let layerPng = createPng(exportInfo.width, exportInfo.height);
        for (let j = 0, length = exportInfo.items.length; j < length; j++) {
            let font = exportInfo.items[j];
            bigPng.bitblt(layerPng, font.posX, font.posY, font.width, font.height, font.x, font.y);
        }
        writePng(path.join(__dirname, `../test/output/out${0}.png`), layerPng);
    }
}

export default class Psd2bmf {

    static async fromJson() {
    }

    static async fromFile(psdPath, output, option) {
        const psdPngPath = psdPath.replace('.psd', '.png');
        const psdFileName = path.parse(psdPath).name;
        const psd = PSD.fromFile(psdPath);
        psd.parse();

        let bigPng = await readPng(psdPngPath);
        if (!bigPng) {
            console.warn("Png image exported with PhotoShop are of higher quality!");
            bigPng = createPng(psd.image.width(), psd.image.height());
            bigPng.data = Buffer.from(psd.image.pixelData);
        }

        const tree = psd.tree();
        const children = tree.children();
        let exportCount = 0;
        for (let i = 0, length = children.length; i < length; i++) {
            let child = children[i];
            let group = new Group(psdFileName, child);
            if (group.canExport()) {
                group.index = exportCount++;
                recognition(bigPng, group);
            }
        }
    }
}

const psdPath = require.resolve(path.join(__dirname, "../test/assets/test1.psd"));

Psd2bmf.fromFile(psdPath);
