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

import { DataRoles } from "../../../common/main/data-roles.js";

import type { ResponsiveBehaviour, Step, WizardElements, WizardState } from "../wizard.internal.js";
import { computeCondensedStepCount, StepHelper, WizardHelper } from "../wizard.internal.js";

export class CondensedPathResult {
	constructor(
		public allStepsAlreadyFitted: boolean,
		public path: StepHelper[]
	) {}

	public hide(): void {
		this.path.forEach((helper) => helper.hide());
	}

	public restore(): void {
		this.path.forEach((helper) => helper.restore());
	}
}

export type CondensingHandler = (
	wizardElements: WizardElements,
	newState: WizardState,
	wizardHelper: WizardHelper
) => CondensedPathResult;

/**
 * Previous steps will be hidden and focus on current step.
 */
export class DefaultBehaviour implements ResponsiveBehaviour {
	private arrowWidth = 0;
	private leftOutWidth = 0;
	protected condensingHandlers: CondensingHandler[] = [];
	private wrapperRef: HTMLElement | undefined = undefined;

	constructor() {
		this.condenseLeftSide = this.condenseLeftSide.bind(this);
		this.condensedRightSide = this.condensedRightSide.bind(this);
		this.getSelectedStep = this.getSelectedStep.bind(this);

		this.condensingHandlers = [this.condenseLeftSide, this.condensedRightSide];
	}

	setArrowWidth(width: number): void {
		this.arrowWidth = width;
	}

	setLeftOutWidth(width: number): void {
		this.leftOutWidth = width;
	}

	private isStep(element: Element): boolean {
		return element.getAttribute("data-role") === `${DataRoles.Wizard.Step}`;
	}

	private isFirstStep(element: Element): boolean {
		return !(element.previousElementSibling && this.isStep(element.previousElementSibling));
	}

	private computeElementWidth(element: HTMLElement): number {
		if (this.isStep(element)) {
			const elementWidth = element.getBoundingClientRect().width;
			const child = element.children.item(1);
			const buttonWidth = child ? child.getBoundingClientRect().width : 0;

			if (this.isFirstStep(element)) {
				return Math.round(elementWidth) === Math.round(buttonWidth) ? elementWidth - this.arrowWidth : buttonWidth;
			}

			return Math.max(buttonWidth, elementWidth - this.arrowWidth);
		}

		return element.getBoundingClientRect().width;
	}

	private isStepOutsourced(step: Step): boolean {
		const stepWidth = Math.round(step.ref.getBoundingClientRect().width);
		const child = step.ref.children.item(1);
		const buttonWidth = child ? Math.round(child.getBoundingClientRect().width) : 0;

		return this.isFirstStep(step.ref) ? stepWidth < buttonWidth : stepWidth - this.arrowWidth < buttonWidth;
	}

	private computeStepsWidth(wizardElements: WizardElements): number {
		let sum = 0;
		const steps = wizardElements.steps;

		for (const step of steps) {
			sum += this.computeElementWidth(step.ref);
		}

		return sum;
	}

	private computeButtonsWidth(wizardElements: WizardElements): number {
		const buttons = wizardElements.buttons;
		let sum = 0;

		for (const button of buttons) {
			sum += this.computeElementWidth(button);
		}

		return sum;
	}

	private getChildElements(parent: HTMLElement): WizardElements {
		const buttons = [
			parent.querySelector(`button[data-type="${DataRoles.Wizard.Next}"]`),
			parent.querySelector(`button[data-type="${DataRoles.Wizard.Previous}"]`)
		]
			.filter(Boolean)
			.map((button) => button as HTMLElement);

		const steps = Array.from(parent.querySelectorAll(`[data-role="${DataRoles.Wizard.Step}"]`)).map((ref) => ({
			ref: ref as HTMLElement
		}));

		return { buttons: buttons, steps: steps };
	}

	protected getSelectedStep(wizardElements: WizardElements): Step {
		const selectedStep = wizardElements.steps.find((step) => step.ref.getAttribute("data-selected") === "true");

		return selectedStep || wizardElements.steps[0];
	}

	update(wrapperRef: HTMLElement): WizardState | undefined {
		this.wrapperRef = wrapperRef;
		const wizardElements = this.getChildElements(wrapperRef);

		if (this.childrenOverflow() && this.leftOutWidth > 0) {
			return this.condenseSteps(wrapperRef, wizardElements, this.leftOutWidth);
		}

		return undefined;
	}

	protected condenseSteps(wrapperRef: HTMLElement, wizardElements: WizardElements, leftOutStepWidth: number) {
		const selectedStep = this.getSelectedStep(wizardElements);

		const newState: WizardState = { condensedLeft: undefined, condensedRight: undefined };
		const wizardHelper = new WizardHelper(wrapperRef, leftOutStepWidth, this.arrowWidth);

		const condensedPathResults: CondensedPathResult[] = [];

		for (const handler of this.condensingHandlers) {
			const result = handler(wizardElements, newState, wizardHelper);
			condensedPathResults.push(result);

			if (result.allStepsAlreadyFitted) {
				break;
			}
		}

		if (this.shouldHideAllStepExceptSelectedStep(newState, selectedStep, wizardElements.steps.length)) {
			if (newState.condensedLeft) {
				newState.condensedLeft.hide = true;
			}

			if (newState.condensedRight) {
				newState.condensedRight.hide = true;
			}
		}

		condensedPathResults.forEach((result) => result.restore());
		wizardHelper.restore();

		return newState;
	}

