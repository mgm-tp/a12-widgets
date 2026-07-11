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

import { SubHeadingElements } from "../../../contentbox/main/template/elements/sub-heading.tpl.view.js";
import { StyledSubActionBarTpl } from "../../../contentbox/main/template/sub-action-bar.tpl.view.js";
import { StyledBadge, StyledBadgeWrapper, StyledTinyBadgeWrapper } from "../../../badge/main/badge.view.js";
import { active, hover } from "../../../theme/base/mixins/_interaction.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { StyledFilterSelectorWrapper } from "../../../faceted-search/main/filter-selector/filter.selector.styled.js";
import { createPseudoElement } from "../../../theme/base/mixins/_pseudo.js";
import { StyledTooltipTriggerWrapper } from "../../../tooltip/main/tooltip.styled.js";
import { getVerticalSpace } from "../../../common/main/utils.js";
import type { DefaultThemeType } from "../../../theme/schema.js";
import { createBorder } from "../../../theme/base/mixins/_borderEffects.js";

import type { MenuItemVariant } from "../menu.api.js";

import type { MainMenuProps } from "./menu.tpl.api.js";
import { MenuTplUtils } from "./menu.tpl.internal.js";

import getBadgePosition = MenuTplUtils.getBadgePosition;

export const StyledMenuContainer = styled.nav.withConfig({ displayName: "StyledMenuContainer-sc-" })<{
	$menuType: "vertical" | "horizontal";
	$condensible?: boolean;
	$sliding?: boolean;
	$useAs?: MainMenuProps.UseAs;
}>(({ theme, $condensible, $menuType, $sliding, $useAs }) => {
	const { menu } = theme.components;
	const { bottomLine, topLine } = theme.divisionLineStyles;

	const type = $useAs === "main" ? "mainMenu" : "tabNavigation";

	return css`
		outline: 1px solid transparent;
		${$condensible &&
		css`
			overflow: hidden;
		`}
		${$menuType === "horizontal" &&
		css`
			background-color: ${menu.mainLayer.horizontalBG};
			border-bottom: ${$useAs ? menu[type].borderBottom : bottomLine};
			width: 100%;

			&&& {
				border-top: ${$useAs ? menu[type].borderTop : topLine};
			}
		`}
		${$sliding &&
		css`
			overflow-x: hidden;
		`}
	`;
});

export const StyledMenuWrapper = styled.div.withConfig({ displayName: "StyledMenuWrapper-sc-" })<{
	$sliding?: boolean;
	$menuType: "vertical" | "horizontal";
	$useAs?: MainMenuProps.UseAs;
}>(({ theme, $sliding, $menuType, $useAs }) => {
	const { menu } = theme.components;

	return css`
		position: relative;

		${$useAs &&
		createPseudoElement(
			":before",
			css`
				background-color: ${menu.mainMenu.before.background};
				box-sizing: border-box;
				height: 2px;
				top: unset;
			`
		)};
		${$sliding &&
		css`
			transition: 0.1s all linear;
			position: relative;
			height: 100%;
			transform: translateX(0);
			width: 100%;

			&.nav__wrapper--rtl-enter {
				opacity: 0;
				position: absolute;
				top: 0;
				transform: translateX(50%);
			}

			&.nav__wrapper--rtl-exit {
				opacity: 0;
				transform: translateX(-50%);
			}

			&.nav__wrapper--ltr-enter {
				opacity: 0;
				position: absolute;
				top: 0;
				transform: translateX(-50%);
			}

			&.nav__wrapper--ltr-exit {
				opacity: 0;
				transform: translateX(50%);
			}
		`}

		${$menuType !== "horizontal" &&
		css`
			${StyledFilterSelectorWrapper} {
				${SubHeadingElements.StyledSubHeading} > *:not(:empty):not(${StyledSubActionBarTpl}) {
					border-bottom: none;
					border-top: none;
				}
			}
		`}
	`;
});

