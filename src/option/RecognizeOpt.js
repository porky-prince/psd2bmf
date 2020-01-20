import Offset from './Offset';

export default class RecognizeOpt {
    constructor() {
        this._offset = new Offset();
        this._splitSpace = 8;
        this._padding = 0;
    }

    get offset() {
        return this._offset;
    }

    set offset(value) {
        this._offset.parse(value);
    }

    get splitSpace() {
        return this._splitSpace;
    }

    set splitSpace(value) {
        if (value > 0) {
            if (value < this._splitSpace / 2) {
                console.warn('The splitSpace is small.');
            }
            this._splitSpace = Math.round(value);
        }
    }

    get padding() {
        return this._padding;
    }

    set padding(value) {
        if (value > 0) this._padding = Math.round(value);
    }
}
