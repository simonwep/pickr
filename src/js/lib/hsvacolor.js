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

    toHSVA() {
        const hsva = [this.h, this.s, this.v, this.a];

        hsva.toString = function () {
            return `hsva(${this[0]}, ${this[1]}%, ${this[2]}%, ${this[3]})`;
        };

        return hsva;
    }

    toHSLA() {
        const hsl = Color.hsvToHsl(this.h, this.s, this.v).concat([this.a]);

        hsl.toString = function () {
            return `hsla(${this[0]}, ${this[1]}%, ${this[2]}%, ${this[3]})`;
        };

        return hsl;
    }

    toRGBA() {
        const rgba = Color.hsvToRgb(this.h, this.s, this.v).concat([this.a]);

        rgba.toString = function () {
            return `rgba(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]})`;
        };

        return rgba;
    }

    toHEX() {
        const hex = Color.hsvToHex(this.h, this.s, this.v);

        hex.toString = function () {
            return `#${this.join('').toUpperCase()}`;
        };

        return hex;
    }

    toCMYK() {
        const cmyk = Color.hsvToCmyk(this.h, this.s, this.v);

        cmyk.toString = function () {
            `cmyk(${this[0]}%, ${this[1]}%, ${this[2]}%, ${this[3]}%)`;
        };

        return cmyk;
    }

    clone() {
        return new HSVaColor(this.h, this.s, this.v, this.a);
    }
}