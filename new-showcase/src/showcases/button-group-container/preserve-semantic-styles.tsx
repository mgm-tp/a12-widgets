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

import type { FC, ChangeEvent } from "react";
// start code removal
import { useState, useCallback } from "react";
import { useTheme } from "styled-components";

import type { ButtonGroupContainerProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { ButtonGroupContainer, Button, Icon, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

// end code removal

// start code removal
import { ShowcaseSlider } from "../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";

const leftSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{ title: "Disabled", icon: <Icon>block</Icon>, disabled: true, id: "icon-disabled" },
	{ title: "Active", icon: <Icon>bookmark</Icon>, active: true, id: "icon-active" },
	{ title: "Destructive", icon: <Icon>delete</Icon>, destructive: true, id: "icon-destructive" },
	{ title: "Default", icon: <Icon>home</Icon>, id: "icon-default" },
	{ label: "Disabled", secondary: true, disabled: true, id: "text-secondary-disabled" },
	{ label: "Active", secondary: true, active: true, id: "text-secondary-active" },
	{ label: "Destructive", secondary: true, destructive: true, id: "text-secondary-destructive" },
	{ label: "Default", secondary: true, id: "text-secondary" }
];

const rightSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{ label: "Disabled", primary: true, disabled: true, id: "text-primary-disabled" },
	{ label: "Active", primary: true, active: true, id: "text-primary-active" },
	{ label: "Destructive", primary: true, destructive: true, id: "text-primary-destructive" },
	{ label: "Default", primary: true, id: "text-primary" },
	{
		mainAction: <Button label="Save" primary id="qa-secondary-main" />,
		actionItems: [
			{ id: "qa-secondary-1", text: "Save", meta: <Icon>check</Icon> },
			{ id: "qa-secondary-2", text: "Save and Close" }
		],
		id: "qa-secondary",
		primary: true,
		preserveMainActionStyles: true
	},
	{
		mainAction: <Button label="Save" primary destructive id="qa-primary-main" />,
		actionItems: [
			{ id: "qa-primary-1", text: "Save", meta: <Icon>check</Icon> },
			{ id: "qa-primary-2", text: "Save and Close" }
		],
		id: "qa-primary",
		primary: true,
		destructive: true,
		preserveMainActionStyles: true
	}
];
// end code removal

export const PreserveSemanticStyles: FC = () => {
	// start code removal
	const [width, setWidth] = useState(800);
	const [collapsingDirection, setCollapsingDirection] = useState<"left-to-right" | "right-to-left">("left-to-right");

	const theme = useTheme();

	const onSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setWidth(parseInt(event.target.value));
	}, []);

	const minWidth = theme.spacing.spacing.spacingLg;

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div className="-u-width-1-3">
					<ShowcaseSlider
						className="-u-margin-b-sm"
						label="Width"
						onChange={onSliderChange}
						value={width}
						range={{ max: 1200, min: 32 }}
					/>
					<Checkbox
						label="Collapsing from right to left"
						checked={collapsingDirection === "right-to-left"}
						onChange={(value) => setCollapsingDirection(value ? "right-to-left" : "left-to-right")}
					/>
				</div>
			}
			useDarkBackground
		>
			<CodeSnippetGenerationWrapper>
				<div
					style={{ maxWidth: "100%", width: width < minWidth ? minWidth : width }}
					className="-sc-background-secondary"
				>
					<ButtonGroupContainer
						responsive
						leftSlotButtons={leftSlotButtons}
						rightSlotButtons={rightSlotButtons}
						popupMenuHeaderTitle="All Button Types"
						collapsingDirection={collapsingDirection}
						preserveSemanticStyles
					/>
				</div>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
};
