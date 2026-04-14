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

import type { BaseThemeType } from "../../../schema/base-theme.js";

export type CommentConfigType = {
	actions: {
		margin: string;
		newCommentMargin: string;
		replies: { item: { background: string; borderBottom: string; padding: string } };
		replyCommentMargin: string;
	};
	content: {
		childrenMargin: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		newCommentMargin: string;
		padding: string;
		replyCommentPadding: string;
		replyNewCommentMargin: string;
	};
	meta: {
		action: { color: string; margin: string };
		containerMargin: string;
		dateColor: string;
		inactive: { avatarColor: string; color: string; destructive: { color: string; margin: string }; margin: string };
		newComment: {
			author: { fontWeight: number; margin: string };
			avatar: { fontSize: string; left: string; size: string };
			color: string;
			containerMargin: string;
			fontFamily: string;
			fontSize: string;
			fontWeight: number;
		};
	};
	newComment: { background: string };
	padding: string;
	replies: { actionMargin: string; margin: string };
	replyComment: { background: string; inputBG: string; padding: string };
	text: { color: string };
};

export const commentConfig = (theme: BaseThemeType): CommentConfigType => {
	const {
		spacing: { horizontalSpacing, verticalSpacing },
		colors,
		typography: { fontSize, fontWeight, font }
	} = theme;
	const commentAvatarSpacing = `${horizontalSpacing.horizWhiteSpacingxs + 12}px`;

	return {
		padding: `${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingxs}px ${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingsm}px`,
		meta: {
			action: {
				color: colors.text.secondaryColorDark,
				margin: `0 ${horizontalSpacing.horizWhiteSpacing2xs}px 0 0`
			},
			containerMargin: `0 ${horizontalSpacing.horizWhiteSpacingmd}px ${verticalSpacing.vertWhiteSpacingxs}px`,
			dateColor: colors.text.secondaryColorDark,
			inactive: {
				destructive: {
					margin: `0 0 0 ${commentAvatarSpacing}`,
					color: colors.variant.destructiveColor
				},
				margin: `0 ${horizontalSpacing.horizWhiteSpacingsm}px 0 0`,
				color: colors.text.secondaryColorDark,
				avatarColor: colors.interaction.readonly.color
			},
			newComment: {
				color: colors.text.color,
				fontFamily: font.MAIN_FONT,
				fontSize: fontSize.tinyFontSize,
				fontWeight: fontWeight.regularFontWeight,
				containerMargin: `0 0 ${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingmd}px`,
				avatar: {
					fontSize: fontSize.mediumFontSize,
					size: "16px",
					left: `-${commentAvatarSpacing}`
				},
				author: {
					fontWeight: fontWeight.semiBoldFontWeight,
					margin: `0 ${horizontalSpacing.horizWhiteSpacing2xs}px 0 0`
				}
			}
		},
		actions: {
			margin: `${verticalSpacing.vertWhiteSpacing2xs}px 0 0 ${horizontalSpacing.horizWhiteSpacingmd}px`,
			replies: {
				item: {
					background: colors.background.interactiveBackground,
					padding: ` ${verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing.horizWhiteSpacing2xs}px`,
					borderBottom: `1px solid ${colors.divider.colorLight}`
				}
			},
			newCommentMargin: `${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingmd}px ${verticalSpacing.vertWhiteSpacingxs}px`,
			replyCommentMargin: `0 -${horizontalSpacing.horizWhiteSpacingxs}px 0 ${horizontalSpacing.horizWhiteSpacingxs}px`
		},
		content: {
			fontFamily: font.MAIN_FONT,
			fontSize: fontSize.tinyFontSize,
			fontWeight: fontWeight.regularFontWeight,
			padding: `${verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing.horizWhiteSpacingmd}px`,
			childrenMargin: `0 0 ${verticalSpacing.vertWhiteSpacingxs}px 0`,
			newCommentMargin: `${verticalSpacing.vertWhiteSpacing2xs}px 0`,
			replyCommentPadding: `0 ${horizontalSpacing.horizWhiteSpacingmd}px`,
			replyNewCommentMargin: `0 ${horizontalSpacing.horizWhiteSpacingmd}px`
		},
		text: {
			color: colors.text.color
		},
		newComment: {
			background: colors.background.primaryBackground
		},
		replies: {
			margin: `${verticalSpacing.vertWhiteSpacingsm}px 0 ${verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing.horizWhiteSpacingmd}px`,
			actionMargin: `${verticalSpacing.vertWhiteSpacingsm}px ${horizontalSpacing.horizWhiteSpacingmd}px ${verticalSpacing.vertWhiteSpacingxs}px 0`
		},
		replyComment: {
			background: colors.background.interactiveBackground,
			padding: `${verticalSpacing.vertWhiteSpacingxs}px ${horizontalSpacing.horizWhiteSpacingxs}px`,
			inputBG: colors.background.invertedBackground
		}
	};
};
