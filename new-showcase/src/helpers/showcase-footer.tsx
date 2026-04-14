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
import { styled, css } from "styled-components";

import { Link } from "@com.mgmtp.a12.widgets/widgets-core";

const FOOTER_COLORS = {
	background: "#000000",
	bottomBackground: "#4a5568"
};
const MAX_CONTENT_WIDTH = "1440px";
const SOCIAL_LINKS = [
	{ href: "https://www.mgm-tp.com/en/insights/", label: "mgm insights" },
	{ href: "https://www.linkedin.com/company/mgm-technology-partners-gmbh/posts/?feedView=all", label: "LinkedIn" },
	{ href: "https://www.xing.com/pages/mgmtechnologypartnersgmbh", label: "Xing" },
	{ href: "https://www.kununu.com/de/mgm-technology-partners", label: "kununu" },
	{ href: "https://www.youtube.com/c/mgmtechnologypartners", label: "YouTube" }
];
const PODCAST_LINKS = [
	{ href: "https://podcasts.apple.com/de/podcast/working-in-it-by-mgm/id1670920296", label: "Apple Podcasts" },
	{
		href: "https://open.spotify.com/show/4lWYAqZZfLaUNF00TNRJkr?si=143b73d11691444e&nd=1&dlsi=c5264a1f217045a8",
		label: "Spotify"
	}
];
const PARTNER_LINKS = [
	{ href: "https://www.mgm-cp.com/", label: "mgm consulting partners" },
	{ href: "https://www.mgm-ip.com/", label: "mgm integration partners" },
	{ href: "https://www.mgm-sp.com/", label: "mgm security partners" }
];

const FOOTER_LINKS = [
	{ href: "https://www.mgm-tp.com/en/imprint/", label: "Imprint" },
	{ href: "https://www.mgm-tp.com/en/data-privacy/", label: "Privacy Policy" },
	{ href: "https://www.mgm-tp.com/en/terms-and-conditions/", label: "T&CP" },
	{ href: "https://www.mgm-tp.com/en/certifications/", label: "Certifications" },
	{ href: "https://www.mgm-tp.com/en/compliance/", label: "Compliance" },
	{ href: "https://www.mgm-tp.com/en/code-of-conduct/", label: "Code of Conduct" }
];

const StyledLink = styled(Link)(
	({ theme }) => css`
		color: ${theme.colors.text.invertedColor};

		&:hover {
			text-decoration: underline;
		}
	`
);

const StyledFooter = styled.div(({ theme }) => {
	const { spacing, applicationStyles, colors } = theme;
	const { responsive } = applicationStyles;

	return css`
		background-color: ${FOOTER_COLORS.background};
		color: ${colors.text.invertedColor};
		width: 100%;
		padding: ${spacing.verticalSpacing.vertWhiteSpacing3xl}px 0 0;

		@media only screen and (max-width: ${responsive.desktopMinWidth}) {
			padding: ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0 0;
		}
	`;
});

const FooterInner = styled.div(({ theme }) => {
	const { applicationStyles, spacing } = theme;
	const { responsive } = applicationStyles;

	return css`
		max-width: ${MAX_CONTENT_WIDTH};
		margin: 0 auto;
		padding: ${spacing.horizontalSpacing.horizWhiteSpacinglg}px;
		display: flex;
		flex-direction: column;
		gap: ${spacing.verticalSpacing.vertWhiteSpacingmd}px;

		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			gap: ${spacing.verticalSpacing.vertWhiteSpacing2xl}px;
		}
	`;
});

const FooterLogo = styled.div(({ theme }) => {
	const { applicationStyles, spacing } = theme;
	const { responsive } = applicationStyles;

	return css`
		width: ${spacing.spacing.spacingLg * 2}px;
		grid-column: 4;
		grid-row: 1;
		align-self: start;

		@media only screen and (max-width: ${responsive.desktopMinWidth}) {
			grid-column: 2;
		}

		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			order: 3;
			grid-column: auto;
			grid-row: auto;
		}

		img {
			width: 100%;
			height: auto;
		}
	`;
});

const FooterTop = styled.div(({ theme }) => {
	const { responsive } = theme.applicationStyles;
	const { spacing } = theme;

	return css`
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: auto 1fr;
		gap: ${spacing.spacing.spacingLg * 1.2}px;
		row-gap: ${spacing.spacing.spacingSm}px;

		@media only screen and (max-width: ${responsive.desktopMinWidth}) {
			grid-template-columns: repeat(2, 1fr);
			gap: ${spacing.spacing.spacingLg}px;
			row-gap: ${spacing.spacing.spacingSm}px;
		}

		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			display: flex;
			flex-direction: column;
			gap: ${spacing.spacing.spacingLg}px;
		}
	`;
});

const FooterSectionBase = styled.div(({ theme }) => {
	const { applicationStyles, spacing } = theme;
	const { responsive } = applicationStyles;

	return css`
		grid-row: 2;

		h3 {
			font-size: 0.8rem;
			font-weight: 900;
			margin-bottom: ${spacing.spacing.spacingSm}px;
			letter-spacing: 0.5px;
			margin-top: 0;
		}

		p,
		a {
			font-size: 0.8rem;
			font-weight: 500;
			line-height: 1.6;
			margin: 4px 0;
		}

		a {
			color: #fff !important;
		}

		img {
			max-width: 280px;
			height: auto;

			@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
				max-width: 200px;
			}
		}

		@media only screen and (max-width: ${responsive.mobileMaxWidth}) {
			grid-row: auto;
		}
	`;
});

