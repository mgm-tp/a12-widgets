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
 * This Managed Master Detail Widget is a behavioral wrapper of the Template Master Detail Widget.
 *
 * Its required properties are a title and a list of views.
 *
 * The default behavior is to show a single column, displaying the last active element.
 *
 * **Usage:**
 *
 * ```
 * <ManagedMasterDetail
 *     title="Example Title"
 *     views={[
 *         { label: "View 1", content: (props: ContentProps) => <div>View 1</div> },
 *         { label: "View 2", content: (props: ContentProps) => <div>View 2</div> }
 *     ]}
 * />
 * ```
 * @module
 */

import type { ComponentType } from "react";

import type { Identifiable, Styleable } from "../../../../common/main/base-props.js";

import type { Layoutable, MasterDetailProps, VisibleView } from "../master-detail.api.js";

/**
 * This interface represents the views that are passed to the Managed Master Detail Widget.
 */
export interface ManagedMasterDetailView extends Layoutable, Identifiable, Pick<VisibleView, "resizableOptions"> {
	/**
	 * The label displayed above a column.
	 */
	label: string;

	/**
	 * The component displayed in a column, receiving {@link ContentProps}.
	 */
	content: ComponentType<ContentProps>;

	/**
	 * Specify the key attribute.
	 */
	key?: string;
}

/**
 * This interface defines the properties passed to the component that is render to the respective column.
 * It contains callback functions to signal the wrapper to switch to a different column.
 */
export interface ContentProps {
	/**
	 * To be called to decide the component should have fullscreen feature or not
	 * @default false
	 */
	fullScreenable?: boolean;

	/**
	 * To be called to handle the component is collapsed or fullscreen
	 */
	fullScreen?: boolean;

	/**
	 * Specify the tabIndex attribute.
	 */
	tabIndex?: number;

	/**
	 * Callback that will be called when switching to next view.
	 */
	onNext(options?: { triggerElementId?: string }): void;

	/**
	 * To be called to switch to the previous view.
	 */
	onPrevious(): void;

	/**
	 * To be called to switch to a specific view.
	 */
	onGoTo(index: number): void;

	/**
	 * To be called to modify the screen of each component.
	 * @param index – that let you know which component view is being toggled
	 * @param fullscreenButtonId – is the id of the fullscreen button which will be focused after toggling
	 */
	onFullscreenToggled(index: number, fullscreenButtonId?: string): void;

	/**
	 * Handle the replacement of 2 components.
	 */
	onReplace?(currentId: string, replacerId: string): void;
}

/**
 * This interface defines the properties passed to the ManagedMasterDetail Widget.
 *
 * Also the properties of {@link MasterDetailProps} can be applied.
 */
export interface ManagedMasterDetailProps extends Styleable, Identifiable {
	/**
	 * The title displayed above the columns.
	 */
	title: string;

	/**
	 * The list of views to be managed by the widget.
	 */
	views: ManagedMasterDetailView[];

	/**
	 * Number of columns to display (at most).
	 * @default 1
	 */
	columnCount?: number;

	/**
	 * Index of the right most column to show.
	 * @default 0
	 */
	startIndex?: number;

	/**
	 * To be called to decide the component should have fullscreen feature or not
	 * @default false
	 */
	fullScreenable?: boolean;

	/**
	 * To be called to initialize fullscreen
	 * @default false
	 */
	fullscreen?: boolean;

	/**
	 * The tabindex attribute of view
	 */
	viewTabIndex?: number;
}

export type ManagedMasterDetailType = ManagedMasterDetailProps & Partial<MasterDetailProps>;
