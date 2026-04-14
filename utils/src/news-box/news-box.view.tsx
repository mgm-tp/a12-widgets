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

import { LayoutGrid, CssEllipsis, ResponsiveImageContainer } from "@com.mgmtp.a12.widgets/widgets-core";

import type { NewsBoxProps } from "./news-box.api.js";

const { Column, Row } = LayoutGrid;
export const StyledNewsBoxSection = styled(Column)(({ theme }) => {
	const { typography, applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		font-size: ${typography.fontSize.hugeFontSize};
		margin: 0;
		a {
			align-items: center;
			display: flex;
			font-size: ${typography.fontSize.mediumFontSize};
		}
		img {
			height: 16rem;
		}
		@media only screen and (max-width: ${responsive.tabletMinWidth}) {
			img {
				height: 12rem;
			}
		}
	`;
});

export const StyledNewsBoxWrapper = styled(Row)(({ theme }) => {
	const { spacing, applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		margin: ${spacing.verticalSpacing.vertWhiteSpacinglg}px 0;
		flex-wrap: wrap;
		@media only screen and (min-width: ${responsive.tabletMinWidth}) {
			min-height: ${spacing.spacing.spacing2Xl * 3}px;
		}
	`;
});

export function NewsBox(props: NewsBoxProps): ReactElement<NewsBoxProps> {
	const { header, footer, content, image, info, maxLines = 4 } = props;

	return (
		<StyledNewsBoxWrapper>
			<StyledNewsBoxSection
				className="-u-flex -u-text-center -u-justify-center -u-items-center -u-self-stretch -u-background-grey-light"
				size={{ sm: 4, md: 4, lg: 4 }}
			>
				{image || <ResponsiveImageContainer src="images/news-sample.jpg" />}
			</StyledNewsBoxSection>
			<StyledNewsBoxSection className="-u-self-stretch" size={{ sm: 8, md: 8, lg: 8 }}>
				<Column size={{ sm: 12, md: 12, lg: 12 }} className="-u-text-sm -u-margin-t-sm -u-text-grey-dark">
					{info}
				</Column>
				<Column size={{ sm: 12, md: 12, lg: 12 }} className="-u-margin-y-sm -u-text-3xl -u-font-semibold">
					{header}
				</Column>
				<CssEllipsis className="-u-text-sm -u-margin-b-sm" maxLine={maxLines}>
					{content}
				</CssEllipsis>
				{footer}
			</StyledNewsBoxSection>
		</StyledNewsBoxWrapper>
	);
}
