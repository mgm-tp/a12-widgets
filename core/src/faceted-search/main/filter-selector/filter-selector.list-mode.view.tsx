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

import type { FC, ReactNode } from "react";
import { Fragment, useContext, useEffect, useState } from "react";

import { Badge } from "../../../badge/main/badge.view.js";
import { Typography } from "../../../typography/main/typography.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";

import type {
	FilterItemData,
	FilterSectionData,
	FilterSelectorListModeConfig
} from "./filter-selector.list-mode.api.js";
import {
	StyledFilterSelectorListSection,
	StyledFilterSelectorListGroupHeadline,
	StyledFilterSelectorListDivider,
	StyledFilterSelectorListGroupDivider,
	StyledFilterSelectorListWrapper,
	StyledFilterSelectorListModeWrapper,
	StyledFilterSelectorListMode
} from "./filter-selector.list-mode.styled.js";

const FilterItem: FC<{
	item: FilterItemData;
	noDivider: boolean;
}> = ({ item, noDivider }) => {
	const [isCollapsed, setIsCollapsed] = useState(item.collapsed);
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);

	useEffect(() => {
		setIsCollapsed(item.collapsed);
	}, [item.collapsed]);

	const showBadge = isCollapsed && !!item.active;
	const badgeVariant = item.badgeVariant ?? "info";
	const badgeTitle = item.badgeTitle ?? languageContext.filterSelectorTitles?.activeFilterBadgeTitle;

	const handleCollapseToggle = (): void => {
		setIsCollapsed((prev) => !prev);
		item.onCollapseChange?.(!isCollapsed);
	};

	return (
		<StyledFilterSelectorListSection $showHeaderActions={item.showMeta} onFocus={item.onFocus}>
			<Typography.Headline
				level={5}
				collapsible
				collapsed={isCollapsed}
				swapAddonsPosition
				ariaLevel={5}
				compact
				headerActions={item.meta}
				onCollapsingChange={handleCollapseToggle}
			>
				{item.label}
				{showBadge && (
					<span style={{ marginLeft: "4px" }}>
						<Badge tiny standalone variant={badgeVariant} title={badgeTitle} />
					</span>
				)}
			</Typography.Headline>
			<Typography.Body>{!isCollapsed && item.content}</Typography.Body>
			{!noDivider &&
				(item.lastHiddenItem ? (
					<StyledFilterSelectorListGroupDivider $collapsed={isCollapsed} />
				) : (
					<StyledFilterSelectorListDivider $collapsed={isCollapsed} />
				))}
		</StyledFilterSelectorListSection>
	);
};

const FilterList: FC<{
	items: (FilterItemData | FilterSectionData)[];
	children?: ReactNode;
}> = ({ items, children }) => {
	return (
		<StyledFilterSelectorListWrapper>
			{items.map((entry, entryIndex) => {
				const isLastEntry = entryIndex === items.length - 1;

				if (!("items" in entry)) {
					return (
						<Fragment key={entry.id}>
							<FilterItem item={entry} noDivider={isLastEntry} />
						</Fragment>
					);
				}

				if (entry.items.length === 0) {
					return null;
				}

				return (
					<StyledFilterSelectorListSection key={entry.id}>
						<StyledFilterSelectorListGroupHeadline level={3} ariaLevel={3} compact>
							{entry.label}
						</StyledFilterSelectorListGroupHeadline>
						<>
							{entry.items.map((item, itemIndex) => (
								<FilterItem key={item.id} item={item} noDivider={isLastEntry && itemIndex === entry.items.length - 1} />
							))}
						</>
					</StyledFilterSelectorListSection>
				);
			})}
			{children}
		</StyledFilterSelectorListWrapper>
	);
};

/** @internal */
export const FilterSelectorListMode: FC<FilterSelectorListModeConfig> = ({
	items = [],
	headerContent,
	footerContent,
	actionBar,
	wrapperRef,
	customFilterList,
	children
}) => {
	return (
		<StyledFilterSelectorListModeWrapper ref={wrapperRef} tabIndex={-1}>
			{headerContent}
			{actionBar}
			<StyledFilterSelectorListMode>
				{customFilterList ? (
					<>
						{customFilterList}
						{children}
					</>
				) : (
					<FilterList items={items}>{children}</FilterList>
				)}
			</StyledFilterSelectorListMode>
			{footerContent}
		</StyledFilterSelectorListModeWrapper>
	);
};

FilterSelectorListMode.displayName = "FilterSelectorListMode";
