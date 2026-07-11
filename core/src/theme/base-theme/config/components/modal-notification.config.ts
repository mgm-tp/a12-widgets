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

import type { BaseThemeCore } from "../../schema.js";

export type ModalNotificationConfigType = {
	closeButton?: {
		background: string;
		color: {
			info: string;
			error: string;
			success: string;
			warning: string;
		};
	};
	icon: { fontSize: string };
	variant: {
		error: string;
		info: string;
		success: string;
		warning: string;
		text: {
			error: string;
			info: string;
			success: string;
			warning: string;
		};
	};
};

export const modalNotificationConfig = (theme: BaseThemeCore): ModalNotificationConfigType => {
	const colors = theme.colors;
	const typography = theme.typography;

	return {
		closeButton: {
			background: "transparent",
			color: {
				info: colors.variant.text.info,
				error: colors.variant.text.error,
				success: colors.variant.text.success,
				warning: colors.variant.text.warning
			}
		},
		icon: {
			fontSize: typography.fontSize.bigFontSize
		},
		variant: {
			error: colors.variant.errorColor,
			info: colors.variant.infoColor,
			success: colors.variant.successColor,
			warning: colors.variant.warningColor,
			text: {
				error: colors.variant.text.error,
				info: colors.variant.text.info,
				success: colors.variant.text.success,
				warning: colors.variant.text.warning
			}
		}
	};
};
