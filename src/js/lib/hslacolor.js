import * as Color from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
export class HSLaColor {

    constructor(h = 0, s = 0, l = 0, a = 1) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }

    toHSLa(raw) {
        return raw ? [this.h, this.s, this.l, this.a] : `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
    }

    toRGBa(raw) {
        const rgba = Color.hslToRgb(this.h, this.s, this.l).concat([this.a]);
        return raw ? rgba : `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
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