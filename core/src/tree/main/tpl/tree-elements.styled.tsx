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

import { useContext } from "react";
import { styled, css } from "styled-components";

import { active, activeAndHover, hover } from "../../../theme/base/mixins/_interaction.js";
import { Button } from "../../../button/main/button.view.js";
import { Icon, StyledIconWrapper } from "../../../icon/main/icon.view.js";
import { breakWord } from "../../../theme/base/mixins/_break-word.js";
import { StyledCounter } from "../../../counter/main/counter.view.js";
import { StyledTooltipTriggerWrapper } from "../../../tooltip/main/tooltip.styled.js";
import { ButtonGroup } from "../../../button-group/main/button-group.view.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import type { InsertableTreeProps } from "../insertable/insertable-tree.api.js";

import { StyledTreeContext } from "./tree.tpl.api.js";

export const StyledTreeContainer = styled.div.withConfig({ displayName: "StyledTreeContainer-sc-" })<{
	$fit?: boolean;
	$dnd?: boolean;
}>(({ $fit, $dnd }) => {
	return css`
		height: ${$fit && "100%"};
		isolation: isolate;
		user-select: ${$dnd && "none"};
		-webkit-user-drag: ${$dnd && "element"};
	`;
});

export const StyledTreeNodesContainer = styled.div.withConfig({ displayName: "StyledTreeNodesContainer-sc-" })<{
	$fit?: boolean;
}>(({ $fit }) => {
	return css`
		height: ${$fit && "100%"};
		list-style: none;
		padding-left: 0;
		margin: 0;
		overflow-y: ${$fit && "auto"};
		-webkit-tap-highlight-color: transparent; // Setting the color of highlight for the tree nodes are being tapped on IOS
	`;
});

export const StyledTreeNodeContainer = styled.div.withConfig({ displayName: "StyledTreeNodeContainer-sc-" })(
	({ theme }) => {
		const { tree } = theme.components;
		const { dragging } = useContext(StyledTreeContext);

		return css`
			position: relative;
			& > .dnd-dropTarget {
				bottom: 0;
				height: ${tree.hintHeight};
				position: absolute;
				width: 100%;
				& + .dnd-dropTarget {
					bottom: auto;
					top: 0;
				}
			}
			${dragging &&
			css`
				${StyledTreeNodeTitle} {
					opacity: 0.15;
				}
			`}
		`;
	}
);

export const StyledTreeNodeContent = styled.div.withConfig({ displayName: "StyledTreeNodeContent-sc-" })<{
	$level?: number;
	$noEffect?: boolean;
	$disabled?: boolean;
	$interactive?: boolean;
	$selected?: boolean;
}>(({ theme, $disabled, $interactive, $selected, $noEffect, $level = 0 }) => {
	const { highlighted, highlightVariant, focusNoBorder, draggable, dragging, dragOver, dropForbidden } =
		useContext(StyledTreeContext);
	const { nodeContent, node } = theme.components.tree;
	const { contentBoxHorizontalPadding } = theme.components.contentBox;

	return css`
		cursor: ${$interactive && "pointer"};
		min-height: ${nodeContent.minHeight};
		min-width: 300px;
		outline: none;
		padding-left: ${`calc(${contentBoxHorizontalPadding} + ${node.indentPaddingLeft * (1 + $level)}px + ${
			node.titleSpacingLeft
		} )`};
		position: relative;

		&:before {
			border-bottom: ${nodeContent.borderBottom};
			bottom: 0;
			content: "";
			display: block;
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
			pointer-events: none;
		}

		[data-role="${DataRoles.Table.Body.Cell}"] > ${StyledTreeNodeContainer} > && {
			padding-left: ${`calc(${node.indentPaddingLeft * (1 + $level)}px + ${node.titleSpacingLeft} )`};
		}

		${activeAndHover(css`
			${StyledInsertableTreeActionButtonGroup} {
				opacity: 1;
			}
		`)}

		${!$disabled &&
		!$noEffect &&
		css`
			${active(css`
				${focusNoBorder &&
				css`
					background-color: ${!$interactive && nodeContent.active.background};
					${$interactive &&
					css`
						&:before {
							border: ${nodeContent.active.border};
							border-left: ${$selected && nodeContent.selected.activeBorderLeft};
						}
					`}
				`}
			`)}

			${!($selected && !highlighted) &&
			hover(css`
				background-color: ${!$interactive && nodeContent.hover.background};
				${$interactive &&
				css`
					&:before {
						border: ${nodeContent.hover.border};
						border-left: ${$selected && nodeContent.selected.hoverBorderLeft};
					}
				`}
			`)}
		`}
		
		${!focusNoBorder &&
		!($selected && !highlighted) &&
		css`
			&:focus {
				${!$interactive &&
				css`
					background-color: ${nodeContent.focus.background};
					outline: none;
				`}
				${$interactive &&
				css`
					&:before {
						border: ${nodeContent.focus.border};
						border-left: ${$selected && nodeContent.selected.focusBorderLeft};
						margin: 1px;
						outline: ${nodeContent.focus.outline};
					}
				`}
			}
		`}
		
		${highlighted &&
		css`
			background-color: ${nodeContent.focus.background};
			outline: none;
			${StyledInsertableTreeActionButtonGroup} {
				opacity: 1;
			}
		`}
		
		${highlightVariant === "success" &&
		css`
			background-color: ${nodeContent.successBG};
		`}
		
		${$selected &&
		css`
			background-color: ${nodeContent.selected.background};
			&:before {
				border-left: ${nodeContent.selected.borderLeft};
			}
			${!highlighted &&
			css`
				cursor: default;
			`}
		`}
		
		${$disabled &&
		css`
			background-color: ${nodeContent.disabled.background};
			color: ${nodeContent.disabled.color};
			font-weight: ${nodeContent.disabled.fontWeight};
			${StyledTreeNodeIcon} ${StyledIconWrapper} {
				color: inherit;
			}
		`}
		
		${draggable &&
		css`
			cursor: move;
		`}
		
		${dragging &&
		css`
			${active(css`
				background-color: ${nodeContent.dragging.activeBG};
			`)}
			${hover(css`
				background-color: ${nodeContent.dragging.hoverBG};
			`)}
		`}
		
		${dragOver &&
		css`
			background-color: ${nodeContent.dragOver.background};
			&:before {
				border-left: ${nodeContent.dragOver.borderLeft};
			}
		`}
		
		${dropForbidden &&
		css`
			&& {
				background-color: ${nodeContent.dropForbidden.background};
			}
			opacity: 1;
			&:before {
				border-left: ${nodeContent.dropForbidden.borderLeft};
			}
		`}
	`;
});

