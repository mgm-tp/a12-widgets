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

import { hover, active, activeAndHover } from "../../../theme/base/mixins/_interaction.js";
import { breakWord } from "../../../theme/base/mixins/_break-word.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { StyledCheckbox } from "../../../input/checkbox/main/checkbox.styled.js";
import { StyledLink } from "../../../link/main/link/link.view.js";
import { createBorder } from "../../../theme/base/mixins/_borderEffects.js";
import { DataRoles } from "../../../common/main/data-roles.js";

export const StyledDropdownWrapper = styled.div.withConfig({ displayName: "StyledDropdownWrapper-sc-" })<{
	$lightBackground?: boolean;
	$touch?: boolean;
	$horizontal?: boolean;
}>(({ theme, $lightBackground, $touch, $horizontal }) => {
	const { dropdown } = theme.components;

	return css`
		background-color: ${dropdown.background};
		box-shadow: ${dropdown.boxShadow};
		display: flex;
		font-family: ${dropdown.fontFamily};
		flex-direction: column;
		outline: ${dropdown.outline};
		width: 100%;

		${$lightBackground &&
		css`
			background-color: ${dropdown.lightBG};
		`}

		${$touch &&
		css`
			display: block;
			flex: 0 1 auto;
			overflow-y: auto;
		`}
		
		${$horizontal &&
		css`
			${StyledIconWrapper} {
				font-size: ${dropdown.horizontal.item.graphic.fontSize};
			}
		`}
		
		&:focus {
			outline: none;
		}
	`;
});

export const StyledDropdownHint = styled.div.withConfig({ displayName: "StyledDropdownHint-sc-" })(({ theme }) => {
	const { hint } = theme.components.dropdown;

	return css`
		background-color: ${hint.background};
		box-sizing: border-box;
		color: ${hint.color};
		font-size: ${hint.fontSize};
		height: ${hint.height};
		min-height: ${hint.minHeight};
		padding: ${hint.padding};
	`;
});

export const StyledDropdownFooter = styled.div.withConfig({ displayName: "StyledDropdownFooter-sc-" })(({ theme }) => {
	const { footer } = theme.components.dropdown;

	return css`
		align-items: center;
		box-sizing: border-box;
		background-color: ${footer.background};
		display: flex;
		justify-content: ${footer.horizontalAlignment};
		min-height: ${footer.minHeight};
		padding: ${footer.padding};
	`;
});

export const StyledDropdownContent = styled.div.withConfig({ displayName: "StyledDropdownContent-sc-" })<{
	$touch?: boolean;
	$horizontal?: boolean;
}>(({ theme, $touch, $horizontal }) => {
	return css`
		animation: pulse-dropdown-content 0.1s;
		display: flex;
		flex-direction: column;
		max-height: ${theme.components.dropdown.contentMaxHeight};
		overflow-y: auto;
		${$touch &&
		css`
			flex: 0 1 auto;
			max-height: none;
		`}

		${$horizontal &&
		css`
			flex-direction: row;
			flex-wrap: wrap;
		`}
		
		@keyframes pulse-dropdown-content {
			0% {
				min-height: 1px;
			}
			1%,
			2%,
			100% {
				min-height: 0;
			}
		}
	`;
});

export const StyledDropdownSection = styled.div.withConfig({ displayName: "StyledDropdownSection-sc-" })(
	({ theme }) => {
		const { section, item } = theme.components.dropdown;

		return css`
			background-color: ${section.background};
			color: ${section.color};
			flex: none;
			font-size: ${section.fontSize};
			font-weight: ${section.fontWeight};
			padding: ${item.padding};
			${hover(css`
				cursor: default;
			`)}
		`;
	}
);

export const StyledDropdownText = styled.div.withConfig({ displayName: "StyledDropdownText-sc-" })<{
	$extended?: boolean;
	$horizontal?: boolean;
}>(({ theme, $extended, $horizontal }) => {
	const { dropdown } = theme.components;

	return css`
		${!$horizontal &&
		css`
			display: flex;
			align-items: center;
		`}

		${breakWord}
		
		${$extended &&
		css`
			font-weight: ${dropdown.item.extended.fontWeight};
		`}
		
		${$horizontal &&
		css`
			font-size: ${dropdown.horizontal.item.label.fontSize};
			overflow: hidden;
			text-align: center;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: ${dropdown.horizontal.item.label.width};
		`}
	`;
});

export const StyledDropdownSecondaryText = styled.div.withConfig({ displayName: "StyledDropdownSecondaryText-sc-" })<{
	$extended?: boolean;
	$disabled?: boolean;
	$preselected?: boolean;
	$touch?: boolean;
}>(({ theme, $extended, $disabled, $preselected, $touch }) => {
	const { dropdown } = theme.components;

	return css`
		${$extended &&
		css`
			color: ${dropdown.secondaryText.color};
			font-size: ${dropdown.secondaryText.fontSize};
			margin: ${dropdown.secondaryText.margin};

			${StyledIconWrapper} {
				color: inherit;
				font-size: inherit;
				vertical-align: middle;
			}
		`}

		${$preselected &&
		css`
			color: inherit;
		`}
		
		${$touch &&
		css`
			margin: ${dropdown.touch.secondaryTextMargin};
		`}
		
		${$disabled &&
		css`
			color: ${dropdown.secondaryText.disabledColor};
		`}
	`;
});

