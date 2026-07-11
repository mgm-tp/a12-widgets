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

import type { ContextType, ReactNode, ChangeEvent, MouseEvent, KeyboardEvent, ReactElement } from "react";
import { createRef, Component, useContext, useRef, useMemo, useCallback, Fragment } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { ContentBoxElements } from "../../../contentbox/main/template/contentbox.tpl.view.js";
import { SubActionBarTpl } from "../../../contentbox/main/template/sub-action-bar.tpl.view.js";
import { Icon } from "../../../icon/main/icon.view.js";
import { ModalOverlay } from "../../../modal-overlay/main/modal-overlay.view.js";
import {
	bindMethods,
	getAllFocusableElements,
	addPrefix,
	joinClassNames,
	inputWithSuffixName
} from "../../../common/main/utils.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { WidgetsResizeDetector } from "../../../common/main/widgets-resize-detector/widgets-resize-detector.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { FilterSelectorMobileProps } from "./filter-selector.mobile.api.js";
import type { FilterSelectorProps } from "./filter-selector.api.js";
import { FilterSelectorTemplate } from "./tpl/filter-selector.tpl.view.js";
import { getFlattenedFilters, isSection, isSectionElement } from "./filter-selector.internal.js";
import {
	StyledFilterSelectorChildrenWrapper,
	StyledFilterSelectorContent,
	StyledFilterSelectorExpandButton,
	StyledFilterSelectorTemplateWrapper
} from "./filter.selector.styled.js";
import { StyledMobileFilterSelectorTemplate, StyledMobileFilterSelectorItem } from "./filter.selector.mobile.styled.js";

const baseClassName = addPrefix("filter-selector");
const { Section, List, Content } = FilterSelectorTemplate;

interface FilterSelectorMobileState {
	searchParam: string;
}

export class FilterSelectorMobile extends Component<FilterSelectorMobileProps, FilterSelectorMobileState> {
	static displayName = "FilterSelectorMobile";
	declare context: ContextType<typeof A11YLanguageContext>;
	private filterListRef: HTMLElement | null = null;
	private primaryContentRef: HTMLElement | null = null;
	private secondaryContentRef: HTMLElement | null = null;
	private readonly filterRefs: Record<string, HTMLElement | null> = {};
	private secondaryContentHeight = 0;
	private wrapperRef = createRef<HTMLDivElement>();

	constructor(props: FilterSelectorMobileProps) {
		super(props);

		this.state = {
			searchParam: ""
		};

		bindMethods(this);
	}

	private getCurrentFilterAndFlattenedFilters(): {
		flattenedFilters: FilterSelectorProps.FilterData[];
		currentFilter?: FilterSelectorProps.FilterData;
	} {
		const flattenedFilters = getFlattenedFilters(this.props.activeFilters, this.props.inactiveFilters);

		return {
			flattenedFilters,
			currentFilter: this.props.currentFilterId
				? flattenedFilters.find((item) => item.id === this.props.currentFilterId)
				: undefined
		};
	}

	private getPrimaryContentRef(ref: HTMLElement | null): void {
		this.primaryContentRef = ref;
	}

	private getSecondaryContentRef(ref: HTMLElement | null): void {
		if (ref) {
			this.secondaryContentHeight = ref.clientHeight;
		}

		this.secondaryContentRef = ref;
	}

	private getFilterListRef(ref: HTMLElement | null): void {
		this.filterListRef = ref;
	}

	private getFilterItemRefs(id: string, ref: HTMLElement | null): void {
		this.filterRefs[id] = ref;
	}

	private renderPrimaryContent(): ReactNode {
		return (
			<Content
				{...this.props.primaryContentProps}
				contentRef={this.getPrimaryContentRef}
				headingButtons={
					this.props.primaryContentProps.headingButtons || (
						<A11YLanguageContext.Provider
							value={{
								...this.context,
								contentboxTitles: {
									...this.context.contentboxTitles,
									closeButtonTitle: this.context.filterSelectorTitles?.closeFilterMobile
								}
							}}
						>
							<ContentBoxElements.CloseButton onClick={this.props.onClose} />
						</A11YLanguageContext.Provider>
					)
				}
				subActionBar={
					<>
						<SubActionBarTpl hidden={this.props.hideSearchBar}>
							<FilterSelectorTemplate.SearchInput
								placeholder={this.props.inputPlaceholder}
								disabled={this.props.disabled}
								value={this.state.searchParam}
								onChange={this.handleSearchChange}
								onClearButtonClick={this.handleClearSearchParam}
								label={this.props.inputHiddenLabel}
								hideLabel
								id={inputWithSuffixName(this.props.id)}
								inputProps={this.props.inputProps}
							/>
						</SubActionBarTpl>
						{this.props.actionElement && (
							<ContentBoxElements.SubActionBar>
								<FilterSelectorTemplate.ActionBar>{this.props.actionElement}</FilterSelectorTemplate.ActionBar>
							</ContentBoxElements.SubActionBar>
						)}
					</>
				}
				padding={false}
			>
				{this.props.primaryContentProps.children ? (
					<StyledFilterSelectorChildrenWrapper className={`${baseClassName}__children-wrapper`}>
						{this.props.primaryContentProps.children}
					</StyledFilterSelectorChildrenWrapper>
				) : (
					<List wrapperRef={this.getFilterListRef}>{this.renderFilterList()}</List>
				)}
			</Content>
		);
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
		const filtersContent = section.filters.map((filter) => this.renderFilter(filter)).filter(Boolean);

		return (
			filtersContent &&
			filtersContent.length > 0 && (
				<Fragment key={section.label}>
					<Section id={section.id}>{section.label}</Section>
					{filtersContent}
				</Fragment>
			)
		);
	}

