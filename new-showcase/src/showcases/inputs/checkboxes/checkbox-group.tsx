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

import { CheckboxGroup, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

export function DefaultCheckboxGroupShowcase(): ReactElement {
	const [selectedStates, setSelectedStates] = useState<boolean[]>([false, false, false]);

	const handleValueChanged = useCallback(
		(value: string): void => {
			const selectedValue = Number(value);
			const newSelectedStates = selectedStates.map((item, index) => {
				return selectedValue === index + 1 ? !item : item;
			});
			setSelectedStates(newSelectedStates);
		},
		[selectedStates]
	);

	return (
		<div className="-u-flex -u-items-center -u-flex-wrap -u-width-full" style={{ gap: 16 }}>
			<CheckboxGroup label="Checkbox Group" id="checkbox-group-default" onValueChanged={handleValueChanged}>
				<CheckboxGroup.Item label="Option 1" value="1" selected={!!selectedStates[0]} />
				<CheckboxGroup.Item label="Option 2" value="2" selected={!!selectedStates[1]} />
				<CheckboxGroup.Item label="Option 3" value="3" selected={!!selectedStates[2]} />
			</CheckboxGroup>
			<CheckboxGroup
				label="Checkbox Group with label graphic"
				labelGraphic={<Icon>info</Icon>}
				id="checkbox-group-with-label-graphic"
				onValueChanged={handleValueChanged}
			>
				<CheckboxGroup.Item label="Option 1" value="1" selected={!!selectedStates[0]} />
				<CheckboxGroup.Item label="Option 2" value="2" selected={!!selectedStates[1]} />
				<CheckboxGroup.Item label="Option 3" value="3" selected={!!selectedStates[2]} />
			</CheckboxGroup>
			<CheckboxGroup
				inline
				label="Inline Checkbox Group"
				id="checkbox-group-inline"
				onValueChanged={handleValueChanged}
			>
				<CheckboxGroup.Item label="Option 1" value="1" selected={!!selectedStates[0]} />
				<CheckboxGroup.Item label="Option 2" value="2" selected={!!selectedStates[1]} />
				<CheckboxGroup.Item label="Option 3" value="3" selected={!!selectedStates[2]} />
			</CheckboxGroup>
		</div>
	);
}
