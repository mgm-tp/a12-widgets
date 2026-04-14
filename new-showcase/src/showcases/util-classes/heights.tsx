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

const heightsUtilClasses: Record<string, string[]> = {
	height: [
		"-u-height-auto",
		"-u-height-full",
		"-u-height-screen",
		"-u-height-px",
		"-u-height-1",
		"-u-height-2",
		"-u-height-3",
		"-u-height-4",
		"-u-height-5",
		"-u-height-6",
		"-u-height-8",
		"-u-height-10",
		"-u-height-12",
		"-u-height-16",
		"-u-height-24",
		"-u-height-32",
		"-u-height-48",
		"-u-height-64"
	],
	maxHeight: ["-u-max-height-full", "-u-max-height-screen"],
	minHeight: ["-u-min-height-0", "-u-min-height-full", "-u-min-height-screen"]
};

const types = Object.keys(heightsUtilClasses);
const content = loremIpsum({ units: "sentences", count: 5 });
export function HeightsUtilClassShowcase(): ReactElement {
	const [selectedType, setSelectedType] = useState(types[0]);
	const [selectedClass, setSelectedClass] = useState(heightsUtilClasses[selectedType][0]);

	const handleTypeChange = useCallback((value: string) => {
		setSelectedType(value);
		setSelectedClass(heightsUtilClasses[value][0]);
	}, []);

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col">
					<Select
						className="-u-margin-b-base"
						label="Choose the height's styling aspect:"
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
						items={heightsUtilClasses[selectedType].map((item) => ({ label: item, value: item })) || []}
					/>
				</div>
			}
		>
			<div style={{ minHeight: 250, maxHeight: 250 }} className="-u-overflow-auto -u-width-full">
				<div className="-u-height-32 -u-background-grey-light">
					<div className={`${selectedClass} -u-width-1-2 -u-background-grey-dark`}>
						{selectedType !== "minHeight" ? content : selectedClass}
					</div>
				</div>
			</div>
		</ConfigurationView>
	);
}
