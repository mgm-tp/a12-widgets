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
// start code removal
import { useState, useMemo, useCallback } from "react";
import { loremIpsum } from "lorem-ipsum";
// end code removal

// start code removal
import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { CheckboxGroup, Radio, LayoutGrid, TextOutput, Typography } from "@com.mgmtp.a12.widgets/widgets-core";

// end code removal
// start code removal
import { ConfigurationView } from "../../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../../helpers/showcase-example.js";

const { Grid, Row, Column } = LayoutGrid;
const longText = loremIpsum({ count: 50, units: "words" });
const shortText = loremIpsum({ count: 20, units: "words" });
const smBreakpoint: SizeDetectorProps.BreakPoint = { width: 350, size: "sm" };
const mdBreakpoint: SizeDetectorProps.BreakPoint = { width: 450, size: "md" };
const breakpoints: SizeDetectorProps.BreakPoint[] = [
	{ width: 250, size: "xs" },
	{ width: Number.POSITIVE_INFINITY, size: "lg" }
];
// end code removal
export function OptionalBreakpointsShowcase(): ReactElement {
	// start code removal
	const [containerWidth, setContainerWidth] = useState("750");
	const [checkboxValue, setCheckboxValue] = useState<string[]>([]);

	const enableMd = useMemo(() => checkboxValue.includes("md"), [checkboxValue]);
	const enableSm = useMemo(() => checkboxValue.includes("sm"), [checkboxValue]);

	const firstTitle = useMemo(
		() => `${enableSm ? "sm: 6-6; " : ""}${enableMd ? "md: 6-6; " : ""}lg: 4-8`,
		[enableMd, enableSm]
	);
	const secondTitle = useMemo(
		() => `${enableSm ? "sm: 3-3-6;  " : ""}${enableMd ? "md: 6-4-2; " : ""}lg: 4-4-4`,
		[enableMd, enableSm]
	);
	const gridBreakpoints = useMemo((): SizeDetectorProps.BreakPoint[] => {
		if (enableSm && enableMd) {
			return [...breakpoints, smBreakpoint, mdBreakpoint];
		} else if (enableMd) {
			return [...breakpoints, mdBreakpoint];
		} else if (enableSm) {
			return [...breakpoints, smBreakpoint];
		}

		return breakpoints;
	}, [enableMd, enableSm]);

	const onCheckboxChange = useCallback((value: string): void => {
		setCheckboxValue((prevState) => {
			if (prevState.includes(value)) {
				return prevState.filter((v) => v !== value);
			}

			return [...prevState, value];
		});
	}, []);

	// end code removal
	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div>
					<CheckboxGroup label="Optional Breakpoint" inline onValueChanged={onCheckboxChange}>
						<CheckboxGroup.Item label="Enable SM Breakpoint" value="sm" selected={enableSm} />
						<CheckboxGroup.Item label="Enable MD Breakpoint" value="md" selected={enableMd} />
					</CheckboxGroup>
					<Radio
						className="-u-margin-t-sm"
						label="Width of Container"
						onValueChanged={setContainerWidth}
						value={containerWidth}
						inline
					>
						<Radio.Item label="xs (200px)" value="200" />
						<Radio.Item label="sm (300px)" value="300" />
						<Radio.Item label="md (400px)" value="400" />
						<Radio.Item label="lg (750px)" value="750" />
					</Radio>
				</div>
			}
		>
			<CodeSnippetGenerationWrapper
				namespaceOptions={[
					{ name: "LayoutGrid", subComponents: ["Row", "Grid", "Column"] },
					{ name: "Typography", subComponents: ["Headline"] }
				]}
			>
				<div style={{ width: `${containerWidth}px`, overflowY: "auto" }}>
					<Typography.Headline ariaLevel={5} level={5}>
						{firstTitle}
					</Typography.Headline>
					<Grid breakpoints={gridBreakpoints}>
						<Row>
							<Column size={{ sm: 6, md: 6, lg: 4 }}>
								<TextOutput label="Lorem ipsum dolor">{shortText}</TextOutput>
							</Column>
							<Column size={{ sm: 6, md: 6, lg: 8 }}>
								<TextOutput label="Lorem ipsum dolor">{shortText}</TextOutput>
							</Column>
						</Row>
					</Grid>
					<Typography.Headline ariaLevel={5} level={5}>
						{secondTitle}
					</Typography.Headline>
					<Grid breakpoints={gridBreakpoints}>
						<Row>
							<Column size={{ sm: 3, md: 6, lg: 4 }}>
								<TextOutput label="Lorem ipsum dolor">{shortText}</TextOutput>
							</Column>
							<Column size={{ sm: 3, md: 4, lg: 4 }}>
								<TextOutput label="Lorem ipsum dolor">{longText}</TextOutput>
							</Column>
							<Column size={{ sm: 6, md: 2, lg: 4 }}>
								<TextOutput label="Lorem ipsum dolor">{shortText}</TextOutput>
							</Column>
						</Row>
					</Grid>
				</div>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
}
