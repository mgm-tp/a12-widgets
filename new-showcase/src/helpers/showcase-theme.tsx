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

import type {
	DeepPartial,
	FlatColorsConfigType,
	BaseThemeTypographyType,
	BaseThemeComponentsType
} from "@com.mgmtp.a12.widgets/widgets-core";
import { getFlatTheme, createTheme, provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

const { colors, spacing, typography } = getFlatTheme();

const showcaseColors: DeepPartial<FlatColorsConfigType> = {
	text: {
		color: "#292D31",
		headlineColor: `#000`
	},
	interaction: {
		primaryInteractionColor: "#000",
		selected: {
			color: `#000`
		},
		hover: {
			color: `#000`,
			colorLight: `#f1f1f1`
		}
	},
	divider: {
		color: "#DBDFE8"
	},
	background: {
		secondaryBackground: "#F9F9F9"
	}
};

const showcaseTypography: DeepPartial<BaseThemeTypographyType> = {
	font: {
		MAIN_FONT: "Roboto"
	}
};

const showcaseComponents: DeepPartial<BaseThemeComponentsType> = {
	typography: {
		headline1: {
			fontSize: `48px`,
			color: showcaseColors.text?.headlineColor,
			padding: "0 0 24px",
			fontWeight: 900
		},
		headline2: {
			fontSize: "28px",
			color: showcaseColors.text?.headlineColor,
			margin: "32px 0 0",
			padding: "0",
			fontWeight: 900
		},
		headline3: {
			color: showcaseColors.text?.headlineColor,
			fontWeight: 900
		}
	},
	accordion: {
		graphic: {
			fontSize: "1rem",
			color: "#000"
		},
		text: {
			fontSize: "14px",
			fontWeight: typography.fontWeight.regularFontWeight,
			expanded: {
				fontWeight: typography.fontWeight.regularFontWeight
			}
		},
		details: {
			background: "none"
		},
		summary: {
			border: "none",
			borderRadius: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px`,
			minHeight: `${spacing.spacing.spacingLg}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs + 2}px ${
				spacing.horizontalSpacing.horizWhiteSpacing3xs
			}px ${spacing.verticalSpacing.vertWhiteSpacing2xs + 2}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			hover: {
				border: "none"
			},
			selected: {
				color: colors.text.color,
				background: showcaseColors.interaction?.hover?.colorLight,
				borderLeft: {
					active: `2px solid ${colors.interaction.focus.color}`,
					focus: `2px solid ${colors.interaction.focus.color}`,
					hover: `2px solid ${colors.interaction.active.colorTouch}`,
					nonActive: `2px solid ${showcaseColors.interaction?.selected?.color}`
				}
			}
		}
	},
	applicationFrame: {
		background: "none",
		sidebar: {
			background: "none",
			containerBackground: DeviceDetector.isPhone() ? showcaseColors.background?.secondaryBackground : "none",
			expandedWidth: `${
				DeviceDetector.isTablet() ? spacing.spacing.spacing2Xl + 128 : spacing.spacing.spacing2Xl + 236
			}px`
		}
	},
	bulletList: {
		fontSize: "16px",
		fontFamily: `"Roboto", sans-serif`,
		content: {
			color: "#4d4d4d"
		},
		item: {
			lineHeight: 1.45,
			fontWeight: 500
		}
	},
	button: {
		fontSize: "0.875rem",
		fontWeight: "500",
		primary: {
			borderRadius: "4px"
		},
		secondary: {
			background: showcaseColors.interaction?.primaryInteractionColor,
			color: colors.text.invertedColor
		},
		iconButton: {
			color: showcaseColors.interaction?.primaryInteractionColor,
			interaction: {
				hover: {
					background: showcaseColors.interaction?.hover?.colorLight
				}
			}
		}
	},
	breadcrumb: {
		separator: {
			color: colors.text.color
		}
	},
	headerTrigger: {
		color: colors.text.color,
		border: "2px solid transparent",
		borderRadius: "4px",
		activatedBackground: showcaseColors.interaction?.hover?.colorLight,
		activatedColor: colors.text.color
	},
	applicationHeader: {
		backgroundColor: rgba(colors.background.primaryBackground, 1),
		borderTop: "none",
		padding: `${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingxl}px`
	},
	collapsiblePanel: {
		title: {
			activeBackgroundColor: showcaseColors.interaction?.hover?.colorLight,
			activeBoxShadow: `inset 0 0 0 2px #000`,
			backgroundColor: showcaseColors.interaction?.hover?.colorLight,
			color: colors.text.color,
			hoverBackgroundColor: showcaseColors.interaction?.hover?.colorLight,
			hoverBoxShadow: `inset 0 0 0 2px #000`,
			focusByTab: {
				color: colors.text.color,
				backgroundColor: showcaseColors.interaction?.hover?.colorLight,
				border: `2px solid ${colors.interaction.focus.color}`
			}
		},
		icon: {
			focusColor: colors.text.color
		}
	},
	menu: {
		link: { minHeight: "36px" },
		item: {
			horizontal: {
				selected: {
					hover: {
						borderBottom: "2px solid #000"
					},
					focus: {
						borderBottom: "2px solid #000"
					},
					borderBottom: "2px solid #000",
					color: colors.text.color
				}
			},
			subHorizontal: {
				hover: {
					border: "none"
				},
				selected: {
					background: showcaseColors.interaction?.hover?.colorLight
				}
			}
		},
		mainMenu: {
			before: { background: "transparent" },
			item: {
				hover: {
					borderBottom: "none",
					background: showcaseColors.interaction?.hover?.colorLight,
					borderRadius: "4px"
				},
				focus: {
					borderBottom: "none",
					background: showcaseColors.interaction?.hover?.colorLight,
					borderRadius: "4px"
				},
				selected: {
					borderBottom: "2px solid #000",
					borderRadius: "6px",
					hover: {
						background: showcaseColors.interaction?.hover?.colorLight,
						borderRadius: "4px",
						borderBottom: "2px solid #000"
					},
					focus: {
						background: showcaseColors.interaction?.hover?.colorLight,
						borderRadius: "4px",
						borderBottom: "2px solid #000"
					}
				}
			},
			mainLayer: { background: "transparent" },
			subLayer: { background: colors.background.primaryBackground }
		},
		mainLayer: { horizontalBG: "transparent", verticalBG: "transparent" },
		subLayer: {
			background: showcaseColors.background?.secondaryBackground,
			verticalBG: showcaseColors.background?.secondaryBackground
		},
		slidingMenu: {
			height: "calc(100% - 68px)",
			background: showcaseColors.background?.secondaryBackground
		}
	},
	baseInput: { input: { focusBoxShadow: "none" } },
	contentBox: {
		contentBoxHeaderMinHeight: "64px",
		heading: {
			borderBottom: `1px solid ${rgba(colors.boxShadowBackground, 0.22)}`
		}
	},
	modalOverlay: { container: { maxWidth: "700px" } },
	list: {
		item: {
			color: showcaseColors.interaction?.primaryInteractionColor,
			text: { fontWeight: typography.fontWeight.regularFontWeight },
			graphic: { color: colors.graphicSecondaryColorDark },
			selected: {
				fontWeight: typography.fontWeight.semiBoldFontWeight,
				background: showcaseColors.interaction?.hover?.colorLight
			}
		},
		subHeader: {
			height: "auto"
		}
	},
	link: {
		fontWeight: typography.fontWeight.semiBoldFontWeight,
		fontSize: typography.fontSize.smallFontSize,
		fontFamily: `"Roboto", sans-serif`,
		color: showcaseColors.interaction?.primaryInteractionColor,
		visitedColor: showcaseColors.interaction?.primaryInteractionColor,
		hover: {
			color: showcaseColors.interaction?.primaryInteractionColor
		},
		active: {
			color: showcaseColors.interaction?.primaryInteractionColor
		}
	},
	table: {
		bodyCell: {
			padding: ` ${spacing.verticalSpacing.vertWhiteSpacingxs + 4}px ${
				spacing.horizontalSpacing.horizWhiteSpacingxs + 4
			}px `
		}
	},
	messageBox: {
		background: {
			info: "transparent",
			warning: "transparent",
			error: "transparent"
		},
		color: {
			error: "inherit",
			warning: "inherit"
		},
		fontFamily: `"Roboto", sans-serif`
	}
};

const showcaseApplicationStyles = {
	fontFamily: "Roboto",
	input: {
		boxShadow: "none",
		focusBoxShadow: "none",
		hoverBoxShadow: "none",
		activeBoxShadow: "none",
		fontSize: typography.fontSize.lgFontSize
	}
};

const showcaseFocusStyles = {
	focusedBoundaryDark: `none`,
	focusedBoundaryLight: `none`
};

export const showcaseTheme = createTheme({
	baseTheme: "flat",
	colors: showcaseColors,
	typography: showcaseTypography,
	applicationStyles: showcaseApplicationStyles,
	focusStyles: showcaseFocusStyles,
	components: showcaseComponents
});
