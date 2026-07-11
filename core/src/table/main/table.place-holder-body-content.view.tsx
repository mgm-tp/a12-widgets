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

import { memo } from "react";
import { styled, css, keyframes } from "styled-components";
import { rgba } from "polished";

import { DataRoles } from "../../common/main/data-roles.js";

import { BASE_TABLE_CLASSNAME } from "./table.internal.js";
import type { TableRenderPropsType } from "./table-renderer.api.js";

const slideGradient = keyframes`
	0% {
		background-position: -250px 0;
	}
	100% {
		background-position: 250px 0;
	}
`;

const StyledTablePlaceHolderBodyContent = styled.div.withConfig({
	displayName: "StyledTablePlaceHolderBodyContent-sc-"
})(({ theme }) => {
	const { bodyRow } = theme.components.table;

	return css`
		background-image: linear-gradient(
			to right,
			${rgba(bodyRow.placeholder.background, 0.8)} 20%,
			${bodyRow.placeholder.background} 50%,
			${rgba(bodyRow.placeholder.background, 0.8)} 80%
		);
		background-size: 500px 100%;
		background-clip: content-box;
		min-height: 32px;
		flex-grow: 1;
		width: 100%;
		animation-name: ${slideGradient};
		animation-fill-mode: forwards;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-duration: 0.5s;
	`;
});

/** @internal */
export const PlaceHolderBodyContent = memo(function PlaceHolderBodyContent(
	_props: TableRenderPropsType.PlaceHolderBodyContentProps
) {
	return (
		<StyledTablePlaceHolderBodyContent
			className={`${BASE_TABLE_CLASSNAME}__bodyContent--placeHolder`}
			data-role={DataRoles.Table.Body.Content.Placeholder}
		/>
	);
});

PlaceHolderBodyContent.displayName = "PlaceHolderBodyContent";