export const StyledMenuMainLayer = styled.ul.withConfig({ displayName: "StyledMenuMainLayer-sc-" })<{
	$menuType: "vertical" | "horizontal";
	$useAs?: MainMenuProps.UseAs;
}>(({ theme, $menuType, $useAs }) => {
	const { menu } = theme.components;
	const type = $useAs === "main" ? "mainMenu" : "tabNavigation";

	return css`
		display: flex;
		list-style: none;
		margin: 0;
		outline: none;
		padding: 0;
		${$menuType === "horizontal" &&
		css`
			background-color: ${$useAs ? menu[type].mainLayer.background : menu.mainLayer.horizontalBG};
			padding: ${menu.mainLayer.horizontalPadding};
		`}
		${$menuType === "vertical" &&
		css`
			background-color: ${menu.mainLayer.verticalBG};
			flex-direction: column;
			height: 100%;
			overflow-x: hidden;
			overflow-y: auto;
		`}
	`;
});

export const StyledMenuSubLayer = styled.ul.withConfig({ displayName: "StyledMenuSubLayer-sc-" })<{
	$menuType: "vertical" | "horizontal";
	$parentMenuType?: string;
	$useAs?: MainMenuProps.UseAs;
}>(({ theme, $menuType, $parentMenuType, $useAs }) => {
	const { subLayer, mainMenu, tabNavigation } = theme.components.menu;

	return css`
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		outline: 1px solid transparent;
		padding: 0;
		background-color: ${subLayer.background};
		box-shadow: ${subLayer.boxShadow};
		min-width: ${subLayer.minWidth};

		${($menuType === "horizontal" || $parentMenuType === "horizontal") &&
		css`
			margin-bottom: -${theme.divisionLineStyles.lineHeight};
			margin-top: -${theme.divisionLineStyles.lineHeight};
			width: 100%;
		`}

		${$menuType === "vertical" &&
		$parentMenuType === "vertical" &&
		css`
			background-color: ${subLayer.verticalBG};
			max-height: 100vh;
			overflow: auto;
		`}

		${$parentMenuType === "horizontal" &&
		$useAs &&
		css`
			background-color: ${$useAs === "main" ? mainMenu.subLayer.background : tabNavigation.subLayer.background};
		`}
	`;
});

// Styles Menu Item in Main Menu and Tab Navigation
const menuItemStyles = (disabled?: boolean, selected?: boolean, useAs?: MainMenuProps.UseAs, isSubMenu?: boolean) =>
	css(({ theme }) => {
		const { menu } = theme.components;
		const type = useAs === "main" ? "mainMenu" : "tabNavigation";
		const itemStyles = selected ? menu[type].item.selected : menu[type].item;

		return css`
			${StyledMenuItemLabel} {
				font-size: ${menu[type].item.fontSize};
				text-transform: ${menu[type].item.textTransform};
			}

			${!disabled
				? css`
						background-color: ${itemStyles.background};
						border-radius: ${itemStyles.borderRadius};

						${StyledMenuItemIcon}, ${StyledMenuItemText} {
							color: ${itemStyles.color};
							font-weight: ${itemStyles.fontWeight};
						}

						${!isSubMenu &&
						css`
							&:before {
								border: ${itemStyles.border};
								border-bottom: ${itemStyles.borderBottom};
							}

							&:focus-within {
								background-color: ${itemStyles.focus.background};
								border-radius: ${itemStyles.focus.borderRadius};

								${StyledMenuItemIcon}, ${StyledMenuItemText} {
									color: ${itemStyles.focus.color};
								}

								${itemStyles.focus.customBorder
									? css`
											${createBorder(itemStyles.focus.customBorder, true)};
										`
									: css`
											&:before {
												border: ${itemStyles.focus.border};
												border-bottom: ${itemStyles.focus.borderBottom};
											}
										`}
							}

							${active(css`
								background-color: ${itemStyles.active.background};
								border-radius: ${itemStyles.active.borderRadius};

								${StyledMenuItemIcon}, ${StyledMenuItemText} {
									color: ${itemStyles.active.color};
								}

								&:not(:focus-within):before {
									border: ${itemStyles.active.border};
									border-bottom: ${itemStyles.active.borderBottom};
								}

								&:before {
									border-bottom: ${itemStyles.active.borderBottom};
								}
							`)}

							${hover(css`
								background-color: ${itemStyles.hover.background};
								border-radius: ${itemStyles.hover.borderRadius};
								cursor: ${itemStyles.hover.cursor};
								font-style: ${itemStyles.hover.fontStyle};

								${StyledMenuItemIcon}, ${StyledMenuItemText} {
									color: ${itemStyles.hover.color};
								}

								&:not(:focus-within):before {
									border: ${itemStyles.hover.border};
									border-bottom: ${itemStyles.hover.borderBottom};
								}

								&:before {
									border-bottom: ${itemStyles.hover.borderBottom};
								}
							`)}
						`}
					`
				: css`
						${StyledMenuItemIcon}, ${StyledMenuItemText} {
							color: ${itemStyles.disabledColor};
						}
					`}
		`;
	});

