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

import type { FC } from "react";
import { useState, useCallback } from "react";

import { YearMonthSelector, getDefaultMonths } from "@com.mgmtp.a12.widgets/widgets-core";

export const YearMonthSelectorWithOptionalValue: FC = () => {
	const [month, setMonth] = useState<number | undefined>();
	const [year, setYear] = useState<number | undefined>();
	const months = getDefaultMonths();

	const onChange = useCallback((month?: number, year?: number): void => {
		setMonth(month);
		setYear(year);
	}, []);

	return (
		<div className="-u-width-full">
			<p>
				<strong>Selected month value: </strong> {month !== undefined ? months[month] : ""}
			</p>
			<p>
				<strong>Selected year value: </strong> {year}
			</p>
			<YearMonthSelector
				id="optional-month-value-selector"
				label="Optional month value"
				month={month}
				year={year}
				onValueChange={onChange}
				yearPlaceholder="YYYY"
				optionalMonthItem={{ label: "Optional Month item" }}
			/>
			<br />
			<YearMonthSelector
				id="optional-year-value-selector"
				label="Optional year value"
				month={month}
				year={year}
				onValueChange={onChange}
				yearSelectorVariant="select"
				optionalYearItem={{ label: "Optional Year item" }}
			/>
			<br />
			<YearMonthSelector
				id="optional-year-and-month-value-selector"
				label="Optional year and month values"
				month={month}
				year={year}
				onValueChange={onChange}
				yearSelectorVariant="select"
				optionalYearItem={{ label: "Optional Year item" }}
				optionalMonthItem={{ label: "Optional Month item" }}
			/>
		</div>
	);
};
