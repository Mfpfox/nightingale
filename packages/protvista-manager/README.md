# protvista-manager

[![Published on NPM](https://img.shields.io/npm/v/protvista-manager.svg)](https://www.npmjs.com/package/protvista-manager)

It is a container for all the tracks and other inner components (e.g. protvista-navigation).

This component is in charge of capturing the events that its protvista descendent trigger, and adjust element attributes accordingly.

A protvista descendent is any element in its subtree which tag name starts with 'protvista'.

The children should fire events of the type change, and the detail object should contain the attributes `type` and `value`.

Additionally, there are a set of pre-defined attributes which can be used with this component and will be propagated to descendents: `displaystart`, `displayend`, `highlight` and `end`. This is useful if you want to control things like zoom level from outside, for instance directly from your application.

See it running [Here](https://ebi-webcomponents.github.io/protvista-manager/index.html).

## Usage

```html
<protvista-manager attributes="attr1 attr2"></protvista-manager>
```

Here is an example of how the child components should fire the events:

```javascript
this.dispatchEvent(
  new CustomEvent("change", {
    detail: {
      value: "New value",
      type: "attr1",
    },
  })
);
```

## API Reference

### Properties

### Attributes

#### `attributes: string`

#### `displaystart?: number`

#### `displayend?: number`

#### `highlight?: start:end,start:end,...`

#### `length?: start:end,start:end,...`

List of attributes that this component will be propagating.
