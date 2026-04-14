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

import type { FC, ReactElement } from "react";

import { DataRoles } from "../../common/index.js";

import { StyledDiagramPort } from "./model-graph-diagram.styled.js";
import type { ModelDiagramPortProps } from "./model-graph-diagram.tpl.api.js";

export const DiagramPort: FC<ModelDiagramPortProps> = (
	props: ModelDiagramPortProps
): ReactElement<ModelDiagramPortProps> => {
	const { id, style, selected, portAttributes, cornerPoint, className, readOnly } = props;

	return (
		<StyledDiagramPort
			id={id}
			style={style}
			data-role={DataRoles.Diagram.Port}
			tabIndex={-1}
			className={className}
			$isSelected={selected}
			$isCornerPoint={cornerPoint}
			$readOnly={readOnly}
			{...portAttributes}
		/>
	);
};

DiagramPort.displayName = "DiagramPort";
