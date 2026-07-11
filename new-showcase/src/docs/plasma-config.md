The styles of Widgets are written inside the React component using styled-components. It can be utilized in two ways: either by using one of our themes, or by extending our theme and changing it to fit the desired styles of your application.

**Recommended starting point:** Use `getBaseTheme()` — a clean three-layer architecture (Application → Semantic → Widget) that makes custom themes straightforward with minimal token changes.
It replaces the legacy `Default`, `Compact`, `Flat`, and `Flat Compact` themes, which are kept for backwards compatibility but are now deprecated.
See the [Base Theme](#/basics/theme/base-theme) guide for details.

## Use the theme out of the box

The widgets core package includes 4 themes:

- The default, old school theme
- The modern "Flat" theme
- The "Compact" theme
- The modern and compact: "Flat Compact" theme

To use one of these themes, simply import it and supply it to the `ThemeProvider` component from `styled-components`:

```typescript jsx
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "@com.mgmtp.a12.widgets/widgets-core";

// Somewhere in your render function
<ThemeProvider theme={defaultTheme}> ... </ThemeProvider>
```

In case you haven't set up your project to use styled-components, please see [this section](#/get-started/migration-instructions/migration-to-styled-components).

## App Theming

The following sections will mainly describe how you can create and customize your own theme. To identify how Widgets define the `theme` in detail, please take a look at our [Theming](#/basics/theme/theming) page.

### General approach

To theme your application differently from the prebuilt themes, the easiest way to understand how it should be done is to look at how we built the Flat theme:

```typescript
import merge from "lodash/merge";

import { FlatThemeType } from "../schema";
import { DefaultComponentsConfigs } from "../default/config/components/components";
import { ApplicationStyles } from "../default/config/application/application_styles.config";
import { DivisionLineStyles } from "../default/config/application/division-line.config";
import { defaultTheme } from "../default/default-theme";

import { FlatColorsConfig } from "./config/base/colors.config";
import { FlatComponentsConfigs } from "./config/components/components";
import { ApplicationFlatStyles } from "./config/application/application_styles.config";
import { FocusFlatStyles } from "./config/application/focus.config";
import { HoverFlatStyles } from "./config/application/hover.config";
import { FlatDivisionLineStyles } from "./config/application/division-line.config";

const getTheme = (): FlatThemeType => {
	const colors = FlatColorsConfig;
	// The Flat theme has a different set of colors than the Default theme, but uses the same typography and spacing configuration as the Default theme
	const applicationProps = {
		colors,
		typography: defaultTheme.typography,
		spacing: defaultTheme.spacing
	};

	// The focus and hover styles are configured differently in the Flat theme.
	const focusStyles = FocusFlatStyles({ colors });
	const hoverStyles = HoverFlatStyles({ colors });

	// The color, typography, spacing, hover and focus styles are then used to derive `applicationStyles`.
	const applicationStyles = merge(ApplicationStyles(applicationProps), ApplicationFlatStyles({ hoverStyles }));

	// The division line is also configured differently in Flat theme
	const divisionLineStyles = merge(DivisionLineStyles({ colors }), FlatDivisionLineStyles());

	// The Base Styles is then constructed from the default theme Base Styles, with Flat theme specific variables applied on top
	const baseTheme = {
		...defaultTheme,
		colors,
		applicationStyles,
		focusStyles,
		hoverStyles,
		divisionLineStyles
	};
	return {
		...baseTheme,
		// At the end, components styles are calculated from the base styles, with Flat theme specific variables applied on top.
		components: merge(DefaultComponentsConfigs(baseTheme), FlatComponentsConfigs(baseTheme))
	};
};
export const flatTheme = getTheme();
```

## Colors

Widgets provide a pre-defined color set, please see [this section](#/basics/theme/colors).
You can change any color by overriding `theme.colors` properties.

This example sets the `primaryColor` from `#4e5965` to `red`:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	colors: { primaryColor: "red" }
});
```

## Typography

The base Widgets `theme.typography` includes the following aspects:

- Font
- Font Size
- Font Weight

### Font

You can change the **Font family** with the `theme.typography.font.MAIN_FONT`.

This example uses the `monospace` font instead of the default `Open Sans` font:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	typography: { font: { MAIN_FONT: `monospace` } }
});
```

### Font Size

You can change the **Font size** with the `theme.typography.fontSize`.

Widgets use the `rem` unit for font size and provide a range of pre-defined font sizes based on the font size of `1rem`, please see [this section](#/basics/theme/fonts#font-size).
This example uses the `1.25rem` font size instead of the default `1rem` font size:

```typescript
import { createTheme, createFontSizeConfig } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	typography: { fontSize: createFontSizeConfig(1.25) } //in rem unit
});
```

### Font Weight

You can change the **Font weight** with the `theme.typography.fontWeight`.

Widgets provide a range of pre-defined font weights, please see [this section](#/basics/theme/fonts#font-weight).

This example sets the `typography.fontWeight.boldFontWeight` to `750` instead of the default `700`:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	typography: { fontWeight: { boldFontWeight: 750 } }
});
```

## Spacings

Widgets `theme.spacing` includes the following aspects:

- Spacing
- Horizontal Spacing
- Vertical Spacing

Widgets use the `px` unit for all spacing systems.

### Spacing

The **Spacing** is used to adjust the width and height of an element.

You can change the spacing values with the `theme.spacing.spacing`.
Widgets provide a range of pre-defined spacings, please see [this section](#/basics/theme/spacing#spacing).

This example creates a new set of **Spacings** based on the base spacing of `14px` instead of the default `16px`, using the `SpacingConfig()`:

```typescript
import { createTheme, SpacingConfig } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	spacing: { spacing: SpacingConfig(14) } //in px unit
});
```

### Horizontal Spacing

The **Horizontal Spacing** is used to define the horizontal margin and horizontal padding of an element.

You can change the horizontal spacing with the `theme.spacing.horizontalSpacing`.
Widgets provide a range of pre-defined horizontal spacings, please see [this section](#/basics/theme/spacing#horizontal-spacing).

This example creates a new set of **Horizontal Spacings** based on the base spacing of `14px` instead of the default `16px`, using the `HorizontalSpacingConfig()`:

```typescript
import { createTheme, HorizontalSpacingConfig } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	spacing: { horizontalSpacing: HorizontalSpacingConfig(14) } //in px unit
});
```

### Vertical Spacing

The **Vertical Spacing** is used to define the vertical margin and vertical padding of an element.

You can change the vertical spacing with the `theme.spacing.verticalSpacing`.
Widgets provide a range of pre-defined vertical spacings, please see [this section](#/basics/theme/spacing#vertical-spacing).

This example creates a new set of **Vertical Spacings** based on the base spacing of `14px` instead of the default `16px`, using the `VerticalSpacingConfig()`:

```typescript
import { createTheme, VerticalSpacingConfig } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	spacing: { verticalSpacing: VerticalSpacingConfig(14) } //in px unit
});
```

## Application Styles

Widgets' `theme.applicationStyles` is designed to configure the overall styles of the application, including:

- Responsive breakpoints
- Common input styles
- Common label styles

### Responsive Breakpoints

By default, Widgets provide 3 `applicationStyles.responsive` breakpoints:

- `mobileMaxWidth`: 767px
- `tabletMinWidth`: 768px
- `desktopMinWidth`: 992px

You can change the value of those breakpoints by following this example:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	applicationStyles: {
		responsive: {
			mobileMaxWidth: "600px",
			tabletMinWidth: "640px",
			desktopMinWidth: "1200px"
		}
	}
});
```

