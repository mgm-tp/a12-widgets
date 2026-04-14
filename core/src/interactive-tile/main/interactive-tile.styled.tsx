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

import { styled, css } from "styled-components";

import { Icon, StyledIconWrapper, StyledVariantIconWrapper } from "../../icon/main/icon.view.js";
import { hover as hoverSelector } from "../../theme/base/mixins/_interaction.js";
import type { DefaultThemeType } from "../../theme/schema.js";
import type { CustomBorder } from "../../theme/base/mixins/_borderEffects.js";
import { createBorder } from "../../theme/base/mixins/_borderEffects.js";

const interactionStyles = (params: {
	background: string;
	border: string;
	color: string;
	textDecoration: string;
	borderColor?: string;
	customBorder?: CustomBorder;
}) => css`
	background-color: ${params.background};
	${createBorder(params.customBorder ?? params.border)};
	border-color: ${params.borderColor};
	color: ${params.color};
	text-decoration: ${params.textDecoration};
`;

const getBaseTileVariantStyles = (params: {
	background: string;
	color: string;
	padding: string;
	icon: { color: string };
	interaction: {
		focus: {
			background: string;
			border: string;
			borderColor?: string;
			color: string;
			outline: string;
			textDecoration: string;
		};
		hover: {
			background: string;
			border: string;
			borderColor?: string;
			color: string;
			textDecoration: string;
		};
	};
}) => {
	const { interaction, background, color, padding, icon } = params;
	const { hover, focus } = interaction;

	return css`
		background: ${background};
		color: ${color};
		padding: ${padding};

		&:focus {
			outline: ${focus.outline};
			${interactionStyles(focus)};
		}

		${hover && hoverSelector(interactionStyles(hover))};

		${StyledIconWrapper}:not(${StyledVariantIconWrapper}) {
			color: ${icon.color};
		}
	`;
};

const getDisabledStyles = (params: {
	boxShadow: string;
	background: string;
	color: string;
	border: string;
	padding: string;
	icon: { color: string };
}) => {
	const { boxShadow, background, color, border, padding, icon } = params;

	return css`
		background: ${background};
		border: ${border};
		box-shadow: ${boxShadow};
		color: ${color};
		cursor: default;
		padding: ${padding};

		${StyledIconWrapper} {
			color: ${icon.color};
		}
	`;
};

const baseStyles = (params: {
	type: "primary" | "secondary";
	theme: DefaultThemeType;
	$active?: boolean;
	$selected?: boolean;
	$disabled?: boolean;
}) => {
	const { type, theme, $active, $selected, $disabled } = params;
	const { interactiveTile } = theme.components;

	return css`
		${$disabled
			? getDisabledStyles(interactiveTile[type].disabled)
			: css`
					${getBaseTileVariantStyles(interactiveTile[type])}
					${$active && getBaseTileVariantStyles(interactiveTile[type].activated)}
          ${$selected && getBaseTileVariantStyles(interactiveTile[type].selected)}
				`}
	`;
};

const getSelectedTileIconStyles = (params: {
	selected: { icon: { color: string; fontSize: string; top: string; right: string } };
}) => {
	const { selected } = params;

	return css`
		color: ${selected.icon.color};
		font-size: ${selected.icon.fontSize};
		top: ${selected.icon.top};
		right: ${selected.icon.right};
	`;
};

const selectedTileIconStyles = (params: { type: "primary" | "secondary"; theme: DefaultThemeType }) => {
	const { type, theme } = params;
	const { interactiveTile } = theme.components;

	return css`
		${getSelectedTileIconStyles(interactiveTile[type])}
	`;
};

export const StyledInteractiveTile = styled.div.withConfig({ displayName: "StyledInteractiveTile-sc-" })<{
	$primary?: boolean;
	$secondary?: boolean;
	$active?: boolean;
	$selected?: boolean;
	$disabled?: boolean;
}>(({ theme, $primary, $secondary, $active, $selected, $disabled }) => {
	// If a Tile is neither `primary` nor `secondary`, it is still styled as a secondary Tile.
	const isSecondary = $secondary || !$primary;
	const { interactiveTile } = theme.components;

	const border = $primary
		? interactiveTile.primary.border
		: $secondary
			? interactiveTile.secondary.border
			: (interactiveTile?.border ?? interactiveTile.secondary.border);

	return css`
		align-items: center;
		border: ${border};
		border-radius: ${interactiveTile.borderRadius};
		cursor: pointer;
		display: flex;
		font-family: ${interactiveTile.fontFamily};
		font-size: ${interactiveTile.fontSize};
		font-weight: ${interactiveTile.fontWeight};
		justify-content: center;
		min-height: ${interactiveTile.minHeight};
		outline: none;
		position: relative;
		text-transform: ${interactiveTile.textTransform};
		vertical-align: middle;

		${$primary &&
		css`
			box-shadow: ${interactiveTile.primary.boxShadow};
			${baseStyles({ type: "primary", theme, $active, $selected, $disabled })}
		`}

		${isSecondary &&
		css`
			${baseStyles({ type: "secondary", theme, $active, $selected, $disabled })}
		`}
	`;
});

export const StyledSelectedTileIcon = styled(Icon).withConfig({ displayName: "StyledSelectedTileIcon-sc-" })<{
	$primary?: boolean;
	$secondary?: boolean;
}>(({ theme, $primary, $secondary }) => {
	// If a Tile is neither `primary` nor `secondary`, it is still styled as a secondary Tile.
	const isSecondary = $secondary || !$primary;

	return css`
		position: absolute;

		${$primary &&
		css`
			${selectedTileIconStyles({ type: "primary", theme })};
		`}

		${isSecondary &&
		css`
			${selectedTileIconStyles({ type: "secondary", theme })};
		`}
	`;
});
