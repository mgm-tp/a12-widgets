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

import { Typography, Radio, Button, ProgressIndicator } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const loadingContent = loremIpsum({ count: 600, units: "words" });

export function ProgressIndicatorFastAppearShowcase(): ReactElement {
	const [loading, setLoading] = useState(false);
	const [appearance, setAppearance] = useState<"fast" | "delay">("fast");

	const changeApperance = (value: "fast" | "delay"): void => {
		setAppearance(value);
		setLoading(false);
	};

	const toggleLoading = (): void => {
		setLoading((loading) => !loading);
	};

	return (
		<ConfigurationView
			configuration={
				<>
					<Typography.Body>
						<Radio
							className="-u-margin-b-sm"
							label="Appearance"
							onValueChanged={changeApperance}
							value={appearance}
							inline
						>
							<Radio.Item label="Fast Appear" value="fast" />
							<Radio.Item label="Opening Delay" value="delay" />
						</Radio>
					</Typography.Body>
					<div>
						<Button primary onClick={toggleLoading} className="-u-margin-b-base">
							Toggle Loading
						</Button>
					</div>
				</>
			}
		>
			<p>{loadingContent}</p>
			{loading && (
				<ProgressIndicator
					fastAppear={appearance === "fast"}
					openingDelay={appearance === "delay" ? 500 : undefined}
					label="Loading"
				/>
			)}
		</ConfigurationView>
	);
}
