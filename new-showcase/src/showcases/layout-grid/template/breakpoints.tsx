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
import type { FC, ChangeEvent, ReactElement } from "react";
import { useState, useRef, useCallback } from "react";

import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { noop, Typography, TextField, LayoutGrid, TextOutput, HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseSlider } from "../../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../../helpers/configuration-view.js";

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

export const Breakpoints: FC = (): ReactElement => {
	const [breakpoint, setBreakpoint] = useState<SizeDetectorProps.BreakPoint | undefined>(undefined);
	const container = useRef<HTMLElement | null>(null);

	const getWrapperRef = useCallback((ref: HTMLDivElement) => {
		container.current = ref;
	}, []);

	const handleWidthChange = useCallback(({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
		if (container.current) {
			container.current.style.width = value + "%";
		}
	}, []);

	const onBreakPointChange = useCallback((breakpoint: SizeDetectorProps.BreakPoint): void => {
		setBreakpoint(breakpoint);
	}, []);

	return (
		<ConfigurationView
			configuration={
				<div>
					<ShowcaseSlider
						label="Drag this slider to directly manipulate the width:"
						onChange={handleWidthChange}
						range={{ min: 10 }}
					/>
					<p>
						<strong>Current breakpoint:</strong> {breakpoint?.size || "lg"}
					</p>
				</div>
			}
		>
			<div ref={getWrapperRef}>
				<Typography.Headline ariaLevel={5} level={5}>
					sm: 6-6-6-6; md: 12-6-6-12; lg: 2-4-3-3
				</Typography.Headline>
				<Grid breakpoints={breakpoints} onBreakPointChanged={onBreakPointChange}>
					<Row>
						<Column size={{ sm: 6, md: 12, lg: 2 }}>
							<TextField label="Label 1" addonAfter={hint} onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 4 }}>
							<TextField label="Label 2" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 3 }}>
							<TextField label="Label 3" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 12, lg: 3 }}>
							<TextField label="Label 4" onChange={noop} />
						</Column>
					</Row>
					<Row>
						<Column size={{ sm: 6, md: 12, lg: 2 }}>
							<TextField label="Label 5" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 4 }}>
							<TextField label="Label 6" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 3 }}>
							<TextField label="Label 7" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 12, lg: 3 }}>
							<TextField label="Label 8" onChange={noop} />
						</Column>
					</Row>
				</Grid>
				<br />
				<Typography.Headline ariaLevel={5} level={5}>
					sm: 6-6-6; md: 6-6-6; lg: 3-6-3
				</Typography.Headline>
				<Grid breakpoints={breakpoints}>
					<Row verticalAlignment="bottom">
						<Column size={{ sm: 6, md: 6, lg: 3 }}>
							<TextField label="Label 1" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 6 }} verticalAlignment="top">
							<TextOutput label="A single TextOutput">{longText}</TextOutput>
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 3 }}>
							<TextField label="Label 2" onChange={noop} />
						</Column>
					</Row>
					<Row>
						<Column size={{ sm: 6, md: 6, lg: 3 }}>
							<TextField label="Label 3" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 6 }}>
							<TextField label="Label 4" onChange={noop} />
						</Column>
						<Column size={{ sm: 6, md: 6, lg: 3 }}>
							<TextField label="Label 5" onChange={noop} />
						</Column>
					</Row>
				</Grid>
			</div>
		</ConfigurationView>
	);
};
