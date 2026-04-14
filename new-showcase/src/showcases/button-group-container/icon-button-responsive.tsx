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
import { ButtonGroupContainer, Icon, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";

// end code removal

// start code removal
import { ShowcaseSlider } from "../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../helpers/showcase-example.js";

const leftSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{ title: "Zoom in", icon: <Icon>zoom_in</Icon>, id: "left-icon-1" },
	{ title: "Zoom out", icon: <Icon>zoom_out</Icon>, id: "left-icon-2" }
];

const rightSlotButtons: ButtonGroupContainerProps.ButtonProps[] = [
	{ title: "Add", icon: <Icon>add</Icon>, id: "right-icon-1" },
	{ title: "Edit", icon: <Icon>edit</Icon>, id: "right-icon-2" },
	{ title: "Delete", icon: <Icon>delete</Icon>, id: "right-icon-3" },
	{
		title: "Minimize",
		icon: <Icon>fullscreen_exit</Icon>,
		disabled: true,
		id: "right-icon-4"
	}
];
// end code removal
export const IconButtonResponsiveShowcase: FC = () => {
	// start code removal
	const [width, setWidth] = useState(300);
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
						defaultValue={300}
						onChange={onSliderChange}
						range={{ max: 600, min: minWidth }}
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
						collapsingDirection={collapsingDirection}
					/>
				</div>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
};
