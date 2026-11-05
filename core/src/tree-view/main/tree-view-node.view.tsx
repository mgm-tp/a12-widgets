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
 * A single visible row of {@link TreeView}, rendered flat (no nesting). Reuses the legacy tree's styled
 * primitives for visual parity, but owns its own accessibility (role="treeitem", `aria-level`,
 * `aria-expanded`, `aria-selected`, `aria-setsize`/`aria-posinset`) and roving tabindex so the parent
 * can drive keyboard navigation from the headless model.
 * @module
 */

import type { FocusEvent, MouseEvent, ReactNode, RefObject } from "react";
import { memo, useContext, useState } from "react";

import type { A11yDefinition } from "../../common/main/a11y-localization/a11y-key-definition.api.js";
import { A11YLanguageContext } from "../../common/main/a11y-localization/language-context.js";
import { DataRoles } from "../../common/main/data-roles.js";
import { HiddenText } from "../../common/main/hidden-text/hidden-text.view.js";
import { addPrefix, joinClassNames } from "../../common/main/utils.js";
import {
	StyledTreeNodeActions,
	StyledTreeNodeContainer,
	StyledTreeNodeContent,
	StyledTreeNodeIcon,
	StyledTreeNodeName,
	StyledTreeNodeTitle
} from "../../tree/main/tpl/tree-elements.styled.js";
import { ArrowButton } from "../../tree/main/tpl/tree-elements.tpl.js";

import type { TreeViewDnDState } from "./tree-view-dnd.js";
import { useTreeViewNodeDnD } from "./tree-view-dnd.js";
import { StyledTreeViewDropBand } from "./tree-view.styled.js";

const baseClassName = addPrefix("treeWidget");

/** Internal props for {@link TreeViewNode}. @internal */
export interface TreeViewNodeProps {
	/** Stable node key — drives the element ids (`tree-node-<key>`, `tree-node-content-<key>`). */
	nodeKey: string;

	/** Depth in the tree; `0` for a top-level node. */
	level: number;

	/** 1-based position among siblings (for `aria-posinset`). */
	posinset: number;

	/** Sibling count (for `aria-setsize`). */
	setsize: number;

	/** Whether the node can be expanded. */
	expandable: boolean;

	/** Whether the node is currently expanded. */
	expanded: boolean;

	/** Whether the node's children are currently being fetched via lazy `loadChildren`. */
	loading: boolean;

	/** Whether the node is selectable (selection mode is not "none"). */
	selectable: boolean;

	/** Whether the node is currently selected. */
	selected: boolean;

	/** Whether the node is disabled. */
	disabled: boolean;

	/** Whether this node is the current roving tab stop (tabIndex 0). */
	active: boolean;

	/** Node label / custom content. */
	label: ReactNode;

	/**
	 * The parent node's label. Announced to screen readers as ", belongs to <parentLabel>" directly
	 * after this node's own name, so a user hears which parent the node sits under rather than only
	 * its `aria-level`. `undefined` for a top-level node.
	 */
	parentLabel?: ReactNode;

	/** Leading icon. */
	icon?: ReactNode;

	/** Trailing action buttons. */
	actions?: ReactNode;

	/** Toggles this node's expansion. */
	onToggleExpand(): void;

	/** Requests selection of this node (mouse). */
	onSelect(): void;

	/** Fired when the node content receives focus (parent updates the roving key). */
	onActivate(): void;

	/**
	 * `tabIndex` of the expand/collapse control, resolved from the tree's keyboard navigation mode:
	 * `undefined` leaves it in the tab order (Tab visits it after the node content, as in the legacy
	 * `Tree`), `-1` takes it out so the node content is the node's only tab stop.
	 */
	expanderTabIndex?: number;

	/** Index of this node in the flattened, visible rows (for DnD geometry). */
	rowIndex: number;

	/** Whether drag-and-drop is enabled for the tree. */
	dndEnabled: boolean;

