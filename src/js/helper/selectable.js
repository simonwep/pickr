import * as _ from './../lib/utils';

export default function Selectable(opt = {}) {
    const that = {

        // Assign default values
        options: Object.assign({
            onchange: () => 0,
            className: '',
            elements: []
        }, opt),

        _ontap(evt) {
            const opt = that.options;
            opt.elements.forEach(e =>
                e.classList[evt.target === e ? 'add' : 'remove'](opt.className)
            );

            opt.onchange(evt);
        },

        destroy() {
            _.off(that.options.elements, 'click', this._ontap);
        }
    };

    _.on(that.options.elements, 'click', that._ontap);
    return that;
}