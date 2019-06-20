<h1 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/57573928-1e78db80-7430-11e9-940c-aecbf3226b7c.png" alt="Logo">
</h1>

<h3 align="center">
    Flat, Simple, Hackable Color-Picker.
</h3>

<p align="center">
  <img alt="gzip size" src="https://img.badgesize.io/https://raw.githubusercontent.com/Simonwep/pickr/master/dist/pickr.min.js?compression=gzip&style=flat-square">
  <img alt="brotli size" src="https://img.badgesize.io/https://raw.githubusercontent.com/Simonwep/pickr/master/dist/pickr.min.js?compression=brotli&style=flat-square">
  <a href="https://travis-ci.org/Simonwep/pickr"><img
     alt="Build Status"
     src="https://img.shields.io/travis/Simonwep/pickr.svg?style=popout-square"></a>
  <a href="https://www.npmjs.com/package/@simonwep/pickr"><img
     alt="Download count"
     src="https://img.shields.io/npm/dm/@simonwep/pickr.svg?style=popout-square"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg?style=popout-square">
  <a href="https://www.jsdelivr.com/package/npm/@simonwep/pickr"><img
     alt="JSDelivr download count"
     src="https://data.jsdelivr.com/v1/package/npm/@simonwep/pickr/badge"></a>
  <img alt="Current version"
       src="https://img.shields.io/badge/version-1.0.1-f1c40f.svg?style=popout-square">
  <a href="https://www.patreon.com/simonwep"><img
     alt="Support me"
     src="https://img.shields.io/badge/patreon-support-f1c40f.svg?style=popout-square"></a>
</p>

<br>

<h3 align="center">
  <img alt="Demo" src="https://user-images.githubusercontent.com/30767528/53578134-4e297e80-3b77-11e9-9d74-4d2ed547c274.gif"/>
</h3>

<h4 align="center">
  <a href="https://simonwep.github.io/pickr/">Fully Featured demo</a>
</h4>

<br>

