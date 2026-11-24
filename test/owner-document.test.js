import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import Pickr from '../src/js/pickr';
import Moveable from '../src/js/libs/moveable';

const bounds = {left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100};

const pointer = (view, type, x, y) => {
    if (type.startsWith('touch')) {
        const event = new view.Event(type, {bubbles: true, cancelable: true});
        event.touches = [{clientX: x, clientY: y}];
        return event;
    }
    return new view.MouseEvent(type, {bubbles: true, cancelable: true, clientX: x, clientY: y});
};

describe('owner document interactions', () => {
    const instances = [];
    let frame, doc, view;

    beforeEach(() => {
        frame = document.body.appendChild(document.createElement('iframe'));
        doc = frame.contentDocument;
        view = frame.contentWindow;
        vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(bounds);
    });

    afterEach(() => {
        instances.splice(0).forEach(instance => instance.destroyAndRemove());
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it.each([
        ['mouse', 'mousedown', 'mousemove', 'mouseup'],
        ['touch', 'touchstart', 'touchmove', 'touchend'],
        ['cancelled touch', 'touchstart', 'touchmove', 'touchcancel']
    ])('moves and releases a %s drag only in its document', (name, start, move, stop) => {
        const wrapper = doc.body.appendChild(doc.createElement('div'));
        const element = wrapper.appendChild(doc.createElement('div'));
        wrapper.getBoundingClientRect = () => bounds;
        const onchange = vi.fn();
        const onstop = vi.fn();
        const moveable = Moveable({wrapper, element, onchange, onstop});
        try {
            wrapper.dispatchEvent(pointer(view, start, 20, 30));
            expect(onchange).toHaveBeenLastCalledWith(0.2, 0.3);
            document.dispatchEvent(pointer(window, move, 90, 90));
            document.dispatchEvent(pointer(window, stop));
            expect(onchange).toHaveBeenCalledTimes(1);
            expect(onstop).not.toHaveBeenCalled();

            doc.dispatchEvent(pointer(view, move, 70, 80));
            expect(onchange).toHaveBeenLastCalledWith(0.7, 0.8);
            doc.dispatchEvent(pointer(view, stop));
            expect(onstop).toHaveBeenCalledTimes(1);
            doc.dispatchEvent(pointer(view, move, 90, 90));
            expect(onchange).toHaveBeenCalledTimes(2);

            wrapper.dispatchEvent(pointer(view, start, 20, 30));
            moveable.destroy();
            doc.dispatchEvent(pointer(view, move, 90, 90));
            doc.dispatchEvent(pointer(view, stop));
            expect(onchange).toHaveBeenCalledTimes(3);
            expect(onstop).toHaveBeenCalledTimes(1);
        } finally {
            moveable.destroy();
        }
    });

    const createPickr = async (owner, options = {}) => {
        const el = owner.body.appendChild(owner.createElement('button'));
        const pickr = Pickr.create({
            el, container: owner.body, theme: 'classic', default: '#808080', defaultRepresentation: 'RGBA',
            components: {palette: true, hue: true, opacity: true, interaction: {input: true, rgba: true}},
            ...options
        });
        instances.push(pickr);
        await new Promise(resolve => pickr.on('init', resolve));
        return pickr;
    };

    it.each(['main', 'popout', 'custom popout button', 'inline popout'])(
        'handles dragging, arrow keys and dismissal in the %s document', async mode => {
            const owner = mode === 'main' ? document : doc;
            const win = owner.defaultView;
            const pickr = await createPickr(owner, {
                useAsButton: mode === 'custom popout button',
                inline: mode === 'inline popout',
                container: mode === 'inline popout' ? document.body : owner.body
            });
            const root = pickr.getRoot();
            expect(root.app.ownerDocument).toBe(owner);
            const onstop = vi.fn();
            pickr.on('changestop', onstop);

            for (const wrapper of [root.palette.palette, root.hue.slider, root.opacity.slider]) {
                pickr.show();
                wrapper.dispatchEvent(pointer(win, 'mousedown', 20, 30));
                expect(pickr.isOpen()).toBe(true);
                const clicked = pickr.getColor().toHSVA().slice();
                owner.dispatchEvent(pointer(win, 'mousemove', 70, 80));
                expect(pickr.getColor().toHSVA()).not.toEqual(clicked);
                owner.dispatchEvent(pointer(win, 'mouseup'));
                expect(onstop).toHaveBeenCalledTimes(1);

                wrapper.focus();
                const dragged = pickr.getColor().toHSVA().slice();
                wrapper.dispatchEvent(new win.KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));
                expect(pickr.getColor().toHSVA()).not.toEqual(dragged);
                wrapper.dispatchEvent(new win.KeyboardEvent('keyup', {key: 'ArrowDown', bubbles: true}));
                expect(onstop).toHaveBeenCalledTimes(2);
                onstop.mockClear();
            }

            if (owner !== document) {
                document.dispatchEvent(new KeyboardEvent('keyup', {key: 'Escape'}));
                document.body.dispatchEvent(pointer(window, 'mousedown'));
                expect(pickr.isOpen()).toBe(true);
            }
            owner.dispatchEvent(new win.KeyboardEvent('keyup', {key: 'Escape'}));
            expect(pickr.isOpen()).toBe(false);
            for (const type of ['mousedown', 'touchstart']) {
                pickr.show();
                owner.body.dispatchEvent(pointer(win, type));
                expect(pickr.isOpen()).toBe(false);
            }
        }
    );

    it('uses the owning body and viewport when positioning', async () => {
        const pickr = await createPickr(doc);
        const {app, button} = pickr.getRoot();
        button.getBoundingClientRect = () => ({...bounds, left: 20, right: 40, top: 20, bottom: 40, width: 20, height: 20});
        doc.body.getBoundingClientRect = () => ({...bounds, width: 400, height: 400, right: 400, bottom: 400});
        pickr.show();
        expect(app.style.top).toBe('48px');
        expect(app.style.left).toBe('20px');

        pickr.hide();
        doc.body.getBoundingClientRect = () => ({...bounds, width: 0, height: 0, right: 0, bottom: 0});
        Object.defineProperty(view, 'innerWidth', {value: 600, configurable: true});
        Object.defineProperty(view, 'innerHeight', {value: 400, configurable: true});
        pickr.show();
        expect(app.style.left).toBe('250px');
        expect(app.style.top).toBe('150px');
    });

    it('listens for scroll in the owning window and removes listeners on destroy', async () => {
        const pickr = await createPickr(doc, {closeOnScroll: true});
        pickr.show();
        window.dispatchEvent(new Event('scroll'));
        expect(pickr.isOpen()).toBe(true);
        view.dispatchEvent(new view.Event('scroll'));
        expect(pickr.isOpen()).toBe(false);
        await new Promise(resolve => setTimeout(resolve, 130));

        pickr.show();
        pickr.destroy();
        view.dispatchEvent(new view.Event('scroll'));
        doc.dispatchEvent(new view.KeyboardEvent('keyup', {key: 'Escape'}));
        doc.body.dispatchEvent(pointer(view, 'mousedown'));
        expect(pickr.isOpen()).toBe(true);
    });

    it.each([['main', 0], ['main', 1], ['popout', 0], ['popout', 1]])(
        'cancels positioning in the %s window after %i frames on destroy', async (mode, retries) => {
            const owner = mode === 'main' ? document : doc;
            const pickr = await createPickr(owner);
            pickr.show();
            const frames = new Map();
            let frameId = 0;
            vi.useFakeTimers();
            vi.stubGlobal('requestAnimationFrame', callback => {
                frames.set(++frameId, callback);
                return frameId;
            });
            vi.stubGlobal('cancelAnimationFrame', id => frames.delete(id));
            try {
                owner.defaultView.dispatchEvent(new owner.defaultView.Event('resize'));
                owner.defaultView.dispatchEvent(new owner.defaultView.Event('scroll'));
                for (let retry = 0; retry < retries; retry++) {
                    const [id, callback] = frames.entries().next().value;
                    frames.delete(id);
                    callback();
                }
                expect(frames.size).toBe(1);
                expect(vi.getTimerCount()).toBe(1);
                pickr.destroy();
                expect(frames.size).toBe(0);
                expect(vi.getTimerCount()).toBe(0);
            } finally {
                vi.unstubAllGlobals();
                vi.useRealTimers();
            }
        }
    );

    it('adjusts input numbers from the owning window and stops on blur or destroy', async () => {
        const pickr = await createPickr(doc);
        const input = pickr.getRoot().interaction.result;
        pickr.show();
        input.focus();
        input.setSelectionRange(5, 5);
        const before = input.value;
        const wheel = win => new win.WheelEvent('wheel', {deltaY: -1, cancelable: true});
        window.dispatchEvent(wheel(window));
        expect(input.value).toBe(before);
        view.dispatchEvent(wheel(view));
        expect(input.value).not.toBe(before);
        expect(pickr.getColor().toRGBA()[0]).toBe(129);

        input.blur();
        const changed = input.value;
        view.dispatchEvent(wheel(view));
        expect(input.value).toBe(changed);
        input.focus();
        pickr.destroy();
        view.dispatchEvent(wheel(view));
        expect(input.value).toBe(changed);
    });

    it('retains the owning document in the event-path fallback', () => {
        const target = doc.body.appendChild(doc.createElement('button'));
        const path = Pickr.utils.eventPath({target});
        expect(path.at(-2) === doc).toBe(true);
        expect(path.at(-1) === view).toBe(true);
    });
});
