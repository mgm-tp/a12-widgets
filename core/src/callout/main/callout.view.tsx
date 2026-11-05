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

import type { FC, KeyboardEvent, ReactNode } from "react";
import { Component, useCallback, useRef, useState } from "react";
import { styled } from "styled-components";
import { Key } from "ts-key-enum";

import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
import { DataRoles } from "../../common/index.js";
import type { Orientation } from "../../common/main/alignment.js";
import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import { bindMethods, getParentElement } from "../../common/main/utils.js";
import { ModalOverlay } from "../../modal-overlay/main/modal-overlay.view.js";
import { ResizeAndDragContainer } from "../../resize-and-drag-container/main/resize-and-drag-container.view.js";

import type { CalloutProps, CalloutWithResizeAndDragProps } from "./callout.api.js";
import { CalloutTpl } from "./template/callout.tpl.view.js";

const baseDataRole = "callout";
const orientations: Orientation[] = ["bottom-start", "bottom-end", "top-start", "top-end"];

const StyledAttachedPortal = styled(AttachedPortal).withConfig({ displayName: "StyledAttachedPortal-sc-" })`
	position: fixed;
`;

interface CalloutState {
	pointerPosition: {
		top?: number;
	};
	calloutOrientation: Orientation;
}

function stopPropagation(event: KeyboardEvent): void {
	if (event.key !== Key.Tab && event.key !== Key.Escape) {
		event.stopPropagation();
	}
}

function handleCalloutBodyRef(ref: HTMLElement | null): void {
	setTimeout(() => {
		if (!DeviceDetector.isPhone() && ref && ref.scrollHeight - ref.clientHeight > 0) {
			ref.tabIndex = 0;
		}
	});
}

