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

import type { ChangeEvent, ReactElement } from "react";
import { useContext, useState, createRef, useRef, useCallback } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { ConnectedToast, HeaderTrigger, createTheme, getBaseTheme } from "@com.mgmtp.a12.widgets/widgets-core";

import { CustomThemeContext, ThemeContext } from "../theme-selector.js";
import { setLocalStorage } from "../utils.js";

export function ThemeUpload(): ReactElement {
	const { setTheme: setCustomTheme } = useContext(CustomThemeContext);
	const { setTheme } = useContext(ThemeContext);
	const [showErrorToast, setShowErrorToast] = useState(false);
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const uploadInputRef = createRef<HTMLInputElement>();
	const triggerElementRef = useRef<HTMLButtonElement>(null);
	const connectedToastRef = useRef<HTMLElement>(null);

	const handleTriggerElementRef = useCallback((ref: HTMLButtonElement) => {
		triggerElementRef.current = ref;
	}, []);

	const handleConnectedToastRef = useCallback((ref: HTMLDivElement) => {
		connectedToastRef.current = ref;
	}, []);

	const handleTriggerClick = useCallback(() => {
		uploadInputRef.current?.click();
	}, [uploadInputRef]);

	const handleSuccessToastClose = useCallback(() => {
		setShowSuccessToast(false);
	}, []);

	const handleFileUpload = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (event.target.files) {
				const fileReader = new FileReader();
				fileReader.readAsText(event.target.files[0], "UTF-8");
				fileReader.onload = (onLoadEvent): void => {
					if (onLoadEvent.target?.result && typeof onLoadEvent.target?.result === "string") {
						try {
							const result = JSON.parse(onLoadEvent.target?.result);
							const customTheme = createTheme(result);

							if (customTheme !== getBaseTheme({ spacing: { base: 16 } })) {
								setLocalStorage("custom-theme", JSON.stringify(customTheme));
								setCustomTheme(customTheme);
								setTheme("custom");
							}
						} catch (error) {
							setShowErrorToast(true);
						}
					}
				};
			}

			setShowSuccessToast(true);
			setShowErrorToast(false);
			event.target.value = "";
		},
		[setCustomTheme, setTheme]
	);

	const connectedToast = (
		<TransitionGroup component={null}>
			{showErrorToast && triggerElementRef.current && (
				<CSSTransition timeout={200} nodeRef={connectedToastRef}>
					<ConnectedToast
						referenceElement={triggerElementRef.current}
						message="invalid type, please try again"
						variant="error"
						wrapperRef={handleConnectedToastRef}
						duration={10000}
					/>
				</CSSTransition>
			)}
			{showSuccessToast && triggerElementRef.current && (
				<CSSTransition timeout={200} nodeRef={connectedToastRef}>
					<ConnectedToast
						referenceElement={triggerElementRef.current}
						message="Apply theme successfully"
						variant="success"
						wrapperRef={handleConnectedToastRef}
						duration={10000}
						onClose={handleSuccessToastClose}
					/>
				</CSSTransition>
			)}
		</TransitionGroup>
	);

	return (
		<div className="-u-margin-l-xs">
			<HeaderTrigger
				graphic="upload"
				text="Upload Theme"
				textTitle="Upload Theme"
				buttonRef={handleTriggerElementRef}
				onClick={handleTriggerClick}
			/>
			{connectedToast}
			<input type="file" ref={uploadInputRef} hidden accept=".json" onChange={handleFileUpload} />
		</div>
	);
}
