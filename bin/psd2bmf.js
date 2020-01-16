#! /usr/bin/env node

'use strict';

const exec = require('../dist/main').exec;
const argv = require('yargs')
    .version()
    .option('s', {
        alias: 'src',
        demand: true,
        describe: 'The psd file path.',
        type: 'string',
    })
    .option('d', {
        alias: 'dist',
        describe: 'Global output dir.',
        type: 'string',
    })
    .option('f', {
        alias: 'file',
        describe: 'Global filename.',
        type: 'string',
    })
    .option('p', {
        alias: 'png',
        describe: 'The psd export png file path.',
        type: 'string',
    })
    .usage('psd2bmf [options]')
    .example('psd2bmf -s test.psd')
    .help('h')
    .alias('h', 'help')
    .epilog('MIT license').argv;

exec(argv.src, argv.dist, argv.file, argv.png);
