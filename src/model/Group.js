import Layer from './Layer';

const EXPORT_KEY = 'export?';

export default class Group {
    static canExport(data) {
        return data.isGroup() && data.name.indexOf(EXPORT_KEY) !== -1;
    }

    constructor(option) {
        this._option = option;
        this._index = NaN;
        this._onlyOne = false;
        this._group = null;
        this._layers = null;
        this._maxLayerHeight = 0;
    }

    init(index, data) {
        if (Group.canExport(data)) {
            this._group = data;
            this._index = index;
            this.groupOpt.recognition = data.name.slice(
                data.name.indexOf(EXPORT_KEY) + EXPORT_KEY.length
            );
            this.createLayers();
        }
    }

    get option() {
        return this._option;
    }

    get groupOpt() {
        return this._option.getGroup(this._index);
    }

    get recognizeOpt() {
        return this.groupOpt.recognition;
    }

    get exportsOpt() {
        return this.groupOpt.exports;
    }

    get extOpt() {
        return this.groupOpt.ext;
    }

    get index() {
        return this._index;
    }

    get onlyOne() {
        return this._onlyOne;
    }

    set onlyOne(value) {
        this._onlyOne = value;
    }

    getFilenameExt(output, filename) {
        const inputInfo = this.option.inputInfo;
        let ext = '_' + this.index;
        if (
            this._onlyOne &&
            (inputInfo.dir !== output || inputInfo.name !== filename)
        ) {
            ext = '';
        }
        return ext;
    }

    canExport() {
        return this._group !== null;
    }

    createLayers() {
        const layers = (this._layers = []);
        const children = this._group.children();
        const groupOpt = this.groupOpt;
        for (let i = 0, length = children.length; i < length; i++) {
            const layer = new Layer(children[i], groupOpt);
            if (this._maxLayerHeight < layer.height) {
                this._maxLayerHeight = layer.height;
            }
            layers.push(layer);
        }
    }

    get layers() {
        return this._layers;
    }

    get maxLayerHeight() {
        return this._maxLayerHeight;
    }
}
