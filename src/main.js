import path from "path";
import fs from "fs";
import PSD from "psd";
import {PNG} from 'pngjs';
import Group from "./model/Group";

const psd = PSD.fromFile(path.join(__dirname, "../test/assets/test1.psd"));
psd.parse();

let bigPng = psd.image.toPng();
let tree = psd.tree();
console.log(tree);
let children = tree.children();
let groups = [];
for (let i = 0, length = children.length; i < length; i++) {
    let child = children[i];
    groups.push(new Group(child));
}

bigPng.data = new Buffer(bigPng.data);

console.log(bigPng);

for (let i = 0, length = groups.length; i < length; i++) {
    let group = groups[i];
    if (group.canExport()) {
        let layers = group.layers;
        for (let j = 0, length1 = layers.length; j < length1; j++) {
            let layer = layers[j];
            let png = new PNG({width: layer.width, height: layer.height});
            bigPng.bitblt(png, layer.x, layer.y, layer.width, layer.height, 0, 0);
            png.pack().pipe(fs.createWriteStream(path.join(__dirname, `../test/output/out${j}.png`)));
        }
    }
}
