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

import type { FC } from "react";
import { useState } from "react";
import { getByDataRole, queryByDataRole, render, screen, waitFor } from "test-utils";
import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import type { MarkdownEditorMode } from "../../main/markdown-editor.api.js";
import { MarkdownEditor } from "../../main/markdown-editor.view.js";
import {
	ALL_MODES,
	ControlledEditor,
	EDITOR_ROLES,
	getSurfaceByMode,
	getToolbarItem,
	getUnknownDirective,
	INFO_PANEL_EXTENSIONS,
	isHoldingCaret,
	openModeMenu,
	queryToolbarItem,
	queryUnknownDirective,
	switchMode,
	wait,
	waitForSurfaceReady
} from "../utils/index.js";

/** The debounce window plus enough slack that a slow machine does not decide the test. */
const PAST_THE_DEBOUNCE_MS = 600;

/** Walks up from the editable element to the box `minHeight` and `maxHeight` are set on. */
function scrollingBoxOf(surface: HTMLElement): HTMLElement {
	for (let box = surface.parentElement; box; box = box.parentElement) {
		if (getComputedStyle(box).maxHeight !== "none") {
			return box;
		}
	}

	throw new Error("no box with a max-height above the surface");
}

describe("value and onChange", () => {
	test("renders the markdown it is given", async () => {
		const { container } = render(<ControlledEditor initialValue="# Hello world" />);

		expect(getByDataRole(container, EDITOR_ROLES.Wrapper)).toBeInTheDocument();

		await waitFor(() => {
			expect(getByDataRole(container, EDITOR_ROLES.Surface.Edit)).toHaveTextContent("Hello world");
		});
	});

	// A host whose state is not filled in yet passes no value at all. The rich surface reads that as an empty document
	// and the source surface has to agree instead of throwing on it.
	test("no value at all is an empty document in both modes", async () => {
		const missing = undefined as unknown as string;

		const rich = render(<MarkdownEditor value={missing} onChange={vi.fn()} />);

		await waitFor(() => expect(getByDataRole(rich.container, EDITOR_ROLES.Surface.Edit)).toHaveTextContent(""));

		const source = render(
			<MarkdownEditor value={missing} onChange={vi.fn()} allowedModes={ALL_MODES} initialMode="source" />
		);

		await waitFor(() => expect(getByDataRole(source.container, EDITOR_ROLES.Surface.Source)).toHaveTextContent(""));
	});

	test("reports edits back as markdown", async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor onChange={onChange} emitMode="change" />);

		await userEvent.click(getSurfaceByMode(container));
		await userEvent.keyboard("hi");

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("hi"));
	});

	test("a value the host pushes in replaces what is on screen", async () => {
		const PushingHost: FC = () => {
			const [value, setValue] = useState("first");

			return (
				<>
					<button type="button" data-role="push" onClick={() => setValue("second")}>
						push
					</button>
					<MarkdownEditor value={value} onChange={setValue} />
				</>
			);
		};

		const { container } = render(<PushingHost />);
		const content = getByDataRole(container, EDITOR_ROLES.Surface.Edit);

		await waitFor(() => expect(content).toHaveTextContent("first"));

		await userEvent.click(getByDataRole(container, "push"));

		await waitFor(() => expect(content).toHaveTextContent("second"));
	});

	// The editor ignores a `value` that is the host echoing back what it just emitted, because
	// re-applying it would move the caret to the start. That must not extend to the host
	// deliberately putting an old value back — an undo, or a reset to a saved draft.
	test("a value the editor emitted earlier is applied again when the host restores it", async () => {
		const ValuePushingHost: FC = () => {
			const [value, setValue] = useState("");

			return (
				<>
					<button type="button" data-role="push-typed" onClick={() => setValue("typed")}>
						push typed
					</button>
					<button type="button" data-role="push-other" onClick={() => setValue("other")}>
						push other
					</button>
					<MarkdownEditor value={value} onChange={setValue} emitMode="change" />
				</>
			);
		};

		const { container } = render(<ValuePushingHost />);
		const content = getByDataRole(container, EDITOR_ROLES.Surface.Edit);

		await userEvent.click(content);
		await userEvent.type(content, "typed");
		await waitFor(() => expect(content).toHaveTextContent("typed"));

		await userEvent.click(getByDataRole(container, "push-other"));
		await waitFor(() => expect(content).toHaveTextContent("other"));

		await userEvent.click(getByDataRole(container, "push-typed"));
		await waitFor(() => expect(content).toHaveTextContent("typed"));
	});
});

