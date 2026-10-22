# Edirom Navigator

Hierarchical navigation menu for browsing Edirom editions: collapsible categories, desktop/mobile layouts, optional tabs (switchable by swiping in the mobile layout), and a configurable empty state.

## Usage

```html
<script defer src="path/to/edirom-navigator/navigator.js" type="module"></script>

<edirom-navigator
  layout-mode="desktop"
  navigator-data='{"navigatorDefinition": [...]}'
  no-content-message="No entries available."
></edirom-navigator>

<script>
  document.querySelector("edirom-navigator")
    .addEventListener("load-links-request", (e) => {
      console.log("Navigate to:", e.detail);
    });
</script>
```

## Attributes

| Attribute | Type | Description |
|---|---|---|
| `navigator-data` | JSON string | Navigation structure, or an array of them to get [tabs](#tabs). Attribute only, so set it with `setAttribute`. |
| `active-tab` | string | Id of the tab to show. Falls back to the first tab if missing or unknown. Updated when a user switches tabs. |
| `layout-mode` | `"desktop"` \| `"mobile"` | Layout style. Desktop: indented list, underlined tab bar. Mobile: centered items with icons below labels, segmented-control tab bar, swipe to switch tabs. Default: `"desktop"` |
| `no-content-message` | string | Message shown in every panel whose `navigatorDefinition` is empty. If omitted, the panel stays empty. |

## Events

| Event | Detail | When |
|---|---|---|
| `load-links-request` | `string` | A `navigatorItem` was clicked. Detail is the item's `targets` value. |
| `active-tab-changed` | `{ activeTab: string }` | The user switched [tabs](#tabs) (click, arrow keys, swipe). Detail is the id of the new tab. Not fired when the host sets `active-tab` itself. |

## Data Schema

Pass the navigation structure via the `navigator-data` attribute:

```json
{
  "navigatorDefinition": [
    {
      "id": "category-1",
      "name": "Metadata",
      "type": "navigatorCategory",
      "items": [
        {
          "id": "item-1",
          "name": "Title Page",
          "type": "navigatorItem",
          "targets": "score[page=1]",
          "icons": ["description"]
        }
      ]
    },
    {
      "id": "category-2",
      "name": "Music",
      "type": "navigatorCategory",
      "items": [ ... ]
    }
  ]
}
```

**Fields:**

- `type`: `"navigatorCategory"` or `"navigatorItem"`. Categories can nest up to 5 levels deep.
- `targets`: Navigation target URL (e.g. `xmldb:exist:///db/apps/edirom/.../file.xml[width=100]`). Items only.
- `icons`: Array of icon names (resolved via `edirom-icon`). Rendered below item label in mobile mode only. Items only.

## Tabs

The component does not care what a tab contains; the host decides. Pass an array of definitions instead of a single object, each with an `id`, a `name` (the tab label) and its own `navigatorDefinition`:

```json
[
  { "id": "main", "name": "Navigation", "navigatorDefinition": [ ... ] },
  { "id": "concordance", "name": "Konkordanz", "navigatorDefinition": [ ... ] }
]
```

- The tab bar appears whenever an array is passed, even with a single entry. A single object (the form without tabs) renders without a bar.
- Both layouts share the tab logic; they differ in looks. `desktop`: an underlined row of tabs. `mobile`: a segmented control that takes the full width, and the panel of a newly selected tab slides in from the side it lies on (unless the user prefers reduced motion).
- In `mobile` layout the tab bar stays in place while the panel below it scrolls, and a horizontal swipe on the panel switches to the next or previous tab (no wrap-around). Swipes are recognized for touch and pen input only, and the tab starts at its top.
- Listen to `active-tab-changed` to remember the tab the user picked, e.g. to show it again when the navigator is rebuilt.
- `active-tab` is sticky: it survives re-setting `navigator-data`, and a tab that disappears and comes back becomes active again.
- Switching tabs keeps fold state, and a tab whose definition did not change is not re-rendered when another tab's data changes.
- Ids only need to be unique within a tab.

## Examples

**Adding a tab and switching to it:**

```javascript
const nav = document.querySelector("edirom-navigator");
nav.setAttribute("navigator-data", JSON.stringify([main, concordance]));
nav.setAttribute("active-tab", "concordance");

// Hear about the tab the user switches to
nav.addEventListener("active-tab-changed", (e) => console.log(e.detail.activeTab));

// Remove the tab again; the component falls back to the first tab
nav.setAttribute("navigator-data", JSON.stringify([main]));
```

## Styling

Themed via CSS custom properties, overridable on the element or any ancestor. Both layouts use the same properties:

| Custom property | Default | Description |
|---|---|---|
| `--primary-color` | `currentcolor` | Text color: active tab in `desktop` layout; items and unselected tabs in `mobile` layout, where it is also the background of the active tab |
| `--secondary-color` | `#cacaca` | Tab bar underline in `desktop` layout; item and tab bar background in `mobile` layout, where it is also the text color of the active tab |

```css
edirom-navigator {
  --primary-color: #232a44;
  --secondary-color: #e9d9af;
}
```

## Dependencies

- **[`edirom-icon`](https://github.com/Edirom/edirom-core-web-components)** — for collapsible carets (`arrow_right`, `arrow_drop_down`) and item icons in mobile mode. Must be registered in the host environment.
