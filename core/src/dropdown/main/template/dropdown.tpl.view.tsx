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

import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode, RefCallback } from "react";
import { Component, Fragment } from "react";
import { Key } from "ts-key-enum";

import { DataRoles } from "../../../common/main/data-roles.js";
import { provider } from "../../../common/main/device-detector.js";
import {
	bindMethods,
	isElementCompletelyVisibleInContainer,
	isVisibleOnScreen,
	joinClassNames,
	Key as CustomKey
} from "../../../common/main/utils.js";

import { baseClassName, itemClassName } from "./dropdown.class-names.js";
import type { DropdownContextValue } from "./dropdown.context.js";
import { DEFAULT_CONTEXT_VALUE, DropdownContextProvider } from "./dropdown.context.js";
import { DropDownItem } from "./dropdown.item.view.js";
import { DropdownLinkItem } from "./dropdown.link.view.js";
import type { NavigationModel, RenderRows } from "./dropdown.navigation.js";
import {
	buildNavigationModel,
	buildRenderRows,
	getEdgeStep,
	getNextHorizontalStep,
	getNextVerticalStep
} from "./dropdown.navigation.js";
import { DropDownSectionItem } from "./dropdown.section.view.js";
import type { DropDownProps, DropDownItem as DropdownItemProps } from "./dropdown.tpl.api.js";
import {
	StyledDropdownContent,
	StyledDropdownHint,
	StyledDropdownWrapper,
	StyledDropdownFooter,
	StyledDropdownLinksWrapper
} from "./dropdown.tpl.styled.js";
import { isExtendedDropdown, isSameDropdownItem } from "./dropdown.utils.js";
import type { DropdownVirtualizerHandle, VirtualScrollAlignment } from "./dropdown.virtualized-content.view.js";
import { VirtualizedDropdownContent } from "./dropdown.virtualized-content.view.js";

/** Assumed option height while windowing, until the real heights have been measured. */
const DEFAULT_ESTIMATED_ITEM_HEIGHT = 24;

interface Position {
	row: number;
	index: number;
}

interface DropDownState {
	/** Flat index of the active option in the navigation model. */
	preselectedIndex?: number;
	preselectedLinkIndex?: number;
}

export class DropDown<T = unknown> extends Component<DropDownProps<T>, DropDownState> {
	static displayName = "Dropdown";
	private dropdownContentRef: HTMLElement | null = null;
	private dropdownLinksRef: HTMLElement | null = null;

	/** Mounted option elements by flat index; only needed for focus and scrolling. */
	private itemElements = new Map<number, HTMLElement>();
	private itemIndexByElement = new WeakMap<HTMLElement, number>();

	/**
	 * Active option, updated synchronously so that several key events dispatched within one task see
	 * each other's effect — the published index has not flushed yet at that point. Event handling
	 * reads this field; rendering reads {@link getActiveIndex}, which it mirrors.
	 */
	private activeIndex: number | undefined = undefined;

	/** Item the active index pointed at, so the active option can survive an `items` update. */
	private activeItem: DropdownItemProps<T> | undefined = undefined;
	private contextValue: DropdownContextValue = DEFAULT_CONTEXT_VALUE;

	/** Set while the option list is windowed; scrolling then goes by index, not by element. */
	private virtualizerHandle: DropdownVirtualizerHandle | null = null;
	private navigationModel: NavigationModel<T> = buildNavigationModel<T>([]);

	/** The rows a windowed list renders, section headers included; see {@link buildRenderRows}. */
	private renderRows: RenderRows<T> = buildRenderRows<T>([]);
	private navigationModelSource: DropdownItemProps<T>[] | undefined = undefined;
	private linkRefs: { ref: HTMLElement }[] = [];

	static defaultProps = { selectItemKeys: [Key.Enter] };

	constructor(props: DropDownProps<T>) {
		super(props);
		this.state = {};
		bindMethods(this);
	}

	componentWillUnmount(): void {
		this.props.navigation?.attach(null);
	}

	/**
	 * Clears the active option.
	 * @deprecated since 39.1.0. Call `reset()` on the handle from `useDropdownNavigation` instead,
	 *   which needs no reference to the rendered list.
	 */
	public resetPreselectedPosition(): void {
		if (this.activeIndex === undefined) {
			return;
		}

		this.props.onPreselectedItemChange?.(undefined);
		this.commitActive(undefined);
	}

	/** Whether more than one option can be selected at a time. */
	private isMultiple(): boolean {
		return this.props.selectionMode === "multiple";
	}

	/** Compares two options by {@link DropDownProps.getItemKey}, or the way selection always has. */
	private isSameItem(one: DropdownItemProps<T> | undefined, other: DropdownItemProps<T> | undefined): boolean {
		return isSameDropdownItem(one, other, this.props.getItemKey);
	}

