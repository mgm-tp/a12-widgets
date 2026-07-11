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

import { ExternalLink, BulletList } from "@com.mgmtp.a12.widgets/widgets-core";
import IconAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/icon/main/icon.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { BasicIconShowcase } from "./basic.js";
import { BigIconShowcase } from "./big-icon.js";
import { IconWithVariant } from "./variant.js";
import { IconWithTheme } from "./theme.js";
import { CustomIcons } from "./custom-icons.js";
import { IconWithMappingContext } from "./mapping-context.js";
import { AccessibilityIconShowcase } from "./accessibility.js";

import basicCode from "!./basic.tsx?raw";
import bigCode from "!./big-icon.tsx?raw";
import variantCode from "!./variant.tsx?raw";
import themeCode from "!./theme.tsx?raw";
import customIconsCode from "!./custom-icons.tsx?raw";
import mappingContextCode from "!./mapping-context.tsx?raw";
import accessibilityCode from "!./accessibility.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Icon",
		description: (
			<p>
				The <strong>Icon</strong> Widget is the component that will display an icon from any icon font that supports{" "}
				<ExternalLink href="http://alistapart.com/article/the-era-of-symbol-fonts/">ligatures</ExternalLink>.
			</p>
		),
		sections: [
			{
				label: "Basic",
				description: (
					<div>
						<p>
							To use the <strong>Icon</strong> Widget, you can pass the name of an icon from{" "}
							<ExternalLink href="https://fonts.google.com/icons">Material Symbols</ExternalLink> as the{" "}
							<code>children</code> property.
						</p>
						<p>
							The value of <code>title</code> property will display as a tooltip of icon.
						</p>
					</div>
				),
				content: <BasicIconShowcase />,
				code: { name: "basic.tsx", code: basicCode }
			},
			{
				label: "Big Icon",
				description: (
					<p>
						Set <code>size</code> property to <strong>big</strong>, the <code>Icon</code> will have a bigger font size.
					</p>
				),
				content: <BigIconShowcase />,
				code: { name: "big-icon.tsx", code: bigCode }
			},
			{
				label: "Variants",
				description: (
					<p>
						There are four Icon variants besides the default: <code>info</code>, <code>success</code>,{" "}
						<code>warning</code>, and <code>error</code>. You can change it by setting <code>variant</code> property.
					</p>
				),
				content: <IconWithVariant />,
				code: { name: "variant.tsx", code: variantCode }
			},
			{
				label: "Themes",
				description: (
					<>
						<p>
							Icon has 4 themes: <code>filled</code>, <code>outlined</code>, <code>rounded</code> and{" "}
							<code>custom</code>. The default theme is <code>filled</code>.
						</p>
						<p>
							The <code>filled</code>, <code>outlined</code> and <code>rounded</code> themes are using filled, outlined
							and rounded <ExternalLink href="https://fonts.google.com/icons">Material Symbols</ExternalLink>.
						</p>
					</>
				),
				content: <IconWithTheme />,
				code: { name: "theme.tsx", code: themeCode }
			},
			{
				label: "Custom Icons",
				description: (
					<p>
						You can create your custom font by using{" "}
						<ExternalLink href="https://icomoon.io/app">IcoMoon App</ExternalLink>, but make sure that you enable{" "}
						<code>Ligatures</code> feature so that you can use the <code>children</code> property.
					</p>
				),
				content: <CustomIcons />,
				code: { name: "custom-icons.tsx", code: customIconsCode }
			},
			{
				label: "With Mapping Context",
				description: (
					<>
						<p>Icon Mapping Context provides a way to replace a specific icon by another one.</p>
						<p> The below example replace "info" with "report_problem" and "help" with "help_center".</p>
						<p>
							<code> {`{ originalIcon: "info", mappedIcon: "report_problem", theme: "filled" }`} </code>
						</p>
						<p>
							<code> {`{ originalIcon: "help", mappedIcon: "help_center", theme: "outlined" },`} </code>
						</p>
					</>
				),
				content: <IconWithMappingContext />,
				code: { name: "mapping-context.tsx", code: mappingContextCode }
			},
			{
				label: "Accessibility",
				description: (
					<>
						<p>
							By default, the <strong>Icon</strong> uses the <code>title</code> value as the value of hidden text, which
							is read by screen readers. However, you can explicitly define this using the <code>hiddenText</code>{" "}
							property.
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<strong>Not set (default)</strong>: The <code>title</code> value is used as the hidden text.
							</BulletList.Item>
							<BulletList.Item>
								<strong>Custom value</strong>: The provided string is used as the hidden text.
							</BulletList.Item>
							<BulletList.Item>
								<strong>Empty string</strong>: No hidden text is rendered.
							</BulletList.Item>
						</BulletList.Unordered>
					</>
				),
				content: <AccessibilityIconShowcase />,
				code: { name: "accessibility.tsx", code: accessibilityCode }
			}
		]
	}
];

export default {
	label: "Icon",
	structure: showcases,
	widgetInfo: {
		typedoc: [{ declaration: IconAPI }],
		themingConfiguration: "icon"
	}
};
