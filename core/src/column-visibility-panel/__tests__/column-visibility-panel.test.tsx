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

import type { ReactElement, ReactNode } from "react";
import { useRef, useState } from "react";
import type { RenderResult } from "test-utils";
import {
	getAllByDataRole,
	getByDataRole,
	queryAllByDataRole,
	queryByDataRole,
	render,
	screen,
	waitFor
} from "test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { noop } from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";
import type {
	ColumnVisibilityItem,
	ColumnVisibilityMap,
	ColumnVisibilityPanelProps
} from "../main/column-visibility-panel.api.js";
import { ColumnVisibilityPanel } from "../main/column-visibility-panel.view.js";

type TestColumn = Omit<ColumnVisibilityItem, "visible">;

const COLUMNS: TestColumn[] = [
	{ id: "name", label: "Name" },
	{ id: "role", label: "Role" },
	{ id: "notes", label: "Notes", defaultVisible: false }
];

interface HarnessProps extends Partial<ColumnVisibilityPanelProps> {
	columns?: TestColumn[];
}

/**
 * The panel is controlled, so every test drives it through the consumer that owns the trigger and
 * the visibility — the way an engine uses it.
 */
function Harness({ columns = COLUMNS, onVisibilityChange, onClose, ...rest }: HarnessProps): ReactNode {
	const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
	const [open, setOpen] = useState(true);
	const [visibility, setVisibility] = useState<ColumnVisibilityMap>(() =>
		Object.fromEntries(columns.map((column) => [column.id, column.defaultVisible ?? true]))
	);

	const items: ColumnVisibilityItem[] = columns.map((column) => ({
		...column,
		visible: visibility[column.id] ?? true
	}));

	return (
		<>
			<Button
				dataRole="trigger"
				buttonRef={setTrigger}
				label="Columns"
				onClick={() => setOpen((wasOpen) => !wasOpen)}
			/>
			{trigger && open && (
				<ColumnVisibilityPanel
					items={items}
					triggerElement={trigger}
					onVisibilityChange={(newVisibility, change) => {
						setVisibility(newVisibility);
						onVisibilityChange?.(newVisibility, change);
					}}
					onClose={(reason) => {
						setOpen(false);
						onClose?.(reason);
					}}
					{...rest}
				/>
			)}
		</>
	);
}

/** The trigger handed over as a reference, which is filled in by the same commit as the panel. */
function RefHarness(props: Partial<ColumnVisibilityPanelProps>): ReactNode {
	const trigger = useRef<HTMLButtonElement | null>(null);

	return (
		<>
			<Button
				dataRole="trigger"
				buttonRef={(ref) => {
					trigger.current = ref;
				}}
				label="Columns"
			/>
			<ColumnVisibilityPanel
				items={COLUMNS.map((column) => ({ ...column, visible: true }))}
				triggerElement={trigger}
				onVisibilityChange={noop}
				{...props}
			/>
		</>
	);
}

/** Renders a consumer and waits for the panel, which only appears once the trigger is committed. */
async function renderPanel(ui: ReactElement = <Harness />): Promise<RenderResult & { panel: HTMLElement }> {
	const result = render(ui);
	const panel = await screen.findByDataRole(DataRoles.ColumnVisibilityPanel);

	return { ...result, panel };
}

const getPanel = (): HTMLElement => screen.getByDataRole(DataRoles.ColumnVisibilityPanel);

/** The option element, which carries the selection state, the column's name and the focus. */
const getRows = (): HTMLElement[] => queryAllByDataRole(getPanel(), DataRoles.Dropdown.Item);
const isChecked = (row: HTMLElement): boolean => row.getAttribute("aria-checked") === "true";
const getResetButton = (): HTMLElement => getByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.ResetButton);
const getShowAllButton = (): HTMLElement => getByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.ShowAllButton);
const getSearchInput = (): HTMLElement =>
	getByDataRole(getByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.Search), DataRoles.TextField.Input);
const getRowLabels = (): string[] =>
	getRows().map((row) => queryByDataRole(row, DataRoles.Dropdown.Text)?.textContent ?? row.textContent ?? "");

