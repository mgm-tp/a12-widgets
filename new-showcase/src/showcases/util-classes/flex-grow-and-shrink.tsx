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
import { loremIpsum } from "lorem-ipsum";

import { Select } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const flexUtilClasses: string[] = [
	"-u-flex-1",
	"-u-flex-auto",
	"-u-flex-initial",
	"-u-flex-none",
	"-u-flex-grow",
	"-u-flex-no-grow",
	"-u-flex-shrink",
	"-u-flex-no-shrink"
];
const longLength = loremIpsum({ count: 1, units: "sentences" });

export function FlexGrowAndShrinkUtilClassShowcase(): ReactElement {
	const [selectedClass, setSelectedClass] = useState(flexUtilClasses[0]);

	return (
		<ConfigurationView
			configuration={
				<Select
					label="Choose the utility class to apply:"
					fitToParent={false}
					onValueChanged={setSelectedClass}
					value={selectedClass}
					items={flexUtilClasses.map((item) => ({ label: item, value: item })) || []}
				/>
			}
		>
			<div className="-sc-helper-flexbox -u-overflow-auto">
				<div className="-u-flex -sc-helper-flexbox__container">
					{!selectedClass.includes("grow") && !selectedClass.includes("shrink") && !selectedClass.includes("none") && (
						<>
							<div className={`-sc-helper-flexbox__item ${selectedClass}`}>Short</div>
							<div className={`-sc-helper-flexbox__item ${selectedClass}`}>Medium length</div>
							<div className={`-sc-helper-flexbox__item ${selectedClass}`}>{longLength}</div>
						</>
					)}
					{selectedClass === "-u-flex-none" && (
						<>
							<div className="-sc-helper-flexbox__item -u-flex-1">Item that can grow or shrink if needed</div>
							<div className="-sc-helper-flexbox__item -u-flex-none">Item that cannot grow or shrink if needed</div>
							<div className="-sc-helper-flexbox__item -u-flex-1">Item that can grow or shrink if needed</div>
						</>
					)}
					{selectedClass === "-u-flex-grow" && (
						<>
							<div className="-sc-helper-flexbox__item -u-flex-none">Content with flex none</div>
							<div className="-sc-helper-flexbox__item -u-flex-grow">Item will grow</div>
							<div className="-sc-helper-flexbox__item -u-flex-none">Content with flex none</div>
						</>
					)}
					{selectedClass === "-u-flex-no-grow" && (
						<>
							<div className="-sc-helper-flexbox__item -u-flex-grow">Item will grow</div>
							<div className="-sc-helper-flexbox__item -u-flex-no-grow">Item will not grow</div>
							<div className="-sc-helper-flexbox__item -u-flex-grow">Item will grow</div>
						</>
					)}
					{selectedClass === "-u-flex-shrink" && (
						<>
							<div className="-sc-helper-flexbox__item -u-flex-none">Content with flex none</div>
							<div className="-sc-helper-flexbox__item -u-flex-shrink">
								Item that will shrink even if it causes the content to wrap
							</div>
							<div className="-sc-helper-flexbox__item -u-flex-none">Content with flex none</div>
						</>
					)}
					{selectedClass === "-u-flex-no-shrink" && (
						<>
							<div className="-sc-helper-flexbox__item -u-flex-shrink">Item that can shrink if needed</div>
							<div className="-sc-helper-flexbox__item -u-flex-no-shrink">
								Item that cannot shrink and display its initial size
							</div>
							<div className="-sc-helper-flexbox__item -u-flex-shrink">Item that can shrink if needed</div>
						</>
					)}
				</div>
			</div>
		</ConfigurationView>
	);
}