	/**
	 * The option marked `selected`. If several are marked, the last one wins,
	 * the same way {@link syncPreselectionFromItems} picks the active option.
	 *
	 * Looks inside sections one level deep, so a mark on an option inside a section counts.
	 * That is where `CustomSelect` puts it.
	 * @param items the dropdown items, may contain sections with `children`
	 */
	private findSelectedItem(items: DropdownItemProps<T>[]): DropdownItemProps<T> | undefined {
		let selected: DropdownItemProps<T> | undefined = undefined;

		for (const item of items) {
			for (const candidate of item.children ?? [item]) {
				if (candidate.selected) {
					selected = candidate;
				}
			}
		}

		return selected;
	}

	/**
	 * Whether the selection moved because an option's `selected` mark moved
	 * and not because `selectedItem` or `selectedItems` changed.
	 *
	 * A list can be told what is selected two ways: through `selectedItem` or by marking the option itself.
	 * `CustomSelect` and the `IconPicker` only mark and pass no `selectedItem`.
	 *
	 * Watching the properties alone misses those lists.
	 * The selection moves, the active option stays where it was,
	 * and Enter then picks the option the user is not looking at.
	 * @param prevProps the properties of the previous render
	 */
	private hasFlaggedSelectionMoved(prevProps: DropDownProps<T>): boolean {
		// The same array holds the same marks, and this runs on every update
		// so a long list is not walked twice for a re-render that did not touch the options.
		if (prevProps.items === this.props.items) {
			return false;
		}

		// A multi-select list keeps its active option when the selection changes, so this cannot matter.
		if (this.isMultiple()) {
			return false;
		}

		// A caller that passes a selection property has said what is selected.
		// The marks on the options do not count then.
		if (this.props.selectedItem || this.props.selectedItems || prevProps.selectedItem || prevProps.selectedItems) {
			return false;
		}

		const before = this.findSelectedItem(prevProps.items);
		const after = this.findSelectedItem(this.props.items);

		// `isSameItem` says two missing options are different,
		// so without this a list with nothing selected would look changed on every render.
		if (!before && !after) {
			return false;
		}

		// Compare the options, not the objects: callers usually build a new `items` array every render.
		return !this.isSameItem(before, after);
	}

	/**
	 * The active option's position. Owned by the handle from `useDropdownNavigation` when one was
	 * handed in, so that the caller can render from it, and by this component's own state otherwise.
	 */
	private getActiveIndex(): number | undefined {
		return this.props.navigation ? this.props.navigation.activeIndex : this.state.preselectedIndex;
	}

	/** The active link option's position; owned like {@link getActiveIndex}. */
	private getActiveLinkIndex(): number | undefined {
		return this.props.navigation ? this.props.navigation.activeLinkIndex : this.state.preselectedLinkIndex;
	}

	/**
	 * Records the active option and publishes it — to the handle when there is one, to this
	 * component's state otherwise.
	 * @param index flat index of the option, or `undefined` to clear the active option
	 * @param done runs once the new active option has been published; synchronously for a handle,
	 *   whose owner re-renders on its own schedule
	 */
	private commitActive(index: number | undefined, done?: () => void): void {
		this.setActive(index);

		if (this.props.navigation) {
			this.props.navigation.setActiveIndex(index);
			done?.();
		} else {
			this.setState({ preselectedIndex: index }, done);
		}
	}

	/** Publishes the active link option; see {@link commitActive}. */
	private commitActiveLink(index: number | undefined, done?: () => void): void {
		if (this.props.navigation) {
			this.props.navigation.setActiveLinkIndex(index);
			done?.();
		} else {
			this.setState({ preselectedLinkIndex: index }, done);
		}
	}

	/** The keys that select the active option — Space selects too when options are toggled. */
	private getKeysToSelectItem(): string[] {
		return this.props.keysToSelectItem ?? (this.isMultiple() ? [Key.Enter, CustomKey.Space] : [Key.Enter]);
	}

	/** The selected options of a multi-select list, from the prop or from the options' own flags. */
	private getSelectedItems(): DropdownItemProps<T>[] {
		return (
			this.props.selectedItems ??
			this.navigationModel.entries.filter((entry) => entry.item.selected).map((entry) => entry.item)
		);
	}

	/** The selection that results from toggling `item`. */
	private getToggledSelection(item: DropdownItemProps<T>): DropdownItemProps<T>[] {
		const selectedItems = this.getSelectedItems();
		const index = selectedItems.findIndex((selectedItem) => this.isSameItem(selectedItem, item));

		return index >= 0
			? [...selectedItems.slice(0, index), ...selectedItems.slice(index + 1)]
			: [...selectedItems, item];
	}

