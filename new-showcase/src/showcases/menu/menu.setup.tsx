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

import type { MenuItem, MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export const items: MenuItem[] = [
	{
		label: "1",
		className: "additional-class",
		items: [
			{
				label: "1.1",
				className: "additional-class",
				icon: <Icon>cake</Icon>
			},
			{ label: "1.2", icon: <Icon>card_giftcard</Icon> },
			{
				label: "1.3",
				icon: <Icon>local_florist</Icon>,
				disabled: true
			}
		],
		icon: <Icon>dvr</Icon>
	},
	{ label: "2" },
	{
		label: "3",
		disabled: true
	},
	{
		label: "4 with very long label that will not fit in there",
		items: [
			{
				label: "First",
				items: [
					{ label: "1st Menu" },
					{ label: "2nd Menu" },
					{ label: "3rd Menu" },
					{ label: "4th Menu" },
					{ label: "5th Menu" },
					{ label: "6th Menu" },
					{ label: "7th Menu" }
				]
			},
			{
				label: "Second",
				disabled: true
			},
			{
				label: "Third",
				items: [
					{ label: "3.1st Menu", selected: true },
					{ label: "3.2nd Menu" },
					{ label: "3.3rd Menu" },
					{ label: "3.4th Menu" },
					{ label: "3.5th Menu" },
					{ label: "3.6th Menu" }
				]
			},
			{
				label: "K Menu",
				items: [
					{ label: "A Menu" },
					{ label: "B Menu" },
					{ label: "C Menu" },
					{ label: "D Menu" },
					{ label: "E Menu" },
					{ label: "F Menu" }
				]
			}
		]
	},
	{ label: "Settings", icon: <Icon>settings</Icon>, title: "Settings", labelHidden: true },
	{ label: "X Menu" },
	{ label: "Y Menu" },
	{
		label: "Z Menu",
		icon: <Icon>screen_lock_portrait</Icon>,
		items: [
			{
				label: "Z.1 Menu"
			},
			{
				label: "Z.2 Menu",
				disabled: true
			},
			{
				label: "Z.3 Menu",
				disabled: true
			}
		]
	}
];

export const itemsWithCustomBackwardItem: MenuItem[] = [
	{
		label: "1",
		className: "additional-class",
		items: [
			{
				label: "1.1",
				className: "additional-class",
				icon: <Icon>cake</Icon>
			},
			{ label: "1.2", icon: <Icon>card_giftcard</Icon> },
			{
				label: "1.3",
				icon: <Icon>local_florist</Icon>,
				disabled: true
			}
		],
		backwardItemProps: {
			label: "Back to Group 1",
			icon: <Icon>arrow_back</Icon>
		},
		icon: <Icon>dvr</Icon>
	},
	{ label: "2" },
	{
		label: "3",
		disabled: true
	},
	{
		label: "4 with very long label that will not fit in there",
		items: [
			{
				label: "First"
			},
			{
				label: "Second",
				disabled: true
			},
			{
				label: "Third"
			},
			{
				label: "K Menu"
			}
		],
		backwardItemProps: {
			label: "Back to Group 4",
			icon: <Icon>arrow_back</Icon>
		}
	}
];

export const itemWithMixGroups: MenuItemType[] = [
	{
		type: "group",
		id: "group-1",
		label: "Group 1",
		items: [
			{
				label: "1",
				className: "additional-class",
				items: [
					{
						label: "1.1",
						className: "additional-class",
						icon: <Icon>cake</Icon>,
						items: [
							{
								label: "1.1.2",
								icon: <Icon>card_giftcard</Icon>
							},
							{ label: "1.1.3", icon: <Icon>card_giftcard</Icon> }
						]
					},
					{ label: "1.2", icon: <Icon>card_giftcard</Icon> },
					{
						label: "1.3",
						icon: <Icon>local_florist</Icon>,
						disabled: true
					}
				],
				icon: <Icon>dvr</Icon>
			},
			{
				label: "2"
			}
		]
	},
	{
		type: "group",
		id: "group-2",
		label: "Group 2",
		items: [
			{
				label: "3",
				disabled: true
			},
			{
				label: "4 with very long label that will not fit in there",
				items: [
					{
						type: "group",
						label: "Group 2.1",
						items: [
							{
								label: "First",
								items: [
									{ label: "1st Menu" },
									{ label: "2nd Menu" },
									{ label: "3rd Menu" },
									{
										type: "group",
										label: "First Group",
										items: [{ label: "4th Menu" }, { label: "5th Menu" }, { label: "6th Menu" }, { label: "7th Menu" }]
									}
								]
							},
							{
								label: "Second",
								disabled: true
							}
						]
					},
					{
						type: "group",
						label: "Group 2.2",
						items: [
							{
								label: "Third",
								items: [
									{ label: "3.1st Menu", selected: true },
									{ label: "3.2nd Menu" },
									{ label: "3.3rd Menu" },
									{ label: "3.4th Menu" },
									{ label: "3.5th Menu" },
									{ label: "3.6th Menu" }
								]
							},
							{
								label: "K Menu",
								items: [
									{ label: "A Menu" },
									{ label: "B Menu" },
									{ label: "C Menu" },
									{ label: "D Menu" },
									{ label: "E Menu" },
									{ label: "F Menu" }
								]
							}
						]
					}
				]
			}
		]
	},
	{
		type: "group",
		id: "group-3",
		label: "Group 3",
		items: [
			{
				label: "Settings",
				icon: <Icon>settings</Icon>,
				title: "Settings",
				labelHidden: true
			},
			{
				label: "X Menu"
			}
		]
	},
	{
		type: "group",
		id: "group-4",
		label: "Group 4",
		items: [
			{
				label: "Y Menu"
			},
			{
				label: "Z Menu",
				icon: <Icon>screen_lock_portrait</Icon>,
				items: [
					{
						label: "Z.1 Menu"
					},
					{
						label: "Z.2 Menu",
						disabled: true
					},
					{
						label: "Z.3 Menu",
						disabled: true
					}
				]
			}
		]
	}
];

export const longListItems: MenuItem[] = [
	{
		label: "1",
		items: [
			{
				label: "1.1",
				icon: <Icon>cake</Icon>
			},
			{ label: "1.2" },
			{
				label: "1.3",
				disabled: true
			}
		],
		icon: <Icon>dvr</Icon>
	},
	{ label: "2" },
	{
		label: "3",
		disabled: true
	},
	{
		label: "4 with very long label that will not fit in there",
		items: [
			{
				label: "4.1",
				items: [{ label: "4.1.1" }, { label: "4.1.2" }]
			},
			{
				label: "4.2",
				disabled: true
			}
		]
	},
	{ label: "A Menu" },
	{ label: "B Menu" },
	{ label: "C Menu" },
	{ label: "D Menu" },
	{ label: "5 Menu" },
	{ label: "6 Menu" },
	{ label: "7 Menu" },
	{ label: "E Menu" },
	{ label: "F Menu" },
	{ label: "X Menu", selected: true },
	{ label: "T Menu" },
	{ label: "U Menu" },
	{ label: "V Menu" },
	{ label: "S Menu" },
	{ label: "Y Menu" },
	{
		label: "Z Menu",
		icon: <Icon>screen_lock_portrait</Icon>
	}
];
