# psd2bmf

This is a tool for converting PSD file directly to bmfont. All you need to do is provide a PSD file from the UI designer without any software dependencies or tedious operations.

[example-img]: docs/demo.jpg

![example][example-img]

### Install

npm:

```shell
$ npm install psd2bmf --save-dev
```

yarn:

```shell
$ yarn add psd2bmf --dev
```

### Usage

From npm for use as a command line app:

```shell
$ npm install -g psd2bmf
```

#### Command line usage

```shell
$ psd2bmf [options]
```

example:

```shell
$ psd2bmf -i input.psd -o output
```

#### Command line options

```
    --version               	Print version number.
    -h, --help                  Print usage information.
    -i, --input                 PSD source file path.
    -o, --output [options]   	Output dir.
    -f, --filename [options]    Output filename.
    -p, --png [options]        	PNG images exported based on PSD. TODO
```

#### Use in code

It can also be locally installed and used in code:

```javascript
const { exec, run } = require('psd2bmf');

// exec
exec('test.psd'); // => test.fnt,test.png
// or
exec('test.psd', 'output'); // => output/test.fnt,output/test.png
// or
exec('test.psd', 'output', 'other'); // => output/other.fnt,output/other.png
// run
run(option);
```

##### option

```javascript
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
```

### Notice

-   TODO