	/**
	 * Returns a stable context value. A fresh object here would re-render every option on every
	 * render of the list — a context change bypasses the options' memoization — which is what made
	 * activating an option cost as much as building the whole list.
	 * @param isTouch whether the list is rendered for touch input
	 */
	private getContextValue(isTouch: boolean): DropdownContextValue {
		const next: DropdownContextValue = {
			horizontal: !!this.props.horizontal,
			lightBackground: !!this.props.lightBackground,
			touch: isTouch,
			extended: isExtendedDropdown(this.props.items),
			multiple: this.isMultiple()
		};
		const current = this.contextValue;

		if (
			current.horizontal === next.horizontal &&
			current.lightBackground === next.lightBackground &&
			current.touch === next.touch &&
			current.extended === next.extended &&
			current.multiple === next.multiple
		) {
			return current;
		}

		this.contextValue = next;

		return next;
	}

	/**
	 * Whether the option list is windowed. Ruled out for a wrapping grid (rows only exist in layout)
	 * and when focus is moved onto the options (a recycled option would lose it).
	 */
	private isVirtualized(): boolean {
		const { virtualize, horizontal, useFocusStyle } = this.props;

		return !!virtualize && !horizontal && !useFocusStyle;
	}

	/** Translates an option's flat index into the row that renders it, for the windowed list. */
	private getRowOfFlatIndex(flatIndex: number): number {
		return this.renderRows.rowOfFlatIndex[flatIndex] ?? flatIndex;
	}

	private setVirtualizerHandle(handle: DropdownVirtualizerHandle | null): void {
		this.virtualizerHandle = handle;
	}

	private getDropdownContentElement(): HTMLElement | null {
		return this.dropdownContentRef;
	}

	/**
	 * Scrolls the page so you can see the active option of a windowed list.
	 * `scrollToIndex` only scrolls the list's own box. If that box sits off the screen,
	 * the option stays hidden no matter how far the box scrolls.
	 *
	 * Uses the box when the option is not built yet. A windowed list only builds the options in view,
	 * and `scrollToIndex` adds this one on the next render, inside that box.
	 * @param flatIndex position of the active option
	 */
	private scrollListOntoScreen(flatIndex: number): void {
		const target = this.itemElements.get(flatIndex) ?? this.dropdownContentRef;

		// A box taller than the window never fits on screen.
		// Scrolling it on every keypress would just fight the list's own scrolling.
		if (!target || target.getBoundingClientRect().height > window.innerHeight) {
			return;
		}

		if (!isVisibleOnScreen(target)) {
			target.scrollIntoView({ block: "nearest" });
		}
	}

	/** Translates {@link DropDownProps.selectedItemPosition} into a windowed scroll alignment. */
	private getVirtualScrollAlignment(): VirtualScrollAlignment {
		switch (this.props.selectedItemPosition) {
			case "top":
				return "start";
			case "middle":
				return "center";
			case "bottom":
				return "end";
			default:
				return "auto";
		}
	}

	/** Records the active option synchronously; see {@link activeIndex}. */
	private setActive(index: number | undefined): void {
		this.activeIndex = index;
		this.activeItem = index === undefined ? undefined : this.navigationModel.entries[index]?.item;
	}

	/**
	 * Moves or selects the active option in response to a key event that reached another element —
	 * the combobox input, typically.
	 * @deprecated since 39.1.0. Call `handleKeyDown()` on the handle from `useDropdownNavigation`
	 *   instead, which needs no reference to the rendered list.
	 */
	public handleForwardedKeyboardEvent(event: KeyboardEvent<HTMLElement>): void {
		// A wrapping grid can only be grouped into rows by measuring, so it is re-read per keystroke;
		// a vertical list needs no measuring at all and its model comes straight from `items`.
		this.refreshNavigationModel(!!this.props.horizontal);
		this.refreshLinkRefs();

		if (
			event.key === Key.ArrowUp ||
			event.key === Key.ArrowDown ||
			event.key === Key.ArrowRight ||
			event.key === Key.ArrowLeft
		) {
			event.preventDefault();
			event.stopPropagation();

			if (this.navigationModel.allDisabled && !this.linkRefs.length) {
				return;
			}

			this.goToNextPreselectedItem(event);
		} else {
			if (this.props.selectItemKeys?.includes(event.keyCode) || this.getKeysToSelectItem().includes(event.key)) {
				// Space scrolls the page down when the browser gets to act on it, and the focus sits on the wrapper,
				// which is not a scroll container. Selecting with Space is what a multi-select list does by default,
				// so the page would jump on every toggle. Enter is left alone: it never scrolls,
				// and swallowing it would stop a form submitting the way it always has.
				if (event.key === CustomKey.Space) {
					event.preventDefault();
				}

				const targetIndex = this.itemIndexByElement.get(event.target as HTMLElement);
				const selectedItem = this.getCurrentPreselectedItem(targetIndex);
				const activeLinkIndex = this.getActiveLinkIndex();

				if (selectedItem) {
					this.handleSelectedItemChange(
						selectedItem,
						targetIndex ?? this.activeIndex,
						event as MouseEvent<HTMLElement> & KeyboardEvent<HTMLElement>
					);
				} else if (activeLinkIndex !== undefined) {
					// Nothing to click when the active link is no longer there — the links may have been
					// re-rendered since it became active.
					this.linkRefs[activeLinkIndex]?.ref.click();
				}

				if (activeLinkIndex !== undefined) {
					this.commitActiveLink(undefined);
				}
			}
		}
	}

