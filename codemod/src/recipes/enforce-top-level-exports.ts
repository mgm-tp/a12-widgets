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

import { type Recipe, migrateImports, type ImportMigrationConfiguration } from "@com.mgmtp.a12.devtools/codemod";

const packageName = "@com.mgmtp.a12.widgets/widgets-core";
const utilsPackageName = "@com.mgmtp.a12.widgets/widgets-utils";

const migrationConfig: ImportMigrationConfiguration = {
	entityMigrations: [
		// TextLineStateless → TextField (deep paths)
		{
			from: {
				packageName,
				subPath: "/lib/input/text-line/main/template/text-line.tpl.view.js",
				entity: "TextLineStateless"
			},
			to: { subPath: "", entity: "TextField" }
		},
		{
			from: {
				packageName,
				subPath: "/lib/input/text-line/main/template/text-line.tpl.api.js",
				entity: "TextLineStatelessProps"
			},
			to: { subPath: "", entity: "TextFieldProps" }
		},
		{
			from: { packageName, subPath: "/lib/input/text-line/main/index.js", entity: "TextLineStateless" },
			to: { subPath: "", entity: "TextField" }
		},
		{
			from: { packageName, subPath: "/lib/input/text-line/main/index.js", entity: "TextLineStatelessProps" },
			to: { subPath: "", entity: "TextFieldProps" }
		},
		{
			from: { packageName, subPath: "/lib/input/text-line/index.js", entity: "TextLineStateless" },
			to: { subPath: "", entity: "TextField" }
		},
		{
			from: { packageName, subPath: "/lib/input/text-line/index.js", entity: "TextLineStatelessProps" },
			to: { subPath: "", entity: "TextFieldProps" }
		},
		{
			from: { packageName, subPath: "/lib/index.js", entity: "TextLineStateless" },
			to: { subPath: "", entity: "TextField" }
		},
		{
			from: { packageName, subPath: "/lib/index.js", entity: "TextLineStatelessProps" },
			to: { subPath: "", entity: "TextFieldProps" }
		},
		// Removed deprecated APIs — top-level barrel renames
		{ from: { packageName, subPath: "", entity: "TextLineStateless" }, to: { subPath: "", entity: "TextField" } },
		{
			from: { packageName, subPath: "", entity: "TextLineStatelessProps" },
			to: { subPath: "", entity: "TextFieldProps" }
		},
		{
			from: { packageName, subPath: "/lib/common/main/a11y-localization/index.js", entity: "IconPicker" },
			to: { subPath: "", entity: "IconPickerTitles" }
		},
		{
			from: {
				packageName,
				subPath: "/lib/common/main/a11y-localization/a11y-key-definition.api.js",
				entity: "IconPicker"
			},
			to: { subPath: "", entity: "IconPickerTitles" }
		},
		{ from: { packageName, subPath: "", entity: "Tooltip" }, to: { subPath: "", entity: "TooltipPlugin" } },
		{
			from: { packageName, subPath: "", entity: "TooltipProps" },
			to: { subPath: "", entity: "TooltipPluginProps" }
		},
		{
			from: { packageName, subPath: "", entity: "TooltipWrapperProps" },
			to: { subPath: "", entity: "TooltipPluginWrapperProps" }
		},
		{
			from: { packageName, subPath: "", entity: "commonTileConfigs" },
			to: { subPath: "", entity: "commonInteractiveTileFlatConfigs" }
		},
		{
			from: { packageName, subPath: "", entity: "BodyCell" },
			to: { subPath: "", entity: "TreeTableBodyCell" }
		},
		{
			from: { packageName, subPath: "", entity: "BodyContent" },
			to: { subPath: "", entity: "TreeTableBodyContent" }
		},
		{
			from: { packageName, subPath: "", entity: "walk" },
			to: { subPath: "", entity: "walkTreeNode" }
		}
	],
	pathMigrations: [
		{
			from: `${packageName}/lib/theme/basic.css`,
			to: `${packageName}/styles/basic.css`
		},
		{
			from: `${packageName}/lib/rich-text-editor/main/themes/rich-text-editor.css`,
			to: `${packageName}/styles/rich-text-editor.css`
		},
		{
			from: `${packageName}/lib/**/*.js`,
			to: packageName
		},
		{
			from: `${packageName}/lib/**`,
			to: packageName,
			exclude: `${packageName}/lib/**/*.css`
		},
		{
			from: `${utilsPackageName}/lib/**/*.js`,
			to: utilsPackageName
		},
		{
			from: `${utilsPackageName}/lib/**`,
			to: utilsPackageName
		}
	]
};

/**
 * Renames `DataRoles.Textline` property accesses to `DataRoles.TextField`.
 */
function migrateDataRolesTextline(text: string): string {
	return text.replace(/\bDataRoles\.Textline\b/g, "DataRoles.TextField");
}

/**
 * Replaces `"textline"` data-role string values with `"text-field"` inside string literals.
 * Covers JSX attributes, CSS selectors, and test queries.
 */
function migrateTextlineDataRoleStrings(text: string): string {
	return text.replace(/(["'`])textline\b/g, "$1text-field");
}

/**
 * Renames the `textLine` identifier to `textField`.
 * Covers `theme.components.textLine`, destructuring, and `createTheme` overrides.
 */
function migrateThemeTextLineConfig(text: string): string {
	return text.replace(/\btextLine\b/g, "textField");
}

/**
 * Renames `TextLineConfigType` and `textLineConfig` identifiers.
 */
function migrateTextLineConfigTypes(text: string): string {
	return text
		.replace(/\bTextLineConfigType\b/g, "TextFieldConfigType")
		.replace(/\btextLineConfig\b/g, "textFieldConfig");
}

const textlineMigrations = [
	migrateDataRolesTextline,
	migrateTextlineDataRoleStrings,
	migrateThemeTextLineConfig,
	migrateTextLineConfigTypes
];

export const enforceTopLevelExportsRecipe: Recipe = {
	metadata: {
		id: "enforce-top-level-exports",
		description:
			"Migrates deep lib/ imports to top-level barrel, CSS to ./styles/ paths, and TextLine APIs to TextField",
		supportedVersions: "^39.0.0"
	},

	execute(project): void {
		for (const sourceFile of project.getSourceFiles()) {
			migrateImports(sourceFile, migrationConfig);

			let text = sourceFile.getFullText();
			const original = text;

			for (const migrate of textlineMigrations) {
				text = migrate(text);
			}

			if (text !== original) {
				sourceFile.replaceWithText(text);
			}
		}
	}
};
