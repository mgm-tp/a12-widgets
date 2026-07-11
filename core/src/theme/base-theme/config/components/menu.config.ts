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

import type { BaseThemeCore } from "../../schema.js";
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";
import { mergeConfig } from "../../utils/merge-config.js";

export type MenuConfigType = {
	header: { item: { focus: { borderBottom: string } } };
	icon: {
		additional: {
			color: string;
			fontSize: string;
			height: string;
			padding: string;
			variant: {
				error: string;
				info: string;
				warning: string;
				text: {
					error: string;
					info: string;
					warning: string;
				};
			};
		};
		status: {
			variant: {
				open: string;
				info: string;
				error: string;
				warning: string;
				inProgress?: string;
				done: string;
			};
		};
		color: string;
		fontSize: string;
		horizontalHeight: string;
		minWidth: string;
		verticalColor: string;
		verticalHeight: string;
	};
	item: {
		disabledColor: string;
		horizontal: {
			active: { borderBottom: string };
			badge: {
				backgroundColor: {
					warning: string;
				};
			};
			focus: { border: string; borderBottom: string; customBorder?: CustomBorder };
			hover: { borderBottom: string; fontStyle?: string };
			margin: string;
			selected: {
				background: string;
				border: string;
				borderBottom: string;
				color: string;
				focus: { border: string; borderBottom: string; customBorder?: CustomBorder };
				fontWeight?: string | number;
				hover?: {
					borderBottom: string;
					color: string;
					cursor: string;
					fontStyle?: string;
				};
			};
		};
		placeholderDisabled: { background: string; color: string };
		subHorizontal: {
			active: { background: string; border: string };
			focus: { background: string; border: string; outline: string; customBorder?: CustomBorder };
			hover: { background: string; border: string; fontStyle?: string };
			selected: {
				activeBorderLeft: string;
				background: string;
				borderLeft: string;
				focusBorderLeft: string;
				hoverBorderLeft: string;
				textColor: string;
				fontWeight?: string | number;
				hover?: {
					borderBottom: string;
					color: string;
					cursor: string;
					fontStyle?: string;
				};
			};
		};
		vertical: {
			active: { background: string; border: string };
			borderBottom: string;
			focus: { background: string; border: string; outline: string; customBorder?: CustomBorder };
			hover: { background: string; border: string; fontStyle?: string };
			selected: {
				activeBorderLeft: string;
				background: string;
				borderLeft: string;
				focusBorderLeft: string;
				hoverBorderLeft: string;
				color?: string;
				fontWeight?: string | number;
				hover?: {
					borderBottom: string;
					color: string;
					cursor: string;
					fontStyle?: string;
				};
			};
			icon: {
				status: {
					variant: {
						open: string;
						info: string;
						error: string;
						warning: string;
						done: string;
					};
				};
			};
		};
	};
	label: {
		childrenSpacing: string;
		color: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		textTransform: string;
		verticalColor: string;
	};
	link: {
		badgeRightPos: string;
		horizontalChildrenSpacing: string;
		minHeight: string;
		padding: string;
		subHorizontalPadding: string;
		vertical: { childrenSpacing: string; padding: string };
	};
	mainLayer: { horizontalBG: string; horizontalPadding: string; verticalBG: string };
	mainMenu: {
		before: { background: string };
		borderBottom: string;
		borderTop: string;
		item: {
			active: { background: string; border: string; borderBottom: string; borderRadius: string; color: string };
			background: string;
			border: string;
			borderBottom: string;
			borderRadius: string;
			color: string;
			disabledColor: string;
			focus: {
				background: string;
				border: string;
				borderBottom: string;
				borderRadius: string;
				color: string;
				customBorder?: CustomBorder;
			};
			fontSize: string;
			hover: {
				background: string;
				border: string;
				borderBottom: string;
				borderRadius: string;
				color: string;
				cursor: string;
				fontStyle?: string;
			};
			selected: {
				active: {
					background: string;
					border: string;
					borderBottom: string;
					borderRadius: string;
					color: string;
				};
				background: string;
				border: string;
				borderBottom: string;
				borderRadius: string;
				color: string;
				disabledColor: string;
				focus: {
					background: string;
					border: string;
					borderBottom: string;
					borderRadius: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderBottom: string;
					borderRadius: string;
					color: string;
					cursor: string;
					fontStyle?: string;
				};
				fontWeight?: string | number;
			};
			textTransform: string;
			fontWeight?: string | number;
		};
		mainLayer: { background: string };
		subLayer: { background: string };
	};
	placeholder: {
		background: string;
		color: string;
		fontSize: string;
		fontStyle: string;
		fontWeight: number;
		height: string;
		width: string;
	};
	slidingMenu: { background: string; height: string };
	subLayer: {
		background: string;
		boxShadow: string;
		minWidth: string;
		verticalBG: string;

		/** @deprecated since v38.0.0 */
		badge?: {
			overflowCountMargin: string;
			margin: string;
		};

		/** @deprecated since v38.0.0 */
		tinyBadge?: {
			margin: string;
		};
	};
	tabNavigation: {
		borderBottom: string;
		borderTop: string;
		item: {
			active: { background: string; border: string; borderBottom: string; borderRadius: string; color: string };
			background: string;
			border: string;
			borderBottom: string;
			borderRadius: string;
			color: string;
			disabledColor: string;
			focus: {
				background: string;
				border: string;
				borderBottom: string;
				borderRadius: string;
				color: string;
				customBorder?: CustomBorder;
			};
			fontSize: string;
			hover: {
				background: string;
				border: string;
				borderBottom: string;
				borderRadius: string;
				color: string;
				cursor: string;
				fontStyle?: string;
			};
			selected: {
				active: {
					background: string;
					border: string;
					borderBottom: string;
					borderRadius: string;
					color: string;
				};
				background: string;
				border: string;
				borderBottom: string;
				borderRadius: string;
				color: string;
				disabledColor: string;
				focus: {
					background: string;
					border: string;
					borderBottom: string;
					borderRadius: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderBottom: string;
					borderRadius: string;
					color: string;
					cursor: string;
					fontStyle?: string;
				};
				fontWeight?: string | number;
			};
			textTransform: string;
			fontWeight?: string | number;
		};
		mainLayer: { background: string };
		subLayer: { background: string };
	};
	triggerButton: { iconColor: string; iconFontSize: string; badgeRightPos: string; badgeTopPos: string };
	group: {
		divider: {
			padding: string;
			background: string;
			width: string;
		};
		hover: {
			cursor: string;
		};
		background: string;
		fontSize: string;
		fontWeight: string;
		padding: string;
	};
};

