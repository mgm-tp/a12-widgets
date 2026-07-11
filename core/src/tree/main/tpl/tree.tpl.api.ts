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

/**
 * Template for a whole tree. This is basically only a recursive function around the elements.
 * @module
 */

import type { RefCallback, ReactNode, SyntheticEvent, FocusEvent, KeyboardEvent, MouseEvent, TouchEvent } from "react";
import { createContext } from "react";

import type {
	Container,
	Identifiable,
	Ref,
	DataRole,
	Styleable,
	HTMLAttributes
} from "../../../common/main/base-props.js";

export interface TreeTemplateProps extends Styleable, Identifiable {
	/**
	 * Root of the tree.
	 */
	root: TreeNodeTemplateModel;

	/**
	 * Whether the top-level node should be hidden.
	 */
	hideRoot?: boolean;

	/**
	 * Whether the tree fits 100% to the parent.
	 */
	fitToParent?: boolean;

	/**
	 * Callback to get ref of the tree.
	 * @param ref – the reference to the root node content element.
	 */
	getDOMRef?: RefCallback<HTMLElement>;

	/**
	 * Get a handler which helps to scroll to a node's position in the container.
	 * @param handler – scroll to a node based on its id
	 */
	scrollToNode?(handler: (nodeId: string | number) => void): void;
}

export type TreeHighlightVariant = "success";

export interface TreeNodeBaseProps extends Identifiable {
	/**
	 * Label of the tree node.
	 */
	label: ReactNode;

	/**
	 * Icon of the tree node.
	 */
	icon?: ReactNode;

	/**
	 * Whether the tree node is selected or not.
	 */
	selected?: boolean;

	/**
	 * Whether the node has a different background.
	 */
	highlightVariant?: TreeHighlightVariant;

	/**
	 * Whether the tree not is disabled or not.
	 */
	disabled?: boolean;

	/**
	 * Action buttons of a node that will be placed at the end of the node.
	 */
	actionButtons?: ReactNode;

	/**
	 * A callback will be fired when clicking the arrow button.
	 */
	onArrowClick?(): void;

	/**
	 * A callback will be fired when clicking the title.
	 */
	onTitleClick?(event?: SyntheticEvent): void;
}

export interface TreeNodeTemplateModel extends TreeNodeBaseProps {
	/**
	 * Tree Node's children.
	 */
	children?: TreeNodeTemplateModel[];

	/**
	 * A callback will be fired when dragging over the node.
	 */
	onDragOver?(): void;

	/**
	 * A callback will be fired when dragged element leaves a valid droppable node.
	 */
	onDragLeave?(): void;

	/**
	 * @internal
	 */
	level?: number;
}

export interface TreeContainerProps extends Styleable, Identifiable, Container, DataRole, Ref<HTMLDivElement> {
	/**
	 * Whether the tree fits 100% to the parent.
	 */
	fitToParent?: boolean;

	/**
	 * Value of the role attribute, in order to support Accessibility.
	 * - Set to a string value, use passed value.
	 * - Set to false, not set role attribute for the element.
	 * - Set to true/undefined, use default value.
	 * @default role="list"
	 */
	role?: string | boolean;

	/**
	 * aria-hidden attribute for the Tree.
	 */
	ariaHidden?: boolean;

	/**
	 * @internal
	 */
	dnd?: boolean;

	/**
	 * Get a handler which helps to scroll to a node's position in the container.
	 * @param handler – scroll to a node based on its id
	 */
	scrollToNode?(handler: (nodeId: string | number) => void): void;
}

export interface TreeNodeProps extends TreeNodeBaseProps, Container, Styleable {
	/**
	 * Indent level from the left edge of the node.
	 * Min is 0 and max is 10
	 */
	level: number;

	/**
	 * Elements before the main content of the node.
	 *
	 * @deprecated since 36.4.0. Use {@link hintPreview}. It has been deprecated for multiple reasons:
	 * 	- It is mainly used to display the preview hint for DnD or Insertable Tree, but the name is not clear
	 * 	- It's placed adjacent to the NodeContent element which makes it impossible to display the "bottom" hint when
	 * 	  the node has expanded children due to "position: relative"
	 */
	beforeContent?: ReactNode;

	/**
	 * To define a preview hint element for the droppable view (DnDTree) or insertable view (InsertableTree).
	 */
	hintPreview?: ReactNode;

	/**
	 * Whether the node is expanded or not.
	 */
	expanded?: boolean;

	/**
	 * Whether the node can be focused or not.
	 */
	focusable?: boolean;

	/**
	 * Whether the node is highlighted or not.
	 */
	highlighted?: boolean;

	/**
	 * Whether an arrow button should be shown in the node or not.
	 * If the {@link onArrowClick} is given, then showArrow = false would not affect the node.
	 */
	showArrow?: boolean;

	/**
	 * Whether the node is interactive or not.
	 * @default if the {@link onTitleClick} is given, the node is interactive. Otherwise, it is non-interactive.
	 */
	interactive?: boolean;

	/**
	 * Custom data to be rendered inside the NodeContent.
	 */
	content?: ReactNode;

	/**
	 * Parent node's label.
	 */
	parentLabel?: ReactNode;

	/**
	 * A handler will be called when clicking the arrow button.
	 */
	onArrowClick?(): void;

	/**
	 * Callback to get ref of the node content.
	 * @param ref – the reference to the node content element.
	 */
	nodeContentRef?: RefCallback<HTMLElement>;

	/**
	 * A handler will be called when the node receives focus.
	 */
	onFocus?(event: FocusEvent<HTMLElement>): void;

