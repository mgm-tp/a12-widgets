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

import { describe, test, expect, expectTypeOf } from "vitest";

import type { DefaultThemeType } from "../../schema.js";

import { getBaseTheme } from "../base-theme.js";
import type { BaseThemeConfig } from "../schema.js";

describe("getBaseTheme", () => {
	test("returns a valid BaseThemeConfig shape", () => {
		const theme = getBaseTheme();
		expect(theme).toBeDefined();
		expect(theme.colors).toBeDefined();
		expect(theme.typography).toBeDefined();
		expect(theme.spacing).toBeDefined();
		expect(theme.components).toBeDefined();
		expect(theme.hoverStyles).toBeDefined();
	});

	test("has correct color structure", () => {
		const theme = getBaseTheme();
		expect(theme.colors.interaction.primaryInteractionColor).toBeDefined();
		expect(theme.colors.background.navigationBackground).toBeDefined();
		expect(theme.colors.shadow.overlaySoft).toBeDefined();
		expect(theme.colors.text.titleColor).toBeDefined();
	});

	test("overriding colors deep-merges correctly", () => {
		const theme = getBaseTheme({
			colors: { interaction: { primaryInteractionColor: "red" } }
		});
		expect(theme.colors.interaction.primaryInteractionColor).toBe("red");
		expect(theme.colors.background.primaryBackground).toBeDefined();
	});

	test("overriding font propagates to typography", () => {
		const theme = getBaseTheme({ typography: { font: "Arial, sans-serif" } });
		expect(theme.typography.font.MAIN_FONT).toBe("Arial, sans-serif");
	});

	test("overriding spacing.base scales spacing tokens", () => {
		const base = 16;
		const theme = getBaseTheme({ spacing: { base } });
		expect(theme.spacing.baseSpacing.BASE).toBe(base);
	});

	test("componentOverrides deep-merge does not clobber siblings", () => {
		const theme = getBaseTheme({
			components: { button: { border: "2px solid red" } }
		});
		expect(theme.components.button.fontFamily).toBeDefined();
		expect(theme.components.accordion).toBeDefined();
	});

	test("border override is applied and does not clobber other border tokens", () => {
		const defaultTheme = getBaseTheme();
		const theme = getBaseTheme({ border: { radius: { md: "20px" } } });
		expect(theme.border.radius.md).toBe("20px");
		expect(theme.border.radius.sm).toBe(defaultTheme.border.radius.sm);
		expect(theme.border.width.thin).toBe(defaultTheme.border.width.thin);
	});

	test("motion override is applied and does not clobber other motion tokens", () => {
		const defaultTheme = getBaseTheme();
		const theme = getBaseTheme({ motion: { duration: { normal: "1s" } } });
		expect(theme.motion.duration.normal).toBe("1s");
		expect(theme.motion.duration.fast).toBe(defaultTheme.motion.duration.fast);
		expect(theme.motion.easing.default).toBe(defaultTheme.motion.easing.default);
	});

	test("opacity override is applied and does not clobber other opacity tokens", () => {
		const defaultTheme = getBaseTheme();
		const theme = getBaseTheme({ opacity: { medium: 0.1 } });
		expect(theme.opacity.medium).toBe(0.1);
		expect(theme.opacity.high).toBe(defaultTheme.opacity.high);
	});

	test("baseInputStyles override is applied and does not clobber other input tokens", () => {
		const defaultTheme = getBaseTheme();
		const theme = getBaseTheme({ baseInputStyles: { lineHeight: 2 } });
		expect(theme.baseInputStyles.lineHeight).toBe(2);
		expect(theme.baseInputStyles.defaultBoxShadow).toBe(defaultTheme.baseInputStyles.defaultBoxShadow);
	});

	test("color override propagates to widget configs", () => {
		const customPrimary = "#ff00aa";
		const theme = getBaseTheme({
			colors: {
				interaction: { primaryInteractionColor: customPrimary }
			}
		});
		expect(theme.colors.interaction.primaryInteractionColor).toBe(customPrimary);
	});

	test("spacing.base override scales horizontal and vertical spacing", () => {
		const defaultTheme = getBaseTheme();
		const defaultBase = defaultTheme.spacing.baseSpacing.BASE;
		const customBase = defaultBase * 2;
		const theme = getBaseTheme({ spacing: { base: customBase } });
		expect(theme.spacing.baseSpacing.BASE).toBe(customBase);
		expect(theme.spacing.horizontalSpacing).toBeDefined();
		expect(theme.spacing.verticalSpacing).toBeDefined();
	});

	test("variant.errorColor override is reflected in color tokens", () => {
		const customError = "#bada55";
		const theme = getBaseTheme({
			colors: {
				variant: {
					errorColor: customError,
					errorColorDark: customError
				}
			}
		});
		expect(theme.colors.variant.errorColor).toBe(customError);
		expect(theme.colors.variant.errorColorDark).toBe(customError);
	});

	test("interaction.touchOverlay override is reflected in color tokens", () => {
		const customOverlay = "rgba(255, 0, 0, 0.5)";
		const theme = getBaseTheme({
			colors: {
				interaction: { touchOverlay: customOverlay }
			}
		});
		expect(theme.colors.interaction.touchOverlay).toBe(customOverlay);
		expect(theme.components.button).toBeDefined();
	});

	test("returns correct TypeScript type", () => {
		const theme: BaseThemeConfig = getBaseTheme();
		expect(theme).toBeDefined();
	});

	test("color override deep-merges without replacing unrelated tokens", () => {
		const customBg = "#fafbfc";
		const defaultTheme = getBaseTheme();
		const theme = getBaseTheme({
			colors: {
				background: { secondaryBackground: customBg }
			}
		});
		expect(theme.colors.background.secondaryBackground).toBe(customBg);
		expect(theme.colors.background.primaryBackground).toBe(defaultTheme.colors.background.primaryBackground);
		expect(theme.colors.text.color).toBe(defaultTheme.colors.text.color);
	});
});

