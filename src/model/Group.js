import Option from "./Option";

export default class Group {
    static NAME = 'group';
    static EXPORT_KEY = 'export?';

    _option = new Option();

    _isExport = false;

    constructor(option) {
        if (option.indexOf(Group.EXPORT_KEY) !== -1) {
            option = option.replace(Group.EXPORT_KEY, '');
            this._option.parse(option);
            this._isExport = true;
        }
    }

    get isExport() {
        return this._isExport;
    }
}