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

import {
	StyledTreeNodeArrow,
	StyledTreeNodeContent,
	StyledTreeNodeIcon,
	StyledTreeNodeName
} from "../../tree/main/tpl/tree-elements.styled.js";
import { TreeContainer } from "../../tree/main/tpl/tree-elements.tpl.js";
import { StyledButton } from "../../button/main/button.styled.js";
import type { TableTemplateProps } from "../../table/main/template/table.tpl.api.js";
import { StyledTableTemplate, TableTemplate } from "../../table/main/template/index.js";
import { activeAndHover, hover } from "../../theme/base/mixins/_interaction.js";
import { StyledTableDnDBody } from "../../table/main/table.dnd.view.js";

export namespace StyledTreeTable {
	export const StyledTreeContainer = styled(TreeContainer).withConfig({ displayName: "StyledTreeContainer-sc-" })(
		({ theme }) => {
			const { tree } = theme.components;

			return css`
				${StyledTreeNodeContent} {
					border-bottom: none;
					border-left: none;
					min-width: auto;
					min-height: 0;
					&:before {
						border-bottom: none;
					}
				}
				${StyledTreeNodeName} {
					padding: 0;
				}
				${StyledTreeNodeIcon} {
					height: auto;
					min-height: 0;
					padding: 0;
				}
				${StyledTreeNodeArrow} {
					margin-top: calc((8px - ${tree.nodeArrow.button.fontSize}) * 0.5);
					${StyledButton}[data-type="icon"] {
						margin: 0;
					}
				}
			`;
		}
	);

	export const StyledTableContainer = styled(TableTemplate.Table).withConfig({
		displayName: "StyledTableContainer-sc-"
	})<TableTemplateProps.TableElementProps & { virtualScroll?: boolean; droppable?: boolean; forbidden?: boolean }>(
		({ theme, droppable, forbidden }) => {
			const { treeTable, table } = theme.components;
			const borderStyle = `2px solid ${
				droppable ? treeTable.node.droppableBorderColor : treeTable.node.forbiddenBorderColor
			}`;

			return css`
				${StyledTableTemplate.StyledBodyRow} {
					min-height: ${treeTable.bodyRow.minHeight};
					${StyledTreeNodeContent} {
						${activeAndHover(css`
							background-color: transparent;
						`)}
					}
				}
				${(droppable || forbidden) &&
				css`
					${StyledTableTemplate.StyledHead}:after {
						border-bottom: ${borderStyle};
						left: 0;
					}
					${StyledTableTemplate.StyledBody} {
						&:after {
							border-right: ${borderStyle};
							top: 0;
						}
						&:before {
							content: "";
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							z-index: 1;
							border-right: ${borderStyle};
						}
					}
					${StyledTableTemplate.StyledFoot}:after {
						border: ${borderStyle};
						border-top: none;
						left: 0;
						top: 0;
					}
					& ~ ${StyledTableTemplate.StyledBody} ${StyledTableDnDBody} ${StyledTableTemplate.StyledBodyRow} {
						background-color: transparent;
						&:before {
							left: 2px;
							right: 2px;
						}
					}
					${StyledTableTemplate.StyledHead}, ${StyledTableTemplate.StyledBody}, ${StyledTableTemplate.StyledFoot} {
						position: relative;
						&:after {
							bottom: 0;
							content: "";
							position: absolute;
							right: 0;
						}
					}
					[class*="virtual-scroll"] ${StyledTableTemplate.StyledBody}:after {
						right: 1px;
					}
				`}

				${StyledTableTemplate.StyledBody} {
					&[tabindex="0"] {
						border: ${table.body.border};
						outline: none;
						// Set border-bottom if there's no Footer
						&:last-child {
							border-bottom: ${table.bodyRow.borderBottom};
						}
						&:focus {
							border: ${table.body.focusBorder};
						}
					}
				}
				${StyledTableTemplate.StyledBodyRow} {
					padding: 0;
					${StyledTreeNodeContent} {
						${activeAndHover(css`
							background-color: transparent;
						`)}
					}
				}
			`;
		}
	);

	export const StyledNode = styled.div.withConfig({ displayName: "StyledNode-sc-" })<{
		draggable?: boolean;
		dragging?: boolean;
		droppable?: boolean;
		forbidden?: boolean;
	}>(({ theme, draggable, dragging, droppable, forbidden }) => {
		const { treeTable } = theme.components;

		return css`
			${StyledTableTemplate.StyledBodyRow} {
				flex: 1;
				user-select: none;
				width: 100%;
				opacity: ${dragging ? treeTable.node.draggingOpacity : 1};
				${(droppable || forbidden) &&
				css`
					&:after {
						border-left: ${treeTable.node.borderLeft};
						content: "";
					}
				`}
				${droppable &&
				css`
					background-color: ${treeTable.node.droppableBG};
					&:after {
						border-left-color: ${treeTable.node.droppableBorderColor};
					}
					${activeAndHover(css`
						background-color: ${treeTable.node.droppableBG};
						&:after {
							border-left-color: ${treeTable.node.droppableBorderColor};
						}
					`)}
				`}
				${forbidden &&
				css`
					background-color: ${treeTable.node.forbiddenBG};
					&:after {
						border-left-color: ${treeTable.node.forbiddenBorderColor};
					}
					${activeAndHover(css`
						background-color: ${treeTable.node.forbiddenBG};
						&:after {
							border-left-color: ${treeTable.node.forbiddenBorderColor};
						}
					`)}
					${StyledTreeNodeContent} {
						${activeAndHover(css`
							background-color: ${treeTable.node.forbiddenBG};
						`)}
					}
					${StyledTableDnDBody} && {
						opacity: ${treeTable.node.forbiddenOpacity};
					}
				`}
			}

			${!draggable &&
			css`
				${StyledTableTemplate.StyledBodyRow} {
					${hover(css`
						cursor: default;
					`)}
				}
			`}
			${draggable &&
			css`
				[class*="contentRow--interactive"] {
					${hover(css`
						cursor: move;
					`)}
				}
			`}
		`;
	});

	export const StyledTarget = styled.div.withConfig({ displayName: "StyledTarget-sc-" })<{
		top?: boolean;
		droppable?: boolean;
		forbidden?: boolean;
		nodeLevel: number;
	}>(({ theme, top, droppable, forbidden, nodeLevel }) => {
		const { treeTable, tree } = theme.components;
		const spacingLevel = `${treeTable.node.spacingLeft + tree.node.indentPaddingLeft * (1 + nodeLevel)}px`;

		return css`
			bottom: 0;
			left: 0;
			height: ${treeTable.target.height};
			opacity: ${treeTable.target.opacity};
			position: absolute;
			width: 100%;
			top: ${top && 0};
			${(droppable || forbidden) &&
			css`
				background: linear-gradient(
					to right,
					transparent ${spacingLevel},
					${droppable ? treeTable.target.droppableBG : treeTable.target.forbiddenBG} ${spacingLevel}
				);
				border: ${droppable ? treeTable.target.droppableBorder : treeTable.target.forbiddenBorder};
			`}
		`;
	});

	export const StyledNodePreview = styled.div.withConfig({ displayName: "StyledNodePreview-sc-" })(({ theme }) => {
		const { treeTable } = theme.components;

		return css`
			background-color: ${treeTable.nodePreview.background};
			box-shadow: ${treeTable.nodePreview.boxShadow};
			opacity: ${treeTable.nodePreview.opacity};
			position: fixed;
			pointer-events: none;
			z-index: 1;
		`;
	});
}
