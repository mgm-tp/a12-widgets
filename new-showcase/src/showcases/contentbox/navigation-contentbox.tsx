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
import { useState, useContext } from "react";
import { loremIpsum } from "lorem-ipsum";

import {
	ActionContentbox,
	NavigationContentboxContext,
	ContentBoxElements,
	ModalNotification
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContext } from "../../helpers/theme-selector.js";

const content = (): string => loremIpsum({ units: "sentences", count: 10 });

export function NavigationContentbox(): ReactElement {
	const [modal, setModal] = useState(false);
	const [closeModal, setCloseModal] = useState(false);
	const { theme } = useContext(ThemeContext);
	const isFlatTheme = theme.includes("flat");

	return (
		<NavigationContentboxContext.Provider
			value={{ onBackButtonClicked: () => setModal(true), onCloseButtonClicked: () => setCloseModal(true) }}
		>
			<ActionContentbox
				listenToNavigationContext
				headingElements={<ContentBoxElements.Title text="Navigation context aware ContentBox" />}
			>
				<p className={isFlatTheme ? "-u-margin-t-0" : undefined}>{content()}</p>
			</ActionContentbox>
			{(modal || closeModal) && (
				<ModalNotification
					onClose={() => {
						setModal(false);
						setCloseModal(false);
					}}
					closeOnOutsideClick
					title={`${modal ? "Back" : "Close"} button clicked`}
				/>
			)}
		</NavigationContentboxContext.Provider>
	);
}
