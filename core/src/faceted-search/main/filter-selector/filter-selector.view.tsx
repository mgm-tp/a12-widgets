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

import type { MouseEvent, ReactNode, ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import { Component, Fragment } from "react";
import { Key } from "ts-key-enum";

import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { ModalOverlay } from "../../../modal-overlay/main/modal-overlay.view.js";
import {
	bindMethods,
	getAllFocusableElements,
	getParentElement,
	joinClassNames,
	addPrefix,
	noop,
	inputWithSuffixName
} from "../../../common/main/utils.js";
import { provider as DeviceDetector } from "../../../common/main/device-detector.js";
import { DISTANCE_TO_SCREEN_BORDER } from "../../../common/main/alignment.js";
import { TabSandbox } from "../../../common/main/tab-sandbox.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { getFlattenedFilters, isSection } from "./filter-selector.internal.js";
import { FilterSelectorTemplate } from "./tpl/filter-selector.tpl.view.js";
import type { FilterSelectorProps } from "./filter-selector.api.js";
import { StyledFilterSelectorChildrenWrapper, StyledFilterSelectorItemCheckbox } from "./filter.selector.styled.js";

const baseClassName = addPrefix("filter-selector");
const { Section, List, Item, Content } = FilterSelectorTemplate;

export interface FilterSelectorState {
	show: boolean;
	searchParam: string;
	displayingFilter?: FilterSelectorProps.FilterData;
	flattenedFilters: FilterSelectorProps.FilterData[];
	wrapperHeight?: number;
}

export class FilterSelector extends Component<FilterSelectorProps, FilterSelectorState> {
	static displayName = "FilterSelector";
	static defaultProps = {
		closeOnEsc: true,
		hideSearchBar: false,
		activeFilters: [],
		inactiveFilters: []
	};

	private readonly filterRefs: Record<string, HTMLElement | null>;
	private secondaryRef: HTMLElement | null = null;
	private searchInputRef: HTMLElement | null = null;
	private wrapperRef: HTMLElement | null = null;

	constructor(props: FilterSelectorProps) {
		super(props);

		this.state = {
			show: true,
			searchParam: "",
			flattenedFilters: getFlattenedFilters(this.props.activeFilters, this.props.inactiveFilters)
		};

		this.filterRefs = {};

		bindMethods(this);
	}

	componentDidMount(): void {
		this.updateWrapperHeight();

		setTimeout(() => this.searchInputRef?.focus());
	}

	private handleClickEvent(event: MouseEvent<HTMLElement>): void {
		const target = event.target as HTMLElement;
		setTimeout(() => {
			if (target.attributes.getNamedItem("disabled")) {
				if (target.nextSibling) {
					(target.nextSibling as HTMLElement).focus();
				} else {
					if (this.wrapperRef) {
						const list = this.wrapperRef.querySelector<HTMLElement>(`[data-role=${DataRoles.Contentbox.Content}]`);

						if (list) {
							getAllFocusableElements(list).item(0).focus();
						}
					}
				}
			}
		});
	}

	componentDidUpdate(prevProps: FilterSelectorProps, prevState: FilterSelectorState): void {
		if (
			prevProps.activeFilters.length !== this.props.activeFilters.length ||
			prevProps.inactiveFilters.length !== this.props.inactiveFilters.length
		) {
			getFlattenedFilters(this.props.activeFilters, this.props.inactiveFilters);
		}

		if (this.state.searchParam !== prevState.searchParam && this.props.onSearchChange) {
			this.props.onSearchChange(this.state.searchParam);
		}

		if (this.state.show !== prevState.show && this.props.onVisibilityChange) {
			this.props.onVisibilityChange(this.state.show);
		}
	}

	render(): ReactNode {
		const {
			id,
			className,
			referenceElement,
			primaryContentProps,
			footerContent,
			disabled,
			hideSearchBar,
			onVisibilityChange,
			renderFilterView
		} = this.props;

		if (!this.state.show) {
			return null;
		}

		const secondaryContent = renderFilterView?.(this.state.displayingFilter && this.state.displayingFilter.id);
		const filterSelectorTemplate = (
			<FilterSelectorTemplate
				onClick={this.handleClickEvent}
				className={className}
				id={id}
				style={{
					...this.props.style,
					height: this.state.wrapperHeight,
					marginBottom: DeviceDetector.hasTouch() ? "" : DISTANCE_TO_SCREEN_BORDER
				}}
				primaryContent={this.renderPrimaryContent()}
				primaryHeaderAriaLabelledby={primaryContentProps?.ariaLabelledby}
				secondaryContent={secondaryContent}
				footerContent={footerContent}
				secondaryRef={this.getSecondaryWrapperRef}
				wrapperRef={this.getWrapperRef}
				onKeyDown={this.handleOnKeyDown}
			/>
		);

		return DeviceDetector.hasTouch() ? (
			<ModalOverlay closeOnOutsideClick closeOnEsc={false} onClose={() => onVisibilityChange?.(false)}>
				{filterSelectorTemplate}
			</ModalOverlay>
		) : (
			<AttachedPortal
				orientationList={["bottom-start", "bottom-end", "top-start", "top-end", "left", "right"]}
				fixedOrientation
				referenceElement={referenceElement}
				closeOnOutsideClick
				onVisibilityChange={onVisibilityChange}
				adjustPositionToScreen
				closeOnEsc={false}
				closeOnClickReferenceElement={false}
				focusOnOpen={disabled ? false : hideSearchBar}
				onSizeChange={this.updateWrapperHeight}
			>
				<TabSandbox focusOnOpen={false} skipWrapperFocus focusBack>
					{filterSelectorTemplate}
				</TabSandbox>
			</AttachedPortal>
		);
	}

	private renderPrimaryContent(): ReactNode {
		const { ariaLabelledby, children, ...primaryContentProps } = this.props.primaryContentProps;

		return (
			<Content
				{...primaryContentProps}
				subActionBar={
					(!this.props.hideSearchBar || this.props.actionElement) && (
						<ContentBoxElements.SubActionBar>
							{!this.props.hideSearchBar ? (
								<FilterSelectorTemplate.ActionBar>
									<FilterSelectorTemplate.SearchInput
										inputRef={this.getSearchInputRef}
										placeholder={this.props.inputPlaceholder}
										disabled={this.props.disabled}
										onClearButtonClick={this.handleClearSearchParam}
										value={this.state.searchParam}
										onChange={this.handleSearchChange}
										label={this.props.inputHiddenLabel}
										hideLabel
										id={inputWithSuffixName(this.props.id)}
										inputProps={this.props.inputProps}
									/>
								</FilterSelectorTemplate.ActionBar>
							) : undefined}
							{this.props.actionElement && (
								<FilterSelectorTemplate.ActionBar>{this.props.actionElement}</FilterSelectorTemplate.ActionBar>
							)}
						</ContentBoxElements.SubActionBar>
					)
				}
				padding={false}
			>
				{children ? (
					<StyledFilterSelectorChildrenWrapper
						className={`${baseClassName}__children-wrapper`}
						onMouseDown={(e) => e.preventDefault()}
						tabIndex={0}
					>
						{children}
					</StyledFilterSelectorChildrenWrapper>
				) : (
					<List>{this.renderFilterList()}</List>
				)}
			</Content>
		);
	}

	private getSecondaryWrapperRef(ref: HTMLElement | null): void {
		this.secondaryRef = ref;
	}

	private getWrapperRef(ref: HTMLElement | null): void {
		this.wrapperRef = ref;
	}

	private renderFilterList(): ReactNode {
		return (
			<>
				{this.props.activeFilters.map((filter, i) => {
					return this.renderFilter(
						filter,
						i + 1 === this.props.activeFilters.length &&
							i + 1 !== this.props.activeFilters.length + this.props.inactiveFilters.length
					);
				})}
				{this.props.inactiveFilters.map((filter) => {
					if (isSection(filter)) {
						return filter.filters.length > 0 ? this.renderSection(filter) : null;
					}

					return this.renderFilter(filter);
				})}
			</>
		);
	}

	private renderSection(section: FilterSelectorProps.SectionData): ReactNode {
		return (
			<Fragment key={section.label}>
				<Section id={section.id}>{section.label}</Section>
				{section.filters.map((filter) => this.renderFilter(filter))}
			</Fragment>
		);
	}

	private renderFilter(filter: FilterSelectorProps.FilterData, lastSelectedDivider?: boolean): ReactNode {
		const currentFilter = this.state.displayingFilter;

		return (
			<FilterSelector.FilterItem
				key={filter.id}
				filter={filter}
				meta={filter.meta}
				disabled={this.props.disabled}
				current={!!currentFilter && filter.id === currentFilter.id}
				graphicRef={this.getFilterRefs}
				onClick={this.handleOnFilterClick}
				onToggle={this.handleOnFilterToggle}
				onFocus={this.handleOnCheckboxFocus}
				secondaryText={this.props.renderFilterOptions?.(filter)}
				lastSelectedDivider={lastSelectedDivider}
			/>
		);
	}

	private handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
		this.setState({
			searchParam: event.target.value
		});
	}

	private handleClearSearchParam(): void {
		this.setState(
			{
				searchParam: ""
			},
			() => {
				if (this.searchInputRef) {
					this.searchInputRef.focus();
				}
			}
		);
	}

	private getSearchInputRef(ref: HTMLElement | null): void {
		this.searchInputRef = ref;
	}

	private getFilterRefs(id: string, ref: HTMLElement | null): void {
		this.filterRefs[id] = ref;
	}

	private handleOnKeyDown(event: KeyboardEvent<HTMLElement>): void {
		if (this.props.disabled) {
			return;
		}

		switch (event.key) {
			case Key.Enter:
				this.handleEnter(event);
				break;
			case Key.Escape:
				this.handleEscape(event);
				break;
			case " ":
				this.handleSpace(event);
				break;
			default:
				return;
		}
	}

	private handleEnter(event: KeyboardEvent<HTMLElement>): void {
		const focusedFilter = this.findFilterByRef(event.target as Element);

		if (focusedFilter) {
			event.preventDefault();
			this.focusToSecondaryView(focusedFilter.id);
		}
	}

	private handleSpace(event: KeyboardEvent<HTMLElement>): void {
		const focusedFilter = document.activeElement ? this.findFilterByRef(document.activeElement) : undefined;

		if (focusedFilter) {
			event.preventDefault();

			if (focusedFilter.nonRemovable) {
				return;
			}

			this.handleOnFilterToggle(focusedFilter.id);
		}
	}

	private handleEscape(event: KeyboardEvent<HTMLElement>): void {
		if (this.secondaryRef && this.secondaryRef.contains(event.target as Element)) {
			this.focusToCurrentFilter();

			if (this.props.onPrimaryViewFocusChange) {
				this.props.onPrimaryViewFocusChange(true);
			}
		} else if (this.wrapperRef && this.wrapperRef.contains(event.target as Element) && this.props.closeOnEsc) {
			this.setState({ show: false });
		}
	}

	private findFilterByRef(ref: Element): FilterSelectorProps.FilterData | undefined {
		return this.state.flattenedFilters.find((filter) => {
			const filterRef = this.filterRefs[filter.id] as Element;

			return filterRef && ref.contains(filterRef);
		});
	}

	private focusToCurrentFilter(): void {
		const currentFilter = this.state.displayingFilter;

		if (currentFilter) {
			const filterRef = this.filterRefs[currentFilter.id];

			if (filterRef) {
				getParentElement(filterRef, (parent) => parent.classList.contains(addPrefix("list-item__content")))?.focus();
			}
		}
	}

	private focusToSecondaryView(filterId: string): void {
		this.setDisplayingFilter(filterId, () => {
			if (this.secondaryRef) {
				const focusableSecondaryElement = getAllFocusableElements(this.secondaryRef);

				if (focusableSecondaryElement.length) {
					focusableSecondaryElement.item(0).focus();
				}
			}
		});

		this.props.onPrimaryViewFocusChange?.(false);
	}

	private handleOnFilterClick(id: string, event?: MouseEvent<HTMLElement>): void {
		this.setDisplayingFilter(id, () => {
			if (this.props.onPrimaryViewFocusChange) {
				this.props.onPrimaryViewFocusChange(false);
			}

			if (this.props.onFilterClick) {
				this.props.onFilterClick(id, event);
			}

			this.focusToSecondaryView(id);
		});
	}

	private handleOnFilterToggle(id: string): void {
		this.setDisplayingFilter(id, () => {
			if (this.props.onPrimaryViewFocusChange) {
				this.props.onPrimaryViewFocusChange(false);
			}

			if (this.props.onFilterToggle) {
				this.props.onFilterToggle(id);
			} else if (this.props.onFilterClick) {
				this.props.onFilterClick(id);
			}

			this.focusToSecondaryView(id);
		});
	}

	// With NVDA, the checkbox in graphic is focused when pressing Enter the filter item, fire click event to open the filter options
	private handleOnCheckboxFocus(id: string, event?: FocusEvent<HTMLElement>): void {
		this.handleOnFilterClick(id, event as any);
	}

	private setDisplayingFilter(id: string, done?: () => void): void {
		this.setState({ displayingFilter: this.state.flattenedFilters.find((filter) => filter.id === id) }, done);
	}

	private updateWrapperHeight(): void {
		if (this.wrapperRef && this.wrapperRef.clientHeight !== this.state.wrapperHeight) {
			this.setState({
				wrapperHeight: this.wrapperRef.clientHeight
			});
		}
	}
}

