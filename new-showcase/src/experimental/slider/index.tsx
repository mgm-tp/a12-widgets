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

import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import SliderAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/experimental/input/slider/main/slider.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { Basic } from "./basic.js";
import { ReadonlyAndDisabledSlider } from "./readonly-disabled.js";
import { GraphicLabelShowcase } from "./graphic-label.js";
import { SliderError } from "./error-message.js";

import basicCode from "!./basic.tsx?raw";
import dataCode from "!./data.tsx?raw";
import readonlyAndDisabledCode from "!./readonly-disabled.tsx?raw";
import GraphicLabelCode from "!./graphic-label.tsx?raw";
import errorCode from "!./error-message.tsx?raw";

const { Unordered, Item } = BulletList;

const showcases: Showcase[] = [
	{
		label: "Slider",
		description: (
			<p>
				The <strong>Slider</strong> Widget is an input component that can be used to provide a range of values along a
				bar.
			</p>
		),
		sections: [
			{
				label: "Basic",
				content: <Basic />,
				code: [
					{ name: "basic.tsx", code: basicCode },
					{
						name: "data.tsx",
						code: dataCode
					}
				],
				description: (
					<>
						<p>
							You can use the <code>marks</code> property to specify the value marks.
						</p>
						<p>
							Use the <code>onChange</code> property to handle selected value and set it to the <code>value</code>{" "}
							property.
						</p>
						<p>
							Use <code>leftLabel</code> and <code>rightLabel</code> properties to set additional labels for the{" "}
							<strong>Slider</strong>.
						</p>
						<p>
							To customize each <strong>mark</strong>:
						</p>
						<Unordered>
							<Item>
								Use the <code>label</code> property to change the mark's label.
							</Item>
							<Item>
								Use the <code>disabled</code> property to disable the mark.
							</Item>
						</Unordered>
					</>
				)
			},
			{
				label: "Graphic Label",
				content: <GraphicLabelShowcase />,
				code: [
					{ name: "graphic-label.tsx", code: GraphicLabelCode },
					{ name: "data.tsx", code: dataCode }
				],
				description: (
					<p>
						To add a graphic before the label, you can pass it to the <code>labelGraphic</code> property.
					</p>
				)
			},
			{
				label: "Readonly and Disabled",
				content: <ReadonlyAndDisabledSlider />,
				code: [
					{ name: "readonly-disabled.tsx", code: readonlyAndDisabledCode },
					{ name: "data.tsx", code: dataCode }
				],
				description: (
					<p>
						By providing the <code>readonly</code> property or the <code>disabled</code> property, you can make the
						<strong>Slider</strong> readonly or disabled.
					</p>
				)
			},
			{
				label: "Error Message",
				content: <SliderError />,
				code: [
					{ name: "error-message.tsx", code: errorCode },
					{ name: "data.tsx", code: dataCode }
				],
				description: (
					<p>
						You can add an error message to the <strong>Slider</strong> by using the <code>errorMessage</code> property.
					</p>
				)
			}
		]
	}
];

export default {
	label: "Slider",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: SliderAPI }],
		themingConfiguration: "slider"
	}
};
