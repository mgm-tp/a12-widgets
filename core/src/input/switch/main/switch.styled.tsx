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
import { setLightness } from "polished";

import { active, darkFocus, hover } from "../../../theme/base/mixins/_interaction.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";

export const StyledSwitchControl = styled.div.withConfig({ displayName: "StyledSwitchControl-sc-" })(({ theme }) => {
	return css`
		align-items: center;
		display: flex;
		height: ${theme.applicationStyles.input.height};
	`;
});

export const StyledSwitchThumb = styled.span.withConfig({ displayName: "StyledSwitchThumb-sc-" })(({ theme }) => {
	const { thumb, transitionTiming } = theme.components.switch;

	return css`
		background-color: ${thumb.uncheckedBackground};
		border: ${thumb.border};
		border-radius: 50%;
		box-sizing: border-box;
		height: ${thumb.size};
		position: relative;
		transition-duration: ${transitionTiming};
		transition-property: height, transform, margin-left, margin-right, width;
		transition-timing-function: ease-out;
		width: ${thumb.size};
	`;
});

export const StyledSwitchThumbIcon = styled.span.withConfig({ displayName: "StyledSwitchThumbIcon-sc-" })(
	({ theme }) => {
		const { thumb } = theme.components.switch;

		return css`
			display: flex;
			height: 100%;
			justify-content: center;
			width: 100%;
			${StyledIconWrapper} {
				align-self: center;
				color: ${thumb.uncheckedBackground};
				font-size: ${thumb.iconSize};
			}
		`;
	}
);

export const StyledSwitchTrack = styled.span.withConfig({ displayName: "StyledSwitchTrack-sc-" })(({ theme }) => {
	const { track, thumb } = theme.components.switch;

	return css`
		background-color: ${track.uncheckedBackground};
		border: ${track.border};
		border-radius: calc(${track.width} / 2);
		box-sizing: border-box;
		height: ${track.height};
		position: absolute;
		top: calc((${thumb.size} - ${track.height}) / 2);
		width: 100%;
	`;
});

export const StyledSwitchInput = styled.input.withConfig({ displayName: "StyledSwitchInput-sc-" })`
	height: 100%;
	left: 0;
	margin: 0;
	position: absolute;
	opacity: 0;
	top: 0;
	width: 100%;

	&:not(:disabled) {
		cursor: pointer;
	}
`;

export const StyledSwitchOption = styled.span.withConfig({ displayName: "StyledSwitchOption-sc-" })(({ theme }) => {
	const { optionLabel } = theme.components.switch;

	return css`
		color: ${optionLabel.color};
		font-family: ${optionLabel.fontFamily};
		font-size: ${optionLabel.fontSize};
		font-weight: ${optionLabel.weight};

		&:not(:empty) {
			&:first-of-type {
				margin: ${optionLabel.uncheckedMargin};
			}

			&:last-of-type {
				margin: ${optionLabel.checkedMargin};
			}
		}
	`;
});

const switchStates = (state: "on" | "off", color: string, background?: string) => {
	const thumbColor = state === "on" ? color : background;

	return css`
		${StyledSwitchThumb} {
			background-color: ${thumbColor};
			border-width: ${state === "on" && 0};
			border-color: ${state === "off" && color};
			${state === "on" &&
			css`
				outline: 1px solid transparent;
			`}
			${StyledSwitchThumbIcon} ${StyledIconWrapper} {
				color: ${thumbColor};
			}
		}

		${StyledSwitchTrack} {
			background-color: ${background ?? (state === "on" && setLightness(0.87, color))};
		}
	`;
};

export const StyledSwitchInteractive = styled.span.withConfig({ displayName: "StyledSwitchInteractive-sc-" })<{
	$warning?: boolean;
	$error?: boolean;
	$readonly?: boolean;
	$disabled?: boolean;
	$checked?: boolean;
	$focused?: boolean;
}>(({ theme, $warning, $error, $readonly, $disabled, $checked, $focused }) => {
	const { thumb, track } = theme.components.switch;
	const currentState = $checked ? "on" : "off";

	return css`
		align-items: center;
		display: inline-flex;
		height: ${thumb.size};
		position: relative;
		width: ${track.width};

		${$checked &&
		css`
			${switchStates("on", thumb.color)}
			${StyledSwitchThumb} {
				transform: translate(calc(${track.width} - ${thumb.size}));
			}
		`}

		${!$disabled &&
		!$readonly &&
		css`
			${$warning && switchStates(currentState, thumb.warningColor)}
			${$error && switchStates(currentState, thumb.errorColor)}
			${active(css`
				${switchStates("on", thumb.active.color)}
				${StyledSwitchThumb} {
					height: ${thumb.active.size};
					transform: ${$checked ? `translate(calc(${track.width} - ${thumb.size} + 1px))` : "translate(-1px)"};
					width: ${thumb.active.size};
				}
			`)}
			
			${hover(css`
				${switchStates("on", thumb.hover.color)}
				${StyledSwitchThumb} {
					height: ${thumb.hover.size};
					transform: ${$checked ? `translate(calc(${track.width} - ${thumb.size} + 1px))` : "translate(-1px)"};
					width: ${thumb.hover.size};
				}
			`)}
			
			${$focused &&
			css`
				${darkFocus}
				${switchStates("on", thumb.focus.color)}
          		${StyledSwitchThumb} {
					height: ${thumb.focus.size};
					transform: ${$checked ? `translate(calc(${track.width} - ${thumb.size} + 1px))` : "translate(-1px)"};
					width: ${thumb.focus.size};
				}
			`}
		`}
		
		${$readonly &&
		css`
			${StyledSwitchThumb} {
				border-width: ${thumb.readonly.borderWidth};
			}

			${StyledSwitchTrack} {
				border-color: ${track.readonly.borderColor};
			}

			${switchStates(currentState, thumb.readonly.color, track.readonly.background)}
		`}
		
		${$disabled &&
		css`
			${StyledSwitchThumb} {
				border-width: ${thumb.disabled.borderWidth};
			}

			${StyledSwitchTrack} {
				border-color: ${track.disabled.borderColor};
			}

			${switchStates(currentState, thumb.disabled.color, track.disabled.background)}
		`}
	`;
});
