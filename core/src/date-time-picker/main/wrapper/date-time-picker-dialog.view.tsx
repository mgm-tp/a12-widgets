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

import type { ComponentType, ReactNode, ComponentClass } from "react";
import { Component } from "react";

import { provider } from "../../../common/main/device-detector.js";
import { ModalOverlay } from "../../../modal-overlay/main/modal-overlay.view.js";
import { AttachedPortal } from "../../../attached-portal/main/attached-portal.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { DateTimePickerProps } from "../date-time-picker.api.js";

import type { DateTimePickerDialogProps } from "./date-time-picker-dialog.api.js";

export function DateTimePickerDialog<T extends DateTimePickerProps>(
	Picker: ComponentType<T>
): ComponentClass<DateTimePickerDialogProps<T>> {
	return class DateTimePickerDialog extends Component<DateTimePickerDialogProps<T>, { show: boolean }> {
		static displayName = "DateTimePickerDialog";

		updateElementPosition: (() => void) | undefined;

		constructor(props: DateTimePickerDialogProps<T>) {
			super(props);
			this.state = { show: true };
			props.close?.(() => {
				this.setState({ show: false });
			});
		}

		componentDidUpdate(): void {
			this.updateElementPosition?.();
		}

		render(): ReactNode {
			if (!this.state.show) {
				return undefined;
			}

			return provider.hasTouch() ? (
				<ModalOverlay
					preventScroll
					closeOnOutsideClick={this.props.closeOnBackdropClick ?? provider.isDesktop()}
					noGutter
					onClose={() => {
						this.props.pickerProps?.onClose?.();
					}}
					containerAttributes={this.props.pickerProps?.mobilePickerAttributes}
				>
					<Picker
						{...(this.props.pickerProps || ({} as T))}
						mobileMode
						mobilePickerAttributes={undefined} // The attributes are already passed to ModalOverlay, so they should not be passed here
					/>
				</ModalOverlay>
			) : (
				<AttachedPortal
					selfSizing
					fixedOrientation
					closeOnOutsideClick
					adjustPositionToScreen
					focusOnReferenceElementAfterClose
					referenceElement={this.props.referenceElement}
					orientationList={["bottom-start", "bottom-end", "top-start", "top-end", "right", "left"]}
					updateElementPosition={(handler) => {
						this.updateElementPosition = handler;
					}}
					onVisibilityChange={(isVisible) => {
						if (!isVisible) {
							this.props.pickerProps?.onClose?.();
						}
					}}
				>
					<Picker
						{...(this.props.pickerProps || ({} as T))}
						onScreenChange={(screen, screenRef) => {
							this.props.pickerProps?.onScreenChange?.(screen, null);
							this.updateElementPosition?.();
							setTimeout(() => {
								if (
									screenRef &&
									screenRef.parentElement &&
									screenRef.parentElement.getAttribute("data-role") === DataRoles.AttachedPortal
								) {
									screenRef.tabIndex = -1;

									if (!screenRef.getAttribute("role")) {
										screenRef.setAttribute("role", "dialog");
									}

									screenRef.focus();
								} else {
									screenRef?.parentElement?.focus();
								}
							});
						}}
					/>
				</AttachedPortal>
			);
		}
	};
}
