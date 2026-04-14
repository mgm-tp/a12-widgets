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
 * This Contentbox widget provides functionality to switch to an compact view.
 *  * Normal: display buttons in the action bar.
 *  * Compact: display buttons in a popup menu in the heading.
 * @module
 */

import type { Attributes, ReactNode, ReactElement } from "react";

import type { SizeDetectorProps } from "../../../layout/size-detector/main/size-detector.api.js";
import type { ContentBoxBaseProps } from "../../main/template/contentbox.tpl.api.js";

/**
 * The props of ActionContentbox.
 */
export interface ActionContentboxProps extends ContentBoxBaseProps, Attributes {
	/**
	 * The Breadcrumb widget passed via this property will be rendered as part of the subheading.
	 */
	breadcrumbs?: ReactNode;

	/**
	 * List of (action) buttons that will be rendered as part of the subheading.
	 */
	buttons?: ActionContentboxProps.Buttons;

	/**
	 * Elements that will be rendered as children of the heading.
	 */
	headingElements?: ReactNode;

	/**
	 * Elements to display as the heading prefixes.
	 */
	headingPrefixes?: ReactNode;

	/**
	 * Elements to display as the heading suffixes along with the close/back button.
	 */
	headingButtons?: ReactNode;

	/**
	 * 	Custom components to render.
	 */
	componentRenderers?: {
		/**
		 * Custom render heading.
		 * If it is used, the {@link headingElements}, {@link headingPrefixes} and {@link headingButtons} will be ignored.
		 */
		heading?: ReactNode;
	};

	/**
	 * The FlyoutMenu widget passed via this property will be rendered as part of the subheading.
	 */
	navigation?: ReactNode;

	/**
	 * The Sub Action Bar element that will be rendered as part of the subheading.
	 */
	subActionBar?: ReactNode;

	/**
	 * Enable this prop to tell Contentbox to listen to {@link NavigationContentboxContext}
	 * and if {@link NavigationContentboxContextType.onBackButtonClicked} is defined in the context, render a back button.
	 */
	listenToNavigationContext?: boolean;

	/**
	 * Listen to the size of browser window instead of the parent element.
	 * @default true
	 */
	listenToWindowSize?: boolean;

	/**
	 * The tabindex attribute of the Contentbox.
	 */
	tabIndex?: number;

	/**
	 * This callback will be triggered when the size has changed into a new breakpoint.
	 */
	onSizeChange?(breakPoint: SizeDetectorProps.BreakPoint): void;
}

export namespace ActionContentboxProps {
	export type ButtonAlignment = "left" | "right";

	/**
	 * Configuration of buttons to specify alignment of the buttons.
	 */
	export interface ButtonConfiguration {
		/**
		 * Specifies alignment of the button.
		 */
		align: ActionContentboxProps.ButtonAlignment;

		/**
		 * Button element
		 */
		button: ReactElement;
	}

	export type Buttons = ReactElement | ButtonConfiguration[];
}

export interface NavigationContentboxContextType {
	/**
	 * Event that will be fired when the back button is clicked.
	 */
	onBackButtonClicked?(): void;

	/**
	 * Event that will be fired when the close button is clicked.
	 */
	onCloseButtonClicked?(): void;
}
