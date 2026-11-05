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
import { useMemo } from "react";
import type { DefaultTheme } from "styled-components";
import { css, styled, useTheme } from "styled-components";

import { getInfoPanelPalette } from "./theme.js";
import { INFO_PANEL_TYPES, type InfoPanelType } from "./utils.js";

export const StyledInfoPanelHeader = styled.div<{ $panelType: InfoPanelType }>(({ theme, $panelType }) => {
	const palette = getInfoPanelPalette(theme);

	return css`
		display: flex;
		align-items: center;
		line-height: 1.4;
		gap: ${theme.spacing.horizontalSpacing.horizWhiteSpacing2xs}px;
		color: ${palette[$panelType].accent};
		font-weight: ${theme.typography.fontWeight.boldFontWeight};
		user-select: none;
	`;
});

StyledInfoPanelHeader.displayName = "StyledInfoPanelHeader";

export const StyledInfoPanelIcon = styled.span(
	({ theme }) => css`
		direction: ltr;
		flex: none;
		font-family: "Material Symbols Outlined";
		font-feature-settings: "liga";
		font-size: 1.125em;
		font-weight: ${theme.typography.fontWeight.regularFontWeight};
		line-height: 1;
		-webkit-font-smoothing: antialiased;
	`
);

StyledInfoPanelIcon.displayName = "StyledInfoPanelIcon";

const PANEL = "[data-panel-type]";
const HEADER = "[data-panel-header]";
const CONTENT = "[data-panel-content]";
const SELECTED = '[data-selected="true"]';
const PANEL_SELECTED = `${PANEL}${SELECTED}`;

/** The block-level CSS for every panel on one editing surface. */
function buildInfoPanelCss(theme: DefaultTheme): string {
	const palette = getInfoPanelPalette(theme);
	const { spacing, applicationStyles } = theme;

	const gutterWidth = `${spacing.spacing.spacing2xs}px`;
	const paddingInline = `${spacing.horizontalSpacing.horizWhiteSpacingsm}px`;
	const headerSpacing = `${spacing.verticalSpacing.vertWhiteSpacing2xs}px`;

	const variables = [...INFO_PANEL_TYPES]
		.map(
			(panelType) => `
		[data-panel-type="${panelType}"] {
			--info-panel-accent: ${palette[panelType].accent};
			--info-panel-background: ${palette[panelType].background};
		}`
		)
		.join("");

	return `${variables}

		${PANEL} {
			background-color: var(--info-panel-background);
			border-radius: ${applicationStyles.input.borderRadius};
			cursor: default;
			margin: ${spacing.verticalSpacing.vertWhiteSpacingmd}px 0;
			padding-block: ${spacing.verticalSpacing.vertWhiteSpacingsm}px;
			padding-inline-end: ${paddingInline};
			padding-inline-start: calc(${paddingInline} + ${gutterWidth});
			position: relative;
			transition: background-color 120ms ease-out;
		}

		${PANEL}::before {
			content: "";
			width: ${gutterWidth};
			background-color: var(--info-panel-accent);
			border-end-start-radius: ${applicationStyles.input.borderRadius};
			border-start-start-radius: ${applicationStyles.input.borderRadius};
			position: absolute;
			inset-inline-start: 0;
			top: 0;
			bottom: 0;
		}

		${PANEL} > ${HEADER} {
			margin-bottom: ${headerSpacing};
			padding-bottom: ${headerSpacing};
		}

		${CONTENT} {
			cursor: text;
		}

		${CONTENT} > :first-child {
			margin-top: 0;
		}

		${CONTENT} > :last-child {
			margin-bottom: 0;
		}

		${PANEL_SELECTED} {
			background-color: color-mix(in srgb, var(--info-panel-accent) 12%, var(--info-panel-background));
			outline: 2px solid var(--info-panel-accent);
			outline-offset: 2px;
		}
	`;
}

/**
 * The panel CSS, carried in by the extension as a React decorator.
 *
 * A plain `<style>` element, not `createGlobalStyle`: styled-components keeps every
 * mounted copy of one global style in a single stylesheet group and rebuilds that whole
 * group whenever a copy comes or goes. Two editors with panels on the same page end up
 * wiping each other's rules. Its own tag belongs to this editor alone.
 */
export function InfoPanelBlockStyles(): ReactElement {
	const theme = useTheme();
	const rules = useMemo(() => buildInfoPanelCss(theme), [theme]);

	return <style>{rules}</style>;
}
