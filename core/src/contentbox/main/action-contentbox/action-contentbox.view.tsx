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

import type { ReactElement } from "react";
import { createContext, useContext, useRef, useCallback, useEffect } from "react";

import { useElementSizeDetector, useWindowSize } from "../../../layout/size-detector/main/size-detector.view.js";
import { SizeDetectorUtils } from "../../../layout/size-detector/main/size-detector.utils.js";
import { ContentBox, ContentBoxElements } from "../../main/template/contentbox.tpl.view.js";

import type { ActionContentboxProps, NavigationContentboxContextType } from "./action-contentbox.api.js";
import { Heading, SubHeading } from "./action-contentbox.internal.js";

export const NavigationContentboxContext = createContext<NavigationContentboxContextType>({});

export function ActionContentbox({
	ariaLabel,
	boxShadow,
	breadcrumbs,
	buttons,
	children,
	className,
	contentRef,
	embedded,
	footer,
	headingButtons,
	headingElements,
	headingPrefixes,
	hideWizardBarOnScroll,
	id,
	key,
	listenToNavigationContext,
	listenToWindowSize = true,
	navigation,
	notificationArea,
	onBlur,
	onFocus,
	onKeyDown,
	onSizeChange,
	padding,
	role,
	style,
	subActionBar,
	tabIndex,
	wizardBar,
	wrapperRef,
	componentRenderers
}: ActionContentboxProps): ReactElement<ActionContentboxProps> {
	const navigationContext = useContext(NavigationContentboxContext);
	const wrapperElement = useRef<HTMLDivElement | null>(null);

	const onBackButtonClicked = listenToNavigationContext ? navigationContext.onBackButtonClicked : undefined;
	const backButton = onBackButtonClicked ? <ContentBoxElements.BackButton onClick={onBackButtonClicked} /> : undefined;

	const onCloseButtonClicked = listenToNavigationContext ? navigationContext.onCloseButtonClicked : undefined;
	const closeButton = onCloseButtonClicked ? (
		<ContentBoxElements.CloseButton onClick={onCloseButtonClicked} />
	) : undefined;

	const { breakPoint: windowBreakPoint } = useWindowSize();

	const { breakPoint: elementBreakPoint } = useElementSizeDetector({
		targetRef: wrapperElement
	});

	const breakPoint = listenToWindowSize ? windowBreakPoint : elementBreakPoint;
	const smSize = breakPoint.width <= SizeDetectorUtils.DefaultBreakPoints[1].width;

	const getWrapperRef = useCallback(
		(ref: HTMLDivElement | null) => {
			wrapperElement.current = ref;
			wrapperRef?.(ref);
		},
		[wrapperRef]
	);

	useEffect(() => {
		onSizeChange?.(breakPoint);
	}, [breakPoint, onSizeChange]);

	return (
		<ContentBox
			wrapperRef={getWrapperRef}
			contentRef={contentRef}
			id={id}
			key={key}
			className={className}
			style={style}
			heading={
				componentRenderers?.heading ||
				((headingElements || (smSize && buttons) || headingPrefixes || headingButtons) && (
					<Heading
						id={id && `${id}--heading`}
						compact={smSize}
						buttons={buttons}
						headingPrefixes={
							backButton ? (
								<>
									{backButton}
									{headingPrefixes}
								</>
							) : (
								headingPrefixes
							)
						}
						headingElements={headingElements}
						headingButtons={
							closeButton ? (
								<>
									{headingButtons}
									{closeButton}
								</>
							) : (
								headingButtons
							)
						}
					/>
				))
			}
			notificationArea={notificationArea}
			subHeading={
				(breadcrumbs || (!smSize && buttons) || navigation || subActionBar) && (
					<SubHeading
						id={id && `${id}--subheading`}
						breadcrumbs={breadcrumbs}
						buttons={buttons}
						subActionBar={subActionBar}
						compact={smSize}
						navigation={navigation}
					/>
				)
			}
			wizardBar={wizardBar}
			hideWizardBarOnScroll={hideWizardBarOnScroll}
			footer={footer}
			padding={padding}
			boxShadow={boxShadow}
			onBlur={onBlur}
			onFocus={onFocus}
			onKeyDown={onKeyDown}
			embedded={embedded}
			role={role}
			ariaLabel={ariaLabel}
			tabIndex={tabIndex}
		>
			{children}
		</ContentBox>
	);
}

ActionContentbox.displayName = "ActionContentbox";
