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

import type { ChangeEvent, ReactElement, ReactNode } from "react";
import { useCallback, useState } from "react";

import type {
	DropDownItem,
	IconPickerProps,
	MessagePosition,
	MultiselectProps,
	TooltipLineBreak,
	TooltipPosition
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Autocomplete,
	Checkbox,
	CheckboxGroup,
	CustomSelect,
	DateInput,
	DateTimePickerInput,
	DateTimePickerTimeInput,
	DefaultFileUpload,
	DefaultRichTextEditor,
	HintTooltip,
	IconPicker,
	MonthSelector,
	Multiselect,
	Radio,
	Select,
	Switch,
	TagInput,
	TextAreaStateless,
	TextField,
	TextOutput,
	TimePicker,
	YearMonthSelector,
	YearSelector
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../../helpers/configuration-view.js";
import { useTimePickerProps } from "../../time-picker/use-time-picker-props.js";

import type { Layout, LayoutKey, Status } from "./controls.js";
import { LAYOUTS, PositionControls, STATUS_TEXTS } from "./controls.js";
import {
	AUTOCOMPLETE_ITEMS,
	COMPACT_FILE_OPTIONS,
	dateConverter,
	dateFormatter,
	DATE_FORMAT,
	multiselectItemsFor,
	SELECT_ITEMS,
	TAG_INPUT_KEYS,
	TAG_INPUT_TAGS
} from "./fixtures.js";

export interface Settings {
	showLabel: boolean;
	showHelperText: boolean;
	showTooltip: boolean;

	/** The selected status. Always applied — {@link Settings.demonstrates} decides how. */
	status: Status;

	/** Which element the selected layout positions; decides how the status reaches the Widget. */
	demonstrates: Layout["demonstrates"];

	/**
	 * Both are undefined under the default options. React treats an undefined property the same as an
	 * omitted one — a class Widget reads `undefined` off `this.props` either way, and a function Widget's
	 * destructuring default fires on it — so {@link propsFor} can spread them unconditionally.
	 */
	lineBreak?: TooltipLineBreak;
	tooltipPosition?: TooltipPosition;
	messagePosition?: MessagePosition;
}

const HELPER_TEXT = "Helper text explaining the field";

/**
 * The status properties for the selected status. A message layout carries it as text, a tooltip layout
 * as a state flag, so the message box never competes with the tooltip for the position under test.
 * All six keys are always present so the returned shape stays the same whichever layout is picked.
 */
function statusPropsFor(settings: Settings): {
	errorMessage?: string;
	warningMessage?: string;
	infoMessage?: string;
	error: boolean;
	warning: boolean;
	info: boolean;
} {
	const asMessage = settings.demonstrates === "message";
	const text = STATUS_TEXTS[settings.status];

	return {
		errorMessage: asMessage && settings.status === "error" ? text : undefined,
		warningMessage: asMessage && settings.status === "warning" ? text : undefined,
		infoMessage: asMessage && settings.status === "info" ? text : undefined,
		error: !asMessage && settings.status === "error",
		warning: !asMessage && settings.status === "warning",
		info: !asMessage && settings.status === "info"
	};
}

const DateTimePickerWithTimeInput = DateTimePickerInput(DateTimePickerTimeInput);

/**
 * Label, helper text and tooltip for one cell. `suffix` keeps every tooltip `id` unique — a single
 * shared tooltip element would emit one duplicate DOM `id` per cell and break `aria-describedby`.
 * Pass `{ ariaDescribedby: false }` for widgets whose props omit `ariaDescribedby`.
 */
export function basePropsFor(suffix: string, settings: Settings, options?: { ariaDescribedby: false }) {
	return {
		label: settings.showLabel ? "Label" : undefined,
		helperText: settings.showHelperText ? HELPER_TEXT : undefined,
		...statusPropsFor(settings),
		tooltips: settings.showTooltip ? (
			<HintTooltip text="This is a hint" id={`mtp-${suffix}-hint`} key="hint" />
		) : undefined,
		...(options?.ariaDescribedby === false
			? {}
			: { ariaDescribedby: settings.showTooltip ? `mtp-${suffix}-hint` : undefined })
	};
}

/**
 * `basePropsFor` plus both position properties, for widgets that accept `breakTooltipsToNewLine` and
 * `messagePosition`.
 */
export function propsFor(suffix: string, settings: Settings, options?: { ariaDescribedby: false }) {
	return {
		...basePropsFor(suffix, settings, options),
		breakTooltipsToNewLine: settings.lineBreak,
		messagePosition: settings.messagePosition
	};
}

export function textOutputPropsFor(suffix: string, settings: Settings) {
	const { errorMessage, warningMessage, infoMessage } = statusPropsFor(settings);

	return {
		label: settings.showLabel ? "Label" : undefined,
		errorMessage,
		warningMessage,
		infoMessage,
		tooltips: settings.showTooltip ? (
			<HintTooltip text="This is a hint" id={`mtp-${suffix}-hint`} key="hint" />
		) : undefined,
		tooltipPosition: settings.tooltipPosition,
		messagePosition: settings.messagePosition
	};
}

export function Cell(props: { label: string; children: ReactNode }): ReactElement {
	// `minWidth: 0` overrides the `min-width: auto` grid items default, so no Widget can force its
	// track wider than the column and spill over its neighbour.
	return (
		<div style={{ minWidth: 0 }}>
			<p style={{ fontWeight: 500, margin: "0 0 8px" }}>{props.label}</p>
			{props.children}
		</div>
	);
}

export function PositionPlayground(): ReactElement {
	const [layout, setLayout] = useState<LayoutKey>("message-above");
	const [status, setStatus] = useState<Status>("error");
	const [showLabel, setShowLabel] = useState(true);
	const [showHelperText, setShowHelperText] = useState(true);
	const [showTooltip, setShowTooltip] = useState(true);
	const [text, setText] = useState("Example value");
	const [autocompleteValue, setAutocompleteValue] = useState<string | undefined>("Groovy");
	const [selectedIcon, setSelectedIcon] = useState<IconPickerProps.Icon | undefined>();
	const [multiselectSelection, setMultiselectSelection] = useState<MultiselectProps.Item[]>([]);
	const [nativeSelectValue, setNativeSelectValue] = useState<string | undefined>();
	const [customSelectValue, setCustomSelectValue] = useState<string | undefined>();
	const [checked, setChecked] = useState(false);
	const [checkboxGroupSelection, setCheckboxGroupSelection] = useState<string[]>([]);
	const [radioValue, setRadioValue] = useState<string | undefined>();
	const [month, setMonth] = useState<number | undefined>(1);
	const [year, setYear] = useState<number | undefined>(2026);
	const [yearMonth, setYearMonth] = useState<{ month?: number; year?: number }>({ month: 1, year: 2026 });
	const [switchChecked, setSwitchChecked] = useState(false);
	// Supplies the Time Picker's value, change handler and validation. The factory spread comes
	// after it, so the label, helper text and tooltip toggles win over the hook's own values.
	const timePickerProps = useTimePickerProps({ id: "mtp-time-picker" });

	// The selected option decides which of the two elements is on show: a message option renders the
	// message box and no tooltip, a tooltip option renders the tooltip and no message box. The status
	// applies either way — as a message box in the former, as a state flag on the control in the latter.
	const selectedLayout = LAYOUTS[layout];
	const settings: Settings = {
		showLabel,
		showHelperText,
		showTooltip: showTooltip && selectedLayout.demonstrates === "tooltip",
		status,
		demonstrates: selectedLayout.demonstrates,
		lineBreak: selectedLayout.breakTooltipsToNewLine,
		tooltipPosition: selectedLayout.tooltipPosition,
		messagePosition: selectedLayout.messagePosition
	};
	const statusProps = statusPropsFor(settings);

	const handleTextChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setText(event.target.value);
	}, []);

	const handleTextAreaChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
		setText(event.target.value);
	}, []);

	// Autocomplete and CustomSelect both report either the raw value or the whole item,
	// unlike the native Select which reports a plain string.
	const handleAutocompleteChange = useCallback((value: string | DropDownItem): void => {
		setAutocompleteValue(typeof value === "string" ? value : value.value);
	}, []);

	const handleCustomSelectChange = useCallback((value: string | DropDownItem): void => {
		setCustomSelectValue(typeof value === "string" ? value : value.value);
	}, []);

	const handleCheckboxGroupChange = useCallback((value: string): void => {
		setCheckboxGroupSelection((current) =>
			current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
		);
	}, []);

	const handleYearMonthChange = useCallback((nextMonth?: number, nextYear?: number): void => {
		setYearMonth({ month: nextMonth, year: nextYear });
	}, []);

	return (
		<ConfigurationView
			configuration={
				<PositionControls
					layout={layout}
					onLayoutChange={setLayout}
					status={status}
					onStatusChange={setStatus}
					showLabel={showLabel}
					onShowLabelChange={setShowLabel}
					showHelperText={showHelperText}
					onShowHelperTextChange={setShowHelperText}
					showTooltip={showTooltip}
					onShowTooltipChange={setShowTooltip}
				/>
			}
		>
			<div
				style={{
					display: "grid",
					gap: 24,
					gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
					width: "100%"
				}}
			>
				<Cell label="Autocomplete">
					<Autocomplete
						{...propsFor("autocomplete", settings)}
						id="mtp-autocomplete"
						items={AUTOCOMPLETE_ITEMS}
						inputPlaceHolder="Please select or start typing"
						hintTemplate="{count} matches"
						value={autocompleteValue}
						onValueChange={handleAutocompleteChange}
					/>
				</Cell>
				<Cell label="Checkbox">
					<Checkbox {...propsFor("checkbox", settings)} id="mtp-checkbox" checked={checked} onChange={setChecked} />
				</Cell>
				<Cell label="Checkbox Group">
					<CheckboxGroup
						{...propsFor("checkbox-group", settings)}
						id="mtp-checkbox-group"
						onValueChanged={handleCheckboxGroupChange}
					>
						<CheckboxGroup.Item label="Option 1" value="1" selected={checkboxGroupSelection.includes("1")} />
						<CheckboxGroup.Item label="Option 2" value="2" selected={checkboxGroupSelection.includes("2")} />
						<CheckboxGroup.Item label="Option 3" value="3" selected={checkboxGroupSelection.includes("3")} />
					</CheckboxGroup>
				</Cell>
				<Cell label="File Upload — Default">
					<div>
						<DefaultFileUpload
							{...propsFor("file-upload-default", settings, { ariaDescribedby: false })}
							id="mtp-file-upload-default"
							placeholderIcon="none"
							multiple
						/>
					</div>
				</Cell>
				<Cell label="File Upload — Compact">
					<DefaultFileUpload
						{...propsFor("file-upload-compact", settings, { ariaDescribedby: false })}
						id="mtp-file-upload-compact"
						compact
						accept=".pdf,.doc,.docx"
						fileOptions={COMPACT_FILE_OPTIONS}
					/>
				</Cell>
				<Cell label="Icon Picker">
					<IconPicker
						{...propsFor("icon-picker", settings)}
						id="mtp-icon-picker"
						placeholder="Type an icon or select one"
						hintTemplate="{count} of {total} icons shown"
						selectedIcon={selectedIcon}
						onChange={setSelectedIcon}
					/>
				</Cell>
				<Cell label="Multiselect">
					<Multiselect
						{...propsFor("multiselect", settings)}
						id="mtp-multiselect"
						items={multiselectItemsFor(multiselectSelection)}
						placeholder="Please select or start typing"
						hintTemplate="{count} of {total} options shown"
						mobileHeadingTitle="Select your options"
						onChange={setMultiselectSelection}
					/>
				</Cell>
				<Cell label="Rich Text Editor">
					<DefaultRichTextEditor
						{...propsFor("rich-text-editor", settings, { ariaDescribedby: false })}
						id="mtp-rich-text-editor"
						initialConfig={{ namespace: "Message and Tooltip Position Rich Text Editor" }}
						placeholder="Type anything..."
					/>
				</Cell>
				<Cell label="Radio">
					<Radio
						{...propsFor("radio", settings)}
						id="mtp-radio"
						name="mtp-radio"
						value={radioValue}
						onValueChanged={setRadioValue}
					>
						<Radio.Item label="Option 1" value="1" />
						<Radio.Item label="Option 2" value="2" />
					</Radio>
				</Cell>
				<Cell label="Select (Native)">
					<Select
						{...propsFor("native-select", settings)}
						id="mtp-native-select"
						placeholder="Please choose..."
						items={SELECT_ITEMS}
						value={nativeSelectValue}
						onValueChanged={setNativeSelectValue}
					/>
				</Cell>
				<Cell label="Select (Custom)">
					<CustomSelect
						{...propsFor("custom-select", settings)}
						id="mtp-custom-select"
						placeholder="Please choose..."
						items={SELECT_ITEMS}
						value={customSelectValue}
						onValueChanged={handleCustomSelectChange}
					/>
				</Cell>
				<Cell label="Switch">
					<Switch
						{...propsFor("switch", settings)}
						id="mtp-switch"
						checked={switchChecked}
						onChange={setSwitchChecked}
					/>
				</Cell>
				<Cell label="Tag Input">
					<TagInput
						{...propsFor("tag-input", settings, { ariaDescribedby: false })}
						id="mtp-tag-input"
						keys={TAG_INPUT_KEYS}
						initialTags={TAG_INPUT_TAGS}
						placeholder="add tags with ',' or press enter..."
						duplicatedTagMessage="Tag is duplicated"
					/>
				</Cell>
				<Cell label="Text Field">
					<TextField
						{...propsFor("text-field", settings)}
						id="mtp-text-field"
						value={text}
						onChange={handleTextChange}
					/>
				</Cell>
				<Cell label="Text Area">
					<TextAreaStateless
						{...propsFor("text-area", settings)}
						id="mtp-text-area"
						value={text}
						onChange={handleTextAreaChange}
					/>
				</Cell>
				<Cell label="Date Picker">
					<DateInput
						{...propsFor("date-picker", settings)}
						id="mtp-date-picker"
						placeholder={DATE_FORMAT}
						dateFormatter={dateFormatter}
						dateConverter={dateConverter}
						datePickerProps={{ id: "mtp-date-picker-calendar" }}
						datePickerDialogProps={{ okLabel: "OK", title: "Set a date" }}
					/>
				</Cell>
				<Cell label="Time Picker">
					<TimePicker {...timePickerProps} {...propsFor("time-picker", settings)} />
				</Cell>
				<Cell label="Date Time Picker">
					<DateTimePickerWithTimeInput
						id="mtp-date-time-picker"
						pickerProps={{ id: "mtp-date-time-picker-calendar" }}
						breakTooltipsToNewLine={settings.lineBreak}
						messagePosition={settings.messagePosition}
						inputLabel={settings.showLabel ? "Label" : undefined}
						helperText={settings.showHelperText ? HELPER_TEXT : undefined}
						// The Date Time Picker prefixes the message properties it forwards to its input, except
						// for the info message, which it inherits unprefixed. The boolean state properties are
						// inherited unprefixed as well and reach the input through the component's own spread.
						inputErrorMessage={statusProps.errorMessage}
						inputWarningMessage={statusProps.warningMessage}
						infoMessage={statusProps.infoMessage}
						error={statusProps.error}
						warning={statusProps.warning}
						info={statusProps.info}
						inputTooltips={
							settings.showTooltip ? (
								<HintTooltip text="This is a hint" id="mtp-date-time-picker-hint" key="hint" />
							) : undefined
						}
					/>
				</Cell>
				<Cell label="Month Selector">
					<MonthSelector
						{...propsFor("month-selector", settings)}
						id="mtp-month-selector"
						month={month}
						onMonthChange={setMonth}
					/>
				</Cell>
				<Cell label="Year Selector">
					<YearSelector
						{...propsFor("year-selector", settings)}
						id="mtp-year-selector"
						year={year}
						onYearChange={setYear}
						placeholder="YYYY"
					/>
				</Cell>
				<Cell label="Year and Month Selector">
					<YearMonthSelector
						{...propsFor("year-month-selector", settings)}
						id="mtp-year-month-selector"
						month={yearMonth.month}
						year={yearMonth.year}
						onValueChange={handleYearMonthChange}
						hiddenLabels={{ yearLabel: "Year Select", monthLabel: "Month Select" }}
						yearPlaceholder="Year"
					/>
				</Cell>
				<Cell label="Text Output">
					<TextOutput {...textOutputPropsFor("text-output", settings)} id="mtp-text-output">
						Read-only value
					</TextOutput>
				</Cell>
			</div>
		</ConfigurationView>
	);
}
