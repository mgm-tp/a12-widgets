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

import { supportsTouchEvents, supportsPassiveEvents } from "detect-it";

import { addPrefix, getParentElement, Throttler } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { TableTemplateProps } from "./template/table.tpl.api.js";
import { TableDataAttributes } from "./table.data-attributes.js";

export const BASE_TABLE_CLASSNAME = addPrefix("table");

export namespace ColumnWidthSync {
	const setElementWidth = (element: HTMLElement, width: number | string): void => {
		const widthStr = typeof width === "number" ? `${width}px` : width;
		element.style.width = widthStr;
		element.style.minWidth = widthStr;
		element.style.maxWidth = widthStr;
	};

	const resetWidth = (elements: NodeListOf<HTMLElement>): void => {
		if (!elements[0] || elements[0].style.width === null) {
			return;
		}

		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];

			if (element instanceof HTMLElement) {
				setElementWidth(element, "");
			}
		}
	};

	const syncScrollLeft = (elements: NodeListOf<HTMLElement> | HTMLElement[], scrollLeft: number): void => {
		for (let i = 0; i < elements.length; i++) {
			elements[i].scrollLeft = scrollLeft;
		}
	};

	const synchronizeElementsWidth = (
		elements: NodeListOf<HTMLElement> | HTMLElement[],
		dependOnMaxWidth: boolean,
		isForced: boolean,
		scrollLeft?: number,
		enableColumnGroupA11y = false
	): void => {
		if (elements.length <= 1) {
			return;
		}

		if (scrollLeft) {
			syncScrollLeft(elements, scrollLeft);
		}

		if (enableColumnGroupA11y) {
			return;
		}

		let needSyncWidth = false;
		let syncWidth = elements[0].offsetWidth;

		for (let i = 1; i < elements.length; i++) {
			const element = elements[i];

			if (syncWidth !== element.offsetWidth && !element.classList.contains(addPrefix("table__footerRow--scroll"))) {
				if (element.offsetWidth > 0) {
					syncWidth = dependOnMaxWidth
						? Math.max(syncWidth, element.offsetWidth)
						: Math.min(syncWidth, element.offsetWidth);
				}

				needSyncWidth = true;
			}
		}

		if (!needSyncWidth && !isForced && !scrollLeft) {
			return;
		}

		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			setElementWidth(element, syncWidth);
		}
	};

	const synchronizeActionCellsWidth = (actionCells: NodeListOf<HTMLElement>, numberActionColumns: number): void => {
		for (let columnIndex = 0; columnIndex < numberActionColumns; columnIndex++) {
			let cellMaxWidth = 0;
			const cells = [];

			// Group cells by column
			for (let cellIndex = columnIndex; cellIndex < actionCells.length; cellIndex = cellIndex + numberActionColumns) {
				if (actionCells[cellIndex]) {
					cells.push(actionCells[cellIndex]);
				}

				// Find the head action cell
				const headActionCell =
					actionCells[cellIndex].getAttribute("data-role") === `${DataRoles.Table.Header.Cell}`
						? actionCells[cellIndex]
						: undefined;

				// Get the max width of cells in column
				cellMaxWidth = headActionCell
					? Math.max(cellMaxWidth, Math.ceil(headActionCell?.getBoundingClientRect().width))
					: Math.max(cellMaxWidth, actionCells[cellIndex].offsetWidth);
			}

			// Set width for all cells
			for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
				setElementWidth(cells[cellIndex], cellMaxWidth);
			}
		}
	};

	const synchronizeHeadGridColumns = (tableRef: HTMLElement): void => {
		const headGrid = tableRef.querySelector<HTMLElement>(`[data-role="${DataRoles.Table.Row.Group.Header}"]`);

		if (!headGrid) {
			return;
		}

		const bodyCells: HTMLElement[] = [];

		for (const segmentDataRole of [
			DataRoles.Table.Body.Row.SegmentLeft,
			DataRoles.Table.Body.Row.SegmentScroll,
			DataRoles.Table.Body.Row.SegmentRight
		]) {
			const segment = tableRef.querySelector<HTMLElement>(`[data-role="${segmentDataRole}"]`);

			if (segment) {
				bodyCells.push(
					...Array.from(segment.querySelectorAll<HTMLElement>(`[data-role="${DataRoles.Table.Body.Cell}"]`))
				);
			}
		}

		if (!bodyCells.length) {
			return;
		}

		headGrid.style.gridTemplateColumns = bodyCells.map((cell) => `${cell.offsetWidth}px`).join(" ");
	};

	const getNumberActionColumns = (
		tableRef: HTMLElement,
		actionCellsCount: number,
		isExpandableTable?: boolean
	): number => {
		const expandableWrapperElement = `[data-role="${DataRoles.Table.Expandable.Wrapper}"]`;
		const rowElement = '[data-role$="-row"]';

		const rows = (
			isExpandableTable
				? tableRef.querySelectorAll(`${rowElement}:not(${expandableWrapperElement} ${rowElement})`)
				: tableRef.querySelectorAll(`${rowElement}`)
		) as NodeListOf<HTMLElement>;

		if (actionCellsCount % rows.length !== 0) {
			// eslint-disable-next-line no-console
			console.warn(`The number of action cells is not compatible with the number of rows`);
		}

		return Math.floor(actionCellsCount / rows.length);
	};

	export function synchronizeColumns(
		tableRef: HTMLElement,
		options: {
			onDone?: () => void;
			scrollLeft?: number;
			numberActionColumns?: number;
			forceResetScrollCell?: boolean;
			resetOnly?: boolean;
			enableColumnGroupA11y?: boolean;
		}
	): void {
		const { onDone, scrollLeft, numberActionColumns, forceResetScrollCell, resetOnly, enableColumnGroupA11y } = options;
		const cellSelector = '[data-role$="cell"]';
		const actionCellSelector = `[data-type="${TableDataAttributes.Table.ActionCell}"]:not([data-width])`;
		const expandableWrapperSelector = `[data-role="${DataRoles.Table.Expandable.Wrapper}"]`;
		const containingScrollSelector = '[data-role*="--scroll "]';
		const endingScrollSelector = '[data-role$="--scroll"]';
		const isExpandableTable = tableRef.querySelector(`${expandableWrapperSelector}`) !== null;

		requestAnimationFrame(() => {
			const allCells = (
				isExpandableTable
					? tableRef.querySelectorAll(`${cellSelector}:not(${expandableWrapperSelector} ${cellSelector})`)
					: tableRef.querySelectorAll(`${cellSelector}`)
			) as NodeListOf<HTMLElement>;
			resetWidth(allCells);

			const actionCells = (
				isExpandableTable
					? tableRef.querySelectorAll(`${actionCellSelector}:not(${expandableWrapperSelector} ${actionCellSelector})`)
					: tableRef.querySelectorAll(`${actionCellSelector}`)
			) as NodeListOf<HTMLElement>;

			const scrollCells = (
				isExpandableTable
					? tableRef.querySelectorAll(
							`${endingScrollSelector}:not(${expandableWrapperSelector} ${endingScrollSelector}),  ${containingScrollSelector}:not(${expandableWrapperSelector} ${containingScrollSelector})`
						)
					: tableRef.querySelectorAll(`${endingScrollSelector}, ${containingScrollSelector}`)
			) as NodeListOf<HTMLElement>;

			if (actionCells.length > 0 || forceResetScrollCell) {
				resetWidth(scrollCells);
			}

			if (resetOnly) {
				return;
			}

			synchronizeActionCellsWidth(
				actionCells,
				numberActionColumns ?? getNumberActionColumns(tableRef, actionCells.length, isExpandableTable)
			);
			synchronizeElementsWidth(scrollCells, false, actionCells.length > 0, scrollLeft, enableColumnGroupA11y);

			if (enableColumnGroupA11y) {
				synchronizeHeadGridColumns(tableRef);
			}

			onDone?.();
		});
	}
}

