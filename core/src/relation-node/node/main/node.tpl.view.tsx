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

import type { MouseEvent, ReactElement, SyntheticEvent, TouchEvent, FocusEvent } from "react";
import { useRef, useState, useCallback, Children, isValidElement, cloneElement } from "react";

import { addPrefix, getParentElement, isElementFocusable, joinClassNames } from "../../../common/main/utils.js";
import { provider } from "../../../common/main/device-detector.js";
import { CssEllipsis } from "../../../css-ellipsis/main/css-ellipsis.view.js";
import { DataRoles } from "../../../common/index.js";

import type { NodeTplProps } from "./node.tpl.api.js";

const baseNodeClassName = addPrefix("relationship-node");

/**
 * @deprecated since 38.2.0. Use {@link DiagramNode} from model-graph-diagram instead.
 * @see {@link DiagramNode}
 * @see {@link ModelDiagramNodeProps}
 */
export namespace NodeTpl {
	/**
	 * @deprecated since 38.2.0. Use {@link DiagramNode} from model-graph-diagram instead.
	 * @see {@link DiagramNode}
	 * @see {@link ModelDiagramNodeProps}
	 */
	export function Node(props: NodeTplProps.NodeProps): ReactElement<NodeTplProps.NodeProps> {
		const { children, title, className, selected, onClick, ...rest } = props;
		const nodeRef = useRef<HTMLElement | null>(null);
		const [hover, setHover] = useState(false);

		const onMouseOver = useCallback((event: MouseEvent<HTMLElement>) => {
			const target = event.target as HTMLElement;

			if (
				(!isElementFocusable(target) || target.getAttribute("data-role") === "port") &&
				(target.getAttribute("data-role") === `${DataRoles.Node.Title}` ||
					getParentElement(target, (element) => element.getAttribute("data-role") === `${DataRoles.Node.Title}`))
			) {
				setHover(true);
			}
		}, []);
		const onMouseOut = useCallback(() => {
			setHover(false);
		}, []);
		const childArray = Children.toArray(children);

		return (
			<div
				data-role={DataRoles.Node}
				tabIndex={0}
				ref={(ref) => {
					nodeRef.current = ref;
				}}
				className={joinClassNames(
					baseNodeClassName,
					{ [`${baseNodeClassName}--selected`]: selected },
					{ [`${baseNodeClassName}--hover`]: hover },
					className
				)}
				onMouseOver={onMouseOver}
				onMouseOut={onMouseOut}
				{...rest}
			>
				{title}
				{childArray.map((child, index) =>
					isValidElement(child)
						? cloneElement(child, {
								// @ts-expect-error Simple suspression. This file will be deleted soon.
								selected: selected ?? child.props.selected,
								isLast: index === childArray.length - 1
							})
						: child
				)}
			</div>
		);
	}

	interface RoleInternalProps {
		isLast?: boolean;
	}

	/**
	 * @deprecated since 38.2.0. Use {@link DiagramNode} from model-graph-diagram instead.
	 * @see {@link DiagramNode}
	 * @see {@link ModelDiagramNodeProps}
	 */
	export function NodeTitle(props: NodeTplProps.BaseProps): ReactElement {
		const { onClick, children } = props;

		const onKeyDown = useCallback(
			(event: SyntheticEvent<HTMLElement, KeyboardEvent>) => {
				if (event.nativeEvent.key === "Enter") {
					onClick?.(event);
				}
			},
			[onClick]
		);

		return (
			<div
				data-role={DataRoles.Node.Title}
				className={`${baseNodeClassName}__title`}
				onClick={onClick}
				onKeyDown={onKeyDown}
			>
				{children}
			</div>
		);
	}

	/**
	 * @deprecated since 38.2.0. Use {@link DiagramNode} from model-graph-diagram instead.
	 * @see {@link DiagramNode}
	 * @see {@link ModelDiagramNodeProps}
	 */
	export function TitleText(props: NodeTplProps.BaseProps): ReactElement {
		return (
			<CssEllipsis data-role={DataRoles.Node.Title.Text} className={`${baseNodeClassName}__title-text`} maxLine={2}>
				{props.children}
			</CssEllipsis>
		);
	}

