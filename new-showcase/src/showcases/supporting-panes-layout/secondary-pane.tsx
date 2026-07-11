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
import { memo, useState, useCallback } from "react";
import { styled, css } from "styled-components";

import type { SupportingPanesLayoutProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	SupportingPanesLayoutComponents,
	Button,
	Icon,
	Typography,
	TextOutput,
	Link
} from "@com.mgmtp.a12.widgets/widgets-core";

import SecondaryPane = SupportingPanesLayoutComponents.SecondaryPane;

interface SecondaryPaneShowcaseProps {
	position: SupportingPanesLayoutProps.SecondaryPanePosition;
	isHiddenPane?: boolean;
	heading?: ReactNode;
	content?: ReactNode;
	widthConfig?: SupportingPanesLayoutProps.SecondaryPaneProps["widthConfig"];
	resizedOptions?: SupportingPanesLayoutProps.SecondaryPaneProps["resizeOptions"];
	onVisibility?: (position: SupportingPanesLayoutProps.SecondaryPanePosition) => void;
}

const ShowcaseStyledSecondaryPane = styled(SecondaryPane)(({ theme }) => {
	const { variant } = theme.colors;

	return css`
		border: 2px solid ${variant.warningColorDark};
	`;
});

const ShowcaseStyledSecondaryPaneContent = styled.div(({ theme }) => {
	const { spacing } = theme.spacing;

	return css`
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: ${spacing.spacingSm}px;
		justify-content: space-between;
	`;
});

// Using `React.memo` to:
// - Improve performance and resolve potential animation issues.
// - Ensure that the pane only re-renders when its props change, reducing unnecessary renders of other panes — especially in complex layouts.
export const SecondaryPaneShowcase = memo(
	({
		position,
		isHiddenPane,
		heading,
		content,
		widthConfig = { collapsed: 100 },
		resizedOptions = { minWidth: 150, maxWidth: "50%" },
		onVisibility
	}: SecondaryPaneShowcaseProps): ReactNode => {
		const [isCollapsed, setIsCollapsed] = useState<boolean | undefined>();
		const isLeftPos = position === "left";
		const collapsedIcon = isLeftPos ? "chevron_right" : "chevron_left";
		const expandedIcon = isLeftPos ? "chevron_left" : "chevron_right";

		const handleCollapse = (): void => {
			setIsCollapsed((prevState) => !prevState);
		};

		const handleResizeStop = useCallback(
			(
				_: MouseEvent,
				payload: {
					resizedElement: HTMLElement | null;
					siblingElement: HTMLElement | null;
					resizedElementWidth: number | string;
					siblingElementWidth: number | string;
					isAtCollapsedWidth: boolean;
				}
			) => {
				setIsCollapsed(payload.isAtCollapsedWidth);
			},
			[]
		);

		return (
			<ShowcaseStyledSecondaryPane
				position={position}
				widthConfig={widthConfig}
				resizeOptions={{ ...resizedOptions, onResizeStop: handleResizeStop }}
				collapsed={isCollapsed}
				onToggleCollapsed={handleCollapse}
				hide={isHiddenPane}
			>
				<ShowcaseStyledSecondaryPaneContent>
					<div>
						<Typography.Headline level={3} ariaLevel={3}>
							{heading ?? "Secondary Pane"}
						</Typography.Headline>
						{content ?? (
							<div className="-u-margin-t-md -u-margin-b-md">
								<TextOutput disableParagraphWrapping>
									<p>
										The Supporting Pane is a side panel that can be positioned either in front or behind the Primary
										Pane. It can contain anything that supports the interaction with the Primary Pane.
									</p>
									<p>
										It could be a <Link href="#/widgets/layout/content-box">Content Box</Link> with a{" "}
										<Link href="#/widgets/navigation/menu/flyout-menu#vertical-menu">Menu</Link> or a{" "}
										<strong>Form</strong> here.
									</p>
									<p>The pane will disappear if click the button below:</p>
									<Button destructive label="Hide Pane" onClick={() => onVisibility?.(position)} />
								</TextOutput>
							</div>
						)}
					</div>
					<div className={isLeftPos ? "-u-flex -u-flex-row-reverse" : undefined}>
						<Button
							icon={<Icon>{isCollapsed ? collapsedIcon : expandedIcon}</Icon>}
							title={isCollapsed ? "Expand" : "Collapse"}
							onClick={handleCollapse}
						/>
					</div>
				</ShowcaseStyledSecondaryPaneContent>
			</ShowcaseStyledSecondaryPane>
		);
	}
);
