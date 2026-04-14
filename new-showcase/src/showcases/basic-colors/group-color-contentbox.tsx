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

import { styled, css } from "styled-components";
import { rgba } from "polished";

import { Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const ColorBox = styled.div(({ theme }) => {
	const { colors, typography } = theme;

	return css`
		align-items: center;
		box-shadow: 0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)};
		color: ${colors.text.invertedColor};
		display: flex;
		justify-content: space-between;
		cursor: default;
		font-size: ${typography.fontSize.smallFontSize};
		font-weight: ${typography.fontWeight.semiBoldFontWeight};
		height: 40px;
		padding: 10px;
		margin-bottom: 20px;
		position: relative;
		width: 100%;
	`;
});

const ColorDescription = styled.p`
	margin-bottom: 4px;
`;

export function GroupColorContentBox(props: { groupColor?: Color[] }) {
	return (
		<div className="-u-width-full">
			{props.groupColor &&
				props.groupColor.map((color, index) => {
					return [
						color.title && (
							<Typography.Headline ariaLevel={5} level={5} key={`${index}-1`}>
								{color.title}
							</Typography.Headline>
						),
						color.description && <ColorDescription key={`${index}-2`}>{color.description}</ColorDescription>,
						<ColorBox
							key={`${index}-3`}
							style={{
								background: color.colorCode,
								color: color.textColor
							}}
						>
							<span>{color.textName}</span>
							<span>{color.colorCode}</span>
						</ColorBox>
					];
				})}
		</div>
	);
}

export interface Color {
	description?: string;
	textColor?: string;
	textName: string;
	colorCode?: string;
	title?: string;
}
