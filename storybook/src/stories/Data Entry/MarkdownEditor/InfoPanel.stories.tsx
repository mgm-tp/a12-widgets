/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { useExtensionComponent } from "@lexical/react/useExtensionComponent";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { AnyLexicalExtensionArgument } from "lexical";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { useTheme } from "styled-components";

import { A11YLanguageContext, Button, getA11yResource, mergeA11yResource } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	InfoPanelHostContext,
	type InfoPanelType,
	MarkdownEditor,
	MdastInfoPanelExtension
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { ControlledMarkdownEditor } from "./helpers.js";
import { markdownEditorArgs, markdownEditorArgTypes } from "./story-args.js";

/*
 * Info panels are Confluence/Jira-style callouts. They are not part of the editor: the
 * host registers `MdastInfoPanelExtension` in `extensions` and renders the menu the
 * extension hands back. Without it a `:::info` block in the markdown still opens, as a
 * read-only unknown-directive placeholder, and still saves untouched.
 *
 * The panel is also the prototype for a plugin node with a React header. The node is an
 * ordinary ElementNode holding ordinary block children; the extension draws the header
 * into an unmanaged mount in the node's own DOM. A node that builds its DOM in
 * `createDOM` runs outside React, so it can read neither the styled-components theme nor
 * `A11YLanguageContext` — this one reads both, which is what `Theming` and
 * `Localization` below are here to show.
 *
 * Module scope: `extensions` has to be a stable reference. A new array on every render
 * rebuilds the editor and throws the document away.
 */
const INFO_PANEL_EXTENSIONS: AnyLexicalExtensionArgument[] = [MdastInfoPanelExtension];

const PANEL_TYPES = ["info", "note", "success", "warning", "error"] as const;

/** A document already holding a type this user may not add. */
const MIXED_PANELS = `:::error

An author with more rights wrote this. It still opens, still renders, still saves.

:::
`;

const INITIAL_INSERTABLE_TYPES: ReadonlySet<InfoPanelType> = new Set<InfoPanelType>(["info", "note"]);

/** The panel picker the extension hands back as its output `Component`. */
function InfoPanelMenu(): ReactElement {
	const Menu = useExtensionComponent(MdastInfoPanelExtension);

	return <Menu />;
}

const INFO_PANEL_TOOLBAR = (
	<MarkdownEditor.Toolbar>
		<MarkdownEditor.ToolbarGroup>
			<InfoPanelMenu />
		</MarkdownEditor.ToolbarGroup>
		{/*
		 * A custom toolbar gets no mode menu for free. Several of these stories ask the
		 * reader to switch to source mode and read the `:::` markdown, so it has to be here.
		 */}
		<MarkdownEditor.ModeMenu />
	</MarkdownEditor.Toolbar>
);

const ALL_PANELS = `:::info

Every panel type, so a theme switch can be judged on all five at once.

:::

:::note

Take note of this.

:::

:::success

That worked.

:::

:::warning

Careful here.

:::

:::error

That did not work.

:::
`;

/** Shaped so every rule in `register-selection.ts` has something to act on. */
const SELECTION_PLAYGROUND = `:::info

First block in the document, so pressing Up from here makes a line above it.

:::

A plain paragraph. Put the cursor at the very start of the panel below and press Backspace.

:::warning

Shift-click my edge and the edge of the panel above to select both at once.

:::

:::note

An outer panel. Click the inner panel's edge and only the inner one is selected.

:::error

The inner one.

:::

:::

:::success

Last block in the document, so pressing Down from here makes a line below it.

:::
`;

/**
 * The panel accents of the active theme, beside the editor drawing with them.
 * Reads the same semantic color tokens the panel header does, so a theme switch moves both.
 */
function ActiveThemeReadout(): ReactElement {
	const { colors } = useTheme() as DefaultThemeType;

	const accents: Record<(typeof PANEL_TYPES)[number], string> = {
		info: colors.variant.infoColor,
		// `note` has no variant token, so the panel falls back to a neutral.
		note: colors.text.secondaryColorDark,
		success: colors.variant.successColor,
		warning: colors.variant.warningColor,
		error: colors.variant.errorColor
	};

	return (
		<p data-testid="theme-readout" style={{ alignItems: "center", display: "flex", gap: "0.5rem" }}>
			<span>Panel accents from the active theme:</span>
			{PANEL_TYPES.map((type) => (
				<span
					key={type}
					title={type}
					style={{
						background: accents[type],
						borderRadius: "50%",
						display: "inline-block",
						height: "1rem",
						width: "1rem"
					}}
				/>
			))}
		</p>
	);
}

