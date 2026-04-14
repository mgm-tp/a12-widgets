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

import { css } from "styled-components";

import { addPrefix } from "../../../common/main/utils.js";
import {
	StyledMessageBoxIcon,
	StyledMessageBoxLabel,
	StyledMessageBoxWrapper
} from "../../../message-box/main/message-box.styled.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import {
	StyledCollapsiblePanelContent,
	StyledCollapsiblePanelTitle,
	StyledCollapsiblePanelWrapper
} from "../../../collapsible-panel/main/collapsible-panel.view.js";
import { StyledGridRow } from "../../../layout/layout-grid/main/layout-grid.styled.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { activeAndHover } from "../mixins/_interaction.js";

const baseClassName = addPrefix("form");

const multiColumnsStyled = () => {
	let styles = "";

	for (let columns = 1; columns <= 12; columns++) {
		styles += `
		   &--${columns} {
				display: inline-block;
				padding: 0 12px;
				vertical-align: top;
				width: calc(100% / (12 / ${columns}));
		   }
     	`;
	}

	return css`
		${styles}
	`;
};

export const formSectionStyles = css(({ theme }) => {
	const { section, repeat, text } = theme.components.form;

	return css`
		.${baseClassName}__section {
			display: block;
			margin: 0;
			padding: ${section.padding};
			width: ${section.width};

			&Title {
				background: ${section.title.background};
				color: ${section.title.color};
				font-family: ${text.fontFamily};
				font-size: ${text.fontSize};
				font-weight: ${section.title.fontWeight};
				line-height: 1.125rem;
				margin: ${section.title.margin};
				min-height: ${section.title.minHeight};
				padding: ${section.title.padding};
				vertical-align: middle;

				&--disabled {
					color: ${section.title.disabledColor};
				}

				&:empty {
					padding: 0;
				}
			}

			> .${baseClassName}__section {
				display: inline-block;
				> .${baseClassName}__sectionTitle {
					background-color: ${repeat.sectionTitle.background};
					border-bottom: ${repeat.sectionTitle.borderBottom};
					color: ${repeat.sectionTitle.color};
					font-family: ${text.fontFamily};
					font-weight: ${repeat.sectionTitle.fontWeight};
					height: ${repeat.sectionTitle.height};
					margin: 8px 0 20px;
					padding: 0 0 4px;
					text-transform: ${repeat.sectionTitle.textTransform};
				}
				${multiColumnsStyled()};
			}
		}
	`;
});

export const formTextCellStyles = css(({ theme }) => {
	const { text } = theme.components.form;

	return css`
		.${baseClassName}__textcell {
			color: ${text.cell.color.default};
			font-family: ${text.fontFamily};
			font-size: ${text.fontSize};
			font-weight: ${text.cell.fontWeight};
			margin-bottom: 18px;
			&--disabled {
				color: ${text.cell.color.disabled};
			}
		}
	`;
});

