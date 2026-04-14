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
import { useState, useMemo } from "react";
import { styled } from "styled-components";

import { TextOutput, BulletList, DefaultFileUpload } from "@com.mgmtp.a12.widgets/widgets-core";

const StyledShowcaseFileUploadWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	width: 100%;
`;

export function Basic(): ReactElement {
	const [files, setFiles] = useState<File[]>([]);
	const [filesAreDropped, setFilesAreDropped] = useState(false);

	const onFileUploadChange = (fileList: FileList, dropped: boolean): void => {
		setFiles(Array.from(fileList));
		setFilesAreDropped(dropped);
	};

	const renderedFileNames = useMemo(
		() => (
			<BulletList.Unordered className="-u-padding-b-2xs">
				{files.map((file) => (
					<BulletList.Item key={file.name}>{file.name}</BulletList.Item>
				))}
			</BulletList.Unordered>
		),
		[files]
	);

	return (
		<StyledShowcaseFileUploadWrapper>
			<DefaultFileUpload
				id="file-upload-basic"
				label="File upload"
				placeholderIcon="none"
				multiple
				onChange={onFileUploadChange}
			/>
			{files.length > 0 && (
				<TextOutput className="-u-margin-t-xs" disableParagraphWrapping>
					<p>Got files by {filesAreDropped ? "dragging" : "choosing from picker"}:</p>
					{renderedFileNames}
				</TextOutput>
			)}
		</StyledShowcaseFileUploadWrapper>
	);
}
