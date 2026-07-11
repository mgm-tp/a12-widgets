import type { Preview, ReactRenderer, Decorator } from "@storybook/react-vite";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { createTheme, getBaseTheme, GlobalStyles, shouldForwardProp, WidgetsRoot } from "@com.mgmtp.a12.widgets/widgets-core";

import { baseFlatOverrides } from "./base-flat.js";

import "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css";

// Create themes once at module level to avoid recreation on each render
const baseTheme = getBaseTheme();
const baseFlatTheme = getBaseTheme(baseFlatOverrides);
const defaultTheme = createTheme();
const compactTheme = createTheme({ baseTheme: "compact" });
const flatTheme = createTheme({ baseTheme: "flat" });
const flatCompactTheme = createTheme({ baseTheme: "flat-compact" });

// Outermost: filter transient/custom props out of the DOM. Theme-independent.
const withStyleSheetManager: Decorator = (Story) => (
	<StyleSheetManager shouldForwardProp={shouldForwardProp}>
		<Story />
	</StyleSheetManager>
);

// Innermost: GlobalStyles + WidgetsRoot. These consume the theme from the
// withThemeFromJSXProvider decorator above them, so the selected theme (toolbar)
// drives the global styles too — not a hardcoded one. The `base` class scopes
// the GlobalStyles resets (see GlobalStyles `.${addPrefix("base")}`).
const withGlobalStylesAndBaseClass: Decorator = (Story) => (
		<WidgetsRoot>
			<div className="base" style={{ height: "100%" }}>
				<Story />
			</div>
		</WidgetsRoot>
);

const preview: Preview = {
	parameters: {options: {
			storySort: {
				order: [
						"General",
						["Buttons", ["Button", "*"], "*"],
						"Data Display",
						["DataTable", ["Overview", "DataTable", "*"], "*"],
						"*"
					]
			}
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	},
	// Decorators are applied first = innermost, last = outermost. So GlobalStyles +
	// WidgetsRoot sit inside the theme provider (and pick up the selected theme),
	// while StyleSheetManager wraps everything on the outside.
	decorators: [
		withGlobalStylesAndBaseClass,
		withThemeFromJSXProvider<ReactRenderer>({
			themes: {
				Base: baseTheme,
				"Base Flat": baseFlatTheme,
				"Default (deprecated)": defaultTheme,
				"Compact (deprecated)": compactTheme,
				"Flat (deprecated)": flatTheme,
				"Flat Compact (deprecated)": flatCompactTheme
			},
			defaultTheme: "Base",
			Provider: ThemeProvider,
			GlobalStyles
		}),
		withStyleSheetManager
	]
};

export default preview;
