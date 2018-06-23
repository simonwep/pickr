import * as _ from './../lib/utils';

class Selectable {

    constructor(opt) {

        // Assign default values
        this.options = Object.assign({
            onchange: undefined,
            className: ''
        }, opt);

        _.bindClassUnderscoreFunctions(this);
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

    destroy(){
        _.off(this.options.elements, 'click', this._ontap);
    }
}

export default Selectable;