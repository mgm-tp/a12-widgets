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

import type { FC, ReactNode, ChangeEvent, ReactElement } from "react";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";

import {
	DateTimeUtils,
	Key as CustomKey,
	Checkbox,
	Radio,
	ContentBoxElements,
	FilterSelectorTemplate,
	Icon,
	LayoutGrid,
	List,
	MessageBox,
	PopUpMenu,
	TextField,
	TimePicker,
	Message
} from "@com.mgmtp.a12.widgets/widgets-core";

import { DateInput } from "./date-input.js";
import type { Data, FilterOption, ListOperationType } from "./data.js";
import * as FacetedSearchUtils from "./common.js";
import { isValid, mapFilterOptions } from "./utils.js";

const { Grid, Row, Column } = LayoutGrid;

export namespace FilterView {
	export interface ViewProps {
		filter: Data;
		isMobile?: boolean;
		getOptionData?(optionData: string, operation?: ListOperationType): void;
	}

	const dateFormat = "MM/DD/YYYY";
	const timeFormat = "hh:mm A";

	export const DateView: FC<ViewProps> = (props) => {
		const { filter, getOptionData } = props;

		const getInitialDates = useMemo(() => {
			const options = filter.options;
			let startDate;
			let endDate;
			let startTime;
			let endTime;

			if (options && options !== "" && options !== "Inactive") {
				const dates: (string | undefined)[] = options.split(" ");

				if (options.startsWith("To")) {
					endDate = DateTimeUtils.parseDateTimeUTC(dates[1] ?? "", dateFormat);
					endTime = DateTimeUtils.parseDateTimeUTC(dates[2]?.concat(" ", dates[3] ?? "") ?? "", timeFormat);
				} else if (options.startsWith("From")) {
					startDate = DateTimeUtils.parseDateTimeUTC(dates[1] ?? "", dateFormat);
					startTime = DateTimeUtils.parseDateTimeUTC(dates[2]?.concat(" ", dates[3] ?? "") ?? "", timeFormat);

					if (options.includes("to")) {
						endDate = DateTimeUtils.parseDateTimeUTC((startTime ? dates[5] : dates[3]) ?? "", dateFormat);
						endTime = DateTimeUtils.parseDateTimeUTC(dates[6]?.concat(" ", dates[7] ?? "") ?? "", timeFormat);
					}
				}
			}

			return { startDate, endDate, startTime, endTime };
		}, [filter.options]);

		const [startDate, setStartDate] = useState<Date | undefined>(getInitialDates.startDate);
		const [endDate, setEndDate] = useState<Date | undefined>(getInitialDates.endDate);
		const [startTime, setStartTime] = useState<Date | undefined>(getInitialDates.startTime);
		const [endTime, setEndTime] = useState<Date | undefined>(getInitialDates.endTime);
		const [errorStartTimeMessage, setErrorStartTimeMessage] = useState<string | undefined>(undefined);
		const [errorEndTimeMessage, setErrorEndTimeMessage] = useState<string | undefined>(undefined);

		const formatDateTime = useCallback((date: Date, time: Date): string => {
			return DateTimeUtils.formatUTCDateTime(
				DateTimeUtils.combineDateAndTime(date, time),
				undefined,
				`${dateFormat} ${timeFormat}`
			);
		}, []);

		const isValidDate = useCallback((): boolean | undefined => {
			if (!startDate || !endDate) {
				return true;
			}

			return startDate <= endDate;
		}, [endDate, startDate]);

		useEffect((): void => {
			const startDateTime =
				startDate && (startTime ? formatDateTime(startDate, startTime) : startDate.toLocaleDateString());
			const endDateTime = endDate && (endTime ? formatDateTime(endDate, endTime) : endDate.toLocaleDateString());
			let text = "";

			if (startDate && !endDate) {
				text = `From ${startDateTime}`;
			}

			if (!startDate && endDate) {
				text = `To ${endDateTime}`;
			}

			if (startDate && endDate) {
				text = `From ${startDateTime} to ${endDateTime}`;
			}

			getOptionData?.(isValidDate() ? text : "");
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [endDate, endTime, startDate, startTime]);

		const getDate = useCallback((selectedDay: Date | undefined, endDate?: boolean): void => {
			if (endDate) {
				setEndDate(selectedDay);

				return;
			}

			setStartDate(selectedDay);
		}, []);

		const isValidDateTime = useCallback((): boolean | undefined => {
			if (startDate && startTime) {
				if (endTime) {
					if (!endDate) {
						return false;
					}

					if (startTime > endTime && startDate < endDate) {
						return true;
					}

					return startTime <= endTime;
				}

				return true;
			}

			if (endDate && endTime) {
				if (startTime) {
					if (!startDate) {
						return false;
					}

					if (startTime > endTime && startDate < endDate) {
						return true;
					}

					return startTime <= endTime;
				}

				return true;
			}

			return !startTime && !endTime;
		}, [endDate, endTime, startDate, startTime]);

		const onTimeChange = useCallback((time?: Date, endTime?: boolean): void => {
			if (endTime) {
				setEndTime(time);
				setErrorEndTimeMessage(undefined);

				return;
			}

			setStartTime(time);
			setErrorStartTimeMessage(undefined);
		}, []);

		const onValidate = useCallback((value?: string, valid?: boolean, endTime?: boolean): void => {
			if (endTime) {
				setErrorEndTimeMessage(!valid ? value : undefined);

				return;
			}

			setErrorStartTimeMessage(!valid ? value : undefined);
		}, []);

		const renderErrorTimeMessage = useMemo(
			() =>
				(endTime?: boolean): ReactNode => {
					return `Invalid time: ${endTime ? errorEndTimeMessage : errorStartTimeMessage}`;
				},
			[errorEndTimeMessage, errorStartTimeMessage]
		);

		return (
			<>
				{!isValidDate() && <MessageBox label="Start date must before or same with end date" />}
				{!isValidDateTime() && (
					<MessageBox label="The time must be defined with the date. If dates are same, start time must be before or same wih end time." />
				)}
				<FilterSelectorTemplate.Section useDivTag>Trip Start</FilterSelectorTemplate.Section>
				<Grid>
					<Row>
						<Column size={{ sm: 6, md: 6, lg: 6 }}>
							<DateInput defaultValue={startDate} onSelectedDayChange={getDate} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 6 }}>
							<TimePicker
								value={startTime}
								errorMessage={errorStartTimeMessage && renderErrorTimeMessage()}
								onValidate={({ value, valid }) => onValidate(value, valid)}
								onChange={onTimeChange}
								placeholder={timeFormat}
							/>
						</Column>
					</Row>
				</Grid>
				<FilterSelectorTemplate.Section useDivTag>Trip End</FilterSelectorTemplate.Section>
				<Grid>
					<Row>
						<Column size={{ sm: 6, md: 6, lg: 6 }}>
							<DateInput defaultValue={endDate} onSelectedDayChange={(date) => getDate(date, true)} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 6 }}>
							<TimePicker
								value={endTime}
								errorMessage={errorEndTimeMessage && renderErrorTimeMessage(true)}
								onValidate={({ value, valid }) => onValidate(value, valid, true)}
								onChange={(time: Date) => onTimeChange(time, true)}
								placeholder={timeFormat}
							/>
						</Column>
					</Row>
				</Grid>
			</>
		);
	};

	export const Input: FC<ViewProps> = (props) => {
		const { getOptionData } = props;
		const { options, optionType } = props.filter;
		const [text, setText] = useState(!options || options === "Inactive" ? "" : options);
		const [showError, setShowError] = useState(false);

		const onTextChange = useCallback(
			(ev: ChangeEvent<HTMLInputElement>): void => {
				setText(ev.target.value);
				setShowError(!isValid(ev.target.value, optionType));
				getOptionData?.(ev.target.value);
			},
			[getOptionData, optionType]
		);

		return (
			<>
				{showError && <MessageBox className="-u-margin-b-sm" label="Value must be number" />}
				<TextField placeholder="Placeholder" onChange={onTextChange} value={text} />
			</>
		);
	};

	export const ListOption: FC<ViewProps> = (props) => {
		const { getOptionData, filter, isMobile } = props;
		const searchInputRef = useRef<HTMLElement | null>(null);
		const [filterOptions, setFilterOptions] = useState<FilterOption[]>(
			mapFilterOptions(filter.options || "", filter.id)
		);
		const [searchText, setSearchText] = useState("");
		const [operation, setOperation] = useState<ListOperationType>(filter.operation || "or");
		const [isPopupButtonActive, setIsPopupButtonActive] = useState(false);

		const getNewOptionData = useCallback(
			(filterOptions: FilterOption[], newOperation?: ListOperationType): void => {
				const text = filterOptions
					.filter((option) => option.active)
					.map((activeOption) => activeOption.label)
					.join(", ");

				getOptionData?.(text, newOperation || operation);
			},
			[getOptionData, operation]
		);

		const toggleOption = useCallback(
			(label: string): void => {
				const newFilterOptions = filterOptions.map((option) => {
					if (option.label === label) {
						return { ...option, active: !option.active };
					}

					return option;
				});
				setFilterOptions(newFilterOptions);
				getNewOptionData(newFilterOptions);
			},
			[filterOptions, getNewOptionData]
		);

		const handleSelectAllChange = useCallback(
			(checked: boolean): void => {
				const newFilterOptions = filterOptions.map((item) => ({ ...item, active: checked }));
				setFilterOptions(newFilterOptions);
				getNewOptionData(newFilterOptions);
			},
			[filterOptions, getNewOptionData]
		);

		const onSearchOptionsChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
			setSearchText(event.target.value);
		}, []);

		const onSearchClearButtonClick = useCallback((): void => {
			setSearchText("");
			searchInputRef.current?.focus();
		}, []);

		const handleKeydown = useCallback(
			(event: KeyboardEvent): void => {
				if (event.key === CustomKey.Space && (event.target as HTMLElement).classList.contains("list-item")) {
					const optionLabel = (event.target as HTMLElement).getElementsByClassName("field__label")[0].textContent;

					if (optionLabel) {
						toggleOption(optionLabel);
					}

					setSearchText((prevState) => prevState.trim());
				}
			},
			[toggleOption]
		);

		const setSearchInputRef = useCallback((ref: HTMLElement | null): void => {
			searchInputRef.current = ref;
		}, []);

		const onPopupVisibilityChange = useCallback((isPopupVisible: boolean): void => {
			setIsPopupButtonActive(isPopupVisible);
		}, []);

		const onOperationSelect = useCallback(
			(value: ListOperationType): void => {
				setOperation(value);
				getNewOptionData(filterOptions, value);
			},
			[filterOptions, getNewOptionData]
		);

		const renderFilterOperation = useMemo((): ReactNode => {
			const { SubHeader, Item } = List;

			return (
				<PopUpMenu
					headerTitle="Menu"
					icon={
						<Icon iconTheme={!isPopupButtonActive ? "custom" : undefined}>
							{isPopupButtonActive ? "close" : operation}
						</Icon>
					}
					triggerButtonTitle="Filter operation"
					onVisibilityChange={onPopupVisibilityChange}
				>
					<List divider>
						<SubHeader fill>Filter Operation</SubHeader>
						<Item
							text="Or"
							graphic={<Icon iconTheme="custom">or</Icon>}
							meta={operation === "or" && <Icon>check</Icon>}
							selected={operation === "or"}
							onClick={() => onOperationSelect("or")}
						/>
						<Item
							text="And"
							graphic={<Icon iconTheme="custom">and</Icon>}
							meta={operation === "and" && <Icon>check</Icon>}
							selected={operation === "and"}
							onClick={() => onOperationSelect("and")}
						/>
					</List>
				</PopUpMenu>
			);
		}, [isPopupButtonActive, onOperationSelect, onPopupVisibilityChange, operation]);

		useEffect(() => {
			window.addEventListener("keydown", handleKeydown);

			return () => window.removeEventListener("keydown", handleKeydown);
		}, [handleKeydown]);

		const displayFilterOptions = useMemo(
			() => filterOptions.filter((option) => option.label.toLowerCase().includes(searchText.toLowerCase())),
			[filterOptions, searchText]
		);

		return (
			<FilterSelectorTemplate.Content
				headingElements={!isMobile && <ContentBoxElements.Title text={filter.label} ariaLevel={2} />}
				subActionBar={
					<ContentBoxElements.SubActionBar>
						<FilterSelectorTemplate.ActionBar>
							<FilterSelectorTemplate.SearchInput
								onChange={onSearchOptionsChange}
								onClearButtonClick={onSearchClearButtonClick}
								placeholder="Filter Option Search"
								value={searchText}
								inputRef={setSearchInputRef}
							/>
						</FilterSelectorTemplate.ActionBar>
						{filter.id === "customer-project-filter" && (
							<FilterSelectorTemplate.ActionBar>
								<div className="-u-width-full -u-flex -u-justify-between -u-items-center">
									<Checkbox.Indeterminate
										label="De/Select All"
										id="de-select-all-options"
										checked={
											FacetedSearchUtils.noFilterOptionsSelected(filterOptions)
												? false
												: FacetedSearchUtils.hasFilterOptionSelected(filterOptions)
													? "mixed"
													: true
										}
										onChange={handleSelectAllChange}
									/>
									{renderFilterOperation}
								</div>
							</FilterSelectorTemplate.ActionBar>
						)}
					</ContentBoxElements.SubActionBar>
				}
				padding={false}
			>
				{displayFilterOptions.length > 0 ? (
					<FilterSelectorTemplate.List>
						{displayFilterOptions.map((option, index) => {
							return (
								<FilterSelectorTemplate.Item key={option.label} selected={option.active} readonly>
									<Checkbox
										checked={option.active}
										label={option.label}
										onChange={() => toggleOption(option.label)}
										id={`option-${index}-checkbox`}
									/>
								</FilterSelectorTemplate.Item>
							);
						})}
					</FilterSelectorTemplate.List>
				) : (
					<Message>No option was found</Message>
				)}
			</FilterSelectorTemplate.Content>
		);
	};

	export const RadioOptions: FC<ViewProps> = (props) => {
		const { getOptionData, filter } = props;
		const [value, setValue] = useState(filter.options === "Not-billable" ? "0" : "1");

		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => getOptionData?.(value === "1" ? "Billable" : "Not-billable"), []);

		const onValueChanged = useCallback(
			(value: string): void => {
				setValue(value);
				getOptionData?.(value === "1" ? "Billable" : "Not-billable");
			},
			[getOptionData]
		);

		return (
			<Radio name="radiogroup" onValueChanged={onValueChanged} value={value}>
				<Radio.Item label="Billable" value="1" />
				<Radio.Item label="Not-billable" value="0" />
			</Radio>
		);
	};

	export function View(props: ViewProps): ReactElement<ViewProps> {
		const { filter, isMobile } = props;
		let content = null;

		switch (filter.optionType) {
			case "date":
				content = <FilterView.DateView {...props} />;
				break;
			case "radio":
				content = <FilterView.RadioOptions {...props} />;
				break;
			case "string":
			case "number":
				content = <FilterView.Input {...props} />;
				break;
			case "enum":
				return <FilterView.ListOption key={props.filter.label?.toString()} {...props} />;
			default:
				content = null;
		}

		return (
			<FilterSelectorTemplate.Content
				headingElements={!isMobile && <ContentBoxElements.Title text={filter.label} ariaLevel={2} />}
				padding={filter.optionType !== "date"}
			>
				{content}
			</FilterSelectorTemplate.Content>
		);
	}
}
