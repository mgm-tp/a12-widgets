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
import { useState, useEffect } from "react";

import type { MenuItem, MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Multiselect,
	Typography,
	Radio,
	LayoutGrid,
	TextField,
	TextAffix,
	TimePicker,
	provider,
	noop
} from "@com.mgmtp.a12.widgets/widgets-core";

import { DateInput } from "./filter-selector/date-input.js";
import { useTimePickerProps } from "./filter-selector/use-time-picker-props.js";
import type { StringRow } from "./master-view.js";
import { AutoCompleteTpl, TableTpl } from "./master-detail-template.js";
import { DATA } from "./setup.js";

const { Grid, Row, Column } = LayoutGrid;
const { Headline, Body, Section } = Typography;

interface DetailViewProps {
	rowData: StringRow;
	navItemSelected: MenuItem | null;
}

export function DetailView(props: DetailViewProps): ReactElement<DetailViewProps> {
	return !props.navItemSelected || props.navItemSelected.label === "Calculation" ? (
		<CalculationView rowData={props.rowData} />
	) : (
		<ReceiptView />
	);
}

function ReceiptView(): ReactElement<{}> {
	return (
		<>
			<TableTpl sectionTitle="Overnighters" />
			<TableTpl sectionTitle="Flights" editable />
		</>
	);
}

function TimePickerInput(): ReactElement {
	return <TimePicker {...useTimePickerProps()} label="Time" helperText={undefined} />;
}

interface CalculationViewProps {
	rowData: StringRow;
}

