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
import { useContext, useMemo } from "react";
import { styled, css } from "styled-components";

import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { joinClassNames, getRole } from "../../../common/main/utils.js";
import { createPseudoElement } from "../../../theme/base/mixins/_pseudo.js";

import { useTableContext } from "../table.context.js";
import { BASE_TABLE_CLASSNAME } from "../table.internal.js";

import type { TableTemplateProps } from "./table.tpl.api.js";

export const StyledTableFoot = styled.div.withConfig({ displayName: "StyledTableFoot-sc-" })<{
	hasFootContent?: boolean;
}>(({ theme, hasFootContent }) => {
	const { body, bodyRow, footRow } = theme.components.table;

	return css`
		border-left: ${body.border};
		border-right: ${body.border};
		flex: 0 0 auto;
		overflow: hidden;

		// Adjusts the z-index to ensure the box-shadow is visible, particularly when a sub-info column is present in the table.
		z-index: 1;

		& > * {
			position: relative;
			${createPseudoElement(
				":before",
				css`
					border-bottom: ${bodyRow.borderBottom};
				`
			)}
			&:first-child {
				box-shadow: ${footRow.boxShadow};
			}
		}

		${!hasFootContent &&
		css`
			& > *:first-child:before {
				border-bottom: none;
			}
		`}
	`;
});

export function FootTpl(props: TableTemplateProps.FootProps): ReactElement<TableTemplateProps.FootProps> {
	const { tableTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const cardView = useTableContext((context) => context.cardView);
	const hasFootContent = useTableContext((context) => context.hasFootContent);

	const classNames = useMemo(() => {
		return joinClassNames(`${BASE_TABLE_CLASSNAME}__footer`, props.className);
	}, [props.className]);

	if (cardView) {
		return <></>;
	}

	return (
		<StyledTableFoot
			className={classNames}
			style={props.style}
			id={props.id}
			data-role={props.dataRole || "table-footer"}
			role={getRole(props.role, "rowgroup")}
			aria-label={props.role !== false ? tableTitles?.footerLabel : undefined}
			hasFootContent={hasFootContent}
		>
			{props.children}
		</StyledTableFoot>
	);
}

FootTpl.displayName = "FootTpl";
