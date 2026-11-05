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

import { popupSurface } from "../../context-menu/context-menu.styled.js";

/** The floating surface the size grid sits on. */
export const StyledMarkdownTablePicker = styled.div.withConfig({
	displayName: "StyledMarkdownTablePicker-sc-"
})(
	({ theme }) => css`
		${popupSurface}
		padding: ${theme.components.markdownEditor.toolbar.tablePicker.padding};
	`
);

/**
 * The squares sit flush against each other, the way the cells of a real table do.
 * Each one draws its right and bottom edge and the grid draws the other two, so
 * neighbours share a line instead of stacking two borders into a thick one.
 */
export const StyledMarkdownTablePickerGrid = styled.div.withConfig({
	displayName: "StyledMarkdownTablePickerGrid-sc-"
})(({ theme }) => {
	const { cell } = theme.components.markdownEditor.toolbar.tablePicker;

	return css`
		border-left: ${cell.border};
		border-top: ${cell.border};
		display: flex;
		flex-direction: column;
		position: relative;
		width: fit-content;

		&:focus {
			outline: none;
		}
	`;
});

/**
 * The outline around the picked size.
 *
 * One box over the whole block rather than a coloured edge on each square, so the
 * gridlines running through the middle of the selection stay the colour of the grid.
 * Only the outside of the block is drawn in the selected colour.
 */
export const StyledMarkdownTablePickerOutline = styled.div.withConfig({
	displayName: "StyledMarkdownTablePickerOutline-sc-"
})<{ $rows: number; $columns: number }>(({ theme, $rows, $columns }) => {
	const { cell } = theme.components.markdownEditor.toolbar.tablePicker;

	return css`
		border: ${cell.selected.border};
		box-sizing: border-box;
		height: calc(${cell.size} * ${$rows});
		left: 0;
		pointer-events: none;
		position: absolute;
		top: 0;
		width: calc(${cell.size} * ${$columns});
	`;
});

export const StyledMarkdownTablePickerRow = styled.div.withConfig({
	displayName: "StyledMarkdownTablePickerRow-sc-"
})`
	display: flex;
`;

export const StyledMarkdownTablePickerCell = styled.div.withConfig({
	displayName: "StyledMarkdownTablePickerCell-sc-"
})<{ $selected: boolean }>(({ theme, $selected }) => {
	const { cell } = theme.components.markdownEditor.toolbar.tablePicker;

	return css`
		background-color: ${$selected ? cell.selected.background : cell.background};
		border-bottom: ${cell.border};
		border-right: ${cell.border};
		box-sizing: border-box;
		cursor: pointer;
		flex: none;
		height: ${cell.size};
		width: ${cell.size};
	`;
});

export const StyledMarkdownTablePickerLabel = styled.div.withConfig({
	displayName: "StyledMarkdownTablePickerLabel-sc-"
})(({ theme }) => {
	const { label } = theme.components.markdownEditor.toolbar.tablePicker;

	return css`
		color: ${label.color};
		font-size: ${label.fontSize};
		padding: ${label.padding};
		text-align: center;
	`;
});
