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

import { useState } from "react";
import { ThemeProvider } from "styled-components";

import { getBaseTheme, getQuickTheme, Checkbox } from "@com.mgmtp.a12.widgets/widgets-core";
import type { QuickThemePalette } from "@com.mgmtp.a12.widgets/widgets-core";

import { ConfigurationView } from "../../helpers/configuration-view.js";

import { MasterDetailExample } from "../examples/master-detail/master-detail.js";

const FONT = "Inter, sans-serif";

const darkIndigoPalette: QuickThemePalette = {
	primary: "#818CF8",
	primaryHover: "#6366F1",
	primaryActive: "#4F46E5",
	primaryLight: "#1E1B4B",
	primaryTint: "#1A1748",
	surface: "#13112D",
	pageBackground: "#0A0917",
	groupBackground: "#1C1A3F",
	navigationBackground: "#0F0E24",
	navigationAccent: "#818CF8",
	border: "#2C2A55",
	borderSubtle: "#1A1840",
	textPrimary: "#E9EAF8",
	textSecondary: "#8B8CB8",
	textTitle: "#F2F3FF",
	success: "#22C55E",
	warning: "#F59E0B",
	error: "#EF4444",
	info: "#38BDF8"
};

// getQuickTheme builds a fully typed theme from your palette.
// Any token you omit falls back to the built-in default value.
export const darkIndigoTheme = getQuickTheme({ fontFamily: FONT, palette: darkIndigoPalette });

// getBaseTheme() returns the built-in default light theme, no configuration needed.
export const baseTheme = getBaseTheme();

export function ThemePreviewDemo() {
	const [isDark, setIsDark] = useState(false);
	const theme = isDark ? darkIndigoTheme : baseTheme;

	return (
		<ConfigurationView
			configuration={
				<Checkbox
					label="Dark theme"
					title="Toggle dark theme"
					checked={isDark}
					onChange={setIsDark}
					fitToParent={false}
				/>
			}
		>
			<ThemeProvider theme={theme}>
				<div style={{ height: "600px", width: "100%" }}>
					<MasterDetailExample />
				</div>
			</ThemeProvider>
		</ConfigurationView>
	);
}
