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

import { HeaderTrigger, Icon, List, PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core";

const data = [
	{
		name: "English",
		value: "EN"
	},
	{
		name: "Deutsch",
		value: "DE"
	},
	{
		name: "Français",
		value: "FR"
	}
];

export function Multilingual(): ReactElement {
	const [isPopupMenuActive, setPopupMenuActive] = useState(false);
	const [lang, setLang] = useState<{ value: string; name: string }>(data[0]);

	const onLanguageChange = (item: { value: string; name: string }): void => {
		setLang(item);
	};

	return (
		<PopUpMenu
			headerTitle="Language"
			triggerElement={
				<HeaderTrigger
					active={isPopupMenuActive}
					graphic="public"
					text={lang.value}
					meta="arrow_drop_down"
					textTitle={lang.name}
					onClick={(e) => e.stopPropagation()}
					multilingual
					light
				/>
			}
			triggerButtonTitle="Open language menu"
			triggerButtonCloseTitle="Close language menu"
			onVisibilityChange={setPopupMenuActive}
		>
			<List>
				{data.map((item) => (
					<List.Item
						key={item.value}
						text={`${item.name} (${item.value})`}
						meta={item.value === lang.value && <Icon>check</Icon>}
						selected={item.value === lang.value}
						onClick={() => onLanguageChange(item)}
					/>
				))}
			</List>
		</PopUpMenu>
	);
}
