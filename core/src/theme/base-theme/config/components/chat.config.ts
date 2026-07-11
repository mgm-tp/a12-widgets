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

import type { BaseThemeCore } from "../../schema.js";

export type ChatConfigType = {
	container: { inner: { padding: string } };
	date: {
		content: {
			background: string;
			borderRadius: string | number;
			color: string;
			fontFamily: string;
			fontSize: string;
			margin: string;
			padding: string;
		};
		marker: { padding: string };
	};
	message: {
		background: { left: string; right: string };
		borderColor: { left: string; right: string };
		bubble: { borderRadius: string | number; horizontalMargin: string; minHeight: string; padding: string };
		content: { fontFamily: string; fontSize: string; fontWeight: number; lineHeight: string };
		status: {
			color: string;
			fontFamily: string;
			fontSize: string;
			fontWeight: number;
			lineHeight: string;
			paddingLeft: string;
		};
		wrapper: { lastChildPaddingBottom: string; padding: string };
	};
	messageGroup: { lastChildPadding: string; padding: string };
	notification: {
		background: { error: string; success: string; warning: string };
		content: {
			background: string;
			borderRadius: string | number;

			/** @deprecated since 37.0.0. Please use {@link variant.text} instead. */
			color?: string;
			fontFamily: string;
			fontSize: string;
			icon: { margin: string; fontSize?: string };
			padding: string;
			variant: { text: { info: string; success: string; warning: string; error: string } };
		};
		fixedToBottom: { margin: string; width: string };
		margin: string;
		width: string;
	};
	secondaryContent: { color: string; fontFamily: string; fontSize: string; fontStyle: string; margin: string };
	typing: { padding: string; width: string };
	userInfo: {
		avatar: { image: { borderRadius: string | number; size: string }; wrapper: { spacing: string } };
		name: { fontFamily: string; fontSize: string; fontWeight: number; lineHeight: string };
		paddingTop: string;
	};
};

export const chatConfig = (theme: BaseThemeCore): ChatConfigType => {
	const {
		colors,
		spacing: { horizontalSpacing, verticalSpacing, spacing },
		typography: { fontSize, font, fontWeight, lineHeight }
	} = theme;
	const chatUserAvatarSize = `${spacing.spacingMd}px`;

	const chatContainerInnerSpacing = horizontalSpacing.horizWhiteSpacingmd;

	return {
		container: {
			inner: {
				padding: `${verticalSpacing.vertWhiteSpacingmd}px ${chatContainerInnerSpacing}px 0 ${verticalSpacing.vertWhiteSpacingmd}px`
			}
		},
		messageGroup: {
			padding: `${verticalSpacing.vertWhiteSpacingxs}px 0 0`,
			lastChildPadding: `${verticalSpacing.vertWhiteSpacingxs}px 0`
		},
		message: {
			background: {
				left: colors.background.primaryBackground,
				right: colors.background.secondaryBackground
			},
			borderColor: {
				left: colors.divider.colorSubtle,
				right: colors.background.secondaryBackground
			},
			wrapper: {
				padding: `${verticalSpacing.vertWhiteSpacing2xs}px 0 0`,
				lastChildPaddingBottom: `${verticalSpacing.vertWhiteSpacingxs}px`
			},
			bubble: {
				borderRadius: theme.border.radius.md,
				minHeight: `${spacing.spacingMd}px`,
				padding: `${verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing.horizWhiteSpacing2xs}px`,
				horizontalMargin: `${horizontalSpacing.horizWhiteSpacingxs - 2}px`
			},
			content: {
				fontFamily: font.MAIN_FONT,
				fontSize: fontSize.tinyFontSize,
				fontWeight: fontWeight.regularFontWeight,
				lineHeight: `${lineHeight.relaxed}`
			},
			status: {
				fontFamily: font.MAIN_FONT,
				fontSize: fontSize.tinyFontSize,
				fontWeight: fontWeight.regularFontWeight,
				lineHeight: `${lineHeight.relaxed}`,
				color: colors.text.color,
				paddingLeft: `${horizontalSpacing.horizWhiteSpacingsm}px`
			}
		},
		userInfo: {
			paddingTop: `${verticalSpacing.vertWhiteSpacingxs}px`,
			avatar: {
				wrapper: {
					spacing: `${horizontalSpacing.horizWhiteSpacing2xs}px`
				},
				image: {
					borderRadius: theme.border.radius.full,
					size: chatUserAvatarSize
				}
			},
			name: {
				fontFamily: font.MAIN_FONT,
				fontSize: fontSize.tinyFontSize,
				fontWeight: fontWeight.semiBoldFontWeight,
				lineHeight: `${lineHeight.base}`
			}
		},
		date: {
			marker: {
				padding: `0 ${horizontalSpacing.horizWhiteSpacingxs}px`
			},
			content: {
				background: colors.text.secondaryColorDark,
				borderRadius: "12px",
				color: colors.text.invertedColor,
				fontFamily: font.MAIN_FONT,
				fontSize: fontSize.tinyFontSize,
				padding: `${verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing.horizWhiteSpacingsm}px`,
				margin: `${verticalSpacing.vertWhiteSpacingxs}px 0`
			}
		},
		notification: {
			margin: `${verticalSpacing.vertWhiteSpacingxs}px auto`,
			width: "75%",
			background: {
				error: colors.variant.errorColor,
				success: colors.variant.successColor,
				warning: colors.variant.warningColor
			},
			content: {
				background: colors.variant.infoColor,
				borderRadius: "12px",
				fontFamily: font.MAIN_FONT,
				fontSize: fontSize.tinyFontSize,
				padding: `${verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing.horizWhiteSpacingsm}px`,
				icon: {
					margin: `0 0 0 ${horizontalSpacing.horizWhiteSpacingxs}px`,
					fontSize: fontSize.lgFontSize
				},
				variant: {
					text: {
						info: colors.variant.text.info,
						success: colors.variant.text.success,
						warning: colors.variant.text.warning,
						error: colors.variant.text.error
					}
				}
			},
			fixedToBottom: {
				margin: `0 0 ${verticalSpacing.vertWhiteSpacing2xs}px 0`,
				width: "70%"
			}
		},
		typing: {
			padding: `${verticalSpacing.vertWhiteSpacingxs}px 0`,
			width: "75%"
		},
		secondaryContent: {
			color: colors.text.secondaryColorDark,
			fontFamily: font.MAIN_FONT,
			fontSize: "1em",
			fontStyle: "italic",
			margin: `${verticalSpacing.vertWhiteSpacingsm - 4}px 0 0`
		}
	};
};
