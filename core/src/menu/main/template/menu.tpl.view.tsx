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

import { Key } from "ts-key-enum";
import { Fragment } from "react/jsx-runtime";
import type {
	ContextType,
	HTMLAttributes,
	ReactElement,
	RefObject,
	SyntheticEvent,
	KeyboardEvent as ReactKeyboardEvent,
	FC,
	ReactNode,
	RefCallback,
	MouseEvent as ReactMouseEvent
} from "react";
import { cloneElement, Component, createRef, useContext, useRef, isValidElement } from "react";

import { Tooltip } from "../../../tooltip/main/tooltip.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import {
	addPrefix,
	bindMethods,
	generateUid,
	getParentElement,
	joinClassNames,
	StringUtils
} from "../../../common/main/utils.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import type { Orientation } from "../../../common/main/alignment.js";
import { TabSandbox } from "../../../common/main/tab-sandbox.view.js";
import { provider } from "../../../common/main/device-detector.js";
import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { getBadgeTitle } from "../../../badge/main/badge-utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import type { BadgeProps } from "../../../badge/main/badge.api.js";
import { useInteractionHint } from "../../../interaction-hint/main/use-interaction-hint.js";

import type { MenuItem, MenuItemVariant } from "../menu.api.js";
import { MenuUtils } from "../menu.internal.js";

import type { FlattenedMenuItemType, MainMenuProps, MenuContainerProps } from "./menu.tpl.api.js";
import { MenuTplUtils } from "./menu.tpl.internal.js";
import {
	StyledMenuContainer,
	StyledMenuGroupTitle,
	StyledMenuItem,
	StyledMenuItemIcon,
	StyledMenuItemLabel,
	StyledMenuItemLink,
	StyledMenuItemPlaceholder,
	StyledMenuItemText,
	StyledMenuMainLayer,
	StyledMenuSubLayer,
	StyledMenuWrapper,
	StyledSubMenuGroupTitle,
	StyleMenuGroupWrapper
} from "./menu.tpl.styled.js";

const { flattenToMenuItems } = MenuTplUtils;

const baseClassName = addPrefix("nav");

export function MenuContainer(props: MenuContainerProps): ReactElement<MenuContainerProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTitles = languageContext.menuTitles;
	const { id, style, wrapperRef, children, ariaLabel, useAs, onKeyDown, type, ...rest } = props;

	const classNames = joinClassNames(
		baseClassName,
		`${baseClassName}--${props.type}`,
		{ [`${baseClassName}--mobile`]: props.sliding },
		{ [`${baseClassName}--collapsed`]: props.collapsed },
		{ [`${baseClassName}--expanded`]: !props.collapsed },
		{ [`${baseClassName}--condensible`]: props.condensible },
		props.className
	);

	return (
		<StyledMenuContainer
			{...rest}
			id={id}
			style={style}
			ref={wrapperRef}
			className={classNames}
			data-role={DataRoles.Menu}
			aria-label={ariaLabel ?? (useAs === "main" ? a11yTitles?.mainMenuTitle : undefined)}
			tabIndex={-1}
			onKeyDown={onKeyDown}
			$useAs={useAs}
			$menuType={props.type}
			$sliding={props.sliding}
			$condensible={props.condensible}
		>
			{children}
		</StyledMenuContainer>
	);
}

MenuContainer.displayName = "MenuContainer";

interface MainMenuInternalProps {
	hiddenMainMenuRef?: RefCallback<HTMLElement>;
	sliding?: boolean;
	subMenuAttributes?: HTMLAttributes<HTMLUListElement>;
	useAs?: MainMenuProps.UseAs;
}

