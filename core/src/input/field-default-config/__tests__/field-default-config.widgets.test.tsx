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
import { cleanup, render, within } from "test-utils";
import { describe, test, expect } from "vitest";

import { noop } from "../../../common/main/utils.js";
import { DateTimePicker } from "../../../date-time-picker/main/date-time-picker.view.js";
import { DateTimePickerInput } from "../../../date-time-picker/main/wrapper/date-time-picker-input.view.js";
import { FileUpload } from "../../../file-upload/main/file-upload.view.js";
import { MultiselectTemplate } from "../../../multiselect/main/multiselect.tpl.view.js";
import { RichTextEditor } from "../../../rich-text-editor/main/rich-text-editor.view.js";
import { TagInput } from "../../../tag-input/main/tag-input.view.js";
import { TextOutput } from "../../../text-output/main/text-output.view.js";
import { Autocomplete } from "../../autocomplete/main/autocomplete.view.js";
import type { MessagePosition, TooltipLineBreak } from "../../base/template/base.tpl.api.js";
import { CheckboxGroup } from "../../checkbox-group/main/checkbox-group.view.js";
import { Checkbox } from "../../checkbox/main/checkbox.view.js";
import { IconPicker } from "../../icon-picker/main/icon-picker.view.js";
import { Radio } from "../../radio/main/radio.view.js";
import { CustomSelect } from "../../select/main/custom-select.view.js";
import { NativeSelect } from "../../select/main/native-select.view.js";
import { Switch } from "../../switch/main/switch.view.js";
import { TextAreaStateless } from "../../text-area/main/template/text-area.tpl.view.js";
import { TextField } from "../../text-field/main/template/text-field.tpl.view.js";
import { YearMonthSelector } from "../../year-month-selector/year-month-selector.view.js";
import type { FieldOverrideProps, TooltipPosition } from "../main/field-default-config.api.js";
import { FieldDefaultConfigProvider } from "../main/index.js";

const TOOLTIP = "Test tooltip";

const messages = {
	label: "Test Label",
	helperText: "Test Helper Text",
	errorMessage: "Test error message",
	warningMessage: "Test warning message",
	infoMessage: "Test info message",
	tooltips: <div>{TOOLTIP}</div>
};

const ITEMS = [
	{ id: "1", label: "First", value: "1" },
	{ id: "2", label: "Second", value: "2" }
];

const DateTimePickerWithInput = DateTimePickerInput(DateTimePicker);

/**
 * TextOutput carries `tooltipPosition` in the provider's own vocabulary rather than the
 * `breakTooltipsToNewLine` the data entry widgets use, so the table's value is translated for it.
 */
function toTooltipPosition(lineBreak: TooltipLineBreak | undefined): TooltipPosition | undefined {
	if (lineBreak === undefined) {
		return undefined;
	}

	if (typeof lineBreak === "boolean") {
		return lineBreak ? "above" : "beside";
	}

	return lineBreak;
}

/**
 * Every widget that reads the two positioning properties, so that a widget added to the resolution
 * without being added here shows up as an uncovered code path rather than a silent behaviour change.
 */