const setBadgeColor = (theme: DefaultThemeType, vertical?: { displayedAsPlaceholder: boolean }) => {
	const { menu, badge } = theme.components;

	if (vertical) {
		return css`
			${StyledBadge}[data-type="warning-badge"] {
				background-color: ${vertical.displayedAsPlaceholder
					? menu.item.horizontal.badge.backgroundColor.warning
					: badge.background.warning};
			}
		`;
	}

	return css`
		${StyledBadge}[data-type="warning-badge"] {
			background-color: ${menu.item.horizontal.badge.backgroundColor.warning};
		}
	`;
};

export const StyledMenuItem = styled.li.withConfig({ displayName: "StyledMenuItem-sc-" })<{
	$menuItemType: "vertical" | "horizontal";
	$disabled?: boolean;
	$selected?: boolean;
	$subLayer?: boolean;
	$parentMenuType?: string;
	$collapsed?: boolean;
	$showPlaceholder?: boolean;
	$useAs?: MainMenuProps.UseAs;
	$nonCondensedItemCount?: number;
}>(
	({
		theme,
		$disabled,
		$selected,
		$menuItemType,
		$subLayer,
		$parentMenuType,
		$collapsed,
		$useAs,
		$nonCondensedItemCount,
		$showPlaceholder
	}) => {
		const { menu, badge } = theme.components;
		const { fontFamily } = theme.applicationStyles;
		const { lineHeight } = theme.baseInputStyles;

		return css`
			box-sizing: border-box;
			cursor: ${$disabled ? "default" : "pointer"};
			display: flex;
			font-family: ${fontFamily};
			flex-shrink: 0;
			line-height: ${lineHeight};
			outline: none;
			position: relative;

			&:before {
				bottom: 0;
				content: "";
				left: 0;
				position: absolute;
				top: 0;
				right: 0;
			}

			${$menuItemType === "horizontal" &&
			css`
				${!$subLayer &&
				css`
					margin: ${menu.item.horizontal.margin};

					&:first-child {
						${$nonCondensedItemCount === 0
							? css`
									margin: 0 auto;
								`
							: css`
									margin-left: 0;
								`}
					}

					${!$disabled &&
					css`
						&:focus-within {
							${menu.item.horizontal.focus.customBorder
								? css`
										${createBorder(menu.item.horizontal.focus.customBorder, true)};
									`
								: css`
										&:before {
											border: ${menu.item.horizontal.focus.border};
											border-bottom: ${menu.item.horizontal.focus.borderBottom};
										}
									`}
						}

						${active(css`
							&:before {
								border-bottom: ${menu.item.horizontal.active.borderBottom};
							}
						`)}

						${hover(css`
							font-style: ${menu.item.horizontal.hover.fontStyle};
							&:before {
								border-bottom: ${menu.item.horizontal.hover.borderBottom};
							}
						`)}
						
						${$selected &&
						css`
							background: ${menu.item.horizontal.selected.background};
							color: ${menu.item.horizontal.selected.color};
							font-weight: ${menu.item.horizontal.selected.fontWeight};

							&:before {
								border: ${menu.item.horizontal.selected.border};
								border-bottom: ${menu.item.horizontal.selected.borderBottom};
							}

							&:focus-within {
								${menu.item.horizontal.selected.focus.customBorder
									? css`
											${createBorder(menu.item.horizontal.selected.focus.customBorder, true)};
										`
									: css`
											&:before {
												border: ${menu.item.horizontal.selected.focus.border};
												border-bottom: ${menu.item.horizontal.selected.focus.borderBottom};
											}
										`}
							}

							${hover(css`
								font-style: ${menu.item.horizontal.selected.hover?.fontStyle};
								cursor: ${menu.item.horizontal.selected.hover?.cursor};
							`)}
						`}
					`}
				`}

				${$useAs && menuItemStyles($disabled, $selected, $useAs)}
				${setBadgeColor(theme)}
			`}

			${$menuItemType === "vertical" &&
			css`
				${$parentMenuType === "vertical" &&
				css`
					&:before {
						border-bottom: ${menu.item.vertical.borderBottom};
					}

					${!$disabled &&
					css`
						${active(css`
							background-color: ${menu.item.vertical.active.background};

							&:before {
								border: ${menu.item.vertical.active.border};
							}
						`)}

						${hover(css`
							background-color: ${menu.item.vertical.hover.background};
							font-style: ${menu.item.vertical.hover.fontStyle};

							&:before {
								border: ${menu.item.vertical.hover.border};
							}
						`)}
						
						&:focus-within {
							background-color: ${menu.item.vertical.focus.background};
							${menu.item.vertical.focus.customBorder
								? css`
										${createBorder(menu.item.vertical.focus.customBorder, true)};
									`
								: css`
										&:before {
											margin: 1px;
											border: ${menu.item.vertical.focus.border};
											outline: ${menu.item.vertical.focus.outline};
										}
									`}
						}

						${$selected &&
						css`
							background-color: ${menu.item.vertical.selected.background};
							color: ${menu.item.vertical.selected.color};
							font-weight: ${menu.item.vertical.selected.fontWeight};

							&:before {
								border-left: ${menu.item.vertical.selected.borderLeft};
							}

							${active(css`
								background-color: ${menu.item.vertical.selected.background};

								&:before {
									border-left: ${menu.item.vertical.selected.activeBorderLeft};
								}
							`)}

							${hover(css`
								background-color: ${menu.item.vertical.selected.background};
								cursor: ${menu.item.vertical.selected.hover?.cursor};
								font-style: ${menu.item.vertical.selected.hover?.fontStyle};

								&:before {
									border-left: ${menu.item.vertical.selected.hoverBorderLeft};
								}
							`)}
							
							&:focus-within {
								background-color: ${menu.item.vertical.selected.background};
								&:before {
									border-left: ${menu.item.vertical.selected.focusBorderLeft};
								}
							}
						`}

						${$collapsed &&
						css`
							${StyledTinyBadgeWrapper} {
								bottom: 100%;
								left: calc(${badge.tiny.width} * (-1));
							}
						`}
						
						${!$collapsed &&
						css`
							${StyledTinyBadgeWrapper} {
								display: none;
							}
						`}
						
						${setBadgeColor(theme, { displayedAsPlaceholder: !!$showPlaceholder })}
					`}
				`}

				${$parentMenuType === "horizontal" &&
				$subLayer &&
				!$disabled &&
				css`
					${active(css`
						background-color: ${menu.item.subHorizontal.active.background};

						&:before {
							border: ${menu.item.subHorizontal.active.border};
						}
					`)}

					${hover(css`
						background-color: ${menu.item.subHorizontal.hover.background};
						font-style: ${menu.item.subHorizontal.hover.fontStyle};

						&:before {
							border: ${menu.item.subHorizontal.hover.border};
						}
					`)}
					
					&:focus-within {
						background-color: ${menu.item.subHorizontal.focus.background};
						${menu.item.subHorizontal.focus.customBorder
							? css`
									${createBorder(menu.item.subHorizontal.focus.customBorder, true)};
								`
							: css`
									&:before {
										margin: 1px;
										border: ${menu.item.subHorizontal.focus.border};
										outline: ${menu.item.subHorizontal.focus.outline};
									}
								`}
					}

					${$selected &&
					css`
						background-color: ${menu.item.subHorizontal.selected.background};
						color: ${menu.item.subHorizontal.selected.textColor};
						font-weight: ${menu.item.subHorizontal.selected.fontWeight};

						&:before {
							border-left: ${menu.item.subHorizontal.selected.borderLeft};
						}

						${active(css`
							background-color: ${menu.item.subHorizontal.active.background};

							&:before {
								border-left: ${menu.item.subHorizontal.selected.activeBorderLeft};
							}
						`)}

						${hover(css`
							background-color: ${menu.item.subHorizontal.selected.background};
							cursor: ${menu.item.subHorizontal.selected.hover?.cursor};
							font-style: ${menu.item.subHorizontal.selected.hover?.fontStyle};

							&:before {
								border-left: ${menu.item.subHorizontal.selected.hoverBorderLeft};
							}
						`)}
						&:focus-within {
							background-color: ${menu.item.subHorizontal.selected.background};
							&:before {
								border-left: ${menu.item.subHorizontal.selected.focusBorderLeft};
							}
						}
					`}

					${$useAs && menuItemStyles($disabled, $selected, $useAs, true)}
					${setBadgeColor(theme)}
				`}
			`}
		`;
	}
);

