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

import { Wizard, Icon, Radio, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseSlider } from "../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";

const responsiveBehaviours = [
	{ nextStepFirst: false, focusOnBoundary: false },
	{ nextStepFirst: true, focusOnBoundary: false },
	{ nextStepFirst: false, focusOnBoundary: true },
	{ nextStepFirst: true, focusOnBoundary: true }
];

export function ResponsiveShowcase(): ReactElement {
	const [width, setWidth] = useState(100);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [behaviourIndex, setBehaviourIndex] = useState(0);
	const [showNavigationButtons, setShowNavigationButtons] = useState(true);

	const createClickHandler = useCallback((index: number) => (): void => setSelectedIndex(() => index), []);
	const handleNext = useCallback(() => setSelectedIndex((prevSelectedIndex) => prevSelectedIndex + 1), []);
	const handlePrevious = useCallback(() => setSelectedIndex((prevSelectedIndex) => prevSelectedIndex - 1), []);

	const onSliderChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => setWidth(() => parseFloat(event.target.value)),
		[]
	);

	return (
		// ConfigurationView is a showcase utility and you can just delete it
		<ConfigurationView
			configuration={
				<>
					<ShowcaseSlider
						label={
							<>
								<strong>Current width:</strong> {width}%
							</>
						}
						value={width}
						onChange={onSliderChange}
						range={{ max: 100, min: 45 }}
						className="-u-width-1-3"
					/>
					<Radio
						value={behaviourIndex.toString()}
						label="Responsive Behaviour"
						onValueChanged={(value) => {
							setBehaviourIndex(parseInt(value, 10));
							setWidth(100);
						}}
					>
						<Radio.Item value="0" label="Previous steps will be hidden first - focus on current step" />
						<Radio.Item value="1" label="Next steps will be hidden first - focus on current step" />
						<Radio.Item value="2" label="Previous steps will be hidden first - focus on start, end and current step" />
						<Radio.Item value="3" label="Next steps will be hidden first - focus on start, end and current step" />
					</Radio>
					<Checkbox
						label="Show navigation buttons"
						checked={showNavigationButtons}
						onChange={setShowNavigationButtons}
					/>
				</>
			}
		>
			<Wizard
				responsive
				responsiveBehaviour={responsiveBehaviours[behaviourIndex]}
				truncate
				style={{ width: `${width}%` }}
				id="responsive-wizard"
			>
				{showNavigationButtons && <Wizard.PreviousStepButton disabled={selectedIndex === 0} onClick={handlePrevious} />}
				<Wizard.Step
					label="Preconditions"
					title="Preconditions"
					icon={<Icon>description</Icon>}
					selected={selectedIndex === 0}
					onClick={createClickHandler(0)}
				/>
				<Wizard.Step
					label="Master Conditions"
					title="Master Conditions"
					icon={<Icon>list</Icon>}
					selected={selectedIndex === 1}
					onClick={createClickHandler(1)}
				/>
				<Wizard.Step
					label="Intl. Cover"
					title="Intl. Cover"
					icon={<Icon>phone_android</Icon>}
					selected={selectedIndex === 2}
					onClick={createClickHandler(2)}
				/>
				<Wizard.Step
					label="Partner"
					title="Partner"
					icon={<Icon>people</Icon>}
					selected={selectedIndex === 3}
					onClick={createClickHandler(3)}
				/>
				<Wizard.Step
					label="Quote"
					title="Quote"
					icon={<Icon>forum</Icon>}
					selected={selectedIndex === 4}
					onClick={createClickHandler(4)}
				/>
				<Wizard.Step
					label="Policy"
					title="Policy"
					icon={<Icon>assignment</Icon>}
					selected={selectedIndex === 5}
					onClick={createClickHandler(5)}
				/>
				<Wizard.Step
					label="Terms of Services"
					title="Terms of Services"
					icon={<Icon>miscellaneous_services</Icon>}
					selected={selectedIndex === 6}
					onClick={createClickHandler(6)}
				/>
				<Wizard.Step
					label="Accessibility"
					title="Accessibility"
					icon={<Icon>accessibility</Icon>}
					selected={selectedIndex === 7}
					onClick={createClickHandler(7)}
				/>
				<Wizard.Step
					label="Copyright"
					title="Copyright"
					icon={<Icon>copyright</Icon>}
					selected={selectedIndex === 8}
					onClick={createClickHandler(8)}
				/>
				{showNavigationButtons && <Wizard.NextStepButton disabled={selectedIndex === 8} onClick={handleNext} />}
			</Wizard>
		</ConfigurationView>
	);
}
