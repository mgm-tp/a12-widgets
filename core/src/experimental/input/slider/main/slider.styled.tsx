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

import { active, hover } from "../../../../theme/base/mixins/_interaction.js";

const variantState = (leftFillBackground: string, leftTickBackground: string, thumbBackground: string) => {
	return css`
		cursor: pointer;
		${StyledSliderBarLeftFill} {
			background-color: ${leftFillBackground};
		}
		${StyledSliderLeftTick} {
			background-color: ${leftTickBackground};
		}
		${StyledSliderThumb} {
			background-color: ${thumbBackground};
		}
	`;
};

export const StyledSlider = styled.div.withConfig({ displayName: "StyledSlider-sc-" })<{
	$disabled?: boolean;
	$readonly?: boolean;
	$invalid?: boolean;
}>(({ $disabled, $invalid, $readonly, theme }) => {
	const { container, fill, thumb, tick } = theme.components.slider;

	return css`
		box-sizing: border-box;
		height: ${container.height};
		padding-left: ${container.horizontalPadding};
		padding-right: ${container.horizontalPadding};
		padding-top: ${container.paddingTop};
		position: relative;
		outline: none;
		width: 100%;

		${!$disabled && !$readonly
			? css`
					${active(variantState(fill.leftActiveBackground, tick.leftActiveBackground, thumb.activeBackground))}
					${hover(variantState(fill.hoverBackground, tick.hoverBackground, thumb.hoverBackground))}
						&:focus {
						${variantState(fill.leftFocusBackground, tick.leftFocusBackground, thumb.focusBackground)}
					}
				`
			: css`
					cursor: default;
				`}
		${$invalid &&
		css`
			margin-bottom: ${container.invalidMarginBottom};
		`}
	`;
});

export const StyledSliderWrapper = styled.div.withConfig({ displayName: "StyledSliderWrapper-sc-" })`
	display: flex;
	gap: ${(props) => props.theme.components.slider.wrapper.gap};
`;

export const StyledSliderBackdrop = styled.div.withConfig({ displayName: "StyledSliderBackdrop-sc-" })`
	cursor: pointer;
	height: 100%;
	left: 0;
	position: fixed;
	top: 0;
	width: 100%;
`;

export const StyledSliderThumb = styled.div.withConfig({ displayName: "StyledSliderThumb-sc-" })<{
	$disabled?: boolean;
	$invalid?: boolean;
	$readonly?: boolean;
	$thumbPosition: number;
}>(({ theme, $disabled, $invalid, $readonly, $thumbPosition }) => {
	const { thumb } = theme.components.slider;

	return css`
		background-color: ${thumb.thumbBackground};
		border-radius: ${thumb.borderRadius};
		height: ${thumb.size};
		position: relative;
		transform-origin: ${thumb.transformOrigin};
		transform: rotate(${thumb.transformRotate});
		width: ${thumb.size};
		left: ${$thumbPosition}%;
		${$disabled &&
		css`
			background-color: ${thumb.disabledBackground};
		`}
		${$invalid &&
		css`
			background-color: ${thumb.invalidBackground};
		`}
		${$readonly &&
		css`
			background-color: ${thumb.readonlyBackground};
		`}
	`;
});

export const StyledSliderLabel = styled.div.withConfig({ displayName: "StyledSliderLabel-sc-" })<{
	$disabled?: boolean;
	$position?: number;
}>(({ theme, $disabled, $position }) => {
	const { label } = theme.components.slider;

	return css`
		color: ${label.color};
		font-family: ${label.fontFamily};
		font-size: ${label.fontSize};
		font-weight: ${label.fontWeight};
		position: absolute;
		top: ${label.top};
		transform: translate(-50%, 0);
		left: ${$position}%;
		${$disabled &&
		css`
			color: ${label.disabledColor};
			cursor: not-allowed;
		`}
	`;
});

export const StyledSliderTick = styled.div.withConfig({ displayName: "StyledSliderTick-sc-" })<{
	$disabled?: boolean;
	$tickPosition?: number;
}>(({ theme, $disabled, $tickPosition }) => {
	const { tick } = theme.components.slider;

	return css`
		background-color: ${tick.background};
		border-radius: ${tick.borderRadius};
		height: ${tick.height};
		position: absolute;
		top: ${tick.top};
		transform: translate(-50%, 0);
		width: ${tick.width};
		left: ${$tickPosition}%;
		${$disabled &&
		css`
			background-color: ${tick.leftDisabledBackground};
		`}
	`;
});

export const StyledSliderLeftTick = styled(StyledSliderTick).withConfig({ displayName: "StyledSliderLeftTick-sc-" })`
	background-color: ${({ theme }) => theme.components.slider.tick.leftBackground};
`;

export const StyledSliderBar = styled.div.withConfig({ displayName: "StyledSliderBar-sc-" })`
	position: relative;
`;

export const StyledSliderBarFill = styled.div.withConfig({ displayName: "StyledSliderBarFill-sc-" })<{
	$disabled?: boolean;
	$thumbPosition: number;
}>(({ theme, $disabled, $thumbPosition }) => {
	const { fill } = theme.components.slider;

	return css`
		background-color: ${fill.background};
		bottom: 0;
		height: ${fill.height};
		position: absolute;
		right: 0;
		top: 0;
		left: ${$thumbPosition}%;
		width: ${100 - $thumbPosition}%;
		${$disabled &&
		css`
			background-color: ${fill.leftDisabledBackground};
		`}
	`;
});

export const StyledSliderBarLeftFill = styled(StyledSliderBarFill).withConfig({
	displayName: "StyledSliderBarLeftFill-sc-"
})(({ theme, $thumbPosition, $disabled }) => {
	const { fill } = theme.components.slider;

	return css`
		background-color: ${!$disabled && fill.leftBG};
		left: 0;
		width: ${$thumbPosition}%;
	`;
});
