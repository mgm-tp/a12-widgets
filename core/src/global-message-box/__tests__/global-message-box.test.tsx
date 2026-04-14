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

import { getAllByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";

import { Icon } from "../../icon/main/icon.view.js";
import { ButtonGroup } from "../../button-group/main/button-group.view.js";
import { Button } from "../../button/main/button.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { GlobalMessageBox } from "../main/global-message-box.view.js";

describe("com.mgmtp.a12.widgets.global-message-box", () => {
	test("rendering INFO global-message-box", () => {
		const iconName = "info";
		const { container } = render(<GlobalMessageBox variant="info" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering SUCCESS global-message-box", () => {
		const iconName = "check_circle";
		const { container } = render(<GlobalMessageBox variant="success" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering WARNING global-message-box", () => {
		const iconName = "warning";
		const { container } = render(<GlobalMessageBox variant="warning" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering ERROR global-message-box", () => {
		const iconName = "error";
		const { container } = render(<GlobalMessageBox variant="error" icon={<Icon>{iconName}</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering global-message-box with provided props", () => {
		const properties = {
			id: "box-id",
			className: "test class",
			style: {
				backgroundColor: "blue"
			}
		};
		const { container } = render(<GlobalMessageBox {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering global-message-box with a custom icon", () => {
		const iconName = "speaker_notes";
		const { container } = render(<GlobalMessageBox icon={<Icon>{iconName}</Icon>} variant="info" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering false-ellipsis (multiline) global-message-box", () => {
		const { container } = render(<GlobalMessageBox ellipsis={false} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering CONTENT global-message-box", () => {
		const content = "test content";
		const { container } = render(<GlobalMessageBox content={content} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering base global-message-box", () => {
		const { container, getByDataRole } = render(<GlobalMessageBox content="a" />);
		const textWrapper = getByDataRole(DataRoles.GlobalMessageBox.Text);

		expect(textWrapper?.getAttribute("role") === "heading").toBeTruthy();
		expect(textWrapper?.getAttribute("aria-level") === "2").toBeTruthy();
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering ACTIONS global-message-box", () => {
		const buttons = (
			<ButtonGroup>
				<Button label="Secondary" secondary invert />
				<Button label="Primary" primary invert />
			</ButtonGroup>
		);
		const { container } = render(<GlobalMessageBox actions={buttons} />);

		expect(getAllByDataRole(container, DataRoles.GlobalMessageBox.Actions)).toHaveLength(1);
		expect(container.firstChild).toMatchSnapshot();
	});
});
