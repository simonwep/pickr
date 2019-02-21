// Import styles
import '../scss/pickr.scss';

// Import utils
import * as _     from './lib/utils';
import * as Color from './lib/color';

// Import classes
import {HSVaColor} from './lib/hsvacolor';
import Moveable    from './helper/moveable';
import Selectable  from './helper/selectable';

class Pickr {

    constructor(opt) {

        // Assign default values
        this.options = Object.assign({
            useAsButton: false,
            disabled: false,
            comparison: true,

            components: {interaction: {}},
            strings: {},

            swatches: null,

            default: 'fff',
            defaultRepresentation: 'HEX',
            position: 'middle',
            adjustableNumbers: true,
            showAlways: false,
            parent: undefined,

            closeWithKey: 'Escape',
            onChange: () => 0,
            onSave: () => 0,
            onSwatchSelect: () => 0
        }, opt);

        // Check interaction section
        if (!this.options.components.interaction) {
            this.options.components.interaction = {};
        }

        // Will be used to prevent specific actions during initilization
        this._initializingActive = true;

        // Replace element with color picker
        this._recalc = true;

        // Current and last color for comparison
        this._color = new HSVaColor();
        this._lastColor = new HSVaColor();

        // Parse swatch colors
        this.options.swatches = this.options.swatches || [];
        if (this.options.swatches) {
            this.options.swatches = this.options.swatches.map(str => {
                const {values} = Color.parseToHSV(str);
                return values && new HSVaColor(...values);
            }).filter(v => v);
        }

        // Initialize picker
        this._preBuild();
        this._buildComponents();
        this._bindEvents();

        // Initialize color _epresentation
        this._representation = this.options.defaultRepresentation;
        this.setColorRepresentation(this._representation);

        // Finalize build
        this._finalBuild();
        this._rePositioningPicker();

        // Initilization is finish, pickr is visible and ready for usage
        requestAnimationFrame((function cb() {
            if (!this._root.app.offsetParent) {
                return requestAnimationFrame(cb.bind(this));
            }

            this._initializingActive = false;
            this.setColor(this.options.default);
        }).bind(this));
    }

    // Does only the absolutly basic thing to initialize the components
    _preBuild() {
        const opt = this.options;

        // Check if element is selector
        if (typeof opt.el === 'string') {
            opt.el = document.querySelector(opt.el);
        }

        // Create element and append it to body to
        // prevent initialization errors
        this._root = create(opt);

        // Check if a custom button is used
        if (opt.useAsButton) {

            // Check if the user has an alternative location defined, used body as fallback
            if (!opt.parent) {
                opt.parent = 'body';
            }

            this._root.button = opt.el; // Replace button with customized button
        }

        document.body.appendChild(this._root.root);
    }

