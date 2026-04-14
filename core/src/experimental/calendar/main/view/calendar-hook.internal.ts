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

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { Key } from "ts-key-enum";

import { DataRoles } from "../../../../common/main/data-roles.js";

export const WEEK_DAYS_NUM = 7;

export const useMonthViewNavigateByKey = ({
	tableBodyRef,
	calendarChangedOnNavigate
}: {
	tableBodyRef: RefObject<HTMLElement | null>;
	calendarChangedOnNavigate?: boolean;
}): void => {
	/**
	 * Tracks the currently focused cell in the grid as [rowIndex, colIndex].
	 * Example: [2, 3] means focus is on row 2, column 3.
	 * Use undefined if no cell is focused.
	 */
	const focusPositionRef = useRef<[number, number]>(undefined);
	const focusHandleRafId = useRef<number | null>(null);

	useEffect(() => {
		const tableBodyElement = tableBodyRef.current;

		const columnNavigation = (event: KeyboardEvent): void => {
			const acceptedKeys: string[] = [Key.ArrowRight, Key.ArrowLeft];

			if (!acceptedKeys.includes(event.key) || !tableBodyElement) {
				return;
			}

			event.preventDefault();

			let currentRow = focusPositionRef.current?.[0];
			let currentColumn = focusPositionRef.current?.[1];

			if (currentRow === undefined || currentColumn === undefined) {
				return;
			}

			const isArrowRight = event.key === Key.ArrowRight;
			const weekList = Array.from(tableBodyRef.current?.children ?? []);

			const moveRow = (): void => {
				if (currentRow !== undefined) {
					currentRow += isArrowRight ? 1 : -1;
				}
			};

			while (currentRow >= 0 && currentRow < weekList.length) {
				currentColumn += isArrowRight ? 1 : -1;

				if (currentColumn === -1) {
					moveRow();
					currentColumn = WEEK_DAYS_NUM - 1;
				}

				if (currentColumn === WEEK_DAYS_NUM) {
					moveRow();
					currentColumn = 0;
				}

				const currentWeek = weekList[currentRow];

				const shouldFocusCell = currentWeek?.children?.[currentColumn] as HTMLElement | undefined;

				if (shouldFocusCell?.getAttribute("tabIndex") === "0") {
					shouldFocusCell.focus();
					break;
				}
			}
		};

		const rowNavigation = (event: KeyboardEvent): void => {
			const acceptedKeys: string[] = [Key.ArrowDown, Key.ArrowUp];

			if (!acceptedKeys.includes(event.key) || !tableBodyElement) {
				return;
			}

			event.preventDefault();

			let currentRow = focusPositionRef.current?.[0];
			const currentColumn = focusPositionRef.current?.[1];

			if (currentRow === undefined || currentColumn === undefined) {
				return;
			}

			const isArrowDown = event.key === Key.ArrowDown;

			const weekList = Array.from(tableBodyRef.current?.children ?? []);

			while (currentRow >= 0 && currentRow < weekList.length) {
				currentRow += isArrowDown ? 1 : -1;

				const currentWeek = weekList[currentRow];

				const shouldFocusCell = currentWeek?.children?.[currentColumn] as HTMLElement | undefined;

				if (shouldFocusCell?.getAttribute("tabIndex") === "0") {
					shouldFocusCell.focus();
					break;
				}
			}
		};

		const handleKeyDown = (event: KeyboardEvent): void => {
			const target = event.target as HTMLElement;
			const isInteractingWithCellElement = target.getAttribute("data-role") === `${DataRoles.Calendar.MonthView.Day}`;

			switch (event.key) {
				case Key.ArrowLeft:
				case Key.ArrowRight: {
					if (isInteractingWithCellElement) {
						columnNavigation(event);
					}

					break;
				}

				case Key.ArrowUp:
				case Key.ArrowDown: {
					if (isInteractingWithCellElement) {
						rowNavigation(event);
					}

					break;
				}
			}
		};

		tableBodyElement?.addEventListener("keydown", handleKeyDown);

		return (): void => {
			tableBodyElement?.removeEventListener("keydown", handleKeyDown);
		};
	}, [tableBodyRef]);

	useEffect(() => {
		const handleFocus = (event: FocusEvent): void => {
			const focusTarget = event.target as HTMLElement;
			const focusCell = focusTarget.closest(`[data-role="${DataRoles.Calendar.MonthView.Day}"]`);

			if (focusCell && tableBodyRef.current?.contains(focusTarget)) {
				const tableBody = tableBodyRef.current;

				if (!tableBody) {
					return;
				}

				const weekList = Array.from(tableBody.children);
				const currentWeek = focusTarget.closest(`[data-role=${DataRoles.Calendar.MonthView.Week}]`);

				if (!currentWeek) {
					return;
				}

				const weekDayList = Array.from(currentWeek.children);

				focusPositionRef.current = [weekList.indexOf(currentWeek), weekDayList.indexOf(focusCell)];
			}
		};

		const focusInHandler = (event: FocusEvent): void => {
			if (calendarChangedOnNavigate) {
				// Cancel any pending RAF to avoid stale updates overwriting the latest position
				if (focusHandleRafId.current !== null) {
					cancelAnimationFrame(focusHandleRafId.current);
				}

				// Delay focus handling to the next animation frame to ensure the calendar has updated
				focusHandleRafId.current = requestAnimationFrame(() => {
					focusHandleRafId.current = null;
					handleFocus(event);
				});
			} else {
				handleFocus(event);
			}
		};

		document.addEventListener("focusin", focusInHandler);

		return (): void => {
			document.removeEventListener("focusin", focusInHandler);

			if (focusHandleRafId.current !== null && calendarChangedOnNavigate) {
				cancelAnimationFrame(focusHandleRafId.current);
			}
		};
	}, [tableBodyRef, calendarChangedOnNavigate]);
};

