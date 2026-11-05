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

import { isEqual } from "lodash-es";
import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RndDragCallback, RndResizeCallback, RndResizeStartCallback } from "react-rnd";
import { Rnd } from "react-rnd";
import { CSSTransition } from "react-transition-group";
import { useTheme } from "styled-components";
import { Key } from "ts-key-enum";

import { computeMaxSize } from "../../attached-portal/main/attached-portal.internal.js";
import type { BoundaryAlignmentArgument, Orientation, Position } from "../../common/main/alignment.js";
import { getBoundaryAlignment } from "../../common/main/alignment.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { useResizeObserver } from "../../common/main/resize-observer/use-resize-observer.js";
import { TabSandbox } from "../../common/main/tab-sandbox.view.js";
import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import { Portal } from "../../portal/main/portal.view.js";

import type { ResizeAndDragContainerProps } from "./resize-and-drag-container.api.js";
import {
	disableAllResizing,
	resizeHandleStyles as internalResizeHandleStyles
} from "./resize-and-drag-container.internal.js";
import { resizeAndDragContentAnimate, StyledResizeAndDragContentWrapper } from "./resize-and-drag-container.styled.js";

/** @internal */
export const getRnDSize = (element: Rnd): { width: number; height: number } => {
	const { width, height } = element.resizable.size;

	return { width, height };
};

/** @internal */
export const getRndSelfElementBoundingClientRect = (element: HTMLElement): DOMRect => {
	return element.getBoundingClientRect();
};

export const ResizeAndDragContainer = ({
	show: showProp = true,
	animation,
	onClose: onCloseProp,
	...props
}: ResizeAndDragContainerProps): ReactNode => {
	const [show, setShow] = useState(showProp);

	const handleAnimationCloseRef = useRef<() => void>(undefined);

	/**
	 * When `animation` is enabled, if the container is closed by setting `show` to false,
	 * it will be removed from the DOM immediately without any animation.
	 * Instead of setting `show` to false, use the handler registered from this callback
	 * to process the animation when closing the container.
	 */
	const registerAnimationCloseHandler = useCallback((close: () => void) => {
		handleAnimationCloseRef.current = close;
	}, []);

	const onClose = useCallback(() => {
		onCloseProp?.();
		setShow(false);
	}, [onCloseProp]);

	useEffect(() => {
		if (showProp) {
			setShow(true);
		} else {
			handleAnimationCloseRef.current?.();
		}
	}, [showProp]);

	return (
		show && (
			<ResizeAndDragContainerInternal
				{...props}
				onClose={onClose}
				animation={animation}
				registerAnimationCloseHandler={registerAnimationCloseHandler}
			/>
		)
	);
};