const meta: Meta<typeof MarkdownEditor> = {
	title: "Data Entry/MarkdownEditor/Extensions/Info Panel",
	component: MarkdownEditor,
	render: (args) => <ControlledMarkdownEditor {...args} />,
	parameters: {
		layout: "padded",
		docs: {
			source: { type: "code" },
			description: {
				component:
					"Editable, nestable callout blocks in five variants — `info`, `note`, `success`, " +
					"`warning`, `error` — that round-trip to the `:::type … :::` fenced-div markdown " +
					"directive, using the `remark-directive` grammar. The host registers " +
					"`MdastInfoPanelExtension` in `extensions` and renders the extension's own menu with " +
					"`useExtensionComponent(MdastInfoPanelExtension)` inside a custom `toolbar`. The " +
					"panel header is React, drawn into the node's DOM by the extension: theme and " +
					"language reach it through context, with nothing passed into `createDOM`."
			}
		}
	},
	argTypes: markdownEditorArgTypes,
	args: {
		...markdownEditorArgs,
		extensions: INFO_PANEL_EXTENSIONS,
		value: ALL_PANELS,
		minHeight: 320
	}
};

const NESTED_PANELS = `# Panels

Five variants, all editable like any other block:

:::info

Use **info** panels for neutral, contextual notes.

:::

:::warning

Use **warning** panels to flag something to be careful about.

:::

Panels hold other blocks, including other panels. Every fence is three colons, at
any depth — the lone \`:::\` closes the panel that opened last:

:::info

A table inside a panel:

| Feature | Supported |
| ------- | --------- |
| Nesting | Yes       |

:::error

And a panel inside the panel — this goes as deep as you like.

:::

:::
`;

const INLINE_IN_PANELS = `# What can hold what

## An inline format inside a panel — works

:::note

A panel with <mark>highlighted</mark> and **bold** text in its content.

:::

## A panel inside an inline format — not markdown

An inline format cannot wrap a block, the same way bold cannot hold a table.
Markdown cuts the text into blocks before it looks for inline formats, so the two
tags below never meet and stay plain text. The panel between them still works:

<mark>

:::success

The panel parses. The mark tags around it stay literal text and round-trip as text.

:::

</mark>
`;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The starting point: what a panel is, and what the host had to do to get one.
 *
 * The toolbar here is a custom one holding the extension's menu, because the built-in
 * toolbar knows nothing about panels. Use it to wrap the selection in a panel, change
 * an existing panel's type, or take a panel away.
 */
export const Basics: Story = {
	args: {
		id: "info-panel-basics",
		label: "Panels",
		value: NESTED_PANELS,
		minHeight: 480
	},
	render: (args) => <ControlledMarkdownEditor {...args} toolbar={INFO_PANEL_TOOLBAR} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Module scope: a new array on every render rebuilds the editor.
const EXTENSIONS = [MdastInfoPanelExtension];

// The extension hands out its own menu. A hook, so it runs in a component inside the editor.
function PanelMenu(): ReactElement {
	const Menu = useExtensionComponent(MdastInfoPanelExtension);

	return <Menu />;
}

<MarkdownEditor
	value={markdown}
	onChange={setMarkdown}
	extensions={EXTENSIONS}
	toolbar={
		<MarkdownEditor.Toolbar>
			<MarkdownEditor.ToolbarGroup>
				<MarkdownEditor.BoldButton />
				<MarkdownEditor.ItalicButton />
				<PanelMenu />
			</MarkdownEditor.ToolbarGroup>
			<MarkdownEditor.ModeMenu />
		</MarkdownEditor.Toolbar>
	}
/>`
			},
			description: {
				story:
					"Panels are blocks: click into one and type, drop a list or a table inside it, put a panel inside a panel. Every fence is three colons, at any depth, so `:::info` can hold `:::warning` and the lone `:::` closes the panel that opened last. Switch to **source** mode to see the markdown — nothing here is a custom syntax, it is the `:::type … :::` fenced div from `remark-directive`, so another tool that speaks the same grammar reads the document too. Take `MdastInfoPanelExtension` back out of `extensions` and these blocks turn into read-only placeholders that still save byte-for-byte."
			}
		}
	}
};

/**
 * The two halves of the nesting question, on one page. Both come out of markdown's own
 * shape rather than out of anything the editor decided.
 */
export const Nesting: Story = {
	args: {
		id: "info-panel-nesting",
		label: "Nesting",
		value: INLINE_IN_PANELS,
		minHeight: 440,
		features: { highlight: true }
	},
	render: (args) => <ControlledMarkdownEditor {...args} toolbar={INFO_PANEL_TOOLBAR} />,
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Same wiring as Basics. What differs is the markdown: panels inside panels, and inline formats inside panels.
<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} toolbar={TOOLBAR} />`
			},
			description: {
				story:
					"An inline format inside a panel works — a panel is a block, and blocks hold inline content. A panel inside an inline format does not, because markdown cuts the text into blocks before it looks for inline formats, the same reason bold cannot hold a table. Nothing is lost either way: in the second case the panel still parses and the lone `<mark>` tags stay plain text and round-trip as written. Switch to source mode to see both."
			}
		}
	}
};

