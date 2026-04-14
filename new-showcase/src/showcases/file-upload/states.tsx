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
import { styled, css } from "styled-components";

import { DefaultFileUpload } from "@com.mgmtp.a12.widgets/widgets-core";

const size = { height: 150, width: 150 };

const StyledWrapper = styled.div(({ theme }) => {
	return css`
		display: flex;
		flex-direction: column;
		gap: ${theme.spacing.spacing.spacingLg}px;
	`;
});

const StyledFileUploadGridContainer = styled.div(({ theme }) => {
	return css`
		display: flex;
		flex-wrap: wrap;
		gap: ${theme.spacing.spacing.spacingMd}px;
	`;
});

export function States(): ReactElement {
	return (
		<StyledWrapper>
			<StyledFileUploadGridContainer>
				<DefaultFileUpload
					id="file-upload-info"
					label="File upload info"
					uploadAreaSize={size}
					infoMessage="Info message"
				/>
				<DefaultFileUpload
					id="file-upload-warning"
					label="File upload warning"
					uploadAreaSize={size}
					warningMessage="Warning message"
				/>
				<DefaultFileUpload
					id="file-upload-error"
					label="File upload error"
					uploadAreaSize={size}
					errorMessage="Error message"
				/>
			</StyledFileUploadGridContainer>
			<StyledFileUploadGridContainer>
				<DefaultFileUpload id="file-upload-readonly" readOnly label="Readonly" uploadAreaSize={size} />
				<DefaultFileUpload
					id="file-upload-readonly-preview"
					readOnly
					showPlaceholderIconAsPreview
					label="With Preview Icon"
					uploadAreaSize={size}
				/>
			</StyledFileUploadGridContainer>
			<StyledFileUploadGridContainer>
				<DefaultFileUpload id="file-upload-disabled" disabled label="Disabled" uploadAreaSize={size} />
				<DefaultFileUpload
					id="file-upload-disabled-preview"
					disabled
					showPlaceholderIconAsPreview
					label="With Preview Icon"
					uploadAreaSize={size}
				/>
			</StyledFileUploadGridContainer>
		</StyledWrapper>
	);
}
