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
import { render, queryHelpers, getByDataRole, queryByDataRole, waitFor, findByDataRole } from "test-utils";
import { describe, vi, test, expect, afterEach } from "vitest";
import { userEvent } from "vitest/browser";

import { Icon } from "../../icon/main/icon.view.js";
import { A11YLanguageContext, getA11yResource } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { InteractionHintConfigProvider } from "../../interaction-hint/main/interaction-hint-context.js";
import type { InteractionHintPosition } from "../../interaction-hint/main/interaction-hint.api.js";

import { Accordion } from "../main/accordion.view.js";
import type { AccordionProps, AccordionVariant } from "../main/accordion.api.js";

const { Container, Section, Summary, Details } = Accordion;

describe("com.mgmtp.a12.widgets.accordion", () => {
	const refSpy = vi.fn();
	afterEach(() => {
		refSpy.mockReset();
	});
	const AccordionExample = () => (
		<Container wrapperRef={refSpy}>
			<Section>
				<Summary>Summary</Summary>
				<Details>Detail</Details>
			</Section>
		</Container>
	);

	const baseContainerProps: AccordionProps.ContainerProps = {
		id: "container-id",
		className: "container-class",
		style: { background: "red" },
		role: "container-role"
	};

	const baseSectionProps: AccordionProps.SectionProps = {
		id: "section-id",
		className: "section-class",
		style: { background: "red" }
	};

	const baseSummaryProps: AccordionProps.SummaryProps = {
		id: "summary-id",
		className: "summary-class",
		style: { background: "red" },
		graphic: "Test Graphic"
	};

	const baseDetailsProps: AccordionProps.DetailsProps = {
		id: "summary-id",
		className: "summary-class",
		style: { background: "red" },
		tabIndex: 0
	};

	test("test structure and base properties", () => {
		const { container } = render(<AccordionExample />);
		expect(container.firstChild).toMatchSnapshot();
	});

	test("test passed in properties", () => {
		const { container } = render(
			<Container {...baseContainerProps}>
				<Section {...baseSectionProps}>
					<Summary {...baseSummaryProps}>Summary</Summary>
					<Details {...baseDetailsProps}>Detail</Details>
				</Section>
			</Container>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("test selected Section", () => {
		const { container } = render(
			<Section selected expanded>
				<Summary>Summary</Summary>
				<Details>Detail</Details>
			</Section>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("test custom icons for all sections", () => {
		const { container } = render(
			<Container expandIcon={<Icon>expand_more</Icon>} collapseIcon={<Icon>expand_less</Icon>}>
				<Section expanded={true}>
					<Summary>Section 1</Summary>
					<Details>Detail 1</Details>
				</Section>
				<Section>
					<Summary>Section 2</Summary>
					<Details>Detail 2</Details>
				</Section>
			</Container>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("test accordion with variants for all sections", () => {
		const { container } = render(
			<Container>
				<Section>
					<Summary variant="open">Open Section</Summary>
					<Details>Detail 1</Details>
				</Section>
				<Section>
					<Summary variant="info">Info Section</Summary>
					<Details>Detail 2</Details>
				</Section>
				<Section>
					<Summary variant="error">Error Section</Summary>
					<Details>Detail 4</Details>
				</Section>
				<Section>
					<Summary variant="warning">Warning Section</Summary>
					<Details>Detail 3</Details>
				</Section>
				<Section>
					<Summary variant="done">Done Section</Summary>
					<Details>Detail 5</Details>
				</Section>
			</Container>
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	test("simulate toggling a section", async () => {
		const { container } = render(<AccordionExample />);

		const summary = container.querySelector(`[data-role=${DataRoles.Accordion.Summary}]`);

		if (!summary) {
			throw queryHelpers.getElementError("No found summary", container);
		}

		await userEvent.click(summary);
		expect(container.querySelector(`[data-role=${DataRoles.Accordion.Details}]`)).not.toBeNull();
		expect(summary.getAttribute("aria-expanded")).toBe("true");

		await userEvent.keyboard("{Enter}");
		expect(container.querySelector(`[data-role=${DataRoles.Accordion.Details}]`)).toBeNull();
		expect(summary.getAttribute("aria-expanded")).toBe("false");
	});

	test("simulate click event of a section", async () => {
		const onSectionClickSpy = vi.fn();
		const { container } = render(
			<Container controlled>
				<Section onClick={onSectionClickSpy}>
					<Summary>Summary</Summary>
					<Details>Detail</Details>
				</Section>
			</Container>
		);

		const summary = container.querySelector(`[data-role=${DataRoles.Accordion.Summary}]`);

		if (!summary) {
			throw queryHelpers.getElementError("No found summary", container);
		}

		await userEvent.click(summary);
		expect(onSectionClickSpy).toHaveBeenCalledTimes(1);
	});

	test("simulate accordion ref", () => {
		render(<AccordionExample />);
		expect(refSpy).toHaveBeenCalledTimes(1);
	});

	describe("interaction hint", () => {
		const titleOpen = "Open";
		const titleClose = "Close";
		const variantOpenTitle = "Open";
		const variantInfoTitle = "Info";
		const variantErrorTitle = "Error";
		const variantWarningTitle = "Warning";
		const variantDoneTitle = "Done";
		const variantInProgressTitle = "In Progress";

		const AccordionExampleWithInteractionHint = ({
			variant,
			hintPosition
		}: {
			variant?: AccordionVariant;
			hintPosition?: InteractionHintPosition;
		}): ReactNode => (
			<A11YLanguageContext.Provider
				value={{
					...getA11yResource("en"),
					accordionTitles: {
						close: titleClose,
						open: titleOpen
					},
					accordionVariantTitles: {
						open: variantOpenTitle,
						info: variantInfoTitle,
						error: variantErrorTitle,
						warning: variantWarningTitle,
						inProgress: variantInProgressTitle,
						done: variantDoneTitle
					}
				}}
			>
				<InteractionHintConfigProvider
					enableInteractionHint
					componentConfigs={{ accordion: { position: hintPosition } }}
				>
					<Container wrapperRef={refSpy}>
						<Section>
							<Summary variant={variant}>Summary</Summary>
							<Details>Detail</Details>
						</Section>
					</Container>
				</InteractionHintConfigProvider>
			</A11YLanguageContext.Provider>
		);

		test("should display the hint on hover and hide hint on hover leave", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			const hiddenText = getByDataRole(container, DataRoles.HiddenText);
			expect(hiddenText.textContent).toEqual(`${titleOpen}`);

			await userEvent.hover(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(titleOpen);

			await userEvent.unhover(accordionSummaryButton);

			await waitFor(() => {
				expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
			});
		});

		test("should display the hint on focus and hide hint on pressing the Tab key", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			accordionSummaryButton.focus();

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(titleOpen);

			await userEvent.tab();
			expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
		});

		test("should change the hint content when pressing Enter key", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);
			accordionSummaryButton.focus();
			await userEvent.keyboard("{Enter}");

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(titleClose);

			await userEvent.keyboard("{Enter}");

			const updatedInteractionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(updatedInteractionHint).toBeTruthy();
			expect(updatedInteractionHint?.textContent).toEqual(titleOpen);
		});

		test("should hide the hint when pressing Escape key", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			await userEvent.click(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();

			await userEvent.keyboard("{Escape}");
			expect(queryByDataRole(container, DataRoles.InteractionHint)).toBeFalsy();
		});

		test("should have correct hidden text and hint's text on open variant", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint variant="open" />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			const hiddenText = getByDataRole(container, DataRoles.HiddenText);
			const fullTitle = `${variantOpenTitle} - ${titleOpen}`;
			expect(hiddenText.textContent).toEqual(` - ${fullTitle}`);

			await userEvent.hover(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(`${fullTitle}`);
		});

		test("should have correct hidden text and hint's text on info variant", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint variant="info" />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			const hiddenText = getByDataRole(container, DataRoles.HiddenText);
			const fullTitle = `${variantInfoTitle} - ${titleOpen}`;
			expect(hiddenText.textContent).toEqual(` - ${fullTitle}`);

			await userEvent.hover(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(`${fullTitle}`);
		});

		test("should have correct hidden text and hint's text on error variant", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint variant="error" />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			const hiddenText = getByDataRole(container, DataRoles.HiddenText);
			const fullTitle = `${variantErrorTitle} - ${titleOpen}`;
			expect(hiddenText.textContent).toEqual(` - ${fullTitle}`);

			await userEvent.hover(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(`${fullTitle}`);
		});

		test("should have correct hidden text and hint's text on warning variant", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint variant="warning" />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			const hiddenText = getByDataRole(container, DataRoles.HiddenText);
			const fullTitle = `${variantWarningTitle} - ${titleOpen}`;
			expect(hiddenText.textContent).toEqual(` - ${fullTitle}`);

			await userEvent.hover(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);
			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(`${fullTitle}`);
		});

		test("should have correct hidden text and hint's text on done variant", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint variant="done" />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			const hiddenText = getByDataRole(container, DataRoles.HiddenText);
			const fullTitle = `${variantDoneTitle} - ${titleOpen}`;
			expect(hiddenText.textContent).toEqual(` - ${fullTitle}`);

			await userEvent.hover(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);

			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(`${fullTitle}`);
		});

		test("should have correct hidden text and hint's text on inProgress variant", async () => {
			const { container } = render(<AccordionExampleWithInteractionHint variant="inProgress" />);

			const accordionSummaryButton = getByDataRole(container, DataRoles.Accordion.Summary);

			const hiddenText = getByDataRole(container, DataRoles.HiddenText);
			const fullTitle = `${variantInProgressTitle} - ${titleOpen}`;
			expect(hiddenText.textContent).toEqual(` - ${fullTitle}`);

			await userEvent.hover(accordionSummaryButton);

			const interactionHint = await findByDataRole(container, DataRoles.InteractionHint);

			expect(interactionHint).toBeTruthy();
			expect(interactionHint?.textContent).toEqual(`${fullTitle}`);
		});

		test("accordion summary should not show hint when componentConfigs.accordion=false", async () => {
			const { queryByDataRole } = render(
				<InteractionHintConfigProvider enableInteractionHint componentConfigs={{ accordion: false }}>
					<Container wrapperRef={refSpy}>
						<Section>
							<Summary variant="open">Summary</Summary>
							<Details>Detail</Details>
						</Section>
					</Container>
				</InteractionHintConfigProvider>
			);

			await userEvent.tab();

			const hintContent = queryByDataRole(DataRoles.InteractionHint.Content);
			expect(hintContent).not.toBeInTheDocument();
		});

		test("should position hint at left edge", async () => {
			const { findByDataRole } = render(<AccordionExampleWithInteractionHint hintPosition="left" />);

			await userEvent.tab();

			const interactionHint = await findByDataRole(DataRoles.InteractionHint);

			expect(interactionHint).toBeInTheDocument();

			const attachedPortal = await findByDataRole(DataRoles.AttachedPortal);
			expect(attachedPortal).toMatchSnapshot();
		});

		test("should position hint at right edge", async () => {
			const { getByDataRole } = render(<AccordionExampleWithInteractionHint hintPosition="right" />);

			await userEvent.tab();

			const interactionHint = getByDataRole(DataRoles.AttachedPortal);
			expect(interactionHint).toBeInTheDocument();

			const attachedPortal = getByDataRole(DataRoles.AttachedPortal);

			const accordionSummary = getByDataRole(DataRoles.Accordion.Summary);
			const accordionSummaryRect = accordionSummary.getBoundingClientRect();
			const portalLeft = parseInt(attachedPortal.style.left, 10);

			expect(portalLeft).toBeGreaterThanOrEqual(accordionSummaryRect.right - accordionSummaryRect.width);
		});
	});
});
