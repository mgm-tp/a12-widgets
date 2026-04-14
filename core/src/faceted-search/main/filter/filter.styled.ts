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

import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { active as activeFn, darkFocus, hover } from "../../../theme/base/mixins/_interaction.js";

export const StyledFilterWrapper = styled.div.withConfig({ displayName: "StyledFilterWrapper-sc-" })<{
	$active?: boolean;
	$disabled?: boolean;
}>(({ theme, $active, $disabled }) => {
	const { filter } = theme.components;

	return css`
		background-color: ${filter.background};
		border-radius: ${filter.borderRadius};
		display: inline-flex;
		height: ${filter.height};
		margin: ${filter.margin};
		max-width: ${filter.maxWidth};
		width: auto;

		${$active &&
		css`
			position: relative;
		`}

		${!$disabled &&
		css`
			cursor: pointer;
		`}
	`;
});

export const StyledFilterContentInner = styled.span.withConfig({ displayName: "StyledFilterContentInner-sc-" })(
	({ theme }) => {
		const { filter } = theme.components;

		return css`
			align-content: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			max-width: ${filter.content.maxWidth};
			min-width: ${filter.content.minWidth};
		`;
	}
);

export const StyledFilterOptions = styled.span.withConfig({ displayName: "StyledFilterOptions-sc-" })<{
	$active?: boolean;
	$disabled?: boolean;
}>(({ theme, $active, $disabled }) => {
	const { options } = theme.components.filter;

	return css`
		color: ${options.color};
		font-family: ${options.fontFamily};
		font-size: ${options.fontSize};
		font-style: ${options.fontStyle};
		line-height: ${options.lineHeight};
		margin-top: -2px;
		overflow: hidden;
		padding: ${options.padding};
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;

		${$active &&
		css`
			font-style: normal;
		`}

		${$disabled &&
		css`
			color: ${options.disabledColor};
		`}
	`;
});

export const StyledFilterContent = styled.button.withConfig({ displayName: "StyledFilterContent-sc-" })<{
	$active?: boolean;
	$disabled?: boolean;
}>(({ theme, $active, $disabled }) => {
	const { filter } = theme.components;

	return css`
		background-color: transparent;
		border: none;
		margin: 0;
		padding: ${filter.content.padding};
		position: relative;
		text-align: left;
		-webkit-tap-highlight-color: transparent;
		&& {
			overflow: hidden;
		}
		&:before {
			content: "";
			display: block;
			border-top-left-radius: ${filter.borderRadius};
			border-bottom-left-radius: ${filter.borderRadius};
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		&:only-child {
			&:before {
				border-radius: ${filter.borderRadius};
			}
		}

		&:not(:disabled) {
			cursor: pointer;
		}

		${!$disabled &&
		css`
			${activeFn(css`
				${StyledFilterNameText}, ${StyledFilterOptions} {
					color: ${filter.content.active.color};
				}
				${StyledFilterNameArrow} {
					border-bottom-color: ${filter.name.arrow.borderBottomColor.active};
				}
				&:before {
					border: ${filter.content.active.border};
				}
			`)}

			${hover(css`
				${StyledFilterNameText}, ${StyledFilterOptions} {
					color: ${filter.content.hover.color};
				}
				${StyledFilterNameArrow} {
					border-bottom-color: ${filter.name.arrow.borderBottomColor.hover};
				}
				&:before {
					border: ${filter.content.hover.border};
				}
			`)}

			&:focus {
				color: ${filter.content.focus.color};
				${darkFocus}
				${StyledFilterNameText}, ${StyledFilterOptions} {
					color: ${filter.content.focus.color};
				}

				${StyledFilterNameArrow} {
					border-bottom-color: ${filter.name.arrow.borderBottomColor.focus};
				}

				&:before {
					border: ${filter.content.focus.border};
				}
			}
		`}

		${$active &&
		css`
			&:after {
				content: "";
				display: block;
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				width: ${filter.indicator.active.width};
				background-color: ${filter.indicator.active.background};
				border-top-left-radius: ${filter.borderRadius};
				border-bottom-left-radius: ${filter.borderRadius};
			}

			${$disabled
				? css`
						&:after {
							background-color: ${filter.indicator.active.disabledBackground};
						}
					`
				: css`
						${activeFn(css`
							&:after {
								background-color: ${filter.indicator.active.activeBackground};
							}
						`)}

						${hover(css`
							&:after {
								background-color: ${filter.indicator.active.hoverBackground};
							}
						`)}

						&:focus {
							&:after {
								background-color: ${filter.indicator.active.focusBackground};
							}
						}
					`}
		`}
	`;
});

export const StyledFilterName = styled.span.withConfig({ displayName: "StyledFilterName-sc-" })<{
	$disabled?: boolean;
}>(({ theme, $disabled }) => {
	const { options, name } = theme.components.filter;

	return css`
		align-items: center;
		color: ${name.color};
		display: flex;
		font-family: ${name.fontFamily};
		font-size: ${name.fontSize};
		line-height: ${name.lineHeight};
		overflow: hidden;
		width: 100%;

		${$disabled &&
		css`
			color: ${options.disabledColor};
		`}
	`;
});

export const StyledFilterNameText = styled.span.withConfig({ displayName: "StyledFilterNameText-sc-" })(({ theme }) => {
	const { text } = theme.components.filter.name;

	return css`
		margin: ${text.margin};
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	`;
});

export const StyledFilterNameArrow = styled(Icon).withConfig({ displayName: "StyledFilterNameArrow-sc-" })<{
	$disabled?: boolean;
}>(({ theme, $disabled }) => {
	const { options, name } = theme.components.filter;

	return css`
		border-bottom: ${name.arrow.size} solid ${name.arrow.borderBottomColor.default};
		border-left: ${name.arrow.size} solid transparent;
		border-right: ${name.arrow.size} solid transparent;
		cursor: default;
		display: inline-block;
		height: ${name.arrow.size};
		pointer-events: none;
		transform: rotate(180deg);
		width: ${name.arrow.size};

		${$disabled &&
		css`
			color: ${options.disabledColor};
		`}
	`;
});

export const StyledFilterAction = styled.div.withConfig({ displayName: "StyledFilterAction-sc-" })(({ theme }) => {
	const { actionButton } = theme.components.filter;

	return css`
		display: flex;
		justify-content: center;
		flex-shrink: 0;
		&:before {
			border-left: ${actionButton.borderLeft};
			content: "";
			margin: 2px 0;
		}
	`;
});

export const StyledFilterActionButton = styled(Button).withConfig({ displayName: "StyledFilterActionButton-sc-" })(
	({ theme }) => {
		const { filter } = theme.components;

		return css`
			-webkit-tap-highlight-color: transparent;
			border-radius: 0;
			border-top-right-radius: ${filter.borderRadius};
			border-bottom-right-radius: ${filter.borderRadius};
			font-size: ${filter.actionButton.icon.fontSize};
			height: 100%;
		`;
	}
);
