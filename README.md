<h1 align="center">
    <img src="logo.png" alt="Logo">
</h1>

<h3 align="center">
    Flat, Simple, Hackable Color-Picker.
</h3>

<p align="center">
  <a href="https://choosealicense.com/licenses/mit/"><img
	  alt="License MIT"
	  src="https://img.shields.io/badge/licence-MIT-3498db.svg?style=popout-square"></a>
  <a href="https://webpack.js.org/"><img
     alt="Webpack"
     src="https://img.shields.io/badge/Webpack-4-3498db.svg?style=popout-square"></a>
  <img alt="No dependencies"
       src="https://img.shields.io/badge/dependencies-none-27ae60.svg?style=popout-square">
  <a href="https://travis-ci.org/Simonwep/pickr"><img
     alt="Build Status"
     src="https://travis-ci.org/Simonwep/pickr.svg?branch=master"></a>
  <a href="https://www.npmjs.com/"><img
     alt="Download count"
     src="https://img.shields.io/npm/dm/pickr-widget.svg?style=popout-square"></a>
  <img alt="Current version"
       src="https://img.shields.io/badge/version-0.3.6-f1c40f.svg?style=popout-square">
  <a href="https://www.patreon.com/simonwep"><img
     alt="Support me"
     src="https://img.shields.io/badge/patreon-support-f1c40f.svg?style=popout-square"></a>
</p>

<br>

<h3 align="center">
  <img alt="Demo" src="gh-page/pickr.apng"/>
</h3>

<h4 align="center">
  <a href="https://simonwep.github.io/pickr/">Fully Featured demo</a>
</h4>

<br>

### Features
* Simple usage
* No jQuery
* No dependencies
* Multiple color representations
* Color comparison
* Opacity control
* Responsive and auto-positioning
* Supports touch devices
* Lightweight, ~6KB gzipped

