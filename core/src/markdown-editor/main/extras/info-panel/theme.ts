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

import type { EditorThemeClasses } from "lexical";

import type { InfoPanelType } from "./utils.js";

export interface InfoPanelTheme {
	root: string;
	header: string;
	icon: string;
	label: string;
	content: string;
	info: string;
	note: string;
	success: string;
	warning: string;
	error: string;
}

const DEFAULT_THEME: InfoPanelTheme = {
	root: "info-panel",
	header: "info-panel__header",
	icon: "info-panel__icon",
	label: "info-panel__label",
	content: "info-panel__content",
	info: "info-panel--info",
	note: "info-panel--note",
	success: "info-panel--success",
	warning: "info-panel--warning",
	error: "info-panel--error"
};

export const INFO_PANEL_THEME: EditorThemeClasses = {
	infoPanelRoot: DEFAULT_THEME.root,
	infoPanelHeader: DEFAULT_THEME.header,
	infoPanelIcon: DEFAULT_THEME.icon,
	infoPanelLabel: DEFAULT_THEME.label,
	infoPanelContent: DEFAULT_THEME.content,
	infoPanelInfo: DEFAULT_THEME.info,
	infoPanelNote: DEFAULT_THEME.note,
	infoPanelSuccess: DEFAULT_THEME.success,
	infoPanelWarning: DEFAULT_THEME.warning,
	infoPanelError: DEFAULT_THEME.error
};

function getClassName(theme: EditorThemeClasses | null | undefined, key: string, fallback: string): string {
	const renamed = theme?.[key];

	return typeof renamed === "string" ? renamed : fallback;
}

export function getInfoPanelThemeClasses(theme: EditorThemeClasses | null | undefined): InfoPanelTheme {
	return {
		root: getClassName(theme, "infoPanelRoot", DEFAULT_THEME.root),
		header: getClassName(theme, "infoPanelHeader", DEFAULT_THEME.header),
		icon: getClassName(theme, "infoPanelIcon", DEFAULT_THEME.icon),
		label: getClassName(theme, "infoPanelLabel", DEFAULT_THEME.label),
		content: getClassName(theme, "infoPanelContent", DEFAULT_THEME.content),
		info: getClassName(theme, "infoPanelInfo", DEFAULT_THEME.info),
		note: getClassName(theme, "infoPanelNote", DEFAULT_THEME.note),
		success: getClassName(theme, "infoPanelSuccess", DEFAULT_THEME.success),
		warning: getClassName(theme, "infoPanelWarning", DEFAULT_THEME.warning),
		error: getClassName(theme, "infoPanelError", DEFAULT_THEME.error)
	};
}

/** Colour tokens for one info-panel variant. */
export type InfoPanelColors = {
	background: string;

	/** Left border and header icon/label. */
	accent: string;
};

export type InfoPanelPalette = Record<InfoPanelType, InfoPanelColors>;

/** Structural, so any theme carrying these colors works. */
type PaletteSource = {
	colors: {
		background: { primaryBackground: string };
		text: { secondaryColorDark: string };
		variant: { infoColor: string; successColor: string; warningColor: string; errorColor: string };
	};
};

/**
 * Panel colors from the theme's semantic `variant` tokens, backgrounds tinted against the surface
 * so they work in light and dark. `note` has no variant, so it falls back to a neutral.
 * Built here, not in the theme config, because the panel is an extension.
 */
export function getInfoPanelPalette(theme: PaletteSource): InfoPanelPalette {
	const { colors } = theme;
	const surface = colors.background.primaryBackground;

	const make = (accent: string): InfoPanelColors => ({
		background: `color-mix(in srgb, ${accent} 10%, ${surface})`,
		accent
	});

	return {
		info: make(colors.variant.infoColor),
		note: make(colors.text.secondaryColorDark),
		success: make(colors.variant.successColor),
		warning: make(colors.variant.warningColor),
		error: make(colors.variant.errorColor)
	};
}
