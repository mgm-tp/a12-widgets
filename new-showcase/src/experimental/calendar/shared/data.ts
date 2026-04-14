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

import { parseISO } from "date-fns";

export interface DayEvent {
	id: string;
	title: string;
	author?: string;
	status: "info" | "success" | "warning" | "error";
}

export interface SelectedDayEvent {
	date: Date;
	item?: DayEvent;
}

export interface CalendarDay {
	date: Date;
	items: DayEvent[];
}

export const calendarDays: CalendarDay[] = [
	{
		date: new Date(2025, 3, 29),
		items: [
			{
				id: "1000000011",
				title: "Marketing Meeting",
				author: "Alice Smith",
				status: "info"
			},
			{
				id: "1000000021",
				title: "Product Brainstorming",
				author: "Bob Johnson",
				status: "success"
			}
		]
	},
	{
		date: new Date(2025, 4, 5),
		items: [
			{
				id: "100000001",
				title: "Marketing Meeting",
				author: "Alice Smith",
				status: "info"
			},
			{
				id: "100000002",
				title: "Product Brainstorming",
				author: "Bob Johnson",
				status: "success"
			}
		]
	},
	{
		date: new Date(2025, 4, 7),
		items: [
			{
				id: "100000003",
				title: "Checkpoint Calendar Widget (Another checkpoint for the basic calendar widget)",
				author: "Charlie Brown",
				status: "warning"
			}
		]
	},
	{
		date: new Date(2025, 4, 9),
		items: [
			{
				id: "100000004",
				title: "Code Review",
				author: "Emily Clark",
				status: "info"
			}
		]
	},
	{
		date: new Date(2025, 4, 12),
		items: [
			{
				id: "455698741",
				title: "Project Deadline",
				status: "error"
			}
		]
	},
	{
		date: new Date(2025, 4, 13),
		items: [
			{
				id: "235523567",
				title: "Daily Standup",
				author: "Diana Prince",
				status: "info"
			},
			{
				id: "356785323",
				title: "Happy Hour",
				author: "Ethan Hunt",
				status: "success"
			},
			{
				id: "687234567",
				title: "Project Deadline",
				author: "Fiona Gallagher",
				status: "error"
			},
			{
				id: "536789346",
				title: "English Class",
				author: "George Martin",
				status: "info"
			},
			{
				id: "947037563",
				title: "End of Sprint",
				author: "Hannah Baker",
				status: "warning"
			}
		]
	},
	{
		date: new Date(2025, 4, 15),
		items: [
			{
				id: "987838302",
				title: "Project Deadline",
				author: "Isaac Newton",
				status: "error"
			},
			{
				id: "059384920",
				title: "End of Sprint",
				author: "Julia Roberts",
				status: "warning"
			}
		]
	},
	{
		date: new Date(2025, 4, 18),
		items: [
			{
				id: "100000005",
				title: "Team Building Event",
				author: "Kevin Hart",
				status: "success"
			}
		]
	},
	{
		date: new Date(2025, 4, 20),
		items: [
			{
				id: "100000006",
				title: "Quarterly Review",
				author: "Laura Palmer",
				status: "info"
			},
			{
				id: "100000007",
				title: "Customer Feedback Analysis",
				author: "Michael Scott",
				status: "success"
			}
		]
	},
	{
		date: new Date(2025, 4, 22),
		items: [
			{
				id: "100000008",
				title: "Security Audit",
				author: "Natalie Portman",
				status: "warning"
			}
		]
	},
	{
		date: new Date(2025, 4, 26),
		items: [
			{
				id: "100000009",
				title: "Design Sprint",
				author: "Oprah Winfrey",
				status: "success"
			},
			{
				id: "100000010",
				title: "UX Review",
				author: "Peter Parker",
				status: "info"
			}
		]
	},
	{
		date: new Date(2025, 4, 27),
		items: [
			{
				id: "100000011",
				title: "Infrastructure Upgrade",
				author: "Queen Elizabeth",
				status: "warning"
			}
		]
	},
	{
		date: new Date(2025, 4, 28),
		items: [
			{
				id: "839409423",
				title: "Daily Standup",
				author: "Oscar Wilde",
				status: "info"
			},
			{
				id: "879034235",
				title: "Happy Hour",
				author: "Penelope Cruz",
				status: "success"
			},
			{
				id: "896238523",
				title: "End of Sprint",
				author: "Mr Unbreakable",
				status: "warning"
			}
		]
	},
	{
		date: new Date(2025, 4, 30),
		items: [
			{
				id: "232357689",
				title: "Daily Standups",
				author: "Rachel Green",
				status: "info"
			},
			{
				id: "324326789",
				title: "Happy Hour",
				author: "Steve Rogers",
				status: "success"
			},
			{
				id: "768643456",
				title: "End of Sprint",
				author: "Tony Stark",
				status: "warning"
			},
			{
				id: "547656689",
				title: "English Class",
				author: "Uma Thurman",
				status: "info"
			},
			{
				id: "100000014",
				title: "Yoga Session",
				author: "Bruce Lee",
				status: "success"
			},
			{
				id: "100000015",
				title: "Hackathon Planning",
				author: "Mark Zuckerberg",
				status: "info"
			},
			{
				id: "100000016",
				title: "Customer Success Workshop",
				author: "Sheryl Sandberg",
				status: "success"
			},
			{
				id: "100000017",
				title: "Customer Success Workshop part 2",
				author: "Sheryl Sandberg",
				status: "success"
			}
		]
	},
	{
		date: new Date(2025, 4, 31),
		items: [
			{
				id: "100000012",
				title: "Monthly Wrap-Up",
				author: "Leonardo DiCaprio",
				status: "info"
			},
			{
				id: "100000013",
				title: "Retrospective Meeting",
				author: "Margot Robbie",
				status: "success"
			}
		]
	}
];

export const initialIcons: {
	title: string;
	icon: string;
	variant: "info" | "success" | "warning" | "error";
}[] = [
	{
		title: "Info",
		icon: "info",
		variant: "info"
	},
	{
		title: "Success",
		icon: "check_circle",
		variant: "success"
	},
	{
		title: "Warning",
		icon: "warning",
		variant: "warning"
	},
	{
		title: "Error",
		icon: "error",
		variant: "error"
	}
];

export const holidays = ["2025-05-01", "2025-05-08", "2025-05-10", "2025-05-29"].map((holiday) => parseISO(holiday));
export const disabledDays = ["2025-05-14", "2025-05-17", "2025-05-27", "2025-05-31"].map((holiday) =>
	parseISO(holiday)
);

export const generateDummyData = (startDate: Date, endDate: Date): CalendarDay[] => {
	const data: CalendarDay[] = [];
	const currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		const itemsCount = Math.floor(Math.random() * 3);
		const items: DayEvent[] = [];

		for (let i = 0; i < itemsCount; i++) {
			items.push({
				id: `${currentDate.getTime()}-${i}`,
				title: `${["Marketing Meeting", "Product Brainstorming", "Checkpoint Calendar Widget (Another checkpoint for the basic calendar widget)", "Code Review", "Daily Standup", "Happy Hour", "End of Sprint"][Math.floor(Math.random() * 6)]}`,
				status: (["info", "success", "warning", "error"] as const)[Math.floor(Math.random() * 4)]
			});
		}

		data.push({
			date: new Date(currentDate),
			items
		});
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return data;
};