	/** Live DnD state ref shared by the tree (rows, options, key resolver, indent). */
	dndStateRef: RefObject<TreeViewDnDState>;

	/** Flag set by the source tree's draggable so its monitor resolves the drop. */
	localDragRef: RefObject<boolean>;
}

export const TreeViewNode = memo(function TreeViewNode(props: TreeViewNodeProps) {
	const {
		nodeKey,
		level,
		posinset,
		setsize,
		expandable,
		expanded,
		loading,
		selectable,
		selected,
		disabled,
		active,
		label,
		parentLabel,
		icon,
		actions,
		onToggleExpand,
		onSelect,
		onActivate,
		expanderTabIndex,
		rowIndex,
		dndEnabled,
		dndStateRef,
		localDragRef
	} = props;

	const { treeTitles } = useContext<A11yDefinition>(A11YLanguageContext);
	const interactive = selectable && !disabled;

	const { dragRef, indicator, dragging } = useTreeViewNodeDnD({
		rowIndex,
		enabled: dndEnabled,
		stateRef: dndStateRef,
		localDragRef
	});

	// Suppress the row's hover/focus affordance while the pointer/focus is on the expander or actions,
	// so those controls don't look like they highlight the whole row (parity with the legacy tree).
	const [noEffect, setNoEffect] = useState(false);
	const [focusNoBorder, setFocusNoBorder] = useState(false);

	const handleArrowClick = (event: MouseEvent<HTMLElement>): void => {
		event.stopPropagation();
		onToggleExpand();
	};

	const handleContentClick = (): void => {
		if (interactive) {
			onSelect();
		}
	};

	// `onFocus` is `focusin` and bubbles, so focus on the chevron or an action button inside the node
	// reaches it too. Activating on those would move the roving tab stop onto this node mid-Tab-traversal,
	// which makes Tab and Shift+Tab visit different elements. Only the content's own focus re-anchors it.
	const handleContentFocus = (event: FocusEvent<HTMLElement>): void => {
		if (event.target === event.currentTarget) {
			onActivate();
		}
	};

	const suppressOn = {
		onMouseOver: (): void => setNoEffect(true),
		onMouseLeave: (): void => setNoEffect(false),
		onTouchStart: (): void => setNoEffect(true),
		onTouchEnd: (): void => setNoEffect(false),
		onFocus: (): void => setFocusNoBorder(true),
		onBlur: (event: FocusEvent<HTMLElement>): void => {
			// Only clear when focus actually leaves the suppressing control.
			if (!event.currentTarget.contains(event.relatedTarget as Node)) {
				setFocusNoBorder(false);
			}
		}
	};

	const a11yHint = ((): string | undefined => {
		if (disabled) {
			return treeTitles?.disabledItem;
		}

		if (selected) {
			return treeTitles?.selectedItem;
		}

		if (interactive) {
			return treeTitles?.selectableItem;
		}

		return undefined;
	})();

	const showParentLabel = level > 0 && parentLabel != null && parentLabel !== "";

	const contentClassName = joinClassNames(
		`${baseClassName}__nodeContent`,
		{ [`${baseClassName}__nodeContent--selected`]: selected && !disabled },
		{ [`${baseClassName}__nodeContent--disabled`]: disabled },
		{ [`${baseClassName}__nodeContent--interactive`]: interactive }
	);

	const bandLevel = indicator?.level ?? level;
	const bandForbidden = !!indicator?.forbidden;

	return (
		<StyledTreeNodeContainer
			ref={dragRef}
			$dragging={dragging}
			id={`tree-node-${nodeKey}`}
			className={joinClassNames(`${baseClassName}__node`, `${baseClassName}__node--level-${level}`)}
			data-role={DataRoles.Tree.Node}
			data-tree-level={level}
			role="presentation"
		>
			{dndEnabled && (
				<StyledTreeViewDropBand
					$position="top"
					$active={indicator?.type === "reorder-top"}
					$forbidden={bandForbidden}
					$level={bandLevel}
					data-role={DataRoles.Tree.Dropdown.HintTop}
					aria-hidden="true"
				/>
			)}
			<StyledTreeNodeContent
				id={`tree-node-content-${nodeKey}`}
				data-role={DataRoles.Tree.Node.Content}
				className={contentClassName}
				role="treeitem"
				aria-level={level + 1}
				aria-setsize={setsize}
				aria-posinset={posinset}
				aria-expanded={expandable ? expanded : undefined}
				aria-selected={selectable ? selected : undefined}
				aria-disabled={disabled || undefined}
				tabIndex={disabled ? undefined : active ? 0 : -1}
				onClick={interactive ? handleContentClick : undefined}
				onFocus={handleContentFocus}
				title={interactive ? (selected ? treeTitles?.selectedTitle : treeTitles?.selectableTitle) : undefined}
				$level={level}
				$noEffect={noEffect}
				$disabled={disabled}
				$selected={selected && !disabled}
				$interactive={interactive}
				$focusNoBorder={focusNoBorder}
				$draggable={dndEnabled}
				$dragging={dragging}
				$dragOver={indicator?.type === "child" && !bandForbidden}
				$dropForbidden={indicator?.type === "child" && bandForbidden}
			>
				{a11yHint && <HiddenText>{a11yHint}</HiddenText>}
				{expandable && (
					<ArrowButton
						id={`tree-node-arrow-${nodeKey}`}
						expanded={expanded}
						loading={loading}
						onToggleExpansion={handleArrowClick}
						tabIndex={expanderTabIndex}
						// Named after the node, the way the legacy `Tree` names its own: `aria-labelledby` overrides the
						// localized "Expand subitems" title, so the control announces which node it belongs to rather
						// than a string every chevron in the tree shares. It must stay out of `aria-hidden` - it is
						// focusable, and hiding a focusable element from assistive technology strands the focus.
						htmlAttributes={{ "aria-labelledby": `tree-node-name-${nodeKey}` }}
						{...suppressOn}
					/>
				)}
				<StyledTreeNodeTitle className={`${baseClassName}__nodeTitle`} data-role={DataRoles.Tree.Node.Title}>
					{icon && (
						<StyledTreeNodeIcon
							className={`${baseClassName}__nodeIcon`}
							id={`tree-node-icon-${nodeKey}`}
							data-role={DataRoles.Tree.Node.Icon}
						>
							{icon}
						</StyledTreeNodeIcon>
					)}
					<StyledTreeNodeName
						className={`${baseClassName}__nodeName`}
						id={`tree-node-name-${nodeKey}`}
						data-role={DataRoles.Tree.Node.Name}
					>
						{label}
					</StyledTreeNodeName>
					{showParentLabel && (
						<HiddenText htmlTag="div" htmlAttributes={{ "data-role": DataRoles.Tree.Node.ParentLabel }}>
							<HiddenText>{", " + (treeTitles?.belongTo ?? "")}</HiddenText>
							{parentLabel}
						</HiddenText>
					)}
					{actions && (
						<StyledTreeNodeActions
							className={`${baseClassName}__nodeActions`}
							data-role={DataRoles.Tree.Node.Actions}
							{...suppressOn}
						>
							{actions}
						</StyledTreeNodeActions>
					)}
				</StyledTreeNodeTitle>
			</StyledTreeNodeContent>
			{dndEnabled && (
				<StyledTreeViewDropBand
					$position="bottom"
					$active={indicator?.type === "reorder-bottom"}
					$forbidden={bandForbidden}
					$level={bandLevel}
					data-role={DataRoles.Tree.Dropdown.HintBottom}
					aria-hidden="true"
				/>
			)}
		</StyledTreeNodeContainer>
	);
});

TreeViewNode.displayName = "TreeViewNode";
