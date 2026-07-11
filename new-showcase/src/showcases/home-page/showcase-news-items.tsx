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
import { styled, css } from "styled-components";

import { Link, ResponsiveImageContainer, Icon, Typography } from "@com.mgmtp.a12.widgets/widgets-core";
import { NewsBox } from "@com.mgmtp.a12.widgets/widgets-utils";

interface NewsFooterProps {
	anchorText?: string;
	href?: string;
}

const StyledLink = styled(Link)(() => {
	return css`
		width: fit-content;
		font-weight: 600;
	`;
});

function NewsFooter(props: NewsFooterProps): ReactElement<string> {
	return (
		<StyledLink href={props?.href}>
			<Icon className="-u-margin-r-sm" size="big" title="Arrow Forward">
				arrow_forward
			</Icon>
			{props?.anchorText}
		</StyledLink>
	);
}

export function NewsItems(): ReactElement {
	return (
		<>
			<NewsBox
				image={<ResponsiveImageContainer src="images/news-sample.jpg" alt="Base Theme" title="Base Theme" />}
				header={
					<Typography.Headline level={3} ariaLevel={3}>
						Base Theme
					</Typography.Headline>
				}
				content="The new Base Theme introduces a clean three-layer architecture — Application, Semantic, and Widget — that makes theming straightforward with minimal token changes. Override a single color, spacing unit, or border scale and watch it propagate automatically to every widget."
				footer={<NewsFooter href="#/basics/theme/base-theme" anchorText="Learn More" />}
				info={<div>08.06.2026</div>}
			/>
			<NewsBox
				image={<ResponsiveImageContainer src="images/news-sample-landscape.jpg" alt="Calendar" title="Calendar" />}
				header={
					<Typography.Headline level={3} ariaLevel={3}>
						Calendar
					</Typography.Headline>
				}
				content="Stay organized with our Calendar widget. View and manage events with an intuitive interface that supports multiple views and seamless navigation. Perfect for scheduling, planning, and keeping track of important dates."
				footer={<NewsFooter href="#/experimental/calendar" anchorText="Learn More" />}
				info={<div>09.02.2026</div>}
			/>
			<NewsBox
				image={
					<ResponsiveImageContainer src="images/news-sample.jpg" alt="Interaction Hint" title="Interaction Hint" />
				}
				header={
					<Typography.Headline level={3} ariaLevel={3}>
						Interaction Hint
					</Typography.Headline>
				}
				content="This widget is designed to assist users who navigate primarily with a keyboard, including those with movement disorders or cognitive challenges, ensuring that they can easily understand the purpose of each interactive element."
				footer={<NewsFooter href="#/widgets/data-display/interaction-hint" anchorText="Learn more" />}
				info={<div>10.02.2025</div>}
			/>
			<NewsBox
				image={
					<ResponsiveImageContainer
						src="images/news-sample-landscape.jpg"
						alt="Resize Handler"
						title="Resize Handler"
					/>
				}
				header={
					<Typography.Headline level={3} ariaLevel={3}>
						Resize Handler
					</Typography.Headline>
				}
				content="The Resize Handler provides dynamic resizing capabilities, enabling users to adjust content area sizes with flexibility. This feature supports workspace personalization, helps prioritize specific content, and enhances usability based on user preferences or screen dimensions."
				footer={<NewsFooter href="#/widgets/layout/resize-handler" anchorText="Learn More" />}
				info={<div>10.02.2025</div>}
			/>
			<NewsBox
				image={
					<ResponsiveImageContainer
						src="images/news-sample.jpg"
						alt="Supporting Panes Layout (SPL)"
						title="Supporting Panes Layout (SPL)"
					/>
				}
				header={
					<Typography.Headline level={3} ariaLevel={3}>
						Supporting Panes Layout (SPL)
					</Typography.Headline>
				}
				content="The generic layout is used to provide a consistent and flexible structure for UI Model Editors like the Content Model Editor and SME, enhanced user context, improves information accessibility, and supports the creation of complex, multi-level UI layouts through nesting and integration with other widgets."
				footer={<NewsFooter href="#/experimental/supporting-panes-layout" anchorText="Learn More" />}
				info={<div>09.10.2024</div>}
			/>
			<NewsBox
				image={
					<ResponsiveImageContainer
						src="images/news-sample-landscape.jpg"
						alt="Interactive Tile"
						title="Interactive Tile"
					/>
				}
				header={
					<Typography.Headline level={3} ariaLevel={3}>
						Interactive Tile
					</Typography.Headline>
				}
				content="The Interactive Tile widget provides a button-like visual to present options in a familiar, interactive format, enhancing usability by making selections more intuitive and engaging, creating a better experience for users."
				footer={<NewsFooter href="#/widgets/data-display/interactive-tile" anchorText="Learn More" />}
				info={<div>09.10.2024</div>}
			/>
			<NewsBox
				image={
					<ResponsiveImageContainer src="images/news-sample.jpg" alt="Rich Text Editor" title="Rich Text Editor" />
				}
				header={
					<Typography.Headline level={3} ariaLevel={3}>
						Lexical based Rich Text Editor
					</Typography.Headline>
				}
				content="The Rich Text Editor Widget is a highly performant and accessible text editor. It supports custom plugins, prebuilt nodes, and inherits common Text Field features like states, messages and helper text."
				footer={<NewsFooter href="#/widgets/data-entry/rich-text-editor" anchorText="Learn More" />}
				info={<div>09.04.2024</div>}
			/>
		</>
	);
}
