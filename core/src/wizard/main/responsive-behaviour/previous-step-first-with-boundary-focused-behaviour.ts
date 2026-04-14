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

import type { WizardElements, WizardHelper, WizardState } from "../wizard.internal.js";
import { computeCondensedStepCount, StepHelper } from "../wizard.internal.js";

import { CondensedPathResult, DefaultBehaviour } from "./default-behaviour.js";

/**
 * Previous steps will be hidden first, focus on start, end and current step.
 */
export class PreviousStepFirstWithBoundaryFocusedBehaviour extends DefaultBehaviour {
	constructor() {
		super();

		this.condenseStartStep = this.condenseStartStep.bind(this);
		this.condenseEndStep = this.condenseEndStep.bind(this);

		this.condensingHandlers = [
			this.condenseLeftSide,
			this.condensedRightSide,
			this.condenseStartStep,
			this.condenseEndStep
		];
	}

	protected getCondensedLeftPath(wizardElements: WizardElements): StepHelper[] {
		const selectedStep = this.getSelectedStep(wizardElements);
		const selectedStepIndex = wizardElements.steps.indexOf(selectedStep);

		return wizardElements.steps
			.filter((_, index) => index < selectedStepIndex && index > 0)
			.map((step) => new StepHelper(step));
	}

	protected getCondensedRightPath(wizardElements: WizardElements): StepHelper[] {
		const selectedStep = this.getSelectedStep(wizardElements);
		const selectedStepIndex = wizardElements.steps.indexOf(selectedStep);

		return wizardElements.steps
			.filter((_, index) => index > selectedStepIndex && index < wizardElements.steps.length - 1)
			.map((step) => new StepHelper(step))
			.reverse();
	}

	protected condenseStartStep(
		wizardElements: WizardElements,
		newState: WizardState,
		wizardHelper: WizardHelper
	): CondensedPathResult {
		const steps = wizardElements.steps;
		const selectedStep = this.getSelectedStep(wizardElements);

		if (!selectedStep) {
			return new CondensedPathResult(false, []);
		}

		const selectedStepIndex = steps.indexOf(selectedStep);
		const path = selectedStepIndex !== 0 ? [new StepHelper(steps[0])] : [];
		wizardHelper.removeLeftCondensedStep();
		wizardHelper.addLeftCondensedStep();
		const { position, allStepsAlreadyFitted } = this.findCondensedPosition(wizardElements, path);

		if (newState.condensedLeft) {
			newState.condensedLeft.begin = position > -1 ? position : newState.condensedLeft.begin;
		} else {
			newState.condensedLeft = position > -1 ? { begin: position, end: position } : undefined;
		}

		const noLeftOutStep = computeCondensedStepCount(newState.condensedLeft) <= 0;

		if (noLeftOutStep) {
			wizardHelper.removeLeftCondensedStep();
		}

		return new CondensedPathResult(allStepsAlreadyFitted, path);
	}

	protected condenseEndStep(
		wizardElements: WizardElements,
		newState: WizardState,
		wizardHelper: WizardHelper
	): CondensedPathResult {
		const steps = wizardElements.steps;
		const selectedStep = this.getSelectedStep(wizardElements);

		if (!selectedStep) {
			return new CondensedPathResult(false, []);
		}

		const selectedStepIndex = steps.indexOf(selectedStep);
		const path = selectedStepIndex < steps.length - 1 ? [new StepHelper(steps[steps.length - 1])] : [];
		wizardHelper.removeRightCondensedStep();
		wizardHelper.addRightCondensedStep();
		const { position, allStepsAlreadyFitted } = this.findCondensedPosition(wizardElements, path);

		if (newState.condensedRight) {
			newState.condensedRight.end = position > -1 ? position : newState.condensedRight.end;
		} else {
			newState.condensedRight = position > -1 ? { begin: position, end: position } : undefined;
		}

		const noLeftOutStep = computeCondensedStepCount(newState.condensedRight) <= 0;

		if (noLeftOutStep) {
			wizardHelper.removeRightCondensedStep();
		}

		return new CondensedPathResult(allStepsAlreadyFitted, path);
	}
}
