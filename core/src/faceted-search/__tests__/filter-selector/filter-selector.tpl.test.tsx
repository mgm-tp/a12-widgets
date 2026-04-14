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

import type { CSSProperties } from "react";
import { render, fireEvent } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { provider } from "../../../common/main/device-detector.js";
import { FilterSelectorTemplate } from "../../main/filter-selector/tpl/filter-selector.tpl.view.js";
import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import type { FilterSelectorTemplateProps } from "../../main/filter-selector/tpl/filter-selector.tpl.api.js";

describe("com.mgmtp.a12.widgets.filter-selector", () => {
	const testStyle: CSSProperties = { backgroundColor: "red" };
	const testId = "testId";
	const testClass = "testClass";
	const sampleChild = "Sample Child";

	test("rendering-wrapper", () => {
		const { container } = render(
			<FilterSelectorTemplate
				className={testClass}
				id={testId}
				style={testStyle}
				primaryContent={<div className="sample-primary-content" />}
				secondaryContent={<div className="sample-secondary-content" />}
				footerContent={<div className="sample-footer-content" />}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("wrapper-events", () => {
		const onClick = vi.fn();
		const onKeyDown = vi.fn();
		const onMouseLeave = vi.fn();
		const wrapperRef = vi.fn();

		const { container } = render(
			<FilterSelectorTemplate
				onClick={onClick}
				onKeyDown={onKeyDown}
				onMouseLeave={onMouseLeave}
				wrapperRef={wrapperRef}
			/>
		);

		fireEvent.click(container.firstChild as Element);
		expect(onClick).toHaveBeenCalledTimes(1);

		fireEvent.keyDown(container.firstChild as Element);
		expect(onKeyDown).toHaveBeenCalledTimes(1);

		fireEvent.mouseLeave(container.firstChild as Element);
		expect(onMouseLeave).toHaveBeenCalledTimes(1);

		expect(wrapperRef).toHaveBeenCalledTimes(1);
	});

	test("filter-content", () => {
		const { container } = render(<FilterSelectorTemplate primaryHeaderAriaLabelledby="primaryHeaderAriaLabelledby" />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-selector-list", () => {
		const deviceDetectorStub = vi.spyOn(provider, "get").mockReturnValue("desktop");

		const { container } = render(<FilterSelectorTemplate.List className={testClass} id={testId} style={testStyle} />);
		expect(container.firstChild).toMatchSnapshot();
		deviceDetectorStub.mockRestore();
	});

	test("rendering-filter-selector-item", () => {
		const { container } = render(<FilterSelectorTemplate.Item>content</FilterSelectorTemplate.Item>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-selector-section", () => {
		const { container } = render(
			<FilterSelectorTemplate.Section className={testClass} id={testId} style={testStyle}>
				testSection
			</FilterSelectorTemplate.Section>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-action-item", () => {
		const { container } = render(<FilterSelectorTemplate.ActionElement />);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-content", () => {
		const props: FilterSelectorTemplateProps.ContentProps = {
			onBlur: () => undefined,
			onFocus: () => undefined,
			headingElements: "headingElements",
			headingPrefixes: "headingPrefixes",
			subActionBar: "subActionBar",
			id: testId,
			style: testStyle
		};
		const { container } = render(
			<FilterSelectorTemplate.Content {...props} className={testClass}>
				{sampleChild}
			</FilterSelectorTemplate.Content>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-content-with-header", () => {
		const sampleHeader = "sample header";

		const { container } = render(<FilterSelectorTemplate.Content headingElements={sampleHeader} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-action-bar", () => {
		const { container } = render(
			<FilterSelectorTemplate.ActionBar className={testClass} id={testId} style={testStyle}>
				{sampleChild}
			</FilterSelectorTemplate.ActionBar>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-filter-selector-searchInput", () => {
		const clearButton = <Button icon={<Icon>clear</Icon>} />;
		const searchIcon = <Icon iconTheme="outlined">search</Icon>;
		const onChangeSpy = vi.fn();

		const { container } = render(
			<FilterSelectorTemplate.SearchInput
				className={testClass}
				id={testId}
				style={testStyle}
				placeholder="placeholder"
				value="value"
				onChange={onChangeSpy}
				clearButton={clearButton}
				searchButton={searchIcon}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
});
