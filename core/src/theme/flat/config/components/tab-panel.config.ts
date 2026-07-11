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

import type { FlatThemeType } from "../../../schema.js";

import { GeneralFlatColorsConfig } from "../base/colors.config.js";

import { contentBoxFlatConfig } from "./contentbox.config.js";

export const tabPanelFlatConfig = (theme: FlatThemeType) => {
	const { colors } = theme;
	const contentBoxConfigVar = contentBoxFlatConfig(theme);

	return {
		tabs: {
			background: GeneralFlatColorsConfig.blueLight
		},
		groupTab: {
			subGroup: {
				background: colors.background.groupBackground
			},
			divider: {
				background: colors.divider.colorDark
			}
		},
		tab: {
			active: {
				background: "rgba(255,255,255,0.4)",
				borderColor: colors.interaction.active.colorTouch,
				color: colors.interaction.active.colorTouch
			},
			color: colors.interaction.color,
			focus: {
				background: "rgba(255,255,255,0.4)",
				borderColor: colors.interaction.focus.color,
				color: colors.interaction.focus.color
			},
			hover: {
				background: "rgba(255,255,255,0.4)",
				borderColor: colors.interaction.hover.color,
				color: colors.interaction.hover.color
			},
			selected: {
				activeBackground: colors.interaction.active.colorTouchInverted,
				focusBackground: colors.interaction.focus.colorInverted,
				hoverBackground: colors.interaction.hover.colorInverted
			},
			highlighted: {
				activeBackground: colors.interaction.active.colorTouchInverted,
				focusBackground: colors.interaction.focus.colorInverted,
				hoverBackground: colors.background.primaryBackground
			}
		},
		header: {
			heading: {
				fontSize: contentBoxConfigVar.title.fontSize,
				padding: `${contentBoxConfigVar.heading.paddingTop} ${contentBoxConfigVar.heading.paddingLeft} ${contentBoxConfigVar.heading.paddingBottom} ${contentBoxConfigVar.heading.paddingRight}`
			}
		}
	};
};
