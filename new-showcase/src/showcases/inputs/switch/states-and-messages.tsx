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

import { Switch, noop } from "@com.mgmtp.a12.widgets/widgets-core";

export function StatesAndMessagesSwitch(): ReactElement {
	const [checked, setChecked] = useState(false);

	return (
		<div className="-u-flex -u-flex-col" style={{ gap: "16px" }}>
			<Switch readonly id="readonly-switch" label="Readonly" checked={checked} onChange={noop} />
			<Switch disabled id="disabled-switch" label="Disabled" checked={checked} onChange={noop} />
			<Switch
				error
				id="error-switch"
				label="Error"
				errorMessage="Error message"
				checked={checked}
				onChange={setChecked}
			/>
			<Switch
				warning
				id="warning-switch"
				label="Warning"
				warningMessage="Warning message"
				checked={checked}
				onChange={setChecked}
			/>
			<Switch info id="info-switch" label="Info" infoMessage="Info message" checked={checked} onChange={setChecked} />
		</div>
	);
}
