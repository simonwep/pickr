/**
 * Add an eventlistener which will be fired only once.
 *
 * @param element Target element
 * @param event Event name
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const once = (element, event, fn, options) => on(element, event, function helper() {
    fn.apply(this, arguments);
    this.removeEventListener(event, helper);
}, options);

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');

function eventListener(method, elements, events, fn, options = {}) {

    // Normalize array
    if (elements instanceof HTMLCollection || elements instanceof NodeList) {
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

    return Array.prototype.slice.call(arguments, 1);
}

/**
 * Creates an DOM-Element out of a string (Single element).
 * @param html HTML representing a single element
 * @returns {HTMLElement} The element.
 */
export function createElementFromString(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

/**
 * Removes an attribute from a HTMLElement and returns the value.
 * @param el
 * @param name
 * @return {string}
 */
export function removeAttribute(el, name) {
    const value = el.getAttribute(name);
    el.removeAttribute(name);
    return value;
}

/**
 * Creates a new html element, every element which has
 * a 'data-key' attribute will be saved in a object (which will be returned)
 * where the value of 'data-key' ist the object-key and the value the HTMLElement.
 *
 * It's possible to create a hierarchy if you add a 'data-con' attribute. Every
 * sibling will be added to the object which will get the name from the 'data-con' attribute.
 *
 * If you want to create an Array out of multiple elements, you can use the 'data-arr' attribute,
 * the value defines the key and all elements, which has the same parent and the same 'data-arr' attribute,
 * would be added to it.
 *
 * @param str - The HTML String.
 */
export function createFromTemplate(str) {

    // Recursive function to resolve template
    function resolve(element, base = {}) {

        // Check key and container attribute
        const con = removeAttribute(element, 'data-con');
        const key = removeAttribute(element, 'data-key');

        // Check and save element
        if (key) {
            base[key] = element;
        }

        // Check all children
        const children = Array.from(element.children);
        const subtree = con ? (base[con] = {}) : base;
        for (let child of children) {

            // Check if element should be saved as array
            const arr = removeAttribute(child, 'data-arr');
            if (arr) {

                // Check if there is already an array and add element
                (subtree[arr] || (subtree[arr] = [])).push(child);
            } else {
                resolve(child, subtree);
            }
        }

        return base;
    }

    return resolve(createElementFromString(str));
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) return path;

    let el = evt.target.parentElement;
    path = [evt.target, el];
    while (el = el.parentElement) path.push(el);

    path.push(document, window);
    return path;
}

/**
 * Binds all functions of an ES6 class, starting with an underscore, to the class itself.
 * @param context The context
 */
export function bindClassUnderscoreFunctions(context) {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(context));
    for (const fn of methods) {
        if (fn.charAt(0) === '_' && typeof context[fn] === 'function') {
            context[fn] = context[fn].bind(context);
        }
    }
}
