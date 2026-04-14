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

import { Icon, Toggle } from "@com.mgmtp.a12.widgets/widgets-core";

export function SimpleToggleButtonShowcase(): ReactElement {
	const [toggle1, setToggle1] = useState("hidden");
	const [toggle2, setToggle2] = useState("hidden");
	const [toggle3, setToggle3] = useState("visible");
	const [toggle4, setToggle4] = useState("initially selected");

	return (
		<div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption label="Basic" value={toggle1} onValueChanged={setToggle1}>
					<Toggle.Item value="hidden" title="Hidden">
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially expanded" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption label="Disabled" value={toggle1} onValueChanged={setToggle1} disabled>
					<Toggle.Item value="hidden" title="Hidden">
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially expanded" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption label="Readonly" value={toggle1} onValueChanged={setToggle1} readOnly>
					<Toggle.Item value="hidden" title="Hidden">
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially expanded" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption label="Selected Option Is Disabled" value={toggle1} onValueChanged={setToggle1}>
					<Toggle.Item value="hidden" title="Hidden" disabled>
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially expanded" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption label="Selected Option Is Readonly" value={toggle1} onValueChanged={setToggle1}>
					<Toggle.Item value="hidden" title="Hidden" readOnly>
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially expanded" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption label="With Toggle item's variants" value={toggle2} onValueChanged={setToggle2}>
					<Toggle.Item value="hidden" variant="status1" title="Hidden">
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" variant="status2" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially expanded" variant="status3" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption value={toggle3} onValueChanged={setToggle3}>
					<Toggle.Item value="hidden" variant="status1" title="Hidden">
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" variant="status2" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially expanded" variant="status3" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
			<div className="-u-margin-sm">
				<Toggle showOnlySelectedOption value={toggle4} onValueChanged={setToggle4}>
					<Toggle.Item value="hidden" variant="status1" title="Hidden">
						<Icon>close</Icon>
					</Toggle.Item>
					<Toggle.Item value="visible" variant="status2" title="Visible">
						<Icon>check</Icon>
					</Toggle.Item>
					<Toggle.Item value="initially selected" variant="status3" title="Initially Selected">
						<Icon>star</Icon>
					</Toggle.Item>
				</Toggle>
			</div>
		</div>
	);
}
