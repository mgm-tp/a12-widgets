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

import {
	findByDataRole,
	fireEvent,
	getByDataRole,
	screen,
	queryByDataRole,
	render,
	waitFor,
	getByTitle
} from "test-utils";
import { describe, vi, expect, test } from "vitest";
import type { ReactElement, ReactNode } from "react";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { noop } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import { PopUpMenu } from "../../pop-up-menu/index.js";
import { Button } from "../../button/index.js";
import { List } from "../../list/index.js";
import { getA11yResource } from "../../common/main/a11y-localization/index.js";

import type { FileUploadProps } from "../main/file-upload.api.js";
import { FileUpload } from "../main/file-upload.view.js";

describe("com.mgmtp.a12.widgets.file-upload", () => {
	test("render basic file-upload", () => {
		const { container } = render(<FileUpload id="test-id" label="test-label" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render multiple file-upload", () => {
		const { container } = render(<FileUpload id="file-upload" multiple />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render file-upload with action-item", () => {
		const action = "action item";
		const { container } = render(<FileUpload id="file-upload" actionItem={action} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled file-upload", () => {
		const { container } = render(<FileUpload id="file-upload" disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readOnly file-upload", () => {
		const { container } = render(<FileUpload id="file-upload" readOnly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render accepted file-upload", () => {
		const accept = "image/*";
		const { container } = render(<FileUpload id="file-upload" accept={accept} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render file-upload with upload area size", () => {
		const size = {
			height: 100,
			width: 50,
			maxWidth: 100,
			maxHeight: 150
		};
		const { container } = render(<FileUpload id="file-upload" uploadAreaSize={size} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render file-upload with upload icon on drag", () => {
		const iconOnDrag = <Icon>drag</Icon>;
		const { container } = render(<FileUpload id="file-upload" uploadIconOnDrag={iconOnDrag} />);

		const contentElement = getByTitle(container, /upload file/i);
		fireEvent.dragOver(contentElement, { preventDefault: noop });

		expect(container.firstChild).toMatchSnapshot();
	});

	test("render file-upload with helper-text", () => {
		const { container } = render(<FileUpload id="file-upload" helperText="helper-text" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("file-upload change-event", () => {
		const onChangeSpy = vi.fn();
		const dummyFile = "dummyFile";
		const { container } = render(<FileUpload onChange={onChangeSpy} />);

		const inputElement = getByDataRole(container, DataRoles.FileUpload.Input);
		fireEvent.change(inputElement, { target: { files: [dummyFile] } });
		expect(onChangeSpy).toHaveBeenCalledTimes(1);
	});

	test("file-upload onUploadAreaClick event", () => {
		const onUploadAreaClickSpy = vi.fn();
		render(<FileUpload onUploadAreaClick={onUploadAreaClickSpy} />);

		const contentElement = screen.getByTitle(/upload file/i);

		fireEvent.click(contentElement);
		expect(onUploadAreaClickSpy).toHaveBeenCalledTimes(1);
	});

	test("default-file-upload input should be disabled in readOnly mode", async () => {
		const onUploadAreaClickSpy = vi.fn();
		const { container } = render(<FileUpload readOnly onUploadAreaClick={onUploadAreaClickSpy} />);

		const contentElement = getByDataRole(container, DataRoles.FileUpload.Content);
		expect(contentElement).not.toHaveAttribute("title");

		const inputElement = getByDataRole(container, DataRoles.FileUpload.Input);
		expect(inputElement).toHaveAttribute("disabled");
	});

	test("should display without title", async () => {
		const { container } = render(<FileUpload title="" id="test-id" label="test-label" />);

		const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
		await userEvent.hover(fileUploadContent);

		const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);
		const hiddenTitle = queryByDataRole(fileUploadContent, DataRoles.HiddenText);

		expect(hiddenTitle).toBeFalsy();
		expect(interactionHint).toBeFalsy();
	});

	test("should display without title in compact mode", async () => {
		const { container } = render(<FileUpload compact noUploaded title="" id="test-id" label="test-label" />);

		const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
		await userEvent.hover(fileUploadContent);

		const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);
		const hiddenTitle = queryByDataRole(fileUploadContent, DataRoles.HiddenText);

		expect(hiddenTitle).toBeFalsy();
		expect(interactionHint).toBeFalsy();
	});

	test("should have the title attribute", async () => {
		const fileUploadTitle = "upload your file";

		const { container } = render(
			<FileUpload compact noUploaded title={fileUploadTitle} id="test-id" label="test-label" />
		);

		const triggerElement = getByDataRole(container, DataRoles.FileUpload.Content);
		expect(triggerElement.getAttribute("title")).toEqual(fileUploadTitle);
	});

	describe("Action menu items", () => {
		const ActionItem = ({
			triggerElement,
			triggerButtonTitle,
			triggerButtonCloseTitle
		}: {
			triggerElement?: ReactElement;
			triggerButtonTitle?: string;
			triggerButtonCloseTitle?: string;
		}): ReactNode => (
			<PopUpMenu
				triggerButtonTitle={triggerButtonTitle}
				triggerButtonCloseTitle={triggerButtonCloseTitle}
				triggerElement={triggerElement}
			>
				<List>
					<List.Item text="Replace" graphic={<Icon>file_upload</Icon>} />
					<List.Item text="Download" graphic={<Icon>get_app</Icon>} />
					<List.Item text="Delete" graphic={<Icon>delete</Icon>} />
				</List>
			</PopUpMenu>
		);
		const fileUploadId = "test-id";
		const ariaLabelledby = `${fileUploadId}-menu-description ${fileUploadId}-label`;

		test("should have aria-labelledby for menu action button", async () => {
			const fileUploadTitle = "upload your file";

			const { container } = render(
				<FileUpload
					compact
					noUploaded
					title={fileUploadTitle}
					id={fileUploadId}
					label="test-label"
					actionItem={<ActionItem triggerElement={<Button secondary icon={<Icon>more_vert</Icon>} />} />}
				/>
			);

			const menuActionButton = getByDataRole(container, DataRoles.Popup.TriggerElement);
			expect(menuActionButton.getAttribute("aria-labelledby")).toEqual(ariaLabelledby);

			const hiddenText = getByDataRole(menuActionButton, DataRoles.HiddenText);
			const a11yTitle = getA11yResource("en").fileUploadTitles;

			expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsOpen} ${a11yTitle?.menuActionConnector}`);

			fireEvent.click(menuActionButton);

			expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsClose} ${a11yTitle?.menuActionConnector}`);
		});

		test("aria-labelledby for menu action button should be override by customized title", async () => {
			const fileUploadTitle = "upload your file";
			const triggerButtonTitleOpen = "Open file Upload action menu";
			const triggerButtonTitleClose = "Close file Upload action menu";

			const { container } = render(
				<FileUpload
					compact
					noUploaded
					title={fileUploadTitle}
					id={fileUploadId}
					label="test-label"
					actionItem={
						<ActionItem
							triggerButtonTitle={triggerButtonTitleOpen}
							triggerButtonCloseTitle={triggerButtonTitleClose}
							triggerElement={<Button secondary icon={<Icon>more_vert</Icon>} />}
						/>
					}
				/>
			);

			const menuActionButton = getByDataRole(container, DataRoles.Popup.TriggerElement);
			expect(menuActionButton.getAttribute("aria-labelledby")).toEqual(ariaLabelledby);

			const hiddenText = getByDataRole(menuActionButton, DataRoles.HiddenText);
			const a11yTitle = getA11yResource("en").fileUploadTitles;

			expect(hiddenText.textContent).toEqual(`${triggerButtonTitleOpen} ${a11yTitle?.menuActionConnector}`);

			fireEvent.click(menuActionButton);

			expect(hiddenText.textContent).toEqual(`${triggerButtonTitleClose} ${a11yTitle?.menuActionConnector}`);
		});

		test("should have aria-labelledby for menu action button without default trigger element", async () => {
			const fileUploadTitle = "upload your file";

			const { container } = render(
				<FileUpload
					compact
					noUploaded
					title={fileUploadTitle}
					id={fileUploadId}
					label="test-label"
					actionItem={<ActionItem />}
				/>
			);

			const menuActionButton = getByDataRole(container, DataRoles.Popup.TriggerElement);
			expect(menuActionButton.getAttribute("aria-labelledby")).toEqual(ariaLabelledby);

			const hiddenText = getByDataRole(menuActionButton, DataRoles.HiddenText);
			const a11yTitle = getA11yResource("en").fileUploadTitles;

			expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsOpen} ${a11yTitle?.menuActionConnector}`);

			fireEvent.click(menuActionButton);

			expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsClose} ${a11yTitle?.menuActionConnector}`);
		});
	});

	describe("Interaction hint", () => {
		const FileUploadWithHint = (props: FileUploadProps) => (
			<InteractionHintConfigProvider enableInteractionHint>
				<FileUpload {...props} />
			</InteractionHintConfigProvider>
		);

		test("should display a custom title as hint and hidden text", async () => {
			const fileUploadTitle = "upload your file";

			const { container } = render(<FileUploadWithHint title={fileUploadTitle} id="test-id" label="test-label" />);

			const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
			await userEvent.hover(fileUploadContent);
			await waitFor(async () => {
				const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
				const hiddenTitle = getByDataRole(fileUploadContent, DataRoles.HiddenText);

				expect(getByDataRole(interactionHint, DataRoles.InteractionHint.Content).textContent).toBe(fileUploadTitle);
				expect(hiddenTitle.textContent).toBe(fileUploadTitle);
			});
		});

		test("should display a custom title as hint and hidden text in compact mode", async () => {
			const fileUploadTitle = "upload your file";

			const { container } = render(
				<FileUploadWithHint compact noUploaded title={fileUploadTitle} id="test-id" label="test-label" />
			);

			const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
			await userEvent.hover(fileUploadContent);
			await waitFor(async () => {
				const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
				const hiddenTitle = getByDataRole(fileUploadContent, DataRoles.HiddenText);

				expect(getByDataRole(interactionHint, DataRoles.InteractionHint.Content).textContent).toBe(fileUploadTitle);
				expect(hiddenTitle.textContent).toBe(fileUploadTitle);
			});
		});
	});
	test("should display without title", async () => {
		const { container } = render(<FileUpload title="" id="test-id" label="test-label" />);

		const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
		await userEvent.hover(fileUploadContent);

		const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);
		const hiddenTitle = queryByDataRole(fileUploadContent, DataRoles.HiddenText);

		expect(hiddenTitle).toBeFalsy();
		expect(interactionHint).toBeFalsy();
	});

	test("should display without title in compact mode", async () => {
		const { container } = render(<FileUpload compact noUploaded title="" id="test-id" label="test-label" />);

		const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
		await userEvent.hover(fileUploadContent);

		const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);
		const hiddenTitle = queryByDataRole(fileUploadContent, DataRoles.HiddenText);

		expect(hiddenTitle).toBeFalsy();
		expect(interactionHint).toBeFalsy();
	});

	describe("File Upload Action Menu Visibility", () => {
		const createActionItem = (): ReactElement => (
			<PopUpMenu headerTitle="File options" triggerElement={<Button secondary icon={<Icon>more_vert</Icon>} />}>
				<List>
					<List.Item text="Replace" graphic={<Icon>file_upload</Icon>} />
					<List.Item text="Download" graphic={<Icon>get_app</Icon>} />
				</List>
			</PopUpMenu>
		);

		describe("File Upload", () => {
			test("should show action menu when not disabled and not readOnly", () => {
				const { container } = render(<FileUpload id="test-file-upload" actionItem={createActionItem()} />);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();
			});

			test("should hide action menu when disabled", () => {
				const { container } = render(<FileUpload id="test-file-upload" actionItem={createActionItem()} disabled />);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should hide action menu when readOnly", () => {
				const { container } = render(<FileUpload id="test-file-upload" actionItem={createActionItem()} readOnly />);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should hide action menu when both disabled and readOnly", () => {
				const { container } = render(
					<FileUpload id="test-file-upload" actionItem={createActionItem()} disabled readOnly />
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should show action menu when loading", () => {
				const { container } = render(
					<FileUpload id="test-file-upload" actionItem={createActionItem()} readOnly loading />
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();
			});

			test("should show action menu during loading state even when disabled", () => {
				const { container } = render(
					<FileUpload id="test-file-upload" actionItem={createActionItem()} disabled loading />
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();
			});

			test("should not show action menu when no actionItem is provided", () => {
				const { container } = render(<FileUpload id="test-file-upload" />);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should handle null actionItem", () => {
				const { container } = render(<FileUpload id="test-file-upload" actionItem={null} />);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should handle undefined actionItem", () => {
				const { container } = render(<FileUpload id="test-file-upload" actionItem={undefined} />);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});
		});

		describe("Compact File Upload", () => {
			test("should show action menu when not disabled and not readOnly", () => {
				const { container } = render(<FileUpload id="test-file-upload" actionItem={createActionItem()} compact />);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();

				const divider = queryByDataRole(container, DataRoles.FileUpload.Divider);
				expect(divider).toBeTruthy();
			});

			test("should hide action menu when disabled", () => {
				const { container } = render(
					<FileUpload id="test-file-upload" actionItem={createActionItem()} compact disabled />
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();

				const divider = queryByDataRole(container, DataRoles.FileUpload.Divider);
				expect(divider).toBeFalsy();
			});

			test("should hide action menu when readOnly", () => {
				const { container } = render(
					<FileUpload id="test-file-upload" actionItem={createActionItem()} compact readOnly />
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();

				const divider = queryByDataRole(container, DataRoles.FileUpload.Divider);
				expect(divider).toBeFalsy();
			});

			test("should hide action menu during loading state when disabled", () => {
				const { container } = render(
					<FileUpload id="test-file-upload" actionItem={createActionItem()} compact disabled loading />
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});
		});

		describe("Interactive ReadOnly Mode", () => {
			test("should hide action menu in interactive readOnly mode", () => {
				const { container } = render(
					<FileUpload id="test-file-upload" actionItem={createActionItem()} readOnly onUploadAreaClick={vi.fn()} />
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should hide action menu in interactive readOnly mode with compact", () => {
				const { container } = render(
					<FileUpload
						id="test-file-upload"
						actionItem={createActionItem()}
						compact
						readOnly
						onUploadAreaClick={vi.fn()}
					/>
				);

				const actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});
		});

		describe("Dynamic State Changes", () => {
			test("should hide action menu when changing from enabled to disabled", () => {
				const props: FileUploadProps = {
					id: "test-file-upload",
					actionItem: createActionItem(),
					disabled: false
				};

				const { container, rerender } = render(<FileUpload {...props} />);

				// Initially visible
				let actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();

				// Re-render with disabled = true
				rerender(<FileUpload {...props} disabled={true} />);

				// Should now be hidden
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should hide action menu when changing from enabled to readOnly", () => {
				const props: FileUploadProps = {
					id: "test-file-upload",
					actionItem: createActionItem(),
					readOnly: false
				};

				const { container, rerender } = render(<FileUpload {...props} />);

				// Initially visible
				let actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();

				// Re-render with readOnly = true
				rerender(<FileUpload {...props} readOnly={true} />);

				// Should now be hidden
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();
			});

			test("should show action menu when changing from disabled to enabled", () => {
				const props: FileUploadProps = {
					id: "test-file-upload",
					actionItem: createActionItem(),
					disabled: true
				};

				const { container, rerender } = render(<FileUpload {...props} />);

				// Initially hidden
				let actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();

				// Re-render with disabled = false
				rerender(<FileUpload {...props} disabled={false} />);

				// Should now be visible
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();
			});

			test("should show action menu when changing from readOnly to enabled", () => {
				const props: FileUploadProps = {
					id: "test-file-upload",
					actionItem: createActionItem(),
					readOnly: true
				};

				const { container, rerender } = render(<FileUpload {...props} />);

				// Initially hidden
				let actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();

				// Re-render with readOnly = false
				rerender(<FileUpload {...props} readOnly={false} />);

				// Should now be visible
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();
			});

			test("should handle complex state transitions correctly", () => {
				const props: FileUploadProps = {
					id: "test-file-upload",
					actionItem: createActionItem(),
					disabled: false,
					readOnly: false
				};

				const { container, rerender } = render(<FileUpload {...props} />);

				// Initially visible (enabled state)
				let actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();

				// Change to disabled
				rerender(<FileUpload {...props} disabled={true} />);
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();

				// Change to readOnly (from disabled)
				rerender(<FileUpload {...props} disabled={false} readOnly={true} />);
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();

				// Change to both disabled and readOnly
				rerender(<FileUpload {...props} disabled={true} readOnly={true} />);
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeFalsy();

				// Change back to enabled
				rerender(<FileUpload {...props} disabled={false} readOnly={false} />);
				actionMenu = queryByDataRole(container, DataRoles.FileUpload.Actions);
				expect(actionMenu).toBeTruthy();
			});
		});
	});
});