	private renderFilter(filterToRender: FilterSelectorProps.FilterData, lastSelectedDivider?: boolean): ReactNode {
		const { currentFilter, flattenedFilters } = this.getCurrentFilterAndFlattenedFilters();
		const currentFilterIndex = currentFilter
			? flattenedFilters.findIndex((filter) => filter.id === currentFilter.id)
			: -1;
		const filterIndex = flattenedFilters.findIndex((item) => item.id === filterToRender.id);
		const secondaryView = this.props.currentFilterId && this.props.renderFilterView?.(this.props.currentFilterId);

		if (!secondaryView || filterIndex >= currentFilterIndex) {
			return (
				<FilterSelectorMobile.FilterItem
					key={filterToRender.id}
					filter={filterToRender}
					meta={filterToRender.meta}
					disabled={this.props.disabled}
					current={!!currentFilter && filterToRender.id === currentFilter.id}
					onClick={this.props.onFilterClick}
					onToggle={this.props.onFilterToggle}
					secondaryContent={currentFilterIndex === filterIndex && secondaryView}
					secondaryWrapperRef={this.getSecondaryContentRef}
					wrapperRef={this.getFilterItemRefs}
					secondaryText={this.props.renderFilterOptions?.(filterToRender)}
					lastSelectedDivider={lastSelectedDivider}
				/>
			);
		}

		return null;
	}

	private handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
		this.setState({
			searchParam: event.target.value
		});
	}

	private handleClearSearchParam(): void {
		this.setState({ searchParam: "" });
	}

	private computeSecondaryMaxHeight(): number {
		const { currentFilter } = this.getCurrentFilterAndFlattenedFilters();

		if (this.primaryContentRef && this.secondaryContentRef && currentFilter) {
			const currentFilterRef = this.filterRefs[currentFilter.id];
			let filtersHeight = 0;

			if (currentFilterRef) {
				filtersHeight = currentFilterRef.clientHeight;
				const prevElement = currentFilterRef.previousSibling;
				const nextElement = this.secondaryContentRef.nextSibling;

				if (prevElement) {
					filtersHeight += (prevElement as HTMLElement).clientHeight;
				}

				if (nextElement) {
					filtersHeight += (nextElement as HTMLElement).clientHeight;

					if (isSectionElement(nextElement as HTMLElement)) {
						const nextFilter = nextElement.nextSibling;
						filtersHeight += nextFilter ? (nextFilter as HTMLElement).clientHeight : 0;
					}
				}
			}

			return Math.round(this.primaryContentRef.clientHeight - filtersHeight);
		}

		return 0;
	}

	private setMaxHeightForSecondaryContent(): void {
		const nextSecondaryMaxHeight = this.computeSecondaryMaxHeight();
		const secondaryView = this.props.currentFilterId && this.props.renderFilterView?.(this.props.currentFilterId);

		if (!this.secondaryContentRef) {
			return;
		}

		const isNextHeightSmaller = nextSecondaryMaxHeight < this.secondaryContentHeight;

		if (this.filterListRef) {
			this.filterListRef.style.overflowY = isNextHeightSmaller ? "hidden" : "auto";
		}

		if (!secondaryView) {
			this.secondaryContentRef.style.height = `${this.secondaryContentHeight}px`;

			return;
		}

		if (
			!this.secondaryContentRef.style.maxHeight &&
			parseInt(this.secondaryContentRef.style.maxHeight, 10) !== nextSecondaryMaxHeight
		) {
			this.secondaryContentRef.style.overflowY = isNextHeightSmaller ? "auto" : "hidden";
			this.secondaryContentRef.style.maxHeight = !isNextHeightSmaller
				? `${nextSecondaryMaxHeight}px`
				: `${this.secondaryContentHeight}px`;
			setTimeout(() => {
				if (this.secondaryContentRef && this.secondaryContentHeight !== nextSecondaryMaxHeight) {
					this.secondaryContentRef.style.maxHeight = `${nextSecondaryMaxHeight}px`;
				}
			});
		}
	}

	private handlePrimaryViewResize(): void {
		this.setMaxHeightForSecondaryContent();

		setTimeout(() => {
			const { currentFilter } = this.getCurrentFilterAndFlattenedFilters();
			const currentFilterRef = currentFilter && this.filterRefs[currentFilter.id];
			currentFilterRef?.scrollIntoView({ behavior: "smooth" });
		});
	}

	private handleClickEvent(event: MouseEvent<HTMLElement>): void {
		const target = event.target as HTMLElement;

		setTimeout(() => {
			if (target.attributes.getNamedItem("disabled")) {
				if (target.nextSibling) {
					(target.nextSibling as HTMLElement).focus();
				} else {
					if (this.primaryContentRef) {
						const list = this.primaryContentRef.querySelector<HTMLElement>(
							`[data-role="${DataRoles.Contentbox.Content}"]`
						);

						if (list) {
							getAllFocusableElements(list).item(0).focus();
						}
					}
				}
			}
		});
	}

	private handleKeyDownEvent(event: KeyboardEvent<HTMLElement>): void {
		if (event.key !== "Enter") {
			return;
		}

		this.handleClickEvent(event as any);
	}

	componentDidMount(): void {
		this.setMaxHeightForSecondaryContent();
	}

	componentDidUpdate(prevProps: FilterSelectorMobileProps, prevState: FilterSelectorMobileState): void {
		if (this.state.searchParam !== prevState.searchParam && this.props.onSearchChange) {
			this.props.onSearchChange(this.state.searchParam);
		}

		this.setMaxHeightForSecondaryContent();

		const secondaryView = this.props.currentFilterId && this.props.renderFilterView?.(this.props.currentFilterId);

		if (!secondaryView && this.filterListRef) {
			this.filterListRef.style.overflow = "auto";
		}
	}

	render(): ReactNode {
		const classNames = joinClassNames(`${baseClassName}--mobile`, this.props.className);

		return (
			<ModalOverlay fullscreen noGutter>
				<WidgetsResizeDetector handleWidth={false} onResize={this.handlePrimaryViewResize} targetRef={this.wrapperRef}>
					<StyledFilterSelectorTemplateWrapper
						className={`${addPrefix("-u-width-full -u-height-full")}`}
						onClick={this.handleClickEvent}
						onKeyDown={this.handleKeyDownEvent}
						ref={this.wrapperRef}
					>
						<StyledMobileFilterSelectorTemplate
							className={classNames}
							id={this.props.id}
							style={this.props.style}
							primaryContent={this.renderPrimaryContent()}
							primaryHeaderAriaLabelledby={this.props.primaryContentProps?.ariaLabelledby}
							footerContent={this.props.footerContent}
						/>
					</StyledFilterSelectorTemplateWrapper>
				</WidgetsResizeDetector>
			</ModalOverlay>
		);
	}
}

