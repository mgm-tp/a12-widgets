## 39.0.2

### Fixed

- **Table, Tree Table:** Reverted the `useSyncExternalStore`-based rewrite of the internal context-selector implementation (`createContext` / `useContextSelector`) introduced in 39.0.1, which broke drag-and-drop in the Tree Table. The scheduler-based listener implementation is restored. The public API is unchanged.

## 39.0.1

### Breaking Changes

- **`DataTable`, `DataTreeTable` and `TreeView` moved to a dedicated `/experimental` entry point.** These recently introduced components (and all of their related types/helpers) are no longer exported from the package root. Import them from `@com.mgmtp.a12.widgets/widgets-core/experimental` instead.

  This isolates `@atlaskit/pragmatic-drag-and-drop` (the drag-and-drop engine behind these components) out of the main module graph. Its `exports` subpaths fail to resolve as directory imports under Node ESM in some consumer environments (`Directory import '.../pragmatic-drag-and-drop/element/adapter' is not supported`); keeping these components on a separate entry means importing the package root never pulls pragmatic-drag-and-drop in.

  ```tsx
  // Before
  import { DataTable, TreeView } from "@com.mgmtp.a12.widgets/widgets-core";

  // After
  import { DataTable, TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
  ```

## 39.0.0

### Breaking Changes

- **Package exports enforced:** `widgets-core` and `widgets-utils` now have strict `exports` fields. Deep `lib/` imports are blocked. Use top-level barrel imports instead.
- **CSS entry points moved:** `lib/theme/basic.css` → `styles/basic.css`, `lib/rich-text-editor/main/themes/rich-text-editor.css` → `styles/rich-text-editor.css`.
- **Type augmentation paths moved:** `lib/@types/*` → `types/*`. Update `tsconfig.json` types arrays (e.g. `@com.mgmtp.a12.widgets/widgets-core/types/styled-components`) or use `/// <reference types="@com.mgmtp.a12.widgets/widgets-core/types/styled-components" />`.
- **Renamed TextLine to TextField:** All "TextLine" public APIs have been renamed to "TextField":
  - `TextLineStateless` → `TextField`
  - `TextLineStatelessProps` → `TextFieldProps`
  - `DataRoles.Textline` → `DataRoles.TextField` (data-role values changed from `textline-*` to `text-field-*`)
  - Theme config key `theme.components.textLine` → `theme.components.textField`
  - `TextLineConfigType` → `TextFieldConfigType`, `textLineConfig` → `textFieldConfig`
- **Removed deprecated APIs** from 38.2.0:
  - `IconPicker` → `IconPickerTitles` (a11y localization key, not the component)
  - `Tooltip` → `TooltipPlugin` (Rich Text Editor plugin, not a general tooltip)
  - `TooltipProps` → `TooltipPluginProps` (Rich Text Editor plugin)
  - `TooltipWrapperProps` → `TooltipPluginWrapperProps` (Rich Text Editor plugin)
  - `commonTileConfigs` → `commonInteractiveTileFlatConfigs` (flat theme config)
  - `BodyCell` → `TreeTableBodyCell`
  - `BodyContent` → `TreeTableBodyContent`
  - `walk` → `walkTreeNode`
  - `DeepPartial` (theme) removed in favor of `DeepPartial` from top level
- **Rich Text Editor:** Upgraded Lexical editor from 0.31.2 to 0.44.0. Replaced internal property access (`__text`, `__checked`) with public getters, adopted the `updateFromJSON` deserialization pattern, and removed unused `ltr`/`rtl` theme classes.
- **Icon:** Migrated from Material Icons to Material Symbols. The icon font system now uses Material Symbols variable fonts (`Material Symbols Outlined` and `Material Symbols Rounded`) instead of the legacy static Material Icons fonts (`Material Icons`, `Material Icons Outlined`, `Material Icons Round`). The `IconTheme` type and all icon ligature names remain unchanged — no breaking changes to the public API. The `filled` theme now uses the `FILL` axis of the Material Symbols Outlined variable font. The icon data list (`MATERIAL_ICONS`) has been updated to include the full Material Symbols icon set (~3840 icons, up from ~1500). The variable fonts are optimized via axis pinning (unused axes GRAD, opsz, wght are fixed at their default values), reducing the combined font size from ~8.7 MB to ~954 KB.
- **Custom Select, Native Select:** Omit the `useCustomView` property.
- **Tooltip:** The element wrapping the trigger has been renamed from `StyledTooltipWrapper` to `StyledTooltipTriggerWrapper`, and its `data-role` has changed from `"tooltip"` to `"tooltip-trigger-wrapper"`. This resolves an ambiguity where the trigger wrapper and the tooltip bubble (`StyledTooltipContainer`) shared the same `data-role`.
- **Year Selector:**
  - The `variant` property (`autocomplete` | `select` | `textbox`) controls the rendering mode. Previously the component always rendered as a native `<select>`. When `variant` is not specified, it defaults to `autocomplete` if `yearRange` is provided, or `textbox` otherwise. Pass `variant="select"` to preserve the previous behavior.
  - `YearRange.start` and `YearRange.end` are now optional (`number | undefined`). Null-checks are required when reading these fields.
- **Year Month Selector:** The new `yearSelectorVariant` property (`autocomplete` | `select` | `textbox`) controls the rendering mode of the embedded year selector, following the same defaulting logic as `YearSelector` above.
- **Switch:** The switch thumb icon colors have been updated to ensure they are always visible by two new theme configuration keys `switch.thumb.checkedIconColor` and `switch.thumb.uncheckedIconColor`.

### New Features

- **Tab Panel Template:**
  - Introduce `GroupTabProps` interface in `TabPanelTemplateProps` to define grouped tab structures.
  - Introduce the `label` property on `TabProps` to display a tab's label in the mobile sub-tablist.
- **Tab Panel:** Extend the `tabs` property to accept `GroupTabProps[]`, enabling tab grouping within the panel.
- **ApplicationHeader:** Introduce the `role` property to allow customizing the ARIA role on the element.
- **Keyboard Navigation:** Introduce `KeyboardNavigationConfigProvider` and `KeyboardNavigationMode` for application-wide arrow key navigation configuration.
  - `"default"` mode (the default): both Tab and arrow keys navigate within a component — this is the existing behaviour plus arrow key support.
  - `"arrow-only"` mode: only arrow keys navigate within a component; Tab moves focus to the next component outside.
  - The following widgets now respond to the keyboard navigation mode: Pop-up Menu, Tab Panel (sub tablist), Flyout Menu (horizontal and vertical), Sliding Menu, Tree, Button Group Container, Quick Access Button, File Upload, Rich Text Editor, Typography, Comment, Validation Bar.
- **TabSandbox:** Introduce the `disableTabTrapping` property to allow Tab focus to leave the sandbox naturally. Use in `"arrow-only"` keyboard navigation mode.
- **FileUpload:** Introduce the `disableFocusRestore` property to disable automatic focus restoration to the upload area after a file upload completes or loading finishes. This is useful when focus is managed programmatically by the consuming application.
- **DateTimeContext:** Introduce the `timeMode` to `DateTimeContextType` to allow setting the clock mode (`"12h"` or `"24h"`) globally via context. All datetime components (`TimePicker`, `DateTimePicker`, `DateTimePickerTimeInput`) now consume this context value, falling back to `"12h"` when not specified. A component's `mode` or `timeMode` property always takes precedence over the context value.
- **Table, TreeTable:** Introduce the `enableColumnGroupA11y` property to restructure column group headers into separate CSS Grid rows. This improves screen reader compatibility (e.g. NVDA) for multi-level column groups by adding `aria-colspan`, `aria-rowspan`, `aria-colindex`, `scope`, and `aria-rowindex` attributes while maintaining the same visual appearance.
- **Year Selector:**
  - Introduce the `variant` property (`autocomplete` | `select` | `textbox`) to control the rendering mode.
  - Introduce the `placeholder` property to display hint text when no year is selected. Selecting the placeholder invokes `onYearChange` with `undefined`, enabling unset state without needing `optionalItem`.
  - `yearRange` now accepts a `RelativeYearRange` (`{ startOffset?: number; endOffset?: number }`) for ranges relative to the currently selected year, or today when no year is selected. Both `AbsoluteYearRange` and `RelativeYearRange` support single-bound ranges.
  - Introduce the `autocompleteHintTemplate` property to configure the hint text shown in the autocomplete dropdown. Only applies when `variant="autocomplete"`.
- **Year Month Selector:**
  - Introduce `yearSelectorVariant` property to control the rendering mode of the embedded year selector (`autocomplete` | `select` | `textbox`).
  - Introduce `yearPlaceholder` property to set a placeholder on the embedded `YearSelector`.
  - Introduce `onYearSelectorBlur` callback, invoked when the embedded year selector loses focus (applies to `textbox` and `autocomplete` variants).
  - `yearRange` now accepts a `RelativeYearRange` (`{ startOffset?: number; endOffset?: number }`) and supports single-bound ranges, matching the `YearSelector` API.
- **Date Picker:**
  - Introduce `yearSelectorVariant` property to control the rendering mode of the year selector in the picker header (`autocomplete` | `select` | `textbox`). Defaults to `autocomplete` when `yearRange` is provided, `textbox` otherwise.
  - Introduce `onYearSelectorBlur` callback, fired when the year input inside the picker header loses focus (useful for inline validation).
  - Introduce `yearErrorMessage` property to display a validation error message below the picker header when the textbox year variant is active.
