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

import { Button } from "../../button/main/button.view.js";
import { StyledButton } from "../../button/main/button.styled.js";
import { active, brightFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { StyledBaseInput } from "../../input/base-input-styled/base.styled.js";
import { StyledSelectTemplate } from "../../input/select/main/select.styled.js";

export const StyledPaginationWrapper = styled.div.withConfig({ displayName: "StyledPaginationWrapper-sc-" })<{
	$simple?: boolean;
	$disabled?: boolean;
	$alignment?: "left" | "right";
}>(({ theme, $simple, $disabled, $alignment }) => {
	const { pagination } = theme.components;

	return css`
		align-items: center;
		cursor: default;
		${$alignment === "left" &&
		css`
			float: left;
			margin-right: auto;
			order: 1;
		`}
		${$alignment === "right" &&
		css`
			float: right;
			margin-left: auto;
			order: 1;
		`}
		${!$simple &&
		css`
			display: flex;
			font-size: 0; // Remove unwanted white-space for the inline-block child components of pagination

			${StyledButton} {
				font-size: ${pagination.buttonIconFontSize};
			}

			${StyledBaseInput.StyledField} {
				display: block;
				margin: 0 3px 0 5px;
				position: relative;
				width: ${pagination.select.width};
				${StyledSelectTemplate.StyledFieldSelectControl} {
					height: auto;
					${StyledSelectTemplate.StyledFieldSelectWrapper} {
						box-shadow: none;
						outline-offset: unset;
					}
					${StyledSelectTemplate.StyledSelectArrow}:after {
						color: ${$disabled ? pagination.select.arrow.disabledColor : pagination.select.arrow.color};
						content: "\\e5c5";
						font-size: ${pagination.select.arrow.fontSize};
						width: ${pagination.select.arrow.iconWidth};
					}
					${StyledSelectTemplate.StyledSelectInput} {
						background-color: ${pagination.select.background};
						border: ${pagination.select.title.border.width} solid transparent;
						border-radius: ${pagination.select.title.border.radius};
						box-shadow: none;
						height: ${pagination.select.title.height};
						padding: 0 ${pagination.select.arrow.iconWidth} 0 6px;

						// Support for color customized setting of browser.
						@media (forced-colors: active) {
							background-color: transparent;
						}

						&:not(:disabled) {
							${active(css`
								border: ${pagination.select.title.activeBorder};
							`)}
							${hover(css`
								border: ${pagination.select.title.hoverBorder};
							`)}
							&:focus {
								border: ${pagination.select.title.focusBorder};
							}
						}
					}
				}
			}
		`}
		
		${$simple &&
		css`
			background-color: transparent;
			border: ${pagination.simple.border};
			border-radius: ${pagination.simple.borderRadius};
			color: ${pagination.simple.color};
			display: inline-flex;
		`}
	`;
});

export const StyledSimplePaginationLabel = styled.div.withConfig({ displayName: "StyledSimplePaginationLabel-sc-" })(
	({ theme }) => {
		const { label } = theme.components.pagination.simple;

		return css`
			align-self: center;
			font-family: ${label.fontFamily};
			font-size: ${label.fontSize};
			margin: ${label.margin};
			min-width: ${label.minWidth};
			text-align: center;
		`;
	}
);

export const StyledSimplePaginationAction = styled(Button).withConfig({
	displayName: "StyledSimplePaginationAction-sc-"
})<{
	$disabled?: boolean;
}>(({ $disabled, theme }) => {
	const { button, borderRadius } = theme.components.pagination.simple;

	return css`
		color: ${button.color};
		border-radius: 0;
		font-size: ${button.iconFontSize};
		padding: ${button.padding};

		${!$disabled &&
		css`
			&& {
				${active(css`
					background-color: ${button.active.background};
					border: ${button.active.border};
					color: ${button.color};
				`)}
				${hover(css`
					background-color: ${button.hover.background};
					border: ${button.hover.border};
					color: ${button.color};
				`)} 
				&:focus {
					${brightFocus};
					background-color: ${button.focus.background};
					border: ${button.focus.border};
					color: ${button.focus.color};
				}
			}
		`}

		${$disabled &&
		css`
			color: ${button.disabledColor};
			opacity: 0.3;
		`}
		
		&:first-child {
			border-top-left-radius: ${borderRadius};
			border-bottom-left-radius: ${borderRadius};
			margin: -1px 0 -1px -1px;
		}

		&:last-child {
			border-top-right-radius: ${borderRadius};
			border-bottom-right-radius: ${borderRadius};
			margin: -1px -1px -1px 0;
		}
	`;
});
