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

import type { FC, ChangeEvent, ReactNode } from "react";
import { useState, useCallback, useMemo } from "react";
import { loremIpsum } from "lorem-ipsum";
import { styled, css } from "styled-components";

import type { LayoutGridProps, SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	Pagination,
	Select,
	CssEllipsis,
	LayoutGrid,
	SizeContext,
	Card,
	ResponsiveImageContainer,
	ActionContentbox,
	ContentBoxElements,
	SubActionBarTpl,
	Button,
	Icon,
	TextField,
	noop
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ShowcaseSlider } from "../../../helpers/showcase-slider.js";

const IMAGES = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg"];

const { Grid, Row, Column } = LayoutGrid;

const GalleryRow = styled(Row)(({ theme }) => {
	const { spacing, colors } = theme;

	return css`
		overflow: hidden;
		margin: ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0;
		border-bottom: 1px solid ${colors.divider.colorDark};
	`;
});

const GalleryColumn = styled(Column)(({ theme }) => {
	const { spacing } = theme;

	return css`
		padding-bottom: ${spacing.verticalSpacing.vertWhiteSpacingsm}px;
	`;
});

const GalleryActionBar = styled(Row)(({ theme }) => {
	const { spacing } = theme;

	return css`
		align-items: center;
		margin-bottom: 0;
		& > * {
			margin: 0;
		}
		[data-role="button"] {
			&:not(:last-child) {
				margin: 0 ${spacing.horizontalSpacing.horizWhiteSpacing3xs}px 0 0;
			}
		}

		[data-role="plasma-icon"] {
			display: flex;
			justify-content: center;
		}
	`;
});

const PRODUCTS_COUNT = 30;
const PRICES = Array.from(Array(PRODUCTS_COUNT)).map(() => Math.round(Math.random() * 100));
const STARS = Array.from(Array(PRODUCTS_COUNT)).map(() => {
	const starsCount = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
	const emptyStarsCount = 5 - starsCount;

	return (
		<>
			{Array.from(Array(starsCount)).map((_, i) => (
				<Icon key={i}>star</Icon>
			))}
			{Array.from(Array(emptyStarsCount)).map((_, i) => (
				<Icon key={i}>star_border</Icon>
			))}
		</>
	);
});

const MAX_HEIGHT = 300;
const MIN_HEIGHT = 60;

