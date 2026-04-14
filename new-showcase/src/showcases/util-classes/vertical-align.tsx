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

const verticalAlignUtilClasses: string[] = [
	"-u-align-baseline",
	"-u-align-top",
	"-u-align-middle",
	"-u-align-bottom",
	"-u-align-text-top",
	"-u-align-text-bottom"
];

export function VerticalAlignUtilClassShowcase(): ReactElement {
	const [selectedClass, setSelectedClass] = useState(verticalAlignUtilClasses[0]);

	return (
		<ConfigurationView
			configuration={
				<Select
					label="Choose the utility class to apply:"
					fitToParent={false}
					onValueChanged={setSelectedClass}
					value={selectedClass}
					items={verticalAlignUtilClasses.map((item) => ({ label: item, value: item })) || []}
				/>
			}
		>
			<div className="-u-width-3-5 -u-padding-sm -u-background-grey-light -u-text-lg -u-text-center .-u-leading-loose">
				Align the image <img alt="Orange" className={selectedClass} width="16" src="images/DF757_01-005.png" />
			</div>
		</ConfigurationView>
	);
}
