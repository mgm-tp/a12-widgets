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
import type { ReactElement } from "react";

import {
	active as activeSelector,
	activeAndHover,
	hover as hoverSelector
} from "../../theme/base/mixins/_interaction.js";
import type { IconProps } from "../../icon/main/icon.api.js";
import { StyledIconWrapper, StyledVariantIconWrapper } from "../../icon/main/icon.view.js";
import { StyledProgressBar } from "../../progress-bar/main/progress-bar.view.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";
import { StyledTooltipWrapper } from "../../tooltip/main/tooltip.styled.js";
import { StyledTinyBadgeWrapper } from "../../badge/main/badge.view.js";
import {
	StyledLoadingCircle,
	StyledLoadingCircleLayer,
	StyledLoadingCircleSpinner,
	StyledLoadingInnerOverlay,
	StyledLoadingOuterOverlay
} from "../../progress-indicator/main/progress-indicator.styled.js";
import { addPrefix } from "../../common/main/utils.js";
import { provider } from "../../common/main/device-detector.js";
import { fadeIn } from "../../theme/base/mixins/_animation.js";
import type { DefaultThemeType } from "../../theme/schema.js";
import { commonButtonConfigs } from "../../theme/default/config/components/button.config.js";
import type { CustomBorder } from "../../theme/base/mixins/_borderEffects.js";
import { createBorder } from "../../theme/base/mixins/_borderEffects.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ButtonProps } from "./button.api.js";

const disabledStyles = (params: { boxShadow: string; background: string; color: string; borderColor?: string }) => {
	const { boxShadow, background, color, borderColor } = params;

	return css`
		background: ${background};
		border-color: ${borderColor};
		box-shadow: ${boxShadow};
		color: ${color};
		cursor: default;

		// Remove the dot outline from disabled buttons on FireFox when focused by tabbing.
		&&& {
			&:-moz-focusring {
				outline: none;
			}
		}
	`;
};

const transparentOutlineOnHover = css`
	${hoverSelector(css`
		outline: 1px solid transparent;
	`)}
`;

const interactionStyles = (
	params: {
		background: string;
		border: string;
		borderColor?: string;
		borderRadius?: string | number;
		color: string;
		customBorder?: CustomBorder;
		fontStyle?: string;
		textDecoration?: string;
	},
	isInvert = false,
	isSecondary = false
) => css`
	background-color: ${params.background};
	box-shadow: none;
	border-radius: ${params.borderRadius};
	color: ${params.color};
	text-decoration: ${params.textDecoration};
	${!isSecondary &&
	!isInvert &&
	css`
		${createBorder(params.customBorder ?? params.border)};
		border-color: ${params.borderColor};
	`}

	${isInvert &&
	css`
		${!isSecondary &&
		css`
			${createBorder(params.customBorder ?? params.border)};
			border-radius: ${params.borderRadius};
			border-color: ${params.borderColor};
		`}
		${isSecondary &&
		css`
			${params.customBorder
				? css`
						${createBorder(params.customBorder)};
					`
				: css`
						&:before {
							border: ${params.border};
							border-radius: ${params.borderRadius};
							border-color: ${params.borderColor};
						}
					`}
		`}
	`}
`;

export const getBaseButtonVariantStyles = (
	params: {
		background: string;
		color: string;
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration?: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline?: string;
				textDecoration?: string;
			};
			hover?: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration?: string;
			};
		};
	},
	isInvert = false,
	isSecondary = false
) => {
	const { interaction, background, color } = params;
	const { active, hover, focus } = interaction;

	return css`
		background: ${background};
		color: ${color};
		&:not(:disabled) {
			&:focus {
				outline: ${focus.outline};
				${interactionStyles(focus, isInvert, isSecondary)};
			}
			${activeSelector(interactionStyles(active, isInvert, isSecondary))};
			${hover && hoverSelector(interactionStyles(hover, isInvert, isSecondary))};
		}
	`;
};

