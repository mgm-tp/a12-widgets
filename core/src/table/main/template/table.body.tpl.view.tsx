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
import { useMemo } from "react";
import { styled, css } from "styled-components";

import { joinClassNames, getRole } from "../../../common/main/utils.js";

import { useTableContext } from "../table.context.js";
import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import { CollapsingWrapper } from "./table.collapsing-wrapper.tpl.view.js";
import type { TableTemplateProps } from "./table.tpl.api.js";

export const StyledTableBody = styled(CollapsingWrapper).withConfig({ displayName: "StyledTableBody-sc-" })<{
	cardView?: boolean;
}>(({ theme, cardView }) => {
	const { body } = theme.components.table;

	return css`
		border: ${body.border};
		border-bottom: transparent;
		outline: none;
		&:focus {
			border: ${body.focusBorder};
		}
		&:not(:empty) {
			flex: 1 1 auto;
			overflow-x: hidden;
		}
		overflow: ${cardView && "auto"};
	`;
});

export function BodyTpl(props: TableTemplateProps.BodyProps): ReactElement<TableTemplateProps.BodyProps> {
	const classNames = useMemo(() => {
		return joinClassNames(`${BASE_TABLE_CLASSNAME}__content`, props.className);
	}, [props.className]);
	const cardView = useTableContext((context) => context.cardView);

	return (
		<StyledTableBody
			className={classNames}
			style={props.style}
			id={props.id}
			dataRole={props.dataRole || "table-body"}
			role={getRole(props.role, "rowgroup")}
			wrapperRef={props.bodyRef}
			tabIndex={props.tabIndex === false ? undefined : (props.tabIndex ?? 0)}
			cardView={cardView}
		>
			{props.children}
		</StyledTableBody>
	);
}

BodyTpl.displayName = "BodyTpl";
