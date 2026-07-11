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

import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Range } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import type { DropDownItem } from "../../dropdown/main/template/dropdown.tpl.api.js";

import type { SelectItem } from "../select/main/select.api.js";
import { Autocomplete } from "../autocomplete/main/autocomplete.view.js";
import { TextField } from "../text-field/main/template/text-field.tpl.view.js";

import { StyledYearSelector, StyledYearSelectorWrapper } from "./year-month-selector.styled.js";
import type { YearSelectorProps } from "./year-selector.api.js";
import type { OptionalYearMonthItem } from "./month-selector.api.js";
import {
	clampRangeToYear,
	detectVariant,
	normalizeAutocompleteValue,
	parseYearDigits,
	resolveYearRange
} from "./year-selector.utils.js";

function TextboxYearSelector({
	year,
	placeholder,
	onBlur,
	fitToParent,
	style,
	dataRole: dataRoleProp,
	onYearChange,
	...baseInputProps
}: YearSelectorProps): ReactElement {
	const dataRole = dataRoleProp || DataRoles.Year.Selector;
	const [inputValue, setInputValue] = useState(year !== undefined ? String(year) : "");
	const lastCommittedRef = useRef<number | undefined>(year);

	useEffect(() => {
		if (year !== lastCommittedRef.current) {
			lastCommittedRef.current = year;
			setInputValue(year !== undefined ? String(year) : "");
		}
	}, [year]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const digits = event.currentTarget.value.replace(/\D/g, "");
		setInputValue(digits);

		const normalizedYear = parseYearDigits(digits);

		if (normalizedYear !== null) {
			const parsed = normalizedYear ? parseInt(normalizedYear, 10) : undefined;

			lastCommittedRef.current = parsed;
			(onYearChange as ((y: number | undefined) => void) | undefined)?.(parsed);
		}
	};

	return (
		<StyledYearSelectorWrapper data-role={dataRole} style={style}>
			<TextField
				{...baseInputProps}
				fitToParent={fitToParent}
				placeholder={placeholder}
				onChange={handleChange}
				inputProps={{
					type: "text",
					inputMode: "numeric",
					pattern: "[0-9]*",
					maxLength: 4,
					value: inputValue,
					"data-role": DataRoles.Year.Selector.Input,
					onBlur
				}}
			/>
		</StyledYearSelectorWrapper>
	);
}

export function YearSelector<T extends undefined | OptionalYearMonthItem = undefined>(
	props: YearSelectorProps<T>
): ReactElement<YearSelectorProps> {
	const {
		year,
		yearRange,
		variant: variantProp,
		placeholder,
		optionalItem,
		autocompleteHintTemplate,
		onYearChange,
		yearSelectRef,
		inputProps,
		className: classNameProp,
		dataRole: dataRoleProp,
		fitToParent,
		onBlur,
		...rest
	} = props;

	const activeVariant = detectVariant(variantProp, yearRange);
	const referenceYear = year ?? new Date().getUTCFullYear();
	const dataRole = dataRoleProp || DataRoles.Year.Selector;

	const resolvedRange = useMemo(() => {
		const base = resolveYearRange(yearRange, referenceYear);

		return clampRangeToYear(base, year);
	}, [yearRange, referenceYear, year]);

	const years: SelectItem[] = useMemo(
		() =>
			Array.from(new Range(resolvedRange.start, resolvedRange.end + 1)).map((item: number) => ({
				label: `${item}`,
				value: `${item}`
			})),
		[resolvedRange]
	);

	const yearStrings = useMemo(() => years.map((yearItem) => yearItem.value as string), [years]);

	const handleYearChange = (yearText?: string): void => {
		if (!onYearChange) {
			return;
		}

		if (!yearText) {
			(onYearChange as (year: number | undefined) => void)(undefined);

			return;
		}

		const parsedYear = parseInt(yearText, 10);

		if (!isNaN(parsedYear)) {
			onYearChange(parsedYear as Parameters<typeof onYearChange>[0]);
		}
	};

	if (activeVariant === "textbox") {
		return <TextboxYearSelector {...(props as YearSelectorProps)} />;
	}

	if (activeVariant === "autocomplete") {
		const handleValueChange = (rawAutocompleteValue: string | unknown): void => {
			const normalized = normalizeAutocompleteValue(rawAutocompleteValue);
			const digits = normalized.replace(/\D/g, "");
			const normalizedYear = parseYearDigits(digits);

			if (normalizedYear === null) {
				return;
			}

			handleYearChange(normalizedYear);
		};

		const autocompleteItems: DropDownItem[] | string[] = optionalItem
			? [
					{ label: optionalItem.label, value: "", isEmptyValue: true },
					...years.map((yearItem) => ({ label: yearItem.label, value: yearItem.value as string }))
				]
			: yearStrings;

		return (
			<StyledYearSelectorWrapper data-role={dataRole} style={rest.style}>
				<Autocomplete
					{...rest}
					enableClearButton={false}
					value={year !== undefined ? String(year) : undefined}
					inputPlaceHolder={placeholder}
					hintTemplate={autocompleteHintTemplate ?? ""}
					onValueChange={handleValueChange}
					items={autocompleteItems}
					inputProps={{
						"data-role": DataRoles.Year.Selector.Input,
						inputMode: "numeric",
						pattern: "[0-9]*",
						maxLength: 4,
						onBlur
					}}
				/>
			</StyledYearSelectorWrapper>
		);
	}

	const firstSelectItem = optionalItem ? [{ label: optionalItem.label, value: "", isEmptyValue: true }] : [];
	const selectItems = [...firstSelectItem, ...years];
	const showPlaceholder = !optionalItem && placeholder !== undefined && year === undefined;
	const selectValue =
		year !== undefined ? `${year}` : optionalItem !== undefined || showPlaceholder ? "" : `${referenceYear}`;

	return (
		<StyledYearSelector
			{...rest}
			fitToParent={fitToParent}
			inputProps={inputProps}
			value={selectValue}
			onValueChanged={handleYearChange}
			className={classNameProp}
			dataRole={dataRole}
			selectRef={yearSelectRef}
			items={selectItems}
			placeholder={showPlaceholder ? placeholder : undefined}
		/>
	);
}

YearSelector.displayName = "YearSelector";
