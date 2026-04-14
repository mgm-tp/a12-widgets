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

import type { ReactNode, ChangeEvent, ReactElement, MouseEvent } from "react";
import { useState, useCallback, Component, useRef, useMemo } from "react";

import type {
	AutocompleteProps,
	DropDownItem,
	MenuItem,
	BaseColumnType,
	TableRenderPropsType
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Autocomplete,
	Callout,
	MobileValidation,
	ValidationBar,
	ModalOverlay,
	Pagination,
	QuickAccessButton,
	FlyoutMenu,
	Typography,
	LayoutGrid,
	TextField,
	TextAffix,
	ContentBoxElements,
	Icon,
	Button,
	ButtonGroup,
	Range,
	noop,
	provider as DeviceDetector,
	Table,
	getDataByKey
} from "@com.mgmtp.a12.widgets/widgets-core";

import { DateInput } from "./filter-selector/date-input.js";

const { Headline, Body, Section } = Typography;

interface ActionsProps {
	filterButtonIcon: ReactNode;

	onClick?(): void;

	buttonRef?(instance: HTMLButtonElement): void;

	isMobile: boolean;
	filterSelectorIsOpening?: boolean;
}

export function Actions(props: ActionsProps): ReactElement<ActionsProps> {
	const [inputValue, setInputValue] = useState("");
	const onchange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	return (
		<>
			{!props.isMobile && <Button label="ADD" icon={<Icon>add</Icon>} />}
			<TextField
				key="search"
				placeholder="Search..."
				suffixes={<Icon>search</Icon>}
				value={inputValue}
				onChange={onchange}
			/>
			<Button
				icon={props.filterButtonIcon}
				title={props.filterSelectorIsOpening ? "Close filter" : "Open filter"}
				onClick={() => {
					if (props.onClick) {
						props.onClick();
					}
				}}
				buttonRef={props.buttonRef}
				buttonAttributes={{ "aria-expanded": props.filterSelectorIsOpening }}
			/>
		</>
	);
}

interface HeadingButtonsProps {
	searchActive?: boolean;
	searchBadge?: ReactNode;
	filterActive?: boolean;
	filterBadge?: ReactNode;

	onSearchButtonClick(e: MouseEvent<HTMLElement>): void;

	onFilterButtonClick(e: MouseEvent<HTMLElement>): void;
}

export function HeadingButtons(props: HeadingButtonsProps): ReactElement<HeadingButtonsProps> {
	return (
		<>
			<ContentBoxElements.HeadingActionButton
				icon={<Icon>search</Icon>}
				active={props.searchActive}
				badge={props.searchBadge}
				onClick={props.onSearchButtonClick}
				buttonAttributes={{ "aria-expanded": props.searchActive }}
				title="Search"
			/>
			<ContentBoxElements.HeadingActionButton
				icon={<Icon>filter_list</Icon>}
				active={props.filterActive}
				onClick={props.onFilterButtonClick}
				buttonAttributes={{ "aria-expanded": props.filterActive }}
				badge={props.filterBadge}
				title="Filter"
			/>
		</>
	);
}

const { Overview, Graphic, Content } = MobileValidation;

export function NotificationArea(): ReactElement {
	const [showModal, setShowModal] = useState(false);
	const isMobile: boolean = DeviceDetector.isPhone();

	function renderModal(): ReactNode {
		return (
			<ModalOverlay fullscreen>
				<MobileValidation
					headingTitle={<Graphic variant="error">The occasion should not be empty.</Graphic>}
					headingSuffixes={<ContentBoxElements.CloseButton onClick={() => setShowModal(false)} />}
				>
					<Content>
						The occasion should not be empty.
						<div>
							<Button>Calculation &gt; occasion</Button>
						</div>
					</Content>
				</MobileValidation>
			</ModalOverlay>
		);
	}

	return isMobile ? (
		<>
			<Overview
				variant="error"
				leftElement={<Graphic>1</Graphic>}
				rightElement={<Icon>fullscreen</Icon>}
				onClick={() => setShowModal(true)}
			/>
			{showModal && renderModal()}
		</>
	) : (
		<ValidationBar
			className="-sc-validation-bar"
			primaryTitle="The occasion should not be empty."
			secondaryTitle="Calculation > occasion"
			quickAccessMenu={
				<QuickAccessButton
					primary
					invert
					mainAction={
						<Button
							primary
							invert
							icon={<Icon>location_searching</Icon>}
							title="Location Searching"
							buttonAttributes={{ role: "link" }}
						/>
					}
					actionItems={[
						{ text: "Go to Issue", graphic: <Icon>location_searching</Icon>, htmlAttributes: { role: "link" } },
						{ text: "Expand Issue", graphic: <Icon>unfold_more</Icon>, disabled: true },
						{ text: "Show All Issues", graphic: <Icon>view_list</Icon> }
					]}
				/>
			}
			pagination={
				<Pagination
					currentPage={1}
					onPageChanged={noop}
					pageCount={10}
					pageLabelTemplate="{page} / {total}"
					type="simple"
				/>
			}
		/>
	);
}

