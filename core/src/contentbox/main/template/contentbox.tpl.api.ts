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
 * This ContentBox widget is a template component used to structure content as well as actions
 * in a consistent way.
 * It consists of the following areas: Header(heading, notification, subheading), Content and Footer.
 * It also has responsive behavior on mobile devices.
 * It has no intrinsic state.
 * @module
 */

import type {
	ReactNode,
	RefCallback,
	FocusEvent,
	KeyboardEvent,
	MouseEvent,
	HTMLAttributes as ReactHTMLAttributes,
	DetailedHTMLProps,
	RefObject
} from "react";

import type { Ref, Container, Identifiable, Styleable, HTMLAttributes } from "../../../common/main/base-props.js";
import type { ButtonProps } from "../../../button/main/button.api.js";

export type ContentBoxSidePanelMode = "overlay" | "docked";

export interface ContentBoxSidePanels {
	/** Content of the side panel. */
	content?: ReactNode;

	/** Specifies whether to hide the side panel. */
	hide?: boolean;

	/**
	 * Layout mode:
	 * - `overlay`: panel floats above content (no space reserved).
	 * - `docked`: panel sits beside content and reserves space.
	 *
	 * Responsive behavior:
	 * - When either the window width is `md` or smaller (≤ 991px) or the content box width reaches its minimum, `overlay` mode is enforced, even if `docked` is configured.
	 * - When either the window width is `sm` or smaller (≤ 767px) or the content box width reaches its minimum, the overlay expands to full screen (100% width), covering the entire content box.
	 */
	mode?: ContentBoxSidePanelMode;

	/** Width of the side panel. */
	width?: number | string;

	/**
	 * Handle close panel when the user clicks outside the panel while it is in overlay mode.
	 */
	onClose?: () => void;

	/** Reference of the element that trigger open the side pane. Required when {@link onClose} is provided. */
	triggerReference?: RefObject<HTMLElement | null>;
}

export interface ContentBoxBaseProps extends Container, Styleable, Identifiable, Ref<HTMLDivElement> {
	/**
	 * The Notification of the Content Box.
	 */
	notificationArea?: ReactNode;

	/**
	 * Specified padding for Content box's content.
	 * - If set to true, there will be padding left, right and bottom (no padding top).
	 * - If set to false, there's no padding applied.
	 * - You can also set your custom value for padding. For example: *padding="12px 24px"* or *padding=24*.
	 *
	 * @default true
	 */
	padding?: number | string | boolean;

	/**
	 * A wizard bar to be rendered inside the header of Content Box.
	 */
	wizardBar?: ReactNode;

	/**
	 * If the content box's content is scrolled then the {@link wizardBar}  will be hidden.
	 */
	hideWizardBarOnScroll?: boolean;

	/**
	 * Specifies whether the content box is embedded or not.
	 */
	embedded?: boolean;

	/**
	 * role attribute.
	 */
	role?: string;

	/**
	 * aria-label attribute.
	 */
	ariaLabel?: string;

	/**
	 * The footer of the content box.
	 */
	footer?: ReactNode;

	/**
	 * Reference of the content box's content.
	 */
	contentRef?: RefCallback<HTMLDivElement>;

	/**
	 * Specifies box-shadow for the content box. It's useful when used in portals or modal overlays.
	 * - `always` The content box always have a box-shadow in all themes
	 * - `none` No box-shadow in all themes
	 * - `default` The ability to customize box-shadow by theming variables
	 *
	 * @default "default"
	 */
	boxShadow?: "always" | "none" | "default";

	/**
	 * Blur handler for content box
	 * @param event – HTML focus event
	 */
	onBlur?(event: FocusEvent<HTMLElement>): void;

	/**
	 * Focus handler for the content box
	 * @param event – HTML focus event
	 */
	onFocus?(event: FocusEvent<HTMLElement>): void;

	/**
	 * Key down handler for the content box.
	 * @param event – HTML key event.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/** Side panels configuration for the content box. */
	sidePanels?: {
		/** Left side panel configuration. */
		left?: ContentBoxSidePanels;

		/** Right side panel configuration. */
		right?: ContentBoxSidePanels;
	};
}

