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

import type { FC } from "react";
import { useMemo } from "react";
import { styled, css } from "styled-components";
import { loremIpsum } from "lorem-ipsum";

import type { BaseColumnType, TableComponentRenderers } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	ActionContentbox,
	BulletList,
	Button,
	ButtonGroup,
	Icon,
	LayoutGrid,
	Link,
	TextLineStateless,
	Typography,
	DefaultTableComponentRenderers,
	Table,
	noop
} from "@com.mgmtp.a12.widgets/widgets-core";

import { Utils } from "../../table/utils.js";
import type { UserCard } from "../../../helpers/definitions.js";

const StyledLink = styled(Link)(({ theme }) => {
	const { typography } = theme;

	return css`
		font-size: ${typography.fontSize.smallFontSize};
	`;
});
const { Grid, Row, Column } = LayoutGrid;

type RowType = UserCard;

const columns: BaseColumnType<RowType>[] = [
	{ label: "Name", dataKey: "name" },
	{
		label: (
			<Icon iconTheme="outlined" title="Email">
				email
			</Icon>
		),
		dataKey: "email"
	},
	{ label: "Address", dataKey: "address.street" },
	{
		label: (
			<Icon iconTheme="outlined" title="Phone">
				contact_phone
			</Icon>
		),
		dataKey: "phone"
	},
	{ label: "Website", dataKey: "website" },
	{ label: "", pinning: "right", actionColumn: true }
];

const data = Utils.generateUserCardData(5);

const Navigation: FC = () => {
	const componentRenderers = useMemo<Partial<TableComponentRenderers<RowType>>>(() => {
		return {
			bodyContentRenderer: (props) => {
				if (props.column.actionColumn) {
					return (
						<Button
							icon={<Icon>more_vert</Icon>}
							title="More"
							onClick={(event) => {
								event.stopPropagation();
								alert("Button was clicked");
							}}
						/>
					);
				}

				return DefaultTableComponentRenderers.bodyContentRenderer(props);
			}
		};
	}, []);

	return (
		<ActionContentbox headingElements={null} padding={false}>
			<Table<RowType> data={data} columns={columns} componentRenderers={componentRenderers} />
		</ActionContentbox>
	);
};

interface PanelProps {
	value?: string;
}

const SearchPanel: FC = () => {
	return (
		<ActionContentbox headingElements={null}>
			<Grid>
				<Row layoutConfig={{ layout: { sm: [12], md: [12], lg: [12] } }}>
					<Column>
						<TextLineStateless label="Name" value="Search" onChange={noop} />
					</Column>
				</Row>
				<Row layoutConfig={{ layout: { sm: [12, 12], md: [6, 6], lg: [6, 6] } }}>
					<Column>
						<TextLineStateless label="Data Type" value="E10" onChange={noop} />
					</Column>
					<Column>
						<TextLineStateless label="Nationality" value="German" onChange={noop} />
					</Column>
				</Row>
				<Row layoutConfig={{ layout: { sm: [12, 12], md: [6, 6], lg: [6, 6] } }}>
					<Column>
						<TextLineStateless label="Profession" value="Software" onChange={noop} />
					</Column>
					<Column>
						<TextLineStateless label="Form" value="AgB" onChange={noop} />
					</Column>
				</Row>

				<Typography.Headline ariaLevel={4} level={4} divider>
					Field-specific search options
				</Typography.Headline>
				<Row layoutConfig={{ layout: { sm: [12, 12], md: [6, 6], lg: [6, 6] } }}>
					<Column>
						<TextLineStateless label="Field name" onChange={noop} />
					</Column>
					<Column>
						<TextLineStateless label="Field type" onChange={noop} />
					</Column>
				</Row>
				<Row layoutConfig={{ layout: { sm: [12, 12], md: [6, 6], lg: [6, 6] } }}>
					<Column>
						<TextLineStateless label="Description" onChange={noop} />
					</Column>
					<Column>
						<TextLineStateless label="Internal description" onChange={noop} />
					</Column>
				</Row>

				<Row layoutConfig={{ layout: { sm: [12], md: [12], lg: [12] } }}>
					<ButtonGroup alignment="right">
						<Button label="Search" onClick={() => alert("Button was clicked")} />
					</ButtonGroup>
				</Row>
			</Grid>
		</ActionContentbox>
	);
};

const Information: FC = () => {
	return (
		<ActionContentbox headingElements={null}>
			<div>
				<p>
					This is an example that shows how to use the <code>Sidebar</code> with the{" "}
					<StyledLink href="#/widgets/navigation/tab-panel">Tab Panel</StyledLink>.
				</p>
				<p>At any given time the Sidebar can be in one of three different states:</p>
				<BulletList.Ordered>
					<BulletList.Item>Collapsed</BulletList.Item>
					<BulletList.Item>Expanded for a partial-screen view</BulletList.Item>
					<BulletList.Item>Expanded for a full-screen view</BulletList.Item>
				</BulletList.Ordered>
				<p>
					The <code>subExpanded</code> property is used to expand or collapse the Sidebar.
				</p>
				<p>
					In this example, you can expand the SideBar by selecting a tab, and collapse it by clicking the close button
					or deselecting the currently selected tab.
				</p>
				<p>
					You can use the <code>subExpandedState</code> property to dictate whether the Sidebar takes up only part of
					the screen, or expands to fill the entire screen.
				</p>
				<p>
					You can see an example of how this works by clicking the minimize/maximize button located in the header of the
					panel.
				</p>
			</div>
		</ActionContentbox>
	);
};

const DraftContent: FC = () => {
	return (
		<ActionContentbox headingElements={null}>
			<div>
				<p>
					The following paragraph contains placeholder text designed to demonstrate the appearance and functionality of
					the content within the tab panel.
				</p>
				<p>{loremIpsum({ count: 100 })}</p>
			</div>
		</ActionContentbox>
	);
};

export const Panel: FC<PanelProps> = (props: PanelProps) => {
	if (props.value === "information") {
		return <Information />;
	}

	if (props.value === "search") {
		return <SearchPanel />;
	}

	if (props.value === "navigation") {
		return <Navigation />;
	}

	return <DraftContent />;
};
