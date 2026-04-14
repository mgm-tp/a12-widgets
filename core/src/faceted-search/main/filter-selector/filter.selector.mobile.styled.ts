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

import { activeAndHover } from "../../../theme/base/mixins/_interaction.js";
import { StyledContentBoxContent } from "../../../contentbox/main/template/contentbox.tpl.styled.js";
import {
	StyledListItemWrapper,
	StyledListItemContent,
	StyledListItemMeta,
	StyledListItemSecondaryText
} from "../../../list/main/list.styled.js";
import { StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { StyledModalOverlayWrapper } from "../../../modal-overlay/main/modal-overlay.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import {
	StyledFilterSelectorContainer,
	StyledFilterSelectorList,
	StyledFilterSelectorContent,
	StyledFilterSelectorBody,
	StyledFilterSelectorExpandButton,
	StyledFilterSelectorFooter
} from "./filter.selector.styled.js";
import { FilterSelectorTemplate } from "./tpl/filter-selector.tpl.view.js";
import { FilterSelector } from "./filter-selector.view.js";

export const StyledMobileFilterSelectorTemplate = styled(FilterSelectorTemplate).withConfig({
	displayName: "StyledMobileFilterSelectorTemplate-sc-"
})(({ theme }) => {
	const { filterSelector } = theme.components;

	return css`
		align-self: stretch;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		max-width: 100%;

		${StyledModalOverlayWrapper} & {
			display: flex;
		}

		${StyledFilterSelectorContainer}${StyledFilterSelectorContainer} {
			height: auto;
			position: relative;
		}

		${StyledFilterSelectorContent}:not([data-role="${DataRoles.FilterSelector.Content.Secondary}"]) {
			display: flex;
			flex-grow: 1;
			flex-shrink: 1;
			max-height: unset;
			max-width: unset;
			min-width: unset;
		}

		${StyledFilterSelectorFooter} {
			flex-shrink: 0;
			margin: 0;
			max-width: none;
		}

		${StyledListItemMeta} {
			align-items: center;
			display: flex;
		}

		${StyledListItemSecondaryText} {
			color: ${filterSelector.listItem.secondaryTextColor};
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		${StyledFilterSelectorBody}${StyledFilterSelectorBody} {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			flex-shrink: 1;
			margin: 0;
			min-height: 0;
		}

		[data-role="${DataRoles.FilterSelector.Content.Primary}"] {
			overflow: hidden;
		}

		[data-role="${DataRoles.FilterSelector.Content.Secondary}"] {
			border-bottom: ${filterSelector.listItem.borderBottom};
			flex-shrink: 0;
			overflow-y: auto;
			width: 100%;

			${StyledContentBoxContent} {
				border: none;
				&:after {
					content: normal;
				}
			}

			${StyledFilterSelectorContainer}:after {
				background-color: ${filterSelector.listItem.activeIndicator.background};
				bottom: 0;
				content: "";
				left: 0;
				position: absolute;
				right: auto;
				top: 0;
				width: ${filterSelector.listItem.activeIndicator.width};
			}

			${StyledFilterSelectorList} ${StyledListItemWrapper} {
				&,
				&:focus {
					background-color: transparent;
					background-image: none;

					&:after {
						background-color: transparent;
					}
				}

				${activeAndHover(css`
					background-color: transparent;
					background-image: none;
					&:after {
						background-color: transparent;
					}
				`)}

				&:last-child:before {
					border-bottom: none;
				}

				${StyledListItemContent} {
					padding: ${filterSelector.content.secondary.listItemPadding};
				}
			}
		}
	`;
});

export const StyledMobileFilterSelectorItem = styled(FilterSelector.FilterItem).withConfig({
	displayName: "StyledMobileFilterSelectorItem-sc-"
})<{ $active?: boolean; $expanded?: boolean }>(({ $active, $expanded }) => {
	return css`
		${$active &&
		css`
			${StyledListItemSecondaryText} {
				font-style: normal;
			}
		`}

		${$expanded &&
		css`
			${StyledFilterSelectorExpandButton} ${StyledIconWrapper} {
				transform: rotate(-180deg);
			}
		`}
	`;
});
