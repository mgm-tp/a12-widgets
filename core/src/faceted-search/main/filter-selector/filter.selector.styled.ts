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

import { addPrefix } from "../../../common/main/utils.js";
import { Button } from "../../../button/main/button.view.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { ActionContentbox } from "../../../contentbox/main/action-contentbox/action-contentbox.view.js";
import { StyledModalOverlayWrapper } from "../../../modal-overlay/main/modal-overlay.view.js";
import {
	StyledContentBoxTitleWrapper,
	StyledContentBoxHeading,
	StyledContentBoxContent,
	StyledContentBoxFooter
} from "../../../contentbox/main/template/contentbox.tpl.styled.js";
import { StyledSubActionBarTpl } from "../../../contentbox/main/template/sub-action-bar.tpl.view.js";
import { SubHeadingElements } from "../../../contentbox/main/template/elements/sub-heading.tpl.view.js";
import { StyledCheckbox } from "../../../input/checkbox/main/checkbox.styled.js";
import {
	StyledListItemWrapper,
	StyledListItemContent,
	StyledListItemGraphic,
	StyledListItemText
} from "../../../list/main/list.styled.js";
import { StyledGridRow, StyledGridColumn } from "../../../layout/layout-grid/main/layout-grid.styled.js";
import { active as activeFn, hover } from "../../../theme/base/mixins/_interaction.js";
import { List as ListTemplate } from "../../../list/main/list.view.js";
import { Checkbox } from "../../../input/checkbox/main/checkbox.view.js";
import { checkboxStates } from "../../../theme/base/mixins/components/_input.js";

const baseClassName = addPrefix("filter-selector");

export const StyledFilterSelectorWrapper = styled.div.withConfig({ displayName: "StyledFilterSelectorWrapper-sc-" })(
	({ theme }) => {
		const { filterSelector } = theme.components;

		return css`
			box-shadow: ${filterSelector.boxShadow};
			display: flex;
			flex-direction: column;
			height: 100%;
			margin: 0 auto;
			outline: none;

			.${baseClassName}__content-enter {
				max-height: 0;
				transition: max-height 0.3s ease-out;
			}
			.${baseClassName}__content-exit {
				height: 0 !important;
				transition: height 0.3s ease-in;
			}

			${SubHeadingElements.StyledSubHeading} {
				& > *:not(:empty) {
					display: flex;
					flex-direction: column;
					padding: 0;

					&:not(${StyledSubActionBarTpl}) {
						border-bottom: none;
						border-top: none;
					}
				}
			}

			${StyledContentBoxHeading} {
				border: none;
				border-radius: ${filterSelector.borderRadius};
				padding: ${filterSelector.headerPadding};
			}

			${StyledContentBoxTitleWrapper} {
				margin: 0;
			}

			${StyledContentBoxContent} {
				border-radius: ${filterSelector.borderRadius};
				display: flex;
				flex-direction: column;
			}

			${StyledContentBoxFooter} {
				padding: ${filterSelector.footerPadding};
			}

			${StyledModalOverlayWrapper} & {
				display: inline-flex;
			}
		`;
	}
);

export const StyledFilterSelectorChildrenWrapper = styled.div.withConfig({
	displayName: "StyledFilterSelectorChildrenWrapper-sc-"
})(({ theme }) => {
	const { childrenWrapper } = theme.components.filterSelector;

	return css`
		height: 100%;
		outline: none;
		border: ${childrenWrapper.border};
		&:focus {
			border: ${childrenWrapper.focusByKeyBoardBorder};
		}
	`;
});

export const StyledFilterSelectorContainer = styled(ActionContentbox).withConfig({
	displayName: "StyledFilterSelectorContainer-sc-"
})<{
	padding?: number | string | boolean;
}>(({ theme, padding }) => {
	return css`
		${StyledContentBoxContent} {
			padding: ${padding === true ? theme.components.filterSelector.content.secondary.contentBoxContent.padding : 0};
		}
	`;
});