export const StyledMenuItemLink = styled.div.withConfig({ displayName: "StyledMenuItemLink-sc-" })<{
	$menuItemType: "vertical" | "horizontal";
	$parentMenuType?: string;
	$subLayer?: boolean;
	$collapsed?: boolean;
}>(({ theme, $menuItemType, $subLayer, $collapsed, $parentMenuType }) => {
	const { link } = theme.components.menu;

	return css`
		align-items: center;
		box-sizing: border-box;
		display: flex;
		flex-grow: 1;
		gap: ${$menuItemType === "horizontal" || $parentMenuType === "horizontal"
			? link.horizontalChildrenSpacing
			: link.vertical.childrenSpacing};
		justify-content: center;
		min-height: ${link.minHeight};
		outline: none;
		padding: ${link.padding};
		width: 100%;
		${$menuItemType === "horizontal" &&
		$subLayer &&
		css`
			padding: ${link.subHorizontalPadding};
		`}
		${$menuItemType === "vertical" &&
		css`
			padding: ${link.vertical.padding};
			${$collapsed &&
			css`
				gap: 0;

				> *:not(:first-child) {
					flex-grow: 0;
					gap: 0;
					min-width: 0;
				}
			`}
		`}
	`;
});

const additionalIconVariant = (type: "info" | "error" | "warning", theme: DefaultThemeType) => {
	const { additional } = theme.components.menu.icon;

	return css`
		background-color: ${additional.variant[type]};
		${StyledIconWrapper} {
			color: ${additional.variant.text[type]};
		}
	`;
};

