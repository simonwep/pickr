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

            // HSVA has floating point precision but the string
            // representation should use integers.
            const g = n => Math.round(this[n]);
            return `hsva(${g(0)}, ${g(1)}%, ${g(2)}%, ${g(3)})`;
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
        const hex = Color.hsvToHex(this.h, this.s, this.v).concat([this.a]);

        hex.toString = function () {

            // Check if alpha channel make sense, convert it to 255 number space, convert
            // to hex and pad it with zeros if needet.
            const alpha = this[3] === 1 ? '' : Number((this[3] * 255).toFixed(0))
                .toString(16)
                .toUpperCase()
                .padStart(2, '0');

            return `#${this.slice(0, 3).join('').toUpperCase() + alpha}`;
        };

        return hex;
    }

    toCMYK() {
        const cmyk = Color.hsvToCmyk(this.h, this.s, this.v);

        cmyk.toString = function () {
            return `cmyk(${this[0]}%, ${this[1]}%, ${this[2]}%, ${this[3]}%)`;
        };

        return cmyk;
    }

    clone() {
        return new HSVaColor(this.h, this.s, this.v, this.a);
    }
}