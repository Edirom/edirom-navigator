# Edirom Navigator

Hierarchical navigation menu for browsing Edirom editions: collapsible categories, desktop/mobile layouts, optional tabs, and a configurable empty state.

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
| `active-tab` | string | Id of the tab to show. Falls back to the first tab if missing or unknown. Updated when a user clicks a tab. |
| `layout-mode` | `"desktop"` \| `"mobile"` | Layout style. Desktop: indented list. Mobile: centered items with icons below labels. Default: `"desktop"` |
| `no-content-message` | string | Message shown in every panel whose `navigatorDefinition` is empty. If omitted, the panel stays empty. |

## Events

| Event | Detail | When |
|---|---|---|
| `load-links-request` | `string` | A `navigatorItem` was clicked. Detail is the item's `targets` value. |

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
- The tab bar is a desktop feature. In `mobile` layout it is hidden, and the host picks the visible tab via `active-tab`.
- `active-tab` is sticky: it survives re-setting `navigator-data`, and a tab that disappears and comes back becomes active again.
- Switching tabs keeps fold state, and a tab whose definition did not change is not re-rendered when another tab's data changes.
- Ids only need to be unique within a tab.

## Examples

**Adding a tab and switching to it:**

```javascript
const nav = document.querySelector("edirom-navigator");
nav.setAttribute("navigator-data", JSON.stringify([main, concordance]));
nav.setAttribute("active-tab", "concordance");

// Remove the tab again; the component falls back to the first tab
nav.setAttribute("navigator-data", JSON.stringify([main]));
```

## Styling

Themed via CSS custom properties, overridable on the element or any ancestor. Both layouts use the same properties:

| Custom property | Default | Description |
|---|---|---|
| `--primary-color` | `currentcolor` | Text color: active tab, and the items in `mobile` layout |
| `--secondary-color` | `#cacaca` | Tab bar underline in `desktop` layout; item background in `mobile` layout |

```css
edirom-navigator {
  --primary-color: #232a44;
  --secondary-color: #e9d9af;
}
```

## Dependencies

- **[`edirom-icon`](https://github.com/Edirom/edirom-core-web-components)** — for collapsible carets (`arrow_right`, `arrow_drop_down`) and item icons in mobile mode. Must be registered in the host environment.