export const GalleryExample: FC = () => {
	const [height, setHeight] = useState(350);
	const [showSelect, setShowSelect] = useState(false);
	const [showSlider, setShowSlider] = useState(false);
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [breakpointSize, setBreakpointSize] = useState<SizeDetectorProps.Size>("lg");

	const onHeightSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		setHeight(parseFloat(event.target.value));
	}, []);

	const onBreakPointChanged = useCallback((breakpoint: SizeDetectorProps.BreakPoint): void => {
		setBreakpointSize(breakpoint.size);
	}, []);

	const subBarSelect = useMemo(
		() => (
			<Select
				items={[
					{ label: "Option 1", value: "Value_1" },
					{ label: "Option 2", value: "Value_2" },
					{ label: "Option 3", value: "Value_3" }
				]}
			/>
		),
		[]
	);
	const slider = useMemo(
		() => (
			<ShowcaseSlider
				noMargin
				label={
					<>
						<strong>Height range of Preview Area:</strong> min: {MIN_HEIGHT}px, max: {MAX_HEIGHT}px
					</>
				}
				value={height}
				onChange={onHeightSliderChange}
				range={{ min: MIN_HEIGHT, max: MAX_HEIGHT }}
			/>
		),
		[height, onHeightSliderChange]
	);
	const searchBar = useMemo(
		() => (
			<>
				<TextField
					suffixes={<Icon>search</Icon>}
					placeholder="Search"
					onChange={() => undefined}
					className="-u-flex-shrink"
				/>
				<Button icon={<Icon>filter_list</Icon>} title="Filter" />
				<Button
					icon={<Icon>view_list</Icon>}
					secondary
					title="Switch to table view"
					style={{ display: "inline-table" }}
				/>
			</>
		),
		[]
	);

	const galleryGrid = useMemo((): ReactNode => {
		const gridSize: LayoutGridProps.ColumnSize = { sm: 6, md: 4, lg: 2 };
		const sizeOfColumn = breakpointSize && breakpointSize !== "xs" ? gridSize[breakpointSize] : 12;
		const itemsPerRow = 12 / (sizeOfColumn || 12);
		const totalRows = PRODUCTS_COUNT / itemsPerRow;

		return (
			<Grid onBreakPointChanged={onBreakPointChanged} fitToParent={false} noGutter={false}>
				{Array.from(Array(totalRows)).map((_, j) => (
					<GalleryRow key={j} role="list">
						{Array.from(Array(itemsPerRow)).map((_, i) => (
							<GalleryColumn key={itemsPerRow * j + i} size={gridSize} role="listitem">
								<Card>
									<Card.ActionArea>
										<Card.Media style={{ height }}>
											<ResponsiveImageContainer src={`images/${IMAGES[(itemsPerRow * j + i) % IMAGES.length]}`} />
										</Card.Media>
										<Card.Content>
											<CssEllipsis style={{ fontWeight: "bold" }} maxLine={4}>
												{loremIpsum({
													units: "sentences",
													count: Math.round(Math.random() * 10)
												})}
											</CssEllipsis>
										</Card.Content>
										<Card.Content className="-u-flex -u-items-center">{PRICES[i]}$/1kg</Card.Content>
										<Card.Content className="-u-flex -u-items-center">{STARS[i]}</Card.Content>
									</Card.ActionArea>
								</Card>
							</GalleryColumn>
						))}
					</GalleryRow>
				))}
			</Grid>
		);
	}, [breakpointSize, height, onBreakPointChanged]);

	return (
		<SizeContext.Consumer>
			{(value) => {
				const isSmSize = value.currentSize === "sm" || value.currentSize === "xs";

				return (
					<ActionContentbox
						headingElements={<ContentBoxElements.Title text="Gallery Example" />}
						headingButtons={
							isSmSize && (
								<>
									<ContentBoxElements.HeadingAddon>
										<Button
											invert
											icon={<Icon>check_box</Icon>}
											active={showSelect}
											title="Options"
											onClick={() => setShowSelect((prevState) => !prevState)}
										/>
									</ContentBoxElements.HeadingAddon>
									<ContentBoxElements.HeadingAddon>
										<Button
											invert
											icon={<Icon>height</Icon>}
											active={showSlider}
											title="Slider"
											onClick={() => setShowSlider((prevState) => !prevState)}
										/>
									</ContentBoxElements.HeadingAddon>
									<ContentBoxElements.HeadingAddon>
										<Button
											invert
											icon={<Icon>search</Icon>}
											active={showSearchBar}
											title="Search Bar"
											onClick={() => setShowSearchBar((prevState) => !prevState)}
										/>
									</ContentBoxElements.HeadingAddon>
								</>
							)
						}
						footer={
							<ContentBoxElements.Footer>
								<Pagination
									currentPage={1}
									onPageChanged={noop}
									pageCount={10}
									pageLabelTemplate="{page} / {total}"
									alignment="right"
								/>
							</ContentBoxElements.Footer>
						}
						subActionBar={
							isSmSize ? (
								<>
									<SubActionBarTpl hidden={!showSelect}>{subBarSelect}</SubActionBarTpl>
									<SubActionBarTpl hidden={!showSlider}>{slider}</SubActionBarTpl>
									<SubActionBarTpl hidden={!showSearchBar}>
										<div className="-u-flex">{searchBar}</div>
									</SubActionBarTpl>
								</>
							) : (
								<SubActionBarTpl>
									<Grid>
										<GalleryActionBar verticalAlignment="middle">
											<Column size={{ sm: 12, md: 12, lg: 2 }}>{subBarSelect}</Column>
											<Column size={{ sm: 12, md: 6, lg: 5 }} style={{ margin: "5px 0" }}>
												{slider}
											</Column>
											<Column size={{ sm: 12, md: 6, lg: 5 }} className="-u-flex -u-items-center">
												{searchBar}
											</Column>
										</GalleryActionBar>
									</Grid>
								</SubActionBarTpl>
							)
						}
					>
						{galleryGrid}
					</ActionContentbox>
				);
			}}
		</SizeContext.Consumer>
	);
};
