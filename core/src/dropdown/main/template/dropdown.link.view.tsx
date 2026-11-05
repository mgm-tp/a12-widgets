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

import type { MouseEvent, ReactElement, ReactNode } from "react";
import { useCallback, useContext, useRef } from "react";

import { DataRoles } from "../../../common/main/data-roles.js";

import { DropdownContext } from "./dropdown.context.js";
import { StyledDropdownLink } from "./dropdown.tpl.styled.js";

export function DropdownLinkItem(props: { children: ReactNode; preselected?: boolean; id?: string }): ReactElement {
	const dropdownContextValue = useContext(DropdownContext);
	const linkItemWrapperRef = useRef<HTMLDivElement | null>(null);

	const getLinkItemWrapperRef = useCallback((ref: HTMLDivElement | null) => {
		if (ref) {
			linkItemWrapperRef.current = ref;
		}
	}, []);

	const handleClick = useCallback((event: MouseEvent) => {
		if (
			linkItemWrapperRef.current?.firstChild &&
			!linkItemWrapperRef.current?.firstChild.contains(event.target as HTMLElement)
		) {
			const firstChild = linkItemWrapperRef.current?.firstChild as HTMLElement;
			firstChild.click();
		}
	}, []);

	return (
		// oxlint-disable-next-line jsx-a11y/interactive-supports-focus -- custom component; options are navigated via the listbox, not tab focus
		<StyledDropdownLink
			id={props.id}
			onClick={handleClick}
			ref={getLinkItemWrapperRef}
			role="option"
			aria-selected={props.preselected}
			data-role={DataRoles.Dropdown.LinkItemWrapper}
			$preselected={props.preselected}
			$touch={dropdownContextValue.touch}
		>
			{props.children}
		</StyledDropdownLink>
	);
}

DropdownLinkItem.displayName = "DropdownLinkItem";