export const formLegacyStyles = css(({ theme }) => {
	const { screen, section, message, text } = theme.components.form;

	return css`
		.${baseClassName} {
			display: inline-block;
			outline: none;
			width: 100%;

			&__buttonPanel {
				display: inline-block;
				margin: 0 0 24px 0;
			}

			&__control {
				border: none;
				vertical-align: top;
				> .button--primary {
					margin-right: 0;
				}

				&--boolean {
					float: left;
					> .field__label {
						cursor: pointer;
						display: inline-block;
						margin: 2px 0 2px 7px;
						vertical-align: middle;
					}
				}
			}

			&__controlgrid,
			&__repeat,
			&__detachedrepeat,
			&__embeddedrepeat,
			&__inlinerepeat,
			&__section {
				display: block;
				margin-bottom: 0;
				width: 100%;
				> .${baseClassName}__controlgrid,
					> .${baseClassName}__repeat,
					> .${baseClassName}__detachedrepeat,
					> .${baseClassName}__embeddedrepeat,
					> .${baseClassName}__inlinerepeat,
					> .${baseClassName}__section {
					display: inline-block;
				}
			}

			> .group {
				display: inline-block;
				margin-bottom: 24px;
			}

			&__inlinerepeat > .${baseClassName}__repeatContent > .${baseClassName}__table {
				vertical-align: top;
				> .${baseClassName}__tableTBODY > .${baseClassName}__tableTR {
					min-height: 40px;
					> .${baseClassName}__tableTD {
						vertical-align: top;
						> .${baseClassName}__tableTDContent {
							max-height: none;
						}
						> .${baseClassName}__control {
							margin: 9px 0;
						}
					}
					> .${baseClassName}__tableTD--controls {
						padding-top: 14px;
					}
					> .${baseClassName}__tableTD--boolean {
						vertical-align: middle;
					}
				}
			}

			&__inlinerepeat {
				.field {
					&__appendices {
						right: 0;
					}
					&__exposition {
						width: 100%;
					}
					&__help {
						width: 100%;
					}
					&__text {
						width: 100%;
					}
				}
			}

			&__repeatContent {
				display: inline-block;
				padding: 0 0 8px 0;
				width: 100%;
			}

			&__screen,
			&__detachedrepeat--detailscreen {
				> .${baseClassName}__controlgrid,
					> .${baseClassName}__repeat,
					> .${baseClassName}__detachedrepeat,
					> .${baseClassName}__embeddedrepeat,
					> .${baseClassName}__inlinerepeat,
					> .${baseClassName}__section,
					> .${baseClassName}__multicolumnsection {
					&:first-child {
						> .${baseClassName}__sectionTitle:first-child {
							margin-top: ${screen.marginTop};
						}
					}

					&:last-child {
						margin-bottom: ${screen.marginBottom};
					}
				}
				> ${StyledCollapsiblePanelWrapper}:first-child {
					margin-top: -24px;
				}
				&Title {
					display: none;
					+ .${baseClassName}__sectionTitle {
						margin-top: -36px;
					}
					+ .${baseClassName}__controlgrid,
						+ .${baseClassName}__repeat,
						+ .${baseClassName}__detachedrepeat,
						+ .${baseClassName}__embeddedrepeat,
						+ .${baseClassName}__inlinerepeat,
						+ .${baseClassName}__section {
						> .${baseClassName}__sectionTitle {
							margin-top: -24px;
						}
					}
					+ ${StyledCollapsiblePanelWrapper} {
						margin-top: -24px;
					}
				}
			}

			&__section {
				&Content {
					.${baseClassName}__controlgrid, .${baseClassName}__repeat, .${baseClassName}__section {
						> .${baseClassName}__sectionTitle {
							background: ${section.contentTitle.background};
							border-bottom: ${section.contentTitle.borderBottom};
							color: ${section.contentTitle.color};
							font-family: ${text.fontFamily};
							font-size: ${section.contentTitle.fontSize};
							font-weight: ${section.contentTitle.fontWeight};
							min-height: ${section.contentTitle.height};
							margin: ${section.contentTitle.margin};
							padding: ${section.contentTitle.padding};
							text-transform: ${section.contentTitle.textTransform};
						}
					}
				}
			}

			&__select {
				margin: 0 12px 6px 12px;
				display: inline-block;
			}

			&__message {
				color: ${message.color.default};
				font-family: ${text.fontFamily};
				font-size: ${text.fontSize};
				font-style: italic;
				font-weight: ${message.fontWeight};
				padding: 10px;

				&--highlighted {
					color: ${message.color.highlighted};
					font-style: normal;
				}
			}
		}
	`;
});

