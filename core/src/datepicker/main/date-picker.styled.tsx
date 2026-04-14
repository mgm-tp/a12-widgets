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

import type { DayButtonProps } from "react-day-picker";
import { DayButton, DayPicker } from "react-day-picker";
import { styled, css } from "styled-components";

import { addPrefix, getHorizontalSpace, getVerticalSpace } from "../../common/main/utils.js";
import { BufferedInput, HTMLInputAdapter } from "../../input/buffered/main/buffered.view.js";
import { YearMonthSelector } from "../../input/year-month-selector/year-month-selector.view.js";
import { StyledNativeSelect, StyledSelectTemplate } from "../../input/select/main/select.styled.js";
import {
	StyledMonthSelector,
	StyledYearMonthSelectorInner,
	StyledYearSelector
} from "../../input/year-month-selector/year-month-selector.styled.js";
import {
	active,
	activeAndHover,
	darkFocus,
	hover,
	inputBrightFocus,
	inputDarkFocus
} from "../../theme/base/mixins/_interaction.js";
import { Button } from "../../button/main/button.view.js";
import { getBaseButtonVariantStyles } from "../../button/main/button.styled.js";
import { createBoxShadow } from "../../theme/base/mixins/_borderEffects.js";
import { TextField } from "../../input/text-field/text-field.view.js";

import type { DatePickerProps } from "./date-picker.api.js";

const baseClassName = addPrefix("DayPicker");

const BufferedStringInput = BufferedInput(HTMLInputAdapter(TextField));

export const StyledBufferedStringDatePickerInput = styled(BufferedStringInput)(({ theme }) => {
	const { input } = theme.components.datePicker;

	return css`
		${input?.focus?.customBorder &&
		css`
			[data-isfocused="true"] {
				${createBoxShadow(input.focus.customBorder)}
			}
		`}
	`;
});

export const StyledPickerHeaderButton = styled(Button).withConfig({ displayName: "StyledPickerHeaderButton-sc-" })(
	({ theme, invert = true }) => {
		const { headerActionButton } = theme.components.dateTimePicker;

		return css`
			${invert &&
			css`
				&& {
					${getBaseButtonVariantStyles(headerActionButton)}
				}
			`}
		`;
	}
);

export const StyledDayButton = styled(DayButton).withConfig({
	displayName: "StyledDateButton-sc-"
})<DayButtonProps & { $mobile?: boolean }>(({ modifiers, $mobile, theme }) => {
	const { components, typography } = theme;
	const { day, mobile, month, body } = components.datePicker;
	const {
		selected,
		disabled,
		outside,
		today,
		range_start: rangeStart,
		range_middle: rangeMiddle,
		range_end: rangeEnd
	} = modifiers;

	const interactiveDayStyles = (state: "active" | "hover" | "focus") => css`
		border: ${day[state].border};

		${selected &&
		css`
			background-color: ${day.selected.interaction[state].background};
			border: ${day.selected.interaction[state].border};
			color: ${day.selected.interaction[state].color};
		`}

		${!today &&
		css`
			background-color: ${day[state].background};
		`}
	`;

	return css`
		align-items: center;
		border: ${day.border};
		border-radius: 50%;
		cursor: pointer;
		display: inline-flex;
		font-family: ${typography.font.MAIN_FONT};
		font-size: ${day.fontSize};
		justify-content: center;
		height: ${day.size};
		line-height: normal;
		margin: ${day.margin};
		width: ${day.size};
		background-color: ${month.background};
		color: ${body.color};

		${!outside &&
		!disabled &&
		css`
			&:focus {
				${darkFocus}
				${interactiveDayStyles("focus")}
			}
			${active(css`
				${interactiveDayStyles("active")}
			`)}
			${hover(css`
				${interactiveDayStyles("hover")}
			`)}
		`}

		${today &&
		css`
			background-color: ${day.today.background};
			border-radius: ${day.today.borderRadius};
			font-weight: ${day.today.fontWeight};
		`}
		
		${outside &&
		css`
			color: ${day.outside.color};
			${activeAndHover(css`
				background-color: transparent !important;
				cursor: auto;
			`)}
		`}
		
		${selected &&
		css`
			background-color: ${day.selected.background};
			border-radius: 100%;
			color: ${day.selected.color};
		`}

		${rangeStart &&
		css`
			border-radius: 50% 0 0 50%;
		`}
		
		${rangeStart &&
		rangeEnd &&
		css`
			border-radius: 100%;
		`}

		${!rangeStart &&
		rangeEnd &&
		css`
			border-radius: 0 50% 50% 0;
		`}

		${rangeMiddle &&
		css`
			background-color: ${day.selected.range.background};
			border-radius: 0;
			color: ${day.selected.range.color};

			${disabled &&
			css`
				background-color: ${day.selected.range.disabled.background};
				color: ${day.selected.range.disabled.color};
			`}
		`}
		
		${disabled &&
		css`
			color: ${day.disabled.color};
			cursor: default;
		`}
		
		${$mobile &&
		css`
			height: ${mobile.day.size};
			width: ${mobile.day.size};
		`}
	`;
});

