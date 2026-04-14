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

import { addPrefix, joinClassNames } from "../../../common/main/utils.js";

import {
	StyledContentBoxTitleWrapper,
	StyledContentBoxHeading,
	StyledHeadingIcon,
	StyledContentBoxContent
} from "../template/contentbox.tpl.styled.js";
import { StyledHeadingElementsWrapper } from "../template/elements/heading.tpl.view.js";
import { ContentBox, ContentBoxElements } from "../template/contentbox.tpl.view.js";

import type { TileProps } from "./tile.api.js";

const baseClassName = addPrefix("contentbox");

const StyledTile = styled(ContentBox).withConfig({ displayName: "StyledTile-sc-" })(({ theme }) => {
	const { tile } = theme.components.contentBox;

	return css`
		${StyledContentBoxHeading} {
			background-color: ${tile.heading.background};
			border-bottom: ${tile.heading.borderBottom};
			border-top: none;
			flex: 1;
			gap: ${tile.heading.gap};
			min-height: auto;
			padding-left: 0;
		}
		${StyledHeadingIcon} {
			align-items: center;
			align-self: flex-start;
			background-color: ${tile.icon.background};
			color: ${tile.icon.color};
			cursor: default;
			display: flex;
			font-size: ${tile.icon.fontSize};
			height: ${tile.icon.height};
			justify-content: center;
			user-select: none;
			width: ${tile.icon.width};
		}
		${StyledContentBoxTitleWrapper} {
			flex: 1;
			color: ${tile.title.color};
			margin: 0;
		}
		${StyledHeadingElementsWrapper} {
			&:only-child {
				margin: ${tile.title.margin};
			}
		}
		${StyledContentBoxContent} {
			padding: ${tile.content.padding};
			&:after {
				height: ${tile.content.spacingBottom};
			}
		}
	`;
});

export function Tile(props: TileProps): ReactElement {
	const className = joinClassNames(`${baseClassName}--tile`, props.className);

	return (
		<StyledTile
			id={props.id}
			className={className}
			style={props.style}
			heading={
				<ContentBoxElements.Heading color={props.color} icon={props.icon}>
					<ContentBoxElements.Title
						ariaLevel={props.ariaLevel || 2}
						text={props.title}
						style={{ color: props.color }}
					/>
				</ContentBoxElements.Heading>
			}
		>
			{props.children}
		</StyledTile>
	);
}

Tile.displayName = "Tile";
