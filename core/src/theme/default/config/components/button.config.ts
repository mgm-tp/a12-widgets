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
import type { CustomBorder } from "../../../base/mixins/_borderEffects.js";

export type ButtonConfigType = {
	border: string;
	borderWidth: string;
	fontFamily: string;
	fontSize: string;
	fontWeight: string;
	iconButton: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		borderRadius: string | number;
		color: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			color: string;
		};
		fontSize: string;
		minHeight?: string;
		size: string;
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				borderRadius?: string | number;
			};
		};
	};
	invertIcon: {
		activated: {
			background: string;
			borderRadius: string | number;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					outline: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		borderRadius: string | number;
		color: string;
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				borderRadius?: string | number;
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			color: string;
		};
	};
	invertPrimary: {
		background: string;
		borderWidth: string;
		boxShadow: string;
		color: string;
		disabled: {
			background: string;
			boxShadow: string;
			color: string;
		};
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				textDecoration: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
				borderRadius?: string | number;
			};
		};
	};
	invertSecondary: {
		background: string;
		border: string;
		borderRadius: string | number;
		boxShadow: string;
		color: string;
		disabled: {
			background: string;
			boxShadow: string;
			borderColor?: string;
			color: string;
		};
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				textDecoration: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
				borderRadius?: string | number;
			};
		};
	};
	minHeight: string;
	primary: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		borderRadius: string | number;
		boxShadow: string;
		color: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			color: string;
		};
		padding: string;
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				textDecoration: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
				borderRadius?: string | number;
			};
		};
	};
	primaryIcon: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		borderRadius: string | number;
		boxShadow: string;
		color: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			color: string;
		};
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				borderRadius?: string | number;
			};
		};
	};
	secondary: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		border: string;
		borderRadius: string | number;
		color: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					textDecoration: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			borderColor?: string;
			color: string;
		};
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				outline: string;
				textDecoration: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				textDecoration: string;
				borderRadius?: string | number;
			};
		};
		padding: string;
	};
	secondaryIcon: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		border: string;
		borderRadius: string | number;
		boxShadow: string;
		color: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			borderColor?: string;
			color: string;
		};
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				borderRadius?: string | number;
			};
		};
	};
	textTransform: string;
	vertical: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		borderRadius: string | number;
		color: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			color: string;
		};
		fontSize: string;
		iconFontSize: string;
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				outline: string;
				color: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				borderRadius?: string | number;
			};
		};
		minHeight: string;
		padding: string;
	};
	verticalPrimary: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		boxShadow: string;
		color: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			color: string;
		};
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				borderRadius?: string | number;
			};
		};
	};
	verticalSecondary: {
		activated: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		background: string;
		border: string;
		color: string;
		boxShadow: string;
		destructive: {
			background: string;
			color: string;
			interaction: {
				active: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
				};
				focus: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					customBorder?: CustomBorder;
				};
				hover: {
					background: string;
					border: string;
					borderColor?: string;
					color: string;
					borderRadius?: string | number;
				};
			};
		};
		disabled: {
			background: string;
			boxShadow: string;
			borderColor?: string;
			color: string;
		};
		interaction: {
			active: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
			};
			focus: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				customBorder?: CustomBorder;
			};
			hover: {
				background: string;
				border: string;
				borderColor?: string;
				color: string;
				borderRadius?: string | number;
			};
		};
	};
	loading: {
		background: string;
		circle: { borderWidth: string; color: { default: string; destructive: string }; size: string };
	};
};

export const commonButtonConfigs = (theme: BaseThemeType) => {
	const { colors } = theme;

	return {
		buttonActiveBG: colors.interaction.active.colorTouchInverted,
		buttonActiveColor: colors.interaction.active.colorTouch,
		buttonBorderWidth: "2px",
		buttonFocusBG: colors.interaction.focus.colorInverted,
		buttonFocusColor: colors.interaction.focus.color,
		buttonHoverBG: colors.interaction.hover.colorInverted,
		buttonHoverColor: colors.interaction.hover.color,
		buttonInvertedBG: rgba(0, 0, 0, 0.2)
	};
};

