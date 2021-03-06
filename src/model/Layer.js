import { SPACE, TAB } from '../const';

function nameError(name) {
	if (!name) throw new Error('Layer name is necessary and correspond to the picture!');
}

export default class Layer {
	constructor(layer, groupOpt) {
		let offset = groupOpt.recognition.offset;
		this._layer = layer;
		this.dealName(layer.name);
		this.x = layer.left - offset.left;
		this.y = layer.top - offset.top;
		this.width = layer.width + offset.left + offset.right;
		this.height = layer.height + offset.top + offset.bottom;
	}

	get size() {
		return this._layer.height;
	}

	dealName(name) {
		nameError(name);
		if ((this._hasTab = name.indexOf(TAB) !== -1)) {
			name = name.replace(TAB, '');
		}

		if ((this._hasSpace = name.indexOf(SPACE) !== -1)) {
			name = name.replace(SPACE, '');
		}

		this._name = name;
	}

	hasSpace() {
		return this._hasSpace;
	}

	hasTab() {
		return this._hasTab;
	}

	getFontText(i, must) {
		const name = this._name[i];
		if (must) nameError(name);
		return name;
	}

	showOutOfBoundsError(maxWidth, maxHeight) {
		if (
			this.x < 0 ||
			this.y < 0 ||
			this.x + this.width > maxWidth ||
			this.y + this.height > maxHeight
		) {
			throw new Error('Layer is out of bounds!');
		}
	}

	showNoCorrespondingError(fontCount) {
		const name = this._name;
		if (fontCount !== name.length)
			throw new Error(
				'There is no one-to-one correspondence between the graph and the word:' +
					'\n\tLayer name(trim):' +
					name +
					'\n\tRecognizable font count:' +
					fontCount +
					'\n\tVisible font count:' +
					name.length
			);
	}
}