describe("emitMode and emitDebounceMs", () => {
	test('"change" reports every keystroke', async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor onChange={onChange} emitMode="change" />);

		await userEvent.click(getSurfaceByMode(container));
		await userEvent.keyboard("abc");

		await waitFor(() => expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(3));
	});

	test('"debounced" waits, then reports once', async () => {
		const onChange = vi.fn();
		const { container } = render(<ControlledEditor onChange={onChange} emitDebounceMs={100} />);

		await userEvent.click(getSurfaceByMode(container));
		await userEvent.keyboard("abc");

		await waitFor(() => expect(onChange).toHaveBeenCalled());

		// Three keys, far fewer reports: that is the whole point of the mode.
		expect(onChange.mock.calls.length).toBeLessThan(3);
		expect(onChange.mock.calls.at(-1)?.[0]).toContain("abc");
	});

	test('"blur" says nothing until the editor loses focus', async () => {
		const onChange = vi.fn();
		const { container } = render(
			<>
				<ControlledEditor onChange={onChange} emitMode="blur" />
				<button type="button" data-role="elsewhere">
					elsewhere
				</button>
			</>
		);

		await userEvent.click(getSurfaceByMode(container));
		await userEvent.keyboard("abc");

		// Long enough that a debounce would have fired by now.
		await wait(PAST_THE_DEBOUNCE_MS);
		expect(onChange).not.toHaveBeenCalled();

		await userEvent.click(getByDataRole(container, "elsewhere"));

		await waitFor(() => expect(onChange.mock.calls.at(-1)?.[0]).toContain("abc"));
	});
});

