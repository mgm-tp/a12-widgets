## Overview of changes

From version 34.0.0, A12 switched from Stylus CSS pre-processor to styled-components. This change is a big step and
requires manual intervention from projects using A12, therefore please go through this documentation carefully and feel
free to contact us if needed.

## Before starting with the real works, let's get some FAQ answered:

### What happened to @com.mgmtp.a12.widgets/widgets-styles?

It's gone! There is no longer separated package for CSS styling. Component's style is bundled together with the
component's React code, inside `@com.mgmtp.a12.widgets/widgets-core`.

### What is styled-components?

Before you start with the code, it's highly recommended that you go through
the [official documentation of styled-components](https://styled-components.com/).

### Do I need to learn yet-another-library called styled-components?

Yes and no :)

- If your project only use prebuilt `plasma.css` or its variants(compact, flat, flat-compact) and have no customization
  on top, there is no need to learn styled-components.

- On the other hand, if customization was applied, it's necessary to know how to work with styled-components, just like
  the necessity to learn Stylus before.

## Setting up your project to use styled-components

### Installation

In your project, install `styled-components` by the following command:

```shell
npm install --save styled-components
```

For TypeScript typing, install the @types package as well:

```shell
npm install --save-dev @types/styled-components
```

Since styled-components is just React components, you don't need any special loader for Webpack. You can remove old
dependencies to Stylus from your project, such as:

- @com.mgmtp.a12.widgets/widgets-styles
- stylus
- stylus-loader

There is, however, a css file to include fonts that need to be included. For this, the best is to import it into your
index.tsx file. And use Webpack loader to load this CSS file. To install these loaders:

```shell
npm install --save-dev css-loader style-loader
```

### Webpack configuration

#### Font loading

Additionally, to load the font files, you will need to declare them as asset module in webpack 5.

```
    {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
    },
    {
        test: /\.(png|jpe?g|gif|svg|woff|woff2)$/i,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: "asset",
        generator: {
            filename: "static/media/[hash][ext][query]"
        }
    },
```

Next, remove any import to plasma.css or plasma.styl in your project. There is no such thing anymore. All styles of a
component is bundled with the React component itself.

#### Development performance

The default setup of styled-components use the slow but more compatible method to update the style, which make the update time extremely slow whenever the app is modified. To disable this behavior, set `SC_DISABLE_SPEEDY` environment variable to false using Webpack Define plugin:

```
      plugins: [
          new webpack.DefinePlugin({
            SC_DISABLE_SPEEDY: false
        }),
      ]
```

In production mode, this variable is set to false automatically so you don't need to.

### Using a theme in React

To use any of the themes provided by widgets, simply wrap your application in a `ThemeProvider`, and supply the theme
you would like to use:

```tsx
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/default/default-theme";

// Basic css needed for fonts. Fonts file will be handled by Webpack loaders above.
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";

export function App() {
	return (
		<ThemeProvider theme={defaultTheme}>
			<GlobalStyles />
			<MyApp />
		</ThemeProvider>
	);
}
```

- `GlobalStyles` contains `global` CSS classes, such as utils classes, helper classes, etc.
- `ThemeProvider` receives the theme object, and provide theming related information to its inner children. In the code example above, the default theme was used. Themes are provided under `@com.mgmtp.a12.widgets/widgets-core/lib/theme/` export.
- In styled-components v6, vendor prefixes are disabled by default. If you need to support older browsers, wrap your app with `<StyleSheetManager enableVendorPrefixes={true}>`.

Now the application can be started with new Widgets + styled-components.
