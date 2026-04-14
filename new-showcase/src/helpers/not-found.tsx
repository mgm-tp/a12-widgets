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

import { useState, useContext } from "react";
import { styled, css } from "styled-components";
import { useHistory } from "react-router";

import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ResponsiveImageContainer,
	Typography,
	StyledTypographyBody,
	Button,
	Link,
	Icon,
	LayoutGrid,
	provider as DeviceDetector
} from "@com.mgmtp.a12.widgets/widgets-core";

import { getDesktopOperatingSystem } from "./utils.js";
import { GlobalSearchContext } from "./global-search/global-search-context.js";

const { Grid, Row, Column } = LayoutGrid;
const isDesktop = DeviceDetector.isDesktop();

const cmdOrCtrlBasedOnOS = getDesktopOperatingSystem() === "MacOS" ? "Cmd" : "Ctrl";

const StyledRowSection = styled(Row)(({ theme }) => {
	const { spacing, applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		align-items: center;
		padding: ${spacing.verticalSpacing.vertWhiteSpacing5xl}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px;
		@media only screen and (max-width: ${responsive.desktopMinWidth}) {
			padding-top: ${spacing.verticalSpacing.vertWhiteSpacinglg}px;
		}
	`;
});

const StyledLinkContentContainer = styled(Link)(({ theme }) => {
	const { typography, spacing, colors } = theme;

	return css`
		align-items: center;
		display: flex;
		font-size: ${typography.fontSize.bigFontSize};
		justify-content: flex-start;
		margin-bottom: ${spacing.spacing.spacingXs * 2}px;
		width: fit-content;
		div {
			margin-bottom: 0;
		}
		&:focus {
			${StyledTypographyBody} {
				color: ${colors.interaction.active.color};
			}
		}
	`;
});

const StyledNotFoundPageContainer = styled(Grid)(({ theme }) => {
	const { spacing, colors, applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		align-items: center;
		background-color: ${colors.background.primaryBackground};
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 1480px;
		margin: 0 auto;
		min-height: calc(100% - 68px);
		padding: ${spacing.verticalSpacing.vertWhiteSpacing5xl}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px;
		text-align: center;
		${StyledLinkContentContainer}:first-of-type {
			margin-top: ${spacing.spacing.spacingXs + spacing.spacing.spacingSm}px;
		}
		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			padding: ${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px;
		}
		@media only screen and (min-width: ${responsive.tabletMinWidth}) and (max-width: ${responsive.desktopMinWidth}) {
			padding: ${spacing.verticalSpacing.vertWhiteSpacinglg}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px;
		}
	`;
});

const StyledHomeButton = styled(Button)(({ theme }) => {
	const { spacing, applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		display: block;
		margin-bottom: ${spacing.verticalSpacing.vertWhiteSpacing4xl}px;
		padding: ${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px;
		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			margin-bottom: ${spacing.verticalSpacing.vertWhiteSpacinglg}px;
		}
	`;
});

const StyledImageContent = styled(ResponsiveImageContainer)(({ theme }) => {
	const { applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		display: flex;
		justify-content: center;
		max-width: 500px;
		width: 100%;
		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			margin: 0 auto;
			max-width: 300px;
		}
		@media only screen and (min-width: ${responsive.tabletMinWidth}) and (max-width: ${responsive.desktopMinWidth}) {
			margin: 0 auto;
			max-width: 400px;
		}
	`;
});

const StyledSearchContainer = styled.div(({ theme }) => {
	const { colors, typography } = theme;

	return css`
		div {
			margin-bottom: 0;
		}
		a {
			color: ${colors.interaction};
			font-size: ${typography.fontSize.mediumFontSize};
		}
		a:hover {
			color: ${colors.interaction.hover};
		}
		a:active {
			color: ${colors.interaction.active};
		}
	`;
});

const StyledTypographyHeadlineOne = styled(Typography.Headline)(({ theme }) => {
	const { applicationStyles, typography } = theme;
	const { responsive } = applicationStyles;

	return css`
		text-align: left;
		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			font-size: ${typography.fontSize.hugeFontSize};
			text-align: center;
		}
		@media only screen and (min-width: ${responsive.tabletMinWidth}) and (max-width: ${responsive.desktopMinWidth}) {
			font-size: ${typography.fontSize["3XlFontSize"]};
		}
	`;
});

const StyledTypographyHeadlineTwo = styled(Typography.Headline)(({ theme }) => {
	const { applicationStyles, typography } = theme;
	const { responsive } = applicationStyles;

	return css`
		text-align: left;
		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			font-size: ${typography.fontSize.hugeFontSize};
			text-align: center;
		}
		@media only screen and (min-width: ${responsive.tabletMinWidth}) and (max-width: ${responsive.desktopMinWidth}) {
			font-size: ${typography.fontSize["3XlFontSize"]};
		}
	`;
});

const StyledLinkContentText = styled(Typography.Body)(({ theme }) => {
	const { typography } = theme;

	return css`
		font-size: ${typography.fontSize.mediumFontSize};
	`;
});

const StyledMainContentColumn = styled(Column)(({ theme }) => {
	const { applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		text-align: left;
		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			align-items: center;
			display: flex;
			flex-direction: column;
		}
	`;
});

export function NotFound() {
	const [breakpoint, setBreakpoint] = useState<SizeDetectorProps.BreakPoint | undefined>(undefined);
	const { showModal } = useContext(GlobalSearchContext);
	const history = useHistory();

	const MainContentColumn = (
		<StyledMainContentColumn size={{ sm: 12, md: 7, lg: 7 }}>
			<StyledTypographyHeadlineOne level={1} ariaLevel={1}>
				Oops! It looks like that page doesn't exist - Please check the url and try again
			</StyledTypographyHeadlineOne>
			<StyledHomeButton primary onClick={(): void => history.push("/")}>
				Explore our site
			</StyledHomeButton>
			<div className="-u-width-full">
				<StyledTypographyHeadlineTwo level={2} ariaLevel={2}>
					Curious about our Widgets?
				</StyledTypographyHeadlineTwo>
				<StyledLinkContentContainer href="#/get-started">
					<Icon className="-u-margin-r-sm" size="big" title="Arrow Forward">
						arrow_forward
					</Icon>
					<StyledLinkContentText>Take a look how to get started</StyledLinkContentText>
				</StyledLinkContentContainer>
				<StyledLinkContentContainer href="#/basics">
					<Icon className="-u-margin-r-sm" size="big" title="Arrow Forward">
						arrow_forward
					</Icon>
					<StyledLinkContentText>Learn the basics</StyledLinkContentText>
				</StyledLinkContentContainer>
				<StyledLinkContentContainer href="#/widgets">
					<Icon className="-u-margin-r-sm" size="big" title="Arrow Forward">
						arrow_forward
					</Icon>
					<StyledLinkContentText>Check out our main components</StyledLinkContentText>
				</StyledLinkContentContainer>
			</div>
			<StyledSearchContainer>
				<Typography.Body>
					Can't find what you're looking for? Click{" "}
					<Link useAsButton onClick={showModal}>
						search
					</Link>
					{isDesktop ? (
						<>
							{" "}
							or use the keyboard shortcut <strong>{cmdOrCtrlBasedOnOS} + K</strong> to open a search.
						</>
					) : (
						"."
					)}
				</Typography.Body>
			</StyledSearchContainer>
		</StyledMainContentColumn>
	);

	const ImageColumn = (
		<Column size={{ sm: 12, md: 5, lg: 5 }}>
			<StyledImageContent src="images/not-found.png" alt="not found" title="not found" />
		</Column>
	);
	const isSmallOrExtraSmallBreakpoint = breakpoint?.size === "sm" || breakpoint?.size === "xs";

	return (
		<StyledNotFoundPageContainer onBreakPointChanged={setBreakpoint} id="not-found-page">
			<StyledRowSection>
				{isSmallOrExtraSmallBreakpoint ? ImageColumn : MainContentColumn}
				{isSmallOrExtraSmallBreakpoint ? MainContentColumn : ImageColumn}
			</StyledRowSection>
		</StyledNotFoundPageContainer>
	);
}