export const StyledTreeNodeArrow = styled.div.withConfig({ displayName: "StyledTreeNodeArrow-sc-" })(({ theme }) => {
	const { tree } = theme.components;

	return css`
		align-items: flex-start;
		display: flex;
		height: auto;
		margin-left: ${tree.nodeArrow.marginLeft};
		position: absolute;
		text-decoration: none;
	`;
});

export const StyledTreeNodeArrowButton = styled(Button)<{ $active?: boolean }>(({ theme, $active }) => {
	const { nodeArrow } = theme.components.tree;

	return css`
		border-radius: 50%;
		font-size: ${nodeArrow.button.fontSize};
		height: ${nodeArrow.button.size};
		margin: ${nodeArrow.margin};
		min-height: ${nodeArrow.button.size};
		width: ${nodeArrow.button.size};
		&:not(:disabled) {
			color: ${$active && nodeArrow.button.active.color};
			&:focus {
				background-color: ${nodeArrow.button.focusBG};
				outline-offset: -1px;
			}
			${active(css`
				background-color: ${nodeArrow.button.active.background};
				color: ${nodeArrow.button.active.color};
			`)}
			${hover(css`
				background-color: ${nodeArrow.button.hover.background};
				color: ${nodeArrow.button.hover.color};
			`)}
		}
	`;
});

export const StyledTreeNodeArrowIcon = styled(Icon)(({ theme }) => {
	const { nodeArrow } = theme.components.tree;

	return css`
		font-weight: ${nodeArrow.button.iconFontWeight};
	`;
});

export const StyledTreeNodeName = styled.div.withConfig({ displayName: "StyledTreeNodeName-sc-" })(({ theme }) => {
	const { nodeName } = theme.components.tree;

	return css`
		align-items: center;
		box-sizing: border-box;
		display: flex;
		flex-grow: 1;
		font-family: ${nodeName.fontFamily};
		font-size: ${nodeName.fontSize};
		line-height: normal;
		overflow: hidden;
		padding: ${nodeName.padding};
		${breakWord()}
	`;
});

export const StyledTreeNodeIcon = styled.div.withConfig({ displayName: "StyledTreeNodeIcon-sc-" })(({ theme }) => {
	const { nodeIcon, nodeName } = theme.components.tree;

	return css`
		align-items: flex-start;
		box-sizing: border-box;
		display: flex;
		height: auto;
		justify-content: center;
		left: 0;
		min-height: ${nodeIcon.minHeight};
		padding: ${nodeIcon.padding};
		text-align: center;
		vertical-align: middle;
		& > * {
			display: flex;
			justify-content: center;
			&:not(${StyledCounter}):not(${StyledTooltipTriggerWrapper}) {
				font-size: ${nodeIcon.fontSize};
				max-height: ${nodeIcon.maxHeight};
				width: ${nodeIcon.width};
			}
		}
		& + ${StyledTreeNodeName} {
			margin-left: ${nodeName.marginLeft};
		}
	`;
});

export const StyledTreeNodeActions = styled.div.withConfig({ displayName: "StyledTreeNodeActions-sc-" })(
	({ theme }) => {
		const { nodeActions } = theme.components.tree;

		return css`
			align-items: center;
			display: flex;
			flex-shrink: 0;
			margin: ${nodeActions.margin};
		`;
	}
);

