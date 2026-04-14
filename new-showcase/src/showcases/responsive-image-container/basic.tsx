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

import type { FC, ChangeEvent, ReactElement } from "react";
// start code removal
import { useState, useCallback } from "react";
// end code removal

import { ResponsiveImageContainer, provider } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ShowcaseSlider } from "../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";

const MAX_SIZE = provider.isPhone() ? 300 : 400;
// end code removal
export const ResponsiveImageContainerShowcase: FC = (): ReactElement => {
	// start code removal
	const [width, setWidth] = useState(MAX_SIZE);
	const [height, setHeight] = useState(MAX_SIZE);

	const handleSize = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.name === "width") {
			setWidth((MAX_SIZE * parseFloat(event.target.value)) / 100);
		} else {
			setHeight((MAX_SIZE * parseFloat(event.target.value)) / 100);
		}
	}, []);

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div className="-u-width-1-3">
					<ShowcaseSlider name="width" label={`Width: ${width}px`} onChange={handleSize} range={{ min: 20, step: 1 }} />
					<ShowcaseSlider
						name="height"
						label={`Height: ${height}px`}
						onChange={handleSize}
						range={{ min: 20, step: 1 }}
					/>
				</div>
			}
		>
			<CodeSnippetGenerationWrapper>
				<div style={{ width, height, margin: "auto" }}>
					<ResponsiveImageContainer src="images/DF757_01-001.png" alt="Kiwi" title="Kiwi" />
				</div>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
};