export const MainMenuTpl: FC<MainMenuProps & MainMenuInternalProps> = (props) => {
	const root = useRef<MainMenuProps.MenuItemWrapper>({
		originalItem: { label: "" },
		flattenedOriginalItem: { label: "" },
		id: "",
		children: [],
		items: []
	});
	const convertMenuItemsToTreeNodes = (
		items: FlattenedMenuItemType[],
		parent: MainMenuProps.MenuItemWrapper
	): MainMenuProps.MenuItemWrapper[] => {
		return items.map((item) => {
			const itemLabel = item.label && typeof item.label === "string" ? item.label : item.title;
			const hyphenatedLabel = itemLabel ? StringUtils.hyphenate(itemLabel) : undefined;
			const itemId = item.id || (props.id && hyphenatedLabel ? `${props.id}.${hyphenatedLabel}` : generateUid());

			const wrapper: MainMenuProps.MenuItemWrapper = {
				originalItem: { ...item, id: itemId },
				flattenedOriginalItem: { ...item, id: itemId },
				parent: parent,
				id: itemId,
				children: [],
				items: [],
				...(item.group && {
					group: item.group
				})
			};
			wrapper.items = item.items && convertMenuItemsToTreeNodes(flattenToMenuItems(item.items), wrapper);

			return wrapper;
		});
	};

	const onMouseOut = (event: ReactMouseEvent<HTMLDivElement>): void => {
		const target = provider.hasTouch() ? event.target : event.relatedTarget;

		if (props.onMouseOut && !MenuUtils.isChildMenuElement(target as Element, props.id)) {
			props.onMouseOut();
		}
	};

	const menu = convertMenuItemsToTreeNodes(flattenToMenuItems(props.items), root.current);
	const itemWrapperClass = props.type === "vertical" ? `${baseClassName}--vertical` : `${baseClassName}--horizontal`;

	return (
		<StyledMenuWrapper
			id={props.id}
			style={props.style}
			className={joinClassNames(`${baseClassName}__wrapper`, props.className)}
			data-role={DataRoles.Menu.Wrapper}
			onMouseOut={onMouseOut}
			ref={props.wrapperRef}
			$menuType={props.type}
			$sliding={props.sliding}
			$useAs={props.useAs}
		>
			<StyledMenuMainLayer
				className={`${baseClassName}__mainLayer`}
				data-role={DataRoles.Menu.Content}
				$menuType={props.type}
				$useAs={props.useAs}
			>
				{menu.map((item, index) => {
					const showGroupTitleTooltip =
						!item.flattenedOriginalItem?.condensed &&
						item.group?.label &&
						item.group.label !== menu[index - 1]?.group?.label;

					const isCondensedItem = !!item.flattenedOriginalItem?.condensed;
					const firstItemInCondensedList = isCondensedItem ? menu?.[index]?.items?.[0] : undefined;
					const lastItemInNonCondensedList = isCondensedItem ? menu?.[index - 1] : undefined;

					// Should not have duplicate group title inside and outside the condensed menu
					const hideSubMenuGroupTitle =
						isCondensedItem && firstItemInCondensedList?.group?.label === lastItemInNonCondensedList?.group?.label;

					return (
						<Fragment key={index}>
							{showGroupTitleTooltip && (
								<StyleMenuGroupWrapper $firstGroup={index === 0}>
									<Tooltip text={item.group?.label} dataRole={DataRoles.GroupTooltipHint} variant="hint">
										<StyledMenuGroupTitle />
									</Tooltip>
								</StyleMenuGroupWrapper>
							)}
							<MainMenu.ItemWrapper
								item={item.flattenedOriginalItem || item.originalItem}
								itemWrapper={item}
								type={props.type}
								showPlaceholder={props.type === "vertical"}
								onClick={props.onClick}
								onMouseOver={props.onMouseOver}
								onMouseOut={props.onMouseOut}
								id={item.id}
								rootId={props.id}
								wrapperClass={itemWrapperClass}
								wrapperRef={item.flattenedOriginalItem?.wrapperRef}
								collapsed={props.collapsed}
								condensed={item.flattenedOriginalItem?.condensed}
								clickedOnMainMenu={props.clickedOnMainMenu}
								sliding={props.sliding}
								subMenuAttributes={props.subMenuAttributes}
								parentMenuType={props.type}
								useAs={props.useAs}
								nonCondensedItemCount={props.nonCondensedItemCount}
								hideSubMenuGroupTitle={hideSubMenuGroupTitle}
							/>
						</Fragment>
					);
				})}
			</StyledMenuMainLayer>
		</StyledMenuWrapper>
	);
};

