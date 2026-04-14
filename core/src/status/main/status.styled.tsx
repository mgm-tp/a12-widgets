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

import { StyledIconWrapper } from "../../icon/main/icon.view.js";

import type { StatusVariant } from "./status.api.js";

export const StyledStatusIcon = styled.div.withConfig({ displayName: "StyledStatusIcon-sc-" })(({ theme }) => {
	const { status } = theme.components;

	return css`
		box-sizing: border-box;
		border-radius: ${status.borderRadius};
		&:not(:only-child) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		height: ${status.icon.height};
		${StyledIconWrapper} {
			line-height: ${status.icon.lineHeight};
		}
	`;
});

export const StyledStatusLabelWrapper = styled.div.withConfig({ displayName: "StyledStatusLabelWrapper-sc-" })<{
	$longText?: boolean;
}>(({ theme, $longText }) => {
	const { status } = theme.components;

	return css`
		border-radius: ${status.borderRadius};
		&:not(:only-child) {
			border-top-left-radius: 0;
			border-bottom-left-radius: ${!$longText && 0};
		}
	`;
});

export const StyledStatusLabel = styled.div.withConfig({ displayName: "StyledStatusLabel-sc-" })(({ theme }) => {
	const { status } = theme.components;

	return css`
		font-family: ${status.text.fontFamily};
		font-size: ${status.text.fontSize};
		font-weight: ${status.text.fontWeight};
	`;
});

export const StyledStatusContainer = styled.div.withConfig({ displayName: "StyledStatusContainer-sc-" })<{
	variant: StatusVariant;
}>(({ theme, variant }) => {
	const { status } = theme.components;

	return css`
		display: inline-flex;
		gap: ${status.gap};
		transform: skew(-${status.transformSkew});
		${StyledStatusIcon}, ${StyledStatusLabelWrapper} {
			background-color: ${status.variant.background[variant]};
			padding: ${status.padding};
			> * {
				transform: skew(${status.transformSkew});
			}
		}
		${StyledIconWrapper}, ${StyledStatusLabelWrapper} {
			color: ${status.variant.color[variant]};
			cursor: default;
		}
	`;
});
