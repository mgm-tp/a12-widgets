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

import { Checkbox, CheckboxGroup } from "@com.mgmtp.a12.widgets/widgets-core";

const plainOptions = ["Apple", "Pear"];
const defaultCheckedList = ["Apple"];

export const CheckboxWithA11yShowcase: FC = () => {
	const [checkedList, setCheckedList] = useState(defaultCheckedList);
	const [checkAll, setCheckAll] = useState<"mixed" | boolean>("mixed");

	const handleChange = (value: string): void => {
		const newCheckedList =
			checkedList.indexOf(value) !== -1 ? checkedList.filter((c) => c !== value) : [...checkedList, value];

		const indeterminate = newCheckedList.length > 0 && newCheckedList.length < plainOptions.length;
		const checkedAll = newCheckedList.length === plainOptions.length;
		setCheckedList(newCheckedList);
		setCheckAll(indeterminate ? "mixed" : checkedAll);
	};

	const handleCheckAllChange = (checked: boolean): void => {
		const newCheckedList = checked ? plainOptions : [];
		setCheckedList(newCheckedList);
		setCheckAll(checked);
	};

	const controlledCheckboxIds = plainOptions.join(" ").trim();

	return (
		<div className="-u-width-full">
			<Checkbox.Indeterminate
				checked={checkAll}
				label="De/Select all"
				title="De/Select all"
				onChange={handleCheckAllChange}
				ariaControls={controlledCheckboxIds}
				hideLabel
			/>
			<CheckboxGroup onValueChanged={handleChange}>
				{plainOptions.map((value) => (
					<CheckboxGroup.Item
						key={value}
						id={`a11y-${value}`}
						label={value}
						title={value}
						value={value}
						selected={checkedList.indexOf(value) !== -1}
						hideLabel
					/>
				))}
			</CheckboxGroup>
		</div>
	);
};