- **Dropdown:** Introduce the `labelRenderer` property on to enable custom rendering of all dropdown item labels.
- **Custom Select:** Introduce the `labelRenderer` property to enable custom rendering of the selected value display in the input field and dropdown item labels. This works with the DropDown's `labelRenderer` to maintain visual consistency between dropdown items and the selected input value.
- **Filter:**
  - Introduce the `compact` property to enable a compact display mode. When enabled and options are present, only the options are displayed and the filter name is moved to an interaction hint.
  - Introduce the `prefix` property to display a custom icon or text before the filter content.
  - Introduce the `onFocus` callback that is fired when the filter receives focus.
- **Filter Bar:**
  - Introduce the `compact` property to enable a compact display mode. When enabled, the filter bar renders in a single row. Any filters that don’t fit are hidden and moved into the Filter Selector.
  - Introduce the `onHiddenFiltersChange` property to provide indices of filters that are currently hidden.
  - Introduce the `useFilterFocusManagement` hook to manage focus within the filter bar and filter selector when filters are moved between the filter bar and the filter selector.
  - The `actions` property is now available in desktop mode. Previously it was only applicable in the mobile variant.
- **Filter Selector:** Introduce `FilterSelectorListModeProps` to support a new list mode, which renders filters as a collapsible list (e.g., inside a Content Box side panel) instead of an attached-portal popup. Supports flat items, grouped sections, custom header/footer content, action bar, and a `customFilterList` slot to replace the built-in list entirely.
- **Content Box:**
  - Introduce the `sidePanels` property to allow users to display custom side panels on the left or right, supporting both `overlay` and `docked` modes.
    - Introduce the `onClose` callback on the side panel configuration to handle closing the panel when the user clicks outside while in overlay mode.
    - Introduce the `triggerReference` property on the side panel configuration to reference the element that triggered the panel open.
- **Supporting Panes Layout:** Introduce the `customAnimation` configuration on the secondary pane to override the default animation with custom `paneVariants` and `contentVariants`.
- **Typography:**
  - Introduce the `headerActions` property on `HeadlineProps` to display custom action buttons or icons in the panel header, rendered with proper hover and focus states.
  - Introduce the `compact` property on `HeadlineProps` to enable a compact display mode with no background colors and only a border on hover and focus.
  - Provide compact mode configuration keys (`activeBackgroundColor`, `activeBoxShadow`, `hoverBackgroundColor`, `hoverBoxShadow`) in the theme to allow customization of compact mode styles.
  - Introduce the `onFocus` callback on `SectionProps` to handle redirecting focus to a fallback element when the currently focused element becomes hidden due to a layout change.
- Publish `date-time-picker.internal.tsx` by renaming it to `date-time-picker.tpl.view.tsx`.
- **Rich Text Editor:** [A11Y]
  - The label, placeholder, info/warning/error messages, and helper text will be read when the editor is focused.
  - The screen reader reads that the editor is multiline.
  - In readonly mode, the editor will be focusable and readable by the screen reader when it has content. The content of the editor will be accessible to the screen reader in browse mode.
  - In disabled mode, the editor is not focusable. The content of the editor will be accessible to the screen reader in browse mode.
  - Strikethrough text is now implemented using the <s> tag.
- **Switch:**
  - Introduce the `labelPosition` property to control where the label appears relative to the switch control.
  - Introduce the `checkedIcon` and `uncheckedIcon` properties to allow replacing the default thumb icons with custom elements.
- **Icon:** [A11Y] Introduce the `hiddenText` property to allow users to define the content of the hidden text.
- **Base Theme:** Introduced `getBaseTheme()` — a new theme factory replacing `getFlatTheme` and `getFlatCompactTheme` (its visual style matches the flat theme). Default spacing is 12px (matching flat-compact). For standard desktop spacing, pass `getBaseTheme({ spacing: { base: 16 } })`. The `default` and `compact` themes are deprecated and will be removed in a future release with no replacement — their visual style is not carried forward.
  - `getBaseTheme(opts?)` — factory function
  - `baseTheme` — pre-built default constant
  - `baseThemeColors`, `generalPalette`, `buildSemanticColors` — color building blocks for custom themes
  - Types: `BaseThemeConfig`, `BaseThemeColors`, `BaseThemeCore`, `BaseThemeHoverStyles`, `BaseThemeOptions`, `SpacingOverrides`, `TypographyOverrides`
- **Quick Theme:** Introduced `getQuickTheme()` / `buildQuickThemeOptions()` — a convenience layer above `getBaseTheme()`. Accepts a flat `QuickThemePalette` with intent-named keys (`primary`, `surface`, `pageBackground`, `border`, `textPrimary`, state colors). Missing palette variants are auto-derived from `primary` via HSL transforms.
  - `getQuickTheme(input)` — returns `BaseThemeConfig`
  - `buildQuickThemeOptions(input)` — returns `BaseThemeOptions` for further composition
  - Types: `QuickThemeOptions`, `QuickThemePalette`
- **Theme Schema:** New public types added to the theme schema:
  - `BorderConfig`, `BorderWidth`, `BorderRadius` — border token shapes; `BorderRadius` gains a new `xs` (`1px`) step for hairline-radius use cases.
  - `MotionConfig` — animation and transition token shape.
  - `OpacityConfig` — opacity token shape.
- **Popup Menu:** `focusOnTriggerElementAfterClose` now supports `"onTab"` as a close reason. In `arrow-only` keyboard navigation mode, pressing Tab closes the popup and the new reason allows controlling whether focus is restored to the trigger element.

### Fixed

- **Modal Overlay:**
  - Unable to focus to the opening modal overlay with `fitToParent` by tab navigation.
  - [iOS] Text selection could not be dragged within input elements inside a modal overlay.
- **Popup Menu:** Focus back to the trigger element when open a modal from a menu item in popup menu.
- **Rich Text Editor:**
  - `mergeWithSibling` throwing a "sibling must be a previous or next sibling" error.
  - Deleting all text before formatted text causes the formatted text to change format unexpectedly.
  - "One or more transforms are endlessly triggering" error when deleting the space between a misspelled word and an adjacently styled word.
  - `addSelectedStyleName` does not work because the styled node merges with another node and loses the className.
- **Table:** Fix the issue with latest version of styled-components.
- **Table, Tree Table:** The internal context-selector implementation (`createContext` / `useContextSelector`) has been rewritten on top of React's `useSyncExternalStore`. This removes the dependency on the unsupported `scheduler` package APIs, makes context reads tear-free under concurrent rendering, and fixes selectors returning stale results when a consumer re-renders due to its own props before the next context update. The public API is unchanged.
- **Sliding Menu:** [Mobile] A rapid double-tap on a menu item containing a submenu causes the menu to disappear.
- **Text Area:** The suffix area overlaps the input when there is a scrollbar in the input.
- **Comment:** `combinedActionButton` element losing its right-alignment when reply comments are nested more than one level deep.
- **Icon Picker:** The dropdown does not stay aligned with the input when its height changes during search.
- **File Upload:** The content overflows its wrapper when File Upload is placed inside a parent element that has padding.

### Deprecation

- **`getFlatTheme` / `flatTheme`** — use `getBaseTheme({ spacing: { base: 16 } })` instead.
- **`getFlatCompactTheme` / `flatCompactTheme`** — use `getBaseTheme()` instead.
- **`createTheme()`** — use `getBaseTheme()` with options instead.
- **`getDefaultTheme` / `defaultTheme`** and **`getCompactTheme` / `compactTheme`** — deprecated and will be removed in a future release with **no replacement**; their visual style is not carried forward. Adopt `getBaseTheme()` to stay supported (expect a visual change to the flat style).
- **FileUpload:** The `$fileUploadSize` property in `StyledFieldUploadWrapper` has been deprecated.

## 38.3.5

### Fixed

- **Multiselect**
  - Infinite render loop when items is passed as object form.
  - Multiselect wrapped by a context value with a throwing getter fails to render when the `graphic` property contains a React element.
- **Popup Menu:** The focus restoration behavior inside `PopupMenu` could not be configured per close reason. To resolve this, `focusOnTriggerElementAfterClose` now accepts either a boolean or a configuration object, allowing focus restoration to be controlled separately for close reasons such as item clicks, outside clicks, ESC, SPACE, close button clicks and programmatic closes.

## 38.3.4

### Fixed

- **Table:** Revert the background placeholder layer introduced in 38.3.0 to prevent blank content during fast scrolling in infinite scroll table. The fix caused persistent placeholder rows when `rowCount` is smaller than the visible row capacity. To customize the background overlay, use the `style` in `overrideListProps` for the table container.

## 38.3.3

### Fixed

- **Tree:** `DOMRect` spread in `getIframeAdjustedReferenceRect` dropped `width`/`height` (accessor properties on the prototype), causing changing position on every scroll and close the portal.

## 38.3.2

### Fixed

- **Icon Picker:** Clicking the “View List” button opens an outdated URL.

## 38.3.0

### New Features

