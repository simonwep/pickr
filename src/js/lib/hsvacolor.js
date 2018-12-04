import * as Color from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
class HSVaColor {

    toHSVA(){
        const hsv = [this.h, this.s, this.v];
        const rhsv = hsv.map(this.ceil);

        hsv.toString = () => `hsva(${rhsv[0]}, ${rhsv[1]}%, ${rhsv[2]}%, ${this.a.toFixed(1)})`;
        return hsv;
    }

    toHSLA(){
        const hsl = Color.hsvToHsl(this.h, this.s, this.v);
        const rhsl = hsl.map(this.ceil);

        hsl.toString = () => `hsla(${rhsl[0]}, ${rhsl[1]}%, ${rhsl[2]}%, ${this.a.toFixed(1)})`;
        return hsl;
    }

    toRGBA(){
        const rgb = Color.hsvToRgb(this.h, this.s, this.v);
        const rrgb = rgb.map(this.ceil);

        rgb.toString = () => `rgba(${rrgb[0]}, ${rrgb[1]}, ${rrgb[2]}, ${this.a.toFixed(1)})`;
        return rgb;
    }

    toCMYK(){
        const cmyk = Color.hsvToCmyk(this.h, this.s, this.v);
        const rcmyk = cmyk.map(this.ceil);

        cmyk.toString = () => `cmyk(${rcmyk[0]}%, ${rcmyk[1]}%, ${rcmyk[2]}%, ${rcmyk[3]}%)`;
        return cmyk;
    }

    toHEX(){
        const hex = Color.hsvToHex(...[this.h, this.s, this.v]);

        hex.toString = () => {

          // Check if alpha channel make sense, convert it to 255 number space, convert
          // to hex and pad it with zeros if needet.
          const alpha = this.a >= 1 ? '' : Number((this.a * 255).toFixed(0))
            .toString(16)
            .toUpperCase()
            .padStart(2, '0');

          return `#${hex.join('').toUpperCase() + alpha}`;
        };

        return hex;
    }

    clone(){
        return new HSVaColor(this.h, this.s, this.v, this.a);
    }

    constructor(h = 0, s = 0, v = 0, a = 1) {
        this.ceil = Math.ceil;
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
}

export default HSVaColor;

