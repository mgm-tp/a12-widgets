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

import { Icon, Switch, noop } from "@com.mgmtp.a12.widgets/widgets-core";

export function BasicSwitch(): ReactElement {
	const [checked, setChecked] = useState(false);

	return (
		<div className="-u-flex -u-flex-col" style={{ gap: "16px" }}>
			<Switch
				id="basic-switch"
				label="Switch with a graphic label"
				labelGraphic={<Icon>info</Icon>}
				checked={checked}
				onChange={setChecked}
			/>
			<Switch
				id="option-text-switch"
				label="Switch with visible options"
				checkedOption="Yes"
				uncheckedOption="No"
				checked={checked}
				onChange={setChecked}
			/>
			<Switch
				id="only-checked-option"
				label="Switch with only checked option"
				checkedOption="Yes"
				checked
				onChange={noop}
			/>
			<Switch
				id="only-unchecked-option"
				label="Switch with only unchecked option"
				uncheckedOption="No"
				checked={false}
				onChange={noop}
			/>
			<Switch
				id="hidden-options-switch"
				label="Switch with hidden options and helper text"
				helperText="I am a helper text that can be added via the helperText property."
				checkedOption="Yes"
				uncheckedOption="No"
				hideOptions
				checked={checked}
				onChange={setChecked}
			/>
		</div>
	);
}
