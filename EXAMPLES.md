### Requested features - immediately brought to life by a bit of code

#### Saving the current color and closing the popup on `Enter` ([#187](https://github.com/Simonwep/pickr/issues/187))

```js
pickr.on('init', instance => {

    // Grab actual input-element
    const {result} = instance.getRoot().interaction;

    // Listen to any key-events
    result.addEventListener('keydown', e => {

        // Detect whever the user pressed "Enter" on their keyboard
        if (e.key === 'Enter') {
            instance.applyColor(); // Save the currently selected color
            instance.hide(); // Hide modal
        }
    }, {capture: true});
});
```

> Feel free to submit a [PR](https://github.com/Simonwep/pickr/compare) or create
> an [issue](https://github.com/Simonwep/pickr/issues/new?assignees=Simonwep&labels=&template=feature_request.md&title=) if
> you got any ideas for more examples!
