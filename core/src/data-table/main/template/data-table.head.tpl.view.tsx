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

import type { Container, DataRole, Identifiable, Styleable } from "../../../common/main/base-props.js";

import { useDataTableContext } from "../data-table.context.js";

export interface DataTableHeadTplProps extends Container, DataRole, Identifiable, Styleable {
	/** Accessible label for the header landmark. */
	ariaLabel?: string;
}

/**
 * DataTable table `<thead>` wrapper. Layout-only — descendant selectors on
 * `StyledDataTable` provide all visual styling.
 *
 * @experimental
 */
export function DataTableHeadTpl({
	ariaLabel,
	className,
	style,
	id,
	dataRole,
	children
}: DataTableHeadTplProps): ReactElement {
	// (tree)grid mode overrides the table role, dropping the native `<thead>`
	// rowgroup mapping, so restate it as `role="rowgroup"`.
	const gridRole = useDataTableContext((ctx) => ctx.gridRole);

	return (
		<thead
			className={className}
			style={style}
			id={id}
			data-role={dataRole}
			role={gridRole ? "rowgroup" : undefined}
			aria-label={ariaLabel}
		>
			{children}
		</thead>
	);
}

DataTableHeadTpl.displayName = "DataTableHeadTpl";