export const StyledMenuItemIcon = styled.div.withConfig({ displayName: "StyledMenuItemIcon-sc-" })<{
	$menuItemType: "vertical" | "horizontal";
	$disabled?: boolean;
	$selected?: boolean;
	$hasAdditionalInfoIcon?: boolean;
	$parentMenuType?: string;
	$collapsed?: boolean;
	$subLayer?: boolean;
	$additionalIconVariant?: string;
	$variant?: MenuItemVariant;
}>(
	({
		theme,
		$disabled,
		$selected,
		$hasAdditionalInfoIcon,
		$menuItemType,
		$parentMenuType,
		$collapsed,
		$additionalIconVariant,
		$variant
	}) => {
		const { menu } = theme.components;

		return css`
			align-items: center;
			color: ${menu.icon.color};
			display: flex;
			justify-content: center;
			font-size: ${menu.icon.fontSize};
			min-width: ${$collapsed ? 0 : menu.icon.minWidth};
			position: relative;

			${StyledIconWrapper} {
				color: ${$variant
					? $menuItemType === "vertical" && $parentMenuType === "vertical"
						? menu.item.vertical.icon.status.variant[$variant]
						: menu.icon.status.variant[$variant]
					: "inherit"};
				font-size: inherit;
			}

			${($menuItemType === "horizontal" || $parentMenuType === "horizontal") &&
			css`
				height: ${menu.icon.horizontalHeight};
				${$selected &&
				css`
					color: ${menu.item.horizontal.selected.color};
					font-weight: ${menu.item.horizontal.selected.fontWeight};
				`}
			`}

			${$menuItemType === "vertical" &&
			$parentMenuType === "vertical" &&
			css`
				color: ${menu.icon.verticalColor};
				${$hasAdditionalInfoIcon &&
				css`
					color: ${menu.icon.additional.color};
					font-size: ${menu.icon.additional.fontSize};
					padding: ${menu.icon.additional.padding};
					${$additionalIconVariant === "info" && additionalIconVariant("info", theme)}
					${$additionalIconVariant === "warning" && additionalIconVariant("warning", theme)}
				${$additionalIconVariant === "error" && additionalIconVariant("error", theme)}
				`}
			`}
			
			${$disabled &&
			css`
				color: ${menu.item.disabledColor};
			`}
		`;
	}
);

