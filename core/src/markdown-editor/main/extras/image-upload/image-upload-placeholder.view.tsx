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

import type { LexicalEditor, NodeKey } from "lexical";
import type { FC } from "react";
import { useContext } from "react";

import { Button } from "../../../../button/main/button.view.js";
import { A11YLanguageContext } from "../../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import { RETRY_IMAGE_UPLOAD_COMMAND } from "./image-upload.commands.js";
import {
	StyledImageUpload,
	StyledImageUploadError,
	StyledImageUploadOverlay,
	StyledImageUploadSpinner
} from "./image-upload.styled.js";
import { getImageUploadTitles } from "./image-upload.utils.js";
import type { ImageUploadState } from "./upload-image-node.js";

interface ImageUploadPlaceholderProps {
	editor: LexicalEditor;
	nodeKey: NodeKey;
	src: string;
	altText: string;
	title?: string;
	uploadState: ImageUploadState;
}

/**
 * What an {@link UploadImageNode} draws while its upload is unfinished.
 * Running puts the (object-URL) preview under a spinner; failed dims the preview
 * and shows an inline error with a Retry action.
 * Retry goes back through the editor, so the plugin — which holds the consumer's upload handler — runs it again.
 */
export const ImageUploadPlaceholder: FC<ImageUploadPlaceholderProps> = ({
	editor,
	nodeKey,
	src,
	altText,
	title,
	uploadState
}) => {
	const { markdownEditorTitles: titles } = useContext(A11YLanguageContext);
	const uploadTitles = getImageUploadTitles(titles);

	const isUploading = uploadState === "uploading";

	return (
		<StyledImageUpload aria-busy={isUploading}>
			<img src={src} alt={altText} title={title} style={{ opacity: isUploading ? 0.6 : 0.4 }} />
			{isUploading ? (
				<StyledImageUploadOverlay
					data-role={DataRoles.ProgressIndicator.OuterOverlay}
					aria-label={uploadTitles.uploading}
				>
					<StyledImageUploadSpinner data-role={DataRoles.ProgressIndicator.CircleSpinner} />
				</StyledImageUploadOverlay>
			) : (
				<StyledImageUploadError data-role={DataRoles.Error.Message} role="alert">
					<span>{uploadTitles.failed}</span>
					<Button
						secondary
						label={uploadTitles.retry}
						onClick={() => editor.dispatchCommand(RETRY_IMAGE_UPLOAD_COMMAND, nodeKey)}
					/>
				</StyledImageUploadError>
			)}
		</StyledImageUpload>
	);
};

ImageUploadPlaceholder.displayName = "MarkdownImageUploadPlaceholder";
