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

import type { FC } from "react";
import { useState } from "react";

import { Checkbox, ErrorTooltip, HintTooltip, WarningTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

export const CheckboxStatesShowcase: FC = () => {
	const [checked, setChecked] = useState(false);

	const handleChange = (checked: boolean): void => {
		setChecked(checked);
	};

	return (
		<div className="-u-width-full">
			<Checkbox label="Info state" checked={checked} onChange={handleChange} info />
			<Checkbox label="Warning state" checked={checked} onChange={handleChange} warning />
			<Checkbox label="Error state" checked={checked} onChange={handleChange} error />
			<p>
				<strong>With message:</strong>
			</p>
			<Checkbox
				label="Info state with message"
				checked={checked}
				onChange={handleChange}
				infoMessage="This is an info message"
			/>
			<br />
			<Checkbox
				label="Warning state with message"
				checked={checked}
				onChange={handleChange}
				warningMessage="This is a warning message"
			/>
			<br />
			<Checkbox
				label="Error state with message"
				checked={checked}
				onChange={handleChange}
				errorMessage="This is an error message"
			/>
			<br />

			<p>
				<strong>With tooltips (recommended when showing state's messages in a limited space):</strong>
			</p>
			<Checkbox
				label="Info state with tooltip"
				checked={checked}
				onChange={handleChange}
				info
				tooltips={[<HintTooltip text="An info" key="info" id="checkbox-tooltip-1" />]}
				ariaDescribedby="checkbox-tooltip-1"
			/>
			<Checkbox
				label="Warning state with tooltip"
				checked={checked}
				onChange={handleChange}
				warning
				tooltips={[<WarningTooltip text="A warning" key="warning" id="checkbox-tooltip-2" />]}
				ariaDescribedby="checkbox-tooltip-2"
			/>
			<Checkbox
				label="Error state with tooltip"
				checked={checked}
				onChange={handleChange}
				error
				tooltips={[<ErrorTooltip text="An error" key="error" id="checkbox-tooltip-3" />]}
				ariaDescribedby="checkbox-tooltip-3"
			/>
			<p>
				<strong>Readonly:</strong>
			</p>
			<Checkbox label="Readonly state" checked={false} onChange={(): void => {}} readonly />
			<Checkbox label="Readonly state (checked)" checked={true} onChange={(): void => {}} readonly />
			<p>
				<strong>Disabled:</strong>
			</p>
			<Checkbox label="Disabled state" checked={false} onChange={(): void => {}} disabled />
			<Checkbox label="Disabled state (checked)" checked={true} onChange={(): void => {}} disabled />
		</div>
	);
};
