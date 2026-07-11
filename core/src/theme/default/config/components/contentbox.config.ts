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
import { GeneralFlatColorsConfig } from "../../../flat/config/base/colors.config.js";
import type { Duration } from "../../../../common/main/type-utilities.js";

import { commonButtonConfigs } from "./button.config.js";

const contentBoxTileColor = "#6b28d7";
export type ContentboxConfigType = {
	actionBar: { background: string; margin: string; minHeight: string; padding: string };
	actionBarGroup: {
		borderRadius: string | number;
		dividerMargin: string;
		dividerSecondLevelBG: string;
		dividerSecondLevelHeight: string;
		dividerSecondLevelWidth: string;
		gap: string;
		secondLevelBG: string;
		secondLevelButton: { border: string; disabledBorder: string };
		secondLevelPadding: string;
	};
	actionBarGroupArea: { background: string; minHeight: string };
	breadcrumbBackground: string;
	content: {
		background: string;
		borderRadius?: string | number;
		color: string;
		fontSize: string;
		minHeight: string;
		padding: string;
	};
	contentBoxBG: string;
	contentBoxBorderRadius: string | number;
	contentBoxBoxShadow: string;
	contentBoxFontFamily: string;
	contentBoxHeaderMinHeight: string;
	contentBoxHorizontalPadding: string;
	divider: { background: string; height: string; margin: string; width: string };
	embedded: {
		footer: { minHeight: string };
		heading: { padding: string };
		padding: string;
		subHeading: { borderTop: string; minHeight: string };
		table: { header: { background: string; borderTop: string } };
		title: { color: string; fontSize: string; fontWeight: number };
	};
	footer: {
		background: string;
		borderBottom: string;
		borderRadius: string | number;
		borderTop: string;
		gap: string;
		minHeight: string;
		padding: string;
	};
	heading: {
		background: string;
		borderBottom: string;
		borderRadius: string | number;
		borderTop: string;
		gap: string;
		paddingBottom: string;
		paddingLeft: string;
		paddingRight: string;
		paddingTop: string;
		wrapper: {
			padding: string;
		};
	};
	headingAddon: { gap: string; navButtonColor: string };
	headingActionButton: {
		activated: {
			background: string;
			borderRadius: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor: string;
					color: string;
					outline: string;
				};
				hover: {
					background: string;
					border: string;
					borderColor: string;
					color: string;
				};
			};
		};
		background: string;
		color: string;
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor: string;
				color: string;
				outline: string;
			};
			hover: {
				background: string;
				border: string;
				borderColor: string;
				color: string;
			};
		};
	};
	subActionBar: { background: string; padding: string };
	subHeading: {
		borderBottom: string;
		borderTop: string;
		breadcrumbListPadding: string;
		filterBar: { mobile: { padding: number }; padding: string };
		inputBackground: string;
	};
	tile: {
		content: { padding: string; spacingBottom: string };
		heading: { background: string; borderBottom: string; gap: string; minHeight: string };
		icon: { background: string; color: string; fontSize: string; height: string; width: string };
		title: { color: string; margin: string };
	};
	title: { color: string; fontFamily: string; fontSize: string; fontWeight: number; lineHeight: number };
	subTitle: { fontSize: string };
	transitionActionBarItem: { background: string; borderBottom: string; borderTop: string; padding: string };
	wizardBar: { borderBottom: string };
	sidePanels: {
		minWidth: number;
		maxWidth: number;
		transitionDuration: Duration;
		contentTransitionDuration: Duration;
		border?: string;
		overlay?: {
			boxShadow?: string;
		};
	};
};

