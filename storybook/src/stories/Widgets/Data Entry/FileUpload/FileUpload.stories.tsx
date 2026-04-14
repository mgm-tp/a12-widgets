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

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { DefaultFileUpload, Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import { InteractionHintConfigProvider } from "@com.mgmtp.a12.widgets/widgets-core/lib/interaction-hint/main/interaction-hint-context.js";
import {
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/language-context.js";

const meta: Meta<typeof DefaultFileUpload> = {
	title: "Widgets/Data Entry/FileUpload",
	component: DefaultFileUpload,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"],
	argTypes: {
		id: {
			control: "text",
			description: "Unique identifier for the file upload component"
		},
		label: {
			control: "text",
			description: "Label text for the file upload"
		},
		multiple: {
			control: "boolean",
			description: "Allow multiple files to be selected"
		},
		disabled: {
			control: "boolean",
			description: "Disable the file upload"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "file-upload-default",
		label: "File upload",
		placeholderIcon: "none"
	}
};

export const Multiple: Story = {
	args: {
		id: "file-upload-multiple",
		label: "Upload multiple files",
		placeholderIcon: "none",
		multiple: true
	}
};

export const Disabled: Story = {
	args: {
		id: "file-upload-disabled",
		label: "Disabled file upload",
		placeholderIcon: "none",
		disabled: true
	}
};

export const WithInteractionHint: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				fileUploadTitles: {
					uploadButton: "Click or drag to upload file",
					loading: "Loading",
					cancelUpload: "Cancel upload",
					menuActionsOpen: "Open menu",
					menuActionsClose: "Close menu",
					menuActionConnector: "for"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					fileUpload: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ padding: "50px", width: "400px" }}>
					<DefaultFileUpload
						id="file-upload-hint"
						label="File upload with hint"
						placeholderIcon="none"
						title="Click or drag to upload file"
					/>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

export const WithInteractionHintFollowCursor: Story = {
	render: () => (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				fileUploadTitles: {
					uploadButton: "Upload your documents",
					loading: "Loading",
					cancelUpload: "Cancel upload",
					menuActionsOpen: "Open menu",
					menuActionsClose: "Close menu",
					menuActionConnector: "for"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					fileUpload: {
						enabled: true,
						followCursor: true,
						hideArrow: true
					}
				}}
			>
				<div style={{ padding: "50px", width: "400px" }}>
					<DefaultFileUpload
						id="file-upload-follow-cursor"
						label="File upload with follow cursor hint"
						placeholderIcon="none"
						title="Upload your documents"
						multiple
					/>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	)
};

const CompactFileUploadStory = () => {
	const [file, setFile] = useState<File | null>(null);

	const onFileUploadChange = (fileList: FileList): void => {
		setFile(fileList[0]);
	};

	const onDelete = (): void => {
		setFile(null);
	};

	return (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				fileUploadTitles: {
					uploadButton: "Choose file",
					loading: "Loading",
					cancelUpload: "Cancel upload",
					menuActionsOpen: "Open menu",
					menuActionsClose: "Close menu",
					menuActionConnector: "for"
				}
			}}
		>
			<InteractionHintConfigProvider
				enableInteractionHint={true}
				componentConfigs={{
					fileUpload: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ padding: "50px", width: "400px" }}>
					<DefaultFileUpload
						id="file-upload-compact-hint"
						label="Compact file upload with hint"
						compact
						title="Choose file to upload"
						fileOptions={
							file
								? {
										name: file.name,
										icon: <Icon>insert_drive_file</Icon>
									}
								: undefined
						}
						actionItem={
							file ? (
								<Button icon={<Icon>delete</Icon>} secondary destructive onClick={onDelete} title="Delete file" />
							) : undefined
						}
						onChange={onFileUploadChange}
					/>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	);
};

export const CompactWithHint: Story = {
	render: () => <CompactFileUploadStory />
};

export const WithActionItemsAndHint: Story = {
	render: () => <CompactFileUploadStory />
};

const FileUploadWithHintStory = () => {
	return (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				fileUploadTitles: {
					uploadButton: "Click to upload files",
					loading: "Loading",
					cancelUpload: "Cancel upload",
					menuActionsOpen: "Open menu",
					menuActionsClose: "Close menu",
					menuActionConnector: "for"
				}
			}}
		>
			<InteractionHintConfigProvider
				componentConfigs={{
					fileUpload: {
						enabled: true,
						followCursor: false,
						hideArrow: false
					}
				}}
			>
				<div style={{ padding: "50px", width: "400px" }}>
					<DefaultFileUpload
						id="file-upload-with-hint"
						label="File upload with interaction hint"
						placeholderIcon="none"
						title="Click to upload files"
						multiple
					/>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	);
};

export const FileUploadWithHint: Story = {
	render: () => <FileUploadWithHintStory />
};

const HintVariationsStory = () => {
	return (
		<A11YLanguageContext.Provider
			value={{
				...getA11yResource("en"),
				fileUploadTitles: {
					uploadButton: "Upload file",
					loading: "Loading",
					cancelUpload: "Cancel upload",
					menuActionsOpen: "Open menu",
					menuActionsClose: "Close menu",
					menuActionConnector: "for"
				}
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "50px" }}>
				<div>
					<h3>Basic Hint</h3>
					<InteractionHintConfigProvider
						componentConfigs={{
							fileUpload: {
								enabled: true,
								followCursor: false,
								hideArrow: false
							}
						}}
					>
						<div style={{ width: "400px" }}>
							<DefaultFileUpload
								id="file-upload-basic"
								label="Basic hint"
								placeholderIcon="none"
								title="Upload your file"
							/>
						</div>
					</InteractionHintConfigProvider>
				</div>

				<div>
					<h3>Follow Cursor</h3>
					<InteractionHintConfigProvider
						enableInteractionHint={true}
						componentConfigs={{
							fileUpload: {
								enabled: true,
								followCursor: true,
								hideArrow: false
							}
						}}
					>
						<div style={{ width: "400px" }}>
							<DefaultFileUpload
								id="file-upload-follow"
								label="Follow cursor hint"
								placeholderIcon="none"
								title="Drag and drop or click"
							/>
						</div>
					</InteractionHintConfigProvider>
				</div>

				<div>
					<h3>No Arrow</h3>
					<InteractionHintConfigProvider
						enableInteractionHint={true}
						componentConfigs={{
							fileUpload: {
								enabled: true,
								followCursor: false,
								hideArrow: true
							}
						}}
					>
						<div style={{ width: "400px" }}>
							<DefaultFileUpload
								id="file-upload-no-arrow"
								label="No arrow hint"
								placeholderIcon="none"
								title="Select files"
								multiple
							/>
						</div>
					</InteractionHintConfigProvider>
				</div>
			</div>
		</A11YLanguageContext.Provider>
	);
};

export const InteractionHintVariations: Story = {
	render: () => <HintVariationsStory />
};