describe("mode, initialMode, onModeChange and allowedModes", () => {
	test("initialMode picks the surface to start on", () => {
		const { container } = render(<ControlledEditor initialValue="# Heading" initialMode="source" />);

		expect(getByDataRole(container, EDITOR_ROLES.Surface.Source)).toBeInTheDocument();
		expect(queryByDataRole(container, EDITOR_ROLES.Surface.Edit)).toBeNull();
	});

	test("the switcher moves between surfaces and reports the move", async () => {
		const onModeChange = vi.fn();
		const { container } = render(<ControlledEditor initialValue="# Heading" onModeChange={onModeChange} />);

		await switchMode(container, "source");

		expect(onModeChange).toHaveBeenCalledWith("source");
		await waitFor(() => expect(getSurfaceByMode(container, "source").textContent).toContain("# Heading"));
	});

	test("a given mode is controlled: the switcher alone does not change it", async () => {
		const { container } = render(
			<MarkdownEditor
				value="text"
				onChange={() => undefined}
				allowedModes={ALL_MODES}
				mode="edit"
				onModeChange={() => undefined}
			/>
		);

		await switchMode(container, "source");

		// The host owns the mode now. Without it updating the prop, the editor stays put.
		expect(getByDataRole(container, EDITOR_ROLES.Surface.Edit)).toBeInTheDocument();
		expect(queryByDataRole(container, EDITOR_ROLES.Surface.Source)).toBeNull();
	});

	test("the host driving the controlled mode does change it", async () => {
		const ModeHost: FC = () => {
			const [mode, setMode] = useState<MarkdownEditorMode>("edit");

			return (
				<MarkdownEditor
					value="text"
					onChange={() => undefined}
					allowedModes={ALL_MODES}
					mode={mode}
					onModeChange={setMode}
				/>
			);
		};

		const { container } = render(<ModeHost />);

		await switchMode(container, "source");

		await waitFor(() => expect(getByDataRole(container, EDITOR_ROLES.Surface.Source)).toBeInTheDocument());
	});

	test("allowedModes leaves out the modes it does not list", async () => {
		const { container } = render(<ControlledEditor allowedModes={["edit", "view"]} />);

		await openModeMenu(container);

		// The menu is in a portal, so the items are on the page and not in the container.
		expect(await screen.findByDataRole(EDITOR_ROLES.ModeSwitcher.Edit)).toBeInTheDocument();
		expect(await screen.findByDataRole(EDITOR_ROLES.ModeSwitcher.View)).toBeInTheDocument();
		expect(screen.queryByDataRole(EDITOR_ROLES.ModeSwitcher.Source)).toBeNull();
	});

	test("no allowedModes is edit only, so there is no mode menu", () => {
		const { container } = render(<MarkdownEditor value="text" onChange={vi.fn()} />);

		expect(queryByDataRole(container, EDITOR_ROLES.ModeSwitcher.Trigger)).toBeNull();
	});

	test("a custom toolbar can place the mode menu itself", async () => {
		const { container } = render(
			<ControlledEditor
				toolbar={
					<MarkdownEditor.Toolbar>
						<MarkdownEditor.ToolbarGroup>
							<MarkdownEditor.BoldButton />
							<MarkdownEditor.ModeMenu />
						</MarkdownEditor.ToolbarGroup>
					</MarkdownEditor.Toolbar>
				}
			/>
		);

		await switchMode(container, "source");

		await waitFor(() => expect(getByDataRole(container, EDITOR_ROLES.Surface.Source)).toBeInTheDocument());
	});

	test("one allowed mode hides the mode menu altogether", () => {
		const { container } = render(<ControlledEditor allowedModes={["edit"]} />);

		expect(queryByDataRole(container, EDITOR_ROLES.ModeSwitcher.Trigger)).toBeNull();
		expect(queryByDataRole(container, EDITOR_ROLES.ModeSwitcher.Wrapper)).toBeNull();
	});

	test("a mode outside the list falls back to the first one allowed", () => {
		const { container } = render(<ControlledEditor initialMode="source" allowedModes={["view", "edit"]} />);

		// "view" is first in the list, so that is what an unavailable "source" becomes.
		expect(queryByDataRole(container, EDITOR_ROLES.Surface.Source)).toBeNull();
		expect(getSurfaceByMode(container, "view")).toHaveAttribute("contenteditable", "false");
	});
});

describe("placeholder", () => {
	test("shows while the rich editor is empty, and goes when something is typed", async () => {
		const { container } = render(<ControlledEditor placeholder="Write something" />);

		const placeholder = await waitFor(() => getByDataRole(container, EDITOR_ROLES.Placeholder));
		expect(placeholder).toHaveTextContent("Write something");

		await userEvent.click(getSurfaceByMode(container));
		await userEvent.keyboard("x");

		await waitFor(() => expect(queryByDataRole(container, EDITOR_ROLES.Placeholder)).toBeNull());
	});

	test("source mode has one too", async () => {
		const { container } = render(<ControlledEditor placeholder="Raw markdown" initialMode="source" />);

		await waitFor(() => expect(getByDataRole(container, EDITOR_ROLES.Placeholder)).toHaveTextContent("Raw markdown"));
	});

	test("view mode has none: there is nothing to type into", () => {
		const { container } = render(<ControlledEditor placeholder="Write something" initialMode="view" />);

		expect(queryByDataRole(container, EDITOR_ROLES.Placeholder)).toBeNull();
	});

	test("a disabled field has none either", () => {
		const { container } = render(<ControlledEditor placeholder="Write something" disabled />);

		expect(queryByDataRole(container, EDITOR_ROLES.Placeholder)).toBeNull();
	});

	test("a disabled source editor has none either", async () => {
		const { container } = render(<ControlledEditor placeholder="Raw markdown" initialMode="source" disabled />);

		await waitForSurfaceReady(container, "source");

		expect(queryByDataRole(container, EDITOR_ROLES.Placeholder)).toBeNull();
	});
});

