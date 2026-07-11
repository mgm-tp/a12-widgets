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

import { useRef, useState } from "react";
import type { ReactElement } from "react";
import { styled, css } from "styled-components";

import {
	Button,
	ContentBox,
	ContentBoxElements,
	CssEllipsis,
	DataRoles,
	Filter,
	FilterBar,
	FilterSelector,
	Icon,
	Message
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { FilterItemData } from "@com.mgmtp.a12.widgets/widgets-core";

import { contentInContentBox } from "../filter-selector/data.js";

export const StyledFilterHeader = styled.div(({ theme }) => {
	const {
		spacing: { spacing },
		colors: { divider, text },
		components: { contentBox },
		typography: { fontSize, fontWeight }
	} = theme;

	return css`
		background-color: ${contentBox.actionBar.background};
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: ${spacing.spacingSm}px;
		border-bottom: 1px solid ${divider.color};
		[data-role="${DataRoles.Contentbox.Title}"] {
			font-size: ${fontSize.smallFontSize};
			color: ${text.color};
			font-weight: ${fontWeight.boldFontWeight};
		}
	`;
});

export const FILTER_ITEMS: FilterItemData[] = [
	{ id: "language", label: "Language", active: true, content: "Language filter content" },
	{ id: "price", label: "Price", active: true, badgeVariant: "error", content: "Price filter content" },
	{ id: "delivery", label: "Delivery", content: "Delivery filter content" },
	{ id: "genre", label: "Genre", content: "Genre filter content" },
	{ id: "format", label: "Format", content: "Format filter content" },
	{ id: "rating", label: "Rating", content: "Rating filter content" },
	{ id: "availability", label: "Availability", content: "Availability filter content" },
	{ id: "condition", label: "Condition", content: <Message>No filter available</Message> }
];

export const FilterSelectorShowcaseTemplate = ({ mode }: { mode: "docked" | "overlay" }): ReactElement => {
	const [open, setOpen] = useState(false);
	const filterButtonRef = useRef<HTMLButtonElement | null>(null);

	const getButtonRef = (ref: HTMLButtonElement | null) => {
		filterButtonRef.current = ref;
	};

	return (
		<ContentBox
			heading={
				<ContentBoxElements.Heading>
					<CssEllipsis maxLine={1}>
						<ContentBoxElements.Title text={`${mode === "docked" ? "Docked" : "Overlay"} Filter Selector`} />
					</CssEllipsis>
				</ContentBoxElements.Heading>
			}
			subHeading={
				<ContentBoxElements.SubHeading>
					<FilterBar
						compact
						actions={
							<Button
								buttonRef={getButtonRef}
								id="filter-panel-toggle"
								icon={<Icon>filter_list</Icon>}
								title={open ? "Close filter panel" : "Open filter panel"}
								onClick={() => {
									setOpen((prev) => !prev);
								}}
							/>
						}
					>
						<Filter id="language" name="Language" active options="English, German" compact nonRemovable prefix="L" />
						<Filter id="price" name="Price" active options="10 - 50" compact nonRemovable prefix="P" />
					</FilterBar>
				</ContentBoxElements.SubHeading>
			}
			sidePanels={{
				right: {
					hide: !open,
					mode: mode,
					onClose: () => setOpen(false),
					triggerReference: filterButtonRef,
					content: (
						<FilterSelector
							listMode={{
								id: `filter-list-${mode}`,
								items: FILTER_ITEMS,
								headerContent: (
									<StyledFilterHeader>
										<ContentBoxElements.Title text="Filters" />
										<Button icon={<Icon>close</Icon>} title="Close filter panel" onClick={() => setOpen(false)} />
									</StyledFilterHeader>
								)
							}}
						/>
					)
				}
			}}
			padding={false}
			style={{ height: "350px" }}
		>
			<p className="-u-padding-x-xl">{contentInContentBox}</p>
		</ContentBox>
	);
};
