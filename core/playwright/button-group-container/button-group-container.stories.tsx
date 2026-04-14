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

import { Button } from "../../src/button/main/button.view.js";
import type { ButtonGroupContainerProps } from "../../src/layout/button-group-container/main/button-group-container.api.js";
import { ButtonGroupContainer } from "../../src/layout/button-group-container/main/button-group-container.view.js";
import { Icon } from "../../src/icon/main/icon.view.js";

const leftSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{
		label: "Hidden label",
		primary: true,
		icon: <Icon>cloud</Icon>,
		id: "left-1",
		labelHidden: true,
		title: "Left 1"
	},
	{
		mainAction: <Button label="Left 2" primary id="left-2-main-action" />,
		actionItems: [
			{
				id: "left-2.1",
				text: "Left 2.1"
			},
			{
				id: "left-2.2",
				text: "Left 2.2"
			}
		],
		id: "left-2",
		primary: true
	},
	{ label: "Left 3", primary: true, disabled: true, id: "left-3" }
];

const rightSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{
		label: "Right 1",
		primary: true,
		destructive: true,
		icon: <Icon>delete</Icon>,
		id: "right-1"
	},
	{
		mainAction: <Button label="Right 2" primary destructive id="right-2-main-action" />,
		actionItems: [
			{
				id: "right-2.1",
				text: "Right 2.1"
			},
			{
				id: "right-2.2",
				text: "Right 2.2"
			}
		],
		id: "right-2",
		primary: true,
		destructive: true
	}
];

export const ExampleButtonGroupContainer = () => (
	<ButtonGroupContainer
		responsive
		leftSlotButtons={leftSlotButtons}
		rightSlotButtons={rightSlotButtons}
		popupMenuHeaderTitle="Menu"
	/>
);

export const RtlButtonGroupContainer = () => (
	<ButtonGroupContainer
		responsive
		leftSlotButtons={leftSlotButtons}
		rightSlotButtons={rightSlotButtons}
		popupMenuHeaderTitle="Menu"
		collapsingDirection="right-to-left"
	/>
);
