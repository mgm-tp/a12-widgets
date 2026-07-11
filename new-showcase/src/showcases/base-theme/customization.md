`getBaseTheme()` accepts overrides at every layer. Changes at a higher layer reach the layers below.

## Standard spacing

Default base spacing is 12 px. Pass `spacing: { base: 16 }` for a less dense look. All widget paddings, gaps, and margins scale from this value.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Standard spacing — base unit 16px (default is 12px / compact)
const standardTheme = getBaseTheme({ spacing: { base: 16 } });
```

## Brand color override

Override the primary interaction color to match your brand. All interactive elements (buttons, links, selections) pick up the new color automatically.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Override brand/interaction color tokens
const brandTheme = getBaseTheme({
	colors: {
		interaction: {
			primaryInteractionColor: "#005FAD",
			secondaryInteractionColor: "#005FAD",
			color: "#005FAD",
			hover: { color: "#005FAD" },
			selected: { color: "#005FAD" }
		}
	}
});
```

## Semantic token override

The `colors` option deep-merges named semantic tokens before component configs are built. Use it for backgrounds, interaction tokens, and variant colors.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Override semantic color tokens through the color override API
const theme = getBaseTheme({
	colors: {
		background: {
			navigationBackground: "#f0f4ff",
			secondaryBackground: "#fafbfc"
		},
		variant: {
			errorColor: "#d32f2f",
			successColor: "#388e3c"
		}
	}
});
```

## Border customization

Override corner radius or border widths across all widgets. Tokens are defined in a named scale (`xs`, `sm`, `md`, `lg`, `full`) so a single override propagates to every widget that reads that token.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Sharper corners globally
const sharpTheme = getBaseTheme({
	border: {
		radius: { sm: "1px", md: "2px", lg: "4px" }
	}
});

// Rounded corners globally
const roundedTheme = getBaseTheme({
	border: {
		radius: { sm: "4px", md: "8px", lg: "16px" }
	}
});
```

## Motion customization

Override animation durations or easing curves. Tokens apply globally, so a single change affects all animated widgets.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// No animations
const noMotionTheme = getBaseTheme({
	motion: {
		duration: { instant: "0s", fast: "0s", normal: "0s", slow: "0s", slower: "0s", slowest: "0s" }
	}
});
```

## Opacity customization

Override overlay and disabled-state opacities.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = getBaseTheme({
	opacity: {
		subtle: 0.2, // e.g. lighter hover overlays
		medium: 0.4 // e.g. less opaque modal backdrops
	}
});
```

## Per-component override

When a single widget needs a value that differs from the semantic token, use `components` to deep-merge overrides into that component's config.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Deep-merge into a specific component's config
const theme = getBaseTheme({
	components: {
		button: {
			primary: {
				backgroundColor: "#005FAD",
				borderRadius: "8px"
			}
		},
		card: {
			borderRadius: "12px"
		}
	}
});
```

## Full custom theme

Combine font, spacing, color, border, opacity, input styles, and component overrides to create a fully branded theme.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Combine multiple layers of customization

import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const corporateTheme = getBaseTheme({
	// Application layer
	typography: { font: "Inter, sans-serif" },
	spacing: { base: 14 },
	border: {
		radius: { md: "6px", lg: "12px" }
	},
	motion: {
		duration: { normal: "0.15s" }
	},
	opacity: {
		medium: 0.4
	},
	baseInputStyles: {
		lineHeight: 1.6
	},
	// Semantic layer
	colors: {
		interaction: {
			primaryInteractionColor: "#FF0000"
		},
		background: {
			navigationBackground: "#808080"
		}
	},
	// Widget layer
	components: {
		button: {
			fontWeight: "normal"
		}
	}
});
```
