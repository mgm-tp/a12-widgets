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

import type { RefObject, SetStateAction } from "react";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { Key } from "ts-key-enum";

import type { GenericCallback } from "./utils.js";
import { Key as CustomKey } from "./utils.js";

export const useSelectedText = (
	textWrapElement: RefObject<HTMLElement | null>,
	isInteractive = true
): { isSelectedText: boolean } => {
	const mouseDownPositionRef = useRef({
		clientX: 0,
		clientY: 0
	});
	const [isSelectedText, setIsSelectedText] = useState(false);

	useEffect(() => {
		if (textWrapElement.current) {
			if (isInteractive) {
				textWrapElement.current.onmousedown = (event: MouseEvent): void => {
					mouseDownPositionRef.current = { clientX: event.clientX, clientY: event.clientY };
				};

				textWrapElement.current.onmouseup = (event: MouseEvent): void => {
					const isMouseMove =
						mouseDownPositionRef.current.clientX !== event.clientX ||
						mouseDownPositionRef.current.clientY !== event.clientY;
					setIsSelectedText(isMouseMove && !!window.getSelection()?.toString());
				};
			} else {
				setIsSelectedText(!!window.getSelection()?.toString());
			}
		}
	}, [isInteractive, textWrapElement]);

	return { isSelectedText };
};

export const useIsMount = (): boolean => {
	const isMountRef = useRef(false);
	useEffect(() => {
		isMountRef.current = true;

		return (): void => {
			isMountRef.current = false;
		};
	}, []);

	return isMountRef.current;
};

export const useStateWithCallback = <T>(
	initialValue: T
): [T, (newValue: SetStateAction<T>, callback?: GenericCallback<[T]>) => void] => {
	const [state, setState] = useState(initialValue);
	const callbackRef = useRef<GenericCallback<[T]>>(undefined);

	useEffect(() => {
		callbackRef.current?.(state);
	}, [state]);

	const setCallbackState = useCallback((newValue: SetStateAction<T>, callback?: GenericCallback<[T]>): void => {
		callbackRef.current = callback;
		setState(newValue);
	}, []);

	return [state, setCallbackState];
};

/**
 * This hook determines if the component has been mounted `deferredTime` milliseconds.
 */
export const useDeferredMount = (deferredTime = 0): boolean => {
	const [allowMounting, setAllowMounting] = useState(false);
	const mountingDeferredTimeoutId = useRef<number>(undefined);

	useEffect(() => {
		if (!allowMounting) {
			mountingDeferredTimeoutId.current = window.setTimeout(() => setAllowMounting(true), deferredTime);
		}

		return (): void => {
			window.clearTimeout(mountingDeferredTimeoutId.current);
		};
	}, [deferredTime, allowMounting]);

	return allowMounting;
};

/**
 * Hook to handle arrow key navigation within a list of focusable elements.
 *
 * @param elementRef - The ref of the container element that contains the focusable elements.
 * @param selector - The selector to find the focusable elements within the container.
 * @param orientation - "vertical" (default) or "horizontal" for arrow key mapping
 * @param allowAllDirections - If true, allows navigation with all arrow keys regardless of orientation
 * @param allowTabNavigation - If true, allows navigation with Tab/Shift+Tab through items, similar to the arrow keys.
 */
export const useArrowKeyNavigation = ({
	elementRef,
	selector,
	orientation = "vertical",
	allowAllDirections = false,
	allowTabNavigation = false
}: {
	elementRef: RefObject<HTMLElement | null>;
	selector?: string;
	orientation?: "vertical" | "horizontal";
	allowAllDirections?: boolean;
	allowTabNavigation?: boolean;
}): void => {
	const element = elementRef.current;

	const getNavigationTargets = useCallback((): HTMLElement[] => {
		if (!element) {
			return [];
		}

		const elements = selector
			? Array.from(element.querySelectorAll<HTMLElement>(selector))
			: (Array.from(element.children) as HTMLElement[]);

		return Array.from(elements).filter(
			(element: HTMLElement) => element.getAttribute("aria-disabled") !== "true" && !element.hasAttribute("disabled")
		);
	}, [element, selector]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			if (
				event.key !== Key.ArrowUp &&
				event.key !== Key.ArrowDown &&
				event.key !== Key.ArrowLeft &&
				event.key !== Key.ArrowRight &&
				event.key !== Key.Tab
			) {
				return;
			}

			if (!allowTabNavigation && event.key === Key.Tab) {
				return;
			}

			if (event.key === Key.Tab) {
				event.preventDefault();
			}

			event.stopPropagation();
			const targetList = getNavigationTargets();
			const focusedIndex = targetList.indexOf(document.activeElement as HTMLElement);

			const [upKey, downKey] =
				orientation === "horizontal" ? [Key.ArrowLeft, Key.ArrowRight] : [Key.ArrowUp, Key.ArrowDown];

			const validKeys = allowAllDirections
				? [Key.ArrowUp, Key.ArrowDown, Key.ArrowLeft, Key.ArrowRight, Key.Tab]
				: [upKey, downKey, Key.Tab];

			if (!validKeys.includes(event.key as Key)) {
				return;
			}

			const isBackwardKey =
				event.key === Key.ArrowUp || event.key === Key.ArrowLeft || (event.key === Key.Tab && event.shiftKey);
			const isForwardKey =
				event.key === Key.ArrowDown || event.key === Key.ArrowRight || (event.key === Key.Tab && !event.shiftKey);

			const targetIndex = isBackwardKey
				? focusedIndex > 0
					? focusedIndex - 1
					: targetList.length - 1
				: isForwardKey
					? focusedIndex < targetList.length - 1
						? focusedIndex + 1
						: 0
					: focusedIndex;

			if (targetIndex !== undefined) {
				event.preventDefault();
				targetList[targetIndex]?.focus();
			}
		};

		element?.addEventListener("keydown", handleKeyDown);

		return (): void => {
			element?.removeEventListener("keydown", handleKeyDown);
		};
	}, [element, getNavigationTargets, orientation, allowAllDirections, allowTabNavigation]);
};

