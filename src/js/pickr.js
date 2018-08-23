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

        // Assign default values
        this.options = Object.assign({
            useAsButton: false,
            disabled: false,
            comparison: true,

            components: {interaction: {}},
            strings: {},

            default: 'fff',
            position: 'middle',
            adjustableNumbers: true,
            showAlways: false,
            appendToBody: false,

            closeWithKey: 'Escape',
            onChange: () => 0,
            onSave: () => 0
        }, opt);

        // Check interaction section
        if (!this.options.components.interaction) {
            this.options.components.interaction = {};
        }

        _.bindClassUnderscoreFunctions(this);

        // Will be used to prevent specific actions during initilization
        this.initializingActive = true;

        // Replace element with color picker
        this.recalc = true;

        // Current and last color for comparison
        this.color = new HSVaColor();
        this.lastColor = new HSVaColor();

        // Initialize picker
        this._buildRoot();
        this._rePositioningPicker();
        this._buildComponents();
        this._bindEvents();

        // Check if color comparison is disabled, if yes - remove transitions so everything keeps smoothly
        if (!this.options.comparison) {
            this.root.button.style.transition = 'none';
            if (!this.options.useAsButton) {
                this.root.preview.lastColor.style.transition = 'none';
            }
        }

        // Init color and hide
        this.setColor(this.options.default);

        // Initilization is finish, pickr is visible and ready to use
        this.initializingActive = false;
    }

    _buildRoot() {
        const opt = this.options;

        // Check if element is selector
        if (typeof opt.el === 'string') {
            opt.el = document.querySelector(opt.el);
        }

        const root = create(opt);
        this.root = root;

        // Don't replace the the element if a custom button is used
        if (!opt.useAsButton) {

            // Replace element with actual color-picker
            opt.el.parentElement.replaceChild(root.root, opt.el);
        } else {
            opt.appendToBody = true;
            this.root.button = opt.el;
        }

        // Check appendToBody option
        if (opt.appendToBody) {
            document.body.appendChild(root.app);
        }

        // Call disable to also add the disabled class
        if (opt.disabled) {
            this.disable();
        }

        // Check showAlways option
        opt.showAlways ? root.app.classList.add('visible') : this.hide();
    }

    _buildComponents() {

        // Instance reference
        const inst = this;
        const comp = this.options.components;

        const components = {

            palette: Moveable({
                element: inst.root.palette.picker,
                wrapper: inst.root.palette.palette,

                onchange(x, y) {
                    const {color, root, options} = inst;

                    // Calculate saturation based on the position
                    color.s = (x / this.wrapper.offsetWidth) * 100;

                    // Calculate the value
                    color.v = 100 - (y / this.wrapper.offsetHeight) * 100;

                    // Set picker and gradient color
                    const cssRGBaString = color.toRGBA().toString();
                    this.element.style.background = cssRGBaString;
                    this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${color.a}), transparent), 
                        linear-gradient(to left, hsla(${color.h}, 100%, 50%, ${color.a}), rgba(255, 255, 255, ${color.a}))
                    `;

                    // Check if color is locked
                    if (!options.comparison) {
                        root.button.style.background = cssRGBaString;

                        if (!options.useAsButton) {
                            root.preview.lastColor.style.background = cssRGBaString;
                        }
                    }

                    // Change current color
                    root.preview.currentColor.style.background = cssRGBaString;

                    // Update the input field only if the user is currently not typing
                    if (inst.recalc) {
                        inst._updateOutput();
                    }

                    // If the user changes the color, remove the cleared icon
                    root.button.classList.remove('clear');
                }
            }),

            hueSlider: Moveable({
                lockX: true,
                element: inst.root.hueSlider.picker,
                wrapper: inst.root.hueSlider.slider,

                onchange(x, y) {
                    if (!comp.hue) return;

                    // Calculate hue
                    inst.color.h = (y / this.wrapper.offsetHeight) * 360;

                    // Update color
                    this.element.style.backgroundColor = `hsl(${inst.color.h}, 100%, 50%)`;
                    components.palette.trigger();
                }
            }),

            opacitySlider: Moveable({
                lockX: true,
                element: inst.root.opacitySlider.picker,
                wrapper: inst.root.opacitySlider.slider,

                onchange(x, y) {
                    if (!comp.opacity) return;

                    // Calculate opacity
                    inst.color.a = Math.round(((y / this.wrapper.offsetHeight)) * 1e2) / 100;

                    // Update color
                    this.element.style.background = `rgba(0, 0, 0, ${inst.color.a})`;
                    inst.components.palette.trigger();
                }
            }),

            selectable: Selectable({
                elements: inst.root.interaction.options,
                className: 'active',
                onchange() {
                    inst._updateOutput();
                }
            })
        };

        this.components = components;
    }

    _bindEvents() {
        const {root, options} = this;

        const eventBindings = [

            // Clear color
            _.on(root.interaction.clear, 'click', () => {

                // Change only the button color if it isn't customized
                if (!options.useAsButton) {
                    root.button.style.background = 'rgba(255, 255, 255, 0.4)';
                }

                root.button.classList.add('clear');

                if (!options.showAlways) {
                    this.hide();
                }

                // Fire listener
                options.onSave(null, this);
            }),

            // Select last color on click
            _.on(root.preview.lastColor, 'click', () => this.setHSVA(...this.lastColor.toHSVA())),

            // Save color
            _.on(root.interaction.save, 'click', () => {
                !this._saveColor() && !options.showAlways && this.hide();
            }),

            // Detect user input
            _.on(root.interaction.result, 'focus', () => this.recalc = false),
            _.on(root.interaction.result, 'input', e => this.setColor(e.target.value, true)),

            // Cancel input detection on color change
            _.on([
                root.palette.palette,
                root.palette.picker,
                root.hueSlider.slider,
                root.hueSlider.picker,
                root.opacitySlider.slider,
                root.opacitySlider.picker
            ], 'mousedown', () => this.recalc = true),


            // Repositioning on resize
            _.on(window, 'resize', this._rePositioningPicker)
        ];

        // Provide hiding / showing abilities only if showAlways is false
        if (!options.showAlways) {

            // Save and hide / show picker
            eventBindings.push(_.on(root.button, 'click', () => this.isOpen() ? this.hide() : this.show()));

            // Close with escape key
            const ck = options.closeWithKey;
            eventBindings.push(_.on(document, 'keyup', e => this.isOpen() && (e.key === ck || e.code === ck) && this.hide()));

            // Cancel selecting if the user taps behind the color picker
            eventBindings.push(_.on(document, 'mousedown', e => {
                if (!_.eventPath(e).includes(root.app)) {
                    _.once(document, 'mouseup', () => this.hide());
                }
            }));
        }

        // Make input adjustable if enabled
        if (options.adjustableNumbers) {
            _.adjustableInputNumbers(root.interaction.result, false);
        }

        // Save bindings
        this.eventBindings = eventBindings;
    }

    _rePositioningPicker() {
        const root = this.root;
        const app = this.root.app;

        // Check appendToBody option and normalize position
        if (this.options.appendToBody) {
            const relative = root.button.getBoundingClientRect();
            app.style.position = 'fixed';
            app.style.marginLeft = `${relative.left}px`;
            app.style.marginTop = `${relative.top}px`;
        }

        const bb = root.button.getBoundingClientRect();
        const ab = app.getBoundingClientRect();
        const as = app.style;

        // Check if picker is cuttet of from the top & bottom
        if (ab.bottom > window.innerHeight) {
            as.top = `${-(ab.height) - 5}px`;
        } else if (bb.bottom + ab.height < window.innerHeight) {
            as.top = `${bb.height + 5}px`;
        }

        // Positioning picker on the x-axis
        function getLeft(pos) {
            switch (pos) {
                case 'left':
                    return -(ab.width) + bb.width;
                case 'middle':
                    return -(ab.width / 2) + bb.width / 2;
                case 'right':
                    return 0;
            }
        }

        const currentLeft = parseInt(getComputedStyle(app).left, 10);
        let newLeft = getLeft(this.options.position);
        if ((ab.left - currentLeft) + newLeft < 0) {
            newLeft = getLeft('right');
        } else if ((ab.left - currentLeft) - newLeft > window.innerWidth) {
            newLeft = getLeft('left');
        }

        as.left = `${newLeft}px`;
    }

    _updateOutput() {

        // Check if component is present
        if (this.root.interaction.type()) {

            this.root.interaction.result.value = (() => {

                // Construct function name and call if present
                const method = 'to' + this.root.interaction.type().getAttribute('data-type');
                return typeof this.color[method] === 'function' ? this.color[method]().toString() : '';
            })();
        }

        // Fire listener
        if (!this.initializingActive) {
            this.options.onChange(this.color, this);
        }
    }

    _saveColor() {
        const {preview, button} = this.root;

        // Change preview and current color
        const cssRGBaString = this.color.toRGBA().toString();
        preview.lastColor.style.background = cssRGBaString;

        // Change only the button color if it isn't customized
        if (!this.options.useAsButton) {
            button.style.background = cssRGBaString;
        }

        // User changed the color so remove the clear clas
        button.classList.remove('clear');

        // Save last color
        this.lastColor = this.color.clone();

        // Fire listener
        if (!this.initializingActive) {
            this.options.onSave(this.color, this);
        }
    }

    /**
     * Destroy's all functionalitys
     */
    destroy() {
        this.eventBindings.forEach(args => _.off(...args));
        Object.keys(this.components).forEach(key => this.components[key].destroy());
    }

    /**
     * Destroy's all functionalitys and removes
     * the pickr element.
     */
    destroyAndRemove() {
        this.destroy();

        // Remove element
        const root = this.root.root;
        root.parentElement.removeChild(root);
    }

    /**
     * Hides the color-picker ui.
     */
    hide() {
        this.root.app.classList.remove('visible');
        return this;
    }

    /**
     * Shows the color-picker ui.
     */
    show() {
        if (this.options.disabled) return;
        this.root.app.classList.add('visible');
        this._rePositioningPicker();
        return this;
    }

    /**
     * @return {boolean} If the color picker is currently open
     */
    isOpen() {
        return this.root.app.classList.contains('visible');
    }

    /**
     * Set a specific color.
     * @param h Hue
     * @param s Saturation
     * @param v Value
     * @param a Alpha channel (0 - 1)
     * @param silent If the button should not change the color
     * @return true if the color has been accepted
     */
    setHSVA(h = 360, s = 0, v = 0, a = 1, silent = false) {

        // Deactivate color calculation
        const recalc = this.recalc; // Save state
        this.recalc = false;

        // Validate input
        if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || a < 0 || a > 1) {
            return false;
        }

        // Short names
        const {hueSlider, opacitySlider, palette} = this.components;

        // Calculate y position of hue slider
        const hueWrapper = hueSlider.options.wrapper;
        const hueY = hueWrapper.offsetHeight * (h / 360);
        hueSlider.update(0, hueY);

        // Calculate y position of opacity slider
        const opacityWrapper = opacitySlider.options.wrapper;
        const opacityY = opacityWrapper.offsetHeight * a;
        opacitySlider.update(0, opacityY);

        // Calculate y and x position of color palette
        const pickerWrapper = palette.options.wrapper;
        const pickerX = pickerWrapper.offsetWidth * (s / 100);
        const pickerY = pickerWrapper.offsetHeight * (1 - (v / 100));
        palette.update(pickerX, pickerY);

        // Override current color and re-active color calculation
        this.color = new HSVaColor(h, s, v, a);
        this.recalc = recalc; // Restore old state

        // Update output
        this._updateOutput();

        // Check if call is silent
        if (!silent) {
            this._saveColor();
        }

        return true;
    }

    /**
     * Tries to parse a string which represents a color.
     * Examples: #fff
     *           rgb 10 10 200
     *           hsva 10 20 5 0.5
     * @param string
     * @param silent
     */
    setColor(string, silent = false) {
        const parsed = Color.parseToHSV(string);

        // Check if color is ok
        if (parsed) {
            return this.setHSVA(...parsed, silent);
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


    /**
     * Disable pickr
     */
    disable() {
        this.options.disabled = true;
        this.root.button.classList.add('disabled');
        return this;
    }

    /**
     * Enable pickr
     */
    enable() {
        this.options.disabled = false;
        this.root.button.classList.remove('disabled');
        return this;
    }
}

function create(options) {
    const {components, strings, useAsButton} = options;
    const hidden = con => con ? '' : 'style="display:none" hidden';

    const root = _.createFromTemplate(`
        <div data-key="root" class="pickr">
        
            ${useAsButton ? '' : '<div data-key="button" class="pcr-button"></div>'}

            <div data-key="app" class="pcr-app">
                <div class="pcr-selection">
                    <div data-con="preview" class="pcr-color-preview" ${hidden(components.preview)}>
                        <div data-key="lastColor" class="pcr-last-color"></div>
                        <div data-key="currentColor" class="pcr-current-color"></div>
                    </div>

                    <div data-con="palette" class="pcr-color-palette">
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="palette" class="pcr-palette"></div>
                    </div>

                    <div data-con="hueSlider" class="pcr-color-chooser" ${hidden(components.hue)}>
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="slider" class="pcr-hue pcr-slider"></div>
                    </div>

                    <div data-con="opacitySlider" class="pcr-color-opacity" ${hidden(components.opacity)}>
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="slider" class="pcr-opacity pcr-slider"></div>
                    </div>
                </div>

                <div data-con="interaction" class="pcr-interaction" ${hidden(components.interaction)}>
                    <input data-key="result" class="pcr-result" type="text" spellcheck="false" ${hidden(components.interaction.input)}>

                    <input data-arr="options" class="pcr-type" data-type="HEX" value="HEX" type="button" ${hidden(components.interaction.hex)}>
                    <input data-arr="options" class="pcr-type" data-type="RGBA" value="RGBa" type="button" ${hidden(components.interaction.rgba)}>
                    <input data-arr="options" class="pcr-type" data-type="HSLA" value="HSLa" type="button" ${hidden(components.interaction.hsla)}>
                    <input data-arr="options" class="pcr-type" data-type="HSVA" value="HSVa" type="button" ${hidden(components.interaction.hsva)}>
                    <input data-arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${hidden(components.interaction.cmyk)}>

                    <input data-key="save" class="pcr-save" value="${strings.save || 'Save'}" type="button" ${hidden(components.interaction.save)}>
                    <input data-key="clear" class="pcr-clear" value="${strings.clear || 'Clear'}" type="button" ${hidden(components.interaction.clear)}>
                </div>
            </div>
        </div>
    `);

    // Select option which is not hidden
    root.interaction.options.find(o => !o.hidden && !o.classList.add('active'));

    // Create method to find currenlty active option
    root.interaction.type = () => root.interaction.options.find(e => e.classList.contains('active'));
    return root;
}

// Static methods
Pickr.utils = {
    once: _.once,
    on: _.on,
    off: _.off,
    eventPath: _.eventPath,
    createElementFromString: _.createElementFromString,
    removeAttribute: _.removeAttribute,
    createFromTemplate: _.createFromTemplate
};

// Create instance via method
Pickr.create = (options) => new Pickr(options);

// Export
Pickr.version = '0.2.0';
module.exports = Pickr;