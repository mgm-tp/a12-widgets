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
import { DataRoles } from "../../common/main/data-roles.js";
import { active, brightFocus, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { createPseudoElement } from "../../theme/base/mixins/_pseudo.js";

const interactiveWizardContentStyles = (state: "hover" | "focus" | "active") => css`
	${({ theme }) => {
		const { step } = theme.components.wizard;

		return css`
			${StyledWizardContent} {
				background-color: ${step.selected[state].background};
				color: ${step.selected[state].color};
				text-decoration: underline;
				${state === "focus" &&
				css`
					> ${StyledWizardContentContainerWrapper} ${StyledWizardContentContainer} {
						${brightFocus}
					}
				`}
			}
			${StyledWizardTip} {
				background-image:
					linear-gradient(
						to top right,
						transparent 0,
						transparent 48%,
						${step.selected[state].background} 52%,
						${step.selected[state].background} 100%
					),
					linear-gradient(
						to bottom right,
						transparent 0,
						transparent 48%,
						${step.selected[state].background} 52%,
						${step.selected[state].background} 100%
					),
					linear-gradient(to right, transparent 0, transparent 100%);
			}
		`;
	}}
`;

export const StyledWizardWrapper = styled.div.withConfig({ displayName: "StyledWizardWrapper-sc-" })<{
	$truncateText?: boolean;
	$responsive?: boolean;
}>(({ $responsive, $truncateText, theme }) => {
	const { wizard } = theme.components;

	return css`
		display: flex;
		min-height: ${wizard.minHeight};
		overflow: hidden;
		${$truncateText &&
		css`
			${StyledWizardContent} {
				overflow: hidden;
			}
			${StyledWizardText} {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		`}
		${$responsive &&
		!$truncateText &&
		css`
			${StyledWizardContent} {
				flex: 1 0 auto;
			}
		`}
	`;
});

export const StyledWizardNavigator = styled.button.withConfig({ displayName: "StyledWizardNavigator-sc-" })<{
	$navigationType: "previous" | "next";
}>(({ theme, $navigationType }) => {
	const { navigator, step } = theme.components.wizard;

	return css`
		align-items: center;
		background: ${navigator.background};
		border: none;
		color: ${navigator.color};
		display: flex;
		flex-shrink: 0;
		margin: 0;
		min-height: inherit;
		padding: ${navigator.padding};
		position: relative;
		&:before,
		&:after {
			bottom: 0;
			content: "";
			display: block;
			left: 0;
			top: 0;
			right: 0;
			position: absolute;
		}

		${$navigationType === "next" &&
		css`
			border-left: ${step.border};
		`}

		${$navigationType === "previous" &&
		css`
			+ ${StyledWizardStep} ${StyledWizardContent} {
				border-left: ${step.border};
			}
		`}
		
		${StyledIconWrapper} {
			color: inherit;
			font-size: ${navigator.fontSize};
		}

		&:not(:disabled) {
			cursor: pointer;

			${active(css`
				color: ${navigator.active.color};
				&:before {
					border: ${navigator.active.border};
				}
			`)}

			${hover(css`
				color: ${navigator.hover.color};
				&:before {
					border: ${navigator.hover.border};
				}
			`)} 
			
			&:focus {
				color: ${navigator.focus.color};
				outline: none;
				&:before {
					border: ${navigator.focus.border};
				}
				&:after {
					border: ${navigator.focus.outline};
				}
				${$navigationType === "next" &&
				css`
					border-left-color: transparent;
				`}
				${$navigationType === "previous" &&
				css`
					+ ${StyledWizardStep} ${StyledWizardContent} {
						border-left-color: transparent;
					}
				`}
			}
		}

		&:disabled {
			color: ${navigator.disabledColor};
		}
	`;
});

export const StyledWizardContentContainerWrapper = styled.span.withConfig({
	displayName: "StyledWizardContentContainerWrapper-sc-"
})<{ $selected?: boolean; $hasIcon?: boolean }>(({ theme, $selected, $hasIcon }) => {
	const { wizard } = theme.components;

	return css`
		display: block;
		min-height: ${wizard.minHeight};
		padding: ${$hasIcon ? `${wizard.content.wrapper.padding}` : `${wizard.content.wrapper.nonIconPadding}`};
		position: relative;
		${$selected &&
		css`
			${createPseudoElement(
				":after",
				css`
					border-bottom: 4px solid transparent;
				`
			)};
		`}
	`;
});

export const StyledWizardContent = styled.button.withConfig({ displayName: "StyledWizardContent-sc-" })<{
	$disabled?: boolean;
	$selected?: boolean;
	$nonInteractive?: boolean;
	$warning?: boolean;
	$error?: boolean;
	$finished?: boolean;
	$leftOut?: boolean;
}>(({ theme, $disabled, $selected, $nonInteractive, $error, $warning, $finished, $leftOut }) => {
	const { content, step } = theme.components.wizard;

	return css`
		background-color: ${content.background};
		border: none;
		color: ${$nonInteractive ? content.nonInteractiveColor : content.color};
		flex: 1;
		font-family: ${content.fontFamily};
		font-size: ${content.fontSize};
		font-weight: ${content.fontWeight};
		margin: 0;
		outline: none;
		padding: 0;

		${StyledIconWrapper} {
			font-size: ${content.iconFontSize};
			${($selected || (!$warning && !$finished && !$error)) &&
			css`
				color: inherit;
			`}
		}

		${$leftOut &&
		css`
			background-color: ${step.leftOut.background};
			flex: none;
		`}

		${$selected &&
		!$leftOut &&
		css`
			background-color: ${$finished ? step.selected.finishedBG : step.selected.background};
			color: ${step.selected.color};
			&&& {
				border-left: none;
			}
		`}
		
		${!$nonInteractive &&
		!$disabled &&
		css`
			cursor: pointer;
			${!$selected &&
			css`
				${active(css`
					color: ${step.activeColor};
					text-decoration: underline;
				`)}
				${hover(css`
					color: ${step.hover.color};
					text-decoration: underline;
				`)}
				&:focus {
					color: ${step.focusColor};
					text-decoration: underline;
					${StyledWizardContentContainer} {
						${darkFocus}
					}
				}
			`}
		`}
		
		${$disabled &&
		!$leftOut &&
		!$nonInteractive &&
		css`
			color: ${step.disabledColor};
			${StyledIconWrapper} {
				color: inherit;
			}
		`}
	`;
});

export const StyledWizardContentContainer = styled.span.withConfig({ displayName: "StyledWizardContentContainer-sc-" })(
	({ theme }) => {
		const { content } = theme.components.wizard;

		return css`
			align-items: center;
			display: flex;
			justify-content: center;
			gap: ${content.gap};
			margin: ${content.margin};
			padding: ${content.padding};
		`;
	}
);

export const StyledWizardText = styled.span.withConfig({ displayName: "StyledWizardText-sc-" })`
	display: block;
	text-align: left;
`;

export const StyledWizardTip = styled.div.withConfig({ displayName: "StyledWizardTip-sc-" })<{
	$leftOut?: boolean;
	$selected?: boolean;
	$finished?: boolean;
}>(({ theme, $leftOut, $selected, $finished }) => {
	const { tip, content, step } = theme.components.wizard;

	return css`
		background-image:
			linear-gradient(
				to top right,
				transparent 0,
				transparent 46%,
				${tip.color} 48%,
				${tip.color} 50%,
				${$leftOut ? step.leftOut.background : content.background} 54%,
				${$leftOut ? step.leftOut.background : content.background} 100%
			),
			linear-gradient(
				to bottom right,
				transparent 0,
				transparent 46%,
				${tip.color} 48%,
				${tip.color} 50%,
				${$leftOut ? step.leftOut.background : content.background} 54%,
				${$leftOut ? step.leftOut.background : content.background} 100%
			),
			linear-gradient(to right, transparent 0, transparent 90%, ${tip.color} 93%, ${tip.color} 100%);

		${$selected &&
		css`
			${!$leftOut &&
			!$finished &&
			css`
				background-image:
					linear-gradient(
						to top right,
						transparent 0,
						transparent 48%,
						${step.selected.background} 52%,
						${step.selected.background} 100%
					),
					linear-gradient(
						to bottom right,
						transparent 0,
						transparent 48%,
						${step.selected.background} 52%,
						${step.selected.background} 100%
					),
					linear-gradient(to right, transparent 0, transparent 100%);
			`}

			${$finished &&
			css`
				background-image:
					linear-gradient(
						to top right,
						transparent 0,
						transparent 48%,
						${step.selected.finishedBG} 52%,
						${step.selected.finishedBG} 100%
					),
					linear-gradient(
						to bottom right,
						transparent 0,
						transparent 48%,
						${step.selected.finishedBG} 52%,
						${step.selected.finishedBG} 100%
					),
					linear-gradient(to right, transparent 0, transparent 100%);
			`}
		`}
	`;
});

export const StyledWizardStep = styled.div.withConfig({ displayName: "StyledWizardStep-sc-" })<{
	$nonInteractive?: boolean;
	$selected?: boolean;
	$focused?: boolean;
	$leftOut?: boolean;
}>(({ theme, $nonInteractive, $selected, $focused, $leftOut }) => {
	const { step, tip, content, navigator } = theme.components.wizard;

	return css`
		border: none;
		display: flex;
		flex: 1;
		margin: ${step.margin};
		min-height: inherit;
		min-width: ${step.minWidth};
		padding: 0;

		${$leftOut &&
		css`
			min-width: 0;
			flex: none;
		`}
		+ [data-role="${DataRoles.Wizard.Step}"] ${StyledWizardTip} {
			background-position:
				0 0,
				100% 100%,
				0 0;
			background-size:
				100% 50%,
				100% 50%,
				100% 100%;
			background-repeat: no-repeat;
			min-width: ${tip.width};
			width: ${tip.width};
		}

		${$selected &&
		!$leftOut &&
		css`
			+ [data-role="${DataRoles.Wizard.NavigateButton}"] {
				border-color: ${navigator.background};
			}
			+ [data-role="${DataRoles.Wizard.Step}"] ${StyledWizardTip} {
				background-image:
					linear-gradient(
						to top right,
						transparent 0,
						transparent 48%,
						${content.background} 52%,
						${content.background} 100%
					),
					linear-gradient(
						to bottom right,
						transparent 0,
						transparent 48%,
						${content.background} 52%,
						${content.background} 100%
					),
					linear-gradient(to right, transparent 0, transparent 100%);
			}

			${!$nonInteractive &&
			css`
				${active(css`
					${interactiveWizardContentStyles("active")}
				`)}
				${hover(css`
					${interactiveWizardContentStyles("hover")}
				`)}
				${$focused &&
				css`
					${interactiveWizardContentStyles("focus")}
				`}
			`}
		`}
	`;
});
