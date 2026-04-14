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

import { css, keyframes, styled } from "styled-components";
import { rgba } from "polished";

import { activeAndHover, darkFocus } from "../../../../theme/base/mixins/_interaction.js";

type VariantInteractionConfig = {
	focus?: {
		background?: string;
		border?: string;
		color?: string;
	};
	hover?: {
		background?: string;
		border?: string;
		color?: string;
	};
};

const variantInteractionStyles = (variant: VariantInteractionConfig): ReturnType<typeof css> => css`
	&:focus {
		background: ${variant.focus?.background};
		color: ${variant.focus?.color};

		&:before {
			border: ${variant.focus?.border};
		}
	}

	${activeAndHover(css`
		background: ${variant.hover?.background};
		color: ${variant.hover?.color};
		&:before {
			border: ${variant.hover?.border};
		}
	`)}
`;

export const StyledCalendarDayWrapper = styled.div.withConfig({
	displayName: "StyledCalendarDayWrapper-sc-"
})<{
	$variant: "month" | "week";
	$isSelected?: boolean;
	$isCurrentDate?: boolean;
	$isWeekendDay?: boolean;
	$isPublicHolidays?: boolean;
	$isOutsideDay?: boolean;
	$isDisabled?: boolean;
	$isChildHovered?: boolean;
}>(
	({
		theme,
		$isSelected,
		$isCurrentDate,
		$isWeekendDay,
		$isPublicHolidays,
		$isOutsideDay,
		$isDisabled,
		$isChildHovered,
		$variant
	}) => {
		const { calendar } = theme.components;
		const { variant, monthView, weekView } = calendar;
		const viewTheme = $variant === "month" ? monthView : weekView;
		const { selected, hover, weekend, currentDate, publicHoliday, focus, outsideDay, disabled } = variant;
		const { day } = viewTheme;
		const selectedStyles =
			$isSelected &&
			css`
				background: ${selected.background};
				color: ${selected.color};
				font-weight: ${selected.fontWeight};
				&:before {
					border: ${selected?.border};
				}

				${variantInteractionStyles(selected)}
			`;

		const focusStyles = css`
			&:focus {
				background: ${focus?.background};
				color: ${focus?.color};
				font-weight: ${focus?.fontWeight};

				&:before {
					border: ${focus?.border};
					${darkFocus};
					margin: 1px;
				}
			}
		`;

		const activeAndHoverStyles = activeAndHover(css`
			background: ${hover?.background};
			color: ${hover?.color};
			font-weight: ${hover?.fontWeight};
			&:before {
				border: ${hover?.border};
			}
		`);

		const weekendStyles =
			$isWeekendDay &&
			css`
				background: ${weekend.background};
				color: ${weekend.color};
				font-weight: ${weekend.fontWeight};
				&:before {
					border: ${weekend?.border};
				}

				${variantInteractionStyles(weekend)}
			`;

		const currentDateStyles =
			$isCurrentDate &&
			css`
				background: ${currentDate.background};
				color: ${currentDate.color};
				font-weight: ${currentDate.fontWeight};
				&:before {
					border: ${currentDate?.border};
				}

				${variantInteractionStyles(currentDate)}
			`;

		const publicHolidayStyles =
			$isPublicHolidays &&
			css`
				background: ${publicHoliday.background};
				color: ${publicHoliday.color};
				font-weight: ${publicHoliday.fontWeight};
				&:before {
					border: ${publicHoliday?.border};
				}
				${variantInteractionStyles(publicHoliday)}
			`;

		const outsideDayStyles =
			$isOutsideDay &&
			css`
				background: ${outsideDay.background};
				color: ${outsideDay.color};
				font-weight: ${outsideDay.fontWeight};
				&:before {
					border: ${outsideDay.border};
				}

				${variantInteractionStyles(outsideDay)}
			`;

		const disabledStyles =
			$isDisabled &&
			css`
				pointer-events: none;
				user-select: none;
				background: ${disabled.background};
				opacity: ${disabled.opacity};
				color: ${disabled.color};
				font-weight: ${disabled.fontWeight};
				&:before {
					border: ${disabled.border};
				}
			`;

		return css`
			display: flex;
			position: relative;
			flex: 1;
			flex-direction: column;
			min-width: 0;
			justify-content: flex-start;
			border-radius: ${day.borderRadius};
			padding: ${day.padding};
			cursor: pointer;
			overflow: hidden;
			background: ${day.background};

			&:focus-visible {
				outline: none;
			}

			&:before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				border-radius: ${day.borderRadius};
				pointer-events: none;
				border: ${day.border};
			}

			${focusStyles}
			${!$isChildHovered &&
			css`
				${activeAndHoverStyles}
			`}
			${weekendStyles}
			${currentDateStyles}
			${publicHolidayStyles}
			${outsideDayStyles}
			${selectedStyles}
			${disabledStyles}
		`;
	}
);

