## 39.1.0

Nothing in this release has to be migrated: every deprecated API keeps working, and no public symbol
was removed. Four things can nevertheless ask something of you, all of them narrow:

- Tests that count option elements in a **long** `Autocomplete` list see only the options in view, now
  that such lists are windowed.
- Tests that assert the `Autocomplete`'s ARIA attributes see the corrected ones — which includes the
  `Autocomplete` embedded in `DatePicker` and `DateTimePicker`.
- `createRef<MobileAutocomplete>()` used as a _type_, and subclassing `DefaultAutocomplete` /
  `MobileAutocomplete`, no longer compile, because those are function components now.
- Tests that index the children of a `RichTextEditor` element, or match on its `br` elements, see the
  DOM Lexical 0.51 renders.

Everything below that is either opt-in or explains what a deprecated API is replaced by.

### Rich Text Editor: Lexical updated to 0.51

Lexical is updated from `0.44` to `0.51`. One public API detail of the Rich Text Editor follows from it.

`APPLY_TEXT_FORMAT_COMMAND` is now typed as `LexicalCommand<ApplyTextFormatPayload>` rather than `LexicalCommand<unknown>`. Lexical 0.49 makes command payload types invariant, so an untyped command can no longer be dispatched or registered at all. The runtime payload is unchanged — the new `ApplyTextFormatPayload` interface only gives the existing shape (`styleName`, `allowCollapseStyle`, `isActive`, `isolateStyle`) a name. If you annotated the payload yourself when registering a listener, you can drop the annotation and let it be inferred.

If your project subclasses Lexical's built-in nodes, note that the statics `importDOM()`, `importJSON()`, `clone()` and `transform()` are only synthesized once the class is registered with an editor, and `importDOM()` not at all. Read the conversions from `Klass.prototype.$config()` instead, and use `LexicalEditor.parseEditorState`, `$generateNodesFromDOM` or `$cloneWithProperties` in place of the removed statics. Lexical 0.50 also parks a zero-size `img[data-lexical-decorator-boundary]` beside a block-level decorator node that opens or closes its parent element, so tests that index an element's children need to skip it. `CAN_UNDO_COMMAND` and `CAN_REDO_COMMAND` are deprecated upstream in favour of the `canUndo` and `canRedo` signals of `HistoryExtension`; they keep working.

`LexicalComposer` from `@lexical/react` is deprecated upstream in favour of `LexicalExtensionComposer`, with removal announced for a future major version.
`RichTextEditor` still builds on `LexicalComposer`, so `RichTextEditorProps.initialConfig`, `defaultConfig()` and `EditorNodes` keep their current shape (`InitialConfigType` is not deprecated) and nothing changes for you yet. `MarkdownEditor` (experimental) is already built on extensions.

### Widgets generate fallback ids with `useId()` instead of `generateUid()`

`Checkbox`, `Checkbox.Indeterminate`, `CheckboxGroup`, `DateInput`, `FlyoutMenu`, `Radio.Item`, `Toggle.Item`,
`TreeContainer`, `TreeNode` and `TreeView` (experimental) still generate an `id` when you do not pass one — it now comes
from React's `useId()`.

**This is not a breaking change**, but the generated value is now an opaque React id such as `_r_3_`. Do not depend on
its shape, and do not use it as a test selector or a persisted key — pass your own `id` where you need a predictable
handle:

```tsx
// Both are accessible; only the second gives you an id you can select on
<Checkbox label="Accept terms" checked={checked} onChange={setChecked} />
<Checkbox id="accept-terms" label="Accept terms" checked={checked} onChange={setChecked} />
```

`generateUid()` is deprecated. It stays exported and functional; use React's `useId()` for element ids, or a counter or
`crypto.randomUUID()` for a value that must differ on every call. Its JSDoc lists the replacement for each use case.

### Autocomplete rebuilt: single implementation, APG accessibility

The `Autocomplete` has been reimplemented as a single function component, built on the WAI-ARIA APG combobox pattern. `AutocompleteProps` is unchanged, including the long-deprecated `searchResult` and `ariaLabelledby` props, which are still accepted and behave exactly as before. Most projects need no changes at all.

**Long match lists are now windowed.** Once a list reaches 150 matches, the `Autocomplete` renders only the options currently in view instead of all of them. This is what removes the delay when opening or filtering a large list. The new `virtualize` propertylets you force this behavior on or off. Because a windowed list only keeps the visible options in the DOM, a test that counts option elements, or looks for one that has scrolled out of view, will see just the options in the window rather than the full list. To handle this, either assert against the real size (which the options still report through `aria-setsize` and `aria-posinset`), or pin the old rendering for that test:

```tsx
<Autocomplete {...props} virtualize={false} /> // renders every match, as before
```

**The fullscreen dialog on phones behaves the same as before**, but it has been rebuilt on the APG "combobox with a dialog popup" pattern. The field shown on the page is now a read-only combobox with `aria-haspopup="dialog"` that opens the dialog, and the editable combobox with the listbox lives inside that dialog. Previously there were two comboboxes, and one of them was hidden with `aria-hidden` while still staying focusable. The new `mobileModal` propertylets you pin the presentation regardless of the device, which is useful for tests and for desktop touch screens:

```tsx
<Autocomplete {...props} mobileModal /> // always the fullscreen dialog
<Autocomplete {...props} mobileModal={false} /> // always the attached dropdown
<Autocomplete {...props} /> // dialog on phones, dropdown elsewhere (unchanged default)
```