	/**
	 * Activates the option at `index` in the flattened item list.
	 * @param index flat index of the option, or `undefined` to clear the active option
	 * @deprecated since 39.1.0. Call `setActiveIndex()` — or `setActiveItem()`, which spares you the
	 *   index — on the handle from `useDropdownNavigation` instead.
	 */
	public setPreselectedIndex(index: number | undefined): void {
		this.commitActive(index, this.setPreselectedItem);
	}

	/**
	 * @deprecated since 39.1.0. Positions are flat indices now — use {@link setPreselectedIndex}.
	 *   A `{row, index}` pair is resolved against the row grouping, which for a vertical list means
	 *   `row` already is the flat index.
	 */
	public setPreselectedPosition(position: Position | undefined): void {
		if (!position) {
			this.setPreselectedIndex(undefined);

			return;
		}

		this.refreshNavigationModel(!!this.props.horizontal);
		this.setPreselectedIndex(this.navigationModel.rows[position.row]?.[position.index]);
	}

	/**
	 * The link option an arrow key moves to while no option of the list is active, or `undefined` to
	 * hand navigation over to the option list — which then enters it at the edge the key came from.
	 *
	 * The links are rendered above the options, so the two groups form one sequence: Down enters it at
	 * the first link and leaves the last link for the list, Up enters it at the *last option* and only
	 * reaches the links from there, wrapping round at the first one. With no options at all the links
	 * wrap among themselves.
	 * @param key the arrow key that was pressed
	 * @param from the currently active link, if any
	 */
	private getNextLinkIndex(key: string, from: number | undefined): number | undefined {
		const lastLink = this.linkRefs.length - 1;
		const hasItems = this.props.items.length > 0;

		if (key === Key.ArrowUp) {
			// Arrowing up with no link active reaches the bottom of the sequence — the list's last option,
			// exactly like arrowing up off the first link does. Handing the *first* link back instead is
			// what used to leave nothing at all active here.
			return from === undefined || from <= 0 ? (hasItems ? undefined : lastLink) : from - 1;
		}

		if (key === Key.ArrowDown) {
			return from === undefined ? 0 : from === lastLink ? (hasItems ? undefined : 0) : from + 1;
		}

		return from ?? 0;
	}

	private goToNextPreselectedItem(event: KeyboardEvent<HTMLElement>): void {
		const { items } = this.props;
		const preselectedLinkIndex = this.getActiveLinkIndex();
		const preselectedIndex = this.activeIndex;

		// Identify the preselected position while navigating between link options or when there is no preselected dropdown item yet
		if (preselectedIndex === undefined) {
			if (this.linkRefs.length > 0) {
				const newPreselectedLinkIndex = this.getNextLinkIndex(event.key, preselectedLinkIndex);
				const newLinkRef =
					newPreselectedLinkIndex === undefined ? undefined : this.linkRefs[newPreselectedLinkIndex]?.ref;

				this.commitActiveLink(newPreselectedLinkIndex, () => {
					if (newPreselectedLinkIndex !== undefined) {
						this.resetPreselectedPosition();
					}

					this.props.onPreselectedLinkChange?.(newPreselectedLinkIndex);
				});

				// Without a link to move to, navigation carries on into the option list below.
				if (newLinkRef) {
					if (!isVisibleOnScreen(newLinkRef)) {
						newLinkRef.scrollIntoView();
					}

					return;
				}
			}

			if (items.length > 0) {
				const edgeStep = getEdgeStep(
					this.navigationModel,
					event.key !== Key.ArrowRight && event.key !== Key.ArrowDown ? -1 : 1
				);

				if (edgeStep.type === "item") {
					this.setPreselectedIndex(edgeStep.flatIndex);
				}
			}

			return;
		}

		const step =
			event.key === Key.ArrowDown || event.key === Key.ArrowUp
				? getNextVerticalStep(
						this.navigationModel,
						preselectedIndex,
						event.key === Key.ArrowDown ? 1 : -1,
						this.linkRefs.length
					)
				: this.props.horizontal && (event.key === Key.ArrowRight || event.key === Key.ArrowLeft)
					? getNextHorizontalStep(this.navigationModel, preselectedIndex, event.key === Key.ArrowRight ? 1 : -1)
					: { type: "item" as const, flatIndex: preselectedIndex };

		if (step.type === "linkBoundary") {
			this.goToLinkOption(step.linkIndex);

			return;
		}

		this.setPreselectedIndex(step.type === "item" ? step.flatIndex : undefined);
	}

