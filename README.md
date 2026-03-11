# Edirom Navigator Web Component

## Overview

The `edirom-navigator` is a Web Component used within the Edirom system to provide a hierarchical navigation menu. It is designed to display categories and items (links) that allow users to navigate through different parts of an Edirom edition, such as scores, critical reports, or other documents.

It supports two layout modes: `desktop` and `mobile`, adjusting its visual representation and behavior (e.g., collapsible categories) based on the context.

## Features

- **Hierarchical Navigation**: Supports nesting of categories and items up to 5 levels deep.
- **Collapsible Categories**: Nested categories can be toggled to show or hide their contents.
- **Responsive Design**: Includes specific styles for `desktop` and `mobile` layouts.
- **Event-Driven**: Dispatches custom events when a navigation item is clicked, allowing for decoupled integration with the rest of the Edirom application.
- **Empty-State Message**: Displays a configurable message when no navigation data is available.

## Endpoints (Attributes and Properties)

The component can be controlled via the following HTML attributes and corresponding JavaScript properties:

### `navigator-data` (Attribute / Property)

This is the primary way to provide data to the navigator. It expects a JSON string (as an attribute) or a JavaScript object (as a property) containing the navigation structure.

**Expected Value Template:**

```json
{
  "navigatorDefinition": [
    {
      "id": "category-1",
      "name": "Metadata",
      "type": "navigatorCategory",
      "items": [
        {
          "id": "item-1-1",
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
      "items": [
        {
          "id": "category-2-1",
          "name": "Act I",
          "type": "navigatorCategory",
          "items": [ ... ]
        }
      ]
    }
  ]
}
```

- `type`: Either `navigatorCategory` or `navigatorItem`.
- `targets`: A string defining the target of the link, e.g., `xmldb:exist:///db/apps/edirom/edition-example/content/sources/edirom.xml[width=100, sort='sortHorizontally']`.
- `icons` *(optional, `navigatorItem` only)*: An array of icon name strings (resolved via `edirom-icon`). Rendered below the item label in `mobile` mode only.

### `layout-mode` (Attribute / Property)

Controls the layout and styling of the component.

**Possible Values:**

- `desktop` (default): Standard list view with specific indentation for nested levels.
- `mobile`: A touch-friendly layout with centered items and icons rendered below the item label.

---

### `no-content-message` (Attribute / Property)

An optional message to display when `navigatorDefinition` is empty or not provided. The text is shown centered (vertically and horizontally) inside the navigator container.

If this attribute is absent or set to an empty string, the container remains empty with no message.

**Example:**

```html
<edirom-navigator
  layout-mode="desktop"
  no-content-message="No entries available."
>
</edirom-navigator>
```

---

## Events

### `load-links-request`

Dispatched when a `navigatorItem` is clicked.

**Event Detail:**

```javascript
"string"  // The target string from the item's 'targets' field
```

**Example:**

```javascript
document
  .querySelector("edirom-navigator")
  .addEventListener("load-links-request", (e) => {
    console.log("Navigate to:", e.detail);
  });
```

---

## Dependencies

### `edirom-icon`

The `edirom-navigator` has a direct dependency on the `edirom-icon` Web Component from the [Edirom Core Web Components](https://github.com/Edirom/edirom-core-web-components). It uses `edirom-icon` to:

1. Display **collapsible carets** (`arrow_right` and `arrow_drop_down`) for nested categories.
2. Display **item icons** in mobile mode, rendered from the `icons` array field of each `navigatorItem`.

Ensure that the `edirom-icon` component is registered and available in your environment for the navigator to render correctly.

## Usage Example

```html
<edirom-navigator
  layout-mode="desktop"
  navigator-data='{"navigatorDefinition": [...]}'
  no-content-message="No entries available."
>
</edirom-navigator>

<script>
  document
    .querySelector("edirom-navigator")
    .addEventListener("load-links-request", (e) => {
      console.log("Navigate to:", e.detail);
    });
</script>
```
