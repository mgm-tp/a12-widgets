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

import type { FC, MouseEvent, KeyboardEvent, ChangeEvent } from "react";
import { useState, useCallback, useMemo } from "react";
import { styled } from "styled-components";
import { Key } from "ts-key-enum";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core";
import { List, LayoutGrid, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import type { SearchItem } from "./search-component.js";
import { SearchComponent } from "./search-component.js";
import type { GlobalSearchContextProps } from "./global-search-context.js";
import { GlobalSearchContext } from "./global-search-context.js";

const StyledListShowcase = styled(List)`
	width: fit-content;
`;

const { Grid, Row, Column } = LayoutGrid;

function groupedSearchItems(searchItems: SearchItem[]): Record<string, SearchItem[]> {
	if (searchItems.length === 0) {
		return {};
	}

	const groupedData: Record<string, SearchItem[]> = {};

	for (const i in searchItems) {
		if (searchItems?.[i]?.location === undefined) {
			return {};
		}

		if (!Object.prototype.hasOwnProperty.call(groupedData, searchItems[i].location as any)) {
			groupedData[searchItems[i].location as any] = [];
		}

		groupedData[searchItems[i].location as any].push(searchItems[i]);
	}

	return groupedData;
}

const GlobalSearchProvider: FC<{ onItemClick: (item: SearchItem) => void } & Container> = ({
	children,
	onItemClick
}) => {
	const [items, setItems] = useState(SearchComponent.default.search(""));
	const [isOpen, setIsOpen] = useState(false);
	const [renderedItems, setRenderedItems] = useState<SearchItem[]>();
	const [currentSelectedItem, setCurrentSelectedItem] = useState<SearchItem>();
	const [searchText, setSearchText] = useState<string | undefined>(undefined);

	const showModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeModal = useCallback(() => {
		setIsOpen(false);
		setSearchText("");
		setCurrentSelectedItem(undefined);
		const mainContent = document.querySelector('div[role="main"]') as HTMLElement;
		mainContent?.focus();
	}, []);

	const handleItemClick = useCallback(
		(item: SearchItem, event?: MouseEvent<HTMLElement>): void => {
			event?.preventDefault();
			setTimeout(closeModal);
			onItemClick?.(item);
		},
		[closeModal, onItemClick]
	);

	const handleSearchKeyDown = useCallback(
		(event: KeyboardEvent): void => {
			if (renderedItems && currentSelectedItem) {
				if (event.key === Key.ArrowDown || event.key === Key.ArrowUp) {
					event.preventDefault();
					const currentIndex = renderedItems.indexOf(currentSelectedItem);
					const direction = event.key === Key.ArrowDown ? 1 : -1;
					const newSelectedIndex =
						currentIndex === renderedItems.length - 1 && direction > 0
							? 0
							: currentIndex === 0 && direction < 0
								? renderedItems.length - 1
								: currentIndex + direction;
					setCurrentSelectedItem(renderedItems[newSelectedIndex]);
					document.getElementById(renderedItems[newSelectedIndex].title)?.scrollIntoView(false);
				}

				if (event.key === Key.Enter) {
					event.preventDefault();
					handleItemClick(currentSelectedItem);
				}
			}
		},
		[renderedItems, currentSelectedItem, setCurrentSelectedItem, handleItemClick]
	);

	const initialSearchContent = useMemo(() => {
		const getStarted = SearchComponent.default.search("get started");
		const groupedData = groupedSearchItems(getStarted);

		return (
			<Grid>
				<Row>
					{Object.keys(groupedData).map((key) => (
						<Column size={{ sm: 6, md: 6, lg: 6 }} key={key}>
							<StyledListShowcase key={key} paddedLeft>
								<List.SubHeader graphic={<Icon iconTheme="custom">datatype_default</Icon>}>
									{key.split("/").pop()}
								</List.SubHeader>
								{groupedData[key].map((item: SearchItem, index: number) => (
									<List.Item
										key={index}
										text={item.title}
										meta={<Icon iconTheme="outlined">keyboard_arrow_right</Icon>}
										onClick={(event): void => handleItemClick(item, event)}
									/>
								))}
							</StyledListShowcase>
						</Column>
					))}
				</Row>
			</Grid>
		);
	}, [handleItemClick]);

	const searchContent = useMemo(() => {
		const groupedData = groupedSearchItems(items);

		return Object.keys(groupedData).map((key) => (
			<List key={key} paddedLeft>
				<List.SubHeader graphic={<Icon iconTheme="custom">datatype_default</Icon>}>{key}</List.SubHeader>
				{groupedData[key].map((item: SearchItem, index: number) => (
					<List.Item
						key={index}
						id={item.title}
						text={item.title}
						meta={<Icon iconTheme="outlined">keyboard_arrow_right</Icon>}
						selected={item === currentSelectedItem}
						graphic={<Icon>subdirectory_arrow_right</Icon>}
						onClick={(event): void => handleItemClick(item, event)}
						tabIndex={-1}
					/>
				))}
			</List>
		));
	}, [currentSelectedItem, handleItemClick, items]);

	const handleValueChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			const searchedItems = SearchComponent.default.search(event.target.value);
			setSearchText(event.target.value);
			setItems(searchedItems);
			const groupedData = groupedSearchItems(searchedItems);
			const currentSearchedItemsFlattened = Object.keys(groupedData)
				.map((key) => groupedData[key].map((item: SearchItem) => item))
				.flat();
			setRenderedItems(currentSearchedItemsFlattened);
			setCurrentSelectedItem(currentSearchedItemsFlattened[0]);
			document.getElementById(currentSearchedItemsFlattened[0]?.text)?.scrollIntoView(false);
		},
		[setCurrentSelectedItem, setRenderedItems, setSearchText]
	);

	const contextValue: GlobalSearchContextProps = {
		isOpen,
		showModal,
		closeModal,
		searchText,
		items,
		handleValueChange,
		handleSearchKeyDown,
		initialSearchContent,
		searchContent
	};

	return <GlobalSearchContext.Provider value={contextValue}>{children}</GlobalSearchContext.Provider>;
};

export default GlobalSearchProvider;
