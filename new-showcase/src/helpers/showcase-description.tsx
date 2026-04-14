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

import type { ReactNode, ReactElement } from "react";
import { useState, useCallback, isValidElement } from "react";
import { styled, css } from "styled-components";

import { MessageBox, joinClassNames, CollapsiblePanel, BulletList, Link } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Description, FeaturedWidget } from "./definitions.js";

export interface ShowcaseDescriptionProps {
	description?: ReactNode | Description;
	mainDescription?: boolean;
	featuredWidgets?: FeaturedWidget[];
}

const StyledCollapsiblePanel = styled(CollapsiblePanel)(({ theme }) => {
	const { spacing } = theme;

	return css`
		padding: ${spacing.verticalSpacing.vertWhiteSpacingsm}px 0;
	`;
});

const StyledFeaturedWidgetDescription = styled.span(({ theme }) => {
	const { typography } = theme;

	return css`
		font-style: italic;
		font-weight: ${typography.fontWeight.regularFontWeight};
		font-size: ${typography.fontSize.smallFontSize};
	`;
});

export function ShowcaseDescription(props: ShowcaseDescriptionProps): ReactElement<ShowcaseDescriptionProps> {
	const { description, mainDescription, featuredWidgets } = props;
	const [isOpen, setIsOpen] = useState(false);

	const toggleCollapsiblePanel = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	const renderFeaturedWidgetsSection = useCallback(
		(featuredWidgets?: FeaturedWidget[]): ReactNode => {
			return (
				featuredWidgets &&
				featuredWidgets.length > 0 && (
					<StyledCollapsiblePanel title="How to build this example using our Widgets?" onClick={toggleCollapsiblePanel}>
						{isOpen && (
							<BulletList.Unordered>
								{featuredWidgets?.map((item) => {
									return (
										<BulletList.Item key={item.name}>
											<Link href={item.url}>{item.name}</Link>
											{item.description && (
												<StyledFeaturedWidgetDescription> - {item.description}</StyledFeaturedWidgetDescription>
											)}
										</BulletList.Item>
									);
								})}
							</BulletList.Unordered>
						)}
					</StyledCollapsiblePanel>
				)
			);
		},
		[isOpen, toggleCollapsiblePanel]
	);

	if (!description && !featuredWidgets) {
		return <></>;
	}

	if (
		typeof description === "object" &&
		(Object.prototype.hasOwnProperty.call(description, "info") ||
			Object.prototype.hasOwnProperty.call(description, "note") ||
			Object.prototype.hasOwnProperty.call(description, "warning"))
	) {
		const content = description as Description;

		return (
			<>
				{content.info}
				{content.note && (
					<MessageBox
						label={<strong>NOTE</strong>}
						variant="warning"
						focusOnMessage={false}
						className={joinClassNames("-u-margin-t-sm", {
							["-u-margin-b-sm"]: !content.warning && !mainDescription
						})}
					>
						{content.note}
					</MessageBox>
				)}
				{content.warning && (
					<MessageBox
						label={<strong>ATTENTION</strong>}
						focusOnMessage={false}
						className={joinClassNames("-u-margin-t-sm", { ["-u-margin-b-sm"]: !mainDescription })}
					>
						{content.warning}
					</MessageBox>
				)}
			</>
		);
	}

	return (
		<>
			{isValidElement(description) && description}
			{renderFeaturedWidgetsSection(featuredWidgets)}
		</>
	);
}
