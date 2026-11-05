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

/**
 * The toolbar the editor comes with.
 *
 * Three things must hold. It shows the right controls and no others: a button for a feature
 * that is off would write markdown the editor cannot read again. Its buttons work on both
 * surfaces, rich and source. And it can be used with the keyboard: one Tab stop, arrow keys
 * between the controls, and the disabled ones skipped.
 *
 * Whether the toolbar is shown at all is a prop, so that is in `markdown-editor.test.tsx`.
 */

import { getByDataRole, queryByDataRole, render, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

// The feature names its own roles, the way a consumer's extension would.
import { InfoPanelDataRoles } from "../../main/extras/info-panel/utils.js";
import {
	clickMenuItem,
	clickTableSize,
	ControlledEditor,
	EDITOR_ROLES,
	getSurfaceByMode,
	getToolbarItemNames,
	INFO_PANEL_EXTENSIONS,
	getToolbarItem,
	queryToolbarItem
} from "../utils/index.js";

/**
 * The default toolbar, in render order, grouped the way the separators group it.
 *
 * Written by hand, not read from the code, so a control that appears or disappears shows up
 * here as a diff. Four inline formats are missing on purpose: highlight, underline, subscript
 * and superscript are off unless the host asks for them, because markdown has no syntax for them.
 */
const DEFAULT_CONTROLS = [
	["Undo", "Redo"],
	["Bold", "Italic", "Strikethrough", "Inline code", "Paragraph style"],
	["Bullet list", "Numbered list", "Task list", "Increase indent", "Decrease indent"],
	["Link", "Image", "Code block", "Blockquote", "Horizontal rule"],
	["Table"]
] as const;

/** All the toolbar's buttons, menus included. */
const getToolbarButtons = (container: HTMLElement): HTMLButtonElement[] => [
	...getByDataRole(container, EDITOR_ROLES.Toolbar).querySelectorAll("button")
];

describe("what the default toolbar is made of", () => {
	test("renders exactly the controls it claims to, in order", () => {
		const { container } = render(<ControlledEditor />);

		expect(getToolbarItemNames(container)).toEqual(DEFAULT_CONTROLS.flat());
	});

	test("groups them, with a separator between the groups", () => {
		const { container } = render(<ControlledEditor />);
		const toolbar = getByDataRole(container, EDITOR_ROLES.Toolbar);

		expect(toolbar.querySelectorAll('[role="separator"]')).toHaveLength(DEFAULT_CONTROLS.length - 1);
	});

	test("is a toolbar to a screen reader, with a name", () => {
		const { container } = render(<ControlledEditor />);
		const toolbar = getByDataRole(container, EDITOR_ROLES.Toolbar);

		expect(toolbar).toHaveAttribute("role", "toolbar");
		expect(toolbar.getAttribute("aria-label") ?? toolbar.getAttribute("aria-labelledby")).toBeTruthy();
	});

	test("every control has a name, so none of them is an unlabelled icon", () => {
		const { container } = render(<ControlledEditor />);

		for (const button of getToolbarButtons(container)) {
			expect(button.getAttribute("aria-label") ?? button.getAttribute("title") ?? button.textContent).toBeTruthy();
		}
	});
});

describe("features decide which controls exist", () => {
	test("the four inline formats are off, so their buttons are not rendered", () => {
		const { container } = render(<ControlledEditor />);

		for (const name of ["highlight", "underline", "subscript", "superscript"]) {
			expect(queryToolbarItem(container, name)).toBeNull();
		}
	});

	test("asking for one puts its button back", () => {
		const { container } = render(<ControlledEditor features={{ highlight: true, underline: true }} />);

		expect(getToolbarItem(container, "highlight")).toBeInTheDocument();
		expect(getToolbarItem(container, "underline")).toBeInTheDocument();
		// The two that were not asked for stay out.
		expect(queryToolbarItem(container, "subscript")).toBeNull();
		expect(queryToolbarItem(container, "superscript")).toBeNull();
	});

	test("switching one off takes its control away and leaves the rest alone", () => {
		const { container } = render(<ControlledEditor features={{ strikethrough: false, table: false }} />);

		expect(queryToolbarItem(container, "strikethrough")).toBeNull();
		expect(queryToolbarItem(container, "tableMenu")).toBeNull();
		expect(getToolbarItem(container, "taskList")).toBeInTheDocument();
		expect(getToolbarItem(container, "bold")).toBeInTheDocument();
	});

	test("a consumer's own control is not in the built-in toolbar, extension or no extension", () => {
		const { container } = render(<ControlledEditor extensions={INFO_PANEL_EXTENSIONS} />);

		expect(queryByDataRole(container, InfoPanelDataRoles.menu)).toBeNull();
		// The rest of the toolbar is unaffected.
		expect(getToolbarItem(container, "bold")).toBeInTheDocument();
	});
});

/** One control, the document it starts from, and the markdown pressing it should produce. */
interface ControlCase {
	control: string;

	/** The markdown the editor starts with. */
	value: string;

	/** Which line of it the caret goes on. */
	line?: number;

	/** Select the whole line first — the inline formats need something to wrap. */
	select?: boolean;

	/** For the menus: the item to pick after opening. */
	menuItem?: string;

	/**
	 * The whole document afterwards, not a fragment of it. One string when both surfaces
	 * write the same markdown, which is nearly always.
	 *
	 * Exact on purpose: `outdent` on `- one\n  - two` would "contain" `- two` before it ran,
	 * so a substring check there passes without the button doing anything.
	 */
	expected: string | { edit: string; source: string };

	/** For the table button: the size to pick off the grid it opens. */
	tableSize?: { rows: number; columns: number };
}

/**
 * Every control that writes markdown, with the smallest document that shows what it does.
 *
 * The same table runs against both surfaces. A control has one meaning, so pressing it should
 * give the same markdown whether the user is in the rich editor or in the raw text — they are
 * two code paths for one button, and only a shared table keeps them honest.
 *
 * Two of them do not agree today, so their rows carry one string per mode. Those are written
 * down as the behaviour that exists, not as the behaviour anybody wants.
 */
const CONTROL_CASES: ControlCase[] = [
	{ control: "bold", value: "hello", select: true, expected: "**hello**" },
	{ control: "italic", value: "hello", select: true, expected: "*hello*" },
	{ control: "strikethrough", value: "hello", select: true, expected: "~~hello~~" },
	{ control: "code", value: "hello", select: true, expected: "`hello`" },
	{ control: "headingMenu", value: "hello", menuItem: "Heading 2", expected: "## hello" },
	{ control: "bulletList", value: "hello", expected: "- hello" },
	{ control: "orderedList", value: "hello", expected: "1. hello" },
	{ control: "taskList", value: "hello", expected: "- [ ] hello" },
	{ control: "indent", value: "- one\n- two", line: 1, expected: "- one\n  - two" },
	{ control: "outdent", value: "- one\n  - two", line: 1, expected: "- one\n- two" },
	{ control: "blockquote", value: "hello", expected: "> hello" },
	{ control: "horizontalRule", value: "hello", expected: "---\n\nhello" },
	{
		control: "codeBlockMenu",
		value: "hello",
		menuItem: "JavaScript",
		// Rich mode turns the line it is on into the code block. Source mode opens an empty
		// fence above it and leaves the line alone.
		expected: { edit: "```javascript\nhello\n```", source: "```javascript\n\n```\n\nhello" }
	},
	{
		control: "tableMenu",
		value: "hello",
		tableSize: { rows: 3, columns: 3 },
		// Rich mode inserts an empty grid. Source mode writes example text into every cell.
		expected: {
			edit: "|   |   |   |\n| - | - | - |\n|   |   |   |\n|   |   |   |\n\nhello",
			source: [
				"| Column 1 | Column 2 | Column 3 |",
				"| -------- | -------- | -------- |",
				"| Cell 1-1 | Cell 1-2 | Cell 1-3 |",
				"| Cell 2-1 | Cell 2-2 | Cell 2-3 |",
				"",
				"hello"
			].join("\n")
		}
	}
];

/** The two controls that open a dialog instead of writing anything themselves. */
const DIALOG_CASES = [
	{ control: "link", title: "Insert link" },
	{ control: "image", title: "Insert image" }
];

/**
 * Puts the caret at the start of line `line`.
 *
 * Both surfaces mark their text with `data-lexical-text`, so one path works for both. The
 * click alone is not enough: it leaves the caret where it was clicked, so walk from the
 * first line instead.
 */
async function placeCaret(surface: HTMLElement, line: number): Promise<void> {
	await userEvent.click(surface.querySelector<HTMLElement>("[data-lexical-text]") ?? surface);
	await userEvent.keyboard("{Home}");

	for (let step = 0; step < line; step += 1) {
		await userEvent.keyboard("{ArrowDown}{Home}");
	}
}

/** Clicks the control, then picks from whatever it opens: a menu item, or a size off the table grid. */
async function pressControl(
	container: HTMLElement,
	control: string,
	menuItem?: string,
	tableSize?: { rows: number; columns: number }
): Promise<void> {
	await userEvent.click(getToolbarItem(container, control));

	if (menuItem) {
		await clickMenuItem(menuItem);
	} else if (tableSize) {
		await clickTableSize(tableSize.rows, tableSize.columns);
	}
}

describe.each(["edit", "source"] as const)("every control, in %s mode", (mode) => {
	test.each(CONTROL_CASES)(
		"$control writes $expected",
		async ({ control, value, line, select, menuItem, tableSize, expected }) => {
			const onChange = vi.fn();
			const { container } = render(
				<ControlledEditor initialValue={value} initialMode={mode} onChange={onChange} emitMode="change" />
			);

			const surface = getSurfaceByMode(container, mode);

			await placeCaret(surface, line ?? 0);

			if (select) {
				// Shift+End selects to the end of the line, so the whole word is wrapped.
				await userEvent.keyboard("{Shift>}{End}{/Shift}");
			}

			await pressControl(container, control, menuItem, tableSize);

			const wanted = typeof expected === "string" ? expected : expected[mode];

			await waitFor(() => expect(String(onChange.mock.calls.at(-1)?.[0]).trim()).toBe(wanted));

			// Whatever the control did, the caret is back in the text afterwards. A button never
			// took it; a menu did, when its first item took focus on open, and has to give it back.
			await waitFor(() => expect(surface).toHaveFocus());
		}
	);

	test("typing right after a menu pick goes into the text", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue="hello" initialMode={mode} onChange={onChange} emitMode="change" />
		);

		const surface = getSurfaceByMode(container, mode);

		await placeCaret(surface, 0);
		await userEvent.keyboard("{End}");
		await pressControl(container, "headingMenu", "Heading 2");

		await waitFor(() => expect(String(onChange.mock.calls.at(-1)?.[0]).trim()).toBe("## hello"));

		// No click back into the editor in between. Rich mode leaves the caret where it was, at
		// the end of the line. Source mode selects the line it rewrote, as its commands always do,
		// so the typing replaces it. Either way the keystrokes landed in the text, not on the trigger.
		await userEvent.keyboard(" world");

		const typed = { edit: "## hello world", source: "world" }[mode];

		await waitFor(() => expect(String(onChange.mock.calls.at(-1)?.[0]).trim()).toBe(typed));
	});

	test.each(DIALOG_CASES)("$control opens its dialog", async ({ control, title }) => {
		const { container } = render(<ControlledEditor initialValue="hello" initialMode={mode} />);

		await placeCaret(getSurfaceByMode(container, mode), 0);
		await userEvent.click(getToolbarItem(container, control));

		// Both dialogs share the one wrapper role, so the title is what says which one opened.
		await waitFor(() => expect(getByDataRole(container, EDITOR_ROLES.Dialog.Wrapper)).toBeInTheDocument());
		expect(getByDataRole(container, EDITOR_ROLES.Dialog.Title)).toHaveTextContent(title);
	});

	test("undo takes back the last edit, redo puts it back", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue="hello" initialMode={mode} onChange={onChange} emitMode="change" />
		);

		const surface = getSurfaceByMode(container, mode);
		const undo = getToolbarItem(container, "undo");
		const redo = getToolbarItem(container, "redo");

		await placeCaret(surface, 0);
		await userEvent.keyboard("{Shift>}{End}{/Shift}");
		await userEvent.click(getToolbarItem(container, "bold"));

		await waitFor(() => expect(String(onChange.mock.calls.at(-1)?.[0])).toContain("**hello**"));

		// Each surface keeps its own history, so this only works if the button reaches the
		// editor the user is actually looking at.
		await waitFor(() => expect(undo).toBeEnabled());
		await userEvent.click(undo);

		await waitFor(() => expect(String(onChange.mock.calls.at(-1)?.[0])).not.toContain("**hello**"));

		await waitFor(() => expect(redo).toBeEnabled());
		await userEvent.click(redo);

		await waitFor(() => expect(String(onChange.mock.calls.at(-1)?.[0])).toContain("**hello**"));
	});
});

