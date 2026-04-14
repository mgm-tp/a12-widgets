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

import type { KeyboardEvent, ReactNode } from "react";
import { Component } from "react";
import { Key } from "ts-key-enum";
import { styled } from "styled-components";

import { provider as DeviceDetector } from "../../common/main/device-detector.js";
import type { Orientation } from "../../common/main/alignment.js";
import { AttachedPortal } from "../../attached-portal/main/attached-portal.view.js";
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

export class Callout extends Component<CalloutProps, CalloutState> {
	static displayName = "Callout";
	static defaultProps = {
		closeOnEsc: true,
		closeOnOutsideClick: true,
		closeOnClickReferenceElement: true,
		orientationList: orientations
	};

	private calloutRef: HTMLElement | null = null;
	private isPhone = DeviceDetector.isPhone();

	constructor(props: CalloutProps) {
		super(props);

		this.state = {
			pointerPosition: {},
			calloutOrientation: "bottom-start"
		};

		bindMethods(this);
	}

	private handleCalloutRef(ref: HTMLDivElement | null): void {
		this.calloutRef = ref;
		this.props.wrapperRef?.(ref);
	}

	private handleOnVisibilityChange(isVisible: boolean): void {
		if (this.props.onClose && !isVisible) {
			this.props.onClose();
		}
	}

	private stopPropagation(event: KeyboardEvent): void {
		if (event.key !== Key.Tab && event.key !== Key.Escape) {
			event.stopPropagation();
		}
	}

	private getCalloutBodyRef(ref: HTMLElement | null): void {
		setTimeout(() => {
			if (!this.isPhone && ref && ref.scrollHeight - ref.clientHeight > 0) {
				ref.tabIndex = 0;
			}
		});
	}

	private onOrientationChange(orientation: Orientation): void {
		if (this.calloutRef && this.props.isPointerVisible) {
			const calloutRect = this.calloutRef.getBoundingClientRect();

			if (calloutRect.top <= 0) {
				return;
			}

			let top: number | undefined = undefined;

			if (orientation === "right" || orientation === "left") {
				const pointerHeight = this.calloutRef.querySelector(`[data-role=${baseDataRole}-pointer]`)?.clientHeight ?? 0;

				const referenceElementRect = this.props.referenceElement.getBoundingClientRect();
				const calloutInnerRect = this.calloutRef
					.querySelector(`[data-role=${baseDataRole}-inner]`)
					?.getBoundingClientRect() ?? {
					top: 0,
					bottom: 0,
					height: 0
				};

				const minTopValue = calloutInnerRect.top - calloutRect.top + pointerHeight;
				const maxTopValue = calloutInnerRect.bottom - calloutRect.top - pointerHeight;
				top = Math.max(referenceElementRect.top - calloutRect.top + referenceElementRect.height / 2, minTopValue);
				top = Math.min(top, maxTopValue);
				top = calloutInnerRect.height - pointerHeight > top ? top : undefined;
			}

			this.setState({
				pointerPosition: { top },
				calloutOrientation: orientation
			});
		}
	}

	private renderContent(): ReactNode {
		const shouldAutoWidth = this.props.boundToContentbox || this.props.resizeAndDragOptions?.initialSize?.width;

		return (
			<CalloutTpl
				id={this.props.id}
				className={this.props.className}
				style={shouldAutoWidth ? { width: "auto", ...this.props.style } : this.props.style}
				wrapperRef={this.handleCalloutRef}
				header={this.props.header}
				footer={this.props.footer}
				resizeAndDrag={!!this.props.resizeAndDragOptions}
				padding={this.props.padding}
				isPointerVisible={!this.isPhone && this.props.isPointerVisible}
				pointerPosition={this.state.pointerPosition}
				calloutOrientation={
					!this.isPhone && !this.props.resizeAndDragOptions ? this.state.calloutOrientation : undefined
				}
				bodyRef={this.getCalloutBodyRef}
				htmlAttributes={this.props.htmlAttributes}
			>
				{this.props.children}
			</CalloutTpl>
		);
	}

	private renderContainer(): ReactNode {
		const {
			resizeAndDragOptions,
			referenceElement,
			referenceElementRect,
			orientationList,
			closeOnEsc,
			closeOnOutsideClick,
			closeOnClickReferenceElement,
			onClose
		} = this.props;

		let defaultRnDOptions: CalloutWithResizeAndDragProps | undefined = resizeAndDragOptions;

		if (this.props.boundToContentbox && defaultRnDOptions) {
			const contentboxContentArea = getParentElement(
				referenceElement,
				(el) => el.getAttribute("data-role") === "contentbox-content"
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

		return this.isPhone ? (
			<ModalOverlay onClose={onClose} closeOnEsc={closeOnEsc} closeOnOutsideClick={closeOnOutsideClick} focusBack>
				{this.renderContent()}
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
				minHeight={this.props.minHeight}
			>
				{this.renderContent()}
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
				onVisibilityChange={this.handleOnVisibilityChange}
				onOrientationChange={this.onOrientationChange}
				onKeyDown={this.stopPropagation}
				referenceElementRect={referenceElementRect}
			>
				{this.renderContent()}
			</StyledAttachedPortal>
		);
	}

	render(): ReactNode {
		return this.renderContainer();
	}
}
