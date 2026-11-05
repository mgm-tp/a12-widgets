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
import { useContext } from "react";

import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { useDataTableContext } from "../data-table.context.js";

/**
 * The screen-reader-only text a head cell renders next to its visible label, or
 * `undefined` when it renders none. Shared with the head cell so it can reference the
 * rendered span by id (`aria-labelledby`) only when the span exists.
 *
 * - `hiddenText === ""` opts out entirely.
 * - An explicit `hiddenText` wins.
 * - An action column without one falls back to the table-wide `actionColumnHiddenText`,
 *   then to the localized `actionTitle`.
 *
 * @internal
 */
export function resolveHeadHiddenText(opts: {
	hiddenText?: string;
	actionColumn?: boolean;
	contextHiddenText?: string;
	fallbackTitle?: string;
}): string | undefined {
	const { hiddenText, actionColumn, contextHiddenText, fallbackTitle } = opts;

	if (hiddenText === "") {
		return undefined;
	}

	if (hiddenText) {
		return hiddenText;
	}

	if (!actionColumn) {
		return undefined;
	}

	return contextHiddenText ?? fallbackTitle ?? undefined;
}

export interface HeadHiddenTextProps {
	hiddenText?: string;
	actionColumn?: boolean;

	/** `id` for the rendered span, so the host cell can reference it via `aria-labelledby`. */
	id?: string;
}

/**
 * Screen-reader-only text for a head cell — the column's `hiddenText`, or for an action
 * column without one, the table-wide `actionColumnHiddenText` / localized `actionTitle`.
 * Renders nothing when {@link resolveHeadHiddenText} yields no text.
 *
 * @experimental
 */
export function HeadHiddenText({ hiddenText, actionColumn, id }: HeadHiddenTextProps): ReactElement | null {
	const contextHiddenText = useDataTableContext().actionColumnHiddenText;
	const { tableTitles } = useContext(A11YLanguageContext);
	const text = resolveHeadHiddenText({
		hiddenText,
		actionColumn,
		contextHiddenText,
		fallbackTitle: tableTitles?.actionTitle
	});

	return text ? <HiddenText id={id}>{text}</HiddenText> : null;
}

HeadHiddenText.displayName = "HeadHiddenText";
