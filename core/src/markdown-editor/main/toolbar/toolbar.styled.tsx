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

import { Button } from "../../../button/main/button.view.js";
import { PopUpMenu } from "../../../pop-up-menu/main/pop-up-menu.view.js";
import { active, darkFocus, hover } from "../../../theme/base/mixins/_interaction.js";

export const StyledMarkdownToolbar = styled.div.withConfig({ displayName: "StyledMarkdownToolbar-sc-" })(
	({ theme }) => {
		const { toolbar } = theme.components.markdownEditor;

		return css`
			align-items: center;
			background-color: ${toolbar.background};
			border: ${theme.components.baseInput.input.border};
			border-bottom: none;
			border-radius: ${toolbar.borderRadius} ${toolbar.borderRadius} 0 0;
			box-shadow: ${toolbar.boxShadow};
			display: flex;
			flex-wrap: wrap;
			gap: ${toolbar.gap};
			min-height: ${toolbar.minHeight};
			padding: ${toolbar.padding};
		`;
	}
);

export const StyledMarkdownToolbarGroup = styled.div.withConfig({ displayName: "StyledMarkdownToolbarGroup-sc-" })(
	({ theme }) => css`
		align-items: center;
		display: flex;
		gap: ${theme.components.markdownEditor.toolbar.gap};
	`
);

export const StyledMarkdownToolbarModeMenu = styled(PopUpMenu).withConfig({
	displayName: "StyledMarkdownToolbarModeMenu-sc-"
})`
	margin-left: auto;
`;

/**
 * Every formatting group and separator, as one flex item. It takes the free space,
 * so the mode menu after it ends up at the far end of the bar.
 */
export const StyledMarkdownToolbarControls = styled.div.withConfig({
	displayName: "StyledMarkdownToolbarControls-sc-"
})(
	({ theme }) => css`
		align-items: center;
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		gap: ${theme.components.markdownEditor.toolbar.gap};
	`
);

/**
 * A toolbar control (toggle button or menu trigger) built on the A12 {@link Button}
 * icon-button, restyled to match the RichTextEditor toolbar: the default icon button
 * keeps a transparent background in every state, so we paint the filled hover / focus
 * "chip" and the pressed fill from the `markdownEditor.toolbar.item` tokens. The pressed
 * state is the Button's own `active` prop, so a toggle needs no extra styling prop.
 * `&&` doubles specificity so these win over the base icon-button styles.
 */
export const StyledMarkdownToolbarButton = styled(Button).withConfig({
	displayName: "StyledMarkdownToolbarButton-sc-"
})(({ theme, active: pressed, disabled }) => {
	const { icon, borderRadius } = theme.components.markdownEditor.toolbar.item;

	return css`
		&& {
			border-radius: ${borderRadius};
			color: ${disabled ? icon.disabled.color : icon.color};

			${
				!disabled &&
				css`
					${hover(css`
						background-color: ${icon.hover.background};
						color: ${icon.hover.color};
					`)}
					${active(css`
						background-color: ${icon.active.selector.background};
						color: ${icon.active.selector.color};
					`)}
					&:focus {
						background-color: ${icon.focus.background};
						color: ${icon.focus.color};
						${darkFocus};
					}

					${
						pressed &&
						css`
							background-color: ${icon.active.background};
							color: ${icon.active.color};

							${hover(css`
								background-color: ${icon.active.hoverBG};
								color: ${icon.active.color};
							`)}
							${active(css`
								background-color: ${icon.active.activeBG};
								color: ${icon.active.color};
							`)}
							&:focus {
								background-color: ${icon.active.focusBG};
								color: ${icon.active.color};
							}
						`
					}
				`
			}
		}
	`;
});

export const StyledMarkdownToolbarSeparator = styled.div.withConfig({
	displayName: "StyledMarkdownToolbarSeparator-sc-"
})(({ theme }) => {
	const { separator } = theme.components.markdownEditor.toolbar;

	return css`
		align-self: center;
		background-color: ${separator.background};
		flex: none;
		height: ${separator.height};
		margin: ${separator.margin};
		width: ${separator.width};
	`;
});