Your existing selectors keep working on the phone presentation. Every part of it is a composed widget carrying its usual `data-role`. The field in the page and the dialog's own field are both `text-field-input` (you can tell them apart by checking whether they sit inside `modal-overlay`), the dialog itself is `modal-overlay` with the content box's roles nested inside it, and its dismiss button is a `button` titled with the localized "Save and close". The one new addition is `autocomplete-live-region`, on the visually hidden element that announces result counts. It got its own role because it has no composed widget to inherit one from.

**What this means for you:** the ARIA attributes are now the standard ones, so a test that asserts the old values will now see the corrected ones instead. `DatePicker` and `DateTimePicker` both embed an `Autocomplete`, so their DOM shows the same corrections.

| Attribute                            | Before                          | Now                                        |
| ------------------------------------ | ------------------------------- | ------------------------------------------ |
| `aria-autocomplete` on the field     | `"list"`                        | `"both"` (it completes inline as well)     |
| the listbox the field points at      | `aria-owns` (non-standard here) | `aria-controls`                            |
| `aria-flowto`, `aria-placeholder`    | set on phones                   | gone (neither is valid on a combobox)      |
| `aria-hidden` on a focusable field   | set on one of two comboboxes    | gone (there is one combobox at a time now) |
| `aria-label` when no label was given | `""`                            | not set at all                             |

**Deprecated props**, still working, but worth planning your move away from:

| Deprecated             | Replacement                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `searchResult`         | None. It has never had any effect, and is safe to delete.                                                                                                                                              |
| `ariaLabelledby`       | `ariaDescribedby`, which takes precedence when both are set. The two are not always interchangeable, so set `ariaDescribedby` to the element id(s) that should label the field rather than copying it. |
| `mobileTriggerElement` | None. It has no effect anymore. The fullscreen dialog it used to belong to is still there, but its trigger is now the field itself, which carries the label, validation messages and helper text.      |
| `DefaultAutocomplete`  | `Autocomplete`, or `Autocomplete` with `mobileModal={false}` to keep pinning the attached dropdown.                                                                                                    |
| `MobileAutocomplete`   | `Autocomplete`, or `Autocomplete` with `mobileModal` to keep pinning the fullscreen dialog.                                                                                                            |

`DefaultAutocomplete` and `MobileAutocomplete` still work. Each is now a thin wrapper that pins
`mobileModal` to the presentation it used to hardcode, so the behavior is unchanged:

```tsx
// Before, and this still compiles and behaves the same
<MobileAutocomplete {...props} />

// After
<Autocomplete {...props} mobileModal />
```

One caveat: both are now functions instead of classes. The old classes never exposed any methods
beyond React's own lifecycle, so an instance `ref` could never actually do anything with them anyway.
Still, `createRef<MobileAutocomplete>()` (using the name as a _type_) and subclassing no longer
compile. Switch to `Autocomplete` in both of those cases. `StyledAutocompleteModal` is still exported.

### Drag & drop engine now consumed as `@com.mgmtp.a12.widgets/pragmatic-drag-and-drop*`

The `@atlaskit/pragmatic-drag-and-drop*` packages behind `DataTable`, `DataTreeTable` and `TreeView` are replaced by `@com.mgmtp.a12.widgets/pragmatic-drag-and-drop*` — byte-identical repackaged builds with a proper `exports` field, fixing the Node ESM resolution failures described in the 39.0.1 note below. No code changes are required.

Only if your project references the old packages explicitly — e.g. `pnpm.overrides`/`resolutions` entries, license-scanner allowlists, or direct imports of pragmatic-drag-and-drop APIs for custom integrations with these components — update those references to the new package names (versions: `pragmatic-drag-and-drop` ^2.0.1, `-hitbox` ^2.0.0, `-auto-scroll` ^3.0.0).

### Master-Detail: Motion migration — deprecated styled components

The animation layer has been migrated from `react-transition-group` to Motion. This migration is **non-breaking**: the affected styled components remain exported and functional, but several are now deprecated or accept deprecated (ignored) props. Existing code keeps compiling and rendering; the notes below describe the recommended migration path and the one behavioral caveat on `StyledMasterDetailLayoutPane`.

#### `StyledMasterDetailPlaceholder` and `StyledMasterDetailLayoutBodyWithoutAnimation` deprecated

Both remain exported. `StyledMasterDetailLayoutBodyWithoutAnimation` now aliases `StyledMasterDetailLayoutBody` (the body no longer wraps a `TransitionGroup`, so there is no separate "without animation" variant). `StyledMasterDetailPlaceholder` is no longer used internally. Prefer `StyledMasterDetailLayoutBody` directly.

```typescript
// Before (still works, now deprecated)
import { StyledMasterDetailLayoutBodyWithoutAnimation } from "@com.mgmtp.a12.widgets/widgets-core";

// After (recommended)
import { StyledMasterDetailLayoutBody } from "@com.mgmtp.a12.widgets/widgets-core";
```

#### `StyledMasterDetailLayoutBody` propertychanges

The component is now a plain `div` (previously a `TransitionGroup` wrapper). The `$animation` and `$isAnimateRtl` propertiesare **deprecated and ignored** — they still type-check so existing call sites compile, but they no longer have any effect and should be removed. A new optional `$isSingleView` propertywas added — it is for internal use and does not need to be passed by consumers.

```typescript
// Before (still works; deprecated propertiesare ignored)
<StyledMasterDetailLayoutBody $smallView={true} $isAnimateRtl={false} $animation={true} />

// After (recommended)
<StyledMasterDetailLayoutBody $smallView={true} />
```

