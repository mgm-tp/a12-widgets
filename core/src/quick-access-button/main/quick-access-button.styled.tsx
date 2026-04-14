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
import { getBaseButtonVariantStyles, StyledButton } from "../../button/main/button.styled.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { hover, active } from "../../theme/base/mixins/_interaction.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";
import { createBorder } from "../../theme/base/mixins/_borderEffects.js";

const resetBorderRadius = (right?: boolean) => {
	return right
		? css`
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			`
		: css`
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			`;
};

export const StyledQuickAccessButton = styled.div.withConfig({ displayName: "StyledQuickAccessButton-sc-" })<{
	$primary?: boolean;
	$secondary?: boolean;
	$invert?: boolean;
	$disabled?: boolean;
	$touch?: boolean;
	$isMobile?: boolean;
}>(({ theme, $primary, $secondary, $invert, $disabled, $touch, $isMobile }) => {
	const { quickAccessButton, button } = theme.components;

	return css`
		border-radius: ${quickAccessButton.borderRadius};
		border: none;
		box-shadow: ${$primary ? quickAccessButton.primary.boxShadow : quickAccessButton.secondary.boxShadow};
		display: flex;
		isolation: isolate;

		${StyledButton} {
			border-radius: ${quickAccessButton.borderRadius};
			box-shadow: none;
			position: relative;

			${$invert &&
			css`
				${$primary &&
				css`
					${getBaseButtonVariantStyles(button.invertPrimary, true)}
				`}
				${$secondary &&
				css`
					background: ${button.invertSecondary.background};
					border: none;
					box-shadow: ${button.invertSecondary.boxShadow};
					color: ${button.invertSecondary.color};
					${createPseudoElement(
						":before",
						css`
							border: ${button.invertSecondary.border};
							border-radius: ${button.invertSecondary.borderRadius};
						`
					)}
					${getBaseButtonVariantStyles(button.invertSecondary, true, true)}
					&:not(:disabled):focus {
						border: none;
						outline: none;
					}
					&:not(:disabled):active,
					&:not(:disabled):hover {
						border: none;
					}
				`}
			`}

			${!$secondary &&
			$invert &&
			css`
				background-color: ${!$secondary ? button.invertPrimary.background : button.invertSecondary.background};
				color: inherit;
			`}

			${$secondary &&
			css`
				position: relative;

				&:before {
					border-radius: ${quickAccessButton.borderRadius};
				}

				&:focus {
					${button.secondary.interaction.focus.customBorder
						? css`
								${createBorder(button.secondary.interaction.focus.customBorder)}
							`
						: $invert && button.invertSecondary.interaction.focus.customBorder
							? css`
									${createBorder(button.invertSecondary.interaction.focus.customBorder)}
								`
							: css`
									&:before {
										bottom: 0;
										border: ${$invert
											? button.invertSecondary.interaction.focus.border
											: button.secondary.interaction.focus.border};
										left: 0;
										right: -${quickAccessButton.divider.width};
										position: absolute;
										top: 0;
										z-index: 1;
									}
								`}
					&:before {
						outline: ${$invert
							? button.invertSecondary.interaction.focus.outline
							: button.secondary.interaction.focus.outline};
					}
				}

				${!$invert &&
				css`
					&:focus + ${StyledQuickAccessButtonDivider}, &:focus:after {
						background-color: ${button.secondary.interaction.focus.customBorder
							? "none"
							: quickAccessButton.divider.secondaryFocusBG};
					}

					&:not(:disabled) {
						${hover(css`
							& + ${StyledQuickAccessButtonDivider}, &:after {
								background-color: ${quickAccessButton.divider.secondaryHoverBG};
							}
						`)}
					}
				`}
			`}
		}

		// Main Action Button
		> ${StyledButton} {
			margin: 0; //Fix bug on safari
			min-width: ${$touch ? quickAccessButton.touch.minWidth : quickAccessButton.minWidth};
			${resetBorderRadius(true)}
			${$secondary &&
			css`
				border: none;

				${createPseudoElement(
					":before",
					css`
						border: ${$invert ? button.invertSecondary.border : quickAccessButton.secondary.border};
					`
				)}

				&,
				&:before {
					border-right: none !important; // Use divider as border-right
				}

				&:before,
				&:focus:before {
					${resetBorderRadius(true)}
				}

				${hover(css`
					border: none;
				`)}

				&:not(:disabled):focus {
					outline: none;
					border: none;
				}

				${!$invert &&
				css`
					&:not(:disabled) {
						${hover(css`
							&:before {
								border: ${button.secondary.interaction.hover.border};
							}
						`)}

						${$isMobile &&
						css`
							${active(css`
								border: none;

								&:before {
									border: ${button.secondary.interaction.focus.border};
									border-right: ${button.secondary.interaction.focus.border} !important;
								}
							`)}

							${hover(css`
								&:before {
									border: none;
								}
							`)}
						`}

						${active(css`
							& + ${StyledQuickAccessButtonDivider}, &:after {
								background-color: ${$isMobile
									? quickAccessButton.divider.secondaryBG
									: quickAccessButton.divider.secondaryActiveBG};
							}
						`)}
					}
				`}
			`}
		}

		${$disabled &&
		css`
			box-shadow: none;
		`}
	`;
});

