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

import type { ReactElement, RefCallback, MouseEvent } from "react";
import { useState, useCallback } from "react";

import {
	noop,
	LayoutGrid,
	FilterSelectorTemplate,
	TimePicker,
	TextField,
	Checkbox,
	Radio,
	MessageBox,
	YearMonthSelector,
	ContentBoxElements,
	Select
} from "@com.mgmtp.a12.widgets/widgets-core";

import { DatePickerInput } from "../../date-picker/date-picker-input.js";

import type { FilterInFilterBarData } from "./data.js";
import { OPTIONS } from "./data.js";

const { Grid, Column, Row } = LayoutGrid;

export namespace FilterViewTemplate {
	export function Date(): ReactElement {
		return (
			<Grid className="h_zeroMargin">
				<FilterSelectorTemplate.Section useDivTag>Start</FilterSelectorTemplate.Section>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						<DatePickerInput />
					</Column>
				</Row>
				<FilterSelectorTemplate.Section useDivTag>End</FilterSelectorTemplate.Section>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						<DatePickerInput />
					</Column>
				</Row>
			</Grid>
		);
	}

	export function Time(): ReactElement {
		return (
			<Grid className="h_zeroMargin">
				<FilterSelectorTemplate.Section useDivTag>Start</FilterSelectorTemplate.Section>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						<TimePicker />
					</Column>
				</Row>
				<FilterSelectorTemplate.Section useDivTag>End</FilterSelectorTemplate.Section>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						<TimePicker />
					</Column>
				</Row>
			</Grid>
		);
	}

	export function Input(): ReactElement {
		return (
			<Grid style={{ marginTop: 12 }}>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 3 }}>
						<TextField placeholder="Placeholder" onChange={() => undefined} />
					</Column>
				</Row>
			</Grid>
		);
	}

	export function ListOption(): ReactElement {
		return (
			<FilterSelectorTemplate.List>
				{OPTIONS.map((option, index) => {
					return (
						<FilterSelectorTemplate.Item key={`option-${index}`} readonly>
							<Checkbox checked={option.active} label={option.label} onChange={noop} id={`option-${index}-checkbox`} />
						</FilterSelectorTemplate.Item>
					);
				})}
			</FilterSelectorTemplate.List>
		);
	}

	export function RadioOptions(): ReactElement {
		const [value, setValue] = useState("1");

		const onValueChanged = useCallback((value: string): void => {
			setValue(value);
		}, []);

		return (
			<Radio name="radiogroup" className="-u-padding-base" value={value} onValueChanged={onValueChanged}>
				<Radio.Item label="Yes" value="1" />
				<Radio.Item label="No" value="0" />
			</Radio>
		);
	}

	export function Error(): ReactElement {
		return (
			<>
				<MessageBox focusOnMessage={false} label="The start value must not be bigger than the end value" />
				<Grid className="h_zeroMargin">
					<FilterSelectorTemplate.Section useDivTag>Start</FilterSelectorTemplate.Section>
					<Row>
						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<YearMonthSelector month={11} year={2018} error />
						</Column>
					</Row>
					<FilterSelectorTemplate.Section useDivTag>End</FilterSelectorTemplate.Section>
					<Row>
						<Column size={{ sm: 12, md: 12, lg: 12 }}>
							<YearMonthSelector month={0} year={2018} error />
						</Column>
					</Row>
				</Grid>
			</>
		);
	}

	export function YearMonth(): ReactElement {
		return (
			<Grid className="h_zeroMargin">
				<FilterSelectorTemplate.Section useDivTag>Start</FilterSelectorTemplate.Section>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						<YearMonthSelector
							optionalYearItem={{ label: "Year" }}
							optionalMonthItem={{ label: "Month" }}
							label="Select month and year"
						/>
					</Column>
				</Row>
				<FilterSelectorTemplate.Section useDivTag>End</FilterSelectorTemplate.Section>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						<YearMonthSelector
							optionalYearItem={{ label: "Year" }}
							optionalMonthItem={{ label: "Month" }}
							label="Select month and year"
						/>
					</Column>
				</Row>
			</Grid>
		);
	}

	export function ActionButtons(props: {
		type: string;
		inputRef?: RefCallback<HTMLInputElement>;
	}): ReactElement<{ type: string }> {
		return (
			<ContentBoxElements.SubActionBar>
				<FilterSelectorTemplate.ActionBar>
					{props.type !== "enum" && (
						<Select
							value={props.type}
							selectRef={props.inputRef}
							items={[
								{ label: "Date", value: "date" },
								{ label: "Month", value: "month" },
								{ label: "Year", value: "year" },
								{ label: "Year & Month", value: "year-month" }
							]}
						/>
					)}
					{props.type === "enum" && (
						<FilterSelectorTemplate.SearchInput
							onChange={noop}
							placeholder="Filter Option Search"
							inputRef={props.inputRef}
						/>
					)}
				</FilterSelectorTemplate.ActionBar>
			</ContentBoxElements.SubActionBar>
		);
	}

	type FilterOptionProps = FilterInFilterBarData & {
		inputRef?: RefCallback<HTMLInputElement>;
		buttonSearchRef?: RefCallback<HTMLButtonElement>;
		buttonSearchClick?(event: MouseEvent<HTMLElement>): void;
		noTitle?: boolean;
	};

	export function FilterOptions(props: FilterOptionProps): ReactElement {
		let content;

		switch (props.optionType) {
			case "enum": {
				content = <FilterViewTemplate.ListOption />;
				break;
			}

			case "date": {
				content = <FilterViewTemplate.Date />;
				break;
			}

			case "time": {
				content = <FilterViewTemplate.Time />;
				break;
			}

			case "radio": {
				content = <FilterViewTemplate.RadioOptions />;
				break;
			}

			case "error": {
				content = <FilterViewTemplate.Error />;
				break;
			}

			case "year-month": {
				content = <FilterViewTemplate.YearMonth />;
				break;
			}

			default: {
				content = <FilterViewTemplate.Input />;
			}
		}

		return (
			<FilterSelectorTemplate.Content
				headingElements={!props.noTitle && <ContentBoxElements.Title text={props.name} ariaLevel={2} />}
				subActionBar={
					(props.optionType === "date" || props.optionType === "enum" || props.optionType === "year-month") && (
						<FilterViewTemplate.ActionButtons type={props.optionType} />
					)
				}
				padding={false}
			>
				{content}
			</FilterSelectorTemplate.Content>
		);
	}
}
