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

import { List } from "../../../list/main/index.js";

/**
 * The surface a floating popup paints for itself.
 *
 * Straight from the `popupMenu` tokens, so every floating thing the markdown editor opens
 * looks like every other A12 popup. None of them uses `PopUpMenu`, so none gets this for free:
 * the table size grid is not a list of items, and a context menu has no trigger to hang off.
 */
export const popupSurface = css(({ theme }) => {
	const { menu } = theme.components.popupMenu;

	return css`
		background: ${menu.background};
		border-left: ${menu.borderLeft};
		border-radius: ${menu.borderRadius};
		border-top: ${menu.borderTop};
		box-shadow: ${menu.boxShadow};
	`;
});

/**
 * The menu a right-click inside the editor opens. It floats on its own rather than
 * under a trigger button, so it paints the surface `PopUpMenu` would otherwise
 * give it: background, border and the same drop shadow.
 *
 * The menu itself is the popup surface — there is no wrapper, so the `<ul>` carries it.
 */
export const StyledMarkdownEditorContextMenu = styled(List).withConfig({
	displayName: "StyledMarkdownEditorContextMenu-sc-"
})(
	({ theme }) => css`
		${popupSurface}
		min-width: ${theme.components.popupMenu.menu.minWidth};
	`
);
