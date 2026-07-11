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

import type { ChangeEvent, ReactElement } from "react";
import { useState, useCallback } from "react";

import { TextField } from "@com.mgmtp.a12.widgets/widgets-core";

export function States(): ReactElement {
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setInputValue(event.target.value);
	}, []);

	return (
		<div className="-u-width-full">
			<TextField id="text-field-info" value={inputValue} onChange={handleInputChange} label="Info state" info />
			<br />
			<TextField
				id="text-field-warning"
				value={inputValue}
				onChange={handleInputChange}
				label="Warning state"
				warning
			/>
			<br />
			<TextField id="text-field-error" value={inputValue} onChange={handleInputChange} label="Error state" error />
			<br />
			<br />
			<TextField
				id="text-field-info-message"
				value={inputValue}
				onChange={handleInputChange}
				label="Info Message"
				infoMessage="This is an info message"
			/>
			<br />
			<TextField
				id="text-field-warning-message"
				value={inputValue}
				onChange={handleInputChange}
				label="Warning Message"
				warningMessage="This is a warning message"
			/>
			<br />
			<TextField
				id="text-field-error-message"
				value={inputValue}
				onChange={handleInputChange}
				label="Error Message"
				errorMessage="This is an error message"
			/>
			<br />
			<br />
			<TextField id="text-field-readonly-value" value="example" label="Readonly with value" readonly />
			<br />
			<TextField id="text-field-disabled-value" value="example" label="Disabled with value" disabled />
		</div>
	);
}
