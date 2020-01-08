export default class ExportsOpt {
    constructor() {
        this._output = '';
        this._filename = '';
        this._bmfFntTemp = '';
        this._size = NaN;
        this._lineHeight = NaN;
    }

    get output() {
        return this._output;
    }

    set output(value) {
        this._output = value;
    }

    get filename() {
        return this._filename;
    }

    set filename(value) {
        this._filename = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        if (value > 0) this._size = value;
    }

    get lineHeight() {
        return this._lineHeight;
    }

    set lineHeight(value) {
        if (value > 0) this._lineHeight = value;
    }

    get bmfFntTemp() {
        return this._bmfFntTemp;
    }

    set bmfFntTemp(value) {
        this._bmfFntTemp = value;
    }

    setDefault(size, lineHeight) {
        if (!this._size) {
            this._size = size;
        }
        if (!this._lineHeight) {
            this._lineHeight = lineHeight;
        }
    }
}
