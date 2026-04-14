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

import type { ReactNode } from "react";
import { useState, useCallback } from "react";
import { styled, css } from "styled-components";

import type {
	SupportingPanesLayoutProps as SPLProps,
	SupportingPanesLayoutProps
} from "../../src/layout/supporting-panes-layout/main/supporting-panes-layout.api.js";
import { SupportingPanesLayoutComponents } from "../../src/layout/supporting-panes-layout/main/supporting-panes-layout.view.js";
import { Typography } from "../../src/typography/main/typography.view.js";
import { Button } from "../../src/button/main/button.view.js";
import { ButtonGroup } from "../../src/button-group/main/button-group.view.js";

const { SupportingPanesLayout, SecondaryPane, PrimaryPane } = SupportingPanesLayoutComponents;

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
	position: SupportingPanesLayoutProps.SecondaryPanePosition;
	isHiddenPane?: boolean;
	heading?: ReactNode;
	content?: ReactNode;
	widthConfig?: SupportingPanesLayoutProps.SecondaryPaneProps["widthConfig"];
	collapsed?: boolean;
	resizedOptions?: SupportingPanesLayoutProps.SecondaryPaneProps["resizeOptions"];
	onVisibility?: (position: SupportingPanesLayoutProps.SecondaryPanePosition) => void;
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
			<div style={{ padding: "20px" }}>
				The Supporting Pane is a side panel that can be positioned either in front or behind the Primary Pane. It can
				contain anything that supports the interaction with the Primary Pane.
			</div>
			<Button destructive label="Hide Pane" onClick={() => onVisibility?.(position)} />
		</SecondaryPane>
	);
};

export const SupportingPanesLayoutExample = ({
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
				<Typography.Headline level={3} ariaLevel={3}>
					Primary Pane
				</Typography.Headline>
				The Primary Pane is where users can focus on and interact with the most important information. Regardless of
				whether the pane is standalone or with one or two supporting panes, it will take up the remaining free space.
				{(hidePane?.left || hidePane?.right) && (
					<>
						<p>Click the button below to reveal the supporting pane again:</p>
						<ButtonGroup vertical>
							{hidePane.left && <Button secondary label="Show Left Pane" onClick={() => handleVisibility("left")} />}
							{hidePane.right && <Button secondary label="Show Right Pane" onClick={() => handleVisibility("right")} />}
						</ButtonGroup>
					</>
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
