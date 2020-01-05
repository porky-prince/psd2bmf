export default class Layer {
    constructor(layer, option) {
        let offset = option.offset;
        this._layer = layer;
        this._name = this._layer.name;
        if (!this._name) throw new Error('Layer name is necessary and correspond to the picture!');
        this.x = layer.left - offset.left;
        this.y = layer.top - offset.top;
        this.width = layer.width + offset.left + offset.right;
        this.height = layer.height + offset.top + offset.bottom;
    }

    getFontText(i) {
        return this._layer.name[i];
    }
}