export const StyledMenuItemPlaceholder = styled.span.withConfig({ displayName: "StyledMenuItemPlaceholder-sc-" })<{
	$menuItemType: "vertical" | "horizontal";
	$disabled?: boolean;
}>(({ theme, $disabled, $menuItemType }) => {
	const { menu } = theme.components;

	return css`
		${$menuItemType === "vertical" &&
		css`
			align-items: center;
			background-color: ${menu.placeholder.background};
			color: ${menu.placeholder.color};
			display: flex;
			flex-shrink: 0;
			font-size: ${menu.placeholder.fontSize};
			font-style: ${menu.placeholder.fontStyle};
			font-weight: ${menu.placeholder.fontWeight};
			height: ${menu.placeholder.height};
			justify-content: center;
			text-align: center;
			text-transform: uppercase;
			width: ${menu.placeholder.width};
			${$disabled &&
			css`
				background-color: ${menu.item.placeholderDisabled.background};
				color: ${menu.item.placeholderDisabled.color};
			`}
		`}
	`;
});

export const StyledMenuItemLabel = styled.div.withConfig({ displayName: "StyledMenuItemLabel-sc-" })(({ theme }) => {
	const { label } = theme.components.menu;

	return css`
		align-items: center;
		display: flex;
		flex-grow: 1;
		font-size: ${label.fontSize};
		font-family: ${label.fontFamily};
		font-weight: ${label.fontWeight};
		position: relative;
		text-transform: ${label.textTransform};

		> *:not(:last-child) {
			margin: ${label.childrenSpacing};
		}
	`;
});

