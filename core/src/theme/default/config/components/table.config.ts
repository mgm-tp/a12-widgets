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

import type { BaseThemeType } from "../../../schema/base-theme.js";

export type TableConfigType = {
	actionCell: { padding: string };
	body: { border: string; borderBottom: string; focusBorder: string };
	bodyCell: {
		dataColor: string;
		firstMarginLeft: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		minHeight: string;
		padding: string;
		secondary: { activeColor: string; color: string; hoverColor: string; selectedColor: string };
		subInfo: { background: string; color: string; padding: string };
		width: number;
	};
	bodyRow: {
		background: string;
		borderBottom: string;
		disabled: { background: string; color: string; fontWeight: number };
		highlightedBG: string;
		infoBG: string;
		inputsHighlightedBG: string;
		interactive: { activeBorder: string; borderWidth: string; focusBorder: string; hoverBorder: string };
		nonInteractive: { activeBG: string; focusBG: string; hoverBG: string };
		placeholder: { background: string; padding: string };
		selected: {
			activeBorderColor: string;
			background: string;
			borderLeft: string;
			focusBG: string;
			focusBorderColor: string;
			focusBorderWidth: string;
			hoverBorderColor: string;
		};
		subBGRatio: number;
		successBG: string;
		badge: {
			width: string;
			height: string;
			transform: string;
			fontSize: string;
		};
	};
	bodyRowDnD: {
		hint: { height: string; openedBG: string; openedBorder: string };
		preview: { background: string; boxShadow: string; opacity: string };
	};
	cardView: {
		bodyCell: { dataTitleFontSize: string; fontSize: string };
		bodyRow: { borderRadius: string | number; boxShadow: string; width: string };
	};
	color: string;
	contextMenu: {
		boxShadow: string;
	};
	expandable: { body: { padding: string }; footer: { minHeight: string; padding: string } };
	footCell: { fontWeight: number; minHeight: string };
	footRow: { boxShadow: string; highlightBG: string };
	headCell: {
		border: string;
		buttonIconFontSize: string;
		buttonIconSize: string;
		color: string;
		contentMinHeight: string;
		fontSize: string;
		fontWeight: number;
		iconFontSize: string;
		minHeight: string;
		padding: string;
		sortable: {
			activeBorder: string;
			activeColor: string;
			color: string;
			focusBorder: string;
			focusColor: string;
			hoverBorder: string;
			hoverColor: string;
			plasmaIconFontSize: string;
		};
		tooltipMargin: number;
		touchMinHeight: string;
	};
	headCellGroup: {
		borderColor: string;
		borderRight: string;
		gapForGroup: string;
		gapForSingle: string;
		lineHeight: string;
		rightBorderRight: string;
	};
	headRow: {
		borderBottom: string;
		boxShadow: string;
		filter: {
			borderBottom: string;
			fieldInputBG: string;
			fieldInputMarginBottom: string;
			fieldInputReadonlyBG: string;
		};
	};
	headRowGroup: {
		background: string;
		border: string;
		borderTop: string;
		fontSize: string;
		fontWeight: string;
		padding: string;
	};
	header: { background: string };
	pinned: {
		leftColumn: { boxShadow: string; hoverBoxShadow: string };
		rightColumn: { boxShadow: string; hoverBoxShadow: string };
	};
	resizeHandler: { background: string; horizontalPadding: string; width: string };
};

