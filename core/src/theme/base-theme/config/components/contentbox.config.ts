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

import type { Duration } from "../../../../common/main/type-utilities.js";
import type { BaseThemeCore } from "../../schema.js";
import { mergeConfig } from "../../utils/merge-config.js";

import { commonButtonConfigs } from "./button.config.js";

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

const defaultContentBoxConfig = (theme: BaseThemeCore): ContentboxConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const divisionLineStyles = theme.divisionLineStyles;
	const focusStyles = theme.focusStyles;
	const contentBoxHorizSpacing = `${spacing.horizontalSpacing.horizWhiteSpacingmd}px`;
	const buttonConfigs = commonButtonConfigs(theme);

	return {
		breadcrumbBackground: colors.background.secondaryBackground,
		contentBoxBG: colors.background.primaryBackground,
		contentBoxBorderRadius: 0,
		contentBoxFontFamily: typography.font.MAIN_FONT,
		contentBoxHeaderMinHeight: 2 * spacing.spacing.spacingMd + "px",
		contentBoxBoxShadow: `0 1px 2px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
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
			lineHeight: theme.typography.lineHeight?.base
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
				border: `${theme.border.width.medium} solid transparent`,
				disabledBorder: `${theme.border.width.medium} solid transparent`
			},
			secondLevelPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			dividerSecondLevelBG: colors.divider.colorDark,
			dividerSecondLevelHeight: spacing.spacing.spacing2xs + "px",
			dividerSecondLevelWidth: spacing.spacing.spacing2xs + "px",
			borderRadius: theme.border.radius.sm
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
				background: colors.shadow.overlayDark,
				borderRadius: theme.border.radius.sm,
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: colors.shadow.overlaySoft,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						borderColor: colors.interaction.active.colorTouchInverted,
						color: colors.interaction.active.colorTouchInverted
					},
					focus: {
						background: colors.shadow.overlaySoft,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						borderColor: colors.interaction.focus.colorInverted,
						color: colors.interaction.focus.colorInverted,
						outline: focusStyles.focusedBoundaryLight
					},
					hover: {
						background: colors.shadow.overlaySoft,
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
					background: colors.shadow.overlaySoft,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					borderColor: colors.interaction.active.colorTouchInverted,
					color: colors.interaction.active.colorTouchInverted
				},
				focus: {
					background: colors.shadow.overlaySoft,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					borderColor: colors.interaction.focus.colorInverted,
					color: colors.interaction.focus.colorInverted,
					outline: focusStyles.focusedBoundaryLight
				},
				hover: {
					background: colors.shadow.overlaySoft,
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
			borderTop: `${theme.border.width.thin} solid ${rgba(colors.boxShadowBackground, theme.opacity.hint)}`,
			minHeight: 2 * spacing.spacing.spacingMd + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${contentBoxHorizSpacing}`,
			borderRadius: 0,
			gap: spacing.horizontalSpacing.horizWhiteSpacingsm + "px"
		},
		tile: {
			heading: {
				background: colors.background.primaryBackground,
				borderBottom: `${theme.border.width.medium} solid ${colors.interaction.primaryInteractionColor}`,
				gap: spacing.horizontalSpacing.horizWhiteSpacingsm + "px",
				minHeight: "unset"
			},
			icon: {
				background: colors.interaction.primaryInteractionColor,
				color: colors.text.invertedColor,
				fontSize: typography.fontSize.hugeFontSize,
				height: 2 * spacing.spacing.spacingMd + "px",
				width: 2 * spacing.spacing.spacingMd + "px"
			},
			title: {
				color: colors.interaction.primaryInteractionColor,
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
				borderTop: `${theme.border.width.thin} solid ${colors.divider.colorDark}`
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
					borderTop: `${theme.border.width.thin} solid ${colors.divider.colorDark}`
				}
			}
		},
		sidePanels: {
			border: `${theme.border.width.thin} solid ${colors.divider.colorMuted}`,
			minWidth: 360,
			maxWidth: 420,
			transitionDuration: "0.24s",
			contentTransitionDuration: "0.04s",
			overlay: {
				boxShadow: `-4px 0 8px ${rgba(colors.boxShadowBackground, theme.opacity.subtle)}`
			}
		}
	};
};