export const StyledMenuItemText = styled.div.withConfig({ displayName: "StyledMenuItemText-sc-" })<{
	$menuItemType: "vertical" | "horizontal";
	$disabled?: boolean;
	$selected?: boolean;
	$parentMenuType?: string;
	$collapsed?: boolean;
	$subLayer?: boolean;
	$hasNonLabel?: boolean;
	$hasBadgeCount?: boolean;
	$sliding?: boolean;
	$hasOverflowCount?: boolean;
}>(
	({
		theme,
		$disabled,
		$selected,
		$menuItemType,
		$parentMenuType,
		$collapsed,
		$subLayer,
		$hasNonLabel,
		$hasBadgeCount,
		$sliding,
		$hasOverflowCount
	}) => {
		const { menu, badge } = theme.components;
		const isVertical = $sliding || $parentMenuType === "vertical";
		const { badgePosition, tinyBadgePosition } = getBadgePosition({
			isVertical,
			hasNonLabel: $hasNonLabel,
			subLayer: $subLayer,
			badgeHeight: badge.height,
			badgeRightPos: menu.link.badgeRightPos,
			tinyBadgeHeight: badge.tiny.height,
			tinyBadgeWidth: badge.tiny.width
		});
		const { badge: badgeCustomStyles, tinyBadge: tinyBadgeCustomStyles } = menu.subLayer;

		return css`
			color: ${menu.label.color};
			position: relative;
			display: flex;

			&:empty {
				display: none;
			}

			${($menuItemType === "horizontal" || $parentMenuType === "horizontal") &&
			css`
				${!$subLayer &&
				css`
					align-items: center;
					display: flex;
					height: ${menu.icon.horizontalHeight};
					${$selected &&
					!$disabled &&
					css`
						color: ${menu.item.horizontal.selected.color};
						font-weight: ${menu.item.horizontal.selected.fontWeight};
					`}
				`}

				${$subLayer &&
				css`
					line-height: normal;

					${$hasNonLabel &&
					css`
						height: ${menu.icon.horizontalHeight};
					`}
				`}
			`}

			${$menuItemType === "vertical" &&
			$parentMenuType === "vertical" &&
			css`
				${$collapsed &&
				css`
					font-size: 0;
					height: ${menu.icon.verticalHeight};
				`}
				color: ${menu.label.verticalColor};
				word-wrap: break-word;
			`}
			
			${$disabled &&
			css`
				color: ${menu.item.disabledColor};
			`}

			${StyledTinyBadgeWrapper} {
				${$subLayer && tinyBadgeCustomStyles
					? css`
							margin: ${tinyBadgeCustomStyles.margin};
						`
					: css`
							top: ${tinyBadgePosition.top};
							right: ${tinyBadgePosition.right};
						`}
			}

			${$hasBadgeCount &&
			css`
				margin: ${badgePosition.margin};

				${StyledBadgeWrapper} {
					${$subLayer && badgeCustomStyles
						? css`
								margin: ${$hasOverflowCount ? badgeCustomStyles.overflowCountMargin : badgeCustomStyles.margin};
								top: auto;
								right: auto;
							`
						: css`
								right: ${badgePosition.right};
								top: ${badgePosition.top};
							`}
				}

				${(isVertical || $subLayer) &&
				css`
					// Fix position of badge in Safari
					@supports (-webkit-hyphens: none) {
						${StyledBadgeWrapper} {
							top: calc(${badge.height} * (-0.85));
						}
					}
				`}
			`}
		`;
	}
);

export const StyleMenuGroupWrapper = styled.li.withConfig({ displayName: "StyleMenuGroupWrapper-sc-" })<{
	$firstGroup: boolean;
}>(({ theme, $firstGroup }) => {
	const { link } = theme.components.menu;

	return css`
		display: flex;

		${StyledTooltipTriggerWrapper} {
			height: 100%;
			margin: auto;
			padding-top: ${getVerticalSpace("top", link.padding)};
			padding-bottom: ${getVerticalSpace("bottom", link.padding)};

			${$firstGroup &&
			css`
				left: 0;
				padding: 0;
				position: absolute;
			`}
		}
	`;
});

export const StyledMenuGroupTitle = styled.span.withConfig({ displayName: "StyledMenuGroupTitle-sc-" })(({ theme }) => {
	const { group } = theme.components.menu;

	return css`
		&:before {
			background-color: ${group.divider.background};
			content: "";
			display: block;
			height: 100%;
			width: ${group.divider.width};
		}

		height: 100%;
		padding: ${group.divider.padding};

		${hover(css`
			cursor: ${group.hover.cursor};
		`)}
	`;
});

export const StyledSubMenuGroupTitle = styled.li.withConfig({ displayName: "StyledSubMenuGroupTitle-sc-" })(
	({ theme }) => {
		const { group } = theme.components.menu;

		return css`
			background-color: ${group.background};
			cursor: default;
			font-size: ${group.fontSize};
			font-weight: ${group.fontWeight};
			padding: ${group.padding};
		`;
	}
);
