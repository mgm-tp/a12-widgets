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

import type { FC, MouseEvent } from "react";
import { styled, css } from "styled-components";

import { DataRoles, Icon, List, PopUpMenu, Switch, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

const StyledSectionHeader = styled(Typography.Headline)(({ theme }) => {
	return css`
		margin: 0;
		padding: 0;
		background-color: ${theme.colors.background.tertiaryBackground};
	`;
});

const StyledList = styled(List)`
	min-width: 240px;
`;

const StyledListItem = styled(List.Item)`
	min-height: 32px;
	max-height: 32px;

	[data-role="${DataRoles.List.Item.Content}"] {
		min-height: 32px;
	}
`;

interface FilterOptionsProps {
	showSearch?: boolean;
	showSetFiltersOnly?: boolean;
	isPinned?: boolean;
	matchMode?: "any" | "all";
	invertResult?: boolean;
	expandCollapseState?: "expanded" | "collapsed" | null;
	onShowSearchChange?: (value: boolean) => void;
	onShowSetFiltersOnlyChange?: (value: boolean) => void;
	onPinChange?: (value: boolean) => void;
	onMatchModeChange?: (value: "any" | "all") => void;
	onInvertResultChange?: (value: boolean) => void;
	onExpandAll?: () => void;
	onCollapseAll?: () => void;
}

export const FilterOptions: FC<FilterOptionsProps> = ({
	showSearch = false,
	showSetFiltersOnly = false,
	isPinned = true,
	matchMode = "any",
	invertResult = false,
	expandCollapseState = null,
	onShowSearchChange,
	onShowSetFiltersOnlyChange,
	onPinChange,
	onMatchModeChange,
	onInvertResultChange,
	onExpandAll,
	onCollapseAll
}) => {
	const handleItemClick = (callback: () => void) => (event?: MouseEvent<HTMLElement>) => {
		event?.stopPropagation();
		callback();
	};

	const hasViewSection =
		!!onShowSearchChange || !!onPinChange || !!onExpandAll || !!onCollapseAll || !!onShowSetFiltersOnlyChange;
	const hasMatchSection = !!onMatchModeChange;
	const hasResultSection = !!onInvertResultChange;

	return (
		<PopUpMenu
			icon={<Icon>more_vert</Icon>}
			triggerButtonTitle="More options"
			orientation="bottom-end"
			menuClassName="-u-rounded-lg"
		>
			<StyledList>
				{hasViewSection && (
					<>
						<StyledSectionHeader level={5} compact>
							View
						</StyledSectionHeader>
						{onShowSearchChange && (
							<StyledListItem
								graphic={<Icon>search</Icon>}
								text="Show Search"
								meta={<Switch checked={showSearch} onChange={(checked) => onShowSearchChange(checked)} />}
								onClick={handleItemClick(() => onShowSearchChange(!showSearch))}
								divider="light"
							/>
						)}
						{onPinChange && (
							<StyledListItem
								graphic={<Icon>push_pin</Icon>}
								text="Pin Filter"
								meta={<Switch checked={isPinned} onChange={(checked) => onPinChange(checked)} />}
								onClick={handleItemClick(() => onPinChange(!isPinned))}
								divider="light"
							/>
						)}
						{onExpandAll && (
							<StyledListItem
								graphic={<Icon>unfold_more</Icon>}
								text="Expand All Filter"
								meta={expandCollapseState === "expanded" ? <Icon>check</Icon> : undefined}
								onClick={handleItemClick(() => onExpandAll())}
							/>
						)}
						{onCollapseAll && (
							<StyledListItem
								graphic={<Icon>unfold_less</Icon>}
								text="Collapse All Filter"
								meta={expandCollapseState === "collapsed" ? <Icon>check</Icon> : undefined}
								onClick={handleItemClick(() => onCollapseAll())}
								divider="light"
							/>
						)}
						{onShowSetFiltersOnlyChange && (
							<StyledListItem
								graphic={<Icon>visibility</Icon>}
								text="Show Set Filters, only"
								meta={
									<Switch checked={showSetFiltersOnly} onChange={(checked) => onShowSetFiltersOnlyChange(checked)} />
								}
								onClick={handleItemClick(() => onShowSetFiltersOnlyChange(!showSetFiltersOnly))}
							/>
						)}
					</>
				)}

				{hasMatchSection && (
					<>
						<StyledSectionHeader level={5} compact>
							Match
						</StyledSectionHeader>
						<StyledListItem
							graphic={<Icon>filter_none</Icon>}
							text="Any"
							meta={matchMode === "any" ? <Icon>check</Icon> : undefined}
							onClick={handleItemClick(() => onMatchModeChange("any"))}
						/>
						<StyledListItem
							graphic={<Icon>select_all</Icon>}
							text="All"
							meta={matchMode === "all" ? <Icon>check</Icon> : undefined}
							onClick={handleItemClick(() => onMatchModeChange("all"))}
						/>
					</>
				)}

				{hasResultSection && (
					<>
						<StyledSectionHeader level={5} compact>
							Result
						</StyledSectionHeader>
						<StyledListItem
							graphic={<Icon>contrast</Icon>}
							text="Invert"
							meta={<Switch checked={invertResult} onChange={(checked) => onInvertResultChange(checked)} />}
							onClick={handleItemClick(() => onInvertResultChange(!invertResult))}
						/>
					</>
				)}
			</StyledList>
		</PopUpMenu>
	);
};
