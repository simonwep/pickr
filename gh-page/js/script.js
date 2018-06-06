const pickr = new Pickr({
    el: '.color-picker',

    components: {

        preview: true,
        opacity: true,
        hue: true,

        output: {
            hex: true,
            hsla: true,
            rgba: true,
            cmyk: true,
            input: true
        },
    },
});
