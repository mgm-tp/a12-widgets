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

import type { KeyboardEvent, MouseEvent, ReactNode, ReactElement } from "react";
import { createContext, Component, useContext, useRef, useCallback, Fragment } from "react";
import { Key } from "ts-key-enum";

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";
import {
	addPrefix,
	bindMethods,
	isElementCompletelyVisibleInContainer,
	isVisibleOnScreen,
	joinClassNames
} from "../../../common/main/utils.js";
import { getDesktopOperatingSystem, provider } from "../../../common/main/device-detector.js";
import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import {
	StyledDropdownSecondaryText,
	StyledDropdownContent,
	StyledDropdownGraphic,
	StyledDropdownItem,
	StyledDropdownHint,
	StyledDropdownSection,
	StyledDropdownText,
	StyledDropdownWrapper,
	StyledDropdownFooter,
	StyledDropdownLink,
	StyledDropdownLinksWrapper
} from "./dropdown.tpl.styled.js";
import type { DropDownProps, DropDownItem as DropdownItemProps } from "./dropdown.tpl.api.js";
import { flattenItems, isExtendedDropdown } from "./dropdown.utils.js";

const baseClassName = addPrefix("dropdown");
const itemClassName = `${baseClassName}__item`;
const disabledItemClassName = `${itemClassName}--disabled`;
const preSelectClassName = `${itemClassName}--preselected`;
const preSelectFocusClassName = `${itemClassName}--focus-preselected`;

const DropdownContext = createContext({
	horizontal: false,
	touch: false,
	lightBackground: false,
	extended: false
});

export const DropdownContextProvider = DropdownContext.Provider;

interface Position {
	row: number;
	index: number;
}

interface DropDownState {
	preselectedPosition?: Position;
	preselectedLinkIndex?: number;
}

export class DropDown extends Component<DropDownProps, DropDownState> {
	static displayName = "Dropdown";
	private dropdownContentRef: HTMLElement | null = null;
	private dropdownLinksRef: HTMLElement | null = null;
	private itemRefs: { ref: HTMLElement; disabled?: boolean; verticalIndex: number }[][] = [];
	private linkRefs: { ref: HTMLElement }[] = [];
	private scrollElementToPosition: boolean | ScrollIntoViewOptions = this.props.selectedItemPosition
		? {
				block:
					this.props.selectedItemPosition === "top"
						? "start"
						: this.props.selectedItemPosition === "middle"
							? "center"
							: "end"
			}
		: false;

	static defaultProps = { selectItemKeys: [Key.Enter], keysToSelectItem: [Key.Enter] };

	constructor(props: DropDownProps) {
		super(props);
		this.state = {};
		bindMethods(this);
	}

	public resetPreselectedPosition(): void {
		if (!this.state.preselectedPosition) {
			return;
		}

		const { row, index } = this.state.preselectedPosition;
		this.itemRefs[row][index].ref.setAttribute("data-preselect", "false");
		this.props.onPreselectedItemChange?.(undefined);
		this.setState({ preselectedPosition: undefined });
	}

	public handleForwardedKeyboardEvent(event: KeyboardEvent<HTMLElement>): void {
		this.getAllItemRefs(true);

		if (
			event.key === Key.ArrowUp ||
			event.key === Key.ArrowDown ||
			event.key === Key.ArrowRight ||
			event.key === Key.ArrowLeft
		) {
			event.preventDefault();
			event.stopPropagation();

			if (this.itemRefs.every((refs) => refs.every((item) => item.disabled)) && !this.linkRefs.length) {
				return;
			}

			this.scrollElementToPosition = event.key === Key.ArrowUp;
			this.goToNextPreselectedItem(event);
		} else {
			if (this.props.selectItemKeys?.includes(event.keyCode) || this.props.keysToSelectItem?.includes(event.key)) {
				const selectedItem = this.getCurrentPreselectedItem(this.getTargetPosition(event.target as HTMLElement));

				if (selectedItem) {
					this.handleSelectedItemChange(selectedItem, event as MouseEvent<HTMLElement> & KeyboardEvent<HTMLElement>);
				} else if (this.linkRefs.length > 0 && this.state.preselectedLinkIndex !== undefined) {
					this.linkRefs[this.state.preselectedLinkIndex].ref.click();
				}

				if (this.state.preselectedLinkIndex !== undefined) {
					this.setState({ preselectedLinkIndex: undefined });
				}
			}
		}
	}

