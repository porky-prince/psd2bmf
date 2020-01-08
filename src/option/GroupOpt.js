import RecognizeOpt from "./RecognizeOpt";
import ExportsOpt from "./ExportsOpt";
import ExtOpt from "./ExtOpt";
import { isString, merge, mergeRecognizeArgs } from "../utils";

export default class GroupOpt {
    constructor() {
        this._recognition = new RecognizeOpt();
        this._exports = new ExportsOpt();
        this._ext = new ExtOpt();
    }

    get recognition() {
        return this._recognition;
    }

    set recognition(value) {
        if (isString(value)) {
            mergeRecognizeArgs(this._recognition, value);
        } else {
            merge(this._recognition, value);
        }
    }

    get exports() {
        return this._exports;
    }

    set exports(value) {
        merge(this._exports, value);
    }

    get ext() {
        return this._ext;
    }

    set ext(value) {
        merge(this._ext, value);
    }
}
