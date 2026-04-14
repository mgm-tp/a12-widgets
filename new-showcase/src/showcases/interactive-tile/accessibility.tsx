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

export function Accessibility(): ReactElement {
	return (
		<div className="-u-flex -u-flex-col">
			<ShowcaseStyledInteractiveTileWrapper>
				<InteractiveTile
					primary
					selected
					htmlAttributes={{ role: "link", "aria-label": "Primary Selected, interactive selected" }}
					title="Interactive Tile"
				>
					<ShowcaseStyledTileContent>
						<Icon size="big">accessibility_new</Icon>
						<div className="-u-flex -u-flex-col">
							<span className="-u-font-bold">Interactive Tile</span>
							<span role="presentation">Primary Selected</span>
						</div>
					</ShowcaseStyledTileContent>
				</InteractiveTile>
			</ShowcaseStyledInteractiveTileWrapper>
		</div>
	);
}
