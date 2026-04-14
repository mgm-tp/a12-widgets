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

export type DiagramConfigType = {
	grid: { point: { circleBackground: string; innerShapeBackground: string } };
	label: {
		background: string;
		border: string;
		boxShadow: string;
		color: string;
		focusBorderColor: string;
		fontFamily: string;
		gap: string;
		hoverBorderColor: string;
		mainLabel: { borderRadius: string | number; fontSize: string; fontWeight: number; height: string };
		padding: string;
		selected: {
			background: string;
			borderColor: string;
			color: string;
			leftEdge: {
				border: string;
				mainLabel: { height: string; top: string };
				subLabel: { height: string; top: string };
			};
		};
		subLabel: { borderRadius: string | number; fontSize: string; fontWeight: number; height: string };
		readOnly: {
			background: string;
		};
	};
	node: {
		background: string;
		border: string;
		boxShadow: string;
		color: string;
		focusBorderColor: string;
		fontFamily: string;
		fontSize: string;
		fontWeight: number;
		height: string;
		hoverBorderColor: string;
		leftEdgeBorder: string;
		link: { border: string };
		padding: string;
		selectedBG: string;
		selectedColor: string;
		width: string;
		readOnly: {
			borderColor: string;
		};
	};
	port: {
		background: string;
		boxShadow: string;
		cornerPoint: { size: string };
		hoverBG: string;
		interactiveBoxShadow: string;
		selectedBG: string;
		size: string;
		readOnly: {
			background: string;
		};
	};
};

export const diagramConfig = (theme: BaseThemeType): DiagramConfigType => {
	const {
		spacing: { spacing, horizontalSpacing },
		colors,
		typography
	} = theme;

	const commonConfigs = {
		color: "#202e5d",
		selectedColor: "#CDEDFE",
		selectedColorDark: "#0573ad",
		boxShadow: `0 1px 2px 0 ${rgba(32, 46, 93, 0.4)}`,
		nodeBorderColor: "#00589f"
	};

	return {
		node: {
			background: colors.background.primaryBackground,
			border: `2px solid ${commonConfigs.nodeBorderColor}`,
			color: commonConfigs.color,
			height: "80px",
			width: "160px",
			fontFamily: typography.font.MAIN_FONT,
			fontSize: "0.85rem",
			fontWeight: typography.fontWeight.semiBoldFontWeight,
			padding: `${spacing.spacingXs}px`,
			selectedBG: commonConfigs.selectedColor,
			selectedColor: commonConfigs.color,
			leftEdgeBorder: `4px solid ${commonConfigs.nodeBorderColor}`,
			boxShadow: commonConfigs.boxShadow,
			hoverBorderColor: colors.interaction.hover.color,
			focusBorderColor: colors.interaction.focus.color,
			link: {
				border: `2px dashed ${commonConfigs.nodeBorderColor}`
			},
			readOnly: {
				borderColor: colors.interaction.readonly.color
			}
		},
		label: {
			background: "#ebf1f7",
			border: "2px solid transparent",
			boxShadow: commonConfigs.boxShadow,
			color: commonConfigs.color,
			fontFamily: typography.font.MAIN_FONT,
			gap: `${horizontalSpacing.horizWhiteSpacingxs}px`,
			mainLabel: {
				borderRadius: "13px",
				fontSize: "0.85rem",
				fontWeight: typography.fontWeight.semiBoldFontWeight,
				height: "26px"
			},
			subLabel: {
				borderRadius: "10px",
				fontSize: "0.75rem",
				fontWeight: typography.fontWeight.regularFontWeight,
				height: "20px"
			},
			padding: `0 ${horizontalSpacing.horizWhiteSpacingxs}px`,
			selected: {
				background: commonConfigs.selectedColor,
				borderColor: commonConfigs.selectedColorDark,
				color: commonConfigs.color,
				leftEdge: {
					border: `4px solid ${commonConfigs.selectedColorDark}`,
					mainLabel: {
						top: "5px",
						height: "16px"
					},
					subLabel: {
						top: "3px",
						height: "14px"
					}
				}
			},
			hoverBorderColor: colors.interaction.hover.color,
			focusBorderColor: colors.interaction.focus.color,
			readOnly: {
				background: colors.background.interactiveBackground
			}
		},
		port: {
			background: "#079ae9",
			boxShadow: `inset 0 0 2px 0 ${colors.background.primaryBackground}`,
			size: "8px",
			cornerPoint: {
				size: "4px"
			},
			interactiveBoxShadow: commonConfigs.boxShadow,
			hoverBG: colors.interaction.hover.color,
			selectedBG: commonConfigs.selectedColorDark,
			readOnly: {
				background: colors.interaction.readonly.colorDark
			}
		},
		grid: {
			point: {
				circleBackground: "#D9EBFA",
				innerShapeBackground: "#9FCBF0"
			}
		}
	};
};