## Setup
⚠️ Attention: The readme is always up-to-date with the latest commit. See [Releases](https://github.com/Simonwep/pickr/releases) for installation instructions regarding to the latest version.

Thank's to [Clément Le Biez](https://github.com/Clebiez) for providing an optional ES5 version!

### Node
Install package:
```shell
$ npm install pickr-widget --save
```

Include code and style:
```js

// Style
import '/node_modules/pickr-widget/dist/pickr.min.css';

// Modern browsers (not IE11, see .browserslistrc)
import Pickr from '/node_modules/pickr-widget/dist/pickr.min';      

// ES5 Version
import Pickr from '/node_modules/pickr-widget/dist/pickr.es5.min'; 
```
---
### Browser

jsdelivr:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pickr-widget/dist/pickr.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/pickr-widget/dist/pickr.min.js"></script>
<!-- OR -->
<script src="https://cdn.jsdelivr.net/npm/pickr-widget/dist/pickr.es5.min.js"></script>
```

Be sure to load the `pickr.min.js` (or the es5 version) **after** `pickr.min.css`. Moreover the `script` tag doesn't work with the `defer` attribute.
## Usage
```javascript
// Simple example, see optional options for more configuration.
const pickr = Pickr.create({
    el: '.color-picker',

    components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
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
```

## Optional options
```javascript
const pickr = new Pickr({

    // Selector or element which will be replaced with the actual color-picker.
    // Can be a HTMLElement.
    el: '.color-picker',

    // Using the 'el' Element as button, won't replace it with the pickr-button.
    // If true, appendToBody will also be automatically true.
    useAsButton: false,

    // Start state. If true 'disabled' will be added to the button's classlist.
    disabled: false,

    // If set to false it would directly apply the selected color on the button and preview.
    comparison: true,
    
    // Default color
    default: 'fff',
    
    // Optional color swatches. null by default which means it's disabled.
    // Types are all these allowed which can be used in pickr e.g. hex, hsv(a), hsl(a), rgb(a) and cmyk
    swatches: ['#F44336', '#E91E63', '#9C27B0', '#673AB7'],

    // Default color representation.
    // Valid options are `HEX`, `RGBA`, `HSVA`, `HSLA` and `CMYK`.
    defaultRepresentation: 'HEX',

    // Option to keep the color picker always visible. You can still hide / show it via
    // 'pickr.hide()' and 'pickr.show()'. The save button keeps his functionality, so if
    // you click it, it will fire the onSave event.
    showAlways: false,

    // Defines a parent for pickr, if useAsButton is true and a parent is NOT defined
    // 'body' will be used as fallback.
    parent: null,

    // Close pickr with this specific key.
    // Default is 'Escape'. Can be the event key or code.
    closeWithKey: 'Escape',

    // Defines the position of the color-picker. Available options are
    // top, left and middle relativ to the picker button.
    // If clipping occurs, the color picker will automatically choose his position.
    position: 'middle',

    // Enables the ability to change numbers in an input field with the scroll-wheel.
    // To use it set the cursor on a position where a number is and scroll, use ctrl to make steps of five
    adjustableNumbers: true,

    // Show or hide specific components.
    // By default only the palette (and the save button) is visible.
    components: {

        preview: true, // Left side color comparison
        opacity: true, // Opacity slider
        hue: true,     // Hue slider

        // Bottom interaction bar, theoretically you could use 'true' as propery.
        // But this would also hide the save-button.
        interaction: {
            hex: true,  // hex option  (hexadecimal representation of the rgba value)
            rgba: true, // rgba option (red green blue and alpha)
            hsla: true, // hsla option (hue saturation lightness and alpha)
            hsva: true, // hsva option (hue saturation value and alpha)
            cmyk: true, // cmyk option (cyan mangenta yellow key )

            input: true, // input / output element
            clear: true, // Button which provides the ability to select no color,
            save: true   // Save button
        },
    },

    // Button strings, brings the possibility to use a language other than English.
    strings: {
       save: 'Save',  // Default for save button
       clear: 'Clear' // Default for clear button
    },

    // User changed the color
    onChange(hsva, instance) {
        hsva;     // HSVa color object, if cleared null
        instance; // Current Pickr instance
    },

    // User clicked the save button
    onSave(hsva, instance) {
        // same as onChange
    },
    
    // User clicked one of the color swatches
    onSwatchSelect(color, instance) {
        color;    // HSVa color object
        instance; // Current Pickr instance
    }
});
```

## The HSVaColor object
As default color representation is hsva (`hue`, `saturation`, `value` and `alpha`) used, but you can also convert it to other formats as listed below.

* hsva.toHSVA() _- Converts the object to a hsva array._
* hsva.toHSLA() _- Converts the object to a hsla array._
* hsva.toRGBA() _- Converts the object to a rgba array._
* hsva.toHEX() _- Converts the object to a hexa-decimal array._
* hsva.toCMYK() _- Converts the object to a cymk array._
* hsva.clone() _- Clones the color object._

The `toString()` is overridden so you can get a color representaion string.

```javascript
hsva.toRGBA(); // Returns [r, g, b, a]
hsva.toRGBA().toString(); // Returns rgba(r, g, b, a)
```

## Methods
* pickr.setHSVA(h`:Number`,s`:Number`,v`:Number`,a`:Float`, silent`:Boolean`) _- Set an color, returns true if the color has been accepted._
* pickr.setColor(string`:String`, silent`:Boolean`) _- Parses a string which represents a color (e.g. `#fff`, `rgb(10, 156, 23)`), returns true if the color has been accepted. `null` will clear the color._

If `silent` is true (Default is false), the button won't change the current color.

* pickr.show() _- Shows the color-picker, returns instance._
* pickr.hide() _- Hides the color-picker, returns instance._
* pickr.disable() _- Disables pickr and adds the `disabled` class to the button, returns instance._
* pickr.enable() _- Enables pickr and removes the `disabled` class from the button, returns instance._
* pickr.isOpen() _- Returns true if the color picker is currently open._
* pickr.getRoot()`:HTMLElement` _- Returns the root DOM-Element of the color-picker._
* pickr.getColor()`:HSVaColor` _- Returns the current HSVaColor object._
* pickr.destroy()`:HSVaColor` _- Destroy's all functionality._
* pickr.destroyAndRemove()`:HSVaColor` _- Destroy's all functionality and removes the pickr element including the button._
* pickr.setColorRepresentation(type`:String`) _- Change the current color-representation. Valid options are `HEX`, `RGBA`, `HSVA`, `HSLA` and `CMYK`, returns false if type was invalid._
* pickr.applyColor(silent`:Boolean`) _- Same as pressing the save button. If silent is true the `onSave` event won't be called._

## Static methods
**Pickr**
* Pickr.create(options`:Object`)`:Pickr` _- Creates a new instance._

**Pickr.utils**
* once(element`:HTMLElement`, event`:String`, fn`:Function`[, options `:Object`]) _- Attach an event handle which will be fired only once_
* on(elements`:HTMLElement(s)`, events`:String(s)`, fn`:Function`[, options `:Object`]) _- Attach an event handler function._
* off(elements`:HTMLElement(s)`, event`:String(s)`, fn`:Function`[, options `:Object`]) _- Remove an event handler._
* createElementFromString(html`:String`)`:HTMLElement` _- Creates an new HTML Element out of this string._
* eventPath(evt`:Event`)`:[HTMLElement]` _- A polyfill for the event-path event propery._
* removeAttribute(el`:HTMLElement`, name`:String`) _- Removes an attribute from a HTMLElement and returns the value._
* createFromTemplate(str`:String`) _- See [inline doumentation](https://github.com/Simonwep/pickr/blob/master/src/js/lib/utils.js#L88)_
* adjustableInputNumbers(el`:InputElement`, negative`:boolean`) _- Creates the possibility to change the numbers in an inputfield via mouse scrolling._

Use this utils carefully, it's not for sure that they will stay forever!

## Contributing
If you want to open a issue, create a Pull Request or simply want to know how you can run it on your local machine, please read the [Contributing guide](https://github.com/Simonwep/pickr/blob/master/.github/CONTRIBUTING.md).
