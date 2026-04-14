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

import { render, fireEvent, waitFor } from "test-utils";
import { describe, vi, expect, test } from "vitest";

import { Icon } from "../../icon/main/icon.view.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";

import { Wizard } from "../main/wizard.view.js";

describe("com.mgmtp.a12.widgets.wizard", () => {
	test("rendering default wizard", () => {
		const { container } = render(
			<Wizard truncate responsive>
				<Wizard.PreviousStepButton />
				<Wizard.Step label="Preconditions" icon={<Icon>description</Icon>} />
				<Wizard.Step label="Master Conditions" icon={<Icon>list</Icon>} selected />
				<Wizard.Step label="Intl. Cover" icon={<Icon>phone_android</Icon>} />
				<Wizard.Step label="Partner" icon={<Icon>people</Icon>} />
				<Wizard.NextStepButton />
			</Wizard>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering wizard with first step selected", () => {
		const { container } = render(
			<Wizard truncate responsive>
				<Wizard.PreviousStepButton />
				<Wizard.Step label="Preconditions" icon={<Icon>description</Icon>} selected />
				<Wizard.Step label="Master Conditions" icon={<Icon>list</Icon>} />
				<Wizard.Step label="Intl. Cover" icon={<Icon>phone_android</Icon>} />
				<Wizard.Step label="Partner" icon={<Icon>people</Icon>} />
				<Wizard.NextStepButton />
			</Wizard>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering wizard with last step selected", () => {
		const { container } = render(
			<Wizard truncate responsive>
				<Wizard.PreviousStepButton />
				<Wizard.Step label="Preconditions" icon={<Icon>description</Icon>} />
				<Wizard.Step label="Master Conditions" icon={<Icon>list</Icon>} />
				<Wizard.Step label="Intl. Cover" icon={<Icon>phone_android</Icon>} />
				<Wizard.Step label="Partner" icon={<Icon>people</Icon>} selected />
				<Wizard.NextStepButton />
			</Wizard>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering wizard with selected finished step", () => {
		const { container } = render(
			<Wizard truncate responsive>
				<Wizard.PreviousStepButton />
				<Wizard.Step label="Preconditions" icon={<Icon>description</Icon>} />
				<Wizard.Step label="Master Conditions" icon={<Icon>list</Icon>} selected finished />
				<Wizard.Step label="Intl. Cover" icon={<Icon>phone_android</Icon>} />
				<Wizard.Step label="Partner" icon={<Icon>people</Icon>} />
				<Wizard.NextStepButton />
			</Wizard>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering wizard with selected warning step", () => {
		const { container } = render(
			<Wizard truncate responsive>
				<Wizard.PreviousStepButton />
				<Wizard.Step label="Preconditions" icon={<Icon>description</Icon>} />
				<Wizard.Step label="Master Conditions" icon={<Icon>list</Icon>} selected warning />
				<Wizard.Step label="Intl. Cover" icon={<Icon>phone_android</Icon>} />
				<Wizard.Step label="Partner" icon={<Icon>people</Icon>} />
				<Wizard.NextStepButton />
			</Wizard>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering wizard with non-interactive steps", () => {
		const { container } = render(
			<Wizard truncate responsive>
				<Wizard.Step label="Preconditions" icon={<Icon>description</Icon>} nonInteractive />
				<Wizard.Step label="Master Conditions" icon={<Icon>list</Icon>} selected nonInteractive />
				<Wizard.Step label="Intl. Cover" icon={<Icon>phone_android</Icon>} nonInteractive />
				<Wizard.Step label="Partner" icon={<Icon>people</Icon>} nonInteractive />
			</Wizard>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering wizard with disabled steps", () => {
		const { container } = render(
			<Wizard truncate responsive>
				<Wizard.PreviousStepButton disabled />
				<Wizard.Step label="Preconditions" icon={<Icon>description</Icon>} disabled />
				<Wizard.Step label="Master Conditions" icon={<Icon>list</Icon>} selected disabled />
				<Wizard.Step label="Intl. Cover" icon={<Icon>phone_android</Icon>} disabled />
				<Wizard.Step label="Partner" icon={<Icon>people</Icon>} disabled />
				<Wizard.NextStepButton disabled />
			</Wizard>
		);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("rendering leftout steps", () => {
		const { container } = render(<Wizard.Step icon={<Icon>more_horiz</Icon>} leftOut />);
		expect(container.firstChild).toMatchSnapshot();
	});
	test("wizard previous button events", () => {
		const onPreviousButtonClickSpy = vi.fn();
		const { container } = render(<Wizard.PreviousStepButton onClick={onPreviousButtonClickSpy} />);
		const button = container.firstChild as Element;
		fireEvent.click(button);
		expect(onPreviousButtonClickSpy).toHaveBeenCalledTimes(1);
	});
	test("wizard next button events", () => {
		const onNextButtonClickSpy = vi.fn();
		const { container } = render(<Wizard.NextStepButton onClick={onNextButtonClickSpy} />);
		const button = container.firstChild as Element;
		fireEvent.click(button);
		expect(onNextButtonClickSpy).toHaveBeenCalledTimes(1);
	});

	describe("Interaction Hint", () => {
		test("wizard step should not show hint when componentConfigs.wizard=true", async () => {
			const title = "Step 1";
			const { getByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ wizard: true }}>
					<Wizard.Step label="Step" title={title} />
				</InteractionHintConfigProvider>
			);
			const stepButton = getByDataRole(DataRoles.Wizard.Content);
			fireEvent.focus(stepButton);

			await waitFor(() => {
				const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
				expect(hintContent?.textContent).toEqual(title);
			});
		});

		test("wizard step should not show hint when componentConfigs.wizard=false", async () => {
			const title = "Step 1";
			const { getByDataRole, queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ wizard: false }}>
					<Wizard.Step label="Step" title={title} />
				</InteractionHintConfigProvider>
			);

			const stepButton = getByDataRole(DataRoles.Wizard.Content);
			fireEvent.focus(stepButton);

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});
	});
});
