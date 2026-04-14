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

import { active, hover } from "../../theme/base/mixins/_interaction.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";
import { StyledIconWrapper, StyledVariantIconWrapper } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { createButtonSemanticStyles } from "./button-semantics-utils.js";

export const StyledListWrapper = styled.ul.withConfig({ displayName: "StyledListWrapper-sc-" })(({ theme }) => {
	const { list } = theme.components;

	return css`
		background: ${list.background};
		font-family: ${list.fontFamily};
		list-style-type: none;
		margin: 0;
		padding: 0;
	`;
});

export const StyledListItemWrapper = styled.li.withConfig({ displayName: "StyledListItemWrapper-sc-" })<{
	$readonly?: boolean;
	$disabled?: boolean;
	$hasBorder?: boolean;
	$hasDivider?: boolean | "light" | "dark";
	$hasButtonSemantics?: boolean;
}>(({ theme, $readonly, $disabled, $hasBorder, $hasDivider, $hasButtonSemantics }) => {
	const { list } = theme.components;
	const { item, border, dividerBorder } = list;

	const getDividerStyles = () => {
		if (!$hasDivider) {
			return css``;
		}

		if ($hasButtonSemantics) {
			return css`
				&:not(:last-child) {
					border-bottom: ${$hasDivider === "light"
						? item.buttonSemanticsDivider?.light
						: item.buttonSemanticsDivider?.dark};
				}
			`;
		}

		return css`
			border-bottom: ${dividerBorder};
		`;
	};

	return css`
		box-sizing: border-box;
		background-color: ${list.background};
		color: ${item.color};
		cursor: pointer;
		display: flex;
		flex-direction: column;
		position: relative;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);

		${$hasBorder &&
		css`
			&:first-of-type {
				border-top: ${border};
			}

			&:last-of-type {
				border-bottom: ${border};
			}

			border-left: ${border};
			border-right: ${border};
		`}

		${getDividerStyles()}
		
		${($readonly || $disabled) &&
		css`
			cursor: default;
		`}
		${$disabled &&
		css`
			color: ${item.disabledColor};
		`}
		${$readonly &&
		css`
			color: ${item.readOnly?.color};
		`}
	`;
});

export const StyledListItemContent = styled.div.withConfig({ displayName: "StyledListItemContent-sc-" })<{
	$readonly?: boolean;
	$disabled?: boolean;
	$selected?: boolean;
	$noEffect?: boolean;
	$useAsButton?: boolean;
	$useFocusWithinStyles?: boolean;
	$preserveMainActionStyles?: boolean;
	$buttonSemantics?: {
		primary?: boolean;
		secondary?: boolean;
		destructive?: boolean;
		active?: boolean;
		iconOnly?: boolean;
	};
}>(
	({
		theme,
		$readonly,
		$disabled,
		$selected,
		$noEffect,
		$useAsButton,
		$useFocusWithinStyles,
		$buttonSemantics,
		$preserveMainActionStyles
	}) => {
		const {
			list: { item },
			button
		} = theme.components;

		return css`
			align-items: center;
			box-sizing: border-box;
			display: flex;
			flex-grow: 1;
			justify-content: flex-start;
			gap: ${$buttonSemantics ? item.buttonSemanticsGap : item.gap};
			min-height: ${item.minHeight};
			outline: 0;
			padding: ${item.padding};
			${createPseudoElement(
				":before",
				css`
					display: block;
				`
			)};

			${$useAsButton &&
			css`
				// Prevent text selection on icon when dragging the cursor.
				${StyledIconWrapper} {
					user-select: none;
					-webkit-user-select: none;
				}
			`}

			${StyledListItemWrapper}:not([data-role*="${DataRoles.FilterSelector}"]) && {
				${!$disabled &&
				!$readonly &&
				css`
					${$selected &&
					css`
						background-color: ${item.selected.background};
						&:before {
							border-left: ${item.selected.leftBorder};
						}
						${!$noEffect &&
						css`
							${active(css`
								&:before {
									border-left: ${item.selected.activeLeftBorder};
								}
							`)}
							${hover(css`
								&:before {
									border-left: ${item.selected.hoverLeftBorder};
								}
							`)}
						&:focus:before {
								border-left: ${item.selected.focusLeftBorder};
							}
						`}
					`}
				`}
			}

			${!$noEffect &&
			!$disabled &&
			!$readonly &&
			css`
				${active(css`
					&:before {
						border: ${item.activeBorder};
					}
				`)}
				${hover(css`
					&:before {
						border: ${item.hoverBorder};
					}
					${!$selected &&
					css`
						> *:not([data-role="${DataRoles.List.Item.Graphic}"]) {
							text-decoration: ${item.hoverTextDecoration};
						}
					`}
				`)}
                    
				&:focus:before {
					border: ${item.focusBorder};
					margin: 1px;
					outline: ${item.focusOutline};
				}

				${$useFocusWithinStyles &&
				css`
					&:focus-within:before {
						border: ${item.focusBorder};
						margin: 1px;
						outline: ${item.focusOutline};
					}

					&:has(> * :focus) {
						&:before {
							border: none;
							margin: 0;
							outline: none;
						}
					}

					${hover(css`
						&:before {
							border: ${item.hoverBorder};
						}
					`)};

					${StyledListItemText} {
						outline: none;
					}
				`}
			`}

			${$disabled &&
			css`
				&:focus:before {
					outline: ${item.focusOutline};
				}
			`}
            
			${!$preserveMainActionStyles &&
			$buttonSemantics &&
			css`
				${createButtonSemanticStyles({
					buttonSemantics: $buttonSemantics,
					disabled: $disabled,
					theme
				})};
			`}
			
			// Apply button semantic styles only when $buttonSemantics is present
			${($buttonSemantics || $preserveMainActionStyles) &&
			css`
				${StyledListItemGraphic} {
					${StyledIconWrapper} {
						font-size: ${button.iconButton.fontSize};
					}
				}

				${StyledListItemText} {
					font-family: ${button.fontFamily};
					font-size: ${button.fontSize};
					font-weight: ${button.fontWeight};
					text-transform: ${button.textTransform};
				}
			`}
		`;
	}
);

