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
import { useRef, useState } from "react";
import { render, getByDataRole } from "test-utils";
import { describe, expect, test, afterEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import { waitFor } from "@testing-library/dom";

import { DataRoles } from "../../common/main/data-roles.js";
import { Button } from "../../button/main/button.view.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { AttachedPortal } from "../main/attached-portal.view.js";

function ScrollableAttachedPortal({
	hideOnReferenceElementPositionChange
}: {
	hideOnReferenceElementPositionChange: boolean;
}): ReactNode {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [show, setShow] = useState(false);

	const getButtonRef = (ref: HTMLButtonElement): void => {
		buttonRef.current = ref;
	};

	return (
		<InteractionHintConfigProvider enableInteractionHint>
			<Button buttonRef={getButtonRef} dataRole="trigger-button" onClick={() => setShow((prevState) => !prevState)}>
				Trigger Button
			</Button>
			{buttonRef.current && show && (
				<AttachedPortal
					hideOnReferenceElementPositionChange={hideOnReferenceElementPositionChange}
					onVisibilityChange={setShow}
					referenceElement={buttonRef.current}
				>
					<div
						style={{
							height: "500px",
							width: "500px",
							backgroundColor: "green"
						}}
						data-role="portal-element"
					/>
				</AttachedPortal>
			)}
		</InteractionHintConfigProvider>
	);
}

describe("AttachedPortal scroll behavior with mouse wheel", () => {
	afterEach(() => {
		document.body.style.height = "";
		document.body.style.overflow = "";
	});

	test("should not close attached portal while scrolling when hideOnReferenceElementPositionChange is false", async () => {
		const { container } = render(<ScrollableAttachedPortal hideOnReferenceElementPositionChange={false} />);

		// Make the page scrollable
		document.body.style.height = "2000px";
		document.body.style.overflow = "auto";

		const body = page.elementLocator(document.body);
		await body.wheel({ delta: { y: 10 } });

		const triggerButton = getByDataRole(container, "trigger-button") as HTMLButtonElement;
		await userEvent.click(page.elementLocator(triggerButton));

		const attachedPortal = getByDataRole(document.body, DataRoles.AttachedPortal);
		expect(attachedPortal).toBeVisible();

		await body.wheel({ delta: { y: -10 } });

		expect(attachedPortal).toBeVisible();
	});

	test("should close attached portal while scrolling when hideOnReferenceElementPositionChange is true", async () => {
		const { container } = render(<ScrollableAttachedPortal hideOnReferenceElementPositionChange={true} />);

		// Make the page scrollable
		document.body.style.height = "2000px";
		document.body.style.overflow = "auto";

		const body = page.elementLocator(document.body);
		await body.wheel({ delta: { y: 10 } });

		const triggerButton = getByDataRole(container, "trigger-button") as HTMLButtonElement;
		await userEvent.click(page.elementLocator(triggerButton));

		const attachedPortal = getByDataRole(document.body, DataRoles.AttachedPortal) as HTMLElement;
		expect(attachedPortal).toBeVisible();

		await body.wheel({ delta: { y: -10 } });

		// Also dispatch a scroll event to ensure the portal's scroll handler fires
		document.dispatchEvent(new Event("scroll", { bubbles: true }));
		window.dispatchEvent(new Event("scroll", { bubbles: true }));

		await waitFor(
			() => {
				expect(attachedPortal).not.toBeVisible();
			},
			{ timeout: 3000 }
		);
	});
});