	public setPreselectedPosition(position: Position | undefined): void {
		this.setState({ preselectedPosition: position }, this.setPreselectedItem);
	}

	private getTargetPosition(target: HTMLElement): Position | undefined {
		for (let row = 0; row < this.itemRefs.length; row++) {
			for (let index = 0; index < this.itemRefs[row].length; index++) {
				if (this.itemRefs[row][index].ref === target) {
					return { row, index };
				}
			}
		}

		return undefined;
	}

	private goToNextPreselectedItem(event: KeyboardEvent<HTMLElement>): void {
		const { items } = this.props;
		const { preselectedPosition, preselectedLinkIndex } = this.state;

		// Identify the preselected position while navigating between link options or when there is no preselected dropdown item yet
		if (!preselectedPosition) {
			if (this.linkRefs.length > 0) {
				let newPreselectedLinkIndex: number | undefined = preselectedLinkIndex ?? 0;

				if (event.key === Key.ArrowDown && preselectedLinkIndex !== undefined && preselectedLinkIndex >= 0) {
					newPreselectedLinkIndex =
						newPreselectedLinkIndex === this.linkRefs.length - 1
							? items.length === 0
								? 0
								: undefined
							: newPreselectedLinkIndex + 1;
				} else if (event.key === Key.ArrowUp) {
					if (newPreselectedLinkIndex === 0 && items.length === 0) {
						newPreselectedLinkIndex = this.linkRefs.length - 1;
					} else {
						newPreselectedLinkIndex =
							preselectedLinkIndex === 0 && newPreselectedLinkIndex === 0
								? items.length === 0
									? this.linkRefs.length - 1
									: undefined
								: newPreselectedLinkIndex - 1;
					}
				}

				this.setState({ preselectedLinkIndex: newPreselectedLinkIndex }, () => {
					if (newPreselectedLinkIndex !== undefined) {
						this.resetPreselectedPosition();
					}

					this.props.onPreselectedLinkChange?.(newPreselectedLinkIndex);
				});

				if (newPreselectedLinkIndex !== undefined && newPreselectedLinkIndex >= 0) {
					if (!isVisibleOnScreen(this.linkRefs[newPreselectedLinkIndex].ref as HTMLElement)) {
						this.linkRefs[newPreselectedLinkIndex].ref.scrollIntoView();
					}

					return;
				}
			}

			if (items.length > 0) {
				const nextPreselectedPosition =
					event.key !== Key.ArrowRight && event.key !== Key.ArrowDown
						? { row: this.itemRefs.length - 1, index: this.itemRefs[this.itemRefs.length - 1].length - 1 }
						: { row: 0, index: 0 };
				this.setState({ preselectedPosition: nextPreselectedPosition }, this.setPreselectedItem);
			}

			return;
		}

		const { row, index } = preselectedPosition;
		let previousPreselectedPosition: Position | undefined = { row: row, index: index };

		this.itemRefs[row][index].ref.setAttribute("data-preselect", "false");

		if (event.key === Key.ArrowDown || event.key === Key.ArrowUp) {
			previousPreselectedPosition = this.getNextVerticalPosition(
				this.state.preselectedPosition,
				event.key === Key.ArrowDown ? 1 : -1
			);
		} else if (this.props.horizontal && (event.key === Key.ArrowRight || event.key === Key.ArrowLeft)) {
			previousPreselectedPosition = this.getNextHorizontalPosition(
				this.state.preselectedPosition,
				event.key === Key.ArrowRight ? 1 : -1
			);
		}

		this.setState({ preselectedPosition: previousPreselectedPosition }, this.setPreselectedItem);
	}

