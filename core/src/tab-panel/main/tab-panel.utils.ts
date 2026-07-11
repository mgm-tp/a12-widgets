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

import type { TabPanelTemplateProps } from "./template/tab-panel.tpl.api.js";

/**
 * Returns true when the array is a `GroupTabProps[]` (grouped layout).
 * Uses the presence of the `tabs` field on the first element as the discriminant.
 * @internal
 */
export const isGroupedTabList = (
	tabs: TabPanelTemplateProps.TabProps[] | TabPanelTemplateProps.GroupTabProps[]
): tabs is TabPanelTemplateProps.GroupTabProps[] => tabs.length > 0 && "tabs" in tabs[0];

/**
 * Returns a flat `TabProps[]` from either a flat tab list or a grouped tab list.
 * @internal
 */
export const flattenTabs = (
	tabs: TabPanelTemplateProps.TabProps[] | TabPanelTemplateProps.GroupTabProps[]
): TabPanelTemplateProps.TabProps[] => {
	if (isGroupedTabList(tabs)) {
		return tabs.flatMap((g) => g.tabs);
	}

	return tabs;
};

/**
 * Filters a grouped tab structure to a subset of tabs.
 * @internal
 */
export const filterGroupedTabs = (
	subsetTabs: TabPanelTemplateProps.TabProps[],
	groups: TabPanelTemplateProps.GroupTabProps[]
): TabPanelTemplateProps.GroupTabProps[] => {
	const subsetValues = new Set(subsetTabs.map((t) => t.value));

	return groups
		.map((group) => ({ ...group, tabs: group.tabs.filter((t) => subsetValues.has(t.value)) }))
		.filter((group) => group.tabs.length > 0);
};
