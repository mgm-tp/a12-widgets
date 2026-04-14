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

import { loremIpsum } from "lorem-ipsum";
import type { FC } from "react";
import { useState, useCallback } from "react";

import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	DefaultFileUpload,
	Checkbox,
	noop,
	Range,
	Radio,
	TextField,
	LayoutGrid,
	TextOutput,
	HintTooltip
} from "@com.mgmtp.a12.widgets/widgets-core";

// start code removal
// end code removal
// start code removal
import { ConfigurationView } from "../../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../../helpers/showcase-example.js";

const { Grid, Row, Column } = LayoutGrid;
const longText = loremIpsum({ count: 50, units: "words" });
const hint = <HintTooltip text="This is a hint" key="hint" />;
const breakpoints: SizeDetectorProps.BreakPoint[] = [
	{
		width: 250,
		size: "xs"
	},
	{
		width: 350,
		size: "sm"
	},
	{
		width: 450,
		size: "md"
	},
	{
		width: Number.POSITIVE_INFINITY,
		size: "lg"
	}
];
// end code removal
type VerticalAlignment = "top" | "middle" | "bottom" | undefined;

export const Alignment: FC = () => {
	const [verticalAlignment, setVerticalAlignment] = useState<VerticalAlignment>(undefined);
	const [position, setPosition] = useState("LayoutGrid");

	const onRowAlignmentChange = useCallback((value: string): void => {
		const rowVerticalAlignment = value === "default" ? undefined : (value as VerticalAlignment);
		setVerticalAlignment(rowVerticalAlignment);
	}, []);

	const onPositionChange = useCallback((value: string): void => {
		setPosition(value);
		setVerticalAlignment(undefined);
	}, []);

	return (
		// start code removal
		<ConfigurationView
			configuration={
				<div>
					<Radio inline label="Apply vertical alignment for:" value={position} onValueChanged={onPositionChange}>
						<Radio.Item label="Layout Grid" value="LayoutGrid" />
						<Radio.Item label="First Row" value="Row1" />
						<Radio.Item label="First Column" value="Column1" />
					</Radio>
					<br />
					<Radio
						inline
						label="Vertical alignment value:"
						value={!verticalAlignment ? "default" : verticalAlignment}
						onValueChanged={onRowAlignmentChange}
					>
						<Radio.Item label="Default" value="default" />
						<Radio.Item label="Top" value="top" />
						<Radio.Item label="Middle" value="middle" />
						<Radio.Item label="Bottom" value="bottom" />
					</Radio>
				</div>
			}
		>
			<CodeSnippetGenerationWrapper
				namespaceOptions={[{ name: "LayoutGrid", subComponents: ["Row", "Grid", "Column"] }]}
			>
				<Grid breakpoints={breakpoints} verticalAlignment={position === "LayoutGrid" ? verticalAlignment : undefined}>
					{Array.from(new Range(2)).map((index) => (
						<Row key={index} verticalAlignment={index === 0 && position === "Row1" ? verticalAlignment : undefined}>
							<Column
								size={{ sm: 6, md: 6, lg: 3 }}
								verticalAlignment={position === "Column1" ? verticalAlignment : undefined}
							>
								<TextField label="Label A" onChange={noop} addonAfter={[hint]} />
							</Column>
							<Column size={{ sm: 6, md: 6, lg: 5 }}>
								<TextOutput label="Label B">{longText}</TextOutput>
							</Column>
							<Column size={{ sm: 6, md: 6, lg: 2 }}>
								<TextField label="Label A" onChange={noop} />
							</Column>
							<Column size={{ sm: 6, md: 3, lg: 2 }}>
								{index === 0 ? (
									<Checkbox
										label="Checkbox"
										checked={false}
										onChange={noop}
										ariaDescribedby={`checkbox-tooltip-${index}`}
									/>
								) : (
									<DefaultFileUpload uploadAreaSize={{ height: 80, width: 80 }} />
								)}
							</Column>
						</Row>
					))}
				</Grid>
			</CodeSnippetGenerationWrapper>
		</ConfigurationView>
		// end code removal
	);
};
