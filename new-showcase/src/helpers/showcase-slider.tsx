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

import type { ReactNode, ChangeEvent, ReactElement } from "react";
import { styled, css } from "styled-components";
import { setLightness } from "polished";

import type { Identifiable, Styleable } from "@com.mgmtp.a12.widgets/widgets-core";
import { Label, generateUid } from "@com.mgmtp.a12.widgets/widgets-core";

const sliderTrack = css`
	height: 6px;
	cursor: pointer;
	background-color: ${({ theme }) => theme.colors.highlightColor};
	border-radius: 4px;
`;

const sliderThumb = css`
	border: 1px solid ${({ theme }) => theme.colors.highlightColor};
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background-color: ${({ theme }) => setLightness(0.8, theme.colors.highlightColor)};
	cursor: pointer;
`;

const StyledSliderShowcase = styled.input(({ theme }) => {
	return css`
		-webkit-appearance: ${theme.colors.highlightColor};
		background-color: transparent;
		min-height: 20px;
		padding: 0;
		width: 100%;
		max-width: 400px;

		&::-webkit-slider-runnable-track {
			${sliderTrack}
		}

		&::-webkit-slider-thumb {
			${sliderThumb};
			margin-top: -5px;
			-webkit-appearance: none;
		}

		&::-moz-range-track {
			${sliderTrack}
			outline: 1px solid transparent;
		}

		&::-moz-range-thumb {
			${sliderThumb}
		}

		&::-moz-focus-outer {
			border: 0;
		}
	`;
});

interface ShowcaseSliderProps extends Styleable, Identifiable {
	defaultValue?: number;
	value?: number;
	range?: {
		min?: number;
		max?: number;
		step?: number;
	};
	name?: string;
	label?: ReactNode;
	onChange(event: ChangeEvent<HTMLInputElement>): void;
	noMargin?: boolean;
}

export function ShowcaseSlider(props: ShowcaseSliderProps): ReactElement<ShowcaseSliderProps> {
	const { label, onChange, range = {}, id, className, value, defaultValue, name, style } = props;
	const realID = id ?? generateUid();

	return (
		<div data-role="showcase-slider" className={className} style={style}>
			{label && <Label label={label} htmlFor={realID} dataRole="showcase-slider-label" />}
			<StyledSliderShowcase
				name={name}
				id={realID}
				className="-u-block"
				data-role="showcase-slider-input"
				type="range"
				min={range.min ?? "0"}
				max={range.max ?? "100"}
				defaultValue={!value ? (defaultValue ?? "100") : undefined}
				value={value}
				step={range.step ?? "1"}
				onChange={onChange}
			/>
		</div>
	);
}
