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
	getByDataRole,
	getByText,
	render,
	setupDevice,
	findByDataRole,
	queryByDataRole,
	within,
	getAllByDataRole,
	waitFor,
	getByTitle,
	queryAllByDataRole,
	fireEvent
} from "test-utils";
import { Key } from "ts-key-enum";
import { describe, vi, expect, test, beforeAll } from "vitest";
import { userEvent } from "vitest/browser";

import { HintTooltip } from "../../tooltip/hint/main/hint.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import { Icon } from "../../icon/index.js";
import { getA11yResource } from "../../common/main/a11y-localization/index.js";
import { List } from "../../list/index.js";
import { PopUpMenu } from "../../pop-up-menu/index.js";
import { ResponsiveImageContainer } from "../../responsive-image-container/index.js";
import { LayoutGrid } from "../../layout/layout-grid/main/layout-grid.view.js";

import { DefaultFileUpload } from "../main/default/default-file-upload.view.js";
import type { DefaultFileUploadProps } from "../main/default/default-file-upload.api.js";

const properties = {
	id: "test-id",
	label: "test-label",
	tooltips: <HintTooltip text="this is a hint" />,
	helperText: "test-helper-text",
	errorMessage: "test-error",
	warningMessage: "test-warning",
	infoMessage: "test-info"
};