MainMenuTpl.displayName = "MainMenuTpl";

export namespace MainMenu {
	interface ItemState {
		showCurrentSubMenu: boolean;
		subLayerMaxHeight?: number;
	}

	interface ItemInternalProps extends MainMenuProps.ItemProps, MainMenuProps.MenuItemInternalProps {
		parentMenuType?: string;
		parentInstance?: Item;
		subMenuAttributes?: HTMLAttributes<HTMLUListElement>;
		useAs?: MainMenuProps.UseAs;
		$disabled?: boolean;
		nonCondensedItemCount?: number;
		isSelected?: boolean;
	}

	interface ItemWithHintProps extends ItemInternalProps {
		interactionHint?: string;
		hintRenderer?: (() => ReactElement | null) | null;
		externalElementRef?: RefObject<HTMLLIElement | null>;
	}

	export class Item extends Component<ItemWithHintProps, ItemState> {
		static displayName = "MenuItem";

		declare context: ContextType<typeof A11YLanguageContext>;

		private readonly liElement: RefObject<HTMLLIElement | null>;
		private subLayerRef: HTMLUListElement | null = null;
		private portalRef: HTMLElement | null = null;
		private readonly verticalOrientationList: Orientation[] = [
			"right-start",
			"right",
			"right-end",
			"left-start",
			"left",
			"left-end",
			"top-start",
			"top",
			"top-end",
			"bottom-start",
			"bottom",
			"bottom-end"
		];
		private readonly horizontalOrientationList: Orientation[] = [
			"bottom-start",
			"bottom",
			"bottom-end",
			"top-start",
			"top",
			"top-end",
			"right-start",
			"right",
			"right-end",
			"left-start",
			"left",
			"left-end"
		];

		private clickOnItem = false;
		private mouseOverVerticalMenu = false;
		static clickedOnMainMenu = false;
		static defaultProps = {
			focusOnOpen: true
		};

		constructor(props: ItemWithHintProps) {
			super(props);

			this.state = { showCurrentSubMenu: false };
			this.liElement = props.externalElementRef || createRef();

			bindMethods(this);
		}

		private handleSubLayerRef(ref: HTMLUListElement | null): void {
			this.subLayerRef = ref;
		}

		private handlePortalRef(ref: HTMLElement | null): void {
			this.portalRef = ref;
		}

		private getSubmenuItems(): FlattenedMenuItemType[] | undefined {
			const sub = this.props.item.items || this.props.item.children;

			return sub && flattenToMenuItems(sub);
		}

		private handleItemMouseOver(event: SyntheticEvent<HTMLElement>): void {
			event.stopPropagation();

			this.mouseOverVerticalMenu = this.props.parentMenuType === "vertical";

			if (this.props.onMouseOver && !this.props.item.disabled) {
				this.props.onMouseOver(this.props.item, event);

				if (
					this.props.type === "vertical" ||
					(this.getSubmenuItems() !== undefined && this.props.clickedOnMainMenu !== false && Item.clickedOnMainMenu)
				) {
					this.setState({ showCurrentSubMenu: true });
				}
			}
		}

		private handleItemClick(event: SyntheticEvent<HTMLElement>): void {
			event.stopPropagation();
			this.mouseOverVerticalMenu = false;

			if (!this.props.subMenuItem) {
				Item.clickedOnMainMenu = true;
			}

			if (this.props.item.disabled) {
				return;
			}

			this.clickOnItem = true;
			const subMenuItems = this.getSubmenuItems();

			if (!subMenuItems || (subMenuItems.length === 0 && this.props.subMenuItem && !provider.isDesktop())) {
				if (!subMenuItems) {
					this.closeParentSubMenu(true);
				}

				this.clickOnItem = false;
			}

			if (this.props.onClick) {
				this.props.onClick(this.props.item, event);
			}

			if (provider.hasTouch() && this.props.onMouseOver) {
				this.props.onMouseOver(this.props.item, event);
			}
		}