#### `StyledMasterDetailLayoutPane` propertychanges

The component now wraps Motion's `motion.div` instead of a plain `div`. The propertiesbelow are **deprecated and ignored** rather than removed, so existing usages keep compiling. `$width` still accepts `number | string` (a `number` is treated as px). A new `$flexGrow` propertywas added.

> **One caveat:** because the underlying element is now `motion.div`, the pane no longer accepts `react-transition-group` `CSSTransition` properties(`timeout`, `classNames`, `onEnter`, …). If you spread those onto the pane, remove them.

| property        | Before               | After                          |
| --------------- | -------------------- | ------------------------------ |
| `$smallView`    | `boolean` (optional) | deprecated, ignored            |
| `$isRtl`        | `boolean` (required) | deprecated, ignored, optional  |
| `$numOfColumns` | `number` (required)  | deprecated, ignored, optional  |
| `$columnsCount` | `number` (required)  | deprecated, ignored, optional  |
| `$maxWidth`     | `number \| string`   | deprecated, ignored            |
| `$width`        | `number \| string`   | `number \| string` (unchanged) |
| `$isResizable`  | `boolean` (required) | unchanged                      |
| `$flexGrow`     | —                    | `number` (new)                 |

### Master-Detail: `ManagedMasterDetailState` deprecated

`ManagedMasterDetailState` describes `ManagedMasterDetail`'s internal state. It remains exported and structurally unchanged, so existing imports keep compiling, but there is **no replacement** — remove any references to it. If you were mirroring the shape, declare your own type instead.

### `react-resize-detector` replaced by the built-in `useResizeObserver` hook

The library no longer depends on `react-resize-detector`. Element resize detection is handled by the new public `useResizeObserver` hook, built directly on the native `ResizeObserver` API.

- `WidgetsResizeDetector` keeps working unchanged; its propertiesare now defined by the library instead of re-exporting `react-resize-detector` types.
- Import `ResizePayload` and `OnResizeCallback` from `@com.mgmtp.a12.widgets/widgets-core` if you previously imported them from `react-resize-detector` for use with `WidgetsResizeDetector`.
- The `refreshMode` and `refreshOptions` propertiesof `WidgetsResizeDetector` are deprecated and ignored: notifications are always coalesced onto a macrotask and debounced by `refreshRate` milliseconds (default `0`). `"throttle"` mode is no longer available.

```tsx
// Before
import { type ResizePayload } from "react-resize-detector";
import { WidgetsResizeDetector } from "@com.mgmtp.a12.widgets/widgets-core";

// After
import { WidgetsResizeDetector, type ResizePayload, useResizeObserver } from "@com.mgmtp.a12.widgets/widgets-core";

// New: hook usage in function components
const { ref, width, height } = useResizeObserver({ onResize: handleResize });
```

### Dropdown: nothing has to be migrated

Every `DropDown` addition below is opt in, every deprecated API keeps working, and no public symbol
was removed. Still, two narrow things could affect a project:

- If a test counts the option elements in a list where you have passed the new `virtualize` prop, it
  will now see only the options currently in view.
- If a test reads `data-preselect` on an option after a selection has been cleared, it may now see
  `"true"` where it previously saw `"false"`, because the attribute is now derived on every render.

### Dropdown: long lists can be windowed, and `setPreselectedPosition` is deprecated

`DropDown` can now render only the options currently in view instead of all of them, through the new
`virtualize` prop. It stays off unless you turn it on. Sections (items with `children`) are windowed
along with their options, and their headers scroll away as rows of the same window. The whole list is
still rendered for `horizontal` lists, and when `useFocusStyle` puts focus on the options.

**What this means for you:** a windowed list only keeps the visible options in the DOM, so a test that
counts option elements, or looks for one that has scrolled out of view, will see just the options in
the window rather than the whole list. Either assert against the real size (which the options still
report through `aria-setsize` and `aria-posinset`), or leave `virtualize` off for that list.

Two behaviors changed for everyone, whether the list is windowed or not:

- Options that share a label and value no longer all appear active when one of them is activated.
  Enter now selects the option that was navigated to, rather than the first one with a matching value.
- `data-preselect` on an option now reflects the active option instead of the selected one. If you
  assert on it in tests, note that it stays in sync during keyboard navigation, which is what it
  already did in the browser.

Arrowing into a list whose first or last option was disabled used to activate that option, and the
selection keys would then select it. Both ends now skip disabled options, matching how stepping
through the list already worked.

**Deprecated method:** `setPreselectedPosition({ row, index })` on a `DropDown` instance is replaced
by `setPreselectedIndex(index)`, which takes the option's position in the flattened item list.

```tsx
// Before
dropdownRef.current?.setPreselectedPosition({ row: 4, index: 0 });

// After
dropdownRef.current?.setPreselectedIndex(4);
```

The old method still works. A `{ row, index }` pair is resolved against the row grouping, and in a
vertical list, `row` already is that flat index, which is how it was used in practice.

### Dropdown: the active option moves out of the component, into `useDropdownNavigation`

A combobox is an input that keeps the focus, paired with a list that holds the options, so the two
need to agree on which option is active. Previously, that meant holding on to the rendered `DropDown`
and calling into it, and to activate a particular option, you had to work out its position in the
list's own flattening of `items`. The new hook holds the active option instead, and the list is simply
handed the result:

