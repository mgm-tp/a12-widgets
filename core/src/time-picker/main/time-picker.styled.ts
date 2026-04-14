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
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { TextField } from "../../input/text-field/text-field.view.js";
import { BufferedInput, HTMLInputAdapter } from "../../input/buffered/main/buffered.view.js";
import { createBoxShadow } from "../../theme/base/mixins/_borderEffects.js";

const TimeInput = BufferedInput(HTMLInputAdapter(TextField));

export const StyledTimeInput = styled(TimeInput)(({ theme }) => {
	const { input } = theme.components.timePicker;

	return css`
		${input?.focus?.customBorder &&
		css`
			[data-isfocused="true"] {
				${createBoxShadow(input.focus.customBorder)}
			}
		`}
	`;
});

export const StyledTimePickerWrapper = styled.div.withConfig({ displayName: "StyledTimePickerWrapper-sc-" })`
	width: 100%;
`;

export const StyledTimePickerDialog = styled.div.withConfig({ displayName: "StyledTimePickerDialog-sc-" })(
	({ theme }) => {
		const { dialog } = theme.components.timePicker;

		return css`
			-webkit-tap-highlight-color: transparent;
			background-color: ${dialog.background};
			border-radius: ${dialog.borderRadius};
			box-shadow: ${dialog.boxShadow};
			margin: 0 auto;
			outline: 1px solid transparent;
			overflow: auto;
			width: auto;
		`;
	}
);

export const StyledTimePickerHeader = styled.div.withConfig({ displayName: "StyledTimePickerHeader-sc-" })(
	({ theme }) => {
		const { header } = theme.components.timePicker;

		return css`
			align-items: center;
			background-color: ${header.background};
			border-radius: ${header.borderRadius};
			display: flex;
			flex-direction: row-reverse;
			min-height: ${header.minHeight};
			outline: 1px solid transparent;
			padding: ${header.padding};

			${StyledIconWrapper} {
				font-size: ${header.iconFontSize};
			}
		`;
	}
);

export const StyledTimePickerText = styled.div.withConfig({ displayName: "StyledTimePickerText-sc-" })(({ theme }) => {
	const { text } = theme.components.timePicker;

	return css`
		color: ${text.color};
		flex: 1;
		font-size: ${text.fontSize};
		font-weight: ${text.fontWeight};
		line-height: normal;
		text-align: center;
	`;
});

export const StyledTimePickerActions = styled.div.withConfig({ displayName: "StyledTimePickerActions-sc-" })`
	& + ${StyledTimePickerText} {
		text-align: left;
	}
`;

export const StyledTimePickerInput = styled.div.withConfig({ displayName: "StyledTimePickerInput-sc-" })`
	align-items: center;
	display: flex;
	flex-direction: column;
`;

export const StyledTimePickerClockNum = styled.span.withConfig({ displayName: "StyledTimePickerClockNum-sc-" })(
	({ theme }) => {
		const { num } = theme.components.timePicker.clock;

		return css`
			align-items: center;
			box-sizing: border-box;
			cursor: pointer;
			display: flex;
			font-size: ${num.fontSize};
			height: ${num.size};
			justify-content: center;
			line-height: 1;
			left: calc(50% - ${num.size} * 0.5);
			padding: ${num.padding};
			pointer-events: none;
			position: absolute;
			text-align: center;
			top: calc(50% - ${num.size} * 0.5);
			user-select: none;
			width: ${num.size};
		`;
	}
);

export const StyledTimePickerClock = styled.div.withConfig({ displayName: "StyledTimePickerClock-sc-" })(
	({ theme }) => {
		const { clock } = theme.components.timePicker;

		return css`
			border-radius: 50%;
			color: ${clock.color};
			height: ${clock.size};
			position: relative;
			width: ${clock.size};
		`;
	}
);

export const StyledTimePickerClockPointer = styled.div.withConfig({ displayName: "StyledTimePickerClockPointer-sc-" })<{
	hasSmallPointer?: boolean;
	initialPointer?: boolean;
}>(({ theme, hasSmallPointer, initialPointer }) => {
	const { pointer } = theme.components.timePicker.clock;

	return css`
		background-color: ${pointer.background};
		height: 2px;
		left: 50%;
		outline: 1px solid transparent;
		position: absolute;
		pointer-events: none;
		top: calc(50% - 1px);
		transform-origin: left center;
		width: ${hasSmallPointer ? "calc(50% - 60px)" : "calc(50% - 20px)"};

		${initialPointer &&
		css`
			background-color: ${pointer.initialBackground};
			width: ${hasSmallPointer ? "calc(50% - 72px)" : "calc(50% - 32px)"};
		`}
	`;
});

