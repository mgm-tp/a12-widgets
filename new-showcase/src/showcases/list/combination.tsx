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
import { useMemo, useCallback } from "react";
import { ThemeProvider, useTheme } from "styled-components";

import type { DeepPartial, ListConfigType } from "@com.mgmtp.a12.widgets/widgets-core";
import { Button, Icon, List, createTheme } from "@com.mgmtp.a12.widgets/widgets-core";

export function Combination(): ReactElement {
	const { colors, typography } = useTheme();

	const customTheme = useMemo(() => {
		const listConfigs: DeepPartial<ListConfigType> = {
			background: colors.background.secondaryBackground,
			dividerBorder: `1px solid ${colors.divider.colorLight}`,
			item: {
				graphic: { color: colors.highlight?.greenColor }
			},
			subHeader: {
				fontWeight: typography.fontWeight.boldFontWeight,
				fillBG: colors.highlight?.greenBackgroundLighter,
				fillColor: colors.highlight?.greenColor
			}
		};

		return createTheme({ components: { list: listConfigs } });
	}, [
		colors.background.secondaryBackground,
		colors.divider.colorLight,
		colors.highlight?.greenBackgroundLighter,
		colors.highlight?.greenColor,
		typography.fontWeight.boldFontWeight
	]);

	const onSubHeaderClick = useCallback(() => {
		alert("SubHeader is clicked");
	}, []);

	return (
		<ThemeProvider theme={customTheme}>
			<List>
				<List.SubHeader fill onClick={onSubHeaderClick} graphic={<Icon>people</Icon>} meta={<Icon>edit</Icon>}>
					Interactive items
				</List.SubHeader>
				<List.Item
					divider
					text="Project A"
					secondaryText="Has event on item"
					graphic={<Icon>account_circle</Icon>}
					meta={
						<Button
							secondary
							destructive
							title="Delete"
							icon={<Icon>delete</Icon>}
							onKeyDown={(event) => event.stopPropagation()}
						/>
					}
					onClick={() => alert("Item clicked")}
				/>
				<List.Item
					divider
					text="Project B"
					secondaryText="Has individual event on item & meta"
					graphic={<Icon>account_circle</Icon>}
					meta={
						<Button
							secondary
							destructive
							title="Delete"
							icon={<Icon>delete</Icon>}
							onClick={(event) => {
								event.stopPropagation();
								alert("Meta clicked");
							}}
							onKeyDown={(event) => event.stopPropagation()}
						/>
					}
					onClick={() => alert("Item clicked")}
				/>
				<List.SubHeader
					fill
					onClick={onSubHeaderClick}
					graphic={<Icon>people</Icon>}
					meta={<Icon>edit</Icon>}
					className="-u-margin-t-base"
				>
					Disabled items
				</List.SubHeader>
				<List.Item
					disabled
					divider
					onClick={() => alert("This should not appear")}
					text="Project C"
					secondaryText="Has event but disabled"
					graphic={<Icon>account_circle</Icon>}
					meta={<Button title="Notify" icon={<Icon>notifications</Icon>} secondary destructive disabled />}
				/>
				<List.Item
					disabled
					divider
					text="Project D"
					secondaryText="Disabled, no event"
					graphic={<Icon>account_circle</Icon>}
					meta={<Button title="Calendar" icon={<Icon>calendar_today</Icon>} secondary destructive disabled />}
				/>
				<List.SubHeader
					fill
					onClick={onSubHeaderClick}
					graphic={<Icon>people</Icon>}
					meta={<Icon>edit</Icon>}
					className="-u-margin-t-base"
				>
					Read-Only item
				</List.SubHeader>
				<List.Item
					readonly
					divider
					text="Project E"
					secondaryText="No event on item, but meta"
					graphic={<Icon>account_circle</Icon>}
					meta={<Button secondary title="Export" icon={<Icon>download</Icon>} onClick={() => alert("Meta clicked")} />}
				/>
				<List.SubHeader
					fill
					onClick={onSubHeaderClick}
					graphic={<Icon>people</Icon>}
					meta={<Icon>edit</Icon>}
					className="-u-margin-t-base"
				>
					Additional Examples
				</List.SubHeader>
				<List.Item readonly text="Custom Action Button" graphic={<Icon>info</Icon>} />
				<List.Item readonly text={<Button primary>Schedule Meeting</Button>} />
			</List>
		</ThemeProvider>
	);
}