export const StyledDropdownItem = styled.div.withConfig({ displayName: "StyledDropdownItem-sc-" })<{
	$disabled?: boolean;
	$focusPreselected?: boolean;
	$extended?: boolean;
	$touch?: boolean;
	$horizontal?: boolean;
	$divider?: boolean;
	$preselected?: boolean;
	$isEmptyValue?: boolean;
}>(({ theme, $disabled, $focusPreselected, $extended, $preselected, $touch, $horizontal, $divider, $isEmptyValue }) => {
	const { dropdown, multiselect } = theme.components;

	return css`
		box-sizing: border-box;
		color: ${dropdown.item.color};
		display: ${!$horizontal && "flex"};
		flex-shrink: 0;
		font-size: ${dropdown.item.fontSize};
		line-height: ${dropdown.item.lineHeight};
		min-height: ${dropdown.item.minHeight};
		outline: none;
		padding: ${dropdown.item.padding};
		position: relative;

		&:after {
			border: ${dropdown.item.border};
			bottom: 0;
			display: block;
			left: 0;
			pointer-events: none;
			position: absolute;
			right: 0;
			top: 0;
		}

		${$isEmptyValue &&
		css`
			color: ${dropdown.item.empty.color};
			font-style: ${dropdown.item.empty.fontStyle};
		`}

		${$preselected &&
		css`
			background-color: ${dropdown.item.preselect.background};
			color: ${dropdown.item.preselect.color};
			font-weight: ${dropdown.item.preselect.fontWeight};

			${StyledIconWrapper} {
				color: inherit;
			}
		`}

		${$extended &&
		css`
			display: flex;
			flex: none;
			flex-direction: column;
			justify-content: center;
		`}
		
    ${($extended || $touch) &&
		!$preselected &&
		css`
			&:not(:focus):after {
				border-bottom: ${dropdown.item.borderBottom};
				content: "";
			}
		`}
		
		${!$disabled &&
		css`
			${!$focusPreselected &&
			css`
				&:focus {
					${dropdown.item.customFocusBorder
						? css`
								${createBorder(dropdown.item.customFocusBorder, true)};
							`
						: css`
								&:after {
									border: ${dropdown.item.focusBorder};
									content: "";
								}
							`}
				}
			`}

			&:not([data-type="icon-selected"]) {
				${active(css`
					${$preselected &&
					css`
						background-color: transparent;
						color: ${dropdown.item.active.color};
					`}

					&:after {
						border: ${dropdown.item.active.border};
						content: "";
					}
				`)}

				${hover(css`
					cursor: pointer;
					font-style: ${dropdown.item.hover.fontStyle};

					${$preselected &&
					css`
						background-color: transparent;
						color: ${dropdown.item.hover.color};

						${$isEmptyValue &&
						css`
							color: ${dropdown.item.empty.hover.color};
						`}
					`}

					&:after {
						border: ${dropdown.item.hover.border};
						content: "";
					}
				`)}
			}
		`}
  
		${$focusPreselected &&
		css`
			${dropdown.item.customFocusPreselectBorder
				? css`
						${createBorder(dropdown.item.customFocusPreselectBorder, true)};
						&:before {
							outline: ${dropdown.item.focusPreselectOutline};
						}
					`
				: css`
						&:after {
							border: ${dropdown.item.focusPreselectBorder};
							bottom: 1px;
							content: "";
							left: 1px;
							right: 1px;
							outline: ${dropdown.item.focusPreselectOutline};
						}
					`}

			&:first-child:after {
				top: 1px;
			}
		`}
		
    ${$touch &&
		css`
			min-height: ${dropdown.touch.minHeight};
			padding: ${dropdown.touch.itemPadding};
			${$extended &&
			css`
				padding: ${dropdown.item.padding};
				min-height: ${dropdown.item.extended.minHeight};
			`}
		`}
		
		${$horizontal &&
		css`
			align-items: center;
			display: flex;
			flex-direction: column;
			padding: ${dropdown.horizontal.item.padding};
			${$preselected &&
			css`
				color: ${dropdown.horizontal.selectedItem.color};
				background-color: transparent;
				font-weight: ${dropdown.horizontal.selectedItem.fontWeight};
			`}

			${!$disabled &&
			!$preselected &&
			css`
				&:not([data-type="icon-selected"]) {
					${active(css`
						color: ${dropdown.horizontal.item.activeColor};
					`)}

					${hover(css`
						color: ${dropdown.horizontal.item.hoverColor ?? dropdown.horizontal.item.hover.color};
						font-style: ${dropdown.horizontal.item.hover.fontStyle};
					`)}
				}
			`}
		`}
		
		${$disabled &&
		css`
			color: ${dropdown.item.disabledColor};
			cursor: default;
			pointer-events: none;
			user-select: none;
		`}
		
		&[data-type="multiselect-item"] {
			&:has([data-role=${DataRoles.Checkbox.Input.Indeterminate}]) {
				&:first-child {
					font-weight: ${multiselect.dropdown.firstItemFontWeight};
				}
			}

			${!$focusPreselected &&
			css`
				&:not(:last-child):not(:focus) {
					&:after {
						border-bottom: ${$divider && multiselect.dropdown.divider};
						content: "";
					}

					&:has([data-role=${DataRoles.Checkbox.Input.Indeterminate}]):not(:active):not(:hover) {
						&:first-child:after {
							border-bottom: ${multiselect.dropdown.divider};
						}
					}

					${$divider &&
					css`
						&:not(:active):not(:hover):after {
							left: ${multiselect.dropdown.dividerGap};
							right: ${multiselect.dropdown.dividerGap};
						}
					`}

					${active(css`
						&:after {
							border-bottom: ${dropdown.item.active.border};
						}
					`)}
      
					${hover(css`
						&:after {
							border-bottom: ${dropdown.item.hover.border};
						}
					`)}
				}
			`}
		}
	`;
});