		private handleItemKeyDown(event: ReactKeyboardEvent<HTMLElement>): void {
			this.mouseOverVerticalMenu = false;

			if (event.key === Key.Enter && !this.props.item.disabled) {
				const subMenuItems = this.getSubmenuItems();

				if (subMenuItems === undefined || this.props.sliding) {
					this.handleItemClick(event);

					if (subMenuItems === undefined) {
						return;
					}
				}

				if (this.props.onMouseOver) {
					this.props.onMouseOver(this.props.item, event);
					this.setState({ showCurrentSubMenu: true });
				}
			} else if (event.key === Key.Escape && this.state.showCurrentSubMenu) {
				this.handleOnEsc(event);
			}
		}

		private handleOnEsc(event: SyntheticEvent<HTMLElement>): void {
			event.stopPropagation();
			this.liElement.current?.focus();
			this.closeCurrentSubMenu();
		}

		private handleItemMouseOut(event: ReactMouseEvent<HTMLElement>): void {
			event.stopPropagation();
			const target = provider.hasTouch() ? event.target : event.relatedTarget;

			if (this.props.onMouseOut && !MenuUtils.isChildMenuElement(target as Element, this.props.rootId)) {
				this.props.onMouseOut();
			}
		}

		private handleA11yTitle(): ReactNode {
			if (!provider.isPhone()) {
				return null;
			}

			const { item } = this.props;
			const a11yTitles = this.context.menuTitles;
			let disabledTitle;
			let selectedTitle;
			let selectedParentTitle;

			if (item.disabled && a11yTitles?.disabled) {
				disabledTitle = <HiddenText>{a11yTitles.disabled}</HiddenText>;
			}

			if (item.selected) {
				if ((item.items || item.children) && a11yTitles?.selectedParent) {
					selectedParentTitle = <HiddenText>{a11yTitles.selectedParent}</HiddenText>;
				} else if (a11yTitles?.selected) {
					selectedTitle = <HiddenText>{a11yTitles.selected}</HiddenText>;
				}
			}

			return (
				<>
					{disabledTitle}
					{selectedTitle}
					{selectedParentTitle}
				</>
			);
		}

		private closeParentSubMenu(isClick?: boolean): void {
			if (this.liElement.current?.parentElement?.contains(document.activeElement) && !isClick) {
				return;
			}

			if (this.props.closeCurrentSubMenu) {
				this.props.closeCurrentSubMenu();
				this.props.parentInstance?.closeParentSubMenu();
			}
		}

		private closeCurrentSubMenu(): void {
			this.setState({ showCurrentSubMenu: false }, this.closeParentSubMenu);
		}

		private handleOrientationChange(orientation: string): void {
			if (this.subLayerRef) {
				const { top, bottom } = this.subLayerRef.getBoundingClientRect();
				const maxHeight = Math.round(orientation.startsWith("top") ? bottom : window.innerHeight - top);

				if (this.subLayerRef.clientHeight > maxHeight) {
					this.setState({
						subLayerMaxHeight: this.computeMaxHeight(this.subLayerRef, maxHeight)
					});
				}
			}
		}

		private handleOnVisibilityChange(showCurrentSubMenu: boolean): void {
			this.setState({ showCurrentSubMenu }, () => {
				if (!this.mouseOverVerticalMenu) {
					setTimeout(() => {
						this.portalRef?.focus();
					}, 100); // Timeout has to be the same with hoverDelay
				}
			});
		}

		private handleOnClickOutside(event: Event): void {
			this.setState({ showCurrentSubMenu: false });
			Item.clickedOnMainMenu = !!getParentElement(event.target as HTMLElement, (e) =>
				e.classList.contains(baseClassName)
			);
		}

		private computeMaxHeight(element: HTMLUListElement, maxHeight: number): number {
			const listItems = Array.from(element.children);
			let totalHeight = 0;
			let lastChildIndex = 0;
			const itemHeights = listItems.map((item) => parseInt(getComputedStyle(item).height as string, 10));

			for (let i = 0; i < listItems.length; i++) {
				totalHeight += itemHeights[i];

				if (totalHeight > maxHeight) {
					lastChildIndex = i;
					break;
				}
			}

			const lastItemHeight = itemHeights[lastChildIndex];

			if (lastChildIndex === 1) {
				return lastItemHeight / 2;
			}

			return totalHeight - lastItemHeight / 2 > maxHeight
				? totalHeight - lastItemHeight - itemHeights[lastChildIndex - 1] / 2
				: totalHeight - lastItemHeight / 2;
		}

