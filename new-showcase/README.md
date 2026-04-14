# Widgets Showcase

This package contains the showcase of A12 widgets, demonstrating all A12 Widgets components with live examples, code snippets, and customization options.

### Supported Browsers

#### Desktop

- Latest Firefox
- Latest Firefox ESR
- Latest Chrome
- Latest Edge

#### Mobile

- Latest Chrome Android
- Latest Safari on iOS

## How to Build and Run

### Prerequisites

The following tools are required in order to build this repository:

| Tool                        | Version |
| --------------------------- | ------: |
| [Node](https://nodejs.org/) |  `24.x` |
| [pnpm](https://pnpm.io/)    |  `10.x` |

### Scripts

All necessary scripts for development are accessible by:

```sh
pnpm run <script>
```

In order to get a list of all scripts use:

```sh
pnpm run
```

The [showcase](http://localhost:5555) is accessible after executing:

```sh
pnpm start
```

## How to run our showcase with your custom themes?

Firstly, install these packages with the **latest** version that are needed to run Widgets Showcase from your repository:

```sh
"@com.mgmtp.a12.widgets/widgets-core": "latest",
"@com.mgmtp.a12.widgets/widgets-json-api": "latest",
"@com.mgmtp.a12.widgets/widgets-utils": "latest",
"@com.mgmtp.a12.widgets/widgets-showcase-redesign": "latest",
"@com.mgmtp.a12.widgets/react-virtualized-fork": "latest"
```

Define custom themes and use the setter `ShowcaseThemes.setThemes` so that our showcase can read your themes.
For instance, create a file `src/themes.tsx`:

```javascript
import React from "react";

import { getFlatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/create-theme";
import { ShowcaseThemes } from "@com.mgmtp.a12.widgets/widgets-showcase-redesign/src/themes/themes";

const getBrightTheme = createTheme({
	components: { accordion: { text: { color: "darkturquoise" } } }
});

ShowcaseThemes.setThemes([
	{
		name: "bright",
		label: "Bright",
		theme: getBrightTheme()
	},
	{
		// You can also add the showcase's theme into your list
		name: "flat",
		label: "Flat",
		theme: getFlatTheme()
	}
]);
```

Add the `start` script with the webpack config from the showcase `webpack.dev.js`. Link your themes to the
environment variable `env.themes`. The showcase will get the custom themes via this `env` variable if it's given.
In addition, you can define a port if needed. For instance:

```sh
"start": "webpack serve --config ./node_modules/@com.mgmtp.a12.widgets/widgets-showcase-redesign/lib/webpack.dev.js --env themes=src/themes.tsx --env port=11000"
```

To bundle the showcase, point to the `webpack.public.js` file of the showcase.

```sh
"build": "webpack --config ./node_modules/@com.mgmtp.a12.widgets/widgets-showcase-redesign/lib/webpack.public.js --env themes=src/themes.tsx"
```