export const formLegacyStylesForFormEngine = css(({ theme }) => {
	const { contentBox, collapsiblePanel, section, text } = theme.components.form;

	return css`
		.${baseClassName}-engine {
			[data-role="${DataRoles.Contentbox.Notification}"] {
				${StyledMessageBoxWrapper} {
					border: none;
					border-radius: 0;
					${StyledMessageBoxIcon} {
						${StyledIconWrapper} {
							color: ${contentBox.color.iconAndLabel};
						}
					}
					${StyledMessageBoxLabel} {
						color: ${contentBox.color.iconAndLabel};
					}
				}
				.messageBox--error {
					background-color: ${contentBox.color.error};
				}
				.messageBox--warning {
					background-color: ${contentBox.color.warning};
				}
			}

			${StyledCollapsiblePanelWrapper} {
				> ${StyledCollapsiblePanelTitle} {
					background-color: ${collapsiblePanel.h3.background.normalAndFocus};
					font-size: ${collapsiblePanel.h3.fontSize};
					font-weight: ${text.fontWeight};
					margin: ${collapsiblePanel.h3.margin};
					min-height: auto;
					padding: ${collapsiblePanel.h3.padding};
					&:focus {
						background-color: ${collapsiblePanel.h3.background.normalAndFocus};
						color: ${collapsiblePanel.h3.color};
						${StyledIconWrapper} {
							color: inherit;
						}
					}
					${activeAndHover(css`
						background-color: ${collapsiblePanel.h3.background.activeAndHover};
					`)}
				}
			}

			.${baseClassName}__multicolumnsection {
				> ${StyledGridRow} {
					align-items: stretch;
				}
				${StyledCollapsiblePanelWrapper} {
					> ${StyledCollapsiblePanelTitle} {
						background-color: ${collapsiblePanel.h4.background};
						border-bottom: ${collapsiblePanel.h4.borderBottom};
						font-size: ${collapsiblePanel.h4.fontSize};
						font-weight: ${text.fontWeight};
						margin: ${collapsiblePanel.h4.margin};
						padding: ${collapsiblePanel.h4.padding.default};
					}
					> ${StyledCollapsiblePanelContent} {
						padding: 0;
						.${baseClassName}__sectionTitle {
							margin: ${section.contentTitle.margin};
						}
					}
				}
			}

			.${baseClassName}__multicolumnsection
				.${baseClassName}__multicolumnsection,
				.${baseClassName}__sectionContent
				.${baseClassName}__multicolumnsection {
				> .${baseClassName}__sectionTitle {
					margin: ${collapsiblePanel.h4.margin};
					padding: ${collapsiblePanel.h4.padding.formSection};
				}
			}

			*:not(.${baseClassName}__sectionContent):not(.layoutGrid__column) > .${baseClassName}__multicolumnsection {
				.${baseClassName}__controlgrid, .${baseClassName}__repeat, .${baseClassName}__section {
					> .${baseClassName}__sectionTitle {
						border-bottom: ${collapsiblePanel.h4.borderBottom};
						font-size: ${collapsiblePanel.h4.fontSize};
						margin: ${collapsiblePanel.h4.margin};
						padding: ${collapsiblePanel.h4.padding.formSection};
					}
					.${baseClassName}__sectionContent {
						.${baseClassName}__sectionTitle {
							border-bottom: ${section.contentTitle.borderBottom};
							font-size: ${section.contentTitle.fontSize};
							margin: ${section.contentTitle.margin};
							padding: ${section.contentTitle.padding};
						}
					}
				}
			}
		}
	`;
});

export const formLegacyTypoHeadlineStyles = css(({ theme }) => {
	const { title, text } = theme.components.form;

	return css`
		h5:not([data-role*="typography-headline"]) .title {
			background-color: ${title.background};
			color: ${title.color};
			font-family: ${text.fontFamily};
			font-size: ${text.fontSize};
			font-weight: ${text.fontWeight};
			height: ${title.height};
			margin: ${title.margin};
			padding: ${title.padding};
			text-transform: ${title.textTransform};
			width: ${title.width};
		}
	`;
});
