import PSD from "psd";
import Group from "./model/Group";

let groups = [];


const psd = PSD.fromFile("../test/assets/test1.psd");
psd.parse();

let tree = psd.tree();
console.log(tree);
let children = tree.children();
for (let i = 0, length = children.length; i < length; i++) {
    let child = children[i];
    if (child.type === Group.NAME) {
        groups.push(new Group(child.name));
    }
}
// psd.image.saveAsPng('./output.png');
console.log(psd.image.toPng());