		private getHiddenText(
			item: MenuItem,
			enableInteractionHint?: boolean,
			variantTitle?: string,
			interactionHint?: string,
			ariaLabel?: string
		): ReactNode {
			if (variantTitle && !enableInteractionHint) {
				return <HiddenText> - {variantTitle}</HiddenText>;
			}

			if (item.badge) {
				return <HiddenText>{item.title !== item.label && item.title}</HiddenText>;
			}

			if (enableInteractionHint) {
				return <HiddenText>{item.variant ? ` - ${interactionHint}` : ariaLabel}</HiddenText>;
			}

			return null;
		}

		private renderVariantIcon(variant?: MenuItemVariant): ReactNode {
			switch (variant) {
				case "open":
					return <Icon iconTheme="filled">radio_button_unchecked</Icon>;
				case "info":
					return <Icon iconTheme="filled">info</Icon>;
				case "error":
					return <Icon iconTheme="custom">error</Icon>;
				case "warning":
					return <Icon iconTheme="filled">warning</Icon>;
				case "done":
					return <Icon iconTheme="filled">check_circle</Icon>;
				case "inProgress":
					return <Icon iconTheme="filled">pending</Icon>;
				default:
					return;
			}
		}

		private renderItemMetaIcon(): ReactNode {
			const { item, type, parentMenuType, collapsed } = this.props;
			const a11yTitles = this.context.menuTitles;

			if ((!item.items && !item.children) || !item.label) {
				return undefined;
			}

			const iconName = type === "horizontal" ? "expand_more" : "chevron_right";

			return (
				<StyledMenuItemIcon
					className={`${baseClassName}__icon`}
					data-role={DataRoles.Menu.Item.Icon}
					$collapsed={collapsed}
					$disabled={item.disabled}
					$menuItemType={type}
					$parentMenuType={parentMenuType}
					$selected={item.selected}
				>
					{type === "vertical" && collapsed ? (
						<HiddenText>{a11yTitles?.parentItem}</HiddenText>
					) : (
						<Icon title={a11yTitles?.parentItem} showTitleAsTooltip={false}>
							{iconName}
						</Icon>
					)}
				</StyledMenuItemIcon>
			);
		}

		private renderItemPlaceholder(enableInteractionHint?: boolean): ReactNode {
			const { item, showPlaceholder, type, parentMenuType, collapsed, condensed } = this.props;

			if (!collapsed && item.additionalInfoIcon) {
				return (
					<StyledMenuItemIcon
						className={joinClassNames(
							`${baseClassName}__icon`,
							`${baseClassName}__icon--additional`,
							`${baseClassName}__icon--${item.additionalInfoIcon.props.variant}`
						)}
						data-role={DataRoles.Menu.Item.Icon}
						$disabled={item.disabled}
						$selected={item.selected}
						$menuItemType={type}
						$parentMenuType={parentMenuType}
						$hasAdditionalInfoIcon={true}
						$additionalIconVariant={item.additionalInfoIcon.props.variant}
						$collapsed={collapsed}
					>
						{item.additionalInfoIcon}
					</StyledMenuItemIcon>
				);
			}

			if (item.variant || item.icon) {
				return (
					<StyledMenuItemIcon
						className={`${baseClassName}__icon`}
						data-role={DataRoles.Menu.Item.Icon}
						title={condensed && !enableInteractionHint ? item.title : undefined}
						$disabled={item.disabled}
						$selected={item.selected}
						$menuItemType={type}
						$parentMenuType={parentMenuType}
						$collapsed={collapsed}
						$variant={item.variant}
					>
						{item.variant ? this.renderVariantIcon(item.variant) : item.icon}
					</StyledMenuItemIcon>
				);
			}

			return showPlaceholder ? (
				<StyledMenuItemPlaceholder
					className={`${baseClassName}__placeholder`}
					data-role={DataRoles.Menu.Item.Placeholder}
					aria-hidden="true"
					$disabled={item.disabled}
					$menuItemType={type}
				>
					{typeof item.label === "string" ? item.label.charAt(0).toUpperCase() : item.label}
				</StyledMenuItemPlaceholder>
			) : undefined;
		}