describe("minHeight and maxHeight", () => {
	test("the surface starts at minHeight and stops growing at maxHeight", async () => {
		const { container } = render(
			<ControlledEditor initialValue={"line\n\n".repeat(40)} minHeight={80} maxHeight={120} />
		);

		const surface = getSurfaceByMode(container);

		await waitFor(() => expect(surface).toMatchTextContent("line"));

		// Both sizes go on the box that scrolls, which sits above the editable element.
		const box = scrollingBoxOf(surface);
		const styles = getComputedStyle(box);

		expect(styles.minHeight).toBe("80px");
		expect(styles.maxHeight).toBe("120px");
		// Past the maximum it scrolls rather than pushing the page down.
		expect(box.scrollHeight).toBeGreaterThan(box.clientHeight);
	});
});

describe("showToolbar and toolbar", () => {
	test("the toolbar is there by default", () => {
		const { container } = render(<ControlledEditor />);

		expect(getByDataRole(container, EDITOR_ROLES.Toolbar)).toBeInTheDocument();
	});

	test("showToolbar={false} takes it away", () => {
		const { container } = render(<ControlledEditor showToolbar={false} />);

		expect(queryByDataRole(container, EDITOR_ROLES.Toolbar)).toBeNull();
	});

	test("a custom toolbar replaces the built-in one", () => {
		const customToolbar = (
			<MarkdownEditor.Toolbar>
				<MarkdownEditor.ToolbarGroup>
					<MarkdownEditor.BoldButton />
				</MarkdownEditor.ToolbarGroup>
			</MarkdownEditor.Toolbar>
		);

		const { container } = render(<ControlledEditor toolbar={customToolbar} />);

		expect(getToolbarItem(container, "bold")).toBeInTheDocument();
		// Only what the host composed: the rest of the built-in set is gone.
		expect(queryToolbarItem(container, "italic")).toBeNull();
	});

	test("view mode keeps the toolbar bar, with only the mode menu in it", () => {
		const { container } = render(<ControlledEditor initialMode="view" showToolbar />);

		// The bar is still drawn, so the surface below does not jump when the mode changes.
		// Nothing to format here, but the mode menu stays: it is the way out of view mode.
		expect(getByDataRole(container, EDITOR_ROLES.Toolbar)).toBeInTheDocument();
		expect(getByDataRole(container, EDITOR_ROLES.ModeSwitcher.Trigger)).toBeInTheDocument();
		expect(queryToolbarItem(container, "bold")).toBeNull();
	});

	test("switching between view and edit keeps the surface in place", async () => {
		const { container } = render(<ControlledEditor initialMode="edit" showToolbar />);

		const topInEditMode = getSurfaceByMode(container, "edit").getBoundingClientRect().top;

		await switchMode(container, "view");

		await waitFor(() =>
			expect(getSurfaceByMode(container, "view").getBoundingClientRect().top).toBeCloseTo(topInEditMode, 0)
		);
	});
});

describe("extensions and plugins", () => {
	test("an extension teaches the editor markdown it would otherwise not know", async () => {
		const markdown = ":::info\nbody\n:::";
		const withoutExtension = render(<ControlledEditor initialValue={markdown} />);

		// With nothing registered the directive is foreign, so it becomes a placeholder box.
		await waitFor(() => expect(getUnknownDirective(withoutExtension.container)).toBeInTheDocument());

		const withExtension = render(<ControlledEditor initialValue={markdown} extensions={INFO_PANEL_EXTENSIONS} />);

		// With the extension registered it is a panel the editor renders itself.
		await waitFor(() => expect(queryUnknownDirective(withExtension.container)).toBeNull());
	});

	test("a plugin is mounted inside the editor and stays across a mode switch", async () => {
		let mounts = 0;

		const CountingPlugin: FC = () => {
			mounts += 1;

			return null;
		};

		const { container } = render(<ControlledEditor plugins={<CountingPlugin />} />);

		await waitForSurfaceReady(container);
		expect(mounts).toBeGreaterThan(0);

		const mountsBefore = mounts;

		await switchMode(container, "source");
		await waitForSurfaceReady(container, "source");

		// Re-rendered, maybe, but not re-mounted: a plugin holding a subscription keeps it.
		expect(mounts).toBe(mountsBefore);
	});
});

