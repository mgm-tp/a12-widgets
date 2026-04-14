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

import { styled, css } from "styled-components";

import { active, darkFocus, hover } from "../../theme/base/mixins/_interaction.js";
import { StyledIconWrapper } from "../../icon/main/icon.view.js";
import { createBorder } from "../../theme/base/mixins/_borderEffects.js";

import type { AccordionVariant, AccordionProps } from "./accordion.api.js";

export const AccordionContainer = styled.div.withConfig({ displayName: "StyledAccordionContainer-sc-" })(
	({ theme }) => {
		return css`
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			font-family: ${theme.components.accordion.fontFamily};
			width: 100%;
		`;
	}
);

export const AccordionSummaryText = styled.div.withConfig({ displayName: "StyledAccordionSummaryText-sc-" })(
	({ theme }) => {
		const text = theme.components.accordion.text;

		return css`
			-moz-osx-font-smoothing: grayscale;
			-webkit-font-smoothing: antialiased;
			color: ${text.color};
			display: flex;
			font-family: ${text.fontFamily};
			font-size: ${text.fontSize};
			font-weight: ${text.fontWeight};
			padding: ${text.padding};
			width: 100%;
			word-wrap: break-word;
		`;
	}
);

export const AccordionSummary = styled.div.withConfig({ displayName: "StyledAccordionSummary-sc-" })<{
	$variant?: AccordionVariant;
}>(({ theme, $variant }) => {
	const { summary, graphic } = theme.components.accordion;

	return css`
		align-items: center;
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		flex-shrink: 0;
		min-height: ${summary.minHeight};
		outline: none;
		padding: ${summary.padding};
		width: 100%;

		${StyledIconWrapper} {
			display: block;
			flex: none;
			text-align: center;
			vertical-align: middle;
			color: ${graphic.color};
			font-size: ${graphic.fontSize};
			padding: ${graphic.padding};

			${$variant &&
			css`
				&[data-variant-type="${$variant}"] {
					color: ${summary.icon.variant[$variant]};
				}
			`}

			& + ${AccordionSummaryText} {
				padding-left: 0;
			}
		}

		${active(css`
			position: relative;
			&:before {
				border: ${summary.active.border};
			}
		`)}

		${hover(css`
			position: relative;
			font-style: ${summary.hover.fontStyle};
			&:before {
				border: ${summary.hover.border};
			}
		`)}

		&:focus {
			position: relative;

			${summary.focus.customBorder
				? css`
						&& {
							${createBorder(summary.focus.customBorder, true)};

							// To avoid the summary's outline is overlapped by the summary's custom border.
							&:before {
								height: calc(
									100% - ${parseFloat(summary.focus.outline.split(" ")[0]) * 2}px +
										${summary.focus.customBorder.offSet ?? 0}px
								);
								width: calc(
									100% - ${parseFloat(summary.focus.outline.split(" ")[0]) * 2}px +
										${summary.focus.customBorder.offSet ?? 0}px
								);
							}

							&:after {
								outline: ${summary.focus.outline};
								content: "";
								display: block;
								height: calc(100% - ${parseFloat(summary.focus.outline.split(" ")[0]) * 2}px);
								width: calc(100% - ${parseFloat(summary.focus.outline.split(" ")[0]) * 2}px);
								left: 50%;
								position: absolute;
								pointer-events: none;
								top: 50%;
								transform: translate(-50%, -50%);
							}
						}
					`
				: css`
						&:before {
							border: ${summary.focus.border};
							margin: 1px;
							outline: ${summary.focus.outline};
						}
					`}
		}
	`;
});

export const AccordionDetails = styled.div.withConfig({ displayName: "StyledAccordionDetails-sc-" })(({ theme }) => {
	const { text, details, summary } = theme.components.accordion;

	return css`
		background-color: ${details.background};
		font-size: ${details.fontSize};
		overflow-y: auto;
		position: relative;

		& & {
			${AccordionSummary} {
				border-radius: ${summary.borderRadius};
				padding-left: ${details.menu.paddingLeft};
				${AccordionSummaryText} {
					font-weight: ${text.expanded?.fontWeight};
				}
			}
		}

		&:focus {
			${darkFocus}
		}
	`;
});

export const AccordionSection = styled.div.withConfig({
	displayName: "StyledAccordionSection-sc-"
})<AccordionProps.SectionProps>(({ theme, selected }) => {
	const summary = theme.components.accordion.summary;

	return css`
		display: flex;
		flex-direction: column;
		position: relative;

		&:before,
		${AccordionSummary}:before {
			bottom: 0;
			content: "";
			display: block;
			left: 0;
			position: absolute;
			right: 0;
		}

		&:before {
			border-bottom: ${summary.border};
		}

		${AccordionSummary}:before {
			top: 0;
		}

		&:first-child:before {
			border-top: ${summary.border};
			top: 0;
		}

		${selected &&
		css`
			& > ${AccordionSummary} {
				background-color: ${summary.selected.background};
				border-radius: ${summary.borderRadius};
				&:before {
					border-left: ${summary.selected.borderLeft.nonActive};
				}

				${active(css`
					&:before {
						border-left: ${summary.selected.borderLeft.active};
					}
				`)}

				${hover(css`
					${AccordionSummaryText} {
						color: ${summary.selected.hover?.color};
						font-weight: ${summary.selected.hover?.fontWeight};
					}

					&:before {
						border-left: ${summary.selected.borderLeft.hover};
					}
				`)}

				&:focus:before {
					border-left: ${summary.selected.borderLeft.focus};
				}

				${AccordionSummaryText} {
					color: ${summary.selected.color};
				}
			}
		`}
	`;
});
