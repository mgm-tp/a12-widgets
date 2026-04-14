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

import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

import { BasicMultiselectTable } from "./basic-multiselect.js";
import { MultiselectTableWithValuesInActionBar } from "./advanced-multiselect.js";

import basicMultiselectTableCode from "!./basic-multiselect.tsx?raw";
import multiselectTableWithValuesInActionBarCode from "!./advanced-multiselect.tsx?raw";
import utilsDataCode from "!./utils/data.tsx?raw";
import utilsElementsCode from "!./utils/elements.tsx?raw";
import utilsTableCode from "!./utils/table.tsx?raw";

const utils = [
	{ name: "utils/data.tsx", code: utilsDataCode },
	{ name: "utils/elements.tsx", code: utilsElementsCode },
	{ name: "utils/table.tsx", code: utilsTableCode }
];
export const BasicMultiselectTableExample = {
	label: "Multiselect Table Example",
	structure: [
		{
			label: "Basic Multiselect Table Example",
			description: (
				<>
					<p>
						In this simple example, you can click one or multiple checkboxes to indicate rows you’d like to delete or
						mark as favorites. For a more complex, feature-rich example, see our{" "}
						<Link href="#/examples/multiselect-table/advanced">Advanced Multiselect Table</Link>.
					</p>
					<p>
						<strong>Note:</strong> This example is not compatible with mobile devices or small screens because it is a
						complex feature that needs a lot of space to offer a good user experience.
					</p>
				</>
			),
			sections: [
				{
					content: <BasicMultiselectTable />,
					code: [{ name: "basic-multiselect.tsx", code: basicMultiselectTableCode }, ...utils],
					useDarkBackground: true
				}
			],
			featuredWidgets: [
				{
					name: "Content Box",
					url: "#/widgets/layout/content-box",
					description:
						"to structure content with Table which displaying data, Action Bar which containing components triggering deleting or marking actions and the Pagination at the bottom."
				},
				{
					name: "Table",
					url: "#/widgets/data-display/table",
					description: "to display data with Selecting/Pagination support."
				},
				{
					name: "Pagination",
					url: "#/widgets/data-display/pagination",
					description: "to organize data from the Table into separate pages so users can find the desired page/content."
				},
				{
					name: "Modal Notification",
					url: "#/widgets/feedback/modal-notification",
					description: "used to display Information and Confirmation Modal when users interact with Table."
				},
				{
					name: "Text Field",
					url: "#/widgets/data-entry/text-field",
					description: "used to support searching data from the table."
				},
				{
					name: "Button Group",
					url: "#/widgets/general/buttons/button-group",
					description: "used to group buttons with the same kind of action to interact with the table."
				},
				{
					name: "Counter",
					url: "#/widgets/data-display/counter",
					description: "a label used to display amount of selected rows of the Table."
				}
			]
		}
	],
	useFullPageLayout: true
};

export const AdvancedMultiselectTableExample = {
	label: "Advanced Multiselect Table Example",
	structure: [
		{
			label: "Advanced Multiselect Table Example",
			description: (
				<>
					<p>
						By clicking the expand button, you can open up the <code>ActionBar</code>. Inside of the{" "}
						<code>ActionBar</code> there are a number of cool functionalities for you to take advantage of. You can view
						the currently selected users, edit user’s companies (individually or in bulk), and even share the table rows
						of the currently selected users with groups such as friends or family.
					</p>
					<p>
						<strong>Note:</strong> This example is not compatible with mobile devices or small screens because it is a
						complex feature that needs a lot of space to offer a good user experience.
					</p>
				</>
			),
			sections: [
				{
					content: <MultiselectTableWithValuesInActionBar />,
					code: [{ name: "advanced-multiselect.tsx", code: multiselectTableWithValuesInActionBarCode }, ...utils],
					useDarkBackground: true
				}
			],
			featuredWidgets: [
				{
					name: "Content Box",
					url: "#/widgets/layout/content-box",
					description:
						"to structure content with Table which displaying data, Action Bar which containing components triggering actions and the Pagination at the bottom."
				},
				{
					name: "Table",
					url: "#/widgets/data-display/table",
					description: "to display data with Selecting/Pagination support."
				},
				{
					name: "Pagination",
					url: "#/widgets/data-display/pagination",
					description: "to organize data from the Table into separate pages so users can find the desired page/content."
				},
				{
					name: "Modal Notification",
					url: "#/widgets/feedback/modal-notification",
					description: "used to display Information and Confirmation Modal when users interact with Table."
				},
				{
					name: "Toast Group",
					url: "#/widgets/feedback/toasts/toast-group",
					description: "used to group a list of Toast to notify users of the result of actions."
				},
				{
					name: "Text Field",
					url: "#/widgets/data-entry/text-field",
					description: "used to support searching data from the table and inputting information from users."
				},
				{
					name: "Select",
					url: "#/widgets/data-entry/select",
					description: "used to support searching data from the table and inputting information from users."
				},
				{
					name: "Button Group",
					url: "#/widgets/general/buttons/button-group",
					description: "used to group buttons with the same kind of action to interact with the table."
				},
				{
					name: "Counter",
					url: "#/widgets/data-display/counter",
					description: "a label used to display amount of selected rows of the Table."
				}
			]
		}
	],
	useFullPageLayout: true
};
