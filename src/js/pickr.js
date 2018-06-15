/**
 * Flat UI color-picker.
 * @author  Simon Reinisch <toports@gmx.de>
 * @license MIT
 */

// Import styles
import '../scss/pickr.scss';

// Import utils
import * as _ from './lib/utils';
import * as Color from './lib/color';

// Import classes
import {HSVaColor} from './lib/hsvacolor';
import Moveable from './helper/moveable';
import Selectable from './helper/selectable';

class Pickr {

    constructor(opt) {

        // Default options
        const def = {
            components: {output: {}},
            default: 'fff',
            position: 'middle',
            showAlways: false,
            onChange: () => undefined,
            onSave: () => undefined
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
        this.root = this._buildRoot();
        this.inputActive = false;

        this.color = new HSVaColor();
        this.lastColor = new HSVaColor();

        // Initialize picker
        this._rePositioningPicker(true);
        this._buildComponents();
        this._bindEvents();

        // Init color and hide
        this.setColor(this.options.default);

        // Check showAlways option
        if (this.options.showAlways) {
            this.root.app.classList.add('visible');
        } else {
            this.hide();
        }

        // Select current color
        this._saveColor();
    }

    _buildRoot() {

        // Check if element is selector
        if (typeof this.options.el === 'string') {
            this.options.el = document.querySelector(this.options.el);
        }

        const toReplace = this.options.el;
        const html = create(this.options.components);

        // Replace element with actual color-picker
        toReplace.parentElement.replaceChild(html.root, toReplace);

        // Return object
        return html;
    }

    _buildComponents() {

        // Instance reference
        const inst = this;
        const comp = this.options.components;

        const components = {

            palette: new Moveable({
                element: inst.root.palette.picker,
                wrapper: inst.root.palette.palette,

                onchange(x, y) {
                    const color = inst.color;

                    // Calculate saturation based on the position
                    color.s = Math.round((x / this.wrapper.offsetWidth) * 100);

                    // Calculate the value
                    color.v = Math.round(100 - ((y / this.wrapper.offsetHeight) * 100));

                    const cssRGBaString = color.toRGBA().toString();

                    // Set picker and gradient color
                    this.element.style.background = cssRGBaString;
                    this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${color.a}), transparent), 
                        linear-gradient(to left, hsla(${color.h}, 100%, 50%, ${color.a}), rgba(255, 255, 255, ${color.a}))
                    `;

                    // Change current color
                    inst.root.preview.currentColor.style.background = cssRGBaString;
                    inst._updateOutput();
                }
            }),

            hueSlider: new Moveable({
                lockX: true,
                element: inst.root.hueSlider.picker,
                wrapper: inst.root.hueSlider.slider,

                onchange(x, y) {
                    if (!comp.hue) return;

                    // Calculate hue
                    inst.color.h = Math.round((y / this.wrapper.offsetHeight) * 360);

                    // Update color
                    this.element.style.backgroundColor = `hsl(${inst.color.h}, 100%, 50%)`;
                    components.palette.trigger();
                }
            }),

            opacitySlider: new Moveable({
                lockX: true,
                element: inst.root.opacitySlider.picker,
                wrapper: inst.root.opacitySlider.slider,

                onchange(x, y) {
                    if (!comp.opacity) return;

                    // Calculate opacity
                    inst.color.a = Math.round((y / this.wrapper.offsetHeight) * 1e2) / 1e2;

                    // Update color
                    this.element.style.background = `rgba(0, 0, 0, ${inst.color.a})`;
                    inst.components.palette.trigger();
                }
            }),

            selectable: new Selectable({
                elements: inst.root.input.options,
                className: 'active',
                onchange: () => {
                    inst.inputActive = false;
                    inst.components.palette.trigger();
                }
            })
        };

        this.components = components;
    }

    _bindEvents() {
        const root = this.root;

        // Select last color on click
        _.on(root.preview.lastColor, 'click', () => this.setHSVA(...this.lastColor.toHSVA()));

        // Provide hiding / showing abilities only if showAlways is false
        if (!this.options.showAlways) {

            // Save and hide / show picker
            _.on(root.button, 'click', () => this.root.app.classList.contains('visible') ? this.hide() : this.show());

            // Cancel selecting if the user taps behind the color picker
            _.on(document, 'mousedown', (e) => {
                if (!_.eventPath(e).includes(root.root)) {

                    const cancel = (() => {
                        _.off(document, 'mouseup', cancel);
                        this.hide();
                    }).bind(this);

                    _.on(document, 'mouseup', cancel);
                }
            });
        }

        _.on(root.input.save, 'click', () => {
            this._saveColor();
            if (!this.options.showAlways) {
                this.hide();
            }
        });

        // Detect user input
        _.on(root.input.result, 'keyup', (e) => {
            this.setColor(e.target.value);
            this.inputActive = true;
        });

        // Cancel input detection on color change
        _.on([
            root.palette.palette,
            root.palette.picker,
            root.hueSlider.slider,
            root.hueSlider.picker,
            root.opacitySlider.slider,
            root.opacitySlider.picker
        ], 'mousedown', () => this.inputActive = false);
    }

    _rePositioningPicker(trigger) {
        const bb = this.root.button.getBoundingClientRect();
        const ab = this.root.app.getBoundingClientRect();
        const as = this.root.app.style;

        // Check if picker is out of window
        if (ab.bottom > window.innerHeight) {
            as.top = `${-(ab.height) - 5}px`;
        } else if (trigger || ab.bottom + ab.height < window.innerHeight) {
            as.top = `${bb.height + 5}px`;
        }

        // Positioner picker on the x-axis
        let pos = this.options.position;
        switch (pos) {
            case 'left':
                as.left = `${-(ab.width) + bb.width}px`;
                break;
            case 'middle':
                as.left = `${-(ab.width / 2) + bb.width / 2}px`;
                break;
            case 'right':
                as.left = `0px`;
                break;
            default:
                as.left = `${-(ab.width / 2) + bb.width}px`;
        }
    }

    _updateOutput() {

        // Check if component is present
        if (!this.inputActive && this.root.input.type()) {

            // Update infobox
            this.root.input.result.value = (() => {

                // Construct function name and call if present
                const method = 'to' + this.root.input.type().getAttribute('data-type');

                if (typeof this.color[method] === 'function') {
                    return this.color[method]().toString();
                }

                return '';
            })();
        }

        // Fire listener
        this.options.onChange(this.color, this);
    }

    _saveColor() {
        const cssRGBaString = this.color.toRGBA().toString();

        // Change preview and current color
        this.root.preview.lastColor.style.background = cssRGBaString;
        this.root.button.style.background = cssRGBaString;

        // Save last color
        this.lastColor = this.color.clone();

        // Fire listener
        this.options.onSave(this.color, this);
    }

    /**
     * Hides the color-picker ui.
     */
    hide() {
        this.root.app.classList.remove('visible');
    }

    /**
     * Shows the color-picker ui.
     */
    show() {
        this.root.app.classList.add('visible');
        this._rePositioningPicker();
    }

    /**
     * Set a specific color.
     * @param h Hue
     * @param s Saturation
     * @param v Value
     * @param a Alpha channel (0 - 1)
     */
    setHSVA(h = 360, s = 0, v = 0, a = 1) {

        if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || a < 0 || a > 1) {
            return;
        }

        // Calculate y position of hue slider
        const hueWrapper = this.components.hueSlider.options.wrapper;
        const hueY = hueWrapper.offsetHeight * (h / 360);
        this.components.hueSlider.update(0, hueY);

        // Calculate y position of opacity slider
        const opacityWrapper = this.components.opacitySlider.options.wrapper;
        const opacityY = opacityWrapper.offsetHeight * a;
        this.components.opacitySlider.update(0, opacityY);

        // Calculate y and x position of color palette
        const pickerWrapper = this.components.palette.options.wrapper;
        const pickerX = pickerWrapper.offsetWidth * (s / 100);
        const pickerY = pickerWrapper.offsetHeight * (1 - (v / 100));
        this.components.palette.update(pickerX, pickerY);

        this._updateOutput();
        this.color = new HSVaColor(h, s, v, a);
    }

    /**
     * Trys to parse a string which represents a color.
     * Examples: #fff
     *           rgb 10 10 200
     *           hsva 10 20 5 0.5
     * @param string
     */
    setColor(string) {
        const parsed = Color.parseToHSV(string);
        if (parsed) {
            this.setHSVA(...parsed);
        }
    }

    /**
     * @returns HSVaColor Current HSVaColor object.
     */
    getColor() {
        return this.color;
    }

    /**
     * @returns The root HTMLElement with all his components.
     */
    getRoot() {
        return this.root;
    }
}

function create(o) {
    const hidden = (con) => con ? '' : 'style="display:none" hidden';

    const element = _.createElementFromString(`
         <div class="pickr">
    
            <div class="pcr-button"></div>

            <div class="pcr-app">
                <div class="pcr-selection">
                    <div class="pcr-color-preview" ${hidden(o.preview)}>
                        <div class="pcr-last-color"></div>
                        <div class="pcr-current-color"></div>
                    </div>
                
                    <div class="pcr-color-palette">
                        <div class="pcr-picker"></div>
                        <div class="pcr-palette"></div>
                    </div>
    
                    <div class="pcr-color-chooser" ${hidden(o.hue)}>
                        <div class="pcr-picker"></div>
                        <div class="pcr-hue pcr-slider"></div>
                    </div>
                    
                     <div class="pcr-color-opacity" ${hidden(o.opacity)}>
                        <div class="pcr-picker"></div>
                        <div class="pcr-opacity pcr-slider"></div>
                    </div>
                </div>
    
                <div class="pcr-output" ${hidden(o.output)}>
                    <input class="pcr-result" type="text" spellcheck="false" ${hidden(o.output.input)}>
                    
                    <input class="pcr-type" data-type="HEX" value="HEX" type="button" ${hidden(o.output.hex)}>
                    <input class="pcr-type" data-type="RGBA" value="RGBa" type="button" ${hidden(o.output.rgba)}>
                    <input class="pcr-type" data-type="HSLA" value="HSLa" type="button" ${hidden(o.output.hsla)}>
                    <input class="pcr-type" data-type="HSVA" value="HSVa" type="button" ${hidden(o.output.hsva)}>
                    <input class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${hidden(o.output.cmyk)}>
                    
                    <input class="pcr-save" value="Save" type="button">
                </div>
            </div>
      
        </div>
    `);

    const root = {
        root: element,

        button: element.querySelector('.pcr-button'),

        app: element.querySelector('.pcr-app '),

        input: {
            options: element.querySelectorAll('.pcr-app .pcr-output .pcr-type'),
            result: element.querySelector('.pcr-app .pcr-output .pcr-result'),
            save: element.querySelector('.pcr-app .pcr-output .pcr-save'),
            type: () => element.querySelector('.pcr-app .pcr-output .pcr-type.active')
        },

        preview: {
            lastColor: element.querySelector('.pcr-app .pcr-color-preview .pcr-last-color'),
            currentColor: element.querySelector('.pcr-app .pcr-color-preview .pcr-current-color')
        },

        palette: {
            picker: element.querySelector('.pcr-app .pcr-color-palette .pcr-picker'),
            palette: element.querySelector('.pcr-app .pcr-color-palette .pcr-palette')
        },

        hueSlider: {
            picker: element.querySelector('.pcr-app .pcr-color-chooser .pcr-picker'),
            slider: element.querySelector('.pcr-app .pcr-color-chooser .pcr-hue.pcr-slider')
        },

        opacitySlider: {
            picker: element.querySelector('.pcr-app .pcr-color-opacity .pcr-picker'),
            slider: element.querySelector('.pcr-app .pcr-color-opacity .pcr-opacity.pcr-slider')
        }
    };

    // Select option which is not hidden
    Array.from(root.input.options).find(o => !o.hidden && !o.classList.add('active'));
    return root;
}

// Static methods
Pickr.utils = {
    on: _.on,
    off: _.off,
    eventPath: _.eventPath,
    createElementFromString: _.createElementFromString
};

// Create instance via method
Pickr.create = (options) => new Pickr(options);

// Export
Pickr.version = '0.0.3';
module.exports = Pickr;