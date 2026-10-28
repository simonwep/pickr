import {afterEach, beforeAll, describe, expect, it} from 'vitest';
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
