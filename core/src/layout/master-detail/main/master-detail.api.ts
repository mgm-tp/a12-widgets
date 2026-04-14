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
 * This Master Detail Layout Widget can be used to quickly change between list pane
 * layouts(every pane is a contentbox).
 *
 * These layouts should be responsive and is mainly focusing on the following devices:
 * * Desktop
 * * Tablet
 * * Smartphone
 * @module
 */

import type { ReactNode } from "react";

import type { Styleable, Identifiable } from "../../../common/main/base-props.js";
import type { SizeDetectorComponentProps } from "../../size-detector/main/size-detector.api.js";
import type { ResizeOptions as ResizeHandlerOptions } from "../../resizable/resize-handler.api.js";
import type { MakeRequired } from "../../../common/main/type-utilities.js";

/**
 * Layout strategy to layout "Layoutables" in a "master detail" style (see view).
 */
export interface MasterDetailLayout<T extends Layoutable> {
	/**
	 * Layout of MasterDetailLayout.
	 */
	layout(): LayoutResult<T>;
}

/**
 * Utility functionality.
 */
export namespace MasterDetailLayout {
	/**
	 * Return items of visible layout.
	 */
	export function visible<T>(layout: LayoutResult<T>): LayoutResultItem<T>[] {
		return layout.items.filter((v) => v.width !== undefined);
	}
}

/**
 * Any (abstract) object that can be laid out (currently without options).
 */
export interface Layoutable {
	/**
	 * The Layoutable can provide a preferred width similar to a column in a 12-column grid.
	 */
	preferredWidth?: ViewWidth;
}

/**
 * Output of a MasterDetailLayout strategy. Contains a LayoutResultItem for each Layoutable.
 */
export interface LayoutResult<T> {
	/**
	 * All items for the layout result.
	 */
	items: LayoutResultItem<T>[];
}

/**
 * Layout for a single Layoutable with a computed actual width.
 * An absent width means that the item is minimized.
 * Also holds the original Layoutable for reference.
 */
export interface LayoutResultItem<T> {
	/**
	 * Layoutable of this layout result item.
	 */
	layoutable: T;

	/**
	 * Width of this layout result item.
	 */
	width?: ViewWidth;
}

/**
 * The width of a view in the master-detail layout, expressed in grid columns (1-12).
 * Based on a 12-column grid system.
 */
export type ViewWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ResizeOptions = MakeRequired<ResizeHandlerOptions, "minWidth" | "maxWidth">;

/**
 * A visible view - represented by a React element.
 */
export interface VisibleView extends Identifiable {
	/**
	 * Element of this visibleView.
	 */
	element: ReactNode;

	/**
	 * Key of VisibleView
	 */
	key?: string;

	/**
	 * Width of this VisibleView.
	 */
	width?: ViewWidth;

	/**
	 * Specifies the options for resizing the view.
	 */
	resizableOptions?: ResizeOptions;
}

/**
 *  Animation configuration.
 */
export interface Animation {
	/**
	 * Set to false to disable animations.
	 */
	enabled?: boolean;

	/**
	 * In case a single item is visible, the animation direction must be passed.
	 */
	animateSingleItem?: "ltr" | "rtl";

	/**
	 * Callback triggered when the animation starts.
	 */
	onAnimationStart?(): void;

	/**
	 * Callback triggered when the animation ends.
	 */
	onAnimationEnd?(): void;
}

/**
 * The props of MasterDetail.
 */
export interface MasterDetailProps
	extends MasterDetailHeaderProps, MasterDetailBodyProps, Partial<SizeDetectorComponentProps>, Styleable, Identifiable {
	/**
	 * Listen to the size of browser window instead of parent element
	 *
	 * @default true
	 */
	listenToWindowSize?: boolean;
}

/**
 * The props of MasterDetailHeader.
 */
export interface MasterDetailHeaderProps extends Styleable, Identifiable {
	/**
	 * An (optional) string used as caption.
	 */
	title?: string;
}

/**
 * The props of MasterDetailBody.
 */
export interface MasterDetailBodyProps extends Styleable, Identifiable {
	/**
	 * List of views that are visible.
	 */
	visibleViews: VisibleView[];

	/**
	 * Config for animation (enabled by default).
	 */
	animation?: Animation;

	/**
	 * @internal
	 */
	smallView?: boolean;

	/**
	 * Resizing options specifically for the first view in the `Master Detail` layout.
	 *
	 * Use this prop to control how the first view behaves during resizing.
	 * When provided, it overrides the corresponding options defined in the general {@link VisibleView.resizableOptions}
	 * for the first view only, allowing for more precise and independent control over its resizing behavior.
	 */
	firstViewResizableOptions?: ResizeOptions;

	/**
	 * @internal
	 *
	 * Callback will be triggered after the view has been mounted.
	 * */
	onComponentMounted?(): void;
}
