import Offset from "./Offset";
import { parseExportArgs } from "../utils";

export default class Option {
    constructor(psdFilename, option) {
        this._input = '';
        this._output = '';
        this._filename = psdFilename;
        this._offset = new Offset();
        this._splitSpace = 10;
        this._extInfo = null;

        // 生成fnt配置参数
        this._bmfTemp = '';
        this._width = NaN;
        this._height = NaN;
        this._size = NaN;
        this._lineHeight = NaN;
        this._base = NaN;
        this._maxWidth = 1024;
        this._maxHeight = 1024;
        this.parse(option);
    }

    get input() {
        return this._input;
    }

    set input(value) {
        this._input = value;
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
                console.warn("The splitSpace is small.");
            }
            this._splitSpace = value;
        }
    }

    get bmfTemp() {
        return this._bmfTemp;
    }

    set bmfTemp(value) {
        this._bmfTemp = value;
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

    parse(option) {
        this.merge(parseExportArgs(option));
    }

    merge(opt) {
        for (let attr in opt) {
            if (opt.hasOwnProperty(attr) && attr in this) {
                this[attr] = opt[attr];
            }
        }
    }

    parseJson() {
        //todo
    }
}