    _finalBuild() {
        const opt = this.options;
        const root = this._root;

        // Remove from body
        document.body.removeChild(root.root);

        // Check parent option
        if (opt.parent) {

            // Check if element is selector
            if (typeof opt.parent === 'string') {
                opt.parent = document.querySelector(opt.parent);
            }

            opt.parent.appendChild(root.app);
        }

        // Don't replace the the element if a custom button is used
        if (!opt.useAsButton) {

            // Replace element with actual color-picker
            opt.el.parentElement.replaceChild(root.root, opt.el);
        }

        // Call disable to also add the disabled class
        if (opt.disabled) {
            this.disable();
        }

        // Check if color comparison is disabled, if yes - remove transitions so everything keeps smoothly
        if (!opt.comparison) {
            root.button.style.transition = 'none';
            if (!opt.useAsButton) {
                root.preview.lastColor.style.transition = 'none';
            }
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
                element: inst._root.palette.picker,
                wrapper: inst._root.palette.palette,

                onchange(x, y) {
                    const {_color, _root, options} = inst;

                    // Calculate saturation based on the position
                    _color.s = (x / this.wrapper.offsetWidth) * 100;

                    // Calculate the value
                    _color.v = 100 - (y / this.wrapper.offsetHeight) * 100;

                    // Prevent falling under zero
                    _color.v < 0 ? _color.v = 0 : 0;

                    // Set picker and gradient color
                    const cssRGBaString = _color.toRGBA().toString();
                    this.element.style.background = cssRGBaString;
                    this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${_color.a}), transparent), 
                        linear-gradient(to left, hsla(${_color.h}, 100%, 50%, ${_color.a}), rgba(255, 255, 255, ${_color.a}))
                    `;

                    // Check if color is locked
                    if (!options.comparison) {
                        _root.button.style.background = cssRGBaString;

                        if (!options.useAsButton) {
                            _root.preview.lastColor.style.background = cssRGBaString;
                        }
                    }

                    // Change current color
                    _root.preview.currentColor.style.background = cssRGBaString;

                    // Update the input field only if the user is currently not typing
                    if (inst._recalc) {
                        inst._updateOutput();
                    }

                    // If the user changes the color, remove the cleared icon
                    _root.button.classList.remove('clear');
                }
            }),

            hue: Moveable({
                lockX: true,
                element: inst._root.hue.picker,
                wrapper: inst._root.hue.slider,

                onchange(x, y) {
                    if (!comp.hue) return;

                    // Calculate hue
                    inst._color.h = (y / this.wrapper.offsetHeight) * 360;

                    // Update color
                    this.element.style.backgroundColor = `hsl(${inst._color.h}, 100%, 50%)`;
                    components.palette.trigger();
                }
            }),

            opacity: Moveable({
                lockX: true,
                element: inst._root.opacity.picker,
                wrapper: inst._root.opacity.slider,

                onchange(x, y) {
                    if (!comp.opacity) return;

                    // Calculate opacity
                    inst._color.a = Math.round(((y / this.wrapper.offsetHeight)) * 1e2) / 100;

                    // Update color
                    this.element.style.background = `rgba(0, 0, 0, ${inst._color.a})`;
                    inst.components.palette.trigger();
                }
            }),

            selectable: Selectable({
                elements: inst._root.interaction.options,
                className: 'active',
                onchange(e) {
                    inst._representation = e.target.getAttribute('data-type').toUpperCase();
                    inst._updateOutput();
                }
            })
        };

        this.components = components;
    }

    _bindEvents() {
        const {_root, options} = this;

        const eventBindings = [

            // Clear color
            _.on(_root.interaction.clear, 'click', () => this._clearColor()),

            // Select last color on click
            _.on(_root.preview.lastColor, 'click', () => this.setHSVA(...this._lastColor.toHSVA())),

            // Save color
            _.on(_root.interaction.save, 'click', () => {
                !this.applyColor() && !options.showAlways && this.hide();
            }),

            // Detect user input and disable auto-recalculation
            _.on(_root.interaction.result, ['keyup', 'input'], e => {
                this._recalc = false;

                // Fire listener if initialization is finish and changed color was valid
                if (this.setColor(e.target.value, true) && !this._initializingActive) {
                    this.options.onChange(this._color, this);
                }

                e.stopImmediatePropagation();
            }),

            // Cancel input detection on color change
            _.on([
                _root.palette.palette,
                _root.palette.picker,
                _root.hue.slider,
                _root.hue.picker,
                _root.opacity.slider,
                _root.opacity.picker
            ], ['mousedown', 'touchstart'], () => this._recalc = true),

            // Repositioning on resize
            _.on(window, 'resize', () => this._rePositioningPicker)
        ];

        // Color swatches
        if (_root.swatches) {
            eventBindings.push(
                _.on(_root.swatches, 'click', ({target}) => {
                    const color = options.swatches[Number(target.getAttribute('data-color-index'))];

                    if (color) {
                        this.setHSVA(...color.toHSVA(), true);

                        // Fire event
                        options.onSwatchSelect(color, this);
                    }
                })
            );
        }

        // Provide hiding / showing abilities only if showAlways is false
        if (!options.showAlways) {
            const ck = options.closeWithKey;

            eventBindings.push(
                // Save and hide / show picker
                _.on(_root.button, 'click', () => this.isOpen() ? this.hide() : this.show()),

                // Close with escape key
                _.on(document, 'keyup', e => this.isOpen() && (e.key === ck || e.code === ck) && this.hide()),

                // Cancel selecting if the user taps behind the color picker
                _.on(document, ['touchstart', 'mousedown'], e => {
                    if (this.isOpen() && !_.eventPath(e).some(el => el === _root.app || el === _root.button)) {
                        this.hide();
                    }
                }, {capture: true})
            );
        }

        // Make input adjustable if enabled
        if (options.adjustableNumbers) {
            _.adjustableInputNumbers(_root.interaction.result, false);
        }

        // Save bindings
        this._eventBindings = eventBindings;
    }

    _rePositioningPicker() {
        const root = this._root;
        const app = this._root.app;

        // Check if user has defined a parent
        if (this.options.parent) {
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
        const pos = {
            left: -(ab.width) + bb.width,
            middle: -(ab.width / 2) + bb.width / 2,
            right: 0
        };

        const cl = parseInt(getComputedStyle(app).left, 10);
        let newLeft = pos[this.options.position];
        const leftClip = (ab.left - cl) + newLeft;
        const rightClip = (ab.left - cl) + newLeft + ab.width;

        /**
         * First check if position is left or right but
         * pickr-app cannot set to left AND right because it would
         * be clipped by the browser width. If so, wrap it and position
         * pickr below button via the pos[middle] value.
         * The current selected posiotion should'nt be the middle.di
         */
        if (this.options.position !== 'middle' && (
            (leftClip < 0 && -leftClip < ab.width / 2) ||
            (rightClip > window.innerWidth && rightClip - window.innerWidth < ab.width / 2))) {
            newLeft = pos['middle'];

            /**
             * Even if set to middle pickr is getting clipped, so
             * set it to left / right.
             */
        } else if (leftClip < 0) {
            newLeft = pos['right'];
        } else if (rightClip > window.innerWidth) {
            newLeft = pos['left'];
        }

        as.left = `${newLeft}px`;
    }

    _updateOutput() {

        // Check if component is present
        if (this._root.interaction.type()) {

            this._root.interaction.result.value = (() => {

                // Construct function name and call if present
                const method = 'to' + this._root.interaction.type().getAttribute('data-type');
                return typeof this._color[method] === 'function' ? this._color[method]().toString() : '';
            })();
        }

        // Fire listener if initialization is finish
        if (!this._initializingActive) {
            this.options.onChange(this._color, this);
        }
    }

    applyColor(silent = false) {
        const {preview, button} = this._root;

        // Change preview and current color
        const cssRGBaString = this._color.toRGBA().toString();
        preview.lastColor.style.background = cssRGBaString;

        // Change only the button color if it isn't customized
        if (!this.options.useAsButton) {
            button.style.background = cssRGBaString;
        }

        // User changed the color so remove the clear clas
        button.classList.remove('clear');

        // Save last color
        this._lastColor = this._color.clone();

        // Fire listener
        if (!this._initializingActive && !silent) {
            this.options.onSave(this._color, this);
        }
    }

    _clearColor() {
        const {_root, options} = this;

        // Change only the button color if it isn't customized
        if (!options.useAsButton) {
            _root.button.style.background = 'rgba(255, 255, 255, 0.4)';
        }

        _root.button.classList.add('clear');

        if (!options.showAlways) {
            this.hide();
        }

        // Fire listener
        options.onChange(null, this);
    }

    /**
     * Destroy's all functionalitys
     */
    destroy() {
        this._eventBindings.forEach(args => _.off(...args));
        Object.keys(this.components).forEach(key => this.components[key].destroy());
    }

    /**
     * Destroy's all functionalitys and removes
     * the pickr element.
     */
    destroyAndRemove() {
        this.destroy();

        // Remove element
        const root = this._root.root;
        root.parentElement.removeChild(root);
    }

    /**
     * Hides the color-picker ui.
     */
    hide() {
        this._root.app.classList.remove('visible');
        return this;
    }

    /**
     * Shows the color-picker ui.
     */
    show() {
        if (this.options.disabled) return;
        this._root.app.classList.add('visible');
        this._rePositioningPicker();
        return this;
    }

    /**
     * @return {boolean} If the color picker is currently open
     */
    isOpen() {
        return this._root.app.classList.contains('visible');
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
        const recalc = this._recalc; // Save state
        this._recalc = false;

        // Validate input
        if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || a < 0 || a > 1) {
            return false;
        }

        // Short names
        const {hue, opacity, palette} = this.components;

        // Calculate y position of hue slider
        const hueWrapper = hue.options.wrapper;
        const hueY = hueWrapper.offsetHeight * (h / 360);
        hue.update(0, hueY);

        // Calculate y position of opacity slider
        const opacityWrapper = opacity.options.wrapper;
        const opacityY = opacityWrapper.offsetHeight * a;
        opacity.update(0, opacityY);

        // Calculate y and x position of color palette
        const pickerWrapper = palette.options.wrapper;
        const pickerX = pickerWrapper.offsetWidth * (s / 100);
        const pickerY = pickerWrapper.offsetHeight * (1 - (v / 100));
        palette.update(pickerX, pickerY);

        // Override current color and re-active color calculation
        this._color = new HSVaColor(h, s, v, a);
        this._recalc = recalc; // Restore old state

        // Update output if recalculation is enabled
        if (this._recalc) {
            this._updateOutput();
        }

        // Check if call is silent
        if (!silent) {
            this.applyColor();
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

        // Check if null
        if (string === null) {
            this._clearColor();
            return true;
        }

        const {values, type} = Color.parseToHSV(string);

        // Check if color is ok
        if (values) {

            // Change selected color format
            const utype = type.toUpperCase();
            const {options} = this._root.interaction;
            const target = options.find(el => el.getAttribute('data-type') === utype);

            // Auto select only if not hidden
            if (!target.hidden) {
                for (const el of options) {
                    el.classList[el === target ? 'add' : 'remove']('active');
                }
            }

            return this.setHSVA(...values, silent);
        }
    }

    /**
     * Changes the color _representation.
     * Allowed values are HEX, RGBA, HSVA, HSLA and CMYK
     * @param type
     * @returns {boolean} if the selected type was valid.
     */
    setColorRepresentation(type) {

        // Force uppercase to allow a case-sensitiv comparison
        type = type.toUpperCase();

        // Find button with given type and trigger click event
        return !!this._root.interaction.options.find(v => v.getAttribute('data-type') === type && !v.click());
    }

    /**
     * Returns the current color representaion. See setColorRepresentation
     * @returns {*}
     */
    getColorRepresentation() {
        return this._representation;
    }

    /**
     * @returns HSVaColor Current HSVaColor object.
     */
    getColor() {
        return this._color;
    }

    /**
     * @returns The root HTMLElement with all his components.
     */
    getRoot() {
        return this._root;
    }

    /**
     * Disable pickr
     */
    disable() {
        this.hide();
        this.options.disabled = true;
        this._root.button.classList.add('disabled');
        return this;
    }

    /**
     * Enable pickr
     */
    enable() {
        this.options.disabled = false;
        this._root.button.classList.remove('disabled');
        return this;
    }
}

function create(options) {
    const {components, strings, useAsButton, swatches} = options;
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

                    <div data-con="hue" class="pcr-color-chooser" ${hidden(components.hue)}>
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="slider" class="pcr-hue pcr-slider"></div>
                    </div>

                    <div data-con="opacity" class="pcr-color-opacity" ${hidden(components.opacity)}>
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="slider" class="pcr-opacity pcr-slider"></div>
                    </div>
                </div>
                
                ${swatches && swatches.length ? `
                <div class="swatches">
                   ${swatches.map((v, i) => `<div data-arr="swatches" data-color-index="${i}" style="color: ${v.toRGBA()}"></div>`).join('')}
                </div> 
                ` : ''}

                <div data-con="interaction" class="pcr-interaction" ${hidden(Object.keys(components.interaction).length)}>
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

    const int = root.interaction;

    // Select option which is not hidden
    int.options.find(o => !o.hidden && !o.classList.add('active'));

    // Create method to find currenlty active option
    int.type = () => int.options.find(e => e.classList.contains('active'));
    return root;
}

// Static methods
Pickr.utils = {
    once: _.once,
    on: _.on,
    off: _.off,
    eventPath: _.eventPath,
    createElementFromString: _.createElementFromString,
    adjustableInputNumbers: _.adjustableInputNumbers,
    removeAttribute: _.removeAttribute,
    createFromTemplate: _.createFromTemplate
};

// Create instance via method
Pickr.create = (options) => new Pickr(options);

// Export
Pickr.version = '0.3.6';
export default Pickr;
