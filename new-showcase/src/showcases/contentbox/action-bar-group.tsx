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
import type { ReactElement } from "react";
import { useContext, useMemo } from "react";

import {
	Button,
	noop,
	provider,
	ActionContentbox,
	ContentBoxElements,
	Counter,
	Icon,
	TextField,
	Link
} from "@com.mgmtp.a12.widgets/widgets-core";

import { ThemeContext } from "../../helpers/theme-selector.js";

const content = (): string => loremIpsum({ units: "sentences", count: 10 });

export function ActionBarGroupContentBox(): ReactElement {
	const isMobile = provider.isPhone();
	const { theme } = useContext(ThemeContext);
	const isFlatTheme = theme.includes("flat");

	const { ActionBarGroupArea, ActionBarGroup, ActionBarGroupDivider } = ContentBoxElements;

	const subActionBar = useMemo(
		() => (
			<ActionBarGroupArea
				leftSlot={[
					<ActionBarGroup key="1">
						<TextField
							onChange={noop}
							key="search"
							placeholder="Search"
							label="Search with hidden label"
							hideLabel
							suffixes={
								<Button
									icon={<Icon>search</Icon>}
									title="Search"
									onClick={() => {
										alert("Search button clicked");
									}}
								/>
							}
						/>
						<Button secondary icon={<Icon>filter_list</Icon>} title="Filter" />
					</ActionBarGroup>,
					<ActionBarGroupDivider key="2" />,
					<ActionBarGroup key="3">
						<ActionBarGroup role="toolbar">
							<Button secondary icon={<Icon>file_copy</Icon>} title="Copy" />
							<Button
								icon={<Icon>format_list_bulleted</Icon>}
								title="List"
								label={<Counter value={23} type="constructive" />}
							/>
							<ActionBarGroupDivider />
							<Button secondary label="Action" />
						</ActionBarGroup>
					</ActionBarGroup>
				]}
				rightSlot={[
					<ActionBarGroup key="6">
						<Button secondary icon={<Icon>refresh</Icon>} title="Refresh" />
					</ActionBarGroup>,
					<ActionBarGroupDivider key="7" />,
					<ActionBarGroup key="8">
						<Button icon={<Icon>edit</Icon>} disabled title="Edit" />
					</ActionBarGroup>
				]}
			/>
		),
		[ActionBarGroup, ActionBarGroupArea, ActionBarGroupDivider]
	);

	return (
		<ActionContentbox
			footer={<ContentBoxElements.Footer />}
			headingPrefixes={isMobile && <ContentBoxElements.BackButton />}
			headingElements={<ContentBoxElements.Title ariaLevel={2} key="title" text="Content box with group ActionBar" />}
			headingButtons={!isMobile && <ContentBoxElements.CloseButton />}
			subActionBar={subActionBar}
		>
			<p className={isFlatTheme ? "-u-margin-t-0" : undefined}>
				Check out <Link href="#/examples/multiselect-table">Multiselect Table Examples</Link> to see use case of
				ActionBarGroup.
			</p>
			<p>{content()}</p>
		</ActionContentbox>
	);
}
