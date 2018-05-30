/**
 * Flat UI color-picker.
 * @author  Simon Reinisch <toports@gmx.de>
 * @license MIT
 */

// Import styles
import './../css/color-picker.css';
// Imports
import * as _ from './lib/utils';
import HSLColor from './lib/hslcolor';
import Moveable from './helper/moveable';
import Selectable from './helper/selectable';

class ColorPicker {

    constructor(opt) {

        // Default values
        const def = {};

        this.options = Object.assign(def, opt);

        // Bind all private methods
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (let fn of methods) {
            if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                this[fn] = this[fn].bind(this);
            }
        }

        // Replace element with color picker
        this.root = (() => {
            const toReplace = this.options.el;
            const html = create();

            // Replace element with actual color-picker
            toReplace.parentElement.replaceChild(html.root, toReplace);

            // Return object
            return html;
        })();

        this.hsl = new HSLColor();
        this._init();
    }

    _init() {

        // Instance reference
        const inst = this;

        const components = {

            palette: new Moveable({
                element: inst.root.canvas.picker,
                wrapper: inst.root.canvas.canvas,

                onchange(x, y) {
                    const hsl = inst.hsl;

                    // Calculate saturation based on the position
                    hsl.s = Math.round((x / this.wrapper.offsetWidth) * 100);

                    // To the right is the lightness-maximum only 50
                    const fac = 100 - (hsl.s * 0.5);
                    hsl.l = Math.round(fac - ((y / this.wrapper.offsetHeight) * fac));

                    // Set picker background to current color.js
                    this.element.style.background = hsl.toHSL();

                    // Update infobox
                    inst.root.result.result.value = (() => {

                        // Construct function name and call if present
                        const method = 'to' + inst.root.result.type().value;
                        if (typeof hsl[method] === 'function') {
                            return hsl[method]();
                        }
                    })();

                    document.querySelector('head meta[name="theme-color"]').setAttribute('content', hsl.toHEX());
                }
            }),

            hueSlider: new Moveable({
                lockX: true,
                element: inst.root.hueSlider.picker,
                wrapper: inst.root.hueSlider.hueSlider,

                onchange(x, y) {
                    const hsl = inst.hsl;

                    // Calculate hue
                    hsl.h = Math.round((y / this.wrapper.offsetHeight) * 360);

                    // Update color.js
                    this.element.style.backgroundColor = `hsl(${hsl.h}, 100%, 50%)`;
                    components.palette.options.wrapper.style.background = `linear-gradient(to top, black, transparent), linear-gradient(to left, hsl(${hsl.h}, 100%, 50%), transparent)`;

                    // Trigger
                    components.palette._tapmove();
                }
            }),

            selectable: new Selectable({
                elements: inst.root.result.options,
                className: 'active',
                onchange: () => components.hueSlider._tapmove()
            })
        };

        // Trigger hue slider for initialization
        components.hueSlider._tapmove();

        this.components = components;

        // Select on click
        this.root.result.result.addEventListener('click', (e) => e.target.select());
    }

    /**
     * Set a specific color.
     * @param h Hue
     * @param s Saturation
     * @param l Lightness
     */
    setHSL(h = 360, s = 0, l = 0) {

        // Validate hsl
        if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100)
            return;

        // Calculate y position of hue slider
        const sliderWrapper = this.components.hueSlider.options.wrapper;
        const sliderY = sliderWrapper.offsetHeight * (h / 360);
        this.components.hueSlider.update(0, sliderY);

        // Calculate y and x position of color palette
        const pickerWrapper = this.components.palette.options.wrapper;
        const fac = (s / 100) / 100;
        const pickerX = pickerWrapper.offsetWidth * (s / 100);
        const pickerY = pickerWrapper.offsetHeight * (l * fac);
        this.components.palette.update(pickerX, pickerY);
    }
}

function create() {

    const element = _.createElementFromString(`
         <div class="color-picker">

            <div class="selection">
                <div class="color-palette">
                    <div class="picker"></div>
                    <div class="canvas"></div>
                </div>

                <div class="color-chooser">
                    <div class="picker"></div>
                    <div class="hue slider"></div>
                </div>
            </div>


            <div class="input">
                <input class="result" type="text" spellcheck="false" readonly>
                <input class="type active" value="HEX" type="button">
                <input class="type" value="RGB" type="button">
                <input class="type" value="HSL" type="button">
                <input class="type" value="CMYK" type="button">
            </div>

        </div>
    `);

    return {
        root: element,

        result: {
            options: element.querySelectorAll('.input .type'),
            type: () => element.querySelector('.input .type.active'),
            result: element.querySelector('.input .result')
        },

        canvas: {
            picker: element.querySelector('.color-palette .picker'),
            canvas: element.querySelector('.color-palette .canvas')
        },

        hueSlider: {
            picker: element.querySelector('.color-chooser .picker'),
            hueSlider: element.querySelector('.color-chooser .hue.slider')
        }
    };
}

module.exports = ColorPicker;