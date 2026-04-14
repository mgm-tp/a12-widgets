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

import type { Showcase } from "../../../helpers/definitions.js";

import { ResetPasswordShowcase } from "./reset-password.js";
import { ChangePasswordShowcase } from "./change-password.js";

import resetPasswordCode from "!./reset-password.tsx?raw";
import changePasswordCode from "!./change-password.tsx?raw";

const showcases: Showcase[] = [
	{
		label: "Password",
		description: (
			<p>
				This showcase provides two examples of how you can make use of our Widgets in business cases related to
				passwords.
			</p>
		),
		sections: [
			{
				label: "Change Password",
				description: (
					<>
						<p>
							Whether a security breach has occured or it's just that time of year, users may sometimes have the need to
							change their password.
						</p>
						<p>
							We've built an example for you that offers this functionality while also including a section where you can
							explain to users any rules or conditions their new password may need to adhere to.
						</p>
						<p>
							We've also included a section where you can explain to users any rules or conditions their new password
							may need to adhere to.
						</p>
					</>
				),
				content: <ChangePasswordShowcase />,
				featuredWidgets: [
					{
						name: "Modal Overlay",
						url: "#/widgets/layout/modal-overlay",
						description: "popup container to display Change Password view."
					},
					{
						name: "Layout Grid",
						url: "#/widgets/layout/layout-grid",
						description: "responsive layout containing the primary view and the password tips view."
					},
					{
						name: "Bullet List",
						url: "#/widgets/data-display/bullet-list",
						description: "used to create list of password tips."
					},
					{
						name: "Button Group Container",
						url: "#/widgets/general/buttons/button-group-container",
						description: "container for arranging a group of action Buttons."
					},
					{
						name: "Text Field",
						url: "#/widgets/data-entry/text-field",
						description: "used to support text inputting from users for changing password."
					}
				],
				code: { name: "change-password.tsx", code: changePasswordCode }
			},
			{
				label: "Reset Password",
				description: (
					<>
						<p>
							When users forget their password or finish verifying their account, it's common for them to need to reset
							their password.
						</p>
						<p>
							We've built an example for you that offers this functionality while also including a section where you can
							explain to users any rules or conditions their new password may need to adhere to.
						</p>
						<p>We've also included a section where you can give users tips on how to create a secure password.</p>
						<p>
							On larger screens or browser windows, these tips will be displayed alongside the main content. On smaller
							screens and browser windows, buttons can be used to navigate between the primary view and the password
							tips view.
						</p>
					</>
				),
				content: <ResetPasswordShowcase />,
				featuredWidgets: [
					{
						name: "Login Layout",
						url: "#/widgets/business-case/login-layout",
						description: "provides a basic layout for login pages."
					},
					{
						name: "Layout Grid",
						url: "#/widgets/layout/layout-grid",
						description: "creates responsive layout for the primary view."
					},
					{
						name: "Bullet List",
						url: "#/widgets/data-display/bullet-list",
						description: "used to create list of password tips."
					},
					{
						name: "Text Field",
						url: "#/widgets/data-entry/text-field",
						description: "used to support text inputting from users for resetting password."
					},
					{
						name: "Button",
						url: "#/widgets/general/buttons/button",
						description: "used to support triggering action from users."
					}
				],
				code: { name: "reset-password.tsx", code: resetPasswordCode }
			}
		]
	}
];

export default {
	label: "Password",
	structure: showcases
};
