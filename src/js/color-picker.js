/**
 * Flat UI color-picker.
 * @author  Simon Reinisch <toports@gmx.de>
 * @license MIT
 */

// Import styles
import './../css/color-picker.css';

// Imports
import * as _ from './lib/utils';
import HSLaColor from './lib/hslacolor';
import Moveable from './helper/moveable';
import Selectable from './helper/selectable';

class ColorPicker {

    constructor(opt) {

        // Default values
        const def = {
            // Coming soon!
        };

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

        this.color = new HSLaColor();
        this.lastColor = new HSLaColor();
        this._buildComponents();
    }

    _buildComponents() {

        // Instance reference
        const inst = this;

        const components = {

            palette: new Moveable({
                element: inst.root.palette.picker,
                wrapper: inst.root.palette.palette,

                onchange(x, y) {
                    const hsla = inst.color;

                    // Calculate saturation based on the position
                    hsla.s = Math.round((x / this.wrapper.offsetWidth) * 100);

                    // To the right is the lightness-maximum only 50
                    const fac = 100 - (hsla.s * 0.5);
                    hsla.l = Math.round(fac - ((y / this.wrapper.offsetHeight) * fac));

                    // Set picker and gradient color
                    this.element.style.background = hsla.toHSLa();
                    this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${hsla.a}), transparent), 
                        linear-gradient(to left, hsla(${hsla.h}, 100%, 50%, ${hsla.a}), rgba(255, 255, 255, ${hsla.a}))
                    `;

                    // Change current color
                    inst.root.preview.currentColor.style.background = hsla.toHSLa();
                    inst.root.button.style.background = hsla.toHSLa();

                    // Update infobox
                    inst.root.input.result.value = (() => {

                        // Construct function name and call if present
                        const method = 'to' + inst.root.input.type().value;
                        if (typeof hsla[method] === 'function') {
                            return hsla[method]();
                        }
                    })();
                }
            }),

            hueSlider: new Moveable({
                lockX: true,
                element: inst.root.hueSlider.picker,
                wrapper: inst.root.hueSlider.slider,

                onchange(x, y) {

                    // Calculate hue
                    inst.color.h = Math.round((y / this.wrapper.offsetHeight) * 360);

                    // Update color
                    this.element.style.backgroundColor = `hsl(${inst.color.h}, 100%, 50%)`;

                    // Trigger palette to update the gradients
                    components.palette._tapmove();
                }
            }),

            opacitySlider: new Moveable({
                lockX: true,
                element: inst.root.opacitySlider.picker,
                wrapper: inst.root.opacitySlider.slider,

                onchange(x, y) {

                    // Calculate opacity
                    inst.color.a = (y / this.wrapper.offsetHeight).toFixed(2);

                    // Update color
                    this.element.style.background = `rgba(0, 0, 0, ${inst.color.a})`;

                    // Trigger palette to update the gradients
                    components.palette._tapmove();
                }
            }),

            selectable: new Selectable({
                elements: inst.root.input.options,
                className: 'active',
                onchange: () => components.hueSlider._tapmove()
            })
        };

        this.components = components;

        // Initialize color
        this.setHSLa(0, 0, 100, 1);

        // Select color string on click
        _.on(this.root.input.result, 'click', (e) => e.target.select());

        // Select last color on click
        _.on(this.root.preview.lastColor, 'click', () => this.setHSLa(...this.lastColor.toHSLa(true)));

        // Save and hide / show picker
        _.on(this.root.button, 'click', () => this.root.app.classList.contains('visible') ? this.hide() : this.show());
        _.on(this.root.input.save, 'click', () => this.hide());
    }

    /**
     * Hides the color-picker ui
     */
    hide() {
        this.root.app.classList.remove('visible');

        // Change preview color
        this.root.preview.lastColor.style.background = this.color.toHSLa();
        this.lastColor = this.color;
    }

    /**
     * Shows the color-picker ui
     */
    show() {
        this.root.app.classList.add('visible');
    }

    /**
     * Set a specific color.
     * @param h Hue
     * @param s Saturation
     * @param l Lightness
     * @param a Alpha channel (0 - 1)
     */
    setHSLa(h = 360, s = 0, l = 0, a = 1) {

        // Validate hsl
        if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100 || a < 0 || a > 1)
            return;

        // Calculate y position of hue slider
        const hueSlider = this.components.hueSlider.options.wrapper;
        const hueY = hueSlider.offsetHeight * (h / 360);
        this.components.hueSlider.update(0, hueY);

        // Calculate y and x position of color palette
        const pickerWrapper = this.components.palette.options.wrapper;
        const fac = (s / 100) / 100;
        const pickerX = pickerWrapper.offsetWidth * (s / 100);
        const pickerY = pickerWrapper.offsetHeight * (l * fac);
        this.components.palette.update(pickerX, pickerY);

        // Calculate y position of opacity slider
        const opacitySlider = this.components.opacitySlider.options.wrapper;
        const opacityY = opacitySlider.offsetHeight * a;
        this.components.opacitySlider.update(0, opacityY);
    }
}

function create() {

    const element = _.createElementFromString(`
         <div class="color-picker">
    
            <div class="button"></div>

            <div class="app">
                <div class="selection">
                    <div class="color-preview">
                        <div class="last-color"></div>
                        <div class="current-color"></div>
                    </div>
                
                    <div class="color-palette">
                        <div class="picker"></div>
                        <div class="palette"></div>
                    </div>
    
                    <div class="color-chooser">
                        <div class="picker"></div>
                        <div class="hue slider"></div>
                    </div>
                    
                     <div class="color-opacity">
                        <div class="picker"></div>
                        <div class="opacity slider"></div>
                    </div>
                </div>
    
                <div class="input">
                    <input class="result" type="text" spellcheck="false" readonly>
                    
                    <input class="type active" value="HEX" type="button">
                    <input class="type" value="RGBa" type="button">
                    <input class="type" value="HSLa" type="button">
                    <input class="type" value="CMYK" type="button">
                    
                    <input class="save" value="Save" type="button">
                </div>
            </div>
      
        </div>
    `);

    return {
        root: element,

        button: element.querySelector('.button'),

        app: element.querySelector('.app '),

        input: {
            options: element.querySelectorAll('.app .input .type'),
            type: () => element.querySelector('.app .input .type.active'),
            result: element.querySelector('.app .input .result'),
            save: element.querySelector('.app .input .save')
        },

        preview: {
            lastColor: element.querySelector('.app .color-preview .last-color'),
            currentColor: element.querySelector('.app .color-preview .current-color')
        },

        palette: {
            picker: element.querySelector('.app .color-palette .picker'),
            palette: element.querySelector('.app .color-palette .palette')
        },

        hueSlider: {
            picker: element.querySelector('.app .color-chooser .picker'),
            slider: element.querySelector('.app .color-chooser .hue.slider')
        },

        opacitySlider: {
            picker: element.querySelector('.app .color-opacity .picker'),
            slider: element.querySelector('.app .color-opacity .opacity.slider')
        }
    };
}

// Static methods
ColorPicker.utils = {
    on: _.on,
    off: _.off,
    createElementFromString: _.createElementFromString
};

// Export
module.exports = ColorPicker;