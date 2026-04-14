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

import type { ChangeEvent, ReactElement } from "react";
import { useState, useCallback, useMemo } from "react";

import { DefaultFileUpload, HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";
import { ShowcaseSlider } from "../../helpers/showcase-slider.js";
// end code removal
export function CustomSize(): ReactElement {
	// start code removal
	const [width, setWidth] = useState(200);
	const [height, setHeight] = useState(200);
	const [maxHeight, setMaxHeight] = useState(300);
	const [maxWidth, setMaxWidth] = useState(300);

	const handleSize = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		const value = parseFloat(event.target.value);

		switch (event.target.name) {
			case "width":
				setWidth(value);
				break;
			case "height":
				setHeight(value);
				break;
			case "maxWidth":
				setMaxWidth(value);
				break;
			case "maxHeight":
				setMaxHeight(value);
				break;
			default:
				break;
		}
	}, []);

	const sliderProps = useMemo(
		() => ({
			range: { min: 20, max: 300, step: 10 },
			defaultValue: 200,
			onChange: handleSize
		}),
		[handleSize]
	);
	// end code removal

	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div className="-u-width-1-4">
					<ShowcaseSlider name="width" label={`Width - ${width}`} {...sliderProps} />
					<ShowcaseSlider name="height" label={`Height - ${height}`} {...sliderProps} />
					<ShowcaseSlider name="maxWidth" label={`Max width - ${maxWidth}`} {...sliderProps} />
					<ShowcaseSlider name="maxHeight" label={`Max height - ${maxHeight}`} {...sliderProps} />
				</div>
			}
		>
			<CodeSnippetGenerationWrapper>
				<DefaultFileUpload
					id="custom-size-file-upload"
					tooltips={<HintTooltip text="This is a hint" />}
					label="Customized size File Upload"
					uploadAreaSize={{ height, width, maxHeight, maxWidth }}
				/>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