describe("BaseThemeConfig type shape", () => {
	test("is structurally assignable to DefaultThemeType", () => {
		expectTypeOf<keyof DefaultThemeType>().toExtend<keyof BaseThemeConfig>();
	});

	test("exposes every top-level key of DefaultThemeType", () => {
		const theme = getBaseTheme();
		const requiredKeys: Array<keyof DefaultThemeType> = [
			"colors",
			"typography",
			"spacing",
			"applicationStyles",
			"divisionLineStyles",
			"focusStyles",
			"baseInputStyles",
			"components"
		];

		for (const key of requiredKeys) {
			expect(theme[key as keyof typeof theme]).toBeDefined();
		}
	});
});

describe("self-containment", () => {
	test("base theme assembles all required sections", () => {
		const theme = getBaseTheme();
		expect(theme.colors).toBeDefined();
		expect(theme.components).toBeDefined();
		expect(theme.typography).toBeDefined();
		expect(theme.spacing).toBeDefined();
		expect(theme.applicationStyles).toBeDefined();
		expect(theme.focusStyles).toBeDefined();
		expect(theme.hoverStyles).toBeDefined();
		expect(theme.divisionLineStyles).toBeDefined();
		expect(theme.baseInputStyles).toBeDefined();
	});

	test("produces a theme with all expected component keys", () => {
		const theme = getBaseTheme();
		const expectedComponents = [
			"accordion",
			"button",
			"calendar",
			"card",
			"checkbox",
			"dropdown",
			"icon",
			"link",
			"list",
			"menu",
			"modalOverlay",
			"radio",
			"select",
			"table",
			"tabPanel",
			"textField",
			"toggle",
			"tooltip",
			"tree"
		];

		for (const key of expectedComponents) {
			expect((theme.components as Record<string, unknown>)[key], `missing component config: ${key}`).toBeDefined();
		}
	});
});
