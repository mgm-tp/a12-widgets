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

import type { ContextType, KeyboardEvent, MouseEvent, ReactElement, ReactNode, RefObject } from "react";
import { Component, createRef, useCallback, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Key } from "ts-key-enum";
import { css, styled } from "styled-components";
import type { OnResizeCallback, ResizePayload } from "react-resize-detector";
import { useResizeDetector } from "react-resize-detector";

import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import {
	addPrefix,
	bindMethods,
	isLastFocusableElement,
	isVisibleOnScreen,
	joinClassNames
} from "../../common/main/utils.js";
import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { isSimilarNode } from "../../common/main/react-node-utils.js";

import type { MenuItem } from "./menu.api.js";
import type { SlidingMenuProps } from "./sliding-menu.api.js";
import { MainMenuTpl, MenuContainer } from "./template/menu.tpl.view.js";
import { MenuUtils } from "./menu.internal.js";
import { MenuTplUtils } from "./template/menu.tpl.internal.js";
import { isMenuItemList } from "./menu.utils.js";

const { flattenToMenuItems } = MenuTplUtils;

const baseClassName = addPrefix("nav");

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

class SlidingMenuInternal extends Component<SlidingMenuProps, SlidingMenuState> {
	static displayName = "SlidingMenu";

	declare context: ContextType<typeof A11YLanguageContext>;

	private readonly backwardItem: {
		label: ReactNode;
		icon: ReactNode;
	};

	private hiddenMainMenuElement: HTMLElement | null = null;
	private menuContainer: HTMLElement | null = null;
	private selectedItemNode: HTMLLIElement | null = null;
	private wrapperElement: RefObject<HTMLDivElement | null> = createRef();

	constructor(props: SlidingMenuProps) {
		super(props);
		this.state = {
			path: [
				{
					label: "root",
					items: isMenuItemList(this.props.items) ? flattenToMenuItems(this.props.items) : []
				}
			],
			lastAction: undefined
		};

		// This is necessary to bind the `this` context
		const getParentLabel = (): ReactNode =>
			this.state.path[this.state.path.length - 1].backwardItemProps?.label ??
			this.state.path[this.state.path.length - 1].label;

		const getIcon = (): ReactNode =>
			this.state.path[this.state.path.length - 1].backwardItemProps?.icon ?? (
				<Icon title={this.context.menuTitles?.closeSubMenu}>chevron_left</Icon>
			);
		this.backwardItem = {
			get label(): ReactNode {
				return getParentLabel();
			},
			get icon(): ReactNode {
				return getIcon();
			}
		};

		bindMethods(this);
	}

	componentDidMount(): void {
		this.scrollSelectedItemToView();

		if (!this.props.scrollToSelectedItem) {
			this.hiddenMainMenuElement?.focus();
		}
	}

	componentDidUpdate(prevProps: Readonly<SlidingMenuProps>): void {
		// Update the children of the "root" element so that the references are updated
		const flattenedItems = flattenToMenuItems(this.props.items);

		if (!MenuUtils.areItemsEqual(flattenedItems, this.state.path[0].items)) {
			const newPath: MenuUtils.MenuItemWithChildren[] = [
				{
					label: "root",
					items: isMenuItemList(this.props.items) ? flattenedItems : []
				}
			];
			this.setState(
				{
					path: newPath.concat(this.generatePath(flattenedItems as MenuUtils.MenuItemWithChildren[]))
				},
				() => {
					// scroll to selected item when item list is updated from empty to containing-element state
					// Being used when projects fetch data from store
					if (prevProps.items.length === 0 && this.props.items.length !== 0) {
						this.scrollSelectedItemToView();
					}
				}
			);
		}
	}

	render(): ReactElement {
		const transitionName =
			this.state.lastAction === "forward"
				? `${baseClassName}__wrapper--rtl`
				: this.state.lastAction === "backward"
					? `${baseClassName}__wrapper--ltr`
					: "";

		const parentItem = this.state.path[this.state.path.length - 1];
		const backwardItemOverrideProps = parentItem.backwardItemProps;
		const backwardItemProps = { ...parentItem, ...backwardItemOverrideProps };
		const items: MenuItem[] =
			this.state.path.length > 1
				? [
						MenuUtils.createMenuItemWrapper({
							...backwardItemProps,
							items: undefined,
							selected: undefined,
							...this.backwardItem
						})
					]
				: [];

		for (const item of parentItem.items) {
			items.push(
				MenuUtils.createMenuItemWrapper(item, (_item) =>
					this.state.path.some((itemOnPath) => MenuUtils.isItemEqual(itemOnPath, _item))
				)
			);
		}

		return (
			<MenuContainer
				style={this.props.style}
				className={this.props.className}
				id={this.props.id}
				wrapperRef={this.getMenuContainer}
				type="vertical"
				collapsed={this.props.collapsed}
				sliding
				ariaLabel={this.props.mainContainerLabel}
				useAs={this.props.useAs}
				onKeyDown={this.handleKeyDown}
			>
				<TransitionGroup>
					<CSSTransition
						key={this.state.path.length}
						classNames={transitionName}
						timeout={100}
						enter
						exit
						onEntered={this.handleEntered}
						nodeRef={this.wrapperElement}
					>
						<MainMenuTpl
							items={items}
							type="vertical"
							onClick={(item: MenuUtils.ItemMenuWrapper, event: MouseEvent<HTMLElement>) => {
								this.handleClick(item, event);
							}}
							sliding
							key={this.state.path.length}
							id={this.props.id ? `${this.props.id}_mainmenu` : undefined}
							collapsed={this.props.collapsed}
							hiddenMainMenuRef={this.getHiddenElement}
							wrapperRef={this.getMainMenuRef}
						/>
					</CSSTransition>
				</TransitionGroup>
			</MenuContainer>
		);
	}

