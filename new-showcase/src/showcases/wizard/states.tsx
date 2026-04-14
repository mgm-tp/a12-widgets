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

import { Icon, Wizard } from "@com.mgmtp.a12.widgets/widgets-core";

export function StatesShowcase(): ReactElement {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const handleNext = useCallback(() => setSelectedIndex((prevSelectedIndex) => prevSelectedIndex + 1), []);
	const handlePrevious = useCallback(() => setSelectedIndex((prevSelectedIndex) => prevSelectedIndex - 1), []);

	return (
		<div className="-u-width-full">
			<p>Non-interactive</p>
			<Wizard responsive truncate id="non-interactive-states">
				<Wizard.PreviousStepButton disabled={selectedIndex === 0} onClick={handlePrevious} />
				<Wizard.Step
					label="Preconditions"
					title="Preconditions"
					nonInteractive
					icon={<Icon>description</Icon>}
					selected={selectedIndex === 0}
				/>
				<Wizard.Step
					label="Master Conditions"
					title="Master Conditions"
					finished
					nonInteractive
					selected={selectedIndex === 1}
				/>
				<Wizard.Step label="Intl. Cover" title="Intl. Cover" warning nonInteractive selected={selectedIndex === 2} />
				<Wizard.Step label="Partner" title="Partner" error nonInteractive selected={selectedIndex === 3} />
				<Wizard.NextStepButton disabled={selectedIndex === 3} onClick={handleNext} />
			</Wizard>

			<br />

			<p>Disabled</p>
			<Wizard responsive truncate id="disabled-states">
				<Wizard.PreviousStepButton disabled />
				<Wizard.Step label="Preconditions" title="Preconditions" disabled />
				<Wizard.Step label="Master Conditions" title="Master Conditions" finished disabled />
				<Wizard.Step label="Intl. Cover" title="Intl. Cover" warning disabled />
				<Wizard.Step label="Partner" title="Partner" error disabled />
				<Wizard.NextStepButton disabled />
			</Wizard>
		</div>
	);
}
