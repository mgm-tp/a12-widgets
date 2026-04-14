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
import { styled, css } from "styled-components";
import type { TouchEvent as ReactTouchEvent, MouseEvent, KeyboardEvent, FC } from "react";
import { useRef, useLayoutEffect, useEffect, useMemo } from "react";

import { Portal } from "../../portal/main/portal.view.js";
import { provider } from "../../common/main/device-detector.js";
import { TabSandbox } from "../../common/main/tab-sandbox.view.js";
import { joinClassNames, addPrefix, handleAriaHiddenOfWrapper, getParentElement } from "../../common/main/utils.js";
import {
	StyledContentBox,
	StyledContentBoxContent,
	StyledContentBoxHeading
} from "../../contentbox/main/template/contentbox.tpl.styled.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ModalOverlayProps } from "./modal-overlay.api.js";

const modalOverlayClassName = addPrefix("modalOverlay");
const modalOverlayContainerClassName = `${modalOverlayClassName}__container`;
const portalClassName = addPrefix("portal");
const attachedPortalClassName = addPrefix("attached-portal");

export const StyledModalOverlayWrapper = styled.div.withConfig({ displayName: "StyledModalOverlayWrapper-sc-" })<{
	fitToParent?: boolean;
}>(({ theme, fitToParent }) => {
	const { modalOverlay } = theme.components;

	return css`
		align-items: center;
		background: ${modalOverlay.background};
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
		left: 0;
		position: fixed;
		top: 0;
		width: 100%;
		${fitToParent &&
		css`
			position: absolute;
		`}
	`;
});

export const StyledModalOverlayContainer = styled.div.withConfig({ displayName: "StyledModalOverlayContainer-sc-" })<{
	$fullscreen?: boolean;
	$noGutter?: boolean;
	$isPhone?: boolean;
	$fitToParent?: boolean;
	$preventScroll?: boolean;
	$maxWidth?: number | string;
}>(({ theme, $noGutter, $fullscreen, $isPhone, $fitToParent, $maxWidth, $preventScroll }) => {
	const { modalOverlay } = theme.components;

	return css`
		-webkit-tap-highlight-color: transparent;
		display: flex;
		margin: ${$noGutter ? 0 : modalOverlay.gutterMargin};
		outline: 1px solid transparent;
		overflow: auto;
		flex-shrink: 1;

		${StyledContentBox} {
			outline: none;
			${StyledContentBoxContent} {
				font-size: ${modalOverlay.contentBox?.fontSize};
			}
		}

		& > * {
			background-color: ${modalOverlay.container.background};
			overflow: auto;
		}
		@media only screen and (max-width: ${modalOverlay.container.maxWidth}) {
			width: ${$noGutter ? "100%" : `calc(100% - ${modalOverlay.gutterHorizontalMargin} * 2)`};
		}

		${$preventScroll &&
		css`
			touch-action: none;
		`}

		${$fullscreen
			? css`
					align-items: center;
					background-color: transparent;
					height: 100%;
					justify-content: center;
					position: relative;
					width: ${$noGutter ? "100%" : `calc(100% - ${modalOverlay.gutterHorizontalMargin} * 2)`};

					${$noGutter &&
					css`
						${StyledContentBox} {
							border-radius: 0;
						}
					`}
				`
			: css`
					max-width: ${modalOverlay.container.maxWidth};

					${$fitToParent
						? css`
								width: calc(100% - ${modalOverlay.gutterHorizontalMargin} * 2);
							`
						: $maxWidth
							? css`
									max-width: ${typeof $maxWidth === "number" ? `${$maxWidth}px` : $maxWidth};
								`
							: css`
									width: ${modalOverlay.container.maxWidth};
								`}

					${!$noGutter &&
					css`
						*${StyledContentBox} {
							width: calc(100vw - ${modalOverlay.gutterHorizontalMargin} * 2);
						}
					`}
				`}

		${$isPhone &&
		css`
			${StyledContentBoxHeading} {
				min-height: ${theme.components.modalOverlay.mobileContentboxHeaderMinHeight};
			}
		`}
	`;
});

