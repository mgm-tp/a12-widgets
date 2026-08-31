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
import { useState, useCallback } from "react";

import { Icon, PopUpMenu, List, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
// end code removal

const { Item } = List;

export function BasicShowcase(): ReactElement {
	const [active, setActive] = useState(false);

	// start code removal
	const [hasHeader, setHasHeader] = useState(true);
	// end code removal
	const onVisibilityChange = useCallback((isPopupVisible: boolean): void => {
		setActive(isPopupVisible);
	}, []);
	// start code removal
	const headerTitle = hasHeader ? "Menu" : undefined;
	// end code removal

	return (
		// start code removal
		<ConfigurationView
			configuration={
				<Checkbox
					checked={hasHeader}
					label={<span>Show the Header on Mobile</span>}
					onChange={setHasHeader}
					fitToParent={false}
				/>
			}
		>
			<CodeSnippetGenerationWrapper namespaceOptions={[{ name: "List", subComponents: ["Item"] }]}>
				<div className="-u-width-full">
					<p>List with more info</p>
					<PopUpMenu headerTitle={headerTitle}>
						<List paddedLeft>
							<Item text="Preview" graphic={<Icon>remove_red_eye</Icon>} />
							<Item text="Share" graphic={<Icon>share</Icon>} />
							<Item text="Get Link" graphic={<Icon>link</Icon>} divider />
							<Item text="Remove" graphic={<Icon>delete</Icon>} divider />
							<Item text="Legumes" />
							<Item text="Edible plants" />
							<Item text="Edible fungi" />
							<Item text="Edible nuts and seeds" divider />
							<Item text="Baked goods" />
							<Item text="Dairy products" />
							<Item text="Eggs" />
							<Item text="Meat" />
							<Item text="Cereals" />
							<Item text="Rice" />
							<Item text="Seafood" />
							<Item text="Other" />
						</List>
					</PopUpMenu>

					<p>Customized trigger Icon</p>
					<PopUpMenu
						icon={<Icon>{active ? "arrow_drop_up" : "arrow_drop_down"}</Icon>}
						onVisibilityChange={onVisibilityChange}
						headerTitle={headerTitle}
					>
						<List>
							<Item text="List item" />
							<Item text="List item" />
							<Item text="List item" />
						</List>
					</PopUpMenu>

					<p>Disabled</p>
					<PopUpMenu disabled>
						<List>
							<Item text="List item" />
							<Item text="List item" />
							<Item text="List item" />
						</List>
					</PopUpMenu>
				</div>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