export namespace StyledDatePickerTemplate {
	export const StyledDatePickerFooter = styled.div.withConfig({ displayName: "StyledDatePickerFooter-sc-" })(
		({ theme }) => {
			const { footer } = theme.components.datePicker;

			return css`
				align-items: center;
				background-color: ${footer.background};
				display: flex;
				height: auto;
				min-height: ${footer.minHeight};
				padding: ${footer.padding};
			`;
		}
	);

	export const StyledDatePickerFooterAction = styled.div.withConfig({
		displayName: "StyledDatePickerFooterAction-sc-"
	})`
		flex: 1;
		text-align: center;

		&:first-child {
			text-align: left;
		}

		&:last-child {
			text-align: right;
		}
	`;
}

export namespace StyledDatePicker {
	export const StyledDatePickerRoot = styled.div.withConfig({ displayName: "StyledDatePickerRoot-sc-" })(
		({ theme }) => {
			const { root } = theme.components.datePicker;

			return css`
				box-shadow: ${root.boxShadow};
				display: flex;
				flex-direction: column;
				outline: 1px solid transparent;
				overflow: auto;
			`;
		}
	);

	export const StyledDatePickerContainer = styled(DayPicker).withConfig({
		displayName: "StyledDatePickerContainer-sc-"
	})<
		DatePickerProps & {
			$mobile?: boolean;
		}
	>(({ theme, $mobile }) => {
		const { datePicker } = theme.components;

		return css`
			outline: 1px solid transparent;
			-webkit-tap-highlight-color: transparent;
			justify-content: center;
			user-select: none;

			${$mobile &&
			css`
				margin: 0 auto;

				${StyledYearMonthSelectorInner} {
					display: flex;
					justify-content: space-around;
					width: 100%;
				}
			`}
			* {
				outline: none;
			}

			.${baseClassName}-Months {
				box-shadow: ${datePicker.wrapper.boxShadow};
			}

			.${baseClassName}-Table {
				padding: ${datePicker.body.padding};
				-webkit-border-horizontal-spacing: ${datePicker.body.horizontalCellSpacing};
				-webkit-border-vertical-spacing: ${datePicker.body.verticalCellSpacing};
			}

			.${baseClassName}-Body {
				color: ${datePicker.body.color};
			}

			.${baseClassName}-Month {
				background-color: ${datePicker.month.background};
				border-radius: ${!$mobile && datePicker.month.borderRadius};
				font-size: ${datePicker.month.fontSize};
				user-select: none;
			}

			.${baseClassName}-Week {
				.${baseClassName}-Day-Cell {
					padding-top: ${getVerticalSpace("top", datePicker.week.margin)};
					padding-bottom: ${getVerticalSpace("bottom", datePicker.week.margin)};
					padding-right: 0;
					padding-left: 0;
				}

				.${baseClassName}-Day-Cell:first-child {
					padding-left: ${getHorizontalSpace("left", datePicker.week.margin)};
				}

				.${baseClassName}-Day-Cell:last-child {
					padding-right: ${getHorizontalSpace("right", datePicker.week.margin)};
				}
			}

			.${baseClassName}-Weekday {
				color: ${datePicker.weekday.color};
				font-size: ${datePicker.weekday.fontSize};
				font-weight: ${datePicker.weekday.fontWeight};
				line-height: normal;
				padding: ${datePicker.weekday.padding};
				text-align: center;
				width: ${datePicker.weekday.width};
				text-decoration: underline dotted;
				text-transform: lowercase;

				&:first-letter {
					text-transform: uppercase;
				}
			}
		`;
	});

