import * as path from 'path';

describe('Init', () => {

    it('Should create a new pickr instance with basic components', async () => {
        await page.goto(`file:${path.join(__dirname, 'test.html')}`);
        await page.evaluate(() => {
            // @ts-ignore
            const pickr = new Pickr({
                el: 'body > div',
                components: {
                    preview: true,
                    opacity: true,
                    hue: true,
                    interaction: {
                        hex: true,
                        rgba: true,
                        hsla: true,
                        hsva: true,
                        cmyk: true,
                        input: true,
                        clear: true,
                        save: true
                    }
                }
            });

            return new Promise(resolve => pickr.on('init', resolve));
        });

        await expect(page).toMatchElement('.pickr');
        await expect(page).toMatchElement('.pcr-selection');
        await expect(page).toMatchElement('.pcr-color-preview');
    });
});