export const ModalOverlay: FC<ModalOverlayProps> = ({
	focusBack = true,
	closeOnEsc = true,
	focusOnOpen = true,
	noGutter = false,
	...props
}) => {
	const {
		onClose: onCloseProp,
		onOpen,
		children,
		closeOnOutsideClick,
		fitToParent,
		fullscreen,
		id,
		preventScroll,
		style,
		maxWidth,
		className: classNameProp,
		htmlAttributes,
		containerAttributes
	} = props;
	const outerRef = useRef<HTMLDivElement | null>(null);
	const innerRef = useRef<HTMLDivElement | null>(null);
	const parent = useRef<HTMLElement | null>(null);
	const parentOverflow = useRef<{ x: string; y: string }>({ x: "", y: "" });
	const isPhone = provider.isPhone();
	const onClose = useMemo(() => {
		if (!onCloseProp) {
			return undefined;
		}

		return (): void => {
			/* Currently, Firefox does not trigger the blur or focusout event if the currently focused element is removed.
This causes inconsistencies in tracking activeElement and previousElement compared to other browsers.
To resolve this, we manually trigger the blur event.*/
			if (
				outerRef.current?.contains(document.activeElement) &&
				navigator.userAgent.toLowerCase().indexOf("firefox") > -1
			) {
				(document.activeElement as HTMLElement)?.blur();
			}

			onCloseProp?.();
		};
	}, [onCloseProp]);

	const handleTouchMove = (event: ReactTouchEvent<HTMLElement>): void => {
		if (preventScroll) {
			event.preventDefault();
		}
	};

	const handleOuterClick = (event: MouseEvent<HTMLElement>): void => {
		const target = event.target as HTMLElement;
		event.stopPropagation();

		if (innerRef.current?.contains(target)) {
			return;
		}

		if (closeOnOutsideClick && outerRef.current === target) {
			onClose?.();
		} else {
			innerRef.current?.focus();
		}
	};

	const handleOuterMouseDown = (event: MouseEvent<HTMLElement>): void => {
		const target = event.target as HTMLElement;

		if (innerRef.current?.contains(target)) {
			return;
		}

		if (closeOnOutsideClick && outerRef.current === target) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	const handleOuterKeyDown = (event: KeyboardEvent): void => {
		if (event.key === Key.Enter) {
			event.stopPropagation();
		}

		const portalElement = getParentElement(
			event.target as HTMLElement,
			(currentParent) =>
				currentParent.classList.contains(portalClassName) || currentParent.classList.contains(attachedPortalClassName)
		);

		if (event.key === Key.Escape && onClose && closeOnEsc) {
			if (fitToParent) {
				if (innerRef.current && innerRef.current.contains(event.target as HTMLElement)) {
					onClose();
				}
			} else if (innerRef.current) {
				const modalPortal = getParentElement(
					innerRef.current,
					(currentParent) =>
						currentParent.classList.contains(portalClassName) ||
						currentParent.classList.contains(attachedPortalClassName)
				);

				if (modalPortal === portalElement) {
					onClose();
				}
			}
		}
	};

	useLayoutEffect(() => {
		const disableBodyScroll = (ref: HTMLElement): void => {
			ref.ontouchmove = (event: TouchEvent): void => {
				// Fixing A12W-10361: When using a stylus like Apple Pencil, a simple touch of the stylus trigger multiple touchmove event due to the stylus high precision.
				// If we prevent the event, the click event will be ignored and user cannot interact with modal using stylus.
				// Therefore, it's best to just ignore the touchmove when using stylus and accept the fact that it might trigger scroll of layer below.
				if (event.touches[0] && (event.touches[0] as TouchInit).touchType === "stylus") {
					return;
				}

				let element = event.target as HTMLElement;

				while (element !== ref.parentElement && element.parentElement !== null) {
					const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
					const hasVerticalScroll = element.scrollHeight > element.clientHeight;

					if (hasHorizontalScroll || hasVerticalScroll) {
						return;
					}

					element = element.parentElement;
				}

				if (event.targetTouches.length === 1) {
					event.preventDefault();
				}
			};
		};

		const updateParentStyle = (reset = false): void => {
			if (parent.current) {
				parent.current.style.position = reset ? "" : "relative";

				if (!reset) {
					if (document.getElementsByClassName(modalOverlayClassName).length === 1) {
						parentOverflow.current = {
							x: parent.current.style.overflowX,
							y: parent.current.style.overflowY
						};
					}

					parent.current.style.overflowX = "hidden";
					parent.current.style.overflowY = "hidden";
				} else {
					parent.current.style.overflowX = parentOverflow.current.x;
					parent.current.style.overflowY = parentOverflow.current.y;
				}
			}
		};

		const outerRefValue = outerRef.current;

		if (fitToParent) {
			parent.current = outerRefValue && outerRefValue.parentElement;
			updateParentStyle();
		}

		if (outerRefValue && provider.hasTouch()) {
			disableBodyScroll(outerRefValue);
		}

		return (): void => {
			if (fitToParent) {
				// Handle style and focus in case of multiple modals in the same parent
				const previousSibling = outerRefValue?.previousElementSibling;
				const isOverlayRemain = (element?: Element): boolean | undefined =>
					!element?.contains(document.activeElement) && element?.classList.contains(modalOverlayClassName);
				updateParentStyle(!!(previousSibling && !isOverlayRemain(previousSibling)));

				if (onClose && previousSibling && isOverlayRemain(previousSibling)) {
					(previousSibling.firstChild as HTMLElement)?.focus();
				}
			}
		};
	}, [fitToParent, onClose]);

	useEffect(() => {
		if (innerRef.current) {
			onOpen?.();
		}
	}, [onOpen]);

	useEffect(() => {
		const MODAL_OVERLAY_SELECTOR = `[data-role=${DataRoles.Modal.Overlay}]`;
		const modalOverlays = document.querySelectorAll(MODAL_OVERLAY_SELECTOR);
		const applicationFrameHeader = document.querySelector(`[data-role=${DataRoles.ApplicationFrame.Header}]`);

		modalOverlays.forEach((modalOverlay) => {
			if (modalOverlay !== outerRef.current) {
				modalOverlay.setAttribute("aria-hidden", "true");
			}
		});

		if (fitToParent) {
			handleAriaHiddenOfWrapper(false);
			applicationFrameHeader?.removeAttribute("aria-hidden");
		} else {
			handleAriaHiddenOfWrapper();
			applicationFrameHeader?.setAttribute("aria-hidden", "true");
		}

		return (): void => {
			modalOverlays.forEach((modalOverlay) => {
				modalOverlay.removeAttribute("aria-hidden");
			});

			// Reset only if there are no more modal overlays
			if (!document.querySelector(MODAL_OVERLAY_SELECTOR)) {
				handleAriaHiddenOfWrapper(false);
				applicationFrameHeader?.removeAttribute("aria-hidden");
			}
		};
	}, [fitToParent]);

	const className = joinClassNames(
		{ [`${modalOverlayClassName}--fullscreen`]: fullscreen && !fitToParent },
		{ [`${modalOverlayClassName}--noGutter`]: noGutter },
		modalOverlayClassName,
		{ [`${modalOverlayClassName}--fitToParent`]: fitToParent },
		{ [`${modalOverlayClassName}--mobile`]: isPhone },
		classNameProp
	);

	const content = (
		<StyledModalOverlayWrapper
			fitToParent={fitToParent}
			className={className}
			style={style}
			id={id}
			data-role={DataRoles.Modal.Overlay}
			ref={outerRef}
			onClick={handleOuterClick}
			onKeyDown={handleOuterKeyDown}
			onTouchMoveCapture={handleTouchMove}
			onMouseDown={handleOuterMouseDown}
			{...htmlAttributes}
		>
			<TabSandbox focusBack={focusBack} focusOnOpen={focusOnOpen}>
				<StyledModalOverlayContainer
					ref={innerRef}
					tabIndex={0}
					className={modalOverlayContainerClassName}
					role="dialog"
					data-role={DataRoles.Modal.OverlayContent}
					aria-modal={true}
					{...containerAttributes}
					$fitToParent={fitToParent}
					$isPhone={isPhone}
					$maxWidth={maxWidth}
					$preventScroll={preventScroll}
					$noGutter={noGutter}
					$fullscreen={fullscreen}
				>
					{children}
				</StyledModalOverlayContainer>
			</TabSandbox>
		</StyledModalOverlayWrapper>
	);

	return fitToParent ? content : <Portal>{content}</Portal>;
};

ModalOverlay.displayName = "ModalOverlay";
