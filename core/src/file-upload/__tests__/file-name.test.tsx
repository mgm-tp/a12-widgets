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

import { render, fireEvent, getByDataRole, queryByDataRole, screen } from "test-utils";
import { describe, test, expect, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { HintTooltip } from "../../tooltip/hint/main/hint.view.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { DefaultFileUploadProps } from "../main/default/default-file-upload.api.js";
import { DefaultFileUpload } from "../main/default/default-file-upload.view.js";

const properties: Partial<DefaultFileUploadProps> = {
	id: "test-id",
	label: "Test File Name",
	compact: true,
	fileOptions: {
		name: "Test File.pdf",
		icon: (
			<Icon title="Datatype PDF" iconTheme="custom">
				datatype_pdf
			</Icon>
		)
	}
};

describe("com.mgmtp.a12.widgets.default-file-upload.simplified", () => {
	test("render file name before uploading", () => {
		const { container } = render(<DefaultFileUpload id="file-upload" label={properties.label} compact />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render file name after uploading", () => {
		const { container } = render(<DefaultFileUpload {...properties} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render file name with tooltip", () => {
		const { container } = render(
			<DefaultFileUpload {...properties} tooltips={<HintTooltip text="Info inline tooltip" id="test-info-tooltip" />} />
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render with error message", () => {
		const { container } = render(<DefaultFileUpload {...properties} errorMessage="Test Error Message" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render with warning message", () => {
		const { container } = render(<DefaultFileUpload {...properties} warningMessage="Test Warning Message" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render with info message", () => {
		const { container } = render(<DefaultFileUpload {...properties} infoMessage={properties.infoMessage} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render long file name", () => {
		const { container } = render(
			<DefaultFileUpload
				{...properties}
				fileOptions={{
					name: "Antrag velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt.pdf",
					icon: (
						<Icon title="Datatype PDF" iconTheme="custom">
							datatype_pdf
						</Icon>
					)
				}}
			/>
		);
		expect(getByDataRole(container, DataRoles.Link).classList.contains("-u-truncate")).toBeTruthy();
	});

	test("render file name with text only display", () => {
		const { container } = render(
			<DefaultFileUpload
				{...properties}
				fileOptions={{
					name: "Antrag velit aliquip deserunt velit aliquip deserunt velit aliquip deserunt.pdf",
					icon: (
						<Icon title="Datatype PDF" iconTheme="custom">
							datatype_pdf
						</Icon>
					),
					textOnlyDisplay: true
				}}
			/>
		);
		expect(getByDataRole(container, DataRoles.Link).classList.contains("-u-truncate")).toBeFalsy();
	});

	test("render readonly file name", () => {
		const { container } = render(<DefaultFileUpload {...properties} readOnly />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render readonly compact file upload with plain text", () => {
		const { container } = render(
			<DefaultFileUpload compact readOnly fileOptions={{ name: "no data", showAsLink: false, textOnlyDisplay: true }} />
		);
		const textOutput = getByDataRole(container, DataRoles.TextOutput);
		const link = queryByDataRole(textOutput, DataRoles.Link);
		expect(link).toBeFalsy();
		expect(textOutput.textContent).toBe("no data");
	});

	test("render disabled file name", () => {
		const { container } = render(<DefaultFileUpload {...properties} disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("render with loading state", () => {
		const { container } = render(<DefaultFileUpload {...properties} loading loadingLabel="Test Loading" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate cancel event", () => {
		const onCancelFn = vi.fn();
		const { container } = render(
			<DefaultFileUpload {...properties} loading loadingLabel="Test Loading" onCancel={onCancelFn} />
		);

		const fileUploadActionsElement = getByDataRole(container, DataRoles.FileUpload.Actions);
		const fileUploadCancelButton = getByDataRole(fileUploadActionsElement, DataRoles.Button);

		fireEvent.click(fileUploadCancelButton);
		expect(onCancelFn).toHaveBeenCalledTimes(1);
	});

	test("simulate upload area click", async () => {
		const onUploadAreaClick = vi.fn();
		const uploadAreaRefFn = vi.fn();
		render(<DefaultFileUpload {...properties} uploadAreaRef={uploadAreaRefFn} onUploadAreaClick={onUploadAreaClick} />);

		const uploadArea = screen.getByTitle(/upload file/i);

		expect(uploadAreaRefFn).toHaveBeenCalledTimes(1);

		fireEvent.click(uploadArea);
		expect(uploadAreaRefFn).toHaveBeenCalledTimes(1);
		await userEvent.keyboard("{Escape}");
	});

	test("should not overflow when its parent has padding", () => {
		const { container } = render(
			<div style={{ padding: "16px" }}>
				<DefaultFileUpload {...properties} />
			</div>
		);
		const fileUpload = getByDataRole(container, DataRoles.FileUpload);
		const fileUploadContent = getByDataRole(container, DataRoles.FileUpload.Content);

		const fileUploadWidth = fileUpload.getBoundingClientRect().width;
		const fileUploadContentWidth = fileUploadContent.getBoundingClientRect().width;

		expect(fileUploadContentWidth).toBeLessThanOrEqual(fileUploadWidth);
	});
});