/** Trick to allow selecting text inside input  when contained in a draggable element, e.g. table row */
export const useKeepEditableCursorInDraggable = (draggableElement: RefObject<HTMLElement | null>): void => {
	useEffect(() => {
		const onMouseUp: EventListener = () => {
			draggableElement.current?.setAttribute("draggable", "true");
		};

		const onMouseDown: EventListener = ({ target }) => {
			if (target instanceof HTMLElement) {
				const isEditableElement =
					target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

				if (isEditableElement) {
					draggableElement.current?.setAttribute("draggable", "false");
				}
			}
		};

		const element = draggableElement.current;
		element?.addEventListener("mousedown", onMouseDown);
		element?.addEventListener("mouseup", onMouseUp);

		return () => {
			element?.removeEventListener("mousedown", onMouseDown);
			element?.removeEventListener("mouseup", onMouseUp);
		};
	}, [draggableElement]);
};

/**
 * A hook to remember previous value, useful to track state changes
 * @param value
 */
export function usePrevious<T>(value: T): T | null {
	const [current, setCurrent] = useState<T>(value);
	const [previous, setPrevious] = useState<T | null>(null);

	if (value !== current) {
		setPrevious(current);
		setCurrent(value);
	}

	return previous;
}

/**
 * Custom hook to trigger a click event when the Enter or Space key is pressed on a specified element.
 *
 * @internal
 * @param elementRef - The ref of the target element.
 * @param enableSpaceKeyTrigger - A boolean to enable triggering click with the Space key. Defaults to true.
 * @param disabled - Specifies whether the element is disabled.
 */
export const useEnterAndSpaceKeyTrigger = ({
	elementRef,
	enableSpaceKeyTrigger = true,
	disabled
}: {
	elementRef: RefObject<HTMLElement | null>;
	enableSpaceKeyTrigger: boolean;
	disabled?: boolean;
}): void => {
	useEffect(() => {
		const element = elementRef.current;

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (element && !disabled && (event.key === "Enter" || (enableSpaceKeyTrigger && event.key === CustomKey.Space))) {
				element.click();
			}
		};

		if (element) {
			element.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			if (element) {
				element.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [disabled, elementRef, enableSpaceKeyTrigger]);
};

type InteractionType = "mouse" | "keyboard";

/**
 * Hook to track the last interaction type (mouse or keyboard).
 * Updates the state whenever a key is pressed or the mouse is clicked.
 *
 * @internal
 */
export function useLastInteractionType(): InteractionType {
	const [lastType, setLastType] = useState<InteractionType>("mouse");

	useEffect(() => {
		const handleKeyDown = (): void => setLastType("keyboard");
		const handleMouseDown = (): void => setLastType("mouse");

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("mousedown", handleMouseDown);

		return (): void => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("mousedown", handleMouseDown);
		};
	}, []);

	return lastType;
}

/** A hook similar to useEffect but skips running the effect for the first time. */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
	const isMounted = useRef(false);
	// Avoids stale closure — effect always sees latest values without being added to deps.
	const effectCallback = useEffectEvent(effect);

	useEffect(
		() => {
			if (!isMounted.current) {
				isMounted.current = true;
			} else {
				return effectCallback();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		deps
	);
};

export const useEffectWithDebounce = (effect: () => void | (() => void), deps: unknown[], delay: number): void => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const effectRef = useRef(effect);
	effectRef.current = effect;

	useEffect(() => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => effectRef.current(), delay);

		return (): void => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [deps, delay]);
};
