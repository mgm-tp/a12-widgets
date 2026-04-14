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
import { styled, css } from "styled-components";

import { Icon, InteractiveTile, StyledInteractiveTile } from "@com.mgmtp.a12.widgets/widgets-core";

const ShowcaseStyledInteractiveTileWrapper = styled.div(({ theme }) => {
	const { spacing } = theme;

	return css`
		display: flex;
		flex-wrap: wrap;
		gap: ${spacing.verticalSpacing.vertWhiteSpacingsm}px;
		justify-content: center;
		margin-bottom: ${spacing.verticalSpacing.vertWhiteSpacingsm}px;

		> ${StyledInteractiveTile} {
			width: 200px;
			height: 120px;
		}
	`;
});

const ShowcaseStyledTileContent = styled.div(({ theme }) => {
	const { spacing } = theme;

	return css`
		align-content: flex-end;
		width: 100%;
		padding: ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0;
		height: 100%;
	`;
});

const ShowcaseTileContent = ({ subLabel }: { subLabel: string }): ReactElement => (
	<ShowcaseStyledTileContent>
		<Icon size="big">accessibility_new</Icon>
		<div className="-u-font-bold">Interactive Tile</div>
		<div>{subLabel}</div>
	</ShowcaseStyledTileContent>
);

export function InteractiveTileExample(): ReactElement {
	return (
		<div className="-u-flex -u-flex-col">
			<ShowcaseStyledInteractiveTileWrapper>
				<InteractiveTile primary>
					<ShowcaseTileContent subLabel="Primary" />
				</InteractiveTile>

				<InteractiveTile primary active>
					<ShowcaseTileContent subLabel="Primary Active" />
				</InteractiveTile>

				<InteractiveTile primary selected>
					<ShowcaseTileContent subLabel="Primary Selected" />
				</InteractiveTile>

				<InteractiveTile primary disabled>
					<ShowcaseTileContent subLabel="Primary Disabled" />
				</InteractiveTile>
			</ShowcaseStyledInteractiveTileWrapper>

			<ShowcaseStyledInteractiveTileWrapper>
				<InteractiveTile secondary>
					<ShowcaseTileContent subLabel="Secondary" />
				</InteractiveTile>

				<InteractiveTile secondary active>
					<ShowcaseTileContent subLabel="Secondary Active" />
				</InteractiveTile>

				<InteractiveTile secondary selected>
					<ShowcaseTileContent subLabel="Secondary Selected" />
				</InteractiveTile>

				<InteractiveTile secondary disabled>
					<ShowcaseTileContent subLabel="Secondary Disabled" />
				</InteractiveTile>
			</ShowcaseStyledInteractiveTileWrapper>
		</div>
	);
}
