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

import type { ReactElement, ContextType, ReactNode, MouseEvent, FocusEvent } from "react";
import { Children, Component } from "react";

import { Icon } from "../../../icon/main/icon.view.js";
import { bindMethods, joinClassNames, addPrefix } from "../../../common/main/utils.js";
import { A11YLanguageContext } from "../../../common/main/a11y-localization/language-context.js";
import { HiddenText } from "../../../common/index.js";

import { TreeContainer, TreeNode } from "../tpl/tree-elements.tpl.js";
import {
	StyledInsertableTreeActionButton,
	StyledInsertableTreeActionButtonGroup,
	StyledInsertableTreeHint
} from "../tpl/tree-elements.styled.js";

import type { InsertableTreeProps } from "./insertable-tree.api.js";

const baseClassName = addPrefix("treeWidget");

/**
 * @deprecated since 39.0.0. Prefer `TreeView` for new trees. There is no direct `TreeView` equivalent of
 * the insertion affordances yet; compose them with `TreeView`'s `getActions` / `dragDrop`.
 */
export function InsertableTree(props: InsertableTreeProps): ReactElement<InsertableTreeProps> {
	const { root, hideRoot, ...rest } = props;

	return (
		<TreeContainer {...rest}>
			<InsertableTree.TreeNodeTemplateRecursive
				node={root}
				hideRoot={hideRoot}
				level={hideRoot ? -1 : 0}
				id={root.id}
			/>
		</TreeContainer>
	);
}

InsertableTree.displayName = "InsertableTree";

export namespace InsertableTree {
	export function InsertHint(
		props: InsertableTreeProps.InsertHintProps
	): ReactElement<InsertableTreeProps.InsertHintProps> {
		const baseInsertClassName = `${baseClassName}__insertHint`;
		const className = joinClassNames(
			baseInsertClassName,
			{ [`${baseInsertClassName}--available`]: props.open },
			{ [`${baseInsertClassName}--focus`]: props.focus },
			`${baseInsertClassName}--${props.position}`,
			props.className
		);
		const { useLiTag } = props;

		return useLiTag ? (
			<StyledInsertableTreeHint
				as="li"
				id={props.id}
				style={props.style}
				className={className}
				$level={props.level}
				$position={props.position}
				$focused={props.focus}
				$available={props.open}
			/>
		) : (
			<StyledInsertableTreeHint
				$level={props.level}
				$position={props.position}
				$focused={props.focus}
				$available={props.open}
				id={props.id}
				style={props.style}
				className={className}
			/>
		);
	}

	export interface TreeNodeTemplateRecursiveState {
		hoveringPosition: InsertableTreeProps.InsertPosition | null;

		focus?: boolean;
		noEffect?: boolean;

		/**
		 * Indicate whether current Node(including its content, excluding its child nodes) is being focus
		 */
		highlighted?: boolean;
	}

