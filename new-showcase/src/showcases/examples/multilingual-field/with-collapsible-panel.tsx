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

import type { MouseEvent, KeyboardEvent, ReactElement } from "react";
import { useState } from "react";
import { Key } from "ts-key-enum";

import { CollapsiblePanel, PopUpMenu, List, Icon, HeaderTrigger } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Language } from "./data.js";
import { data, translatedTexts } from "./data.js";

export function WithCollapsiblePanel(): ReactElement {
	const [language, setLanguage] = useState<Language>(data[0]);
	const [isPopupMenuActive, setIsPopupMenuActive] = useState<boolean>(false);
	const [isOpenCollapsiblePanel, setIsOpenCollapsiblePanel] = useState<boolean>(true);

	function onCollapsiblePanelClick(): void {
		if (!isPopupMenuActive) {
			setIsOpenCollapsiblePanel(!isOpenCollapsiblePanel);
		}
	}

	function handleTriggerClick(event: MouseEvent): void {
		event.stopPropagation();
		event.preventDefault();
	}

	function handleTriggerKeyUp(event: KeyboardEvent): void {
		if (event.key === Key.Enter) {
			event.stopPropagation();
		}
	}

	return (
		<CollapsiblePanel
			className="-u-width-full"
			title={<span>{translatedTexts[language.value].title}</span>}
			addons={
				<PopUpMenu
					key="right"
					headerTitle="Language"
					triggerElement={
						<HeaderTrigger
							active={isPopupMenuActive}
							onClick={handleTriggerClick}
							onKeyUp={handleTriggerKeyUp}
							graphic="public"
							text={language.name}
							meta="arrow_drop_down"
							multilingual
						/>
					}
					onVisibilityChange={setIsPopupMenuActive}
				>
					<List>
						{data.map((item) => (
							<List.Item
								key={item.value}
								text={`${item.name} (${item.value})`}
								meta={item.value === language.value && <Icon>check</Icon>}
								selected={item.value === language.value}
								onClick={(): void => setLanguage(item)}
							/>
						))}
					</List>
				</PopUpMenu>
			}
			onClick={onCollapsiblePanelClick}
		>
			{isOpenCollapsiblePanel && <p>{translatedTexts[language.value].content}</p>}
		</CollapsiblePanel>
	);
}
