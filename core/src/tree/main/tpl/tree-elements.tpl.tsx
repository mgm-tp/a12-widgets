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
 * Template building blocks for the tree. These provide all the HTML markup needed to construct higher level,
 * interactive (behavioral) trees.
 *
 * The outermost component is {@link TreeContainer}, which can contain one or more {@link TreeNode}s.
 *
 * All other components are used internally by TreeNode.
 */
import type { KeyboardEvent, ReactElement, FC, MouseEvent, FocusEvent } from "react";
import { useRef, useCallback, useEffect, memo, useContext, Children, useState, useMemo } from "react";
import { Key } from "ts-key-enum";

import { HiddenText } from "../../../common/main/hidden-text/hidden-text.view.js";
import { useSelectedText } from "../../../common/main/hooks.js";
import {
	generateUid,
	getParentElement,
	joinClassNames,
	addPrefix,
	isVisibleOnScreen,
	getRole
} from "../../../common/main/utils.js";
import type { A11yDefinition } from "../../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../../common/main/data-roles.js";
import { useKeyboardNavigationMode } from "../../../keyboard-navigation/main/keyboard-navigation-context.js";

import { useTreeKeyboardNavigation } from "./use-tree-keyboard.js";
import type {
	TreeContainerProps,
	TreeNodeProps,
	TreeNodeContainerProps,
	SubNodesContainerProps,
	NodeContentProps,
	ArrowButtonProps,
	NodeIconProps,
	NodeTitleProps,
	NodeNameProps
} from "./tree.tpl.api.js";
import { StyledTreeContext } from "./tree.tpl.api.js";
import {
	StyledTreeContainer,
	StyledTreeNodeActions,
	StyledTreeNodeArrow,
	StyledTreeNodeArrowButton,
	StyledTreeNodeArrowIcon,
	StyledTreeNodeContainer,
	StyledTreeNodeContent,
	StyledTreeNodeIcon,
	StyledTreeNodeName,
	StyledTreeNodesContainer,
	StyledTreeNodeTitle
} from "./tree-elements.styled.js";

const baseClassName = addPrefix("treeWidget");
const baseTableClassName = addPrefix("table");

export function TreeContainer(props: TreeContainerProps): ReactElement<TreeContainerProps> {
	const { wrapperRef, className, fitToParent, style, children, scrollToNode, dnd, dataRole, ariaHidden, role } = props;
	const classNames = joinClassNames(baseClassName, { [`${baseClassName}--fit`]: fitToParent }, className);
	const id = props.id || `tree-wrapper-${generateUid()}`;
	const rootRef = useRef<HTMLDivElement>(null);

	const scrollToNodeHandler = useCallback((nodeId: string | number): void => {
		const nodeWrapperRef = document.getElementById(`tree-node-${nodeId}`);
		const nodeRef = document.getElementById(`tree-node-name-${nodeId}`);

		if (nodeWrapperRef && nodeRef && !isVisibleOnScreen(nodeRef)) {
			nodeRef.scrollIntoView({ block: "center" });
			nodeWrapperRef.tabIndex = -1;
			nodeWrapperRef.focus();
		}
	}, []);

	useEffect(() => {
		wrapperRef?.(rootRef?.current);
	}, [wrapperRef]);

	useEffect(() => {
		scrollToNode?.(scrollToNodeHandler);
	}, [scrollToNode, scrollToNodeHandler]);

	const { handleOnKeyDown } = useTreeKeyboardNavigation(rootRef);

	return (
		<StyledTreeContainer
			ref={rootRef}
			className={classNames}
			id={id}
			style={style}
			aria-hidden={ariaHidden}
			data-role={dataRole ?? DataRoles.Tree}
			onKeyDown={handleOnKeyDown}
			onClick={undefined}
			$dnd={dnd}
			$fit={fitToParent}
		>
			<StyledTreeNodesContainer
				className={`${baseClassName}__nodes`}
				id={`tree-root-node-${id}`}
				data-role={DataRoles.Tree.Nodes}
				role={getRole(role, "list")}
				$fit={fitToParent}
			>
				{children}
			</StyledTreeNodesContainer>
		</StyledTreeContainer>
	);
}

