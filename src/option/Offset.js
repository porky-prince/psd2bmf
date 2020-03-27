export default class Offset {
	constructor() {
		this.reset();
	}

	parse(offset) {
		if (!offset) return;
		let arr = offset.split(',').map((val) => {
			return parseInt(val, 10);
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
