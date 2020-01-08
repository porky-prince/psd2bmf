import Layer from "./Layer";

const EXPORT_KEY = 'export?';

export default class Group {

    static canExport(data) {
        return data.isGroup() && data.name.indexOf(EXPORT_KEY) !== -1;
    }

    constructor(option) {
        this._option = option;
        this._index = NaN;
        this._group = null;
        this._layers = null;
    }

    init(index, data) {
        if (Group.canExport(data)) {
            this._group = data;
            this._index = index;
            this.groupOpt.recognition = data.name.replace(EXPORT_KEY, '');
            this.createLayers();
        }
    }

    get option() {
        return this._option;
    }

    get groupOpt() {
        return this._option.getGroup(this._index);
    }

    get index() {
        return this._index;
    }

    canExport() {
        return this._group !== null;
    }

    createLayers() {
        const layers = this._layers = [];
        const children = this._group.children();
        const groupOpt = this.groupOpt;
        for (let i = 0, length = children.length; i < length; i++) {
            layers.push(new Layer(children[i], groupOpt));
        }
    }

    get layers() {
        return this._layers;
    }
}