describe("what a control looks like", () => {
	test("a toggle says whether it is on", () => {
		const { container } = render(<ControlledEditor />);

		expect(getToolbarItem(container, "bold")).toHaveAttribute("aria-pressed", "false");
	});

	// A second press on any of these turns nothing off: two of them open a dialog,
	// the third inserts another rule. `aria-pressed` would promise otherwise.
	test("the buttons that insert or open a dialog are not toggles", () => {
		const { container } = render(<ControlledEditor />);

		expect(getToolbarItem(container, "link")).not.toHaveAttribute("aria-pressed");
		expect(getToolbarItem(container, "image")).not.toHaveAttribute("aria-pressed");
		expect(getToolbarItem(container, "horizontalRule")).not.toHaveAttribute("aria-pressed");
	});

	// A rule is a decorator node. Clicking it selects a node, not a range of text, so
	// reading only the text selection would say nothing is selected.
	test("the rule button is highlighted while the rule itself is selected", async () => {
		const { container } = render(<ControlledEditor />);
		const rule = getToolbarItem(container, "horizontalRule");

		await userEvent.click(getSurfaceByMode(container));
		await userEvent.click(rule);

		// After inserting, the caret is in the paragraph below the rule. The highlight
		// follows the rule being selected, so select it.
		const inserted = await waitFor(() => {
			const hr = container.querySelector("hr");

			if (!hr) {
				throw new Error("no rule rendered");
			}

			return hr;
		});

		await userEvent.click(inserted);

		await waitFor(() => expect(rule).toHaveAttribute("data-variant-type", "activated"));
	});

	test("a control that cannot run looks switched off", async () => {
		const { container } = render(<ControlledEditor />);

		const redo = getToolbarItem(container, "redo");
		const undo = getToolbarItem(container, "undo");

		// Nothing has been undone, so redo cannot run and the arrow keys skip it. The user
		// must be able to see why. The toolbar styles use `&&`, so they beat the normal
		// disabled style, and it is easy to set this the wrong way round: the disabled
		// button was once darker than the working one.
		await waitFor(() => expect(undo).not.toBeDisabled());
		expect(redo).toBeDisabled();

		expect(getComputedStyle(redo).color).not.toBe(getComputedStyle(undo).color);
	});
});