- Support accessibility:
  - **Typography:** Remove the default title value of `typographyTitles` to prevent redundant information being read by screen readers.
  - **Modal Notification, Callout, Comment Container:** Define the `aria-labelledby` attribute to support screen readers announce the header title when a portal or modal opens.
  - **Resize and Drag Container, Callout, Comment Container:** Introduce the `htmlAttributes` property to allow users to specify the HTML attributes of the main element.
  - **Modal Overlay, Modal Notification:** Introduce the `containerAttributes` property to allow users to specify the HTML attributes of the container element.
  - **Date Picker:** In **DateInput**, introduce `htmlAttributes` to `datePickerDialogProps` property to allow users to specify the HTML attributes of the mobile picker element.
  - **Time Picker, Date Time Picker:** Introduce the `desktopPickerAttributes` and `mobilePickerAttributes` properties to allow users to specify the HTML attributes of the picker element.
  - **Filter Selector:** The filter label in List Item is not read correctly by screen readers.
  - **Chat:** The screen jumps to the top of the container when the screen reader focuses on the hidden chat title.
  - **Tooltip:** Update the ARIA role from `role="dialog"` to `role="tooltip"` to align with the WAI-ARIA specification.
  - **Popup Menu:**
    - Remove the incorrect `role="dialog"` attribute.
    - Remove the default value of `focusOnOpenHiddenText` in `PopUpMenuTitles`.
  - **Flyout Menu:** Remove the incorrect `role="dialog"` attribute from the sub-menu container.
  - **Connected Toast:** Remove the incorrect `role="dialog"` attribute from the Connected Toast Wrapper element.
  - **Toast Group:** Remove the incorrect `role="dialog"` attribute from the Toast Group Wrapper element.
  - **Attached Portal:** The ARIA role applied when focusing on open now respects the role specified via `htmlAttributes.role` before falling back to `"dialog"`.
  - **Tree:**
    - **InsertableTree:** Action buttons (insert buttons) now reference the node label via `aria-labelledby`.
    - **ArrowButton:** `ArrowButtonProps` now extends HTMLAttributes to allow specifying HTML attributes for the button element.
  - **Tree, Tree Table:** Expand/collapse buttons now reference the node label via `aria-labelledby`.
- **Sliding Menu:** Introduce the `backwardItemProps` property on menu items to customize the backward navigation item displayed at the top of submenus. This allows overriding properties such as label, icon, or click handler when a parent menu item appears as the back button in its submenu.
- **Calendar:** Introduce the `restoreFocusOnHeightChange` in `CalendarInfiniteScrollOptions` to allow users control whether to restore focus on the day cell after the scroll container height changes in infinite scroll view.

### Fixed

- **Application Frame:** [Mobile] The wrapper collapsed below viewport height when content was shorter than the screen.
- **Table:** [A11Y] JAWS does not read the correct column and row.
- **Pie Chart:** Missing the deprecation tag in `PieChart` component.
- **Checkbox:** Color style in the label element is hard-coded instead of using a theme configuration key. To resolve this, replace it with the existing `checkbox.label.color` configuration.
- **Filter Selector:** [A11Y] The filter label in List Item is not read correctly by screen readers.
- **Chat:** [A11Y] The screen jumps to the top of the container when the screen reader focuses on the hidden chat title.
- **Message Box:** [A11Y] The hidden text is positioned outside the element.
- **Table:** Content goes blank during fast scrolling in infinite scroll table.
- **Attached Portal:** Unable to show tooltip when implemented inside an iframe.
- **Interaction Hint, Tooltip, CSS Ellipsis:** Incorrect portal position on second and subsequent opens when the portal content is too large to fit above or below the reference element.
- **Calendar:**
  - The `onVisibleRangeChange` property in `CalendarInfiniteScrollOptions` includes weeks that are not actually recognized as visible, for example, when only 1px is displayed.
  - Navigation between dates using arrow keys does not work correctly.
  - On the Infinite View, the scroll container displays different weeks when its height changes.
- **Date Picker, Time Picker, Date Time Picker:** [A11Y] On mobile, the header's close button does not have a readable name. To resolve this, add an `aria-label` attribute with a localized value:
  - **headerCloseButtonLabel**:
    - English: "Close"
    - German: "Schließen"
- **Tag:** [Compact/Flat Compact] There is no space between the icon, text, and the remove button. To resolve this, update the theme config values `theme.components.tag.icon.contentPaddingLeft` and `theme.components.tag.removable.contentPaddingRight`.
- **Icon Button:** [Default/Flat/Compact] The button is not perfectly circular when the browser base font size is too large or too small. To resolve this, introduce the `iconButton.minHeight` theme configuration (default `"0"`) to override the base button `min-height`.

### Deprecation

- **Popup Menu:** The `focusOnOpenHiddenText` property in `PopUpMenuTitles` has been deprecated, as the VoiceOver list-focus issue that this was introduced to work around no longer occurs.

## 38.2.0

### New Features

- **Interaction Hint:**
  - Introduce the `followCursor` property to make hints follow the cursor on hover
  - Introduce the `hideArrow` property to control hint arrow visibility
  - Introduce the `position` (left | right) property for vertical/list-based components (accordion, flyoutMenu, slidingMenu)
  - Enhanced InteractionHintConfigProvider:
    - Added `componentConfigs` to support component-specific configurations
    - Added `followCursor` and `hideArrow` to support configuring hint behavior globally.
- **Tree:** Enhance `TreeNode` customization in `TreeNodeTemplateRecursive` by spreading node properties, allowing individual nodes to override default styling and behavior through their configuration.
- **Dropdown:** Introduce the `isEmptyValue` property for **DropdownItem** to specify whether an item represents an empty value.
- **Select:** Extend the `isEmptyValue` property from **DropdownItem** to **SelectItem**, allowing select items to indicate an empty value consistently with dropdown behavior.
- **Interactive Tile:** [A11Y] Introduce the `disableAriaLabel` property to allow disabling the `aria-label` attribute.
- **Flyout Menu, Accordion:**
  - [A11Y] Support screen readers read the default status of menu with localization when interaction hints are disabled.
  - Introduce the `inProgress` variant to `MenuItemVariant` and `AccordionVariant`, expanding the set of supported variants from 5 to 6 (`open`, `info`, `error`, `warning`, `done`, and `inProgress`).
- **Table:** [A11Y] Added tabIndex={0} to table rows in the virtualized body to improve screen-reader navigation and allow interaction with dynamically loaded rows in virtual scrolling tables.
- **Table:** Introduce the `scrollToNode` property to programmatically scroll to a specific node (row) by its index.
- **Autocomplete:** Introduce the `onDropdownClose` callback that is triggered right after the dropdown is closed.
- **Rich Text Editor:** Allow displaying `ToolbarPlugin` in `RichTextEditor` for read-only and disabled modes.
- **List:** [A11Y] Enhance `List.Item` to improve the semantic structure of lists containing interactive elements.
- **Calendar:** Introduce the new "infinite" view mode, allowing users to scroll through months and years seamlessly by loading additional weeks.
- **Tab Panel:** Introduce the `TabProps.orientation` property to specify the orientation on a tab item.

### Fixed

- **Tab Panel:**
  - The selected tab item is not visible after the submenu is opened.
  - When there is no selected tab item on submenu, the first arrow key navigation causes unexpected scrolling behavior.
  - The submenu shakes when the interaction hint appears.
  - The condense tab item on horizontal mode shakes when getting focus.
  - [A11Y] The new heading has no semantic information available for screen readers. To resolve it, `role="heading"` and `aria-level` attributes (default value is 2, customizable via `ariaLevel` property) are added to ensure proper semantic structure for screen readers.
  - Focus cannot set to panel element if a tab item is selected. To resolve this, provide the `focusOnPanelAfterSelect` property to allow users to control whether to focus on the panel after selecting a tab item.
- **Button Group Container:** The position of `AttachedPortal` inside `PopupMenu` cannot be customized. To support customization, the `popupListAttributes` property is provided. It allows you to add extra HTML attributes to the popup menu’s portal element when responsive behavior is enabled.
- **Multiselect:**
  - The checkbox in a disabled item is not disabled.
  - The first arrow key navigation moves focus to the first item in the dropdown, even if it is disabled.
- **Rich Text Editor:** Right-click does not open the native browser context menu when the editor is in `readonly` mode.
- **Attached Portal:**
  - Unable to update its position when the reference element’s height changes.
  - Nested attached portal does not correctly follow the reference element during scrolling.
- **Chat:**
  - The message status, message content and username overflows its line height when the browser font size is increased.
  - The user avatar size does not increase to fill the available line height when the browser font size is increased.
- **Icon Button:** The icon overflows the button when the browser font size is increased.
- **Content Box:** [A11Y] `ContentBoxElements.Title` does not work well with screen readers if the `text` is an HTML element. To resolve this, provide `htmlAttributes` property to allow user customize the title element.
- **Filter Selector:** On desktop, both `onClick` and `onToggle` events are triggered when clicking the checkbox item.
- **Rich Text Editor:** Pressing `Ctrl+A` / `Cmd+A` in readonly mode selects the whole page content. Besides, `SelectAllPlugin` is introduced to handle Ctrl+A / Cmd+A keyboard shortcuts within the editor in readonly mode.
- **Application Frame:** [iOS Safari] The address bar remains visible and does not hide during scrolling.

### Deprecation

