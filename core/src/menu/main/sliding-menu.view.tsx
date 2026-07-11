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

import {
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type FC,
	type KeyboardEvent,
	type MouseEvent,
	type ReactElement,
	type ReactNode
} from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { css, styled } from "styled-components";
import type { OnResizeCallback, ResizePayload } from "react-resize-detector";
import { useResizeDetector } from "react-resize-detector";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { isSimilarNode } from "../../common/main/react-node-utils.js";
import { addPrefix, isVisibleOnScreen, joinClassNames } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { useKeyboardNavigationMode } from "../../keyboard-navigation/main/keyboard-navigation-context.js";
import type { KeyboardNavigationMode } from "../../keyboard-navigation/main/keyboard-navigation.api.js";
import { Icon } from "../../icon/main/icon.view.js";

import type { MenuItem } from "./menu.api.js";
import type { SlidingMenuProps } from "./sliding-menu.api.js";
import { MenuUtils } from "./menu.internal.js";
import { MenuTplUtils } from "./template/menu.tpl.internal.js";
import {
	getNavigableMenuItems,
	initDefaultMenuTabIndex,
	isMenuItemList,
	resetMenuRovingTabIndex,
	updateMenuRovingTabIndex
} from "./menu.utils.js";
import { useSlidingMenuKeyboard, type SlidingMenuKeyboardOptions } from "./use-sliding-menu-keyboard.js";
import { MainMenuTpl, MenuContainer } from "./template/menu.tpl.view.js";

const { flattenToMenuItems } = MenuTplUtils;

/** @internal */
interface SlidingMenuInternalProps extends SlidingMenuProps {
	keyboardNavMode?: KeyboardNavigationMode;
	handleSlidingMenuKeyDown: (event: KeyboardEvent<HTMLElement>, options: SlidingMenuKeyboardOptions) => void;
}

const BaseSlidingMenuWrapper = styled.div<Pick<SlidingMenuProps.MainWrapperProps, "expanded"> & { $top?: number }>(
	({ theme, expanded, $top }) => {
		const { menu } = theme.components;
		const height = $top ? `calc(100% - ${$top}px)` : menu.slidingMenu.height;

		return css`
			background-color: ${menu.slidingMenu.background};
			height: ${height};
			left: -100%;
			position: fixed;
			transition:
				transform 0.3s ease-in-out 0s,
				visibility 0.3s,
				z-index 1s;
			visibility: hidden;
			width: 100%;
			z-index: 0;
			${expanded &&
			css`
				overflow-y: auto;
				transform: translateX(100%);
				visibility: visible;
				z-index: 2;
			`}
		`;
	}
);

export interface SlidingMenuState {
	path: MenuUtils.MenuItemWithChildren[];
	lastAction: "backward" | "forward" | undefined;
}

