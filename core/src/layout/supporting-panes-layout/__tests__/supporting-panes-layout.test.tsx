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
import { useState, useCallback } from "react";
import { styled, css } from "styled-components";
import { findAllByDataRole, getByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { waitFor } from "@testing-library/dom";

import type { Container } from "../../../common/main/base-props.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { Button } from "../../../button/main/button.view.js";
import { ButtonGroup } from "../../../button-group/main/button-group.view.js";
import { Typography } from "../../../typography/main/typography.view.js";

import { SupportingPanesLayoutComponents } from "../main/supporting-panes-layout.view.js";
import type { SupportingPanesLayoutProps as SPLProps } from "../main/supporting-panes-layout.api.js";

const { PrimaryPane, SecondaryPane, SupportingPanesLayout } = SupportingPanesLayoutComponents;

const StyledWrapperSC = styled.div<{ $width: number }>(({ $width }) => {
	return css`
		height: 500px;
		width: ${$width}px;
	`;
});

interface SupportingPanesLayoutExampleProps {
	resizeOptions?: SPLProps.SecondaryPaneProps["resizeOptions"];
	widthConfig?: SPLProps.SecondaryPaneProps["widthConfig"];
	collapsed?: boolean;
	hide?: boolean;
	wrapperWidth?: number;
}

interface SecondaryPaneShowcaseProps {
	position: SPLProps.SecondaryPanePosition;
	isHiddenPane?: boolean;
	widthConfig?: SPLProps.SecondaryPaneProps["widthConfig"];
	collapsed?: boolean;
	resizedOptions?: SPLProps.SecondaryPaneProps["resizeOptions"];
	onVisibility?: (position: SPLProps.SecondaryPanePosition) => void;
}

const SecondaryPaneExample = ({
	position,
	isHiddenPane,
	widthConfig = { collapsed: 100 },
	resizedOptions = { minWidth: 150, maxWidth: "50%" },
	collapsed,
	onVisibility
}: SecondaryPaneShowcaseProps): ReactNode => {
	const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>(collapsed);

	const handleCollapse = (): void => {
		setIsCollapsed((prevState) => !prevState);
	};

	const handleResizeStop = useCallback(
		(
			_: MouseEvent,
			payload: {
				resizedElement: HTMLElement | null;
				siblingElement: HTMLElement | null;
				resizedElementWidth: number;
				siblingElementWidth: number;
			}
		) => {
			setIsCollapsed(payload.resizedElementWidth === widthConfig?.collapsed);
		},
		[widthConfig?.collapsed]
	);

	return (
		<SecondaryPane
			position={position}
			widthConfig={widthConfig}
			resizeOptions={{ ...resizedOptions, onResizeStop: handleResizeStop }}
			collapsed={isCollapsed}
			onToggleCollapsed={handleCollapse}
			hide={isHiddenPane}
		>
			<Typography.Headline level={3} ariaLevel={3}>
				Secondary Pane
			</Typography.Headline>
			<Button destructive label="Hide Pane" onClick={() => onVisibility?.(position)} />
		</SecondaryPane>
	);
};

const SupportingPanesLayoutExample = ({
	resizeOptions = { minWidth: 150, maxWidth: "50%" },
	widthConfig = { collapsed: 100 },
	collapsed,
	wrapperWidth = 1000,
	hide = false
}: SupportingPanesLayoutExampleProps): ReactNode => {
	const [hidePane, setHidePane] = useState<{ left?: boolean; right?: boolean }>({ left: hide });

	const handleVisibility = useCallback((position: SPLProps.SecondaryPanePosition) => {
		setHidePane((prevState) => ({ ...prevState, [position]: !prevState?.[position] }));
	}, []);

	const primaryContentRenderer = useCallback(
		() => (
			<div style={{ padding: "20px" }}>
				{(hidePane?.left || hidePane?.right) && (
					<ButtonGroup vertical>
						{hidePane.left && <Button secondary label="Show Left Pane" onClick={() => handleVisibility("left")} />}
						{hidePane.right && <Button secondary label="Show Right Pane" onClick={() => handleVisibility("right")} />}
					</ButtonGroup>
				)}
			</div>
		),
		[handleVisibility, hidePane.left, hidePane.right]
	);

	return (
		<StyledWrapperSC $width={wrapperWidth}>
			<SupportingPanesLayout>
				<SecondaryPaneExample
					position="left"
					isHiddenPane={hidePane?.left}
					onVisibility={handleVisibility}
					widthConfig={widthConfig}
					resizedOptions={resizeOptions}
					collapsed={collapsed}
				/>
				<PrimaryPane>{primaryContentRenderer()}</PrimaryPane>
				<SecondaryPaneExample
					position="right"
					isHiddenPane={hidePane?.right}
					onVisibility={handleVisibility}
					widthConfig={widthConfig}
					resizedOptions={resizeOptions}
					collapsed={collapsed}
				/>
			</SupportingPanesLayout>
		</StyledWrapperSC>
	);
};

const widthConfig: SPLProps.SecondaryPaneProps["widthConfig"] = {
	collapsed: "100px"
};

function TestWrapper(props: Container): ReactElement {
	return <div style={{ height: 500, width: 700 }}>{props.children}</div>;
}

describe("com.mgmtp.a12.widgets.layout.supporting-panes-layout", () => {
	test("Secondary Pane should be collapsed initially", async () => {
		const { findByDataRole } = render(
			<TestWrapper>
				<SupportingPanesLayout>
					<SecondaryPane position="left" widthConfig={widthConfig} collapsed>
						Secondary Pane
					</SecondaryPane>
					<PrimaryPane>Primary Pane</PrimaryPane>
				</SupportingPanesLayout>
			</TestWrapper>
		);

		const secondaryPane = await findByDataRole(DataRoles.SupportingPanesLayout.SecondaryPane);
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

describe("com.mgmtp.a12.widgets.layout.supporting-panes-layout - interaction", () => {
	test("Render Secondary pane with default expand value", () => {
		const wrapperWidth = 1000;
		const { container } = render(<SupportingPanesLayoutExample wrapperWidth={wrapperWidth} />);
		const pane = container.querySelector('[data-positioning="left"]') as HTMLElement;
		const paneWidth = pane.getBoundingClientRect().width;
		const defaultPaneWidth = (wrapperWidth * 25) / 100;
		expect(paneWidth).toEqual(defaultPaneWidth);
	});

	test("Secondary should be collapsed and expanded when double-clicking to the resize handler", async () => {
		const collapsedWidth = 100;
		const expandedWidth = 200;
		const { container } = render(
			<SupportingPanesLayoutExample widthConfig={{ collapsed: collapsedWidth, expanded: expandedWidth }} />
		);
		const pane = container.querySelector('[data-positioning="left"]') as HTMLElement;
		const resizeHandler = getByDataRole(pane, DataRoles.SupportingPanesLayoutResizeHandler);

		expect(pane.getBoundingClientRect().width).toEqual(expandedWidth);

		await userEvent.dblClick(resizeHandler);

		await waitFor(
			() => {
				expect(pane.getBoundingClientRect().width).toEqual(collapsedWidth);
			},
			{ timeout: 2000 }
		);

		await userEvent.dblClick(resizeHandler);

		await waitFor(
			() => {
				expect(pane.getBoundingClientRect().width).toEqual(expandedWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Secondary should be expanded when the pane initial state is collapsed", async () => {
		const expandedWidth = 200;
		const collapsedWidth = 100;
		const { container } = render(
			<SupportingPanesLayoutExample widthConfig={{ expanded: expandedWidth, collapsed: collapsedWidth }} collapsed />
		);
		const pane = container.querySelector('[data-positioning="left"]') as HTMLElement;

		await waitFor(
			() => {
				expect(pane.getBoundingClientRect().width).toEqual(collapsedWidth);
			},
			{ timeout: 2000 }
		);

		const resizeHandler = getByDataRole(pane, DataRoles.SupportingPanesLayoutResizeHandler);
		await userEvent.dblClick(resizeHandler);

		await waitFor(
			() => {
				expect(pane.getBoundingClientRect().width).toEqual(expandedWidth);
			},
			{ timeout: 2000 }
		);
	});

	test("Hide and show pane with toggle buttons, collapse and expand via double-click", async () => {
		const expandedWidth = "20%";
		const collapsedWidth = 100;
		const wrapperWidth = 1000;

		const { container } = render(
			<SupportingPanesLayoutExample
				widthConfig={{ expanded: expandedWidth, collapsed: collapsedWidth }}
				hide={true}
				wrapperWidth={wrapperWidth}
			/>
		);

		// Pane is initially not in DOM (unmounted when hide=true)
		await waitFor(() => expect(container.querySelector('[data-positioning="left"]')).toBeNull(), { timeout: 2000 });

		// Show pane via button in primary pane
		const primaryPane = getByDataRole(container, DataRoles.SupportingPanesLayout.PrimaryPane);
		const showPaneButton = getByDataRole(primaryPane, DataRoles.Button) as HTMLElement;
		await userEvent.click(showPaneButton);

		const leftPane = await waitFor(
			() => {
				const el = container.querySelector('[data-positioning="left"]') as HTMLElement;
				expect(el).toBeTruthy();

				return el;
			},
			{ timeout: 2000 }
		);

		// Double-click resize handler to collapse (also serves as waiting for pane to be fully rendered)
		const resizeHandler = await waitFor(() => getByDataRole(leftPane, DataRoles.SupportingPanesLayoutResizeHandler), {
			timeout: 2000
		});
		await userEvent.dblClick(resizeHandler);

		await waitFor(() => expect(leftPane.getBoundingClientRect().width).toEqual(collapsedWidth), { timeout: 2000 });

		// Double-click resize handler to expand
		await userEvent.dblClick(resizeHandler);

		await waitFor(() => expect(leftPane.getBoundingClientRect().width).toEqual((wrapperWidth * 20) / 100), {
			timeout: 2000
		});

		// Hide pane via button in the pane itself
		const hidePaneButton = leftPane.querySelector(`[data-role=${DataRoles.Button}]`) as HTMLElement;
		await userEvent.click(hidePaneButton);

		await waitFor(() => expect(container.querySelector('[data-positioning="left"]')).toBeNull(), { timeout: 2000 });
	});
});