const ResizeAndDragContainerInternal: FC<ResizeAndDragContainerProps> = ({
	focusOnReferenceElementAfterEsc = true,
	focusOnOpen = true,
	closeOnEsc = true,
	...props
}) => {
	const {
		children,
		className,
		dragHandleClassName,
		onClick,
		onClose,
		onKeyDown,
		referenceElement,
		wrapper,
		disableResizing,
		closeOnOutsideClick,
		orientationList,
		wrapperRef,
		initialSize: initialSizeProp,
		initialPosition,
		fixedOrientation,
		disableDragging: disableDraggingProp,
		enableResizing,
		resizeHandleStyles,
		maxHeight: maxHeightProp,
		minHeight: minHeightProp,
		maxWidth: maxWidthProp,
		minWidth: minWidthProp,
		rndRef,
		onResizeStart,
		onDragStart,
		onResizeStop,
		onDragStop,
		onResize,
		animation,
		registerAnimationCloseHandler,
		htmlAttributes,
		...restProps
	} = props;

	const {
		components: {
			resizeAndDragContainer: {
				animation: { duration: animationDurationTheme }
			}
		}
	} = useTheme();

	const initialSize = useMemo(
		() =>
			initialSizeProp?.width && initialSizeProp?.height
				? {
						height: initialSizeProp.height,
						width: initialSizeProp.width
					}
				: undefined,
		[initialSizeProp?.height, initialSizeProp?.width]
	);

	const allowUpdatePosition = useRef(true);
	const innerHTMLComponent = useRef<HTMLDivElement | null>(null);
	const rndElement = useRef<Rnd | null>(null);
	const previousOrientation = useRef<Orientation>("bottom-start");

	/**
	 * Whether *this* instance currently owns the body-level text-selection suppression.
	 * Tracked per instance so unmounting one container cannot clear the class out from
	 * under another container that is mid-drag.
	 */
	const suppressesTextSelection = useRef(false);
	const [containsHandle, setContainsHandle] = useState(false);
	const [isDragging, setDragging] = useState(false);
	const [disabledDraggingWhenClickScrollBar, setDisabledDraggingWhenClickScrollBar] = useState(false);
	const [isContentVisible, setIsContentVisible] = useState(false);
	const [currentPosition, setCurrentPosition] = useState<Position>();

	/**
	 * When this component mounts, it will automatically calculate to find the size and position that best fit the screen.
	 * This state will be set to true when the process is finished.
	 */
	const [isInitFinished, setIsInitFinished] = useState({
		initPosition: false,
		initSize: false
	});

	const isAnimationEnabled = animation === true;

	const parseCssValue = (value: number | string): number => {
		if (typeof value === "number") {
			return value;
		}

		if (value.endsWith("px")) {
			return parseFloat(value);
		}

		if (value.endsWith("vh")) {
			return (parseFloat(value) / 100) * window.innerHeight;
		}

		if (value.endsWith("vw")) {
			return (parseFloat(value) / 100) * window.innerWidth;
		}

		return NaN; // Fallback for unsupported units
	};

	const { maxHeight, minHeight, maxWidth, minWidth } = useMemo(() => {
		const parseValue = (value: number | string | undefined) => (value ? parseCssValue(value) : undefined);

		return {
			maxHeight: parseValue(maxHeightProp),
			minHeight: parseValue(minHeightProp),
			maxWidth: parseValue(maxWidthProp),
			minWidth: parseValue(minWidthProp)
		};
	}, [maxHeightProp, maxWidthProp, minHeightProp, minWidthProp]);

	/**
	 * Clamps the value between the provided minimum and maximum values.
	 */
	const clampValue = useCallback(
		(value: number | string, min?: number | string, max?: number | string): number | string => {
			const valueNumber = typeof value === "string" ? parseCssValue(value) : value;
			const minNumber = typeof min === "string" ? parseCssValue(min) : (min ?? -Infinity);
			const maxNumber = typeof max === "string" ? parseCssValue(max) : (max ?? Infinity);

			if (isNaN(valueNumber) || isNaN(minNumber) || isNaN(maxNumber)) {
				return value;
			}

			return Math.min(Math.max(valueNumber, minNumber), maxNumber);
		},
		[]
	);

	const handlePortalClose = useCallback(
		(event: KeyboardEvent): void => {
			if (
				event &&
				event.code === undefined &&
				closeOnOutsideClick &&
				referenceElement.contains(event.target as Element)
			) {
				return;
			}

			if (event && event.key === Key.Escape && focusOnReferenceElementAfterEsc) {
				referenceElement.focus();
			}

			setIsContentVisible(false);
		},
		[closeOnOutsideClick, focusOnReferenceElementAfterEsc, referenceElement]
	);

	const updateChildWidth = useCallback((): void => {
		if (innerHTMLComponent.current && innerHTMLComponent.current.firstElementChild) {
			(innerHTMLComponent.current.firstElementChild as HTMLElement).style.width = "auto";
		}
	}, []);

	const computeSize = useCallback(
		(orientation: Orientation): void => {
			if (rndElement.current && innerHTMLComponent.current) {
				const size = computeMaxSize(referenceElement.getBoundingClientRect(), orientation);
				const selfElement = rndElement.current.getSelfElement();

				if (selfElement) {
					const containerSize = getRndSelfElementBoundingClientRect(selfElement);
					const newWidth = clampValue(
						initialSize?.width || Math.min(size.maxWidth, containerSize.width),
						minWidth,
						maxWidth
					);
					const newHeight = clampValue(
						initialSize?.height || Math.min(size.maxHeight, containerSize.height),
						minHeight,
						maxHeight
					);
					const currentSize = getRnDSize(rndElement.current);

					// Math.round is used to avoid JavaScript's weird decimal calculations.
					const isHeightChange =
						typeof newHeight === "number" &&
						Math.round(newHeight) !== Math.round(currentSize.height) &&
						newHeight <= window.innerHeight;
					const isWidthChange =
						typeof newWidth === "number" &&
						Math.round(newWidth) !== Math.round(currentSize.width) &&
						newWidth <= window.innerWidth;

					if (isHeightChange || isWidthChange) {
						rndElement.current.updateSize({ width: newWidth, height: newHeight });
						updateChildWidth();
						const newCurrentPosition = currentPosition && { ...currentPosition };
						setCurrentPosition(newCurrentPosition);
					}

					setIsInitFinished((pre) => ({
						...pre,
						initSize: !(isHeightChange || isWidthChange)
					}));
				}
			}
		},
		[
			currentPosition,
			referenceElement,
			clampValue,
			initialSize,
			minWidth,
			maxWidth,
			minHeight,
			maxHeight,
			updateChildWidth
		]
	);

	/*
	 * The component will be hidden by setting opacity when it automatically initializes size and position.
	 * When finished, we display the container to the user by removing the opacity.
	 */
	useEffect(() => {
		if (isInitFinished.initPosition && isInitFinished.initSize) {
			// Make the container visible after calculating its dimension and position.
			const rndSelfElement = rndElement.current?.getSelfElement();

			if (rndSelfElement) {
				rndSelfElement.style.removeProperty("opacity");
			}

			setIsContentVisible(true);
		}
	}, [isInitFinished]);

	// Call rndElement.current?.updatePosition from useEffect instead of from onResize callback to avoid issue "Cannot update during an existing state transition."
	useEffect(() => {
		if (currentPosition) {
			const draggablePosition = rndElement.current?.getDraggablePosition();
			const isPositionChanged =
				!draggablePosition ||
				draggablePosition.x !== currentPosition.left ||
				draggablePosition.y !== currentPosition.top;

			if (isPositionChanged) {
				rndElement.current?.updatePosition({ x: currentPosition.left, y: currentPosition.top });
			}

			previousOrientation.current = currentPosition.orientation;
			computeSize(currentPosition.orientation);
		}
	}, [computeSize, currentPosition]);

	const updatePosition = useCallback((): void => {
		if (rndElement.current) {
			const element = rndElement.current.getSelfElement() as HTMLElement;

			if (element && initialSize && !props.default) {
				element.style.width = initialSize.width + "px";
				element.style.height = initialSize.height + "px";
			}

			const boundaryAlignmentArgument: BoundaryAlignmentArgument = {
				referenceElement: referenceElement,
				element,
				preferredOrientation: props.orientation || previousOrientation.current,
				mode: "absolute",
				orientationList: orientationList,
				fixedOrientation,
				adjustPositionToScreen: true
			};

			const position = getBoundaryAlignment(boundaryAlignmentArgument);

			if (initialPosition) {
				if (initialPosition.x !== undefined) {
					position.left = initialPosition.x;
				}

				if (initialPosition.y !== undefined) {
					position.top = initialPosition.y;
				}
			}

			const isPositionChanged = !currentPosition || !isEqual(currentPosition, position);

			setIsInitFinished((prevState) => ({
				...prevState,
				initPosition: !isPositionChanged
			}));

			if (isPositionChanged) {
				setCurrentPosition(position);
			}
		}
	}, [
		currentPosition,
		fixedOrientation,
		initialPosition,
		initialSize,
		orientationList,
		props.default,
		props.orientation,
		referenceElement
	]);

	const handleRndRef = useCallback(
		(ref: Rnd | null): void => {
			rndElement.current = ref;
			rndRef?.(ref);
		},
		[rndRef]
	);

	const startSuppressingTextSelection = useCallback((): void => {
		suppressesTextSelection.current = true;
		document.body.classList.add(addPrefix("-u-user-select-none"));
	}, []);

	const stopSuppressingTextSelection = useCallback((): void => {
		if (!suppressesTextSelection.current) {
			return;
		}

		suppressesTextSelection.current = false;
		document.body.classList.remove(addPrefix("-u-user-select-none"));
	}, []);

	/**
	 * Drag and resize suppress text selection on `document.body`, and the matching
	 * stop handlers are the only thing that lifts it. Those handlers do not run if the
	 * container unmounts while an interaction is in flight (a drop that unmounts the
	 * container, a parent that closes mid-drag, a pointer released outside the window),
	 * which used to leave `-u-user-select-none` on the body permanently — making text
	 * unselectable across the whole application until a reload.
	 */
	useEffect(() => stopSuppressingTextSelection, [stopSuppressingTextSelection]);

	const onResizeStartHandler: RndResizeStartCallback = useCallback(
		(event, dir, elementRef): void => {
			event.preventDefault();
			updateChildWidth();
			allowUpdatePosition.current = false;
			startSuppressingTextSelection();
			onResizeStart?.(event, dir, elementRef);
		},
		[onResizeStart, updateChildWidth, startSuppressingTextSelection]
	);

	const onResizeStopHandler: RndResizeCallback = useCallback(
		(event, direction, elementRef, delta, position): void => {
			event.preventDefault();
			stopSuppressingTextSelection();
			innerHTMLComponent.current?.focus();
			onResizeStop?.(event, direction, elementRef, delta, position);
		},
		[onResizeStop, stopSuppressingTextSelection]
	);

	const onDragStartHandler: RndDragCallback = useCallback(
		(event, data): void => {
			event.preventDefault();
			setDragging(true);
			startSuppressingTextSelection();
			onDragStart?.(event, data);
		},
		[onDragStart, startSuppressingTextSelection]
	);

	const onDragStopHandler: RndDragCallback = useCallback(
		(event, data): void => {
			event.preventDefault();
			setDragging(false);
			stopSuppressingTextSelection();
			onDragStop?.(event, data);
		},
		[onDragStop, stopSuppressingTextSelection]
	);

	const handleResize = useCallback((): void => {
		if (allowUpdatePosition.current) {
			updatePosition();
		}
	}, [updatePosition]);

	useEffect(() => {
		if (rndElement.current) {
			if (initialSize) {
				rndElement.current.updateSize(initialSize);
			} else {
				const selfElement = rndElement.current.getSelfElement();

				if (selfElement) {
					rndElement.current.updateSize(getRndSelfElementBoundingClientRect(selfElement));
				}
			}
		}
	}, [initialSize]);

	useEffect(() => {
		if (!props.default) {
			const rndSelfElement = rndElement.current?.getSelfElement();

			if (rndSelfElement) {
				// Hide the container while it is being calculated for position and dimension to avoid flickering visually.
				rndSelfElement.style.opacity = "0";
			}
		}
	}, [props.default]);

	useEffect(() => {
		if (!props.default) {
			updatePosition();
		}
	}, [props.default, updatePosition]);

	useEffect(() => {
		if (
			innerHTMLComponent.current &&
			innerHTMLComponent.current.getElementsByClassName(addPrefix("handle")).length > 0
		) {
			setContainsHandle(true);
		}
	}, []);

	useEffect(() => {
		const handleMouseDown = (event: MouseEvent): void => {
			const target = event.target as Element;
			const isClickScrollBar = event.offsetX > target.clientWidth || event.offsetY > target.clientHeight;

			setDisabledDraggingWhenClickScrollBar(isClickScrollBar);
		};

		if (!disableDraggingProp) {
			rndElement.current?.resizableElement.current?.addEventListener("mousedown", handleMouseDown);
		}

		return () => {
			// oxlint-disable-next-line react-hooks/exhaustive-deps -- ref may re-point between setup and cleanup; the stale-listener risk is accepted here
			rndElement.current?.resizableElement.current?.removeEventListener("mousedown", handleMouseDown);
		};
	}, [disableDraggingProp]);

	const disableDragging = disableDraggingProp || disabledDraggingWhenClickScrollBar;
	const classNames = joinClassNames(
		className,
		{ [addPrefix("react-draggable-disabled")]: disableDragging },
		{ [addPrefix("react-draggable-contains-handle")]: containsHandle }
	);

	const handleElementRef = useCallback(
		(ref: HTMLDivElement): void => {
			innerHTMLComponent.current = ref;
			wrapperRef?.(ref);
		},
		[wrapperRef]
	);

	useResizeObserver({
		onResize: handleResize,
		targetRef: innerHTMLComponent
	});

	const animationDuration = useMemo((): number => {
		if (isAnimationEnabled) {
			return animationDurationTheme;
		}

		// Animation will be turned off when animationDuration = 0.
		return 0;
	}, [animationDurationTheme, isAnimationEnabled]);

	useEffect(() => {
		registerAnimationCloseHandler?.(() => setIsContentVisible(false));
	}, [registerAnimationCloseHandler]);

	return (
		<Portal closeOnEsc={closeOnEsc} onClose={handlePortalClose} closeOnOutsideClick={closeOnOutsideClick}>
			<Rnd
				{...restProps}
				style={{
					...restProps.style
				}}
				onResize={isContentVisible ? onResize : undefined}
				disableDragging={disableDragging}
				className={classNames}
				enableResizing={disableResizing ? disableAllResizing : enableResizing}
				bounds="window"
				dragHandleClassName={
					dragHandleClassName ? dragHandleClassName : containsHandle ? addPrefix("handle") : undefined
				}
				resizeHandleStyles={{ ...internalResizeHandleStyles, ...resizeHandleStyles }}
				ref={handleRndRef}
				onResizeStart={onResizeStartHandler}
				onResizeStop={onResizeStopHandler}
				onDragStart={onDragStartHandler}
				onDragStop={onDragStopHandler}
				maxWidth={maxWidth || window.innerWidth}
				minWidth={minWidth}
				maxHeight={maxHeight || window.innerHeight}
				minHeight={minHeight}
			>
				<TabSandbox focusOnOpen={focusOnOpen} focusBack={focusOnReferenceElementAfterEsc ?? true}>
					<CSSTransition
						nodeRef={innerHTMLComponent}
						in={isContentVisible}
						timeout={animationDuration}
						classNames={resizeAndDragContentAnimate}
						onExited={onClose}
					>
						<StyledResizeAndDragContentWrapper
							role="dialog"
							ref={handleElementRef}
							className={addPrefix("resize-and-drag-content-wrapper")}
							onClick={onClick}
							onKeyDown={onKeyDown}
							data-role={DataRoles.ResizeAndDragContainer}
							{...htmlAttributes}
							$disableDragging={disableDragging}
							$containsHandle={containsHandle}
							$isDragging={isDragging}
							$orientation={previousOrientation.current}
							$animationDuration={animationDuration}
						>
							{children}
						</StyledResizeAndDragContentWrapper>
					</CSSTransition>
				</TabSandbox>
			</Rnd>
		</Portal>
	);
};

ResizeAndDragContainer.displayName = "ResizeAndDragContainer";
