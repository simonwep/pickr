import * as path from 'path';

describe('Swatches', () => {
    it('Should add a swatch and select it', async () => {
        await page.goto(`file:${path.join(__dirname, 'test.html')}`);
        await page.evaluate(() => {
            // @ts-ignore
            const pickr = new Pickr({
                el: 'body > div',
                swatches: ['#fcb'],
                components: {
                    interaction: {
                        hex: true,
                        rgba: true,
                        hsla: true,
                        hsva: true,
                        cmyk: true,
                        input: true
                    }
                }
            }).show();

            return new Promise(resolve => pickr.on('init', resolve));
        });

        await page.click('.pcr-swatches button:nth-child(1)');
        await expect(
            await page.$eval(
                '.pcr-result',
                el => (el as any).value
            )
        ).toEqual('#FFCCBB');
    });
});
