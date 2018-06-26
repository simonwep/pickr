import * as _ from './../lib/utils';

export default class Selectable {

    constructor(opt) {

        // Assign default values
        this.options = Object.assign({
            onchange: () => 0,
            className: ''
        }, opt);

        _.bindClassUnderscoreFunctions(this);
        _.on(this.options.elements, 'click', this._ontap);
    }

    _ontap(evt) {
        const opt = this.options;

        opt.elements.forEach(e => e.classList.remove(opt.className));
        evt.target.classList.add(opt.className);

        opt.onchange();
    }

    destroy() {
        _.off(this.options.elements, 'click', this._ontap);
    }
}