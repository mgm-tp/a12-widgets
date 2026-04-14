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

import type { FC, SyntheticEvent } from "react";
import { useRef, useContext, useState, useCallback, useLayoutEffect, useEffect } from "react";
import type { OnResizeCallback, ResizePayload } from "react-resize-detector";

import { provider } from "../../common/main/device-detector.js";
import { generateUid, usePreviousProps } from "../../common/main/utils.js";
import { ElementSizeMeasurer, getHorizontalSpacing, ResponsiveHandler } from "../../common/main/responsive-handler.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { Icon } from "../../icon/main/icon.view.js";
import { WidgetsResizeDetector } from "../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { MainMenuTpl, MenuContainer } from "./template/menu.tpl.view.js";
import type { MenuItem } from "./menu.api.js";
import type { FlyoutMenuProps } from "./flyout-menu.api.js";
import { MenuUtils } from "./menu.internal.js";
import { MenuTplUtils } from "./template/menu.tpl.internal.js";
import type { FlattenedMenuItemType } from "./template/menu.tpl.api.js";

const { flattenToMenuItems } = MenuTplUtils;

export const FlyoutMenu: FC<FlyoutMenuProps> = ({ hoverDelay = 100, onCondensed, ...props }) => {
	const domElement = useRef<HTMLDivElement | null>(null);
	const id = useRef<string>(props.id ? `${props.id}_mainmenu` : generateUid());
	const menuItemsRef = useRef(flattenToMenuItems(props.items));
	const context = useContext(A11YLanguageContext);

	const itemsWithIds = useRef(MenuUtils.fillIds(menuItemsRef.current, id.current));
	const condensedId = useRef<string>(props.id ? `${props.id}_condensed-item` : generateUid());

	const menuContainer = useRef<HTMLElement | null>(null);
	const timeoutId = useRef<number | null>(null);

	const [path, setPath] = useState<
		{
			item: MenuUtils.MenuItemWithChildren;
		}[]
	>([
		{
			item: {
				label: "root",
				items: itemsWithIds.current
			}
		}
	]);

	const [nonCondensedItemCountState, setNonCondensedItemCountState] = useState<number | undefined>(
		menuItemsRef.current.length
	);
	const [containerWidthState, setContainerWidth] = useState<number | undefined>(undefined);
	const [condensedMenuOpen, setCondensedMenuOpen] = useState(false);
	const [clickedOnMainMenu, setClickedOnMainMenu] = useState(false);
	const [condensedItemWidth, setCondensedItemWidth] = useState(0);
	const prevItems = usePreviousProps(props.items);

	const getMenuContainer = (ref: HTMLElement | null): void => {
		menuContainer.current = ref;
		props.wrapperRef?.(ref);
	};

	/**
	 * Calculate the width of the condensed menu item and spacing on the left & right of the menu.
	 * This was done by creating a fake menu with just the condensed menu item in the real DOM and calculating values
	 * from there. Css classes are needed here to have correct width/height of the rendered menu.
	 *
	 * Then, update the number of non-condensed items in the horizontal menu if not enough space is available for
	 * placement. Therefore, all necessary li elements will be gathered.
	 */
	const updateNonCondensedItemCount = useCallback((): void => {
		if (domElement.current) {
			const menuItems = Array.from(domElement.current?.querySelectorAll(`[data-role=${DataRoles.Menu.Item}]`));

			if (menuItems.length !== menuItemsRef.current.length) {
				return;
			}

			if (domElement.current && menuItems.length > 0) {
				const containerWidth = domElement.current.getBoundingClientRect().width;
				const nonCondensedItemCount = ResponsiveHandler.getNonCondensedItemNumber(
					domElement.current,
					menuItems,
					// Condensed item has the same margin as a menu item when placed inside the Menu
					condensedItemWidth + getHorizontalSpacing(menuItems[0], "margin"),
					getHorizontalSpacing(menuItems[0].parentElement, "padding")
				);
				onCondensed?.(menuItemsRef.current.slice(nonCondensedItemCount));
				setContainerWidth(containerWidth);
				setNonCondensedItemCountState(nonCondensedItemCount);
			}
		}
	}, [condensedItemWidth, onCondensed]);

	const areItemsDeepEqual = (prevItems: FlattenedMenuItemType[], newItems: FlattenedMenuItemType[]): boolean => {
		return (
			prevItems.length === newItems.length &&
			newItems.every(
				(item, index) => item.items === prevItems[index].items && MenuUtils.isItemEqual(item, prevItems[index])
			)
		);
	};

	const handleSizeChange = useCallback<OnResizeCallback>(
		({ width }: ResizePayload): void => {
			const containerWidth = width || domElement.current?.clientWidth;

			if (props.disableCondensing || containerWidthState === containerWidth) {
				return;
			}

			setContainerWidth(containerWidth);
			setNonCondensedItemCountState(undefined);
		},
		[containerWidthState, props.disableCondensing]
	);

	const updateNewStateWhenMouseOver = useCallback(
		(item: MenuItem | undefined): void => {
			if (item === undefined) {
				// Condensed menu item is undefined
				setPath((path) => [
					{
						item: path[0].item
					}
				]);
				setCondensedMenuOpen(true);
			} else {
				// Find parent in path
				const index = path.findIndex((pathItem) => {
					return (
						pathItem.item &&
						pathItem.item.items &&
						pathItem.item.items.find((childItem) => MenuUtils.isItemEqual(childItem, item)) !== undefined
					);
				});

				if (!path[index]) {
					return;
				}

				const selectedItemIndex = path[index].item.items.findIndex((childItem) =>
					MenuUtils.isItemEqual(childItem, item)
				);
				const leaveCondensedItem =
					index === 0 && nonCondensedItemCountState !== undefined && selectedItemIndex < nonCondensedItemCountState;

				setPath((path) => [
					...path.slice(0, index + 1),
					{
						item: item as MenuUtils.MenuItemWithChildren
					}
				]);
				setCondensedMenuOpen((condensedMenuOpen) => (leaveCondensedItem ? false : condensedMenuOpen));
			}
		},
		[nonCondensedItemCountState, path]
	);

	const handleClick = useCallback(
		(item: MenuUtils.ItemMenuWrapper, event: SyntheticEvent<HTMLElement>): void => {
			const originItem = item.origin;

			if (provider.isDesktop()) {
				setClickedOnMainMenu((clickedOnMainMenu) => !clickedOnMainMenu);
			}

			event.preventDefault();
			event.stopPropagation();

			// Condensed menu item is undefined
			if (originItem === undefined) {
				setPath((path) => [
					{
						item: path[0].item
					}
				]);
				setCondensedMenuOpen(true);
			} else {
				updateNewStateWhenMouseOver(originItem);

				if (originItem.onClick) {
					originItem.onClick(event);
				}
			}
		},
		[updateNewStateWhenMouseOver]
	);

	const clearTimeout = (): void => {
		if (timeoutId.current !== null) {
			window.clearTimeout(timeoutId.current);
			timeoutId.current = null;
		}
	};

	const handleMouseOver = useCallback(
		(item: MenuUtils.ItemMenuWrapper, event: SyntheticEvent<HTMLElement>): void => {
			if (item.disabled) {
				return;
			}

			const originItem = item.origin;
			event.preventDefault();
			event.stopPropagation();

			if (hoverDelay && !provider.hasTouch()) {
				clearTimeout();
				timeoutId.current = window.setTimeout(() => updateNewStateWhenMouseOver(originItem), hoverDelay);
			} else {
				updateNewStateWhenMouseOver(originItem);
			}
		},
		[hoverDelay, updateNewStateWhenMouseOver]
	);

	useLayoutEffect(() => {
		const handleClickEvent = (event: Event): void => {
			const target = event.target as Element;

			if (!clickedOnMainMenu) {
				return;
			}

			if (menuContainer.current && !menuContainer.current.contains(target)) {
				setClickedOnMainMenu(false);
			}
		};

		document.addEventListener("click", handleClickEvent, true);

		if (provider.hasTouch()) {
			document.addEventListener("touchstart", handleClickEvent, true);
		}

		return () => {
			clearTimeout();
			document.removeEventListener("click", handleClickEvent, true);

			if (provider.hasTouch()) {
				document.removeEventListener("touchstart", handleClickEvent, true);
			}
		};
	}, []); // eslint-disable-line

	useEffect(() => {
		updateNonCondensedItemCount();
	}, [condensedItemWidth, updateNonCondensedItemCount]);

	useLayoutEffect(() => {
		const updatePath = (prevMenuItems: MenuItem[]): void => {
			// Update the children of the "root" element so that the references are updated
			if (!MenuUtils.areItemsEqual(itemsWithIds.current, prevMenuItems)) {
				setPath((previousPath) => [
					{
						item: {
							label: "root",
							items: itemsWithIds.current
						}
					},
					...previousPath.slice(1)
				]);
			}
		};

		if (!prevItems) {
			return;
		}

		const flattenPrevItems = flattenToMenuItems(prevItems);
		const flattenNewItems = flattenToMenuItems(props.items);

		if (!areItemsDeepEqual(flattenPrevItems, flattenNewItems)) {
			itemsWithIds.current = MenuUtils.fillIds(flattenNewItems, id.current);
			menuItemsRef.current = [...flattenNewItems];
		}

		if (
			!props.disableCondensing &&
			domElement.current &&
			nonCondensedItemCountState === undefined &&
			containerWidthState !== undefined &&
			props.type === "horizontal"
		) {
			updateNonCondensedItemCount();
		}

		if (
			flattenPrevItems.length !== menuItemsRef.current.length ||
			!MenuUtils.areItemsEqual(flattenPrevItems, menuItemsRef.current)
		) {
			setNonCondensedItemCountState(undefined);
		}

		updatePath(flattenPrevItems);
	}, [
		containerWidthState,
		nonCondensedItemCountState,
		prevItems,
		props.disableCondensing,
		props.items,
		props.scrollToSelectedItem,
		props.type,
		updateNonCondensedItemCount
	]);

	useEffect(() => {
		const scrollSelectedItemToView = (selectedItem: MenuItem): void => {
			if (selectedItem && selectedItem.id) {
				const selectedItemNode = document.getElementById(selectedItem.id);
				selectedItemNode?.scrollIntoView({ block: "center" });
			}
		};

		const selectedItem = itemsWithIds.current.find((item) => item.selected === true);

		if (!selectedItem || props.type !== "vertical") {
			return;
		}

		if (!prevItems) {
			scrollSelectedItemToView(selectedItem);
		} else if (prevItems) {
			const flattenPrevItems = flattenToMenuItems(prevItems);

			// scroll to selected item when item list is updated from empty to containing-element state
			// Being used when projects fetch data from store
			if (
				flattenPrevItems.length === 0 &&
				menuItemsRef.current.length !== 0 &&
				props.type === "vertical" &&
				itemsWithIds.current.length > 0 &&
				props.scrollToSelectedItem
			) {
				scrollSelectedItemToView(selectedItem);
			}
		}
	}, [prevItems, props.scrollToSelectedItem, props.type]);

	const items: (FlattenedMenuItemType & { condensed?: boolean })[] = [];

	for (const item of itemsWithIds.current) {
		items.push(
			MenuUtils.createMenuItemWrapper(item, (_item) =>
				path.some((itemOnPath) => MenuUtils.isItemEqual(itemOnPath.item, _item))
			)
		);
	}

	if (props.type === "horizontal") {
		const nonCondensedItemCount =
			nonCondensedItemCountState === 0 ? 0 : nonCondensedItemCountState || menuItemsRef.current.length;
		const nonCondensedItems = items.slice(0, nonCondensedItemCountState);
		const condensedItems = items.slice(nonCondensedItemCountState);

		if (nonCondensedItemCount < items.length) {
			nonCondensedItems.push({
				id: condensedId.current,
				label: "",
				condensed: true,
				icon: <Icon>more_horiz</Icon>,
				title: context.menuTitles?.condensedItem,
				selected: condensedItems.filter((item) => item.selected === true).length > 0,
				items: condensedMenuOpen ? condensedItems : [],
				badge: props.condensedBadge
			});
		}

		return (
			<MenuContainer
				style={props.style}
				className={props.className}
				id={props.id}
				wrapperRef={getMenuContainer}
				type={props.type}
				condensible={!props.disableCondensing}
				ariaLabel={props.mainContainerLabel}
				useAs={props.useAs}
			>
				<WidgetsResizeDetector handleHeight={false} onResize={handleSizeChange} targetRef={domElement}>
					<div ref={domElement}>
						<MainMenuTpl
							type={props.type}
							id={id.current}
							items={nonCondensedItems}
							onClick={handleClick}
							onMouseOver={handleMouseOver}
							clickedOnMainMenu={clickedOnMainMenu}
							subMenuAttributes={props.subMenuAttributes}
							useAs={props.useAs}
							nonCondensedItemCount={nonCondensedItemCount}
						/>
					</div>
				</WidgetsResizeDetector>
				{condensedItemWidth === 0 && (
					<ElementSizeMeasurer
						callback={setCondensedItemWidth}
						itemDataRole={DataRoles.Menu.Item}
						elementToRender={
							<MainMenuTpl
								type="horizontal"
								items={[{ label: "", icon: <Icon>more_vert</Icon> }]}
								useAs={props.useAs}
							/>
						}
					/>
				)}
			</MenuContainer>
		);
	} else {
		return (
			<MenuContainer
				style={props.style}
				className={props.className}
				id={props.id}
				wrapperRef={getMenuContainer}
				type={props.type}
				collapsed={props.collapsed}
				ariaLabel={props.mainContainerLabel}
				useAs={props.useAs}
			>
				<div ref={domElement}>
					<MainMenuTpl
						type={props.type}
						id={id.current}
						items={items}
						onClick={handleClick}
						onMouseOver={handleMouseOver}
						collapsed={props.collapsed}
						useAs={props.useAs}
					/>
				</div>
			</MenuContainer>
		);
	}
};

FlyoutMenu.displayName = "FlyoutMenu";
