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
import { useEffect, useRef, useState } from "react";

import {
	usePreviousProps,
	DefaultFileUpload,
	ResponsiveImageContainer,
	HintTooltip,
	PopUpMenu,
	List,
	Button,
	Icon
} from "@com.mgmtp.a12.widgets/widgets-core";

export function Combination(): ReactElement {
	const fileInputRef = useRef<HTMLElement | null>(null);
	const uploadAreaRef = useRef<HTMLElement | null>(null);

	const timeout = useRef(0);

	const [file, setFile] = useState<File | undefined>(undefined);
	const [succeed, setSucceed] = useState(false);
	const [loading, setLoading] = useState(false);

	const prevLoadingState = usePreviousProps(loading);

	useEffect(() => {
		if (loading !== prevLoadingState) {
			if (loading) {
				timeout.current = window.setTimeout(() => {
					setLoading(false);
					setSucceed(true);
				}, 1000);
			} else {
				if (timeout.current) {
					clearTimeout(timeout.current);
				}

				timeout.current = 0;
				setLoading(false);
			}
		}
	}, [loading, prevLoadingState]);

	const getFileInputRef = (ref: HTMLElement | null): void => {
		fileInputRef.current = ref;
	};

	const getUploadAreaRef = (ref: HTMLElement | null): void => {
		uploadAreaRef.current = ref;
	};

	const onReplace = (): void => {
		if (fileInputRef.current && !loading) {
			fileInputRef.current.click();
		}
	};

	const onDelete = (): void => {
		setSucceed(false);
		uploadAreaRef.current?.focus();
	};

	const onFileChange = (images: FileList): void => {
		if (images.length) {
			setLoading(true);
			setSucceed(false);
			setFile(Array.from(images)[0]);
		}
	};

	const onCancelUpload = (): void => {
		setLoading(false);
		uploadAreaRef.current?.focus();
	};

	// Triggers a download of the displayed file by creating a temporary link and simulating a click.
	const onDownload = (): void => {
		if (file) {
			const url = URL.createObjectURL(file);

			const link = document.createElement("a");
			link.href = url;
			link.download = file.name;

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			URL.revokeObjectURL(url);
		}
	};

	return (
		<DefaultFileUpload
			title={succeed && file ? `Replace file ${file.name}` : "File upload combination"}
			loading={loading}
			id="complex-file-upload"
			accept="image/*"
			label="Upload an image"
			placeholderIcon="image"
			placeholderIconTitle="image"
			ariaLabelledby="file-upload-hint-tooltip"
			helperText="This is helper text. Lorem ipsum dolor sit amet."
			image={succeed && <ResponsiveImageContainer src="images/dnd_image.png" />}
			tooltips={<HintTooltip text="This is an info message" id="file-upload-hint-tooltip" />}
			actionItem={
				!loading &&
				succeed && (
					<PopUpMenu headerTitle="File options" triggerElement={<Button secondary icon={<Icon>more_vert</Icon>} />}>
						<List>
							<List.Item text="Replace" graphic={<Icon>file_upload</Icon>} onClick={onReplace} />
							<List.Item text="Download" graphic={<Icon>get_app</Icon>} onClick={onDownload} />
							<List.Item disabled={!succeed} text="Delete" graphic={<Icon>delete</Icon>} onClick={onDelete} />
						</List>
					</PopUpMenu>
				)
			}
			uploadAreaSize={{ height: 150, width: 150 }}
			fileInputRef={getFileInputRef}
			uploadAreaRef={getUploadAreaRef}
			onChange={onFileChange}
			onCancel={onCancelUpload}
		/>
	);
}