export const StyledCalendarDayContent = styled("div").withConfig({
	displayName: "StyledCalendarDayContent-sc-"
})<{ $variant: "month" | "week" }>(({ theme, $variant }) => {
	const { dayContent } = theme.components.calendar[$variant === "month" ? "monthView" : "weekView"];

	return css`
		display: flex;
		flex-direction: column;
		gap: ${dayContent.gap};
		background: transparent;
	`;
});

export const StyledCalendarDayItem = styled("div").withConfig({
	displayName: "StyledCalendarDayItem-sc-"
})<{ $variant: "month" | "week"; $selected?: boolean }>(({ theme, $variant, $selected }) => {
	const { calendar } = theme.components;
	const { selected, hoverBorder, focusBorder } = calendar.item;
	const { borderRadius, boxShadow, padding, fontSize, fontWeight, color, background } =
		calendar[$variant === "month" ? "monthView" : "weekView"].dayContent.item;

	const selectedStyles =
		$selected &&
		css`
			&:before {
				border-left: ${selected?.borderLeft};
			}
		`;

	const activeAndHoverStyles = activeAndHover(css`
		&:before {
			border: ${hoverBorder};
		}

		${$selected &&
		css`
			&:before {
				border-left: ${selected?.hoverBorderLeft};
			}
		`}
	`);

	const focusStyles = css`
		&:focus {
			&:before {
				border: ${focusBorder};
				${darkFocus};
				margin: 1px;
				${$selected &&
				css`
					border-left: ${selected?.focusBorderLeft};
				`}
			}
		}
	`;

	return css`
		border-radius: ${borderRadius};
		box-shadow: ${boxShadow};
		padding: ${padding};
		font-size: ${fontSize};
		font-weight: ${fontWeight};
		color: ${color};
		background: ${background};
		position: relative;

		${activeAndHoverStyles}
		${selectedStyles}
		${focusStyles}

		&:before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			border-radius: ${borderRadius};
			pointer-events: none;
		}

		&:focus-visible {
			outline: none;
		}
	`;
});

const slideGradient = keyframes`
	0% {
		background-position: -250px 0;
	}
	100% {
		background-position: 250px 0;
	}
`;

export const StyledPlaceholderCalendarDayCell = styled.div.withConfig({
	displayName: "StyledPlaceholderCalendarDayCell-sc-"
})(({ theme }) => {
	const { variant } = theme.components.calendar;
	const { placeholder } = variant;

	return css`
		padding: ${placeholder.padding};
		background-image: linear-gradient(
			to right,
			${rgba(placeholder.background, 0.8)} 20%,
			${placeholder.background} 50%,
			${rgba(placeholder.background, 0.8)} 80%
		);
		background-size: 500px 100%;
		background-clip: content-box;
		flex-grow: 1;
		width: 100%;
		animation-name: ${slideGradient};
		animation-fill-mode: forwards;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-duration: 0.5s;
	`;
});
