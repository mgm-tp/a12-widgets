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

import { css, styled } from "styled-components";

export const StyledCalendarMonthViewWrapper = styled.div.withConfig({
	displayName: "StyledCalendarMonthViewWrapper-sc-"
})<{
	$minHeight?: number | string;
	$maxHeight?: number | string;
}>(({ $minHeight, $maxHeight, theme }) => {
	const { monthView } = theme.components.calendar;
	const minHeightValue = typeof $minHeight === "number" ? `${$minHeight}px` : $minHeight;
	const maxHeightValue = typeof $maxHeight === "number" ? `${$maxHeight}px` : $maxHeight;

	return css`
		background: ${monthView.background};
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: ${minHeightValue};
		max-height: ${maxHeightValue};
	`;
});

export const StyledCalendarMonthViewTableHeader = styled.div.withConfig({
	displayName: "StyledCalendarMonthViewTableHeader-sc-"
})(({ theme }) => {
	const { monthView } = theme.components.calendar;
	const { background } = monthView.header;

	return css`
		display: flex;
		background: ${background};
		gap: ${monthView.gap};
		padding-inline: ${monthView.gap};
	`;
});

export const StyledCalendarMonthViewTableHeaderItem = styled.div.withConfig({
	displayName: "StyledCalendarMonthViewTableHeaderItem-sc-"
})(({ theme }) => {
	const { header } = theme.components.calendar.monthView;
	const { padding, fontSize, background, textAlign, color, fontWeight } = header;

	return css`
		flex: 1;
		background: ${background};
		padding: ${padding};
		font-size: ${fontSize};
		text-align: ${textAlign};
		color: ${color};
		font-weight: ${fontWeight};
	`;
});

export const StyledCalendarMonthViewTable = styled.div.withConfig({ displayName: "StyledCalendarTable-sc-" })<{
	$rowNum: number;
}>(({ theme, $rowNum }) => {
	const { monthView } = theme.components.calendar;

	return css`
		flex: 1;
		display: grid;
		grid-template-rows: repeat(${$rowNum}, 1fr);
		gap: ${monthView.gap};
		padding: ${monthView.gap};
		background: ${monthView.background};
		overflow: hidden;
	`;
});

export const StyledCalendarMonthViewWeek = styled.div.withConfig({
	displayName: "StyledCalendarMonthViewWeek-sc-"
})<{
	$columnNum: number;
}>(({ theme, $columnNum }) => {
	const { monthView } = theme.components.calendar;

	return css`
		display: grid;
		grid-template-columns: repeat(${$columnNum}, 1fr);
		overflow: hidden;
		gap: ${monthView.gap};
	`;
});

export const StyledCalendarMonthViewEmptyDay = styled.div.withConfig({
	displayName: "StyledCalendarMonthViewEmptyDay-sc-"
})``;

export const StyledCalendarMonthViewDayHeader = styled.div.withConfig({
	displayName: "StyledCalendarMonthViewDayHeader-sc-"
})(({ theme }) => {
	const { dayHeader } = theme.components.calendar.monthView;

	return css`
		color: ${dayHeader?.color};
		padding: ${dayHeader?.padding};
		font-size: ${dayHeader?.fontSize};
		font-weight: ${dayHeader?.fontWeight};
		background: ${dayHeader?.background};
		text-align: ${dayHeader?.textAlign};
	`;
});

export const StyledCalendarMonthViewDayContent = styled.div.withConfig({
	displayName: "StyledCalendarMonthViewDayContent-sc-"
})(({ theme }) => {
	const { overflowX, overflowY, padding } = theme.components.calendar.monthView.dayContent;

	return css`
		flex-grow: 1;
		overflow-x: ${overflowX};
		overflow-y: ${overflowY};
		padding: ${padding};
	`;
});
