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
import { useState, useEffect } from "react";
import { useTheme } from "styled-components";

import { LayoutGrid, TextField, TextAffix, HintTooltip, SpacingConfig } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

const { Grid, Column, Row } = LayoutGrid;

export function SpacingShowcase() {
	const spacing = useTheme().spacing;
	const [baseSpacing, setBaseSpacing] = useState(spacing.baseSpacing.BASE);

	const handleSpacingChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setBaseSpacing(parseInt(event.target.value, 10) || 0);
	};

	useEffect(() => {
		setBaseSpacing(spacing.baseSpacing.BASE);
	}, [spacing]);

	return (
		<ConfigurationView
			reportLabel="spacing"
			configuration={
				<TextField
					fitToParent={false}
					label={<code>BaseSpacingConfig.BASE</code>}
					value={`${baseSpacing}`}
					onChange={handleSpacingChange}
					suffixes={<TextAffix>px</TextAffix>}
					addonAfter={
						<HintTooltip text="Change the value of this input to see how changing the value of this spacing variable changes the examples below." />
					}
				/>
			}
		>
			<Grid>
				<Row>
					<Column size={{ sm: 12, md: 12, lg: 12 }}>
						{Object.keys(spacing.spacing).map((item, index) => (
							<div key={index} className="-u-flex -u-flex-wrap -u-margin-b-sm">
								<div className="-u-flex-no-shrink -u-font-semibold" style={{ width: "14.5rem" }}>
									<div>{`spacing.spacing.${item}`}</div>
									<div>{(SpacingConfig(baseSpacing) as any)[item]}px</div>
								</div>
								<div
									className="-u-background-blue -u-flex-no-shrink -u-height-10"
									style={{ width: (SpacingConfig(baseSpacing) as any)[item] }}
								/>
							</div>
						))}
					</Column>
				</Row>
			</Grid>
		</ConfigurationView>
	);
}
