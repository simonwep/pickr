import * as _ from './../lib/utils';

class Selectable {

    constructor(opt) {

        // Default values
        const def = {
            onchange: undefined,
            className: ''
        };

        this.options = Object.assign(def, opt);

        this._ontap = this._ontap.bind(this);
        _.on(this.options.elements, 'click', this._ontap);
    }

    _ontap(evt) {
        const opt = this.options;

        opt.elements.forEach(e => e.classList.remove(opt.className));
        evt.target.classList.add(opt.className);

        if (typeof opt.onchange === 'function') {
            opt.onchange();
        }
    }

    enable() {
        _.on(this.options.elements, 'click', this._ontap());
    }

    disable() {
        _.on(this.options.elements, 'click', this._ontap());
    }
}

export default Selectable;