/**@internal */
export const baseStyles = (params: {
	type:
		| "primary"
		| "secondary"
		| "vertical"
		| "verticalPrimary"
		| "verticalSecondary"
		| "iconButton"
		| "primaryIcon"
		| "secondaryIcon";
	theme: DefaultThemeType;
	disabled?: boolean;
	active?: boolean;
	destructive?: boolean;
}) => {
	const { type, theme, disabled, active, destructive } = params;
	const { button } = theme.components;

	return css`
		${disabled
			? disabledStyles(button[type].disabled)
			: css`
					${getBaseButtonVariantStyles(button[type])}
					${active && getBaseButtonVariantStyles(button[type].activated)}
					${destructive && getBaseButtonVariantStyles(button[type].destructive)}
				`}
	`;
};

export const StyledButton = styled.button.withConfig({ displayName: "StyledButton-sc-" })<
	ButtonProps & { $hasLabel?: boolean; $loading?: boolean; $disabled?: boolean; $hasProgressBar?: boolean }
>(
	({
		theme,
		primary,
		icon,
		$hasLabel,
		vertical,
		secondary,
		block,
		destructive,
		active,
		$disabled,
		invert,
		$loading,
		$hasProgressBar
	}) => {
		const { button, tooltip, quickAccessButton } = theme.components;
		const iconButton = !$hasLabel && !!icon;
		const isSecondary = secondary || (!iconButton && !primary && !vertical);
		const iconVariant = (icon as ReactElement<IconProps>)?.props?.variant;

		return css`
			align-items: center;
			border: ${button.border};
			cursor: pointer;
			display: inline-flex;
			justify-content: center;
			font-family: ${button.fontFamily};
			font-size: ${button.fontSize};
			font-weight: ${button.fontWeight};
			gap: ${!vertical && "4px"};
			outline: none;
			position: relative;
			text-transform: ${button.textTransform};
			min-height: ${button.minHeight};
			vertical-align: middle;

			${StyledIconWrapper} {
				// Prevent text selection on icon when dragging the cursor.
				user-select: none;
				-webkit-user-select: none;
			}

			& ${!iconVariant && StyledIconWrapper} {
				color: inherit;
			}

			${$hasProgressBar &&
			css`
				${StyledProgressBar} {
					inset: ${isSecondary && invert ? 0 : `-${button.borderWidth}`};
				}
				> * {
					isolation: isolate;
				}
			`}

			// styles for normal buttons
			${!iconButton &&
			!vertical &&
			css`
				${primary &&
				css`
					border-radius: ${button.primary.borderRadius};
					box-shadow: ${button.primary.boxShadow};
					padding: ${button.primary.padding};

					${!$disabled &&
					css`
						${baseStyles({ type: "primary", theme, active, destructive })}

						// styles for primary invert buttons
						${invert &&
						css`
							border-width: ${button.invertPrimary.borderWidth};
							box-shadow: ${button.invertPrimary.boxShadow};
							${getBaseButtonVariantStyles(button.invertPrimary, true)}
						`}
					  
					  	${!$hasProgressBar && transparentOutlineOnHover}
					`}

					${$disabled && disabledStyles(invert ? button.invertPrimary.disabled : button.primary.disabled)}
				`}
				${isSecondary &&
				css`
					border: ${button.secondary.border};
					border-radius: ${button.secondary.borderRadius};
					padding: ${button.secondary.padding};
					position: relative;

					${!$disabled &&
					css`
						${!invert && baseStyles({ type: "secondary", theme, active, destructive })}

						// styles for secondary invert buttons
						${invert &&
						css`
							border: none;
							box-shadow: ${button.invertSecondary.boxShadow};
							${createPseudoElement(
								":before",
								css`
									border: ${button.invertSecondary.border};
									border-radius: ${button.invertSecondary.borderRadius};
								`
							)}
							${getBaseButtonVariantStyles(button.invertSecondary, true, true)}
						`}

                        ${!$hasProgressBar && !invert && transparentOutlineOnHover}
					`}

					${$disabled && disabledStyles(invert ? button.invertSecondary.disabled : button.secondary.disabled)}
				`}
			`}

			// styles for icon buttons
			${iconButton &&
			css`
				border-radius: ${button.iconButton.borderRadius};
				flex-shrink: 0;
				font-size: ${button.iconButton.fontSize};
				height: ${button.iconButton.size};
				min-height: ${button.iconButton.minHeight};
				padding: 0;
				width: ${button.iconButton.size};

				${StyledIconWrapper} {
					font-size: inherit;
				}

				${!invert && baseStyles({ type: "iconButton", theme, active, destructive, disabled: $disabled })}

				${!$disabled &&
				css`
					${transparentOutlineOnHover}

					${StyledTooltipWrapper} && {
						font-size: ${tooltip.iconFontSize};
						height: fit-content;
						min-height: 0;
						padding: 0;
						width: fit-content;
						${!invert &&
						css`
							&:not(:active):not(:hover):not(:focus) {
								color: inherit;
								${StyledIconWrapper}:not(${StyledVariantIconWrapper}) {
									color: inherit;
								}
							}
						`}

						${invert &&
						css`
							${StyledIconWrapper} {
								color: ${tooltip.darkColor};
							}
						`}
						${activeAndHover(css`
							${StyledIconWrapper} {
								color: inherit;
							}
						`)}
						&:focus {
							${StyledIconWrapper} {
								color: inherit;
							}
						}
					}
				`}
				
				${!invert &&
				css`
					${primary &&
					css`
						border-radius: ${button.primaryIcon.borderRadius};
						box-shadow: ${button.primaryIcon.boxShadow};

						${baseStyles({ type: "primaryIcon", theme, active, destructive, disabled: $disabled })}
					`}
					${secondary &&
					css`
						border: ${button.secondaryIcon.border};
						border-radius: ${button.secondaryIcon.borderRadius};
						box-shadow: ${button.secondaryIcon.boxShadow};

						${baseStyles({ type: "secondaryIcon", theme, active, destructive, disabled: $disabled })}
					`}
				`}
				
				${invert &&
				css`
					${!$disabled &&
					css`
						&:not([data-role^="quick-access-button"]) {
							border-radius: ${button.invertIcon.borderRadius};
							${!primary && !secondary && getBaseButtonVariantStyles(button.invertIcon, true)}

							${primary && getBaseButtonVariantStyles(button.invertPrimary, true)}
							
							${secondary &&
							css`
								border: none;
								${!active &&
								createPseudoElement(
									":before",
									css`
										border: ${button.invertSecondary.border};
										border-radius: ${button.invertIcon.borderRadius};
									`
								)}
								${getBaseButtonVariantStyles(button.invertSecondary, true, true)}
							`}
							
							${active &&
							css`
								border-radius: ${button.invertIcon.activated.borderRadius};
								${getBaseButtonVariantStyles(button.invertIcon.activated, true)}
							`}
						}
					`}
					${$disabled &&
					css`
						${!primary && !secondary && disabledStyles(button.invertIcon.disabled)}
						${primary && disabledStyles(button.invertPrimary.disabled)}
						${secondary && disabledStyles(button.invertSecondary.disabled)}
					`}
				`}
				
				${!primary &&
				!secondary &&
				css`
					${StyledTinyBadgeWrapper} {
						top: 0;
						right: 0;
					}
				`}
			`}

			// styles for vertical buttons
			${vertical &&
			css`
				align-self: stretch;
				border-radius: ${button.vertical.borderRadius};
				font-size: ${button.vertical.fontSize};
				flex-direction: column;
				justify-content: flex-start;
				line-height: 1;
				min-height: ${button.vertical.minHeight};
				padding: ${button.vertical.padding};
				text-transform: none;
				${StyledIconWrapper} {
					font-size: ${button.vertical.iconFontSize};
				}

				${baseStyles({ type: "vertical", theme, active, destructive, disabled: $disabled })}

				${!$disabled && transparentOutlineOnHover}
				
				${primary &&
				css`
					${baseStyles({ type: "verticalPrimary", theme, active, destructive, disabled: $disabled })}

					${!$disabled &&
					css`
						box-shadow: ${button.verticalPrimary.boxShadow};
					`}
				`}
				${secondary &&
				css`
					border: ${button.verticalSecondary.border};
					box-shadow: ${button.verticalSecondary.boxShadow};

					${baseStyles({ type: "verticalSecondary", theme, active, destructive, disabled: $disabled })}
				`}
			`}
			
			${block &&
			css`
				height: 100%;
				width: 100%;
			`}
			
			${$disabled &&
			css`
				&& ${StyledIconWrapper} {
					color: inherit;
				}
				${StyledTooltipWrapper} & ${StyledIconWrapper} {
					font-size: ${tooltip.iconFontSize};
				}
				${StyledTooltipWrapper} && {
					color: ${button.iconButton.disabled.color};
					width: auto;
					height: auto;
					min-height: 0;
				}
				${secondary &&
				css`
					&[data-role="${DataRoles.QuickAccessButton.MainAction}"] {
						background-color: ${quickAccessButton.secondary.disabled.background};
					}
				`}
			`}

			${$loading &&
			css`
				box-shadow: none;
				overflow: visible !important; //make button's border not overlap the overlay
				pointer-events: none;
				${iconButton &&
				css`
					${StyledIconWrapper} {
						opacity: 0;
					}
				`}
				${StyledLoadingOuterOverlay} {
					animation-name: ${!provider.isTablet() ? fadeIn(0.9) : "none"}; // Fix bug flickering on ipad
					background-color: ${button.loading.background};
					border-radius: inherit;
					height: auto;
					inset: ${isSecondary && invert ? 0 : `-${button.borderWidth}`} !important; //make overlay shows inside button
					opacity: 0.9;
				}
				${StyledLoadingInnerOverlay} {
					padding: 0;
					outline: none;
				}
				${StyledLoadingCircle} {
					width: ${button.loading.circle.size};
					height: ${button.loading.circle.size};
				}
				${StyledLoadingCircleLayer} {
					border-color: ${destructive ? button.loading.circle.color.destructive : button.loading.circle.color.default};
				}
				${StyledLoadingCircleSpinner} {
					border-width: ${button.loading.circle.borderWidth};
				}
			`}

			/* Style only for move Up/Down button */
			.${addPrefix("h_inlineBlock")}.${addPrefix("h_middleAlign")} && {
				display: block;
				height: auto;
				min-height: 0;
				> ${StyledIconWrapper} {
					display: block;
				}
			}
		`;
	}
);