export const StyledListItemGraphic = styled.div.withConfig({ displayName: "StyledListItemGraphic-sc-" })<{
	$iconPlaceholder?: boolean;
	$disabled?: boolean;
}>(({ theme, $iconPlaceholder, $disabled }) => {
	const { graphic, disabledColor } = theme.components.list.item;

	return css`
		align-items: center;
		color: ${$disabled ? "inherit" : graphic.color};
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		position: relative;
		${$iconPlaceholder &&
		css`
			color: ${graphic.placeholder.color};
			background-color: ${$disabled ? disabledColor : graphic.placeholder.background};
			font-size: ${graphic.placeholder.fontSize};
			height: ${graphic.placeholder.height};
			line-height: ${graphic.placeholder.lineHeight};
			width: ${graphic.placeholder.width};
		`}

		${StyledIconWrapper} {
			display: inline-flex;
			font-size: ${graphic.iconFontSize};
			&:not(${StyledVariantIconWrapper}) {
				color: inherit;
			}
			${$disabled &&
			css`
				color: inherit;
			`}
		}
	`;
});

export const StyledListItemText = styled.div.withConfig({ displayName: "StyledListItemText-sc-" })<{
	$paddedLeft?: boolean;
	$paddedRight?: boolean;
	$selected?: boolean;
}>(({ theme, $paddedLeft, $paddedRight, $selected }) => {
	const { list } = theme.components;

	return css`
		color: ${list.item.text.color};
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		font-size: ${list.item.text.fontSize};
		font-weight: ${list.item.text.fontWeight};
		position: relative;

		${$paddedLeft &&
		css`
			&:first-child {
				margin-left: ${`calc(${list.item.graphic.iconFontSize} + ${list.item.gap})`};
			}
		`}
		${$paddedRight &&
		css`
			&:last-child {
				margin-right: ${`calc(${list.item.meta.fontSize} + ${list.item.gap})`};
			}
		`}
		${$selected &&
		css`
			color: ${list.item.selected.color};
			font-weight: ${list.item.selected.fontWeight};
		`}
	`;
});

export const StyledListItemSecondaryText = styled.div.withConfig({ displayName: "StyledListItemSecondaryText-sc-" })(
	({ theme }) => {
		const { secondaryText } = theme.components.list.item;

		return css`
			color: ${secondaryText.color};
			display: block;
			font-size: ${secondaryText.fontSize};
			font-weight: ${secondaryText.fontWeight};
			line-height: ${secondaryText.lineHeight};
			overflow: hidden;
		`;
	}
);