```tsx
// Before
const dropdownRef = useRef<DropDown | null>(null);
const [activeItem, setActiveItem] = useState<DropDownItem>();

<input onKeyDown={(event) => dropdownRef.current?.handleForwardedKeyboardEvent(event)} />
<DropDown ref={dropdownRef} items={items} onPreselectedItemChange={setActiveItem} />;

// After
const navigation = useDropdownNavigation({ items });

<input aria-activedescendant={navigation.activeItem?.id} onKeyDown={navigation.handleKeyDown} />
<DropDown items={items} navigation={navigation} />;
```

| Instance method                    | On the handle                               |
| ---------------------------------- | ------------------------------------------- |
| `handleForwardedKeyboardEvent(e)`  | `handleKeyDown(e)`                          |
| `setPreselectedIndex(i)`           | `setActiveIndex(i)`                         |
| `setPreselectedPosition({row: i})` | `setActiveItem(item)` (no index to compute) |
| `resetPreselectedPosition()`       | `reset()`                                   |

Pass the same `items` array to both the hook and the list, so a position means the same thing on both
sides. All four methods still work, so nothing has to be migrated. That said, once a list is given a
`navigation` handle, it reads its active option from that handle, so avoid driving the same list both
ways.

`moveToFirst()` and `moveToLast()` are also available now, and they skip disabled options
automatically, which is exactly what callers computing `items.findIndex((item) => !item.disabled)` by
hand were trying to achieve.

### Dropdown: multi-select lists, and options that carry their own value

`selectionMode="multiple"` turns `DropDown` into a multi-select listbox. It renders a checkbox in
front of every option, announces itself as `aria-multiselectable`, states each option's
`aria-selected`, toggles on click as well as on Space or Enter, and reports the result through
`onSelectionChange`. If you built this behavior by hand before (a checkbox in each option's `graphic`,
a computed `ariaChecked`, and `keysToSelectItem={[" "]}`), you can now hand it over to the component:

```tsx
// Before
<DropDown
  items={items.map((item) => ({
    ...item,
    selected: false,
    ariaChecked: item.selected ? "true" : "false",
    graphic: <Checkbox hideLabel label={item.label} checked={!!item.selected} onChange={...} />
  }))}
  keysToSelectItem={[" "]}
  hideA11yLabel
  onSelectedItemChange={(option) => toggle(items.find((item) => item.label === option?.label))}
/>

// After
<DropDown
  selectionMode="multiple"
  items={items.map((item) => ({ ...item, data: item }))}
  selectedItems={selected}
  getItemKey={(option) => option.id!}
  onSelectionChange={(selectedItems, toggledOption) => toggle(toggledOption.data)}
/>
```

Two supporting additions are useful on their own:

- **`data`** on an option carries the value it stands for, and every callback that reports an option
  hands it back untouched. This means options no longer need to be matched back onto your own model
  by label or id. `DropDownItem<T>` and `DropDownProps<T>` take its type, inferred from `items`.
- **`getItemKey`** identifies an option, and all selection and active-option matching goes through it.
  Without it, options are still compared by `value`, falling back to `label` together with `id`, which
  cannot tell two options sharing a label apart. Pass it whenever labels may repeat.

`indeterminate` on an option shows the mixed state on its checkbox, useful for a "select all" option.