	/** Hands keyboard navigation over from the option list to the link options rendered above it. */
	private goToLinkOption(linkIndex: number): void {
		const linkRef = this.linkRefs[linkIndex]?.ref;

		this.commitActiveLink(linkIndex, () => {
			if (linkRef && !isVisibleOnScreen(linkRef)) {
				linkRef.scrollIntoView({ block: "center" });
			}

			this.props.onPreselectedLinkChange?.(linkIndex);
		});
		this.resetPreselectedPosition();
	}

	private getDropdownContentRef(ref: HTMLElement | null): void {
		const isFirstAttach = !this.dropdownContentRef && !!ref;

		this.dropdownContentRef = ref;

		// This element is the windowed list's scroll container, and React attaches a parent's ref only
		// after its children's layout effects have run — so the virtualizer asks for it while it is still
		// null, finds no viewport and windows nothing at all. It reads it again on the next render, which
		// a popup anchored to a field always gets from its positioning, but the dialog does not: it
		// renders once and would stay empty until the first keystroke.
		if (isFirstAttach && this.isVirtualized()) {
			this.forceUpdate();
		}
	}

	private getDropdownLinksRef(ref: HTMLElement | null): void {
		this.dropdownLinksRef = ref;
	}

	/** Tracks the mounted option elements, which are needed for focus and scrolling only. */
	private registerItemElement(flatIndex: number, element: HTMLElement | null): void {
		const previous = this.itemElements.get(flatIndex);

		if (previous) {
			this.itemIndexByElement.delete(previous);
		}

		if (element) {
			this.itemElements.set(flatIndex, element);
			this.itemIndexByElement.set(element, flatIndex);
		} else {
			this.itemElements.delete(flatIndex);
		}
	}

	/**
	 * Rebuilds the navigation model when `items` changed identity, or when the caller knows the row
	 * grouping may have changed (a wrapping grid reflowing).
	 * @param force rebuild even when `items` is unchanged
	 */
	private refreshNavigationModel(force = false): void {
		if (!force && this.navigationModelSource === this.props.items) {
			return;
		}

		this.navigationModel = buildNavigationModel(this.props.items, this.readGridRows());
		this.renderRows = buildRenderRows(this.props.items);
		this.navigationModelSource = this.props.items;
	}

	/**
	 * Groups the rendered options into rows by their vertical offset. Only a wrapping grid needs this;
	 * a vertical list has one option per row, which the model assumes by default.
	 */
	private readGridRows(): number[][] | undefined {
		if (!this.props.horizontal || !this.dropdownContentRef) {
			return undefined;
		}

		const elements = [...this.itemElements.entries()].sort(([a], [b]) => a - b);
		const rows: number[][] = [];
		let previousTop: number | undefined;

		for (const [flatIndex, element] of elements) {
			const { top } = element.getBoundingClientRect();

			if (previousTop === undefined || top !== previousTop) {
				rows.push([]);
				previousTop = top;
			}

			rows[rows.length - 1].push(flatIndex);
		}

		return rows.length > 0 ? rows : undefined;
	}

	private refreshLinkRefs(): void {
		if (!this.dropdownLinksRef) {
			return;
		}

		const linkItems = this.dropdownLinksRef.querySelectorAll(`[data-role=${DataRoles.Dropdown.LinkItemWrapper}]`);
		this.linkRefs = [...linkItems].map((ref) => ({ ref: ref as HTMLElement }));
	}