	/**
	 * @deprecated since 38.2.0. Use {@link DiagramNode} from model-graph-diagram instead.
	 * @see {@link DiagramNode}
	 * @see {@link ModelDiagramNodeProps}
	 */
	export function NodeIcon(props: NodeTplProps.BaseProps): ReactElement {
		return (
			<div data-role={DataRoles.Node.Title.Icon} className={`${baseNodeClassName}__title-icon`} {...props}>
				{props.children}
			</div>
		);
	}

	/**
	 * @deprecated since 38.2.0. Use {@link DiagramNode} from model-graph-diagram instead.
	 * @see {@link DiagramNode}
	 * @see {@link ModelDiagramNodeProps}
	 */
	export function Role(props: NodeTplProps.RoleProps & RoleInternalProps): ReactElement<NodeTplProps.RoleProps> {
		const { children, className, selected, isLast, ...rest } = props;
		const [noEffect, setNoEffect] = useState(false);
		const [portFocus, setPortFocus] = useState(false);

		const addNoEffectClass = useCallback((event: MouseEvent<HTMLElement> | TouchEvent<HTMLElement>): void => {
			const target = event.target as HTMLElement;

			if (
				isElementFocusable(target) &&
				target.getAttribute("data-role") !== `${DataRoles.Node.Role}` &&
				target.getAttribute("data-role") !== "port"
			) {
				setNoEffect(true);
			}
		}, []);

		const removeNoEffectClass = useCallback((): void => {
			setNoEffect(false);
		}, []);

		const onFocus = useCallback((event: FocusEvent<HTMLElement>) => {
			if (event.target.getAttribute("data-role") === "port") {
				setPortFocus(true);
			}
		}, []);

		const onBlur = useCallback(() => {
			setPortFocus(false);
			requestAnimationFrame(() => setNoEffect(false));
		}, []);

		const onMouseOver = useCallback(
			(event: MouseEvent<HTMLElement>) => {
				if (provider.hasTouch()) {
					return;
				}

				addNoEffectClass(event);
			},
			[addNoEffectClass]
		);

		return (
			<div
				tabIndex={0}
				onMouseOver={onMouseOver}
				onMouseOut={removeNoEffectClass}
				onTouchStart={addNoEffectClass}
				onFocus={onFocus}
				onBlur={onBlur}
				className={joinClassNames(
					`${baseNodeClassName}__role`,
					{ [`${baseNodeClassName}__role--last`]: isLast },
					{ [`${baseNodeClassName}__role--selected`]: selected },
					{ [`${baseNodeClassName}__role--no-effect`]: noEffect },
					{ [`${baseNodeClassName}__role--port-focus`]: portFocus },
					className
				)}
				data-role={DataRoles.Node.Role}
				{...rest}
			>
				{props.children}
			</div>
		);
	}

	/**
	 * @deprecated since 38.2.0. Use {@link DiagramNode} from model-graph-diagram instead.
	 * @see {@link DiagramNode}
	 * @see {@link ModelDiagramNodeProps}
	 */
	export function RoleContent(props: NodeTplProps.RoleContentProps): ReactElement<NodeTplProps.RoleProps> {
		const { children, info, meta } = props;

		return (
			<>
				{info && (
					<div className={`${baseNodeClassName}__role-info`} data-role={DataRoles.Node.Role.Info}>
						<CssEllipsis maxLine={2}>{info}</CssEllipsis>
					</div>
				)}
				<div className={`${baseNodeClassName}__role-content`} data-role={DataRoles.Node.Role.Content}>
					<div className={`${baseNodeClassName}__role-content-wrapper`}>
						<CssEllipsis maxLine={2}>{children}</CssEllipsis>
					</div>

					{meta && (
						<div className={`${baseNodeClassName}__role-meta`} data-role={DataRoles.Node.Role.Meta}>
							{meta}
						</div>
					)}
				</div>
			</>
		);
	}
}
