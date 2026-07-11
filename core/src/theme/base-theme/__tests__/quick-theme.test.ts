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

import { describe, test, expect } from "vitest";

import { getBaseTheme } from "../base-theme.js";
import { buildQuickThemeOptions, getQuickTheme } from "../quick-theme.js";
import type { QuickThemePalette } from "../quick-theme.js";

const basePalette: QuickThemePalette = {
	primary: "#3366cc",
	surface: "#ffffff",
	pageBackground: "#f5f5f5",
	border: "#cccccc",
	textPrimary: "#222222",
	success: "#22c55e",
	warning: "#f59e0b",
	error: "#ef4444",
	info: "#38bdf8"
};

describe("quick-theme", () => {
	test("wires spacing to base spacing token", () => {
		const theme = getQuickTheme({ spacing: 14 });
		expect(theme.spacing.baseSpacing.BASE).toBe(14);
	});

	test("wires fontFamily to typography.font.MAIN_FONT", () => {
		const theme = getQuickTheme({ fontFamily: "Inter" });
		expect(theme.typography.font.MAIN_FONT).toBe("Inter");
	});

	test("wires fontSize to typography.fontSize scale", () => {
		const theme = getQuickTheme({ fontSize: 1.125 });
		expect(theme.typography.fontSize.mediumFontSize).toBe("1.125rem");
	});

	test("maps palette.primary to interaction.primaryInteractionColor", () => {
		const theme = getQuickTheme({ palette: basePalette });
		expect(theme.colors.interaction.primaryInteractionColor).toBe(basePalette.primary);
	});

	test("derives primaryHover when not supplied (differs from primary)", () => {
		const opts = buildQuickThemeOptions({ palette: basePalette });
		const hover = opts.colors?.interaction?.hover?.color as string | undefined;
		expect(hover).toBeDefined();
		expect(hover).not.toBe(basePalette.primary);
	});

	test("uses explicit primaryHover when supplied", () => {
		const opts = buildQuickThemeOptions({
			palette: { ...basePalette, primaryHover: "#ff00ff" }
		});
		expect(opts.colors?.interaction?.hover?.color).toBe("#ff00ff");
		expect(opts.colors?.interaction?.colorDark).toBe("#ff00ff");
	});

	test("returned options are spreadable; component overrides win", () => {
		const theme = getBaseTheme({
			...buildQuickThemeOptions({ palette: basePalette }),
			components: { button: { border: "2px solid red" } }
		});
		expect(theme.colors.interaction.primaryInteractionColor).toBe(basePalette.primary);
		expect(theme.components.button.border).toBe("2px solid red");
	});

	test("maps state colors to variant tokens", () => {
		const theme = getQuickTheme({ palette: basePalette });
		expect(theme.colors.variant.errorColor).toBe(basePalette.error);
		expect(theme.colors.variant.successColor).toBe(basePalette.success);
		expect(theme.colors.variant.warningColor).toBe(basePalette.warning);
		expect(theme.colors.variant.infoColor).toBe(basePalette.info);
	});
});
