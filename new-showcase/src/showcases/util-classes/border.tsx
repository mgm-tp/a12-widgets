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

const borderUtilClasses: Record<string, string[]> = {
	style: ["-u-border-solid", "-u-border-dashed", "-u-border-dotted", "-u-border-none"],
	color: [
		"-u-border-black",
		"-u-border-white",
		"-u-border-transparent",
		"-u-border-blue",
		"-u-border-blue-dark",
		"-u-border-blue-light",
		"-u-border-green",
		"-u-border-green-dark",
		"-u-border-green-light",
		"-u-border-grey",
		"-u-border-grey-dark",
		"-u-border-grey-light",
		"-u-border-orange",
		"-u-border-orange-dark",
		"-u-border-orange-light",
		"-u-border-purple",
		"-u-border-purple-dark",
		"-u-border-purple-light",
		"-u-border-red",
		"-u-border-red-dark",
		"-u-border-red-light",
		"-u-border-yellow",
		"-u-border-yellow-dark",
		"-u-border-yellow-light"
	],
	direction: [
		"-u-border",
		"-u-border-2",
		"-u-border-4",
		"-u-border-8",
		"-u-border-t",
		"-u-border-t-2",
		"-u-border-t-4",
		"-u-border-t-8",
		"-u-border-l",
		"-u-border-l-2",
		"-u-border-l-4",
		"-u-border-l-8",
		"-u-border-r",
		"-u-border-r-2",
		"-u-border-r-4",
		"-u-border-r-8",
		"-u-border-b",
		"-u-border-b-2",
		"-u-border-b-4",
		"-u-border-b-8"
	],
	radius: [
		"-u-rounded",
		"-u-rounded-lg",
		"-u-rounded-sm",
		"-u-rounded-full",
		"-u-rounded-t",
		"-u-rounded-t-lg",
		"-u-rounded-t-sm",
		"-u-rounded-t-full",
		"-u-rounded-tl",
		"-u-rounded-tl-lg",
		"-u-rounded-tl-sm",
		"-u-rounded-tl-full",
		"-u-rounded-tr",
		"-u-rounded-tr-lg",
		"-u-rounded-tr-sm",
		"-u-rounded-tr-full",
		"-u-rounded-l",
		"-u-rounded-l-lg",
		"-u-rounded-l-sm",
		"-u-rounded-l-full",
		"-u-rounded-r",
		"-u-rounded-r-lg",
		"-u-rounded-r-sm",
		"-u-rounded-r-full",
		"-u-rounded-b",
		"-u-rounded-b-lg",
		"-u-rounded-b-sm",
		"-u-rounded-b-full",
		"-u-rounded-bl",
		"-u-rounded-bl-lg",
		"-u-rounded-bl-sm",
		"-u-rounded-bl-full",
		"-u-rounded-br",
		"-u-rounded-br-lg",
		"-u-rounded-br-sm",
		"-u-rounded-br-full"
	]
};

const types = Object.keys(borderUtilClasses);
export function BorderUtilClassShowcase(): ReactElement {
	const [selectedType, setSelectedType] = useState(types[0]);
	const [selectedClass, setSelectedClass] = useState(borderUtilClasses[selectedType][0]);

	const handleTypeChange = useCallback((value: string) => {
		setSelectedType(value);
		setSelectedClass(borderUtilClasses[value][0]);
	}, []);

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col">
					<Select
						className="-u-margin-b-base"
						label="Choose the border's styling aspect:"
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
						items={borderUtilClasses[selectedType].map((item) => ({ label: item, value: item })) || []}
					/>
				</div>
			}
		>
			<div
				className={joinClassNames("-u-border-solid", {
					[`${selectedClass}`]: selectedClass !== "-u-border-solid"
				})}
				style={{ width: 150, height: 150 }}
			/>
		</ConfigurationView>
	);
}
