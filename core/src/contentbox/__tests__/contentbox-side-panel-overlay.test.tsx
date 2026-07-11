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

import { useRef, useState } from "react";
import type { ReactElement } from "react";
import { render, fireEvent, waitFor } from "test-utils";
import { describe, test, expect } from "vitest";
import { userEvent } from "vitest/browser";

import { DataRoles } from "../../common/main/data-roles.js";
import { Button } from "../../button/index.js";

import { ContentBox } from "../main/template/contentbox.tpl.view.js";

const ContentBoxWithSidePane = ({ mode }: { mode: "overlay" | "docked" }): ReactElement => {
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const [openPane, setOpenPane] = useState(false);

	const getButtonRef = (ref: HTMLButtonElement | null) => {
		triggerRef.current = ref;
	};

	return (
		<>
			<Button data-testid="trigger-btn" buttonRef={getButtonRef} onClick={() => setOpenPane((prev) => !prev)}>
				Toggle
			</Button>
			<ContentBox
				heading={null}
				sidePanels={{
					right: {
						hide: !openPane,
						mode,
						onClose: () => setOpenPane(false),
						triggerReference: triggerRef,
						content: <div>Panel content</div>
					}
				}}
			/>
		</>
	);
};

describe("ContentBox - overlay side panel", () => {
	test("should toggle side pane when click to trigger element", async () => {
		const { getByDataRole, findByDataRole } = render(<ContentBoxWithSidePane mode="overlay" />);

		const triggerButton = getByDataRole(DataRoles.Button);

		await userEvent.click(triggerButton);

		const sidePane = await findByDataRole(DataRoles.SupportingPanesLayout.SecondaryPane);

		expect(sidePane).toBeInTheDocument();

		await userEvent.click(triggerButton);

		await waitFor(() => expect(sidePane).not.toBeInTheDocument());
	});

	test("should close overlay pane when clicking outside", async () => {
		const { getByTestId, getByDataRole, findByDataRole } = render(<ContentBoxWithSidePane mode="overlay" />);

		const triggerButton = getByTestId("trigger-btn");

		await userEvent.click(triggerButton);

		const sidePane = await findByDataRole(DataRoles.SupportingPanesLayout.SecondaryPane);

		expect(sidePane).toBeInTheDocument();

		fireEvent.mouseDown(getByDataRole(DataRoles.Contentbox.Content));

		await waitFor(() => expect(sidePane).not.toBeInTheDocument());
	});
});

describe("ContentBox - docked side panel", () => {
	test("should toggle side pane when click to trigger element", async () => {
		const { getByDataRole, findByDataRole } = render(<ContentBoxWithSidePane mode="docked" />);

		const triggerButton = getByDataRole(DataRoles.Button);

		await userEvent.click(triggerButton);

		const sidePane = await findByDataRole(DataRoles.SupportingPanesLayout.SecondaryPane);

		expect(sidePane).toBeInTheDocument();

		await userEvent.click(triggerButton);

		await waitFor(() => expect(sidePane).not.toBeInTheDocument());
	});

	test("should not close side pane when clicking outside", async () => {
		const { getByDataRole, findByDataRole } = render(<ContentBoxWithSidePane mode="docked" />);

		const triggerButton = getByDataRole(DataRoles.Button);

		await userEvent.click(triggerButton);

		const sidePane = await findByDataRole(DataRoles.SupportingPanesLayout.SecondaryPane);

		expect(sidePane).toBeInTheDocument();

		await userEvent.click(getByDataRole(DataRoles.Contentbox.Content));

		expect(sidePane).toBeInTheDocument();
	});
});
