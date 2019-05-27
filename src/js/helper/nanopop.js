/**
 * Micro positioning-engine
 * @param el
 * @param reference
 * @param v
 * @param h
 * @param padding
 * @returns {{update(): void}}
 * @constructor
 */
export default function Nanopop({el, reference, pos: {v, h}, padding = 8}) {
    const vBehaviour = {left: 'sme', middle: 'mes', right: 'ems'};
    const hBehaviour = {top: 'tb', bottom: 'bt'};
    let left, top;

    return {
        update() {
            const rb = reference.getBoundingClientRect();
            const eb = el.getBoundingClientRect();

            const hDirs = {
                b: rb.bottom + padding,
                t: rb.top - eb.height - padding
            };

            const vDirs = {
                l: rb.left + rb.width - eb.width,
                m: (-eb.width / 2) + (rb.left + rb.width / 2),
                r: rb.left
            };

            for (const ch of vBehaviour[v]) {
                const v = vDirs[ch];
                if (v > 0 && (v + eb.width) < window.innerWidth) {
                    left = v;
                    break;
                }
            }

            for (const ch of hBehaviour[h]) {
                const v = hDirs[ch];
                if (v > 0 && (v + eb.height) < window.innerHeight) {
                    top = v;
                    break;
                }
            }

            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
        }
    };
}