	/**
	 * Resets the active option to the selected one whenever the list or the selection changed. The
	 * previous implementation achieved this by re-reading the `data-preselect` attributes it had
	 * written itself, which resolved to the *last* selected item — preserved here.
	 */
	private syncPreselectionFromItems(scrollIntoView = false, selectionChanged = false): void {
		const entries = this.navigationModel.entries;
		const active = this.activeIndex;
		let preselectedIndex: number | undefined = undefined;
		// A single-select list follows a changed selection: it is what the list opens on, and what it
		// scrolls to when the caller selects an option from outside the list. A multi-select list keeps
		// its active option instead — every toggle changes the selection there, and moving the active
		// option along with it would restart the keyboard navigation under the user.
		const keepActiveOption = !selectionChanged || this.isMultiple();

		if (
			keepActiveOption &&
			active !== undefined &&
			this.activeItem &&
			this.isSameItem(entries[active]?.item, this.activeItem)
		) {
			// Consumers commonly pass a fresh `items` array on every render. Keeping the active option
			// when it is still at the same position matches what the previous implementation did by
			// reading the active option back out of the reused option elements.
			preselectedIndex = active;
		} else if (!this.isMultiple()) {
			// Only a single-select list can derive its active option from the selection; see
			// {@link isItemPreselected}.
			for (const entry of entries) {
				if (this.isItemSelected(entry.item)) {
					preselectedIndex = entry.flatIndex;
				}
			}
		}

		this.commitActive(preselectedIndex, () => {
			if (scrollIntoView && preselectedIndex !== undefined) {
				setTimeout(() => this.scrollPreselectItemIntoView());
			}
		});
	}

	private setPreselectedItem(): void {
		const preselectedIndex = this.activeIndex;

		if (preselectedIndex === undefined) {
			return;
		}

		if (this.virtualizerHandle) {
			// The option may not be mounted, so it is scrolled to by index; mounting it is what makes it
			// referenceable by `aria-activedescendant`.
			this.virtualizerHandle.scrollToIndex(this.getRowOfFlatIndex(preselectedIndex), this.getVirtualScrollAlignment());
			this.scrollListOntoScreen(preselectedIndex);
		} else if (this.dropdownContentRef) {
			const currentRef = this.itemElements.get(preselectedIndex);

			if (currentRef) {
				if (this.props.useFocusStyle) {
					currentRef.focus({ preventScroll: true });
				}

				// The option can be hidden two ways: the list scrolled past it, or the list sits off the
				// screen. Check both. The container test only compares the option with the list box, so an
				// option the box shows fine still needs the page scrolled when the box is off the screen.
				//
				// That test also compares edges strictly, so the first and last option
				// flush with the box edge — come back hidden when they are not.
				if (
					!isElementCompletelyVisibleInContainer(this.dropdownContentRef, currentRef) ||
					!isVisibleOnScreen(currentRef)
				) {
					// `nearest` makes that false alarm harmless: it does nothing when the option is already in view.
					// `start` or `end` would act on it, and they scroll every box that can scroll, the page included.
					currentRef.scrollIntoView({ block: "nearest" });
				}
			}
		} else {
			return;
		}

		this.props.onPreselectedItemChange?.(this.getCurrentPreselectedItem());
	}

	private getCurrentPreselectedItem(flatIndex?: number): DropdownItemProps<T> | undefined {
		const index = flatIndex ?? this.activeIndex;

		return index === undefined ? undefined : this.navigationModel.entries[index]?.item;
	}

	/**
	 * Whether the option at `flatIndex` is the active one. Without an active option the selected item
	 * is shown as active, as before. Matching by index rather than by value/id/label also stops
	 * duplicate items from all appearing active at once.
	 */
	private isItemPreselected(item: DropdownItemProps<T>, flatIndex: number): boolean {
		const activeIndex = this.getActiveIndex();

		if (activeIndex !== undefined) {
			return activeIndex === flatIndex;
		}

		// A multi-select list has no single selected option to stand in for the active one — showing
		// every selected option as active is what falling back would amount to.
		return this.isMultiple() ? false : this.isItemSelected(item);
	}

	private isItemSelected(item: DropdownItemProps<T>): boolean {
		if (this.getActiveLinkIndex() !== undefined) {
			return false;
		}

		if (this.isMultiple()) {
			const { selectedItems } = this.props;

			return selectedItems
				? selectedItems.some((selectedItem) => this.isSameItem(item, selectedItem))
				: !!item.selected;
		}

		const selectedItem = this.props.selectedItem;

		return selectedItem ? this.isSameItem(item, selectedItem) : !!item.selected;
	}

	/**
	 * @param selectedItem the item to report; the pointer path passes a copy carrying the resolved
	 *   `selected` flag, the keyboard path passes the item as given in `items` — as before
	 * @param flatIndex position of the item, which becomes the active option
	 * @param event the originating event
	 */
	private handleSelectedItemChange(
		selectedItem: DropdownItemProps<T>,
		flatIndex: number | undefined,
		event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
	): void {
		// Picking an option ends the arrow-key navigation, so no option is active any more.
		// A combobox puts the active option's id in `aria-activedescendant`, so without a report of `undefined`
		// it goes on telling a screen reader the user is on an option they only passed through.
		// Runs before `commitActive`, which overwrites the index this reads.
		// Not for a multi-select list: it keeps the option active to go on toggling it.
		if (this.activeIndex !== undefined && !this.isMultiple()) {
			this.props.onPreselectedItemChange?.(undefined);
		}

		this.commitActive(flatIndex);
		this.props.onClick?.(selectedItem, event as MouseEvent<HTMLElement>);
		this.props.onSelectedItemChange?.(selectedItem);

		if (this.isMultiple()) {
			// Reported from `items` rather than from the copy the pointer path passes in, so that callers
			// get their own option objects — `data` and all — back in the new selection.
			const toggledItem =
				(flatIndex === undefined ? undefined : this.navigationModel.entries[flatIndex]?.item) ?? selectedItem;
			this.props.onSelectionChange?.(this.getToggledSelection(toggledItem), toggledItem, event);
		}
	}

