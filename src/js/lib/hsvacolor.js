import * as Color from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
export class HSVaColor {

    constructor(h = 0, s = 0, v = 0, a = 1) {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }

    toHSLa(raw) {
        const [h, s, l] = Color.hsvToHsl(this.h, this.s, this.v);
        return raw ? [h, s, l, this.a] : `hsla(${h}, ${s}%, ${l}%, ${this.a})`;
    }


    toRGBa(raw) {
        const rgba = Color.hsvToRgb(this.h, this.s, this.v).concat([this.a]);
        return raw ? rgba : `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
    }


    toHEX(raw) {
        const hex = Color.hsvToHex(this.h, this.s, this.v);
        return raw ? hex : `#${hex.join('').toUpperCase()}`;
    }


    toCMYK(raw) {
        const cmyk = Color.hsvToCmyk(this.h, this.s, this.v);
        return raw ? cmyk : `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
    }

    clone(){
        return new HSVaColor(this.a, this.s, this.v, this.a);
    }
}