const pickr = new Pickr({
    el: '.color-picker',

    default: '#42445A',

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
