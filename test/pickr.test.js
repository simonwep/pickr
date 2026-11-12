import {afterEach, beforeAll, describe, expect, it, vi} from 'vitest';
import Pickr from '../src/js/pickr';

const waitForInit = pickr => new Promise(resolve => pickr.on('init', resolve));

const createPickr = options => {
    const el = document.body.appendChild(document.createElement('div'));
    return Pickr.create({el, theme: 'classic', ...options});
};

describe('Pickr', () => {
    const instances = [];

    beforeAll(() => {

        // jsdom does not perform layout, pickr waits for the app to have a width before finishing setup
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
            configurable: true,
            get: () => 1
        });
    });

    afterEach(() => {
        instances.splice(0).forEach(pickr => pickr.destroyAndRemove());
        document.body.innerHTML = '';
    });

    it.each([0, 1, 3])('cancels setup after %i hidden setup retries', retries => {
        const frames = new Map();
        let frameId = 0;
        vi.stubGlobal('requestAnimationFrame', callback => {
            frames.set(++frameId, callback);
            return frameId;
        });
        vi.stubGlobal('cancelAnimationFrame', id => frames.delete(id));
        const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
            configurable: true,
            get: () => 0
        });

        const pickr = createPickr({default: '#ff0000'});
        try {
            for (let retry = 0; retry < retries; retry++) {
                const [id, callback] = frames.entries().next().value;
                frames.delete(id);
                callback();
                expect(frames.size).toBe(1);
            }
            pickr.destroyAndRemove();
            expect(frames.size).toBe(0);
        } finally {
            Object.defineProperty(HTMLElement.prototype, 'offsetWidth', width);
            vi.unstubAllGlobals();
        }
    });

    it('ignores a swatch while its custom trigger is disabled', async () => {
        const el = document.body.appendChild(document.createElement('input'));
        const pickr = createPickr({el, useAsButton: true, default: '#ff0000', swatches: ['#0000ff']});
        instances.push(pickr);
        await waitForInit(pickr);

        const change = vi.fn();
        pickr.on('change', change);
        pickr.show();
        const swatch = pickr.getRoot().swatches.querySelector('button');

        el.disabled = true;
        swatch.click();
        expect(pickr.getColor().toHEXA().toString()).toBe('#FF0000');
        expect(change).not.toHaveBeenCalled();

        el.disabled = false;
        swatch.click();
        expect(pickr.getColor().toHEXA().toString()).toBe('#0000FF');
        expect(change).toHaveBeenCalledTimes(1);
    });

    it('applies the default color', async () => {
        const pickr = createPickr({default: '#ff0000'});
        instances.push(pickr);

        await waitForInit(pickr);
        expect(pickr.getColor().toHEXA().toString()).toBe('#FF0000');
        expect(pickr.getSelectedColor().toHEXA().toString()).toBe('#FF0000');
    });

    it('keeps a color set via setColor before initialization finished', async () => {
        const pickr = createPickr({default: '#ff0000'});
        instances.push(pickr);

        expect(pickr.setColor('#00ff00')).toBe(true);
        await waitForInit(pickr);
        expect(pickr.getColor().toHEXA().toString()).toBe('#00FF00');
        expect(pickr.getSelectedColor().toHEXA().toString()).toBe('#00FF00');
    });

    it('keeps a color cleared via setColor(null) before initialization finished', async () => {
        const pickr = createPickr({default: '#ff0000'});
        instances.push(pickr);

        expect(pickr.setColor(null)).toBe(true);
        await waitForInit(pickr);
        expect(pickr.getSelectedColor()).toBe(null);
    });
});
