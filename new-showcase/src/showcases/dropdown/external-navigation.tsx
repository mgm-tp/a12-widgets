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
import { useState } from "react";
import { styled, css } from "styled-components";

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { DropDown, TextField, useDropdownNavigation } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const StyledCombobox = styled.div(
	({ theme }) => css`
		display: flex;
		flex-direction: column;
		gap: ${theme.spacing.spacing.spacingXs}px;
		min-width: 260px;
	`
);

const items: DropDownItem[] = [
	{ id: "berlin", label: "Berlin" },
	{ id: "hamburg", label: "Hamburg" },
	{ id: "munich", label: "Munich" },
	{ id: "cologne", label: "Cologne", disabled: true },
	{ id: "leipzig", label: "Leipzig" }
];

export function ExternalNavigationShowcase(): ReactElement {
	const [value, setValue] = useState<string>("");
	// Holds the active option — the one the arrow keys move and `aria-activedescendant` points at —
	// so the field below keeps the focus and needs no reference to the rendered list.
	const navigation = useDropdownNavigation({ items });

	return (
		<ConfigurationView
			reportLabel="Active option"
			configuration={<span>Active option: {navigation.activeItem?.label ?? "none"}</span>}
			useDarkBackground
		>
			<StyledCombobox>
				<TextField
					id="external-navigation-field"
					label="City"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={navigation.handleKeyDown}
					inputProps={{
						role: "combobox",
						"aria-expanded": true,
						"aria-controls": "external-navigation-list",
						"aria-activedescendant": navigation.activeItem?.id
					}}
				/>
				<DropDown
					id="external-navigation-list"
					items={items}
					navigation={navigation}
					onSelectedItemChange={(item) => {
						setValue(item?.label ?? "");
						navigation.reset();
					}}
				/>
			</StyledCombobox>
		</ConfigurationView>
	);
}
