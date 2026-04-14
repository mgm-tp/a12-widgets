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
import { styled, css } from "styled-components";

import { joinClassNames, getRole } from "../../../common/main/utils.js";

import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";

export const StyledTableExpandableRowFooter = styled.div.withConfig({
	displayName: "StyledTableExpandableRowFooter-sc-"
})(({ theme }) => {
	const { expandable } = theme.components.table;

	return css`
		display: flex;
		min-height: ${expandable.footer.minHeight};
		padding: ${expandable.footer.padding};
	`;
});

export function ExpandableRowFooterTpl(props: TableTemplateProps.ExpandableRowFooterProps): ReactElement {
	const { className, wrapperRef, role, ...rest } = props;

	return (
		<StyledTableExpandableRowFooter
			className={joinClassNames(`${BASE_TABLE_CLASSNAME}__expandable-row-footer`, props.className)}
			ref={props.wrapperRef}
			role={getRole(props.role)}
			data-role={props.dataRole ?? "table-expandable-row-footer"}
			{...rest}
		/>
	);
}

ExpandableRowFooterTpl.displayName = "ExpandableRowFooterTpl";
