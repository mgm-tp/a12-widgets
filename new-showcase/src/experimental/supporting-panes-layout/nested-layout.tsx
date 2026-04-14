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
import { styled, css } from "styled-components";

import { SupportingPanesLayoutComponents, Typography, TextOutput } from "@com.mgmtp.a12.widgets/widgets-core";

import { Text } from "../../helpers/text-generator.js";

import { SecondaryPaneShowcase } from "./secondary-pane.js";

import LONG_PARAGRAPH = Text.LONG_PARAGRAPH;

const { SupportingPanesLayout, PrimaryPane } = SupportingPanesLayoutComponents;

const StyledSCWrapper = styled.div(() => {
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

const StyledNestedPrimaryPaneSC = styled(PrimaryPane)(({ theme }) => {
	const { spacing } = theme.spacing;
	const { status } = theme.colors;

	return css`
		border: 2px solid ${status.status2Background};
		padding: ${spacing.spacingSm}px;
	`;
});

export const NestedLayout: FC = () => {
	return (
		<StyledSCWrapper>
			<SupportingPanesLayout>
				<SecondaryPaneShowcase
					position="left"
					content={
						<div className="-u-margin-t-md -u-margin-b-md">
							<TextOutput>{Text.PARAGRAPH}</TextOutput>
						</div>
					}
				/>
				<StyledPrimaryPaneSC>
					<SupportingPanesLayout>
						<SecondaryPaneShowcase
							heading="Nested Secondary Pane"
							position="left"
							widthConfig={{ collapsed: 80, expanded: 150 }}
							resizedOptions={{
								minWidth: 150,
								maxWidth: "70%"
							}}
							content={
								<div className="-u-margin-t-md -u-margin-b-md">
									<TextOutput>{Text.SENTENCE}</TextOutput>
								</div>
							}
						/>
						<StyledNestedPrimaryPaneSC>
							<div>
								<Typography.Headline level={3} ariaLevel={3}>
									Nested Primary Pane
								</Typography.Headline>
								<div className="-u-margin-t-md -u-margin-b-md">
									<TextOutput>{LONG_PARAGRAPH}</TextOutput>
								</div>
							</div>
						</StyledNestedPrimaryPaneSC>
					</SupportingPanesLayout>
				</StyledPrimaryPaneSC>
				<SecondaryPaneShowcase
					position="right"
					content={
						<div className="-u-margin-t-md -u-margin-b-md">
							<TextOutput>{Text.PARAGRAPH}</TextOutput>
						</div>
					}
				/>
			</SupportingPanesLayout>
		</StyledSCWrapper>
	);
};