export const contentBoxOverrides = (theme: BaseThemeCore) => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;
	const horizontalSpacing = spacing.horizontalSpacing.horizWhiteSpacingmd;
	const buttonConfigs = commonButtonConfigs(theme);
	const borderRadius = spacing.spacing.spacingXs + spacing.spacing.spacing3xs;

	return {
		contentBoxBG: colors.background.primaryBackground,
		contentBoxBorderRadius: `${borderRadius}px`,
		contentBoxHeaderMinHeight: `${3 * spacing.baseSpacing.BASE}px`,
		contentBoxBoxShadow: "none",
		contentBoxHorizontalPadding: `${horizontalSpacing}px`,
		heading: {
			background: colors.background.invertedBackground,
			borderBottom: "none",
			borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,

			paddingTop: "0",
			paddingBottom: "0",
			paddingLeft: `${horizontalSpacing}px`,
			paddingRight: `${horizontalSpacing}px`
		},
		headingAddon: {
			navButtonColor: colors.interaction.color
		},
		headingActionButton: {
			activated: {
				background: "transparent",
				borderRadius: theme.border.radius.full,
				color: colors.interaction.active.color,
				interaction: {
					active: {
						background: "transparent",
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						borderColor: buttonConfigs.buttonActiveColor
					},
					focus: {
						background: "transparent",
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						borderColor: buttonConfigs.buttonFocusColor,
						outline: focusStyles.focusedBoundaryDark
					},
					hover: {
						background: "transparent",
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
						borderColor: buttonConfigs.buttonHoverColor
					}
				}
			},
			color: colors.interaction.secondaryInteractionColor,
			interaction: {
				active: {
					background: "transparent",
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					borderColor: buttonConfigs.buttonActiveColor
				},
				focus: {
					background: "transparent",
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					borderColor: buttonConfigs.buttonFocusColor,
					outline: focusStyles.focusedBoundaryDark
				},
				hover: {
					background: "transparent",
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					borderColor: buttonConfigs.buttonHoverColor
				}
			}
		},
		content: {
			borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,

			padding: `${spacing.verticalSpacing.vertWhiteSpacingmd}px ${horizontalSpacing}px `
		},
		title: {
			color: colors.text.color,
			fontSize: typography.fontSize.lgFontSize
		},
		subHeading: {
			borderBottom: `${theme.border.width.thin} solid ${colors.primaryColor}`,
			breadcrumbListPadding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing}px`,
			filterBar: {
				padding: `0 ${horizontalSpacing}px`
			}
		},
		actionBar: {
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing}px`
		},
		actionBarGroup: {
			secondLevelButton: {
				border: `${theme.border.width.medium} solid ${colors.text.invertedColor}`,
				disabledBorder: `${theme.border.width.medium} solid ${colors.interaction.disabled.color}`
			}
		},
		subActionBar: {
			background: colors.background.invertedBackground,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${horizontalSpacing}px`
		},
		transitionActionBarItem: {
			borderBottom: `${theme.border.width.thin} solid ${colors.primaryColor}`
		},
		footer: {
			borderTop: "none",
			borderBottom: "none",
			minHeight: spacing.spacing.spacingXl + "px",
			padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px ${horizontalSpacing}px`,
			borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`
		},
		tile: {
			heading: {
				minHeight: `3 * ${spacing.baseSpacing.BASE}px`
			}
		}
	};
};

export const contentBoxConfig = (theme: BaseThemeCore) =>
	mergeConfig(defaultContentBoxConfig(theme), contentBoxOverrides(theme));
