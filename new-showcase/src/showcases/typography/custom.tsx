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
import { useState } from "react";
import { loremIpsum } from "lorem-ipsum";

import { Typography, Icon } from "@com.mgmtp.a12.widgets/widgets-core";

import { fixedRandomNumber } from "../../helpers/utils.js";

import { Multilingual } from "../pop-up-menu/multilingual.js";

const { Body, Headline, Section } = Typography;

const collapseIcon = <Icon>add</Icon>;
const expandIcon = <Icon>remove</Icon>;

export function CustomTypographyShowcase(): ReactElement<{}> {
	const [collapsed, setCollapsed] = useState(true);
	const [collapsed2, setCollapsed2] = useState(true);

	const handleCollapsingChange = (): void => {
		setCollapsed((prevCollapsed) => !prevCollapsed);
	};

	const handleCollapsingChange2 = (): void => {
		setCollapsed2((prevCollapsed) => !prevCollapsed);
	};

	return (
		<Section>
			<Headline level={1} htmlTag="h1" divider addons={<Multilingual />}>
				Headline 1 using h1 tag
			</Headline>
			<Headline level={2} ariaLevel={2} htmlTag="section" divider addons={<Multilingual />}>
				Headline 2 using section tag
			</Headline>
			<Headline
				level={3}
				ariaLevel={3}
				divider
				collapsible
				collapsed={collapsed}
				onCollapsingChange={handleCollapsingChange}
				addons={<Multilingual />}
			>
				Collapsible Headline 3
			</Headline>
			{!collapsed && <Body>{loremIpsum({ units: "sentences", count: 10, random: fixedRandomNumber() })}</Body>}
			<Headline
				level={4}
				ariaLevel={4}
				divider
				info="With custom collapse/expand icons"
				collapsible
				collapsed={collapsed2}
				collapseIcon={collapseIcon}
				expandIcon={expandIcon}
				onCollapsingChange={handleCollapsingChange2}
				addons={<Multilingual />}
			>
				Collapsible Headline 4
			</Headline>
			{!collapsed2 && <Body>{loremIpsum({ units: "sentences", count: 10, random: fixedRandomNumber() })}</Body>}
			<Headline level={5} ariaLevel={5} divider addons={<Multilingual />}>
				Headline 5 with long title lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua
			</Headline>
		</Section>
	);
}
