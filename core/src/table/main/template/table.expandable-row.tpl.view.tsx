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

import { memo, useRef, useCallback, useMemo, useEffect } from "react";
import { styled } from "styled-components";

import { getParentElement, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { useTableContext } from "../table.context.js";
import { BASE_TABLE_CLASSNAME, RowScrollManager } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";

const StyledTableExpandableWrapper = styled.div.withConfig({ displayName: "StyledTableExpandableWrapper-sc-" })`
	outline: none;
	overflow: auto;
	position: relative;
	width: 100%;
`;

export const StyledTableExpandableRow = styled.div.withConfig({ displayName: "StyledTableExpandableRow-sc-" })`
	position: relative;
	outline: none;
`;

const StyledTableExpandableUnseen = styled.div.withConfig({ displayName: "StyledTableExpandableUnseen-sc-" })`
	// This style is to fix bug scrollbar on Mac Safari
	-webkit-animation: pulse 0.1s cubic-bezier(0, 1.01, 0.58, 1) infinite;
	height: 0;
	width: 0;
`;

export const ExpandableRowTpl = memo(function ExpandableRowTpl(props: TableTemplateProps.ExpandableRowProps) {
	const mainTableColumns = useTableContext((context) => context.columns);

	const expandableRowWrapperRef = useRef<HTMLDivElement | null>(null);
	const expandableRowRef = useRef<HTMLDivElement | null>(null);
	const contentRow = useRef<HTMLElement | null | undefined>(null);

	const getWrapperRef = useCallback((ref: HTMLDivElement): void => {
		expandableRowWrapperRef.current = ref;
	}, []);

	const getExpandableRowRef = useCallback((ref: HTMLDivElement): void => {
		expandableRowRef.current = ref;
	}, []);

	const onScroll = useCallback((position: TableTemplateProps.HorizontalScrollPosition): void => {
		if (!contentRow.current) {
			return;
		}

		const classList = contentRow.current.classList;
		const newClass = `${BASE_TABLE_CLASSNAME}__contentRow--${position}-scrollbar`;

		if (classList.contains(newClass)) {
			return;
		}

		const classPattern = new RegExp(BASE_TABLE_CLASSNAME + "__contentRow--[a-z]+-scrollbar");

		for (let i = 0; i < classList.length; i++) {
			const className = classList[i];

			if (className.match(classPattern)) {
				classList.remove(className);
			}
		}

		if (position) {
			classList?.add(newClass);
		}
	}, []);

	const rowScrollManager = useMemo(
		() =>
			new RowScrollManager(
				[`${BASE_TABLE_CLASSNAME}__expandable-wrapper`],
				`${BASE_TABLE_CLASSNAME}__expandable-wrapper`,
				onScroll
			),
		[onScroll]
	);

	useEffect(() => {
		if (props.focusOnMount) {
			expandableRowRef.current?.focus();
		}

		contentRow.current = getParentElement(expandableRowWrapperRef.current, (element) => {
			return element.classList.contains(`${BASE_TABLE_CLASSNAME}__contentRow--scroll`);
		})?.parentElement;

		if (!contentRow.current) {
			return;
		}

		if (expandableRowWrapperRef.current) {
			rowScrollManager.addElement(expandableRowWrapperRef.current);
		}

		rowScrollManager.handleTriggerRowScroll();

		return (): void => {
			rowScrollManager.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<StyledTableExpandableWrapper
			id={props.id}
			ref={getWrapperRef}
			className={`${BASE_TABLE_CLASSNAME}__expandable-wrapper`}
			role="cell"
			aria-colspan={mainTableColumns.length}
			data-role={props.dataRole ?? DataRoles.Table.Expandable.Wrapper}
		>
			<StyledTableExpandableRow
				className={joinClassNames(`${BASE_TABLE_CLASSNAME}__expandable-row`, props.className)}
				style={props.style}
				role="form"
				data-role={DataRoles.Table.Expandable.Row}
				ref={getExpandableRowRef}
				tabIndex={props.focusOnMount ? -1 : undefined}
				onBlur={props.onBlur}
				onFocus={props.onFocus}
			>
				{props.children}
			</StyledTableExpandableRow>
			<StyledTableExpandableUnseen className={`${BASE_TABLE_CLASSNAME}__expandable-unseen-div`} />
		</StyledTableExpandableWrapper>
	);
});

ExpandableRowTpl.displayName = "ExpandableRowTpl";
