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

import { fireEvent, getByDataRole, render } from "test-utils";
import { describe, expect, test, vi } from "vitest";

import { Icon } from "../../icon/main/icon.view.js";
import { getCompactTheme } from "../../theme/index.js";

import type { TagProps } from "../main/tag/tag.api.js";
import { Tag } from "../main/tag/tag.view.js";

describe("com.mgmtp.a12.widgets.tag", () => {
	const baseDataRole = "tag";
	const baseProps: Partial<TagProps> = {
		id: "test-id",
		className: "test-class",
		style: { background: "red" }
	};
	const tagContent = "This is the tag content";

	test("render basic tag with some custom properties", () => {
		const { container } = render(<Tag {...baseProps}>{tagContent}</Tag>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render tag with icon", () => {
		const { container } = render(<Tag icon={<Icon>desktop_mac</Icon>}>{tagContent}</Tag>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test custom color", () => {
		const { container } = render(
			<Tag icon={<Icon>desktop_mac</Icon>} color="red">
				{tagContent}
			</Tag>
		);
		expect(getByDataRole(container, `${baseDataRole}-icon`)).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
		expect(getByDataRole(container, `${baseDataRole}-content`)).toHaveStyle({ borderTopColor: "rgb(255, 0, 0)" });
		expect(getByDataRole(container, `${baseDataRole}-content`)).toHaveStyle({
			borderBottomColor: "rgb(255, 0, 0)"
		});
		expect(getByDataRole(container, `${baseDataRole}-content`)).toHaveStyle({ borderLeftColor: "rgb(255, 0, 0)" });
		expect(getByDataRole(container, `${baseDataRole}-content`)).toHaveStyle({ borderRightColor: "rgb(255, 0, 0)" });
	});

	test("render tag with noWaiAria", () => {
		const { container } = render(<Tag noWaiAria>{tagContent}</Tag>);
		const tagWrapper = getByDataRole(container, baseDataRole);
		expect(tagWrapper.getAttribute("role")).toEqual(null);
		expect(tagWrapper.getAttribute("aria-hidden")).toBeTruthy();
	});

	test("render removable tag and simulate click event", () => {
		const onRemoveSpy = vi.fn();
		const { container } = render(
			<Tag removable onRemove={onRemoveSpy}>
				{tagContent}
			</Tag>
		);

		expect(container.firstChild).toMatchSnapshot();

		const removeButton = getByDataRole(container, "button");
		fireEvent.click(removeButton);
		expect(onRemoveSpy).toHaveBeenCalledTimes(1);
	});

	describe("Compact theme", () => {
		const compactTheme = getCompactTheme();

		test("render extended tag", () => {
			const { container } = render(<Tag icon={<Icon>label</Icon>}>{tagContent}</Tag>, { theme: compactTheme });
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render removable tag", () => {
			const { container } = render(<Tag removable>{tagContent}</Tag>, { theme: compactTheme });
			expect(container.firstChild).toMatchSnapshot();
		});

		test("render removable extended tag", () => {
			const { container } = render(
				<Tag icon={<Icon>label</Icon>} removable>
					{tagContent}
				</Tag>,
				{ theme: compactTheme }
			);
			expect(container.firstChild).toMatchSnapshot();
		});
	});
});
