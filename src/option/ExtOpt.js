import { isArray, merge } from "../utils";
import { Font } from "../model/Font";

export default class ExtOpt {
    constructor() {
        this._chars = [];
    }

    get chars() {
        return this._chars;
    }

    set chars(chars) {
        this._chars.length = 0;
        if (isArray(chars)) {
            for (let i = 0, length = chars.length; i < length; i++) {
                this._chars.push(merge(new Font(), chars[i]));
            }
        }
    }
}
