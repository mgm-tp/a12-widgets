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

import type { ProgressIndicatorSize } from "@com.mgmtp.a12.widgets/widgets-core";
import { Radio, CheckboxGroup, Typography, ProgressIndicator } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const content = loremIpsum({ count: 600, units: "words" });

export function CustomLabel(): ReactElement {
	const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
	const [size, setSize] = useState<ProgressIndicatorSize>("big");

	const changeSize = (value: ProgressIndicatorSize): void => {
		setSize(value);
	};

	const onCheckboxChange = (value: string): void => {
		setCheckboxValue((prevState) => {
			if (prevState.includes(value)) {
				return prevState.filter((v) => v !== value);
			}

			return [...prevState, value];
		});
	};

	return (
		<ConfigurationView
			configuration={
				<>
					<Typography.Body>
						<Radio
							className="-u-margin-b-sm"
							label="Size of the loading indicator"
							onValueChanged={changeSize}
							value={size}
							inline
						>
							<Radio.Item label="Big" value="big" />
							<Radio.Item label="Medium" value="medium" />
							<Radio.Item label="Small" value="small" />
						</Radio>
					</Typography.Body>
					<Typography.Body>
						<CheckboxGroup label="Options" onValueChanged={onCheckboxChange} className="-u-margin-b-xs">
							<CheckboxGroup.Item
								label="Display the loading circle and label horizontally"
								value="horizontal"
								selected={checkboxValue.includes("horizontal")}
							/>
							<CheckboxGroup.Item
								label="Display the loading dots after the label"
								value="dot"
								selected={checkboxValue.includes("dot")}
							/>
							<CheckboxGroup.Item label="Use custom color" value="color" selected={checkboxValue.includes("color")} />
							<CheckboxGroup.Item
								label="Single Overlay"
								value="singleOverlay"
								selected={checkboxValue.includes("singleOverlay")}
							/>
						</CheckboxGroup>
					</Typography.Body>
				</>
			}
		>
			<p>{content}</p>
			<ProgressIndicator
				singleOverlay={checkboxValue.includes("singleOverlay")}
				label="Loading"
				id="label-progress-indicator"
				useLoadingDots={checkboxValue.includes("dot")}
				hideLoadingCircle={checkboxValue.includes("dot")}
				type={checkboxValue.includes("horizontal") ? "horizontal" : "vertical"}
				color={checkboxValue.includes("color") ? "#c91d1d" : undefined}
				size={size}
			/>
		</ConfigurationView>
	);
}
