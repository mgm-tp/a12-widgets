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

import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";
import AccordionAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/accordion/main/accordion.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { NestedAccordion } from "./nested.js";
import { ControlledAccordion } from "./controlled-accordion.js";
import { BasicAccordion } from "./basic-accordion.js";
import { VariantAccordion } from "./variant-accordion.js";

import basicAccordionCode from "!./basic-accordion.tsx?raw";
import controlledAccordionCode from "!./controlled-accordion.tsx?raw";
import nestedAccordionCode from "!./nested.tsx?raw";
import variantAccordionCode from "!./variant-accordion.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Accordion",
		description: (
			<>
				<p>
					The <strong>Accordion</strong> Widget is a great option if you need to squeeze a lot of content into a small
					space. It is comprised of different sections that can be toggled open and closed.
				</p>
				<p>
					Accordions contain interactive <code>Section</code>. By wrapping these sections inside of a{" "}
					<code>Container</code>, it's possible to use the up/down arrows or tab keys to navigate.
				</p>
				<div>
					Each section contains a:
					<BulletList.Unordered>
						<BulletList.Item>
							<code>Summary</code>: element that displays the title of the section.
						</BulletList.Item>
						<BulletList.Item>
							<code>Details</code>: element that displays the section's content which will be shown when it's clicked or
							after pressing the Enter key while focused on the title.
						</BulletList.Item>
						<BulletList.Item>
							<code>tabIndex</code>: which indicates the content that can be focused on for keyboard navigation.
						</BulletList.Item>
					</BulletList.Unordered>
				</div>
			</>
		),
		sections: [
			{
				label: "Basic Accordion",
				content: <BasicAccordion />,
				description: (
					<>
						<p>
							It's possible to set a maximum height for elements (see Section 2), and/or use the <code>graphic</code>{" "}
							property to display icons, images or other elements in front of a section's title.
						</p>
						<p>
							You can also use the <code>expandIcon</code> and <code>collapseIcon</code> properties to customize an
							individual section's trailing icon based on whether the section is expanded or collapsed.
						</p>
						<p>
							Alternatively, you can customize the collapse/expand icons of all sections by passing the icons you'd like
							to use to the Container's <code>expandIcon</code> and <code>collapseIcon</code> properties. To see an
							example usage of customizing an entire Container's icons, check out the{" "}
							<Link href="#/widgets/navigation/accordion#controlled-accordion">Controlled Accordion</Link> showcase
							below.
						</p>
					</>
				),
				code: { name: "basic-accordion.tsx", code: basicAccordionCode }
			},
			{
				label: "Variant Accordion",
				content: <VariantAccordion />,
				description: (
					<>
						<p>
							Besides allowing to pass an icon by the <code>graphic</code> property, the <strong>Accordion</strong> also
							provides a set of variants to indicate the status of a section.
						</p>
						<p>
							You can use the <code>variant</code> property to select your desired status: <code>open</code>,{" "}
							<code>info</code>, <code>error</code>, <code>warning</code>, <code>inProgress</code>, or <code>done</code>
							. Once it is defined, a specific icon corresponding to that variant will be shown.
						</p>
					</>
				),
				code: { name: "variant-accordion.tsx", code: variantAccordionCode }
			},
			{
				label: "Nested Accordion",
				description: <p>You can build a nested accordion by wrapping sections inside of other sections.</p>,
				content: <NestedAccordion />,
				code: { name: "nested.tsx", code: nestedAccordionCode }
			},
			{
				label: "Controlled Accordion",
				description: (
					<>
						By default, the collapse/expand state of sections is controlled by the Accordion itself. If you'd like to
						control the state yourself (perhaps to open/close multiple sections at the same time amongst other
						possibilities), you can do so by setting the Container's <code>controlled</code> property to true and then
						handling the Sections' following properties:
						<BulletList.Unordered>
							<BulletList.Item>
								<code>expanded</code>: determines whether the content should be shown. The default value is{" "}
								<code>false</code>.
							</BulletList.Item>
							<BulletList.Item>
								<code>onClick</code>: handles the event when a user clicks the section.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <ControlledAccordion />,
				code: { name: "controlled-accordion.tsx", code: controlledAccordionCode }
			}
		]
	}
];

export default {
	label: "Accordion",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{
				declaration: AccordionAPI,
				filter: [
					"AccordionProps.ContainerProps",
					"AccordionProps.DetailsProps",
					"AccordionProps.SectionProps",
					"AccordionProps.SummaryProps"
				]
			}
		],
		themingConfiguration: "accordion"
	}
};
