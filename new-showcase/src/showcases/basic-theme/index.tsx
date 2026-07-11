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
import { SourceCodeSection } from "@com.mgmtp.a12.widgets/widgets-utils";

import type { Showcase } from "../../helpers/definitions.js";

import { ThemeVariablesShowcase } from "./theme-variables.js";

const customTheme = `import { createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

const theme = createTheme({
  colors: { primaryColor: "red" },
  baseTheme: "flat-compact"
});`;

const showcases: Showcase[] = [
	{
		label: "Theming",
		description: (
			<>
				<p>
					The theme controls the colour of components, surface darkness, shadow depth, opacity of interactive elements,
					and more. It lets you apply a consistent visual tone across your entire app to match your brand or business
					requirements.
				</p>
				<p>
					<strong>Recommended starting point:</strong> Use <code>getBaseTheme()</code> — a clean three-layer
					architecture (Application → Semantic → Widget) that makes custom themes straightforward with minimal token
					changes. It replaces the legacy <code>Default</code>, <code>Compact</code>, <code>Flat</code>, and{" "}
					<code>Flat Compact</code> themes, which are kept for backwards compatibility but are now deprecated.
				</p>
				<p>
					See <Link href="#/basics/theme/base-theme/quick-start">Base Theme {">"} Quick Start</Link> for a quick branded
					theme demonstration, or{" "}
					<Link href="#/basics/theme/base-theme/customization">Base Theme {">"} Customization</Link> for the full set of
					override recipes.
				</p>
				<p>
					The theme selector in the top-right of this showcase lets you switch between all available themes live. The
					legacy themes are listed under a <em>Deprecated</em> section in that menu.
				</p>
			</>
		),
		sections: [
			{
				label: "Theme variables",
				content: <ThemeVariablesShowcase />,
				description: (
					<>
						<p>
							The base Widgets <code>theme</code> includes the following themable aspects:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<code>
									<Link href="#/basics/theme/colors">.colors</Link>
								</code>
								<p>This property defines the color palette of the Theme object.</p>
							</BulletList.Item>
							<BulletList.Item>
								<code>
									<Link href="#/basics/theme/fonts">.typography</Link>
								</code>
								<p>
									This property defines the variables related to the Font of the Theme object, including Font Family,
									Font Size and Font Weight.
								</p>
							</BulletList.Item>
							<BulletList.Item>
								<code>
									<Link href="#/basics/theme/spacing">.spacing</Link>
								</code>
								<p>This property defines the variables related to the Spacing of the Theme object.</p>
							</BulletList.Item>
							<BulletList.Item>
								<code>.applicationStyles</code>
								<p>
									This property defines the variables related to the overall styles of the Theme object, including
									shared input styles, label styles, and responsive breakpoints.
								</p>
							</BulletList.Item>
							<BulletList.Item>
								<code>.focusStyles</code>
								<p>This property defines the variables related to the focus styles of the Theme object.</p>
							</BulletList.Item>
							<BulletList.Item>
								<code>.divisionLineStyles</code>
								<p>
									This property defines the variables related to the styles of the dividers of the Theme object,
									including <code>bottomLine</code>, <code>initialLine</code>, <code>topLine</code> and{" "}
									<code>lineHeight</code>.
								</p>
							</BulletList.Item>
							<BulletList.Item>
								<code>.baseInputStyles</code>
								<p>
									This property defines the variables related to the Box-Shadow and Line Height styles of the input
									components inside the Theme object.
								</p>
							</BulletList.Item>
							<BulletList.Item>
								<code>.components</code>
								<p>
									This property defines the styling variables related to each of the Widget's component. Each of our
									Component showcase includes a <strong>Theme Configuration</strong> section for you to take a deeper
									look on each component's styling configuration values.
								</p>
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							There are some differences between each of our <code>theme</code>:
						</p>
						<BulletList.Unordered>
							<BulletList.Item>
								<p>
									<strong>Flat and Flat-Compact themes:</strong> Our Flat themes has a explicit color design system
									comparing to the Default and Compact themes. Therefore, they have some additional <code>.colors</code>{" "}
									values, and a <code>.hoverStyles</code> property.
								</p>
							</BulletList.Item>
							<BulletList.Item>
								<p>
									<strong>Compact and Flat-Compact themes:</strong> Since they are named as "compact", the{" "}
									<code>.spacing</code> property will have a smaller range of values.
								</p>
							</BulletList.Item>
						</BulletList.Unordered>
						<p>
							The following example represents our <code>theme</code> object of the current theme.
						</p>
					</>
				),
				fullSize: true,
				fitToSection: true
			},
			{
				label: "createTheme",
				description: (
					<>
						<p>
							We provide the <code>createTheme()</code> function for you to generate your own custom theme based on the
							options received. With the <code>theme</code> created by this function, you can pass it as a property to
							the <code>ThemeProvider</code>.
						</p>
						<p>
							This function receives any incomplete <code>theme</code> object as its argument, and will deep merge that
							object to the Default theme.
						</p>
						<p>
							You can pass along a <code>baseTheme</code> property to specify which <code>theme</code> variant you want
							to create upon: <code>"default"</code> (default), <code>"compact"</code>, <code>"flat"</code> or{" "}
							<code>"flat-compact"</code>.
						</p>
						<p>
							The following example creates a custom theme based on the Flat-Compact theme and having the{" "}
							<code>colors.primaryColor</code> as <code>"red"</code>:
						</p>
						<SourceCodeSection
							code={{ code: customTheme }}
							style={{
								minHeight: "100px",
								maxHeight: "80vh",
								overflowY: "auto",
								borderRadius: "4px",
								marginTop: "0"
							}}
						/>
						<p>
							This function is used in the background of our Showcase's Upload Theme function. You can test your custom{" "}
							<code>theme</code> object directly in our Showcase by the following steps:
						</p>
						<BulletList.Ordered>
							<BulletList.Item>
								Create your own custom <code>theme</code> object and save it as a .JSON file
							</BulletList.Item>
							<BulletList.Item>
								At our Showcase, please try to press the <code>LeftShift</code> and the <code>RightShift</code> keys at
								the same time, you can see a new "Upload Theme" button shows up in our Showcase's Header.
							</BulletList.Item>
							<BulletList.Item>
								Click the "Upload Theme" button and upload your custom <code>theme</code> object .JSON file.
							</BulletList.Item>
						</BulletList.Ordered>
						<p>
							To find more examples on how you can make use of this function, please take a look at our{" "}
							<Link href="#/get-started/use-and-configure-widgets-style">Use And Configure Widgets Style</Link>{" "}
							showcase.
						</p>
					</>
				)
			}
		]
	}
];

export default {
	label: "Theming",
	structure: showcases
};
