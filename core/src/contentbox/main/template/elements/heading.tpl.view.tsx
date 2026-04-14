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

import { addPrefix, joinClassNames } from "../../../../common/main/utils.js";
import { StyledMasterDetailLayoutPane } from "../../../../layout/master-detail/main/master-detail.styled.js";
import { DataRoles } from "../../../../common/main/data-roles.js";

import type { ContentBoxProps } from "../contentbox.tpl.api.js";
import { StyledContentBoxHeading, StyledHeadingIcon, StyledContentBoxAddOn } from "../contentbox.tpl.styled.js";

import { BASE_CONTENTBOX_CLASS_NAME } from "./config.js";

const baseClassName = BASE_CONTENTBOX_CLASS_NAME;

export const StyledHeadingAffix = styled.div.withConfig({ displayName: "StyledHeadingAffix-sc-" })`
	align-items: center;
	display: flex;
	gap: ${(props): string => props.theme.components.contentBox.headingAddon.gap};
`;

export const StyledHeadingElementsWrapper = styled.div.withConfig({
	displayName: "StyledHeadingElementsWrapper-sc-"
})(({ theme }) => {
	const { heading } = theme.components.contentBox;

	return css`
		flex: 1;
		flex-direction: column;
		padding: ${heading.wrapper.padding};

		&.${addPrefix("masterDetailLayout")}Pane--enter, &.${addPrefix("masterDetailLayout")}Pane--exit {
			${StyledMasterDetailLayoutPane} & {
				flex: 1 0 auto;
			}
		}
	`;
});

export function HeadingTpl(props: ContentBoxProps.HeadingProps): ReactElement<ContentBoxProps.HeadingProps> {
	const { childrenOnly, prefixes, icon, suffixes, color, style, id, onClick, onKeyDown, children, className, ...rest } =
		props;

	return childrenOnly ? (
		<>{children}</>
	) : (
		<StyledContentBoxHeading
			className={joinClassNames(`${baseClassName}__heading`, className)}
			style={style}
			id={id}
			onClick={onClick}
			onKeyDown={onKeyDown}
			data-role={DataRoles.Contentbox.Heading}
			variantColor={color}
			{...rest}
		>
			{(prefixes || icon) && (
				<StyledHeadingAffix className={`${baseClassName}__addon-prefix`} data-role={DataRoles.Contentbox.Addon.Prefix}>
					{icon && (
						<StyledHeadingIcon className={`${baseClassName}__icon`} variantColor={color}>
							{icon}
						</StyledHeadingIcon>
					)}
					{prefixes}
				</StyledHeadingAffix>
			)}
			<StyledHeadingElementsWrapper>{children}</StyledHeadingElementsWrapper>
			{suffixes && (
				<StyledHeadingAffix className={`${baseClassName}__addon-suffix`} data-role={DataRoles.Contentbox.Addon.Suffix}>
					{suffixes}
				</StyledHeadingAffix>
			)}
		</StyledContentBoxHeading>
	);
}

HeadingTpl.displayName = "HeadingTpl";

export function HeadingAddonTpl(props: ContentBoxProps.BaseProps): ReactElement<ContentBoxProps.BaseProps> {
	const className = joinClassNames(`${baseClassName}__addon`, props.className);

	return (
		<StyledContentBoxAddOn
			className={className}
			style={props.style}
			id={props.id}
			data-role={DataRoles.Contentbox.Addon}
		>
			{props.children}
		</StyledContentBoxAddOn>
	);
}

HeadingAddonTpl.displayName = "HeadingAddonTpl";