function SlidingMenuInternal(props: SlidingMenuInternalProps): ReactElement {
	const context = useContext(A11YLanguageContext);

	const [path, setPath] = useState<MenuUtils.MenuItemWithChildren[]>(() => [
		{
			label: "root",
			items: isMenuItemList(props.items) ? flattenToMenuItems(props.items) : []
		}
	]);
	const [lastAction, setLastAction] = useState<"backward" | "forward" | undefined>(undefined);

	const hiddenMainMenuElementRef = useRef<HTMLElement | null>(null);

	const menuContainerRef = useRef<HTMLElement | null>(null);

	const selectedItemNodeRef = useRef<HTMLLIElement | null>(null);

	const wrapperElementRef = useRef<HTMLDivElement | null>(null);

	const pathRef = useRef(path);
	const propsRef = useRef(props);
	const contextRef = useRef(context);
	useLayoutEffect(() => {
		pathRef.current = path;
		propsRef.current = props;
		contextRef.current = context;
	});

	const pendingNavigationRef = useRef<{
		type: "forward" | "backward";
		departingLabel?: string;
	} | null>(null);

	const shouldScrollRef = useRef(false);

	const prevItemsLengthRef = useRef(props.items.length);

	const isMountedRef = useRef(false);

	const baseClassName = addPrefix("nav");

	function generatePath(items: MenuUtils.MenuItemWithChildren[]): MenuUtils.MenuItemWithChildren[] {
		const result: MenuUtils.MenuItemWithChildren[] = [];
		const selected = items.find((item) => !!item.selected);

		if (selected?.items) {
			result.push(selected as MenuUtils.MenuItemWithChildren);

			return result.concat(generatePath(selected.items as MenuUtils.MenuItemWithChildren[]));
		}

		return result;
	}

	const syncMenuTabIndex = useCallback(() => {
		if (!menuContainerRef.current) {
			return;
		}

		if (propsRef.current.keyboardNavMode === "arrow-only") {
			resetMenuRovingTabIndex(menuContainerRef.current);
		} else {
			initDefaultMenuTabIndex(menuContainerRef.current);
		}
	}, []);

	const scrollSelectedItemToView = useCallback(() => {
		if (!propsRef.current.scrollToSelectedItem) {
			return;
		}

		const currentPath = pathRef.current;
		const rootItems = currentPath[0].items;
		const selectedItem = rootItems.find((item) => item.selected === true);

		if (!selectedItem) {
			return;
		}

		const updatedItems = rootItems.map((item) =>
			item === selectedItem
				? {
						...item,
						wrapperRef: (ref: HTMLLIElement | null): void => {
							selectedItemNodeRef.current = ref;
						}
					}
				: item
		);
		setPath([{ ...currentPath[0], items: updatedItems }]);
	}, []);

	const navigateBack = useCallback(() => {
		const currentPath = pathRef.current;
		const departingItem = currentPath[currentPath.length - 1];
		const departingLabel =
			departingItem.label && typeof departingItem.label === "string" ? departingItem.label : departingItem.title;

		pendingNavigationRef.current = { type: "backward", departingLabel };
		setLastAction("backward");
		setPath((prev) => prev.slice(0, prev.length - 1));
	}, []);

	const navigateForward = useCallback((item: MenuUtils.MenuItemWithChildren) => {
		const currentLast = pathRef.current[pathRef.current.length - 1];

		if (currentLast && MenuUtils.isItemEqual(currentLast, item)) {
			return;
		}

		pendingNavigationRef.current = { type: "forward" };
		setLastAction("forward");
		setPath((prev) => [...prev, item]);
	}, []);

	useEffect(() => {
		if (!propsRef.current.scrollToSelectedItem) {
			hiddenMainMenuElementRef.current?.focus();
		} else {
			shouldScrollRef.current = true;
			scrollSelectedItemToView();
		}

		syncMenuTabIndex();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!isMountedRef.current) {
			isMountedRef.current = true;

			return;
		}

		syncMenuTabIndex();
	}, [props.keyboardNavMode, path.length, syncMenuTabIndex]);

	useEffect(() => {
		const flattenedItems = flattenToMenuItems(props.items);

		if (!MenuUtils.areItemsEqual(flattenedItems, pathRef.current[0].items)) {
			const newRootPath: MenuUtils.MenuItemWithChildren[] = [
				{
					label: "root",
					items: isMenuItemList(props.items) ? flattenedItems : []
				}
			];
			const wasEmpty = prevItemsLengthRef.current === 0 && props.items.length !== 0;

			if (wasEmpty) {
				shouldScrollRef.current = true;
			}

			setPath(newRootPath.concat(generatePath(flattenedItems as MenuUtils.MenuItemWithChildren[])));
		}

		prevItemsLengthRef.current = props.items.length;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.items]);

	useEffect(() => {
		const pending = pendingNavigationRef.current;

		if (pending) {
			pendingNavigationRef.current = null;
			const isArrowOnly = propsRef.current.keyboardNavMode === "arrow-only";
			const container = wrapperElementRef.current ?? menuContainerRef.current;
			const menuItems = container ? getNavigableMenuItems(container, isArrowOnly) : [];

			if (pending.type === "forward") {
				(menuItems[0] ?? menuContainerRef.current)?.focus();
			} else {
				const parentItem = pending.departingLabel
					? menuItems.find((el) => el.textContent?.includes(pending.departingLabel ?? ""))
					: undefined;
				const itemToFocus = parentItem ?? menuItems[0];

				if (isArrowOnly && itemToFocus) {
					const newIndex = menuItems.indexOf(itemToFocus);

					if (newIndex >= 0) {
						updateMenuRovingTabIndex(menuItems, newIndex);
					}
				}

				itemToFocus?.focus();
			}
		}

		if (shouldScrollRef.current) {
			shouldScrollRef.current = false;
			selectedItemNodeRef.current?.scrollIntoView({ block: "center" });
		}
	}, [path]);

	const handleEntered = useCallback(() => {
		if (menuContainerRef.current?.contains(document.activeElement)) {
			hiddenMainMenuElementRef.current?.focus();
		}
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			propsRef.current.handleSlidingMenuKeyDown(event, {
				menuContainer: menuContainerRef.current,
				path: pathRef.current,
				navigateBack,
				navigateForward,
				onTabOut: propsRef.current.onTabOut,
				keyboardNavMode: propsRef.current.keyboardNavMode
			});
		},
		[navigateBack, navigateForward]
	);

	const handleClick = useCallback(
		(item: MenuUtils.ItemMenuWrapper, event: MouseEvent<HTMLElement>) => {
			const { id: menuId } = propsRef.current;
			const originItem = item.origin;
			const menuWrapper = menuContainerRef.current;
			const wrapperElement = wrapperElementRef;
			const currentPath = pathRef.current;

			const currentParentPath = currentPath[currentPath.length - 1];
			const backwardLabel = currentParentPath.backwardItemProps?.label ?? currentParentPath.label;
			const backwardIcon = currentParentPath.backwardItemProps?.icon ?? (
				<Icon title={contextRef.current.menuTitles?.closeSubMenu}>chevron_left</Icon>
			);

			if (originItem.label === backwardLabel && originItem.icon && isSimilarNode(originItem.icon, backwardIcon)) {
				navigateBack();
			} else if (originItem.items !== undefined) {
				navigateForward(originItem as MenuUtils.MenuItemWithChildren);
			}

			if (originItem.onClick) {
				originItem.onClick(event);
			}

			const path = currentPath[currentPath.length - 1];

			function handleFocus(isBackward = false): void {
				const isUsingProvidedId = !!originItem.id;
				const isUsingDefaultStaticId = !!(
					menuId &&
					((originItem.label && typeof originItem.label === "string") || originItem.title) &&
					item.id
				);

				if (isUsingProvidedId || isUsingDefaultStaticId) {
					const parentLabel = path.label && typeof path.label === "string" ? path.label : path.title;
					const itemsContainer = wrapperElement.current ?? menuWrapper;
					const menuItems = [...(itemsContainer?.querySelectorAll(`[data-role="${DataRoles.Menu.Item}"]`) ?? [])];
					const parentItem = menuItems.find((el) => el.textContent?.includes(parentLabel ?? ""));
					const firstItemOnSubMenu = menuItems[0];
					const itemToFocus = (isBackward ? parentItem : firstItemOnSubMenu) as HTMLElement;

					if (!itemToFocus) {
						return;
					}

					itemToFocus.focus();

					menuWrapper?.addEventListener(
						"transitionend",
						() => {
							if (!isVisibleOnScreen(itemToFocus)) {
								itemToFocus.scrollIntoView({ block: "center", behavior: "smooth" });
							}
						},
						{ once: true }
					);
				} else {
					menuWrapper?.focus();
				}
			}

			// Defer focus by one microtask so React has flushed the path state update before we query the DOM.
			if (originItem.items !== undefined || originItem.label === backwardLabel) {
				void Promise.resolve().then(() => handleFocus(originItem.label === backwardLabel));
			}
		},
		[navigateBack, navigateForward]
	);

	const renderParentItem = path[path.length - 1];
	const backwardItemOverrideProps = renderParentItem.backwardItemProps;
	const backwardItemMergedProps = { ...renderParentItem, ...backwardItemOverrideProps };
	const backwardItemLabel: ReactNode = renderParentItem.backwardItemProps?.label ?? renderParentItem.label;
	const backwardItemIcon: ReactNode = renderParentItem.backwardItemProps?.icon ?? (
		<Icon title={context.menuTitles?.closeSubMenu}>chevron_left</Icon>
	);

	const transitionName =
		lastAction === "forward"
			? `${baseClassName}__wrapper--rtl`
			: lastAction === "backward"
				? `${baseClassName}__wrapper--ltr`
				: "";

	const renderedItems: MenuItem[] =
		path.length > 1
			? [
					MenuUtils.createMenuItemWrapper({
						...backwardItemMergedProps,
						items: undefined,
						selected: undefined,
						label: backwardItemLabel,
						icon: backwardItemIcon
					})
				]
			: [];

	for (const item of renderParentItem.items) {
		renderedItems.push(
			MenuUtils.createMenuItemWrapper(item, (_item) =>
				path.some((itemOnPath) => MenuUtils.isItemEqual(itemOnPath, _item))
			)
		);
	}

	return (
		<MenuContainer
			style={props.style}
			className={props.className}
			id={props.id}
			wrapperRef={(ref: HTMLElement | null) => {
				menuContainerRef.current = ref;
				props.wrapperRef?.(ref);
			}}
			type="vertical"
			collapsed={props.collapsed}
			sliding
			ariaLabel={props.mainContainerLabel}
			useAs={props.useAs}
			onKeyDown={handleKeyDown}
		>
			<TransitionGroup>
				<CSSTransition
					key={path.length}
					classNames={transitionName}
					timeout={100}
					enter
					exit
					onEntered={handleEntered}
					nodeRef={wrapperElementRef}
				>
					<MainMenuTpl
						items={renderedItems}
						type="vertical"
						onClick={handleClick}
						sliding
						key={path.length}
						id={props.id ? `${props.id}_mainmenu` : undefined}
						collapsed={props.collapsed}
						hiddenMainMenuRef={(ref: HTMLElement | null) => {
							hiddenMainMenuElementRef.current = ref;
						}}
						wrapperRef={(ref: HTMLDivElement | null) => {
							wrapperElementRef.current = ref;
						}}
					/>
				</CSSTransition>
			</TransitionGroup>
		</MenuContainer>
	);
}

