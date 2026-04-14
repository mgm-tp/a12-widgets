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

/**
 * This component allows uploading files by opening the file picker or dragging and dropping files to the upload area.
 * @module
 */

import type { RefCallback, ReactNode } from "react";

import type { BaseInputProps, InputDOMProps } from "../../input/base/template/base.tpl.api.js";
import type { Container } from "../../common/main/base-props.js";

export interface FileUploadProps
	extends
		Omit<
			BaseInputProps,
			"breakTooltipsToNewLine" | "ariaDescribedby" | "error" | "warning" | "info" | "fitToParent" | "readonly"
		>,
		Container,
		InputDOMProps {
	/**
	 * The reference of the upload area.
	 */
	uploadAreaRef?: RefCallback<HTMLDivElement>;

	/**
	 * The reference of the file input.
	 */
	fileInputRef?: RefCallback<HTMLInputElement>;

	/**
	 * A callback that will be called when a user clicks the upload area. It also works properly in readonly mode.
	 * @returns A boolean to know whether the file picker should be opened or a function to do the logic provided from a user.
	 */
	onUploadAreaClick?(): boolean | void;

	/**
	 * This method will be invoked when the file is chosen.
	 * @param files – List of the chosen files.
	 * @param isFileDropped – Whether the user drop the file or not.
	 */
	onChange?(files: FileList, isFileDropped: boolean): void;

	/**
	 * Allows multiple files to be selected.
	 * @see [MDN]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-multiple}.
	 */
	multiple?: boolean;

	/**
	 * The accept attribute for file picker.
	 * @see [MDN]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept}.
	 */
	accept?: string;

	/**
	 * Whether the widget is read-only.
	 */
	readOnly?: boolean;

	/**
	 * Specifies the size of the upload area.
	 *
	 * *Note:* The height and maxHeight do not work properly in {@link compact} mode.
	 */
	uploadAreaSize?: {
		height?: number | string;
		width?: number | string;
		maxWidth?: number | string;
		maxHeight?: number | string;
	};

	/**
	 * Whether the image will stretch to fit the upload area, regardless of its aspect-ratio.
	 * @deprecated This prop was a mistake and will be removed soon.
	 */
	imageFilledUploadArea?: boolean;

	/**
	 * The custom action item for the upload widget.
	 */
	actionItem?: ReactNode;

	/**
	 * The custom icon that appears when dragging over the file upload.
	 */
	uploadIconOnDrag?: ReactNode;

	/**
	 * The aria-labelledby attribute for the file upload widget.
	 */
	ariaLabelledby?: string;

	/**
	 * The aria-describedby attribute for the file upload widget.
	 * @deprecated since 35.0.0. aria-describedby attribute will get the same value as {@link ariaLabelledby}.
	 */
	ariaDescribedby?: string;

	/**
	 * Whether the input would be simplified or not.
	 * For compact mode, the height will be smaller, the action item and tooltips will be placed next to the input.
	 */
	compact?: boolean;

	/**
	 * Controls the ARIA role of the file upload wrapper based on upload state to support accessibility.
	 * When true, the wrapper has role="button" for empty state. When false, screen readers announce the uploaded file details.
	 * @internal Requires {@link compact} mode to be enabled.
	 */
	noUploaded?: boolean;

	/**
	 * Specifies the title attribute that will be shown as a tooltip when hovering over the file upload. This title will be read by a screen reader whenever the file upload is focused.
	 *
	 * If not provided, the default localized title will be shown:
	 * - English: "Upload file"
	 * - German: "Dokument hochladen"
	 *
	 * Providing an empty string will hide the title.
	 */
	title?: string;
}
