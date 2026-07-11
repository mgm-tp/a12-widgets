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

export const commentConfig = (theme: BaseThemeCore): CommentConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const commentAvatarSpacing = `${spacing.horizontalSpacing.horizWhiteSpacingxs + 12}px`;

	return {
		padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
		meta: {
			action: {
				color: colors.text.secondaryColorDark,
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`
			},
			containerMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingxs}px`,
			dateColor: colors.text.secondaryColorDark,
			inactive: {
				destructive: {
					margin: `0 0 0 ${commentAvatarSpacing}`,
					color: colors.variant.destructiveColor
				},
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px 0 0`,
				color: colors.text.secondaryColorDark,
				avatarColor: colors.interaction.readonly.color
			},
			newComment: {
				color: colors.text.color,
				fontFamily: typography.font.MAIN_FONT,
				fontSize: typography.fontSize.tinyFontSize,
				fontWeight: typography.fontWeight.regularFontWeight,
				containerMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacinglg}px`,
				avatar: {
					fontSize: typography.fontSize.lgFontSize,
					size: `${spacing.spacing.spacingMd}px`,
					left: `-${spacing.spacing.spacingMd + spacing.horizontalSpacing.horizWhiteSpacing3xs}px`
				},
				author: {
					fontWeight: typography.fontWeight.semiBoldFontWeight,
					margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`
				}
			}
		},
		actions: {
			margin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0 0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
			replies: {
				item: {
					background: colors.background.interactiveBackground,
					padding: ` ${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
					borderBottom: `${theme.border.width.thin} solid ${colors.divider.colorLight}`
				}
			},
			newCommentMargin: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingxs}px`,
			replyCommentMargin: `0 -${spacing.horizontalSpacing.horizWhiteSpacingxs}px 0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		content: {
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacinglg}px`,
			childrenMargin: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
			newCommentMargin: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`,
			replyCommentPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
			replyNewCommentMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
		},
		text: {
			color: colors.text.color
		},
		newComment: {
			background: colors.background.primaryBackground
		},
		replies: {
			margin: `${spacing.verticalSpacing.vertWhiteSpacingsm}px 0 ${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
			actionMargin: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`
		},
		replyComment: {
			background: colors.background.interactiveBackground,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			inputBG: colors.background.invertedBackground
		}
	};
};
