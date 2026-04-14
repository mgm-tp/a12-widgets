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

import type { ReactElement } from "react";
import { useState } from "react";
// start code removal
import { styled, css } from "styled-components";
// end code removal

import { DefaultFileUpload, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";

const size = { height: 150, width: 150 };

const StyledFileUploadGridContainer = styled.div(({ theme }) => {
	return css`
		display: flex;
		flex-wrap: wrap;
		gap: ${theme.spacing.spacing.spacingMd}px;
	`;
});
// end code removal
export function PlaceHolderIcon(): ReactElement {
	// start code removal
	const [enablePreviewIcon, setEnablePreviewIcon] = useState(false);

	const content = (
		<CodeSnippetGenerationWrapper>
			<DefaultFileUpload
				id="file-upload-placeholder-default"
				label="Default"
				uploadAreaSize={size}
				placeholderIconTitle="file"
				showPlaceholderIconAsPreview={enablePreviewIcon}
			/>
			<DefaultFileUpload
				id="file-upload-placeholder-image"
				label="Image"
				uploadAreaSize={size}
				accept="image/*"
				placeholderIcon="image"
				placeholderIconTitle="image"
				showPlaceholderIconAsPreview={enablePreviewIcon}
			/>
			<DefaultFileUpload
				id="file-upload-placeholder-text"
				label="Text"
				uploadAreaSize={size}
				accept="text/plain"
				placeholderIcon="text"
				placeholderIconTitle="text"
				showPlaceholderIconAsPreview={enablePreviewIcon}
			/>
			<DefaultFileUpload
				id="file-upload-placeholder-spreadsheet"
				label="Spreadsheet"
				uploadAreaSize={size}
				accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
				placeholderIcon="spreadsheet"
				placeholderIconTitle="spreadsheet"
				showPlaceholderIconAsPreview={enablePreviewIcon}
			/>
			<DefaultFileUpload
				id="file-upload-placeholder-pdf"
				label="PDF"
				uploadAreaSize={size}
				accept=".pdf"
				placeholderIcon="pdf"
				placeholderIconTitle="pdf"
				showPlaceholderIconAsPreview={enablePreviewIcon}
			/>
			<DefaultFileUpload
				id="file-upload-placeholder-video"
				label="Video"
				uploadAreaSize={size}
				accept="video/*"
				placeholderIcon="video"
				placeholderIconTitle="video"
				showPlaceholderIconAsPreview={enablePreviewIcon}
			/>
			<DefaultFileUpload
				id="file-upload-placeholder-sound"
				label="Sound"
				uploadAreaSize={size}
				accept="audio/*"
				placeholderIcon="sound"
				placeholderIconTitle="sound"
				showPlaceholderIconAsPreview={enablePreviewIcon}
			/>
		</CodeSnippetGenerationWrapper>
	);
	// end code removal

	return (
		// start code removal
		<ConfigurationView
			configuration={
				<Checkbox
					label="Set Preview Icon"
					title="Set Preview Icon"
					checked={enablePreviewIcon}
					fitToParent={false}
					onChange={setEnablePreviewIcon}
				/>
			}
		>
			<StyledFileUploadGridContainer>{content}</StyledFileUploadGridContainer>
		</ConfigurationView>
		// end code removal
	);
}
