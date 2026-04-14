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

import type { Identifiable, Styleable } from "../../../common/main/base-props.js";

import { StyledFileUpload } from "../file-upload.styled.js";

export type IconProps = Identifiable &
	Styleable & { title?: string; dataRole?: string; preview?: boolean; $disabled?: boolean };

export const DefaultIcon = ({ title, id, dataRole, ...props }: IconProps) => (
	<StyledFileUpload.StyledUploadSvgIcon
		{...props}
		data-role={dataRole}
		key="background"
		focusable="false"
		fill="#FFF"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden={true}
	>
		<path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z">
			{title && <title id={id}>{title}</title>}
		</path>
		<path d="M0 0h24v24H0z" fill="none" />
	</StyledFileUpload.StyledUploadSvgIcon>
);

DefaultIcon.displayName = "DefaultIcon";

export const PdfIcon = ({ title, id, dataRole, ...props }: IconProps) => (
	<StyledFileUpload.StyledUploadSvgIcon
		{...props}
		data-role={dataRole}
		key="background"
		focusable="false"
		fill="#FFF"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden={true}
	>
		<path d="M0 0h24v24H0z" fill="none" />
		<path d="M13.4,7.8H9.9v8.3h3.5c1.1,0,2.1-0.9,2.1-2.1V9.9C15.5,8.8,14.5,7.8,13.4,7.8z M13.4,14.1H12V9.9h1.4V14.1z M6.5,7.8H3v8.3h2.1v-2.8h1.4c1.1,0,2.1-0.9,2.1-2.1V9.9C8.5,8.8,7.6,7.8,6.5,7.8z M6.5,11.3H5.1V9.9h1.4V11.3z M18.9,9.9v1.4H21v2.1h-2.1v2.8h-2.1V7.8H21v2.1H18.9z">
			{title && <title id={id}>{title}</title>}
		</path>
	</StyledFileUpload.StyledUploadSvgIcon>
);

PdfIcon.displayName = "PdfIcon";

export const VideoIcon = ({ title, id, dataRole, ...props }: IconProps) => (
	<StyledFileUpload.StyledUploadSvgIcon
		{...props}
		data-role={dataRole}
		key="background"
		focusable="false"
		fill="#FFF"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden={true}
	>
		<path d="M0 0h24v24H0z" fill="none" />
		<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z">
			{title && <title id={id}>{title}</title>}
		</path>
	</StyledFileUpload.StyledUploadSvgIcon>
);

VideoIcon.displayName = "VideoIcon";

export const SpreadsheetIcon = ({ title, id, dataRole, ...props }: IconProps) => (
	<StyledFileUpload.StyledUploadSvgIcon
		{...props}
		data-role={dataRole}
		key="background"
		focusable="false"
		fill="#FFF"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden={true}
	>
		<path fill="none" d="M0 0h24v24H0V0z" />
		<path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z">
			{title && <title id={id}>{title}</title>}
		</path>
	</StyledFileUpload.StyledUploadSvgIcon>
);

SpreadsheetIcon.displayName = "SpreadsheetIcon";

export const ImageIcon = ({ title, id, dataRole, ...props }: IconProps) => (
	<StyledFileUpload.StyledUploadSvgIcon
		{...props}
		data-role={dataRole}
		key="background"
		focusable="false"
		fill="#FFF"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden={true}
	>
		<path d="M0 0h24v24H0z" fill="none" />
		<path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z">
			{title && <title id={id}>{title}</title>}
		</path>
	</StyledFileUpload.StyledUploadSvgIcon>
);

ImageIcon.displayName = "ImageIcon";

export const TextIcon = ({ title, id, dataRole, ...props }: IconProps) => (
	<StyledFileUpload.StyledUploadSvgIcon
		{...props}
		data-role={dataRole}
		key="background"
		focusable="false"
		fill="#FFF"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden={true}
	>
		<path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z">
			{title && <title id={id}>{title}</title>}
		</path>
		<path d="M0 0h24v24H0z" fill="none" />
	</StyledFileUpload.StyledUploadSvgIcon>
);

TextIcon.displayName = "TextIcon";

export const SoundIcon = ({ title, id, dataRole, ...props }: IconProps) => (
	<StyledFileUpload.StyledUploadSvgIcon
		{...props}
		data-role={dataRole}
		key="background"
		focusable="false"
		fill="#FFF"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden={true}
	>
		<path d="M0 0h24v24H0z" fill="none" />
		<path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z">
			{title && <title id={id}>{title}</title>}
		</path>
	</StyledFileUpload.StyledUploadSvgIcon>
);

SoundIcon.displayName = "SoundIcon";
