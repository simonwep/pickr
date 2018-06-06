import * as _ from './../lib/utils';

class Moveable {

    constructor(opt) {

        // Default values
        const def = {
            lockX: false,
            lockY: false,
            onchange: undefined
        };

        this.options = Object.assign(def, opt);

        // Bind all private methods
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for (let fn of methods) {
            if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                this[fn] = this[fn].bind(this);
            }
        }

        _.on([this.options.wrapper, this.options.element], 'mousedown', this._tapstart);
        _.on([this.options.wrapper, this.options.element], 'touchstart', this._tapstart, {
            passive: false
        });
    }

    _tapstart(evt) {
        _.on(document, ['mouseup', 'touchend', 'touchcancel'], this._tapstop);
        _.on(document, ['mousemove', 'touchmove'], this._tapmove);

        // Trigger move
        this._tapmove(evt);

        // Prevent default touch event
        evt.preventDefault();
    }

    _tapmove(evt = this.lastEvent) {
        const wrapper = this.options.wrapper;
        const element = this.options.element;
        const b = wrapper.getBoundingClientRect();

        const touch = evt && evt.touches && evt.touches[0];
        let x = evt ? (touch || evt).clientX : 0;
        let y = evt ? (touch || evt).clientY : 0;

        // Reset to bounds
        if (x < b.left) x = b.left;
        else if (x > b.left + b.width) x = b.left + b.width;
        if (y < b.top) y = b.top;
        else if (y > b.top + b.height) y = b.top + b.height;

        // Normalize
        x -= b.left;
        y -= b.top;

        if (typeof this.options.onchange === 'function')
            this.options.onchange(x, y);

        if (!this.options.lockX)
            element.style.left = (x - element.offsetWidth / 2) + 'px';

        if (!this.options.lockY)
            element.style.top = (y - element.offsetHeight / 2) + 'px';

        this.lastEvent = evt;
    }

    _tapstop() {
        _.off(document, ['mouseup', 'touchend', 'touchcancel'], this._tapstop);
        _.off(document, ['mousemove', 'touchmove'], this._tapmove);
    }

    update(x = 0, y = 0) {
        const wrapperBoundaries = this.options.wrapper.getBoundingClientRect();
        this._tapmove(new MouseEvent('mousemove', {
            clientX: wrapperBoundaries.left + x,
            clientY: wrapperBoundaries.top + y
        }));
    }
}

export default Moveable;