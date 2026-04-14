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

export const StyledCalendarWeekViewWrapper = styled.div.withConfig({
	displayName: "StyledCalendarWeekViewWrapper-sc-"
})`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;

export const StyledCalendarWeekViewHeader = styled.div.withConfig({
	displayName: "StyledCalendarWeekViewHeader-sc-"
})(({ theme }) => {
	const { gap, header } = theme.components.calendar.weekView;

	return css`
		display: flex;
		gap: ${gap};
		background: ${header.background};
		padding-inline: ${gap};
	`;
});

export const StyledCalendarWeekViewContent = styled.div.withConfig({
	displayName: "StyledCalendarWeekViewContent-sc-"
})(({ theme }) => {
	const { gap, background } = theme.components.calendar.weekView;

	return css`
		flex: 1;
		display: flex;
		gap: ${gap};
		background: ${background};
		padding: ${gap};
		overflow: hidden;
	`;
});

export const StyledCalendarWeekViewEmptyDay = styled.div.withConfig({
	displayName: "StyledCalendarWeekViewEmptyDay-sc-"
})(() => {
	return css`
		flex: 1;
	`;
});

export const StyledCalendarWeekViewHeaderItem = styled.div.withConfig({
	displayName: "StyledCalendarWeekViewHeaderItem-sc-"
})(({ theme }) => {
	const { padding, fontWeight, color, fontSize, textAlign, background } = theme.components.calendar.weekView.header;

	return css`
		color: ${color};
		font-weight: ${fontWeight};
		padding: ${padding};
		flex: 1;
		font-size: ${fontSize};
		text-align: ${textAlign};
		background: ${background};
		overflow: hidden;
	`;
});

export const StyledCalendarWeekViewDayContent = styled.div.withConfig({
	displayName: "StyledCalendarWeekViewDayContent-sc-"
})(({ theme }) => {
	const { overflowX, overflowY, padding } = theme.components.calendar.weekView.dayContent;

	return css`
		flex-grow: 1;
		overflow-x: ${overflowX};
		overflow-y: ${overflowY};
		padding: ${padding};
	`;
});
