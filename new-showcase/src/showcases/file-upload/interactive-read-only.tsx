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
import { useCallback, useEffect, useState, useMemo } from "react";

import { DefaultFileUpload, ResponsiveImageContainer, HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

export function InteractiveReadOnly(): ReactElement {
	const mockFile = useMemo(() => new File(["Mock content"], "dnd_image.png", { type: "image/png" }), []);
	const [file, setFile] = useState<File>(mockFile);

	useEffect(() => {
		(async () => {
			const res = await fetch("images/dnd_image.png");

			if (res.ok) {
				const blob = await res.blob();
				setFile(new File([blob], "dnd_image.png", { type: "image/png", lastModified: Date.now() }));
			}
		})();
	}, []);

	// Triggers a download of the displayed file by creating a temporary link and simulating a click.
	const onUploadAreaClick = useCallback((): void => {
		const url = URL.createObjectURL(file);
		const link = document.createElement("a");

		link.href = url;
		link.download = file.name;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	}, [file]);

	return (
		<DefaultFileUpload
			readOnly
			title={`Download file ${file.name}`}
			uploadAreaSize={{ height: 150, width: 150 }}
			onUploadAreaClick={onUploadAreaClick}
			id="interactive-readonly-file-upload"
			ariaLabelledby="file-upload-hint-tooltip"
			label="Download the image"
			helperText="This is helper text. Lorem ipsum dolor sit amet."
			image={<ResponsiveImageContainer src="images/dnd_image.png" />}
			tooltips={<HintTooltip text="This is an info message" id="file-upload-hint-tooltip" />}
		/>
	);
}