	private getNextVerticalPosition(currentPosition: Position | undefined, direction: number): Position | undefined {
		if (!currentPosition) {
			return undefined;
		}

		const { row, index } = currentPosition;
		const refs = this.itemRefs;

		// Set preselected link option when using arrow keys navigation:
		// - Arrow key down from the last dropdown item will jump to the first link option
		// - Arrow key up from the first dropdown item will jump to the last link option
		if (this.linkRefs.length > 0 && ((row === refs.length - 1 && direction > 0) || (row === 0 && direction < 0))) {
			const preselectedLinkIndex =
				row === refs.length - 1 && direction > 0
					? 0
					: row === 0 && direction < 0
						? this.linkRefs.length - 1
						: undefined;
			this.setState({ preselectedLinkIndex }, () => {
				if (
					preselectedLinkIndex !== undefined &&
					!isVisibleOnScreen(this.linkRefs[preselectedLinkIndex].ref as HTMLElement)
				) {
					this.linkRefs[preselectedLinkIndex].ref.scrollIntoView({ block: "center" });
				}

				this.props.onPreselectedLinkChange?.(preselectedLinkIndex);
			});
			this.resetPreselectedPosition();

			return undefined;
		}

		const nextRow =
			row === refs.length - 1 && direction > 0 ? 0 : row === 0 && direction < 0 ? refs.length - 1 : row + direction;

		if (!refs[nextRow][index] || refs[nextRow][index].disabled) {
			return this.getNextVerticalPosition({ row: nextRow, index: index }, direction);
		}

		return { row: nextRow, index };
	}

	private getNextHorizontalPosition(currentPosition: Position | undefined, direction: number): Position | undefined {
		if (!currentPosition) {
			return undefined;
		}

		const { row, index } = currentPosition;
		const refs = this.itemRefs;
		const currentRowLength = refs[row].length;

		let nextRow;
		let nextIndex;

		if (direction > 0) {
			nextRow = index === currentRowLength - 1 ? (row < refs.length - 1 ? row + direction : 0) : row;
			nextIndex = index === currentRowLength - 1 ? 0 : index + direction;
		} else {
			nextRow = index === 0 ? (row > 0 ? row + direction : refs.length - 1) : row;
			nextIndex = 0 === index ? refs[nextRow].length - 1 : index + direction;
		}

		if (!refs[nextRow][nextIndex] || refs[nextRow][nextIndex].disabled) {
			return this.getNextHorizontalPosition({ row: nextRow, index: nextIndex }, direction);
		}

		return { row: nextRow, index: nextIndex };
	}

	private getDropdownContentRef(ref: HTMLElement | null): void {
		this.dropdownContentRef = ref;
	}

	private getDropdownLinksRef(ref: HTMLElement | null): void {
		this.dropdownLinksRef = ref;
	}

	private getAllItemRefs(scrollIntoView = false): void {
		if (this.dropdownLinksRef) {
			const linkItems = this.dropdownLinksRef.querySelectorAll(`[data-role=${DataRoles.Dropdown.LinkItemWrapper}]`);
			this.linkRefs = [];

			for (let i = 0; i < linkItems.length; i++) {
				if (linkItems[i].getAttribute("data-preselect") === "true") {
					this.setState(
						{
							preselectedLinkIndex: i
						},
						() => this.props.onPreselectedLinkChange?.(i)
					);
				}

				this.linkRefs.push({ ref: linkItems[i] as HTMLElement });
			}
		}

		if (this.dropdownContentRef) {
			const items = this.dropdownContentRef.querySelectorAll(`[data-role=${DataRoles.Dropdown.Item}]`);

			let prevRef = items[0];
			let row = 0;

			this.itemRefs = [];
			this.itemRefs.push([]);
			this.setState({ preselectedPosition: undefined });

			for (let i = 0; i < items.length; i++) {
				if (prevRef.getBoundingClientRect().top !== items[i].getBoundingClientRect().top) {
					row++;
					this.itemRefs.push([]);
				}

				if (items[i].getAttribute("data-preselect") === "true") {
					this.setState(
						{
							preselectedPosition: {
								row,
								index: this.itemRefs[row].length
							}
						},
						() => {
							if (scrollIntoView) {
								setTimeout(() => this.scrollPreselectItemIntoView());
							}
						}
					);
				}

				prevRef = items[i];
				this.itemRefs[row].push({
					ref: items[i] as HTMLElement,
					disabled: items[i].getAttribute("aria-disabled") === "true",
					verticalIndex: i
				});
			}
		}
	}

