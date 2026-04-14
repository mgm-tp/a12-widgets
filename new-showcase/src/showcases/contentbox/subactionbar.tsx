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

import { loremIpsum } from "lorem-ipsum";
import type { ReactNode, ReactElement } from "react";
import { useState, useContext, useMemo, useCallback } from "react";

import {
	Button,
	noop,
	ActionContentbox,
	ContentBoxElements,
	SubActionBarTpl,
	Counter,
	Filter,
	FilterBarMobile,
	Icon,
	TextField
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContext } from "../../helpers/theme-selector.js";

const TEXT = (): string => loremIpsum({ units: "sentences", count: 15 });

export function SubActionBarWithAnimationShowcase(): ReactElement<{}> {
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [showFilterBar, setShowFilterBar] = useState(false);
	const { theme } = useContext(ThemeContext);
	const isFlatTheme = theme.includes("flat");

	const renderSearchBar = useMemo((): ReactNode => {
		return (
			<TextField
				onChange={noop}
				key="search"
				placeholder="Search"
				label="Search with hidden label"
				hideLabel
				suffixes={
					<Button
						icon={<Icon>search</Icon>}
						onClick={() => {
							alert("Search button clicked");
						}}
						title="Search"
					/>
				}
			/>
		);
	}, []);

	const renderFilterBarMobile = useMemo((): ReactNode => {
		return (
			<FilterBarMobile key="filter" actions={<Button secondary label="Edit" />}>
				<Filter id="filter-1" options={["Blue", "Red", "White", "Black"]} name="Filter 1" active />
				<Filter id="filter-2" options="inactive" name="Filter 2" />
				<Counter value={22} overflowCount={9} />
			</FilterBarMobile>
		);
	}, []);

	const toggleFilterBar = useCallback((): void => {
		setShowFilterBar((prevState) => !prevState);
	}, []);

	const toggleSearchBar = useCallback((): void => {
		setShowSearchBar((prevState) => !prevState);
	}, []);

	return (
		<ActionContentbox
			footer={<ContentBoxElements.Footer />}
			headingPrefixes={<ContentBoxElements.BackButton />}
			headingElements={<ContentBoxElements.Title key="title" text="With Search/Filter Bar" />}
			headingButtons={
				<>
					<ContentBoxElements.HeadingActionButton
						icon={<Icon>search</Icon>}
						active={showSearchBar}
						title="Search"
						onClick={toggleSearchBar}
					/>
					<ContentBoxElements.HeadingActionButton
						icon={<Icon>filter_list</Icon>}
						active={showFilterBar}
						onClick={toggleFilterBar}
						title="Filter"
					/>
				</>
			}
			padding={true}
			subActionBar={
				<>
					<SubActionBarTpl hidden={!showSearchBar}>{renderSearchBar}</SubActionBarTpl>
					<SubActionBarTpl hidden={!showFilterBar}>{renderFilterBarMobile}</SubActionBarTpl>
				</>
			}
			style={{ width: 400 }}
		>
			<p className={isFlatTheme ? "-u-margin-t-0" : undefined}>{TEXT()}</p>
		</ActionContentbox>
	);
}
