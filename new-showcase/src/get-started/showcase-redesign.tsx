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

import { BulletList, Typography, Icon, MailtoLink } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Showcase } from "../helpers/definitions.js";

const showcases: Showcase[] = [
	{
		label: "Showcase Redesign",
		description: (
			<div>
				<p>
					Today we are proud to announce and launch the release of our newly redesigned Widgets showcase. Some major
					improvements you’ll notice are:
				</p>

				<BulletList.Unordered>
					<BulletList.Item>Clearer and more detailed documentation</BulletList.Item>
					<BulletList.Item>API and theming documentation now available inside the showcase</BulletList.Item>
					<BulletList.Item>More relevant example usage of Widgets</BulletList.Item>
					<BulletList.Item>Many class components have been converted to functional components</BulletList.Item>
					<BulletList.Item>
						Code snippets are now dynamic and generated based on the current state of the showcase
					</BulletList.Item>
					<BulletList.Item>Improved search results and suggestions</BulletList.Item>
					<BulletList.Item>A better UX navigating between pages and sections of a page</BulletList.Item>
					<BulletList.Item>Inline bug icon buttons to conveniently report bugs</BulletList.Item>
				</BulletList.Unordered>
				<Typography.Headline level={2} ariaLevel={2}>
					We’d Love to Hear From You
				</Typography.Headline>
				<p>
					If you’d like to provide high-level feedback on our new showcase, you can do so by sending an email to the{" "}
					<MailtoLink to="a12-widgets-team@mgm-tp.com">a12-widgets-team</MailtoLink>.
				</p>
				<div>
					Otherwise, if you notice issues with a specific showcase please feel free to click one of the bug icon buttons
					(
					<div className="-u-inline-block -u-align-middle">
						<Icon className="-u-block -u-relative">bug_report</Icon>
					</div>
					) in said showcase, and a pre-formatted email with the background info we need to support you (version,
					browser, device, etc.) will be generated.
				</div>
			</div>
		),
		sections: []
	}
];

export default {
	label: "Showcase Redesign",
	structure: showcases
};
