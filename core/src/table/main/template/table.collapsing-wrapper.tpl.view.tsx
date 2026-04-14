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

import type { ReactElement } from "react";
import { memo, useRef, useCallback } from "react";

import type { TableTemplateProps } from "./table.tpl.api.js";
import { useRowScrollManager } from "./table.tpl.utils.js";
import { StyledTableContextProvider, useOptimalTableContextValue } from "./table.context.styled.js";

/** @internal */
export const CollapsingWrapper = memo(function CollapsingWrapper(
	props: TableTemplateProps.CollapsingWrapperProps
): ReactElement<TableTemplateProps.CollapsingWrapperProps> | null {
	const { wrapperRef } = props;
	const ref = useRef<HTMLDivElement | null>(null);
	const getRef = useCallback(
		(param: HTMLDivElement | null) => {
			wrapperRef?.(param);
			ref.current = param;
		},
		[wrapperRef]
	);

	useRowScrollManager(ref);

	const contextValue = useOptimalTableContextValue({ rowSegmentType: props.rowSegmentType });

	return (
		<StyledTableContextProvider value={contextValue}>
			<div
				className={props.className}
				style={props.style}
				id={props.id}
				data-role={props.dataRole}
				role={props.role}
				ref={getRef}
				tabIndex={props.tabIndex}
			>
				{props.children}
			</div>
		</StyledTableContextProvider>
	);
});

CollapsingWrapper.displayName = "CollapsingWrapper";
