/**
 * Flat UI color-picker.
 * @author  Simon Reinisch <toports@gmx.de>
 * @license MIT
 */

// Import styles
import './../css/color-picker.css';

// Imports
import * as Color from './lib/color';
import Moveable from './helper/moveable';
import Selectable from './helper/selectable';

// Elements
const elements = {

    colorPicker: document.querySelector('.color-picker'),

    result: {
        options: document.querySelectorAll('.color-picker .input .type'),
        type: () => document.querySelector('.color-picker .input .type.active'),
        result: document.querySelector('.color-picker .input .result')
    },

    canvas: {
        picker: document.querySelector('.color-picker .color-palette .picker'),
        canvas: document.querySelector('.color-picker .color-palette .canvas')
    },

    slider: {
        picker: document.querySelector('.color-picker .color-chooser .picker'),
        slider: document.querySelector('.color-picker .color-chooser .slider')
    }
};

const HSLColor = {

    h: 0, // Hue
    s: 0, // Saturation
    l: 0, // Lightness

    toHSL(raw) {
        return raw ? [this.h, this.s, this.l] : `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    },

    toRGB(raw) {
        const rgb = Color.hslToRgb(this.h, this.s, this.l);
        return raw ? rgb : `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    },

    toHEX(raw) {
        const hex = Color.hslToHex(this.h, this.s, this.l);
        return raw ? hex : `#${hex.join('').toUpperCase()}`;
    },

    toCMYK(raw) {
        const cmyk = Color.hslToCmyk(this.h, this.s, this.l);
        return raw ? cmyk : `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
    }
};

const slider = new Moveable({
    lockX: true,
    element: elements.slider.picker,
    wrapper: elements.slider.slider,
    onchange(x, y) {
        HSLColor.h = Math.round((y / this.wrapper.offsetHeight) * 360);

        // Update color.js
        this.element.style.backgroundColor = `hsl(${HSLColor.h}, 100%, 50%)`;
        palette.options.wrapper.style.background = `linear-gradient(to top, black, transparent), linear-gradient(to left, hsl(${HSLColor.h}, 100%, 50%), transparent)`;

        // Trigger
        palette._tapmove();
    }
});

const palette = new Moveable({
    element: elements.canvas.picker,
    wrapper: elements.canvas.canvas,
    onchange(x, y) {

        // Calculate saturation based on the position
        HSLColor.s = Math.round((x / this.wrapper.offsetWidth) * 100);

        // To the right is the lightness maximum only 50
        const fac = 100 - (HSLColor.s * 0.5);
        HSLColor.l = Math.round(fac - ((y / this.wrapper.offsetHeight) * fac));

        // Set picker background to current color.js
        this.element.style.background = HSLColor.toHSL();

        // Update infobox
        elements.result.result.value = (() => {

            // Construct function name and call if present
            const method = 'to' + elements.result.type().value;
            if (typeof HSLColor[method] === 'function') {
                return HSLColor[method]();
            }
        })();
    }
});

new Selectable({
    elements: elements.result.options,
    className: 'active',
    onchange: slider._tapmove
});


// Trigger slider for initialization
slider._tapmove();

// Select on click
elements.result.result.addEventListener('click', (e) => e.target.select());