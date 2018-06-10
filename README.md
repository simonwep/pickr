<h1 align="center">
    <img src="logo.png" alt="Logo">
</h1>

<h3 align="center">
    Flat, Simple, Hackable Color-Picker.
</h3>

<p align="center">
  <a href="https://choosealicense.com/licenses/mit/"><img
	  alt="License MIT"
	  src="https://img.shields.io/badge/licence-MIT-3498db.svg"></a>
  <a href="https://webpack.js.org/"><img
     alt="Webpack"
     src="https://img.shields.io/badge/Webpack-4-3498db.svg"></a>
  <img alt="No dependencies"
       src="https://img.shields.io/badge/dependencies-none-27ae60.svg">
  <a href="https://www.npmjs.com/"><img
     alt="npm package"
     src="https://img.shields.io/badge/npm-6.0.1-e74c3c.svg"></a>
  <img alt="Current version"
       src="https://img.shields.io/badge/version-0.0.1-f1c40f.svg">
</p>

<br>

<h3 align="center">
  <img alt="Demo" src="gh-page/pickr.apng"/>
</h3>

<h3 align="center">
  <a href="https://simonwep.github.io/pickr/">Fully Featured demo</a>
</h3>

<br>

### Features
* Simple usage
* No jQuery
* No dependencies
* Multiple color representations
* Color comparison
* Opacity control
* Supports touch devices
* Nodejs support

### Install

Via npm
```
$ npm install pickr-widget --save
```

Link styles and add scripts
```markdown
<link rel="stylesheet" href="node_modules/pickr/dist/pickr.min.css"/>
<script src="node_modules/pickr/dist/pickr.min.js"></script>
```

### Usage
```javascript
const pickr = Pickr.create({
    el: '.color-picker'
});
```

### Optional options
```javascript
const pickr = new Pickr({

    // Selector or element which will be replaced with the actual color-picker
    el: '.color-picker',

    // Defines the position of the color-picker. Available options are
    // top, left and middle relativ to the picker button.
    position: 'middle',

    // Show or hide specific components.
    // By default only the palette (and the save button) is visible.
    components: {

        preview: true, // Left side color comparison
        opacity: true, // Opacity slider
        hue: true,     // Hue slider

        // Bottom output bar, theoretically you could use 'true' as propery.
        // But this would also hide the save-button.
        output: {
            hex: true,  // hex option  (hexadecimal representation of the rgb value)
            rgba: true, // rgba option (red green blue and alpha)
            hsla: true, // hsla option (hue saturation lightness and alpha)
            hsva: true, // hsva option (hue saturation value and alpha)
            cmyk: true, // cmyk option (cyan mangenta yellow key )
            input: true // input / output element
        },
    },


    // User has changed the color
    onChange(hsva, instance) {
        hsva;     // HSVa color object
        instance; // Current Pickr instance
    },

    // User has clicked the save button
    onSave(hsva, instance) {
        // same as onChange
    }
});
```

## The HSVaColor object
As default color representation is hsva (`hue`, `saturation`, `value` and `alpha`) used, but you can also convert it to other formats as listed below.

* hsva.tohsva(raw`:Boolean`) _- Converts the object to a hsva string / array._
* hsva.tohsla(raw`:Boolean`) _- Converts the object to a hsla string / array._
* hsva.torgba(raw`:Boolean`) _- Converts the object to a rgba string / array._
* hsva.tohex(raw`:Boolean`) _- Converts the object to a hexa-decimal string / array._
* hsva.tocmyk(raw`:Boolean`) _- Converts the object to a cymk string / array._
* hsva.clone() _- Clones the color object._

The `raw` property describes if you want a string representation of the color or an array with the values. Example:

```javascript
hsva.torgba(true); // Returns [r, g, b, a]
hsva.torgba();     // Returns rgba(r, g, b, a)
```

## Methods
* pickr.setHSVa(h`:Number`,s`:Number`,v`:Number`,a`:Float`) _- Set an color._
* pickr.show() _- Shows the color-picker._
* pickr.hide() _- Hides the color-picker._
* pickr.cancel() _- Cancels the current color picking._
* pickr.getRoot()`:HTMLElement` _- Returns the root DOM-Element of the color-picker._
* pickr.getColor()`:HSVaColor` _- Returns the current HSVaColor object._

## Static methods
**Pickr**
* Pickr.create(options`:Object`)`:Pickr` _- Creates a new instance._

**Pickr.utils**
* on(el`:HTMLElement`, event`:String`, fn`:Function`[, options `:Object`]) _- Attach an event handler function._
* off(el`:HTMLElement`, event`:String`, fn`:Function`[, options `:Object`]) _- Remove an event handler._
* createElementFromString(html`:String`)`:HTMLElement` _- Creates an new HTML Element out of this string._
* eventPath(evt`:Event`)`:[HTMLElement]` _- A polyfill for the event-path event propery._