export const StyledListItemMeta = styled.div.withConfig({ displayName: "StyledListItemMeta-sc-" })<{
	$disabled?: boolean;
}>(({ theme, $disabled }) => {
	const { meta } = theme.components.list.item;

	return css`
		color: ${$disabled ? "inherit" : meta.color};
		font-size: ${meta.fontSize};
		position: relative;
		text-align: right;

		${$disabled &&
		css`
			${StyledIconWrapper} {
				color: inherit;
			}
		`}
	`;
});

export const StyledListSubHeader = styled.li.withConfig({ displayName: "StyledListSubHeader-sc-" })<{
	$fill?: boolean;
	$hasBorder?: boolean;
	$hasDivider?: boolean;
}>(({ theme, $fill, $hasBorder, $hasDivider }) => {
	const { subHeader, border } = theme.components.list;

	return css`
		font-size: ${subHeader.fontSize};
		font-weight: ${subHeader.fontWeight};
		height: ${subHeader.height};
		min-height: ${subHeader.minHeight};
		line-height: ${subHeader.lineHeight};
		position: relative;
		${!$fill &&
		css`
			${$hasBorder &&
			css`
				border-left: ${border};
				border-right: ${border};

				&:first-child {
					border-top: ${border};
				}
			`}
			${$hasDivider &&
			css`
				border-bottom: ${border};
			`}
		`}
	`;
});

export const StyledListSubHeaderContentWrapper = styled.div.withConfig({
	displayName: "StyledListSubHeaderContentWrapper-sc-"
})<{ $fill?: boolean; $interactive?: boolean }>(({ theme, $fill, $interactive }) => {
	const { list } = theme.components;
	const { item, subHeader } = list;

	return css`
		background-color: ${list.background};
		color: ${subHeader.color};
		cursor: ${$interactive ? "pointer" : "default"};
		height: 100%;
		${$fill &&
		css`
			color: ${subHeader.fillColor};
			background-color: ${subHeader.fillBG};
		`}
		${$interactive &&
		css`
			${createPseudoElement(":before")};
			${active(css`
				background-color: ${subHeader.active?.background};
				color: ${item.activeBorder.split(" ")[2] || item.activeBorder};
				&:before {
					border: ${item.activeBorder};
				}
			`)};
			${hover(css`
				background-color: ${subHeader.hover?.background};
				color: ${item.hoverBorder.split(" ")[2] || item.hoverBorder};
				&:before {
					border: ${item.hoverBorder};
				}
			`)};
			&:focus {
				outline: none;
				background-color: ${subHeader.focus?.background};
				color: ${item.focusBorder.split(" ")[2] || item.focusBorder};
				&:before {
					border: ${item.focusBorder};
					margin: 1px;
					outline: ${item.focusOutline};
				}
			}
		`}
	`;
});

export const StyledListSubHeaderContent = styled.div.withConfig({ displayName: "StyledListSubHeaderContent-sc-" })<{
	$useAsButton?: boolean;
}>(({ theme, $useAsButton }) => {
	const { item, subHeader } = theme.components.list;

	return css`
		align-items: center;
		display: flex;
		gap: ${item.gap};
		height: 100%;
		padding: ${subHeader.padding};

		${$useAsButton &&
		css`
			// Prevent text selection on icon when dragging the cursor.
			${StyledIconWrapper} {
				user-select: none;
				-webkit-user-select: none;
			}
		`}
	`;
});

export const StyledListSubHeaderChildren = styled.div.withConfig({ displayName: "StyledListSubHeaderChildren-sc-" })`
	flex-grow: 1;
`;

export const StyledListSubHeaderMeta = styled.div.withConfig({ displayName: "StyledListSubHeaderMeta-sc-" })`
	display: flex;
	${StyledIconWrapper} {
		color: inherit;
	}
`;

export const StyledListSubHeaderGraphic = styled(StyledListItemGraphic).withConfig({
	displayName: "StyledListSubHeaderGraphic-sc-"
})`
	color: inherit;
	${StyledIconWrapper} {
		color: inherit;
	}
`;