const commonItemConfigs = (theme: BaseThemeCore) => {
	const colors = theme.colors;
	const focusStyles = theme.focusStyles;

	return {
		active: {
			background: "transparent",
			border: "none",
			borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
			borderRadius: "0",
			color: colors.text.invertedColor
		},
		background: "transparent",
		border: "none",
		borderBottom: "none",
		borderRadius: "0",
		disabledColor: colors.interaction.disabled.colorDark,
		hover: {
			background: "transparent",
			border: "none",
			borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
			borderRadius: "0",
			color: colors.text.invertedColor,
			cursor: "pointer"
		},
		focus: {
			background: "transparent",
			border: focusStyles.focusedBoundaryLight,
			borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
			borderRadius: "0",
			color: colors.text.invertedColor
		},
		selected: {
			active: {
				background: "transparent",
				border: "none",
				borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
				borderRadius: "0",
				color: colors.text.invertedColor
			},
			background: "transparent",
			border: "none",
			borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
			borderRadius: "0",
			color: colors.text.invertedColor,
			disabledColor: colors.interaction.disabled.colorDark,
			focus: {
				background: "transparent",
				border: focusStyles.focusedBoundaryLight,
				borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
				borderRadius: "0",
				color: colors.text.invertedColor
			},
			hover: {
				background: "transparent",
				border: "none",
				borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
				borderRadius: "0",
				color: colors.text.invertedColor,
				cursor: "pointer"
			}
		}
	};
};

