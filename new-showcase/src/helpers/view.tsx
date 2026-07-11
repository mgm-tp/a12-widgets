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

import type { ReactNode, FC, ReactElement } from "react";
import { useState, useMemo, useCallback, useEffect, Fragment } from "react";
import { useLocation, useNavigate } from "react-router";
import { styled, css } from "styled-components";

import {
	Breadcrumb,
	FlyoutMenu,
	SplitView,
	Typography,
	StyledLink,
	StyledMenuMainLayer,
	StyledMenuItem,
	ActionContentbox,
	StyledContentBoxContent,
	provider
} from "@com.mgmtp.a12.widgets/widgets-core";

import { RightNavMenu } from "./template/right-nav-menu.view.js";
import { ShowcaseTypographyHeadline } from "./showcase-typography-headline.js";
import type { Description, GroupSections, Section, Showcase, WidgetInfo } from "./definitions.js";
import { ShowcaseDescription } from "./showcase-description.js";
import { ShowcaseExample } from "./showcase-example.js";
import { ShowcaseExampleToolbar } from "./showcase-example-toolbar.js";
import { ThemeSelector } from "./theme-selector.js";
import { convertPathToBreadcrumbTexts, getHashId, isGroupSection, scrollToHashLink, toLink } from "./utils.js";
import { ShowcaseTypedoc } from "./typedoc.view.js";
import { StyledShowcaseExampleWrapper } from "./showcase-example-content.js";
import { useToast } from "./toast-context.js";

export interface LayoutShowcaseContentBoxProps {
	label: string;
	showcases: Showcase[];
	basePath: string;
	fitToContentArea?: boolean;
	widgetInfo?: WidgetInfo;
	useFullPageLayout?: boolean;
	useLargeView: boolean;
	useFullLayoutWithoutRightNav: boolean;
}

const StyledShowcaseFlyoutMenu = styled(FlyoutMenu)(({ theme }) => {
	const { typography, colors } = theme;

	return css`
		font-size: ${typography.fontSize.lgFontSize};
		${StyledMenuItem} {
			&:before {
				inset: -2px;
			}
		}
		${StyledMenuMainLayer} {
			padding-left: 0;
			border-bottom: 2px solid ${colors.divider.color};
		}
	`;
});

const StyledShowcaseSplitView = styled(SplitView)<{ $fullLayout?: boolean }>(({ $fullLayout }) => {
	return css`
		justify-content: center;
		padding: 40px;

		${$fullLayout &&
		css`
			display: block;
		`}
	`;
});

const StyledShowcaseContentWrapper = styled(SplitView.Area)<{ $fullLayout?: boolean; $hasRightNav?: boolean }>(({
	theme,
	$fullLayout,
	$hasRightNav
}) => {
	const { spacing, horizontalSpacing } = theme.spacing;

	return css`
		display: flex;
		flex-direction: column;

		${!$fullLayout &&
		css`
			gap: ${spacing.spacingSm}px;
			padding: 0 ${horizontalSpacing.horizWhiteSpacing2xl}px;
			width: calc(100% - 2 * ${horizontalSpacing.horizWhiteSpacinglg}px);
			@media (min-width: 1400px) {
				max-width: ${$hasRightNav ? 65 : 100}%;
			}
			@media (max-width: 600px) {
				max-width: unset;
				padding: 0;
			}
		`}
		${StyledLink}:not(${StyledShowcaseExampleWrapper} ${StyledLink}):not(:hover):not(:active):not(:focus) {
			color: #004d75;
		}
	`;
});
const StyledShowcaseBreadcrumb = styled(Breadcrumb)(({ theme }) => {
	const { typography, spacing } = theme;

	return css`
		font-weight: ${typography.fontWeight.semiBoldFontWeight};
		text-transform: capitalize;
		margin-bottom: ${spacing.verticalSpacing.vertWhiteSpacingxs}px;
	`;
});

const StyledShowcaseFullLayoutContent = styled.div<{
	$useDarkBackground?: boolean;
	$isLongContent?: boolean;
}>(({ theme, $useDarkBackground, $isLongContent = true }) => {
	const { colors, spacing } = theme;

	return css`
		box-sizing: border-box;
		background: ${colors.background.secondaryBackground};
		display: flex;
		flex-direction: column;
		height: ${$isLongContent ? "70vh" : "100%"};
		padding: ${spacing.verticalSpacing.vertWhiteSpacingmd}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px;
		width: 100%;

		@media (max-height: 600px) {
			max-height: 500px;
			min-height: 500px;
		}

		@media (max-width: 1200px) {
			padding: ${$useDarkBackground ? spacing.verticalSpacing.vertWhiteSpacingsm : 0}px;
		}

		${$useDarkBackground &&
		css`
			background-color: #dbdfe8;
			border: 1px solid #dbdfe8;
			border-bottom: 0;
			border-radius: 4px 4px 0 0;
		`}
	`;
});

