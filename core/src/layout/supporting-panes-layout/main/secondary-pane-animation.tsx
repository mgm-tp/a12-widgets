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

import type { AnimationDefinition, HTMLMotionProps } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import type { HTMLAttributes, ReactNode, Ref, RefObject } from "react";
import { useCallback, useRef, useState } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledSecondaryPane, StyledSecondaryPaneContent } from "./supporting-panes-layout.styled.js";
import type { SupportingPanesLayoutProps } from "./supporting-panes-layout.api.js";
import { useSPLAnimationConfig } from "./supporting-pane-layout-hook.js";

interface SecondaryPaneAnimationProps {
	children: ReactNode;
	width: string;
	position: SupportingPanesLayoutProps.SecondaryPanePosition;
	isExpandingOrCollapsing: RefObject<boolean>;
	isResized: RefObject<boolean>;
	resizeHandleRenderer: (position: SupportingPanesLayoutProps.SecondaryPanePosition) => ReactNode;
	collapsed?: boolean;
	hide?: boolean;
	ref?: Ref<HTMLDivElement>;
	htmlAttributes?: HTMLAttributes<HTMLDivElement>;
}

export const SecondaryPaneAnimation = (props: SecondaryPaneAnimationProps): ReactNode => {
	const {
		hide,
		width,
		children,
		collapsed,
		position,
		resizeHandleRenderer,
		isExpandingOrCollapsing,
		isResized,
		htmlAttributes,
		...rest
	} = props;

	const paneContentRef = useRef<HTMLElement | null>(null);
	const [showContent, setShowContent] = useState(!hide);

	const {
		paneVariants,
		contentVariants,
		SPLAnimationStates: { exit, visible, collapse, hidden, resize }
	} = useSPLAnimationConfig({
		isResized: isResized.current,
		width
	});

	const handleContentRef = (instance: HTMLDivElement | null) => {
		paneContentRef.current = instance;
	};

	const paneContent = showContent ? (
		<>
			{position === "right" && resizeHandleRenderer("right")}
			<StyledSecondaryPaneContent
				key={collapsed ? "collapsed" : "expanded"}
				data-role={DataRoles.SupportingPanesLayout.SecondaryPane.Content}
				ref={handleContentRef}
				variants={contentVariants}
				initial={isResized.current ? false : hidden}
				animate={isResized.current ? resize : isExpandingOrCollapsing.current ? collapse : visible}
			>
				{children}
			</StyledSecondaryPaneContent>
			{position === "left" && resizeHandleRenderer("left")}
		</>
	) : null;

	const handleAnimationComplete = useCallback(
		(definition: AnimationDefinition) => {
			if (definition === "visible" && !showContent) {
				setShowContent(true);
			}

			if (definition === "exit") {
				setShowContent(false);
			}
		},
		[showContent]
	);

	const handleAnimationStart = useCallback(
		(definition: AnimationDefinition) => {
			// For better performance, clear the content as soon as the animation begins.
			if (definition === "exit" && paneContentRef.current) {
				paneContentRef.current.innerText = "";
			}

			if (isResized.current) {
				isResized.current = false;
			}

			isExpandingOrCollapsing.current = false;
		},
		[isExpandingOrCollapsing, isResized]
	);

	return (
		<AnimatePresence initial={false}>
			{!hide && (
				<StyledSecondaryPane
					{...rest}
					{...(htmlAttributes as HTMLMotionProps<"div">)}
					data-role={DataRoles.SupportingPanesLayout.SecondaryPane}
					data-positioning={position}
					onAnimationStart={handleAnimationStart}
					onAnimationComplete={handleAnimationComplete}
					variants={paneVariants}
					animate={visible}
					exit={exit}
					initial={hidden}
					$width={width}
					$position={position}
				>
					{paneContent}
				</StyledSecondaryPane>
			)}
		</AnimatePresence>
	);
};

SecondaryPaneAnimation.displayName = "SecondaryPaneAnimation";