export const TreeNode: FC<TreeNodeProps> = memo(function TreeNode({
	actionButtons,
	beforeContent,
	children,
	className,
	content,
	disabled,
	dnd,
	expanded,
	focusable = true,
	highlightVariant,
	highlighted,
	hintPreview,
	icon,
	id: idProp,
	interactive: interactiveProp,
	label,
	level,
	noEffect: noEffectProp,
	nodeContentRef: nodeContentRefProp,
	onArrowClick,
	onBlur,
	onFocus,
	onKeyDown,
	onTitleClick,
	parentLabel,
	role,
	selected,
	showArrow,
	style
}) {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const treeContext = useContext(StyledTreeContext);
	const keyboardNavMode = useKeyboardNavigationMode("tree");
	const hasChildren = Children.count(children) > 0 && Children.toArray(children).some(Boolean);
	const id = idProp || generateUid();
	const interactive = !!interactiveProp || !!onTitleClick;
	const isArrowButtonDisabled = !onArrowClick;
	const expanderTabIndex = keyboardNavMode === "arrow-only" ? -1 : undefined;
	const successHighlighted = highlightVariant === "success";
	const [noEffect, setNoEffect] = useState(false);
	const [focusNoBorder, setFocusNoBorder] = useState(false);

	const handleArrowButtonClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			event.stopPropagation();
			onArrowClick?.();
		},
		[onArrowClick]
	);

	const nodeContentClassNames = useMemo(() => {
		return joinClassNames(
			{ [`${baseClassName}__nodeContent--${highlightVariant}`]: highlightVariant },
			{ [`${baseClassName}__nodeContent--highlighted`]: highlighted }
		);
	}, [highlightVariant, highlighted]);
	const nodeContentRef = useRef<HTMLElement | null>(null);
	const interactiveRow = useRef<HTMLElement | undefined>(undefined); // Support for TreeTable

	const addNoEffectClass = useCallback((): void => {
		if (disabled) {
			return;
		}

		if (interactiveRow.current) {
			interactiveRow.current.classList.add(`${baseTableClassName}__contentRow--no-effect`);
		} else if (interactive) {
			setNoEffect(true);
			nodeContentRef.current?.classList.add(`${baseClassName}__nodeContent--no-effect`);
		}
	}, [interactive, disabled]);

	const removeNoEffectClass = useCallback((): void => {
		if (disabled) {
			return;
		}

		if (interactiveRow.current) {
			interactiveRow.current.classList.remove(`${baseTableClassName}__contentRow--no-effect`);
		} else if (interactive) {
			setNoEffect(false);
			nodeContentRef.current?.classList.remove(`${baseClassName}__nodeContent--no-effect`);
		}
	}, [interactive, disabled]);

	const addFocusNoBorderClass = useCallback((): void => {
		if (interactiveRow.current) {
			interactiveRow.current.classList.add(`${baseTableClassName}__contentRow--focus-no-border`);
		} else if (interactive) {
			setFocusNoBorder(true);
			nodeContentRef.current?.classList.add(`${baseClassName}__nodeContent--focus-no-border`);
		}
	}, [interactive]);

	const removeFocusNoBorderClass = useCallback((): void => {
		if (interactiveRow.current) {
			interactiveRow.current.classList.remove(`${baseTableClassName}__contentRow--focus-no-border`);
		} else if (interactive) {
			setFocusNoBorder(false);
			nodeContentRef.current?.classList.remove(`${baseClassName}__nodeContent--focus-no-border`);
		}
	}, [interactive]);

	const onNodeFocus = useCallback(
		(e: FocusEvent<HTMLElement>) => {
			onFocus?.(e);

			if (e.target.classList.contains(`${baseClassName}__nodeName`)) {
				nodeContentRef.current?.focus();
			}
		},
		[onFocus]
	);

	const getNodeContentRef = useCallback(
		(ref: HTMLElement | null) => {
			nodeContentRef.current = ref;
			nodeContentRefProp?.(ref);

			if (ref) {
				interactiveRow.current = getParentElement(ref, (e) =>
					e.classList.contains(`${baseTableClassName}__contentRow`)
				);
			}
		},
		[nodeContentRefProp]
	);

	return (
		<TreeNodeContainer level={level} className={className} style={style} id={`tree-node-${id}`} role={role}>
			{beforeContent}
			<StyledTreeContext.Provider
				value={{
					...treeContext,
					highlightVariant: highlightVariant,
					highlighted: highlighted,
					focusNoBorder: focusNoBorder
				}}
			>
				<NodeContent
					disabled={disabled}
					onFocus={onNodeFocus}
					onBlur={onBlur}
					selected={!!selected}
					id={`tree-node-content-${id}`}
					onClick={onTitleClick}
					onKeyDown={onKeyDown}
					tabIndex={focusable ? (interactive ? 0 : -1) : undefined}
					interactive={interactive}
					className={nodeContentClassNames}
					noEffect={noEffectProp || noEffect}
					nodeContentRef={getNodeContentRef}
					level={level}
					highlighted={highlighted}
					successHighlighted={successHighlighted}
					dnd={dnd}
				>
					{showArrow || onArrowClick ? (
						<ArrowButton
							expanded={hasChildren || expanded === true}
							onToggleExpansion={handleArrowButtonClick}
							id={`tree-node-arrow-${id}`}
							onMouseOver={addNoEffectClass}
							onMouseLeave={removeNoEffectClass}
							onTouchStart={addNoEffectClass}
							onTouchEnd={removeNoEffectClass}
							onFocus={addFocusNoBorderClass}
							onBlur={removeFocusNoBorderClass}
							disabled={isArrowButtonDisabled}
							tabIndex={expanderTabIndex}
							htmlAttributes={{
								"aria-labelledby": `tree-node-name-${id}`
							}}
						/>
					) : undefined}
					<NodeTitle id={`tree-node-title-${id}`}>
						{icon ? <NodeIcon id={`tree-node-icon-${id}`}>{icon}</NodeIcon> : undefined}
						<NodeName id={`tree-node-name-${id}`}>{label}</NodeName>
						{parentLabel && level > 0 && (
							<HiddenText htmlTag="div">
								<HiddenText>{", " + (languageContext.treeTitles?.belongTo ?? "")}</HiddenText>
								{parentLabel}
							</HiddenText>
						)}

						{actionButtons && (
							<StyledTreeNodeActions
								className={`${baseClassName}__nodeActions`}
								data-role={DataRoles.Tree.Node.Actions}
								onMouseOver={addNoEffectClass}
								onMouseLeave={removeNoEffectClass}
								onTouchStart={addNoEffectClass}
								onTouchEnd={removeNoEffectClass}
								onFocus={addFocusNoBorderClass}
								onBlur={removeFocusNoBorderClass}
							>
								{actionButtons}
							</StyledTreeNodeActions>
						)}
					</NodeTitle>
					{content}
					{hintPreview}
				</NodeContent>
			</StyledTreeContext.Provider>
			{hasChildren ? <SubNodesContainer id={`tree-sub-node-${id}`}>{children}</SubNodesContainer> : undefined}
		</TreeNodeContainer>
	);
});

