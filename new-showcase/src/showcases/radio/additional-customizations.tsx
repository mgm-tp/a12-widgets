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

import { ErrorTooltip, WarningTooltip, HintTooltip, Radio } from "@com.mgmtp.a12.widgets/widgets-core";

export const AdditionalCustomizationsRadio: FC = () => {
	const [selectedValue, setSelectedValue] = useState<string | undefined>("2");

	const handleValueChanged = (value: string): void => {
		setSelectedValue(value);
	};

	return (
		<div className="-u-width-full">
			<Radio
				label="Tooltips"
				tooltips={
					<>
						<ErrorTooltip text="An error" key="error" id="error-tooltip" />
						<WarningTooltip text="A warning" key="warning" id="warning-tooltip" />
						<HintTooltip text="A hint" key="hint" id="hint-tooltip" />
					</>
				}
				ariaDescribedby="error-tooltip warning-tooltip hint-tooltip"
				value={selectedValue}
				onValueChanged={setSelectedValue}
				id="radio-with-tooltips"
			>
				<Radio.Item label="Option 1" value="1" />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
			<br />
			<Radio
				label="Group wrapper HTML props with Helper Text"
				value={selectedValue}
				onValueChanged={handleValueChanged}
				name="a11y"
				id="radio-dom-props-helper-text"
				groupDOMProps={{ ["aria-required"]: true }}
				helperText={
					<>
						You can use the{" "}
						<strong>
							<em>groupDOMProps</em>
						</strong>{" "}
						property to pass HTML properties into the Radio group wrapper. For example:{" "}
						<strong>
							<em>aria-required=true</em>
						</strong>
						.
					</>
				}
			>
				<Radio.Item label="Option 1" value="1" />
				<Radio.Item label="Option 2" value="2" />
				<Radio.Item label="Option 3" value="3" />
			</Radio>
		</div>
	);
};
