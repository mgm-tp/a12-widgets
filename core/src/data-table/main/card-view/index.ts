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

/**
 * The `cardView` layout: a `role="list"` of cards, rendered instead of — never on
 * top of — the `<table>` layout in `../template/`. The two subtrees are mutually
 * exclusive and share no CSS; the orchestrator picks one root template and one slot
 * set per render.
 */

export type { DataTableCardsTplProps } from "./data-table.cards.tpl.view.js";
export { DataTableCardsTpl, StyledDataTableCards, StyledDataTableCardsViewport } from "./data-table.cards.tpl.view.js";

export type { DataTableCardListTplProps } from "./data-table.card-list.tpl.view.js";
export { DataTableCardListTpl, StyledDataTableCardList } from "./data-table.card-list.tpl.view.js";

export type { DataTableCardTplProps, DataTableCardTplStyles } from "./data-table.card.tpl.view.js";
export { DataTableCardTpl, StyledDataTableCard, StyledDataTableCardOverlay } from "./data-table.card.tpl.view.js";

export type { DataTableCardFieldTplProps, DataTableCardFieldTplStyles } from "./data-table.card-field.tpl.view.js";
export {
	DataTableCardFieldTpl,
	StyledDataTableCardField,
	StyledDataTableCardFieldLabel,
	StyledDataTableCardFieldValue
} from "./data-table.card-field.tpl.view.js";

export type { DataTableCardPlaceholderTplProps } from "./data-table.card-placeholder.tpl.view.js";
export {
	DataTableCardPlaceholderFieldTpl,
	DataTableCardPlaceholderTpl,
	StyledDataTableCardEmptyState,
	StyledDataTableCardPlaceholder
} from "./data-table.card-placeholder.tpl.view.js";

/*
 * The windowed card bodies (`DataTableVirtualizedCardBody`,
 * `DataTableInfiniteScrollCardBody`, `DataTableWindowedCardList`) are deliberately not
 * re-exported: they are `@internal`, exactly like the table layout's
 * `DataTableVirtualizedBody` / `DataTableInfiniteScrollBody`, and `stripInternal` drops
 * their declarations from the emitted types. `cardView` wires them in through
 * `DataTableCardViewSlots`; a consumer replacing them supplies its own
 * `virtualizedBody` / `infiniteScrollBody` slot.
 */

export {
	DataTableCard,
	DataTableCardField,
	DataTableCardList,
	DataTableCardPlaceholder,
	DataTableCardPlaceholderField,
	DataTableCardViewSlots
} from "./card-view-slots.js";
