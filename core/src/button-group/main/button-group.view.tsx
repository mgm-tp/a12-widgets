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
import { useMemo } from "react";
import { styled, css } from "styled-components";

import { addPrefix } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { ButtonGroupProps } from "./button-group.api.js";

const baseClassName = addPrefix("button-group");

export const StyledButtonGroup = styled.div.withConfig({ displayName: "StyledButtonGroup-sc-" })<ButtonGroupProps>(
	({ alignment, vertical, theme }) => {
		return css`
			align-items: center;
			display: flex;
			flex-wrap: wrap;
			gap: ${theme.components.buttonGroup.gap};
			${alignment === "left" &&
			css`
				order: -1;
			`}
			${alignment === "right" &&
			css`
				order: 1;
				flex-grow: 1;
				justify-content: flex-end;
			`}
		
		${vertical &&
			css`
				align-items: stretch;
				flex-direction: column;
			`}
		`;
	}
);

/**
 * The {@link ButtonGroup} is a specialized layout container widget. It may only contain buttons.
 *
 * **Note:** Every {@link ButtonGroup} must be surrounded with a {@link Clearfix}. In case of consecutive elements,
 * they must be contained within the same {@link Clearfix} and elements with alignment "right" should be positioned
 * after groups with alignment "left" in the DOM, so that the visual order matches the DOM and hence the tab order.
 */
export function ButtonGroup(props: ButtonGroupProps): ReactElement {
	const generateClassName = useMemo(() => {
		const classNames = [baseClassName];

		if (props.alignment === "left") {
			classNames.push(`${addPrefix("h_floatLeft")} ${baseClassName}--left`);
		} else if (props.alignment === "right") {
			classNames.push(`${addPrefix("h_floatRight")} ${baseClassName}--right`);
		}

		if (props.className) {
			const additionalClassNames = props.className
				.split(" ")
				.filter((c) => c !== addPrefix("h_floatRight") && c !== addPrefix("h_floatLeft"));

			classNames.push(...additionalClassNames);
		}

		return classNames.join(" ").trim();
	}, [props.alignment, props.className]);

	return (
		<StyledButtonGroup
			className={generateClassName}
			alignment={props.alignment}
			vertical={props.vertical}
			style={props.style}
			id={props.id}
			ref={props.wrapperRef}
			data-role={DataRoles.ButtonGroup}
		>
			{props.children}
		</StyledButtonGroup>
	);
}

ButtonGroup.displayName = "ButtonGroup";