	private handleItemClick(flatIndex: number, item: DropdownItemProps<T>, event: MouseEvent<HTMLElement>): void {
		this.handleSelectedItemChange(item, flatIndex, event);
	}

	private handleKeyDown(event: KeyboardEvent<HTMLElement>): void {
		this.props.onKeyDown?.(event);
		this.handleForwardedKeyboardEvent(event);
	}

	private handleFocus(): void {
		this.refreshNavigationModel(!!this.props.horizontal);
		this.refreshLinkRefs();
	}

	/**
	 * Scroll target for a selection change; keyboard navigation scrolls by `nearest` instead.
	 * Without this, clicking an option — even one already fully visible, like the very first one —
	 * could jump the whole page and that option ends up at the bottom of the screen.
	 */
	private getSelectedItemScrollOptions(): ScrollIntoViewOptions {
		if (!this.props.selectedItemPosition) {
			return { block: "nearest" };
		}

		return {
			block:
				this.props.selectedItemPosition === "top"
					? "start"
					: this.props.selectedItemPosition === "middle"
						? "center"
						: "end"
		};
	}

	private scrollPreselectItemIntoView(): void {
		const preselectedIndex = this.activeIndex;

		if (preselectedIndex === undefined || !this.dropdownContentRef || this.navigationModel.rows.length <= 1) {
			return;
		}

		if (this.virtualizerHandle) {
			this.virtualizerHandle.scrollToIndex(this.getRowOfFlatIndex(preselectedIndex), this.getVirtualScrollAlignment());

			return;
		}

		const currentRef = this.itemElements.get(preselectedIndex);

		if (!currentRef) {
			return;
		}

		if (!isElementCompletelyVisibleInContainer(this.dropdownContentRef, currentRef)) {
			currentRef.scrollIntoView(this.getSelectedItemScrollOptions());
		} else if (this.props.selectedItemPosition) {
			currentRef.scrollIntoView(this.getSelectedItemScrollOptions());
		}
	}

	componentDidMount(): void {
		this.props.navigation?.attach(this);
		this.refreshNavigationModel(true);
		this.refreshLinkRefs();
		this.syncPreselectionFromItems(true);
	}

	componentDidUpdate(prevProps: DropDownProps<T>): void {
		if (prevProps.navigation !== this.props.navigation) {
			prevProps.navigation?.attach(null);
			this.props.navigation?.attach(this);
		}

		// Before anything that re-derives the active option from the items: this is what brings the list
		// in step with a move made through the handle, and re-deriving from a position the list has not
		// adopted yet would throw that move away.
		this.adoptExternallyMovedActiveOption(prevProps);

		const selectionChanged =
			prevProps.selectedItem !== this.props.selectedItem ||
			prevProps.selectedItems !== this.props.selectedItems ||
			this.hasFlaggedSelectionMoved(prevProps);

		if (prevProps.items !== this.props.items || selectionChanged) {
			this.refreshNavigationModel(true);
			this.refreshLinkRefs();
			this.syncPreselectionFromItems(false, selectionChanged);

			if (selectionChanged) {
				if ((this.props.selectedItem || this.props.selectedItems) && this.getActiveLinkIndex()) {
					this.commitActiveLink(undefined);
					this.props.onPreselectedLinkChange?.(undefined);
				}

				this.scrollPreselectItemIntoView();
			}
		}
	}

	/**
	 * Catches up with an active option that was moved through the handle from `useDropdownNavigation`
	 * rather than by this list — `moveToFirst()` or `reset()` on the handle, say.
	 *
	 * The handle only holds the position; scrolling the option into view, focusing it when the options
	 * hold the focus, and reporting it through {@link DropDownProps.onPreselectedItemChange} are the
	 * list's own doing, and none of that has happened yet at this point. This is what makes moving the
	 * active option through the handle behave the way the imperative methods it replaces did.
	 */
	private adoptExternallyMovedActiveOption(prevProps: DropDownProps<T>): void {
		const publishedIndex = this.props.navigation?.activeIndex;

		if (!this.props.navigation || publishedIndex === prevProps.navigation?.activeIndex) {
			return;
		}

		// A position this list published itself is already reflected in `activeIndex`, along with every
		// effect that goes with it; only a position it has not seen yet needs handling here.
		if (publishedIndex === this.activeIndex) {
			return;
		}

		this.setActive(publishedIndex);

		if (publishedIndex === undefined) {
			this.props.onPreselectedItemChange?.(undefined);
		} else {
			this.setPreselectedItem();
		}
	}

