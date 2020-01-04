export default class Layer {
    constructor(layer, option) {
        this._layer = layer;
        this.x = layer.left;
        this.y = layer.top;
        this.width = layer.width;
        this.height = layer.height;
    }
}

Layer.NAME = 'layer';