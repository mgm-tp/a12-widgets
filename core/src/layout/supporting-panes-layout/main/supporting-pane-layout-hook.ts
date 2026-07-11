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

import { useTheme } from "styled-components";
import type { BezierDefinition, Variants } from "framer-motion";

import { getTransitionDuration } from "../../../common/main/utils/css-utils.js";

import type { CustomAnimationConfig } from "./supporting-panes-layout.api.js";

interface SPLAnimationConfigProps {
	width: string;
	isResized?: boolean;
	customAnimation?: CustomAnimationConfig;
}

/**
 * @internal
 * A custom hook that provides animation configurations for the SPL.
 * It defines animation variants and states for the pane and its content,
 * based on the provided width and whether the pane is resized.
 *
 * @param width - The width of the pane as a string (e.g., "300px").
 * @param isResized - A boolean indicating if the pane is being resized.
 * @param customAnimation - Optional custom animation configuration that overrides the default SPL animation.
 *
 * @returns An object containing:
 * - `paneVariants`: Animation variants for the pane.
 * - `contentVariants`: Animation variants for the pane's content.
 * - `SPLAnimationStates`: A set of predefined animation states.
 */
export const useSPLAnimationConfig = ({ width, isResized, customAnimation }: SPLAnimationConfigProps) => {
	const { transitionDuration } = useTheme().components.supportingPanesLayout;

	const duration = getTransitionDuration(transitionDuration);
	const SPLAnimationStates = {
		visible: "visible",
		collapse: "collapse",
		hidden: "hidden",
		exit: "exit",
		resize: "resize"
	};

	if (customAnimation) {
		return {
			paneVariants: customAnimation.paneVariants,
			contentVariants: customAnimation.contentVariants,
			SPLAnimationStates
		};
	}

	const squashEffect: BezierDefinition = [0.17, 0.88, 0.33, 1.13];
	const paneVariants: Variants = {
		hidden: { scaleX: 0, opacity: 0, width: 0 },
		visible: {
			scaleX: 1,
			opacity: 1,
			width: width,
			transition: {
				width: { duration: isResized ? 0 : duration, ease: squashEffect },
				duration: isResized ? 0 : duration * 1.5,
				ease: squashEffect
			}
		},
		exit: {
			width: 0,
			scaleX: 0,
			opacity: 0,
			transition: {
				duration: duration,
				ease: [0.17, 0.12, 0.67, 0.87] // Smooth ease-out curve
			}
		}
	};
	const contentVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: [0, 1],
			transition: { ease: "easeIn" }
		},
		collapse: {
			opacity: 1,
			transition: { ease: "easeIn", delay: duration }
		},
		resize: { opacity: 1, transition: { duration: 0 } }
	};

	return { paneVariants, contentVariants, SPLAnimationStates };
};