describe("onKeyDown, onFocus and onBlur", () => {
	test("onKeyDown sees the keys, after the editor has acted on them", async () => {
		const onKeyDown = vi.fn();
		const { container } = render(<ControlledEditor onKeyDown={onKeyDown} />);

		await userEvent.click(getSurfaceByMode(container));
		await userEvent.keyboard("a");

		await waitFor(() => expect(onKeyDown).toHaveBeenCalled());
		expect(onKeyDown.mock.calls.at(-1)?.[0]).toMatchObject({ key: "a" });
	});

	test("focus and blur are reported for the surface the user is on", async () => {
		const onFocus = vi.fn();
		const onBlur = vi.fn();
		const { container } = render(
			<>
				<ControlledEditor onFocus={onFocus} onBlur={onBlur} />
				<button type="button" data-role="elsewhere">
					elsewhere
				</button>
			</>
		);

		await userEvent.click(getSurfaceByMode(container));
		await waitFor(() => expect(onFocus).toHaveBeenCalled());

		await userEvent.click(getByDataRole(container, "elsewhere"));
		await waitFor(() => expect(onBlur).toHaveBeenCalled());
	});
});

describe("label, hideLabel and labelGraphic", () => {
	test("the label is rendered and names the editing surface", async () => {
		const { container } = render(<ControlledEditor id="notes" label="Notes" />);

		const label = getByDataRole(container, EDITOR_ROLES.Label);

		expect(label).toHaveTextContent("Notes");
		// The surface points at the label rather than repeating its text.
		expect(getSurfaceByMode(container)).toHaveAttribute("aria-labelledby", "notes-label");
	});

	test("clicking the label puts the caret in the editor", async () => {
		const { container } = render(<ControlledEditor label="Notes" />);

		await userEvent.click(getByDataRole(container, EDITOR_ROLES.Label));

		await waitFor(() => expect(document.activeElement).toBe(getSurfaceByMode(container)));
	});

	test("hideLabel keeps it for screen readers and takes it off the screen", () => {
		const { container } = render(<ControlledEditor label="Notes" hideLabel />);

		const label = getByDataRole(container, EDITOR_ROLES.Label);

		// Still in the tree, still readable — just not taking up room.
		expect(label).toHaveTextContent("Notes");
		expect(label.getBoundingClientRect().height).toBeLessThan(2);
	});

	test("labelGraphic sits next to the label text", () => {
		const { container } = render(<ControlledEditor label="Notes" labelGraphic={<span data-role="graphic">*</span>} />);

		expect(getByDataRole(container, "graphic")).toBeInTheDocument();
	});
});

