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

import type { FC } from "react";
import { useState, useCallback } from "react";
import { styled, css } from "styled-components";

import type { SupportingPanesLayoutProps as SPLProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	SupportingPanesLayoutComponents,
	Button,
	ButtonGroup,
	Typography,
	TextOutput,
	Link
} from "@com.mgmtp.a12.widgets/widgets-core";

import { SecondaryPaneShowcase } from "./secondary-pane.js";

const { SupportingPanesLayout, PrimaryPane } = SupportingPanesLayoutComponents;

const StyledWrapperSC = styled.div(() => {
	return css`
		height: 500px;
		width: 100%;
	`;
});

const StyledPrimaryPaneSC = styled(PrimaryPane)(({ theme }) => {
	const { spacing } = theme.spacing;
	const { variant } = theme.colors;

	return css`
		border: 2px solid ${variant.infoColor};
		padding: ${spacing.spacingSm}px;
	`;
});

export const Basic: FC = () => {
	const [hidePane, setHidePane] = useState<{ left?: boolean; right?: boolean }>();

	const handleVisibility = useCallback((position: SPLProps.SecondaryPanePosition) => {
		setHidePane((prevState) => ({ ...prevState, [position]: !prevState?.[position] }));
	}, []);

	const primaryContentRenderer = useCallback(
		() => (
			<>
				<div>
					<Typography.Headline level={3} ariaLevel={3}>
						Primary Pane
					</Typography.Headline>
					<div className="-u-margin-t-md -u-margin-b-md" style={{ minWidth: 200 }}>
						<TextOutput disableParagraphWrapping>
							<p>
								The Primary Pane is where users can focus on and interact with the most important information.
								Regardless of whether the pane is standalone or with one or two supporting panes, it will take up the
								remaining free space.
							</p>
							<p>
								You can display the amounts of data by putting a <Link href="#/widgets/data-display/table">Table</Link>,
								or <Link href="#/widgets/data-display/tree-table">Tree Table</Link> here. Click a Table Row will
								probably open a detail form in the Supporting Pane.
							</p>

							{(hidePane?.left || hidePane?.right) && (
								<>
									<p>Click the button below to reveal the supporting pane again:</p>
									<ButtonGroup vertical>
										{hidePane.left && (
											<Button secondary label="Show Left Pane" onClick={() => handleVisibility("left")} />
										)}
										{hidePane.right && (
											<Button secondary label="Show Right Pane" onClick={() => handleVisibility("right")} />
										)}
									</ButtonGroup>
								</>
							)}
						</TextOutput>
					</div>
				</div>
			</>
		),
		[hidePane, handleVisibility]
	);

	return (
		<StyledWrapperSC>
			<SupportingPanesLayout>
				<SecondaryPaneShowcase position="left" isHiddenPane={hidePane?.left} onVisibility={handleVisibility} />
				<StyledPrimaryPaneSC>{primaryContentRenderer()}</StyledPrimaryPaneSC>
				<SecondaryPaneShowcase position="right" isHiddenPane={hidePane?.right} onVisibility={handleVisibility} />
			</SupportingPanesLayout>
		</StyledWrapperSC>
	);
};