export const StyledTreeNodePreview = styled.div.withConfig({ displayName: "StyledTreeNodePreview-sc-" })(
	({ theme }) => {
		const { nodePreview } = theme.components.tree;

		return css`
			background-color: ${nodePreview.background};
			box-shadow: ${nodePreview.boxShadow};
			opacity: ${nodePreview.opacity};
			position: fixed;
			pointer-events: none;
			z-index: 2;
		`;
	}
);

export const StyledTreeNodeTitle = styled.div.withConfig({ displayName: "StyledTreeNodeTitle-sc-" })`
	display: flex;
	position: relative;
`;

export const StyledTreeDropHint = styled.div.withConfig({ displayName: "StyledTreeDropHint-sc-" })<{
	$position?: "top" | "bottom";
	$available?: boolean;
	$opened?: boolean;
	$dropForbidden?: boolean;
	$level?: number;
}>(({ theme, $position, $available, $opened, $dropForbidden, $level = 0 }) => {
	const { dropHint, hintHeight, node } = theme.components.tree;
	const { contentBoxHorizontalPadding } = theme.components.contentBox;

	return css`
		background-clip: content-box;
		background-color: transparent;
		bottom: ${$position === "bottom" && 0};
		cursor: default;
		display: none;
		height: ${hintHeight};
		left: 0;
		padding-left: ${`calc(${contentBoxHorizontalPadding} + ${node.indentPaddingLeft * (1 + $level)}px + ${
			node.titleSpacingLeft
		} )`};
		position: absolute;
		top: ${$position === "top" && 0};
		width: 100%;
		${$available &&
		css`
			display: flex;
			z-index: 1;
			${$opened &&
			css`
				border: ${dropHint.openedBorder};
			`}
			${$dropForbidden &&
			css`
				border: ${dropHint.forbidden.border};
			`}
		`}
	`;
});

export const StyledTreeDropTarget = styled.div.withConfig({ displayName: "StyledTreeDropTarget-sc-" })<{
	$opened?: boolean;
	$dropForbidden?: boolean;
}>(({ theme, $opened, $dropForbidden }) => {
	const { dropHint, hintHeight } = theme.components.tree;

	return css`
		${$opened &&
		css`
			background-color: ${dropHint.background};
		`}
		${$dropForbidden &&
		css`
			background-color: ${dropHint.forbidden.background};
		`}
			${($opened || $dropForbidden) &&
		css`
			align-self: center;
			background-clip: content-box;
			height: ${hintHeight};
			width: 100%;
			opacity: 1;
		`}
	`;
});

export const StyledInsertableTreeActionButton = styled(Button)(({ theme }) => {
	const { interaction } = theme.colors;

	return css`
		background-color: ${interaction.secondaryInteractionColor};
	`;
});

export const StyledInsertableTreeActionButtonGroup = styled(ButtonGroup)(({ theme }) => {
	const { actionButtons } = theme.components.tree;

	return css`
		bottom: 0;
		display: flex;
		gap: ${actionButtons.gap};
		opacity: 0;
		padding: ${actionButtons.padding};
		position: absolute;
		right: 0;
		top: 0;
	`;
});

export const StyledInsertableTreeHint = styled.div.withConfig({ displayName: "StyledInsertableTreeHint-sc-" })<{
	$available?: boolean;
	$focused?: boolean;
	$position: InsertableTreeProps.InsertPosition;
	$level?: number;
}>(({ theme, $available, $focused, $position, $level = 0 }) => {
	const { insertHint, node, hintHeight } = theme.components.tree;
	const { contentBoxHorizontalPadding } = theme.components.contentBox;
	const paddingLeftValue = `calc(${contentBoxHorizontalPadding} + ${node.indentPaddingLeft * (1 + $level)}px + ${
		node.titleSpacingLeft
	})`;
	const asChildPaddingLeftValue = `calc(${contentBoxHorizontalPadding} + ${node.indentPaddingLeft * (2 + $level)}px + ${
		node.titleSpacingLeft
	})`;

	return css`
		background: linear-gradient(
			to right,
			transparent ${paddingLeftValue},
			${$focused ? insertHint.focus.background : insertHint.background} ${paddingLeftValue}
		);
		display: none;
		height: ${hintHeight};
		left: 0;
		position: absolute;
		width: 100%;
		${$position === "top" &&
		css`
			top: -${hintHeight};
		`}
		${$position === "bottom" &&
		css`
			bottom: calc(1px - ${hintHeight});
		`}
		${$position === "asChild" &&
		css`
			bottom: -${hintHeight};
			${StyledTreeNodeContainer} > ${StyledTreeNodeContent} > && {
				background: linear-gradient(
					to right,
					transparent ${asChildPaddingLeftValue},
					${$focused ? insertHint.focus.background : insertHint.background} ${asChildPaddingLeftValue}
				);
			}
		`}
		${$available &&
		css`
			border: ${$focused ? insertHint.focus.border : insertHint.border};
			display: block;
			z-index: 1;
		`}
	`;
});