const defaultMenuConfig = (theme: BaseThemeCore): MenuConfigType => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const focusStyles = theme.focusStyles;
	const divisionLineStyles = theme.divisionLineStyles;
	const itemConfigs = commonItemConfigs(theme);

	return {
		header: {
			item: {
				focus: {
					borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`
				}
			}
		},
		icon: {
			additional: {
				color: colors.text.invertedColor,
				fontSize: typography.fontSize.lgFontSize,
				height: spacing.spacing.spacing2xs + "px",
				padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
				variant: {
					error: colors.variant.errorColor,
					info: colors.variant.infoColor,
					warning: colors.variant.warningColor,
					text: {
						error: colors.variant.text.error,
						info: colors.variant.text.info,
						warning: colors.variant.text.warning
					}
				}
			},
			status: {
				variant: {
					open: colors.text.invertedColor,
					info: colors.text.invertedColor,
					error: colors.text.invertedColor,
					warning: colors.text.invertedColor,
					inProgress: colors.text.invertedColor,
					done: colors.text.invertedColor
				}
			},
			color: colors.text.invertedColor,
			fontSize: typography.fontSize.lgFontSize,
			horizontalHeight: `${spacing.spacing.spacingMd - spacing.spacing.spacing3xs}px`,
			minWidth: typography.fontSize.bigFontSize,
			verticalColor: colors.graphicSecondaryColorDark,
			verticalHeight: `${spacing.spacing.spacingMd - 4}px`
		},
		item: {
			disabledColor: itemConfigs.disabledColor,
			horizontal: {
				badge: {
					backgroundColor: {
						warning: colors.variant.warningColor
					}
				},
				active: {
					borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`
				},
				hover: {
					borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`
				},
				focus: {
					border: itemConfigs.focus.border,
					borderBottom: itemConfigs.focus.borderBottom
				},
				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
				selected: { ...itemConfigs.selected }
			},
			placeholderDisabled: {
				background: colors.interaction.disabled.color,
				color: colors.text.invertedColor
			},
			subHorizontal: {
				active: {
					background: colors.shadow.overlaySoft,
					border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouchInverted}`
				},
				focus: {
					background: colors.shadow.overlaySoft,
					border: `${theme.border.width.medium} solid ${colors.interaction.focus.colorInverted}`,
					outline: focusStyles.focusedBoundaryLight
				},
				hover: {
					background: colors.shadow.overlaySoft,
					border: `${theme.border.width.medium} solid ${colors.interaction.hover.colorInverted}`
				},
				selected: {
					activeBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.active.colorTouchInverted}`,
					background: colors.shadow.overlayDark,
					borderLeft: `${theme.border.width.thick} solid ${colors.interaction.selected.colorInverted}`,
					textColor: colors.text.invertedColor,
					focusBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.focus.colorInverted}`,
					hoverBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.focus.colorInverted}`,
					hover: {
						borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
						color: colors.text.invertedColor,
						cursor: "pointer"
					}
				}
			},
			vertical: {
				active: {
					background: colors.interaction.active.colorTouchInverted,
					border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`
				},
				borderBottom: `${theme.border.width.thin} solid ${colors.divider.color}`,
				focus: {
					background: colors.interaction.focus.colorInverted,
					border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
					outline: focusStyles.focusedBoundaryDark
				},
				hover: {
					background: colors.interaction.hover.colorInverted,
					border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
				},
				selected: {
					activeBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.active.colorTouch}`,
					background: colors.interaction.selected.colorLight,
					borderLeft: `${theme.border.width.thick} solid ${colors.interaction.selected.color}`,
					focusBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.focus.color}`,
					hoverBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.hover.color}`,
					hover: {
						borderBottom: `${theme.border.width.thick} solid ${colors.divider.colorLight}`,
						color: colors.text.invertedColor,
						cursor: "pointer"
					}
				},
				icon: {
					status: {
						variant: {
							open: colors.text.color,
							info: colors.variant.infoColor,
							error: colors.variant.errorColor,
							warning: colors.variant.warningColorDark,
							done: colors.variant.successColor
						}
					}
				}
			}
		},
		link: {
			horizontalChildrenSpacing: `${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			minHeight: `${spacing.spacing.spacingXl}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			subHorizontalPadding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			vertical: {
				childrenSpacing: `${spacing.verticalSpacing.vertWhiteSpacingsm}px`,
				padding: `${spacing.verticalSpacing.vertWhiteSpacingxs}px ${spacing.verticalSpacing.vertWhiteSpacingsm}px`
			},
			badgeRightPos: `-${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		},
		label: {
			color: colors.text.invertedColor,
			childrenSpacing: `0 ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px 0 0`,
			fontSize: typography.fontSize.tinyFontSize,
			fontFamily: typography.font.MAIN_FONT,
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			textTransform: "none",
			verticalColor: colors.text.color
		},
		mainLayer: {
			horizontalBG: colors.secondaryColor,
			horizontalPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			verticalBG: colors.background.primaryBackground
		},
		mainMenu: {
			before: {
				background: "transparent"
			},
			borderBottom: divisionLineStyles.bottomLine,
			borderTop: divisionLineStyles.topLine,
			mainLayer: {
				background: colors.secondaryColor
			},
			subLayer: {
				background: colors.placeHolderBackgroundDark
			},
			item: {
				color: colors.text.invertedColor,
				fontSize: typography.fontSize.tinyFontSize,
				textTransform: "uppercase",
				...itemConfigs,
				selected: itemConfigs.selected
			}
		},
		placeholder: {
			background: colors.placeHolderBackgroundDark,
			color: colors.text.invertedColor,
			fontSize: typography.fontSize.tinyFontSize,
			fontStyle: "normal",
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			height: `calc(${typography.fontSize.mediumFontSize} + ${2 * spacing.verticalSpacing.vertWhiteSpacing2xs}px)`,
			width: `calc(${typography.fontSize.mediumFontSize} + ${2 * spacing.horizontalSpacing.horizWhiteSpacing2xs}px)`
		},
		slidingMenu: {
			background: colors.background.primaryBackground,
			height: `calc(100% - ${theme.spacing.baseSpacing.BASE * 3}px)`
		},
		subLayer: {
			background: colors.placeHolderBackgroundDark,
			boxShadow: `0 1px 4px 0 ${rgba(colors.boxShadowBackground, theme.opacity.low)}`,
			minWidth: 2.5 * spacing.spacing.spacing2Xl + "px",
			verticalBG: colors.background.primaryBackground
		},
		tabNavigation: {
			borderBottom: divisionLineStyles.bottomLine,
			borderTop: divisionLineStyles.topLine,
			mainLayer: {
				background: colors.secondaryColor
			},
			subLayer: {
				background: colors.placeHolderBackgroundDark
			},
			item: {
				color: colors.text.invertedColor,
				fontSize: typography.fontSize.tinyFontSize,
				textTransform: "uppercase",
				...itemConfigs,
				selected: itemConfigs.selected
			}
		},
		triggerButton: {
			iconColor: colors.text.invertedColor,
			iconFontSize: typography.fontSize.bigFontSize,
			badgeRightPos: `-${spacing.horizontalSpacing.horizWhiteSpacingxs}px`,
			badgeTopPos: `-${spacing.verticalSpacing.vertWhiteSpacingxs}px`
		},
		group: {
			divider: {
				background: colors.divider.color,
				padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px`,
				width: theme.border.width.thin
			},
			hover: {
				cursor: "pointer"
			},
			background: colors.background.secondaryBackground,
			fontSize: typography.fontSize.tinyFontSize,
			fontWeight: `${typography.fontWeight.regularFontWeight}`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`
		}
	};
};

