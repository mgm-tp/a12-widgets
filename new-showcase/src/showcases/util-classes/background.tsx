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

import { Select, joinClassNames } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const backgroundUtilClasses: Record<string, string[]> = {
	attachment: ["-u-background-fixed", "-u-background-local", "-u-background-scroll"],
	color: [
		"-u-background-black",
		"-u-background-white",
		"-u-background-transparent",
		"-u-background-blue",
		"-u-background-blue-dark",
		"-u-background-blue-light",
		"-u-background-green",
		"-u-background-green-dark",
		"-u-background-green-light",
		"-u-background-grey",
		"-u-background-grey-dark",
		"-u-background-grey-light",
		"-u-background-orange",
		"-u-background-orange-dark",
		"-u-background-orange-light",
		"-u-background-purple",
		"-u-background-purple-dark",
		"-u-background-purple-light",
		"-u-background-red",
		"-u-background-red-dark",
		"-u-background-red-light",
		"-u-background-yellow",
		"-u-background-yellow-dark",
		"-u-background-yellow-light"
	],
	position: [
		"-u-background-top",
		"-u-background-center",
		"-u-background-left",
		"-u-background-left-top",
		"-u-background-left-bottom",
		"-u-background-right",
		"-u-background-right-top",
		"-u-background-right-bottom",
		"-u-background-bottom"
	],
	repeat: ["-u-background-repeat", "-u-background-repeat-x", "-u-background-repeat-y", "-u-background-no-repeat"],
	size: ["-u-background-contain", "-u-background-cover", "-u-background-auto"]
};

const types = Object.keys(backgroundUtilClasses);
export function BackgroundUtilClassShowcase(): ReactElement {
	const [selectedType, setSelectedType] = useState(types[0]);
	const [selectedClass, setSelectedClass] = useState(backgroundUtilClasses[selectedType][0]);

	const handleTypeChange = useCallback((value: string) => {
		setSelectedType(value);
		setSelectedClass(backgroundUtilClasses[value][0]);
	}, []);

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col">
					<Select
						className="-u-margin-b-base"
						label="Choose the background's styling aspect:"
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
						items={backgroundUtilClasses[selectedType].map((item) => ({ label: item, value: item })) || []}
					/>
				</div>
			}
		>
			{selectedType === "attachment" && (
				<div className="-u-height-48 -u-overflow-auto">
					<div className="-u-height-64">
						<div
							style={{ backgroundImage: "url(images/9.jpg)" }}
							className={joinClassNames(
								"-u-text-white -u-width-1-2 -u-margin-auto -u-padding-sm -u-height-full -u-overflow-auto",
								selectedClass
							)}
						>
							{loremIpsum({ count: 15, units: "sentences" })}
						</div>
					</div>
				</div>
			)}
			{selectedType === "color" && (
				<div
					className={joinClassNames(
						"-u-height-24 -u-flex -u-items-center -u-justify-center -u-font-bold -u-border-dotted -u-border-black -u-width-full",
						selectedClass,
						{
							"-u-text-white":
								!selectedClass.includes("light") &&
								!selectedClass.includes("grey") &&
								!selectedClass.includes("white") &&
								!selectedClass.includes("transparent")
						}
					)}
				>
					{selectedClass}
				</div>
			)}
			{(selectedType === "position" || selectedType === "size") && (
				<div className="-u-background-grey-light -u-height-64 -u-width-full">
					<div
						style={{
							backgroundImage: selectedType === "position" ? "url(images/file-upload-3.jpg)" : "url(images/6.jpg)"
						}}
						className={`-u-height-full -u-background-no-repeat ${selectedClass}`}
					/>
				</div>
			)}
			{selectedType === "repeat" && (
				<div className="-u-background-grey-light -u-height-64 -u-width-full">
					<div
						style={{ backgroundImage: "url(images/file-upload-3.jpg)" }}
						className={`-u-height-full ${selectedClass}`}
					/>
				</div>
			)}
		</ConfigurationView>
	);
}
