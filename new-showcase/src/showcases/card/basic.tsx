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

import { Card, Button, ButtonGroup, ResponsiveImageContainer } from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
import { ShowcaseSlider } from "../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";

const MAX_HEIGHT = 300;
const MIN_HEIGHT = 60;
// end code removal
export function BasicCardShowcase(): ReactElement {
	// start code removal
	const [height, setHeight] = useState(350);

	const onHeightSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setHeight(parseFloat(event.target.value));
	}, []);
	// end code removal

	return (
		// start code removal
		<ConfigurationView
			configuration={
				<ShowcaseSlider
					label={
						<>
							<strong>Height range:</strong> min: {MIN_HEIGHT}px, max: {MAX_HEIGHT}px
						</>
					}
					onChange={onHeightSliderChange}
					value={height}
					range={{ min: MIN_HEIGHT, max: MAX_HEIGHT }}
				/>
			}
			useDarkBackground
		>
			<CodeSnippetGenerationWrapper namespaceOptions={[{ name: "Card", subComponents: ["Media", "Content"] }]}>
				<Card style={{ width: 300, background: "#fff" }}>
					<Card.Media style={{ height }}>
						<ResponsiveImageContainer src="images/DF757_01-001.png" alt="Kiwi" />
					</Card.Media>
					<Card.Content>
						<p>Lorem ipsum amet esse veniam dolore in elit id proident reprehenderit</p>
						<ButtonGroup className="-u-margin-t-sm -u-margin-b-sm">
							<Button label="Action 1" secondary />
							<Button label="Action 2" secondary />
						</ButtonGroup>
					</Card.Content>
				</Card>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