/**
 * Every rule in `register-selection.ts`, in one document. Work down the list — the
 * document is shaped so each step has something to try it on.
 *
 * A panel either holds the cursor or is selected whole. The ring and the deeper tint
 * show which.
 */
export const Selection: Story = {
	args: {
		id: "info-panel-selection",
		label: "Selecting panels",
		value: SELECTION_PLAYGROUND,
		minHeight: 560
	},
	render: function SelectionStory(args) {
		return (
			<>
				<ol style={{ lineHeight: 1.7, marginBottom: "1rem" }}>
					<li>Click a panel&apos;s padding, its coloured bar or its header — the whole panel is selected.</li>
					<li>Click that panel&apos;s text — the ring goes and the cursor lands where you clicked.</li>
					<li>Shift-click two panels&apos; edges — both are selected. Shift-click one again — it drops out.</li>
					<li>Cursor inside a panel, press Escape — the panel is selected.</li>
					<li>Press Escape again — the cursor is back inside it.</li>
					<li>With a panel selected, press Backspace — the panel and its text go.</li>
					<li>
						Cursor at the very start of the warning panel, press Backspace — it selects the panel rather than deleting
						the paragraph above it.
					</li>
					<li>Cursor at the end of a panel&apos;s last line, press Enter twice — the empty line steps out below.</li>
					<li>Cursor in the first panel, press Up — a new line appears above it.</li>
					<li>Cursor in the last panel, press Down — a new line appears below it.</li>
					<li>Click the inner panel&apos;s edge in the nested pair — only the inner one is selected.</li>
					<li>Drag across a panel&apos;s padding — no text is selected, because that is not text.</li>
				</ol>
				<ControlledMarkdownEditor {...args} toolbar={INFO_PANEL_TOOLBAR} />
			</>
		);
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Same wiring as Basics. Click a panel header to select the whole panel; Backspace removes it.
<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} toolbar={TOOLBAR} />`
			}
		}
	}
};

/**
 * Switch the theme in the Storybook toolbar. Every panel header follows, because the
 * view reads the theme's semantic `colors.variant.*` tokens through `useTheme()` — the
 * hook a `createDOM` implementation cannot call.
 */
export const Theming: Story = {
	args: {
		id: "info-panel-theming",
		label: "Themed panels"
	},
	render: (args) => (
		<>
			<ActiveThemeReadout />
			<ControlledMarkdownEditor {...args} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Step 1: all five panels render.
		const headers = await waitFor(() => {
			const found = canvasElement.querySelectorAll<HTMLElement>(".info-panel__header");

			expect(found).toHaveLength(PANEL_TYPES.length);

			return found;
		});

		// Step 2: each header took its colour from the theme, and the five differ — so
		// the value really came from the theme and is not one hardcoded default.
		//
		// Read the computed colour, not `style.color`: the header is a styled-component,
		// so the theme reaches it through a generated class and never as an inline style.
		const colors = new Set<string>();

		headers.forEach((header) => {
			const color = getComputedStyle(header).color;

			expect(color).not.toBe("");
			colors.add(color);
		});

		expect(colors.size).toBe(PANEL_TYPES.length);

		// Step 3: the swatches beside the editor read the same theme object, so a theme
		// switch moves both together.
		await expect(canvas.getByTestId("theme-readout")).toBeInTheDocument();
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// The panel accents are the theme's variant colors: infoColor, successColor, warningColor, errorColor.
// A theme that changes them recolors the panels; nothing is configured on the extension.
const theme = createTheme({ colors: { variant: { warningColor: "#7a3e00" } } });

<ThemeProvider theme={theme}>
	<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} toolbar={TOOLBAR} />
</ThemeProvider>`
			}
		}
	}
};