	private setPreselectedItem(): void {
		if (this.state.preselectedPosition && this.dropdownContentRef) {
			const currentRef = this.itemRefs[this.state.preselectedPosition.row][this.state.preselectedPosition.index].ref;
			currentRef.setAttribute("data-preselect", "true");

			if (this.props.useFocusStyle) {
				currentRef.focus({ preventScroll: true });
			}

			if (!isElementCompletelyVisibleInContainer(this.dropdownContentRef, currentRef as HTMLElement)) {
				currentRef.scrollIntoView(this.scrollElementToPosition);
			}

			this.props.onPreselectedItemChange?.(this.getCurrentPreselectedItem());
		}
	}

	private getCurrentPreselectedItem(position?: Position): DropdownItemProps | undefined {
		if (!this.state.preselectedPosition && !position) {
			return undefined;
		}

		const { row, index } = (position ?? this.state.preselectedPosition) as Position;
		const items: DropdownItemProps[] = [];

		if (this.props.items.length === 0) {
			return undefined;
		}

		flattenItems(this.props.items, items);

		return items[this.itemRefs[row][index].verticalIndex];
	}

	private isItemSelected(item: DropdownItemProps): boolean {
		const selectedItem = this.props.selectedItem;

		if (this.state.preselectedLinkIndex !== undefined) {
			return false;
		}

		return selectedItem
			? selectedItem.value
				? item.value === selectedItem.value
				: item.label === selectedItem.label && item.id === selectedItem.id
			: !!item.selected;
	}

	private handleSelectedItemChange(selectedItem: DropdownItemProps, event: MouseEvent<HTMLElement>): void {
		this.resetPreselectedPosition();
		const items: DropdownItemProps[] = [];
		flattenItems(this.props.items, items);

		const selectedItemVerticalIndex = items.findIndex((item) =>
			selectedItem.value
				? item.value === selectedItem.value
				: item.label === selectedItem.label && item.id === selectedItem.id
		);

		for (let row = 0; row < this.itemRefs.length; row++) {
			const index = this.itemRefs[row].findIndex((i) => i.verticalIndex === selectedItemVerticalIndex);

			if (index > -1) {
				this.setState({ preselectedPosition: { row, index } });
				this.itemRefs[row][index].ref.setAttribute("data-preselect", "true");
				break;
			}
		}

		this.props.onClick?.(selectedItem, event);
		this.props.onSelectedItemChange?.(selectedItem);
	}