export const StyledFilterSelectorBody = styled.div.withConfig({ displayName: "StyledFilterSelectorBody-sc-" })(
	({ theme }) => {
		const { filterSelector } = theme.components;

		return css`
			background-color: ${filterSelector.body.background};
			display: flex;
			flex-grow: 1;
			flex-shrink: 1;
			max-height: inherit;
			min-height: ${filterSelector.body.minHeight};

			${StyledFilterSelectorContainer} {
				box-shadow: none;
				outline: 0;
			}

			${StyledModalOverlayWrapper} & {
				margin: 0 auto;
				position: relative;

				${StyledFilterSelectorContainer} {
					height: ${filterSelector.height};
				}

				> ${StyledFilterSelectorContainer}:only-child {
					${StyledContentBoxHeading}, ${StyledContentBoxContent}, ${StyledSubActionBarTpl} {
						border: none;
					}
				}
			}
		`;
	}
);

export const StyledFilterSelectorContent = styled.div.withConfig({ displayName: "StyledFilterSelectorContent-sc-" })<{
	contentType: "primary" | "secondary";
	isMobileSecondary?: boolean;
}>(({ theme, contentType, isMobileSecondary }) => {
	const { filterSelector } = theme.components;
	const { column } = theme.components.layoutGrid;

	return css`
		${StyledGridColumn} {
			margin-bottom: ${column.marginBottom};
			padding: ${column.padding};
		}

		${StyledGridRow} {
			gap: 0;
			margin: 0;
		}

		${!isMobileSecondary &&
		css`
			color: ${filterSelector.content.color};
			max-height: ${filterSelector.content.maxHeight};
			outline: 0;
		`}

		${contentType === "primary" &&
		css`
			max-width: ${filterSelector.content.primary.width};
			min-width: ${filterSelector.content.primary.width};

			${StyledContentBoxHeading} {
				border-right: ${filterSelector.content.primary.headerBorderRight};
			}

			${StyledListItemContent} {
				padding: ${filterSelector.listItem.padding};
			}

			${StyledFilterSelectorSectionTitle} {
				padding: ${filterSelector.list.sectionPadding};
			}
		`}

		${contentType !== "primary" &&
		css`
			min-width: ${filterSelector.content.secondary.width};
			width: ${filterSelector.content.secondary.width};

			&:not(:first-child) {
				${StyledContentBoxHeading},
				${SubHeadingElements.StyledSubHeading},
						${StyledContentBoxContent} {
					border-left: ${filterSelector.content.secondary.borderLeft};
				}
			}

			${StyledListItemWrapper} {
				background: ${filterSelector.list.optionItem.background.default};
				${StyledListItemContent} {
					padding: ${filterSelector.content.secondary.listItemPadding};
				}
			}

			${StyledFilterSelectorSectionTitle}${StyledFilterSelectorSectionTitle} {
				margin: ${filterSelector.content.secondary.subHeaderMargin};
				padding: ${filterSelector.list.sectionPadding};
			}

			${StyledContentBoxContent} {
				min-height: ${filterSelector.content.secondary.contentBoxContent.minHeight};
			}

			${StyledListItemGraphic} {
				position: static;
				margin-left: -${filterSelector.actionBarHorizontalPadding};
			}
		`}
	`;
});

export const StyledFilterSelectorActionBar = styled.div.withConfig({
	displayName: "StyledFilterSelectorActionBar-sc-"
})(({ theme }) => {
	const { actionBar } = theme.components.filterSelector;

	return css`
		align-items: center;
		box-sizing: border-box;
		border-bottom: ${actionBar.borderBottom};
		display: flex;
		flex-wrap: wrap;
		min-height: ${actionBar.minHeight};
		padding: ${actionBar.padding};

		${StyledCheckbox.StyledField} {
			align-items: center;
			display: inline-flex;
		}
	`;
});

export const StyledFilterSelectorActionElement = styled.div.withConfig({
	displayName: "StyledFilterSelectorActionElement-sc-"
})(({ theme }) => {
	const { actionBar } = theme.components.filterSelector;

	return css`
		margin: ${actionBar.elementMargin};
		&:last-child {
			margin: 0;
		}
	`;
});

export const StyledFilterSelectorFooter = styled.div.withConfig({ displayName: "StyledFilterSelectorFooter-sc-" })(
	({ theme }) => {
		const { filterSelector } = theme.components;

		return css`
			${StyledModalOverlayWrapper} & {
				max-width: calc((${filterSelector.containerWidth}) * 2);
				margin: 0 auto;
				width: 100%;
			}
		`;
	}
);

