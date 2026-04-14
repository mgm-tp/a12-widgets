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

import type { FC, ReactNode } from "react";
import { useState } from "react";

import { Icon } from "../../src/icon/main/icon.view.js";
import { List } from "../../src/list/main/list.view.js";
import { ModalNotification } from "../../src/modal-notification/main/modal-notification.view.js";
import { PopUpMenu } from "../../src/pop-up-menu/main/pop-up-menu.view.js";
import { PopupMenuConfigContext } from "../../src/pop-up-menu/main/popup-menu-context.js";
import { ApplicationFrame } from "../../src/layout/application-frame/main/application-frame.view.js";

export const ExamplePopUpMenu: FC<{ enableA11YMobileDesign: boolean; focusOnTriggerElementAfterClose?: boolean }> = ({
	enableA11YMobileDesign,
	focusOnTriggerElementAfterClose = true
}): ReactNode => {
	const [isOpenModal, setOpenModal] = useState(false);

	return (
		<PopupMenuConfigContext.Provider value={{ enableA11YMobileDesign: enableA11YMobileDesign }}>
			<PopUpMenu
				icon={<Icon>arrow_drop_up</Icon>}
				headerTitle="title test"
				focusOnTriggerElementAfterClose={focusOnTriggerElementAfterClose}
			>
				<List data-testid="list-test">
					<List.Item text="List item 1" onClick={() => setOpenModal(true)} dataRole="first-item" />
					<List.Item text="List item 2" dataRole="second-item" />
					<List.Item text="List item 3" />
				</List>
			</PopUpMenu>

			{isOpenModal && (
				<ModalNotification title="Modal notification" onClose={() => setOpenModal(false)} enableCloseButton>
					<p>The A12 widget library is part of the A12 Business Application Platform.</p>
				</ModalNotification>
			)}
		</PopupMenuConfigContext.Provider>
	);
};

export const ExamplePopUpMenuWithApplicationFrame = (): ReactNode => {
	const properties = {
		id: "test-id",
		className: "test-class",
		style: { color: "red" },
		main: <div>main</div>,
		content: <ExamplePopUpMenu enableA11YMobileDesign={true} />
	};

	return (
		<ApplicationFrame
			main={{ content: properties.main, style: properties.style }}
			content={{ content: properties.content, style: properties.style }}
		/>
	);
};
