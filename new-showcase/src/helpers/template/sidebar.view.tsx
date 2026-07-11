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

import type { ReactElement, SyntheticEvent, ReactNode } from "react";
import { useState } from "react";
import { styled, css } from "styled-components";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";
import {
	SlidingMenu,
	Accordion,
	provider as DeviceDetector,
	AccordionDetails,
	AccordionSummaryText,
	AccordionSummary
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { SiteMapMenuItem } from "../../routes.js";

const StyledShowcaseAccordionContainer = styled(Accordion.Container)(({ theme }) => {
	const { typography, spacing } = theme;

	return css`
		padding: ${spacing.verticalSpacing.vertWhiteSpacingxl}px ${spacing.horizontalSpacing.horizWhiteSpacingxl}px 0;

		${AccordionSummaryText} {
			&:not(${AccordionDetails} ${AccordionSummaryText}) {
				font-size: ${typography.fontSize.smallFontSize};
			}
		}
		${AccordionDetails} {
			padding-left: ${spacing.horizontalSpacing.horizWhiteSpacingsm}px;
			${AccordionSummary} {
				padding-left: ${spacing.horizontalSpacing.horizWhiteSpacingsm}px;
			}
		}
	`;
});

export interface SidebarProps {
	expanded?: boolean;
	menuItems: MenuItem[];
}

export function Sidebar(props: SidebarProps): ReactElement<SidebarProps> {
	if (!DeviceDetector.isDesktop()) {
		return (
			<SlidingMenu
				id="main-application-sliding-menu"
				items={props.menuItems}
				collapsed={!props.expanded}
				key="menu"
				scrollToSelectedItem
			/>
		);
	}

	return <AccordionMenu menuItems={props.menuItems as SiteMapMenuItem[]} />;
}

interface AccordionMenuProps {
	menuItems: SiteMapMenuItem[];
}

function getInitialExpandedItems(items: SiteMapMenuItem[]): string[] {
	const expandedItems: string[] = [];
	const selectedItem = items.find((item) => !!item.selected);

	if (selectedItem) {
		expandedItems.push(selectedItem.path);

		if (selectedItem.children) {
			return expandedItems.concat(getInitialExpandedItems(selectedItem.children));
		}
	}

	return expandedItems;
}

function AccordionMenu(props: AccordionMenuProps): ReactElement<AccordionMenuProps> {
	const { menuItems } = props;
	const [prevMenuItems, setPrevMenuItems] = useState(menuItems);
	const [expandedSections, setExpandedSections] = useState<string[]>(() => getInitialExpandedItems(menuItems));

	if (menuItems !== prevMenuItems) {
		setPrevMenuItems(menuItems);
		setExpandedSections(getInitialExpandedItems(menuItems));
	}

	const onItemClick = (event: SyntheticEvent<HTMLElement>, item: SiteMapMenuItem): void => {
		if (item.onClick) {
			item.onClick(event);

			return;
		}

		if (expandedSections.find((path) => path === item.path)) {
			setExpandedSections(expandedSections.filter((path) => path !== item.path));
		} else if (!item.path.match(/\/[^/]*\/[^/]*\//)) {
			// checking if path is from a root node
			setExpandedSections([item.path]);
		} else {
			setExpandedSections([...expandedSections, item.path]);
		}
	};

	const isExpanded = (item: SiteMapMenuItem) => {
		return !!expandedSections.find((path) => path === item.path);
	};

	function recursiveMapping(items: SiteMapMenuItem[]): ReactNode[] {
		const { Summary, Details } = Accordion;

		return items.map<ReactNode>((item, index) => (
			<Accordion.Section
				expanded={isExpanded(item)}
				onClick={(event) => onItemClick(event, item)}
				key={index}
				id={item.id}
				selected={item.selected && (!item.children || !isExpanded(item))}
			>
				<Summary graphic={item.icon}>{item.label}</Summary>
				<Details>{item.children && recursiveMapping(item.children)}</Details>
			</Accordion.Section>
		));
	}

	return <StyledShowcaseAccordionContainer controlled>{recursiveMapping(menuItems)}</StyledShowcaseAccordionContainer>;
}
