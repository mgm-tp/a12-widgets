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

import type { FC, FocusEvent } from "react";
import { useState } from "react";

import { YearSelector } from "@com.mgmtp.a12.widgets/widgets-core";

import { validateYearOnBlur } from "./year-selector-validation.utils.js";

export const BasicYearSelector: FC = () => {
	const [year, setYear] = useState<number>();
	const [errorMessage, setErrorMessage] = useState<string>();
	const [hiddenLabelErrorMessage, setHiddenLabelErrorMessage] = useState<string>();

	const handleYearChange = (value?: number): void => {
		setYear(value);
	};

	const validationRange = { min: 1900, max: new Date().getFullYear() };

	const handleBlur = (ev: FocusEvent<HTMLInputElement>): void => {
		setErrorMessage(validateYearOnBlur(ev, validationRange));
	};

	const handleHiddenLabelBlur = (event: FocusEvent<HTMLInputElement>): void => {
		setHiddenLabelErrorMessage(validateYearOnBlur(event, validationRange));
	};

	return (
		<div className="-u-width-full">
			<YearSelector
				id="simple-year-selector"
				label="Simple Year Selector"
				year={year}
				onYearChange={handleYearChange}
				onBlur={handleBlur}
				placeholder="YYYY"
				errorMessage={errorMessage}
			/>
			<br />
			<YearSelector
				id="hidden-label-selector"
				year={year}
				onYearChange={handleYearChange}
				label="Hidden Label Year Selector"
				hideLabel
				placeholder="YYYY"
				onBlur={handleHiddenLabelBlur}
				errorMessage={hiddenLabelErrorMessage}
			/>
		</div>
	);
};
