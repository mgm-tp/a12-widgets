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
import { useMemo } from "react";

import { joinClassNames, Range, addPrefix } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { SelectItem } from "../select/main/select.api.js";

import { StyledYearSelector } from "./year-month-selector.styled.js";
import type { YearRange, YearSelectorProps } from "./year-selector.api.js";
import type { OptionalYearMonthItem } from "./month-selector.api.js";

export function YearSelector<T extends undefined | OptionalYearMonthItem = undefined>(
	props: YearSelectorProps<T>
): ReactElement<YearSelectorProps> {
	const itemValue = props.year ?? (props.optionalItem ? undefined : new Date().getUTCFullYear());

	const hasOptionalItem = (
		value: string,
		_onYearChange: (year: T extends OptionalYearMonthItem ? number | undefined : number) => void
	): _onYearChange is (year: number | undefined) => void => {
		return !Number(value);
	};

	const onValueChanged = (value: string): void => {
		if (!props.onYearChange) {
			return;
		}

		if (hasOptionalItem(value, props.onYearChange)) {
			props.onYearChange(undefined);
		} else {
			props.onYearChange(Number(value));
		}
	};

	const yearRange = useMemo((): YearRange => {
		const year = props.year || new Date().getUTCFullYear();

		return {
			start: props.yearRange?.start || year - 6,
			end: props.yearRange?.end || year + 7
		};
	}, [props.yearRange, props.year]);

	const years: SelectItem[] = useMemo(
		() =>
			Array.from(new Range(yearRange.start, yearRange.end + 1)).map((item: number) => ({
				label: `${item}`,
				value: `${item}`
			})),
		[yearRange]
	);

	return (
		<StyledYearSelector
			{...props}
			value={`${itemValue}`}
			onValueChanged={onValueChanged}
			className={joinClassNames(addPrefix("year-selector"), props.className)}
			dataRole={props.dataRole || DataRoles.Year.Selector}
			selectRef={props.yearSelectRef}
			items={props.optionalItem ? [{ label: props.optionalItem.label }, ...years] : years}
		/>
	);
}

YearSelector.displayName = "YearSelector";
