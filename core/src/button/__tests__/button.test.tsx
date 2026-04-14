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

import { fireEvent, render, waitFor } from "test-utils";
import { Key } from "ts-key-enum";
import { describe, test, expect, vi } from "vitest";

import { Icon } from "../../icon/main/icon.view.js";
import { Badge } from "../../badge/main/badge.view.js";
import { getBadgeTitle } from "../../badge/main/badge-utils.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { Button } from "../main/button.view.js";
import type { ButtonProps } from "../main/button.api.js";

describe("com.mgmtp.a12.widgets.button", () => {
	test("rendering-secondary", () => {
		const { container } = render(
			<Button
				label="test"
				id="test-id"
				className="test-class-name"
				style={{ color: "red" }}
				title="test-title"
				type="reset"
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-secondary-invert", () => {
		const { container } = render(<Button label="test" invert />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-secondary-invert", () => {
		const { container } = render(<Button label="test" invert disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-primary-button", () => {
		const { container } = render(<Button primary label="test" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-primary-destructive-button", () => {
		const { container } = render(<Button primary destructive label="test" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-primary-active-button", () => {
		const { container } = render(<Button primary active label="test" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-invert-primary-button", () => {
		const { container } = render(<Button primary invert label="test" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-block-button", () => {
		const { container } = render(<Button block />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-active-button", () => {
		const { container } = render(<Button active />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-destructive-button", () => {
		const { container } = render(<Button destructive />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-button", () => {
		const { container } = render(<Button disabled />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-vertical-button", () => {
		const { container } = render(<Button vertical icon={<Icon>search</Icon>} label="Search" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-progress-button", () => {
		const { container } = render(<Button loading label="In Progress" id="loading-test" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-progress-button-with-icon", () => {
		const { container } = render(<Button loading icon={<Icon>search</Icon>} label="In Progress" id="loading-test" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-button-with-additional-attributes", () => {
		const { container } = render(
			<Button buttonAttributes={{ "aria-label": "Test Label", "aria-labelledby": "test-id" }} />
		);
		const button = container.querySelector("[data-role='button']");

		expect(button?.getAttribute("aria-label")).toBe("Test Label");
		expect(button?.getAttribute("aria-labelledby")?.includes("test-id")).toBeTruthy();
	});

	test("simulating-mouse-event", () => {
		const onMouseOver = vi.fn();
		const onMouseLeave = vi.fn();
		const onMouseDown = vi.fn();
		const onButtonClick = vi.fn();

		const { container } = render(
			<Button onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseOver={onMouseOver} onClick={onButtonClick} />
		);

		const button = container.firstChild as Element;
		fireEvent.mouseDown(button);
		expect(onMouseDown).toHaveBeenCalledTimes(1);

		fireEvent.mouseOver(button);
		expect(onMouseOver).toHaveBeenCalledTimes(1);

		fireEvent.mouseLeave(button);
		expect(onMouseLeave).toHaveBeenCalledTimes(1);

		fireEvent.click(button);
		expect(onButtonClick).toHaveBeenCalledTimes(1);
	});

	test("simulating-click-on-disabled-button", () => {
		const onButtonClick = vi.fn();

		const { container } = render(<Button onClick={onButtonClick} disabled />);

		const button = container.firstChild as Element;
		fireEvent.click(button);
		expect(onButtonClick).toHaveBeenCalledTimes(0);
	});

	test("simulating-buttonRef", () => {
		const buttonRef = vi.fn();
		render(<Button buttonRef={buttonRef} />);
		expect(buttonRef).toHaveBeenCalledTimes(1);
	});

	test("simulating-key-event", () => {
		const onKeyDown = vi.fn();
		const onKeyPress = vi.fn();
		const onKeyUp = vi.fn();
		const { container } = render(<Button onKeyDown={onKeyDown} onKeyPress={onKeyPress} onKeyUp={onKeyUp} />);

		const button = container.firstChild as Element;

		fireEvent.keyDown(button);
		expect(onKeyDown).toHaveBeenCalledTimes(1);

		fireEvent.keyUp(button);
		expect(onKeyUp).toHaveBeenCalledTimes(1);
	});

	test("simulating-focus-and-blur-event", () => {
		const onFocus = vi.fn();
		const onBlur = vi.fn();
		const { container } = render(<Button onFocus={onFocus} onBlur={onBlur} />);

		const button = container.firstChild as Element;

		fireEvent.focus(button);
		expect(onFocus).toHaveBeenCalledTimes(1);

		fireEvent.blur(button);
		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});

describe("com.mgmtp.a12.widgets.icon-button", () => {
	test("rendering-icon-button", () => {
		const { container } = render(
			<Button
				id="test-id"
				className="test-class-name"
				style={{ color: "red" }}
				title="test-title"
				type="reset"
				icon={<Icon>close</Icon>}
			/>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-active-icon-button", () => {
		const { container } = render(<Button active icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-destructive-icon-button", () => {
		const { container } = render(<Button destructive icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-invert-icon-button", () => {
		const { container } = render(<Button invert icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-active-invert-icon-button", () => {
		const { container } = render(<Button invert active icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-invert-icon-button", () => {
		const { container } = render(<Button invert disabled icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-active-invert-icon-button", () => {
		const { container } = render(<Button invert disabled active icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-invert-with-rounded-icon-button", () => {
		const { container } = render(<Button invert icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-active-invert-with-rounded-icon-button", () => {
		const { container } = render(<Button invert active icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-invert-with-rounded-icon-button", () => {
		const { container } = render(<Button invert disabled icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-disabled-active-invert-with-rounded-icon-button", () => {
		const { container } = render(<Button invert active disabled icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-primary-icon-button", () => {
		const { container } = render(<Button primary icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-primary-active-icon-button", () => {
		const { container } = render(<Button primary active icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-primary-destructive-icon-button", () => {
		const { container } = render(<Button primary destructive icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-secondary-icon-button", () => {
		const { container } = render(<Button secondary icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-secondary-destructive-icon-button", () => {
		const { container } = render(<Button secondary destructive icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-secondary-active-icon-button", () => {
		const { container } = render(<Button secondary active icon={<Icon>close</Icon>} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-icon-button-with-badge", () => {
		const title = "10 unread notifications";

		const { container } = render(
			<Button title={title} badge={<Badge tiny variant="info" />} icon={<Icon>close</Icon>} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering-progress-icon-button", () => {
		const { container } = render(<Button loading icon={<Icon>search</Icon>} id="loading-test" />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering button with progress bar", () => {
		const { container } = render(<Button primary processedPercentage={50} />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("rendering button with the hidden label", () => {
		const { container } = render(<Button label="test label" labelHidden icon={<Icon>search</Icon>} />);

		const button = container.querySelector("[data-role='button']");

		expect(button?.getAttribute("aria-label")).toBeNull();
		expect(button?.getAttribute("data-type")).toEqual("icon");
	});

	test("should have title attribute when interaction hint is disabled", async () => {
		const title = "10 unread notifications";

		const { getByDataRole } = render(
			<InteractionHintConfigProvider componentConfigs={{ iconButton: false }}>
				<Button title={title} icon={<Icon>close</Icon>} />
			</InteractionHintConfigProvider>
		);

		const triggerElement = getByDataRole(DataRoles.Button);

		expect(triggerElement.getAttribute("title")).toEqual(title);
		expect(triggerElement.getAttribute("aria-label")).toEqual(title);
	});

	describe("interaction hint", () => {
		const title = "interaction hint";
		const ButtonWithHint = (props: ButtonProps) => (
			<InteractionHintConfigProvider enableInteractionHint>
				<Button {...props} />
			</InteractionHintConfigProvider>
		);

		test("should display the hint on hover and hide it on hover leave", async () => {
			const { getByDataRole, queryByDataRole } = render(<ButtonWithHint title={title} icon={<Icon>search</Icon>} />);

			const button = getByDataRole(DataRoles.Button);

			expect(button.getAttribute("aria-label")).toEqual(title);

			// The button should have the empty title attribute
			expect(button.getAttribute("title")).toEqual("");

			fireEvent.mouseOver(button);

			await waitFor(() => {
				const interactionHint = getByDataRole(DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual(title);
			});

			fireEvent.mouseLeave(button);

			await waitFor(() => {
				expect(queryByDataRole(DataRoles.InteractionHint)).toBeFalsy();
			});
		});

		test("should display the hint on focus and hide when focus out", () => {
			const { getByDataRole, queryByDataRole } = render(
				<ButtonWithHint label="test label" title={title} icon={<Icon>search</Icon>} />
			);

			const button = getByDataRole(DataRoles.Button);

			fireEvent.focus(button);

			const interactionHint = getByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(title);

			fireEvent.focusOut(button);
			expect(queryByDataRole(DataRoles.InteractionHint)).toBeFalsy();
		});

		test("should not display the hint when focusing on the disabled button", () => {
			const { getByDataRole, queryByDataRole } = render(
				<ButtonWithHint label="test label" title={title} disabled icon={<Icon>search</Icon>} />
			);

			const button = getByDataRole(DataRoles.Button);

			fireEvent.focus(button);

			const interactionHint = queryByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeFalsy();
		});

		test("should not display the hint when title is empty", async () => {
			const { getByDataRole, queryByDataRole } = render(<Button title="" icon={<Icon>search</Icon>} />);

			const button = getByDataRole(DataRoles.Button);

			expect(button.getAttribute("aria-label")).toBeFalsy();
			expect(button.getAttribute("title")).toEqual("");

			fireEvent.mouseOver(button);

			await waitFor(() => {
				const interactionHint = queryByDataRole(DataRoles.InteractionHint);

				expect(interactionHint).toBeFalsy();
			});
		});

		test("should display the hint when hovering on the disabled button", async () => {
			const { getByDataRole, queryByDataRole } = render(
				<ButtonWithHint label="test label" title={title} disabled icon={<Icon>search</Icon>} />
			);

			const button = getByDataRole(DataRoles.Button);

			fireEvent.mouseOver(button);

			await waitFor(() => {
				const interactionHint = queryByDataRole(DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual(title);
			});
		});

		test("should hide the hint when pressing the Escape key", () => {
			const { getByDataRole, queryByDataRole } = render(
				<ButtonWithHint label="test label" title={title} icon={<Icon>search</Icon>} />
			);

			const button = getByDataRole(DataRoles.Button);

			fireEvent.focus(button);

			const interactionHint = getByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(title);

			fireEvent.keyDown(button, { key: Key.Escape });
			expect(queryByDataRole(DataRoles.InteractionHint)).toBeFalsy();
		});

		test("should display the hint when there is a label and the title is different from the label", async () => {
			const { getByDataRole } = render(<ButtonWithHint label="test label" title={title} />);

			const button = getByDataRole(DataRoles.Button);
			expect(button.getAttribute("aria-label")).toEqual(`test label, ${title}`);

			fireEvent.focus(button);

			await waitFor(() => {
				const interactionHint = getByDataRole(DataRoles.InteractionHint);

				expect(interactionHint).toBeTruthy();
				expect(interactionHint?.textContent).toEqual(title);
			});
		});

		test("should display the hint contain the badge content", async () => {
			const { getByDataRole } = render(
				<ButtonWithHint badge={<Badge tiny variant="info" count={10} />} icon={<Icon>close</Icon>} />
			);

			const button = getByDataRole(DataRoles.Button);
			fireEvent.focus(button);

			await waitFor(() => {
				const hintContent = getByDataRole(DataRoles.InteractionHint.Content);
				const badgeTitle = getBadgeTitle({ count: 10, variant: "info", tiny: true }, getA11yResource("en").badgeTitles);

				expect(hintContent.textContent).toEqual(badgeTitle);
			});
		});

		test("should display the hint contain the badge title", async () => {
			const title = "10 unread notifications";
			const { getByDataRole } = render(
				<ButtonWithHint badge={<Badge tiny variant="info" count={10} title={title} />} icon={<Icon>close</Icon>} />
			);

			const button = getByDataRole(DataRoles.Button);
			expect(button.getAttribute("title")).toEqual("");

			fireEvent.focus(button);

			await waitFor(() => {
				const hintContent = getByDataRole(DataRoles.InteractionHint.Content);

				expect(hintContent.textContent).toEqual(title);
			});
		});

		test("icon button shows hint when componentConfigs.iconButton=true", async () => {
			const { getByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ iconButton: true }}>
					<Button icon={<Icon>close</Icon>} title="Close" />
				</InteractionHintConfigProvider>
			);

			const button = getByDataRole(DataRoles.Button);
			fireEvent.focus(button);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent?.textContent).toEqual("Close");
		});

		test("regular button should not show hint when componentConfigs.button=false", async () => {
			const { getByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ button: false }}>
					<Button label="Save" title="Save changes" />
				</InteractionHintConfigProvider>
			);

			const button = getByDataRole(DataRoles.Button);
			fireEvent.focus(button);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});

		test("icon button can be enabled independently with iconButton config", async () => {
			const { getByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider componentConfigs={{ button: false, iconButton: true }}>
					<Button icon={<Icon>close</Icon>} title="Close" />
				</InteractionHintConfigProvider>
			);

			const button = getByDataRole(DataRoles.Button);
			fireEvent.focus(button);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent?.textContent).toEqual("Close");
		});
	});
});