### Common Input Styles

Widgets provide `applicationStyles.input` styles to provide a consistent UI across data entries.

The following example will change the `background` of all Widgets' inputs to `white`:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	applicationStyles: { input: { background: "white" } }
});
```

### Common Label Styles

Widgets provide `applicationStyles.label` styles to provide a consistent UI across data entry labels.

The following example will change the `fontColor` of all Widgets' labels to `blue`:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	applicationStyles: { label: { fontColor: "blue" } }
});
```

## Focus Styles

The base Widgets `theme.focusStyles` includes 2 focus variants:

- `focusedBoundaryDark`
- `focusedBoundaryLight`

These `focusStyles` are applied to the `outline` property of any Widgets that are in the `focus` state.

The following example will change the `focusedBoundaryDark` to `1px solid black`:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	focusStyles: { focusedBoundaryDark: "1px solid black" }
});
```

## Division Line Styles

The base Widgets `theme.divisionLineStyles` includes the following values:

- `lineHeight`
- `bottomLine`
- `initialLine`
- `topLine`

By default, values of `divisionLineStyles` are used in heading-level components that have a divider to distinguish them from other sections, including:

- `ApplicationHeader`
- `Contentbox` headings
- `Menu` as `mainMenu` or `tabNavigation`

The following example will change the `divisionLineStyles.bottomLine` to `1px solid purple`:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	divisionLineStyles: { bottomLine: "1px solid purple" }
});
```

## Components

### Theming variable

