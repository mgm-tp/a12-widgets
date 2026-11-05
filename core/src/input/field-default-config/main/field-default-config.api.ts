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

import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";

/**
 * Where tooltips are rendered relative to the control.
 * - `"beside"`: inline, beside the control
 * - `"above"`: on a new line above the control
 * - `"below"`: on a new line below the control
 *
 * This is the vocabulary the per-widget `breakTooltipsToNewLine` property will adopt when it is renamed to
 * `tooltipPosition` in a future breaking release. `"beside"` corresponds to that property's `false`.
 */
export type TooltipPosition = "beside" | "above" | "below";

export interface FieldDefaultConfigProps {
	/**
	 * Where the error, warning and info message boxes are rendered relative to the control.
	 * Applies to every data entry widget and every Text Output in the subtree that does not set
	 * `messagePosition` itself.
	 * @default "above"
	 */
	messagePosition?: MessagePosition;

	/**
	 * Where tooltips are rendered relative to the control.
	 * Applies to every data entry widget in the subtree that does not set `breakTooltipsToNewLine`
	 * itself, and to every Text Output that does not set `tooltipPosition` itself.
	 *
	 * When unset, every widget keeps its own default layout, which differs per widget for backwards
	 * compatibility. Set this to get one uniform tooltip layout across a form.
	 */
	tooltipPosition?: TooltipPosition;
}

/**
 * The subset of a widget's own properties that take part in position resolution, for the widgets
 * that name the tooltip property `breakTooltipsToNewLine`. `Required<FieldOverrideProps>` is the
 * corresponding set of positions such a widget actually renders with.
 * @internal
 */
export interface FieldOverrideProps {
	messagePosition?: MessagePosition;
	breakTooltipsToNewLine?: TooltipLineBreak;
}
