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

import { Select, LayoutGrid } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const widthsUtilClasses: Record<string, string[]> = {
	fixed: [
		"-u-width-auto",
		"-u-width-full",
		"-u-width-screen",
		"-u-width-1",
		"-u-width-2",
		"-u-width-3",
		"-u-width-4",
		"-u-width-5",
		"-u-width-6",
		"-u-width-8",
		"-u-width-10",
		"-u-width-12",
		"-u-width-16",
		"-u-width-24",
		"-u-width-32",
		"-u-width-48",
		"-u-width-64"
	],
	fraction: [
		"-u-width-1-6",
		"-u-width-1-5",
		"-u-width-1-4",
		"-u-width-1-3",
		"-u-width-2-5",
		"-u-width-1-2",
		"-u-width-3-5",
		"-u-width-2-3",
		"-u-width-3-4",
		"-u-width-4-5",
		"-u-width-5-6"
	],
	maxWidth: [
		"-u-max-width-full",
		"-u-max-width-xs",
		"-u-max-width-sm",
		"-u-max-width-md",
		"-u-max-width-lg",
		"-u-max-width-xl",
		"-u-max-width-2xl",
		"-u-max-width-3xl",
		"-u-max-width-4xl",
		"-u-max-width-5xl"
	],
	minWidth: ["-u-min-width-0", "-u-min-width-full"]
};

const types = Object.keys(widthsUtilClasses);
export function WidthsUtilClassShowcase(): ReactElement {
	const [selectedType, setSelectedType] = useState(types[0]);

	return (
		<ConfigurationView
			configuration={
				<Select
					label="Choose the width's styling aspect:"
					fitToParent={false}
					onValueChanged={setSelectedType}
					value={selectedType}
					items={types.map((item) => ({ label: item, value: item })) || []}
				/>
			}
		>
			<LayoutGrid.Grid>
				{widthsUtilClasses[selectedType].map((value, index) => {
					return (
						<LayoutGrid.Row key={index}>
							<LayoutGrid.Column size={{ sm: 12, md: 3, lg: 3 }}>
								<code>{value}</code>
							</LayoutGrid.Column>
							<LayoutGrid.Column size={{ sm: 12, md: 9, lg: 9 }}>
								<div
									className={`-u-overflow-auto -u-background-grey-light ${
										selectedType !== "maxWidth" && !value.includes("screen") && "-u-flex"
									}`}
								>
									<div
										className={`${value} ${
											selectedType === "maxWidth" ? "-u-flex" : "-u-inline-block"
										} -u-background-grey-dark -u-height-6`}
									>
										{(value.includes("auto") || selectedType === "minWidth") && "This is a inline-block element"}
									</div>
								</div>
							</LayoutGrid.Column>
						</LayoutGrid.Row>
					);
				})}
			</LayoutGrid.Grid>
		</ConfigurationView>
	);
}
