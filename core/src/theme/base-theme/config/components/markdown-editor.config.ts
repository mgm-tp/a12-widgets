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

import type { MarkdownEditorConfigType } from "../../../default/config/components/markdown-editor.config.js";
import type { BaseThemeCore } from "../../schema.js";

import { tableConfig } from "./table.config.js";

/**
 * A cross-platform monospace stack for source mode and inline/block code.
 */
const MONOSPACE_FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

export const markdownEditorConfig = (theme: BaseThemeCore): MarkdownEditorConfigType => {
	const { spacing, colors, applicationStyles, typography } = theme;
	const table = tableConfig(theme);

	return {
		toolbar: {
			background: colors.background.groupBackground,
			borderRadius: applicationStyles.input.borderRadius,
			boxShadow: "none",
			gap: `${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
			minHeight: 3 * spacing.baseSpacing.BASE + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			item: {
				borderRadius: theme.border.radius.sm,
				icon: {
					color: colors.text.color,
					disabled: { color: colors.interaction.disabled.colorDark },
					active: {
						activeBG: colors.interaction.active.colorTouch,
						background: colors.interaction.selected.color,
						color: colors.text.invertedColor,
						focusBG: colors.interaction.focus.color,
						hoverBG: colors.interaction.active.colorTouch,
						selector: {
							background: colors.background.interactiveBackground,
							color: colors.interaction.active.colorTouch
						}
					},
					focus: {
						background: colors.background.interactiveBackground,
						color: colors.interaction.focus.color
					},
					hover: {
						background: colors.background.interactiveBackground,
						color: colors.interaction.hover.color
					}
				}
			},
			separator: {
				background: colors.divider.color,
				height: spacing.spacing.spacingLg + "px",
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				width: spacing.spacing.spacing3xs + "px"
			},
			tablePicker: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
				cell: {
					background: colors.background.primaryBackground,
					border: `1px solid ${colors.divider.color}`,
					size: spacing.spacing.spacingMd + "px",
					selected: {
						background: colors.background.interactiveBackground,
						border: `1px solid ${colors.interaction.selected.color}`
					}
				},
				label: {
					color: colors.text.color,
					fontSize: typography.fontSize.smallFontSize,
					padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0 0`
				}
			}
		},
		heading: {
			h1: typography.fontSize.hugeFontSize,
			// The scale has no token for this step.
			h2: `${1.375 * typography.font.BASE_FONT_SIZE}rem`,
			h3: typography.fontSize.bigFontSize,
			h4: typography.fontSize.lgFontSize,
			h5: typography.fontSize.mediumFontSize,
			h6: typography.fontSize.smallFontSize
		},
		richSurface: {
			blockquote: {
				border: `4px solid ${colors.divider.colorDark}`,
				color: colors.text.secondaryColorDark,
				paddingLeft: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			code: {
				background: colors.background.tertiaryBackground,
				borderRadius: "3px",
				color: colors.text.color,
				fontFamily: MONOSPACE_FONT,
				padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
			},
			codeBlock: {
				background: colors.background.tertiaryBackground,
				foreground: colors.text.color,
				token: {
					comment: colors.text.secondaryColorDark,
					keyword: colors.interaction.focus.color,
					operator: colors.text.color,
					string: colors.variant.successColor,
					stringExpression: colors.variant.successColor,
					regex: colors.interaction.active.color,
					number: colors.variant.warningColorDark,
					constant: colors.variant.warningColorDark,
					variable: colors.text.color,
					property: colors.text.color,
					parameter: colors.text.color,
					function: colors.variant.infoColor,
					type: colors.variant.warningColorDark,
					tag: colors.interaction.selected.color,
					attribute: colors.variant.warningColorDark,
					punctuation: colors.text.color,
					link: colors.interaction.selected.color,
					inserted: colors.variant.successColor,
					deleted: colors.variant.errorColor,
					changed: colors.variant.warningColorDark
				}
			},
			checklist: {
				disabled: { border: `1px solid ${colors.interaction.disabled.colorDark}` },
				itemPaddingLeft: `${spacing.horizontalSpacing.horizWhiteSpacingmd}px`,
				paddingLeft: "0"
			},
			horizontalRule: {
				color: colors.divider.color,
				disabled: { color: colors.divider.colorDark },
				margin: `${spacing.verticalSpacing.vertWhiteSpacingmd}px 0`
			},
			link: { color: colors.interaction.primaryInteractionColor },
			table: {
				// Values come from the Table widget config, so both tables look the same in
				// every theme. Only the lines differ: the widget draws one line under each row,
				// the editor draws a border around each cell, in the same colour.
				border: table.bodyRow.borderBottom,
				cellMinHeight: table.bodyCell.minHeight,
				cellPadding: table.bodyCell.padding,
				disabled: {
					border: `1px solid ${colors.divider.colorDark}`,
					headerBackground: table.bodyRow.disabled.background
				},
				fontSize: table.bodyCell.fontSize,
				headerBackground: table.header.background,
				headerFontWeight: table.headCell.fontWeight,
				headerMinHeight: table.headCell.minHeight,
				headerPadding: table.headCell.padding,
				// The only value not from the widget: here a table sits inside text.
				margin: `${spacing.verticalSpacing.vertWhiteSpacingsm}px 0`
			}
		},
		sourceSurface: {
			fontFamily: MONOSPACE_FONT,
			token: {
				markup: colors.text.secondaryColorDark,
				meta: colors.variant.infoColor,
				heading: { color: colors.text.headlineColor, fontWeight: typography.fontWeight.boldFontWeight },
				strong: { fontWeight: typography.fontWeight.boldFontWeight },
				code: {
					blockBackground: colors.background.tertiaryBackground,
					color: colors.variant.successColor
				},
				highlight: { background: colors.variant.warningColorLight, borderRadius: "2px" },
				html: colors.text.secondaryColorDark,
				link: colors.interaction.primaryInteractionColor,
				quote: { blockPaddingLeft: `${spacing.horizontalSpacing.horizWhiteSpacing2xs}px` }
			}
		}
	};
};
