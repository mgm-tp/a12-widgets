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

import type { CustomAnimationConfig } from "../../../layout/supporting-panes-layout/main/supporting-panes-layout.api.js";

export const contentBoxSidePanelAnimation = ({
	width,
	paneDuration,
	contentDuration,
	maxWidth,
	minWidth,
	isSmallSize
}: {
	width: string;
	paneDuration: number;
	contentDuration: number;
	maxWidth: number;
	minWidth: number;
	isSmallSize?: boolean;
}): CustomAnimationConfig => {
	return {
		paneVariants: {
			hidden: {
				width: 0
			},
			visible: {
				opacity: 1,
				width: width,
				transition: {
					width: {
						duration: paneDuration,
						ease: [0.22, 0.88, 0.33, 1.05]
					}
				},
				transitionEnd: {
					...(!isSmallSize && { maxWidth: `${maxWidth}px`, minWidth: `${minWidth}px` })
				}
			},
			exit: {
				width: 0,
				minWidth: 0,
				maxWidth: 0,
				opacity: 0,
				transition: {
					width: { duration: paneDuration / 2, ease: [0.22, 1, 0.36, 1] }
				}
			}
		},
		contentVariants: {
			visible: {
				opacity: 1,
				transition: {
					delay: contentDuration,
					ease: "linear"
				}
			},
			exit: {
				opacity: 0,
				transition: {
					delay: contentDuration,
					ease: "linear"
				}
			}
		}
	};
};