export namespace FilterSelector {
	export interface FilterItemState {
		isGraphicHovered: boolean;
	}

	export class FilterItem extends Component<FilterSelectorProps.FilterItemProps, FilterItemState> {
		static displayName = "FilterItem";
		static defaultProps = {
			current: false
		};

		private checkboxInputRef: HTMLInputElement | null = null;

		constructor(props: FilterSelectorProps.FilterItemProps) {
			super(props);
			this.state = {
				isGraphicHovered: false
			};

			bindMethods(this);
		}

		componentDidMount(): void {
			// Trick for screen readers
			// Problem: When press ENTER the filter item, NVDA expects to focus on the checkbox input and triggers event
			//          to open filter options but cannot because the checkbox input is disabled.
			// Solve: Enable the disabled checkbox input so that NVDA can focus and trigger event.
			if (this.checkboxInputRef?.disabled) {
				this.checkboxInputRef.disabled = false;
			}
		}

		render(): ReactNode {
			const { filter } = this.props;
			const unavailableCheckbox = this.props.disabled || filter.nonRemovable;

			return (
				<Item
					expanded={this.props.expanded}
					id={filter.id}
					style={this.props.style}
					className={joinClassNames(
						{ [addPrefix("list-item--no-hover")]: this.state.isGraphicHovered && !this.props.disabled },
						this.props.className
					)}
					graphic={
						<StyledFilterSelectorItemCheckbox
							tabIndex={-1}
							className={
								this.state.isGraphicHovered && !this.props.disabled && !filter.nonRemovable
									? addPrefix("field--hover")
									: ""
							}
							checked={!!filter.active}
							disabled={unavailableCheckbox}
							onChange={noop}
							onFocus={this.onCheckboxFocus}
							inputRef={this.getGraphicRef}
							fitToParent={false}
							id={`${filter.id}-graphic`}
							label={filter.label}
							hideLabel
							inputProps={{
								"aria-disabled": unavailableCheckbox // to make NVDA reads "unavailable"
							}}
							graphicHovered={this.state.isGraphicHovered && !this.props.disabled && !filter.nonRemovable}
						/>
					}
					onClick={this.onClick}
					active={this.props.current}
					disabled={this.props.disabled}
					wrapperRef={this.getWrapperRef}
					onMouseOver={this.onMouseOver}
					graphicWrapperProps={{
						onClick: this.props.disabled ? undefined : this.onGraphicClick,
						onMouseOver: this.onGraphicMouseOver,
						onMouseOut: this.onGraphicMouseOut
					}}
					meta={this.props.meta}
					secondaryText={this.props.mobile && this.props.secondaryText}
					selected={!!filter.active}
					lastSelectedDivider={this.props.lastSelectedDivider}
				>
					<span>{filter.label}</span>
				</Item>
			);
		}

