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

import type { ReactElement } from "react";
import { useState } from "react";
import { getAllByDataRole, getByDataRole, render, fireEvent, waitFor } from "test-utils";
import { describe, vi, expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { A11YLanguageContext, getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { Icon } from "../../icon/main/icon.view.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import type { WizardProps } from "../main/wizard.api.js";
import { Wizard } from "../main/wizard.view.js";

const stepLabels = ["Preconditions", "Master Conditions", "Intl. Cover", "Partner", "Quote", "Policy"];
const LEFT_OUT = "...";

/**
 * Labels of the steps currently rendered inside the wizard, in DOM order; a condensed "left-out" step
 * (its content is hidden from assistive technology) is reported as {@link LEFT_OUT}.
 * Scoped to the wizard element because the responsive wizard renders an off-screen measuring step next to it.
 */
function visibleStepLabels(wizard: HTMLElement): string[] {
	return getAllByDataRole(wizard, DataRoles.Wizard.Step).map((step) => {
		const content = getByDataRole(step, DataRoles.Wizard.Content);

		return content.getAttribute("aria-hidden") === "true" ? LEFT_OUT : (content.textContent ?? "");
	});
}

function getStepContent(wizard: HTMLElement, label: string): HTMLElement {
	const content = getAllByDataRole(wizard, DataRoles.Wizard.Content).find((el) => el.textContent === label);

	if (!content) {
		throw new Error(`No step with label "${label}"`);
	}

	return content;
}

function getNavigationButton(wizard: HTMLElement, type: "previous" | "next"): HTMLElement {
	const button = wizard.querySelector<HTMLElement>(`button[data-type="${DataRoles.Wizard}-${type}"]`);

	if (!button) {
		throw new Error(`No ${type} button`);
	}

	return button;
}

interface ControlledWizardProps extends WizardProps {
	initialStep?: number;
	stepCount?: number;
	onStepChange?(step: number): void;
}

/** A consumer-style wizard: the selected step is component state, the navigation buttons move it. */
function ControlledWizard({
	initialStep = 0,
	stepCount = stepLabels.length,
	onStepChange,
	...wizardProps
}: ControlledWizardProps): ReactElement {
	const [selected, setSelected] = useState(initialStep);
	const labels = stepLabels.slice(0, stepCount);
	const select = (step: number): void => {
		setSelected(step);
		onStepChange?.(step);
	};

	return (
		<Wizard {...wizardProps}>
			<Wizard.PreviousStepButton disabled={selected === 0} onClick={() => select(selected - 1)} />
			{labels.map((label, index) => (
				<Wizard.Step
					key={label}
					label={label}
					selected={index === selected}
					finished={index < selected}
					onClick={() => select(index)}
				/>
			))}
			<Wizard.NextStepButton disabled={selected === labels.length - 1} onClick={() => select(selected + 1)} />
		</Wizard>
	);
}

ControlledWizard.displayName = "ControlledWizard";

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

	describe("root element", () => {
		test("renders a navigation landmark with the base class names and the given id, className and style", () => {
			const { container } = render(
				<Wizard id="wizard-id" className="custom-class" style={{ marginTop: "3px" }}>
					<Wizard.Step label="Step" selected />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			expect(wizard).toHaveAttribute("role", "navigation");
			expect(wizard).toHaveAttribute("tabindex", "-1");
			expect(wizard).toHaveAttribute("id", "wizard-id");
			expect(wizard).toHaveClass("wizard", "custom-class");
			expect(wizard).not.toHaveClass("wizard--truncate-text", "wizard--responsive");
			expect(wizard).toHaveStyle({ marginTop: "3px" });
		});

		test("reflects truncate and responsive as modifier classes and follows prop updates", () => {
			const { container, rerender } = render(
				<Wizard truncate>
					<Wizard.Step label="Step" selected />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			expect(wizard).toHaveClass("wizard--truncate-text");
			expect(wizard).not.toHaveClass("wizard--responsive");

			rerender(
				<Wizard responsive className="updated" id="updated-id">
					<Wizard.Step label="Step" selected />
				</Wizard>
			);
			// Switching `responsive` swaps the surrounding resize detector in, which re-creates the wizard element.
			const updated = getByDataRole(container, DataRoles.Wizard);
			expect(updated).toHaveClass("wizard--responsive", "updated");
			expect(updated).not.toHaveClass("wizard--truncate-text");
			expect(updated).toHaveAttribute("id", "updated-id");
		});

		test("removes its DOM on unmount", () => {
			const { container, unmount } = render(
				<Wizard responsive>
					<Wizard.PreviousStepButton />
					<Wizard.Step label="Step" selected />
					<Wizard.NextStepButton />
				</Wizard>
			);
			expect(getAllByDataRole(container, DataRoles.Wizard)).toHaveLength(1);

			unmount();
			expect(container.querySelector(`[data-role="${DataRoles.Wizard}"]`)).toBeNull();
		});
	});

	describe("children", () => {
		test("derives step ids from the wizard id by child position and keeps explicit step ids", () => {
			const { container } = render(
				<Wizard id="wiz">
					<Wizard.PreviousStepButton />
					<Wizard.Step label="First" />
					<Wizard.Step label="Second" id="explicit-id" selected />
					<Wizard.Step label="Third" />
					<Wizard.NextStepButton />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const steps = getAllByDataRole(wizard, DataRoles.Wizard.Step);

			expect(steps).toHaveLength(3);
			// The position counts every child, so the first step after the previous button is index 1.
			expect(steps[0]).toHaveAttribute("id", "wiz-step-1");
			expect(steps[1]).toHaveAttribute("id", "explicit-id");
			expect(steps[2]).toHaveAttribute("id", "wiz-step-3");
		});

		test("renders steps without ids when the wizard has no id", () => {
			const { container } = render(
				<Wizard>
					<Wizard.Step label="First" selected />
					<Wizard.Step label="Second" />
				</Wizard>
			);
			getAllByDataRole(getByDataRole(container, DataRoles.Wizard), DataRoles.Wizard.Step).forEach((step) => {
				expect(step).not.toHaveAttribute("id");
			});
		});

		test("keeps step labels on one line while preserving the step's own style", () => {
			const { container } = render(
				<Wizard>
					<Wizard.Step label="Styled" style={{ color: "rgb(1, 2, 3)" }} selected />
				</Wizard>
			);
			const content = getByDataRole(container, DataRoles.Wizard.Content);

			expect(content).toHaveStyle({ whiteSpace: "nowrap", color: "rgb(1, 2, 3)" });
		});

		test("forwards wrapperRef of steps and navigation buttons to their DOM elements", () => {
			const stepRef = vi.fn();
			const previousRef = vi.fn();
			const nextRef = vi.fn();
			const { container } = render(
				<Wizard>
					<Wizard.PreviousStepButton wrapperRef={previousRef} />
					<Wizard.Step label="Step" wrapperRef={stepRef} selected />
					<Wizard.NextStepButton wrapperRef={nextRef} />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			expect(stepRef).toHaveBeenCalledWith(getByDataRole(container, DataRoles.Wizard.Step));
			expect(previousRef).toHaveBeenCalledWith(getNavigationButton(wizard, "previous"));
			expect(nextRef).toHaveBeenCalledWith(getNavigationButton(wizard, "next"));
		});

		test("skips falsy children", () => {
			const renderConditional = (withPrevious: boolean, withSecond: boolean): ReactElement => (
				<Wizard>
					{withPrevious && <Wizard.PreviousStepButton />}
					<Wizard.Step label="First" selected />
					{null}
					{withSecond && <Wizard.Step label="Second" />}
				</Wizard>
			);
			const { container, rerender } = render(renderConditional(false, true));
			const wizard = getByDataRole(container, DataRoles.Wizard);

			expect(visibleStepLabels(wizard)).toEqual(["First", "Second"]);
			expect(wizard.querySelector(`button[data-type="${DataRoles.Wizard}-previous"]`)).toBeNull();

			rerender(renderConditional(true, false));
			expect(visibleStepLabels(wizard)).toEqual(["First"]);
			expect(getNavigationButton(wizard, "previous")).toBeInTheDocument();
		});

		test("calls the step's onClick and uses the latest handler after a rerender", async () => {
			const first = vi.fn();
			const second = vi.fn();
			const { container, rerender } = render(
				<Wizard>
					<Wizard.Step label="Step" onClick={first} selected />
				</Wizard>
			);

			await userEvent.click(getByDataRole(container, DataRoles.Wizard.Content));
			expect(first).toHaveBeenCalledTimes(1);

			rerender(
				<Wizard>
					<Wizard.Step label="Step" onClick={second} selected />
				</Wizard>
			);
			await userEvent.click(getByDataRole(container, DataRoles.Wizard.Content));
			expect(first).toHaveBeenCalledTimes(1);
			expect(second).toHaveBeenCalledTimes(1);
		});

		test("does not fire onClick of disabled or non-interactive steps", () => {
			const disabledClick = vi.fn();
			const nonInteractiveClick = vi.fn();
			const { container } = render(
				<Wizard>
					<Wizard.Step label="Disabled" disabled onClick={disabledClick} />
					<Wizard.Step label="Static" nonInteractive onClick={nonInteractiveClick} selected />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const disabledStep = getStepContent(wizard, "Disabled");
			const nonInteractiveStep = getStepContent(wizard, "Static");

			expect(disabledStep).toBeDisabled();
			expect(nonInteractiveStep).toBeDisabled();

			fireEvent.click(disabledStep);
			fireEvent.click(nonInteractiveStep);
			expect(disabledClick).not.toHaveBeenCalled();
			expect(nonInteractiveClick).not.toHaveBeenCalled();
		});

		test("does not fire onClick of disabled navigation buttons", () => {
			const onPrevious = vi.fn();
			const onNext = vi.fn();
			const { container } = render(
				<Wizard>
					<Wizard.PreviousStepButton disabled onClick={onPrevious} />
					<Wizard.Step label="Step" selected />
					<Wizard.NextStepButton disabled onClick={onNext} />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			expect(getNavigationButton(wizard, "previous")).toBeDisabled();
			expect(getNavigationButton(wizard, "next")).toBeDisabled();

			fireEvent.click(getNavigationButton(wizard, "previous"));
			fireEvent.click(getNavigationButton(wizard, "next"));
			expect(onPrevious).not.toHaveBeenCalled();
			expect(onNext).not.toHaveBeenCalled();
		});
	});

	describe("ARIA attributes", () => {
		test("labels the navigation buttons with the localized titles", () => {
			const { container, rerender } = render(
				<A11YLanguageContext.Provider value={getA11yResource("en")}>
					<Wizard>
						<Wizard.PreviousStepButton />
						<Wizard.Step label="Step" selected />
						<Wizard.NextStepButton />
					</Wizard>
				</A11YLanguageContext.Provider>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			expect(getNavigationButton(wizard, "previous")).toHaveAttribute("aria-label", "Previous");
			expect(getNavigationButton(wizard, "previous")).toHaveAttribute("title", "Previous");
			expect(getNavigationButton(wizard, "next")).toHaveAttribute("aria-label", "Next");
			expect(getNavigationButton(wizard, "next")).toHaveAttribute("title", "Next");

			rerender(
				<A11YLanguageContext.Provider value={getA11yResource("de")}>
					<Wizard>
						<Wizard.PreviousStepButton />
						<Wizard.Step label="Step" selected />
						<Wizard.NextStepButton />
					</Wizard>
				</A11YLanguageContext.Provider>
			);
			expect(getNavigationButton(wizard, "previous")).toHaveAttribute("aria-label", "Zurück");
			expect(getNavigationButton(wizard, "next")).toHaveAttribute("aria-label", "Weiter");
		});

		test("marks only the selected step as the current step and follows selection changes", () => {
			const { container, rerender } = render(
				<Wizard>
					<Wizard.Step label="First" selected />
					<Wizard.Step label="Second" />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const [first, second] = getAllByDataRole(wizard, DataRoles.Wizard.Step);

			expect(getByDataRole(first, DataRoles.Wizard.Content)).toHaveAttribute("aria-current", "step");
			expect(first).toHaveAttribute("data-selected", "true");
			expect(getByDataRole(second, DataRoles.Wizard.Content)).not.toHaveAttribute("aria-current");
			expect(second).not.toHaveAttribute("data-selected");

			rerender(
				<Wizard>
					<Wizard.Step label="First" />
					<Wizard.Step label="Second" selected />
				</Wizard>
			);
			expect(getByDataRole(first, DataRoles.Wizard.Content)).not.toHaveAttribute("aria-current");
			expect(getByDataRole(second, DataRoles.Wizard.Content)).toHaveAttribute("aria-current", "step");
			expect(second).toHaveAttribute("data-selected", "true");
		});

		test("exposes steps as links named by their title with hidden state texts", () => {
			const { container } = render(
				<Wizard>
					<Wizard.Step label="Done" title="Done title" finished />
					<Wizard.Step label="Warn" warning />
					<Wizard.Step label="Fail" error selected />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const [done, warn, fail] = getAllByDataRole(wizard, DataRoles.Wizard.Content);

			expect(done).toHaveAttribute("role", "link");
			expect(done).toHaveAttribute("aria-label", "Done title");
			expect(done).toHaveAttribute("title", "Done title");
			expect(done).toMatchTextContent("Completed: Done");
			expect(warn).toMatchTextContent("Warning: Warn");
			expect(fail).toMatchTextContent("Error: Fail");
			expect(warn).not.toHaveAttribute("aria-label");
		});

		test("hides left-out steps from assistive technology but announces them", () => {
			const { container } = render(<Wizard.Step icon={<Icon>more_horiz</Icon>} leftOut />);
			const content = getByDataRole(container, DataRoles.Wizard.Content);

			expect(content).toHaveAttribute("aria-hidden", "true");
			expect(content).toBeDisabled();
			expect(getByDataRole(container, DataRoles.Wizard.Step)).toMatchTextContent("Further steps...");
		});
	});

	describe("keyboard interaction", () => {
		test("moves the focus through the enabled buttons in order", async () => {
			const { container } = render(
				<Wizard>
					<Wizard.PreviousStepButton disabled />
					<Wizard.Step label="First" selected />
					<Wizard.Step label="Second" />
					<Wizard.NextStepButton />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			await userEvent.tab();
			expect(getStepContent(wizard, "First")).toHaveFocus();
			await userEvent.tab();
			expect(getStepContent(wizard, "Second")).toHaveFocus();
			await userEvent.tab();
			expect(getNavigationButton(wizard, "next")).toHaveFocus();
		});

		test("activates steps and navigation buttons with Enter and Space", async () => {
			const onStep = vi.fn();
			const onNext = vi.fn();
			const { container } = render(
				<Wizard>
					<Wizard.Step label="First" onClick={onStep} selected />
					<Wizard.NextStepButton onClick={onNext} />
				</Wizard>
			);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			getStepContent(wizard, "First").focus();
			await userEvent.keyboard("{Enter}");
			expect(onStep).toHaveBeenCalledTimes(1);
			await userEvent.keyboard(" ");
			expect(onStep).toHaveBeenCalledTimes(2);

			getNavigationButton(wizard, "next").focus();
			await userEvent.keyboard("{Enter}");
			expect(onNext).toHaveBeenCalledTimes(1);
			await userEvent.keyboard(" ");
			expect(onNext).toHaveBeenCalledTimes(2);
		});
	});

	describe("focus management", () => {
		test("keeps the focus on the next button while it stays enabled", async () => {
			const onStepChange = vi.fn();
			const { container } = render(<ControlledWizard stepCount={3} onStepChange={onStepChange} />);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const next = getNavigationButton(wizard, "next");

			await userEvent.click(next);
			expect(onStepChange).toHaveBeenLastCalledWith(1);
			expect(next).toBeEnabled();
			expect(next).toHaveFocus();
			expect(next.nextElementSibling).toBeNull();
		});

		test("parks the focus behind the next button when it becomes disabled and cleans up on blur", async () => {
			const { container } = render(<ControlledWizard stepCount={3} initialStep={1} />);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const next = getNavigationButton(wizard, "next");

			await userEvent.click(next);
			expect(next).toBeDisabled();
			expect(getStepContent(wizard, "Intl. Cover")).toHaveAttribute("aria-current", "step");

			const placeholder = next.nextElementSibling as HTMLElement | null;
			expect(placeholder).not.toBeNull();
			expect(placeholder).toHaveAttribute("tabindex", "0");
			expect(placeholder).toHaveFocus();

			placeholder?.blur();
			expect(next.nextElementSibling).toBeNull();
			expect(wizard.lastElementChild).toBe(next);
		});

		test("parks the focus in front of the previous button when it becomes disabled", async () => {
			const { container } = render(<ControlledWizard stepCount={3} initialStep={1} />);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const previous = getNavigationButton(wizard, "previous");

			await userEvent.click(previous);
			expect(previous).toBeDisabled();
			expect(getStepContent(wizard, "Preconditions")).toHaveAttribute("aria-current", "step");

			const placeholder = previous.previousElementSibling as HTMLElement | null;
			expect(placeholder).not.toBeNull();
			expect(placeholder).toHaveAttribute("tabindex", "0");
			expect(placeholder).toHaveFocus();

			placeholder?.blur();
			expect(previous.previousElementSibling).toBeNull();
			expect(wizard.firstElementChild).toBe(previous);
		});

		test("parks the focus after activating the next button with the keyboard", async () => {
			const { container } = render(<ControlledWizard stepCount={2} />);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const next = getNavigationButton(wizard, "next");

			next.focus();
			await userEvent.keyboard("{Enter}");
			expect(next).toBeDisabled();
			expect(next.nextElementSibling).toHaveFocus();
		});

		test("focuses the selected step on later updates once a step was clicked", async () => {
			const { container, rerender } = render(<ControlledWizard stepCount={3} className="a" />);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			await userEvent.click(getStepContent(wizard, "Master Conditions"));
			expect(getStepContent(wizard, "Master Conditions")).toHaveAttribute("aria-current", "step");
			expect(getStepContent(wizard, "Master Conditions")).toHaveFocus();

			getNavigationButton(wizard, "next").focus();
			expect(getNavigationButton(wizard, "next")).toHaveFocus();

			rerender(<ControlledWizard stepCount={3} className="b" />);
			expect(getStepContent(wizard, "Master Conditions")).toHaveFocus();
		});

		test("focuses the selected step on later updates once a step was activated with Enter", async () => {
			const { container, rerender } = render(<ControlledWizard stepCount={3} className="a" />);
			const wizard = getByDataRole(container, DataRoles.Wizard);

			getStepContent(wizard, "Intl. Cover").focus();
			await userEvent.keyboard("{Enter}");
			expect(getStepContent(wizard, "Intl. Cover")).toHaveAttribute("aria-current", "step");

			getNavigationButton(wizard, "previous").focus();
			rerender(<ControlledWizard stepCount={3} className="b" />);
			expect(getStepContent(wizard, "Intl. Cover")).toHaveFocus();
		});

		test("does not move the focus to the selected step after a navigation button was used", async () => {
			const { container, rerender } = render(<ControlledWizard stepCount={3} className="a" />);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const next = getNavigationButton(wizard, "next");

			await userEvent.click(next);
			expect(getStepContent(wizard, "Master Conditions")).toHaveAttribute("aria-current", "step");
			expect(next).toHaveFocus();

			rerender(<ControlledWizard stepCount={3} className="b" />);
			expect(next).toHaveFocus();
			expect(getStepContent(wizard, "Master Conditions")).not.toHaveFocus();
		});

		test("does not move the focus on updates before any interaction", () => {
			const { container, rerender } = render(<ControlledWizard stepCount={3} initialStep={1} className="a" />);
			const wizard = getByDataRole(container, DataRoles.Wizard);
			expect(document.body).toHaveFocus();

			rerender(<ControlledWizard stepCount={3} initialStep={1} className="b" />);
			expect(document.body).toHaveFocus();
			expect(getStepContent(wizard, "Master Conditions")).not.toHaveFocus();
		});
	});

	describe("responsive", () => {
		function renderResponsive(
			width: number,
			selected: number,
			responsiveBehaviour?: WizardProps.ResponsiveBehaviour,
			responsive = true
		): ReactElement {
			return (
				<div style={{ width: `${width}px` }}>
					<Wizard responsive={responsive} responsiveBehaviour={responsiveBehaviour}>
						<Wizard.PreviousStepButton disabled={selected === 0} />
						{stepLabels.map((label, index) => (
							<Wizard.Step key={label} label={label} selected={index === selected} />
						))}
						<Wizard.NextStepButton disabled={selected === stepLabels.length - 1} />
					</Wizard>
				</div>
			);
		}

		async function waitForCondensing(wizard: HTMLElement): Promise<void> {
			await waitFor(() => expect(visibleStepLabels(wizard)).toContain(LEFT_OUT));
		}

		test("does not condense steps when responsive is off", async () => {
			const { container } = render(renderResponsive(640, 3, undefined, false));
			const wizard = getByDataRole(container, DataRoles.Wizard);

			expect(visibleStepLabels(wizard)).toEqual(stepLabels);
			// Give a pending resize notification the chance to arrive.
			await new Promise((resolve) => setTimeout(resolve, 100));
			expect(visibleStepLabels(wizard)).toEqual(stepLabels);
		});

		test.each<[string, WizardProps.ResponsiveBehaviour | undefined, string[]]>([
			[
				"previous steps first, focus on the current step",
				undefined,
				[LEFT_OUT, "Intl. Cover", "Partner", "Quote", "Policy"]
			],
			[
				"next steps first, focus on the current step",
				{ nextStepFirst: true },
				[LEFT_OUT, "Intl. Cover", "Partner", LEFT_OUT]
			],
			[
				"previous steps first, focus on the boundaries",
				{ focusOnBoundary: true },
				["Preconditions", LEFT_OUT, "Partner", "Quote", "Policy"]
			],
			[
				"next steps first, focus on the boundaries",
				{ nextStepFirst: true, focusOnBoundary: true },
				["Preconditions", LEFT_OUT, "Partner", LEFT_OUT, "Policy"]
			]
		])("condenses overflowing steps: %s", async (_name, responsiveBehaviour, expected) => {
			const { container } = render(renderResponsive(640, 3, responsiveBehaviour));
			const wizard = getByDataRole(container, DataRoles.Wizard);

			await waitForCondensing(wizard);
			expect(visibleStepLabels(wizard)).toEqual(expected);
			expect(getStepContent(wizard, "Partner")).toHaveAttribute("aria-current", "step");
		});

		test("renders condensed steps as disabled left-out steps with an announcement", async () => {
			const { container } = render(renderResponsive(640, 3));
			const wizard = getByDataRole(container, DataRoles.Wizard);
			await waitForCondensing(wizard);

			const leftOut = getAllByDataRole(wizard, DataRoles.Wizard.Step)[0];
			expect(getByDataRole(leftOut, DataRoles.Wizard.Content)).toBeDisabled();
			expect(getByDataRole(leftOut, DataRoles.Wizard.Content)).toHaveAttribute("aria-hidden", "true");
			expect(leftOut).toMatchTextContent("Further steps...");
			expect(getNavigationButton(wizard, "previous")).toBe(wizard.firstElementChild);
			expect(getNavigationButton(wizard, "next")).toBe(wizard.lastElementChild);
		});

		test("re-measures when the selected step changes", async () => {
			const { container, rerender } = render(renderResponsive(640, 3));
			const wizard = getByDataRole(container, DataRoles.Wizard);
			await waitForCondensing(wizard);
			expect(visibleStepLabels(wizard)).toEqual([LEFT_OUT, "Intl. Cover", "Partner", "Quote", "Policy"]);

			rerender(renderResponsive(640, 0));
			await waitFor(() => expect(visibleStepLabels(wizard)[0]).toBe("Preconditions"));
			expect(visibleStepLabels(wizard)).toEqual(["Preconditions", "Master Conditions", "Intl. Cover", LEFT_OUT]);
			expect(getStepContent(wizard, "Preconditions")).toHaveAttribute("aria-current", "step");

			rerender(renderResponsive(640, 5));
			await waitFor(() =>
				expect(visibleStepLabels(wizard)).toEqual([LEFT_OUT, "Intl. Cover", "Partner", "Quote", "Policy"])
			);
			expect(getStepContent(wizard, "Policy")).toHaveAttribute("aria-current", "step");
		});

		test("restores all steps when the container grows and condenses again when it shrinks", async () => {
			const { container } = render(renderResponsive(640, 3));
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const wrapper = container.firstElementChild as HTMLElement;
			await waitForCondensing(wizard);

			wrapper.style.width = "1200px";
			await waitFor(() => expect(visibleStepLabels(wizard)).toEqual(stepLabels));
			// ResizeObserver only measures during a rendering frame: without one at 1200px, the shrink below
			// returns to the last reported 640px and is never observed.
			await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

			wrapper.style.width = "640px";
			await waitForCondensing(wizard);
			expect(visibleStepLabels(wizard)).toEqual([LEFT_OUT, "Intl. Cover", "Partner", "Quote", "Policy"]);
		});

		test("keeps the responsive behaviour chosen at mount when the prop changes later", async () => {
			const { container, rerender } = render(renderResponsive(640, 3));
			const wizard = getByDataRole(container, DataRoles.Wizard);
			await waitForCondensing(wizard);

			rerender(renderResponsive(640, 3, { nextStepFirst: true, focusOnBoundary: true }));
			await waitForCondensing(wizard);
			expect(visibleStepLabels(wizard)).toEqual([LEFT_OUT, "Intl. Cover", "Partner", "Quote", "Policy"]);
		});

		test("stops observing the container after unmount", async () => {
			const { container, unmount } = render(renderResponsive(640, 3));
			const wizard = getByDataRole(container, DataRoles.Wizard);
			const wrapper = container.firstElementChild as HTMLElement;
			await waitForCondensing(wizard);

			const onError = vi.fn();
			window.addEventListener("error", onError);
			unmount();
			wrapper.style.width = "1200px";
			await new Promise((resolve) => setTimeout(resolve, 100));
			window.removeEventListener("error", onError);

			expect(onError).not.toHaveBeenCalled();
			expect(container.querySelector(`[data-role="${DataRoles.Wizard}"]`)).toBeNull();
		});
	});
});