export const StyledDropdownGraphic = styled.div.withConfig({ displayName: "StyledDropdownGraphic-sc-" })<{
	$horizontal?: boolean;
	$preselected?: boolean;
}>(({ theme, $horizontal, $preselected }) => {
	const { dropdown } = theme.components;

	return css`
		align-items: center;
		display: flex;
		height: ${dropdown.graphic.lineHeight};
		margin: ${dropdown.graphic.margin};

		${StyledIconWrapper} {
			color: inherit;
		}

		${StyledCheckbox.StyledField} {
			min-height: auto;
		}

		${$horizontal &&
		css`
			height: ${dropdown.horizontal.item.graphic.size};
			width: ${dropdown.horizontal.item.graphic.size};
			justify-content: center;
			margin: 0;
			${$preselected &&
			css`
				background-color: ${dropdown.horizontal.selectedItem.background};
				border-radius: 50%;
				color: ${dropdown.horizontal.selectedItem.graphicColor};
			`}
		`}
	`;
});

export const StyledDropdownLink = styled.div.withConfig({ displayName: "StyledDropdownLink-sc-" })<{
	$preselected?: boolean;
	$touch: boolean;
}>(({ theme, $preselected, $touch }) => {
	const { link, touch } = theme.components.dropdown;

	return css`
		display: flex;
		flex-shrink: 0;
		font-size: ${link.item.fontSize};
		line-height: ${link.item.lineHeight};
		min-height: ${link.item.minHeight};
		outline: none;
		padding: ${link.item.padding};
		position: relative;
		cursor: pointer;

		&:after {
			border: ${link.item.border};
			bottom: 0;
			display: block;
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
		}

		${$touch &&
		css`
			min-height: ${touch.minHeight};
			padding: ${touch.itemPadding};
			${!$preselected &&
			css`
				&:not(:last-child):not(:focus):not(:active):after {
					border-bottom: ${link.item.borderBottom};
					content: "";
				}
			`}
		`}

		${$preselected &&
		css`
			background-color: ${link.item.preselect.background};
			color: ${link.item.preselect.color};

			${StyledIconWrapper} {
				color: inherit;
			}
			${StyledLink} {
				background-image: ${link.item.preselect.backgroundImage};
				background-position: left bottom;
				color: ${link.item.preselect.color};
				font-weight: ${link.item.preselect.fontWeight};
				transition: background-position ${link.item.transitionTiming};
			}
		`}

			${activeAndHover(css`
			${StyledLink} {
				background-position: left bottom;
				transition: background-position ${link.item.transitionTiming};
			}
		`)}

			${active(css`
			${$preselected &&
			css`
				background-color: transparent;
				color: ${link.item.active.color};
			`}
			&:after {
				border: ${link.item.active.border};
				content: "";
			}
			${StyledLink} {
				background-image: ${link.item.active.backgroundImage};
				color: ${link.item.active.color};
				text-decoration: ${link.item.active.textDecoration};
			}
		`)}

    ${hover(css`
			cursor: pointer;

			${$preselected &&
			css`
				background-color: transparent;
				color: ${link.item.hover.color};
				font-style: ${link.item.hover.fontStyle};
			`}

			&:after {
				border: ${link.item.hover.border};
				content: "";
			}

			${StyledLink} {
				background-image: ${link.item.hover.backgroundImage};
				color: ${link.item.hover.color};
				cursor: pointer;
				font-style: ${link.item.hover.fontStyle};
				text-decoration: ${link.item.hover.textDecoration};
			}
		`)}
	`;
});

export const StyledDropdownLinksWrapper = styled.div.withConfig({ displayName: "StyledDropdownLinksWrapper-sc-" })<{
	$touch: boolean;
}>(({ theme, $touch }) => {
	const { link } = theme.components.dropdown;

	return css`
		border-bottom: ${$touch ? link.wrapper.touchBorderBottom : link.wrapper.borderBottom};
	`;
});
