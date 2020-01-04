export default class Offset {
    top = 0;
    right = 0;
    bottom = 0;
    left = 0;

    parse(offset) {
        if (!offset) return;
        let arr = offset.split(',').map((val) => {
            return Number(val);
        });
        this.set.apply(this, arr);
    }

    set(top = 0, right = 0, bottom = 0, left = 0) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    reset() {
        this.set();
    }
}