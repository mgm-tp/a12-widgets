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

import type { TabPanelTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

export const tabPanelData: TabPanelTemplateProps.TabProps[] = [
	{
		icon: <Icon>info</Icon>,
		value: "information",
		title: "Information"
	},
	{
		icon: <Icon>navigation</Icon>,
		value: "navigation",
		title: "Navigation",
		ariaLabelledby: "badge-id",
		children: <Badge id="badge-id" count={9} />
	},
	{
		icon: <Icon>search</Icon>,
		value: "search",
		title: "Search"
	},
	{
		icon: <Icon>event_note</Icon>,
		value: "calendar",
		title: "Calendar"
	},
	{
		icon: <Icon>feedback</Icon>,
		value: "feedback",
		disabled: true,
		title: "Feedback"
	},
	{
		icon: <Icon>airline_seat_legroom_reduced</Icon>,
		value: "Airline seat",
		title: "Airline seat"
	},
	{
		icon: <Icon>add_circle</Icon>,
		value: "Add circle",
		title: "Add circle"
	},
	{
		icon: <Icon>accessible</Icon>,
		value: "Accessible",
		title: "Accessible"
	}
];
