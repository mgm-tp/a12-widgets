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

import type { ReactElement } from "react";

import { DataTreeTable } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { FileNode } from "./shared.js";
import { COLUMNS, FILE_TREE, fileIcon } from "./shared.js";

/**
 * The simplest `DataTreeTable`: pass a nested `tree`, tell it how to read children via `getChildren`,
 * and give it a stable `rowKey`. The wrapper flattens the hierarchy, owns expand/collapse, and decorates
 * the first column with an indent + chevron. A per-row leading icon is supplied with `getIcon`. Expansion
 * is uncontrolled here, seeded with `defaultExpandedKeys`.
 */
export function BasicDataTreeTable(): ReactElement {
	return (
		<DataTreeTable<FileNode>
			ariaLabel="Files"
			tree={FILE_TREE}
			getChildren={(row) => row.children}
			getIcon={fileIcon}
			columns={COLUMNS}
			rowKey="id"
			maxHeight={360}
			defaultExpandedKeys={["src"]}
		/>
	);
}
