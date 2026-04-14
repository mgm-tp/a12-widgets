import type { Preview, ReactRenderer, Decorator } from "@storybook/react-vite-vite";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { ThemeProvider } from "styled-components";
import { createTheme, GlobalStyles, WidgetsRoot } from "@com.mgmtp.a12.widgets/widgets-core";

// Import font-face declarations for Material Icons, Open Sans, and custom icons
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

// Create themes once at module level to avoid recreation on each render
const defaultTheme = createTheme();
const compactTheme = createTheme({ baseTheme: "compact" });
const flatTheme = createTheme({ baseTheme: "flat" });
const flatCompactTheme = createTheme({ baseTheme: "flat-compact" });

// Custom decorator that wraps GlobalStyles in ThemeProvider and adds -a12-base class
const withGlobalStylesAndBaseClass: Decorator = (Story) => {
	return (
		<ThemeProvider theme={defaultTheme}>
			<GlobalStyles />
			<WidgetsRoot>
				<div className="base" style={{ height: "100%" }}>
					<Story />
				</div>
			</WidgetsRoot>
		</ThemeProvider>
	);
};

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	},
	decorators: [
		withThemeFromJSXProvider<ReactRenderer>({
			themes: {
				default: defaultTheme,
				compact: compactTheme,
				flat: flatTheme,
				"flat-compact": flatCompactTheme
			},
			defaultTheme: "default",
			Provider: ThemeProvider
		}),
		withGlobalStylesAndBaseClass
	]
};

export default preview;
