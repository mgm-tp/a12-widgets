## 38.3.5

No breaking changes in 38.3.5.

## 38.3.4

No breaking changes in 38.3.4.

## 38.3.3

No breaking changes in 38.3.3.

## 38.3.2

No breaking changes in 38.3.2.

## 38.3.1

No breaking changes in 38.3.1.

## 38.3.0

No breaking changes in 38.3.0.

## 38.2.2

No breaking changes in 38.2.2.

## 38.2.1

No breaking changes in 38.2.1.

## 38.2.0

## Deprecation of nested imports

Nested imports are deprecated in favor of top-level imports to avoid unnecessary breaking changes caused
by moving or renaming internal files. This makes the code more resilient to internal refactoring,
provides a single consistent import path, and reduces ongoing maintenance effort.

Run the [codemod](#/get-started/migration-instructions/codemod-instruction) command below to migrate automatically:

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod prefer-top-level-imports <your-source-directory-containing-ts-config-json-file>
```

The codemod will update all nested imports to use the package root:

```typescript
// Before
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/index.js";

// After
import { Button } from "@com.mgmtp.a12.widgets/widgets-core";
```

Some entities are deprecated to avoid duplicate export names in the top-level index. Use the recommended replacements:

| Deprecated            | Use Instead                        | Deprecated Path                                                                                             |
| --------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `ResizeEventHandler`  | `ColumnResizeEventHandler`         | `@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.api.js`                                        |
| `IconPicker`          | `IconPickerTitles`                 | `@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/a11y-key-definition.api.js`          |
| `TooltipProps`        | `TooltipPluginProps`               | `@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/plugins/tooltip-plugin/view/tooltip.api.js`  |
| `Tooltip`             | `TooltipPlugin`                    | `@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/plugins/tooltip-plugin/view/tooltip.view.js` |
| `TooltipWrapperProps` | `TooltipPluginWrapperProps`        | `@com.mgmtp.a12.widgets/widgets-core/lib/rich-text-editor/main/plugins/tooltip-plugin/view/tooltip.api.js`  |
| `commonTileConfigs`   | `commonInteractiveTileFlatConfigs` | `@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/config/components/interactive-tile.config.js`           |
| `BodyContent`         | `TreeTableBodyContent`             | `@com.mgmtp.a12.widgets/widgets-core/lib/tree-table/main/tree-table.view.js`                                |
| `BodyCell`            | `TreeTableBodyCell`                | `@com.mgmtp.a12.widgets/widgets-core/lib/tree-table/main/tree-table.view.js`                                |
| `walk`                | `walkTreeNode`                     | `@com.mgmtp.a12.widgets/widgets-core/lib/tree/main/behavior/tree.behavior.api.js`                           |
| `DeepPartial`         | `DeepPartial` (from top level)     | `@com.mgmtp.a12.widgets/widgets-core/lib/theme/create-theme.js`                                             |

## Deprecation of Relation Node

The entire `relation-node` module has been deprecated, including all its components and interfaces. This module should no longer be used in new projects and existing usages should be migrated to the newer `model-graph-diagram` module components.

### Deprecated Components and Interfaces

All entities from the `relation-node` module are deprecated:

- `NodeTpl` namespace and all its sub-components (`NodeTpl.Node`, `NodeTpl.NodeTitle`, etc.)
- `NodeTplProps` namespace and all its interfaces
- `createPort` higher-order component (HOC)
- `PortProps` interface

### Migration Guide

Use `DiagramNode` and `DiagramPort` from the `model-graph-diagram` module instead:

```typescript
// Before
import { NodeTpl, createPort, PortProps } from "@com.mgmtp.a12.widgets/widgets-core";

// After
import { DiagramNode, DiagramPort } from "@com.mgmtp.a12.widgets/widgets-core";
```

### Component Migration Examples

**Node Component:**

```typescript
// Before
<NodeTpl.Node>
	<NodeTpl.NodeTitle>My Node</NodeTpl.NodeTitle>
</NodeTpl.Node>

// After
<DiagramNode>My Node</DiagramNode>
```

**Port Component:**

```typescript
// Before
const MyPort = createPort<MyProps, MyPortProps>({
	// port configuration
});

// After
<DiagramPort />
```

The new `DiagramNode` and `DiagramPort` components provide improved functionality with better type safety and simpler API. Refer to the [Diagram Shapes documentation](#/experimental/diagram-shapes) for detailed usage examples.

## 38.1.1

### Deprecation of Chart Widgets

Widgets has deprecated the Chart Widgets, which was previously a wrapper around the Recharts library. The Chart Widgets will be removed in a future release, so users are advised to transition to using Recharts directly.
For the detailed migration guide, please refer to [Chart Widgets to Recharts](#/get-started/migration-instructions/chart-widgets-to-recharts).

### draft-js-editor Package Discontinued

`@com.mgmtp.a12.widgets/widgets-draft-js-editor` is no longer available. Please migrate to **[Rich Text Editor](#/widgets/data-entry/rich-text-editor)** to continue using a supported editor with ongoing updates.
The detailed migration guide is available in [Draft-js to Lexical Editor](#/get-started/migration-instructions/draft-js-to-lexical-editor).

## 38.0.0

### React 19 upgrade

Widgets now supports React 19. The upgrade includes the following changes:

- Updated peer dependencies to only support React 19. This allows us to use the latest features and improvements of React 19.
- Due to this upgrade, some breaking changes has been introduced since React breaks some APIs and features. Please refer to the [React 19 release notes](https://react.dev/blog/2024/12/05/react-19) for more information. Most notable changes:
  - Removed: `propTypes` and `defaultProps` for functions
  - Removed: ReactDOM.render, use `ReactDOM.createRoot` instead
  - Removed: ReactDOM.findDOMNode
  - ref cleanups required
  - `useRef` requires an argument
  - The JSX namespace in TypeScript
  - All changes are documented in [React upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide), and many include code mods to help with the migration.

### react-day-picker v9 update

- To be compatible with React 19, **react-day-picker** was updated to major version 9. Since the **Date(Time)Picker** inherits and exports **react-day-picker** props, please refer to **react-day-picker** [migration notes](https://daypicker.dev/upgrading).
- `locale` property has been removed from all Date(Time)Picker. Instead of passing the locale to each picker, it can now be configured in the `DateTimeContext.Provider` centrally. The locale should be imported from **date-fns** library, as this is required by the **react-day-picker**.

  `DateTimeContext.Provider` is particularly useful when you need to set a specific picker in a different locale from the others. However, for internationalized applications, this approach has to be applied globally to ensure all picker components consistently use the same localization settings.

  ```tsx
  // BEFORE
  <DateInput datePickerProps={{ locale: "de" }} />;

  // NOW
  import { de } from "date-fns/locale/de";

  <DateTimeContext.Provider value={{ locale: de }}>
  	<DateInput />
  </DateTimeContext.Provider>;
  ```

  Please refer to [Date Picker with Additional Properties](#/widgets/data-entry/pickers/date-picker#additional-properties) for a demonstration.

### styled-components v6 upgrade

**IMPORTANT:**

- Since widgets declares **styled-components** as peer dependency, please update the version in **package.json** to `^6.1.18`. Besides, TypeScript definition is now included, therefore please remove `@types/styled-components` from **package.json**.

**Other changes:**

Breaking Change: `disableVendorPrefixes` removed.

- In Styled Components v5, the `<StyleSheetManager>` component supported the `disableVendorPrefixes` property:
  ```tsx
  <StyleSheetManager disableVendorPrefixes>
  ```
- In Styled Components v6:
  - `disableVendorPrefixes` has been removed.
  - Vendor prefixes are now disabled by default.
  - To enable vendor prefixes, set `enableVendorPrefixes` to true in the `StyleSheetManager`.
  ```tsx
  	<StyleSheetManager enableVendorPrefixes={true}>
  ```

New Requirement: Defining `shouldForwardProp`

- Styled Components v6 no longer performs automatic prop validation. Instead, it recommends using transient props ($prop) to pass style-only props to components. If you cannot use transient props, you must define a shouldForwardProp function to filter props.
  - You can import the built-in `shouldForwardProp` function from widgets-core:

  ```tsx
  import { shouldForwardProp } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/should-forward-prop";
  ```

  - Alternatively, you can define your own `shouldForwardProp` function.
  - Applying `shouldForwardProp` in `<StyleSheetManager>`

  ```tsx
  	<StyleSheetManager shouldForwardProp={shouldForwardProp}>
  ```

All changes are documented in [the styled-components migration notes](https://styled-components.com/docs/faqs#what-do-i-need-to-do-to-migrate-to-v6).

### Plugin Editor:

Deprecated **draft-js** based text editor widgets is separated into their own package. The new package `@com.mgmtp.a12.widgets/widgets-draft-js-editor` is now available for use. As a result, the `@com.mgmtp.a12.widgets/widgets-core/lib/editor` folder is removed.
Please update your import from `"@com.mgmtp.a12.widgets/widgets-core/lib/editor"` to the new package.

### Migration to ESM

The npm artifacts `@com.mgmtp.a12.widgets/widgets-core`, `@com.mgmtp.a12.widgets/widgets-utils`, and `@com.mgmtp.a12.widgets/widgets-draft-js-editor` were migrated from CommonJS to [ESM](https://nodejs.org/api/esm.html#modules-ecmascript-modules). When using Node `22.12+` and modern build tools, there should be no changes necessary to your bundler setup.
Migrating your own application to ESM is not required, but recommended. Consult the documentation of your bundler for specifics.

### Applying Patch for Third-Party Libraries

- Some third-party libraries are not fully compatible with ESM-based build processes due to incorrect or missing module exports, such as:
  - `@draft-js-plugins/editor`
  - `react-dnd`
- This causes issues when building or bundling your project. To fix this, patches are included in this repository to correct the export behavior.
- For detailed instructions on applying the patch, please refer to the [Patch Instruction](#/get-started/migration-instructions/patch-instruction).

### Updating to ES2024

The javascript output of the npm artifacts was updated from `ES2020` to `ES2024` to be able to use latest language features. When using supported browsers, there is no change necessary. If support for older browsers is required, make sure to include necessary polyfills.

### Other breaking changes:

- **Master Detail:** Master detail view width is restricted from 1 to 12 columns. This should not have any impact on existing implementations, but is documented for reference purposes.
- **Date Picker:**
  - **Before:** The selected day maintains the same appearance in both normal and interactive states.
  - **Now:** The selected day has been updated to enhance visualization.
    - Remove the `day.selected.interactiveColor` configuration.
    - Introduce new configuration keys for each interaction state:
      - `day.selected.interaction.active { background, border, color }`
      - `day.selected.interaction.focus { background, border, color }`
      - `day.selected.interaction.hover { background, border, color }`
- **Popup Menu:** The icon size in the trigger element has been changed.
  - Remove the `plasmaIconFontSize` configuration key.
  - By default, the icon matches the font size of the Icon Button. When a custom trigger element is defined (such as a Button with the label and icon), it follows the styles defined by that custom element.
- **Select:** If you are using the following properties of `SelectItem`: `hideLabel`, `secondaryText`, `selected`, `tabIndex`, `title`, and `ariaChecked`, please remove them. They were wrongly inherit from DropdownItem, but do not have meaning for a SelectItem, and were removed.
- **Action Content Box:** The **headingElements** property in the **ActionContentboxProps** interface has been changed from required to optional. It's necessary to check for undefined value.

  ```tsx
  // BEFORE: Checking only for null
  if (props.headingElements !== null) {
  	// Render heading elements
  	renderHeading(props.headingElements);
  }

  // AFTER: Checking for both null and undefined
  if (props.headingElements !== null && props.headingElements !== undefined) {
  	// Render heading elements
  	renderHeading(props.headingElements);
  }
  ```

- **Content Box:** The variable `BASE_CONTENTBOX_DATA_ROLE` has been removed. Use `DataRoles.Contentbox` instead for better maintainability and consistency.

  ```tsx
  // BEFORE
  import { BASE_CONTENTBOX_CLASS_NAME } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/elements/config.js";

  <div data-role={BASE_CONTENTBOX_DATA_ROLE} />;

  // AFTER
  import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/data-roles.js";

  <div data-role={DataRoles.Contentbox} />;
  ```

- **Supporting Panes Layout:**
  - Type Change: The type of configuration keys `transitionDuration` has been updated from `string` to `Duration`. This ensures that only valid transition durations `(${number}${"ms" | "s"}, "initial", or "0")` are accepted, allowing for more precise and consistent animation timing values.
  - Valid Values: `transitionDuration` can now only be one of the following:
    - ${number}ms (e.g., "500ms", "200ms")
    - ${number}s (e.g., "0.5s", "1s")
    - "initial"
    - "0"
  - No More Loose Strings: Any value like "0.5" or "500" will now trigger a type error, reducing potential bugs.
- To have better separation of dependencies, namespace **TimeUtils** in `lib/common/main/utils` has been moved to `@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/time-utils.js`. Please update your import statement accordingly. For example:

  ```tsx
  // BEFORE
  import { TimeUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils";

  // AFTER
  import { TimeUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/time-utils";
  ```

- Similarly, namespace **DateTimeUtils** in `lib/common/main/utils` has been moved to `@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/date-utils.js`. Please update your import statement accordingly.
- The Date/Time utils now operate with the locale object from **date-fns** instead of the locale string. For example:

  ```tsx
  // BEFORE
  import { DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils";

  const date = new Date();
  const locale = "de";
  const format = "DD/MM/YYYY";

  DateTimeUtils.formatDateTime(date, locale, format);

  // AFTER
  import { DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/date-utils";
  import { de } from "date-fns/locale/de";

  const date = new Date();
  const format = "DD/MM/YYYY";

  DateTimeUtils.formatDateTime(date, de, format);
  ```

- **dayjs** is removed from the widgets-core package, as well as the corresponding utility. Please install it separately if you are using it in your project, or use **date-fns** instead.

## 37.2.3

### Interaction Hint

- The hint is deactivated by default for interactive elements. To enable the hint, use the `InteractionHintConfigProvider` configuration.

  ```tsx
  import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context";

  <InteractionHintConfigProvider enableInteractionHint>...</InteractionHintConfigProvider>;
  ```

## 37.2.2

### Interaction Hint

- In some situations, displaying hints for interactive elements may be unnecessary, particularly when the default browser tooltips from the title attribute are sufficient. To manage this, you can disable the hint feature in your application by using `InteractionHintConfigProvider`. This will ensure that any interactive element with a title attribute will only show the browser's default tooltip, omitting any additional hints.

  ```tsx
  import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context";

  <InteractionHintConfigProvider enableInteractionHint={false}>...</InteractionHintConfigProvider>;
  ```

## 37.2.0

### Accessibility Enhancement

- By default, an element uses the `title` attribute to provide additional information. When a user hovers over that element, a tooltip displaying title text appears. However, this information disappears when the element is focused and is not accessible to screen readers, making it difficult to convey the purpose of an interactive element.
  To support a better accessibility, a new [Interaction Hint](#/widgets/data-display/interaction-hint) is introduced. This component will replace the browser's tooltip with a look-like Widgets's Tooltip. It has two main properties:
  - `title`: The text that will be shown in the hint.
  - `referenceElementRef`: The reference to the element that the hint will be attached to.

  The example below shows how to use the `InteractionHint` component:

  ```tsx
  // BEFORE
  import * as React from "react";

  function ButtonExample(): React.ReactElement {
  	return <input role="button" type="button" title="This is a submit button" value="Submit" />;
  }

  // AFTER
  import * as React from "react";
  import { InteractionHint } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint.view";

  function ButtonExample(): React.ReactElement {
  	const inputRef = React.useRef<HTMLInputElement | null>(null);

  	return (
  		<>
  			<input role="button" type="button" value="Submit" ref={inputRef} />
  			<InteractionHint referenceElementRef={inputRef} title="This is a submit button" />
  		</>
  	);
  }
  ```

- Interaction Hint is automatically applied to various Widget components:
  - Button, Toggle Button.
  - File Upload.
  - Flyout Menu.
  - External Link, Mailto Link.
  - Interactive Counter.
  - Interactive Tile.
  - Rich Text Editor.
  - Wizard.

  Depend on each component, there are different ways to integrate the **Interaction Hint**. The common aspect is that the `title` property is still available for the components that are listed above.
  However, instead of being used as a `title` attribute in the DOM, it is passed to `aria-label` or `HiddenText`. As a result, the `title` attribute is set to empty, or entirely removed from the element.
  For example, we have a Button Widget:

  ```tsx
  <Button label="Default" title="This is a button" />
  ```

  The difference in the DOM will be:

  ```tsx
  // BEFORE: `title` property's value was passed to `title` attribute.
  <button type="button" title="This is a button" data-role="button">
    <span data-role="button-label">Default</span>
  </button>

  // NOW:
  // - `title` attribute is set to empty.
  // - `title` property's value is passed to `aria-label` attribute.
  <button aria-label="Default, This is a button" title="" type="button" data-role="button">
    <span data-role="button-label">Default</span>
  </button>
  ```

  We have an Interactive Counter Widget:

  ```tsx
  <Counter interactive title="This is an Interactive Counter" value="9" />
  ```

  The difference in the DOM will be:

  ```tsx
  // BEFORE: `title` property's value was passed to `title` attribute.
  <span title="This is an Interactive Counter" data-role="counter" tabindex="0">
    <span data-role="hidden-text">9 Entries</span>
    <span aria-hidden="true" role="presentation">
      <span>9</span>
    </span>
  </span>

  // NOW:
  // - `role="button"` is added.
  // - `title` attribute is removed.
  // - `title` property's value is passed to the new added `HiddenText` (data-role="hidden-text").
  <span data-role="counter" role="button" tabindex="0" >
    <span data-role="hidden-text">9 Entries</span>
      <span data-role="hidden-text">, This is an Interactive Counter</span>
      <span aria-hidden="true" role="presentation">
          <span>9</span>
      </span>
  </span>
  ```

### Theming Customization

- **Interactive Tile:** To enhance border styling flexibility, the general `border` configuration key has been deprecated.
  Instead, alongside the existing `secondary.border`, a new `primary.border` configuration key has been introduced for the `primary` Tile.

  ````tsx
    // BEFORE
    import { ThemeProvider, useTheme } from "styled-components";
    import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/create-theme";

    const customTheme = () => {
      const interactiveTileConfigs: DeepPartial<InteractiveTileConfigType> = {
          border: "1px solid red",
          secondary: {
            border: "1px solid blue",
        }
      };

      return createTheme({ components: { interactiveTile: interactiveTileConfig } });
  	}

     <ThemeProvider theme={customTheme}>
       <InteractiveTile primary />
       <InteractiveTile secondary />
  	 </ThemeProvider>
    ```

    ```tsx
    // AFTER
    import { ThemeProvider, useTheme } from "styled-components";
    import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/create-theme";

    const customTheme = () => {
      const interactiveTileConfigs: DeepPartial<InteractiveTileConfigType> = {
          primary: {
            border: "1px solid red",
          },
          secondary: {
            border: "1px solid blue",
        }
      };

      return createTheme({ components: { interactiveTile: interactiveTileConfig } });
    }

     <ThemeProvider theme={customTheme}>
       <InteractiveTile primary />
       <InteractiveTile secondary />
  	 </ThemeProvider>
    ```

  ````

## 37.0.0

### React 18 upgrade changes

- To render a DOM element for calculating its children's size for responsive behavior such as **FlyoutMenu**, **ButtonGroupContainer**, the newest React 18's API `React.createRoot` is used as a replacement of `ReactDOM.render`. However, to facilitate the migration effort to React 18, Widgets still support React 16 & React 17 whereas `ReactDOM.render` is used in mentioned components. To enable the fallback behavior, setting `A12_ENABLE_REACT_18_SUPPORT` to `false` will ensure the compatibility. This environment variable can be configured via **webpack** like below:
  ```tsx
  plugins: [
  	webpack.DefinePlugin({
  		A12_ENABLE_REACT_18_SUPPORT: false
  	})
  ];
  ```
- **Portal** has been heavily refactored to be compatible with React 18 strict mode. One of the fundamental changes is that the portal now relies on React context to find the parent portal instead of using the DOM API. Each portal will render an additional placeholder DIV element to accommodate child portals. If you have DOM snapshot test, please be aware that the following markup may appear in the DOM where the portal is rendered:
  ```html
  <div data-role="portal-placeholder"></div>
  ```
  Besides, the `wrapper` property is no longer needed and is removed since Portal will automatically find its parent element.
- `withSizeDetector` HOC is difficult to use, and because it combines the props needed for window resize detection as well as element resize detector, the resulting API is confusing. We also don't see the need for a component to combine those behaviors, except in the case of a component library like Widgets itself. It has now been removed in favor of new hooks: `useWindowSize` and `useElementSizeDetector`
  - The hooks return the current breakpoint directly, so there is no need to write a callback with additional state update.
  - There are also 2 React components to support class component: `WindowSizeDetector` and `ElementSizeDetector`.

  **Example of the code using `withSizeDetector`**:

  ```tsx
  const AppFrameWithSizeDetect = withSizeDetector(ApplicationFrame);

  const AppView = () => {
  	const [windowSize, setWindowSize] = React.useState<SizeDetectorProps.Size>("lg");

  	const handleWindowSizeChange = React.useCallback((breakPoint: SizeDetectorProps.BreakPoint) => {
  		setWindowSize(breakPoint.size);
  	}, []);

  	return (
  		<AppFrameWithSizeDetect window={true} onSizeChange={handleWindowSizeChange}>
  			{windowSize}
  		</AppFrameWithSizeDetect>
  	);
  };
  ```

  **New code with `useWindowSize` hook** which is much simpler and doesn't require wrapping of component:

  ```tsx
  const AppView = () => {
  	const { breakPoint } = useWindowSize();
  	return <ApplicationFrame>{breakPoint.size}</ApplicationFrame>;
  };
  ```

  Similar code can be written for the new `useElementSizeDetector` hook, but a `targetRef` property is needed pointing to the element to listen for the size change.

- Switch to the original **react-virtualized** that now supports React 18. Therefore, **@com.mgmtp.a12.widgets/react-virtualized-fork@10.0.0** is no longer needed.

  ```tsx
  // BEFORE
  import { InfiniteLoader, List as ReactVirtualizedList } from "@com.mgmtp.a12.widgets/react-virtualized-fork";

  // AFTER
  import { InfiniteLoader, List as ReactVirtualizedList } from "react-virtualized";
  ```

### Other breaking changes

- **Table, Tree Table:**
  - During drag and drop event, the dragging row rendered by the new preview layer is rendered as the direct child of the Table Body.
    - For example, assuming MyCustomBodyRow read values from `MyContextProvider`.
      ```tsx
      // BEFORE
      <TableBody>
      	// ... Few levels below
      	<MyContextProvider value={myValue}>
      		...
      		<MyCustomBodyRow></MyCustomBodyRow>
      	</MyContextProvider>
      </TableBody>
      ```
    - The context provider now should be moved up, preferably mounted as the parent of TableBody, which make sure the dragging row always have access to the context.
      ```tsx
      // AFTER
      <MyContextProvider value={myValue}>
      	<TableBody>
      		...
      		<MyCustomBodyRow></MyCustomBodyRow>
      	</TableBody>
      </MyContextProvider>
      ```
- **TabSandbox:** `referenceElementContainer` is removed, since it has no use in the new refactoring.
- **Menu:**
  - menu/main/template/menu.tpl.view.tsx: `MainMenu` component has been renamed to `MainMenuTpl`
- **Popup Menu:**
  - To support accessibility, the popup menu now features a new design that includes a visible close button for improving navigation with screen readers on mobiles and tablets.
  - To revert to the previous design for all popup menus, wrap the application under the `PopupMenuConfigContext`. It is not recommended to wrap the context around a specific popup menu for consistency reasons, but it is possible.
    ```tsx
    <PopupMenuConfigContext.Provider value={{ enableA11YMobileDesign: false }}>...</PopupMenuConfigContext.Provider>
    ```
- **Text Output:** By default, the **Text Output** content is now wrapped by paragraph tags for improved semantics. A `disableParagraphWrapping` property has also been introduced for situations where this default behavior may not be desired (such as when working with block level elements).
- **Button:** A significant upgrade has been made to the `invert` **icon button** for a better look.
  - The `withBackground` property is no longer needed because the inverted icon button's appearance now varies depending on its type (**regular**, `primary`, `secondary`, and `active`). Therefore, the set of theme configurations `button.invertIcon.withBackground` is completely eliminated.

    To achieve the same light background as before, use these configuration keys:
    - `invertIcon.background`
    - `invertIcon.activated.background`
    - `invertPrimary.background`
    - `invertSecondary.background`

  - Some other new configuration keys are added for the `button`:
    - `invertIcon`
      - `activated.borderRadius`
      - `activated.interaction.focus.outline`
      - `interaction.focus.outline`
    - `iconButton`, `primary`, `secondary`, `vertical`, `invertPrimary`, `invertSecondary`:
      - `interaction.focus.outline`

  **Changes in other affected widgets:**
  - **Content Box:**
    - The `onBackButtonClicked` property of the **BackButton** and the `onCloseButtonClicked` property of the **CloseButton** have been deprecated. Instead, use the `onClick` property from the **Button** widget directly.
    - Introduce new elements `ActionButton` and `HeadingActionButton` for additional actions.
    - The built-in elements below will ensure the buttons displayed in the Content Box's header match the expected contrast:
      - `ContentBoxElements.CloseButton` to display a close button.
      - `ContentBoxElements.BackButton` to display a navigation button.
      - `ActionButton` or `HeadingActionButton` to display an additional action button in the Content Box's header. The difference between them is the `ActionButton` is a single button, meanwhile the `HeadingActionButton` is an addon that contains the `ActionButton`.
  - **Date Picker, Time Picker, Date Time Picker:**
    - The built-in element `PickerHeaderButton` is recommended to render an additional action button in the picker header. Some theme configuration keys are added for the customization (`dateTimePicker.headerActionButton`):
      - `background`
      - `color`
      - `interaction`
        - `active`, `hover`
          - `background`, `border`, `borderColor`, `color`
        - `focus`
          - `background`, `border`, `borderColor`, `color`, `outline`
    - Some configuration keys of the `datePicker.navButton` are removed (`active`, `focus`, `hover`: `background`). Use the keys of `dateTimePicker.headerActionButton` listed above as an alternative.
    - Besides, the `PickerHeaderCloseButton` and `PickerHeaderNavButton` are recommended to use if needed.
  - Depending on themes, the type of the icon button should be adjusted if it is used **externally** with the widget that has a dark or a light background.

    Below is how the **Collapsible Panel** adapts to the new change:

    ```tsx
    // BEFORE
    <CollapsiblePanel
      addons={
      	<CollapsiblePanelElements.Addon>
      	  <Button
              invert // inverted button in all themes
              icon={<Icon>get_app</Icon>}
            />
          </CollapsiblePanelElements.Addon>
      }
    >
      Content
    </CollapsiblePanel>

    // AFTER
    <CollapsiblePanel
      addons={
      	<CollapsiblePanelElements.Addon>
      	  <Button
              invert={isDefaultTheme} // inverted button only in the default theme. In flat theme, it is a normal button
              icon={<Icon>get_app</Icon>}
            />
          </CollapsiblePanelElements.Addon>
      }
    >
      Content
    </CollapsiblePanel>
    ```

- **Message Color:**
  - The appearance of the `warning` variant is adjusted to improve contrast. This includes changes to the color and type of the warning icon. These adjustments are primarily done by widgets. However, some widgets require an icon to be passed in, therefore, the warning icon shown in the code below is recommended for use.

    This is an example to get the desired `warning` **Status** that meets the contrast:

    ```tsx
    // BEFORE
    <Status variant="warning" icon={<Icon>warning</Icon>} />

    // AFTER
    <Status variant="warning" icon={<Icon iconTheme="outlined">warning_amber</Icon>} />
    ```

  - Additional Changes:
    - Besides the regular and light colors, a dark color has been introduced for each variant. This change is intended for the **warning** variant, with its dark color being darker than the regular color, while the other variants' dark color remains the same as the original color.
      - `variant.errorColorDark`
      - `variant.infoColorDark`
      - `variant.successColorDark`
      - `variant.warningColorDark`
    - Each variant now has its own text color:
      - `variant.text.error`
      - `variant.text.info`
      - `variant.text.success`
      - `variant.text.warning`
    - The theme configuration keys of some components have been removed:
      - `components`
        - `badge`: `color`
        - `globalMessageBox`: `graphic.color`, `text.color`
        - `modalNotification`: `closeButton.color`, `errorBG`, `infoBG`, `successBG`, `warningBG`, `icon.color`, `titleColor`
        - `toast`: `variantIcon.color`
        - `validationBar`:
          - `background`
          - `graphic`: `background`, `color`
          - `mobile`: `graphic.color`, `icon.color`, `overview.background`, `overview.right.color`
          - `title.color`
        - `status`:
          - `variant`: `color`, `lightBackground`, `lightColor`
    - Several new variants have been added, enabling customization of the element according to specific variants:
      - `components`
        - `chat`:
          - `notification.content.variant.text`: `error`, `info`, `success`, `warning`
        - `fileUpload`:
          - `uploaded.borderColor`: `error`, `info`, `warning`
          - `icon.variant`: `error`, `info`, `warning`
          - `icon.additional.variant`:
            - `error`, `info`, `warning`
            - `text`: `error`, `info`, `warning`
          - `item.horizontal.badge.backgroundColor.warning`
        - `globalMessageBox`:
          - `variant.text`: `error`, `info`, `success`, `warning`
        - `modalNotification`:
          - `closeButton.color`: `error`, `info`, `success`, `warning`
          - `variant`: `error`, `info`, `success`, `warning`
          - `variant.text`: `error`, `info`, `success`, `warning`
        - `toast`:
          - `variantIcon`: `error`, `info`, `success`, `warning`
        - `tooltip`: `warning.contentColor`
        - `validationBar`
          - `variant`:
            - `error`, `info`, `warning`
            - `text`: `error`, `info`, `warning`

- **Status:** The deprecated `light` property has been removed. The alternative way to customize the Status is by using the theme variables.

  ```tsx
  import { ThemeProvider, useTheme } from "styled-components";
  import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/create-theme";

  const customTheme = () => {
  	const statusConfigs: DeepPartial<StatusConfigType> = {
  		text: {
  			color: { warning: colors.text.color }
  		},
  		icon: {
  			color: { warning: colors.variant.warningColorDark }
  		}
  	};

  	return createTheme({
  		components: { status: statusConfigs }
  	});
  };

  <ThemeProvider theme={customTheme}>
  	<Status variant="warning" icon={<Icon>warning</Icon>}>
  		Warning
  	</Status>
  </ThemeProvider>;
  ```

## 36.0.0

- **Date Picker, Date Time Picker:**
  - Some changes of `datePickerProps` (DatePicker) and `pickerProps` (DateTimePicker):
    - Some properties have been renamed:
      - `disabledDays` to `disabled`

        ```tsx
          import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

          // BEFORE
          <DatePicker disabledDays={[{ daysOfWeek: [0, 6] }]} />

          // AFTER
          <DatePicker disabled={[{ dayOfWeek: [0, 6] }]} />
        ```

      - `selectedDays` to `selected`

        ```tsx
          import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

          // BEFORE
          <DatePicker selectedDays={[new Date()]} />

          // AFTER
          <DatePicker selected={[new Date()]} />
        ```

      - `showWeekNumbers` to `showWeekNumber`

        ```tsx
          import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

          // BEFORE
          <DatePicker showWeekNumbers={true} />

          // AFTER
          <DatePicker showWeekNumber={true} />
        ```

      - `firstDayOfWeek` to `weekStartsOn`

        ```tsx
          import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

          // BEFORE
          <DatePicker firstDayOfWeek={0} />

          // AFTER
          <DatePicker weekStartsOn={0} />
        ```

      - `initialMonth` to `defaultMonth`

        ```tsx
          import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

          // BEFORE
          <DatePicker initialMonth={new Date()} />

          // AFTER
          <DatePicker defaultMonth={new Date()} />
        ```

      - `onWeekClick` to `onWeekNumberClick`

        ```tsx
          import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

          const handleClick = (weekNumber: number, dates: Date[], e: React.MouseEvent): void => {
            // Your logic here.
          }

          // BEFORE
          <DatePicker onWeekClick={handleClick} />

          // AFTER
          <DatePicker onWeekNumberClick={handleClick} />
        ```

    - Some properties have been removed: `localeUtils`, `tabIndex`, `containerProps`, `onBlur`, `onFocus`, `onKeyDown`, `onTodayButtonClick`, `onCaptionClick`, `onDayMouseUp`, `onDayMouseDown`, `renderDay`, `renderWeek`, `enableOutsideDaysClick`, `todayButton`, `showWeekDays`, `weekdayElement`, `weekdaysLong`, `weekdaysShort`, `navbarElement`, `captionElement`, `canChangeMonth` (use `disableNavigation` instead)
    - Types of the [labels](https://react-day-picker.js.org/api/type-aliases/Labels), [classNames](https://react-day-picker.js.org/api/type-aliases/ClassNames) properties have been changed
    - Use the `components` property to customize built-in components. There are some useful hooks:
      - `useDayPicker` - to get the props passed to Date Picker/Date Time Picker
      - `useNavigation` - to navigate between months and years
      - `useDayRender` - useful to render the day cell from a custom Day component
      - `useFocusContext` - handle the focus between elements
      - `useActiveModifiers` - to get the modifiers applied to a day
    - `DatePickerModifier` is removed - use `Matcher` directly from **react-day-picker** instead. `daysOfWeek` Matcher has been renamed to `dayOfWeek`.

      ```tsx
        import { DateInput as DateInputWidget } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

        // BEFORE
        <DateInput
          datePickerProps={{
            disabledDays: [{ daysOfWeek: [0, 6] }],
          }}
        />

        // AFTER
        <DateInput
          datePickerProps={{
            disabled: [{ dayOfWeek: [0, 6] }],
          }}
        />
      ```

  - `DateTimeUtils.isRangeModifier` is changed to `DateTimeUtils.isRangeMatcher`.

    ```tsx
    import { DateTimeUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils";

    // BEFORE
    DateTimeUtils.isRangeModifier(value);

    // AFTER
    DateTimeUtils.isRangeMatcher(value);
    ```

  - Some updates of styling:
    - `datePicker.weekday.margin` is replaced by `datePicker.weekday.padding`
    - `datePicker.weekday.size` is replaced by `datePicker.weekday.width`
    - `datePicker.weekdaysRow.padding` is removed
    - `datePicker.body.horizontalCellSpacing` and `datePicker.body.verticalCellSpacing` are added to support spacing configuration between day cells.
    - `dateTimePicker.dateScreen.datePicker.weekdaysRow` is removed and replaced by `weekDay`
  - When a modifier matches a specific day, its day cell will not receive the modifier's name as a CSS class anymore. Please use `modifiersClassNames` and `modifiersStyles` to change the className and the inline-style of the corresponding cells.

    ```tsx
      import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

      const bookedDays = (day: Date): boolean => {
          return day.getDate() === 23;
        };

      // BEFORE
      <DatePicker
        modifiers={{ booked: bookedDays }}
      />

      // AFTER
      <DatePicker
        modifiers={{ booked: bookedDays }}
        modifiersStyles={{ booked: { border: "2px solid currentColor" } }}
        modifiersClassNames={{ booked: "booked-classname" }}
      />
    ```

  - When using Tab with Date Picker/Date Time Picker, the focus of the day will be in order of priority: selected day => today => first day of the current month.
  - **date-fns** library that is used by new `react-day-picker` is pretty heavy if the used locales are not cherry-picked. To only include the necessary locales, you can use Webpack ContextReplacementPlugin. Please refer to https://github.com/date-fns/date-fns/blob/main/docs/webpack.md for more information.

- **Moment.js and Moment-Timezone have been replaced with Day.js**
  - The `formatTimezoneDateTime` utils function now takes an object as an argument instead of 4 separate parameters. While before we may have written, `formatTimezoneDateTime(date, timezone, dateTimeFormat, locale)`, we would now write
    `formatTimezoneDateTime({ date, timezone, dateTimeFormat, locale })`. This reduces issues caused from unintentional omissions and mis-orderings.
  - While [Day.js](https://day.js.org/) is significantly lighter than **Moment.js**, using **Day.js** will often require you to extend the library with **Day.js** plugins to replicate functionalities that were previously immediately available via **Moment.js**. UTC support for example requires extending **Day.js** with `dayjs/plugin/utc`.

### Deprecation

- **Flyout Menu:** The `disableCondensing` property has been deprecated.

## 35.0.0

### Breaking Changes

- **Button:** Styling config system has been refactored, introducing new config options for customizing interaction behavior for each variant of button.
- **Master Detail:** remove Master Detail layout view navigation bar
  - Remove `hideNavigationOptions`, `navigationElementId`, `viewSelectionPlaceholder`, `onSelectMinimizedView`, `minimized` properties.
  - Remove `MinimizedView` interface.
  - Remove variables styles `{panesMinimized: { margin: string; minWidth: string; respMargin: string; respPadding: string; width: string }}`

  ```tsx
    import { MasterDetail } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/master-detail";

    // BEFORE
    <MasterDetail
      title="Master Detail Layout"
      minimized={minimizedViews}
      visibleViews={visibleViews}
      animation={{
      enabled: this.state.enableAnimation,
      animateSingleItem
      }}
      navigationElementId="navigation"
      onSelectMinimizedView={(view): void => {
      this.gotoView((view as any).view);
      }}
      viewSelectionPlaceholder="SELECT COMPONENT TO SHOW"
      onSizeChange={this.handleWindowSizeChanged}
    />

    // AFTER
    <MasterDetail
      title="Master Detail Layout"
      visibleViews={visibleViews}
      animation={{
        enabled: this.state.enableAnimation,
        animateSingleItem
      }}
      onSizeChange={this.handleWindowSizeChanged}
    />
  ```

- Switch to a forked version of react-virtualized (new name: **@com.mgmtp.a12.widgets/react-virtualized-fork@10.0.0**) to allow installing with newer npm version without error.
- **Time Picker:** `onValidationError(value)` has been removed, introducing new `onValidate({value, valid})` property with these params.
  - `value`: value after typing
  - `valid`: result of that value is valid or not

  ```tsx
  import { useCallback } from "react";

  import { TimePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/time-picker";

  // BEFORE
  const onValidationError = useCallback((value: string): void => {
  	// Your logic here.
  }, []);

  <TimePicker onValidationError={onValidationError} />;

  // AFTER
  const onValidate: TimePickerProps["onValidate"] = useCallback(({ value, valid }) => {
  	// Your logic here.
  }, []);

  <TimePicker onValidate={onValidate} />;
  ```

- **Native Select:** remove `onSelect` property
- **Link:** make the distinction between the `Link` and HTML attributes by introducing the new properties
  - `linkAttributes` contains and allows access to the HTML attributes
  - `href` the linked document, resource, or location
  - `title` title of the link
  - `target` where to open the linked document
  - `onClick` handle event when clicking on the link

  ```tsx
    import { Link } from "@com.mgmtp.a12.widgets/widgets-core/lib/link/main/link/link.view";

    // BEFORE
    <Link disabled={true} />

    // AFTER
    <Link linkAttributes={{ "aria-disabled": "true" }} />
  ```

- **File Upload:** Type of property `onUploadAreaClick` in `FileUploadProps` and `DefaultFileUploadProps` is changed from `boolean | undefined` to `boolean | void`.

  ```tsx
  import { Checkbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox";
  import { DefaultFileUpload } from "@com.mgmtp.a12.widgets/widgets-core/lib/file-upload";

  // BEFORE
  const onUploadAreaClick = (): boolean | undefined => {
  	// Your logic here.
  };

  <DefaultFileUpload id="click-event" label="With Click event" onUploadAreaClick={onUploadAreaClick} />;

  // AFTER
  const onUploadAreaClick = (): boolean | void => {
  	// Your logic here
  };

  <DefaultFileUpload id="click-event" label="With Click event" onUploadAreaClick={onUploadAreaClick} />;
  ```

## 34.0.0

### Breaking Changes

- **styled-component replaced Stylus as A12 styling solution**

  This is the biggest breaking change in the release, and therefore deserved its own chapter. Please have a look at this [link](#/get-started/migration-instructions/migration-to-styled-components)
  for more details.

- **Button:** The different properties used to create a button on a dark background (invert, outline, light, dark) is now unified to `invert`.
  - Previously the `light` and `dark` properties were used to create an inverted icon button with a rounded background or a square shape respectively. This doesn't make sense with different theme we have. Now, use `invert` to make the button standout from the background. It will have the square shape by default. Use withBackground to add the rounded background that was included previously with the light button.

  ```tsx
    import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";

    // BEFORE
      // Dark button
      <Button
        icon={<Icon>get_app</Icon>}
        title="Download"
        dark
      />

      // Light button
      <Button
        icon={<Icon>close</Icon>}
        title="Close"
        light
      />

    // AFTER
      // Dark button
      <Button
        icon={<Icon>get_app</Icon>}
        title="Download"
        invert
      />

      // Light button
      <Button
        icon={<Icon>close</Icon>}
        title="Close"
        invert
        withBackground
      />
  ```

  - The outline secondary button has been change to `invert secondary`.

  ```tsx
    import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";

    // BEFORE
    <Button
      icon={<Icon>close</Icon>}
      title="Close"
      outline
      secondary
    />

    // AFTER
    <Button
      icon={<Icon>close</Icon>}
      title="Close"
      invert
      secondary
    />
  ```

  - The invert primary button stay unchanged.

- **ContentBox:**
  - `ContentBoxElements.Breadcrumb` has been removed.
  - `BackButtonProps` and `CloseButtonProps` has been moved from `contentbox.tpl.view` to `contentbox.tpl.api`.

- **Date Picker:**
  - `Datepicker` has been renamed into `DatePicker`.
  - Due to [issue with specificity](https://styled-components.com/docs/advanced#issues-with-specificity), modifying the styles would require to bump up the specificity.

  ```tsx
  // BEFORE
  import { Datepicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";

  // AFTER
  import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker";
  ```

- **Layout Grid:** `LayoutGridContextType` has been moved into `LayoutGridProps`. Usage: `LayoutGridProps.GridContextType`.

  ```tsx
  import { useContext } from "react";

  import { LayoutGrid, LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid";

  // BEFORE
  const oldLayoutGridContext = useContext<LayoutGrid.LayoutGridContextType>();

  // AFTER
  const newLayoutGridContext = useContext<LayoutGridProps.LayoutGridContextType>();
  ```

- **List:** `List.Divider` component has been removed, please use the new `divider` prop of the `List.Item` component instead.

  ```tsx
  import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list";

  // BEFORE
  return (
  	<List>
  		<List.Item text="List Item" />
  		<List.Item text="List Item 1" selected />
  		<List.Item text="List Item 2" />
  		<List.Divider />
  		<List.Item text="List Item 3" />
  	</List>
  );

  // AFTER
  return (
  	<List>
  		<List.Item text="List Item" />
  		<List.Item text="List Item 1" selected />
  		<List.Item text="List Item 2" divider />
  		<List.Item text="List Item 3" />
  	</List>
  );
  ```

- **Menu:** `mainMenu` has been removed, introducing new `useAs` property.
  `useAs` has now replaced the `mainMenu` property and allows to customize the `Menu` with `mainMenu` styles or `tabNavigation` styles.

  ```tsx
  import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";

  // BEFORE
  return <FlyoutMenu type="horizontal" items={items} className="-u-width-full" mainMenu />;

  // AFTER
  // Display the main menu
  return <FlyoutMenu type="horizontal" items={items} className="-u-width-full" useAs="main" />;

  // In case you want the menu to be displayed as Tab Navigation
  return <FlyoutMenu type="horizontal" items={items} className="-u-width-full" useAs="tabNavigation" />;
  ```

- **Mobile Validation Bar:** `hasBackground` for Graphic has been removed.

- **Modal Overlay:** `gutter` has been removed, introducing new `noGutter` property.

  `ModalOverlay`, except for the ones with `fullscreen`, has been having gutter styles even with `gutter` passed in or not.

  Now all of them will have gutter styles by default, and could have the gutter removed by using `noGutter`.

- **ResizeAndDragContainer:** `[key: string]: any` from `ResizeAndDragContainerProps` that allow passing properties with wrong key has been removed.

- **Table:** `Column.Width` type becomes **number** instead of the union of numbers from **0.1** to **4.0**. It accepts any positive number up to 01 decimal place.

  ```ts
  // BEFORE
  type Width =
  	| 0.1
  	| 0.2
  	| 0.3
  	| 0.4
  	| 0.5
  	| 0.6
  	| 0.7
  	| 0.8
  	| 0.9
  	| 1
  	| 1.1
  	| 1.2
  	| 1.3
  	| 1.4
  	| 1.5
  	| 1.6
  	| 1.7
  	| 1.8
  	| 1.9
  	| 2
  	| 2.1
  	| 2.2
  	| 2.3
  	| 2.4
  	| 2.5
  	| 2.6
  	| 2.7
  	| 2.8
  	| 2.9
  	| 3
  	| 3.1
  	| 3.2
  	| 3.3
  	| 3.4
  	| 3.5
  	| 3.6
  	| 3.7
  	| 3.8
  	| 3.9
  	| 4;

  // AFTER
  type Width = number;
  ```

- **Text Line Tpl:** `selection` property used to add an arrow icon suffix has been removed, please use the new `SelectionSuffix` component instead.

  ```tsx
  import { TextLineStateless } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line";
  import { SelectionSuffix } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/base/template/base.tpl.view";

  // BEFORE
  return <TextLineStateless selection />;

  // AFTER
  return <TextLineStateless suffixes={<SelectionSuffix />} />;
  ```

### Deprecation

- **ContentBox:** `tile` property has been deprecated. Please use `Tile` widget instead.

  ```tsx
  import { ContentBox, Tile } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox";

  // BEFORE
  return <ContentBox tile>{props.children}</ContentBox>;

  // AFTER
  return <Tile>{props.children}</Tile>;
  ```