export const StyledTimePickerClockPointerInnerDot = styled.div.withConfig({
	displayName: "StyledTimePickerClockPointerInnerDot-sc-"
})<{ initial?: boolean }>(({ theme, initial }) => {
	const { pointer } = theme.components.timePicker.clock;

	return css`
		border: 4px solid transparent;
		top: calc(1px - ${pointer.innerDot.size} / 2);
		left: calc(-${pointer.innerDot.size} / 2);
		width: ${pointer.innerDot.size};
		height: ${pointer.innerDot.size};
		position: absolute;
		border-radius: 50%;
		background-color: ${initial ? pointer.initialBackground : pointer.background};
	`;
});

export const StyledTimePickerClockPointerOuterDot = styled.div.withConfig({
	displayName: "StyledTimePickerClockPointerOuterDot-sc-"
})(({ theme }) => {
	const { pointer } = theme.components.timePicker.clock;

	return css`
		align-items: center;
		background-color: ${pointer.background};
		border: 1px solid transparent;
		border-radius: 50%;
		display: flex;
		height: ${pointer.outerDot.size};
		justify-content: center;
		padding: ${pointer.outerDot.padding};
		position: absolute;
		right: calc(-0.5 * ${pointer.outerDot.size});
		text-align: center;
		top: calc(-0.5 * ${pointer.outerDot.size});
		width: ${pointer.outerDot.size};

		&& {
			box-sizing: content-box;
		}
	`;
});

export const StyledTimePickerClockPointerOuterDotContent = styled.span.withConfig({
	displayName: "StyledTimePickerClockPointerOuterDotContent-sc-"
})(({ theme }) => {
	const { pointer } = theme.components.timePicker.clock;

	return css`
		color: ${pointer.outerDot.content.color};
		font-size: ${pointer.outerDot.content.fontSize};
		line-height: 1;
	`;
});

export const StyledTimePickerBody = styled.div.withConfig({ displayName: "StyledTimePickerBody-sc-" })(({ theme }) => {
	const { body } = theme.components.timePicker;

	return css`
		align-items: center;
		display: flex;
		flex-direction: column;
		padding: ${body.padding};
	`;
});

export const StyledTimePickerSetting = styled.div.withConfig({ displayName: "StyledTimePickerSetting-sc-" })(
	({ theme }) => {
		const { setting } = theme.components.timePicker;

		return css`
			box-sizing: border-box;
			display: flex;
			font-size: ${setting.fontSize};
			padding: ${setting.padding};
			position: relative;
			width: 100%;
			& > * {
				align-items: center;
				display: flex;
				margin: auto;
			}
		`;
	}
);

export const StyledTimePickerValue = styled.span.withConfig({ displayName: "StyledTimePickerValue-sc-" })<{
	selected: boolean;
	initial: boolean;
}>(({ theme, selected, initial }) => {
	const { setting, timeValue } = theme.components.timePicker;

	return css`
		align-items: center;
		background-color: ${timeValue.background};
		border: ${setting.itemBorder.default};
		border-radius: ${timeValue.borderRadius};
		box-sizing: border-box;
		cursor: pointer;
		display: inline-flex;
		justify-content: center;
		height: ${timeValue.size};
		margin: ${timeValue.margin};
		text-align: center;
		width: ${timeValue.size};
		${selected
			? css`
					border-color: ${timeValue.selectedBorderColor};
				`
			: css`
					${active(css`
						border: ${setting.itemBorder.active};
					`)}

					${hover(css`
						border: ${setting.itemBorder.hover};
					`)}
				`}

		${initial &&
		css`
			font-weight: ${timeValue.fontWeight};
			font-style: italic;
		`}
	`;
});

export const StyledTimePickerFormatSelection = styled.span.withConfig({
	displayName: "StyledTimePickerFormatSelection-sc-"
})<{ timeFormat: "am" | "pm"; selected?: boolean }>(({ theme, selected, timeFormat }) => {
	const { setting, format } = theme.components.timePicker;

	return css`
		align-items: center;
		box-sizing: border-box;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		display: inline-flex;
		font-weight: ${format.fontWeight};
		flex-shrink: 0;
		justify-content: center;
		height: ${format.size};
		line-height: ${format.size};
		width: ${format.size};

		${selected
			? css`
					background-color: ${format.selected.background};
					border: ${setting.itemBorder.default};
					color: ${format.selected.color};
				`
			: css`
					${active(css`
						border: ${setting.itemBorder.active};
					`)}
					${hover(css`
						border: ${setting.itemBorder.hover};
					`)}
				`}

		${timeFormat === "am"
			? css`
					margin-left: 0;
					order: -1;
				`
			: timeFormat === "pm" &&
				css`
					margin-right: 0;
					order: 1;
				`}
	`;
});
