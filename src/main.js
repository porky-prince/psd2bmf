import path from "path";
import PSD from "psd";
import Group from "./model/Group";
import { createPng, readPng } from "./utils";
import { Font } from "./model/Font";
import fs from "fs";
import BmfFntParser from "./BmfFntParser";
import { SPACE } from "./const";

export class Psd2bmf {

    static async main() {
        const psdPath = require.resolve(path.join(__dirname, "../test/assets/test1.psd"));
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

        let tree = psd.tree();
        let children = tree.children();
        let exportCount = 0;
        for (let i = 0, length = children.length; i < length; i++) {
            let child = children[i];
            let group = new Group(psdFileName, child);
            if (group.canExport()) {
                group.index = exportCount++;
                this.build(bigPng, group);
            }
        }
    }

    static async build(bigPng, group) {
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
        }

        for (let i = 0, length = fonts.length; i < length; i++) {
            let font = fonts[i];
            let layerPng = createPng(font.width, font.height);
            bigPng.bitblt(layerPng, font.x, font.y, font.width, font.height, 0, 0);
            layerPng.pack().pipe(fs.createWriteStream(path.join(__dirname, `../test/output/out${i}.png`)));
        }
    }
}

// Psd2bmf.main();

let parser = new BmfFntParser();

parser.parse();
