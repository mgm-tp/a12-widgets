`getBaseTheme()` builds an A12 theme from one set of tokens. It replaces `getFlatTheme` and `getFlatCompactTheme`, and its visual style matches the old flat theme. The `default` and `compact` themes (`getDefaultTheme` / `getCompactTheme`) are deprecated and will be removed in a future release with no replacement — their visual style is not carried forward.

## Three layers

Every token flows top-down through three layers. Overrides at a higher layer reach the layers below.

1. **Application layer** — base spacing unit, color palette, font family and size, border scale, motion durations, opacity scale, and input styles.
2. **Semantic layer** — named tokens such as `primaryInteractionColor`, `errorColor`, `navigationBackground`.
3. **Widget layer** — per-component configs that read from the semantic layer.

```text
Application Layer   (spacing, typography, palette, border, motion, opacity, baseInputStyles)
        ↓
Semantic Layer      (colors.interaction.primaryInteractionColor, ...)
        ↓
Widget Layer        (button.primary.backgroundColor, ...)
```

## Which option do I use?

The factory exposes one option per concern. Pick the one that matches the change you want to make.

| I want to change                   | Use option                                   |
| ---------------------------------- | -------------------------------------------- |
| One brand color across all widgets | `colors.interaction.primaryInteractionColor` |
| A full custom palette              | `colors` (full object)                       |
| Semantic tokens only, keep palette | `colors`                                     |
| One widget's look                  | `components.{name}`                          |
| Spacing density                    | `spacing.base`                               |
| Font family or sizes               | `typography.font` / `typography.fontSize`    |
| Border widths / radius             | `border`                                     |
| Animation style                    | `motion`                                     |
| Opacities                          | `opacity`                                    |
| Input box-shadow / line height     | `baseInputStyles`                            |

## Basic usage

Call the factory with no options.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = getBaseTheme();
```

## Color customization

Override semantic color tokens. Every widget that reads from those tokens picks up the new value.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = getBaseTheme({
	colors: {
		// Semantic layer — flows down to all widgets
		interaction: {
			primaryInteractionColor: "#005FAD"
		},
		background: {
			navigationBackground: "#F0F4FF"
		}
	}
});
```

## Font customization

Override the main font family used by all widgets.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = getBaseTheme({
	typography: {
		font: "Inter, sans-serif"
	}
});
```

## Spacing customization

Default base spacing is 12 px. Change the base spacing unit to scale all widget paddings and gaps, or override individual spacing tokens.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Change the base spacing unit. All widget paddings and gaps derive from this.
const theme = getBaseTheme({
	spacing: { base: 14 }
});

// Override individual spacing tokens only:
const theme = getBaseTheme({
	spacing: {
		spacing: { spacingSm: 6, spacingMd: 10 }
	}
});
```

## Per-component override

Deep-merge overrides into a specific component's config when a single widget needs a value that differs from the semantic token.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Deep-merged into the assembled component config
const theme = getBaseTheme({
	components: {
		button: {
			primary: { backgroundColor: "#005FAD" }
		}
	}
});
```

## New tokens

The base theme adds these keys on top of the previous `DefaultTheme` shape:

- `colors.shadow.{overlayFaint, overlaySoft, overlayMid, overlayDark, overlayDeep}`
- `colors.text.titleColor`, `colors.text.placeholderColor`
- `colors.background.{navigationBackground, navigationAccent, overlayLight}`
- `colors.divider.colorMuted`
- `colors.interaction.{color, colorDark, colorBG, colorBGLight, touchOverlay, touchOverlayDark}`
- `colors.interaction.hover.colorLight`
- `border`, `motion`, `opacity`, `hoverStyles`

You only need to add these to a `DefaultTheme` module augmentation if your own typed styled-components read them through the `theme` prop. To pick them all up at once, augment `DefaultTheme` with `BaseThemeConfig` — see the [migration notes](#/get-started/migration-instructions/migration-notes) for details.
