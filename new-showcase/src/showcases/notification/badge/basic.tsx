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
import { useState, useCallback, useEffect } from "react";
import { styled, css } from "styled-components";

import type { MenuItem, MenuItemType, BadgeProps } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Icon, Badge, ButtonGroup, Button } from "@com.mgmtp.a12.widgets/widgets-core";

type MenuItemObj = {
	id: string;
	label: string;
	icon?: string;
	badge?: BadgeProps;
	items?: MenuItemObj[];
	title?: string;
	labelHidden?: boolean;
};
const ShowcaseButtonGroup = styled(ButtonGroup)(({ theme }) => {
	const { spacing } = theme;

	return css`
		gap: ${spacing.verticalSpacing.vertWhiteSpacingsm}px ${spacing.horizontalSpacing.horizWhiteSpacingxs}px;
	`;
});

const plainMenuItems: MenuItemObj[] = [
	{
		id: "item-1",
		label: "Tab 1",
		icon: "dvr",
		badge: {
			count: 50
		}
	},
	{
		id: "item-2",
		label: "Tab 2",
		icon: "screen_lock_portrait",
		badge: {
			count: 50,
			variant: "warning"
		}
	},
	{
		id: "item-3",
		label: "",
		icon: "email",
		title: "Email",
		labelHidden: true,
		badge: {
			count: 5,
			variant: "error"
		}
	},
	{
		id: "item-4",
		label: "Tab 4",
		badge: {
			count: 5,
			variant: "warning"
		},
		items: [
			{
				id: "item-4-1",
				label: "Tab 4.1"
			},
			{
				id: "item-4-2",
				label: "Tab 4.2",
				badge: {
					count: 5,
					variant: "warning"
				}
			},
			{
				id: "item-4-3",
				label: "Tab 4.3"
			}
		]
	},
	{
		id: "item-5",
		label: "Tab 5 Fugit corporis, quae eius elit. Explicabo laborum iaculis adipisci ducimus placeat tenetur animi",
		badge: {
			count: 12,
			variant: "success"
		}
	}
];

const mapData = (data: MenuItemObj[]): MenuItem[] => {
	return data.map((item) => {
		return {
			id: item.id,
			label: item.label,
			icon: item.icon && <Icon>{item.icon}</Icon>,
			badge: item.badge && <Badge count={item.badge.count} variant={item.badge.variant} />,
			items: item.items && mapData(item.items),
			title: item.title,
			labelHidden: item.labelHidden
		};
	});
};

const data = mapData(plainMenuItems);

function flattenMenuItems<T extends { items?: T[] }>(originalItems: T[]): T[] {
	const result: T[] = [];
	originalItems.forEach((item) => {
		if (!item.items) {
			result.push(item);
		} else {
			result.push(...flattenMenuItems<T>(item.items));
		}
	});

	return result;
}

export function BasicBadgeShowcase(): ReactElement {
	const [hideBadges, setHideBadges] = useState(false);
	const [condensedItems, setCondensedItems] = useState<number>(0);

	const onCondensed = useCallback((items: MenuItem[]) => {
		const badgeCounts: number[] = [];

		const flattenData = flattenMenuItems<MenuItemObj>(plainMenuItems);
		const flattenCondensedItems = flattenMenuItems<MenuItemType>(items);

		flattenCondensedItems.forEach((condensedItem) => {
			const desiredIdx = flattenData.findIndex((plainItem) => plainItem.id === condensedItem.id);

			if (desiredIdx > -1) {
				const count = flattenData[desiredIdx].badge?.count;

				if (count) {
					badgeCounts.push(count);
				}
			}
		});

		const totalCount = badgeCounts.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
		setCondensedItems(totalCount);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => setHideBadges((prevState) => !prevState), 5000);

		return (): void => clearInterval(interval);
	}, []);

	return (
		<div className="-u-width-full">
			<div>
				<div>
					<p>With Vertical Menu: </p>
					<div style={{ width: 300 }}>
						<FlyoutMenu
							type="vertical"
							items={data}
							onCondensed={onCondensed}
							condensedBadge={<Badge count={condensedItems} variant="info" />}
						/>
					</div>
				</div>
				<p>With Horizontal Menu: </p>
				<FlyoutMenu
					type="horizontal"
					items={data}
					onCondensed={onCondensed}
					condensedBadge={<Badge count={condensedItems} variant="info" />}
				/>
			</div>
			<div>
				<p>With Buttons: </p>
				<ShowcaseButtonGroup>
					<Button primary label="Primary" badge={<Badge variant="error" count={9} hidden={hideBadges} />} />
					<Button label="Secondary" badge={<Badge count={99} variant="success" light />} />
					<Button
						label="Custom Title"
						badge={<Badge count={10} variant="success" light title="10 unread notifications" />}
					/>
				</ShowcaseButtonGroup>
			</div>
		</div>
	);
}
