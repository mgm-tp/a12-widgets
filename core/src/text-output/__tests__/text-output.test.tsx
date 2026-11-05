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

import { isAfter, queryByDataRole, render } from "test-utils";
import { describe, expect, test } from "vitest";

import { DataRoles } from "../../common/main/data-roles.js";
import type { MessagePosition } from "../../input/base/template/base.tpl.api.js";
import type { TooltipPosition } from "../../input/field-default-config/main/field-default-config.api.js";
import { HintTooltip } from "../../tooltip/hint/main/hint.view.js";
import { WarningTooltip } from "../../tooltip/warning/main/warning.view.js";
import { TextOutput } from "../main/text-output.view.js";

describe("com.mgmtp.a12.widgets.text-output", () => {
	/**
	 * TextOutput is rendered
	 * - TextOutput should be rendered and with proper class
	 */
	test("text-output-is-rendered", () => {
		const { container } = render(<TextOutput>Content</TextOutput>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput without paragraph tags
	 * - TextOutput should be rendered and text content should NOT be wrapped in <p> tags.
	 */
	test("text-output-is-rendered-without-p-tags-wrapping-content", () => {
		const text = "Content";
		const { container } = render(<TextOutput disableParagraphWrapping>{text}</TextOutput>);
		const paragraphWrapper = queryByDataRole(container, "text-output-paragraph");
		expect(paragraphWrapper).toBeNull();
	});

	/**
	 * TextOutput with tooltips
	 * - TextOutput should be rendered with tooltips.
	 */
	test("rendering-text-output-with-tooltips", () => {
		const { container } = render(
			<TextOutput tooltips={[<HintTooltip text="hint" key="hint" />, <WarningTooltip text="warning" key="warning" />]}>
				Content
			</TextOutput>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput with error message
	 * - TextOutput should be rendered with error message.
	 */
	test("rendering-text-output-with-error-message", () => {
		const { container } = render(<TextOutput errorMessage="error">Content</TextOutput>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput with warning message
	 * - TextOutput should be rendered with warning message.
	 */
	test("rendering-text-output-with-warning-message", () => {
		const { container } = render(<TextOutput warningMessage="warning">Content</TextOutput>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput with info message
	 * - TextOutput should be rendered with info message.
	 */
	test("rendering-text-output-with-info-message", () => {
		const { container } = render(<TextOutput infoMessage="info">Content</TextOutput>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput with error & warning message
	 * - TextOutput should be rendered with error & warning message.
	 */
	test("rendering-text-output-with-error-&-warning-message", () => {
		const { container } = render(
			<TextOutput errorMessage="error" warningMessage="warning">
				Content
			</TextOutput>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput with addons
	 * - TextOutput should be rendered with addons.
	 */
	test("rendering-text-output-with-addons", () => {
		const { container } = render(
			<TextOutput addonAfter={[<HintTooltip text="hint" />, <WarningTooltip text="warning" />]}>Content</TextOutput>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput with tooltips, messages and addons
	 */
	test("rendering-text-output-with-tooltips-messages-addons", () => {
		const { container } = render(
			<TextOutput
				errorMessage="error"
				warningMessage="warning"
				tooltips={[<HintTooltip text="hint1" key="hint1" />, <WarningTooltip text="warning2" key="hint2" />]}
				addonAfter={[<HintTooltip text="hint1" key="hint1" />, <WarningTooltip text="warning2" key="warning2" />]}
			>
				Content
			</TextOutput>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * no-data TextOutput is rendered
	 * - TextOutput should be rendered and have the content with class 'text-output__no-data'.
	 * - Addons should be placed inside the 'text-output__no-data'.
	 */
	test("rendering-text-output-no-data", () => {
		const { container } = render(<TextOutput noData>Content</TextOutput>);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * no-data TextOutput with addons is rendered
	 * - Addons should be placed inside the 'text-output__no-data'.
	 */
	test("rendering-text-output-no-data-with-addons", () => {
		const { container } = render(
			<TextOutput noData addonAfter={[<HintTooltip text="hint" />, <WarningTooltip text="warning" />]}>
				Content
			</TextOutput>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	/**
	 * TextOutput with alignment
	 * - left: default alignment, TextOutput should be rendered and has no specific class.
	 * - center: TextOutput should be rendered and has class "text-output-wrapper--center".
	 * - right: TextOutput should be rendered and has class "text-output-wrapper--right".
	 */
	test("rendering-text-output-with-alignment", () => {
		const { container: leftContainer } = render(<TextOutput>Content</TextOutput>);
		expect(leftContainer.firstChild).toMatchSnapshot();

		const { container: rightContainer } = render(<TextOutput alignment="right">Content</TextOutput>);
		expect(rightContainer.firstChild).toMatchSnapshot();

		const { container: centerContainer } = render(<TextOutput alignment="center">Content</TextOutput>);
		expect(centerContainer.firstChild).toMatchSnapshot();
	});

	describe("message position", () => {
		const messageRoles = [DataRoles.Error.Message, DataRoles.Warning.Message, DataRoles.Info.Message];

		const renderWithMessages = (messagePosition?: MessagePosition) =>
			render(
				<TextOutput
					label="Test Label"
					errorMessage="Test error message"
					warningMessage="Test warning message"
					infoMessage="Test info message"
					messagePosition={messagePosition}
				>
					Content
				</TextOutput>
			);

		test("renders the messages above the content by default", () => {
			const { getByDataRole } = renderWithMessages();
			const label = getByDataRole(`${DataRoles.Label}`);
			const content = getByDataRole(DataRoles.TextOutput.Content);

			for (const role of messageRoles) {
				const message = getByDataRole(role);

				expect(isAfter(label, message)).toBe(true);
				expect(isAfter(message, content)).toBe(true);
			}
		});

		test("renders the messages below the content for below", () => {
			const { getByDataRole } = renderWithMessages("below");
			const content = getByDataRole(DataRoles.TextOutput.Content);

			for (const role of messageRoles) {
				expect(isAfter(content, getByDataRole(role))).toBe(true);
			}
		});
	});

	describe("tooltip position", () => {
		const renderWithTooltips = (tooltipPosition?: TooltipPosition) =>
			render(
				<TextOutput
					label="Test Label"
					errorMessage="Test error message"
					tooltips={<div>Test tooltip</div>}
					tooltipPosition={tooltipPosition}
				>
					Content
				</TextOutput>
			);

		test("renders the tooltips between the label and the content by default", () => {
			const { getByDataRole, getByText } = renderWithTooltips();
			const label = getByDataRole(`${DataRoles.Label}`);
			const content = getByDataRole(DataRoles.TextOutput.Content);
			const tooltip = getByText("Test tooltip");

			expect(isAfter(label, tooltip)).toBe(true);
			expect(isAfter(tooltip, content)).toBe(true);
		});

		/**
		 * "beside" and "above" place the tooltips in the same slot - the two differ only in the label
		 * turning into a block, which pushes the tooltips onto their own line. The assertions here are
		 * therefore the same as for the default, and guard that "above" keeps the tooltips ahead of the
		 * content rather than moving them the way "below" does.
		 */
		test("keeps the tooltips between the label and the content for above", () => {
			const { getByDataRole, getByText } = renderWithTooltips("above");
			const label = getByDataRole(`${DataRoles.Label}`);
			const content = getByDataRole(DataRoles.TextOutput.Content);
			const tooltip = getByText("Test tooltip");

			expect(isAfter(label, tooltip)).toBe(true);
			expect(isAfter(tooltip, content)).toBe(true);
		});

		test("renders the tooltips under the content for below", () => {
			const { getByDataRole, getByText } = renderWithTooltips("below");
			const content = getByDataRole(DataRoles.TextOutput.Content);
			const tooltip = getByText("Test tooltip");

			expect(isAfter(content, tooltip)).toBe(true);
		});

		test("renders the tooltips after the messages when both are below", () => {
			const { getByDataRole, getByText } = render(
				<TextOutput
					label="Test Label"
					errorMessage="Test error message"
					tooltips={<div>Test tooltip</div>}
					messagePosition="below"
					tooltipPosition="below"
				>
					Content
				</TextOutput>
			);
			const content = getByDataRole(DataRoles.TextOutput.Content);
			const message = getByDataRole(DataRoles.Error.Message);
			const tooltip = getByText("Test tooltip");

			expect(isAfter(content, message)).toBe(true);
			expect(isAfter(message, tooltip)).toBe(true);
		});
	});
});
