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
import { loremIpsum } from "lorem-ipsum";

import { Select } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const textUtilClasses: Record<string, string[]> = {
	align: ["-u-text-left", "-u-text-center", "-u-text-right", "-u-text-justify"],
	color: [
		"-u-text-black",
		"-u-text-white",
		"-u-text-transparent",
		"-u-text-blue",
		"-u-text-blue-dark",
		"-u-text-blue-light",
		"-u-text-green",
		"-u-text-green-dark",
		"-u-text-green-light",
		"-u-text-grey",
		"-u-text-grey-dark",
		"-u-text-grey-light",
		"-u-text-orange",
		"-u-text-orange-dark",
		"-u-text-orange-light",
		"-u-text-purple",
		"-u-text-purple-dark",
		"-u-text-purple-light",
		"-u-text-red",
		"-u-text-red-dark",
		"-u-text-red-light",
		"-u-text-yellow",
		"-u-text-yellow-dark",
		"-u-text-yellow-light"
	],
	style: [
		"-u-italic",
		"-u-roman",
		"-u-uppercase",
		"-u-lowercase",
		"-u-capitalcase",
		"-u-normal-case",
		"-u-underline",
		"-u-line-through",
		"-u-no-underline",
		"-u-antialiased",
		"-u-subpixel-antialiased"
	]
};

const types = Object.keys(textUtilClasses);
const dummyText = loremIpsum({ count: 10, units: "sentences" });
export function TextUtilClassShowcase(): ReactElement {
	const [selectedType, setSelectedType] = useState(types[0]);
	const [selectedClass, setSelectedClass] = useState(textUtilClasses[selectedType][0]);

	const handleTypeChange = useCallback((value: string) => {
		setSelectedType(value);
		setSelectedClass(textUtilClasses[value][0]);
	}, []);

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col">
					<Select
						className="-u-margin-b-base"
						label="Choose the text's styling aspect:"
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
						items={textUtilClasses[selectedType].map((item) => ({ label: item, value: item })) || []}
					/>
				</div>
			}
		>
			<div
				className={`-u-width-full ${selectedClass} ${
					!selectedClass.includes("white") && !selectedClass.includes("transparent") && "-u-background-white"
				} -u-padding-base`}
			>
				{dummyText}
			</div>
		</ConfigurationView>
	);
}