	export const StyledDatePickerNavButton = styled(StyledPickerHeaderButton).withConfig({
		displayName: "StyledDatePickerNavButton-sc-"
	})(({ theme }) => {
		const { navButton } = theme.components.datePicker;

		return css`
			height: ${navButton.size};
			width: ${navButton.size};
		`;
	});

	export const StyledDatePickerNavBar = styled.div.withConfig({ displayName: "StyledDatePickerNavBar-sc-" })<{
		$mobile?: boolean;
	}>(({ theme, $mobile }) => {
		const { navBar, mobile } = theme.components.datePicker;

		return css`
			align-items: center;
			background-color: ${$mobile ? mobile.navBar.background : navBar.background};
			display: flex;
			justify-content: space-evenly;
		`;
	});

	export const StyledDatePickerCaption = styled(YearMonthSelector).withConfig({
		displayName: "StyledDatePickerCaption-sc-"
	})<{ $mobile?: boolean }>(({ theme, $mobile }) => {
		const { caption, mobile } = theme.components.datePicker;

		return css`
			align-items: center;
			display: flex;
			font-weight: ${caption.fontWeight};
			justify-content: ${$mobile ? "space-around" : "center"};
			height: ${caption.height};

			${StyledSelectTemplate.StyledSelectInput} {
				background-color: ${caption.selectInput.background};
				border: ${caption.selectInput.border};
				color: ${caption.selectInput.color};
				height: ${caption.selectInput.height};
				padding: ${caption.selectInput.padding};

				${$mobile
					? css`
							background-color: ${mobile.fieldSelect.background};
							border: none;
							color: ${mobile.fieldSelect.color};
							font-size: ${mobile.fieldSelect.fontSize};

							&:focus {
								box-shadow: ${mobile.fieldSelect.focusBoxShadow};
							}
						`
					: css`
							box-shadow: none;
							border-radius: ${caption.selectInput.borderRadius};

							${active(css`
								background-color: ${caption.selectInput.active.background};
								border: ${caption.selectInput.active.border};
							`)}

							${hover(css`
								background-color: ${caption.selectInput.hover.background};
								border: ${caption.selectInput.hover.border};
							`)} 
							
							&:focus {
								background-color: ${caption.selectInput.focus.background};
								border: ${caption.selectInput.focus.border};
							}

							// Fix bug dotted border on select in FF

							&:-moz-focusring {
								color: transparent;
								text-shadow: 0 0 0 ${caption.selectInput.focus.color};
							}
						`}
			}

			${StyledSelectTemplate.StyledFieldSelectControl} {
				height: auto;
			}

			${StyledSelectTemplate.StyledSelectArrow}:after {
				content: "\\e5c5";
				color: ${!$mobile && caption.fieldSelect.arrowIcon.color};
				font-size: ${caption.fieldSelect.arrowIcon.fontSize};
				width: ${caption.fieldSelect.arrowIcon.width};
			}

			${StyledSelectTemplate.StyledFieldSelectWrapper} {
				background-color: transparent;
				${!$mobile &&
				css`
					box-shadow: none;
					&:before {
						display: none;
					}
				`}
				outline-offset: unset;

				&:focus-within {
					${$mobile ? inputDarkFocus : inputBrightFocus};
				}
			}

			${StyledNativeSelect.StyledSelectOption} {
				background-color: ${caption.selectOption.background};
				color: ${caption.selectOption.color};

				${active(css`
					background-color: ${caption.selectOption.active.background};
					color: ${caption.selectOption.active.color};
				`)}

				${hover(css`
					background-color: ${caption.selectOption.hover.background};
					color: ${caption.selectOption.hover.color};
				`)}
			}

			${StyledMonthSelector} {
				display: inline-block;
				margin: ${$mobile ? mobile.fieldSelect.firstChildMargin : caption.fieldSelect.firstChildMargin};
			}

			${StyledYearSelector} {
				display: inline-block;
				flex-shrink: 0;
				margin: 0;
				width: auto;
			}
		`;
	});

	export const StyledGridCell = styled.div.withConfig({ displayName: "StyledGridCell-sc-" })<{ $mobile?: boolean }>(
		({ theme, $mobile }) => {
			const { day, mobile } = theme.components.datePicker;

			return css`
				height: ${$mobile ? mobile.day.size : day.size};
				width: ${$mobile ? mobile.day.size : day.size};
			`;
		}
	);
}
