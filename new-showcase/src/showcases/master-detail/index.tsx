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

import type { JSONOutput } from "typedoc";

import MasterDetailAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/master-detail/main/master-detail.api.json" with { type: "json" };
import ManagedMasterDetailAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/master-detail/main/managed-master-detail/managed-master-detail.api.json" with { type: "json" };
import { BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";
import ResizeHandlerAPI from "@com.mgmtp.a12.widgets/widgets-json-api/core/src/layout/resizable/resize-handler.api.json" with { type: "json" };

import type { Showcase } from "../../helpers/definitions.js";

import { MasterDetailShowcase } from "./master-detail.js";
import { ManagedMasterDetailShowcase } from "./managed-master-detail.js";

import masterDetailCode from "!./master-detail.tsx?raw";
import managedMasterDetailCode from "!./managed-master-detail.tsx?raw";
import dummyContentCode from "!./dummy-content.tsx?raw";
import masterDetailAPICode from "!./showcase-master-detail.api.ts?raw";

const showcases: Showcase[] = [
	{
		label: "Master Detail",
		description: (
			<div>
				<p>
					The <strong>Master Detail Layout</strong> Widget is a responsive layout that has a list of items on the left
					side (called the Master View) and has the selected item’s detail info on the right side (called the Detail
					View). Please check out the <Link href="#/examples/master-detail">Master Detail Example</Link> to see how it
					works.
				</p>
				<p>
					The <strong>Master Detail Layout</strong> works best on large devices since the user can see both the master
					list and the detail view at the same time. If the screen is small, the user will only be able to see one view
					at a time and will be forced to switch back and forth.
				</p>
			</div>
		),
		sections: [
			{
				label: "Template",
				content: <MasterDetailShowcase />,
				description: (
					<div>
						<p>
							We use a 12-column grid system so you can set the view width of any given pane from 1 to 12 columns. By
							default, panes will automatically adjust to be equal widths. In this showcase, however, pane 2 has a
							preferred width of 5 columns. For that reason, pane 1 adjusts by becoming wider and taking up 7 columns.
						</p>
						<p>
							Based on the window scale, if the width is less than or equal to the <code>sm</code> breakpoint (767px),
							only 1 component should be displayed at a time. To do that, use <code>onSizeChange</code> to handle
							anything on window's size changed with the current <code>breakpoint</code>. You can customize{" "}
							<code>breakpoints</code> to calculate the size as well.
						</p>
						<p>
							If you'd like to listen to the parent's size instead of the window's, set the{" "}
							<code>listenToWindowSize</code> property to <code>false</code>.
						</p>
						<p>
							To control the resizing behavior, use the <code>resizableOptions</code> property for each view, such as
							setting <code>minWidth</code> and <code>maxWidth</code>, as well as handling resize events for precise
							control. <br />
							Additionally, the <code>firstViewResizableOptions</code> property provides a convenient way to
							specifically configure the resizing behavior of the <code>Master Detail</code> component. If provided,
							this will override the corresponding options defined in <code>resizableOptions</code> for the first view
							only.
							<br />
							The resizing feature currently supports a maximum of two views. For practical examples, refer to the{" "}
							<Link href="#/examples/master-detail">Master Detail Example</Link>.
						</p>
						<p>
							For detailed guidance on customizing resizing behavior, refer to the{" "}
							<Link href="#/widgets/layout/resize-handler">Resize Handler</Link>.
						</p>
					</div>
				),
				useDarkBackground: true,
				code: [
					{ name: "master-detail.tsx", code: masterDetailCode },
					{ name: "dummy-content.tsx", code: dummyContentCode },
					{ name: "showcase-master-detail.api.ts", code: masterDetailAPICode }
				]
			},
			{
				label: "Managed",
				description: (
					<div>
						<p>
							This <strong>Managed Master Detail</strong> Widget is a behavioral wrapper of the Template Master Detail
							Widget. Its required properties are a <code>title</code> and a list of <code>views</code>.
						</p>
						<p>
							Based on the window scale, if the width is greater than the <code>sm</code> breakpoint (767px), the number
							of displayed components depends on the value users pass to the <code>columnCount</code> property.
							Otherwise, only 1 component can be displayed at a time. Use the <code>onSizeChange</code> property to
							handle anything on window's size changed with the current breakpoint. You can customize the
							<code>breakpoints</code> to calculate the size as well.
						</p>
						<p>
							If you'd like to listen to the parent's size instead of the window's, set the{" "}
							<code>listenToWindowSize</code> property to <code>false</code>.
						</p>
					</div>
				),
				content: <ManagedMasterDetailShowcase />,
				useConfiguration: true,
				code: [
					{
						name: "managed-master-detail.tsx",
						code: managedMasterDetailCode
					},
					{ name: "dummy-content.tsx", code: dummyContentCode },
					{ name: "showcase-master-detail.api.ts", code: masterDetailAPICode }
				]
			},
			{
				label: "Accessibility",
				description: (
					<div>
						For <em>Accessibility (A11y)</em>, each view should have an <strong>id</strong> which is passed by users,
						then the focus will occur based on these scenarios that are possible below, otherwise, it will focus on the
						current view:
						<BulletList.Unordered>
							<BulletList.Item>
								<em>Add:</em> The focus will be on the added view. The <strong>id</strong> of the trigger open element
								should be provided in <strong>onNext(options?: {`{triggerElementId?: string}`})</strong> so that this
								trigger element will be focused when removing the added view.
								<br />
								e.g.: <code>[1,2,3,4] -&gt; [1,2,3,4,5]</code>. The added view 5 will be focused.
							</BulletList.Item>
							<BulletList.Item>
								<em>Remove:</em> The focus will be on the trigger open element if its id is defined, otherwise, the last
								visible view will be focused.
								<br />
								e.g.: <code>[1,2,3,4,5] -&gt; [1,2,3,4]</code>. Click on HERE button of view 4 to open view 5. Close
								view 5, that button will be focused.
							</BulletList.Item>
							<BulletList.Item>
								<em>Replace:</em> The focus will be on the new view. If the new view is closed, the focus will go back
								to the last visible view.
								<br />
								e.g.: <code>[1,2,3,4] -&gt; [1,2,3,5]</code>. View 5 will be focused. Close view 5, view 3 will be
								focused.
							</BulletList.Item>
							<BulletList.Item>
								<em>Minimize/Maximize:</em> The focus will be on the minimize/maximize button. The <strong>id</strong>{" "}
								of that trigger button should be provided in{" "}
								<strong>onFullscreenToggled(fullscreenButtonId?: string)</strong>.
							</BulletList.Item>
						</BulletList.Unordered>
						You can see <Link href="#/widgets/layout/master-detail#managed">Managed</Link> example above.
					</div>
				)
			}
		]
	}
];

export default {
	label: "Master Detail",
	structure: showcases,
	widgetInfo: {
		typedoc: [
			{ declaration: MasterDetailAPI as JSONOutput.DeclarationReflection },
			{ declaration: ResizeHandlerAPI as JSONOutput.DeclarationReflection, filter: ["ResizeOptions"] },
			{ declaration: ManagedMasterDetailAPI as JSONOutput.DeclarationReflection }
		],
		themingConfiguration: "masterDetailLayout"
	}
};