export const TreeNodeContainer = memo(function TreeNodeContainer(
	props: TreeNodeContainerProps
): ReactElement<TreeNodeContainerProps> {
	const className = joinClassNames(
		`${baseClassName}__node`,
		`${baseClassName}__node--level-${props.level}`,
		props.className
	);

	return (
		<StyledTreeNodeContainer
			className={className}
			style={props.style}
			id={props.id}
			data-role={DataRoles.Tree.Node}
			data-tree-level={props.level}
			role={getRole(props.role, "listitem")}
		>
			{props.children}
		</StyledTreeNodeContainer>
	);
});

export const SubNodesContainer = memo(function SubNodesContainer(
	props: SubNodesContainerProps
): ReactElement<SubNodesContainerProps> {
	const classNames = joinClassNames(`${baseClassName}__subnodes`, props.className);

	return (
		<div
			className={classNames}
			style={props.style}
			id={props.id}
			data-role={DataRoles.Tree.Subnodes}
			role={getRole(props.role, "list")}
		>
			{props.children}
		</div>
	);
});

export const NodeContent = memo(function NodeContent(props: NodeContentProps): ReactElement<NodeContentProps> {
	const nodeContentRef = useRef<HTMLElement | null>(null);
	const { isSelectedText } = useSelectedText(nodeContentRef);
	const context = useContext(A11YLanguageContext);
	const a11yTitles = context.treeTitles;
	const isInteractive = !props.disabled && props.interactive;
	const nodeClassName = joinClassNames(
		`${baseClassName}__nodeContent`,
		{ [`${baseClassName}__nodeContent--disabled`]: props.disabled },
		{ [`${baseClassName}__nodeContent--selected`]: !props.disabled && props.selected },
		{ [`${baseClassName}__nodeContent--interactive`]: isInteractive },
		props.className
	);
	const onClick = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation();

		if (props.dnd) {
			window.getSelection()?.removeAllRanges();
		}

		// allow select the text of the node without trigger props.onTitleClick() event.
		if (!window.getSelection) {
			props.onClick?.(event);
		} else {
			if (!isSelectedText) {
				props.onClick?.(event);
			}
		}
	};

	const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key === Key.Enter && event.target === nodeContentRef.current) {
			props.onClick?.(event as unknown as MouseEvent<HTMLElement>);
		}

		props.onKeyDown?.(event);
	};

	const hiddenText = useMemo(() => {
		let hiddenText = props.interactive && a11yTitles?.selectableItem;

		if (props.selected) {
			hiddenText = a11yTitles?.selectedItem;
		}

		if (props.disabled) {
			hiddenText = a11yTitles?.disabledItem;
		}

		if (props.highlighted && !props.selected) {
			hiddenText = a11yTitles?.highlightedItem;
		}

		if (props.successHighlighted) {
			hiddenText = a11yTitles?.successHighlightedItem;
		}

		return !!hiddenText && <HiddenText>{hiddenText}</HiddenText>;
	}, [props.interactive, props.selected, props.disabled, props.highlighted, props.successHighlighted, a11yTitles]);

	return (
		<StyledTreeNodeContent
			ref={(ref) => {
				nodeContentRef.current = ref;
				props.nodeContentRef?.(ref);
			}}
			tabIndex={props.disabled ? undefined : props.selected && !props.highlighted ? -1 : props.tabIndex}
			onFocus={props.onFocus}
			onBlur={props.onBlur}
			className={nodeClassName}
			style={props.style}
			id={props.id}
			data-role={DataRoles.Tree.Node.Content}
			aria-selected={!props.disabled && props.selected ? true : undefined}
			onClick={props.onClick && !props.disabled ? onClick : undefined}
			onKeyDown={props.disabled ? undefined : onKeyDown}
			$level={props.level}
			$noEffect={props.noEffect}
			$disabled={props.disabled}
			$selected={!props.disabled && props.selected}
			$interactive={isInteractive}
			title={isInteractive ? (props.selected ? a11yTitles?.selectedTitle : a11yTitles?.selectableTitle) : undefined}
		>
			{hiddenText}
			{props.children}
		</StyledTreeNodeContent>
	);
});

