import Option from "./Option";
import Layer from "./Layer";

const EXPORT_KEY = 'export?';

export default class Group {
    constructor(psdFileName, data) {
        this._index = NaN;
        this._group = null;
        this._option = null;
        this._layers = null;
        this.init(psdFileName, data);
    }

    init(psdFileName, data) {
        let option = data.name;
        if (data.isGroup() && option.indexOf(EXPORT_KEY) !== -1) {
            option = option.replace(EXPORT_KEY, '');
            this._group = data;
            this._option = new Option(psdFileName, option);
            this.createLayers();
        }
    }

    get option() {
        return this._option;
    }

    get index() {
        return this._index;
    }

    set index(value) {
        this._index = value;
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
