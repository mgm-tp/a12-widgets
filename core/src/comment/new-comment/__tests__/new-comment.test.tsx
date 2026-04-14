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

import { getByDataRole, render, fireEvent } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { Button } from "../../../button/main/button.view.js";
import { Icon } from "../../../icon/main/icon.view.js";

import { NewComment } from "../main/new-comment.view.js";

const baseTextAreaDataRole = "textarea";
describe("com.mgmtp.a12.widgets.new-comment", () => {
	const content = "Some random string";

	test("rendering-new-comment", () => {
		const { container } = render(
			<NewComment
				commentMeta={{
					avatar: <Icon>account_circle</Icon>,
					author: "Livia Böhme"
				}}
			>
				{content}
			</NewComment>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-new-comment-with-reply", () => {
		const { container } = render(<NewComment isReply> {content} </NewComment>);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-new-comment-with-actions", () => {
		const { container } = render(
			<NewComment
				actionButtons={[
					<Button key="cancel-button" label="Cancel" destructive />,
					<Button key="send-button" label="Send" primary />
				]}
			>
				{content}
			</NewComment>
		);

		expect(container.firstChild).toMatchSnapshot();
	});
});

describe("com.mgmtp.a12.widgets.new-comment.input", () => {
	test("rendering-new-comment-input", () => {
		const onFocusSpy = vi.fn();
		const onBlurSpy = vi.fn();

		const { container } = render(<NewComment.Input onFocus={onFocusSpy} onBlur={onBlurSpy} />);
		const input = getByDataRole(container, `${baseTextAreaDataRole}-input`);

		fireEvent.focus(input);
		expect(onFocusSpy).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(onBlurSpy).toHaveBeenCalledTimes(1);

		expect(container.firstChild).toMatchSnapshot();
	});
});
