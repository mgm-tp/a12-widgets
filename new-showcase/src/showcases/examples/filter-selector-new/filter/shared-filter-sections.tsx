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

import type { ChangeEvent } from "react";
import { useState } from "react";
import { styled, css } from "styled-components";

import { TextField, TextAffix, Checkbox, Icon, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

const StyledShowMoreButton = styled.button(({ theme }) => {
	const { spacing } = theme.spacing;
	const { colors } = theme;

	return css`
		display: flex;
		align-items: center;
		gap: ${spacing.spacingXs}px;
		background: none;
		border: none;
		padding: ${spacing.spacingXs}px 0;
		cursor: pointer;
		color: ${colors.text.secondaryColorDark};
		font-size: inherit;
		font-family: inherit;

		.show-more-icon {
			font-size: 18px;
			transition: transform 0.15s;
		}

		&[aria-expanded="true"] .show-more-icon {
			transform: rotate(90deg);
		}
	`;
});

const StyledShowMoreBadge = styled.span`
	display: inline-flex;
	align-items: center;
	margin-left: 2px;
`;

const StyledPriceInputs = styled.div(({ theme }) => {
	const { spacing } = theme.spacing;

	return css`
		display: flex;
		flex-direction: column;
		gap: ${spacing.spacingSm}px;
		margin-top: ${spacing.spacingXs}px;
	`;
});

const StyledPriceRow = styled.div(({ theme }) => {
	const { spacing } = theme.spacing;

	return css`
		display: flex;
		align-items: center;
		gap: ${spacing.spacingXs}px;

		> span {
			min-width: 40px;
		}

		> div {
			flex: 1;
		}
	`;
});

export interface IsbnFilterProps {
	value: string;
	onChange: (value: string) => void;
}

export const IsbnFilterSection = ({ value, onChange }: IsbnFilterProps) => (
	<TextField
		id="isbn-filter"
		label="ISBN"
		hideLabel
		placeholder='e.g. "And then there was none"'
		value={value}
		onChange={(e: ChangeEvent<HTMLInputElement>): void => onChange(e.target.value)}
	/>
);

export interface LanguageFilterProps {
	english: boolean;
	german: boolean;
	french: boolean;
	vietnamese: boolean;
	onToggle: (language: "english" | "german" | "french" | "vietnamese") => void;
	onSelectAll: (checked: boolean | "mixed") => void;
	getCheckState: () => boolean | "mixed";
}

export const LanguageFilterSection = (props: LanguageFilterProps) => {
	const [showAll, setShowAll] = useState(false);

	const hasHiddenChecked = props.vietnamese;

	return (
		<>
			<Checkbox.Indeterminate
				id="language-all"
				label="(De)select all"
				checked={props.getCheckState()}
				onChange={props.onSelectAll}
			/>
			<Checkbox
				id="language-english"
				label="English (72)"
				checked={props.english}
				onChange={(): void => props.onToggle("english")}
			/>
			<Checkbox
				id="language-german"
				label="German (8)"
				checked={props.german}
				onChange={(): void => props.onToggle("german")}
			/>
			<Checkbox
				id="language-french"
				label="French (24)"
				checked={props.french}
				onChange={(): void => props.onToggle("french")}
			/>
			{showAll && (
				<Checkbox
					id="language-vietnamese"
					label="Vietnamese (121)"
					checked={props.vietnamese}
					onChange={(): void => props.onToggle("vietnamese")}
				/>
			)}
			<StyledShowMoreButton type="button" aria-expanded={showAll} onClick={(): void => setShowAll((prev) => !prev)}>
				<Icon className="show-more-icon">chevron_right</Icon>
				{showAll ? "Show less" : "Show more"}
				{!showAll && hasHiddenChecked && (
					<StyledShowMoreBadge>
						<Badge tiny />
					</StyledShowMoreBadge>
				)}
			</StyledShowMoreButton>
		</>
	);
};

export interface SeriesFilterProps {
	yes: boolean;
	no: boolean;
	onToggle: (which: "yes" | "no") => void;
}

export const SeriesFilterSection = (props: SeriesFilterProps) => (
	<>
		<Checkbox id="series-yes" label="Yes (154)" checked={props.yes} onChange={(): void => props.onToggle("yes")} />
		<Checkbox id="series-no" label="No (32)" checked={props.no} onChange={(): void => props.onToggle("no")} />
	</>
);

export interface PriceFilterProps {
	priceFrom: string;
	priceTo: string;
	onPriceFromChange: (value: string) => void;
	onPriceToChange: (value: string) => void;
}

export const PriceFilterSection = (props: PriceFilterProps) => (
	<>
		<StyledPriceInputs>
			<StyledPriceRow>
				<span>From</span>
				<TextField
					id="price-from"
					label="From"
					hideLabel
					value={props.priceFrom}
					onChange={(e: ChangeEvent<HTMLInputElement>): void => props.onPriceFromChange(e.target.value)}
					suffixes={<TextAffix>EUR</TextAffix>}
				/>
			</StyledPriceRow>
			<StyledPriceRow>
				<span>To</span>
				<TextField
					id="price-to"
					label="To"
					hideLabel
					value={props.priceTo}
					onChange={(e: ChangeEvent<HTMLInputElement>): void => props.onPriceToChange(e.target.value)}
					suffixes={<TextAffix>EUR</TextAffix>}
				/>
			</StyledPriceRow>
		</StyledPriceInputs>
	</>
);

export interface GenericStringFilterProps {
	id: string;
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	error?: boolean;
	errorMessage?: string;
}

export const GenericStringFilterSection = ({
	id,
	label,
	placeholder,
	value,
	onChange,
	error,
	errorMessage
}: GenericStringFilterProps) => (
	<TextField
		id={`${id}-filter`}
		label={label}
		hideLabel
		placeholder={placeholder}
		value={value}
		onChange={(e: ChangeEvent<HTMLInputElement>): void => onChange(e.target.value)}
		error={error}
		errorMessage={errorMessage}
	/>
);