	private getMainMenuRef(ref: HTMLDivElement | null): void {
		this.wrapperElement.current = ref;
	}

	private handleEntered(): void {
		this.hiddenMainMenuElement?.focus();
	}

	private getHiddenElement(ref: HTMLElement | null): void {
		this.hiddenMainMenuElement = ref;
	}

	private getMenuContainer(ref: HTMLElement | null): void {
		this.menuContainer = ref;
		this.props.wrapperRef?.(ref);
	}

	private handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (this.menuContainer && event.target && event.key === Key.Tab && !event.shiftKey) {
			if (isLastFocusableElement(this.menuContainer, event.target as HTMLElement)) {
				this.props.onTabOut?.(event);
			}
		}
	}

	private scrollSelectedItemToView(): void {
		if (this.props.scrollToSelectedItem) {
			const items = this.state.path[0].items;
			const selectedItem = items.find((item) => item.selected === true);

			if (selectedItem) {
				selectedItem.wrapperRef = (ref: HTMLLIElement | null) => {
					this.selectedItemNode = ref;
				};

				this.setState(
					{
						path: [
							{
								...this.state.path[0],
								items: items
							}
						]
					},
					() => {
						this.selectedItemNode?.scrollIntoView({ block: "center" });
					}
				);
			}
		}
	}

	private handleClick(item: MenuUtils.ItemMenuWrapper, event: MouseEvent<HTMLElement>): void {
		const { id: menuId } = this.props;
		const originItem = item.origin;
		const menuWrapper = this.menuContainer;

		if (
			originItem.label === this.backwardItem.label &&
			originItem.icon &&
			isSimilarNode(originItem.icon, this.backwardItem.icon)
		) {
			this.setState(
				(state: SlidingMenuState) => {
					return {
						lastAction: "backward",
						path: state.path.slice(0, state.path.length - 1)
					};
				},
				() => handleFocus(true)
			);
		} else {
			if (originItem.items !== undefined) {
				this.setState(
					(state: SlidingMenuState) => {
						return {
							lastAction: "forward",
							path: [...state.path, originItem as MenuUtils.MenuItemWithChildren]
						};
					},
					() => handleFocus()
				);
			}
		}

		if (originItem.onClick) {
			originItem.onClick(event);
		}

		const path = this.state.path[this.state.path.length - 1];

		function handleFocus(isBackward = false): void {
			// Menu item's id is provided by users
			const isUsingProvidedId = !!originItem.id;

			// If `id` for `MenuItem` is not given, it will be generated by the combination of item's label/title and menu's id.
			// This static id will be used to set focus if `isUsingProvidedId` is false.
			const isUsingDefaultStaticId = !!(
				menuId &&
				((originItem.label && typeof originItem.label === "string") || originItem.title) &&
				item.id
			);

			if (isUsingProvidedId || isUsingDefaultStaticId) {
				const parentLabel = path.label && typeof path.label === "string" ? path.label : path.title;
				const menuItems = [...(menuWrapper?.querySelectorAll(`[data-role="${DataRoles.Menu.Item}"]`) ?? [])];
				const parentItem = menuItems.find((el) => el.textContent?.includes(parentLabel ?? ""));
				const firstItemOnSubMenu = menuItems[0];
				const itemToFocus = (isBackward ? parentItem : firstItemOnSubMenu) as HTMLElement;

				if (!itemToFocus) {
					return;
				}

				itemToFocus.focus();

				// the menu is using animation with duration of 100ms, so we run this after the animation ends to ensure the item is visible on screen
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
				// If `id` is generated randomly by default, focus on the nav wrapper instead
				menuWrapper?.focus();
			}
		}
	}

	private generatePath(items: MenuUtils.MenuItemWithChildren[]): MenuUtils.MenuItemWithChildren[] {
		const path: MenuUtils.MenuItemWithChildren[] = [];
		const selected = items.find((item) => !!item.selected); // search selected item

		if (selected && selected.items) {
			// found selected item
			path.push(selected as MenuUtils.MenuItemWithChildren);

			return path.concat(this.generatePath(selected.items as MenuUtils.MenuItemWithChildren[]));
		}

		return path;
	}
}

SlidingMenuInternal.contextType = A11YLanguageContext;

const SlidingMenuComponent = SlidingMenuInternal;
SlidingMenuComponent.displayName = "SlidingMenu";

function SlidingMenuMainWrapper(
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

export const SlidingMenu = Object.assign(SlidingMenuComponent, {
	MainWrapper: SlidingMenuMainWrapper
});
