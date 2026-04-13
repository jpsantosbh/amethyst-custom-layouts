# Amethyst Custom Layouts

Development workspace for [Amethyst](https://github.com/ianyh/Amethyst) custom layouts (beta).

> Heads up: this dev box is Linux, but Amethyst itself only runs on macOS. Author layouts here, then sync `layouts/` to a Mac to test.

## Layout structure

```
.
├── layouts/      # Your custom layouts — each *.js file becomes one layout
├── examples/     # Reference layouts pulled from Amethyst's test suite
├── docs/         # Mirror of the official custom-layouts.md
└── Makefile      # install / link / lint helpers (run on macOS)
```

## Quick reference

A layout file exports a top-level `layout()` function that returns an object with:

| Property                 | Required | Purpose                                                          |
| ------------------------ | -------- | ---------------------------------------------------------------- |
| `name`                   | no       | Display name (defaults to the filename key)                      |
| `initialState`           | yes      | Starting state object                                            |
| `getFrameAssignments`    | yes\*    | `(windows, screenFrame, state, extendedFrames) => { id: frame }` |
| `commands`               | no       | `command1`–`command4`, `expandMain`, `shrinkMain`, `increaseMain`, `decreaseMain` |
| `extends`                | no       | Inherit from another layout key                                  |
| `updateWithChange`       | no       | `(change, state) => newState` — react to system events           |
| `recommendMainPaneRatio` | no       | `(ratio, state) => newState` — handle mouse-driven resizing      |

\* not required if `extends` is set and the parent's frames are reused.

### Frame shape

```js
{ x, y, width, height, isMain?, unconstrainedDimension? /* "horizontal" | "vertical" */ }
```

Coordinates are in **global** screen space, not screen-relative.

### Change types

`add`, `remove`, `focus_changed`, `window_swap`, `application_activate`,
`application_deactivate`, `space_change`, `layout_change`, `unknown`.

See `docs/custom-layouts.md` for the full spec.

## Authoring loop

1. Edit a file in `layouts/`. The filename minus `.js` is the layout key Amethyst uses.
2. Sanity-check syntax: `make lint` (needs `node`).
3. On macOS: `make install` (copy) or `make link` (symlink for live editing).
4. In Amethyst, switch to your layout (or toggle layouts) so it reloads. A full Amethyst restart picks up new files.

The Amethyst layouts directory is:

```
~/Library/Application Support/Amethyst/Layouts/
```

## Examples included

From [`AmethystTests/Model/CustomLayouts`](https://github.com/ianyh/Amethyst/tree/development/AmethystTests/Model/CustomLayouts):

| File                                | Demonstrates                                            |
| ----------------------------------- | ------------------------------------------------------- |
| `fullscreen.js`                     | Minimal layout — every window covers the full screen   |
| `null.js` / `undefined.js`          | Edge cases — returning empty/undefined frames           |
| `uniform-columns.js`                | Equal-width columns                                     |
| `static-ratio-tall.js`              | Tall layout with fixed 50/50 ratio + custom commands    |
| `static-ratio-tall-native-commands.js` | Same layout using `expandMain`/`shrinkMain` commands |
| `subset.js`                         | Layout that only assigns frames to a window subset      |
| `extended.js`                       | `extends` another layout and tweaks its frames          |
| `recommended-main-pane-ratio.js`    | Mouse-driven ratio adjustment                           |

## Starter

`layouts/my-layout.js` is a working tall layout with main-pane ratio commands and mouse-resize support — copy it as a starting point for new layouts.