describe("using the toolbar from the keyboard", () => {
	/** The control Tab lands on — the one carrying `tabindex="0"`. */
	const tabEntry = (container: HTMLElement): HTMLButtonElement | undefined =>
		getToolbarButtons(container).find((button) => button.getAttribute("tabindex") === "0");

	const firstEnabled = (container: HTMLElement): HTMLButtonElement | undefined =>
		getToolbarButtons(container).find((button) => !button.disabled);

	test("the formatting group is reachable before the editor has ever been focused", async () => {
		const { container } = render(<ControlledEditor initialValue="hello" />);

		const undo = getToolbarItem(container, "undo");
		const bold = getToolbarItem(container, "bold");

		// There is no caret in the document yet. The text formats work on whatever selection
		// comes later, so they must stay enabled. If they were disabled here, the arrow keys
		// would skip the whole group and a keyboard user would jump from Redo to the
		// paragraph menu.
		await waitFor(() => expect(undo).not.toBeDisabled());

		for (const name of ["bold", "italic", "strikethrough", "code"]) {
			expect(getToolbarItem(container, name)).not.toBeDisabled();
		}

		// One step right from the entry point lands on Bold. Redo is in between and really
		// cannot run, so skipping that one is the rule working, not the bug.
		undo.focus();
		await userEvent.keyboard("{ArrowRight}");

		expect(document.activeElement).toBe(bold);
	});

	test("Tab enters at the first working control, not the first one that happened to be enabled", async () => {
		const { container } = render(<ControlledEditor />);

		// On the first render only the menus work: there is no selection, and undo has
		// nothing to undo. Whatever is enabled at that moment must not keep the Tab stop
		// once the controls before it become usable again.
		await waitFor(() => expect(tabEntry(container)).toBe(getToolbarItem(container, "undo")));
		expect(tabEntry(container)).toBe(firstEnabled(container));

		// Typing enables the formatting group again. The entry point stays at the front.
		const content = getSurfaceByMode(container);

		await userEvent.click(content);
		await userEvent.type(content, "hello");

		await waitFor(() => expect(getToolbarItem(container, "bold")).not.toBeDisabled());
		expect(tabEntry(container)).toBe(firstEnabled(container));
	});

	test("once the user moves along the toolbar, Tab comes back to where they left off", async () => {
		const { container } = render(<ControlledEditor />);

		await waitFor(() => expect(tabEntry(container)).toBeTruthy());

		// Step 1: the user arrows away from the entry point.
		const entry = tabEntry(container)!;

		entry.focus();
		await userEvent.keyboard("{ArrowRight}");

		const moved = document.activeElement as HTMLButtonElement;

		expect(moved).not.toBe(entry);
		expect(tabEntry(container)).toBe(moved);

		// Step 2: a selection change re-renders the toolbar. Their position must survive it,
		// or the Tab stop would jump back to the front while they work.
		const content = getSurfaceByMode(container);

		await userEvent.click(content);
		await userEvent.type(content, "hello");

		await waitFor(() => expect(getToolbarItem(container, "bold")).not.toBeDisabled());
		expect(tabEntry(container)).toBe(moved);
	});
});
