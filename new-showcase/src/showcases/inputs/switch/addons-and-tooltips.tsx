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

import { Switch, ErrorTooltip, HintTooltip, WarningTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

const hint = (id: number) => <HintTooltip text="This is a hint" key="hint" id={`hint-${id}`} />;
const warning = (id: number) => <WarningTooltip text="This is a warning" key="warning" id={`warning-${id}`} />;
const error = (id: number) => <ErrorTooltip text="This is a error" key="error" id={`error-${id}`} />;

export function AddonsAndTooltipsSwitch(): ReactElement {
	const [checked, setChecked] = useState(true);

	return (
		<div className="-u-flex -u-flex-col" style={{ gap: "16px" }}>
			<Switch
				id="single-addon-switch"
				label="Single add-on"
				checked={checked}
				onChange={setChecked}
				addonAfter={hint(0)}
				ariaDescribedby="hint-0"
			/>
			<Switch
				id="multiple-addon-switch"
				label="Multiple add-ons"
				fitToParent={false}
				checked={checked}
				onChange={setChecked}
				addonAfter={[hint(1), warning(1), error(1)]}
				ariaDescribedby="hint-1 warning-1 error-1"
			/>
			<Switch
				id="single-tooltip-switch"
				label="Single tooltip"
				checked={checked}
				onChange={setChecked}
				tooltips={hint(2)}
				ariaDescribedby="hint-2"
			/>
			<Switch
				id="multiple-tooltip-switch"
				label="Multiple tooltips"
				checked={checked}
				onChange={setChecked}
				tooltips={[hint(3), warning(3), error(3)]}
				ariaDescribedby="hint-3 warning-3 error-3"
			/>
			<Switch
				id="visible-options-tooltip-addon-switch"
				label="Swith with visible options, tooltip, and add-on"
				checkedOption="Yes"
				uncheckedOption="No"
				checked={checked}
				onChange={setChecked}
				tooltips={hint(4)}
				addonAfter={warning(4)}
				ariaDescribedby="hint-4"
			/>
		</div>
	);
}