export const variantButtonStyles = (params: {
	theme: DefaultThemeType;
	customColor?: string;
	isWarning?: boolean;
	roundedIconButton?: boolean;
}) => {
	const { roundedIconButton = true, theme, customColor, isWarning } = params;
	const { variant } = theme.colors;
	const { button } = theme.components;
	const desiredColor = customColor || variant.text.warning;

	const pseudoBeforeState = css`
		&:hover,
		&:active,
		&:focus {
			&:before {
				border-color: ${desiredColor};
			}
		}
	`;

	return css`
		${StyledButton} {
			${roundedIconButton &&
			css`
				&[data-type="icon"] {
					border-radius: ${button.iconButton.borderRadius};
				}
			`}

			${isWarning &&
			css`
				color: ${desiredColor};
				&:not(:disabled) {
					${activeAndHover(css`
						border-color: ${desiredColor};
						color: ${desiredColor};
					`)}
					&:focus {
						border-color: ${desiredColor};
						color: ${desiredColor};
						outline-color: ${desiredColor};
					}
				}

				&[data-variant-type="primary"] {
					background-color: ${desiredColor};
					color: ${variant.warningColor};

					${activeAndHover(css`
						background-color: ${commonButtonConfigs(theme).buttonInvertedBG};
					`)}
					&:focus {
						background-color: ${commonButtonConfigs(theme).buttonInvertedBG};
					}
					${pseudoBeforeState}
				}

				&[data-variant-type="secondary"] {
					&:before {
						border-color: ${desiredColor};
					}
					${pseudoBeforeState}
				}
			`}
		}
	`;
};
