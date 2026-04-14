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
import { useState, useMemo } from "react";
import { loremIpsum } from "lorem-ipsum";

import { Select, Range } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const displayUtilClasses = [
	"-u-hidden",
	"-u-block",
	"-u-inline-block",
	"-u-inline",
	"-u-table",
	"-u-flex",
	"-u-inline-flex"
];

const dummyText = `Not apply display utility class. ${loremIpsum({ count: 1, units: "sentences" })}`;

export function DisplayUtilClassShowcase(): ReactElement {
	const [selectedClass, setSelectedClass] = useState(displayUtilClasses[0]);

	const content = useMemo(() => {
		if (selectedClass === "-u-table") {
			return (
				<>
					<div className="-u-table">
						{Array.from(new Range(3)).map((row) => (
							<div className="-u-table-row" key={row}>
								{Array.from(new Range(3)).map((cell, index) => (
									<div className="-u-table-cell -u-padding-2xs -u-text-red-dark" key={index}>
										<strong>{`TABLE CELL ${row}-${cell}`}</strong>
									</div>
								))}
							</div>
						))}
					</div>
				</>
			);
		}

		if (selectedClass.includes("flex")) {
			return (
				<>
					{dummyText}
					<div className={selectedClass}>
						<div className="-sc-helper-flexbox__item">Flex item</div>
						<div className="-sc-helper-flexbox__item">Flex item</div>
					</div>
					{dummyText}
				</>
			);
		}

		return (
			<>
				{dummyText}{" "}
				<span className={`-u-text-red-dark ${selectedClass}`}>
					<strong>Applied {selectedClass} class.</strong>
				</span>{" "}
				{dummyText}
			</>
		);
	}, [selectedClass]);

	return (
		<ConfigurationView
			configuration={
				<Select
					label="Choose the utility class to apply:"
					fitToParent={false}
					onValueChanged={setSelectedClass}
					value={selectedClass}
					items={displayUtilClasses.map((item) => ({ label: item, value: item })) || []}
				/>
			}
		>
			<div className="-u-padding-sm -u-background-grey-light">{content}</div>
		</ConfigurationView>
	);
}
