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

import type { ReactElement, Ref } from "react";
import { css, styled } from "styled-components";

import type { Container, DataRole, Identifiable, Styleable } from "../../../common/main/base-props.js";
import { DataRoles } from "../../../common/main/data-roles.js";

/**
 * The card stack. A flex column rather than a block flow so the gap between cards
 * is a real `gap` — no collapsing margins to reason about, and no trailing margin
 * under the last card.
 */
export const StyledDataTableCardList = styled.div.withConfig({ displayName: "StyledDataTableCardList-sc-" })(
	({ theme }) => {
		const { table } = theme.components;

		return css`
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: ${table.cardView.list.gap};
			/* Block padding only. The inline inset comes from the card's own
			 * \`cardView.bodyRow.width\` (a percentage of this container), so padding the
			 * list horizontally too would inset every card twice. */
			padding: ${table.cardView.list.blockPadding} 0;
		`;
	}
);

export interface DataTableCardListTplProps extends Container, DataRole, Identifiable, Styleable {
	/** `data-role` for the list. Defaults to {@link DataRoles.Table.Card.List}. */
	dataRole?: string;

	/** Forwarded ref to the list element (windowed bodies attach the virtualizer here). */
	listRef?: Ref<HTMLDivElement>;
}

/**
 * DataTable card-view body: the `role="list"` container holding one `listitem` card
 * per data row. This is the card layout's `<tbody>` — with the list semantics stated
 * natively on the element instead of overriding a table role, which is why no card
 * template needs `role="presentation"` anywhere.
 *
 * @experimental
 */
export function DataTableCardListTpl({
	className,
	style,
	id,
	dataRole,
	listRef,
	children
}: DataTableCardListTplProps): ReactElement {
	return (
		<StyledDataTableCardList
			ref={listRef}
			className={className}
			style={style}
			id={id}
			data-role={dataRole ?? DataRoles.Table.Card.List}
			role="list"
		>
			{children}
		</StyledDataTableCardList>
	);
}

DataTableCardListTpl.displayName = "DataTableCardListTpl";