export const getButtonStyles = (theme: BaseThemeType): ButtonConfigType => {
	const buttonConfigs = commonButtonConfigs(theme);
	const { colors, spacing, typography, focusStyles } = theme;

	return {
		border: `${buttonConfigs.buttonBorderWidth} solid transparent`,
		borderWidth: buttonConfigs.buttonBorderWidth,
		fontFamily: typography.font.MAIN_FONT,
		fontSize: typography.fontSize.tinyFontSize,
		fontWeight: "700",
		minHeight: `${2 * spacing.baseSpacing.BASE}px`,
		textTransform: "uppercase",

		/* Primary */
		primary: {
			activated: {
				background: colors.interaction.active.color,
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						textDecoration: "none"
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						textDecoration: "none"
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
						textDecoration: "none"
					}
				}
			},
			background: colors.interaction.primaryInteractionColor,
			borderRadius: "2px",
			boxShadow: `0 1px 2px 0 ${colors.boxShadowBackground}66`,
			color: colors.text.invertedColor,
			destructive: {
				background: colors.variant.destructiveColor,
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						textDecoration: "none"
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						textDecoration: "none"
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
						textDecoration: "none"
					}
				}
			},
			disabled: {
				boxShadow: "none",
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG,
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					textDecoration: "none"
				},
				focus: {
					background: buttonConfigs.buttonFocusBG,
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					outline: focusStyles.focusedBoundaryDark,
					textDecoration: "none"
				},
				hover: {
					background: buttonConfigs.buttonHoverBG,
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					textDecoration: "none"
				}
			},
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacinglg}px`
		},

		/* Invert */
		invertPrimary: {
			background: colors.background.primaryBackground,
			boxShadow: "none",
			borderWidth: buttonConfigs.buttonBorderWidth,
			color: "inherit",
			disabled: {
				background: colors.interaction.disabled.color,
				boxShadow: "none",
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonInvertedBG,
					border: `${buttonConfigs.buttonBorderWidth} solid ${colors.interaction.active.colorTouchInverted}`,
					color: colors.interaction.active.colorTouchInverted,
					textDecoration: "none"
				},
				focus: {
					background: buttonConfigs.buttonInvertedBG,
					border: `${buttonConfigs.buttonBorderWidth} solid ${colors.interaction.focus.colorInverted}`,
					color: colors.interaction.focus.colorInverted,
					outline: `1px dotted ${colors.interaction.focus.colorInverted}`,
					textDecoration: "none"
				},
				hover: {
					background: buttonConfigs.buttonInvertedBG,
					border: `${buttonConfigs.buttonBorderWidth} solid ${colors.interaction.hover.colorInverted}`,
					color: colors.interaction.hover.colorInverted,
					textDecoration: "none"
				}
			}
		},

		/* Secondary */
		secondary: {
			activated: {
				background: "transparent",
				color: colors.interaction.active.color,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,

						textDecoration: "none"
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,

						textDecoration: "none"
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,

						textDecoration: "none"
					}
				}
			},
			background: "transparent",
			border: `${buttonConfigs.buttonBorderWidth} solid transparent`,
			borderRadius: "0",
			color: colors.interaction.secondaryInteractionColor,
			destructive: {
				background: "transparent",
				color: colors.variant.destructiveColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,

						textDecoration: "none"
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,

						textDecoration: "none"
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,

						textDecoration: "none"
					}
				}
			},
			disabled: {
				background: "transparent",
				borderColor: "transparent",
				boxShadow: "none",
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG,
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					textDecoration: "none"
				},
				focus: {
					background: buttonConfigs.buttonFocusBG,
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					outline: focusStyles.focusedBoundaryDark,
					textDecoration: "none"
				},
				hover: {
					background: buttonConfigs.buttonHoverBG,
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					textDecoration: "none"
				}
			},
			padding: `0 ${spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},

		/* Invert Secondary */
		invertSecondary: {
			background: "transparent",
			border: `1px solid ${colors.divider.colorLight}`,
			borderRadius: "2px",
			boxShadow: "none",
			color: colors.text.invertedColor,
			disabled: {
				boxShadow: "none",
				background: "transparent",
				borderColor: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonInvertedBG,
					border: `${buttonConfigs.buttonBorderWidth} solid ${colors.interaction.active.colorTouchInverted}`,
					color: colors.interaction.active.colorTouchInverted,
					textDecoration: "none"
				},
				focus: {
					background: buttonConfigs.buttonInvertedBG,
					border: `${buttonConfigs.buttonBorderWidth} solid ${colors.interaction.focus.colorInverted}`,
					color: colors.interaction.focus.colorInverted,
					outline: `1px dotted ${colors.interaction.focus.colorInverted}`,
					textDecoration: "none"
				},
				hover: {
					background: buttonConfigs.buttonInvertedBG,
					border: `${buttonConfigs.buttonBorderWidth} solid ${colors.interaction.hover.colorInverted}`,
					color: colors.interaction.hover.colorInverted,
					textDecoration: "none"
				}
			}
		},

		/* Icon Button */
		iconButton: {
			activated: {
				background: "transparent",
				color: colors.interaction.active.color,
				interaction: {
					active: {
						background: "transparent",
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: "transparent",
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: "transparent",
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			background: "transparent",
			borderRadius: "50%",
			color: colors.interaction.secondaryInteractionColor,
			destructive: {
				background: "transparent",
				color: colors.variant.destructiveColor,
				interaction: {
					active: {
						background: "transparent",
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: "transparent",
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: "transparent",
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			disabled: {
				background: "transparent",
				boxShadow: "none",
				color: colors.interaction.disabled.colorDark
			},
			fontSize: typography.fontSize.lgFontSize,
			minHeight: "0",
			interaction: {
				active: {
					background: "transparent",
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
				},
				focus: {
					background: "transparent",
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					outline: focusStyles.focusedBoundaryDark
				},
				hover: {
					background: "transparent",
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
				}
			},
			size: `${2 * typography.font.BASE_FONT_SIZE}rem`
		},

		/* Vertical Button */
		vertical: {
			activated: {
				background: "transparent",
				color: colors.interaction.active.color,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			background: "transparent",
			borderRadius: "2px",
			color: colors.interaction.secondaryInteractionColor,
			destructive: {
				background: "transparent",
				color: colors.variant.destructiveColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			disabled: {
				background: "transparent",
				boxShadow: "none",
				color: colors.interaction.disabled.colorDark
			},
			fontSize: typography.fontSize.nanoFontSize,
			iconFontSize: typography.fontSize.hugeFontSize,
			minHeight: `${spacing.spacing.spacingMd * 2}px`,
			padding: `${spacing.verticalSpacing.vertWhiteSpacing2xs}px ${spacing.horizontalSpacing.horizWhiteSpacing2xs}px`,
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG,
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
				},
				focus: {
					background: buttonConfigs.buttonFocusBG,
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					outline: focusStyles.focusedBoundaryDark
				},
				hover: {
					background: buttonConfigs.buttonHoverBG,
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
				}
			}
		},
		verticalPrimary: {
			activated: {
				background: colors.interaction.active.color,
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			background: colors.interaction.primaryInteractionColor,
			boxShadow: `0 1px 2px 0 ${colors.boxShadowBackground}66`,
			color: colors.text.invertedColor,
			destructive: {
				background: colors.variant.destructiveColor,
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			disabled: {
				boxShadow: "none",
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG,
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
				},
				focus: {
					background: buttonConfigs.buttonFocusBG,
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
				},
				hover: {
					background: buttonConfigs.buttonHoverBG,
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
				}
			}
		},
		verticalSecondary: {
			activated: {
				background: "transparent",
				color: colors.interaction.active.color,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			background: "transparent",
			border: `${buttonConfigs.buttonBorderWidth} solid ${colors.divider.color}`,
			boxShadow: "none",
			color: colors.interaction.secondaryInteractionColor,
			destructive: {
				background: "transparent",
				color: colors.variant.destructiveColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			disabled: {
				boxShadow: "none",
				background: "transparent",
				borderColor: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG,
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
				},
				focus: {
					background: buttonConfigs.buttonFocusBG,
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
				},
				hover: {
					background: buttonConfigs.buttonHoverBG,
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
				}
			}
		},
		invertIcon: {
			activated: {
				background: rgba(0, 0, 0, 0.4),
				borderRadius: "2px",
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: rgba(0, 0, 0, 0.2),
						color: colors.interaction.active.colorTouchInverted,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
						borderColor: colors.interaction.active.colorTouchInverted
					},
					hover: {
						background: rgba(0, 0, 0, 0.2),
						color: colors.interaction.focus.colorInverted,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
						borderColor: colors.interaction.focus.colorInverted
					},
					focus: {
						background: rgba(0, 0, 0, 0.2),
						color: colors.interaction.focus.colorInverted,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
						borderColor: colors.interaction.focus.colorInverted,
						outline: `1px dotted ${colors.interaction.focus.colorInverted}`
					}
				}
			},
			background: "transparent",
			borderRadius: "50%",
			color: colors.text.invertedColor,
			disabled: {
				background: "transparent",
				boxShadow: "none",
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: rgba(0, 0, 0, 0.2),
					color: colors.interaction.active.colorTouchInverted,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`,
					borderColor: colors.interaction.active.colorTouchInverted
				},
				hover: {
					background: rgba(0, 0, 0, 0.2),
					color: colors.interaction.focus.colorInverted,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`,
					borderColor: colors.interaction.focus.colorInverted
				},
				focus: {
					background: rgba(0, 0, 0, 0.2),
					color: colors.interaction.focus.colorInverted,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`,
					borderColor: colors.interaction.focus.colorInverted,
					outline: `1px dotted ${colors.interaction.focus.colorInverted}`
				}
			}
		},
		primaryIcon: {
			activated: {
				background: colors.interaction.active.color,
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			background: colors.interaction.primaryInteractionColor,
			borderRadius: "50%",
			boxShadow: "none",
			color: colors.text.invertedColor,
			destructive: {
				background: colors.variant.destructiveColor,
				color: colors.text.invertedColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			disabled: {
				boxShadow: "none",
				background: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG,
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
				},
				focus: {
					background: buttonConfigs.buttonFocusBG,
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
				},
				hover: {
					background: buttonConfigs.buttonHoverBG,
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
				}
			}
		},
		secondaryIcon: {
			activated: {
				background: colors.background.primaryBackground,
				color: colors.interaction.active.color,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			background: colors.background.primaryBackground,
			border: `${buttonConfigs.buttonBorderWidth} solid ${colors.divider.color}`,
			borderRadius: "50%",
			boxShadow: "none",
			color: colors.interaction.secondaryInteractionColor,
			destructive: {
				background: colors.background.primaryBackground,
				color: colors.variant.destructiveColor,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG,
						color: buttonConfigs.buttonActiveColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
					},
					focus: {
						background: buttonConfigs.buttonFocusBG,
						color: buttonConfigs.buttonFocusColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
					},
					hover: {
						background: buttonConfigs.buttonHoverBG,
						color: buttonConfigs.buttonHoverColor,
						border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
					}
				}
			},
			disabled: {
				boxShadow: "none",
				background: "transparent",
				borderColor: colors.interaction.disabled.color,
				color: colors.interaction.disabled.colorDark
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG,
					color: buttonConfigs.buttonActiveColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonActiveColor}`
				},
				focus: {
					background: buttonConfigs.buttonFocusBG,
					color: buttonConfigs.buttonFocusColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonFocusColor}`
				},
				hover: {
					background: buttonConfigs.buttonHoverBG,
					color: buttonConfigs.buttonHoverColor,
					border: `${buttonConfigs.buttonBorderWidth} solid ${buttonConfigs.buttonHoverColor}`
				}
			}
		},

		/* Loading Buttons */
		loading: {
			background: colors.background.primaryBackground,
			circle: {
				borderWidth: buttonConfigs.buttonBorderWidth,
				color: {
					default: colors.interaction.secondaryInteractionColor,
					destructive: colors.variant.errorColor
				},
				size: `${spacing.baseSpacing.BASE + 4}px`
			}
		}
	};
};
