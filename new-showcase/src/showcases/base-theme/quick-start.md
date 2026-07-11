Two ways to create a theme are shown below. The first uses the defaults; the second applies a custom color palette.

- **Default theme** — call `getBaseTheme()` with no arguments to get the standard colors, spacing, and font.
- **Quick palette** — pass a `QuickThemePalette` to `getQuickTheme()`. Provide the colors you care about; the rest are filled in from your primary color.

## Base theme

Calling `getBaseTheme()` with no arguments gives a working theme: the default colors, 12 px spacing, and the system font.

```tsx
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = getBaseTheme();
```

## Dark theme with quick palette

`QuickThemePalette` is a flat object with named color slots. `getQuickTheme()` maps them to the component-level tokens. Nine keys are required; the rest are calculated from `primary` when left out.

The palette below uses dark indigo surfaces and a light purple as the action color.

```tsx
import { getQuickTheme } from "@com.mgmtp.a12.widgets/widgets-core";
import type { QuickThemePalette } from "@com.mgmtp.a12.widgets/widgets-core";

const darkIndigoPalette: QuickThemePalette = {
	// required
	primary: "#818CF8",
	surface: "#13112D",
	pageBackground: "#0A0917",
	border: "#2C2A55",
	textPrimary: "#E9EAF8",
	success: "#22C55E",
	warning: "#F59E0B",
	error: "#EF4444",
	info: "#38BDF8",

	// optional — calculated from primary if not set
	primaryHover: "#6366F1",
	primaryActive: "#4F46E5",
	primaryLight: "#1E1B4B",
	primaryTint: "#1A1748",
	groupBackground: "#1C1A3F",
	navigationBackground: "#0F0E24",
	navigationAccent: "#818CF8",
	borderSubtle: "#1A1840",
	textSecondary: "#8B8CB8",
	textTitle: "#F2F3FF"
};

const theme = getQuickTheme({ fontFamily: "Inter, sans-serif", palette: darkIndigoPalette });
```