		private handleVerticalMenuEsc(event: KeyboardEvent): void {
			if (event.key === Key.Escape && this.state.showCurrentSubMenu) {
				this.closeCurrentSubMenu();
			}
		}

		componentDidMount(): void {
			if (this.props.type === "vertical") {
				window.addEventListener("keydown", this.handleVerticalMenuEsc);
			}
		}

		componentWillUnmount(): void {
			if (this.props.type === "vertical") {
				window.removeEventListener("keydown", this.handleVerticalMenuEsc);
			}
		}

		componentDidUpdate(prevProps: ItemInternalProps): void {
			const prevSubMenuItems = prevProps.item.items || prevProps.item.children;
			const currentSubMenuItems = this.props.item.items || this.props.item.children;

			if (this.props.wrapperRef !== prevProps.wrapperRef && this.props.wrapperRef) {
				this.props.wrapperRef(this.liElement.current);
			}

			// With NVDA on, when pressing ENTER, onClick event will be triggered instead
			// and the item.children will be undefined.
			// This handle open the submenu after click for both cases.
			if (
				this.clickOnItem &&
				// Pressing ENTER with NVDA on
				(!prevSubMenuItems ||
					prevSubMenuItems.length === 0 ||
					// Normal click behavior
					MenuUtils.areItemsEqual(currentSubMenuItems || [], prevSubMenuItems || []))
			) {
				if (
					!currentSubMenuItems ||
					(currentSubMenuItems.length === 0 && this.props.subMenuItem && !provider.hasTouch())
				) {
					this.closeParentSubMenu(true);
				} else if (!this.props.subMenuItem && this.state.showCurrentSubMenu) {
					this.setState({ showCurrentSubMenu: false });
				} else if (currentSubMenuItems) {
					this.setState({ showCurrentSubMenu: true });
				}

				this.clickOnItem = false;
			}
		}

