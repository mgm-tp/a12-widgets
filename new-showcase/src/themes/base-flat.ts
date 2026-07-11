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

import { type BaseThemeOptions } from "@com.mgmtp.a12.widgets/widgets-core";

const TILE_COLOR = "#6b28d7";

const baseSpacing = 16;
const baseFontSize = 1;

const spacing = {
	base: baseSpacing,
	spacing: {
		spacing3xs: Math.round(0.125 * baseSpacing), // 2px
		spacing2xs: Math.round(0.25 * baseSpacing), // 4px
		spacingXs: Math.round(0.5 * baseSpacing), // 8px
		spacingSm: Math.round(0.75 * baseSpacing), // 12px
		spacingMd: Math.round(1.5 * baseSpacing), // 24px
		spacingLg: Math.round(2 * baseSpacing), // 32px
		spacingXl: Math.round(3.25 * baseSpacing), // 52px
		spacing2Xl: Math.round(5.25 * baseSpacing) // 84px
	},
	horizontalSpacing: {
		horizWhiteSpacing3xs: Math.round(0.125 * baseSpacing), // 2px
		horizWhiteSpacing2xs: Math.round(0.25 * baseSpacing), // 4px
		horizWhiteSpacingxs: Math.round(0.5 * baseSpacing), // 8px
		horizWhiteSpacingsm: baseSpacing, // 16px
		horizWhiteSpacingmd: Math.round(1.5 * baseSpacing), // 24px
		horizWhiteSpacinglg: Math.round(2 * baseSpacing), // 32px
		horizWhiteSpacingxl: Math.round(2.5 * baseSpacing), // 40px
		horizWhiteSpacing2xl: Math.round(3 * baseSpacing), // 48px
		horizWhiteSpacing3xl: Math.round(3.5 * baseSpacing), // 56px
		horizWhiteSpacing4xl: Math.round(4 * baseSpacing), // 64px
		horizWhiteSpacing5xl: Math.round(4.5 * baseSpacing), // 72px
		horizWhiteSpacing6xl: Math.round(5 * baseSpacing) // 80px
	},
	verticalSpacing: {
		vertWhiteSpacing3xs: Math.round(0.125 * baseSpacing), // 2px
		vertWhiteSpacing2xs: Math.round(0.25 * baseSpacing), // 4px
		vertWhiteSpacingxs: Math.round(0.5 * baseSpacing), // 8px
		vertWhiteSpacingsm: baseSpacing, // 16px
		vertWhiteSpacingmd: Math.round(1.5 * baseSpacing), // 24px
		vertWhiteSpacinglg: Math.round(2 * baseSpacing), // 32px
		vertWhiteSpacingxl: Math.round(2.5 * baseSpacing), // 40px
		vertWhiteSpacing2xl: Math.round(3 * baseSpacing), // 48px
		vertWhiteSpacing3xl: Math.round(3.5 * baseSpacing), // 56px
		vertWhiteSpacing4xl: Math.round(4 * baseSpacing), // 64px
		vertWhiteSpacing5xl: Math.round(4.5 * baseSpacing), // 72px
		vertWhiteSpacing6xl: Math.round(5 * baseSpacing) // 80px
	}
};

const typography = {
	fontSize: {
		"5XlFontSize": `${3 * baseFontSize}rem`, // 48px
		"4XlFontSize": `${2.25 * baseFontSize}rem`, // 36px
		"3XlFontSize": `${1.875 * baseFontSize}rem`, // 30px
		hugeFontSize: `${1.5 * baseFontSize}rem`, // 24px
		bigFontSize: `${1.25 * baseFontSize}rem`, // 20px
		lgFontSize: `${1.125 * baseFontSize}rem`, // 18px
		mediumFontSize: `${baseFontSize}rem`, // 16px
		smallFontSize: `${0.875 * baseFontSize}rem`, // 14px
		tinyFontSize: `${0.75 * baseFontSize}rem`, // 12px
		nanoFontSize: `${0.625 * baseFontSize}rem` // 10px
	}
};

const typographyHeadlineCalculation = (ratio: number, lineHeightValue: number, baseSpacingValue: number) => {
	const fontSizeValue = `${baseFontSize * ratio}rem`;

	return {
		fontSize: fontSizeValue,
		height: `${Math.round(baseSpacingValue * ratio * lineHeightValue)}px`
	};
};

