An **extension** teaches the editor content it does not know yet: a callout block, a mention, a spoiler. It is a plain [Lexical extension](https://lexical.dev/docs/concepts/extensions) built with `defineExtension`, and it goes into the `extensions` prop. This page covers what such an extension has to contain and which pieces the library gives you. The examples below show the two extensions that ship with the library and then one written from scratch.

## Extension or plugin?

| You want to…                                                            | Use                                                  |
| ----------------------------------------------------------------------- | ---------------------------------------------------- |
| Add a new kind of content that has to survive the trip through Markdown | an **extension** in `extensions`                     |
| React to edits, register a command, count words, talk to your app       | a **plugin** in `plugins`                            |
| Add a button that inserts or formats something                          | `MarkdownEditor.ToolbarButton` in a custom `toolbar` |

A plugin is a React component rendered inside the editor. It renders nothing and reaches the Lexical editor through `useLexicalComposerContext()`, or both surfaces through `useMarkdownEditorSurfaces()`. It stays mounted across mode switches. The **Word count plugin** example shows the pattern.

Everything else on this page is about extensions.

## The three parts of an extension

The editor holds the document as Lexical nodes and converts to and from Markdown through an [mdast](https://github.com/syntax-tree/mdast) tree. New content therefore needs three parts, and an extension bundles them:

1. **A node** — what the content is while it is being edited. Subclass `TextNode` for inline text, `ElementNode` for a block that contains other blocks, or `DecoratorNode` to render a React component.
2. **An import rule** — turns the mdast node into your Lexical node when Markdown is read.
3. **An export rule** — turns your Lexical node back into an mdast node when Markdown is written.

Both rules are registered through `configExtension(MdastImportExtension, …)` from `@lexical/mdast`:

```ts
import { MdastImportExtension } from "@lexical/mdast";
import { configExtension, defineExtension } from "lexical";

export const SpoilerExtension = defineExtension({
	name: "my-app/Spoiler",
	nodes: [SpoilerNode],
	dependencies: [
		MdastUnknownDirectiveExtension,
		configExtension(MdastImportExtension, {
			importRules: [{ type: directiveImportType("textDirective", "spoiler"), $import: $importSpoiler }],
			exportRules: [{ type: SpoilerNode.getType(), $export: $exportSpoiler }]
		})
	]
});
```

Import rules are keyed by the **mdast** node type, export rules by the **Lexical** node type. Give your node type a prefix of your own, such as `my-app-spoiler`, so it cannot collide with a built-in one.

Do not skip the export rule. Without it the content reads in fine, and then turns into plain text the next time the editor writes Markdown.

## Which syntax to use: directives

Markdown has no spare syntax for your content, so the editor supports [generic directives](https://github.com/micromark/micromark-extension-directive#syntax) in their three shapes:

```md
:::name
A block directive. It contains other blocks.
:::

::name[optional label]{key="value"}

Some text with a :name[inline] directive.
```

The `:::` grammar is switched on once for every editor by `MdastUnknownDirectiveExtension`. Any directive **nobody** claims is shown as a read-only placeholder and written back unchanged, so a `:::chart` from another tool survives a round trip. Your extension claims one name in one shape:

```ts
directiveImportType("containerDirective", "callout"); // :::callout … :::
directiveImportType("leafDirective", "toc"); //          ::toc
directiveImportType("textDirective", "spoiler"); //      :spoiler[…]
```

List `MdastUnknownDirectiveExtension` among your dependencies. It is what reads the claims and routes a claimed name to your import rule. Block and inline are separate claims: claiming `:spoiler[…]` does not claim `:::spoiler`.

The directive's `name`, `attributes` and `children` arrive on the mdast node. `mdastImportContext.importChildren(node)` converts the children of a block directive into Lexical nodes for you, and `mdastExportContext.exportChildren(nodes)` does the reverse.

## Your extension in the toolbar

A block that users should be able to insert needs a control. Two options:

- Put a `MarkdownEditor.ToolbarButton` in the consumer's toolbar. Its `onClick` gets the toolbar context, so it can call `richEditor.update(...)` or `richEditor.dispatchCommand(...)`.
- Let the extension hand out its own component. Return it from `build`, and consumers pick it up with `useExtensionComponent` from `@lexical/react/useExtensionComponent`:

```ts
export const CalloutExtension = defineExtension({
	name: "my-app/Callout",
	nodes: [CalloutNode],
	build: () => ({ Component: CalloutMenu }),
	dependencies: [...]
});
```

```tsx
function CalloutMenuControl(): ReactElement {
	const CalloutMenu = useExtensionComponent(CalloutExtension);

	return <CalloutMenu />;
}

<MarkdownEditor.Toolbar>
	<MarkdownEditor.ToolbarGroup>
		<CalloutMenuControl />
	</MarkdownEditor.ToolbarGroup>
</MarkdownEditor.Toolbar>;
```

Either way the control has to handle **source mode** too. There the document is plain text, so instead of inserting a node it inserts Markdown: read `isSourceMode` and `sourceCommands` from `useMarkdownEditorSurfaces()` and call `sourceCommands.insertText(":::callout\n\n:::")`.

## Application data inside a node

A Lexical node builds its DOM outside React and a command runs outside React, so neither can read a React context. `defineHostBridgeExtension` bridges the gap: it turns a context into signals the extension can read anywhere. Define the bridge next to a context, list it as a dependency of your extension, and put the context provider above the editor:

```ts
export interface MentionHost {
	people: readonly string[];
}

export const MentionHostContext = createContext<MentionHost>({ people: [] });

export const MentionHostExtension = defineHostBridgeExtension<MentionHost, "my-app/MentionHost">(
	"my-app/MentionHost",
	MentionHostContext,
	{ people: [] }
);
```

The context and the defaults must have the same keys; each key becomes a signal of that name. The **Info panels** example uses this to limit which panel types a user may insert.

## Rules of thumb

- **Keep `extensions` stable.** A new array builds a new editor and drops any edit `onChange` has not seen yet. Module scope or `useMemo`.
- **Always write the export rule.** The round trip is the whole point.
- **Prefix your node type and extension name.** `my-app-spoiler`, `my-app/Spoiler`.
- **Style through a class or the Lexical theme, not inline styles.** Hover and focus states are CSS states.
- **Handle source mode** in any control you add.
- **Values that change at runtime belong in a plugin prop or a host bridge**, not in `configExtension`. The config is read once, when the editor is built.

The two shipped extensions are the reference implementations. Their sources live in `core/src/markdown-editor/main/extras/info-panel/` (a block directive with its own menu, commands and host data) and `core/src/markdown-editor/main/extras/image-upload/` (a node replacement plus a plugin that carries runtime config).
