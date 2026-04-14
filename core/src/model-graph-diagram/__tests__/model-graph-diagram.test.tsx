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

import { render } from "test-utils";
import { describe, test, expect } from "vitest";

import { GridMainPoint, GridSubPoint } from "../main/grid-points.view.js";
import { DiagramLabel } from "../main/label.view.js";
import { DiagramNode } from "../main/node.view.js";
import { DiagramPort } from "../main/port.view.js";

describe("com.mgmtp.a12.widgets.model-graph-diagram", () => {
	test("render Node", () => {
		const { container } = render(<DiagramNode>Node</DiagramNode>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render selected Node", () => {
		const { container } = render(<DiagramNode selected>Node</DiagramNode>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render selected Link Node", () => {
		const { container } = render(<DiagramNode useAsLink>Link Node</DiagramNode>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render selected Link Node", () => {
		const { container } = render(
			<DiagramNode selected useAsLink>
				Link Node
			</DiagramNode>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly Node", () => {
		const { container } = render(<DiagramNode readOnly>Readonly Node</DiagramNode>);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly Link Node", () => {
		const { container } = render(
			<DiagramNode useAsLink readOnly>
				Readonly Link Node
			</DiagramNode>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default Label", () => {
		const { container } = render(<DiagramLabel text="Relationship name" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly Label", () => {
		const { container } = render(<DiagramLabel text="Readonly Label" readOnly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render sub Label", () => {
		const { container } = render(<DiagramLabel type="sub" text="role name" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render Label with additional information", () => {
		const { container } = render(<DiagramLabel type="sub" text="1" subText="{ duplicable, orderable }" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render selected Label", () => {
		const { container } = render(<DiagramLabel text="Selected Label" selected />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default Port", () => {
		const { container } = render(<DiagramPort />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render selected Port", () => {
		const { container } = render(<DiagramPort selected />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly Port", () => {
		const { container } = render(<DiagramPort readOnly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render Port as corner point", () => {
		const { container } = render(<DiagramPort cornerPoint />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render Main Grid Point", () => {
		const { container } = render(<GridMainPoint />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render Sub Grid Point", () => {
		const { container } = render(<GridSubPoint />);
		expect(container.firstChild).toMatchSnapshot();
	});
});
