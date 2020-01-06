import path from "path";
import fs from "fs-extra";
import { PNG } from "pngjs";
import { ENCODING } from "./const";

export function isString(any) {
    return typeof any === 'string';
}

export async function readFile(filePath, option) {
    return new Promise(resolve => {
        fs.exists(filePath, exists => {
            if (exists) {
                fs.readFile(filePath, option, function (err, data) {
                    err ? resolve(null) : resolve(data);
                });
            } else {
                resolve(null);
            }
        });
    });
}

export async function writeFile(filePath, data, option) {
    return new Promise((resolve, reject) => {
        fs.outputFile(filePath, data, option, err => {
            err ? reject() : resolve();
        });
    });
}

let bmfTemp = null;

export async function readBmfTemp() {
    if (bmfTemp === null) {
        bmfTemp = await readFile(path.join(__dirname, 'temp/bmfTemp.fnt'), ENCODING);
    }
    return bmfTemp;
}

export async function readPng(pngPath) {
    return new Promise(resolve => {
        fs.exists(pngPath, exists => {
            if (exists) {
                fs.createReadStream(pngPath)
                    .pipe(createPng(undefined, undefined))
                    .on('parsed', function () {
                        resolve(this);
                    })
                    .on('error', function () {
                        resolve(null);
                    });
            } else {
                resolve(null);
            }
        });
    });
}

export async function writePng(pngPath, pngData) {
    return new Promise((resolve, reject) => {
        const dir = path.parse(pngPath).dir;
        fs.ensureDir(dir, err => {
            err ? reject() : pngData.pack().pipe(fs.createWriteStream(pngPath)).on('end', resolve);
        });
    });
}

export function createPng(width, height) {
    return new PNG({
        width: width,
        height: height,
        deflateLevel: 0,
        filterType: 0
    });
}

export function parseExportArgs(argsStr) {
    let obj = {};
    if (argsStr && isString(argsStr)) {
        if (/\w+=.+&?/.test(argsStr)) {
            let args = argsStr.split('&');
            for (let i = args.length - 1; i >= 0; i--) {
                let strArr = args[i].split('=');
                let value = strArr[1];
                obj[strArr[0]] = isNaN(Number(value)) ? value : parseInt(value);
            }
        } else {
            console.warn('The export args incorrect.');
        }
    }
    return obj;
}
