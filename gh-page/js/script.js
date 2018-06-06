const pickr = new Pickr({
    el: '.color-picker',

    components: {

        preview: true,
        opacity: true,
        hue: true,

        output: {
            hex: true,
            rgba: true,
            hsva: true,
            input: true
        },
    },
});
