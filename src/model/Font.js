export class Font {
    constructor(text) {
        this.text = text;
        this.setBound(0, 0, 0, 0);
    }

    setBound(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getCharCode() {
        return this.text.charCodeAt(0);
    }
}