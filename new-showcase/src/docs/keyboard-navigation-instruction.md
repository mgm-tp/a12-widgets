## Overview

This document is a concise integration guide for developers and showcase maintainers explaining how to enable and configure the Keyboard Navigation feature in applications using the Widgets.

The keyboard navigation mode controls how focus moves within a component:

- **`"default"`**: Both Tab and arrow keys navigate within a component.
- **`"arrow-only"`**: Only arrow keys navigate within a component; Tab moves focus to the next component outside.

## Configuration Priority

The keyboard navigation configuration follows a priority hierarchy (highest to lowest):

1. **Provider Component Config** - A local `KeyboardNavigationConfigProvider` wrapped around a subtree (used for single-component overrides)
2. **Component-specific configuration** - `componentConfigs` supplied to the global provider (per component type)
3. **Global Setting** - Application-wide `mode` flag on the provider

## Configuration Methods

### Method 1: Global Configuration

Set the keyboard navigation mode globally for your entire application by wrapping your root component with `KeyboardNavigationConfigProvider`:

```tsx
import { KeyboardNavigationConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core";

function App() {
	return (
		<KeyboardNavigationConfigProvider mode="arrow-only">{/* Your application */}</KeyboardNavigationConfigProvider>
	);
}
```

The default mode is `"default"` when no provider is present.

---

### Method 2: Component-Type Specific Configuration (`componentConfigs`)

Control keyboard navigation for specific component types using the `componentConfigs` property on `KeyboardNavigationConfigProvider`.
Each key may be either a mode string shorthand (`"default"` or `"arrow-only"`) or a config object with the `mode` key:

- `mode?: "default" | "arrow-only"`

Example:

```tsx
<KeyboardNavigationConfigProvider
	mode="arrow-only"
	componentConfigs={{
		popUpMenu: "default", // override pop-up menu back to default
		tree: "arrow-only", // shorthand string
		horizontalFlyoutMenu: { mode: "arrow-only" }, // detailed config object for horizontal flyout
		verticalFlyoutMenu: "arrow-only", // shorthand for vertical flyout
		slidingMenu: { mode: "default" }
	}}
>
	{/* Your application */}
</KeyboardNavigationConfigProvider>
```

---

### Method 3: Local/Per-instance Override

To override the configuration for a specific subtree or a single component instance, place a local `KeyboardNavigationConfigProvider` around it with the desired setting. This provider merges with the outer context:

```tsx
// Inside a global mode="arrow-only" context:
// Override a single tree instance back to default tab navigation
<KeyboardNavigationConfigProvider mode="default">
	<Tree /* ... */ />
</KeyboardNavigationConfigProvider>

// Or set arrow-only for a specific flyout menu while the global mode is "default":
<KeyboardNavigationConfigProvider componentConfigs={{ horizontalFlyoutMenu: "arrow-only" }}>
	<FlyoutMenu /* ... */ />
</KeyboardNavigationConfigProvider>
```

---

## Supported Config Keys

Use the following keys with `componentConfigs` to configure keyboard navigation for specific widget types:

| Config Key             | Showcase                                                                   |
| ---------------------- | -------------------------------------------------------------------------- |
| `popUpMenu`            | [Popup Menu](#/widgets/general/popup-menu)                                 |
| `buttonGroupContainer` | [Button Group Container](#/widgets/general/buttons/button-group-container) |
| `quickAccessButton`    | [Quick Access Button](#/widgets/general/buttons/quick-access-button)       |
| `horizontalFlyoutMenu` | [Flyout Menu](#/widgets/navigation/menu/flyout-menu)                       |
| `verticalFlyoutMenu`   | [Vertical Flyout Menu](#/widgets/navigation/menu/flyout-menu)              |
| `slidingMenu`          | [Sliding Menu](#/widgets/navigation/menu/sliding-menu)                     |
| `fileUpload`           | [File Upload](#/widgets/data-entry/file-upload)                            |
| `richTextEditor`       | [Rich Text Editor](#/widgets/data-entry/rich-text-editor)                  |
| `tree`                 | [Tree](#/widgets/data-display/tree)                                        |
| `comment`              | [Comment](#/widgets/business-case/comment/comment-template)                |
| `validationBar`        | [Validation Bar](#/widgets/business-case/validation-bar)                   |
| `typography`           | [Typography](#/widgets/utils/typography)                                   |
| `tabPanelSubTablist`   | [Tab Panel](#/widgets/navigation/tab-panel)                                |
