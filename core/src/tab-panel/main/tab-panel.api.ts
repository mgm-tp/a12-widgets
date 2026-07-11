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

import type { ReactNode } from "react";

import type { Container, Ref } from "../../common/main/base-props.js";

import type { TabPanelTemplateProps } from "./template/tab-panel.tpl.api.js";

export type TabPanelOrientation = "vertical" | "horizontal";

export interface TabPanelProps extends TabPanelTemplateProps.BaseProps, Container, Ref {
	/**
	 * The header of tab content.
	 */
	header?: ReactNode;

	/**
	 * Array of tab items.
	 * Use {@link TabPanelTemplateProps.TabProps}[] for a flat list,
	 * Or {@link TabPanelTemplateProps.GroupTabProps}[] to define tabs into groups.
	 */
	tabs: TabPanelTemplateProps.TabProps[] | TabPanelTemplateProps.GroupTabProps[];

	/**
	 * Specifies the value of a Tab List that should get selected.
	 */
	value?: string;

	/**
	 * Sets a custom aria-label for the tab list.
	 * By default, this attribute's value are:
	 * - English: "main navigation"
	 * - German: "Hauptnavigation"
	 */
	tabListAriaLabel?: string;

	/**
	 * The orientation of the tab panel.
	 * @default "vertical"
	 */
	orientation?: TabPanelOrientation;

	/**
	 * Enables the mobile design for better accessibility on sub tab menu, which opened by a condensed tab.
	 * @default true
	 */
	enableA11YMobileDesignOnSubTab?: boolean;

	/**
	 * When set to true, selecting a tab item will set focus to the panel element instead of keeping focus on that tab item
	 * @default false
	 */
	focusOnPanelAfterSelect?: boolean;

	/**
	 * Callback that is called when the tab is clicked.
	 */
	onSelect?(tab: TabPanelTemplateProps.TabProps): void;

	/**
	 * Callback that is called when the tab is closed.
	 */
	onClose?(): void;
}