describe("messages, states and helper text", () => {
	test("each message renders and the surface points at it", () => {
		const { container } = render(
			<ControlledEditor
				id="notes"
				errorMessage="went wrong"
				warningMessage="careful"
				infoMessage="by the way"
				helperText="markdown is welcome"
			/>
		);

		expect(getByDataRole(container, EDITOR_ROLES.ErrorMessage)).toMatchTextContent("went wrong");
		expect(getByDataRole(container, EDITOR_ROLES.WarningMessage)).toMatchTextContent("careful");
		expect(getByDataRole(container, EDITOR_ROLES.InfoMessage)).toMatchTextContent("by the way");
		expect(getByDataRole(container, EDITOR_ROLES.HelperText)).toMatchTextContent("markdown is welcome");

		// One `aria-describedby` naming all four, so a screen reader reads them with the field.
		const describedBy = getSurfaceByMode(container).getAttribute("aria-describedby") ?? "";

		expect(describedBy.split(" ").sort()).toEqual(
			["notes-error", "notes-helper-text", "notes-info", "notes-warning"].sort()
		);
	});

	test("a message it was not given is not rendered", () => {
		const { container } = render(<ControlledEditor errorMessage="went wrong" />);

		expect(queryByDataRole(container, EDITOR_ROLES.WarningMessage)).toBeNull();
		expect(queryByDataRole(container, EDITOR_ROLES.InfoMessage)).toBeNull();
		expect(queryByDataRole(container, EDITOR_ROLES.HelperText)).toBeNull();
	});

	test("clicking the helper text puts the caret in the editor", async () => {
		const { container } = render(<ControlledEditor helperText="markdown is welcome" />);

		await userEvent.click(getByDataRole(container, EDITOR_ROLES.HelperText));

		await waitFor(() => expect(document.activeElement).toBe(getSurfaceByMode(container)));
	});

	test("clicking the helper text leaves a disabled field alone", async () => {
		const { container } = render(<ControlledEditor helperText="markdown is welcome" disabled />);

		await userEvent.click(getByDataRole(container, EDITOR_ROLES.HelperText));

		expect(document.activeElement).not.toBe(getSurfaceByMode(container));
	});

	test("clicking the helper text leaves view mode alone", async () => {
		const { container } = render(<ControlledEditor helperText="markdown is welcome" initialMode="view" />);

		await userEvent.click(getByDataRole(container, EDITOR_ROLES.HelperText));

		expect(isHoldingCaret(getSurfaceByMode(container, "view"))).toBe(false);
	});

	test("the error state marks the surface invalid", () => {
		const { container } = render(<ControlledEditor error />);

		expect(getSurfaceByMode(container)).toHaveAttribute("aria-invalid", "true");
	});

	test("warning and info are looks, not validity", () => {
		const { container } = render(<ControlledEditor warning info />);

		expect(getSurfaceByMode(container)).not.toHaveAttribute("aria-invalid");
	});

	test("tooltips are rendered where the host put them", () => {
		const { container } = render(<ControlledEditor tooltips={<span data-role="tip">hint</span>} />);

		expect(getByDataRole(container, "tip")).toHaveTextContent("hint");
	});
});

