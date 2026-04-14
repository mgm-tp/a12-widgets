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

import type { FlatThemeType } from "../../../schema.js";
import type { ButtonConfigType } from "../../../default/config/components/button.config.js";
import type { DeepPartial } from "../../../../common/main/utils.js";

const commonButtonConfigs = (theme: FlatThemeType) => {
	const { colors } = theme;

	return {
		buttonActiveBG: colors.interaction.colorBG,
		buttonFocusBG: colors.interaction.colorBG,
		buttonHoverBG: colors.interaction.colorBG
	};
};

export const buttonFlatConfig = (theme: FlatThemeType): DeepPartial<ButtonConfigType> => {
	const buttonConfigs = commonButtonConfigs(theme);
	const { colors, spacing } = theme;

	return {
		primary: {
			borderRadius: `${2 * spacing.spacing.spacingXs}px`,
			boxShadow: "none",
			padding: `0 ${2 * spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		invertPrimary: {
			interaction: {
				active: {
					color: colors.text.invertedColor,
					borderColor: colors.text.invertedColor
				},
				hover: {
					color: colors.text.invertedColor,
					borderColor: colors.text.invertedColor
				}
			}
		},
		secondary: {
			activated: {
				background: colors.interaction.colorBG,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG
					},
					focus: {
						background: buttonConfigs.buttonFocusBG
					},
					hover: {
						background: buttonConfigs.buttonHoverBG
					}
				}
			},
			background: colors.interaction.colorBG,
			borderRadius: `${2 * spacing.spacing.spacingXs}px`,
			destructive: {
				background: colors.interaction.colorBG,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG
					},
					focus: {
						background: buttonConfigs.buttonFocusBG
					},
					hover: {
						background: buttonConfigs.buttonHoverBG
					}
				}
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG
				},
				focus: {
					background: buttonConfigs.buttonFocusBG
				},
				hover: {
					background: buttonConfigs.buttonHoverBG
				}
			},
			padding: `0 ${2 * spacing.horizontalSpacing.horizWhiteSpacingxs}px`
		},
		invertSecondary: {
			borderRadius: `${2 * spacing.spacing.spacingXs}px`,
			interaction: {
				active: {
					color: colors.text.invertedColor,
					borderColor: colors.text.invertedColor
				},
				hover: {
					color: colors.text.invertedColor,
					borderColor: colors.text.invertedColor
				}
			}
		},
		iconButton: {
			color: colors.interaction.color
		},
		secondaryIcon: {
			activated: {
				background: colors.interaction.colorBG,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG
					},
					focus: {
						background: buttonConfigs.buttonFocusBG
					},
					hover: {
						background: buttonConfigs.buttonHoverBG
					}
				}
			},
			background: colors.interaction.colorBG,
			border: "2px solid transparent",
			disabled: {
				borderColor: "transparent"
			},
			destructive: {
				background: colors.interaction.colorBG,
				interaction: {
					active: {
						background: buttonConfigs.buttonActiveBG
					},
					focus: {
						background: buttonConfigs.buttonFocusBG
					},
					hover: {
						background: buttonConfigs.buttonHoverBG
					}
				}
			},
			interaction: {
				active: {
					background: buttonConfigs.buttonActiveBG
				},
				focus: {
					background: buttonConfigs.buttonFocusBG
				},
				hover: {
					background: buttonConfigs.buttonHoverBG
				}
			}
		},
		verticalPrimary: {
			boxShadow: "none"
		},
		verticalSecondary: {
			activated: {
				background: colors.interaction.colorBG
			},
			background: colors.interaction.colorBG,
			border: "2px solid transparent",
			destructive: {
				background: colors.interaction.colorBG
			},
			disabled: {
				borderColor: "transparent"
			}
		}
	};
};
