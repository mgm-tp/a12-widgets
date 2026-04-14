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
 * This component provides a default style set for the file upload.
 * @module
 */

import type { ReactNode } from "react";

import type { LinkProps } from "../../../link/main/link/link.api.js";

import type { FileUploadProps } from "../file-upload.api.js";

export interface DefaultFileUploadProps extends FileUploadProps {
	/**
	 * Displays an image inside the upload area.
	 */
	image?: ReactNode;

	/**
	 * Details of the File that is displayed as a link after uploading. Recommend to use it for the document type.
	 */
	fileOptions?: DefaultFileUploadProps.FileOptions;

	/**
	 * Shows the loading indicator.
	 */
	loading?: boolean;

	/**
	 * Label that is placed next to the loading icon while the upload is processing.
	 * @requires fileOptions
	 */
	loadingLabel?: ReactNode;

	/**
	 * Custom description text.
	 * *Note:* Only visible on desktop.
	 */
	descriptionText?: string;

	/**
	 * Visually hides the {@link descriptionText} while keeping it in the DOM for screen readers.
	 * When true, the text is rendered but hidden from visual display to support accessibility.
	 * @default false
	 */
	hideDescriptionText?: boolean;

	/**
	 * Custom text for the upload button.
	 * *Note:* Only visible on desktop.
	 */
	buttonText?: string;

	/**
	 * Visually hides the {@link buttonText} while keeping it in the DOM for screen readers.
	 * When true, the text is rendered but hidden from visual display to support accessibility.
	 * @default false
	 */
	hideButtonText?: boolean;

	/**
	 * Custom text for the upload button on mobile.
	 * *Note:* Only visible on mobile and tablet.
	 */
	mobileButtonText?: string;

	/**
	 * Specifies the preview icon for different file types, which will be shown if a file preview image can't be shown.
	 * @default default
	 */
	placeholderIcon?: DefaultFileUploadProps.PlaceholderIconType;

	/**
	 * Whether the {@link placeholderIcon} displays as a preview icon.
	 */
	showPlaceholderIconAsPreview?: boolean;

	/**
	 * Specifies the title of the placeholder icon for better support Accessibility.
	 */
	placeholderIconTitle?: string;

	/**
	 * Whether the tooltips should be broken to a new line or not.
	 * @default false
	 */
	breakTooltipsToNewLine?: boolean;

	/**
	 * A callback that will be invoked when the cancel button is clicked.
	 *
	 * *Note:*
	 *      - This function adds a default cancel button in the {@link actionItem} slot while the upload is processing.
	 *      - This property requires the {@link loading} to be true.
	 */
	onCancel?(): void;
}

export namespace DefaultFileUploadProps {
	export type PlaceholderIconType =
		| "default"
		| "image"
		| "text"
		| "spreadsheet"
		| "pdf"
		| "video"
		| "sound"
		| "none"
		| ReactNode;

	export interface FileOptions {
		/**
		 * Name of the chosen file.
		 */
		name: ReactNode;

		/**
		 * Properties of the link such as title, event handlers,...
		 */
		linkProps?: Partial<Omit<LinkProps, "children" | "as" | "ref">>;

		/**
		 * The icon that will be placed in front of the {@link name}.
		 */
		icon?: ReactNode;

		/**
		 * Whether the link of the file name would be placed inside the TextOutput widget and no truncation.
		 * @default false
		 * @requires DefaultFileUploadProps.readOnly
		 */
		textOnlyDisplay?: boolean;

		/**
		 * Whether the {@link name} should be displayed as a link or just a plain element.
		 * @default true
		 */
		showAsLink?: boolean;
	}
}
