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

/**
 * - This is a wizard widget.
 * - Including: the wizard steps, the previous and next button.
 * - It will be used to navigate through multiple screens.
 * @module
 */

import type { ReactNode, MouseEvent } from "react";

import type { Ref, Container, Identifiable, Styleable } from "../../common/main/base-props.js";

export interface WizardProps extends Styleable, Identifiable, Container {
	/**
	 * If true, the step labels can be truncated.
	 * In this case, the step's {@link WizardStepProps.title} props should be set to make them readable.
	 */
	truncate?: boolean;

	/**
	 * When the total width of children is larger than the Wizard's width
	 * the steps will be collapsed to left-out steps.
	 * @default  false
	 */
	responsive?: boolean;

	/**
	 * Config responsive behavior.
	 * @default Previous steps will be hidden and focus on current step.
	 */
	responsiveBehaviour?: WizardProps.ResponsiveBehaviour;
}

export interface WizardStepProps extends Styleable, Identifiable, Ref {
	/**
	 * Label is placed inside a step.
	 */
	label?: ReactNode;

	/**
	 * Specify the hint text that will be shown on mouse over.
	 */
	title?: string;

	/**
	 * Additional icon for a step.
	 */
	icon?: ReactNode;

	/**
	 * Set to true to create a non-interactive step.
	 */
	nonInteractive?: boolean;

	/**
	 * Specify whether the step is selected.
	 */
	selected?: boolean;

	/**
	 * Specify whether the step is disabled.
	 */
	disabled?: boolean;

	/**
	 * Specify whether a step is finished.
	 */
	finished?: boolean;

	/**
	 * Specify whether there is a warning with a step.
	 */
	warning?: boolean;

	/**
	 * Specify whether there is an error with a step.
	 */
	error?: boolean;

	/**
	 * Specify whether there is a left-out step.
	 */
	leftOut?: boolean;

	/**
	 * Click handler for the step.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;
}

export interface WizardNavigationButtonProps extends Identifiable, Styleable, Ref {
	/**
	 * Specify whether the button is disabled.
	 */
	disabled?: boolean;

	/**
	 * Additional icon for the button.
	 */
	icon?: ReactNode;

	/**
	 * Click handler for the button.
	 */
	onClick?(): void;
}

export namespace WizardProps {
	export interface ResponsiveBehaviour {
		/**
		 * If true, focus on start, end and current step. Otherwise, focus on current step.
		 */
		focusOnBoundary?: boolean;

		/**
		 * If true, the next steps will be hidden first.
		 */
		nextStepFirst?: boolean;
	}
}
