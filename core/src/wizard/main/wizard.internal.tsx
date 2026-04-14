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

import { addPrefix } from "../../common/main/utils.js";

export const wizardBaseClassName = addPrefix("wizard");

export interface CondensedRange {
	begin: number;
	end: number;
	hide?: boolean;
}

export interface WizardState {
	condensedLeft?: CondensedRange;
	condensedRight?: CondensedRange;
}

export interface Step {
	ref: HTMLElement;
	hide?: boolean;
}

export interface WizardElements {
	buttons: HTMLElement[];
	steps: Step[];
}

export class WizardHelper {
	private readonly originalStyleWidth: string | null;
	private leftCondensedStepShow = false;
	private rightCondensedStepShow = false;

	constructor(
		private wrapperRef: HTMLElement,
		private leftOutWidth: number,
		private arrowWidth: number
	) {
		this.originalStyleWidth = wrapperRef.style.width;
	}

	public addLeftCondensedStep(): void {
		if (!this.leftCondensedStepShow) {
			const leftOutWidth = this.leftOutWidth + this.arrowWidth * 2;
			this.wrapperRef.style.width = this.wrapperRef.getBoundingClientRect().width - leftOutWidth + "px";
			this.leftCondensedStepShow = true;
		}
	}

	public removeLeftCondensedStep(): void {
		if (this.leftCondensedStepShow) {
			const leftOutWidth = this.leftOutWidth + this.arrowWidth * 2;
			this.wrapperRef.style.width = this.wrapperRef.getBoundingClientRect().width + leftOutWidth + "px";
			this.leftCondensedStepShow = false;
		}
	}

	public addRightCondensedStep(): void {
		if (!this.rightCondensedStepShow) {
			const leftOutWidth = this.leftOutWidth + this.arrowWidth * 2;
			this.wrapperRef.style.width = this.wrapperRef.getBoundingClientRect().width - leftOutWidth + "px";
			this.rightCondensedStepShow = true;
		}
	}

	public removeRightCondensedStep(): void {
		if (this.rightCondensedStepShow) {
			const leftOutWidth = this.leftOutWidth + this.arrowWidth * 2;
			this.wrapperRef.style.width = this.wrapperRef.getBoundingClientRect().width + leftOutWidth + "px";
			this.rightCondensedStepShow = false;
		}
	}

	public restore(): void {
		this.leftCondensedStepShow = false;
		this.rightCondensedStepShow = false;
		this.wrapperRef.style.width = this.originalStyleWidth || "";
	}
}

export class StepHelper {
	private readonly originalStyleDisplay: string | null;

	constructor(public step: Step) {
		this.originalStyleDisplay = step.ref.style.display;
	}

	public hide(): void {
		this.step.ref.style.display = "none";
		this.step.hide = true;
	}

	public restore(): void {
		this.step.ref.style.display = this.originalStyleDisplay || "";
		this.step.hide = undefined;
	}
}

export interface ResponsiveBehaviour {
	setArrowWidth(width: number): void;
	setLeftOutWidth(width: number): void;
	update(wrapperRef: HTMLElement): WizardState | undefined;
}

export function computeCondensedStepCount(condensedRange?: CondensedRange): number {
	return condensedRange ? condensedRange.end - condensedRange.begin + 1 : 0;
}

computeCondensedStepCount.displayName = "computeCondensedStepCount";