export const useWeekViewNavigateByKey = ({ wrapperRef }: { wrapperRef: RefObject<HTMLElement | null> }): void => {
	const focusPositionRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		const wrapperElement = wrapperRef.current;

		function handleKeyDown(event: KeyboardEvent): void {
			if (event.key !== Key.ArrowLeft && event.key !== Key.ArrowRight) {
				return;
			}

			event.preventDefault();

			const currentPosition = focusPositionRef.current;

			if (currentPosition === undefined || !wrapperElement) {
				return;
			}

			const isRight = event.key === Key.ArrowRight;
			let nextPosition = currentPosition;
			const maxIndex = wrapperElement.children.length - 1;

			while (true) {
				nextPosition += isRight ? 1 : -1;

				if (nextPosition < 0 || nextPosition > maxIndex) {
					break; // Out of bounds
				}

				const nextCell = wrapperElement.children[nextPosition];

				if (nextCell instanceof HTMLElement && nextCell.getAttribute("tabindex") === "0") {
					nextCell.focus();
					focusPositionRef.current = nextPosition;
					break;
				}
			}
		}

		wrapperElement?.addEventListener("keydown", handleKeyDown);

		return (): void => {
			wrapperElement?.removeEventListener("keydown", handleKeyDown);
		};
	}, [wrapperRef]);

	useEffect(() => {
		function handleFocus(event: FocusEvent): void {
			const focusTarget = event.target as HTMLElement;

			if (
				focusTarget.getAttribute("data-role") === DataRoles.Calendar.WeekView.DayWrapper &&
				wrapperRef.current?.contains(focusTarget)
			) {
				const dayElements = Array.from(wrapperRef.current.children);
				focusPositionRef.current = dayElements.indexOf(focusTarget);
			} else {
				focusPositionRef.current = undefined;
			}
		}

		document.addEventListener("focusin", handleFocus);

		return (): void => {
			document.removeEventListener("focusin", handleFocus);
		};
	}, [wrapperRef]);
};

export function useIsChildHovered(parentRef: RefObject<HTMLElement | null>): boolean {
	const [isChildHovered, setIsChildHovered] = useState(false);

	useEffect(() => {
		const parent = parentRef.current;

		if (!parent) {
			return;
		}

		const handleMouseOver = (e: MouseEvent): void => {
			const closestInteractiveElement = (e.target as HTMLElement).closest('[tabindex="0"]');

			if (closestInteractiveElement !== parent && parent.contains(closestInteractiveElement)) {
				setIsChildHovered(true);
			} else {
				setIsChildHovered(false);
			}
		};

		const handleMouseOut = (e: MouseEvent): void => {
			if (!parent.contains(e.relatedTarget as Node)) {
				setIsChildHovered(false);
			}
		};

		parent.addEventListener("mousemove", handleMouseOver);
		parent.addEventListener("mouseout", handleMouseOut);

		return (): void => {
			parent.removeEventListener("mousemove", handleMouseOver);
			parent.removeEventListener("mouseout", handleMouseOut);
		};
	}, [parentRef]);

	return isChildHovered;
}
