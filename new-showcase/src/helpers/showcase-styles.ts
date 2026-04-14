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

import { rgba } from "polished";
import { styled, createGlobalStyle, css } from "styled-components";

import { BulletList, Link, ExternalLink } from "@com.mgmtp.a12.widgets/widgets-core";

export const ShowcaseStyles = createGlobalStyle`
      ${({ theme }) => {
				const { colors, typography, spacing } = theme;

				return css`
					@supports (font: -apple-system-body) {
						html {
							font: -apple-system-body;
						}
					}
					//Viets Customizations - Should be integrated in overall theming later
					[data-role="application-frame-sidebar"] {
						.accordion__summary:hover {
							background: #f1f1f1;

							.accordion__text {
								font-weight: 500;
							}
						}
					}
					.nav__label {
						font-weight: 500;
					}
					.negative-margin {
						margin-left: -100px;
					}

					// Viet Ende
					.-sc {
						/* Helper Flexbox */

						&-helper {
							&-flexbox {
								max-width: 638px;

								&--vertical {
									height: 150px;

									.-sc-helper-flexbox__container {
										height: 100%;
									}
								}

								&__container {
									background-color: ${colors.background.primaryBackground};
								}

								&__item {
									background-color: ${colors.background.tertiaryBackground};
									color: ${colors.text.color};
									margin: calc(0.5 * ${typography.fontSize.mediumFontSize});
									padding: calc(0.5 * ${typography.fontSize.mediumFontSize}) ${typography.fontSize.mediumFontSize};
									text-align: center;
								}
							}

							&-font__medium {
								font-size: ${typography.fontSize.hugeFontSize};
							}

							&-font__large {
								font-size: ${typography.fontSize["4XlFontSize"]};
							}

							&-border {
								border: 1px solid ${colors.divider.color};
							}
						}

						/* Footer */

						&-footer {
							img {
								width: 64px;
							}
						}

						/* Common */

						&-margin,
						&-padding {
							&__wrapper {
								background-color: ${colors.background.tertiaryBackground};
							}

							&__content {
								background-color: ${colors.background.primaryBackground};
								border: 2px solid ${colors.divider.colorDark};
								height: ${spacing.spacing.spacingLg}px;
								line-height: ${typography.fontSize.hugeFontSize};
								text-align: center;
								width: ${spacing.spacing.spacing2Xl}px;
							}
						}

						&-margin__wrapper {
							display: inline-flex;

							&--negative {
								padding: ${spacing.horizontalSpacing.horizWhiteSpacingmd}px;
							}
						}

						&-padding {
							&__wrapper {
								display: inline-block;
							}

							&__content {
								box-sizing: content-box;
								background-clip: content-box;
							}
						}
						&-color {
							&-secondary {
								color: ${colors.text.secondaryColorDark};
							}

							&-success {
								color: ${colors.variant.successColor};
							}

							&-error {
								color: ${colors.variant.errorColor};
							}

							&-warning {
								color: ${colors.variant.warningColor};
								&--light {
									color: ${colors.variant.warningColorLight};
								}
							}
						}

						&-helper-border {
							border: 1px solid ${colors.divider.color};
						}

						&-helper-border--bottom {
							border-bottom: 1px solid ${colors.divider.color};
						}

						&-helper-border--top {
							border-top: 1px solid ${colors.divider.color};
						}

						&-widgets-inspiration-container {
							background-color: #f6f5f6;
						}

						&-background {
							&-primary {
								background-color: ${colors.background.primaryBackground};
							}

							&-secondary {
								background-color: ${colors.background.secondaryBackground};
							}
						}

						/* HELPER SHOWCASE */
						&-flat__margin-top {
							margin-top: 24px;
						}

						/* SEMANTIC COLOR */
						&-secondary-color {
							background-color: ${colors.secondaryColor};
						}
						&-nav-showcase-label {
							margin-top: ${spacing.spacing.spacingXs}px;
							margin-bottom: ${spacing.spacing.spacingXs}px;
						}

						/* STYLE FOR LOGIN PAGE */
						&-login-page {
							height: calc(100% + 48px);
							margin: -24px;
						}

						&-list--custom-width {
							width: 160px;
						}

						&-focus:focus {
							outline: ${colors.interaction.focus.color} dotted 2px;
						}

						/* STYLE FOR VALIDATION BAR */
						&-validation-bar {
							[data-role="validation-bar-content"] > *:first-child {
								margin-top: 0;
							}
						}
					}

					code {
						background-color: rgb(234, 234, 234);
						border-radius: 4px;
						padding: 2px 6px;
						font-weight: 500;
					}
					.logo {
						&:focus {
							outline: ${theme.focusStyles.focusedBoundaryLight};
						}
						&:hover {
							background-color: ${rgba(colors.boxShadowBackground, 0.4)};
						}

						&--mobile {
							svg {
								width: 6.9375rem;
							}
						}
					}

					.markdown {
						img {
							max-width: 100%;
						}
					}

					article {
						> hr,
						> h2,
						~ div {
							clear: both;
						}

						img {
							max-width: 100%;
						}

						.two-columns-layout {
							> h2 + hr ~ p,
							> h2 + hr + p ~ ol {
								float: left;
								padding: 0 10px 0 23px;
								width: 50%;
							}

							> h2 + hr ~ p + p {
								float: right;
							}
						}

						table tr:nth-child(2n) {
							background: ${colors.background.secondaryBackground};
						}

						tr {
							border-top: 1px solid ${colors.divider.color};
							background: #fff;
						}

						th {
							font-weight: ${typography.fontWeight.boldFontWeight};
						}

						pre > code {
							line-height: ${typography.fontSize.hugeFontSize};
							display: block;
							overflow-x: auto;
						}
					}

					.misc {
						display: flex;
						width: 100%;
						& > sup {
							font-size: ${typography.fontSize.nanoFontSize};
						}
						& > span {
							font-size: ${typography.fontSize.tinyFontSize};
						}
					}

					.logo--flat {
						&:hover {
							background-color: ${rgba(colors.boxShadowBackground, 0.1)};
						}
						&:focus {
							outline: ${theme.focusStyles.focusedBoundaryLight};
						}
					}

					strong > strong {
						text-decoration: underline;
					}

					/* EXTENDED TABLE */
					[data-role="popup"].-sc-flexible-actions-grid {
						[data-role="button"] {
							padding: 6px;
						}
					}

					.contentbox--determine-location {
						[data-role="autocomplete"] {
							[data-role="textline-input"] ~ [data-role="button"] {
								color: ${colors.interaction.secondaryInteractionColor};
							}

							[data-role="textline-input"][value=""] ~ [data-role="button"] {
								color: ${colors.secondaryColor};
							}
						}
					}
					.base {
						font-size: 16px;
						code {
							font-family: Menlo, Consolas, "Droid Sans Mono", monospace;
							a {
								font-size: 16px;
							}
						}
						pre > code {
							padding: 0;
						}
					}
				`;
			}}`;

export const StyledShowcaseLink = styled(Link)`
	font-size: 14px;
`;

export const StyledShowcaseBulletList = styled(BulletList.Unordered)`
	font-size: 14px;
`;

export const StyledShowcaseBulletListInMessageBox = styled(BulletList.Unordered)`
	font-size: 12px;
`;

export const StyledShowcaseLinkInMessageBox = styled(Link)`
	font-size: 12px;
`;

export const StyledShowcaseExternalLinkInMessageBox = styled(ExternalLink)`
	font-size: 12px;
`;

export const StyledShowcaseFlexBox = styled.div`
	align-items: center;
	display: flex;
	gap: 8px;
	justify-content: space-between;
	margin: 12px;
`;