export const baseFlatOverrides: BaseThemeOptions = {
	spacing,
	typography,
	colors: {
		divider: {
			colorBorder: "#a9b3bc"
		}
	},
	components: {
		accordion: {
			details: {
				menu: {
					paddingLeft: `${spacing.horizontalSpacing.horizWhiteSpacinglg}px`
				}
			},
			graphic: {
				fontSize: typography.fontSize.bigFontSize
			}
		},
		badge: {
			fontSize: typography.fontSize.tinyFontSize,
			height: `calc(${spacing.spacing.spacingSm}px + 6px)`
		},
		button: {
			primary: {
				borderRadius: "16px",
				padding: "0 16px"
			},
			secondary: {
				borderRadius: "16px",
				padding: "0 16px"
			},
			invertSecondary: {
				borderRadius: "16px"
			},
			vertical: {
				fontSize: typography.fontSize.tinyFontSize
			},
			iconButton: {
				borderRadius: "50%"
			},
			secondaryIcon: {
				borderRadius: "50%"
			},
			invertIcon: {
				borderRadius: "50%"
			},
			primaryIcon: {
				borderRadius: "50%"
			}
		},
		quickAccessButton: {
			borderRadius: "16px"
		},
		calendar: {
			weekView: {
				header: {
					padding: `${spacing.spacing.spacingSm}px`
				},
				day: {
					padding: "0"
				},
				dayContent: {
					gap: `${spacing.spacing.spacingSm}px`
				}
			}
		},
		callout: {
			headerSuffix: {
				fontSize: typography.fontSize.bigFontSize
			}
		},
		contentBox: {
			contentBoxBG: "unset",
			contentBoxBorderRadius: "8px",
			heading: {
				borderRadius: "8px 8px 0 0"
			},
			content: {
				borderRadius: "0 0 8px 8px"
			},
			footer: {
				borderRadius: "0 0 8px 8px"
			},
			actionBarGroup: {
				secondLevelPadding: "4px 6px"
			},
			tile: {
				heading: {
					borderBottom: `2px solid ${TILE_COLOR}`
				},
				icon: {
					background: TILE_COLOR
				},
				title: {
					color: TILE_COLOR
				}
			}
		},
		chat: {
			userInfo: {
				avatar: {
					image: {
						size: typography.fontSize.mediumFontSize
					}
				}
			}
		},
		dropdown: {
			graphic: {
				lineHeight: `${spacing.base}px`
			},
			horizontal: {
				item: {
					graphic: {
						size: `${spacing.spacing.spacingMd}px`
					},
					label: {
						fontSize: typography.fontSize.tinyFontSize
					}
				}
			},
			secondaryText: {
				fontSize: typography.fontSize.tinyFontSize
			}
		},
		editor: {
			toolbar: {
				item: {
					dropdownIcon: { fontSize: typography.fontSize.lgFontSize },
					icon: {
						fontSize: typography.fontSize.hugeFontSize
					},
					padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
					width: 2.5 * spacing.base + "px"
				}
			}
		},
		filterBar: {
			content: {
				padding: `0 0 ${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`,
				spacingBottom: `${spacing.verticalSpacing.vertWhiteSpacingxs}px`
			},
			action: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px calc(${spacing.verticalSpacing.vertWhiteSpacingxs}px / 2)`,
				width: "auto"
			}
		},
		globalMessageBox: {
			content: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px 0`
			}
		},
		headerTrigger: {
			graphicFontSize: typography.fontSize.lgFontSize,
			minHeight: spacing.spacing.spacingLg + spacing.spacing.spacing2xs + "px",
			multilingual: {
				graphicFontSize: typography.fontSize.lgFontSize
			},
			vertical: {
				graphicFontSize: typography.fontSize.lgFontSize,
				languageFontSize: typography.fontSize.tinyFontSize
			}
		},
		list: {
			item: {
				buttonSemanticsGap: `${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				graphic: {
					iconFontSize: typography.fontSize.hugeFontSize
				},
				minHeight: 2 * spacing.spacing.spacingMd + "px",
				text: {
					fontSize: typography.fontSize.smallFontSize
				}
			},
			subHeader: {
				height: `${2 * spacing.base}px`
			}
		},
		masterDetailLayout: {
			borderRadius: 0
		},
		menu: {
			icon: {
				additional: {
					fontSize: typography.fontSize.bigFontSize
				},
				fontSize: typography.fontSize.hugeFontSize,
				horizontalHeight: `${spacing.spacing.spacingMd - 4}px`,
				minWidth: typography.fontSize.hugeFontSize
			},
			link: {
				minHeight: `${spacing.spacing.spacingXl - 4}px`
			},
			label: {
				textTransform: "uppercase"
			},
			placeholder: {
				fontSize: typography.fontSize.mediumFontSize,
				height: `calc(${typography.fontSize.bigFontSize} + ${2 * spacing.verticalSpacing.vertWhiteSpacing2xs}px)`,
				width: `calc(${typography.fontSize.bigFontSize} + ${2 * spacing.horizontalSpacing.horizWhiteSpacing2xs}px)`
			},
			triggerButton: {
				iconFontSize: typography.fontSize.hugeFontSize
			},
			mainLayer: {
				horizontalPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingmd}px`
			}
		},
		pagination: {
			simple: {
				button: {
					iconFontSize: typography.fontSize.hugeFontSize
				}
			},
			select: {
				title: {
					height: `${spacing.spacing.spacingMd}px`
				}
			}
		},
		popupMenu: {
			button: {
				fontSize: typography.fontSize.mediumFontSize,
				icon: {
					fontSize: typography.fontSize.bigFontSize
				}
			},
			menu: {
				minWidth: `${spacing.spacing.spacing2Xl * 2}px`
			},
			header: {
				minHeight: `${spacing.spacing.spacingXl}px`
			}
		},
		status: {
			icon: {
				height: `${spacing.spacing.spacingMd}px`,
				lineHeight: `${spacing.base + 2}px`
			},
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs - 1}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		switch: {
			thumb: {
				active: {
					size: `${spacing.spacing.spacingMd - 2}px`
				},
				hover: { size: `${spacing.spacing.spacingMd - 2}px` },
				iconSize: typography.fontSize.lgFontSize,
				size: `${spacing.spacing.spacingMd - 4}px`
			},
			track: {
				width: `${spacing.spacing.spacingLg}px`
			}
		},
		table: {
			bodyCell: {
				minHeight: spacing.spacing.spacingLg + "px"
			},
			headCell: {
				iconFontSize: typography.fontSize.bigFontSize,
				contentMinHeight: `${spacing.spacing.spacingMd}px`
			}
		},
		tag: {
			content: {
				padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs - 1}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
			},
			icon: {
				size: `${spacing.spacing.spacingMd}px`,
				fontSize: typography.fontSize.smallFontSize,
				contentPaddingLeft: `${spacing.spacing.spacingMd + spacing.horizontalSpacing.horizWhiteSpacing2xs}px`
			},
			minHeight: `${spacing.spacing.spacingMd}px`,
			removable: {
				contentPaddingRight: `${spacing.spacing.spacingMd + spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				closeButton: {
					fontSize: typography.fontSize.smallFontSize,
					size: `${spacing.spacing.spacingMd}px`
				}
			}
		},
		timePicker: {
			format: {
				size: `${spacing.spacing.spacingLg}px`
			}
		},
		toast: {
			actions: {
				closeButton: {
					fontSize: typography.fontSize.hugeFontSize
				}
			},
			variantIcon: {
				fontSize: typography.fontSize.hugeFontSize
			}
		},
		toastGroup: {
			width: `${15 * spacing.spacing.spacingLg + spacing.spacing.spacingXs * 2}px`
		},
		tooltip: {
			iconFontSize: typography.fontSize.bigFontSize
		},
		tree: {
			nodeArrow: {
				margin: `${
					spacing.verticalSpacing.vertWhiteSpacingsm - (spacing.spacing.spacingMd + spacing.spacing.spacingXs) * 0.25
				}px 0`,
				button: {
					fontSize: typography.fontSize.hugeFontSize
				}
			},
			nodeIcon: {
				fontSize: typography.fontSize.lgFontSize
			}
		},
		typography: {
			wrapper: {
				minHeight: spacing.spacing.spacingLg + "px",
				padding: `${spacing.verticalSpacing.vertWhiteSpacing3xs}px 0`
			},
			graphic: {
				left: `${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
				iconSize: typography.fontSize.hugeFontSize
			},
			headline2: {
				fontSize: typographyHeadlineCalculation(1.5, 1.35, spacing.base).fontSize,
				height: typographyHeadlineCalculation(1.675, 1.35, spacing.base).height
			},
			headline3: {
				fontSize: typographyHeadlineCalculation(1.275, 1.35, spacing.base).fontSize,
				height: typographyHeadlineCalculation(1.275, 1.35, spacing.base).height
			},
			headline4: {
				fontSize: typographyHeadlineCalculation(1.125, 1.35, spacing.base).fontSize,
				height: typographyHeadlineCalculation(1.125, 1.35, spacing.base).height
			},
			headline5: {
				fontSize: typographyHeadlineCalculation(1, 1.35, spacing.base).fontSize,
				height: typographyHeadlineCalculation(1, 1.35, spacing.base).height
			}
		},
		wizard: {
			navigator: {
				fontSize: typography.fontSize.bigFontSize
			},
			content: {
				iconFontSize: typography.fontSize.bigFontSize,
				wrapper: {
					padding: `${spacing.horizontalSpacing.horizWhiteSpacingxs + 2}px 0`
				}
			}
		},
		baseInput: {
			input: {
				helperText: {
					lineHeight: 1.25
				},
				popupIconFontSize: "1.125rem" // lgFontSize — minimum icon size
			}
		},

		tabPanel: {
			tab: {
				focus: {
					margin: "0 1px"
				}
			}
		}
	}
};
