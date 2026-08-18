## 38.3.5

### Fixed

- **Multiselect**
  - Infinite render loop when items is passed as object form.
  - Multiselect wrapped by a context value with a throwing getter fails to render when the `graphic` property contains a React element.
- **Popup Menu:** The focus restoration behavior inside `PopupMenu` could not be configured per close reason. `focusOnTriggerElementAfterClose` now accepts either a boolean or a configuration object, allowing focus restoration to be controlled separately for close reasons such as item clicks, outside clicks, ESC, SPACE, close button clicks and programmatic closes.
- **File Upload:** The content overflows its wrapper when File Upload is placed inside a parent element that has padding.

### Deprecation

- **FileUpload:** The `$fileUploadSize` property in `StyledFieldUploadWrapper` has been deprecated.

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

## 36.6.0

### New Features

- **Rich Text Editor:** The `Rich Text Editor` is a new widget built using the [Lexical](https://lexical.dev/) framework. While the `Rich Text Editor` is currently in an experimental state, it was built with the purpose of eventually replacing the existing `Plugin Editor` widget.
  The main benefits of the `Rich Text Editor` are that it was built using [Lexical](https://lexical.dev/) (whereas the existing `Plugin Editor` uses the now deprecated draft-js) and that it includes the `@com.mgmtp.a12.widgets/widgets-core/lib/experimental/rich-text-editor/main/themes/rich-text-editor.css` file, which can be imported into the application to apply default styling to the editor.

## 36.5.1

### Fixed

- **Button:** Displaying the incorrect button when the button label is hidden.

## 36.5.0

### New Features

- **Date Time Picker:** Some improvements to get rid of user confusion:
  - Always return to the date picker screen, as well as reset the month and year selections after clearing.
  - The selected/initial date will always be displayed in the header on the time picker.
- **Helper Classes:** Helper Classes are now supported on Icon Picker, Time Picker, Year and Month Selector.
- **Custom Select:** Provide a new property `onVisibilityChange` that can be used to get information on whether the Custom Select's dropdown is currently open or not.
- **Attached Portal:** [A11Y] Support restriction of arrow key to not go outside while navigating inside the attached portal.
- **Basic Tooltip:** [A11Y] Replace the empty heading text by setting the `headingElements` to null for the modal headline on mobile devices.
- **Flyout Menu, Popup Menu, Toast Group:** Restrict TAB cycle.

### Fixed

- **Tag Input:** The tag label is broken after deleting a tag item.
- **Table:**
  - [A11Y] The empty footer should not have the aria-label and role attributes.
  - The current row is scrolled out of view after expanding.
  - Some properties do not work when they are defined in `htmlAttributes`, such as className, id, etc.
  - The `<p />` tag has margin and increases the Cell's height which leads to visual issues with the row.
- **Table, Tree, Tree Table:** The node is not clickable when text is selected in the window.
- **Attached Portal:**
  - Prevent memory leaks when blurring the Autocomplete in the Modal Overlay.
  - `onVisibilityChange` property isn't called in some cases.
- **Date Time Picker, Date Picker, Time Picker:** The focus is incorrect after clicking the clear button.
- **Date Time Picker:** [A11Y] The screen-reader's focus is not trapped inside the picker dialog.
- **Table, Tree Table:** Virtual scrolling does not support "SHIFT + Mouse Wheel" to scroll horizontally.
- **Switch:** [A11Y] The border of the thumb is partly overlapped by the icon inside when customizing the font in the browser settings.
- **Select:** The arrow is not centered causing inconsistent spacing between the left and right of the select.

### Dependencies Update

- `immutable` was downgraded to v3.8.2 to align with version used in other dependencies.

## 36.4.0

### New Features

- [A11Y] Support a visual indication for inputs widgets when customizing the color in the browser settings:
  - Autocomplete, Checkbox, Counter, Date Picker, Date Time Picker, Time Picker, Icon Picker, Dropdown, Multiselect, Select, Plugin Editor, Text Area, Text Field, Tag Input
- **Badge:** [A11Y] Support a visual indication for all badges when customizing the color in the browser settings.
- **Modal:** [A11Y] Support a visual indication to identify the modal overlay when customizing the color in the browser settings.
- **Button:** [A11Y] Support a visual indication for buttons, including styles for tabbing and hovering when customizing the color in the browser settings.
- **Flyout Menu:**
  - The `items: MenuItemType[]` property which is used to initialize the lists of menu items, which can now include both regular items and groups of items. It's a union type created by combining `MenuItem` and `MenuGroup`.
  - The `MenuGroup` type represents a group of menu items in the **Horizontal Flyout Menu**. It includes the following important properties:
    - `type` (required): to specify that it is a group. It accepts only one value, `group`.
    - `items` (required): to define a list of menu items within a group. This property must be used whenever `type` is specified.
    - `label`: to define the label for the group. If specified, it will be displayed as a tooltip in the non-condensed view and as a sub-header in the condensed view.
- **Progress Bar:** [A11Y] Support a visual indication for the progress bar when customizing the color in the browser settings.
- **Table:** Improve the interface to distinguish the row chosen to open the context menu.
- **Attached Portal, Callout, Comment Container:** Introduce the `referenceElementRect` property that receives a precomputed DOMRect value from the element that triggers the portal opening. If the reference element is partially overlapped, this given property will help to recalculate the portal's orientation to be displayed according to the element's visibility. To observe and get the visible part of the reference element, the **IntersectionObserverHelper** utility will be useful.
- **Tree - DnD:** Introduce the `strictDnD` property to indicate whether the droppable area is limited. Set this property to `false` in order to enable dropping on top or bottom of a node which behaves similar to `TreeTable`.
- **Table:** [A11Y] Provide an adjustment of aria attributes for the Expandable Table to fulfill WCAG.
- **Content Box:** [A11Y] The hidden heading text is only supported on desktop.
- **Link:** [A11Y] The `title` of the Icon is no longer supported in External Link and Mailto Link.
- [A11Y] Provide some support when customizing the color settings on a browser:
  - **Callout, Content Box, Modal Overlay, Flyout Menu, Popup Menu:** Add the visual indication to identify these Widgets.
  - **Switch:** Improve the visual indication between checked and unchecked states.
- Sliding Menu: [A11Y] Remove unnecessary `tabIndex` in `SlidingMenu.MainWrapper` to make screen-readers not focus on the wrapper twice on mobile devices.
- **HTMLInputAdapter:** The `HTMLInputAdapter` HOC is now able to receive Class components without TypeScript complaining about the types.

### Fixed

- **Progress Bar:** The background color on the secondary button does not update when switching themes.
- **Tooltip, Callout, Comment Container:** Get the wrong orientation when an element that triggers a tooltip, callout or comment container is overlapped by other elements.
- **Content Box:** [Flat/Flat Compact] The Content Box, which has a styling `boxShadow` property and no footer, encounters overlapping corners at the bottom.
- **Callout:** The pointer is not visible in some orientations, such as `top`, `bottom`, `left-start`, `left-end`, `right-start`, and `right-end`.
- **Flyout Menu:** Cannot open the condensed menu with the first click on touch devices.
- **Tooltip:** Flickering on hover at the edge of the trigger element.
- **Context Menu**: Revert the changes that prevent other interactions with the background when the context menu is open. These changes cause some side effects such as:
  - Inability to interact with elements on the Modal Overlay when opening it from the context menu.
  - Disabling of other interactions when opening another attached portal on the Table page.
- **Autocomplete:** If no option is selected, the previous search text will not be reset when refocusing on the input.
- **File Upload:**
  - [A11Y] The File Name that is displayed as a link is read twice and has unnecessary semantic information (read both "button" and "link").
  - [A11Y] Focus after uploading is not correct when using screen readers.
- **Helper Classes:** Helper Classes are not applied to the Multiselect.
- **Text Output:** Bullet list icons are cut-off in Compact and Flat Compact themes.
- **Select:** The select arrow overlaps the text.
- **Date, Time, Date Time Picker:** The picker cannot be opened in small screen if it overflows the viewport.
- **Plugin Editor:** Editor does not scroll after line break.
- **Custom Select, Date Picker, Date Time Picker, Multiselect, Text Area, Text Field, Time Picker:** [A11Y] Inputs - remove hidden placeholder repetition.
- **Badge:** The `getBadgeTitle` function returns the wrong value when assigning the `customTitle` property an empty text value.
- **Layout Grid::** The Column with `noGutter` does not work properly if `layoutConfig` is given.
- **Responsive Button Group, Flyout Menu:** Provide the `labelHidden` property that allows the user to hide the label but still be used as the item text in the responsive popup menu.
- **Modal Overlay:** Cannot interact with modal content on iPad using Apple Pencil.
- **Sliding Menu:** Cannot update the new selected menu item.
- **Application Frame, Menu:** Some redundant styling settings lead to visual issues, such as inconsistent font-size between the application `main` area and the global styles.
- **Pagination:** [A11Y] Focus does not stay at the disabled button after reaching the first/last page.
- **Tag Input:** [A11Y] Cannot swipe to select the active element in the dropdown list.
- **Table:** Show badge indication on table row when displaying Loading indicator.
- **Buffered Input:** The value is cleared after blurring.
- **Time Picker, Date Time Picker:** The time is incorrect after formatting when the given timezone is set to `UTC`.

### Deprecation

- **Flyout Menu:** The `children` property which is used to initialize sub-menu items has been deprecated. Replaced by the `items` property that can have both regular items and groups of items.

## 36.3.4

### Fixed

- **Table:**
  - Breaking change due to Context Menu's data-role changes.
  - Also, revert the new `dataRole` property for Attached Portal that was added in **36.3.2**.

## 36.3.3

### Fixed

- **BufferedInput:** Internal state has higher priority than property `value` even if the property is not expected to change.

## 36.3.2

### New Features

- **Attached Portal:** Provide the `dataRole` property that allows the user to pass a custom `data-role` for the attached portal.

### Fixed

- **Attached Portal:** Cannot interact with background content or elements when opening an attached portal before rendering a table.

## 36.3.1

### Fixed

- **Date Picker:** react-day-picker title property is incompatible with the widget's property.

## 36.3.0

### New Features

- **Table:** Prevent users from interacting with the background content or elements of the webpage when the context menu is open.
- **BufferedInput:**
  - Introduce the `submitOnEnter` property that allows users to press ENTER key to trigger a changing of the input value.
  - Support browser autofill by triggering the corresponding `onValueSubmit` callback when the value changes on autofill.
- Provide reference properties for some missing input components such as Multiselect, DateTimePickerInput, CheckboxGroup, Radio.
- **Dropdown:** Introduce `links` property to customize additional items with functionalities. They will be displayed as a top part of the dropdown.
- **Autocomplete:**
  - Introduce `links` property to provide additional items with functionalities. They will be displayed as a top part of the dropdown.
  - Introduce `closeAndResetOption` handler property that triggers the dropdown's close event.
- **Table, TreeTable, Tree:** [A11Y] Add visual indication badges for different row purposes (success, disabled, info) when customizing the color settings.
- **Switch:** [A11Y] Support a visual indication for switches thumb when customizing the color in the browser settings.
- **Toggle Button:** [A11Y] Support a visual indication for basic and simple toggle button when customizing the color in the browser settings.
- **Message Box:** Adjust Message Box's label to take up full width if no action is given.
- **Sliding Menu:** [A11Y] Parent menu item should get focus after expanding/collapsing its sub-menu.
- **Wizard:** [A11Y] Support a visual indication for the selected step when customizing the color in the browser settings.
- **Date Picker, Time Picker, Date Time Picker:** [A11Y] Associate the label's id with the picker button for a better accessibility experience.

### Fixed

- **Table:**
  - Checkboxes and Radio buttons inside the Table Header are not aligned when the Table's column is set to center horizontally.
  - The head cell content of the action column is broken when the body cell has a smaller width.
- **Tree Table:** `HiddenText` is still available when the hidden root is defined via `data` property.
- **Tree:** [A11Y] The disabled node doesn't need to have the `title` attribute.
- Some widgets, such as Quick Chat, Radio Button, Checkbox, Sidebar, Header, etc., display incorrect styling when applied in isolation.
- **Autocomplete:**
  - Empty dropdown list after typing unmatched value and combine keyboard + mouse.
  - The input caret position from middle always jumps to the end of input text after filtering matched items.
  - Cannot create a new item if the `items` list is initialized empty.
  - Inconsistency in whether the dropdown list is opened with all items or not.
- **Multiselect, Autocomplete:** Focused input opens the dropdown list unexpectedly when changing browser tabs (Google Chrome).
- **Multiselect:** Checking the current device from the internal `isMobile` variable and the `mobile` props is inconsistent.
- **Stackable Toast Group:** NVDA repeats the weird text of the invisible toast behind after reading the newest toast.
- **File Upload:** [A11Y] Label is not read and missing semantic information (read as "button") for the File Upload in compact mode.
- **Date Time Picker, Date Picker:** The picker portal is closed unexpectedly when switching previous/next month.

## 36.2.1

### Fixed

- **Autocomplete:** Completely revert the Extended Autocomplete with Link Options (A12W-9767) and some relevant tickets (A12W-9994, A12W-10091) that made breaking changes of ESC-function and selecting options.
  - A12W-9767: Extended Autocomplete Widget
  - A12W-9994: [A11Y] Extended Autocomplete - Accessibility issues
  - A12W-10091: Autocomplete - empty dropdown list after typing unmatched value and combine keyboard + mouse

## 36.2.0

### New Features

- **Table:** Introduce `collapsed` property for `RowsGroup` from `TableRowsGroup` to specify whether the sub rows should be hidden or not.
- **Tree Table:** The Drag and Drop always allows for dropping a row onto the top area of another row.

### Fixed

- **Multiselect:** [Mobile] The virtual keyboard is displayed when user clicks the dropdown's close icon in the modal overlay.
- **Tree:** The arrow button does not have the min-height.
- **Table:** The focused row is not highlighted after closing the corresponding context menu.
- **Pie Chart:**
  - Blurred styles of the legend entries and pies are not removed after clicking outside the legend box.
  - Chart pie and chart legend are not highlighted after selecting chart pie with a single click, but with a double click.
- **Autocomplete:**
  - Selecting the currently selected item still causes `onValueChange` to be triggered.
  - Desktop: When typing to search for an item in autocomplete, the selection range keeps highlighted after selecting an item.

### Deprecation

- **TableRenderPropsType.DndBodyRowProps:** The `shouldRenderTopDropTarget` property has been deprecated.

## 36.1.2

### Fixed

- **Autocomplete:** Revert the changes from A12W-9767, A12W-9994 and A12W-10091 that made a breaking change that cannot blur the input to add a new value via click.
  - A12W-9767: Extended Autocomplete Widget
  - A12W-9994: [A11Y] Extended Autocomplete - Accessibility issues
  - A12W-10091: Autocomplete - empty dropdown list after typing unmatched value and combine keyboard + mouse

## 36.1.1

### Fixed

- **PopUpMenu:** Cannot trigger `List.Item` via ENTER due to `onKeyUp` handler property.

## 36.1.0

### New Features

- **DateInput:** Introduce a new property `valueChangeHandler` that provides a handler to update the selected value from outside.
- **Application Frame:** Introducing a new `stickyFooter` property to specify whether the footer has a sticky style.
- **List:**
  - Introduce a new `onKeyUp` property for the **List.Item** that triggers event when a key is released. Should use this property instead of `onKeyDown` for closing modal.
  - For supporting A11Y:
    - Add `role="button"` to the interactive SubHeader.
    - Introduce `onKeyDown` and `onKeyUp` properties to allow keyboard event on the SubHeader.
- **Helper Classes:** Background Color Helper Classes can be applied to `Radio` and `Checkbox`.
- **widgets-core:** styled-components are now integrated with babel-plugin.

### Fixed

- **Date Time Picker:** Picker button is still active when setting disabled to the DateTimePickerInput.
- **DatePicker:**
  - Incorrect date value when picking a date from the DatePicker after changing the system's timezone.
  - The label is not linked correctly to the `aria-describedBy` property when there is an error message.
  - Picker button is still active when setting disabled to the DatePickerInput.
- **Tree Table:**
  - A11Y: `HiddenText` element is still available when the only node is hidden by `hideRoot` property.
  - Drag and Drop: Border is cut off when dragging a node to the bottom area of a virtual scroll tree table.
- **Simple Toggle Button:** When a toggle button is pressed/selected screen readers repeat 'selected' two times.
- **List:** After the focused meta component changed (remove, update), the hover effect on the list item stopped working.
- **Attached Portal:** Attached Portals are not updating their position when the DOM change the position of the `referenceElement`.
- **Modal Notification:** `onClose()` function is called twice.
- **Table**: Interactive HeaderCell does not get focused after closing its corresponding Context Menu.

### Deprecation

- **DateInput:** The `clearHandler` property has been deprecated. Please use the `valueChangeHandler` property instead.

## 36.0.0

### Breaking Changes

- **Date Picker, Date Time Picker:**
  - Some changes of `datePickerProps` (DatePicker) and `pickerProps` (DateTimePicker):
    - Some properties have been removed: `localeUtils`, `tabIndex`, `containerProps`, `onBlur`, `onFocus`, `onKeyDown`, `onTodayButtonClick`, `onCaptionClick`, `onDayMouseUp`, `onDayMouseDown`, `renderDay`, `renderWeek`, `enableOutsideDaysClick`, `todayButton`, `showWeekDays`, `weekdayElement`, `weekdaysLong`, `weekdaysShort`, `navbarElement`, `captionElement`, `canChangeMonth` (use `disableNavigation` instead).
    - Some properties have been renamed:
      - `disabledDays` to `disabled`
      - `selectedDays` to `selected`
      - `showWeekNumbers` to `showWeekNumber`
      - `firstDayOfWeek` to `weekStartsOn`
      - `initialMonth` to `defaultMonth`
      - `onWeekClick` to `onWeekNumberClick`
    - Types of the [labels](https://react-day-picker.js.org/api/types/Labels), [classNames](https://react-day-picker.js.org/api/types/ClassNames) properties have been changed.
    - `DatePickerModifier` is removed - use `Matcher` directly from react-day-picker instead. `DaysOfWeek` Matcher has been renamed to `DayOfWeek`.
  - `DateTimeUtils.isRangeModifier` is changed to `DateTimeUtils.isRangeMatcher`.
  - Some updates of styling:
    - `datePicker.weekday.margin` is replaced by `datePicker.weekday.padding`
    - `datePicker.weekday.size` is replaced by `datePicker.weekday.width`
    - `datePicker.weekdaysRow.padding` is removed
    - `datePicker.body.horizontalCellSpacing` and `datePicker.body.verticalCellSpacing` are added to support spacing configuration between day cells.
    - `dateTimePicker.dateScreen.datePicker.weekdaysRow` is removed and replaced by `weekDay`
  - When a modifier matches a specific day, its day cell will not receive the modifier's name as a CSS class anymore.
  - When using Tab with Date Picker/Date Time Picker, the focus of the day will be in order of priority: selected day => today => first day of the current month.
- **formatTimezoneDateTime:** For simplicity, this utils function now takes an object as an argument instead of 4 separate parameters.

### New Features

- **Diagram:** Introduce a new property `readonly` for diagram shapes (Node, Label, Port).
- **Button:** Prevent overwriting aria-label from `buttonAttributes` with title.
- **Content Box:** Introduce a new property `boxShadow` that specifies whether the ContentBox should have a box-shadow or not.
- **Icon:** Introduce `rounded` Material icons theme.
- **Menu:** Introduce a new property `ariaLabel` for Menu Items to specify their aria-label attribute.
- **Table:** The `onClick` callback in the `RowEventHandlers` is now having the click event as its parameter.
- **Time Picker:** Introduce `TimePickerTpl`, which exports the `Header` component for use instead of having to import the `Header` from the **time-picker.internal.tsx** file.

### Fixed

- **Pie Chart:** A black border around pie components.
- **Table:**
  - Context menu for vertical header is not available when only `headContextMenuRenderer` is given.
  - Context menu is not scrollable when its items overflows the portal's height.
- **Time Picker:** Time Picker in the Table body cell does not have full width.
- **Date Time Picker:** DateTimePickerInput does not update value correctly while blurring.
- **Modal Overlay:** ModalOverlay reopens after closing by an interactive element inside.
- **Tag Input:** The tag cannot be created from the suggestion list if the input value matches the created tag.
- **Table, Tree and Tree Table:** Cannot click a draggable tree node or table body row in Firefox when it's highlighted by browser search (Ctrl + F).

### Deprecation

- **Flyout Menu:** The `disableCondensing` property has been deprecated.

### Dependencies Update

| Name                  | Old version | New version  |
| --------------------- | ----------- | ------------ |
| @types/draft-js       | 0.11.9      | 0.11.10      |
| @types/scheduler      | 0.16.2      | 0.16.3       |
| typescript            | 4.5.5       | 4.9.5        |
| recharts              | 2.1.16      | 2.5.0        |
| deepmerge             | 4.2.2       | 4.3.1        |
| immutable             | 4.1.0       | 4.3.0        |
| moment-timezone       | 4.3.0       | dayjs^1.11.7 |
| react-resize-detector | 7.1.2       | 8.0.4        |
| react-rnd             | 10.3.7      | 10.4.1       |
| react-scroll          | 1.8.7       | 1.8.9        |
| react-day-picker      | 7.4.10      | 8.6.0        |

## 35.1.4

### Fixed

- **Pie Chart:** Provide `onMouseEnter`, `onMouseLeave` or `onClick` to `legendProps` property make legend not highlighted when trigger corresponding event.

## 35.1.3

### Fixed

- **Date Picker:** Some properties extends from TextLineStatelessProps (E.g. addonBefore, addonAfter, suffixes, prefixes, className,...) cannot be passed through into DateInput.
- **Date Time Picker:**
  - Auto change time format from 24h (E.g. 15:30) to 12h (E.g. 3:30 PM) when click-and-hold the date or blur the input.
  - Wrong placeholder for time input in 24h mode. It should be **HH:mm** instead of **hh:mm A** (format of 12h mode).

## 35.1.2

### Fixed

- **Autocomplete & Multiselect:**
  - Screen readers on Mobile:
    - Needs to swipe twice to navigate out of the element.
    - Could not focus and read dropdown items in the modal.
    - Closing the modal shows the virtual keyboard.
  - The selected item is not highlighted in some cases.
- **Multiselect:** Crash when `hintTemplate` property is empty.
- **List:** The list's background color was lost when updating to Styled Components.
- **Toggle:** Missing fontSize theming config value for the Overlay button when the `showOnlySelectedOption` property is set.
- **Typography:** The focused headline collapses/expands on TAB when NVDA is on.
- **Date Picker:** The `inputProps` property does not work in DateInput widget.

## 35.1.1

### Fixed

- **Editor**: Mention Plugin with Link Plugin always removes mention entity if adding text before it.

## 35.1.0

### New Features

- **File Upload:** The file upload should be read by screen readers when loading.
- **Text Output:** Introduce a new property `infoMessage` to represent the rule-level "info".
- **Toggle:** Provide style configurations for the Toggle.Item when the `showOnlySelectedOption` property is set.
- **Plugin Editor:** Provide the ability to disable a custom button.
- **Flyout Menu:** Provide the ability to have a badge for the 3-dot-menu item in a responsive menu.
- **Date Time Picker:**
  - Introduce `dateTimeConverter` and `dateTimeFormatter` properties to customize the way to parse input string and format date time representation.
  - Introduce `readonly`, `disabled` and `error` properties.
  - Introduce `hidePickerButton` property to hide the date time picker button.
- **Pie Chart:** Provide the ability to disable sorting of the legend entries and pies.

### Fixed

- **Tooltip:**
  - Attached portal should close by tabbing.
  - Fixing tooltip shows title of parent element when being hovered.
  - Infinite loop on certain screen size.
- **Tree Table:** Remove the hidden span for the empty tree table.
- **Filter:** Fixing unexpected space from filter in filter bar.
- **Text Field:**
  - The input text in a modal is aligned to the bottom a bit.
  - Does not have `HiddenText` with the given `placeholder`.
- **Text Area:** Does not have `HiddenText` with the given `placeholder`.
- **Modal Overlay:** Fixing unexpected border radius from fullscreen with no gutter modal overlay with content box inside.
- **Tree:** [Compact/Flat Compact] The arrow icon button is not centered vertically.
- **Table:** Sub info and pinned column - missing styles
  - The first column: the left outline is lost when the row is focused.
  - The last column: the right outline and border are lost when the row is focused or hovered.
- **Button:** Icon in Icon Button is not showing its `variant` color when the Button is hovering.
- **Plugin Editor:** `mention-plugin` suggestions with long text overflows the wrapper's width.
- **File Upload:** The upload button's text and icon are not shown in readonly mode.
- **Simple Toggle Button:** Screen reader problems with disabled/readonly button and keyboard use.
- **Flyout Menu:**
  - The horizontal menu is cut off on small screens.
  - The responsive menu is not updated correctly when the menu item's text has changed.
  - A11Y: Screen readers does not read badge from condensed menu item.
- **Autocomplete:** Screen readers do not read the grouped item's position and the group section it belongs to.
- **Radio:** Wrong cursor at the readonly and disabled radio item.
- **List:** [A11Y] Using Tab key after navigating by arrow keys when NVDA/JAWS is on makes the next `List.Item` triggers the `onClick` event.

## 35.0.0

### Breaking Changes

- **Button:** Styling config system has been refactored, introducing new config options for customizing interaction behavior for each variant of button.
- **Master Detail:** Remove Master Detail layout view navigation bar
  - Remove `hideNavigationOptions`, `navigationElementId`, `viewSelectionPlaceholder`, `onSelectMinimizedView`, `minimized` properties.
  - Remove `MinimizedView` interface.
  - Remove variables styles `{panesMinimized: { margin: string; minWidth: string; respMargin: string; respPadding: string; width: string }}`
- Switch to a forked version of react-virtualized (new name: **@com.mgmtp.a12.widgets/react-virtualized-fork@10.0.0**) to allow installing with newer npm version without error.
- **Time Picker:** `onValidationError(value)` has been removed, introducing new `onValidate({value, valid})` property with these params.
  - `value`: value after typing
  - `valid`: result of that value is valid or not
- **Native Select:** Remove `onSelect` property.
- **Link:** Make the distinction between the `Link` and HTML attributes by introducing the new properties
  - `linkAttributes` contains and allows access to the HTML attributes
  - `href` the linked document, resource, or location
  - `title` title of the link
  - `target` where to open the linked document
  - `onClick` handle event when clicking on the link
- **File Upload:** Type of property `onUploadAreaClick` in `FileUploadProps` and `DefaultFileUploadProps` is changed from `boolean | undefined` to `boolean | void`.

### New Features

- **Master Detail:** Add padding config for content box inside master detail layout.
- **Tree:**
  - For supporting A11Y:
    - Add `dataRole` and `ariaHidden` properties to TreeContainer.
    - Add `role` property to TreeContainer, TreeNode, TreeNodeContainer and SubNodesContainer.
    - Add `title` attribute for interactive list item.
    - Set default localized `HiddenText` for selected, disabled, success-highlighted and highlighted item.
- **Multiselect:** Input is now empty when getting clicked or tapped.
- **Dropdown:** Introduce a new property `footer` to display element(s) at the bottom for extended functionality such as loading more items.
- **Autocomplete:** Introduce a new property `dropdownFooter` to display element(s) at the bottom of the dropdown for extended functionality such as loading more items.
- **File Upload:** Enable `onUploadAreaClick` in read-only mode.
- **Diagram:** Introduce new configs for selected diagram node and label.
- **Table:** Styles for Table FootRow to display summary information.
- **Badge:** Introduce a new property `position` to customize the position of the non-standalone Badge.

### Fixed

- **Button:** Missing hover/active/focus styling config variables for button variants.
- **Autocomplete:**
  - Options in dropdown are filtered when `openOnFocus` property is set to `false`.
  - Mobile: pre-selected item is not saved when click "Save and close" button.
- **Text Area:** Tag widget inside Affixes from TextAreaStateless removed only after double click on iOS device.
- **Plugin Editor:** Mention Plugin always removes its entity if having a non-breaking space before it.
- **Checkbox, Tooltip:** Some styles of widgets that could be previously customized can no longer be customized via the new widget configs.
- **Toggle Button:** Slightly smaller when having `disabled` or `readOnly` properties.
- **Table:**
  - Drag and Drop Table does not allow to insert before the first element.
  - Unexpected style when hovering the first and second row of table inside additional content from expandable rows.
  - Horizontal Scrolling on macOS/iPadOS is not as smooth as before.
  - FootCell width is not correct when enabling resizing columns.
  - Missing left-outline of first header cell when being focused in Select and Sort Table.
  - Table inside Additional Content from multiple expandable rows does not have synchronous column's width.
  - Horizontal headers flicker when hovering cells from the same column in cellHighlighting mode.
  - Vertical headers flicker when hovering their borders in cellHightlighting mode.
  - onContextMenu event is not called when passed in TableTemplate.BodyRow.
  - Table with cellHighlighting also highlights the corresponding cell from the subInfo column.
  - Table Body Rows flicker when hovering rows from table containing subInfo column.
  - Virtual scrolling does not resize correctly when the browser resizes quickly.
  - The subInfo cell is not highlighted when clicking on the non-interactive row.
- **Multiselect:**
  - Press Enter on multiselect items also triggers the item's select/de-selection.
  - Cannot open dropdown after doing navigation by arrow keys when clicking label/helper text.
- **Editor:** Link Plugin always removes entity that is not an url.
- **Dropdown:** Styling config values for hint is not consistent & missing independent fontSize for hint, item and section.
- **CSS Ellipsis:** CSS Ellipsis content not truncated correctly when initial children is empty.
- **Time Picker:**
  - `timeFormatter` is not called when it is changed from outside.
  - `onChange` is not called when changing input value from invalid to empty.
  - Unexpected data-role "time-picker" on the wrapper.
- **Compact File Upload:** File name with `textOnlyDisplay` has a big height.
- **Typography:** Fixing `Typography.Headline` is not centered correctly when they have multiple lines.
- **Tag Input:**
  - Tag Input mobile use has two headings.
  - Cannot prevent users from creating duplicated tags in some cases.
- **Attached Portal:** Displays at wrong position in case resizing browser.
- **Toast Group:**
  - Temporary toasts inside `stackable` ToastGroup disappear when opening its popup menu.
  - While expanded, the last temporary toast inside `stackable` Toast Group took longer to close when clicking outside.
- **Custom Select:** When the `keysToOpen` and/or `keysToClose` properties are defined, the default open/close keys are not overridden.
- **Helper Classes:** The text that has special characters in `Select` is mirrored when h_rightAlign is used.
- **Text Line, Text Area :**
  - Setting input value with javascript does not work.
  - Label is read twice if the input has affixes.
- **Select:** The read-only has wrong background in Table's row.
- **Autocomplete:** Supports showing matches when the user types word accents.
- **Date Picker, Time Picker, Date Time Picker:** Missing id for the trigger button.

### Deprecation

- **Card:** `useLinkRole` property has been deprecated.
- **File Upload:** `ariaDescribedby` property has been deprecated. Use `ariaLabelledby` instead.

### Dependencies Update

| Name              | Old version | New version                                          |
| ----------------- | ----------- | ---------------------------------------------------- |
| detect-it         | 1.1.0       | 4.0.1                                                |
| recharts          | 2.1.9       | 2.1.16                                               |
| react-virtualized | ^9.22.3     | @com.mgmtp.a12.widgets/react-virtualized-fork@10.0.0 |

## 34.7.8

### Fixed

- **Icon:** Some icons with theme "filled" will not be mapped correctly due to missing fallback.

## 34.7.5

### Fixed

- **Tag Input:** Cannot prevent adding duplicate tags when using the creation keys (the default is `comma` key).

## 34.7.4

### Fixed

- **Plugin Editor:** Mention Plugin always removes its entity if having a non-breaking space before it.

## 34.7.3

### Fixed

- **Table:** `onContextMenu` event is not called when passed in TableTemplate.BodyRow.

## 34.7.2

### Fixed

- **Typography:** Fixing `Typography.Headline` not centered correctly on line break.
- **Table:** Unexpected style when hovering the first and second row of table inside additional content from expandable rows.
- **Text Area:** Tag widget inside Affixes from TextAreaStateless removed only after double click on iOS device.
- **Checkbox, Tooltip:** Some styles of widgets that could be previously customized can no longer be customized via the new widget configs.

## 34.7.1

### Fixed

- **Plugin Editor:** Link Plugin always removes entity that is not an url.
- **Toast Group:**
  - Temporary toasts inside `stackable` ToastGroup disappear when opening its popup menu.
  - While expanded, the last temporary toast inside `stackable` Toast Group took longer to close when clicking outside.

## 34.7.0

### New Features

- **Compact File Upload:** Provide a new property `showAsLink` in FileOptions to display a plain text if no file has not been uploaded yet.
- **Popup Menu:** Introduced the `orientation` property, which allows for customizing the positioning of the popup menu.
- **ToastGroup:**
  - Introduced the `onToggleStack` property, which returns the current stacking state and allows for handle toggling Toasts in `stackable` ToastGroup.
  - A11Y: The toolbar title of `stackable` Toast Group is now having `role="heading"` and `aria-level=2`, title of toasts inside are then set to `aria-level=3`.
  - A11Y: The `stackable` Toast Group now has a container with `role="status"` to make screen readers read the newest toast added to the group.

### Fixed

- **Compact File Upload:**
  - Able to drag and drop if `readOnly` is set to true.
  - If `readOnly` and `textOnlyDisplay` are set to true and a tooltip is given, the link text and tooltip are not aligned.
  - Component does not stretch to `maxWidth` if it's placed in a bigger table cell.
- **List:** Graphic icon with variant in `List.Item` is not having their variant color.
- **ToastGroup:**
  - A11Y: The Toast Group is no longer `focusOnMount` when having `stackable` property.
  - A11Y: `temporary` toasts inside `stackable` Toast Group are now stay visible while having focus on the Toast Group.

## 34.6.0

### New Features

- **Simple Toggle Button:** Support accessibility.
- **Table:** Support `cellHighlighting` for Touch Device, Mobile, Tablet.
- **Tab Panel:** Additional Information is now read by screen readers.
- **Date Picker:**
  - Introduce `hidePickerButton` property to hide the picker.
  - Introduce `customPickerButtonIcon` property to customize the icon of the picker button.
  - Introduce `clearHandler` property to clear all current values.
- **Wizard:** The step which is selected by triggering the button "previous" or "next" should not read by screen readers.
- **ToastGroup:**
  - Provide `stackable` property to display the Toast Group as a stack of Toasts.
  - Provide `stackToolbarItems` and `stackToolbarTitle` properties to customize the Stackable Toast Group's toolbar.
- **Time Picker:**
  - Adding `Enter` press handler to submit value after user types to time picker input.
  - Introduce `addonBefore`, `addonAfter`, `infoMessage`, `info`, `warningMessage`, `warning`, `tooltips` and `ariaDescribedby` to enhance Time Picker Input.
  - Introduce `timeInputWrapperProps` to pass DOM properties to the time picker input wrapper.

### Fixed

- **Autocomplete, Multiselect, Icon Picker, Custom Select:** The dropdown is not displayed when the keyboard is on if the input stays in the bottom of the page view on Ipad.
- **Theme:** Merging theme config does not work as expected.
- **Table:**
  - Unexpected width and min-width for table cell inside Expandable Row.
  - Missing border bottom of cells when mousing over in cellHighlighting mode of drag and drop, expandable table.
  - Hovering over cells from disabled row in cellHighlighting mode still highlights corresponding horizontal headers.
  - Missing default aria-label when project uses handler event directly to `bodyRowRenderer`.
- **Tag input:** Connected toast is not shown when entering duplicated tag on touch devices.
- **DateInput:** Propagates wrong Date/DateRange value in `timezone` mode.
- **Tree Table:**
  - Missing default `HiddenText` when project uses handler event directly to `bodyRowRenderer`.
  - Unchanged mouse cursor for node type with unallowed drag and drop property.

### Deprecation

- **Tab Panel:** Deprecated `ariaDescribedby` property, use `ariaLabelledby` instead.

## 34.5.0

### New Features

- **Table, Tree Table:** Provide property to disable arrow navigation behavior.
- **Wizard:** The step which is selected by triggering the button "previous" or "next" is now read by screenreader.
- **Connected Toast:**
  - Introduce `type` property to specify the connected toast is permanent or not.
  - Support a11y by adding default localized `HiddenText` for Connected Toast.
- **Tag Input:**
  - Connected toast message for duplicate tag will have no time limitation.
  - Default localized message for duplicate tag case.
- **Toast:** Provide `focusOnMount` property to set focus on the Toast when it has finished rendering.
- **Autocomplete, Multiselect, Icon Picker, Tag Input:** Introduce `openOnFocus` property that allows to prevent opening the list when focusing the input by setting it to `false`.
- **Time Picker:**
  - Introduce `hideLabel` property to hide the label of time picker but screen readers still can read it.
  - Introduce `focusOnInputAfterPicking` property to support ability to focus on time picker input after clicking ok button from time picker dialog.
  - Introduce `onInputChange` property to listen to every input change from user.
- **Progress Bar:** Introduce a new component to show a better indicator of the process.
- **Button, List:** Introduce `processedPercentage` property to make `Progress Bar` shown inside the component.
- **Custom Select:**
  - Introduce `selectWrapperId` property to identify the select's wrapper.
  - Introduce `selectWrapperInModalRef` property to reference the select's wrapper inside the modal on mobile.
  - Introduce `keysToOpen` property to open the modal on mobile or the dropdown on desktop.
  - Introduce `modalProps` property to customize the modal on mobile.
- **FileUpload:**
  - Supports the File Name Preview for document type uploading
    - Introduce `compact` property to display the normal file upload before uploading but with smaller height.
    - Introduce `fileOptions` property to display the chosen file as a link. It returns a type of `DefaultFileUploadProps.FileOptions` that contains:
      - `name`: label of the link
      - `icon`: icon places in front of the name
      - `linkProps`: properties of link like title, event handlers,...
      - `textOnlyDisplay`: the link of file name will be placed inside TextOutput and no truncation. It should be used with `readOnly` File Upload.
    - Introduce `loadingLabel` property to display the label of the loading state.

### Fixed

- **Multiselect:** [A11Y] Redundant aria-selected in Multiselect's dropdown items.
- **Global Styles:** Missing `addPrefix` in base class.
- **Table:** Fixing wrong padding of body cell in flat-compact theme.
- **Showcase Searchbar:** Misleading search items when searching for some subsections.
- **Indeterminate Checkbox:** Wrong hover/active behavior in disabled/readonly mode.
- **Simple Toggle Button:**
  - Hovering over multiple Buttons leaves some options visible after unhovering the buttons.
  - Press Enter on a focused option trigger to select the option, deselect other options, and show the focused Initial State.
  - Touch optimized.
- **Text Line:** Allow passing `virtualKeyboardPolicy` property to TextLineStateless component.
- **Autocomplete:** The search shall be triggered with the current value of the input.
- **File Upload:** File Upload loses focus after replacing.
- **ApplicationFrame:** None content is shown when `sub` property is `undefined` and `expandedSubState` property is set to `true`.
- **Autocomplete:** [Ajax support] Cannot delete the input's content while the dropdown is loading.
- **Attached Portal:** Wrong position of portal when rendering widget root with transform style.
- **Helper Classes:** Incorrect padding in `Select` when h_rightAlign is used.
- **Editor:** Link Plugin has misleading links when having special character before it.
- **Layout Grid:**
  - The single column has width of 50% is not aligned with 2 columns with the same size.
  - The grid/column that contains rows displays scrollbar if custom height of rows are defined.
- **Multiselect:** Cannot focus back on tooltip when closes tooltip content by ESC key.
- **Button:**
  - Inverted Icon Button: passing `disabled` property does not change the UI of the button to disable.
  - Inverted Secondary Button: passing `disabled` property does not change the border-color of the button to disable.
- **Sliding Menu/Flyout Menu:** Fix `scrollToSelectedItem` does not work properly when fetching item list from store.
- **TextLineStateless**: Allow passing `virtualKeyboardPolicy` property to TextLineStateless component.
- **Time Picker:**
  - `label` property accepts React.ReactNode instead of string.
  - Fixing `onChange` callback should only be called when the time value actually changed.
- **Table:** Fixing missing bottom margin for not-last-child time picker in filter head from Table.
- **Custom Select:** On mobile devices:
  - A11Y: Screen readers does not read value.
  - Value is changed after closing the modal by Close button.
  - Virtual keyboard is shown when triggering focus event using `selectRef`.
  - Set `focusBack` property to false keeps focus to the select's wrapper.
  - `selectRef` returns wrong reference after closing modal.
  - Triggering focus changes via `onModalClose` property does not work.
  - `openOnFocus` does not work.

## 34.4.0

### New Features

- **Global Message Box:** Prevent the tab-focus from tabbing to wrapper.
- **Time Picker:**
  - Introduce `timeConverter` and `timeFormatter` properties to customize the way to parse input string and format time representation.
  - Introduce `readonly`, `disabled` and `error` properties.
  - Introduce `hidePickerButton` property to hide the time picker button.
  - Introduce `clearHandler` property to obtain the handler to clear input and internal time value.
- **Wizard:** [A11Y]
  - The selected step is now read by screen readers.
  - The left-out step is read as three dots [. . .] with non-breaking spaces and left-out step button will be non-readable.
- **Global Message Box:** Prevent the tab-focus from tabbing to wrapper.
- **QuickAccessButton:** `QuickAccessButton` is now supported in `responsive` `ButtonGroupContainer`.
- **Button, Contentbox, File Upload, Header Trigger, Link, List, Menu, Message Box, Modal Notification:** Add more configs for styling.
- **FileUpload:** Supports `errorMessage, warningMessage, infoMessage` and `label` when using custom children.
- **LoginLayout:** Improve A11Y for Login Layout on small screen.
- **AttachedPortal:** Clicking into `<iframe/>` elements are now trigger the `onClickOutside` property.
- **Table:**
  - Introduce `headContextMenuRenderer` property for customizing context menu for Table Header with `closeHandler` property to close context menu and `column` to represent content of column, to which the header belongs to.
  - Introduce `verticalHeader` property of Column to identify whether the column is a vertical header in a Cross Tabulation or not. If set to `true`, that column will have the same styles as the horizontal column and pinned left by default. Once `verticalHeader` property is set, the other left side pin would be considered as a vertical header as well.
  - Introduce `cellHighlighting` property for Table to identify whether the body cell and corresponding header cell will be highlighted when mousing over on body cell.
- **Icon:** Add 3 new custom icons (delete_hint, unpin, version).

### Fixed

- **Progress Button:**
  - The overlay appears without blinking.
  - Adjust color of spinner to blue in all themes.
  - Support accessibility.
- **TimeUtils:** Remove reference comparison in `isSameDate` function.
- **Split View:** Cannot set percentage width properly for Right Area in Split View.
- **FlyoutMenu:**
  - Customizing config values for default/hover/active/focus menu-item's color are now also applied to items inside sub-menu.
  - Cannot close subMenu when click into `<iframe/>` elements.
- **Buttons:** Missing config variables for active/hover/focus border-color.
- **IconPicker:** Does not update input's value correctly when `selectedIcon` property changes from a valid value to `undefined`.
- **List:** Prevent passing `onClick`, `onKeyDown` event handlers to non-interactive `List.Item`.
- **Charts, CollapsiblePanel, DatePicker, Editor, FilterBar, Select:** Missing styling config variables.
- **Autocomplete, CustomSelect, Multiselect:** [Mobile] Title for Close button of addon inside modal is not correct.
- **Table:**
  - Unexpected scrollbar shown at the bottom when switching to card view.
  - Missing default `aria-label` when project uses handler event directly to `bodyRowRenderer`.
  - Expandable Row gets grey background on hovered when standing independent on another body row.
  - `HiddenText` of Success row is added unexpectedly into first 2 cells of a row.
- **Tree Table:** Missing default `HiddenText` when project uses handler event directly to `bodyRowRenderer`.
- **Tooltip:** Icon big size does not work properly with tooltip.

### Deprecation

- **Time Picker:** `InputProps` interface has been deprecated. Please use `TimeInputProps` instead.
- **TimeUtils:** `isSameDate` function is deprecated. Please use `isSameTime` instead.
- **QuickAccessButton:** `children` property has been deprecated, please use `actionItems` property instead.
- **ButtonGroupContainer:** `leftSlot` and `rightSlot` properties have been deprecated, please use `leftSlotButtons` and `rightSlotButtons` properties instead.
- **Status:** `light` property has been deprecated, please customize the widget by config variables instead.

## 34.3.0

### New Features

- **Status:** new widget that could indicate the current characteristics of an object
  - Status can be displayed in 3 combinations:
    - icon and text
    - icon only
    - text only
  - Properties:
    - `icon`, `children` icon and text content
    - `variant` type of status: info (default), success, warning and error
    - `light` allow for adjusting style with the light color
- **Button Group:** Introduce `vertical` property to make Buttons display vertically.
- **Toggle:** Improve keyboard interactions for `Toggle` in `showOnlySelectedOption` mode.
- **Tag Input:** Prevent users from creating duplicate tags.
- **Connected Toast:** Set focus on trigger element after closing connected toast and allow user to trigger `onClose` property by pressing tab key.
- **Date Picker:**
  - Introduce `onInputValidationError(invalidValue: string)` property to trigger custom behavior when the input value is invalid.
  - Not allow disabled days to be selected after typing.
- **Date Time Picker Input:**
  - Introduce `onInputChange(value: string)` property to trigger custom behavior when blur the input or submit a date.
  - Not allow disabled days to be submitted.

### Fixed

- **Application Frame:** The sidebar isn't overlapped by `ModalOverlay`.
- **Plugin Editor:** Fix app gets crashed when select all & delete text on android.
- **DiagramLabel:** Unexpected spacing when `DiagramLabel` has `subText` property and `text` property is set to `undefined`.
- **Text-line:** Use the Text-line's border-radius for the Button when it's placed inside the Text-line.
- **CSSEllipsis:** Wrong behavior when the text is a long string which contains no spaces nor dashes.
- **DiagramNode:** Wrong `CSSEllipsis` behavior when passed as a `children` to `DiagramNode`.
- **Table:** Unexpected width setting for column when turning on the cardView mode.
- **File Upload:** The file upload wrapper now does not fit to its parent container size if `uploadAreaSize` is defined.
- **Modal Overlay:** Fix cannot set max width with percentage values.
- **Date Picker, Date Time Picker:** The disabled day is now cannot be chosen after typing.

## 34.2.0

### New Features

- **Text Line:** [A11Y] Introduce `role` property in order to support Accessibility.
- **Tree Table:** Support a11y by adding default `HiddenText` in front of interactive tree table, In addition, project can link the external id via `ariaLablledby` property.
- **File Upload:** Introduce `ariaDescribedby` property to link the ids of relevant elements like labels, messages, icon, image,... in order to readable by screen readers.
- **Toggle:**
  - Introduce `showOnlySelectedOption` property to display only the selected `Toggle.Item`.
  - Introduce `variant` and `title` for `Toggle.Item` to customize `Toggle` when that `Toggle.Item` got selected in `showOnlySelectedOption` mode.
- **Dropdown, Custom Select:** Allow displaying the icon next to the text when setting `horizontal` property to `false`.
- **List:**
  - Introduce `graphic`, `meta` properties for `SubHeader` to display additional information.
  - Introduce `onClick` property for `SubHeader` to handle click event and indicate whether the SubHeader will be an interactive element.
  - `graphic`, `meta` properties with non-interactive element passed in (such as `Icon` or normal text) will inherit the `disabled` state from the `List.Item`.
- **Table:** [A11Y] Adding default localized `aria-label` for interactive table.
- **Multiselect, Year/Month/Year Month Selector, Text Line, Text Area, Tag Input, Switch, Slider, Native/Custom Select, Radio, Icon Picker, Checkbox Group, Autocomplete, Editor, Date/Time/Date Time Picker, File Upload:**
  - Introduce `labelGraphic` property for displaying any element in front of the label.
- **Label:** Introduce `graphic` property for displaying additional element will be shown on the left of the label.
- **Button:** Introduce `inProgress` property to show the progress indicator inside button.
- **Progress Indicator:** Introduce `noTabIndex` property to specify progress indicator has no tabIndex.
- **Badge, Header Trigger, Popup Menu:** Add more configs for styling.

### Fixed

- **Date Picker:** The `data-role` attribute for Date Range Picker is added.
- **Plugin Editor:** The `data-role` attribute for TextArea is added.
- **File Upload:** The content now can be read by JAWS in Firefox.
- **TimePicker:** Open then close the Dialog without changes make the returned value's date become the current date instead of the base date of 01/01/1970.
- **TextLine & TextArea:** Wrong styles when having `autoFocus` property.
- **TextOutput:** Added `data-role` attribute for Text Output Content, Text and Addons.
- **Filter:** Added `data-role` attribute for Filter Name Text.
- **PopUpMenu:** Missing `data-roles` when menu items are Buttons.
- **Managed Master Detail:** Closing any component is now close from the exact component onward instead of closing the last visible component only.
- **FlyoutMenu:** Glitch and reposition when opening an `AttachedPortal` that contains a `FlyoutMenu`.
- **Autocomplete, CustomSelect:** Preselected item is not scrolled into view on touch devices.
- **Helper Classes:** Input fields don't receive style changes from their wrapper that has helper classes passed in.
- **Tooltip:** Fix tooltip overflow when long text does not contain space.
- **Application Frame:** The sidebar is always overlapped main content when it's expanded.
- **Icon:** [A11Y] Add `htmlAttributes` spread operator to Icon.

### Deprecation

- **Badge:** Deprecated `color` config key. Be replaced by `colorVariant`.

## 34.1.0

### New Features

- **Autocomplete:** Introduce `selectedItemPosition` property to customize the load position of the preselected item.
- **ProgressIndicator:** Introduce `wrapperRef` property.
- **Colors:** Introduce `highlight` and `status` colors.
- **FileUpload:** [A11Y] Introduce `hideDescriptionText` and `hideButtonText` properties to hide the `descriptionText` and `buttonText`.

### Fixed

- **ManagedMasterDetail:** Wrong behavior when triggering maximize/minimize button.
- **NativeSelect:** First select option is always selected if the `value` property is not passed in.
- **FilterSelector:** Checkbox of filter gets checked by `Enter` key with screen readers.
- Inconsistency in using Horizontal & Vertical spacing in Widget's component styling configs.

## 34.0.0

### Breaking Changes

- **styled-component replaced Stylus as A12 styling solution:**
  This is the biggest breaking change in the release, and therefore deserved its own chapter. Please have a look at this [link](#/get-started/migration-instructions/migration-to-styled-components)
  for more details.
- **Button:** The different properties used to create a button on a dark background (invert, outline, light, dark) is now unified to `invert`.
  - Previously the `light` and `dark` properties were used to create an inverted icon button with a rounded background or a square shape respectively. This does not make sense with different theme we have. Now, use `invert` to make the button standout from the background. It will have the square shape by default. Use withBackground to add the rounded background that was included previously with the light button.
  - The outline secondary button has been change to `invert secondary`.
  - The invert primary button stay unchanged.
- **Contentbox:**
  - `ContentBoxElements.Breadcrumb` has been removed.
  - `BackButtonProps` and `CloseButtonProps` has been moved from `contentbox.tpl.view` to `contentbox.tpl.api`.
- **Date Picker:**
  - `Datepicker` has been renamed into `DatePicker`.
  - Due to [issue with specificity](https://styled-components.com/docs/advanced#issues-with-specificity), modifying the styles would require to bump up the specificity.
- **Layout Grid:** `LayoutGridContextType` has been moved into `LayoutGridProps`. Usage: `LayoutGridProps.GridContextType`.
- **List:** `List.Divider` component has been removed, please use the new `divider` property of the `List.Item` component instead.
- **Menu:**
  - `mainMenu` has been removed, introducing new `useAs` property.
  - `useAs` has now replaced the `mainMenu` property and allows to customize the `Menu` with `mainMenu` styles or `tabNavigation` styles.
- **Mobile Validation Bar:** `hasBackground` for Graphic has been removed.
- **Modal Overlay:**
  - `gutter` has been removed, introducing new `noGutter` property.
  - `ModalOverlay`, except for the ones with `fullscreen`, has been having gutter styles even with `gutter` passed in or not. Now all of them will have gutter styles by default, and could have the gutter removed by using `noGutter`.
- **ResizeAndDragContainer:** `[key: string]: any` from `ResizeAndDragContainerProps` that allow passing properties with wrong key has been removed.
- **Table:** `Column.Width` type becomes **number** instead of the union of numbers from **0.1** to **4.0**. It accepts any positive number up to 01 decimal place.
- **Text Line Tpl:** `selection` used to add arrow icon has been removed, please use the new `SelectionSuffix` component instead.

### New Features

- Widgets are now migrated to styled-components.
- **Year/Month/Year Month Selector:** Introduce `optionalItem` property to represent the empty value of the selector.
- **Time/DateTimePicker:** Introduce `timezone` property that accept a timezone and interpret the dates in the given timezone.
- **DateInput:** New Widget that could receive an input that allows a user to type a date.
- **Data entry widgets:** Introduce `info` and `infoMessage` properties to represent the rule-level "info" for all data entry widgets.
- **Validation Bar:** Introduce `info` variant.
- **HeaderTrigger:** Introduce `multilingual`, `vertical`, `light` properties so that it could be used as trigger element for Multilingual Popup.

### Fixed

- **Table:** Hover on interactive elements inside Rows is now all remove the Row's hover style.
- **ResizeAndDragContainer:** Typings has been improved to prevent wrong property usage.

### Deprecation

- **Contentbox:** `tile` property has been deprecated. Please use `Tile` widget instead.

### Dependencies Update

| Dependency               | Old version | New version |
| ------------------------ | ----------- | ----------- |
| @draft-js-plugins/editor | 4.1.0       | 4.1.3       |
| @types/draft-js          | 0.11.7      | 0.11.9      |
| @types/react-virtualized | ^9.21.15    | ^9.21.21    |
| immutable                | 4.0.0       | 4.1.0       |
| linkify-it               | ^3.0.3      | ^4.0.1      |
| process                  | ^0.11.10    | removed     |
| polished                 |             | ^4.2.2      |
| react-dnd-html5-backend  | ^14.0.2     | ^15.1.3     |
| react-dnd-touch-backend  | ^14.1.1     | ^15.1.2     |
| react-resize-detector    | ^5.2.0      | ^7.0.0      |
| react-rnd                | ^10.3.5     | ^10.3.7     |
| react-scroll             | ^1.8.4      | ^1.8.7      |
| recharts                 | ^2.1.8      | ^2.1.9      |
| scheduler                | ^0.20.2     | ^0.22.0     |
| ts-key-enum              | ^2.0.8      | ^2.0.11     |
| use-context-selector     | ^1.3.9      | ^1.3.10     |

### peerDependencies Update

| Dependency        | Old version | New version |
| ----------------- | ----------- | ----------- |
| moment-timezone   |             | ^0.5.34     |
| react-dnd         | ^14.0.2     | ^15.1.2     |
| styled-components |             | ^5.3.5      |
