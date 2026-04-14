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
import { useCallback, useState } from "react";
import { styled } from "styled-components";
import { loremIpsum } from "lorem-ipsum";

import {
	Autocomplete,
	Button,
	ButtonGroup,
	CollapsiblePanel,
	Icon,
	Select,
	TextAreaStateless,
	TextField,
	TextOutput,
	joinClassNames,
	noop,
	Radio,
	Checkbox,
	CheckboxGroup,
	BulletList,
	Multiselect,
	IconPicker,
	TimePicker,
	YearMonthSelector,
	AlignButtonGroup,
	BoldButton,
	DefaultRichTextEditor,
	ItalicButton,
	UnderlineButton
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

import { ITEMS } from "../inputs/autocomplete/data.js";

type helperClassesType = {
	name: string;
	value: string;
};

interface CommonProps {
	title: string;
	helperClasses?: helperClassesType[];
	hideCorrespondingValue?: boolean;
	hasIconButtonExamples?: boolean;
}

const StyledCommonExamplesWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.verticalSpacing.vertWhiteSpacingmd}px;
	width: 70%;
`;

const content = loremIpsum({ units: "sentences", count: 3 });

const RichTextEditorButtonExample = [BoldButton, ItalicButton, UnderlineButton, AlignButtonGroup];

export const CommonShowcases: FC<CommonProps> = (props: CommonProps) => {
	const [selectedClass, setSelectedClass] = useState(props.helperClasses?.[0]);

	const handleSelectedClass = useCallback(
		(value: string) => {
			setSelectedClass(props.helperClasses?.find((helperClass) => helperClass.name === value));
		},
		[props.helperClasses]
	);

	return (
		<ConfigurationView
			reportLabel={props.title}
			configuration={
				<>
					<Select
						label="Choose the helper class to apply:"
						fitToParent={false}
						onValueChanged={handleSelectedClass}
						value={selectedClass?.name}
						items={props.helperClasses?.map((item) => ({ label: item.name, value: item.name })) || []}
					/>
					{!props.hideCorrespondingValue && (
						<p>
							<code>{selectedClass?.name}</code>: <code>{selectedClass?.value}</code>
						</p>
					)}
				</>
			}
		>
			<StyledCommonExamplesWrapper>
				{props.title === "line height" ? (
					<>
						<div className={selectedClass?.name}>
							<TextAreaStateless value={content} label="Text Area" onChange={noop} />
						</div>
						<div className={selectedClass?.name}>
							<TextOutput label="Text Output">{content}</TextOutput>
						</div>
					</>
				) : (
					<>
						{props.title !== "text align" && (
							<ButtonGroup>
								<Button primary className={selectedClass?.name} label="Primary Button" />
								<Button secondary className={selectedClass?.name} label="Secondary Button" />
								{props.hasIconButtonExamples && (
									<>
										<Button
											className={selectedClass?.name}
											primary
											icon={<Icon>search</Icon>}
											title="Primary Icon button"
										/>
										<Button
											className={selectedClass?.name}
											secondary
											icon={<Icon>search</Icon>}
											title="Secondary Icon button"
										/>
										<Button className={selectedClass?.name} icon={<Icon>search</Icon>} title="Default Icon Button" />
									</>
								)}
							</ButtonGroup>
						)}
						<div className={selectedClass?.name}>
							<Radio label="Radio" labelGraphic={<Icon>info</Icon>}>
								<Radio.Item label="Option 1" value="Value_1" />
								<Radio.Item label="Option 2" value="Value_2" />
								<Radio.Item label="Option 3" value="Value_3" />
							</Radio>
						</div>
						<div className={selectedClass?.name}>
							<Checkbox label="Checkbox" title="Basic" checked={false} onChange={noop} />
						</div>
						<div className={selectedClass?.name}>
							<CheckboxGroup label="Checkbox Group">
								<CheckboxGroup.Item label="Option 1" value="Value_1" />
								<CheckboxGroup.Item label="Option 2" value="Value_2" />
								<CheckboxGroup.Item label="Option 3" value="Value_3" />
							</CheckboxGroup>
						</div>
						<div className={selectedClass?.name}>
							<TimePicker label="Time Picker" placeholder="hh:mm A" />
						</div>
						<div className={selectedClass?.name}>
							<TextField label="Text Field" value="Initial content" onChange={noop} />
						</div>
						<div className={selectedClass?.name}>
							<TextAreaStateless label="Text Area" value="Initial content" onChange={noop} />
						</div>
						<div className={selectedClass?.name}>
							<TextOutput label="Text Output">Initial content</TextOutput>
						</div>
						<div className={selectedClass?.name}>
							<TextOutput noData label="Text Output without data">
								no data
							</TextOutput>
						</div>
						{props.title === "text align" && (
							<div className={selectedClass?.name}>
								<DefaultRichTextEditor
									initialConfig={{ namespace: "Rich Text Editor text align" }}
									id="align-rich-text-editor"
									label="Rich Text Editor"
									placeholder="Type anything..."
									helperText="Example Helper Text. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
									staticToolbarButtons={RichTextEditorButtonExample}
								/>
								<span className="-u-font-bold -u-text-nano">
									Note: Although the helper class cannot be used to align the editor's content, the Static Toolbar's
									alignment button can help you to do so.
								</span>
							</div>
						)}
						<div className={selectedClass?.name}>
							<Select
								label="Select"
								items={[
									{ label: "Option 1", value: "Value_1" },
									{ label: "Option 2", value: "Value_2" },
									{ label: "Option 3", value: "Value_3" }
								]}
							/>
						</div>
						<div className={selectedClass?.name}>
							<Autocomplete label="Autocomplete" hintTemplate="{count} matches" items={ITEMS} value={ITEMS[0]} />
						</div>
						<div className={selectedClass?.name}>
							<Multiselect
								label="Multiselect"
								hintTemplate="{count} matches"
								selectAllText="All"
								items={[
									{ id: "Java", label: "Java", selected: true },
									{ id: "Javascript", label: "Javascript" },
									{ id: "JSP", label: "JSP" }
								]}
								placeholder="Please select or start typing"
							/>
						</div>
						<div className={selectedClass?.name}>
							<IconPicker
								label="Icon Picker"
								placeholder="Type an icon or select"
								hintTemplate="{count} of {total} icons shown"
								onChange={noop}
							/>
						</div>
						<div className={selectedClass?.name}>
							<YearMonthSelector label="Year and Month Selector" month={3} year={2023} onValueChange={noop} />
						</div>
						<div className={joinClassNames(selectedClass?.name, "form__section")}>
							<div className="form__sectionTitle h_zeroMargin">First section</div>
						</div>
						{props.title !== "background color" && (
							<>
								<div className={joinClassNames(selectedClass?.name, "form__section")}>
									<div className="form__section">
										<div className="form__sectionTitle h_zeroMargin">Second section</div>
									</div>
								</div>
							</>
						)}
						<CollapsiblePanel className={selectedClass?.name} title="Title" onClick={noop} info="Data available" />
					</>
				)}
			</StyledCommonExamplesWrapper>
		</ConfigurationView>
	);
};

export const CommonHelperList: FC<CommonProps> = (props: CommonProps) => {
	return (
		<BulletList.Unordered>
			{props.title !== "line height" && (
				<>
					<BulletList.Item>
						{props.title === "background color" ? "1st level Section" : "1st/2nd level Section"}
					</BulletList.Item>
					<BulletList.Item>Autocomplete</BulletList.Item>
					{props.title !== "text align" && (
						<BulletList.Item>
							Buttons (excluding {props.hasIconButtonExamples ? "Toggle Buttons" : "Icon Buttons and Toggle Buttons"})
						</BulletList.Item>
					)}
					<BulletList.Item>Checkbox / Checkbox Group</BulletList.Item>
					<BulletList.Item>Collapsible Panel</BulletList.Item>
					<BulletList.Item>Icon Picker</BulletList.Item>
					<BulletList.Item>Multiselect</BulletList.Item>
					{props.title === "text align" && <BulletList.Item>Rich Text Editor</BulletList.Item>}
					<BulletList.Item>Radio</BulletList.Item>
					<BulletList.Item>Select</BulletList.Item>
					<BulletList.Item>Text Field</BulletList.Item>
				</>
			)}
			<BulletList.Item>Text Area</BulletList.Item>
			<BulletList.Item>Text Output</BulletList.Item>
			{props.title !== "line height" && (
				<>
					<BulletList.Item>Time Picker</BulletList.Item>
					<BulletList.Item>Year and Month Selector</BulletList.Item>
				</>
			)}
		</BulletList.Unordered>
	);
};
