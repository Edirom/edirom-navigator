# WCAG check: edirom-navigator

Manual sample against WCAG 2.2 after the keyboard and focus additions.

| Check | Result |
|---|---|
| 4.1.2 Name and role | Tabs keep `aria-selected`. Items and nested categories are `role="button"`. Nested categories expose `aria-expanded`. |
| 2.1.1 Keyboard | Tabs: ArrowLeft, ArrowRight, Home, End. Items and categories: Enter and Space. |
| 2.4.7 Focus visible | `:focus-visible` outline using `--edirom-color-focus`. |
| 1.4.4 Resize | The list is normal document flow inside the host. The host page must give it a width that wraps. |
| 2.5.1 Pointer gestures | Swipe only switches tabs. Click and keys do the same. |

Icons inside items still depend on `edirom-icon` when that element is defined. Without it, the item name remains text.
