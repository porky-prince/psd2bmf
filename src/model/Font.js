import { isString, readPng } from "../utils";
import { SPACE, TAB } from "../const";

export class Font {
    constructor(text) {
        this._charCode = NaN;
        this._text = '';
        this._path = '';
        this.text = text;
        this.setBound(0, 0, 0, 0);
        this.pos(0, 0);
    }

    get text() {
        return this._text;
    }

    set text(value) {
        if (value && isString(value)) {
            this._text = value;
            this._charCode = this._text.charCodeAt(0);
        }
    }

    get id() {
        return this._charCode;
    }

    get path() {
        return this._path;
    }

    set path(value) {
        this._path = value;
    }

    isSpace() {
        return this._text === SPACE;
    }

    isTab() {
        return this._text === TAB;
    }

    isCustom() {
        return this._text && this._path && isString(this._path);
    }

    async readCustomPng() {
        const png = await readPng(this._path);
        png !== null && this.setBound(0, 0, png.width, png.height);
        return png;
    }

    setBound(posX, posY, width, height) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.xadvance = width;
    }

    pos(x, y) {
        this.x = x;
        this.y = y;
    }
}
