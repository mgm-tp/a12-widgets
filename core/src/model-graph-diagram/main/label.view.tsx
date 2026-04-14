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

import { StyledDiagramLabelSubText, StyledDiagramLabelWrapper } from "./model-graph-diagram.styled.js";
import type { ModelDiagramLabelProps } from "./model-graph-diagram.tpl.api.js";

export const DiagramLabel: FC<ModelDiagramLabelProps> = (
	props: ModelDiagramLabelProps
): ReactElement<ModelDiagramLabelProps> => {
	const { id, style, selected, type = "main", subText, text, labelAttributes, className, readOnly } = props;

	return (
		<StyledDiagramLabelWrapper
			id={id}
			style={style}
			data-role={DataRoles.Diagram.Label}
			tabIndex={readOnly ? -1 : 0}
			className={className}
			$diagramLabelType={type}
			$isSelected={selected}
			$readOnly={readOnly}
			{...labelAttributes}
		>
			{text && <div>{text}</div>}
			{subText && <StyledDiagramLabelSubText>{subText}</StyledDiagramLabelSubText>}
		</StyledDiagramLabelWrapper>
	);
};

DiagramLabel.displayName = "DiagramLabel";
