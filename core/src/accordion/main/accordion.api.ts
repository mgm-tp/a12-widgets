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
 * This Accordion Widget creates sections that can be opened and closed.
 * If needed the sections can be manually controlled by using {@link onHeaderClick}
 */

import type { ReactNode, MouseEvent } from "react";

import type { Container, Identifiable, Styleable, Ref } from "../../common/main/base-props.js";

export namespace AccordionProps {
	export interface ContainerProps extends Styleable, Identifiable, Container, Ref<HTMLDivElement> {
		/**
		 * Custom role
		 * @default "navigation"
		 */
		role?: string;

		/**
		 * Default icon for expanding for the accordion.
		 * @default add
		 */
		expandIcon?: ReactNode;

		/**
		 * Default icon for collapsing for the accordion.
		 * @default remove
		 */
		collapseIcon?: ReactNode;

		/**
		 * Determines if the Accordion will be controlled manually by the user with the {@link SectionProps.expanded} property.
		 */
		controlled?: boolean;
	}

	export interface SectionProps extends Styleable, Identifiable, Container {
		/**
		 * The initial state of the section.
		 *
		 * If {@link ContainerProps.controlled} is set to true, this property determines the state of the section.
		 */
		expanded?: boolean;

		/**
		 * Whether the accordion is selected.
		 */
		selected?: boolean;

		/**
		 * Icon for expanding. Has priority over the icon set by the surrounding accordion.
		 */
		expandIcon?: ReactNode;

		/**
		 * Icon for collapsing. Has priority over the icon set by the surrounding accordion.
		 */
		collapseIcon?: ReactNode;

		/**
		 * Click handler for custom behaviour
		 *
		 * @param event – HTML mouse event.
		 */
		onClick?(event: MouseEvent<HTMLElement>): void;
	}

	export interface SummaryProps extends Styleable, Identifiable, Container {
		/**
		 * Additional icon will be shown on the left of the title.
		 *
		 * *Note:* If the {@link variant} is set, the icon from that property will take priority.
		 */
		graphic?: ReactNode;

		/**
		 * Variant of an accordion. There are 6 values: `open`, `info`, `error`, `warning`, `done`, and `inProgress`.
		 * If it is defined, a specific icon corresponding to that variant will be displayed.
		 */
		variant?: AccordionVariant;
	}

	export interface DetailsProps extends Styleable, Identifiable, Container {
		/**
		 * Specify the tabIndex attribute.
		 */
		tabIndex?: number;
	}
}

export interface AccordionContextType {
	onSummaryClick?(event: MouseEvent<HTMLElement>): void;
	expanded?: boolean;
	hasDetails?: boolean;
	expandIcon?: ReactNode;
	collapseIcon?: ReactNode;
	controlled?: boolean;
	selected?: boolean;
}

export type AccordionVariant = "open" | "info" | "error" | "warning" | "done" | "inProgress";
