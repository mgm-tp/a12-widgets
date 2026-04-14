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

import { List } from "../../list/main/list.view.js";
import { PopUpMenu } from "../../pop-up-menu/main/pop-up-menu.view.js";
import { Button } from "../../button/main/button.view.js";
import { activeAndHover } from "../../theme/base/mixins/_interaction.js";

import { TabPanelTemplate } from "./template/tab-panel.tpl.view.js";
import type { TabPanelOrientation } from "./tab-panel.api.js";

export const StyledTabPanelWrapper = styled.div.withConfig({ displayName: "StyledTabPanelWrapper-sc-" })<{
	$orientation?: TabPanelOrientation;
}>(({ $orientation }) => {
	return css`
		display: flex;
		height: 100%;
		width: 100%;
		min-width: 0;
		flex-direction: ${$orientation === "horizontal" ? "column" : "row"};
	`;
});

export const StyledTabPanelTabs = styled.ul.withConfig({
	displayName: "StyledTabPanelTabs-sc-"
})<{ $isShadow?: boolean; $orientation?: TabPanelOrientation }>(({ theme, $isShadow = false, $orientation }) => {
	const { tabs } = theme.components.tabPanel;

	const isHorizontal = $orientation === "horizontal";

	return css`
		background-color: ${tabs.background};
		box-sizing: border-box;
		display: flex;
		margin: 0;
		min-width: ${tabs.minWidth};
		padding: ${isHorizontal ? tabs.horizontalPadding : tabs.padding};
		height: ${isHorizontal ? tabs.minHeight : "100%"};
		width: ${isHorizontal ? "100%" : "auto"};
		flex-direction: ${isHorizontal ? "row" : "column"};

		${$isShadow &&
		css`
			visibility: hidden;
			position: absolute;
			overflow: hidden;
		`}
	`;
});

export const StyledSubMenuPopup = styled(PopUpMenu).withConfig({ displayName: "StyledSubMenuPopup-sc-" })`
	height: 100%;
	width: 100%;
`;

export const StyledCondensedTab = styled(TabPanelTemplate.Tab)<{
	/**
	 * @deprecated since version 38.2.0. Please use {@link TabProps.selected} instead
	 */
	$selected?: boolean;

	/**
	 * @deprecated since version 38.2.0. Please use {@link TabProps.orientation} instead.
	 */
	$orientation?: TabPanelOrientation;
}>(({ theme, $selected, $orientation }) => {
	const { tab } = theme.components.tabPanel;

	return css`
		padding: 0;

		& > div {
			flex-grow: 1;
			align-self: stretch;
		}

		${$orientation === "horizontal" &&
		css`
			min-width: ${tab.minWidth};

			&:before {
				border: ${tab.border};
				bottom: 0;
				content: "";
				left: 0;
				position: absolute;
				right: 0;
				top: 0;
			}

			${$selected &&
			css`
				&:after {
					height: ${tab.selected.borderTopWidth};
					width: 100%;
				}
				&:before {
					border-top-width: ${tab.selected.borderTopWidth};
				}
			`}
		`}
	`;
});

export const StyledSubTabListTriggerButton = styled(Button).withConfig({
	displayName: "StyledSubTabListTriggerButton-sc-"
})`
	border-radius: 0;
	color: inherit;
	background-color: inherit;
	height: 100%;
	width: 100%;

	&& {
		${activeAndHover(css`
			border-color: inherit;
			color: inherit;
		`)}
	}
`;

export const StyledSubTabPanelTabs = styled(List).withConfig({ displayName: "StyledSubTabPanelTabs-sc-" })(
	({ theme }) => {
		const { tabs } = theme.components.tabPanel;

		return css`
			background-color: ${tabs.background};
			min-width: ${tabs.minWidth};
		`;
	}
);

export const StyledTabPanelPanel = styled.div.withConfig({ displayName: "StyledTabPanelPanel-sc-" })(({ theme }) => {
	return css`
		background: ${theme.components.tabPanel.background};
		display: flex;
		flex-flow: column;
		flex-grow: 1;
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
		outline: none;
	`;
});