interface NavBarProps {
	onClick?(item: MenuItem): void;
}

export class NavBar extends Component<NavBarProps, { selectedItem: MenuItem }> {
	constructor(props: NavBarProps) {
		super(props);
		this.state = { selectedItem: { label: "Calculation" } };
	}

	render(): ReactElement {
		const navItems: MenuItem[] = [{ label: "Calculation" }, { label: "Receipts" }].map((navItem) => ({
			...navItem,
			selected: navItem.label === this.state.selectedItem.label,
			onClick: () => {
				this.setState({ selectedItem: navItem });

				if (this.props.onClick) {
					this.props.onClick(navItem);
				}
			}
		}));

		return <FlyoutMenu items={navItems} type="horizontal" useAs="tabNavigation" />;
	}
}

export const AutoCompleteTpl = (props: AutocompleteProps): ReactElement => {
	const [selectedValue, setSelectedValue] = useState<string | DropDownItem>("");

	const handleOnValueChange = useCallback((value: string | DropDownItem): void => {
		setSelectedValue(value);
	}, []);

	return (
		<Autocomplete
			{...props}
			id="master-detail-autocomplete"
			onValueChange={handleOnValueChange}
			value={selectedValue}
		/>
	);
};

// ----------------------- TABLE TL --------------------------------------------- //

const COLUMNS: BaseColumnType[] = [{ label: "Date" }, { label: "Content" }, { label: "Amount" }];
const DATA = Array.from(new Range(4)).map(() =>
	Array.from(new Range(COLUMNS.length)).map((col) => {
		return col === 0 ? new Date().toDateString() : Math.floor(Math.random() * 100).toString();
	})
);

type RowType = string[];

interface TableTplProps {
	sectionTitle: string;
	editable?: boolean;
}

export const TableTpl = (props: TableTplProps): ReactElement => {
	const buttonRef = useRef<HTMLElement | null>(null);
	const { editable, sectionTitle } = props;
	const { Grid, Row, Column } = LayoutGrid;
	const [showCallout, setShowCallout] = useState(false);

	const bodyContentRenderer = useMemo(
		() =>
			(props: TableRenderPropsType.BodyContentProps<RowType>): ReactNode => {
				if (props.column.label === "Date") {
					return <DateInput />;
				}

				if (props.column.label === "Action") {
					return <Button icon={<Icon>delete</Icon>} title="Delete" />;
				}

				return (
					<TextField
						suffixes={props.column.label === "Amount" ? <TextAffix>ERU</TextAffix> : undefined}
						value={getDataByKey(props.row, props.rowIndex)?.toString() || ""}
						onChange={() => undefined}
					/>
				);
			},
		[]
	);

	return (
		<Section>
			<Headline level={2} ariaLevel={2} divider>
				{sectionTitle}
			</Headline>
			<Body>
				<Table<RowType>
					data={DATA}
					columns={editable ? [...COLUMNS, { label: "Action", actionColumn: true }] : COLUMNS}
					componentRenderers={{ bodyContentRenderer }}
				/>
				<ButtonGroup>
					<Button
						label="Add"
						onClick={() => setShowCallout(true)}
						buttonRef={(ref) => {
							buttonRef.current = ref;
						}}
					/>
				</ButtonGroup>
			</Body>
			{showCallout && buttonRef.current && (
				<Callout
					referenceElement={buttonRef.current}
					onClose={() => setShowCallout(false)}
					resizeAndDragOptions={{ referenceElement: buttonRef.current }}
					boundToContentbox
					closeOnOutsideClick
					header={{
						title: <p>{editable ? "FLIGHTS" : "OVERNIGHTERS"}</p>,
						suffix: <Button icon={<Icon>close</Icon>} title="Close" onClick={() => setShowCallout(false)} />
					}}
				>
					<Grid>
						<Row>
							<Column size={{ sm: 12, md: 6, lg: 6 }}>
								<DateInput label="Date" />
							</Column>
							<Column size={{ sm: 12, md: 6, lg: 6 }}>
								<TextField label="Content" onChange={noop} placeholder="Enter content" />
							</Column>
						</Row>
						<Row>
							<Column size={{ sm: 12, md: 12, lg: 12 }}>
								<TextField label="Amount" onChange={noop} placeholder="Enter a number" />
							</Column>
						</Row>
					</Grid>
				</Callout>
			)}
		</Section>
	);
};
