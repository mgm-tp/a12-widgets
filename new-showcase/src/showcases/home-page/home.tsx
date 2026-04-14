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

import { useState } from "react";
import type { RouterProps } from "react-router";
import { styled, css } from "styled-components";

import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, LayoutGrid, Link, ResponsiveImageContainer, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

import { NewsItems } from "./showcase-news-items.js";

const { Grid, Row, Column } = LayoutGrid;

const StyledWrapperShowcase = styled(Grid)`
	background-color: none;
`;

const StyledSectionShowcase = styled(Row)<{ $flexWrap?: string }>(({ theme, $flexWrap }) => {
	const { spacing, applicationStyles } = theme;
	const { responsive } = applicationStyles;

	return css`
		align-items: center;
		justify-content: space-between;
		margin: 0 auto;
		max-width: 1480px;
		flex-wrap: ${$flexWrap};
		padding: ${spacing.verticalSpacing.vertWhiteSpacing5xl}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px;

		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			flex-direction: column;
		}
	`;
});

const StyledSectionColumn = styled(Column)(({ theme }) => {
	const { responsive } = theme.applicationStyles;

	return css`
		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			text-align: center;
			img {
				max-height: 25rem;
			}
		}
	`;
});

const StyledInnerWrapperShowcase = styled(Row)(({ theme }) => {
	const { spacing } = theme;

	return css`
		gap: ${spacing.verticalSpacing.vertWhiteSpacinglg}px;
	`;
});

const StyledExampleWidgetsImageContainer = styled(ResponsiveImageContainer)(({ theme }) => {
	const { responsive } = theme.applicationStyles;

	return css`
		@media only screen and (max-width: ${responsive.desktopMinWidth}) {
			object-fit: contain;
			object-position: top;
			max-width: 100%;
		}
	`;
});

export function Home(props: RouterProps) {
	const [breakpoint, setBreakpoint] = useState<SizeDetectorProps.BreakPoint | undefined>(undefined);

	const { history } = props;
	const isSmallOrExtraSmallBreakpoint = breakpoint?.size === "sm" || breakpoint?.size === "xs";

	const firstSectionInfoColumn = (
		<StyledSectionColumn size={{ sm: 12, md: 5, lg: 4 }}>
			<StyledInnerWrapperShowcase>
				<Column size={{ sm: 12, md: 12, lg: 12 }} className="">
					<Typography.Headline level={1} ariaLevel={1}>
						A12 Widgets
					</Typography.Headline>
				</Column>
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					A12 Widgets is a comprehensive collection of prebuilt components designed to provide a pleasurable and
					accessible user experience.
				</Column>
				<StyledSectionColumn size={{ sm: 12, md: 12, lg: 12 }}>
					<Button primary label="EXPLORE WIDGETS" onClick={(): void => history.push("/widgets")} />
				</StyledSectionColumn>
				<StyledSectionColumn size={{ sm: 12, md: 12, lg: 12 }}>
					<Link href="https://www.mgm-tp.com/en/solutions/a12/" target="_blank">
						Learn more about A12
					</Link>
				</StyledSectionColumn>
			</StyledInnerWrapperShowcase>
		</StyledSectionColumn>
	);
	const firstSectionImageColumn = (
		<StyledSectionColumn size={{ sm: 12, md: 6, lg: 6 }}>
			<ResponsiveImageContainer src="images/widget-teaser.png" alt="widget teaser" title="widget teaser" />
		</StyledSectionColumn>
	);

	const readyToGetStartedInfoColumn = (
		<StyledSectionColumn size={{ sm: 12, md: 5, lg: 4 }}>
			<StyledInnerWrapperShowcase>
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					<Typography.Headline level={2} ariaLevel={2}>
						Ready to Get Started?
					</Typography.Headline>
				</Column>
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					Discover how A12 Widgets can accelerate your development process and enhance your user experience. Get in
					touch with our team to schedule a demo or learn more about our solutions.
				</Column>
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					<Button
						primary
						label="CONTACT US"
						onClick={() => window.open("https://www.mgm-tp.com/locations.html", "_blank")}
					/>
				</Column>
			</StyledInnerWrapperShowcase>
		</StyledSectionColumn>
	);

	const readyToGetStartedImageColumn = (
		<StyledSectionColumn size={{ sm: 12, md: 6, lg: 6 }}>
			<StyledExampleWidgetsImageContainer
				src="images/sample-application-preview.png"
				alt="contact us illustration"
				title="contact us illustration"
			/>
		</StyledSectionColumn>
	);

	return (
		<StyledWrapperShowcase onBreakPointChanged={setBreakpoint}>
			<StyledSectionShowcase $flexWrap="nowrap">
				{isSmallOrExtraSmallBreakpoint ? firstSectionImageColumn : firstSectionInfoColumn}
				{isSmallOrExtraSmallBreakpoint ? firstSectionInfoColumn : firstSectionImageColumn}
			</StyledSectionShowcase>
			<Row className="-sc-widgets-inspiration-container -u-width-full">
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					<StyledSectionShowcase>
						<StyledSectionColumn size={{ sm: 12, md: 6, lg: 6 }}>
							<StyledExampleWidgetsImageContainer
								src="images/widget-teaser_simple.png"
								alt="widget example usage"
								title="widget example usage"
							/>
						</StyledSectionColumn>

						<StyledSectionColumn size={{ sm: 12, md: 5, lg: 4 }}>
							<StyledInnerWrapperShowcase>
								<Column size={{ sm: 12, md: 12, lg: 12 }}>
									<Typography.Headline level={2} ariaLevel={2}>
										Curious What You Can Do With Our Widgets?
									</Typography.Headline>
								</Column>
								<Column size={{ sm: 12, md: 12, lg: 12 }}>
									Using Widgets can help you to ship your features more quickly. From searching and sorting, to
									pagination and pinning, someone has probably already used Widgets to implement the functionality
									you're looking to add to your app.
								</Column>
								<Column size={{ sm: 12, md: 12, lg: 12 }}>
									<Button primary label="TAKE A LOOK" onClick={(): void => history.push("/examples")} />
								</Column>
							</StyledInnerWrapperShowcase>
						</StyledSectionColumn>
					</StyledSectionShowcase>
				</Column>
			</Row>
			<Row className="-u-width-full">
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					<StyledSectionShowcase>
						{isSmallOrExtraSmallBreakpoint ? readyToGetStartedImageColumn : readyToGetStartedInfoColumn}
						{isSmallOrExtraSmallBreakpoint ? readyToGetStartedInfoColumn : readyToGetStartedImageColumn}
					</StyledSectionShowcase>
				</Column>
			</Row>
			<StyledSectionShowcase>
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					<Typography.Headline level={2} ariaLevel={2}>
						News
					</Typography.Headline>
				</Column>
				<NewsItems />
			</StyledSectionShowcase>
		</StyledWrapperShowcase>
	);
}