	protected condenseLeftSide(
		wizardElements: WizardElements,
		newState: WizardState,
		wizardHelper: WizardHelper
	): CondensedPathResult {
		const leftPath = this.getCondensedLeftPath(wizardElements);
		wizardHelper.removeLeftCondensedStep();
		wizardHelper.addLeftCondensedStep();
		const { position, allStepsAlreadyFitted } = this.findCondensedPosition(wizardElements, leftPath);

		newState.condensedLeft =
			position > -1 ? { begin: wizardElements.steps.indexOf(leftPath[0].step), end: position } : undefined;

		const noLeftOutStep = computeCondensedStepCount(newState.condensedLeft) <= 0;

		if (noLeftOutStep) {
			wizardHelper.removeLeftCondensedStep();
		}

		return new CondensedPathResult(allStepsAlreadyFitted, leftPath);
	}

	protected condensedRightSide(
		wizardElements: WizardElements,
		newState: WizardState,
		wizardHelper: WizardHelper
	): CondensedPathResult {
		const rightPath = this.getCondensedRightPath(wizardElements);
		wizardHelper.removeRightCondensedStep();
		wizardHelper.addRightCondensedStep();
		const { position, allStepsAlreadyFitted } = this.findCondensedPosition(wizardElements, rightPath);

		newState.condensedRight =
			position > -1 ? { begin: position, end: wizardElements.steps.indexOf(rightPath[0].step) } : undefined;

		const noLeftOutStep = computeCondensedStepCount(newState.condensedRight) <= 0;

		if (noLeftOutStep) {
			wizardHelper.removeRightCondensedStep();
		}

		return new CondensedPathResult(allStepsAlreadyFitted, rightPath);
	}

	protected findCondensedPosition(
		wizardElements: WizardElements,
		path: StepHelper[]
	): { position: number; allStepsAlreadyFitted: boolean } {
		const steps = wizardElements.steps;

		if (path.length > 0) {
			const indexOfCondensedStep = this.findCondensedIndexInPath(wizardElements, path);
			const position = steps.indexOf(path[Math.min(indexOfCondensedStep, path.length - 1)].step);

			return { position, allStepsAlreadyFitted: indexOfCondensedStep < path.length };
		}

		return { position: -1, allStepsAlreadyFitted: false };
	}

	private findCondensedIndexInPath(wizardElements: WizardElements, path: StepHelper[]): number {
		const steps = wizardElements.steps;
		let indexOfCondensedStep: number;

		if (path.length > 0) {
			for (indexOfCondensedStep = 0; indexOfCondensedStep < path.length; indexOfCondensedStep++) {
				path[indexOfCondensedStep].hide();

				if (this.isAllVisibleStepsFitted(steps)) {
					break;
				}
			}

			return indexOfCondensedStep;
		}

		return -1;
	}

	protected getCondensedLeftPath(wizardElements: WizardElements): StepHelper[] {
		const selectedStep = this.getSelectedStep(wizardElements);
		const selectedStepIndex = wizardElements.steps.indexOf(selectedStep);

		return wizardElements.steps.filter((_, index) => index < selectedStepIndex).map((step) => new StepHelper(step));
	}

	protected getCondensedRightPath(wizardElements: WizardElements): StepHelper[] {
		const selectedStep = this.getSelectedStep(wizardElements);
		const selectedStepIndex = wizardElements.steps.indexOf(selectedStep);

		return wizardElements.steps
			.filter((_, index) => index > selectedStepIndex)
			.map((step) => new StepHelper(step))
			.reverse();
	}

	private childrenOverflow(): boolean {
		if (this.wrapperRef) {
			const wrapperWidth = this.wrapperRef.getBoundingClientRect().width;
			const wizardElements = this.getChildElements(this.wrapperRef);
			const childrenWidth = this.computeButtonsWidth(wizardElements) + this.computeStepsWidth(wizardElements);

			return Math.round(wrapperWidth) < Math.round(childrenWidth);
		}

		return false;
	}

	private isAllVisibleStepsFitted(steps: Step[]): boolean {
		return !this.childrenOverflow() && steps.every((step) => step.hide || !this.isStepOutsourced(step));
	}

	private shouldHideAllStepExceptSelectedStep(newState: WizardState, selectedStep: Step, stepCount: number): boolean {
		const condensedLeftCount = computeCondensedStepCount(newState.condensedLeft);
		const condensedRightCount = computeCondensedStepCount(newState.condensedRight);

		return this.isStepOutsourced(selectedStep) && stepCount - condensedLeftCount - condensedRightCount === 1;
	}
}
