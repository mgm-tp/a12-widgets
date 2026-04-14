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

import type { ReactElement, ReactNode } from "react";
import { useState, useRef, useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { styled, css } from "styled-components";

import {
	Icon,
	isElementVisibleInContainer,
	isNotFullyOverlapped,
	isVisibleOnScreen,
	List,
	Link,
	SplitView
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { Section, Showcase, WidgetInfo } from "../definitions.js";
import { getHashId, getNavLinkId, scrollToHashLink } from "../utils.js";

interface RightNavMenuProps {
	showcase: Showcase;
	sections?: Section[];
	groupSectionLabel?: string;
	widgetInfo?: WidgetInfo;
	hideable?: boolean;
}

const StyledShowcaseNavList = styled(List)`
	height: calc(100vh - 116px);
	overflow: auto;
`;

const StyledShowcaseNavMenu = styled(SplitView.Area)<{ $hideable?: boolean }>(({ $hideable }) => {
	return css`
		flex-basis: 250px;
		flex-grow: 0;
		height: fit-content;
		margin-top: 158px;
		position: sticky;
		${$hideable &&
		css`
			display: none;
		`};
		top: 0;
		@media (max-width: 965px) {
			display: none;
		}
		@media (max-width: 1100px) {
			flex-basis: 130px;
			padding-left: 0;
		}
	`;
});

const StyledShowcaseNavItem = styled.li<{ $selected?: boolean; $isLastExample?: boolean }>(
	({ theme, $selected, $isLastExample }) => {
		const { spacing, colors, typography } = theme;

		return css`
			border-left: 2px solid transparent;
			padding: ${spacing.verticalSpacing.vertWhiteSpacing2xs + 2}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px;
			a {
				font-size: ${typography.fontSize.smallFontSize};
			}
			${$isLastExample &&
			css`
				margin-bottom: ${spacing.verticalSpacing.vertWhiteSpacingsm}px;
			`}
			${$selected &&
			css`
				border-left: 2px solid ${colors.interaction.selected.color};
			`}
		`;
	}
);

export function useSectionObserver(sectionIds: string[]): { activeSectionId?: string } {
	const [activeSectionId, setActiveSectionId] = useState<string | undefined>(undefined);
	const previousScrollPosition = useRef(document.scrollingElement?.scrollHeight);
	const scrollUp = useRef(false);

	const scrollHandler = useCallback(() => {
		const containerElement = document.querySelector('[data-role="application-frame-main"]');

		if (!containerElement) {
			return;
		}

		const container = containerElement as HTMLElement;

		if (previousScrollPosition.current) {
			if (previousScrollPosition.current > container.scrollTop) {
				scrollUp.current = true;
			} else {
				scrollUp.current = false;
			}
		}

		previousScrollPosition.current = container.scrollTop;

		const activeSection = sectionIds
			.map((id) => {
				const sectionElement = document.getElementById(id);

				if (!sectionElement || !isNotFullyOverlapped(sectionElement)) {
					return undefined;
				}

				return { sectionElement, id };
			})
			.find(
				(activeSection) =>
					activeSection?.sectionElement &&
					container &&
					isElementVisibleInContainer(
						container,
						activeSection.sectionElement,
						true,
						sectionIds.length > 1 ? 50 : undefined
					)
			);

		if (activeSection?.id) {
			setActiveSectionId(activeSection.id);
		} else if (sectionIds.length <= 1) {
			setActiveSectionId(undefined);

			return;
		} else if (scrollUp.current && activeSectionId) {
			const currentHighlightedSection = document.getElementById(activeSectionId);

			if (currentHighlightedSection && !isElementVisibleInContainer(container, currentHighlightedSection)) {
				setActiveSectionId(sectionIds[sectionIds.findIndex((id) => id === activeSectionId) - 1]);
			}
		}

		// Check if the scrollbar is at the bottom
		if (Math.ceil(container.scrollTop + container.offsetHeight + 1) >= container.scrollHeight) {
			setActiveSectionId(sectionIds[sectionIds.length - 1]);
		}
	}, [activeSectionId, sectionIds]);

	useEffect(() => {
		if (activeSectionId && !sectionIds.includes(activeSectionId) && !sectionIds[0].includes("api")) {
			setActiveSectionId(sectionIds[0]);
		}

		if (activeSectionId && !!document.getElementById(activeSectionId + "-link")) {
			const selectedNavItemElement = document.getElementById(activeSectionId + "-link") as HTMLElement;

			if (!isVisibleOnScreen(selectedNavItemElement)) {
				selectedNavItemElement.scrollIntoView(false);
			}
		}
	}, [activeSectionId, sectionIds]);

	useLayoutEffect(() => {
		window.addEventListener("resize", scrollHandler);
		window.addEventListener("scroll", scrollHandler, true);

		return () => {
			window.removeEventListener("resize", scrollHandler);
			window.removeEventListener("scroll", scrollHandler, true);
		};
	}, [scrollHandler]);

	return { activeSectionId };
}

export function RightNavMenu(props: RightNavMenuProps): ReactElement<RightNavMenuProps> {
	const { groupSectionLabel, sections, widgetInfo, showcase } = props;
	const apiLinkId = useMemo(
		() =>
			!groupSectionLabel && showcase.path && widgetInfo?.typedoc
				? getNavLinkId(getHashId(showcase.label), "api")
				: undefined,
		[groupSectionLabel, widgetInfo?.typedoc, showcase.label, showcase.path]
	);

	const themeConfigurationLinkId = useMemo(
		() =>
			!groupSectionLabel && showcase.path && widgetInfo?.themingConfiguration
				? getNavLinkId(getHashId(showcase.label), "theme-configuration")
				: undefined,
		[groupSectionLabel, widgetInfo?.themingConfiguration, showcase.label, showcase.path]
	);

	const sectionIds = useMemo(
		() => sections?.map((section) => getHashId(section?.label ?? showcase.label)) ?? [],
		[sections, showcase.label]
	);

	if (apiLinkId) {
		sectionIds.push(apiLinkId);
	}

	if (themeConfigurationLinkId) {
		sectionIds.push(themeConfigurationLinkId);
	}

	const { activeSectionId } = useSectionObserver(sectionIds);

	return (
		<StyledShowcaseNavMenu $hideable={props.hideable}>
			{sections && (sections.length > 1 || widgetInfo?.typedoc || widgetInfo?.themingConfiguration) && (
				<StyledShowcaseNavList>
					{sections.map((section, sectionIndex) => {
						const label = section.label ?? showcase.label;
						const anchorTag = getHashId(section?.label ?? showcase.label);
						const linkId = anchorTag + "-link";
						const hash = groupSectionLabel
							? `#${showcase.path}/${getHashId(groupSectionLabel)}#${anchorTag}`
							: `#${showcase.path}#${anchorTag}`;

						return (
							<RightNavMenuItem
								key={sectionIndex}
								label={label}
								linkId={linkId}
								anchorTag={anchorTag}
								hash={hash}
								selected={anchorTag === (activeSectionId ?? sectionIds[0])}
								isLastExample={sectionIndex === sections.length - 1}
							/>
						);
					})}

					{widgetInfo?.typedoc && apiLinkId && (
						<RightNavMenuItem
							label={
								<>
									<Icon>api</Icon> API
								</>
							}
							linkId={`${showcase.label.toLowerCase()}-api-link`}
							anchorTag={apiLinkId}
							hash={`#${showcase.path}#${apiLinkId}`}
							selected={apiLinkId === activeSectionId}
						/>
					)}
					{widgetInfo?.themingConfiguration && themeConfigurationLinkId && (
						<RightNavMenuItem
							label={
								<>
									<Icon>palette</Icon> Theme Configuration
								</>
							}
							linkId={`${showcase.label.toLowerCase()}-theme-configuration-link`}
							anchorTag={themeConfigurationLinkId}
							hash={`#${showcase.path}#${themeConfigurationLinkId}`}
							selected={themeConfigurationLinkId === activeSectionId}
						/>
					)}
				</StyledShowcaseNavList>
			)}
		</StyledShowcaseNavMenu>
	);
}

interface RightNavMenuItemProps {
	label: ReactNode;
	hash: string;
	anchorTag: string;
	selected: boolean;
	linkId?: string;
	isLastExample?: boolean;
}

function RightNavMenuItem(props: RightNavMenuItemProps): ReactElement<RightNavMenuItemProps> {
	const { label, linkId, selected, hash, anchorTag, isLastExample } = props;

	const handleLinkClick = useCallback(() => {
		const currentLocation = window.location.hash.split("#")[1];
		const newLocation = hash.split("#")[1];

		if (currentLocation !== newLocation) {
			window.location.hash = hash;
		} else {
			scrollToHashLink(anchorTag);
		}
	}, [hash, anchorTag]);

	return (
		<StyledShowcaseNavItem $selected={selected} $isLastExample={isLastExample}>
			<Link id={linkId} href={hash} onClick={handleLinkClick}>
				{label}
			</Link>
		</StyledShowcaseNavItem>
	);
}