	private handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		this.props.onKeyDown?.(event);
		this.handleForwardedKeyboardEvent(event);
	}

	private handleFocus(): void {
		this.getAllItemRefs();
	}

	private scrollPreselectItemIntoView(): void {
		if (!this.itemRefs || !this.state.preselectedPosition) {
			return;
		}

		if (
			this.state.preselectedPosition &&
			this.dropdownContentRef &&
			this.itemRefs.length > 1 &&
			this.itemRefs[this.state.preselectedPosition.row]
		) {
			const currentRef = this.itemRefs[this.state.preselectedPosition.row][this.state.preselectedPosition.index].ref;

			if (
				!isElementCompletelyVisibleInContainer(this.dropdownContentRef, currentRef as HTMLElement) ||
				!isVisibleOnScreen(currentRef)
			) {
				currentRef.scrollIntoView(this.scrollElementToPosition);
			} else if (this.props.selectedItemPosition && typeof this.scrollElementToPosition !== "boolean") {
				currentRef.scrollIntoView(this.scrollElementToPosition);
			}
		}
	}

	componentDidMount(): void {
		this.getAllItemRefs(true);
	}

	componentDidUpdate(prevProps: DropDownProps): void {
		if (prevProps.items !== this.props.items || prevProps.selectedItem !== this.props.selectedItem) {
			this.getAllItemRefs();

			if (prevProps.selectedItem !== this.props.selectedItem) {
				if (this.props.selectedItem && this.state.preselectedLinkIndex) {
					this.setState({ preselectedLinkIndex: undefined });
					this.props.onPreselectedLinkChange?.(undefined);
				}

				this.scrollPreselectItemIntoView();
			}
		}
	}

	render(): ReactNode {
		const props = this.props;
		const isTouch = props.touch ?? provider.hasTouch();
		const className = joinClassNames(
			baseClassName,
			{ [`${baseClassName}--touch`]: isTouch },
			{ [`${baseClassName}--light-background`]: props.lightBackground },
			{ [`${baseClassName}--horizontal`]: props.horizontal },
			props.className
		);
		const extendedItemClassName = isExtendedDropdown(props.items) ? `${itemClassName}--extended` : undefined;

		if (!props.hint && !props.links && props.items.length === 0) {
			return null;
		}

		const preselectedValue = this.getCurrentPreselectedItem();

		return (
			<DropdownContextProvider
				value={{
					horizontal: !!props.horizontal,
					lightBackground: !!props.lightBackground,
					touch: isTouch,
					extended: isExtendedDropdown(props.items)
				}}
			>
				<StyledDropdownWrapper
					id={props.id}
					className={className}
					style={props.style}
					tabIndex={props.tabIndex ? props.tabIndex : 0}
					onKeyDown={this.handleKeyDown}
					onMouseDown={props.onWrapperMouseDown}
					ref={props.wrapperRef}
					role="presentation"
					onKeyPress={props.onKeyPress}
					onFocus={this.handleFocus}
					onBlur={props.onBlur}
					data-role={DataRoles.Dropdown}
					$horizontal={props.horizontal}
					$lightBackground={props.lightBackground}
					$touch={isTouch}
				>
					{props.links && (
						<StyledDropdownLinksWrapper
							aria-labelledby={props.ariaLabelledby}
							id={props.id ? `${props.id}--links` : undefined}
							data-role={DataRoles.Dropdown.Links}
							ref={this.getDropdownLinksRef}
							role="listbox"
							$touch={isTouch}
						>
							{props.links.map((linkElement, index) => {
								return (
									<DropdownLinkItem
										key={index}
										preselected={index === this.state.preselectedLinkIndex}
										id={props.id ? `${props.id}--link-${index}` : undefined}
									>
										{linkElement}
									</DropdownLinkItem>
								);
							})}
						</StyledDropdownLinksWrapper>
					)}
					{props.hint && (
						<StyledDropdownHint
							className={`${baseClassName}__hint`}
							id={props.id ? `${props.id}--hint` : undefined}
							data-role={DataRoles.Dropdown.Hint}
						>
							{props.hint}
						</StyledDropdownHint>
					)}
					{props.items && (
						<StyledDropdownContent
							ref={this.getDropdownContentRef}
							role="listbox"
							className={`${baseClassName}__content`}
							onScroll={props.onScroll}
							aria-labelledby={joinClassNames(props.ariaLabelledby, { [`${props.id}--hint`]: props.id })}
							data-role={DataRoles.Dropdown.Content}
							$touch={isTouch}
							$horizontal={props.horizontal}
						>
							{props.items.map((item, index) => {
								if (item.children) {
									return (
										<Fragment key={index}>
											<DropDownSectionItem key={index} item={item} id={item.id ?? `section-${index}`} />
											{item.children.map((subItem, subItemIndex) => {
												const selected = this.isItemSelected(subItem);
												const preselected = preselectedValue
													? subItem.value
														? preselectedValue.value === subItem.value
														: subItem.id
															? preselectedValue.id === subItem.id
															: preselectedValue.label === subItem.label
													: selected;

												return (
													<DropDownItem
														key={subItemIndex}
														item={{ ...subItem, selected }}
														preselected={preselected}
														onClick={this.handleSelectedItemChange}
														onMouseDown={props.onMouseDown}
														className={extendedItemClassName}
														useFocusStyle={props.useFocusStyle}
														sectionId={item.id ?? `section-${index}`}
														hideA11yLabel={this.props.hideA11yLabel}
														labelRenderer={props.labelRenderer}
													/>
												);
											})}
										</Fragment>
									);
								} else {
									const selected = this.isItemSelected(item);
									const preselected = preselectedValue
										? item.value
											? preselectedValue.value === item.value
											: item.id
												? preselectedValue.id === item.id
												: preselectedValue.label === item.label
										: selected;

									return (
										<DropDownItem
											key={index}
											item={{ ...item, selected }}
											preselected={preselected}
											onClick={this.handleSelectedItemChange}
											onMouseDown={props.onMouseDown}
											className={extendedItemClassName}
											useFocusStyle={props.useFocusStyle}
											hideA11yLabel={this.props.hideA11yLabel}
											labelRenderer={props.labelRenderer}
										/>
									);
								}
							})}
						</StyledDropdownContent>
					)}
					{props.footer && <StyledDropdownFooter>{props.footer}</StyledDropdownFooter>}
				</StyledDropdownWrapper>
			</DropdownContextProvider>
		);
	}
}