export const StyledShowcaseSplitViewWrapper = styled(ActionContentbox)(({ theme }) => {
	const { typography } = theme;

	return css`
		font-family: inherit;

		& > ${StyledContentBoxContent} {
			background-color: unset;
			font-size: ${typography.fontSize.mediumFontSize};
		}
	`;
});

interface ShowcaseTabProps {
	label: string;
	content?: Section[];
	description?: Description | ReactNode;
}

export const LayoutShowcaseContentBox: FC<LayoutShowcaseContentBoxProps> = (props): ReactElement => {
	const [currentHash, setCurrentHash] = useState("");
	const location = useLocation();
	const navigate = useNavigate();
	const { showToast } = useToast();

	const mapLabelToPath = (label: string, parentPath: string): string => {
		return `${parentPath}/${label.trim().toLowerCase().replace(/\W+/g, "-")}`;
	};

	const mappedShowcases = useMemo(() => {
		return props.showcases.map((showcase) => ({
			...showcase,
			path: props.basePath
		}));
	}, [props.basePath, props.showcases]);

	const showcaseTabs = useMemo((): ShowcaseTabProps[] | undefined => {
		const groupSections = mappedShowcases[0].sections;

		if (isGroupSection(groupSections)) {
			return Object.keys(groupSections).map((key) => {
				const group = groupSections[key as keyof GroupSections];

				return {
					label: group?.label || key,
					content: group?.sections,
					description: group?.description
				};
			});
		}

		return undefined;
	}, [mappedShowcases]);

	const currentTabIndex = useMemo((): number => {
		const subPathname = location.pathname.split("/").pop();

		if (showcaseTabs && showcaseTabs.length > 0 && subPathname === "api") {
			return showcaseTabs.length;
		}

		if (subPathname === "table") {
			return 0;
		}

		const index = showcaseTabs?.findIndex((value) => toLink(value.label) === subPathname) ?? -1;

		return index !== -1 ? index : 0;
	}, [location.pathname, showcaseTabs]);

	useEffect(() => {
		if (location.pathname === props.basePath || location.pathname === `${props.basePath}/`) {
			return;
		}

		if (!location.pathname.startsWith(`${props.basePath}/`)) {
			return;
		}

		const subPathname = location.pathname.slice(props.basePath.length + 1).split("/")[0];

		if (!subPathname) {
			return;
		}

		if (showcaseTabs && showcaseTabs.length > 0) {
			if (subPathname === "api") {
				return;
			}

			if (showcaseTabs.some((tab) => toLink(tab.label) === subPathname)) {
				return;
			}
		}

		showToast({
			variant: "warning",
			header: "Page not found",
			message: `"${subPathname}" doesn't exist — redirected to ${props.basePath}.`
		});
		navigate(props.basePath, { replace: true });
	}, [location.pathname, props.basePath, showcaseTabs, navigate, showToast]);

	const updateScrollToElement = useCallback((): void => {
		if (window.location.hash) {
			const hash = window.location.hash.split("#");

			if (hash.length > 2 && hash[hash.length - 1]) {
				scrollToHashLink(hash[hash.length - 1], hash[hash.length - 1]);
			} else if (hash.length === 2) {
				const sectionId = hash[1].split("/").pop() ?? "";
				scrollToHashLink(hash[1], sectionId);
			}
		}
	}, []);

	const handleTabClick = useCallback(
		(path?: string) => {
			if (path) {
				navigate(path);
			}
		},
		[navigate]
	);

	useEffect(() => {
		updateScrollToElement();

		if (currentHash !== window.location.hash) {
			setCurrentHash(window.location.hash);
		}
		/* eslint-disable react-hooks/exhaustive-deps */
	}, [updateScrollToElement, window.location.hash, currentHash]);

	useEffect(() => {
		document.title = `${props.label} - Widgets Showcase`;
	}, [props.label]);

	const renderBreadcrumb = useCallback((path: string): ReactNode => {
		return (
			<StyledShowcaseBreadcrumb separator="/">
				{convertPathToBreadcrumbTexts(path).map((breadcrumbLabel, index) => {
					return <Breadcrumb.Item key={index}>{breadcrumbLabel}</Breadcrumb.Item>;
				})}
			</StyledShowcaseBreadcrumb>
		);
	}, []);

	const renderLayout = useCallback(
		(currentShowcase: Showcase): ReactNode => {
			const extendedLayout = isGroupSection(currentShowcase.sections) && showcaseTabs;
			const showTypedoc = (!showcaseTabs || currentTabIndex === showcaseTabs.length) && props.widgetInfo?.typedoc;
			const isMobile = provider.isPhone();

			const layoutContent = (
				<StyledShowcaseSplitView id={currentShowcase.path?.split("/").pop()}>
					<StyledShowcaseContentWrapper $hasRightNav={!props.useFullLayoutWithoutRightNav}>
						{currentShowcase.path && renderBreadcrumb(currentShowcase.path)}
						<div>
							<ShowcaseTypographyHeadline path={currentShowcase.path} level={1}>
								{currentShowcase.label}
							</ShowcaseTypographyHeadline>
							<ShowcaseDescription
								featuredWidgets={currentShowcase?.featuredWidgets}
								description={showcaseTabs?.[currentTabIndex]?.description || currentShowcase?.description}
								mainDescription
							/>
						</div>
						{extendedLayout && (
							<StyledShowcaseFlyoutMenu
								type="horizontal"
								items={[
									...showcaseTabs.map((tab, index) => ({
										label: tab.label,
										selected: index === currentTabIndex,
										onClick: (): void => {
											handleTabClick(mapLabelToPath(tab?.label, props.basePath));
										}
									})),
									{
										label: "API",
										selected: currentTabIndex === showcaseTabs.length,
										onClick: (): void => {
											handleTabClick(mapLabelToPath("api", props.basePath));
										}
									}
								]}
								className="-u-width-full"
							/>
						)}
						{mappedShowcases.length > 1 && (
							<FlyoutMenu
								type="horizontal"
								items={mappedShowcases.map((showcase) => ({
									label: showcase.label,
									selected: showcase.path === location.pathname,
									onClick: (): void => {
										handleTabClick(mapLabelToPath(showcase?.label, props.basePath));
									}
								}))}
							/>
						)}
						<Fragment key={isGroupSection(currentShowcase.sections) ? currentTabIndex : undefined}>
							{(isGroupSection(currentShowcase.sections)
								? showcaseTabs?.[currentTabIndex]?.content
								: currentShowcase.sections
							)?.map((section, index) => {
								return (
									<Typography.Section key={index} id={getHashId(section.label || currentShowcase.label)}>
										<ShowcaseExample
											{...section}
											reportLabel={section.label || currentShowcase?.label}
											sectionUrl={
												currentShowcase.path +
												`${
													showcaseTabs?.[currentTabIndex] ? "/" + getHashId(showcaseTabs?.[currentTabIndex].label) : ""
												}`
											}
										/>
									</Typography.Section>
								);
							})}
							{showTypedoc && (
								<ShowcaseTypedoc
									label={currentShowcase.label}
									widgetInfo={props.widgetInfo}
									sectionUrl={
										isGroupSection(currentShowcase.sections) ? currentShowcase.path + "/api" : currentShowcase.path
									}
								/>
							)}
						</Fragment>
					</StyledShowcaseContentWrapper>
					<RightNavMenu
						showcase={currentShowcase}
						sections={
							isGroupSection(currentShowcase.sections)
								? showcaseTabs?.[currentTabIndex]?.content
								: currentShowcase.sections
						}
						groupSectionLabel={
							isGroupSection(currentShowcase.sections) && showcaseTabs?.[currentTabIndex]
								? showcaseTabs?.[currentTabIndex].label
								: undefined
						}
						widgetInfo={props.widgetInfo}
						hideable={props.useFullLayoutWithoutRightNav}
					/>
				</StyledShowcaseSplitView>
			);

			return isMobile ? (
				<StyledShowcaseSplitViewWrapper headingElements={null} padding={false}>
					{layoutContent}
				</StyledShowcaseSplitViewWrapper>
			) : (
				layoutContent
			);
		},
		[currentTabIndex, handleTabClick, props.basePath, props.widgetInfo, showcaseTabs]
	);

	const renderFullLayout = useCallback(
		(currentShowcase: Showcase): ReactNode => {
			const showTypedoc = props.widgetInfo?.typedoc;

			return (
				<StyledShowcaseSplitView id={currentShowcase.path?.split("/").pop()} $fullLayout>
					<StyledShowcaseContentWrapper $fullLayout>
						{currentShowcase.path && renderBreadcrumb(currentShowcase.path)}
						<div>
							<ShowcaseTypographyHeadline path={currentShowcase.path} level={1}>
								{currentShowcase.label}
							</ShowcaseTypographyHeadline>
							<ShowcaseDescription
								description={showcaseTabs?.[currentTabIndex]?.description || currentShowcase?.description}
								featuredWidgets={currentShowcase?.featuredWidgets}
								mainDescription
							/>
						</div>
						{!isGroupSection(currentShowcase.sections) &&
							currentShowcase.sections?.map((section, index) => {
								return (
									<Fragment key={index}>
										{section.content && (
											<StyledShowcaseFullLayoutContent $useDarkBackground={section.useDarkBackground}>
												<ThemeSelector>{section.content}</ThemeSelector>
											</StyledShowcaseFullLayoutContent>
										)}
										<ShowcaseExampleToolbar
											code={section.code}
											label={section.label || currentShowcase.label}
											hideResetButton
											inFullLayoutMode
										/>
									</Fragment>
								);
							})}
						{showTypedoc && <ShowcaseTypedoc label={currentShowcase.label} widgetInfo={props.widgetInfo} />}
					</StyledShowcaseContentWrapper>
				</StyledShowcaseSplitView>
			);
		},
		[currentTabIndex, handleTabClick, props.basePath, props.widgetInfo, showcaseTabs]
	);

	const showcase = mappedShowcases[0];

	return <>{props.useFullPageLayout ? renderFullLayout(showcase) : renderLayout(showcase)}</>;
};