		render(): ReactNode {
			const { item, itemWrapper, id, rootId, wrapperClass, condensed, subMenuAttributes, useAs, hintRenderer } =
				this.props;
			const domElement = this.liElement.current;
			const subMenuItems = this.getSubmenuItems();
			const isDesktop = provider.isDesktop();
			const tabIndex = item.disabled ? -1 : 0;

			const classNames = joinClassNames(
				`${baseClassName}__item`,
				{ [`${baseClassName}__item--is-selected`]: item.selected },
				{ [`${baseClassName}__item--is-disabled`]: item.disabled },
				{ [`${baseClassName}__item--has-children`]: subMenuItems },
				{ [`${baseClassName}__item--condensed`]: condensed },
				item.className,
				this.props.className
			);

			const subMenuId = id && rootId ? (id.startsWith(rootId) ? `${id}_sub` : `${rootId}_${id}_sub`) : undefined;

			const labelClassNames = `${baseClassName}__label`;
			const a11yTitles = this.context.menuTitles;
			const hasPopup = condensed || !!subMenuItems;
			const hasBadgeCount = isValidElement<BadgeProps>(item.badge) && !!item.badge?.props["count"];
			const hasOverflowCount = isValidElement<BadgeProps>(item.badge) && !!item.badge?.props["overflowCount"];
			const variantTitle = item.variant && this.context.variantTitles?.[item.variant];

			const ariaLabel =
				item.ariaLabel && item.title && item.ariaLabel !== item.title
					? `${item.ariaLabel} ${item.title}`
					: (item.ariaLabel ?? item.title);

			return (
				<StyledMenuItem
					ref={this.liElement}
					className={classNames}
					id={id}
					data-role={DataRoles.Menu.Item}
					title={
						!!hintRenderer || condensed
							? undefined
							: variantTitle
								? `${variantTitle}${item.title ? ` - ${item.title}` : ""}`
								: item.title
					}
					tabIndex={isDesktop ? tabIndex : -1}
					onMouseOver={this.handleItemMouseOver}
					onMouseOut={this.handleItemMouseOut}
					onClick={item.disabled ? undefined : this.handleItemClick}
					onKeyDown={item.disabled ? undefined : this.handleItemKeyDown}
					$useAs={useAs}
					$disabled={item.disabled}
					$selected={item.selected}
					$collapsed={this.props.collapsed}
					$menuItemType={this.props.type}
					$parentMenuType={this.props.parentMenuType}
					$subLayer={this.props.subMenuItem}
					$nonCondensedItemCount={this.props.nonCondensedItemCount}
					$showPlaceholder={!item.icon && this.props.showPlaceholder}
				>
					<StyledMenuItemLink
						tabIndex={!isDesktop ? tabIndex : undefined}
						style={this.props.style}
						className={`${baseClassName}__link`}
						role="link"
						aria-label={item.badge ? undefined : ariaLabel}
						aria-haspopup={hasPopup}
						aria-current={item.selected ? "page" : "false"}
						aria-disabled={item.disabled}
						aria-expanded={hasPopup ? this.state.showCurrentSubMenu : undefined}
						$parentMenuType={this.props.parentMenuType}
						$menuItemType={this.props.type}
						$subLayer={this.props.subMenuItem}
						$collapsed={this.props.collapsed}
					>
						{this.renderItemPlaceholder(!!hintRenderer)}
						<StyledMenuItemLabel className={labelClassNames} data-role={DataRoles.Menu.Item.Label}>
							{this.handleA11yTitle()}
							<StyledMenuItemText
								className={`${baseClassName}__text`}
								data-role={DataRoles.Menu.Item.Text}
								$disabled={item.disabled}
								$selected={item.selected}
								$menuItemType={this.props.type}
								$parentMenuType={this.props.parentMenuType}
								$subLayer={this.props.subMenuItem}
								$collapsed={this.props.collapsed}
								$hasBadgeCount={hasBadgeCount}
								$hasNonLabel={!item.label || item.labelHidden}
								$hasOverflowCount={hasOverflowCount}
								$sliding={this.props.sliding}
							>
								{this.props.subMenuItem ? item.label : !item.labelHidden && item.label}
								{this.getHiddenText(item, !!hintRenderer, variantTitle, this.props.interactionHint, ariaLabel)}
								{item.badge}
							</StyledMenuItemText>
							{item.counter}
						</StyledMenuItemLabel>
						{this.renderItemMetaIcon()}
						{hintRenderer?.()}
					</StyledMenuItemLink>
					{this.state.showCurrentSubMenu && domElement && subMenuItems && subMenuItems.length > 0 && (
						<AttachedPortal
							adjustPositionToScreen
							referenceElement={domElement}
							orientationList={
								this.props.type === "vertical" ? this.verticalOrientationList : this.horizontalOrientationList
							}
							onOrientationChange={this.handleOrientationChange}
							fixedOrientation
							selfSizing
							wrapperRef={this.handlePortalRef}
							onVisibilityChange={this.handleOnVisibilityChange}
							onClickOutside={this.handleOnClickOutside}
							closeOnOutsideClick
							focusOnOpen={false}
						>
							{a11yTitles?.subMenuTitle && <HiddenText tabIndex={-1}>{a11yTitles.subMenuTitle}</HiddenText>}
							<TabSandbox skipWrapperFocus>
								<StyledMenuWrapper
									className={joinClassNames(`${baseClassName}__wrapper`, baseClassName, wrapperClass)}
									$menuType={this.props.type}
									$sliding={this.props.sliding}
								>
									<StyledMenuSubLayer
										data-role={DataRoles.SubMenu.Content}
										{...subMenuAttributes}
										className={joinClassNames(`${baseClassName}__subLayer`, subMenuAttributes?.className)}
										id={subMenuId}
										ref={this.handleSubLayerRef}
										style={{
											...(this.state.subLayerMaxHeight
												? {
														maxHeight: this.state.subLayerMaxHeight,
														overflowY: "auto"
													}
												: undefined),
											...subMenuAttributes?.style
										}}
										$useAs={useAs}
										$menuType={this.props.type}
										$parentMenuType={this.props.parentMenuType ?? this.props.type}
									>
										{subMenuItems.map((child, index) => {
											const wrapper = itemWrapper && (itemWrapper.items || itemWrapper.children)[index];

											/**
											 * Show the group title in the submenu only when the next item belongs to a different group.
											 */
											const showGroupTitle =
												(!this.props.hideSubMenuGroupTitle || index !== 0) &&
												subMenuItems &&
												child.group?.label &&
												child.group.label !== subMenuItems[index - 1]?.group?.label;

											if (wrapper) {
												wrapper.id = subMenuId ? `${subMenuId}_${child.id || index}` : generateUid();
												wrapper.parent = itemWrapper;

												if (wrapper.parent) {
													wrapper.parent.id = id || generateUid();
												}
											}

											return (
												<Fragment key={child.id}>
													{showGroupTitle && <StyledSubMenuGroupTitle>{child.group?.label}</StyledSubMenuGroupTitle>}
													<ItemWrapper
														parentInstance={this}
														subMenuItem
														useAs={useAs}
														item={child as MenuItem}
														itemWrapper={wrapper}
														type="vertical"
														onClick={this.props.onClick}
														closeCurrentSubMenu={this.closeCurrentSubMenu}
														onMouseOver={this.props.onMouseOver}
														onMouseOut={this.props.onMouseOut}
														id={wrapper ? wrapper.id : generateUid()}
														rootId={rootId}
														className={this.props.className}
														wrapperClass={this.props.wrapperClass}
														wrapperRef={this.props.wrapperRef}
														style={this.props.style}
														parentMenuType={this.props.parentMenuType ?? this.props.type}
													/>
												</Fragment>
											);
										})}
									</StyledMenuSubLayer>
								</StyledMenuWrapper>
							</TabSandbox>
						</AttachedPortal>
					)}
				</StyledMenuItem>
			);
		}
	}

