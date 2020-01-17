# psd2bmf

这是一个直接将 psd 文件转换为 bmfont 的工具，只需要 UI 设计师提供一个 psd 文件即可，无需任何软件依赖以及没有繁琐的操作。

![example](https://gitee.com/porky-prince/psd2bmf/raw/master/docs/example.jpg)

### 安装

使用 npm 安装：

```shell
$ npm install psd2bmf --save-dev
```

或者使用 yarn 安装：

```shell
$ yarn add psd2bmf --dev
```

### 使用

可经过全局安装通过命令行使用：

```shell
$ npm install -g psd2bmf
```

#### 命令行使用

```shell
$ psd2bmf [options]
```

例如：

```shell
$ psd2bmf -i input.psd -o output
```

#### 命令行参数

```
    --version               	查看版本。
    -h, --help                  查看帮助信息。
    -i, --input      			psd源文件路径。
    -o, --output [options]   	输出目录，不传则默认输出在psd源文件目录下。
    -f, --filename [options]    输出文件文件名，不传则默认与psd源文件同名。
    -p, --png [options]        	使用PhotoShop导出的png图片，如果指定则会使用此png图片数据，
    							默认会在psd源文件的目录下查找，找到则使用，找不到则使用psd源文件
    							中的数据，使用PhotoShop导出的png图片质量比使用psd源文件中的更高。
```

#### 在代码中使用

也可局部安装在代码中使用：

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
const option = {
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
                /** split space */
                splitSpace: 10,
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
```

### 注意事项

-   **导出时 psd 背景必须是透明的，若使用导出的 png 图片则不要求 psd 背景透明**
-   **若使用 psd 导出的 png 图片必须是背景透明的**
-   **一种字体是一个分组，欲导出这种字体则分组名必须包含关键字(export?)**
-   **分组中一段话是一个图层，且图层名每个字须与图一一对应**
-   **必须要有明显的间距**
