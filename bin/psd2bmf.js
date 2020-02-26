#! /usr/bin/env node

'use strict';

const exec = require('../dist/main').exec;
const argv = require('yargs')
	.version()
	.option('i', {
		alias: 'input',
		demand: true,
		describe: 'The psd file path.',
		type: 'string',
	})
	.option('o', {
		alias: 'output',
		describe: 'Global output dir.',
		type: 'string',
	})
	.option('f', {
		alias: 'filename',
		describe: 'Global filename.',
		type: 'string',
	})
	.option('p', {
		alias: 'png',
		describe: 'The psd export png file path.',
		type: 'string',
	})
	.usage('psd2bmf [options]')
	.example('psd2bmf -i test.psd')
	.help('h')
	.alias('h', 'help')
	.epilog('MIT license').argv;

exec(argv.input, argv.output, argv.filename, argv.png);
