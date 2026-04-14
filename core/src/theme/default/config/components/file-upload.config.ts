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
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";

export type FileUploadConfigType = {
	actionsMargin: string;
	active: { border: string; color: string };
	content: {
		background?: string;
		border: string;
		borderRadius: string | number;
		childBorder: string;
		loadingBorder: string;
		minHeight: string;
		padding: string;
		singleFile: { background: string; height: string; width: string };
		uploaded: {
			borderColor: {
				info: string;
				error: string;
				warning: string;
			};
		};
	};
	descriptionText: { color: string; fontSize: string; marginRight: string };
	disabled: { background: string; color: string };
	errorColor: string;
	focus: {
		border: string;
		customBorder?: CustomBorder;
		color: string;
	};
	hover: { border: string; color: string };
	icon: {
		color: string;
		fontSize: string;
		loading: { color: string; fontSize: string; size: string };
		variant: {
			info: string;
			error: string;
			warning: string;
		};
	};
	infoColor: string;
	placeholder: { contentBG: string; disabledColor: string; previewColor: string; readonlyColor: string };
	readonly: { background: string; color: string };
	fileNamePreview: {
		content: {
			backgroundColor: string;
			border: string;
			fontWeight: number;
			iconSize: string;
			link: {
				backgroundSize: string;
			};
			padding: string;
		};
		divider: {
			width: string;
		};
		uploadIcon: {
			fontSize: string;
		};
	};
	text: { color: string; fontFamily: string; fontSize: string; fontWeight: number };
	warningColor: string;
};

export const fileUploadConfig = (theme: BaseThemeType): FileUploadConfigType => {
	const { spacing, colors, typography, applicationStyles } = theme;

	return {
		actionsMargin: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
		active: {
			border: `2px solid ${colors.interaction.active.colorTouch}`,
			color: colors.interaction.active.colorTouch
		},
		content: {
			background: "transparent",
			border: `1px dashed ${colors.interaction.secondaryInteractionColor}`,
			borderRadius: "2px",
			childBorder: `1px solid ${colors.divider.color}`,
			loadingBorder: `1px solid ${colors.divider.color}`,
			minHeight: spacing.baseSpacing.BASE * 3 + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			singleFile: {
				background: colors.background.interactiveBackground,
				height: spacing.baseSpacing.BASE * 9.5 + "px",
				width: spacing.baseSpacing.BASE * 9.5 + "px"
			},
			uploaded: {
				borderColor: {
					error: colors.variant.errorColor,
					info: colors.variant.infoColor,
					warning: colors.variant.warningColorDark
				}
			}
		},
		disabled: {
			background: colors.interaction.disabled.color,
			color: colors.interaction.disabled.colorDark
		},
		errorColor: colors.variant.errorColor,
		focus: {
			border: `2px solid ${colors.interaction.focus.color}`,
			color: colors.interaction.focus.color
		},
		hover: {
			border: `2px solid ${colors.interaction.hover.color}`,
			color: colors.interaction.hover.color
		},
		infoColor: colors.variant.infoColor,
		icon: {
			color: colors.interaction.secondaryInteractionColor,
			fontSize: typography.fontSize.hugeFontSize,
			loading: {
				color: colors.interaction.active.color,
				fontSize: typography.fontSize.hugeFontSize,
				size: spacing.spacing.spacing2xs + "px"
			},
			variant: {
				info: colors.variant.infoColor,
				error: colors.variant.errorColor,
				warning: colors.variant.warningColorDark
			}
		},
		descriptionText: {
			color: colors.text.color,
			fontSize: typography.fontSize.tinyFontSize,
			marginRight: spacing.horizontalSpacing.horizWhiteSpacingsm + "px"
		},
		readonly: {
			background: colors.background.secondaryBackground,
			color: colors.interaction.readonly.colorDark
		},
		text: {
			color: colors.interaction.secondaryInteractionColor,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.boldFontWeight
		},
		warningColor: colors.variant.warningColor,
		placeholder: {
			previewColor: colors.text.secondaryColorDark,
			contentBG: colors.background.interactiveBackground,
			disabledColor: colors.interaction.disabled.colorLight,
			readonlyColor: colors.text.secondaryColorDark
		},
		fileNamePreview: {
			content: {
				backgroundColor: applicationStyles.input.background,
				border: "1px solid transparent",
				fontWeight: typography.fontWeight.semiBoldFontWeight,
				iconSize: typography.fontSize.mediumFontSize,
				link: {
					backgroundSize: "calc(100% - 1px) calc(0.1 * 0.8rem)"
				},
				padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${
					spacing.horizontalSpacing.horizWhiteSpacingsm - 4
				}px`
			},
			divider: {
				width: "2px"
			},
			uploadIcon: {
				fontSize: typography.fontSize.mediumFontSize
			}
		}
	};
};
