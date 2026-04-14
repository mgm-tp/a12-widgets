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
import { ProgressIndicator, Typography, Radio } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const content = loremIpsum({ count: 600, units: "words" });

export function OverlayVariant(): ReactElement {
	const [visibility, setVisibility] = useState<string>("outer");

	const changeVisibility = (value: ProgressIndicatorSize): void => {
		setVisibility(value);
	};

	const variant = visibility === "transparent" || visibility === "bright" ? visibility : undefined;

	return (
		<ConfigurationView
			configuration={
				<>
					<Typography.Body>
						<Radio
							className="-u-margin-b-sm"
							label="Visibility and overlay variants"
							onValueChanged={changeVisibility}
							value={visibility}
						>
							<Radio.Item label="Hide outer overlay" value="outer" />
							<Radio.Item label="Hide inner overlay" value="inner" />
							<Radio.Item label="Hide the loading circle" value="loading" />
							<Radio.Item label="Hide both outer and inner overlay" value="transparent" />
							<Radio.Item label="Use bright variant " value="bright" />
						</Radio>
					</Typography.Body>
				</>
			}
		>
			<p style={{ opacity: visibility === "transparent" ? 0 : 1 }}>{content}</p>
			<ProgressIndicator
				label="Loading"
				id="label-progress-indicator"
				outerOverlayVariant={variant ?? (visibility === "outer" ? "transparent" : undefined)}
				innerOverlayVariant={variant ?? (visibility === "inner" ? "transparent" : undefined)}
				hideLoadingCircle={visibility === "loading"}
			/>
		</ConfigurationView>
	);
}