export const tableConfig = (theme: BaseThemeType): TableConfigType => {
	const { colors, spacing, typography, focusStyles } = theme;

	return {
		color: colors.text.color,
		contextMenu: {
			boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`
		},
		body: {
			border: `1px solid ${colors.background.secondaryBackground}`,
			focusBorder: focusStyles.focusedBoundaryDark,
			borderBottom: `1px solid ${colors.divider.colorSubtle}`
		},
		bodyRow: {
			background: colors.background.primaryBackground,
			borderBottom: `1px solid ${colors.divider.colorSubtle}`,
			disabled: {
				background: colors.interaction.disabled.colorLight,
				color: colors.interaction.disabled.colorDark,
				fontWeight: typography.fontWeight.regularFontWeight
			},
			highlightedBG: colors.background.tertiaryBackground,
			inputsHighlightedBG: colors.background.invertedBackground,
			interactive: {
				activeBorder: `2px solid ${colors.interaction.active.colorTouch}`,
				hoverBorder: `2px solid ${colors.interaction.hover.color}`,
				focusBorder: `2px solid ${colors.interaction.focus.color}`,
				borderWidth: "2px"
			},
			nonInteractive: {
				activeBG: colors.background.nonInteractiveBackground,
				hoverBG: colors.background.nonInteractiveBackground,
				focusBG: colors.background.nonInteractiveBackground
			},
			placeholder: {
				background: colors.background.tertiaryBackground,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			selected: {
				background: colors.interaction.selected.colorLight,
				activeBorderColor: colors.interaction.selected.color,
				focusBorderWidth: "4px",
				focusBG: colors.interaction.focus.color,
				hoverBorderColor: colors.interaction.hover.color,
				focusBorderColor: colors.interaction.focus.color,
				borderLeft: `4px solid ${colors.interaction.selected.color}`
			},
			subBGRatio: 0.05,
			successBG: colors.variant.successColorLight,
			infoBG: colors.interaction.selected.colorLight,
			badge: {
				width: "26px",
				height: "50px",
				transform: "rotate(40deg)",
				fontSize: typography.fontSize.nanoFontSize
			}
		},
		bodyRowDnD: {
			hint: {
				height: spacing.spacing.spacingXs + "px",
				openedBG: `${rgba(colors.interaction.draggable.color, 0.5)}`,
				openedBorder: `1px solid ${colors.interaction.draggable.color}`
			},
			preview: {
				background: colors.background.interactiveBackground,
				boxShadow: `0 1px 4px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
				opacity: "0.8"
			}
		},
		bodyCell: {
			dataColor: colors.text.secondaryColorDark,
			fontFamily: typography.font.MAIN_FONT,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.regularFontWeight,
			minHeight: spacing.spacing.spacingLg + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			width: 6.25 * spacing.spacing.spacingMd,
			firstMarginLeft: `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			subInfo: {
				background: colors.background.secondaryBackground,
				color: colors.text.color,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
			},
			secondary: {
				activeColor: colors.text.secondaryColorDark,
				color: colors.text.secondaryColorDark,
				hoverColor: colors.text.secondaryColorDark,
				selectedColor: colors.text.secondaryColorDark
			}
		},
		actionCell: {
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		header: {
			background: colors.background.secondaryBackground
		},
		headRow: {
			borderBottom: `1px solid ${colors.divider.colorSubtle}`,
			// border-collapse: separate ignores borders on <thead>, and an inset
			// shadow would be occluded by the head cells' opaque backgrounds; so
			// the DataTable paints this continuous header underline as an outset
			// (downward) box-shadow just below the sticky <thead>, which renders
			// regardless of border-collapse and is not covered by the cells.
			boxShadow: `0 1px 0 0 ${colors.divider.colorSubtle}`,
			filter: {
				borderBottom: `1px solid ${colors.divider.colorDark}`,
				fieldInputBG: colors.background.primaryBackground,
				fieldInputReadonlyBG: colors.background.tertiaryBackground,
				fieldInputMarginBottom: `${spacing.verticalSpacing.vertWhiteSpacingsm}px`
			}
		},
		headCell: {
			border: "2px dashed transparent",
			iconFontSize: typography.fontSize.bigFontSize,
			buttonIconFontSize: typography.fontSize.hugeFontSize,
			buttonIconSize: `${26 - 2 * spacing.verticalSpacing.vertWhiteSpacing3xs}px`,
			color: colors.text.color,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			minHeight: "26px",
			contentMinHeight: `${spacing.spacing.spacingMd - 2}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			tooltipMargin: 0,
			touchMinHeight: "40px",
			sortable: {
				color: colors.variant.infoColor,
				activeColor: colors.interaction.active.colorTouch,
				activeBorder: `2px solid ${colors.interaction.active.colorTouch}`,
				hoverBorder: `2px solid ${colors.interaction.hover.color}`,
				hoverColor: colors.interaction.hover.color,
				focusBorder: `2px solid ${colors.interaction.focus.color}`,
				focusColor: colors.interaction.focus.color,
				plasmaIconFontSize: typography.fontSize.hugeFontSize
			}
		},
		resizeHandler: {
			background: colors.interaction.draggable.color,
			horizontalPadding: spacing.horizontalSpacing.horizWhiteSpacingxs + "px",
			width: spacing.spacing.spacing3xs + "px"
		},
		footRow: {
			boxShadow: `inset 0 1px 0 0 ${colors.divider.color}, inset 0px 2px 0px 0px ${colors.divider.colorDark}`,
			highlightBG: colors.background.secondaryBackground
		},
		footCell: {
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			minHeight: spacing.spacing.spacingLg + "px"
		},
		cardView: {
			bodyCell: {
				dataTitleFontSize: typography.fontSize.tinyFontSize,
				fontSize: typography.fontSize.mediumFontSize
			},
			bodyRow: {
				width: "97%",
				borderRadius: "2px",
				boxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`
			}
		},
		headRowGroup: {
			borderTop: `1px solid ${colors.divider.color}`,
			background: colors.background.secondaryBackground,
			border: "none",
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: `${typography.fontWeight.regularFontWeight}`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px ${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
		},
		headCellGroup: {
			borderColor: colors.divider.colorLight,
			borderRight: `2px solid ${colors.background.secondaryBackground}`,
			lineHeight: "120%",
			gapForGroup: `2px solid ${colors.divider.colorLight}`,
			gapForSingle: `1px solid ${colors.divider.colorLight}`,
			rightBorderRight: `1px solid ${colors.divider.colorSubtle}`
		},
		pinned: {
			leftColumn: {
				boxShadow: `inset -1px 0px 0px 0px ${colors.divider.color}, inset -2px 0px 0px 0px ${colors.divider.colorDark}`,
				hoverBoxShadow: `inset -1px 0px 0px 0px ${colors.divider.color}, inset -2px 0px 0px 0px ${colors.divider.colorDark}`
			},
			rightColumn: {
				boxShadow: `inset 1px 0px 0px 0px ${colors.divider.color}, inset 2px 0px 0px 0px ${colors.divider.colorDark}`,
				hoverBoxShadow: `inset 1px 0px 0px 0px ${colors.divider.color}, inset 2px 0px 0px 0px ${colors.divider.colorDark}`
			}
		},
		expandable: {
			body: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
			},
			footer: {
				minHeight: `${2 * spacing.spacing.spacingMd}px`,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px 0 ${
					spacing.horizontalSpacing.horizWhiteSpacingmd - spacing.horizontalSpacing.horizWhiteSpacingxs
				}px`
			}
		}
	};
};
