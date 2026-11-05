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

import { $generateHtmlFromNodes } from "@lexical/html";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { useExtensionComponent } from "@lexical/react/useExtensionComponent";
import type { LexicalEditor } from "lexical";
import { defineExtension } from "lexical";
import type { FC, ReactElement } from "react";
import { useState } from "react";
import { getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import {
	A11YLanguageContext,
	getA11yResource,
	mergeA11yResource
} from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import {
	InfoPanelHostContext,
	type InfoPanelType,
	MdastInfoPanelExtension,
	SET_INFO_PANEL_COMMAND
} from "../../main/extras/info-panel/index.js";
// The feature names its own roles, the way a consumer's extension would.
import { InfoPanelDataRoles } from "../../main/extras/info-panel/utils.js";
import type { MarkdownEditorMode } from "../../main/markdown-editor.api.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";
import {
	clickMenuItem,
	ControlledEditor,
	findMenuItems,
	getToolbarItem,
	isHoldingCaret,
	lastEmittedMarkdown,
	pasteHtmlIntoSurface,
	switchMode,
	wait
} from "../utils/index.js";

/*
 * The info panel is the worked example for an optional extension, so these tests walk
 * the aspects a feature has to own: reading and writing markdown, drawing itself in
 * both modes, its menu, its keyboard and mouse handling, the data the application
 * gives it, nesting, its words and its colours.
 *
 * Module scope: `extensions` has to be a stable reference or the editor is rebuilt.
 */
const INFO_PANEL_EXTENSIONS = [MdastInfoPanelExtension];

/*
 * A consumer restyling one part of the panel. Extension themes are deep-merged leaf
 * by leaf, so naming `header` here leaves `root`, `content` and the type modifiers
 * on their defaults.
 */
const PANEL_SKIN = defineExtension({
	name: "acme/PanelSkin",
	theme: { infoPanelHeader: "acme-header" }
});

const SKINNED_PANEL_EXTENSIONS = [MdastInfoPanelExtension, PANEL_SKIN];

const PANEL_MARKDOWN = ":::warning\n\nheads up\n\n:::\n";

/*
 * The menu is the extension's own output `Component`, reached exactly the way a
 * consumer reaches it. Nothing is imported from inside the extension: registering it
 * is what makes its UI available.
 */
function ExtensionPanelMenu(): ReactElement {
	const PanelMenu = useExtensionComponent(MdastInfoPanelExtension);

	return <PanelMenu />;
}

const INFO_PANEL_TOOLBAR = (
	<MarkdownEditor.Toolbar>
		<MarkdownEditor.ToolbarGroup>
			<ExtensionPanelMenu />
		</MarkdownEditor.ToolbarGroup>
	</MarkdownEditor.Toolbar>
);

describe("MarkdownEditor info panel", () => {
	test("the theme reaches the header through styled-components", async () => {
		const { container } = render(<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} />);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));
		const header = panel.querySelector<HTMLElement>(".info-panel__header")!;

		// The header is a styled component, so its accent comes from
		// `theme.components.markdownEditor` — the thing `createDOM` cannot read. The
		// colour is a real computed style, not an inline one.
		await waitFor(() => {
			const color = getComputedStyle(header).color;

			expect(color).not.toBe("");
			expect(color).not.toBe("rgb(0, 0, 0)");
		});
	});

	test("round-trips the directive back to markdown", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} onChange={onChange} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));
		const body = panel.querySelector<HTMLElement>(".info-panel__content");

		// Step 1: type into the slot body. This is the part a decorator normally cannot do.
		await userEvent.click(body!);
		await userEvent.keyboard("{End} everyone");

		// Step 2: the edit has to come back out as the same directive.
		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;
			expect(markdown).toContain(":::warning");
			expect(markdown).toContain("heads up everyone");
		});
	});

	test("nested panels round-trip on three colons", async () => {
		const onChange = vi.fn();
		const nested = ":::info\n\nouter\n\n:::warning\n\ninner\n\n:::\n\n:::\n";

		const { container } = render(
			<ControlledEditor initialValue={nested} extensions={INFO_PANEL_EXTENSIONS} onChange={onChange} />
		);

		// Step 1: both panels render, the inner one inside the outer one's slot body.
		const panels = await waitFor(() => {
			const found = container.querySelectorAll("[data-panel-type]");
			expect(found).toHaveLength(2);

			return found;
		});

		expect(panels[0].getAttribute("data-panel-type")).toBe("info");
		expect(panels[1].getAttribute("data-panel-type")).toBe("warning");

		// Step 2: a decorator inside a slot inside a decorator still writes back
		// the same markdown, colons and all.
		const innerBody = container.querySelectorAll<HTMLElement>(".info-panel__content")[1];
		await userEvent.click(innerBody);
		await userEvent.keyboard("{End}!");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;
			expect(markdown).toContain(":::info");
			expect(markdown).toContain(":::warning");
			expect(markdown).toContain("inner");
			expect(markdown).not.toContain("::::");
		});
	});

	test("the header follows the language, with no bridge in the node", async () => {
		const { container } = render(
			<A11YLanguageContext.Provider value={getA11yResource("de")}>
				<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} />
			</A11YLanguageContext.Provider>
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// `createDOM` runs outside React and reads no context. The header is React, so it just re-renders.
		expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Warnung");
	});

	test("undo puts back an edit made inside the panel", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} onChange={onChange} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));
		const body = panel.querySelector<HTMLElement>(".info-panel__content");

		// Step 1: edit inside the slot.
		await userEvent.click(body!);
		await userEvent.keyboard("{End} everyone");
		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("heads up everyone"));

		// Step 2: history has to reach across the slot boundary.
		// Lexical binds undo to Cmd on Apple and Ctrl elsewhere; the tests run on both.
		await userEvent.keyboard(navigator.platform.includes("Mac") ? "{Meta>}z{/Meta}" : "{Control>}z{/Control}");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;
			expect(markdown).not.toContain("everyone");
			expect(markdown).toContain("heads up");
		});
	});

	test("survives a round trip through source mode", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} onChange={onChange} />
		);

		await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: source mode re-serializes the document. A lossy slot shows up here first.
		await switchMode(container, "source");

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);
		await waitFor(() => expect(source.textContent).toContain(":::warning"));
		expect(source.textContent).toContain("heads up");

		// Step 2: back to rich mode, which re-parses. The panel has to come back whole.
		await switchMode(container, "edit");

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));
		expect(panel.getAttribute("data-panel-type")).toBe("warning");
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up");
	});

	test("the menu writes a panel in source mode too", async () => {
		// A toolbar of the host's own has no mode menu, so the host drives the mode here.
		const ModeHost: FC = () => {
			const [mode, setMode] = useState<MarkdownEditorMode>("edit");

			return (
				<>
					<ControlledEditor
						extensions={INFO_PANEL_EXTENSIONS}
						toolbar={INFO_PANEL_TOOLBAR}
						mode={mode}
						onModeChange={setMode}
					/>
					<button type="button" data-role="to-source" onClick={() => setMode("source")}>
						source
					</button>
					<button type="button" data-role="to-edit" onClick={() => setMode("edit")}>
						edit
					</button>
				</>
			);
		};

		const { container } = render(<ModeHost />);

		await userEvent.click(getByDataRole(container, "to-source"));

		const source = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Source);

		// Step 1: the menu stays usable. A panel is a container directive, which source
		// mode writes as plain text — there is nothing rich-only about it.
		const trigger = getByDataRole(container, InfoPanelDataRoles.menu).querySelector("button")!;

		expect(trigger).not.toBeDisabled();

		// Step 2: type a line and select it, then pick a type. The extension writes the
		// directive into the raw markdown itself — no rich node is involved.
		await userEvent.click(source);
		await userEvent.type(source, "heads up");
		await userEvent.keyboard("{Shift>}{Home}{/Shift}");
		await userEvent.click(getByDataRole(container, InfoPanelDataRoles.menu));
		await clickMenuItem("Warning");

		await waitFor(() => expect(source.textContent).toContain(":::warning"));
		expect(source.textContent).toContain("heads up");

		// The pick hands the caret back, so the user can go on typing.
		await waitFor(() => expect(isHoldingCaret(source)).toBe(true));

		// Step 3: what it wrote is the markdown the import side reads back.
		await userEvent.click(getByDataRole(container, "to-edit"));

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		expect(panel.getAttribute("data-panel-type")).toBe("warning");
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up");
	});

	test("draws a header node and a body node, and nothing in between", async () => {
		const { container } = render(<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} />);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// The shape is three nodes — panel, header, body — so Lexical reconciles all of
		// it. Nothing here needs `setDOMUnmanaged` to keep React's header or
		// `getDOMSlot` to redirect the blocks; both are experimental hooks.
		// Lexical parks a zero-size `img` anchor beside a block decorator that opens its
		// parent (it keeps the select-all highlight visible), so the two nodes are
		// found by attribute rather than by position.
		const ownChildren = [...panel.children].filter((child) => !child.hasAttribute("data-lexical-decorator-boundary"));
		expect(ownChildren).toHaveLength(2);

		const [header, content] = ownChildren;

		expect(panel.classList.contains("info-panel--warning")).toBe(true);
		expect(header.getAttribute("data-panel-header")).toBe("");
		expect(header.getAttribute("contenteditable")).toBe("false");
		expect(header.querySelector(".info-panel__header")).not.toBeNull();
		// Lexical owns the header's element, which is what keeps the mutation observer
		// off React's output.
		expect(header.getAttribute("data-lexical-decorator")).toBe("true");
		expect(header.querySelector(".info-panel__label")?.textContent).toBe("Warning");

		// The blocks are direct children of the body, so `.info-panel__content > *`
		// rules keep working, and no slot scaffolding sits in the way.
		expect(content.classList.contains("info-panel__content")).toBe(true);
		expect(content.firstElementChild?.tagName).toBe("P");
		expect(panel.querySelector("[data-lexical-slot]")).toBeNull();
	});

	test("the header survives typing in the panel", async () => {
		const { container } = render(<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} />);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// The regression this guards: React's header is DOM Lexical did not create, and
		// the mutation observer evicts unknown children of a managed element. It leaves
		// a decorator's element alone, which is why the header is a node.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.keyboard("{End} and again");

		await waitFor(() => expect(panel.querySelector(".info-panel__content")?.textContent).toContain("and again"));
		expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Warning");
	});

	test("retyping the panel repaints its header", async () => {
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} toolbar={INFO_PANEL_TOOLBAR} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Warning");

		// The type belongs to the panel, not to the header, so retyping does not dirty
		// the header node. The header reads the panel after each commit — this is what
		// proves that listener is wired.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.click(getByDataRole(container, InfoPanelDataRoles.menu));
		await clickMenuItem("Error");

		await waitFor(() => expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Error"));
		expect(panel.querySelector(".info-panel__icon")?.textContent).toBe("error");
	});

	test("an empty panel in the markdown stays a panel", async () => {
		const onChange = vi.fn();
		// A fence pair with nothing between it — an author who made the panel but has
		// not written in it yet.
		const empty = ":::warning\n\n:::\n";

		const { container } = render(
			<ControlledEditor initialValue={empty} onChange={onChange} extensions={INFO_PANEL_EXTENSIONS} />
		);

		// Step 1: it renders, header and all, with an empty line to type on.
		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Warning");
		expect(panel.querySelector(".info-panel__content")?.textContent).toBe("");

		// Step 2: typing in it lands inside the fence, so the panel was really there.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.keyboard("mind the gap");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;

			expect(markdown).toContain(":::warning");
			expect(markdown).toContain("mind the gap");
		});
	});

	test("finds the panel from inside it with a plain getParent() walk", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor
				initialValue={PANEL_MARKDOWN}
				onChange={onChange}
				extensions={INFO_PANEL_EXTENSIONS}
				toolbar={INFO_PANEL_TOOLBAR}
			/>
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// `$findMatchingParent` works unchanged here. Across a named-slot boundary it
		// returns null, which is what forces the selection layer to be rewritten.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.click(getByDataRole(container, InfoPanelDataRoles.menu));
		await clickMenuItem("Error");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain(":::error"));
	});

	test("the extension's own menu wraps the selection in a panel", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor onChange={onChange} extensions={INFO_PANEL_EXTENSIONS} toolbar={INFO_PANEL_TOOLBAR} />
		);

		const content = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Edit);

		// Step 1: type the paragraph the panel will wrap.
		await userEvent.click(content);
		await userEvent.type(content, "heads up");

		// Step 2: pick a type from the menu the extension shipped. Its labels come from
		// A11YLanguageContext, so "Warning" is proof the Output Component is localized.
		await userEvent.click(getByDataRole(container, InfoPanelDataRoles.menu));
		await clickMenuItem("Warning");

		// Step 3: the command built the panel and its body slot, and it round-tripped.
		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain(":::warning"));

		const panel = getByDataRole(container, InfoPanelDataRoles.panel);
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up");

		// Step 4: the caret is back in the panel body, so typing carries on inside it.
		await waitFor(() => expect(isHoldingCaret(content)).toBe(true));
		await userEvent.keyboard(" now");

		await waitFor(() => expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up now"));
	});

	test("the menu retypes and then removes the panel around the caret", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor
				initialValue={PANEL_MARKDOWN}
				onChange={onChange}
				extensions={INFO_PANEL_EXTENSIONS}
				toolbar={INFO_PANEL_TOOLBAR}
			/>
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: put the caret inside the slot body. Finding the panel from there is
		// the plain children channel gives us for free.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);

		// Step 2: retype it.
		await userEvent.click(getByDataRole(container, InfoPanelDataRoles.menu));
		await clickMenuItem("Error");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain(":::error"));

		// Step 3: remove it. The blocks are lifted back out, the directive is gone.
		await userEvent.click(getByDataRole(container, InfoPanelDataRoles.menu));
		await clickMenuItem("Remove panel");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;
			expect(markdown).not.toContain(":::");
			expect(markdown).toContain("heads up");
		});
	});

	test("a consumer overrides one theme class and the rest stay put", async () => {
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={SKINNED_PANEL_EXTENSIONS} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// The override reaches the React header, which reads the same merged theme the
		// node read in `createDOM`.
		expect(panel.querySelector(".acme-header")).not.toBeNull();
		expect(panel.querySelector(".info-panel__header")).toBeNull();

		// Everything the skin did not name keeps the panel's own class.
		expect(panel.classList.contains("info-panel")).toBe(true);
		expect(panel.classList.contains("info-panel--warning")).toBe(true);
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up");

		// And the label still comes from the header, wherever the skin put it.
		expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Warning");
	});

	test("the menu offers only the types the host allows", async () => {
		const { container } = render(
			<InfoPanelHostContext.Provider value={{ insertableTypes: new Set<InfoPanelType>(["info", "note"]) }}>
				<ControlledEditor initialValue="heads up" extensions={INFO_PANEL_EXTENSIONS} toolbar={INFO_PANEL_TOOLBAR} />
			</InfoPanelHostContext.Provider>
		);

		await userEvent.click(getByDataRole(container, InfoPanelDataRoles.menu));

		const labels = (await findMenuItems()).map((item) => item.textContent).join(" ");

		// Two of the five. The host works it out from the signed-in user's role, and
		// the editor never learns why.
		expect(await findMenuItems()).toHaveLength(2);
		expect(labels).toContain("Info");
		expect(labels).toContain("Note");
		expect(labels).not.toContain("Warning");
	});

	test("a type the host disallows is refused, even dispatched straight at the editor", async () => {
		let editor: LexicalEditor | null = null;

		const { container } = render(
			<InfoPanelHostContext.Provider value={{ insertableTypes: new Set<InfoPanelType>(["info"]) }}>
				<ControlledEditor
					initialValue="heads up"
					extensions={INFO_PANEL_EXTENSIONS}
					plugins={
						<EditorRefPlugin
							editorRef={(instance) => {
								editor = instance;
							}}
						/>
					}
				/>
			</InfoPanelHostContext.Provider>
		);

		// The caret has to be in the document for the command to have blocks to wrap.
		await userEvent.click(getByDataRole(container, DataRoles.MarkdownEditor.Surface.Edit));

		// Step 1: the application skips the menu and drives the editor itself. A command
		// handler has no React tree, so it reads the same host data off the bridge —
		// and refuses.
		editor!.dispatchCommand(SET_INFO_PANEL_COMMAND, "error");
		await wait(50);
		expect(queryByDataRole(container, InfoPanelDataRoles.panel)).toBeNull();

		// Step 2: an allowed type goes through, so the refusal is about the type rather
		// than about the command being wired wrong.
		editor!.dispatchCommand(SET_INFO_PANEL_COMMAND, "info");
		await waitFor(() => expect(getByDataRole(container, InfoPanelDataRoles.panel)).not.toBeNull());
	});

	test("a type granted while the editor is open reaches the menu in place", async () => {
		function HostGrant(): ReactElement {
			const [insertableTypes, setInsertableTypes] = useState<ReadonlySet<InfoPanelType>>(new Set());

			return (
				<InfoPanelHostContext.Provider value={{ insertableTypes }}>
					<button
						type="button"
						data-testid="grant"
						onClick={() => setInsertableTypes(new Set<InfoPanelType>(["warning"]))}
					>
						grant
					</button>
					<ControlledEditor initialValue="heads up" extensions={INFO_PANEL_EXTENSIONS} toolbar={INFO_PANEL_TOOLBAR} />
				</InfoPanelHostContext.Provider>
			);
		}

		const { container } = render(<HostGrant />);
		const trigger = getByDataRole(container, InfoPanelDataRoles.menu).querySelector("button")!;

		// Step 1: nothing to add and no panel to remove, so there is nothing to open.
		await waitFor(() => expect(trigger).toBeDisabled());

		// Step 2: the application grants a type. The signal moves, the menu re-reads it,
		// and the editor on screen is the same one.
		await userEvent.click(container.querySelector<HTMLElement>('[data-testid="grant"]')!);
		await waitFor(() => expect(trigger).not.toBeDisabled());

		await userEvent.click(trigger);
		expect((await findMenuItems()).map((item) => item.textContent).join(" ")).toContain("Warning");
	});

	test("clicking the panel's chrome selects it, Escape and its text put the caret back", async () => {
		const { container } = render(<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} />);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: the chrome — the padding around the blocks — is a pick-up gesture.
		panel.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
		panel.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

		await waitFor(() => expect(panel.getAttribute("data-selected")).toBe("true"));

		// Step 2: Escape drops back into the panel, so a pick-up is never a dead end.
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(panel.getAttribute("data-selected")).toBeNull());

		// Step 3: the text is not chrome. Clicking it puts the caret back in the blocks.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);

		await waitFor(() => expect(panel.getAttribute("data-selected")).not.toBe("true"));

		await userEvent.keyboard("{End}!");
		await waitFor(() => expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up!"));
	});

	test("clicking a nested panel's chrome selects the inner one", async () => {
		const nested = [":::info", "", ":::warning", "", "heads up", "", ":::", "", ":::", ""].join("\n");
		const { container } = render(<ControlledEditor initialValue={nested} extensions={INFO_PANEL_EXTENSIONS} />);

		const panels = await waitFor(() => {
			const found = container.querySelectorAll<HTMLElement>("[data-panel-type]");

			expect(found).toHaveLength(2);

			return found;
		});

		const [outer, inner] = panels;

		// The inner panel sits inside the outer one's body, so the outer body contains
		// the click. Only the panel whose own body does not is picked up.
		inner.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

		await waitFor(() => expect(inner.getAttribute("data-selected")).toBe("true"));
		expect(outer.getAttribute("data-selected")).not.toBe("true");
	});

	test("Escape selects the panel, then Backspace deletes it", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} onChange={onChange} extensions={INFO_PANEL_EXTENSIONS} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: caret inside, Escape selects the panel — the Notion-style two stages.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(panel.getAttribute("data-selected")).toBe("true"));

		// Step 2: with it selected, Backspace removes it, content and all.
		await userEvent.keyboard("{Backspace}");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;

			expect(markdown).not.toContain(":::warning");
			expect(markdown).not.toContain("heads up");
		});
	});

	test("renders the same in view mode, with nothing editable", async () => {
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} initialMode="view" extensions={INFO_PANEL_EXTENSIONS} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// The header is drawn by the same React component in every mode, so the variant,
		// the icon and the localized label do not change.
		expect(panel.classList.contains("info-panel--warning")).toBe(true);
		expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Warning");
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up");

		// Only the editing part goes away.
		const content = getByDataRole(container, DataRoles.MarkdownEditor.Surface.View);

		expect(content.getAttribute("contenteditable")).toBe("false");
	});

	test("holds a table, and gives it back unchanged", async () => {
		const onChange = vi.fn();
		const withTable = [
			":::info",
			"",
			"| Column 1 | Column 2 |",
			"| -------- | -------- |",
			"| Cell 1-1 | Cell 1-2 |",
			"",
			":::",
			""
		].join("\n");

		const { container } = render(
			<ControlledEditor
				initialValue={withTable}
				onChange={onChange}
				features={{ table: true }}
				extensions={INFO_PANEL_EXTENSIONS}
			/>
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// A panel holds ordinary blocks, so another feature's node sits inside it with
		// no arrangement between the two.
		expect(panel.querySelector(".info-panel__content table")).not.toBeNull();
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("Cell 1-1");

		// Editing inside the table still writes the directive and the table back out.
		await userEvent.click(panel.querySelector<HTMLElement>("td")!);
		await userEvent.keyboard("{End}!");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;

			expect(markdown).toContain(":::info");
			// The serializer pads cells to the widest in the column, so match the text
			// rather than the exact spacing.
			expect(markdown).toContain("Column 1");
			expect(markdown).toContain("Cell 1-1!");
		});
	});

	test("a horizontal rule inserted from the toolbar lands inside the panel", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} onChange={onChange} extensions={INFO_PANEL_EXTENSIONS} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: caret at the end of the panel's paragraph.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.keyboard("{End}");

		// Step 2: the toolbar inserts the rule with `$insertNodeToNearestRoot`, which
		// walks up to the nearest shadow root. The panel is one, so the rule stays in.
		await userEvent.click(getToolbarItem(container, "horizontalRule"));

		await waitFor(() => expect(panel.querySelector(".info-panel__content hr")).not.toBeNull());

		// Step 3: and the markdown has it inside the fence, with the panel still whole.
		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;

			expect(markdown?.match(/:::warning/g)?.length).toBe(1);
			expect(markdown?.indexOf("---")).toBeLessThan(markdown?.lastIndexOf(":::") ?? 0);
		});
	});

	test("HTML export writes the panel's type, and leaves the header out", async () => {
		let editor: LexicalEditor | null = null;

		const { container } = render(
			<ControlledEditor
				initialValue={PANEL_MARKDOWN}
				extensions={INFO_PANEL_EXTENSIONS}
				plugins={
					<EditorRefPlugin
						editorRef={(instance) => {
							editor = instance;
						}}
					/>
				}
			/>
		);

		await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// The path a copy to another application takes.
		const html = editor!.read(() => $generateHtmlFromNodes(editor!));

		// The type travels as an attribute, so a paste can build the panel again.
		expect(html).toContain('data-panel-type="warning"');
		expect(html).toContain("heads up");
		// The header is drawn from the type, so it has nothing to write.
		expect(html).not.toContain("data-panel-header");
	});

	test("pasted panel HTML comes back as a panel, header and all", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor onChange={onChange} extensions={INFO_PANEL_EXTENSIONS} />);

		const surface = getByDataRole(container, DataRoles.MarkdownEditor.Surface.Edit);

		// The shape another editor would put on the clipboard: the panel and its blocks,
		// no header and no body wrapper. The structure transform builds those back.
		await pasteHtmlIntoSurface(
			surface,
			'<div data-type="infoPanel" data-panel-type="warning"><p>heads up</p></div>',
			"heads up"
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		expect(panel.getAttribute("data-panel-type")).toBe("warning");
		expect(panel.querySelector("[data-panel-header]")).not.toBeNull();
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up");

		const markdown = await lastEmittedMarkdown(onChange);

		expect(markdown).toContain(":::warning");
	});

	test("arrow down at the end of a trailing panel grows a block after it", async () => {
		const { container } = render(<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} />);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: the panel is the last block, so there is nothing below to arrow into.
		expect(panel.nextElementSibling).toBeNull();

		// Step 2: caret at the end of the panel's text, then down.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.keyboard("{End}{ArrowDown}");

		// Step 3: a paragraph now sits after the panel, outside it.
		await waitFor(() => expect(panel.nextElementSibling?.tagName).toBe("P"));
		expect(panel.querySelector(".info-panel__content")?.textContent).toContain("heads up");
	});

	test("arrow keys step out of a selected panel", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor
				initialValue={`${PANEL_MARKDOWN}\nafter\n`}
				onChange={onChange}
				extensions={INFO_PANEL_EXTENSIONS}
			/>
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: click the header to select the whole panel.
		await userEvent.click(panel.querySelector<HTMLElement>("[data-panel-header]")!);

		// Step 2: down, then type. Stepping out of a node selection is
		// `@lexical/rich-text`'s own handling — the panel registers nothing for it.
		await userEvent.keyboard("{ArrowDown}x");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;

			expect(markdown).toContain("after");
			expect(markdown).toContain("x");
		});

		// The typing landed outside the panel, which still reads the way it did.
		expect(panel.querySelector(".info-panel__content")?.textContent).toBe("heads up");
	});

	test("Enter on an empty last line steps out of the panel", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} onChange={onChange} extensions={INFO_PANEL_EXTENSIONS} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Step 1: caret at the end of the panel's only paragraph, then Enter twice —
		// the first makes an empty line inside, the second leaves.
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.keyboard("{End}{Enter}{Enter}");

		// Step 2: typing now lands after the panel, not inside it.
		await userEvent.keyboard("after");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;

			expect(markdown).toContain(":::warning");
			expect(markdown).toContain("heads up");
			// Outside the fence, and no blank line left behind inside it.
			expect(markdown?.indexOf("after")).toBeGreaterThan(markdown?.lastIndexOf(":::") ?? 0);
		});
	});

	test("Enter in the middle of a panel still splits the block", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue={PANEL_MARKDOWN} onChange={onChange} extensions={INFO_PANEL_EXTENSIONS} />
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// Enter at the end of a paragraph that has text makes another paragraph inside
		// the panel — only an empty last line means "leave".
		await userEvent.click(panel.querySelector<HTMLElement>(".info-panel__content")!);
		await userEvent.keyboard("{End}{Enter}second");

		await waitFor(() => {
			const markdown = onChange.mock.calls.at(-1)?.[0] as string | undefined;
			const fenceEnd = markdown?.lastIndexOf(":::") ?? 0;

			expect(markdown?.indexOf("second")).toBeLessThan(fenceEnd);
		});
	});

	test("a consumer can supply the panel's strings through the a11y resources", async () => {
		// `MarkdownEditorTitles` takes an extension's keys as well as the editor's, so a
		// feature registered from outside the library is translated the same way
		// everything else is.
		const resources = mergeA11yResource({
			en: { markdownEditorTitles: { infoPanel: { warning: "Finding" } } }
		});

		const { container } = render(
			<A11YLanguageContext.Provider value={resources.en}>
				<ControlledEditor initialValue={PANEL_MARKDOWN} extensions={INFO_PANEL_EXTENSIONS} />
			</A11YLanguageContext.Provider>
		);

		const panel = await waitFor(() => getByDataRole(container, InfoPanelDataRoles.panel));

		// The host's word wins.
		await waitFor(() => expect(panel.querySelector(".info-panel__label")?.textContent).toBe("Finding"));
	});
});
