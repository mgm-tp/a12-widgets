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

import type { ChangeEvent, KeyboardEvent } from "react";
import { useState, useEffect } from "react";
import { useTheme } from "styled-components";
import { Key } from "ts-key-enum";

import type { FontSize } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	LayoutGrid,
	TextLineStateless,
	TextAffix,
	HintTooltip,
	createFontSizeConfig
} from "@com.mgmtp.a12.widgets/widgets-core";

const { Grid, Column, Row } = LayoutGrid;

export const FontSizeShowcaseContent = () => {
	const { typography } = useTheme();
	const [baseFontSize, setBaseFontSize] = useState(typography.font.BASE_FONT_SIZE);
	const [temporaryBaseFontSize, setTemporaryBaseFontSize] = useState(`${typography.font.BASE_FONT_SIZE}`);

	const handleFontSizeChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setTemporaryBaseFontSize(event.target.value);
	};

	const handleFontSizeSubmit = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === Key.Enter) {
			setBaseFontSize(parseFloat(temporaryBaseFontSize) || 0);
		}
	};

	useEffect(() => {
		setBaseFontSize(typography.font.BASE_FONT_SIZE);
	}, [typography]);

	return (
		<Grid>
			<Row>
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					<p>
						<strong>Font Size</strong> is used to define the font size of an element.
					</p>
					It is calculated based on <code>typography.font.BASE_FONT_SIZE</code>:&nbsp;&nbsp;
					<TextLineStateless
						fitToParent={false}
						value={temporaryBaseFontSize}
						onChange={handleFontSizeChange}
						onKeyDown={handleFontSizeSubmit}
						suffixes={<TextAffix>rem</TextAffix>}
						addonAfter={
							<HintTooltip text="Change value of this input to see how the font size variables changed on below examples" />
						}
					/>
				</Column>
			</Row>
			<Row>
				<Column size={{ sm: 12, md: 12, lg: 12 }}>
					{Object.keys(typography.fontSize).map((item, index) => (
						<div key={index} className="-u-flex -u-flex-wrap -u-margin-b-sm">
							<div className="-u-flex-no-shrink -u-font-semibold" style={{ width: "19.5rem" }}>
								<div>{`typography.fontSize.${item}`}</div>
								<div>{createFontSizeConfig(baseFontSize)[item as keyof FontSize]}</div>
							</div>
							<div
								className="-u-background-blue -u-flex-no-shrink -u-text-white -u-items-center -u-flex -u-padding-x-md"
								style={{
									fontSize: createFontSizeConfig(baseFontSize)[item as keyof FontSize]
								}}
							>
								A12 Widgets
							</div>
						</div>
					))}
				</Column>
			</Row>
		</Grid>
	);
};
