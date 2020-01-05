import fs from "fs";
import {PNG} from "pngjs";

export async function readPng(pngPath) {
    return new Promise(resolve => {
        fs.exists(pngPath, exists => {
            if (exists) {
                fs.createReadStream(pngPath)
                    .pipe(createPng(undefined, undefined))
                    .on('parsed', function () {
                        resolve(this);
                    });
            } else {
                resolve(null, 'The png does not exist:' + pngPath);
            }
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