describe("com.mgmtp.a12.widgets.default-file-upload", () => {
	test("render basic default-file-upload", () => {
		const { container } = render(<DefaultFileUpload id={properties.id} label={properties.label} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render hidden label, hidden description text, hidden button text for default-file-upload", () => {
		const { container } = render(
			<DefaultFileUpload
				id={properties.id}
				label={properties.label}
				hideLabel
				descriptionText="Test"
				hideDescriptionText
				buttonText="Test"
				hideButtonText
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with tooltip", () => {
		const { container } = render(<DefaultFileUpload id={properties.id} tooltips={properties.tooltips} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with tooltip in new line", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} tooltips={properties.tooltips} breakTooltipsToNewLine />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with custom upload area size", () => {
		const { container } = render(
			<DefaultFileUpload
				id={properties.id}
				uploadAreaSize={{
					width: "100px",
					height: "100px",
					maxWidth: "150px",
					maxHeight: "150px"
				}}
			/>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with error message", () => {
		const { container } = render(<DefaultFileUpload id={properties.id} errorMessage={properties.errorMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with warning message", () => {
		const { container } = render(<DefaultFileUpload id={properties.id} warningMessage={properties.warningMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with info message", () => {
		const { container } = render(<DefaultFileUpload id={properties.id} infoMessage={properties.infoMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder default-icon as preview", () => {
		const { container } = render(<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder image-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview placeholderIcon="image" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder text-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview placeholderIcon="text" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder spreadsheet-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview placeholderIcon="spreadsheet" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder pdf-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview placeholderIcon="pdf" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder video-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview placeholderIcon="video" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder sound-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview placeholderIcon="sound" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with placeholder none-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload id={properties.id} showPlaceholderIconAsPreview placeholderIcon="none" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled default-file-upload with placeholder none-icon", () => {
		const { container } = render(<DefaultFileUpload disabled id={properties.id} placeholderIcon="none" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled default-file-upload with placeholder none-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload disabled id={properties.id} showPlaceholderIconAsPreview placeholderIcon="none" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render disabled default-file-upload with placeholder icon", () => {
		const { container } = render(<DefaultFileUpload disabled placeholderIcon="image" id={properties.id} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readOnly default-file-upload with placeholder none-icon", () => {
		const { container } = render(<DefaultFileUpload readOnly id={properties.id} placeholderIcon="none" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readOnly default-file-upload with placeholder none-icon as preview", () => {
		const { container } = render(
			<DefaultFileUpload readOnly id={properties.id} showPlaceholderIconAsPreview placeholderIcon="none" />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readOnly default-file-upload with placeholder icon", () => {
		const { container } = render(<DefaultFileUpload readOnly placeholderIcon="image" id={properties.id} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with image", () => {
		const image = <img alt="test img" src="test-path/test-image.png" />;
		const { container } = render(<DefaultFileUpload id={properties.id} image={image} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render default-file-upload with loading state", () => {
		const { container } = render(<DefaultFileUpload id={properties.id} loading />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("should disable file upload button when loading", () => {
		const onCancelSpy = vi.fn();
		const { container } = render(<DefaultFileUpload id={properties.id} onCancel={onCancelSpy} loading />);

		const fileUploadInput = getByDataRole(container, DataRoles.FileUpload.Input);

		expect(fileUploadInput).toHaveProperty("disabled", true);
	});

	test("Should cancel upload file when click cancel button", async () => {
		const onCancelSpy = vi.fn();
		const { container } = render(<DefaultFileUpload id={properties.id} onCancel={onCancelSpy} loading />);

		const fileUploadActionsElement = getByDataRole(container, DataRoles.FileUpload.Actions);
		const fileUploadCancelButton = getByDataRole(fileUploadActionsElement, DataRoles.Button);

		await userEvent.click(fileUploadCancelButton);

		expect(onCancelSpy).toHaveBeenCalledTimes(1);
	});

	test("default-file-upload onUploadAreaClick event in readOnly mode", async () => {
		const onUploadAreaClickSpy = vi.fn();
		const { container } = render(
			<DefaultFileUpload readOnly id={properties.id} onUploadAreaClick={onUploadAreaClickSpy} />
		);

		const fileUploadContentElement = getByDataRole(container, DataRoles.FileUpload.Content);

		await userEvent.click(fileUploadContentElement);
		expect(onUploadAreaClickSpy).toHaveBeenCalledTimes(1);
		expect(fileUploadContentElement).toMatchSnapshot();
	});

	test("should display without title", async () => {
		const { container } = render(<DefaultFileUpload title="" id="test-id" label="test-label" />);

		const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
		await userEvent.hover(fileUploadContent);

		const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);
		const hiddenTitle = queryByDataRole(fileUploadContent, DataRoles.HiddenText);

		expect(hiddenTitle).toBeFalsy();
		expect(interactionHint).toBeFalsy();
	});

	test("should display without title in compact mode", async () => {
		const { container } = render(<DefaultFileUpload compact title="" id="test-id" label="test-label" />);

		const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
		await userEvent.hover(fileUploadContent);

		const interactionHint = queryByDataRole(container, DataRoles.InteractionHint);
		const hiddenTitle = queryByDataRole(fileUploadContent, DataRoles.HiddenText);

		expect(hiddenTitle).toBeFalsy();
		expect(interactionHint).toBeFalsy();
	});

	test("Do not show placeholder icon during drag if `descriptionText` is defined", () => {
		const { container } = render(<DefaultFileUpload descriptionText="Description Text" />);

		const contentElement = getByTitle(container, /upload file/i);
		fireEvent.dragOver(contentElement);

		const uploadIcons = getAllByDataRole(contentElement, DataRoles.Icon);

		// Check if only 1 upload icon is shown.
		expect(uploadIcons).toHaveLength(1);
	});

	test("aria-labelledby should content file name after uploaded", async () => {
		const fileUploadTitle = "upload your file";
		const fileUploadId = "test-id";
		const ariaLabelledby = `${fileUploadId}-menu-description ${fileUploadId}-label ${fileUploadId}-content-visible-text`;

		const { container } = render(
			<DefaultFileUpload
				compact
				fileOptions={{
					name: "test-file",
					icon: (
						<Icon title="Datatype PDF" iconTheme="custom">
							datatype_pdf
						</Icon>
					),
					showAsLink: true
				}}
				title={fileUploadTitle}
				id="test-id"
				label="test-label"
				actionItem={
					<PopUpMenu>
						<List>
							<List.Item text="Replace" graphic={<Icon>file_upload</Icon>} />
							<List.Item text="Download" graphic={<Icon>get_app</Icon>} />
							<List.Item text="Delete" graphic={<Icon>delete</Icon>} />
						</List>
					</PopUpMenu>
				}
			/>
		);

		const menuActionButton = getByDataRole(container, DataRoles.Popup.TriggerElement);
		expect(menuActionButton.getAttribute("aria-labelledby")).toEqual(ariaLabelledby);

		const hiddenText = getByDataRole(menuActionButton, DataRoles.HiddenText);
		const a11yTitle = getA11yResource("en").fileUploadTitles;

		expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsOpen} ${a11yTitle?.menuActionConnector}`);

		await userEvent.click(menuActionButton);

		expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsClose} ${a11yTitle?.menuActionConnector}`);
	});

	test("aria-labelledby should content image name after uploaded", () => {
		const fileUploadTitle = "upload your file";
		const fileUploadId = "test-id";
		const ariaLabelledby = `${fileUploadId}-menu-description ${fileUploadId}-label ${fileUploadId}-content-invisible-text`;

		const { container } = render(
			<DefaultFileUpload
				image={<ResponsiveImageContainer src="images/dnd_image.png" alt="mgm A12" />}
				fileOptions={undefined}
				title={fileUploadTitle}
				id="test-id"
				label="test-label"
				actionItem={
					<PopUpMenu>
						<List>
							<List.Item text="Replace" graphic={<Icon>file_upload</Icon>} />
							<List.Item text="Download" graphic={<Icon>get_app</Icon>} />
							<List.Item text="Delete" graphic={<Icon>delete</Icon>} />
						</List>
					</PopUpMenu>
				}
			/>
		);

		const menuActionButton = getByDataRole(container, DataRoles.Popup.TriggerElement);
		expect(menuActionButton.getAttribute("aria-labelledby")).toEqual(ariaLabelledby);
		const a11yTitle = getA11yResource("en").fileUploadTitles;
		const hiddenText = getByDataRole(menuActionButton, DataRoles.HiddenText);

		expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsOpen} ${a11yTitle?.menuActionConnector}`);

		fireEvent.click(menuActionButton);

		expect(hiddenText.textContent).toEqual(`${a11yTitle?.menuActionsClose} ${a11yTitle?.menuActionConnector}`);
	});

	describe("Interaction hint", () => {
		const DefaultFileUploadWithHint = (props: DefaultFileUploadProps) => (
			<InteractionHintConfigProvider enableInteractionHint>
				<DefaultFileUpload {...props} />
			</InteractionHintConfigProvider>
		);
		test("should display default title as hint and hidden text", async () => {
			const defaultTitle = "Upload file";

			const { container } = render(<DefaultFileUploadWithHint id="test-id" label="test-label" />);

			const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
			await userEvent.hover(fileUploadContent);
			await waitFor(async () => {
				const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
				const hiddenTitle = getByDataRole(fileUploadContent, DataRoles.HiddenText);

				expect(getByDataRole(interactionHint, DataRoles.InteractionHint.Content).textContent).toBe(defaultTitle);
				expect(hiddenTitle.textContent).toBe(defaultTitle);
			});
		});

		test("should display default title as hint and hidden text in compact mode", async () => {
			const defaultTitle = "Upload file";

			const { container } = render(<DefaultFileUploadWithHint compact id="test-id" label="test-label" />);

			const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
			await userEvent.hover(fileUploadContent);
			await waitFor(async () => {
				const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
				const hiddenTitle = getByDataRole(fileUploadContent, DataRoles.HiddenText);

				expect(getByDataRole(interactionHint, DataRoles.InteractionHint.Content).textContent).toBe(defaultTitle);
				expect(hiddenTitle.textContent).toBe(defaultTitle);
			});
		});

		test("Should display content follow fileOptions when fileOptions is provided with buttonText and descriptionText.", async () => {
			const buttonText = "Upload";
			const descriptionText = "Upload File";

			const { container } = render(
				<DefaultFileUpload
					id="test-id"
					fileOptions={{ name: "widget.pdf" }}
					buttonText={buttonText}
					descriptionText={descriptionText}
				/>
			);

			const fileUploadContentInner = getByDataRole(container, DataRoles.FileUpload.Content.Inner);
			const fileLink = getByDataRole(fileUploadContentInner, DataRoles.Link);

			const { queryByText } = within(container);
			const buttonTextElement = queryByText(buttonText);
			const descriptionTextElement = queryByText(buttonText);

			expect(buttonTextElement).toBeFalsy();
			expect(descriptionTextElement).toBeFalsy();
			expect(fileLink).toMatchSnapshot();
		});

		test("Should display buttonText and descriptionText when fileOptions property is not provided", async () => {
			const buttonText = "Upload";
			const descriptionText = "Upload File";

			const { container } = render(
				<DefaultFileUpload id="file-upload" buttonText={buttonText} descriptionText={descriptionText} />
			);

			const descriptionTextElement = container.querySelector("#file-upload-left-text");
			const buttonTextElement = container.querySelector("#file-upload-right-text");

			expect(buttonTextElement?.textContent).toEqual(buttonText);
			expect(descriptionTextElement?.textContent).toEqual(descriptionText);
		});

		test("should display a custom title as hint and hidden text", async () => {
			const fileUploadTitle = "upload your file";

			const { container } = render(
				<DefaultFileUploadWithHint title={fileUploadTitle} id="test-id" label="test-label" />
			);

			const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
			await userEvent.hover(fileUploadContent);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			const hiddenTitle = getByDataRole(fileUploadContent, DataRoles.HiddenText);

			expect(getByDataRole(interactionHint, DataRoles.InteractionHint.Content).textContent).toBe(fileUploadTitle);
			expect(hiddenTitle.textContent).toBe(fileUploadTitle);
		});

		test("should display a custom title as hint and hidden text in compact mode", async () => {
			const fileUploadTitle = "upload your file";

			const { container } = render(
				<DefaultFileUploadWithHint compact title={fileUploadTitle} id="test-id" label="test-label" />
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

	describe("Read-only file upload", () => {
		describe("desktop", () => {
			test("Should focus to interactive read-only file upload when clicking on label or helper text", () => {
				const { container } = render(
					<DefaultFileUpload
						id={properties.id}
						label={properties.label}
						readOnly={true}
						helperText={properties.helperText}
						onUploadAreaClick={vi.fn()}
					/>
				);

				const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);
				const label = getByDataRole(container, DataRoles.FileUpload.Label);

				fireEvent.click(label);

				expect(fileUploadContent?.matches(":focus")).toBe(true);

				const helperText = getByText(container, properties.helperText);

				fireEvent.click(helperText);

				expect(fileUploadContent?.matches(":focus")).toBe(true);
			});

			test("Should focus to interactive read-only file upload when pressing Tab key", () => {
				const { container } = render(
					<DefaultFileUpload
						id={properties.id}
						label={properties.label}
						readOnly={true}
						helperText={properties.helperText}
						onUploadAreaClick={vi.fn()}
					/>
				);

				const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);

				fireEvent.keyDown(fileUploadContent, { key: Key.Tab });

				const helperText = getByText(container, properties.helperText);

				fireEvent.click(helperText);

				expect(fileUploadContent.matches(":focus")).toBe(true);
			});
		});
		describe("File Upload on phone device", () => {
			beforeAll(() => {
				setupDevice();
			});

			test("default-file-upload onUploadAreaClick event in readOnly mode", () => {
				const onUploadAreaClickSpy = vi.fn();
				const { container } = render(
					<DefaultFileUpload readOnly id={properties.id} onUploadAreaClick={onUploadAreaClickSpy} />
				);

				const fileUploadContentElement = getByDataRole(container, DataRoles.FileUpload.Content);

				fireEvent.click(fileUploadContentElement);
				expect(onUploadAreaClickSpy).toHaveBeenCalledTimes(1);
				expect(fileUploadContentElement.getAttribute("aria-disabled")).toEqual("false");
			});
		});

		describe("Size calculation", () => {
			test("should not apply fit class or fit styles when both width and height are provided", () => {
				const { container } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							width: "100px",
							height: "100px"
						}}
					/>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should not have fit class when both dimensions are specified
				expect(wrapper).not.toHaveClass("field__upload--fit");

				// Should apply the specified dimensions as styles
				expect(uploadControl).toHaveStyle({
					width: "100px",
					height: "100px"
				});
			});

			test("should add fit class and responsive styles when uploadAreaSize is undefined", () => {
				const { container } = render(<DefaultFileUpload id="test-id" label="test-label" />);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should have fit class for responsive behavior
				expect(wrapper).toHaveClass("field__upload--fit");

				// Should not have explicit width/height styles, allowing responsive behavior
				expect(uploadControl).not.toHaveStyle({ width: "100px", height: "100px" });
			});

			test("should add fit class and max-width constraint when only maxWidth is provided", () => {
				const { container } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							maxWidth: "200px"
						}}
					/>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should have fit class for responsive behavior with constraints
				expect(wrapper).toHaveClass("field__upload--fit");

				// Should apply max-width constraint
				expect(uploadControl).toHaveStyle({ maxWidth: "200px", width: "200px" });
			});

			test("should add fit class and max-height constraint when only maxHeight is provided", () => {
				const { container } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							maxHeight: "150px"
						}}
					/>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should have fit class for responsive behavior with constraints
				expect(wrapper).toHaveClass("field__upload--fit");

				// Should apply max-height constraint
				expect(uploadControl).toHaveStyle({ maxHeight: "150px", height: "150px" });
			});

			test("should handle uploadAreaSize prop changes and update styles accordingly", () => {
				const { container, rerender } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							maxWidth: "200px"
						}}
					/>
				);

				let wrapper = getByDataRole(container, DataRoles.FileUpload);
				let uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should have fit class and max-width
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ maxWidth: "200px" });

				// Change uploadAreaSize to both width and height
				rerender(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							width: "100px",
							height: "100px"
						}}
					/>
				);

				wrapper = getByDataRole(container, DataRoles.FileUpload);
				uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				expect(wrapper).not.toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({
					width: "100px",
					height: "100px"
				});

				// Should no longer have max-width from previous render
				expect(uploadControl).not.toHaveStyle({ maxWidth: "300px" });
			});

			test("should handle case when only width is provided (height should be responsive)", () => {
				const { container } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							width: "100px"
						}}
					/>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should have fit class for height responsiveness
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ width: "100px", height: "100px" });
			});

			test("should handle case when only height is provided (width should be responsive)", () => {
				const { container } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							height: "100px"
						}}
					/>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should have fit class for width responsiveness
				expect(wrapper).toHaveClass("field__upload--fit");

				// Should apply explicit height but allow width to be responsive
				expect(uploadControl).not.toHaveStyle({ height: "100px", width: "100px" });
			});

			test("should handle complex uploadAreaSize configurations with mixed constraints", () => {
				const { container, rerender } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							maxWidth: "300px",
							maxHeight: "200px"
						}}
					/>
				);

				let wrapper = getByDataRole(container, DataRoles.FileUpload);
				let uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({
					maxWidth: "300px",
					maxHeight: "200px"
				});

				// Change to partial width only
				rerender(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							width: "150px",
							maxHeight: "200px"
						}}
					/>
				);

				wrapper = getByDataRole(container, DataRoles.FileUpload);
				uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({
					width: "150px",
					maxHeight: "200px"
				});

				expect(uploadControl).not.toHaveStyle({ maxWidth: "300px" });

				// Change to both width and height specified
				rerender(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							width: "150px",
							height: "100px"
						}}
					/>
				);

				wrapper = getByDataRole(container, DataRoles.FileUpload);
				uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should not have fit class when both dimensions are fixed
				expect(wrapper).not.toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({
					width: "150px",
					height: "100px"
				});

				// Should no longer have any max constraints
				expect(uploadControl).not.toHaveStyle({ maxHeight: "200px" });
			});

			test("should maintain fit class and responsive behavior in compact mode regardless of constraints", () => {
				const { container } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						compact
						uploadAreaSize={{
							maxWidth: "200px"
						}}
					/>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Compact mode should always maintain fit behavior
				expect(wrapper).toHaveClass("field__upload--fit");

				// Should still apply the size constraints
				expect(uploadControl).toHaveStyle({ maxWidth: "200px" });

				// Should have compact-specific styling
				expect(wrapper).toHaveAttribute("data-role", "file-upload");
			});

			test("should handle dynamic size changes and update DOM styles accordingly", () => {
				const { container, rerender } = render(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							width: "100px"
						}}
					/>
				);

				let wrapper = getByDataRole(container, DataRoles.FileUpload);
				let uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ width: "100px" });

				// Update to larger width
				rerender(
					<DefaultFileUpload
						id="test-id"
						label="test-label"
						uploadAreaSize={{
							width: "250px"
						}}
					/>
				);

				wrapper = getByDataRole(container, DataRoles.FileUpload);
				uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should update to new width
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ width: "250px" });
				expect(uploadControl).not.toHaveStyle({ width: "100px" });

				// Remove size constraints entirely
				rerender(<DefaultFileUpload id="test-id" label="test-label" />);

				wrapper = getByDataRole(container, DataRoles.FileUpload);
				uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should revert to fully responsive
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).not.toHaveStyle({ width: "250px" });
			});
		});

		describe("Layout Grid", () => {
			test("should maintain responsive behavior in grid without uploadAreaSize", () => {
				const { container } = render(
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ lg: 6 }}>
								<DefaultFileUpload id="grid-responsive-1" label="Responsive 1" />
							</LayoutGrid.Column>
							<LayoutGrid.Column size={{ lg: 6 }}>
								<DefaultFileUpload id="grid-responsive-2" label="Responsive 2" />
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				);

				const wrappers = queryAllByDataRole(container, DataRoles.FileUpload);
				const uploadControls = queryAllByDataRole(container, DataRoles.FileUpload.Control);

				expect(wrappers).toHaveLength(2);
				expect(uploadControls).toHaveLength(2);

				// Both should have fit class for responsive behavior
				expect(wrappers[0]).toHaveClass("field__upload--fit");
				expect(wrappers[1]).toHaveClass("field__upload--fit");

				// Should not have explicit dimensions
				expect(uploadControls[0]).not.toHaveStyle({ width: "100px" });
				expect(uploadControls[1]).not.toHaveStyle({ height: "100px" });
			});

			test("should apply fixed dimensions in grid when both width and height specified", () => {
				const { container } = render(
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ lg: 6 }}>
								<DefaultFileUpload
									id="grid-fixed"
									label="Fixed Size"
									uploadAreaSize={{
										width: "200px",
										height: "150px"
									}}
								/>
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should not have fit class when both dimensions are fixed
				expect(wrapper).not.toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({
					width: "200px",
					height: "150px"
				});
			});

			test("should maintain fit class with constraint-based sizing in grid", () => {
				const { container } = render(
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ lg: 4 }}>
								<DefaultFileUpload
									id="grid-constrained"
									label="Constrained"
									uploadAreaSize={{
										maxWidth: "100%"
									}}
								/>
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should have fit class for constraint-based sizing
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ maxWidth: "100%" });
			});

			test("should handle mixed sizing scenarios in single grid row", () => {
				const { container } = render(
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ lg: 3 }}>
								<DefaultFileUpload id="grid-mix-1" label="Fully Responsive" />
							</LayoutGrid.Column>
							<LayoutGrid.Column size={{ lg: 3 }}>
								<DefaultFileUpload
									id="grid-mix-2"
									label="Fixed Size"
									uploadAreaSize={{ width: "150px", height: "100px" }}
								/>
							</LayoutGrid.Column>
							<LayoutGrid.Column size={{ lg: 3 }}>
								<DefaultFileUpload id="grid-mix-3" label="Max Width Only" uploadAreaSize={{ maxWidth: "200px" }} />
							</LayoutGrid.Column>
							<LayoutGrid.Column size={{ lg: 3 }}>
								<DefaultFileUpload id="grid-mix-4" label="Width Only" uploadAreaSize={{ width: "120px" }} />
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				);

				const wrappers = queryAllByDataRole(container, DataRoles.FileUpload);
				const uploadControls = queryAllByDataRole(container, DataRoles.FileUpload.Control);

				expect(wrappers).toHaveLength(4);
				expect(uploadControls).toHaveLength(4);

				// Fully responsive: fit class, no explicit styles
				expect(wrappers[0]).toHaveClass("field__upload--fit");
				expect(uploadControls[0]).not.toHaveStyle({ width: "150px", height: "100px" });

				// Fixed size: no fit class, explicit dimensions
				expect(wrappers[1]).not.toHaveClass("field__upload--fit");
				expect(uploadControls[1]).toHaveStyle({ width: "150px", height: "100px" });

				// Max width constraint: fit class, max constraint
				expect(wrappers[2]).toHaveClass("field__upload--fit");
				expect(uploadControls[2]).toHaveStyle({ maxWidth: "200px" });

				// Width only: fit class, width but responsive height
				expect(wrappers[3]).toHaveClass("field__upload--fit");
				expect(uploadControls[3]).toHaveStyle({ width: "120px" });
			});

			test("should maintain sizing when grid columns are rerendered", () => {
				const { container, rerender } = render(
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ lg: 6 }}>
								<DefaultFileUpload id="grid-rerender" label="Rerender Test" uploadAreaSize={{ maxWidth: "300px" }} />
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				);

				let wrapper = getByDataRole(container, DataRoles.FileUpload);
				let uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Initial state
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ maxWidth: "300px" });

				// Change grid column size
				rerender(
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ lg: 4 }}>
								<DefaultFileUpload id="grid-rerender" label="Rerender Test" uploadAreaSize={{ maxWidth: "300px" }} />
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				);

				wrapper = getByDataRole(container, DataRoles.FileUpload);
				uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should maintain sizing behavior after grid change
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ maxWidth: "300px" });
			});

			test("should work correctly in responsive grid breakpoints", () => {
				const { container } = render(
					<LayoutGrid.Grid>
						<LayoutGrid.Row>
							<LayoutGrid.Column size={{ sm: 12, md: 6, lg: 4 }}>
								<DefaultFileUpload
									id="grid-responsive-bp"
									label="Responsive Breakpoints"
									uploadAreaSize={{ maxHeight: "150px" }}
								/>
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					</LayoutGrid.Grid>
				);

				const wrapper = getByDataRole(container, DataRoles.FileUpload);
				const uploadControl = getByDataRole(container, DataRoles.FileUpload.Control);

				// Should adapt to responsive grid with constraints
				expect(wrapper).toHaveClass("field__upload--fit");
				expect(uploadControl).toHaveStyle({ maxHeight: "150px" });
			});
		});
	});

	describe("maxWidth and maxHeight constraints", () => {
		test("should have fit class when maxWidth is provided", () => {
			const { container } = render(
				<DefaultFileUpload id="test-maxwidth" label="Test MaxWidth" uploadAreaSize={{ maxWidth: "200px" }} />
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).toHaveClass("field__upload--fit");
		});

		test("should have fit class when maxHeight is provided", () => {
			const { container } = render(
				<DefaultFileUpload id="test-maxheight" label="Test MaxHeight" uploadAreaSize={{ maxHeight: "150px" }} />
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).toHaveClass("field__upload--fit");
		});

		test("should have fit class when both maxWidth and maxHeight are provided", () => {
			const { container } = render(
				<DefaultFileUpload
					id="test-both-max"
					label="Test Both Max"
					uploadAreaSize={{ maxWidth: "200px", maxHeight: "150px" }}
				/>
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).toHaveClass("field__upload--fit");
		});

		test("should have fit class when maxWidth is not provided but maxHeight is", () => {
			const { container } = render(
				<DefaultFileUpload id="test-no-maxwidth" label="Test No MaxWidth" uploadAreaSize={{ maxHeight: "150px" }} />
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).toHaveClass("field__upload--fit");
		});

		test("should have fit class when maxHeight is not provided but maxWidth is", () => {
			const { container } = render(
				<DefaultFileUpload id="test-no-maxheight" label="Test No MaxHeight" uploadAreaSize={{ maxWidth: "200px" }} />
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).toHaveClass("field__upload--fit");
		});

		test("should have fit class when neither maxWidth nor maxHeight are provided", () => {
			const { container } = render(
				<DefaultFileUpload id="test-no-constraints" label="Test No Constraints" uploadAreaSize={{}} />
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).toHaveClass("field__upload--fit");
		});

		test("should not have fit class when explicit width and height are provided", () => {
			const { container } = render(
				<DefaultFileUpload
					id="test-explicit-size"
					label="Test Explicit Size"
					uploadAreaSize={{
						width: "300px",
						height: "200px",
						maxWidth: "500px",
						maxHeight: "400px"
					}}
				/>
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).not.toHaveClass("field__upload--fit");
		});

		test("should have fit class when both maxWidth and maxHeight are provided (edge case with zero)", () => {
			const { container } = render(
				<DefaultFileUpload
					id="test-zero-max"
					label="Test Zero Max"
					uploadAreaSize={{ maxWidth: "0px", maxHeight: "0px" }}
				/>
			);

			const wrapper = getByDataRole(container, DataRoles.FileUpload);

			expect(wrapper).toHaveClass("field__upload--fit");
		});

		describe("interaction hint", () => {
			const title = "Upload files";

			test("default file upload should show componentConfigs.fileUpload=true", async () => {
				const { queryByDataRole } = render(
					<InteractionHintConfigProvider componentConfigs={{ fileUpload: true }}>
						<DefaultFileUpload
							id="test-zero-max"
							label="Test Zero Max"
							title={title}
							uploadAreaSize={{ maxWidth: "0px", maxHeight: "0px" }}
						/>
					</InteractionHintConfigProvider>
				);

				await userEvent.tab();

				const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
				expect(hintContent?.textContent).toEqual(title);
			});

			test("default file upload should not show componentConfigs.fileUpload=false", async () => {
				const { queryByDataRole } = render(
					<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ fileUpload: false }}>
						<DefaultFileUpload
							id="test-zero-max"
							label="Test Zero Max"
							title={title}
							uploadAreaSize={{ maxWidth: "0px", maxHeight: "0px" }}
						/>
					</InteractionHintConfigProvider>
				);

				await userEvent.tab();

				const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
				expect(hintContent).not.toBeInTheDocument();
			});
		});
	});
});
