import Option from "./Option";
import Layer from "./Layer";

export default class Group {
    constructor(data) {
        this._group = null;
        this._option = null;
        this._layers = null;
        this.init(data);
    }

    init(data) {
        let option = data.name;
        if (data.isGroup() && option.indexOf(Group.EXPORT_KEY) !== -1) {
            option = option.replace(Group.EXPORT_KEY, '');
            this._group = data;
            this._option = new Option(option);
            this.createLayers();
        }
    }

    canExport() {
        return this._group !== null;
    }

    createLayers() {
        let layers = this._layers = [];
        let children = this._group.children();
        for (let i = 0, length = children.length; i < length; i++) {
            let child = children[i];
            layers.push(new Layer(child, this._option));
        }
    }

    get layers() {
        return this._layers;
    }
}

Group.EXPORT_KEY = 'export?';