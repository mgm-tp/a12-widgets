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

import type { CSSProperties, ReactElement, RefCallback } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";
import { joinClassNames } from "../../../common/main/utils.js";

import { baseClassName } from "./dropdown.class-names.js";
import type { DropDownItem as DropdownItemProps } from "./dropdown.tpl.api.js";
import { StyledDropdownSecondaryText, StyledDropdownSection, StyledDropdownText } from "./dropdown.tpl.styled.js";

export function DropDownSectionItem(props: {
	item: DropdownItemProps;
	id: string;

	/** Absolute positioning applied while the list is windowed. */
	virtualStyle?: CSSProperties;

	/** Hands the header to the virtualizer for measurement while the list is windowed. */
	measureElement?: RefCallback<HTMLElement>;
}): ReactElement<DropdownItemProps> {
	const sectionClassName = joinClassNames(`${baseClassName}__section`, props.item.className);

	return (
		<StyledDropdownSection
			className={sectionClassName}
			id={props.item.id ?? props.id}
			style={props.virtualStyle ? { ...props.item.style, ...props.virtualStyle } : props.item.style}
			ref={props.measureElement}
			data-role={DataRoles.Dropdown.SectionItem}
		>
			<StyledDropdownText className={`${baseClassName}__text`}>{props.item.label}</StyledDropdownText>
			{props.item.secondaryText && (
				<StyledDropdownSecondaryText className={`${baseClassName}__section-secondaryText`}>
					{props.item.secondaryText}
				</StyledDropdownSecondaryText>
			)}
		</StyledDropdownSection>
	);
}

DropDownSectionItem.displayName = "DropdownSectionItem";
