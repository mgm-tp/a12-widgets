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
import { css, styled } from "styled-components";

import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledDataTableExpandableRowFooter } from "./data-table.expandable-row-footer.tpl.view.js";

/**
 * Block-level body container for the expanded row, sibling to
 * {@link DataTableExpandableRowFooterTpl}. Draws the separator border between
 * Body and Footer when both are present.
 */
export const StyledDataTableExpandableRowBody = styled.div.withConfig({
	displayName: "StyledDataTableExpandableRowBody-sc-"
})(({ theme }) => {
	const { expandable, bodyRow } = theme.components.table;

	return css`
		padding: ${expandable.body.padding};

		& + ${StyledDataTableExpandableRowFooter} {
			border-top: ${bodyRow.borderBottom};
		}
	`;
});

/**
 * Props accepted by {@link DataTableExpandableRowBodyTpl}.
 */
export interface DataTableExpandableRowBodyTplProps {
	/** Body content rendered inside the padded container. */
	children?: ReactNode;
}

/**
 * Block-level body slot for the DataTable expanded row. Pairs with
 * {@link DataTableExpandableRowFooterTpl}.
 *
 * @experimental
 */
export function DataTableExpandableRowBodyTpl({ children }: DataTableExpandableRowBodyTplProps): ReactElement {
	return (
		<StyledDataTableExpandableRowBody data-role={DataRoles.Table.Expandable.Row.Body}>
			{children}
		</StyledDataTableExpandableRowBody>
	);
}

DataTableExpandableRowBodyTpl.displayName = "DataTableExpandableRowBodyTpl";