describe("com.mgmtp.a12.widgets.columnVisibilityPanel", () => {
	test("render the panel", async () => {
		render(<Harness />);

		expect(await screen.findByDataRole(DataRoles.ColumnVisibilityPanel)).toMatchSnapshot();
	});

	test("render nothing while closed", () => {
		const { container } = render(<Harness open={false} />);

		expect(queryByDataRole(document.body, DataRoles.ColumnVisibilityPanel)).toBeNull();
		expect(getByDataRole(container, "trigger")).toBeInTheDocument();
	});

	test("list one row per column, labelled by the column and checked by its visibility", async () => {
		await renderPanel();

		const rows = getRows();

		expect(rows).toHaveLength(3);
		expect(rows[0]).toHaveAttribute("role", "option");
		expect(rows[0]).toHaveAttribute("aria-selected", "true");
		expect(getByDataRole(getPanel(), DataRoles.Dropdown.Content)).toHaveAttribute("aria-multiselectable", "true");
		expect(isChecked(rows[0]!)).toBe(true);
		expect(isChecked(rows[1]!)).toBe(true);
		expect(isChecked(rows[2]!)).toBe(false);
		expect(getPanel().textContent).toContain("Name");
	});

	test("report the whole visibility map and stay open when a column is toggled", async () => {
		const onVisibilityChange = vi.fn();
		await renderPanel(<Harness onVisibilityChange={onVisibilityChange} />);

		await userEvent.click(getRows()[1]!);

		expect(onVisibilityChange).toHaveBeenCalledTimes(1);
		expect(onVisibilityChange).toHaveBeenLastCalledWith(
			{ name: true, role: false, notes: false },
			{ id: "role", visible: false }
		);
		expect(getPanel()).toBeInTheDocument();
		expect(isChecked(getRows()[1]!)).toBe(false);

		await userEvent.click(getRows()[2]!);

		expect(onVisibilityChange).toHaveBeenCalledTimes(2);
		expect(onVisibilityChange).toHaveBeenLastCalledWith(
			{ name: true, role: false, notes: true },
			{ id: "notes", visible: true }
		);
		expect(getPanel()).toBeInTheDocument();
	});

	test("toggle a row with ENTER and with SPACE", async () => {
		const onVisibilityChange = vi.fn();
		await renderPanel(<Harness onVisibilityChange={onVisibilityChange} />);

		getRows()[0]!.focus();
		await userEvent.keyboard("{Enter}");

		expect(onVisibilityChange).toHaveBeenLastCalledWith(
			{ name: false, role: true, notes: false },
			{ id: "name", visible: false }
		);
		expect(isChecked(getRows()[0]!)).toBe(false);

		getRows()[0]!.focus();
		await userEvent.keyboard(" ");

		expect(onVisibilityChange).toHaveBeenLastCalledWith(
			{ name: true, role: true, notes: false },
			{ id: "name", visible: true }
		);
		expect(isChecked(getRows()[0]!)).toBe(true);
		expect(getPanel()).toBeInTheDocument();
	});

	test("move the focus between the rows with the arrow keys", async () => {
		await renderPanel();

		const rows = getRows();

		rows[0]!.focus();
		await userEvent.keyboard("{ArrowDown}");

		expect(document.activeElement).toBe(rows[1]);

		await userEvent.keyboard("{ArrowUp}");

		expect(document.activeElement).toBe(rows[0]);
	});

	test("make the row the only tab stop it needs", async () => {
		const { panel } = await renderPanel();

		// The indicator is not a stop of its own, and the list hides it from assistive technologies.
		const indicators = getAllByDataRole(panel, DataRoles.Checkbox.Input);

		expect(indicators).toHaveLength(3);
		expect(indicators.every((indicator) => indicator.getAttribute("tabindex") === "-1")).toBe(true);
		expect(getRows().every((row) => row.getAttribute("tabindex") === "0")).toBe(true);
		expect(
			getAllByDataRole(panel, DataRoles.Dropdown.Text).every((text) => text.getAttribute("aria-hidden") === "true")
		).toBe(true);
	});

	test("do not report anything for a disabled column", async () => {
		const onVisibilityChange = vi.fn();
		await renderPanel(
			<Harness
				columns={[{ id: "name", label: "Name", disabled: true }, ...COLUMNS.slice(1)]}
				onVisibilityChange={onVisibilityChange}
			/>
		);

		expect(getRows()[0]).toHaveAttribute("aria-disabled", "true");

		await userEvent.click(getRows()[0]!, { force: true });

		expect(onVisibilityChange).not.toHaveBeenCalled();
	});

	describe("reset", () => {
		test("disable the reset action while no column deviates from its default", async () => {
			await renderPanel();

			expect(getResetButton()).toBeDisabled();
		});

		test("restore the default visibility and report it", async () => {
			const onVisibilityChange = vi.fn();
			const onReset = vi.fn();
			await renderPanel(<Harness onVisibilityChange={onVisibilityChange} onReset={onReset} />);

			await userEvent.click(getRows()[0]!);
			expect(getResetButton()).toBeEnabled();

			await userEvent.click(getResetButton());

			expect(onReset).toHaveBeenCalledWith({ name: true, role: true, notes: false });
			expect(onVisibilityChange).toHaveBeenLastCalledWith({ name: true, role: true, notes: false }, undefined);
			expect(getResetButton()).toBeDisabled();
			expect(isChecked(getRows()[0]!)).toBe(true);
			expect(isChecked(getRows()[2]!)).toBe(false);
		});

		test("leave a disabled column alone", async () => {
			const onReset = vi.fn();
			await renderPanel(
				<Harness
					items={[
						// Shown although its default is hidden, and disabled — a reset must not touch it.
						{ id: "name", label: "Name", visible: true, disabled: true, defaultVisible: false },
						{ id: "role", label: "Role", visible: false }
					]}
					onReset={onReset}
				/>
			);

			await userEvent.click(getResetButton());

			expect(onReset).toHaveBeenCalledWith({ name: true, role: true });
		});

		test("leave the reset action out on request", async () => {
			await renderPanel(<Harness hideReset />);

			expect(queryByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.ResetButton)).toBeNull();
		});
	});

	describe("show all", () => {
		test("show every listed column and leave the disabled ones alone", async () => {
			const onVisibilityChange = vi.fn();
			await renderPanel(
				<Harness
					showAll
					columns={[
						{ id: "name", label: "Name" },
						{ id: "role", label: "Role", defaultVisible: false },
						{ id: "notes", label: "Notes", defaultVisible: false, disabled: true }
					]}
					onVisibilityChange={onVisibilityChange}
				/>
			);

			expect(getShowAllButton()).toBeEnabled();

			await userEvent.click(getShowAllButton());

			expect(onVisibilityChange).toHaveBeenCalledWith({ name: true, role: true, notes: false }, undefined);
			expect(getShowAllButton()).toBeDisabled();
		});

		test("disable the action while every column is shown", async () => {
			await renderPanel(<Harness showAll columns={COLUMNS.slice(0, 2)} />);

			expect(getShowAllButton()).toBeDisabled();
		});

		test("leave the action out unless it is asked for", async () => {
			await renderPanel();

			expect(queryByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.ShowAllButton)).toBeNull();
		});

		test("apply to the searched columns only", async () => {
			const onVisibilityChange = vi.fn();
			await renderPanel(
				<Harness
					showAll
					searchable
					items={[
						{ id: "name", label: "Name", visible: false },
						{ id: "role", label: "Role", visible: false },
						{ id: "notes", label: "Notes", visible: false }
					]}
					onVisibilityChange={onVisibilityChange}
				/>
			);

			await userEvent.fill(getSearchInput(), "ro");
			await userEvent.click(getShowAllButton());

			expect(onVisibilityChange).toHaveBeenCalledWith({ name: false, role: true, notes: false }, undefined);
		});
	});

	describe("search", () => {
		test("narrow the list to the matching columns, ignoring case", async () => {
			const onSearchChange = vi.fn();
			await renderPanel(<Harness searchable onSearchChange={onSearchChange} />);

			await userEvent.fill(getSearchInput(), "NO");

			expect(getRowLabels()).toEqual(["Notes"]);
			expect(onSearchChange).toHaveBeenLastCalledWith("NO");
		});

		test("match a row without a label by its title", async () => {
			await renderPanel(
				<Harness searchable columns={[{ id: "warning", icon: <Icon>warning</Icon>, title: "Warnings" }, ...COLUMNS]} />
			);

			await userEvent.fill(getSearchInput(), "warn");

			expect(getRows()).toHaveLength(1);
			expect(getRows()[0]).toHaveAccessibleName("Warnings");
		});

		test("report that nothing matches", async () => {
			await renderPanel(<Harness searchable />);

			await userEvent.fill(getSearchInput(), "salary");

			expect(queryByDataRole(getPanel(), DataRoles.Dropdown.Content)).toBeNull();
			expect(getByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.NoResults).textContent).toBe(
				"No matching columns"
			);
		});

		test("clear the search and put the focus back into the field", async () => {
			await renderPanel(<Harness searchable />);

			await userEvent.fill(getSearchInput(), "notes");
			expect(getRowLabels()).toHaveLength(1);

			await userEvent.click(getByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.Search.ClearButton));

			expect(getRowLabels()).toHaveLength(3);
			expect(document.activeElement).toBe(getSearchInput());
		});

		test("take the focus when the panel opens", async () => {
			await renderPanel(<Harness searchable />);

			await waitFor(() => expect(document.activeElement).toBe(getSearchInput()));
		});

		test("leave the search field out unless it is asked for", async () => {
			await renderPanel();

			expect(queryByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.Search)).toBeNull();
		});

		test("rest the focus on the panel itself, and show no ring for it, without a search field", async () => {
			const { panel } = await renderPanel();

			// The panel holds the focus to keep TAB inside, but shows no ring: it is not a control.
			await waitFor(() => expect(panel).toHaveFocus());
			expect(getComputedStyle(panel).outlineStyle).toBe("none");
		});
	});

	describe("closing", () => {
		test("close on ESC and return the focus to the trigger", async () => {
			const onClose = vi.fn();
			const { container } = await renderPanel(<Harness onClose={onClose} />);

			await userEvent.keyboard("{Escape}");

			expect(onClose).toHaveBeenCalledWith("onEscape");
			expect(queryByDataRole(document.body, DataRoles.ColumnVisibilityPanel)).toBeNull();
			expect(document.activeElement).toBe(getByDataRole(container, "trigger"));
		});

		test("close on an outside click", async () => {
			const onClose = vi.fn();
			await renderPanel(<Harness onClose={onClose} />);

			await userEvent.click(document.body);

			expect(onClose).toHaveBeenCalledWith("onOutsideClick");
			expect(queryByDataRole(document.body, DataRoles.ColumnVisibilityPanel)).toBeNull();
		});

		test("close on ESC in the modal presentation with the same reason", async () => {
			const onClose = vi.fn();
			await renderPanel(<Harness presentation="modal" onClose={onClose} />);

			// The focus starts on the overlay container, above the panel — ESC is only heard there.
			await userEvent.keyboard("{Escape}");

			expect(onClose).toHaveBeenCalledWith("onEscape");
		});

		test("keep the panel open on ESC when closeOnEsc is off", async () => {
			const onClose = vi.fn();
			await renderPanel(<Harness closeOnEsc={false} onClose={onClose} />);

			await userEvent.keyboard("{Escape}");

			expect(onClose).not.toHaveBeenCalled();
			expect(getPanel()).toBeInTheDocument();
		});

		test("keep the focus inside the panel and wrap it around on TAB", async () => {
			const onClose = vi.fn();
			await renderPanel(<Harness onClose={onClose} />);

			// The reset action is disabled while nothing deviates, so the last row is the last stop.
			getRows()[2]!.focus();
			await userEvent.keyboard("{Tab}");

			expect(onClose).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(getRows()[0]);
		});

		test("wrap TAB around the dialog in the modal presentation too", async () => {
			await renderPanel(<Harness presentation="modal" searchable showAll />);

			getShowAllButton().focus();
			await userEvent.keyboard("{Tab}");

			// Straight on to the close button, not by way of the overlay container.
			expect(document.activeElement).toBe(getByDataRole(getPanel(), DataRoles.ColumnVisibilityPanel.CloseButton));
		});

		test("let go of the row highlight once the focus leaves the list", async () => {
			await renderPanel(<Harness searchable showAll />);

			getRows()[2]!.focus();

			await waitFor(() => expect(getRows()[2]).toHaveAttribute("data-preselect", "true"));

			await userEvent.keyboard("{Tab}");

			expect(document.activeElement).toBe(getShowAllButton());
			expect(getRows().map((row) => row.getAttribute("data-preselect"))).toEqual(["false", "false", "false"]);
		});

		test("close when the focus tabs out of the panel with closeOnTabOut on", async () => {
			const onClose = vi.fn();
			const { container } = await renderPanel(<Harness closeOnTabOut onClose={onClose} />);

			getRows()[2]!.focus();
			await userEvent.keyboard("{Tab}");

			expect(onClose).toHaveBeenCalledWith("onTab");
			expect(document.activeElement).toBe(getByDataRole(container, "trigger"));
		});
	});

	describe("disabled", () => {
		test("disable every control but the close button", async () => {
			const onVisibilityChange = vi.fn();
			const { panel } = await renderPanel(
				<Harness disabled searchable showAll presentation="modal" onVisibilityChange={onVisibilityChange} />
			);

			expect(getRows().every((row) => row.getAttribute("aria-disabled") === "true")).toBe(true);
			expect(getResetButton()).toBeDisabled();
			expect(getShowAllButton()).toBeDisabled();
			expect(getSearchInput()).toBeDisabled();
			expect(getByDataRole(panel, DataRoles.ColumnVisibilityPanel.CloseButton)).toBeEnabled();

			await userEvent.click(getRows()[1]!, { force: true });

			expect(onVisibilityChange).not.toHaveBeenCalled();
		});

		test("keep the focus inside the dialog although the search field cannot take it", async () => {
			await renderPanel(<Harness disabled searchable presentation="modal" />);

			const overlay = screen.getByDataRole(DataRoles.Modal.OverlayContent);

			await waitFor(() => expect(overlay).toContainElement(document.activeElement as HTMLElement));
		});
	});

	describe("the trigger", () => {
		test("attach to a trigger handed over as a reference", async () => {
			const { panel } = await renderPanel(<RefHarness presentation="attached" />);

			expect(panel).toHaveAttribute("role", "dialog");
			expect(queryByDataRole(document.body, DataRoles.Modal.OverlayContent)).toBeNull();
			expect(screen.getByDataRole(DataRoles.AttachedPortal)).toContainElement(panel);
		});

		test("wait for the trigger of an attached panel instead of turning into a modal", () => {
			render(
				<ColumnVisibilityPanel
					presentation="attached"
					items={COLUMNS.map((column) => ({ ...column, visible: true }))}
					onVisibilityChange={noop}
				/>
			);

			expect(queryByDataRole(document.body, DataRoles.ColumnVisibilityPanel)).toBeNull();
			expect(queryByDataRole(document.body, DataRoles.Modal.OverlayContent)).toBeNull();
		});

		test("fall back to the modal without a trigger", async () => {
			await renderPanel(
				<ColumnVisibilityPanel
					items={COLUMNS.map((column) => ({ ...column, visible: true }))}
					onVisibilityChange={noop}
				/>
			);

			expect(screen.getByDataRole(DataRoles.Modal.OverlayContent)).toHaveAttribute("aria-modal", "true");
		});
	});

	test("show no search message for a panel without any column", async () => {
		const { panel } = await renderPanel(<Harness searchable items={[]} />);

		expect(queryByDataRole(panel, DataRoles.ColumnVisibilityPanel.NoResults)).toBeNull();
		expect(getRows()).toHaveLength(0);
	});

	describe("dialog semantics", () => {
		test("name the dialog by its title", async () => {
			const { panel } = await renderPanel();

			expect(panel).toHaveAttribute("role", "dialog");
			expect(panel).toHaveAccessibleName("Columns");
			expect(panel).not.toHaveAttribute("aria-modal");
		});

		test("name the dialog by a custom title", async () => {
			const { panel } = await renderPanel(<Harness title="Displayed columns" />);

			expect(panel).toHaveAccessibleName("Displayed columns");
		});

		test("name the dialog by ariaLabel when the title is not a text", async () => {
			const { panel } = await renderPanel(<Harness title={<Icon>view_column</Icon>} ariaLabel="Displayed columns" />);

			expect(panel).toHaveAccessibleName("Displayed columns");
		});

		test("name a row without a label by its title", async () => {
			await renderPanel(<Harness columns={[{ id: "warning", icon: <Icon>warning</Icon>, title: "Warnings" }]} />);

			expect(getRows()[0]).toHaveAccessibleName("Warnings");
		});
	});

	describe("small screens", () => {
		test("show a close button in the modal presentation", async () => {
			const onClose = vi.fn();
			const { panel } = await renderPanel(<Harness presentation="modal" onClose={onClose} />);

			// The overlay is the dialog here, and it is the one that carries the panel's name.
			const overlay = screen.getByDataRole(DataRoles.Modal.OverlayContent);

			expect(panel).not.toHaveAttribute("role");
			expect(overlay).toHaveAttribute("aria-modal", "true");
			expect(overlay).toHaveAccessibleName("Columns");

			await userEvent.click(getByDataRole(panel, DataRoles.ColumnVisibilityPanel.CloseButton));

			expect(onClose).toHaveBeenCalledWith("onCloseButton");
		});

		describe("on a narrow viewport", () => {
			const originalViewport = { width: window.innerWidth, height: window.innerHeight };

			beforeEach(async () => {
				await page.viewport(500, originalViewport.height);
			});

			afterEach(async () => {
				await page.viewport(originalViewport.width, originalViewport.height);
			});

			test("present the panel as a modal on a small screen", async () => {
				const { panel } = await renderPanel();

				expect(screen.getByDataRole(DataRoles.Modal.OverlayContent)).toHaveAttribute("aria-modal", "true");
				expect(getByDataRole(panel, DataRoles.ColumnVisibilityPanel.CloseButton)).toBeInTheDocument();
			});

			test("keep the attached presentation on a small screen when it is requested", async () => {
				const { panel } = await renderPanel(<Harness presentation="attached" />);

				expect(panel).toHaveAttribute("role", "dialog");
				expect(queryByDataRole(document.body, DataRoles.Modal.OverlayContent)).toBeNull();
				expect(queryByDataRole(panel, DataRoles.ColumnVisibilityPanel.CloseButton)).toBeNull();
			});
		});
	});
});
