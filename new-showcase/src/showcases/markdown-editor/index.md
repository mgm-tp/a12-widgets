The **Markdown Editor** is a WYSIWYG editor whose value is Markdown. Users write rich text with a toolbar, or type Markdown directly, and your application always receives a Markdown string. It is built on [Lexical](https://lexical.dev/) and reads and writes CommonMark plus the GitHub Flavored Markdown (GFM) extensions.

The editor is **experimental**. It ships from the `experimental` entry point and its API may still change between minor versions.

```tsx
import { MarkdownEditor } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
```

## The value is Markdown

The editor is a controlled component. Your application owns the Markdown string, passes it as `value`, and receives every edit through `onChange`.

```tsx
const [markdown, setMarkdown] = useState("# Hello");

<MarkdownEditor id="notes" label="Notes" value={markdown} onChange={setMarkdown} />;
```

Serializing the document to Markdown walks the whole tree, so the editor does not do it on every keystroke by default. `emitMode` decides when `onChange` fires:

| `emitMode`              | `onChange` fires                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `"debounced"` (default) | After the user pauses for `emitDebounceMs` (300 ms). Blur and a mode switch flush it at once. |
| `"blur"`                | Only when the editor loses focus, switches mode, or unmounts.                                 |
| `"change"`              | On every edit. Use it for small documents that need a live value.                             |

If your application saves without a blur, for example on a keyboard shortcut or an autosave timer, call `flush()` on the editor handle (see _Driving the editor from outside_ below) first so a pending edit is not lost.

## Modes

The editor has three surfaces and switches between them without losing the document:

- `edit` — the rich text editor (default).
- `source` — the raw Markdown with syntax highlighting. The toolbar keeps working and wraps or inserts Markdown syntax around the selection.
- `view` — the rich rendering, read-only.

By default only `edit` is offered and no mode menu is shown. List more modes in `allowedModes` and the mode menu appears at the end of the toolbar:

```tsx
<MarkdownEditor value={markdown} onChange={setMarkdown} allowedModes={["edit", "source", "view"]} />
```

The mode is uncontrolled by default; set `initialMode` to start somewhere else. To control it from outside, pass `mode` and update it from `onModeChange`. A `readonly` field is always in `view` mode and has no toolbar.

## Which Markdown is understood

CommonMark is always on. The GFM extensions and four HTML-tag formats are switched through the `features` prop. Only the keys you list change; the rest keep their defaults.

| Feature         | Syntax                            | Default |
| --------------- | --------------------------------- | ------- |
| `strikethrough` | `~~text~~`                        | on      |
| `taskList`      | `- [x] done`                      | on      |
| `table`         | GFM tables                        | on      |
| `autolink`      | a bare `https://…` becomes a link | on      |
| `htmlTags`      | HTML written in the Markdown      | off     |
| `highlight`     | `<mark>text</mark>`               | off     |
| `underline`     | `<u>text</u>`                     | off     |
| `subscript`     | `<sub>text</sub>`                 | off     |
| `superscript`   | `<sup>text</sup>`                 | off     |

```tsx
<MarkdownEditor value={markdown} onChange={setMarkdown} features={{ table: false, highlight: true }} />
```

`htmlTags` is off, so HTML in the Markdown is shown as plain text — what Markdown does without HTML support. Turn it on and the editor draws it: `<div style="background: red">text</div>` becomes a red block with editable text. Only the tags and attributes the editor considers safe are drawn.

The four HTML formats are off because Markdown has no syntax of its own for them. Turn one on and the editor writes the tag into the Markdown, so make sure whatever renders your Markdown later accepts it. Switching a feature rebuilds the editor and loads `value` again, so a syntax that is switched off simply stays plain text.

Markdown the editor does not know is not lost. A **directive** written by another tool, such as `:::chart` or `::toc`, is shown as a read-only placeholder and written back out character for character. An extension can claim such a name and render it properly; see the **Extensions** tab.

## The toolbar

The built-in toolbar covers the usual formatting and adds the mode menu when `allowedModes` lists more than one mode. `showToolbar={false}` removes it entirely, including the mode menu, so drive the mode through `mode` and `onModeChange` in that case.

To pick your own controls, pass a `toolbar`. Every built-in control is available as a `MarkdownEditor.*` component and wires itself up: active state, enablement, source-mode behavior and keyboard navigation keep working.

```tsx
<MarkdownEditor
	value={markdown}
	onChange={setMarkdown}
	allowedModes={["edit", "source"]}
	toolbar={
		<MarkdownEditor.Toolbar>
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.BoldButton />
				<MarkdownEditor.ItalicButton />
				<MarkdownEditor.CodeButton />
			</MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.ToolbarSeparator />
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.HeadingMenu />
				<MarkdownEditor.LinkButton />
			</MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.ModeMenu />
		</MarkdownEditor.Toolbar>
	}
/>
```

`TableMenu` opens a size grid: move over it, click to insert. It starts at 6 x 6 and grows towards its limit of 15 rows by 10 columns. The smallest table is 2 x 2.

Changing a table that already exists — add or delete a row or column, delete the table — is on the right-click menu inside the table. It comes with the editor, so a custom toolbar keeps it for free. Edit mode only; in source mode a right-click gets the browser's own menu.

In the header row, "Insert row above" and "Delete row" are off: GFM has no row above the header, and a table needs one.

`ImageButton` opens a dialog for the URL, the alt text and the title. Right-click an image that is already in the text and you get a small menu: "Edit properties" opens the same dialog with that image's values filled in, and "Delete image" removes it. Edit mode only, same as the table menu. An image that is still uploading has no menu — it has no URL yet, and it has its own buttons.

Available controls: `UndoButton`, `RedoButton`, `BoldButton`, `ItalicButton`, `StrikeButton`, `UnderlineButton`, `HighlightButton`, `CodeButton`, `SubscriptButton`, `SuperscriptButton`, `HeadingMenu`, `BulletListButton`, `OrderedListButton`, `TaskListButton`, `IndentButton`, `OutdentButton`, `BlockquoteButton`, `CodeBlockMenu`, `TableMenu`, `LinkButton`, `ImageButton`, `HorizontalRuleButton` and `ModeMenu`. A custom toolbar does not get the mode menu for free; place `MarkdownEditor.ModeMenu` where you want it.

Your own control is `MarkdownEditor.ToolbarButton`. Its `onClick` receives the toolbar context: the Lexical `richEditor`, `sourceCommands` while in source mode, the `toolbarState` snapshot and the link and image dialog openers. A control has to handle both modes, because source mode holds plain text rather than nodes:

```tsx
<MarkdownEditor.ToolbarButton
	icon="signature"
	title="Insert signature"
	onClick={({ richEditor, sourceCommands }) =>
		sourceCommands
			? sourceCommands.insertText("\n\n*Kind regards*\n")
			: richEditor.update(() => $getSelection()?.insertText("Kind regards"))
	}
/>
```

Any component rendered inside the editor can read the same context, minus `toolbarState`, through the `useMarkdownEditorSurfaces()` hook.

## Driving the editor from outside

`editorRef` fills a `MarkdownEditorHandle` once the editor has rendered. The handle works on whichever surface the user can see, so you never have to check the mode yourself.

| Method                  | Purpose                                                                          |
| ----------------------- | -------------------------------------------------------------------------------- |
| `insertMarkdown(md)`    | Inserts Markdown at the caret, replacing the selection. Reported via `onChange`. |
| `getSelectedMarkdown()` | The selection as Markdown, so bold text comes back as `**bold**`.                |
| `flush()`               | Sends a pending debounced edit now.                                              |
| `focus()`, `blur()`     | Move focus into or out of the editor.                                            |
| `undo()`, `redo()`      | History of the visible surface.                                                  |
| `mode`                  | The current mode.                                                                |
| `getActiveEditor()`     | The underlying Lexical editor, for reading.                                      |

The Markdown itself is not on the handle. That stays with `value` and `onChange`.

## Extending the editor

There are two extension points, and they answer different questions:

- **`extensions`** — Lexical extensions. Use one to teach the editor new _content_: a node class plus the rules that read it from Markdown and write it back. Extensions are part of the editor's construction, so the array **must be a stable reference**. Define it at module scope or memoize it; a new array rebuilds the editor and drops any edit `onChange` has not seen yet.
- **`plugins`** — React components rendered inside the editor. Use one for _behavior_: listeners, commands, node transforms, or reporting something back to your application. A plugin reaches the Lexical editor through `useLexicalComposerContext()` or both surfaces through `useMarkdownEditorSurfaces()`, and stays mounted across mode switches.

```tsx
const EXTENSIONS = [MdastInfoPanelExtension];

<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} plugins={<WordCountPlugin />} />;
```

Two extensions ship with the library but are not switched on:

- `MdastInfoPanelExtension` — `:::info`, `:::note`, `:::success`, `:::warning` and `:::error` panels, with a toolbar menu to insert them.
- `ImageUploadExtension` with `ImageUploadPlugin` and `ImageUploadButton` — drag and drop, paste and pick image files, uploaded through a handler you provide.

The **Extensions** tab shows both in use and walks through writing an extension of your own.

## Field behavior

The editor is a form field like the other inputs. `label`, `hideLabel`, `helperText`, `placeholder`, the `error`, `warning` and `info` states, `disabled` and `readonly` work the same way as on a `TextField`. `minHeight` and `maxHeight` size the editing surface; past `maxHeight` it scrolls. `autoFocus` puts the caret at the end of the text on the first render, in `edit` or `source` mode.

## Accessibility

The toolbar is an ARIA toolbar with roving tabindex: Tab enters it once, the arrow keys move between controls, Home and End jump to the ends. Custom controls join in as long as they render a real `button` inside `MarkdownEditor.Toolbar`. Titles and announcements are localized through `A11YLanguageContext`, under `markdownEditorTitles`; an extension brings its own strings.
