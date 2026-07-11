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

import type { MouseEvent, ReactElement } from "react";
import { useRef, useContext, useState, useEffect, useCallback, cloneElement } from "react";
import { Key } from "ts-key-enum";

import {
	addPrefix,
	getAllFocusableElements,
	IntersectionObserverHelper,
	joinClassNames
} from "../../common/main/utils.js";
import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { ModalNotification } from "../../modal-notification/main/modal-notification.view.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import type { Orientation } from "../../common/main/alignment.js";
import { ORIENTATION_LIST } from "../../common/main/alignment.js";
import { DataRoles } from "../../common/main/data-roles.js";

import { StyledTooltipContainer, StyledTooltipContent, StyledTooltipTriggerWrapper } from "./tooltip.styled.js";
import type { TooltipProps } from "./tooltip.api.js";

const baseClassName = addPrefix("tooltip");

const DELAY_TIME = 200;

/**
 * This tooltip widget uses the A12 plasma-design and makes its html and css class
 * structures transparent to the user, so the user does not have to deal with it.
 */
export function Tooltip(props: TooltipProps): ReactElement<TooltipProps> {
	const openByClick = useRef(false);
	const showTimeoutId = useRef<number | null>(null);
	const hideTimeoutId = useRef<number | null>(null);
	const focusTimeoutId = useRef<number | null>(null);
	const triggerElement = useRef<HTMLElement | null>(null);
	const tooltipElement = useRef<HTMLElement | null>(null);
	const portalElement = useRef<HTMLElement | null>(null);
	const tooltipContentRef = useRef<HTMLDivElement | null>(null);
	const intersectionObserverRef = useRef<IntersectionObserverHelper>(new IntersectionObserverHelper());

	const context = useContext(A11YLanguageContext);

	const [show, setShow] = useState(false);
	const [orientation, setOrientation] = useState<Orientation>("top-start");
	const [containerPosition, setContainerPosition] = useState({ top: 0, left: 0 });

	const clearTimeouts = (): void => {
		if (showTimeoutId.current !== null) {
			window.clearTimeout(showTimeoutId.current);
			showTimeoutId.current = null;
		}

		if (hideTimeoutId.current !== null) {
			window.clearTimeout(hideTimeoutId.current);
			hideTimeoutId.current = null;
		}

		if (focusTimeoutId.current !== null) {
			window.clearTimeout(focusTimeoutId.current);
			focusTimeoutId.current = null;
		}
	};

	const showTooltip = (): void => {
		if (triggerElement.current) {
			intersectionObserverRef.current.getVisibleElementRect(triggerElement.current);
		}

		setShow(true);
	};

	const hideTooltip = (): void => {
		intersectionObserverRef.current.disconnectObserver();
		intersectionObserverRef.current.visibleElementRect = undefined;
		setOrientation("top-start");
		setContainerPosition({ top: 0, left: 0 });
		openByClick.current = false;
		setShow(false);
	};

	const handleShowTooltip = (): void => {
		// Clear any pending hide timeout to prevent tooltip from hiding
		if (hideTimeoutId.current !== null) {
			window.clearTimeout(hideTimeoutId.current);
			hideTimeoutId.current = null;
		}

		// Only schedule showing the tooltip if it's not already visible
		if (!show) {
			showTimeoutId.current = window.setTimeout(showTooltip, DELAY_TIME);
		}
	};

	const handleClickEvent = (event: MouseEvent<HTMLElement>): void => {
		event.stopPropagation();
		openByClick.current = true;

		handleShowTooltip();
		(props.children.props as any).onClick?.(event);
	};

	const getTriggerElementWrapper = (ref: HTMLElement | null): void => {
		if (ref) {
			triggerElement.current = ref.firstChild as HTMLElement;
		}
	};

	const getTooltipElementRef = (ref: HTMLElement | null): void => {
		tooltipElement.current = ref;
	};

	const getPortalElementRef = (ref: HTMLDivElement | null): void => {
		portalElement.current = ref;
	};

	const handleMouseLeave = (): void => {
		clearTimeouts();
		hideTimeoutId.current = window.setTimeout(() => {
			hideTooltip();
		}, DELAY_TIME);
	};

	const handleTriggerElementMouseOut = (event: MouseEvent<HTMLElement>): void => {
		const relatedTarget = event.relatedTarget;

		// Only close the tooltip when the cursor moves outside the portal element and the tooltip element.
		if (relatedTarget !== portalElement.current && relatedTarget !== tooltipElement.current) {
			handleMouseLeave();
		}
	};

	useEffect(() => {
		if (show && openByClick.current) {
			focusTimeoutId.current = window.setTimeout(() => tooltipContentRef.current?.focus());
		}

		return (): void => {
			if (focusTimeoutId.current !== null) {
				window.clearTimeout(focusTimeoutId.current);
				focusTimeoutId.current = null;
			}
		};
	}, [show]);

	useEffect(() => {
		if (!show) {
			return;
		}

		const handleKeyUp = (event: KeyboardEvent): void => {
			if (
				event.key === Key.Tab &&
				show &&
				triggerElement.current &&
				tooltipElement.current &&
				(!tooltipElement.current.contains(document.activeElement) ||
					(tooltipElement.current === document.activeElement &&
						!getAllFocusableElements(tooltipElement.current).length))
			) {
				event.preventDefault();
				triggerElement.current.focus();
				hideTooltip();
			}
		};

		const handleKeyDown = (event: KeyboardEvent): void => {
			if (
				event.shiftKey &&
				event.key === Key.Tab &&
				show &&
				triggerElement.current &&
				tooltipElement.current &&
				(tooltipElement.current === document.activeElement ||
					getAllFocusableElements(tooltipElement.current)[0] === document.activeElement)
			) {
				event.preventDefault();
				triggerElement.current.focus();
				hideTooltip();
			}

			if (event.key === Key.Escape && tooltipElement.current) {
				hideTooltip();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return (): void => {
			clearTimeouts();
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [show]);

	const handleOrientationChange = useCallback((orientation: Orientation) => {
		setOrientation(orientation);

		if (portalElement.current) {
			setContainerPosition(portalElement.current.getBoundingClientRect());
		}
	}, []);

	const hasTouch = DeviceDetector.hasTouch();
	const isDesktopView = DeviceDetector.isDesktop() || props.useDesktopView;

	let tooltipContent;

	if (isDesktopView || !hasTouch) {
		const a11yTitleTooltip = context.tooltipTitles?.tooltip;
		const a11yHiddenText = DeviceDetector.isDesktop() && a11yTitleTooltip && (
			<HiddenText>{a11yTitleTooltip}</HiddenText>
		);
		const containerClassNames = joinClassNames(`${baseClassName}__container`, {
			[`${baseClassName}__container--${props.variant}`]: props.variant
		});

		tooltipContent = triggerElement.current && (
			<AttachedPortal
				adjustPositionToScreen
				closeOnOutsideClick
				hideOnReferenceElementPositionChange
				referenceElement={triggerElement.current}
				referenceElementRect={intersectionObserverRef.current.visibleElementRect}
				focusOnReferenceElementAfterClose={openByClick.current}
				className={props.className}
				focusOnOpen={false}
				wrapperRef={getPortalElementRef}
				onOrientationChange={handleOrientationChange}
				orientationList={ORIENTATION_LIST} // To override the default orientation of attached portal
				onVisibilityChange={setShow}
				onMouseOver={handleShowTooltip}
				onMouseLeave={handleMouseLeave}
			>
				<StyledTooltipContainer
					className={containerClassNames}
					ref={getTooltipElementRef}
					data-role={DataRoles.Tooltip}
					$tooltipOrientation={orientation}
					$variant={props.variant}
					$position={containerPosition}
					$referenceElement={triggerElement.current}
				>
					<StyledTooltipContent
						role="tooltip"
						ref={tooltipContentRef}
						className={`${baseClassName}__content`}
						data-role={DataRoles.Tooltip.Content}
						tabIndex={-1}
					>
						{props.text}
						{a11yHiddenText}
					</StyledTooltipContent>
				</StyledTooltipContainer>
			</AttachedPortal>
		);
	} else {
		const commonModalProps = {
			key: "tooltip",
			closeOnEsc: true,
			closeOnOutsideClick: true,
			onClose: hideTooltip,
			className: props.className
		};

		tooltipContent = props.variant ? (
			<ModalNotification
				{...commonModalProps}
				key={commonModalProps.key}
				enableCloseButton
				variant={props.variant === "hint" ? "info" : props.variant}
				wrapperRef={getTooltipElementRef}
			>
				{props.text}
			</ModalNotification>
		) : (
			<ModalOverlay {...commonModalProps} key={commonModalProps.key}>
				<ActionContentbox
					headingElements={null}
					headingButtons={<ContentBoxElements.CloseButton onClick={hideTooltip} />}
					wrapperRef={getTooltipElementRef}
					className={`${baseClassName}__container--mobile`}
				>
					{props.text}
				</ActionContentbox>
			</ModalOverlay>
		);
	}

	const classNames = joinClassNames(
		baseClassName,
		{ [`${baseClassName}--${props.variant}`]: props.variant },
		props.className
	);

	return (
		<StyledTooltipTriggerWrapper
			id={props.id}
			style={props.style}
			className={classNames}
			ref={getTriggerElementWrapper}
			data-role={props.dataRole ?? DataRoles.Tooltip.TriggerWrapper}
			role="tooltip"
			title=""
			$variant={props.variant}
		>
			{cloneElement(props.children, {
				...(props.children.props as any),
				onMouseOver: isDesktopView || !hasTouch ? handleShowTooltip : undefined,
				onMouseOut: isDesktopView || !hasTouch ? handleTriggerElementMouseOut : undefined,
				onClick: handleClickEvent
			})}
			{triggerElement.current && show && !props.disabled ? tooltipContent : undefined}
		</StyledTooltipTriggerWrapper>
	);
}

Tooltip.displayName = "Tooltip";