	Item.contextType = A11YLanguageContext;

	export const ItemWrapper: FC<ItemInternalProps> = (props) => {
		const { item, type, parentMenuType } = props;
		const context = useContext(A11YLanguageContext);

		const liElementRef = useRef<HTMLLIElement | null>(null);

		const isVerticalMenu = type === "vertical" || parentMenuType === "vertical";
		const menuComponentKey = props.sliding
			? "slidingMenu"
			: isVerticalMenu
				? "verticalFlyoutMenu"
				: "horizontalFlyoutMenu";

		const variantTitle = item.variant && context.variantTitles?.[item.variant];

		const interactionHintItem = item.title || item.ariaLabel || "";
		let interactionHint = interactionHintItem;

		if (isValidElement<BadgeProps>(item.badge) && !item.badge.props.hidden) {
			const badgeTitle = getBadgeTitle(item.badge.props, context.badgeTitles);
			interactionHint = interactionHintItem ? `${interactionHintItem}, ${badgeTitle}` : (badgeTitle ?? "");
		} else if (variantTitle) {
			interactionHint = interactionHintItem ? `${variantTitle} - ${interactionHintItem}` : variantTitle;
		}

		const { hintRenderer } = useInteractionHint({
			title: interactionHint,
			componentKey: menuComponentKey,
			referenceElementRef: liElementRef,
			focusable: !item.disabled
		});

		const renderedBadge = isValidElement<BadgeProps>(item.badge)
			? cloneElement(item.badge, {
					enabledInteractionHint: !!hintRenderer
				})
			: null;

		return (
			<Item
				{...props}
				item={{ ...item, badge: renderedBadge }}
				interactionHint={interactionHint}
				hintRenderer={hintRenderer}
				externalElementRef={liElementRef}
			/>
		);
	};

	ItemWrapper.displayName = "MenuItemWrapper";
}
