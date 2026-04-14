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

import { Select, joinClassNames } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const outlineUtilClasses: Record<string, string[]> = {
	color: [
		"-u-outline-black",
		"-u-outline-white",
		"-u-outline-transparent",
		"-u-outline-blue",
		"-u-outline-blue-dark",
		"-u-outline-blue-light",
		"-u-outline-green",
		"-u-outline-green-dark",
		"-u-outline-green-light",
		"-u-outline-grey",
		"-u-outline-grey-dark",
		"-u-outline-grey-light",
		"-u-outline-orange",
		"-u-outline-orange-dark",
		"-u-outline-orange-light",
		"-u-outline-purple",
		"-u-outline-purple-dark",
		"-u-outline-purple-light",
		"-u-outline-red",
		"-u-outline-red-dark",
		"-u-outline-red-light",
		"-u-outline-yellow",
		"-u-outline-yellow-dark",
		"-u-outline-yellow-light"
	],
	offset: ["-u-outline-offset-2", "-u-outline-offset-4", "-u-outline-offset-8"],
	style: [
		"-u-outline-solid",
		"-u-outline-dashed",
		"-u-outline-dotted",
		"-u-outline-none",
		"-u-outline-groove",
		"-u-outline-ridge",
		"-u-outline-inset",
		"-u-outline-outset"
	],
	width: ["-u-outline-2", "-u-outline-4", "-u-outline-8"]
};

const types = Object.keys(outlineUtilClasses);
export function OutlineUtilClassShowcase(): ReactElement {
	const [selectedType, setSelectedType] = useState(types[0]);
	const [selectedClass, setSelectedClass] = useState(outlineUtilClasses[selectedType][0]);

	const handleTypeChange = useCallback((value: string) => {
		setSelectedType(value);
		setSelectedClass(outlineUtilClasses[value][0]);
	}, []);

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col">
					<Select
						className="-u-margin-b-base"
						label="Choose the outline's styling aspect:"
						fitToParent={false}
						onValueChanged={handleTypeChange}
						value={selectedType}
						items={types.map((item) => ({ label: item, value: item })) || []}
					/>
					<Select
						label="Choose the utility class to apply:"
						fitToParent={false}
						onValueChanged={setSelectedClass}
						value={selectedClass}
						items={outlineUtilClasses[selectedType].map((item) => ({ label: item, value: item })) || []}
					/>
				</div>
			}
		>
			<div
				className={joinClassNames("-u-outline-solid -u-margin-b-sm", {
					[`${selectedClass}`]: selectedClass !== "-u-outline-solid"
				})}
				style={{ width: 150, height: 150, border: "dashed #a9b3bc" }}
			/>
		</ConfigurationView>
	);
}
