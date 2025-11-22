# React Image Annotate

[![npm version](https://img.shields.io/npm/v/@idapgroup/react-image-annotate.svg)](https://www.npmjs.com/package/@idapgroup/react-image-annotate)

Fork of react-image-annotate - The best image/video annotation tool
ever. [Check out the demo here](https://universaldatatool.github.io/react-image-annotate/). Or
the [code sandbox here](https://codesandbox.io/s/react-image-annotate-example-38tsc?file=/src/App.js:0-403).

Implemented features in fork:

- added typescript (idapgroup)
- updated react to v.19
- make dependency set leaner
- make trackpad scrolling smoother
- remember last used tags
- support dark mode

## Features

- Simple input/output format
- Bounding Box, Point and Polygon Annotation
- Zooming, Scaling, Panning
- Multiple Images
- Cursor Crosshair

![Screenshot of Annotator](./.github/images/ui-dark-mode.webp#gh-dark-mode-only)
![Screenshot of Annotator](./.github/images/ui-light-mode.webp#gh-light-mode-only)

## Usage

Use it as a workspace in your project, e.g. `packages/react-image-annotate`. Then add it to the `package.json`.

For usage, see an example in `src/index.tsx`.

To get the proper fonts, make sure to import the Inter UI or Roboto font, the following line added to a css file should suffice.

```css
@import url("https://rsms.me/inter/inter.css");
```

## Props

All of the following properties can be defined on the Annotator...

| Prop                       | Type (\* = required)                                    | Description                                                                                                                                                   | Default       |
|----------------------------|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `taskDescription`          | \*`string`                                              | Markdown description for what to do in the image.                                                                                                             |               |
| `allowedArea`              | `{ x: number, y: number, w: number, h: number }`        | Area that is available for annotation.                                                                                                                        | Entire image. |
| `regionTagList`            | `Array<string>`                                         | Allowed "tags" (mutually inclusive classifications) for regions.                                                                                              |               |
| `regionClsList`            | `Array<string>`                                         | Allowed "classes" (mutually exclusive classifications) for regions.                                                                                           |               |
| `regionTagSingleSelection` | `boolean`                                               | Allowed select only one tag for image.                                                                                                                        |               |
| `regionAllowedActions`     | `{remove?:boolean, lock?:boolean, visibility?: boolean` | Allowed actions for region in regions list.                                                                                                                   | Everything.   |
| `imageTagList`             | `Array<string>`                                         | Allowed tags for entire image.                                                                                                                                |               |
| `imageClsList`             | `Array<string>`                                         | Allowed classes for entire image.                                                                                                                             |               |
| `enabledTools`             | `Array<string>`                                         | Tools allowed to be used. e.g. "select", "create-point", "create-box", "create-polygon"                                                                       | Everything.   |
| `showTags`                 | `boolean`                                               | Show tags and allow tags on regions.                                                                                                                          | `true`        |
| `selectedImage`            | `string`                                                | URL of initially selected image.                                                                                                                              |               |
| `images`                   | `Array<Image>`                                          | Array of images to load into annotator                                                                                                                        |               |
| `showPointDistances`       | `boolean`                                               | Show distances between points.                                                                                                                                | `false`       |
| `pointDistancePrecision`   | `number`                                                | Precision on displayed points (e.g. 3 => 0.123)                                                                                                               |               |
| `onExit`                   | `MainLayoutState => any`                                | Called when "Save" is called.                                                                                                                                 |               |
| `RegionEditLabel`          | `Node`                                                  | React Node overriding the form to update the region (see [`RegionLabel`](https://github.com/waoai/react-image-annotate/blob/master/src/RegionLabel/index.js)) |               |
| `allowComments`            | `boolean`                                               | Show a textarea to add comments on each annotation.                                                                                                           | `false`       |
| `hidePrev`                 | `boolean`                                               | Hide `Previous Image` button from the header bar.                                                                                                             | `false`       |
| `hideNext`                 | `boolean`                                               | Hide `Next Image` button from the header bar.                                                                                                                 | `false`       |
| `hideClone`                | `boolean`                                               | Hide `Clone` button from the header bar.                                                                                                                      | `false`       |
| `hideSettings`             | `boolean`                                               | Hide `Settings` button from the header bar.                                                                                                                   | `false`       |
| `hideFullScreen`           | `boolean`                                               | Hide `FullScreen/Window` button from the header bar.                                                                                                          | `false`       |
| `hideSave`                 | `boolean`                                               | Hide `Save` button from the header bar.                                                                                                                       | `false`       |

## Developers

### Development

To begin developing run the following commands in the cloned repo.

1. `bun i`
2. `bunx --bun vite`

Click the link in the console to get the demo page.

### Icons

Consult these icon repositories:

- [Material Icons](https://material.io/tools/icons/)
- [Font Awesome Icons](https://fontawesome.com/icons?d=gallery&m=free)