SlidingMenuInternal.displayName = "SlidingMenu";

const SlidingMenuWithKeyboardNav: FC<SlidingMenuProps> = (props) => {
	const keyboardNavMode = useKeyboardNavigationMode("slidingMenu");
	const { handleSlidingMenuKeyDown } = useSlidingMenuKeyboard();

	return (
		<SlidingMenuInternal
			{...props}
			keyboardNavMode={keyboardNavMode}
			handleSlidingMenuKeyDown={handleSlidingMenuKeyDown}
		/>
	);
};

SlidingMenuWithKeyboardNav.displayName = "SlidingMenu";

export function SlidingMenuMainWrapper(
	props: SlidingMenuProps.MainWrapperProps
): ReactElement<SlidingMenuProps.MainWrapperProps> {
	const [topDistance, setTopDistance] = useState<number>();
	const menuWrapperRef = useRef<HTMLDivElement>(null);
	const applicationFrameHeaderRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		applicationFrameHeaderRef.current =
			menuWrapperRef.current?.closest<HTMLDivElement>(`[data-role=${DataRoles.ApplicationFrame.Header}]`) ?? null;
	}, []);

	const onResize = useCallback<OnResizeCallback>(({ height }: ResizePayload) => {
		setTopDistance(height || 0);
	}, []);

	useResizeDetector({ handleWidth: false, targetRef: applicationFrameHeaderRef, onResize });

	return (
		<BaseSlidingMenuWrapper
			ref={menuWrapperRef}
			expanded={props.expanded}
			style={props.style}
			className={joinClassNames(
				addPrefix("sliding-menu"),
				{ [addPrefix("sliding-menu--expanded")]: props.expanded },
				props.className
			)}
			id={props.id}
			$top={topDistance}
		>
			{props.children}
		</BaseSlidingMenuWrapper>
	);
}

SlidingMenuMainWrapper.displayName = "SlidingMenu.MainWrapper";

export const SlidingMenu: FC<SlidingMenuProps> & { MainWrapper: typeof SlidingMenuMainWrapper } = Object.assign(
	SlidingMenuWithKeyboardNav,
	{
		MainWrapper: SlidingMenuMainWrapper
	}
);