export const ArrowButton = memo(function ArrowButton(props: ArrowButtonProps): ReactElement<ArrowButtonProps> {
	const languageContext = useContext<A11yDefinition>(A11YLanguageContext);
	const a11yTitles = languageContext.treeTitles;
	const className = joinClassNames(
		`${baseClassName}__nodeArrow`,
		{ [`${baseClassName}__nodeArrow--active`]: !props.disabled && props.expanded },
		props.className
	);
	const icon = props.expanded ? (
		<StyledTreeNodeArrowIcon>expand_more</StyledTreeNodeArrowIcon>
	) : (
		<StyledTreeNodeArrowIcon>chevron_right</StyledTreeNodeArrowIcon>
	);

	return (
		<StyledTreeNodeArrow
			className={className}
			style={props.style}
			id={props.id}
			data-role={DataRoles.Tree.Node.Expander}
			onMouseOver={props.onMouseOver}
			onMouseLeave={props.onMouseLeave}
			onTouchStart={props.onTouchStart}
			onTouchEnd={props.onTouchEnd}
			onFocus={props.onFocus}
			onBlur={props.onBlur}
		>
			<StyledTreeNodeArrowButton
				buttonAttributes={{ [`aria-expanded`]: props.expanded, ...props.htmlAttributes }}
				icon={icon}
				title={a11yTitles && (props.expanded ? a11yTitles.collapseButton : a11yTitles.expandButton)}
				onClick={props.onToggleExpansion}
				onKeyDown={(event) => {
					if (event.key === Key.Enter) {
						event.stopPropagation();
					}
				}}
				disabled={props.disabled}
				loading={props.loading}
				tabIndex={props.tabIndex}
				$active={!props.disabled && props.expanded}
			/>
		</StyledTreeNodeArrow>
	);
});