const CalloutImpl: FC<CalloutProps> = ({
	closeOnEsc,
	closeOnOutsideClick,
	closeOnClickReferenceElement,
	orientationList,
	id,
	className,
	style,
	wrapperRef,
	header,
	footer,
	padding,
	isPointerVisible,
	htmlAttributes,
	children,
	referenceElement,
	referenceElementRect,
	boundToContentbox,
	resizeAndDragOptions,
	onClose,
	minHeight
}) => {
	const [{ pointerPosition, calloutOrientation }, setCalloutState] = useState<CalloutState>({
		pointerPosition: {},
		calloutOrientation: "bottom-start"
	});
	const calloutRef = useRef<HTMLElement | null>(null);
	const isPhone = DeviceDetector.isPhone();

	// Ref stays stable so wrapperRef fires once on mount, same as the old class did.
	const wrapperRefProp = useRef(wrapperRef);
	wrapperRefProp.current = wrapperRef;

	const handleCalloutRef = useCallback((ref: HTMLDivElement | null): void => {
		calloutRef.current = ref;
		wrapperRefProp.current?.(ref);
	}, []);

	const handleOnVisibilityChange = (isVisible: boolean): void => {
		if (onClose && !isVisible) {
			onClose();
		}
	};

	const onOrientationChange = (orientation: Orientation): void => {
		const callout = calloutRef.current;

		if (callout && isPointerVisible) {
			const calloutRect = callout.getBoundingClientRect();

			if (calloutRect.top <= 0) {
				return;
			}

			let top: number | undefined = undefined;

			if (orientation === "right" || orientation === "left") {
				const pointerHeight = callout.querySelector(`[data-role=${baseDataRole}-pointer]`)?.clientHeight ?? 0;

				const referenceRect = referenceElement.getBoundingClientRect();
				const calloutInnerRect = callout
					.querySelector(`[data-role=${baseDataRole}-inner]`)
					?.getBoundingClientRect() ?? {
					top: 0,
					bottom: 0,
					height: 0
				};

				const minTopValue = calloutInnerRect.top - calloutRect.top + pointerHeight;
				const maxTopValue = calloutInnerRect.bottom - calloutRect.top - pointerHeight;
				top = Math.max(referenceRect.top - calloutRect.top + referenceRect.height / 2, minTopValue);
				top = Math.min(top, maxTopValue);
				top = calloutInnerRect.height - pointerHeight > top ? top : undefined;
			}

			setCalloutState({
				pointerPosition: { top },
				calloutOrientation: orientation
			});
		}
	};

	const renderContent = (): ReactNode => {
		const shouldAutoWidth = boundToContentbox || resizeAndDragOptions?.initialSize?.width;

		return (
			<CalloutTpl
				id={id}
				className={className}
				style={shouldAutoWidth ? { width: "auto", ...style } : style}
				wrapperRef={handleCalloutRef}
				header={header}
				footer={footer}
				resizeAndDrag={!!resizeAndDragOptions}
				padding={padding}
				isPointerVisible={!isPhone && isPointerVisible}
				pointerPosition={pointerPosition}
				calloutOrientation={!isPhone && !resizeAndDragOptions ? calloutOrientation : undefined}
				bodyRef={handleCalloutBodyRef}
				htmlAttributes={htmlAttributes}
			>
				{children}
			</CalloutTpl>
		);
	};

	let defaultRnDOptions: CalloutWithResizeAndDragProps | undefined = resizeAndDragOptions;

	if (boundToContentbox && defaultRnDOptions) {
		const contentboxContentArea = getParentElement(
			referenceElement,
			(el) => el.getAttribute("data-role") === `${DataRoles.Contentbox.Content}`
		);

		if (contentboxContentArea) {
			const { width, left } = contentboxContentArea.getBoundingClientRect();

			defaultRnDOptions = {
				...defaultRnDOptions,
				initialSize: { height: defaultRnDOptions?.initialSize?.height ?? "", width },
				initialPosition: { ...defaultRnDOptions?.initialPosition, x: left }
			};
		}
	}

	return isPhone ? (
		<ModalOverlay onClose={onClose} closeOnEsc={closeOnEsc} closeOnOutsideClick={closeOnOutsideClick} focusBack>
			{renderContent()}
		</ModalOverlay>
	) : resizeAndDragOptions ? (
		<ResizeAndDragContainer
			{...defaultRnDOptions}
			referenceElement={referenceElement}
			onClose={onClose}
			closeOnEsc={closeOnEsc}
			closeOnOutsideClick={closeOnOutsideClick}
			orientationList={orientationList}
			fixedOrientation
			minHeight={minHeight}
		>
			{renderContent()}
		</ResizeAndDragContainer>
	) : (
		<StyledAttachedPortal
			closeOnEsc={closeOnEsc}
			closeOnOutsideClick={closeOnOutsideClick}
			closeOnClickReferenceElement={closeOnClickReferenceElement}
			hideOnReferenceElementPositionChange
			referenceElement={referenceElement}
			adjustPositionToScreen
			orientationList={orientationList}
			fixedOrientation
			focusOnReferenceElementAfterClose
			onVisibilityChange={handleOnVisibilityChange}
			onOrientationChange={onOrientationChange}
			onKeyDown={stopPropagation}
			referenceElementRect={referenceElementRect}
		>
			{renderContent()}
		</StyledAttachedPortal>
	);
};

CalloutImpl.displayName = "CalloutImpl";

/**
 * A pop-up attached to a reference element, rendered into a portal. Opens as a modal overlay on phones;
 * becomes a resizable, draggable container when `resizeAndDragOptions` is set.
 *
 * @remarks
 * Built as a function component under the hood. `Callout` stays a class shell around it, so refs,
 * subclassing and `defaultProps` still work. A subclass overriding one of the old private methods no
 * longer has any effect; new code should not rely on any of this.
 */
export class Callout extends Component<CalloutProps> {
	static displayName = "Callout";
	static defaultProps = {
		closeOnEsc: true,
		closeOnOutsideClick: true,
		closeOnClickReferenceElement: true,
		orientationList: orientations
	};

	constructor(props: CalloutProps) {
		super(props);
		// Subclasses rely on this constructor to bind their own methods.
		bindMethods(this);
	}

	render(): ReactNode {
		return <CalloutImpl {...this.props} />;
	}
}
