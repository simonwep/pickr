/**
 * Convert HSL spectrum to RGB.
 * H from 0 to 360, S fro 0 to 100, L from 0 to 100.
 *
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @returns {number[]} Array with rgb values.
 */
export function hslToRgb(h, s, l) {
    h = h / 100;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    g = Math.round(hue2rgb(p, q, h) * 255);
    b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

    return [r, g, b];
}

/**
 * Convert HSL spectrum to Hex.
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @returns {string[]} Hex values
 */
export function hslToHex(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    return rgb.map(v => v.toString(16).padStart(2, '0'));
}

/**
 * Convert HSL spectrum to CMYK.
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @returns {number[]} CMYK values
 */
export function hslToCmyk(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    let k, c, m, y;

    k = Math.min(1 - r, 1 - g, 1 - b);

    c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    c = Math.round(c * 100);
    m = Math.round(m * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);

    return [c, m, y, k];
}