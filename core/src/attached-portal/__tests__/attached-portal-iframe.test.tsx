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

import type { ReactNode } from "react";
import { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { describe, test, expect } from "vitest";
import { page } from "vitest/browser";
import { waitFor } from "@testing-library/dom";
import { render, getByDataRole } from "test-utils";

import { DataRoles } from "../../common/main/data-roles.js";
import { Button } from "../../button/main/button.view.js";
import { ActionContentbox } from "../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "../../contentbox/main/template/contentbox.tpl.view.js";

import { AttachedPortal } from "../main/attached-portal.view.js";

function AppInIframe(): ReactNode {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);

	return (
		<div style={{ height: "90vh", position: "absolute" }}>
			<Button
				label="Show/hide Attached Portal"
				buttonRef={(ref) => {
					buttonRef.current = ref;
				}}
				onClick={() => setShow((prevState) => !prevState)}
				className="-u-margin-lg"
			/>
			{buttonRef.current && show && (
				<AttachedPortal closeOnOutsideClick referenceElement={buttonRef.current} onVisibilityChange={setShow}>
					<ActionContentbox
						headingElements={<ContentBoxElements.Title ariaLevel={2} key="title" text="Content box heading title" />}
						boxShadow="always"
						style={{ background: "red" }}
					>
						<p>The Portal is positioned according to the position.</p>
					</ActionContentbox>
				</AttachedPortal>
			)}
		</div>
	);
}

function IFrameTestComponent(): ReactNode {
	const [isIframeReady, setIframeReady] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const handleRef = useCallback((ref: HTMLIFrameElement | null) => {
		iframeRef.current = ref;

		if (ref?.contentDocument?.body) {
			setIframeReady(true);
		}
	}, []);

	return (
		<iframe
			title="Parent Iframe"
			ref={handleRef}
			style={{ height: "1000px", width: "1000px", border: "1px solid black" }}
		>
			{isIframeReady &&
				iframeRef.current?.contentDocument?.body &&
				createPortal(<AppInIframe />, iframeRef.current.contentDocument.body)}
		</iframe>
	);
}

describe("AttachedPortal iframe behavior", () => {
	test("should show portal when it is implemented in an iframe", async () => {
		render(<IFrameTestComponent />);

		const parentFrame = page.frameLocator(page.getByTitle("Parent Iframe"));
		const triggerButton = parentFrame.getByRole("button", { name: "Show/hide Attached Portal" });

		await triggerButton.click();

		await waitFor(() => {
			expect(getByDataRole(document.body, DataRoles.AttachedPortal)).toBeVisible();
		});
	});
});
