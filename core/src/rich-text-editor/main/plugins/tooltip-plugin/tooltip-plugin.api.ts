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

import type { ReactNode } from "react";

import type { InlineStyleTextNode } from "../../nodes/index.js";

import type { TooltipPluginProps } from "./view/tooltip.api.js";

export interface TooltipTerm {
	/**
	 * Trigger tooltip for text matching this regex.
	 * - If it is defined, the tooltip is shown only when the text matches the given pattern.
	 * - Otherwise, the tooltip becomes the default fallback for any text with the `editorThemeClasses.withDefaultTooltipWord` class.
	 */
	regex?: RegExp;

	/**
	 * Renders the content of the tooltip.
	 */
	render?: (triggerTextNode?: InlineStyleTextNode) => ReactNode;
}

export interface TooltipPluginConfig {
	/**
	 * The terms that lead to the tooltip being displayed.
	 */
	customTerms?: TooltipTerm[];

	/**
	 * How to trigger the tooltip. TriggerMode is the alias for "focus" | "hover"
	 * @default hover
	 */
	triggerMode?: TooltipPluginProps.TriggerMode;
}
