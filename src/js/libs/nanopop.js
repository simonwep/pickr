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

    const getScrollOffset = el => {
        let top = 0, left = 0;

        while (el = el.parentElement) {
            top += el.scrollTop;
            left += el.scrollLeft;
        }

        return {top, left};
    };

    return {
        update(pos) {
            const {position, variant, isVertical} = getInfo(pos);
            const rb = reference.getBoundingClientRect();
            const eb = el.getBoundingClientRect();
            const so = getScrollOffset(el);

            const positions = vertical => vertical ? {
                t: rb.top - eb.height - padding + so.top,
                b: rb.bottom + padding + so.top
            } : {
                r: rb.right + padding + so.left,
                l: rb.left - eb.width - padding + so.left
            };

            const variants = vertical => vertical ? {
                s: rb.left + rb.width - eb.width + so.left,
                m: (-eb.width / 2) + (rb.left + rb.width / 2) + so.left,
                e: rb.left + so.left
            } : {
                s: rb.bottom - eb.height + so.top,
                m: rb.bottom - rb.height / 2 - eb.height / 2 + so.top,
                e: rb.bottom - rb.height + so.top
            };

            function apply(bevs, vars, styleprop) {
                const vertical = styleprop === 'top';
                const adder = vertical ? eb.height : eb.width;
                const win = window[vertical ? 'innerHeight' : 'innerWidth'] + (vertical ? so.top : so.left);

                for (const ch of bevs) {
                    const v = vars[ch];

                    if ((v - (vertical ? so.top : so.left)) > 0 && (v + adder) < win) {
                        el.style[styleprop] = `${v}px`;
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
        }
    };
}