export const contentBoxConfig = (theme: BaseThemeType): ContentboxConfigType => {
	const { colors, spacing, divisionLineStyles, typography, focusStyles } = theme;
	const contentBoxHorizSpacing = `${spacing.horizontalSpacing.horizWhiteSpacingmd}px`;
	const buttonConfigs = commonButtonConfigs(theme);

	return {
		breadcrumbBackground: colors.background.secondaryBackground,
		contentBoxBG: colors.background.primaryBackground,
		contentBoxBorderRadius: 0,
		contentBoxFontFamily: typography.font.MAIN_FONT,
		contentBoxHeaderMinHeight: 2 * spacing.spacing.spacingMd + "px",
		contentBoxBoxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, 0.4)}`,
		contentBoxHorizontalPadding: contentBoxHorizSpacing,

		heading: {
			background: colors.primaryColor,
			paddingTop: "0",
			paddingBottom: "0",
			paddingLeft: contentBoxHorizSpacing,
			paddingRight: contentBoxHorizSpacing,
			borderRadius: 0,
			gap: spacing.horizontalSpacing.horizWhiteSpacingxs + "px",
			borderBottom: theme.divisionLineStyles.bottomLine,
			borderTop: theme.divisionLineStyles.initialLine,
			wrapper: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`
			}
		},
		content: {
			background: colors.background.primaryBackground,
			borderRadius: 0,
			color: theme.colors.text.color,
			fontSize: typography.fontSize.tinyFontSize,
			minHeight: "64px",
			padding: `0 ${contentBoxHorizSpacing} ${spacing.verticalSpacing.vertWhiteSpacingmd}px`
		},
		title: {
			color: colors.text.invertedColor,
			fontSize: typography.fontSize.mediumFontSize,
			fontFamily: typography.font.MAIN_FONT,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			lineHeight: 1.35
		},
		subTitle: {
			fontSize: typography.fontSize.tinyFontSize
		},
		subHeading: {
			inputBackground: colors.background.invertedBackground,
			borderBottom: divisionLineStyles.bottomLine,
			borderTop: `${divisionLineStyles.lineHeight} solid transparent`,
			breadcrumbListPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${contentBoxHorizSpacing}`,
			filterBar: {
				padding: `0 ${contentBoxHorizSpacing}`,
				mobile: {
					padding: 0
				}
			}
		},
		actionBar: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${contentBoxHorizSpacing}`,
			background: colors.background.secondaryBackground,
			minHeight: `${2 * spacing.spacing.spacingMd}px`,
			margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px 0 0`
		},
		actionBarGroupArea: {
			background: colors.background.secondaryBackground,
			minHeight: `${2 * spacing.spacing.spacingMd}px`
		},
		divider: {
			background: colors.divider.colorSubtle,
			height: spacing.baseSpacing.BASE + "px",
			margin: `0 ${contentBoxHorizSpacing}`,
			width: "1px"
		},
		actionBarGroup: {
			gap: spacing.horizontalSpacing.horizWhiteSpacingxs + "px",
			dividerMargin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			secondLevelBG: colors.background.groupBackground,
			secondLevelButton: {
				border: "2px solid transparent",
				disabledBorder: "2px solid transparent"
			},
			secondLevelPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px 6px`,
			dividerSecondLevelBG: colors.divider.colorDark,
			dividerSecondLevelHeight: spacing.spacing.spacing2xs + "px",
			dividerSecondLevelWidth: spacing.spacing.spacing2xs + "px",
			borderRadius: "2px"
		},
		subActionBar: {
			background: colors.background.secondaryBackground,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${contentBoxHorizSpacing}`
		},
		headingAddon: {
			gap: spacing.horizontalSpacing.horizWhiteSpacingxs + "px",
			navButtonColor: colors.text.invertedColor
		},
		headingActionButton: {
			activated: {
				background: rgba(0, 0, 0, 0.4),
				borderRadius: "2px",
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: rgba(0, 0, 0, 0.2),
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						borderColor: colors.interaction.active.colorTouchInverted,
						color: colors.interaction.active.colorTouchInverted
					},
					focus: {
						background: rgba(0, 0, 0, 0.2),
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						borderColor: colors.interaction.focus.colorInverted,
						color: colors.interaction.focus.colorInverted,
						outline: focusStyles.focusedBoundaryLight
					},
					hover: {
						background: rgba(0, 0, 0, 0.2),
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
						borderColor: colors.interaction.hover.colorInverted,
						color: colors.interaction.hover.colorInverted
					}
				}
			},
			background: "transparent",
			color: colors.text.invertedColor,
			interaction: {
				active: {
					background: rgba(0, 0, 0, 0.2),
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					borderColor: colors.interaction.active.colorTouchInverted,
					color: colors.interaction.active.colorTouchInverted
				},
				focus: {
					background: rgba(0, 0, 0, 0.2),
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					borderColor: colors.interaction.focus.colorInverted,
					color: colors.interaction.focus.colorInverted,
					outline: focusStyles.focusedBoundaryLight
				},
				hover: {
					background: rgba(0, 0, 0, 0.2),
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					borderColor: colors.interaction.hover.colorInverted,
					color: colors.interaction.hover.colorInverted
				}
			}
		},
		transitionActionBarItem: {
			background: colors.background.secondaryBackground,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${contentBoxHorizSpacing}`,
			borderTop: `${divisionLineStyles.lineHeight}px solid transparent`,
			borderBottom: divisionLineStyles.bottomLine
		},
		footer: {
			background: colors.background.secondaryBackground,
			borderBottom: divisionLineStyles.bottomLine,
			borderTop: `1px solid ${rgba(colors.boxShadowBackground, 0.22)}`,
			minHeight: 2 * spacing.spacing.spacingMd + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${contentBoxHorizSpacing}`,
			borderRadius: 0,
			gap: spacing.horizontalSpacing.horizWhiteSpacingsm + "px"
		},
		tile: {
			heading: {
				background: colors.background.primaryBackground,
				borderBottom: `2px solid #6b28d7`,
				gap: spacing.horizontalSpacing.horizWhiteSpacingsm + "px",
				minHeight: "unset"
			},
			icon: {
				background: contentBoxTileColor,
				color: colors.text.invertedColor,
				fontSize: typography.fontSize.hugeFontSize,
				height: 2 * spacing.spacing.spacingMd + "px",
				width: 2 * spacing.spacing.spacingMd + "px"
			},
			title: {
				color: contentBoxTileColor,
				margin: `0 0 0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
			},
			content: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacingmd}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px 0`,
				spacingBottom: spacing.verticalSpacing.vertWhiteSpacingmd + "px"
			}
		},
		wizardBar: {
			borderBottom: divisionLineStyles.bottomLine
		},
		embedded: {
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			heading: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacingmd}px 0 ${spacing.verticalSpacing.vertWhiteSpacing2xs}px 0`
			},
			subHeading: {
				minHeight: 2 * spacing.spacing.spacingMd + "px",
				borderTop: `1px solid ${colors.divider.colorDark}`
			},
			title: {
				color: colors.text.color,
				fontSize: typography.fontSize.tinyFontSize,
				fontWeight: typography.fontWeight.semiBoldFontWeight
			},
			footer: {
				minHeight: 8 + spacing.spacing.spacingLg + "px"
			},
			table: {
				header: {
					background: colors.background.secondaryBackground,
					borderTop: `1px solid ${colors.divider.colorDark}`
				}
			}
		},
		sidePanels: {
			border: `1px solid ${GeneralFlatColorsConfig.grey78}`,
			minWidth: 360,
			maxWidth: 420,
			transitionDuration: "0.24s",
			contentTransitionDuration: "0.04s",
			overlay: {
				boxShadow: `-4px 0 8px ${rgba(colors.boxShadowBackground, 0.2)}`
			}
		}
	};
};
