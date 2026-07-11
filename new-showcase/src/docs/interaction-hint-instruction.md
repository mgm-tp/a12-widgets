## Overview

This document is a concise integration guide for developers and showcase maintainers explaining how to enable and configure the Interaction Hint feature in applications using the Widgets.

## Configuration Priority

The interaction hint configuration follows a priority hierarchy (highest to lowest):

1. **Provider Component Config** - A local `InteractionHintConfigProvider` wrapped around a subtree (used for single-component overrides)
2. **Component-specific configuration** - `componentConfigs` supplied to the global provider (per component type)
3. **Global Setting** - Application-wide `enableInteractionHint` flag on the provider

## Configuration Methods

### Method 1: Global Configuration

Enable interaction hints globally for your entire application by wrapping your root component with `InteractionHintConfigProvider`:

```tsx
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

function App() {
	return (
		<InteractionHintConfigProvider enableInteractionHint={true}>{/* Your application */}</InteractionHintConfigProvider>
	);
}
```

By default the provider also exposes `followCursor` and `hideArrow` global options (both default to `false`).

---

### Method 2: Component-Type Specific Configuration (`componentConfigs`)

Control interaction hints for specific component types using the `componentConfigs` property on `InteractionHintConfigProvider`.
Each key may be either a boolean shorthand (enabled/disabled) or a detailed config object with these keys:

- `enabled?: boolean`
- `followCursor?: boolean`
- `hideArrow?: boolean`
- `position?: "left" | "right"` (only used for vertical/list-based components)

Example:

```tsx
<InteractionHintConfigProvider
	componentConfigs={{
		button: false, // disable hints for buttons
		link: false,
		iconButton: true, // enable hints for icon buttons
		accordion: { enabled: true, position: "left" }, // detailed config for vertical/list components
		counter: { enabled: true, followCursor: true }
	}}
>
	{/* Your application */}
</InteractionHintConfigProvider>
```

---

### Method 3: Local/Per-instance Override

There is no single `enableInteractionHint` prop on every component instance. To override the configuration for a specific subtree or a single component instance, place a local `InteractionHintConfigProvider` around it with the desired setting. This provider merges with the global/default context, so you can change one key for a small subtree:

```tsx
// Inside a global enableInteractionHint={true} context:
// Disable hints for a single button while keeping hints enabled elsewhere in the subtree
<InteractionHintConfigProvider enableInteractionHint={true} componentConfigs={{ button: false }}>
	<Button label="No Hint Needed" />
</InteractionHintConfigProvider>

// Or enable followCursor for a specific accordion instance:
<InteractionHintConfigProvider enableInteractionHint={true} componentConfigs={{ accordion: { enabled: true, followCursor: true } }}>
	<Accordion /* ... */ />
</InteractionHintConfigProvider>
```

---

## Supported Config Keys

Use the following keys with `componentConfigs` to configure interaction hints for specific widget types:

| Config Key             | Showcase                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `button`               | [Button](#/widgets/general/buttons/button)                                                  |
| `iconButton`           | [Icon Button](#/widgets/general/buttons/button#icon-buttons)                                |
| `link`                 | [Link](#/widgets/general/link)                                                              |
| `toggle`               | [Toggle](#/widgets/general/buttons/toggle-button)                                           |
| `tabPanel`             | [Tab Panel](#/widgets/navigation/tab-panel)                                                 |
| `accordion`            | [Accordion](#/widgets/navigation/accordion)                                                 |
| `wizard`               | [Wizard](#/widgets/navigation/wizard)                                                       |
| `horizontalFlyoutMenu` | [Flyout Menu](#/widgets/navigation/menu/flyout-menu)                                        |
| `verticalFlyoutMenu`   | [Vertical Flyout Menu](#/widgets/navigation/menu/flyout-menu)                               |
| `slidingMenu`          | [Sliding Menu](#/widgets/navigation/menu/sliding-menu)                                      |
| `fileUpload`           | [File Upload](#/widgets/data-entry/file-upload)                                             |
| `filter`               | [Filter Bar](#/widgets/business-case/faceted-search/filter-selector#docked-filter-selector) |
| `counter`              | [Counter](#/widgets/data-display/counter)                                                   |
| `list`                 | [List](#/widgets/data-display/list)                                                         |
| `interactiveTile`      | [Interactive Tile](#/widgets/data-display/interactive-tile)                                 |
| `collapsiblePanel`     | [Collapsible Panel](#/widgets/layout/collapsible-panel)                                     |
