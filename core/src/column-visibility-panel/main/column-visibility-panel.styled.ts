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

import {
	StyledContentBoxContent,
	StyledContentBoxFooter,
	StyledContentBoxHeader
} from "../../contentbox/main/template/contentbox.tpl.styled.js";
import {
	StyledDropdownContent,
	StyledDropdownItem,
	StyledDropdownWrapper
} from "../../dropdown/main/template/dropdown.tpl.styled.js";

/** The panel's surface: its width band, the bounded list that scrolls, and the dividers. */
export const StyledColumnVisibilityPanel = styled.div.withConfig({
	displayName: "StyledColumnVisibilityPanel-sc-"
})<{ $modal?: boolean }>(({ theme, $modal }) => {
	const { columnVisibilityPanel } = theme.components;

	return css`
		display: flex;
		min-width: ${columnVisibilityPanel.minWidth};

		/* Focused on open to hold TAB inside the dialog, but not a control, so it shows no focus ring. */
		&:focus,
		&:focus-visible {
			outline: none;
		}

		max-width: ${$modal ? columnVisibilityPanel.modalMaxWidth : columnVisibilityPanel.maxWidth};

		${
			$modal &&
			css`
				width: 100%;

				/* The overlay paints and clips its direct child, whose background would show through the
				 * content box's rounded corners. */
				&& {
					background-color: transparent;
					overflow: visible;
				}
			`
		}

		/* Closes the header off against the list, the way a sub heading would if there were one. */
		${StyledContentBoxHeader} {
			border-bottom: ${columnVisibilityPanel.header.borderBottom};
		}

		/*
		 * The title, the search field, the rows and the footer line up on the panel's own measure, not
		 * on the content box's, which the flat theme widens for page-level boxes. Only the inline axis,
		 * so each part keeps its vertical rhythm.
		 */
		${StyledContentBoxHeader} > * {
			padding-inline: ${columnVisibilityPanel.horizontalPadding};
		}

		/* The list scrolls inside the box, so that the heading and the footer stay pinned. */
		${StyledContentBoxContent} {
			max-height: ${columnVisibilityPanel.list.maxHeight};
		}

		${StyledContentBoxFooter} {
			justify-content: flex-end;
			padding-inline: ${columnVisibilityPanel.horizontalPadding};
		}

		/* The content box is the surface and the element that scrolls, so the list brings neither. */
		${StyledDropdownWrapper} {
			background-color: transparent;
			box-shadow: none;
		}

		${StyledDropdownContent} {
			max-height: none;
			overflow-y: visible;
		}

		/* A row highlights across the full width, so the row's own padding does the lining up. */
		${StyledDropdownItem} {
			padding-inline: ${columnVisibilityPanel.horizontalPadding};
		}
	`;
});

/** The message that takes the list's place while a search matches no column. */
export const StyledColumnVisibilityNoResults = styled.div.withConfig({
	displayName: "StyledColumnVisibilityNoResults-sc-"
})(({ theme }) => {
	const { horizontalPadding, noResults } = theme.components.columnVisibilityPanel;

	return css`
		color: ${noResults.color};
		padding: ${noResults.paddingVertical} ${horizontalPadding};
	`;
});