	/**
	 * Renders the windowed list. It renders rows rather than the navigation model's entries, because
	 * the model holds only the navigable options — a window built from it would drop the section
	 * headers between them. Every option row still carries the `flatIndex` the model gave it, so a
	 * position means the same thing on both paths.
	 * @param extendedItemClassName class name applied to options of an extended list
	 */
	private renderVirtualizedItems(extendedItemClassName: string | undefined): ReactNode {
		const props = this.props;
		// Deriving here keeps the first render windowed; it is an identity-cached computation over
		// `items` and reads no layout for a vertical list.
		this.refreshNavigationModel();

		const rows = this.renderRows.rows;
		const optionCount = this.navigationModel.entries.length;
		const estimatedItemHeight = props.estimatedItemHeight ?? DEFAULT_ESTIMATED_ITEM_HEIGHT;

		return (
			<VirtualizedDropdownContent
				count={rows.length}
				estimateRowHeight={(index: number): number =>
					rows[index]?.kind === "section" ? (props.estimatedSectionHeight ?? estimatedItemHeight) : estimatedItemHeight
				}
				getScrollElement={this.getDropdownContentElement}
				handleRef={this.setVirtualizerHandle}
				renderRow={(index: number, style: CSSProperties, measureRef: RefCallback<HTMLElement>): ReactNode => {
					const row = rows[index];

					if (row.kind === "section") {
						return (
							<DropDownSectionItem
								key={index}
								item={row.item}
								id={row.sectionId}
								measureElement={measureRef}
								virtualStyle={style}
							/>
						);
					}

					return (
						<DropDownItem
							key={index}
							item={row.item}
							flatIndex={row.flatIndex}
							selected={this.isItemSelected(row.item)}
							preselected={this.isItemPreselected(row.item, row.flatIndex)}
							onItemClick={this.handleItemClick}
							onMouseDown={props.onMouseDown}
							registerElement={this.registerItemElement}
							measureElement={measureRef}
							virtualStyle={style}
							// Positions state where the option sits among the options, which is what a windowed
							// list has to say for itself — the section headers are no part of that count.
							setSize={optionCount}
							posInSet={row.flatIndex + 1}
							className={extendedItemClassName}
							sectionId={row.sectionId}
							hideA11yLabel={props.hideA11yLabel}
							labelRenderer={props.labelRenderer}
						/>
					);
				}}
			/>
		);
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
		const contextValue = this.getContextValue(isTouch);
		const extendedItemClassName = contextValue.extended ? `${itemClassName}--extended` : undefined;
		const virtualized = this.isVirtualized();

		if (!props.hint && !props.links && props.items.length === 0) {
			return null;
		}

		// Running counter over the options as they are rendered; see the note at the increment below.
		let flatIndex = -1;

		return (
			<DropdownContextProvider value={contextValue}>
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
										preselected={index === this.getActiveLinkIndex()}
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
							aria-multiselectable={contextValue.multiple ? true : undefined}
							data-role={DataRoles.Dropdown.Content}
							$touch={isTouch}
							$horizontal={props.horizontal}
							$virtualized={virtualized}
						>
							{virtualized
								? this.renderVirtualizedItems(extendedItemClassName)
								: props.items.map((item, index) => {
										if (item.children) {
											return (
												<Fragment key={index}>
													<DropDownSectionItem key={index} item={item} id={item.id ?? `section-${index}`} />
													{item.children.map((subItem, subItemIndex) => {
														// Counted the same way the navigation model flattens `items`, so the index a
														// rendered option carries always addresses the same entry.
														flatIndex++;

														return (
															<DropDownItem
																key={subItemIndex}
																item={subItem}
																flatIndex={flatIndex}
																selected={this.isItemSelected(subItem)}
																preselected={this.isItemPreselected(subItem, flatIndex)}
																onItemClick={this.handleItemClick}
																onMouseDown={props.onMouseDown}
																registerElement={this.registerItemElement}
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
											flatIndex++;

											return (
												<DropDownItem
													key={index}
													item={item}
													flatIndex={flatIndex}
													selected={this.isItemSelected(item)}
													preselected={this.isItemPreselected(item, flatIndex)}
													onItemClick={this.handleItemClick}
													onMouseDown={props.onMouseDown}
													registerElement={this.registerItemElement}
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