export interface ContentBoxProps extends ContentBoxBaseProps {
	/**
	 * The heading of the content box.
	 */
	heading: ReactNode;

	/**
	 * The sub-heading of the content box.
	 */
	subHeading?: ReactNode;

	/**
	 * Make the content box look like a tile, useful in dashboard-like layout
	 * @deprecated from 34.0 - use Tile widgets instead
	 */
	tile?: boolean;

	/**
	 * The tabindex attribute.
	 */
	tabIndex?: number;
}

export namespace ContentBoxProps {
	export interface BaseProps extends Styleable, Identifiable, Container {}

	export interface HeadingProps extends BaseProps {
		/**
		 * An icon to displays in front of heading.
		 */
		icon?: string;

		/**
		 * Color for heading.
		 */
		color?: string;

		/**
		 * Specifies prefix will be added in front of heading.
		 */
		prefixes?: ReactNode;

		/**
		 * Specifies suffix will be added in the end of heading.
		 */
		suffixes?: ReactNode;

		/**
		 * Specifies whether the children elements are wrapped inside the heading.
		 * It is recommended when the heading contains only invisible elements, such as `HiddenText`, helping to remove unnecessary empty space in the UI.
		 *
		 * *Note:* If set to true, render children only, {@link prefixes}, {@link suffixes} and {@link icon} will be ignored.
		 */
		childrenOnly?: boolean;

		/**
		 * Click handler for content box's heading.
		 * @param event – HTML mouse event.
		 */
		onClick?(event: MouseEvent): void;

		/**
		 * Key down handler for content box's heading.
		 * @param event – HTML key event.
		 */
		onKeyDown?(event: KeyboardEvent): void;
	}

	export interface BackButtonProps extends ButtonProps {
		/**
		 * Event that will be fired when the back button is clicked.
		 *
		 * @deprecated since 37.0.0. Use `onClick` prop directly from the Button widget.
		 */
		onBackButtonClicked?(): void;
	}

	export interface CloseButtonProps extends ButtonProps {
		/**
		 * Event that will be fired when the close button is clicked.
		 *
		 * @deprecated since 37.0.0. Use `onClick` prop directly from the Button widget.
		 */
		onCloseButtonClicked?(): void;
	}

	export interface ActionBarGroupAreaTplProps extends Styleable, Identifiable {
		/**
		 * Specify left actions group
		 */
		leftSlot?: ReactNode[];

		/**
		 * Additional props that will be placed at the real HTML Element.
		 */
		leftSlotProps?: DetailedHTMLProps<ReactHTMLAttributes<HTMLDivElement>, HTMLDivElement>;

		/**
		 * Specify right actions group
		 */
		rightSlot?: ReactNode[];

		/**
		 * Additional props that will be placed at the real HTML Element.
		 */
		rightSlotProps?: DetailedHTMLProps<ReactHTMLAttributes<HTMLDivElement>, HTMLDivElement>;
	}

	export interface ActionBarGroupProps extends BaseProps {
		/**
		 * role attribute.
		 */
		role?: string;
	}

	/**
	 * Specifies breadcrumb properties
	 */
	export interface BreadcrumbProps extends Styleable, Identifiable {
		items: {
			label?: string;
			onClick?(event: MouseEvent<HTMLElement>): void;
			className?: string;
		}[];
	}

	export interface TitleProps extends Styleable, Identifiable, HTMLAttributes {
		/**
		 * Text of Title
		 */
		text?: ReactNode;

		/**
		 * Define role attribute for the title.
		 * - Set it to "false", no role will be set.
		 * - Or you can customize the role by defining a specific value e.g.: role = "button"
		 * @default "heading"
		 */
		role?: string | false;

		/**
		 * Define the aria level by integer number
		 */
		ariaLevel?: number;
	}

	export interface FooterProps extends BaseProps {
		/**
		 * The custom title of the hidden heading inside the footer. By default:
		 *   + English: "Action Section"
		 *   + German: "Aktionsbereich"
		 *
		 * *Note:* Only applied on desktop.
		 */
		headingTitle?: string;

		/**
		 * aria-level that we be set to the footer, should be set by (heading aria-level + 1).
		 * @default 2
		 */
		ariaLevel?: number;
	}
}