interface DropdownItemInternalProps extends Styleable, Identifiable {
	item: DropdownItemProps;
	useFocusStyle?: boolean;
	sectionId?: string;
	preselected?: boolean;
	hideA11yLabel?: boolean;
	labelRenderer?(item: DropdownItemProps): ReactNode;

	onClick(item: DropdownItemProps, event: MouseEvent<HTMLElement>): void;

	onMouseDown?(item: DropdownItemProps, event: MouseEvent<HTMLElement>): void;
}

function DropDownItem(props: DropdownItemInternalProps): ReactElement<DropdownItemInternalProps> {
	const dropdownContextValue = useContext(DropdownContext);
	const itemClassNames = joinClassNames(
		itemClassName,
		{ [disabledItemClassName]: props.item.disabled },
		{ [preSelectClassName]: props.item.selected && !props.useFocusStyle },
		{ [preSelectFocusClassName]: props.item.selected && props.useFocusStyle },
		props.className,
		props.item.className
	);
	const isMultiselectItem = props.item.dataType === "multiselect-item";
	const isMac = getDesktopOperatingSystem() === "Mac";

	return (
		<StyledDropdownItem
			key={props.item.id}
			tabIndex={props.item.disabled || props.item.children ? -1 : props.item.tabIndex}
			className={itemClassNames}
			id={props.item.id}
			style={props.item.style}
			onClick={props.item.disabled ? undefined : (event): void => props.onClick?.(props.item, event)}
			onMouseDown={props.item.disabled ? undefined : (event): void => props.onMouseDown?.(props.item, event)}
			role={isMac && isMultiselectItem ? "checkbox" : "option"}
			title={props.item.title}
			aria-selected={!isMultiselectItem ? props.item.selected : undefined}
			aria-describedby={props.sectionId}
			aria-disabled={props.item.disabled}
			aria-checked={props.item.ariaChecked}
			data-role={DataRoles.Dropdown.Item}
			data-type={props.item.dataType}
			data-preselect={props.item.selected}
			$extended={dropdownContextValue.extended}
			$touch={dropdownContextValue.touch}
			$horizontal={dropdownContextValue.horizontal}
			$isEmptyValue={props.item.isEmptyValue}
			$preselected={
				(props.item.selected && !props.useFocusStyle && props.preselected) ||
				(props.preselected && !props.useFocusStyle)
			}
			$focusPreselected={
				(props.item.selected && props.useFocusStyle && props.preselected) || (props.preselected && props.useFocusStyle)
			}
			$disabled={props.item.disabled}
			$divider={props.item.divider}
			$hasLabelRenderer={!!props.labelRenderer}
		>
			{props.item.graphic && (
				<StyledDropdownGraphic
					className={`${baseClassName}__graphic`}
					data-role={DataRoles.Dropdown.Graphic}
					$preselected={
						(props.item.selected && !props.useFocusStyle && props.preselected) ||
						(props.preselected && !props.useFocusStyle)
					}
					$horizontal={dropdownContextValue.horizontal}
				>
					{props.item.graphic}
				</StyledDropdownGraphic>
			)}
			{props.item.hideLabel ? (
				<HiddenText>{props.item.label}</HiddenText>
			) : (
				<StyledDropdownText
					aria-hidden={props.hideA11yLabel ? true : undefined}
					className={joinClassNames(`${baseClassName}__text`)}
					data-role={DataRoles.Dropdown.Text}
					$extended={dropdownContextValue.extended}
					$horizontal={dropdownContextValue.horizontal}
				>
					{props.labelRenderer ? props.labelRenderer(props.item) : props.item.label}
				</StyledDropdownText>
			)}
			{props.item.secondaryText && (
				<StyledDropdownSecondaryText
					className={`${baseClassName}__secondary-text`}
					data-role={DataRoles.Dropdown.SecondaryText}
					$extended={dropdownContextValue.extended}
					$preselected={
						(props.item.selected && !props.useFocusStyle && props.preselected) ||
						(props.preselected && !props.useFocusStyle)
					}
					$disabled={props.item.disabled}
					$touch={dropdownContextValue.touch}
				>
					{props.item.secondaryText}
				</StyledDropdownSecondaryText>
			)}
		</StyledDropdownItem>
	);
}

