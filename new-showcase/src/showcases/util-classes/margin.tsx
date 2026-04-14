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
import { useState, useCallback, useMemo } from "react";

import { Checkbox, Select, joinClassNames } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const DIRECTION_LIST = [
	{ label: "top", value: "-t" },
	{ label: "right", value: "-r" },
	{ label: "bottom", value: "-b" },
	{ label: "left", value: "-l" },
	{ label: "horizontal", value: "-x" },
	{ label: "vertical", value: "-y" },
	{ label: "all sides", value: "" }
];

const SPACING_LIST = [
	"base",
	"0",
	"3xs",
	"2xs",
	"xs",
	"sm",
	"md",
	"lg",
	"xl",
	"2xl",
	"3xl",
	"4xl",
	"5xl",
	"6xl",
	"auto"
].map((value) => ({
	label: value,
	value
}));

export function MarginUtilClassShowcase(): ReactElement {
	const [direction, setDirection] = useState(DIRECTION_LIST[0]);
	const [spacing, setSpacing] = useState(SPACING_LIST[0]);
	const [negative, setNegative] = useState(false);

	const onChangeSpacing = useCallback((value: string) => {
		const spacing = SPACING_LIST.find((s) => s.value === value) || SPACING_LIST[0];
		setSpacing(spacing);
	}, []);

	const onChangeDirection = useCallback((value: string) => {
		const direction = DIRECTION_LIST.find((d) => d.value === value) || DIRECTION_LIST[0];
		setDirection(direction);
	}, []);

	const utilClass = useMemo((): string => {
		const isNegative = negative && spacing.value !== "auto" ? "negative-" : "";
		const directionVal = direction.value;
		const spacingVal = spacing.value;

		return `-u-${isNegative}margin${directionVal}-${spacingVal}`;
	}, [direction.value, negative, spacing.value]);

	const wrapperClasses = useMemo(() => {
		return joinClassNames(
			"-sc-margin__wrapper",
			{ "-sc-margin__wrapper--negative": negative && spacing.value !== "auto" },
			{ "-sc-margin__wrapper--auto": spacing.value === "auto" }
		);
	}, [negative, spacing.value]);

	const contentClasses = joinClassNames(utilClass, "-sc-margin__content");

	return (
		<ConfigurationView
			configuration={
				<div className="-u-flex -u-flex-col">
					<Checkbox
						label="Negative Margin"
						fitToParent={false}
						onChange={setNegative}
						checked={negative && spacing.value !== "auto"}
						disabled={spacing.value === "auto"}
					/>
					<div>
						<Select
							className="-u-margin-r-md"
							label="Direction"
							fitToParent={false}
							onValueChanged={onChangeDirection}
							value={direction.value}
							items={DIRECTION_LIST}
						/>
						<Select
							className="-u-margin-r-md"
							label="Spacing Value"
							fitToParent={false}
							onValueChanged={onChangeSpacing}
							value={spacing.value}
							items={SPACING_LIST}
						/>
					</div>
					<p>
						<strong>Utility class</strong>:&nbsp;
						<code>{utilClass}</code>
					</p>
				</div>
			}
		>
			<div className={wrapperClasses}>
				<div className={contentClasses}>
					<span className="-u-align-middle">Content</span>
				</div>
			</div>
		</ConfigurationView>
	);
}
