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

import { ManagedMasterDetail } from "../../src/layout/master-detail/main/managed-master-detail/managed-master-detail.view.js";
import { ActionContentbox } from "../../src/contentbox/index.js";

interface MasterDetailComponent {
	id: string;
	label: string;
	replacedByViewId?: string;
	openedByElementId?: string;
}

const VIEWS: MasterDetailComponent[] = [
	{ id: "managed-pane_1", label: "Pane 1" },
	{ id: "managed-pane_2", label: "Pane 2" }
];

export const ManagedMasterDetailExample = ({
	resizeOptions
}: {
	resizeOptions: {
		minWidth: string | number;
		maxWidth: string | number;
	};
}) => {
	return (
		<ManagedMasterDetail
			style={{ maxHeight: 600, width: "100%" }}
			title="Managed Master Detail Layout"
			views={VIEWS.map((view, i) => {
				return {
					id: view.id,
					label: view.label,
					key: view.id,
					content: () => {
						const index = i + 1;

						return (
							<ActionContentbox padding={true} role="form" ariaLabel="Detail form" tabIndex={-1}>
								Content {index}
							</ActionContentbox>
						);
					}
				};
			})}
			columnCount={2}
			startIndex={1}
			firstViewResizableOptions={resizeOptions}
		/>
	);
};
