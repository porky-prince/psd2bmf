import { isString } from "../utils";
import { SPACE, TAB } from "../const";

export class Font {
    constructor(text) {
        this._charCode = NaN;
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

    isSpace() {
        return this._text === SPACE;
    }

    isTab() {
        return this._text === TAB;
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
