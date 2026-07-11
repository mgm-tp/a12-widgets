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
import { useCallback, useState } from "react";
import { css, styled } from "styled-components";

import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import type { Orientation } from "../../../common/main/alignment.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { StyledListItemWrapper } from "../../../list/main/list.styled.js";

const ORIENTATION_LIST: Orientation[] = ["bottom-start", "bottom-end", "top-start", "top-end"];

const StyledContextMenuDialog = styled.div
	.attrs({
		"data-role": DataRoles.Table.ContextMenu
	})
	.withConfig({ displayName: "StyledDataTableContextMenuDialog-sc-" })(({ theme }) => {
	const { contextMenu } = theme.components.table;

	return css`
		box-shadow: ${contextMenu.boxShadow};
		outline-style: none;
		overflow: hidden auto;

		${StyledListItemWrapper} {
			border: none;
		}
	`;
});

export interface DataTableContextMenuTplProps {
	position: { top: number; left: number };
	closeHandler: () => void;
	children: ReactNode;
}

/**
 * DataTable context-menu portal wrapper. Opens at the cursor position via
 * {@link AttachedPortal}.
 *
 * @experimental
 */
export function DataTableContextMenuTpl({
	position,
	closeHandler,
	children
}: DataTableContextMenuTplProps): ReactElement {
	const [isTopEnd, setIsTopEnd] = useState(false);

	const onVisibilityChange = useCallback(
		(isVisible: boolean) => {
			if (!isVisible) {
				closeHandler();
			}
		},
		[closeHandler]
	);

	const onOrientationChange = useCallback((orientation: Orientation) => {
		setIsTopEnd(orientation === "top-end");
	}, []);

	return (
		<AttachedPortal
			position={position}
			fixedOrientation
			adjustPositionToScreen
			closeOnOutsideClick
			closeOnEsc
			onClickOutside={closeHandler}
			onVisibilityChange={onVisibilityChange}
			orientationList={ORIENTATION_LIST}
			onOrientationChange={onOrientationChange}
			className={joinClassNames(addPrefix("-u-margin-3xs"), { "-u-negative-margin-l-3xs": isTopEnd })}
		>
			<StyledContextMenuDialog>{children}</StyledContextMenuDialog>
		</AttachedPortal>
	);
}

DataTableContextMenuTpl.displayName = "DataTableContextMenuTpl";