/**
 * Class that manages the synchronization of all elements as well as enables the touch scroll of all element
 * that matches the given classNames inside a given element.
 */
export class RowScrollManager {
	private readonly relevantEvents = ["scroll", "touchstart", "touchmove", "touchend"];
	private readonly listener = this.createEventListener();
	private animateScrollInterval: number | undefined;

	private lastHorizontalTouchPosition: number | undefined;
	private elements: Element[] = [];
	private scrolling = false;

	constructor(
		protected syncRowDataRoles: string[],
		protected scrollTriggerRowDataRole: string,
		protected onRowScroll?: (type: TableTemplateProps.HorizontalScrollPosition) => void
	) {}

	private getTriggerRow(): Element | undefined {
		return this.elements.find((element) => element.getAttribute("data-role") === this.scrollTriggerRowDataRole);
	}

	public isRowHorizontallyScrollable(row: Element): boolean {
		return !!row && row.scrollWidth > row.clientWidth;
	}

	public getScrollLeft(): number {
		for (const element of this.elements) {
			if (element.scrollLeft > 0) {
				return element.scrollLeft;
			}
		}

		return this.elements[0]?.scrollLeft ?? 0;
	}

	public handleTriggerRowScroll(): void {
		const triggerRow = this.getTriggerRow();

		if (!triggerRow || typeof triggerRow !== "object" || !this.onRowScroll) {
			return;
		}

		const isRowHorizontallyScrollable = this.isRowHorizontallyScrollable(triggerRow);

		if (!isRowHorizontallyScrollable) {
			this.onRowScroll(null);
		} else {
			const scrollLeft = this.getScrollLeft();

			if (Math.round(scrollLeft) === 0) {
				this.onRowScroll("left");
			} else if (Math.ceil(scrollLeft + triggerRow.clientWidth) < Math.round(triggerRow.scrollWidth)) {
				this.onRowScroll("middle");
			} else {
				this.onRowScroll("right");
			}
		}
	}