export const StyledFilterSelectorList = styled(ListTemplate).withConfig({
	displayName: "StyledFilterSelectorList-sc-"
})(({ theme }) => {
	const { filterSelector } = theme.components;

	return css`
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		outline: none;
		overflow-y: auto;

		${StyledListItemWrapper} {
			flex: none;
			-webkit-tap-highlight-color: transparent;

			&:focus:before {
				outline: ${filterSelector.listItem.focusByKeyBoardBorder};
			}

			&:before,
			${StyledListItemContent}:before {
				bottom: 0;
				content: "";
				display: block;
				left: 0;
				position: absolute;
				right: 0;
			}

			${StyledListItemContent}:before {
				background-color: transparent;
				top: 0;
			}
		}

		${StyledListItemContent} {
			min-height: ${filterSelector.listItem.minHeight};
		}

		${StyledListItemGraphic} {
			bottom: 0;
			font-size: 0;
			height: auto;
			left: 0;
			margin: 0;
			position: absolute;
			top: 0;
			width: ${filterSelector.listItem.graphicWidth};
			${StyledCheckbox.StyledCheckboxInput} {
				// NVDA - prevent pressing enter to trigger graphic click
				width: 1px;
			}
		}

		${StyledListItemText} {
			font-size: ${filterSelector.listItem.text.fontSize};
			line-height: ${filterSelector.listItem.text.lineHeight};
			overflow: hidden;
		}
	`;
});

export const StyledFilterSelectorSectionTitle = styled.div.withConfig({
	displayName: "StyledFilterSelectorSectionTitle-sc-"
})``;

export const StyledFilterSelectorExpandButton = styled(Button).withConfig({
	displayName: "StyledFilterSelectorExpandButton-sc-"
})(({ theme }) => {
	const { list } = theme.components;

	return css`
		&:not(:focus):not(:hover) {
			color: ${list.item.meta.color};
		}

		${StyledIconWrapper} {
			transition: transform 0.3s;
		}
	`;
});

export const StyledFilterSelectorItemCheckbox = styled(Checkbox).withConfig({
	displayName: "StyledFilterSelectorItemCheckbox-sc-"
})<{ graphicHovered?: boolean }>(({ theme, graphicHovered, checked }) => {
	const { checkbox } = theme.components;

	return css`
		${graphicHovered &&
		css`
			@media (pointer: fine) {
				${StyledCheckbox.StyledCheckboxInput} {
					${checkboxStates(checked ? checkbox.hover.checkedBG : undefined, checkbox.hover.border)};
					+ label > span:before {
						inset: -1px;
					}
				}
			}
		`}
	`;
});

export const StyledFilterSelectorItem = styled(ListTemplate.Item).withConfig({
	displayName: "StyledFilterSelectorItem-sc-"
})<{
	readonly?: boolean;
	disabled?: boolean;
	lastSelectedDivider?: boolean;
}>(({ theme, disabled, active, selected, readonly, lastSelectedDivider }) => {
	const { filterSelector, list } = theme.components;

	return css`
		background: ${active ? filterSelector.listItem.activeBG : filterSelector.listItem.background};
		color: ${disabled && filterSelector.listItem.disabledColor};

		${StyledListItemContent} {
			background: ${selected ? "none" : "transparent"};
			${active &&
			css`
				&:before {
					border-left: ${filterSelector.listItem.activeBorderLeft.default};
				}
			`}
			${active &&
			!disabled &&
			!readonly &&
			css`
				${activeFn(css`
					&:before {
						border-left: ${filterSelector.listItem.activeBorderLeft.active};
					}
				`)};

				${hover(css`
					&:before {
						border-left: ${filterSelector.listItem.activeBorderLeft.hover};
					}
				`)};

				&:focus:before {
					border-left: ${filterSelector.listItem.activeBorderLeft.focus};
				}
			`}
		}

		${lastSelectedDivider &&
		css`
			&:before {
				border-bottom: ${list.dividerBorder};
			}
		`}
	`;
});

export const StyledFilterSelectorTemplateWrapper = styled.div.withConfig({
	displayName: "StyledFilterSelectorTemplateWrapper-sc-"
})`
	width: 100%;
	height: 100%;
`;
