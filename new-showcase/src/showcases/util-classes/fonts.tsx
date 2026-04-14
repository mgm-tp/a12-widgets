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

import { Select } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const fontUtilClasses: Record<string, string[]> = {
	fontWeight: [
		"-u-font-hairline",
		"-u-font-thin",
		"-u-font-light",
		"-u-font-normal",
		"-u-font-medium",
		"-u-font-semibold",
		"-u-font-bold",
		"-u-font-extrabold",
		"-u-font-black"
	],
	fontSize: [
		"-u-text-nano",
		"-u-text-xs",
		"-u-text-sm",
		"-u-text-base",
		"-u-text-lg",
		"-u-text-xl",
		"-u-text-2xl",
		"-u-text-3xl",
		"-u-text-4xl",
		"-u-text-5xl"
	]
};

const types = Object.keys(fontUtilClasses);
export function FontsUtilClassShowcase(): ReactElement {
	const [selectedType, setSelectedType] = useState(types[0]);

	return (
		<ConfigurationView
			configuration={
				<Select
					label="Choose the font's styling aspect:"
					fitToParent={false}
					onValueChanged={setSelectedType}
					value={selectedType}
					items={types.map((item) => ({ label: item, value: item })) || []}
				/>
			}
		>
			<div>
				{fontUtilClasses[selectedType].map((selectedClass, index) => (
					<p className={selectedClass} key={index}>
						{selectedClass}
					</p>
				))}
			</div>
		</ConfigurationView>
	);
}
