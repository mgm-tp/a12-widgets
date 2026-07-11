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
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export const groupedTabs: TabPanelTemplateProps.GroupTabProps[] = [
	{
		id: "group-navigation",
		groupLabel: "Navigation",
		ariaLabel: "Navigation Group",
		tabs: [{ icon: <Icon>navigation</Icon>, value: "Map Panel", id: "tab-map", title: "Map", label: "Map" }]
	},
	{
		id: "group-explore",
		groupLabel: "Explore",
		ariaLabel: "Explore Group",
		tabs: [
			{
				icon: <Icon>directions</Icon>,
				value: "Directions Panel",
				id: "tab-directions",
				title: "Directions",
				label: "Directions"
			},
			{ icon: <Icon>explore</Icon>, value: "Explore Panel", id: "tab-explore", title: "Explore", label: "Explore" },
			{
				icon: <Icon>my_location</Icon>,
				value: "Location Panel",
				id: "tab-location",
				title: "Location",
				label: "Location"
			}
		]
	},
	{
		id: "group-content",
		groupLabel: "Content",
		ariaLabel: "Content Group",
		tabs: [
			{
				icon: <Icon>event_note</Icon>,
				value: "Calendar Panel",
				id: "tab-calendar",
				title: "Calendar",
				label: "Calendar"
			},
			{ icon: <Icon>search</Icon>, value: "Search Panel", id: "tab-search", title: "Search", label: "Search" },
			{ icon: <Icon>article</Icon>, value: "Articles Panel", id: "tab-articles", title: "Articles", label: "Articles" },
			{
				icon: <Icon>bookmark</Icon>,
				value: "Bookmarks Panel",
				id: "tab-bookmarks",
				title: "Bookmarks",
				label: "Bookmarks"
			},
			{
				icon: <Icon>feedback</Icon>,
				value: "Feedback Panel",
				id: "tab-feedback",
				title: "Feedback",
				label: "Feedback",
				disabled: true
			}
		]
	},
	{
		id: "group-media",
		groupLabel: "Media",
		ariaLabel: "Media Group",
		tabs: [
			{ icon: <Icon>photo_library</Icon>, value: "Photos Panel", id: "tab-photos", title: "Photos", label: "Photos" },
			{ icon: <Icon>videocam</Icon>, value: "Video Panel", id: "tab-video", title: "Video", label: "Video" },
			{ icon: <Icon>audiotrack</Icon>, value: "Audio Panel", id: "tab-audio", title: "Audio", label: "Audio" },
			{ icon: <Icon>podcasts</Icon>, value: "Podcasts Panel", id: "tab-podcasts", title: "Podcasts", label: "Podcasts" }
		]
	},
	{
		id: "group-communication",
		groupLabel: "Communication",
		ariaLabel: "Communication Group",
		tabs: [
			{ icon: <Icon>chat</Icon>, value: "Chat Panel", id: "tab-chat", label: "Chat" },
			{
				icon: <Icon>notifications</Icon>,
				value: "Notifications Panel",
				id: "tab-notifications",
				title: "Notifications",
				label: "Notifications"
			},
			{ icon: <Icon>forum</Icon>, value: "Forum Panel", id: "tab-forum", title: "Forum", label: "Forum" },
			{
				icon: <Icon>email</Icon>,
				value: "Email Panel",
				id: "tab-email",
				title: "Email",
				label: "Email",
				disabled: true
			}
		]
	},
	{
		id: "group-analytics",
		groupLabel: "Analytics",
		ariaLabel: "Analytics Group",
		tabs: [
			{ icon: <Icon>bar_chart</Icon>, value: "Charts Panel", id: "tab-charts", label: "Charts" },
			{
				icon: <Icon>insights</Icon>,
				value: "Insights Panel",
				id: "tab-insights",
				title: "Insights",
				label: "Insights"
			},
			{ icon: <Icon>analytics</Icon>, value: "Reports Panel", id: "tab-reports", title: "Reports", label: "Reports" },
			{
				icon: <Icon>dashboard</Icon>,
				value: "Dashboard Panel",
				id: "tab-dashboard",
				title: "Dashboard",
				label: "Dashboard"
			}
		]
	},
	{
		id: "group-tools",
		groupLabel: "Tools",
		ariaLabel: "Tools Group",
		tabs: [
			{ icon: <Icon>build</Icon>, value: "Developer Panel", id: "tab-dev", label: "Developer" },
			{ icon: <Icon>integration_instructions</Icon>, value: "API Panel", id: "tab-api", title: "API", label: "API" },
			{ icon: <Icon>terminal</Icon>, value: "Console Panel", id: "tab-console", title: "Console", label: "Console" }
		]
	},
	{
		id: "group-settings",
		groupLabel: "Settings",
		ariaLabel: "Settings Group",
		tabs: [
			{ icon: <Icon>accessible</Icon>, value: "Accessibility Panel", id: "tab-a11y", label: "Accessibility" },
			{
				icon: <Icon>settings</Icon>,
				value: "Settings Panel",
				id: "tab-settings",
				title: "Settings",
				label: "Settings"
			},
			{
				icon: <Icon>manage_accounts</Icon>,
				value: "Account Panel",
				id: "tab-account",
				title: "Account",
				label: "Account"
			},
			{ icon: <Icon>security</Icon>, value: "Security Panel", id: "tab-security", title: "Security", label: "Security" }
		]
	}
];
