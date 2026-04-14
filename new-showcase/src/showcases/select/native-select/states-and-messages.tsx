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

import { BulletList, Select } from "@com.mgmtp.a12.widgets/widgets-core";

import { items, itemsWithEmpty } from "../data.js";

const warningMessages = (
	<BulletList.Unordered>
		<BulletList.Item>Warning 1</BulletList.Item>
		<BulletList.Item>Warning 2</BulletList.Item>
		<BulletList.Item>Warning 3</BulletList.Item>
	</BulletList.Unordered>
);

export const StatesAndMessagesSelect: FC = () => {
	const [selectedItem, setSelectedItem] = useState<undefined | string>(undefined);
	const [emptyValueItem, setEmptyValueItem] = useState<string>("Empty");

	return (
		<div className="-u-width-full">
			<Select id="select-info" label="Info" value={selectedItem} onValueChanged={setSelectedItem} info items={items} />
			<br />
			<Select
				id="select-warning"
				label="Warning"
				value={selectedItem}
				onValueChanged={setSelectedItem}
				warning
				items={items}
			/>
			<br />
			<Select
				id="select-error"
				label="Error"
				value={selectedItem}
				onValueChanged={setSelectedItem}
				error
				items={items}
			/>
			<br />
			<Select
				id="select-info-message"
				label="Info message"
				value={selectedItem}
				onValueChanged={setSelectedItem}
				infoMessage="Info message"
				items={items}
			/>
			<br />
			<Select
				id="select-warning-message"
				label="Warning messages"
				value={selectedItem}
				onValueChanged={setSelectedItem}
				warningMessage={warningMessages}
				items={items}
			/>
			<br />
			<Select
				id="select-error-message"
				label="Error message"
				onValueChanged={setSelectedItem}
				value={selectedItem}
				errorMessage="Error message"
				items={items}
			/>
			<br />
			<Select
				id="select-with-empty-value"
				label="Select with Empty Value Item"
				items={itemsWithEmpty}
				value={emptyValueItem}
				onValueChanged={setEmptyValueItem}
			/>
			<br />
			<Select id="select-disable" label="Disabled Select" items={items} disabled />
			<br />
			<Select id="select-readonly" label="Readonly Select" items={items} readonly />
		</div>
	);
};
