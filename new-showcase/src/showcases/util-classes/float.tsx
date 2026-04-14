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

import { Select, Checkbox, ResponsiveImageContainer } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const floatUtilClasses: string[] = ["-u-float-right", "-u-float-left", "-u-float-none"];
const dummyText = loremIpsum({ count: 5, units: "sentences" });

export function FloatUtilClassShowcase(): ReactElement {
	const [selectedClass, setSelectedClass] = useState(floatUtilClasses[0]);
	const [useClearfixClass, setUseClearfixClass] = useState(true);

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col">
					<Checkbox
						fitToParent={false}
						checked={useClearfixClass}
						onChange={setUseClearfixClass}
						label={
							<span>
								Apply <code>-u-clearfix</code> class
							</span>
						}
					/>
					<Select
						label="Choose the utility class to apply:"
						fitToParent={false}
						onValueChanged={setSelectedClass}
						value={selectedClass}
						items={floatUtilClasses.map((item) => ({ label: item, value: item })) || []}
					/>
				</div>
			}
		>
			<div>
				<div className={`-u-padding-sm -u-background-grey-light ${useClearfixClass ? "-u-clearfix" : ""}`}>
					<ResponsiveImageContainer
						className={`${selectedClass} -u-width-1-2`}
						src="images/6.jpg"
						title="Orange"
						alt="Image example"
					/>
					{dummyText}
				</div>
			</div>
		</ConfigurationView>
	);
}