		private getWrapperRef(ref: HTMLElement | null): void {
			this.props.wrapperRef?.(this.props.filter.id, ref);
		}

		private getGraphicRef(ref: HTMLInputElement | null): void {
			this.checkboxInputRef = ref;
			this.props.graphicRef?.(this.props.filter.id, ref);
		}

		private onClick(event: MouseEvent<HTMLElement>): void {
			// Avoid display the secondary content when pressed SPACE
			if (!this.isCheckBoxEvent(event)) {
				this.props.onClick?.(this.props.filter.id, event);
			}
		}

		private onMouseOver(event: MouseEvent<HTMLElement>): void {
			this.props.onMouseOver?.(this.props.filter.id, event);
		}

		private onCheckboxFocus(event: FocusEvent<HTMLElement>): void {
			this.props.onFocus?.(this.props.filter.id, event);
		}

		private onGraphicClick(event: MouseEvent<HTMLElement>): void {
			// NVDA - prevent pressing enter to trigger graphic click
			if (this.isCheckBoxEvent(event) || this.props.filter.nonRemovable) {
				// Avoid display the secondary content when pressed SPACE
				return;
			}

			event.stopPropagation();
			event.preventDefault();

			this.props.onToggle?.(this.props.filter.id);
		}

		private onGraphicMouseOver(): void {
			if (!this.state.isGraphicHovered) {
				this.setState({
					isGraphicHovered: true
				});
			}
		}

		private onGraphicMouseOut(): void {
			if (this.state.isGraphicHovered) {
				this.setState({
					isGraphicHovered: false
				});
			}
		}

		private isCheckBoxEvent(event: MouseEvent<HTMLElement>): boolean {
			return (
				event.target instanceof HTMLInputElement && event.target.getAttribute("data-role") === DataRoles.Checkbox.Input
			);
		}
	}
}
