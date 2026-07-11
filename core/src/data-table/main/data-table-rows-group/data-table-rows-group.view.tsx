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

import type { ReactElement, ReactNode } from "react";
import { Children, Fragment, useMemo, useRef } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";

import { flattenAllColumns } from "../foundation/utils.js";
import { DataTableRowGroupHeader } from "../default-renderers.js";
import type { BaseDataTableProps } from "../data-table.api.js";
import type { DataTableSlotProps, DataTableSlots } from "../data-table-slots.api.js";
import { DataTable } from "../data-table.view.js";
import { StyledCellContent } from "../template/data-table.styled-utils.js";

import {
	StyledGroupHeaderButton,
	StyledGroupHeaderCell,
	StyledGroupHeaderRow
} from "./data-table-rows-group.styled.js";
import type { DataTableRowsGroupProps } from "./data-table-rows-group.api.js";

interface GroupMeta {
	groupIndex: number;
	collapsed: boolean;
	hasHead: boolean;
	headTitle: ReactNode;
	startIndex: number;
	count: number;
	groupKey: string | number;
}

/**
 * DataTable wrapper that renders grouped rows with collapsible headers.
 *
 * Each {@link RowsGroup} in `data` is rendered as a group-header `<tr>` (when `group.head` is present)
 * followed by the group's `subRows`. Collapsed groups hide their sub-rows while keeping the header
 * visible. Delegates to {@link DataTable} with a custom body slot that injects the header rows.
 *
 * @experimental
 */
export function DataTableRowsGroup<RowType>(props: DataTableRowsGroupProps<RowType>): ReactElement {
	// `virtualScrollOptions`, `infiniteScrollOptions` and `dragDropOptions` are excluded from the props
	// type (grouping renders through the body slot, which those body modes bypass), but JS consumers can
	// still pass them — strip them defensively so groups never silently render flat.
	const {
		data: groups,
		onGroupHeaderClick,
		slots,
		virtualScrollOptions: _virtualScrollOptions,
		infiniteScrollOptions: _infiniteScrollOptions,
		dragDropOptions: _dragDropOptions,
		...tableProps
	} = props as DataTableRowsGroupProps<RowType> &
		Pick<BaseDataTableProps<RowType>, "virtualScrollOptions" | "infiniteScrollOptions" | "dragDropOptions">;

	const leafCount = useMemo(() => flattenAllColumns<RowType>(tableProps.columns).length || 1, [tableProps.columns]);

	const { flatData, groupMetas } = useMemo(() => {
		const flat: RowType[] = [];
		const metas: GroupMeta[] = [];

		for (let gi = 0; gi < groups.length; gi++) {
			const group = groups[gi];
			const collapsed = !!group.collapsed;
			const startIndex = flat.length;
			const count = collapsed ? 0 : group.subRows.length;

			if (!collapsed) {
				for (const row of group.subRows) {
					flat.push(row);
				}
			}

			metas.push({
				groupIndex: gi,
				collapsed,
				hasHead: !!group.head,
				headTitle: group.head?.title ?? null,
				startIndex,
				count,
				groupKey: group.id ?? `group-${gi}`
			});
		}

		return { flatData: flat, groupMetas: metas };
	}, [groups]);

	// The grouping body reads its render inputs through a ref so the slot component identity stays stable
	// for the lifetime of this instance — changing groups must not remount the `<tbody>` (and with it
	// every row's DOM state and focus). The ref is refreshed during render; DataTable re-renders the body
	// slot in the same pass, so it always sees the current value.
	const groupingRef = useRef({ groups, groupMetas, onGroupHeaderClick, leafCount, slots });

	groupingRef.current = { groups, groupMetas, onGroupHeaderClick, leafCount, slots };

	const GroupBody = useMemo(() => {
		function DataTableRowsGroupBody(bodyProps: DataTableSlotProps.Body<RowType>): ReactElement {
			const current = groupingRef.current;

			// No groups: fall through to the default body children so the DataTable empty-state
			// placeholder row (`emptyStateLabel`) renders.
			if (current.groupMetas.length === 0) {
				return <tbody>{bodyProps.children}</tbody>;
			}

			const renderedRows = Children.toArray(bodyProps.children);

			// Group-header content: `slots.rowGroupHeader` when provided, else the `DataTableRowGroupHeader` primitive.
			const GroupHeaderSlot = current.slots?.rowGroupHeader;

			return (
				<tbody>
					{current.groupMetas.map((meta) => {
						const { groupIndex, collapsed, hasHead, headTitle, startIndex, count, groupKey } = meta;
						const subRowElements = renderedRows.slice(startIndex, startIndex + count);
						const group = current.groups[groupIndex];

						const headerContent = GroupHeaderSlot ? (
							<GroupHeaderSlot group={group} groupIndex={groupIndex} collapsed={collapsed} defaultContent={headTitle}>
								{headTitle}
							</GroupHeaderSlot>
						) : (
							<DataTableRowGroupHeader
								group={group}
								groupIndex={groupIndex}
								collapsed={collapsed}
								defaultContent={headTitle}
							>
								{headTitle}
							</DataTableRowGroupHeader>
						);

						return (
							<Fragment key={groupKey}>
								{hasHead && (
									<StyledGroupHeaderRow
										data-role={DataRoles.Table.Row.Group.Header}
										id={group.head?.id}
										className={group.head?.className}
										style={group.head?.style}
									>
										<StyledGroupHeaderCell colSpan={current.leafCount} $hasButton={!!current.onGroupHeaderClick}>
											{current.onGroupHeaderClick ? (
												<StyledGroupHeaderButton
													type="button"
													data-role={DataRoles.Table.Row.Group.HeaderToggle}
													aria-expanded={!collapsed}
													onClick={(): void => current.onGroupHeaderClick?.({ group, groupIndex })}
												>
													<StyledCellContent $verticalAlignment="middle" $gap="8px">
														{headerContent}
													</StyledCellContent>
												</StyledGroupHeaderButton>
											) : (
												<StyledCellContent $verticalAlignment="middle" $gap="8px">
													{headerContent}
												</StyledCellContent>
											)}
										</StyledGroupHeaderCell>
									</StyledGroupHeaderRow>
								)}
								{subRowElements}
							</Fragment>
						);
					})}
				</tbody>
			);
		}

		return DataTableRowsGroupBody;
	}, []);

	const mergedSlots = useMemo<DataTableSlots<RowType>>(() => ({ ...slots, body: GroupBody }), [slots, GroupBody]);

	return <DataTable {...tableProps} data={flatData} slots={mergedSlots} />;
}
