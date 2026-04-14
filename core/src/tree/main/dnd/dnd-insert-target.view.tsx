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
 * INTERNAL.
 *
 * The TreeInsertTarget is a special drop target placeholder for the area in-between tree nodes.
 */
import type { ReactNode } from "react";
import { useRef } from "react";
import { useDrop } from "react-dnd";

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";
import { DataRoles } from "../../../common/main/data-roles.js";

import { StyledTreeDropHint, StyledTreeDropTarget } from "../tpl/tree-elements.styled.js";

import type { TreeInsertTargetProps } from "./dnd-tree.api.js";
import { TreeNodeDropType } from "./dnd-tree.api.js";

const baseClassName = addPrefix("treeWidget");

export function TreeInsertTarget(props: TreeInsertTargetProps): ReactNode {
	const ref = useRef<HTMLDivElement>(null);
	const [{ isSomethingDragging, canDrop, isOver }, dropConnector] = useDrop({
		accept: props.type || TreeNodeDropType,
		collect: (monitor) => ({
			isOver: monitor.isOver(),
			isSomethingDragging: !!monitor.getItem(),
			canDrop: monitor.canDrop()
		}),
		drop: (item, monitor) => {
			if (monitor.didDrop() || !monitor.canDrop() || !monitor.isOver({ shallow: true }) || !monitor.getItem()) {
				return undefined;
			}

			return {
				parentNode: props.parentNode,
				precedingNode: props.precedingNode,
				subsequentNode: props.subsequentNode
			};
		},
		canDrop: (item, monitor) => {
			if (!monitor.isOver({ shallow: true })) {
				return false;
			}

			if (props.canDropOnto) {
				return props.canDropOnto(props, monitor.getItem(), true);
			}

			return true;
		}
	});
	dropConnector(ref);
	const className = joinClassNames(
		`${baseClassName}__dropHint`,
		{ [`${baseClassName}__dropHint--top`]: props.top },
		{ [`${baseClassName}__dropHint--bottom`]: !props.top },
		{ [`${baseClassName}__dropHint--available`]: isSomethingDragging },
		{ [`${baseClassName}__dropHint--opened`]: isOver && canDrop },
		{ [`${baseClassName}__dropHint--dropForbidden`]: isOver && !canDrop },
		props.className
	);

	return (
		<StyledTreeDropHint
			className={className}
			style={props.style}
			id={props.id}
			ref={ref}
			data-role={props.top ? DataRoles.Tree.Dropdown.HintTop : DataRoles.Tree.Dropdown.HintBottom}
			$position={props.top ? "top" : "bottom"}
			$level={props.level}
			$available={isSomethingDragging}
			$opened={isOver && canDrop}
			$dropForbidden={isOver && !canDrop}
		>
			<StyledTreeDropTarget
				className={`${baseClassName}__dropTarget`}
				data-role={DataRoles.Tree.Dropdown.Target}
				$opened={isOver && canDrop}
				$dropForbidden={isOver && !canDrop}
			/>
		</StyledTreeDropHint>
	);
}

TreeInsertTarget.displayName = "TreeInsertTarget";
