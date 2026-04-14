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

import { joinClassNames, addPrefix } from "../../common/main/utils.js";
import { DataRoles } from "../../common/main/data-roles.js";

import type { BulletListProps } from "./bullet-list.api.js";

const baseClassName = addPrefix("bullet-list");

export const StyledBulletListContent = styled.div.withConfig({ displayName: "StyledBulletListContent-sc-" })(
	({ theme }) => {
		const { content } = theme.components.bulletList;

		return css`
			color: ${content.color};
			font-weight: normal;
		`;
	}
);

export const StyledBulletListItem = styled.li.withConfig({ displayName: "StyledBulletListItem-sc-" })(({ theme }) => {
	const { item } = theme.components.bulletList;

	return css`
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-webkit-text-size-adjust: 100%;
		color: ${item.color};
		font-weight: ${item.fontWeight};
		line-height: ${item.lineHeight};
		padding: ${item.padding};

		&:last-child {
			padding-bottom: 0;
		}
	`;
});

export const StyledBulletList = styled.ul.withConfig({ displayName: "StyledBulletList-sc-" })<{
	inline?: boolean;
	noIndent?: boolean;
	listType?: BulletListProps.UnorderedType | BulletListProps.OrderedType;
	overrideColor?: boolean;
}>(({ theme, inline, noIndent, listType, overrideColor }) => {
	const { padding, fontSize, fontFamily, columnGap, unorderedList, item } = theme.components.bulletList;

	return css`
		padding: ${padding};
		font-size: ${fontSize};
		font-family: ${fontFamily};
		& > ${StyledBulletListItem} {
			list-style-type: ${listType};
			${overrideColor && `color: ${item.overrideColor};`}
		}
		${inline &&
		css`
			display: flex;
			flex-wrap: wrap;
			column-gap: ${columnGap};
		`}
		${noIndent &&
		css`
			&& {
				padding: ${unorderedList.noIndentPadding};
			}
		`}
	`;
});
export namespace BulletList {
	export function Ordered({
		children,
		className,
		inline,
		type = "decimal",
		wrapperRef,
		...rest
	}: BulletListProps.OrderedProps): ReactElement<BulletListProps.OrderedProps> {
		const classNames = joinClassNames(
			baseClassName,
			{ [`${baseClassName}--inline`]: inline },
			`${baseClassName}--${type}`,
			className
		);

		return (
			<StyledBulletList
				as="ol"
				listType={type}
				inline={inline}
				data-role={DataRoles.OrderedBulletList}
				className={classNames}
				ref={wrapperRef}
				{...rest}
			>
				{children}
			</StyledBulletList>
		);
	}

	Ordered.displayName = "BulletList.Ordered";

	export function Unordered({
		children,
		className,
		indent = true,
		inline,
		type = "disc",
		wrapperRef,
		...rest
	}: BulletListProps.UnorderedProps): ReactElement<BulletListProps.UnorderedProps> {
		const classNames = joinClassNames(
			baseClassName,
			{ [`${baseClassName}--inline`]: inline },
			{ [`${baseClassName}--no-indent`]: !indent },
			{ [`${baseClassName}--${type}`]: type },
			className
		);

		return (
			<StyledBulletList
				overrideColor
				listType={type}
				inline={inline}
				noIndent={!indent}
				data-role={DataRoles.UnorderedBulletList}
				className={classNames}
				ref={wrapperRef}
				{...rest}
			>
				{children}
			</StyledBulletList>
		);
	}

	Unordered.displayName = "BulletList.Unordered";

	export function Item(props: BulletListProps.ItemProps): ReactElement<BulletListProps.ItemProps> {
		const { children, className, ...rest } = props;

		return (
			<StyledBulletListItem
				data-role={DataRoles.BulletList.Item}
				className={joinClassNames(`${baseClassName}__item`, className)}
				{...rest}
			>
				<StyledBulletListContent className={`${baseClassName}__content`}>{children}</StyledBulletListContent>
			</StyledBulletListItem>
		);
	}

	Item.displayName = "BulletList.Item";
}