const AddressSection = styled(FooterSectionBase)`
	@media only screen and (max-width: ${({ theme }) => theme.applicationStyles.responsive.mobileMaxWidth}) {
		order: 1;
	}
`;

const SocialSection = styled(FooterSectionBase)`
	@media only screen and (max-width: ${({ theme }) => theme.applicationStyles.responsive.mobileMaxWidth}) {
		order: 5;
	}
`;

const PodcastSection = styled(FooterSectionBase)`
	@media only screen and (max-width: ${({ theme }) => theme.applicationStyles.responsive.mobileMaxWidth}) {
		order: 2;
	}
`;

const PartnersSection = styled(FooterSectionBase)(({ theme }) => {
	const { spacing } = theme;

	return css`
		grid-column: 4;

		@media only screen and (max-width: ${theme.applicationStyles.responsive.desktopMinWidth}) {
			grid-column: 2;
		}

		@media only screen and (max-width: ${theme.applicationStyles.responsive.mobileMaxWidth}) {
			order: 4;
			grid-column: auto;
		}

		h3 {
			font-size: 1rem;
			margin-bottom: ${spacing.spacing.spacingXs}px;
		}
	`;
});

const SpacedParagraph = styled.p<{ $marginTop?: string }>`
	margin-top: ${({ $marginTop }) => $marginTop ?? "0"} !important;
`;

const PartnerImage = styled.img`
	width: 180px;
	height: auto;
`;

const FooterBottom = styled.div(({ theme }) => {
	const { spacing } = theme;

	return css`
		background-color: ${FOOTER_COLORS.bottomBackground};
		width: 100%;
		margin-top: ${spacing.spacing.spacingLg}px;
		min-height: 100px;
		font-size: 0.8rem;
		font-weight: 500;

		@media only screen and (min-width: ${theme.applicationStyles.responsive.desktopMinWidth}) {
			font-size: 0.8rem;
		}
	`;
});

const FooterBottomInner = styled.div(({ theme }) => {
	const { spacing } = theme;

	return css`
		max-width: ${MAX_CONTENT_WIDTH};
		margin: 0 auto;
		padding: ${spacing.spacing.spacingMd}px ${spacing.horizontalSpacing.horizWhiteSpacinglg}px;
		display: flex;
		flex-direction: column;
		gap: ${spacing.spacing.spacingSm}px;
		justify-content: center;
		min-height: 100px;
		box-sizing: border-box;
	`;
});

const FooterLinks = styled.div(({ theme }) => {
	return css`
		display: flex;
		flex-wrap: wrap;
		gap: 0;

		${StyledLink} {
			color: ${theme.colors.text.invertedColor};
			font-size: 0.8rem;
		}
	`;
});

const LinkSeparator = styled.span`
	margin: 0 4px;
`;

const FooterBottomRow = styled.div(() => {
	return css`
		display: flex;
		justify-content: flex-start;
		align-items: center;
	`;
});

const CompanyName = styled.span(
	({ theme }) => css`
		color: ${theme.colors.text.invertedColor};
		text-decoration: none;
	`
);

export function ShowcaseFooter(): ReactElement {
	const currentYear = new Date().getFullYear();

	return (
		<StyledFooter>
			<FooterInner>
				<FooterTop>
					<AddressSection>
						<h3>mgm technology partners</h3>
						<p>Taunusstraße 23</p>
						<p>80807 München</p>
						<SpacedParagraph $marginTop="12px">Phone +49 89-358 680-0</SpacedParagraph>
						<p>Email info@mgm-tp.com</p>
						<SpacedParagraph $marginTop="12px">
							<StyledLink href="https://www.mgm-tp.com/locations.html" target="_blank">
								Locations & Contact
							</StyledLink>
						</SpacedParagraph>
					</AddressSection>
					<SocialSection>
						{SOCIAL_LINKS.map(({ href, label }) => (
							<p key={href}>
								<StyledLink href={href} target="_blank">
									{label}
								</StyledLink>
							</p>
						))}
					</SocialSection>
					<PodcastSection>
						<p>Working in IT Podcast:</p>
						{PODCAST_LINKS.map(({ href, label }) => (
							<p key={href}>
								<StyledLink href={href} target="_blank">
									{label}
								</StyledLink>
							</p>
						))}
					</PodcastSection>
					<FooterLogo>
						<img src="images/mgm-logo.svg" alt="mgm logo" />
					</FooterLogo>
					<PartnersSection>
						<h3>mgm technology partners</h3>
						{PARTNER_LINKS.map(({ href, label }) => (
							<p key={href}>
								<StyledLink href={href} target="_blank">
									{label}
								</StyledLink>
							</p>
						))}
						<SpacedParagraph $marginTop="16px">
							<PartnerImage src="images/Farben.mgm.png" alt="mgm colors" />
						</SpacedParagraph>
						<div>Innovation Implemented.</div>
					</PartnersSection>
				</FooterTop>
			</FooterInner>
			<FooterBottom>
				<FooterBottomInner>
					<FooterLinks>
						{FOOTER_LINKS.map(({ href, label }, index) => (
							<span key={href}>
								<StyledLink href={href} target="_blank">
									{label}
								</StyledLink>
								{index < FOOTER_LINKS.length - 1 && <LinkSeparator>|</LinkSeparator>}
							</span>
						))}
					</FooterLinks>
					<FooterBottomRow>
						<CompanyName>&copy; {currentYear} mgm technology partners GmbH</CompanyName>
					</FooterBottomRow>
				</FooterBottomInner>
			</FooterBottom>
		</StyledFooter>
	);
}
