import Offset from "./Offset";
import queryString from "query-string";

export default class Option {
    constructor(option) {
        this._offset = new Offset();
        this._size = 20;
        this._lineHeight = 20;
        this._xAdvance = 0;
        this._extInfo = null;
        this.parse(option);
    }

    get offset() {
        return this._offset;
    }

    set offset(value) {
        this._offset.parse(value);
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get lineHeight() {
        return this._lineHeight;
    }

    set lineHeight(value) {
        this._lineHeight = value;
    }

    get xAdvance() {
        return this._xAdvance;
    }

    set xAdvance(value) {
        this._xAdvance = value;
    }

    parse(option) {
        if (!option) return;
        const opt = queryString.parse(option);
        for (let attr in opt) {
            if (attr in this) {
                this[attr] = opt[attr];
            }
        }
    }
}