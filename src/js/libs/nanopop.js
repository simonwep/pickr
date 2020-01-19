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

    // Positioning priorities for variants
    const vBehaviour = {
        start: 'sme',
        middle: 'mse',
        end: 'ems'
    };

    // Positioning priorities for general alignment
    const hBehaviour = {
        top: 'tbrl',
        right: 'rltb',
        bottom: 'btrl',
        left: 'lrbt'
    };

    const getInfo = ((cache = {}) => (pos, cached = cache[pos]) => {

        // Return cached value if possible
        if (cached) {
            return cached;
        }

        // Extract position and variant
        // Top-start -> top is "position" and "start" is the variant
        const [position, variant = 'middle'] = pos.split('-');

        // It's vertical if top or bottom is used as position
        const isVertical = (position === 'top' || position === 'bottom');

        // Cache value and return
        return cache[pos] = {
            position,
            variant,
            isVertical
        };
    })();

    return {

        /**
         * Re-aligns the element
         * @param pos Position string
         * @param useFallback If everything fails the element may be centered on the the entire screen ignoring the reference
         */
        update(pos, useFallback = false) {
            const {position, variant, isVertical} = getInfo(pos);
            const rb = reference.getBoundingClientRect();
            const eb = el.getBoundingClientRect();

            /**
             * Holds coordinates of top, left, bottom and right alignment
             */
            const positions = vertical => vertical ? {
                t: rb.top - eb.height - padding,
                b: rb.bottom + padding
            } : {
                r: rb.right + padding,
                l: rb.left - eb.width - padding
            };

            /**
             * Holds corresponding variants (start, middle, end)
             */
            const variants = vertical => vertical ? {
                s: rb.left + rb.width - eb.width,
                m: (-eb.width / 2) + (rb.left + rb.width / 2),
                e: rb.left
            } : {
                s: rb.bottom - eb.height,
                m: rb.bottom - rb.height / 2 - eb.height / 2,
                e: rb.bottom - rb.height
            };

            // Holds the last working positions
            const leastApplied = {};

            /**
             * Applies a position, example precedure with top-start: it'll
             * first try to satify the variant "start", if this fails it'll try
             * the remaining variants (in this case "middle" and "end")
             * @param positions Array of positions in the order they should be applied
             * @param positionVariants Variants, the first should be the one initially wanted
             * @param targetProperty The target property, defines if this is a horizontal or vertical aligment
             * @returns a value for targetProperty or null if none fits
             */
            const findFittingValue = (positions, positionVariants, targetProperty) => {
                const vertical = targetProperty === 'top';
                const elSize = vertical ? eb.height : eb.width;
                const winSize = window[vertical ? 'innerHeight' : 'innerWidth'];

                for (const posChar of positions) {
                    const wantedValue = positionVariants[posChar];
                    const wantedValueAsString = leastApplied[targetProperty] = `${wantedValue}px`;

                    if (wantedValue > 0 && (wantedValue + elSize) < winSize) {
                        return wantedValueAsString;
                    }
                }

                return null;
            };


            for (const vertical of [isVertical, !isVertical]) {

                /**
                 * Va and vb both define where the element is positioned (top, bottom, left, right)
                 * and it's corresponding variant (start, middle, end). Since we're "rotating" the element
                 * to ensure to (hopefully) find at least one fitting position the values need to be
                 * defined during runtime.
                 */
                const vaType = vertical ? 'top' : 'left';
                const vbType = vertical ? 'left' : 'top';

                // Actual values for top and bottom
                const vaValue = findFittingValue(hBehaviour[position], positions(vertical), vaType);
                const vbValue = findFittingValue(vBehaviour[variant], variants(vertical), vbType);

                // Both values work, apply them
                if (vaValue && vbValue) {
                    el.style[vbType] = vbValue;
                    el.style[vaType] = vaValue;
                    return;
                }
            }

            // It failed to find a non-clipping position, if fallback is enable it'll use it - otherwise the last
            // Calculated values will be used.
            if (useFallback) {
                el.style.top = `${(window.innerHeight - eb.height) / 2}px`;
                el.style.left = `${(window.innerWidth - eb.width) / 2}px`;
            } else {
                el.style.left = leastApplied.left;
                el.style.top = leastApplied.top;
            }
        }
    };
}
