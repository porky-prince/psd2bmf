import { SPACE, TAB } from "../const";

export default class Layer {
    constructor(layer, option) {
        let offset = option.offset;
        this._layer = layer;
        this.dealName(layer.name);
        this.x = layer.left - offset.left;
        this.y = layer.top - offset.top;
        this.width = layer.width + offset.left + offset.right;
        this.height = layer.height + offset.top + offset.bottom;
    }

    dealName(name) {
        if (!name) throw new Error('Layer name is necessary and correspond to the picture!');
        if (this._hasSpace = name.indexOf(SPACE) !== -1) {
            name = name.replace(SPACE, '');
        } else if (this._hasTab = name.indexOf(TAB) !== -1) {
            name = name.replace(TAB, '');
        }
        this._name = name;
    }

    hasSpace() {
        return this._hasSpace;
    }

    hasTab() {
        return this._hasTab;
    }

    getFontText(i) {
        return this._name[i];
    }
}
