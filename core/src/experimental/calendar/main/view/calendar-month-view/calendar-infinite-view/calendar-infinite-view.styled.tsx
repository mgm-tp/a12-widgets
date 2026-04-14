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

import { StyledCalendarMonthViewWrapper } from "../calendar-month-view.styled.js";

export const StyledCalendarInfiniteViewWeek = styled.div.withConfig({
	displayName: "StyledCalendarInfiniteViewWeek-sc-"
})<{
	$columnNum: number;
}>(({ theme, $columnNum }) => {
	const { monthView } = theme.components.calendar;

	return css`
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(${$columnNum}, 1fr);
		overflow: hidden;
		gap: ${monthView.gap};
	`;
});

export const StyledCalendarInfiniteViewTable = styled.div.withConfig({
	displayName: "StyledCalendarInfiniteViewTable-sc-"
})<{
	$rowNum: number;
}>(({ theme }) => {
	const { monthView } = theme.components.calendar;

	return css`
		position: relative;
		width: 100%;
		flex: 1;
		display: flex;
		background: ${monthView.background};
		overflow: hidden;
	`;
});

export const StyledCalendarInfiniteScrollContainer = styled.div.withConfig({
	displayName: "StyledCalendarInfiniteScrollContainer-sc-"
})(({ theme }) => {
	const { monthView } = theme.components.calendar;

	return css`
		overflow: auto;
		flex: 1;
		padding-inline: ${monthView.gap};
		margin-block: ${monthView.gap};
		background: ${monthView.background};
	`;
});

export const StyledCalendarInfiniteMonthViewWrapper = styled(StyledCalendarMonthViewWrapper)``;
