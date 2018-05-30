import * as Color from './color';

export default class {

    constructor(h = 0, s = 0, l = 0) {
        this.h = h;
        this.s = s;
        this.l = l;
    }

    toHSL(raw) {
        return raw ? [this.h, this.s, this.l] : `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    }

    toRGB(raw) {
        const rgb = Color.hslToRgb(this.h, this.s, this.l);
        return raw ? rgb : `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }


    toHEX(raw) {
        const hex = Color.hslToHex(this.h, this.s, this.l);
        return raw ? hex : `#${hex.join('').toUpperCase()}`;
    }


    toCMYK(raw) {
        const cmyk = Color.hslToCmyk(this.h, this.s, this.l);
        return raw ? cmyk : `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;

    }
}