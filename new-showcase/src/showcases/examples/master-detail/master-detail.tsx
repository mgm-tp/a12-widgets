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

import type { FC, ReactNode, ReactElement } from "react";
import { useState, useMemo, useCallback } from "react";

import type {
	Layoutable,
	VisibleView,
	Animation,
	SizeDetectorProps,
	MenuItem
} from "@com.mgmtp.a12.widgets/widgets-core";
import {
	FocusLastLayout,
	MasterDetail,
	ButtonGroupContainer,
	ActionContentbox,
	ContentBoxElements
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { Data, FilterInFilterBarData } from "./filter-selector/data.js";
import * as Utils from "./filter-selector/common.js";
import { NavBar, NotificationArea } from "./master-detail-template.js";
import { Overview } from "./overview.js";
import { DetailView } from "./detail-view.js";
import type { StringRow } from "./master-view.js";
import { MasterView, TABLE_DATA } from "./master-view.js";
import { DATA } from "./setup.js";

export type LayoutIdentifier = "OverView" | "Detail";

type LayoutIdentifierGeneralType = LayoutIdentifier & Layoutable;

const layoutManager: FocusLastLayout<LayoutIdentifierGeneralType> = new FocusLastLayout<LayoutIdentifierGeneralType>([
	"OverView",
	"Detail"
]);

export const MasterDetailExample: FC = () => {
	const [data, setData] = useState<StringRow[]>(TABLE_DATA);
	const [selectedRow, setSelectedRow] = useState<StringRow | null>(null);
	const [navItemSelected, setNavItemSelected] = useState<MenuItem | null>(null);
	const [filtersInFilterBar, setFiltersInFilterBar] = useState<FilterInFilterBarData[]>(
		Utils.getFiltersInFilterBar(DATA.filterData, true)
	);
	const [activeFilters, setActiveFilters] = useState<Data[]>();
	const [inactiveFilters, setInactiveFilters] = useState<Data[]>();
	const [showFilterBarOnMobile, setShowFilterBarOnMobile] = useState<boolean>(false);
	const [smallView, setSmallView] = useState<boolean>(false);

	layoutManager.columnCount = useMemo(() => (smallView ? 1 : 2), [smallView]);
	layoutManager.goto("OverView");

	const onCloseDetailView = (): void => {
		setSelectedRow(null);
	};

	layoutManager.goto(selectedRow ? "Detail" : "OverView");

	const getFilterById = useCallback((id: string, filters: Data[]): Data | undefined => {
		return filters.find((value) => value.id === id);
	}, []);

	// Handle filter
	const updateFilterResult = useCallback(
		(newActiveFilters: Data[], newInactiveFilters?: Data[], newFiltersInFilterBar?: FilterInFilterBarData[]): void => {
			const filterByCustomerProject = getFilterById("customer-project-filter", newActiveFilters);
			const customerProjectOptions = filterByCustomerProject ? filterByCustomerProject.options : undefined;
			const operation = filterByCustomerProject ? filterByCustomerProject.operation : undefined;

			const filterByName = getFilterById("name-filter", newActiveFilters);
			const nameOption = filterByName ? filterByName.options : undefined;

			const filterResult = TABLE_DATA.filter((value) => {
				let matchedCustomerProject;
				let matchedName = true;

				/* Filter by Customer Project */
				if (customerProjectOptions && operation && customerProjectOptions !== "Inactive") {
					const customerProjects = value[4].split(", ");
					const filterOptions = customerProjectOptions.split(", ");

					if (operation === "and") {
						matchedCustomerProject = filterOptions.every((project: any) => {
							return customerProjects.indexOf(project) !== -1;
						});
					} else {
						matchedCustomerProject = filterOptions.find((project: any) => {
							return customerProjects.indexOf(project) !== -1;
						});
					}
				} else {
					matchedCustomerProject = true;
				}

				/* Filter by Name */
				if (nameOption && nameOption !== "Inactive") {
					matchedName = value[0].toLocaleLowerCase().includes(nameOption);
				}

				return matchedCustomerProject && matchedName;
			});
			setData([...filterResult]);

			/* Store these props in parent component to be able to update the Overview
			after back from Detail View on mobile */
			setActiveFilters(newActiveFilters);
			setInactiveFilters(newInactiveFilters);
			setFiltersInFilterBar(newFiltersInFilterBar || []);
		},
		[getFilterById]
	);

	const onRemoveFilter = useCallback(
		(
			id: string,
			newActiveFilters: Data[],
			newInactiveFilters: Data[],
			newFiltersInFilterBar?: FilterInFilterBarData[]
		): void => {
			updateFilterResult(newActiveFilters, newInactiveFilters, newFiltersInFilterBar);
		},
		[updateFilterResult]
	);

	const onShowFilterBarOnMobile = useCallback((newShowFilterBarOnMobile: boolean) => {
		setShowFilterBarOnMobile(newShowFilterBarOnMobile);
	}, []);

	const overView = useCallback(() => {
		return {
			key: "OverView",
			element: (
				<ContentBoxWrapper
					overView={true}
					title="OverView"
					key="OverView"
					onApplyFilter={updateFilterResult}
					onRemoveFilter={onRemoveFilter}
					activeFilters={activeFilters}
					inactiveFilters={inactiveFilters}
					filtersInFilterBar={filtersInFilterBar}
					onShowFilterBarOnMobile={onShowFilterBarOnMobile}
					showFilterBarOnMobile={showFilterBarOnMobile}
				>
					<MasterView onClickRow={setSelectedRow} data={data} />
				</ContentBoxWrapper>
			)
		};
	}, [
		activeFilters,
		data,
		filtersInFilterBar,
		inactiveFilters,
		onRemoveFilter,
		onShowFilterBarOnMobile,
		showFilterBarOnMobile,
		updateFilterResult
	]);

	const detailView = useCallback(
		() => ({
			key: "Detail",
			element: (
				<ContentBoxWrapper
					contentClassName="form-engine"
					title="Detail"
					onBack={smallView ? () => setSelectedRow(null) : undefined}
					onClose={!smallView ? onCloseDetailView : undefined}
					key="Detail"
					footerContent={
						<ButtonGroupContainer
							responsive
							leftSlotButtons={[
								{ label: "First Left Button", secondary: true },
								{ label: "Second Left Button", secondary: true }
							]}
							rightSlotButtons={[
								{ label: "Cancel", destructive: true },
								{ label: "Submit", primary: true }
							]}
						/>
					}
					navigation={<NavBar onClick={setNavItemSelected} />}
				>
					{selectedRow && <DetailView rowData={selectedRow} navItemSelected={navItemSelected} />}
				</ContentBoxWrapper>
			)
		}),
		[navItemSelected, selectedRow, smallView]
	);

	const handleWindowSizeChanged = useCallback((breakPoint: SizeDetectorProps.BreakPoint): void => {
		setSmallView(breakPoint.size === "sm" || breakPoint.size === "xs");
	}, []);

	const animation: Animation = {
		animateSingleItem: selectedRow && smallView ? "rtl" : "ltr"
	};

	const visibleViews = useCallback(() => {
		const updatedViews: VisibleView[] = [];

		if (smallView) {
			updatedViews[0] = selectedRow ? detailView() : overView();
		} else {
			updatedViews[0] = overView();

			if (selectedRow) {
				updatedViews[1] = detailView();
			}
		}

		return updatedViews;
	}, [detailView, overView, selectedRow, smallView]);

	return (
		<MasterDetail
			visibleViews={visibleViews()}
			animation={animation}
			onSizeChange={handleWindowSizeChanged}
			listenToWindowSize={false}
			firstViewResizableOptions={{
				maxWidth: "70%",
				minWidth: "300px"
			}}
		/>
	);
};

export interface ContentBoxWrapperProps {
	title: string;
	overView?: boolean;
	children?: ReactNode;
	footerContent?: ReactNode;
	navigation?: ReactNode;
	activeFilters?: Data[];
	inactiveFilters?: Data[];
	filtersInFilterBar?: FilterInFilterBarData[];
	showFilterBarOnMobile?: boolean;
	contentClassName?: string;
	onBack?(): void;
	onClose?(): void;
	onApplyFilter?(activeFilters: Data[], inactiveFilters?: Data[], filtersInFilterBar?: FilterInFilterBarData[]): void;
	onRemoveFilter?(
		id: string,
		activeFilters: Data[],
		inactiveFilters?: Data[],
		filtersInFilterBar?: FilterInFilterBarData[]
	): void;
	onShowFilterBarOnMobile?(showFilterBarOnMobile: boolean): void;
}

export function ContentBoxWrapper(props: ContentBoxWrapperProps): ReactElement<ContentBoxWrapperProps> {
	return props.overView ? (
		<Overview {...props} />
	) : (
		<ActionContentbox
			className={props.contentClassName}
			padding={true}
			headingPrefixes={props.onBack && <ContentBoxElements.BackButton onClick={props.onBack} />}
			headingElements={<ContentBoxElements.Title text={props.title} />}
			headingButtons={props.onClose && <ContentBoxElements.CloseButton onClick={props.onClose} />}
			footer={<ContentBoxElements.Footer>{props.footerContent}</ContentBoxElements.Footer>}
			notificationArea={<NotificationArea />}
			navigation={props.navigation}
			role="form"
			ariaLabel="Detail form"
			tabIndex={-1}
		>
			{props.children}
		</ActionContentbox>
	);
}
