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

import ResizeAndDragContainerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/resize-and-drag-container/main/resize-and-drag-container.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { BasicResizableContainerShowcase } from "./resizable-basic.js";
import { DragElementShowcase } from "./drag-element.js";
import { MultipleContainers } from "./multiple-containers.js";
import { ResizeDetectingShowcase } from "./resize-detecting.js";
import { AnimationShowcase } from "./animation.js";
import { ResizeAndDragAccessibilityShowcase } from "./accessibility-resize-and-drag.js";

import basicCode from "!./resizable-basic.tsx?raw";
import dragElementCode from "!./drag-element.tsx?raw";
import multipleContainersCode from "!./multiple-containers.tsx?raw";
import resizeDetectingCode from "!./resize-detecting.tsx?raw";
import animationShowcaseCode from "!./animation.tsx?raw";
import resizeAndDragAccessibilityShowcaseCode from "!./accessibility-resize-and-drag.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Resize And Drag Container",
		description: (
			<p>
				The <strong>Resize And Drag Container</strong> Widget provides users the ability to drag and drop along with
				resize action.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <BasicResizableContainerShowcase />,
				description: (
					<>
						<p>
							You can customize the size of the <code>ResizeAndDragContainer</code> with these properties:{" "}
							<code>initialSize</code>, <code>minWidth</code>, <code>minHeight</code>, <code>maxWidth</code> and{" "}
							<code>maxHeight</code>.
						</p>
						<p>
							By default, you can close the container via the ESC key. Besides, setting the{" "}
							<code>closeOnOutsideClick</code> property to <code>true</code> will allows you close it by clicking
							outside.
						</p>
					</>
				),
				code: { name: "resizable-basic.tsx", code: basicCode }
			},
			{
				label: "Resize Detecting",
				content: <ResizeDetectingShowcase />,
				description: (
					<>
						<p>
							You can handle the resizing event by using the <code>onResize</code> property.
						</p>
						<p>
							In this example, if the width of the container is smaller than 500px, the display of the content will be
							changed from <code>Table</code> to <code>Card View</code>.
						</p>
					</>
				),
				code: { name: "resize-detecting.tsx", code: resizeDetectingCode }
			},
			{
				label: "Drag Element",
				content: <DragElementShowcase />,
				description: (
					<div>
						<p>
							Specifies an element to be used as the handler that initiates the drag action by adding{" "}
							<code>handle</code>class.
						</p>
						<p>In this example, the container can only be dragged by the Move button.</p>
					</div>
				),
				code: { name: "drag-element.tsx", code: dragElementCode }
			},
			{
				label: "Multiple Containers",
				description: (
					<>
						<p>
							This example demonstrates how to have multiple resize and drag containers on the screen at the same time.
						</p>
						<p>
							Press the button continuously to add more containers that will be on top of the others. You can close a
							container with the <code>ESC</code> key or close button. In the case of having multiple containers, the
							focus should be set to the top-level container, so to prevent the focus back to the trigger element after
							closing via <code>ESC</code>, set the <code>focusOnReferenceElementAfterEsc</code> property to{" "}
							<code>false</code>, then you can decide what to do next via the <code>onClose</code> property.
						</p>
					</>
				),
				content: <MultipleContainers />,
				code: { name: "multiple-containers.tsx", code: multipleContainersCode }
			},
			{
				label: "Animation",
				description: (
					<p>
						To enable animation when showing or hiding the container, use the <code>animation</code> property. For full
						animation support, ensure the <code>show</code> property is used, otherwise the container will not animate
						when it disappears.
					</p>
				),
				content: <AnimationShowcase />,
				code: { name: "multiple-containers.tsx", code: animationShowcaseCode }
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>
							To support accessibility, the <code>htmlAttributes</code> property is provided on the{" "}
							<code>ResizeAndDragContainer</code>.
						</p>
						<p>
							In the example below, the container includes <code>aria-labelledby</code> which references the header
							title id. When opened, screen readers will announce with the title, helping users understand the context
							and purpose of the container.
						</p>
					</>
				),
				content: <ResizeAndDragAccessibilityShowcase />,
				code: { name: "resize-and-drag-accessibility.tsx", code: resizeAndDragAccessibilityShowcaseCode }
			}
		]
	}
];
export default {
	label: "Resize and Drag Container",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: ResizeAndDragContainerAPI }],
		themingConfiguration: "resizeAndDragContainer"
	}
};