	public handleMouseWheelScrollHorizontally(event: WheelEvent): void {
		const deltaX = Math.abs(event.deltaX);
		const deltaY = Math.abs(event.deltaY);
		const isMouseWheel = deltaY && event.shiftKey;

		const isTrackPadWheel = !!deltaX;

		if (isMouseWheel || isTrackPadWheel) {
			event.stopPropagation();

			this.animateScrollInterval && window.clearInterval(this.animateScrollInterval);
			const target = event.target as HTMLElement;

			const currentTable = target.closest(`[data-role='${DataRoles.Table}']`);
			const scrollElement = this.getTriggerRow();

			const isTrackPadScrollVertically = isTrackPadWheel && deltaY >= deltaX;

			if (!scrollElement || !currentTable || isTrackPadScrollVertically) {
				return;
			}

			const pointerInsideScrollArea = this.isPointerWithinScrollableArea(event, currentTable, scrollElement);

			// With expandable table, we only allow scroll in row area
			const tableExpandableWrapper = target.closest(`[data-role='${DataRoles.Table.Expandable.Wrapper}']`);
			const shouldNotAllowScroll = !!tableExpandableWrapper && currentTable.contains(tableExpandableWrapper);

			const shouldHandleScroll = pointerInsideScrollArea && !shouldNotAllowScroll;

			if (shouldHandleScroll) {
				event.preventDefault();
				const scrollValue = isMouseWheel ? event.deltaY : event.deltaX;
				this.handleScrollMoveSmooth(scrollElement, scrollValue);
			}
		}
	}

	private handleScrollMoveSmooth(scroll: Element, scrollValue: number): void {
		const step = (scrollValue / Math.abs(scrollValue)) * 5;
		let scrollAmount = 0;
		this.animateScrollInterval = window.setInterval(() => {
			scroll.scrollLeft += step;
			scrollAmount += step;

			if (Math.abs(scrollAmount) >= Math.abs(scrollValue)) {
				this.animateScrollInterval && window.clearInterval(this.animateScrollInterval);
			}
		});
	}

	private isPointerWithinScrollableArea(event: WheelEvent, wrapper: Element, scrollElement: Element): boolean {
		const scrollClientRect = scrollElement.getBoundingClientRect();
		const wrapperRect = wrapper.getBoundingClientRect();

		return (
			event.clientX >= scrollClientRect.left &&
			event.clientX <= scrollClientRect.right &&
			event.clientY >= wrapperRect.top &&
			event.clientY <= wrapperRect.bottom
		);
	}

	private createEventListener(): EventListener {
		const throttler = new Throttler((event: UIEvent) => {
			if (supportsTouchEvents && event instanceof TouchEvent) {
				this.handleTouchToScrollElements(event);
			} else {
				this.handleScrollElements(event);
			}
		});

		return (event) => {
			// Ignore scroll event during touch scroll
			if (event.type === "scroll" && this.lastHorizontalTouchPosition !== undefined) {
				return;
			}

			if (supportsTouchEvents && event instanceof TouchEvent) {
				if (event.type === "touchstart") {
					this.lastHorizontalTouchPosition = event.targetTouches[0].clientX;

					return;
				}

				if (event.type === "touchend") {
					this.lastHorizontalTouchPosition = undefined;

					return;
				}

				if (event.touches.length !== 1) {
					return;
				}
			}

			throttler.execute(event);
		};
	}

