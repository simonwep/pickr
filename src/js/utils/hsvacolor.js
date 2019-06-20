import {hsvToHsl, hsvToRgb, hsvToCmyk, hsvToHex} from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
export function HSVaColor(h = 0, s = 0, v = 0, a = 1) {

    const that = {
        h, s, v, a,

        toHSVA() {
            const hsva = [that.h, that.s, that.v, that.a];
            hsva.toString = () => `hsva(${that.h}, ${that.s}%, ${that.v}%, ${that.a})`;
            return hsva;
        },

        toHSLA() {
            const hsla = [...hsvToHsl(that.h, that.s, that.v), that.a];
            hsla.toString = () => `hsla(${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3].toFixed(1)})`;
            return hsla;
        },

        toRGBA() {
            const rgba = [...hsvToRgb(that.h, that.s, that.v), that.a];
            rgba.toString = () => `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3].toFixed(1)})`;
            return rgba;
        },

        toCMYK() {
            const cmyk = hsvToCmyk(that.h, that.s, that.v);
            cmyk.toString = () => `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
            return cmyk;
        },

        toHEXA() {
            const hex = hsvToHex(that.h, that.s, that.v);

            // Check if alpha channel make sense, convert it to 255 number space, convert
            // to hex and pad it with zeros if needet.
            const alpha = that.a >= 1 ? '' : Number((that.a * 255).toFixed(0))
                .toString(16)
                .toUpperCase().padStart(2, '0');

            alpha && hex.push(alpha);
            hex.toString = () => `#${hex.join('').toUpperCase() + alpha}`;
            return hex;
        },

        clone: () => HSVaColor(that.h, that.s, that.v, that.a)
    };

    return that;
}
