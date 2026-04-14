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

import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import { FlyoutMenu, Button, ButtonGroup, Icon, Badge } from "@com.mgmtp.a12.widgets/widgets-core";

function createMenuItems(): MenuItem[] {
	return [
		{
			label: "Tab 1",
			icon: <Icon>dvr</Icon>,
			badge: <Badge tiny />,
			title: "Tab 1"
		},
		{
			label: "Tab 2",
			icon: <Icon>screen_lock_portrait</Icon>,
			badge: <Badge tiny variant="success" />,
			title: "Tab 2"
		},
		{
			label: "Tab 3",
			icon: <Icon>mail_outline</Icon>,
			badge: <Badge tiny variant="warning" />,
			title: "Tab 3"
		},
		{
			label: "Tab 4",
			badge: <Badge tiny variant="error" />,
			title: "Tab 4"
		}
	];
}

function createHorizontalMenuItems(): MenuItem[] {
	return [
		{
			label: "Tab 1",
			icon: <Icon>dvr</Icon>,
			badge: <Badge tiny />
		},
		{
			label: "Tab 2",
			icon: <Icon>screen_lock_portrait</Icon>,
			badge: <Badge tiny variant="success" />
		},
		{
			label: "",
			icon: <Icon>mail</Icon>,
			badge: <Badge tiny variant="warning" />,
			title: "Tab 3"
		},
		{
			label: "Tab 4",
			badge: <Badge tiny variant="error" />
		}
	];
}

const horizontalItems = createHorizontalMenuItems();
const verticalItems = createMenuItems();

export function TinyBadgeShowcase(): ReactNode {
	const [hideBadges, setHideBadges] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => setHideBadges((prevState) => !prevState), 5000);

		return (): void => clearInterval(interval);
	}, []);

	return (
		<div className="-u-width-full">
			<div>
				<p>With Flyout Vertical Menu:</p>
				<FlyoutMenu type="vertical" items={verticalItems} collapsed style={{ width: "fit-content" }} />
			</div>
			<div>
				<p>With Horizontal Menu:</p>
				<FlyoutMenu type="horizontal" items={horizontalItems} />
			</div>
			<div>
				<p>With Buttons:</p>
				<ButtonGroup>
					<Button primary label="Primary" badge={<Badge variant="error" tiny hidden={hideBadges} />} />
					<Button label="Secondary" badge={<Badge tiny variant="success" light />} />
				</ButtonGroup>
			</div>
			<div>
				<p>With Icon Buttons:</p>
				<ButtonGroup>
					<Button icon={<Icon>search</Icon>} title="Default" badge={<Badge tiny />} />
					<Button
						secondary
						icon={<Icon>mail_outline</Icon>}
						title="Secondary icon button"
						badge={<Badge tiny variant="success" />}
					/>
					<Button
						destructive
						primary
						icon={<Icon>delete</Icon>}
						title="Primary destructive icon button"
						badge={<Badge tiny variant="warning" />}
					/>
					<Button
						secondary
						disabled
						icon={<Icon>get_app</Icon>}
						title="Secondary disabled icon button"
						badge={<Badge tiny variant="error" />}
					/>
				</ButtonGroup>
			</div>
		</div>
	);
}
