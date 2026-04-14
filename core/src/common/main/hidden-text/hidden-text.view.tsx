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
import { styled, css } from "styled-components";

import { addPrefix } from "../utils.js";
import { DataRoles } from "../data-roles.js";

import type { HiddenTextProps } from "./hidden-text.api.js";

export const StyledHiddenTextWrapper = styled.span.withConfig({ displayName: "StyledHiddenTextWrapper-sc-" })<{
	$showHiddenText?: boolean;
}>(
	({ $showHiddenText }) => css`
		-webkit-clip-path: inset(100%);
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(100%);
		height: 1px;
		margin: -1px !important;
		min-height: 1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		top: 0;
		width: 1px;
		& * {
			width: 1px;
			height: 1px;
		}
		${!$showHiddenText &&
		css`
			display: none;
		`}
	`
);

export function HiddenText(props: HiddenTextProps): ReactElement<HiddenTextProps> {
	const {
		text,
		wrapperRef,
		role,
		ariaLevel,
		children,
		htmlTag,
		htmlAttributes,
		showHiddenText = true,
		...rest
	} = props;

	return (
		<StyledHiddenTextWrapper
			as={htmlTag || "span"}
			className={addPrefix("-u-unseenButRead")}
			$showHiddenText={showHiddenText}
			ref={wrapperRef}
			role={role}
			aria-level={ariaLevel}
			data-role={DataRoles.HiddenText}
			{...htmlAttributes}
			{...rest}
		>
			{text}
			{children}
		</StyledHiddenTextWrapper>
	);
}

HiddenText.displayName = "HiddenText";
