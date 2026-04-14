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

import { memo, useEffect, useRef } from "react";

import { TableTemplate } from "../main/template/index.js";

import type { TableRenderPropsType } from "./table-renderer.api.js";
import { getRowKey } from "./table.utils.js";
import { useTableContext } from "./table.context.js";

/** @internal */
export const Body = memo(function Body(props: TableRenderPropsType.BodyProps) {
	const dndBodyRowRenderer = useTableContext((context) => context.componentRenderers.dndBodyRowRenderer);
	const bodyRowRenderer = useTableContext((context) => context.componentRenderers.bodyRowRenderer);
	const enableDragDrop = useTableContext((context) => !!context.dragDropOptions);
	const rowKey = useTableContext((context) => context.rowKey);
	const cardView = useTableContext((context) => context.cardView);
	const { scrollToNode, ...rest } = props;
	const rowRefs = useRef<(HTMLElement | null)[]>([]);

	useEffect(() => {
		if (scrollToNode) {
			scrollToNode((nodeIndex, options) => {
				const rowElement = rowRefs.current[nodeIndex];

				if (rowElement) {
					rowElement.scrollIntoView({ block: "center" });

					if (options?.autoFocus) {
						rowElement.focus();
					}
				}
			});
		}
	}, [scrollToNode]);

	return (
		<TableTemplate.Body key="body" {...rest} role={cardView ? "list" : rest.role}>
			{props.data.map((row, index) => {
				const key = rowKey ? getRowKey(row, rowKey) : index;

				const registerRowRef = (element: HTMLElement | null) => {
					rowRefs.current[index] = element;
				};

				return enableDragDrop
					? dndBodyRowRenderer({ key, rowIndex: index, row, wrapperRef: registerRowRef })
					: bodyRowRenderer({ key, rowIndex: index, row, wrapperRef: registerRowRef });
			})}
		</TableTemplate.Body>
	);
});

Body.displayName = "Body";
