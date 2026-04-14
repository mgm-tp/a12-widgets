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

import type { RuleSet } from "styled-components";
import { styled, css } from "styled-components";

import type { DefaultThemeType } from "../../theme/schema.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { active, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { createBorder } from "../../theme/base/mixins/_borderEffects.js";

import type { ToggleItemVariant } from "./toggle.api.js";

export namespace StyledToggle {
	export const StyledOptionButtons = styled.ul.withConfig({ displayName: "StyledOptionButtons-sc-" })<{
		$hasOverlay?: boolean;
	}>(({ theme, $hasOverlay }) => {
		const { item } = theme.components.toggle;

		return css`
			display: flex;
			gap: ${item.gap};
			list-style-type: none;
			margin: 0;
			padding: 0;

			${$hasOverlay &&
			css`
				${StyledToggleItem} {
					outline: none;
					z-index: 0;
				}
			`}
		`;
	});

	export const StyledOptionButton = styled.li.withConfig({ displayName: "StyledOptionButton-sc-" })<{
		$disabled?: boolean;
		$readonly?: boolean;
	}>(({ theme, $disabled, $readonly }) => {
		const { item, content } = theme.components.toggle;

		return css`
			display: flex;
			${($disabled || $readonly) &&
			css`
				pointer-events: none;
			`}
			&:first-of-type {
				border-top-left-radius: ${item.borderRadius};
				border-bottom-left-radius: ${item.borderRadius};
				${StyledToggleContent} {
					padding-left: ${content.horizSpacing};
				}
			}
			&:last-child {
				border-top-right-radius: ${item.borderRadius};
				border-bottom-right-radius: ${item.borderRadius};
				${StyledToggleContent} {
					padding-right: ${content.horizSpacing};
				}
			}
		`;
	});

	export const StyledToggleContent = styled.span.withConfig({ displayName: "StyledToggleContent-sc-" })<{
		$showOnlySelectedOption?: boolean;
	}>(({ theme, $showOnlySelectedOption }) => {
		const { content } = theme.components.toggle;

		return css`
			align-items: center;
			border-radius: inherit;
			display: flex;
			justify-content: center;
			flex-grow: 1;
			min-height: ${content.minHeight};
			padding: ${content.padding};
			${$showOnlySelectedOption &&
			css`
				position: relative;
			`}
		`;
	});

	export const StyledSelectedItemOverlay = styled.span.withConfig({ displayName: "StyledSelectedItemOverlay-sc-" })<{
		$variant?: ToggleItemVariant;
		$disabled?: boolean;
		$readonly?: boolean;
		$hasTouch?: boolean;
	}>(({ theme, $variant, $disabled, $readonly, $hasTouch }) => {
		const { item } = theme.components.toggle;
		const background = $variant
			? item.variant[$variant].background
			: $disabled
				? item.withOverlay.selected.disabled.background
				: $readonly
					? item.withOverlay.selected.readonly.background
					: item.withOverlay.selected.background;

		const iconColor = $variant
			? item.variant[$variant].color
			: $disabled
				? item.withOverlay.selected.disabled.color
				: $readonly
					? item.withOverlay.selected.readonly.color
					: item.withOverlay.selected.color;

		return css`
			align-items: center;
			background: ${background};
			border: ${item.withOverlay.selected.border};
			border-radius: ${item.withOverlay.selected.borderRadius};
			box-sizing: border-box;
			display: flex;
			font-family: ${item.withOverlay.selected.fontFamily};
			font-size: ${item.withOverlay.selected.fontSize};
			font-weight: ${item.withOverlay.selected.fontWeight};
			justify-content: center;
			min-height: ${item.withOverlay.selected.minHeight};
			pointer-events: ${!$hasTouch && "none"};
			position: absolute;
			width: 100%;
			z-index: 1;
			${StyledIconWrapper} {
				color: ${iconColor};
				// Prevent text selection on icon when dragging the cursor.
				user-select: none;
				-webkit-user-select: none;
			}
			&:focus {
				border-color: ${item.withOverlay.selected.focus.borderColor};
				cursor: pointer;
				${darkFocus}
			}
		`;
	});

	const StyledToggleItemBase = styled.button.withConfig({ displayName: "StyledToggleItemBase-sc-" })<{
		$disabled?: boolean;
		$selected?: boolean;
		$readonly?: boolean;
		$showOnlySelectedOption?: boolean;
	}>(({ theme, $showOnlySelectedOption }) => {
		const { item, content } = theme.components.toggle;

		return css`
			position: relative;
			background-color: ${item.background};
			border: ${item.border};
			border-right: none;
			color: ${item.color};
			cursor: pointer;
			display: inline-flex;
			flex-direction: column;
			flex-shrink: 0;
			font-family: ${item.fontFamily};
			font-size: ${item.fontSize};
			font-weight: ${item.fontWeight};
			margin: 0;
			padding: 0;
			min-height: ${item.minHeight};
			line-height: ${item.lineHeight};

			&:before {
				inset: -1px;
				content: "";
				position: absolute;
				border-radius: inherit;
			}
			${!$showOnlySelectedOption &&
			css`
				&:first-of-type {
					border-top-left-radius: ${item.borderRadius};
					border-bottom-left-radius: ${item.borderRadius};
					${StyledToggleContent} {
						padding-left: ${content.horizSpacing};
					}
				}
				&:last-child {
					border-right: ${item.border};
					border-top-right-radius: ${item.borderRadius};
					border-bottom-right-radius: ${item.borderRadius};
					${StyledToggleContent} {
						padding-right: ${content.horizSpacing};
					}
				}
			`}

			${$showOnlySelectedOption &&
			css`
				border: ${item.withOverlay.border};
				border-radius: ${item.withOverlay.borderRadius};
			`}
			
			${StyledIconWrapper} {
				text-decoration: none;
				color: inherit;
				// Prevent text selection on icon when dragging the cursor.
				user-select: none;
				-webkit-user-select: none;
				${!$showOnlySelectedOption &&
				css`
					margin: ${item.iconMargin};
				`}
			}

			&[disabled] {
				border: ${$showOnlySelectedOption && "none"};
				border-color: ${!$showOnlySelectedOption && "transparent"};
				cursor: default;
			}
			&:not(:disabled) {
				${active(css`
					text-decoration: ${item.active.textDecoration};
				`)}
				${hover(css`
					text-decoration: ${item.hover.textDecoration};
				`)} 
				&:focus {
					outline: none;
					text-decoration: ${item.focus.textDecoration};
				}
			}
		`;
	});

