import * as Color from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
export function HSVaColor(h = 0, s = 0, v = 0, a = 1) {

    const that = {
        h, s, v, a,

        toHSVA() {
            const hsv = [that.h, that.s, that.v].map(Math.round);
            hsv.toString = () => `hsva(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%, ${that.a.toFixed(1)})`;
            return hsv;
        },

        toHSLA() {
            const hsl = Color.hsvToHsl(that.h, that.s, that.v).map(Math.round);
            hsl.toString = () => `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, ${that.a.toFixed(1)})`;
            return hsl;
        },

        toRGBA() {
            const rgb = Color.hsvToRgb(that.h, that.s, that.v).map(Math.round);
            rgb.toString = () => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${that.a.toFixed(1)})`;
            return rgb;
        },

        toHEX() {
            const hex = Color.hsvToHex(...[that.h, that.s, that.v]).concat([that.a]);

            hex.toString = () => {

                // Check if alpha channel make sense, convert it to 255 number space, convert
                // to hex and pad it with zeros if needet.
                const alpha = hex[3] >= 1 ? '' : Number((hex[3] * 255).toFixed(0))
                    .toString(16)
                    .toUpperCase()
                    .padStart(2, '0');

                return `#${hex.slice(0, 3).join('').toUpperCase() + alpha}`;
            };

            return hex;
        },

        toCMYK() {
            const cmyk = Color.hsvToCmyk(that.h, that.s, that.v).map(Math.round);
            cmyk.toString = () => `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
            return cmyk;
        },

        clone() {
            return new HSVaColor(that.h, that.s, that.v, that.a);
        }
    };

    return that;
}