/**
 * The header labels come from `A11YLanguageContext`. Flipping the provider is enough —
 * the node holds no strings, so nothing has to be pushed into it or repainted by hand.
 */
export const Localization: Story = {
	args: {
		id: "info-panel-localization",
		label: "Localized panels"
	},
	render: function LocalizationStory(args) {
		const [locale, setLocale] = useState<"en" | "de">("en");

		return (
			<A11YLanguageContext.Provider value={getA11yResource(locale)}>
				<p>
					<Button data-testid="toggle-locale" onClick={() => setLocale((current) => (current === "en" ? "de" : "en"))}>
						{locale === "en" ? "Switch to German" : "Switch to English"}
					</Button>
				</p>
				<ControlledMarkdownEditor {...args} />
			</A11YLanguageContext.Provider>
		);
	},
	play: async ({ canvasElement, userEvent }) => {
		const canvas = within(canvasElement);
		const labels = () =>
			Array.from(canvasElement.querySelectorAll(".info-panel__label")).map((node) => node.textContent);

		// Step 1: English to start with.
		await waitFor(() => expect(labels()).toEqual(["Info", "Note", "Success", "Warning", "Error"]));

		// Step 2: flip the provider. No editor rebuild, no imperative repaint.
		await userEvent.click(canvas.getByTestId("toggle-locale"));

		// Step 3: every header is German now.
		await waitFor(() => expect(labels()).toEqual(["Info", "Notiz", "Erfolg", "Warnung", "Fehler"]));

		// Step 4: and back, to show it is a live read and not a one-off at import time.
		await userEvent.click(canvas.getByTestId("toggle-locale"));
		await waitFor(() => expect(labels()).toEqual(["Info", "Note", "Success", "Warning", "Error"]));
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// The menu and the panel titles follow the a11y language, like every other editor string.
<A11YLanguageContext.Provider value={getA11yResource(locale)}>
	<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} toolbar={TOOLBAR} />
</A11YLanguageContext.Provider>`
			}
		}
	}
};

/**
 * Which panel types a user may add is the application's call, not the editor's — it
 * depends on who is signed in, and `MarkdownEditor` has no prop for that.
 *
 * The extension's bridge copies `InfoPanelHostContext` onto signals. The menu reads
 * them through React; `SET_INFO_PANEL_COMMAND` reads the same signals with no React
 * tree at all, so an application driving the editor by command gets the same answer
 * as one clicking the menu.
 *
 * It gates **adding** only. Panels already in the document keep rendering whatever
 * type they carry, so opening someone else's work never eats their content.
 */
export const HostControl: Story = {
	args: {
		id: "info-panel-host-control",
		label: "Panel types this user may add",
		value: MIXED_PANELS
	},
	render: function HostControlStory(args) {
		const [insertableTypes, setInsertableTypes] = useState(INITIAL_INSERTABLE_TYPES);
		const [markdown, setMarkdown] = useState(args.value);

		const promote = (): void => setInsertableTypes(new Set<InfoPanelType>(PANEL_TYPES));

		const revoke = (): void => setInsertableTypes(new Set<InfoPanelType>());

		return (
			<InfoPanelHostContext.Provider value={{ insertableTypes }}>
				<p style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
					<span>This user may add: {[...insertableTypes].join(", ") || "nothing"}</span>
					<Button data-testid="promote" onClick={promote}>
						Promote to reviewer
					</Button>
					<Button secondary data-testid="revoke" onClick={revoke}>
						Revoke authoring
					</Button>
				</p>
				<ControlledMarkdownEditor
					{...args}
					value={markdown}
					toolbar={INFO_PANEL_TOOLBAR}
					onChange={(next) => {
						setMarkdown(next);
						args.onChange(next);
					}}
				/>
				<p>
					The document, which the host's answer never rewrites:
					<code style={{ display: "block", whiteSpace: "pre-wrap" }} data-testid="markdown">
						{markdown}
					</code>
				</p>
			</InfoPanelHostContext.Provider>
		);
	},
	play: async ({ canvasElement, userEvent }) => {
		const canvas = within(canvasElement);
		const menuTrigger = (): HTMLElement => canvas.getByTitle("Info panel");
		const menuLabels = async (): Promise<(string | null)[]> =>
			(await within(document.body).findAllByRole("menuitem")).map((item) => item.textContent);

		// Step 1: an author gets two of the five types, and the `:::error` panel already
		// in the document renders all the same.
		await userEvent.click(menuTrigger());
		await waitFor(async () => expect(await menuLabels()).toHaveLength(2));
		expect(canvasElement.querySelector(".info-panel--error")).not.toBeNull();
		await userEvent.keyboard("{Escape}");

		// Step 2: the application promotes them. The signal moves, the menu re-reads it,
		// and no editor is rebuilt.
		await userEvent.click(canvas.getByTestId("promote"));
		await userEvent.click(menuTrigger());
		await waitFor(async () => expect(await menuLabels()).toHaveLength(PANEL_TYPES.length));
		await userEvent.keyboard("{Escape}");

		// Step 3: authoring goes away entirely. Nothing to add and no panel selected, so
		// the menu has nothing to open for.
		await userEvent.click(canvas.getByTestId("revoke"));
		await waitFor(() => expect(menuTrigger()).toBeDisabled());

		// Step 4: through all of it the document never moved.
		expect(canvas.getByTestId("markdown").textContent).toContain(":::error");
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// Which panel types this user may add. Panels already in the document keep their type.
const host: InfoPanelHost = { insertableTypes: new Set(["info", "note"]) };

<InfoPanelHostContext.Provider value={host}>
	<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} toolbar={TOOLBAR} />
</InfoPanelHostContext.Provider>`
			}
		}
	}
};