	/**
	 * A handler will be called when blurring the node.
	 */
	onBlur?(event: FocusEvent<HTMLElement>): void;

	/**
	 * Key down handler for the tree node.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * @internal
	 */
	noEffect?: boolean;

	/**
	 * @internal
	 */
	dnd?: boolean;

	/**
	 * Value of the role attribute, in order to support Accessibility.
	 * - Set to a string value, use passed value.
	 * - Set to false, not set role attribute for the element.
	 * - Set to true/undefined, use default value.
	 * @default role="listitem"
	 */
	role?: string | boolean;
}

export interface TreeNodeContainerProps extends Container, Styleable, Identifiable {
	/**
	 * 	Indent level from the left edge of the node.
	 *  Min is 0 and max is 10
	 */
	level: number;

	/**
	 * Value of the role attribute, in order to support Accessibility.
	 * - Set to a string value, use passed value.
	 * - Set to false, not set role attribute for the element.
	 * - Set to true/undefined, use default value.
	 * @default role="listitem"
	 */
	role?: string | boolean;
}

export interface NodeContentProps extends Container, Styleable, Identifiable {
	/**
	 * Whether the node content is selected or not.
	 * Only affect when {@link disabled} is false.
	 */
	selected: boolean;

	/**
	 * Whether the node content is disabled or not.
	 */
	disabled?: boolean;

	/**
	 * Defines tabindex of the node content.
	 */
	tabIndex?: number;

	/**
	 * Whether the node content is interactive or not. Only affect when {@link disabled} is false.
	 */
	interactive?: boolean;

	/**
	 * Callback to get ref of the node content.
	 * @param ref – the reference to the node content element.
	 */
	nodeContentRef?: RefCallback<HTMLElement>;

	/**
	 * Click handler for the node content.
	 */
	onClick?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Key down handler for the node content.
	 */
	onKeyDown?(event: KeyboardEvent<HTMLElement>): void;

	/**
	 * A handler will be called when the node content gets focus.
	 */
	onFocus?(event: FocusEvent<HTMLElement>): void;

	/**
	 * A handler will be called when blurring the node content.
	 */
	onBlur?(event: FocusEvent<HTMLElement>): void;

	/**
	 * @internal
	 */
	noEffect?: boolean;

	/**
	 * Indent level from the left edge of node.
	 * Min is 0 and max is 10
	 * @internal
	 */
	level?: number;

	/**
	 * @internal
	 * Whether node content is highlighted or not.
	 */
	highlighted?: boolean;

	/**
	 * @internal
	 * Whether node content is successfully highlighted or not.
	 */
	successHighlighted?: boolean;

	/**
	 * @internal
	 */
	dnd?: boolean;
}

export interface ArrowButtonProps extends Styleable, Identifiable, HTMLAttributes {
	/**
	 * Whether the arrow button is expanded or not.
	 * The direction of the arrow would be:
	 * - Right-pointing if false.
	 * - Down-pointing if true.
	 */
	expanded: boolean;

	/**
	 * Whether the arrow button is disabled or not.
	 */
	disabled?: boolean;

	/**
	 * Whether the arrow button shows a loading indicator instead of the chevron. Used while a node's
	 * children are being fetched lazily. The button is non-interactive while loading.
	 */
	loading?: boolean;

	/**
	 * tabIndex for the arrow button element.
	 * Set to -1 in arrow-only keyboard navigation mode to remove it from Tab order.
	 */
	tabIndex?: number;

	/**
	 * A handler when clicking on the arrow button.
	 */
	onToggleExpansion(event?: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse-over handler for the arrow button.
	 */
	onMouseOver?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Mouse-leave handler for the arrow button.
	 */
	onMouseLeave?(event: MouseEvent<HTMLElement>): void;

	/**
	 * Focus handler for the arrow button.
	 */
	onFocus?(event: FocusEvent<HTMLElement>): void;

	/**
	 * A handler for the arrow button when blurring.
	 */
	onBlur?(event: FocusEvent<HTMLElement>): void;

	/**
	 * Touch-start handler for the arrow button.
	 */
	onTouchStart?(event: TouchEvent<HTMLElement>): void;

	/**
	 * Touch-end handler for the arrow button.
	 */
	onTouchEnd?(event: TouchEvent<HTMLElement>): void;
}

export interface NodeTitleProps extends Container, Styleable, Identifiable {
	/**
	 * Whether the node tile is disabled or not.
	 */
	disabled?: boolean;

	/**
	 * A handler when the node tile is clicked.
	 */
	onToggleSelection?(): void;
}

export interface SubNodesContainerProps extends Container, Styleable, Identifiable {
	/**
	 * Value of the role attribute, in order to support Accessibility.
	 * - Set to a string value, use passed value.
	 * - Set to false, not set role attribute for the element.
	 * - Set to true/undefined, use default value.
	 * @default role="list"
	 */
	role?: string | boolean;
}

export interface NodeIconProps extends Container, Styleable, Identifiable {}

export interface NodeNameProps extends Container, Styleable, Identifiable {}

export interface TreeNodeRecursiveProps extends Styleable, Identifiable {
	node: TreeNodeTemplateModel;
	level: number;
	hideRoot?: boolean;
}

type TreeContextType = {
	highlighted?: boolean;
	draggable?: boolean;
	dragging?: boolean;
	dragOver?: boolean;
	dropForbidden?: boolean;
	focusNoBorder?: boolean;
	highlightVariant?: TreeHighlightVariant;
};

export const StyledTreeContext = createContext<TreeContextType>({});