DropDownItem.displayName = "DropdownItem";

function DropDownSectionItem(props: { item: DropdownItemProps; id: string }): ReactElement<DropdownItemProps> {
	const itemClassName = joinClassNames(`${baseClassName}__section`, props.item.className);

	return (
		<StyledDropdownSection
			className={itemClassName}
			id={props.item.id ?? props.id}
			style={props.item.style}
			data-role={DataRoles.Dropdown.SectionItem}
		>
			<StyledDropdownText className={`${baseClassName}__text`}>{props.item.label}</StyledDropdownText>
			{props.item.secondaryText && (
				<StyledDropdownSecondaryText className={`${baseClassName}__section-secondaryText`}>
					{props.item.secondaryText}
				</StyledDropdownSecondaryText>
			)}
		</StyledDropdownSection>
	);
}

DropDownSectionItem.displayName = "DropdownSectionItem";

function DropdownLinkItem(props: { children: ReactNode; preselected?: boolean; id?: string }): ReactElement {
	const dropdownContextValue = useContext(DropdownContext);
	const linkItemWrapperRef = useRef<HTMLDivElement | null>(null);

	const getLinkItemWrapperRef = useCallback((ref: HTMLDivElement | null) => {
		if (ref) {
			linkItemWrapperRef.current = ref;
		}
	}, []);

	const handleClick = useCallback((event: MouseEvent) => {
		if (
			linkItemWrapperRef.current?.firstChild &&
			!linkItemWrapperRef.current?.firstChild.contains(event.target as HTMLElement)
		) {
			const firstChild = linkItemWrapperRef.current?.firstChild as HTMLElement;
			firstChild.click();
		}
	}, []);

	return (
		<StyledDropdownLink
			id={props.id}
			onClick={handleClick}
			ref={getLinkItemWrapperRef}
			role="option"
			aria-selected={props.preselected}
			data-role={DataRoles.Dropdown.LinkItemWrapper}
			$preselected={props.preselected}
			$touch={dropdownContextValue.touch}
		>
			{props.children}
		</StyledDropdownLink>
	);
}

DropdownLinkItem.displayName = "DropdownLinkItem";
