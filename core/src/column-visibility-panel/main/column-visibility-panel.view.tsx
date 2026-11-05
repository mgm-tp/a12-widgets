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

import type { ChangeEvent, FC, FocusEvent, KeyboardEvent, ReactNode } from "react";
import { useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { Key } from "ts-key-enum";

import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { Button } from "../../button/main/button.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import type { Orientation } from "../../common/main/alignment.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import { getAllFocusableElements } from "../../common/main/utils.js";
import { ContentBox, ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";
import type { DropDownItem } from "../../dropdown/main/template/dropdown.tpl.api.js";
import { DropDown } from "../../dropdown/main/template/dropdown.tpl.view.js";
import { useDropdownNavigation } from "../../dropdown/main/template/use-dropdown-navigation.js";
import { Icon } from "../../icon/main/icon.view.js";
import { TextField } from "../../input/text-field/main/template/text-field.tpl.view.js";
import { useWindowSize } from "../../layout/size-detector/main/size-detector.view.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";

import type {
	ColumnVisibilityItem,
	ColumnVisibilityPanelCloseReason,
	ColumnVisibilityPanelProps
} from "./column-visibility-panel.api.js";
import { StyledColumnVisibilityNoResults, StyledColumnVisibilityPanel } from "./column-visibility-panel.styled.js";
import {
	filterColumnVisibilityItems,
	getColumnSearchText,
	getColumnVisibility,
	getDefaultColumnVisibility,
	hasColumnVisibilityDeviation,
	hasHiddenColumns
} from "./column-visibility-panel.utils.js";

const DEFAULT_ORIENTATIONS: Orientation[] = ["bottom-end", "bottom-start", "top-end", "top-start"];

/** Identifies an option by the column it stands for, so that equal column names stay apart. */
function getItemKey(option: DropDownItem<ColumnVisibilityItem>): string {
	return option.data?.id ?? "";
}

/** The column's own label, which may be an element the plain-text option name cannot carry. */
function renderColumnLabel(option: DropDownItem<ColumnVisibilityItem>): ReactNode {
	return option.data?.label ?? option.label;
}

/** The trigger element behind either shape the panel accepts, `null` while a reference is empty. */
function resolveTrigger(triggerElement: ColumnVisibilityPanelProps["triggerElement"]): HTMLElement | null {
	if (triggerElement && "current" in triggerElement) {
		return triggerElement.current;
	}

	return triggerElement ?? null;
}

/**
 * Lists a table's columns as checkboxes so that the end user can hide and show them. The panel is
 * controlled: the visibility and the open state stay with the consumer. See
 * {@link ColumnVisibilityPanelProps}.
 */
export const ColumnVisibilityPanel: FC<ColumnVisibilityPanelProps> = ({
	items,
	open = true,
	triggerElement,
	title,
	ariaLabel,
	ariaLevel = 2,
	disabled,
	resetLabel,
	resetDisabled,
	hideReset,
	showAll,
	showAllLabel,
	searchable,
	searchPlaceholder,
	noResultsText,
	closeButtonTitle,
	presentation = "auto",
	orientationList = DEFAULT_ORIENTATIONS,
	closeOnEsc = true,
	closeOnOutsideClick = true,
	closeOnTabOut = false,
	focusOnOpen = true,
	id,
	className,
	style,
	dataRole,
	wrapperRef,
	onVisibilityChange,
	onReset,
	onSearchChange,
	onClose
}) => {
	const { columnVisibilityPanelTitles } = useContext(A11YLanguageContext);
	const theme = useTheme();
	const { breakPoint } = useWindowSize();
	const generatedId = useId();
	const panelRef = useRef<HTMLDivElement | null>(null);
	const searchInputRef = useRef<HTMLInputElement | null>(null);
	const closeReason = useRef<ColumnVisibilityPanelCloseReason | undefined>(undefined);
	const [searchTerm, setSearchTerm] = useState("");

	// A reference is filled in during the trigger's own commit, so it is read again after mounting.
	const [trigger, setTrigger] = useState<HTMLElement | null>(() => resolveTrigger(triggerElement));

	useLayoutEffect(() => {
		// Before paint, so a panel mounted with its trigger does not flash the other presentation.
		setTrigger(resolveTrigger(triggerElement));
	}, [triggerElement]);

	// Only below the panel's own width, where an attached panel would cover what it is filtering.
	const isSmallScreen = breakPoint.size === "xs";
	const prefersModal =
		presentation === "modal" || (presentation === "auto" && (isSmallScreen || DeviceDetector.hasTouch()));
	// Without a trigger to attach to, the modal is the only presentation left.
	const isModal = prefersModal || (presentation === "auto" && !trigger);
	const titleId = `${id ?? generatedId}-title`;
	// What the user can see, and therefore what the show-all action applies to.
	const listedItems = useMemo(
		() => (searchable ? filterColumnVisibilityItems(items, searchTerm) : items),
		[items, searchable, searchTerm]
	);

	const options = useMemo<DropDownItem<ColumnVisibilityItem>[]>(
		() =>
			listedItems.map((item) => ({
				id: item.id,
				// The name the option is announced by, which a label that is an element cannot supply.
				label: getColumnSearchText(item),
				hideLabel: item.label === undefined,
				graphic: item.icon,
				selected: item.visible,
				disabled: disabled || item.disabled,
				title: item.label ? undefined : item.title,
				tabIndex: 0,
				data: item
			})),
		[disabled, listedItems]
	);

	// Keeps the active option in step with the focus, so both ways of walking the rows agree.
	const navigation = useDropdownNavigation<ColumnVisibilityItem>({ items: options, getItemKey });

	// The search field takes the focus over the dialog itself, unless it is disabled. Without one the
	// panel element keeps it, which holds TAB inside the dialog.
	const focusSearchOnOpen = !!(focusOnOpen && searchable && open && !disabled);

	useEffect(() => {
		if (!focusSearchOnOpen) {
			return undefined;
		}

		// The portal re-parents its content after mounting, which drops the focus, so it is taken afterwards.
		const timeout = setTimeout((): void => {
			searchInputRef.current?.focus();
		});

		return (): void => clearTimeout(timeout);
	}, [focusSearchOnOpen]);

	const handleRef = useCallback(
		(ref: HTMLDivElement | null): void => {
			panelRef.current = ref;
			wrapperRef?.(ref);
		},
		[wrapperRef]
	);

	const requestClose = useCallback(
		(reason: ColumnVisibilityPanelCloseReason): void => {
			closeReason.current = undefined;
			onClose?.(reason);
		},
		[onClose]
	);

	/** The surfaces report that they closed, but not why — {@link closeReason} remembers it. */
	const handleSurfaceClose = useCallback((): void => {
		requestClose(closeReason.current ?? "onOutsideClick");
	}, [requestClose]);

	const handlePortalVisibilityChange = useCallback(
		(visible: boolean): void => {
			if (!visible) {
				handleSurfaceClose();
			}
		},
		[handleSurfaceClose]
	);

	const handleRowFocus = useCallback(
		(event: FocusEvent<HTMLElement>): void => {
			// A row reached with TAB has to become the active option, or the first ARROW press would not move.
			const focusedId = (event.target as HTMLElement).id;
			const option = options.find((candidate) => candidate.id === focusedId);

			if (option) {
				navigation.setActiveItem(option);

				return;
			}

			// The focus left the list, so the active option's highlight must not stay behind on its row.
			navigation.reset();
		},
		[navigation, options]
	);

	const handleSelectionChange = useCallback(
		(
			selectedOptions: DropDownItem<ColumnVisibilityItem>[],
			toggledOption: DropDownItem<ColumnVisibilityItem>
		): void => {
			const column = toggledOption.data;

			if (!column) {
				return;
			}

			const visible = selectedOptions.some((option) => option.data?.id === column.id);
			const visibility = getColumnVisibility(items);

			visibility[column.id] = visible;
			onVisibilityChange(visibility, { id: column.id, visible });
		},
		[items, onVisibilityChange]
	);

	const handleReset = useCallback((): void => {
		const defaultVisibility = getDefaultColumnVisibility(items);

		onVisibilityChange(defaultVisibility);
		onReset?.(defaultVisibility);
	}, [items, onReset, onVisibilityChange]);

	const handleShowAll = useCallback((): void => {
		const visibility = getColumnVisibility(items);

		for (const item of listedItems) {
			if (!item.disabled) {
				visibility[item.id] = true;
			}
		}

		onVisibilityChange(visibility);
	}, [items, listedItems, onVisibilityChange]);

	const handleSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			setSearchTerm(event.target.value);
			onSearchChange?.(event.target.value);
		},
		[onSearchChange]
	);

	const handleClearSearch = useCallback((): void => {
		setSearchTerm("");
		onSearchChange?.("");
		searchInputRef.current?.focus();
	}, [onSearchChange]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>): void => {
			if (event.key === Key.Escape && closeOnEsc) {
				// The surrounding portal or overlay performs the close, this only names the reason.
				closeReason.current = "onEscape";

				return;
			}

			if (event.key !== Key.Tab || !panelRef.current) {
				return;
			}

			const focusableElements = getAllFocusableElements(panelRef.current);
			const firstElement = focusableElements.item(0);
			const lastElement = focusableElements.item(focusableElements.length - 1);

			if (event.target !== (event.shiftKey ? firstElement : lastElement)) {
				return;
			}

			event.preventDefault();

			// Only an attached panel hands the focus back to the trigger.
			if (closeOnTabOut && !isModal) {
				trigger?.focus();
				requestClose("onTab");

				return;
			}

			// Straight on to the control at the other end; the tab sandbox would stop at the panel element.
			event.stopPropagation();
			(event.shiftKey ? lastElement : firstElement)?.focus();
		},
		[closeOnEsc, closeOnTabOut, isModal, requestClose, trigger]
	);

	if (!open) {
		return null;
	}

	if (!isModal && !trigger) {
		// An explicitly attached panel waits for the trigger it is anchored to.
		return null;
	}

	const searchField = searchable && (
		<ContentBoxElements.SubActionBar>
			<div data-role={DataRoles.ColumnVisibilityPanel.Search}>
				<TextField
					value={searchTerm}
					label={searchPlaceholder ?? columnVisibilityPanelTitles?.searchPlaceholder}
					placeholder={searchPlaceholder ?? columnVisibilityPanelTitles?.searchPlaceholder}
					hideLabel
					disabled={disabled}
					inputRef={(ref) => {
						searchInputRef.current = ref;
					}}
					suffixes={[
						searchTerm && (
							<Button
								destructive
								disabled={disabled}
								icon={<Icon>clear</Icon>}
								title={columnVisibilityPanelTitles?.clearSearchButton}
								dataRole={DataRoles.ColumnVisibilityPanel.Search.ClearButton}
								onClick={handleClearSearch}
							/>
						),
						<Icon key="search-icon">search</Icon>
					]}
					onChange={handleSearchChange}
				/>
			</div>
		</ContentBoxElements.SubActionBar>
	);

	const footerActions = [
		showAll && (
			<Button
				key="show-all"
				secondary
				icon={<Icon>visibility</Icon>}
				label={showAllLabel ?? columnVisibilityPanelTitles?.showAllAction}
				disabled={disabled || !hasHiddenColumns(listedItems)}
				dataRole={DataRoles.ColumnVisibilityPanel.ShowAllButton}
				onClick={handleShowAll}
			/>
		),
		!hideReset && (
			<Button
				key="reset"
				secondary
				icon={<Icon>replay</Icon>}
				label={resetLabel ?? columnVisibilityPanelTitles?.resetAction}
				disabled={disabled || (resetDisabled ?? !hasColumnVisibilityDeviation(items))}
				dataRole={DataRoles.ColumnVisibilityPanel.ResetButton}
				onClick={handleReset}
			/>
		)
	].filter(Boolean);

	const panel = (
		<StyledColumnVisibilityPanel
			ref={handleRef}
			id={id}
			className={className}
			style={style}
			data-role={dataRole || DataRoles.ColumnVisibilityPanel}
			// Not a tab stop, but focusable: the focus rests here when the panel opens without a search field.
			tabIndex={-1}
			// The overlay is the dialog in the modal presentation; naming both would announce the panel twice.
			role={isModal ? undefined : "dialog"}
			aria-label={isModal ? undefined : ariaLabel}
			aria-labelledby={isModal || ariaLabel ? undefined : titleId}
			// In the modal presentation the overlay container carries the handler, which would run it twice.
			onKeyDown={isModal ? undefined : handleKeyDown}
			onFocus={handleRowFocus}
			$modal={isModal}
		>
			<ContentBox
				boxShadow="always"
				padding={false}
				heading={
					<ContentBoxElements.Heading
						suffixes={
							isModal && (
								<Button
									secondary
									icon={<Icon>close</Icon>}
									title={closeButtonTitle ?? columnVisibilityPanelTitles?.closeButton}
									dataRole={DataRoles.ColumnVisibilityPanel.CloseButton}
									onClick={() => requestClose("onCloseButton")}
								/>
							)
						}
					>
						<ContentBoxElements.Title
							id={titleId}
							ariaLevel={ariaLevel}
							text={title ?? columnVisibilityPanelTitles?.title}
						/>
					</ContentBoxElements.Heading>
				}
				subHeading={searchField}
				footer={
					footerActions.length > 0 && (
						<ContentBoxElements.Footer ariaLevel={ariaLevel + 1}>{footerActions}</ContentBoxElements.Footer>
					)
				}
			>
				{options.length === 0 && searchTerm ? (
					<StyledColumnVisibilityNoResults data-role={DataRoles.ColumnVisibilityPanel.NoResults}>
						{noResultsText ?? columnVisibilityPanelTitles?.noResults}
					</StyledColumnVisibilityNoResults>
				) : (
					<DropDown<ColumnVisibilityItem>
						items={options}
						selectionMode="multiple"
						getItemKey={getItemKey}
						labelRenderer={renderColumnLabel}
						// The rows are the tab stops, not the list around them.
						tabIndex={-1}
						// Arrow keys move the focus along with the active option.
						useFocusStyle
						navigation={navigation}
						ariaLabelledby={titleId}
						onSelectionChange={handleSelectionChange}
					/>
				)}
			</ContentBox>
		</StyledColumnVisibilityPanel>
	);

	if (isModal) {
		return (
			<ModalOverlay
				closeOnEsc={closeOnEsc}
				closeOnOutsideClick={closeOnOutsideClick}
				focusOnOpen={focusOnOpen && !focusSearchOnOpen}
				// Keeps the overlay as wide as the panel, so that it is centered rather than corner-aligned.
				maxWidth={theme.components.columnVisibilityPanel.modalMaxWidth}
				containerAttributes={{
					"aria-label": ariaLabel,
					"aria-labelledby": ariaLabel ? undefined : titleId,
					// The overlay container holds the initial focus, so an early ESC is only heard there.
					onKeyDown: handleKeyDown
				}}
				onClose={handleSurfaceClose}
			>
				{panel}
			</ModalOverlay>
		);
	}

	return (
		<AttachedPortal
			// Guaranteed by the attached bail-out above.
			referenceElement={trigger ?? undefined}
			orientationList={orientationList}
			fixedOrientation
			adjustPositionToScreen
			closeOnEsc={closeOnEsc}
			closeOnOutsideClick={closeOnOutsideClick}
			closeOnClickReferenceElement={false}
			// The portal focuses the panel element, which holds TAB inside; its styles take the ring off.
			focusOnOpen={focusOnOpen && !focusSearchOnOpen}
			focusOnReferenceElementAfterClose
			onVisibilityChange={handlePortalVisibilityChange}
		>
			{panel}
		</AttachedPortal>
	);
};

ColumnVisibilityPanel.displayName = "ColumnVisibilityPanel";
