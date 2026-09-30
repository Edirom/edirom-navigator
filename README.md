# Edirom Navigator

Hierarchical navigation menu for browsing Edirom editions: supports collapsible categories, responsive desktop/mobile layouts, and custom empty/loading states.

## Usage

```html
<script defer src="path/to/edirom-navigator/edirom-navigator.js" type="module"></script>

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
| `navigator-data` | JSON string or object | Navigation structure (see below). Can be set as an HTML attribute (JSON string) or DOM property (object). |
| `layout-mode` | `"desktop"` \| `"mobile"` | Layout style. Desktop: indented list. Mobile: centered items with icons below labels. Default: `"desktop"` |
| `no-content-message` | string | Message to display when `navigatorDefinition` is empty. If omitted, container remains empty. |
| `is-loading` | boolean | Show loading spinner and text while data loads. Takes precedence over entries and `no-content-message`. |

## Events

| Event | Detail | When |
|---|---|---|
| `load-links-request` | `string` | A `navigatorItem` was clicked. Detail is the item's `targets` value. |

## Data Schema

Pass navigation structure via the `navigator-data` attribute or property:

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

## Examples

**Loading state:**

```javascript
const nav = document.querySelector("edirom-navigator");
nav.setAttribute("is-loading", "true");

// After fetch
nav.setAttribute("navigator-data", JSON.stringify(data));
nav.removeAttribute("is-loading");
```

## Dependencies

- **[`edirom-icon`](https://github.com/Edirom/edirom-core-web-components)** — for collapsible carets (`arrow_right`, `arrow_drop_down`) and item icons in mobile mode. Must be registered in the host environment.
