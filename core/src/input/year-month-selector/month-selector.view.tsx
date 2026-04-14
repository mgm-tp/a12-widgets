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

import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import { getDefaultMonths } from "../../common/main/date-time/date-utils.js";
import { DateTimeContext } from "../../common/main/date-time/date-time-context.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { SelectItem } from "../select/main/select.api.js";

import type { MonthSelectorProps, OptionalYearMonthItem } from "./month-selector.api.js";
import { StyledMonthSelector } from "./year-month-selector.styled.js";

export function MonthSelector<T extends undefined | OptionalYearMonthItem = undefined>(
	props: MonthSelectorProps<T>
): ReactElement<MonthSelectorProps> {
	const {
		className,
		month,
		months: customMonths,
		onMonthChange,
		monthSelectRef,
		dataRole,
		optionalItem,
		...rest
	} = props;
	const { locale } = useContext(DateTimeContext);
	const months = customMonths ?? getDefaultMonths(locale);

	const hasOptionalItem = (
		value: string,
		_onMonthChange: (month: T extends OptionalYearMonthItem ? number | undefined : number) => void
	): _onMonthChange is (month: number | undefined) => void => {
		return !Number(value);
	};

	const onValueChanged = (value: string): void => {
		if (!props.onMonthChange) {
			return;
		}

		if (value !== "0" && hasOptionalItem(value, props.onMonthChange)) {
			props.onMonthChange(undefined);
		} else {
			props.onMonthChange(Number(value));
		}
	};

	const monthDataRole = dataRole || DataRoles.Month.Selector;
	const selectItems: SelectItem[] = months.map((item: string, index: number) => ({ label: item, value: `${index}` }));

	return (
		<StyledMonthSelector
			value={`${month}`}
			onValueChanged={onValueChanged}
			items={optionalItem ? [optionalItem, ...selectItems] : selectItems}
			className={joinClassNames(addPrefix("month-selector"), className)}
			dataRole={monthDataRole}
			selectRef={monthSelectRef}
			{...rest}
		/>
	);
}

MonthSelector.displayName = "MonthSelector";