	export class TreeNodeTemplateRecursive extends Component<
		InsertableTreeProps.InsertableTreeNodeRecursiveProps,
		TreeNodeTemplateRecursiveState
	> {
		static displayName = "InsertableTree.TreeNodeTemplateRecursive";
		declare context: ContextType<typeof A11YLanguageContext>;

		private treeNodeElement: HTMLElement | null = null;
		private buttonGroupRef: HTMLElement | null = null;

		constructor(props: InsertableTreeProps.InsertableTreeNodeRecursiveProps) {
			super(props);

			this.state = {
				hoveringPosition: null,
				highlighted: false
			};

			bindMethods(this);
		}

		render(): ReactNode {
			let children: ReactNode;

			const buttonTitles = this.props.node.buttonTitles;
			const childNodes = this.props.node.children;

			if (childNodes && childNodes.length > 0) {
				children = childNodes.map((childNode, index) => {
					return (
						<TreeNodeTemplateRecursive node={childNode} level={this.props.level + 1} key={index} id={childNode.id} />
					);
				});
			}

			const hasChildren = Children.count(children) > 0;

			const beforeContent = this.props.level > 0 && (
				<>
					<InsertHint
						level={this.props.level}
						position="top"
						open={this.state.hoveringPosition === "top"}
						focus={this.state.focus}
					/>
					{!hasChildren && (
						<InsertHint level={this.props.level} position="bottom" open={this.state.hoveringPosition === "bottom"} />
					)}
				</>
			);

			const buttonAttributes = {
				onTouchStart: this.addNoEffectClass,
				onTouchEnd: this.removeNoEffectClass
			};

			const nodeId = this.props.id;
			const hiddenNodeLabelId = `${nodeId}-hidden-label`;

			const content = (
				<>
					<InsertHint
						level={this.props.level}
						position="asChild"
						open={this.state.hoveringPosition === "asChild"}
						focus={this.state.focus}
					/>
					<StyledInsertableTreeActionButtonGroup
						className={`${baseClassName}__actionButtons`}
						wrapperRef={this.getButtonGroupRef}
					>
						{this.props.level > 0 && (
							<>
								<StyledInsertableTreeActionButton
									data-insert-position="top"
									className={`${addPrefix("h_blueBG")}`}
									primary
									icon={<Icon iconTheme="custom">insert_above</Icon>}
									title={buttonTitles?.top || this.getInsertButtonTitle("top")}
									onMouseOver={this.onMouseOver}
									onMouseLeave={this.onMouseLeave}
									onClick={this.onClick}
									onFocus={(e) => this.onMouseOver(e, true)}
									onBlur={this.onMouseLeave}
									buttonAttributes={{ "aria-labelledby": hiddenNodeLabelId, ...buttonAttributes }}
								/>
								<StyledInsertableTreeActionButton
									data-insert-position="bottom"
									className={`${addPrefix("h_blueBG")}`}
									primary
									icon={<Icon iconTheme="custom">insert_below</Icon>}
									title={buttonTitles?.bottom || this.getInsertButtonTitle("bottom")}
									onMouseOver={this.onMouseOver}
									onMouseLeave={this.onMouseLeave}
									onClick={this.onClick}
									onFocus={(e) => this.onMouseOver(e, true)}
									onBlur={this.onMouseLeave}
									buttonAttributes={{ "aria-labelledby": hiddenNodeLabelId, ...buttonAttributes }}
								/>
							</>
						)}
						<StyledInsertableTreeActionButton
							data-insert-position="asChild"
							className={`${addPrefix("h_blueBG")}`}
							primary
							icon={<Icon iconTheme="custom">insert_as_child</Icon>}
							title={buttonTitles?.asChild || this.getInsertButtonTitle("asChild")}
							onMouseOver={this.onMouseOver}
							onMouseLeave={this.onMouseLeave}
							onClick={this.onClick}
							onFocus={(e) => this.onMouseOver(e, true)}
							onBlur={this.onMouseLeave}
							buttonAttributes={{ "aria-labelledby": hiddenNodeLabelId, ...buttonAttributes }}
						/>
						<HiddenText id={hiddenNodeLabelId}>{this.props.node.label}</HiddenText>
					</StyledInsertableTreeActionButtonGroup>
				</>
			);

			if (this.props.hideRoot && this.props.level === -1) {
				return <>{children}</>;
			}

			const highlighted =
				this.state.highlighted || (!!document.activeElement && this.buttonGroupRef?.contains(document.activeElement));

			return (
				<TreeNode
					showArrow={hasChildren}
					onFocus={this.onHandleFocus}
					onBlur={this.onHandleBlur}
					id={nodeId}
					style={this.props.style}
					className={this.props.className}
					label={this.props.node.label}
					level={this.props.level}
					icon={this.props.node.icon}
					selected={this.props.node.selected}
					highlighted={highlighted}
					highlightVariant={this.props.node.highlightVariant}
					onArrowClick={this.props.node.onArrowClick}
					onTitleClick={this.handleNodeClick}
					hintPreview={beforeContent}
					content={content}
					nodeContentRef={this.nodeContentRef}
					noEffect={this.state.noEffect}
				>
					{children}
					{hasChildren && (
						<InsertHint
							level={this.props.level}
							position="bottom"
							open={this.state.hoveringPosition === "bottom"}
							focus={this.state.focus}
						/>
					)}
				</TreeNode>
			);
		}

		private updateInsertHintPosition(hoveringPosition: InsertableTreeProps.InsertPosition, focus?: boolean): void {
			this.setState({
				hoveringPosition,
				focus
			});
		}

		private addNoEffectClass(): void {
			this.treeNodeElement?.classList.add(`${baseClassName}__nodeContent--no-effect`);
			this.setState({ noEffect: true });
		}

		private removeNoEffectClass(): void {
			this.treeNodeElement?.classList.remove(`${baseClassName}__nodeContent--no-effect`);
			this.setState({ noEffect: false });
		}

		private onMouseOver(event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>, focus?: boolean): void {
			this.addNoEffectClass();
			this.updateInsertHintPosition(
				event.currentTarget.getAttribute("data-insert-position") as InsertableTreeProps.InsertPosition,
				focus
			);
		}

		private onMouseLeave(): void {
			this.removeNoEffectClass();
			this.setState({
				hoveringPosition: null,
				focus: false
			});
		}

		private onClick(event: MouseEvent<HTMLButtonElement>): void {
			event.stopPropagation();
			event.preventDefault();
			const position = event.currentTarget.getAttribute("data-insert-position") as InsertableTreeProps.InsertPosition;

			if (this.props.node.onInsert) {
				this.props.node.onInsert(position, this.props.node);
			}
		}

		private onHandleFocus(): void {
			this.setState({ highlighted: true });
		}

		private onHandleBlur(): void {
			this.setState({ highlighted: false });
		}

		private nodeContentRef(ref: HTMLElement | null): void {
			if (ref) {
				this.treeNodeElement = ref;
			}
		}

		private getButtonGroupRef(ref: HTMLElement | null): void {
			this.buttonGroupRef = ref;
		}

		private handleNodeClick(): void {
			if (this.props.node.onTitleClick) {
				this.props.node.onTitleClick();
			}

			this.setState({ highlighted: true });
		}

		private getInsertButtonTitle(position?: string): string | undefined {
			const treeTitles = this.context.treeTitles;

			switch (position) {
				case "top":
					return treeTitles?.insertTopButton;
				case "bottom":
					return treeTitles?.insertBottomButton;
				case "asChild":
					return treeTitles?.insertAsChildButton;
				default:
					return undefined;
			}
		}
	}
	TreeNodeTemplateRecursive.contextType = A11YLanguageContext;
}
