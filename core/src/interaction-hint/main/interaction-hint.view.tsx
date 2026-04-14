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
import type { ReactElement, MouseEvent as ReactMouseEvent } from "react";
import { useMemo, useCallback, useEffect, useRef, useState } from "react";

import type { Orientation } from "../../common/main/alignment.js";
import { provider } from "../../common/main/device-detector.js";
import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { IntersectionObserverHelper, getIframeOffset } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { InteractionHintProps } from "./interaction-hint.api.js";
import { StyledInteractionHintContainer, StyledInteractionHintContent } from "./interaction-hint.styled.js";

const DELAY_TIME = 500;
const CURSOR_OFFSET = { x: 15, y: 15 };

const normalizeRect = (rect: DOMRect): DOMRect =>
	new DOMRect(Math.round(rect.left), Math.round(rect.top), Math.round(rect.width), Math.round(rect.height));

const isPopupTrigger = (element: HTMLElement | null): boolean => {
	const dataRole = element?.getAttribute("data-role");

	return dataRole === DataRoles.Popup.TriggerElement || dataRole === DataRoles.HeaderTrigger;
};

export function InteractionHint(props: InteractionHintProps): ReactElement | null {
	const {
		className,
		title,
		referenceElementRef,
		variant,
		focusable = true,
		position,
		followCursor = false,
		hideArrow = false
	} = props;

	const [orientation, setOrientation] = useState<Orientation>("top");
	const [containerRect, setContainerRect] = useState<DOMRect>();
	const [showHint, setShowHint] = useState(false);
	const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
	const [shouldFollowCursor, setShouldFollowCursor] = useState(followCursor);

	const interactionHintRef = useRef<HTMLDivElement | null>(null);
	const timeoutId = useRef<number | null>(null);
	const portalElement = useRef<HTMLElement | null>(null);
	const rafId = useRef<number | null>(null);
	const intersectionObserverRef = useRef<IntersectionObserverHelper>(new IntersectionObserverHelper());

	const isDesktop = provider.isDesktop();
	// Hide arrow when explicitly set or when following cursor (not triggered by focus)
	const shouldHideArrow = hideArrow || (followCursor && shouldFollowCursor);

	const getPortalElementRef = (ref: HTMLDivElement | null): void => {
		portalElement.current = ref;
	};

	const clearTimeout = (): void => {
		if (timeoutId.current !== null) {
			window.clearTimeout(timeoutId.current);
			timeoutId.current = null;
		}
	};

	const handleMouseMove = useCallback(
		(event: MouseEvent): void => {
			if (!followCursor) {
				return;
			}

			if (rafId.current) {
				cancelAnimationFrame(rafId.current);
			}

			rafId.current = requestAnimationFrame(() => {
				setCursorPosition({ x: event.clientX, y: event.clientY });
			});
		},
		[followCursor]
	);

	const handleHintMouseOver = useCallback(
		(event: ReactMouseEvent<HTMLElement> | MouseEvent): void => {
			clearTimeout();

			if (referenceElementRef.current) {
				intersectionObserverRef.current.getVisibleElementRect(referenceElementRef.current);
			}

			if (followCursor) {
				setCursorPosition({ x: event.clientX, y: event.clientY });
			}

			timeoutId.current = window.setTimeout(() => {
				event.stopPropagation();
				setShowHint(true);
			}, DELAY_TIME);
		},
		[referenceElementRef, followCursor]
	);

	const handleHintMouseLeave = useCallback((): void => {
		intersectionObserverRef.current.disconnectObserver();
		clearTimeout();

		if (!followCursor) {
			setCursorPosition(null);
		}

		// Hide immediately to prevent multiple hints showing while moving cursor
		setShowHint(false);
		setCursorPosition(null);
	}, [followCursor]);

	const handleOrientationChange = useCallback((newOrientation: Orientation): void => {
		setOrientation(newOrientation);

		if (interactionHintRef.current) {
			setContainerRect(interactionHintRef.current.getBoundingClientRect());
		}
	}, []);

	useEffect(() => {
		const referenceElement = title ? referenceElementRef?.current : null;

		if (!referenceElement) {
			return;
		}

		const handleShowHintPopupMenu = (): (() => void) | void => {
			const popupMenu = document.querySelector(`[data-role=${DataRoles.Popup.Menu}]`);

			if (!popupMenu) {
				setShowHint(true);

				return;
			}

			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					for (const node of mutation.removedNodes) {
						const hasPopupMenu = (node as HTMLElement).querySelector(`[data-role=${DataRoles.Popup.Menu}]`);

						if (hasPopupMenu && document.activeElement === referenceElementRef.current) {
							setShowHint(true);
						}
					}
				}
			});

			observer.observe(document.body, { childList: true, subtree: true });

			return () => {
				observer.disconnect();
			};
		};

		const handleFocus = (): void => {
			if (!isDesktop && isPopupTrigger(referenceElementRef.current)) {
				handleShowHintPopupMenu();

				return;
			}

			setShouldFollowCursor(false);
			setShowHint(true);
		};

		const handleMouseOver = (event: MouseEvent): void => {
			if (!isDesktop) {
				return;
			}

			setShouldFollowCursor(followCursor);
			handleHintMouseOver(event);
		};

		const handleMouseOut = (event: MouseEvent): void => {
			// Clear any pending show timeout when mouse leaves
			clearTimeout();
			const relatedTarget = event.relatedTarget as Node | null;

			const shouldCloseHint = followCursor
				? !referenceElement.contains(relatedTarget)
				: relatedTarget !== portalElement.current && relatedTarget !== interactionHintRef.current;

			if (shouldCloseHint) {
				handleHintMouseLeave();
			}
		};

		const handleFocusOut = (event: FocusEvent): void => {
			const relatedTarget = event.relatedTarget;

			if (relatedTarget !== portalElement.current && relatedTarget !== interactionHintRef.current) {
				setShowHint(false);
				setShouldFollowCursor(followCursor);
			}
		};

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (event.key === Key.Escape) {
				setShowHint(false);
			}
		};

		const hideHintOnClick = (): void => {
			setShowHint(false);
		};

		referenceElement.addEventListener("mouseover", handleMouseOver);
		referenceElement.addEventListener("mouseout", handleMouseOut);
		referenceElement.addEventListener("click", hideHintOnClick);

		if (followCursor) {
			referenceElement.addEventListener("mousemove", handleMouseMove);
		}

		if (focusable) {
			referenceElement.addEventListener("keydown", handleKeyDown);
			referenceElement.addEventListener("focus", handleFocus);
			referenceElement.addEventListener("focusout", handleFocusOut);
		}

		return (): void => {
			referenceElement.removeEventListener("mouseover", handleMouseOver);
			referenceElement.removeEventListener("mouseout", handleMouseOut);
			referenceElement.removeEventListener("click", hideHintOnClick);

			if (followCursor) {
				referenceElement.removeEventListener("mousemove", handleMouseMove);

				if (rafId.current) {
					cancelAnimationFrame(rafId.current);
				}
			}

			if (focusable) {
				referenceElement.removeEventListener("keydown", handleKeyDown);
				referenceElement.removeEventListener("focus", handleFocus);
				referenceElement.removeEventListener("focusout", handleFocusOut);
			}
		};
	}, [
		focusable,
		handleHintMouseLeave,
		handleHintMouseOver,
		handleMouseMove,
		followCursor,
		isDesktop,
		referenceElementRef,
		title
	]);

	useEffect(() => {
		const tooltipElement = title
			? referenceElementRef?.current?.closest(`[data-role=${DataRoles.Tooltip}]`)
			: undefined;
		const popupMenu = document.querySelector(`[data-role=${DataRoles.Popup.Menu}]`);

		// Prevent show hint when opening tooltip or popup menu
		if (tooltipElement || popupMenu) {
			setShowHint(false);
		}
	}, [referenceElementRef, title]);

	useEffect(() => {
		if (document.activeElement === referenceElementRef.current) {
			setShowHint(true);
		}
	}, [referenceElementRef]);

	// Handle hint visibility during drag/resize operations
	useEffect(() => {
		const referenceElement = title ? referenceElementRef?.current : null;

		if (!referenceElement) {
			return;
		}

		const handleMouseDown = (): void => setShowHint(false);
		const handleMouseUp = (): void => setShowHint(true);

		referenceElement.addEventListener("mousedown", handleMouseDown);
		referenceElement.addEventListener("mouseup", handleMouseUp);

		return (): void => {
			referenceElement.removeEventListener("mousedown", handleMouseDown);
			referenceElement.removeEventListener("mouseup", handleMouseUp);
		};
	}, [title, referenceElementRef]);

	// Handle hint visibility on window resize
	useEffect(() => {
		if (!title) {
			return;
		}

		let resizeTimeout: number | null = null;

		const handleResize = (): void => {
			if (resizeTimeout !== null) {
				window.clearTimeout(resizeTimeout);
			}

			setShowHint(false);

			resizeTimeout = window.setTimeout(() => {
				if (document.activeElement === referenceElementRef.current) {
					setShowHint(true);
				}
			}, DELAY_TIME);
		};

		window.addEventListener("resize", handleResize);

		return (): void => {
			window.removeEventListener("resize", handleResize);

			if (resizeTimeout !== null) {
				window.clearTimeout(resizeTimeout);
			}
		};
	}, [title, referenceElementRef]);

	// Reset orientation when hint is hidden so the next open always triggers a fresh orientation
	// calculation in AttachedPortal, ensuring correct positioning for large content.
	useEffect(() => {
		if (!showHint) {
			setOrientation("top");
		}
	}, [showHint]);

	// Add offset to cursor position for followCursor mode (only when triggered by hover, not focus)
	const offsetCursorPosition = useMemo(
		() =>
			shouldFollowCursor && cursorPosition
				? { top: cursorPosition.y + CURSOR_OFFSET.y, left: cursorPosition.x + CURSOR_OFFSET.x }
				: undefined,
		[cursorPosition, shouldFollowCursor]
	);

	const getReferenceRect = useCallback((): DOMRect | undefined => {
		if (shouldFollowCursor && cursorPosition) {
			return normalizeRect(new DOMRect(cursorPosition.x, cursorPosition.y, 0, 0));
		}

		const baseRect =
			intersectionObserverRef.current.visibleElementRect ?? referenceElementRef.current?.getBoundingClientRect();

		if (!baseRect) {
			return undefined;
		}

		const iframeOffset = getIframeOffset(referenceElementRef.current, document);
		const adjustedLeft = baseRect.left + iframeOffset.left;
		const adjustedTop = baseRect.top + iframeOffset.top;

		if (position) {
			return normalizeRect(
				new DOMRect(adjustedLeft + (position === "right" ? baseRect.width : 0), adjustedTop, 0, baseRect.height)
			);
		}

		return normalizeRect(new DOMRect(adjustedLeft, adjustedTop, baseRect.width, baseRect.height));
	}, [cursorPosition, referenceElementRef, shouldFollowCursor, position]);

	const referenceElementRect = getReferenceRect();

	const hideOnPositionChange = useMemo(() => {
		return !!(referenceElementRef && position);
	}, [referenceElementRef, position]);

	if (!(showHint && title && referenceElementRef?.current)) {
		return null;
	}

	return (
		<AttachedPortal
			referenceElement={shouldFollowCursor ? undefined : referenceElementRef.current}
			referenceElementRect={shouldFollowCursor ? undefined : referenceElementRect}
			position={offsetCursorPosition}
			orientation={orientation}
			className={className}
			focusOnOpen={false}
			orientationList={shouldFollowCursor ? ["bottom-start"] : ["top", "bottom"]}
			fixedOrientation
			adjustPositionToScreen={!shouldFollowCursor}
			closeOnOutsideClick
			closeOnClickReferenceElement={false}
			wrapperRef={getPortalElementRef}
			onOrientationChange={handleOrientationChange}
			onMouseOver={handleHintMouseOver}
			onMouseLeave={handleHintMouseLeave}
			hideOnReferenceElementPositionChange={hideOnPositionChange}
		>
			<StyledInteractionHintContainer
				ref={interactionHintRef}
				role="dialog"
				className={className}
				data-role={DataRoles.InteractionHint}
				$orientation={orientation}
				$variant={variant}
				$followCursor={shouldFollowCursor}
				$referenceElementRect={referenceElementRect}
				$containerRect={containerRect}
				$showArrow={!shouldHideArrow}
				$position={position}
			>
				<StyledInteractionHintContent data-role={DataRoles.InteractionHint.Content}>
					{title}
				</StyledInteractionHintContent>
			</StyledInteractionHintContainer>
		</AttachedPortal>
	);
}

InteractionHint.displayName = "InteractionHint";
