# nightingale-filter

[![Published on NPM](https://img.shields.io/npm/v/nightingale-filter.svg)](https://www.npmjs.com/package/nightingale-filter)

A custom element to filter data

## Usage

```html
<nightingale-filter for="filtered-component-id"></nightingale-filter>
```

## API Reference

## Properties

#### `filters`: `Array`

The filter configuration

```js
[
  {
    name: "filter_name",
    type: {
      name: "group_name",
      text: "Group Label",
    },
    options: {
      labels: ["Filter option label"],
      colors: ["#333"], // Array so you can specify colour ranges
    },
    filterData: (item) => {}, // the filter function
  },
];
```

### Events

When an option is selected, a `change` event is emitted, with type `activefilters`. It contains an array of the selected filters, which contains callback function to apply to the data.
