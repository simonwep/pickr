declare class Pickr {
    constructor(options: Pickr.Options);

    setHSVA(h?: number, s?: number, v?: number, a?: number, silent?: boolean): boolean

    setColor(representation: Pickr.Representation, silent: boolean): boolean;

    on(event: Pickr.EventType, cb: Function): Pickr;

    off(event: Pickr.EventType, cb: Function): Pickr;

    show(): Pickr;

    hide(): Pickr;

    disable(): Pickr;

    enable(): Pickr;

    isOpen(): boolean;

    getRoot(): object;

    getColor(): Pickr.HSVaColor;

    getSelectedColor(): Pickr.HSVaColor;

    destroy(): void;

    destroyAndRemove(): void;

    setColorRepresentation(type: Pickr.Representation): boolean;

    getColorRepresentation(): Pickr.Representation;

    applyColor(silent: boolean): Pickr;

    addSwatch(color: string): boolean;

    removeSwatch(index: number): boolean
}

declare namespace Pickr {

    interface Options {
        el: string | HTMLElement,
        container?: string | HTMLElement,
        theme?: Theme,
        closeOnScroll?: boolean,
        appClass?: string,
        useAsButton?: boolean,
        padding?: number,
        inline?: boolean,
        autoReposition?: boolean,
        sliders?: Slider,
        disabled?: boolean,
        lockOpacity?: boolean,
        outputPrecision?: number,
        comparison?: boolean,
        default?: string,
        swatches?: Array<string> | null,
        defaultRepresentation?: Representation,
        showAlways?: boolean,
        closeWithKey?: string,
        position?: Position,
        adjustableNumbers?: boolean,

        components?: {
            palette?: boolean,
            preview?: boolean,
            opacity?: boolean,
            hue?: boolean,

            interaction?: {
                hex?: boolean,
                rgba?: boolean,
                hsla?: boolean,
                hsva?: boolean,
                cmyk?: boolean,
                input?: boolean,
                cancel?: boolean,
                clear?: boolean,
                save?: boolean,
            },
        },

        strings?: {
            save?: 'Save',
            clear?: 'Clear',
            cancel?: 'Cancel'
        }
    }

    interface HSVaColor {
        toHSVA(): Array<number>,

        toHSLA(): Array<number>,

        toRGBA(): Array<number>,

        toCMYK(): Array<number>,

        toHEXA(): Array<number>,

        clone(): HSVaColor
    }

    enum EventType {
        Init = 'init',
        Hide = 'hide',
        Show = 'show',
        Save = 'save',
        Clear = 'clear',
        Change = 'change',
        ChangeStop = 'changestop',
        Cancel = 'cancel',
        SwatchSelect = 'swatchselect'
    }

    enum Theme {
        classic = 'classic',
        monolith = 'monolith',
        nano = 'nano'
    }

    enum Position {
        TopStart = 'top-start',
        TopMiddle = 'top-middle',
        TopEnd = 'top-end',
        RightStart = 'right-start',
        RightMiddle = 'right-middle',
        RightEnd = 'right-end',
        BottomStart = 'bottom-start',
        BottomMiddle = 'bottom-middle',
        BottomEnd = 'bottom-end',
        LeftStart = 'left-start',
        LeftMiddle = 'left-middle',
        LeftEnd = 'left-end'
    }

    enum Representation {
        HEXA = 'HEXA',
        RGBA = 'RGBA',
        HSVA = 'HSVA',
        HSLA = 'HSLA',
        CMYK = 'CMYK'
    }

    enum Slider {
        vertical = 'v',
        horizontal = 'h'
    }
}

export default Pickr;
