/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 */
export function on(elements, events, fn, options = {}) {
    eventListener(elements, events, fn, options);
}

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 */
export function off(elements, events, fn, options = {}) {
    eventListener(elements, events, fn, options, true);
}

function eventListener(elements, events, fn, options = {}, remove) {
    const method = remove ? 'removeEventListener' : 'addEventListener';

    // Normalize array
    if (HTMLCollection.prototype.isPrototypeOf(elements) ||
        NodeList.prototype.isPrototypeOf(elements)) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) {
        events = [events];
    }

    for (let element of elements) {
        for (let event of events) {
            element[method](event, fn, {capture: false, ...options});
        }
    }
}