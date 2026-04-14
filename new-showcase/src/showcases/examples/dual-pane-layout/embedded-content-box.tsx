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

import type { Styleable, FilterProps } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	noop,
	Icon,
	Button,
	Counter,
	Filter,
	FilterBar,
	Pagination,
	TextField,
	ActionContentbox,
	ContentBoxElements
} from "@com.mgmtp.a12.widgets/widgets-core";

import { TableData } from "./table-data.js";

const filterPropsList: FilterProps[] = [
	{
		id: "inactive-filter",
		name: "Letters with descenders",
		options: "Inactive"
	},
	{
		id: "category-filter",
		name: "Category",
		active: true,
		options: ["Blue", "Red", "White", "Black"]
	},
	{
		id: "genre-filter",
		name: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor",
		active: true,
		options: ["Action", "Adventure", "Animated", "Comedy", "Documentary", "Horror"]
	},
	{
		id: "date-time-filter",
		name: "DateTime",
		active: true,
		options: "09/02/2018 08:28 AM - 09/26/2018 06:20 PM"
	}
];

function Footer(props: { hasPagination?: boolean }): ReactElement {
	return (
		<ContentBoxElements.Footer>
			{props.hasPagination && (
				<Pagination
					alignment="right"
					currentPage={2}
					onPageChanged={noop}
					pageCount={5}
					pageLabelTemplate="{page} / {total}"
				/>
			)}
		</ContentBoxElements.Footer>
	);
}

interface EmbeddedContentBoxProps extends Styleable {
	title: string;
	right?: boolean;
}

export function EmbeddedContentBox(props: EmbeddedContentBoxProps): ReactElement<EmbeddedContentBoxProps> {
	return (
		<ActionContentbox
			embedded
			className={props.className}
			subActionBar={
				!props.right ? (
					<div className="-u-flex -u-flex-row -u-justify-end -u-items-center">
						<TextField fitToParent={false} suffixes={<Icon>search</Icon>} placeholder="Search" onChange={noop} />
						<Button icon={<Icon>filter_list</Icon>} title="Filter" />
					</div>
				) : (
					<FilterBar initialCollapsed>
						{filterPropsList.map((item, index) => {
							return <Filter {...item} key={index} />;
						})}
					</FilterBar>
				)
			}
			footer={<Footer hasPagination={!props.right} />}
			headingElements={
				<ContentBoxElements.Title
					text={
						<>
							{props.title}
							{props.right && (
								<>
									<Counter
										value={6}
										addonAfter={<Icon>done</Icon>}
										type="constructive"
										className="-u-margin-l-2xs"
										hiddenDescription="New:"
									/>
									<Counter
										value={4}
										addonAfter={<Icon>delete</Icon>}
										type="destructive"
										className="-u-margin-l-2xs"
										hiddenDescription="Deleted:"
									/>
								</>
							)}
						</>
					}
					ariaLevel={2}
				/>
			}
			padding={false}
		>
			<TableData right={props.right} />
		</ActionContentbox>
	);
}
