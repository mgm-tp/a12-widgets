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

import type { ReactElement } from "react";
// start code removal
import { useState } from "react";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

// end code removal
// start code removal
import { ConfigurationView } from "../../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../../helpers/showcase-example.js";

const items: MenuItem[] = [
	{ label: "Open File", variant: "open" },
	{ label: "View Info", variant: "info" },
	{ label: "Report Error", variant: "error" },
	{ label: "Show Warning", variant: "warning" },
	{ label: "Set In Progress", variant: "inProgress" },
	{ label: "Mark Done", variant: "done" }
];
// end code removal

export function MenuWithVariants(): ReactElement {
	// start code removal
	const [vertical, setVertical] = useState(false);
	// end code removal

	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div>
					<Checkbox checked={vertical} onChange={setVertical} label="Vertical Menu" title="Vertical Menu" />
				</div>
			}
		>
			<CodeSnippetGenerationWrapper>
				<div className={vertical ? "-u-width-48" : "-u-width-full"}>
					<FlyoutMenu type={vertical ? "vertical" : "horizontal"} items={items} id="menu-with-variants" />
				</div>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
