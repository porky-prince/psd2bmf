export const option = {
    /** (necessary)psd path. */
    input: '',
    /** psd export png file path. default: [psd_file_dir/psd_filename.png] */
    inputPng: '',
    /** global output dir. default: [psd_file_dir] */
    output: '',
    /** global filename. default: [psd_filename]*/
    filename: '',
    /** each group option */
    groups: [
        {
            /** recognition option */
            recognition: {
                /** split offset(top,right,bottom,left). */
                offset: '0,0,0,0',
                /** split space(px) */
                splitSpace: 8,
            },
            /** exports option */
            exports: {
                /** output dir, will overwrite global output. */
                output: '',
                /** output filename, will overwrite global filename. */
                filename: '',
                /** font size. default: [Auto] */
                size: 0,
                /** lineHeight. default: [Auto] */
                lineHeight: 0,
                // base: 0,
                // maxWidth: 1024,
                // maxHeight: 1024,
                /** *.fnt file temp */
                bmfFntTemp: '',
            },
            /** ext option */
            ext: {
                /** chars option */
                chars: [
                    {
                        /** text */
                        text: '',
                        /** *.png file path */
                        path: '',
                    },
                ],
            },
        },
    ],
};
