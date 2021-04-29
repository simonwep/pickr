import {hsvToCmyk, hsvToHex, hsvToHsl, hsvToRgb} from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
export function HSVaColor(h = 0, s = 0, v = 0, a = 1) {
    const mapper = (original, next) => (precision = -1) => {
        return next(~precision ? original.map(v => Number(v.toFixed(precision))) : original);
    };

    const that = {
        h, s, v, a,

        toHSV() {
            const hsv = [that.h, that.s, that.v];
            hsv.toString = mapper(hsv, arr => `hsv(${arr[0]}, ${arr[1]}%, ${arr[2]}%)`);
            return hsv;
        },

        toHSVA() {
            const hsva = [that.h, that.s, that.v, that.a];
            hsva.toString = mapper(hsva, arr => `hsva(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsva;
        },

        toHSL() {
            const hsl = hsvToHsl(that.h, that.s, that.v);
            hsl.toString = mapper(hsl, arr => `hsl(${arr[0]}, ${arr[1]}%, ${arr[2]}%)`);
            return hsl;
        },

        toHSLA() {
            const hsla = [...hsvToHsl(that.h, that.s, that.v), that.a];
            hsla.toString = mapper(hsla, arr => `hsla(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsla;
        },

        toRGB() {
            const rgb = hsvToRgb(that.h, that.s, that.v);
            rgb.toString = mapper(rgb, arr => `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`);
            return rgb;
        },

        toRGBA() {
            const rgba = [...hsvToRgb(that.h, that.s, that.v), that.a];
            rgba.toString = mapper(rgba, arr => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${that.a})`);
            return rgba;
        },

        toCMYK() {
            const cmyk = hsvToCmyk(that.h, that.s, that.v);
            cmyk.toString = mapper(cmyk, arr => `cmyk(${arr[0]}%, ${arr[1]}%, ${arr[2]}%, ${arr[3]}%)`);
            return cmyk;
        },

        toHEX() {
            const hex = hsvToHex(that.h, that.s, that.v);
            hex.toString = () => `#${hex.join('').toUpperCase()}`;
            return hex;
        },

        toHEXA() {
            if (that.a === 1) {
                return that.toHEX();
            }
            const alpha = Number((that.a * 255).toFixed(0)).toString(16).toUpperCase().padStart(2, '0');
            const hexa = [...hsvToHex(that.h, that.s, that.v), alpha];
            hexa.toString = () => `#${hexa.join('').toUpperCase()}`;
            return hexa;
        },

        clone: () => HSVaColor(that.h, that.s, that.v, that.a)
    };

    return that;
}
