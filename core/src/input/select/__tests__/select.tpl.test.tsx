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

import { Key } from "ts-key-enum";
import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, test, expect, vi } from "vitest";

import { DataRoles } from "../../../common/main/data-roles.js";

import type { SelectTemplateProps } from "../main/template/select.tpl.api.js";
import { SelectTemplate } from "../main/template/select.tpl.view.js";

const properties: Partial<SelectTemplateProps> = {
	id: "test-id",
	className: "test-classname",
	style: { backgroundColor: "red" },
	helperText: "Test Helper Text",
	label: "Test Label",
	errorMessage: "Test error message",
	warningMessage: "Test warning message",
	infoMessage: "Test info message",
	tooltips: <div className="test-tooltip">Test tooltip</div>
};

describe("com.mgmtp.a12.widgets.input.select.template", () => {
	test("render select template", () => {
		const { container } = render(
			<SelectTemplate
				id={properties.id}
				className={properties.className}
				style={properties.style}
				label={properties.label}
			>
				options
			</SelectTemplate>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with hidden label", () => {
		const { container } = render(<SelectTemplate label={properties.label} hideLabel />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render warning select", () => {
		const { container } = render(<SelectTemplate warning warningMessage={properties.warningMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render error select", () => {
		const { container } = render(<SelectTemplate error errorMessage={properties.errorMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render info select", () => {
		const { container } = render(<SelectTemplate info infoMessage={properties.infoMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with helper text", () => {
		const { container } = render(<SelectTemplate helperText={properties.helperText} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly select", () => {
		const { container } = render(<SelectTemplate readonly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled select", () => {
		const { container } = render(<SelectTemplate disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with tooltip", () => {
		const { container } = render(<SelectTemplate tooltips={properties.tooltips} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select with tooltip in new line", () => {
		const { container } = render(<SelectTemplate tooltips={properties.tooltips} breakTooltipsToNewLine />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render select wrapper DOM props", () => {
		const { container } = render(<SelectTemplate selectWrapperDOMProps={{ title: "wrapper title" }} />);
		expect(container.querySelector(`[data-role=${DataRoles.Select.Wrapper}]`)?.getAttribute("title")).toEqual(
			"wrapper title"
		);
	});

	test("simulate events", () => {
		const selectWrapperRefSpy = vi.fn();
		const helperTextRefSpy = vi.fn();
		const labelRefSpy = vi.fn();
		const onSelectWrapperClickSpy = vi.fn();
		const onSelectWrapperKeyDownSpy = vi.fn();

		const { container } = render(
			<SelectTemplate
				label={properties.label}
				helperText={properties.helperText}
				selectWrapperRef={selectWrapperRefSpy}
				helperTextRef={helperTextRefSpy}
				labelRef={labelRefSpy}
				onSelectWrapperClick={onSelectWrapperClickSpy}
				onSelectWrapperKeyDown={onSelectWrapperKeyDownSpy}
			/>
		);

		expect(selectWrapperRefSpy).toHaveBeenCalledTimes(1);
		expect(helperTextRefSpy).toHaveBeenCalledTimes(1);
		expect(labelRefSpy).toHaveBeenCalledTimes(1);

		const wrapper = getByDataRole(container, DataRoles.Select.Wrapper);

		fireEvent.click(wrapper);
		expect(onSelectWrapperClickSpy).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(wrapper, { key: Key.Enter });
		expect(onSelectWrapperKeyDownSpy).toHaveBeenCalledTimes(1);
	});
});
