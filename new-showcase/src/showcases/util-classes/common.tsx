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

import { Range } from "@com.mgmtp.a12.widgets/widgets-core";

export interface FlexBoxCommonShowcaseProps {
	setVertical?: boolean;
	flexWrapperUtilityClass: string;
	flexItemUtilityClass?: string;
}

export const FlexBoxCommonShowcase = (props: FlexBoxCommonShowcaseProps): ReactElement => {
	const vertical = props.setVertical ? "-sc-helper-flexbox--vertical" : "";
	const flexItemClass = props.flexItemUtilityClass || "";

	return (
		<div className={`-sc-helper-flexbox ${vertical}`} style={{ margin: "0 auto" }}>
			<div className={`-u-flex ${props.flexWrapperUtilityClass} -sc-helper-flexbox__container`}>
				<div className={`${flexItemClass} -sc-helper-flexbox__item`}>1</div>
				<div className="-sc-helper-flexbox__item">2</div>
				<div className="-sc-helper-flexbox__item">3</div>
			</div>
		</div>
	);
};

export interface FlexBoxCommonShowcaseForArrayItemsProps {
	setVertical?: boolean;
	flexWrapperUtilityClass?: string;
	alignContentUtilityClass?: string;
	amountOfBox?: number;
}

export function FlexBoxCommonShowcaseForArrayItems(props: FlexBoxCommonShowcaseForArrayItemsProps): ReactElement {
	const verticalClass = props.setVertical ? "-sc-helper-flexbox--vertical" : "";
	const flexWrapClass = props.flexWrapperUtilityClass || "-u-flex-wrap";
	const alignContentClass = props.alignContentUtilityClass || "";

	return (
		<div className={`-sc-helper-flexbox ${verticalClass}`} style={{ margin: "0 auto" }}>
			<div className={`-u-flex ${flexWrapClass} ${alignContentClass} -sc-helper-flexbox__container`}>
				{Array.from(new Range(15)).map((index) => {
					return (
						<div key={index} className="-sc-helper-flexbox__item">
							{index + 1}
						</div>
					);
				})}
			</div>
		</div>
	);
}
