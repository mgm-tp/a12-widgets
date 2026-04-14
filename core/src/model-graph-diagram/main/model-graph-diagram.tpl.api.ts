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

import type { HTMLAttributes, ReactNode } from "react";

import type { Container, Identifiable, Styleable } from "../../common/main/base-props.js";

export interface ModalDiagramBaseProps extends Identifiable, Styleable {
	/**
	 *  Whether the shape is in readonly mode or not.
	 */
	readOnly?: boolean;
}

export interface ModelDiagramNodeProps extends ModalDiagramBaseProps, Container {
	/**
	 *  Whether the node is selected or not.
	 */
	selected?: boolean;

	/**
	 *  If specified, the node will have some specific styles that make it looks like a "link".
	 */
	useAsLink?: boolean;

	/**
	 *  Additional props of a div element.
	 */
	nodeAttributes?: HTMLAttributes<HTMLDivElement>;
}

export interface ModelDiagramLabelProps extends ModalDiagramBaseProps {
	/**
	 * - Type "main": label contains main information and has a big size
	 * - Type "sub": label contains sub information and has a small size
	 * @default main
	 */
	type?: DiagramLabelType;

	/**
	 * Main/Sub information.
	 */
	text: ReactNode;

	/**
	 * Additional information that is placed next to the main/sub information {@link text}.
	 */
	subText?: ReactNode;

	/**
	 *  Whether the label is selected or not.
	 */
	selected?: boolean;

	/**
	 *  Additional props of a div element.
	 */
	labelAttributes?: HTMLAttributes<HTMLDivElement>;
}

export type DiagramLabelType = "main" | "sub";

export interface ModelDiagramPortProps extends ModalDiagramBaseProps {
	/**
	 *  Whether the port is selected or not.
	 */
	selected?: boolean;

	/**
	 *  Whether the port is displayed as a corner point of edge that is treated like a port but with a half size.
	 */
	cornerPoint?: boolean;

	/**
	 *  Additional props of a div element.
	 */
	portAttributes?: HTMLAttributes<HTMLDivElement>;
}

export interface ModelDiagramGridSubPointProps {
	/**
	 *  Whether it is the last sub-point in a grid or not.
	 *  This type of point must stand before the main point on a row in order to have an appropriate distance from the main point.
	 */
	isBeforeMainPoint?: boolean;
}