export const StyledQuickAccessButtonTriggerElement = styled(Button).withConfig({
	displayName: "StyledQuickAccessButtonTriggerElement-sc-"
})<{
	$open?: boolean;
	$touch?: boolean;
	$isMobile?: boolean;
}>(({ theme, $open, secondary, invert, $touch, disabled, $isMobile }) => {
	const { quickAccessButton } = theme.components;

	return css`
		font-size: ${quickAccessButton.buttonIconFontSize};

		${StyledIconWrapper} {
			font-size: inherit;
		}

		&& {
			${resetBorderRadius()}
			${$open &&
			css`
				&,
				&:before {
					border-radius: 0;
				}
			`}
		}

		${$touch &&
		css`
			min-width: ${quickAccessButton.touch.triggerMinWidth};
		`}
		${secondary &&
		css`
			${disabled &&
			css`
				background-color: ${quickAccessButton.secondary.disabled.background};
			`}
			&,
				&:before {
				border-left: none !important; // Use divider as border-left
			}
			&& {
				&:focus:before,
				&:before {
					${resetBorderRadius()};
				}
			}
			${!invert &&
			css`
				&:after {
					bottom: 0;
					content: "";
					left: 0;
					position: absolute;
					top: 0;
					width: ${quickAccessButton.divider.width};
				}

				&& {
					&:focus:before {
						outline: none;
					}
				}

				${$isMobile &&
				css`
					&:not(:disabled) {
						${active(css`
							border: none;
						`)}
					}
				`}
			`}
			${invert &&
			css`
				&&&:before {
					left: -${quickAccessButton.divider.width};
					right: 0;
				}
			`}
		`}
	`;
});

export const StyledQuickAccessButtonDivider = styled.div.withConfig({
	displayName: "StyledQuickAccessButtonDivider-sc-"
})<{
	$primary?: boolean;
	$secondary?: boolean;
	$destructive?: boolean;
	$disabled?: boolean;
	$invert?: boolean;
}>(({ theme, $primary, $destructive, $secondary, $disabled, $invert }) => {
	const { divider } = theme.components.quickAccessButton;

	return css`
		align-items: stretch;
		width: ${divider.width};

		${$primary &&
		css`
			background-color: ${$invert ? divider.invertBG : divider.primaryBG};
			opacity: ${$invert ? divider.invertOpacity : divider.primaryOpacity};
		`}

		${!$secondary &&
		$destructive &&
		css`
			background-color: ${divider.primaryDestructiveBG};
		`}
		
		${$secondary &&
		css`
			background-color: ${$invert ? divider.invertSecondaryBG : divider.secondaryBG};
		`}
		
		${$disabled &&
		css`
			background-color: ${$secondary ? divider.secondaryBG : divider.disabledBG};
		`}
	`;
});
