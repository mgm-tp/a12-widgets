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
 * This Application Frame Widget uses the A12 plasma-design and makes its html and css class
 * structures transparent to the user, so the user does not have to deal with it.
 * This layout should be responsive and is mainly focussing on the following devices:
 * * Desktop
 * * Tablet
 * * Smartphone
 * @module
 */

import type { ReactNode, CSSProperties, HTMLAttributes } from "react";

import type { Identifiable, Ref, Styleable } from "../../../common/main/base-props.js";
import type { ResizeOptions } from "../../resizable/resize-handler.api.js";

/**
 * A structure element + style into a slot, e.g.`{ element: <div/>, style={{color:"red"}} }`.
 */
export interface StyledSlot {
	/**
	 * Content of the styled slot.
	 */
	content: ReactNode;

	/**
	 * Additional css classes for content element.
	 */
	style: CSSProperties;
}

/**
 * Specific props for application use case.
 */
export interface ApplicationFrameProps extends Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * This area will shrink due to the provided space of each device. It will always be 100% width.
	 */
	main: ReactNode | StyledSlot;

	/**
	 * *Desktop:* This area is placed on the left and can be collapsed or expanded. When expanded the content area will shrink.
	 *
	 * *Tablet:* In this case the sub area will partially overlap the content area.
	 *
	 * *Smartphone:* 100% width but will be hidden initially and can be invoked by a button (place an example button somewhere).
	 */
	sub?: ReactNode | StyledSlot;

	/**
	 * Specifies whether the sub area of ApplicationFrame is expanded or collapsed.
	 */
	subExpanded?: boolean;

	/**
	 * Specifies states of the expanded sub area. It can be minimized or maximized.
	 */
	subExpandedState?: "minimized" | "maximized";

	/**
	 * Disables collapsing for desktop devices. Doesn't influence mobile and tablet behavior.
	 */
	disableCollapsingSub?: boolean;

	/**
	 * This area is as seen in the screens.
	 * On mobile, it is just overlapped by the sub area if the sub area is open.
	 */
	content: ReactNode | StyledSlot;

	/**
	 * The footer of ApplicationFrame
	 */
	footer?: ReactNode | StyledSlot;

	/** Specifies whether the footer should have a sticky style.
	 * @default true
	 *
	 * *Note:* It is not recommended to use in small viewports or on mobile devices, as it may take up a lot of spaces and negatively impact the user experience.
	 */
	stickyFooter?: boolean;

	/**
	 * Toolbar to be placed on top of the sub area
	 */
	subToolbar?: ReactNode;

	/**
	 * Toolbar to be placed on top of the content area
	 */
	contentToolbar?: ReactNode;

	/**
	 * A toggle button will display at the right-bottom of screen and can be used to toggle the sidebar.
	 * @default false
	 *
	 * *Note:* This button will be applied for the small screen (<= 767px) and only be shown when the {@link sub} is provided.
	 */
	useToggleButton?: boolean;

	/**
	 * Click on anywhere outside the sidebar or use tab-out to close it.
	 * Does not work when {@link disableCollapsingSub} is true.
	 *
	 * @default `true` on tablet. `false` for the other device types.
	 */
	closeSubOnClickOutside?: boolean;

	/**
	 * Additional props that will be placed at the original header, content, main container (the div inside the content), and footer element.
	 * They should be used in case:
	 * - Users want access to the native DOM properties of the elements but there's no property allows to do that.
	 * For instance, `htmlAttributes={{ contentAttributes: { "aria-hidden": true}; footerAttributes: { "aria-hidden": true} }}`.
	 * - Users want to customize the attribute's value that is already defined in the elements.
	 * For instance, `htmlAttributes={{ mainContainerAttributes: { role: undefined } }}`.
	 */
	htmlAttributes?: {
		headerAttributes?: HTMLAttributes<HTMLDivElement>;
		contentAttributes?: HTMLAttributes<HTMLDivElement>;
		mainContainerAttributes?: HTMLAttributes<HTMLDivElement>;
		footerAttributes?: HTMLAttributes<HTMLDivElement>;
	};

	/**
	 * Specifies the options for resizing the boundary between the sidebar and the main content.
	 *
	 * When set to `true`, the user can resize the boundary with default settings.
	 * If an object of type `ResizeOptions` is provided, it allows for customized resizing options.
	 *
	 * *Recommendation:* Instead of passing `true`, use an object of type `ResizeOptions` to specify `minWidth` and `maxWidth`.
	 *  This approach offers more precise control over the resize behavior, enhancing consistency and preventing extreme resizing that could impact the layout.
	 */
	subResizableOptions?: ResizeOptions | boolean;

	/**
	 * A callback to handle expansion event.
	 */
	onExpansionChange?(subExpanded?: boolean): void;
}

export namespace ApplicationFrameProps {
	export interface ToggleSidebarButtonProps extends Ref {
		/**
		 * Icon of the Toggle Sidebar Button
		 */
		icon: ReactNode;

		/**
		 * Specifies whether the view is small or not.
		 */
		smallView: boolean;

		/**
		 * Specifies whether the sub area of ApplicationFrame is expanded or collapsed.
		 */
		subExpanded?: boolean;

		/**
		 * A callback will be triggered when the button is clicked.
		 */
		onClick?(): void;
	}
}
