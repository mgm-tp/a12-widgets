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

import type { BaseThemeOptions } from "@com.mgmtp.a12.widgets/widgets-core";

const TILE_COLOR = "#6b28d7";

export const baseFlatOverrides: BaseThemeOptions = {
	spacing: {
		base: 16
	},

	colors: {
		divider: {
			colorBorder: "#a9b3bc"
		}
	},

	components: {
		button: {
			primary: {
				borderRadius: "16px",
				padding: "0 16px"
			},
			secondary: {
				borderRadius: "16px",
				padding: "0 16px"
			},
			invertSecondary: {
				borderRadius: "16px"
			},
			vertical: {
				fontSize: "0.75rem" // tinyFontSize — minimum enforced size
			}
		},

		contentBox: {
			contentBoxBG: "unset",
			contentBoxBorderRadius: "8px",
			heading: {
				borderRadius: "8px 8px 0 0"
			},
			content: {
				borderRadius: "0 0 8px 8px"
			},
			footer: {
				borderRadius: "0 0 8px 8px"
			},
			actionBarGroup: {
				secondLevelPadding: "4px 6px"
			},
			tile: {
				heading: {
					borderBottom: `2px solid ${TILE_COLOR}`
				},
				icon: {
					background: TILE_COLOR
				},
				title: {
					color: TILE_COLOR
				}
			}
		},

		baseInput: {
			input: {
				helperText: {
					lineHeight: 1.25
				},
				popupIconFontSize: "1.125rem" // lgFontSize — minimum icon size
			}
		},

		tabPanel: {
			tab: {
				focus: {
					margin: "0 1px"
				}
			}
		}
	}
};