/**
 * `MarkdownEditorTitles` takes an extension's keys as well as the editor's, so a
 * feature registered from outside the library gets its strings through the same a11y
 * path as everything else. Nothing in the library has to know the keys exist.
 *
 * Here the host renames the panel types to its own vocabulary — a compliance tool
 * that calls a warning a "Finding" — in both languages, with `mergeA11yResource`.
 */
export const ConsumerDefinedStrings: Story = {
	args: {
		id: "info-panel-consumer-strings",
		label: "Host-defined panel wording",
		value: ALL_PANELS
	},
	render: function ConsumerStringsStory(args) {
		const [locale, setLocale] = useState<"en" | "de">("en");

		// The consumer's own keys, alongside the editor's own. `infoPanel*` is the
		// panel's prefix, so two extensions cannot collide.
		const resources = useMemo(
			() =>
				mergeA11yResource({
					en: {
						markdownEditorTitles: {
							infoPanel: {
								menu: "Finding",
								remove: "Delete finding",
								info: "Guidance",
								note: "Remark",
								success: "Compliant",
								warning: "Finding",
								error: "Breach"
							}
						}
					},
					de: {
						markdownEditorTitles: {
							infoPanel: {
								menu: "Feststellung",
								remove: "Feststellung löschen",
								info: "Hinweis",
								note: "Anmerkung",
								success: "Konform",
								warning: "Feststellung",
								error: "Verstoß"
							}
						}
					}
				}),
			[]
		);

		return (
			<A11YLanguageContext.Provider value={resources[locale]}>
				<p>
					<Button data-testid="toggle-locale" onClick={() => setLocale((current) => (current === "en" ? "de" : "en"))}>
						{locale === "en" ? "Switch to German" : "Switch to English"}
					</Button>
				</p>
				<ControlledMarkdownEditor {...args} toolbar={INFO_PANEL_TOOLBAR} />
			</A11YLanguageContext.Provider>
		);
	},
	play: async ({ canvasElement, userEvent }) => {
		const canvas = within(canvasElement);
		const labels = (): (string | null)[] =>
			Array.from(canvasElement.querySelectorAll(".info-panel__label")).map((node) => node.textContent);

		// Step 1: the host's words, not the panel's defaults.
		await waitFor(() => expect(labels()).toEqual(["Guidance", "Remark", "Compliant", "Finding", "Breach"]));

		// Step 2: and its German ones. The panel supplied neither.
		await userEvent.click(canvas.getByTestId("toggle-locale"));
		await waitFor(() => expect(labels()).toEqual(["Hinweis", "Anmerkung", "Konform", "Feststellung", "Verstoß"]));
	},
	parameters: {
		docs: {
			source: {
				language: "tsx",
				code: `// The host replaces the panel wording. The keys sit under the editor's own titles.
const resources = mergeA11yResource({
	en: { markdownEditorTitles: { infoPanel: { menu: "Finding", warning: "Finding", error: "Breach" } } },
	de: { markdownEditorTitles: { infoPanel: { menu: "Feststellung", warning: "Feststellung", error: "Verstoß" } } }
});

<A11YLanguageContext.Provider value={resources[locale]}>
	<MarkdownEditor value={markdown} onChange={setMarkdown} extensions={EXTENSIONS} toolbar={TOOLBAR} />
</A11YLanguageContext.Provider>`
			}
		}
	}
};
