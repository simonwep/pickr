import {compile} from "sass";
import {mkdir, readdir, writeFile} from "node:fs/promises";
import {resolve, basename} from "node:path";
import pkg from "../package.json" with {type: 'json'};

const dist = './dist/themes';
await mkdir(dist).catch(() => 0);

const src = './src/scss/themes';
const themes = await readdir(src);

const banner = `/*! Pickr ${pkg.version} MIT | https://github.com/simonwep/pickr */`

for (const theme of themes) {
    const name = basename(theme, '.scss');
    const path = resolve(src, theme);

    const result = await compile(path, {
        style: "compressed",
        sourceMap: true,
        sourceMapIncludeSources: true,
        loadPaths: ["./src/styles"]
    });

    await writeFile(
        resolve(dist, `${name}.min.css`),
        `${banner}\n${result.css}`,
    );
}
