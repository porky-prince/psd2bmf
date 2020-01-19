import path from 'path';
import PSD from 'psd';
import Group from './model/Group';
import Layout from 'layout';
import Option from './option/Option';
import { createPng, readPng, writePng } from './utils';
import { Font } from './model/Font';
import { FNT_EXT, PNG_EXT, SPACE, TAB } from './const';
import BmfFntParser from './BmfFntParser';

async function runTask(option) {
    const psd = PSD.fromFile(option.input);
    psd.parse();
    let srcPng = await readPng(option.inputPng);
    if (srcPng === null) {
        console.warn(
            'Png image exported with PhotoShop are of higher quality.'
        );
        srcPng = createPng(psd.image.width(), psd.image.height());
        srcPng.data = Buffer.from(psd.image.pixelData);
    }

    const tree = psd.tree();
    const children = tree.children();
    const groups = [];
    let exportCount = 0;
    for (let i = 0, length = children.length; i < length; i++) {
        let child = children[i];
        if (Group.canExport(child)) {
            const group = new Group(option);
            group.init(exportCount++, child);
            groups.push(group);
        }
    }
    if (groups.length === 1) {
        groups[0].onlyOne = true;
    }
    await exportGroups(srcPng, groups);
}

function recognition(srcPng, group) {
    const srcPngData = srcPng.data;
    if (srcPngData[3] > 0)
        throw new Error('Are you sure the background is transparent?');
    const layers = group.layers;
    const splitSpace = group.recognizeOpt.splitSpace;
    const maxLayerHeight = group.maxLayerHeight;
    const fonts = [];
    for (let i = 0, length = layers.length; i < length; i++) {
        let layer = layers[i];
        if (
            layer.x < 0 ||
            layer.y < 0 ||
            layer.x + layer.width > srcPng.width ||
            layer.y + layer.height > srcPng.height
        ) {
            throw new Error('Layer is out of bounds!');
        }

        group.exportsOpt.setDefault(layer.size, layer.size);

        let start = NaN;
        let end = 0;
        let spaceCount = 0;
        let fontCount = 0;
        const xLen = Math.min(
            layer.x + layer.width + splitSpace * 2,
            srcPng.width
        );
        const yLen = layer.y + layer.height;
        for (let x = layer.x; x < xLen; x++) {
            for (let y = layer.y; y < yLen; y++) {
                const idx = (srcPng.width * y + x) << 2;
                const alpha = srcPngData[idx + 3];
                if (alpha > 0) {
                    if (isNaN(start)) start = end = x; // 开始识别
                    end++;
                    spaceCount = 0;
                    break;
                    // start不为NaN说明已经开始了一个字的识别
                    // 且当一列都是透明时
                } else if (!isNaN(start) && y === yLen - 1) {
                    spaceCount++;
                    // 当连续超过splitSpace列透明时则这个字识别结束
                    if (spaceCount > splitSpace) {
                        const font = new Font(
                            layer.getFontText(fontCount, true)
                        );
                        font.setBound(
                            start,
                            layer.y - (maxLayerHeight - layer.height),
                            end - splitSpace - start,
                            maxLayerHeight
                        );
                        fonts.push(font);
                        fontCount++;
                        // 从新开始识别下一个字
                        start = NaN;
                    } else {
                        end++;
                    }
                }
            }
        }
        layer.showNoCorrespondingError(fontCount);
        layer.hasSpace() && fonts.push(new Font(SPACE));
        layer.hasTab() && fonts.push(new Font(TAB));
    }
    return fonts;
}

async function build(fonts) {
    const length = fonts.length;
    if (length > 0) {
        const layout = Layout('binary-tree');
        const unique = [];
        const specialItems = [];
        const customPng = {};
        for (let i = 0; i < length; i++) {
            const font = fonts[i];
            if (unique.indexOf(font.id) === -1) {
                if (font.isCustom()) {
                    const png = await font.readCustomPng();
                    if (png !== null) {
                        customPng[font.id] = png;
                    } else break;
                }
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
        layoutInfo.customPng = customPng;
        return layoutInfo;
    }
    return null;
}

async function exportGroups(srcPng, groups) {
    const taskAll = [];
    for (let i = 0, length = groups.length; i < length; i++) {
        taskAll.push(exportGroup(srcPng, groups[i]));
    }
    await Promise.all(taskAll);
}

async function exportGroup(srcPng, group) {
    const option = group.option;
    const groupOpt = group.groupOpt;
    const layoutInfo = await build(
        recognition(srcPng, group).concat(groupOpt.ext.chars)
    );
    if (layoutInfo !== null) {
        // TODO
        const exportsOpt = groupOpt.exports;
        let output = exportsOpt.output;
        let filename = exportsOpt.filename;
        if (!output) {
            output = option.output;
        }
        if (!filename) {
            filename = option.filename;
            filename += group.getFilenameExt(output, filename);
        }
        const outputPath = path.join(output, filename);
        await Promise.all([
            exportPng(srcPng, layoutInfo, outputPath),
            exportFnt(exportsOpt, layoutInfo, filename, outputPath),
        ]);
    }
}

async function exportPng(srcPng, layoutInfo, outputPath) {
    const distPng = createPng(layoutInfo.width, layoutInfo.height);
    for (let i = 0, length = layoutInfo.items.length; i < length; i++) {
        const font = layoutInfo.items[i];
        let _srcPng = srcPng;
        if (font.isCustom()) {
            _srcPng = layoutInfo.customPng[font.id];
        }
        _srcPng.bitblt(
            distPng,
            font.posX,
            font.posY,
            font.width,
            font.height,
            font.x,
            font.y
        );
    }
    await writePng(outputPath + PNG_EXT, distPng);
}

async function exportFnt(exportOpt, layoutInfo, filename, outputPath) {
    const fonts = layoutInfo.items.concat(layoutInfo.specialItems);
    const parser = new BmfFntParser();
    await parser.parse(exportOpt.bmfFntTemp);
    parser.replace('size', exportOpt.size);
    parser.replace('lineHeight', exportOpt.lineHeight);
    parser.replace('file', filename + PNG_EXT);
    parser.replace('scaleW', layoutInfo.width);
    parser.replace('scaleH', layoutInfo.height);
    parser.replace('count', fonts.length);
    for (let i = 0, length = fonts.length; i < length; i++) {
        parser.addChar(fonts[i]);
    }
    await parser.save2BmfFnt(outputPath + FNT_EXT);
}

export async function exec(psdPath, output, filename, inputPng) {
    let opt = new Option();
    opt.input = psdPath;
    opt.output = output;
    opt.filename = filename;
    opt.inputPng = inputPng;
    await runTask(opt);
}

export async function run(option) {
    await runTask(new Option(option));
}
