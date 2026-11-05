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
import { Children, Fragment, cloneElement, isValidElement } from "react";

import type { Styleable } from "./base-props.js";
import { joinClassNames } from "./utils.js";

/**
 * Applies `tooltipClassName` to every tooltip a `tooltips` prop was given.
 *
 * Element tooltips get the class merged into their own `className`. Strings, numbers and fragments
 * cannot carry a class, so they are wrapped in a `span` instead — cloning a fragment would make
 * React reject the `className` and drop the tooltip.
 *
 * @internal
 */
export function renderTooltips(tooltips: ReactNode, tooltipClassName: string): ReactNode {
	return (
		tooltips &&
		Children.map(tooltips, (tooltip, index) => {
			// Children.map still invokes this for the children React itself drops, so skip them here
			// instead of wrapping them into empty spans.
			if (tooltip === null || tooltip === undefined || typeof tooltip === "boolean") {
				return null;
			}

			const key = `tooltip-${index}`;

			if (isValidElement<Styleable>(tooltip) && tooltip.type !== Fragment) {
				return cloneElement(tooltip, {
					key,
					className: joinClassNames(tooltip.props.className, tooltipClassName)
				});
			}

			return (
				<span key={key} className={tooltipClassName}>
					{tooltip}
				</span>
			);
		})
	);
}
