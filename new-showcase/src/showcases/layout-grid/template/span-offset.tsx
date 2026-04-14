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

// start code removal
import { omit } from "lodash-es";
// end code removal
import type { FC, ChangeEvent, SetStateAction } from "react";
import { useState, useCallback, useMemo } from "react";
// start code removal
import { styled, css } from "styled-components";

import type { LayoutGridProps, SizeDetectorProps, Container } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, ButtonGroup, LayoutGrid, Range, Checkbox, Radio, Select } from "@com.mgmtp.a12.widgets/widgets-core";

// end code removal
// start code removal
import { ShowcaseSlider } from "../../../helpers/showcase-slider.js";
import { ConfigurationView } from "../../../helpers/configuration-view.js";
import { CodeSnippetGenerationWrapper } from "../../../helpers/showcase-example.js";

const { Grid, Row, Column } = LayoutGrid;

const StyledCellWrapper = styled.div<{ bgColor: string }>(({ bgColor, theme }) => {
	return css`
		background-color: ${bgColor};
		color: ${theme.colors.text.invertedColor};
		height: 2.5rem;
		display: flex;
		align-items: center;
		font-weight: ${theme.typography.fontWeight.boldFontWeight};
	`;
});

const StyledCellContent = styled.div`
	padding: 8px;
`;

const ColoredCell: FC<Container & { bgColor: string }> = ({ children, bgColor }) => (
	<StyledCellWrapper bgColor={bgColor}>
		<StyledCellContent>{children}</StyledCellContent>
	</StyledCellWrapper>
);

const COLUMN_COUNT = 3;

const initialResponsive: LayoutGridProps.ResponsiveConfig = {
	lg: [3, 3, 6],
	sm: [6, 6, 12]
};

const fillOffsets = Array.from(Array(COLUMN_COUNT)).fill(0, 0, COLUMN_COUNT);
const fillSpans = Array.from(Array(COLUMN_COUNT)).fill(1, 0, COLUMN_COUNT);
const initialOffsets: LayoutGridProps.ResponsiveConfig = {
	lg: fillOffsets,
	sm: fillOffsets
};
const initialSpans: LayoutGridProps.ResponsiveConfig = {
	lg: fillSpans,
	sm: fillSpans
};

const layoutNumbers = Array.from(new Range(13)).map((value) => ({
	value: `${value}`,
	label: `${value}`,
	tabIndex: 0
}));

const initialConfigs: LayoutGridProps.LayoutConfig[] = [
	{
		layout: initialResponsive
	},
	{
		layout: initialResponsive,
		offsets: {
			lg: [2],
			sm: [1]
		}
	},
	{
		layout: initialResponsive,
		spans: {
			lg: [2, 1],
			sm: [2, 1]
		}
	},
	{
		layout: initialResponsive,
		offsets: {
			lg: [0, 0],
			sm: [0, 1]
		},
		spans: {
			lg: [1, 2],
			sm: [1, 1]
		}
	}
];

const rowLabel = (index: number): string => {
	switch (index) {
		case 0:
			return "Blue";
		case 1:
			return "Green";
		case 2:
			return "Red";
		default:
			return "Yellow";
	}
};

const rows = initialConfigs.map((value, index) => ({
	value: `${index}`,
	label: rowLabel(index),
	tabIndex: 0
}));

type BreakpointSize = "sm" | "md" | "lg";
// end code removal

