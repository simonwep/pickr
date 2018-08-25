import * as Color from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
export function HSVaColor(h = 0, s = 0, v = 0, a = 1) {

    const ceil = Math.ceil;
    const that = {
        h, s, v, a,

        toHSVA() {
            const hsv = [that.h, that.s, that.v];
            const rhsv = hsv.map(ceil);

            hsv.toString = () => `hsva(${rhsv[0]}, ${rhsv[1]}%, ${rhsv[2]}%, ${that.a.toFixed(1)})`;
            return hsv;
        },

        toHSLA() {
            const hsl = Color.hsvToHsl(that.h, that.s, that.v);
            const rhsl = hsl.map(ceil);

            hsl.toString = () => `hsla(${rhsl[0]}, ${rhsl[1]}%, ${rhsl[2]}%, ${that.a.toFixed(1)})`;
            return hsl;
        },

        toRGBA() {
            const rgb = Color.hsvToRgb(that.h, that.s, that.v);
            const rrgb = rgb.map(ceil);

            rgb.toString = () => `rgba(${rrgb[0]}, ${rrgb[1]}, ${rrgb[2]}, ${that.a.toFixed(1)})`;
            return rgb;
        },

        toCMYK() {
            const cmyk = Color.hsvToCmyk(that.h, that.s, that.v);
            const rcmyk = cmyk.map(ceil);

            cmyk.toString = () => `cmyk(${rcmyk[0]}%, ${rcmyk[1]}%, ${rcmyk[2]}%, ${rcmyk[3]}%)`;
            return cmyk;
        },

        toHEX() {
            const hex = Color.hsvToHex(...[that.h, that.s, that.v]);

            hex.toString = () => {

                // Check if alpha channel make sense, convert it to 255 number space, convert
                // to hex and pad it with zeros if needet.
                const alpha = that.a >= 1 ? '' : Number((that.a * 255).toFixed(0))
                    .toString(16)
                    .toUpperCase()
                    .padStart(2, '0');

                return `#${hex.join('').toUpperCase() + alpha}`;
            };

            return hex;
        },

        clone() {
            return HSVaColor(that.h, that.s, that.v, that.a);
        }
    };

    return that;
}