Every option now states its selection through `aria-selected`, which is what a listbox's options are
required to carry, and what tests and styles should read going forward. Nothing is taken away: an
option that already carried `aria-checked` (as `Multiselect`'s options do) keeps it, so existing
selectors and styles keep matching. The one exception is a `Multiselect` option on macOS: it keeps
`role="checkbox"` instead of `role="option"` and has no `aria-selected`, so that VoiceOver announces
it correctly.

### `flattenItems` is deprecated

Use `buildNavigationModel(items).entries` instead, which reports each option's position in the
flattened list along with it. `flattenItems` still works.

The two differ in one respect: the model flattens only the one level of sections the list renders,
while `flattenItems` recurses to any depth. For items nested deeper than that, the model is the one
that matches what's actually on screen.

`getDropDownItemsLength` has moved to `dropdown/main/template/dropdown.utils.ts`, alongside the other
`DropDownItem` helpers. It is unchanged at the package root, which is the only place it was ever
importable from, so this needs nothing from you. It counts the same options it always did: the one
level of sections the list renders, with any option nested deeper counting as itself.

### Tag Input: Deprecated properties in `StyledTagInputTag`

Tags in **Tag Input** no longer show a hover/active style, since clicking a tag by itself doesn't do anything, only its remove button does. Therefore, the `$hover` property has been deprecated and will be removed in the future release. For the same reason, the theme config properties `tagInput.tag.hoverBorderColor` and `tagInput.tag.activeBorderColor` are also deprecated.

### `widgets-utils` package deprecated

`@com.mgmtp.a12.widgets/widgets-utils` is deprecated as a whole and will be removed in a future major version. Nothing
stops working in 39.x: the package is still published, every export is still there and still behaves as before, and each
one now carries a `@deprecated` note naming its replacement.

The package was never part of the Widgets library proper. Its three components exist to assemble the showcase, they are
outside the [breaking change management](#/get-started/breaking-changes-management) that applies to `widgets-core`, and
they have no theme configuration, tests or documentation of their own.

| Deprecated export                                    | What to use instead                                                                                                                                                                                                                                         |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AnimationWrapper`                                   | Render the child conditionally, or drive the transition with an animation library such as Motion. The `a12-animation-wrapper-*` classes it toggles are defined by no Widgets stylesheet, so out of the box the wrapper only delays unmounting by `timeout`. |
| `CodeExample`, `SourceCodeSection`, `LICENSE_HEADER` | Use `react-syntax-highlighter` (or any other highlighter) directly — `widgets-core` has no code viewer.                                                                                                                                                     |
| `NewsBox`                                            | Compose the same layout from `LayoutGrid`, `CssEllipsis` and `ResponsiveImageContainer` in `widgets-core`.                                                                                                                                                  |

```tsx
// Before (still works, now deprecated)
import { AnimationWrapper } from "@com.mgmtp.a12.widgets/widgets-utils";

<AnimationWrapper show={show}>
	<ConnectedToast referenceElement={referenceElement} message={message} onClose={close} />
</AnimationWrapper>;

// After: render the child conditionally
show && <ConnectedToast referenceElement={referenceElement} message={message} onClose={close} />;
```

Where no replacement fits, copy the source into your own project: it ships in the package's `src` folder under the same
dual license as the rest of A12 Widgets.

### `AndroidScrollInputIntoViewIfNeeded` is deprecated and installs nothing

Importing anything from the package used to install an Android-only polyfill that, on every window
`resize`, scrolled the focused `input` or `textarea` into view with `scrollIntoView(true)`. On Android
a resize is what the on-screen keyboard causes every time it opens or closes, and `true` aligns the
element to the _top_ of the viewport — so focusing any text field threw the page to that field's top
edge, behind a fixed or sticky page header, and overrode scroll positions the widgets set on purpose.
Android Chrome scrolls a focused field above the keyboard on its own, so nothing is installed any
more.

Nothing has to be migrated. `AndroidScrollInputIntoViewIfNeeded` stays exported as an
already-resolved promise, so importing or awaiting it keeps compiling and keeps working:

```tsx
// Both still work; the import can simply be dropped
import { AndroidScrollInputIntoViewIfNeeded } from "@com.mgmtp.a12.widgets/widgets-core";

await AndroidScrollInputIntoViewIfNeeded;
```

If your application relied on a focused field being pulled to the top of the viewport, scroll it
yourself on `focus` — and give the target a `scroll-margin-top` the height of your header, so it does
not end up underneath it.

## 39.0.1

### `DataTable`, `DataTreeTable` & `TreeView` moved to `/experimental`

The recently introduced `DataTable`, `DataTreeTable` and `TreeView` components (and their related types and helpers) are no longer exported from the package root. They now live on a dedicated entry point: `@com.mgmtp.a12.widgets/widgets-core/experimental`.

This keeps `@atlaskit/pragmatic-drag-and-drop` — the drag-and-drop engine behind these components — out of the main module graph. Its package `exports` subpaths fail to resolve as directory imports under Node ESM in some consumer build environments (e.g. `Directory import '.../pragmatic-drag-and-drop/element/adapter' is not supported`). Importing the package root no longer pulls that dependency in.

```tsx
// Before
import { DataTable, DataTreeTable, TreeView } from "@com.mgmtp.a12.widgets/widgets-core";

// After
import { DataTable, DataTreeTable, TreeView } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
```

## 39.0.0

### New `baseTheme` replaces `flat` / `flat-compact`

`getBaseTheme()` provides a clean 3-layer theme (Application → Semantic → Widget) as the recommended A12 base theme, replacing `getFlatTheme()` and `getFlatCompactTheme()`. Its visual appearance matches the existing flat theme, so migrating from flat is a like-for-like swap.

**`default` / `compact` themes are being retired.** `getDefaultTheme` / `defaultTheme` and `getCompactTheme` / `compactTheme` are deprecated and **will be removed in a future release with no replacement** — their visual style is not carried forward. `getBaseTheme()` adopts the flat look and does **not** reproduce the default/compact appearance. Projects still on those themes can adopt `getBaseTheme()` to stay supported, but should expect a visual change.

#### Migrating from `flat` / `flat-compact`

`getBaseTheme()` is the successor to the flat factories and `createTheme()`. It defaults to **12px** base spacing, so pass `spacing: { base: 16 }` to keep the previous non-compact density:

| Deprecated                                   | Replacement                               |
| -------------------------------------------- | ----------------------------------------- |
| `getFlatTheme()` / `flatTheme`               | `getBaseTheme({ spacing: { base: 16 } })` |
| `getFlatCompactTheme()` / `flatCompactTheme` | `getBaseTheme()`                          |
| `createTheme({ ... })`                       | `getBaseTheme({ ... })`                   |

```tsx
// Before
import { getFlatTheme } from "@com.mgmtp.a12.widgets/widgets-core";
const theme = getFlatTheme();

// After — base: 16 preserves the previous (non-compact) spacing
import { getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";
const theme = getBaseTheme({ spacing: { base: 16 } });
```

`createTheme`'s options shape differs slightly. `getBaseTheme` exposes the override layers (`colors`, `semantic`, `spacing`, `typography`, `components`); see `core/src/theme/base-theme/schema.ts` for the full `BaseThemeOptions` type. The codemod does not silently drop unknown options — migrate anything outside that shape manually.

For overriding colors, semantic tokens, spacing, fonts, and per-component configs, see the [Base Theme guide](#/basics/theme/base-theme/overview).

#### New tokens

All existing flat/legacy semantic token names are preserved and keep working — `colors.text.*`, `colors.background.*`, `colors.divider.color`, the `colors.interaction.*` states (`hover` / `active` / `selected` / `focus` / `disabled`), and `colors.variant.*` are unchanged. The base theme adds the following tokens for surfaces that were previously hardcoded:

| New token                                    | Replaces                                      |
| -------------------------------------------- | --------------------------------------------- |
| `colors.text.titleColor`                     | hardcoded card / dialog heading               |
| `colors.text.placeholderColor`               | hardcoded placeholder color                   |
| `colors.background.navigationBackground`     | hardcoded sidebar background                  |
| `colors.background.navigationAccent`         | hardcoded menu decoration                     |
| `colors.background.overlayLight`             | hardcoded scrim / overlay light               |
| `colors.divider.colorMuted`                  | hardcoded subtle divider                      |
| `colors.interaction.color`, `colorDark`      | neutral interactive tint                      |
| `colors.interaction.colorBG`, `colorBGLight` | —                                             |
| `colors.interaction.hover.colorLight`        | —                                             |
| `colors.interaction.touchOverlay`            | `rgba(0,0,0,0.2)` inverted button overlay     |
| `colors.interaction.touchOverlayDark`        | `rgba(0,0,0,0.35)` activated inverted overlay |
| `colors.shadow.overlayFaint`                 | `rgba(0,0,0,0.04)` glow                       |
| `colors.shadow.overlaySoft`                  | `rgba(0,0,0,0.1)` card shadow                 |
| `colors.shadow.overlayMid`                   | `rgba(0,0,0,0.2)` popover                     |
| `colors.shadow.overlayDark`                  | `rgba(0,0,0,0.3)` modal scrim                 |
| `colors.shadow.overlayDeep`                  | `rgba(0,0,0,0.5)` overlay                     |

Top-level `border`, `motion`, `opacity`, and `hoverStyles` keys are also new. See `core/src/theme/base-theme/schema.ts` for the exact shape of `BaseThemeConfig`.

#### Quick theming

For applications that only need to recolor the theme (without overriding component configs), use `getQuickTheme()`:

```tsx
import { getQuickTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = getQuickTheme({
	palette: {
		primary: "#005FAD",
		surface: "#ffffff",
		pageBackground: "#f7f8fa",
		border: "#d9dde3",
		textPrimary: "#1f2937",
		success: "#1f9d55",
		warning: "#d97706",
		error: "#dc2626",
		info: "#2563eb"
	}
});
```

Missing palette variants (`primaryHover`, `primaryActive`, `primaryLight`, `primaryTint`) are derived automatically. Pass `buildQuickThemeOptions(input)` instead when you want to combine the quick theme palette with further `getBaseTheme` overrides.

#### Styled-components `DefaultTheme` augmentation

This only matters if your **own** typed styled-components read base-theme-specific tokens through the `theme` property(e.g. `theme.colors.shadow`, `theme.hoverStyles`). If they don't, your existing augmentation keeps compiling unchanged. To get autocomplete and type-checking for the new tokens, augment `DefaultTheme` with `BaseThemeConfig`:

```ts
// src/@types/styled-components.d.ts
import "styled-components";
import type { BaseThemeConfig } from "@com.mgmtp.a12.widgets/widgets-core";

declare module "styled-components" {
	export interface DefaultTheme extends BaseThemeConfig {}
}
```

### New `DataTable`, `DataTreeTable` & `TreeView` (experimental)

39.0.0 ships three new, **opt-in** components built on a shared headless model: `DataTable`, `DataTreeTable` and `TreeView`. They are **additive and `@experimental`** — nothing breaks, and no migration is required. The production `Table` / `TreeTable` are **not** deprecated; only the legacy `Tree` template and its behavior HOCs are.

Because this is an opt-in adoption (not a forced change), the details — supported subset, the `componentRenderers` → `slots` mapping, the virtualization-engine swap, tree drag-and-drop — live on their own page: see [New Table & Tree Components](#/get-started/migration-instructions/new-table-and-tree-components).

### Year Selector

#### Changed default rendering mode

Previously, `<YearSelector />` was always rendered as a native `<select>` element. Starting from version 39.0.0, a `variant` property (`textbox` | `select` | `autocomplete`) has been introduced to allow customization of how the selector is displayed.
If the `variant` property is not explicitly provided, the component will resolve the variant based on the presence of `yearRange` property:

| Condition            | Resolved variant                       |
| -------------------- | -------------------------------------- |
| `yearRange` provided | `autocomplete` (text input + dropdown) |
| no `yearRange`       | `textbox` (plain numeric text input)   |

The same applies to the embedded year selector in `<YearMonthSelector />` when `yearSelectorVariant` is not set.

**Migration** — add an explicit `variant`/`yearSelectorVariant` to keep the old `<select>` behaviour:

```tsx
// Before (implicitly rendered as <select>)
<YearSelector year={2024} yearRange={{ start: 2020, end: 2030 }} />
<YearMonthSelector year={2024} month={3} yearRange={{ start: 2020, end: 2030 }} />

// After (explicit, preserves previous behaviour)
<YearSelector year={2024} yearRange={{ start: 2020, end: 2030 }} variant="select" />
<YearMonthSelector year={2024} month={3} yearRange={{ start: 2020, end: 2030 }} yearSelectorVariant="select" />
```

#### YearRange fields are now optional

`YearRange.start` and `YearRange.end` are now typed as `number | undefined` to support single-bound ranges. Code that reads either field without a null-check may encounter `undefined`.

```typescript
// Before — safe without a guard (fields were always numbers)
const label = `${yearRange.start} – ${yearRange.end}`;

// After — guard required
const label = `${yearRange.start ?? ""} – ${yearRange.end ?? ""}`;
```

### Enforcement of top-level package exports

**Automatic migration (required):** run the [`enforce-top-level-exports`](#/get-started/migration-instructions/codemod-instruction#recipe-enforce-top-level-exports) codemod — see the recipe for the full list of changes it applies.

Starting with 39.0.0, `widgets-core` and `widgets-utils` enforce strict `exports` fields in their `package.json`. Deep imports through `lib/` paths are no longer allowed and will fail at build time. The codemod rewrites the deep `lib/` import paths and the CSS entry-point paths for you; the type-augmentation paths below are **not** handled by the codemod and must be updated by hand.

#### Type augmentations

Type augmentations (e.g. the styled-components `DefaultTheme` augmentation) are now exposed via `./types/*` subpath exports instead of deep `lib/@types/` paths. Update your `tsconfig.json` or reference directives:

**Option 1: `tsconfig.json` types array**

```json
// Before
{
  "compilerOptions": {
    "types": ["@com.mgmtp.a12.widgets/widgets-core/lib/@types/styled-components"]
  }
}

// After
{
  "compilerOptions": {
    "types": ["@com.mgmtp.a12.widgets/widgets-core/types/styled-components"]
  }
}
```

**Option 2: Triple-slash reference directive**

```typescript
// Before
/// <reference path="../node_modules/@com.mgmtp.a12.widgets/widgets-core/lib/@types/styled-components/index.d.ts" />

// After
/// <reference types="@com.mgmtp.a12.widgets/widgets-core/types/styled-components" />
```

Available type augmentations: `styled-components`, `react`, `react-lines-ellipsis`, `assets`.

### Renamed TextLine to TextField

**Automatic migration (required):** run the [`enforce-top-level-exports`](#/get-started/migration-instructions/codemod-instruction#recipe-enforce-top-level-exports) codemod — see the recipe for the full list of changes it applies.

The `TextLine` naming is dropped in favour of `TextField` across the public API — the component and its props, the `DataRoles` key, the `data-role` values, and the theme configuration. The codemod rewrites all of these for you.

Note: the `data-role` change affects test selectors and CSS attribute selectors in your own code — update any that match the old `"textline-*"` values.

### Removed deprecated APIs

**Automatic migration (required):** run the [`enforce-top-level-exports`](#/get-started/migration-instructions/codemod-instruction#recipe-enforce-top-level-exports) codemod — see the recipe for the full list of changes it applies.

The deprecated aliases introduced in 38.2.0 have been removed. They were originally created to avoid naming collisions when moving from deep `lib/` imports to the top-level barrel export; with the enforcement of top-level exports in 39.0.0 the old names are no longer needed and have been removed to keep the public API clean. The codemod renames each removed alias to its replacement automatically.

### Migration from Material Icons to Material Symbols

The icon system has been migrated from **Material Icons** (legacy static fonts) to **Material Symbols** (variable fonts).

#### What changed

- The font files have been replaced: the three static fonts (`Material Icons`, `Material Icons Outlined`, `Material Icons Round`) are replaced by two variable fonts (`Material Symbols Outlined`, `Material Symbols Rounded`). The variable fonts are optimized via axis pinning (unused axes GRAD, opsz, wght are fixed), resulting in a combined size of ~954 KB — comparable to the previous ~450 KB of static fonts, but with access to ~3840 icons and variable FILL support.
- The `filled` theme now uses `Material Symbols Outlined` with `font-variation-settings: 'FILL' 1` instead of the separate `Material Icons` font.
- The `outlined` theme uses `Material Symbols Outlined` with `FILL 0`.
- The `rounded` theme uses `Material Symbols Rounded`.
- The `MATERIAL_ICONS` data list has been expanded from ~1500 to ~3840 icons.

#### What hasn't changed

- The `IconTheme` type (`"filled" | "outlined" | "rounded" | "custom"`) is unchanged.
- All existing icon ligature names (e.g., `close`, `check_circle`, `arrow_drop_down`) continue to work.
- The `Icon` component API is fully backward-compatible.
- Custom icons (`iconTheme="custom"`) are unaffected.

#### Action required for consumers

- **If you self-host fonts**: Replace the old Material Icons font files with the new Material Symbols variable font files from `basic.css`. The new `@font-face` declarations reference `fonts/materialsymbols/material-symbols-outlined.woff2` and `fonts/materialsymbols/material-symbols-rounded.woff2`.
- **If you use `font-family: "Material Icons"` directly in your CSS**: Update to `font-family: "Material Symbols Outlined"` with `font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`.
- **If you use snapshot testing**: Snapshots that include icon styling will need to be updated due to the changed font-family values and new `font-variation-settings` property.

### Removed useCustomView from NativeSelectProps and CustomSelectProps

The redundant `useCustomView` property has been removed from **NativeSelectProps** and **CustomSelectProps**. Since the type itself already encodes which rendering mode is used.

If you are passing `useCustomView` to a `CustomSelect` or `NativeSelect`, simply remove it:

```typescript
// Before
<CustomSelect useCustomView={true} ... />
<NativeSelect useCustomView={false} ... />

// After
<CustomSelect ... />
<NativeSelect ... />
```

If you need to switch between rendering modes dynamically, use the top-level `Select` component and its `useCustomView` property from **SelectProps**:

```typescript
import { Select } from "@com.mgmtp.a12.widgets/widgets-core";
import { useState } from "react";

const [isUseCustomView, setIsUseCustomView] = useState(true);

<Select useCustomView={isUseCustomView} ... />
```

### Tooltip: Wrapper Element Renamed and DataRoles Changed

The `Tooltip` component has three main elements:

- **Trigger Wrapper** — the element wrapping the trigger element of `Tooltip`, always in the DOM.
- **Container** — the floating tooltip bubble, rendered in a portal and anchored to the trigger element when the tooltip is visible.
- **Content** — the element inside the bubble that contains the actual tooltip text.

Previously, the trigger wrapper was named `StyledTooltipWrapper`. That gave no hint about its purpose, making it easy to confuse with the tooltip bubble itself (`StyledTooltipContainer`).
On top of that, both elements shared `data-role="tooltip"`, which made element selection by data-role ambiguous.

To address this, the wrapper’s name and data-role has been updated.

- Styled component rename

  | Element                 | Before                   | After                         |
  | ----------------------- | ------------------------ | ----------------------------- |
  | Tooltip trigger wrapper | `StyledTooltipWrapper`   | `StyledTooltipTriggerWrapper` |
  | Tooltip container       | `StyledTooltipContainer` | unchanged                     |
  | Tooltip content         | `StyledTooltipContent`   | unchanged                     |

- DataRoles changes

  | Element                 | Before                      | After                              |
  | ----------------------- | --------------------------- | ---------------------------------- |
  | Tooltip trigger wrapper | `DataRoles.Tooltip`         | `DataRoles.Tooltip.TriggerWrapper` |
  | Tooltip container       | `DataRoles.Tooltip`         | unchanged                          |
  | Tooltip content         | `DataRoles.Tooltip.Content` | unchanged                          |

This affects test selectors and CSS attribute selectors to the trigger wrapper element:

```typescript
// Before
getByDataRole(container, "tooltip");

// After
getByDataRole(container, "tooltip-trigger-wrapper");
```

And also affects direct imports of the trigger wrapper's styled component:

```typescript
// Before
import { StyledTooltipWrapper } from "@com.mgmtp.a12.widgets/widgets-core";

// After
import { StyledTooltipTriggerWrapper } from "@com.mgmtp.a12.widgets/widgets-core";
```

### Switch Thumb Icon Color Changes

The switch thumb icon color theme configuration has been updated from `thumb.uncheckedBackground` to `thumb.checkedIconColor` and `thumb.uncheckedIconColor`.

**NOTE:** For warning, error, disabled, and readonly variants, the **unchecked** thumb icon still matches the corresponding variant's color to maintain visual consistency with the state styling.

| Checked State | Variant      | Previous Theme Key          | Current Theme Key                    |
| ------------- | ------------ | --------------------------- | ------------------------------------ |
| On            | All variants | `thumb.color`               | `thumb.checkedIconColor` (new key)   |
| Off           | Default      | `thumb.uncheckedBackground` | `thumb.uncheckedIconColor` (new key) |
| Off           | Warning      | `thumb.uncheckedBackground` | `thumb.warningColor`                 |
| Off           | Error        | `thumb.uncheckedBackground` | `thumb.errorColor`                   |
| Off           | Disabled     | `thumb.uncheckedBackground` | `thumb.disabled.color`               |
| Off           | Readonly     | `thumb.uncheckedBackground` | `thumb.readonly.color`               |

### Automatic migration

The `enforce-top-level-exports` codemod is **required** for this release — deep `lib/` imports fail at build time. Run it against your source directory:

```bash
npx @com.mgmtp.a12.widgets/widgets-codemod enforce-top-level-exports <your-source-directory-containing-ts-config-json-file>
```

For the complete list of change categories this recipe applies — with before/after examples to verify a codemod diff against — see the [`enforce-top-level-exports` recipe](#/get-started/migration-instructions/codemod-instruction#recipe-enforce-top-level-exports).

The type-augmentation path move (`lib/@types/*` → `types/*`) is **not** rewritten by the codemod and must be updated by hand — see "Enforcement of top-level package exports" above. All other breaking changes in this release not marked **Automatic migration (required)** are manual.

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

### Deprecation of nested imports

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

### Deprecation of Relation Node

The entire `relation-node` module has been deprecated, including all its components and interfaces. This module should no longer be used in new projects and existing usages should be migrated to the newer `model-graph-diagram` module components.

#### Deprecated Components and Interfaces

All entities from the `relation-node` module are deprecated:

- `NodeTpl` namespace and all its sub-components (`NodeTpl.Node`, `NodeTpl.NodeTitle`, etc.)
- `NodeTplProps` namespace and all its interfaces
- `createPort` higher-order component (HOC)
- `PortProps` interface

#### Migration Guide

Use `DiagramNode` and `DiagramPort` from the `model-graph-diagram` module instead:

```typescript
// Before
import { NodeTpl, createPort, PortProps } from "@com.mgmtp.a12.widgets/widgets-core";

// After
import { DiagramNode, DiagramPort } from "@com.mgmtp.a12.widgets/widgets-core";
```

#### Component Migration Examples

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

- Styled Components v6 no longer performs automatic propertyvalidation. Instead, it recommends using transient properties($prop) to pass style-only propertiesto components. If you cannot use transient props, you must define a shouldForwardProp function to filter props.
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

### Plugin Editor

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

### Other breaking changes

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

- `withSizeDetector` HOC is difficult to use, and because it combines the propertiesneeded for window resize detection as well as element resize detector, the resulting API is confusing. We also don't see the need for a component to combine those behaviors, except in the case of a component library like Widgets itself. It has now been removed in favor of new hooks: `useWindowSize` and `useElementSizeDetector`
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
