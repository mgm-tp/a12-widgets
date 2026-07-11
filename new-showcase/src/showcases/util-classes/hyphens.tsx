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
import { useState, useCallback } from "react";

import { noop, TextField, Checkbox, TextOutput } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseSlider } from "../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";

export function HyphensUtilClassShowcase(): ReactElement {
	const [width, setWidth] = useState(230);
	const [value, setValue] = useState("Grundstücksverkehrsgenehmigungszuständigkeitsübertragungsverordnung");

	const onSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setWidth(parseFloat(event.target.value));
	}, []);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	return (
		<ConfigurationView
			configuration={
				<div className="-u-width-1-3 -u-flex-col">
					<TextField
						label="Enter your text:"
						className="-u-padding-b-base"
						value={value}
						onChange={handleInputChange}
					/>
					<ShowcaseSlider
						onChange={onSliderChange}
						value={width}
						range={{ max: 500, min: 60 }}
						label={`Current container width: ${width}px`}
					/>
				</div>
			}
		>
			<div lang="de" style={{ width }} className="-sc-helper-border -u-padding-base -u-hyphens">
				<TextOutput className="-u-padding-b-base">{value}</TextOutput>
				<Checkbox className="-u-padding-b-base" checked={false} label={value} onChange={() => undefined} />
				<TextField
					className="-u-padding-b-base"
					placeholder="Placeholder"
					value=""
					onChange={noop}
					label={value}
					warningMessage={value}
				/>
			</div>
		</ConfigurationView>
	);
}
