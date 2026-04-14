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

import type { ReactElement } from "react";
import { findAllByDataRole, getByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";

import type { Container } from "../../../common/main/base-props.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { SupportingPanesLayoutComponents } from "../main/supporting-panes-layout.view.js";
import type { SupportingPanesLayoutProps as SPLProps } from "../main/supporting-panes-layout.api.js";

const { PrimaryPane, SecondaryPane, SupportingPanesLayout } = SupportingPanesLayoutComponents;

const widthConfig: SPLProps.SecondaryPaneProps["widthConfig"] = {
	collapsed: "100px"
};

function TestWrapper(props: Container): ReactElement {
	return <div style={{ height: 500, width: 700 }}>{props.children}</div>;
}

describe("com.mgmtp.a12.widgets.layout.supporting-panes-layout", () => {
	test("Secondary Pane should be collapsed initially", () => {
		const { container } = render(
			<TestWrapper>
				<SupportingPanesLayout>
					<SecondaryPane position="left" widthConfig={widthConfig} collapsed>
						Secondary Pane
					</SecondaryPane>
					<PrimaryPane>Primary Pane</PrimaryPane>
				</SupportingPanesLayout>
			</TestWrapper>
		);

		const secondaryPane = getByDataRole(container, DataRoles.SupportingPanesLayout.SecondaryPane);
		expect(secondaryPane).toHaveStyle({ width: `${widthConfig.collapsed}` });
	});

	test("Secondary Pane should be expanded and take the given width initially", () => {
		const { container } = render(
			<TestWrapper>
				<SupportingPanesLayout>
					<SecondaryPane position="left" widthConfig={{ expanded: 150 }}>
						Secondary Pane
					</SecondaryPane>
					<PrimaryPane>Primary Pane</PrimaryPane>
				</SupportingPanesLayout>
			</TestWrapper>
		);

		const secondaryPane = getByDataRole(container, DataRoles.SupportingPanesLayout.SecondaryPane);
		expect(secondaryPane).toHaveStyle({ width: "150px" });
	});

	test("Secondary Pane should be hidden if set prop `hide` to `true`", async () => {
		const { container } = render(
			<TestWrapper>
				<SupportingPanesLayout>
					<SecondaryPane position="left" hide>
						Left Pane
					</SecondaryPane>
					<PrimaryPane>Primary Pane</PrimaryPane>
					<SecondaryPane position="right">Right Pane</SecondaryPane>
				</SupportingPanesLayout>
			</TestWrapper>
		);

		const secondaryPanes = await findAllByDataRole(container, DataRoles.SupportingPanesLayout.SecondaryPane);
		expect(secondaryPanes).toHaveLength(1);
		expect(secondaryPanes[0].getAttribute("data-positioning")).toBe("right");
	});

	test("Panes with additional attributes from `htmlAttributes` property", () => {
		const { container } = render(
			<TestWrapper>
				<SupportingPanesLayout htmlAttributes={{ role: "main" }}>
					<PrimaryPane htmlAttributes={{ role: "application" }}>Primary Pane</PrimaryPane>
					<SecondaryPane position="right" htmlAttributes={{ role: "menubar" }}>
						Secondary Pane
					</SecondaryPane>
				</SupportingPanesLayout>
			</TestWrapper>
		);

		const containerElement = getByDataRole(container, DataRoles.SupportingPanesLayout);
		expect(containerElement.getAttribute("role")).toBe("main");

		const primaryPane = getByDataRole(container, DataRoles.SupportingPanesLayout.PrimaryPane);
		expect(primaryPane.getAttribute("role")).toBe("application");

		const secondaryPane = getByDataRole(container, DataRoles.SupportingPanesLayout.SecondaryPane);
		expect(secondaryPane.getAttribute("role")).toBe("menubar");
	});
});
