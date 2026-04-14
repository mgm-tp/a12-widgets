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

import type { FC, SyntheticEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
	Button,
	noop,
	DefaultFileUpload,
	Icon,
	List,
	PopUpMenu,
	HintTooltip
} from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledCompactFileUploadWrapper } from "./base-template.js";

export const FileNameCombination: FC = () => {
	const [loading, setLoading] = useState(false);
	const [succeed, setSucceed] = useState(false);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [menuVisibility, setMenuVisibility] = useState(false);
	const fileInputRef = useRef<HTMLElement | null>(null);
	const uploadAreaRef = useRef<HTMLElement | null>(null);
	const linkRef = useRef<HTMLAnchorElement | null>(null);

	const getFileInputRef = useCallback((ref: HTMLElement | null) => {
		fileInputRef.current = ref;
	}, []);

	const getUploadAreaRef = useCallback((ref: HTMLElement | null) => {
		uploadAreaRef.current = ref;
	}, []);

	const getLinkRef = useCallback((ref: HTMLAnchorElement | null) => {
		linkRef.current = ref;
	}, []);

	const onFileChange = useCallback((files: FileList) => {
		if (files.length) {
			setLoading(true);
			setSucceed(false);
			setFile(Array.from(files)[0]);
		}
	}, []);

	const onCancel = useCallback(() => {
		setLoading(false);
		setFile(undefined);
		uploadAreaRef.current?.focus();
	}, []);

	const onDelete = useCallback(() => {
		setSucceed(false);
		setFile(undefined);
		setMenuVisibility(false);
		uploadAreaRef.current?.focus();
	}, []);

	const onReplace = useCallback(() => {
		if (fileInputRef.current && !loading) {
			fileInputRef.current?.click();
		}
	}, [loading]);

	const onDownload = useCallback(() => {
		linkRef.current?.click();
	}, []);

	const onLinkClicked = useCallback((event: SyntheticEvent<HTMLAnchorElement, MouseEvent>) => {
		event.stopPropagation();
	}, []);

	const onUploadAreaClicked = useCallback(() => {
		if (file) {
			linkRef.current?.click();

			return false;
		}

		return true;
	}, [file]);

	useEffect(() => {
		let timeout: number;

		if (loading) {
			timeout = window.setTimeout(() => {
				setLoading(false);
				setSucceed(true);
			}, 2000);

			return () => {
				window.clearTimeout(timeout);
				setLoading(false);
			};
		}

		return noop;
	}, [loading]);

	return (
		<StyledCompactFileUploadWrapper>
			<div style={{ width: 250 }}>
				<DefaultFileUpload
					title={succeed && file ? "" : "File upload compact combination"}
					id="file-name-combination"
					label="Combination of Compact File Upload"
					accept=".pdf,.doc,.docx"
					loading={loading}
					loadingLabel={loading && "Loading"}
					compact
					fileOptions={
						succeed && file
							? {
									name: file.name,
									icon: (
										<Icon title="Datatype PDF" iconTheme="custom">
											datatype_pdf
										</Icon>
									),
									linkProps: {
										href: URL.createObjectURL(file),
										linkAttributes: { download: file.name },
										wrapperRef: getLinkRef,
										onClick: onLinkClicked,
										title: "Uploaded File"
									}
								}
							: undefined
					}
					onUploadAreaClick={onUploadAreaClicked}
					actionItem={
						<PopUpMenu
							triggerElement={<Button secondary icon={<Icon>{menuVisibility ? "close" : "more_vert"}</Icon>} />}
							onVisibilityChange={setMenuVisibility}
							headerTitle="File options"
						>
							<List>
								<List.Item text="Replace" graphic={<Icon>file_upload</Icon>} onClick={onReplace} />
								<List.Item text="Download" graphic={<Icon>get_app</Icon>} onClick={onDownload} />
								<List.Item text="Delete" graphic={<Icon>delete</Icon>} onClick={onDelete} />
							</List>
						</PopUpMenu>
					}
					fileInputRef={getFileInputRef}
					uploadAreaRef={getUploadAreaRef}
					helperText="This is helper text. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet."
					tooltips={<HintTooltip text="This is an info message" id="file-name-hint-tooltip" />}
					ariaLabelledby="file-name-hint-tooltip"
					onChange={onFileChange}
					onCancel={onCancel}
				/>
			</div>
		</StyledCompactFileUploadWrapper>
	);
};
