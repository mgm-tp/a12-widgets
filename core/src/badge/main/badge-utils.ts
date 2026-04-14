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

import type { BadgeProps } from "../../badge/main/badge.api.js";
import type { BadgeTitles } from "../../common/main/a11y-localization/a11y-key-definition.api.js";

export function getBadgeTitle(badge: BadgeProps, a11yTitles?: BadgeTitles): string | undefined {
	const { title, variant, tiny, count } = badge;

	const titlesMap = {
		warning: tiny ? a11yTitles?.tinyWarning : a11yTitles?.warning,
		error: tiny ? a11yTitles?.tinyError : a11yTitles?.error,
		success: tiny ? a11yTitles?.tinySuccess : a11yTitles?.success,
		default: tiny ? a11yTitles?.tinyInfo : a11yTitles?.info
	};

	const customTitle = titlesMap[variant as keyof typeof titlesMap] || titlesMap.default;
	const badgeContentTitle = count ? `${count} ${customTitle}` : customTitle;

	return title ?? badgeContentTitle;
}
