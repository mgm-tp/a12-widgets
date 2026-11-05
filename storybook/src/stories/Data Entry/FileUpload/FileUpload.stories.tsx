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

import {
	DefaultFileUpload,
	HintTooltip,
	Icon,
	InteractionHintConfigProvider,
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof DefaultFileUpload> = {
	title: "Data Entry/FileUpload",
	component: DefaultFileUpload,
	parameters: {
		layout: "centered"
	},
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
		},
		readOnly: {
			control: "boolean",
			description: "Render the widget read-only — the chosen file is shown but cannot be replaced"
		},
		compact: {
			control: "boolean",
			description: "Simplified single-line variant; action item and tooltips are placed next to the input"
		},
		loading: {
			control: "boolean",
			description: "Show the loading indicator while an upload is processing"
		},
		accept: {
			control: "text",
			description: "The accept attribute for the file picker (e.g. `image/*` or `.pdf`)"
		},
		placeholderIcon: {
			control: "select",
			options: ["default", "image", "text", "spreadsheet", "pdf", "video", "sound", "none"],
			description: "Preview icon per file type, shown when no file preview image is available"
		},
		descriptionText: {
			control: "text",
			description: "Custom description text inside the upload area (desktop only)"
		},
		buttonText: {
			control: "text",
			description: "Custom text for the upload button (desktop only)"
		},
		title: {
			control: "text",
			description: "Tooltip shown on hover and read by screen readers on focus; empty string hides it"
		},
		messagePosition: {
			control: "select",
			options: ["above", "below"],
			description:
				'Where the error, warning and info message boxes render: `"above"` (default) between the label and the control, `"below"` directly under the control'
		},
		breakTooltipsToNewLine: {
			control: "select",
			options: [false, true, "above", "below"],
			description:
				'Where tooltips render: `false` (default) inline beside the control — next to the label, or beside the upload area in `compact` mode — `true` / `"above"` on a new line above the control, `"below"` on a new line below'
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	args: {
		id: "file-upload-playground",
		label: "File upload",
		placeholderIcon: "none"
	},
	render: (args) => (
		<div style={{ width: "min(400px, calc(100vw - 32px))" }}>
			<DefaultFileUpload {...args} />
		</div>
	)
};

export const Multiple: Story = {
	args: {
		id: "file-upload-multiple",
		label: "Upload multiple files",
		placeholderIcon: "none",
		multiple: true
	},
	parameters: {
		docs: {
			description: {
				story: "`multiple` allows selecting several files at once via the file picker or drag-and-drop."
			}
		}
	}
};

export const Disabled: Story = {
	args: {
		id: "file-upload-disabled",
		label: "Disabled file upload",
		placeholderIcon: "none",
		disabled: true
	},
	parameters: {
		docs: {
			description: {
				story: "`disabled` blocks all interaction — the upload area cannot be clicked, focused or dropped onto."
			}
		}
	}
};

export const WithFile: Story = {
	args: {
		id: "file-upload-with-file",
		label: "Uploaded document",
		placeholderIcon: "pdf",
		fileOptions: {
			name: "annual-report.pdf",
			icon: <Icon>picture_as_pdf</Icon>
		}
	},
	parameters: {
		docs: {
			description: {
				story:
					"`fileOptions` displays the chosen file as a link with an optional `icon`. " +
					"Combine it with `placeholderIcon` to show a type-specific preview icon."
			}
		}
	}
};

export const Loading: Story = {
	args: {
		id: "file-upload-loading",
		label: "Uploading document",
		placeholderIcon: "none",
		loading: true,
		loadingLabel: "Uploading…",
		fileOptions: {
			name: "annual-report.pdf"
		},
		onCancel: () => undefined
	},
	parameters: {
		docs: {
			description: {
				story:
					"`loading` shows a loading indicator with an optional `loadingLabel`. " +
					"Providing `onCancel` adds a cancel button in the `actionItem` slot while the upload is processing."
			}
		}
	}
};

export const Compact: Story = {
	args: {
		id: "file-upload-compact",
		label: "Compact file upload",
		compact: true
	},
	render: (args) => (
		<div style={{ width: "min(400px, calc(100vw - 32px))" }}>
			<DefaultFileUpload {...args} />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`compact` renders a simplified, smaller upload input. The action item and tooltips are placed next to the input instead of inside the upload area."
			}
		}
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
				<div style={{ padding: "50px", width: "min(400px, calc(100vw - 132px))" }}>
					<DefaultFileUpload
						id="file-upload-hint"
						label="File upload with hint"
						placeholderIcon="none"
						title="Click or drag to upload file"
					/>
				</div>
			</InteractionHintConfigProvider>
		</A11YLanguageContext.Provider>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Wrapping the widget in `InteractionHintConfigProvider` shows the `title` as an interaction hint on hover. `A11YLanguageContext` customizes the localized labels."
			}
		}
	}
};

export const MessagePosition: Story = {
	args: {
		id: "file-upload-message-position",
		label: "File upload",
		helperText: "Helper text explaining the field",
		placeholderIcon: "none",
		error: true,
		errorMessage: "Please choose a file",
		messagePosition: "below"
	},
	render: (args) => (
		<div style={{ width: "400px" }}>
			<DefaultFileUpload {...args} />
		</div>
	),
	parameters: {
		controls: { include: ["messagePosition"] },
		docs: {
			description: {
				story:
					'`messagePosition` places the message box relative to the control. This story starts at `"below"`, which renders it directly under the control — switch the control to `"above"` for the default placement between the label and the control.'
			}
		}
	}
};

export const TooltipPosition: Story = {
	args: {
		id: "file-upload-tooltip-position",
		label: "File upload",
		helperText: "Helper text explaining the field",
		placeholderIcon: "none",
		tooltips: <HintTooltip text="This is a hint" id="file-upload-tooltip-position-hint" />,
		breakTooltipsToNewLine: "below"
	},
	render: (args) => (
		<div style={{ width: "400px" }}>
			<DefaultFileUpload {...args} />
		</div>
	),
	parameters: {
		controls: { include: ["breakTooltipsToNewLine"] },
		docs: {
			description: {
				story:
					'`breakTooltipsToNewLine` places the tooltips relative to the control. This story starts at `"below"`, which puts them on their own line under the control — switch the control to `false` for the default inline placement beside it, or to `"above"` / `true` for a line above.'
			}
		}
	}
};