describe("readonly and disabled", () => {
	test("readonly shows the document and nothing to edit it with", () => {
		const { container } = render(<ControlledEditor initialValue="text" readonly />);

		// Forced to view mode: no toolbar to press and no switcher to leave with.
		expect(queryByDataRole(container, EDITOR_ROLES.Toolbar)).toBeNull();
		expect(queryByDataRole(container, EDITOR_ROLES.ModeSwitcher.Wrapper)).toBeNull();
		expect(getSurfaceByMode(container, "view")).toHaveAttribute("contenteditable", "false");
	});

	test("readonly refuses typing", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue="text" readonly onChange={onChange} emitMode="change" />
		);

		const surface = getSurfaceByMode(container, "view");

		await userEvent.click(surface, { force: true });
		await userEvent.keyboard("more");

		await wait(PAST_THE_DEBOUNCE_MS);
		expect(onChange).not.toHaveBeenCalled();
		expect(surface).toHaveTextContent("text");
	});

	test("disabled keeps the toolbar in place but switches everything off", async () => {
		const { container } = render(<ControlledEditor initialValue="text" disabled />);

		expect(getSurfaceByMode(container)).toHaveAttribute("aria-disabled", "true");

		// The controls stay visible, so the user can still see the field is there.
		const toolbar = getByDataRole(container, EDITOR_ROLES.Toolbar);
		const modeTrigger = getByDataRole(container, EDITOR_ROLES.ModeSwitcher.Trigger);

		await waitFor(() => {
			for (const button of toolbar.querySelectorAll("button")) {
				// The mode menu keeps working: nothing can be typed, but the user may still
				// want to read the markdown source or the rendered document.
				if (button === modeTrigger) {
					expect(button).toBeEnabled();
					continue;
				}

				expect(button).toBeDisabled();
			}
		});
	});

	test("disabled refuses typing", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue="text" disabled onChange={onChange} emitMode="change" />
		);

		const surface = getSurfaceByMode(container);

		await userEvent.click(surface, { force: true });
		await userEvent.keyboard("more");

		await wait(PAST_THE_DEBOUNCE_MS);
		expect(onChange).not.toHaveBeenCalled();
		expect(surface).toHaveTextContent("text");
	});

	test("disabled in source mode is disabled there too", async () => {
		const onChange = vi.fn();
		const { container } = render(
			<ControlledEditor initialValue="# text" initialMode="source" disabled onChange={onChange} emitMode="change" />
		);

		const surface = getSurfaceByMode(container, "source");

		expect(surface).toHaveAttribute("aria-disabled", "true");
		expect(surface).toHaveAttribute("contenteditable", "false");

		await userEvent.click(surface, { force: true });
		await userEvent.keyboard("more");

		await wait(PAST_THE_DEBOUNCE_MS);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe("id, className and style", () => {
	test("the id names the wrapper and every part built from it", () => {
		const { container } = render(<ControlledEditor id="notes" label="Notes" helperText="help" />);

		expect(container.querySelector("#notes-wrapper")).not.toBeNull();
		expect(container.querySelector("#notes-label")).not.toBeNull();
		expect(container.querySelector("#notes-helper-text")).not.toBeNull();
	});

	test("without an id the parts still get one, so the wiring holds", () => {
		const { container } = render(<ControlledEditor label="Notes" />);

		const labelId = getByDataRole(container, EDITOR_ROLES.Label).id;

		expect(labelId).not.toBe("");
		expect(getSurfaceByMode(container)).toHaveAttribute("aria-labelledby", labelId);
	});

	test("className and style land on the wrapper", () => {
		const { container } = render(<ControlledEditor className="mine" style={{ opacity: 0.5 }} />);

		const wrapper = getByDataRole(container, EDITOR_ROLES.Wrapper);

		expect(wrapper).toHaveClass("mine");
		expect(getComputedStyle(wrapper).opacity).toBe("0.5");
	});
});

describe("fitToParent", () => {
	const BOX_WIDTH = 600;

	/** Renders the editor in a fixed-width box, so "fills its parent" is measurable. */
	function renderInBox(props: { fitToParent?: boolean; showToolbar?: boolean }): HTMLElement {
		const { container } = render(
			<div style={{ width: `${BOX_WIDTH}px` }}>
				<ControlledEditor initialValue="short" {...props} />
			</div>
		);

		return getByDataRole(container, EDITOR_ROLES.Wrapper);
	}

	test("fills its parent by default, like the other inputs", async () => {
		const wrapper = renderInBox({});

		await waitForSurfaceReady(wrapper);

		expect(getByDataRole(wrapper, EDITOR_ROLES.Input.Field).getBoundingClientRect().width).toBe(BOX_WIDTH);
	});

	test("fitToParent={false} sizes the field to its content", async () => {
		// No toolbar, because a toolbar is wider than this box and would fill it on its
		// own — hiding the very thing being measured.
		const wrapper = renderInBox({ fitToParent: false, showToolbar: false });

		await waitForSurfaceReady(wrapper);

		expect(getByDataRole(wrapper, EDITOR_ROLES.Input.Field).getBoundingClientRect().width).toBeLessThan(BOX_WIDTH);
	});

	test("a shown toolbar still claims the full width when fitToParent is off", async () => {
		// Shrink-to-fit means "as wide as the widest content", and the toolbar is the widest
		// content. Worth pinning so the combination is not read as a bug.
		const wrapper = renderInBox({ fitToParent: false, showToolbar: true });

		await waitForSurfaceReady(wrapper);

		expect(getByDataRole(wrapper, EDITOR_ROLES.Input.Field).getBoundingClientRect().width).toBe(BOX_WIDTH);
	});
});
