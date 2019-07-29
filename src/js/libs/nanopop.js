/**
 * Micro positioning-engine
 * @param el
 * @param reference
 * @param pos
 * @param padding
 * @returns {{update(): void}}
 * @constructor
 */
export default function Nanopop({el, reference, padding = 8}) {
    const vBehaviour = {start: 'sme', middle: 'mse', end: 'ems'};
    const hBehaviour = {top: 'tbrl', right: 'rltb', bottom: 'btrl', left: 'lrbt'};

    const getInfo = ((cache = {}) => (pos, cached = cache[pos]) => {
        if (cached) return cached;
        const [position, variant = 'middle'] = pos.split('-');
        const isVertical = (position === 'top' || position === 'bottom');

        return cache[pos] = {
            position,
            variant,
            isVertical
        };
    })();

    return {
        update(pos) {
            const {position, variant, isVertical} = getInfo(pos);
            const rb = reference.getBoundingClientRect();
            const eb = el.getBoundingClientRect();

            const positions = vertical => vertical ? {
                t: rb.top - eb.height - padding,
                b: rb.bottom + padding
            } : {
                r: rb.right + padding,
                l: rb.left - eb.width - padding
            };

            const variants = vertical => vertical ? {
                s: rb.left + rb.width - eb.width,
                m: (-eb.width / 2) + (rb.left + rb.width / 2),
                e: rb.left
            } : {
                s: rb.bottom - eb.height,
                m: rb.bottom - rb.height / 2 - eb.height / 2,
                e: rb.bottom - rb.height
            };

            const leastApplied = {};

            function apply(bevs, vars, styleprop) {
                const vertical = styleprop === 'top';
                const adder = vertical ? eb.height : eb.width;
                const win = window[vertical ? 'innerHeight' : 'innerWidth'];

                for (const ch of bevs) {
                    const v = vars[ch];
                    const sv = leastApplied[styleprop] = `${v}px`;

                    if (v > 0 && (v + adder) < win) {
                        el.style[styleprop] = sv;
                        return true;
                    }
                }

                return false;
            }

            for (const rot of [isVertical, !isVertical]) {
                const v2Ok = apply(hBehaviour[position], positions(rot), rot ? 'top' : 'left');
                const v1Ok = apply(vBehaviour[variant], variants(rot), rot ? 'left' : 'top');

                if (v2Ok && v1Ok) {
                    return;
                }
            }

            el.style.left = leastApplied.left;
            el.style.top = leastApplied.top;
        }
    };
}