	const getItemStyles = (
		theme: DefaultThemeType,
		colors: { color: string; background: string },
		disabled = false
	): RuleSet<object> => {
		const { item } = theme.components.toggle;

		return css`
			background-color: ${colors.background};
			color: ${colors.color};
			box-shadow: none;
			${!disabled &&
			css`
				border-right: ${item.border};
				border-color: ${colors.background};
				& + ${StyledToggleItemBase} {
					border-left: 0;
				}
			`}
		`;
	};

	const getInteractiveItemStyles = (theme: DefaultThemeType, $state: "active" | "hover" | "focus") => {
		const { item, content } = theme.components.toggle;

		let borderStyle: RuleSet<object> = css`
			&:before {
				border: ${content[$state].border};
				z-index: 1;
			}
		`;

		if ($state === "focus" && content.focus.customBorder) {
			borderStyle = createBorder(content.focus.customBorder, true);
		}

		return css`
			color: ${item[$state].color};

			${$state === "focus" &&
			css`
				&:before {
					outline: ${content.focus.outline};
				}
			`}

			${borderStyle}
		`;
	};

	export const StyledToggleItem = styled(StyledToggleItemBase).withConfig({ displayName: "StyledToggleItem-sc-" })(
		({ theme, $disabled, $selected, $readonly }) => {
			const { item } = theme.components.toggle;

			if ($selected) {
				return css`
					outline: 2px solid transparent;
					z-index: 1;

					${getItemStyles(theme, item.selected)}

					&:not(:disabled) {
						${active(getItemStyles(theme, item.selected.active))}
						${hover(getItemStyles(theme, item.selected.hover))} 
						
					&:focus {
							&:before {
								${darkFocus};
							}
							${getItemStyles(theme, item.selected.focus)}
						}
					}

					${!$disabled &&
					!$readonly &&
					css`
						&:last-child {
							border-color: ${item.selected.background};
						}
					`}

					${$readonly &&
					css`
						&[disabled] {
							${getItemStyles(theme, item.selected.readonly, true)}
						}
					`}
					
				${$disabled &&
					css`
						&[disabled] {
							${getItemStyles(theme, item.selected.disabled, true)}
						}
					`}
				`;
			}

			return css`
				&:not(:disabled) {
					${active(getInteractiveItemStyles(theme, "active"))}
					${hover(getInteractiveItemStyles(theme, "hover"))} 
				&:focus {
						${getInteractiveItemStyles(theme, "focus")}
					}
				}

				${$readonly &&
				css`
					&[disabled] {
						${getItemStyles(theme, item.readonly, true)}
					}
				`}
				${$disabled &&
				css`
					&[disabled] {
						${getItemStyles(theme, item.disabled, true)}
					}
				`}
			`;
		}
	);

	export const StyledFieldWrapper = styled.div.withConfig({ displayName: "StyledFieldWrapper-sc-" })<{
		$block?: boolean;
	}>(({ $block }) => {
		if (!$block) {
			return css`
				display: inline-block;
			`;
		}

		return css`
			width: 100%;
			${StyledToggleItemBase}, ${StyledOptionButton} {
				align-items: stretch;
				flex-grow: 1;
				flex-shrink: 1;
			}
		`;
	});

	export const StyledToggleWrapper = styled.div.withConfig({ displayName: "StyledToggleWrapper-sc-" })<{
		$showOnlySelectedOption?: boolean;
		$block?: boolean;
		$showOverlay?: boolean;
	}>(({ $showOnlySelectedOption, $block, $showOverlay }) => {
		return css`
			box-sizing: border-box;
			display: flex;
			isolation: isolate;
			${$showOnlySelectedOption &&
			css`
				position: relative;
				outline: none;
				${!$block &&
				css`
					width: fit-content;
				`}
				${$block &&
				css`
					min-width: fit-content;
					${StyledOptionButtons} {
						width: 100%;
					}
				`}
				// fix bug of unexpected border color from selected-item while Overlay is on
				${$showOverlay &&
				css`
					&& ${StyledToggleItem} {
						background: transparent;
						border-color: transparent;
						&:before {
							border-color: transparent;
						}
					}
				`}
			`}
		`;
	});
}
