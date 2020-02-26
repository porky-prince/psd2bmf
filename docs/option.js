module.exports = {
	/** (necessary)psd path. */
	input: '',
	/** Psd export png file path. default: [psd_file_dir/psd_filename.png] */
	inputPng: '',
	/** Global output dir. default: [psd_file_dir] */
	output: '',
	/** Global filename. default: [psd_filename] */
	filename: '',
	/** Each group option */
	groups: [
		{
			/** Recognition option */
			recognition: {
				/** Split offset(top,right,bottom,left). */
				offset: '0,0,0,0',
				/** Split space(px) */
				splitSpace: 8,
				/** Split padding(px) */
				padding: 0,
			},
			/** Exports option */
			exports: {
				/** Output dir, will overwrite global output. */
				output: '',
				/** Output filename, will overwrite global filename. */
				filename: '',
				/** Font size. default: [Auto] */
				size: 0,
				/** LineHeight. default: [Auto] */
				lineHeight: 0,
				/** *.fnt file temp */
				bmfFntTemp: '',
			},
			/** Ext option */
			ext: {
				/** Chars option */
				chars: [
					{
						/** Text */
						text: '',
						/** *.png file path */
						path: '',
					},
				],
			},
		},
	],
};
