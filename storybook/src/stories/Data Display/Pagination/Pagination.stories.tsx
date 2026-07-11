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

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Pagination } from "@com.mgmtp.a12.widgets/widgets-core";

const meta: Meta<typeof Pagination> = {
	title: "Data Display/Pagination",
	component: Pagination,
	parameters: {
		layout: "padded"
	},
	tags: ["autodocs"],
	argTypes: {
		pageCount: {
			control: { type: "number", min: 1, max: 100 },
			description: "Total number of pages"
		},
		type: {
			control: "select",
			options: ["default", "simple"],
			description: "Pagination style: default shows page numbers, simple shows prev/next only"
		},
		alignment: {
			control: "select",
			options: ["left", "right"],
			description: "Horizontal alignment"
		},
		disabled: {
			control: "boolean",
			description: "Disable all pagination controls"
		}
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const PaginationExample = () => {
			const [page, setPage] = useState(1);

			return (
				<Pagination
					currentPage={page}
					pageCount={10}
					pageLabelTemplate="Page {page} of {total}"
					onPageChanged={setPage}
				/>
			);
		};

		return <PaginationExample />;
	}
};

export const Simple: Story = {
	render: () => {
		const SimplePaginationExample = () => {
			const [page, setPage] = useState(1);

			return (
				<Pagination
					currentPage={page}
					pageCount={10}
					pageLabelTemplate="Page {page} of {total}"
					type="simple"
					onPageChanged={setPage}
				/>
			);
		};

		return <SimplePaginationExample />;
	}
};

export const RightAligned: Story = {
	render: () => {
		const RightPaginationExample = () => {
			const [page, setPage] = useState(3);

			return (
				<Pagination
					currentPage={page}
					pageCount={20}
					pageLabelTemplate="Page {page} of {total}"
					alignment="right"
					onPageChanged={setPage}
				/>
			);
		};

		return <RightPaginationExample />;
	}
};

export const Disabled: Story = {
	render: () => (
		<Pagination
			currentPage={3}
			pageCount={10}
			pageLabelTemplate="Page {page} of {total}"
			disabled
			onPageChanged={() => {}}
		/>
	)
};