export const SpanAndOffset: FC = () => {
	const [breakpoint, setBreakpoint] = useState<SizeDetectorProps.BreakPoint | undefined>(undefined);
	// start code removal
	const [selectedRow, setSelectedRow] = useState<string>(rows[0].value);
	const [sliderWidth, setSliderWidth] = useState<string>("100");
	const [rowsConfig, setRowsConfig] = useState<LayoutGridProps.LayoutConfig[]>(initialConfigs);
	const [rowConfig, setRowConfig] = useState<LayoutGridProps.LayoutConfig>(initialConfigs[0]);
	const [enableMdBreakpointConfig, setEnableMdBreakpointConfig] = useState<boolean>(false);

	const changeWidth = useCallback(({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
		setSliderWidth(value);
	}, []);
	// end code removal
	const onBreakPointChanged = useCallback(
		(breakpoint: SetStateAction<SizeDetectorProps.BreakPoint | undefined>): void => {
			setBreakpoint(breakpoint);
		},
		[]
	);

	// start code removal
	const breakpoints = useMemo((): BreakpointSize[] => {
		if (enableMdBreakpointConfig) {
			return [...Object.keys(initialResponsive), "md"] as BreakpointSize[];
		}

		return Object.keys(initialResponsive) as BreakpointSize[];
	}, [enableMdBreakpointConfig]);

	const toggleEnableMdBreakpointConfig = useCallback(
		(checked: boolean): void => {
			setEnableMdBreakpointConfig(checked);

			let newRowsConfig: LayoutGridProps.LayoutConfig[];
			setRowsConfig((prevState) => {
				newRowsConfig = prevState.map((config) => {
					const offsets: LayoutGridProps.ResponsiveConfig = {
						lg: config.offsets?.lg || fillOffsets,
						md: fillOffsets,
						sm: config.offsets?.sm || fillOffsets
					};
					const spans: LayoutGridProps.ResponsiveConfig = {
						lg: config.spans?.lg || fillSpans,
						md: fillSpans,
						sm: config.spans?.sm || fillSpans
					};

					return {
						...config,
						layout: checked ? { ...config.layout, md: config.layout.lg } : omit(config.layout, "md"),
						offsets: checked ? offsets : omit(offsets, "md"),
						spans: checked ? spans : omit(spans, "md")
					};
				});

				return newRowsConfig;
			});

			setRowConfig(() => {
				return newRowsConfig[parseInt(selectedRow)];
			});
		},
		[selectedRow]
	);

	const updateResponsive = useCallback(
		(value: string, colIndex: number, breakpoint: BreakpointSize) => {
			let newRowsConfig: LayoutGridProps.LayoutConfig[];
			setRowsConfig((prevState) => {
				const result: LayoutGridProps.LayoutConfig[] = prevState.map((config) => {
					const newResponsiveConfig = { ...config.layout };
					const newValue = newResponsiveConfig[breakpoint]?.map((currentValue, index) =>
						index === colIndex ? (parseInt(value) as LayoutGridProps.ColumnNumber) : currentValue
					);

					if (newValue) {
						newResponsiveConfig[breakpoint] = newValue;
					}

					return {
						...config,
						layout: newResponsiveConfig
					};
				});
				newRowsConfig = [...result];

				return result;
			});

			setRowConfig(() => {
				return newRowsConfig[parseInt(selectedRow)];
			});
		},
		[selectedRow]
	);
	// end code removal

	const layoutConfiguration = useMemo(() => {
		return (
			<>
				{breakpoints.map((breakpoint, index) => {
					return (
						<div className="-u-flex -u-margin-b-sm -u-items-center" key={index}>
							<strong className="-u-margin-r-xs -u-width-4">{breakpoint}</strong>
							<div className="-u-flex">
								{Array.from(new Range(initialResponsive.lg.length)).map((item, index) => (
									<Select
										key={index}
										className="-u-margin-r-xs"
										onValueChanged={(value) => updateResponsive(value, index, breakpoint)}
										value={`${rowsConfig[0].layout[breakpoint]?.[index]}`}
										items={layoutNumbers}
									/>
								))}
							</div>
						</div>
					);
				})}
			</>
		);
	}, [breakpoints, rowsConfig, updateResponsive]);

	const onSelectedRowChange = useCallback(
		(value: string): void => {
			setSelectedRow(value);
			const configRow = rowsConfig.find((config, index) => index === parseInt(value));

			if (configRow) {
				setRowConfig(configRow);
			}
		},
		[rowsConfig]
	);

	const onConfigChanged = useCallback(
		(value: string, colIndex: number, breakpoint: BreakpointSize, updatedKey: "offsets" | "spans"): void => {
			setRowConfig((prevState) => {
				const newConfig: LayoutGridProps.ResponsiveConfig | undefined =
					prevState[updatedKey] ?? (updatedKey === "offsets" ? initialOffsets : initialSpans);
				const configAtBreakpoint = newConfig?.[breakpoint];

				// Fill ColumnNumbers before update config by index
				if (configAtBreakpoint && configAtBreakpoint.length < COLUMN_COUNT) {
					for (let i = 0; i < COLUMN_COUNT - configAtBreakpoint.length; i++) {
						configAtBreakpoint.push(updatedKey === "offsets" ? 0 : 1);
					}
				}

				const newValue = configAtBreakpoint?.map((currentValue, index) =>
					index === colIndex ? (parseInt(value) as LayoutGridProps.ColumnNumber) : currentValue
				);

				if (newConfig && newValue) {
					newConfig[breakpoint] = newValue;
				}

				return {
					...prevState,
					[updatedKey]: newConfig
				};
			});
		},
		[]
	);

	const applySpansAndOffsets = useCallback((): void => {
		setRowsConfig((prevState) => {
			const result: LayoutGridProps.LayoutConfig[] = [...prevState];
			result[parseInt(selectedRow)] = rowConfig;

			return result;
		});
	}, [rowConfig, selectedRow]);

	const SpanConfiguration = useMemo(() => {
		return (
			<Column>
				<p>
					<strong>Offsets:</strong>
				</p>
				{breakpoints.map((breakpoint, index) => {
					return (
						<div className="-u-flex -u-margin-b-sm -u-items-center" key={index}>
							<strong className="-u-margin-r-xs -u-width-4">{breakpoint}</strong>
							<div className="-u-flex">
								{Array.from(new Range(initialResponsive.lg.length)).map((item, index) => {
									return (
										<Select
											key={index}
											className="-u-margin-r-xs"
											onValueChanged={(value) => {
												onConfigChanged(value, index, breakpoint, "offsets");
											}}
											value={`${rowConfig.offsets?.[breakpoint]?.[index]}`}
											items={layoutNumbers}
										/>
									);
								})}
							</div>
						</div>
					);
				})}
			</Column>
		);
	}, [breakpoints, onConfigChanged, rowConfig]);

	const OffsetConfiguration = useMemo(() => {
		return (
			<Column>
				<p>
					<strong>Spans:</strong>
				</p>
				{breakpoints.map((breakpoint, index) => {
					return (
						<div className="-u-flex -u-margin-b-sm -u-items-center" key={index}>
							<strong className="-u-margin-r-xs -u-width-4">{breakpoint}</strong>
							<div className="-u-flex">
								{Array.from(new Range(initialResponsive.lg.length)).map((item, index) => (
									<Select
										key={index}
										className="-u-margin-r-xs"
										onValueChanged={(value) => onConfigChanged(value, index, breakpoint, "spans")}
										value={`${rowConfig.spans?.[breakpoint]?.[index] ?? initialSpans[breakpoint]?.[index]}`}
										items={layoutNumbers.slice(1)}
									/>
								))}
							</div>
						</div>
					);
				})}
			</Column>
		);
	}, [breakpoints, onConfigChanged, rowConfig]);

	const renderedConfiguration = useMemo(() => {
		return (
			<div className="-u-width-full">
				<Checkbox
					checked={enableMdBreakpointConfig}
					onChange={toggleEnableMdBreakpointConfig}
					label={
						<span>
							Use <code>md</code> breakpoint (for all configuration).
						</span>
					}
					title="Config md"
				/>
				<hr />
				<div className="-u-margin-b-xl -u-flex">
					<div className="-u-margin-b-lg -u-flex-1" style={{ maxWidth: "40%" }}>
						<Grid>
							<Row layoutConfig={{ layout: { lg: [12] } }}>
								<Column>
									<p>
										<strong>Grid Layout configuration:</strong>
										<br />
										<em>Automatically apply when selected value is changed.</em>
									</p>
									{layoutConfiguration}
								</Column>
							</Row>
						</Grid>
					</div>
					<div className="-u-flex-1">
						<Grid>
							<Row layoutConfig={{ layout: { lg: [12] } }}>
								<Column>
									<p>
										<strong>Spans and Offsets configuration for each row:</strong>
										<br />
										<em>Click apply button to use new configuration.</em>
									</p>
									<Radio className="-u-margin-t-sm" value={selectedRow} inline onValueChanged={onSelectedRowChange}>
										{rows.map((row, index) => (
											<Radio.Item key={index} label={row.label} value={`${row.value}`} />
										))}
									</Radio>
								</Column>
							</Row>
							<Row layoutConfig={{ layout: { lg: [6, 6] } }}>
								{SpanConfiguration}
								{OffsetConfiguration}
							</Row>
						</Grid>
						<ButtonGroup alignment="right">
							<Button label="Apply Spans and Offsets" secondary onClick={applySpansAndOffsets} />
						</ButtonGroup>
					</div>
				</div>

				<hr />
				<ShowcaseSlider
					label="Drag this slider to directly manipulate the width in the DOM using CSS width:"
					onChange={changeWidth}
					range={{ min: 1 }}
					value={Number(sliderWidth)}
				/>
				<label className="-u-margin-r-xs">
					<strong>Current breakpoint:</strong> {breakpoint?.size || "lg"}
				</label>
			</div>
		);
	}, [
		OffsetConfiguration,
		SpanConfiguration,
		applySpansAndOffsets,
		breakpoint?.size,
		changeWidth,
		enableMdBreakpointConfig,
		layoutConfiguration,
		onSelectedRowChange,
		selectedRow,
		sliderWidth,
		toggleEnableMdBreakpointConfig
	]);

	return (
		// start code removal
		<ConfigurationView enableFullscreen configuration={renderedConfiguration}>
			<div style={{ width: `${sliderWidth}%` }}>
				<CodeSnippetGenerationWrapper
					namespaceOptions={[{ name: "LayoutGrid", subComponents: ["Row", "Grid", "Column"] }]}
				>
					<Grid onBreakPointChanged={onBreakPointChanged}>
						{rowsConfig.map((config, index) => {
							switch (index) {
								case 0:
									return (
										<Row layoutConfig={config} key={index}>
											{[1, 2, 3].map((value, i) => (
												<Column key={i}>
													<ColoredCell bgColor="#0568ae">{`F${value}`}</ColoredCell>
												</Column>
											))}
										</Row>
									);
								case 1:
									return (
										<Row layoutConfig={config} key={index}>
											{[4].map((value, i) => (
												<Column key={i}>
													<ColoredCell bgColor="#297a24">{`F${value}`}</ColoredCell>
												</Column>
											))}
										</Row>
									);
								case 2:
									return (
										<Row layoutConfig={config} key={index}>
											{[5, 6].map((value, i) => (
												<Column key={i}>
													<ColoredCell bgColor="#c91d1d">{`F${value}`}</ColoredCell>
												</Column>
											))}
										</Row>
									);
								case 3:
									return (
										<Row layoutConfig={config} key={index}>
											{[7, 8].map((value, i) => (
												<Column key={i}>
													<ColoredCell bgColor="#dba800">{`F${value}`}</ColoredCell>
												</Column>
											))}
										</Row>
									);
								default:
									return null;
							}
						})}
					</Grid>
				</CodeSnippetGenerationWrapper>
			</div>
		</ConfigurationView>
		// end code removal
	);
};
