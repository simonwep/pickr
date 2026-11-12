import {expect, it, vi} from 'vitest';
import Moveable from '../src/js/libs/moveable';

it('ignores pointer moves and release after disabling an active drag', () => {
    const wrapper = document.createElement('div');
    const element = wrapper.appendChild(document.createElement('div'));
    const onchange = vi.fn();
    const onstop = vi.fn();
    let disabled = false;
    wrapper.getBoundingClientRect = () => ({left: 0, top: 0, width: 100, height: 100});
    const moveable = Moveable({wrapper, element, onchange, onstop, isDisabled: () => disabled});
    const dragEvent = type => new MouseEvent(type, {bubbles: true, clientX: 30, clientY: 40});

    try {
        wrapper.dispatchEvent(dragEvent('mousedown'));
        expect(onchange).toHaveBeenCalledTimes(1);

        disabled = true;
        document.dispatchEvent(dragEvent('mousemove'));
        document.dispatchEvent(dragEvent('mouseup'));
        expect(onchange).toHaveBeenCalledTimes(1);
        expect(onstop).not.toHaveBeenCalled();

        moveable.update(0.5, 0.5);
        expect(onchange).toHaveBeenCalledTimes(2);

        disabled = false;
        wrapper.dispatchEvent(dragEvent('mousedown'));
        document.dispatchEvent(dragEvent('mouseup'));
        expect(onchange).toHaveBeenCalledTimes(3);
        expect(onstop).toHaveBeenCalledTimes(1);
    } finally {
        moveable.destroy();
    }
});