const WIDGETS: { name: string; render: (positions: FieldOverrideProps) => ReactElement }[] = [
	{ name: "TextField", render: (p) => <TextField id="w" {...messages} {...p} /> },
	{ name: "TextArea", render: (p) => <TextAreaStateless id="w" {...messages} {...p} /> },
	{ name: "Switch", render: (p) => <Switch id="w" onChange={noop} {...messages} {...p} /> },
	{ name: "Checkbox", render: (p) => <Checkbox id="w" checked={false} onChange={noop} {...messages} {...p} /> },
	{
		name: "CheckboxGroup",
		render: (p) => (
			<CheckboxGroup id="w" {...messages} {...p}>
				<CheckboxGroup.Item label="Option 1" value="1" id="w-1" {...p} />
			</CheckboxGroup>
		)
	},
	{
		name: "Radio",
		render: (p) => (
			<Radio id="w" {...messages} {...p}>
				<Radio.Item label="Option 1" value="1" />
			</Radio>
		)
	},
	{ name: "NativeSelect", render: (p) => <NativeSelect id="w" items={ITEMS} {...messages} {...p} /> },
	{ name: "CustomSelect", render: (p) => <CustomSelect id="w" items={ITEMS} {...messages} {...p} /> },
	{
		name: "Autocomplete",
		render: (p) => <Autocomplete id="w" items={ITEMS} hintTemplate="" mobileModal={false} {...messages} {...p} />
	},
	{
		// The dialog presentation, whose field in the page carries the label, the messages and the tooltips.
		name: "Autocomplete (dialog)",
		render: (p) => <Autocomplete id="w" items={ITEMS} hintTemplate="" mobileModal {...messages} {...p} />
	},
	{ name: "Multiselect", render: (p) => <MultiselectTemplate id="w" items={ITEMS} {...messages} {...p} /> },
	{ name: "TagInput", render: (p) => <TagInput id="w" {...messages} {...p} /> },
	{ name: "IconPicker", render: (p) => <IconPicker id="w" onChange={noop} {...messages} {...p} /> },
	{ name: "FileUpload", render: (p) => <FileUpload id="w" {...messages} {...p} /> },
	{ name: "YearMonthSelector", render: (p) => <YearMonthSelector year={2020} month={2} {...messages} {...p} /> },
	{
		name: "RichTextEditor",
		render: (p) => <RichTextEditor id="w" initialConfig={{ namespace: "position" }} {...messages} {...p} />
	},
	{
		name: "TextOutput",
		render: (p) => (
			<TextOutput
				id="w"
				label={messages.label}
				errorMessage={messages.errorMessage}
				warningMessage={messages.warningMessage}
				infoMessage={messages.infoMessage}
				tooltips={messages.tooltips}
				messagePosition={p.messagePosition}
				tooltipPosition={toTooltipPosition(p.breakTooltipsToNewLine)}
			>
				Content
			</TextOutput>
		)
	},
	{
		name: "DateTimePickerInput",
		render: (p) => (
			<DateTimePickerWithInput
				pickerProps={{ id: "w", yearRange: { start: 2000, end: 2020 } }}
				inputLabel={messages.label}
				inputErrorMessage={messages.errorMessage}
				inputWarningMessage={messages.warningMessage}
				inputTooltips={messages.tooltips}
				helperText={messages.helperText}
				{...p}
			/>
		)
	}
];

/**
 * The rendered markup with the generated identifiers masked. Two renders of the same widget differ only
 * in those, so whatever is left compares the layout the widget actually produced.
 */
function layout(container: HTMLElement): string {
	return container.innerHTML
		.replace(/\b(id|for|list|aria-describedby|aria-labelledby|aria-controls|aria-activedescendant)="[^"]*"/g, '$1="~"')
		.replace(/ style="[^"]*"/g, "")
		.replace(/«[^»]*»/g, "~")
		.replace(/:r[0-9a-z]+:/gi, "~");
}

async function layoutOf(ui: ReactElement): Promise<string> {
	cleanup();

	const { container } = render(ui);

	await within(container).findAllByText(TOOLTIP);

	return layout(container);
}

describe("com.mgmtp.a12.widgets.field-default-config.widgets", () => {
	describe.each(WIDGETS)("$name", ({ render: renderWidget }) => {
		test.each([
			{ messagePosition: "below", tooltipPosition: "below" },
			{ messagePosition: "above", tooltipPosition: "above" },
			{ messagePosition: "below", tooltipPosition: "beside" }
		] as { messagePosition: MessagePosition; tooltipPosition: TooltipPosition }[])(
			"renders $messagePosition/$tooltipPosition from the provider exactly as from the properties",
			async ({ messagePosition, tooltipPosition }) => {
				const fromProvider = await layoutOf(
					<FieldDefaultConfigProvider messagePosition={messagePosition} tooltipPosition={tooltipPosition}>
						{renderWidget({})}
					</FieldDefaultConfigProvider>
				);
				const fromProps = await layoutOf(
					renderWidget({
						messagePosition,
						breakTooltipsToNewLine: tooltipPosition === "beside" ? false : tooltipPosition
					})
				);

				expect(fromProvider).toBe(fromProps);
			}
		);

		test("lets the widget's own properties win over the provider", async () => {
			const fromBoth = await layoutOf(
				<FieldDefaultConfigProvider messagePosition="below" tooltipPosition="below">
					{renderWidget({ messagePosition: "above", breakTooltipsToNewLine: "above" })}
				</FieldDefaultConfigProvider>
			);
			const fromPropsOnly = await layoutOf(renderWidget({ messagePosition: "above", breakTooltipsToNewLine: "above" }));

			expect(fromBoth).toBe(fromPropsOnly);
		});

		test("keeps the widget's own default when no provider is mounted", async () => {
			const withEmptyProvider = await layoutOf(
				<FieldDefaultConfigProvider>{renderWidget({})}</FieldDefaultConfigProvider>
			);
			const withoutProvider = await layoutOf(renderWidget({}));

			expect(withEmptyProvider).toBe(withoutProvider);
		});
	});
});