export const NodeTitle = memo(function NodeTitle(props: NodeTitleProps): ReactElement<NodeTitleProps> {
	const { onToggleSelection, className } = props;
	const classNames = joinClassNames(`${baseClassName}__nodeTitle`, className);
	const onKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			if (event.key !== "Enter" || !onToggleSelection) {
				return;
			}

			onToggleSelection();
		},
		[onToggleSelection]
	);

	return (
		<StyledTreeNodeTitle
			className={classNames}
			style={props.style}
			id={props.id}
			data-role={DataRoles.Tree.Node.Title}
			onClick={props.disabled ? undefined : props.onToggleSelection}
			onKeyDown={props.disabled ? undefined : onKeyDown}
		>
			{props.children}
		</StyledTreeNodeTitle>
	);
});

export const NodeIcon = memo(function NodeIcon(props: NodeIconProps): ReactElement<NodeTitleProps> {
	const classNames = joinClassNames(`${baseClassName}__nodeIcon`, props.className);

	return (
		<StyledTreeNodeIcon className={classNames} style={props.style} id={props.id} data-role={DataRoles.Tree.Node.Icon}>
			{props.children}
		</StyledTreeNodeIcon>
	);
});

export const NodeName = memo(function NodeName(props: NodeNameProps): ReactElement<NodeTitleProps> {
	const classNames = joinClassNames(`${baseClassName}__nodeName`, props.className);

	return (
		<StyledTreeNodeName className={classNames} style={props.style} id={props.id} data-role={DataRoles.Tree.Node.Name}>
			{props.children}
		</StyledTreeNodeName>
	);
});

TreeContainer.displayName = "TreeContainer";
TreeNode.displayName = "TreeNode";
TreeNodeContainer.displayName = "TreeNodeContainer";
SubNodesContainer.displayName = "SubNodesContainer";
NodeContent.displayName = "NodeContent";
ArrowButton.displayName = "ArrowButton";
NodeTitle.displayName = "NodeTitle";
NodeIcon.displayName = "NodeIcon";
NodeName.displayName = "NodeName";