	private handleScrollElements(event: UIEvent): void {
		this.scrolling = true;

		if (this.elements.length === 0) {
			return;
		}

		const triggerElement = event.target;

		if (!(triggerElement instanceof Element)) {
			return;
		}

		// To prevent the effect of incomplete rendering rows
		if (triggerElement.clientHeight === 0 && triggerElement.clientWidth === 0) {
			return;
		}

		const newHorizontalScrollPosition = triggerElement.scrollLeft;
		requestAnimationFrame(() => {
			for (const element of this.elements) {
				if (element !== triggerElement) {
					element.scrollLeft = newHorizontalScrollPosition;
				}
			}
		});

		this.handleTriggerRowScroll();
		this.scrolling = false;
	}

	private handleTouchToScrollElements(event: TouchEvent): void {
		// Prevent scroll when resize column on touch devices
		if (
			(event.target as HTMLElement).classList.contains(`${BASE_TABLE_CLASSNAME}__headerCell__resize-handler`) ||
			!!getParentElement(event.target as HTMLElement, (p) =>
				p.classList.contains(`${BASE_TABLE_CLASSNAME}__headerCell__resize-handler`)
			)
		) {
			return;
		}

		if (!this.elements || this.elements.length === 0) {
			return;
		}

		if (this.lastHorizontalTouchPosition === undefined) {
			return;
		}

		// Get relative touch position change
		const newHorizontalTouchPosition = event.targetTouches[0].clientX;
		const horizontalTouchPositionChange = this.lastHorizontalTouchPosition - newHorizontalTouchPosition;
		this.lastHorizontalTouchPosition = newHorizontalTouchPosition;
		this.updateScrollElements(horizontalTouchPositionChange);
	}

	private updateScrollElements(horizontalTouchPositionChange: number): void {
		if (this.elements.length === 0 || horizontalTouchPositionChange === 0) {
			return;
		}

		// Get new scroll position if valid
		const maxHorizontalScrollPosition = this.elements[0].scrollWidth - this.elements[0].clientWidth;
		const currentHorizontalScrollPosition = this.elements[0].scrollLeft;
		const newHorizontalScrollPosition = Math.max(
			0,
			Math.min(maxHorizontalScrollPosition, currentHorizontalScrollPosition + horizontalTouchPositionChange)
		);

		for (const element of this.elements) {
			element.scrollLeft = newHorizontalScrollPosition;
		}

		this.handleTriggerRowScroll();
	}

	/**
	 * Removes old registered listeners and registers new ones
	 */
	public update(change = 0): void {
		if (this.scrolling) {
			return;
		}

		this.updateScrollElements(change);
	}

	/**
	 * Destroys this handler and removes all registered listeners
	 */
	public destroy(): void {
		this.detachEvents(this.elements);
		this.elements = [];
	}

	public isAcceptable(element: Element): boolean {
		return this.syncRowDataRoles.some((dataRole) => element.getAttribute("data-role") === dataRole);
	}

	public addElement(element: Element): void {
		if (this.elements.length > 0) {
			element.scrollLeft = this.elements[0].scrollLeft;
		}

		this.elements.push(element);
		this.attachEvents(element);
	}

	public removeElement(element: Element): void {
		this.detachEvents([element]);

		const index = this.elements.findIndex((el) => el === element);

		if (index === -1) {
			return;
		}

		this.elements.splice(index, 1);
	}

	private attachEvents(element: Element): void {
		for (const eventName of this.relevantEvents) {
			const usePassiveMode = supportsPassiveEvents && ["touchstart", "touchmove", "touchend"].includes(eventName);
			element.addEventListener(eventName, this.listener, usePassiveMode ? { passive: true } : false);
		}
	}

	private detachEvents(elements: Element[]): void {
		for (const eventName of this.relevantEvents) {
			for (const element of elements) {
				element.removeEventListener(eventName, this.listener);
			}
		}
	}
}