const CalculationView = (props: CalculationViewProps) => {
	const { rowData } = props;

	const [accounts, setAccounts] = useState(convertDataToMultiSelectItem(DATA.CUSTOMER_PROJECT, rowData[4]));
	const [timeOpen, setTimeOpen] = useState(true);
	const [tripOpen, setTripOpen] = useState(true);
	const [customerOpen, setCustomerOpen] = useState(true);
	const [mealOpen, setMealOpen] = useState(true);
	const [costOpen, setCostOpen] = useState(true);

	useEffect(() => setAccounts(convertDataToMultiSelectItem(DATA.CUSTOMER_PROJECT, rowData[4])), [rowData]);

	return (
		<>
			<Section role="form">
				<Headline
					level={2}
					ariaLevel={2}
					divider
					collapsible
					collapsed={!timeOpen}
					onCollapsingChange={() => setTimeOpen((prevState) => !prevState)}
				>
					Trip Time
				</Headline>
				{timeOpen && (
					<Grid>
						<Row className="-u-negative-margin-t-4">
							<Column size={{ sm: 6, md: 4, lg: 4 }}>
								<Section role="form">
									<Headline level={3} ariaLevel={3} divider>
										Trip Start
									</Headline>
									<Grid>
										<Row>
											<Column size={{ sm: 12, md: 12, lg: 12 }}>
												<DateInput label="Date" />
											</Column>
										</Row>
										<Row>
											<Column size={{ sm: 12, md: 12, lg: 12 }}>
												<TimePickerInput />
											</Column>
										</Row>
									</Grid>
								</Section>
							</Column>
							<Column size={{ sm: 6, md: 4, lg: 4 }}>
								<Section role="form">
									<Headline level={3} ariaLevel={3} divider>
										Trip End
									</Headline>
									<Grid>
										<Row>
											<Column size={{ sm: 12, md: 12, lg: 12 }}>
												<DateInput label="Date" />
											</Column>
										</Row>
										<Row>
											<Column size={{ sm: 12, md: 12, lg: 12 }}>
												<TimePickerInput />
											</Column>
										</Row>
									</Grid>
								</Section>
							</Column>
							<Column size={{ sm: 6, md: 4, lg: 4 }}>
								<Section role="form">
									<Headline level={3} ariaLevel={3} divider>
										Notes
									</Headline>
									<Body>
										<TextField placeholder="Enter your notes" onChange={noop} label="Notes" />
									</Body>
								</Section>
							</Column>
						</Row>
					</Grid>
				)}
			</Section>
			<Section role="form">
				<Headline
					level={2}
					ariaLevel={2}
					divider
					collapsible
					collapsed={!tripOpen}
					onCollapsingChange={() => setTripOpen((prevState) => !prevState)}
				>
					Trip Details
				</Headline>
				{tripOpen && (
					<Grid>
						<Row>
							<Column size={{ sm: 6, md: 6, lg: 6 }}>
								<TextField value={rowData[0]} onChange={noop} label="Name" />
							</Column>
							<Column size={{ sm: 6, md: 6, lg: 6 }}>
								<AutoCompleteTpl
									items={DATA.NATIONALITIES}
									hintTemplate="{count} of {total} options shown"
									label="Nationality"
									inputPlaceHolder="Choose nationality..."
									value={rowData[2]}
								/>
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }}>
								<strong>Photo</strong>
								{rowData[1]}
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }}>
								<TextField onChange={noop} label="Occasion" errorMessage="The occasion should not be empty." />
							</Column>
						</Row>
					</Grid>
				)}
			</Section>
			<Section role="form">
				<Headline
					level={2}
					ariaLevel={2}
					divider
					collapsible
					collapsed={!customerOpen}
					onCollapsingChange={() => setCustomerOpen((prevState) => !prevState)}
				>
					Customer Details
				</Headline>
				{customerOpen && (
					<Grid>
						<Row>
							<Column size={{ sm: 6, md: 6, lg: 6 }}>
								<Multiselect
									label="Projects"
									mobile={provider.isPhone()}
									hintTemplate="{count} of {total} options shown"
									selectAllText="All"
									mobileHeadingTitle="Select your options"
									placeholder="Please select or start typing"
									items={accounts}
									onChange={(items) => {
										setAccounts((prevState) =>
											prevState.map((item) => ({
												...item,
												selected: items.findIndex((i) => i.id === item.id) >= 0
											}))
										);
									}}
								/>
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 6, md: 6, lg: 6 }}>
								<Radio inline label="Billing" onValueChanged={noop} name="billing" value="1">
									<Radio.Item label="Billable" value="1" />
									<Radio.Item label="Not-billable" value="2" />
								</Radio>
							</Column>
							<Column size={{ sm: 6, md: 6, lg: 6 }}>
								<TextField onChange={noop} label="Change according to project lead" />
							</Column>
						</Row>
					</Grid>
				)}
			</Section>
			<Section role="form">
				<Headline
					level={2}
					ariaLevel={2}
					divider
					collapsible
					collapsed={!mealOpen}
					onCollapsingChange={() => setMealOpen((prevState) => !prevState)}
				>
					Meal Allowances
				</Headline>
				{mealOpen && (
					<>
						<Grid>
							<Row>
								<Column size={{ sm: 12, md: 12, lg: 12 }}>
									<AutoCompleteTpl
										items={["Germany", "Belgium", "Austria"]}
										hintTemplate="{count} of {total} options shown"
										label="Country"
									/>
								</Column>
							</Row>
						</Grid>
						<Grid>
							<Headline level={3} ariaLevel={3} divider>
								Single Day
							</Headline>
							<Row>
								<Column size={{ sm: 12, md: 6, lg: 4 }} className="h_rightAlign">
									<TextField onChange={noop} label="Single day over 8 hours" readonly />
								</Column>
								<Column size={{ sm: 12, md: 6, lg: 4 }} className="h_rightAlign">
									<TextField onChange={noop} label="Fixed rate" suffixes={<TextAffix>EUR</TextAffix>} readonly />
								</Column>
								<Column size={{ sm: 12, md: 6, lg: 4 }} className="h_rightAlign">
									<TextField onChange={noop} label="Single day total" suffixes={<TextAffix>EUR</TextAffix>} readonly />
								</Column>
							</Row>
						</Grid>
						<Grid>
							<Headline level={3} ariaLevel={3} divider>
								Arrival Day
							</Headline>
							<Row>
								<Column size={{ sm: 12, md: 6, lg: 4 }} className="h_rightAlign">
									<TextField onChange={noop} label="Arrival day" readonly />
								</Column>
								<Column size={{ sm: 12, md: 6, lg: 4 }} className="h_rightAlign">
									<TextField onChange={noop} label="Fixed rate" suffixes={<TextAffix>EUR</TextAffix>} readonly />
								</Column>
								<Column size={{ sm: 12, md: 6, lg: 4 }} className="h_rightAlign">
									<TextField onChange={noop} label="Arrival day total" suffixes={<TextAffix>EUR</TextAffix>} readonly />
								</Column>
							</Row>
						</Grid>
					</>
				)}
			</Section>
			<Section role="form">
				<Headline
					level={2}
					ariaLevel={2}
					divider
					collapsible
					collapsed={!costOpen}
					onCollapsingChange={() => setCostOpen((prevState) => !prevState)}
				>
					Costs with Original Receipt
				</Headline>
				{costOpen && (
					<Grid>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }} className="h_rightAlign">
								<TextField onChange={noop} label="Flight Cost" suffixes={<TextAffix>EUR</TextAffix>} readonly />
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }} className="h_rightAlign">
								<TextField onChange={noop} label="Train Cost" suffixes={<TextAffix>EUR</TextAffix>} readonly />
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }} className="h_rightAlign">
								<TextField onChange={noop} label="Others Cost" suffixes={<TextAffix>EUR</TextAffix>} readonly />
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }} className="h_rightAlign">
								<TextField onChange={noop} label="Total Cost" readonly suffixes={<TextAffix>EUR</TextAffix>} />
							</Column>
						</Row>
					</Grid>
				)}
			</Section>
		</>
	);
};

function convertDataToMultiSelectItem(data: string[], selectedItem: string): MultiselectProps.Item[] {
	const selectedItems = selectedItem.split(", ");

	return data.map((value) => {
		const matchedIem = selectedItems.find((item) => item === value);

		return {
			id: value,
			label: value,
			selected: !!matchedIem
		};
	});
}
