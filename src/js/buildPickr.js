import * as _ from './lib/utils';

export default options => {
    const {components, strings, useAsButton, inline, appClass} = options;
    const hidden = con => con ? '' : 'style="display:none" hidden';

    const root = _.createFromTemplate(`
        <div data-key="root" class="pickr">
        
            ${useAsButton ? '' : '<button type="button" data-key="button" class="pcr-button"></button>'}

            <div data-key="app" class="pcr-app ${appClass || ''}" ${inline ? 'style="position: unset"' : ''}>
                <div class="pcr-selection" ${hidden(components.palette)}>
                    <div data-con="preview" class="pcr-color-preview" ${hidden(components.preview)}>
                        <button type="button" data-key="lastColor" class="pcr-last-color"></button>
                        <div data-key="currentColor" class="pcr-current-color"></div>
                    </div>

                    <div data-con="palette" class="pcr-color-palette">
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="palette" class="pcr-palette"></div>
                    </div>

                    <div data-con="hue" class="pcr-color-chooser" ${hidden(components.hue)}>
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="slider" class="pcr-hue pcr-slider"></div>
                    </div>

                    <div data-con="opacity" class="pcr-color-opacity" ${hidden(components.opacity)}>
                        <div data-key="picker" class="pcr-picker"></div>
                        <div data-key="slider" class="pcr-opacity pcr-slider"></div>
                    </div>
                </div>

                <div class="pcr-swatches ${components.palette ? '' : ' pcr-last'}" data-key="swatches"></div> 

                <div data-con="interaction" class="pcr-interaction" ${hidden(Object.keys(components.interaction).length)}>
                    <input data-key="result" class="pcr-result" type="text" spellcheck="false" ${hidden(components.interaction.input)}>

                    <input data-arr="options" class="pcr-type" data-type="HEXA" value="HEXA" type="button" ${hidden(components.interaction.hex)}>
                    <input data-arr="options" class="pcr-type" data-type="RGBA" value="RGBA" type="button" ${hidden(components.interaction.rgba)}>
                    <input data-arr="options" class="pcr-type" data-type="HSLA" value="HSLA" type="button" ${hidden(components.interaction.hsla)}>
                    <input data-arr="options" class="pcr-type" data-type="HSVA" value="HSVA" type="button" ${hidden(components.interaction.hsva)}>
                    <input data-arr="options" class="pcr-type" data-type="CMYK" value="CMYK" type="button" ${hidden(components.interaction.cmyk)}>

                    <input data-key="save" class="pcr-save" value="${strings.save || 'Save'}" type="button" ${hidden(components.interaction.save)}>
                    <input data-key="clear" class="pcr-clear" value="${strings.clear || 'Clear'}" type="button" ${hidden(components.interaction.clear)}>
                </div>
            </div>
        </div>
    `);

    const int = root.interaction;

    // Select option which is not hidden
    int.options.find(o => !o.hidden && !o.classList.add('active'));

    // Create method to find currenlty active option
    int.type = () => int.options.find(e => e.classList.contains('active'));
    return root;
}
