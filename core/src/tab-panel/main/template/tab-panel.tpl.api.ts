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

import type { ReactNode, SyntheticEvent } from "react";

import type { Container, DataRole, Identifiable, Ref, Styleable } from "../../../common/main/base-props.js";

export namespace TabPanelTemplateProps {
	export interface BaseProps extends Styleable, Identifiable {}

	export interface TabProps extends BaseProps, Container, Ref, DataRole {
		/**
		 * Icon of the tab.
		 */
		icon?: ReactNode;

		/**
		 * Value used to identify a tab.
		 * If {@link BaseProps.id} is undefined, the value will be set as id.
		 */
		value: string;

		/**
		 * Whether the tab is disabled.
		 */
		disabled?: boolean;

		/**
		 * Specifies whether the tab is selected.
		 */
		selected?: boolean;

		/**
		 * Specifies whether the tab is highlighted. It is used to draw attention to a specific tab.
		 */
		highlighted?: boolean;

		/**
		 * Title attribute.
		 */
		title?: string;

		/**
		 * Label for the tab.
		 *
		 * *Note:* Only shown on mobile's sub-tablist, next to the tab's icon.
		 */
		label?: ReactNode;

		/**
		 * @deprecated since 34.6.0, use {@link ariaLabelledby} instead
		 *
		 * Value of ariaDescribedby should be id of additional elements inside a Tab.
		 * For example: Badge
		 */
		ariaDescribedby?: string;

		/**
		 * Value of ariaLabelledby should be id of additional elements inside a Tab.
		 * For example: Badge
		 */
		ariaLabelledby?: string;

		/** @internal */
		ariaControls?: string;

		/** @internal */
		tabIndex?: number;

		/**
		 * When true, renders the item with a left-aligned icon + label row layout.
		 * Used in the mobile sub-tablist when the tab carries a visible label.
		 * @internal
		 */
		mobileSubListLayout?: boolean;

		/**
		 * The orientation of a tab.
		 * @default "vertical"
		 */
		orientation?: "vertical" | "horizontal";

		/**
		 * Handle event when a tab is selected by mouse.
		 */
		onClick?(event: SyntheticEvent<HTMLElement>): void;
	}

	export interface GroupTabProps extends BaseProps {
		/**
		 * Specifies the label of a group.
		 *
		 * *Note:* Only shown in mobile's sub-tablist popup menu.
		 */
		groupLabel: string;

		/**
		 * The tab items belonging to this group.
		 */
		tabs: TabProps[];

		/**
		 * Specifies the aria-label attribute for the group.
		 */
		ariaLabel?: string;
	}

	export interface PanelHeaderProps extends BaseProps {
		/**
		 * Suffixes will be placed at the end of header.
		 */
		suffixes?: ReactNode[];

		/**
		 * Heading will be placed at the start of header.
		 */
		heading?: ReactNode;

		/**
		 * Specifies the aria level of the heading.
		 * @default 2
		 */
		ariaLevel?: number;
	}
}