FilterSelectorMobile.contextType = A11YLanguageContext;

export namespace FilterSelectorMobile {
	interface FilterItemMobileInternalProps {
		secondaryText?: ReactNode;
	}

	export function FilterItem(
		props: FilterSelectorMobileProps.FilterItemMobileProps & FilterItemMobileInternalProps
	): ReactElement<FilterSelectorMobileProps.FilterItemMobileProps> {
		const { secondaryWrapperRef, secondaryContent, current, meta, ...rest } = props;
		const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
		const openOptionsTitle = languageContext.filterSelectorTitles;
		const nodeRef = useRef<HTMLLIElement | null>(null);

		const renderingMeta = useMemo(
			() => (
				<>
					{meta}
					<StyledFilterSelectorExpandButton
						onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
							if (event.key === "Enter") {
								event.stopPropagation();
							}
						}}
						className={`${baseClassName}__expand-button`}
						icon={<Icon size="big">expand_more</Icon>}
						title={
							openOptionsTitle &&
							(secondaryContent && current
								? openOptionsTitle.closeFilterOptionsMobile
								: openOptionsTitle.openFilterOptionsMobile)
						}
						buttonAttributes={{ "aria-expanded": !!secondaryContent && current }}
					/>
				</>
			),
			[openOptionsTitle, meta, secondaryContent, current]
		);

		const getSecondaryRef = useCallback(
			(ref: HTMLLIElement | null) => {
				nodeRef.current = ref;
				secondaryWrapperRef?.(ref);
			},
			[secondaryWrapperRef]
		);

		return (
			<>
				<StyledMobileFilterSelectorItem
					{...rest}
					current={current}
					meta={renderingMeta}
					mobile
					className={props.secondaryContent && props.current ? addPrefix("list-item--expanded") : undefined}
					lastSelectedDivider={props.lastSelectedDivider && !(props.secondaryContent && props.current)}
					$active={props.active}
					$expanded={!!(props.secondaryContent && props.current)}
				/>
				<TransitionGroup component={null}>
					{props.secondaryContent && props.current && (
						<CSSTransition
							classNames={{
								enter: `${baseClassName}__content-enter`,
								exitActive: `${baseClassName}__content-exit`
							}}
							timeout={500}
							nodeRef={nodeRef}
						>
							<StyledFilterSelectorContent
								contentType="secondary"
								as="li"
								className={`${baseClassName}__content--secondary`}
								ref={getSecondaryRef}
								data-role={DataRoles.FilterSelector.Content.Secondary}
								isMobileSecondary
							>
								{props.secondaryContent}
							</StyledFilterSelectorContent>
						</CSSTransition>
					)}
				</TransitionGroup>
			</>
		);
	}
}