const _overrideCommonItemConfigs = (theme: BaseThemeCore) => {
	const colors = theme.colors;

	return {
		active: {
			border: "none",
			borderBottom: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`,
			color: colors.interaction.primaryInteractionColor
		},
		hover: {
			border: "none",
			borderBottom: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`,
			color: colors.interaction.primaryInteractionColor
		},
		focus: {
			borderBottom: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`,
			color: colors.interaction.primaryInteractionColor
		},
		selected: {
			border: "none",
			borderBottom: `${theme.border.width.medium} solid ${colors.interaction.color}`,
			color: colors.text.color,
			focus: {
				borderBottom: `${theme.border.width.medium} solid ${colors.interaction.color}`,
				color: colors.interaction.primaryInteractionColor
			},
			hover: {
				borderBottom: `${theme.border.width.medium} solid ${colors.interaction.color}`,
				color: colors.text.color
			}
		}
	};
};

export const menuOverrides = (theme: BaseThemeCore) => {
	const spacing = theme.spacing;
	const colors = theme.colors;
	const typography = theme.typography;
	const itemConfigs = _overrideCommonItemConfigs(theme);
	const navBg = colors.background.navigationBackground;
	const navAccent = colors.background.navigationAccent;

	return {
		header: {
			item: {
				focus: {
					borderBottom: `${theme.border.width.medium} solid ${colors.interaction.color}`
				}
			}
		},
		icon: {
			color: colors.interaction.primaryInteractionColor,
			status: {
				variant: {
					open: colors.text.color,
					info: colors.variant.infoColor,
					error: colors.variant.errorColor,
					warning: colors.variant.warningColorDark,
					done: colors.variant.successColor
				}
			}
		},
		item: {
			horizontal: {
				active: {
					borderBottom: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`
				},
				badge: {
					backgroundColor: {
						warning: colors.variant.warningColorDark
					}
				},
				hover: {
					borderBottom: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
				},
				focus: {
					borderBottom: itemConfigs.focus.borderBottom
				},

				margin: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
				selected: {
					borderBottom: itemConfigs.selected.borderBottom,
					color: colors.interaction.color,
					focus: {
						borderBottom: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`
					},
					hover: {
						borderBottom: itemConfigs.selected.borderBottom,
						color: colors.interaction.color
					}
				}
			},
			placeholderDisabled: {
				background: "transparent",
				color: colors.interaction.disabled.colorDark
			},
			subHorizontal: {
				active: {
					background: colors.interaction.active.colorTouchInverted,
					border: `${theme.border.width.medium} solid ${colors.interaction.active.colorTouch}`
				},
				focus: {
					background: colors.interaction.focus.colorInverted,
					border: `${theme.border.width.medium} solid ${colors.interaction.focus.color}`
				},
				hover: {
					background: colors.interaction.hover.colorInverted,
					border: `${theme.border.width.medium} solid ${colors.interaction.hover.color}`
				},
				selected: {
					activeBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.active.colorTouch}`,
					background: colors.background.primaryBackground,
					borderLeft: `${theme.border.width.thick} solid ${colors.interaction.selected.color}`,
					textColor: colors.interaction.selected.color,
					focusBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.focus.color}`,
					hoverBorderLeft: `${theme.border.width.thick} solid ${colors.interaction.hover.color}`,
					hover: {
						borderBottom: itemConfigs.selected.borderBottom,
						color: colors.interaction.selected.color
					}
				}
			},
			vertical: {
				selected: {
					background: colors.interaction.selected.colorInverted
				}
			}
		},
		label: {
			color: colors.interaction.primaryInteractionColor
		},
		mainLayer: {
			horizontalPadding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingsm}px`,
			verticalBG: navBg
		},
		mainMenu: {
			before: {
				background: navAccent
			},
			borderTop: "none",
			mainLayer: {
				background: navBg
			},
			subLayer: {
				background: navBg
			},
			item: {
				color: colors.interaction.primaryInteractionColor,
				fontSize: typography.fontSize.smallFontSize,
				textTransform: "none",
				...itemConfigs
			}
		},
		placeholder: {
			background: "transparent",
			color: colors.interaction.primaryInteractionColor
		},
		slidingMenu: {
			background: navBg
		},
		subLayer: {
			background: navBg,
			verticalBG: navBg
		},
		tabNavigation: {
			mainLayer: {
				background: colors.background.primaryBackground
			},
			subLayer: {
				background: colors.background.primaryBackground
			},
			item: {
				color: colors.interaction.primaryInteractionColor,
				fontSize: typography.fontSize.smallFontSize,
				textTransform: "none",
				...itemConfigs
			}
		},
		triggerButton: {
			iconColor: colors.interaction.primaryInteractionColor
		}
	};
};

export const menuConfig = (theme: BaseThemeCore) => mergeConfig(defaultMenuConfig(theme), menuOverrides(theme));