### Features
* Themes
* Simple usage
* Zero dependencies
* Multiple color representations
* Color comparison
* Opacity control
* Detail adjustments via. mouse-wheel
* Responsive and auto-positioning
* Supports touch devices
* Swatches for quick-selection
* [Shadow-dom support](#selection-through-a-shadow-dom)

### Themes
|Classic|Monolith|Nano|
|-------|--------|----|
|![Classic theme](https://user-images.githubusercontent.com/30767528/59562615-01d35300-902f-11e9-9f07-44c9d16dbb99.png)|![Monolith](https://user-images.githubusercontent.com/30767528/59562603-c9cc1000-902e-11e9-9c84-1a606fa5f206.png)|![Nano](https://user-images.githubusercontent.com/30767528/59562578-8ec9dc80-902e-11e9-9882-2dacad5e6fa5.png)|

> Nano uses css-grid thus it won't work in older browsers.

## Getting Started
### Node
Note: The readme is always up-to-date with the latest commit. See [Releases](https://github.com/Simonwep/pickr/releases) for installation instructions regarding to the latest version.

Install via npm:
```shell
$ npm install @simonwep/pickr
```

Install via yarn:
```shell
$ yarn add @simonwep/pickr
```

Include code and style:
```js

// One of the following themes
import '/node_modules/@simonwep/pickr/dist/pickr.min.css';           // 'classic' theme
import '/node_modules/@simonwep/pickr/dist/pickr.monolith.min.css';  // 'monolith' theme
import '/node_modules/@simonwep/pickr/dist/pickr.nano.min.css';      // 'nano' theme

// Modern or es5 bundle
import Pickr from '/node_modules/@simonwep/pickr/dist/pickr.min';      
import Pickr from '/node_modules/@simonwep/pickr/dist/pickr.es5.min'; 
```
---
### Browser

jsdelivr:
```html

<!-- One of the following themes -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.css"/> <!-- 'classic' theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.monolith.min.css"/> <!-- 'monolith' theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.nano.min.css"/> <!-- 'nano' theme -->

<!-- Modern or es5 bundle -->
<script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.es5.min.js"></script>
```

Be sure to load the `pickr.min.js` (or the es5 version) **after** `pickr.min.css`. Moreover the `script` tag doesn't work with the `defer` attribute.

## Usage
```javascript
// Simple example, see optional options for more configuration.
const pickr = Pickr.create({
    el: '.color-picker',
    
    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],

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

## Events
Since version `0.4.x` Pickr is event-driven. Use the `on(event, cb)` and `off(event, cb)` functions to bind / unbind eventlistener.

| Event      | Description | Arguments |
| -------------- | ----------- | --------- |
| `init`         | Initialization done - pickr can be used | `PickrInstance` |
| `save`         | User clicked the save / clear button | `HSVaColorObject \| null, PickrInstance` |
| `change`       | Color has changed (but not saved). Also fired on `swatchselect` | `HSVaColorObject, PickrInstance` |
| `swatchselect` | User clicked one of the swatches | `HSVaColorObject, PickrInstance` |

> Example:
```js
pickr.on('init', instance => {
    console.log('init', instance);
}).on('save', (color, instance) => {
    console.log('save', color, instance);
}).on('change', (color, instance) => {
    console.log('change', color, instance);
}).on('swatchselect', (color, instance) => {
    console.log('swatchselect', color, instance);
});
```

## Options
```javascript
const pickr = new Pickr({

    // Selector or element which will be replaced with the actual color-picker.
    // Can be a HTMLElement.
    el: '.color-picker',
    
    // Which theme you want to use. Can be 'classic', 'monolith' or 'nano'
    theme: 'classic',
    
    // Nested scrolling is currently not supported and as this would be really sophisticated to add this 
    // it's easier to set this to true which will hide pickr if the user scrolls the area behind it.
    closeOnScroll: false,

    // Custom class wich gets added to the pickr-app. Can be used to apply custom styles.
    appClass: 'custom-class',

    // Using the 'el' Element as button, won't replace it with the pickr-button.
    // If true, appendToBody will also be automatically true.
    useAsButton: false,
    
    // If true pickr won't be fixed and instead append after the in el resolved element.
    // Setting this to true will also set showAlways to true. It's possible to hide it via .hide() anyway.
    inline: false,
    
    // Defines the direction in which the knobs of hue and opacity can be moved.
    // 'v' => opacity- and hue-slider can both only moved vertically.
    // 'hv' => opacity-slider can be moved horizontally and hue-slider vertically.
    // Can be used to apply custom layouts
    sliders: 'v',

    // Start state. If true 'disabled' will be added to the button's classlist.
    disabled: false,

    // If set to false it would directly apply the selected color on the button and preview.
    comparison: true,
    
    // Default color
    default: 'fff',
    
    // Optional color swatches. null by default which means it's disabled.
    // Types are all these allowed which can be used in pickr e.g. hex, hsv(a), hsl(a), rgb(a), cmyk or a name like 'magenta'
    swatches: ['#F44336', '#E91E63', '#9C27B0', '#673AB7'],

    // Default color representation.
    // Valid options are `HEX`, `RGBA`, `HSVA`, `HSLA` and `CMYK`.
    defaultRepresentation: 'HEX',

    // Option to keep the color picker always visible. You can still hide / show it via
    // 'pickr.hide()' and 'pickr.show()'. The save button keeps his functionality, so if
    // you click it, it will fire the onSave event.
    showAlways: false,

    // Close pickr with this specific key.
    // Default is 'Escape'. Can be the event key or code.
    closeWithKey: 'Escape',

    // Defines the position of the color-picker. 
    // Any combinations of top, left, bottom or right with one of these optional modifiers: start, middle, end
    // Examples: top-start / right-end
    // If clipping occurs, the color picker will automatically choose its position.
    position: 'bottom-middle',

    // Enables the ability to change numbers in an input field with the scroll-wheel.
    // To use it set the cursor on a position where a number is and scroll, use ctrl to make steps of five
    adjustableNumbers: true,

    // Show or hide specific components.
    // By default only the palette (and the save button) is visible.
    components: {

        // Defines if the palette itself should be visible.
        // Will be overwritten with true if preview, opacity or hue are true
        palette: true,

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
            clear: true, // Clear button
            save: true,  // Save button,
            cancel: true, // Cancel button, reset's the color to the previous state
        },
    },

    // Button strings, brings the possibility to use a language other than English.
    strings: {
       save: 'Save',  // Default for save button
       clear: 'Clear', // Default for clear button
       cancel: 'Cancel' // Default for cancel button
    }
});
```

## Selection through a Shadow-DOM
Example setup:
```html
<div class="entry">
  #shadow-root 
    <div class="innr">
       <div class="another">
         #shadow-root 
           <div class="pickr"></div>
       </div>
    </div>
</div>
```

To select the `.pickr` element you can use the custom `>>` shadow-dom-selector in `el`:
```js
el: '.entry >> .innr .another >> .pickr'
```

Every `ShadowRoot` of the query-result behind a `>>` gets used in the next query selection.
An alternative would be to provide the target-element itself as `el`.

## The HSVaColor object
As default color representation is hsva (`hue`, `saturation`, `value` and `alpha`) used, but you can also convert it to other formats as listed below.

* hsva.toHSVA() _- Converts the object to a hsva array._
* hsva.toHSLA() _- Converts the object to a hsla array._
* hsva.toRGBA() _- Converts the object to a rgba array._
* hsva.toHEXA() _- Converts the object to a hexa-decimal array._
* hsva.toCMYK() _- Converts the object to a cymk array._
* hsva.clone() _- Clones the color object._

The `toString()` is overridden so you can get a color representaion string.

```javascript
hsva.toRGBA(); // Returns [r, g, b, a]
hsva.toRGBA().toString(); // Returns rgba(r, g, b, a)
```

## Methods
* pickr.setHSVA(h`:Number`,s`:Number`,v`:Number`,a`:Float`, silent`:Boolean`) _- Set an color, returns true if the color has been accepted._
* pickr.setColor(representation`:String`, silent`:Boolean`)`:Boolean` _- Parses a string which represents a color (e.g. `#fff`, `rgb(10, 156, 23)`) or name e.g. 'magenta', returns true if the color has been accepted. `null` will clear the color._

If `silent` is true (Default is false), the button won't change the current color.

* pickr.on(event`:String`, cb`:Function`) _- Appends an eventlistener to the given corresponding event-name (see section Events), returns the pickr instance so it can be chained._
* pickr.off(event`:String`, cb`:Function`) _- Removes an eventlistener from the given corresponding event-name (see section Events), returns the pickr instance so it can be chained._
* pickr.show() _- Shows the color-picker, returns instance._
* pickr.hide() _- Hides the color-picker, returns instance._
* pickr.disable() _- Disables pickr and adds the `disabled` class to the button, returns instance._
* pickr.enable() _- Enables pickr and removes the `disabled` class from the button, returns instance._
* pickr.isOpen() _- Returns true if the color picker is currently open._
* pickr.getRoot()`:HTMLElement` _- Returns the root DOM-Element of the color-picker._
* pickr.getColor()`:HSVaColor` _- Returns the current HSVaColor object._
* pickr.destroy()`:HSVaColor` _- Destroy's all functionality._
* pickr.destroyAndRemove()`:HSVaColor` _- Destroy's all functionality and removes the pickr element including the button._
* pickr.setColorRepresentation(type`:String`)`:Boolean` _- Change the current color-representation. Valid options are `HEX`, `RGBA`, `HSVA`, `HSLA` and `CMYK`, returns false if type was invalid._
* pickr.applyColor(silent`:Boolean`) _- Same as pressing the save button. If silent is true the `onSave` event won't be called._
* pickr.addSwatch(color`:String`)`:Boolean` _- Adds a color to the swatch palette. Returns `true` if the color has been successful added to the palette._
* pickr.removeSwatch(index`:Number`) _- Removes a color from the swatch palette by its index._

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
* createFromTemplate(str`:String`) _- See [inline doumentation](https://github.com/Simonwep/pickr/blob/master/src/js/lib/utils.js#L88)._
* adjustableInputNumbers(el`:InputElement`, mapper`:Function`) _- Creates the possibility to change the numbers in an inputfield via mouse scrolling.
The mapper function takes three arguments: the matched number, an multiplier and the index of the match._

Use this utils carefully, it's not for sure that they will stay forever!

## Contributing
If you want to open a issue, create a Pull Request or simply want to know how you can run it on your local machine, please read the [Contributing guide](https://github.com/Simonwep/pickr/blob/master/.github/CONTRIBUTING.md).