- **StyledCondensedTab:** `$selected` and `$orientation` properties have been deprecated.
- Nested imports—along with certain interfaces and components—are deprecated in favor of top-level imports. This change improves code maintainability and minimizes the risk of breaking changes caused by internal refactoring.
  For detailed migration steps and examples, refer to [Migration Notes](#/get-started/migration-instructions/migration-notes).
- **Relation Node:** The entire `relation-node` module has been deprecated, including all components and interfaces (`NodeTpl` namespace, `NodeTplProps` namespace, `createPort` HOC, and `PortProps` interface). Use `DiagramNode` and `DiagramPort` from the model-graph-diagram module instead.

## 38.1.2

### Fixed

- Added @types/lodash as a dev dependency to fix type errors during build.
- **Rich Text Editor:**
  - Auto-link doesn’t work correctly when the link text contains different node types, such as multiple text styles or tooltips.

## 38.1.1

### Fixed

- **Table:**
  - Incorrect styles on icons for **Status**, **Switch**, and **Tag** in the table header.
  - The column width does not match the largest header width when the `headFilterContentRenderer` property is provided.
- **Accordion:** [A11Y] Missing localized status information (open, info, error, warning, and done).
- **Pagination:** [A11Y] The number of pages is invisible with customized browser settings (e.g. different background, text).
- **Checkbox:** Missing `data-role=checkbox-input-indeterminate` attribute for the indeterminate checkbox.
- **Popup Menu:**
  - Missing `menuClassName` for the menu list inside the popup's attached portal (desktop) or modal overlay (mobile).
  - Closing the popup by clicking outside forces focus back to its trigger element, even if another element is already focused.
- **Default File Upload:** `maxHeight` and `maxWidth` properties do not work properly.
- **CSS Ellipsis:** The text is cut off too much.
- **Calendar:** Able to focus on content inside a disabled day with a scrollbar using the keyboard (Tab navigation).
- **Dropdown:** Cannot trigger event on custom elements placed inside `graphic` and `secondaryText` properties.
- **Autocomplete:** Application crashes when the `items` includes custom elements inside the dropdown list.
- **Tab Panel:** Does not resize properly and the panel header cuts off title.
- **Master Detail View:** Calculate width incorrectly in mobile.
- **Tab Sandbox:** Incorrectly detect the last focusable element when navigating inside iframe, causing the focus trap not working properly.
- **Rich Text Editor:**
  - Nested list items are not inherited the text styles (bold, italic, underline, strikethrough) from their parent list item.
  - The mark button and the custom style button are not active when selecting multiple lines in a paragraph.
  - The contentEditable element is not treated as a focusable element.
  - On Firefox, double-clicking to select text next to a line break results in incorrect formatting.
  - The application crashes when typing a number after two adjacent misspelled words.
  - The application crashes when a custom style (strikethrough or monospace) is enabled and a link is typed.
  - Pasting a pre-styled text makes the text appear with the wrong style.
  - TextFormatPlugin merges unmergable nodes.
  - Cannot replace `InlineStyleTextNode` with a custom node.
- **Multiselect, Custom select, Autocomplete with link items:** [A11Y] Missing labels for the listboxes and the option roles in the dropdown.
- **Multiselect:**
  - [A11Y] Missing labels for the checkboxes of each item in the dropdown.
  - Custom `graphic` in `items` property does not show in the dropdown list.
  - Application crashes when `graphic` contains a React element.
  - Cannot set the visibility of the select all option. To resolve this issue, the `enableSelectAllOption` property has been introduced to allow users to toggle the visibility of this element.
  - Items' states are not updated while being selected.
- **CSS Ellipsis:**
  - Content is cut off at the bottom.
  - Arrow position is displayed incorrectly.
- **Date Time Picker:** [A11Y] Unable to focus back to trigger button after choosing date and time.
- **Date Picker:** [Mobile] An empty Clear Button is shown on footer.
- **Tooltip:** The position of tooltip is inconsistent when hovering over an element near the edge of the viewport.
- **Application Frame:**
  - The sidebar with is calculated based on content layout instead of using the initial with from theme.
  - Resizing sidebar causes jumping layout to reach initial width if `minWidth` is larger than `expandedMinimizedWidth` in theme.
- **Attached Portal:** A type error occurs when `children` contains invalid HTML elements (e.g. string, number, etc.).

### Removed

- **Plugin Editor:** The **draft-js-editor** package has been completely removed from Widgets repository. As a result, `@com.mgmtp.a12.widgets/widgets-draft-js-editor` is no longer available. Please migrate to **[Rich Text Editor](#/widgets/data-entry/rich-text-editor)** to continue using a supported editor with ongoing updates.

### Deprecation

- **Chart Widgets:** `BarChart`, `LineChart`, and `PieChart` have been deprecated. It is recommended to migrate to [Recharts](https://recharts.org/) for continued support and enhanced functionality.

### Dependencies Update

| Name                | Old version | New version |
| ------------------- | ----------- | ----------- |
| lexical             | ^0.31.1     | ^0.31.2     |
| @lexical/html       | ^0.31.1     | ^0.31.2     |
| @lexical/link       | ^0.31.1     | ^0.31.2     |
| @lexical/list       | ^0.31.1     | ^0.31.2     |
| @lexical/plain-text | ^0.31.1     | ^0.31.2     |
| @lexical/react      | ^0.31.1     | ^0.31.2     |
| @lexical/rich-text  | ^0.31.1     | ^0.31.2     |
| @lexical/selection  | ^0.31.1     | ^0.31.2     |
| @lexical/utils      | ^0.31.1     | ^0.31.2     |

## 38.1.0

### New Features

- **Autocomplete:** Introduce the `enableClearButton` property to toggle the visibility of the clear button.
- **File Upload:** [A11Y]
  - Provide a localized name for the `title` attribute of menu action
    - **menuActionsOpen**:
      - English: "Open file options"
      - German: "Dateioptionen öffnen"
    - **menuActionsClose**:
      - English: "Close file options"
      - German: "Dateioptionen schließen"
  - Provide a localized connection text for the hidden text of menu action that is linked to `aria-labelledby`:
    - **menuActionConnector**:
      - English: "for "
      - German: "für "
  - Add `aria-labelledby` for the menu trigger button to improve accessibility information.
  - Introduced `FileUploadContext` to manage file upload-related context properties (`fileNameAfterUploadId`, `menuDescriptionId`, `labelId`).
- **Rich Text Editor:** Introduce the `resetTextFormatAfterTransform` property for `MentionPluginProps` to control whether the text styles are preserved after transforming text into a Mention Node.
- **Popup Menu:** Added `renderTriggerElementAttributes` and `renderTriggerElementChildren` to `PopupMenuConfigContextProps` for customizing trigger element attributes and children.
- **Master Detail:** Introduce the `onAnimationStart` and `onAnimationEnd` properties to the `animation` property, allowing users to handle animation events or check if an animation is running.
- **Tab Panel:**
  - Introduce the `orientation` property to specify the tab list's orientation.
  - Introduce the `enableA11YMobileDesignOnSubTab` property to enable the mobile design for sub tab list.
  - Introduce the `tabListAriaLabel` property to custom the aria-label's value in tab list.
  - Introduce the `heading` property to the `PanelHeader` component, allowing users to display the title in a more space-saving way.
  - Introduce the `highlighted` property to highlight a tab item.
- **Button Group Container:** Introduce the `preserveSemanticStyles` property to preserve the semantic styling and meaning of buttons when they are displayed within a popup menu.
- **List:** Introduce `buttonSemantics` property to allow list items preserve button semantics (e.g. primary, secondary, destructive, active) when rendered within a popup menu.
- **Quick Access Button:** Introduce the `preserveMainActionStyles` property to preserve the font styles (size, weight, text-transform, etc.) according to the buttons' font styles for action list item.
- **Chat:** [A11Y] Enhance accessibility on Message Content:
  - Add `role="region` attribute to the message content element.
  - Provide a localized name for the `aria-label` attribute:
    - **chatMessageSaid**:
      - English: "said:"
      - German: "sagte:"
    - **chatMessageYouSaid**:
      - English: "You said:"
      - German: "Sie sagten:"

### Fixed

- **Button, Toggle Button:** Icon in button is selectable by dragging the cursor.
- **Table, Tree, Tree Table:** [Mobile] Unable to drag and drop on Android Chrome browser.
- **Portal:** Focus incorrectly returns to portal, preventing the selected date time from being updated.
- **File Upload:** The **DefaultFileUpload** component fails to resize itself to its parent's dimensions on the first render.
- **Master Detail:** Pane width changes unexpectedly when clicking the Resize Handler after resizing.
- **Buffered Input:** Submitting the old value after pressing Enter.
- **Tab Panel:**
  - [A11Y] Focus is on the first item when the submenu is opened.
  - [Mobile] The submenu does not close when pressing Enter.
- **Rich Text Editor:**
  - **Links Plugin, Spell Check Plugin, Tooltip Plugin:** Fails to detect valid words when they are adjacent to special characters.
  - **Spell Check Plugin**: The application crashes when a misspelled word cannot be transformed due to the surrounding content.
- **Table:** [A11Y] Screen readers cannot read row and column content properly when interaction hints are shown.
- **Tree Table:** The left spacing in the first column is different between the header cell and the body cell.
- **Custom Select:** Unable to open the dropdown when select input changes its position
- **useWindowSize hook:** Not returning correct breakpoint when resize.
- **Multiselect:** The `onChange` event is triggered twice when choosing select-all checkbox.
- **Calendar:**
  - Missing element to group days into weeks in the month view.
  - Unable to add a className to the day element.
  - Border theme configuration is missing for some day variants.
  - Theme configuration for interaction states is missing in some day variants.
  - Missing data-role on StyledCalendarTable element (month view).

## 38.0.4

### Fixed

- **Rich Text Editor:**
  - Being able to edit in read-only mode.
  - **Mention Plugin**: Unable to add more than one mention node.
- **File Upload:** Display the action items in the interactive read-only mode.

## 38.0.3

### Fixed

- **Text Field:** An error message appears when blurring an input of type number.

## 38.0.2

### New Features

- **Calendar:** [Experimental] Introduced a new `Calendar` component:
  - Displays a grid of days follows the `date` property.
  - Supports both `month` and `week` views display.
  - Customizable via properties for date selection, day rendering, and interaction callbacks.
  - Supports localization and date format.
  - Have the properties to customize styles, disable specific days, and highlight weekends or holidays.

### Fixed

- **Flyout Menu:**
  - Unable to open the vertical menu when hovering unless menu item is clicked first.
  - Hovering over disabled item closes the sub-menu.
- **Master Detail:** [Flat Compact] The padding right of the second pane is missing, causing the Resize Handler to be misplaced.
- **Text Field:** [Firefox] When the input loses focus, the overflowing text remains displayed at the end rather than returning to the beginning.
- **Master Detail, Application Frame:** The width of the resizable element changes unexpectedly when clicking the resize handler.
- **File Upload:** The default title text is not shown on mouseover.
- **Rich Text Editor:**
  - The align button does not reflect the current alignment when applied to a link.
  - Applying styles to part of a link does not work as expected.
  - Certain text does not get converted into a link upon editing.
  - The previously focused button is not retained when the toolbar regains focus via tab navigation.
  - Could not retrieve the information related to the interacting node within the Tooltip plugin's `render` function.
  - **List Plugin**:
    - Unable to add mention node after pressing Enter.
    - Unable to create an auto list after typing a text node containing **Tooltip Plugin** or **AutoLink Plugin**.
    - The start number of the order list is overridden by the default value.
    - Auto-numbering is incorrectly triggered when text contains a number followed by a dot.
  - **Link Plugin**: Unable to create auto link after adding a mention node.
  - **Spell Check Plugin**: The application crashes when the plugin attempts to update while the editor is not focused.
- **Tree, Tree Table:** Added `data-tree-level` attribute to all tree and tree table nodes to provide a stable way to identify the node level, instead of relying on internal CSS classes.
- **Switch:** Missing `data-role="switch-interactive"` attribute for the interactive element.
- **Button Group Container**: Responsive behavior only allow collapsing from left to right.

## 38.0.1

### Fixed

- **Rich Text Editor:** An error message is displayed in the console when clicking a mention item.

## 38.0.0

### New Features

- **Autocomplete, File Upload, Icon Picker, Multiselect, Plugin Editor, Select, Switch, Tag Input, Text Field, Text Area, Date Picker, Time Picker, Date Time Picker:** Introduce configuration options for input focus border styling, supporting standard border strings or a custom `focusBoxShadow` with configurable color, width, radius, line cap, offset, and dash array for precise control over dashed borders.
- **Accordion, Buttons, Dropdown, Interactive Tile, Link, Menus:** Provide some configuration keys, such as `borderRadius`,`customBorder`, `color`, `fontStyle`, `fontWeight`, to allow user custom the styles in hover and focus states.
- **Master Detail:** Introduce the `resizableOptions` property for `VisibleView` and the `firstViewResizableOptions` for `MasterDetail`, allowing more precise control over resizing the boundary between views. When set at the MasterDetail level, `firstViewResizableOptions` applies to the first visible view, see [Master Detail Example](#/examples/master-detail).
- **Resize And Drag Container:** Introduce the `animation` and `show` properties to allow users to enable animation when showing and hiding the container.
- **Supporting Panes Layout:** Enhance the animation effects of the `SecondaryPane` for a smoother user interaction.
- Support Accessibility:
  - **Tab Panel:** Add interaction hint for tab items.
  - **Button Group Container, Quick Access Button:** Support localization for the trigger element of Popup Menu.
  - **Filter:** Add the `aria-labelledby` attribute and hidden text to the action button to improve accessibility information.
  - **Date Picker, Time Picker, Date Time Picker:** Add the `aria-labelledby` attribute and hidden text to the picker icon button to improve accessibility information.
  - **Date Picker:** Provide a localized name for the `title` attribute of picker button.
    - English: "Select a date"
    - German: "Wählen Sie ein Datum"
  - **Popup Menu:** Introduce the `triggerButtonCloseTitle` property to enable change the title of trigger button when the popup menu is opened.
  - **Flyout Menu:** Support for screen readers read the default status of menu with localization.
  - **Flyout Menu, Sliding Menu:** Remove `aria-label` attributes and implemented hidden text to support screen readers in reading alternative information (such as `aria-label` and `title`) for menu item consistency.
  - **Tag:** Add the `aria-labelledby` attribute and hidden text to the remove button to improve the accessibility information of each individual tag.
- **Content Box:**
  - Introduce the `childrenOnly` property for `ContentBoxElements.Heading` to allow render only its children. It is recommended when the heading contains only invisible elements, such as `HiddenText`, helping to eliminate unnecessary empty space in the UI.
  - **ActionContentBox:** Introduce the `componentRenderers.heading` property to allow customization of the heading.
- Replaced conditional selection of DnD backend with `MultiBackend` from `dnd-multi-backend` for improved device support.
  - Removed dynamic selection between `TouchBackend` and `HTML5Backend`.
  - Introduced `DnDOptions` with `TouchTransition` and `MouseTransition` for multi-device compatibility.

### Fixed

- **Popup Menu:**
  - [Mobile]:
    - [A11Y] The screen reader does not read the header as a heading.
    - Clicking on the popup menu header closes the popup menu.
- **Table:**
  - The Table width does not update when resizing the container.
  - The row scroller receives unnecessary focus.
- **Checkbox:** The `labelGraphic` property does not work properly, causing the graphic to not show up.
- **Inputs:** The input is focused when clicking outside the label or helper text, which may lead to unintended value changes (e.g. toggling a switch unexpectedly).
- **Multiselect:** Clicking on the suffix arrow icon closes and reopens the dropdown.
- **Autocomplete, Multiselect:** [Mobile] Unable to clear input text with clear button outside modal after blurring the input on iOS devices.
- **Autocomplete:** The `onValueChange` is triggered with an empty value even when the value has not changed.
- **Portal:** [StrictMode] The active element changes unexpectedly when rendering multiple portals on the screen.
- **File Upload:**
  - Cannot download the file when `buttonText` or `descriptionText` is provided.
  - A redundant placeholder icon is shown when dragging a file into the upload area.
- **Message Box:** The message text overflows outside the Message Box when the box width is too small.
- **Button:** [A11Y] Missing the `aria-label` attribute when having badge and the **Interaction Hint** is deactivated.
- **Badge:** [A11Y] Missing the `title` attribute when the **Interaction Hint** is deactivated.
- **Tab Panel:**
  - The sub-menu is displayed when it has only one item.
  - Layout breaks due to missing `box-sizing: border-box` styling.
- **Supporting Panes Layout:** Resizing jumps by an extra width on mouse down and up, caused by missing `box-sizing: border-box`.
- **Resize and Drag Container:**
  - The `initialSize` property does not accept "auto" as a valid value for `width` or `height`.
  - The container fails to initialize if the viewport dimensions are smaller than the `inititalSize` setting.
- **Dnd Table, Dnd Tree Table:** [Desktop touch devices] Item is remained sticky and cannot drop after releasing the mouse click.
- **Rich Text Editor:**
  - Aligning one paragraph can impact others, even if they are not selected.
  - Formatting from the toolbar cannot be applied because the active format resets whenever another format is selected or the focus shifts away from the editor.
  - The text selection resets when the editor is blurred and then refocused.
- **Resizable Handler:** The max-width and min-width do not recalculate when the container's width changes.
- **Application Frame:** [Mobile] The hidden toggle sidebar button is still focusable.
- **Sliding Menu, Flyout Menu:**
  - Badge of menu item in sub menu is displayed on the left.
  - The badge in the vertical menu is displayed inconsistently when a menu item has longer text.
- **Icon Picker:** [Mobile] Dropdown immediately closes after opening.
- **Helper Classes:**
  - Text Align does not apply to the label with graphic.
  - Font Size, Font Style, Font Weight, Text Transform: The graphic's label changes unexpectedly, causing visual issues.
- **Filter Selector:** The Filter Selector cannot receive keyboard focus when `hideSearchBar` is used.
- **Custom Select:**
  - [Mobile] The graphic is not displayed on input.
  - Introduce the `showPrefixes` property to allow users to toggle the visibility of input's graphic.
  - Changing the `items` property does not update the selected value.
- **Toast:** The `wrapperRef` property has no effect, preventing the reference from being set.
- **Attached Portal:** The portal does not reposition correctly during scrolling if it's opened from an overlapped trigger element.

### Breaking Changes

- **Plugin Editor:** Deprecated draft-js based text editor widgets is separated into their own package. The new package `@com.mgmtp.a12.widgets/widgets-draft-js-editor` is now available for use. As a result, the `@com.mgmtp.a12.widgets/widgets-core/lib/editor` folder is removed.
- **Master Detail:** Master detail view width is restricted from 1 to 12 columns. This should not have any impact on existing implementations, but is documented for reference purposes.
- **Connected Toast:** Remove the `arrowPosition` property from ConnectedToastTemplateProps.
- **Date Picker:** The selected day has been updated with interaction styles to enhance visualization.
  - Remove the `day.selected.interactiveColor` configuration.
  - Introduce new configuration keys for each interaction state:
    - `day.selected.interaction.active { background, border, color }`
    - `day.selected.interaction.focus { background, border, color }`
    - `day.selected.interaction.hover { background, border, color }`
- **Popup Menu:** The icon size in the trigger element has been changed.
  - Remove the `plasmaIconFontSize` configuration key.
  - By default, the icon matches the font size of the Icon Button. When a custom trigger element is defined (such as a Button with the label and icon), it follows the styles defined by that custom element.
- **Select:** Remove redundant properties (`hideLabel`, `secondaryText`, `selected`, `tabIndex`, `title`, `ariaChecked`) from `SelectItem`.
- **Supporting Panes Layout:** The type of configuration keys `transitionDuration` has been updated from `string` to `Duration`. The new `Duration` type allows for more precise and consistent animation timing values.
- **ActionContentBox:** The **headingElements** property in the **ActionContentboxProps** interface has been changed from required to optional.
- **Content Box:** The variable `BASE_CONTENTBOX_DATA_ROLE` has been removed. Use `DataRoles.Contentbox` instead for better maintainability and consistency.
- Namespace **TimeUtils** in `lib/common/main/utils` has been moved to `@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/time-utils.js`.
- Similarly, namespace **DateTimeUtils** in `lib/common/main/utils` has been moved to `@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/date-utils.js`.
- The Date/Time utils now operate with the locale object from **date-fns** instead of the locale string.
- **dayjs** is removed from the widgets-core package, as well as the corresponding utility.

### Deprecation

- **Menu:** The `badge` and `tinyBadge` configuration keys in `subLayer` have been deprecated. These keys are no longer recommended for use and will be removed in future versions.

### Dependencies Update

| Name                | Old version | New version |
| ------------------- | ----------- | ----------- |
| framer-motion       |             | ^12.4.11    |
| dnd-multi-backend   |             | ^9.0.0      |
| lexical             | ^0.25.0     | ^0.31.1     |
| @lexical/html       | ^0.25.0     | ^0.31.1     |
| @lexical/link       | ^0.25.0     | ^0.31.1     |
| @lexical/list       | ^0.25.0     | ^0.31.1     |
| @lexical/plain-text | ^0.25.0     | ^0.31.1     |
| @lexical/react      | ^0.25.0     | ^0.31.1     |
| @lexical/rich-text  | ^0.25.0     | ^0.31.1     |
| @lexical/selection  | ^0.25.0     | ^0.31.1     |
| @lexical/utils      | ^0.25.0     | ^0.31.1     |

## 37.2.3

### New Features

- **Interaction Hint:** The hint is deactivated by default for interactive elements. To enable the hint, set `enableInteractionHint` to `true` in the `InteractionHintConfigProvider` configuration.

## 37.2.2

### Fixed

- **Interaction Hint:** Provide a way deactivate the interaction hint for interactive elements by setting `enableInteractionHint` to `false` in the `InteractionHintConfigProvider` configuration.
- **Toggle Button:** The selected button overlays the attached portal element.
- **Rich Text Editor:**
  - The AutoLinkPlugin plugin causes the application to crash.
  - The `$createMentionNode` function is deprecated because it requires passing undefined for an optional parameter. Use `$createEditorMentionNode` instead.

## 37.2.1

### Fixed

- **Flyout Menu, Sliding Menu:** [A11Y] Talkback does not read menu items.
- **Rich Text Editor:**
  - The auto link with `customTerms` property does not work properly.
  - Unexpectedly convert to the list item when typing a normal text with the number at the beginning.
- **Dnd Table:** Unable to drag and drop on action buttons.

## 37.2.0

### New Features

- **[Interaction Hint](#/widgets/data-display/interaction-hint):** Introduce a new Widget that displays the `title` attribute as a visible custom element, rather than using the default browser styling.
  - This new hint is an independent component and can be used in all kinds of interactive elements. It provides a way to always show the title content whenever the interactive element is hovered over or focused on.
  - It is automatically applied to Button, Toggle Button, File Upload, Flyout Menu, External Link, Mailto Link, Interactive Counter, Interactive Tile, Rich Text Editor, Wizard. User still can use `title` property in these Widgets to define the title content.
    However, instead of being used as a `title` attribute in the DOM, it is passed to `aria-label` or `HiddenText`. As a result, the `title` attribute is set to empty, or entirely removed from the element.
- **Interactive Tile:** Introduce the `disabled` property to disable a tile.
- **Supporting Panes Layout:** Introduce the `onToggleCollapsed` property to manage the state of the panes when collapsing or expanding.
- **Resizable Handler:** Introduce the `onDoubleClick` property to handle double-clicking the resize handler for collapsing, expanding, or resetting to the default expanded width.
- **Message Box:** Provide `borderWidth` theming configuration to allow customization of border thickness.
- **Tooltip:** Introduce the `useDesktopView` property to specify whether to use the desktop view on mobile devices.
- **Split View:** Introduced the `resizableOptions` property to improve the control over resizing the boundary between the split area. For more details, see [Split View](#/widgets/layout/split-view).
- **Autocomplete, File Upload, Icon Picker, Multiselect, Plugin Editor, Select, Switch, Tag Input, Text Field, Text Area, Date Picker, Time Picker, Date Time Picker:** Introduce configuration options for input focus border styling, supporting standard border strings or a custom `focusBoxShadow` with configurable color, width, radius, line cap, offset, and dash array for precise control over dashed borders.
- **Accordion, Buttons, Dropdown, Interactive Tile, Link, Menus:** Provide some configuration keys, such as `borderRadius`,`customBorder`, `color`, `fontStyle`, `fontWeight`, to allow user custom the styles in hover and focus states.
- Support Accessibility:
  - **Application Frame**: [Content Area] Extend the `htmlAttributes` property with a new `mainContainerAttributes` property to specify the HTML attributes of the main container.
  - **Content Box, Quick Access Button, Rich Text Editor:** Provide a meaningful default heading text for the popup menu to enhance accessibility and support visual tracking.
  - **Popup Menu:** Add hidden text `Menu` for popups without a `headerTitle` to improve accessibility.
  - **Wizard.Step:** Add a `role="link"` attribute to support better semantics.
  - **List.Item:** Introduce the `htmlAttributes` property to specify the HTML attributes of an item element.
  - **File Upload:** Provide a localized text for the `title` attribute:
    - English: "Upload file"
    - German: "Dokument hochladen"

### Fixed

- **Default File Upload:**
  - Unable to download the file in `readOnly` mode.
  - Action items are still visible in `disabled` and `readOnly` modes.
  - The `image` property does not work when the `fileOptions` property is not provided.
- **Custom Select:**
  - [Mobile] `onModalClose` callback is not called when closing the modal by selecting an item.
  - [Mobile] Pressing ESC triggers `onModalClose` even if not in `keysToClose`.
  - Cannot use an empty string as item value.
- **Application Frame:**
  - Collapse button on sidebar shift upward after expanding.
  - Sliding Menu not visible when used with the sidebar in responsive mode.
- **Rich Text Editor:**
  - Unable show the hint when focusing on a list item.
  - Crash app without using **SpellCheckPopup**.
  - Unable to retrieve the text property from the mention node.
  - The tooltip does not work on the **MentionNode**.
- **Switch:** The margin is missing when only the `checkedOption` property is provided.
- **Attached Portal:** Some issues related to the position when the reference element changes its position, e.g. incorrect to show/hide the portal.
- **Multiselect:** The "Clear Text" button in the input field does not clear a selected item if the item was chosen from a search result.
- **Resize and Drag Container:** The container is not visible when a `maxHeight`, `minHeight`, `maxWidth`, or `minWidth` are passed as strings.
- **Modal Overlay:**
  - [A11Y] Swiping causes focus to shift to background elements when opening the Modal Overlay by clicking an item in the Popup Menu.
  - The popup menu does not return focus to the trigger element when closed if the trigger element is located on the Application Frame Header.
- **Interactive Tile:**
  - [A11Y] Pressing Enter cannot trigger the interactive tile.
  - The color of variant Icons is overridden by the color of Tile's icon.
  - The `secondary.border` configuration key of `secondary` Tile does not work properly. To resolve this issue:
    - The general `border` configuration key has been deprecated.
    - A new `primary.border` configuration key has been introduced for the `primary` Tile, allowing separate border customization for each Interactive Tile type.
- **Autocomplete:** The `onValueChange` event does not trigger for an empty string.
- **Badge:** Cannot remove or customize the default title.
- **Tab Panel:** The number of items on the main tab and sub tab does not update accordingly when the `tabs` property of Tab Panel changes.
- **Supporting Panes Layout:**
  - Provide the `htmlAttributes` property to resolve the issue that users could not add additional HTML attributes to the panes.
  - Unable to open the Secondary Pane when it has the default value `hide=true`.
- **Button:** Display the wrong title when hovering over the icon button.
- **Flyout Menu:** Display the wrong title when hovering over the condensed icon.

## 37.1.3

### Fixed

- **Tab Panel:** The tabs on panel do not update accordingly when the data in their properties changes.
- **Date Picker:** The application crashes due to an infinite focus loop while tracking the focused element.

## 37.1.2

### Fixed

- **Filter Bar:** [A11Y] The disabled Filter lacks semantic information for screen readers.
- **Content Box:** The multiline heading has no spacing at the top and bottom.
- **Sliding menu:** Scrolling of selected menu item into view doesn't work properly.

## 37.1.1

### Fixed

- Support accessibility:
  - **Tab Panel:**
    - The arrow keys are not supported for navigating in the tab list.
    - The focus cycle between Tab and Panel do not work well.
    - Tab items overflow beyond the tab panel when their height exceeds the panel's height, which occurs when there are too many items in the tab panel or when the screen is zoomed in.
  - **Table:** Navigate through collapsed rows in the row group using the keyboard Tab key.
  - **File Upload:** Incorrect icon color in `readonly` mode.
- The customized meta viewport in Widgets overrides the customer project's viewport, causing issues with application resizing.
- **Autocomplete:**
  - Dropdown now shows the full list of items for asynchronous autocomplete, instead of only the selected item.
  - Highlighting multiple dropdown items with the same label when only one is selected.
- **Resize And Drag Container:** The container is hidden by setting its opacity to 0.
- **CSS Ellipsis:** The text is displayed incorrectly when the height is too small.
- **Badge:** A redundant `z-index` style is causing the badge to display unexpectedly.
- **Icon Picker:** Icon Picker filters dropdown options when initialized with a selected icon.
- **Toast Group:** The disappearance order of stackable toasts is incorrect when they are expandable.
- **Filter Selector:** The footer's background color becomes transparent when the Filter Selector is placed inside an embedded Content Box.

## 37.1.0

### New Features

- **[Interactive Tile](#/widgets/data-display/interactive-tile):** Introduce a new component that allows flexible content area creation.
- **Tab Panel:** [A11Y] Support accessibility for the Tab List:
  - Provide a localized name for the `aria-label` attribute:
    - English: "main navigation"
    - German: "Hauptnavigation"
  - Add an `aria-orientation="vertical"` to indicate the Tab List's orientation.
  - Support pressing Esc to close the tab panel.
- **Comment Container:** Introduce the `closeOnOutsideClick` property to specify whether the comment container will close after clicking outside.
- **Tag Input:** Add a visible visual to indicate whether the users can interact with the input.
- **Progress Indicator:** [A11Y] Introduce the `scrollIntoView` property that specifies whether the indicator should be scrolled into the visible area without focusing.
- **Link:** [A11Y] Provide the `useAsButton` property to support better semantics if the link triggers an interactive event rather than navigating to a href.
- **Resizable Handler:** Introduce a new `ResizeHandler` wrapper to enhance layout flexibility by allowing users to adjust the size of content areas dynamically.
  - Configurable Resize Options:
    - `minWidth` and `maxWidth`: Define the boundaries for resizing to prevent elements from becoming too small or too large.
    - `onResizeStart`: Triggered when resizing begins, providing initial dimensions.
    - `onResize`: Triggered during the resizing process, offering continuous updates on size changes.
    - `onResizeStop`: Triggered when resizing ends, providing final size details.
- **Application Frame:** Introduced the `subResizableOptions` property to improve the control over resizing the boundary between the sidebar and main content. For more details, see [Sidebar with Tab Panel](#/examples/sidebar-with-tab-panel).
- **[Supporting Panes Layout](#/experimental/supporting-panes-layout):** [Experimental] Introduce a new layout that contains:
  - Primary Pane: Displays the main information
  - Secondary Pane: A supporting pane that can be displayed on the left or right side of the Primary Pane
- **Multiselect:** [A11Y] Screen readers announce the incorrect selected state for each item.
- **Flyout Menu, Sliding Menu, Accordion:** Introduce the `variant` property to reflect the status of an item or section.
- **File Upload:** [A11Y] Introduce the `title` property, which will appear when hovering over the file upload. This `title` will also be read by the screen reader whenever the file upload is focused.
- **Collapsible Panel:** Introduce the `swapAddonsPosition` property to swap the positions of the addons and collapse icon (arrow icon).
- **Typography:**
  - Introduce the `swapAddonsPosition` property to swap the positions of the addons and collapse icon.
  - Introduce the `iconVerticalAlignment` property to specify where the addons and collapse icon will be positioned vertically (`top`, `middle`, or `bottom`).

### Fixed

- **Toast Group:**
  - [A11Y] VoiceOver does not correctly announce the notification count after adding multiple toasts in Safari.
  - The temporary stackable toast group closes 4 toasts at once, rather than closing them individually.
- **Tag Input:** [A11Y] Voice Over does not announce dropdown item in the tag list.
- **Rich Text Editor:**
  - Safari and Chrome on macOS do not work with the Vietnamese IME keyboard.
  - Tooltip displays in the wrong position when opening the virtual keyboard on mobile.
  - The tooltip remains visible even after removing the link.
  - The tooltip cannot be displayed or is partially obscured when the textarea is partially covered. (both desktop an mobile)
- **Table, Tree Table:** When drag and drop is enabled, it is not possible to set input cursor or select text when using mouse on Firefox browser.
- **List:** The `meta` element is misaligned when the list item has a line break.
- **Popup Menu:**
  - The popup does not close when pressing the ENTER key on an element that has a focus handler on the click event.
  - [Mobile] Cannot focus back on the trigger element when closing the popup by the ESC key.
- **DnD Tree Table:** Node loses focus after being dropped outside the viewport in a virtualized table.
- **Progress Indicator:** The Progress Indicator removes the `position: absolute` style from its parent element, leading to layout issues.
- **Tooltip:** The tooltip cannot scroll when the content height exceeds the tooltip height.
- **Attached Portal:** Incorrect position calculations when rendered inside an iframe.

## 37.0.3

### Fixed

- **Master Detail Layout:** CSSTransition is still used when animation is disabled that might cause unexpected rendering with undefined view.

## 37.0.2

### Fixed

- **Sliding Menu:** Cannot see the last items of the Sliding Menu when the application header's height is expanded.
- **Toast Group:** The active element loses focus when a non-stackable Toast disappears.
- **Text Output:** There are some styling issues:
  - The icon does not align with the text.
  - The text is broken into three lines when wrapping around a `CSSEllipsis` with `noData`.
- **Date Time Picker, Date Picker, Time Picker:** Completely revert changes from Cannot open picker if typing an invalid value (A12W-10571).
- **File Upload:**
  - [A11Y] The readonly file upload with click event is not accessible with TAB key and screen readers.
  - [A11Y] The Cancel button of the default file upload does not receive focus with the TAB key.
- **ContentBox:** The background color of `ActionBarGroup` is not updated accordingly when switching themes.
- **Table:**
  - The width of the Action column is incorrectly calculated when it includes a label or when it's in infinite scrolling table.
  - **Column Group:** The parent header cell does not span the entire cell's width.
- **Custom Select:** [Mobile] `onModalClose` callback is not called, and focus is not set back to the input when closing the modal by a custom key.
- **Table, Tree Table:** Customizing the `footRowRenderer` caused the footer row to lose its border and resulted in the duplication of custom rows.
- **Master Detail Layout:** The passed view will be rendered as a static element during the closing transition of a pane to avoid unintended updates from the external source.
- **Quick Access Button:** Always focus back on the trigger element when closing the popup:
  - Provide the property `focusOnTriggerElementAfterClose` to decide whether to focus on the trigger element when the popup of `actionItems` is closed.
  - Provide the property `triggerElementButtonRef` to access the trigger element of the `actionItems` popup.
- **Tag Input:** Closing the virtual keyboard by pressing "done" after typing some letters added the entry as a tag instead of just filtering the suggestions.
- The Android's keyboard overlaps the content of the Application Frame, specifically the footer of the Content Box.
- **Date Time Picker:** Cannot select date if the value of time input is changed on mobile.
- **Helper Classes:** Font-color is not applied in Text Output with `noData`.
- **Multiselect:** [A11Y] Sorting of entries in dropdown doesn't work with keyboard-only navigation.

### Dependencies Update

| Name                | Old version | New version |
| ------------------- | ----------- | ----------- |
| lexical             | ^0.14.3     | ^0.17.0     |
| @lexical/html       | ^0.14.3     | ^0.17.0     |
| @lexical/link       | ^0.14.3     | ^0.17.0     |
| @lexical/list       | ^0.14.3     | ^0.17.0     |
| @lexical/plain-text | ^0.14.3     | ^0.17.0     |
| @lexical/react      | ^0.14.3     | ^0.17.0     |
| @lexical/rich-text  | ^0.14.3     | ^0.17.0     |
| @lexical/selection  | ^0.14.3     | ^0.17.0     |
| @lexical/utils      | ^0.14.3     | ^0.17.0     |

## 37.0.1

### Fixed

- Fixed compatibility with React 17.
- **Button Group Container:**
  - The button labels are not displayed in uppercase in the responsive popup menu.
  - button with `labelHidden=true` when rendering inside popup menu will always have visible label.
- **Table:** The header and footer content are not aligned with the corresponding body content.
- **Attached Portal:** [A11Y] NVDA reads `clickable` in Firefox each time the attached portal is opened.
- **Multiselect, Custom Select:** [A11Y] Unable to use the arrow key down to navigate to list items with NVDA in Firefox.
- **File Upload:** The file upload content loses focus after deleting the uploaded content.
- **Popup Menu:** The trigger element loses focus after closing the popup menu.
- **Date Picker:** The month shifts to the previous month upon opening if the first day of the month was previously selected.
- **Quick Access Button:** Focus state of secondary button has 2 outlines.
- **Menu:** The badge in the sub-layer covers the top content of the item.

## 37.0.0

### Breaking Changes

- Deletion of many "State" interfaces. States are internal, but the TypeScript interfaces for many widgets were exported. Since the rewrite of many widgets to React functional components, state interfaces are obsolete and therefore deleted. This should not affect users of widgets, but is documented here for the sake of completeness.
  - ApplicationFrameState
  - ProgressIndicatorState
  - PopUpMenuState
  - TooltipState
- **Table:** When a drag event is triggered, the row preview image is now always rendered as a separate React component instead of using browser's native renderer. The dragging row rendered by the new preview layer is not rendered inside the Table Body. Therefore, any custom Context Provider that created inside the Table Body, which then could be accessed by each row, will no longer be accessible.
- **Tree Table, Table:** The default of aria-attributes are not available in table footer, use the `hasFootContent` property to specify whether you want to render the table footer's aria-attributes or not.
- **Application Frame:** [A11Y]
  - [Mobile] Remove the `tabIndex` attribute from the **main container** to prevent screen readers from focusing on the wrapper.
  - If the focus handling is customized for mobile use, the introduction of the new fallback focus behavior might interfere with it.
- **Text Output:** By default, the Text Output content is now wrapped by paragraph tags for improved semantics. A `disableParagraphWrapping` property has also been introduced for situations where this default behavior may not be desired (such as when working with block level elements).
- **Timepicker:** The default value of `closeOnBackdropClick` has been changed from `true` to `false` on mobile/tablet.
- **FlyoutMenu, Sliding Menu, List, Date Picker, Accordion, Table, Filter Selector:** The selected color has been changed from `#e6f4fe` to `#f5fbff`.
- **Table:** The background color of embedded content in the expanded table has been changed from `#f1f2f4` to `#f9fafb` when hovering or focusing on the table row.
- **Popup Menu:** [A11Y]
  - [Mobile, Tablet] Display popup menu from the bottom and add a visible close button for improved navigation with screen readers, avoiding position loss.
  - The `closeOnOutsideClick` property is only enabled by default on desktop or when `enableA11YMobileDesign` is set to `false` in the configuration of the **PopupMenuConfigContext**.
- **@com.mgmtp.a12.widgets/react-virtualized-fork@10.0.0** is no longer available since the original **react-virtualized** library now supports React 18.
- **Button:** Adjusting the Icon Button
  - The `withBackground` property has been removed since the `invert` icon button's appearance now varies depending on its type (regular, primary, secondary, and active).
  - The regular icon button now has a round shape in the Default and Flat themes.
- **Message Color - Warning:**
  - The appearance of the `warning` variant has been adjusted for better contrast.
  - Introduce a dark color and text color for each variant:
    - `variant.errorColorDark`
    - `variant.infoColorDark`
    - `variant.successColorDark`
    - `variant.warningColorDark`
    - `variant.text.error`
    - `variant.text.info`
    - `variant.text.success`
    - `variant.text.warning`
- **Status:** The deprecated `light` property has been removed. The alternative way to customize the Status is to use the theme variables.

### New Features

- **Date Time Picker, Time Picker:** Making behaviors consistent between desktop and mobile that only save the selected date time when clicking the OK button.
- **HeaderTrigger:** [A11Y] Introduced a new `hideHiddenText` property that specifies whether the hidden text should be hidden from screen readers or not.
- **Tag Input:**
  - Introduce a new `comparator` property that allows users to implement a custom sorting order function for list items when opening the dropdown.
  - [A11Y] Mobile: Some adjustments to support the screen reader's visual focus tracking of the correct tag item.
- **Button, Dropdown:** Provide and adjust some configuration keys for styling purposes.
- **Button Group Container:** Provide the `popupMenuHeaderTitle` property to customize the header title of the **Popup Menu** in case responsive behavior is enabled.
- **Popup Menu:** Provide the property `headerTitle` to display a header with a title and a close button for the Popup Menu on mobile and tablet devices.
- **Content Box:**
  - The Button's properties now can be used for the `ContentBoxElements.BackButton` and `ContentBoxElements.CloseButton` components.
  - `ActionButton` and `HeadingActionButton` have been introduced. They have the same appearance with the `ContentBoxElements.BackButton` and `ContentBoxElements.CloseButton` but can now be used for a different action. The difference between these 2 elements is the `ActionButton` is a single button, meanwhile the `HeadingActionButton` is an addon that contains the `ActionButton`.

### Fixed

- **Custom Select:** [A11Y] Mobile: Unable to swipe and read options on screen readers.
- **Master Detail:** The divider between panels is missing if there are more than 2 panels.
- **Table:** The Context Menu is missing the `boxShadow` style.
- **ResizeAndDragContainer:**
  - The resizer covers the scrollbar, making it difficult to interact with.
  - Unable to click on the scrollbar when resizing is enabled.
  - There is no way to customize the resizer's styles.
- **Badge:** The badge is cut off when displaying in the Application Header.
- **Popup Menu, Header Trigger:** The size of the icon trigger is inconsistent with the Icon Button.
- **Application Frame:** Scrolling issue on mobile when the content area has the Content Box inside. (e.g. The focused input is scrolled out of the visible view.)
- **File Upload:** The uploaded attachment is sometimes focused when it should not yet be focused.
- **Attached Portal:** The portal automatically closes when it completely covers the trigger element.
- **DatePicker, DateTimePicker, TimePicker, Comment Container:** Users inadvertently close modals on mobile and tablet devices by touching outside of the modals.
- **Table:**
  - [A11Y] NVDA reads `clickable` for cells and non-interactive rows.
  - The action column's width is automatically calculated when the `width` property is defined.
- **Text Field** [A11Y] The Text Field and many other inputs don't have enough contrast between the info message text and info message background when using the Flat theme.
- **Text Field, Date Picker, Time Picker, Date Time Picker, Icon Picker, Select, Month Selector, Year Selector, Year and Month Selector:**
  - [A11Y] Mobile: Focusing on the input is needed two swipes on screen readers.
- **Toast Group:** Support accessibility
  - When Toast appears after loading the Toast Group page from the URL, the screen reader does not read the Toast.
  - Stackable Toast Group has an unnecessary focus on the toolbar.
- **Autocomplete:** [A11Y] Can not open the Autocomplete.
- **Content Box:** The content area's min-height style has a hard-coded value.
- **Date Time Picker, Date Picker:** The picker does not work properly if the time zone offset is positive (such as UTC+2, UTC+3, etc.).
- **Popup Menu, Filter Selector:** [A11Y] Add `role="dialog"` to fix arrow key navigation backward with JAWS moves onto the application logo.
- **Tag Input:** [A11Y] Swiping to choose the available tag from search results does not work with Talkback (Android) enabled.
  - New behavior: When clicking/tapping on the disabled dropdown item, it will not create a new tag and the focus still stays on the input.
- **Inputs:** On iOS devices, an element that has a font size smaller than 16px will auto-zoom in when it is tapped/focused.
- [A11Y] Some issues with Voice Over on iPhone:
  - Tag Input, Autocomplete: Cannot swipe from the input to the dropdown inside the modal.
  - Autocomplete, Multiselect: Swiping does not focus on the "Clear" button of the input outside the modal.
  - Tag Input: Missing aria-labels for the close and save buttons in the modal that prevents screen readers from announcing the additional information about the buttons.
- **Tree Table:** When the row is disabled, the arrow button for expanding the tree node is also disabled.
- **Date Time Picker, Date Picker, Time Picker:** Cannot open the picker when clicking the picker button after entering an invalid value.
- **Tag Input:** Mobile: A tag is not created when clicking the save button after entering text identical to a previously deleted tag.
- **Toast Group:** Toast always focuses on mount even though `focusOnMount` is set to `false`.
- **Comment Container:** Resizing and Dragging is flickering when it shows up.

### Dependencies Update

| Name                                          | Old version | New version |
| --------------------------------------------- | ----------- | ----------- |
| @com.mgmtp.a12.widgets/react-virtualized-fork | 10.0.0      |             |
| @types/react-virtualized                      |             | ^9.21.29    |
| @types/draft-js                               | 0.11.10     | ^0.11.17    |
| @draft-js-plugins/editor                      | 4.1.3       | ^4.1.4      |
| react                                         | ^17.0.2     | ^18.2.0     |
| react-dom                                     | ^17.0.2     | ^18.2.0     |
| react-virtualized                             |             | ^9.22.5     |
| react-resize-detector                         | ^8.0.4      | ^9.1.1      |
| recharts                                      | 2.5.0       | ^2.12.2     |
| typescript                                    | 4.9.5       | 5.3.3       |
| scheduler                                     | ^0.20.2     | ^0.23.0     |

### peerDependencies Update

| Dependency | Old version            | New version                          |
| ---------- | ---------------------- | ------------------------------------ |
| react      | ^16.14.0 \| \| ^17.0.2 | ^16.14.0 \| \| ^17.0.2 \| \| ^18.2.0 |
| react-dom  | ^16.14.0 \| \| ^17.0.2 | ^16.14.0 \| \| ^17.0.2 \| \| ^18.2.0 |

### Deprecation

- **Content Box:** The `onBackButtonClicked` property of the **BackButton** and the `onCloseButtonClicked` property of the **CloseButton** have been deprecated. Instead, use the `onClick` property from the **Button** widget directly.
- **Text Field:** The `isPhone` property in `TextLineStateless` has been deprecated.
