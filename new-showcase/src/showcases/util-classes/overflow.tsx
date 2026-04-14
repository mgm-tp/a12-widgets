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

import { Select, provider, joinClassNames } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const overflowUtilClasses: string[] = [
	"-u-overflow-auto",
	"-u-overflow-hidden",
	"-u-overflow-visible",
	"-u-overflow-scroll",
	"-u-overflow-x-auto",
	"-u-overflow-y-auto",
	"-u-overflow-x-scroll",
	"-u-overflow-y-scroll"
];

const OVERFLOW_SCROLLING_TYPES = ["none", "scrolling-touch", "scrolling-auto"];
const longContent = loremIpsum({ count: 8, units: "sentences" });
const shortContent = loremIpsum({ count: 1, units: "sentences" });
const isTablet = provider.isTablet();

export function OverflowUtilClassShowcase(): ReactElement {
	const [selectedClass, setSelectedClass] = useState(overflowUtilClasses[0]);
	const [overflowScrolling, setOverflowScrolling] = useState<string>(OVERFLOW_SCROLLING_TYPES[0]);

	const content = useMemo((): string => {
		if (isTablet && overflowScrolling.indexOf("scrolling-") > -1) {
			return longContent;
		}

		if (selectedClass === "-u-overflow-x-auto" || selectedClass === "-u-overflow-y-scroll") {
			return shortContent;
		}

		return longContent;
	}, [selectedClass, overflowScrolling]);

	return (
		<ConfigurationView
			configuration={
				<div>
					{isTablet && (
						<Select
							className="-u-margin-r-md"
							label="Overflow scrolling:"
							fitToParent={false}
							onValueChanged={setOverflowScrolling}
							value={overflowScrolling}
							items={OVERFLOW_SCROLLING_TYPES.map((value) => ({ label: value, value }))}
						/>
					)}
					<Select
						label="Choose the utility class to apply:"
						fitToParent={false}
						onValueChanged={setSelectedClass}
						value={selectedClass}
						items={overflowUtilClasses.map((item) => ({ label: item, value: item })) || []}
					/>
				</div>
			}
		>
			<div
				className={`-u-overflow-y-auto ${selectedClass === "-u-overflow-visible" ? "-u-width-full" : "-u-width-2-5"}`}
			>
				<div
					className={joinClassNames(
						`-u-border-dotted -u-background-white -u-height-32 ${selectedClass}`,
						{
							[`-u-${overflowScrolling}`]: overflowScrolling
						},
						{ "-u-width-2-5 -u-margin-auto": selectedClass === "-u-overflow-visible" }
					)}
				>
					{selectedClass === "-u-overflow-x-auto" && (
						<>
							<span>3.1415926535897932384626433832795029000000000000000</span>
							<br />
						</>
					)}
					{content}
				</div>
			</div>
		</ConfigurationView>
	);
}
