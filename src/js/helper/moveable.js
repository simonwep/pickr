import * as _ from './../lib/utils';

export default class Moveable {

    constructor(opt) {

        // Assign default values
        this.options = Object.assign({
            lockX: false,
            lockY: false,
            onchange: () => 0
        }, opt);

        _.bindClassUnderscoreFunctions(this);
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

    _tapmove(evt) {
        const wrapper = this.options.wrapper;
        const element = this.options.element;
        const b = wrapper.getBoundingClientRect();

        let x, y;
        if (evt) {
            const touch = evt && evt.touches && evt.touches[0];
            x = evt ? (touch || evt).clientX : 0;
            y = evt ? (touch || evt).clientY : 0;

            // Reset to bounds
            if (x < b.left) x = b.left;
            else if (x > b.left + b.width) x = b.left + b.width;
            if (y < b.top) y = b.top;
            else if (y > b.top + b.height) y = b.top + b.height;

            // Normalize
            x -= b.left;
            y -= b.top;
        } else if (this.cache) {
            x = this.cache.x;
            y = this.cache.y;
        } else {
            x = 0;
            y = 0;
        }

        if (!this.options.lockX)
            element.style.left = (x - element.offsetWidth / 2) + 'px';

        if (!this.options.lockY)
            element.style.top = (y - element.offsetHeight / 2) + 'px';

        this.cache = {x, y};
        this.options.onchange(x, y);
    }

    _tapstop() {
        _.off(document, ['mouseup', 'touchend', 'touchcancel'], this._tapstop);
        _.off(document, ['mousemove', 'touchmove'], this._tapmove);
    }

    trigger() {
        this._tapmove();
    }

    update(x = 0, y = 0) {
        const wrapperBoundaries = this.options.wrapper.getBoundingClientRect();
        this._tapmove(new MouseEvent('mousemove', {
            clientX: wrapperBoundaries.left + x,
            clientY: wrapperBoundaries.top + y
        }));
    }

    destroy(){
        _.off([this.options.wrapper, this.options.element], 'mousedown', this._tapstart);
        _.off([this.options.wrapper, this.options.element], 'touchstart', this._tapstart, {
            passive: false
        });
    }
}