You can customize the styles of a Widget's component by modifying the value of its theming variables.
This example sets the `background` of the primary button to `orange`:

```typescript
import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
	components: { button: { primary: { background: "orange" } } }
});
```

### Custom Component Using Widget's Theme

You can create and style your custom component with Widget's Theme properties.

**Note:** Please make sure that your custom component is wrapped in a `ThemeProvider` that has a Widget's `theme` passed in.

This example creates a custom `div` element that can receive a custom `background` value and use Widget's `theme.colors.background.interactiveBackground` by default if no custom `background` is passed in.
This example also uses [styled-components' transient props](https://styled-components.com/docs/api#transient-props):

```typescript jsx
import styled, { css } from "styled-components";

const CustomDiv = styled.div<{ $background?: string }>(({ theme, $background }) => {
  return
    css`
       background: ${$background ?? theme.colors.background.interactiveBackground};
    `;
});

// later in your usage
    return (
    //...
    <CustomDiv $background={"blue"} />      // This div will have a blue background
    <CustomDiv />                           // This div will have Widget's interactiveBackground
    //...
    )
```

### Theme Declaration File for TypeScript

- When accessing the theming variable from Widgets, or when creating a custom theme with `styled-components` in a TypeScript project, you need to explicitly define the shape of your theme so that TypeScript can correctly infer the theme types across your app.
- For detailed instructions on how to create a declaration file for your theme, refer to the official [styled-components TypeScript guide](https://styled-components.com/docs/api#typescript).

### Custom Component Using Custom Theme Without Affecting The Overall Theme

You can create and style your custom and/or Widget's component with your custom Widget's Theme properties in a specific location that would not impact the overall theme.
A particular usage of this feature can be found in [this section](#/widgets/data-display/list#combination).

This example creates a Widget's `customTheme` that has the `button.primary.background` config modified into `purple`.
Only the `primary` `Button` wrapped inside the `customTheme` will have the `purple` background, while the others will have the background from `defaultTheme`:

```typescript jsx
import { ThemeProvider } from "styled-components";
import { defaultTheme, createTheme, Button } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
  components: { button: { primary: { background: "purple" } } }
});

// later in your render
    return (
    //...
    <ThemeProvider theme={defaultTheme}>
      <Button primary label="default" />      // This Button will have defaultTheme's primary button background of "#297a24"
      <ThemeProvider theme={customTheme}>
          <Button primary label="custom" />   // This Button will have customTheme's primary button background of "purple"
      </ThemeProvider>
      <Button primary label="default" />      // This Button will have defaultTheme's primary button background of "#297a24"
    </ThemeProvider>
    //...
    )
```

### Create new component from Widgets component

This example creates a component `CustomPrimaryButton` based on Widget's primary `Button` that will have its `background` set to `purple`. However, we recommend using theming variables instead of changing the CSS property directly this way, because the internal structure of an A12 Button is not public API and can be changed without notice.

```typescript jsx
import styled, { css } from "styled-components";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core";

const CustomPrimaryButton = styled(Button)(({ primary }) => {
  return (
    primary &&
    css`
       background: purple;
    `
  );
});

// later in your usage
    return (
    //...
    <CustomPrimaryButton label="custom button" primary />
    //...
    )
```

### Create a new theme based on a Widgets theme

You can create an entirely new theme based on a specific Widget's theme by passing an additional parameter `baseTheme` to the `createTheme`.
This example creates a custom theme based on Widget's Flat Compact theme:

```typescript jsx
import styled, { css } from "styled-components";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core";

const customFlatCompactTheme = createTheme({
  components: { button: { primary: { background: "purple" } } },
  baseTheme: "flat-compact"
});

// later in your render
    return (
    //...
    <ThemeProvider theme={customFlatCompactTheme}>
      <Button primary label="default" />      // This Button will have the UI of flat-compact theme's primary button, with customized background of "purple"
    </ThemeProvider>
    //...
    )
```

### Global style override (_NOT RECOMMENDED_)

In styled-components you can also provide CSS at global level, that affects the whole page, by using `createGlobalStyle` function.
During the migration to styled-components, we kept all the old CSS classes that associate with A12 components to ease the transition to the new technology. If a project is overriding CSS style without using Plasma Stylus variables, this can be the last resort to bring those styles over to the new version.

```typescript jsx
import { createGlobalStyle } from "styled-components";

const GlobalOverride = createGlobalStyle`
    .button--primary {
        background-color: red;
    }
`

// later in your render function
    return (
    // This should be rendered after Widgets global style import in order for it to override correctly
    <GlobalOverride />
    //...
    )
```
